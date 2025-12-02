import React, { useState, useEffect } from "react";
import {
  Download,
  Upload,
  Plus,
  UserCheck,
  Building2,
  Target,
  FileText,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";

// Import context and components
import {
  EmployeeProvider,
  useEmployeeManagement,
} from "../../context/EmployeeContext.jsx";
import { OrganizationalChart } from "./OrganizationalChart";
import { PerformanceManagement } from "./PerformanceManagement";
import { DocumentManagement } from "./DocumentManagement";
import { EmployeeAnalytics } from "./EmployeeAnalytics";
import { DepartmentModule } from "../Department.jsx";

// Loading Component
const LoadingSpinner = ({ isArabic }) => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">
      {isArabic ? "جاري التحميل..." : "Loading..."}
    </span>
  </div>
);

// Error Component
const ErrorMessage = ({ error, onRetry, isArabic }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-center gap-3 mb-2">
      <AlertTriangle className="w-5 h-5 text-red-600" />
      <h3 className="text-lg font-semibold text-red-800">
        {isArabic ? "خطأ في تحميل البيانات" : "Error Loading Data"}
      </h3>
    </div>
    <p className="text-red-700 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      {isArabic ? "إعادة المحاولة" : "Retry"}
    </button>
  </div>
);

// Success Message Component
const SuccessMessage = ({ message, onClose, isArabic }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className="text-green-800">{message}</span>
      </div>
      <button onClick={onClose} className="text-green-600 hover:text-green-800">
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Module Navigation Component
const ModuleNavigation = ({ activeModule, setActiveModule, isArabic }) => {
  const modules = [
    {
      id: "organization",
      icon: Building2,
      label: isArabic ? "الهيكل التنظيمي" : "Organization",
    },
    {
      id: "departments",
      icon: Building2,
      label: isArabic ? "الأقسام" : "Departments",
    },
    // {
    //   id: "analytics",
    //   icon: BarChart3,
    //   label: isArabic ? "التحليلات" : "Analytics",
    // },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex overflow-x-auto">
        {modules.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveModule(id)}
            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeModule === id
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {label}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

// Department Management Component
const DepartmentManagement = ({ isArabic, departments, employees }) => {
  // Calculate department statistics
  const getDepartmentStats = (departmentId) => {
    const deptEmployees = employees.filter(
      (emp) => emp.professionalInfo?.departmentId?._id === departmentId
    );
    return {
      total: deptEmployees.length,
      active: deptEmployees.filter((emp) => emp.status === "active").length,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {isArabic ? "إدارة الأقسام" : "Department Management"}
        </h3>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          {isArabic ? "قسم جديد" : "New Department"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const stats = getDepartmentStats(dept._id);
          return (
            <div
              key={dept._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                  <p className="text-sm text-gray-500">{dept.code}</p>
                </div>
              </div>

              {dept.description && (
                <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isArabic ? "إجمالي الموظفين" : "Total Employees"}
                  </span>
                  <span className="font-semibold text-blue-600">
                    {stats.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isArabic ? "الموظفون النشطون" : "Active Employees"}
                  </span>
                  <span className="font-semibold text-green-600">
                    {stats.active}
                  </span>
                </div>
              </div>
              {/* 
              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button className="flex-1 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  {isArabic ? "عرض" : "View"}
                </button>
                <button className="flex-1 text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  {isArabic ? "تعديل" : "Edit"}
                </button>
              </div> */}
            </div>
          );
        })}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            {isArabic ? "لا توجد أقسام" : "No departments found"}
          </p>
        </div>
      )}
    </div>
  );
};

// Main Hub Component (without context - will be wrapped)
const EmployeeManagementHubContent = ({ isArabic = false }) => {
  const [activeModule, setActiveModule] = useState("organization");

  // Use the context
  const {
    employees,
    departments,
    loading,
    error,
    successMessage,
    fetchEmployees,
    fetchDepartments,
    clearSuccessMessage,
    setError,
  } = useEmployeeManagement();

  // Load initial data
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  // Auto-clear success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  const handleRetryLoad = () => {
    fetchEmployees();
    fetchDepartments();
  };

  // Loading state
  if (loading && departments.length === 0) {
    return (
      <div className="p-6">
        <LoadingSpinner isArabic={isArabic} />
      </div>
    );
  }

  // Error state (only if no data loaded)
  if (error && departments.length === 0) {
    return (
      <div className="p-6">
        <ErrorMessage
          error={error}
          onRetry={handleRetryLoad}
          isArabic={isArabic}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Success Message */}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={clearSuccessMessage}
          isArabic={isArabic}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic ? "مركز إدارة المؤسسة" : "Organization Management Hub"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isArabic
              ? "إدارة الهيكل التنظيمي والأقسام"
              : "Manage organizational structure and departments"}
          </p>
        </div>
      </div>

      {/* Module Navigation and Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <ModuleNavigation
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          isArabic={isArabic}
        />

        <div className="p-6">
          {activeModule === "organization" && (
            <OrganizationalChart
              departments={departments}
              employees={employees?.employees || []}
              isArabic={isArabic}
            />
          )}

          {/* {activeModule === "departments" && (
            <DepartmentManagement
              isArabic={isArabic}
              departments={departments}
              employees={employees?.employees || []}
            />
          )} */}

          {activeModule === "departments" && (
            <DepartmentModule isArabic={isArabic} />
          )}

          {activeModule === "analytics" && (
            <EmployeeAnalytics
              employees={employees?.employees || []}
              departments={departments}
              isArabic={isArabic}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Main exported component with Provider
const EmployeeManagementHub = ({ isArabic = false }) => {
  return (
    <EmployeeProvider>
      <EmployeeManagementHubContent isArabic={isArabic} />
    </EmployeeProvider>
  );
};

export default EmployeeManagementHub;
