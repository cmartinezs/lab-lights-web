// In-memory + localStorage state for the MSW mock server.
// Persists across page reloads so mock "accounts" survive navigation.

const DB_KEY = 'lab-lights:mock:db';

export type AccountRow = {
  id: string;
  username: string;
  usernameLower: string;
  email: string;
  emailLower: string;
  password: string; // plain text — mock only, never real passwords
  referralCode: string;
  createdAt: string;
};

export type TokenRow = {
  token: string;
  accountId: string;
  expiresAt: string; // ISO
};

export type ScoreRow = {
  id: string;
  accountId: string;
  username: string;
  mode: string;
  rows: number;
  columns: number;
  seed: string;
  score: number;
  moves: number;
  elapsedSeconds: number;
  submittedAt: string;
};

type MockDb = {
  accounts: AccountRow[];
  tokens: TokenRow[];
  scores: ScoreRow[];
  seeded: boolean;
};

function emptyDb(): MockDb {
  return { accounts: [], tokens: [], scores: [], seeded: false };
}

export function getDb(): MockDb {
  try {
    const raw = globalThis.localStorage?.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as MockDb;
  } catch {
    // ignore
  }
  return emptyDb();
}

export function saveDb(db: MockDb): void {
  globalThis.localStorage?.setItem(DB_KEY, JSON.stringify(db));
}

// ── Seed ranking data ───────────────────────────────────────────

const SEED_SCORES: Omit<ScoreRow, 'id' | 'accountId' | 'submittedAt'>[] = [
  { username: 'Neutrino_X',   mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-001', score: 9200, moves: 4, elapsedSeconds: 9.8 },
  { username: 'LaboRat',      mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-002', score: 8950, moves: 5, elapsedSeconds: 12.1 },
  { username: 'CuanticWave',  mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-003', score: 8720, moves: 5, elapsedSeconds: 14.3 },
  { username: 'PhotonBurst',  mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-004', score: 8500, moves: 6, elapsedSeconds: 11.5 },
  { username: 'GammaRay_77',  mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-005', score: 8300, moves: 6, elapsedSeconds: 16.2 },
  { username: 'ElectronQ',    mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-006', score: 8100, moves: 6, elapsedSeconds: 18.9 },
  { username: 'MesonStrike',  mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-007', score: 7900, moves: 7, elapsedSeconds: 13.7 },
  { username: 'BosonHunter',  mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-008', score: 7700, moves: 7, elapsedSeconds: 19.4 },
  { username: 'QuarkStorm',   mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-009', score: 7500, moves: 7, elapsedSeconds: 22.1 },
  { username: 'PlasmaCoil',   mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-010', score: 7200, moves: 8, elapsedSeconds: 17.6 },
  { username: 'NeutronFlash', mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-011', score: 6900, moves: 8, elapsedSeconds: 24.3 },
  { username: 'AlphaDecay',   mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-012', score: 6600, moves: 9, elapsedSeconds: 20.8 },
  { username: 'BetaEmitter',  mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-013', score: 6300, moves: 9, elapsedSeconds: 28.5 },
  { username: 'CyclotronX',   mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-014', score: 6000, moves: 10, elapsedSeconds: 25.2 },
  { username: 'SynchroTron',  mode: 'classic', rows: 3, columns: 3, seed: 'mock-seed-015', score: 5700, moves: 10, elapsedSeconds: 30.1 },
];

export function initDbIfNeeded(): MockDb {
  const db = getDb();
  if (db.seeded) return db;

  const now = new Date();
  // Stagger seed dates over the past 7 days
  const seededScores: ScoreRow[] = SEED_SCORES.map((s, i) => ({
    ...s,
    id: `seed-${i.toString().padStart(3, '0')}`,
    accountId: `seed-account-${i}`,
    submittedAt: new Date(now.getTime() - (i + 1) * 3_600_000).toISOString(),
  }));

  const seeded: MockDb = { ...db, scores: seededScores, seeded: true };
  saveDb(seeded);
  return seeded;
}

// ── Helpers ─────────────────────────────────────────────────────

export function findAccountByEmail(db: MockDb, email: string): AccountRow | undefined {
  return db.accounts.find((a) => a.emailLower === email.toLowerCase());
}

export function findAccountByUsername(db: MockDb, username: string): AccountRow | undefined {
  return db.accounts.find((a) => a.usernameLower === username.toLowerCase());
}

export function findAccountByToken(db: MockDb, token: string): AccountRow | undefined {
  const tokenRow = db.tokens.find(
    (t) => t.token === token && new Date(t.expiresAt) > new Date(),
  );
  if (!tokenRow) return undefined;
  return db.accounts.find((a) => a.id === tokenRow.accountId);
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'LAB-';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function generateToken(): string {
  // Simple random token for mock (not a real JWT)
  return `mock-token-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function computeRanking(db: MockDb, mode: string, rows: number, cols: number): ScoreRow[] {
  // Best score per username (combining seeded bots and real users)
  const bestByUser = new Map<string, ScoreRow>();
  for (const s of db.scores) {
    if (s.mode !== mode || s.rows !== rows || s.columns !== cols) continue;
    const current = bestByUser.get(s.username);
    if (!current || s.score > current.score) {
      bestByUser.set(s.username, s);
    }
  }
  return [...bestByUser.values()].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.elapsedSeconds !== b.elapsedSeconds) return a.elapsedSeconds - b.elapsedSeconds;
    return a.moves - b.moves;
  });
}
