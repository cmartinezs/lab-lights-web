import type { Prestige } from '../domain/progression';

const KEY = 'lab-lights:progression';

export type StoredProgression = {
  totalXp: number;
  prestige: Prestige;
  levelXp: number;
  totalWins: number;
  winsByMode: Record<string, number>;
  puzzlesSolved: number;
  dailyCompleted: number;
};

const DEFAULT: StoredProgression = {
  totalXp: 0,
  prestige: 0,
  levelXp: 0,
  totalWins: 0,
  winsByMode: {},
  puzzlesSolved: 0,
  dailyCompleted: 0,
};

export function loadProgression(): StoredProgression {
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as unknown;
      if (p && typeof p === 'object') {
        const s = p as Partial<StoredProgression>;
        if (typeof s.totalXp === 'number') {
          return { ...DEFAULT, ...s };
        }
      }
    }
  } catch { /* ignore */ }
  return { ...DEFAULT };
}

export function saveProgression(state: StoredProgression): void {
  globalThis.localStorage?.setItem(KEY, JSON.stringify(state));
}
