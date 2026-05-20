import { updateProfileWithWin } from '../domain/profile';
import { loadAllProfiles, loadLastInitials, loadProfile, saveLastInitials, saveProfile } from '../infra/profileStore';
import type { LocalProfile } from '../domain/profile';

export function getProfile(initials: string): LocalProfile {
  return loadProfile(initials);
}

export function getAllProfiles(): LocalProfile[] {
  return loadAllProfiles().sort((a, b) => {
    if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
    if (a.bestTimeSeconds !== null && b.bestTimeSeconds !== null) return a.bestTimeSeconds - b.bestTimeSeconds;
    return b.gamesRecorded - a.gamesRecorded;
  });
}

export function getLastUsedInitials(): string {
  return loadLastInitials();
}

export function recordWin(
  initials: string,
  params: { score: number; elapsedSeconds: number },
): LocalProfile {
  const updated = updateProfileWithWin(loadProfile(initials), params);

  saveProfile(updated);
  saveLastInitials(initials);

  return updated;
}
