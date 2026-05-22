// MSW request handlers — intercept /v1/* in the browser during development.
// Production fetch calls are identical; MSW is not started in production.
// See: docs/api-contract.openapi.yaml for the full contract specification.

import { http, HttpResponse } from 'msw';
import {
  cacheCommand,
  computeRanking,
  computeRewards,
  findAccountByEmail,
  findAccountByToken,
  findAccountByUsername,
  findCachedCommand,
  generateReferralCode,
  generateToken,
  getAccountScores,
  getDb,
  initDbIfNeeded,
  saveDb,
  type AccountRow,
} from './mockDb';

// Extracts a string path parameter from MSW params (which are typed loosely)
function pathParam(params: Record<string, string | readonly string[]>, key: string): string {
  const val: string | readonly string[] | undefined = params[key];
  if (Array.isArray(val)) return (val as readonly string[])[0] ?? '';
  return (val as string | undefined) ?? '';
}

// Simulates network latency (300–700ms) for realistic UX testing
function delay(ms = 300 + Math.random() * 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function accountToDto(a: AccountRow) {
  return {
    id: a.id,
    username: a.username,
    email: a.email,
    referralCode: a.referralCode,
    createdAt: a.createdAt,
  };
}

function tokenExpiry(): string {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}

function extractBearer(request: Request): string | null {
  const auth = request.headers.get('Authorization') ?? '';
  const match = /^Bearer (.+)$/.exec(auth);
  return match?.[1] ?? null;
}

export const handlers = [

  // ── GET /v1/config ─────────────────────────────────────────
  http.get('/v1/config', async () => {
    await delay(80);
    return HttpResponse.json({
      dailyBonusCoins: 50,
      streakMultiplier: 10,
      streakCap: 7,
    });
  }),

  // ── GET /v1/health ─────────────────────────────────────────
  http.get('/v1/health', async () => {
    await delay(100);
    return HttpResponse.json({
      status: 'ok',
      version: '1.0.0-mock',
      timestamp: new Date().toISOString(),
    });
  }),

  // ── POST /v1/auth/register ──────────────────────────────────
  http.post('/v1/auth/register', async ({ request }) => {
    await delay();
    const body = await request.json() as Record<string, string>;
    const { email, password, username, referredBy } = body;

    if (!email || !password || !username) {
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: 'email, password y username son obligatorios.' },
        { status: 422 },
      );
    }
    if (username.length < 3 || username.length > 16 || !/^[A-Za-z0-9_]+$/.test(username)) {
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: 'El nombre de usuario debe tener entre 3 y 16 caracteres (letras, números y guión bajo).' },
        { status: 422 },
      );
    }
    if (password.length < 8) {
      return HttpResponse.json(
        { code: 'VALIDATION_ERROR', message: 'La contraseña debe tener al menos 8 caracteres.' },
        { status: 422 },
      );
    }

    const db = initDbIfNeeded();

    if (findAccountByEmail(db, email)) {
      return HttpResponse.json(
        { code: 'EMAIL_TAKEN', message: 'Este email ya está registrado.' },
        { status: 409 },
      );
    }
    if (findAccountByUsername(db, username)) {
      return HttpResponse.json(
        { code: 'USERNAME_TAKEN', message: 'Este nombre de usuario ya está en uso.' },
        { status: 409 },
      );
    }

    // Validate referral code exists (optional — soft check only)
    if (referredBy) {
      const referredByValid = db.accounts.some((a) => a.referralCode === referredBy);
      if (!referredByValid && !referredBy.startsWith('LAB-')) {
        return HttpResponse.json(
          { code: 'VALIDATION_ERROR', message: 'Código de referido inválido.' },
          { status: 422 },
        );
      }
    }

    const account: AccountRow = {
      id: crypto.randomUUID(),
      username,
      usernameLower: username.toLowerCase(),
      email,
      emailLower: email.toLowerCase(),
      password,
      referralCode: generateReferralCode(),
      createdAt: new Date().toISOString(),
    };

    const token = generateToken();
    db.accounts.push(account);
    db.tokens.push({ token, accountId: account.id, expiresAt: tokenExpiry() });
    saveDb(db);

    return HttpResponse.json(
      { token, account: accountToDto(account) },
      { status: 201 },
    );
  }),

  // ── POST /v1/auth/login ─────────────────────────────────────
  http.post('/v1/auth/login', async ({ request }) => {
    await delay();
    const { email, password } = await request.json() as { email: string; password: string };

    const db = initDbIfNeeded();
    const account = findAccountByEmail(db, email);

    if (!account || account.password !== password) {
      return HttpResponse.json(
        { code: 'INVALID_CREDENTIALS', message: 'Email o contraseña incorrectos.' },
        { status: 401 },
      );
    }

    const token = generateToken();
    db.tokens.push({ token, accountId: account.id, expiresAt: tokenExpiry() });
    saveDb(db);

    return HttpResponse.json({ token, account: accountToDto(account) });
  }),

  // ── POST /v1/auth/logout ────────────────────────────────────
  http.post('/v1/auth/logout', async ({ request }) => {
    await delay(150);
    const token = extractBearer(request);
    if (token) {
      const db = getDb();
      db.tokens = db.tokens.filter((t) => t.token !== token);
      saveDb(db);
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // ── GET /v1/me ──────────────────────────────────────────────
  http.get('/v1/me', async ({ request }) => {
    await delay(200);
    const token = extractBearer(request);
    if (!token) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Token ausente.' },
        { status: 401 },
      );
    }

    const db = initDbIfNeeded();
    const account = findAccountByToken(db, token);
    if (!account) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Token inválido o expirado.' },
        { status: 401 },
      );
    }

    return HttpResponse.json({ account: accountToDto(account) });
  }),

  // ── POST /v1/scores ─────────────────────────────────────────
  http.post('/v1/scores', async ({ request }) => {
    await delay();
    const token = extractBearer(request);
    if (!token) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Token ausente.' },
        { status: 401 },
      );
    }

    const db = initDbIfNeeded();
    const account = findAccountByToken(db, token);
    if (!account) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Token inválido o expirado.' },
        { status: 401 },
      );
    }

    // R6: X-Command-Id idempotency — return cached result for duplicate commands
    const commandId = request.headers.get('X-Command-Id');
    if (commandId) {
      const cached = findCachedCommand(db, commandId, account.id);
      if (cached !== undefined) {
        return HttpResponse.json(cached, { status: 200 });
      }
    }

    const body = await request.json() as Record<string, unknown>;
    const { mode, rows, columns, seed, score, moves, elapsedSeconds, powerUpsUsed, continued } = body;

    // Mode validation (R5+: classic 3x3 only)
    if (mode !== 'classic' || rows !== 3 || columns !== 3) {
      return HttpResponse.json(
        { code: 'INVALID_MODE', message: 'En R5 solo se aceptan partidas Classic 3×3.' },
        { status: 422 },
      );
    }

    // Aided game check
    const puUsed = Array.isArray(powerUpsUsed) ? powerUpsUsed : [];
    if (continued === true || puUsed.includes('invert')) {
      const rejectedResult = { submissionId: crypto.randomUUID(), accepted: false, rank: null, reason: 'AIDED_GAME', rewards: [] };
      if (commandId) cacheCommand(db, commandId, account.id, rejectedResult);
      saveDb(db);
      return HttpResponse.json(rejectedResult, { status: 200 });
    }

    // Duplicate seed check (per user)
    const duplicate = db.scores.some(
      (s) => s.accountId === account.id && s.seed === seed,
    );
    if (duplicate) {
      const rejectedResult = { submissionId: crypto.randomUUID(), accepted: false, rank: null, reason: 'DUPLICATE_SEED', rewards: [] };
      if (commandId) cacheCommand(db, commandId, account.id, rejectedResult);
      saveDb(db);
      return HttpResponse.json(rejectedResult, { status: 200 });
    }

    // Speed plausibility: < 200ms per move on average → suspicious
    const totalMs = (elapsedSeconds as number) * 1000;
    if ((moves as number) > 0 && totalMs / (moves as number) < 200) {
      const rejectedResult = { submissionId: crypto.randomUUID(), accepted: false, rank: null, reason: 'SUSPICIOUS_SPEED', rewards: [] };
      if (commandId) cacheCommand(db, commandId, account.id, rejectedResult);
      saveDb(db);
      return HttpResponse.json(rejectedResult, { status: 200 });
    }

    // R6: compute rewards before adding score (checks existing count)
    const rewards = computeRewards(db, account.id, 999); // placeholder rank

    // Accept the score
    const newScore = {
      id: crypto.randomUUID(),
      accountId: account.id,
      username: account.username,
      mode: mode as string,
      rows: rows as number,
      columns: columns as number,
      seed: seed as string,
      score: score as number,
      moves: moves as number,
      elapsedSeconds: elapsedSeconds as number,
      submittedAt: new Date().toISOString(),
      commandId: commandId ?? undefined,
      rewards,
    };
    db.scores.push(newScore);

    // Compute actual rank after inserting
    const ranked = computeRanking(db, 'classic', 3, 3);
    const rankIdx = ranked.findIndex((s) => s.username === account.username && s.score === (score as number));
    const rank = rankIdx >= 0 && rankIdx < 100 ? rankIdx + 1 : -1;

    // Re-check rank-based rewards now that we have the actual position
    if (rank > 0 && rank <= 10) {
      const rankRewards = computeRewards(db, account.id, rank);
      rewards.push(...rankRewards);
    }

    const acceptedResult = { submissionId: newScore.id, accepted: true, rank, rewards };
    if (commandId) cacheCommand(db, commandId, account.id, acceptedResult);
    saveDb(db);

    return HttpResponse.json(acceptedResult, { status: 201 });
  }),

  // ── GET /v1/me/history ──────────────────────────────────────
  http.get('/v1/me/history', async ({ request }) => {
    await delay(300);
    const token = extractBearer(request);
    if (!token) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Token ausente.' },
        { status: 401 },
      );
    }

    const db = initDbIfNeeded();
    const account = findAccountByToken(db, token);
    if (!account) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Token inválido o expirado.' },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20', 10), 50);
    const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

    const allScores = getAccountScores(db, account.id);
    const total = allScores.length;
    const pageScores = allScores.slice(offset, offset + limit);

    // Compute rank for each entry
    const ranked = computeRanking(db, 'classic', 3, 3);
    const rankMap = new Map(ranked.map((s, i) => [s.id, i + 1]));

    const entries = pageScores.map((s) => ({
      submissionId: s.id,
      mode: s.mode,
      rows: s.rows,
      columns: s.columns,
      seed: s.seed,
      score: s.score,
      moves: s.moves,
      elapsedSeconds: s.elapsedSeconds,
      rank: rankMap.get(s.id) ?? null,
      rewards: s.rewards ?? [],
      submittedAt: s.submittedAt,
    }));

    return HttpResponse.json({ entries, total, limit, offset });
  }),

  // ── GET /v1/rankings/:mode ──────────────────────────────────
  http.get('/v1/rankings/:mode', async ({ params, request }) => {
    await delay(400);
    const modeParam = pathParam(params as Record<string, string | readonly string[]>, 'mode');
    if (modeParam !== 'classic') {
      return HttpResponse.json(
        { code: 'UNSUPPORTED_MODE', message: 'Modo no disponible en el ranking online.' },
        { status: 404 },
      );
    }

    const url = new URL(request.url);
    const rows = parseInt(url.searchParams.get('rows') ?? '3', 10);
    const cols = parseInt(url.searchParams.get('cols') ?? '3', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100', 10), 100);

    const db = initDbIfNeeded();
    const ranked = computeRanking(db, modeParam, rows, cols).slice(0, limit);

    const entries = ranked.map((s, i) => ({
      rank: i + 1,
      username: s.username,
      score: s.score,
      moves: s.moves,
      elapsedSeconds: s.elapsedSeconds,
      submittedAt: s.submittedAt,
    }));

    return HttpResponse.json({
      mode: modeParam,
      rows,
      columns: cols,
      entries,
      updatedAt: new Date().toISOString(),
    });
  }),
];
