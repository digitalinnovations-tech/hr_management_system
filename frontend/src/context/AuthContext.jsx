import React, { createContext, useState, useEffect, useContext } from 'react';
import authService, { SESSION_TIMEOUT } from '../services/auth';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoLogoutTimer, setAutoLogoutTimer] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    // Check if user is logged in when component mounts
    const initAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          
          // Start auto-logout timer
          startAutoLogoutTimer();
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
        setError('Failed to initialize authentication.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Cleanup timer on unmount
    return () => {
      if (autoLogoutTimer) {
        clearTimeout(autoLogoutTimer);
      }
    };
  }, []);

  // Start auto-logout timer
  const startAutoLogoutTimer = () => {
    // Clear any existing timer
    if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer);
    }

    // Calculate remaining time in session
    const remainingTime = authService.getRemainingSessionTime();
    
    if (remainingTime <= 0) {
      // If token already expired, logout immediately
      handleLogout();
      return;
    }

    // Set timer to logout when token expires
    const timer = setTimeout(() => {
      handleLogout();
      // Notify the user about session expiration
      setError('Your session has expired. Please login again.');
    }, remainingTime);

    setAutoLogoutTimer(timer);
  };

  // Login handler
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.login(email, password);
      setUser(result.user);
      
      // Start auto-logout timer
      startAutoLogoutTimer();
      
      return result;
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    console.log('AuthContext: Logging out user');
    
    // Clear user data and token
    authService.logout();
    setUser(null);
    
    // Clear auto-logout timer
    if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer);
      setAutoLogoutTimer(null);
    }
    
    // For a clean logout, ensure we've cleared everything
    // Double-check localStorage is cleared
    localStorage.removeItem('hr_auth_token');
    localStorage.removeItem('hr_user_info');
    localStorage.removeItem('hr_token_expiry');
    
    // Optional: force page refresh for a clean slate
    // Uncomment if needed
    // window.location.href = '/login';
  };

  // Reset session timer - call this on user activity
  const resetSessionTimer = () => {
    if (user) {
      startAutoLogoutTimer();
    }
  };

  // Context value
  const contextValue = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    resetSessionTimer,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 