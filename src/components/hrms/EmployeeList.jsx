import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Users,
  Eye,
  Edit,
  FileText,
  Building2,
  MapPin,
  Calendar,
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
} from "lucide-react";

const EmployeeCard = ({
  employee,
  departments,
  isArabic,
  onViewEmployee,
  onEditEmployee,
  onViewDocuments,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "terminated":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department
      ? isArabic
        ? department.nameAr
        : department.name
      : "Unknown";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Employee Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            {employee.photo ? (
              <img
                src={employee.photo}
                alt={employee.personalInfo?.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {employee.personalInfo?.firstName?.charAt(0)}
                {employee.personalInfo?.lastName?.charAt(0)}
              </div>
            )}
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                employee.status === "active"
                  ? "bg-green-500"
                  : employee.status === "on-leave"
                  ? "bg-yellow-500"
                  : employee.status === "inactive"
                  ? "bg-red-500"
                  : "bg-gray-500"
              }`}
            ></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {isArabic
                ? employee.personalInfo?.fullNameAr
                : employee.personalInfo?.fullName}
            </h3>
            <p className="text-sm text-gray-600">{employee.employeeId}</p>
            <p className="text-sm text-blue-600">
              {employee.professionalInfo?.jobTitle}
            </p>
          </div>
        </div>

        {/* Employee Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4" />
            <span>
              {getDepartmentName(employee.professionalInfo?.departmentId)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{employee.professionalInfo?.workLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {isArabic ? "تاريخ التوظيف:" : "Hired:"}{" "}
              {employee.professionalInfo?.hireDate
                ? new Date(
                    employee.professionalInfo.hireDate
                  ).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">
              {employee.professionalInfo?.workEmail}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4 flex items-center justify-between">
          <span
            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
              employee.status
            )}`}
          >
            {employee.status}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewEmployee(employee)}
              className="text-blue-600 hover:text-blue-800 p-1 rounded"
              title={isArabic ? "عرض الملف" : "View Profile"}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEditEmployee(employee)}
              className="text-green-600 hover:text-green-800 p-1 rounded"
              title={isArabic ? "تعديل" : "Edit"}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewDocuments(employee)}
              className="text-purple-600 hover:text-purple-800 p-1 rounded"
              title={isArabic ? "الوثائق" : "Documents"}
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchAndFilters = ({
  filters,
  onFiltersChange,
  departments,
  isArabic,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  onClearFilters,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={
              isArabic ? "البحث في الموظفين..." : "Search employees..."
            }
            value={filters.searchTerm || ""}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <select
          value={filters.department || ""}
          onChange={(e) => onFiltersChange({ department: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">
            {isArabic ? "جميع الأقسام" : "All Departments"}
          </option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {isArabic ? dept.nameAr : dept.name}
            </option>
          ))}
        </select>
        <select
          value={filters.status || ""}
          onChange={(e) => onFiltersChange({ status: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">{isArabic ? "جميع الحالات" : "All Status"}</option>
          <option value="active">{isArabic ? "نشط" : "Active"}</option>
          <option value="inactive">{isArabic ? "غير نشط" : "Inactive"}</option>
          <option value="on-leave">{isArabic ? "في إجازة" : "On Leave"}</option>
          <option value="terminated">
            {isArabic ? "منتهي الخدمة" : "Terminated"}
          </option>
        </select>
        <button
          onClick={onToggleAdvancedFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Filter className="w-4 h-4" />
          {isArabic ? "تصفية متقدمة" : "Advanced Filters"}
        </button>
      </div>

      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "المسمى الوظيفي" : "Job Title"}
            </label>
            <input
              type="text"
              value={filters.jobTitle || ""}
              onChange={(e) => onFiltersChange({ jobTitle: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder={
                isArabic ? "البحث بالمسمى الوظيفي" : "Search by job title"
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "موقع العمل" : "Work Location"}
            </label>
            <input
              type="text"
              value={filters.location || ""}
              onChange={(e) => onFiltersChange({ location: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder={
                isArabic ? "البحث بموقع العمل" : "Search by location"
              }
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={onClearFilters}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              {isArabic ? "مسح الفلاتر" : "Clear Filters"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeeList = ({
  employees,
  departments,
  isArabic,
  loading,
  error,
  onViewEmployee,
  onEditEmployee,
  onViewDocuments,
}) => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    department: "",
    status: "",
    jobTitle: "",
    location: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        !filters.searchTerm ||
        employee.personalInfo?.fullName
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        employee.employeeId
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        employee.professionalInfo?.jobTitle
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesDepartment =
        !filters.department ||
        employee.professionalInfo?.departmentId === filters.department;

      const matchesStatus =
        !filters.status || employee.status === filters.status;

      const matchesJobTitle =
        !filters.jobTitle ||
        employee.professionalInfo?.jobTitle
          ?.toLowerCase()
          .includes(filters.jobTitle.toLowerCase());

      const matchesLocation =
        !filters.location ||
        employee.professionalInfo?.workLocation
          ?.toLowerCase()
          .includes(filters.location.toLowerCase());

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesJobTitle &&
        matchesLocation
      );
    });
  }, [employees, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      department: "",
      status: "",
      jobTitle: "",
      location: "",
    });
  };

  const handleToggleAdvancedFilters = () => {
    setShowAdvancedFilters((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          {isArabic ? "جاري التحميل..." : "Loading..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">
            {isArabic ? "خطأ في تحميل البيانات" : "Error Loading Data"}
          </h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isArabic ? "إعادة المحاولة" : "Retry"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchAndFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        departments={departments}
        isArabic={isArabic}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={handleToggleAdvancedFilters}
        onClearFilters={handleClearFilters}
      />

      <div className="text-sm text-gray-600">
        {isArabic ? "عرض" : "Showing"} {filteredEmployees.length}{" "}
        {isArabic ? "من" : "of"} {employees.length}{" "}
        {isArabic ? "موظف" : "employees"}
      </div>

      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              departments={departments}
              isArabic={isArabic}
              onViewEmployee={onViewEmployee}
              onEditEmployee={onEditEmployee}
              onViewDocuments={onViewDocuments}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {isArabic ? "لا توجد نتائج" : "No employees found"}
          </p>
          <p className="text-gray-400 text-sm">
            {isArabic
              ? "جرب تعديل معايير البحث"
              : "Try adjusting your search criteria"}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
