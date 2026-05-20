import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import { IconGrid, IconClock, IconBolt, IconLock, IconChevronRight, IconCalendar } from '../../../shared/ui/nano/Icon';
import type { AppPage, NavParams } from '../../../app/ui/App';

export const ALL_MODES = [
  { id: 'classic',     title: 'Classic',        desc: '3×3 sin límites',                    level: 1 },
  { id: 'time-attack', title: 'Time Attack',     desc: 'Resuelve antes del tiempo',          level: 2 },
  { id: 'move-limit',  title: 'Move Limit',      desc: 'Pocos movimientos disponibles',      level: 3 },
  { id: 'dimensional', title: 'Dimensional',     desc: '3×3 hasta 10×10 configurable',       level: 4 },
  { id: 'daily',       title: 'Daily Challenge', desc: 'Una partida por día · seed única',   level: 1 },
  { id: 'blind',       title: 'Blind',           desc: 'Sin estado visible del tablero',     level: 5, locked: true },
  { id: 'mirror',      title: 'Mirror',          desc: 'Simetría especular en movimientos',  level: 6, locked: true },
  { id: 'chaos',       title: 'Chaos',           desc: 'Perturbaciones aleatorias',          level: 8, locked: true },
  { id: 'chain',       title: 'Chain Reaction',  desc: 'Cascadas en cadena',                 level: 10, locked: true },
  { id: 'puzzle',      title: 'Puzzle',          desc: 'Resuelve en el mínimo de pasos',     level: 1 },
];

function getModeIcon(id: string) {
  switch (id) {
    case 'time-attack': return IconClock;
    case 'move-limit':  return IconBolt;
    case 'daily':       return IconCalendar;
    default:            return IconGrid;
  }
}

type ModesPageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

export function ModesPage({ go }: ModesPageProps) {
  const USER_LEVEL = 4;

  return (
    <div className="screen boot-in">
      <ScreenHeader kicker="// ARCHIVO DE MODOS" title="Todos los modos" />

      <div className="screen-scroll" style={{ padding: '12px 16px 90px' }}>
        {/* Progress indicator */}
        <div className="lab-panel" style={{ padding: 12, marginBottom: 14 }}>
          <div className="lab-mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.14em' }}>
            DISPONIBLES · NIVEL {USER_LEVEL}
          </div>
          <div className="lab-dot-line" style={{ marginTop: 8 }}>
            {ALL_MODES.map((m, i) => (
              <div key={i} className={'seg' + (!m.locked && m.level <= USER_LEVEL ? ' live' : '')} />
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ALL_MODES.map((m) => {
            const locked = !!m.locked;
            const MIcon = getModeIcon(m.id);
            return (
              <button
                key={m.id}
                className={'lab-mode-card' + (locked ? ' locked' : '')}
                type="button"
                onClick={locked ? undefined : () => go('config', { modeId: m.id })}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 4,
                    border: '1px solid var(--line)', background: 'var(--bg)',
                    display: 'grid', placeItems: 'center', color: 'var(--cyan)',
                  }}>
                    {locked ? <IconLock size={16} /> : <MIcon size={18} />}
                  </div>
                  {locked
                    ? <span className="lab-chip" style={{ padding: '2px 6px', fontSize: 9 }}>NVL {m.level}</span>
                    : <IconChevronRight size={14} style={{ color: 'var(--dim)' }} />
                  }
                </div>
                <div className="lab-h1" style={{ fontSize: 15 }}>{m.title}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--muted)' }}>
                  {m.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
