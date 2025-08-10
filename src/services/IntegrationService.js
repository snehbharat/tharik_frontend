// Frontend Integration Service for API communication

export class IntegrationService {
  static BASE_URL = import.meta.env.VITE_API_URL || "";

  static MOCK_INTEGRATIONS = [
    {
      id: "1",
      name: "ZATCA E-Invoicing",
      type: "zatca",
      enabled: true,
      status: "connected",
      config: {
        endpoint: "https://api.zatca.gov.sa/v1",
        timeout: 30000,
        retry_attempts: 3,
        rate_limit: 100,
        environment: "sandbox",
        features: ["E-Invoicing", "VAT Reporting", "Tax Compliance"],
      },
      credentials: { api_key: "****", secret: "****" },
      last_sync: new Date().toISOString(),
      last_error: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "GOSI Social Insurance",
      type: "gosi",
      enabled: true,
      status: "connected",
      config: {
        endpoint: "https://api.gosi.gov.sa/v1",
        timeout: 30000,
        retry_attempts: 3,
        rate_limit: 50,
        environment: "sandbox",
        features: [
          "Payroll Reporting",
          "Employee Registration",
          "Contribution Calculation",
        ],
      },
      credentials: { username: "****", password: "****" },
      last_sync: new Date(Date.now() - 3600000).toISOString(),
      last_error: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "QIWA Labor Platform",
      type: "qiwa",
      enabled: false,
      status: "disconnected",
      config: {
        endpoint: "https://api.qiwa.sa/v1",
        timeout: 30000,
        retry_attempts: 3,
        rate_limit: 75,
        environment: "sandbox",
        features: [
          "Workforce Reporting",
          "Permit Management",
          "Labor Compliance",
        ],
      },
      credentials: { client_id: "****", client_secret: "****" },
      last_sync: null,
      last_error: "Authentication failed",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Saudi Banking API",
      type: "banking",
      enabled: true,
      status: "connected",
      config: {
        endpoint: "https://api.saudipayments.sa/v1",
        timeout: 30000,
        retry_attempts: 3,
        rate_limit: 200,
        environment: "sandbox",
        features: ["Account Management", "Transfers", "Transaction History"],
      },
      credentials: { bank_id: "****", api_token: "****" },
      last_sync: new Date(Date.now() - 1800000).toISOString(),
      last_error: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  static MOCK_LOGS = [
    {
      id: "1",
      integration_id: "1",
      action: "Submit Invoice",
      status: "success",
      duration_ms: 245,
      created_at: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: "2",
      integration_id: "2",
      action: "Sync Employee Data",
      status: "success",
      duration_ms: 1200,
      created_at: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: "3",
      integration_id: "3",
      action: "Update Workforce Status",
      status: "error",
      error_message: "Authentication failed",
      duration_ms: 5000,
      created_at: new Date(Date.now() - 900000).toISOString(),
    },
    {
      id: "4",
      integration_id: "4",
      action: "Process Payment",
      status: "success",
      duration_ms: 890,
      created_at: new Date(Date.now() - 1200000).toISOString(),
    },
    {
      id: "5",
      integration_id: "1",
      action: "VAT Report Generation",
      status: "success",
      duration_ms: 567,
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  static async request(endpoint, options = {}) {
    const token = localStorage.getItem("amoagc_token");

    try {
      const response = await fetch(
        `${this.BASE_URL}/api/integrations${endpoint}`,
        {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...options.headers,
          },
        }
      );

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "Request failed" }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.warn("Backend not available, using mock data");
        return this.getMockResponse(endpoint, options.method || "GET");
      }
      throw error;
    }
  }

  static getMockResponse(endpoint, method) {
    if (endpoint === "" && method === "GET") {
      return { success: true, data: this.MOCK_INTEGRATIONS };
    }

    if (endpoint.includes("/logs/system")) {
      return { success: true, data: this.MOCK_LOGS };
    }

    if (endpoint.includes("/test") && method === "POST") {
      return {
        success: true,
        data: {
          success: true,
          status: "connected",
          response_time: Math.floor(Math.random() * 1000) + 200,
        },
      };
    }

    if (endpoint.includes("/toggle") && method === "PATCH") {
      return { success: true, data: this.MOCK_INTEGRATIONS[0] };
    }

    if (endpoint.includes("/health/check")) {
      return {
        success: true,
        data: {
          zatca: { success: true, status: "connected", response_time: 245 },
          gosi: { success: true, status: "connected", response_time: 567 },
          qiwa: { success: false, status: "error", response_time: 5000 },
          banking: { success: true, status: "connected", response_time: 890 },
        },
      };
    }

    return { success: true, data: null };
  }

  static async getIntegrations() {
    return this.request("");
  }

  static async getIntegration(id) {
    return this.request(`/${id}`);
  }

  static async createIntegration(integration) {
    return this.request("", {
      method: "POST",
      body: JSON.stringify(integration),
    });
  }

  static async updateIntegration(id, updates) {
    return this.request(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  static async toggleIntegration(id) {
    return this.request(`/${id}/toggle`, {
      method: "PATCH",
    });
  }

  static async testIntegration(id) {
    return this.request(`/${id}/test`, {
      method: "POST",
    });
  }

  static async getIntegrationLogs(id, limit = 50) {
    return this.request(`/${id}/logs?limit=${limit}`);
  }

  static async getSystemLogs(limit = 100) {
    return this.request(`/logs/system?limit=${limit}`);
  }

  static async performHealthCheck() {
    return this.request("/health/check");
  }

  static async deleteIntegration(id) {
    return this.request(`/${id}`, {
      method: "DELETE",
    });
  }

  static async submitZATCAInvoice(invoiceData) {
    return this.request("/zatca/invoice", {
      method: "POST",
      body: JSON.stringify(invoiceData),
    });
  }

  static async submitGOSIReport(reportData) {
    return this.request("/gosi/report", {
      method: "POST",
      body: JSON.stringify(reportData),
    });
  }

  static async syncQIWAData() {
    return this.request("/qiwa/sync", {
      method: "POST",
    });
  }

  static async processBankTransfer(transferData) {
    return this.request("/banking/transfer", {
      method: "POST",
      body: JSON.stringify(transferData),
    });
  }

  static async exportLogs(integrationId) {
    try {
      const logs = integrationId
        ? await this.getIntegrationLogs(integrationId, 1000)
        : await this.getSystemLogs(1000);

      const csvContent = [
        [
          "Timestamp",
          "Integration",
          "Action",
          "Status",
          "Duration (ms)",
          "Error",
        ],
        ...logs.data.map((log) => [
          log.created_at,
          log.integration_id,
          log.action,
          log.status,
          log.duration_ms.toString(),
          log.error_message || "",
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `integration_logs_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export logs:", error);
      throw error;
    }
  }

  static startStatusMonitoring(callback) {
    const interval = setInterval(async () => {
      try {
        const healthCheck = await this.performHealthCheck();
        callback(healthCheck.data);
      } catch (error) {
        console.error("Health check failed:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }
}
