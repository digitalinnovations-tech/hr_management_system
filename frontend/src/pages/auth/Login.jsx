import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/auth/AuthStyles.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  // Use empty strings as initial state instead of mock credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Clear any previous auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setLoginError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call login from auth context
      await login(email, password);
      // After successful login, navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset field error when user types
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (formErrors.email) {
      setFormErrors({
        ...formErrors,
        email: ''
      });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (formErrors.password) {
      setFormErrors({
        ...formErrors,
        password: ''
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <div className="dashboard-preview">
            <img 
              src="/dashboard-preview.svg" 
              alt="Dashboard Preview" 
              className="preview-image"
            />
          </div>
          <div className="auth-left-content">
            <p className="main-text">
              HR Management System Dashboard
            </p>
            <p className="sub-text">
              Manage your employees, track attendance, handle leave requests, and more.
              Login to access all features.
            </p>
            <div className="page-indicators">
              <span className="indicator"></span>
              <span className="indicator"></span>
              <span className="indicator active"></span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="logo-container">
            <div className="logo">HR SYSTEM</div>
          </div>
          <div className="auth-form-container">
            <h2 className="welcome-text">Login to Dashboard</h2>
            
            {(loginError || error) && (
              <div className="error-message">
                {loginError || error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className={`form-group ${formErrors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Email Address*</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email Address"
                  required
                />
                {formErrors.email && <div className="error-text">{formErrors.email}</div>}
              </div>

              <div className={`form-group ${formErrors.password ? 'has-error' : ''}`}>
                <label htmlFor="password">Password*</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#580080"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="#580080"/>
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.password && <div className="error-text">{formErrors.password}</div>}
              </div>

              <button 
                type="submit" 
                className="auth-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 