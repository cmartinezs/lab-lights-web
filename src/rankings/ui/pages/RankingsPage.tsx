import { useState } from 'react';
import { loadAllModeResults, loadResults } from '../../domain/ranking';
import type { GameResultRecord } from '../../domain/ranking';
import { formatGameTime } from '../../../game/ui/components/formatGameTime';
import { IconMedal } from '../../../shared/ui/nano/Icon';
import type { GameMode } from '../../../game/domain/gameConfig';
import { BOARD_SIZE_MIN, BOARD_SIZE_MAX } from '../../../game/domain/gameConfig';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import type { AppPage, NavParams } from '../../../app/ui/App';

type RankingsPageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

const MODES: { mode: GameMode; label: string; hasSizes: boolean }[] = [
  { mode: 'classic',     label: 'Classic',     hasSizes: false },
  { mode: 'dimensional', label: 'Dimensional', hasSizes: true },
  { mode: 'time-attack', label: 'Time Attack', hasSizes: true },
  { mode: 'move-limit',  label: 'Move Limit',  hasSizes: true },
];

export function RankingsPage({ go }: RankingsPageProps) {
  const [activeMode, setActiveMode] = useState<GameMode>('classic');
  const [activeSize, setActiveSize] = useState(3);

  const modeInfo = MODES.find((m) => m.mode === activeMode)!;

  const results: GameResultRecord[] = modeInfo.hasSizes
    ? loadResults({ mode: activeMode, size: { rows: activeSize, columns: activeSize } })
    : loadAllModeResults('classic');

  const availableSizes = Array.from(
    { length: BOARD_SIZE_MAX - BOARD_SIZE_MIN + 1 },
    (_, i) => i + BOARD_SIZE_MIN,
  );

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        kicker="// LOCAL"
        title="Mejores registros"
        onBack={() => go('home')}
      />

      <div className="screen-scroll" style={{ padding: '12px 14px 80px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Mode tabs */}
        <div className="lab-tabs">
          {MODES.map(({ mode, label }) => (
            <button
              key={mode}
              aria-pressed={activeMode === mode}
              className={'lab-tab' + (activeMode === mode ? ' is-active' : '')}
              type="button"
              onClick={() => setActiveMode(mode)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Size filter */}
        {modeInfo.hasSizes && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {availableSizes.map((n) => (
              <button
                key={n}
                aria-pressed={activeSize === n}
                className={'lab-chip' + (activeSize === n ? ' lab-chip-cy' : '')}
                type="button"
                onClick={() => setActiveSize(n)}
              >
                {n}×{n}
              </button>
            ))}
          </div>
        )}

        {/* Results list */}
        {results.length === 0 ? (
          <div className="lab-panel" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <IconMedal size={28} style={{ color: 'var(--dim)', margin: '0 auto 8px' }} />
            <div className="lab-mono" style={{ fontSize: 12, color: 'var(--muted)' }}>Sin resultados aún</div>
            <div className="lab-label" style={{ color: 'var(--dim)', marginTop: 4 }}>Juega y graba tu resultado</div>
          </div>
        ) : (
          <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', padding: 0, margin: 0 }}>
            {results.map((result, index) => (
              <RankingRow key={result.id} rank={index + 1} result={result} showSize={modeInfo.hasSizes} />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function RankingRow({ rank, result, showSize }: { rank: number; result: GameResultRecord; showSize: boolean }) {
  const isTop3 = rank <= 3;
  const medalColors = ['var(--amber)', 'var(--muted)', '#c87f3b'];
  return (
    <li className={'lab-row' + (rank === 1 ? ' is-self' : '')} style={{ display: 'grid', gridTemplateColumns: '28px 44px 1fr 60px 64px', alignItems: 'center', gap: 8 }}>
      <div className="lab-mono" style={{ fontSize: 11, color: isTop3 ? medalColors[rank - 1] : 'var(--dim)', textAlign: 'center', fontWeight: 700 }}>
        {isTop3 ? <IconMedal size={14} style={{ color: medalColors[rank - 1] }} /> : `#${rank}`}
      </div>
      <span className="lab-mono" style={{ fontWeight: 700, color: 'var(--cyan)', fontSize: 14 }}>{result.initials}</span>
      <span className="lab-label" style={{ color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {result.moves} movs{showSize ? ` · ${result.rows}×${result.columns}` : ''}
      </span>
      <span className="lab-mono" style={{ textAlign: 'right', color: 'var(--muted)', fontSize: 11 }}>
        {formatGameTime(result.elapsedSeconds * 1000)}
      </span>
      <span className="lab-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>
        {result.score.toLocaleString('es')}
      </span>
    </li>
  );
}
