import React, { useState, useEffect } from 'react';
import '../../styles/hr-system/HRPortalStyles.css';
import EmployeesPanel from './panels/EmployeesPanel';
import CandidatesPanel from './panels/CandidatesPanel';
import AttendancePanel from './panels/AttendancePanel';
import LeavesPanel from './panels/LeavesPanel';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from '../../components/LogoutModal';

// Icons for the sidebar
const UserIcon = () => (
  <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
  </svg>
);

const EmployeeIcon = () => (
  <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
  </svg>
);

const AttendanceIcon = () => (
  <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 5.18L10.59 16.6L6.35 12.36L7.76 10.95L10.59 13.78L20.59 3.78L22 5.18ZM19.79 10.22C19.92 10.79 20 11.39 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C13.58 4 15.04 4.46 16.28 5.25L17.72 3.81C16.1 2.67 14.13 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 10.81 21.78 9.67 21.4 8.61L19.79 10.22Z" fill="currentColor"/>
  </svg>
);

const LeavesIcon = () => (
  <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 8H7V10H17V8ZM13 12H7V14H13V12Z" fill="currentColor"/>
  </svg>
);

const LogoutIcon = () => (
  <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
  </svg>
);

const MailIcon = () => (
  <svg className="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#580080"/>
  </svg>
);

const NotificationIcon = () => (
  <svg className="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="#580080"/>
  </svg>
);

const UserMenuIcon = () => (
  <svg className="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#580080"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#fff"/>
  </svg>
);

