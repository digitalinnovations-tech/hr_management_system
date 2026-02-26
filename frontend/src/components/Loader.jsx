import React from 'react';
import '../styles/Loader.css';

/**
 * Reusable Loader component
 * @param {Object} props
 * @param {string} props.size - Size of the loader (small, medium, large)
 * @param {string} props.color - Color of the loader (primary, secondary, success, danger)
 * @param {string} props.type - Type of loader (spinner, dots, pulse)
 * @param {string} props.text - Optional text to display below the loader
 * @param {boolean} props.fullScreen - Whether to display the loader full screen
 */
const Loader = ({
  size = 'medium',
  color = 'primary',
  type = 'spinner',
  text,
  fullScreen = false
}) => {
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`loader-dots loader-${size} loader-${color}`}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        );
      case 'pulse':
        return (
          <div className={`loader-pulse loader-${size} loader-${color}`}></div>
        );
      case 'spinner':
      default:
        return (
          <div className={`loader-spinner loader-${size} loader-${color}`}></div>
        );
    }
  };

  const loader = (
    <div className="loader-container">
      {renderLoader()}
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader; 