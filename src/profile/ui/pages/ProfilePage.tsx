import { getProfile } from '../../application/profileService';
import { formatGameTime } from '../../../game/ui/components/formatGameTime';
import { LabPanel } from '../../../shared/ui/components/LabPanel';

type ProfilePageProps = {
  onBack: () => void;
};

export function ProfilePage({ onBack }: ProfilePageProps) {
  const profile = getProfile();

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

      <LabPanel className="space-y-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Perfil local</p>
          <h1 className="mt-2 font-display text-3xl font-black text-lab-text">{profile.initials}</h1>
          <p className="mt-1 font-mono text-xs text-lab-muted">Iniciales persistidas en este dispositivo</p>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-lab-muted">Estadísticas</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard label="Partidas grabadas" value={profile.gamesRecorded} />
            <StatCard label="Mejor puntaje" value={profile.bestScore > 0 ? profile.bestScore : '—'} />
            <StatCard
              label="Mejor tiempo"
              value={profile.bestTimeSeconds !== null ? formatGameTime(profile.bestTimeSeconds * 1000) : '—'}
            />
          </div>
        </div>

        {profile.gamesRecorded === 0 && (
          <p className="font-mono text-xs text-lab-muted">
            Juega una partida y graba tu resultado para ver estadísticas.
          </p>
        )}
      </LabPanel>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-panel border border-lab-line bg-lab-bg/70 p-3">
      <p className="font-mono text-[0.68rem] uppercase text-lab-muted">{label}</p>
      <p className="mt-1 font-mono text-xl font-black text-lab-green">{value}</p>
    </div>
  );
}
