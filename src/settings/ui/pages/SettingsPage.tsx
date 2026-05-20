import { useState } from 'react';
import { getSettings, updateSettings } from '../../application/settingsService';
import { ScreenHeader } from '../../../shared/ui/components/ScreenHeader';
import type { LocalSettings } from '../../domain/settings';
import type { AppPage, NavParams } from '../../../app/ui/App';

type SettingsPageProps = {
  go: (page: AppPage, params?: NavParams) => void;
  back: () => void;
};

export function SettingsPage({ back }: SettingsPageProps) {
  const [settings, setSettings] = useState<LocalSettings>(() => getSettings());

  function handleToggle(key: keyof LocalSettings) {
    setSettings(() => updateSettings({ [key]: !settings[key] }));
  }

  return (
    <div className="screen boot-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        kicker="// CONFIG"
        title="Preferencias"
        onBack={back}
      />

      <div className="screen-scroll" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="lab-panel" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="lab-kicker" style={{ marginBottom: 4 }}>VISUAL</div>
          <SettingToggle
            description="Desactiva animaciones de tablero y transiciones."
            enabled={settings.reducedMotion}
            label="Reducir animaciones"
            onToggle={() => handleToggle('reducedMotion')}
          />
          <SettingToggle
            description="Cambia el color de las celdas activas para mejorar la distinción sin depender del verde."
            enabled={settings.colorBlind}
            label="Modo daltónico"
            onToggle={() => handleToggle('colorBlind')}
          />
        </div>
      </div>
    </div>
  );
}

type SettingToggleProps = {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

function SettingToggle({ label, description, enabled, onToggle }: SettingToggleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--line-soft)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="lab-mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
        <div className="lab-label" style={{ color: 'var(--muted)', marginTop: 3 }}>{description}</div>
      </div>
      <button
        aria-checked={enabled}
        aria-label={label}
        className={'lab-toggle' + (enabled ? ' on' : '')}
        role="switch"
        type="button"
        onClick={onToggle}
      />
    </div>
  );
}
