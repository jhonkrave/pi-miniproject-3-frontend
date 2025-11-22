/**
 * Authentication Provider Component
 * 
 * Wrapper component that initializes and maintains Firebase authentication
 * state synchronization with the Zustand store. This component should wrap
 * the entire application to ensure the authentication state is always kept
 * in sync between Firebase Auth and the application's global state.
 * 
 * Features:
 * - Initializes Firebase authentication state observer on mount
 * - Automatically cleans up the observer on unmount
 * - Keeps Zustand store synchronized with Firebase Auth state changes
 * - Handles authentication persistence across page refreshes
 * 
 * @component
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */

import { useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';

/**
 * Props for the AuthProvider component
 * 
 * @interface AuthProviderProps
 */
interface AuthProviderProps {
  /** Child components to be wrapped by the authentication provider */
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * 
 * Initializes the Firebase authentication observer when the component mounts
 * and cleans it up when the component unmounts. This ensures that the Zustand
 * store remains synchronized with Firebase authentication state throughout
 * the application lifecycle.
 * 
 * @param {AuthProviderProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The provider wrapper with children
 */
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { initAuthObserver } = useAuthStore();

  useEffect(() => {
    // Initialize Firebase authentication observer when component mounts
    // This will immediately check for persisted authentication state
    const unsubscribe = initAuthObserver();

    // Cleanup function: unsubscribe from auth state changes when component unmounts
    // This prevents memory leaks and unnecessary state updates
    return () => unsubscribe();
  }, [initAuthObserver]);

  return <>{children}</>;
};

export default AuthProvider;

