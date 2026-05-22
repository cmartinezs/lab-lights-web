import { beforeEach, describe, expect, it } from 'vitest';
import { getDailyState, hasPlayedToday, saveTodayScore, updateStreakOnWin } from './dailyStore';

beforeEach(() => {
  localStorage.clear();
});

describe('hasPlayedToday', () => {
  it('returns false initially', () => {
    expect(hasPlayedToday('2026-05-22')).toBe(false);
  });

  it('returns true after updateStreakOnWin for the same key', () => {
    updateStreakOnWin('2026-05-22');
    expect(hasPlayedToday('2026-05-22')).toBe(true);
  });

  it('returns false for a different date than the one played', () => {
    updateStreakOnWin('2026-05-22');
    expect(hasPlayedToday('2026-05-23')).toBe(false);
  });
});

describe('updateStreakOnWin', () => {
  it('starts streak at 1 on first play', () => {
    expect(updateStreakOnWin('2026-05-22')).toBe(1);
  });

  it('increments streak on consecutive days', () => {
    updateStreakOnWin('2026-05-21');
    expect(updateStreakOnWin('2026-05-22')).toBe(2);
  });

  it('resets streak to 1 when a day is skipped', () => {
    updateStreakOnWin('2026-05-20');
    expect(updateStreakOnWin('2026-05-22')).toBe(1); // skipped 2026-05-21
  });

  it('does not double-count if called twice for the same day', () => {
    updateStreakOnWin('2026-05-22');
    expect(updateStreakOnWin('2026-05-22')).toBe(1); // idempotent same-day
  });

  it('builds a multi-day streak correctly', () => {
    updateStreakOnWin('2026-05-20');
    updateStreakOnWin('2026-05-21');
    expect(updateStreakOnWin('2026-05-22')).toBe(3);
  });
});

describe('saveTodayScore + getDailyState', () => {
  it('todayScore is null before saving', () => {
    expect(getDailyState().todayScore).toBeNull();
  });

  it('persists the saved score', () => {
    saveTodayScore(1200);
    expect(getDailyState().todayScore).toBe(1200);
  });

  it('returns streak from getDailyState', () => {
    updateStreakOnWin('2026-05-21');
    updateStreakOnWin('2026-05-22');
    expect(getDailyState().streak).toBe(2);
  });
});
