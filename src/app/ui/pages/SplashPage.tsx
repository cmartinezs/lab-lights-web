import { useEffect, useRef, useState } from 'react';
import { createTimeline } from 'animejs';
import { canUseMotion } from '../../../shared/motion/createTimeline';

const BOOT_LINES = [
  { k: 'PSU-01',  label: 'Iniciando suministro eléctrico', ms: 200 },
  { k: 'MEM-04',  label: 'Cargando matriz 3×3',            ms: 280 },
  { k: 'SEED-A',  label: 'Generando seed local',           ms: 220 },
  { k: 'I/O-12',  label: 'Verificando localStorage',       ms: 260 },
  { k: 'AUD-08',  label: 'Sintetizador chiptune listo',    ms: 200 },
  { k: 'NET-00',  label: 'Modo local · sin conexión',      ms: 240 },
  { k: 'OPR-LAB', label: 'Operador identificado',          ms: 220 },
];

// Each item takes 50%–150% of its base duration
function randDelay(ms: number): number {
  return Math.round(ms * (0.5 + Math.random()));
}

type SplashPageProps = { onDone: () => void };

export function SplashPage({ onDone }: SplashPageProps) {
  const [step, setStep]           = useState(0);
  const [done, setDone]           = useState(false);
  const [transitioning, setTrans] = useState(false);
  const lightRef                  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step >= BOOT_LINES.length) {
      setDone(true);
      return;
    }
    const base = BOOT_LINES[step]?.ms ?? 250;
    const t = setTimeout(() => setStep((s) => s + 1), randDelay(base));
    return () => clearTimeout(t);
  }, [step]);

  function handleTap() {
    if (!done || transitioning) return;
    setTrans(true);
    const el = lightRef.current;
    if (!canUseMotion() || !el) {
      onDone();
      return;
    }
    // Traveling-light transition: orb appears, wanders the screen while
    // growing, then bursts to fill the whole viewport.
    createTimeline({
      defaults:   { ease: 'inOutCubic' },
      onComplete: onDone,
    })
      // 1. Appear near the mini-board (upper-right)
      .add(el, { opacity: 1, width: 70, height: 70, duration: 140 })
      // 2. Drift to lower-left (boot log area)
      .add(el, { left: '26%', top: '66%', width: 130, height: 130, duration: 400 })
      // 3. Sweep back through center
      .add(el, { left: '55%', top: '42%', width: 310, height: 310, duration: 360, ease: 'inOutQuad' })
      // 4. Explode outward to fill the screen
      .add(el, { left: '50%', top: '50%', width: 1900, height: 1900, duration: 460, ease: 'outExpo' });
  }

  const progress = step / BOOT_LINES.length;

  return (
    <div
      className="screen boot-in"
      role="presentation"
      style={{
        position:   'relative',
        background: 'var(--bg-deep)',
        padding:    '24px 22px',
        cursor:     done ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onClick={handleTap}
    >
      {/* Traveling light — lives inside the splash, blends over content */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 100 }}>
        <div
          ref={lightRef}
          style={{
            position:     'absolute',
            width:        0,
            height:       0,
            borderRadius: '50%',
            background:   'radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(200,255,252,0.88) 8%, rgba(62,231,214,0.82) 22%, rgba(62,231,214,0.44) 50%, rgba(62,231,214,0.10) 70%, transparent 84%)',
            transform:    'translate(-50%, -50%)',
            mixBlendMode: 'screen',
            opacity:      0,
            left:         '68%',
            top:          '33%',
            willChange:   'width, height, left, top, opacity',
          }}
        />
      </div>

      {/* Title */}
      <div style={{ marginTop: 32, position: 'relative', pointerEvents: 'none' }}>
        <div className="lab-kicker lab-kicker-cy">SISTEMA / V2.0 · LAB ARCADE</div>
        <h1 className="lab-h1" style={{ fontSize: 36, lineHeight: 1.02, marginTop: 6 }}>
          Luces del<br />
          <span style={{ color: 'var(--cyan)' }}>Laboratorio</span>
        </h1>
        <div className="lab-mono" style={{ marginTop: 10, color: 'var(--muted)', fontSize: 11, letterSpacing: '0.14em' }}>
          // PUZZLE · LIGHTS-OUT
        </div>
      </div>

      {/* Mini 3×3 board lights up progressively */}
      <div style={{
        margin: '26px auto',
        width: 180, height: 180,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        pointerEvents: 'none',
      }}>
        {[0,1,2,3,4,5,6,7,8].map((i) => (
          <div key={i} className={'lab-cell' + (i <= step + 1 ? ' on' : '')} style={{ transition: 'all 220ms ease' }}>
            <span className="cell-dot" />
          </div>
        ))}
      </div>

      {/* Boot log */}
      <div className="lab-panel" style={{ padding: 14, pointerEvents: 'none' }}>
        <div className="lab-kicker lab-kicker-cy" style={{ marginBottom: 10 }}>
          Boot Sequence · {Math.round(progress * 100)}%
        </div>
        <div className="lab-pbar" style={{ marginBottom: 12 }}>
          <div style={{ width: `${progress * 100}%` }} />
        </div>
        {BOOT_LINES.slice(0, Math.min(BOOT_LINES.length, step + 1)).map((l, i) => {
          const isCur = i === step;
          return (
            <div key={l.k} className={'lab-boot-line ' + (isCur ? 'run' : 'ok')}>
              <span className="boot-dot" />
              <span className="lab-mono" style={{ color: 'var(--muted)', letterSpacing: '0.1em', fontSize: 11 }}>
                [{l.k}]
              </span>
              <span style={{ color: isCur ? 'var(--text)' : 'var(--text-2)', fontSize: 11 }}>{l.label}</span>
              <span className="boot-status">{isCur ? 'RUN' : 'OK'}</span>
            </div>
          );
        })}
      </div>

      {/* CTA — only visible once all steps complete */}
      <div style={{ marginTop: 18, textAlign: 'center', pointerEvents: 'none', minHeight: 24 }}>
        {done && (
          <div className="lab-mono lab-blink boot-in" style={{ color: 'var(--cyan)', fontSize: 10, letterSpacing: '0.2em' }}>
            █ TOCA PARA CONTINUAR
          </div>
        )}
      </div>
    </div>
  );
}
