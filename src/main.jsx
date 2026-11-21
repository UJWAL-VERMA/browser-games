import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { StoreProvider } from './lib/store';
import { ToastProvider } from './lib/toast';
import './index.css';

// HashRouter ensures perfect client-side routing across GitHub Pages subpaths, Android APKs, and iOS WebViews
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ToastProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ToastProvider>
    </HashRouter>
  </React.StrictMode>
);
