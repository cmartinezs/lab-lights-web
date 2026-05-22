import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconCheck, IconPlay, IconChevronUp, IconChevronDown, IconWifi } from '../../../shared/ui/nano/Icon';
import { saveResultData, updateResultHmac } from '../../infra/gameLocalStore';
import { signResult } from '../../infra/integrityService';
import { recordWin } from '../../../profile/application/profileService';
import { getLastUsedInitials } from '../../../profile/application/profileService';
import type { AppPage, NavParams } from '../../../app/ui/App';
import { isLoggedIn } from '../../../online/application/authService';
import { submitScore } from '../../../online/application/scoreService';
import { API_ERROR_CODES, type SubmitScoreRequest } from '../../../online/api/contract';
import { ApiError } from '../../../online/api/contract';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type InitialsPageProps = {
  params: NavParams;
  go: (page: AppPage, params?: NavParams) => void;
};

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'submitted'; rank: number | null }
  | { status: 'rejected'; reason: string }
  | { status: 'error'; message: string };

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
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

  // Only classic 3x3 eligible for online ranking in R5
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
    // Compute HMAC in background and update stored record + keep value for online submit
    void signResult(seed, score, moves)
      .then((hmac) => {
        updateResultHmac(seed, modeTyped, hmac);
        setHmacValue(hmac);
      })
      .catch(() => {});
  }

  async function handleSubmitOnline() {
    if (submitState.status === 'submitting') return;
    setSubmitState({ status: 'submitting' });

    // Use computed HMAC or fallback empty string (server will reject with HMAC_FAILED)
    const hmac = hmacValue;

    const req: SubmitScoreRequest = {
      mode,
      rows: size,
      columns: size,
      seed,
      score,
      moves,
      elapsedSeconds: elapsedSecs,
      hmac,
      moveSequence,
      powerUpsUsed,
      continued,
    };

    try {
      const res = await submitScore(req);
      if (res.accepted) {
        setSubmitState({ status: 'submitted', rank: res.rank });
      } else {
        setSubmitState({ status: 'rejected', reason: res.reason ?? 'UNKNOWN' });
      }
    } catch (err) {
      if (err instanceof ApiError && err.code === API_ERROR_CODES.DUPLICATE_SEED) {
        setSubmitState({ status: 'rejected', reason: 'DUPLICATE_SEED' });
      } else {
        const msg = err instanceof Error ? err.message : t('online.submit.error');
        setSubmitState({ status: 'error', message: msg });
      }
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

        {/* Online submit section (shown after saving) */}
        {saved && onlineEligible && (
          <OnlineSubmitSection
            state={submitState}
            onSubmit={() => { void handleSubmitOnline(); }}
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

// ── Online Submit Section ────────────────────────────────────────

type OnlineSubmitSectionProps = {
  state: SubmitState;
  onSubmit: () => void;
  onGoProfile: () => void;
};

function OnlineSubmitSection({ state, onSubmit, onGoProfile }: OnlineSubmitSectionProps) {
  const { t } = useTranslation();
  const loggedIn = isLoggedIn();

  if (!loggedIn) {
    return (
      <div
        className="lab-panel"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', gap: 8,
        }}
      >
        <div className="lab-label" style={{ color: 'var(--muted)', fontSize: 11, flex: 1 }}>
          {t('online.submit.loginRequired')}
        </div>
        <button
          className="lab-btn lab-btn-sm"
          style={{ flexShrink: 0 }}
          type="button"
          onClick={onGoProfile}
        >
          <IconWifi size={13} />
          {t('online.submit.loginToSubmit')}
        </button>
      </div>
    );
  }

  if (state.status === 'idle') {
    return (
      <button
        className="lab-btn lab-btn-block"
        style={{ display: 'flex', alignItems: 'center', gap: 8, borderColor: 'var(--cyan)', color: 'var(--cyan)' }}
        type="button"
        onClick={onSubmit}
      >
        <IconWifi size={14} />
        {t('online.submit.cta')}
      </button>
    );
  }

  if (state.status === 'submitting') {
    return (
      <button className="lab-btn lab-btn-block" disabled type="button">
        {t('online.submit.submitting')}
      </button>
    );
  }

  if (state.status === 'submitted') {
    const rank = state.rank;
    return (
      <div
        className="lab-panel"
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          background: 'var(--cyan-dim)', borderColor: 'var(--cyan)',
        }}
      >
        <IconCheck size={14} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
        <span className="lab-mono" style={{ fontSize: 12, color: 'var(--cyan)' }}>
          {rank !== null && rank > 0
            ? t('online.submit.success', { rank })
            : t('online.submit.successOutside')}
        </span>
      </div>
    );
  }

  if (state.status === 'rejected') {
    const reasonKey = state.reason === 'DUPLICATE_SEED' ? t('online.submit.alreadySubmitted') : t('online.submit.rejected', { reason: state.reason });
    return (
      <div
        className="lab-panel"
        style={{ padding: '10px 14px', background: 'rgba(255,160,80,0.06)', borderColor: 'var(--amber)' }}
      >
        <span className="lab-mono" style={{ fontSize: 11, color: 'var(--amber)' }}>{reasonKey}</span>
      </div>
    );
  }

  // error
  return (
    <div
      className="lab-panel"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', gap: 8,
        background: 'rgba(255,100,80,0.06)', borderColor: 'rgba(255,100,80,0.4)',
      }}
    >
      <span className="lab-label" style={{ fontSize: 11, color: '#ff8060', flex: 1 }}>
        {state.status === 'error' ? state.message : t('online.submit.error')}
      </span>
      <button className="lab-btn lab-btn-sm" style={{ flexShrink: 0 }} type="button" onClick={onSubmit}>
        {t('online.submit.retry')}
      </button>
    </div>
  );
}
