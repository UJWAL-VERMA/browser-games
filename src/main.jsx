import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { StoreProvider } from './lib/store';
import { ToastProvider } from './lib/toast';
import './index.css';

// BrowserRouter works on the web. Capacitor serves the build from a local origin, so this also works in the apps.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
