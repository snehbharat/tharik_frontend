import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Download,
  Trash2,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  X,
} from "lucide-react";
import { MetricCard } from "./MetricCard";
import {
  EmployeeProvider,
  useEmployeeManagement,
} from "../context/EmployeeContext.jsx";
import EmployeeForm from "../components/hrms/EmployeeForm";
import { EmployeeProfileManager } from "../components/hrms/EmployeeProfileManager";

const filterEmployees = (employees, searchTerm, filters) => {
  return employees.filter((emp) => {
    const matchesSearch =
      !searchTerm ||
      emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.professionalInfo?.jobTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesNationality =
      !filters.nationality || emp.nationality === filters.nationality;
    const matchesPosition =
      !filters.position || emp.position === filters.position;
    const matchesStatus = !filters.status || emp.status === filters.status;

    return (
      matchesSearch && matchesNationality && matchesPosition && matchesStatus
    );
  });
};

const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return 999;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

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

// Error Component
const ErrorMessage = ({ error, onRetry, isArabic }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
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

// Main component content (without provider)
const EmployeeManagementContent = ({ isArabic }) => {
  // Local state for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    nationality: "",
    position: "",
    status: "",
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("list");

  // Use context for data management
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
  } = useEmployeeManagement();

  // Get employees array from response
  const employeesData = employees?.employees || [];
  const projects = []; // Add projects from context if available

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

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return filterEmployees(employeesData, searchTerm, filters);
  }, [employeesData, searchTerm, filters]);

  // Get unique values for filter dropdowns
  const uniqueNationalities = useMemo(
    () =>
      [...new Set(employeesData.map((emp) => emp.nationality))]
        .filter(Boolean)
        .sort(),
    [employeesData]
  );
  const uniquePositions = useMemo(
    () =>
      [...new Set(employeesData.map((emp) => emp.position))]
        .filter(Boolean)
        .sort(),
    [employeesData]
  );

  function formatCurrency(employee, type) {
    let amount = 0;

    const actualRate =
      parseFloat(employee?.actual_rate?.$numberDecimal) ||
      parseFloat(employee?.professionalInfo?.salaryInfo?.actual_rate?.$numberDecimal) ||
      parseFloat(employee?.actual_rate) ||
      0;

    const hourlyRate =
      parseFloat(employee?.hourly_rate?.$numberDecimal) ||
      parseFloat(employee?.professionalInfo?.salaryInfo?.hourly_rate?.$numberDecimal) ||
      parseFloat(employee?.hourly_rate) ||
      0;

    if (type === "hourly-rate") {
      amount = hourlyRate;
    } else {
      amount = actualRate;
    }

    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: employee?.salaryInfo?.currency || 'SAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  function calculateProfitMargin(employee) {
    if (!employee) throw new Error("Employee object is required.");

    const actualRate =
      parseFloat(employee.actual_rate?.$numberDecimal) ||
      parseFloat(employee.professionalInfo?.salaryInfo?.actual_rate?.$numberDecimal) ||
      parseFloat(employee.actual_rate) ||
      0;

    const hourlyRate =
      parseFloat(employee.hourly_rate?.$numberDecimal) ||
      parseFloat(employee.professionalInfo?.salaryInfo?.hourly_rate?.$numberDecimal) ||
      parseFloat(employee.hourly_rate) ||
      0;

    const profitMargin =
      actualRate > 0 ? ((actualRate - hourlyRate) / actualRate) * 100 : 0;

    return Number(profitMargin.toFixed(2));
  }

  // Event handlers
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
        if (selectedEmployee && selectedEmployee._id === employeeId) {
          setSelectedEmployee(null);
        }
        await fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
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
      throw error;
    }
  };

  const handleCloseEmployeeForm = () => {
    setShowEmployeeForm(false);
    setEditingEmployee(null);
  };

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

    event.target.value = "";
  };

  const handleRetryLoad = () => {
    fetchEmployees();
    fetchDepartments();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProjectForEmployee = (employee) => {
    if (!employee.team_id) return null;
    return projects.find((p) => p._id === employee.team_id);
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((d) => d._id === departmentId);
    return department ? department.name : "";
  };

  // Calculate statistics
  const totalEmployees = employeesData.length;
  const assignedEmployees = employeesData.filter((emp) => emp.team_id).length;
  const unassignedEmployees = totalEmployees - assignedEmployees;
  const expiringDocs = employeesData.filter(
    (emp) =>
      emp.documents &&
      emp.documents.some((doc) => getDaysUntilExpiry(doc.expiryDate) <= 30)
  ).length;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={clearSuccessMessage}
          isArabic={isArabic}
        />
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage
          error={error}
          onRetry={handleRetryLoad}
          isArabic={isArabic}
        />
      )}

      {/* Employee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title={isArabic ? "إجمالي الموظفين" : "Total Employees"}
          value={totalEmployees}
          icon={Users}
          gradient="from-blue-50 to-blue-100"
          borderColor="border-blue-200"
        />
        <MetricCard
          title={isArabic ? "موظفون مُعيَّنون" : "Assigned"}
          value={assignedEmployees}
          icon={CheckCircle}
          gradient="from-green-50 to-green-100"
          borderColor="border-green-200"
        />
        <MetricCard
          title={isArabic ? "غير مُعيَّنين" : "Unassigned"}
          value={unassignedEmployees}
          icon={Clock}
          gradient="from-yellow-50 to-yellow-100"
          borderColor="border-yellow-200"
        />
        <MetricCard
          title={isArabic ? "وثائق تنتهي قريباً" : "Expiring Documents"}
          value={expiringDocs}
          icon={AlertTriangle}
          gradient="from-red-50 to-red-100"
          borderColor="border-red-200"
        />
      </div>

      {/* Header with Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isArabic ? "إدارة الموظفين" : "Employee Management"}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleCreateEmployee}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {isArabic ? "إضافة موظف" : "Add Employee"}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "list"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {isArabic ? "قائمة الموظفين" : "Employee List"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("profiles")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "profiles"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {isArabic ? "ملفات الموظفين" : "Employee Profiles"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("lifecycle")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "lifecycle"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {isArabic ? "دورة حياة الموظف" : "Employee Lifecycle"}
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "list" && (
        <>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={
                  isArabic ? "البحث في الموظفين..." : "Search employees..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>
            <select
              value={filters.nationality}
              onChange={(e) =>
                setFilters({ ...filters, nationality: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">
                {isArabic ? "جميع الجنسيات" : "All Nationalities"}
              </option>
              {uniqueNationalities.map((nationality) => (
                <option key={nationality} value={nationality}>
                  {nationality}
                </option>
              ))}
            </select>
            <select
              value={filters.position}
              onChange={(e) => setFilters({ ...filters, position: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">
                {isArabic ? "جميع المناصب" : "All Positions"}
              </option>
              {uniquePositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">{isArabic ? "جميع الحالات" : "All Statuses"}</option>
              <option value="active">{isArabic ? "نشط" : "Active"}</option>
              <option value="inactive">{isArabic ? "غير نشط" : "Inactive"}</option>
              <option value="on-leave">{isArabic ? "في إجازة" : "On Leave"}</option>
            </select>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "الموظف" : "Employee"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "المنصب" : "Position"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "القسم" : "Department"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? 'الأجور' : 'Rates'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "المشروع" : "Profit Margin"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "المشروع" : "Project"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "تاريخ التوظيف" : "Hire Date"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "الحالة" : "Status"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "الإجراءات" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          {isArabic ? "جاري التحميل..." : "Loading..."}
                        </div>
                      </td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        {isArabic ? "لا يوجد موظفين" : "No employees found"}
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => {
                      const project = getProjectForEmployee(employee);
                      const departmentName = getDepartmentName(
                        employee.professionalInfo?.departmentId?._id
                      );
                      const expiringDocs = employee.documents
                        ? employee.documents.filter(
                          (doc) => getDaysUntilExpiry(doc.expiryDate) <= 30
                        )
                        : [];

                      return (
                        <tr key={employee._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                {employee.first_name?.charAt(0) || "E"}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {employee.first_name} {employee.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.employee_id}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.nationality}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.position}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.professionalInfo?.jobTitle}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {departmentName ||
                                employee.professionalInfo?.departmentId?.name}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm">
                              <div className="text-gray-600">{isArabic ? 'التكلفة:' : 'Cost:'} {formatCurrency(employee, "hourly-rate")}/hr</div>
                              <div className="text-green-600 font-medium">{isArabic ? 'الفوترة:' : 'Billing:'} {formatCurrency(employee.actualRate, "actual-rate")}/hr</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`text-sm font-semibold ${calculateProfitMargin(employee) > 30 ? 'text-green-600' :
                                calculateProfitMargin(employee) > 15 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                {calculateProfitMargin(employee).toFixed(1)}%
                              </div>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${calculateProfitMargin(employee) > 30 ? 'bg-green-500' :
                                    calculateProfitMargin(employee) > 15 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                  style={{ width: `${Math.min(calculateProfitMargin(employee), 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {employee?.project_id?.name ? (
                                <span className="text-green-600">
                                  {employee?.project_id?.name}
                                </span>
                              ) : (
                                <span className="text-yellow-600">
                                  {isArabic ? "غير مُعيَّن" : "Unassigned"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {employee.hire_date
                                ? new Date(employee.hire_date).toLocaleDateString()
                                : employee.professionalInfo?.hireDate
                                  ? new Date(
                                    employee.professionalInfo.hireDate
                                  ).toLocaleDateString()
                                  : "N/A"}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                  employee.status
                                )}`}
                              >
                                {employee.status || "active"}
                              </span>
                              {expiringDocs.length > 0 && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                                  {expiringDocs.length}{" "}
                                  {isArabic ? "وثيقة تنتهي" : "expiring"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewEmployee(employee)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title={isArabic ? "عرض" : "View"}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditEmployee(employee)}
                                className="text-green-600 hover:text-green-800 p-1 rounded"
                                title={isArabic ? "تعديل" : "Edit"}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(employee._id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                title={isArabic ? "حذف" : "Delete"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Employee Profiles Tab */}
      {activeTab === "profiles" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isArabic ? "ملفات الموظفين" : "Employee Profiles"}
            </h3>
            <p className="text-gray-600">
              {isArabic
                ? "عرض وإدارة ملفات تعريف الموظفين التفصيلية"
                : "View and manage detailed employee profiles"}
            </p>
          </div>

          {/* Search for profiles */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={
                  isArabic ? "البحث في الموظفين..." : "Search employees..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">
                {isArabic ? "لا يوجد موظفين" : "No employees found"}
              </div>
            ) : (
              filteredEmployees.map((employee) => {
                const departmentName = getDepartmentName(
                  employee.professionalInfo?.departmentId?._id
                );
                return (
                  <div
                    key={employee._id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-xl">
                        {employee.first_name?.charAt(0) || "E"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {employee.position}
                        </p>
                        <p className="text-xs text-gray-400">
                          {employee.employee_id}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {isArabic ? "القسم" : "Department"}:
                        </span>
                        <span className="font-medium text-gray-900">
                          {departmentName ||
                            employee.professionalInfo?.departmentId?.name ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {isArabic ? "الجنسية" : "Nationality"}:
                        </span>
                        <span className="font-medium text-gray-900">
                          {employee.nationality || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {isArabic ? "المشروع" : "Project"}:
                        </span>
                        <span
                          className={`font-medium ${
                            employee?.project_id?.name
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {employee?.project_id?.name ||
                            (isArabic ? "غير مُعيَّن" : "Unassigned")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                          employee.status
                        )}`}
                      >
                        {employee.status || "active"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewEmployee(employee)}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        {isArabic ? "عرض" : "View"}
                      </button>
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        {isArabic ? "تعديل" : "Edit"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Employee Lifecycle Tab */}
      {activeTab === "lifecycle" && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {isArabic
                ? "إدارة دورة حياة الموظف"
                : "Employee Lifecycle Management"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
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
                    {
                      employeesData.filter((emp) => {
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        const hireDate = new Date(
                          emp.professionalInfo?.hireDate
                        );
                        return hireDate >= thirtyDaysAgo && emp.status === "active";
                      }).length
                    }
                  </span>{" "}
                  {isArabic ? "موظفين في التأهيل" : "employees in onboarding"}
                </div>
              </div>

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
                    {
                      employeesData.filter((emp) => emp.status === "terminated")
                        .length
                    }
                  </span>{" "}
                  {isArabic ? "موظف في الإنهاء" : "employees in exit process"}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isArabic ? "الأنشطة الأخيرة" : "Recent Activities"}
            </h3>
            <div className="space-y-4">
              {employeesData
                .filter((emp) => emp.professionalInfo?.hireDate)
                .sort(
                  (a, b) =>
                    new Date(b.professionalInfo.hireDate) -
                    new Date(a.professionalInfo.hireDate)
                )
                .slice(0, 5)
                .map((employee) => (
                  <div
                    key={employee._id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {employee.first_name?.charAt(0) || "E"}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isArabic ? "تم التعيين في" : "Hired on"}{" "}
                        {new Date(
                          employee.professionalInfo.hireDate
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        employee.status
                      )}`}
                    >
                      {employee.status || "active"}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                {isArabic ? "إحصائيات سريعة" : "Quick Stats"}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isArabic ? "معدل الاحتفاظ" : "Retention Rate"}
                  </span>
                  <span className="font-semibold text-green-600">
                    {totalEmployees > 0
                      ? (
                          ((totalEmployees -
                            employeesData.filter(
                              (emp) => emp.status === "terminated"
                            ).length) /
                            totalEmployees) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </span>
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
                    {isArabic ? "الموظفون النشطون" : "Active Employees"}
                  </span>
                  <span className="font-semibold text-purple-600">
                    {
                      employeesData.filter((emp) => emp.status === "active")
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                {isArabic ? "التوزيع حسب الحالة" : "Status Distribution"}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isArabic ? "نشط" : "Active"}
                  </span>
                  <span className="font-semibold text-green-600">
                    {
                      employeesData.filter((emp) => emp.status === "active")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isArabic ? "في إجازة" : "On Leave"}
                  </span>
                  <span className="font-semibold text-yellow-600">
                    {
                      employeesData.filter((emp) => emp.status === "on-leave")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isArabic ? "غير نشط" : "Inactive"}
                  </span>
                  <span className="font-semibold text-red-600">
                    {
                      employeesData.filter((emp) => emp.status === "inactive")
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                {isArabic ? "التوظيف الشهري" : "Monthly Hiring"}
              </h4>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-blue-600">
                  {
                    employeesData.filter((emp) => {
                      const hireDate = new Date(
                        emp.professionalInfo?.hireDate
                      );
                      const now = new Date();
                      return (
                        hireDate.getMonth() === now.getMonth() &&
                        hireDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {isArabic ? "موظف هذا الشهر" : "employees this month"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <EmployeeProfileManager
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onEdit={() => handleEditEmployee(selectedEmployee)}
          onDelete={() => handleDeleteEmployee(selectedEmployee._id)}
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

// Main component with Provider wrapper
export const EmployeeManagement = ({ isArabic = false }) => {
  return (
    <EmployeeProvider>
      <EmployeeManagementContent isArabic={isArabic} />
    </EmployeeProvider>
  );
};

export default EmployeeManagement;