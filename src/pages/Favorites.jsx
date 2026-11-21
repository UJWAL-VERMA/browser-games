import { useStore } from '../lib/store';
import { useCatalog } from '../lib/catalog';
import GameCard from '../components/GameCard';

export default function Favorites() {
  const { favorites } = useStore();
  const { byId } = useCatalog();
  const list = favorites.map((id) => byId[id]).filter(Boolean);
  return (
    <div className="px-4 md:px-8 py-4 pb-24 md:pb-8 max-w-6xl mx-auto">
      <h1 className="font-display text-arcade-gold text-2xl mb-4">My Favorites</h1>
      {list.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {list.map((g) => <GameCard key={g.id} game={g} />)}
        </div>
      ) : (
        <p className="text-sm text-white/50">Tap the star on any game to save it here.</p>
      )}
    </div>
  );
}
