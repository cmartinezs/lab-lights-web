import { LabPanel } from '../../../shared/ui/components/LabPanel';

const checks = [
  'TypeScript estricto',
  'Tailwind con tokens base',
  'Anime.js encapsulado',
  'Pre-commit preparado',
  'Vitest + Testing Library',
] as const;

export function ReadinessSection() {
  return (
    <LabPanel as="section">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">
            Preparado para R1
          </p>
          <h2 className="mt-2 text-2xl font-black text-lab-text">Controles de base</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-lab-muted">
          Esta pantalla no implementa gameplay; valida navegación, composición visual,
          responsive y estructura para comenzar el MVP local.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {checks.map((check) => (
          <div
            key={check}
            className="rounded-panel border border-lab-line bg-lab-panelStrong/70 p-4 text-sm font-semibold text-lab-text"
          >
            <span className="mr-2 text-lab-green">●</span>
            {check}
          </div>
        ))}
      </div>
    </LabPanel>
  );
}
