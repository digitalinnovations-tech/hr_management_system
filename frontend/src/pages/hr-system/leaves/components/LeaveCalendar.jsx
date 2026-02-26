import React, { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '../../../../components/icons';

const LeaveCalendar = ({ leaveRecords }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [highlightedDays, setHighlightedDays] = useState([8, 15]);

  // Calendar generation helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
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
  };

  const changeMonth = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear()).substr(-2)}`;
  };

  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  return (
    <div className="leave-calendar-section">
      <h3 className="section-title">Leave Calendar</h3>
      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            className="calendar-nav-button"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeftIcon />
          </button>
          <div className="calendar-title">
            {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
          </div>
          <button 
            className="calendar-nav-button"
            onClick={() => changeMonth(1)}
          >
            <ChevronRightIcon />
          </button>
        </div>
        
        <table className="calendar">
          <thead>
            <tr>
              <th>S</th>
              <th>M</th>
              <th>T</th>
              <th>W</th>
              <th>T</th>
              <th>F</th>
              <th>S</th>
            </tr>
          </thead>
          <tbody>
            {/* Generate calendar grid */}
            {(() => {
              const days = generateCalendarDays();
              const rows = [];
              let cells = [];
              
              days.forEach((day, index) => {
                cells.push(
                  <td key={index}>
                    {day !== null && (
                      <div className={`calendar-day ${highlightedDays.includes(day) ? 'has-leave' : ''}`}>
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
        
        <div className="approved-leaves-list">
          <h4>Approved Leaves</h4>
          {leaveRecords
            .filter(record => record.status === 'Approved')
            .map(record => (
              <div key={record.id} className="approved-leave-item">
                <div className="profile-pic-wrapper small">
                  <img src={record.profilePic} alt={record.name} className="profile-pic" />
                </div>
                <div className="approved-leave-details">
                  <div className="name">{record.name}</div>
                  <div className="position-subtitle">{record.position}</div>
                </div>
                <div className="approved-leave-date">
                  {formatDate(record.date)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar; 