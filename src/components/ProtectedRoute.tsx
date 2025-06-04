import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: ('admin' | 'manager' | 'member')[];
};

const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['admin', 'manager', 'member'] 
}: ProtectedRouteProps) => {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip for login page
    if (pathname === '/login') return;

    // If not loading and no token, redirect to login
    if (!isLoading && !token) {
      router.push('/login');
      return;
    }

    // If user loaded but not in allowed roles, redirect to dashboard
    if (user && !allowedRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, token, isLoading, router, allowedRoles, pathname]);

  // Show nothing while loading or if not authenticated
  if (isLoading || (!token && pathname !== '/login')) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If on login page and already authenticated, redirect to dashboard
  if (pathname === '/login' && token) {
    router.push('/dashboard');
    return null;
  }

  // If user doesn't have permission, show access denied
  if (user && !allowedRoles.includes(user.role) && pathname !== '/dashboard') {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
