import { loadClassicResults } from '../../domain/ranking';
import { formatGameTime } from '../../../game/ui/components/formatGameTime';
import { LabPanel } from '../../../shared/ui/components/LabPanel';
import type { ClassicResultRecord } from '../../domain/ranking';

type RankingsPageProps = {
  onBack: () => void;
};

export function RankingsPage({ onBack }: RankingsPageProps) {
  const results = loadClassicResults();

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          className="font-mono text-sm text-lab-muted transition hover:text-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan"
          onClick={onBack}
          type="button"
        >
          ← Volver
        </button>
      </div>

      <LabPanel>
        <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Ranking local</p>
        <h1 className="mt-2 font-display text-3xl font-black text-lab-text">Mejores registros</h1>
        <p className="mt-1 font-mono text-xs text-lab-muted">Classic 3×3 · Top 10</p>

        <div className="mt-6">
          {results.length === 0 ? (
            <EmptyState />
          ) : (
            <ol className="space-y-2">
              {results.map((result, index) => (
                <RankingRow key={result.id} rank={index + 1} result={result} />
              ))}
            </ol>
          )}
        </div>
      </LabPanel>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-panel border border-lab-line bg-lab-bg/40 px-4 py-8 text-center">
      <p className="font-mono text-sm text-lab-muted">Aún no hay resultados grabados.</p>
      <p className="mt-1 font-mono text-xs text-lab-muted">Juega una partida y graba tu resultado.</p>
    </div>
  );
}

function RankingRow({ rank, result }: { rank: number; result: ClassicResultRecord }) {
  const isTop3 = rank <= 3;

  return (
    <li className="grid grid-cols-[2rem_3.5rem_1fr_4.5rem_5rem] items-center gap-2 rounded border border-lab-line bg-lab-bg/60 px-3 py-2.5 font-mono text-sm">
      <span className={`font-black ${isTop3 ? 'text-lab-amber' : 'text-lab-muted'}`}>{rank}</span>
      <span className="font-black text-lab-green">{result.initials}</span>
      <span className="truncate text-lab-muted">{result.moves} movs</span>
      <span className="text-right text-lab-muted">{formatGameTime(result.elapsedSeconds * 1000)}</span>
      <span className="text-right font-black text-lab-text">{result.score}</span>
    </li>
  );
}
