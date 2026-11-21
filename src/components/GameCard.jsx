import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';

export default function GameCard({ game }) {
  const { isFavorite, toggleFavorite } = useStore();
  const fav = isFavorite(game.id);

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-arcade-canvas/90 border border-white/10 hover:border-arcade-cyan/60 hover:shadow-cardGlow transition-all duration-300 flex flex-col justify-between backdrop-blur-sm">
      <Link to={`/play/${game.id}`} className="block flex-1">
        <div className="relative aspect-[16/10] bg-gradient-to-br from-arcade-panel via-arcade-canvas to-arcade-bg flex items-center justify-center overflow-hidden">
          {game.thumbnail ? (
            <img
              src={game.thumbnail}
              alt={game.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <span className="font-display text-4xl text-arcade-cyan drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]">
                {game.title ? game.title.slice(0, 2).toUpperCase() : 'GM'}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            {game.isMultiplayer && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-arcade-pink/90 text-white shadow-neonPink">
                ⚔ Multiplayer
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-arcade-cyan border border-arcade-cyan/30 shadow-sm">
              {game.orientation === 'landscape' ? '⬌ Landscape' : '⬍ Portrait'}
            </span>
          </div>
        </div>

        <div className="p-3.5">
          <div className="font-display text-sm font-semibold text-white group-hover:text-arcade-cyan transition-colors truncate">
            {game.title}
          </div>
          <p className="text-xs text-arcade-muted line-clamp-1 mt-1 leading-relaxed">
            {game.description || `${game.category} browser game`}
          </p>
          <div className="text-[11px] text-arcade-muted flex items-center gap-2 mt-2.5 pt-2 border-t border-white/5">
            <span className="w-2 h-2 rounded-full bg-arcade-lime animate-pulse"></span>
            <span className="font-medium text-white/80">{game.category || 'Arcade'}</span>
            <span className="text-white/20">•</span>
            <span className="text-arcade-muted">HTML5 Web</span>
          </div>
        </div>
      </Link>

      <button
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(game.id);
        }}
        className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 text-base flex items-center justify-center transition active:scale-90 ${
          fav ? 'text-arcade-gold drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-white/70 hover:text-white'
        }`}
      >
        {fav ? '★' : '☆'}
      </button>
    </div>
  );
}
