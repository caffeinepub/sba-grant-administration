import { Link, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useAuthz';

export default function SiteHeader() {
  const router = useRouterState();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const currentPath = router.location.pathname;

  // Determine if we're on an admin route
  const isAdminRoute = currentPath.startsWith('/admin');
  
  // Show login button if:
  // 1. User is authenticated (always show logout), OR
  // 2. User is on an admin route (show login option)
  const showLoginButton = !!identity || isAdminRoute;

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
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 flex-wrap min-w-0">
            <Link to="/">
              <Button variant={currentPath === '/' ? 'default' : 'ghost'} className="whitespace-nowrap">
                Apply
              </Button>
            </Link>
            <Link to="/status">
              <Button variant={currentPath === '/status' ? 'default' : 'ghost'} className="whitespace-nowrap">
                Check Status
              </Button>
            </Link>
            {identity && isAdmin && !isAdminLoading && (
              <>
                <Link to="/admin">
                  <Button variant={currentPath === '/admin' ? 'default' : 'ghost'} className="whitespace-nowrap">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/admin/accounts">
                  <Button variant={currentPath === '/admin/accounts' ? 'default' : 'ghost'} className="whitespace-nowrap">
                    Payment Methods
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex-shrink-0" style={{ minWidth: showLoginButton ? 'auto' : '0' }}>
            {showLoginButton && <LoginButton />}
          </div>
        </div>
      </nav>
    </header>
  );
}
