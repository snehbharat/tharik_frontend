import React, { useState } from "react";
import {
  Building2,
  Users,
  User,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Eye,
  Search,
  Filter,
  Download,
  Maximize2,
  Minimize2,
} from "lucide-react";

export const OrganizationalChart = ({ departments, employees, isArabic }) => {
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [viewMode, setViewMode] = useState("tree");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleDepartment = (departmentId) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  const getDepartmentEmployees = (departmentId) => {
    return employees.filter(
      (emp) => emp?.professionalInfo?.departmentId?._id === departmentId
    );
  };

  const getManagerInfo = (managerId) => {
    return employees.find((emp) => emp.id === managerId);
  };

  const getDirectReports = (managerId) => {
    return employees.filter(
      (emp) => emp.professionalInfo.reportingStructure.reportsTo === managerId
    );
  };
  return (
    <div
      className={`space-y-6 ${
        isFullscreen ? "fixed inset-0 bg-white z-50 p-6 overflow-auto" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isArabic ? "الهيكل التنظيمي" : "Organizational Chart"}
          </h2>
          <p className="text-gray-600 mt-1">
            {isArabic
              ? "عرض شامل للهيكل التنظيمي والتسلسل الإداري"
              : "Comprehensive view of organizational structure and reporting hierarchy"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* <button
            onClick={() => setViewMode(viewMode === "tree" ? "grid" : "tree")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {viewMode === "tree" ? (
              <Building2 className="w-4 h-4" />
            ) : (
              <Users className="w-4 h-4" />
            )}
            {viewMode === "tree"
              ? isArabic
                ? "عرض الشبكة"
                : "Grid View"
              : isArabic
              ? "عرض الشجرة"
              : "Tree View"}
          </button> */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
            {isFullscreen
              ? isArabic
                ? "تصغير"
                : "Minimize"
              : isArabic
              ? "ملء الشاشة"
              : "Fullscreen"}
          </button>
          {/* <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير المخطط" : "Export Chart"}
          </button> */}
        </div>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((department) => {
          const deptEmployees = getDepartmentEmployees(department.id);
          const headOfDept = getManagerInfo(department.headOfDepartment);

          return (
            <div
              key={department.id}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {isArabic ? department.nameAr : department.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {department.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {isArabic ? "رئيس القسم:" : "Department Head:"}
                  </span>
                  <span className="font-medium text-gray-900">
                    {headOfDept
                      ? headOfDept.personalInfo.fullName
                      : isArabic
                      ? "غير محدد"
                      : "Not assigned"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {isArabic ? "عدد الموظفين:" : "Employee Count:"}
                  </span>
                  <span className="font-bold text-blue-600">
                    {deptEmployees.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {isArabic ? "الموقع:" : "Location:"}
                  </span>
                  <span className="font-medium text-gray-900">
                    {department.location}
                  </span>
                </div>
                {department.budget && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {isArabic ? "الميزانية:" : "Budget:"}
                    </span>
                    <span className="font-medium text-green-600">
                      {new Intl.NumberFormat("en-SA", {
                        style: "currency",
                        currency: "SAR",
                        notation: "compact",
                      }).format(department.budget)}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedDepartment(department.id)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {isArabic ? "عرض التفاصيل" : "View Details"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Organizational Tree/Grid View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {isArabic ? "التسلسل الهرمي" : "Reporting Hierarchy"}
          </h3>
          <div className="flex items-center gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
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
          </div>
        </div>

        {viewMode === "tree" ? (
          <div className="space-y-4">
            {departments
              .filter(
                (dept) => !selectedDepartment || dept.id === selectedDepartment
              )
              .map((department) => {
                const deptEmployees = getDepartmentEmployees(department.id);
                const isExpanded = expandedDepartments.has(department.id);

                return (
                  <div
                    key={department.id}
                    className="border border-gray-200 rounded-lg"
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleDepartment(department.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                        <Building2 className="w-6 h-6 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {isArabic ? department.nameAr : department.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {deptEmployees.length}{" "}
                            {isArabic ? "موظف" : "employees"}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {department.costCenter}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {deptEmployees.map((employee) => (
                            <div
                              key={employee.id}
                              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {employee.personalInfo.firstName.charAt(0)}
                                  {employee.personalInfo.lastName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-sm">
                                    {isArabic
                                      ? employee.personalInfo.fullNameAr
                                      : employee.personalInfo.fullName}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {employee.employeeId}
                                  </div>
                                  <div className="text-xs text-blue-600">
                                    {employee.professionalInfo.jobTitle}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 flex items-center justify-between">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                                    employee.status === "active"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : employee.status === "on-leave"
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  {employee.status}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                                    <Eye className="w-3 h-3" />
                                  </button>
                                  <button className="text-green-600 hover:text-green-800 p-1 rounded">
                                    <Edit className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Direct Reports */}
                              {employee?.professionalInfo?.reportingStructure
                                ?.directReports.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="text-xs text-gray-600 mb-2">
                                    {isArabic
                                      ? "المرؤوسون المباشرون:"
                                      : "Direct Reports:"}
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {employee?.professionalInfo?.reportingStructure?.directReports
                                      .slice(0, 3)
                                      .map((reportId, index) => {
                                        const report = employees.find(
                                          (emp) => emp.id === reportId
                                        );
                                        return report ? (
                                          <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                          >
                                            {report.personalInfo.firstName}
                                          </span>
                                        ) : null;
                                      })}
                                    {employee?.professionalInfo
                                      ?.reportingStructure?.directReports
                                      .length > 3 && (
                                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                        +
                                        {employee?.professionalInfo
                                          ?.reportingStructure?.directReports
                                          .length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {employees
              .filter(
                (emp) =>
                  !selectedDepartment ||
                  emp?.professionalInfo?.departmentId?._id ===
                    selectedDepartment
              )
              .map((employee) => {
                const department = departments.find(
                  (dept) =>
                    dept.id === employee?.professionalInfo?.departmentId?._id
                );
                const directReports = getDirectReports(employee.id);

                return (
                  <div
                    key={employee.id}
                    className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {employee.personalInfo.firstName.charAt(0)}
                        {employee.personalInfo.lastName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">
                          {isArabic
                            ? employee.personalInfo.fullNameAr
                            : employee.personalInfo.fullName}
                        </div>
                        <div className="text-xs text-gray-600">
                          {employee.employeeId}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-blue-600">
                        {employee.professionalInfo.jobTitle}
                      </div>
                      <div className="text-xs text-gray-600">
                        {isArabic ? department?.nameAr : department?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {employee.professionalInfo.workLocation}
                      </div>
                    </div>

                    {directReports.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-600 mb-2">
                          {isArabic ? "يدير" : "Manages"} {directReports.length}{" "}
                          {isArabic ? "موظف" : "employees"}
                        </div>
                        <div className="flex -space-x-2">
                          {directReports.slice(0, 3).map((report, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600"
                            >
                              {report.personalInfo.firstName.charAt(0)}
                            </div>
                          ))}
                          {directReports.length > 3 && (
                            <div className="w-6 h-6 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600">
                              +{directReports.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                          employee.status === "active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : employee.status === "on-leave"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        {employee.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                          <Eye className="w-3 h-3" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 p-1 rounded">
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Department Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isArabic ? "إحصائيات الأقسام" : "Department Statistics"}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "القسم" : "Department"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "رئيس القسم" : "Department Head"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "عدد الموظفين" : "Employee Count"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "الموقع" : "Location"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "الميزانية" : "Budget"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "الحالة" : "Status"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departments.map((department) => {
                const deptEmployees = getDepartmentEmployees(department.id);
                const headOfDept = getManagerInfo(department.headOfDepartment);

                return (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {isArabic ? department.nameAr : department.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {department.costCenter}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-gray-900">
                        {headOfDept
                          ? headOfDept.personalInfo.fullName
                          : isArabic
                          ? "غير محدد"
                          : "Not assigned"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {deptEmployees.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-900">
                      {department.location}
                    </td>
                    <td className="px-4 py-4">
                      {department.budget ? (
                        <span className="font-medium text-green-600">
                          {new Intl.NumberFormat("en-SA", {
                            style: "currency",
                            currency: "SAR",
                            notation: "compact",
                          }).format(department.budget)}
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {isArabic ? "غير محدد" : "Not set"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          department.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {department.isActive
                          ? isArabic
                            ? "نشط"
                            : "Active"
                          : isArabic
                          ? "غير نشط"
                          : "Inactive"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
