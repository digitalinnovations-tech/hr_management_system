import React, { useState, useEffect } from 'react';
import { leaveService } from '../../../services/api';

// Add CSS for the warning message
const styles = {
  warningMessage: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeeba',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  leavesContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '20px',
    height: 'calc(100% - 60px)'
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  },
  tableHeader: {
    backgroundColor: '#580080',
    color: 'white',
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: '500'
  },
  tableRow: {
    borderBottom: '1px solid #eee'
  },
  tableCell: {
    padding: '12px 15px',
    fontSize: '14px'
  },
  profileCell: {
    width: '50px'
  },
  profilePic: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '13px',
    cursor: 'pointer',
    position: 'relative'
  },
  approved: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    color: '#4caf50',
    border: '1px solid rgba(76, 175, 80, 0.5)'
  },
  pending: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    color: '#ff9800',
    border: '1px solid rgba(255, 152, 0, 0.5)'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '500px',
    maxWidth: '90%',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    position: 'relative',
    padding: '0 0 20px 0',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    backgroundColor: '#580080',
    color: 'white',
    padding: '15px 20px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  form: {
    padding: '0 20px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '10px 15px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },
  saveButton: {
    backgroundColor: '#580080',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 30px',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  hasLeave: {
    backgroundColor: '#580080',
    color: 'white',
    borderRadius: '50%'
  },
  datePicker: {
    position: 'absolute',
    top: '100%',
    left: '0',
    zIndex: '100',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    padding: '10px',
    width: '250px'
  }
};

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

const DocumentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="#580080"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7-7 7z" fill="#fff"/>
  </svg>
);

const ApprovedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#4caf50"/>
  </svg>
);

const PendingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="#ff9800"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#580080"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="#580080"/>
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

