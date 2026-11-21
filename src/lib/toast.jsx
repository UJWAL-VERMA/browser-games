import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, tone = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const tone = { info: 'border-arcade-cyan text-arcade-cyan', success: 'border-arcade-lime text-arcade-lime', error: 'border-arcade-pink text-arcade-pink' };

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-6 z-50 flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-in rounded-lg border bg-arcade-panel px-4 py-3 text-sm shadow-lg ${tone[t.tone]}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
