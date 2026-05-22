import type { RewardDto, SubmitScoreRequest, SubmitScoreResponse } from '../api/contract';

const QUEUE_KEY = 'lab-lights:online:sync-queue';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed' | 'rejected';

export type SyncQueueEntry = {
  commandId: string;
  type: 'score';
  payload: SubmitScoreRequest;
  status: SyncStatus;
  attempts: number;
  lastAttemptAt: string | null;
  result: SubmitScoreResponse | null;
  rewards: RewardDto[];
  failureReason: string | null;
  createdAt: string;
};

export function loadQueue(): SyncQueueEntry[] {
  try {
    const raw = globalThis.localStorage?.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SyncQueueEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveQueue(entries: SyncQueueEntry[]): void {
  globalThis.localStorage?.setItem(QUEUE_KEY, JSON.stringify(entries));
}

export function addEntry(entry: SyncQueueEntry): void {
  const queue = loadQueue();
  // Dedup: if commandId already exists, skip
  if (queue.some((e) => e.commandId === entry.commandId)) return;
  saveQueue([entry, ...queue]);
}

export function updateEntry(commandId: string, patch: Partial<SyncQueueEntry>): void {
  const queue = loadQueue();
  const updated = queue.map((e) => (e.commandId === commandId ? { ...e, ...patch } : e));
  saveQueue(updated);
}

export function getEntry(commandId: string): SyncQueueEntry | undefined {
  return loadQueue().find((e) => e.commandId === commandId);
}

export function getPendingEntries(): SyncQueueEntry[] {
  return loadQueue().filter((e) => e.status === 'pending' || e.status === 'failed');
}

export function getPendingCount(): number {
  return getPendingEntries().length;
}

export function clearSyncedEntries(): void {
  const queue = loadQueue().filter((e) => e.status !== 'synced' && e.status !== 'rejected');
  saveQueue(queue);
}
