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
import EmployeeList from "./EmployeeList";
import EmployeeStatistics from "./EmployeeStatistics.jsx";
import EmployeeForm from "./EmployeeForm";
import { EmployeeProfileManager } from "./EmployeeProfileManager";
import { OrganizationalChart } from "./OrganizationalChart";
import { PerformanceManagement } from "./PerformanceManagement";
import { DocumentManagement } from "./DocumentManagement";
import { EmployeeAnalytics } from "./EmployeeAnalytics";

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
      id: "profiles",
      icon: UserCheck,
      label: isArabic ? "ملفات الموظفين" : "Employee Profiles",
    },
    {
      id: "organization",
      icon: Building2,
      label: isArabic ? "الهيكل التنظيمي" : "Organization",
    },
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
    {
      id: "lifecycle",
      icon: Zap,
      label: isArabic ? "دورة حياة الموظف" : "Employee Lifecycle",
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

      {/* Lifecycle Action Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            {isArabic ? "المهام المعلقة" : "Pending Tasks"}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">
                {isArabic
                  ? "استكمال ملفات التأهيل"
                  : "Complete onboarding files"}
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                3
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">
                {isArabic
                  ? "مراجعة طلبات الترقية"
                  : "Review promotion requests"}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                2
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">
                {isArabic ? "معالجة إنهاء الخدمة" : "Process exit procedures"}
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                1
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            {isArabic ? "الإجراءات السريعة" : "Quick Actions"}
          </h4>
          <div className="space-y-3">
            <button className="w-full text-left bg-green-50 hover:bg-green-100 p-3 rounded-lg border border-green-200 transition-colors">
              <div className="font-medium text-green-800">
                {isArabic
                  ? "بدء تأهيل موظف جديد"
                  : "Start New Employee Onboarding"}
              </div>
              <div className="text-xs text-green-600">
                {isArabic ? "إنشاء مهام التأهيل" : "Create onboarding tasks"}
              </div>
            </button>
            <button className="w-full text-left bg-blue-50 hover:bg-blue-100 p-3 rounded-lg border border-blue-200 transition-colors">
              <div className="font-medium text-blue-800">
                {isArabic ? "طلب ترقية" : "Promotion Request"}
              </div>
              <div className="text-xs text-blue-600">
                {isArabic
                  ? "رفع طلب ترقية جديد"
                  : "Submit new promotion request"}
              </div>
            </button>
            <button className="w-full text-left bg-red-50 hover:bg-red-100 p-3 rounded-lg border border-red-200 transition-colors">
              <div className="font-medium text-red-800">
                {isArabic ? "بدء إجراءات الإنهاء" : "Start Exit Process"}
              </div>
              <div className="text-xs text-red-600">
                {isArabic ? "إنهاء خدمة موظف" : "Initiate employee offboarding"}
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            {isArabic ? "إحصائيات سريعة" : "Quick Stats"}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {isArabic ? "معدل الاحتفاظ" : "Retention Rate"}
              </span>
              <span className="font-semibold text-green-600">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {isArabic ? "متوسط مدة التأهيل" : "Avg. Onboarding Time"}
              </span>
              <span className="font-semibold text-blue-600">
                12 {isArabic ? "يوم" : "days"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {isArabic ? "معدل الترقية السنوي" : "Annual Promotion Rate"}
              </span>
              <span className="font-semibold text-purple-600">15%</span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

// Main Hub Component (without context - will be wrapped)
const EmployeeManagementHubContent = ({ isArabic = false }) => {
  const [activeModule, setActiveModule] = useState("profiles");
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
            {isArabic ? "مركز إدارة الموظفين" : "Employee Management Hub"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isArabic
              ? "إدارة شاملة لدورة حياة الموظفين والتطوير المهني"
              : "Comprehensive employee lifecycle and professional development management"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* <button
            onClick={handleExportEmployees}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير البيانات" : "Export Data"}
          </button>

          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {isArabic ? "استيراد البيانات" : "Import Data"}
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImportEmployees}
              className="hidden"
            />
          </label> */}

          <button
            onClick={handleCreateEmployee}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "موظف جديد" : "New Employee"}
          </button>
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

          {/* {activeModule === "performance" && (
            <PerformanceManagement
              employees={employees?.employees || []}
              isArabic={isArabic}
            />
          )} */}

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
const EmployeeManagementHub = ({ isArabic = false }) => {
  return (
    <EmployeeProvider>
      <EmployeeManagementHubContent isArabic={isArabic} />
    </EmployeeProvider>
  );
};

export default EmployeeManagementHub;
