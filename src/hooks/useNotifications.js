import { useState, useEffect, useCallback } from "react";
import { notificationManager } from "../services/NotificationEngine.js";

export const useNotifications = (options) => {
  const { userId, autoRefresh = true, refreshInterval = 30000 } = options;

  const [notifications, setNotifications] = useState([]);
  const [channelHealth, setChannelHealth] = useState([]);
  const [deliveryStats, setDeliveryStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("in_app_notifications") || "[]"
      );
      const userNotifications = stored.filter(
        (notif) => notif.recipientId === userId || notif.recipientId === "all"
      );
      setNotifications(userNotifications);
      setError(null);
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Error loading notifications:", err);
    }
  }, [userId]);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    try {
      loadNotifications();
      setChannelHealth(notificationManager.getChannelHealth());
      setDeliveryStats(notificationManager.getDeliveryStats());
    } catch (err) {
      setError("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  }, [loadNotifications]);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await notificationManager.initialize();
        refreshData();
      } catch (err) {
        setError("Failed to initialize notifications");
        setIsLoading(false);
      }
    };

    initializeNotifications();

    const handleNotificationProcessed = (event) => {
      console.log("New notification processed:", event.detail);
      loadNotifications();

      const eventData = event.detail;
      if (eventData.event?.metadata?.userId === userId) {
        playNotificationSound();
      }
    };

    const handleDeliveryUpdate = (event) => {
      console.log("Delivery status updated:", event.detail);
      setDeliveryStats(notificationManager.getDeliveryStats());
    };

    const handleChannelHealthChanged = (event) => {
      console.log("Channel health changed:", event.detail);
      setChannelHealth(notificationManager.getChannelHealth());
    };

    notificationManager.addEventListener(
      "notification-processed",
      handleNotificationProcessed
    );
    notificationManager.addEventListener(
      "delivery-updated",
      handleDeliveryUpdate
    );
    notificationManager.addEventListener(
      "channel-health-changed",
      handleChannelHealthChanged
    );

    let refreshTimer;
    if (autoRefresh) {
      refreshTimer = setInterval(refreshData, refreshInterval);
    }

    return () => {
      notificationManager.removeEventListener(
        "notification-processed",
        handleNotificationProcessed
      );
      notificationManager.removeEventListener(
        "delivery-updated",
        handleDeliveryUpdate
      );
      notificationManager.removeEventListener(
        "channel-health-changed",
        handleChannelHealthChanged
      );

      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [userId, autoRefresh, refreshInterval, loadNotifications, refreshData]);

  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived
  ).length;

  const sendNotification = useCallback(async (event) => {
    try {
      await notificationManager.sendNotification(event);
    } catch (err) {
      setError("Failed to send notification");
      throw err;
    }
  }, []);

  const markAsRead = useCallback(
    (notificationId) => {
      const updated = notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      setNotifications(updated);
      localStorage.setItem("in_app_notifications", JSON.stringify(updated));
    },
    [notifications]
  );

  const markAllAsRead = useCallback(() => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("in_app_notifications", JSON.stringify(updated));
  }, [notifications]);

  const deleteNotification = useCallback(
    (notificationId) => {
      const updated = notifications.filter((n) => n.id !== notificationId);
      setNotifications(updated);
      localStorage.setItem("in_app_notifications", JSON.stringify(updated));
    },
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    channelHealth,
    deliveryStats,
    isLoading,
    error,
    sendNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshData,
  };
};

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.2
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
      );
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (fallbackError) {
      // ignore
    }
  }
};

export const useNotificationSender = () => {
  const sendDocumentExpiryAlert = useCallback(async (employeeData) => {
    const event = {
      id: `doc_expiry_${Date.now()}`,
      type: "document_expiry_check",
      source: "document_monitor",
      data: employeeData,
      metadata: {
        timestamp: new Date(),
      },
      priority: employeeData.daysRemaining <= 7 ? "critical" : "high",
    };
    return notificationManager.sendNotification(event);
  }, []);

  const sendProjectStatusChange = useCallback(async (projectData) => {
    const event = {
      id: `proj_status_${Date.now()}`,
      type: "project_status_changed",
      source: "project_manager",
      data: projectData,
      metadata: {
        timestamp: new Date(),
      },
      priority: "high",
    };
    return notificationManager.sendNotification(event);
  }, []);

  const sendPayrollComplete = useCallback(async (payrollData) => {
    const event = {
      id: `payroll_${Date.now()}`,
      type: "payroll_processed",
      source: "payroll_system",
      data: { ...payrollData, status: "completed" },
      metadata: {
        timestamp: new Date(),
      },
      priority: "medium",
    };
    return notificationManager.sendNotification(event);
  }, []);

  const sendCustomNotification = useCallback(
    async (type, data, priority = "medium") => {
      const event = {
        id: `custom_${Date.now()}`,
        type,
        source: "manual",
        data,
        metadata: {
          timestamp: new Date(),
        },
        priority,
      };
      return notificationManager.sendNotification(event);
    },
    []
  );

  return {
    sendDocumentExpiryAlert,
    sendProjectStatusChange,
    sendPayrollComplete,
    sendCustomNotification,
  };
};

export const useNotificationPreferences = (userId) => {
  const [preferences, setPreferences] = useState({
    channels: ["email_primary", "in_app"],
    frequency: "immediate",
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "07:00",
      timezone: "Asia/Riyadh",
    },
    languages: ["en-US", "ar-SA"],
    soundEnabled: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`notification_preferences_${userId}`);
      if (stored) {
        setPreferences((prev) => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch (error) {
      console.error("Error loading notification preferences:", error);
    }
  }, [userId]);

  const updatePreferences = useCallback(
    (newPreferences) => {
      setPreferences((prev) => {
        const updated = { ...prev, ...newPreferences };
        localStorage.setItem(
          `notification_preferences_${userId}`,
          JSON.stringify(updated)
        );
        return updated;
      });
    },
    [userId]
  );

  return {
    preferences,
    updatePreferences,
  };
};
