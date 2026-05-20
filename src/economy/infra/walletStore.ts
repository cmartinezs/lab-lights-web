import { loadGlobalStats } from '../../game/infra/gameLocalStore';

const KEY = 'lab-lights:wallet';

type WalletData = { earned: number; spent: number };

function load(): WalletData {
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as unknown;
      if (p && typeof p === 'object') {
        const w = p as Partial<WalletData>;
        if (typeof w.earned === 'number' && typeof w.spent === 'number') {
          return w as WalletData;
        }
      }
    }
  } catch { /* ignore */ }
  // First run: bootstrap earned from historical scores so existing users keep their coins
  const bootstrap: WalletData = { earned: loadGlobalStats().totalCoins, spent: 0 };
  save(bootstrap);
  return bootstrap;
}

function save(w: WalletData): void {
  globalThis.localStorage?.setItem(KEY, JSON.stringify(w));
}

export function getBalance(): number {
  const w = load();
  return Math.max(0, w.earned - w.spent);
}

export function earnCoins(amount: number): number {
  if (amount <= 0) return getBalance();
  const w = load();
  const updated = { ...w, earned: w.earned + amount };
  save(updated);
  return Math.max(0, updated.earned - updated.spent);
}

export function spendCoins(amount: number): boolean {
  if (amount <= 0) return true;
  const w = load();
  if (w.earned - w.spent < amount) return false;
  save({ ...w, spent: w.spent + amount });
  return true;
}
