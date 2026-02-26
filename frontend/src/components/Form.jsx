import React, { useState } from 'react';
import '../styles/Form.css';

/**
 * Reusable Form component
 * @param {Object} props
 * @param {Array} props.fields - Form field configurations
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.onSubmit - Form submit handler
 * @param {String} props.submitLabel - Submit button label
 * @param {Function} props.validate - Custom validation function
 * @param {Boolean} props.disabled - Disable the form
 */
const Form = ({
  fields = [],
  initialValues = {},
  onSubmit,
  submitLabel = 'Submit',
  validate,
  disabled = false,
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: fieldValue
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    validateField(name, values[name]);
  };

  const validateField = (name, value) => {
    // Find the field configuration
    const field = fields.find(f => f.name === name);
    if (!field || !field.validation) return true;
    
    // Check required
    if (field.validation.required && 
        (value === undefined || value === null || value === '')) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: field.validation.required === true 
          ? 'This field is required' 
          : field.validation.required 
      }));
      return false;
    }
    
    // Check min length
    if (field.validation.minLength && value.length < field.validation.minLength) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: `Minimum ${field.validation.minLength} characters required`
      }));
      return false;
    }
    
    // Check pattern
    if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: field.validation.patternMessage || 'Invalid format'
      }));
      return false;
    }
    
    // Field is valid
    setErrors(prev => ({ ...prev, [name]: null }));
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    // Validate each field
    for (const field of fields) {
      const isFieldValid = validateField(field.name, values[field.name]);
      if (!isFieldValid) {
        isValid = false;
      }
    }
    
    // Custom validation if provided
    if (validate && isValid) {
      const customErrors = validate(values);
      if (customErrors && Object.keys(customErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...customErrors }));
        isValid = false;
      }
    }
    
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields
    const isValid = validateForm();
    
    if (isValid && onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {fields.map((field) => {
        const error = touched[field.name] && errors[field.name];
        
        switch (field.type) {
          case 'text':
          case 'email':
          case 'password':
          case 'number':
          case 'date':
            return (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>{field.label}
                  {field.validation?.required && <span className="required">*</span>}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={values[field.name] || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={field.placeholder}
                  disabled={disabled || field.disabled}
                  className={error ? 'error' : ''}
                />
                {error && <div className="error-message">{error}</div>}
              </div>
            );
            
          case 'textarea':
            return (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>{field.label}
                  {field.validation?.required && <span className="required">*</span>}
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={values[field.name] || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={field.placeholder}
                  disabled={disabled || field.disabled}
                  rows={field.rows || 3}
                  className={error ? 'error' : ''}
                />
                {error && <div className="error-message">{error}</div>}
              </div>
            );
            
          case 'select':
            return (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>{field.label}
                  {field.validation?.required && <span className="required">*</span>}
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={values[field.name] || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={disabled || field.disabled}
                  className={error ? 'error' : ''}
                >
                  {field.placeholder && (
                    <option value="" disabled>
                      {field.placeholder}
                    </option>
                  )}
                  {field.options.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                {error && <div className="error-message">{error}</div>}
              </div>
            );
            
          case 'checkbox':
            return (
              <div key={field.name} className="form-group checkbox-group">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    checked={values[field.name] || false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled || field.disabled}
                  />
                  <label htmlFor={field.name}>
                    {field.label}
                    {field.validation?.required && <span className="required">*</span>}
                  </label>
                </div>
                {error && <div className="error-message">{error}</div>}
              </div>
            );
            
          default:
            return null;
        }
      })}
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-button"
          disabled={disabled}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default Form; 