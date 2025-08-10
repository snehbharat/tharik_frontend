import React, { useState, useEffect } from "react";
import {
  Bell,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Smartphone,
  Slack,
  Webhook,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Zap,
  Shield,
  Globe,
  Users,
  Target,
  Award,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
} from "lucide-react";
import { notificationManager } from "../../services/NotificationEngine.js";

export const NotificationDashboard = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'channels' | 'rules' | 'templates' | 'analytics'
  const [channelHealth, setChannelHealth] = useState([]);
  const [deliveryStats, setDeliveryStats] = useState({});
  const [realtimeEvents, setRealtimeEvents] = useState([]);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);

  // Load data
  useEffect(() => {
    const updateData = () => {
      setChannelHealth(notificationManager.getChannelHealth());
      setDeliveryStats(notificationManager.getDeliveryStats());
    };

    updateData();
    const interval = setInterval(updateData, 5000); // Update every 5 seconds

    // Listen for real-time events
    const handleNotificationProcessed = (event) => {
      setRealtimeEvents((prev) => [
        {
          id: Date.now(),
          type: "notification_processed",
          timestamp: new Date(),
          data: event.detail,
        },
        ...prev.slice(0, 49),
      ]);
    };

    const handleDeliveryUpdate = (event) => {
      setRealtimeEvents((prev) => [
        {
          id: Date.now(),
          type: "delivery_updated",
          timestamp: new Date(),
          data: event.detail,
        },
        ...prev.slice(0, 49),
      ]);
    };

    const handleChannelHealthChanged = (event) => {
      setRealtimeEvents((prev) => [
        {
          id: Date.now(),
          type: "channel_health_changed",
          timestamp: new Date(),
          data: event.detail,
        },
        ...prev.slice(0, 49),
      ]);
      updateData(); // Refresh channel health
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

    return () => {
      clearInterval(interval);
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
    };
  }, []);

  const getChannelIcon = (channelType) => {
    switch (channelType) {
      case "email":
        return <Mail className="w-5 h-5" />;
      case "sms":
        return <MessageSquare className="w-5 h-5" />;
      case "push":
        return <Smartphone className="w-5 h-5" />;
      case "slack":
        return <Slack className="w-5 h-5" />;
      case "webhook":
        return <Webhook className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200";
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "down":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateDeliveryRate = () => {
    const { sent, delivered } = deliveryStats;
    return sent > 0 ? ((delivered / sent) * 100).toFixed(1) : "0";
  };

  const calculateFailureRate = () => {
    const { sent, failed } = deliveryStats;
    return sent > 0 ? ((failed / sent) * 100).toFixed(1) : "0";
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic
              ? "لوحة تحكم التنبيهات المتقدمة"
              : "Advanced Notification Dashboard"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isArabic
              ? "إدارة شاملة للتنبيهات متعددة القنوات مع التوجيه الذكي"
              : "Comprehensive multi-channel notification management with smart routing"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير التقرير" : "Export Report"}
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            {isArabic ? "تحديث" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {deliveryStats.total || 0}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "إجمالي التنبيهات" : "Total Notifications"}
              </div>
            </div>
          </div>
          <div className="text-xs text-blue-600">
            {deliveryStats.pending || 0} {isArabic ? "معلق" : "pending"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {calculateDeliveryRate()}%
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "معدل التسليم" : "Delivery Rate"}
              </div>
            </div>
          </div>
          <div className="text-xs text-green-600">
            {deliveryStats.delivered || 0} {isArabic ? "مسلم" : "delivered"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {deliveryStats.avgDeliveryTime
                  ? `${Math.round(deliveryStats.avgDeliveryTime / 1000)}s`
                  : "0s"}
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "متوسط وقت التسليم" : "Avg Delivery Time"}
              </div>
            </div>
          </div>
          <div className="text-xs text-purple-600">
            {isArabic ? "في الوقت الفعلي" : "Real-time"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">
                {calculateFailureRate()}%
              </div>
              <div className="text-sm text-red-700">
                {isArabic ? "معدل الفشل" : "Failure Rate"}
              </div>
            </div>
          </div>
          <div className="text-xs text-red-600">
            {deliveryStats.failed || 0} {isArabic ? "فاشل" : "failed"}
          </div>
        </div>
      </div>

      {/* Smart Routing Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-800">
              {isArabic ? "التوجيه الذكي نشط" : "Smart Routing Active"}
            </h3>
            <p className="text-sm text-green-700">
              {isArabic
                ? "نظام التوجيه الذكي يعمل بكفاءة مع تحسين تلقائي للتسليم عبر القنوات المتعددة"
                : "Smart routing system operating efficiently with automatic optimization across multiple channels"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-800">Active</div>
            <div className="text-sm text-green-600">
              {isArabic ? "يعمل" : "Running"}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
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
              onClick={() => setActiveTab("channels")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "channels"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {isArabic ? "القنوات" : "Channels"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "rules"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? "القواعد" : "Rules"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "templates"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {isArabic ? "القوالب" : "Templates"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "analytics"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? "التحليلات" : "Analytics"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Channel Health Overview */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  {isArabic ? "حالة القنوات" : "Channel Health Status"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {channelHealth.map((channel) => (
                    <div
                      key={channel.channelId}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel.channelId.split("_")[0])}
                          <span className="font-medium text-gray-900 capitalize">
                            {channel.channelId.replace("_", " ")}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full border ${getHealthStatusColor(
                            channel.status
                          )}`}
                        >
                          {channel.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {isArabic ? "مرسل:" : "Sent:"}
                          </span>
                          <span className="font-medium">
                            {channel.metrics.sent}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {isArabic ? "مسلم:" : "Delivered:"}
                          </span>
                          <span className="font-medium text-green-600">
                            {channel.metrics.delivered}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {isArabic ? "فاشل:" : "Failed:"}
                          </span>
                          <span className="font-medium text-red-600">
                            {channel.metrics.failed}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {isArabic ? "متوسط الوقت:" : "Avg Time:"}
                          </span>
                          <span className="font-medium">
                            {channel.metrics.avgDeliveryTime
                              ? `${Math.round(
                                  channel.metrics.avgDeliveryTime / 1000
                                )}s`
                              : "0s"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Event Stream */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  {isArabic ? "تدفق الأحداث المباشر" : "Real-time Event Stream"}
                </h3>
                <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                  {realtimeEvents.length === 0 ? (
                    <div className="text-green-400 text-center py-8">
                      {isArabic
                        ? "في انتظار الأحداث..."
                        : "Waiting for events..."}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {realtimeEvents.map((event) => (
                        <div key={event.id} className="text-green-400">
                          <span className="text-gray-500">
                            [{event.timestamp.toLocaleTimeString()}]
                          </span>
                          <span className="text-yellow-400 ml-2">
                            {event.type.toUpperCase()}
                          </span>
                          <span className="text-green-400 ml-2">
                            {JSON.stringify(event.data, null, 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "channels" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "إدارة القنوات" : "Channel Management"}
                </h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {isArabic ? "إضافة قناة" : "Add Channel"}
                </button>
              </div>

              <div className="grid gap-6">
                {channelHealth.map((channel) => (
                  <div
                    key={channel.channelId}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            channel.status === "healthy"
                              ? "bg-green-100"
                              : channel.status === "degraded"
                              ? "bg-yellow-100"
                              : "bg-red-100"
                          }`}
                        >
                          {getChannelIcon(channel.channelId.split("_")[0])}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {channel.channelId.replace("_", " ")}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {isArabic
                              ? "قناة التنبيهات"
                              : "Notification Channel"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full border ${getHealthStatusColor(
                            channel.status
                          )}`}
                        >
                          {channel.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {channel.metrics.sent}
                        </div>
                        <div className="text-xs text-blue-700">
                          {isArabic ? "مرسل" : "Sent"}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-600">
                          {channel.metrics.delivered}
                        </div>
                        <div className="text-xs text-green-700">
                          {isArabic ? "مسلم" : "Delivered"}
                        </div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-red-600">
                          {channel.metrics.failed}
                        </div>
                        <div className="text-xs text-red-700">
                          {isArabic ? "فاشل" : "Failed"}
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {channel.metrics.avgDeliveryTime
                            ? `${Math.round(
                                channel.metrics.avgDeliveryTime / 1000
                              )}s`
                            : "0s"}
                        </div>
                        <div className="text-xs text-purple-700">
                          {isArabic ? "متوسط الوقت" : "Avg Time"}
                        </div>
                      </div>
                    </div>

                    {/* Channel Configuration Preview */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium">
                              {isArabic ? "الأولوية:" : "Priority:"}
                            </span>
                            <span className="ml-2">High</span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {isArabic ? "إعادة المحاولة:" : "Retry Attempts:"}
                            </span>
                            <span className="ml-2">3</span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {isArabic ? "المهلة الزمنية:" : "Timeout:"}
                            </span>
                            <span className="ml-2">30s</span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {isArabic ? "حد المعدل:" : "Rate Limit:"}
                            </span>
                            <span className="ml-2">100/min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "قواعد التنبيهات" : "Notification Rules"}
                </h3>
                <button
                  onClick={() => setShowCreateRule(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isArabic ? "إضافة قاعدة" : "Add Rule"}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic
                    ? "قواعد التنبيهات الذكية"
                    : "Smart Notification Rules"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "قواعد متقدمة مع شروط ديناميكية وتوجيه ذكي للمستلمين المناسبين"
                    : "Advanced rules with dynamic conditions and intelligent routing to appropriate recipients"}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض قواعد التنبيهات المُكونة هنا..."
                  : "Configured notification rules will be displayed here..."}
              </div>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "قوالب التنبيهات" : "Notification Templates"}
                </h3>
                <button
                  onClick={() => setShowCreateTemplate(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isArabic ? "إضافة قالب" : "Add Template"}
                </button>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">
                  {isArabic
                    ? "قوالب متعددة القنوات"
                    : "Multi-Channel Templates"}
                </h4>
                <p className="text-sm text-purple-700">
                  {isArabic
                    ? "قوالب موحدة مع دعم متعدد اللغات وتنسيق تلقائي لكل قناة"
                    : "Unified templates with multi-language support and automatic formatting for each channel"}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض قوالب التنبيهات المُكونة هنا..."
                  : "Configured notification templates will be displayed here..."}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic
                  ? "تحليلات التنبيهات المتقدمة"
                  : "Advanced Notification Analytics"}
              </h3>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-4">
                    {isArabic ? "معدل النجاح" : "Success Rate"}
                  </h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {calculateDeliveryRate()}%
                    </div>
                    <div className="text-sm text-green-700">
                      {isArabic ? "تسليم ناجح" : "Successful delivery"}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4">
                    {isArabic ? "الأداء" : "Performance"}
                  </h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {deliveryStats.avgDeliveryTime
                        ? `${Math.round(deliveryStats.avgDeliveryTime / 1000)}s`
                        : "0s"}
                    </div>
                    <div className="text-sm text-blue-700">
                      {isArabic ? "متوسط التسليم" : "Average delivery"}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-800 mb-4">
                    {isArabic ? "الحجم" : "Volume"}
                  </h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {deliveryStats.total || 0}
                    </div>
                    <div className="text-sm text-purple-700">
                      {isArabic ? "إجمالي التنبيهات" : "Total notifications"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic
                    ? "الرسوم البيانية التفاعلية"
                    : "Interactive Charts"}
                </h4>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض الرسوم البيانية التفاعلية للتحليلات المتقدمة هنا..."
                    : "Interactive charts for advanced analytics will be displayed here..."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Rule Modal */}
      {showCreateRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic
                  ? "إنشاء قاعدة تنبيه جديدة"
                  : "Create New Notification Rule"}
              </h3>
              <button
                onClick={() => setShowCreateRule(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "اسم القاعدة" : "Rule Name"}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder={
                    isArabic ? "أدخل اسم القاعدة" : "Enter rule name"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نوع الحدث" : "Event Type"}
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">
                    {isArabic ? "اختر نوع الحدث" : "Select event type"}
                  </option>
                  <option value="document_expiry">Document Expiry</option>
                  <option value="project_status_change">
                    Project Status Change
                  </option>
                  <option value="payroll_processed">Payroll Processed</option>
                  <option value="employee_onboarding">
                    Employee Onboarding
                  </option>
                  <option value="safety_incident">Safety Incident</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الأولوية" : "Priority"}
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="low">{isArabic ? "منخفض" : "Low"}</option>
                  <option value="medium">
                    {isArabic ? "متوسط" : "Medium"}
                  </option>
                  <option value="high">{isArabic ? "عالي" : "High"}</option>
                  <option value="critical">
                    {isArabic ? "حرج" : "Critical"}
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {isArabic ? "إنشاء القاعدة" : "Create Rule"}
                </button>
                <button
                  onClick={() => setShowCreateRule(false)}
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
