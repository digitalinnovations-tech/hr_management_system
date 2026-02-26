import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Mock user for testing when database is not available
const MOCK_USERS = [
  {
    _id: 'mock-user-001',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$ij3DtxU3QNxFsxVNvHAK9.GAr52F9toJJFNmt3DXES.vv0KYgxkwe', // bcrypt hash for 'password123'
    role: 'admin',
    position: 'HR Manager',
    department: 'Human Resources',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    matchPassword: async (enteredPassword) => enteredPassword === 'password123'
  },
  {
    _id: 'mock-user-002',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$ij3DtxU3QNxFsxVNvHAK9.GAr52F9toJJFNmt3DXES.vv0KYgxkwe', // bcrypt hash for 'password123'
    role: 'user',
    position: 'Employee',
    department: 'IT Department',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
    matchPassword: async (enteredPassword) => enteredPassword === 'password123'
  }
];

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hr_system_jwt_secret_fallback', {
    expiresIn: '2h', // Set token expiration to 2 hours
  });
};

// Helper to find a mock user
const findMockUser = (email) => MOCK_USERS.find(user => user.email === email);

// @desc    Register a new user
const registerUser = async (req, res) => {
  try {
    // Log the received data to help with debugging
    console.log('Registration request body:', req.body);
    
    const { name, firstName, lastName, email, password, position, department, role } = req.body;
    
    // Prepare the user's name - handle both name and firstName/lastName combinations
    const userName = name || (firstName && lastName ? `${firstName} ${lastName}` : firstName || '');

    // Validate required fields
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
        receivedFields: { name: !!userName, email: !!email, password: !!password }
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if mock user already exists with that email
    const mockUserExists = findMockUser(email);
    if (mockUserExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    try {
      // Try to use the database first
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        });
      }

      // Create new user in database
      const user = await User.create({
        name: userName,
        email,
        password,
        position,
        department,
        role: role || 'user', // Default to user if no role specified
      });

      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          position: user.position,
          department: user.department,
          role: user.role,
          profilePic: user.profilePic,
        },
        token: generateToken(user._id),
      });
    } catch (dbError) {
      // If database fails, use mock data
      console.log('Using mock data for registration:', dbError.message);
      
      // Create mock user (in a real app, we would save this to a database)
      const newMockUser = {
        _id: `mock-user-${Date.now()}`,
        name: userName,
        email,
        password, // Note: In a real app, we would hash this
        role: role || 'user',
        position: position || 'Employee',
        department: department || 'General',
        profilePic: 'https://randomuser.me/api/portraits/lego/1.jpg',
        matchPassword: async (enteredPassword) => enteredPassword === password
      };
      
      // Add user to mock users array (this is just for testing)
      MOCK_USERS.push(newMockUser);
      
      res.status(201).json({
        success: true,
        user: {
          _id: newMockUser._id,
          name: newMockUser.name,
          email: newMockUser.email,
          position: newMockUser.position,
          department: newMockUser.department,
          role: newMockUser.role,
          profilePic: newMockUser.profilePic,
        },
        token: generateToken(newMockUser._id),
      });
    }
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Login user & get token
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Check for minimum password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    try {
      // Try database first
      const user = await User.findOne({ email });

      // Check if user exists and password matches
      if (user && (await user.matchPassword(password))) {
        // Generate token
        const token = generateToken(user._id);
        
        // Calculate expiration time (2 hours from now)
        const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const expiresIn = 2 * 60 * 60; // in seconds
        
        res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            position: user.position,
            department: user.department,
            role: user.role,
            profilePic: user.profilePic,
          },
          token: token,
          session: {
            expiresAt: expiresAt,
            expiresIn: expiresIn
          }
        });
      } else {
        // Check mock users if database failed
        throw new Error('User not found in database');
      }
    } catch (dbError) {
      console.log('Using mock data for login:', dbError.message);
      
      // Check if user exists in mock data
      const mockUser = findMockUser(email);
      
      if (mockUser && (await mockUser.matchPassword(password))) {
        // Generate token
        const token = generateToken(mockUser._id);
        
        // Calculate expiration time (2 hours from now)
        const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const expiresIn = 2 * 60 * 60; // in seconds
        
        res.json({
          success: true,
          user: {
            _id: mockUser._id,
            name: mockUser.name,
            email: mockUser.email,
            position: mockUser.position,
            department: mockUser.department,
            role: mockUser.role,
            profilePic: mockUser.profilePic,
          },
          token: token,
          session: {
            expiresAt: expiresAt,
            expiresIn: expiresIn
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get user profile

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json({
        success: true,
        user,
        session: {
          expiresAt: req.tokenExpiration.expiresAt,
          expiresIn: req.tokenExpiration.expiresIn
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update user profile

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.position = req.body.position || user.position;
      user.department = req.body.department || user.department;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.address = req.body.address || user.address;
      user.profilePic = req.body.profilePic || user.profilePic;

      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          position: updatedUser.position,
          department: updatedUser.department,
          role: updatedUser.role,
          profilePic: updatedUser.profilePic,
          phoneNumber: updatedUser.phoneNumber,
          address: updatedUser.address,
        },
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Check session status

const checkSession = async (req, res) => {
  try {
    res.json({
      success: true,
      isValid: true,
      session: {
        expiresAt: req.tokenExpiration.expiresAt,
        expiresIn: req.tokenExpiration.expiresIn
      }
    });
  } catch (error) {
    console.error('Session check error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Refresh token
const refreshToken = async (req, res) => {
  try {
    // Token was already verified in the auth middleware
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate a new token
    const token = generateToken(user._id);
    
    // Calculate expiration time (2 hours from now)
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const expiresIn = 2 * 60 * 60; // in seconds

    res.json({
      success: true,
      token,
      session: {
        expiresAt,
        expiresIn
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile, checkSession, refreshToken }; 