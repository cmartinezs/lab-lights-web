import { useCallback } from 'react';
import { IconClock, IconBolt, IconPlay, IconX } from '../../../shared/ui/nano/Icon';
import { getBalance, spendCoins } from '../../../economy/infra/walletStore';
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
  cost: number;
  color: string;
};

const OPTIONS: ContinueOption[] = [
  { id: 'time30',  icon: IconClock, label: '+30 segundos', detail: 'Amplía el tiempo de juego', cost: 5,  color: 'var(--cyan)' },
  { id: 'time60',  icon: IconClock, label: '+60 segundos', detail: 'Más tiempo para resolver',  cost: 10, color: 'var(--cyan)' },
  { id: 'moves5',  icon: IconBolt,  label: '+5 movimientos', detail: 'Movimientos adicionales',  cost: 8,  color: 'var(--amber)' },
  { id: 'spark',   icon: IconBolt,  label: 'Última chispa', detail: 'Resuelve una celda aleatoria', cost: 15, color: 'var(--green)' },
];

export function ContinuePage({ params, go }: ContinuePageProps) {
  const mode        = typeof params.mode === 'string' ? params.mode : 'classic';
  const size        = typeof params.size === 'number' ? params.size : 3;
  const score       = typeof params.score === 'number' ? params.score : 0;
  const seed        = typeof params.seed === 'string' ? params.seed : '';
  const resumeCount = typeof params.resumeCount === 'number' ? params.resumeCount : 0;
  const balance     = getBalance();
  const canFree     = resumeCount < 1;

  const handleContinue = useCallback(() => {
    go('game', { mode, size, seed, continued: true, resumeCount: resumeCount + 1 });
  }, [go, mode, size, seed, resumeCount]);

  const handlePaidOption = useCallback((opt: ContinueOption) => {
    if (!spendCoins(opt.cost)) return;
    go('game', { mode, size, seed, continued: true, resumeCount: resumeCount + 1 });
  }, [go, mode, size, seed, resumeCount]);

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
        <div className="lab-mono" style={{ fontSize: 11, color: 'var(--amber)', marginTop: 4, letterSpacing: '0.1em' }}>
          MONEDAS · {balance.toLocaleString('es')}
        </div>
        {resumeCount > 0 && (
          <div className="lab-mono" style={{ fontSize: 10, color: 'var(--dim)', marginTop: 6 }}>
            Nota: continuar aplica −30% al puntaje final
          </div>
        )}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPTIONS.map((opt) => {
          const { id, icon: Icon, label, detail, cost, color } = opt;
          const canAfford = balance >= cost;
          return (
            <button
              key={id}
              className="lab-panel"
              type="button"
              disabled={!canAfford}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', cursor: canAfford ? 'pointer' : 'not-allowed',
                textAlign: 'left', border: '1px solid var(--line)',
                background: 'var(--panel)', borderRadius: 8, width: '100%',
                opacity: canAfford ? 1 : 0.45,
              }}
              onClick={() => handlePaidOption(opt)}
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
              <div className="lab-mono" style={{ fontSize: 11, color: 'var(--amber)', flexShrink: 0 }}>{cost} 🪙</div>
            </button>
          );
        })}
      </div>

      {/* Free continue + Abandon */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          className="lab-btn lab-btn-block lab-btn-primary lab-btn-lg"
          type="button"
          disabled={!canFree}
          style={{ opacity: canFree ? 1 : 0.5, cursor: canFree ? 'pointer' : 'not-allowed' }}
          onClick={canFree ? handleContinue : undefined}
        >
          <IconPlay size={14} /> {canFree ? 'Continuar gratis (×1)' : 'Continúa gratis ya usada'}
        </button>
        <button className="lab-btn lab-btn-ghost lab-btn-block" type="button" onClick={handleAbandon}>
          <IconX size={14} /> Abandonar partida
        </button>
      </div>
    </div>
  );
}
