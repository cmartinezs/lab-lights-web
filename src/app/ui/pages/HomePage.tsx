import { useEffect, useRef } from 'react';
import { createTimeline } from 'animejs';
import type { Timeline } from 'animejs';
import {
  IconPlay, IconClock, IconBolt, IconGrid, IconCalendar, IconCog, IconCoin, IconStar,
} from '../../../shared/ui/nano/Icon';
import { SESSION_HISTORY } from '../App';
import { relTime, fmtDur } from '../../../shared/infra/sessionStore';
import { getLastUsedInitials } from '../../../profile/application/profileService';
import { loadGlobalStats } from '../../../game/infra/gameLocalStore';
import { getBalance } from '../../../economy/infra/walletStore';
import { canUseMotion } from '../../../shared/motion/createTimeline';
import type { AppPage, NavParams } from '../App';

type HomePageProps = {
  go: (page: AppPage, params?: NavParams) => void;
};

// ── Pixel-art: 26×28 top-down lab (2 upper rooms + corridor + main lab + sub-level) ──
const LAB: Record<string, string> = {
  W: '#1b322f',   // wall
  B: '#122220',   // bench / shelf
  T: '#16302c',   // table surface
  a: '#8a6420',   // amber indicator
  g: '#2a5e3a',   // plant
  C: '#3ee7d6',   // ceiling lamp LIT  (glows cyan)
  s: '#1a0a44',   // screen off
  S: '#7b5ef0',   // screen ON         (glows purple)
  '.': '#081210', // floor
};
const NCOLS = 26;
// prettier-ignore
const ART = [
  'WWWWWWWWWWWWWWWWWWWWWWWWWW',  //  0  outer top wall
  'WBBaBBBBBBBBWWBBBBBBaBBBBW',  //  1  upper benches (rooms A & B)
  'WB.sS.....BBWWBB.....sS.BW',  //  2  screens & bench equipment
  'W...........WW...........W',  //  3  room floors
  'W..C.....C..WW..C.....C..W',  //  4  ceiling lamps
  'W...........WW...........W',  //  5
  'W..TT...TT..WW..TT...TT..W',  //  6  lab tables
  'W..TT...TT..WW..TT...TT..W',  //  7
  'W...........WW...........W',  //  8
  'WWWWWW..WWWWWWWWWWW..WWWWW',  //  9  horiz wall — doors at cols 6-7 & 19-20
  'W............C...........W',  // 10  upper corridor with center lamp
  'WWWWWW..WWWWWWWWWWW..WWWWW',  // 11  horiz wall (mirror of row 9)
  'W........................W',  // 12  entering main lab
  'W.......C........C.......W',  // 13  main lab ceiling lamps
  'W........................W',  // 14
  'W...TTTT.........TTTT....W',  // 15  large tables
  'W...TTTT.........TTTT....W',  // 16
  'W........................W',  // 17
  'W..sBBBBs........sBBBBs..W',  // 18  workstation benches
  'W..S.S...........S.S.....W',  // 19  active screens
  'W........................W',  // 20
  'W.......C........C.......W',  // 21  lower main lab ceiling lamps
  'WWWWWWWWWWWWW..WWWWWWWWWWW',  // 22  inner lower wall — door at cols 13-14
  'W............C...........W',  // 23  lower corridor with center lamp
  'WWWWWWWWWWWWW..WWWWWWWWWWW',  // 24  inner lower wall (mirror)
  'W...BB.......g.......BB..W',  // 25  storage / sub-lab
  'WBBBgBBBBBBBBBBBBBBBBgBBBW', // 26  bottom bench with plants
  'WWWWWWWWWWWWWWWWWWWWWWWWWW',  // 27  outer bottom wall
];

// Light path: [col, row] waypoints through corridors & rooms
const LIGHT_PATH: [number, number][] = [
  [13, 17],  // start — main lab
  [5, 16],   // near left tables
  [20, 16],  // near right tables
  [13, 20],  // lower main lab
  [13, 23],  // lower corridor (under lamp)
  [20, 23],  // traverse corridor right
  [10, 25],  // storage
  [13, 23],  // back to corridor
  [13, 17],  // back to main lab
  [7, 12],   // approach upper door
  [7, 10],   // into upper corridor
  [13, 10],  // corridor center (under lamp)
  [19, 10],  // corridor right
  [19, 9],   // room B doorway
  [22, 4],   // deep room B (near lamp)
  [16, 2],   // room B corner
  [19, 9],   // back to room B door
  [13, 10],  // corridor center
  [7, 10],   // corridor left
  [7, 9],    // room A doorway
  [3, 4],    // deep room A
  [9, 2],    // room A corner
  [7, 9],    // back to room A door
  [7, 10],   // corridor
  [7, 12],   // exit to main lab
  [13, 17],  // back to start (loops)
];

