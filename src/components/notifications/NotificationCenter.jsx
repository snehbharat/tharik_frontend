import React, { useState, useEffect, useCallback, useRef } from "react";
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
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { notificationManager } from "../../services/NotificationEngine.js";
import { NotificationApiService } from "../../services/notificationApi.js";

export const NotificationCenter = ({ isArabic, currentUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [channelHealth, setChannelHealth] = useState([]);
  const [deliveryStats, setDeliveryStats] = useState({});

  // Pagination and loading states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({});

  // Use refs to track loading states and prevent multiple simultaneous calls
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);
  const debounceTimeoutRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((searchValue) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && searchValue !== searchTerm) {
        setSearchTerm(searchValue);
      }
    }, 300);
  }, [searchTerm]);

  // Load notifications from API with proper error handling and loading state
  const loadNotifications = useCallback(async (pageNum = pagination.page, filterValue = filter, searchValue = searchTerm) => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current || !mountedRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await NotificationApiService.getNotifications({
        page: pageNum,
        limit: pagination.limit,
        filter: filterValue,
        search: searchValue,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (!mountedRef.current) return;

      if (response.success && response.data) {
        const transformedNotifications = NotificationApiService.transformNotifications(
          response.data.notifications || []
        );
        setNotifications(transformedNotifications);
        setPagination(prev => ({
          ...prev,
          page: response.data.pagination?.current || pageNum,
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 0
        }));
      } else {
        throw new Error(response.message || 'Failed to load notifications');
      }
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error("Error loading notifications:", error);
      setError(error.message || "Failed to load notifications");
      setNotifications([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        pages: 0
      }));
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      loadingRef.current = false;
    }
  }, [pagination.limit]); // Remove dependencies that cause infinite loops

  // Load unread count with proper error handling
  const loadUnreadCount = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      const response = await NotificationApiService.getUnreadCount();
      if (mountedRef.current && response.success && response.data) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      if (mountedRef.current) {
        console.error("Error loading unread count:", error);
      }
    }
  }, []);

  // Load notification statistics with proper error handling
  const loadStats = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      const response = await NotificationApiService.getStats();
      if (mountedRef.current && response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      if (mountedRef.current) {
        console.error("Error loading notification stats:", error);
      }
    }
  }, []);

  // Initial load - only run once when component mounts
  useEffect(() => {
    let isCancelled = false;

    const initialLoad = async () => {
      if (isCancelled || !mountedRef.current) return;
      
      try {
        await Promise.all([
          loadNotifications(1, 'all', ''),
          loadUnreadCount(),
          loadStats()
        ]);
      } catch (error) {
        console.error('Initial load failed:', error);
      }
    };

    initialLoad();

    return () => {
      isCancelled = true;
    };
  }, []); // Empty dependency array - only run on mount

  // Handle filter changes (reset to first page)
  useEffect(() => {
    if (mountedRef.current) {
      setPagination(prev => ({ ...prev, page: 1 }));
      loadNotifications(1, filter, searchTerm);
    }
  }, [filter]);

  // Handle search changes (reset to first page)
  useEffect(() => {
    if (mountedRef.current) {
      setPagination(prev => ({ ...prev, page: 1 }));
      loadNotifications(1, filter, searchTerm);
    }
  }, [searchTerm]);

  // Setup event listeners for real-time updates
  useEffect(() => {
    if (!notificationManager) return;

    const handleNewNotification = (event) => {
      console.log("New notification received:", event.detail);
      // Only refresh if component is mounted and not loading
      if (mountedRef.current && !loadingRef.current) {
        loadNotifications(pagination.page, filter, searchTerm);
        loadUnreadCount();
        if (soundEnabled) {
          playNotificationSound();
        }
      }
    };

    const handleDeliveryUpdate = (event) => {
      if (mountedRef.current && !loadingRef.current) {
        loadStats();
      }
    };

    try {
      notificationManager.addEventListener("notification-processed", handleNewNotification);
      notificationManager.addEventListener("delivery-updated", handleDeliveryUpdate);
    } catch (error) {
      console.error("Failed to setup notification listeners:", error);
    }

    return () => {
      try {
        notificationManager.removeEventListener("notification-processed", handleNewNotification);
        notificationManager.removeEventListener("delivery-updated", handleDeliveryUpdate);
      } catch (error) {
        console.error("Failed to cleanup notification listeners:", error);
      }
    };
  }, [soundEnabled, pagination.page, filter, searchTerm]);

  // Update channel health and delivery stats with controlled intervals
  useEffect(() => {
    if (!notificationManager) return;

    const updateStats = () => {
      if (!mountedRef.current) return;
      
      try {
        setChannelHealth(notificationManager.getChannelHealth());
        setDeliveryStats(notificationManager.getDeliveryStats());
      } catch (error) {
        console.error("Failed to update notification stats:", error);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const playNotificationSound = () => {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
      );
      audio.volume = 0.3;
      audio.play().catch(() => { });
    } catch (error) { }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await NotificationApiService.markAsRead(notificationId);
      if (response.success && mountedRef.current) {
        // Update local state optimistically
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId
              ? { ...n, read: true, readAt: new Date().toISOString() }
              : n
          )
        );
        // Update unread count
        loadUnreadCount();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      const response = await NotificationApiService.markAllAsRead();
      
      if (response.success && mountedRef.current) {
        // Refresh notifications and unread count
        await Promise.all([
          loadNotifications(pagination.page, filter, searchTerm), 
          loadUnreadCount()
        ]);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      if (mountedRef.current) {
        setError("Failed to mark all as read");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      loadingRef.current = false;
    }
  };

  const toggleStar = async (notificationId) => {
    try {
      const response = await NotificationApiService.toggleStar(notificationId);
      if (response.success && mountedRef.current) {
        // Update local state optimistically
        const updatedNotification = NotificationApiService.transformNotification(response.data);
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? updatedNotification : n))
        );
      }
    } catch (error) {
      console.error("Error toggling star:", error);
    }
  };

  const archiveNotification = async (notificationId) => {
    try {
      const response = await NotificationApiService.archiveNotification(notificationId);
      if (response.success && mountedRef.current) {
        // Remove from current view or update based on filter
        if (filter === 'archived') {
          loadNotifications(pagination.page, filter, searchTerm);
        } else {
          setNotifications(prev => prev.filter(n => n.id !== notificationId));
        }
        loadUnreadCount();
      }
    } catch (error) {
      console.error("Error archiving notification:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await NotificationApiService.deleteNotification(notificationId);
      if (response.success && mountedRef.current) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        loadUnreadCount();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const bulkAction = async (action) => {
    if (selectedNotifications.size === 0 || loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      const notificationIds = Array.from(selectedNotifications);
      const response = await NotificationApiService.bulkOperation(action, notificationIds);

      if (response.success && mountedRef.current) {
        setSelectedNotifications(new Set());
        await Promise.all([
          loadNotifications(pagination.page, filter, searchTerm), 
          loadUnreadCount()
        ]);
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
      if (mountedRef.current) {
        setError(`Failed to ${action} selected notifications`);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      loadingRef.current = false;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages && newPage !== pagination.page && !loadingRef.current) {
      setPagination(prev => ({ ...prev, page: newPage }));
      loadNotifications(newPage, filter, searchTerm);
    }
  };

  const refreshNotifications = () => {
    if (!loadingRef.current) {
      loadNotifications(pagination.page, filter, searchTerm);
      loadUnreadCount();
      loadStats();
    }
  };

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
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
    switch (priority?.toLowerCase()) {
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
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
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
                  onClick={refreshNotifications}
                  disabled={loading}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded disabled:opacity-50"
                  aria-label="Refresh notifications"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  aria-label={soundEnabled ? "Disable notification sound" : "Enable notification sound"}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  aria-label="Notification settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  aria-label="Close notification center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={isArabic ? "البحث في التنبيهات..." : "Search notifications..."}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {isArabic ? "الكل" : "All"} ({stats.total || 0})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${filter === "unread"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {isArabic ? "غير مقروء" : "Unread"} ({stats.unread || 0})
                </button>
                <button
                  onClick={() => setFilter("starred")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${filter === "starred"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {isArabic ? "مميز" : "Starred"} ({stats.starred || 0})
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 text-xs underline mt-1"
                >
                  {isArabic ? "إخفاء" : "Dismiss"}
                </button>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedNotifications.size > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedNotifications.size} {isArabic ? "محدد" : "selected"}
                </span>
                <button
                  onClick={() => bulkAction("read")}
                  disabled={loading}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isArabic ? "تحديد كمقروء" : "Mark Read"}
                </button>
                <button
                  onClick={() => bulkAction("archive")}
                  disabled={loading}
                  className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  {isArabic ? "أرشفة" : "Archive"}
                </button>
                <button
                  onClick={() => bulkAction("delete")}
                  disabled={loading}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {isArabic ? "حذف" : "Delete"}
                </button>
              </div>
            )}

            {unreadCount > 0 && (
              <div className="mt-3">
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline mr-1" />
                  ) : null}
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
                    <div key={channel.channelId} className="flex items-center justify-between text-sm">
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
                    <div className="text-gray-600">{isArabic ? "المرسل" : "Sent"}</div>
                    <div className="font-semibold text-blue-600">{deliveryStats.sent || 0}</div>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <div className="text-gray-600">{isArabic ? "المسلم" : "Delivered"}</div>
                    <div className="font-semibold text-green-600">{deliveryStats.delivered || 0}</div>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <div className="text-gray-600">{isArabic ? "الفاشل" : "Failed"}</div>
                    <div className="font-semibold text-red-600">{deliveryStats.failed || 0}</div>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <div className="text-gray-600">{isArabic ? "متوسط الوقت" : "Avg Time"}</div>
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soundEnabled ? "bg-blue-600" : "bg-gray-200"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soundEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-500">
                  {isArabic ? "جاري تحميل التنبيهات..." : "Loading notifications..."}
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchTerm
                    ? isArabic
                      ? "لا توجد نتائج للبحث"
                      : "No search results"
                    : isArabic
                      ? "لا توجد تنبيهات"
                      : "No notifications"}
                </p>
                <p className="text-sm text-gray-400">
                  {searchTerm
                    ? isArabic
                      ? "جرب مصطلح بحث مختلف"
                      : "Try a different search term"
                    : isArabic
                      ? "ستظهر التنبيهات الجديدة هنا"
                      : "New notifications will appear here"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
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
                            {new Date(notification.timestamp).toLocaleTimeString(
                              isArabic ? 'ar' : 'en',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </span>
                          {notification.sender && (
                            <span className="text-xs text-gray-500 italic">
                              {isArabic ? "من" : "from"} {notification.sender.name || notification.sender.email}
                            </span>
                          )}
                        </div>

                        {notification.content?.subject && (
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {notification.content.subject}
                          </h4>
                        )}

                        <p className="text-sm text-gray-700 line-clamp-2">
                          {notification.content?.body || 'No content available'}
                        </p>

                        {notification.actions && notification.actions.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {notification.actions.map((action) => (
                              <button
                                key={action.id}
                                onClick={() => {
                                  if (action.url) {
                                    window.open(action.url, "_blank");
                                  }
                                  if (!notification.read) {
                                    markAsRead(notification.id);
                                  }
                                }}
                                className={`px-3 py-1 text-xs rounded transition-colors ${action.style === "primary"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : action.style === "danger"
                                      ? "bg-red-600 text-white hover:bg-red-700"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                              >
                                {isArabic ? action.labelAr || action.label : action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleStar(notification.id)}
                          className="p-1 text-gray-400 hover:text-yellow-500 rounded"
                          aria-label={notification.starred ? "Remove star" : "Add star"}
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

                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-32">
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="w-full px-3 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              {notification.read ? (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  {isArabic ? "تحديد كغير مقروء" : "Mark unread"}
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3" />
                                  {isArabic ? "تحديد كمقروء" : "Mark read"}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => archiveNotification(notification.id)}
                              className="w-full px-3 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Archive className="w-3 h-3" />
                              {isArabic ? "أرشفة" : "Archive"}
                            </button>
                            <button
                              onClick={() => deleteNotification(notification.id)}
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {isArabic ? "صفحة" : "Page"} {pagination.page} {isArabic ? "من" : "of"} {pagination.pages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-500 px-2">
                    {pagination.page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages || loading}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {pagination.total} {isArabic ? "تنبيه" : "notifications"}
                {searchTerm && ` (${isArabic ? "مفلتر" : "filtered"})`}
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