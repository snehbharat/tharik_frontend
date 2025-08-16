// Authentication Service with JWT and Session Management
import axios from 'axios';
import Cookies from "js-cookie";

export class AuthService {
  static SESSION_CONFIG = {
    tokenKey: "amoagc_token",
    refreshTokenKey: "amoagc_refresh_token",
    userKey: "amoagc_user",
    expiryKey: "amoagc_expiry",
    refreshExpiryKey: "amoagc_refresh_expiry",
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
    refreshThreshold: 30 * 60 * 1000, // 30 minutes before expiry
  };

  static LOGIN_ATTEMPTS_KEY = "amoagc_login_attempts";
  static MAX_LOGIN_ATTEMPTS = 5;
  static LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  /**
   * Login user with credentials
   */
  static async login(credentials) {
    let email, pwd, role;

    email = credentials.username || credentials.email;
    pwd = credentials.password;
    role = credentials.role;

    try {
      const response = await fetch("/api/auth/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: pwd, role }),
      });

      const data = await response.json();

      if (!response.ok || !data.response) {
        throw new Error(data.message || "Login failed");
      }

      const loginResponse = data.data.loginResponse;

      // Store session data
      this.storeSession({
        token: loginResponse.token,
        refreshToken: loginResponse.refreshToken,
        user: loginResponse.userDetails,
        tokenExpiry: new Date(loginResponse.tokenExpiery),
        refreshTokenExpiry: new Date(loginResponse.refreshTokenExpiery),
      });

      return {
        success: true,
        user: loginResponse.userDetails,
        token: loginResponse.token,
        refreshToken: loginResponse.refreshToken,
        tokenExpiry: loginResponse.tokenExpiery,
        refreshTokenExpiry: loginResponse.refreshTokenExpiery,
      };

    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    }
  }

  static getCookie(name) { // Helper function to get cookie value by name
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  /**
   * Logout user and clear session
   */
  static async logout() {
    try {
      const user = this.getCurrentUser();
      console.log("Logging out user:", user?.username);

      // Call logout API 

      const token = await getCookie("amoagc_token");
      console.log("Token from cookie:", token);

      const response = await axios.get("/api/user/logout", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      this.clearSession();

      if (user) {
        console.log(
          `User ${user.username} logged out at ${new Date().toISOString()}`, response.data
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
      this.clearSession();
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      const user = this.getCurrentUser();

      if (!refreshToken || !user) {
        return {
          success: false,
          message: "No valid refresh token found",
          errors: ["NO_REFRESH_TOKEN"],
        };
      }

      if (this.isRefreshTokenExpired()) {
        this.clearSession();
        return {
          success: false,
          message: "Refresh token expired",
          errors: ["REFRESH_TOKEN_EXPIRED"],
        };
      }

      // Call refresh token API
      const response = await fetch("/api/refresh/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok || !data.response) {
        throw new Error(data.message || "Token refresh failed");
      }

      const refreshResponse = data.data || data.data.loginResponse;

      // Update session with new tokens
      this.storeSession({
        token: refreshResponse.token,
        refreshToken: refreshResponse.refreshToken,
        user: refreshResponse.userDetails || user,
        tokenExpiry: new Date(refreshResponse.tokenExpiery),
        refreshTokenExpiry: new Date(refreshResponse.refreshTokenExpiery),
      });

      console.log(`Token refreshed for user ${user.username}`);

      return {
        success: true,
        user: refreshResponse.userDetails || user,
        token: refreshResponse.token,
        refreshToken: refreshResponse.refreshToken,
        tokenExpiry: refreshResponse.tokenExpiery,
        refreshTokenExpiry: refreshResponse.refreshTokenExpiery,
        message: "Token refreshed successfully",
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      this.clearSession();
      return {
        success: false,
        message: "Failed to refresh token",
        errors: ["REFRESH_FAILED"],
      };
    }
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser() {
    try {
      const userJson = localStorage.getItem(this.SESSION_CONFIG.userKey);
      if (!userJson) return null;

      const user = JSON.parse(userJson);

      // Validate session expiry
      if (this.isSessionExpired()) {
        this.clearSession();
        return null;
      }

      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Get current authentication token
   */
  static getToken() {
    return Cookies.get(this.SESSION_CONFIG.tokenKey) || null;
  }

  /**
   * Get refresh token
   */
  static getRefreshToken() {
    return Cookies.get(this.SESSION_CONFIG.refreshTokenKey) || null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user && !this.isSessionExpired());
  }

  /**
   * Check if session is expired
   */
  static isSessionExpired() {
    const expiryStr = localStorage.getItem(this.SESSION_CONFIG.expiryKey);
    if (!expiryStr) return true;

    const expiry = new Date(expiryStr);
    return new Date() >= expiry;
  }

  /**
   * Check if refresh token is expired
   */
  static isRefreshTokenExpired() {
    const refreshExpiryStr = localStorage.getItem(this.SESSION_CONFIG.refreshExpiryKey);
    if (!refreshExpiryStr) return true;

    const refreshExpiry = new Date(refreshExpiryStr);
    return new Date() >= refreshExpiry;
  }

  /**
   * Check if token needs refresh
   */
  static needsTokenRefresh() {
    const expiryStr = localStorage.getItem(this.SESSION_CONFIG.expiryKey);
    if (!expiryStr) return false;

    const expiry = new Date(expiryStr);
    const now = new Date();
    const timeUntilExpiry = expiry.getTime() - now.getTime();

    // Refresh if less than 30 minutes remaining
    return timeUntilExpiry <= this.SESSION_CONFIG.refreshThreshold;
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Check if user has permissions array
    if (!user.permissions && !user.role?.permissions) return false;

    // Get user permissions from API response structure
    const userPermissions = user.permissions || [];
    const rolePermissions = user.role?.permissions || [];
    const allPermissions = [...userPermissions, ...rolePermissions];

    // Admin has all permissions
    if (allPermissions.includes("*") || user.role === "admin") return true;

    // Check specific permissions
    return allPermissions.includes(permission) ||
      allPermissions.some(perm => perm === permission.split(".")[0] + ".*");
  }

  /**
   * Check if user has specific role
   */
  static hasRole(roleId) {
    const user = this.getCurrentUser();
    return user?.role === roleId;
  }

  /**
   * Get session expiry time
   */
  static getSessionExpiry() {
    const expiryStr = localStorage.getItem(this.SESSION_CONFIG.expiryKey);
    return expiryStr ? new Date(expiryStr) : null;
  }

  /**
   * Get refresh token expiry time
   */
  static getRefreshTokenExpiry() {
    const refreshExpiryStr = localStorage.getItem(this.SESSION_CONFIG.refreshExpiryKey);
    return refreshExpiryStr ? new Date(refreshExpiryStr) : null;
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Store session data in localStorage and cookies
   */
  static storeSession({ token, refreshToken, user, tokenExpiry, refreshTokenExpiry }, persistent = false) {
    const cookieOptions = {
      expires: persistent ? 30 : undefined, // 30 days if remember me
      secure: window.location.protocol === "https:",
      sameSite: "strict",
      path: "/",
    };

    // Store tokens in cookies
    Cookies.set(this.SESSION_CONFIG.tokenKey, token, cookieOptions);
    Cookies.set(this.SESSION_CONFIG.refreshTokenKey, refreshToken, cookieOptions);

    // Store user data and expiry in localStorage
    localStorage.setItem(this.SESSION_CONFIG.userKey, JSON.stringify(user));
    localStorage.setItem(this.SESSION_CONFIG.expiryKey, tokenExpiry.toISOString());
    localStorage.setItem(this.SESSION_CONFIG.refreshExpiryKey, refreshTokenExpiry.toISOString());

    console.log("Session stored successfully");
    console.log("Token expires:", tokenExpiry.toISOString());
    console.log("Refresh token expires:", refreshTokenExpiry.toISOString());
  }

  /**
   * Clear all session data
   */
  static clearSession() {
    // Remove cookies
    Cookies.remove(this.SESSION_CONFIG.tokenKey);
    Cookies.remove(this.SESSION_CONFIG.refreshTokenKey);

    // Remove localStorage items
    localStorage.removeItem(this.SESSION_CONFIG.userKey);
    localStorage.removeItem(this.SESSION_CONFIG.expiryKey);
    localStorage.removeItem(this.SESSION_CONFIG.refreshExpiryKey);

    console.log("Session cleared");
  }

  /**
   * Validate user credentials
   */
  static validateCredentials(credentials) {
    const errors = [];

    if (!credentials.username?.trim()) {
      errors.push("Username is required");
    }

    if (!credentials.password?.trim()) {
      errors.push("Password is required");
    }

    if (credentials.username && credentials.username.length < 3) {
      errors.push("Username must be at least 3 characters");
    }

    if (credentials.password && credentials.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    // Check for basic injection attempts
    const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+=/i, /sql/i];
    const inputText = credentials.username + credentials.password;

    if (dangerousPatterns.some((pattern) => pattern.test(inputText))) {
      errors.push("Invalid characters detected");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check rate limiting for login attempts
   */
  static checkRateLimit(username) {
    const attemptsKey = `${this.LOGIN_ATTEMPTS_KEY}_${username}`;
    const attemptsData = localStorage.getItem(attemptsKey);

    if (!attemptsData) {
      return { allowed: true, timeRemaining: 0 };
    }

    const { count, lastAttempt } = JSON.parse(attemptsData);
    const timeSinceLastAttempt = Date.now() - lastAttempt;

    if (timeSinceLastAttempt > this.LOCKOUT_DURATION) {
      // Reset attempts after lockout period
      localStorage.removeItem(attemptsKey);
      return { allowed: true, timeRemaining: 0 };
    }

    if (count >= this.MAX_LOGIN_ATTEMPTS) {
      return {
        allowed: false,
        timeRemaining: this.LOCKOUT_DURATION - timeSinceLastAttempt,
      };
    }

    return { allowed: true, timeRemaining: 0 };
  }

  /**
   * Record failed login attempt
   */
  static recordFailedAttempt(username) {
    const attemptsKey = `${this.LOGIN_ATTEMPTS_KEY}_${username}`;
    const attemptsData = localStorage.getItem(attemptsKey);

    let count = 1;
    if (attemptsData) {
      const existing = JSON.parse(attemptsData);
      count = existing.count + 1;
    }

    localStorage.setItem(
      attemptsKey,
      JSON.stringify({
        count,
        lastAttempt: Date.now(),
      })
    );
  }

  /**
   * Clear failed login attempts
   */
  static clearFailedAttempts(username) {
    const attemptsKey = `${this.LOGIN_ATTEMPTS_KEY}_${username}`;
    localStorage.removeItem(attemptsKey);
  }

  /**
   * Simulate network delay for testing
   */
  static async simulateNetworkDelay(min, max) {
    const delay = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  static getTimeUntilExpiry() {
    const expiryStr = localStorage.getItem(this.SESSION_CONFIG.expiryKey);
    if (!expiryStr) return 0;

    const expiry = new Date(expiryStr);
    const now = new Date();
    return Math.max(0, expiry.getTime() - now.getTime());
  }

  /**
   * Get time until refresh token expires (in milliseconds)
   */
  static getTimeUntilRefreshExpiry() {
    const refreshExpiryStr = localStorage.getItem(this.SESSION_CONFIG.refreshExpiryKey);
    if (!refreshExpiryStr) return 0;

    const refreshExpiry = new Date(refreshExpiryStr);
    const now = new Date();
    return Math.max(0, refreshExpiry.getTime() - now.getTime());
  }
}