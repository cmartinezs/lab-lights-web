import { useState } from 'react';
import { getProfile, saveProfileInitials } from '../../application/profileService';
import { formatGameTime } from '../../../game/ui/components/formatGameTime';
import { LabPanel } from '../../../shared/ui/components/LabPanel';
import type { LocalProfile } from '../../domain/profile';

type ProfilePageProps = {
  onBack: () => void;
};

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [profile, setProfile] = useState<LocalProfile>(() => getProfile());
  const [editing, setEditing] = useState(false);

  function handleSaveInitials(initials: string) {
    setProfile(saveProfileInitials(initials));
    setEditing(false);
  }

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
          {editing ? (
            <InitialsEditor
              current={profile.initials}
              onCancel={() => setEditing(false)}
              onSave={handleSaveInitials}
            />
          ) : (
            <div className="mt-2 flex items-center gap-3">
              <h1 className="font-display text-3xl font-black text-lab-text">{profile.initials}</h1>
              <button
                className="rounded border border-lab-line bg-lab-bg/50 px-2 py-1 font-mono text-xs text-lab-muted transition hover:border-lab-cyan hover:text-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan"
                type="button"
                onClick={() => setEditing(true)}
              >
                Cambiar
              </button>
            </div>
          )}
          <p className="mt-1 font-mono text-xs text-lab-muted">
            Nombre por defecto al grabar resultados en este dispositivo
          </p>
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

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type InitialsEditorProps = {
  current: string;
  onSave: (initials: string) => void;
  onCancel: () => void;
};

function InitialsEditor({ current, onSave, onCancel }: InitialsEditorProps) {
  const [slots, setSlots] = useState(() => current.padEnd(3, 'A').slice(0, 3).split(''));
  const [selectedSlot, setSelectedSlot] = useState(0);

  return (
    <div className="mt-3 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {slots.map((letter, index) => (
          <button
            key={index}
            aria-label={`Inicial ${index + 1}: ${letter}`}
            className={[
              'min-h-14 rounded-md border font-mono text-2xl font-black transition focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg',
              selectedSlot === index
                ? 'border-lab-cyan bg-lab-cyan text-lab-bg'
                : 'border-lab-line bg-lab-bg text-lab-text',
            ].join(' ')}
            type="button"
            onClick={() => setSelectedSlot(index)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:grid-cols-[repeat(13,minmax(0,1fr))]">
        {alphabet.map((letter) => (
          <button
            key={letter}
            className="min-h-8 rounded border border-lab-line bg-lab-bg font-mono text-sm font-black text-lab-text transition hover:border-lab-green hover:text-lab-green focus:outline-none focus:ring-2 focus:ring-lab-cyan"
            type="button"
            onClick={() => {
              setSlots((current) => current.map((l, i) => (i === selectedSlot ? letter : l)));
              setSelectedSlot((s) => Math.min(s + 1, 2));
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          className="min-h-10 flex-1 rounded-md border border-lab-green bg-lab-green px-4 font-mono text-sm font-black uppercase text-lab-bg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-lab-green focus:ring-offset-2 focus:ring-offset-lab-bg"
          type="button"
          onClick={() => onSave(slots.join(''))}
        >
          Guardar
        </button>
        <button
          className="min-h-10 rounded-md border border-lab-line bg-lab-bg px-4 font-mono text-sm font-black uppercase text-lab-muted transition hover:border-lab-cyan hover:text-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg"
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
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
