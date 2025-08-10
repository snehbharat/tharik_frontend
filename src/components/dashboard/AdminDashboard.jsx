import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Award,
  BarChart3,
  PieChart,
  Settings,
  Bell,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2,
  Briefcase,
  Star,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWorkforceData } from "../../hooks/useWorkforceData";
import {
  formatCurrency,
  formatPercentage,
} from "../../utils/financialCalculations";

export const AdminDashboard = ({ isArabic = false }) => {
  const { user, hasPermission } = useAuth();
  const { employees, projects, getDashboardMetrics } = useWorkforceData();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Check admin permissions
  const isAdmin = hasPermission("dashboard:view_all") || user?.role.level >= 8;

  // Calculate system metrics
  const systemMetrics = useMemo(() => {
    const metrics = getDashboardMetrics();

    return {
      totalEmployees: employees.length,
      activeUsers: employees.filter((emp) => emp.status === "active").length,
      activeTasks: Math.floor(employees.length * 2.5), // Estimated active tasks
      systemHealth:
        metrics.utilizationRate > 90
          ? "healthy"
          : metrics.utilizationRate > 70
          ? "warning"
          : "critical",
      alertCount: employees.filter((emp) =>
        emp.documents.some(
          (doc) => doc.daysUntilExpiry && doc.daysUntilExpiry <= 30
        )
      ).length,
      avgPerformance:
        employees.reduce((sum, emp) => sum + (emp.performanceRating || 85), 0) /
        employees.length,
      resourceUtilization: metrics.utilizationRate,
      dailyActiveUsers: Math.floor(employees.length * 0.85), // Estimated daily active users
    };
  }, [employees, getDashboardMetrics]);

  // Calculate employee rankings
  const employeeRankings = useMemo(() => {
    return employees
      .map((emp, index) => ({
        id: emp.id,
        name: emp.name,
        nameAr: emp.name, // Would be from Arabic name field
        department:
          projects.find((p) => p.id === emp.projectId)?.name || "Unassigned",
        performanceScore: emp.performanceRating || 85,
        tasksCompleted: Math.floor(Math.random() * 50) + 20, // Mock data
        hoursWorked: Math.floor(Math.random() * 200) + 150, // Mock data
        efficiency: Math.floor(Math.random() * 30) + 70, // Mock data
        rank: index + 1,
      }))
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .map((emp, index) => ({ ...emp, rank: index + 1 }));
  }, [employees, projects]);

  // Calculate department metrics
  const departmentMetrics = useMemo(() => {
    const departments = [
      { id: "operations", name: "Operations", nameAr: "العمليات" },
      { id: "hr", name: "Human Resources", nameAr: "الموارد البشرية" },
      { id: "finance", name: "Finance", nameAr: "المالية" },
      { id: "safety", name: "Safety", nameAr: "السلامة" },
    ];

    return departments.map((dept) => {
      const deptEmployees = employees.filter(
        (emp) =>
          emp.trade.toLowerCase().includes(dept.name.toLowerCase()) ||
          (dept.id === "operations" &&
            ["supervisor", "operator", "mechanic", "welder"].some((role) =>
              emp.trade.toLowerCase().includes(role)
            ))
      );

      const avgPerformance =
        deptEmployees.length > 0
          ? deptEmployees.reduce(
              (sum, emp) => sum + (emp.performanceRating || 85),
              0
            ) / deptEmployees.length
          : 0;

      return {
        id: dept.id,
        name: dept.name,
        nameAr: dept.nameAr,
        employeeCount: deptEmployees.length,
        avgPerformance,
        tasksCompleted: deptEmployees.length * 15, // Estimated
        utilization: Math.min(100, avgPerformance + Math.random() * 10),
        budget: deptEmployees.length * 50000, // Estimated budget
        budgetUtilization: Math.floor(Math.random() * 30) + 70,
      };
    });
  }, [employees]);

  // Filter employees based on search and department
  const filteredEmployees = useMemo(() => {
    return employeeRankings.filter((emp) => {
      const matchesSearch =
        !searchTerm ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" ||
        emp.department.toLowerCase().includes(selectedDepartment.toLowerCase());

      return matchesSearch && matchesDepartment;
    });
  }, [employeeRankings, searchTerm, selectedDepartment]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [timeFilter]);

  // Redirect if not admin
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isArabic
              ? "جاري تحميل لوحة التحكم الإدارية..."
              : "Loading admin dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  const getHealthStatusColor = (health) => {
    switch (health) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isArabic ? "لوحة التحكم الإدارية" : "Admin Dashboard"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isArabic
                  ? "إدارة شاملة للنظام والموظفين"
                  : "Comprehensive system and workforce management"}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {isArabic ? "النظام:" : "System:"}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(
                      systemMetrics.systemHealth
                    )}`}
                  >
                    {systemMetrics.systemHealth}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {isArabic ? "آخر تحديث:" : "Last updated:"}{" "}
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="daily">{isArabic ? "يومي" : "Daily"}</option>
                <option value="weekly">{isArabic ? "أسبوعي" : "Weekly"}</option>
                <option value="monthly">{isArabic ? "شهري" : "Monthly"}</option>
                <option value="yearly">{isArabic ? "سنوي" : "Yearly"}</option>
              </select>
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

        {/* System-wide KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {systemMetrics.totalEmployees}
                </div>
                <div className="text-sm text-blue-700">
                  {isArabic ? "إجمالي الموظفين" : "Total Employees"}
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-600">
              {systemMetrics.activeUsers} {isArabic ? "نشط" : "active"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {systemMetrics.activeTasks}
                </div>
                <div className="text-sm text-green-700">
                  {isArabic ? "المهام النشطة" : "Active Tasks"}
                </div>
              </div>
            </div>
            <div className="text-xs text-green-600">
              {isArabic ? "قيد التنفيذ" : "In progress"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">
                  {systemMetrics.avgPerformance.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-700">
                  {isArabic ? "متوسط الأداء" : "Avg Performance"}
                </div>
              </div>
            </div>
            <div className="text-xs text-purple-600">
              {isArabic ? "عبر النظام" : "System-wide"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-900">
                  {systemMetrics.resourceUtilization.toFixed(1)}%
                </div>
                <div className="text-sm text-yellow-700">
                  {isArabic ? "استغلال الموارد" : "Resource Utilization"}
                </div>
              </div>
            </div>
            <div className="text-xs text-yellow-600">
              {isArabic ? "كفاءة عالية" : "High efficiency"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-900">
                  {systemMetrics.alertCount}
                </div>
                <div className="text-sm text-red-700">
                  {isArabic ? "التنبيهات" : "System Alerts"}
                </div>
              </div>
            </div>
            <div className="text-xs text-red-600">
              {isArabic ? "تتطلب انتباه" : "Require attention"}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "overview"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  {isArabic ? "نظرة عامة" : "Overview"}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("employees")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "employees"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {isArabic ? "إدارة الموظفين" : "Employee Management"}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "tasks"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {isArabic ? "إدارة المهام" : "Task Management"}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "analytics"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  {isArabic ? "التحليلات المتقدمة" : "Advanced Analytics"}
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Department Performance */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    {isArabic ? "أداء الأقسام" : "Department Performance"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {departmentMetrics.map((dept) => (
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
                            <span className="font-medium">
                              {dept.avgPerformance.toFixed(1)}%
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
                              {isArabic ? "المهام:" : "Tasks:"}
                            </span>
                            <span className="font-medium">
                              {dept.tasksCompleted}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {isArabic ? "الميزانية:" : "Budget:"}
                            </span>
                            <span className="font-medium text-green-600">
                              {dept.budgetUtilization}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Activity Monitor */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    {isArabic
                      ? "مراقب النشاط المباشر"
                      : "Real-time Activity Monitor"}
                  </h3>
                  <div className="bg-black rounded-lg p-4 h-32 overflow-y-auto font-mono text-sm">
                    <div className="space-y-1">
                      <div className="text-green-400">
                        <span className="text-gray-500">
                          [{new Date().toLocaleTimeString()}]
                        </span>
                        <span className="text-yellow-400 ml-2">
                          TASK_COMPLETED
                        </span>
                        <span className="text-green-400 ml-2">
                          Employee Ahmed Al-Rashid completed maintenance task
                        </span>
                      </div>
                      <div className="text-green-400">
                        <span className="text-gray-500">
                          [{new Date(Date.now() - 60000).toLocaleTimeString()}]
                        </span>
                        <span className="text-blue-400 ml-2">USER_LOGIN</span>
                        <span className="text-green-400 ml-2">
                          Mohammad Hassan logged in from mobile app
                        </span>
                      </div>
                      <div className="text-green-400">
                        <span className="text-gray-500">
                          [{new Date(Date.now() - 120000).toLocaleTimeString()}]
                        </span>
                        <span className="text-purple-400 ml-2">
                          PERFORMANCE_UPDATE
                        </span>
                        <span className="text-green-400 ml-2">
                          Performance metrics updated for Operations team
                        </span>
                      </div>
                    </div>
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
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">
                      {isArabic ? "جميع الأقسام" : "All Departments"}
                    </option>
                    <option value="operations">
                      {isArabic ? "العمليات" : "Operations"}
                    </option>
                    <option value="hr">
                      {isArabic ? "الموارد البشرية" : "HR"}
                    </option>
                    <option value="finance">
                      {isArabic ? "المالية" : "Finance"}
                    </option>
                    <option value="safety">
                      {isArabic ? "السلامة" : "Safety"}
                    </option>
                  </select>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {isArabic ? "إضافة موظف" : "Add Employee"}
                  </button>
                </div>

                {/* Employee Rankings Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "الترتيب" : "Rank"}
                          </th>
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
                            {isArabic ? "المهام المكتملة" : "Tasks Completed"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "ساعات العمل" : "Hours Worked"}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "الإجراءات" : "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredEmployees.slice(0, 10).map((employee) => (
                          <tr key={employee.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {employee.rank <= 3 && (
                                  <Star
                                    className={`w-4 h-4 mr-2 ${
                                      employee.rank === 1
                                        ? "text-yellow-500"
                                        : employee.rank === 2
                                        ? "text-gray-400"
                                        : "text-orange-400"
                                    }`}
                                  />
                                )}
                                <span className="font-medium text-gray-900">
                                  #{employee.rank}
                                </span>
                              </div>
                            </td>
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
                                    {employee.id}
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
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{
                                      width: `${employee.performanceScore}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {employee.performanceScore}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {employee.tasksCompleted}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {employee.hoursWorked}h
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

            {activeTab === "tasks" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {isArabic
                      ? "إدارة المهام المتقدمة"
                      : "Advanced Task Management"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {systemMetrics.activeTasks}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "المهام النشطة" : "Active Tasks"}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.floor(systemMetrics.activeTasks * 0.75)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "المهام المكتملة" : "Completed Tasks"}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {Math.floor(systemMetrics.activeTasks * 0.15)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "المهام المتأخرة" : "Overdue Tasks"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض واجهة إدارة المهام المتقدمة هنا..."
                    : "Advanced task management interface will be displayed here..."}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-4">
                      {isArabic ? "كفاءة النظام" : "System Efficiency"}
                    </h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {systemMetrics.resourceUtilization.toFixed(1)}%
                      </div>
                      <div className="text-sm text-green-700">
                        {isArabic ? "استغلال الموارد" : "Resource utilization"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-4">
                      {isArabic ? "الإنتاجية" : "Productivity"}
                    </h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {systemMetrics.avgPerformance.toFixed(1)}%
                      </div>
                      <div className="text-sm text-blue-700">
                        {isArabic ? "متوسط الأداء" : "Average performance"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-800 mb-4">
                      {isArabic ? "المشاركة" : "Engagement"}
                    </h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {(
                          (systemMetrics.dailyActiveUsers /
                            systemMetrics.totalEmployees) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="text-sm text-purple-700">
                        {isArabic ? "المستخدمون النشطون" : "Daily active users"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isArabic ? "التحليلات التفاعلية" : "Interactive Analytics"}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {isArabic
                      ? "سيتم عرض الرسوم البيانية التفاعلية والتحليلات المتقدمة هنا..."
                      : "Interactive charts and advanced analytics will be displayed here..."}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            {isArabic ? "الإجراءات السريعة" : "Quick Actions"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Plus className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-800">
                  {isArabic ? "إضافة موظف جديد" : "Add New Employee"}
                </div>
                <div className="text-sm text-blue-600">
                  {isArabic ? "تسجيل موظف في النظام" : "Register new employee"}
                </div>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <Target className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-green-800">
                  {isArabic ? "تعيين مهمة" : "Assign Task"}
                </div>
                <div className="text-sm text-green-600">
                  {isArabic ? "إنشاء مهمة جديدة" : "Create new task"}
                </div>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-purple-800">
                  {isArabic ? "إنشاء تقرير" : "Generate Report"}
                </div>
                <div className="text-sm text-purple-600">
                  {isArabic ? "تقارير مخصصة" : "Custom analytics"}
                </div>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <Settings className="w-6 h-6 text-yellow-600" />
              <div className="text-left">
                <div className="font-medium text-yellow-800">
                  {isArabic ? "إعدادات النظام" : "System Settings"}
                </div>
                <div className="text-sm text-yellow-600">
                  {isArabic ? "تكوين النظام" : "Configure system"}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
