import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface RoleProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'contributor' | 'moderator' | 'editor' | 'admin' | 'core_admin';
  minRole?: 'user' | 'contributor' | 'moderator' | 'editor' | 'admin' | 'core_admin';
  fallback?: ReactNode;
}

const ROLE_LEVELS = {
  user: 1,
  contributor: 2,
  moderator: 3,
  editor: 4,
  admin: 5,
  core_admin: 6,
};

const ROLE_NAMES = {
  user: 'Community Member',
  contributor: 'Content Contributor',
  moderator: 'Content Moderator',
  editor: 'Content Editor',
  admin: 'Platform Administrator',
  core_admin: 'Core Administrator',
};

export function RoleProtectedRoute({ 
  children, 
  requiredRole, 
  minRole, 
  fallback 
}: RoleProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return fallback || (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access this page
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const userRole = user.role || 'user';
  const userLevel = ROLE_LEVELS[userRole as keyof typeof ROLE_LEVELS] || 1;

  // Check exact role match
  if (requiredRole && userRole !== requiredRole) {
    return fallback || (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              This page requires {ROLE_NAMES[requiredRole]} access. 
              Your current role: {ROLE_NAMES[userRole as keyof typeof ROLE_NAMES] || userRole}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check minimum role level
  if (minRole) {
    const minLevel = ROLE_LEVELS[minRole];
    if (userLevel < minLevel) {
      return fallback || (
        <div className="container py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
              <CardTitle>Insufficient Permissions</CardTitle>
              <CardDescription>
                This page requires {ROLE_NAMES[minRole]} access or higher. 
                Your current role: {ROLE_NAMES[userRole as keyof typeof ROLE_NAMES] || userRole}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
}