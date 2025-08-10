// Enhanced Real-time Notification Engine with Multi-channel Delivery and Smart Routing

export class EnhancedNotificationEngine {
  constructor(config) {
    this.channels = new Map();
    this.rules = new Map();
    this.templates = new Map();
    this.recipients = new Map();
    this.deliveryQueue = [];
    this.routingConfig = config;
    this.eventBus = new EventTarget();
    this.healthCheckInterval = undefined;
    this.processingInterval = undefined;
    this.metrics = new Map();

    this.initializeDefaultChannels();
    this.initializeDefaultTemplates();
    this.startHealthChecks();
    this.startDeliveryProcessor();
  }

  // ==================== INITIALIZATION ====================

  initializeDefaultChannels() {
    const defaultChannels = [
      {
        id: "email_primary",
        name: "Primary Email Service",
        type: "email",
        enabled: true,
        priority: 1,
        config: {
          endpoint: "https://api.sendgrid.com/v3/mail/send",
          retryAttempts: 3,
          timeout: 30000,
          rateLimit: { requests: 100, window: 60 },
        },
        healthStatus: "healthy",
        lastHealthCheck: new Date(),
        metrics: { sent: 0, delivered: 0, failed: 0, avgDeliveryTime: 0 },
      },
      {
        id: "sms_primary",
        name: "Primary SMS Service",
        type: "sms",
        enabled: true,
        priority: 1,
        config: {
          endpoint:
            "https://api.twilio.com/2010-04-01/Accounts/ACxxx/Messages.json",
          retryAttempts: 2,
          timeout: 15000,
          rateLimit: { requests: 50, window: 60 },
        },
        healthStatus: "healthy",
        lastHealthCheck: new Date(),
        metrics: { sent: 0, delivered: 0, failed: 0, avgDeliveryTime: 0 },
      },
      {
        id: "push_firebase",
        name: "Firebase Push Notifications",
        type: "push",
        enabled: true,
        priority: 1,
        config: {
          endpoint: "https://fcm.googleapis.com/fcm/send",
          retryAttempts: 3,
          timeout: 10000,
          rateLimit: { requests: 1000, window: 60 },
        },
        healthStatus: "healthy",
        lastHealthCheck: new Date(),
        metrics: { sent: 0, delivered: 0, failed: 0, avgDeliveryTime: 0 },
      },
      {
        id: "in_app",
        name: "In-App Notifications",
        type: "in-app",
        enabled: true,
        priority: 1,
        config: {
          retryAttempts: 1,
          timeout: 5000,
        },
        healthStatus: "healthy",
        lastHealthCheck: new Date(),
        metrics: { sent: 0, delivered: 0, failed: 0, avgDeliveryTime: 0 },
      },
      {
        id: "slack_integration",
        name: "Slack Integration",
        type: "slack",
        enabled: true,
        priority: 2,
        config: {
          endpoint: "https://hooks.slack.com/services/xxx",
          retryAttempts: 2,
          timeout: 10000,
          rateLimit: { requests: 1, window: 1 },
        },
        healthStatus: "healthy",
        lastHealthCheck: new Date(),
        metrics: { sent: 0, delivered: 0, failed: 0, avgDeliveryTime: 0 },
      },
    ];

    defaultChannels.forEach((channel) => {
      this.channels.set(channel.id, channel);
    });
  }

