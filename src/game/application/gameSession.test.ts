import { describe, expect, it } from 'vitest';
import {
  applyAddMoves, applyAddTime, applyMove, applyShuffle,
  consumeUndo, startGame, tickGame,
} from './gameSession';
import { createGameConfig } from '../domain/gameConfig';

describe('classic game session', () => {
  it('starts a local Classic game from a deterministic seed', () => {
    const session = startGame(createGameConfig('classic', { rows: 3, columns: 3 }), 'r3-session');

    expect(session.board.size).toEqual({ rows: 3, columns: 3 });
    expect(session.moves).toBe(0);
    expect(session.status).toBe('playing');
    expect(session.seed).toBe('r3-session');
    expect(session.powerUpsUsed).toEqual([]);
    expect(session.continued).toBe(false);
    expect(session.undosRemaining).toBe(3);
  });

  it('wins after replaying the seeded setup moves', () => {
    const session = startGame(createGameConfig('classic', { rows: 3, columns: 3 }), 'r3-session-win');
    const wonSession = session.setupMoves.reduce(
      (current, move, index) => applyMove(current, move, 1_000 + index * 1_000),
      session,
    );

    expect(wonSession.status).toBe('won');
    expect(wonSession.litCells).toBe(0);
    expect(wonSession.moves).toBeLessThanOrEqual(session.setupMoves.length);
    expect(wonSession.score).toBe(Math.round(900 / wonSession.moves));
  });

  it('applies -30% score penalty when continued flag is set', () => {
    const session = startGame(createGameConfig('classic', { rows: 3, columns: 3 }), 'r3-session-cont', { continued: true });
    const wonSession = session.setupMoves.reduce(
      (current, move, index) => applyMove(current, move, 1_000 + index * 1_000),
      session,
    );

    expect(wonSession.status).toBe('won');
    const baseScore = Math.round(900 / wonSession.moves);
    expect(wonSession.score).toBe(Math.round(baseScore * 0.7));
  });
});

describe('dimensional game session', () => {
  it('starts a 7×7 dimensional game', () => {
    const session = startGame(createGameConfig('dimensional', { rows: 7, columns: 7 }), 'dim-7x7');

    expect(session.board.size).toEqual({ rows: 7, columns: 7 });
    expect(session.board.cells.length).toBe(49);
    expect(session.status).toBe('playing');
  });
});

describe('time attack', () => {
  it('marks session as lost when time limit is exceeded', () => {
    const config = createGameConfig('time-attack', { rows: 3, columns: 3 });
    const session = startGame(config, 'ta-seed');

    expect(config.timeLimit).toBeGreaterThan(0);

    const firstMove = session.setupMoves[0];
    expect(firstMove).toBeDefined();

    const afterFirstMove = applyMove(session, firstMove!, 1_000);
    const timeoutMs = (config.timeLimit! + 1) * 1000;
    const lostSession = tickGame(afterFirstMove, afterFirstMove.startedAt! + timeoutMs);

    expect(lostSession.status).toBe('lost');
    expect(lostSession.score).toBe(0);
  });

  it('wins normally if solved before time limit', () => {
    const config = createGameConfig('time-attack', { rows: 3, columns: 3 });
    const session = startGame(config, 'ta-win-seed');
    const wonSession = session.setupMoves.reduce(
      (current, move, index) => applyMove(current, move, 1_000 + index * 500),
      session,
    );

    expect(wonSession.status).toBe('won');
    expect(wonSession.score).toBeGreaterThan(0);
  });

  it('applyAddTime extends the time limit', () => {
    const config = createGameConfig('time-attack', { rows: 3, columns: 3 });
    const session = startGame(config, 'ta-addtime');
    const original = session.config.timeLimit ?? 0;
    const extended = applyAddTime(session, 30);

    expect(extended.config.timeLimit).toBe(original + 30);
    expect(extended.powerUpsUsed).toContain('add-time');
  });

  it('applyAddTime is no-op on non-time-attack mode', () => {
    const session = startGame(createGameConfig('classic', { rows: 3, columns: 3 }), 'classic-seed');
    const unchanged = applyAddTime(session, 30);
    expect(unchanged).toBe(session);
  });
});

describe('move limit', () => {
  it('marks session as lost when move limit is reached without winning', () => {
    const config = createGameConfig('move-limit', { rows: 3, columns: 3 });
    const session = startGame(config, 'ml-nowin-seed');

    expect(config.moveLimit).toBeGreaterThan(0);

    let current = session;

    for (let i = 0; i < config.moveLimit! && current.status === 'playing'; i++) {
      current = applyMove(current, { row: 0, column: 0 });
    }

    if (current.status !== 'won') {
      expect(current.status).toBe('lost');
      expect(current.score).toBe(0);
    }
  });

  it('wins with bonus score if solved within move limit', () => {
    const config = createGameConfig('move-limit', { rows: 3, columns: 3 });
    const session = startGame(config, 'ml-win-seed');
    const wonSession = session.setupMoves.reduce(
      (current, move) => applyMove(current, move),
      session,
    );

    expect(wonSession.status).toBe('won');
    expect(wonSession.score).toBeGreaterThan(Math.round(900 / wonSession.moves));
  });

  it('applyAddMoves extends the move limit', () => {
    const config = createGameConfig('move-limit', { rows: 3, columns: 3 });
    const session = startGame(config, 'ml-addmoves');
    const original = session.config.moveLimit ?? 0;
    const extended = applyAddMoves(session, 5);

    expect(extended.config.moveLimit).toBe(original + 5);
    expect(extended.powerUpsUsed).toContain('add-moves');
  });
});

describe('power-ups', () => {
  it('consumeUndo decrements undosRemaining and records usage', () => {
    const session = startGame(createGameConfig('classic', { rows: 3, columns: 3 }), 'undo-seed');
    expect(session.undosRemaining).toBe(3);

    const after = consumeUndo(session);
    expect(after.undosRemaining).toBe(2);
    expect(after.powerUpsUsed).toContain('undo');
  });

  it('consumeUndo does not go below 0', () => {
    let session = startGame(createGameConfig('classic', { rows: 3, columns: 3 }), 'undo-seed2');
    session = consumeUndo(consumeUndo(consumeUndo(consumeUndo(session))));
    expect(session.undosRemaining).toBe(0);
  });

  it('applyShuffle changes the seed and resets moves', () => {
    const session = startGame(createGameConfig('classic', { rows: 3, columns: 3 }), 'shuffle-seed');
    const shuffled = applyShuffle(session);

    expect(shuffled.seed).not.toBe(session.seed);
    expect(shuffled.moves).toBe(0);
    expect(shuffled.powerUpsUsed).toContain('shuffle');
  });
});
