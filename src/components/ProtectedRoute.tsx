/**
 * Protected Route Component
 * 
 * Route protection component that ensures routes requiring authentication
 * are only accessible to authenticated users. This component waits for Firebase
 * to complete its initial authentication state check before making routing decisions,
 * preventing premature redirects on page refresh.
 * 
 * Features:
 * - Waits for Firebase authentication initialization before routing
 * - Redirects unauthenticated users to /login
 * - Shows loading state while authentication is being verified
 * - Renders protected content only for authenticated users
 * 
 * @component
 * @example
 * ```tsx
 * <Route 
 *   path="/home" 
 *   element={
 *     <ProtectedRoute>
 *       <Home />
 *     </ProtectedRoute>
 *   } 
 * />
 * ```
 */

import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

/**
 * Props for the ProtectedRoute component
 * 
 * @interface ProtectedRouteProps
 */
interface ProtectedRouteProps {
  /** Child components to render if user is authenticated */
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * A higher-order component that protects routes by checking authentication state.
 * It prevents unauthorized access by:
 * 1. Waiting for Firebase to verify persisted authentication state (isInitialized)
 * 2. Showing a loading state during verification
 * 3. Redirecting to /login if user is not authenticated
 * 4. Rendering protected content if user is authenticated
 * 
 * This solves the "flash of redirect" issue on page refresh by ensuring
 * Firebase has time to check for persisted sessions before making routing decisions.
 * 
 * @param {ProtectedRouteProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @returns {JSX.Element} Protected content, loading state, or redirect to login
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isInitialized } = useAuthStore();
  console.log('user en protect route', user, 'isInitialized', isInitialized);
  
  // Wait for Firebase to complete initial authentication state check
  // This prevents premature redirects when page is refreshed
  if (!isInitialized) {
    // Show loading state while Firebase verifies persisted authentication
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  // Once initialized, check if user is authenticated
  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated - render protected content
  return <>{children}</>;
};

export default ProtectedRoute;

