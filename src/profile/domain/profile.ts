export type LocalProfile = {
  initials: string;
  gamesRecorded: number;
  bestScore: number;
  bestTimeSeconds: number | null;
};

export function createProfile(initials: string): LocalProfile {
  return { initials, gamesRecorded: 0, bestScore: 0, bestTimeSeconds: null };
}

export function updateProfileWithWin(
  profile: LocalProfile,
  params: { score: number; elapsedSeconds: number },
): LocalProfile {
  return {
    ...profile,
    gamesRecorded: profile.gamesRecorded + 1,
    bestScore: Math.max(profile.bestScore, params.score),
    bestTimeSeconds:
      profile.bestTimeSeconds === null
        ? params.elapsedSeconds
        : Math.min(profile.bestTimeSeconds, params.elapsedSeconds),
  };
}
