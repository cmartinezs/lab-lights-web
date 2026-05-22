import type { AccountDto, LoginRequest, RegisterRequest } from '../api/contract';
import { apiFetch } from '../infra/apiFetch';
import { clearAuth, loadAccount, saveAuth } from '../infra/authStore';

export async function register(req: RegisterRequest): Promise<AccountDto> {
  const res = await apiFetch<{ token: string; account: AccountDto }>(
    'POST',
    '/auth/register',
    { body: req, skipAuth: true },
  );
  saveAuth(res.token, res.account);
  return res.account;
}

export async function login(req: LoginRequest): Promise<AccountDto> {
  const res = await apiFetch<{ token: string; account: AccountDto }>(
    'POST',
    '/auth/login',
    { body: req, skipAuth: true },
  );
  saveAuth(res.token, res.account);
  return res.account;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<void>('POST', '/auth/logout');
  } finally {
    clearAuth();
  }
}

export function getAccount(): AccountDto | null {
  return loadAccount();
}

export function isLoggedIn(): boolean {
  return loadAccount() !== null;
}
