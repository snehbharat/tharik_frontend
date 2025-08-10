// Application Constants for AMOAGC Platform

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Authentication Constants
export const AUTH_CONFIG = {
  TOKEN_KEY: 'amoagc_token',
  REFRESH_TOKEN_KEY: 'amoagc_refresh_token',
  USER_KEY: 'amoagc_user',
  EXPIRY_KEY: 'amoagc_expiry',
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours
  REFRESH_THRESHOLD: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
};

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  PROJECTS: '/projects',
  ATTENDANCE: '/attendance',
  FINANCIAL: '/financial',
  INTEGRATIONS: '/integrations',
  SETTINGS: '/settings',
  PROFILE: '/profile',
};

// User Roles and Permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  HR_MANAGER: 'hr_manager',
  OPERATIONS_SUPERVISOR: 'operations_supervisor',
  FINANCE_CLERK: 'finance_clerk',
  EMPLOYEE: 'employee',
};

export const PERMISSIONS = {
  // Dashboard permissions
  DASHBOARD_VIEW: 'dashboard.view',
  DASHBOARD_VIEW_ALL: 'dashboard.view_all',
  
  // Employee permissions
  EMPLOYEES_VIEW: 'employees.view',
  EMPLOYEES_CREATE: 'employees.create',
  EMPLOYEES_UPDATE: 'employees.update',
  EMPLOYEES_DELETE: 'employees.delete',
  
  // Project permissions
  PROJECTS_VIEW: 'projects.view',
  PROJECTS_CREATE: 'projects.create',
  PROJECTS_UPDATE: 'projects.update',
  PROJECTS_DELETE: 'projects.delete',
  
  // Financial permissions
  FINANCIAL_VIEW: 'financial.view',
  FINANCIAL_MANAGE: 'financial.manage',
  
  // Integration permissions
  INTEGRATIONS_VIEW: 'integrations.view',
  INTEGRATIONS_MANAGE: 'integrations.manage',
  
  // Admin permissions
  ADMIN_USERS: 'admin.users',
  ADMIN_ROLES: 'admin.roles',
  ADMIN_SYSTEM: 'admin.system',
};

// Business Constants
export const BUSINESS_RULES = {
  // Saudi Labor Law Compliance
  MINIMUM_WAGE: 18.00, // SAR per hour
  MAXIMUM_WAGE: 500.00, // SAR per hour
  OVERTIME_MULTIPLIER: 1.5,
  STANDARD_HOURS_PER_MONTH: 176,
  WORKING_DAYS_PER_MONTH: 22,
  HOURS_PER_DAY: 8,
  
  // VAT and Tax
  VAT_RATE: 0.15, // 15%
  GOSI_CONTRIBUTION_RATE: 0.11, // 11%
  
  // Document Expiry Warnings
  DOCUMENT_EXPIRY_WARNING_DAYS: [90, 60, 30, 15, 7],
  
  // Performance Ratings
  PERFORMANCE_SCALE: {
    MIN: 0,
    MAX: 100,
    EXCELLENT: 90,
    GOOD: 75,
    SATISFACTORY: 60,
    NEEDS_IMPROVEMENT: 40,
  },
};

// UI Constants
export const UI_CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  
  // Notifications
  NOTIFICATION_TIMEOUT: 5000,
  MAX_NOTIFICATIONS: 50,
  
  // Charts
  CHART_COLORS: [
    '#10B981', // Green
    '#3B82F6', // Blue
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
  ],
  
  // Responsive Breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
};

// Date and Time Constants
export const DATE_CONFIG = {
  DEFAULT_FORMAT: 'YYYY-MM-DD',
  DISPLAY_FORMAT: 'DD/MM/YYYY',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TIME_FORMAT: 'HH:mm',
  
  // Locales
  LOCALES: {
    EN: 'en-US',
    AR: 'ar-SA',
  },
  
  // Timezone
  DEFAULT_TIMEZONE: 'Asia/Riyadh',
};

