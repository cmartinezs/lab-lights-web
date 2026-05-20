import { describe, expect, it } from 'vitest';
import { applyMove, startGame, verifyBoardIntegrity } from './gameSession';
import { createGameConfig } from '../domain/gameConfig';
import { signResult, verifyResultSignature } from '../infra/integrityService';

// Helper: play all setup moves from a given seed to reach a won state
function playToWin(seed: string) {
  const config = createGameConfig('classic', { rows: 3, columns: 3 });
  const session = startGame(config, seed);
  return session.setupMoves.reduce(
    (cur, move, idx) => applyMove(cur, move, 1_000 + idx * 1_000),
    session,
  );
}

describe('verifyBoardIntegrity — replay', () => {
  it('accepts a valid won session replayed from seed', () => {
    const won = playToWin('integrity-valid-seed');
    expect(won.status).toBe('won');
    expect(verifyBoardIntegrity(won)).toBe(true);
  });

  it('rejects a session where moveSequence was tampered', () => {
    const won = playToWin('integrity-tamper-seed');
    expect(won.status).toBe('won');

    // Inject a garbage move at the front of the sequence to break replay
    const tampered = { ...won, moveSequence: [{ row: 2, column: 2 }, ...won.moveSequence] };
    expect(verifyBoardIntegrity(tampered)).toBe(false);
  });

  it('rejects a session where status is forced to won but board is not solved', () => {
    const config = createGameConfig('classic', { rows: 3, columns: 3 });
    const session = startGame(config, 'integrity-forced-seed');
    // Inject won status without actually winning
    const fake = { ...session, status: 'won' as const, moveSequence: [{ row: 0, column: 0 }] };
    expect(verifyBoardIntegrity(fake)).toBe(false);
  });
});

describe('verifyBoardIntegrity — plausibility', () => {
  it('rejects a won session where elapsed time is suspiciously low per move', () => {
    const won = playToWin('integrity-valid-seed');
    expect(won.status).toBe('won');
    expect(won.moves).toBeGreaterThan(0);

    // Forge elapsed time: 100ms/move, below the 200ms/move threshold.
    // Total elapsed = moves * 100ms >= 100ms (above PLAUSIBILITY_MIN_ELAPSED_MS).
    const tooFast = { ...won, elapsedMilliseconds: won.moves * 100 };
    expect(verifyBoardIntegrity(tooFast)).toBe(false);
  });

  it('accepts a session with normal timing (>= 200ms each)', () => {
    const won = playToWin('integrity-valid-seed');
    expect(won.status).toBe('won');
    // playToWin uses 1000ms per move, well above the 200ms/move threshold
    expect(verifyBoardIntegrity(won)).toBe(true);
  });
});

describe('verifyBoardIntegrity — aided games', () => {
  it('accepts a continued game without replaying (skip replay)', () => {
    const config = createGameConfig('classic', { rows: 3, columns: 3 });
    const session = startGame(config, 'integrity-cont-seed', { continued: true });
    const won = session.setupMoves.reduce(
      (cur, move, idx) => applyMove(cur, move, 1_000 + idx * 1_000),
      session,
    );
    if (won.status !== 'won') return;
    expect(verifyBoardIntegrity(won)).toBe(true);
  });
});

describe('integrityService — HMAC', () => {
  it('signs and verifies a result successfully', async () => {
    const hmac = await signResult('hmac-test-seed', 450, 5);
    expect(typeof hmac).toBe('string');
    expect(hmac.length).toBeGreaterThan(10);

    const valid = await verifyResultSignature('hmac-test-seed', 450, 5, hmac);
    expect(valid).toBe(true);
  });

  it('rejects a tampered score', async () => {
    const hmac = await signResult('hmac-tamper-seed', 450, 5);
    const invalid = await verifyResultSignature('hmac-tamper-seed', 999, 5, hmac);
    expect(invalid).toBe(false);
  });

  it('rejects an invalid base64 hmac string', async () => {
    const invalid = await verifyResultSignature('seed', 100, 3, 'not-valid-base64!!!');
    expect(invalid).toBe(false);
  });
});
