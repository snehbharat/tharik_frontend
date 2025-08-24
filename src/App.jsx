import React, { useState } from "react";
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
import { BilingualProvider } from "./components/BilingualLayout";
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
import EmployeeManagementHub from './components/hrms/EmployeeManagementHub.jsx';
import { NotificationDashboard } from "./components/notifications/NotificationDashboard";
import { NotificationTester } from "./components/notifications/NotificationTester";
import { PrivateEmployeeDashboard } from "./components/dashboard/PrivateEmployeeDashboard";
import { ComprehensiveAdminDashboard } from "./components/dashboard/ComprehensiveAdminDashboard";
import { IntegrationControlPanel } from "./components/integrations/IntegrationControlPanel";
import { AttendanceTracking } from "./components/attendance/AttendanceTracking";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useApiIntegration } from "./hooks/useApiIntegration";
import PermissionsPage from "./components/PermissionPage";

const AppContent = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isMockMode } = useApiIntegration();
  const [activeModule, setActiveModule] = useState("dashboard");
  const [isArabic, setIsArabic] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        const isAdmin = user?.role.level >= 8 || user?.role.id === "admin";
        if (isAdmin) {
          return <ComprehensiveAdminDashboard isArabic={isArabic} />;
        }
        const isEmployee = user?.role.id === "employee" || user?.role.level < 5;
        if (isEmployee) {
          return <PrivateEmployeeDashboard isArabic={isArabic} />;
        }
        return isArabic ? (
          <EnhancedBilingualDashboard />
        ) : (
          <Dashboard isArabic={isArabic} />
        );
      case "company":
        return <CompanyManagement isArabic={isArabic} />;
      case "manpower":
        return <ManpowerManagement isArabic={isArabic} />;
      case "fleet":
        return <FleetManagement isArabic={isArabic} />;
      case "invoices":
        return <ZATCAInvoicingSystem isArabic={isArabic} />;
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
        return <PermissionsPage isArabic={isArabic}/>;  
      default:
       
        return <Dashboard isArabic={isArabic} />;
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

      <div className="flex h-screen">
        <div
          className={`${
            sidebarCollapsed ? "w-16" : "w-64"
          } transition-all duration-300 hidden lg:block`}
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

      <div className="hidden">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          isArabic={isArabic}
          setIsArabic={setIsArabic}
        />
      </div>
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
