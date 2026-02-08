import { Link, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useAuthz';

export default function SiteHeader() {
  const router = useRouterState();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const currentPath = router.location.pathname;

  return (
    <header className="border-b bg-card">
      <div 
        className="h-32 bg-cover bg-center relative"
        style={{ backgroundImage: 'url(/assets/generated/header-pattern.dim_1600x400.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/sba-seal.dim_512x512.png" 
              alt="SBA Seal" 
              className="h-20 w-20"
            />
            <div className="text-primary-foreground">
              <h1 className="text-2xl font-bold tracking-tight">SBA Grant Administration</h1>
              <p className="text-sm opacity-90">Small Business Administration</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link to="/">
              <Button variant={currentPath === '/' ? 'default' : 'ghost'}>
                Apply
              </Button>
            </Link>
            <Link to="/status">
              <Button variant={currentPath === '/status' ? 'default' : 'ghost'}>
                Check Status
              </Button>
            </Link>
            {identity && isAdmin && (
              <>
                <Link to="/admin">
                  <Button variant={currentPath === '/admin' ? 'default' : 'ghost'}>
                    Dashboard
                  </Button>
                </Link>
                <Link to="/admin/accounts">
                  <Button variant={currentPath === '/admin/accounts' ? 'default' : 'ghost'}>
                    Accounts
                  </Button>
                </Link>
              </>
            )}
          </div>
          <LoginButton />
        </div>
      </nav>
    </header>
  );
}
