import type { RankingResponse } from '../api/contract';
import { apiFetch } from '../infra/apiFetch';

export async function fetchOnlineRanking(
  mode: string,
  rows: number,
  cols: number,
  limit = 100,
): Promise<RankingResponse> {
  return apiFetch<RankingResponse>('GET', `/rankings/${mode}`, {
    params: { rows, cols, limit },
    skipAuth: true,
  });
}
