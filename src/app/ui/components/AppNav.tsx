export type AppPage = 'game' | 'rankings' | 'profile' | 'settings';

type AppNavProps = {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
};

const navItems: { page: AppPage; label: string }[] = [
  { page: 'game', label: 'Juego' },
  { page: 'rankings', label: 'Ranking' },
  { page: 'profile', label: 'Perfil' },
  { page: 'settings', label: 'Config' },
];

export function AppNav({ activePage, onNavigate }: AppNavProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 z-10 border-b border-lab-line bg-lab-bg/90 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2 sm:px-6 lg:px-8" role="list">
        {navItems.map(({ page, label }) => (
          <li key={page}>
            <button
              aria-current={activePage === page ? 'page' : undefined}
              className={[
                'min-h-9 rounded-md px-3 font-mono text-xs font-bold uppercase tracking-wider transition focus:outline-none focus:ring-2 focus:ring-lab-cyan focus:ring-offset-2 focus:ring-offset-lab-bg',
                activePage === page
                  ? 'bg-lab-cyan/10 text-lab-cyan'
                  : 'text-lab-muted hover:text-lab-text',
              ].join(' ')}
              type="button"
              onClick={() => onNavigate(page)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
