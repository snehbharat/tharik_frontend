import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { AuthService } from "../services/AuthService";

// Auth Context
const AuthContext = createContext(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    sessionExpiry: null,
    refreshTokenExpiry: null,
  });

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = AuthService.getCurrentUser();
        const token = AuthService.getToken();
        const refreshToken = AuthService.getRefreshToken();
        const sessionExpiry = AuthService.getSessionExpiry();
        const refreshTokenExpiry = AuthService.getRefreshTokenExpiry();
        const isAuthenticated = AuthService.isAuthenticated();

        setAuthState({
          user,
          token,
          refreshToken,
          isAuthenticated,
          isLoading: false,
          error: null,
          sessionExpiry,
          refreshTokenExpiry,
        });

        if (isAuthenticated && AuthService.needsTokenRefresh()) {
          await refreshTokenHandler();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to initialize authentication",
        }));
      }
    };

    initializeAuth();
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.sessionExpiry) return;

    const checkTokenExpiry = () => {
      if (AuthService.isRefreshTokenExpired()) {
        // Refresh token expired, logout user
        logout();
      } else if (AuthService.needsTokenRefresh()) {
        // Token needs refresh
        refreshTokenHandler();
      } else if (AuthService.isSessionExpired()) {
        // Session expired, logout user
        logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [authState.isAuthenticated, authState.sessionExpiry]);

  // Login function
  const login = useCallback(async (credentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await AuthService.login(credentials);

      if (response.success && response.user && response.token) {
        const newAuthState = {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          sessionExpiry: response.tokenExpiry ? new Date(response.tokenExpiry) : null,
          refreshTokenExpiry: response.refreshTokenExpiry ? new Date(response.refreshTokenExpiry) : null,
        };

        setAuthState(newAuthState);

        console.log("Login successful for user:", response.user.username);
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message || "Login failed",
        }));

        console.error("Login failed:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during login",
      }));

      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const currentUser = authState.user;
      await AuthService.logout();

      setAuthState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        sessionExpiry: null,
        refreshTokenExpiry: null,
      });

      if (currentUser) {
        console.log("Logout successful for user:", currentUser.username);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setAuthState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Logout failed",
        sessionExpiry: null,
        refreshTokenExpiry: null,
      });
    }
  }, [authState.user]);

  // Refresh token function
  const refreshTokenHandler = useCallback(async () => {
    try {
      console.log("Attempting to refresh token...");
      const response = await AuthService.refreshToken();

      if (response.success && response.user && response.token) {
        setAuthState((prev) => ({
          ...prev,
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          sessionExpiry: response.tokenExpiry ? new Date(response.tokenExpiry) : prev.sessionExpiry,
          refreshTokenExpiry: response.refreshTokenExpiry ? new Date(response.refreshTokenExpiry) : prev.refreshTokenExpiry,
          error: null,
        }));

        console.log("Token refreshed successfully");
        return true;
      } else {
        console.log("Token refresh failed, logging out...");
        await logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      await logout();
      return false;
    }
  }, [logout]);

  // Permission check function
  const hasPermission = useCallback(
    (permission) => {
      return AuthService.hasPermission(permission);
    },
    [authState.user]
  );

  // Role check function
  const hasRole = useCallback(
    (roleId) => {
      return AuthService.hasRole(roleId);
    },
    [authState.user]
  );

  const contextValue = {
    ...authState,
    login,
    logout,
    refreshToken: refreshTokenHandler,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hook for protected components
export const useRequireAuth = (requiredPermissions, requiredRole) => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      console.warn("Authentication required");
      // You can redirect or show modal here
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  const hasRequiredPermissions =
    !requiredPermissions ||
    requiredPermissions.every((permission) => auth.hasPermission(permission));

  const hasRequiredRole = !requiredRole || auth.hasRole(requiredRole);

  return {
    ...auth,
    hasRequiredPermissions,
    hasRequiredRole,
    canAccess:
      auth.isAuthenticated && hasRequiredPermissions && hasRequiredRole,
  };
};

// Session management hook
export const useSession = () => {
  const auth = useAuth();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(0);
  const [refreshTimeUntilExpiry, setRefreshTimeUntilExpiry] = useState(0);

  useEffect(() => {
    if (!auth.sessionExpiry) return;

    const updateTimer = () => {
      const now = new Date();
      
      // Main token expiry
      const expiry = new Date(auth.sessionExpiry);
      const timeLeft = Math.max(0, expiry.getTime() - now.getTime());
      setTimeUntilExpiry(timeLeft);

      // Refresh token expiry
      if (auth.refreshTokenExpiry) {
        const refreshExpiry = new Date(auth.refreshTokenExpiry);
        const refreshTimeLeft = Math.max(0, refreshExpiry.getTime() - now.getTime());
        setRefreshTimeUntilExpiry(refreshTimeLeft);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [auth.sessionExpiry, auth.refreshTokenExpiry]);

  const formatTimeRemaining = (milliseconds) => {
    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isExpiringSoon = timeUntilExpiry <= 5 * 60 * 1000; // 5 minutes
  const isRefreshExpiringSoon = refreshTimeUntilExpiry <= 30 * 60 * 1000; // 30 minutes

  return {
    timeUntilExpiry,
    refreshTimeUntilExpiry,
    timeRemainingFormatted: formatTimeRemaining(timeUntilExpiry),
    refreshTimeRemainingFormatted: formatTimeRemaining(refreshTimeUntilExpiry),
    isExpiringSoon,
    isRefreshExpiringSoon,
    extendSession: auth.refreshToken,
  };
};