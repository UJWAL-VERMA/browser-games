import { useParams, Link } from 'react-router-dom';
import { useCatalog } from '../lib/catalog';
import GamePlayer from '../components/GamePlayer';

export default function Play() {
  const { id } = useParams();
  const { byId, games } = useCatalog();
  const game = byId[id];

  if (!game && games.length) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">That game is not available.</p>
        <Link to="/" className="text-arcade-cyan">Back to games</Link>
      </div>
    );
  }
  if (!game) return <div className="p-8 text-white/50">Loading…</div>;

  return (
    <div className="h-[calc(100vh-4rem-env(safe-area-inset-bottom))] md:h-[calc(100vh-4rem)] pb-16 md:pb-0">
      <GamePlayer game={game} />
    </div>
  );
}
