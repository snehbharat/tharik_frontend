import React, { useEffect, useState } from "react";
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
  Trash2,
} from "lucide-react";
import TeamService from "../../services/TeamService";
import VehicleService from "../../services/VehicleService";
import ProjectServiceClient from "../../services/ProjectServiceClient";
import EmployeeService, {
  employeeService,
  getEmployees,
} from "../../services/EmployeeService";
import ScheduleTaskService from "../../services/ScheduleTaskService";
import UserService from "../../services/UserService";

export const OperationsDepartmentDashboard = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [teamStatusFilter, setTeamStatusFilter] = useState("all");
  const [supervisors, setSupervisors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [TeamSearchTerm, setTeamSearchTerm] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("week");
  const [connectionStatus, setConnectionStatus] = "online";
  const [lastSync, setLastSync] = useState(new Date());
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [viewSchedule, setViewSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [projectPagination, setprojectPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees();

      const AllEmployees = res?.data?.data.employees || [];

      const activeOnly = AllEmployees.filter(
        (employee) => employee.status?.toLowerCase() === "active"
      );
      setActiveEmployees(activeOnly);
    } catch (err) {
      console.error("Error fetching teams:", err.message);
      setError("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };
  const fetchTeams = async (page = 1) => {
    try {
      setLoading(true);
      const res = await TeamService.getAllTeams(page, pagination.limit);

      setTeams(res?.data?.data || []);
      setPagination({
        total: res?.data?.total || 0,
        page: res?.data?.page || 1,
        limit: res?.data?.limit || 10,
        totalPages: res?.data?.totalPages || 1,
      });
    } catch (err) {
      console.error("Error fetching teams:", err.message);
      setError("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };
  const fetchSchedules = async (page = 1) => {
    try {
      setLoading(true);
      const res = await ScheduleTaskService.getAllScheduleTasks(
        page,
        pagination.limit
      );

      setSchedules(res?.data?.data || []);
      setPagination({
        total: res?.data?.total || 0,
        page: res?.data?.page || 1,
        limit: res?.data?.limit || 10,
        totalPages: res?.data?.totalPages || 1,
      });
    } catch (err) {
      console.error("Error fetching teams:", err.message);
      setError("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async (page = 1) => {
    try {
      setLoading(true);
      const res = await VehicleService.getAllVehicles();

      const allVehicles = res?.data?.data || [];
      setVehicles(allVehicles);

      const activeOnly = allVehicles.filter(
        (vehicle) => vehicle.status?.toLowerCase() === "active"
      );
      setActiveVehicles(activeOnly);
    } catch (err) {
      console.error("Error fetching vehicles:", err.message);
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };
  const getVehiclesForProject = (projectId) => {
    return vehicles.filter(
      (vehicle) => vehicle.project === projectId && vehicle.status === "Active"
    );
  };
  const getWorkersForProject = (projectId) => {
    // Step 1: Get all teams belonging to this project
    const projectTeams = teams.filter((t) => t.project === projectId);

    // Step 2: Collect all employees who belong to these teams
    const workers = activeEmployees.filter((emp) =>
      projectTeams.some((t) => t._id === emp.team_id)
    );

    // Step 3: Optionally also return schedules for the project
    const schedulesForProject = schedules.filter(
      (schedule) => schedule.project === projectId
    );

    return {
      schedules: schedulesForProject,
      totalWorkers: workers.length,
      workers, // full employee objects if you need details
    };
  };
  const getEmployeeCountForTeam = (teamId) => {
    return activeEmployees.filter((emp) => emp.team_id === teamId).length;
  };

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const res = await ProjectServiceClient.getAllProjects(
        page,
        projectPagination.limit
      );

      // Filter only active projects
      const activeProjects =
        res?.data?.projects?.filter((project) => project.status === "active") ||
        [];

      setActiveProjects(activeProjects);
      setprojectPagination({
        total: res?.data?.total || 0,
        page: res?.data?.currentPage || 1,
        limit: res?.data?.pageLimit || 10,
        totalPages: res?.data?.totalPages || 1,
      });
    } catch (err) {
      console.error("Error fetching projects:", err.message);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchSupervisor = async (page = 1) => {
    try {
      setLoading(true);
      const res = await employeeService.getAllEmployees();

      // Filter only active projects
      const supervisors =
        res?.data?.employees?.filter(
          (employee) => employee?.professionalInfo?.jobTitle === "Supervisor"
        ) || [];
      setSupervisors(supervisors);
    } catch (err) {
      console.error("Error fetching employees:", err.message);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchProjects();
    fetchTeams();
    fetchSupervisor();
    fetchSchedules();
    fetchEmployees();
  }, []);

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
  const [newTeam, setNewTeam] = useState({
    nameEn: "",
    nameAr: "",
    status: "active",
  });

  const getVehicleCountForProject = (projectId) =>
    vehicles.filter((v) => v.project === projectId && v.status === "active")
      .length;

  const getWorkerCountForTeam = (teamId) => {
    const team = teams.find((t) => t._id === teamId);
    return team?.employees?.length || 0;
  };

  const enrichSchedule = (schedule) => {
    return {
      ...schedule,
      workers: getWorkerCountForTeam(schedule.team),
      vehicles: getVehicleCountForProject(schedule.project),
    };
  };

  // Enhanced functions with better error handling and user feedback
  const handleCreateSchedule = async () => {
    if (!newSchedule.project || !newSchedule.team || !newSchedule.date) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    // Validate conflicts
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

    const vehicleCount = getVehicleCountForProject(newSchedule.project);
    const workerCount = getWorkerCountForTeam(newSchedule.team);

    const schedulePayload = {
      ...newSchedule,
      workers: workerCount,
      vehicles: vehicleCount,
      tasks: newSchedule.tasks.filter((task) => task.trim() !== ""),
      status: "Scheduled",
    };

    const payload = {
      project: newSchedule.project,
    };
    // Update last sync time
    setLastSync(new Date());

    try {
      const res = await ScheduleTaskService.createScheduleTask(schedulePayload);
      const res1 = await TeamService.updateTeam(newSchedule.team, payload);

      setLastSync(new Date());
      setShowNewSchedule(false);

      alert(
        isArabic ? "تم إنشاء الجدولة بنجاح!" : "Schedule created successfully!"
      );

      // Reset form
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

      setActiveTab("schedule");
      fetchSchedules();
    } catch (err) {
      console.error("Error creating schedule:", err);
      alert(isArabic ? "فشل في إنشاء الجدولة" : "Failed to create schedule");
    }
  };

  // handle view schedule
  const handleViewSchedule = (id) => {
    const schedule = schedules.find((s) => s._id === id);
    setViewSchedule(enrichSchedule(schedule));
  };

  // handle view schedule
  const handleEditSchedule = (id) => {
    const schedule = schedules.find((s) => s._id === id);
    setEditingSchedule(enrichSchedule(schedule));
  };

  const handleSaveSchedule = async () => {
    if (!editingSchedule) return;

    try {
      const payload = {
        project: editingSchedule.project,
        team: editingSchedule.team,
        supervisor: editingSchedule.supervisor,
        date: editingSchedule.date,
        startTime: editingSchedule.startTime,
        endTime: editingSchedule.endTime,
        location: editingSchedule.location,
        workers: editingSchedule.workers,
        vehicles: editingSchedule.vehicles,
        tasks: editingSchedule.tasks || [""],
        priority: editingSchedule.priority,
        notes: editingSchedule.notes,
        status: editingSchedule.status || "Scheduled",
      };

      const res = await ScheduleTaskService.updateScheduleTask(
        editingSchedule._id,
        payload
      );

      if (res?.status === 200) {
        fetchSchedules(pagination.page);
        setEditingSchedule(null);
      }
    } catch (err) {
      setError("Failed to edit schedule");
      console.error("Error updating schedule:", err.message);
    }
  };

  // handle view schedule
  const handleDeleteSchedule = async (id) => {
    try {
      const res = await ScheduleTaskService.deleteScheduleTask(id);
      if (res?.status === 200) {
        fetchSchedules(pagination.page);
      }
    } catch (err) {
      console.error("Error deleting schedule:", err.message);
    }
  };

  // handle add Team
  const handleAddTeam = async () => {
    if (!newTeam.nameEn || !newTeam.nameAr) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    const teamPayload = {
      nameEn: newTeam.nameEn,
      nameAr: newTeam.nameAr,
      status: newTeam.status,
    };

    try {
      const res = await TeamService.createTeam(teamPayload);

      // Update state with API response
      setTeams([...teams, res.data]);

      setNewTeam({
        nameEn: "",
        nameAr: "",
        status: "active",
      });

      setShowNewTeamModal(false);
      fetchTeams();
      alert(isArabic ? "تم إضافة الفريق بنجاح!" : "Team added successfully!");
    } catch (err) {
      console.error("Error adding teams:", err.response?.data || err);
      alert(isArabic ? "خطأ في إضافة الفرق" : "Error adding teams");
    }
  };

  const handleEditTeam = (id) => {
    const team = teams.find((i) => i._id === id);
    setEditingTeam(team);
  };

  const handleSaveTeam = async () => {
    if (!editingTeam) return;

    try {
      const payload = {
        nameEn: editingTeam.nameEn,
        nameAr: editingTeam.nameAr,
        status: editingTeam.status,
      };

      // ✅ API call with ID + payload
      const res = await TeamService.updateTeam(editingTeam._id, payload);

      if (res?.status === 200) {
        fetchTeams();
        setEditingTeam(null);
      }
    } catch (err) {
      // setError("Failed to edit invoice");
      console.error("Error updating team:", err.message);
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      const res = await TeamService.deleteTeam(id);
      if (res?.status === 200) {
        fetchTeams(pagination.page);
      }
    } catch (err) {
      console.error("Error deleting teams:", err.message);
    }
  };

  // Enhanced utility functions
  const acknowledgeAlert = (alertId) => {
    // In a real implementation, this would update the alert status
    console.log(`Alert ${alertId} acknowledged`);
    alert(isArabic ? "تم الإقرار بالتنبيه" : "Alert acknowledged");
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
  const addTaskInEdit = () => {
    setEditingSchedule({
      ...editingSchedule,
      tasks: [...editingSchedule.tasks, ""],
    });
  };

  const updateTaskInEdit = (index, value) => {
    const updatedTasks = [...editingSchedule.tasks];
    updatedTasks[index] = value;
    setEditingSchedule({
      ...editingSchedule,
      tasks: updatedTasks,
    });
  };

  const removeTaskInEdit = (index) => {
    if (editingSchedule.tasks.length > 1) {
      const updatedTasks = editingSchedule.tasks.filter((_, i) => i !== index);
      setEditingSchedule({
        ...editingSchedule,
        tasks: updatedTasks,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On Track":
      case "Completed":
      case "active":
        return "bg-green-100 text-green-800";
      case "Behind Schedule":
      case "Delayed":
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "In Progress":
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      default:
      case "inactive":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
      case "Critical":
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

  const filteredTeam = teams?.filter((team) => {
    const matchesSearch =
      team?.nameEn?.toLowerCase().includes(TeamSearchTerm.toLowerCase()) ||
      team?.nameAr?.includes(TeamSearchTerm);
    const matchesStatus =
      teamStatusFilter === "all" || team?.status === teamStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const filteredProject = activeProjects?.filter((project) => {
    const matchesSearch =
      project?.name?.toLowerCase().includes(TeamSearchTerm.toLowerCase()) ||
      project?.name?.includes(TeamSearchTerm);
    return matchesSearch;
  });
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semi-bold text-gray-900">
          {isArabic
            ? "نظرة عامة على المهام المجدولة"
            : "Scheduled Tasks Overview"}
        </h1>
        {/* <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewSchedule(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            {isArabic ? "جدولة جديدة" : "New Schedule"}
          </button>
          <button
            onClick={() => setShowNewTeamModal(!showNewTeamModal)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Target className="w-4 h-4" />
            {isArabic ? "إنشاء فريق" : "Create Team"}
          </button>
        </div> */}
      </div>

      {/* Operations Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {activeProjects.length}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "المشاريع النشطة" : "Active Projects"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {activeEmployees.length}
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "العمال النشطون" : "Active Workers"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {activeVehicles.length}
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "المركبات المستخدمة" : "Vehicles in Use"}
              </div>
            </div>
          </div>
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
              {/* Info box */}
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

              {/* Project + Team */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المشروع" : "Project"} *
                  </label>
                  <select
                    value={newSchedule.project}
                    onChange={(e) => {
                      const projectId = e.target.value;
                      // const projectVehicles = vehicles.filter(
                      //   (v) => v.project === projectId
                      // );
                      setNewSchedule({
                        ...newSchedule,
                        project: projectId,
                        // vehicles: projectVehicles.length,
                      });
                    }}
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
                    {activeProjects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {isArabic ? p.name_ar : p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الفريق" : "Team"} *
                  </label>
                  <select
                    value={newSchedule.team}
                    onChange={(e) => {
                      const teamId = e.target.value;
                      // const team = teams.find((t) => t._id === teamId);
                      setNewSchedule({
                        ...newSchedule,
                        team: teamId,
                        // workers: team?.employees?.length || 0,
                      });
                    }}
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
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>
                        {isArabic ? t.nameAr : t.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Supervisor + Date */}
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
                    {supervisors.map((s) => (
                      <option key={s.id} value={s._id}>
                        {isArabic
                          ? s.personalInfo.fullNameAr
                          : s.personalInfo.fullName}
                      </option>
                    ))}
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

              {/* Time + Priority */}
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

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الموقع" : "Location"}
                  </label>
                  <input
                    type="text"
                    value={newSchedule.location}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        location: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder={
                      isArabic ? "أدخل موقع العمل" : "Enter work location"
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "حالة" : "Status"}
                  </label>
                  <select
                    value={newSchedule.status}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        status: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In_Progress">In_Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Workers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد العمال" : "Number of Workers"}
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 text-gray-700 font-semibold"
                    value={getWorkerCountForTeam(newSchedule.team)}
                    readOnly
                  />
                </div>

                {/* Vehicles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد المركبات" : "Number of Vehicles"}
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 text-gray-700 font-semibold"
                    value={getVehiclesForProject(newSchedule.project).length}
                    readOnly
                  />
                </div>
              </div>
              {/* Tasks */}
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

              {/* Notes */}
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

              {/* Buttons */}
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
      {/* Edit Schedule Modal */}
      {editingSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إنشاء جدولة محسنة" : "Create Enhanced Schedule"}
              </h3>
              <button
                onClick={() => setEditingSchedule(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Info box */}
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

              {/* Project + Team */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المشروع" : "Project"} *
                  </label>
                  <select
                    value={editingSchedule.project}
                    onChange={(e) => {
                      const projectId = e.target.value;
                      const projectVehicles = vehicles.filter(
                        (v) => v.project === projectId
                      );
                      setEditingSchedule({
                        ...editingSchedule,
                        project: projectId,
                        vehicles: projectVehicles.length,
                      });
                    }}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      editingSchedule.project
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">
                      {isArabic ? "اختر المشروع" : "Select Project"}
                    </option>
                    {activeProjects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {isArabic ? p.name_ar : p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الفريق" : "Team"} *
                  </label>
                  <select
                    value={editingSchedule.team}
                    onChange={(e) => {
                      const teamId = e.target.value;
                      const team = teams.find((t) => t._id === teamId);
                      setEditingSchedule({
                        ...editingSchedule,
                        team: teamId,
                        workers: team?.employees?.length || 0,
                      });
                    }}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      editingSchedule.team
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">
                      {isArabic ? "اختر الفريق" : "Select Team"}
                    </option>
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>
                        {isArabic ? t.nameAr : t.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Supervisor + Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المشرف" : "Supervisor"}
                  </label>
                  <select
                    value={editingSchedule.supervisor}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        supervisor: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "اختر المشرف" : "Select Supervisor"}
                    </option>
                    {supervisors.map((s) => (
                      <option key={s.id} value={s._id}>
                        {isArabic
                          ? s.personalInfo.fullNameAr
                          : s.personalInfo.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "التاريخ" : "Date"} *
                  </label>
                  <input
                    type="date"
                    value={editingSchedule.date}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        date: e.target.value,
                      })
                    }
                    className={`w-full border rounded-lg px-3 py-2 ${
                      editingSchedule.date
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Time + Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "وقت البداية" : "Start Time"}
                  </label>
                  <input
                    type="time"
                    value={editingSchedule.startTime}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
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
                    value={editingSchedule.endTime}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
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
                    value={editingSchedule.priority}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
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

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الموقع" : "Location"}
                  </label>
                  <input
                    type="text"
                    value={editingSchedule.location}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        location: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder={
                      isArabic ? "أدخل موقع العمل" : "Enter work location"
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "حالة" : "Status"}
                  </label>
                  <select
                    value={editingSchedule.status}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        status: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In_Progress">In_Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Workers + Vehicles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد العمال" : "Number of Workers"}
                  </label>
                  <div className="w-full rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 text-gray-700 font-semibold">
                    {editingSchedule.workers || 0}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد المركبات" : "Number of Vehicles"}
                  </label>
                  <div className="w-full rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 text-gray-700 font-semibold">
                    {editingSchedule.vehicles || 0}
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {isArabic ? "المهام المطلوبة" : "Required Tasks"}
                  </label>
                  <button
                    onClick={addTaskInEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    {isArabic ? "إضافة مهمة" : "Add Task"}
                  </button>
                </div>
                <div className="space-y-2">
                  {editingSchedule.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={task}
                        onChange={(e) =>
                          updateTaskInEdit(index, e.target.value)
                        }
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        placeholder={
                          isArabic ? "وصف المهمة" : "Task description"
                        }
                      />
                      {editingSchedule.tasks.length > 1 && (
                        <button
                          onClick={() => removeTaskInEdit(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "ملاحظات إضافية" : "Additional Notes"}
                </label>
                <textarea
                  value={editingSchedule.notes}
                  onChange={(e) =>
                    setEditingSchedule({
                      ...editingSchedule,
                      notes: e.target.value,
                    })
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

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleSaveSchedule}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    editingSchedule.project &&
                    editingSchedule.team &&
                    editingSchedule.date
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={
                    !editingSchedule.project ||
                    !editingSchedule.team ||
                    !editingSchedule.date
                  }
                >
                  <Save className="w-4 h-4" />
                  {isArabic
                    ? "تحديث الجدول المعزز"
                    : "Update Enhanced Schedule"}
                </button>
                <button
                  onClick={() => setEditingSchedule(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Team Modal */}
      {showNewTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إنشاء فريق جديد" : "Create New Team"}
              </h3>
              <button
                onClick={() => setShowNewTeamModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic
                      ? "اسم الفريق (بالإنجليزية)"
                      : "Team Name (English)"}{" "}
                    *
                  </label>
                  <input
                    value={newTeam.nameEn}
                    onChange={(e) =>
                      setNewTeam({
                        ...newTeam,
                        nameEn: e.target.value,
                      })
                    }
                    className={`w-full border rounded-lg px-3 py-2 ${
                      newTeam.nameEn
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الفريق (بالعربية)" : "Team Name (Arabic)"}{" "}
                    *
                  </label>
                  <input
                    value={newTeam.nameAr}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, nameAr: e.target.value })
                    }
                    className={`w-full border rounded-lg px-3 py-2 ${
                      newTeam.nameAr
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "حالة" : "status"} *
                  </label>
                  <select
                    value={newTeam.status}
                    onChange={(e) =>
                      setNewTeam({
                        ...newTeam,
                        status: e.target.value,
                      })
                    }
                    className={`w-full border rounded-lg px-3 py-2 ${
                      newTeam.status
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">
                      {isArabic ? "اختر المشروع" : "Select Status"}
                    </option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleAddTeam}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    newTeam.nameAr && newTeam.nameEn
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={!newTeam.nameAr || !newTeam.nameEn}
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "إنشاء فريق" : "Create Team"}
                </button>
                <button
                  onClick={() => setShowNewTeamModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Team Modal */}
      {editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إنشاء فريق جديد" : "Create New Team"}
              </h3>
              <button
                onClick={() => setEditingTeam(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic
                      ? "اسم الفريق (بالإنجليزية)"
                      : "Team Name (English)"}{" "}
                    *
                  </label>
                  <input
                    value={editingTeam.nameEn}
                    onChange={(e) =>
                      setEditingTeam({
                        ...editingTeam,
                        nameEn: e.target.value,
                      })
                    }
                    className={`w-full border rounded-lg px-3 py-2 ${
                      editingTeam.nameEn
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الفريق (بالعربية)" : "Team Name (Arabic)"}{" "}
                    *
                  </label>
                  <input
                    value={editingTeam.nameAr}
                    onChange={(e) =>
                      setEditingTeam({
                        ...editingTeam,
                        nameAr: e.target.value,
                      })
                    }
                    className={`w-full border rounded-lg px-3 py-2 ${
                      editingTeam.nameAr
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "حالة" : "status"} *
                  </label>
                  <select
                    value={editingTeam.status}
                    onChange={(e) =>
                      setEditingTeam({
                        ...editingTeam,
                        status: e.target.value,
                      })
                    }
                    className={`w-full border rounded-lg px-3 py-2 ${
                      editingTeam.status
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">
                      {isArabic ? "اختر المشروع" : "Select Status"}
                    </option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleSaveTeam}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    editingTeam.nameAr && editingTeam.nameEn
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={!editingTeam.nameAr || !editingTeam.nameEn}
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "فريق التحديث" : "Update Team"}
                </button>
                <button
                  onClick={() => setEditingTeam(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* View Schedule Modal */}
      {viewSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isArabic ? "تفاصيل الجدول" : "Schedule Details"}
              </h3>
              <button
                onClick={() => setViewSchedule(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Schedule Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: isArabic ? "المشروع" : "Project",
                  value:
                    activeProjects.find(
                      (p) => p._id === viewSchedule.project
                    )?.[isArabic ? "name" : "name"] || "-",
                },
                {
                  label: isArabic ? "الفريق" : "Team",
                  value:
                    teams.find((t) => t._id === viewSchedule.team._id)?.[
                      isArabic ? "nameAr" : "nameEn"
                    ] || "-",
                },
                {
                  label: isArabic ? "المشرف" : "Supervisor",
                  value:
                    viewSchedule.supervisor.first_name +
                    viewSchedule.supervisor.last_name,
                },
                {
                  label: isArabic ? "تاريخ المجدول" : "Scheduled Date",
                  value: new Date(viewSchedule.date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  ),
                },
                {
                  label: isArabic ? "وقت البدء" : "Start Time",
                  value: viewSchedule.startTime,
                },
                {
                  label: isArabic ? "وقت الانتهاء" : "End Time",
                  value: viewSchedule.endTime,
                },
                {
                  label: isArabic ? "الموقع" : "Location",
                  value: viewSchedule.location,
                },
                {
                  label: isArabic ? "الأولوية" : "Priority",
                  value: viewSchedule.priority,
                },
                {
                  label: isArabic ? "ملاحظات" : "Notes",
                  value: viewSchedule.notes,
                },
                {
                  label: isArabic ? "المهام" : "Tasks",
                  value: viewSchedule.tasks?.length
                    ? viewSchedule.tasks.join(", ")
                    : "-",
                },
                {
                  label: isArabic ? "العمال" : "Workers",
                  value: viewSchedule.workers ? viewSchedule.workers : 0,
                },
                {
                  label: isArabic ? "المركبات" : "Vehicles",
                  value: viewSchedule.vehicles ? viewSchedule.vehicles : 0,
                },
                {
                  label: isArabic ? "تاريخ الإنشاء" : "Created At",
                  value: new Date(viewSchedule.created_at).toLocaleString(),
                },
                {
                  label: isArabic ? "تاريخ التحديث" : "Updated At",
                  value: new Date(viewSchedule.updated_at).toLocaleString(),
                },
              ].map((field, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <span className="text-sm text-gray-500 mb-1">
                    {field.label}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {field.value || "-"}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewSchedule(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
