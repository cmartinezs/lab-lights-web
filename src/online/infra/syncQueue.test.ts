import { beforeEach, describe, expect, it } from 'vitest';
import {
  addEntry,
  clearSyncedEntries,
  getEntry,
  getPendingEntries,
  getPendingCount,
  loadQueue,
  updateEntry,
  type SyncQueueEntry,
} from './syncQueue';

function makeEntry(overrides: Partial<SyncQueueEntry> = {}): SyncQueueEntry {
  return {
    commandId: 'cmd-1',
    type: 'score',
    payload: {
      mode: 'classic', rows: 3, columns: 3, seed: 'test-seed',
      score: 1000, moves: 5, elapsedSeconds: 10, hmac: 'abc',
      moveSequence: [], powerUpsUsed: [], continued: false,
    },
    status: 'pending',
    attempts: 0,
    lastAttemptAt: null,
    result: null,
    rewards: [],
    failureReason: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('syncQueue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when nothing stored', () => {
    expect(loadQueue()).toEqual([]);
  });

  it('addEntry stores a new entry', () => {
    addEntry(makeEntry());
    expect(loadQueue()).toHaveLength(1);
    expect(loadQueue()[0]?.commandId).toBe('cmd-1');
  });

  it('addEntry deduplicates by commandId', () => {
    addEntry(makeEntry());
    addEntry(makeEntry());
    expect(loadQueue()).toHaveLength(1);
  });

  it('addEntry prepends new entries (most recent first)', () => {
    addEntry(makeEntry({ commandId: 'a' }));
    addEntry(makeEntry({ commandId: 'b' }));
    const queue = loadQueue();
    expect(queue[0]?.commandId).toBe('b');
    expect(queue[1]?.commandId).toBe('a');
  });

  it('updateEntry patches the matching entry', () => {
    addEntry(makeEntry());
    updateEntry('cmd-1', { status: 'synced', attempts: 1 });
    const entry = loadQueue()[0];
    expect(entry?.status).toBe('synced');
    expect(entry?.attempts).toBe(1);
  });

  it('updateEntry does not affect other entries', () => {
    addEntry(makeEntry({ commandId: 'a' }));
    addEntry(makeEntry({ commandId: 'b' }));
    updateEntry('a', { status: 'failed' });
    const queue = loadQueue();
    expect(queue.find((e) => e.commandId === 'b')?.status).toBe('pending');
  });

  it('getEntry returns undefined for unknown commandId', () => {
    expect(getEntry('nonexistent')).toBeUndefined();
  });

  it('getEntry returns the matching entry', () => {
    addEntry(makeEntry({ commandId: 'xyz' }));
    expect(getEntry('xyz')?.commandId).toBe('xyz');
  });

  it('getPendingEntries returns pending and failed only', () => {
    addEntry(makeEntry({ commandId: 'a', status: 'pending' }));
    addEntry(makeEntry({ commandId: 'b', status: 'synced' }));
    addEntry(makeEntry({ commandId: 'c', status: 'failed' }));
    addEntry(makeEntry({ commandId: 'd', status: 'rejected' }));
    addEntry(makeEntry({ commandId: 'e', status: 'syncing' }));
    const pending = getPendingEntries().map((e) => e.commandId).sort();
    expect(pending).toEqual(['a', 'c']);
  });

  it('getPendingCount reflects pending + failed count', () => {
    addEntry(makeEntry({ commandId: 'a', status: 'pending' }));
    addEntry(makeEntry({ commandId: 'b', status: 'failed' }));
    addEntry(makeEntry({ commandId: 'c', status: 'synced' }));
    expect(getPendingCount()).toBe(2);
  });

  it('clearSyncedEntries removes synced and rejected entries', () => {
    addEntry(makeEntry({ commandId: 'a', status: 'pending' }));
    addEntry(makeEntry({ commandId: 'b', status: 'synced' }));
    addEntry(makeEntry({ commandId: 'c', status: 'rejected' }));
    addEntry(makeEntry({ commandId: 'd', status: 'failed' }));
    clearSyncedEntries();
    const remaining = loadQueue().map((e) => e.commandId).sort();
    expect(remaining).toEqual(['a', 'd']);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('lab-lights:online:sync-queue', 'not-json');
    expect(loadQueue()).toEqual([]);
  });
});
