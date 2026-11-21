import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { db, firebaseEnabled, watchUser } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

// Local-first store: everything is saved to localStorage immediately.
// When a user is signed in and Firebase is configured, the same data is mirrored
// to /users/{uid} so Web, Android and iOS stay in sync.
const LOCAL_KEY = 'bg_user_data_v1';
const MAX_HISTORY = 30;

const emptyData = { favorites: [], history: {} };

function readLocal() {
  try {
    return { ...emptyData, ...JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') };
  } catch {
    return { ...emptyData };
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [data, setData] = useState(readLocal);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const skipNextPush = useRef(false);

  // Persist locally on every change.
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  }, [data]);

  // Auth state and admin check.
  useEffect(() => {
    return watchUser(async (u) => {
      setUser(u);
      if (!u || !db) {
        setIsAdmin(false);
        return;
      }
      const adminSnap = await getDoc(doc(db, 'admins', u.uid));
      setIsAdmin(adminSnap.exists());
    });
  }, []);

  // Pull the cloud copy when signed in, and keep it live.
  useEffect(() => {
    if (!user || !db) return;
    const ref = doc(db, 'users', user.uid);
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const cloud = snap.data();
        skipNextPush.current = true;
        setData({ ...emptyData, ...cloud });
      }
    });
  }, [user]);

  // Push local changes to the cloud when signed in.
  useEffect(() => {
    if (!user || !db) return;
    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }
    setDoc(doc(db, 'users', user.uid), data, { merge: true }).catch(() => {});
  }, [data, user]);

  const toggleFavorite = useCallback((gameId) => {
    setData((d) => {
      const has = d.favorites.includes(gameId);
      return { ...d, favorites: has ? d.favorites.filter((id) => id !== gameId) : [...d.favorites, gameId] };
    });
  }, []);

  const recordPlay = useCallback((gameId, score = null) => {
    setData((d) => {
      const prev = d.history[gameId] || {};
      let best = prev.best ?? null;
      if (score !== null) best = best === null ? score : Math.max(best, score);
      const history = { ...d.history, [gameId]: { lastPlayed: Date.now(), best, plays: (prev.plays || 0) + 1 } };
      // Keep only the most recent entries.
      const trimmed = Object.fromEntries(
        Object.entries(history).sort((a, b) => b[1].lastPlayed - a[1].lastPlayed).slice(0, MAX_HISTORY)
      );
      return { ...d, history: trimmed };
    });
  }, []);

  const value = useMemo(
    () => ({
      favorites: data.favorites,
      history: data.history,
      isFavorite: (id) => data.favorites.includes(id),
      toggleFavorite,
      recordPlay,
      user,
      isAdmin,
      cloudEnabled: firebaseEnabled,
    }),
    [data, toggleFavorite, recordPlay, user, isAdmin]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