  initializeDefaultTemplates() {
    const defaultTemplates = [
      {
        id: "employee_document_expiry",
        name: "Employee Document Expiry Alert",
        type: "document_expiry",
        channels: ["email", "sms", "in-app"],
        content: {
          email: {
            subject: "Document Expiry Alert - {{employeeName}}",
            body: "The {{documentType}} for {{employeeName}} will expire on {{expiryDate}}. Please take immediate action to renew.",
            html: "<h2>Document Expiry Alert</h2><p>The <strong>{{documentType}}</strong> for <strong>{{employeeName}}</strong> will expire on <strong>{{expiryDate}}</strong>.</p><p>Please take immediate action to renew this document to maintain compliance.</p>",
            variables: [
              "employeeName",
              "documentType",
              "expiryDate",
              "daysRemaining",
            ],
          },
          sms: {
            body: "URGENT: {{documentType}} for {{employeeName}} expires {{expiryDate}}. Renew immediately.",
            variables: ["employeeName", "documentType", "expiryDate"],
          },
          "in-app": {
            body: "{{documentType}} for {{employeeName}} expires in {{daysRemaining}} days",
            variables: ["employeeName", "documentType", "daysRemaining"],
          },
        },
        localization: {
          "ar-SA": {
            email: {
              subject: "تنبيه انتهاء وثيقة - {{employeeName}}",
              body: "ستنتهي صلاحية {{documentType}} للموظف {{employeeName}} في {{expiryDate}}. يرجى اتخاذ إجراء فوري للتجديد.",
              html: "<h2>تنبيه انتهاء وثيقة</h2><p>ستنتهي صلاحية <strong>{{documentType}}</strong> للموظف <strong>{{employeeName}}</strong> في <strong>{{expiryDate}}</strong>.</p><p>يرجى اتخاذ إجراء فوري لتجديد هذه الوثيقة للحفاظ على الامتثال.</p>",
            },
            sms: {
              body: "عاجل: {{documentType}} للموظف {{employeeName}} تنتهي {{expiryDate}}. جدد فوراً.",
            },
          },
        },
        isActive: true,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "project_status_change",
        name: "Project Status Change Notification",
        type: "project_status",
        channels: ["email", "in-app", "slack"],
        content: {
          email: {
            subject: "Project Status Update - {{projectName}}",
            body: "Project {{projectName}} status has been changed from {{oldStatus}} to {{newStatus}} by {{changedBy}}.\n\nReason: {{reason}}\n\nNext Actions: {{nextActions}}",
            html: '<h2>Project Status Update</h2><p>Project <strong>{{projectName}}</strong> status has been changed from <span class="status-{{oldStatus}}">{{oldStatus}}</span> to <span class="status-{{newStatus}}">{{newStatus}}</span> by {{changedBy}}.</p><p><strong>Reason:</strong> {{reason}}</p><p><strong>Next Actions:</strong> {{nextActions}}</p>',
            variables: [
              "projectName",
              "oldStatus",
              "newStatus",
              "changedBy",
              "reason",
              "nextActions",
            ],
          },
          "in-app": {
            body: "{{projectName}} status changed to {{newStatus}}",
            variables: ["projectName", "newStatus"],
          },
          slack: {
            body: "🔄 *Project Status Update*\n*Project:* {{projectName}}\n*Status:* {{oldStatus}} → {{newStatus}}\n*Changed by:* {{changedBy}}\n*Reason:* {{reason}}",
            variables: [
              "projectName",
              "oldStatus",
              "newStatus",
              "changedBy",
              "reason",
            ],
          },
        },
        localization: {
          "ar-SA": {
            email: {
              subject: "تحديث حالة المشروع - {{projectName}}",
              body: "تم تغيير حالة المشروع {{projectName}} من {{oldStatus}} إلى {{newStatus}} بواسطة {{changedBy}}.\n\nالسبب: {{reason}}\n\nالإجراءات التالية: {{nextActions}}",
            },
          },
        },
        isActive: true,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "payroll_processed",
        name: "Payroll Processing Complete",
        type: "payroll_complete",
        channels: ["email", "in-app"],
        content: {
          email: {
            subject: "Payroll Processed - {{payrollPeriod}}",
            body: "Payroll for period {{payrollPeriod}} has been successfully processed.\n\nTotal Employees: {{employeeCount}}\nTotal Amount: {{totalAmount}} SAR\nProcessed by: {{processedBy}}\n\nPayroll will be disbursed on {{paymentDate}}.",
            html: "<h2>Payroll Processing Complete</h2><p>Payroll for period <strong>{{payrollPeriod}}</strong> has been successfully processed.</p><ul><li><strong>Total Employees:</strong> {{employeeCount}}</li><li><strong>Total Amount:</strong> {{totalAmount}} SAR</li><li><strong>Processed by:</strong> {{processedBy}}</li></ul><p>Payroll will be disbursed on <strong>{{paymentDate}}</strong>.</p>",
            variables: [
              "payrollPeriod",
              "employeeCount",
              "totalAmount",
              "processedBy",
              "paymentDate",
            ],
          },
        },
        localization: {
          "ar-SA": {
            email: {
              subject: "تم معالجة الرواتب - {{payrollPeriod}}",
              body: "تم معالجة رواتب فترة {{payrollPeriod}} بنجاح.\n\nإجمالي الموظفين: {{employeeCount}}\nإجمالي المبلغ: {{totalAmount}} ريال\nتمت المعالجة بواسطة: {{processedBy}}\n\nسيتم صرف الرواتب في {{paymentDate}}.",
            },
          },
        },
        isActive: true,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    defaultTemplates.forEach((template) => {
      this.templates.set(template.id, template);
    });
  }

  // ==================== EVENT PROCESSING ====================

  async processEvent(event) {
    try {
      console.log(`Processing notification event: ${event.type}`, event);

      // Find matching rules
      const matchingRules = await this.findMatchingRules(event);

      if (matchingRules.length === 0) {
        console.log(`No matching rules found for event type: ${event.type}`);
        return;
      }

      // Process each matching rule
      for (const rule of matchingRules) {
        await this.processRule(rule, event);
      }

      // Emit event for real-time updates
      this.eventBus.dispatchEvent(
        new CustomEvent("notification-processed", {
          detail: { event, rulesMatched: matchingRules.length },
        })
      );
    } catch (error) {
      console.error("Error processing notification event:", error);
      await this.handleProcessingError(event, error);
    }
  }

  async findMatchingRules(event) {
    const matchingRules = [];

    for (const rule of this.rules.values()) {
      if (!rule.isActive) continue;
      if (rule.eventType !== event.type) continue;

      // Check conditions
      const conditionsMet = await this.evaluateConditions(
        rule.conditions,
        event.data
      );
      if (conditionsMet) {
        // Check throttling
        const throttleCheck = await this.checkThrottling(rule, event);
        if (throttleCheck.allowed) {
          matchingRules.push(rule);
        } else {
          console.log(`Rule ${rule.id} throttled: ${throttleCheck.reason}`);
        }
      }
    }

    return matchingRules.sort(
      (a, b) =>
        this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority)
    );
  }

  async evaluateConditions(conditions, data) {
    if (conditions.length === 0) return true;

    let result = true;
    let currentLogicalOperator = "AND";

    for (const condition of conditions) {
      const conditionResult = this.evaluateCondition(condition, data);

      if (currentLogicalOperator === "AND") {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }

      if (condition.logicalOperator) {
        currentLogicalOperator = condition.logicalOperator;
      }
    }

    return result;
  }

  evaluateCondition(condition, data) {
    const fieldValue = this.getNestedValue(data, condition.field);

    switch (condition.operator) {
      case "equals":
        return fieldValue === condition.value;
      case "not_equals":
        return fieldValue !== condition.value;
      case "greater_than":
        return Number(fieldValue) > Number(condition.value);
      case "less_than":
        return Number(fieldValue) < Number(condition.value);
      case "contains":
        return String(fieldValue)
          .toLowerCase()
          .includes(String(condition.value).toLowerCase());
      case "in":
        return (
          Array.isArray(condition.value) && condition.value.includes(fieldValue)
        );
      case "not_in":
        return (
          Array.isArray(condition.value) &&
          !condition.value.includes(fieldValue)
        );
      default:
        return false;
    }
  }

  getNestedValue(obj, path) {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  // ==================== SMART ROUTING ====================

  async processRule(rule, event) {
    try {
      // Get template
      const template = this.templates.get(rule.template);
      if (!template) {
        throw new Error(`Template not found: ${rule.template}`);
      }

      // Resolve recipients
      const recipients = await this.resolveRecipients(rule.recipients, event);

      // Create notifications for each recipient
      for (const recipient of recipients) {
        await this.createNotificationDeliveries(
          rule,
          template,
          recipient,
          event
        );
      }
    } catch (error) {
      console.error(`Error processing rule ${rule.id}:`, error);
    }
  }

  async resolveRecipients(ruleRecipients, event) {
    const resolvedRecipients = [];

    for (const ruleRecipient of ruleRecipients) {
      switch (ruleRecipient.type) {
        case "user":
          const user = this.recipients.get(ruleRecipient.identifier);
          if (user) resolvedRecipients.push(user);
          break;

        case "role":
          const roleUsers = await this.getUsersByRole(ruleRecipient.identifier);
          resolvedRecipients.push(...roleUsers);
          break;

        case "department":
          const deptUsers = await this.getUsersByDepartment(
            ruleRecipient.identifier
          );
          resolvedRecipients.push(...deptUsers);
          break;

        case "custom":
          const customUsers = await this.resolveCustomRecipients(
            ruleRecipient.identifier,
            event
          );
          resolvedRecipients.push(...customUsers);
          break;
      }
    }

    return resolvedRecipients;
  }

  async createNotificationDeliveries(rule, template, recipient, event) {
    // Determine optimal channels using smart routing
    const optimalChannels = await this.determineOptimalChannels(
      rule.channels,
      recipient,
      rule.priority
    );

    for (const channelId of optimalChannels) {
      const channel = this.channels.get(channelId);
      if (!channel || !channel.enabled) continue;

      // Check if recipient supports this channel
      if (!recipient.preferences.channels.includes(channelId)) continue;

      // Create delivery
      const delivery = {
        id: this.generateId(),
        notificationId: this.generateId(),
        recipientId: recipient.id,
        channel: channelId,
        status: "pending",
        attempts: 0,
        maxAttempts: channel.config.retryAttempts || 3,
        scheduledAt: this.calculateScheduledTime(rule.scheduling, recipient),
        retrySchedule: [],
        metadata: {},
      };

      // Render content
      const content = await this.renderNotificationContent(
        template,
        channelId,
        event.data,
        recipient
      );
      delivery.metadata.content = content;

      // Add to delivery queue
      this.deliveryQueue.push(delivery);

      console.log(
        `Queued notification delivery: ${delivery.id} via ${channelId} to ${recipient.id}`
      );
    }
  }

  async determineOptimalChannels(ruleChannels, recipient, priority) {
    // Filter channels based on availability and health
    const availableChannels = ruleChannels.filter((channelId) => {
      const channel = this.channels.get(channelId);
      return channel && channel.enabled && channel.healthStatus !== "down";
    });

    // Apply recipient preferences
    const preferredChannels = availableChannels.filter((channelId) =>
      recipient.preferences.channels.includes(channelId)
    );

    // Smart routing based on priority and channel performance
    if (priority === "critical") {
      // For critical notifications, use all available channels
      return this.sortChannelsByReliability(preferredChannels);
    } else if (priority === "high") {
      // For high priority, use fastest channels
      return this.sortChannelsBySpeed(preferredChannels).slice(0, 2);
    } else {
      // For medium/low priority, use cost-effective channels
      return this.sortChannelsByCost(preferredChannels).slice(0, 1);
    }
  }

  sortChannelsByReliability(channelIds) {
    return channelIds.sort((a, b) => {
      const channelA = this.channels.get(a);
      const channelB = this.channels.get(b);

      const reliabilityA =
        channelA.metrics.delivered / (channelA.metrics.sent || 1);
      const reliabilityB =
        channelB.metrics.delivered / (channelB.metrics.sent || 1);

      return reliabilityB - reliabilityA;
    });
  }

  sortChannelsBySpeed(channelIds) {
    return channelIds.sort((a, b) => {
      const channelA = this.channels.get(a);
      const channelB = this.channels.get(b);

      return (
        channelA.metrics.avgDeliveryTime - channelB.metrics.avgDeliveryTime
      );
    });
  }

  sortChannelsByCost(channelIds) {
    const costPriority = {
      "in-app": 1,
      push: 2,
      email: 3,
      sms: 4,
      slack: 2,
      teams: 2,
    };

    return channelIds.sort((a, b) => {
      const channelA = this.channels.get(a);
      const channelB = this.channels.get(b);

      return (
        (costPriority[channelA.type] || 5) - (costPriority[channelB.type] || 5)
      );
    });
  }

  // ==================== CONTENT RENDERING ====================

  async renderNotificationContent(template, channelId, data, recipient) {
    const channel = this.channels.get(channelId);
    if (!channel) throw new Error(`Channel not found: ${channelId}`);

    // Determine locale
    const locale = recipient.preferences.languages[0] || "en-US";

    // Get content for channel and locale
    let content = template.content[channel.type];
    if (
      template.localization[locale] &&
      template.localization[locale][channel.type]
    ) {
      content = { ...content, ...template.localization[locale][channel.type] };
    }

    if (!content) {
      throw new Error(
        `No content found for channel ${channel.type} in template ${template.id}`
      );
    }

    // Render variables
    const renderedContent = {};

    if (content.subject) {
      renderedContent.subject = this.renderTemplate(content.subject, data);
    }

    renderedContent.body = this.renderTemplate(content.body, data);

    if (content.html) {
      renderedContent.html = this.renderTemplate(content.html, data);
    }

    // Add channel-specific formatting
    return this.formatForChannel(renderedContent, channel.type, data);
  }

  renderTemplate(template, data) {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
      const value = this.getNestedValue(data, path);
      return value !== undefined ? String(value) : match;
    });
  }

