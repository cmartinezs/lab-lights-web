import { useCallback, useEffect, useState } from 'react';
import { LabPanel } from '../../../shared/ui/components/LabPanel';
import { StatusBadge } from '../../../shared/ui/nano/StatusBadge';
import {
  applyClassicMove,
  restartClassicGame,
  startClassicGame,
  startClassicGameWithSeed,
  tickClassicGame,
  type ClassicGameSession,
} from '../../application/classicGame';
import type { CellPosition } from '../../domain/board';
import {
  createUnplayedClassicSeed,
  loadClassicResults,
  loadCurrentClassicSeed,
  rememberPlayedClassicSeed,
  saveClassicResult,
  saveCurrentClassicSeed,
  type ClassicResultRecord,
} from '../../infra/classicLocalStore';
import { GameBoard } from '../components/GameBoard';
import { GameStat } from '../components/GameStat';
import { ResultPanel } from '../components/ResultPanel';

export const R1_DEFAULT_SEED = 'r1-local-mvp';

export function ClassicGamePage() {
  const [session, setSession] = useState<ClassicGameSession>(() => startClassicGame(loadCurrentClassicSeed(R1_DEFAULT_SEED)));
  const [results, setResults] = useState<ClassicResultRecord[]>(() => loadClassicResults());
  const [savedResultSeed, setSavedResultSeed] = useState<string | null>(null);

  useEffect(() => {
    if (session.startedAt === null || session.status === 'won') {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSession((currentSession) => tickClassicGame(currentSession));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [session.startedAt, session.status]);

  const handleCellPress = useCallback((position: CellPosition) => {
    setSession((currentSession) => {
      const nextSession = applyClassicMove(currentSession, position);

      if (nextSession.status === 'won') {
        rememberPlayedClassicSeed(nextSession.seed);
      }

      return nextSession;
    });
  }, []);

  const handleRetry = useCallback(() => {
    setSession((currentSession) => restartClassicGame(currentSession));
    setSavedResultSeed(null);
  }, []);

  const handleNewGame = useCallback(() => {
    const nextSeed = createUnplayedClassicSeed();

    saveCurrentClassicSeed(nextSeed);
    setSession(startClassicGameWithSeed(nextSeed));
    setSavedResultSeed(null);
  }, []);

  const handleSaveResult = useCallback((initials: string) => {
    setSession((currentSession) => {
      if (currentSession.status !== 'won') {
        return currentSession;
      }

      saveClassicResult(currentSession, initials);
      setResults(loadClassicResults());
      setSavedResultSeed(currentSession.seed);

      return currentSession;
    });
  }, []);

  return (
    <main className="relative mx-auto grid min-h-dvh w-full max-w-6xl gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:px-8">
      <section className="flex min-h-0 flex-col items-center gap-5 lg:pt-3">
        <LabPanel className="w-full max-w-2xl space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <StatusBadge tone="green">R1 · Classic 3x3</StatusBadge>
              <h1 className="mt-3 font-display text-3xl font-black leading-tight text-lab-text sm:text-4xl">
                Luces del Laboratorio
              </h1>
            </div>
            <StatusBadge tone={session.status === 'won' ? 'cyan' : 'amber'}>
              {session.status === 'won' ? 'Victoria' : 'En curso'}
            </StatusBadge>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <GameStat label="Movs" value={session.moves} />
            <GameStat label="Luces" value={session.litCells} />
            <GameStat label="Tiempo" value={`${session.elapsedSeconds}s`} />
          </div>
        </LabPanel>

        <GameBoard board={session.board} disabled={session.status === 'won'} onCellPress={handleCellPress} />
      </section>

      <aside className="grid content-start gap-4 lg:sticky lg:top-4 lg:self-start">
        <LabPanel as="section" className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Modo</p>
          <h2 className="font-display text-2xl font-black text-lab-text">Classic local</h2>
          <p className="text-sm leading-6 text-lab-muted">
            Activa una sala para invertirla junto con sus adyacentes ortogonales. La partida termina cuando todas quedan apagadas.
          </p>
          <button
            className="mt-2 min-h-11 w-full rounded-md border border-lab-line bg-lab-panelStrong px-4 font-mono text-sm font-bold uppercase text-lab-text transition hover:border-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg"
            onClick={handleRetry}
            type="button"
          >
            Reiniciar seed
          </button>
        </LabPanel>

        <LabPanel as="section" className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Ranking local</p>
          {results.length === 0 ? (
            <p className="text-sm leading-6 text-lab-muted">Aún no hay resultados grabados.</p>
          ) : (
            <ol className="space-y-2">
              {results.slice(0, 5).map((result) => (
                <li key={result.id} className="grid grid-cols-[3rem_1fr_auto] items-center gap-2 rounded border border-lab-line bg-lab-bg/60 p-2 font-mono text-sm">
                  <span className="font-black text-lab-green">{result.initials}</span>
                  <span className="text-lab-muted">{result.moves} movs</span>
                  <span className="font-black text-lab-text">{result.score}</span>
                </li>
              ))}
            </ol>
          )}
        </LabPanel>
      </aside>

      <ResultPanel
        saved={savedResultSeed === session.seed}
        session={session}
        onNewGame={handleNewGame}
        onRetry={handleRetry}
        onSaveResult={handleSaveResult}
      />
    </main>
  );
}
