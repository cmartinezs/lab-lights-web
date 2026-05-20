import { beforeEach, describe, expect, it, vi } from 'vitest';
import { earnCoins, getBalance, spendCoins } from './walletStore';

// Mock gameLocalStore so bootstrap doesn't depend on localStorage state
vi.mock('../../game/infra/gameLocalStore', () => ({
  loadGlobalStats: () => ({ totalScore: 0, totalCoins: 0, byMode: {} }),
}));

beforeEach(() => {
  localStorage.clear();
});

describe('walletStore', () => {
  it('starts at 0 on first run', () => {
    expect(getBalance()).toBe(0);
  });

  it('earnCoins increases balance', () => {
    earnCoins(50);
    expect(getBalance()).toBe(50);
  });

  it('spendCoins deducts from balance', () => {
    earnCoins(100);
    const ok = spendCoins(30);
    expect(ok).toBe(true);
    expect(getBalance()).toBe(70);
  });

  it('spendCoins returns false and leaves balance unchanged when insufficient', () => {
    earnCoins(10);
    const ok = spendCoins(20);
    expect(ok).toBe(false);
    expect(getBalance()).toBe(10);
  });

  it('balance persists across calls', () => {
    earnCoins(200);
    spendCoins(50);
    expect(getBalance()).toBe(150);
  });

  it('balance never goes below 0', () => {
    // Directly corrupt stored data to have spent > earned
    localStorage.setItem('lab-lights:wallet', JSON.stringify({ earned: 10, spent: 50 }));
    expect(getBalance()).toBe(0);
  });
});
