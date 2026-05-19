import { LabPanel } from '../../../shared/ui/components/LabPanel';

const features = [
  ['app', 'Bootstrap, rutas y composición global'],
  ['game', 'Dominio, casos de uso, UI e infraestructura del juego'],
  ['profile', 'Perfil local y futuro vínculo online'],
  ['rankings', 'Rankings locales y online por modo'],
  ['shared', 'Componentes, hooks y utilidades transversales'],
] as const;

export function FeatureMapSection() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {features.map(([name, description]) => (
        <LabPanel key={name} className="min-h-36">
          <p className="font-mono text-xs uppercase tracking-widest text-lab-cyan">
            src/{name}
          </p>
          <h2 className="mt-3 text-xl font-bold text-lab-text">{name}</h2>
          <p className="mt-2 text-sm leading-6 text-lab-muted">{description}</p>
        </LabPanel>
      ))}
    </section>
  );
}
