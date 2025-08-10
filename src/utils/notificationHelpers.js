export class NotificationHelpers {
  // ==================== QUICK NOTIFICATION SENDERS ====================

  static async sendDocumentExpiryAlert(data, options = {}) {
    const { notificationManager } = await import(
      "../services/NotificationEngine"
    );

    return notificationManager.sendNotification({
      id: `doc_expiry_${Date.now()}`,
      type: "document_expiry_check",
      source: "document_monitor",
      data: {
        ...data,
        urgency:
          data.daysRemaining <= 7
            ? "critical"
            : data.daysRemaining <= 30
            ? "high"
            : "medium",
      },
      metadata: {
        timestamp: new Date(),
        category: "compliance",
        department: "hr",
      },
      priority:
        options.priority || (data.daysRemaining <= 7 ? "critical" : "high"),
    });
  }

  static async sendProjectStatusAlert(data, options = {}) {
    const { notificationManager } = await import(
      "../services/NotificationEngine"
    );

    return notificationManager.sendNotification({
      id: `proj_status_${Date.now()}`,
      type: "project_status_changed",
      source: "project_manager",
      data: {
        ...data,
        statusChange: `${data.oldStatus} → ${data.newStatus}`,
        timestamp: new Date().toISOString(),
      },
      metadata: {
        timestamp: new Date(),
        category: "operations",
        department: "operations",
      },
      priority: options.priority || "high",
    });
  }

  static async sendPayrollAlert(data, options = {}) {
    const { notificationManager } = await import(
      "../services/NotificationEngine"
    );

    return notificationManager.sendNotification({
      id: `payroll_${Date.now()}`,
      type: "payroll_processed",
      source: "payroll_system",
      data: {
        ...data,
        formattedAmount: new Intl.NumberFormat("en-SA", {
          style: "currency",
          currency: "SAR",
        }).format(data.totalAmount),
      },
      metadata: {
        timestamp: new Date(),
        category: "finance",
        department: "hr",
      },
      priority: options.priority || "medium",
    });
  }

  static async sendSafetyAlert(data, options = {}) {
    const { notificationManager } = await import(
      "../services/NotificationEngine"
    );

    return notificationManager.sendNotification({
      id: `safety_${Date.now()}`,
      type: "safety_incident",
      source: "safety_system",
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        requiresInvestigation:
          data.severity === "high" || data.severity === "critical",
      },
      metadata: {
        timestamp: new Date(),
        category: "safety",
        department: "safety",
        urgent: data.severity === "critical",
      },
      priority: data.severity === "critical" ? "critical" : "high",
    });
  }

  static async sendEmployeeOnboardingAlert(data, options = {}) {
    const { notificationManager } = await import(
      "../services/NotificationEngine"
    );

    return notificationManager.sendNotification({
      id: `onboarding_${Date.now()}`,
      type: "employee_onboarding",
      source: "hr_system",
      data: {
        ...data,
        daysInOnboarding: Math.floor(
          (new Date().getTime() - new Date(data.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        isOverdue:
          data.completionPercentage < 50 &&
          new Date() >
            new Date(
              new Date(data.startDate).getTime() + 7 * 24 * 60 * 60 * 1000
            ),
      },
      metadata: {
        timestamp: new Date(),
        category: "hr",
        department: "hr",
      },
      priority: options.priority || "medium",
    });
  }

  static async sendComplianceAlert(data, options = {}) {
    const { notificationManager } = await import(
      "../services/NotificationEngine"
    );

    return notificationManager.sendNotification({
      id: `compliance_${Date.now()}`,
      type: "compliance_violation",
      source: "compliance_monitor",
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        requiresImmediateAction: data.severity === "critical",
        daysToDeadline: data.deadline
          ? Math.ceil(
              (new Date(data.deadline).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null,
      },
      metadata: {
        timestamp: new Date(),
        category: "compliance",
        department: "legal",
      },
      priority: data.severity === "critical" ? "critical" : "high",
    });
  }

  static async sendMaintenanceAlert(data, options = {}) {
    const { notificationManager } = await import(
      "../services/NotificationEngine"
    );

    return notificationManager.sendNotification({
      id: `maintenance_${Date.now()}`,
      type: "equipment_maintenance",
      source: "maintenance_system",
      data: {
        ...data,
        daysUntilMaintenance: Math.ceil(
          (new Date(data.scheduledDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        isOverdue: new Date(data.scheduledDate) < new Date(),
      },
      metadata: {
        timestamp: new Date(),
        category: "maintenance",
        department: "operations",
      },
      priority: options.priority || data.priority,
    });
  }

  // ==================== BATCH NOTIFICATION SENDERS ====================

  static async sendBulkDocumentExpiryAlerts(employees) {
    const notifications = [];

    for (const employee of employees) {
      for (const document of employee.documents) {
        if (document.daysRemaining <= 90) {
          // Only send for documents expiring within 90 days
          notifications.push(
            this.sendDocumentExpiryAlert({
              employeeId: employee.employeeId,
              employeeName: employee.employeeName,
              documentType: document.type,
              expiryDate: document.expiryDate,
              daysRemaining: document.daysRemaining,
            })
          );
        }
      }
    }

    return Promise.allSettled(notifications);
  }

  static async sendDailyDigest(recipientId, data) {
    const { notificationManager } = await import(
      "../services/NotificationEngine"
    );

    return notificationManager.sendNotification({
      id: `digest_${Date.now()}`,
      type: "daily_digest",
      source: "digest_generator",
      data: {
        ...data,
        generatedAt: new Date().toISOString(),
      },
      metadata: {
        timestamp: new Date(),
        category: "digest",
        recipientId,
      },
      priority: "low",
    });
  }

  // ==================== NOTIFICATION FORMATTING ====================

  static formatCurrency(amount, currency = "SAR", locale = "en-SA") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatDate(date, locale = "en-SA", options) {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    });
  }

  static formatRelativeTime(date, locale = "en-US") {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - dateObj.getTime()) / 1000
    );

    if (diffInSeconds < 60) return locale === "ar-SA" ? "الآن" : "now";
    if (diffInSeconds < 3600)
      return locale === "ar-SA"
        ? `${Math.floor(diffInSeconds / 60)} دقيقة`
        : `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return locale === "ar-SA"
        ? `${Math.floor(diffInSeconds / 3600)} ساعة`
        : `${Math.floor(diffInSeconds / 3600)}h ago`;

    const days = Math.floor(diffInSeconds / 86400);
    return locale === "ar-SA" ? `${days} يوم` : `${days}d ago`;
  }

  static truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  }

  // ==================== NOTIFICATION VALIDATION ====================

  static validateNotificationData(type, data) {
    const errors = [];

    switch (type) {
      case "document_expiry_check":
        if (!data.employeeId) errors.push("Employee ID is required");
        if (!data.employeeName) errors.push("Employee name is required");
        if (!data.documentType) errors.push("Document type is required");
        if (!data.expiryDate) errors.push("Expiry date is required");
        if (typeof data.daysRemaining !== "number")
          errors.push("Days remaining must be a number");
        break;

      case "project_status_changed":
        if (!data.projectId) errors.push("Project ID is required");
        if (!data.projectName) errors.push("Project name is required");
        if (!data.newStatus) errors.push("New status is required");
        if (!data.changedBy) errors.push("Changed by is required");
        if (!data.reason) errors.push("Reason is required");
        break;

      case "payroll_processed":
        if (!data.payrollPeriod) errors.push("Payroll period is required");
        if (typeof data.employeeCount !== "number")
          errors.push("Employee count must be a number");
        if (typeof data.totalAmount !== "number")
          errors.push("Total amount must be a number");
        if (!data.processedBy) errors.push("Processed by is required");
        break;

      case "safety_incident":
        if (!data.type) errors.push("Incident type is required");
        if (!data.severity) errors.push("Severity is required");
        if (!data.location) errors.push("Location is required");
        if (!data.description) errors.push("Description is required");
        if (!data.reportedBy) errors.push("Reported by is required");
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // ==================== NOTIFICATION TEMPLATES ====================

  static getQuickTemplates() {
    return {
      documentExpiry: {
        critical: {
          subject: "URGENT: {{documentType}} expires in {{daysRemaining}} days",
          body: "The {{documentType}} for {{employeeName}} will expire on {{expiryDate}}. Immediate action required.",
          subjectAr: "عاجل: {{documentType}} تنتهي خلال {{daysRemaining}} يوم",
          bodyAr:
            "{{documentType}} للموظف {{employeeName}} ستنتهي في {{expiryDate}}. مطلوب إجراء فوري.",
        },
        warning: {
          subject: "Document expiry reminder: {{documentType}}",
          body: "The {{documentType}} for {{employeeName}} will expire on {{expiryDate}} ({{daysRemaining}} days remaining).",
          subjectAr: "تذكير انتهاء الوثيقة: {{documentType}}",
          bodyAr:
            "{{documentType}} للموظف {{employeeName}} ستنتهي في {{expiryDate}} ({{daysRemaining}} يوم متبقي).",
        },
      },
      projectStatus: {
        subject: "Project status update: {{projectName}}",
        body: "Project {{projectName}} status changed from {{oldStatus}} to {{newStatus}} by {{changedBy}}. Reason: {{reason}}",
        subjectAr: "تحديث حالة المشروع: {{projectName}}",
        bodyAr:
          "تم تغيير حالة المشروع {{projectName}} من {{oldStatus}} إلى {{newStatus}} بواسطة {{changedBy}}. السبب: {{reason}}",
      },
      payrollComplete: {
        subject: "Payroll processing complete: {{payrollPeriod}}",
        body: "Payroll for {{payrollPeriod}} has been processed. {{employeeCount}} employees, total amount: {{formattedAmount}}.",
        subjectAr: "اكتملت معالجة الرواتب: {{payrollPeriod}}",
        bodyAr:
          "تم معالجة رواتب {{payrollPeriod}}. {{employeeCount}} موظف، إجمالي المبلغ: {{formattedAmount}}.",
      },
      safetyIncident: {
        subject: "Safety incident reported: {{type}}",
        body: "A {{severity}} severity {{type}} incident has been reported at {{location}}. Reported by: {{reportedBy}}",
        subjectAr: "تم الإبلاغ عن حادث سلامة: {{type}}",
        bodyAr:
          "تم الإبلاغ عن حادث {{type}} بدرجة خطورة {{severity}} في {{location}}. أبلغ عنه: {{reportedBy}}",
      },
    };
  }

  // ==================== NOTIFICATION SCHEDULING ====================

  static scheduleRecurringNotification(type, data, schedule) {
    // Calculate next execution time
    const now = new Date();
    const [hours, minutes] = schedule.time.split(":").map(Number);

    let nextExecution = new Date();
    nextExecution.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for next occurrence
    if (nextExecution <= now) {
      switch (schedule.frequency) {
        case "daily":
          nextExecution.setDate(nextExecution.getDate() + 1);
          break;
        case "weekly":
          nextExecution.setDate(nextExecution.getDate() + 7);
          break;
        case "monthly":
          nextExecution.setMonth(nextExecution.getMonth() + 1);
          break;
      }
    }

    const delay = nextExecution.getTime() - now.getTime();

    setTimeout(async () => {
      const { notificationManager } = await import(
        "../services/NotificationEngine"
      );

      await notificationManager.sendNotification({
        id: `scheduled_${Date.now()}`,
        type,
        source: "scheduler",
        data: {
          ...data,
          scheduledExecution: true,
          originalScheduleTime: schedule.time,
        },
        metadata: {
          timestamp: new Date(),
          scheduled: true,
        },
        priority: "medium",
      });

      // Reschedule for next occurrence
      this.scheduleRecurringNotification(type, data, schedule);
    }, delay);

    console.log(
      `Scheduled ${
        schedule.frequency
      } notification for ${nextExecution.toISOString()}`
    );
  }

  // ==================== NOTIFICATION ANALYTICS ====================

  static analyzeNotificationPerformance(notifications) {
    const now = new Date();
    const last24Hours = notifications.filter(
      (n) =>
        new Date(n.timestamp) > new Date(now.getTime() - 24 * 60 * 60 * 1000)
    );
    const last7Days = notifications.filter(
      (n) =>
        new Date(n.timestamp) >
        new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    );

    const typeDistribution = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {});

    const priorityDistribution = notifications.reduce((acc, n) => {
      acc[n.priority] = (acc[n.priority] || 0) + 1;
      return acc;
    }, {});

    const channelPerformance = notifications.reduce((acc, n) => {
      if (n.channel) {
        if (!acc[n.channel]) {
          acc[n.channel] = { sent: 0, delivered: 0, failed: 0 };
        }
        acc[n.channel].sent++;
        if (n.status === "delivered") acc[n.channel].delivered++;
        if (n.status === "failed") acc[n.channel].failed++;
      }
      return acc;
    }, {});

    return {
      total: notifications.length,
      last24Hours: last24Hours.length,
      last7Days: last7Days.length,
      typeDistribution,
      priorityDistribution,
      channelPerformance,
      averageDeliveryTime:
        notifications
          .filter((n) => n.deliveryTime)
          .reduce((sum, n) => sum + n.deliveryTime, 0) /
          notifications.filter((n) => n.deliveryTime).length || 0,
    };
  }

  // ==================== NOTIFICATION TESTING ====================

  static async testNotificationDelivery(channelId, recipientId) {
    const { notificationManager } = await import(
      "../services/NotificationEngine"
    );

    const testData = {
      testId: `test_${Date.now()}`,
      channelId,
      recipientId,
      message: "This is a test notification to verify delivery functionality.",
      timestamp: new Date().toISOString(),
    };

    return notificationManager.sendNotification({
      id: `test_${Date.now()}`,
      type: "system_test",
      source: "notification_tester",
      data: testData,
      metadata: {
        timestamp: new Date(),
        test: true,
      },
      priority: "low",
    });
  }

  static generateTestNotifications(count = 10) {
    const testTypes = [
      "document_expiry_check",
      "project_status_changed",
      "payroll_processed",
      "safety_incident",
    ];
    const priorities = ["low", "medium", "high", "critical"];
    const notifications = [];

    for (let i = 0; i < count; i++) {
      const type = testTypes[Math.floor(Math.random() * testTypes.length)];
      const priority =
        priorities[Math.floor(Math.random() * priorities.length)];

      notifications.push({
        id: `test_${Date.now()}_${i}`,
        type,
        source: "test_generator",
        data: this.generateTestDataForType(type),
        metadata: {
          timestamp: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ), // Random time in last 7 days
          test: true,
        },
        priority,
      });
    }

    return notifications;
  }

  // Changed from private static to just static (JS doesn’t support private keyword)
  static generateTestDataForType(type) {
    const employees = [
      "Ahmed Al-Rashid",
      "Mohammad Hassan",
      "Ali Al-Mahmoud",
      "Fatima Al-Zahra",
    ];
    const projects = [
      "Aramco Facility",
      "SABIC Construction",
      "NEOM Infrastructure",
    ];
    const documents = ["Iqama", "Passport", "Visa", "Contract", "Certificate"];

    switch (type) {
      case "document_expiry_check":
        return {
          employeeId: `emp_${Math.floor(Math.random() * 1000)}`,
          employeeName: employees[Math.floor(Math.random() * employees.length)],
          documentType: documents[Math.floor(Math.random() * documents.length)],
          expiryDate: new Date(
            Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          daysRemaining: Math.floor(Math.random() * 90),
        };

      case "project_status_changed":
        const statuses = ["active", "hold", "completed", "cancelled"];
        return {
          projectId: `proj_${Math.floor(Math.random() * 1000)}`,
          projectName: projects[Math.floor(Math.random() * projects.length)],
          oldStatus: statuses[Math.floor(Math.random() * statuses.length)],
          newStatus: statuses[Math.floor(Math.random() * statuses.length)],
          changedBy: employees[Math.floor(Math.random() * employees.length)],
          reason: "Test status change",
        };

      case "payroll_processed":
        return {
          payrollPeriod: `${new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}`,
          employeeCount: Math.floor(Math.random() * 200) + 50,
          totalAmount: Math.floor(Math.random() * 1000000) + 500000,
          processedBy: "HR Manager",
          paymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        };

      case "safety_incident":
        const incidentTypes = [
          "injury",
          "near_miss",
          "equipment_failure",
          "environmental",
        ];
        const severities = ["low", "medium", "high", "critical"];
        return {
          incidentId: `inc_${Math.floor(Math.random() * 1000)}`,
          type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          location: "Test Location",
          description: "Test safety incident description",
          reportedBy: employees[Math.floor(Math.random() * employees.length)],
        };

      default:
        return {
          message: "Test notification data",
          timestamp: new Date().toISOString(),
        };
    }
  }

  // ==================== NOTIFICATION PREFERENCES ====================

  static getDefaultPreferences() {
    return {
      channels: {
        email: { enabled: true, priority: 1 },
        sms: { enabled: true, priority: 2 },
        push: { enabled: true, priority: 3 },
        inApp: { enabled: true, priority: 4 },
        slack: { enabled: false, priority: 5 },
      },
      frequency: "immediate",
      quietHours: {
        enabled: false,
        start: "22:00",
        end: "07:00",
        timezone: "Asia/Riyadh",
      },
      languages: ["en-US"],
      categories: {
        compliance: { enabled: true, priority: "high" },
        safety: { enabled: true, priority: "critical" },
        hr: { enabled: true, priority: "medium" },
        operations: { enabled: true, priority: "medium" },
        finance: { enabled: true, priority: "medium" },
      },
    };
  }

  static validatePreferences(preferences) {
    const errors = [];

    if (!preferences.channels) {
      errors.push("Channels configuration is required");
    }

    if (
      !preferences.frequency ||
      !["immediate", "batched", "digest"].includes(preferences.frequency)
    ) {
      errors.push(
        "Valid frequency is required (immediate, batched, or digest)"
      );
    }

    if (preferences.quietHours?.enabled) {
      if (!preferences.quietHours.start || !preferences.quietHours.end) {
        errors.push(
          "Quiet hours start and end times are required when enabled"
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// ==================== NOTIFICATION EVENT BUILDERS ====================

export class NotificationEventBuilder {
  constructor() {
    this.event = {};
  }

  static create(type) {
    const builder = new NotificationEventBuilder();
    builder.event = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      metadata: {
        timestamp: new Date(),
      },
    };
    return builder;
  }

  source(source) {
    this.event.source = source;
    return this;
  }

  data(data) {
    this.event.data = data;
    return this;
  }

  priority(priority) {
    this.event.priority = priority;
    return this;
  }

  metadata(metadata) {
    this.event.metadata = { ...this.event.metadata, ...metadata };
    return this;
  }

  correlationId(id) {
    this.event.correlationId = id;
    return this;
  }

  build() {
    return this.event;
  }

  async send() {
    const { notificationManager } = await import(
      "../services/NotificationEngine"
    );
    return notificationManager.sendNotification(this.event);
  }
}

// ==================== EXPORTS ====================

export default NotificationHelpers;
