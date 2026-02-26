// Authentication service for JWT tokens and session management
import { jwtDecode } from 'jwt-decode';

// Constants
const TOKEN_KEY = 'hr_auth_token';
const USER_INFO = 'hr_user_info';
const TOKEN_EXPIRY = 'hr_token_expiry';

export const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Base API URL
const API_URL = 'http://localhost:3001/api';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
const shouldBypassAuth = true; // Set to true to bypass authentication in development

// Mock user for development purposes
const mockUser = {
  _id: 'dev-user-123',
  email: 'admin@example.com',
  name: 'Development User',
  firstName: 'Development',
  lastName: 'User',
  role: 'admin',
  department: 'Development',
  position: 'Developer',
  profilePic: 'https://randomuser.me/api/portraits/men/1.jpg'
};

// Authentication service
const authService = {
  // Login user
  login: async (email, password) => {
    try {
      console.log(`Attempting login with: ${email}`);
      
      // For development, bypass actual API calls
      if (shouldBypassAuth && isDevelopment) {
        console.log('DEVELOPMENT MODE: Bypassing authentication');
        
        // Use provided email or a default
        const userEmail = email || 'admin@example.com';
        
        // Parse the name from email (before the @ symbol)
        const userName = userEmail.split('@')[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        
        // Create a mock user based on the input
        const user = {
          ...mockUser,
          email: userEmail,
          name: formattedName,
          firstName: formattedName,
          lastName: 'User',
        };
        
        // Create a fake token with 24 hour expiry
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        const token = 'dev-mode-token-' + Date.now();
        
        // Store the mock data
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_INFO, JSON.stringify(user));
        localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString());
        
        // Short delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return { user, token, expiryTime };
      }
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data);
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user info in localStorage
      const { token, user, session } = data;
      
      // Use provided expiration time or fall back to decoding token
      let expiryTime;
      
      if (session && session.expiresAt) {
        expiryTime = new Date(session.expiresAt).getTime();
      } else {
        // Decode token to get expiry
        try {
          const decodedToken = jwtDecode(token);
          expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
        } catch (decodeError) {
          console.warn('Could not decode token expiry, using default timeout');
          expiryTime = Date.now() + SESSION_TIMEOUT;
        }
      }
      
      // Log token and expiry for debugging
      console.log(`Login successful. Token expires: ${new Date(expiryTime).toLocaleString()}`);
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_INFO, JSON.stringify(user));
      localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString());

      return { user, token, expiryTime };
    } catch (error) {
      console.error('Login error:', error);
      
      // If in development mode, use mock login as fallback
      if (isDevelopment && shouldBypassAuth) {
        console.log('DEVELOPMENT MODE: Fallback to mock login after error');
        
        // Use provided email or a default
        const userEmail = email || 'admin@example.com';
        
        // Parse the name from email (before the @ symbol)
        const userName = userEmail.split('@')[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        
        // Create a mock user based on the input
        const user = {
          ...mockUser,
          email: userEmail,
          name: formattedName,
          firstName: formattedName,
          lastName: 'User',
        };
        
        // Short delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        const token = 'dev-mode-token-' + Date.now();
        
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_INFO, JSON.stringify(user));
        localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString());
        
        return { user, token, expiryTime };
      }
      
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      // For development, bypass actual API calls
      if (shouldBypassAuth && isDevelopment) {
        console.log('DEVELOPMENT MODE: Bypassing registration');
        
        // Create a mock user based on the input
        const user = {
          _id: 'dev-user-' + Date.now(),
          email: userData.email,
          name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}`
            : userData.name || userData.firstName || userData.email.split('@')[0],
          firstName: userData.firstName || userData.email.split('@')[0],
          lastName: userData.lastName || 'User',
          role: userData.role || 'user',
          department: userData.department || 'General',
          position: userData.position || 'Employee',
          profilePic: 'https://randomuser.me/api/portraits/men/2.jpg'
        };
        
        // Create a fake token with 24 hour expiry
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        const token = 'dev-mode-token-' + Date.now();
        
        // Store the mock data
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_INFO, JSON.stringify(user));
        localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString());
        
        // Short delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        return { success: true, user, token };
      }
      
      // Format the user data to match what the backend expects
      const formattedData = {
        name: userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}`
          : userData.name || userData.firstName || '',
        email: userData.email,
        password: userData.password,
        position: userData.position,
        department: userData.department,
        role: userData.role || 'user'
      };

      console.log('Registering user with data:', formattedData);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Registration failed:', data);
        throw new Error(data.message || 'Registration failed');
      }

      // If registration includes token and user, automatically log in
      if (data.token && data.user) {
        // Store token and user info in localStorage
        const { token, user } = data;
        
        // Decode token to get expiry
        const decodedToken = jwtDecode(token);
        const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
        
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_INFO, JSON.stringify(user));
        localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString());
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      
      // If in development mode, use mock registration as fallback
      if (isDevelopment && shouldBypassAuth) {
        console.log('DEVELOPMENT MODE: Fallback to mock registration after error');
        
        // Create a mock user based on the input
        const user = {
          _id: 'dev-user-' + Date.now(),
          email: userData.email,
          name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}`
            : userData.name || userData.firstName || userData.email.split('@')[0],
          firstName: userData.firstName || userData.email.split('@')[0],
          lastName: userData.lastName || 'User',
          role: userData.role || 'user',
          department: userData.department || 'General',
          position: userData.position || 'Employee',
          profilePic: 'https://randomuser.me/api/portraits/women/2.jpg'
        };
        
        // Create a fake token with 24 hour expiry
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        const token = 'dev-mode-token-' + Date.now();
        
        // Store the mock data
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_INFO, JSON.stringify(user));
        localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString());
        
        // Short delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { success: true, user, token };
      }
      
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO);
    localStorage.removeItem(TOKEN_EXPIRY);
    console.log('User logged out, auth data cleared');
  },

  // Check if user is logged in
  isAuthenticated: () => {
    // In development mode, we can consider the user always authenticated
    if (shouldBypassAuth && isDevelopment) {
      // If no token exists, create one to simulate login
      if (!localStorage.getItem(TOKEN_KEY)) {
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem(TOKEN_KEY, 'dev-mode-token-' + Date.now());
        localStorage.setItem(USER_INFO, JSON.stringify(mockUser));
        localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString());
      }
      return true;
    }
    
    const token = localStorage.getItem(TOKEN_KEY);
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY);
    
    if (!token || !expiryTime) {
      return false;
    }
    
    // Check if token has expired
    const now = Date.now();
    if (now > parseInt(expiryTime)) {
      // Token expired, clean up storage
      console.log('Token expired, clearing auth data');
      authService.logout();
      return false;
    }
    
    return true;
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const userJSON = localStorage.getItem(USER_INFO);
      return userJSON ? JSON.parse(userJSON) : null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get token expiry time
  getTokenExpiry: () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY);
    return expiry ? parseInt(expiry) : null;
  },

  // Get remaining session time in milliseconds
  getRemainingSessionTime: () => {
    const expiry = authService.getTokenExpiry();
    if (!expiry) return 0;
    
    const remainingTime = expiry - Date.now();
    return Math.max(0, remainingTime);
  },

  // Refresh token if needed
  refreshToken: async () => {
    try {
      // For development, bypass actual API calls
      if (shouldBypassAuth && isDevelopment) {
        console.log('DEVELOPMENT MODE: Bypassing token refresh');
        
        // Create a new fake token with 24 hour expiry
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        const token = 'dev-mode-refreshed-token-' + Date.now();
        
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString());
        
        console.log(`Dev token refreshed. New expiry: ${new Date(expiryTime).toLocaleString()}`);
        
        return { token, expiryTime };
      }
      
      console.log('Attempting to refresh token');
      
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Token refresh failed:', data);
        throw new Error(data.message || 'Token refresh failed');
      }

      // Update token and expiry
      const { token } = data;
      const decodedToken = jwtDecode(token);
      const expiryTime = decodedToken.exp * 1000;
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString());
      
      console.log(`Token refreshed. New expiry: ${new Date(expiryTime).toLocaleString()}`);

      return { token, expiryTime };
    } catch (error) {
      console.error('Token refresh error:', error);
      
      // If in development, use mock refresh
      if (isDevelopment && shouldBypassAuth) {
        console.log('DEVELOPMENT MODE: Fallback to mock token refresh');
        
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        const token = 'dev-mode-refreshed-token-' + Date.now();
        
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString());
        
        return { token, expiryTime };
      }
      
      // If refresh fails, log the user out
      authService.logout();
      throw error;
    }
  }
};

export default authService; 