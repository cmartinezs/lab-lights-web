import type { AccountDto } from '../api/contract';

const KEY_TOKEN = 'lab-lights:online:token';
const KEY_ACCOUNT = 'lab-lights:online:account';

export function saveAuth(token: string, account: AccountDto): void {
  globalThis.localStorage?.setItem(KEY_TOKEN, token);
  globalThis.localStorage?.setItem(KEY_ACCOUNT, JSON.stringify(account));
}

export function loadToken(): string | null {
  return globalThis.localStorage?.getItem(KEY_TOKEN) ?? null;
}

export function loadAccount(): AccountDto | null {
  const raw = globalThis.localStorage?.getItem(KEY_ACCOUNT);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AccountDto;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  globalThis.localStorage?.removeItem(KEY_TOKEN);
  globalThis.localStorage?.removeItem(KEY_ACCOUNT);
}

export function isAuthenticated(): boolean {
  return loadToken() !== null;
}
