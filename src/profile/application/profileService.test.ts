import { describe, expect, it } from 'vitest';
import { DEFAULT_PROFILE, updateProfileWithWin } from '../domain/profile';

describe('updateProfileWithWin', () => {
  it('increments gamesRecorded', () => {
    const profile = { ...DEFAULT_PROFILE, gamesRecorded: 2 };
    const result = updateProfileWithWin(profile, { score: 100, elapsedSeconds: 30 });

    expect(result.gamesRecorded).toBe(3);
  });

  it('does not change initials', () => {
    const profile = { ...DEFAULT_PROFILE, initials: 'LAB' };
    const result = updateProfileWithWin(profile, { score: 100, elapsedSeconds: 30 });

    expect(result.initials).toBe('LAB');
  });

  it('keeps the higher bestScore', () => {
    const profile = { ...DEFAULT_PROFILE, bestScore: 200 };
    const result = updateProfileWithWin(profile, { score: 150, elapsedSeconds: 30 });

    expect(result.bestScore).toBe(200);
  });

  it('replaces bestScore when new score is higher', () => {
    const profile = { ...DEFAULT_PROFILE, bestScore: 100 };
    const result = updateProfileWithWin(profile, { score: 300, elapsedSeconds: 30 });

    expect(result.bestScore).toBe(300);
  });

  it('sets bestTimeSeconds on first win', () => {
    const result = updateProfileWithWin(DEFAULT_PROFILE, { score: 100, elapsedSeconds: 45 });

    expect(result.bestTimeSeconds).toBe(45);
  });

  it('keeps the shorter bestTimeSeconds', () => {
    const profile = { ...DEFAULT_PROFILE, bestTimeSeconds: 20 };
    const result = updateProfileWithWin(profile, { score: 100, elapsedSeconds: 35 });

    expect(result.bestTimeSeconds).toBe(20);
  });

  it('replaces bestTimeSeconds when new time is faster', () => {
    const profile = { ...DEFAULT_PROFILE, bestTimeSeconds: 60 };
    const result = updateProfileWithWin(profile, { score: 100, elapsedSeconds: 15 });

    expect(result.bestTimeSeconds).toBe(15);
  });
});
