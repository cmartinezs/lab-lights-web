import type { SubmitScoreRequest, SubmitScoreResponse } from '../api/contract';
import { apiFetch } from '../infra/apiFetch';

export async function submitScore(req: SubmitScoreRequest): Promise<SubmitScoreResponse> {
  return apiFetch<SubmitScoreResponse>('POST', '/scores', { body: req });
}
