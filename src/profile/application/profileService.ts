import { updateProfileWithWin } from '../domain/profile';
import { loadProfile, saveProfile } from '../infra/profileStore';
import type { LocalProfile } from '../domain/profile';

export function getProfile(): LocalProfile {
  return loadProfile();
}

export function recordClassicWin(params: { score: number; elapsedSeconds: number }): LocalProfile {
  const updated = updateProfileWithWin(loadProfile(), params);

  saveProfile(updated);

  return updated;
}

export function saveProfileInitials(initials: string): LocalProfile {
  const updated = { ...loadProfile(), initials: initials.slice(0, 3).toUpperCase() };

  saveProfile(updated);

  return updated;
}
