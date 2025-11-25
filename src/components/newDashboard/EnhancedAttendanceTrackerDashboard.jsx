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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const EnhancedAttendanceTrackerDashboard = ({ isArabic = false }) => {
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
      const response = await apiClient.post(
        `/attendance/get/all/project/by-ids`,
        { ids: projectIds }
      );

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
        params.append("project_id", projectId);
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
        hoursWorked:
          field === "regularHours" ? value : existingRecord?.hoursWorked || 0,
        overtimeHours:
          field === "overtimeHours"
            ? value
            : existingRecord?.overtimeHours || 0,
        project_id: employee.projectId,
      };

      console.log("updatedData", updatedData);

      // If updating regular hours, set hoursWorked
      if (field === "regularHours") {
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
    const overtimeCost =
      overtimeHours * employee.hourlyLaborCost * employee.overtimeMultiplier;
    const laborCost = regularCost + overtimeCost;

    const regularRevenue = regularHours * employee.billingRate;
    const overtimeRevenue =
      overtimeHours * employee.billingRate * employee.overtimeMultiplier;
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
    return attendanceRecords.find((record) => {
      // Handle both employee_id and employee._id from API
      const recordEmployeeId =
        record.employee_id || record.employee?.id || record.employee?._id;
      // Convert date to match format
      const recordDate = new Date(record.date).toISOString().split("T")[0];
      return recordEmployeeId === employeeId && recordDate === date;
    });
  };

  // Export daily timesheet
  // const handleExportSalarySheet = async () => {
  //   try {
  //     const params = new URLSearchParams({
  //       date: selectedDate,
  //       format: "csv",
  //     });
  //     if (selectedProjectId !== "all") {
  //       params.append("project_id", selectedProjectId);
  //     }

  //     // 👇 Important: set responseType to 'blob' for file download
  //     const response = await apiClient.get(
  //       `/attendance/export/daily?${params.toString()}`,
  //       { responseType: "blob" }
  //     );

  //     // response.data is already a Blob
  //     const blob = new Blob([response.data], { type: "text/csv" });
  //     const url = URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `attendance_${selectedDate}.csv`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);

  //     alert(
  //       isArabic
  //         ? "تم تصدير كشف الرواتب بنجاح!"
  //         : "Salary sheet exported successfully!"
  //     );
  //   } catch (err) {
  //     console.error("Export failed:", err);
  //     setError("Export failed");
  //   }
  // };
  const handleExportSalarySheet = () => {
    try {
      const rows = filteredEmployees.map((employee) => {
        const attendanceRecord = getAttendanceRecord(employee.id, selectedDate);
        const regularHours = attendanceRecord?.hoursWorked || 0;
        const overtimeHours = attendanceRecord?.overtimeHours || 0;
        const financials = calculateFinancials(
          regularHours,
          overtimeHours,
          employee
        );

        return {
          Employee: employee.name,
          "Employee ID": employee.employeeId,
          Trade: employee.trade,
          Nationality: employee.nationality,
          "Regular Hours": regularHours,
          "Overtime Hours": overtimeHours,
          "Total Hours": financials.totalHours.toFixed(1),
          "Hourly Labor Cost": employee.hourlyLaborCost,
          "Hourly Billing Rate": employee.billingRate,
          "Labor Cost": financials.laborCost,
          "Revenue Generated": financials.revenueGenerated,
          "Daily Profit": financials.dailyProfit,
          "Margin (%)":
            financials.revenueGenerated > 0
              ? (
                  (financials.dailyProfit / financials.revenueGenerated) *
                  100
                ).toFixed(1)
              : 0,
        };
      });

      // Add daily totals row
      rows.push({
        Employee: "TOTALS",
        "Employee ID": "",
        Trade: "",
        Nationality: "",
        "Regular Hours": "",
        "Overtime Hours": "",
        "Total Hours": dailyTotals.totalHours.toFixed(1),
        "Hourly Labor Cost": "",
        "Hourly Billing Rate": "",
        "Labor Cost": dailyTotals.totalLaborCost,
        "Revenue Generated": dailyTotals.totalRevenue,
        "Daily Profit": dailyTotals.totalProfit,
        "Margin (%)":
          dailyTotals.totalRevenue > 0
            ? (
                (dailyTotals.totalProfit / dailyTotals.totalRevenue) *
                100
              ).toFixed(1)
            : 0,
      });

      // Create worksheet & workbook
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Sheet");

      // Generate Excel file and trigger download
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `SalarySheet_${selectedDate}.xlsx`);

      alert(
        isArabic
          ? "تم تصدير كشف الرواتب بنجاح!"
          : "Salary sheet exported successfully!"
      );
    } catch (err) {
      console.error("Export failed:", err);
      alert(isArabic ? "فشل التصدير!" : "Export failed!");
    }
  };

  // Get daily summary
  const fetchDailySummary = async (date, projectId = null) => {
    try {
      const params = new URLSearchParams({ date });
      if (projectId && projectId !== "all") {
        params.append("project_id", projectId);
      }

      const response = await apiClient.getCC(
        `/attendance/summary/daily?${params}`
      );
      const data = await response.json();

      return data.response ? data.data : {};
    } catch (err) {
      console.error("Failed to fetch daily summary:", err);
      return {};
    }
  };

  // Filter employees by project
  const filteredEmployees =
    selectedProjectId === "all"
      ? employees
      : employees.filter((emp) => emp.projectId === selectedProjectId);

  const filteredProjects = projects.filter(
    (project) =>
      project.name?.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
      project.client_name
        ?.toLowerCase()
        .includes(projectSearchTerm.toLowerCase())
  );

  const selectedProject =
    selectedProjectId !== "all"
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

    todayRecords.forEach((record) => {
      // Handle employee ID from different possible fields
      const employeeId =
        record.employee_id || record.employee?.id || record.employee?._id;
      const employee = employees.find((emp) => emp.id === employeeId);
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
      averageHours:
        todayRecords.length > 0 ? totalHours / todayRecords.length : 0,
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
      const response = await apiClient.post(`/attendance/bulk`, {
        attendanceRecords: todayRecords,
      });

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
      const uniqueProjectIds = [
        ...new Set(employees.map((emp) => emp.projectId).filter(Boolean)),
      ];
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
          <h1 className="text-xl font-semi-bold text-gray-900">
            {isArabic
              ? "تتبع الحضور والتكاليف اليومية"
              : "Attendance & Cost Tracking"}
          </h1>
          {/* <p className="text-sm text-gray-600 mt-1">
            {isArabic
              ? "إدارة شاملة للحضور مع حساب التكاليف والأرباح"
              : "Comprehensive attendance management with cost and profit calculations"}
          </p> */}
        </div>
        {/* <button
          onClick={() => {
            fetchEmployees();
            fetchAttendanceByDate(selectedDate, selectedProjectId);
          }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {isArabic ? "تحديث" : "Refresh"}
        </button> */}
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
                className={`text-xl font-bold ${
                  dailyTotals.totalProfit >= 0
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
    </div>
  );
};
