import { useCallback } from 'react';
import { IconClock, IconBolt, IconPlay, IconX } from '../../../shared/ui/nano/Icon';
import type { AppPage, NavParams } from '../../../app/ui/App';

type ContinuePageProps = {
  params: NavParams;
  go: (page: AppPage, params?: NavParams) => void;
};

type ContinueOption = {
  id: string;
  icon: typeof IconClock;
  label: string;
  detail: string;
  cost: string;
  color: string;
};

const OPTIONS: ContinueOption[] = [
  { id: 'time30',  icon: IconClock, label: '+30 segundos', detail: 'Amplía el tiempo de juego', cost: '5 monedas',  color: 'var(--cyan)' },
  { id: 'time60',  icon: IconClock, label: '+60 segundos', detail: 'Más tiempo para resolver',  cost: '10 monedas', color: 'var(--cyan)' },
  { id: 'moves5',  icon: IconBolt,  label: '+5 movimientos', detail: 'Movimientos adicionales',  cost: '8 monedas',  color: 'var(--amber)' },
  { id: 'spark',   icon: IconBolt,  label: 'Última chispa', detail: 'Resuelve una celda aleatoria', cost: '15 monedas', color: 'var(--green)' },
];

export function ContinuePage({ params, go }: ContinuePageProps) {
  const mode  = typeof params.mode === 'string' ? params.mode : 'classic';
  const size  = typeof params.size === 'number' ? params.size : 3;
  const score = typeof params.score === 'number' ? params.score : 0;
  const seed  = typeof params.seed === 'string' ? params.seed : '';

  const handleContinue = useCallback(() => {
    go('game', { mode, size, seed });
  }, [go, mode, size, seed]);

  const handleAbandon = useCallback(() => {
    go('home');
  }, [go]);

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column', padding: '20px 14px', gap: 16 }}>
      {/* Header */}
      <div className="lab-brk" style={{ textAlign: 'center', padding: '20px 16px' }}>
        <div className="lab-kicker lab-kicker-cy">PARTIDA INTERRUMPIDA</div>
        <div className="lab-h1" style={{ fontSize: 24, marginTop: 8, marginBottom: 6 }}>¿Continuar?</div>
        <div className="lab-label" style={{ color: 'var(--muted)' }}>
          Usa una ayuda para seguir jugando
        </div>
        <div className="lab-mono" style={{ fontSize: 11, color: 'var(--dim)', marginTop: 8, letterSpacing: '0.1em' }}>
          PUNTAJE ACTUAL · {score.toLocaleString('es')}
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPTIONS.map(({ id, icon: Icon, label, detail, cost, color }) => (
          <button
            key={id}
            className="lab-panel"
            type="button"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', cursor: 'pointer',
              textAlign: 'left', border: '1px solid var(--line)',
              background: 'var(--panel)', borderRadius: 8, width: '100%',
            }}
            onClick={handleContinue}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 6,
              background: 'var(--panel-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="lab-mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
              <div className="lab-label" style={{ color: 'var(--muted)', marginTop: 2 }}>{detail}</div>
            </div>
            <div className="lab-mono" style={{ fontSize: 11, color: 'var(--dim)', flexShrink: 0 }}>{cost}</div>
          </button>
        ))}
      </div>

      {/* Abandon */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button className="lab-btn lab-btn-block lab-btn-primary lab-btn-lg" type="button" onClick={handleContinue}>

          <IconPlay size={14} /> Continuar gratis (×1)
        </button>
        <button className="lab-btn lab-btn-ghost lab-btn-block" type="button" onClick={handleAbandon}>
          <IconX size={14} /> Abandonar partida
        </button>
      </div>
    </div>
  );
}
