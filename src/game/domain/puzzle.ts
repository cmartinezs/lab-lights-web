export type PuzzleDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type Puzzle = {
  id: string;
  seed: string;
  difficulty: PuzzleDifficulty;
};

export const PUZZLE_BANK: Puzzle[] = [
  // Easy (p001–p025)
  { id: 'p001', seed: 'puzzle-lab-001', difficulty: 'easy' },
  { id: 'p002', seed: 'puzzle-lab-002', difficulty: 'easy' },
  { id: 'p003', seed: 'puzzle-lab-003', difficulty: 'easy' },
  { id: 'p004', seed: 'puzzle-lab-004', difficulty: 'easy' },
  { id: 'p005', seed: 'puzzle-lab-005', difficulty: 'easy' },
  { id: 'p006', seed: 'puzzle-lab-006', difficulty: 'easy' },
  { id: 'p007', seed: 'puzzle-lab-007', difficulty: 'easy' },
  { id: 'p008', seed: 'puzzle-lab-008', difficulty: 'easy' },
  { id: 'p009', seed: 'puzzle-lab-009', difficulty: 'easy' },
  { id: 'p010', seed: 'puzzle-lab-010', difficulty: 'easy' },
  { id: 'p011', seed: 'puzzle-lab-011', difficulty: 'easy' },
  { id: 'p012', seed: 'puzzle-lab-012', difficulty: 'easy' },
  { id: 'p013', seed: 'puzzle-lab-013', difficulty: 'easy' },
  { id: 'p014', seed: 'puzzle-lab-014', difficulty: 'easy' },
  { id: 'p015', seed: 'puzzle-lab-015', difficulty: 'easy' },
  { id: 'p016', seed: 'puzzle-lab-016', difficulty: 'easy' },
  { id: 'p017', seed: 'puzzle-lab-017', difficulty: 'easy' },
  { id: 'p018', seed: 'puzzle-lab-018', difficulty: 'easy' },
  { id: 'p019', seed: 'puzzle-lab-019', difficulty: 'easy' },
  { id: 'p020', seed: 'puzzle-lab-020', difficulty: 'easy' },
  { id: 'p021', seed: 'puzzle-lab-021', difficulty: 'easy' },
  { id: 'p022', seed: 'puzzle-lab-022', difficulty: 'easy' },
  { id: 'p023', seed: 'puzzle-lab-023', difficulty: 'easy' },
  { id: 'p024', seed: 'puzzle-lab-024', difficulty: 'easy' },
  { id: 'p025', seed: 'puzzle-lab-025', difficulty: 'easy' },

  // Medium (p026–p055)
  { id: 'p026', seed: 'puzzle-lab-026', difficulty: 'medium' },
  { id: 'p027', seed: 'puzzle-lab-027', difficulty: 'medium' },
  { id: 'p028', seed: 'puzzle-lab-028', difficulty: 'medium' },
  { id: 'p029', seed: 'puzzle-lab-029', difficulty: 'medium' },
  { id: 'p030', seed: 'puzzle-lab-030', difficulty: 'medium' },
  { id: 'p031', seed: 'puzzle-lab-031', difficulty: 'medium' },
  { id: 'p032', seed: 'puzzle-lab-032', difficulty: 'medium' },
  { id: 'p033', seed: 'puzzle-lab-033', difficulty: 'medium' },
  { id: 'p034', seed: 'puzzle-lab-034', difficulty: 'medium' },
  { id: 'p035', seed: 'puzzle-lab-035', difficulty: 'medium' },
  { id: 'p036', seed: 'puzzle-lab-036', difficulty: 'medium' },
  { id: 'p037', seed: 'puzzle-lab-037', difficulty: 'medium' },
  { id: 'p038', seed: 'puzzle-lab-038', difficulty: 'medium' },
  { id: 'p039', seed: 'puzzle-lab-039', difficulty: 'medium' },
  { id: 'p040', seed: 'puzzle-lab-040', difficulty: 'medium' },
  { id: 'p041', seed: 'puzzle-lab-041', difficulty: 'medium' },
  { id: 'p042', seed: 'puzzle-lab-042', difficulty: 'medium' },
  { id: 'p043', seed: 'puzzle-lab-043', difficulty: 'medium' },
  { id: 'p044', seed: 'puzzle-lab-044', difficulty: 'medium' },
  { id: 'p045', seed: 'puzzle-lab-045', difficulty: 'medium' },
  { id: 'p046', seed: 'puzzle-lab-046', difficulty: 'medium' },
  { id: 'p047', seed: 'puzzle-lab-047', difficulty: 'medium' },
  { id: 'p048', seed: 'puzzle-lab-048', difficulty: 'medium' },
  { id: 'p049', seed: 'puzzle-lab-049', difficulty: 'medium' },
  { id: 'p050', seed: 'puzzle-lab-050', difficulty: 'medium' },
  { id: 'p051', seed: 'puzzle-lab-051', difficulty: 'medium' },
  { id: 'p052', seed: 'puzzle-lab-052', difficulty: 'medium' },
  { id: 'p053', seed: 'puzzle-lab-053', difficulty: 'medium' },
  { id: 'p054', seed: 'puzzle-lab-054', difficulty: 'medium' },
  { id: 'p055', seed: 'puzzle-lab-055', difficulty: 'medium' },

  // Hard (p056–p082)
  { id: 'p056', seed: 'puzzle-lab-056', difficulty: 'hard' },
  { id: 'p057', seed: 'puzzle-lab-057', difficulty: 'hard' },
  { id: 'p058', seed: 'puzzle-lab-058', difficulty: 'hard' },
  { id: 'p059', seed: 'puzzle-lab-059', difficulty: 'hard' },
  { id: 'p060', seed: 'puzzle-lab-060', difficulty: 'hard' },
  { id: 'p061', seed: 'puzzle-lab-061', difficulty: 'hard' },
  { id: 'p062', seed: 'puzzle-lab-062', difficulty: 'hard' },
  { id: 'p063', seed: 'puzzle-lab-063', difficulty: 'hard' },
  { id: 'p064', seed: 'puzzle-lab-064', difficulty: 'hard' },
  { id: 'p065', seed: 'puzzle-lab-065', difficulty: 'hard' },
  { id: 'p066', seed: 'puzzle-lab-066', difficulty: 'hard' },
  { id: 'p067', seed: 'puzzle-lab-067', difficulty: 'hard' },
  { id: 'p068', seed: 'puzzle-lab-068', difficulty: 'hard' },
  { id: 'p069', seed: 'puzzle-lab-069', difficulty: 'hard' },
  { id: 'p070', seed: 'puzzle-lab-070', difficulty: 'hard' },
  { id: 'p071', seed: 'puzzle-lab-071', difficulty: 'hard' },
  { id: 'p072', seed: 'puzzle-lab-072', difficulty: 'hard' },
  { id: 'p073', seed: 'puzzle-lab-073', difficulty: 'hard' },
  { id: 'p074', seed: 'puzzle-lab-074', difficulty: 'hard' },
  { id: 'p075', seed: 'puzzle-lab-075', difficulty: 'hard' },
  { id: 'p076', seed: 'puzzle-lab-076', difficulty: 'hard' },
  { id: 'p077', seed: 'puzzle-lab-077', difficulty: 'hard' },
  { id: 'p078', seed: 'puzzle-lab-078', difficulty: 'hard' },
  { id: 'p079', seed: 'puzzle-lab-079', difficulty: 'hard' },
  { id: 'p080', seed: 'puzzle-lab-080', difficulty: 'hard' },
  { id: 'p081', seed: 'puzzle-lab-081', difficulty: 'hard' },
  { id: 'p082', seed: 'puzzle-lab-082', difficulty: 'hard' },

  // Expert (p083–p100)
  { id: 'p083', seed: 'puzzle-lab-083', difficulty: 'expert' },
  { id: 'p084', seed: 'puzzle-lab-084', difficulty: 'expert' },
  { id: 'p085', seed: 'puzzle-lab-085', difficulty: 'expert' },
  { id: 'p086', seed: 'puzzle-lab-086', difficulty: 'expert' },
  { id: 'p087', seed: 'puzzle-lab-087', difficulty: 'expert' },
  { id: 'p088', seed: 'puzzle-lab-088', difficulty: 'expert' },
  { id: 'p089', seed: 'puzzle-lab-089', difficulty: 'expert' },
  { id: 'p090', seed: 'puzzle-lab-090', difficulty: 'expert' },
  { id: 'p091', seed: 'puzzle-lab-091', difficulty: 'expert' },
  { id: 'p092', seed: 'puzzle-lab-092', difficulty: 'expert' },
  { id: 'p093', seed: 'puzzle-lab-093', difficulty: 'expert' },
  { id: 'p094', seed: 'puzzle-lab-094', difficulty: 'expert' },
  { id: 'p095', seed: 'puzzle-lab-095', difficulty: 'expert' },
  { id: 'p096', seed: 'puzzle-lab-096', difficulty: 'expert' },
  { id: 'p097', seed: 'puzzle-lab-097', difficulty: 'expert' },
  { id: 'p098', seed: 'puzzle-lab-098', difficulty: 'expert' },
  { id: 'p099', seed: 'puzzle-lab-099', difficulty: 'expert' },
  { id: 'p100', seed: 'puzzle-lab-100', difficulty: 'expert' },
];

export function getPuzzle(index: number): Puzzle {
  return PUZZLE_BANK[index % PUZZLE_BANK.length] ?? PUZZLE_BANK[0]!;
}

export function getPuzzleCount(): number {
  return PUZZLE_BANK.length;
}

export function getPuzzlesByDifficulty(difficulty: PuzzleDifficulty): Puzzle[] {
  return PUZZLE_BANK.filter((p) => p.difficulty === difficulty);
}
