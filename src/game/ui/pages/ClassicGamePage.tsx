import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { LabPanel } from '../../../shared/ui/components/LabPanel';
import { IconContrast, IconPlay, IconRefresh } from '../../../shared/ui/nano/Icon';
import {
  applyClassicMove,
  invertClassicGame,
  restartClassicGame,
  startClassicGame,
  startClassicGameWithSeed,
  tickClassicGame,
  type ClassicGameSession,
} from '../../application/classicGame';
import type { CellPosition } from '../../domain/board';
import {
  createUnplayedClassicSeed,
  loadCurrentClassicSeed,
  rememberPlayedClassicSeed,
  saveClassicResult,
  saveCurrentClassicSeed,
} from '../../infra/classicLocalStore';
import { getLastUsedInitials, getProfile, recordClassicWin } from '../../../profile/application/profileService';
import type { LocalProfile } from '../../../profile/domain/profile';
import type { AppPage } from '../../../app/ui/components/AppNav';
import { GameBoard } from '../components/GameBoard';
import { GameStat } from '../components/GameStat';
import { formatGameTime } from '../components/formatGameTime';
import { ResultPanel } from '../components/ResultPanel';

export const R2_DEFAULT_SEED = 'r2-local-mvp-plus';

type ClassicGamePageProps = {
  onNavigate: (page: AppPage) => void;
};

