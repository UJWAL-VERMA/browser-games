import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setMuted as setAudioMuted, isMuted } from '../lib/audio';
import { useStore } from '../lib/store';
import { useToast } from '../lib/toast';

// Universal in-app game player for online browser games (Website, Android APK & iOS App)
export default function GamePlayer({ game }) {
  const navigate = useNavigate();
  const { recordPlay } = useStore();
  const toast = useToast();
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [muted, setMutedState] = useState(isMuted());
  const [loadFailed, setLoadFailed] = useState(false);

  const handleExit = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }
      screen.orientation?.unlock?.();
    } catch {}
    navigate('/');
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        const orientation = game.orientation === 'landscape' ? 'landscape' : 'portrait';
        await screen.orientation?.lock?.(orientation).catch(() => {});
      } else {
        await document.exitFullscreen();
        screen.orientation?.unlock?.();
      }
    } catch {
      toast('Fullscreen toggle not available on this viewport.', 'info');
    }
  };

  const toggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setAudioMuted(next);
    iframeRef.current?.contentWindow?.postMessage({ type: 'bg-mute', muted: next }, '*');
  };

  const openExternal = () => {
    window.open(game.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full bg-arcade-bg select-none">
      {/* Top Controls Bar */}
      <div className="flex items-center gap-2 px-3 md:px-4 py-2.5 bg-arcade-canvas/95 border-b border-white/10 text-xs backdrop-blur-md z-30 shadow-sm">
        {/* Exit Game Button */}
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition active:scale-95 border border-white/15"
          title="Exit game and return to home"
        >
          <span className="text-sm">←</span>
          <span className="font-semibold">Exit</span>
        </button>

        <span className="font-display font-bold truncate flex-1 text-white text-xs md:text-sm tracking-wide ml-1">
          {game.title}
        </span>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="ctrl hidden sm:flex items-center gap-1"
            title="Reload game session"
          >
            <span>🔄</span> <span>Reload</span>
          </button>

          <button
            onClick={toggleMute}
            className="ctrl hidden sm:flex items-center gap-1"
            title="Toggle audio"
          >
            <span>{muted ? '🔇' : '🔊'}</span> <span>{muted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={openExternal}
            className="ctrl flex items-center gap-1"
            title="Open directly in browser"
          >
            <span>↗</span> <span className="hidden md:inline">Open in browser</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="ctrl flex items-center gap-1 bg-arcade-cyan/20 border-arcade-cyan text-arcade-cyan font-bold"
            title="Fullscreen"
          >
            <span>⛶</span> <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 relative flex items-center justify-center p-1 md:p-3 overflow-hidden bg-black/40">
        {loadFailed ? (
          <div className="text-center text-sm text-arcade-muted max-w-sm mt-8 p-6 bg-arcade-canvas rounded-2xl border border-arcade-pink/30 shadow-lg z-10">
            <p className="mb-2 text-arcade-gold font-display font-bold text-base">Game Loading Notice</p>
            <p className="mb-4 text-xs text-arcade-muted leading-relaxed">
              This site restricts embedding inside in-app frames. Tap below to launch and play directly in your mobile browser with smooth controls.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={openExternal}
                className="rounded-xl bg-arcade-pink px-5 py-2.5 font-display text-xs font-bold text-white shadow-neonPink hover:bg-arcade-pink/90 transition"
              >
                Play in external browser ↗
              </button>
              <button
                onClick={handleExit}
                className="rounded-xl bg-white/10 px-5 py-2 text-xs font-medium text-white hover:bg-white/20 transition"
              >
                Return to Games
              </button>
            </div>
          </div>
        ) : (
          <iframe
            key={reloadKey}
            ref={iframeRef}
            src={game.url}
            title={game.title}
            className="w-full h-full min-h-[75vh] rounded-xl border border-white/10 bg-black shadow-2xl"
            allow="fullscreen; autoplay; gamepad; encrypted-media; clipboard-write; camera; microphone; accelerometer; gyroscope"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-modals"
            onLoad={() => recordPlay(game.id, null)}
            onError={() => setLoadFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