// Currency Configuration
export const CURRENCY_CONFIG = {
  DEFAULT_CURRENCY: 'SAR',
  DECIMAL_PLACES: 2,
  THOUSAND_SEPARATOR: ',',
  DECIMAL_SEPARATOR: '.',
  
  // Formatting options
  FORMAT_OPTIONS: {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
};

// Integration Constants
export const INTEGRATION_CONFIG = {
  ZATCA: {
    NAME: 'ZATCA E-Invoicing',
    TYPE: 'zatca',
    SANDBOX_URL: 'https://api-sandbox.zatca.gov.sa',
    PRODUCTION_URL: 'https://api.zatca.gov.sa',
  },
  GOSI: {
    NAME: 'GOSI Social Insurance',
    TYPE: 'gosi',
    SANDBOX_URL: 'https://api-sandbox.gosi.gov.sa',
    PRODUCTION_URL: 'https://api.gosi.gov.sa',
  },
  QIWA: {
    NAME: 'QIWA Labor Platform',
    TYPE: 'qiwa',
    SANDBOX_URL: 'https://api-sandbox.qiwa.sa',
    PRODUCTION_URL: 'https://api.qiwa.sa',
  },
  BANKING: {
    NAME: 'Saudi Banking API',
    TYPE: 'banking',
    SANDBOX_URL: 'https://api-sandbox.saudipayments.sa',
    PRODUCTION_URL: 'https://api.saudipayments.sa',
  },
};

// Validation Rules
export const VALIDATION_RULES = {
  // Employee validation
  EMPLOYEE_ID: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9]+$/,
  },
  
  // Phone number validation (Saudi format)
  PHONE_NUMBER: {
    PATTERN: /^\+966[0-9]{9}$/,
    EXAMPLE: '+966501234567',
  },
  
  // Email validation
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  
  // Password validation
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
  
  // Financial validation
  HOURLY_RATE: {
    MIN: 18.00,
    MAX: 500.00,
    DECIMAL_PLACES: 2,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid username or password',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  ACCESS_DENIED: 'You do not have permission to access this resource',
  
  // Validation errors
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid Saudi phone number (+966XXXXXXXXX)',
  PASSWORD_TOO_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters',
  
  // Business rule errors
  BELOW_MINIMUM_WAGE: 'Hourly rate cannot be below Saudi minimum wage (18.00 SAR)',
  ABOVE_MAXIMUM_WAGE: 'Hourly rate cannot exceed maximum limit (500.00 SAR)',
  INVALID_DATE_RANGE: 'End date must be after start date',
  
  // System errors
  NETWORK_ERROR: 'Unable to connect to server. Please check your internet connection.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 10MB',
  INVALID_FILE_TYPE: 'File type not supported. Please upload PDF, DOC, or image files.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  EMPLOYEE_CREATED: 'Employee created successfully',
  EMPLOYEE_UPDATED: 'Employee updated successfully',
  EMPLOYEE_DELETED: 'Employee deleted successfully',
  PROJECT_CREATED: 'Project created successfully',
  PROJECT_UPDATED: 'Project updated successfully',
  ATTENDANCE_RECORDED: 'Attendance recorded successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  NOTIFICATION_SENT: 'Notification sent successfully',
};

// Application Metadata
export const APP_CONFIG = {
  NAME: 'AMOAGC Al-Majmaah',
  NAME_AR: 'أموجك المجمعة',
  DESCRIPTION: 'Operations & General Contracting',
  DESCRIPTION_AR: 'العمليات والمقاولات العامة',
  VERSION: '1.0.0',
  COMPANY: {
    CR_NUMBER: '1010123456',
    VAT_NUMBER: '300123456789003',
    PHONE: '+966 11 234 5678',
    EMAIL: 'info@amoagc.sa',
    ADDRESS: 'King Abdulaziz Road, Al-Majmaah 11952, Saudi Arabia',
    ADDRESS_AR: 'شارع الملك عبدالعزيز، المجمعة 11952، المملكة العربية السعودية',
  },
};

// Export all constants as a single object for easy importing
export const CONSTANTS = {
  API_CONFIG,
  AUTH_CONFIG,
  ROUTES,
  USER_ROLES,
  PERMISSIONS,
  BUSINESS_RULES,
  UI_CONFIG,
  DATE_CONFIG,
  CURRENCY_CONFIG,
  INTEGRATION_CONFIG,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  APP_CONFIG,
};

export default CONSTANTS;