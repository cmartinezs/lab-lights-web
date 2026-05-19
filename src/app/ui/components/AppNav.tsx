import { IconCog, IconGrid, IconTrophy, IconUser } from '../../../shared/ui/nano/Icon';
import type { ComponentType, SVGProps } from 'react';

export type AppPage = 'game' | 'rankings' | 'profile' | 'settings';

type NavItem = {
  page: AppPage;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
};

const navItems: NavItem[] = [
  { page: 'game', label: 'Juego', Icon: IconGrid },
  { page: 'rankings', label: 'Ranking', Icon: IconTrophy },
  { page: 'profile', label: 'Perfil', Icon: IconUser },
  { page: 'settings', label: 'Config', Icon: IconCog },
];

type AppNavProps = {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
};

export function AppNav({ activePage, onNavigate }: AppNavProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 z-10 border-b border-lab-line bg-lab-bg/90 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2 sm:px-6 lg:px-8" role="list">
        {navItems.map(({ page, label, Icon }) => {
          const active = activePage === page;
          return (
            <li key={page}>
              <button
                aria-current={active ? 'page' : undefined}
                aria-label={label}
                className={[
                  'flex min-h-9 items-center gap-1.5 rounded-md px-2.5 font-mono text-xs font-bold uppercase tracking-wider transition focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg sm:px-3',
                  active ? 'bg-lab-cyan/10 text-lab-cyan' : 'text-lab-muted hover:text-lab-text',
                ].join(' ')}
                type="button"
                onClick={() => onNavigate(page)}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
