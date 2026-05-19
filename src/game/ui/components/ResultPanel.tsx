import { useEffect, useRef, useState } from 'react';
import type { ClassicGameSession } from '../../application/classicGame';

type ResultPanelProps = {
  session: ClassicGameSession;
  onNewGame: () => void;
  onSaveResult: (initials: string) => void;
  onRetry: () => void;
  saved: boolean;
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function ResultPanel({ session, onNewGame, onSaveResult, onRetry, saved }: ResultPanelProps) {
  const [initials, setInitials] = useState(['L', 'A', 'B']);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (session.status === 'won') {
      saveButtonRef.current?.focus();
    }
  }, [session.status]);

  if (session.status !== 'won') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-lab-bg/80 px-4 py-6 backdrop-blur-sm" role="presentation">
      <section
        aria-labelledby="result-title"
        aria-live="polite"
        className="w-full max-w-lg rounded-panel border border-lab-green/60 bg-lab-panel p-4 shadow-[0_0_42px_rgb(120_242_109_/_0.34)] sm:p-5"
        role="dialog"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-lab-green">Resultado</p>
          <h2 id="result-title" className="mt-2 font-display text-3xl font-black text-lab-text">
            Laboratorio apagado
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResultMetric label="Puntaje" value={session.score} />
          <ResultMetric label="Movs" value={session.moves} />
          <ResultMetric label="Tiempo" value={`${session.elapsedSeconds}s`} />
        </div>

        <div className="mt-5 space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Iniciales</p>
          <div className="grid grid-cols-3 gap-2">
            {initials.map((letter, index) => (
              <button
                key={index}
                aria-label={`Inicial ${index + 1}: ${letter}`}
                className={[
                  'min-h-16 rounded-md border font-mono text-3xl font-black transition focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg',
                  selectedSlot === index
                    ? 'border-lab-cyan bg-lab-cyan text-lab-bg'
                    : 'border-lab-line bg-lab-bg text-lab-text',
                ].join(' ')}
                onClick={() => setSelectedSlot(index)}
                type="button"
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="grid max-h-32 grid-cols-8 gap-1 overflow-y-auto pr-1 sm:grid-cols-13">
            {alphabet.map((letter) => (
              <button
                key={letter}
                className="min-h-9 rounded border border-lab-line bg-lab-bg font-mono text-sm font-black text-lab-text transition hover:border-lab-green hover:text-lab-green focus:outline-none focus:ring-2 focus:ring-lab-cyan"
                onClick={() => {
                  setInitials((currentInitials) =>
                    currentInitials.map((currentLetter, index) => (index === selectedSlot ? letter : currentLetter)),
                  );
                  setSelectedSlot((currentSlot) => Math.min(currentSlot + 1, 2));
                }}
                type="button"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <button
            ref={saveButtonRef}
            className="min-h-12 rounded-md border border-lab-green bg-lab-green px-4 font-mono text-sm font-black uppercase text-lab-bg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-lab-green focus:ring-offset-2 focus:ring-offset-lab-bg disabled:cursor-default disabled:opacity-60"
            disabled={saved}
            onClick={() => onSaveResult(initials.join(''))}
            type="button"
          >
            {saved ? 'Grabado' : 'Grabar'}
          </button>
          <button
            className="min-h-12 rounded-md border border-lab-cyan/60 bg-lab-cyan/10 px-4 font-mono text-sm font-black uppercase text-lab-cyan transition hover:bg-lab-cyan/20 focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg"
            onClick={onNewGame}
            type="button"
          >
            Nuevo
          </button>
          <button
            className="min-h-12 rounded-md border border-lab-line bg-lab-bg px-4 font-mono text-sm font-black uppercase text-lab-text transition hover:border-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg"
            onClick={onRetry}
            type="button"
          >
            Repetir
          </button>
        </div>
      </section>
    </div>
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
