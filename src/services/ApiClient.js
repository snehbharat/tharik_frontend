// Enhanced API Client for AMOAGC Platform
// Provides seamless integration between frontend and backend with automatic fallback

import axios from "axios";
import { AUTH_CONFIG, API_CONFIG } from "../config/constants";

export class ApiClient {
  constructor(config = {}) {
    this.isBackendAvailable = true;
    this.mockMode = false;

    const defaultConfig = {
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const finalConfig = { ...defaultConfig, ...config };

    this.client = axios.create(finalConfig);
    this.setupInterceptors();
    this.checkBackendAvailability();
  }

  setupInterceptors() {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
          console.warn("Backend unavailable, switching to mock mode");
          this.isBackendAvailable = false;
          this.mockMode = true;

          // Return mock response for the failed request
          return this.getMockResponse(error.config);
        }

        if (error.response && error.response.status === 401) {
          const refreshToken = localStorage.getItem(
            AUTH_CONFIG.REFRESH_TOKEN_KEY
          );
          if (refreshToken) {
            try {
              await this.refreshToken();
              return this.client.request(error.config);
            } catch (refreshError) {
              this.handleAuthenticationFailure();
            }
          } else {
            this.handleAuthenticationFailure();
          }
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  async checkBackendAvailability() {
    try {
      await this.client.get("/health", { timeout: 5000 });
      this.isBackendAvailable = true;
      this.mockMode = false;
      console.log("Backend connection established");
    } catch (error) {
      console.warn("Backend not available, using mock data mode");
      this.isBackendAvailable = false;
      this.mockMode = true;
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await this.client.post("/api/auth/refresh", {
      refreshToken,
    });

    const { token, expiresIn } = response.data;
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    localStorage.setItem(
      AUTH_CONFIG.EXPIRY_KEY,
      new Date(Date.now() + expiresIn).toISOString()
    );
  }

  handleAuthenticationFailure() {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    localStorage.removeItem(AUTH_CONFIG.EXPIRY_KEY);
    window.location.href = "/login";
  }

  formatError(error) {
    return {
      success: false,
      message:
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "An error occurred",
      errors:
        (error.response && error.response.data && error.response.data.errors) ||
        [],
      code:
        (error.response && error.response.data && error.response.data.code) ||
        error.code,
      statusCode: (error.response && error.response.status) || 500,
    };
  }

  getMockResponse(config) {
    const mockData = this.generateMockData(
      config.url || "",
      config.method || "GET"
    );

    return Promise.resolve({
      data: {
        success: true,
        data: mockData,
        message: "Mock response (backend unavailable)",
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  }

  generateMockData(url, method) {
    if (url.includes("/employees")) {
      return method === "GET" ? this.getMockEmployees() : { id: "mock_id" };
    }
    if (url.includes("/projects")) {
      return method === "GET"
        ? this.getMockProjects()
        : { id: "mock_project_id" };
    }
    if (url.includes("/attendance")) {
      return method === "GET"
        ? this.getMockAttendance()
        : { id: "mock_attendance_id" };
    }
    if (url.includes("/integrations")) {
      return method === "GET"
        ? this.getMockIntegrations()
        : { id: "mock_integration_id" };
    }

    return { message: "Mock response", timestamp: new Date().toISOString() };
  }

  getMockEmployees() {
    return [
      {
        id: "emp_001",
        name: "Ahmed Al-Rashid",
        employeeId: "EMP001",
        trade: "Site Supervisor",
        nationality: "Saudi",
        phoneNumber: "+966501234567",
        hourlyRate: 35.0,
        actualRate: 55.0,
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ];
  }

  getMockProjects() {
    return [
      {
        id: "proj_001",
        name: "Aramco Facility Maintenance",
        client: "Saudi Aramco",
        status: "active",
        progress: 75,
        budget: 1200000,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  getMockAttendance() {
    return [
      {
        id: "att_001",
        employeeId: "emp_001",
        date: new Date().toISOString().split("T")[0],
        hoursWorked: 8,
        overtime: 2,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  getMockIntegrations() {
    return [
      {
        id: "int_001",
        name: "ZATCA E-Invoicing",
        type: "zatca",
        status: "connected",
        enabled: true,
        last_sync: new Date().toISOString(),
      },
    ];
  }

  async get(url, params) {
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      if (this.mockMode) {
        const mockResponse = await this.getMockResponse({ url, method: "GET" });
        return mockResponse.data;
      }
      throw this.formatError(error);
    }
  }

  async post(url, data) {
    try {
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      if (this.mockMode) {
        const mockResponse = await this.getMockResponse({
          url,
          method: "POST",
          data,
        });
        return mockResponse.data;
      }
      throw this.formatError(error);
    }
  }

  async put(url, data) {
    try {
      const response = await this.client.put(url, data);
      return response.data;
    } catch (error) {
      if (this.mockMode) {
        const mockResponse = await this.getMockResponse({
          url,
          method: "PUT",
          data,
        });
        return mockResponse.data;
      }
      throw this.formatError(error);
    }
  }

  async delete(url) {
    try {
      const response = await this.client.delete(url);
      return response.data;
    } catch (error) {
      if (this.mockMode) {
        const mockResponse = await this.getMockResponse({
          url,
          method: "DELETE",
        });
        return mockResponse.data;
      }
      throw this.formatError(error);
    }
  }

  async patch(url, data) {
    try {
      const response = await this.client.patch(url, data);
      return response.data;
    } catch (error) {
      if (this.mockMode) {
        const mockResponse = await this.getMockResponse({
          url,
          method: "PATCH",
          data,
        });
        return mockResponse.data;
      }
      throw this.formatError(error);
    }
  }

  isBackendConnected() {
    return this.isBackendAvailable;
  }

  isMockMode() {
    return this.mockMode;
  }

  async testConnection() {
    try {
      await this.client.get("/health", { timeout: 5000 });
      this.isBackendAvailable = true;
      this.mockMode = false;
      return true;
    } catch (error) {
      this.isBackendAvailable = false;
      this.mockMode = true;
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default ApiClient;
