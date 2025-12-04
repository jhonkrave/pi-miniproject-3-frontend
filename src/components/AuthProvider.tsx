/**
 * Authentication Provider Component
 * 
 * Initializes the auth service listener and updates the store.
 */

import React, { useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { authService } from '../lib/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setIsInitialized, setIsLoading } = useAuthStore();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = authService.onAuthStateChanged((user) => {
        setUser(user);
        setIsInitialized(true);
        setIsLoading(false);
        console.log('Auth State Changed:', user ? 'User Logged In' : 'User Logged Out');
    });

    return () => unsubscribe();
  }, [setUser, setIsInitialized, setIsLoading]);

  return <>{children}</>;
};

export default AuthProvider;
