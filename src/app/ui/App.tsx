import { useState, useCallback, useEffect } from 'react';
import { applySettingsToDocument, getSettings } from '../../settings/application/settingsService';
import { initSession, type SessionHistory } from '../../shared/infra/sessionStore';
import { AppLayout } from '../../shared/ui/layout/AppLayout';
import { AppNav, BOTTOM_NAV_SCREENS, type AppPage } from './components/AppNav';
export type { AppPage } from './components/AppNav';
import { SplashPage } from './pages/SplashPage';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ModesPage } from '../../game/ui/pages/ModesPage';
import { ModeConfigPage } from '../../game/ui/pages/ModeConfigPage';
import { GamePage } from '../../game/ui/pages/GamePage';
import { ResultPage } from '../../game/ui/pages/ResultPage';
import { ContinuePage } from '../../game/ui/pages/ContinuePage';
import { InitialsPage } from '../../game/ui/pages/InitialsPage';
import { DailyPage } from '../../game/ui/pages/DailyPage';
import { RankingsPage } from '../../rankings/ui/pages/RankingsPage';
import { ProfilePage } from '../../profile/ui/pages/ProfilePage';
import { SettingsPage } from '../../settings/ui/pages/SettingsPage';
import { FriendsPage } from '../../social/ui/pages/FriendsPage';
import { AddFriendPage } from '../../social/ui/pages/AddFriendPage';
import { setupAutoSync } from '../../online/application/syncService';
import { applyPersistedTheme } from '../../economy/infra/themeStore';

applySettingsToDocument(getSettings());
applyPersistedTheme();
export const SESSION_HISTORY: SessionHistory = initSession();

export type NavParams = Record<string, unknown>;

const IS_TEST = import.meta.env.MODE === 'test';
const INITIAL_SCREEN: AppPage = IS_TEST ? 'home' : 'splash';

export function App() {
  const [page, setPage] = useState<AppPage>(INITIAL_SCREEN);
  const [params, setParams] = useState<NavParams>({});

  useEffect(() => setupAutoSync(), []);

  const go = useCallback((next: AppPage, nextParams: NavParams = {}) => {
    setPage(next);
    setParams(nextParams);
  }, []);

  const showNav = BOTTOM_NAV_SCREENS.has(page);

  return (
    <div data-color-blind={getSettings().colorBlind ? 'true' : 'false'} style={{ height: '100dvh' }}>
      <AppLayout>
        <div className="lab-app" style={{ height: '100%' }}>
          <div className="screen" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {page === 'splash'   && <SplashPage onDone={() => go('home')} />}
            {page === 'home'     && <HomePage go={go} />}
            {page === 'modes'    && <ModesPage go={go} />}
            {page === 'config'   && (
              <ModeConfigPage
                modeId={params.modeId as string | undefined}
                go={go}
                back={() => go('modes')}
              />
            )}
            {page === 'daily'    && <DailyPage go={go} />}
            {page === 'game'     && (
              <GamePage
                params={params}
                onWin={(p) => go('result', { ...p, win: true })}
                onLose={(p) => go('result', { ...p, win: false })}
                onNavigate={go}
              />
            )}
            {page === 'result'   && <ResultPage params={params} go={go} />}
            {page === 'continue' && <ContinuePage params={params} go={go} />}
            {page === 'initials' && <InitialsPage params={params} go={go} />}
            {page === 'rankings' && <RankingsPage go={go} />}
            {page === 'shop'     && <ShopPage go={go} />}
            {page === 'profile'     && <ProfilePage go={go} />}
            {page === 'settings'    && <SettingsPage go={go} back={() => go('profile')} />}
            {page === 'friends'     && <FriendsPage go={go} />}
            {page === 'add-friend'  && <AddFriendPage go={go} />}
          </div>
          {showNav && (
            <AppNav activePage={page} onNavigate={(p) => go(p)} />
          )}
        </div>
      </AppLayout>
    </div>
  );
}
