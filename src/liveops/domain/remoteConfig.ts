export type RemoteConfig = {
  dailyBonusCoins: number;
  streakMultiplier: number;
  streakCap: number;
};

export const DEFAULT_REMOTE_CONFIG: RemoteConfig = {
  dailyBonusCoins: 50,
  streakMultiplier: 10,
  streakCap: 7,
};

export function calcDailyReward(config: RemoteConfig, streak: number): number {
  return config.dailyBonusCoins + Math.min(streak, config.streakCap) * config.streakMultiplier;
}
