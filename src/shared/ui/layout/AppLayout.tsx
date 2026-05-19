import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh overflow-hidden bg-lab-bg text-lab-text">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(62,231,214,0.14),transparent_32%),linear-gradient(180deg,rgba(7,16,15,0),rgba(7,16,15,0.9))]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(232,255,248,0.8)_1px,transparent_1px)] [background-size:100%_4px]" />
      <div className="relative">{children}</div>
    </div>
  );
}
