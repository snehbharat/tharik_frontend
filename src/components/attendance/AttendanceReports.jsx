import React, { useState, useMemo } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  FileText,
  Filter,
  Search,
  RefreshCw,
  Eye,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export const AttendanceReports = ({ isArabic }) => {
  const [activeReportType, setActiveReportType] = useState("summary");
  const [filters, setFilters] = useState({
    dateRange: "month",
    department: "all",
    employeeType: "all",
    reportType: "summary",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const attendanceData = [
    {
      employeeId: "EMP001",
      employeeName: "Ahmed Al-Rashid",
      department: "Operations",
      totalHours: 176,
      regularHours: 160,
      overtimeHours: 16,
      attendanceDays: 22,
      absentDays: 0,
      lateArrivals: 2,
      attendanceRate: 100,
      productivity: 95,
    },
    {
      employeeId: "EMP002",
      employeeName: "Mohammad Hassan",
      department: "Operations",
      totalHours: 168,
      regularHours: 152,
      overtimeHours: 16,
      attendanceDays: 21,
      absentDays: 1,
      lateArrivals: 1,
      attendanceRate: 95.5,
      productivity: 92,
    },
    {
      employeeId: "EMP003",
      employeeName: "Ali Al-Mahmoud",
      department: "Maintenance",
      totalHours: 180,
      regularHours: 160,
      overtimeHours: 20,
      attendanceDays: 22,
      absentDays: 0,
      lateArrivals: 0,
      attendanceRate: 100,
      productivity: 98,
    },
    {
      employeeId: "EMP004",
      employeeName: "Fatima Al-Zahra",
      department: "Safety",
      totalHours: 172,
      regularHours: 160,
      overtimeHours: 12,
      attendanceDays: 22,
      absentDays: 0,
      lateArrivals: 1,
      attendanceRate: 100,
      productivity: 94,
    },
  ];

  const filteredData = useMemo(() => {
    return attendanceData.filter((employee) => {
      if (
        filters.department !== "all" &&
        employee.department !== filters.department
      ) {
        return false;
      }
      return true;
    });
  }, [attendanceData, filters]);

  const summaryStats = useMemo(() => {
    const totalEmployees = filteredData.length;
    const totalHours = filteredData.reduce(
      (sum, emp) => sum + emp.totalHours,
      0
    );
    const totalRegularHours = filteredData.reduce(
      (sum, emp) => sum + emp.regularHours,
      0
    );
    const totalOvertimeHours = filteredData.reduce(
      (sum, emp) => sum + emp.overtimeHours,
      0
    );
    const averageAttendanceRate =
      filteredData.reduce((sum, emp) => sum + emp.attendanceRate, 0) /
      totalEmployees;
    const averageProductivity =
      filteredData.reduce((sum, emp) => sum + emp.productivity, 0) /
      totalEmployees;

    return {
      totalEmployees,
      totalHours,
      totalRegularHours,
      totalOvertimeHours,
      averageAttendanceRate: averageAttendanceRate || 0,
      averageProductivity: averageProductivity || 0,
    };
  }, [filteredData]);

  const generateReport = async () => {
    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const csvContent = [
        [
          "Employee ID",
          "Employee Name",
          "Department",
          "Total Hours",
          "Regular Hours",
          "Overtime Hours",
          "Attendance Days",
          "Absent Days",
          "Late Arrivals",
          "Attendance Rate (%)",
          "Productivity (%)",
        ],
        ...filteredData.map((emp) => [
          emp.employeeId,
          emp.employeeName,
          emp.department,
          emp.totalHours,
          emp.regularHours,
          emp.overtimeHours,
          emp.attendanceDays,
          emp.absentDays,
          emp.lateArrivals,
          emp.attendanceRate.toFixed(1),
          emp.productivity.toFixed(1),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance_report_${filters.dateRange}_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      URL.revokeObjectURL(url);

      alert(
        isArabic ? "تم إنشاء التقرير بنجاح!" : "Report generated successfully!"
      );
    } catch (error) {
      alert(isArabic ? "فشل في إنشاء التقرير" : "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {isArabic ? "تقارير الحضور والانصراف" : "Attendance Reports"}
            </h3>
            <p className="text-gray-600 mt-1">
              {isArabic
                ? "تقارير شاملة لحضور الموظفين والإنتاجية والتحليلات"
                : "Comprehensive attendance, productivity, and analytics reports"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isGenerating
                ? isArabic
                  ? "جاري الإنشاء..."
                  : "Generating..."
                : isArabic
                ? "تصدير التقرير"
                : "Export Report"}
            </button>
          </div>
        </div>

        {/* Report Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "الفترة الزمنية" : "Date Range"}
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="week">
                {isArabic ? "هذا الأسبوع" : "This Week"}
              </option>
              <option value="month">
                {isArabic ? "هذا الشهر" : "This Month"}
              </option>
              <option value="quarter">
                {isArabic ? "هذا الربع" : "This Quarter"}
              </option>
              <option value="year">
                {isArabic ? "هذا العام" : "This Year"}
              </option>
              <option value="custom">
                {isArabic ? "فترة مخصصة" : "Custom Range"}
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "القسم" : "Department"}
            </label>
            <select
              value={filters.department}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">
                {isArabic ? "جميع الأقسام" : "All Departments"}
              </option>
              <option value="Operations">
                {isArabic ? "العمليات" : "Operations"}
              </option>
              <option value="Maintenance">
                {isArabic ? "الصيانة" : "Maintenance"}
              </option>
              <option value="Safety">{isArabic ? "السلامة" : "Safety"}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "نوع الموظف" : "Employee Type"}
            </label>
            <select
              value={filters.employeeType}
              onChange={(e) =>
                setFilters({ ...filters, employeeType: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">
                {isArabic ? "جميع الموظفين" : "All Employees"}
              </option>
              <option value="full-time">
                {isArabic ? "دوام كامل" : "Full-time"}
              </option>
              <option value="part-time">
                {isArabic ? "دوام جزئي" : "Part-time"}
              </option>
              <option value="contract">
                {isArabic ? "متعاقد" : "Contract"}
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "نوع التقرير" : "Report Type"}
            </label>
            <select
              value={activeReportType}
              onChange={(e) => setActiveReportType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="summary">{isArabic ? "ملخص" : "Summary"}</option>
              <option value="detailed">
                {isArabic ? "تفصيلي" : "Detailed"}
              </option>
              <option value="analytics">
                {isArabic ? "تحليلات" : "Analytics"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {summaryStats.totalEmployees}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "إجمالي الموظفين" : "Total Employees"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {summaryStats.totalHours.toLocaleString()}
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "إجمالي الساعات" : "Total Hours"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {summaryStats.averageAttendanceRate.toFixed(1)}%
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "متوسط الحضور" : "Avg Attendance"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {summaryStats.averageProductivity.toFixed(1)}%
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "متوسط الإنتاجية" : "Avg Productivity"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveReportType("summary")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeReportType === "summary"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? "تقرير ملخص" : "Summary Report"}
              </div>
            </button>
            <button
              onClick={() => setActiveReportType("detailed")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeReportType === "detailed"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isArabic ? "تقرير تفصيلي" : "Detailed Report"}
              </div>
            </button>
            <button
              onClick={() => setActiveReportType("analytics")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeReportType === "analytics"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                {isArabic ? "التحليلات" : "Analytics"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeReportType === "summary" && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900">
                {isArabic ? "ملخص الحضور" : "Attendance Summary"}
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الموظف" : "Employee"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "القسم" : "Department"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "إجمالي الساعات" : "Total Hours"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "العمل الإضافي" : "Overtime"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "معدل الحضور" : "Attendance Rate"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الإنتاجية" : "Productivity"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((employee) => (
                      <tr
                        key={employee.employeeId}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {employee.employeeName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.employeeId}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {employee.department}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {employee.totalHours}h
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {employee.overtimeHours}h
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  employee.attendanceRate >= 95
                                    ? "bg-green-600"
                                    : employee.attendanceRate >= 85
                                    ? "bg-yellow-600"
                                    : "bg-red-600"
                                }`}
                                style={{ width: `${employee.attendanceRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {employee.attendanceRate.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              employee.productivity >= 95
                                ? "bg-green-100 text-green-800"
                                : employee.productivity >= 85
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {employee.productivity.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeReportType === "detailed" && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900">
                {isArabic ? "التقرير التفصيلي" : "Detailed Report"}
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredData.map((employee) => (
                  <div
                    key={employee.employeeId}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          {employee.employeeName}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {employee.department} • {employee.employeeId}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {employee.totalHours}h
                        </div>
                        <div className="text-sm text-gray-500">
                          {isArabic ? "إجمالي الساعات" : "Total Hours"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {isArabic ? "الساعات العادية:" : "Regular Hours:"}
                        </span>
                        <span className="font-medium">
                          {employee.regularHours}h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {isArabic ? "العمل الإضافي:" : "Overtime:"}
                        </span>
                        <span className="font-medium">
                          {employee.overtimeHours}h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {isArabic ? "أيام الحضور:" : "Present Days:"}
                        </span>
                        <span className="font-medium">
                          {employee.attendanceDays}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {isArabic ? "أيام الغياب:" : "Absent Days:"}
                        </span>
                        <span className="font-medium">
                          {employee.absentDays}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {isArabic ? "التأخير:" : "Late Arrivals:"}
                        </span>
                        <span className="font-medium">
                          {employee.lateArrivals}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {isArabic ? "معدل الحضور:" : "Attendance Rate:"}
                        </span>
                        <span className="font-medium text-green-600">
                          {employee.attendanceRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeReportType === "analytics" && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900">
                {isArabic ? "تحليلات الحضور" : "Attendance Analytics"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Performance */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "أداء الأقسام" : "Department Performance"}
                  </h5>
                  <div className="space-y-3">
                    {["Operations", "Maintenance", "Safety"].map((dept) => {
                      const deptData = filteredData.filter(
                        (emp) => emp.department === dept
                      );
                      const avgAttendance =
                        deptData.length > 0
                          ? deptData.reduce(
                              (sum, emp) => sum + emp.attendanceRate,
                              0
                            ) / deptData.length
                          : 0;

                      return (
                        <div
                          key={dept}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-700">{dept}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${avgAttendance}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {avgAttendance.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Overtime Analysis */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "تحليل العمل الإضافي" : "Overtime Analysis"}
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "إجمالي العمل الإضافي:" : "Total Overtime:"}
                      </span>
                      <span className="font-medium">
                        {summaryStats.totalOvertimeHours}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "متوسط العمل الإضافي:" : "Avg Overtime:"}
                      </span>
                      <span className="font-medium">
                        {(
                          summaryStats.totalOvertimeHours /
                          summaryStats.totalEmployees
                        ).toFixed(1)}
                        h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "نسبة العمل الإضافي:" : "Overtime Ratio:"}
                      </span>
                      <span className="font-medium">
                        {(
                          (summaryStats.totalOvertimeHours /
                            summaryStats.totalHours) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trends Chart Placeholder */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h5 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "اتجاهات الحضور" : "Attendance Trends"}
                </h5>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>
                      {isArabic
                        ? "الرسوم البيانية التفاعلية"
                        : "Interactive Charts"}
                    </p>
                    <p className="text-sm">
                      {isArabic
                        ? "سيتم عرض اتجاهات الحضور والتحليلات هنا"
                        : "Attendance trends and analytics will be displayed here"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
