import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export const CATEGORIES = ['All', 'Multiplayer', 'Action', 'Shooter', 'Voxel 3D', 'Arcade', 'Simulation', 'Battle Royale', 'Strategy'];

const LOCAL_GAMES_KEY = 'bg_custom_games_v3';

// Resolver to guarantee images load across GitHub Pages subpaths, custom domains, and native mobile apps
export function resolveThumbnail(thumb) {
  if (!thumb) return null;
  if (thumb.startsWith('http://') || thumb.startsWith('https://') || thumb.startsWith('data:')) {
    return thumb;
  }
  // Strip leading slash if present for relative path resolution
  const clean = thumb.startsWith('/') ? thumb.slice(1) : thumb;
  return `${import.meta.env.BASE_URL}${clean}`;
}

// Handpicked, high-production 3D browser games (Mobile + Web optimized)
export const INITIAL_ONLINE_GAMES = [
  {
    id: 'game-fightkaro',
    kind: 'online',
    title: 'Sansad Showdown (FightKaro)',
    category: 'Action',
    isMultiplayer: true,
    url: 'https://fightkaro.com/',
    description: 'A fast 3D satirical fighting game featuring political caricatures in an epic showdown arena with 3D combat moves and special animations.',
    orientation: 'landscape',
    thumbnail: 'fightkaro-thumb.png',
  },
  {
    id: 'game-smashkarts',
    kind: 'online',
    title: 'Smash Karts 3D',
    category: 'Arcade',
    isMultiplayer: true,
    url: 'https://smashkarts.io/',
    description: 'Fast 3D multiplayer battle arena kart racing game. Drive karts, pick up mystery boxes, launch rockets, and battle other players across vibrant tracks.',
    orientation: 'landscape',
    thumbnail: 'smashkarts-thumb.jpg',
  },
  {
    id: 'game-bloxd',
    kind: 'online',
    title: 'Bloxd.io - Voxel Worlds & Parkour',
    category: 'Voxel 3D',
    isMultiplayer: true,
    url: 'https://bloxd.io/',
    description: 'Stunning online 3D voxel sandbox game with rich parkour obby modes, Bedwars, peaceful building, and creative multiplayer worlds.',
    orientation: 'landscape',
    thumbnail: 'bloxd-thumb.jpg',
  },
  {
    id: 'game-krunker',
    kind: 'online',
    title: 'Krunker.io - Fast FPS',
    category: 'Shooter',
    isMultiplayer: true,
    url: 'https://krunker.io/',
    description: 'Fast-paced first-person shooter browser game with pixelated graphics, multiplayer action, slide-hopping movement, and full custom game modes.',
    orientation: 'landscape',
    thumbnail: 'krunker-thumb.jpg',
  },
  {
    id: 'game-survev',
    kind: 'online',
    title: 'Survev.io - 2D Battle Royale',
    category: 'Battle Royale',
    isMultiplayer: true,
    url: 'https://survev.io/',
    description: 'Intense top-down 2D battle royale action. Scavenge weapons, shields, and ammunition while escaping the shrinking red hazard zone to be the last survivor.',
    orientation: 'landscape',
    thumbnail: 'survev-thumb.jpg',
  },
  {
    id: 'game-evio',
    kind: 'online',
    title: 'Ev.io - Futuristic Arena Shooter',
    category: 'Shooter',
    isMultiplayer: true,
    url: 'https://ev.io/',
    description: 'Futuristic Halo-inspired browser tactical FPS set in sci-fi environments with tactical abilities, jump pads, and competitive multiplayer lobbies.',
    orientation: 'landscape',
    thumbnail: 'evio-thumb.jpg',
  },
  {
    id: 'game-slowroads',
    kind: 'online',
    title: 'Slow Roads - Endless Driving',
    category: 'Simulation',
    isMultiplayer: false,
    url: 'https://slowroads.io/#A2-c76e418d@21.59',
    description: 'An endless procedural driving browser game set in serene natural landscapes. Cruise smoothly down mountain passes and scenic highways with soothing visuals.',
    orientation: 'landscape',
    thumbnail: 'slowroads-thumb.jpg',
  },
];

export function getCustomLocalGames() {
  try {
    const raw = localStorage.getItem(LOCAL_GAMES_KEY);
    if (!raw) return INITIAL_ONLINE_GAMES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_ONLINE_GAMES;

    const existingIds = new Set(parsed.map((g) => g.id));
    const merged = [...parsed];
    for (const initGame of INITIAL_ONLINE_GAMES) {
      if (!existingIds.has(initGame.id)) {
        merged.push(initGame);
      }
    }
    return merged;
  } catch {
    return INITIAL_ONLINE_GAMES;
  }
}

export function saveCustomLocalGame(newGame) {
  const current = getCustomLocalGames();
  const updated = [newGame, ...current.filter((g) => g.id !== newGame.id)];
  localStorage.setItem(LOCAL_GAMES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('custom-games-updated'));
  return updated;
}

export function deleteCustomLocalGame(gameId) {
  const current = getCustomLocalGames();
  const updated = current.filter((g) => g.id !== gameId);
  localStorage.setItem(LOCAL_GAMES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('custom-games-updated'));
  return updated;
}

export function useCatalog() {
  const [online, setOnline] = useState([]);
  const [localGames, setLocalGames] = useState(getCustomLocalGames);

  useEffect(() => {
    const handleUpdate = () => setLocalGames(getCustomLocalGames());
    window.addEventListener('custom-games-updated', handleUpdate);
    return () => window.removeEventListener('custom-games-updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'games'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        setOnline(
          snap.docs.map((d) => ({
            id: d.id,
            kind: 'online',
            ...d.data(),
          }))
        );
      },
      () => setOnline([])
    );
  }, []);

  const games = useMemo(() => {
    const map = new Map();
    localGames.forEach((g) => map.set(g.id, { ...g, kind: 'online' }));
    online.forEach((g) => map.set(g.id, { ...g, kind: 'online' }));
    return Array.from(map.values());
  }, [online, localGames]);

  const byId = useMemo(() => Object.fromEntries(games.map((g) => [g.id, g])), [games]);

  return { games, byId };
}

export function filterGames(games, { query = '', category = null }) {
  const q = query.trim().toLowerCase();
  return games.filter((g) => {
    const matchesQuery = !q || g.title?.toLowerCase().includes(q) || (g.description || '').toLowerCase().includes(q);
    if (category === 'Multiplayer') {
      return matchesQuery && (g.isMultiplayer || g.category === 'Battle Royale' || g.category === 'Shooter' || g.category === 'Voxel 3D' || g.category === 'Arcade');
    }
    const matchesCategory = !category || category === 'All' || g.category === category;
    return matchesQuery && matchesCategory;
  });
}
