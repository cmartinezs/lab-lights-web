import {
  applyChaosPerturbation,
  countLitCells,
  createBoardFromSeed,
  invertBoard,
  isVictory,
  toggleCellAndAdjacent,
  toggleCellChain,
  toggleCellMirror,
  type Board,
  type CellPosition,
} from '../domain/board';
import type { GameConfig } from '../domain/gameConfig';
import { calculateClassicScore, calculateMoveLimitScore, calculatePuzzleScore, calculateTimeAttackScore } from '../domain/score';

export type GameStatus = 'playing' | 'won' | 'lost';

export type PowerUpId = 'undo' | 'shuffle' | 'add-time' | 'add-moves' | 'invert';

export type GameSession = {
  config: GameConfig;
  board: Board;
  seed: string;
  setupMoves: CellPosition[];
  moveSequence: CellPosition[];
  moves: number;
  elapsedSeconds: number;
  elapsedMilliseconds: number;
  startedAt: number | null;
  finishedAt: number | null;
  status: GameStatus;
  score: number;
  litCells: number;
  powerUpsUsed: PowerUpId[];
  continued: boolean;
  undosRemaining: number;
  puzzlePar: number | null;     // puzzle mode only: setup-move count = known solution length
};

type SessionInput = {
  config: GameConfig;
  board: Board;
  seed: string;
  setupMoves: CellPosition[];
  moveSequence?: CellPosition[];
  moves: number;
  elapsedMilliseconds: number;
  startedAt: number | null;
  finishedAt: number | null;
  powerUpsUsed?: PowerUpId[];
  continued?: boolean;
  undosRemaining?: number;
  puzzlePar?: number | null;
};

export function startGame(config: GameConfig, seed?: string, opts?: { continued?: boolean }): GameSession {
  const actualSeed = seed ?? createDefaultSeed(config);
  const { board, setupMoves } = createBoardFromSeed(actualSeed, config.size);

  return buildSession({
    config,
    board,
    seed: actualSeed,
    setupMoves,
    moveSequence: [],
    moves: 0,
    elapsedMilliseconds: 0,
    startedAt: null,
    finishedAt: null,
    powerUpsUsed: [],
    continued: opts?.continued ?? false,
    undosRemaining: 3,
    puzzlePar: config.mode === 'puzzle' ? setupMoves.length : null,
  });
}

export function applyMove(session: GameSession, position: CellPosition, now = Date.now()): GameSession {
  if (session.status !== 'playing') {
    return session;
  }

  const mode = session.config.mode;
  let board = session.board;
  let extraMoveSeq: CellPosition[] = [];

  if (mode === 'mirror') {
    // Record both toggled positions so standard replay reconstructs the same board.
    const mirrorRow = board.size.rows - 1 - position.row;
    board = toggleCellMirror(board, position);
    if (mirrorRow !== position.row) {
      extraMoveSeq = [{ row: mirrorRow, column: position.column }];
    }
  } else if (mode === 'chain') {
    board = toggleCellChain(board, position);
  } else {
    board = toggleCellAndAdjacent(board, position);
  }

  const moves = session.moves + 1;

  // Chaos: apply one deterministic perturbation every 3 user moves.
  if (mode === 'chaos' && moves % 3 === 0) {
    board = applyChaosPerturbation(board, session.seed, moves / 3 - 1);
  }

  const startedAt = session.startedAt ?? now;
  const won = isVictory(board);
  const finishedAt = won ? now : null;
  const elapsedMilliseconds = Math.max(0, (finishedAt ?? now) - startedAt);

  return buildSession({
    config: session.config,
    board,
    seed: session.seed,
    setupMoves: session.setupMoves,
    moveSequence: [...(session.moveSequence ?? []), position, ...extraMoveSeq],
    moves,
    elapsedMilliseconds,
    startedAt,
    finishedAt,
    powerUpsUsed: session.powerUpsUsed,
    continued: session.continued,
    undosRemaining: session.undosRemaining,
    puzzlePar: session.puzzlePar,
  });
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
    moveSequence: session.moveSequence,
    moves: session.moves,
    elapsedMilliseconds: session.elapsedMilliseconds,
    startedAt: session.startedAt,
    finishedAt: null,
    powerUpsUsed: [...session.powerUpsUsed, 'invert'],
    continued: session.continued,
    undosRemaining: session.undosRemaining,
  });
}

