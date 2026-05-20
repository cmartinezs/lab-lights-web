import type { GameConfig, GameMode } from '../domain/gameConfig';
import type { GameSession } from '../application/gameSession';

export type GameResultRecord = {
  id: string;
  initials: string;
  mode: GameMode;
  rows: number;
  columns: number;
  score: number;
  moves: number;
  elapsedSeconds: number;
  seed: string;
  createdAt: string;
  verified: boolean;
  hmac?: string;
};

function modeKey(mode: GameMode): string {
  return `lab-lights:${mode}`;
}

function configSeedKey(config: GameConfig): string {
  return `lab-lights:current-seed:${config.mode}:${config.size.rows}x${config.size.columns}`;
}

function configPlayedKey(config: GameConfig): string {
  return `lab-lights:played-seeds:${config.mode}:${config.size.rows}x${config.size.columns}`;
}

// Current seed

export function loadCurrentSeed(config: GameConfig, fallbackSeed: string): string {
  return globalThis.localStorage?.getItem(configSeedKey(config)) ?? fallbackSeed;
}

export function saveCurrentSeed(config: GameConfig, seed: string) {
  globalThis.localStorage?.setItem(configSeedKey(config), seed);
}

// Played seeds

export function rememberPlayedSeed(config: GameConfig, seed: string) {
  const seeds = loadPlayedSeeds(config);

  if (seeds.includes(seed)) {
    return;
  }

  globalThis.localStorage?.setItem(configPlayedKey(config), JSON.stringify([seed, ...seeds].slice(0, 25)));
}

