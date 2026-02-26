import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Mock users for testing when database is not available
const MOCK_USERS = [
  {
    _id: 'mock-user-001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    position: 'HR Manager',
    department: 'Human Resources',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    _id: 'mock-user-002',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    position: 'Employee',
    department: 'IT Department',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
  }
];

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Use JWT_SECRET or fallback to a default value
    const jwtSecret = process.env.JWT_SECRET || 'hr_system_jwt_secret_fallback';

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp <= currentTime) {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please login again',
        isExpired: true
      });
    }

    try {
      // Try to find user in the database
      const user = await User.findById(decoded.id).select('-password');

      if (user) {
        // Add token expiration information to request
        req.tokenExpiration = {
          expiresAt: new Date(decoded.exp * 1000),
          expiresIn: decoded.exp - currentTime // seconds remaining
        };

        // Set user in request object
        req.user = user;
        next();
        return;
      }
    } catch (dbError) {
      console.log('Database error, using mock user:', dbError.message);
      // Continue to mock users if database lookup fails
    }

    // If we reach here, try mock users
    // Find mock user by id or use a default mock user if ID matches pattern
    const mockUser = MOCK_USERS.find(u => u._id === decoded.id) || 
                    (decoded.id.startsWith('mock-user-') ? {
                      _id: decoded.id,
                      name: 'Mock User',
                      email: 'mock@example.com',
                      role: 'user',
                      position: 'Employee',
                      department: 'Mock Department',
                      profilePic: 'https://randomuser.me/api/portraits/lego/1.jpg',
                    } : null);

    if (!mockUser) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add token expiration information to request
    req.tokenExpiration = {
      expiresAt: new Date(decoded.exp * 1000),
      expiresIn: decoded.exp - currentTime // seconds remaining
    };

    // Set mock user in request object
    req.user = mockUser;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    // Handle token verification errors specifically
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please login again',
        isExpired: true
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// Check if user has admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as an admin'
    });
  }
};

export { protect, admin }; 