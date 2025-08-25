import React, { useState, useEffect, useMemo } from "react";
import ProjectServiceClient from "../services/ProjectServiceClient";
import ClientService from "../services/ClientService";
import {
  validateProject,
  formatCurrency,
  formatPercentage,
} from "../utils/financialCalculations";
import { Header } from "./Header";
import { NavigationTabs } from "./NavigationTabs";
import { Dashboard } from "./Dashboard";
import { ProjectList } from "./ProjectList";
import { Analytics } from "./Analytics";
import { Reports } from "./Reports";
import { EnhancedAttendanceTracker } from "./attendance/EnhancedAttendanceTracker";
import AddProjectModal from "./AddProjectModal";

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

  // Helper function to safely extract projects data from API response
  const extractProjectsData = (response) => {
    // Handle different possible response structures
    if (!response) return [];

    // If response.data is an array, return it directly
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // If response.data.projects exists, return it
    if (response.data?.projects && Array.isArray(response.data.projects)) {
      return response.data.projects;
    }

    // If response.data.data exists, return it
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // If response itself is an array, return it
    if (Array.isArray(response)) {
      return response;
    }

    // Default to empty array if no valid structure found
    console.warn("Unexpected API response structure:", response);
    return [];
  };

  // Helper function to safely extract clients data from API response
  const extractClientsData = (response) => {
    if (!response) return [];

    // Handle different possible response structures for clients
    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    if (Array.isArray(response)) {
      return response;
    }

    console.warn("Unexpected client API response structure:", response);
    return [];
  };

  // Fetch projects and clients on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [projectResponse, clientResponse] = await Promise.all([
          ProjectServiceClient.getAllProjects(1, 100),
          ClientService.getAllClients(1, 100),
        ]);

        const projectsData = extractProjectsData(projectResponse);
        const clientsData = extractClientsData(clientResponse);
        console.log("projectres:", projectsData);
        setProjects(projectsData);
        setClients(clientsData);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(isArabic ? "فشل في جلب البيانات" : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isArabic]);

  // Log projects state for debugging
  useEffect(() => {}, [projects]);

  // Refresh data function to reload projects and clients
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectResponse, clientResponse] = await Promise.all([
        ProjectServiceClient.getAllProjects(1, 100),
        ClientService.getAllClients(1, 100),
      ]);

      const projectsData = extractProjectsData(projectResponse);
      const clientsData = extractClientsData(clientResponse);

      setProjects(projectsData);
      setClients(clientsData);
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(isArabic ? "فشل في تحديث البيانات" : "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  // Filter clients based on search query
  const filteredClients = useMemo(() => {
    if (!clientSearchQuery) return clients;
    return clients.filter(
      (client) =>
        (client.client_name_eng || "")
          .toLowerCase()
          .includes(clientSearchQuery.toLowerCase()) ||
        (client.client_name_arb || "")
          .toLowerCase()
          .includes(clientSearchQuery.toLowerCase())
    );
  }, [clients, clientSearchQuery]);

  // Add attendance record (mock implementation)
  const addAttendanceRecord = async (record) => {
    setAttendance((prev) => [
      ...prev,
      { ...record, id: Math.random().toString(36).substr(2, 9) },
    ]);
  };

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const validProjects = Array.isArray(projects)
      ? projects.filter((p) => p && typeof p === "object")
      : [];
    return {
      activeProjects: validProjects.filter(
        (p) => p.status?.toLowerCase() === "active"
      ).length,
      crossProjectRevenue: validProjects.reduce(
        (sum, p) => sum + (p.budget || 0),
        0
      ),
      realTimeProfits: validProjects.reduce(
        (sum, p) => sum + ((p.budget || 0) * (p.profitMargin || 0)) / 100,
        0
      ),
      averageProfitMargin: validProjects.length
        ? validProjects.reduce((sum, p) => sum + (p.profitMargin || 0), 0) /
          validProjects.length
        : 0,
      aggregateHours: Array.isArray(attendance)
        ? attendance.reduce((sum, a) => sum + (a?.hoursWorked || 0), 0)
        : 0,
      productivityIndex:
        Array.isArray(attendance) && validProjects.length
          ? attendance.reduce((sum, a) => sum + (a?.hoursWorked || 0), 0) /
            validProjects.length
          : 0,
      utilizationRate: validProjects.length
        ? (Array.isArray(attendance)
            ? attendance.length / validProjects.length
            : 0) * 100
        : 0,
    };
  }, [projects, attendance]);

  // Calculate payroll summary
  const payrollSummary = useMemo(() => {
    const validProjects = Array.isArray(projects)
      ? projects.filter((p) => p && typeof p === "object")
      : [];
    return {
      projectCount: validProjects.length,
      totalBudget: validProjects.reduce((sum, p) => sum + (p?.budget || 0), 0),
    };
  }, [projects]);

  // Generate workforce analytics
  const workforceAnalytics = useMemo(() => {
    const validProjects = Array.isArray(projects)
      ? projects.filter((p) => p && typeof p === "object")
      : [];
    return {
      profitTrends: validProjects.map((p) => ({
        date: p.startDate,
        profit: ((p.budget || 0) * (p.profitMargin || 0)) / 100,
      })),
    };
  }, [projects]);

  // Generate actionable insights
  const actionableInsights = useMemo(
    () => [
      {
        id: "1",
        title: isArabic
          ? "تحسين تخصيص المشاريع"
          : "Optimize Project Allocation",
        description: isArabic
          ? "إعادة تخصيص الموارد لتحسين هامش الربح بنسبة 15%"
          : "Reallocate resources to improve profit margin by 15%",
        priority: "high",
      },
    ],
    [isArabic]
  );

  // Filter attendance based on selected project
  const projectAttendance = useMemo(() => {
    if (selectedProject === "all") return attendance;
    return attendance.filter((record) => record.projectId === selectedProject);
  }, [attendance, selectedProject]);

  // Get selected project data
  const selectedProjectData = useMemo(() => {
    if (selectedProject === "all") return null;
    const validProjects = Array.isArray(projects)
      ? projects.filter((p) => p && typeof p === "object")
      : [];
    return (
      validProjects.find(
        (p) => p.id === selectedProject || p._id === selectedProject
      ) || null
    );
  }, [projects, selectedProject]);

  // Handle adding a new project
  // Handle adding a new project
  const handleAddProject = async (result) => {
    // The validation and API call is now handled in the modal
    // We just need to refresh the data and close the modal
    try {
      setLoading(true);

      // Refresh data to show the newly added project
      await refreshData();

      // Reset the form
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

      // Close the modal
      setShowAddProject(false);

      // Show success message
      alert(
        isArabic ? "تم إضافة المشروع بنجاح!" : "Project added successfully!"
      );
    } catch (err) {
      console.error("Error refreshing data after project creation:", err);
      // Even if refresh fails, close the modal since the project was likely created
      setShowAddProject(false);
      setError(
        isArabic
          ? "تم إنشاء المشروع ولكن فشل في تحديث القائمة"
          : "Project created but failed to refresh list"
      );
    } finally {
      setLoading(false);
    }
  };

  // Updated handleSave in AddProjectModal component
  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setApiError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data for API
      const formattedData = formatProjectData(newProject);

      // Call API
      const result = await ProjectServiceClient.createProject(formattedData);

      // Call parent's onSave function with the result and wait for it to complete
      if (onSave) {
        await onSave(result);
      }

      // Modal will be closed by the parent component after successful refresh
    } catch (error) {
      console.error("Error creating project:", error);
      setApiError(
        error.message ||
          (isArabic
            ? "حدث خطأ أثناء حفظ المشروع"
            : "An error occurred while saving the project")
      );
    } finally {
      setIsSubmitting(false);
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
    alert(
      isArabic ? "تم تسجيل الحضور بنجاح!" : "Attendance recorded successfully!"
    );
  };

  // Handle project actions (view, edit, delete)
  const handleProjectAction = (projectId, action) => {
    switch (action) {
      case "view":
        break;
      case "edit":
        break;
      case "delete":
        if (
          window.confirm(
            isArabic
              ? "هل تريد حذف هذا المشروع؟"
              : "Are you sure you want to delete this project?"
          )
        ) {
          // Add actual delete logic here
          refreshData(); // Refresh after delete
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
          <div className="bg-red-100 text-red-800 p-4 rounded-lg border border-red-200">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-600 hover:text-red-800 font-semibold"
            >
              ×
            </button>
          </div>
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
              clients={clients}
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
            <Analytics
              projects={projects}
              isArabic={isArabic}
              loading={loading}
            />
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
          clients={clients}
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
