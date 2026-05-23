const KEY = 'lab-lights:achievements';

export type UnlockedAchievement = {
  id: string;
  unlockedAt: string;
};

function isRecord(v: unknown): v is UnlockedAchievement {
  return !!v && typeof v === 'object' && typeof (v as Record<string, unknown>).id === 'string';
}

export function loadUnlocked(): UnlockedAchievement[] {
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as unknown;
      if (Array.isArray(p)) return p.filter(isRecord);
    }
  } catch { /* ignore */ }
  return [];
}

export function saveUnlock(id: string): void {
  const existing = loadUnlocked();
  if (existing.some((a) => a.id === id)) return;
  const updated = [...existing, { id, unlockedAt: new Date().toISOString() }];
  globalThis.localStorage?.setItem(KEY, JSON.stringify(updated));
}

export function isUnlocked(id: string): boolean {
  return loadUnlocked().some((a) => a.id === id);
}
