import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/queries/useUserProfile';
import { useState } from 'react';
import AppShell from './components/layout/AppShell';
import MyTipsScreen from './screens/MyTips/MyTipsScreen';
import ScienceLibraryScreen from './screens/ScienceLibrary/ScienceLibraryScreen';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import { Button } from './components/ui/button';
import { Loader2 } from 'lucide-react';

type View = 'my-tips' | 'science-library';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentView, setCurrentView] = useState<View>('my-tips');

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  // Show profile setup modal only when authenticated, profile is fetched, and no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppShell currentView={currentView} onViewChange={setCurrentView}>
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="max-w-2xl text-center space-y-6">
              <img 
                src="/assets/generated/app-logo.dim_512x512.png" 
                alt="Food Preservation Tips" 
                className="w-32 h-32 mx-auto mb-8"
              />
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Welcome to Your Food Preservation Journal
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Save your favorite preservation tips and explore science-backed methods to keep food fresh longer.
              </p>
              <div className="text-sm text-muted-foreground">
                Please log in to access your tips and the science library.
              </div>
            </div>
          </div>
        </AppShell>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <AppShell currentView={currentView} onViewChange={setCurrentView}>
          {currentView === 'my-tips' && <MyTipsScreen />}
          {currentView === 'science-library' && <ScienceLibraryScreen />}
        </AppShell>
      </div>
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}
