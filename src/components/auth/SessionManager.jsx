// Session Management Component with Auto-Refresh and Timeout Warnings

import React, { useState, useEffect } from "react";
import { Clock, RefreshCw, LogOut, AlertTriangle } from "lucide-react";
import { useSession, useAuth } from "../../hooks/useAuth";

export const SessionManager = ({
  isArabic = false,
  warningThreshold = 5,
  autoRefreshEnabled = true,
}) => {
  const { logout, refreshToken } = useAuth();
  const { timeUntilExpiry, timeRemainingFormatted, isExpiringSoon } =
    useSession();

  const [showWarning, setShowWarning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshAttempted, setAutoRefreshAttempted] = useState(false);

  // Show warning when session is expiring soon
  useEffect(() => {
    const warningTime = warningThreshold * 60 * 1000; // Convert to milliseconds
    setShowWarning(timeUntilExpiry <= warningTime && timeUntilExpiry > 0);
  }, [timeUntilExpiry, warningThreshold]);

  // Auto-refresh token when expiring soon (once per session)
  useEffect(() => {
    if (
      autoRefreshEnabled &&
      isExpiringSoon &&
      !autoRefreshAttempted &&
      timeUntilExpiry > 0
    ) {
      handleRefreshSession();
      setAutoRefreshAttempted(true);
    }
  }, [
    isExpiringSoon,
    autoRefreshEnabled,
    autoRefreshAttempted,
    timeUntilExpiry,
  ]);

  // Reset auto-refresh flag when session is refreshed
  useEffect(() => {
    if (!isExpiringSoon && autoRefreshAttempted) {
      setAutoRefreshAttempted(false);
    }
  }, [isExpiringSoon, autoRefreshAttempted]);

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshToken();
      if (success) {
        setShowWarning(false);
        console.log("Session refreshed successfully");
      } else {
        console.error("Failed to refresh session");
      }
    } catch (error) {
      console.error("Session refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Don't render if session is not expiring soon
  if (!showWarning) {
    return null;
  }

  return (
    <>
      {/* Session Warning Modal */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-warning-title"
        aria-describedby="session-warning-description"
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle
                className="w-6 h-6 text-yellow-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <h3
                id="session-warning-title"
                className="text-lg font-bold text-gray-900"
              >
                {isArabic ? "تحذير انتهاء الجلسة" : "Session Expiring Soon"}
              </h3>
              <p
                id="session-warning-description"
                className="text-sm text-gray-600"
              >
                {isArabic
                  ? "ستنتهي جلستك قريباً"
                  : "Your session will expire soon"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {isArabic ? "الوقت المتبقي:" : "Time remaining:"}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <span className="text-lg font-mono font-bold text-red-600">
                  {timeRemainingFormatted}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      (timeUntilExpiry / (warningThreshold * 60 * 1000)) * 100
                    )
                  )}%`,
                }}
                role="progressbar"
                aria-valuenow={Math.max(
                  0,
                  Math.min(
                    100,
                    (timeUntilExpiry / (warningThreshold * 60 * 1000)) * 100
                  )
                )}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Session time remaining"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRefreshSession}
              disabled={isRefreshing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              aria-describedby="extend-session-description"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw
                    className="w-5 h-5 animate-spin"
                    aria-hidden="true"
                  />
                  {isArabic ? "جاري التحديث..." : "Refreshing..."}
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" aria-hidden="true" />
                  {isArabic ? "تمديد الجلسة" : "Extend Session"}
                </>
              )}
            </button>
            <div id="extend-session-description" className="sr-only">
              {isArabic
                ? "تمديد جلسة العمل الحالية"
                : "Extend your current work session"}
            </div>

            <button
              onClick={handleLogout}
              disabled={isRefreshing}
              className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
              {isArabic ? "تسجيل الخروج" : "Logout Now"}
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              {isArabic
                ? "لأسباب أمنية، ستنتهي جلستك تلقائياً عند انتهاء الوقت المحدد."
                : "For security reasons, your session will automatically expire when the timer reaches zero."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Session Status Indicator Component
export const SessionStatusIndicator = ({ isArabic = false }) => {
  const { isAuthenticated, user } = useAuth();
  const { timeUntilExpiry, isExpiringSoon } = useSession();

  if (!isAuthenticated || !user) {
    return null;
  }

  const formatTimeRemaining = (milliseconds) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        isExpiringSoon ? "text-red-600" : "text-gray-600"
      }`}
    >
      <Clock className="w-4 h-4" />
      <span>
        {isArabic ? "الجلسة:" : "Session:"}{" "}
        {formatTimeRemaining(timeUntilExpiry)}
      </span>
      {isExpiringSoon && (
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};
