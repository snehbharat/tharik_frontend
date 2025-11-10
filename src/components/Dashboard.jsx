import React, { useState, useEffect } from "react";
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
  RefreshCw,
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useWorkforceData } from "../hooks/useWorkforceData";
import { MetricCard } from "./MetricCard";
import { ProjectInfo } from "./ProjectInfo";
import { ActionableInsights } from "./ActionableInsights";
import {
  formatCurrency,
  formatPercentage,
} from "../utils/financialCalculations";
import { generateSampleDataApi } from "../data/sampleData";
import { FinanceDepartmentDashboard } from "./FinanceDepartmentDashboard";
import { EmployeeManagementDashboard } from "./EmployeeManagementDashboard";
import { TaskManagementDashboard } from "./TaskManagementDashboard";
import { useAuth } from "../hooks/useAuth";
import { OperationsDepartmentDashboard } from "./OperationsDepartmentDashboard";
import EmployeeManagementHubDashboard from "./hrms/EmployeeManagementHubDashboar";

export const Dashboard = ({ isArabic, projects }) => {
  const { user } = useAuth();

  const { getDashboardMetrics, getProjectMetrics, generateInsights } =
    useWorkforceData();

  // Replace the direct hook with state management for API data
  const [data, setData] = useState({
    employees: [],
    attendance: [],
    insights: [],
  });
  const [error, setError] = useState(null);

  // Load data on component mount and when month changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiData = await generateSampleDataApi();
        setData(apiData);
      } catch (err) {
        console.error("Failed to load payroll data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const { employees, attendance, insights } = data;

  const [selectedProject, setSelectedProject] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const metrics = getDashboardMetrics();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const handleExportData = () => {
    try {
      const exportData = {
        metrics,
        employees: employees.length,
        projects: projects.length,
        attendance: attendance.length,
        exportedAt: new Date().toISOString(),
      };

      const csvContent = [
        ["Metric", "Value"],
        ["Total Workforce", metrics.totalWorkforce.toString()],
        ["Active Projects", metrics.activeProjects.toString()],
        ["Total Hours", metrics.aggregateHours.toString()],
        ["Revenue", formatCurrency(metrics.crossProjectRevenue)],
        ["Profits", formatCurrency(metrics.realTimeProfits)],
        ["Utilization Rate", formatPercentage(metrics.utilizationRate)],
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dashboard_export_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert(isArabic ? "فشل في تصدير البيانات" : "Export failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isArabic ? "جاري تحميل لوحة التحكم..." : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">
                {isArabic ? "خطأ في تحميل البيانات" : "Data Loading Error"}
              </h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {isArabic ? "إعادة المحاولة" : "Retry"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic ? "لوحة التحكم" : "Dashboard"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isArabic
              ? "نظرة عامة على الأداء والعمليات"
              : "Overview of performance and operations"}
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              {isArabic ? "آخر تحديث:" : "Last updated:"}{" "}
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* <button
            onClick={handleExportData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير البيانات" : "Export Data"}
          </button> */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing
              ? isArabic
                ? "جاري التحديث..."
                : "Refreshing..."
              : isArabic
              ? "تحديث"
              : "Refresh"}
          </button>
        </div>
      </div>

      {/* <div className=""> */}

      {(user?.role === "admin" || user?.role === "Finance Clerk") && (
        <div>
          <FinanceDepartmentDashboard />
        </div>
      )}

      {(user?.role === "admin" || user?.role === "Operations Supervisor") && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              {isArabic ? "نظرة عامة على العمليات" : "Operational Overview"}
            </h1>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <MetricCard
              title={isArabic ? "إجمالي القوى العاملة" : "Total Workforce"}
              value={employees.length}
              subtitle={`${
                employees.filter((emp) => emp.status === "active").length
              } ${isArabic ? "نشط" : "active"}`}
              icon={Users}
              gradient="from-blue-50 to-blue-100"
              borderColor="border-blue-200"
            />

            <MetricCard
              title={isArabic ? "المشاريع النشطة" : "Active Projects"}
              value={projects.length}
              subtitle={`${projects?.length} ${isArabic ? "إجمالي" : "total"}`}
              icon={Building2}
              gradient="from-green-50 to-green-100"
              borderColor="border-green-200"
            />
          </div>

          {/* Projects Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isArabic ? "نظرة عامة على المشاريع" : "Projects Overview"}
              </h2>
              <select
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">
                  {isArabic ? "جميع المشاريع" : "All Projects"}
                </option>
                {projects?.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">
              {projects
                ?.filter(
                  (project) =>
                    !selectedProject || project._id === selectedProject
                )
                .map((project) => (
                  <ProjectInfo
                    key={project._id}
                    project={project}
                    metrics={getProjectMetrics(project._id)}
                    isArabic={isArabic}
                    onSelect={() => {
                      setSelectedProject(project._id);
                    }}
                  />
                ))}
            </div>

            <EmployeeManagementDashboard />
            <TaskManagementDashboard isArabic={isArabic} currentUser={user} />
            <OperationsDepartmentDashboard />
          </div>
        </>
      )}
      {(user?.role === "admin" || user?.role === "HR Manager") && (
        <EmployeeManagementHubDashboard />
      )}
    </div>
  );
};
