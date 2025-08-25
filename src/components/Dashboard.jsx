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

export const Dashboard = ({ isArabic, projects }) => {
  const {
    employees,
    attendance,
    insights,
    getDashboardMetrics,
    getProjectMetrics,
    generateInsights,
  } = useWorkforceData();

  const [selectedProject, setSelectedProject] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  console.log(projects);

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
          <button
            onClick={handleExportData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير البيانات" : "Export Data"}
          </button>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={isArabic ? "إجمالي القوى العاملة" : "Total Workforce"}
          value={metrics.totalWorkforce}
          subtitle={`${
            employees.filter((emp) => emp.status === "active").length
          } ${isArabic ? "نشط" : "active"}`}
          icon={Users}
          gradient="from-blue-50 to-blue-100"
          borderColor="border-blue-200"
        />

        <MetricCard
          title={isArabic ? "المشاريع النشطة" : "Active Projects"}
          value={metrics.activeProjects}
          subtitle={`${projects.length} ${isArabic ? "إجمالي" : "total"}`}
          icon={Building2}
          gradient="from-green-50 to-green-100"
          borderColor="border-green-200"
        />

        <MetricCard
          title={isArabic ? "الأرباح الفورية" : "Real-Time Profits"}
          value={formatCurrency(metrics.realTimeProfits)}
          subtitle={`${formatPercentage(metrics.averageProfitMargin)} ${
            isArabic ? "هامش" : "margin"
          }`}
          icon={DollarSign}
          gradient="from-purple-50 to-purple-100"
          borderColor="border-purple-200"
          trend={{
            value: "+15.2%",
            isPositive: true,
          }}
        />

        <MetricCard
          title={isArabic ? "معدل الاستغلال" : "Utilization Rate"}
          value={formatPercentage(metrics.utilizationRate)}
          subtitle={`${metrics.productivityIndex.toFixed(1)} ${
            isArabic ? "إنتاجية" : "productivity"
          }`}
          icon={TrendingUp}
          gradient="from-yellow-50 to-yellow-100"
          borderColor="border-yellow-200"
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
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects
            .filter(
              (project) => !selectedProject || project.id === selectedProject
            )
            .map((project) => (
              <ProjectInfo
                key={project.id}
                project={project}
                metrics={getProjectMetrics(project.id)}
                isArabic={isArabic}
                onSelect={() => {
                  setSelectedProject(project.id);
                }}
              />
            ))}
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ActionableInsights
          insights={insights}
          isArabic={isArabic}
          onInsightAction={(insightId, action) => {
            // Handle insight actions
            switch (action) {
              case "acknowledge":
                alert(isArabic ? "تم تأكيد الرؤية" : "Insight acknowledged");
                break;
              case "dismiss":
                alert(isArabic ? "تم تجاهل الرؤية" : "Insight dismissed");
                break;
              case "complete":
                alert(isArabic ? "تم إكمال الإجراء" : "Action completed");
                break;
            }
          }}
        />
      </div>
    </div>
  );
};
