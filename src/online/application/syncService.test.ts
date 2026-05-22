import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '../infra/apiFetch';
import { isOnline } from '../infra/networkStatus';
import { isLoggedIn } from './authService';
import { drainQueue, enqueueAndSync, enqueueScore, getQueueEntries } from './syncService';
import { loadQueue, updateEntry } from '../infra/syncQueue';
import type { SubmitScoreRequest } from '../api/contract';

vi.mock('../infra/apiFetch');
vi.mock('../infra/networkStatus');
vi.mock('./authService');

const mockReq: SubmitScoreRequest = {
  mode: 'classic', rows: 3, columns: 3, seed: 'test-seed',
  score: 1000, moves: 5, elapsedSeconds: 10, hmac: 'abc',
  moveSequence: [], powerUpsUsed: [], continued: false,
};

function acceptedResponse(rank = 5) {
  return { submissionId: 'sub-1', accepted: true as const, rank, rewards: [] };
}

function rejectedResponse(reason = 'DUPLICATE_SEED') {
  return { submissionId: 'sub-2', accepted: false as const, rank: null, reason, rewards: [] };
}

describe('syncService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(isOnline).mockReturnValue(true);
    vi.mocked(isLoggedIn).mockReturnValue(true);
  });

  // ── enqueueScore ─────────────────────────────────────────────

  it('enqueueScore adds a pending entry to the queue', () => {
    const commandId = enqueueScore(mockReq);
    const queue = loadQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0]?.commandId).toBe(commandId);
    expect(queue[0]?.status).toBe('pending');
    expect(queue[0]?.attempts).toBe(0);
  });

  it('enqueueScore generates a unique commandId', () => {
    const a = enqueueScore(mockReq);
    const b = enqueueScore({ ...mockReq, seed: 'other-seed' });
    expect(a).not.toBe(b);
  });

  // ── drainQueue — success path ─────────────────────────────────

  it('drainQueue marks entry as synced when server accepts', async () => {
    const commandId = enqueueScore(mockReq);
    vi.mocked(apiFetch).mockResolvedValueOnce(acceptedResponse());
    await drainQueue();
    const entry = loadQueue().find((e) => e.commandId === commandId);
    expect(entry?.status).toBe('synced');
    expect(entry?.result?.accepted).toBe(true);
    expect(entry?.attempts).toBe(1);
  });

  it('drainQueue stores rank and rewards from accepted response', async () => {
    enqueueScore(mockReq);
    const rewards = [{ type: 'FIRST_ONLINE_SUBMISSION', coins: 500, label: 'Primera partida online' }];
    vi.mocked(apiFetch).mockResolvedValueOnce({ ...acceptedResponse(3), rewards });
    await drainQueue();
    const entry = loadQueue()[0];
    expect(entry?.result?.rank).toBe(3);
    expect(entry?.rewards).toHaveLength(1);
    expect(entry?.rewards[0]?.coins).toBe(500);
  });

  // ── drainQueue — rejection path ───────────────────────────────

  it('drainQueue marks entry as rejected when server rejects (accepted=false)', async () => {
    const commandId = enqueueScore(mockReq);
    vi.mocked(apiFetch).mockResolvedValueOnce(rejectedResponse('DUPLICATE_SEED'));
    await drainQueue();
    const entry = loadQueue().find((e) => e.commandId === commandId);
    expect(entry?.status).toBe('rejected');
    expect(entry?.failureReason).toBe('DUPLICATE_SEED');
  });

  it('drainQueue does not retry rejected entries', async () => {
    enqueueScore(mockReq);
    vi.mocked(apiFetch).mockResolvedValue(rejectedResponse());
    await drainQueue();
    await drainQueue();
    // apiFetch should only have been called once (reject → no retry)
    expect(vi.mocked(apiFetch)).toHaveBeenCalledTimes(1);
  });

  // ── drainQueue — network error path ──────────────────────────

  it('drainQueue keeps entry as pending after one network error', async () => {
    enqueueScore(mockReq);
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Network error'));
    await drainQueue();
    const entry = loadQueue()[0];
    expect(entry?.status).toBe('pending');
    expect(entry?.attempts).toBe(1);
  });

  it('drainQueue marks entry as failed after MAX_ATTEMPTS (3) network errors', async () => {
    enqueueScore(mockReq);
    vi.mocked(apiFetch).mockRejectedValue(new Error('Network error'));
    await drainQueue(); // attempt 1
    await drainQueue(); // attempt 2
    await drainQueue(); // attempt 3 → failed
    const entry = loadQueue()[0];
    expect(entry?.status).toBe('failed');
    expect(entry?.attempts).toBe(3);
  });

  it('drainQueue skips entries already at MAX_ATTEMPTS', async () => {
    enqueueScore(mockReq);
    const queue = loadQueue();
    updateEntry(queue[0]!.commandId, { attempts: 3, status: 'failed' });
    vi.mocked(apiFetch).mockResolvedValue(acceptedResponse());
    await drainQueue();
    expect(vi.mocked(apiFetch)).not.toHaveBeenCalled();
  });

  // ── drainQueue — offline/not logged in ───────────────────────

  it('drainQueue does nothing when offline', async () => {
    enqueueScore(mockReq);
    vi.mocked(isOnline).mockReturnValue(false);
    await drainQueue();
    expect(vi.mocked(apiFetch)).not.toHaveBeenCalled();
    expect(loadQueue()[0]?.status).toBe('pending');
  });

  it('drainQueue does nothing when not logged in', async () => {
    enqueueScore(mockReq);
    vi.mocked(isLoggedIn).mockReturnValue(false);
    await drainQueue();
    expect(vi.mocked(apiFetch)).not.toHaveBeenCalled();
  });

  // ── enqueueAndSync ────────────────────────────────────────────

  it('enqueueAndSync returns synced entry on success', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce(acceptedResponse(7));
    const entry = await enqueueAndSync(mockReq);
    expect(entry.status).toBe('synced');
    expect(entry.result?.rank).toBe(7);
  });

  it('enqueueAndSync returns pending entry when offline', async () => {
    vi.mocked(isOnline).mockReturnValue(false);
    const entry = await enqueueAndSync(mockReq);
    expect(entry.status).toBe('pending');
    expect(vi.mocked(apiFetch)).not.toHaveBeenCalled();
  });

  it('enqueueAndSync returns pending entry when not logged in', async () => {
    vi.mocked(isLoggedIn).mockReturnValue(false);
    const entry = await enqueueAndSync(mockReq);
    expect(entry.status).toBe('pending');
  });

  it('getQueueEntries returns current queue state', () => {
    enqueueScore(mockReq);
    enqueueScore({ ...mockReq, seed: 'other-seed' });
    expect(getQueueEntries()).toHaveLength(2);
  });
});
