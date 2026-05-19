import { StatusBadge } from '../../../shared/ui/nano/StatusBadge';
import { LabPanel } from '../../../shared/ui/components/LabPanel';
import { FeatureMapSection } from '../sections/FeatureMapSection';
import { ReadinessSection } from '../sections/ReadinessSection';

export function FoundationPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-stretch">
        <LabPanel className="flex flex-col justify-between gap-8">
          <div className="space-y-4">
            <StatusBadge tone="cyan">R0 · Fundación técnica</StatusBadge>
            <div className="space-y-3">
              <h1 className="max-w-3xl font-display text-4xl font-black leading-tight text-lab-text sm:text-5xl">
                Luces del Laboratorio
              </h1>
              <p className="max-w-2xl text-base leading-7 text-lab-muted">
                Base React, Vite, TypeScript, Tailwind y Anime.js lista para construir
                el puzzle arcade retro desde componentes pequeños hacia pantallas completas.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatusBadge tone="green">Mobile first</StatusBadge>
            <StatusBadge tone="amber">HTML + CSS + SVG</StatusBadge>
            <StatusBadge tone="cyan">Capas por feature</StatusBadge>
          </div>
        </LabPanel>

        <LabPanel className="grid content-between gap-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">
              Estado del release
            </p>
            <p className="mt-3 text-3xl font-bold text-lab-text">Scaffold navegable</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Scripts" value="5" />
            <Metric label="Features" value="5" />
            <Metric label="Capas" value="4" />
            <Metric label="Hooks" value="1" />
          </div>
        </LabPanel>
      </section>

      <FeatureMapSection />
      <ReadinessSection />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-panel border border-lab-line bg-lab-bg/70 p-3">
      <p className="font-mono text-xs uppercase text-lab-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-lab-green">{value}</p>
    </div>
  );
}
