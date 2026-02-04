import { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth, AuthState } from '@/hooks/useSupabaseAuth';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithGitHub: () => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useSupabaseAuth();

  // Add some debugging
  console.log('Auth state:', { 
    user: auth.user, 
    loading: auth.loading, 
    error: auth.error,
    isAuthenticated: auth.isAuthenticated 
  });

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}