const LeavesPanel = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [selectedEmployeeSearch, setSelectedEmployeeSearch] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveForm, setLeaveForm] = useState({
    employeeName: '',
    designation: '',
    leaveDate: '',
    reason: '',
    document: '',
    notShow: false,
    leaveType: 'casual'
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [leaveTypeOptions] = useState([
    { value: 'casual', label: 'Casual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'annual', label: 'Annual Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' }
  ]);

  // Load leave records from localStorage on component mount
  useEffect(() => {
    const savedLeaves = localStorage.getItem('hr_leave_records');
    if (savedLeaves) {
      setLeaveRecords(JSON.parse(savedLeaves));
    } else {
      fetchLeaves();
    }
  }, []);

  // Save leave records to localStorage whenever they change
  useEffect(() => {
    if (leaveRecords.length > 0) {
      localStorage.setItem('hr_leave_records', JSON.stringify(leaveRecords));
    }
  }, [leaveRecords]);

  // Update to sync calendar highlighted days with leave records
  useEffect(() => {
    if (leaveRecords.length > 0) {
      try {
        // Extract days from leave records for the current month/year
        const days = leaveRecords
          .filter(record => {
            if (!record.date) return false;
            
            try {
              const leaveDate = new Date(record.date);
              return (
                !isNaN(leaveDate.getTime()) &&
                leaveDate.getMonth() === currentMonth.getMonth() && 
                leaveDate.getFullYear() === currentMonth.getFullYear()
              );
            } catch (e) {
              console.error("Error parsing date:", e);
              return false;
            }
          })
          .map(record => {
            try {
              return new Date(record.date).getDate();
            } catch (e) {
              console.error("Error getting date:", e);
              return null;
            }
          })
          .filter(day => day !== null);
        
        // Set unique days
        setHighlightedDays([...new Set(days)]);
      } catch (error) {
        console.error("Error updating highlighted days:", error);
        setHighlightedDays([]);
      }
    } else {
      setHighlightedDays([]);
    }
  }, [leaveRecords, currentMonth]);

  // Clear any possible timeout to prevent memory leaks
  useEffect(() => {
    return () => {
      if (window.leaveFormTimeout) {
        clearTimeout(window.leaveFormTimeout);
      }
    };
  }, []);

  // Make sure clicking outside closes the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStatusDropdown !== null && !event.target.closest('.status-dropdown')) {
        setShowStatusDropdown(null);
      }
      if (showDatePicker && !event.target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
      if (showEmployeeDropdown && !event.target.closest('.employee-dropdown')) {
        setShowEmployeeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown, showDatePicker, showEmployeeDropdown]);

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to get from localStorage first
      const savedLeaves = localStorage.getItem('hr_leave_records');
      if (savedLeaves) {
        setLeaveRecords(JSON.parse(savedLeaves));
        setIsLoading(false);
        return;
      }
      
      let response;
      try {
        response = await leaveService.getLeaves();
      } catch (err) {
        console.error('API error:', err);
        // Use mock data when the API is unavailable
        const mockLeaves = getInitialMockLeaveData();
        setLeaveRecords(mockLeaves);
        // Save to localStorage
        localStorage.setItem('hr_leave_records', JSON.stringify(mockLeaves));
        setIsLoading(false);
        return;
      }
      
      if (response && response.success && response.leaves) {
        // Transform API data to match our UI format
        const formattedLeaves = response.leaves.map(leave => ({
          id: leave._id,
          name: leave.employee?.firstName + ' ' + leave.employee?.lastName,
          position: leave.employee?.department,
          date: leave.startDate,
          reason: leave.reason,
          status: leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
          documents: leave.attachments?.length > 0 ? leave.attachments[0].name : null,
          profilePic: leave.employee?.profilePic || 'https://randomuser.me/api/portraits/men/67.jpg',
          notShow: leave.notShow || false,
          leaveType: leave.leaveType || 'casual'
        }));
        setLeaveRecords(formattedLeaves);
        // Save to localStorage
        localStorage.setItem('hr_leave_records', JSON.stringify(formattedLeaves));
      } else {
        // Fallback to mock data
        const mockLeaves = getInitialMockLeaveData();
        setLeaveRecords(mockLeaves);
        // Save to localStorage
        localStorage.setItem('hr_leave_records', JSON.stringify(mockLeaves));
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      // Always fallback to mock data
      const mockLeaves = getInitialMockLeaveData();
      setLeaveRecords(mockLeaves);
      // Save to localStorage
      localStorage.setItem('hr_leave_records', JSON.stringify(mockLeaves));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get consistent mock data for testing
  const getInitialMockLeaveData = () => {
    return [
      {
        id: 'mock-1',
        name: 'Cody Fisher',
        position: 'Senior Backend Developer',
        date: '2024-09-08',
        reason: 'Visiting House',
        status: 'Approved',
        documents: 'medical_report.pdf',
        profilePic: 'https://randomuser.me/api/portraits/men/67.jpg',
        notShow: false,
        leaveType: 'sick'
      },
      {
        id: 'mock-2',
        name: 'Jane Cooper',
        position: 'Full Time Designer',
        date: '2024-10-09',
        reason: 'Visiting House',
        status: 'Approved',
        documents: null,
        profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
        notShow: false,
        leaveType: 'casual'
      },
      {
        id: 'mock-3',
        name: 'Leslie Alexander',
        position: 'Team Lead',
        date: '2024-10-15',
        reason: 'Family vacation',
        status: 'Pending',
        documents: null,
        profilePic: 'https://randomuser.me/api/portraits/women/53.jpg',
        notShow: false,
        leaveType: 'annual'
      }
    ];
  };

  const toggleStatusDropdown = (id, e) => {
    e.stopPropagation();
    setShowStatusDropdown(showStatusDropdown === id ? null : id);
  };

  const updateLeaveStatus = async (id, newStatus) => {
    try {
      setIsLoading(true);
      
      // Find the leave record
      const leaveRecord = leaveRecords.find(record => record.id === id);
      if (!leaveRecord) return;
      
      // Update the UI state directly
      const updatedRecords = leaveRecords.map(record => 
        record.id === id ? { 
          ...record, 
          status: newStatus 
        } : record
      );
      
      setLeaveRecords(updatedRecords);
      
      // Update localStorage
      localStorage.setItem('hr_leave_records', JSON.stringify(updatedRecords));
      
      // Try to call API (but continue regardless of success)
      try {
        await leaveService.updateLeaveStatus(id, newStatus.toLowerCase());
      } catch (err) {
        console.error('Error updating leave status in API:', err);
        // Continue with local update even if API call fails
      }
      
      setShowStatusDropdown(null);
    } catch (error) {
      console.error('Error updating leave status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'approved';
      case 'pending':
        return 'pending';
      case 'rejected':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <ApprovedIcon />;
      case 'Pending':
        return <PendingIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const handleAddLeave = () => {
    setSelectedEmployee(null);
    setSelectedEmployeeSearch("");
    setLeaveForm({
      employeeName: '',
      designation: '',
      leaveDate: '',
      reason: '',
      document: '',
      notShow: false,
      leaveType: 'casual'
    });
    setError(null);
    setShowModal(true);
  };

  const employees = [
    {
      id: '60d21b4667d0d8992e610c85',
      name: 'Jane Cooper',
      position: 'Full Time Designer',
      profilePic: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '60d21b4667d0d8992e610c86', 
      name: 'Janney Wilson',
      position: 'Junior Backend Developer',
      profilePic: 'https://randomuser.me/api/portraits/men/52.jpg'
    },
    {
      id: '60d21b4667d0d8992e610c87',
      name: 'Cody Fisher',
      position: 'Senior Backend Developer',
      profilePic: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      id: '60d21b4667d0d8992e610c88',
      name: 'Leslie Alexander',
      position: 'Team Lead',
      profilePic: 'https://randomuser.me/api/portraits/women/53.jpg'
    }
  ];

  const filterEmployees = (query) => {
    if (!query) return employees;
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const selectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeSearch(employee.name);
    setLeaveForm({
      ...leaveForm,
      employeeName: employee.name,
      designation: employee.position
    });
    setShowEmployeeDropdown(false);
  };

  const handleSaveLeave = async (e) => {
    e.preventDefault();
    
    if (!selectedEmployee) {
      setError("Please select an employee");
      return;
    }
    if (!leaveForm.leaveDate) {
      setError("Please select a leave date");
      return;
    }
    if (!leaveForm.reason) {
      setError("Please enter a reason for leave");
      return;
    }
    if (!leaveForm.leaveType) {
      setError("Please select a leave type");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create new leave record for UI
      const newLeave = {
        id: `leave-${Date.now()}`,
        name: selectedEmployee.name,
        position: selectedEmployee.position,
        date: leaveForm.leaveDate,
        reason: leaveForm.reason,
        status: 'Pending',
        documents: leaveForm.document,
        profilePic: selectedEmployee.profilePic,
        notShow: leaveForm.notShow,
        leaveType: leaveForm.leaveType
      };
      
      // Update UI state
      const updatedRecords = [newLeave, ...leaveRecords];
      setLeaveRecords(updatedRecords);
      
      // Update localStorage
      localStorage.setItem('hr_leave_records', JSON.stringify(updatedRecords));
      
      // Try to call the API (but continue even if it fails)
      try {
        const leaveData = {
          employeeId: selectedEmployee.id,
          leaveType: leaveForm.leaveType,
          startDate: leaveForm.leaveDate,
          endDate: leaveForm.leaveDate,
          reason: leaveForm.reason,
          notShow: leaveForm.notShow || false,
          attachments: leaveForm.document ? [{ name: leaveForm.document }] : []
        };
        await leaveService.createLeave(leaveData);
      } catch (apiError) {
        console.error('API error when saving leave:', apiError);
        // Continue with local update even if API call fails
      }
      
      // Update highlighted days in calendar
      const newDate = new Date(leaveForm.leaveDate);
      const day = newDate.getDate();
      if (newDate.getMonth() === currentMonth.getMonth() && 
          newDate.getFullYear() === currentMonth.getFullYear() && 
          !highlightedDays.includes(day)) {
        setHighlightedDays([...highlightedDays, day]);
      }
      
      setShowModal(false);
      
      // Reset form
      setSelectedEmployee(null);
      setSelectedEmployeeSearch("");
      setLeaveForm({
        employeeName: '',
        designation: '',
        leaveDate: '',
        reason: '',
        document: '',
        notShow: false,
        leaveType: 'casual'
      });
    } catch (error) {
      console.error('Error creating leave:', error);
      setError('An error occurred while saving leave data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = () => {
    // Simulate a file selection dialog
    const fileName = selectedEmployee ? 
      `${selectedEmployee.name.replace(/\s+/g, '_')}_Medical_Report.pdf` : 
      "Medical_Report.pdf";
      
    setLeaveForm({
      ...leaveForm,
      document: fileName
    });
  };

  // Calendar generation helpers
  const getDaysInMonth = (date) => {
    try {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    } catch (e) {
      console.error("Error getting days in month:", e);
      return 30; // Fallback to 30 days
    }
  };

  const getFirstDayOfMonth = (date) => {
    try {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    } catch (e) {
      console.error("Error getting first day of month:", e);
      return 0; // Fallback to Sunday
    }
  };

  const generateCalendarDays = () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const daysInMonth = getDaysInMonth(currentMonth);
      const firstDay = getFirstDayOfMonth(currentMonth);
      
      const days = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }
      
      return days;
    } catch (error) {
      console.error("Error generating calendar days:", error);
      return Array(35).fill(null); // Fallback to empty calendar
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If invalid date, return the original string
        return dateString;
      }
      return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const changeMonth = (increment) => {
    try {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      setCurrentMonth(newMonth);
    } catch (e) {
      console.error("Error changing month:", e);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const stopPropagation = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
  };

  return (
    <div className="panel leaves-panel" style={styles.panel}>
      <div className="panel-header" style={styles.panelHeader}>
        <h2>Leaves</h2>
        <div className="panel-actions">
          <div className="filter-dropdown">
            <button className="filter-button">
              Status <FilterIcon />
            </button>
          </div>
          <div className="search-container">
            <SearchIcon />
            <input type="text" className="search-input" placeholder="Search" />
          </div>
          <button className="add-button" onClick={handleAddLeave}>
            Add Leave
          </button>
        </div>
      </div>
      
      {error && !error.includes('save') && error.includes('select') && (
        <div 
          className="error-message"
          style={{
            ...styles.warningMessage,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{error}</span>
        </div>
      )}
      
      <div className="leaves-container" style={styles.leavesContainer}>
        {/* Applied Leaves Section */}
        <div className="applied-leaves-section">
          <h3 className="section-title">Applied Leaves</h3>
            <table className="data-table" style={styles.dataTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Profile</th>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Date</th>
                  <th style={styles.tableHeader}>Reason</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Docs</th>
                </tr>
              </thead>
              <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={styles.tableCell}>Loading leaves...</td>
                </tr>
              ) : leaveRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.tableCell}>No leave records found</td>
                </tr>
              ) : (
                leaveRecords.map(record => (
                  <tr key={record.id} style={styles.tableRow}>
                    <td style={{...styles.tableCell, ...styles.profileCell}}>
                      <img src={record.profilePic} alt={record.name} style={styles.profilePic} />
                    </td>
                    <td style={styles.tableCell}>
                      <div>{record.name}</div>
                      <div style={{fontSize: '12px', color: '#777'}}>{record.position}</div>
                    </td>
                    <td style={styles.tableCell}>{formatDate(record.date)}</td>
                    <td style={styles.tableCell}>
                      <div>{record.reason}</div>
                      <div style={{fontSize: '12px', color: '#777'}}>
                        {record.leaveType && (() => {
                          // Convert from value to label
                          const typeOption = leaveTypeOptions.find(opt => opt.value === record.leaveType);
                          return typeOption ? typeOption.label : 'Casual Leave';
                        })()}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div 
                        className="status-dropdown"
                        style={{
                          ...styles.statusBadge,
                          ...(record.status === 'Approved' ? styles.approved : styles.pending)
                        }}
                        onClick={(e) => toggleStatusDropdown(record.id, e)}
                      >
                        {getStatusIcon(record.status)}
                        <span style={{marginLeft: '5px'}}>{record.status}</span>
                        <ChevronDownIcon isOpen={showStatusDropdown === record.id} />
                        
                        {showStatusDropdown === record.id && (
                          <div 
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: '0',
                              backgroundColor: 'white',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                              borderRadius: '4px',
                              zIndex: '100',
                              minWidth: '120px',
                              marginTop: '5px'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div 
                              style={{
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                backgroundColor: record.status === 'Pending' ? '#f5f5f5' : 'transparent',
                                borderRadius: '4px 4px 0 0'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (record.status !== 'Pending') {
                                  updateLeaveStatus(record.id, 'Pending');
                                } else {
                                  setShowStatusDropdown(null);
                                }
                              }}
                            >
                              <PendingIcon />
                              <span style={{marginLeft: '5px'}}>Pending</span>
                            </div>
                            <div 
                              style={{
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                backgroundColor: record.status === 'Approved' ? '#f5f5f5' : 'transparent',
                                borderRadius: '0 0 4px 4px'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (record.status !== 'Approved') {
                                  updateLeaveStatus(record.id, 'Approved');
                                } else {
                                  setShowStatusDropdown(null);
                                }
                              }}
                            >
                              <ApprovedIcon />
                              <span style={{marginLeft: '5px'}}>Approved</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      {record.documents && (
                        <a href="#" 
                          style={{color: '#580080'}}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Document: ${record.documents}`);
                          }}
                        >
                          <DocumentIcon />
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
        </div>
        
        {/* Leave Calendar Section */}
        <div className="leave-calendar-section">
          <h3 className="section-title">Leave Calendar</h3>
          <div className="calendar-container" style={styles.calendarContainer}>
            <div className="calendar-header" style={styles.calendarHeader}>
              <button 
                className="calendar-nav-button"
                onClick={() => changeMonth(-1)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronLeftIcon />
              </button>
              <div className="calendar-title">
                {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
              </div>
              <button 
                className="calendar-nav-button"
                onClick={() => changeMonth(1)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronRightIcon />
              </button>
            </div>
            
            <table className="calendar" style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'center'
            }}>
              <thead>
                <tr>
                  <th style={{padding: '8px', fontSize: '12px'}}>S</th>
                  <th style={{padding: '8px', fontSize: '12px'}}>M</th>
                  <th style={{padding: '8px', fontSize: '12px'}}>T</th>
                  <th style={{padding: '8px', fontSize: '12px'}}>W</th>
                  <th style={{padding: '8px', fontSize: '12px'}}>T</th>
                  <th style={{padding: '8px', fontSize: '12px'}}>F</th>
                  <th style={{padding: '8px', fontSize: '12px'}}>S</th>
                </tr>
              </thead>
              <tbody>
                {/* Generate calendar grid */}
                {(() => {
                  const days = generateCalendarDays();
                  const rows = [];
                  let cells = [];
                  
                  days.forEach((day, index) => {
                    const isHighlighted = day !== null && highlightedDays.includes(day);
                    
                    cells.push(
                      <td key={index} style={{padding: '2px'}}>
                        {day !== null && (
                          <div style={{
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            fontSize: '13px',
                            backgroundColor: isHighlighted ? '#580080' : 'transparent',
                            color: isHighlighted ? 'white' : 'inherit',
                            borderRadius: '50%',
                            cursor: 'default'
                          }}>
                            {day}
                          </div>
                        )}
                      </td>
                    );
                    
                    if ((index + 1) % 7 === 0 || index === days.length - 1) {
                      rows.push(<tr key={Math.floor(index / 7)}>{cells}</tr>);
                      cells = [];
                    }
                  });
                  
                  return rows;
                })()}
              </tbody>
            </table>
            
            <div className="approved-leaves-list" style={{marginTop: '20px'}}>
              <h4 style={{fontSize: '14px', marginBottom: '10px'}}>Approved Leaves</h4>
              {leaveRecords
                .filter(record => record.status === 'Approved')
                .map(record => (
                  <div key={record.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <img 
                      src={record.profilePic} 
                      alt={record.name} 
                      style={{
                        width: '30px',
                        height: '30px', 
                        borderRadius: '50%',
                        marginRight: '10px'
                      }} 
                    />
                    <div style={{flex: '1'}}>
                      <div style={{fontSize: '14px'}}>{record.name}</div>
                      <div style={{fontSize: '12px', color: '#777'}}>{record.position}</div>
                    </div>
                    <div style={{fontSize: '13px'}}>
                      {formatDate(record.date)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Leave Modal */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000'
          }} 
          onClick={() => {
            setShowModal(false);
            setShowDatePicker(false);
            setShowEmployeeDropdown(false);
          }}
        >
          <div style={styles.modal} onClick={e => stopPropagation(e)}>
            <div style={styles.modalHeader}>
              <h3 style={{margin: '0', fontWeight: '500'}}>Add New Leave</h3>
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer'
                }}
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <form style={styles.form} onSubmit={handleSaveLeave}>
              <div style={styles.formGroup}>
                <div className="employee-dropdown" style={{
                  position: 'relative',
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  overflow: 'visible'
                }}>
                  <div 
                    style={{
                      padding: '10px 15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEmployeeDropdown(!showEmployeeDropdown);
                    }}
                  >
                    {selectedEmployee ? (
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <img 
                          src={selectedEmployee.profilePic} 
                          alt={selectedEmployee.name} 
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            marginRight: '8px'
                          }}
                        />
                        <span>{selectedEmployee.name}</span>
                      </div>
                    ) : (
                      <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                        <SearchIcon />
                        <input 
                          type="text"
                          placeholder="Search Employee Name*"
                          value={selectedEmployeeSearch}
                          onChange={(e) => {
                            setSelectedEmployeeSearch(e.target.value);
                            setShowEmployeeDropdown(true);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEmployeeDropdown(true);
                          }}
                          style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            marginLeft: '5px'
                          }}
                        />
                      </div>
                    )}
                    {selectedEmployee ? (
                      <button 
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(null);
                          setSelectedEmployeeSearch("");
                          setLeaveForm({
                            ...leaveForm,
                            employeeName: '',
                            designation: ''
                          });
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#580080"/>
                        </svg>
                      </button>
                    ) : (
                      <ChevronDownIcon isOpen={showEmployeeDropdown} />
                    )}
                  </div>
                  
                  {showEmployeeDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      zIndex: '20',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      borderRadius: '8px',
                      marginTop: '4px'
                    }}>
                      {filterEmployees(selectedEmployeeSearch).length > 0 ? (
                        filterEmployees(selectedEmployeeSearch).map(employee => (
                          <div 
                            key={employee.id}
                            style={{
                              padding: '10px 15px',
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee',
                              backgroundColor: 'transparent',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={(e) => {
                              e.stopPropagation();
                              selectEmployee(employee);
                            }}
                          >
                            <img 
                              src={employee.profilePic} 
                              alt={employee.name} 
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                marginRight: '10px'
                              }} 
                            />
                            <div>
                              <div style={{fontSize: '14px'}}>{employee.name}</div>
                              <div style={{fontSize: '12px', color: '#777'}}>{employee.position}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{padding: '10px 15px', color: '#777', textAlign: 'center'}}>
                          No employees found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {!selectedEmployee && error && error.includes("employee") && (
                  <div style={{color: '#dc3545', fontSize: '12px', marginTop: '4px', paddingLeft: '15px'}}>
                    Please select an employee
                  </div>
                )}
              </div>
              
              <div style={styles.formGroup}>
                <input 
                  type="text"
                  placeholder="Designation*"
                  value={leaveForm.designation}
                  onChange={(e) => setLeaveForm({...leaveForm, designation: e.target.value})}
                  required
                  readOnly={!!selectedEmployee}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <div className="date-picker-container" style={{position: 'relative'}}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '20px',
                    padding: '0 15px',
                    position: 'relative'
                  }}>
                    <input 
                      type="text"
                      placeholder="Leave Date*"
                      value={leaveForm.leaveDate}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDatePicker(!showDatePicker);
                      }}
                      readOnly
                      required
                      style={{
                        flex: '1',
                        border: 'none',
                        outline: 'none',
                        padding: '10px 0'
                      }}
                    />
                    <CalendarIcon />
                  </div>
                  {!leaveForm.leaveDate && error && error.includes("date") && (
                    <div style={{color: '#dc3545', fontSize: '12px', marginTop: '4px', paddingLeft: '15px'}}>
                      Please select a date
                    </div>
                  )}
                  
                  {showDatePicker && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      zIndex: '100',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      padding: '10px',
                      width: '250px',
                      marginTop: '5px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            changeMonth(-1);
                          }}
                          type="button"
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <ChevronLeftIcon />
                        </button>
                        <div>
                          {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            changeMonth(1);
                          }}
                          type="button"
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <ChevronRightIcon />
                        </button>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '5px',
                        textAlign: 'center',
                        marginBottom: '5px',
                        fontSize: '12px'
                      }}>
                        <div>S</div>
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '5px'
                      }}>
                        {generateCalendarDays().map((day, index) => (
                          <div 
                            key={index} 
                            style={{
                              width: '25px',
                              height: '25px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: day ? 'pointer' : 'default',
                              backgroundColor: day === selectedDay ? '#580080' : 
                                               highlightedDays.includes(day) ? 'rgba(88, 0, 128, 0.2)' : 'transparent',
                              color: day === selectedDay ? 'white' : 'inherit',
                              borderRadius: '50%',
                              border: day && !selectedDay && !highlightedDays.includes(day) ? '1px solid #e0e0e0' : 'none'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (day) {
                                setSelectedDay(day);
                                const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                setLeaveForm({...leaveForm, leaveDate: formattedDate});
                                setShowDatePicker(false);
                              }
                            }}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <div style={{
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  padding: '0 15px',
                  overflow: 'hidden'
                }}>
                  <select 
                    value={leaveForm.leaveType}
                    onChange={(e) => setLeaveForm({...leaveForm, leaveType: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      appearance: 'none'
                    }}
                  >
                    {leaveTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {!leaveForm.leaveType && error && error.includes("type") && (
                  <div style={{color: '#dc3545', fontSize: '12px', marginTop: '4px', paddingLeft: '15px'}}>
                    Please select a leave type
                  </div>
                )}
              </div>
              
              <div style={styles.formGroup}>
                <input 
                  type="text"
                  placeholder="Reason*"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                  required
                  style={styles.input}
                />
                {!leaveForm.reason && error && error.includes("reason") && (
                  <div style={{color: '#dc3545', fontSize: '12px', marginTop: '4px', paddingLeft: '15px'}}>
                    Please enter a reason for leave
                  </div>
                )}
              </div>
              
              <div style={styles.formGroup}>
                <div style={{
                  display: 'flex',
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <input 
                    type="text"
                    placeholder="Documents (optional)"
                    value={leaveForm.document}
                    readOnly
                    style={{
                      flex: '1',
                      border: 'none',
                      outline: 'none',
                      padding: '10px 15px'
                    }}
                  />
                  {leaveForm.document && (
                    <button 
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        position: 'absolute',
                        right: '45px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#580080'
                      }}
                      onClick={() => setLeaveForm({...leaveForm, document: ''})}
                    >
                      ×
                    </button>
                  )}
                  <button 
                    type="button"
                    style={{
                      backgroundColor: '#580080',
                      color: 'white',
                      border: 'none',
                      width: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={handleDocumentUpload}
                  >
                    <UploadIcon />
                  </button>
                </div>
              </div>
              
              {error && !error.includes("employee") && !error.includes("date") && 
                !error.includes("reason") && !error.includes("type") && (
                <div style={{
                  color: '#721c24',
                  backgroundColor: '#f8d7da',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              
              <div style={{
                textAlign: 'center',
                marginTop: '25px'
              }}>
                <button 
                  type="submit" 
                  style={{
                    ...styles.saveButton,
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavesPanel; 