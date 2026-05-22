import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Starts the MSW Service Worker that intercepts /v1/* fetch calls.
// Only imported and started in dev mode (see src/app/main.tsx).
export const worker = setupWorker(...handlers);
