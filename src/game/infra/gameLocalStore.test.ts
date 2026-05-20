import { describe, expect, it } from 'vitest';
import { sortResults, type GameResultRecord } from './gameLocalStore';

describe('game local ranking', () => {
  it('sorts by highest score, shortest time, then fewest moves', () => {
    const results: GameResultRecord[] = [
      createResult({ id: 'slow-high', score: 300, elapsedSeconds: 20, moves: 6 }),
      createResult({ id: 'low-fast', score: 200, elapsedSeconds: 5, moves: 3 }),
      createResult({ id: 'fast-high', score: 300, elapsedSeconds: 10, moves: 8 }),
      createResult({ id: 'efficient-high', score: 300, elapsedSeconds: 10, moves: 5 }),
    ];

    expect(sortResults(results).map((r) => r.id)).toEqual([
      'efficient-high',
      'fast-high',
      'slow-high',
      'low-fast',
    ]);
  });
});

function createResult(overrides: Partial<GameResultRecord>): GameResultRecord {
  return {
    id: 'result',
    initials: 'LAB',
    mode: 'classic',
    rows: 3,
    columns: 3,
    score: 0,
    moves: 0,
    elapsedSeconds: 0,
    seed: 'seed',
    createdAt: '2026-05-20T00:00:00.000Z',
    verified: true,
    ...overrides,
  };
}
