import { ReactNode } from 'react';
import LoginButton from '../auth/LoginButton';
import { Button } from '../ui/button';

interface AppShellProps {
  children: ReactNode;
  currentView: 'my-tips' | 'science-library';
  onViewChange: (view: 'my-tips' | 'science-library') => void;
}

export default function AppShell({ children, currentView, onViewChange }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/app-logo.dim_512x512.png" 
              alt="Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-xl font-bold text-foreground">Food Preservation Journal</h1>
          </div>
          <LoginButton />
        </div>
      </header>

      <div className="container px-4 py-6">
        <nav className="mb-8 flex gap-2 border-b border-border">
          <Button
            variant={currentView === 'my-tips' ? 'default' : 'ghost'}
            onClick={() => onViewChange('my-tips')}
            className="rounded-b-none"
          >
            My Tips
          </Button>
          <Button
            variant={currentView === 'science-library' ? 'default' : 'ghost'}
            onClick={() => onViewChange('science-library')}
            className="rounded-b-none"
          >
            Science Library
          </Button>
        </nav>

        <main className="pb-16">{children}</main>
      </div>

      <footer className="mt-auto border-t border-border bg-card py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
