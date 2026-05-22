import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { loadAllModeResults, loadResults } from '../../domain/ranking';
import type { GameResultRecord } from '../../domain/ranking';
import { formatGameTime } from '../../../game/ui/components/formatGameTime';
import { IconMedal, IconRefresh, IconWifi, IconWifiOff } from '../../../shared/ui/nano/Icon';
import type { GameMode } from '../../../game/domain/gameConfig';
import { BOARD_SIZE_MIN, BOARD_SIZE_MAX } from '../../../game/domain/gameConfig';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import type { AppPage, NavParams } from '../../../app/ui/App';
import { fetchOnlineRanking } from '../../../online/application/rankingService';
import type { RankingEntry } from '../../../online/api/contract';
import { getAccount } from '../../../online/application/authService';

type RankingsPageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

const MODES: { mode: GameMode; label: string; hasSizes: boolean; hasOnline: boolean }[] = [
  { mode: 'classic',     label: 'Classic',     hasSizes: false, hasOnline: true },
  { mode: 'dimensional', label: 'Dimensional', hasSizes: true,  hasOnline: false },
  { mode: 'time-attack', label: 'Time Attack', hasSizes: true,  hasOnline: false },
  { mode: 'move-limit',  label: 'Move Limit',  hasSizes: true,  hasOnline: false },
  { mode: 'blind',       label: 'Blind',       hasSizes: false, hasOnline: false },
  { mode: 'mirror',      label: 'Mirror',      hasSizes: false, hasOnline: false },
  { mode: 'chaos',       label: 'Chaos',       hasSizes: false, hasOnline: false },
  { mode: 'chain',       label: 'Chain',       hasSizes: false, hasOnline: false },
  { mode: 'puzzle',      label: 'Puzzle',      hasSizes: false, hasOnline: false },
];

// ── Online ranking tab ───────────────────────────────────────────

type OnlineRankingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; entries: RankingEntry[]; updatedAt: string }
  | { status: 'error'; message: string };

function OnlineRankingTab() {
  const { t } = useTranslation();
  const [state, setState] = useState<OnlineRankingState>({ status: 'idle' });
  const myUsername = getAccount()?.username ?? null;

  const load = useCallback(() => {
    setState({ status: 'loading' });
    fetchOnlineRanking('classic', 3, 3)
      .then((res) => setState({ status: 'ok', entries: res.entries, updatedAt: res.updatedAt }))
      .catch((err: Error) => setState({ status: 'error', message: err.message }));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="lab-panel" style={{ textAlign: 'center', padding: '32px 16px' }}>
        <div className="lab-label" style={{ color: 'var(--muted)', fontSize: 12 }}>
          {t('online.ranking.loadingRanking')}
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="lab-panel" style={{ textAlign: 'center', padding: '32px 16px' }}>
        <IconWifiOff size={28} style={{ color: 'var(--dim)', margin: '0 auto 8px' }} />
        <div className="lab-mono" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
          {t('online.ranking.errorRanking')}
        </div>
        <button className="lab-btn lab-btn-sm" type="button" onClick={load}>
          <IconRefresh size={13} />
          {t('online.ranking.retryRanking')}
        </button>
      </div>
    );
  }

  if (state.entries.length === 0) {
    return (
      <div className="lab-panel" style={{ textAlign: 'center', padding: '32px 16px' }}>
        <IconMedal size={28} style={{ color: 'var(--dim)', margin: '0 auto 8px' }} />
        <div className="lab-mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{t('online.ranking.empty')}</div>
        <div className="lab-label" style={{ color: 'var(--dim)', marginTop: 4 }}>{t('online.ranking.emptyHint')}</div>
      </div>
    );
  }

  const myEntry = myUsername ? state.entries.find((e) => e.username === myUsername) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="lab-kicker">{t('online.ranking.top100')}</span>
          {import.meta.env.DEV && !import.meta.env.VITE_API_URL && (
            <span className="lab-chip" style={{ fontSize: 9, padding: '1px 5px', color: 'var(--amber)', borderColor: 'var(--amber)' }}>
              {t('online.mockBadge')}
            </span>
          )}
        </div>
        <button
          aria-label={t('online.ranking.retryRanking')}
          className="lab-btn lab-btn-ghost"
          style={{ padding: '4px 8px', fontSize: 11, gap: 4 }}
          type="button"
          onClick={load}
        >
          <IconRefresh size={12} />
        </button>
      </div>

      {myEntry && (
        <div
          className="lab-panel"
          style={{ padding: '8px 12px', background: 'var(--cyan-dim)', borderColor: 'var(--cyan)' }}
        >
          <span className="lab-label" style={{ color: 'var(--cyan)', fontSize: 12 }}>
            {t('online.ranking.yourRank', { rank: myEntry.rank })}
          </span>
        </div>
      )}

      <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', padding: 0, margin: 0 }}>
        {state.entries.map((entry) => (
          <OnlineRankRow
            key={`${entry.rank}-${entry.username}`}
            entry={entry}
            isMe={entry.username === myUsername}
          />
        ))}
      </ol>
    </div>
  );
}

