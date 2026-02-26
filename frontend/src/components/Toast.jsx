import React, { useState, useEffect } from 'react';
import '../styles/Toast.css';

/**
 * Individual Toast component
 */
const ToastItem = ({ id, message, type, onClose, autoClose = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    // Auto close if enabled
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(id);
    }, 300); // Wait for animation to complete
  };
  
  return (
    <div 
      className={`toast-item toast-${type} ${isVisible ? 'visible' : ''}`}
      role="alert"
    >
      <div className="toast-content">
        <div className="toast-message">{message}</div>
      </div>
      <button 
        className="toast-close"
        onClick={handleClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

/**
 * Toast Container Component
 * Manages multiple toast notifications
 */
const ToastContainer = ({ position = 'top-right' }) => {
  const [toasts, setToasts] = useState([]);
  
  // Create a globally accessible method to show toasts
  if (!window.toast) {
    window.toast = {
      show: (message, type = 'info', options = {}) => {
        const id = Date.now().toString();
        setToasts(prevToasts => [
          ...prevToasts,
          { id, message, type, ...options }
        ]);
        return id;
      },
      success: (message, options = {}) => {
        return window.toast.show(message, 'success', options);
      },
      error: (message, options = {}) => {
        return window.toast.show(message, 'error', options);
      },
      warning: (message, options = {}) => {
        return window.toast.show(message, 'warning', options);
      },
      info: (message, options = {}) => {
        return window.toast.show(message, 'info', options);
      },
      remove: (id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
      },
      clear: () => {
        setToasts([]);
      }
    };
  }
  
  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  
  return (
    <div className={`toast-container toast-${position}`}>
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
          autoClose={toast.autoClose !== undefined ? toast.autoClose : true}
          duration={toast.duration || 5000}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 