export function createUnplayedSeed(config: GameConfig): string {
  const playedSeeds = new Set(loadPlayedSeeds(config));
  let attempt = 0;

  while (attempt < 20) {
    const seed = `${config.mode}-${config.size.rows}x${config.size.columns}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}-${attempt}`;

    if (!playedSeeds.has(seed)) {
      return seed;
    }

    attempt++;
  }

  return `${config.mode}-${config.size.rows}x${config.size.columns}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

// Results — stored per mode, each record carries size info

export function saveResult(session: GameSession, initials: string): GameResultRecord {
  const { config } = session;
  const all = loadAllModeResults(config.mode);
  const existing = all.find((r) => r.seed === session.seed);

  if (existing) {
    return existing;
  }

  const record: GameResultRecord = {
    id: crypto.randomUUID?.() ?? `${session.seed}-${Date.now()}`,
    initials,
    mode: config.mode,
    rows: config.size.rows,
    columns: config.size.columns,
    score: session.score,
    moves: session.moves,
    elapsedSeconds: session.elapsedMilliseconds / 1000,
    seed: session.seed,
    createdAt: new Date().toISOString(),
    verified: false,
  };

  const updated = [record, ...all];
  // keep top 10 per size combination, not globally
  const capped = capResultsPerSize(updated, 10);

  globalThis.localStorage?.setItem(modeKey(config.mode), JSON.stringify(capped));

  return record;
}

export type SaveResultData = {
  mode: GameMode;
  rows: number;
  columns: number;
  seed: string;
  score: number;
  moves: number;
  elapsedSeconds: number;
  verified?: boolean;
  hmac?: string;
};

export function saveResultData(data: SaveResultData, initials: string): GameResultRecord {
  const all = loadAllModeResults(data.mode);
  const existing = all.find((r) => r.seed === data.seed);

  if (existing) {
    return existing;
  }

  const record: GameResultRecord = {
    id: crypto.randomUUID?.() ?? `${data.seed}-${Date.now()}`,
    initials,
    mode: data.mode,
    rows: data.rows,
    columns: data.columns,
    score: data.score,
    moves: data.moves,
    elapsedSeconds: data.elapsedSeconds,
    seed: data.seed,
    createdAt: new Date().toISOString(),
    verified: data.verified ?? false,
    hmac: data.hmac,
  };

  const updated = [record, ...all];
  const capped = capResultsPerSize(updated, 10);
  globalThis.localStorage?.setItem(modeKey(data.mode), JSON.stringify(capped));

  return record;
}

export function loadResults(config: GameConfig): GameResultRecord[] {
  return sortResults(
    loadAllModeResults(config.mode).filter(
      (r) => r.rows === config.size.rows && r.columns === config.size.columns,
    ),
  );
}

export function updateResultHmac(seed: string, mode: GameMode, hmac: string) {
  const all = parseJsonArray(globalThis.localStorage?.getItem(modeKey(mode)))
    .filter(isGameResultRecord);
  const updated = all.map((r) => (r.seed === seed ? { ...r, hmac } : r));
  globalThis.localStorage?.setItem(modeKey(mode), JSON.stringify(updated));
}

export function loadAllModeResults(mode: GameMode): GameResultRecord[] {
  return parseJsonArray(globalThis.localStorage?.getItem(modeKey(mode)))
    .filter(isGameResultRecord)
    .filter((r) => r.verified !== false);
}

export function sortResults(results: GameResultRecord[]): GameResultRecord[] {
  return [...results].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.elapsedSeconds !== b.elapsedSeconds) return a.elapsedSeconds - b.elapsedSeconds;

    return a.moves - b.moves;
  });
}

export type GlobalStats = {
  totalScore: number;
  totalCoins: number;
  byMode: Record<GameMode, number>;
};

const ALL_MODES: GameMode[] = ['classic', 'dimensional', 'time-attack', 'move-limit'];

export function loadGlobalStats(): GlobalStats {
  const byMode = {} as Record<GameMode, number>;
  let totalScore = 0;
  let totalCoins = 0;

  for (const mode of ALL_MODES) {
    const results = loadAllModeResults(mode);
    const best = results.reduce((mx, r) => Math.max(mx, r.score), 0);
    byMode[mode] = best;
    for (const r of results) {
      totalScore += r.score;
      totalCoins += Math.round(r.score / 200);
    }
  }

  return { totalScore, totalCoins, byMode };
}

// Saved config

const savedConfigKey = 'lab-lights:game-config';

export function loadSavedConfig(): GameConfig | null {
  try {
    const raw = globalThis.localStorage?.getItem(savedConfigKey);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as GameConfig;
  } catch {
    return null;
  }
}

export function saveConfig(config: GameConfig) {
  globalThis.localStorage?.setItem(savedConfigKey, JSON.stringify(config));
}

// Helpers

function loadPlayedSeeds(config: GameConfig): string[] {
  return parseJsonArray(globalThis.localStorage?.getItem(configPlayedKey(config))).filter(
    (v): v is string => typeof v === 'string',
  );
}

function capResultsPerSize(results: GameResultRecord[], perSizeCap: number): GameResultRecord[] {
  const bySize = new Map<string, GameResultRecord[]>();

  for (const r of results) {
    const key = `${r.rows}x${r.columns}`;
    const bucket = bySize.get(key) ?? [];
    bucket.push(r);
    bySize.set(key, bucket);
  }

  const capped: GameResultRecord[] = [];

  for (const bucket of bySize.values()) {
    capped.push(...sortResults(bucket).slice(0, perSizeCap));
  }

  return capped;
}

function parseJsonArray(value: string | null | undefined): unknown[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isGameResultRecord(value: unknown): value is GameResultRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const c = value as Partial<GameResultRecord>;

  return (
    typeof c.id === 'string' &&
    typeof c.initials === 'string' &&
    typeof c.mode === 'string' &&
    typeof c.rows === 'number' &&
    typeof c.columns === 'number' &&
    typeof c.score === 'number' &&
    typeof c.moves === 'number' &&
    typeof c.elapsedSeconds === 'number' &&
    typeof c.seed === 'string' &&
    typeof c.createdAt === 'string'
    // verified is optional for backwards compat with pre-R4 records
  );
}
