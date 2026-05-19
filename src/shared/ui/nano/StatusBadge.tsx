import type { PropsWithChildren } from 'react';

type Tone = 'cyan' | 'green' | 'amber';

const toneClassName: Record<Tone, string> = {
  cyan: 'border-lab-cyan/50 bg-lab-cyan/10 text-lab-cyan',
  green: 'border-lab-green/50 bg-lab-green/10 text-lab-green',
  amber: 'border-lab-amber/50 bg-lab-amber/10 text-lab-amber',
};

export function StatusBadge({ children, tone }: PropsWithChildren<{ tone: Tone }>) {
  return (
    <span
      className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${toneClassName[tone]}`}
    >
      {children}
    </span>
  );
}
