import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">LOGO</div>
        <div className="header-actions">
          <button className="profile-button">
            <span className="profile-icon">👤</span>
            <span>John Doe</span>
          </button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <div className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li className="nav-item active">
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </li>
              <li className="nav-item">
                <span className="nav-icon">📁</span>
                <span>Projects</span>
              </li>
              <li className="nav-item">
                <span className="nav-icon">📝</span>
                <span>Tasks</span>
              </li>
              <li className="nav-item">
                <span className="nav-icon">📈</span>
                <span>Reports</span>
              </li>
              <li className="nav-item">
                <span className="nav-icon">⚙️</span>
                <span>Settings</span>
              </li>
            </ul>
          </nav>
        </div>
        
        <main className="main-content">
          <h1>Welcome to Your Dashboard</h1>
          
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Projects</h3>
              <p className="stat-number">24</p>
              <p className="stat-change positive">+3 this week</p>
            </div>
            <div className="stat-card">
              <h3>Active Tasks</h3>
              <p className="stat-number">42</p>
              <p className="stat-change positive">+5 this week</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p className="stat-number">18</p>
              <p className="stat-change positive">+2 this week</p>
            </div>
            <div className="stat-card">
              <h3>Pending Review</h3>
              <p className="stat-number">7</p>
              <p className="stat-change negative">-1 this week</p>
            </div>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card chart-card">
              <h3>Activity Overview</h3>
              <div className="chart-placeholder">
                <img src="/system-preview.svg" alt="Activity Chart" className="chart-image" />
              </div>
            </div>
            
            <div className="dashboard-card">
              <h3>Recent Tasks</h3>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Design System Updates</td>
                    <td>Jan 12, 2023</td>
                    <td><span className="status in-progress">In Progress</span></td>
                  </tr>
                  <tr>
                    <td>Product Meeting</td>
                    <td>Jan 14, 2023</td>
                    <td><span className="status pending">Pending</span></td>
                  </tr>
                  <tr>
                    <td>Dashboard Wireframes</td>
                    <td>Jan 16, 2023</td>
                    <td><span className="status completed">Completed</span></td>
                  </tr>
                  <tr>
                    <td>API Integration</td>
                    <td>Jan 20, 2023</td>
                    <td><span className="status in-progress">In Progress</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 