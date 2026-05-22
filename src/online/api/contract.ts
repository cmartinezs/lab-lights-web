// TypeScript types derived from docs/api-contract.openapi.yaml
// Any change to the OpenAPI spec must be reflected here.

// ── Requests ────────────────────────────────────────────────────

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
  referredBy?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SubmitScoreRequest = {
  mode: string;
  rows: number;
  columns: number;
  seed: string;
  score: number;
  moves: number;
  elapsedSeconds: number;
  hmac: string;
  moveSequence: { row: number; col: number }[];
  powerUpsUsed: string[];
  continued: boolean;
};

// ── DTOs (server responses) ──────────────────────────────────────

export type AccountDto = {
  id: string;
  username: string;
  email: string;
  referralCode: string;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  account: AccountDto;
};

export type MeResponse = {
  account: AccountDto;
};

export type SubmitScoreResponse = {
  submissionId: string;
  accepted: boolean;
  rank: number | null;
  reason?: string;
};

export type RankingEntry = {
  rank: number;
  username: string;
  score: number;
  moves: number;
  elapsedSeconds: number;
  submittedAt: string;
};

export type RankingResponse = {
  mode: string;
  rows: number;
  columns: number;
  entries: RankingEntry[];
  updatedAt: string;
};

export type HealthResponse = {
  status: 'ok';
  version: string;
  timestamp: string;
};

export type ApiErrorDto = {
  code: string;
  message: string;
};

// ── Error codes ──────────────────────────────────────────────────

export const API_ERROR_CODES = {
  EMAIL_TAKEN: 'EMAIL_TAKEN',
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REPLAY_MISMATCH: 'REPLAY_MISMATCH',
  HMAC_FAILED: 'HMAC_FAILED',
  SCORE_MISMATCH: 'SCORE_MISMATCH',
  AIDED_GAME: 'AIDED_GAME',
  DUPLICATE_SEED: 'DUPLICATE_SEED',
  SUSPICIOUS_SPEED: 'SUSPICIOUS_SPEED',
  INVALID_MODE: 'INVALID_MODE',
  UNSUPPORTED_MODE: 'UNSUPPORTED_MODE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

// ── Client-side error class ───────────────────────────────────────

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
