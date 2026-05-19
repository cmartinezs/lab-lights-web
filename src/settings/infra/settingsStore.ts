import { DEFAULT_SETTINGS, type LocalSettings } from '../domain/settings';

const SETTINGS_KEY = 'lab-lights:settings';

export function loadSettings(): LocalSettings {
  const raw = globalThis.localStorage?.getItem(SETTINGS_KEY);

  if (!raw) {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    return isLocalSettings(parsed) ? parsed : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: LocalSettings): void {
  globalThis.localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function isLocalSettings(value: unknown): value is LocalSettings {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<LocalSettings>;

  return typeof candidate.reducedMotion === 'boolean' && typeof candidate.colorBlind === 'boolean';
}
