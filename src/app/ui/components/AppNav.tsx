import { IconHome, IconGrid, IconTrophy, IconShop, IconUser } from '../../../shared/ui/nano/Icon';
import type { ComponentType, SVGProps } from 'react';

export type AppPage =
  | 'splash'
  | 'home'
  | 'modes'
  | 'config'
  | 'game'
  | 'result'
  | 'continue'
  | 'initials'
  | 'rankings'
  | 'shop'
  | 'profile'
  | 'settings';

type NavItem = {
  id: AppPage;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  center?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'modes',    label: 'Modos',  Icon: IconGrid },
  { id: 'rankings', label: 'Rank',   Icon: IconTrophy },
  { id: 'home',     label: 'Inicio', Icon: IconHome,  center: true },
  { id: 'shop',     label: 'Tienda', Icon: IconShop },
  { id: 'profile',  label: 'Perfil', Icon: IconUser },
];

export const BOTTOM_NAV_SCREENS = new Set<AppPage>(['home', 'modes', 'rankings', 'shop', 'profile']);

type AppNavProps = {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
};

export function AppNav({ activePage, onNavigate }: AppNavProps) {
  return (
    <nav aria-label="Navegación principal" className="lab-bottom-nav">
      <div className="lab-bottom-nav-row">
        {NAV_ITEMS.map(({ id, label, Icon, center }) => (
          <button
            key={id}
            aria-current={activePage === id ? 'page' : undefined}
            aria-label={label}
            className={[
              'lab-nav-btn',
              center ? 'lab-nav-center' : '',
              activePage === id ? 'is-active' : '',
            ].filter(Boolean).join(' ')}
            type="button"
            onClick={() => onNavigate(id)}
          >
            <Icon size={center ? 26 : 20} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
