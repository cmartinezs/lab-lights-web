import { describe, expect, it } from 'vitest';
import {
  applyChaosPerturbation,
  countLitCells,
  createBoardFromSeed,
  createEmptyBoard,
  getAdjacentPositions,
  isVictory,
  toggleCellAndAdjacent,
  toggleCellChain,
  toggleCellMirror,
} from './board';

const CLASSIC_SIZE = { rows: 3, columns: 3 };

describe('classic board rules', () => {
  it('returns orthogonal adjacency without diagonals or wrap-around', () => {
    expect(getAdjacentPositions({ rows: 3, columns: 3 }, { row: 1, column: 1 })).toEqual([
      { row: 1, column: 1 },
      { row: 0, column: 1 },
      { row: 2, column: 1 },
      { row: 1, column: 0 },
      { row: 1, column: 2 },
    ]);

    expect(getAdjacentPositions({ rows: 3, columns: 3 }, { row: 0, column: 0 })).toEqual([
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 0, column: 1 },
    ]);
  });

  it('toggles the selected cell and its orthogonal adjacent cells', () => {
    const board = toggleCellAndAdjacent(createEmptyBoard(CLASSIC_SIZE), { row: 1, column: 1 });

    expect(countLitCells(board)).toBe(5);
    expect(board.cells.filter((cell) => cell.state === 'on').map((cell) => cell.id)).toEqual([
      '0-1',
      '1-0',
      '1-1',
      '1-2',
      '2-1',
    ]);
  });

  it('detects victory when all lights are off', () => {
    expect(isVictory(createEmptyBoard(CLASSIC_SIZE))).toBe(true);
    expect(isVictory(toggleCellAndAdjacent(createEmptyBoard(CLASSIC_SIZE), { row: 0, column: 0 }))).toBe(false);
  });

  it('creates deterministic seeded boards that can be solved by replaying setup moves', () => {
    const { board, setupMoves } = createBoardFromSeed('r1-test-seed', CLASSIC_SIZE);
    const solvedBoard = setupMoves.reduce(
      (currentBoard, move) => toggleCellAndAdjacent(currentBoard, move),
      board,
    );

    expect(setupMoves.length).toBeGreaterThan(0);
    expect(isVictory(solvedBoard)).toBe(true);
  });
});

describe('mirror mode (toggleCellMirror)', () => {
  it('toggles both the clicked row and its horizontal mirror', () => {
    // Click (0,1) on 3×3 → mirror row = 2. Both rows toggled, shared center column double-flips.
    const board = toggleCellMirror(createEmptyBoard(CLASSIC_SIZE), { row: 0, column: 1 });
    // top toggle (0,1): lights 0-0, 0-1, 0-2, 1-1 → 4 on
    // bottom toggle (2,1): lights 1-1 (flips back), 2-0, 2-1, 2-2 → net -1 +3 = 6 total
    expect(countLitCells(board)).toBe(6);
  });

  it('applies only one toggle on the center row of an odd board', () => {
    // Click (1,1) on 3×3 → mirror row = 1 (same), only one toggle applied
    const board = toggleCellMirror(createEmptyBoard(CLASSIC_SIZE), { row: 1, column: 1 });
    expect(countLitCells(board)).toBe(5); // identical to toggleCellAndAdjacent
  });
});

describe('chain mode (toggleCellChain)', () => {
  it('behaves like a standard toggle when no cells flip off', () => {
    const board = createEmptyBoard(CLASSIC_SIZE);
    const chain = toggleCellChain(board, { row: 0, column: 0 });
    const standard = toggleCellAndAdjacent(board, { row: 0, column: 0 });
    expect(countLitCells(chain)).toBe(countLitCells(standard));
  });

  it('cascades when cells that were on flip off during primary toggle', () => {
    // Pre-light (0,1) so it is on when we chain-toggle it
    const prelit = toggleCellAndAdjacent(createEmptyBoard(CLASSIC_SIZE), { row: 1, column: 1 });
    const afterChain = toggleCellChain(prelit, { row: 0, column: 1 });
    // Without chain, toggling (0,1) on the pre-lit board gives some count.
    const afterStandard = toggleCellAndAdjacent(prelit, { row: 0, column: 1 });
    // Chain fires cascades from any on→off flips, so result differs from standard.
    expect(countLitCells(afterChain)).not.toBe(countLitCells(afterStandard));
  });
});

describe('chaos perturbation (applyChaosPerturbation)', () => {
  it('is deterministic for the same seed and index', () => {
    const board = createEmptyBoard(CLASSIC_SIZE);
    const a = applyChaosPerturbation(board, 'chaos-seed', 0);
    const b = applyChaosPerturbation(board, 'chaos-seed', 0);
    expect(a.cells.map((c) => c.state)).toEqual(b.cells.map((c) => c.state));
  });

  it('produces different outcomes for different perturbIndex values', () => {
    const board = createEmptyBoard(CLASSIC_SIZE);
    const a = applyChaosPerturbation(board, 'chaos-seed', 0);
    const b = applyChaosPerturbation(board, 'chaos-seed', 1);
    expect(a.cells.map((c) => c.state)).not.toEqual(b.cells.map((c) => c.state));
  });

  it('always lights at least one cell on an empty board', () => {
    const board = createEmptyBoard(CLASSIC_SIZE);
    const after = applyChaosPerturbation(board, 'chaos-seed', 0);
    expect(countLitCells(after)).toBeGreaterThan(0);
  });
});

describe('board size limits', () => {
  it('creates a 10×10 board with the correct number of cells', () => {
    const { board } = createBoardFromSeed('big-board', { rows: 10, columns: 10 });

    expect(board.cells.length).toBe(100);
    expect(board.size).toEqual({ rows: 10, columns: 10 });
  });

  it('creates a non-square board correctly', () => {
    const { board } = createBoardFromSeed('rect-board', { rows: 4, columns: 7 });

    expect(board.cells.length).toBe(28);
    expect(board.size).toEqual({ rows: 4, columns: 7 });
  });

  it('seeded 10×10 board can be solved by replaying setup moves', () => {
    const { board, setupMoves } = createBoardFromSeed('big-seed', { rows: 10, columns: 10 });
    const solvedBoard = setupMoves.reduce(
      (currentBoard, move) => toggleCellAndAdjacent(currentBoard, move),
      board,
    );

    expect(isVictory(solvedBoard)).toBe(true);
  });
});
