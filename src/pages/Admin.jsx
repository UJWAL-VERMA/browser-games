import { useState } from 'react';
import { addDoc, collection, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../lib/firebase';
import { useStore } from '../lib/store';
import { useToast } from '../lib/toast';
import { useCatalog, saveCustomLocalGame, deleteCustomLocalGame } from '../lib/catalog';

const empty = { title: '', url: '', category: 'Action', description: '', orientation: 'portrait', thumbnail: '' };

function validUrl(value, { optional = false } = {}) {
  if (!value && optional) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function Admin() {
  const { user } = useStore();
  const toast = useToast();
  const { games } = useCatalog();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast('Title is required.', 'error');
    if (!validUrl(form.url)) return toast('Playable Web URL must be a valid http or https link.', 'error');
    if (!validUrl(form.thumbnail, { optional: true })) return toast('Thumbnail URL must be a valid link.', 'error');

    setSaving(true);
    const newGameData = {
      ...form,
      title: form.title.trim(),
      url: form.url.trim(),
      thumbnail: form.thumbnail.trim(),
      kind: 'online',
    };

    try {
      if (firebaseEnabled && db) {
        await addDoc(collection(db, 'games'), {
          ...newGameData,
          createdAt: serverTimestamp(),
          createdBy: user?.uid || 'admin',
        });
        toast('Game published to cloud! It is now live on Website, Android, and iOS.', 'success');
      } else {
        // Fallback: save to local catalog storage immediately so you can add games without waiting for Firebase setup
        const id = 'game_' + Date.now();
        saveCustomLocalGame({ id, ...newGameData, createdAt: Date.now() });
        toast('Game added successfully! Live in your game library now.', 'success');
      }
      setForm(empty);
    } catch (err) {
      // If Firestore fails (e.g. permission or network), fallback to saving locally
      const id = 'game_' + Date.now();
      saveCustomLocalGame({ id, ...newGameData, createdAt: Date.now() });
      toast('Saved locally to your games list.', 'success');
      setForm(empty);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (gameId) => {
    if (!confirm('Are you sure you want to remove this game?')) return;
    try {
      if (firebaseEnabled && db) {
        await deleteDoc(doc(db, 'games', gameId)).catch(() => {});
      }
      deleteCustomLocalGame(gameId);
      toast('Game removed.', 'info');
    } catch {
      deleteCustomLocalGame(gameId);
      toast('Game removed.', 'info');
    }
  };

  const field = 'w-full rounded-lg bg-arcade-bg border border-arcade-cyan/30 px-3 py-2 text-sm outline-none focus:border-arcade-pink text-white';

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-arcade-gold text-2xl">Manage Online Games</h1>
          <p className="text-xs text-white/50 mt-1">Add any playable HTML5 web link to display it in the app.</p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-arcade-panel border border-arcade-pink/30 shadow-lg mb-8">
        <h2 className="font-display text-arcade-cyan text-base mb-4">Add New Online Game</h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="text-xs text-white/70">Game Title *
            <input className={field} value={form.title} onChange={set('title')} placeholder="e.g. Neon Rider, 2048, Poki Runner" required />
          </label>

          <label className="text-xs text-white/70">Playable Web URL *
            <input className={field} value={form.url} onChange={set('url')} placeholder="https://example.com/play" required />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-white/70">Category
              <select className={field} value={form.category} onChange={set('category')}>
                {['Action', 'Arcade', 'Puzzle', 'Retro', 'Strategy', 'Sports'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="text-xs text-white/70">Orientation
              <select className={field} value={form.orientation} onChange={set('orientation')}>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </label>
          </div>

          <label className="text-xs text-white/70">Description
            <textarea className={field} rows={2} value={form.description} onChange={set('description')} placeholder="Short instructions or game summary..." />
          </label>

          <label className="text-xs text-white/70">Thumbnail Image URL (optional)
            <input className={field} value={form.thumbnail} onChange={set('thumbnail')} placeholder="https://images... (cover photo URL)" />
          </label>

          <button disabled={saving} className="rounded-lg bg-arcade-pink hover:bg-arcade-pink/90 py-3 font-display text-sm shadow-neonPink text-white transition disabled:opacity-50 mt-2">
            {saving ? 'Adding Game…' : '+ Add Game to Ecosystem'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-arcade-lime text-base mb-3">Your Configured Games ({games.length})</h2>
        {games.length === 0 ? (
          <div className="p-8 text-center text-white/40 border border-dashed border-white/10 rounded-xl text-xs">
            No games added yet. Use the form above to add your first online game link!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {games.map((g) => (
              <div key={g.id} className="flex items-center justify-between p-3 rounded-xl bg-arcade-panel border border-white/10">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded bg-arcade-bg flex items-center justify-center font-display text-arcade-cyan text-xs shrink-0 overflow-hidden">
                    {g.thumbnail ? <img src={g.thumbnail} alt="" className="w-full h-full object-cover" /> : g.title.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="font-display text-sm text-white truncate">{g.title}</p>
                    <p className="text-xs text-white/50 truncate max-w-xs">{g.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(g.id)} className="text-xs text-arcade-pink hover:underline px-2 py-1">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
