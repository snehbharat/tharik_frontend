import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  Save,
  Download,
  FileText,
  CalendarRange,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  Calculator,
  MapPin,
  RefreshCw,
  Loader,
} from "lucide-react";
import { apiClient } from "../../services/ApiClient";

export const EnhancedAttendanceTracker = ({ isArabic = false }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeView, setActiveView] = useState("timesheet");
  const [selectedProjectId, setSelectedProjectId] = useState("all");
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCC(`/attendance/get/all/employee`);
      if (response.response) {
        setEmployees(response.data || []);
      } else {
        setError(response.message || "Failed to fetch employees");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects by IDs
  const fetchProjects = async (projectIds) => {
    try {
      const response = await apiClient.post(`/attendance/get/all/project/by-ids`, { ids: projectIds });

      if (response.response) {
        setProjects(response.data || []);
      } else {
        setError(response.message || "Failed to fetch projects");
      }
    } catch (err) {
      setError("Failed to fetch projects");
    }
  };

  // Fetch attendance for specific date
  const fetchAttendanceByDate = async (date, projectId = null) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ date });
      if (projectId && projectId !== "all") {
        params.append('project_id', projectId);
      }

      const response = await apiClient.getCC(`/attendance/date?${params}`);

      if (response.response) {
        setAttendanceRecords(response.data || []);
      } else {
        setError(response.message || "Failed to fetch attendance");
      }
    } catch (err) {
      setError("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  // Create or update attendance record
  const updateAttendanceRecord = async (employeeId, date, field, value) => {
    try {
      const employee = employees.find((emp) => emp.id === employeeId);
      if (!employee) return;

      let existingRecord = getAttendanceRecord(employeeId, date);

      const updatedData = {
        employee_id: employeeId,
        date: date,
        hoursWorked: field === 'regularHours' ? value : (existingRecord?.hoursWorked || 0),
        overtimeHours: field === 'overtimeHours' ? value : (existingRecord?.overtimeHours || 0),
        project_id: employee.projectId,
      };

      console.log("updatedData", updatedData);

      // If updating regular hours, set hoursWorked
      if (field === 'regularHours') {
        updatedData.hoursWorked = value;
      }

      const response = await apiClient.post(`/attendance`, updatedData);

      if (response.response) {
        // Refresh attendance data
        await fetchAttendanceByDate(selectedDate, selectedProjectId);
      } else {
        setError(response.message || "Failed to update attendance");
      }
    } catch (err) {
      setError("Failed to update attendance record");
    }
  };

  // Calculate financials for display (client-side calculation)
  const calculateFinancials = (regularHours, overtimeHours, employee) => {

    const totalHours = regularHours + overtimeHours;
    const regularCost = regularHours * employee.hourlyLaborCost;
    const overtimeCost = overtimeHours * employee.hourlyLaborCost * employee.overtimeMultiplier;
    const laborCost = regularCost + overtimeCost;

    const regularRevenue = regularHours * employee.billingRate;
    const overtimeRevenue = overtimeHours * employee.billingRate * employee.overtimeMultiplier;
    const revenueGenerated = regularRevenue + overtimeRevenue;

    const dailyProfit = revenueGenerated - laborCost;

    return {
      totalHours,
      laborCost,
      revenueGenerated,
      dailyProfit,
    };
  };

  // Get attendance record for employee and date
  const getAttendanceRecord = (employeeId, date) => {
    return attendanceRecords.find(
      (record) => {
        // Handle both employee_id and employee._id from API
        const recordEmployeeId = record.employee_id || record.employee?.id || record.employee?._id;
        // Convert date to match format
        const recordDate = new Date(record.date).toISOString().split("T")[0];
        return recordEmployeeId === employeeId && recordDate === date;
      }
    );
  };

  // Export daily timesheet
  const handleExportSalarySheet = async () => {
  try {
    const params = new URLSearchParams({
      date: selectedDate,
      format: "csv",
    });
    if (selectedProjectId !== "all") {
      params.append("project_id", selectedProjectId);
    }

    // 👇 Important: set responseType to 'blob' for file download
    const response = await apiClient.get(
      `/attendance/export/daily?${params.toString()}`,
      { responseType: "blob" }
    );

    // response.data is already a Blob
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_${selectedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(
      isArabic
        ? "تم تصدير كشف الرواتب بنجاح!"
        : "Salary sheet exported successfully!"
    );
  } catch (err) {
    console.error("Export failed:", err);
    setError("Export failed");
  }
};

  // Get daily summary
  const fetchDailySummary = async (date, projectId = null) => {
    try {
      const params = new URLSearchParams({ date });
      if (projectId && projectId !== "all") {
        params.append('project_id', projectId);
      }

      const response = await apiClient.getCC(`/attendance/summary/daily?${params}`);
      const data = await response.json();

      return data.response ? data.data : {};
    } catch (err) {
      console.error("Failed to fetch daily summary:", err);
      return {};
    }
  };

  // Filter employees by project
  const filteredEmployees = selectedProjectId === "all"
    ? employees
    : employees.filter((emp) => emp.projectId === selectedProjectId);

  const filteredProjects = projects.filter(
    (project) =>
      project.name?.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );

  const selectedProject = selectedProjectId !== "all"
    ? projects.find((p) => p.id === selectedProjectId)
    : null;

  // Calculate daily totals from current records
  const calculateDailyTotals = () => {
    const todayRecords = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date).toISOString().split("T")[0];
      return recordDate === selectedDate;
    });

    let totalHours = 0;
    let totalLaborCost = 0;
    let totalRevenue = 0;
    let totalProfit = 0;

    todayRecords.forEach(record => {
      // Handle employee ID from different possible fields
      const employeeId = record.employee_id || record.employee?.id || record.employee?._id;
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        const financials = calculateFinancials(
          record.hoursWorked || 0,
          record.overtimeHours || 0,
          employee
        );
        totalHours += financials.totalHours;
        totalLaborCost += financials.laborCost;
        totalRevenue += financials.revenueGenerated;
        totalProfit += financials.dailyProfit;
      }
    });

    return {
      totalEmployees: todayRecords.length,
      totalHours,
      totalLaborCost,
      totalRevenue,
      totalProfit,
      averageHours: todayRecords.length > 0 ? totalHours / todayRecords.length : 0,
    };
  };

  const dailyTotals = calculateDailyTotals();

  const formatSAR = (amount) => {
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setProjectSearchTerm("");
    setShowProjectDropdown(false);
    // Fetch attendance for new project filter
    fetchAttendanceByDate(selectedDate, projectId);
  };

  const handleSearchChange = (value) => {
    setProjectSearchTerm(value);
    setShowProjectDropdown(true);
  };

  const clearFilter = () => {
    setSelectedProjectId("all");
    setProjectSearchTerm("");
    setShowProjectDropdown(false);
    fetchAttendanceByDate(selectedDate, "all");
  };

  const handleSaveAll = async () => {
    try {
      setLoading(true);
      const todayRecords = attendanceRecords.filter(
        (record) => record.date === selectedDate
      );

      // Bulk update all records
      const response = await apiClient.post(`/attendance/bulk`, { attendanceRecords: todayRecords });

      const data = await response.json();

      if (data.response) {
        alert(
          isArabic
            ? "تم حفظ جميع السجلات بنجاح!"
            : "All attendance records saved successfully!"
        );
        // Refresh data
        await fetchAttendanceByDate(selectedDate, selectedProjectId);
      } else {
        setError(data.message || "Failed to save records");
      }
    } catch (err) {
      setError("Failed to save attendance records");
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchEmployees();
    };
    loadInitialData();
  }, []);

  // Load projects when employees are loaded
  useEffect(() => {
    if (employees.length > 0) {
      const uniqueProjectIds = [...new Set(employees.map(emp => emp.projectId).filter(Boolean))];
      if (uniqueProjectIds.length > 0) {
        fetchProjects(uniqueProjectIds);
      }
    }
  }, [employees]);

  // Load attendance when date or project changes
  useEffect(() => {
    if (employees.length > 0) {
      fetchAttendanceByDate(selectedDate, selectedProjectId);
    }
  }, [selectedDate, selectedProjectId, employees]);

  return (
    <div className="p-6 space-y-6">
      {/* Loading and Error States */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Loader className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-blue-800">
            {isArabic ? "جاري التحميل..." : "Loading..."}
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic
              ? "تتبع الحضور والتكاليف اليومية"
              : "Daily Attendance & Cost Tracking"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isArabic
              ? "إدارة شاملة للحضور مع حساب التكاليف والأرباح"
              : "Comprehensive attendance management with cost and profit calculations"}
          </p>
        </div>
        <button
          onClick={() => {
            fetchEmployees();
            fetchAttendanceByDate(selectedDate, selectedProjectId);
          }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {isArabic ? "تحديث" : "Refresh"}
        </button>
      </div>

      {/* Project Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isArabic ? "تصفية حسب المشروع" : "Filter by Project"}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {isArabic ? "عدد الموظفين:" : "Employees:"}
              <span className="font-semibold text-blue-600 ml-1">
                {filteredEmployees.length}
              </span>
            </span>
            {selectedProjectId !== "all" && (
              <button
                onClick={clearFilter}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                {isArabic ? "إزالة التصفية" : "Clear Filter"}
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder={
                  isArabic ? "البحث عن مشروع..." : "Search for project..."
                }
                value={projectSearchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowProjectDropdown(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />

              {/* Project Dropdown */}
              {showProjectDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    onClick={() => handleProjectSelect("all")}
                  >
                    <div className="font-medium text-gray-900">
                      {isArabic ? "جميع المشاريع" : "All Projects"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {isArabic
                        ? `عرض جميع الموظفين (${employees.length})`
                        : `Show all employees (${employees.length})`}
                    </div>
                  </div>
                  {filteredProjects.map((project) => {
                    const projectEmployeeCount = employees.filter(
                      (emp) => emp.projectId === project.id
                    ).length;
                    return (
                      <div
                        key={project.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleProjectSelect(project.id)}
                      >
                        <div className="font-medium text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.client_name} • {project.location} •{" "}
                          {projectEmployeeCount}{" "}
                          {isArabic ? "موظف" : "employees"}
                        </div>
                      </div>
                    );
                  })}
                  {filteredProjects.length === 0 && projectSearchTerm && (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      {isArabic
                        ? "لا توجد مشاريع مطابقة"
                        : "No matching projects found"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Project Display */}
            {selectedProjectId !== "all" && selectedProject && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <div className="font-medium text-green-800">
                  {selectedProject.name}
                </div>
                <div className="text-sm text-green-600">
                  {selectedProject.client_name} • {filteredEmployees.length}{" "}
                  {isArabic ? "موظف" : "employees"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-blue-900">
                {filteredEmployees.length}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "الموظفون" : "Employees"}
                {selectedProjectId !== "all" && (
                  <div className="text-xs text-blue-600">
                    {isArabic ? "في المشروع" : "in project"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-green-900">
                {dailyTotals.totalHours.toFixed(1)}
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "إجمالي الساعات" : "Total Hours"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-red-900">
                {formatSAR(dailyTotals.totalLaborCost)
                  .replace("SAR", "")
                  .trim()}
              </div>
              <div className="text-sm text-red-700">
                {isArabic ? "تكلفة العمالة" : "Labor Cost"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-purple-900">
                {formatSAR(dailyTotals.totalRevenue).replace("SAR", "").trim()}
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "الإيرادات" : "Revenue"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div
                className={`text-xl font-bold ${dailyTotals.totalProfit >= 0
                  ? "text-green-900"
                  : "text-red-900"
                  }`}
              >
                {formatSAR(dailyTotals.totalProfit).replace("SAR", "").trim()}
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "الربح اليومي" : "Daily Profit"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs - Removed timeclock */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveView("timesheet")}
              className={`px-6 py-4 font-medium transition-colors ${activeView === "timesheet"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isArabic ? "كشف الحضور" : "Daily Timesheet"}
              </div>
            </button>
            <button
              onClick={() => setActiveView("reports")}
              className={`px-6 py-4 font-medium transition-colors ${activeView === "reports"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {isArabic ? "التقارير" : "Reports"}
              </div>
            </button>
            <button
              onClick={() => setActiveView("analytics")}
              className={`px-6 py-4 font-medium transition-colors ${activeView === "analytics"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {isArabic ? "التحليلات" : "Analytics"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeView === "timesheet" && (
            <div className="space-y-6">
              {/* Date Selection and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  {selectedProjectId !== "all" && selectedProject && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                      <div className="text-sm font-medium text-blue-800">
                        {isArabic ? "المشروع النشط:" : "Active Project:"}
                      </div>
                      <div className="text-xs text-blue-600">
                        {selectedProject.name}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveAll}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {isArabic ? "حفظ الكل" : "Save All"}
                  </button>
                  <button
                    onClick={handleExportSalarySheet}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {isArabic ? "تصدير" : "Export"}
                  </button>
                </div>
              </div>

              {/* No Employees Message */}
              {filteredEmployees.length === 0 && selectedProjectId !== "all" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <div className="text-yellow-800 font-medium mb-2">
                    {isArabic
                      ? "لا يوجد موظفون في هذا المشروع"
                      : "No employees assigned to this project"}
                  </div>
                  <div className="text-yellow-600 text-sm">
                    {isArabic
                      ? "يرجى اختيار مشروع آخر أو إضافة موظفين لهذا المشروع"
                      : "Please select another project or assign employees to this project"}
                  </div>
                </div>
              )}

              {/* Main Attendance Table */}
              {filteredEmployees.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                            {isArabic ? "الموظف" : "EMPLOYEE"}
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                            {isArabic ? "المهنة" : "TRADE"}
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                            {isArabic ? "الساعات العادية" : "REGULAR HOURS"}
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                            {isArabic ? "العمل الإضافي" : "OVERTIME"}
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                            {isArabic ? "إجمالي الساعات" : "TOTAL HOURS"}
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                            {isArabic
                              ? "تكلفة العمالة بالساعة"
                              : "HOURLY LABOR COST"}
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                            {isArabic
                              ? "الإيرادات المحققة"
                              : "REVENUE GENERATED"}
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                            {isArabic ? "الربح اليومي" : "DAILY PROFIT"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEmployees.map((employee, index) => {
                          const attendanceRecord = getAttendanceRecord(
                            employee.id,
                            selectedDate
                          );
                          const regularHours = attendanceRecord?.hoursWorked || 0;
                          const overtimeHours = attendanceRecord?.overtimeHours || 0;
                          const financials = calculateFinancials(
                            regularHours,
                            overtimeHours,
                            employee
                          );

                          return (
                            <tr
                              key={employee.id}
                              className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-gray-25" : "bg-white"
                                }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    {employee.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900 text-lg">
                                      {employee.name}
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">
                                      {employee.employeeId}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900">
                                  {employee.trade}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.nationality}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="12"
                                  step="0.5"
                                  value={regularHours}
                                  onChange={(e) =>
                                    updateAttendanceRecord(
                                      employee.id,
                                      selectedDate,
                                      "regularHours",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder="0"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="8"
                                  step="0.5"
                                  value={overtimeHours}
                                  onChange={(e) =>
                                    updateAttendanceRecord(
                                      employee.id,
                                      selectedDate,
                                      "overtimeHours",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                  placeholder="0"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="text-lg font-bold text-gray-900">
                                  {financials.totalHours.toFixed(1)}h
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="text-lg font-bold text-red-600">
                                  {formatSAR(financials.laborCost)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatSAR(employee.hourlyLaborCost)}/hr
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="text-lg font-bold text-green-600">
                                  {formatSAR(financials.revenueGenerated)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatSAR(employee.billingRate)}/hr
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div
                                  className={`text-lg font-bold ${financials.dailyProfit >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                                >
                                  {formatSAR(financials.dailyProfit)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {financials.totalHours > 0
                                    ? `${(
                                      (financials.dailyProfit /
                                        financials.revenueGenerated) *
                                      100
                                    ).toFixed(1)}% margin`
                                    : "0% margin"}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {/* Totals Row */}
                      <tfoot className="bg-gradient-to-r from-gray-100 to-gray-200">
                        <tr>
                          <td
                            className="px-6 py-4 font-bold text-gray-900 text-lg"
                            colSpan={2}
                          >
                            {isArabic ? "الإجمالي اليومي" : "DAILY TOTALS"}
                            {selectedProjectId !== "all" && selectedProject && (
                              <div className="text-sm font-normal text-gray-600">
                                {selectedProject.name}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {attendanceRecords
                                .filter((r) => {
                                  const recordDate = new Date(r.date).toISOString().split("T")[0];
                                  return recordDate === selectedDate;
                                })
                                .reduce((sum, r) => sum + (r.hoursWorked || 0), 0)
                                .toFixed(1)}
                              h
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-lg font-bold text-yellow-600">
                              {attendanceRecords
                                .filter((r) => {
                                  const recordDate = new Date(r.date).toISOString().split("T")[0];
                                  return recordDate === selectedDate;
                                })
                                .reduce((sum, r) => sum + (r.overtimeHours || 0), 0)
                                .toFixed(1)}
                              h
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {dailyTotals.totalHours.toFixed(1)}h
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-lg font-bold text-red-600">
                              {formatSAR(dailyTotals.totalLaborCost)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-lg font-bold text-green-600">
                              {formatSAR(dailyTotals.totalRevenue)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div
                              className={`text-lg font-bold ${dailyTotals.totalProfit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                            >
                              {formatSAR(dailyTotals.totalProfit)}
                            </div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Validation Alerts */}
              {dailyTotals.totalProfit < 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-red-800">
                        {isArabic
                          ? "تحذير: خسارة يومية"
                          : "Warning: Daily Loss Detected"}
                      </h3>
                      <p className="text-sm text-red-700">
                        {isArabic
                          ? `الخسارة اليومية: ${formatSAR(
                            Math.abs(dailyTotals.totalProfit)
                          )} - يرجى مراجعة الأسعار أو الساعات`
                          : `Daily loss: ${formatSAR(
                            Math.abs(dailyTotals.totalProfit)
                          )} - Please review rates or hours`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {attendanceRecords.filter(
                (r) => {
                  const recordDate = new Date(r.date).toISOString().split("T")[0];
                  return recordDate === selectedDate && (r.hoursWorked || 0) + (r.overtimeHours || 0) === 0;
                }
              ).length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-yellow-800">
                          {isArabic
                            ? "تنبيه: سجلات فارغة"
                            : "Notice: Empty Records"}
                        </h3>
                        <p className="text-sm text-yellow-700">
                          {isArabic
                            ? "يوجد موظفون بدون ساعات عمل مسجلة"
                            : "Some employees have no recorded working hours"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}

          {activeView === "reports" && (
            <div className="space-y-6">
              {/* Project Filter Summary for Reports */}
              {selectedProjectId !== "all" && selectedProject && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    {isArabic
                      ? "تقارير المشروع المحدد"
                      : "Project-Specific Reports"}
                  </h3>
                  <div className="text-sm text-blue-700">
                    <strong>{selectedProject.name}</strong> •{" "}
                    {selectedProject.client_name} • {filteredEmployees.length}{" "}
                    {isArabic ? "موظف" : "employees"}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">
                      {isArabic ? "التقرير اليومي" : "Daily Report"}
                    </h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    {isArabic
                      ? "تقرير مفصل للحضور والتكاليف اليومية"
                      : "Detailed daily attendance and cost report"}
                    {selectedProjectId !== "all" && (
                      <span className="block mt-1 font-medium">
                        {isArabic ? "للمشروع المحدد" : "for selected project"}
                      </span>
                    )}
                  </p>
                  <button
                    onClick={handleExportSalarySheet}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isArabic ? "إنشاء التقرير" : "Generate Report"}
                  </button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarRange className="w-8 h-8 text-green-600" />
                    <h3 className="font-semibold text-green-800">
                      {isArabic ? "تقرير فترة" : "Period Report"}
                    </h3>
                  </div>
                  <p className="text-sm text-green-700 mb-4">
                    {isArabic
                      ? "تقرير شامل لفترة زمنية محددة"
                      : "Comprehensive report for selected period"}
                    {selectedProjectId !== "all" && (
                      <span className="block mt-1 font-medium">
                        {isArabic
                          ? "مقتصر على المشروع المحدد"
                          : "limited to selected project"}
                      </span>
                    )}
                  </p>
                  <div className="space-y-2 mb-4">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder={isArabic ? "تاريخ البداية" : "Start Date"}
                    />
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder={isArabic ? "تاريخ النهاية" : "End Date"}
                    />
                  </div>
                  <button
                    onClick={() => {
                      // Implement period report generation
                      alert(isArabic ? "سيتم تطوير هذه الميزة قريباً" : "This feature will be implemented soon");
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isArabic ? "إنشاء التقرير" : "Generate Report"}
                  </button>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator className="w-8 h-8 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">
                      {isArabic ? "تحليل الربحية" : "Profitability Analysis"}
                    </h3>
                  </div>
                  <p className="text-sm text-purple-700 mb-4">
                    {isArabic
                      ? "تحليل مفصل للأرباح والتكاليف"
                      : "Detailed profit and cost analysis"}
                    {selectedProjectId !== "all" && (
                      <span className="block mt-1 font-medium">
                        {isArabic ? "حسب المشروع" : "by project"}
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => setActiveView("analytics")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isArabic ? "إنشاء التحليل" : "View Analysis"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === "analytics" && (
            <div className="space-y-6">
              {/* Analytics Project Context */}
              {selectedProjectId !== "all" && selectedProject && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    {isArabic ? "تحليلات المشروع" : "Project Analytics"}
                  </h3>
                  <div className="text-sm text-green-700">
                    {isArabic
                      ? "التحليلات التالية مقتصرة على:"
                      : "Analytics below are filtered for:"}{" "}
                    <strong>{selectedProject.name}</strong>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "الأداء حسب المهنة" : "Performance by Trade"}
                    {selectedProjectId !== "all" && (
                      <span className="text-sm font-normal text-gray-600 block">
                        {isArabic ? "في المشروع المحدد" : "in selected project"}
                      </span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {[...new Set(filteredEmployees.map(emp => emp.trade))]
                      .map((trade) => {
                        const tradeEmployees = filteredEmployees.filter(
                          (emp) => emp.trade === trade
                        );
                        const tradeRecords = attendanceRecords.filter(
                          (record) => {
                            const employeeId = record.employee_id || record.employee?.id || record.employee?._id;
                            const employee = employees.find(
                              (emp) => emp.id === employeeId
                            );
                            const recordDate = new Date(record.date).toISOString().split("T")[0];
                            return (
                              employee?.trade === trade &&
                              recordDate === selectedDate
                            );
                          }
                        );

                        let tradeProfit = 0;
                        tradeRecords.forEach(record => {
                          const employeeId = record.employee_id || record.employee?.id || record.employee?._id;
                          const employee = employees.find(emp => emp.id === employeeId);
                          if (employee) {
                            const financials = calculateFinancials(
                              record.hoursWorked || 0,
                              record.overtimeHours || 0,
                              employee
                            );
                            tradeProfit += financials.dailyProfit;
                          }
                        });

                        if (tradeEmployees.length === 0) return null;

                        return (
                          <div
                            key={trade}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium text-gray-900">
                              {trade}
                            </span>
                            <div className="text-right">
                              <div
                                className={`font-bold ${tradeProfit >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                                  }`}
                              >
                                {formatSAR(tradeProfit)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {tradeEmployees.length}{" "}
                                {isArabic ? "موظف" : "employees"}
                              </div>
                            </div>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "المؤشرات الرئيسية" : "Key Metrics"}
                    {selectedProjectId !== "all" && (
                      <span className="text-sm font-normal text-gray-600 block">
                        {isArabic ? "للمشروع المحدد" : "for selected project"}
                      </span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "متوسط الساعات:" : "Average Hours:"}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {dailyTotals.averageHours.toFixed(1)}h
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "هامش الربح:" : "Profit Margin:"}
                      </span>
                      <span
                        className={`font-semibold ${dailyTotals.totalRevenue > 0
                          ? (dailyTotals.totalProfit /
                            dailyTotals.totalRevenue) *
                            100 >=
                            0
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-gray-600"
                          }`}
                      >
                        {dailyTotals.totalRevenue > 0
                          ? `${(
                            (dailyTotals.totalProfit /
                              dailyTotals.totalRevenue) *
                            100
                          ).toFixed(1)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "الإنتاجية:" : "Productivity:"}
                      </span>
                      <span className="font-semibold text-blue-600">
                        {dailyTotals.totalHours > 0
                          ? formatSAR(
                            dailyTotals.totalRevenue / dailyTotals.totalHours
                          ) + "/hr"
                          : formatSAR(0) + "/hr"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "عدد المشاريع النشطة:" : "Active Projects:"}
                      </span>
                      <span className="font-semibold text-purple-600">
                        {projects.filter(p => p.status === 'active').length}
                      </span>
                    </div>
                    {selectedProjectId !== "all" && selectedProject && (
                      <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                        <span className="text-gray-600">
                          {isArabic ? "المشروع:" : "Project:"}
                        </span>
                        <span className="font-semibold text-purple-600">
                          {selectedProject.client_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Analytics - Trade Statistics */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "إحصائيات المهن التفصيلية" : "Detailed Trade Statistics"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...new Set(filteredEmployees.map(emp => emp.trade))].map(trade => {
                    const tradeEmployees = filteredEmployees.filter(emp => emp.trade === trade);
                    const tradeRecords = attendanceRecords.filter(record => {
                      const employeeId = record.employee_id || record.employee?.id || record.employee?._id;
                      const employee = employees.find(emp => emp.id === employeeId);
                      const recordDate = new Date(record.date).toISOString().split("T")[0];
                      return employee?.trade === trade && recordDate === selectedDate;
                    });

                    const tradeHours = tradeRecords.reduce((sum, record) =>
                      sum + (record.hoursWorked || 0) + (record.overtimeHours || 0), 0
                    );

                    return (
                      <div key={trade} className="bg-gray-50 rounded-lg p-4">
                        <div className="font-semibold text-gray-900 mb-2">{trade}</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {isArabic ? "العدد:" : "Count:"}
                            </span>
                            <span className="font-medium">{tradeEmployees.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {isArabic ? "الساعات:" : "Hours:"}
                            </span>
                            <span className="font-medium">{tradeHours.toFixed(1)}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {isArabic ? "المتوسط:" : "Avg:"}
                            </span>
                            <span className="font-medium">
                              {tradeEmployees.length > 0
                                ? (tradeHours / tradeEmployees.length).toFixed(1)
                                : "0"}h
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showProjectDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowProjectDropdown(false)}
        />
      )}
    </div>
  );
};