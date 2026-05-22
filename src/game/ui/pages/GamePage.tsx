import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  applyMove, applyAddTime, applyAddMoves, applyShuffle, consumeUndo,
  invertGame, restartGame, startGame, tickGame, verifyBoardIntegrity,
  type GameSession,
} from '../../application/gameSession';
import type { CellPosition } from '../../domain/board';
import {
  DEFAULT_GAME_CONFIG, createGameConfig, type GameConfig, type GameMode,
} from '../../domain/gameConfig';
import { getDailySeed, getTodayKey } from '../../domain/daily';
import { getPuzzle } from '../../domain/puzzle';
import { updateStreakOnWin, saveTodayScore } from '../../infra/dailyStore';
import { calcDailyReward } from '../../../liveops/domain/remoteConfig';
import { getCachedRemoteConfig } from '../../../liveops/infra/remoteConfigService';
import {
  loadCurrentSeed, loadSavedConfig, rememberPlayedSeed,
  saveConfig,
} from '../../infra/gameLocalStore';
import { earnCoins, getBalance, spendCoins } from '../../../economy/infra/walletStore';
import { GameBoard } from '../components/GameBoard';
import { IconPause, IconPlay, IconX, IconContrast, IconUndo, IconShuffle, IconClock, IconBolt, IconCoin } from '../../../shared/ui/nano/Icon';
import type { AppPage, NavParams } from '../../../app/ui/App';

export const R3_DEFAULT_SEED = 'r3-classic-3x3';

type GameResultParams = {
  score: number;
  moves: number;
  elapsedSeconds: number;
  mode: string;
  size: number;
  seed: string;
  moveSequence: { row: number; col: number }[];
  powerUpsUsed: string[];
  continued: boolean;
  verified: boolean;
};

type GamePageProps = {
  params: NavParams;
  onWin:  (p: GameResultParams) => void;
  onLose: (p: GameResultParams) => void;
  onNavigate: (page: AppPage, params?: NavParams) => void;
};

function buildSession(navParams: NavParams): GameSession {
  let config: GameConfig;
  if (navParams.config && typeof navParams.config === 'object') {
    config = navParams.config as GameConfig;
  } else {
    const mode = (navParams.mode as GameMode | undefined) ?? (loadSavedConfig()?.mode ?? DEFAULT_GAME_CONFIG.mode);
    const size  = typeof navParams.size === 'number' ? navParams.size : 3;
    config = createGameConfig(mode === 'classic' || !mode ? 'classic' : mode, { rows: size, columns: size });
  }
  const continued = navParams.continued === true;
  if (config.mode === 'daily') {
    const seed = typeof navParams.seed === 'string' ? navParams.seed : getDailySeed();
    return startGame(config, seed, { continued });
  }
  if (config.mode === 'puzzle') {
    const idx = typeof navParams.puzzleIndex === 'number' ? navParams.puzzleIndex : 0;
    return startGame(config, getPuzzle(idx).seed, { continued });
  }
  const fallbackSeed = config.mode === 'classic' ? R3_DEFAULT_SEED
    : `${config.mode}-${config.size.rows}x${config.size.columns}-default`;
  const seed = loadCurrentSeed(config, fallbackSeed);
  return startGame(config, seed, { continued });
}

function modeKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function GamePage({ params, onWin, onLose, onNavigate }: GamePageProps) {
  const { t } = useTranslation();
  const [session, setSession] = useState<GameSession>(() => buildSession(params));
  const [paused, setPaused] = useState(false);
  const [notified, setNotified] = useState(false);
  const [balance, setBalance] = useState(() => getBalance());
  const snapshotStack = useRef<GameSession[]>([]);

  useEffect(() => {
    const s = buildSession(params);
    setSession(s);
    setNotified(false);
    setPaused(false);
    snapshotStack.current = [];
    setBalance(getBalance());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session.startedAt === null || session.status !== 'playing') return;
    const id = window.setInterval(() => setSession((s) => tickGame(s)), 100);
    return () => window.clearInterval(id);
  }, [session.startedAt, session.status]);

  useEffect(() => {
    if (notified) return;
    if (session.status === 'won') {
      setNotified(true);
      const p = toResultParams(session);
      rememberPlayedSeed(session.config, session.seed);
      saveConfig(session.config);
      if (session.config.mode === 'daily') {
        const todayKey = getTodayKey();
        const streak = updateStreakOnWin(todayKey);
        saveTodayScore(session.score);
        const bonus = calcDailyReward(getCachedRemoteConfig(), streak);
        earnCoins(bonus);
        setBalance(getBalance());
      }
      setTimeout(() => onWin(p), 300);
    } else if (session.status === 'lost') {
      setNotified(true);
      const p = toResultParams(session);
      setTimeout(() => onLose(p), 300);
    }
  }, [session.status, notified, onWin, onLose]);

  const handleCell = useCallback((pos: CellPosition) => {
    if (paused) return;
    setSession((cur) => {
      snapshotStack.current = [cur, ...snapshotStack.current].slice(0, 3);
      return applyMove(cur, pos);
    });
  }, [paused]);

  const handleInvert = useCallback(() => {
    setSession((cur) => invertGame(cur));
  }, []);

  const handleUndo = useCallback(() => {
    setSession((cur) => {
      if (cur.undosRemaining <= 0) return cur;
      const prev = snapshotStack.current[0];
      if (!prev) return cur;
      snapshotStack.current = snapshotStack.current.slice(1);
      return consumeUndo({ ...prev, undosRemaining: cur.undosRemaining, powerUpsUsed: cur.powerUpsUsed });
    });
  }, []);

  const handleShuffle = useCallback(() => {
    if (!spendCoins(30)) return;
    setBalance(getBalance());
    setSession((cur) => {
      snapshotStack.current = [];
      return applyShuffle(cur);
    });
  }, []);

  const handleAddTime = useCallback(() => {
    if (!spendCoins(20)) return;
    setBalance(getBalance());
    setSession((cur) => applyAddTime(cur, 30));
  }, []);

  const handleAddMoves = useCallback(() => {
    if (!spendCoins(15)) return;
    setBalance(getBalance());
    setSession((cur) => applyAddMoves(cur, 5));
  }, []);

  const handleRestart = useCallback(() => {
    setSession((cur) => restartGame(cur));
    setNotified(false);
    setPaused(false);
    snapshotStack.current = [];
  }, []);

  const { config } = session;
  const n = config.size.rows;
  const m = config.size.columns;
  const timeOn   = config.mode === 'time-attack';
  const movesOn  = config.mode === 'move-limit';
  const isBlind  = config.mode === 'blind';
  const isChaos  = config.mode === 'chaos';
  const isPuzzle = config.mode === 'puzzle';
  const baseTime  = timeOn  && config.timeLimit  !== undefined ? config.timeLimit  : 0;
  const baseMoves = movesOn && config.moveLimit !== undefined ? config.moveLimit : 0;
  const timeLeft  = timeOn  ? Math.max(0, baseTime  - session.elapsedSeconds) : 0;
  const movesLeft = movesOn ? Math.max(0, baseMoves - session.moves)          : 0;
  const lights    = session.litCells;
  const displayTime = timeOn ? timeLeft : session.elapsedSeconds;
  const chaosIn   = isChaos ? (session.moves === 0 ? 3 : 3 - (session.moves % 3) || 3) : 0;
  const puzzlePar = isPuzzle ? (session.puzzlePar ?? 0) : 0;

  function fmtSec(s: number) {
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  }

  const modeLabel = t(`game.modes.${modeKey(config.mode)}`, { defaultValue: config.mode.toUpperCase() });
  const canUndo = session.undosRemaining > 0 && snapshotStack.current.length > 0;

  return (
    <div className="screen boot-in">
      {/* HUD top */}
      <div style={{
        padding: '12px 14px', borderBottom: '1px solid var(--line-soft)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'linear-gradient(180deg, var(--bg) 0%, transparent 100%)',
        flexShrink: 0,
      }}>
        <button
          aria-label={paused ? t('game.hud.resumeAria') : t('game.hud.pauseAria')}
          className="lab-btn lab-btn-ghost"
          style={{ padding: 8, minWidth: 38, height: 38 }}
          type="button"
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? <IconPlay size={16} /> : <IconPause size={16} />}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="lab-kicker lab-kicker-cy">{modeLabel} · {n}×{m}</div>
          <div className="lab-mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.08em', marginTop: 2 }}>
            SEED #{session.seed.slice(0, 10).toUpperCase()}
          </div>
        </div>
        {/* Coin balance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconCoin size={12} style={{ color: 'var(--amber)' }} />
          <span className="lab-mono" style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            {balance.toLocaleString('es')}
          </span>
        </div>
        <button
          aria-label={t('game.hud.exitAria')}
          className="lab-btn lab-btn-ghost"
          style={{ padding: 8, minWidth: 38, height: 38 }}
          type="button"
          onClick={() => onNavigate('home')}
        >
          <IconX size={16} />
        </button>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 6, padding: '10px 14px', flexShrink: 0,
      }}>
        <div className={'lab-stat' + (timeOn && timeLeft < 30 ? ' crit' : timeOn && timeLeft < 60 ? ' warn' : '')}>
          <div className="stat-label">{t('game.stats.time')}</div>
          <div className="stat-value" style={{ fontSize: 16 }}>{fmtSec(displayTime)}</div>
        </div>
        <div className={'lab-stat' + (movesOn && movesLeft < 5 ? ' crit' : movesOn && movesLeft < 10 ? ' warn' : '')}>
          <div className="stat-label">{movesOn ? t('game.stats.remainingMoves') : t('game.stats.moves')}</div>
          <div className="stat-value" style={{ fontSize: 16 }}>
            {movesOn ? movesLeft.toString().padStart(2, '0') : session.moves.toString().padStart(2, '0')}
          </div>
        </div>
        <div className={'lab-stat' + (isPuzzle && session.moves > 0 && session.moves <= puzzlePar ? ' good' : isPuzzle && session.moves > puzzlePar ? ' warn' : '')}>
          <div className="stat-label">
            {isPuzzle ? t('game.puzzle.parLabel') : isChaos ? t('game.puzzle.chaosLabel') : t('game.stats.lights')}
          </div>
          <div className="stat-value" style={{ fontSize: 16 }}>
            {isBlind ? '??' : isPuzzle ? puzzlePar.toString().padStart(2, '0') : isChaos ? chaosIn.toString() : lights.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Time progress bar for time-attack */}
      {timeOn && (
        <div style={{ padding: '0 14px', flexShrink: 0 }}>
          <div className={'lab-pbar' + (timeLeft < baseTime * 0.25 ? ' warn' : '')}>
            <div style={{ width: `${(timeLeft / baseTime) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Board */}
      <div
        style={{
          flex: 1, minHeight: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '8px 14px', position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ height: '90%', aspectRatio: '1 / 1', maxWidth: '90%', width: 'auto' }}>
          <GameBoard
            blind={isBlind}
            board={session.board}
            disabled={session.status !== 'playing' || paused}
            onCellPress={handleCell}
          />
        </div>

        {/* Pause overlay */}
        {paused && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(6,16,15,0.85)',
            display: 'grid', placeItems: 'center',
            zIndex: 10,
          }}>
            <div className="lab-brk" style={{ textAlign: 'center', padding: 24 }}>
              <div className="lab-kicker lab-kicker-cy">{t('game.pause.kicker')}</div>
              <div className="lab-h1" style={{ fontSize: 22, marginTop: 6, marginBottom: 16 }}>
                {t('game.pause.title')}
              </div>
              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <button className="lab-btn lab-btn-primary" type="button" onClick={() => setPaused(false)}>
                  <IconPlay size={14} /> {t('game.pause.resume')}
                </button>
                <button className="lab-btn" type="button" onClick={handleRestart}>
                  {t('game.pause.restart')}
                </button>
                <button className="lab-btn lab-btn-ghost" type="button" onClick={() => onNavigate('home')}>
                  {t('game.pause.exit')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Power-ups */}
      <div style={{ padding: '8px 14px 12px', flexShrink: 0 }}>
        <div className="lab-kicker" style={{ marginBottom: 6 }}>{t('game.powerups.label')}</div>
        <div className="lab-tray">
          {/* Invert — always free */}
          <div
            className="lab-tray-slot has"
            title="Invertir luces"
            onClick={session.moves > 0 ? handleInvert : undefined}
            style={{ cursor: session.moves > 0 ? 'pointer' : 'not-allowed', opacity: session.moves > 0 ? 1 : 0.4 }}
          >
            <IconContrast size={18} style={{ color: 'var(--cyan)' }} />
          </div>

          {/* Undo — free, up to 3 */}
          <div
            className={'lab-tray-slot' + (canUndo ? ' has' : '')}
            title={`Deshacer (${session.undosRemaining} restantes)`}
            onClick={canUndo ? handleUndo : undefined}
            style={{ cursor: canUndo ? 'pointer' : 'not-allowed', opacity: canUndo ? 1 : 0.4 }}
          >
            <IconUndo size={18} style={{ color: 'var(--cyan)' }} />
            <span className="qty">×{session.undosRemaining}</span>
          </div>

          {/* Shuffle — 30 coins */}
          <div
            className={'lab-tray-slot' + (balance >= 30 ? ' has' : '')}
            title={`Reordenar (30 monedas)`}
            onClick={balance >= 30 ? handleShuffle : undefined}
            style={{ cursor: balance >= 30 ? 'pointer' : 'not-allowed', opacity: balance >= 30 ? 1 : 0.4 }}
          >
            <IconShuffle size={18} style={{ color: 'var(--amber)' }} />
            <span className="qty">30</span>
          </div>

          {/* Add time (time-attack only) or Add moves (move-limit only) */}
          {timeOn && (
            <div
              className={'lab-tray-slot' + (balance >= 20 ? ' has' : '')}
              title={`+30 segundos (20 monedas)`}
              onClick={balance >= 20 ? handleAddTime : undefined}
              style={{ cursor: balance >= 20 ? 'pointer' : 'not-allowed', opacity: balance >= 20 ? 1 : 0.4 }}
            >
              <IconClock size={18} style={{ color: 'var(--green)' }} />
              <span className="qty">20</span>
            </div>
          )}
          {movesOn && (
            <div
              className={'lab-tray-slot' + (balance >= 15 ? ' has' : '')}
              title={`+5 movimientos (15 monedas)`}
              onClick={balance >= 15 ? handleAddMoves : undefined}
              style={{ cursor: balance >= 15 ? 'pointer' : 'not-allowed', opacity: balance >= 15 ? 1 : 0.4 }}
            >
              <IconBolt size={18} style={{ color: 'var(--green)' }} />
              <span className="qty">15</span>
            </div>
          )}

          {/* Empty filler slots */}
          {(!timeOn && !movesOn ? [1, 2] : [1]).map((i) => <div key={i} className="lab-tray-slot" />)}
        </div>
      </div>

      {/* Score preview at bottom */}
      <div style={{ padding: '4px 14px 8px', flexShrink: 0, borderTop: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="lab-mono" style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: '0.14em' }}>
            {t('game.hud.estScore')}
          </div>
          {session.continued && (
            <span className="lab-chip" style={{ fontSize: 8, padding: '1px 5px', color: 'var(--amber)', borderColor: 'var(--amber)', opacity: 0.8 }}>
              {t('game.hud.continuedPenalty')}
            </span>
          )}
        </div>
        <div className="lab-mono" style={{ fontSize: 14, color: 'var(--cyan)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {session.score.toLocaleString('es')}
        </div>
      </div>
    </div>
  );
}

function toResultParams(session: GameSession): GameResultParams {
  return {
    score:          session.score,
    moves:          session.moves,
    elapsedSeconds: session.elapsedSeconds,
    mode:           session.config.mode,
    size:           session.config.size.rows,
    seed:           session.seed,
    moveSequence:   session.moveSequence.map((p) => ({ row: p.row, col: p.column })),
    powerUpsUsed:   session.powerUpsUsed,
    continued:      session.continued,
    verified:       verifyBoardIntegrity(session),
  };
}
