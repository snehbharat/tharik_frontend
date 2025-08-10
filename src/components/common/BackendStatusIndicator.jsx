// Backend Status Indicator Component
// Small indicator for header/footer showing backend connection status

import React from "react";
import { Server, Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react";
import { useApiIntegration } from "../../hooks/useApiIntegration";

export const BackendStatusIndicator = ({
  isArabic = false,
  showLabel = true,
  size = "sm",
  className = "",
}) => {
  const { isBackendConnected, isMockMode, connectionStatus, forceReconnect } =
    useApiIntegration();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const getStatusIcon = () => {
    const iconClass = sizeClasses[size];

    switch (connectionStatus) {
      case "checking":
        return (
          <RefreshCw className={`${iconClass} animate-spin text-blue-500`} />
        );
      case "connected":
        return <Wifi className={`${iconClass} text-green-500`} />;
      case "disconnected":
        return <WifiOff className={`${iconClass} text-yellow-500`} />;
      case "error":
        return <AlertTriangle className={`${iconClass} text-red-500`} />;
      default:
        return <Server className={`${iconClass} text-gray-500`} />;
    }
  };

  const getStatusText = () => {
    if (isMockMode) {
      return isArabic ? "وضع تجريبي" : "Mock Mode";
    }

    switch (connectionStatus) {
      case "checking":
        return isArabic ? "فحص..." : "Checking...";
      case "connected":
        return isArabic ? "متصل" : "Connected";
      case "disconnected":
        return isArabic ? "غير متصل" : "Disconnected";
      case "error":
        return isArabic ? "خطأ" : "Error";
      default:
        return isArabic ? "غير معروف" : "Unknown";
    }
  };

  const getStatusColor = () => {
    if (isMockMode) return "text-blue-600";

    switch (connectionStatus) {
      case "checking":
        return "text-blue-600";
      case "connected":
        return "text-green-600";
      case "disconnected":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      title={isArabic ? "حالة اتصال الخادم" : "Server connection status"}
    >
      <button
        onClick={forceReconnect}
        className="flex items-center gap-2 hover:opacity-75 transition-opacity"
        disabled={connectionStatus === "checking"}
      >
        {getStatusIcon()}

        {showLabel && (
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        )}
      </button>

      {isMockMode && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          {showLabel && (
            <span className="text-xs text-blue-600">
              {isArabic ? "تجريبي" : "Demo"}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BackendStatusIndicator;
