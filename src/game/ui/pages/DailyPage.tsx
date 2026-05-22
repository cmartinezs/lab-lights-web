import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import { IconCalendar, IconFlame, IconPlay } from '../../../shared/ui/nano/Icon';
import { getDailySeed, getTodayKey } from '../../domain/daily';
import { createGameConfig } from '../../domain/gameConfig';
import { getDailyState, hasPlayedToday } from '../../infra/dailyStore';
import type { AppPage, NavParams } from '../../../app/ui/App';

type DailyPageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

export function DailyPage({ go }: DailyPageProps) {
  const { t } = useTranslation();
  const todayKey = getTodayKey();
  const [state] = useState(() => getDailyState());
  const played = hasPlayedToday(todayKey);

  function handlePlay() {
    const config = createGameConfig('daily', { rows: 3, columns: 3 });
    go('game', { mode: 'daily', config, seed: getDailySeed() });
  }

  return (
    <div className="screen boot-in">
      <ScreenHeader
        kicker={t('daily.kicker')}
        title={t('daily.title')}
        onBack={() => go('modes')}
      />

      <div className="screen-scroll" style={{ padding: '12px 16px 90px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Date */}
        <div className="lab-panel" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 4, border: '1px solid var(--line)', background: 'var(--bg)', display: 'grid', placeItems: 'center', color: 'var(--cyan)', flexShrink: 0 }}>
            <IconCalendar size={18} />
          </div>
          <div>
            <div className="lab-kicker lab-kicker-cy">{t('daily.todaySeed')}</div>
            <div className="lab-mono" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{todayKey}</div>
          </div>
        </div>

        {/* Streak */}
        <div className="lab-panel" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 4, border: '1px solid var(--line)', background: 'var(--bg)', display: 'grid', placeItems: 'center', color: 'var(--amber)', flexShrink: 0 }}>
            <IconFlame size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="lab-kicker">{t('daily.streakLabel')}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span className="lab-mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--amber)', fontVariantNumeric: 'tabular-nums' }}>
                {state.streak}
              </span>
              <span className="lab-label" style={{ color: 'var(--muted)' }}>{t('daily.days')}</span>
            </div>
          </div>
        </div>

        {/* Status + action */}
        {played ? (
          <div className="lab-panel lab-panel-corner" style={{ padding: 20, textAlign: 'center' }}>
            <div className="lab-kicker lab-kicker-cy" style={{ marginBottom: 8 }}>{t('daily.playedToday')}</div>
            {state.todayScore !== null && (
              <div className="lab-mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--cyan)', fontVariantNumeric: 'tabular-nums', marginBottom: 6 }}>
                {state.todayScore.toLocaleString('es')}
              </div>
            )}
            <div className="lab-label" style={{ color: 'var(--muted)', fontSize: 12 }}>
              {t('daily.comeBackTomorrow')}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="lab-panel" style={{ padding: 14 }}>
              <div className="lab-mono" style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5 }}>
                {t('daily.description')}
              </div>
            </div>
            <button
              className="lab-btn lab-btn-primary lab-btn-lg lab-btn-block"
              type="button"
              onClick={handlePlay}
            >
              <IconPlay size={16} /> {t('daily.playButton')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
