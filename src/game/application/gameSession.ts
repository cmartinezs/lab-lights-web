import {
  countLitCells,
  createBoardFromSeed,
  invertBoard,
  isVictory,
  toggleCellAndAdjacent,
  type Board,
  type CellPosition,
} from '../domain/board';
import type { GameConfig } from '../domain/gameConfig';
import { calculateClassicScore, calculateMoveLimitScore, calculateTimeAttackScore } from '../domain/score';

export type GameStatus = 'playing' | 'won' | 'lost';

export type GameSession = {
  config: GameConfig;
  board: Board;
  seed: string;
  setupMoves: CellPosition[];
  moves: number;
  elapsedSeconds: number;
  elapsedMilliseconds: number;
  startedAt: number | null;
  finishedAt: number | null;
  status: GameStatus;
  score: number;
  litCells: number;
};

export function startGame(config: GameConfig, seed?: string): GameSession {
  const actualSeed = seed ?? createDefaultSeed(config);
  const { board, setupMoves } = createBoardFromSeed(actualSeed, config.size);

  return buildSession({ config, board, seed: actualSeed, setupMoves, moves: 0, elapsedMilliseconds: 0, startedAt: null, finishedAt: null });
}

export function applyMove(session: GameSession, position: CellPosition, now = Date.now()): GameSession {
  if (session.status !== 'playing') {
    return session;
  }

  const board = toggleCellAndAdjacent(session.board, position);
  const moves = session.moves + 1;
  const startedAt = session.startedAt ?? now;
  const won = isVictory(board);
  const finishedAt = won ? now : null;
  const elapsedMilliseconds = Math.max(0, (finishedAt ?? now) - startedAt);

  return buildSession({ config: session.config, board, seed: session.seed, setupMoves: session.setupMoves, moves, elapsedMilliseconds, startedAt, finishedAt });
}

export function tickGame(session: GameSession, now = Date.now()): GameSession {
  if (session.startedAt === null || session.status !== 'playing') {
    return session;
  }

  const elapsedMilliseconds = Math.max(0, now - session.startedAt);

  if (session.config.mode === 'time-attack' && session.config.timeLimit !== undefined) {
    if (elapsedMilliseconds >= session.config.timeLimit * 1000) {
      return buildSession({ ...session, elapsedMilliseconds, finishedAt: now });
    }
  }

  return {
    ...session,
    elapsedMilliseconds,
    elapsedSeconds: Math.floor(elapsedMilliseconds / 1000),
  };
}

export function restartGame(session: GameSession): GameSession {
  return startGame(session.config, session.seed);
}

export function invertGame(session: GameSession): GameSession {
  return buildSession({
    config: session.config,
    board: invertBoard(session.board),
    seed: session.seed,
    setupMoves: session.setupMoves,
    moves: session.moves,
    elapsedMilliseconds: session.elapsedMilliseconds,
    startedAt: session.startedAt,
    finishedAt: null,
  });
}

function buildSession(input: {
  config: GameConfig;
  board: Board;
  seed: string;
  setupMoves: CellPosition[];
  moves: number;
  elapsedMilliseconds: number;
  startedAt: number | null;
  finishedAt: number | null;
}): GameSession {
  const { config, board, moves, elapsedMilliseconds } = input;
  const won = isVictory(board);
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const totalCells = board.cells.length;

  const timeLimitExceeded =
    config.mode === 'time-attack' &&
    config.timeLimit !== undefined &&
    elapsedMilliseconds >= config.timeLimit * 1000 &&
    !won;

  const moveLimitReached =
    config.mode === 'move-limit' && config.moveLimit !== undefined && moves >= config.moveLimit && !won;

  const status: GameStatus = won ? 'won' : timeLimitExceeded || moveLimitReached ? 'lost' : 'playing';

  let score = 0;

  if (won) {
    switch (config.mode) {
      case 'time-attack': {
        const remainingSeconds = Math.max(0, (config.timeLimit ?? 0) - elapsedSeconds);
        score = calculateTimeAttackScore(totalCells, moves, remainingSeconds);
        break;
      }
      case 'move-limit': {
        const remainingMoves = Math.max(0, (config.moveLimit ?? 0) - moves);
        score = calculateMoveLimitScore(totalCells, moves, remainingMoves);
        break;
      }
      default:
        score = calculateClassicScore({ totalCells, moves });
    }
  }

  return {
    ...input,
    elapsedSeconds,
    status,
    score,
    litCells: countLitCells(board),
  };
}

function createDefaultSeed(config: GameConfig): string {
  return `${config.mode}-${config.size.rows}x${config.size.columns}-${Date.now().toString(36)}`;
}
