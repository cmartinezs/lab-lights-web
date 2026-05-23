import { loadProgression, saveProgression } from '../infra/progressionStore';
import {
  xpForWin, computeLevel, MAX_CYCLE_XP, MAX_PRESTIGE, PRESTIGE_NAMES,
  type LevelSnapshot, type Prestige,
} from '../domain/progression';

export type { LevelSnapshot, Prestige };
export { PRESTIGE_NAMES };

export type WinResult = {
  xpEarned: number;
  snapshot: LevelSnapshot;
  prestige: Prestige;
  didLevelUp: boolean;
  didPrestige: boolean;
  totalWins: number;
  puzzlesSolved: number;
  dailyCompleted: number;
};

export function getProgressionSnapshot(): LevelSnapshot & { prestige: Prestige; totalWins: number } {
  const state = loadProgression();
  return { ...computeLevel(state.levelXp), prestige: state.prestige, totalWins: state.totalWins };
}

export function awardXpForWin(params: {
  score: number;
  mode: string;
  isPuzzle?: boolean;
  isDaily?: boolean;
}): WinResult {
  const state = loadProgression();
  const earned = xpForWin(params.score);
  const prevSnapshot = computeLevel(state.levelXp);

  let newLevelXp = state.levelXp + earned;
  let newPrestige = state.prestige;
  let didPrestige = false;

  if (newLevelXp >= MAX_CYCLE_XP && newPrestige < MAX_PRESTIGE) {
    newLevelXp = Math.max(0, newLevelXp - MAX_CYCLE_XP);
    newPrestige = (newPrestige + 1) as Prestige;
    didPrestige = true;
  } else if (newLevelXp >= MAX_CYCLE_XP) {
    newLevelXp = MAX_CYCLE_XP;
  }

  const newSnapshot = computeLevel(newLevelXp);
  const didLevelUp = newSnapshot.level > prevSnapshot.level || didPrestige;

  const newWinsByMode = {
    ...state.winsByMode,
    [params.mode]: (state.winsByMode[params.mode] ?? 0) + 1,
  };

  const updated = {
    ...state,
    totalXp: state.totalXp + earned,
    prestige: newPrestige,
    levelXp: newLevelXp,
    totalWins: state.totalWins + 1,
    winsByMode: newWinsByMode,
    puzzlesSolved: state.puzzlesSolved + (params.isPuzzle ? 1 : 0),
    dailyCompleted: state.dailyCompleted + (params.isDaily ? 1 : 0),
  };

  saveProgression(updated);

  return {
    xpEarned: earned,
    snapshot: newSnapshot,
    prestige: newPrestige,
    didLevelUp,
    didPrestige,
    totalWins: updated.totalWins,
    puzzlesSolved: updated.puzzlesSolved,
    dailyCompleted: updated.dailyCompleted,
  };
}
