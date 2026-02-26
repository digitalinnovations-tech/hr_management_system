import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

/**
 * Generic validation middleware
 * @param {Array} validations - Array of validation rules
 * @returns {Function} - Express middleware function
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check if there are errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    // Return error response
    return next(new AppError('Validation failed', 400, formattedErrors));
  };
};

// Common validation rules
export const commonValidators = {
  // ID validation
  id: () => param('id')
    .notEmpty().withMessage('ID is required')
    .isMongoId().withMessage('Invalid ID format'),
  
  // Email validation
  email: () => body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  // Password validation
  password: () => body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  // Name validation
  name: (field = 'name') => body(field)
    .notEmpty().withMessage(`${field} is required`)
    .isLength({ min: 2, max: 50 }).withMessage(`${field} must be between 2 and 50 characters`)
    .matches(/^[a-zA-Z\s-]+$/).withMessage(`${field} must contain only letters, spaces, and hyphens`),
  
  // Date validation
  date: (field = 'date') => body(field)
    .notEmpty().withMessage(`${field} is required`)
    .isISO8601().withMessage(`${field} must be a valid date in ISO format`)
    .toDate(),
  
  // Pagination validation
  pagination: () => [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
      .toInt()
  ],
  
  // Phone validation
  phone: (field = 'phone') => body(field)
    .notEmpty().withMessage(`${field} is required`)
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).withMessage(`${field} must be a valid phone number`),
  
  // Number validation
  number: (field, options = {}) => {
    const { min, max, required = true } = options;
    let validator = body(field);
    
    if (required) {
      validator = validator.notEmpty().withMessage(`${field} is required`);
    } else {
      validator = validator.optional();
    }
    
    validator = validator.isNumeric().withMessage(`${field} must be a number`);
    
    if (min !== undefined) {
      validator = validator.isFloat({ min }).withMessage(`${field} must be at least ${min}`);
    }
    
    if (max !== undefined) {
      validator = validator.isFloat({ max }).withMessage(`${field} must be at most ${max}`);
    }
    
    return validator.toFloat();
  },
  
  // Boolean validation
  boolean: (field) => body(field)
    .optional()
    .isBoolean().withMessage(`${field} must be a boolean value`)
    .toBoolean(),
  
  // Enum validation
  enum: (field, values, required = true) => {
    let validator = body(field);
    
    if (required) {
      validator = validator.notEmpty().withMessage(`${field} is required`);
    } else {
      validator = validator.optional();
    }
    
    return validator.isIn(values).withMessage(`${field} must be one of: ${values.join(', ')}`);
  },
  
  // Array validation
  array: (field, required = true) => {
    let validator = body(field);
    
    if (required) {
      validator = validator.notEmpty().withMessage(`${field} is required`);
    } else {
      validator = validator.optional();
    }
    
    return validator.isArray().withMessage(`${field} must be an array`);
  }
};

export default validate; 