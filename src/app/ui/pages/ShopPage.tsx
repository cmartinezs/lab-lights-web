import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import {
  IconClock, IconBolt, IconBulb, IconEye, IconShield, IconUndo, IconShuffle, IconFlame, IconCoin, IconCheck,
} from '../../../shared/ui/nano/Icon';
import { getBalance, spendCoins } from '../../../economy/infra/walletStore';
import {
  THEME_DEFS, getThemeState, purchaseTheme, setActiveTheme, type ThemeId,
} from '../../../economy/infra/themeStore';
import type { AppPage, NavParams } from '../App';

type ShopPageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

const POWERUPS = [
  { id: 'p30',   title: '+30 segundos',  desc: 'Suma al temporizador',        cost: 30,  Icon: IconClock },
  { id: 'm5',    title: '+5 movimientos', desc: 'Extiende límite de movs',     cost: 25,  Icon: IconBolt },
  { id: 'hint',  title: 'Sugerencia',    desc: 'Apaga la sala óptima',         cost: 40,  Icon: IconBulb },
  { id: 'rev',   title: 'Revelar salas', desc: 'Solo modo Blind',              cost: 35,  Icon: IconEye },
  { id: 'pause', title: 'Pausar caos',   desc: 'Suspende perturbaciones 20s',  cost: 50,  Icon: IconShield },
  { id: 'und',   title: 'Deshacer',      desc: 'Reversa último movimiento',    cost: 20,  Icon: IconUndo },
  { id: 'sh',    title: 'Reordenar',     desc: 'Mantiene cantidad de luces',   cost: 30,  Icon: IconShuffle },
  { id: 'ls',    title: 'Última chispa', desc: 'Continuación consumible',      cost: 70,  Icon: IconFlame },
];

export function ShopPage({ go }: ShopPageProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'powerups' | 'themes'>('powerups');
  const [balance, setBalance] = useState(() => getBalance());
  const [themeState, setThemeState] = useState(() => getThemeState());
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setBalance(getBalance());
    setThemeState(getThemeState());
  }, []);

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 1800);
  }

  function handleBuyTheme(id: ThemeId, price: number) {
    if (!spendCoins(price)) {
      showFlash(t('shop.notEnough'));
      return;
    }
    purchaseTheme(id);
    setThemeState(getThemeState());
    setBalance(getBalance());
    showFlash(t('shop.purchased'));
  }

  function handleActivateTheme(id: ThemeId) {
    setActiveTheme(id);
    setThemeState(getThemeState());
    showFlash(t('shop.activated'));
  }

  return (
    <div className="screen boot-in">
      <ScreenHeader kicker={t('shop.kicker')} title={t('shop.title')} onBack={() => go('home')} />

      {/* Balance bar */}
      <div style={{ padding: '8px 16px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="lab-kicker" style={{ fontSize: 9 }}>{t('shop.balance')}</span>
        <span className="lab-mono" style={{ color: 'var(--amber)', fontWeight: 700, fontSize: 15 }}>
          <IconCoin size={13} style={{ verticalAlign: 'middle', marginRight: 3 }} />
          {balance.toLocaleString('es')}
        </span>
      </div>

      {/* Flash message */}
      {flash && (
        <div style={{ margin: '6px 16px 0', padding: '6px 12px', background: 'var(--cyan-dim)', borderRadius: 6, textAlign: 'center' }}>
          <span className="lab-mono" style={{ fontSize: 11, color: 'var(--cyan)' }}>{flash}</span>
        </div>
      )}

      <div style={{ padding: '10px 16px 0' }}>
        <div className="lab-tabs">
          <button className={'lab-tab' + (tab === 'powerups' ? ' is-active' : '')} type="button" onClick={() => setTab('powerups')}>
            {t('shop.tabs.powerups')}
          </button>
          <button className={'lab-tab' + (tab === 'themes' ? ' is-active' : '')} type="button" onClick={() => setTab('themes')}>
            {t('shop.tabs.themes')}
          </button>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '12px 16px 90px' }}>
        {tab === 'powerups' && (
          <>
            <div className="lab-panel" style={{ marginBottom: 10, padding: '10px 12px', borderColor: 'var(--cyan-dim)' }}>
              <span className="lab-mono" style={{ fontSize: 11, color: 'var(--text-2)' }}>
                {t('shop.powerupDesc')}
              </span>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {POWERUPS.map((p) => (
                <div key={p.id} className="lab-panel" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', opacity: 0.7 }}>
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
          </>
        )}

        {tab === 'themes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {THEME_DEFS.map((theme) => {
              const owned = themeState.owned.includes(theme.id);
              const active = themeState.active === theme.id;
              const canAfford = theme.price === null || balance >= theme.price;

              return (
                <div
                  key={theme.id}
                  className="lab-panel"
                  style={{
                    padding: 10,
                    borderColor: active ? 'var(--cyan-dim)' : 'var(--line)',
                    background: active ? 'rgba(62,231,214,0.06)' : 'var(--panel)',
                  }}
                >
                  {/* Preview grid */}
                  <div style={{
                    background: theme.bg, borderRadius: 4,
                    border: '1px solid var(--line)', padding: 12,
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, aspectRatio: '1 / 1',
                  }}>
                    {[1,0,1,1,1,0,0,1,0].map((v, i) => (
                      <div key={i} style={{
                        background: v ? theme.accent : 'transparent',
                        border: v ? 'none' : `1px solid ${theme.accent}22`,
                        boxShadow: v ? `0 0 6px ${theme.accent}66` : 'none',
                        borderRadius: 2,
                      }} />
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 4 }}>
                    <div className="lab-mono" style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {theme.name}
                    </div>
                    {active ? (
                      <span className="lab-chip lab-chip-cy" style={{ padding: '2px 6px', fontSize: 9, flexShrink: 0 }}>
                        <IconCheck size={10} /> {t('shop.active')}
                      </span>
                    ) : owned ? (
                      <button
                        className="lab-btn lab-btn-sm"
                        style={{ flexShrink: 0, fontSize: 10 }}
                        type="button"
                        onClick={() => handleActivateTheme(theme.id)}
                      >
                        {t('shop.use')}
                      </button>
                    ) : (
                      <button
                        className="lab-btn lab-btn-sm"
                        disabled={!canAfford}
                        style={{ flexShrink: 0, fontSize: 10, opacity: canAfford ? 1 : 0.5 }}
                        type="button"
                        onClick={() => theme.price !== null && handleBuyTheme(theme.id, theme.price)}
                      >
                        <IconCoin size={10} /> {theme.price}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
