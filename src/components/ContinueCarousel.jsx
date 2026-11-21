import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';

export default function ContinueCarousel({ games }) {
  const { history } = useStore();
  const recent = Object.entries(history)
    .sort((a, b) => b[1].lastPlayed - a[1].lastPlayed)
    .map(([id, meta]) => ({ game: games.find((g) => g.id === id), meta }))
    .filter((x) => x.game)
    .slice(0, 8);

  if (!recent.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">⚡</span>
        <h2 className="font-display text-sm font-bold tracking-wide uppercase text-arcade-gold drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
          Continue Playing
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto snap-x pb-2 -mx-4 px-4 scrollbar-none">
        {recent.map(({ game, meta }) => (
          <Link
            key={game.id}
            to={`/play/${game.id}`}
            className="group snap-start shrink-0 w-60 flex items-center gap-3 rounded-xl bg-arcade-canvas/90 border border-white/10 hover:border-arcade-cyan/60 p-2.5 transition-all duration-300 hover:shadow-cardGlow backdrop-blur"
          >
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-lg bg-arcade-panel overflow-hidden shrink-0 flex items-center justify-center border border-white/10">
              {game.thumbnail ? (
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="font-display text-base text-arcade-cyan">
                  {game.title ? game.title.slice(0, 2).toUpperCase() : 'GM'}
                </span>
              )}
            </div>

            {/* Game Info */}
            <div className="flex-1 min-w-0">
              <div className="font-display text-xs font-bold text-white group-hover:text-arcade-cyan transition-colors truncate">
                {game.title}
              </div>
              <div className="text-[11px] text-arcade-muted flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-arcade-lime"></span>
                <span>{game.category || 'Online'}</span>
              </div>
            </div>

            {/* Play Button Icon */}
            <div className="w-7 h-7 rounded-full bg-arcade-cyan/15 group-hover:bg-arcade-cyan text-arcade-cyan group-hover:text-arcade-bg flex items-center justify-center text-xs font-bold transition shrink-0">
              ▶
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
