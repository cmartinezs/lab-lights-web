import { describe, expect, it } from 'vitest';
import {
  countLitCells,
  createBoardFromSeed,
  createEmptyBoard,
  getAdjacentPositions,
  isVictory,
  toggleCellAndAdjacent,
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