function LabArt() {
  const lightRef = useRef<HTMLDivElement>(null);
  const tlRef    = useRef<Timeline | null>(null);

  useEffect(() => {
    const el = lightRef.current;
    if (!el || !canUseMotion()) return;

    const nRows = ART.length;
    const px = (col: number) => `${((col + 0.5) / NCOLS  * 100).toFixed(2)}%`;
    const py = (row: number) => `${((row + 0.5) / nRows   * 100).toFixed(2)}%`;

    const first = LIGHT_PATH[0];
    if (first) {
      el.style.left = px(first[0]);
      el.style.top  = py(first[1]);
    }

    const tl = createTimeline({ loop: true, defaults: { ease: 'inOutSine', duration: 950 } });
    tlRef.current = tl;

    LIGHT_PATH.slice(1).forEach(([col, row]) => {
      tl.add(el, { left: px(col), top: py(row) });
    });

    return () => { tl.cancel(); };
  }, []);

  const cells = ART.flatMap((row, r) =>
    row.split('').map((ch, c) => ({ ch, r, c, key: `${r}-${c}` })),
  );

  return (
    <div style={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: `repeat(${NCOLS}, 1fr)`,
      width: '100%', aspectRatio: `${NCOLS}/${ART.length}`,
      borderRadius: 3, overflow: 'hidden',
    }}>
      {cells.map(({ ch, r, c, key }) => (
        <div
          key={key}
          style={{
            background: LAB[ch] ?? LAB['.'],
            boxShadow: ch === 'C' ? '0 0 5px 2px rgba(62,231,214,0.65)'
                     : ch === 'S' ? '0 0 4px 1px rgba(123,94,240,0.6)'
                     : undefined,
            animation: (ch === 'C' || ch === 'S') ? 'glowPulse 2.8s ease-in-out infinite' : undefined,
            animationDelay: (ch === 'C' || ch === 'S') ? `${((r * NCOLS + c) % 7) * 0.35}s` : undefined,
          }}
        />
      ))}
      {/* Traveling light — absolutely positioned, blends with dark art */}
      <div
        ref={lightRef}
        style={{
          position: 'absolute',
          width: '26%',
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(62,231,214,0.55) 0%, rgba(62,231,214,0.22) 38%, rgba(62,231,214,0.06) 65%, transparent 80%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          zIndex: 2,
        }}
      />
    </div>
  );
}

// ── Side action button ────────────────────────────────────────
function ActionBtn({
  icon: Icon, label, ariaLabel, sub, onClick, accent = 'cy',
}: {
  icon: typeof IconPlay;
  label: string;
  ariaLabel?: string;
  sub?: string;
  onClick: () => void;
  accent?: 'cy' | 'am' | 'gn';
}) {
  const color = accent === 'am' ? 'var(--amber)' : accent === 'gn' ? 'var(--green)' : 'var(--cyan)';
  return (
    <button
      aria-label={ariaLabel ?? label}
      className="lab-home-btn"
      style={{ '--accent': color } as React.CSSProperties}
      type="button"
      onClick={onClick}
    >
      <Icon size={22} />
      <span style={{ lineHeight: 1.1 }}>{label}</span>
      {sub && <span style={{ fontSize: 8, color: 'var(--dim)', letterSpacing: '0.1em' }}>{sub}</span>}
    </button>
  );
}

const MODE_LABELS: Record<string, string> = {
  classic: 'CLSC', 'time-attack': 'T-ATK', 'move-limit': 'M-LIM', dimensional: 'DIM',
};

