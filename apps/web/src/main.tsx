import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

import './index.css';

// biome-ignore lint/style/noNonNullAssertion: This is a demo app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);