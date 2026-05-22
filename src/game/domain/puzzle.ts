export type Puzzle = {
  id: string;
  seed: string;
};

// Initial puzzle bank for R7. Par is computed at runtime from setupMoves.length.
// Seeds are fixed so puzzles are reproducible across devices and sessions.
export const PUZZLE_BANK: Puzzle[] = [
  { id: 'p01', seed: 'puzzle-lab-001' },
  { id: 'p02', seed: 'puzzle-lab-002' },
  { id: 'p03', seed: 'puzzle-lab-003' },
  { id: 'p04', seed: 'puzzle-lab-004' },
  { id: 'p05', seed: 'puzzle-lab-005' },
  { id: 'p06', seed: 'puzzle-lab-006' },
  { id: 'p07', seed: 'puzzle-lab-007' },
  { id: 'p08', seed: 'puzzle-lab-008' },
  { id: 'p09', seed: 'puzzle-lab-009' },
  { id: 'p10', seed: 'puzzle-lab-010' },
];

export function getPuzzle(index: number): Puzzle {
  return PUZZLE_BANK[index % PUZZLE_BANK.length] ?? PUZZLE_BANK[0]!;
}

export function getPuzzleCount(): number {
  return PUZZLE_BANK.length;
}
