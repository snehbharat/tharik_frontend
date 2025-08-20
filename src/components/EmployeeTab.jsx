import React, { useState, useMemo } from "react";
import { Search, Filter, FileText, Building2, Mail, Phone, AlertTriangle, Eye, Edit } from "lucide-react";

const EmployeeTab = ({ employees, setEmployees, isArabic, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        !searchTerm ||
        employee.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.nameAr?.includes(searchTerm) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment =
        filterDepartment === "all" || employee.department === filterDepartment;
      
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && employee.gosiStatus === "Active") ||
        (filterStatus === "needs_training" && employee.trainingStatus === "Needs Update");
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, filterDepartment, filterStatus]);

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Good": return "bg-blue-100 text-blue-800";
      case "Average": return "bg-yellow-100 text-yellow-800";
      case "Needs Improvement": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isIqamaExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysToExpiry <= 90;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isArabic ? "البحث في الموظفين..." : "Search employees..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">{isArabic ? "جميع الأقسام" : "All Departments"}</option>
            <option value="Operations">{isArabic ? "العمليات" : "Operations"}</option>
            <option value="Human Resources">{isArabic ? "الموارد البشرية" : "Human Resources"}</option>
            <option value="Finance">{isArabic ? "المالية" : "Finance"}</option>
            <option value="Maintenance">{isArabic ? "الصيانة" : "Maintenance"}</option>
            <option value="Safety">{isArabic ? "السلامة" : "Safety"}</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">{isArabic ? "جميع الحالات" : "All Status"}</option>
            <option value="active">{isArabic ? "نشط" : "Active"}</option>
            <option value="needs_training">{isArabic ? "يحتاج تدريب" : "Needs Training"}</option>
          </select>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              <Building2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {isArabic ? "عرض" : "Showing"} {filteredEmployees.length} {isArabic ? "من" : "of"} {employees.length} {isArabic ? "موظف" : "employees"}
        </div>
      </div>

      {/* Employee List/Grid */}
      {viewMode === "list" ? (
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
                    {isArabic ? "الاتصال" : "Contact"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {isArabic ? "تاريخ التوظيف" : "Hire Date"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {isArabic ? "انتهاء الإقامة" : "Iqama Expiry"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {isArabic ? "الأداء" : "Performance"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {isArabic ? "الإجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {isArabic ? employee.nameAr : employee.nameEn}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.iqamaNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {employee.position}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-32">{employee.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{employee.phone || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {employee.hireDate}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {employee.iqamaExpiry}
                        {isIqamaExpiringSoon(employee.iqamaExpiry) && (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" title={isArabic ? "ينتهي قريباً" : "Expires Soon"} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(employee.performance)}`}>
                        {employee.performance}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          title={isArabic ? "عرض" : "View"}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                          title={isArabic ? "تحرير" : "Edit"}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {isArabic ? employee.nameAr : employee.nameEn}
                  </h3>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                  <p className="text-xs text-gray-500">{employee.department}</p>
                </div>
                {isIqamaExpiringSoon(employee.iqamaExpiry) && (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600 truncate">{employee.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{employee.phone || "N/A"}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(employee.performance)}`}>
                    {employee.performance}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-1 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {isArabic ? "لم يتم العثور على موظفين" : "No employees found"}
          </div>
          <div className="text-gray-400 text-sm mt-2">
            {isArabic ? "جرب تغيير معايير البحث أو التصفية" : "Try adjusting your search or filter criteria"}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTab;