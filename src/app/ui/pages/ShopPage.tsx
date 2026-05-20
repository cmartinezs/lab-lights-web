import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import { IconClock, IconBolt, IconBulb, IconEye, IconShield, IconUndo, IconShuffle, IconFlame, IconCoin, IconInfo } from '../../../shared/ui/nano/Icon';
import type { AppPage, NavParams } from '../App';
import { useState } from 'react';

type ShopPageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

const POWERUPS = [
  { id: 'p30',  title: '+30 segundos',       desc: 'Suma al temporizador',          cost: 30,  Icon: IconClock },
  { id: 'm5',   title: '+5 movimientos',      desc: 'Extiende límite de movs',       cost: 25,  Icon: IconBolt },
  { id: 'hint', title: 'Sugerencia',          desc: 'Apaga la sala óptima',          cost: 40,  Icon: IconBulb },
  { id: 'rev',  title: 'Revelar salas',       desc: 'Solo modo Blind',               cost: 35,  Icon: IconEye },
  { id: 'pause', title: 'Pausar caos',        desc: 'Suspende perturbaciones 20s',   cost: 50,  Icon: IconShield },
  { id: 'und',  title: 'Deshacer',            desc: 'Reversa último movimiento',     cost: 20,  Icon: IconUndo },
  { id: 'sh',   title: 'Reordenar',           desc: 'Mantiene cantidad de luces',    cost: 30,  Icon: IconShuffle },
  { id: 'ls',   title: 'Última chispa',       desc: 'Continuación consumible',       cost: 70,  Icon: IconFlame },
];

type ThemeEntry = {
  id: string; name: string; a: string; b: string;
  owned?: boolean; active?: boolean; price?: number;
};

const THEMES: ThemeEntry[] = [
  { id: 'cyan',    name: 'Plasma Cyan',     a: '#3ee7d6', b: '#062018', owned: true, active: true },
  { id: 'green',   name: 'CRT Verde',       a: '#78f26d', b: '#0a1f10', owned: true },
  { id: 'amber',   name: 'Ámbar',           a: '#f6b84b', b: '#1f1408', price: 100 },
  { id: 'magenta', name: 'Magenta',         a: '#ff5dc8', b: '#1c0a18', price: 120 },
  { id: 'white',   name: 'Alto contraste',  a: '#e8fff8', b: '#000000', price: 150 },
  { id: 'neon',    name: 'Neón frío',       a: '#7fa9ff', b: '#0a1226', price: 200 },
];

export function ShopPage({ go }: ShopPageProps) {
  const [tab, setTab] = useState<'powerups' | 'themes'>('powerups');

  return (
    <div className="screen boot-in">
      <ScreenHeader kicker="// EXPENDIO DE BONUS" title="Tienda" onBack={() => go('home')} />

      <div style={{ padding: '10px 16px 0' }}>
        <div className="lab-tabs">
          <button className={'lab-tab' + (tab === 'powerups' ? ' is-active' : '')} type="button" onClick={() => setTab('powerups')}>Power-ups</button>
          <button className={'lab-tab' + (tab === 'themes' ? ' is-active' : '')} type="button" onClick={() => setTab('themes')}>Temas</button>
        </div>
      </div>

      {/* Coming soon notice */}
      <div className="lab-panel" style={{ margin: '12px 16px 0', padding: 12, display: 'flex', gap: 10, borderColor: 'var(--cyan-dim)' }}>
        <IconInfo size={16} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
        <div className="lab-mono" style={{ fontSize: 11, color: 'var(--text-2)' }}>
          La tienda de monedas llegará en una próxima actualización.
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '12px 16px 90px' }}>
        {tab === 'powerups' && (
          <div style={{ display: 'grid', gap: 8 }}>
            {POWERUPS.map((p) => (
              <div key={p.id} className="lab-panel" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', opacity: 0.65 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 4,
                  border: '1px solid var(--line)', background: 'var(--panel-2)',
                  display: 'grid', placeItems: 'center', color: 'var(--cyan)', flexShrink: 0,
                }}>
                  <p.Icon size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lab-h1" style={{ fontSize: 14 }}>{p.title}</div>
                  <div className="lab-mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>{p.desc}</div>
                </div>
                <span className="lab-coin" style={{ fontSize: 11 }}>
                  <IconCoin size={12} /> {p.cost}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'themes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {THEMES.map((t) => (
              <div key={t.id} className="lab-panel" style={{
                padding: 10,
                borderColor: t.active ? 'var(--cyan-dim)' : 'var(--line)',
                background: t.active ? 'rgba(62,231,214,0.06)' : 'var(--panel)',
              }}>
                <div style={{
                  background: t.b, borderRadius: 4,
                  border: '1px solid var(--line)', padding: 12,
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, aspectRatio: '1 / 1',
                }}>
                  {[1,0,1,1,1,0,0,1,0].map((v, i) => (
                    <div key={i} style={{
                      background: v ? t.a : 'transparent',
                      border: v ? 'none' : `1px solid ${t.a}22`,
                      boxShadow: v ? `0 0 6px ${t.a}66` : 'none',
                      borderRadius: 2,
                    }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <div className="lab-mono" style={{ fontSize: 11 }}>{t.name}</div>
                  {t.active
                    ? <span className="lab-chip lab-chip-cy" style={{ padding: '2px 6px', fontSize: 9 }}>EN USO</span>
                    : t.owned
                      ? <button className="lab-btn lab-btn-sm" type="button">Usar</button>
                      : <span className="lab-coin" style={{ fontSize: 11 }}><IconCoin size={11} /> {t.price}</span>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
