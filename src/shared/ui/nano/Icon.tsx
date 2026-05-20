import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 18, children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconHome(p: IconProps)     { return <Svg {...p}><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" /></Svg>; }
export function IconGrid(p: IconProps)     { return <Svg {...p}><rect height="7" rx="1" width="7" x="3" y="3" /><rect height="7" rx="1" width="7" x="14" y="3" /><rect height="7" rx="1" width="7" x="3" y="14" /><rect height="7" rx="1" width="7" x="14" y="14" /></Svg>; }
export function IconTrophy(p: IconProps)   { return <Svg {...p}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v3a3 3 0 0 1-3 3M7 5H4v3a3 3 0 0 0 3 3" /></Svg>; }
export function IconShop(p: IconProps)     { return <Svg {...p}><path d="M3 7h18l-1.5 11.2a2 2 0 0 1-2 1.8H6.5a2 2 0 0 1-2-1.8z" /><path d="M8 7V5a4 4 0 0 1 8 0v2" /></Svg>; }
export function IconUser(p: IconProps)     { return <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Svg>; }
export function IconCog(p: IconProps)      { return <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.3l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.7 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></Svg>; }
export function IconClock(p: IconProps)    { return <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>; }
export function IconBolt(p: IconProps)     { return <Svg {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></Svg>; }
export function IconCoin(p: IconProps)     { return <Svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="M12 8v8M9.5 10h5M9.5 14h5" /></Svg>; }
export function IconPlay(p: IconProps)     { return <Svg {...p}><path d="M7 5l12 7-12 7z" fill="currentColor" /></Svg>; }
export function IconPause(p: IconProps)    { return <Svg {...p}><rect fill="currentColor" height="14" rx="1" width="4" x="6" y="5" /><rect fill="currentColor" height="14" rx="1" width="4" x="14" y="5" /></Svg>; }
export function IconChevronRight(p: IconProps) { return <Svg {...p}><path d="M9 6l6 6-6 6" /></Svg>; }
export function IconChevronLeft(p: IconProps)  { return <Svg {...p}><path d="M15 6l-6 6 6 6" /></Svg>; }
export function IconChevronUp(p: IconProps)    { return <Svg {...p}><path d="M6 15l6-6 6 6" /></Svg>; }
export function IconChevronDown(p: IconProps)  { return <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>; }
export function IconArrowLeft(p: IconProps)    { return <Svg {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></Svg>; }
export function IconX(p: IconProps)        { return <Svg {...p}><path d="M6 6l12 12M18 6l-12 12" /></Svg>; }
export function IconCheck(p: IconProps)    { return <Svg {...p}><path d="M5 12l5 5L20 7" /></Svg>; }
export function IconLock(p: IconProps)     { return <Svg {...p}><rect height="9" rx="1.5" width="14" x="5" y="11" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>; }
export function IconEye(p: IconProps)      { return <Svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Svg>; }
export function IconEyeOff(p: IconProps)   { return <Svg {...p}><path d="M3 3l18 18" /><path d="M10.6 6.1A10.4 10.4 0 0 1 12 6c6.5 0 10 7 10 7a17 17 0 0 1-3.1 3.9M6.7 6.7C3.6 8.7 2 12 2 12s3.5 7 10 7c1.6 0 3.1-.4 4.4-1" /></Svg>; }
export function IconRefresh(p: IconProps)  { return <Svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></Svg>; }
export function IconUndo(p: IconProps)     { return <Svg {...p}><path d="M9 14l-5-5 5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-4" /></Svg>; }
export function IconShuffle(p: IconProps)  { return <Svg {...p}><path d="M16 3h5v5" /><path d="M21 3l-7 7M3 21l7-7M16 21h5v-5M3 3l18 18" /></Svg>; }
export function IconBulb(p: IconProps)     { return <Svg {...p}><path d="M9 18h6M10 21h4" /><path d="M8 14a5 5 0 1 1 8 0c-1 1-1.5 2-1.5 3h-5c0-1-.5-2-1.5-3z" /></Svg>; }
export function IconCalendar(p: IconProps) { return <Svg {...p}><rect height="16" rx="2" width="18" x="3" y="5" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg>; }
export function IconMirror(p: IconProps)   { return <Svg {...p}><path d="M12 3v18" strokeDasharray="3 3" /><path d="M5 7l4 5-4 5zM19 7l-4 5 4 5z" /></Svg>; }
export function IconChaos(p: IconProps)    { return <Svg {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2" /><circle cx="12" cy="12" r="3" /></Svg>; }
export function IconChain(p: IconProps)    { return <Svg {...p}><path d="M10 14a4 4 0 0 1 0-5.7l2-2a4 4 0 0 1 5.7 5.7l-1 1" /><path d="M14 10a4 4 0 0 1 0 5.7l-2 2a4 4 0 0 1-5.7-5.7l1-1" /></Svg>; }
export function IconBlind(p: IconProps)    { return <Svg {...p}><path d="M3 3l18 18M10.6 6.1A10.4 10.4 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-3.5 4M6.7 6.7C3.6 8.7 2 12 2 12s3.5 6 10 6c1.7 0 3.2-.4 4.5-1" /></Svg>; }
export function IconDimensional(p: IconProps) { return <Svg {...p}><rect height="11" rx="1" width="11" x="4" y="4" /><rect height="11" rx="1" width="11" x="9" y="9" /></Svg>; }
export function IconPuzzle(p: IconProps)   { return <Svg {...p}><path d="M9 3h6v3a2 2 0 0 0 4 0V3h2v6a2 2 0 0 0-4 0v0a2 2 0 0 0 4 0H21v8h-6v-3a2 2 0 0 0-4 0v3H3v-6a2 2 0 0 0 4 0v0a2 2 0 0 0-4 0H3V3z" /></Svg>; }
export function IconStar(p: IconProps)     { return <Svg {...p}><path d="M12 3l2.8 6 6.5.6-5 4.4 1.6 6.4L12 17.5 6.1 20.4 7.7 14l-5-4.4 6.5-.6z" /></Svg>; }
export function IconWifi(p: IconProps)     { return <Svg {...p}><path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0" /><circle cx="12" cy="19" fill="currentColor" r="1.2" /></Svg>; }
export function IconWifiOff(p: IconProps)  { return <Svg {...p}><path d="M3 3l18 18M2 8c2-2 4-3 6-3.5M22 8a16 16 0 0 0-7-4.4M5 12a11 11 0 0 1 4-2.4M19 12a11 11 0 0 0-2.8-1.9M8.5 15.5a6 6 0 0 1 7 0" /></Svg>; }
export function IconSound(p: IconProps)    { return <Svg {...p}><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16 8a4 4 0 0 1 0 8M19 5a8 8 0 0 1 0 14" /></Svg>; }
export function IconMute(p: IconProps)     { return <Svg {...p}><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16 9l5 5M21 9l-5 5" /></Svg>; }
export function IconFlame(p: IconProps)    { return <Svg {...p}><path d="M12 3s4 4 4 8a4 4 0 0 1-8 0c0-1.5.8-2.8 1.8-3.6C9.4 9 9 8 9 7c1 0 2 1 3 2 0-2-1-4 0-6z" /></Svg>; }
export function IconShield(p: IconProps)   { return <Svg {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" /></Svg>; }
export function IconInfo(p: IconProps)     { return <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h0" /></Svg>; }
export function IconPaint(p: IconProps)    { return <Svg {...p}><path d="M19 11h2v6a3 3 0 0 1-3 3h-1v-3h-3v3H6a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h13z" /><path d="M5 11V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v5" /></Svg>; }
export function IconContrast(p: IconProps) { return <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18V3z" fill="currentColor" /></Svg>; }
export function IconMedal(p: IconProps)    { return <Svg {...p}><circle cx="12" cy="9" r="6" /><path d="M8.5 14.5 7 20h10l-1.5-5.5" /></Svg>; }
export function IconRankDot(p: IconProps)  { return <Svg {...p}><circle cx="12" cy="12" fill="currentColor" r="3" stroke="none" /></Svg>; }
