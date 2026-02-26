/**
 * Debug utilities for the HR Management System
 */

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Logs debug information conditionally based on environment
 * @param {string} category - Category of log (e.g., 'api', 'auth', 'attendance')
 * @param {string} message - The message to log
 * @param {any} data - Optional data to log
 */
export const debugLog = (category, message, data) => {
  if (isDevelopment) {
    const prefix = `[DEBUG:${category.toUpperCase()}]`;
    
    if (data !== undefined) {
      console.log(prefix, message, data);
    } else {
      console.log(prefix, message);
    }
  }
  // Logs are suppressed in production
};

/**
 * Dumps the current authentication state to console
 * Useful for debugging authentication issues
 */
export const dumpAuthState = () => {
  if (!isDevelopment) return;
  
  try {
    const token = localStorage.getItem('hr_auth_token');
    const userInfo = localStorage.getItem('hr_user_info');
    const tokenExpiry = localStorage.getItem('hr_token_expiry');
    
    console.group('Auth State Debug Info');
    console.log('Token exists:', !!token);
    console.log('User info exists:', !!userInfo);
    console.log('Token expiry:', tokenExpiry ? new Date(parseInt(tokenExpiry)).toLocaleString() : 'Not set');
    
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        console.log('User details:', {
          name: user.name,
          email: user.email,
          role: user.role
        });
      } catch (e) {
        console.log('Error parsing user info:', e);
      }
    }
    
    console.groupEnd();
  } catch (e) {
    console.error('Error dumping auth state:', e);
  }
};

/**
 * Simulates a mock API response delay
 * @param {number} ms - Milliseconds to delay (default: 300)
 * @returns {Promise<void>}
 */
export const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  debugLog,
  dumpAuthState,
  mockDelay,
  isDevelopment
}; 