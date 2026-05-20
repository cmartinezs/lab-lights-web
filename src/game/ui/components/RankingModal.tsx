import type { GameResultRecord } from '../../infra/gameLocalStore';
import { formatGameTime } from './formatGameTime';

type RankingModalProps = {
  onClose: () => void;
  results: GameResultRecord[];
};

export function RankingModal({ onClose, results }: RankingModalProps) {
  return (
    <div className="fixed inset-0 z-20 grid place-items-center overflow-y-auto bg-lab-bg/80 px-4 py-4 backdrop-blur-sm sm:py-6" role="presentation">
      <section
        aria-labelledby="ranking-title"
        className="w-full max-w-lg rounded-panel border border-lab-cyan/60 bg-lab-panel p-4 shadow-glow sm:p-5"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Ranking local</p>
            <h2 id="ranking-title" className="mt-2 font-display text-3xl font-black text-lab-text">
              Mejores registros
            </h2>
          </div>
          <button
            aria-label="Cerrar ranking"
            className="min-h-10 rounded-md border border-lab-line bg-lab-bg px-3 font-mono text-sm font-black text-lab-text transition hover:border-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan"
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>

        {results.length === 0 ? (
          <p className="mt-5 text-sm leading-6 text-lab-muted">Aún no hay resultados grabados.</p>
        ) : (
          <ol className="mt-5 space-y-2">
            {results.map((result, index) => (
              <li
                key={result.id}
                className="grid grid-cols-[2rem_3rem_1fr_4rem_auto] items-center gap-2 rounded border border-lab-line bg-lab-bg/60 p-2 font-mono text-sm"
              >
                <span className="text-lab-muted">{index + 1}</span>
                <span className="font-black text-lab-green">{result.initials}</span>
                <span className="text-lab-muted">{result.moves} movs</span>
                <span className="text-lab-muted">{formatGameTime(result.elapsedSeconds * 1000)}</span>
                <span className="font-black text-lab-text">{result.score}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
