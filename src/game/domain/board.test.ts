import { describe, expect, it } from 'vitest';
import {
  countLitCells,
  createClassicBoardFromSeed,
  createEmptyClassicBoard,
  getAdjacentPositions,
  isVictory,
  toggleCellAndAdjacent,
} from './board';

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
    const board = toggleCellAndAdjacent(createEmptyClassicBoard(), { row: 1, column: 1 });

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
    expect(isVictory(createEmptyClassicBoard())).toBe(true);
    expect(isVictory(toggleCellAndAdjacent(createEmptyClassicBoard(), { row: 0, column: 0 }))).toBe(false);
  });

  it('creates deterministic seeded boards that can be solved by replaying setup moves', () => {
    const { board, setupMoves } = createClassicBoardFromSeed('r1-test-seed');
    const solvedBoard = setupMoves.reduce((currentBoard, move) => toggleCellAndAdjacent(currentBoard, move), board);

    expect(setupMoves.length).toBeGreaterThan(0);
    expect(isVictory(solvedBoard)).toBe(true);
  });
});
