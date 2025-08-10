import React, { useState, useMemo } from "react";
import {
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Eye,
  Edit,
  FileText,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Award,
  Clock,
  Save,
  X,
  Calculator,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Building2,
} from "lucide-react";
// import { calculateFinancials } from "../utils/financialCalculations";

import { useWorkforceData } from "../hooks/useWorkforceData";
import { useNotificationSender } from "../hooks/useNotifications";
// import { NotificationHelpers } from "../utils/notificationHelpers";
// import { Employee, ManpowerProject, AttendanceRecord } from "../types/manpower";
import {
  filterEmployees,
  validateEmployee,
  validateProject,
  formatCurrency,
  formatPercentage,
  getDaysUntilExpiry,
} from "../utils/financialCalculations";
import { MetricCard } from "./MetricCard";
import { AttendanceReports } from "./attendance/AttendanceReports";
import { AttendanceTracking } from "./attendance/AttendanceTracking";
import { ProjectInfo } from "./ProjectInfo";
import { ActionableInsights } from "./ActionableInsights";
import { ProfitTrendChart } from "./charts/ProfitTrendChart";
import { AttendanceChart } from "./charts/AttendanceChart";
import { NationalityChart } from "./charts/NationalityChart";
import { EnhancedAttendanceTracker } from "./attendance/EnhancedAttendanceTracker";

