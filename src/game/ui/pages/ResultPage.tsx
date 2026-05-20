import { useCallback } from 'react';
import { IconPlay, IconCheck, IconX, IconStar } from '../../../shared/ui/nano/Icon';
import type { AppPage, NavParams } from '../../../app/ui/App';

type ResultPageProps = {
  params: NavParams;
  go: (page: AppPage, params?: NavParams) => void;
};

export function ResultPage({ params, go }: ResultPageProps) {
  const win           = params.win === true;
  const score         = typeof params.score === 'number' ? params.score : 0;
  const moves         = typeof params.moves === 'number' ? params.moves : 0;
  const elapsedSecs   = typeof params.elapsedSeconds === 'number' ? params.elapsedSeconds : 0;
  const mode          = typeof params.mode === 'string' ? params.mode : 'classic';
  const size          = typeof params.size === 'number' ? params.size : 3;
  const seed          = typeof params.seed === 'string' ? params.seed : '';

  const handlePlayAgain = useCallback(() => {
    go('game', { mode, size, seed });
  }, [go, mode, size, seed]);

  const handleNewGame = useCallback(() => {
    go('game', { mode, size });
  }, [go, mode, size]);

  const handleInitials = useCallback(() => {
    go('initials', params);
  }, [go, params]);

  const handleContinue = useCallback(() => {
    go('continue', params);
  }, [go, params]);

  const handleHome = useCallback(() => {
    go('home');
  }, [go]);

  function fmtSec(s: number) {
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  }

  const modeLabelMap: Record<string, string> = {
    classic: 'CLASSIC', 'time-attack': 'TIME ATTACK', 'move-limit': 'MOVE LIMIT', dimensional: 'DIMENSIONAL',
  };
  const modeLabel = modeLabelMap[mode] ?? mode.toUpperCase();

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column', padding: '20px 14px', gap: 16 }}>
      {/* Verdict */}
      <div className="lab-brk" style={{ textAlign: 'center', padding: '24px 16px' }}>
        <div className="lab-kicker lab-kicker-cy">{modeLabel} · {size}×{size}</div>
        {win ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 56, height: 56, borderRadius: '50%',
              border: '2px solid var(--cyan)', background: 'var(--cyan-dim)',
              margin: '12px auto',
            }}>
              <IconCheck size={28} style={{ color: 'var(--cyan)' }} />
            </div>
            <div className="lab-h1" style={{ fontSize: 26, color: 'var(--cyan)', marginBottom: 4 }}>
              Luces apagadas
            </div>
            <div className="lab-label" style={{ color: 'var(--muted)' }}>Tablero resuelto</div>
          </>
        ) : (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 56, height: 56, borderRadius: '50%',
              border: '2px solid var(--amber)', background: 'var(--amber-dim)',
              margin: '12px auto',
            }}>
              <IconX size={28} style={{ color: 'var(--amber)' }} />
            </div>
            <div className="lab-h1" style={{ fontSize: 26, color: 'var(--amber)', marginBottom: 4 }}>
              Tiempo agotado
            </div>
            <div className="lab-label" style={{ color: 'var(--muted)' }}>El laboratorio sigue encendido</div>
          </>
        )}
      </div>

      {/* Score */}
      <div className="lab-panel" style={{ padding: '16px 16px 12px' }}>
        <div className="lab-kicker" style={{ marginBottom: 12 }}>PUNTAJE FINAL</div>
        <div className="lab-mono" style={{ fontSize: 36, color: win ? 'var(--cyan)' : 'var(--amber)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 12 }}>
          {score.toLocaleString('es')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="lab-result-row">
            <span>Movimientos</span>
            <span className="lab-mono">{moves.toString().padStart(3, '0')}</span>
          </div>
          <div className="lab-result-row">
            <span>Tiempo</span>
            <span className="lab-mono">{fmtSec(elapsedSecs)}</span>
          </div>
          {win && size >= 5 && (
            <div className="lab-result-row" style={{ color: 'var(--cyan)' }}>
              <span>Bonus tablero {size}×{size}</span>
              <span className="lab-mono">×1.2</span>
            </div>
          )}
        </div>
      </div>

      {/* Rewards */}
      {win && (
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="lab-panel" style={{ flex: 1, padding: '10px 12px', textAlign: 'center' }}>
            <div className="lab-kicker" style={{ marginBottom: 4 }}>XP</div>
            <div className="lab-mono" style={{ fontSize: 18, color: 'var(--cyan)', fontWeight: 700 }}>+{Math.round(score / 100)}</div>
          </div>
          <div className="lab-panel" style={{ flex: 1, padding: '10px 12px', textAlign: 'center' }}>
            <div className="lab-kicker" style={{ marginBottom: 4 }}>MONEDAS</div>
            <div className="lab-mono" style={{ fontSize: 18, color: 'var(--amber)', fontWeight: 700 }}>+{Math.round(score / 200)}</div>
          </div>
          <div className="lab-panel" style={{ flex: 1, padding: '10px 12px', textAlign: 'center' }}>
            <div className="lab-kicker" style={{ marginBottom: 4 }}>RACHA</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <IconStar size={18} style={{ color: 'var(--amber)' }} />
            </div>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
        {win ? (
          <>
            <button className="lab-btn lab-btn-primary lab-btn-block lab-btn-lg" type="button" onClick={handleInitials}>
              <IconStar size={16} /> Registrar iniciales
            </button>
            <button className="lab-btn lab-btn-block" type="button" onClick={handleNewGame}>
              <IconPlay size={14} /> Jugar otra vez
            </button>
            <button className="lab-btn lab-btn-ghost lab-btn-block" type="button" onClick={handleHome}>
              Volver al inicio
            </button>
          </>
        ) : (
          <>
            <button className="lab-btn lab-btn-primary lab-btn-block lab-btn-lg" type="button" onClick={handleContinue}>
              Continuar partida
            </button>
            <button className="lab-btn lab-btn-block" type="button" onClick={handlePlayAgain}>
              <IconPlay size={14} /> Reintentar
            </button>
            <button className="lab-btn lab-btn-ghost lab-btn-block" type="button" onClick={handleHome}>
              Volver al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
}
