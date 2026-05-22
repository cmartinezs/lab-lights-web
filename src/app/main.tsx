import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import '../shared/i18n/i18n';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

// Start MSW mock service worker in development when no real API is configured.
// In production (VITE_API_URL is set) the worker is never imported or started,
// so all fetch calls reach the real backend unchanged.
async function enableMocking(): Promise<void> {
  if (import.meta.env.VITE_API_URL) return;
  if (!import.meta.env.DEV) return;
  const { worker } = await import('../online/mock/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

void enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
