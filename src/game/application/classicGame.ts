import {
  countLitCells,
  createClassicBoardFromSeed,
  isVictory,
  toggleCellAndAdjacent,
  type Board,
  type CellPosition,
} from '../domain/board';
import { calculateClassicScore } from '../domain/score';

export type ClassicGameStatus = 'playing' | 'won';

export type ClassicGameSession = {
  board: Board;
  seed: string;
  setupMoves: CellPosition[];
  moves: number;
  elapsedSeconds: number;
  elapsedMilliseconds: number;
  startedAt: number | null;
  finishedAt: number | null;
  status: ClassicGameStatus;
  score: number;
  litCells: number;
};

export function startClassicGame(seed = createDefaultClassicSeed()): ClassicGameSession {
  const { board, setupMoves } = createClassicBoardFromSeed(seed);

  return createSession({
    board,
    seed,
    setupMoves,
    moves: 0,
    elapsedMilliseconds: 0,
    startedAt: null,
    finishedAt: null,
  });
}

export function applyClassicMove(session: ClassicGameSession, position: CellPosition, now = Date.now()): ClassicGameSession {
  if (session.status === 'won') {
    return session;
  }

  const board = toggleCellAndAdjacent(session.board, position);
  const moves = session.moves + 1;
  const startedAt = session.startedAt ?? now;
  const won = isVictory(board);
  const finishedAt = won ? now : null;
  const elapsedMilliseconds = Math.max(0, (finishedAt ?? now) - startedAt);

  return createSession({
    board,
    seed: session.seed,
    setupMoves: session.setupMoves,
    moves,
    elapsedMilliseconds,
    startedAt,
    finishedAt,
  });
}

export function tickClassicGame(session: ClassicGameSession, now = Date.now()): ClassicGameSession {
  if (session.startedAt === null || session.status === 'won') {
    return session;
  }

  return {
    ...session,
    elapsedMilliseconds: Math.max(0, now - session.startedAt),
    elapsedSeconds: Math.max(0, Math.floor((now - session.startedAt) / 1000)),
  };
}

export function restartClassicGame(session: ClassicGameSession): ClassicGameSession {
  return startClassicGame(session.seed);
}

export function startNextClassicGame(): ClassicGameSession {
  return startClassicGame(createDefaultClassicSeed());
}

export function startClassicGameWithSeed(seed: string): ClassicGameSession {
  return startClassicGame(seed);
}

function createSession(input: {
  board: Board;
  seed: string;
  setupMoves: CellPosition[];
  moves: number;
  elapsedMilliseconds: number;
  startedAt: number | null;
  finishedAt: number | null;
}): ClassicGameSession {
  const status = isVictory(input.board) ? 'won' : 'playing';

  return {
    ...input,
    elapsedSeconds: Math.floor(input.elapsedMilliseconds / 1000),
    status,
    score:
      status === 'won'
        ? calculateClassicScore({
            totalCells: input.board.cells.length,
            moves: input.moves,
          })
        : 0,
    litCells: countLitCells(input.board),
  };
}

function createDefaultClassicSeed() {
  return `classic-${Date.now().toString(36)}`;
}
