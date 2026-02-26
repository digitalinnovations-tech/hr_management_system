/**
 * Application constants
 */

// Authentication
export const AUTH_CONSTANTS = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-replace-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  PASSWORD_RESET_EXPIRES: 60 * 60 * 1000, // 1 hour in milliseconds
  BCRYPT_SALT_ROUNDS: 12,
  COOKIE_EXPIRES_IN_DAYS: 7,
  TOKEN_EXPIRY_WARNING: 5 * 60 * 1000, // 5 minutes in milliseconds
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  HR_MANAGER: 'hr_manager',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

// Employee status
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  TERMINATED: 'terminated',
  PROBATION: 'probation',
};

// Leave types
export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  PERSONAL: 'personal',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  UNPAID: 'unpaid',
  BEREAVEMENT: 'bereavement',
};

// Leave status
export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

// Attendance status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  ON_LEAVE: 'on_leave',
  WEEKEND: 'weekend',
  HOLIDAY: 'holiday',
};

// Candidate status
export const CANDIDATE_STATUS = {
  NEW: 'new',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  TECHNICAL: 'technical',
  HR_ROUND: 'hr_round',
  OFFERED: 'offered',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
};

// Upload directory
export const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// Upload file size limits (in bytes)
export const UPLOAD_LIMITS = {
  PROFILE_PICTURE: 5 * 1024 * 1024, // 5MB
  RESUME: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 20 * 1024 * 1024, // 20MB
};

// Email templates
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
  LEAVE_REQUEST: 'leave-request',
  LEAVE_APPROVAL: 'leave-approval',
  LEAVE_REJECTION: 'leave-rejection',
};

// Export all constants
export default {
  AUTH_CONSTANTS,
  PAGINATION,
  USER_ROLES,
  EMPLOYEE_STATUS,
  LEAVE_TYPES,
  LEAVE_STATUS,
  ATTENDANCE_STATUS,
  CANDIDATE_STATUS,
  UPLOAD_DIR,
  UPLOAD_LIMITS,
  EMAIL_TEMPLATES,
}; 