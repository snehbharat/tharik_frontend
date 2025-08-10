import React, { useState, useEffect, useMemo } from "react";
import { User, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWorkforceData } from "../../hooks/useWorkforceData";
import { getDaysUntilExpiry } from "../../utils/financialCalculations";

export const PrivateEmployeeDashboard = ({ isArabic = false }) => {
  const { user, isAuthenticated } = useAuth();
  const { employees, attendance } = useWorkforceData();
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get current employee data
  const currentEmployee = useMemo(() => {
    if (!user || !employees) return null;
    return (
      employees.find((emp) => emp.employeeId === user.username) ||
      employees.find((emp) =>
        emp.name.toLowerCase().includes(user.fullName.toLowerCase())
      )
    );
  }, [user, employees]);

  // Calculate employee statistics
  const employeeStats = useMemo(() => {
    if (!currentEmployee || !attendance) return null;

    const employeeAttendance = attendance.filter(
      (record) => record.employeeId === currentEmployee.id
    );

    // Calculate date range based on filter
    const now = new Date();
    let startDate = new Date();

    switch (timeFilter) {
      case "daily":
        startDate.setDate(now.getDate() - 1);
        break;
      case "weekly":
        startDate.setDate(now.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "yearly":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        break;
    }

    const filteredAttendance = employeeAttendance.filter(
      (record) => new Date(record.date) >= startDate
    );

    const totalHoursWorked = filteredAttendance.reduce(
      (sum, record) => sum + record.hoursWorked,
      0
    );
    const totalOvertimeHours = filteredAttendance.reduce(
      (sum, record) => sum + record.overtime,
      0
    );
    const workingDays = filteredAttendance.length;
    const expectedDays =
      timeFilter === "daily"
        ? 1
        : timeFilter === "weekly"
        ? 5
        : timeFilter === "monthly"
        ? 22
        : 250;
    const attendanceRate =
      expectedDays > 0 ? (workingDays / expectedDays) * 100 : 0;
    const averageHoursPerDay =
      workingDays > 0 ? totalHoursWorked / workingDays : 0;

    // Calculate earnings
    const regularEarnings = totalHoursWorked * currentEmployee.hourlyRate;
    const overtimeEarnings =
      totalOvertimeHours * currentEmployee.hourlyRate * 1.5;
    const totalEarnings = regularEarnings + overtimeEarnings;

    // Performance score
    const performanceScore = Math.min(
      100,
      attendanceRate * 0.4 + (averageHoursPerDay / 8) * 100 * 0.6
    );

    // Documents expiring soon
    const documentsExpiring = currentEmployee.documents.filter((doc) => {
      if (!doc.expiryDate) return false;
      const daysUntilExpiry = getDaysUntilExpiry(doc.expiryDate);
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;

    // Generate monthly trend data
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const monthAttendance = employeeAttendance.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });

      const monthHours = monthAttendance.reduce(
        (sum, record) => sum + record.hoursWorked + record.overtime,
        0
      );
      const monthEarnings = monthAttendance.reduce((sum, record) => {
        return (
          sum +
          record.hoursWorked * currentEmployee.hourlyRate +
          record.overtime * currentEmployee.hourlyRate * 1.5
        );
      }, 0);
      const monthAttendanceRate = (monthAttendance.length / 22) * 100;

      monthlyTrend.push({
        month: monthDate.toLocaleDateString("en-US", { month: "short" }),
        hours: monthHours,
        earnings: monthEarnings,
        attendance: monthAttendanceRate,
      });
    }

    return {
      totalHoursWorked,
      totalOvertimeHours,
      attendanceRate,
      averageHoursPerDay,
      totalEarnings,
      performanceScore,
      documentsExpiring,
      completedTasks: Math.floor(Math.random() * 20) + 10,
      pendingTasks: Math.floor(Math.random() * 5) + 1,
      monthlyTrend,
    };
  }, [currentEmployee, attendance, timeFilter]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [timeFilter]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isArabic ? "الوصول مرفوض" : "Access Denied"}
          </h2>
          <p className="text-gray-600">
            {isArabic
              ? "يجب تسجيل الدخول للوصول لهذه الصفحة"
              : "Please log in to access this page"}
          </p>
        </div>
      </div>
    );
  }

  if (!currentEmployee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isArabic ? "ملف الموظف غير موجود" : "Employee Profile Not Found"}
          </h2>
          <p className="text-gray-600">
            {isArabic
              ? "لم يتم العثور على بيانات الموظف"
              : "Employee data not found in the system"}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isArabic
              ? "جاري تحميل لوحة التحكم الشخصية..."
              : "Loading your personal dashboard..."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {currentEmployee.name
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isArabic ? "لوحة التحكم الشخصية" : "Personal Dashboard"}
                </h1>
                <p className="text-gray-600">
                  {isArabic
                    ? `مرحباً ${currentEmployee.name}`
                    : `Welcome, ${currentEmployee.name}`}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {isArabic ? "آخر دخول:" : "Last login:"}{" "}
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {currentEmployee.projectId
                      ? projects.find((p) => p.id === currentEmployee.projectId)
                          ?.name || "Unassigned"
                      : "Unassigned"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">
                  {isArabic
                    ? "إظهار البيانات الحساسة:"
                    : "Show sensitive data:"}
                </label>
                <button
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                >
                  {showSensitiveData ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="daily">{isArabic ? "يومي" : "Daily"}</option>
                <option value="weekly">{isArabic ? "أسبوعي" : "Weekly"}</option>
                <option value="monthly">{isArabic ? "شهري" : "Monthly"}</option>
                <option value="yearly">{isArabic ? "سنوي" : "Yearly"}</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <RefreshCw className="w-4 h-4" />
                {isArabic ? "تحديث" : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {employeeStats
                    ? formatHours(employeeStats.totalHoursWorked)
                    : "0h"}
                </div>
                <div className="text-sm text-blue-700">
                  {isArabic ? "إجمالي الساعات" : "Total Hours"}
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-600">
              {employeeStats
                ? formatHours(employeeStats.totalOvertimeHours)
                : "0h"}{" "}
              {isArabic ? "عمل إضافي" : "overtime"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {employeeStats
                    ? `${employeeStats.attendanceRate.toFixed(1)}%`
                    : "0%"}
                </div>
                <div className="text-sm text-green-700">
                  {isArabic ? "معدل الحضور" : "Attendance Rate"}
                </div>
              </div>
            </div>
            <div className="text-xs text-green-600">
              {employeeStats
                ? `${employeeStats.averageHoursPerDay.toFixed(1)}h`
                : "0h"}{" "}
              {isArabic ? "متوسط يومي" : "daily avg"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                {showSensitiveData ? (
                  <DollarSign className="w-6 h-6 text-white" />
                ) : (
                  <EyeOff className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">
                  {showSensitiveData && employeeStats
                    ? formatCurrency(employeeStats.totalEarnings)
                    : "****"}
                </div>
                <div className="text-sm text-purple-700">
                  {isArabic ? "إجمالي الأرباح" : "Total Earnings"}
                </div>
              </div>
            </div>
            <div className="text-xs text-purple-600">
              {timeFilter} {isArabic ? "فترة" : "period"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-900">
                  {employeeStats
                    ? `${employeeStats.performanceScore.toFixed(0)}%`
                    : "0%"}
                </div>
                <div className="text-sm text-yellow-700">
                  {isArabic ? "نقاط الأداء" : "Performance Score"}
                </div>
              </div>
            </div>
            <div className="text-xs text-yellow-600">
              {currentEmployee.performanceRating || 85}/100{" "}
              {isArabic ? "تقييم" : "rating"}
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              {isArabic ? "اتجاه الأداء الشهري" : "Monthly Performance Trend"}
            </h3>
            {employeeStats && employeeStats.monthlyTrend.length > 0 ? (
              <div className="h-64">
                <ProfitTrendChart
                  data={employeeStats.monthlyTrend.map((item) => ({
                    week: item.month,
                    revenue: item.earnings,
                    costs: item.earnings * 0.7, // Estimated costs
                    profit: item.earnings * 0.3, // Estimated profit
                    margin: 30,
                    projects: 1,
                    employees: 1,
                  }))}
                  isArabic={isArabic}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                {isArabic
                  ? "لا توجد بيانات كافية"
                  : "Insufficient data for chart"}
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              {isArabic ? "المعلومات الشخصية" : "Personal Information"}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {isArabic ? "رقم الموظف:" : "Employee ID:"}
                </span>
                <span className="font-medium text-gray-900">
                  {currentEmployee.employeeId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {isArabic ? "المهنة:" : "Trade:"}
                </span>
                <span className="font-medium text-gray-900">
                  {currentEmployee.trade}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {isArabic ? "الجنسية:" : "Nationality:"}
                </span>
                <span className="font-medium text-gray-900">
                  {currentEmployee.nationality}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {isArabic ? "الهاتف:" : "Phone:"}
                </span>
                <span className="font-medium text-gray-900">
                  {currentEmployee.phoneNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {isArabic ? "الحالة:" : "Status:"}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    currentEmployee.status === "active"
                      ? "bg-green-100 text-green-800"
                      : currentEmployee.status === "on-leave"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentEmployee.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks and Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              {isArabic ? "المهام والأهداف" : "Tasks & Goals"}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    {isArabic ? "المهام المكتملة" : "Completed Tasks"}
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {employeeStats?.completedTasks || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    {isArabic ? "المهام المعلقة" : "Pending Tasks"}
                  </span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {employeeStats?.pendingTasks || 0}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{isArabic ? "معدل الإنجاز" : "Completion Rate"}</span>
                  <span>
                    {employeeStats
                      ? `${Math.round(
                          (employeeStats.completedTasks /
                            (employeeStats.completedTasks +
                              employeeStats.pendingTasks)) *
                            100
                        )}%`
                      : "0%"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: employeeStats
                        ? `${Math.round(
                            (employeeStats.completedTasks /
                              (employeeStats.completedTasks +
                                employeeStats.pendingTasks)) *
                              100
                          )}%`
                        : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {isArabic ? "حالة الوثائق" : "Documents Status"}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {isArabic ? "إجمالي الوثائق:" : "Total Documents:"}
                </span>
                <span className="font-bold text-blue-600">
                  {currentEmployee.documents.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {isArabic ? "تنتهي قريباً:" : "Expiring Soon:"}
                </span>
                <span
                  className={`font-bold ${
                    employeeStats && employeeStats.documentsExpiring > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {employeeStats?.documentsExpiring || 0}
                </span>
              </div>

              {employeeStats && employeeStats.documentsExpiring > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">
                      {isArabic
                        ? "تنبيه: وثائق تنتهي قريباً"
                        : "Alert: Documents Expiring Soon"}
                    </span>
                  </div>
                  <p className="text-sm text-red-700">
                    {isArabic
                      ? "يرجى تجديد الوثائق المنتهية الصلاحية لتجنب أي مشاكل"
                      : "Please renew expiring documents to avoid any issues"}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {currentEmployee.documents.slice(0, 3).map((doc, index) => {
                  const daysUntilExpiry = doc.expiryDate
                    ? getDaysUntilExpiry(doc.expiryDate)
                    : null;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{doc.name}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          daysUntilExpiry === null
                            ? "bg-gray-100 text-gray-600"
                            : daysUntilExpiry <= 0
                            ? "bg-red-100 text-red-800"
                            : daysUntilExpiry <= 30
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {daysUntilExpiry === null
                          ? isArabic
                            ? "لا ينتهي"
                            : "No expiry"
                          : daysUntilExpiry <= 0
                          ? isArabic
                            ? "منتهي"
                            : "Expired"
                          : `${daysUntilExpiry} ${isArabic ? "يوم" : "days"}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            {isArabic ? "الإجراءات السريعة" : "Quick Actions"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Clock className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-800">
                  {isArabic ? "تسجيل الحضور" : "Clock In/Out"}
                </div>
                <div className="text-sm text-blue-600">
                  {isArabic ? "تسجيل وقت العمل" : "Record work time"}
                </div>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <Calendar className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-green-800">
                  {isArabic ? "طلب إجازة" : "Request Leave"}
                </div>
                <div className="text-sm text-green-600">
                  {isArabic ? "تقديم طلب إجازة" : "Submit leave request"}
                </div>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <FileText className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-purple-800">
                  {isArabic ? "عرض الوثائق" : "View Documents"}
                </div>
                <div className="text-sm text-purple-600">
                  {isArabic ? "إدارة الملفات" : "Manage files"}
                </div>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <Download className="w-6 h-6 text-yellow-600" />
              <div className="text-left">
                <div className="font-medium text-yellow-800">
                  {isArabic ? "تحميل التقارير" : "Download Reports"}
                </div>
                <div className="text-sm text-yellow-600">
                  {isArabic ? "تقارير شخصية" : "Personal reports"}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800">
                {isArabic ? "إشعار الخصوصية" : "Privacy Notice"}
              </h4>
              <p className="text-sm text-blue-700">
                {isArabic
                  ? "هذه البيانات خاصة بك فقط ومحمية بأعلى معايير الأمان. لا يمكن لأي شخص آخر الوصول إليها."
                  : "This data is private to you and protected with the highest security standards. No one else can access it."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
