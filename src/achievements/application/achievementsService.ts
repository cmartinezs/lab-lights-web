import { type AchievementId, ACHIEVEMENTS, findAchievement } from '../domain/achievements';
import { isUnlocked, saveUnlock, loadUnlocked } from '../infra/achievementsStore';
import { getBalance } from '../../economy/infra/walletStore';
import type { Achievement } from '../domain/achievements';

export { ACHIEVEMENTS, findAchievement };
export type { AchievementId, Achievement };
export { loadUnlocked };

export type CheckContext = {
  mode: string;
  score: number;
  moves: number;
  elapsedSeconds: number;
  win: boolean;
  streak?: number;
  level?: number;
  prestige?: number;
  totalWins?: number;
  puzzlesSolved?: number;
  dailyCompleted?: number;
};

function unlock(id: AchievementId, out: AchievementId[]): void {
  if (!isUnlocked(id)) {
    saveUnlock(id);
    out.push(id);
  }
}

export function checkAndUnlock(ctx: CheckContext): AchievementId[] {
  const newlyUnlocked: AchievementId[] = [];
  const totalWins = ctx.totalWins ?? 0;

  if (ctx.win) {
    unlock('first-win', newlyUnlocked);
    if (totalWins >= 10)  unlock('apprentice',  newlyUnlocked);
    if (totalWins >= 50)  unlock('researcher',  newlyUnlocked);
    if (totalWins >= 100) unlock('expert',       newlyUnlocked);
    if (ctx.score >= 500)  unlock('score-500',  newlyUnlocked);
    if (ctx.score >= 1000) unlock('score-1000', newlyUnlocked);
    if (ctx.score >= 5000) unlock('score-5000', newlyUnlocked);
    if (ctx.elapsedSeconds > 0 && ctx.elapsedSeconds < 30) unlock('speed-run',   newlyUnlocked);
    if (ctx.moves <= 3)         unlock('minimalist',  newlyUnlocked);
    if (ctx.mode === 'dimensional')   unlock('dimensional', newlyUnlocked);
    if (ctx.mode === 'blind')         unlock('blind-win',   newlyUnlocked);
    if (ctx.mode === 'mirror')        unlock('mirror-win',  newlyUnlocked);
    if (ctx.mode === 'chaos')         unlock('chaos-win',   newlyUnlocked);
    if (ctx.mode === 'chain')         unlock('chain-win',   newlyUnlocked);
  }

  if ((ctx.puzzlesSolved ?? 0) >= 5)   unlock('puzzle-5', newlyUnlocked);
  if ((ctx.dailyCompleted ?? 0) >= 3)  unlock('daily-3',  newlyUnlocked);
  if ((ctx.streak ?? 0) >= 7)          unlock('streak-7', newlyUnlocked);

  if (getBalance() >= 1000) unlock('coin-1000', newlyUnlocked);

  if ((ctx.level ?? 0) >= 5)    unlock('level-5',    newlyUnlocked);
  if ((ctx.prestige ?? 0) >= 1) unlock('prestige-1', newlyUnlocked);

  return newlyUnlocked;
}
