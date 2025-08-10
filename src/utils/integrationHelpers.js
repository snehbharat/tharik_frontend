// Integration Helper Utilities
// Utilities for managing frontend-backend integration and data synchronization

import { apiClient } from "../services/ApiClient";

export class IntegrationHelpers {
  // Data synchronization utilities
  static async syncLocalDataWithBackend() {
    const results = {
      employees: false,
      projects: false,
      attendance: false,
      integrations: false,
    };

    try {
      // Sync employees
      const localEmployees = JSON.parse(
        localStorage.getItem("workforce_employees") || "[]"
      );
      if (localEmployees.length > 0) {
        const response = await apiClient.post("/api/employees/bulk", {
          employees: localEmployees,
        });
        results.employees = response.success;
      }

      // Sync projects
      const localProjects = JSON.parse(
        localStorage.getItem("workforce_projects") || "[]"
      );
      if (localProjects.length > 0) {
        const response = await apiClient.post("/api/projects/bulk", {
          projects: localProjects,
        });
        results.projects = response.success;
      }

      // Sync attendance
      const localAttendance = JSON.parse(
        localStorage.getItem("workforce_attendance") || "[]"
      );
      if (localAttendance.length > 0) {
        const response = await apiClient.post("/api/attendance/bulk", {
          attendance: localAttendance,
        });
        results.attendance = response.success;
      }

      // Sync integrations
      const localIntegrations = JSON.parse(
        localStorage.getItem("integrations_config") || "[]"
      );
      if (localIntegrations.length > 0) {
        const response = await apiClient.post("/api/integrations/sync", {
          integrations: localIntegrations,
        });
        results.integrations = response.success;
      }
    } catch (error) {
      console.error("Data synchronization failed:", error);
    }

    return results;
  }

  // Backend data fetching with fallback
  static async fetchWithFallback(endpoint, fallbackData, cacheKey) {
    try {
      const response = await apiClient.get(endpoint);

      if (response.success && response.data) {
        // Cache successful response
        if (cacheKey) {
          localStorage.setItem(cacheKey, JSON.stringify(response.data));
        }
        return response.data;
      }

      return fallbackData;
    } catch (error) {
      console.warn(`API call failed for ${endpoint}, using fallback data`);

      // Try to get cached data first
      if (cacheKey) {
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            return JSON.parse(cached);
          }
        } catch (cacheError) {
          console.warn("Failed to parse cached data");
        }
      }