export const ManpowerManagement = ({ isArabic }) => {
  const {
    employees,
    projects,
    attendance,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addProject,
    updateProject,
    addAttendanceRecord,
    addBulkAttendance,
    getDashboardMetrics,
    getProjectMetrics,
    getPayrollSummary,
    getWorkforceAnalytics,
    generateInsights,
    exportData,
  } = useWorkforceData();

  const { sendDocumentExpiryAlert, sendProjectStatusChange } =
    useNotificationSender();

  const [activeView, setActiveView] =
    (useState < "dashboard") |
    "employees" |
    "projects" |
    "attendance" |
    "analytics" |
    ("reports" > "dashboard");
  const [selectedProject, setSelectedProject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    nationality: "",
    trade: "",
    project: "",
    status: "",
  });
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    employeeId: "",
    trade: "",
    nationality: "",
    phoneNumber: "",
    hourlyRate: 25.0,
    actualRate: 40.0,
    status: "active",
    skills: [],
    certifications: [],
    performanceRating: 85,
    documents: [],
  });

  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    contractor: "AMOAGC Al-Majmaah",
    location: "",
    startDate: "",
    endDate: "",
    budget: 0,
    status: "active",
    progress: 0,
    description: "",
    requirements: [],
    deliverables: [],
    riskLevel: "medium",
    profitMargin: 20,
  });

  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: "",
    projectId: "",
    date: new Date().toISOString().split("T")[0],
    hoursWorked: 8,
    overtime: 0,
    location: "",
    notes: "",
  });

  // Calculate metrics
  const dashboardMetrics = getDashboardMetrics();

  // Get current month payroll summary
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthStart = `${currentMonth}-01`;
  const monthEnd = `${currentMonth}-31`;
  const payrollSummary = getPayrollSummary(monthStart, monthEnd);
  const workforceAnalytics = getWorkforceAnalytics();
  const actionableInsights = generateInsights();

  // Filter employees and attendance based on selected project
  const projectEmployees = useMemo(() => {
    if (selectedProject === "all") {
      return employees;
    }
    return employees.filter((emp) => emp.projectId === selectedProject);
  }, [employees, selectedProject]);

  const projectAttendance = useMemo(() => {
    if (selectedProject === "all") {
      return attendance;
    }
    return attendance.filter((record) => {
      const employee = employees.find((emp) => emp.id === record.employeeId);
      return employee?.projectId === selectedProject;
    });
  }, [attendance, employees, selectedProject]);

  const selectedProjectData = useMemo(() => {
    if (selectedProject === "all") {
      return null;
    }
    return projects.find((p) => p.id === selectedProject) || null;
  }, [projects, selectedProject]);

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    let baseEmployees = employees;

    if (selectedProject !== "all") {
      baseEmployees = employees.filter(
        (emp) => emp.projectId === selectedProject
      );
    }

    return filterEmployees(baseEmployees, searchTerm, filters);
  }, [employees, selectedProject, searchTerm, filters]);

  // Get unique values for filter dropdowns
  const uniqueNationalities = useMemo(
    () => [...new Set(employees.map((emp) => emp.nationality))].sort(),
    [employees]
  );
  const uniqueTrades = useMemo(
    () => [...new Set(employees.map((emp) => emp.trade))].sort(),
    [employees]
  );

  const handleAddEmployee = () => {
    const validation = validateEmployee(newEmployee);
    if (!validation.valid) {
      alert(validation.errors.join("\n"));
      return;
    }

    const employee = addEmployee(newEmployee);

    // Check for document expiry alerts
    if (employee.documents && employee.documents.length > 0) {
      employee.documents.forEach((doc) => {
        if (
          doc.expiryDate &&
          doc.daysUntilExpiry !== undefined &&
          doc.daysUntilExpiry <= 90
        ) {
          sendDocumentExpiryAlert({
            employeeId: employee.id,
            employeeName: employee.name,
            documentType: doc.type,
            expiryDate: doc.expiryDate,
            daysRemaining: doc.daysUntilExpiry,
          }).catch(console.error);
        }
      });
    }

    setNewEmployee({
      name: "",
      employeeId: "",
      trade: "",
      nationality: "",
      phoneNumber: "",
      hourlyRate: 25.0,
      actualRate: 40.0,
      status: "active",
      skills: [],
      certifications: [],
      performanceRating: 85,
      documents: [],
    });
    setShowAddEmployee(false);
    alert(isArabic ? "تم إضافة الموظف بنجاح!" : "Employee added successfully!");
  };

  const handleAddProject = () => {
    const validation = validateProject(newProject);
    if (!validation.valid) {
      alert(validation.errors.join("\n"));
      return;
    }

    addProject(newProject);
    setNewProject({
      name: "",
      client: "",
      contractor: "AMOAGC Al-Majmaah",
      location: "",
      startDate: "",
      endDate: "",
      budget: 0,
      status: "active",
      progress: 0,
      description: "",
      requirements: [],
      deliverables: [],
      riskLevel: "medium",
      profitMargin: 20,
    });
    setShowAddProject(false);
    alert(isArabic ? "تم إضافة المشروع بنجاح!" : "Project added successfully!");
  };

  const handleAddAttendance = () => {
    if (!attendanceForm.employeeId || !attendanceForm.projectId) {
      alert(
        isArabic
          ? "يرجى اختيار الموظف والمشروع"
          : "Please select employee and project"
      );
      return;
    }

    addAttendanceRecord({
      employeeId: attendanceForm.employeeId,
      projectId: attendanceForm.projectId,
      date: attendanceForm.date,
      hoursWorked: attendanceForm.hoursWorked,
      overtime: attendanceForm.overtime,
      breakTime: 1,
      lateArrival: 0,
      earlyDeparture: 0,
      location: attendanceForm.location,
      notes: attendanceForm.notes,
    });

    setAttendanceForm({
      employeeId: "",
      projectId: "",
      date: new Date().toISOString().split("T")[0],
      hoursWorked: 8,
      overtime: 0,
      location: "",
      notes: "",
    });
    setShowAttendanceForm(false);
    alert(
      isArabic ? "تم تسجيل الحضور بنجاح!" : "Attendance recorded successfully!"
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic
              ? "منصة ذكاء القوى العاملة"
              : "Workforce Intelligence Platform"}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportData("financial")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              {isArabic ? "تصدير التقارير" : "Export Reports"}
            </button>
            <button
              onClick={() => setShowAddEmployee(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {isArabic ? "إضافة موظف" : "Add Employee"}
            </button>
            <button
              onClick={() => setShowAddProject(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {isArabic ? "مشروع جديد" : "New Project"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveView("dashboard")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeView === "dashboard"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  {isArabic ? "مركز القيادة" : "Command Center"}
                </div>
              </button>
              <button
                onClick={() => setActiveView("employees")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeView === "employees"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {isArabic ? "إدارة الموظفين" : "Employee Management"}
                </div>
              </button>
              <button
                onClick={() => setActiveView("projects")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeView === "projects"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {isArabic ? "إدارة المشاريع" : "Project Management"}
                </div>
              </button>
              <button
                onClick={() => setActiveView("attendance")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeView === "attendance"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {isArabic ? "تتبع الحضور" : "Attendance Tracking"}
                </div>
              </button>
              <button
                onClick={() => setActiveView("analytics")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeView === "analytics"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  {isArabic ? "التحليلات المتقدمة" : "Advanced Analytics"}
                </div>
              </button>
              <button
                onClick={() => setActiveView("reports")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeView === "reports"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {isArabic ? "مركز ذكاء الأرباح" : "Profit Intelligence"}
                </div>
              </button>
            </nav>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-900">
                    {formatCurrency(payrollSummary.totalNetPay)
                      .replace("SAR", "")
                      .trim()}
                    K
                  </div>
                  <div className="text-sm text-yellow-700">
                    {isArabic ? "رواتب هذا الشهر" : "Monthly Payroll"}
                  </div>
                </div>
              </div>
              <div className="text-xs text-yellow-600">
                {payrollSummary.employeeCount} {isArabic ? "موظف" : "employees"}{" "}
                •{" "}
                {formatCurrency(payrollSummary.totalGosiContributions)
                  .replace("SAR", "")
                  .trim()}
                K GOSI
              </div>
            </div>
          </div>

          <div className="p-6">
            {activeView === "dashboard" && (
              <div className="space-y-6">
                {/* Attendance Reports Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="border-b border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {isArabic ? "تقارير الحضور" : "Attendance Reports"}
                      </h3>
                      <p className="text-gray-600">
                        {isArabic
                          ? "إنشاء تقارير شاملة للحضور والأداء المالي"
                          : "Generate comprehensive attendance and financial performance reports"}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <AttendanceReports
                      employees={projectEmployees}
                      attendance={projectAttendance}
                      projects={
                        selectedProjectData ? [selectedProjectData] : projects
                      }
                      isArabic={isArabic}
                    />
                  </div>
                </div>

                {/* Global Command Center */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    {isArabic
                      ? "مركز القيادة العالمي"
                      : "Global Command Center"}
                  </h2>
                </div>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <MetricCard
                      title={
                        isArabic ? "إجمالي القوى العاملة" : "Total Workforce"
                      }
                      value={dashboardMetrics.totalWorkforce}
                      subtitle={isArabic ? "موظف نشط" : "active employees"}
                      icon={Users}
                      gradient="from-blue-50 to-blue-100"
                      borderColor="border-blue-200"
                      trend={{
                        value: "+12%",
                        isPositive: true,
                      }}
                    />
                    <MetricCard
                      title={isArabic ? "المشاريع النشطة" : "Active Projects"}
                      value={dashboardMetrics.activeProjects}
                      subtitle={
                        isArabic ? "مشروع قيد التنفيذ" : "projects in progress"
                      }
                      icon={Briefcase}
                      gradient="from-green-50 to-green-100"
                      borderColor="border-green-200"
                    />
                    <MetricCard
                      title={
                        isArabic
                          ? "الإيرادات المتقاطعة"
                          : "Cross-Project Revenue"
                      }
                      value={formatCurrency(
                        dashboardMetrics.crossProjectRevenue
                      )}
                      subtitle={
                        isArabic
                          ? "إجمالي فوترة العملاء"
                          : "total client billing"
                      }
                      icon={DollarSign}
                      gradient="from-purple-50 to-purple-100"
                      borderColor="border-purple-200"
                      trend={{
                        value: "+18%",
                        isPositive: true,
                      }}
                    />
                    <MetricCard
                      title={isArabic ? "الأرباح الفورية" : "Real-Time Profits"}
                      value={formatCurrency(dashboardMetrics.realTimeProfits)}
                      subtitle={`${formatPercentage(
                        dashboardMetrics.averageProfitMargin
                      )} ${isArabic ? "هامش" : "margin"}`}
                      icon={TrendingUp}
                      gradient="from-yellow-50 to-yellow-100"
                      borderColor="border-yellow-200"
                      trend={{
                        value: "+25%",
                        isPositive: true,
                      }}
                    />
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {isArabic
                        ? "مؤشرات الأداء الرئيسية"
                        : "Key Performance Indicators"}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {isArabic ? "مؤشر الإنتاجية:" : "Productivity Index:"}
                        </span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(dashboardMetrics.productivityIndex)}
                          /hr
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {isArabic ? "معدل الاستغلال:" : "Utilization Rate:"}
                        </span>
                        <span className="font-bold text-green-600">
                          {formatPercentage(dashboardMetrics.utilizationRate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {isArabic ? "إجمالي الساعات:" : "Aggregate Hours:"}
                        </span>
                        <span className="font-bold text-purple-600">
                          {dashboardMetrics.aggregateHours.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {isArabic
                            ? "متوسط هامش الربح:"
                            : "Avg Profit Margin:"}
                        </span>
                        <span className="font-bold text-yellow-600">
                          {formatPercentage(
                            dashboardMetrics.averageProfitMargin
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {isArabic ? "اتجاه الأرباح" : "Profit Trends"}
                    </h3>
                    <ProfitTrendChart
                      data={workforceAnalytics.profitTrends}
                      isArabic={isArabic}
                    />
                  </div>
                </div>

                {/* Project Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isArabic ? "نظرة عامة على المشاريع" : "Project Overview"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects
                      .filter((p) => p.status === "active")
                      .map((project) => (
                        <ProjectInfo
                          key={project.id}
                          project={project}
                          metrics={getProjectMetrics(project.id)}
                          isArabic={isArabic}
                          onSelect={() => setSelectedProject(project.id)}
                        />
                      ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    {isArabic
                      ? "نظام الحضور اليدوي"
                      : "Manual Attendance System"}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {isArabic
                      ? "إدخال يدوي للحضور مع حسابات التكلفة والربحية الفورية"
                      : "Manual attendance entry with real-time cost and profitability calculations"}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    {isArabic
                      ? "تتبع الحضور المتقدم"
                      : "Advanced Attendance Tracking"}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {isArabic
                      ? "نظام شامل لتتبع الحضور مع التحليل المالي والتقارير التفصيلية"
                      : "Comprehensive attendance tracking with financial analysis and detailed reporting"}
                  </p>
                </div>

                {/* Actionable Insights */}
                <ActionableInsights
                  insights={actionableInsights}
                  isArabic={isArabic}
                  onInsightAction={(insightId, action) => {
                    console.log(`Insight ${insightId} action: ${action}`);
                  }}
                />
              </div>
            )}

            {activeView === "employees" && (
              <div className="space-y-6">
                {/* Employee Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <MetricCard
                    title={isArabic ? "إجمالي الموظفين" : "Total Employees"}
                    value={employees.length}
                    icon={Users}
                    gradient="from-blue-50 to-blue-100"
                    borderColor="border-blue-200"
                  />
                  <MetricCard
                    title={isArabic ? "موظفون مُعيَّنون" : "Assigned"}
                    value={employees.filter((emp) => emp.projectId).length}
                    icon={CheckCircle}
                    gradient="from-green-50 to-green-100"
                    borderColor="border-green-200"
                  />
                  <MetricCard
                    title={isArabic ? "غير مُعيَّنين" : "Unassigned"}
                    value={employees.filter((emp) => !emp.projectId).length}
                    icon={Clock}
                    gradient="from-yellow-50 to-yellow-100"
                    borderColor="border-yellow-200"
                  />
                  <MetricCard
                    title={
                      isArabic ? "وثائق تنتهي قريباً" : "Expiring Documents"
                    }
                    value={
                      employees.filter((emp) =>
                        emp.documents.some(
                          (doc) =>
                            getDaysUntilExpiry(doc.expiryDate || "") <= 30
                        )
                      ).length
                    }
                    icon={AlertTriangle}
                    gradient="from-red-50 to-red-100"
                    borderColor="border-red-200"
                  />
                </div>

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
                    value={filters.nationality}
                    onChange={(e) =>
                      setFilters({ ...filters, nationality: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "جميع الجنسيات" : "All Nationalities"}
                    </option>
                    {uniqueNationalities.map((nationality) => (
                      <option key={nationality} value={nationality}>
                        {nationality}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.trade}
                    onChange={(e) =>
                      setFilters({ ...filters, trade: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "جميع المهن" : "All Trades"}
                    </option>
                    {uniqueTrades.map((trade) => (
                      <option key={trade} value={trade}>
                        {trade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employee Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "الموظف" : "Employee"}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "المهنة" : "Trade"}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "المشروع" : "Project"}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "الأجور" : "Rates"}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "هامش الربح" : "Profit Margin"}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "الحالة" : "Status"}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {isArabic ? "الإجراءات" : "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredEmployees.map((employee) => {
                          const project = projects.find(
                            (p) => p.id === employee.projectId
                          );
                          const profitMargin =
                            employee.actualRate > 0
                              ? ((employee.actualRate - employee.hourlyRate) /
                                  employee.actualRate) *
                                100
                              : 0;
                          const expiringDocs = employee.documents.filter(
                            (doc) =>
                              getDaysUntilExpiry(doc.expiryDate || "") <= 30
                          );

                          return (
                            <tr key={employee.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                    {employee.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {employee.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {employee.employeeId}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {employee.nationality}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {employee.trade}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.skills.slice(0, 2).join(", ")}
                                  {employee.skills.length > 2 && "..."}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm text-gray-900">
                                  {project ? (
                                    project.name
                                  ) : (
                                    <span className="text-yellow-600">
                                      {isArabic ? "غير مُعيَّن" : "Unassigned"}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm">
                                  <div className="text-gray-600">
                                    {isArabic ? "التكلفة:" : "Cost:"}{" "}
                                    {formatCurrency(employee.hourlyRate)}/hr
                                  </div>
                                  <div className="text-green-600 font-medium">
                                    {isArabic ? "الفوترة:" : "Billing:"}{" "}
                                    {formatCurrency(employee.actualRate)}/hr
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`text-sm font-semibold ${
                                      profitMargin > 30
                                        ? "text-green-600"
                                        : profitMargin > 15
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {profitMargin.toFixed(1)}%
                                  </div>
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        profitMargin > 30
                                          ? "bg-green-500"
                                          : profitMargin > 15
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{
                                        width: `${Math.min(
                                          profitMargin,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-col gap-1">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                      employee.status
                                    )}`}
                                  >
                                    {employee.status}
                                  </span>
                                  {expiringDocs.length > 0 && (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                                      {expiringDocs.length}{" "}
                                      {isArabic ? "وثيقة تنتهي" : "expiring"}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      setSelectedEmployee(employee)
                                    }
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                    title={isArabic ? "عرض" : "View"}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingEmployee(employee)}
                                    className="text-green-600 hover:text-green-800 p-1 rounded"
                                    title={isArabic ? "تعديل" : "Edit"}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          isArabic
                                            ? "هل أنت متأكد من حذف هذا الموظف؟"
                                            : "Are you sure you want to delete this employee?"
                                        )
                                      ) {
                                        deleteEmployee(employee.id);
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-800 p-1 rounded"
                                    title={isArabic ? "حذف" : "Delete"}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeView === "projects" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <ProjectInfo
                      key={project.id}
                      project={project}
                      metrics={getProjectMetrics(project.id)}
                      isArabic={isArabic}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeView === "attendance" && (
              <EnhancedAttendanceTracker isArabic={isArabic} />
            )}

            {activeView === "analytics" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isArabic ? "التحليلات المتقدمة" : "Advanced Analytics"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <NationalityChart
                      data={workforceAnalytics.nationalityDistribution}
                      isArabic={isArabic}
                    />
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {isArabic ? "توزيع المهن" : "Trade Distribution"}
                    </h3>
                    <div className="space-y-3">
                      {workforceAnalytics.tradeDistribution.map(
                        (trade, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-gray-900">
                                {trade.trade}
                              </div>
                              <div className="text-sm text-gray-500">
                                {trade.count} {isArabic ? "موظف" : "employees"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">
                                {formatPercentage(trade.profitMargin)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {isArabic ? "هامش الربح" : "profit margin"}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === "reports" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isArabic
                    ? "مركز ذكاء الأرباح"
                    : "Profit Intelligence Center"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <h3 className="font-semibold text-green-800">
                        {isArabic
                          ? "تحليل الأرباح الفوري"
                          : "Real-Time Profit Analysis"}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">
                          {isArabic ? "إجمالي الإيرادات:" : "Total Revenue:"}
                        </span>
                        <span className="font-bold text-green-900">
                          {formatCurrency(dashboardMetrics.crossProjectRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">
                          {isArabic ? "إجمالي الأرباح:" : "Total Profits:"}
                        </span>
                        <span className="font-bold text-green-900">
                          {formatCurrency(dashboardMetrics.realTimeProfits)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">
                          {isArabic ? "هامش الربح:" : "Profit Margin:"}
                        </span>
                        <span className="font-bold text-green-900">
                          {formatPercentage(
                            dashboardMetrics.averageProfitMargin
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Activity className="w-8 h-8 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">
                        {isArabic ? "مقاييس الأداء" : "Performance Metrics"}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">
                          {isArabic ? "الإنتاجية:" : "Productivity:"}
                        </span>
                        <span className="font-bold text-blue-900">
                          {formatCurrency(dashboardMetrics.productivityIndex)}
                          /hr
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">
                          {isArabic ? "الاستغلال:" : "Utilization:"}
                        </span>
                        <span className="font-bold text-blue-900">
                          {formatPercentage(dashboardMetrics.utilizationRate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">
                          {isArabic ? "إجمالي الساعات:" : "Total Hours:"}
                        </span>
                        <span className="font-bold text-blue-900">
                          {dashboardMetrics.aggregateHours.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-8 h-8 text-purple-600" />
                      <h3 className="font-semibold text-purple-800">
                        {isArabic
                          ? "إنجازات الأداء"
                          : "Performance Achievements"}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {isArabic
                            ? "صفر حوادث سلامة"
                            : "Zero safety incidents"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {isArabic
                            ? "تجاوز أهداف الإنتاجية"
                            : "Exceeded productivity targets"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {isArabic
                            ? "امتثال كامل للوثائق"
                            : "Full document compliance"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إضافة موظف جديد" : "Add New Employee"}
              </h3>
              <button
                onClick={() => setShowAddEmployee(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الموظف" : "Employee Name"} *
                  </label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الموظف" : "Employee ID"} *
                  </label>
                  <input
                    type="text"
                    value={newEmployee.employeeId}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        employeeId: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المهنة" : "Trade"} *
                  </label>
                  <select
                    value={newEmployee.trade}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, trade: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">
                      {isArabic ? "اختر المهنة" : "Select Trade"}
                    </option>
                    <option value="Site Supervisor">Site Supervisor</option>
                    <option value="Heavy Equipment Operator">
                      Heavy Equipment Operator
                    </option>
                    <option value="Electrician">Electrician</option>
                    <option value="Welder">Welder</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Mechanic">Mechanic</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Plumber">Plumber</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الجنسية" : "Nationality"} *
                  </label>
                  <select
                    value={newEmployee.nationality}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        nationality: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">
                      {isArabic ? "اختر الجنسية" : "Select Nationality"}
                    </option>
                    <option value="Saudi">Saudi</option>
                    <option value="Pakistani">Pakistani</option>
                    <option value="Egyptian">Egyptian</option>
                    <option value="Indian">Indian</option>
                    <option value="Bangladeshi">Bangladeshi</option>
                    <option value="Filipino">Filipino</option>
                    <option value="Yemeni">Yemeni</option>
                    <option value="Sudanese">Sudanese</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone Number"} *
                  </label>
                  <input
                    type="tel"
                    value={newEmployee.phoneNumber}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="+966501234567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المشروع" : "Project Assignment"}
                  </label>
                  <select
                    value={newEmployee.projectId || ""}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        projectId: e.target.value || undefined,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "غير مُعيَّن" : "Unassigned"}
                    </option>
                    {projects
                      .filter((p) => p.status === "active")
                      .map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-4">
                  {isArabic ? "المعلومات المالية" : "Financial Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "الأجر بالساعة (ريال)" : "Hourly Rate (SAR)"}{" "}
                      *
                    </label>
                    <input
                      type="number"
                      value={newEmployee.hourlyRate}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          hourlyRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="18"
                      step="0.01"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {isArabic
                        ? "ما تدفعه الشركة للموظف"
                        : "What company pays employee"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "سعر الفوترة (ريال)" : "Actual Rate (SAR)"} *
                    </label>
                    <input
                      type="number"
                      value={newEmployee.actualRate}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          actualRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="20"
                      step="0.01"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {isArabic
                        ? "ما تفوتر به الشركة العميل"
                        : "What company bills client"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "هامش الربح" : "Profit Margin"}
                    </label>
                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100">
                      {newEmployee.actualRate && newEmployee.hourlyRate
                        ? `${(
                            ((newEmployee.actualRate - newEmployee.hourlyRate) /
                              newEmployee.actualRate) *
                            100
                          ).toFixed(1)}%`
                        : "0%"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {isArabic ? "محسوب تلقائياً" : "Calculated automatically"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleAddEmployee}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ الموظف" : "Save Employee"}
                </button>
                <button
                  onClick={() => setShowAddEmployee(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إضافة مشروع جديد" : "Add New Project"}
              </h3>
              <button
                onClick={() => setShowAddProject(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم المشروع" : "Project Name"} *
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "العميل" : "Client"} *
                  </label>
                  <input
                    type="text"
                    value={newProject.client}
                    onChange={(e) =>
                      setNewProject({ ...newProject, client: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الموقع" : "Location"} *
                  </label>
                  <input
                    type="text"
                    value={newProject.location}
                    onChange={(e) =>
                      setNewProject({ ...newProject, location: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الميزانية (ريال)" : "Budget (SAR)"} *
                  </label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        budget: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ البداية" : "Start Date"} *
                  </label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ الانتهاء" : "End Date"} *
                  </label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) =>
                      setNewProject({ ...newProject, endDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "وصف المشروع" : "Project Description"}
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleAddProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ المشروع" : "Save Project"}
                </button>
                <button
                  onClick={() => setShowAddProject(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
