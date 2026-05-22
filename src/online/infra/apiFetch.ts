import { ApiError, type ApiErrorDto } from '../api/contract';
import { loadToken } from './authStore';

// In production: set VITE_API_URL=https://api.lab-lights.app/v1
// In dev (no VITE_API_URL): calls /v1/... which MSW intercepts transparently.
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/v1';

type FetchOpts = {
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  skipAuth?: boolean;
  commandId?: string;  // → X-Command-Id header for idempotent submissions
};

export async function apiFetch<T>(
  method: 'GET' | 'POST',
  path: string,
  opts: FetchOpts = {},
): Promise<T> {
  const url = buildUrl(path, opts.params);
  const token = opts.skipAuth ? null : loadToken();

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (opts.commandId) headers['X-Command-Id'] = opts.commandId;

  const init: RequestInit = {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  };

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Sin conexión. Verifica tu red e inténtalo de nuevo.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new ApiError(response.status, 'PARSE_ERROR', 'Respuesta inesperada del servidor.');
  }

  if (!response.ok) {
    const err = json as ApiErrorDto;
    throw new ApiError(
      response.status,
      err?.code ?? 'INTERNAL_ERROR',
      err?.message ?? 'Error del servidor.',
    );
  }

  return json as T;
}

function buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
  const base = `${API_BASE}${path}`;
  if (!params || Object.keys(params).length === 0) return base;
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();
  return `${base}?${qs}`;
}
