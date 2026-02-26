import React, { useState } from 'react';
import '../../styles/pages/EmployeePortal.css';

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '(555) 123-4567',
      position: 'Team Lead',
      department: 'Engineering',
      dateJoined: '2021-05-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '(555) 987-6543',
      position: 'Senior',
      department: 'Design',
      dateJoined: '2022-01-10'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.johnson@company.com',
      phone: '(555) 234-5678',
      position: 'Junior',
      department: 'Marketing',
      dateJoined: '2023-03-22'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '(555) 876-5432',
      position: 'Full Time',
      department: 'Finance',
      dateJoined: '2022-11-05'
    },
    {
      id: 5,
      name: 'Michael Wilson',
      email: 'michael.wilson@company.com',
      phone: '(555) 345-6789',
      position: 'Intern',
      department: 'HR',
      dateJoined: '2023-06-15'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [positionFilter, setPositionFilter] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const positions = ['Intern', 'Junior', 'Full Time', 'Senior', 'Team Lead'];
  const departments = ['Engineering', 'Design', 'Marketing', 'Finance', 'HR'];

  const handleAddNew = () => {
    setCurrentEmployee({
      id: Date.now(),
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      dateJoined: ''
    });
    setShowModal(true);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee({ ...employee });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentEmployee) {
      const isExisting = employees.find(emp => emp.id === currentEmployee.id);
      if (isExisting) {
        setEmployees(employees.map(emp => 
          emp.id === currentEmployee.id ? currentEmployee : emp
        ));
      } else {
        setEmployees([...employees, currentEmployee]);
      }
      setShowModal(false);
      setCurrentEmployee(null);
    }
  };

  const filteredEmployees = positionFilter === 'All'
    ? employees
    : employees.filter(emp => emp.position === positionFilter);

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">HR</div>
          <div className="logo-text">HR Portal</div>
        </div>
        <div className="sidebar-search">
          <input type="text" className="search-input" placeholder="Search..." />
        </div>
        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Recruitment</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item" onClick={() => window.navigateTo('candidate-manager')}>
              <span className="sidebar-icon">📋</span>
              <span className="sidebar-menu-text">Candidates</span>
            </li>
            <li className="sidebar-menu-item active">
              <span className="sidebar-icon">👥</span>
              <span className="sidebar-menu-text">Employees</span>
            </li>
          </ul>
        </div>
        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Organization</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <span className="sidebar-icon">🏢</span>
              <span className="sidebar-menu-text">Departments</span>
            </li>
            <li className="sidebar-menu-item">
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-menu-text">Analytics</span>
            </li>
          </ul>
        </div>
        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Others</h4>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <span className="sidebar-icon">⚙️</span>
              <span className="sidebar-menu-text">Settings</span>
            </li>
            <li className="sidebar-menu-item">
              <span className="sidebar-icon">❓</span>
              <span className="sidebar-menu-text">Help</span>
            </li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <div className="sidebar-menu-item">
            <span className="sidebar-icon">👤</span>
            <span className="sidebar-menu-text">Admin User</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Employee Manager</h1>
          <div className="header-actions">
            <button className="action-button" onClick={handleAddNew}>
              <span className="action-icon">+</span>
              Add Employee
            </button>
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-dropdown">
            <button
              className="filter-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Position: {positionFilter}
              <span className="filter-icon">▼</span>
            </button>
            {showDropdown && (
              <div className="dropdown-list">
                <div
                  className={`dropdown-option ${positionFilter === 'All' ? 'active' : ''}`}
                  onClick={() => {
                    setPositionFilter('All');
                    setShowDropdown(false);
                  }}
                >
                  All
                </div>
                {positions.map(pos => (
                  <div
                    key={pos}
                    className={`dropdown-option ${positionFilter === pos ? 'active' : ''}`}
                    onClick={() => {
                      setPositionFilter(pos);
                      setShowDropdown(false);
                    }}
                  >
                    {pos}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="search-field">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input-header"
              placeholder="Search employees..."
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Department</th>
                <th>Date Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{new Date(employee.dateJoined).toLocaleDateString()}</td>
                  <td className="action-cell">
                    <button
                      className="action-icon-button"
                      onClick={() => handleEdit(employee)}
                    >
                      ✏️
                    </button>
                    <button
                      className="action-icon-button"
                      onClick={() => handleDelete(employee.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {currentEmployee.id && employees.find(emp => emp.id === currentEmployee.id)
                  ? 'Edit Employee'
                  : 'Add New Employee'}
              </h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setCurrentEmployee(null);
                }}
              >
                ×
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentEmployee.name}
                  onChange={e => setCurrentEmployee({
                    ...currentEmployee,
                    name: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={currentEmployee.email}
                  onChange={e => setCurrentEmployee({
                    ...currentEmployee,
                    email: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={currentEmployee.phone}
                  onChange={e => setCurrentEmployee({
                    ...currentEmployee,
                    phone: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  className="form-control position-select"
                  value={currentEmployee.department}
                  onChange={e => setCurrentEmployee({
                    ...currentEmployee,
                    department: e.target.value
                  })}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Position</label>
                <select
                  className="form-control position-select"
                  value={currentEmployee.position}
                  onChange={e => setCurrentEmployee({
                    ...currentEmployee,
                    position: e.target.value
                  })}
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date Joined</label>
                <div className="date-input">
                  <input
                    type="date"
                    className="form-control"
                    value={currentEmployee.dateJoined}
                    onChange={e => setCurrentEmployee({
                      ...currentEmployee,
                      dateJoined: e.target.value
                    })}
                    required
                  />
                  <span className="date-picker-icon">📅</span>
                </div>
              </div>
              <div className="form-footer">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowModal(false);
                    setCurrentEmployee(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager; 