import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useAuthz';
import { useEffect } from 'react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !isCheckingAdmin) {
      if (!identity || !isAdmin) {
        navigate({ to: '/not-authorized' });
      }
    }
  }, [identity, isAdmin, isInitializing, isCheckingAdmin, navigate]);

  if (isInitializing || isCheckingAdmin) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Verifying permissions...</p>
      </div>
    );
  }

  if (!identity || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
