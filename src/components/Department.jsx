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
import DepartmentService from "../services/DepartmentService";
import {
  EmployeeProvider,
  useEmployeeManagement,
} from "../context/EmployeeContext";

const DepartmentContent = ({ isArabic }) => {
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [viewDepartment, setViewDepartment] = useState(null);
  const [editDepartment, setEditDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    head_of_department: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    description: "",
    head_of_department: "",
    location: "",
  });
  const [editDepartmentForm, setEditDepartmentForm] = useState({
    name: "",
    name_ar: "",
    description: "",
    head_of_department: "",
    location: "",
  });

  const { employees, fetchEmployees } = useEmployeeManagement();

  // Load initial data
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const employeesData = employees?.employees || [];

  const fetchDepartments = async () => {
    try {
      const { data } = await DepartmentService.getAllDepartment();

      setDepartments(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateUser = async () => {
    // Simple validation checks
    if (!formData.name.trim()) {
      alert("Name (English) is required");
      return;
    }
    if (!formData.name_ar.trim()) {
      alert("Name (Arabic) is required");
      return;
    }
    if (!formData.description.trim()) {
      alert("Description is required");
      return;
    }
    if (!formData.head_of_department.trim()) {
      alert("Head of Department is required");
      return;
    }
    if (!formData.location.trim()) {
      alert("Location is required");
      return;
    }

    try {
      await DepartmentService.createDepartment(formData);
      fetchDepartments();
      setShowDepartmentForm(false);
      setFormData({
        name: "",
        name_ar: "",
        description: "",
        head_of_department: "",
        location: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  const handleEditDepartment = (department) => {
    setEditDepartment(department);
    setEditDepartmentForm(department);
  };

  const handleUpdateDepartment = async () => {
    try {
      if (!editDepartmentForm.name || !editDepartmentForm.name_ar) {
        alert("Name, Name Arabic");
        return;
      }

      await DepartmentService.updateDepartment(
        editDepartment._id,
        editDepartmentForm
      );
      fetchDepartments();
      setEditDepartment(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      if (
        !window.confirm("Are you sure you want to deactivate this department?")
      )
        return;

      await DepartmentService.updateDepartment(id, { is_active: false });

      fetchDepartments();
    } catch (error) {
      console.error("Error deactivating department:", error);
    }
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

  const uniqueLocations = [
    ...new Set(departments.map((dept) => dept.location).filter(Boolean)),
  ];

  const uniqueHeads = [
    ...new Set(
      departments
        .map((dept) => dept.head_of_department)
        .filter(Boolean)
        .map((h) => (typeof h === "object" ? h._id : h))
    ),
  ];

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = filters.location
      ? dept.location === filters.location
      : true;

    const matchesHead =
      filters.head_of_department && dept.head_of_department
        ? dept.head_of_department._id === filters.head_of_department ||
          dept.head_of_department === filters.head_of_department
        : true;

    return matchesSearch && matchesLocation && matchesHead;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {isArabic ? "إدارة القسم" : "Department Management"}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDepartmentForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "إضافة قسم" : "Add Department"}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 flex-wrap mb-6">
        {/* Search Input */}
        <div className="relative flex-1 min-w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={
              isArabic ? "البحث في الأقسام..." : "Search departments..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* Filter by Location */}
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">
            {isArabic ? "جميع المواقع" : "All Locations"}
          </option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Filter by Head of Department */}
        <select
          value={filters.head_of_department}
          onChange={(e) =>
            setFilters({ ...filters, head_of_department: e.target.value })
          }
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">
            {isArabic ? "جميع رؤساء الأقسام" : "All Heads of Department"}
          </option>
          {employeesData.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {isArabic
                ? emp.name_ar || `${emp.first_name} ${emp.last_name}`
                : `${emp.first_name} ${emp.last_name}`}
            </option>
          ))}
        </select>
      </div>

      {/* Department Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "القسم (إنجليزي)" : "Department (English)"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "القسم (عربي)" : "Department (Arabic)"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "الوصف" : "Description"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "رئيس القسم" : "Head of Department"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "الموقع" : "Location"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {isArabic ? "تاريخ الإنشاء" : "Created At"}
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
                    colSpan="8"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      {isArabic ? "جاري التحميل..." : "Loading..."}
                    </div>
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {isArabic ? "لا توجد أقسام" : "No departments found"}
                  </td>
                </tr>
              ) : (
                filteredDepartments
                  ?.filter((d) => d.is_active === true)
                  .map((dept) => {
                    const head = employeesData.find(
                      (emp) => emp._id === dept.head_of_department
                    );

                    return (
                      <tr key={dept._id} className="hover:bg-gray-50">
                        {/* Department Name (English) */}
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">
                            {dept.name}
                          </div>
                        </td>

                        {/* Department Name (Arabic) */}
                        <td className="px-4 py-4">
                          <div className="text-gray-900">{dept.name_ar}</div>
                        </td>

                        {/* Description */}
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-700">
                            {dept.description || "—"}
                          </div>
                        </td>

                        {/* Head of Department */}
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {head
                              ? `${head.first_name || ""} ${
                                  head.last_name || ""
                                }`.trim()
                              : isArabic
                              ? "غير محدد"
                              : "Not Assigned"}
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {dept.location || "—"}
                        </td>

                        {/* Created At */}
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {new Date(dept.created_at).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewDepartment(dept)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              title={isArabic ? "عرض" : "View"}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditDepartment(dept)}
                              className="text-green-600 hover:text-green-800 p-1 rounded"
                              title={isArabic ? "تعديل" : "Edit"}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment(dept._id)}
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

      {/* Department Form Modal */}
      {showDepartmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إضافة قسم جديد" : "Add New Department"}
              </h3>
              <button
                onClick={() => setShowDepartmentForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Department Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (إنجليزي)" : "Name (English)"} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (عربي)" : "Name (Arabic)"} *
                  </label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, name_ar: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Head of Department + Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رئيس القسم" : "Head of Department"} *
                  </label>
                  <select
                    value={formData.head_of_department}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        head_of_department: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "اختر موظفًا" : "Select Employee"}
                    </option>
                    {employeesData.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {isArabic
                          ? emp?.personalInfo.fullNameAr
                          : emp?.personalInfo.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الموقع" : "Location"} *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوصف" : "Description"} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="3"
                ></textarea>
              </div>
              {/* Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleCreateUser}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إنشاء القسم" : "Create Department"}
                </button>
                <button
                  onClick={() => setShowDepartmentForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Department Modal */}
      {viewDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isArabic ? "تفاصيل القسم" : "Department Details"}
              </h3>
              <button
                onClick={() => setViewDepartment(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Department Details */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "القسم (إنجليزي)" : "Department (English)"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewDepartment.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "الوصف" : "Description"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewDepartment.description || (isArabic ? "—" : "—")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "الموقع" : "Location"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewDepartment.location || (isArabic ? "—" : "—")}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "القسم (عربي)" : "Department (Arabic)"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewDepartment.name_ar}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "رئيس القسم" : "Head of Department"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {(() => {
                      const head = employeesData.find(
                        (emp) => emp._id === viewDepartment.head_of_department
                      );
                      return head
                        ? `${head.first_name || ""} ${
                            head.last_name || ""
                          }`.trim()
                        : isArabic
                        ? "غير محدد"
                        : "Not Assigned";
                    })()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "الحالة" : "Status"}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      viewDepartment.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {viewDepartment.is_active
                      ? isArabic
                        ? "نشط"
                        : "Active"
                      : isArabic
                      ? "غير نشط"
                      : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t mt-6 pt-4 grid grid-cols-2 gap-6 text-sm text-gray-600">
              <p>
                <span className="font-semibold">
                  {isArabic ? "تاريخ الإنشاء: " : "Created At: "}
                </span>
                {new Date(viewDepartment.created_at).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">
                  {isArabic ? "آخر تحديث: " : "Updated At: "}
                </span>
                {new Date(viewDepartment.updated_at).toLocaleString()}
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setViewDepartment(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isArabic ? "تحديث القسم" : "Update Department"}
              </h3>
              <button
                onClick={() => setEditDepartment(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Update Form */}
            <div className="space-y-4">
              {/* Department Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (إنجليزي)" : "Name (English)"} *
                  </label>
                  <input
                    type="text"
                    value={editDepartmentForm.name}
                    onChange={(e) =>
                      setEditDepartmentForm({
                        ...editDepartmentForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (عربي)" : "Name (Arabic)"} *
                  </label>
                  <input
                    type="text"
                    value={editDepartmentForm.name_ar}
                    onChange={(e) =>
                      setEditDepartmentForm({
                        ...editDepartmentForm,
                        name_ar: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Head of Department + Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رئيس القسم" : "Head of Department"} *
                  </label>
                  <select
                    value={editDepartmentForm.head_of_department || ""}
                    onChange={(e) =>
                      setEditDepartmentForm({
                        ...editDepartmentForm,
                        head_of_department: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "اختر موظفًا" : "Select Employee"}
                    </option>
                    {employeesData.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {isArabic
                          ? emp.name_ar || `${emp.first_name} ${emp.last_name}`
                          : `${emp.first_name} ${emp.last_name}`}
                      </option>
                    ))}
                  </select>

                  {/* Show current name if not found in dropdown */}
                  {!employeesData.some(
                    (emp) => emp._id === editDepartmentForm.head_of_department
                  ) &&
                    editDepartmentForm.head_of_department && (
                      <p className="text-xs text-gray-500 mt-1 italic">
                        {isArabic
                          ? "رئيس القسم الحالي غير موجود في قائمة الموظفين"
                          : "Current Head of Department not found in employee list"}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الموقع" : "Location"} *
                  </label>
                  <input
                    type="text"
                    value={editDepartmentForm.location}
                    onChange={(e) =>
                      setEditDepartmentForm({
                        ...editDepartmentForm,
                        location: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوصف" : "Description"} *
                </label>
                <textarea
                  value={editDepartmentForm.description}
                  onChange={(e) =>
                    setEditDepartmentForm({
                      ...editDepartmentForm,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                ></textarea>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-6">
                <button
                  onClick={() => setEditDepartment(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleUpdateDepartment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "تحديث" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const DepartmentModule = ({ isArabic = false }) => {
  return <DepartmentContent isArabic={isArabic} />;
};

export const Department = ({ isArabic = false }) => {
  return (
    <EmployeeProvider>
      <DepartmentContent isArabic={isArabic} />
    </EmployeeProvider>
  );
};

export default Department;
