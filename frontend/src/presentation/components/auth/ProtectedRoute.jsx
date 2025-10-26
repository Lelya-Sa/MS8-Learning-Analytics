import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../application/state/AuthContext';

/**
 * ProtectedRoute component that protects routes based on authentication and role requirements
 * 
 * Features:
 * - Authentication-based access control
 * - Role-based access control (single or multiple roles)
 * - Loading state handling
 * - Custom fallback components
 * - Custom redirect paths
 * - Accessibility compliant
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when access is granted
 * @param {string} [props.requiredRole] - Single role required for access
 * @param {string[]} [props.requiredRoles] - Multiple roles, user needs at least one
 * @param {React.ReactNode} [props.fallback] - Custom fallback component to render when access is denied
 * @param {string} [props.redirectTo] - Custom redirect path (defaults to '/login')
 * @param {boolean} [props.strictMode] - If true, user must have ALL required roles (default: false, any role)
 * @returns {React.ReactNode} Protected content or fallback/redirect
 */
export const ProtectedRoute = ({
  children,
  requiredRole,
  requiredRoles,
  fallback,
  redirectTo = '/login',
  strictMode = false
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="loading-container" data-testid="loading-spinner" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true"></div>
        <span>Loading...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // Check role permissions if required
  if (requiredRole || requiredRoles) {
    const userRoles = user.roles || [];
    const rolesToCheck = requiredRoles || [requiredRole];
    
    const hasRequiredRole = strictMode 
      ? rolesToCheck.every(role => userRoles.includes(role)) // All roles required
      : rolesToCheck.some(role => userRoles.includes(role)); // Any role required
    
    if (!hasRequiredRole) {
      if (fallback) {
        return fallback;
      }
      
      return (
        <div className="access-denied" data-testid="access-denied" role="alert">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this resource.</p>
          <p>Required role(s): {rolesToCheck.join(', ')}</p>
          <p>Your roles: {userRoles.join(', ')}</p>
          {strictMode && (
            <p><em>Note: All roles are required in strict mode.</em></p>
          )}
        </div>
      );
    }
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
