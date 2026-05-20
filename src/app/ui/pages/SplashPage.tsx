import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
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
  const [step, setStep]             = useState(0);
  const [done, setDone]             = useState(false);
  const [transitioning, setTrans]   = useState(false);
  const flashRef                    = useRef<HTMLDivElement>(null);

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
    if (!canUseMotion() || !flashRef.current) {
      onDone();
      return;
    }
    animate(flashRef.current, {
      scale:    [0, 5],
      opacity:  [0, 1],
      duration: 540,
      ease:     'outExpo',
      onComplete: onDone,
    });
  }

  const progress = step / BOOT_LINES.length;

  return (
    <div
      className="screen boot-in"
      role="presentation"
      style={{
        background: 'var(--bg-deep)',
        padding:    '24px 22px',
        cursor:     done ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onClick={handleTap}
    >
      {/* Light burst — fixed so it escapes any overflow clip */}
      <div
        ref={flashRef}
        style={{
          position:        'fixed',
          width:           '100vmax',
          height:          '100vmax',
          top:             '50%',
          left:            '50%',
          marginLeft:      '-50vmax',
          marginTop:       '-50vmax',
          borderRadius:    '50%',
          background:      'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(240,255,255,0.98) 8%, rgba(62,231,214,1) 20%, rgba(62,231,214,0.65) 45%, transparent 70%)',
          zIndex:          999,
          pointerEvents:   'none',
          opacity:         0,
          willChange:      'transform, opacity',
        }}
      />

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
