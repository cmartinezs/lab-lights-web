import type { ElementType, HTMLAttributes, PropsWithChildren } from 'react';

type LabPanelProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    as?: ElementType;
  }
>;

export function LabPanel({ as: Component = 'div', className = '', children, ...props }: LabPanelProps) {
  return (
    <Component
      className={`rounded-panel border border-lab-line bg-lab-panel/85 p-5 shadow-glow backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
