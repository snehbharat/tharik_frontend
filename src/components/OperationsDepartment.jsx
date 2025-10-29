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
  User,
} from "lucide-react";
import TeamService from "../services/TeamService";
import VehicleService from "../services/VehicleService";
import ProjectServiceClient from "../services/ProjectServiceClient";
import EmployeeService, {
  employeeService,
  getEmployees,
} from "../services/EmployeeService";
import ScheduleTaskService from "../services/ScheduleTaskService";
import UserService from "../services/UserService";
import EmployeeManagementPO from "./EmployeeManagementPO";

export const OperationsDepartment = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("projects");
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
  const [users, setUsers] = useState([]);
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
  console.log("sup", supervisors);

  const fetchUsers = async () => {
    try {
      const { data } = await UserService.getAllUsers();

      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  console.log("user", users);
  useEffect(() => {
    setSupervisors(users.filter((u) => u.role === "Project Supervisor"));
  }, [users]);

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
  console.log("schedules", schedules);

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
      console.log("res", res.data.projects);

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

  // const fetchSupervisor = async (page = 1) => {
  //   try {
  //     setLoading(true);
  //     const res = await employeeService.getAllEmployees();

  //     // Filter only active projects
  //     const supervisors =
  //       res?.data?.employees?.filter(
  //         (employee) => employee?.professionalInfo?.jobTitle === "Supervisor"
  //       ) || [];
  //     setSupervisors(supervisors);
  //   } catch (err) {
  //     console.error("Error fetching employees:", err.message);
  //     setError("Failed to load employees");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchVehicles();
    fetchProjects();
    fetchTeams();
    // fetchSupervisor();
    fetchSchedules();
    fetchEmployees();
    fetchUsers();
  }, []);
  // console.log("activeProject", activeProjects);
  // console.log("teams", teams);
  // console.log("schedules", schedules);
  // console.log("viewSchedule", viewSchedule);
  // console.log("employees", activeEmployees);
  // console.log("vehicles", vehicles);
  console.log("supervisors", supervisors);

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
  // const schedules = [
  //   {
  //     id: 1,
  //     project: "Aramco Facility Maintenance",
  //     team: "Team Alpha",
  //     supervisor: "Ahmed Al-Rashid",
  //     date: "2024-12-16",
  //     startTime: "06:00",
  //     endTime: "14:00",
  //     location: "Sector A - Maintenance Bay",
  //     workers: 15,
  //     vehicles: 4,
  //     tasks: [
  //       "Equipment inspection",
  //       "Preventive maintenance",
  //       "Safety checks",
  //     ],
  //     priority: "High",
  //     status: "Scheduled",
  //     notes: "Critical maintenance window",
  //   },
  //   {
  //     id: 2,
  //     project: "SABIC Construction Support",
  //     team: "Team Beta",
  //     supervisor: "Mohammad Hassan",
  //     date: "2024-12-16",
  //     startTime: "08:00",
  //     endTime: "16:00",
  //     location: "Construction Site B",
  //     workers: 12,
  //     vehicles: 3,
  //     tasks: ["Material handling", "Site preparation", "Quality control"],
  //     priority: "Medium",
  //     status: "In Progress",
  //     notes: "Weather dependent activities",
  //   },
  //   {
  //     id: 3,
  //     project: "NEOM Infrastructure",
  //     team: "Team Gamma",
  //     supervisor: "Ali Al-Mahmoud",
  //     date: "2024-12-17",
  //     startTime: "07:00",
  //     endTime: "15:00",
  //     location: "Infrastructure Zone C",
  //     workers: 20,
  //     vehicles: 6,
  //     tasks: ["Road construction", "Utility installation", "Site surveying"],
  //     priority: "High",
  //     status: "Scheduled",
  //     notes: "Coordination with utility companies required",
  //   },
  // ];

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

    console.log("newS", newSchedule);

    const payload = {
      project: newSchedule.project,
    };
    // Update last sync time
    setLastSync(new Date());

    try {
      const res = await ScheduleTaskService.createScheduleTask(schedulePayload);
      const res1 = await TeamService.updateTeam(newSchedule.team, payload);
      console.log("New schedule saved:", res.data);

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
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "قسم العمليات المحسن" : "Enhanced Operations Department"}
        </h1>
        <div className="flex items-center gap-3">
          {/* Connection Status Indicator */}
          {/* <div className="flex items-center gap-2">
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
          </div> */}

          {/* <button
            onClick={refreshData}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {isArabic ? "تحديث" : "Refresh"}
          </button> */}

          {/* <button
            onClick={handleGenerateComprehensiveReport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            {isArabic ? "التقرير الشامل" : "Comprehensive Report"}
          </button> */}
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
        </div>
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
          {/* <div className="flex items-center gap-1 text-xs text-blue-600">
            <TrendingUp className="w-3 h-3" />
            <span>+12% {isArabic ? "هذا الشهر" : "this month"}</span>
          </div> */}
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
          {/* <div className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="w-3 h-3" />
            <span>
              {operationMetrics.efficiency}% {isArabic ? "كفاءة" : "efficiency"}
            </span>
          </div> */}
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
          {/* <div className="flex items-center gap-1 text-xs text-purple-600">
            <Activity className="w-3 h-3" />
            <span>
              {operationMetrics.resourceUtilization}%{" "}
              {isArabic ? "استغلال" : "utilization"}
            </span>
          </div> */}
        </div>

        {/* <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
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
        </div> */}
      </div>

      {/* Enhanced Real-time Alerts System */}
      {/* <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
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
      </div> */}

      {/* Advanced Filters Panel */}
      {/* {showAdvancedFilters && (
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
      )} */}
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
              onClick={() => setActiveTab("teams")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "teams"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {isArabic ? "فرق" : "Teams"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("employee")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "employee"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {isArabic ? "الموظفون" : "Employees"}
              </div>
            </button>
            {/* <button
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
            </button> */}
            {/* <button
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
            </button> */}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* <div className="flex items-center justify-between">
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
              </div> */}
              <div className="w-full">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={TeamSearchTerm}
                    onChange={(e) => setTeamSearchTerm(e.target.value)}
                    placeholder={
                      isArabic ? "البحث في الفرق..." : "Search teams by name..."
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-6">
                {filteredProject.map((project) => {
                  const projectVehicles = getVehiclesForProject(project._id);
                  const { schedules: projectSchedule, totalWorkers } =
                    getWorkersForProject(project._id);
                  console.log("...", projectSchedule);

                  return (
                    <div
                      key={project._id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {project.client_name}
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
                          {/* <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 p-1 rounded">
                            <Edit className="w-4 h-4" />
                          </button> */}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                            {totalWorkers}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-sm text-gray-600">
                            {isArabic ? "المركبات" : "Vehicles"}
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            {projectVehicles ? projectVehicles.length : "0"}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-sm text-gray-600">
                            {isArabic ? "هامش الربح" : "Profit Margin"}
                          </div>
                          <div className="text-lg font-semibold text-blue-600">
                            {project.profitMargin ? project.profitMargin : 0}%
                          </div>
                        </div>
                        {/* <div className="bg-white rounded-lg p-3">
                          <div className="text-sm text-gray-600">
                            {isArabic ? "السلامة" : "Safety"}
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            {project.safetyScore ? project.safetyScore : "Na"}%
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-sm text-gray-600">
                            {isArabic ? "الجودة" : "Quality"}
                          </div>
                          <div className="text-lg font-semibold text-purple-600">
                            {project.qualityIndex ? project.qualityIndex : "NA"}
                            %
                          </div>
                        </div> */}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-sm text-gray-600">
                            {isArabic ? "تاريخ الإنشاء" : "Created Date"}
                          </div>
                          <div className="text-gray-900 mt-1 font-medium">
                            <span>
                              {(() => {
                                const d = new Date(project.createdAt);
                                const day = String(d.getDate()).padStart(
                                  2,
                                  "0"
                                );
                                const month = String(d.getMonth() + 1).padStart(
                                  2,
                                  "0"
                                );
                                const year = d.getFullYear();
                                return `${day}-${month}-${year}`;
                              })()}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 ">
                          <div className="text-sm text-gray-600">
                            {isArabic ? "آخر تحديث:" : "Last Update:"}
                          </div>
                          <div className="text-gray-900 mt-1 font-medium">
                            <span>
                              {(() => {
                                const d = new Date(project.updatedAt);
                                const day = String(d.getDate()).padStart(
                                  2,
                                  "0"
                                );
                                const month = String(d.getMonth() + 1).padStart(
                                  2,
                                  "0"
                                );
                                const year = d.getFullYear();
                                return `${day}-${month}-${year}`;
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced project details */}
                      {/* <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                              <span>
                                {(() => {
                                  const d = new Date(project.updatedAt);
                                  const day = String(d.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  const month = String(
                                    d.getMonth() + 1
                                  ).padStart(2, "0");
                                  const year = d.getFullYear();
                                  return `${day}-${month}-${year}`;
                                })()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              {isArabic ? "تاريخ الإنشاء" : "Created Date"}
                            </span>
                            <div className="text-gray-900 mt-1">
                              <span>
                                {(() => {
                                  const d = new Date(project.createdAt);
                                  const day = String(d.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  const month = String(
                                    d.getMonth() + 1
                                  ).padStart(2, "0");
                                  const year = d.getFullYear();
                                  return `${day}-${month}-${year}`;
                                })()}
                              </span>
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
                      </div> */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          {isArabic ? "من" : "From"} {project.startDate}{" "}
                          {isArabic ? "إلى" : "to"} {project.endDate}
                        </span>
                        <span>
                          {/* {project.spent.toLocaleString()} /{" "} */}
                          Budget: {project.budget.toLocaleString()} SAR
                          {/* (
                          {((project.spent / project.budget) * 100).toFixed(1)}%{" "}
                          {isArabic ? "مستخدم" : "used"}) */}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "teams" && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      isArabic
                        ? "البحث في الفواتير..."
                        : "Search invoices by invoice number or buyer name..."
                    }
                    value={TeamSearchTerm}
                    onChange={(e) => setTeamSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <select
                  value={teamStatusFilter}
                  onChange={(e) => setTeamStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">
                    {isArabic ? "جميع الحالات" : "All Status"}
                  </option>
                  <option value="active">{isArabic ? "نشط" : "Active"}</option>
                  <option value="inactive">
                    {isArabic ? "غير نشط" : "Inactive"}
                  </option>
                </select>
              </div>

              {/* Teams Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic
                          ? "اسم الفريق (بالإنجليزية)"
                          : "Team Name (English)"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic
                          ? "اسم الفريق (بالعربية)"
                          : "Team Name (Arabic)"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "مشروع" : "Project"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "عدد الموظفين" : "Number Of Employees"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الحالة" : "Status"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "تاريخ الإنشاء" : "Created Date"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTeam?.map((team) => (
                      <tr key={team._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">
                            {team.nameEn}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-500">
                            {team.nameAr}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">
                            {team?.project
                              ? (() => {
                                  const project = activeProjects.find(
                                    (p) => p._id === team.project
                                  );
                                  return project ? project.name : "NA";
                                })()
                              : "NA"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div className="font-medium text-gray-900">
                            {getEmployeeCountForTeam(team._id)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                              team.status
                            )}`}
                          >
                            {team.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div>
                            {team.created_at
                              ? `${new Date(team.created_at).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}`
                              : "NA"}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditTeam(team._id)}
                              className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(team._id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-center gap-4 mt-6">
                {/* Previous Button */}
                <button
                  onClick={() =>
                    fetchInvoices(Math.max(1, pagination.page - 1))
                  }
                  disabled={pagination.page <= 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    pagination.page <= 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isArabic ? "السابق" : "Previous"}
                </button>

                {/* Page Info */}
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                  {isArabic ? "صفحة" : "Page"}{" "}
                  {Number.isFinite(pagination.page) ? pagination.page : 0}{" "}
                  {isArabic ? "من" : "of"}{" "}
                  {Number.isFinite(pagination.totalPages)
                    ? pagination.totalPages
                    : 0}
                </div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    fetchInvoices(
                      Math.min(pagination.totalPages, pagination.page + 1)
                    )
                  }
                  disabled={pagination.page >= pagination.totalPages}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  pagination.page >= pagination.totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                >
                  {isArabic ? "التالي" : "Next"}
                </button>
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
                {schedules.map((schedule) => {
                  console.log("jsjs", schedule.project);

                  const scheduleVehicles = getVehiclesForProject(
                    schedule.project
                  );
                  const { schedules: projectSchedule, totalWorkers } =
                    getWorkersForProject(schedule.project);
                  console.log("...", projectSchedule);
                  return (
                    <div
                      key={schedule._id}
                      className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {schedule.team.nameEn}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {schedule?.project
                              ? (() => {
                                  const project = activeProjects.find(
                                    (p) => p._id === schedule.project
                                  );
                                  return project ? project.name : "NA";
                                })()
                              : "NA"}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>
                                {schedule?.supervisor?.first_name +
                                  schedule?.supervisor?.last_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(schedule.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewSchedule(schedule._id)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditSchedule(schedule._id)}
                              className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {/* <button className="text-purple-600 hover:text-purple-800 p-1 rounded transition-colors">
                                                    <Navigation className="w-4 h-4" />
                                                  </button> */}
                            <button
                              onClick={() => handleDeleteSchedule(schedule._id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                            {totalWorkers}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600">
                            {isArabic ? "المركبات" : "Vehicles"}
                          </div>
                          <div className="font-semibold text-gray-900">
                            {scheduleVehicles ? scheduleVehicles.length : 0}
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
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "employee" && (
            <EmployeeManagementPO isArabic={isArabic} />
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

          {/* {activeTab === "analytics" && (
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
          )} */}
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
                    {isArabic ? "المشرف" : "Supervisor"} *
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
                        {isArabic ? s.nameAr : s.nameEn}
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
                    {isArabic ? "وقت البداية" : "Start Time"} *
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
                    {isArabic ? "وقت الانتهاء" : "End Time"} *
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
                    {isArabic ? "الأولوية" : "Priority"} *
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
                    {isArabic ? "المشرف" : "Supervisor"} *
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
                    {isArabic ? "وقت البداية" : "Start Time"} *
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
                    {isArabic ? "وقت الانتهاء" : "End Time"} *
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
