/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: '#16192b',        // Modern lighter midnight navy
          canvas: '#1e2238',    // Fresh canvas card background
          panel: '#252a45',     // Soft elevated surface
          border: 'rgba(255, 255, 255, 0.12)',
          pink: '#ff3d8b',
          cyan: '#38bdf8',      // Vibrant sky cyan
          lime: '#4ade80',      // Fresh mint lime
          gold: '#fbbf24',      // Warm golden glow
          text: '#f8fafc',      // Crisp light text
          muted: '#94a3b8',     // Muted slate text
        },
      },
      fontFamily: { display: ['"Trebuchet MS"', 'system-ui', 'sans-serif'] },
      boxShadow: {
        neonPink: '0 0 20px rgba(255,61,139,0.4)',
        neonCyan: '0 0 20px rgba(56,189,248,0.4)',
        cardGlow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
