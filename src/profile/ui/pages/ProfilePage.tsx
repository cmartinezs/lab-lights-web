import { getAllProfiles } from '../../application/profileService';
import { formatGameTime } from '../../../game/ui/components/formatGameTime';
import { IconUser, IconCog } from '../../../shared/ui/nano/Icon';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import type { LocalProfile } from '../../domain/profile';
import type { AppPage, NavParams } from '../../../app/ui/App';

type ProfilePageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

export function ProfilePage({ go }: ProfilePageProps) {
  const profiles = getAllProfiles();

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        kicker="// PERFILES"
        title="Jugadores"
        right={
          <button
            aria-label="Preferencias"
            className="lab-btn lab-btn-ghost"
            style={{ padding: 8, minWidth: 36, height: 36 }}
            type="button"
            onClick={() => go('settings')}
          >
            <IconCog size={16} />
          </button>
        }
      />

      <div className="screen-scroll" style={{ padding: '12px 14px 80px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="lab-panel">
          <div className="lab-kicker" style={{ marginBottom: 8 }}>JUGADORES LOCALES</div>
          <div className="lab-label" style={{ color: 'var(--muted)', marginBottom: 16 }}>
            Un perfil por cada combinación de iniciales grabada en este dispositivo
          </div>

          {profiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <IconUser size={28} style={{ color: 'var(--dim)', margin: '0 auto 8px' }} />
              <div className="lab-mono" style={{ fontSize: 12, color: 'var(--muted)' }}>Sin perfiles registrados</div>
              <div className="lab-label" style={{ color: 'var(--dim)', marginTop: 4 }}>
                Gana una partida y graba tus iniciales
              </div>
            </div>
          ) : (
            <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', padding: 0, margin: 0 }}>
              {profiles.map((profile, index) => (
                <ProfileRow key={profile.initials} profile={profile} rank={index + 1} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ profile, rank }: { profile: LocalProfile; rank: number }) {
  return (
    <li className="lab-row" style={{ display: 'grid', gridTemplateColumns: '28px 44px 1fr 60px 64px', alignItems: 'center', gap: 8 }}>
      <div className="lab-mono" style={{ fontSize: 11, color: rank <= 3 ? 'var(--amber)' : 'var(--dim)', textAlign: 'center', fontWeight: 700 }}>
        #{rank}
      </div>
      <span className="lab-mono" style={{ fontWeight: 700, color: 'var(--cyan)', fontSize: 14 }}>{profile.initials}</span>
      <span className="lab-label" style={{ color: 'var(--muted)' }}>{profile.gamesRecorded} grab.</span>
      <span className="lab-mono" style={{ textAlign: 'right', color: 'var(--muted)', fontSize: 11 }}>
        {profile.bestTimeSeconds !== null ? formatGameTime(profile.bestTimeSeconds * 1000) : '—'}
      </span>
      <span className="lab-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>
        {profile.bestScore > 0 ? profile.bestScore.toLocaleString('es') : '—'}
      </span>
    </li>
  );
}
