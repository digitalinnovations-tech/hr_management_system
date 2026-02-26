import Employee from '../models/employeeModel.js';

/**
 * Generate a unique employee ID
 * Format: EMP-YYYY-XXXX where YYYY is current year and XXXX is a sequential number
 */
export const generateEmployeeId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `EMP-${currentYear}-`;
  
  // Find the highest existing employee ID with the current year prefix
  const highestEmployee = await Employee.findOne(
    { employeeId: { $regex: `^${prefix}` } },
    { employeeId: 1 },
    { sort: { employeeId: -1 } }
  );
  
  let newNumber = 1;
  
  if (highestEmployee && highestEmployee.employeeId) {
    // Extract the number from the highest employee ID
    const highestNumber = parseInt(highestEmployee.employeeId.split('-')[2]);
    newNumber = highestNumber + 1;
  }
  
  // Pad the number with leading zeros to make it 4 digits
  const paddedNumber = newNumber.toString().padStart(4, '0');
  
  return `${prefix}${paddedNumber}`;
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}; 