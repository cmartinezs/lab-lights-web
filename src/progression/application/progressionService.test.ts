import { describe, it, expect, beforeEach } from 'vitest';
import { awardXpForWin, getProgressionSnapshot } from './progressionService';
import { saveProgression } from '../infra/progressionStore';
import { xpThresholdForLevel, MAX_CYCLE_XP } from '../domain/progression';

beforeEach(() => {
  globalThis.localStorage.clear();
});

describe('xpThresholdForLevel', () => {
  it('returns 0 for level 1', () => {
    expect(xpThresholdForLevel(1)).toBe(0);
  });

  it('increases monotonically', () => {
    for (let i = 2; i <= 50; i++) {
      expect(xpThresholdForLevel(i)).toBeGreaterThan(xpThresholdForLevel(i - 1));
    }
  });
});

describe('getProgressionSnapshot', () => {
  it('returns level 1 with no XP on first call', () => {
    const snap = getProgressionSnapshot();
    expect(snap.level).toBe(1);
    expect(snap.prestige).toBe(0);
    expect(snap.totalWins).toBe(0);
  });
});

describe('awardXpForWin', () => {
  it('awards XP and increments totalWins', () => {
    const result = awardXpForWin({ score: 200, mode: 'classic' });
    expect(result.xpEarned).toBe(2);
    expect(result.totalWins).toBe(1);
  });

  it('levels up when enough XP is accumulated', () => {
    // Set XP near level 2 threshold
    const threshold = xpThresholdForLevel(2);
    saveProgression({ totalXp: threshold - 1, prestige: 0, levelXp: threshold - 1, totalWins: 0, winsByMode: {}, puzzlesSolved: 0, dailyCompleted: 0 });
    const result = awardXpForWin({ score: 500, mode: 'classic' }); // earns 5 XP
    expect(result.didLevelUp).toBe(true);
    expect(result.snapshot.level).toBeGreaterThan(1);
  });

  it('increments puzzlesSolved for puzzle mode', () => {
    const result = awardXpForWin({ score: 300, mode: 'puzzle', isPuzzle: true });
    expect(result.puzzlesSolved).toBe(1);
  });

  it('increments dailyCompleted for daily mode', () => {
    const result = awardXpForWin({ score: 300, mode: 'daily', isDaily: true });
    expect(result.dailyCompleted).toBe(1);
  });

  it('triggers prestige when reaching max cycle XP', () => {
    saveProgression({
      totalXp: MAX_CYCLE_XP - 1,
      prestige: 0,
      levelXp: MAX_CYCLE_XP - 1,
      totalWins: 0,
      winsByMode: {},
      puzzlesSolved: 0,
      dailyCompleted: 0,
    });
    const result = awardXpForWin({ score: 500, mode: 'classic' });
    expect(result.didPrestige).toBe(true);
    expect(result.prestige).toBe(1);
  });
});
