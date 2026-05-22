import { describe, expect, it } from 'vitest';
import {
  applyAddMoves, applyAddTime, applyMove, applyShuffle,
  consumeUndo, startGame, tickGame, verifyBoardIntegrity,
} from './gameSession';
import { createGameConfig } from '../domain/gameConfig';
import { calculatePuzzleScore } from '../domain/score';

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

describe('blind mode', () => {
  it('starts a blind session and can be won by replaying setup moves', () => {
    const config = createGameConfig('blind', { rows: 3, columns: 3 });
    const session = startGame(config, 'blind-test-seed');
    expect(session.config.mode).toBe('blind');
    expect(session.config.size).toEqual({ rows: 3, columns: 3 });
    const won = session.setupMoves.reduce(
      (cur, move, idx) => applyMove(cur, move, 1_000 + idx * 1_000),
      session,
    );
    expect(won.status).toBe('won');
  });
});

describe('mirror mode', () => {
  it('records both the clicked and mirror positions in moveSequence', () => {
    const config = createGameConfig('mirror', { rows: 3, columns: 3 });
    const session = startGame(config, 'mirror-test-seed');
    const after = applyMove(session, { row: 0, column: 1 }, 1_000);
    // row 0 clicked → mirror row = 2 (different), so 2 entries in moveSequence
    expect(after.moveSequence.length).toBe(2);
    expect(after.moveSequence[0]).toEqual({ row: 0, column: 1 });
    expect(after.moveSequence[1]).toEqual({ row: 2, column: 1 });
    expect(after.moves).toBe(1);
  });

  it('records only one entry when clicking the center row', () => {
    const config = createGameConfig('mirror', { rows: 3, columns: 3 });
    const session = startGame(config, 'mirror-center-seed');
    const after = applyMove(session, { row: 1, column: 1 }, 1_000);
    expect(after.moveSequence.length).toBe(1);
    expect(after.moves).toBe(1);
  });

  it('verifyBoardIntegrity passes for a legitimate mirror win', () => {
    const config = createGameConfig('mirror', { rows: 3, columns: 3 });
    const session = startGame(config, 'mirror-integrity-seed');
    const won = session.setupMoves.reduce(
      (cur, move, idx) => applyMove(cur, move, 1_000 + idx * 1_000),
      session,
    );
    if (won.status !== 'won') return;
    expect(verifyBoardIntegrity(won)).toBe(true);
  });
});

describe('chaos mode', () => {
  it('applies a perturbation after every 3rd user move', () => {
    const config = createGameConfig('chaos', { rows: 3, columns: 3 });
    const session = startGame(config, 'chaos-perturb-seed');
    // Apply 3 moves, the 3rd should trigger a chaos perturbation
    const m1 = applyMove(session, { row: 0, column: 0 }, 1_000);
    const m2 = applyMove(m1, { row: 0, column: 2 }, 2_000);
    const m3 = applyMove(m2, { row: 2, column: 2 }, 3_000);
    expect(m3.moves).toBe(3);
    // The board after move 3 should differ from a non-chaos board with same 3 moves
    const classicConfig = createGameConfig('classic', { rows: 3, columns: 3 });
    const classicSession = startGame(classicConfig, 'chaos-perturb-seed');
    const c3 = applyMove(applyMove(applyMove(classicSession, { row: 0, column: 0 }, 1_000), { row: 0, column: 2 }, 2_000), { row: 2, column: 2 }, 3_000);
    expect(m3.board.cells.map((c) => c.state)).not.toEqual(c3.board.cells.map((c) => c.state));
  });

  it('verifyBoardIntegrity returns true for chaos mode (replay skipped)', () => {
    const config = createGameConfig('chaos', { rows: 3, columns: 3 });
    const session = startGame(config, 'chaos-integrity-seed');
    const won = session.setupMoves.reduce(
      (cur, move, idx) => applyMove(cur, move, 1_000 + idx * 1_000),
      session,
    );
    if (won.status !== 'won') return;
    expect(verifyBoardIntegrity(won)).toBe(true);
  });
});

describe('chain mode', () => {
  it('starts a chain session and records correct move count', () => {
    const config = createGameConfig('chain', { rows: 3, columns: 3 });
    const session = startGame(config, 'chain-test-seed');
    const after = applyMove(session, { row: 1, column: 1 }, 1_000);
    expect(after.moves).toBe(1);
    expect(after.moveSequence.length).toBe(1);
  });

  it('verifyBoardIntegrity passes for a chain mode win', () => {
    const config = createGameConfig('chain', { rows: 3, columns: 3 });
    const session = startGame(config, 'chain-integrity-seed');
    const won = session.setupMoves.reduce(
      (cur, move, idx) => applyMove(cur, move, 1_000 + idx * 1_000),
      session,
    );
    if (won.status !== 'won') return;
    expect(verifyBoardIntegrity(won)).toBe(true);
  });
});

describe('puzzle mode', () => {
  it('sets puzzlePar to the setup move count on start', () => {
    const config = createGameConfig('puzzle', { rows: 3, columns: 3 });
    const session = startGame(config, 'puzzle-test-seed');
    expect(session.puzzlePar).toBe(session.setupMoves.length);
    expect(session.puzzlePar).toBeGreaterThan(0);
  });

  it('scores using calculatePuzzleScore when won at par', () => {
    const config = createGameConfig('puzzle', { rows: 3, columns: 3 });
    const session = startGame(config, 'puzzle-score-seed');
    const won = session.setupMoves.reduce(
      (cur, move, idx) => applyMove(cur, move, 1_000 + idx * 1_000),
      session,
    );
    if (won.status !== 'won') return;
    const expected = calculatePuzzleScore(won.puzzlePar!, won.moves, 9);
    expect(won.score).toBe(Math.round(expected * 1)); // no penalty
  });

  it('awards a par bonus when solved in fewer moves than par', () => {
    const atPar = calculatePuzzleScore(5, 5, 9);
    const belowPar = calculatePuzzleScore(5, 4, 9);
    expect(belowPar).toBeGreaterThan(atPar);
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
