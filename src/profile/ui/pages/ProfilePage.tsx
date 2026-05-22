import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllProfiles } from '../../application/profileService';
import { formatGameTime } from '../../../game/ui/components/formatGameTime';
import { IconUser, IconCog, IconCheck } from '../../../shared/ui/nano/Icon';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import type { LocalProfile } from '../../domain/profile';
import type { AppPage, NavParams } from '../../../app/ui/App';
import {
  getAccount,
  login,
  logout,
  register,
} from '../../../online/application/authService';
import { ApiError, API_ERROR_CODES } from '../../../online/api/contract';
import type { AccountDto } from '../../../online/api/contract';

type ProfilePageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

// ── Online Account Panel ─────────────────────────────────────────

type AuthMode = 'register' | 'login';

function OnlineAccountPanel() {
  const { t } = useTranslation();
  const [account, setAccount] = useState<AccountDto | null>(() => getAccount());
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<AuthMode>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let updated: AccountDto;
      if (mode === 'register') {
        updated = await register({
          email,
          password,
          username,
          referredBy: referredBy.trim() || undefined,
        });
      } else {
        updated = await login({ email, password });
      }
      setAccount(updated);
      setShowForm(false);
      setEmail('');
      setPassword('');
      setUsername('');
      setReferredBy('');
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.code) {
          case API_ERROR_CODES.EMAIL_TAKEN:
            setError(t('online.auth.errorEmailTaken'));
            break;
          case API_ERROR_CODES.USERNAME_TAKEN:
            setError(t('online.auth.errorUsernameTaken'));
            break;
          case API_ERROR_CODES.INVALID_CREDENTIALS:
            setError(t('online.auth.errorInvalidCredentials'));
            break;
          default:
            setError(err.message || t('online.auth.errorGeneric'));
        }
      } else {
        setError(t('online.auth.errorGeneric'));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setAccount(null);
      setLoggingOut(false);
    }
  }

  function copyReferralCode() {
    if (!account) return;
    navigator.clipboard?.writeText(account.referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="lab-panel">
      <div className="lab-kicker" style={{ marginBottom: 8 }}>
        {t('online.account.section')}
        {import.meta.env.DEV && !import.meta.env.VITE_API_URL && (
          <span
            className="lab-chip"
            style={{ marginLeft: 8, fontSize: 9, padding: '1px 5px', color: 'var(--amber)', borderColor: 'var(--amber)' }}
          >
            {t('online.mockBadge')}
          </span>
        )}
      </div>

      {/* ── Logged in ─────────────────────────────────── */}
      {account && !showForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--cyan-dim)',
                border: '1px solid var(--cyan)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconUser size={16} style={{ color: 'var(--cyan)' }} />
            </div>
            <div>
              <div className="lab-mono" style={{ fontWeight: 700, color: 'var(--cyan)', fontSize: 15 }}>
                {account.username}
              </div>
              <div className="lab-label" style={{ color: 'var(--muted)', fontSize: 11 }}>
                {account.email}
              </div>
            </div>
          </div>

          {/* Referral code */}
          <button
            aria-label={copied ? t('online.account.copied') : t('online.account.referralCopyHint')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 12px', cursor: 'pointer', width: '100%',
              transition: 'border-color 0.2s',
            }}
            type="button"
            onClick={copyReferralCode}
          >
            <div>
              <div className="lab-kicker" style={{ fontSize: 9, marginBottom: 2 }}>{t('online.account.referralCode')}</div>
              <div className="lab-mono" style={{ fontSize: 13, color: 'var(--text)', letterSpacing: '0.1em' }}>
                {account.referralCode}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: copied ? 'var(--cyan)' : 'var(--muted)' }}>
              {copied && <IconCheck size={14} />}
              <span className="lab-label" style={{ fontSize: 10 }}>
                {copied ? t('online.account.copied') : t('online.account.referralCopyHint')}
              </span>
            </div>
          </button>

          <button
            className="lab-btn lab-btn-ghost lab-btn-block"
            disabled={loggingOut}
            style={{ fontSize: 12 }}
            type="button"
            onClick={() => { void handleLogout(); }}
          >
            {loggingOut ? t('online.auth.loading') : t('online.account.logout')}
          </button>
        </div>
      )}

      {/* ── Not logged in (no form) ────────────────────────── */}
      {!account && !showForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ marginBottom: 4 }}>
            <div className="lab-label" style={{ color: 'var(--muted)', fontSize: 12 }}>
              {t('online.account.notConnectedDesc')}
            </div>
          </div>
          <button
            className="lab-btn lab-btn-primary lab-btn-block"
            style={{ fontSize: 13 }}
            type="button"
            onClick={() => { setMode('register'); setShowForm(true); setError(''); }}
          >
            {t('online.account.connect')}
          </button>
          <button
            className="lab-btn lab-btn-ghost lab-btn-block"
            style={{ fontSize: 12 }}
            type="button"
            onClick={() => { setMode('login'); setShowForm(true); setError(''); }}
          >
            {t('online.account.alreadyHave')}
          </button>
        </div>
      )}

      {/* ── Auth form ─────────────────────────────────────── */}
      {showForm && (
        <form style={{ display: 'flex', flexDirection: 'column', gap: 10 }} onSubmit={(e) => { void handleSubmit(e); }}>
          <div className="lab-label" style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
            {mode === 'register' ? t('online.auth.registerTitle') : t('online.auth.loginTitle')}
          </div>

          {mode === 'register' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="lab-kicker" style={{ fontSize: 9 }}>{t('online.auth.usernameLabel')}</span>
              <input
                className="lab-input"
                maxLength={16}
                placeholder={t('online.auth.usernamePlaceholder')}
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="lab-kicker" style={{ fontSize: 9 }}>{t('online.auth.emailLabel')}</span>
            <input
              className="lab-input"
              autoCapitalize="none"
              placeholder={t('online.auth.emailPlaceholder')}
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="lab-kicker" style={{ fontSize: 9 }}>{t('online.auth.passwordLabel')}</span>
            <input
              className="lab-input"
              minLength={8}
              placeholder={t('online.auth.passwordPlaceholder')}
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {mode === 'register' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="lab-kicker" style={{ fontSize: 9 }}>{t('online.auth.referralLabel')}</span>
              <input
                className="lab-input"
                autoCapitalize="characters"
                placeholder={t('online.auth.referralPlaceholder')}
                type="text"
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value.toUpperCase())}
              />
            </label>
          )}

          {error && (
            <div
              role="alert"
              style={{
                padding: '8px 12px', borderRadius: 6,
                background: 'rgba(255,100,80,0.08)',
                border: '1px solid rgba(255,100,80,0.3)',
                color: '#ff8060', fontSize: 12,
              }}
            >
              {error}
            </div>
          )}

          <button
            className="lab-btn lab-btn-primary lab-btn-block"
            disabled={loading}
            type="submit"
          >
            {loading
              ? t('online.auth.loading')
              : mode === 'register'
                ? t('online.auth.registerBtn')
                : t('online.auth.loginBtn')}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="lab-btn lab-btn-ghost"
              style={{ fontSize: 11, padding: '4px 8px' }}
              type="button"
              onClick={() => setShowForm(false)}
            >
              {t('online.auth.cancel')}
            </button>
            <button
              className="lab-btn lab-btn-ghost"
              style={{ fontSize: 11, padding: '4px 8px' }}
              type="button"
              onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}
            >
              {mode === 'register' ? t('online.auth.switchToLogin') : t('online.auth.switchToRegister')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── ProfilePage ──────────────────────────────────────────────────

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

        <OnlineAccountPanel />

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