  formatForChannel(content, channelType, data) {
    switch (channelType) {
      case "sms":
        // Truncate SMS to 160 characters
        return {
          ...content,
          body: content.body.substring(0, 160),
        };

      case "slack":
        // Format for Slack with blocks
        return {
          ...content,
          blocks: this.createSlackBlocks(content.body, data),
        };

      case "push":
        // Format for push notifications
        return {
          title: content.subject || "Notification",
          body: content.body,
          data: data,
          badge: 1,
          sound: "default",
        };

      default:
        return content;
    }
  }

  createSlackBlocks(message, data) {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: message,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Generated at ${new Date().toLocaleString()}`,
          },
        ],
      },
    ];
  }

  // ==================== DELIVERY PROCESSING ====================

  startDeliveryProcessor() {
    this.processingInterval = setInterval(async () => {
      await this.processDeliveryQueue();
    }, 1000); // Process every second
  }

  async processDeliveryQueue() {
    const now = new Date();
    const readyDeliveries = this.deliveryQueue.filter(
      (delivery) => delivery.status === "pending" && delivery.scheduledAt <= now
    );

    // Process deliveries in parallel with concurrency limit
    const concurrencyLimit = 10;
    const batches = this.chunkArray(readyDeliveries, concurrencyLimit);

    for (const batch of batches) {
      await Promise.allSettled(
        batch.map((delivery) => this.processDelivery(delivery))
      );
    }
  }

  async processDelivery(delivery) {
    const channel = this.channels.get(delivery.channel);
    if (!channel) {
      delivery.status = "failed";
      delivery.error = "Channel not found";
      return;
    }

    // Check circuit breaker
    if (
      this.routingConfig.circuitBreaker.enabled &&
      this.isCircuitBreakerOpen(channel)
    ) {
      await this.scheduleRetry(delivery, "Circuit breaker open");
      return;
    }

    // Check rate limiting
    if (!(await this.checkRateLimit(channel))) {
      await this.scheduleRetry(delivery, "Rate limit exceeded");
      return;
    }

    try {
      delivery.attempts++;
      delivery.sentAt = new Date();
      delivery.status = "sent";

      // Send notification based on channel type
      const result = await this.sendNotification(channel, delivery);

      // Update delivery status
      delivery.status = result.success ? "delivered" : "failed";
      delivery.deliveredAt = result.success ? new Date() : undefined;
      delivery.error = result.error;
      delivery.metadata = { ...delivery.metadata, ...result.metadata };

      // Update channel metrics
      this.updateChannelMetrics(channel, delivery);

      // Emit real-time update
      this.eventBus.dispatchEvent(
        new CustomEvent("delivery-updated", {
          detail: delivery,
        })
      );
    } catch (error) {
      delivery.status = "failed";
      delivery.failedAt = new Date();
      delivery.error = error instanceof Error ? error.message : "Unknown error";

      // Schedule retry if attempts remaining
      if (delivery.attempts < delivery.maxAttempts) {
        await this.scheduleRetry(delivery, delivery.error);
      }
    }
  }

  async sendNotification(channel, delivery) {
    const startTime = Date.now();

    try {
      switch (channel.type) {
        case "email":
          return await this.sendEmail(channel, delivery);
        case "sms":
          return await this.sendSMS(channel, delivery);
        case "push":
          return await this.sendPushNotification(channel, delivery);
        case "in-app":
          return await this.sendInAppNotification(channel, delivery);
        case "slack":
          return await this.sendSlackNotification(channel, delivery);
        case "webhook":
          return await this.sendWebhook(channel, delivery);
        default:
          throw new Error(`Unsupported channel type: ${channel.type}`);
      }
    } finally {
      const responseTime = Date.now() - startTime;
      delivery.metadata.responseTime = responseTime;
    }
  }

  async sendEmail(channel, delivery) {
    // Simulate email sending with realistic behavior
    await this.simulateNetworkDelay(500, 2000);

    if (Math.random() < 0.05) {
      // 5% failure rate
      throw new Error("Email service temporarily unavailable");
    }

    return {
      success: true,
      metadata: {
        messageId: `email_${this.generateId()}`,
        provider: "sendgrid",
      },
    };
  }

  async sendSMS(channel, delivery) {
    await this.simulateNetworkDelay(200, 1000);

    if (Math.random() < 0.03) {
      // 3% failure rate
      throw new Error("SMS gateway error");
    }

    return {
      success: true,
      metadata: {
        messageId: `sms_${this.generateId()}`,
        provider: "twilio",
        cost: 0.05, // USD
      },
    };
  }

  async sendPushNotification(channel, delivery) {
    await this.simulateNetworkDelay(100, 500);

    if (Math.random() < 0.02) {
      // 2% failure rate
      throw new Error("Push notification failed");
    }

    return {
      success: true,
      metadata: {
        messageId: `push_${this.generateId()}`,
        provider: "firebase",
      },
    };
  }

  async sendInAppNotification(channel, delivery) {
    // In-app notifications are always successful
    await this.simulateNetworkDelay(50, 100);

    // Store in local notification store
    this.storeInAppNotification(delivery);

    return {
      success: true,
      metadata: {
        messageId: `inapp_${this.generateId()}`,
        stored: true,
      },
    };
  }

  async sendSlackNotification(channel, delivery) {
    await this.simulateNetworkDelay(300, 800);

    if (Math.random() < 0.04) {
      // 4% failure rate
      throw new Error("Slack webhook failed");
    }

    return {
      success: true,
      metadata: {
        messageId: `slack_${this.generateId()}`,
        channel: "#notifications",
      },
    };
  }

  async sendWebhook(channel, delivery) {
    await this.simulateNetworkDelay(200, 1000);

    if (Math.random() < 0.06) {
      // 6% failure rate
      throw new Error("Webhook endpoint unreachable");
    }

    return {
      success: true,
      metadata: {
        messageId: `webhook_${this.generateId()}`,
        endpoint: channel.config.endpoint,
      },
    };
  }

  // ==================== HEALTH MONITORING ====================

  startHealthChecks() {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, 30000); // Every 30 seconds
  }

  async performHealthChecks() {
    for (const channel of this.channels.values()) {
      try {
        const isHealthy = await this.checkChannelHealth(channel);
        const previousStatus = channel.healthStatus;

        channel.healthStatus = isHealthy ? "healthy" : "down";
        channel.lastHealthCheck = new Date();

        // Emit health change event
        if (previousStatus !== channel.healthStatus) {
          this.eventBus.dispatchEvent(
            new CustomEvent("channel-health-changed", {
              detail: {
                channel,
                previousStatus,
                currentStatus: channel.healthStatus,
              },
            })
          );
        }
      } catch (error) {
        channel.healthStatus = "down";
        console.error(`Health check failed for channel ${channel.id}:`, error);
      }
    }
  }

  async checkChannelHealth(channel) {
    // Simulate health check
    await this.simulateNetworkDelay(100, 500);

    // Check recent failure rate
    const recentFailureRate = this.calculateRecentFailureRate(channel);
    if (recentFailureRate > 0.5) return false;

    // Simulate occasional health check failures
    return Math.random() > 0.05; // 95% success rate
  }

  calculateRecentFailureRate(channel) {
    const total = channel.metrics.sent;
    const failed = channel.metrics.failed;
    return total > 0 ? failed / total : 0;
  }

  // ==================== UTILITY METHODS ====================

  async checkThrottling(rule, event) {
    if (!rule.throttling.enabled) return { allowed: true };

    // Check hourly limit
    const hourlyCount = await this.getNotificationCount(rule.id, "hour");
    if (hourlyCount >= rule.throttling.maxPerHour) {
      return { allowed: false, reason: "Hourly limit exceeded" };
    }

    // Check daily limit
    const dailyCount = await this.getNotificationCount(rule.id, "day");
    if (dailyCount >= rule.throttling.maxPerDay) {
      return { allowed: false, reason: "Daily limit exceeded" };
    }

    return { allowed: true };
  }

  async getNotificationCount(ruleId, period) {
    // In a real implementation, this would query the database
    // For now, simulate with random values
    return Math.floor(Math.random() * 10);
  }

  calculateScheduledTime(scheduling, recipient) {
    const now = new Date();

    if (!scheduling.immediate && scheduling.delay) {
      now.setMilliseconds(now.getMilliseconds() + scheduling.delay);
    }

    // Check business hours
    if (scheduling.businessHoursOnly) {
      const hour = now.getHours();
      if (hour < 9 || hour > 17) {
        // Schedule for next business day at 9 AM
        const nextBusinessDay = new Date(now);
        nextBusinessDay.setDate(nextBusinessDay.getDate() + 1);
        nextBusinessDay.setHours(9, 0, 0, 0);
        return nextBusinessDay;
      }
    }

    // Check recipient quiet hours
    if (recipient.preferences.quietHours) {
      const quietStart = parseInt(
        recipient.preferences.quietHours.start.split(":")[0]
      );
      const quietEnd = parseInt(
        recipient.preferences.quietHours.end.split(":")[0]
      );
      const currentHour = now.getHours();

      if (currentHour >= quietStart || currentHour <= quietEnd) {
        // Schedule after quiet hours
        const afterQuietHours = new Date(now);
        afterQuietHours.setHours(quietEnd + 1, 0, 0, 0);
        if (afterQuietHours <= now) {
          afterQuietHours.setDate(afterQuietHours.getDate() + 1);
        }
        return afterQuietHours;
      }
    }

    return now;
  }

  async scheduleRetry(delivery, reason) {
    const retryDelay = this.calculateRetryDelay(delivery.attempts);
    const retryTime = new Date(Date.now() + retryDelay);

    delivery.scheduledAt = retryTime;
    delivery.status = "pending";
    delivery.error = reason;

    if (!delivery.retrySchedule) delivery.retrySchedule = [];
    delivery.retrySchedule.push(retryTime);

    console.log(
      `Scheduled retry for delivery ${
        delivery.id
      } at ${retryTime.toISOString()}`
    );
  }

  calculateRetryDelay(attempt) {
    // Exponential backoff: 2^attempt * 1000ms, max 5 minutes
    return Math.min(Math.pow(2, attempt) * 1000, 300000);
  }

  updateChannelMetrics(channel, delivery) {
    channel.metrics.sent++;

    if (delivery.status === "delivered") {
      channel.metrics.delivered++;
      if (delivery.sentAt && delivery.deliveredAt) {
        const deliveryTime =
          delivery.deliveredAt.getTime() - delivery.sentAt.getTime();
        channel.metrics.avgDeliveryTime =
          (channel.metrics.avgDeliveryTime + deliveryTime) / 2;
      }
    } else if (delivery.status === "failed") {
      channel.metrics.failed++;
    }
  }

  isCircuitBreakerOpen(channel) {
    if (!this.routingConfig.circuitBreaker.enabled) return false;

    const failureRate = channel.metrics.failed / (channel.metrics.sent || 1);
    return failureRate > this.routingConfig.circuitBreaker.failureThreshold;
  }

  async checkRateLimit(channel) {
    if (!channel.config.rateLimit) return true;

    // In a real implementation, this would check against a rate limiter (Redis)
    // For now, simulate rate limiting
    return Math.random() > 0.1; // 90% success rate
  }

  getPriorityWeight(priority) {
    const weights = { low: 1, medium: 2, high: 3, critical: 4 };
    return weights[priority] || 1;
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  async simulateNetworkDelay(min, max) {
    const delay = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  generateId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  storeInAppNotification(delivery) {
    // Store in localStorage for demo
    const stored = JSON.parse(
      localStorage.getItem("in_app_notifications") || "[]"
    );
    stored.unshift({
      id: delivery.id,
      recipientId: delivery.recipientId,
      content: delivery.metadata.content,
      timestamp: new Date().toISOString(),
      read: false,
    });

    // Keep only last 100 notifications
    if (stored.length > 100) {
      stored.splice(100);
    }

    localStorage.setItem("in_app_notifications", JSON.stringify(stored));
  }

  // ==================== PUBLIC API ====================

  async addChannel(channel) {
    this.channels.set(channel.id, channel);
    console.log(`Added notification channel: ${channel.id}`);
  }

  async addRule(rule) {
    this.rules.set(rule.id, rule);
    console.log(`Added notification rule: ${rule.id}`);
  }

  async addTemplate(template) {
    this.templates.set(template.id, template);
    console.log(`Added notification template: ${template.id}`);
  }

  async addRecipient(recipient) {
    this.recipients.set(recipient.id, recipient);
    console.log(`Added notification recipient: ${recipient.id}`);
  }

  getChannelHealth() {
    return Array.from(this.channels.values()).map((channel) => ({
      channelId: channel.id,
      status: channel.healthStatus,
      metrics: channel.metrics,
    }));
  }

  getDeliveryStats() {
    const total = this.deliveryQueue.length;
    const pending = this.deliveryQueue.filter(
      (d) => d.status === "pending"
    ).length;
    const sent = this.deliveryQueue.filter((d) => d.status === "sent").length;
    const delivered = this.deliveryQueue.filter(
      (d) => d.status === "delivered"
    ).length;
    const failed = this.deliveryQueue.filter(
      (d) => d.status === "failed"
    ).length;

    const deliveredDeliveries = this.deliveryQueue.filter(
      (d) => d.status === "delivered" && d.sentAt && d.deliveredAt
    );
    const avgDeliveryTime =
      deliveredDeliveries.length > 0
        ? deliveredDeliveries.reduce(
            (sum, d) => sum + (d.deliveredAt.getTime() - d.sentAt.getTime()),
            0
          ) / deliveredDeliveries.length
        : 0;

    return { total, pending, sent, delivered, failed, avgDeliveryTime };
  }

  addEventListener(type, listener) {
    this.eventBus.addEventListener(type, listener);
  }

  removeEventListener(type, listener) {
    this.eventBus.removeEventListener(type, listener);
  }

  async shutdown() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    console.log("Notification engine shutdown complete");
  }

  // ==================== HELPER METHODS ====================

  async getUsersByRole(role) {
    // In a real implementation, this would query the user database
    return Array.from(this.recipients.values()).filter(
      (recipient) => recipient.type === "role" || recipient.identifier === role
    );
  }

  async getUsersByDepartment(department) {
    // In a real implementation, this would query the user database
    return Array.from(this.recipients.values()).filter(
      (recipient) =>
        recipient.type === "department" || recipient.identifier === department
    );
  }

  async resolveCustomRecipients(identifier, event) {
    // Custom logic for resolving recipients based on event data
    // For example, project team members, emergency contacts, etc.
    return [];
  }

  async handleProcessingError(event, error) {
    console.error("Notification processing error:", error);

    // Store error for analysis
    const errorLog = {
      eventId: event.id,
      eventType: event.type,
      error: error.message,
      timestamp: new Date(),
      stack: error.stack,
    };

    // In a real implementation, this would be stored in a database
    console.log("Error logged:", errorLog);
  }
}

// ==================== NOTIFICATION MANAGER ====================

class NotificationManager {
  constructor() {
    const routingConfig = {
      fallbackChannels: ["email_primary", "in_app"],
      channelPriority: {
        "in-app": 1,
        push_firebase: 2,
        email_primary: 3,
        sms_primary: 4,
        slack_integration: 5,
      },
      recipientPreferences: true,
      loadBalancing: {
        enabled: true,
        strategy: "health_based",
      },
      circuitBreaker: {
        enabled: true,
        failureThreshold: 0.5,
        recoveryTimeout: 300000, // 5 minutes
      },
      adaptiveRouting: {
        enabled: true,
        learningRate: 0.1,
        optimizationGoal: "delivery_rate",
      },
    };

    this.engine = new EnhancedNotificationEngine(routingConfig);
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize default recipients
      await this.initializeDefaultRecipients();

      // Initialize default rules
      await this.initializeDefaultRules();

      this.isInitialized = true;
      console.log("Notification Manager initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Notification Manager:", error);
      throw error;
    }
  }

  async initializeDefaultRecipients() {
    const defaultRecipients = [
      {
        id: "hr_manager",
        type: "user",
        identifier: "hr_manager",
        preferences: {
          channels: ["email_primary", "in_app", "sms_primary"],
          frequency: "immediate",
          languages: ["en-US", "ar-SA"],
          quietHours: {
            start: "22:00",
            end: "07:00",
            timezone: "Asia/Riyadh",
          },
        },
        contactInfo: {
          email: "hr.manager@amoagc.sa",
          phone: "+966501234567",
          pushTokens: ["token_hr_manager_123"],
        },
      },
      {
        id: "operations_manager",
        type: "user",
        identifier: "operations_manager",
        preferences: {
          channels: ["email_primary", "in_app", "slack_integration"],
          frequency: "immediate",
          languages: ["en-US", "ar-SA"],
        },
        contactInfo: {
          email: "operations.manager@amoagc.sa",
          phone: "+966502345678",
          slackUserId: "U123456789",
        },
      },
      {
        id: "finance_team",
        type: "role",
        identifier: "finance",
        preferences: {
          channels: ["email_primary", "in_app"],
          frequency: "batched",
          languages: ["en-US", "ar-SA"],
        },
        contactInfo: {
          email: "finance.team@amoagc.sa",
        },
      },
    ];

    for (const recipient of defaultRecipients) {
      await this.engine.addRecipient(recipient);
    }
  }

  async initializeDefaultRules() {
    const defaultRules = [
      {
        id: "document_expiry_critical",
        name: "Critical Document Expiry Alert",
        description: "Alert when employee documents expire within 7 days",
        eventType: "document_expiry_check",
        conditions: [
          {
            field: "daysUntilExpiry",
            operator: "less_than",
            value: 7,
          },
        ],
        channels: ["email_primary", "sms_primary", "in_app"],
        recipients: [
          {
            id: "hr_manager",
            type: "user",
            identifier: "hr_manager",
            preferences: {
              channels: [],
              frequency: "immediate",
              languages: [],
            },
            contactInfo: {},
          },
        ],
        template: "employee_document_expiry",
        priority: "critical",
        throttling: {
          enabled: true,
          maxPerHour: 10,
          maxPerDay: 50,
        },
        scheduling: {
          immediate: true,
          businessHoursOnly: false,
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "project_status_change_notification",
        name: "Project Status Change Alert",
        description: "Notify stakeholders when project status changes",
        eventType: "project_status_changed",
        conditions: [],
        channels: ["email_primary", "in_app", "slack_integration"],
        recipients: [
          {
            id: "operations_manager",
            type: "user",
            identifier: "operations_manager",
            preferences: {
              channels: [],
              frequency: "immediate",
              languages: [],
            },
            contactInfo: {},
          },
        ],
        template: "project_status_change",
        priority: "high",
        throttling: {
          enabled: false,
          maxPerHour: 0,
          maxPerDay: 0,
        },
        scheduling: {
          immediate: true,
          businessHoursOnly: false,
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "payroll_completion",
        name: "Payroll Processing Complete",
        description: "Notify when payroll processing is completed",
        eventType: "payroll_processed",
        conditions: [
          {
            field: "status",
            operator: "equals",
            value: "completed",
          },
        ],
        channels: ["email_primary", "in_app"],
        recipients: [
          {
            id: "hr_manager",
            type: "user",
            identifier: "hr_manager",
            preferences: {
              channels: [],
              frequency: "immediate",
              languages: [],
            },
            contactInfo: {},
          },
          {
            id: "finance_team",
            type: "role",
            identifier: "finance",
            preferences: {
              channels: [],
              frequency: "immediate",
              languages: [],
            },
            contactInfo: {},
          },
        ],
        template: "payroll_processed",
        priority: "medium",
        throttling: {
          enabled: true,
          maxPerHour: 5,
          maxPerDay: 10,
        },
        scheduling: {
          immediate: false,
          delay: 60000, // 1 minute delay
          businessHoursOnly: true,
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const rule of defaultRules) {
      await this.engine.addRule(rule);
    }
  }

  // ==================== PUBLIC API ====================

  async sendNotification(event) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.engine.processEvent(event);
  }

  async sendDirectNotification(
    recipientId,
    channelId,
    content,
    priority = "medium"
  ) {
    const event = {
      id: this.generateId(),
      type: "direct_notification",
      source: "manual",
      data: {
        recipientId,
        channelId,
        content,
        priority,
      },
      metadata: {
        timestamp: new Date(),
      },
      priority,
    };

    return this.sendNotification(event);
  }

  getChannelHealth() {
    return this.engine.getChannelHealth();
  }

  getDeliveryStats() {
    return this.engine.getDeliveryStats();
  }

  addEventListener(type, listener) {
    this.engine.addEventListener(type, listener);
  }

  removeEventListener(type, listener) {
    this.engine.removeEventListener(type, listener);
  }

  async shutdown() {
    return this.engine.shutdown();
  }

  generateId() {
    return `nm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ==================== GLOBAL INSTANCE ====================

const notificationManager = new NotificationManager();

// Auto-initialize when module is loaded
notificationManager.initialize().catch(console.error);

export { NotificationManager, notificationManager };
