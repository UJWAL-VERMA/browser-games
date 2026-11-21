import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog, filterGames, CATEGORIES } from '../lib/catalog';
import ContinueCarousel from '../components/ContinueCarousel';
import GameCard from '../components/GameCard';

export default function Home() {
  const { games } = useCatalog();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const list = useMemo(() => filterGames(games, { query, category }), [games, query, category]);

  return (
    <div className="px-4 md:px-8 py-5 pb-24 md:pb-8 max-w-6xl mx-auto">
      {/* Search Input */}
      <div className="mb-5">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search browser games by name or description..."
            className="w-full rounded-2xl bg-arcade-canvas/80 border border-white/10 px-5 py-3.5 text-sm outline-none focus:border-arcade-cyan focus:shadow-neonCyan text-white placeholder-arcade-muted transition shadow-sm backdrop-blur"
          />
          <span className="absolute right-4 top-3.5 text-arcade-muted text-base">🔍</span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(category === c ? null : c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium border transition ${
              category === c || (c === 'All' && category === null)
                ? 'bg-arcade-cyan text-arcade-bg font-bold border-arcade-cyan shadow-sm'
                : 'border-white/10 bg-arcade-canvas/60 text-arcade-muted hover:border-white/30 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {!query && !category && games.length > 0 && <ContinueCarousel games={games} />}

      <div className="flex items-center justify-between mb-4 mt-2">
        <div>
          <h2 className="font-display text-lg font-bold text-white tracking-wide">
            {category ? `${category} Games` : 'Featured Browser Games'}
          </h2>
          <p className="text-xs text-arcade-muted">Playable directly in-app or browser</p>
        </div>
        <Link
          to="/admin"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-arcade-pink/15 text-arcade-pink border border-arcade-pink/30 hover:bg-arcade-pink/25 transition shadow-sm"
        >
          + Add New Game
        </Link>
      </div>

      {list.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {list.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      ) : (
        <div className="text-center py-14 px-4 rounded-2xl border border-dashed border-white/15 bg-arcade-canvas/30 backdrop-blur">
          <p className="text-sm font-semibold text-white/80 mb-1">No matching games found.</p>
          <p className="text-xs text-arcade-muted mb-4">You can add your own custom web game URL right now.</p>
          <Link
            to="/admin"
            className="inline-block px-5 py-2.5 rounded-xl bg-arcade-pink text-white text-xs font-bold shadow-neonPink hover:bg-arcade-pink/90 transition"
          >
            + Add Game
          </Link>
        </div>
      )}
    </div>
  );
}
