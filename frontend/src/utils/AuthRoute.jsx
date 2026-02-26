import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AuthRoute - A wrapper component that controls access to protected routes
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to render if authenticated
 * @param {boolean} [props.requireAdmin=false] - Whether the route requires admin role
 * @param {boolean} [props.bypassInDevelopment=false] - Whether to bypass auth check in development mode
 * @returns {React.ReactNode}
 */
const AuthRoute = ({ children, requireAdmin = false, bypassInDevelopment = true }) => {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const location = useLocation();
  
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Check for auth token to validate authentication state
  useEffect(() => {
    const token = localStorage.getItem('hr_auth_token');
    
    // If we're supposed to be authenticated but there's no token
    if (isAuthenticated && !token) {
      console.error('Auth state mismatch: isAuthenticated=true but no token found');
      logout(); // Properly logout to clear state
    }
  }, [isAuthenticated, logout]);
  
  // If authentication is still loading, show loading state
  if (loading) {
    return <div className="loading-page">Loading authentication...</div>;
  }
  
  // For development, we can bypass auth checks if needed
  if (isDevelopment && bypassInDevelopment) {
    console.log('AUTH CHECK BYPASSED IN DEVELOPMENT MODE');
    return children;
  }
  
  // Debug auth state
  console.log(`Route auth check: isAuthenticated=${isAuthenticated}, path=${location.pathname}`);
  
  // Check if the user is authenticated
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    // Redirect to login page, but remember where they tried to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If we need admin role, check user's role
  if (requireAdmin && user?.role !== 'admin') {
    console.log(`Admin access required, user role is ${user?.role}`);
    return <Navigate to="/unauthorized" />;
  }
  
  // User is authenticated and has necessary permissions
  return children;
};

export default AuthRoute; 