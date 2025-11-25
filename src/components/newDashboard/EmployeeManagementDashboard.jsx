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
import { MetricCard } from "../MetricCard.jsx";
import {
  EmployeeProvider,
  useEmployeeManagement,
} from "../../context/EmployeeContext.jsx";
import EmployeeForm from "../hrms/EmployeeForm.jsx";
import { EmployeeProfileManager } from "../hrms/EmployeeProfileManager.jsx";

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
const EmployeeManagementContentDashboard = ({ isArabic }) => {
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
      // Error is handled by context
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

    // Clear the input
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

      <h2 className="text-xl font-semibold text-gray-900">
        {isArabic ? "نظرة عامة على الموظفين" : "Employees Overview"}
      </h2>
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

      {/* Header Actions */}
      {/* <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {isArabic ? "إدارة الموظفين" : "Employee Management"}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleExportEmployees}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير" : "Export"}
          </button>

          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {isArabic ? "استيراد" : "Import"}
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImportEmployees}
              className="hidden"
            />
          </label>

          <button
            onClick={handleCreateEmployee}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "إضافة موظف" : "Add Employee"}
          </button>
        </div>
      </div> */}

      {/* Search and Filters */}
      {/* <div className="flex items-center gap-4 flex-wrap">
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
      </div> */}

      {/* Employee Table */}
      {/* <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                    colSpan="7"
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
                    colSpan="7"
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
                        <div className="text-sm text-gray-900">
                          {project ? (
                            project.name
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
                        <div className="flex flex-col gap-1">
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
      </div> */}

      {/* Employee Profile Modal */}
      {/* {selectedEmployee && (
        <EmployeeProfileManager
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onEdit={() => handleEditEmployee(selectedEmployee)}
          onDelete={() => handleDeleteEmployee(selectedEmployee._id)}
          isArabic={isArabic}
        />
      )} */}

      {/* Employee Form Modal */}
      {/* {showEmployeeForm && (
        <EmployeeForm
          employee={editingEmployee}
          departments={departments}
          onSave={handleSaveEmployee}
          onClose={handleCloseEmployeeForm}
          isArabic={isArabic}
          loading={loading}
        />
      )} */}
    </div>
  );
};

// Main component with Provider wrapper
export const EmployeeManagementDashboard = ({ isArabic = false }) => {
  return (
    <EmployeeProvider>
      <EmployeeManagementContentDashboard isArabic={isArabic} />
    </EmployeeProvider>
  );
};

export default EmployeeManagementDashboard;