// Session expiration warning modal
const SessionExpiryModal = ({ remainingTime, onExtend, onLogout }) => {
  // Convert milliseconds to minutes and seconds
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  return (
    <div className="modal-overlay">
      <div className="logout-modal">
        <div className="logout-modal-header">
          <h3>Session Expiring</h3>
        </div>
        <div className="logout-modal-content">
          <p>Your session will expire in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
          <p>Do you want to extend your session?</p>
        </div>
        <div className="logout-modal-actions">
          <button 
            className="cancel-button"
            onClick={onLogout}
          >
            Logout
          </button>
          <button 
            className="auth-button"
            onClick={onExtend}
          >
            Extend Session
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ onLogout }) => {
  const [activePanel, setActivePanel] = useState('candidates');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  
  const { user, logout, resetSessionTimer } = useAuth();
  
  // Get user profile from auth context or fallback to default
  const userProfile = {
    name: user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user?.name || 'Leslie Alexander',
    position: user?.position || 'HR Manager',
    email: user?.email || 'leslie.alexander@example.com',
    profilePic: user?.profilePic || 'https://randomuser.me/api/portraits/women/53.jpg'
  };
  
  // Session warning effect - show warning when 5 minutes remaining
  useEffect(() => {
    const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
    const CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds
    
    const checkSessionExpiry = () => {
      // Get remaining time from localStorage
      const expiryTime = localStorage.getItem('hr_token_expiry');
      if (!expiryTime) return;
      
      const remainingTime = parseInt(expiryTime) - Date.now();
      
      if (remainingTime <= WARNING_THRESHOLD && remainingTime > 0) {
        setSessionTimeRemaining(remainingTime);
        setShowSessionWarning(true);
      }
    };
    
    // Initial check
    checkSessionExpiry();
    
    // Set up interval to check session time
    const intervalId = setInterval(checkSessionExpiry, CHECK_INTERVAL);
    
    // Clean up interval
    return () => clearInterval(intervalId);
  }, []);
  
  // Update session time remaining when warning is shown
  useEffect(() => {
    let intervalId;
    
    if (showSessionWarning) {
      intervalId = setInterval(() => {
        setSessionTimeRemaining(prevTime => {
          const newTime = prevTime - 1000;
          if (newTime <= 0) {
            clearInterval(intervalId);
            handleLogout();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showSessionWarning]);
  
  const handleExtendSession = () => {
    resetSessionTimer();
    setShowSessionWarning(false);
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'employees':
        return <EmployeesPanel />;
      case 'candidates':
        return <CandidatesPanel />;
      case 'attendance':
        return <AttendancePanel />;
      case 'leaves':
        return <LeavesPanel />;
      default:
        return <CandidatesPanel />;
    }
  };

  const handleLogout = () => {
    console.log('Logout initiated from Dashboard');
    
    // Clear all auth data directly (belt and suspenders)
    localStorage.removeItem('hr_auth_token');
    localStorage.removeItem('hr_user_info');
    localStorage.removeItem('hr_token_expiry');
    
    // Call the context logout function
    logout();
    
    // Close modals
    setShowLogoutConfirm(false);
    setShowSessionWarning(false);
    
    // Navigate to login
    console.log('Navigating to login page');
    if (onLogout) onLogout();
    else window.location.href = '/login'; // Fallback direct navigation
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">LOGO</div>
        </div>
        <div className="sidebar-search">
          <input type="text" className="search-input" placeholder="Search..." />
        </div>
        
        <div className="sidebar-section">
          <div className="sidebar-section-title">Recruitment</div>
          <ul className="sidebar-menu">
            <li 
              className={`sidebar-menu-item ${activePanel === 'candidates' ? 'active' : ''}`}
              onClick={() => setActivePanel('candidates')}
            >
              <UserIcon />
              <span className="sidebar-menu-text">Candidates</span>
            </li>
          </ul>
        </div>
        
        <div className="sidebar-section">
          <div className="sidebar-section-title">Organization</div>
          <ul className="sidebar-menu">
            <li 
              className={`sidebar-menu-item ${activePanel === 'employees' ? 'active' : ''}`}
              onClick={() => setActivePanel('employees')}
            >
              <EmployeeIcon />
              <span className="sidebar-menu-text">Employees</span>
            </li>
            <li 
              className={`sidebar-menu-item ${activePanel === 'attendance' ? 'active' : ''}`}
              onClick={() => setActivePanel('attendance')}
            >
              <AttendanceIcon />
              <span className="sidebar-menu-text">Attendance</span>
            </li>
            <li 
              className={`sidebar-menu-item ${activePanel === 'leaves' ? 'active' : ''}`}
              onClick={() => setActivePanel('leaves')}
            >
              <LeavesIcon />
              <span className="sidebar-menu-text">Leaves</span>
            </li>
          </ul>
        </div>
        
        <div className="sidebar-section">
          <div className="sidebar-section-title">Others</div>
          <ul className="sidebar-menu">
            <li 
              className="sidebar-menu-item"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogoutIcon />
              <span className="sidebar-menu-text">Logout</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header with user profile */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            {activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}
          </div>
          <div className="header-actions">
            <button className="header-button">
              <MailIcon />
            </button>
            <button className="header-button">
              <NotificationIcon />
            </button>
            <div className="user-profile">
              <button
                className="user-profile-button"
                onClick={() => setShowUserProfile(!showUserProfile)}
              >
                <div className="profile-pic-wrapper small">
                  <img src={userProfile.profilePic} alt={userProfile.name} className="profile-pic" />
                </div>
                <span className="username">{userProfile.name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" fill="#580080"/>
                </svg>
              </button>
              
              {showUserProfile && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <div className="profile-pic-wrapper">
                      <img src={userProfile.profilePic} alt={userProfile.name} className="profile-pic" />
                    </div>
                    <div className="user-dropdown-details">
                      <div className="user-dropdown-name">{userProfile.name}</div>
                      <div className="user-dropdown-position">{userProfile.position}</div>
                    </div>
                  </div>
                  <div className="user-dropdown-options">
                    <div className="user-dropdown-option">
                      <UserIcon />
                      <span>My Profile</span>
                    </div>
                    <div 
                      className="user-dropdown-option"
                      onClick={() => {
                        setShowUserProfile(false);
                        setShowLogoutConfirm(true);
                      }}
                    >
                      <LogoutIcon />
                      <span>Logout</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main panel content */}
        {renderPanel()}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <LogoutModal 
          onCancel={() => setShowLogoutConfirm(false)}
          onLogout={handleLogout}
        />
      )}
      
      {/* Session Expiry Warning Modal */}
      {showSessionWarning && (
        <SessionExpiryModal
          remainingTime={sessionTimeRemaining}
          onExtend={handleExtendSession}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default Dashboard; 