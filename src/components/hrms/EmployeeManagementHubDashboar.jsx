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
import EmployeeList from "./EmployeeList.jsx";
import EmployeeStatistics from "./EmployeeStatistics.jsx";
import EmployeeForm from "./EmployeeForm.jsx";
import { EmployeeProfileManager } from "./EmployeeProfileManager.jsx";
import { OrganizationalChart } from "./OrganizationalChart.jsx";
import { PerformanceManagement } from "./PerformanceManagement.jsx";
import { DocumentManagement } from "./DocumentManagement.jsx";
import { EmployeeAnalytics } from "./EmployeeAnalytics.jsx";

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
      id: "lifecycle",
      icon: Zap,
      label: isArabic ? "دورة حياة الموظف" : "Employee Lifecycle",
    },
    // {
    //   id: "profiles",
    //   icon: UserCheck,
    //   label: isArabic ? "ملفات الموظفين" : "Employee Profiles",
    // },
    // {
    //   id: "organization",
    //   icon: Building2,
    //   label: isArabic ? "الهيكل التنظيمي" : "Organization",
    // },
    // {
    //   id: "performance",
    //   icon: Target,
    //   label: isArabic ? "الأداء والتطوير" : "Performance & Development",
    // },
    // {
    //   id: "documents",
    //   icon: FileText,
    //   label: isArabic ? "إدارة الوثائق" : "Document Management",
    // },

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
            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeModule === id
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

// Lifecycle Management Component
const LifecycleManagement = ({ isArabic, employees }) => {
  // Calculate lifecycle stats
  const getLifecycleStats = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const onboarding =
      employees?.filter((emp) => {
        const hireDate = new Date(emp.professionalInfo?.hireDate);
        return hireDate >= thirtyDaysAgo && emp.status === "active";
      }).length || 0;

    const pendingPromotions = 2; // This would come from your performance data
    const exitProcess =
      employees?.filter((emp) => emp.status === "terminated").length || 0;

    return { onboarding, pendingPromotions, exitProcess };
  };

  const stats = getLifecycleStats();

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          {isArabic
            ? "إدارة دورة حياة الموظف"
            : "Employee Lifecycle Management"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {isArabic ? "التأهيل" : "Onboarding"}
                </h4>
                <p className="text-sm text-gray-600">
                  {isArabic
                    ? "عملية تأهيل الموظفين الجدد"
                    : "New employee orientation process"}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-lg text-green-600">
                {stats.onboarding}
              </span>{" "}
              {isArabic ? "موظفين في التأهيل" : "employees in onboarding"}
            </div>
          </div>

          {/* <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {isArabic ? "النقل والترقية" : "Transfers & Promotions"}
                </h4>
                <p className="text-sm text-gray-600">
                  {isArabic
                    ? "إدارة التنقلات والترقيات"
                    : "Position changes and career advancement"}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-lg text-blue-600">
                {stats.pendingPromotions}
              </span>{" "}
              {isArabic ? "طلب ترقية معلق" : "pending promotion requests"}
            </div>
          </div> */}

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {isArabic ? "إنهاء الخدمة" : "Offboarding"}
                </h4>
                <p className="text-sm text-gray-600">
                  {isArabic
                    ? "عملية إنهاء خدمة الموظفين"
                    : "Employee exit process management"}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-lg text-red-600">
                {stats.exitProcess}
              </span>{" "}
              {isArabic ? "موظف في الإنهاء" : "employee in exit process"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Hub Component (without context - will be wrapped)
const EmployeeManagementHubContent = ({ isArabic = false }) => {
  const [activeModule, setActiveModule] = useState("lifecycle");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Use the context
  const {
    employees,
    departments,
    loading,
    error,
    successMessage,
    fetchEmployees,
    fetchDepartments,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    exportEmployees,
    importEmployees,
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

  // Event handlers
  const handleExportEmployees = async () => {
    try {
      await exportEmployees("csv", {});
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleImportEmployees = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await importEmployees(file);
    } catch (error) {
      console.error("Import error:", error);
    }

    // Clear the input
    event.target.value = "";
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleViewDocuments = (employee) => {
    setSelectedEmployee(employee);
    setActiveModule("documents");
  };

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setShowEmployeeForm(true);
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee._id, employeeData);
      } else {
        await createEmployee(employeeData);
      }
      setShowEmployeeForm(false);
      setEditingEmployee(null);
    } catch (error) {
      // Error is handled by context
      throw error;
    }
  };

  const handleCloseEmployeeForm = () => {
    setShowEmployeeForm(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (
      window.confirm(
        isArabic
          ? "هل أنت متأكد من حذف هذا الموظف؟"
          : "Are you sure you want to delete this employee?"
      )
    ) {
      try {
        await deleteEmployee(employeeId);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleRetryLoad = () => {
    fetchEmployees();
    fetchDepartments();
  };

  // Loading state
  if (loading && employees.length === 0) {
    return (
      <div className="p-6">
        <LoadingSpinner isArabic={isArabic} />
      </div>
    );
  }

  // Error state (only if no data loaded)
  if (error && employees.length === 0) {
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
            {isArabic
              ? "نظرة عامة على الموارد البشرية"
              : "Human Resource Overview"}
          </h1>
        </div>
      </div>

      {/* Employee Statistics Dashboard */}
      <EmployeeStatistics
        employees={employees?.employees || []}
        isArabic={isArabic}
        loading={loading}
      />

      {/* Module Navigation and Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <ModuleNavigation
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          isArabic={isArabic}
        />

        <div className="p-6">
          {activeModule === "profiles" && (
            <EmployeeList
              employees={employees?.employees || []}
              departments={departments}
              isArabic={isArabic}
              loading={loading}
              error={error}
              onViewEmployee={handleViewEmployee}
              onEditEmployee={handleEditEmployee}
              onViewDocuments={handleViewDocuments}
            />
          )}

          {activeModule === "organization" && (
            <OrganizationalChart
              departments={departments}
              employees={employees?.employees || []}
              isArabic={isArabic}
            />
          )}

          {activeModule === "documents" && (
            <DocumentManagement
              employees={employees?.employees || []}
              selectedEmployee={selectedEmployee}
              isArabic={isArabic}
            />
          )}

          {activeModule === "lifecycle" && (
            <LifecycleManagement
              isArabic={isArabic}
              employees={employees?.employees || []}
            />
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

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <EmployeeProfileManager
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onEdit={() => handleEditEmployee(selectedEmployee)}
          onDelete={() => handleDeleteEmployee(selectedEmployee.id)}
          isArabic={isArabic}
        />
      )}

      {/* Employee Form Modal */}
      {showEmployeeForm && (
        <EmployeeForm
          employee={editingEmployee}
          departments={departments}
          onSave={handleSaveEmployee}
          onClose={handleCloseEmployeeForm}
          isArabic={isArabic}
          loading={loading}
        />
      )}
    </div>
  );
};

// Main exported component with Provider
const EmployeeManagementHubDashboard = ({ isArabic = false }) => {
  return (
    <EmployeeProvider>
      <EmployeeManagementHubContent isArabic={isArabic} />
    </EmployeeProvider>
  );
};

export default EmployeeManagementHubDashboard;
