import React, { useState, useEffect } from "react";
import {
  Settings,
  Globe,
  Shield,
  Building2,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Eye,
  EyeOff,
  Save,
  TestTube as Test,
  RefreshCw,
  Download,
  Upload,
  Bell,
  Activity,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { IntegrationService } from "../../services/IntegrationService";

export const IntegrationControlPanel = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [integrations, setIntegrations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCredentials, setShowCredentials] = useState({});
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [error, setError] = useState(null);

  const integrationConfigs = {
    zatca: {
      name: "ZATCA E-Invoicing",
      nameAr: "هيئة الزكاة والضرائب والجمارك",
      description: "Saudi tax authority e-invoicing and VAT compliance",
      descriptionAr: "الفوترة الإلكترونية وامتثال ضريبة القيمة المضافة",
      icon: Shield,
      color: "bg-green-100 text-green-800 border-green-200",
      features: ["E-Invoicing", "VAT Reporting", "Tax Compliance"],
      featuresAr: [
        "الفوترة الإلكترونية",
        "تقارير ضريبة القيمة المضافة",
        "الامتثال الضريبي",
      ],
    },
    gosi: {
      name: "GOSI Social Insurance",
      nameAr: "التأمينات الاجتماعية",
      description: "Social insurance contributions and employee registration",
      descriptionAr: "مساهمات التأمينات الاجتماعية وتسجيل الموظفين",
      icon: Building2,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      features: [
        "Payroll Reporting",
        "Employee Registration",
        "Contribution Calculation",
      ],
      featuresAr: ["تقارير الرواتب", "تسجيل الموظفين", "حساب المساهمات"],
    },
    qiwa: {
      name: "QIWA Labor Platform",
      nameAr: "منصة قوى",
      description: "Workforce management and labor compliance",
      descriptionAr: "إدارة القوى العاملة والامتثال العمالي",
      icon: Globe,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      features: [
        "Workforce Reporting",
        "Permit Management",
        "Labor Compliance",
      ],
      featuresAr: [
        "تقارير القوى العاملة",
        "إدارة التصاريح",
        "الامتثال العمالي",
      ],
    },
    banking: {
      name: "Saudi Banking API",
      nameAr: "واجهة البنوك السعودية",
      description: "Banking services and payment processing",
      descriptionAr: "الخدمات المصرفية ومعالجة المدفوعات",
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      features: ["Account Management", "Transfers", "Transaction History"],
      featuresAr: ["إدارة الحسابات", "التحويلات", "تاريخ المعاملات"],
    },
  };

  useEffect(() => {
    loadIntegrations();
    loadSystemLogs();
  }, []);

  const loadIntegrations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await IntegrationService.getIntegrations();
      setIntegrations(response.data || []);
    } catch (error) {
      console.error("Failed to load integrations:", error);
      setError(
        "Failed to load integrations. Please check if the backend server is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemLogs = async () => {
    try {
      setError(null);
      const response = await IntegrationService.getSystemLogs();
      setLogs(response.data || []);
    } catch (error) {
      console.error("Failed to load logs:", error);
      setError("Failed to load system logs. Please check your connection.");
    }
  };

  const toggleIntegration = async (integrationId) => {
    try {
      setError(null);
      await IntegrationService.toggleIntegration(integrationId);
      await loadIntegrations();
    } catch (error) {
      console.error("Failed to toggle integration:", error);
      setError(
        isArabic ? "فشل في تغيير حالة التكامل" : "Failed to toggle integration"
      );
    }
  };

  const testIntegration = async (integrationId) => {
    try {
      setError(null);
      setTestResults((prev) => ({
        ...prev,
        [integrationId]: { testing: true },
      }));
      const result = await IntegrationService.testIntegration(integrationId);
      setTestResults((prev) => ({ ...prev, [integrationId]: result }));
      await loadIntegrations();
    } catch (error) {
      console.error("Failed to test integration:", error);
      setTestResults((prev) => ({
        ...prev,
        [integrationId]: {
          success: false,
          error: error instanceof Error ? error.message : "Test failed",
        },
      }));
      setError("Integration test failed. Please check the configuration.");
    }
  };

  const testAllIntegrations = async () => {
    setIsTestingAll(true);
    try {
      const enabledIntegrations = integrations.filter((i) => i.enabled);
      for (const integration of enabledIntegrations) {
        await testIntegration(integration.id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } finally {
      setIsTestingAll(false);
    }
  };

  const saveIntegration = async (integration) => {
    try {
      setError(null);
      if (integration.id) {
        await IntegrationService.updateIntegration(integration.id, integration);
      } else {
        await IntegrationService.createIntegration(integration);
      }
      setEditingIntegration(null);
      await loadIntegrations();
    } catch (error) {
      console.error("Failed to save integration:", error);
      setError(isArabic ? "فشل في حفظ التكامل" : "Failed to save integration");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "disconnected":
        return <XCircle className="w-5 h-5 text-gray-600" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "testing":
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200";
      case "disconnected":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "testing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatLastSync = (lastSync) => {
    if (!lastSync) return isArabic ? "لم يتم المزامنة" : "Never synced";
    const date = new Date(lastSync);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return isArabic ? "الآن" : "Just now";
    if (diffMinutes < 60)
      return isArabic ? `منذ ${diffMinutes} دقيقة` : `${diffMinutes}m ago`;
    if (diffMinutes < 1440)
      return isArabic
        ? `منذ ${Math.floor(diffMinutes / 60)} ساعة`
        : `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };
  return (
    <div className="p-6 space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic ? "لوحة تحكم التكاملات" : "Integration Control Panel"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isArabic
              ? "إدارة التكاملات مع الجهات الحكومية والمصرفية السعودية"
              : "Manage integrations with Saudi government and banking services"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={testAllIntegrations}
            disabled={isTestingAll}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isTestingAll ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {isTestingAll
              ? isArabic
                ? "جاري الاختبار..."
                : "Testing..."
              : isArabic
              ? "اختبار الكل"
              : "Test All"}
          </button>
          <button
            onClick={loadIntegrations}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {isArabic ? "تحديث" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isArabic ? "جاري تحميل التكاملات..." : "Loading integrations..."}
            </p>
          </div>
        </div>
      )}

      {/* Integration Status Overview */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(integrationConfigs).map(([type, config]) => {
            const integration = integrations.find((i) => i.type === type);
            const Icon = config.icon;

            return (
              <div
                key={type}
                className={`rounded-lg p-6 border ${config.color}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {isArabic ? config.nameAr : config.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isArabic ? config.descriptionAr : config.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(integration?.status || "disconnected")}
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        integration?.status || "disconnected"
                      )}`}
                    >
                      {integration?.status || "disconnected"}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={integration?.enabled || false}
                      onChange={() =>
                        integration && toggleIntegration(integration.id)
                      }
                      disabled={!integration}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="text-xs text-gray-500">
                  {isArabic ? "آخر مزامنة:" : "Last sync:"}{" "}
                  {formatLastSync(integration?.last_sync || null)}
                </div>

                {integration?.last_error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    {integration.last_error}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() =>
                      integration && testIntegration(integration.id)
                    }
                    disabled={!integration?.enabled}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    {isArabic ? "اختبار" : "Test"}
                  </button>
                  <button
                    onClick={() => setEditingIntegration(integration || null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    {isArabic ? "إعداد" : "Configure"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {isArabic ? "نظرة عامة" : "Overview"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("configurations")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "configurations"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {isArabic ? "الإعدادات" : "Configurations"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "logs"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? "السجلات" : "Activity Logs"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("testing")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "testing"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Test className="w-4 h-4" />
                {isArabic ? "الاختبار" : "Testing"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* System Health */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {isArabic ? "حالة النظام" : "System Health"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-green-600">
                      {
                        integrations.filter(
                          (i) => i.enabled && i.status === "connected"
                        ).length
                      }
                    </div>
                    <div className="text-xs text-gray-600">
                      {isArabic ? "متصل" : "Connected"}
                    </div>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-red-600">
                      {
                        integrations.filter(
                          (i) => i.enabled && i.status === "error"
                        ).length
                      }
                    </div>
                    <div className="text-xs text-gray-600">
                      {isArabic ? "خطأ" : "Error"}
                    </div>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-gray-600">
                      {integrations.filter((i) => !i.enabled).length}
                    </div>
                    <div className="text-xs text-gray-600">
                      {isArabic ? "معطل" : "Disabled"}
                    </div>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {
                        logs.filter(
                          (l) =>
                            l.status === "success" &&
                            new Date(l.created_at) >
                              new Date(Date.now() - 24 * 60 * 60 * 1000)
                        ).length
                      }
                    </div>
                    <div className="text-xs text-gray-600">
                      {isArabic ? "نجح اليوم" : "Success Today"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isArabic ? "النشاط الحديث" : "Recent Activity"}
                </h3>
                <div className="space-y-3">
                  {logs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 bg-white rounded border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        {log.status === "success" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {log.action}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {log.duration_ms}ms
                        </div>
                        <div
                          className={`text-xs ${
                            log.status === "success"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {log.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "configurations" && (
            <div className="space-y-6">
              <div className="grid gap-6">
                {integrations.map((integration) => {
                  const config = integrationConfigs[integration.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={integration.id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {isArabic ? config.nameAr : config.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {isArabic
                                ? config.descriptionAr
                                : config.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                          <button
                            onClick={() => setEditingIntegration(integration)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">
                            {isArabic ? "الإعدادات" : "Configuration"}
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>
                              {isArabic ? "النقطة النهائية:" : "Endpoint:"}{" "}
                              {integration.config.endpoint}
                            </div>
                            <div>
                              {isArabic ? "البيئة:" : "Environment:"}{" "}
                              {integration.config.environment}
                            </div>
                            <div>
                              {isArabic ? "المهلة الزمنية:" : "Timeout:"}{" "}
                              {integration.config.timeout}ms
                            </div>
                            <div>
                              {isArabic ? "إعادة المحاولة:" : "Retry attempts:"}{" "}
                              {integration.config.retry_attempts}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">
                            {isArabic ? "الميزات" : "Features"}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {(isArabic
                              ? config.featuresAr
                              : config.features
                            ).map((feature, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "سجلات النشاط" : "Activity Logs"}
                </h3>
                <button
                  onClick={loadSystemLogs}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {isArabic ? "تحديث" : "Refresh"}
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الوقت" : "Time"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "التكامل" : "Integration"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الإجراء" : "Action"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الحالة" : "Status"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "المدة" : "Duration"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الإجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {integrations.find(
                              (i) => i.id === log.integration_id
                            )?.name || "Unknown"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.action}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                log.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : log.status === "error"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.duration_ms}ms
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "testing" && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  {isArabic ? "اختبار التكاملات" : "Integration Testing"}
                </h3>
                <p className="text-sm text-yellow-700">
                  {isArabic
                    ? "اختبر اتصال التكاملات للتأكد من عملها بشكل صحيح"
                    : "Test integration connections to ensure they are working properly"}
                </p>
              </div>

              <div className="grid gap-4">
                {integrations
                  .filter((i) => i.enabled)
                  .map((integration) => {
                    const config = integrationConfigs[integration.type];
                    const Icon = config.icon;
                    const testResult = testResults[integration.id];

                    return (
                      <div
                        key={integration.id}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6" />
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {isArabic ? config.nameAr : config.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {integration.config.endpoint}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {testResult && (
                              <div className="text-right">
                                <div
                                  className={`text-sm font-medium ${
                                    testResult.success
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {testResult.testing
                                    ? isArabic
                                      ? "جاري الاختبار..."
                                      : "Testing..."
                                    : testResult.success
                                    ? isArabic
                                      ? "نجح"
                                      : "Success"
                                    : isArabic
                                    ? "فشل"
                                    : "Failed"}
                                </div>
                                {testResult.response_time && (
                                  <div className="text-xs text-gray-500">
                                    {testResult.response_time}ms
                                  </div>
                                )}
                              </div>
                            )}
                            <button
                              onClick={() => testIntegration(integration.id)}
                              disabled={testResult?.testing}
                              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                              {testResult?.testing ? (
                                <Clock className="w-4 h-4 animate-spin" />
                              ) : (
                                <Test className="w-4 h-4" />
                              )}
                              {isArabic ? "اختبار" : "Test"}
                            </button>
                          </div>
                        </div>

                        {testResult?.error && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            {testResult.error}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Integration Modal */}
      {editingIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "تكوين التكامل" : "Configure Integration"}
              </h3>
              <button
                onClick={() => setEditingIntegration(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Configuration */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "الإعدادات الأساسية" : "Basic Configuration"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "النقطة النهائية" : "API Endpoint"}
                    </label>
                    <input
                      type="url"
                      value={editingIntegration.config.endpoint}
                      onChange={(e) =>
                        setEditingIntegration({
                          ...editingIntegration,
                          config: {
                            ...editingIntegration.config,
                            endpoint: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "البيئة" : "Environment"}
                    </label>
                    <select
                      value={editingIntegration.config.environment}
                      onChange={(e) =>
                        setEditingIntegration({
                          ...editingIntegration,
                          config: {
                            ...editingIntegration.config,
                            environment: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="sandbox">
                        {isArabic ? "تجريبي" : "Sandbox"}
                      </option>
                      <option value="production">
                        {isArabic ? "إنتاج" : "Production"}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic
                        ? "المهلة الزمنية (مللي ثانية)"
                        : "Timeout (ms)"}
                    </label>
                    <input
                      type="number"
                      value={editingIntegration.config.timeout}
                      onChange={(e) =>
                        setEditingIntegration({
                          ...editingIntegration,
                          config: {
                            ...editingIntegration.config,
                            timeout: parseInt(e.target.value) || 30000,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="1000"
                      max="120000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "محاولات إعادة" : "Retry Attempts"}
                    </label>
                    <input
                      type="number"
                      value={editingIntegration.config.retry_attempts}
                      onChange={(e) =>
                        setEditingIntegration({
                          ...editingIntegration,
                          config: {
                            ...editingIntegration.config,
                            retry_attempts: parseInt(e.target.value) || 3,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">
                    {isArabic ? "بيانات الاعتماد" : "API Credentials"}
                  </h4>
                  <button
                    onClick={() =>
                      setShowCredentials((prev) => ({
                        ...prev,
                        [editingIntegration.id]: !prev[editingIntegration.id],
                      }))
                    }
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showCredentials[editingIntegration.id] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(editingIntegration.credentials).map(
                    ([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key.replace("_", " ")}
                        </label>
                        <input
                          type={
                            showCredentials[editingIntegration.id]
                              ? "text"
                              : "password"
                          }
                          value={value}
                          onChange={(e) =>
                            setEditingIntegration({
                              ...editingIntegration,
                              credentials: {
                                ...editingIntegration.credentials,
                                [key]: e.target.value,
                              },
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder={`Enter ${key.replace("_", " ")}`}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => saveIntegration(editingIntegration)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ التكوين" : "Save Configuration"}
                </button>
                <button
                  onClick={() => testIntegration(editingIntegration.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Test className="w-4 h-4" />
                  {isArabic ? "اختبار الاتصال" : "Test Connection"}
                </button>
                <button
                  onClick={() => setEditingIntegration(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
