import type { ReactNode } from 'react';
import { IconArrowLeft } from '../nano/Icon';

type ScreenHeaderProps = {
  kicker?: string;
  title: string;
  onBack?: () => void;
  right?: ReactNode;
};

export function ScreenHeader({ kicker, title, onBack, right }: ScreenHeaderProps) {
  return (
    <div className="lab-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {onBack && (
          <button
            aria-label="Volver"
            className="lab-btn lab-btn-ghost"
            style={{ padding: 6, minWidth: 32, height: 32, borderRadius: 4 }}
            type="button"
            onClick={onBack}
          >
            <IconArrowLeft size={18} />
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          {kicker && (
            <div className="lab-kicker lab-kicker-cy">{kicker}</div>
          )}
          <h1 className="lab-h1" style={{ fontSize: 20, marginTop: 2 }}>
            {title}
          </h1>
        </div>
      </div>
      {right && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {right}
        </div>
      )}
    </div>
  );
}
