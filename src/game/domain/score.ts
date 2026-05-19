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