      return fallbackData;
    }
  }

  // Validate API response structure
  static validateApiResponse(response, expectedFields) {
    if (!response || typeof response !== "object") {
      return false;
    }

    // Check required API response fields
    if (!("success" in response)) {
      return false;
    }

    // If success is true, data should be present
    if (response.success && !("data" in response)) {
      return false;
    }

    // Validate expected fields in data
    if (response.data && expectedFields.length > 0) {
      const hasAllFields = expectedFields.every(
        (field) =>
          field in response.data ||
          (Array.isArray(response.data) &&
            response.data.length > 0 &&
            field in response.data[0])
      );

      if (!hasAllFields) {
        console.warn("API response missing expected fields:", expectedFields);
      }
    }

    return true;
  }

  // Handle API errors gracefully
  static handleApiError(error, context = "API call") {
    console.error(`${context} failed:`, error);

    // Network errors (backend unavailable)
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      return {
        message: "Backend server is not available. Using mock data.",
        shouldRetry: true,
        isTemporary: true,
      };
    }

    // Authentication errors
    if (error.statusCode === 401) {
      return {
        message: "Authentication required. Please log in again.",
        shouldRetry: false,
        isTemporary: false,
      };
    }

    // Authorization errors
    if (error.statusCode === 403) {
      return {
        message: "You do not have permission to perform this action.",
        shouldRetry: false,
        isTemporary: false,
      };
    }

    // Server errors
    if (error.statusCode >= 500) {
      return {
        message: "Server error occurred. Please try again later.",
        shouldRetry: true,
        isTemporary: true,
      };
    }

    // Client errors
    if (error.statusCode >= 400) {
      return {
        message: error.message || "Invalid request. Please check your input.",
        shouldRetry: false,
        isTemporary: false,
      };
    }

    // Unknown errors
    return {
      message: "An unexpected error occurred. Please try again.",
      shouldRetry: true,
      isTemporary: true,
    };
  }

  // Generate mock data for testing
  static generateMockData(type, count = 1) {
    const mockData = [];

    for (let i = 0; i < count; i++) {
      switch (type) {
        case "employee":
          mockData.push({
            id: `emp_mock_${i + 1}`,
            name: `Mock Employee ${i + 1}`,
            employeeId: `MOCK${String(i + 1).padStart(3, "0")}`,
            trade: "Mock Trade",
            nationality: "Saudi",
            phoneNumber: `+96650123456${i}`,
            hourlyRate: 25.0 + i * 5,
            actualRate: 40.0 + i * 5,
            status: "active",
            createdAt: new Date().toISOString(),
          });
          break;

        case "project":
          mockData.push({
            id: `proj_mock_${i + 1}`,
            name: `Mock Project ${i + 1}`,
            client: "Mock Client",
            status: "active",
            progress: Math.floor(Math.random() * 100),
            budget: 100000 + i * 50000,
            createdAt: new Date().toISOString(),
          });
          break;

        case "attendance":
          mockData.push({
            id: `att_mock_${i + 1}`,
            employeeId: `emp_mock_${i + 1}`,
            date: new Date().toISOString().split("T")[0],
            hoursWorked: 8,
            overtime: Math.floor(Math.random() * 4),
            createdAt: new Date().toISOString(),
          });
          break;

        case "integration":
          const types = ["zatca", "gosi", "qiwa", "banking"];
          mockData.push({
            id: `int_mock_${i + 1}`,
            name: `Mock Integration ${i + 1}`,
            type: types[i % types.length],
            status: Math.random() > 0.5 ? "connected" : "disconnected",
            enabled: true,
            last_sync: new Date().toISOString(),
          });
          break;
      }
    }

    return mockData;
  }

  // Check if running in development mode
  static isDevelopmentMode() {
    return (
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    );
  }

  // Get backend URL based on environment
  static getBackendUrl() {
    if (this.isDevelopmentMode()) {
      return import.meta.env.VITE_API_URL || "http://localhost:3001";
    }

    // Production backend URL would be configured here
    return import.meta.env.VITE_API_URL || "/api";
  }

  // Test all critical endpoints
  static async testCriticalEndpoints() {
    const endpoints = [
      "/api/health",
      "/api/employees",
      "/api/projects",
      "/api/attendance",
      "/api/integrations",
    ];

    const results = {};

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      try {
        await apiClient.get(endpoint);
        results[endpoint] = {
          success: true,
          responseTime: Date.now() - startTime,
        };
      } catch (error) {
        results[endpoint] = {
          success: false,
          responseTime: Date.now() - startTime,
          error: error.message,
        };
      }
    }

    return results;
  }

  // Format error messages for user display
  static formatUserErrorMessage(error, isArabic = false) {
    const errorInfo = this.handleApiError(error);

    if (isArabic) {
      switch (true) {
        case errorInfo.message.includes("Backend server is not available"):
          return "الخادم غير متاح حالياً. يتم استخدام البيانات التجريبية.";
        case errorInfo.message.includes("Authentication required"):
          return "مطلوب تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.";
        case errorInfo.message.includes("permission"):
          return "ليس لديك صلاحية لتنفيذ هذا الإجراء.";
        case errorInfo.message.includes("Server error"):
          return "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.";
        default:
          return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
      }
    }

    return errorInfo.message;
  }
}

export default IntegrationHelpers;
