// Connection Status Banner Component
// Shows users when the application is running in mock mode vs connected to backend

import React from "react";
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  Server,
  Database,
} from "lucide-react";
import { useApiIntegration } from "../../hooks/useApiIntegration";

export const ConnectionStatusBanner = ({
  isArabic = false,
  className = "",
}) => {
  const {
    isBackendConnected,
    isMockMode,
    connectionStatus,
    lastChecked,
    retryCount,
    forceReconnect,
    getConnectionStatusMessage,
  } = useApiIntegration();

  // Don't show banner if connected
  if (isBackendConnected && !isMockMode) {
    return null;
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "checking":
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />;
      case "connected":
        return <Wifi className="w-5 h-5 text-green-600" />;
      case "disconnected":
        return <WifiOff className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Server className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "checking":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "connected":
        return "bg-green-50 border-green-200 text-green-800";
      case "disconnected":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 ${getStatusColor()} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-3 ${
          isArabic ? "flex-row-reverse" : ""
        }`}
      >
        <div className="flex-shrink-0">{getStatusIcon()}</div>

        <div className={`flex-1 ${isArabic ? "text-right" : "text-left"}`}>
          <div className="font-semibold">
            {getConnectionStatusMessage(isArabic)}
          </div>

          {isMockMode && (
            <div className="text-sm mt-1">
              {isArabic
                ? "التطبيق يعمل بالبيانات التجريبية. جميع الوظائف متاحة للاختبار."
                : "Application running with mock data. All features available for testing."}
            </div>
          )}

          {lastChecked && (
            <div className="text-xs mt-2 opacity-75">
              {isArabic ? "آخر فحص:" : "Last checked:"}{" "}
              {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isMockMode && (
            <div className="flex items-center gap-1 text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
              <Database className="w-3 h-3" aria-hidden="true" />
              <span>{isArabic ? "وضع تجريبي" : "Mock Mode"}</span>
            </div>
          )}

          {!isBackendConnected && retryCount < 5 && (
            <button
              onClick={forceReconnect}
              className="text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded transition-colors"
              aria-label={
                isArabic ? "إعادة محاولة الاتصال" : "Retry connection"
              }
            >
              {isArabic ? "إعادة المحاولة" : "Retry"}
            </button>
          )}
        </div>
      </div>

      {/* Development Information */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
          <div className="text-xs space-y-1">
            <div>
              <strong>
                {isArabic ? "معلومات التطوير:" : "Development Info:"}
              </strong>
            </div>
            <div>
              {isArabic ? "حالة الاتصال:" : "Connection Status:"}{" "}
              {connectionStatus}
            </div>
            <div>
              {isArabic ? "محاولات إعادة الاتصال:" : "Retry Attempts:"}{" "}
              {retryCount}/5
            </div>
            <div>
              {isArabic ? "وضع البيانات التجريبية:" : "Mock Mode:"}{" "}
              {isMockMode ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusBanner;
