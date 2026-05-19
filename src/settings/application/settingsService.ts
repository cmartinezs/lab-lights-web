import { loadSettings, saveSettings } from '../infra/settingsStore';
import type { LocalSettings } from '../domain/settings';

export function getSettings(): LocalSettings {
  return loadSettings();
}

export function updateSettings(patch: Partial<LocalSettings>): LocalSettings {
  const updated = { ...loadSettings(), ...patch };

  saveSettings(updated);
  applySettingsToDocument(updated);

  return updated;
}

export function applySettingsToDocument(settings: LocalSettings): void {
  const root = globalThis.document?.documentElement;

  if (!root) {
    return;
  }

  root.dataset['colorBlind'] = settings.colorBlind ? 'true' : '';
  root.dataset['reducedMotion'] = settings.reducedMotion ? 'true' : '';
}
