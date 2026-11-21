import { Routes, Route } from 'react-router-dom';
import { TopNav, BottomNav } from './components/Navbar';
import Home from './pages/Home';
import Play from './pages/Play';
import Favorites from './pages/Favorites';
import History from './pages/History';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="min-h-[100dvh] bg-arcade-bg text-white">
      <TopNav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play/:id" element={<Play />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<div className="p-8 text-center text-white/60">Page not found.</div>} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
