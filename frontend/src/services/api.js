// Base API URL
const API_URL = 'http://localhost:3001/api';

// Get auth token from local storage
const getAuthToken = () => {
  const token = localStorage.getItem('hr_auth_token');
  // Debug: Log if token exists or not
  console.log(`Auth token ${token ? 'exists' : 'does not exist'}`);
  return token;
};

// Generic fetch wrapper with error handling and authentication
const fetchAPI = async (endpoint, options = {}, bypassAuth = false) => {
  try {
    // Add global error handler for extension errors
    window.addEventListener('error', (event) => {
      // Check if the error is related to a browser extension connection issue
      if (event.message && event.message.includes('Receiving end does not exist')) {
        console.warn('Browser extension connection error detected and suppressed');
        event.preventDefault();
      }
    }, { capture: true });
    
    // For development purposes, we can bypass authentication or use mock data
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // In development mode, if it's an attendance endpoint, always return mock data
    // This helps during development when backend is not available
    if (isDevelopment && endpoint.startsWith('/attendance')) {
      console.log('DEV MODE: Returning mock data for attendance endpoint');
      return {
        success: true,
        attendanceRecords: [
          {
            _id: 'mock-att-1',
            date: new Date(),
            status: 'present',
            notes: 'Working on dashboard implementation',
            employee: {
              _id: 'mock-emp-1',
              firstName: 'Jane',
              lastName: 'Cooper',
              position: 'Designer',
              department: 'Design',
              status: 'active',
              profilePic: 'https://randomuser.me/api/portraits/women/44.jpg'
            }
          },
          {
            _id: 'mock-att-2',
            date: new Date(),
            status: 'absent',
            notes: 'Sick leave',
            employee: {
              _id: 'mock-emp-2',
              firstName: 'Arlene',
              lastName: 'McCoy',
              position: 'Designer',
              department: 'Design',
              status: 'active',
              profilePic: 'https://randomuser.me/api/portraits/women/63.jpg'
            }
          },
          {
            _id: 'mock-att-3',
            date: new Date(),
            status: 'present',
            notes: 'Backend API development',
            employee: {
              _id: 'mock-emp-3',
              firstName: 'Cody',
              lastName: 'Fisher',
              position: 'Senior Developer',
              department: 'Backend Development',
              status: 'active',
              profilePic: 'https://randomuser.me/api/portraits/men/67.jpg'
            }
          },
          {
            _id: 'mock-att-4',
            date: new Date(),
            status: 'present',
            notes: 'Dashboard login page integration',
            employee: {
              _id: 'mock-emp-4',
              firstName: 'Janney',
              lastName: 'Wilson',
              position: 'Junior Developer',
              department: 'Backend Development',
              status: 'active',
              profilePic: 'https://randomuser.me/api/portraits/men/52.jpg'
            }
          },
          {
            _id: 'mock-att-5',
            date: new Date(),
            status: 'present',
            notes: 'Conducting interviews',
            employee: {
              _id: 'mock-emp-5',
              firstName: 'Leslie',
              lastName: 'Alexander',
              position: 'Team Lead',
              department: 'Human Resource',
              status: 'active',
              profilePic: 'https://randomuser.me/api/portraits/women/53.jpg'
            }
          }
        ]
      };
    }
    
    const token = getAuthToken();
    
    // If we need authentication and there's no token, throw early
    if (!bypassAuth && !token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      console.error('No authentication token found for protected endpoint:', endpoint);
      // Force redirect to login
      window.location.href = '/login';
      throw new Error('Authentication required. Please log in.');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && !bypassAuth ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    // Add timeout to fetch to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    // Log the API call and headers for debugging
    console.log(`API ${options.method || 'GET'} request to: ${API_URL}${endpoint}`);
    console.log('Request headers:', headers);
    
    let response;
    try {
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Check if it's an extension-related error
      if (fetchError.message && (
          fetchError.message.includes('Receiving end does not exist') ||
          fetchError.message.includes('Could not establish connection')
      )) {
        console.warn('Browser extension error intercepted:', fetchError.message);
        // Return a default response rather than throwing
        return { 
          success: false, 
          message: 'Browser extension interference detected. Please reload the page or disable extensions if the problem persists.' 
        };
      }
      
      // Rethrow other errors
      throw fetchError;
    }

    // Handle 401 Unauthorized (token expired or invalid)
    if (response.status === 401) {
      console.error(`401 Unauthorized error on endpoint: ${endpoint}`);
      
      // Clear stored tokens
      localStorage.removeItem('hr_auth_token');
      localStorage.removeItem('hr_user_info');
      localStorage.removeItem('hr_token_expiry');
      
      // In development mode, we can choose to bypass authentication errors for testing
      if (isDevelopment && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
        console.warn(`Auth error on ${endpoint}, returning mock data for development`);
        
        // Return mock data for different endpoints to allow development without authentication
        // This is only for development and testing purposes
        if (endpoint.startsWith('/attendance')) {
          return {
            success: true,
            attendanceRecords: [
              {
                _id: 'mock-att-1',
                date: new Date(),
                status: 'present',
                notes: 'Working on dashboard implementation',
                employee: {
                  _id: 'mock-emp-1',
                  firstName: 'Jane',
                  lastName: 'Cooper',
                  position: 'Designer',
                  department: 'Design',
                  status: 'active',
                  profilePic: 'https://randomuser.me/api/portraits/women/44.jpg'
                }
              },
              {
                _id: 'mock-att-2',
                date: new Date(),
                status: 'absent',
                notes: 'Sick leave',
                employee: {
                  _id: 'mock-emp-2',
                  firstName: 'Arlene',
                  lastName: 'McCoy',
                  position: 'Designer',
                  department: 'Design',
                  status: 'active',
                  profilePic: 'https://randomuser.me/api/portraits/women/63.jpg'
                }
              }
            ]
          };
        }
        
        if (endpoint.startsWith('/employees')) {
          return {
            success: true,
            employees: [
              {
                _id: 'mock-emp-1',
                firstName: 'Jane',
                lastName: 'Cooper',
                email: 'jane.cooper@example.com',
                position: 'Designer',
                department: 'Design',
                status: 'active',
                profilePic: 'https://randomuser.me/api/portraits/women/44.jpg'
              },
              {
                _id: 'mock-emp-2',
                firstName: 'Arlene',
                lastName: 'McCoy',
                email: 'arlene.mccoy@example.com',
                position: 'Designer',
                department: 'Design',
                status: 'active',
                profilePic: 'https://randomuser.me/api/portraits/women/63.jpg'
              },
              {
                _id: 'mock-emp-3',
                firstName: 'Cody',
                lastName: 'Fisher',
                email: 'cody.fisher@example.com',
                position: 'Senior Developer',
                department: 'Backend Development',
                status: 'active',
                profilePic: 'https://randomuser.me/api/portraits/men/67.jpg'
              },
              {
                _id: 'mock-emp-4',
                firstName: 'Janney',
                lastName: 'Wilson',
                email: 'janney.wilson@example.com',
                position: 'Junior Developer',
                department: 'Backend Development',
                status: 'active',
                profilePic: 'https://randomuser.me/api/portraits/men/52.jpg'
              },
              {
                _id: 'mock-emp-5',
                firstName: 'Leslie',
                lastName: 'Alexander',
                email: 'leslie.alexander@example.com',
                position: 'Team Lead',
                department: 'Human Resource',
                status: 'active',
                profilePic: 'https://randomuser.me/api/portraits/women/53.jpg'
              }
            ]
          };
        }
        
        // Default mock data for other endpoints
        return { success: true, message: 'Mock data for development' };
      }
      
      // For production or if we want to handle auth errors properly
      console.error('Authentication error:', response.status);
      
      // Force redirect to login
      window.location.href = '/login?session=expired';
      throw new Error('Session expired. Please login again.');
    }

    // For non-JSON responses
    if (!response.headers.get('content-type')?.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return { success: true, message: 'Operation successful' };
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status} - ${response.statusText || 'Something went wrong'}`);
    }

    return data;
  } catch (error) {
    // Handle abort errors (timeout)
    if (error.name === 'AbortError') {
      console.error(`API Request Timeout (${endpoint})`);
      throw new Error('Request timed out. Please try again.');
    }
    
    // Handle network errors
    if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
      console.error(`Network Error (${endpoint}):`, error);
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Attendance API service
export const attendanceService = {
  // Get all attendance records with filters
  getAttendanceRecords: async (filters = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      const queryString = queryParams.toString();
      const endpoint = `/attendance${queryString ? `?${queryString}` : ''}`;
      
      return await fetchAPI(endpoint);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      // Return empty result instead of throwing to make component handling easier
      return { success: false, attendanceRecords: [], error: error.message };
    }
  },
  
  // Get attendance for a specific employee
  getEmployeeAttendance: async (employeeId, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    const queryString = queryParams.toString();
    const endpoint = `/attendance/employee/${employeeId}${queryString ? `?${queryString}` : ''}`;
    
    return fetchAPI(endpoint);
  },
  
  // Get attendance for a specific date
  getAttendanceByDate: async (date) => {
    return fetchAPI(`/attendance/date/${date}`);
  },
  
  // Create a new attendance record
  createAttendance: async (attendanceData) => {
    return fetchAPI('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  },
  
  // Update an attendance record
  updateAttendance: async (id, attendanceData) => {
    return fetchAPI(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attendanceData),
    });
  },
  
  // Delete an attendance record
  deleteAttendance: async (id) => {
    return fetchAPI(`/attendance/${id}`, {
      method: 'DELETE',
    });
  },
};

// Employee API service
export const employeeService = {
  // Get all employees
  getEmployees: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      const queryString = queryParams.toString();
      const endpoint = `/employees${queryString ? `?${queryString}` : ''}`;
      
      return await fetchAPI(endpoint);
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Return empty result instead of throwing
      return { success: false, employees: [], error: error.message };
    }
  },
  
  // Get a specific employee
  getEmployee: async (id) => {
    try {
      return await fetchAPI(`/employees/${id}`);
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      return { success: false, employee: null, error: error.message };
    }
  },
  
  // Create a new employee
  createEmployee: async (employeeData) => {
    return fetchAPI('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  },
  
  // Update an employee
  updateEmployee: async (id, employeeData) => {
    return fetchAPI(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  },
  
  // Delete an employee
  deleteEmployee: async (id) => {
    return fetchAPI(`/employees/${id}`, {
      method: 'DELETE',
    });
  },
};

// Candidates API service
export const candidateService = {
  // Get all candidates
  getCandidates: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = `/candidates${queryString ? `?${queryString}` : ''}`;
    
    return fetchAPI(endpoint);
  },
  
  // Get a specific candidate
  getCandidate: async (id) => {
    return fetchAPI(`/candidates/${id}`);
  },
  
  // Create a new candidate
  createCandidate: async (candidateData) => {
    return fetchAPI('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData),
    });
  },
  
  // Update a candidate
  updateCandidate: async (id, candidateData) => {
    return fetchAPI(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(candidateData),
    });
  },
  
  // Delete a candidate
  deleteCandidate: async (id) => {
    return fetchAPI(`/candidates/${id}`, {
      method: 'DELETE',
    });
  },
};

// Leaves API service
export const leaveService = {
  // Get all leave requests
  getLeaves: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = `/leaves${queryString ? `?${queryString}` : ''}`;
    
    return fetchAPI(endpoint);
  },
  
  // Get a specific leave request
  getLeave: async (id) => {
    return fetchAPI(`/leaves/${id}`);
  },
  
  // Create a new leave request
  createLeave: async (leaveData) => {
    try {
      // Validate employee ID exists before making API call
      if (!leaveData.employeeId) {
        throw new Error('Employee ID is required');
      }
      
      // Make the real API call
      return fetchAPI('/leaves', {
        method: 'POST',
        body: JSON.stringify(leaveData),
      });
    } catch (error) {
      console.warn('Error in createLeave:', error.message);
      throw error;
    }
  },
  
  // Update a leave request
  updateLeave: async (id, leaveData) => {
    return fetchAPI(`/leaves/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leaveData),
    });
  },
  
  // Update leave status (approve/reject)
  updateLeaveStatus: async (id, status) => {
    return fetchAPI(`/leaves/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  
  // Delete a leave request
  deleteLeave: async (id) => {
    return fetchAPI(`/leaves/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  attendanceService,
  employeeService,
  candidateService,
  leaveService,
}; 