const LAST_PLAYED_KEY  = 'lab-lights:daily:last-played';
const STREAK_KEY       = 'lab-lights:daily:streak';
const STREAK_LAST_KEY  = 'lab-lights:daily:streak-last';
const TODAY_SCORE_KEY  = 'lab-lights:daily:today-score';

export type DailyState = {
  lastPlayedDate: string | null;
  streak: number;
  streakLastDate: string | null;
  todayScore: number | null;
};

export function getDailyState(): DailyState {
  const raw = globalThis.localStorage?.getItem(TODAY_SCORE_KEY);
  return {
    lastPlayedDate:  globalThis.localStorage?.getItem(LAST_PLAYED_KEY) ?? null,
    streak:          parseInt(globalThis.localStorage?.getItem(STREAK_KEY) ?? '0', 10),
    streakLastDate:  globalThis.localStorage?.getItem(STREAK_LAST_KEY) ?? null,
    todayScore:      raw !== null && raw !== undefined ? parseInt(raw, 10) : null,
  };
}

export function hasPlayedToday(todayKey: string): boolean {
  return globalThis.localStorage?.getItem(LAST_PLAYED_KEY) === todayKey;
}

export function updateStreakOnWin(todayKey: string): number {
  const streakLastDate = globalThis.localStorage?.getItem(STREAK_LAST_KEY) ?? null;
  const current = parseInt(globalThis.localStorage?.getItem(STREAK_KEY) ?? '0', 10);

  // Already processed today — don't double-count
  if (streakLastDate === todayKey) return current;

  let newStreak: number;
  if (!streakLastDate) {
    newStreak = 1;
  } else {
    const last  = new Date(streakLastDate);
    const today = new Date(todayKey);
    const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    newStreak = diffDays === 1 ? current + 1 : 1;
  }

  globalThis.localStorage?.setItem(STREAK_KEY, String(newStreak));
  globalThis.localStorage?.setItem(STREAK_LAST_KEY, todayKey);
  globalThis.localStorage?.setItem(LAST_PLAYED_KEY, todayKey);
  return newStreak;
}

export function saveTodayScore(score: number): void {
  globalThis.localStorage?.setItem(TODAY_SCORE_KEY, String(score));
}
