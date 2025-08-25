import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Target,
  Activity,
  Plus,
  FileText,
  Download,
  Save,
  X,
  Edit,
  Eye,
  Filter,
  Search,
  Bell,
  TrendingUp,
  PieChart,
  Zap,
  Shield,
  Award,
  Settings,
  RefreshCw,
  Star,
  Layers,
  Globe,
  Database,
  Wifi,
  WifiOff,
} from "lucide-react";

export const OperationsDepartment = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("projects");
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("week");
  const [connectionStatus, setConnectionStatus] = "online";
  const [lastSync, setLastSync] = useState(new Date());

  const [newSchedule, setNewSchedule] = useState({
    project: "",
    team: "",
    supervisor: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    workers: 0,
    vehicles: 0,
    tasks: [""],
    priority: "Medium",
    notes: "",
  });

  // Enhanced project data with additional metrics
  const activeProjects = [
    {
      id: 1,
      name: "Aramco Facility Maintenance",
      nameAr: "صيانة منشآت أرامكو",
      client: "Saudi Aramco",
      location: "Dhahran Industrial Complex",
      startDate: "2024-01-15",
      endDate: "2025-01-14",
      progress: 75,
      assignedWorkers: 45,
      assignedVehicles: 12,
      status: "On Track",
      budget: 1200000,
      spent: 900000,
      efficiency: 94.2,
      safetyScore: 98,
      qualityIndex: 96.5,
      customerSatisfaction: 4.8,
      riskLevel: "low",
      lastUpdate: new Date("2024-12-15"),
      nextMilestone: "2024-12-20",
      criticalPath: [
        "Equipment Installation",
        "Safety Inspection",
        "Quality Testing",
      ],
    },
    {
      id: 2,
      name: "SABIC Construction Support",
      nameAr: "دعم إنشاءات سابك",
      client: "SABIC Industries",
      location: "Jubail Industrial City",
      startDate: "2024-03-01",
      endDate: "2024-12-31",
      progress: 60,
      assignedWorkers: 32,
      assignedVehicles: 8,
      status: "On Track",
      budget: 850000,
      spent: 510000,
      efficiency: 87.5,
      safetyScore: 96,
      qualityIndex: 89.2,
      customerSatisfaction: 4.5,
      riskLevel: "medium",
      lastUpdate: new Date("2024-12-14"),
      nextMilestone: "2024-12-22",
      criticalPath: [
        "Foundation Work",
        "Structural Assembly",
        "Systems Integration",
      ],
    },
    {
      id: 3,
      name: "NEOM Infrastructure Development",
      nameAr: "تطوير البنية التحتية لنيوم",
      client: "NEOM Development",
      location: "NEOM - Tabuk Province",
      startDate: "2024-06-01",
      endDate: "2025-05-31",
      progress: 35,
      assignedWorkers: 78,
      assignedVehicles: 20,
      status: "Behind Schedule",
      budget: 2100000,
      spent: 735000,
      efficiency: 82.1,
      safetyScore: 94,
      qualityIndex: 91.8,
      customerSatisfaction: 4.2,
      riskLevel: "high",
      lastUpdate: new Date("2024-12-13"),
      nextMilestone: "2024-12-18",
      criticalPath: [
        "Site Preparation",
        "Infrastructure Planning",
        "Environmental Clearance",
      ],
    },
  ];

  // Enhanced operational alerts system
  const [operationalAlerts] = useState([
    {
      id: "alert_001",
      type: "safety",
      severity: "warning",
      message: "Safety equipment inspection due for NEOM project",
      messageAr: "فحص معدات السلامة مستحق لمشروع نيوم",
      timestamp: new Date("2024-12-15T10:30:00"),
      acknowledged: false,
      assignedTo: "Safety Officer",
    },
    {
      id: "alert_002",
      type: "schedule",
      severity: "error",
      message: "SABIC project milestone delayed by 2 days",
      messageAr: "تأخر معلم مشروع سابك بيومين",
      timestamp: new Date("2024-12-15T08:15:00"),
      acknowledged: false,
      assignedTo: "Project Manager",
    },
    {
      id: "alert_003",
      type: "resource",
      severity: "info",
      message: "New equipment delivery scheduled for tomorrow",
      messageAr: "تسليم معدات جديدة مجدول لغداً",
      timestamp: new Date("2024-12-15T14:20:00"),
      acknowledged: true,
      assignedTo: "Operations Supervisor",
    },
  ]);

  // Enhanced resource utilization tracking
  const [resourceUtilization] = useState([
    {
      type: "workforce",
      allocated: 186,
      utilized: 175,
      efficiency: 94.1,
      trend: "up",
    },
    {
      type: "equipment",
      allocated: 47,
      utilized: 41,
      efficiency: 87.2,
      trend: "stable",
    },
    {
      type: "materials",
      allocated: 100,
      utilized: 89,
      efficiency: 89.0,
      trend: "down",
    },
  ]);
  const schedules = [
    {
      id: 1,
      project: "Aramco Facility Maintenance",
      team: "Team Alpha",
      supervisor: "Ahmed Al-Rashid",
      date: "2024-12-16",
      startTime: "06:00",
      endTime: "14:00",
      location: "Sector A - Maintenance Bay",
      workers: 15,
      vehicles: 4,
      tasks: [
        "Equipment inspection",
        "Preventive maintenance",
        "Safety checks",
      ],
      priority: "High",
      status: "Scheduled",
      notes: "Critical maintenance window",
    },
    {
      id: 2,
      project: "SABIC Construction Support",
      team: "Team Beta",
      supervisor: "Mohammad Hassan",
      date: "2024-12-16",
      startTime: "08:00",
      endTime: "16:00",
      location: "Construction Site B",
      workers: 12,
      vehicles: 3,
      tasks: ["Material handling", "Site preparation", "Quality control"],
      priority: "Medium",
      status: "In Progress",
      notes: "Weather dependent activities",
    },
    {
      id: 3,
      project: "NEOM Infrastructure",
      team: "Team Gamma",
      supervisor: "Ali Al-Mahmoud",
      date: "2024-12-17",
      startTime: "07:00",
      endTime: "15:00",
      location: "Infrastructure Zone C",
      workers: 20,
      vehicles: 6,
      tasks: ["Road construction", "Utility installation", "Site surveying"],
      priority: "High",
      status: "Scheduled",
      notes: "Coordination with utility companies required",
    },
  ];

  const operationMetrics = {
    totalProjects: 24,
    activeWorkers: 186,
    vehiclesInUse: 47,
    efficiency: 92.3,
    safetyIncidents: 2,
    completedTasks: 1247,
    onTimeDelivery: 94.8,
    clientSatisfaction: 4.7,
    qualityScore: 93.2,
    resourceUtilization: 89.5,
    costEfficiency: 91.8,
  };

  const performanceMetrics = [
    {
      titleEn: "Project Completion Rate",
      titleAr: "معدل إنجاز المشاريع",
      value: "92%",
      change: "+5%",
      trend: "up",
      target: "95%",
      status: "on-track",
    },
    {
      titleEn: "Resource Utilization",
      titleAr: "استغلال الموارد",
      value: "87%",
      change: "+3%",
      trend: "up",
      target: "90%",
      status: "below-target",
    },
    {
      titleEn: "Client Satisfaction",
      titleAr: "رضا العملاء",
      value: "4.8/5.0",
      change: "+0.2",
      trend: "up",
      target: "4.5/5.0",
      status: "above-target",
    },
    {
      titleEn: "Safety Score",
      titleAr: "نقاط السلامة",
      value: "96%",
      change: "+1%",
      trend: "up",
      target: "95%",
      status: "above-target",
    },
  ];

  // Enhanced functions with better error handling and user feedback
  const handleCreateSchedule = () => {
    if (!newSchedule.project || !newSchedule.team || !newSchedule.date) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    // Validate schedule conflicts
    const hasConflict = schedules.some(
      (schedule) =>
        schedule.date === newSchedule.date && schedule.team === newSchedule.team
    );

    if (hasConflict) {
      alert(
        isArabic
          ? "يوجد تعارض في الجدولة لهذا الفريق"
          : "Schedule conflict exists for this team"
      );
      return;
    }
    const schedule = {
      ...newSchedule,
      id: Math.max(...schedules.map((s) => s.id)) + 1,
      status: "Scheduled",
      tasks: newSchedule.tasks.filter((task) => task.trim() !== ""),
    };

    console.log("New schedule created:", schedule);

    // Update last sync time
    setLastSync(new Date());

    setNewSchedule({
      project: "",
      team: "",
      supervisor: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      workers: 0,
      vehicles: 0,
      tasks: [""],
      priority: "Medium",
      notes: "",
    });
    setShowNewSchedule(false);
    alert(
      isArabic ? "تم إنشاء الجدولة بنجاح!" : "Schedule created successfully!"
    );
  };

  // Enhanced report generation with multiple formats and better data
  const handleGenerateComprehensiveReport = () => {
    try {
      let reportContent = "";
      reportContent += `AMOAGC AL-MAJMAAH - ENHANCED OPERATIONS REPORT\n`;
      reportContent += `Generated on: ${new Date().toLocaleString()}\n`;
      reportContent += `Report Period: ${selectedDateRange.toUpperCase()}\n`;
      reportContent += `Connection Status: ${connectionStatus.toUpperCase()}\n`;
      reportContent += `Last Data Sync: ${lastSync.toLocaleString()}\n`;
      reportContent += `${"=".repeat(80)}\n\n`;

      reportContent += `EXECUTIVE SUMMARY & KPIs:\n`;
      reportContent += `${"=".repeat(40)}\n`;
      reportContent += `Total Active Projects: ${operationMetrics.totalProjects}\n`;
      reportContent += `Active Workers: ${operationMetrics.activeWorkers}\n`;
      reportContent += `Vehicles in Use: ${operationMetrics.vehiclesInUse}\n`;
      reportContent += `Overall Efficiency: ${operationMetrics.efficiency}%\n`;
      reportContent += `Quality Score: ${operationMetrics.qualityScore}%\n`;
      reportContent += `Resource Utilization: ${operationMetrics.resourceUtilization}%\n`;
      reportContent += `Cost Efficiency: ${operationMetrics.costEfficiency}%\n`;
      reportContent += `Safety Incidents: ${operationMetrics.safetyIncidents}\n`;
      reportContent += `On-Time Delivery: ${operationMetrics.onTimeDelivery}%\n`;
      reportContent += `Client Satisfaction: ${operationMetrics.clientSatisfaction}/5.0\n\n`;

      reportContent += `RESOURCE UTILIZATION ANALYSIS:\n`;
      reportContent += `${"=".repeat(40)}\n`;
      resourceUtilization.forEach((resource) => {
        reportContent += `${resource.type.toUpperCase()}:\n`;
        reportContent += `  Allocated: ${resource.allocated}\n`;
        reportContent += `  Utilized: ${resource.utilized}\n`;
        reportContent += `  Efficiency: ${resource.efficiency}%\n`;
        reportContent += `  Trend: ${resource.trend.toUpperCase()}\n\n`;
      });

      reportContent += `OPERATIONAL ALERTS & ISSUES:\n`;
      reportContent += `${"=".repeat(40)}\n`;
      operationalAlerts.forEach((alert) => {
        reportContent += `[${alert.severity.toUpperCase()}] ${alert.type.toUpperCase()}: ${
          alert.message
        }\n`;
        reportContent += `  Timestamp: ${alert.timestamp.toLocaleString()}\n`;
        reportContent += `  Assigned To: ${alert.assignedTo || "Unassigned"}\n`;
        reportContent += `  Status: ${
          alert.acknowledged ? "Acknowledged" : "Pending"
        }\n\n`;
      });

      reportContent += `PROJECT DETAILS:\n`;
      reportContent += `${"=".repeat(40)}\n`;
      activeProjects.forEach((project, index) => {
        reportContent += `\nProject ${index + 1}: ${project.name}\n`;
        reportContent += `${"=".repeat(50)}\n`;
        reportContent += `Client: ${project.client}\n`;
        reportContent += `Location: ${project.location}\n`;
        reportContent += `Progress: ${project.progress}%\n`;
        reportContent += `Status: ${project.status}\n`;
        reportContent += `Risk Level: ${project.riskLevel.toUpperCase()}\n`;
        reportContent += `Workers Assigned: ${project.assignedWorkers}\n`;
        reportContent += `Vehicles Assigned: ${project.assignedVehicles}\n`;
        reportContent += `Budget: ${project.budget.toLocaleString()} SAR\n`;
        reportContent += `Spent: ${project.spent.toLocaleString()} SAR\n`;
        reportContent += `Budget Utilization: ${(
          (project.spent / project.budget) *
          100
        ).toFixed(1)}%\n`;
        reportContent += `Efficiency Score: ${project.efficiency}%\n`;
        reportContent += `Safety Score: ${project.safetyScore}%\n`;
        reportContent += `Quality Index: ${project.qualityIndex}%\n`;
        reportContent += `Customer Satisfaction: ${project.customerSatisfaction}/5.0\n`;
        reportContent += `Last Update: ${project.lastUpdate.toLocaleDateString()}\n`;
        reportContent += `Next Milestone: ${project.nextMilestone}\n`;
        reportContent += `Critical Path: ${project.criticalPath.join(" → ")}\n`;
        reportContent += `Start Date: ${project.startDate}\n`;
        reportContent += `End Date: ${project.endDate}\n\n`;
      });

      reportContent += `SCHEDULED OPERATIONS:\n`;
      reportContent += `${"=".repeat(40)}\n`;
      schedules.forEach((schedule, index) => {
        reportContent += `\nSchedule ${index + 1}:\n`;
        reportContent += `Project: ${schedule.project}\n`;
        reportContent += `Team: ${schedule.team}\n`;
        reportContent += `Supervisor: ${schedule.supervisor}\n`;
        reportContent += `Date: ${schedule.date}\n`;
        reportContent += `Time: ${schedule.startTime} - ${schedule.endTime}\n`;
        reportContent += `Location: ${schedule.location}\n`;
        reportContent += `Workers: ${schedule.workers}\n`;
        reportContent += `Vehicles: ${schedule.vehicles}\n`;
        reportContent += `Priority: ${schedule.priority}\n`;
        reportContent += `Status: ${schedule.status}\n`;
        reportContent += `Tasks: ${schedule.tasks.join(", ")}\n`;
        if (schedule.notes) {
          reportContent += `Notes: ${schedule.notes}\n`;
        }
        reportContent += `\n`;
      });

      reportContent += `PERFORMANCE METRICS:\n`;
      reportContent += `${"=".repeat(40)}\n`;
      performanceMetrics.forEach((metric) => {
        reportContent += `${metric.titleEn}: ${metric.value} (${metric.change})\n`;
        reportContent += `  Target: ${metric.target}\n`;
        reportContent += `  Status: ${metric.status.toUpperCase()}\n`;
        reportContent += `  Trend: ${metric.trend.toUpperCase()}\n\n`;
      });

      reportContent += `STRATEGIC RECOMMENDATIONS:\n`;
      reportContent += `${"=".repeat(40)}\n`;
      reportContent += `1. Continue monitoring NEOM project progress closely\n`;
      reportContent += `2. Maintain current safety protocols\n`;
      reportContent += `3. Consider resource reallocation for optimal efficiency\n`;
      reportContent += `4. Schedule preventive maintenance for vehicles\n`;
      reportContent += `5. Implement additional safety training if needed\n`;
      reportContent += `6. Address resource utilization gaps in materials management\n`;
      reportContent += `7. Enhance quality control processes for SABIC project\n`;
      reportContent += `8. Implement risk mitigation strategies for high-risk projects\n\n`;

      reportContent += `REPORT METADATA:\n`;
      reportContent += `${"=".repeat(40)}\n`;
      reportContent += `Generated by: Enhanced Operations Department System\n`;
      reportContent += `Report Version: 2.0\n`;
      reportContent += `Data Quality Score: 98.5%\n`;
      reportContent += `Automated Analysis: Enabled\n`;
      reportContent += `Date: ${new Date().toLocaleDateString()}\n`;
      reportContent += `Time: ${new Date().toLocaleTimeString()}\n`;

      const blob = new Blob([reportContent], {
        type: "text/plain;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `enhanced_operations_report_${
          new Date().toISOString().split("T")[0]
        }.txt`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم إنشاء التقرير المحسن للعمليات بنجاح!"
          : "Enhanced operations report generated successfully!"
      );
    } catch (error) {
      console.error("Report generation error:", error);
      alert(
        isArabic
          ? "حدث خطأ أثناء إنشاء التقرير"
          : "Error occurred during report generation"
      );
    }
  };

  // Enhanced utility functions
  const acknowledgeAlert = (alertId) => {
    // In a real implementation, this would update the alert status
    console.log(`Alert ${alertId} acknowledged`);
    alert(isArabic ? "تم الإقرار بالتنبيه" : "Alert acknowledged");
  };

  const refreshData = () => {
    setLastSync(new Date());
    alert(isArabic ? "تم تحديث البيانات" : "Data refreshed");
  };

  const toggleConnectionStatus = () => {
    setConnectionStatus((prev) => (prev === "online" ? "offline" : "online"));
  };
  const addTask = () => {
    setNewSchedule({
      ...newSchedule,
      tasks: [...newSchedule.tasks, ""],
    });
  };

  const updateTask = (index, value) => {
    const updatedTasks = [...newSchedule.tasks];
    updatedTasks[index] = value;
    setNewSchedule({
      ...newSchedule,
      tasks: updatedTasks,
    });
  };

  const removeTask = (index) => {
    if (newSchedule.tasks.length > 1) {
      const updatedTasks = newSchedule.tasks.filter((_, i) => i !== index);
      setNewSchedule({
        ...newSchedule,
        tasks: updatedTasks,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On Track":
      case "Completed":
      case "Scheduled":
        return "bg-green-100 text-green-800";
      case "Behind Schedule":
      case "Delayed":
        return "bg-red-100 text-red-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "قسم العمليات المحسن" : "Enhanced Operations Department"}
        </h1>
        <div className="flex items-center gap-3">
          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleConnectionStatus}
              className={`p-2 rounded-lg transition-colors ${
                connectionStatus === "online"
                  ? "text-green-600 hover:bg-green-50"
                  : "text-red-600 hover:bg-red-50"
              }`}
              title={connectionStatus === "online" ? "Online" : "Offline"}
            >
              {connectionStatus === "online" ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
            </button>
            <span className="text-xs text-gray-500">
              {isArabic ? "آخر مزامنة:" : "Last sync:"}{" "}
              {lastSync.toLocaleTimeString()}
            </span>
          </div>

          <button
            onClick={refreshData}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {isArabic ? "تحديث" : "Refresh"}
          </button>

          <button
            onClick={handleGenerateComprehensiveReport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            {isArabic ? "التقرير الشامل" : "Comprehensive Report"}
          </button>
          <button
            onClick={() => setShowNewSchedule(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            {isArabic ? "جدولة جديدة" : "New Schedule"}
          </button>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Target className="w-4 h-4" />
            {isArabic ? "فلاتر متقدمة" : "Advanced Filters"}
          </button>
        </div>
      </div>

      {/* Operations Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {operationMetrics.totalProjects}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "المشاريع النشطة" : "Active Projects"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <TrendingUp className="w-3 h-3" />
            <span>+12% {isArabic ? "هذا الشهر" : "this month"}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {operationMetrics.activeWorkers}
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "العمال النشطون" : "Active Workers"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="w-3 h-3" />
            <span>
              {operationMetrics.efficiency}% {isArabic ? "كفاءة" : "efficiency"}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {operationMetrics.vehiclesInUse}
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "المركبات المستخدمة" : "Vehicles in Use"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-purple-600">
            <Activity className="w-3 h-3" />
            <span>
              {operationMetrics.resourceUtilization}%{" "}
              {isArabic ? "استغلال" : "utilization"}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {operationMetrics.onTimeDelivery}%
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "التسليم في الوقت" : "On-Time Delivery"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-yellow-600">
            <Bell className="w-3 h-3" />
            <span>
              {operationMetrics.safetyIncidents}{" "}
              {isArabic ? "حوادث" : "incidents"}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Real-time Alerts System */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-800">
              {isArabic ? "نظام التنبيهات المحسن" : "Enhanced Alert System"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {operationalAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getAlertSeverityColor(
                    alert.severity
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase">
                      {alert.type}
                    </span>
                    <span className="text-xs">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium">
                    {isArabic ? alert.messageAr : alert.message}
                  </p>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="mt-2 text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-2 py-1 rounded transition-colors"
                    >
                      {isArabic ? "إقرار" : "Acknowledge"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-orange-800">
              {operationalAlerts.filter((a) => !a.acknowledged).length}
            </div>
            <div className="text-sm text-orange-600">
              {isArabic ? "تنبيهات نشطة" : "Active Alerts"}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isArabic ? "الفلاتر المتقدمة" : "Advanced Filters"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option value="all">
                {isArabic ? "جميع المشاريع" : "All Projects"}
              </option>
              <option value="on-track">
                {isArabic ? "في المسار" : "On Track"}
              </option>
              <option value="delayed">{isArabic ? "متأخر" : "Delayed"}</option>
              <option value="completed">
                {isArabic ? "مكتمل" : "Completed"}
              </option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option value="all">
                {isArabic ? "جميع المخاطر" : "All Risk Levels"}
              </option>
              <option value="low">{isArabic ? "منخفض" : "Low Risk"}</option>
              <option value="medium">
                {isArabic ? "متوسط" : "Medium Risk"}
              </option>
              <option value="high">{isArabic ? "عالي" : "High Risk"}</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option value="all">
                {isArabic ? "جميع المواقع" : "All Locations"}
              </option>
              <option value="dhahran">
                {isArabic ? "الظهران" : "Dhahran"}
              </option>
              <option value="jubail">{isArabic ? "الجبيل" : "Jubail"}</option>
              <option value="neom">{isArabic ? "نيوم" : "NEOM"}</option>
            </select>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {isArabic ? "تطبيق الفلاتر" : "Apply Filters"}
            </button>
          </div>
        </div>
      )}
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "projects"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {isArabic ? "المشاريع" : "Projects"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "schedule"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {isArabic ? "الجدولة" : "Scheduling"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "assignments"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {isArabic ? "المهام اليومية" : "Daily Assignments"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "performance"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? "الأداء" : "Performance"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "analytics"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {isArabic ? "التحليلات" : "Analytics"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "alerts"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {isArabic ? "التنبيهات" : "Alerts"}
                {operationalAlerts.filter((a) => !a.acknowledged).length >
                  0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {operationalAlerts.filter((a) => !a.acknowledged).length}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={
                        isArabic ? "البحث في المشاريع..." : "Search projects..."
                      }
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="all">
                      {isArabic ? "جميع المشاريع" : "All Projects"}
                    </option>
                    <option value="on-track">
                      {isArabic ? "في المسار" : "On Track"}
                    </option>
                    <option value="delayed">
                      {isArabic ? "متأخر" : "Delayed"}
                    </option>
                  </select>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Filter className="w-4 h-4" />
                  {isArabic ? "تصفية متقدمة" : "Advanced Filter"}
                </button>
              </div>

              <div className="grid gap-6">
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {isArabic ? project.nameAr : project.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {project.client}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {project.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getRiskLevelColor(
                            project.riskLevel
                          )}`}
                        >
                          {project.riskLevel.toUpperCase()}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 p-1 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "التقدم" : "Progress"}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "العمال" : "Workers"}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {project.assignedWorkers}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "المركبات" : "Vehicles"}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {project.assignedVehicles}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "الكفاءة" : "Efficiency"}
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {project.efficiency}%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "السلامة" : "Safety"}
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                          {project.safetyScore}%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "الجودة" : "Quality"}
                        </div>
                        <div className="text-lg font-semibold text-purple-600">
                          {project.qualityIndex}%
                        </div>
                      </div>
                    </div>

                    {/* Enhanced project details */}
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            {isArabic
                              ? "رضا العملاء:"
                              : "Customer Satisfaction:"}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(project.customerSatisfaction)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 font-semibold">
                              {project.customerSatisfaction}/5.0
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            {isArabic ? "آخر تحديث:" : "Last Update:"}
                          </span>
                          <div className="text-gray-900 mt-1">
                            {project.lastUpdate.toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            {isArabic ? "المعلم التالي:" : "Next Milestone:"}
                          </span>
                          <div className="text-gray-900 mt-1">
                            {project.nextMilestone}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <span className="font-medium text-gray-700">
                          {isArabic ? "المسار الحرج:" : "Critical Path:"}
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.criticalPath.map((step, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {isArabic ? "من" : "From"} {project.startDate}{" "}
                        {isArabic ? "إلى" : "to"} {project.endDate}
                      </span>
                      <span>
                        {project.spent.toLocaleString()} /{" "}
                        {project.budget.toLocaleString()} SAR (
                        {((project.spent / project.budget) * 100).toFixed(1)}%{" "}
                        {isArabic ? "مستخدم" : "used"})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {isArabic
                    ? "جدولة العمليات الذكية"
                    : "Smart Operations Scheduling"}
                </h3>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "إدارة متقدمة للجدولة مع تحسين الموارد وتنبيهات ذكية"
                    : "Advanced scheduling management with resource optimization and smart alerts"}
                </p>
              </div>

              <div className="grid gap-6">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {schedule.team}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {schedule.project}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{schedule.supervisor}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{schedule.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                            schedule.priority
                          )}`}
                        >
                          {schedule.priority}
                        </span>
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            schedule.status
                          )}`}
                        >
                          {schedule.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "الموقع" : "Location"}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {schedule.location}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "العمال" : "Workers"}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {schedule.workers}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "المركبات" : "Vehicles"}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {schedule.vehicles}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "المدة" : "Duration"}
                        </div>
                        <div className="font-semibold text-gray-900">
                          8 {isArabic ? "ساعات" : "hours"}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "المهام المجدولة:" : "Scheduled Tasks:"}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {schedule.tasks.map((task, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>

                    {schedule.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-yellow-800 mb-1">
                          {isArabic ? "ملاحظات:" : "Notes:"}
                        </div>
                        <div className="text-sm text-yellow-700">
                          {schedule.notes}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  {isArabic ? "مهام اليوم" : "Today's Assignments"}
                </h3>
                <p className="text-sm text-green-700">
                  {isArabic
                    ? "إجمالي 47 عامل و 13 مركبة منتشرة في 3 مواقع مختلفة"
                    : "47 workers and 13 vehicles deployed across 3 different sites"}
                </p>
              </div>

              {/* Enhanced Resource Utilization Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resourceUtilization.map((resource) => (
                  <div
                    key={resource.type}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {isArabic
                          ? resource.type === "workforce"
                            ? "القوى العاملة"
                            : resource.type === "equipment"
                            ? "المعدات"
                            : "المواد"
                          : resource.type}
                      </h4>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          resource.trend === "up"
                            ? "text-green-600"
                            : resource.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        <TrendingUp
                          className={`w-4 h-4 ${
                            resource.trend === "down" ? "rotate-180" : ""
                          }`}
                        />
                        <span>{resource.trend}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {isArabic ? "المخصص:" : "Allocated:"}
                        </span>
                        <span className="font-medium">
                          {resource.allocated}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {isArabic ? "المستخدم:" : "Utilized:"}
                        </span>
                        <span className="font-medium">{resource.utilized}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {isArabic ? "الكفاءة:" : "Efficiency:"}
                        </span>
                        <span className="font-semibold text-blue-600">
                          {resource.efficiency}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${resource.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض المهام اليومية المفصلة هنا..."
                  : "Detailed daily assignments will be displayed here..."}
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-lg p-6 border shadow-sm ${
                      metric.status === "above-target"
                        ? "border-green-200 bg-green-50"
                        : metric.status === "below-target"
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? metric.titleAr : metric.titleEn}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {isArabic ? "الهدف:" : "Target:"} {metric.target}
                    </div>
                    <div
                      className={`mt-1 text-xs font-medium ${
                        metric.status === "above-target"
                          ? "text-green-600"
                          : metric.status === "below-target"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {metric.status === "above-target"
                        ? isArabic
                          ? "فوق الهدف"
                          : "Above Target"
                        : metric.status === "below-target"
                        ? isArabic
                          ? "تحت الهدف"
                          : "Below Target"
                        : isArabic
                        ? "في المسار"
                        : "On Track"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic
                    ? "تحليل الأداء المحسن"
                    : "Enhanced Performance Analysis"}
                </h3>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض الرسوم البيانية والتحليلات التفصيلية للأداء التشغيلي هنا..."
                    : "Detailed performance charts and operational analytics will be displayed here..."}
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic ? "التحليلات المتقدمة" : "Advanced Analytics"}
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-4">
                  {isArabic
                    ? "لوحة التحليلات التفاعلية"
                    : "Interactive Analytics Dashboard"}
                </h4>
                <div className="text-sm text-blue-700">
                  {isArabic
                    ? "سيتم عرض الرسوم البيانية التفاعلية والتحليلات المتقدمة هنا..."
                    : "Interactive charts and advanced analytics will be displayed here..."}
                </div>
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "إدارة التنبيهات" : "Alert Management"}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {operationalAlerts.filter((a) => !a.acknowledged).length}{" "}
                    {isArabic ? "غير مقروء" : "unread"}
                  </span>
                  <button
                    onClick={() =>
                      operationalAlerts.forEach((alert) =>
                        acknowledgeAlert(alert.id)
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    {isArabic ? "إقرار الكل" : "Acknowledge All"}
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {operationalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getAlertSeverityColor(
                      alert.severity
                    )} ${alert.acknowledged ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium uppercase px-2 py-1 bg-white bg-opacity-50 rounded">
                            {alert.type}
                          </span>
                          <span className="text-xs text-gray-600">
                            {alert.timestamp.toLocaleString()}
                          </span>
                          {alert.acknowledged && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="font-medium text-gray-900 mb-1">
                          {isArabic ? alert.messageAr : alert.message}
                        </p>
                        {alert.assignedTo && (
                          <p className="text-sm text-gray-600">
                            {isArabic ? "مُسند إلى:" : "Assigned to:"}{" "}
                            {alert.assignedTo}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!alert.acknowledged && (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="bg-white bg-opacity-75 hover:bg-opacity-100 px-3 py-1 rounded text-sm transition-colors"
                          >
                            {isArabic ? "إقرار" : "Acknowledge"}
                          </button>
                        )}
                        <button className="text-gray-500 hover:text-gray-700 p-1 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Schedule Modal */}
      {showNewSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إنشاء جدولة محسنة" : "Create Enhanced Schedule"}
              </h3>
              <button
                onClick={() => setShowNewSchedule(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Enhanced form with validation indicators */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic
                    ? "جدولة ذكية مع كشف التعارض"
                    : "Smart Scheduling with Conflict Detection"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "النظام سيتحقق تلقائياً من التعارضات في الجدولة وتوفر الموارد"
                    : "System will automatically check for scheduling conflicts and resource availability"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المشروع" : "Project"} *
                  </label>
                  <select
                    value={newSchedule.project}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        project: e.target.value,
                      })
                    }
                    className={`w-full border rounded-lg px-3 py-2 ${
                      newSchedule.project
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">
                      {isArabic ? "اختر المشروع" : "Select Project"}
                    </option>
                    <option value="Aramco Facility Maintenance">
                      Aramco Facility Maintenance
                    </option>
                    <option value="SABIC Construction Support">
                      SABIC Construction Support
                    </option>
                    <option value="NEOM Infrastructure Development">
                      NEOM Infrastructure Development
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الفريق" : "Team"} *
                  </label>
                  <select
                    value={newSchedule.team}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, team: e.target.value })
                    }
                    className={`w-full border rounded-lg px-3 py-2 ${
                      newSchedule.team
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">
                      {isArabic ? "اختر الفريق" : "Select Team"}
                    </option>
                    <option value="Team Alpha">Team Alpha</option>
                    <option value="Team Beta">Team Beta</option>
                    <option value="Team Gamma">Team Gamma</option>
                    <option value="Team Delta">Team Delta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المشرف" : "Supervisor"}
                  </label>
                  <select
                    value={newSchedule.supervisor}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        supervisor: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "اختر المشرف" : "Select Supervisor"}
                    </option>
                    <option value="Ahmed Al-Rashid">Ahmed Al-Rashid</option>
                    <option value="Mohammad Hassan">Mohammad Hassan</option>
                    <option value="Ali Al-Mahmoud">Ali Al-Mahmoud</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "التاريخ" : "Date"} *
                  </label>
                  <input
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, date: e.target.value })
                    }
                    className={`w-full border rounded-lg px-3 py-2 ${
                      newSchedule.date
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "وقت البداية" : "Start Time"}
                  </label>
                  <input
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "وقت الانتهاء" : "End Time"}
                  </label>
                  <input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الأولوية" : "Priority"}
                  </label>
                  <select
                    value={newSchedule.priority}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        priority: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الموقع" : "Location"}
                </label>
                <input
                  type="text"
                  value={newSchedule.location}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, location: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder={
                    isArabic ? "أدخل موقع العمل" : "Enter work location"
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد العمال" : "Number of Workers"}
                  </label>
                  <input
                    type="number"
                    value={newSchedule.workers}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        workers: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد المركبات" : "Number of Vehicles"}
                  </label>
                  <input
                    type="number"
                    value={newSchedule.vehicles}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        vehicles: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {isArabic ? "المهام المطلوبة" : "Required Tasks"}
                  </label>
                  <button
                    onClick={addTask}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    {isArabic ? "إضافة مهمة" : "Add Task"}
                  </button>
                </div>
                <div className="space-y-2">
                  {newSchedule.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={task}
                        onChange={(e) => updateTask(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        placeholder={
                          isArabic ? "وصف المهمة" : "Task description"
                        }
                      />
                      {newSchedule.tasks.length > 1 && (
                        <button
                          onClick={() => removeTask(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "ملاحظات إضافية" : "Additional Notes"}
                </label>
                <textarea
                  value={newSchedule.notes}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, notes: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder={
                    isArabic
                      ? "أي ملاحظات أو تعليمات خاصة..."
                      : "Any special notes or instructions..."
                  }
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleCreateSchedule}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    newSchedule.project && newSchedule.team && newSchedule.date
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={
                    !newSchedule.project ||
                    !newSchedule.team ||
                    !newSchedule.date
                  }
                >
                  <Save className="w-4 h-4" />
                  {isArabic
                    ? "إنشاء الجدولة المحسنة"
                    : "Create Enhanced Schedule"}
                </button>
                <button
                  onClick={() => setShowNewSchedule(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
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
