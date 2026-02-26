/**
 * Common utility functions for backend
 */

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format datetime to YYYY-MM-DD HH:MM:SS
 * @param {Date} date - Date to format
 * @returns {string} - Formatted datetime
 */
export const formatDateTime = (date) => {
  const d = new Date(date);
  const formattedDate = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${formattedDate} ${hours}:${minutes}:${seconds}`;
};

/**
 * Get date range between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} - Array of dates in the range
 */
export const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  
  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

/**
 * Calculate the number of working days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Array} holidays - Array of holiday dates
 * @returns {number} - Number of working days
 */
export const calculateWorkingDays = (startDate, endDate, holidays = []) => {
  const dateRange = getDateRange(startDate, endDate);
  
  // Convert holidays to strings for easier comparison
  const holidayStrings = holidays.map(day => formatDate(day));
  
  // Filter out weekends and holidays
  const workingDays = dateRange.filter(date => {
    const day = date.getDay();
    const dateString = formatDate(date);
    
    // Exclude weekends (0 = Sunday, 6 = Saturday)
    const isWeekend = day === 0 || day === 6;
    // Exclude holidays
    const isHoliday = holidayStrings.includes(dateString);
    
    return !isWeekend && !isHoliday;
  });
  
  return workingDays.length;
};

/**
 * Generate a random alphanumeric string
 * @param {number} length - Length of the string
 * @returns {string} - Random string
 */
export const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * Paginate array results
 * @param {Array} array - Array to paginate
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {Object} - Paginated results
 */
export const paginateResults = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = array.length;
  
  const results = {
    data: array.slice(startIndex, endIndex),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: endIndex < total,
      hasPrev: startIndex > 0
    }
  };
  
  return results;
};

/**
 * Sanitize object properties (remove undefined, null, empty strings)
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
export const sanitizeObject = (obj) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Convert array to CSV string
 * @param {Array} array - Array of objects to convert
 * @param {Array} fields - Fields to include in CSV
 * @returns {string} - CSV string
 */
export const arrayToCSV = (array, fields) => {
  if (!array.length) return '';
  
  // Get headers from fields or object keys
  const headers = fields || Object.keys(array[0]);
  
  // Create header row
  const csvRows = [headers.join(',')];
  
  // Add data rows
  for (const item of array) {
    const values = headers.map(header => {
      const value = item[header];
      // Handle strings with commas by wrapping in quotes
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"`
        : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

export default {
  formatDate,
  formatDateTime,
  getDateRange,
  calculateWorkingDays,
  generateRandomString,
  paginateResults,
  sanitizeObject,
  arrayToCSV
}; 