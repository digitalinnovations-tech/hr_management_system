import React, { useState, useEffect } from 'react';
import { attendanceService, employeeService } from '../../../services/api';
import { debugLog, mockDelay } from '../../../utils/debug';

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

const PresentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#4caf50"/>
  </svg>
);

const AbsentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#f44336"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="#444"/>
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

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#888"/>
  </svg>
);

const AttendancePanel = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showStatusFilterDropdown, setShowStatusFilterDropdown] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAttendance, setNewAttendance] = useState({
    employeeId: '',
    status: 'Present',
    notes: ''
  });
  
  // Fetch attendance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Loading attendance data...");
        debugLog('attendance', 'Fetching attendance records from API');
        
        // Fetch the actual data from the backend using the API service
        const result = await attendanceService.getAttendanceRecords();
        
        if (result.success && result.attendanceRecords && result.attendanceRecords.length > 0) {
          debugLog('attendance', 'Successfully fetched attendance records', result.attendanceRecords);
          
          // Transform the data to match the component's expected format
          const formattedRecords = result.attendanceRecords.map(record => ({
            id: record._id,
            name: `${record.employee.firstName} ${record.employee.lastName}`,
            position: record.employee.position,
            department: record.employee.department,
            task: record.notes,
            status: record.status.charAt(0).toUpperCase() + record.status.slice(1), // Capitalize first letter
            profilePic: record.employee.profilePic,
            isActive: record.employee.status === 'active'
          }));
          
          setAttendanceRecords(formattedRecords);
        } else {
          debugLog('attendance', 'No attendance records returned or API error', result);
          
          // If in development mode and no data is returned, fall back to mock data
          if (process.env.NODE_ENV === 'development') {
            console.log("Using mock attendance data for development");
            
            // Use static mock data that's guaranteed to work
            const mockData = [
              {
                id: 1,
                name: 'Jane Cooper',
                position: 'Designer',
                department: 'Design',
                task: 'Dashboard Home page Alignment',
                status: 'Present',
                profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
                isActive: true
              },
              {
                id: 2,
                name: 'Arlene McCoy',
                position: 'Designer',
                department: 'Design',
                task: 'Dashboard Login page design',
                status: 'Absent',
                profilePic: 'https://randomuser.me/api/portraits/women/63.jpg',
                isActive: true
              },
              {
                id: 3,
                name: 'Cody Fisher',
                position: 'Senior Developer',
                department: 'Backend Development',
                task: 'API Implementation',
                status: 'Present',
                profilePic: 'https://randomuser.me/api/portraits/men/67.jpg',
                isActive: true
              },
              {
                id: 4,
                name: 'Janney Wilson',
                position: 'Junior Developer',
                department: 'Backend Development',
                task: 'Dashboard login page integration',
                status: 'Present',
                profilePic: 'https://randomuser.me/api/portraits/men/52.jpg',
                isActive: true
              },
              {
                id: 5,
                name: 'Leslie Alexander',
                position: 'Team Lead',
                department: 'Human Resource',
                task: '4 scheduled interview, Sorting of resumes',
                status: 'Present',
                profilePic: 'https://randomuser.me/api/portraits/women/53.jpg',
                isActive: true
              },
              {
                id: 6,
                name: 'John Smith',
                position: 'Developer',
                department: 'Frontend Development',
                task: 'UI component implementation',
                status: 'Work from Home',
                profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
                isActive: true
              },
              {
                id: 7,
                name: 'Maria Garcia',
                position: 'QA Engineer',
                department: 'Quality Assurance',
                task: 'Testing attendance module',
                status: 'Medical Leave',
                profilePic: 'https://randomuser.me/api/portraits/women/28.jpg',
                isActive: true
              }
            ];
            
            console.log("Mock attendance data:", mockData);
            setAttendanceRecords(mockData);
          } else {
            setError("No attendance records found or failed to load data.");
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Failed to load attendance data. Please try again later.");
        setLoading(false);
        
        // In development mode, still use mock data even when API calls fail
        if (process.env.NODE_ENV === 'development') {
          setAttendanceRecords([
            {
              id: 1,
              name: 'Jane Cooper',
              position: 'Designer',
              department: 'Design',
              task: 'Dashboard Home page Alignment',
              status: 'Present',
              profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
              isActive: true
            },
            {
              id: 2,
              name: 'Arlene McCoy',
              position: 'Designer',
              department: 'Design',
              task: 'Dashboard Login page design',
              status: 'Absent',
              profilePic: 'https://randomuser.me/api/portraits/women/63.jpg',
              isActive: true
            }
          ]);
          setError(null); // Clear error if we display mock data
        }
      }
    };
    
    fetchData();
  }, []);

  // Update attendance status
  const updateAttendanceStatus = async (id, newStatus) => {
    try {
      console.log(`Updating attendance for ID ${id} to ${newStatus}`);
      
      // Optimistically update UI
      setAttendanceRecords(records => 
        records.map(record => 
          record.id === id ? { ...record, status: newStatus } : record
        )
      );
      
      // Skip API call for mock records
      if (id.toString().startsWith('mock-')) {
        console.log(`Mock record ${id} updated to ${newStatus} (local only)`);
        setShowStatusDropdown(null);
        return;
      }
      
      // Call the API to update the backend
      const attendanceData = {
        status: newStatus,
        updateDate: new Date().toISOString()
      };
      
      // Use the attendanceService to update the backend
      await attendanceService.updateAttendance(id, attendanceData)
        .then(response => {
          if (response.success) {
            debugLog('attendance', `Successfully updated attendance status for ID ${id}`, response);
          } else {
            console.error(`Error updating attendance status on server:`, response.error);
            // You might want to revert the UI update if the backend update fails
            // but for now we'll keep the optimistic update
          }
        })
        .catch(error => {
          console.error(`Failed to update attendance on server:`, error);
          
          // For development mode, we'll still keep the UI update even when server fails
          if (!process.env.NODE_ENV === 'development') {
            // In production, we might want to show an error to the user
            setError(`Failed to update attendance status: ${error.message}`);
          }
        });
      
      setShowStatusDropdown(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleStatusDropdown = (id, e) => {
    e.stopPropagation();
    setShowStatusDropdown(showStatusDropdown === id ? null : id);
  };

  const toggleStatusFilterDropdown = (e) => {
    e.stopPropagation();
    setShowStatusFilterDropdown(!showStatusFilterDropdown);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const applyStatusFilter = (status) => {
    setStatusFilter(status);
    setShowStatusFilterDropdown(false);
  };

  const clearStatusFilter = () => {
    setStatusFilter('');
  };

  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'present') return 'present';
    if (statusLower === 'absent') return 'absent';
    if (statusLower === 'medical leave') return 'absent';
    if (statusLower === 'work from home') return 'present';
    return 'absent';
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'present' || statusLower === 'work from home') return <PresentIcon />;
    return <AbsentIcon />;
  };

  // Filter attendanceRecords based on search query and status filter
  const filteredRecords = attendanceRecords
    .filter(record => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.task && record.task.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply status filter
      const matchesStatus = statusFilter === '' || record.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

  const attendanceStatuses = ['Present', 'Absent', 'Medical Leave', 'Work from Home'];
  
  // For global click handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = () => {
      setShowStatusDropdown(null);
      setShowStatusFilterDropdown(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Create new attendance record
  const createNewAttendance = async (e) => {
    e.preventDefault();
    
    if (!newAttendance.employeeId) {
      setError("Please select an employee");
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare the data for the API
      const attendanceData = {
        employeeId: newAttendance.employeeId,
        status: newAttendance.status.toLowerCase(),
        notes: newAttendance.notes,
        date: new Date().toISOString()
      };
      
      // For development with mock data, don't attempt to save if using mock IDs
      if (newAttendance.employeeId.startsWith('mock-')) {
        // Show success message without actually saving to database
        debugLog('attendance', 'Mock attendance record created (not saved to DB)', attendanceData);
        
        // Add the mock record to the local state
        const mockRecord = {
          id: `mock-att-${Date.now()}`,
          name: newAttendance.employeeId === 'mock-emp-1' ? 'Jane Cooper' :
                newAttendance.employeeId === 'mock-emp-2' ? 'Arlene McCoy' :
                newAttendance.employeeId === 'mock-emp-3' ? 'Cody Fisher' :
                newAttendance.employeeId === 'mock-emp-4' ? 'Janney Wilson' : 'Leslie Alexander',
          position: 'Designer',
          department: 'Design',
          task: newAttendance.notes,
          status: newAttendance.status,
          profilePic: `https://randomuser.me/api/portraits/${newAttendance.employeeId === 'mock-emp-3' || newAttendance.employeeId === 'mock-emp-4' ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
          isActive: true
        };
        
        setAttendanceRecords(prev => [mockRecord, ...prev]);
        
        // Reset form
        setNewAttendance({
          employeeId: '',
          status: 'Present',
          notes: ''
        });
        
        setShowAddForm(false);
        setLoading(false);
        return;
      }
      
      debugLog('attendance', 'Creating new attendance record', attendanceData);
      
      // Call the API to create a new attendance record
      const result = await attendanceService.createAttendance(attendanceData);
      
      if (result.success) {
        debugLog('attendance', 'Successfully created attendance record', result);
        
        // Refresh the attendance records
        const updatedRecords = await attendanceService.getAttendanceRecords();
        
        if (updatedRecords.success && updatedRecords.attendanceRecords) {
          // Transform the data to match the component's expected format
          const formattedRecords = updatedRecords.attendanceRecords.map(record => ({
            id: record._id,
            name: `${record.employee.firstName} ${record.employee.lastName}`,
            position: record.employee.position,
            department: record.employee.department,
            task: record.notes,
            status: record.status.charAt(0).toUpperCase() + record.status.slice(1),
            profilePic: record.employee.profilePic,
            isActive: record.employee.status === 'active'
          }));
          
          setAttendanceRecords(formattedRecords);
        }
        
        // Reset form
        setNewAttendance({
          employeeId: '',
          status: 'Present',
          notes: ''
        });
        
        setShowAddForm(false);
      } else {
        setError(result.error || "Failed to create attendance record");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error creating attendance record:", error);
      setError("Failed to create attendance record: " + error.message);
      setLoading(false);
    }
  };
  
  // Handle input change for new attendance form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendance(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="panel attendance-panel">
      <div className="panel-header">
        <h2>Attendance</h2>
        <div className="panel-actions">
          <button 
            className="add-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Attendance'}
          </button>
          
          <div className="filter-dropdown" onClick={e => e.stopPropagation()}>
            <button 
              className={`filter-button ${statusFilter ? 'active' : ''}`}
              onClick={toggleStatusFilterDropdown}
            >
              Status {statusFilter && `(${statusFilter})`} <FilterIcon />
            </button>
            
            {showStatusFilterDropdown && (
              <div className="filter-dropdown-menu">
                {attendanceStatuses.map(status => (
                  <div 
                    key={status}
                    className={`filter-option ${status === statusFilter ? 'selected' : ''}`}
                    onClick={() => applyStatusFilter(status)}
                  >
                    {status}
                  </div>
                ))}
                {statusFilter && (
                  <div 
                    className="filter-option clear-filter"
                    onClick={clearStatusFilter}
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
              placeholder="Search by name, position, department, or task" 
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button className="clear-search-button" onClick={clearSearch}>
                <CloseIcon />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {showAddForm && (
        <div className="attendance-form-container">
          <form onSubmit={createNewAttendance} className="attendance-form">
            <div className="form-group">
              <label htmlFor="employeeId">Employee:</label>
              <select 
                id="employeeId" 
                name="employeeId" 
                value={newAttendance.employeeId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Employee</option>
                <option value="mock-emp-1">Jane Cooper</option>
                <option value="mock-emp-2">Arlene McCoy</option>
                <option value="mock-emp-3">Cody Fisher</option>
                <option value="mock-emp-4">Janney Wilson</option>
                <option value="mock-emp-5">Leslie Alexander</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select 
                id="status" 
                name="status" 
                value={newAttendance.status}
                onChange={handleInputChange}
              >
                {attendanceStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes/Task:</label>
              <input 
                type="text" 
                id="notes" 
                name="notes" 
                value={newAttendance.notes}
                onChange={handleInputChange}
                placeholder="Current task or notes"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-button">
                Save Attendance
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="table-container">
        {loading ? (
          <div className="loading-indicator">Loading attendance data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredRecords.length === 0 ? (
          <div className="no-data">No attendance records found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Task</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id}>
                  <td className="profile-cell">
                    <div className="profile-pic-wrapper">
                      <img src={record.profilePic} alt={record.name} className="profile-pic" />
                    </div>
                  </td>
                  <td>{record.name}</td>
                  <td>{record.position}</td>
                  <td>{record.department}</td>
                  <td>{record.task}</td>
                  <td>
                    <div 
                      className={`status-badge ${getStatusClass(record.status)}`}
                      onClick={(e) => toggleStatusDropdown(record.id, e)}
                    >
                      {getStatusIcon(record.status)}
                      <span className="status-text">{record.status}</span>
                      <ChevronDownIcon isOpen={showStatusDropdown === record.id} />
                      
                      {showStatusDropdown === record.id && (
                        <div className="status-dropdown-menu">
                          {attendanceStatuses.map(status => (
                            <div 
                              key={status}
                              className={`status-option ${record.status === status ? 'active' : ''}`}
                              onClick={() => updateAttendanceStatus(record.id, status)}
                            >
                              {status === 'Present' && <PresentIcon />}
                              {status === 'Absent' && <AbsentIcon />}
                              {!['Present', 'Absent'].includes(status) && 
                                <span className="status-icon">{status.charAt(0)}</span>
                              }
                              <span>{status}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <button className="action-icon-button">
                      <MoreIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendancePanel; 

/* Add CSS styles for the Attendance Panel */
const styles = `
.attendance-form-container {
  margin: 15px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.attendance-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.form-group {
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

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #444;
  border: 1px solid #ddd;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.add-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 10px;
}

.error-message {
  color: #f44336;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}
`;

// Inject the styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
} 