export function applyAddTime(session: GameSession, seconds: number): GameSession {
  if (session.config.mode !== 'time-attack') return session;
  const newConfig = { ...session.config, timeLimit: (session.config.timeLimit ?? 0) + seconds };
  return buildSession({
    ...session,
    config: newConfig,
    powerUpsUsed: [...session.powerUpsUsed, 'add-time'],
  });
}

export function applyAddMoves(session: GameSession, count: number): GameSession {
  if (session.config.mode !== 'move-limit') return session;
  const newConfig = { ...session.config, moveLimit: (session.config.moveLimit ?? 0) + count };
  return buildSession({
    ...session,
    config: newConfig,
    powerUpsUsed: [...session.powerUpsUsed, 'add-moves'],
  });
}

export function applyShuffle(session: GameSession): GameSession {
  const newSeed = `${session.config.mode}-${session.config.size.rows}x${session.config.size.columns}-${Date.now().toString(36)}`;
  const { board, setupMoves } = createBoardFromSeed(newSeed, session.config.size);
  return buildSession({
    ...session,
    board,
    seed: newSeed,
    setupMoves,
    moveSequence: [],
    moves: 0,
    powerUpsUsed: [...session.powerUpsUsed, 'shuffle'],
  });
}

export function consumeUndo(session: GameSession): GameSession {
  return {
    ...session,
    undosRemaining: Math.max(0, session.undosRemaining - 1),
    powerUpsUsed: [...session.powerUpsUsed, 'undo'],
  };
}

const MIN_MS_PER_MOVE = 200;

export function verifyBoardIntegrity(session: GameSession): boolean {
  if (session.status !== 'won') return false;

  // Plausibility: at least MIN_MS_PER_MOVE per move (catches time manipulation).
  // Threshold of 100ms ensures genuine game data before firing (avoids false positives
  // from synchronous test environments where elapsed ≈ 0-5ms).
  const PLAUSIBILITY_MIN_ELAPSED_MS = 100;
  if (
    session.elapsedMilliseconds >= PLAUSIBILITY_MIN_ELAPSED_MS &&
    session.moves > 0 &&
    session.elapsedMilliseconds / session.moves < MIN_MS_PER_MOVE
  ) {
    return false;
  }

  // Aided games or chaos (chaos perturbations are deterministic but complex to replay here;
  // the seeded RNG guarantees reproducibility at the server level).
  if (
    session.config.mode === 'chaos' ||
    session.powerUpsUsed.includes('invert') ||
    session.continued
  ) {
    return true;
  }

  // Replay from seed. Chain mode uses its own toggle function; mirror/puzzle/blind use standard.
  // (Mirror records both positions in moveSequence, so standard replay reconstructs correctly.)
  const { board: initial } = createBoardFromSeed(session.seed, session.config.size);
  const toggleFn = session.config.mode === 'chain' ? toggleCellChain : toggleCellAndAdjacent;
  const finalBoard = session.moveSequence.reduce((b, pos) => toggleFn(b, pos), initial);
  return isVictory(finalBoard);
}

function buildSession(input: SessionInput): GameSession {
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
      case 'puzzle': {
        const par = input.puzzlePar ?? moves;
        score = calculatePuzzleScore(par, moves, totalCells);
        break;
      }
      default:
        score = calculateClassicScore({ totalCells, moves });
    }
    // Continuation penalty: -30% when the player continued after a loss
    if (input.continued) {
      score = Math.round(score * 0.7);
    }
  }

  return {
    ...input,
    elapsedSeconds,
    status,
    score,
    litCells: countLitCells(board),
    moveSequence: input.moveSequence ?? [],
    powerUpsUsed: input.powerUpsUsed ?? [],
    continued: input.continued ?? false,
    undosRemaining: input.undosRemaining ?? 3,
    puzzlePar: input.puzzlePar ?? null,
  };
}

function createDefaultSeed(config: GameConfig): string {
  return `${config.mode}-${config.size.rows}x${config.size.columns}-${Date.now().toString(36)}`;
}
