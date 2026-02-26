import React from 'react';
import '../styles/Modal.css';

/**
 * Reusable Modal component
 * @param {Object} props
 * @param {string} props.title - Modal title
 * @param {ReactNode} props.children - Modal content
 * @param {function} props.onClose - Close callback
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Object} props.actions - Action buttons {label, onClick, variant}
 * @param {string} props.size - Modal size (small, medium, large)
 */
const Modal = ({ 
  title, 
  children, 
  onClose, 
  isOpen = true,
  actions = [],
  size = 'medium'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal modal-${size}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
        {actions.length > 0 && (
          <div className="modal-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`modal-button ${action.variant || 'default'}`}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 