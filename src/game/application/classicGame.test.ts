import { describe, expect, it } from 'vitest';
import { applyClassicMove, startClassicGame } from './classicGame';

describe('classic game session', () => {
  it('starts a local Classic game from a deterministic seed', () => {
    const session = startClassicGame('r1-session');

    expect(session.board.size).toEqual({ rows: 3, columns: 3 });
    expect(session.moves).toBe(0);
    expect(session.status).toBe('playing');
    expect(session.seed).toBe('r1-session');
  });

  it('wins after replaying the seeded setup moves', () => {
    const session = startClassicGame('r1-session-win');
    const wonSession = session.setupMoves.reduce(
      (currentSession, move, index) => applyClassicMove(currentSession, move, 1_000 + index * 1_000),
      session,
    );

    expect(wonSession.status).toBe('won');
    expect(wonSession.litCells).toBe(0);
    expect(wonSession.moves).toBe(session.setupMoves.length);
    expect(wonSession.score).toBe(Math.round(900 / wonSession.moves));
  });
});
