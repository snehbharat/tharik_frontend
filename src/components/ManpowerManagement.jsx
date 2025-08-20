import React, { useState, useEffect, useMemo } from "react";
import ProjectServiceClient from "../services/ProjectServiceClient";
import ClientService from "../services/ClientService";
import { validateProject, formatCurrency, formatPercentage } from "../utils/financialCalculations";
import { Header } from "./Header";
import { NavigationTabs } from "./NavigationTabs";
import { Dashboard } from "./Dashboard";
import { ProjectList } from "./ProjectList";
import { Analytics } from "./Analytics";
import { Reports } from "./Reports";
import { AddProjectModal } from "./AddProjectModal";
import { EnhancedAttendanceTracker } from "./attendance/EnhancedAttendanceTracker";

export const ManpowerManagement = ({ isArabic }) => {
  // State for projects, attendance, clients, and UI controls
  const [projects, setProjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState("all");
  const [showAddProject, setShowAddProject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for new project form
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

  // State for attendance form
  const [attendanceForm, setAttendanceForm] = useState({
    projectId: "",
    date: new Date().toISOString().split("T")[0],
    hoursWorked: 8,
    notes: "",
  });

  // Fetch projects and clients on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectResponse, clientResponse] = await Promise.all([
          ProjectServiceClient.getAllProjects(1, 100),
          ClientService.getAllClients(1, 100),
        ]);
        const projectsData = projectResponse?.data || [];
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setClients(clientResponse.data?.data || clientResponse.data || []);
      } catch (err) {
        setError(isArabic ? "فشل في جلب البيانات" : "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isArabic]);

  // Log projects state for debugging
  useEffect(() => {
    console.log("Projects State Updated:", projects);
  }, [projects]);

  // Refresh data function to reload projects and clients
  const refreshData = async () => {
    setLoading(true);
    try {
      const [projectResponse, clientResponse] = await Promise.all([
        ProjectServiceClient.getAllProjects(1, 100),
        ClientService.getAllClients(1, 100),
      ]);
      const projectsData = projectResponse?.data || [];
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setClients(clientResponse.data?.data || clientResponse.data || []);
    } catch (err) {
      setError(isArabic ? "فشل في جلب البيانات" : "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter clients based on search query
  const filteredClients = useMemo(() => {
    if (!clientSearchQuery) return clients;
    return clients.filter((client) =>
      (client.client_name_eng || "").toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      (client.client_name_arb || "").toLowerCase().includes(clientSearchQuery.toLowerCase())
    );
  }, [clients, clientSearchQuery]);

  // Add attendance record (mock implementation)
  const addAttendanceRecord = async (record) => {
    setAttendance((prev) => [...prev, { ...record, id: Math.random().toString(36).substr(2, 9) }]);
  };

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const validProjects = Array.isArray(projects) ? projects.filter(p => p && typeof p === 'object') : [];
    return {
      activeProjects: validProjects.filter((p) => p.status?.toLowerCase() === "active").length,
      crossProjectRevenue: validProjects.reduce((sum, p) => sum + (p.budget || 0), 0),
      realTimeProfits: validProjects.reduce((sum, p) => sum + ((p.budget || 0) * (p.profitMargin || 0) / 100), 0),
      averageProfitMargin: validProjects.length
        ? validProjects.reduce((sum, p) => sum + (p.profitMargin || 0), 0) / validProjects.length
        : 0,
      aggregateHours: Array.isArray(attendance)
        ? attendance.reduce((sum, a) => sum + (a?.hoursWorked || 0), 0)
        : 0,
      productivityIndex: Array.isArray(attendance) && validProjects.length
        ? attendance.reduce((sum, a) => sum + (a?.hoursWorked || 0), 0) / validProjects.length
        : 0,
      utilizationRate: validProjects.length
        ? (Array.isArray(attendance) ? attendance.length / validProjects.length : 0) * 100
        : 0,
    };
  }, [projects, attendance]);

  // Calculate payroll summary
  const payrollSummary = useMemo(() => {
    const validProjects = Array.isArray(projects) ? projects.filter(p => p && typeof p === 'object') : [];
    return {
      projectCount: validProjects.length,
      totalBudget: validProjects.reduce((sum, p) => sum + (p?.budget || 0), 0),
    };
  }, [projects]);

  // Generate workforce analytics
  const workforceAnalytics = useMemo(() => {
    const validProjects = Array.isArray(projects) ? projects.filter(p => p && typeof p === 'object') : [];
    return {
      profitTrends: validProjects.map((p) => ({
        date: p.startDate,
        profit: (p.budget || 0) * (p.profitMargin || 0) / 100,
      })),
    };
  }, [projects]);

  // Generate actionable insights
  const actionableInsights = useMemo(() => [
    {
      id: "1",
      title: isArabic ? "تحسين تخصيص المشاريع" : "Optimize Project Allocation",
      description: isArabic
        ? "إعادة تخصيص الموارد لتحسين هامش الربح بنسبة 15%"
        : "Reallocate resources to improve profit margin by 15%",
      priority: "high",
    },
  ], [isArabic]);

  // Filter attendance based on selected project
  const projectAttendance = useMemo(() => {
    if (selectedProject === "all") return attendance;
    return attendance.filter((record) => record.projectId === selectedProject);
  }, [attendance, selectedProject]);

  // Get selected project data
  const selectedProjectData = useMemo(() => {
    if (selectedProject === "all") return null;
    const validProjects = Array.isArray(projects) ? projects.filter(p => p && typeof p === 'object') : [];
    return validProjects.find((p) => p.id === selectedProject) || null;
  }, [projects, selectedProject]);

  // Handle adding a new project
  const handleAddProject = async () => {
    const validation = validateProject(newProject);
    if (!validation.valid) {
      alert(validation.errors.join("\n"));
      return;
    }

    setLoading(true);
    try {
      await ProjectServiceClient.createProject(newProject);
      await refreshData();
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
    } catch (err) {
      console.error("Error adding project:", err);
      setError(isArabic ? "فشل في إضافة المشروع" : "Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding attendance record
  const handleAddAttendance = () => {
    if (!attendanceForm.projectId) {
      alert(isArabic ? "يرجى اختيار المشروع" : "Please select project");
      return;
    }

    addAttendanceRecord({
      projectId: attendanceForm.projectId,
      date: attendanceForm.date,
      hoursWorked: attendanceForm.hoursWorked,
      notes: attendanceForm.notes,
    });

    setAttendanceForm({
      projectId: "",
      date: new Date().toISOString().split("T")[0],
      hoursWorked: 8,
      notes: "",
    });
    alert(isArabic ? "تم تسجيل الحضور بنجاح!" : "Attendance recorded successfully!");
  };

  // Handle project actions (view, edit, delete)
  const handleProjectAction = (projectId, action) => {
    console.log(`Project ${projectId} action: ${action}`);
    switch (action) {
      case "view":
        console.log("Viewing project:", projectId);
        break;
      case "edit":
        console.log("Editing project:", projectId);
        break;
      case "delete":
        if (window.confirm(isArabic ? "هل تريد حذف هذا المشروع؟" : "Are you sure you want to delete this project?")) {
          console.log("Deleting project:", projectId);
        }
        break;
      default:
        break;
    }
  };

  // Determine status color for projects
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
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
        {/* Error display */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>
        )}
        {/* Header component */}
        <Header
          isArabic={isArabic}
          onRefresh={refreshData}
          onExport={() => {}}
          onAddProject={() => setShowAddProject(true)}
        />
        {/* Navigation tabs */}
        <NavigationTabs
          activeView={activeView}
          setActiveView={setActiveView}
          isArabic={isArabic}
          payrollSummary={payrollSummary}
        />
        {/* Main content area */}
        <div className="p-6">
          {activeView === "dashboard" && (
            <Dashboard
              isArabic={isArabic}
              projects={projects}
              attendance={attendance}
              selectedProjectData={selectedProjectData}
              projectAttendance={projectAttendance}
              dashboardMetrics={dashboardMetrics}
              workforceAnalytics={workforceAnalytics}
              actionableInsights={actionableInsights}
              loading={loading}
              onSelectProject={setSelectedProject}
            />
          )}
          {activeView === "projects" && (
            <ProjectList
              projects={projects}
              attendance={attendance}
              isArabic={isArabic}
              loading={loading}
              onAddProject={() => setShowAddProject(true)}
              onProjectAction={handleProjectAction}
              getStatusColor={getStatusColor}
            />
          )}
          {activeView === "attendance" && (
            <EnhancedAttendanceTracker
              isArabic={isArabic}
              projects={projects}
              onAddAttendance={handleAddAttendance}
              attendanceForm={attendanceForm}
              setAttendanceForm={setAttendanceForm}
            />
          )}
          {activeView === "analytics" && (
            <Analytics projects={projects} isArabic={isArabic} loading={loading} />
          )}
          {activeView === "reports" && (
            <Reports dashboardMetrics={dashboardMetrics} isArabic={isArabic} />
          )}
        </div>
      </div>
      {/* Add project modal */}
      {showAddProject && (
        <AddProjectModal
          isArabic={isArabic}
          newProject={newProject}
          setNewProject={setNewProject}
          onSave={handleAddProject}
          onClose={() => setShowAddProject(false)}
          loading={loading}
        />
      )}
    </>
  );
};