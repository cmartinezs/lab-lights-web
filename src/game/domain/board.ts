export type CellState = 'on' | 'off';

export type BoardSize = {
  rows: number;
  columns: number;
};

export type CellPosition = {
  row: number;
  column: number;
};

export type BoardCell = CellPosition & {
  id: string;
  state: CellState;
};

export type Board = {
  size: BoardSize;
  cells: BoardCell[];
};

export function createEmptyBoard(size: BoardSize): Board {
  return createBoard(size, () => 'off');
}

export function createBoardFromSeed(seed: string, size: BoardSize): { board: Board; setupMoves: CellPosition[] } {
  const setupMoves = createSeededSetupMoves(seed, size);
  const board = setupMoves.reduce((currentBoard, position) => toggleCellAndAdjacent(currentBoard, position), createEmptyBoard(size));

  return { board, setupMoves };
}

export function getAdjacentPositions(size: BoardSize, position: CellPosition): CellPosition[] {
  const candidates: CellPosition[] = [
    position,
    { row: position.row - 1, column: position.column },
    { row: position.row + 1, column: position.column },
    { row: position.row, column: position.column - 1 },
    { row: position.row, column: position.column + 1 },
  ];

  return candidates.filter((candidate) => isInsideBoard(size, candidate));
}

export function toggleCellAndAdjacent(board: Board, position: CellPosition): Board {
  const affectedIds = new Set(getAdjacentPositions(board.size, position).map(getCellId));

  return {
    ...board,
    cells: board.cells.map((cell) =>
      affectedIds.has(cell.id)
        ? {
            ...cell,
            state: invertCellState(cell.state),
          }
        : cell,
    ),
  };
}

// Mirror: applies toggle at position and its horizontal mirror (opposite row, same column).
// Both positions use standard toggleCellAndAdjacent. If the mirror lands on the same row
// (center row of an odd-sized board), only one toggle is applied.
export function toggleCellMirror(board: Board, position: CellPosition): Board {
  const mirrorRow = board.size.rows - 1 - position.row;
  const after = toggleCellAndAdjacent(board, position);
  if (mirrorRow === position.row) return after;
  return toggleCellAndAdjacent(after, { row: mirrorRow, column: position.column });
}

// Chain Reaction: standard toggle followed by one cascade wave.
// Every cell that flips from on→off in the primary toggle triggers another
// standard toggle centered on itself.
export function toggleCellChain(board: Board, position: CellPosition): Board {
  const before = board;
  const after = toggleCellAndAdjacent(board, position);

  const chainSources = after.cells.filter((cell) => {
    const prev = before.cells.find((c) => c.id === cell.id);
    return prev?.state === 'on' && cell.state === 'off';
  });

  return chainSources.reduce(
    (b, cell) => toggleCellAndAdjacent(b, { row: cell.row, column: cell.column }),
    after,
  );
}

// Chaos: applies a deterministic perturbation (seeded random toggle) to the board.
// Called after every Nth user move; perturbIndex increments each time.
export function applyChaosPerturbation(board: Board, seed: string, perturbIndex: number): Board {
  const rng = createSeededRandom(`${seed}-chaos-${perturbIndex}`);
  const cellIndex = Math.floor(rng() * board.cells.length);
  const cell = board.cells[cellIndex];
  if (!cell) return board;
  return toggleCellAndAdjacent(board, { row: cell.row, column: cell.column });
}

export function invertBoard(board: Board): Board {
  return {
    ...board,
    cells: board.cells.map((cell) => ({ ...cell, state: invertCellState(cell.state) })),
  };
}

export function isVictory(board: Board): boolean {
  return board.cells.every((cell) => cell.state === 'off');
}

export function countLitCells(board: Board): number {
  return board.cells.reduce((count, cell) => count + (cell.state === 'on' ? 1 : 0), 0);
}

export function getCellId(position: CellPosition): string {
  return `${position.row}-${position.column}`;
}

function createBoard(size: BoardSize, resolveState: (position: CellPosition) => CellState): Board {
  const cells = Array.from({ length: size.rows * size.columns }, (_, index) => {
    const position = {
      row: Math.floor(index / size.columns),
      column: index % size.columns,
    };

    return {
      ...position,
      id: getCellId(position),
      state: resolveState(position),
    };
  });

  return { size, cells };
}

function createSeededSetupMoves(seed: string, size: BoardSize): CellPosition[] {
  const random = createSeededRandom(seed);
  const totalCells = size.rows * size.columns;
  const moveCount = 3 + Math.floor(random() * 4);

  return Array.from({ length: moveCount }, () => {
    const cellIndex = Math.floor(random() * totalCells);

    return {
      row: Math.floor(cellIndex / size.columns),
      column: cellIndex % size.columns,
    };
  });
}

function createSeededRandom(seed: string): () => number {
  let hash = 2166136261;

  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash += 0x6d2b79f5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function invertCellState(state: CellState): CellState {
  return state === 'on' ? 'off' : 'on';
}

function isInsideBoard(size: BoardSize, position: CellPosition): boolean {
  return position.row >= 0 && position.row < size.rows && position.column >= 0 && position.column < size.columns;
}
