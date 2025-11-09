import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { LoginForm } from "./components/auth/LoginForm";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { SessionManager } from "./components/auth/SessionManager";
import { BilingualProvider, useBilingual } from "./components/BilingualLayout";
import { EnhancedBilingualHeader } from "./components/EnhancedBilingualHeader";
import { EnhancedBilingualSidebar } from "./components/EnhancedBilingualSidebar";
import { EnhancedBilingualDashboard } from "./components/EnhancedBilingualDashboard";
import { ConnectionStatusBanner } from "./components/common/ConnectionStatusBanner";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { CompanyManagement } from "./components/CompanyManagement";
import { ManpowerManagement } from "./components/ManpowerManagement";
import { FleetManagement } from "./components/FleetManagement";
import { InvoiceManagement } from "./components/InvoiceManagement";
import { PayrollManagement } from "./components/PayrollManagement";
import { ComplianceReporting } from "./components/ComplianceReporting";
import { OperationsDepartment } from "./components/OperationsDepartment";
import { FinanceDepartment } from "./components/FinanceDepartment";
import { HRDepartment } from "./components/HRDepartment";
import { SystemSetup } from "./components/SystemSetup";
import { UserManagement } from "./components/UserManagement";
import { WorkProgress } from "./components/WorkProgress";
import { LeadManagement } from "./components/LeadManagement";
import { TaskManagement } from "./components/TaskManagement";
import { UserAccessRoles } from "./components/UserAccessRoles";
import { ZATCAInvoicingSystem } from "./components/ZATCAInvoicingSystem";
import { HourlyRateManagement } from "./components/HourlyRateManagement";
import EmployeeManagementHub from "./components/hrms/EmployeeManagementHub.jsx";
import { NotificationDashboard } from "./components/notifications/NotificationDashboard";
import { NotificationTester } from "./components/notifications/NotificationTester";
import { PrivateEmployeeDashboard } from "./components/dashboard/PrivateEmployeeDashboard";
import { ComprehensiveAdminDashboard } from "./components/dashboard/ComprehensiveAdminDashboard";
import { IntegrationControlPanel } from "./components/integrations/IntegrationControlPanel";
import { AttendanceTracking } from "./components/attendance/AttendanceTracking";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useApiIntegration } from "./hooks/useApiIntegration";
import PermissionsPage from "./components/PermissionPage";
import ProjectServiceClient from "./services/ProjectServiceClient.js";
import ClientService from "./services/ClientService.js";
import { PaybleInvoicingSystem } from "./components/PaybleInvoicingSystem.jsx";
import { SystemSettings } from "./components/SystemSettings.jsx";
import { ManpowerManagementHR } from "./components/ManpowerManagementHR.jsx";
import { CompanyManagementClient } from "./components/CompanyManagementClient.jsx";
import { ManpowerManagementHR2 } from "./components/ManpowerManagementHR2.jsx";

const AppContent = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { language, isRTL, t } = useBilingual();
  const { isMockMode } = useApiIntegration();
  const [activeModule, setActiveModule] = useState("dashboard");
  const [isArabic, setIsArabic] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  console.log(user);

  const [projects, setProjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

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
        console.error("Error fetching initial data:", err);
        setError(isArabic ? "فشل في جلب البيانات" : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isArabic]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <p className="text-gray-600">Loading AMOAGC System...</p>
        </div>
      </div>
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        const isAdmin = user?.role === "admin" || user?.role === "HR Manager";
        console.log(isAdmin);

        if (isAdmin) {
          // return <ComprehensiveAdminDashboard isArabic={isArabic} />;
          return <Dashboard isArabic={isArabic} projects={projects} />;
        }
        const isEmployee = user?.role.id === "employee" || user?.role.level < 5;
        if (isEmployee) {
          return <PrivateEmployeeDashboard isArabic={isArabic} />;
        }
        return isArabic ? (
          <EnhancedBilingualDashboard />
        ) : (
          <Dashboard isArabic={isArabic} projects={projects} />
        );
      case "company":
        return <CompanyManagement isArabic={isArabic} />;
      case "client":
        return <CompanyManagementClient isArabic={isArabic} />;
      case "employeeManagement":
        return <ManpowerManagementHR isArabic={isArabic} />;
      case "attendanceTracking":
        return <ManpowerManagementHR2 isArabic={isArabic} />;
      case "manpower-1":
        return <ManpowerManagement isArabic={isArabic} />;
      case "fleet":
        return <FleetManagement isArabic={isArabic} />;
      case "invoices":
        return <ZATCAInvoicingSystem isArabic={isArabic} />;
      case "payable-invoices":
        return <PaybleInvoicingSystem isArabic={isArabic} />;
      case "payroll":
        return <PayrollManagement isArabic={isArabic} />;
      case "compliance":
        return <ComplianceReporting isArabic={isArabic} />;
      case "operations":
        return <OperationsDepartment isArabic={isArabic} />;
      case "finance":
        return <FinanceDepartment isArabic={isArabic} />;
      case "hr":
        return <EmployeeManagementHub isArabic={isArabic} />;
      case "system":
        return <SystemSetup isArabic={isArabic} />;
      case "users":
        return <UserManagement isArabic={isArabic} />;
      case "work-progress":
        return <WorkProgress isArabic={isArabic} />;
      case "lead-management":
        return <LeadManagement isArabic={isArabic} />;
      case "task-management":
        return <TaskManagement isArabic={isArabic} currentUser={user} />;
      case "user-access-roles":
        return <UserAccessRoles isArabic={isArabic} />;
      case "hourly-rates":
        return <HourlyRateManagement isArabic={isArabic} />;
      case "notifications":
        return <NotificationDashboard isArabic={isArabic} />;
      case "notification-tester":
        return <NotificationTester isArabic={isArabic} />;
      case "integrations":
        return <IntegrationControlPanel isArabic={isArabic} />;
      case "attendance-tracking":
        return <AttendanceTracking isArabic={isArabic} />;
      case "permissions":
        return <PermissionsPage isArabic={isArabic} />;
      case "system-settings":
        return <SystemSettings isArabic={isArabic} />;
      default:
        return <Dashboard isArabic={isArabic} projects={projects} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      <SessionManager isArabic={isArabic} />

      {isMockMode && (
        <div className="p-4">
          <ConnectionStatusBanner isArabic={isArabic} />
        </div>
      )}

      <div className={`flex h-screen ${isRTL ? "flex-row-reverse" : ""}`}>
        <div
          className={`${
            sidebarCollapsed ? "w-16" : "w-64"
          } transition-all duration-300 hidden lg:block ${
            isRTL ? "order-last" : ""
          }`}
        >
          <EnhancedBilingualSidebar
            activeModule={activeModule}
            setActiveModule={(module) => {
              setActiveModule(module);
            }}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
            <div className="w-64">
              <EnhancedBilingualSidebar
                activeModule={activeModule}
                setActiveModule={(module) => {
                  setActiveModule(module);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <EnhancedBilingualHeader
            onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          <main className="flex-1 overflow-auto p-6 backdrop-blur-sm">
            {renderActiveModule()}
          </main>
        </div>
      </div>

      {/* <div className="hidden">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          isArabic={isArabic}
          setIsArabic={setIsArabic}
        />
      </div> */}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <BilingualProvider defaultLanguage="en">
          <ErrorBoundary>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/*"
                element={
                  <main id="main-content">
                    <AppContent />
                  </main>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ErrorBoundary>
        </BilingualProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