function OnlineRankRow({ entry, isMe }: { entry: RankingEntry; isMe: boolean }) {
  const isTop3 = entry.rank <= 3;
  const medalColors = ['var(--amber)', 'var(--muted)', '#c87f3b'];
  return (
    <li
      className={'lab-row' + (isMe ? ' is-self' : '')}
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr 50px 64px 64px',
        alignItems: 'center',
        gap: 8,
        ...(isMe ? { background: 'var(--cyan-dim)', borderColor: 'var(--cyan)' } : {}),
      }}
    >
      <div className="lab-mono" style={{ fontSize: 11, color: isTop3 ? medalColors[entry.rank - 1] : 'var(--dim)', textAlign: 'center', fontWeight: 700 }}>
        {isTop3 ? <IconMedal size={14} style={{ color: medalColors[entry.rank - 1] }} /> : `#${entry.rank}`}
      </div>
      <span className="lab-mono" style={{ fontWeight: 700, color: isMe ? 'var(--cyan)' : 'var(--text)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {entry.username}
      </span>
      <span className="lab-label" style={{ color: 'var(--muted)', fontSize: 11, textAlign: 'right' }}>
        {entry.moves}mv
      </span>
      <span className="lab-mono" style={{ textAlign: 'right', color: 'var(--muted)', fontSize: 11 }}>
        {formatGameTime(entry.elapsedSeconds * 1000)}
      </span>
      <span className="lab-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>
        {entry.score.toLocaleString('es')}
      </span>
    </li>
  );
}

// ── Main page ────────────────────────────────────────────────────

export function RankingsPage({ go }: RankingsPageProps) {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<GameMode>('classic');
  const [activeSize, setActiveSize] = useState(3);
  const [rankingScope, setRankingScope] = useState<'local' | 'online'>('local');

  const modeInfo = MODES.find((m) => m.mode === activeMode)!;

  const localResults: GameResultRecord[] = modeInfo.hasSizes
    ? loadResults({ mode: activeMode, size: { rows: activeSize, columns: activeSize } })
    : loadAllModeResults(activeMode);

  const availableSizes = Array.from(
    { length: BOARD_SIZE_MAX - BOARD_SIZE_MIN + 1 },
    (_, i) => i + BOARD_SIZE_MIN,
  );

  // When switching mode, if the new mode has no online, force local
  function handleModeChange(mode: GameMode) {
    setActiveMode(mode);
    const info = MODES.find((m) => m.mode === mode)!;
    if (!info.hasOnline) setRankingScope('local');
  }

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        kicker="// RANKING"
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
              onClick={() => handleModeChange(mode)}
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

        {/* LOCAL / ONLINE scope toggle (classic only) */}
        {modeInfo.hasOnline && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              aria-pressed={rankingScope === 'local'}
              className={'lab-chip' + (rankingScope === 'local' ? ' lab-chip-cy' : '')}
              type="button"
              onClick={() => setRankingScope('local')}
            >
              {t('online.ranking.tabLocal')}
            </button>
            <button
              aria-pressed={rankingScope === 'online'}
              className={'lab-chip' + (rankingScope === 'online' ? ' lab-chip-cy' : '')}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              type="button"
              onClick={() => setRankingScope('online')}
            >
              <IconWifi size={12} />
              {t('online.ranking.tabOnline')}
            </button>
          </div>
        )}

        {/* Content */}
        {rankingScope === 'online' && modeInfo.hasOnline ? (
          <OnlineRankingTab />
        ) : (
          localResults.length === 0 ? (
            <div className="lab-panel" style={{ textAlign: 'center', padding: '32px 16px' }}>
              <IconMedal size={28} style={{ color: 'var(--dim)', margin: '0 auto 8px' }} />
              <div className="lab-mono" style={{ fontSize: 12, color: 'var(--muted)' }}>Sin resultados aún</div>
              <div className="lab-label" style={{ color: 'var(--dim)', marginTop: 4 }}>Juega y graba tu resultado</div>
            </div>
          ) : (
            <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', padding: 0, margin: 0 }}>
              {localResults.map((result, index) => (
                <RankingRow key={result.id} rank={index + 1} result={result} showSize={modeInfo.hasSizes} />
              ))}
            </ol>
          )
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
