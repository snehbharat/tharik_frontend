import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Award,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  Briefcase,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Edit,
  Plus,
  Settings,
  Bell,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWorkforceData } from "../../hooks/useWorkforceData";
import {
  formatCurrency,
  formatPercentage,
} from "../../utils/financialCalculations";

export const ComprehensiveAdminDashboard = ({ isArabic = false }) => {
  const { user, hasPermission } = useAuth();
  const { employees, projects, getDashboardMetrics } = useWorkforceData();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRealTime, setIsRealTime] = useState(true);

  const isAdmin = hasPermission("dashboard:view_all") || user?.role.level >= 8;

  const companyMetrics = useMemo(() => {
    const baseMetrics = getDashboardMetrics();

    return {
      revenue: {
        current: baseMetrics.crossProjectRevenue,
        previous: baseMetrics.crossProjectRevenue * 0.85,
        growthRate: 15.2,
        target: baseMetrics.crossProjectRevenue * 1.1,
      },
      profitability: {
        grossMargin: baseMetrics.averageProfitMargin,
        netMargin: baseMetrics.averageProfitMargin * 0.8,
        operatingMargin: baseMetrics.averageProfitMargin * 0.9,
        trend: "increasing",
      },
      productivity: {
        revenuePerEmployee:
          baseMetrics.crossProjectRevenue / baseMetrics.totalWorkforce,
        hoursUtilization: baseMetrics.utilizationRate,
        efficiencyIndex: baseMetrics.productivityIndex,
        benchmarkComparison: 112,
      },
    };
  }, [getDashboardMetrics]);

  const employeePerformanceData = useMemo(() => {
    return employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      nameAr: emp.name,
      department:
        projects.find((p) => p.id === emp.projectId)?.name || "Unassigned",
      position: emp.trade,
      performanceScore: emp.performanceRating || 85,
      taskCompletionRate: 85 + Math.random() * 15,
      qualityRating: 80 + Math.random() * 20,
      attendanceRate: 90 + Math.random() * 10,
      goalAchievement: 70 + Math.random() * 30,
      lastReviewDate: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      skillsProgress: 60 + Math.random() * 40,
      collaborationScore: 75 + Math.random() * 25,
      innovationIndex: 65 + Math.random() * 35,
    }));
  }, [employees, projects]);

  const departmentAnalytics = useMemo(() => {
    const departments = [
      { id: "operations", name: "Operations", nameAr: "العمليات" },
      { id: "hr", name: "Human Resources", nameAr: "الموارد البشرية" },
      { id: "finance", name: "Finance", nameAr: "المالية" },
      { id: "safety", name: "Safety", nameAr: "السلامة" },
      { id: "maintenance", name: "Maintenance", nameAr: "الصيانة" },
    ];

    return departments.map((dept) => {
      const deptEmployees = employeePerformanceData.filter((emp) =>
        emp.department.toLowerCase().includes(dept.name.toLowerCase())
      );

      return {
        id: dept.id,
        name: dept.name,
        nameAr: dept.nameAr,
        employeeCount:
          deptEmployees.length || Math.floor(Math.random() * 20) + 5,
        avgPerformance:
          deptEmployees.length > 0
            ? deptEmployees.reduce(
                (sum, emp) => sum + emp.performanceScore,
                0
              ) / deptEmployees.length
            : 80 + Math.random() * 20,
        productivity: 75 + Math.random() * 25,
        utilization: 80 + Math.random() * 20,
        budget: (deptEmployees.length || 10) * 75000,
        budgetUtilization: 70 + Math.random() * 30,
        projectsCompleted: Math.floor(Math.random() * 15) + 5,
        satisfactionScore: 75 + Math.random() * 25,
      };
    });
  }, [employeePerformanceData]);

  const filteredEmployees = useMemo(() => {
    return employeePerformanceData.filter((emp) => {
      const matchesSearch =
        !searchTerm ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" ||
        emp.department.toLowerCase().includes(departmentFilter.toLowerCase());

      return matchesSearch && matchesDepartment;
    });
  }, [employeePerformanceData, searchTerm, departmentFilter]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isArabic ? "الوصول مرفوض" : "Access Denied"}
          </h2>
          <p className="text-gray-600">
            {isArabic
              ? "تحتاج صلاحيات إدارية للوصول لهذه الصفحة"
              : "You need administrative privileges to access this page"}
          </p>
        </div>
      </div>
    );
  }

  const getPerformanceColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (score) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 75) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isArabic
                  ? "لوحة التحكم الإدارية الشاملة"
                  : "Comprehensive Admin Dashboard"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isArabic
                  ? "إدارة شاملة للأداء والعمليات والموارد البشرية"
                  : "Complete performance, operations, and workforce management"}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  {isRealTime
                    ? isArabic
                      ? "مباشر"
                      : "Real-time"
                    : isArabic
                    ? "ثابت"
                    : "Static"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {isArabic ? "آخر تحديث:" : "Last updated:"}{" "}
                  {new Date().toLocaleTimeString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {employees.length} {isArabic ? "موظف" : "employees"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">
                  {isArabic ? "الفترة الزمنية:" : "Time Range:"}
                </label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="daily">{isArabic ? "يومي" : "Daily"}</option>
                  <option value="weekly">
                    {isArabic ? "أسبوعي" : "Weekly"}
                  </option>
                  <option value="monthly">
                    {isArabic ? "شهري" : "Monthly"}
                  </option>
                  <option value="quarterly">
                    {isArabic ? "ربع سنوي" : "Quarterly"}
                  </option>
                  <option value="yearly">{isArabic ? "سنوي" : "Yearly"}</option>
                </select>
              </div>
              <button
                onClick={() => setIsRealTime(!isRealTime)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isRealTime
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <Zap className="w-4 h-4" />
                {isRealTime
                  ? isArabic
                    ? "مباشر"
                    : "Live"
                  : isArabic
                  ? "ثابت"
                  : "Static"}
              </button>
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
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(companyMetrics.revenue.current)}
                </div>
                <div className="text-sm text-green-700">
                  {isArabic ? "إجمالي الإيرادات" : "Total Revenue"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">
                +{companyMetrics.revenue.growthRate}%
              </span>
              <span className="text-green-700">
                {isArabic ? "نمو" : "growth"}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {projects.filter((p) => p.status === "active").length}
                </div>
                <div className="text-sm text-blue-700">
                  {isArabic ? "المشاريع النشطة" : "Active Projects"}
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-600">
              {projects.length} {isArabic ? "إجمالي" : "total projects"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">
                  {employeePerformanceData.reduce(
                    (sum, emp) => sum + emp.performanceScore,
                    0
                  ) / employeePerformanceData.length || 0}
                  %
                </div>
                <div className="text-sm text-purple-700">
                  {isArabic ? "متوسط الأداء" : "Avg Performance"}
                </div>
              </div>
            </div>
            <div className="text-xs text-purple-600">
              {isArabic ? "عبر جميع الموظفين" : "Across all employees"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-900">
                  {Math.round(
                    projects.reduce((sum, p) => sum + p.progress, 0) /
                      projects.length || 0
                  )}
                  %
                </div>
                <div className="text-sm text-yellow-700">
                  {isArabic ? "إنجاز المشاريع" : "Project Completion"}
                </div>
              </div>
            </div>
            <div className="text-xs text-yellow-600">
              {isArabic ? "متوسط التقدم" : "Average progress"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-900">
                  {Math.round(
                    employeePerformanceData.reduce(
                      (sum, emp) => sum + emp.attendanceRate,
                      0
                    ) / employeePerformanceData.length || 0
                  )}
                  %
                </div>
                <div className="text-sm text-red-700">
                  {isArabic ? "معدل الحضور" : "Attendance Rate"}
                </div>
              </div>
            </div>
            <div className="text-xs text-red-600">
              {isArabic ? "متوسط الشركة" : "Company average"}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "overview"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  {isArabic ? "النظرة العامة" : "Executive Overview"}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("employees")}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "employees"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {isArabic ? "أداء الموظفين" : "Employee Performance"}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("operations")}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "operations"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {isArabic ? "التحليلات التشغيلية" : "Operational Analytics"}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("hr")}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "hr"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {isArabic ? "لوحة الموارد البشرية" : "HR Dashboard"}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("financial")}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "financial"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {isArabic ? "الرؤى المالية" : "Financial Insights"}
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Company Performance Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                      {isArabic ? "الأداء المالي" : "Financial Performance"}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">
                          {isArabic ? "هامش الربح الإجمالي:" : "Gross Margin:"}
                        </span>
                        <span className="font-bold text-green-900">
                          {formatPercentage(
                            companyMetrics.profitability.grossMargin
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">
                          {isArabic ? "هامش الربح الصافي:" : "Net Margin:"}
                        </span>
                        <span className="font-bold text-green-900">
                          {formatPercentage(
                            companyMetrics.profitability.netMargin
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">
                          {isArabic
                            ? "الإيرادات لكل موظف:"
                            : "Revenue per Employee:"}
                        </span>
                        <span className="font-bold text-green-900">
                          {formatCurrency(
                            companyMetrics.productivity.revenuePerEmployee
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      {isArabic
                        ? "مؤشرات الإنتاجية"
                        : "Productivity Indicators"}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">
                          {isArabic ? "استغلال الساعات:" : "Hours Utilization:"}
                        </span>
                        <span className="font-bold text-blue-900">
                          {formatPercentage(
                            companyMetrics.productivity.hoursUtilization
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">
                          {isArabic ? "مؤشر الكفاءة:" : "Efficiency Index:"}
                        </span>
                        <span className="font-bold text-blue-900">
                          {companyMetrics.productivity.efficiencyIndex.toFixed(
                            1
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">
                          {isArabic ? "مقارنة بالمعيار:" : "vs Benchmark:"}
                        </span>
                        <span className="font-bold text-blue-900">
                          +{companyMetrics.productivity.benchmarkComparison}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">
                      {isArabic ? "تحليلات الأقسام" : "Department Analytics"}
                    </h3>
                    <div className="space-y-2">
                      {departmentAnalytics.slice(0, 3).map((dept) => (
                        <div
                          key={dept.id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-purple-700 text-sm">
                            {isArabic ? dept.nameAr : dept.name}:
                          </span>
                          <span
                            className={`text-sm font-medium ${getPerformanceColor(
                              dept.avgPerformance
                            )}`}
                          >
                            {dept.avgPerformance.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Department Performance Grid */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isArabic
                      ? "أداء الأقسام التفصيلي"
                      : "Detailed Department Performance"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departmentAnalytics.map((dept) => (
                      <div
                        key={dept.id}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">
                            {isArabic ? dept.nameAr : dept.name}
                          </h4>
                          <span className="text-2xl font-bold text-blue-600">
                            {dept.employeeCount}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {isArabic ? "الأداء:" : "Performance:"}
                            </span>
                            <span
                              className={`font-medium ${getPerformanceColor(
                                dept.avgPerformance
                              )}`}
                            >
                              {dept.avgPerformance.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {isArabic ? "الإنتاجية:" : "Productivity:"}
                            </span>
                            <span className="font-medium">
                              {dept.productivity.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {isArabic ? "الاستغلال:" : "Utilization:"}
                            </span>
                            <span className="font-medium">
                              {dept.utilization.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {isArabic ? "الميزانية:" : "Budget:"}
                            </span>
                            <span className="font-medium text-green-600">
                              {dept.budgetUtilization.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "employees" && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={
                        isArabic
                          ? "البحث في الموظفين..."
                          : "Search employees..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                    />
                  </div>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">
                      {isArabic ? "جميع الأقسام" : "All Departments"}
                    </option>
                    {departmentAnalytics.map((dept) => (
                      <option key={dept.id} value={dept.name.toLowerCase()}>
                        {isArabic ? dept.nameAr : dept.name}
                      </option>
                    ))}
                  </select>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {isArabic ? "إضافة موظف" : "Add Employee"}
                  </button>
                </div>

                {/* Employee Performance Matrix */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "الموظف" : "Employee"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "القسم" : "Department"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "نقاط الأداء" : "Performance"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "إنجاز المهام" : "Task Completion"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "تقييم الجودة" : "Quality Rating"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "الحضور" : "Attendance"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "الإجراءات" : "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredEmployees.slice(0, 20).map((employee) => (
                          <tr key={employee.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                                  {employee.name
                                    .split(" ")
                                    .map((n) => n.charAt(0))
                                    .join("")}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {isArabic ? employee.nameAr : employee.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {employee.position}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {employee.department}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                      width: `${employee.performanceScore}%`,
                                    }}
                                  ></div>
                                </div>
                                <span
                                  className={`text-sm font-medium ${getPerformanceColor(
                                    employee.performanceScore
                                  )}`}
                                >
                                  {employee.performanceScore.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPerformanceBadge(
                                  employee.taskCompletionRate
                                )}`}
                              >
                                {employee.taskCompletionRate.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Award className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium">
                                  {employee.qualityRating.toFixed(1)}/100
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`text-sm font-medium ${getPerformanceColor(
                                  employee.attendanceRate
                                )}`}
                              >
                                {employee.attendanceRate.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-800 p-1 rounded">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-purple-600 hover:text-purple-800 p-1 rounded">
                                  <Target className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "operations" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    {isArabic ? "التحليلات التشغيلية" : "Operational Analytics"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {projects.length}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "إجمالي المشاريع" : "Total Projects"}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(
                            projects.reduce((sum, p) => sum + p.progress, 0) /
                              projects.length || 0
                          )}
                          %
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "متوسط التقدم" : "Average Progress"}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {companyMetrics.productivity.efficiencyIndex.toFixed(
                            1
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "مؤشر الكفاءة" : "Efficiency Index"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض التحليلات التشغيلية التفصيلية هنا..."
                    : "Detailed operational analytics will be displayed here..."}
                </div>
              </div>
            )}

            {activeTab === "hr" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {isArabic ? "معدل الحضور" : "Attendance Rate"}
                    </h4>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(
                        employeePerformanceData.reduce(
                          (sum, emp) => sum + emp.attendanceRate,
                          0
                        ) / employeePerformanceData.length || 0
                      )}
                      %
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {isArabic ? "معدل الدوران" : "Turnover Rate"}
                    </h4>
                    <div className="text-2xl font-bold text-blue-600">8.5%</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      {isArabic ? "رضا الموظفين" : "Employee Satisfaction"}
                    </h4>
                    <div className="text-2xl font-bold text-purple-600">
                      4.2/5.0
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      {isArabic ? "التدريب المكتمل" : "Training Completed"}
                    </h4>
                    <div className="text-2xl font-bold text-yellow-600">
                      87%
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض تحليلات الموارد البشرية التفصيلية هنا..."
                    : "Detailed HR analytics will be displayed here..."}
                </div>
              </div>
            )}

            {activeTab === "financial" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-4">
                      {isArabic ? "الربحية" : "Profitability"}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-700">
                          {isArabic ? "إجمالي:" : "Gross:"}
                        </span>
                        <span className="font-bold">
                          {formatPercentage(
                            companyMetrics.profitability.grossMargin
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">
                          {isArabic ? "صافي:" : "Net:"}
                        </span>
                        <span className="font-bold">
                          {formatPercentage(
                            companyMetrics.profitability.netMargin
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">
                          {isArabic ? "تشغيلي:" : "Operating:"}
                        </span>
                        <span className="font-bold">
                          {formatPercentage(
                            companyMetrics.profitability.operatingMargin
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-4">
                      {isArabic ? "الإيرادات" : "Revenue"}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-700">
                          {isArabic ? "الحالي:" : "Current:"}
                        </span>
                        <span className="font-bold">
                          {formatCurrency(companyMetrics.revenue.current)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">
                          {isArabic ? "الهدف:" : "Target:"}
                        </span>
                        <span className="font-bold">
                          {formatCurrency(companyMetrics.revenue.target)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">
                          {isArabic ? "النمو:" : "Growth:"}
                        </span>
                        <span className="font-bold text-green-600">
                          +{companyMetrics.revenue.growthRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-800 mb-4">
                      {isArabic ? "العائد على الاستثمار" : "ROI Metrics"}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-purple-700">
                          {isArabic ? "إجمالي العائد:" : "Overall ROI:"}
                        </span>
                        <span className="font-bold">24.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">
                          {isArabic ? "عائد التدريب:" : "Training ROI:"}
                        </span>
                        <span className="font-bold">18.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">
                          {isArabic ? "عائد التكنولوجيا:" : "Technology ROI:"}
                        </span>
                        <span className="font-bold">31.7%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض التحليلات المالية التفصيلية هنا..."
                    : "Detailed financial analytics will be displayed here..."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
