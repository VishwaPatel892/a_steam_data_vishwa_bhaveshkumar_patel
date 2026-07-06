import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { store } from './store';
import { injectStore } from './services/api.js';
import './index.css';
import App from './App.jsx';

// Inject store into axios interceptors to avoid circular dependency
injectStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
