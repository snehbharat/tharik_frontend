import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Download,
  Upload,
  Settings,
  Bell,
  Shield,
  FileText,
  Save,
  X,
  Plus,
  Edit,
  Eye,
  DollarSign,
  User,
  Trash2,
  Printer,
} from "lucide-react";
import { ATTENDANCE_CONFIG } from "../../types/attendance";
import { ScheduleService } from "../../services/ScheduleService";
import { LeaveService } from "../../services/LeaveService";
// import { PayrollService } from "../../services/PayrollService";
import { ComplianceService } from "../../services/ComplianceService";
import { NotificationService } from "../../services/NotificationService";
import { ReportingService } from "../../services/ReportingService";
import { AttendanceService } from "../../services/AttendanceService";
import { AttendanceReports } from "./AttendanceReports";
import { employeeService } from "../../services/EmployeeService";
import UserService from "../../services/UserService";
import LeavesService from "../../services/LeavesService";

export const AttendanceTracking = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [editingLeave, setEditingLeave] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getAllEmployees();
      setEmployees(res?.data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err.message);
      // setError("Failed to load employees");
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await UserService.getAllUsers();
      setUsers(res?.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err.message);
      // setError("Failed to load employees");
    }
  };
  const fetchLeaves = async () => {
    try {
      const res = await LeavesService.getAllLeaves();
      setLeaves(res?.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err.message);
      // setError("Failed to load employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchUsers();
    fetchLeaves();
  }, []);
  console.log("users", users);
  console.log("employees", employees);
  console.log("leaves", leaves);

  // const employees = [
  //   {
  //     id: "emp_001",
  //     name: "Ahmed Al-Rashid",
  //     nameAr: "أحمد الراشد",
  //     department: "Operations",
  //     hourlyRate: 35.0,
  //   },
  //   {
  //     id: "emp_002",
  //     name: "Mohammad Hassan",
  //     nameAr: "محمد حسن",
  //     department: "Operations",
  //     hourlyRate: 28.0,
  //   },
  //   {
  //     id: "emp_003",
  //     name: "Ali Al-Mahmoud",
  //     nameAr: "علي المحمود",
  //     department: "Maintenance",
  //     hourlyRate: 32.0,
  //   },
  //   {
  //     id: "emp_004",
  //     name: "Fatima Al-Zahra",
  //     nameAr: "فاطمة الزهراء",
  //     department: "Safety",
  //     hourlyRate: 40.0,
  //   },
  // ];

  const [newLeaveRequest, setNewLeaveRequest] = useState({
    leaveType: "Annual Leave",
    beneficiaryType: "",
    beneficiaryId: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: "pending",
  });

  const [manualAttendance, setManualAttendance] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    hoursWorked: 8,
    overtimeHours: 0,
    breakTime: 1,
    location: "",
    notes: "",
  });

  const [newSchedule, setNewSchedule] = useState({
    name: "",
    scheduleType: "fixed",
    startTime: "08:00",
    endTime: "17:00",
    breakDuration: 60,
    workDays: [1, 2, 3, 4, 5],
    hoursPerWeek: 40,
  });

  useEffect(() => {
    LeaveService.initializeLeaveTypes();
    ComplianceService.initializeComplianceRules();
    NotificationService.initializeTemplates();
    ReportingService.initializeReportTemplates();
  }, []);

  const handleManualAttendanceEntry = async () => {
    try {
      if (!manualAttendance.employeeId || !manualAttendance.date) {
        throw new Error("Please select employee and date");
      }

      await AttendanceService.addAttendanceRecord({
        ...manualAttendance,
        lateArrival: 0,
        earlyDeparture: 0,
      });

      setManualAttendance({
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
        hoursWorked: 8,
        overtimeHours: 0,
        breakTime: 1,
        location: "",
        notes: "",
      });
      setShowManualEntry(false);

      alert(
        isArabic
          ? "تم تسجيل الحضور بنجاح!"
          : "Attendance recorded successfully!"
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmitLeaveRequest = async () => {
    try {
      const {
        leaveType,
        beneficiaryType,
        beneficiaryId,
        startDate,
        endDate,
        reason,
        status,
      } = newLeaveRequest;

      // Validation
      if (!beneficiaryType || !beneficiaryId) {
        throw new Error(
          isArabic
            ? "الرجاء اختيار المستخدم أو الموظف"
            : "Please select a user or employee"
        );
      }
      if (!startDate || !endDate) {
        throw new Error(
          isArabic
            ? "الرجاء اختيار تاريخ البدء والانتهاء"
            : "Please select start and end dates"
        );
      }

      // API call
      await LeavesService.createLeave({
        leaveType,
        beneficiaryType,
        beneficiaryId,
        startDate,
        endDate,
        reason,
        status,
      });

      // Reset form
      setNewLeaveRequest({
        leaveType: "Annual Leave",
        beneficiaryType: "",
        beneficiaryId: "",
        startDate: "",
        endDate: "",
        reason: "",
        status: "pending",
      });
      setShowLeaveRequest(false);

      alert(
        isArabic
          ? "تم تقديم طلب الإجازة بنجاح!"
          : "Leave request submitted successfully!"
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClient = (id) => {
    // Find client to edit
    const leave = leaves.find((l) => l._id === id);
    if (!leave) return;

    // Store in state for editing (could be modal or inline form)
    setEditingLeave(leave);
  };

  console.log(editingLeave);

  const handleUpdateLeave = async () => {
    try {
      const {
        leaveType,
        beneficiaryType,
        beneficiaryId,
        startDate,
        endDate,
        reason,
        status,
      } = editingLeave;

      // Validation
      if (!beneficiaryType || !beneficiaryId) {
        throw new Error(
          isArabic
            ? "الرجاء اختيار المستخدم أو الموظف"
            : "Please select a user or employee"
        );
      }
      if (!startDate || !endDate) {
        throw new Error(
          isArabic
            ? "الرجاء اختيار تاريخ البدء والانتهاء"
            : "Please select start and end dates"
        );
      }

      // API call
      await LeavesService.updateLeave(editingLeave._id, {
        leaveType,
        beneficiaryType,
        beneficiaryId,
        startDate,
        endDate,
        reason,
        status,
      });

      // Close modal
      setEditingLeave(null);
      fetchLeaves();

      alert(
        isArabic
          ? "تم تحديث طلب الإجازة بنجاح!"
          : "Leave request updated successfully!"
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteLead = async (id) => {
    if (
      window.confirm(
        isArabic
          ? "هل أنت متأكد من حذف هذا العميل المحتمل؟"
          : "Are you sure you want to delete this Leave?"
      )
    ) {
      const res = await LeavesService.deleteLeave(id);
      if (res?.status === 200) {
        fetchLeaves();
      }
      alert(
        isArabic ? "تم حذف العميل المحتمل بنجاح!" : "Lead deleted successfully!"
      );
    }
  };

  const handleCreateSchedule = async () => {
    try {
      await ScheduleService.createSchedule({
        ...newSchedule,
        overtimeThreshold: ATTENDANCE_CONFIG.OVERTIME_THRESHOLD,
        isActive: true,
      });

      setNewSchedule({
        name: "",
        scheduleType: "fixed",
        startTime: "08:00",
        endTime: "17:00",
        breakDuration: 60,
        workDays: [1, 2, 3, 4, 5],
        hoursPerWeek: 40,
      });
      setShowScheduleForm(false);

      alert(
        isArabic ? "تم إنشاء الجدول بنجاح!" : "Schedule created successfully!"
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const generateAttendanceReport = async () => {
    try {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const startDateStr = startDate.toISOString().split("T")[0];

      const report = await ReportingService.generateAttendanceReport(
        startDateStr,
        endDate,
        undefined,
        employees
      );

      const csvContent = await ReportingService.exportReport(report, "csv");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance_report_${endDate}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      alert(
        isArabic
          ? "تم إنشاء تقرير الحضور بنجاح!"
          : "Attendance report generated successfully!"
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const generateFinancialReport = async () => {
    try {
      let reportContent = "";
      reportContent += `AMOAGC AL-MAJMAAH - FINANCIAL PERFORMANCE REPORT\n`;
      reportContent += `Generated on: ${new Date().toLocaleString()}\n`;
      reportContent += `${"=".repeat(80)}\n\n`;

      reportContent += `FINANCIAL SUMMARY:\n`;
      reportContent += `Total Revenue: ${(8400000).toLocaleString()} SAR\n`;
      reportContent += `Total Expenses: ${(6420000).toLocaleString()} SAR\n`;
      reportContent += `Net Profit: ${(1980000).toLocaleString()} SAR\n`;
      reportContent += `Profit Margin: 23.6%\n`;
      reportContent += `Monthly Growth: 15.2%\n\n`;

      reportContent += `EMPLOYEE FINANCIAL PERFORMANCE:\n`;
      employees.forEach((emp, index) => {
        const monthlyRevenue = emp.hourlyRate * 176 * 1.2;
        const profitMargin = (
          ((monthlyRevenue - emp.hourlyRate * 176) / monthlyRevenue) *
          100
        ).toFixed(1);

        reportContent += `${index + 1}. ${emp.name}\n`;
        reportContent += `   Hourly Rate: ${emp.hourlyRate} SAR\n`;
        reportContent += `   Monthly Revenue: ${monthlyRevenue.toLocaleString()} SAR\n`;
        reportContent += `   Profit Margin: ${profitMargin}%\n\n`;
      });

      const blob = new Blob([reportContent], {
        type: "text/plain;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `financial_performance_report_${
          new Date().toISOString().split("T")[0]
        }.txt`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم إنشاء التقرير المالي بنجاح!"
          : "Financial report generated successfully!"
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const generateCombinedReport = async () => {
    try {
      let reportContent = "";
      reportContent += `AMOAGC AL-MAJMAAH - COMPREHENSIVE ATTENDANCE & FINANCIAL REPORT\n`;
      reportContent += `Generated on: ${new Date().toLocaleString()}\n`;
      reportContent += `${"=".repeat(80)}\n\n`;

      reportContent += `EXECUTIVE SUMMARY:\n`;
      reportContent += `Total Employees: ${employees.length}\n`;
      reportContent += `Total Revenue: ${(8400000).toLocaleString()} SAR\n`;
      reportContent += `Average Attendance Rate: 94.2%\n`;
      reportContent += `Overall Profit Margin: 23.6%\n`;
      reportContent += `Productivity Index: 87.5%\n\n`;

      reportContent += `DETAILED EMPLOYEE ANALYSIS:\n`;
      employees.forEach((emp, index) => {
        const attendanceRate = 92 + Math.random() * 8;
        const monthlyHours = 176 * (attendanceRate / 100);
        const monthlyRevenue = emp.hourlyRate * monthlyHours * 1.2;
        const profitMargin =
          ((monthlyRevenue - emp.hourlyRate * monthlyHours) / monthlyRevenue) *
          100;

        reportContent += `${index + 1}. ${emp.name} (${emp.department})\n`;
        reportContent += `   Attendance Rate: ${attendanceRate.toFixed(1)}%\n`;
        reportContent += `   Monthly Hours: ${monthlyHours.toFixed(1)}\n`;
        reportContent += `   Hourly Rate: ${emp.hourlyRate} SAR\n`;
        reportContent += `   Monthly Revenue: ${monthlyRevenue.toLocaleString()} SAR\n`;
        reportContent += `   Profit Margin: ${profitMargin.toFixed(1)}%\n`;
        reportContent += `   Performance Score: ${(
          (attendanceRate * profitMargin) /
          100
        ).toFixed(1)}\n\n`;
      });

      reportContent += `RECOMMENDATIONS:\n`;
      reportContent += `1. Focus on improving attendance rates for employees below 90%\n`;
      reportContent += `2. Consider performance bonuses for high-performing employees\n`;
      reportContent += `3. Implement additional training for employees with low profit margins\n`;
      reportContent += `4. Review hourly rates for optimal profitability\n\n`;

      reportContent += `Report generated by: Attendance & Financial Analysis System\n`;
      reportContent += `Date: ${new Date().toLocaleDateString()}\n`;

      const blob = new Blob([reportContent], {
        type: "text/plain;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `comprehensive_attendance_financial_report_${
          new Date().toISOString().split("T")[0]
        }.txt`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم إنشاء التقرير الشامل بنجاح!"
          : "Comprehensive report generated successfully!"
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Issued":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Sent":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Overdue":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Draft":
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredLeaves = leaves?.filter((leave) => {
    // match by selected employee/user
    const matchesEmployee =
      selectedEmployee === "All" ||
      leave.beneficiaryId?._id === selectedEmployee;

    // match by status filter (if you have one)
    // const matchesStatus = !statusFilter || leave.status === statusFilter;

    // match by search filter (if you have one)
    // const matchesSearch =
    //   !searchTerm ||
    //   leave.beneficiaryId?.first_name
    //     ?.toLowerCase()
    //     .includes(searchTerm.toLowerCase()) ||
    //   leave.beneficiaryId?.last_name
    //     ?.toLowerCase()
    //     .includes(searchTerm.toLowerCase()) ||
    //   leave.beneficiaryId?.username
    //     ?.toLowerCase()
    //     .includes(searchTerm.toLowerCase());

    // return matchesEmployee && matchesStatus && matchesSearch;
    return matchesEmployee;
  });

  console.log(filteredLeaves);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isArabic ? "تتبع الإجازات" : "Leave Tracking"}
            </h2>
            <p className="text-gray-600 mt-1">
              {isArabic
                ? "إدارة شاملة لإجازات الموظفين"
                : "Comprehensive employee leave management"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLeaveRequest(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {isArabic ? "طلب إجازة" : "Request Leave"}
            </button>
            {/* <button
              onClick={generateFinancialReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              {isArabic ? "التقرير المالي" : "Financial Report"}
            </button>
            <button
              onClick={generateCombinedReport}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              {isArabic ? "التقرير الشامل" : "Combined Report"}
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              {isArabic ? "الإعدادات" : "Settings"}
            </button> */}
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          {isArabic ? "نظام إدارة الإجازات" : "Leave Management System"}
        </h4>
        <p className="text-sm text-blue-700">
          {isArabic
            ? "تقديم وإدارة طلبات الإجازات مع تتبع الرصيد والموافقات"
            : "Submit and manage leave requests with balance tracking and approvals"}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "users"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {isArabic ? "المستخدمون" : "Users"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "employees"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {isArabic ? "الموظفون" : "Employees"}
              </div>
            </button>
            {/* ------------------------- */}
            {/* <button
              onClick={() => setActiveTab("manual")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "manual"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                {isArabic ? "الإدخال اليدوي" : "Manual Entry"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "schedule"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {isArabic ? "الجدولة" : "Scheduling"}
              </div>
            </button> */}
            {/* <button
              onClick={() => setActiveTab("leave")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "leave"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {isArabic ? "إدارة الإجازات" : "Leave Management"}
              </div>
            </button> */}
            {/* <button
              onClick={() => setActiveTab("reports")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "reports"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? "التقارير" : "Reports"}
              </div>
            </button> */}
          </nav>
        </div>

        {/* active tabs */}
        <div className="p-6">
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "إدارة الإجازات" : "Leave Management"}
                </h3>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="All">
                      {isArabic ? "اختر المستخدمين" : "Select Users"}
                    </option>

                    {leaves
                      ?.filter((leave) => leave.beneficiaryType === "user")
                      .map((leave) => (
                        <option
                          key={leave.beneficiaryId?._id}
                          value={leave.beneficiaryId?._id}
                        >
                          {leave.beneficiaryId
                            ? `${leave.beneficiaryId.nameEn || "-"}`
                            : isArabic
                            ? "غير معروف"
                            : "Unknown"}
                        </option>
                      ))}
                  </select>
                </div>
                {/* <div className="flex items-center gap-3">
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "اختر المستخدمين" : "Select Users"}
                    </option>
                    {employees?.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {isArabic ? emp.nameAr : emp.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowLeaveRequest(true)}
                    disabled={!selectedEmployee}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {isArabic ? "طلب إجازة" : "Request Leave"}
                  </button>
                </div> */}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "اسم المستفيد" : "Beneficiary Name"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "اتصال" : "Contact"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "مدة" : "Duration"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "نوع" : "Type"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الحالة" : "Status"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "تاريخ" : "Date"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeaves
                      ?.filter((leave) => leave.beneficiaryType === "user")
                      .map((leave) => (
                        <tr key={leave._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">
                              {leave.beneficiaryId.nameEn}
                            </div>
                            <div className="text-sm text-gray-500">
                              {leave.beneficiaryId.role}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">
                              {leave.beneficiaryId.mobile_number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {leave.beneficiaryId.email}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            <div>
                              {new Date(leave.startDate).toLocaleDateString()} •{" "}
                              {new Date(leave.endDate).toLocaleDateString()}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                            {leave.leaveType}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                leave.status
                              )}`}
                            >
                              {leave.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            <div>
                              {leave.updatedAt
                                ? `${new Date(
                                    leave.updatedAt
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}`
                                : "NA"}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title={isArabic ? "معاينة" : "Preview"}
                                onClick={() => setSelectedLeave(leave)}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                                onClick={() => handleEditClient(leave._id)}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                onClick={() => handleDeleteLead(leave._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic ? "نظام إدارة الإجازات" : "Leave Management System"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "تقديم وإدارة طلبات الإجازات مع تتبع الرصيد والموافقات"
                    : "Submit and manage leave requests with balance tracking and approvals"}
                </p>
              </div> */}

              {/* <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض طلبات الإجازات هنا..."
                  : "Leave requests will be displayed here..."}
              </div> */}
            </div>
          )}

          {activeTab === "employees" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "إدارة الإجازات" : "Leave Management"}
                </h3>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="All">
                      {isArabic ? "اختر الموظف" : "Select Employee"}
                    </option>

                    {leaves
                      ?.filter((leave) => leave.beneficiaryType === "employee") // only users
                      .map((leave) => (
                        <option
                          key={leave.beneficiaryId?._id}
                          value={leave.beneficiaryId?._id}
                        >
                          {leave.beneficiaryId
                            ? `${leave.beneficiaryId.first_name || ""} ${
                                leave.beneficiaryId.last_name || ""
                              }`
                            : isArabic
                            ? "غير معروف"
                            : "Unknown"}
                        </option>
                      ))}
                  </select>
                </div>
                {/* <div className="flex items-center gap-3">
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "اختر المستخدمين" : "Select Users"}
                    </option>
                    {employees?.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {isArabic ? emp.nameAr : emp.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowLeaveRequest(true)}
                    disabled={!selectedEmployee}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {isArabic ? "طلب إجازة" : "Request Leave"}
                  </button>
                </div> */}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "اسم المستفيد" : "Beneficiary Name"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "اتصال" : "Contact"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "مدة" : "Duration"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "نوع" : "Type"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الحالة" : "Status"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "تاريخ" : "Date"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeaves
                      ?.filter((leave) => leave.beneficiaryType === "employee")
                      .map((leave) => (
                        <tr key={leave._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">
                              {leave.beneficiaryId.first_name +
                                leave.beneficiaryId.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {leave.beneficiaryId.employee_id}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">
                              {leave.beneficiaryId.phone}
                            </div>
                            <div className="text-sm text-gray-500">
                              {leave.beneficiaryId.email}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            <div>
                              {new Date(leave.startDate).toLocaleDateString()} •{" "}
                              {new Date(leave.endDate).toLocaleDateString()}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                            {leave.leaveType}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                leave.status
                              )}`}
                            >
                              {leave.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            <div>
                              {leave.updatedAt
                                ? `${new Date(
                                    leave.updatedAt
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}`
                                : "NA"}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title={isArabic ? "معاينة" : "Preview"}
                                onClick={() => setSelectedLeave(leave)}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                                onClick={() => handleEditClient(leave._id)}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                onClick={() => handleDeleteLead(leave._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic ? "نظام إدارة الإجازات" : "Leave Management System"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "تقديم وإدارة طلبات الإجازات مع تتبع الرصيد والموافقات"
                    : "Submit and manage leave requests with balance tracking and approvals"}
                </p>
              </div> */}

              {/* <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض طلبات الإجازات هنا..."
                  : "Leave requests will be displayed here..."}
              </div> */}
            </div>
          )}

          {/* --------------------- */}
          {/* {activeTab === "manual" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic
                    ? "الإدخال اليدوي للحضور"
                    : "Manual Attendance Entry"}
                </h3>
                <button
                  onClick={() => setShowManualEntry(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isArabic ? "تسجيل حضور" : "Record Attendance"}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic ? "نظام الحضور اليدوي" : "Manual Attendance System"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "إدخال يدوي للحضور مع تتبع الساعات والعمل الإضافي وحسابات الرواتب"
                    : "Manual attendance entry with hours tracking, overtime calculation, and payroll integration"}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض سجلات الحضور المُدخلة يدوياً هنا..."
                  : "Manually entered attendance records will be displayed here..."}
              </div>
            </div>
          )} */}

          {/* {activeTab === "schedule" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "إدارة جداول العمل" : "Work Schedule Management"}
                </h3>
                <button
                  onClick={() => setShowScheduleForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isArabic ? "إنشاء جدول" : "Create Schedule"}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic
                    ? "نظام الجدولة المتقدم"
                    : "Advanced Scheduling System"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "إنشاء وإدارة جداول العمل المرنة مع تتبع الورديات والعمل الإضافي"
                    : "Create and manage flexible work schedules with shift tracking and overtime management"}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض جداول العمل المُنشأة هنا..."
                  : "Created work schedules will be displayed here..."}
              </div>
            </div>
          )} */}

          {/* {activeTab === "leave" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "إدارة الإجازات" : "Leave Management"}
                </h3>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "اختر الموظف" : "Select Employee"}
                    </option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {isArabic ? emp.nameAr : emp.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowLeaveRequest(true)}
                    disabled={!selectedEmployee}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {isArabic ? "طلب إجازة" : "Request Leave"}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic ? "نظام إدارة الإجازات" : "Leave Management System"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "تقديم وإدارة طلبات الإجازات مع تتبع الرصيد والموافقات"
                    : "Submit and manage leave requests with balance tracking and approvals"}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض طلبات الإجازات هنا..."
                  : "Leave requests will be displayed here..."}
              </div>
            </div>
          )} */}

          {/* {activeTab === "reports" && (
            <div className="space-y-6">
              <AttendanceReports isArabic={isArabic} />
            </div>
          )} */}
        </div>
      </div>

      {/* Manual Attendance Entry Modal */}
      {/* {showManualEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "تسجيل حضور يدوي" : "Manual Attendance Entry"}
              </h3>
              <button
                onClick={() => setShowManualEntry(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الموظف" : "Employee"}
                </label>
                <select
                  value={manualAttendance.employeeId}
                  onChange={(e) =>
                    setManualAttendance({
                      ...manualAttendance,
                      employeeId: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">
                    {isArabic ? "اختر الموظف" : "Select Employee"}
                  </option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {isArabic ? emp.nameAr : emp.name} - {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "التاريخ" : "Date"}
                  </label>
                  <input
                    type="date"
                    value={manualAttendance.date}
                    onChange={(e) =>
                      setManualAttendance({
                        ...manualAttendance,
                        date: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الموقع" : "Location"}
                  </label>
                  <input
                    type="text"
                    value={manualAttendance.location}
                    onChange={(e) =>
                      setManualAttendance({
                        ...manualAttendance,
                        location: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder={isArabic ? "موقع العمل" : "Work location"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "ساعات العمل" : "Work Hours"}
                  </label>
                  <input
                    type="number"
                    value={manualAttendance.hoursWorked}
                    onChange={(e) =>
                      setManualAttendance({
                        ...manualAttendance,
                        hoursWorked: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    max="12"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "العمل الإضافي" : "Overtime Hours"}
                  </label>
                  <input
                    type="number"
                    value={manualAttendance.overtimeHours}
                    onChange={(e) =>
                      setManualAttendance({
                        ...manualAttendance,
                        overtimeHours: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    max="8"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "وقت الاستراحة" : "Break Time (hours)"}
                  </label>
                  <input
                    type="number"
                    value={manualAttendance.breakTime}
                    onChange={(e) =>
                      setManualAttendance({
                        ...manualAttendance,
                        breakTime: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    max="3"
                    step="0.25"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "ملاحظات" : "Notes"}
                </label>
                <textarea
                  value={manualAttendance.notes}
                  onChange={(e) =>
                    setManualAttendance({
                      ...manualAttendance,
                      notes: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder={
                    isArabic
                      ? "أي ملاحظات إضافية..."
                      : "Any additional notes..."
                  }
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleManualAttendanceEntry}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "تسجيل الحضور" : "Record Attendance"}
                </button>
                <button
                  onClick={() => setShowManualEntry(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Leave Request Modal */}
      {showLeaveRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "طلب إجازة جديد" : "New Leave Request"}
              </h3>
              <button
                onClick={() => setShowLeaveRequest(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نوع الإجازة" : "Leave Type"}
                </label>
                <select
                  value={newLeaveRequest.leaveType}
                  onChange={(e) =>
                    setNewLeaveRequest({
                      ...newLeaveRequest,
                      leaveType: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Annual Leave">
                    {isArabic ? "إجازة سنوية" : "Annual Leave"}
                  </option>
                  <option value="Sick Leave">
                    {isArabic ? "إجازة مرضية" : "Sick Leave"}
                  </option>
                  <option value="Personal Leave">
                    {isArabic ? "إجازة شخصية" : "Personal Leave"}
                  </option>
                  <option value="Emergency Leave">
                    {isArabic ? "إجازة طارئة" : "Emergency Leave"}
                  </option>
                  <option value="Unpaid Leave">
                    {isArabic ? "إجازة غير مدفوعة" : "Unpaid Leave"}
                  </option>
                  <option value="Other">{isArabic ? "آخر" : "Other"}</option>
                </select>
              </div>

              {/* Beneficiary Selection */}
              <div className="grid grid-cols-2 gap-4">
                {/* First dropdown: User/Employee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "مستخدم / موظف" : "User/Employee"}
                  </label>
                  <select
                    value={newLeaveRequest.beneficiaryType || ""}
                    onChange={(e) =>
                      setNewLeaveRequest({
                        ...newLeaveRequest,
                        beneficiaryType: e.target.value,
                        beneficiaryId: "", // reset when type changes
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">{isArabic ? "اختر" : "Select"}</option>
                    <option value="user">
                      {isArabic ? "المستخدم" : "User"}
                    </option>
                    <option value="employee">
                      {isArabic ? "موظف" : "Employee"}
                    </option>
                  </select>
                </div>

                {/* Second dropdown: Names list */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newLeaveRequest.beneficiaryType === "user"
                      ? isArabic
                        ? "اسم المستخدم"
                        : "User Name"
                      : newLeaveRequest.beneficiaryType === "employee"
                      ? isArabic
                        ? "اسم الموظف"
                        : "Employee Name"
                      : isArabic
                      ? "الاسم"
                      : "Name"}
                  </label>
                  <select
                    value={newLeaveRequest.beneficiaryId || ""}
                    onChange={(e) =>
                      setNewLeaveRequest({
                        ...newLeaveRequest,
                        beneficiaryId: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    disabled={!newLeaveRequest.beneficiaryType}
                  >
                    <option value="">{isArabic ? "اختر" : "Select"}</option>

                    {newLeaveRequest.beneficiaryType === "user" &&
                      users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.nameEn || u.username}
                        </option>
                      ))}

                    {newLeaveRequest.beneficiaryType === "employee" &&
                      employees.map((e) => (
                        <option key={e._id} value={e._id}>
                          {e.personalInfo.fullName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ البداية" : "Start Date"}
                  </label>
                  <input
                    type="date"
                    value={newLeaveRequest.startDate}
                    onChange={(e) =>
                      setNewLeaveRequest({
                        ...newLeaveRequest,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ النهاية" : "End Date"}
                  </label>
                  <input
                    type="date"
                    value={newLeaveRequest.endDate}
                    onChange={(e) =>
                      setNewLeaveRequest({
                        ...newLeaveRequest,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "السبب" : "Reason"}
                </label>
                <textarea
                  value={newLeaveRequest.reason}
                  onChange={(e) =>
                    setNewLeaveRequest({
                      ...newLeaveRequest,
                      reason: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder={
                    isArabic
                      ? "اختياري - سبب طلب الإجازة"
                      : "Optional - reason for leave request"
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleSubmitLeaveRequest}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "تقديم الطلب" : "Submit Request"}
                </button>
                <button
                  onClick={() => setShowLeaveRequest(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Form Modal */}
      {/* {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إنشاء جدول عمل جديد" : "Create New Work Schedule"}
              </h3>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "اسم الجدول" : "Schedule Name"}
                </label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder={
                    isArabic ? "مثال: الوردية الصباحية" : "e.g., Morning Shift"
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "وقت البداية" : "Start Time"}
                  </label>
                  <input
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "وقت النهاية" : "End Time"}
                  </label>
                  <input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic
                    ? "مدة الاستراحة (دقيقة)"
                    : "Break Duration (minutes)"}
                </label>
                <input
                  type="number"
                  value={newSchedule.breakDuration}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      breakDuration: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="0"
                  max="120"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleCreateSchedule}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "إنشاء الجدول" : "Create Schedule"}
                </button>
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* View Leave Details */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isArabic ? "تفاصيل الإجازة" : "Leave Details"}
              </h3>
              <button
                onClick={() => setSelectedLeave(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Leave Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: isArabic
                    ? "اسم الموظف (إنجليزي)"
                    : "Employee Name (English)",
                  value: selectedLeave.beneficiaryId.nameEn
                    ? selectedLeave.beneficiaryId.nameEn
                    : selectedLeave.beneficiaryId.first_name +
                      selectedLeave.beneficiaryId.last_name,
                },
                {
                  label: isArabic
                    ? "اسم الموظف (عربي)"
                    : "Employee Name (Arabic)",
                  value: selectedLeave?.beneficiaryId?.nameAr,
                },
                {
                  label: isArabic ? "الدور" : "Role",
                  value: selectedLeave?.beneficiaryId?.role,
                },
                {
                  label: isArabic ? "رقم الهاتف" : "Phone Number",
                  value: selectedLeave.beneficiaryId.mobile_number
                    ? selectedLeave.beneficiaryId.mobile_number
                    : selectedLeave.beneficiaryId.phone,
                },
                {
                  label: isArabic ? "البريد الإلكتروني" : "Email",
                  value: selectedLeave?.beneficiaryId?.email,
                },
                {
                  label: isArabic ? "نوع الإجازة" : "Leave Type",
                  value: selectedLeave?.leaveType,
                },
                {
                  label: isArabic ? "الحالة" : "Status",
                  value: selectedLeave?.status,
                },
                {
                  label: isArabic ? "تاريخ البداية" : "Start Date",
                  value: selectedLeave?.startDate
                    ? new Date(selectedLeave.startDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "-",
                },
                {
                  label: isArabic ? "تاريخ الانتهاء" : "End Date",
                  value: selectedLeave?.endDate
                    ? new Date(selectedLeave.endDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "-",
                },
                {
                  label: isArabic ? "آخر تحديث" : "Last Updated",
                  value: selectedLeave?.updatedAt
                    ? new Date(selectedLeave.updatedAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "-",
                },
                {
                  label: isArabic ? "سبب" : "Reason",
                  value: selectedLeave?.reason,
                },
              ].map((field, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <span className="text-sm text-gray-500 mb-1">
                    {field.label}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {field.value || "-"}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedLeave(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Request Modal */}
      {editingLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "طلب إجازة جديد" : "New Leave Request"}
              </h3>
              <button
                onClick={() => setEditingLeave(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نوع الإجازة" : "Leave Type"}
                </label>
                <select
                  value={editingLeave.leaveType}
                  onChange={(e) =>
                    setEditingLeave({
                      ...editingLeave,
                      leaveType: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Annual Leave">
                    {isArabic ? "إجازة سنوية" : "Annual Leave"}
                  </option>
                  <option value="Sick Leave">
                    {isArabic ? "إجازة مرضية" : "Sick Leave"}
                  </option>
                  <option value="Personal Leave">
                    {isArabic ? "إجازة شخصية" : "Personal Leave"}
                  </option>
                  <option value="Emergency Leave">
                    {isArabic ? "إجازة طارئة" : "Emergency Leave"}
                  </option>
                  <option value="Unpaid Leave">
                    {isArabic ? "إجازة غير مدفوعة" : "Unpaid Leave"}
                  </option>
                  <option value="Other">{isArabic ? "آخر" : "Other"}</option>
                </select>
              </div>

              {/* Beneficiary Selection */}
              <div className="grid grid-cols-2 gap-4">
                {/* Type: User/Employee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "مستخدم / موظف" : "User/Employee"}
                  </label>
                  <select
                    value={editingLeave.beneficiaryType || ""}
                    onChange={(e) =>
                      setEditingLeave({
                        ...editingLeave,
                        beneficiaryType: e.target.value,
                        beneficiaryId: "", // reset ID if type changes
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">{isArabic ? "اختر" : "Select"}</option>
                    <option value="user">
                      {isArabic ? "المستخدم" : "User"}
                    </option>
                    <option value="employee">
                      {isArabic ? "موظف" : "Employee"}
                    </option>
                  </select>
                </div>

                {/* Name Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editingLeave.beneficiaryType === "user"
                      ? isArabic
                        ? "اسم المستخدم"
                        : "User Name"
                      : editingLeave.beneficiaryType === "employee"
                      ? isArabic
                        ? "اسم الموظف"
                        : "Employee Name"
                      : isArabic
                      ? "الاسم"
                      : "Name"}
                  </label>
                  <select
                    value={editingLeave.beneficiaryId || ""}
                    onChange={(e) =>
                      setEditingLeave({
                        ...editingLeave,
                        beneficiaryId: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    disabled={!editingLeave.beneficiaryType}
                  >
                    <option value="">{isArabic ? "اختر" : "Select"}</option>

                    {editingLeave.beneficiaryType === "user" &&
                      users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.nameEn || u.username}
                        </option>
                      ))}

                    {editingLeave.beneficiaryType === "employee" &&
                      employees.map((e) => (
                        <option key={e._id} value={e._id}>
                          {e.personalInfo.fullName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Dates & Status */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ البداية" : "Start Date"}
                  </label>
                  <input
                    type="date"
                    value={editingLeave.startDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setEditingLeave({
                        ...editingLeave,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ النهاية" : "End Date"}
                  </label>
                  <input
                    type="date"
                    value={editingLeave.endDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setEditingLeave({
                        ...editingLeave,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الحالة" : "Status"}
                  </label>
                  <select
                    value={editingLeave.status || "pending"}
                    onChange={(e) =>
                      setEditingLeave({
                        ...editingLeave,
                        status: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="pending">
                      {isArabic ? "قيد الانتظار" : "Pending"}
                    </option>
                    <option value="approved">
                      {isArabic ? "معتمد" : "Approved"}
                    </option>
                    <option value="rejected">
                      {isArabic ? "مرفوض" : "Rejected"}
                    </option>
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "السبب" : "Reason"}
                </label>
                <textarea
                  value={editingLeave.reason || ""}
                  onChange={(e) =>
                    setEditingLeave({
                      ...editingLeave,
                      reason: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder={
                    isArabic
                      ? "اختياري - سبب طلب الإجازة"
                      : "Optional - reason for leave request"
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleUpdateLeave}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "تحديث الطلب" : "Update Request"}
                </button>
                <button
                  onClick={() => setEditingLeave(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
