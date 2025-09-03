import { apiClient } from "./ApiClient";

export class NotificationApiService {
  /**
   * Get paginated notifications with filtering and sorting
   */
  static async getNotifications({
    page = 1,
    limit = 50,
    filter = 'all',
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        filter,
        sortBy,
        sortOrder
      });

      if (search) {
        params.append('search', search);
      }

      const response = await apiClient.getCC(`/notifications?${params}`);
      
      // Ensure consistent response structure
      return {
        success: true,
        data: {
          notifications: response?.data?.notifications || [],
          pagination: {
            current: response?.data?.pagination?.current || page,
            pages: response?.data?.pagination?.pages || 0,
            total: response?.data?.pagination?.total || 0,
            hasNext: response?.data?.pagination?.hasNext || false,
            hasPrev: response?.data?.pagination?.hasPrev || false
          }
        },
        message: response.data?.message || 'Notifications retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount() {
    try {
      const response = await apiClient.getCC('/notifications/unread-count');
      return {
        success: true,
        data: {
          unreadCount: response.data?.data?.unreadCount || 0
        },
        message: response.data?.message || 'Unread count retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Get notification statistics
   */
  static async getStats() {
    try {
      const response = await apiClient.getCC('/notifications/stats');
      return {
        success: true,
        data: response.data?.data || {
          total: 0,
          unread: 0,
          starred: 0,
          archived: 0
        },
        message: response.data?.message || 'Stats retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Get recent notifications
   */
  static async getRecentNotifications(hours = 24) {
    try {
      const response = await apiClient.getCC(`/notifications/recent?hours=${hours}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message || 'Recent notifications retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching recent notifications:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Get specific notification by ID
   */
  static async getNotificationById(notificationId) {
    try {
      const response = await apiClient.getCC(`/notifications/${notificationId}`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Notification retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching notification:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Create a new notification
   */
  static async createNotification(notificationData) {
    try {
      const response = await apiClient.post('/notifications', notificationData);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Notification created successfully'
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId) {
    try {
      const response = await apiClient.patch(`/notifications/${notificationId}/read`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Notification marked as read'
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead() {
    try {
      const response = await apiClient.patch('/notifications/mark-all-read');
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'All notifications marked as read'
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Toggle star status of notification
   */
  static async toggleStar(notificationId) {
    try {
      const response = await apiClient.patch(`/notifications/${notificationId}/star`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Star status updated'
      };
    } catch (error) {
      console.error('Error toggling star status:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Archive notification
   */
  static async archiveNotification(notificationId) {
    try {
      const response = await apiClient.patch(`/notifications/${notificationId}/archive`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Notification archived'
      };
    } catch (error) {
      console.error('Error archiving notification:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId) {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Notification deleted'
      };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Perform bulk operations on notifications
   */
  static async bulkOperation(operation, notificationIds) {
    try {
      const response = await apiClient.post('/notifications/bulk', {
        operation,
        notificationIds
      });
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || `Bulk ${operation} completed`
      };
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Create system notification (Admin only)
   */
  static async createSystemNotification(systemNotificationData) {
    try {
      const response = await apiClient.post('/notifications/system', systemNotificationData);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'System notification created'
      };
    } catch (error) {
      console.error('Error creating system notification:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Create bulk notifications (Admin only)
   */
  static async createBulkNotifications(bulkData) {
    try {
      const response = await apiClient.post('/notifications/bulk-create', bulkData);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Bulk notifications created'
      };
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Clean up expired notifications (Admin only)
   */
  static async cleanupExpired() {
    try {
      const response = await apiClient.delete('/notifications/cleanup-expired');
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Expired notifications cleaned up'
      };
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      return this.handleApiError(error);
    }
  }

  /**
   * Handle API errors consistently
   */
  static handleApiError(error) {
    const defaultError = {
      success: false,
      message: 'An unexpected error occurred',
      errors: [],
      data: null
    };

    // Handle axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        message: error.response.data?.message || `HTTP Error ${error.response.status}`,
        errors: error.response.data?.errors || [],
        status: error.response.status,
        data: null
      };
    }

    if (error.request) {
      // The request was made but no response was received
      return {
        ...defaultError,
        message: 'Network error - please check your connection',
        errors: ['NETWORK_ERROR']
      };
    }

    // Something happened in setting up the request that triggered an Error
    return {
      ...defaultError,
      message: error.message || defaultError.message,
      errors: ['UNKNOWN_ERROR']
    };
  }

  /**
   * Utility method to transform API response data to match frontend expectations
   */
  static transformNotification(apiNotification) {
    if (!apiNotification) return null;

    return {
      id: apiNotification.id || apiNotification._id,
      recipientId: apiNotification.recipientId,
      senderId: apiNotification.senderId,
      timestamp: apiNotification.timestamp || apiNotification.createdAt,
      content: {
        subject: apiNotification.content?.subject || '',
        body: apiNotification.content?.body || ''
      },
      priority: (apiNotification.priority || 'medium').toLowerCase(),
      read: Boolean(apiNotification.read),
      readAt: apiNotification.readAt,
      starred: Boolean(apiNotification.starred || apiNotification.metadata?.starred),
      archived: Boolean(apiNotification.archived || apiNotification.metadata?.archived),
      expiresAt: apiNotification.expiresAt,
      actions: apiNotification.actions || [],
      sender: apiNotification.sender,
      metadata: apiNotification.metadata || {}
    };
  }

  /**
   * Transform multiple notifications
   */
  static transformNotifications(apiNotifications) {
    if (!Array.isArray(apiNotifications)) return [];
    return apiNotifications.map(this.transformNotification).filter(Boolean);
  }

  /**
   * Validate notification data before sending
   */
  static validateNotificationData(notificationData) {
    const errors = [];

    if (!notificationData.recipientId) {
      errors.push('recipientId is required');
    }

    if (!notificationData.content || !notificationData.content.body) {
      errors.push('notification content body is required');
    }

    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (notificationData.priority && !validPriorities.includes(notificationData.priority.toLowerCase())) {
      errors.push('priority must be one of: low, medium, high, critical');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format notification for display
   */
  static formatNotificationForDisplay(notification, isArabic = false) {
    const timeAgo = this.getTimeAgo(notification.timestamp, isArabic);
    const priorityText = this.getPriorityText(notification.priority, isArabic);

    return {
      ...notification,
      displayTime: timeAgo,
      displayPriority: priorityText,
      isUnread: !notification.read,
      isStarred: notification.starred,
      isArchived: notification.archived
    };
  }

  /**
   * Get time ago string for notification timestamp
   */
  static getTimeAgo(timestamp, isArabic = false) {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) {
      return isArabic ? 'الآن' : 'now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return isArabic 
        ? `منذ ${diffInMinutes} دقيقة${diffInMinutes > 1 ? '' : ''}`
        : `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return isArabic 
        ? `منذ ${diffInHours} ساعة${diffInHours > 1 ? '' : ''}`
        : `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return isArabic 
        ? `منذ ${diffInDays} يوم${diffInDays > 1 ? '' : ''}`
        : `${diffInDays}d ago`;
    }

    return notificationTime.toLocaleDateString(isArabic ? 'ar' : 'en');
  }

  /**
   * Get priority display text
   */
  static getPriorityText(priority, isArabic = false) {
    const priorityMap = {
      low: isArabic ? 'منخفض' : 'Low',
      medium: isArabic ? 'متوسط' : 'Medium', 
      high: isArabic ? 'عالي' : 'High',
      critical: isArabic ? 'عاجل' : 'Critical'
    };

    return priorityMap[priority?.toLowerCase()] || priorityMap.medium;
  }
}

export default NotificationApiService;