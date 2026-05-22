export type ClassicScoreInput = {
  totalCells: number;
  moves: number;
};

export function calculateClassicScore({ totalCells, moves }: ClassicScoreInput): number {
  if (moves <= 0) {
    return 0;
  }

  return Math.round((totalCells * 100) / moves);
}

export function calculateTimeAttackScore(totalCells: number, moves: number, remainingSeconds: number): number {
  if (moves <= 0) {
    return 0;
  }

  return Math.round((totalCells * 100) / moves) + Math.round(remainingSeconds * 5);
}

export function calculateMoveLimitScore(totalCells: number, moves: number, remainingMoves: number): number {
  if (moves <= 0) {
    return 0;
  }

  return Math.round((totalCells * 100) / moves) + remainingMoves * 10;
}

// Puzzle: classic formula + par-beat bonus (50 pts per move under par).
export function calculatePuzzleScore(par: number, moves: number, totalCells: number): number {
  if (moves <= 0) return 0;
  const base = Math.round((totalCells * 100) / moves);
  const parBonus = moves <= par ? (par - moves + 1) * 50 : 0;
  return base + parBonus;
}
