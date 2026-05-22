import { describe, expect, it } from 'vitest';
import { getDailySeed, getTodayKey } from './daily';

describe('getTodayKey', () => {
  it('returns YYYY-MM-DD format', () => {
    const key = getTodayKey(new Date('2026-05-22'));
    expect(key).toBe('2026-05-22');
  });

  it('pads month and day with leading zeros', () => {
    expect(getTodayKey(new Date('2026-01-05'))).toBe('2026-01-05');
    expect(getTodayKey(new Date('2026-09-03'))).toBe('2026-09-03');
  });

  it('returns identical results for the same date', () => {
    const d = new Date('2026-05-22');
    expect(getTodayKey(d)).toBe(getTodayKey(d));
  });
});

describe('getDailySeed', () => {
  it('returns daily-YYYY-MM-DD format', () => {
    expect(getDailySeed(new Date('2026-05-22'))).toBe('daily-2026-05-22');
  });

  it('returns the same seed for the same date', () => {
    const d = new Date('2026-05-22');
    expect(getDailySeed(d)).toBe(getDailySeed(d));
  });

  it('returns different seeds for different dates', () => {
    expect(getDailySeed(new Date('2026-05-22'))).not.toBe(getDailySeed(new Date('2026-05-23')));
  });
});
