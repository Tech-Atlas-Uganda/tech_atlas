import { ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/AuthDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, User } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAdmin?: boolean;
  requireRole?: 'user' | 'contributor' | 'moderator' | 'editor' | 'admin' | 'core_admin';
}

// Role hierarchy levels
const ROLE_LEVELS = {
  'user': 1,
  'contributor': 2,
  'moderator': 3,
  'editor': 4,
  'admin': 5,
  'core_admin': 6
};

export function ProtectedRoute({ 
  children, 
  fallback, 
  requireAdmin = false,
  requireRole
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to sign in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowAuthDialog(true)}
              className="w-full"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </CardContent>
        </Card>
        
        <AuthDialog
          title="Sign in to Tech Atlas"
          logo="/favicon.png"
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
        />
      </div>
    );
  }

  // Get user role from user metadata or default to 'user'
  const userRole = user?.user_metadata?.role || user?.role || 'user';
  const userLevel = ROLE_LEVELS[userRole as keyof typeof ROLE_LEVELS] || 1;

  // Check role-based access
  if (requireRole) {
    const requiredLevel = ROLE_LEVELS[requireRole];
    if (userLevel < requiredLevel) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need {requireRole} access or higher to view this page. 
                Your current role: {userRole}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }
  }

  // Legacy admin check (for backward compatibility)
  if (requireAdmin && !['admin', 'core_admin'].includes(userRole)) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}