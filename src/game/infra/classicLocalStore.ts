import type { ClassicGameSession } from '../application/classicGame';

export type ClassicResultRecord = {
  id: string;
  initials: string;
  score: number;
  moves: number;
  elapsedSeconds: number;
  seed: string;
  createdAt: string;
};

const currentSeedKey = 'lab-lights:classic-current-seed';
const playedSeedsKey = 'lab-lights:classic-played-seeds';
const resultsKey = 'lab-lights:classic-results';

export function loadCurrentClassicSeed(fallbackSeed: string): string {
  return globalThis.localStorage?.getItem(currentSeedKey) ?? fallbackSeed;
}

export function saveCurrentClassicSeed(seed: string) {
  globalThis.localStorage?.setItem(currentSeedKey, seed);
}

export function rememberPlayedClassicSeed(seed: string) {
  const seeds = loadPlayedClassicSeeds();

  if (seeds.includes(seed)) {
    return;
  }

  globalThis.localStorage?.setItem(playedSeedsKey, JSON.stringify([seed, ...seeds].slice(0, 25)));
}

export function createUnplayedClassicSeed() {
  const playedSeeds = new Set(loadPlayedClassicSeeds());
  let attempt = 0;

  while (attempt < 20) {
    const seed = `classic-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}-${attempt}`;

    if (!playedSeeds.has(seed)) {
      return seed;
    }

    attempt += 1;
  }

  return `classic-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

export function saveClassicResult(session: ClassicGameSession, initials: string): ClassicResultRecord {
  const results = loadClassicResults();
  const existingResult = results.find((result) => result.seed === session.seed);

  if (existingResult) {
    return existingResult;
  }

  const result: ClassicResultRecord = {
    id: crypto.randomUUID?.() ?? `${session.seed}-${Date.now()}`,
    initials,
    score: session.score,
    moves: session.moves,
    elapsedSeconds: session.elapsedMilliseconds / 1000,
    seed: session.seed,
    createdAt: new Date().toISOString(),
  };

  globalThis.localStorage?.setItem(resultsKey, JSON.stringify(sortClassicResults([result, ...results]).slice(0, 10)));

  return result;
}

export function loadClassicResults(): ClassicResultRecord[] {
  return sortClassicResults(parseJsonArray(globalThis.localStorage?.getItem(resultsKey)).filter(isClassicResultRecord));
}

export function sortClassicResults(results: ClassicResultRecord[]): ClassicResultRecord[] {
  return [...results].sort((firstResult, secondResult) => {
    if (secondResult.score !== firstResult.score) {
      return secondResult.score - firstResult.score;
    }

    if (firstResult.elapsedSeconds !== secondResult.elapsedSeconds) {
      return firstResult.elapsedSeconds - secondResult.elapsedSeconds;
    }

    return firstResult.moves - secondResult.moves;
  });
}

function loadPlayedClassicSeeds(): string[] {
  return parseJsonArray(globalThis.localStorage?.getItem(playedSeedsKey)).filter(
    (value): value is string => typeof value === 'string',
  );
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

function isClassicResultRecord(value: unknown): value is ClassicResultRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ClassicResultRecord>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.initials === 'string' &&
    typeof candidate.score === 'number' &&
    typeof candidate.moves === 'number' &&
    typeof candidate.elapsedSeconds === 'number' &&
    typeof candidate.seed === 'string' &&
    typeof candidate.createdAt === 'string'
  );
}
