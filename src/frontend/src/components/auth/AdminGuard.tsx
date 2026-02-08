import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useAuthz';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, isInitializing, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're sure the user is not an admin
    // Don't redirect if they're not logged in (let them see the login prompt)
    if (!isInitializing && !isCheckingAdmin && identity && !isAdmin) {
      navigate({ to: '/not-authorized' });
    }
  }, [identity, isAdmin, isInitializing, isCheckingAdmin, navigate]);

  // Show loading state while checking authentication
  if (isInitializing || (identity && isCheckingAdmin)) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Verifying permissions...</p>
      </div>
    );
  }

  // If not authenticated, show login prompt instead of redirecting
  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <ShieldAlert className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Administrator Access Required</h2>
            <p className="text-muted-foreground">
              This area is restricted to authorized administrators. Please log in to continue.
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              size="lg"
              className="w-full max-w-xs"
            >
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login as Administrator'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/' })}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but not admin, redirect will happen via useEffect
  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
