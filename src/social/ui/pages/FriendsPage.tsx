import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import { IconUser, IconTrophy } from '../../../shared/ui/nano/Icon';
import type { AppPage, NavParams } from '../../../app/ui/App';
import { getAccount } from '../../../online/application/authService';

type FriendsPageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

type MockFriend = {
  id: string;
  username: string;
  bestScore: number;
  online: boolean;
};

// Mock friend data for local dev
const MOCK_FRIENDS: MockFriend[] = [];

export function FriendsPage({ go }: FriendsPageProps) {
  const { t } = useTranslation();
  const account = getAccount();
  const [friends] = useState<MockFriend[]>(MOCK_FRIENDS);

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        kicker={t('social.kicker')}
        title={t('social.friends.title')}
        onBack={() => go('profile')}
      />

      <div className="screen-scroll" style={{ padding: '12px 14px 80px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!account ? (
          <div className="lab-panel" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <IconUser size={28} style={{ color: 'var(--dim)', margin: '0 auto 8px' }} />
            <div className="lab-mono" style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
              Conecta una cuenta para ver tus amigos
            </div>
            <button
              className="lab-btn lab-btn-primary"
              type="button"
              onClick={() => go('profile')}
            >
              Ir a perfil
            </button>
          </div>
        ) : friends.length === 0 ? (
          <div className="lab-panel" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <IconUser size={28} style={{ color: 'var(--dim)', margin: '0 auto 8px' }} />
            <div className="lab-mono" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
              {t('social.friends.empty')}
            </div>
            <div className="lab-label" style={{ color: 'var(--dim)', marginBottom: 16 }}>
              {t('social.friends.emptyHint')}
            </div>
            <button
              className="lab-btn lab-btn-primary"
              type="button"
              onClick={() => go('add-friend')}
            >
              {t('social.friends.addBtn')}
            </button>
          </div>
        ) : (
          <>
            <button
              className="lab-btn lab-btn-primary lab-btn-block"
              type="button"
              onClick={() => go('add-friend')}
            >
              {t('social.friends.addBtn')}
            </button>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
              {friends.map((f) => (
                <li key={f.id} className="lab-panel" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--panel-2)', border: '1px solid var(--line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <IconUser size={16} style={{ color: 'var(--muted)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="lab-mono" style={{ fontWeight: 700, fontSize: 14 }}>{f.username}</span>
                      {f.online && (
                        <span className="lab-chip lab-chip-cy" style={{ fontSize: 8, padding: '1px 5px' }}>
                          {t('social.friends.onlineBadge')}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <IconTrophy size={10} style={{ color: 'var(--muted)' }} />
                      <span className="lab-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {f.bestScore.toLocaleString('es')}
                      </span>
                    </div>
                  </div>
                  <button
                    className="lab-btn lab-btn-sm"
                    type="button"
                    onClick={() => {/* challenge flow */}}
                  >
                    {t('social.friends.challenge')}
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
