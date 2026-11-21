import { NavLink, Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { loginWithGoogle, logout, firebaseEnabled } from '../lib/firebase';
import { useToast } from '../lib/toast';

const links = [
  { to: '/', label: 'Home', icon: '🎮' },
  { to: '/favorites', label: 'Favorites', icon: '★' },
  { to: '/history', label: 'History', icon: '🕘' },
  { to: '/admin', label: 'Add Game', icon: '➕' },
];

export function TopNav() {
  const { user } = useStore();
  const toast = useToast();

  const login = async () => {
    try {
      await loginWithGoogle();
      toast('Signed in. Your data now syncs across devices.', 'success');
    } catch (e) {
      toast(e.message || 'Sign-in failed', 'error');
    }
  };

  return (
    <header className="hidden md:flex sticky top-0 z-40 items-center gap-6 px-8 h-16 bg-arcade-panel/70 backdrop-blur-md border-b border-white/10 shadow-sm">
      <Link to="/" className="flex items-center gap-2.5 group">
        <span className="text-2xl">🕹️</span>
        <span className="font-display text-xl text-white tracking-wide group-hover:text-arcade-pink transition-colors drop-shadow-[0_0_12px_rgba(255,61,139,0.5)]">
          BROWSER GAMES
        </span>
      </Link>
      <nav className="flex gap-2 ml-4">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `text-sm font-medium px-3.5 py-1.5 rounded-lg transition ${
                isActive
                  ? 'bg-arcade-cyan/20 text-arcade-cyan font-bold shadow-sm'
                  : 'text-arcade-muted hover:text-white hover:bg-white/5'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        {firebaseEnabled && (user ? (
          <button onClick={logout} className="text-xs text-arcade-muted hover:text-white px-3 py-1.5 rounded border border-white/10">
            Sign out
          </button>
        ) : (
          <button onClick={login} className="text-xs font-semibold rounded-lg px-3.5 py-1.5 bg-arcade-cyan/15 border border-arcade-cyan text-arcade-cyan hover:bg-arcade-cyan/25 transition">
            Sign in
          </button>
        ))}
      </div>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex justify-around items-center h-16 pb-[env(safe-area-inset-bottom)] bg-arcade-panel/90 backdrop-blur-lg border-t border-white/10 shadow-lg">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-[11px] font-medium transition ${
              isActive ? 'text-arcade-cyan font-bold scale-105' : 'text-arcade-muted hover:text-white'
            }`
          }
        >
          <span className="text-xl leading-none mb-0.5">{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