export function HomePage({ go }: HomePageProps) {
  const initials = getLastUsedInitials();
  const { last, all: history } = SESSION_HISTORY;
  const stats    = loadGlobalStats();
  const coinBalance = getBalance();
  const hasScores = stats.totalScore > 0;

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── Top info bar ──────────────────────────────────── */}
      <div style={{
        padding: '7px 16px 6px',
        borderBottom: '1px solid var(--line-soft)',
        flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {/* Row 1: operator + last session */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="lab-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em' }}>
            OPR <span style={{ color: 'var(--cyan)' }}>{initials}</span>
          </span>
          {last ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="lab-mono" style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: '0.1em' }}>
                ÚLTIMO <span style={{ color: 'var(--text-2)' }}>{relTime(last.ts)}</span>
              </span>
              {last.durMs > 5_000 && (
                <span className="lab-mono" style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: '0.1em' }}>
                  <span style={{ color: 'var(--text-2)' }}>{fmtDur(last.durMs)}</span>
                </span>
              )}
            </div>
          ) : (
            <span className="lab-mono" style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: '0.1em' }}>
              PRIMERA VISITA
            </span>
          )}
        </div>

        {/* Row 2: connection history dots (up to 7) */}
        {history.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'hidden' }}>
            <span className="lab-mono" style={{ fontSize: 8.5, color: 'var(--dim)', letterSpacing: '0.12em', flexShrink: 0 }}>
              HIST
            </span>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center', flex: 1, minWidth: 0 }}>
              {history.slice(0, 7).map((s, i) => (
                <div
                  key={i}
                  title={`${new Date(s.ts).toLocaleString('es')} · ${fmtDur(s.durMs)}`}
                  style={{
                    width: 24, height: 6,
                    borderRadius: 2,
                    background: i === 0 ? 'var(--cyan)' : 'var(--panel-3)',
                    border: `1px solid ${i === 0 ? 'var(--cyan)' : 'var(--line)'}`,
                    flexShrink: 0,
                    opacity: 1 - i * 0.1,
                  }}
                />
              ))}
              {history.length > 7 && (
                <span className="lab-mono" style={{ fontSize: 8, color: 'var(--dim)' }}>
                  +{history.length - 7}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Title — full width, estilo splash ─────────────── */}
      <div style={{
        padding: '16px 20px 12px',
        borderBottom: '1px solid var(--line-soft)',
        flexShrink: 0,
      }}>
        <div className="lab-kicker lab-kicker-cy">SISTEMA / V2.0 · LAB ARCADE</div>
        <h1 className="lab-h1" style={{ fontSize: 28, lineHeight: 1.05, margin: 0 }}>
          Luces del<br />
          <span style={{ color: 'var(--cyan)' }}>Laboratorio</span>
        </h1>
        <div className="lab-mono" style={{ marginTop: 6, color: 'var(--muted)', fontSize: 10, letterSpacing: '0.18em' }}>
          // PUZZLE · LIGHTS-OUT
        </div>

        {/* Coins + total score */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <div style={{
            flex: 1, background: 'var(--panel)', border: '1px solid var(--line)',
            borderRadius: 6, padding: '7px 10px',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <IconCoin size={14} style={{ color: 'var(--amber)', flexShrink: 0 }} />
            <div>
              <div className="lab-mono" style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '0.14em' }}>MONEDAS</div>
              <div className="lab-mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--amber)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {coinBalance.toLocaleString('es')}
              </div>
            </div>
          </div>
          <div style={{
            flex: 1, background: 'var(--panel)', border: '1px solid var(--line)',
            borderRadius: 6, padding: '7px 10px',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <IconStar size={14} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
            <div>
              <div className="lab-mono" style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '0.14em' }}>PTS TOTAL</div>
              <div className="lab-mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--cyan)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {stats.totalScore.toLocaleString('es')}
              </div>
            </div>
          </div>
        </div>

        {/* Per-mode best scores */}
        {hasScores && (
          <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
            {Object.entries(stats.byMode)
              .filter(([, v]) => v > 0)
              .map(([mode, best]) => (
                <div key={mode} style={{
                  background: 'var(--panel-2)', border: '1px solid var(--line-soft)',
                  borderRadius: 4, padding: '3px 7px',
                  display: 'flex', gap: 5, alignItems: 'baseline',
                }}>
                  <span className="lab-mono" style={{ fontSize: 8, color: 'var(--dim)', letterSpacing: '0.1em' }}>
                    {MODE_LABELS[mode] ?? mode}
                  </span>
                  <span className="lab-mono" style={{ fontSize: 9.5, color: 'var(--text-2)', fontVariantNumeric: 'tabular-nums' }}>
                    {best.toLocaleString('es')}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ── Art + side buttons ────────────────────────────── */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '76px 1fr 76px',
        alignItems: 'center',
        padding: '0 2px',
      }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0' }}>
          <ActionBtn
            ariaLabel="Jugar Classic 3×3"
            icon={IconPlay}
            label="Classic"
            sub="3×3"
            accent="cy"
            onClick={() => go('game', { mode: 'classic', size: 3 })}
          />
          <ActionBtn
            icon={IconClock}
            label="Tiempo"
            sub="límite"
            accent="am"
            onClick={() => go('config', { modeId: 'time-attack' })}
          />
          <ActionBtn
            icon={IconBolt}
            label="Movs"
            sub="límite"
            onClick={() => go('config', { modeId: 'move-limit' })}
          />
        </div>

        {/* Center: pixel art */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 4px' }}>
          <div style={{ width: '100%' }}>
            <LabArt />
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0' }}>
          <ActionBtn
            icon={IconCalendar}
            label="Daily"
            sub="5×5"
            accent="am"
            onClick={() => go('game', { mode: 'classic', size: 5, daily: true })}
          />
          <ActionBtn
            icon={IconGrid}
            label="Dimen."
            sub="libre"
            accent="gn"
            onClick={() => go('config', { modeId: 'dimensional' })}
          />
          <ActionBtn
            icon={IconCog}
            label="Modos"
            sub="todos"
            onClick={() => go('modes')}
          />
        </div>
      </div>
    </div>
  );
}
