import { LabPanel } from '../../../shared/ui/components/LabPanel';
import type { ClassicGameSession } from '../../application/classicGame';

type ResultPanelProps = {
  session: ClassicGameSession;
  onNewGame: () => void;
  onRetry: () => void;
};

export function ResultPanel({ session, onNewGame, onRetry }: ResultPanelProps) {
  if (session.status !== 'won') {
    return null;
  }

  return (
    <LabPanel as="section" className="space-y-4" aria-live="polite">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-lab-green">Resultado</p>
        <h2 className="mt-2 font-display text-3xl font-black text-lab-text">Laboratorio apagado</h2>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <ResultMetric label="Puntaje" value={session.score} />
        <ResultMetric label="Movs" value={session.moves} />
        <ResultMetric label="Tiempo" value={`${session.elapsedSeconds}s`} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          className="min-h-12 rounded-md border border-lab-green bg-lab-green px-4 font-mono text-sm font-black uppercase text-lab-bg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-lab-green focus:ring-offset-2 focus:ring-offset-lab-bg"
          onClick={onNewGame}
          type="button"
        >
          Nuevo tablero
        </button>
        <button
          className="min-h-12 rounded-md border border-lab-cyan/60 bg-lab-cyan/10 px-4 font-mono text-sm font-black uppercase text-lab-cyan transition hover:bg-lab-cyan/20 focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg"
          onClick={onRetry}
          type="button"
        >
          Repetir seed
        </button>
      </div>
    </LabPanel>
  );
}

function ResultMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-panel border border-lab-line bg-lab-bg/70 p-3 text-center">
      <p className="font-mono text-[0.68rem] uppercase text-lab-muted">{label}</p>
      <p className="mt-1 font-mono text-xl font-black text-lab-green">{value}</p>
    </div>
  );
}
