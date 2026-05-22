import { ApiError } from '../api/contract';
import type { SubmitScoreRequest } from '../api/contract';
import { apiFetch } from '../infra/apiFetch';
import { isOnline } from '../infra/networkStatus';
import {
  addEntry,
  getPendingEntries,
  loadQueue,
  updateEntry,
  type SyncQueueEntry,
} from '../infra/syncQueue';
import { isLoggedIn } from './authService';

let draining = false;

export function enqueueScore(req: SubmitScoreRequest): string {
  const commandId = crypto.randomUUID?.() ?? `cmd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const entry: SyncQueueEntry = {
    commandId,
    type: 'score',
    payload: req,
    status: 'pending',
    attempts: 0,
    lastAttemptAt: null,
    result: null,
    rewards: [],
    failureReason: null,
    createdAt: new Date().toISOString(),
  };
  addEntry(entry);
  return commandId;
}

// Returns the entry after attempting to sync (resolves when drain finishes).
// If offline or not logged in, returns the pending entry immediately.
export async function enqueueAndSync(req: SubmitScoreRequest): Promise<SyncQueueEntry> {
  const commandId = enqueueScore(req);
  if (isOnline() && isLoggedIn()) {
    await drainQueue();
  }
  return loadQueue().find((e) => e.commandId === commandId) ?? {
    commandId,
    type: 'score' as const,
    payload: req,
    status: 'pending',
    attempts: 0,
    lastAttemptAt: null,
    result: null,
    rewards: [],
    failureReason: null,
    createdAt: new Date().toISOString(),
  };
}

const MAX_ATTEMPTS = 3;

export async function drainQueue(): Promise<void> {
  if (draining) return;
  if (!isOnline() || !isLoggedIn()) return;

  draining = true;
  try {
    const pending = getPendingEntries();
    for (const entry of pending) {
      if (entry.attempts >= MAX_ATTEMPTS) continue;

      updateEntry(entry.commandId, {
        status: 'syncing',
        lastAttemptAt: new Date().toISOString(),
      });

      try {
        const result = await apiFetch<import('../api/contract').SubmitScoreResponse>(
          'POST',
          '/scores',
          { body: entry.payload, commandId: entry.commandId },
        );

        updateEntry(entry.commandId, {
          status: result.accepted ? 'synced' : 'rejected',
          result,
          rewards: result.rewards ?? [],
          failureReason: result.accepted ? null : (result.reason ?? 'REJECTED'),
          attempts: entry.attempts + 1,
        });
      } catch (err) {
        const attempts = entry.attempts + 1;
        if (err instanceof ApiError && (err.status === 200 || err.status === 422)) {
          // Server processed and rejected → don't retry
          updateEntry(entry.commandId, {
            status: 'rejected',
            attempts,
            failureReason: err.code,
          });
        } else {
          // Network or server error → retry up to MAX_ATTEMPTS
          updateEntry(entry.commandId, {
            status: attempts >= MAX_ATTEMPTS ? 'failed' : 'pending',
            attempts,
            failureReason: err instanceof Error ? err.message : 'UNKNOWN',
          });
        }
      }
    }
  } finally {
    draining = false;
  }
}

// Sets up auto-drain on 'online' event and visibility change.
// Returns a cleanup function; call from React useEffect or main.tsx.
export function setupAutoSync(): () => void {
  const handleOnline = () => { void drainQueue(); };
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') void drainQueue();
  };

  window.addEventListener('online', handleOnline);
  document.addEventListener('visibilitychange', handleVisibility);

  // Drain on setup in case queue was interrupted
  void drainQueue();

  return () => {
    window.removeEventListener('online', handleOnline);
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}

export function getQueueEntries(): SyncQueueEntry[] {
  return loadQueue();
}

export function getPendingSyncCount(): number {
  return getPendingEntries().length;
}
