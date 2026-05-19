import { DEFAULT_PROFILE, type LocalProfile } from '../domain/profile';

const PROFILE_KEY = 'lab-lights:profile';

export function loadProfile(): LocalProfile {
  const raw = globalThis.localStorage?.getItem(PROFILE_KEY);

  if (!raw) {
    return { ...DEFAULT_PROFILE };
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    return isLocalProfile(parsed) ? parsed : { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: LocalProfile): void {
  globalThis.localStorage?.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function isLocalProfile(value: unknown): value is LocalProfile {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<LocalProfile>;

  return (
    typeof candidate.initials === 'string' &&
    typeof candidate.gamesRecorded === 'number' &&
    typeof candidate.bestScore === 'number' &&
    (candidate.bestTimeSeconds === null || typeof candidate.bestTimeSeconds === 'number')
  );
}
