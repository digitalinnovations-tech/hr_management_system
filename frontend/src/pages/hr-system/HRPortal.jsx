import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserIcon, EmployeeIcon, AttendanceIcon, LeavesIcon, LogoutIcon } from '../../components/icons';
import LogoutModal from '../../components/LogoutModal';

const HRPortal = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    console.log('Logout initiated');
    
    // Clear all auth data directly (belt and suspenders)
    localStorage.removeItem('hr_auth_token');
    localStorage.removeItem('hr_user_info');
    localStorage.removeItem('hr_token_expiry');
    
    // Call the context logout function
    logout();
    
    // Close the modal
    setShowLogoutConfirm(false);
    
    // Navigate to login
    console.log('Navigating to login page');
    navigate('/login', { replace: true });
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">HR</div>
          <div className="logo-text">HR Portal</div>
        </div>
        <div className="sidebar-search">
          <input type="text" className="search-input" placeholder="Search..." />
        </div>
        
        <div className="sidebar-section">
          <div className="sidebar-section-title">Recruitment</div>
          <ul className="sidebar-menu">
            <li 
              className={`sidebar-menu-item ${isActive('candidates') ? 'active' : ''}`}
              onClick={() => navigate('/hr-portal/candidates')}
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
              className={`sidebar-menu-item ${isActive('employees') ? 'active' : ''}`}
              onClick={() => navigate('/hr-portal/employees')}
            >
              <EmployeeIcon />
              <span className="sidebar-menu-text">Employees</span>
            </li>
            <li 
              className={`sidebar-menu-item ${isActive('attendance') ? 'active' : ''}`}
              onClick={() => navigate('/hr-portal/attendance')}
            >
              <AttendanceIcon />
              <span className="sidebar-menu-text">Attendance</span>
            </li>
            <li 
              className={`sidebar-menu-item ${isActive('leaves') ? 'active' : ''}`}
              onClick={() => navigate('/hr-portal/leaves')}
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
        <Outlet />
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <LogoutModal 
          onCancel={() => setShowLogoutConfirm(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default HRPortal; 