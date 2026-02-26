import React from 'react';
import '../styles/Button.css';

/**
 * Reusable Button component
 * @param {Object} props
 * @param {String} props.variant - Button variant (primary, secondary, danger, success, text)
 * @param {String} props.size - Button size (small, medium, large)
 * @param {Boolean} props.fullWidth - Whether button should take full width
 * @param {Function} props.onClick - Click handler
 * @param {String} props.type - Button type (button, submit, reset)
 * @param {Boolean} props.disabled - Whether button is disabled
 * @param {ReactNode} props.children - Button content
 * @param {String} props.className - Additional class names
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  children,
  className = '',
  ...rest
}) => {
  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button; 