import { createProfile, type LocalProfile } from '../domain/profile';

const PROFILES_KEY = 'lab-lights:profiles';
const LAST_INITIALS_KEY = 'lab-lights:last-initials';
const FALLBACK_INITIALS = 'LAB';

type ProfilesMap = Record<string, LocalProfile>;

export function loadProfile(initials: string): LocalProfile {
  return loadProfilesMap()[initials] ?? createProfile(initials);
}

export function saveProfile(profile: LocalProfile): void {
  const map = loadProfilesMap();

  map[profile.initials] = profile;
  globalThis.localStorage?.setItem(PROFILES_KEY, JSON.stringify(map));
}

export function loadAllProfiles(): LocalProfile[] {
  return Object.values(loadProfilesMap());
}

export function loadLastInitials(): string {
  return globalThis.localStorage?.getItem(LAST_INITIALS_KEY) ?? FALLBACK_INITIALS;
}

export function saveLastInitials(initials: string): void {
  globalThis.localStorage?.setItem(LAST_INITIALS_KEY, initials);
}

function loadProfilesMap(): ProfilesMap {
  const raw = globalThis.localStorage?.getItem(PROFILES_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    const map: ProfilesMap = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (isLocalProfile(value)) {
        map[key] = value;
      }
    }

    return map;
  } catch {
    return {};
  }
}

function isLocalProfile(value: unknown): value is LocalProfile {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const c = value as Partial<LocalProfile>;

  return (
    typeof c.initials === 'string' &&
    typeof c.gamesRecorded === 'number' &&
    typeof c.bestScore === 'number' &&
    (c.bestTimeSeconds === null || typeof c.bestTimeSeconds === 'number')
  );
}
