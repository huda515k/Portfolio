import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// Fonts are bundled with the site (not loaded from Google), so every device gets the exact same type
import '@fontsource-variable/unbounded';
import '@fontsource-variable/manrope';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
