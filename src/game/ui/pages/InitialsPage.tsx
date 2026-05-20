import { useState } from 'react';
import { IconCheck, IconPlay, IconChevronUp, IconChevronDown } from '../../../shared/ui/nano/Icon';
import { saveResultData } from '../../infra/gameLocalStore';
import { recordWin } from '../../../profile/application/profileService';
import { getLastUsedInitials } from '../../../profile/application/profileService';
import type { AppPage, NavParams } from '../../../app/ui/App';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type InitialsPageProps = {
  params: NavParams;
  go: (page: AppPage, params?: NavParams) => void;
};

export function InitialsPage({ params, go }: InitialsPageProps) {
  const score         = typeof params.score === 'number' ? params.score : 0;
  const moves         = typeof params.moves === 'number' ? params.moves : 0;
  const elapsedSecs   = typeof params.elapsedSeconds === 'number' ? params.elapsedSeconds : 0;
  const mode          = typeof params.mode === 'string' ? params.mode : 'classic';
  const size          = typeof params.size === 'number' ? params.size : 3;
  const seed          = typeof params.seed === 'string' ? params.seed : '';

  const defaultInitials = getLastUsedInitials().padEnd(3, 'A').slice(0, 3).toUpperCase();
  const [letters, setLetters] = useState<string[]>(defaultInitials.split(''));
  const [activeSlot, setActiveSlot] = useState(0);
  const [saved, setSaved] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

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
    saveResultData({ mode: mode as import('../../domain/gameConfig').GameMode, rows: size, columns: size, seed, score, moves, elapsedSeconds: elapsedSecs }, initials);
    recordWin(initials, { score, elapsedSeconds: elapsedSecs });
    setSaved(true);
  }

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column', padding: '20px 14px', gap: 20 }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div className="lab-kicker lab-kicker-cy">REGISTRO</div>
        <div className="lab-h1" style={{ fontSize: 24, marginTop: 6 }}>Tus iniciales</div>
        <div className="lab-label" style={{ color: 'var(--muted)', marginTop: 4 }}>
          Puntaje: <span className="lab-mono" style={{ color: 'var(--cyan)' }}>{score.toLocaleString('es')}</span>
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
              <span className="lab-mono" style={{ fontSize: 11, letterSpacing: '0.1em' }}>RESULTADO GRABADO</span>
            </div>
            <button
              aria-label="Cerrar alerta"
              type="button"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', fontSize: 14, padding: '0 4px', lineHeight: 1,
              }}
              onClick={() => setAlertDismissed(true)}
            >
              ✕
            </button>
          </div>
        )}
        {!saved && (
          <button
            aria-label="Grabar resultado"
            className="lab-btn lab-btn-primary lab-btn-block lab-btn-lg"
            type="button"
            onClick={handleSave}
          >
            <IconCheck size={16} />
            Grabar resultado
          </button>
        )}
        {saved && (
          <button
            aria-label="Nueva partida"
            className="lab-btn lab-btn-block"
            type="button"
            onClick={() => go('game', { mode, size })}
          >
            <IconPlay size={14} /> Nueva partida
          </button>
        )}
        {saved && (
          <button
            className="lab-btn lab-btn-ghost lab-btn-block"
            type="button"
            onClick={() => go('rankings')}
          >
            Ver ranking
          </button>
        )}
      </div>
    </div>
  );
}
