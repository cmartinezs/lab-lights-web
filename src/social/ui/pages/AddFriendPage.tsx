import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import { IconCheck, IconUser } from '../../../shared/ui/nano/Icon';
import type { AppPage, NavParams } from '../../../app/ui/App';
import { getAccount } from '../../../online/application/authService';

type AddFriendPageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

export function AddFriendPage({ go }: AddFriendPageProps) {
  const { t } = useTranslation();
  const account = getAccount();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'adding' | 'success' | 'error' | 'self'>('idle');

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    const normalized = code.trim().toUpperCase();

    if (account && normalized === account.referralCode) {
      setStatus('self');
      return;
    }

    setStatus('adding');
    // Simulate API call — replace with real Supabase endpoint in production
    await new Promise((r) => setTimeout(r, 800));
    setStatus('error'); // Will be 'success' once backend is wired
  }

  function handleShare() {
    if (!account) return;
    const text = `${t('social.addFriend.myCode')}: ${account.referralCode}`;
    if (navigator.share) {
      void navigator.share({ title: 'Luces del Laboratorio', text });
    } else {
      void navigator.clipboard?.writeText(account.referralCode);
    }
  }

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        kicker={t('social.addFriend.kicker')}
        title={t('social.addFriend.title')}
        onBack={() => go('friends')}
      />

      <div className="screen-scroll" style={{ padding: '20px 14px 80px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* My code + share */}
        {account && (
          <div className="lab-panel" style={{ padding: '12px 14px' }}>
            <div className="lab-kicker" style={{ marginBottom: 8 }}>{t('social.addFriend.shareTitle')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div className="lab-kicker" style={{ fontSize: 9, marginBottom: 2 }}>
                  {t('social.addFriend.myCode')}
                </div>
                <div className="lab-mono" style={{ fontSize: 16, color: 'var(--cyan)', letterSpacing: '0.1em', fontWeight: 700 }}>
                  {account.referralCode}
                </div>
              </div>
              <button
                className="lab-btn lab-btn-sm"
                type="button"
                onClick={handleShare}
              >
                {t('online.account.referralShareHint')}
              </button>
            </div>
          </div>
        )}

        {/* Add by code */}
        <div className="lab-panel" style={{ padding: '14px' }}>
          <div className="lab-kicker" style={{ marginBottom: 12 }}>{t('social.addFriend.title')}</div>

          {!account ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <IconUser size={24} style={{ color: 'var(--dim)', margin: '0 auto 8px' }} />
              <div className="lab-label" style={{ color: 'var(--muted)', fontSize: 12 }}>
                Necesitas una cuenta para agregar amigos
              </div>
              <button
                className="lab-btn lab-btn-primary"
                style={{ marginTop: 12 }}
                type="button"
                onClick={() => go('profile')}
              >
                Ir a perfil
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { void handleAdd(e); }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="lab-kicker" style={{ fontSize: 9 }}>{t('social.addFriend.codeLabel')}</span>
                <input
                  autoCapitalize="characters"
                  className="lab-input"
                  disabled={status === 'adding' || status === 'success'}
                  maxLength={20}
                  placeholder={t('social.addFriend.codePlaceholder')}
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus('idle'); }}
                />
              </label>

              {status === 'success' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--cyan)' }}>
                  <IconCheck size={14} />
                  <span className="lab-mono" style={{ fontSize: 12 }}>{t('social.addFriend.success')}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="lab-label" style={{ color: '#ff8060', fontSize: 12 }}>
                  {t('social.addFriend.error')}
                </div>
              )}
              {status === 'self' && (
                <div className="lab-label" style={{ color: '#ff8060', fontSize: 12 }}>
                  {t('social.addFriend.selfError')}
                </div>
              )}

              <button
                className="lab-btn lab-btn-primary lab-btn-block"
                disabled={!code.trim() || status === 'adding' || status === 'success'}
                type="submit"
              >
                {status === 'adding' ? t('social.addFriend.adding') : t('social.addFriend.addBtn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
