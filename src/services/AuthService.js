// Authentication Service with JWT and Session Management
import axios from 'axios';

import Cookies from "js-cookie";
import { MOCK_USERS } from "../types/auth";

export class AuthService {
  static SESSION_CONFIG = {
    tokenKey: "amoagc_token",
    refreshTokenKey: "amoagc_refresh_token",
    userKey: "amoagc_user",
    expiryKey: "amoagc_expiry",
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
    refreshThreshold: 30 * 60 * 1000, // 30 minutes
  };

  static LOGIN_ATTEMPTS_KEY = "amoagc_login_attempts";
  static MAX_LOGIN_ATTEMPTS = 5;
  static LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  static async login(Credentials) {
  
  let email, pwd;
  
    email = Credentials.username || Credentials.email;
    pwd = Credentials.password;
   

  try {
    const response = await fetch("/api/auth/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: pwd }),
    });

    const data = await response.json();

    if (!response.ok || !data.response) {
      throw new Error(data.message || "Login failed");
    }

    this.storeSession({
      token: data.data.loginResponse.token,
      refreshToken: data.data.loginResponse.refreshToken,
      user: data.data.userDetails,
      expiry: Date.now() + this.SESSION_CONFIG.maxAge,
    });

    return { success: true, user: data.data.userDetails, token: data.data.loginResponse.token };

  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: error.message };
  }
}



  static async logout() {
    try {
      const user = this.getCurrentUser();

      console.log("Logging out user:", user?.username);

      this.clearSession();

      if (user) {
        console.log(
          `User ${user.username} logged out at ${new Date().toISOString()}`
        );
      }

      await this.simulateNetworkDelay(200, 500);
    } catch (error) {
      console.error("Logout error:", error);
      this.clearSession();
    }
  }

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

      if (!this.validateRefreshToken(refreshToken)) {
        this.clearSession();
        return {
          success: false,
          message: "Invalid refresh token",
          errors: ["INVALID_REFRESH_TOKEN"],
        };
      }

      const newToken = this.generateJWT(user);
      const newRefreshToken = this.generateRefreshToken(user);
      const expiresIn = this.SESSION_CONFIG.maxAge;
      const sessionExpiry = new Date(Date.now() + expiresIn);

      this.storeSession(user, newToken, newRefreshToken, sessionExpiry, true);

      console.log(`Token refreshed for user ${user.username}`);

      return {
        success: true,
        user,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn,
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
   * Check if token needs refresh
   */
  static needsTokenRefresh() {
    const expiryStr = localStorage.getItem(this.SESSION_CONFIG.expiryKey);
    if (!expiryStr) return false;

    const expiry = new Date(expiryStr);
    const now = new Date();
    const timeUntilExpiry = expiry.getTime() - now.getTime();

    return timeUntilExpiry <= this.SESSION_CONFIG.refreshThreshold;
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin has all permissions
    if (user.role.permissions.includes("*")) return true;

    // Check specific permissions
    return user.permissions.some(
      (perm) =>
        perm.resource === "*" ||
        perm.resource === permission.split(".")[0] ||
        user.role.permissions.some(
          (rolePerm) =>
            rolePerm === permission ||
            rolePerm === permission.split(".")[0] + ".*"
        )
    );
  }

  /**
   * Check if user has specific role
   */
  static hasRole(roleId) {
    const user = this.getCurrentUser();
    return user?.role.id === roleId;
  }

  /**
   * Get session expiry time
   */
  static getSessionExpiry() {
    const expiryStr = localStorage.getItem(this.SESSION_CONFIG.expiryKey);
    return expiryStr ? new Date(expiryStr) : null;
  }

  // ==================== PRIVATE METHODS ====================

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

  static generateJWT(user) {
    // In production, use a proper JWT library like jsonwebtoken
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        username: user.username,
        role: user.role.id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor((Date.now() + this.SESSION_CONFIG.maxAge) / 1000),
      })
    );
    const signature = btoa(`signature_${user.id}_${Date.now()}`);

    return `${header}.${payload}.${signature}`;
  }

  static generateRefreshToken(user) {
    return btoa(`refresh_${user.id}_${Date.now()}_${Math.random()}`);
  }

  static validateRefreshToken(token) {
    try {
      const decoded = atob(token);
      return decoded.startsWith("refresh_") && decoded.length > 20;
    } catch {
      return false;
    }
  }

  static storeSession(user, token, refreshToken, expiry, persistent = false) {
    const cookieOptions = {
      expires: persistent ? 30 : undefined, // 30 days if remember me
      secure: window.location.protocol === "https:",
      sameSite: "strict",
      path: "/",
    };

    // Store tokens in httpOnly-like cookies (simulated)
    Cookies.set(this.SESSION_CONFIG.tokenKey, token, cookieOptions);
    Cookies.set(
      this.SESSION_CONFIG.refreshTokenKey,
      refreshToken,
      cookieOptions
    );

    // Store user data and expiry in localStorage
    localStorage.setItem(this.SESSION_CONFIG.userKey, JSON.stringify(user));
    localStorage.setItem(this.SESSION_CONFIG.expiryKey, expiry.toISOString());
  }

  static clearSession() {
    // Remove cookies
    Cookies.remove(this.SESSION_CONFIG.tokenKey);
    Cookies.remove(this.SESSION_CONFIG.refreshTokenKey);

    // Remove localStorage items
    localStorage.removeItem(this.SESSION_CONFIG.userKey);
    localStorage.removeItem(this.SESSION_CONFIG.expiryKey);
  }

  static getRefreshToken() {
    return Cookies.get(this.SESSION_CONFIG.refreshTokenKey) || null;
  }

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

  static clearFailedAttempts(username) {
    const attemptsKey = `${this.LOGIN_ATTEMPTS_KEY}_${username}`;
    localStorage.removeItem(attemptsKey);
  }

  static async simulateNetworkDelay(min, max) {
    const delay = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
