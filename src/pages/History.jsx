import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useCatalog } from '../lib/catalog';

export default function History() {
  const { history } = useStore();
  const { byId } = useCatalog();
  const rows = Object.entries(history)
    .sort((a, b) => b[1].lastPlayed - a[1].lastPlayed)
    .filter(([id]) => byId[id]);

  return (
    <div className="px-4 md:px-8 py-4 pb-24 md:pb-8 max-w-3xl mx-auto">
      <h1 className="font-display text-arcade-gold text-2xl mb-4">History</h1>
      {rows.length ? (
        <ul className="divide-y divide-white/10">
          {rows.map(([id, meta]) => (
            <li key={id} className="py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <Link to={`/play/${id}`} className="font-display text-sm text-arcade-cyan truncate block">{byId[id].title}</Link>
                <div className="text-xs text-white/50">
                  {new Date(meta.lastPlayed).toLocaleString()} · {meta.plays} play{meta.plays === 1 ? '' : 's'}
                </div>
              </div>
              <div className="text-sm text-arcade-lime">Best {meta.best ?? '—'}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-white/50">Games you play will show up here.</p>
      )}
    </div>
  );
}