export function ClassicGamePage({ onNavigate }: ClassicGamePageProps) {
  const [session, setSession] = useState<ClassicGameSession>(() => startClassicGame(loadCurrentClassicSeed(R2_DEFAULT_SEED)));
  const [lastInitials, setLastInitials] = useState(() => getLastUsedInitials());
  const [profile, setProfile] = useState<LocalProfile>(() => getProfile(getLastUsedInitials()));
  const [savedResultSeed, setSavedResultSeed] = useState<string | null>(null);
  const [isModeVisible, setIsModeVisible] = useState(false);

  useEffect(() => {
    if (session.startedAt === null || session.status === 'won') {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSession((currentSession) => tickClassicGame(currentSession));
    }, 100);

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

  const handleInvert = useCallback(() => {
    setSession((currentSession) => invertClassicGame(currentSession));
    setSavedResultSeed(null);
  }, []);

  const handleNewGame = useCallback(() => {
    const nextSeed = createUnplayedClassicSeed();

    saveCurrentClassicSeed(nextSeed);
    setSession(startClassicGameWithSeed(nextSeed));
    setSavedResultSeed(null);
  }, []);

  const handleSaveResult = useCallback((initials: string) => {
    if (session.status !== 'won' || savedResultSeed === session.seed) {
      return;
    }

    saveClassicResult(session, initials);
    setSavedResultSeed(session.seed);
    const updatedProfile = recordClassicWin(initials, {
      score: session.score,
      elapsedSeconds: session.elapsedMilliseconds / 1000,
    });
    setLastInitials(initials);
    setProfile(updatedProfile);
  }, [session, savedResultSeed]);

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:px-8">
      <section className="flex flex-col items-center gap-4">
        {/* Header */}
        <div className="w-full max-w-2xl space-y-2">
          <h1 className="font-display text-2xl font-black text-lab-text sm:text-3xl">
            Luces del Laboratorio
          </h1>
          <div className="flex items-center gap-2">
            <button
              aria-expanded={isModeVisible}
              aria-label={isModeVisible ? 'Ocultar info del modo' : 'Ver info del modo'}
              className="inline-flex min-h-8 items-center rounded-full border border-lab-green/50 bg-lab-green/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-lab-green transition hover:bg-lab-green/20 focus:outline-none focus:ring-2 focus:ring-lab-green focus:ring-offset-2 focus:ring-offset-lab-bg"
              type="button"
              onClick={() => setIsModeVisible((v) => !v)}
            >
              R2 · Classic 3×3
            </button>

            <div className="flex-1" />

            <button
              aria-label="Nuevo tablero"
              className="flex min-h-9 min-w-9 items-center justify-center rounded-md border border-lab-line bg-lab-panelStrong text-lab-muted transition hover:border-lab-cyan hover:text-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg"
              type="button"
              onClick={handleNewGame}
            >
              <IconPlay size={16} />
            </button>

            <button
              aria-label="Reiniciar tablero"
              className="flex min-h-9 min-w-9 items-center justify-center rounded-md border border-lab-line bg-lab-panelStrong text-lab-muted transition hover:border-lab-cyan hover:text-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg"
              type="button"
              onClick={handleRetry}
            >
              <IconRefresh size={16} />
            </button>
          </div>
        </div>

        {/* Mode info — only shown when badge is pressed */}
        {isModeVisible && (
          <LabPanel className="w-full max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Modo</p>
            <p className="mt-2 text-sm leading-6 text-lab-muted">
              Activa una sala para invertirla junto con sus adyacentes ortogonales. La partida termina cuando todas quedan apagadas.
            </p>
          </LabPanel>
        )}

        {/* Stats */}
        <div className="grid w-full max-w-2xl grid-cols-3 gap-2">
          <GameStat label="Movs" value={session.moves} />
          <GameStat label="Luces" value={session.litCells} />
          <GameStat label="Tiempo" value={formatGameTime(session.elapsedMilliseconds)} />
        </div>

        <GameBoard board={session.board} disabled={session.status === 'won'} onCellPress={handleCellPress} />

        {/* Power-ups */}
        <div className="w-full max-w-2xl">
          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-lab-muted">Power-ups</p>
          <div className="flex gap-2">
            <PowerUpButton
              description="Invierte todas las luces del tablero"
              disabled={session.moves === 0}
              icon={<IconContrast size={20} />}
              label="Invertir luces"
              onClick={handleInvert}
            />
          </div>
        </div>
      </section>

      {/* Sidebar — desktop only */}
      <aside className="hidden lg:grid lg:content-start lg:gap-4 lg:sticky lg:top-[3.25rem] lg:self-start">
        <LabPanel as="section" className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Modo</p>
          <h2 className="font-display text-xl font-black text-lab-text">Classic local</h2>
          <p className="text-sm leading-6 text-lab-muted">
            Activa una sala para invertirla junto con sus adyacentes ortogonales. La partida termina cuando todas quedan apagadas.
          </p>
        </LabPanel>

        <LabPanel as="section" className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Jugador</p>
          <p className="font-display text-2xl font-black text-lab-text">{profile.initials}</p>
          <div className="grid grid-cols-2 gap-2">
            <MiniStat label="Grabadas" value={profile.gamesRecorded} />
            <MiniStat label="Récord" value={profile.bestScore > 0 ? profile.bestScore : '—'} />
          </div>
          <button
            className="w-full rounded-md border border-lab-line bg-lab-bg/50 px-3 py-1.5 font-mono text-xs text-lab-muted transition hover:border-lab-cyan hover:text-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan"
            type="button"
            onClick={() => onNavigate('rankings')}
          >
            Ver ranking completo
          </button>
        </LabPanel>
      </aside>

      <ResultPanel
        defaultInitials={lastInitials}
        saved={savedResultSeed === session.seed}
        session={session}
        onNewGame={handleNewGame}
        onRetry={handleRetry}
        onSaveResult={handleSaveResult}
      />
    </main>
  );
}

type PowerUpButtonProps = {
  label: string;
  description: string;
  icon: ReactNode;
  disabled: boolean;
  onClick: () => void;
};

function PowerUpButton({ label, description, icon, disabled, onClick }: PowerUpButtonProps) {
  return (
    <button
      aria-disabled={disabled}
      aria-label={label}
      className={[
        'flex flex-col items-center gap-1.5 rounded-lg border px-4 py-3 font-mono transition focus:outline-none focus:ring-2 focus:ring-lab-amber focus:ring-offset-2 focus:ring-offset-lab-bg',
        disabled
          ? 'cursor-not-allowed border-lab-line bg-lab-bg/30 text-lab-line'
          : 'border-lab-amber/50 bg-lab-amber/10 text-lab-amber hover:bg-lab-amber/20',
      ].join(' ')}
      disabled={disabled}
      title={disabled ? 'Disponible tras el primer movimiento' : description}
      type="button"
      onClick={onClick}
    >
      {icon}
      <span className="text-[0.65rem] uppercase tracking-wider">{label}</span>
    </button>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-lab-line bg-lab-bg/50 px-2 py-1.5">
      <p className="font-mono text-[0.6rem] uppercase text-lab-muted">{label}</p>
      <p className="font-mono text-sm font-black text-lab-text">{value}</p>
    </div>
  );
}
