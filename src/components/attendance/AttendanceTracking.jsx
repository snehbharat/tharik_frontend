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

export const AttendanceTracking = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const employees = [
    {
      id: "emp_001",
      name: "Ahmed Al-Rashid",
      nameAr: "أحمد الراشد",
      department: "Operations",
      hourlyRate: 35.0,
    },
    {
      id: "emp_002",
      name: "Mohammad Hassan",
      nameAr: "محمد حسن",
      department: "Operations",
      hourlyRate: 28.0,
    },
    {
      id: "emp_003",
      name: "Ali Al-Mahmoud",
      nameAr: "علي المحمود",
      department: "Maintenance",
      hourlyRate: 32.0,
    },
    {
      id: "emp_004",
      name: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراء",
      department: "Safety",
      hourlyRate: 40.0,
    },
  ];

  const [newLeaveRequest, setNewLeaveRequest] = useState({
    leaveTypeId: "annual",
    startDate: "",
    endDate: "",
    reason: "",
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
      if (!newLeaveRequest.startDate || !newLeaveRequest.endDate) {
        throw new Error("Please select start and end dates");
      }

      await LeaveService.submitLeaveRequest({
        employeeId: selectedEmployee,
        ...newLeaveRequest,
      });

      setNewLeaveRequest({
        leaveTypeId: "annual",
        startDate: "",
        endDate: "",
        reason: "",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isArabic ? "تتبع الحضور والانصراف" : "Attendance Tracking"}
            </h2>
            <p className="text-gray-600 mt-1">
              {isArabic
                ? "إدارة شاملة لحضور الموظفين والجداول والإجازات"
                : "Comprehensive employee attendance, scheduling, and leave management"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={generateAttendanceReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              {isArabic ? "تقرير الحضور" : "Attendance Report"}
            </button>
            <button
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
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
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
            </button>
            <button
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
            </button>
            <button
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
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "manual" && (
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
          )}

          {activeTab === "schedule" && (
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
          )}

          {activeTab === "leave" && (
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
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <AttendanceReports isArabic={isArabic} />
            </div>
          )}
        </div>
      </div>

      {/* Manual Attendance Entry Modal */}
      {showManualEntry && (
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
      )}

      {/* Leave Request Modal */}
      {showLeaveRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نوع الإجازة" : "Leave Type"}
                </label>
                <select
                  value={newLeaveRequest.leaveTypeId}
                  onChange={(e) =>
                    setNewLeaveRequest({
                      ...newLeaveRequest,
                      leaveTypeId: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="annual">
                    {isArabic ? "إجازة سنوية" : "Annual Leave"}
                  </option>
                  <option value="sick">
                    {isArabic ? "إجازة مرضية" : "Sick Leave"}
                  </option>
                  <option value="personal">
                    {isArabic ? "إجازة شخصية" : "Personal Leave"}
                  </option>
                  <option value="emergency">
                    {isArabic ? "إجازة طارئة" : "Emergency Leave"}
                  </option>
                </select>
              </div>

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
      {showScheduleForm && (
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
      )}
    </div>
  );
};
