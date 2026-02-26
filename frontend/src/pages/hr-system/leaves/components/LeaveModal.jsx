import React, { useState } from 'react';
import { 
  SearchIcon, 
  CalendarIcon, 
  UploadIcon, 
  CloseIcon 
} from '../../../../components/icons';

const LeaveModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  isLoading, 
  error 
}) => {
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

  // Mock employees data (this should come from props or a context)
  const employees = [
    {
      id: 1,
      name: 'Jane Copper',
      position: 'Full Time Designer',
      profilePic: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Janney Wilson',
      position: 'Junior Backend Developer',
      profilePic: 'https://randomuser.me/api/portraits/men/52.jpg'
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

  const handleDocumentUpload = () => {
    const fileName = "Jane_Medical_Report.pdf";
    setLeaveForm({
      ...leaveForm,
      document: fileName
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedEmployee) return;
    
    const leaveData = {
      employeeId: selectedEmployee.id,
      leaveType: leaveForm.leaveType || 'sick',
      startDate: leaveForm.leaveDate,
      endDate: leaveForm.leaveDate, // For single day leave
      reason: leaveForm.reason,
      notShow: leaveForm.notShow || false,
      attachments: leaveForm.document ? [{ name: leaveForm.document }] : []
    };
    
    onSave(leaveData, selectedEmployee);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Leave</h3>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee Name*</label>
            <div className="employee-select">
              <div 
                className={`selected-employee ${selectedEmployee ? 'has-value' : ''}`}
                onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
              >
                {selectedEmployee ? (
                  <span>{selectedEmployee.name}</span>
                ) : (
                  <div className="search-employee">
                    <SearchIcon />
                    <input 
                      type="text"
                      placeholder="Search Employee Name"
                      value={selectedEmployeeSearch}
                      onChange={(e) => {
                        setSelectedEmployeeSearch(e.target.value);
                        setShowEmployeeDropdown(true);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                {selectedEmployee && (
                  <button 
                    className="clear-employee" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmployee(null);
                      setSelectedEmployeeSearch("");
                    }}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
              
              {showEmployeeDropdown && (
                <div className="employee-options">
                  {filterEmployees(selectedEmployeeSearch).map(employee => (
                    <div 
                      key={employee.id}
                      className="employee-option"
                      onClick={() => selectEmployee(employee)}
                    >
                      <div className="profile-pic-wrapper small">
                        <img src={employee.profilePic} alt={employee.name} className="profile-pic" />
                      </div>
                      <div className="employee-option-details">
                        <div className="name">{employee.name}</div>
                        <div className="position">{employee.position}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label>Designation*</label>
            <input 
              type="text"
              value={leaveForm.designation}
              onChange={(e) => setLeaveForm({...leaveForm, designation: e.target.value})}
              required
              readOnly={!!selectedEmployee}
            />
          </div>
          
          <div className="form-group">
            <label>Leave Date*</label>
            <div className="date-input-wrapper">
              <input 
                type="date"
                value={leaveForm.leaveDate}
                onChange={(e) => setLeaveForm({...leaveForm, leaveDate: e.target.value})}
                required
              />
              <CalendarIcon />
            </div>
          </div>
          
          <div className="form-group">
            <label>Document</label>
            <div className="file-input-wrapper">
              <input 
                type="text"
                placeholder="Upload documents"
                value={leaveForm.document}
                readOnly
              />
              <button 
                type="button"
                className="upload-button"
                onClick={handleDocumentUpload}
              >
                <UploadIcon />
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Reason*</label>
            <input 
              type="text"
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
              required
            />
          </div>
          
          {error && (
            <div className="form-error-message">{error}</div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <button 
              type="submit" 
              style={{
                backgroundColor: '#4D007D',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 28px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
              }} 
              disabled={!selectedEmployee || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveModal; 