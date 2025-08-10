// Comprehensive Attendance Management Types
// Configuration Constants
export const ATTENDANCE_CONFIG = {
  // Time tracking settings
  OVERTIME_THRESHOLD: 40, // hours per week
  OVERTIME_MULTIPLIER: 1.5,
  BREAK_DURATION: 30, // minutes
  GRACE_PERIOD: 15, // minutes for late clock-in

  // Location settings
  LOCATION_RADIUS: 100, // meters for geofencing
  LOCATION_REQUIRED: true,

  // Payroll settings
  PAY_FREQUENCY: "bi-weekly", // weekly, bi-weekly, monthly
  TAX_RATE: 0.15, // 15% default tax rate

  // Notification settings
  REMINDER_INTERVALS: [15, 30, 60], // minutes before shift
  MAX_RETRY_ATTEMPTS: 3,

  // Report settings
  REPORT_RETENTION_DAYS: 2555, // 7 years
  EXPORT_FORMATS: ["pdf", "excel", "csv"],

  // Security settings
  SESSION_TIMEOUT: 480, // minutes (8 hours)
  PASSWORD_EXPIRY_DAYS: 90,
  MAX_LOGIN_ATTEMPTS: 5,
};
