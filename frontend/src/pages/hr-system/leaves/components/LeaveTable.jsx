import React, { useState } from 'react';
import { 
  DocumentIcon, 
  ChevronDownIcon,
  ApprovedIcon,
  PendingIcon
} from '../../../../components/icons';

const LeaveTable = ({ 
  leaveRecords, 
  updateLeaveStatus, 
  isLoading 
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);

  const toggleStatusDropdown = (id, e) => {
    e.stopPropagation();
    setShowStatusDropdown(showStatusDropdown === id ? null : id);
  };

  const handleStatusUpdate = (id, newStatus) => {
    updateLeaveStatus(id, newStatus);
    setShowStatusDropdown(null);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear()).substr(-2)}`;
  };

  return (
    <div className="applied-leaves-section">
      <h3 className="section-title">Applied Leaves</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Docs</th>
            <th>Not Show</th>
          </tr>
        </thead>
        <tbody>
        {isLoading ? (
          <tr>
            <td colSpan="7" className="loading-indicator">Loading leaves...</td>
          </tr>
        ) : leaveRecords.length === 0 ? (
          <tr>
            <td colSpan="7" className="no-data">No leave records found</td>
          </tr>
        ) : (
          leaveRecords.map(record => (
            <tr key={record.id}>
              <td className="profile-cell">
                <div className="profile-pic-wrapper">
                <img src={record.profilePic} alt={record.name} className="profile-pic" />
                </div>
              </td>
              <td>
                <div>{record.name}</div>
                <div className="position-subtitle">{record.position}</div>
              </td>
              <td>{formatDate(record.date)}</td>
              <td>{record.reason}</td>
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
                      <div 
                        className={`status-option ${record.status === 'Pending' ? 'active' : ''}`}
                        onClick={() => handleStatusUpdate(record.id, 'Pending')}
                      >
                        <PendingIcon />
                        <span>Pending</span>
                      </div>
                      <div 
                        className={`status-option ${record.status === 'Approved' ? 'active' : ''}`}
                        onClick={() => handleStatusUpdate(record.id, 'Approved')}
                      >
                        <ApprovedIcon />
                        <span>Approved</span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                {record.documents && (
                  <a href="#" className="document-link">
                    <DocumentIcon />
                  </a>
                )}
              </td>
              <td className="not-show-cell">
                {record.notShow && (
                  <span className="not-show-badge">Not Show</span>
                )}
              </td>
            </tr>
          ))
        )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable; 