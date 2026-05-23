export type Prestige = 0 | 1 | 2 | 3;

export const MAX_LEVEL = 50;
export const MAX_PRESTIGE: Prestige = 3;

export const PRESTIGE_NAMES: Record<Prestige, string> = {
  0: '',
  1: 'Investigador',
  2: 'Senior',
  3: 'Experto',
};

// Cumulative XP required to start level N (level 1 = 0 XP)
export function xpThresholdForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(4 * Math.pow(level - 1, 1.5));
}

export const MAX_CYCLE_XP = xpThresholdForLevel(MAX_LEVEL);

export type LevelSnapshot = {
  level: number;
  xpInLevel: number;
  xpToNext: number;
  progressPct: number;
};

export function computeLevel(levelXp: number): LevelSnapshot {
  let level = 1;
  while (level < MAX_LEVEL && levelXp >= xpThresholdForLevel(level + 1)) {
    level++;
  }
  const floorXp = xpThresholdForLevel(level);
  const ceilXp = level < MAX_LEVEL ? xpThresholdForLevel(level + 1) : floorXp + 1;
  const xpInLevel = levelXp - floorXp;
  const xpToNext = ceilXp - floorXp;
  return {
    level,
    xpInLevel,
    xpToNext,
    progressPct: level < MAX_LEVEL ? Math.min(100, Math.round((xpInLevel / xpToNext) * 100)) : 100,
  };
}

export function xpForWin(score: number): number {
  return Math.max(1, Math.round(score / 100));
}
