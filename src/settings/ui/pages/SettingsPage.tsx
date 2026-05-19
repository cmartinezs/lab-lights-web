import { useState } from 'react';
import { getSettings, updateSettings } from '../../application/settingsService';
import { LabPanel } from '../../../shared/ui/components/LabPanel';
import type { LocalSettings } from '../../domain/settings';

type SettingsPageProps = {
  onBack: () => void;
};

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [settings, setSettings] = useState<LocalSettings>(() => getSettings());

  function handleToggle(key: keyof LocalSettings) {
    setSettings((current) => updateSettings({ [key]: !current[key] }));
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          className="font-mono text-sm text-lab-muted transition hover:text-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan"
          onClick={onBack}
          type="button"
        >
          ← Volver
        </button>
      </div>

      <LabPanel className="space-y-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-lab-muted">Configuración</p>
          <h1 className="mt-2 font-display text-3xl font-black text-lab-text">Preferencias</h1>
        </div>

        <div className="space-y-3">
          <SettingToggle
            description="Desactiva animaciones de tablero y transiciones. Recomendado si las animaciones causan molestias."
            enabled={settings.reducedMotion}
            label="Reducir animaciones"
            onToggle={() => handleToggle('reducedMotion')}
          />
          <SettingToggle
            description="Cambia el color de las celdas activas a cian para mejorar la distinción sin depender del verde."
            enabled={settings.colorBlind}
            label="Modo daltónico"
            onToggle={() => handleToggle('colorBlind')}
          />
        </div>
      </LabPanel>
    </main>
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
    <div className="flex items-start gap-4 rounded-panel border border-lab-line bg-lab-bg/60 p-4">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-bold text-lab-text">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-lab-muted">{description}</p>
      </div>
      <button
        aria-checked={enabled}
        aria-label={label}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg',
          enabled ? 'border-lab-cyan bg-lab-cyan' : 'border-lab-line bg-lab-panelStrong',
        ].join(' ')}
        role="switch"
        type="button"
        onClick={onToggle}
      >
        <span
          className={[
            'pointer-events-none inline-block h-4 w-4 translate-y-0 rounded-full bg-lab-bg shadow transition',
            enabled ? 'translate-x-5' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  );
}
