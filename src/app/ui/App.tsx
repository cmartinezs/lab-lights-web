import { useState } from 'react';
import { ClassicGamePage } from '../../game/ui/pages/ClassicGamePage';
import { ProfilePage } from '../../profile/ui/pages/ProfilePage';
import { RankingsPage } from '../../rankings/ui/pages/RankingsPage';
import { applySettingsToDocument, getSettings } from '../../settings/application/settingsService';
import { SettingsPage } from '../../settings/ui/pages/SettingsPage';
import { AppNav, type AppPage } from './components/AppNav';
import { AppLayout } from '../../shared/ui/layout/AppLayout';

applySettingsToDocument(getSettings());

export function App() {
  const [page, setPage] = useState<AppPage>('game');

  return (
    <AppLayout>
      <AppNav activePage={page} onNavigate={setPage} />
      {page === 'game' && <ClassicGamePage onNavigate={setPage} />}
      {page === 'rankings' && <RankingsPage onBack={() => setPage('game')} />}
      {page === 'profile' && <ProfilePage onBack={() => setPage('game')} />}
      {page === 'settings' && <SettingsPage onBack={() => setPage('game')} />}
    </AppLayout>
  );
}
