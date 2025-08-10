import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Smartphone,
  Slack,
  Webhook,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  Star,
  StarOff,
  Volume2,
  VolumeX,
  Zap,
  Activity,
  TrendingUp,
  Users,
  Shield,
  Globe,
} from "lucide-react";
import { notificationManager } from "../../services/NotificationEngine.js";

export const NotificationCenter = ({ isArabic, currentUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'starred' | 'archived'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [channelHealth, setChannelHealth] = useState([]);
  const [deliveryStats, setDeliveryStats] = useState({});

  const loadNotifications = useCallback(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("in_app_notifications") || "[]"
      );
      const userNotifications = stored.filter(
        (notif) =>
          notif.recipientId === currentUserId || notif.recipientId === "all"
      );
      setNotifications(userNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    }
  }, [currentUserId]);

  useEffect(() => {
    const handleNewNotification = (event) => {
      console.log("New notification received:", event.detail);
      loadNotifications();
      if (soundEnabled) {
        playNotificationSound();
      }
    };

    const handleDeliveryUpdate = (event) => {
      // Update delivery status if needed
    };

    try {
      notificationManager.addEventListener(
        "notification-processed",
        handleNewNotification
      );
      notificationManager.addEventListener(
        "delivery-updated",
        handleDeliveryUpdate
      );
      console.log("Notification listeners setup successfully");
    } catch (error) {
      console.error("Failed to setup notification listeners:", error);
    }

    return () => {
      try {
        notificationManager.removeEventListener(
          "notification-processed",
          handleNewNotification
        );
        notificationManager.removeEventListener(
          "delivery-updated",
          handleDeliveryUpdate
        );
      } catch (error) {
        console.error("Failed to cleanup notification listeners:", error);
      }
    };
  }, [soundEnabled, loadNotifications]);

  useEffect(() => {
    loadNotifications();
    const updateStats = () => {
      try {
        setChannelHealth(notificationManager.getChannelHealth());
        setDeliveryStats(notificationManager.getDeliveryStats());
      } catch (error) {
        console.error("Failed to update notification stats:", error);
      }
    };
    updateStats();
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
      );
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (error) {}
  };

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        if (notification.read) return false;
        break;
      case "starred":
        if (!notification.starred) return false;
        break;
      case "archived":
        if (!notification.archived) return false;
        break;
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.content.body.toLowerCase().includes(searchLower) ||
        notification.content.subject?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived
  ).length;

  const markAsRead = (notificationId) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem("in_app_notifications", JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("in_app_notifications", JSON.stringify(updated));
  };

  const toggleStar = (notificationId) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, starred: !n.starred } : n
    );
    setNotifications(updated);
    localStorage.setItem("in_app_notifications", JSON.stringify(updated));
  };

  const archiveNotification = (notificationId) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, archived: true, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem("in_app_notifications", JSON.stringify(updated));
  };

  const deleteNotification = (notificationId) => {
    const updated = notifications.filter((n) => n.id !== notificationId);
    setNotifications(updated);
    localStorage.setItem("in_app_notifications", JSON.stringify(updated));
  };

  const bulkAction = (action) => {
    let updated = [...notifications];
    selectedNotifications.forEach((notificationId) => {
      switch (action) {
        case "read":
          updated = updated.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          );
          break;
        case "archive":
          updated = updated.map((n) =>
            n.id === notificationId ? { ...n, archived: true, read: true } : n
          );
          break;
        case "delete":
          updated = updated.filter((n) => n.id !== notificationId);
          break;
      }
    });
    setNotifications(updated);
    localStorage.setItem("in_app_notifications", JSON.stringify(updated));
    setSelectedNotifications(new Set());
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "medium":
        return <Info className="w-4 h-4 text-blue-600" />;
      case "low":
        return <Info className="w-4 h-4 text-gray-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "border-l-red-500 bg-red-50";
      case "high":
        return "border-l-orange-500 bg-orange-50";
      case "medium":
        return "border-l-blue-500 bg-blue-50";
      case "low":
        return "border-l-gray-500 bg-gray-50";
      default:
        return "border-l-gray-300 bg-white";
    }
  };

  const getChannelIcon = (channelType) => {
    switch (channelType) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "sms":
        return <MessageSquare className="w-4 h-4" />;
      case "push":
        return <Smartphone className="w-4 h-4" />;
      case "slack":
        return <Slack className="w-4 h-4" />;
      case "webhook":
        return <Webhook className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "degraded":
        return "text-yellow-600 bg-yellow-100";
      case "down":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={`Notifications ${
          unreadCount > 0 ? `(${unreadCount} unread)` : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-6 h-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden"
          role="dialog"
          aria-label="Notification center"
          aria-modal="false"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic ? "مركز التنبيهات" : "Notification Center"}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  aria-label={
                    soundEnabled
                      ? "Disable notification sound"
                      : "Enable notification sound"
                  }
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <VolumeX className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  aria-label="Notification settings"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  aria-label="Close notification center"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    isArabic
                      ? "البحث في التنبيهات..."
                      : "Search notifications..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "الكل" : "All"}
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === "unread"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "غير مقروء" : "Unread"} ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter("starred")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === "starred"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "مميز" : "Starred"}
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.size > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedNotifications.size} {isArabic ? "محدد" : "selected"}
                </span>
                <button
                  onClick={() => bulkAction("read")}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isArabic ? "تحديد كمقروء" : "Mark Read"}
                </button>
                <button
                  onClick={() => bulkAction("archive")}
                  className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  {isArabic ? "أرشفة" : "Archive"}
                </button>
                <button
                  onClick={() => bulkAction("delete")}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {isArabic ? "حذف" : "Delete"}
                </button>
              </div>
            )}

            {unreadCount > 0 && (
              <div className="mt-3">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isArabic ? "تحديد الكل كمقروء" : "Mark all as read"}
                </button>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-3">
                {isArabic ? "إعدادات التنبيهات" : "Notification Settings"}
              </h4>

              {/* Channel Health Status */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "حالة القنوات" : "Channel Health"}
                </h5>
                <div className="space-y-2">
                  {channelHealth.map((channel) => (
                    <div
                      key={channel.channelId}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {getChannelIcon(channel.channelId.split("_")[0])}
                        <span className="capitalize">
                          {channel.channelId.replace("_", " ")}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(
                          channel.status
                        )}`}
                      >
                        {channel.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Statistics */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "إحصائيات التسليم" : "Delivery Statistics"}
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded">
                    <div className="text-gray-600">
                      {isArabic ? "المرسل" : "Sent"}
                    </div>
                    <div className="font-semibold text-blue-600">
                      {deliveryStats.sent || 0}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <div className="text-gray-600">
                      {isArabic ? "المسلم" : "Delivered"}
                    </div>
                    <div className="font-semibold text-green-600">
                      {deliveryStats.delivered || 0}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <div className="text-gray-600">
                      {isArabic ? "الفاشل" : "Failed"}
                    </div>
                    <div className="font-semibold text-red-600">
                      {deliveryStats.failed || 0}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <div className="text-gray-600">
                      {isArabic ? "متوسط الوقت" : "Avg Time"}
                    </div>
                    <div className="font-semibold text-purple-600">
                      {deliveryStats.avgDeliveryTime
                        ? `${Math.round(deliveryStats.avgDeliveryTime / 1000)}s`
                        : "0s"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sound Settings */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {isArabic ? "تفعيل الصوت" : "Enable Sound"}
                </span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    soundEnabled ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  {isArabic ? "لا توجد تنبيهات" : "No notifications"}
                </p>
                <p className="text-sm text-gray-400">
                  {isArabic
                    ? "ستظهر التنبيهات الجديدة هنا"
                    : "New notifications will appear here"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(
                      notification.priority
                    )} ${!notification.read ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedNotifications);
                          if (e.target.checked) {
                            newSelected.add(notification.id);
                          } else {
                            newSelected.delete(notification.id);
                          }
                          setSelectedNotifications(newSelected);
                        }}
                        className="mt-1 rounded border-gray-300"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getPriorityIcon(notification.priority)}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(
                              notification.timestamp
                            ).toLocaleTimeString()}
                          </span>
                        </div>

                        {notification.content.subject && (
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {notification.content.subject}
                          </h4>
                        )}

                        <p className="text-sm text-gray-700 line-clamp-2">
                          {notification.content.body}
                        </p>

                        {notification.actions &&
                          notification.actions.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {notification.actions.map((action) => (
                                <button
                                  key={action.id}
                                  onClick={() => {
                                    if (action.url) {
                                      window.open(action.url, "_blank");
                                    }
                                    markAsRead(notification.id);
                                  }}
                                  className={`px-3 py-1 text-xs rounded transition-colors ${
                                    action.style === "primary"
                                      ? "bg-blue-600 text-white hover:bg-blue-700"
                                      : action.style === "danger"
                                      ? "bg-red-600 text-white hover:bg-red-700"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                                >
                                  {isArabic ? action.labelAr : action.label}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleStar(notification.id)}
                          className="p-1 text-gray-400 hover:text-yellow-500 rounded"
                        >
                          {notification.starred ? (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          ) : (
                            <StarOff className="w-4 h-4" />
                          )}
                        </button>

                        <div className="relative group">
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="w-full px-3 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              {notification.read ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                              {notification.read
                                ? isArabic
                                  ? "تحديد كغير مقروء"
                                  : "Mark unread"
                                : isArabic
                                ? "تحديد كمقروء"
                                : "Mark read"}
                            </button>
                            <button
                              onClick={() =>
                                archiveNotification(notification.id)
                              }
                              className="w-full px-3 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Archive className="w-3 h-3" />
                              {isArabic ? "أرشفة" : "Archive"}
                            </button>
                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="w-full px-3 py-1 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3 h-3" />
                              {isArabic ? "حذف" : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {filteredNotifications.length}{" "}
                {isArabic ? "تنبيه" : "notifications"}
              </span>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-green-500" />
                <span>{isArabic ? "مباشر" : "Real-time"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
