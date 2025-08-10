import React from "react";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Award,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  useBilingual,
  BilingualText,
  BilingualCard,
  BilingualStatusBadge,
  BilingualTable,
} from "./BilingualLayout";
import { useWorkforceData } from "../hooks/useWorkforceData";

export const EnhancedBilingualDashboard = ({ className = "" }) => {
  const { language, isRTL, formatCurrency, formatNumber } = useBilingual();
  const { getDashboardMetrics, employees, projects } = useWorkforceData();

  const metrics = getDashboardMetrics();

  // Sample data for demonstration
  const recentActivities = [
    {
      id: 1,
      type: "project_update",
      titleEn: "Project Status Updated",
      titleAr: "تم تحديث حالة المشروع",
      descriptionEn:
        "Aramco Facility Maintenance project marked as 75% complete",
      descriptionAr: "مشروع صيانة منشآت أرامكو تم تحديده كمكتمل بنسبة 75%",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "success",
      statusAr: "نجح",
    },
    {
      id: 2,
      type: "employee_added",
      titleEn: "New Employee Added",
      titleAr: "تم إضافة موظف جديد",
      descriptionEn: "Omar Al-Kindi joined as Senior Welder",
      descriptionAr: "عمر الكندي انضم كلحام أول",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: "info",
      statusAr: "معلومات",
    },
    {
      id: 3,
      type: "document_expiry",
      titleEn: "Document Expiry Alert",
      titleAr: "تنبيه انتهاء وثيقة",
      descriptionEn: "Ali Al-Mahmoud's Iqama expires in 15 days",
      descriptionAr: "إقامة علي المحمود تنتهي خلال 15 يوم",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: "warning",
      statusAr: "تحذير",
    },
  ];

  const topPerformers = [
    {
      id: 1,
      nameEn: "Ahmed Al-Rashid",
      nameAr: "أحمد الراشد",
      role: "Site Supervisor",
      roleAr: "مشرف موقع",
      performance: 95,
      profit: 45000,
    },
    {
      id: 2,
      nameEn: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراء",
      role: "Safety Officer",
      roleAr: "مسؤول السلامة",
      performance: 92,
      profit: 38000,
    },
    {
      id: 3,
      nameEn: "Mohammad Hassan",
      nameAr: "محمد حسن",
      role: "Equipment Operator",
      roleAr: "مشغل معدات",
      performance: 89,
      profit: 32000,
    },
  ];

  const tableColumns = [
    {
      key: "name",
      label: "Employee",
      labelAr: "الموظف",
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">
            {language === "ar" ? row.nameAr : row.nameEn}
          </div>
          <div className="text-sm text-gray-500">
            {language === "ar" ? row.roleAr : row.role}
          </div>
        </div>
      ),
    },
    {
      key: "performance",
      label: "Performance",
      labelAr: "الأداء",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      ),
    },
    {
      key: "profit",
      label: "Profit Generated",
      labelAr: "الربح المحقق",
      render: (value) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(value)}
        </span>
      ),
    },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "info";
    }
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return language === "ar" ? "منذ دقائق" : "minutes ago";
    } else if (diffInHours < 24) {
      return language === "ar"
        ? `منذ ${diffInHours} ساعة`
        : `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return language === "ar" ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`;
    }
  };
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Section */}
      <div
        className={`bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <BilingualText
          en="Welcome to AMOAGC Workforce Intelligence"
          ar="مرحباً بك في منصة ذكاء القوى العاملة لأموجك"
          className="text-2xl font-bold mb-2"
          tag="h1"
        />
        <BilingualText
          en="Real-time insights and optimization for your workforce operations"
          ar="رؤى فورية وتحسين لعمليات القوى العاملة الخاصة بك"
          className="text-green-100 opacity-90"
          tag="p"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BilingualCard className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <div className="text-2xl font-bold text-blue-900">
                {formatNumber(metrics.totalWorkforce)}
              </div>
              <BilingualText
                en="Total Workforce"
                ar="إجمالي القوى العاملة"
                className="text-sm text-blue-700 font-medium"
              />
            </div>
          </div>
        </BilingualCard>

        <BilingualCard className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <div className="text-2xl font-bold text-green-900">
                {formatNumber(metrics.activeProjects)}
              </div>
              <BilingualText
                en="Active Projects"
                ar="المشاريع النشطة"
                className="text-sm text-green-700 font-medium"
              />
            </div>
          </div>
        </BilingualCard>

        <BilingualCard className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <div className="text-2xl font-bold text-purple-900">
                {formatCurrency(metrics.realTimeProfits)}
              </div>
              <BilingualText
                en="Real-Time Profits"
                ar="الأرباح الفورية"
                className="text-sm text-purple-700 font-medium"
              />
            </div>
          </div>
        </BilingualCard>

        <BilingualCard className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <div className="text-2xl font-bold text-yellow-900">
                {metrics.utilizationRate.toFixed(1)}%
              </div>
              <BilingualText
                en="Utilization Rate"
                ar="معدل الاستغلال"
                className="text-sm text-yellow-700 font-medium"
              />
            </div>
          </div>
        </BilingualCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <BilingualCard
            title="Recent Activities"
            titleAr="الأنشطة الحديثة"
            headerActions={
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                <BilingualText en="View All" ar="عرض الكل" />
              </button>
            }
          >
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    {activity.type === "project_update" && (
                      <Target className="w-5 h-5 text-blue-600" />
                    )}
                    {activity.type === "employee_added" && (
                      <Users className="w-5 h-5 text-green-600" />
                    )}
                    {activity.type === "document_expiry" && (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div
                    className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <div className="font-medium text-gray-900">
                      {language === "ar" ? activity.titleAr : activity.titleEn}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {language === "ar"
                        ? activity.descriptionAr
                        : activity.descriptionEn}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <BilingualStatusBadge
                        status={activity.status}
                        statusAr={activity.statusAr}
                        variant={getStatusVariant(activity.status)}
                      />
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BilingualCard>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Performance Overview */}
          <BilingualCard
            title="Performance Overview"
            titleAr="نظرة عامة على الأداء"
          >
            <div className="space-y-4">
              <div
                className={`flex items-center justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <BilingualText
                  en="Productivity Index"
                  ar="مؤشر الإنتاجية"
                  className="text-sm text-gray-600"
                />
                <span className="font-semibold text-green-600">
                  {formatCurrency(metrics.productivityIndex)}
                </span>
              </div>
              <div
                className={`flex items-center justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <BilingualText
                  en="Profit Margin"
                  ar="هامش الربح"
                  className="text-sm text-gray-600"
                />
                <span className="font-semibold text-blue-600">
                  {metrics.averageProfitMargin.toFixed(1)}%
                </span>
              </div>
              <div
                className={`flex items-center justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <BilingualText
                  en="Total Hours"
                  ar="إجمالي الساعات"
                  className="text-sm text-gray-600"
                />
                <span className="font-semibold text-purple-600">
                  {formatNumber(metrics.aggregateHours)}
                </span>
              </div>
            </div>
          </BilingualCard>

          {/* Quick Actions */}
          <BilingualCard title="Quick Actions" titleAr="إجراءات سريعة">
            <div className="space-y-3">
              <button
                className={`w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors ${
                  isRTL ? "flex-row-reverse text-right" : "text-left"
                }`}
              >
                <Users className="w-5 h-5 text-blue-600" />
                <BilingualText
                  en="Add Employee"
                  ar="إضافة موظف"
                  className="font-medium text-blue-700"
                />
              </button>
              <button
                className={`w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors ${
                  isRTL ? "flex-row-reverse text-right" : "text-left"
                }`}
              >
                <Building2 className="w-5 h-5 text-green-600" />
                <BilingualText
                  en="New Project"
                  ar="مشروع جديد"
                  className="font-medium text-green-700"
                />
              </button>
            </div>
          </BilingualCard>
        </div>
      </div>

      {/* Top Performers Table */}
      <BilingualCard
        title="Top Performers"
        titleAr="أفضل الموظفين أداءً"
        headerActions={
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            <BilingualText en="View All" ar="عرض الكل" />
          </button>
        }
      >
        <BilingualTable
          columns={tableColumns}
          data={topPerformers}
          emptyMessage="No performance data available"
          emptyMessageAr="لا توجد بيانات أداء متاحة"
        />
      </BilingualCard>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BilingualCard className="bg-green-50 border-green-200">
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className={isRTL ? "text-right" : "text-left"}>
              <BilingualText
                en="System Status"
                ar="حالة النظام"
                className="font-semibold text-green-800"
                tag="h3"
              />
              <BilingualText
                en="All systems operational"
                ar="جميع الأنظمة تعمل بشكل طبيعي"
                className="text-sm text-green-600"
                tag="p"
              />
            </div>
          </div>
        </BilingualCard>

        <BilingualCard className="bg-blue-50 border-blue-200">
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Activity className="w-8 h-8 text-blue-600" />
            <div className={isRTL ? "text-right" : "text-left"}>
              <BilingualText
                en="Data Sync"
                ar="مزامنة البيانات"
                className="font-semibold text-blue-800"
                tag="h3"
              />
              <BilingualText
                en="Last sync: 2 minutes ago"
                ar="آخر مزامنة: منذ دقيقتين"
                className="text-sm text-blue-600"
                tag="p"
              />
            </div>
          </div>
        </BilingualCard>

        <BilingualCard className="bg-yellow-50 border-yellow-200">
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className={isRTL ? "text-right" : "text-left"}>
              <BilingualText
                en="Backup Status"
                ar="حالة النسخ الاحتياطي"
                className="font-semibold text-yellow-800"
                tag="h3"
              />
              <BilingualText
                en="Next backup in 4 hours"
                ar="النسخة الاحتياطية التالية خلال 4 ساعات"
                className="text-sm text-yellow-600"
                tag="p"
              />
            </div>
          </div>
        </BilingualCard>
      </div>
    </div>
  );
};
