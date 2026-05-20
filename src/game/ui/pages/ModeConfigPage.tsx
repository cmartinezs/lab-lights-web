import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import { IconPlay, IconClock, IconBolt, IconUndo, IconBulb, IconShuffle, IconCoin } from '../../../shared/ui/nano/Icon';
import {
  BOARD_SIZE_MIN, BOARD_SIZE_MAX, calculateTimeLimit, calculateMoveLimit,
  createGameConfig, type GameMode,
} from '../../domain/gameConfig';
import type { AppPage, NavParams } from '../../../app/ui/App';

function modeKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

type ModeConfigPageProps = {
  modeId?: string;
  go: (page: AppPage, params?: NavParams) => void;
  back: () => void;
};

export function ModeConfigPage({ modeId = 'classic', go, back }: ModeConfigPageProps) {
  const { t } = useTranslation();
  const isClassic = modeId === 'classic';

  const minSize = BOARD_SIZE_MIN;
  const maxSize = BOARD_SIZE_MAX;

  const [size, setSize] = useState(isClassic ? 3 : 5);
  const [timeOn, setTimeOn] = useState(modeId === 'time-attack');
  const [movesOn, setMovesOn] = useState(modeId === 'move-limit');

  const timeLimit  = calculateTimeLimit({ rows: size, columns: size });
  const movesLimit = calculateMoveLimit({ rows: size, columns: size });

  function fmt(s: number) {
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  }

  function handleStart() {
    const gameMode: GameMode = modeId === 'time-attack' ? 'time-attack'
      : modeId === 'move-limit' ? 'move-limit'
      : modeId === 'dimensional' ? 'dimensional'
      : 'classic';
    const config = createGameConfig(gameMode, { rows: size, columns: size });
    go('game', { mode: gameMode, size, config });
  }

  const modeTitle = t(`mode.${modeKey(modeId)}`);

  return (
    <div className="screen boot-in">
      <ScreenHeader
        kicker={t('setup.kicker', { mode: modeTitle.toUpperCase() })}
        title={modeTitle}
        onBack={back}
      />

      <div className="screen-scroll" style={{ padding: '12px 16px 100px' }}>

        {/* Description */}
        <div className="lab-panel" style={{ padding: 14 }}>
          <div className="lab-mono" style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5 }}>
            {t(`mode.description.${modeKey(modeId)}`)}
          </div>
        </div>

        {/* Board size (not for classic) */}
        {!isClassic && (
          <>
            <div style={{ marginTop: 18, marginBottom: 8 }}>
              <div className="lab-kicker">{t('setup.boardSizeKicker')}</div>
              <div className="lab-h1" style={{ fontSize: 16 }}>{t('setup.boardSize')}</div>
            </div>
            <div className="lab-panel" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="lab-label">{t('setup.dimensionLabel')}</span>
                <span className="lab-mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--cyan)', fontVariantNumeric: 'tabular-nums' }}>
                  {size}×{size}
                </span>
              </div>
              <input
                max={maxSize}
                min={minSize}
                step={1}
                style={{ width: '100%', accentColor: 'var(--cyan)', marginTop: 8 }}
                type="range"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
              />
              <div className="lab-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--dim)', letterSpacing: '0.14em', marginTop: 4 }}>
                <span>{minSize}×{minSize}</span>
                <span>{t('setup.cellsCount', { count: size * size })}</span>
                <span>{maxSize}×{maxSize}</span>
              </div>
            </div>
          </>
        )}

        {/* Restrictions */}
        <div style={{ marginTop: 18, marginBottom: 8 }}>
          <div className="lab-kicker">{t('setup.restrictionsKicker')}</div>
          <div className="lab-h1" style={{ fontSize: 16 }}>{t('setup.restrictionsTitle')}</div>
        </div>
        <div className="lab-panel">
          <ToggleRow
            Icon={IconClock}
            desc={timeOn ? t('setup.timeLimitOn', { time: fmt(timeLimit) }) : t('setup.timeLimitOff')}
            title={t('setup.timeLimit')}
            value={timeOn}
            onChange={setTimeOn}
          />
          <ToggleRow
            Icon={IconBolt}
            desc={movesOn ? t('setup.moveLimitOn', { count: movesLimit }) : t('setup.moveLimitOff')}
            title={t('setup.moveLimitLabel')}
            value={movesOn}
            onChange={setMovesOn}
          />
        </div>

        {/* Loadout */}
        <div style={{ marginTop: 18, marginBottom: 8, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div className="lab-kicker">{t('setup.loadoutKicker')}</div>
            <div className="lab-h1" style={{ fontSize: 16 }}>{t('setup.loadoutTitle')}</div>
          </div>
          <span className="lab-coin"><IconCoin size={12} /> 1.240</span>
        </div>
        <div className="lab-tray">
          {[
            { id: 'p30', Icon: IconClock, color: 'var(--amber)', qty: 2 },
            { id: 'und', Icon: IconUndo,  color: 'var(--cyan)',  qty: 1 },
            { id: 'hint',Icon: IconBulb, color: 'var(--amber)', qty: null },
            { id: 'sh',  Icon: IconShuffle, color: 'var(--cyan)', qty: null },
            { id: 'p5',  Icon: IconBolt, color: 'var(--cyan)',  qty: null },
          ].map((p) => (
            <div key={p.id} className={'lab-tray-slot' + (p.qty ? ' has' : '')}>
              <p.Icon size={18} style={{ color: p.qty ? p.color : 'var(--dim)' }} />
              {p.qty && <span className="qty">x{p.qty}</span>}
              {!p.qty && <span className="lab-mono" style={{ position: 'absolute', bottom: 3, fontSize: 8.5, color: 'var(--dim)' }}>+</span>}
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="lab-panel lab-panel-corner" style={{ marginTop: 16, padding: 14 }}>
          <div className="lab-kicker lab-kicker-cy">{t('setup.previewKicker')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <KV label={t('setup.previewMode')} value={modeTitle} />
            <KV label={t('setup.previewBoard')} value={`${size}×${size}`} />
            <KV label={t('setup.previewTime')} value={timeOn ? fmt(timeLimit) : '∞'} />
            <KV label={t('setup.previewMoves')} value={movesOn ? movesLimit.toString() : '∞'} />
          </div>
        </div>
      </div>

      <div style={{ padding: '10px 16px 16px', borderTop: '1px solid var(--line)', background: 'linear-gradient(180deg, transparent, var(--bg-deep))' }}>
        <button
          className="lab-btn lab-btn-primary lab-btn-lg lab-btn-block"
          type="button"
          onClick={handleStart}
        >
          <IconPlay size={16} /> {t('setup.start')}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ Icon, title, desc, value, onChange }: {
  Icon: React.ComponentType<{ size?: number }>;
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="lab-set-row">
      <div style={{ width: 32, height: 32, border: '1px solid var(--line)', borderRadius: 4, display: 'grid', placeItems: 'center', color: 'var(--cyan)', background: 'var(--panel-2)', flexShrink: 0 }}>
        <Icon size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--f-disp)', fontWeight: 500, fontSize: 14 }}>{title}</div>
        <div className="lab-mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>{desc}</div>
      </div>
      <button
        aria-checked={value}
        className={'lab-toggle' + (value ? ' on' : '')}
        role="switch"
        type="button"
        onClick={() => onChange(!value)}
      />
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px dashed var(--line-soft)' }}>
      <span className="lab-label">{label}</span>
      <span className="lab-mono" style={{ color: 'var(--text)', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}
