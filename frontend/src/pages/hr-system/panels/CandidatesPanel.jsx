import React, { useState, useEffect } from 'react';
// CSS is now imported directly from the public folder in index.html

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

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
  </svg>
);

const NewStatusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#2e7d32"/>
  </svg>
);

const SelectedStatusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#1565c0"/>
  </svg>
);

const RejectedStatusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="#c62828"/>
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

// Toast notification component
const Toast = ({ message, type, onClose }) => (
  <div className={`toast ${type}`}>
    <div className="toast-content">
      {type === 'success' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
        </svg>
      )}
      {type === 'error' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="currentColor"/>
        </svg>
      )}
      <span>{message}</span>
    </div>
    <button className="toast-close" onClick={onClose}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
      </svg>
    </button>
  </div>
);

// Status-specific icon components
const NewStatusBadge = () => (
  <span className="status-icon new-icon">N</span>
);

const SelectedStatusBadge = () => (
  <span className="status-icon selected-icon">S</span>
);

const RejectedStatusBadge = () => (
  <span className="status-icon rejected-icon">R</span>
);

const getStatusBadge = (status) => {
  switch (status) {
    case 'New':
      return <NewStatusBadge />;
    case 'Selected':
      return <SelectedStatusBadge />;
    case 'Rejected':
      return <RejectedStatusBadge />;
    default:
      return <NewStatusBadge />;
  }
};

