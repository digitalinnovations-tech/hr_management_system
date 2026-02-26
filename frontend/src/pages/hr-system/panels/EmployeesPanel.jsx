import React, { useState, useEffect } from 'react';

// Icons
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#888"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="#888"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="#580080"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="#444"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#fff"/>
  </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
  >
    <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" fill="currentColor"/>
  </svg>
);

const EmployeesPanel = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [showPositionFilter, setShowPositionFilter] = useState(false);

  const positions = ['Intern', 'Junior', 'Full Time', 'Senior', 'Team Lead'];
  const departments = ['Designer', 'Frontend Development', 'Backend Development', 'Human Resource', 'Marketing'];

  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize employees from localStorage or use default data
  useEffect(() => {
    const savedEmployees = localStorage.getItem('hr_employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    } else {
      // Use default data
      const defaultEmployees = [
        {
          id: 1,
          name: 'Jane Cooper',
          email: 'jane.cooper@example.com',
          phone: '(704) 555-0127',
          position: 'Intern',
          department: 'Designer',
          dateJoined: '2023-10-06',
          profilePic: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
          id: 2,
          name: 'Arlene McCoy',
          email: 'arlene.mccoy@example.com',
          phone: '(302) 555-0107',
          position: 'Full Time',
          department: 'Designer',
          dateJoined: '2023-11-07',
          profilePic: 'https://randomuser.me/api/portraits/women/63.jpg'
        },
        {
          id: 3,
          name: 'Cody Fisher',
          email: 'cody.fisher@example.com',
          phone: '(252) 555-0126',
          position: 'Senior',
          department: 'Backend Development',
          dateJoined: '2023-08-15',
          profilePic: 'https://randomuser.me/api/portraits/men/67.jpg'
        },
        {
          id: 4,
          name: 'Janney Wilson',
          email: 'janney.wilson@example.com',
          phone: '(252) 555-0126',
          position: 'Junior',
          department: 'Backend Development',
          dateJoined: '2023-12-04',
          profilePic: 'https://randomuser.me/api/portraits/men/52.jpg'
        },
        {
          id: 5,
          name: 'Leslie Alexander',
          email: 'leslie.alexander@example.com',
          phone: '(207) 555-0119',
          position: 'Team Lead',
          department: 'Human Resource',
          dateJoined: '2023-05-30',
          profilePic: 'https://randomuser.me/api/portraits/women/53.jpg'
        }
      ];
      setEmployees(defaultEmployees);
      localStorage.setItem('hr_employees', JSON.stringify(defaultEmployees));
    }
  }, []);

  // Filter employees whenever employees, searchQuery or positionFilter changes
  useEffect(() => {
    let result = [...employees];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(emp => 
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.phone.includes(query)
      );
    }
    
    // Apply position filter
    if (positionFilter) {
      result = result.filter(emp => emp.position === positionFilter);
    }
    
    setFilteredEmployees(result);
  }, [employees, searchQuery, positionFilter]);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('hr_employees', JSON.stringify(employees));
    }
  }, [employees]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.position-filter-dropdown') && !event.target.closest('.filter-button')) {
        setShowPositionFilter(false);
      }
      
      if (!event.target.closest('.custom-select-wrapper')) {
        setPositionDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddEmployee = () => {
    setCurrentEmployee({
      id: Date.now(),
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      dateJoined: '',
      profilePic: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 99)}.jpg`
    });
    setModalMode('add');
    setSelectedPosition('');
    setErrors({});
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee({ ...employee });
    setSelectedPosition(employee.position);
    setModalMode('edit');
    setErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!currentEmployee.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!currentEmployee.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(currentEmployee.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!currentEmployee.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!currentEmployee.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    const position = selectedPosition || currentEmployee.position;
    if (!position) {
      newErrors.position = 'Position is required';
    }
    
    if (!currentEmployee.dateJoined) {
      newErrors.dateJoined = 'Date of joining is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const updatedEmployee = {
      ...currentEmployee,
      position: selectedPosition || currentEmployee.position
    };
    
    if (modalMode === 'add') {
      setEmployees([...employees, updatedEmployee]);
    } else {
      setEmployees(employees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      ));
    }
    
    setShowModal(false);
    setCurrentEmployee(null);
    setSelectedPosition('');
  };

  const selectPosition = (position) => {
    setSelectedPosition(position);
    setPositionDropdownOpen(false);
    
    // Clear position error if any
    if (errors.position) {
      setErrors({...errors, position: ''});
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const togglePositionFilter = (e) => {
    e.stopPropagation();
    setShowPositionFilter(!showPositionFilter);
  };

  const applyPositionFilter = (position) => {
    setPositionFilter(position);
    setShowPositionFilter(false);
  };

  const clearPositionFilter = () => {
    setPositionFilter('');
    setShowPositionFilter(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
    } catch (e) {
      return dateString;
    }
  };

  const deleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="panel employees-panel">
      <div className="panel-header">
        <h2>Employees</h2>
        <div className="panel-actions">
          <div className="position-filter-dropdown">
            <button 
              className={`filter-button ${positionFilter ? 'active' : ''}`}
              onClick={togglePositionFilter}
            >
              Position {positionFilter && `(${positionFilter})`} <FilterIcon />
            </button>
            
            {showPositionFilter && (
              <div className="filter-dropdown-menu">
                {positions.map(pos => (
                  <div 
                    key={pos}
                    className={`filter-option ${pos === positionFilter ? 'selected' : ''}`}
                    onClick={() => applyPositionFilter(pos)}
                  >
                    {pos}
                  </div>
                ))}
                {positionFilter && (
                  <div 
                    className="filter-option clear-filter"
                    onClick={clearPositionFilter}
                  >
                    Clear Filter
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="search-container">
            <SearchIcon />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by name, email, or department" 
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button className="clear-search-button" onClick={clearSearch}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#888"/>
                </svg>
              </button>
            )}
          </div>
          
          <button className="add-button" onClick={handleAddEmployee}>
            Add Employee
          </button>
        </div>
      </div>
      
      <div className="table-container">
        {filteredEmployees.length === 0 ? (
          <div className="no-results">
            {employees.length === 0 ? 
              "No employees found. Add an employee to get started." : 
              "No employees match your search criteria."}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Employee Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Position</th>
                <th>Department</th>
                <th>Date of Joining</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.id}>
                  <td className="profile-cell">
                    <div className="profile-pic-wrapper">
                      <img src={employee.profilePic} alt={employee.name} className="profile-pic" />
                    </div>
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{formatDate(employee.dateJoined)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-icon-button" 
                        onClick={() => handleEditEmployee(employee)}
                        title="Edit employee"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#4A4A4A"/>
                        </svg>
                      </button>
                      <button 
                        className="action-icon-button" 
                        onClick={() => deleteEmployee(employee.id)}
                        title="Delete employee"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#F44336"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Employee Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === 'add' ? 'Add Employee Details' : 'Edit Employee Details'}</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSaveEmployee}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name*</label>
                  <input 
                    type="text" 
                    value={currentEmployee.name} 
                    onChange={(e) => setCurrentEmployee({...currentEmployee, name: e.target.value})}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label>Email Address*</label>
                  <input 
                    type="email" 
                    value={currentEmployee.email} 
                    onChange={(e) => setCurrentEmployee({...currentEmployee, email: e.target.value})}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number*</label>
                  <input 
                    type="tel" 
                    value={currentEmployee.phone} 
                    onChange={(e) => setCurrentEmployee({...currentEmployee, phone: e.target.value})}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
                <div className="form-group">
                  <label>Department*</label>
                  <select
                    value={currentEmployee.department}
                    onChange={(e) => setCurrentEmployee({...currentEmployee, department: e.target.value})}
                    className={errors.department ? 'error' : ''}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <div className="error-message">{errors.department}</div>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Position*</label>
                  <div className="custom-select-wrapper">
                    <div 
                      className={`custom-select ${errors.position ? 'error' : ''}`}
                      onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
                    >
                      {selectedPosition || currentEmployee.position || 'Select Position'}
                      <ChevronDownIcon isOpen={positionDropdownOpen} />
                    </div>
                    {positionDropdownOpen && (
                      <div className="custom-select-options">
                        {positions.map(pos => (
                          <div 
                            key={pos}
                            className={`custom-select-option ${(selectedPosition || currentEmployee.position) === pos ? 'selected' : ''}`}
                            onClick={() => selectPosition(pos)}
                          >
                            {pos}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.position && <div className="error-message">{errors.position}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Date of Joining*</label>
                  <div className="date-input-wrapper">
                    <input 
                      type="date" 
                      value={currentEmployee.dateJoined} 
                      onChange={(e) => setCurrentEmployee({...currentEmployee, dateJoined: e.target.value})}
                      className={errors.dateJoined ? 'error' : ''}
                    />
                    <CalendarIcon />
                    {errors.dateJoined && <div className="error-message">{errors.dateJoined}</div>}
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">Save</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .panel {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .panel-actions {
          display: flex;
          align-items: center;
        }
        
        .position-filter-dropdown {
          position: relative;
          margin-right: 10px;
        }
        
        .filter-button {
          display: flex;
          align-items: center;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
        }
        
        .filter-button.active {
          background-color: #e0f2f1;
          border-color: #80cbc4;
          color: #00796b;
        }
        
        .filter-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 20;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          min-width: 150px;
          margin-top: 5px;
        }
        
        .filter-option {
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .filter-option:hover {
          background-color: #f5f5f5;
        }
        
        .filter-option.selected {
          background-color: #e0f2f1;
          color: #00796b;
        }
        
        .filter-option.clear-filter {
          border-top: 1px solid #eee;
          color: #f44336;
        }
        
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 4px;
          padding: 0 10px;
          margin-right: 10px;
          width: 250px;
        }
        
        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 8px;
          outline: none;
          font-size: 14px;
        }
        
        .clear-search-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        
        .add-button {
          background-color: #580080;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 15px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .add-button:hover {
          background-color: #7600b0;
        }
        
        .table-container {
          overflow-x: auto;
          flex: 1;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .data-table th {
          background-color: #580080;
          color: white;
          text-align: left;
          padding: 12px 15px;
          font-weight: 500;
        }
        
        .data-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
        }
        
        .profile-cell {
          width: 50px;
        }
        
        .profile-pic-wrapper {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          overflow: hidden;
        }
        
        .profile-pic {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .action-icon-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .action-icon-button:hover {
          background-color: #f0f0f0;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal {
          background-color: white;
          border-radius: 8px;
          width: 600px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #580080;
          color: white;
          padding: 15px 20px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        
        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: white;
        }
        
        .modal-form {
          padding: 20px;
        }
        
        .form-row {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          margin-bottom: 5px;
          font-weight: 500;
          color: #444;
        }
        
        .form-group input,
        .form-group select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-group input.error,
        .form-group select.error,
        .custom-select.error {
          border-color: #f44336;
        }
        
        .error-message {
          color: #f44336;
          font-size: 12px;
          margin-top: 4px;
        }
        
        .custom-select-wrapper {
          position: relative;
        }
        
        .custom-select {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          background-color: white;
        }
        
        .custom-select-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 10;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-top: 5px;
          max-height: 200px;
          overflow-y: auto;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .custom-select-option {
          padding: 8px 12px;
          cursor: pointer;
        }
        
        .custom-select-option:hover {
          background-color: #f5f5f5;
        }
        
        .custom-select-option.selected {
          background-color: #e0f2f1;
          color: #00796b;
        }
        
        .date-input-wrapper {
          position: relative;
        }
        
        .date-input-wrapper input {
          width: 100%;
          padding-right: 30px;
        }
        
        .date-input-wrapper svg {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        .save-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .cancel-button {
          background-color: #f5f5f5;
          color: #444;
          border: 1px solid #ddd;
          padding: 8px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .no-results {
          padding: 20px;
          text-align: center;
          color: #757575;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeesPanel; 