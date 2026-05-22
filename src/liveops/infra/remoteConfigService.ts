import { apiFetch } from '../../online/infra/apiFetch';
import { DEFAULT_REMOTE_CONFIG, type RemoteConfig } from '../domain/remoteConfig';

const CACHE_KEY    = 'lab-lights:remote-config';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export function getCachedRemoteConfig(): RemoteConfig {
  try {
    const raw = globalThis.localStorage?.getItem(CACHE_KEY);
    if (!raw) return DEFAULT_REMOTE_CONFIG;
    const { config, cachedAt } = JSON.parse(raw) as { config: RemoteConfig; cachedAt: number };
    if (Date.now() - cachedAt > CACHE_TTL_MS) return DEFAULT_REMOTE_CONFIG;
    return config;
  } catch {
    return DEFAULT_REMOTE_CONFIG;
  }
}

export async function fetchRemoteConfig(): Promise<RemoteConfig> {
  const cached = getCachedRemoteConfig();
  // Return cached immediately if still valid — skip network round-trip
  if (cached !== DEFAULT_REMOTE_CONFIG) return cached;

  try {
    const data = await apiFetch<RemoteConfig>('GET', '/config', { skipAuth: true });
    globalThis.localStorage?.setItem(CACHE_KEY, JSON.stringify({ config: data, cachedAt: Date.now() }));
    return data;
  } catch {
    return DEFAULT_REMOTE_CONFIG;
  }
}
