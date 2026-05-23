import { describe, it, expect, beforeEach } from 'vitest';
import { checkAndUnlock, ACHIEVEMENTS } from './achievementsService';
import { isUnlocked } from '../infra/achievementsStore';

beforeEach(() => {
  globalThis.localStorage.clear();
});

describe('checkAndUnlock', () => {
  it('unlocks first-win on first win', () => {
    const unlocked = checkAndUnlock({ mode: 'classic', score: 200, moves: 4, elapsedSeconds: 60, win: true, totalWins: 1 });
    expect(unlocked).toContain('first-win');
    expect(isUnlocked('first-win')).toBe(true);
  });

  it('does not unlock achievements on loss', () => {
    const unlocked = checkAndUnlock({ mode: 'classic', score: 0, moves: 4, elapsedSeconds: 60, win: false });
    expect(unlocked).not.toContain('first-win');
  });

  it('unlocks score-500 when score >= 500', () => {
    const unlocked = checkAndUnlock({ mode: 'classic', score: 500, moves: 4, elapsedSeconds: 60, win: true, totalWins: 1 });
    expect(unlocked).toContain('score-500');
  });

  it('does not double-unlock already unlocked achievements', () => {
    checkAndUnlock({ mode: 'classic', score: 200, moves: 4, elapsedSeconds: 60, win: true, totalWins: 1 });
    const second = checkAndUnlock({ mode: 'classic', score: 200, moves: 4, elapsedSeconds: 60, win: true, totalWins: 2 });
    expect(second).not.toContain('first-win');
  });

  it('unlocks speed-run when elapsed < 30s', () => {
    const unlocked = checkAndUnlock({ mode: 'classic', score: 200, moves: 2, elapsedSeconds: 25, win: true, totalWins: 1 });
    expect(unlocked).toContain('speed-run');
  });

  it('unlocks minimalist when moves <= 3', () => {
    const unlocked = checkAndUnlock({ mode: 'classic', score: 200, moves: 3, elapsedSeconds: 40, win: true, totalWins: 1 });
    expect(unlocked).toContain('minimalist');
  });

  it('unlocks mode-specific achievements', () => {
    const blindUnlocked = checkAndUnlock({ mode: 'blind', score: 200, moves: 4, elapsedSeconds: 60, win: true, totalWins: 1 });
    expect(blindUnlocked).toContain('blind-win');
  });

  it('unlocks level-5 when level >= 5', () => {
    const unlocked = checkAndUnlock({ mode: 'classic', score: 200, moves: 4, elapsedSeconds: 60, win: true, totalWins: 1, level: 5 });
    expect(unlocked).toContain('level-5');
  });

  it('ACHIEVEMENTS list has all expected entries', () => {
    expect(ACHIEVEMENTS.length).toBe(20);
    const ids = new Set(ACHIEVEMENTS.map((a) => a.id));
    expect(ids.has('first-win')).toBe(true);
    expect(ids.has('prestige-1')).toBe(true);
  });
});
