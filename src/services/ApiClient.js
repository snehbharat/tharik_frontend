import axios from "axios";
import { AUTH_CONFIG, API_CONFIG } from "../config/constants";

class Client {
  constructor() {
    this.isBackendAvailable = true;
    this.mockMode = false;

    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    this.setupInterceptors();
    this.checkBackendAvailability();
  }

  // Interceptors handle authentication, retries, and fallback
  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Backend down → enable mock mode
        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
          console.warn("Backend unavailable → switching to mock mode");
          this.isBackendAvailable = false;
          this.mockMode = true;
          return this.getMockResponse(originalRequest);
        }

        // Unauthorized → try refresh token
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.refreshToken();
            return this.client(originalRequest); // retry with new token
          } catch (refreshError) {
            this.handleAuthenticationFailure();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  // Simple backend health check
  async checkBackendAvailability() {
    try {
      await this.client.get("/health", { timeout: 3000 });
      this.isBackendAvailable = true;
      this.mockMode = false;
      console.log("✅ Backend is available");
      return true;
    } catch {
      console.warn("⚠ Backend unavailable → using mock data");
      this.isBackendAvailable = false;
      this.mockMode = true;
      return false;
    }
  }

  // Refresh JWT token
  async refreshToken() {

    const userJson = localStorage.getItem(this.SESSION_CONFIG.userKey);
    if (!userJson) return null;

    const user = JSON.parse(userJson);

    const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error("No refresh token available");

    const { data } = await this.client.post("/api/refresh/token", { refreshToken });
    this.storeSession({
      token: data.data.token,
      refreshToken: data.data.refreshToken,
      user: user,
      tokenExpiry: new Date(data.data.tokenExpiery),
      refreshTokenExpiry: new Date(data.data.refreshTokenExpiery),
    });
    console.log("🔄 Token refreshed");
  }

  // Handle logout
  handleAuthenticationFailure() {
    console.warn("❌ Authentication failed → logging out");
    localStorage.clear();
    window.location.href = "/login";
  }

  // Standardized error format
  formatError(error) {
    return {
      success: false,
      message:
        error?.response?.data?.message || error.message || "An error occurred",
      errors: error?.response?.data?.errors || [],
      code: error?.response?.data?.code || error.code,
      statusCode: error?.response?.status || 500,
    };
  }

  // Mock fallback
  getMockResponse(config) {
    const mockData = this.generateMockData(config.url || "", config.method || "GET");
    return Promise.resolve({
      data: { success: true, data: mockData, message: "Mock response" },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  }

  // Mock dataset
  generateMockData(url, method) {
    if (url.includes("/client/client-count")) {
      return { count: 42 }; // Mock client count
    }
    if (url.includes("/employees")) return method === "GET" ? this.getMockEmployees() : { id: "mock_emp" };
    return { message: "Mock response", timestamp: new Date().toISOString() };
  }

  getMockEmployees() {
    return [{ id: "emp_001", name: "Mock Employee", status: "active" }];
  }

  // ==== Public API methods ====
  get(url, params) {
    return this.client.get(url, { params }).then((res) => res.data);
  }

  post(url, data) {
    return this.client.post(url, data).then((res) => res.data);
  }

  put(url, data) {
    return this.client.put(url, data).then((res) => res.data);
  }

  delete(url) {
    return this.client.delete(url).then((res) => res.data);
  }

  patch(url, data) {
    return this.client.patch(url, data).then((res) => res.data);
  }

  // Utility
  isBackendConnected() {
    return this.isBackendAvailable;
  }

  isMockMode() {
    return this.mockMode;
  }
}

// Singleton instance
export const apiClient = new Client();