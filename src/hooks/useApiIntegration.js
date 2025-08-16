import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../services/ApiClient";

export const useApiIntegration = () => {
  const [state, setState] = useState({
    isBackendConnected: false,
    isMockMode: true,
    connectionStatus: "checking",
    lastChecked: null,
    retryCount: 0,
  });

  const checkConnection = useCallback(async () => {
    setState((prev) => ({ ...prev, connectionStatus: "checking" }));

    try {
      const isConnected = await apiClient.checkBackendAvailability();
      console.log("isConnected", isConnected);

      setState((prev) => ({
        ...prev,
        isBackendConnected: isConnected,
        isMockMode: !isConnected,
        connectionStatus: isConnected ? "connected" : "disconnected",
        lastChecked: new Date(),
        retryCount: isConnected ? 0 : prev.retryCount + 1,
      }));

      return isConnected;
    } catch (error) {
      console.error("Connection check failed:", error);
      setState((prev) => ({
        ...prev,
        isBackendConnected: false,
        isMockMode: true,
        connectionStatus: "error",
        lastChecked: new Date(),
        retryCount: prev.retryCount + 1,
      }));

      return false;
    }
  }, []);

  // Auto-retry connection with exponential backoff
  useEffect(() => {
    const retryConnection = () => {
      if (state.retryCount > 0 && state.retryCount < 5) {
        const delay = Math.min(1000 * Math.pow(2, state.retryCount), 30000);
        setTimeout(checkConnection, delay);
      }
    };

    if (
      state.connectionStatus === "disconnected" ||
      state.connectionStatus === "error"
    ) {
      retryConnection();
    }
  }, [state.retryCount, state.connectionStatus, checkConnection]);

  // Initial connection check
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Periodic health check (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.isBackendConnected) {
        checkConnection();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [state.isBackendConnected, checkConnection]);

  const forceReconnect = useCallback(() => {
    setState((prev) => ({ ...prev, retryCount: 0 }));
    return checkConnection();
  }, [checkConnection]);

  const getConnectionStatusMessage = useCallback(
    (isArabic = false) => {
      switch (state.connectionStatus) {
        case "checking":
          return isArabic ? "جاري فحص الاتصال..." : "Checking connection...";
        case "connected":
          return isArabic ? "متصل بالخادم" : "Connected to server";
        case "disconnected":
          return isArabic
            ? "غير متصل - استخدام البيانات التجريبية"
            : "Disconnected - Using mock data";
        case "error":
          return isArabic ? "خطأ في الاتصال" : "Connection error";
        default:
          return isArabic ? "حالة غير معروفة" : "Unknown status";
      }
    },
    [state.connectionStatus]
  );

  return {
    ...state,
    checkConnection,
    forceReconnect,
    getConnectionStatusMessage,
  };
};

// Hook for components that need to know about backend availability
export const useBackendStatus = () => {
  const { isBackendConnected, isMockMode, connectionStatus } =
    useApiIntegration();

  return {
    isBackendConnected,
    isMockMode,
    connectionStatus,
    showMockDataBanner: isMockMode,
  };
};
