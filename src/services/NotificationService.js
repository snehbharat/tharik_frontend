export class NotificationService {
  static NOTIFICATIONS_KEY = "notifications";
  static TEMPLATES_KEY = "notification_templates";

  /**
   * Initialize default notification templates
   */
  static initializeTemplates() {
    const existingTemplates = this.getNotificationTemplates();
    if (existingTemplates.length === 0) {
      const defaultTemplates = [
        {
          id: "clock_in_reminder",
          name: "Clock-in Reminder",
          type: "attendance_reminder",
          subject: "Time to Clock In",
          bodyTemplate:
            "Hello {{employeeName}}, your shift starts in {{minutes}} minutes. Please clock in on time.",
          variables: { employeeName: "string", minutes: "number" },
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: "clock_out_reminder",
          name: "Clock-out Reminder",
          type: "attendance_reminder",
          subject: "Time to Clock Out",
          bodyTemplate:
            "Hello {{employeeName}}, your shift has ended. Please remember to clock out.",
          variables: { employeeName: "string" },
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: "leave_request_approval",
          name: "Leave Request Approval",
          type: "leave_management",
          subject: "Leave Request Requires Approval",
          bodyTemplate:
            "{{employeeName}} has submitted a leave request from {{startDate}} to {{endDate}}. Please review and approve.",
          variables: {
            employeeName: "string",
            startDate: "string",
            endDate: "string",
          },
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: "leave_request_approved",
          name: "Leave Request Approved",
          type: "leave_management",
          subject: "Your Leave Request Has Been Approved",
          bodyTemplate:
            "Your leave request from {{startDate}} to {{endDate}} has been approved by {{approverName}}.",
          variables: {
            startDate: "string",
            endDate: "string",
            approverName: "string",
          },
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: "overtime_alert",
          name: "Overtime Alert",
          type: "compliance",
          subject: "Overtime Hours Alert",
          bodyTemplate:
            "{{employeeName}} has worked {{overtimeHours}} overtime hours this week. Please review if additional approval is needed.",
          variables: { employeeName: "string", overtimeHours: "number" },
          isActive: true,
          createdAt: new Date(),
        },
      ];

      localStorage.setItem(
        this.TEMPLATES_KEY,
        JSON.stringify(defaultTemplates)
      );
    }
  }

  static async sendAttendanceReminder(
    employeeId,
    reminderType,
    variables = {}
  ) {
    try {
      let templateId;
      switch (reminderType) {
        case "clock-in":
          templateId = "clock_in_reminder";
          break;
        case "clock-out":
          templateId = "clock_out_reminder";
          break;
        default:
          templateId = "clock_out_reminder";
      }

      await this.sendNotification(employeeId, templateId, variables);
    } catch (error) {
      console.error("Send attendance reminder failed:", error);
    }
  }

  static async sendLeaveRequestNotification(
    leaveRequestId,
    approverId,
    variables
  ) {
    try {
      await this.sendNotification(approverId, "leave_request_approval", {
        ...variables,
        leaveRequestId,
      });
    } catch (error) {
      console.error("Send leave request notification failed:", error);
    }
  }

  static async sendBulkNotification(templateId, recipients, variables) {
    try {
      const promises = recipients.map((recipientId) =>
        this.sendNotification(recipientId, templateId, variables)
      );
      await Promise.all(promises);
      console.log(`Bulk notification sent to ${recipients.length} recipients`);
    } catch (error) {
      console.error("Send bulk notification failed:", error);
    }
  }

  static async sendNotification(recipientId, templateId, variables = {}) {
    try {
      const template = this.getNotificationTemplates().find(
        (t) => t.id === templateId
      );
      if (!template || !template.isActive) {
        throw new Error("Notification template not found or inactive");
      }

      let message = template.bodyTemplate;
      let subject = template.subject || "";

      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        message = message.replace(new RegExp(placeholder, "g"), String(value));
        subject = subject.replace(new RegExp(placeholder, "g"), String(value));
      });

      const notification = {
        id: this.generateId(),
        templateId,
        recipientId,
        type: "in-app",
        subject,
        message,
        data: variables,
        status: "pending",
        scheduledAt: new Date(),
        retryCount: 0,
        createdAt: new Date(),
      };

      const notifications = this.getNotifications();
      notifications.push(notification);
      localStorage.setItem(
        this.NOTIFICATIONS_KEY,
        JSON.stringify(notifications)
      );

      setTimeout(() => {
        this.markNotificationAsSent(notification.id);
      }, 1000);
    } catch (error) {
      console.error("Send notification failed:", error);
    }
  }

  static async processNotificationQueue() {
    try {
      const notifications = this.getNotifications();
      const pendingNotifications = notifications.filter(
        (n) => n.status === "pending"
      );

      for (const notification of pendingNotifications) {
        try {
          await this.deliverNotification(notification);
          this.markNotificationAsSent(notification.id);
        } catch (error) {
          this.markNotificationAsFailed(notification.id, error.message);
        }
      }
    } catch (error) {
      console.error("Process notification queue failed:", error);
    }
  }

  static async getNotificationHistory(employeeId, page = 1, limit = 20) {
    try {
      const allNotifications = this.getNotifications()
        .filter((n) => n.recipientId === employeeId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      const total = allNotifications.length;
      const startIndex = (page - 1) * limit;
      const notifications = allNotifications.slice(
        startIndex,
        startIndex + limit
      );

      return { notifications, total };
    } catch (error) {
      console.error("Get notification history failed:", error);
      return { notifications: [], total: 0 };
    }
  }

  static async deliverNotification(notification) {
    switch (notification.type) {
      case "email":
        await this.sendEmail(notification);
        break;
      case "push":
        await this.sendPushNotification(notification);
        break;
      case "sms":
        await this.sendSMS(notification);
        break;
      case "in-app":
        await this.sendInAppNotification(notification);
        break;
    }
  }

  static async sendEmail(notification) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.05) {
          resolve();
        } else {
          reject(new Error("Email delivery failed"));
        }
      }, 500);
    });
  }

  static async sendPushNotification(notification) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.02) {
          resolve();
        } else {
          reject(new Error("Push notification failed"));
        }
      }, 200);
    });
  }

  static async sendSMS(notification) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.03) {
          resolve();
        } else {
          reject(new Error("SMS delivery failed"));
        }
      }, 1000);
    });
  }

  static async sendInAppNotification(notification) {
    return Promise.resolve();
  }

  static markNotificationAsSent(notificationId) {
    const notifications = this.getNotifications();
    const index = notifications.findIndex((n) => n.id === notificationId);

    if (index !== -1) {
      notifications[index] = {
        ...notifications[index],
        status: "sent",
        sentAt: new Date(),
      };
      localStorage.setItem(
        this.NOTIFICATIONS_KEY,
        JSON.stringify(notifications)
      );
    }
  }

  static markNotificationAsFailed(notificationId, errorMessage) {
    const notifications = this.getNotifications();
    const index = notifications.findIndex((n) => n.id === notificationId);

    if (index !== -1) {
      notifications[index] = {
        ...notifications[index],
        status: "failed",
        errorMessage,
        retryCount: notifications[index].retryCount + 1,
      };
      localStorage.setItem(
        this.NOTIFICATIONS_KEY,
        JSON.stringify(notifications)
      );
    }
  }

  static getNotifications() {
    try {
      const notifications = localStorage.getItem(this.NOTIFICATIONS_KEY);
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error("Error loading notifications:", error);
      return [];
    }
  }

  static getNotificationTemplates() {
    try {
      const templates = localStorage.getItem(this.TEMPLATES_KEY);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error("Error loading notification templates:", error);
      return [];
    }
  }

  static generateId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
