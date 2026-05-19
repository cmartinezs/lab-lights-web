import { getAllProfiles } from '../../application/profileService';
import { formatGameTime } from '../../../game/ui/components/formatGameTime';
import { LabPanel } from '../../../shared/ui/components/LabPanel';
import type { LocalProfile } from '../../domain/profile';

type ProfilePageProps = {
  onBack: () => void;
};

export function ProfilePage({ onBack }: ProfilePageProps) {
  const profiles = getAllProfiles();

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
        <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Perfiles locales</p>
        <h1 className="mt-2 font-display text-3xl font-black text-lab-text">Jugadores</h1>
        <p className="mt-1 font-mono text-xs text-lab-muted">
          Un perfil por cada combinación de iniciales grabada en este dispositivo
        </p>

        <div className="mt-6">
          {profiles.length === 0 ? (
            <EmptyState />
          ) : (
            <ol className="space-y-2">
              {profiles.map((profile, index) => (
                <ProfileRow key={profile.initials} profile={profile} rank={index + 1} />
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
      <p className="font-mono text-sm text-lab-muted">Aún no hay perfiles registrados.</p>
      <p className="mt-1 font-mono text-xs text-lab-muted">Gana una partida y graba tus iniciales para crear uno.</p>
    </div>
  );
}

function ProfileRow({ profile, rank }: { profile: LocalProfile; rank: number }) {
  const isTop3 = rank <= 3;

  return (
    <li className="grid grid-cols-[2rem_3.5rem_1fr_4.5rem_5rem] items-center gap-2 rounded border border-lab-line bg-lab-bg/60 px-3 py-2.5 font-mono text-sm">
      <span className={`font-black ${isTop3 ? 'text-lab-amber' : 'text-lab-muted'}`}>{rank}</span>
      <span className="font-black text-lab-green">{profile.initials}</span>
      <span className="text-lab-muted">{profile.gamesRecorded} grab.</span>
      <span className="text-right text-lab-muted">
        {profile.bestTimeSeconds !== null ? formatGameTime(profile.bestTimeSeconds * 1000) : '—'}
      </span>
      <span className="text-right font-black text-lab-text">{profile.bestScore > 0 ? profile.bestScore : '—'}</span>
    </li>
  );
}