const CandidatesPanel = () => {
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState({ isDownloading: false, progress: 0 });
  const [downloadedFile, setDownloadedFile] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [showStatusFilterDropdown, setShowStatusFilterDropdown] = useState(false);
  const [showPositionFilterDropdown, setShowPositionFilterDropdown] = useState(false);

  // Load candidates from localStorage on component mount
  useEffect(() => {
    const savedCandidates = localStorage.getItem('hr_candidates');
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    } else {
      // Default candidates
      const defaultCandidates = [
        {
          id: '01',
          name: 'Jacob William',
          email: 'jacob.william@example.com',
          phone: '(252) 555-0111',
          position: 'Senior Developer',
          status: 'New',
          experience: '1+',
          resume: 'Jacob_William_Resume.pdf'
        },
        {
          id: '02',
          name: 'Guy Hawkins',
          email: 'kenzi.lawson@example.com',
          phone: '(907) 555-0101',
          position: 'Human Resource Lead',
          status: 'New',
          experience: '10+',
          resume: 'Guy_Hawkins_Resume.pdf'
        },
        {
          id: '03',
          name: 'Arlene McCoy',
          email: 'arlene.mccoy@example.com',
          phone: '(302) 555-0107',
          position: 'Full Time Designer',
          status: 'Selected',
          experience: '5+',
          resume: 'Arlene_McCoy_Resume.pdf'
        },
        {
          id: '04',
          name: 'Leslie Alexander',
          email: 'willie.jennings@example.com',
          phone: '(207) 555-0119',
          position: 'Full Time Developer',
          status: 'Rejected',
          experience: '0',
          resume: 'Leslie_Alexander_Resume.pdf'
        }
      ];
      setCandidates(defaultCandidates);
      localStorage.setItem('hr_candidates', JSON.stringify(defaultCandidates));
    }
  }, []);

  // Save candidates to localStorage whenever they change
  useEffect(() => {
    if (candidates.length > 0) {
      localStorage.setItem('hr_candidates', JSON.stringify(candidates));
    }
  }, [candidates]);

  const handleAddCandidate = () => {
    setCurrentCandidate({
      id: String(Date.now()).slice(-2).padStart(2, '0'),
      name: '',
      email: '',
      phone: '',
      position: '',
      status: 'New',
      experience: '',
      resume: ''
    });
    setShowModal(true);
  };

  const handleSaveCandidate = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!currentCandidate.name || !currentCandidate.email || !currentCandidate.phone || 
        !currentCandidate.position || !currentCandidate.experience || !currentCandidate.resume) {
      setToast({
        show: true,
        message: 'Please fill in all required fields',
        type: 'error'
      });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
      return;
    }
    
    // Save to candidates state
    const updatedCandidates = [...candidates, currentCandidate];
    setCandidates(updatedCandidates);
    
    // Save to localStorage
    localStorage.setItem('hr_candidates', JSON.stringify(updatedCandidates));
    
    setShowModal(false);
    setCurrentCandidate(null);
    
    // Show success toast
    setToast({
      show: true,
      message: 'Candidate added successfully!',
      type: 'success'
    });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const toggleStatusDropdown = (id, e) => {
    e.stopPropagation();
    setShowStatusDropdown(showStatusDropdown === id ? null : id);
    setShowActionMenu(null);
  };

  const toggleActionMenu = (id, e) => {
    e.stopPropagation();
    setShowActionMenu(showActionMenu === id ? null : id);
    setShowStatusDropdown(null);
  };

  const updateCandidateStatus = (id, newStatus) => {
    const updatedCandidates = candidates.map(candidate => 
      candidate.id === id ? { ...candidate, status: newStatus } : candidate
    );
    
    setCandidates(updatedCandidates);
    
    // Update localStorage
    localStorage.setItem('hr_candidates', JSON.stringify(updatedCandidates));
    
    setShowStatusDropdown(null);
    
    // Show success toast
    setToast({
      show: true,
      message: `Candidate status updated to ${newStatus}`,
      type: 'success'
    });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const confirmDeleteCandidate = (id) => {
    const candidate = candidates.find(c => c.id === id);
    setCandidateToDelete(candidate);
    setShowDeleteModal(true);
    setShowActionMenu(null);
  };

  const deleteCandidate = () => {
    if (!candidateToDelete) return;
    
    const updatedCandidates = candidates.filter(candidate => candidate.id !== candidateToDelete.id);
    setCandidates(updatedCandidates);
    
    // Update localStorage
    localStorage.setItem('hr_candidates', JSON.stringify(updatedCandidates));
    
    setShowDeleteModal(false);
    
    // Show success toast notification
    setToast({
      show: true,
      message: `${candidateToDelete.name} has been deleted.`,
      type: 'success'
    });
    
    setCandidateToDelete(null);
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const downloadResume = (resume, candidateName) => {
    setShowActionMenu(null);
    setDownloadStatus({ isDownloading: true, progress: 0 });
    setDownloadedFile({ resume, candidateName });
    
    // Simulate download progress
    let progress = 0;
    const totalTime = 2000;
    const updateInterval = 100;
    const steps = totalTime / updateInterval;
    const baseIncrement = 100 / steps;
    
    const interval = setInterval(() => {
      const randomFactor = Math.random() * 0.5 + 0.75;
      const increment = baseIncrement * randomFactor;
      
      progress += increment;
      if (progress >= 100) progress = 100;
      
      setDownloadStatus({ isDownloading: true, progress: Math.floor(progress) });
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDownloadStatus({ isDownloading: false, progress: 0 });
          // In a real app, this is where you'd trigger the actual file download
          const link = document.createElement('a');
          link.href = `#`;
          link.setAttribute('download', `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Show success toast notification
          setToast({
            show: true,
            message: `Resume for ${candidateName} downloaded successfully!`,
            type: 'success'
          });
          
          // Auto-hide toast after 3 seconds
          setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
        }, 500);
      }
    }, updateInterval);
  };

  const toggleStatusFilterDropdown = (e) => {
    e.stopPropagation();
    setShowStatusFilterDropdown(!showStatusFilterDropdown);
    setShowPositionFilterDropdown(false);
  };

  const togglePositionFilterDropdown = (e) => {
    e.stopPropagation();
    setShowPositionFilterDropdown(!showPositionFilterDropdown);
    setShowStatusFilterDropdown(false);
  };

  const filterByStatus = (status) => {
    setStatusFilter(status);
    setShowStatusFilterDropdown(false);
  };

  const filterByPosition = (position) => {
    setPositionFilter(position);
    setShowPositionFilterDropdown(false);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setPositionFilter('');
    setSearchQuery('');
  };

  // Filter candidates based on search query, status, and position
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = searchQuery === '' || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.phone.includes(searchQuery) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === '' || candidate.status === statusFilter;
    const matchesPosition = positionFilter === '' || candidate.position === positionFilter;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const statusOptions = ['New', 'Selected', 'Rejected'];
  const positionOptions = ['Senior Developer', 'Human Resource Lead', 'Full Time Designer', 'Full Time Developer'];

  // Global click handler to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-badge') && !event.target.closest('.status-dropdown-menu')) {
        setShowStatusDropdown(null);
      }
      
      if (!event.target.closest('.action-menu-container') && !event.target.closest('.action-dropdown-menu')) {
        setShowActionMenu(null);
      }
      
      if (!event.target.closest('.filter-dropdown') && !event.target.closest('.filter-dropdown-menu')) {
        setShowStatusFilterDropdown(false);
        setShowPositionFilterDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="panel candidates-panel">
      <div className="panel-header">
        <h2>Candidates</h2>
        <div className="panel-actions">
          <div className="filter-dropdown">
            <button 
              className="filter-button"
              onClick={(e) => {
                e.stopPropagation();
                toggleStatusFilterDropdown(e);
              }}
            >
              Status <FilterIcon />
            </button>
            {showStatusFilterDropdown && (
              <div className="filter-dropdown-menu">
                <div className="filter-option" onClick={() => filterByStatus('')}>
                  All Statuses
                </div>
                {statusOptions.map(status => (
                  <div 
                    key={status} 
                    className={`filter-option ${statusFilter === status ? 'selected' : ''}`}
                    onClick={() => filterByStatus(status)}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="filter-dropdown">
            <button 
              className="filter-button"
              onClick={(e) => {
                e.stopPropagation();
                togglePositionFilterDropdown(e);
              }}
            >
              Position <FilterIcon />
            </button>
            {showPositionFilterDropdown && (
              <div className="filter-dropdown-menu">
                <div className="filter-option" onClick={() => filterByPosition('')}>
                  All Positions
                </div>
                {positionOptions.map(position => (
                  <div 
                    key={position} 
                    className={`filter-option ${positionFilter === position ? 'selected' : ''}`}
                    onClick={() => filterByPosition(position)}
                  >
                    {position}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="search-container">
            <SearchIcon />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="add-button" onClick={handleAddCandidate}>
            Add Candidate
          </button>
        </div>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Candidates Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.id}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>{candidate.position}</td>
                  <td>
                    <div 
                      className={`status-badge ${candidate.status.toLowerCase()}`}
                      onClick={(e) => toggleStatusDropdown(candidate.id, e)}
                    >
                      {getStatusBadge(candidate.status)}
                      <span className="status-text">{candidate.status}</span>
                      <ChevronDownIcon isOpen={showStatusDropdown === candidate.id} />
                      
                      {showStatusDropdown === candidate.id && (
                        <div className="status-dropdown-menu">
                          {statusOptions.map(status => (
                            <div 
                              key={status}
                              className={`status-option ${candidate.status === status ? 'active' : ''}`}
                              onClick={() => updateCandidateStatus(candidate.id, status)}
                            >
                              {getStatusBadge(status)}
                              <span>{status}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{candidate.experience}</td>
                  <td>
                    <div className="action-menu-container">
                      <button 
                        className="action-icon-button" 
                        onClick={(e) => toggleActionMenu(candidate.id, e)}
                      >
                        <MoreIcon />
                      </button>
                      
                      {showActionMenu === candidate.id && (
                        <div className="action-dropdown-menu">
                          {candidate.resume && (
                            <div 
                              className="action-option download-option"
                              onClick={() => downloadResume(candidate.resume, candidate.name)}
                            >
                              <span>Download Resume</span>
                            </div>
                          )}
                          <div 
                            className="action-option delete"
                            onClick={() => confirmDeleteCandidate(candidate.id)}
                          >
                            <span>Delete Candidate</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">No candidates found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Candidate Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Candidate</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSaveCandidate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name*</label>
                  <input 
                    type="text" 
                    value={currentCandidate.name}
                    onChange={(e) => setCurrentCandidate({...currentCandidate, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address*</label>
                  <input 
                    type="email"
                    value={currentCandidate.email}
                    onChange={(e) => setCurrentCandidate({...currentCandidate, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number*</label>
                  <input 
                    type="tel"
                    value={currentCandidate.phone}
                    onChange={(e) => setCurrentCandidate({...currentCandidate, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Position*</label>
                  <select
                    value={currentCandidate.position}
                    onChange={(e) => setCurrentCandidate({...currentCandidate, position: e.target.value})}
                    required
                  >
                    <option value="">Select Position</option>
                    {positionOptions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Experience*</label>
                  <select
                    value={currentCandidate.experience}
                    onChange={(e) => setCurrentCandidate({...currentCandidate, experience: e.target.value})}
                    required
                  >
                    <option value="">Select Experience</option>
                    <option value="0">0</option>
                    <option value="1+">1+</option>
                    <option value="2+">2+</option>
                    <option value="3+">3+</option>
                    <option value="5+">5+</option>
                    <option value="10+">10+</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Resume*</label>
                  <div className="file-input-wrapper">
                    <input 
                      type="text"
                      placeholder="Upload resume"
                      value={currentCandidate.resume}
                      readOnly
                    />
                    <button 
                      type="button"
                      className="upload-button"
                      onClick={() => {
                        const fileName = `${currentCandidate.name.replace(/\s+/g, '_') || 'Resume'}_${Date.now()}.pdf`;
                        setCurrentCandidate({...currentCandidate, resume: fileName});
                      }}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>I hereby declare that the above information is true to the best of my knowledge and belief.</span>
                </label>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && candidateToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header delete-modal-header">
              <h3>Delete Candidate</h3>
              <button className="close-button" onClick={() => setShowDeleteModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="delete-modal-content">
              <p>Are you sure you want to delete <strong>{candidateToDelete.name}</strong>?</p>
              <p className="delete-warning-text">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-button" 
                onClick={deleteCandidate}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Progress Modal */}
      {downloadStatus.isDownloading && downloadedFile && (
        <div className="modal-overlay download-overlay">
          <div className="download-modal">
            <h3>Downloading Resume</h3>
            <p><strong>{downloadedFile.candidateName}'s Resume</strong></p>
            <p className="file-name">{downloadedFile.resume}</p>
            <div className="download-progress-container">
              <div 
                className="download-progress-bar" 
                style={{ width: `${downloadStatus.progress}%` }}
              ></div>
            </div>
            <div className="download-progress-text">
              {downloadStatus.progress}% Complete
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ show: false, message: '', type: 'success' })} 
        />
      )}

      <style jsx>{`
        .panel {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          padding: 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
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
          gap: 10px;
        }
        
        .filter-dropdown {
          position: relative;
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
          gap: 5px;
        }
        
        .filter-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          min-width: 160px;
          padding: 5px 0;
          margin: 2px 0 0;
          background-color: #fff;
          border: 1px solid rgba(0,0,0,.15);
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0,0,0,.175);
        }
        
        .filter-option {
          padding: 6px 12px;
          cursor: pointer;
        }
        
        .filter-option:hover {
          background-color: #f5f5f5;
        }
        
        .filter-option.selected {
          background-color: rgba(88, 0, 128, 0.1);
          color: #580080;
        }
        
        .search-container {
          display: flex;
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 4px;
          padding: 0 10px;
          flex: 1;
          max-width: 300px;
        }
        
        .search-input {
          border: none;
          background: transparent;
          padding: 8px;
          width: 100%;
          outline: none;
        }
        
        .add-button {
          background-color: #580080;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 15px;
          font-size: 14px;
          cursor: pointer;
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
        }
        
        .data-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 13px;
          position: relative;
          cursor: pointer;
          user-select: none;
        }
        
        .status-badge.new {
          background-color: rgba(46, 125, 50, 0.1);
          color: #2e7d32;
        }
        
        .status-badge.selected {
          background-color: rgba(21, 101, 192, 0.1);
          color: #1565c0;
        }
        
        .status-badge.rejected {
          background-color: rgba(198, 40, 40, 0.1);
          color: #c62828;
        }
        
        .status-icon {
          width: 20px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 5px;
          border-radius: 50%;
          font-weight: bold;
          font-size: 12px;
        }
        
        .new-icon {
          background-color: #2e7d32;
          color: white;
        }
        
        .selected-icon {
          background-color: #1565c0;
          color: white;
        }
        
        .rejected-icon {
          background-color: #c62828;
          color: white;
        }
        
        .status-text {
          margin-left: 5px;
          margin-right: 5px;
        }
        
        .status-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          min-width: 120px;
          margin-top: 5px;
          padding: 5px 0;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .status-option {
          display: flex;
          align-items: center;
          padding: 8px 10px;
          cursor: pointer;
        }
        
        .status-option:hover {
          background-color: #f5f5f5;
        }
        
        .status-option.active {
          background-color: #f5f5f5;
        }
        
        .action-menu-container {
          position: relative;
        }
        
        .action-icon-button {
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .action-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1000;
          min-width: 180px;
          margin-top: 5px;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .action-option {
          padding: 10px 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        
        .action-option:hover {
          background-color: #f5f5f5;
        }
        
        .action-option.delete {
          color: #c62828;
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
          z-index: 2000;
        }
        
        .modal {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          width: 600px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalFadeIn 0.3s ease;
        }
        
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background-color: #580080;
          color: white;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        
        .close-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }
        
        .modal-form {
          padding: 20px;
        }
        
        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .file-input-wrapper {
          display: flex;
          align-items: center;
        }
        
        .file-input-wrapper input {
          flex: 1;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        
        .upload-button {
          padding: 9px 15px;
          background-color: #580080;
          color: white;
          border: none;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          cursor: pointer;
        }
        
        .checkbox-group {
          margin-bottom: 20px;
        }
        
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .save-button {
          padding: 8px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .cancel-button {
          padding: 8px 20px;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .delete-modal {
          width: 400px;
        }
        
        .delete-modal-header {
          background-color: #c62828;
        }
        
        .delete-modal-content {
          padding: 20px;
        }
        
        .delete-warning-text {
          color: #c62828;
          font-size: 14px;
          margin-top: 10px;
        }
        
        .delete-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 10px 20px 20px;
        }
        
        .delete-button {
          padding: 8px 20px;
          background-color: #c62828;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .download-modal {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          width: 400px;
          text-align: center;
        }
        
        .file-name {
          color: #777;
          margin-bottom: 15px;
        }
        
        .download-progress-container {
          width: 100%;
          height: 8px;
          background-color: #f5f5f5;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        
        .download-progress-bar {
          height: 100%;
          background-color: #4caf50;
          transition: width 0.2s;
        }
        
        .download-progress-text {
          font-size: 14px;
          color: #4caf50;
        }
        
        .toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          min-width: 300px;
          padding: 15px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 3000;
          animation: toastFadeIn 0.3s ease;
        }
        
        @keyframes toastFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .toast.success {
          background-color: #e8f5e9;
          border-left: 4px solid #4caf50;
          color: #2e7d32;
        }
        
        .toast.error {
          background-color: #ffebee;
          border-left: 4px solid #f44336;
          color: #c62828;
        }
        
        .toast-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          color: inherit;
          opacity: 0.7;
        }
        
        .toast-close:hover {
          opacity: 1;
        }
        
        .no-data {
          text-align: center;
          padding: 20px;
          color: #777;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 15px;
          }
          
          .panel-actions {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default CandidatesPanel;