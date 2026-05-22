import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import {
  IconGrid, IconClock, IconBolt, IconChevronRight, IconCalendar,
  IconBlind, IconMirror, IconChaos, IconChain, IconPuzzle, IconDimensional,
} from '../../../shared/ui/nano/Icon';
import type { AppPage, NavParams } from '../../../app/ui/App';

export const ALL_MODES = [
  { id: 'classic',     level: 1 },
  { id: 'time-attack', level: 2 },
  { id: 'move-limit',  level: 3 },
  { id: 'dimensional', level: 4 },
  { id: 'daily',       level: 1 },
  { id: 'blind',       level: 5 },
  { id: 'mirror',      level: 6 },
  { id: 'chaos',       level: 8 },
  { id: 'chain',       level: 10 },
  { id: 'puzzle',      level: 1 },
];

function modeKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function getModeIcon(id: string) {
  switch (id) {
    case 'time-attack':  return IconClock;
    case 'move-limit':   return IconBolt;
    case 'daily':        return IconCalendar;
    case 'blind':        return IconBlind;
    case 'mirror':       return IconMirror;
    case 'chaos':        return IconChaos;
    case 'chain':        return IconChain;
    case 'puzzle':       return IconPuzzle;
    case 'dimensional':  return IconDimensional;
    default:             return IconGrid;
  }
}

type ModesPageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

export function ModesPage({ go }: ModesPageProps) {
  const { t } = useTranslation();
  const USER_LEVEL = 10;

  return (
    <div className="screen boot-in">
      <ScreenHeader kicker={t('modes.kicker')} title={t('modes.title')} />

      <div className="screen-scroll" style={{ padding: '12px 16px 90px' }}>
        {/* Progress indicator */}
        <div className="lab-panel" style={{ padding: 12, marginBottom: 14 }}>
          <div className="lab-mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.14em' }}>
            {t('modes.availableLevel', { level: USER_LEVEL })}
          </div>
          <div className="lab-dot-line" style={{ marginTop: 8 }}>
            {ALL_MODES.map((m, i) => (
              <div key={i} className={'seg' + (m.level <= USER_LEVEL ? ' live' : '')} />
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ALL_MODES.map((m) => {
            const MIcon = getModeIcon(m.id);
            return (
              <button
                key={m.id}
                className="lab-mode-card"
                type="button"
                onClick={() => m.id === 'daily' ? go('daily') : go('config', { modeId: m.id })}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 4,
                    border: '1px solid var(--line)', background: 'var(--bg)',
                    display: 'grid', placeItems: 'center', color: 'var(--cyan)',
                  }}>
                    <MIcon size={18} />
                  </div>
                  <IconChevronRight size={14} style={{ color: 'var(--dim)' }} />
                </div>
                <div className="lab-h1" style={{ fontSize: 15 }}>{t(`mode.${modeKey(m.id)}`)}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--muted)' }}>
                  {t(`mode.shortDesc.${modeKey(m.id)}`)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
