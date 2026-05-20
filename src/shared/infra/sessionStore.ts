const KEY_HISTORY = 'lab-lights:session-history';
const KEY_CURRENT = 'lab-lights:session-current';
const MAX_ENTRIES = 10;

export type SessionEntry = { ts: number; durMs: number };

export type SessionHistory = {
  last:  SessionEntry | null;   // most recent *completed* session (previous visit)
  all:   SessionEntry[];        // up to MAX_ENTRIES completed sessions
};

function readHistory(): SessionEntry[] {
  try {
    const raw = globalThis.localStorage?.getItem(KEY_HISTORY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as unknown[]).filter(
      (x): x is SessionEntry =>
        typeof x === 'object' && x !== null &&
        typeof (x as SessionEntry).ts === 'number' &&
        typeof (x as SessionEntry).durMs === 'number',
    );
  } catch { return []; }
}

function saveHistory(entries: SessionEntry[]) {
  globalThis.localStorage?.setItem(KEY_HISTORY, JSON.stringify(entries));
}

export function initSession(): SessionHistory {
  // 1. Promote previous "current" session into history
  let history = readHistory();
  try {
    const raw = globalThis.localStorage?.getItem(KEY_CURRENT);
    if (raw) {
      const prev = JSON.parse(raw) as SessionEntry;
      if (prev.durMs > 3_000) {          // ignore ghost sessions < 3 s
        history = [prev, ...history].slice(0, MAX_ENTRIES);
        saveHistory(history);
      }
    }
  } catch { /* ignore malformed */ }

  // 2. Record the start of the current session
  const start = Date.now();
  const flush = () => {
    const entry: SessionEntry = { ts: start, durMs: Date.now() - start };
    globalThis.localStorage?.setItem(KEY_CURRENT, JSON.stringify(entry));
  };

  if (typeof globalThis.addEventListener === 'function') {
    globalThis.addEventListener('beforeunload', flush);
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
  }

  // 3. Return PREVIOUS history (current session not yet completed)
  return { last: history[0] ?? null, all: history };
}

// ── Formatters ────────────────────────────────────────────────

export function relTime(ts: number): string {
  const d = Date.now() - ts;
  const m    = Math.floor(d / 60_000);
  const h    = Math.floor(d / 3_600_000);
  const days = Math.floor(d / 86_400_000);
  if (days >= 1) return `hace ${days}d`;
  if (h   >= 1)  return `hace ${h}h`;
  if (m   >= 1)  return `hace ${m}m`;
  return 'recién';
}

export function fmtDur(ms: number): string {
  const s = Math.floor(ms / 1_000);
  const m = Math.floor(s / 60);
  if (m >= 60) return `${Math.floor(m / 60)}h ${(m % 60).toString().padStart(2, '0')}m`;
  if (m >= 1)  return `${m}m ${(s % 60).toString().padStart(2, '0')}s`;
  return `${s}s`;
}
