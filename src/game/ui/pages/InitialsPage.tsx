import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconCheck, IconPlay, IconChevronUp, IconChevronDown, IconWifi, IconCoin } from '../../../shared/ui/nano/Icon';
import { saveResultData, updateResultHmac } from '../../infra/gameLocalStore';
import { signResult } from '../../infra/integrityService';
import { recordWin } from '../../../profile/application/profileService';
import { getLastUsedInitials } from '../../../profile/application/profileService';
import type { AppPage, NavParams } from '../../../app/ui/App';
import { isLoggedIn } from '../../../online/application/authService';
import { enqueueAndSync } from '../../../online/application/syncService';
import type { SubmitScoreRequest } from '../../../online/api/contract';
import type { SyncQueueEntry } from '../../../online/infra/syncQueue';
import { isOnline } from '../../../online/infra/networkStatus';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type InitialsPageProps = {
  params: NavParams;
  go: (page: AppPage, params?: NavParams) => void;
};

export function InitialsPage({ params, go }: InitialsPageProps) {
  const { t } = useTranslation();
  const score         = typeof params.score === 'number' ? params.score : 0;
  const moves         = typeof params.moves === 'number' ? params.moves : 0;
  const elapsedSecs   = typeof params.elapsedSeconds === 'number' ? params.elapsedSeconds : 0;
  const mode          = typeof params.mode === 'string' ? params.mode : 'classic';
  const size          = typeof params.size === 'number' ? params.size : 3;
  const seed          = typeof params.seed === 'string' ? params.seed : '';
  const moveSequence  = Array.isArray(params.moveSequence) ? params.moveSequence as { row: number; col: number }[] : [];
  const powerUpsUsed  = Array.isArray(params.powerUpsUsed) ? params.powerUpsUsed as string[] : [];
  const continued     = params.continued === true;

  const defaultInitials = getLastUsedInitials().padEnd(3, 'A').slice(0, 3).toUpperCase();
  const [letters, setLetters] = useState<string[]>(defaultInitials.split(''));
  const [activeSlot, setActiveSlot] = useState(0);
  const [saved, setSaved] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [hmacValue, setHmacValue] = useState<string>('');
  const [syncEntry, setSyncEntry] = useState<SyncQueueEntry | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Only classic 3x3 without aids is eligible for online ranking in R5/R6
  const onlineEligible = mode === 'classic' && size === 3 && !continued && !powerUpsUsed.includes('invert');

  function pickLetter(letter: string) {
    if (saved) return;
    setLetters((prev) => prev.map((l, i) => (i === activeSlot ? letter : l)));
    setActiveSlot((s) => Math.min(s + 1, 2));
  }

  function scrollSlot(slot: number, dir: 1 | -1) {
    if (saved) return;
    setLetters((prev) =>
      prev.map((l, i) => {
        if (i !== slot) return l;
        const idx = (ALPHABET.indexOf(l) + dir + 26) % 26;
        return ALPHABET[idx] ?? l;
      }),
    );
  }

  function handleSave() {
    if (saved) return;
    const initials = letters.join('');
    const modeTyped = mode as import('../../domain/gameConfig').GameMode;
    saveResultData(
      { mode: modeTyped, rows: size, columns: size, seed, score, moves, elapsedSeconds: elapsedSecs, verified: true },
      initials,
    );
    recordWin(initials, { score, elapsedSeconds: elapsedSecs });
    setSaved(true);
    void signResult(seed, score, moves)
      .then((hmac) => {
        updateResultHmac(seed, modeTyped, hmac);
        setHmacValue(hmac);
      })
      .catch(() => {});
  }

  async function handlePublishOnline() {
    if (syncing) return;
    setSyncing(true);

    const req: SubmitScoreRequest = {
      mode,
      rows: size,
      columns: size,
      seed,
      score,
      moves,
      elapsedSeconds: elapsedSecs,
      hmac: hmacValue,
      moveSequence,
      powerUpsUsed,
      continued,
    };

    try {
      const entry = await enqueueAndSync(req);
      setSyncEntry(entry);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column', padding: '20px 14px', gap: 20 }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div className="lab-kicker lab-kicker-cy">{t('initials.kicker')}</div>
        <div className="lab-h1" style={{ fontSize: 24, marginTop: 6 }}>{t('initials.title')}</div>
        <div className="lab-label" style={{ color: 'var(--muted)', marginTop: 4 }}>
          {t('initials.score')} <span className="lab-mono" style={{ color: 'var(--cyan)' }}>{score.toLocaleString('es')}</span>
        </div>
      </div>

      {/* Slot display with arrows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 280, margin: '0 auto', width: '100%' }}>
        {letters.map((letter, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <button
              aria-label={`Inicial ${index + 1} arriba`}
              className="lab-initial-arrow"
              type="button"
              onClick={() => scrollSlot(index, 1)}
            >
              <IconChevronUp size={16} />
            </button>
            <button
              aria-label={`Inicial ${index + 1}: ${letter}`}
              className={'lab-initial-letter' + (activeSlot === index ? ' active' : '')}
              type="button"
              onClick={() => setActiveSlot(index)}
            >
              {letter}
            </button>
            <button
              aria-label={`Inicial ${index + 1} abajo`}
              className="lab-initial-arrow"
              type="button"
              onClick={() => scrollSlot(index, -1)}
            >
              <IconChevronDown size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Letter keyboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, maxWidth: 340, margin: '0 auto', width: '100%' }}>
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            aria-label={letter}
            className="lab-btn lab-btn-sm"
            style={{ padding: '6px 0', fontFamily: 'var(--f-mono)', fontWeight: 700 }}
            type="button"
            onClick={() => pickLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
        {/* Save confirmation alert */}
        {saved && !alertDismissed && (
          <div
            role="alert"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'rgba(62,231,214,0.08)',
              border: '1px solid var(--cyan)',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--cyan)' }}>
              <IconCheck size={14} />
              <span className="lab-mono" style={{ fontSize: 11, letterSpacing: '0.1em' }}>{t('initials.saved')}</span>
            </div>
            <button
              aria-label="Cerrar alerta"
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 14, padding: '0 4px', lineHeight: 1 }}
              onClick={() => setAlertDismissed(true)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Online sync section */}
        {saved && onlineEligible && (
          <OnlineSyncSection
            syncEntry={syncEntry}
            syncing={syncing}
            onPublish={() => { void handlePublishOnline(); }}
            onGoProfile={() => go('profile')}
          />
        )}

        {/* Primary CTA */}
        {!saved && (
          <button
            aria-label={t('initials.save')}
            className="lab-btn lab-btn-primary lab-btn-block lab-btn-lg"
            type="button"
            onClick={handleSave}
          >
            <IconCheck size={16} />
            {t('initials.save')}
          </button>
        )}
        {saved && (
          <button
            aria-label={t('initials.newGame')}
            className="lab-btn lab-btn-block"
            type="button"
            onClick={() => go('game', { mode, size })}
          >
            <IconPlay size={14} /> {t('initials.newGame')}
          </button>
        )}
        {saved && (
          <button
            className="lab-btn lab-btn-ghost lab-btn-block"
            type="button"
            onClick={() => go('rankings')}
          >
            {t('initials.rankings')}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Online Sync Section ─────────────────────────────────────────

type OnlineSyncSectionProps = {
  syncEntry: SyncQueueEntry | null;
  syncing: boolean;
  onPublish: () => void;
  onGoProfile: () => void;
};

function OnlineSyncSection({ syncEntry, syncing, onPublish, onGoProfile }: OnlineSyncSectionProps) {
  const { t } = useTranslation();
  const loggedIn = isLoggedIn();
  const online = isOnline();

  // Not logged in
  if (!loggedIn) {
    return (
      <div className="lab-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', gap: 8 }}>
        <div className="lab-label" style={{ color: 'var(--muted)', fontSize: 11, flex: 1 }}>
          {t('online.submit.loginRequired')}
        </div>
        <button className="lab-btn lab-btn-sm" style={{ flexShrink: 0 }} type="button" onClick={onGoProfile}>
          <IconWifi size={13} />
          {t('online.submit.loginToSubmit')}
        </button>
      </div>
    );
  }

  // Idle — show publish button
  if (!syncEntry) {
    return (
      <button
        className="lab-btn lab-btn-block"
        disabled={syncing}
        style={{ display: 'flex', alignItems: 'center', gap: 8, borderColor: 'var(--cyan)', color: 'var(--cyan)' }}
        type="button"
        onClick={onPublish}
      >
        <IconWifi size={14} />
        {syncing ? t('online.submit.submitting') : t('online.submit.cta')}
      </button>
    );
  }

  const { status, result, rewards, failureReason } = syncEntry;

  // Pending (offline) — queued for later
  if (status === 'pending') {
    return (
      <div className="lab-panel" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconWifi size={14} style={{ color: 'var(--amber)', flexShrink: 0 }} />
        <div>
          <div className="lab-mono" style={{ fontSize: 11, color: 'var(--amber)' }}>{t('online.sync.queued')}</div>
          <div className="lab-label" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
            {online ? t('online.sync.syncingNow') : t('online.sync.pendingOffline')}
          </div>
        </div>
      </div>
    );
  }

  // Syncing in progress
  if (status === 'syncing') {
    return (
      <div className="lab-panel" style={{ padding: '10px 14px' }}>
        <span className="lab-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{t('online.submit.submitting')}</span>
      </div>
    );
  }

  // Synced successfully
  if (status === 'synced' && result) {
    const rank = result.rank;
    const totalCoins = rewards.reduce((s, r) => s + r.coins, 0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="lab-panel" style={{ padding: '10px 14px', background: 'var(--cyan-dim)', borderColor: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconCheck size={14} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
          <span className="lab-mono" style={{ fontSize: 12, color: 'var(--cyan)' }}>
            {rank !== null && rank > 0
              ? t('online.submit.success', { rank })
              : t('online.submit.successOutside')}
          </span>
        </div>
        {totalCoins > 0 && (
          <div className="lab-panel" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconCoin size={14} style={{ color: 'var(--amber)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              {rewards.map((r) => (
                <div key={r.type} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="lab-label" style={{ fontSize: 11, color: 'var(--muted)' }}>{r.label}</span>
                  <span className="lab-mono" style={{ fontSize: 11, color: 'var(--amber)' }}>+{r.coins}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Rejected
  if (status === 'rejected') {
    const msg = failureReason === 'DUPLICATE_SEED'
      ? t('online.submit.alreadySubmitted')
      : t('online.submit.rejected', { reason: failureReason ?? 'UNKNOWN' });
    return (
      <div className="lab-panel" style={{ padding: '10px 14px', background: 'rgba(255,160,80,0.06)', borderColor: 'var(--amber)' }}>
        <span className="lab-mono" style={{ fontSize: 11, color: 'var(--amber)' }}>{msg}</span>
      </div>
    );
  }

  // Failed (network error, retries exhausted)
  return (
    <div className="lab-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', gap: 8, background: 'rgba(255,100,80,0.06)', borderColor: 'rgba(255,100,80,0.4)' }}>
      <div>
        <div className="lab-mono" style={{ fontSize: 11, color: '#ff8060' }}>{t('online.submit.error')}</div>
        <div className="lab-label" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{t('online.sync.retryInProfile')}</div>
      </div>
    </div>
  );
}
