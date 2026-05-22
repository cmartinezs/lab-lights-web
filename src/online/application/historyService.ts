import type { GameHistoryResponse } from '../api/contract';
import { apiFetch } from '../infra/apiFetch';

export async function fetchHistory(limit = 20, offset = 0): Promise<GameHistoryResponse> {
  return apiFetch<GameHistoryResponse>('GET', '/me/history', { params: { limit, offset } });
}
