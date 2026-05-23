const KEY = 'lab-lights:themes';

export type ThemeId = 'cyan' | 'green' | 'amber' | 'magenta' | 'white' | 'neon';

type ThemeState = {
  owned: ThemeId[];
  active: ThemeId;
};

const DEFAULT: ThemeState = { owned: ['cyan', 'green'], active: 'cyan' };

function load(): ThemeState {
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as unknown;
      if (p && typeof p === 'object') {
        const s = p as Partial<ThemeState>;
        if (Array.isArray(s.owned) && typeof s.active === 'string') {
          return s as ThemeState;
        }
      }
    }
  } catch { /* ignore */ }
  return { ...DEFAULT, owned: [...DEFAULT.owned] };
}

function save(state: ThemeState): void {
  globalThis.localStorage?.setItem(KEY, JSON.stringify(state));
}

export function getThemeState(): ThemeState {
  return load();
}

export function isOwned(id: ThemeId): boolean {
  return load().owned.includes(id);
}

export function getActiveTheme(): ThemeId {
  return load().active;
}

export function purchaseTheme(id: ThemeId): boolean {
  const state = load();
  if (state.owned.includes(id)) return false;
  save({ ...state, owned: [...state.owned, id] });
  return true;
}

export function setActiveTheme(id: ThemeId): void {
  const state = load();
  if (!state.owned.includes(id)) return;
  save({ ...state, active: id });
  applyThemeToDocument(id);
}

export type ThemeDef = {
  id: ThemeId;
  name: string;
  accent: string;
  bg: string;
  price: number | null;
};

export const THEME_DEFS: ThemeDef[] = [
  { id: 'cyan',    name: 'Plasma Cyan',    accent: '#3ee7d6', bg: '#062018', price: null },
  { id: 'green',   name: 'CRT Verde',      accent: '#78f26d', bg: '#0a1f10', price: null },
  { id: 'amber',   name: 'Ámbar',          accent: '#f6b84b', bg: '#1f1408', price: 100  },
  { id: 'magenta', name: 'Magenta',        accent: '#ff5dc8', bg: '#1c0a18', price: 120  },
  { id: 'white',   name: 'Alto contraste', accent: '#e8fff8', bg: '#000000', price: 150  },
  { id: 'neon',    name: 'Neón frío',      accent: '#7fa9ff', bg: '#0a1226', price: 200  },
];

export function applyThemeToDocument(id: ThemeId): void {
  const def = THEME_DEFS.find((t) => t.id === id);
  if (!def) return;
  const root = globalThis.document?.documentElement;
  if (!root) return;
  root.style.setProperty('--cyan', def.accent);
  root.style.setProperty('--bg', def.bg);
  root.style.setProperty('--bg-deep', def.bg);
}

export function applyPersistedTheme(): void {
  applyThemeToDocument(getActiveTheme());
}
