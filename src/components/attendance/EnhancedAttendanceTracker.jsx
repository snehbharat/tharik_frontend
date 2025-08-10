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
  Timer,
  Coffee,
  Play,
  Pause,
  Square,
  FileDigit,
} from "lucide-react";

export const EnhancedAttendanceTracker = ({ isArabic = false }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeView, setActiveView] = useState("timesheet");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedProjectId, setSelectedProjectId] = useState("all");
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [projects] = useState([
    {
      id: "proj_001",
      name: "Aramco Facility Maintenance",
      client: "Saudi Aramco",
      location: "Dhahran Industrial Complex",
      status: "active",
    },
    {
      id: "proj_002",
      name: "SABIC Construction Support",
      client: "SABIC Industries",
      location: "Jubail Industrial City",
      status: "hold",
    },
    {
      id: "proj_003",
      name: "NEOM Infrastructure Development",
      client: "NEOM Development",
      location: "NEOM - Tabuk Province",
      status: "finished",
    },
    {
      id: "proj_004",
      name: "Royal Commission Projects",
      client: "Royal Commission",
      location: "Yanbu Industrial City",
      status: "active",
    },
  ]);

  const [allEmployees] = useState([
    {
      id: "EMP001",
      name: "Ahmed Hassan",
      employeeId: "EMP001",
      trade: "Carpenter",
      nationality: "Saudi",
      phoneNumber: "+966501234567",
      hourlyLaborCost: 50.0,
      billingRate: 150.0,
      overtimeMultiplier: 1.5,
      projectId: "proj_001",
      status: "active",
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "EMP002",
      name: "Mohammad Ali",
      employeeId: "EMP002",
      trade: "Electrician",
      nationality: "Pakistani",
      phoneNumber: "+966502345678",
      hourlyLaborCost: 60.0,
      billingRate: 200.0,
      overtimeMultiplier: 1.5,
      projectId: "proj_001",
      status: "active",
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "EMP003",
      name: "Omar Khalil",
      employeeId: "EMP003",
      trade: "Mason",
      nationality: "Egyptian",
      phoneNumber: "+966503456789",
      hourlyLaborCost: 45.0,
      billingRate: 130.0,
      overtimeMultiplier: 1.5,
      projectId: "proj_001",
      status: "active",
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "EMP004",
      name: "Ali Rahman",
      employeeId: "EMP004",
      trade: "Plumber",
      nationality: "Bangladeshi",
      phoneNumber: "+966504567890",
      hourlyLaborCost: 48.0,
      billingRate: 140.0,
      overtimeMultiplier: 1.5,
      projectId: "proj_001",
      status: "active",
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "EMP005",
      name: "Hassan Al-Mutairi",
      employeeId: "EMP005",
      trade: "Site Supervisor",
      nationality: "Saudi",
      phoneNumber: "+966505678901",
      hourlyLaborCost: 55.0,
      billingRate: 180.0,
      overtimeMultiplier: 1.5,
      projectId: "proj_002",
      status: "active",
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "EMP006",
      name: "Khalid Al-Rashid",
      employeeId: "EMP006",
      trade: "Heavy Equipment Operator",
      nationality: "Pakistani",
      phoneNumber: "+966506789012",
      hourlyLaborCost: 52.0,
      billingRate: 170.0,
      overtimeMultiplier: 1.5,
      projectId: "proj_003",
      status: "active",
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "EMP007",
      name: "Mahmoud Ibrahim",
      employeeId: "EMP007",
      trade: "Safety Officer",
      nationality: "Egyptian",
      phoneNumber: "+966507890123",
      hourlyLaborCost: 58.0,
      billingRate: 190.0,
      overtimeMultiplier: 1.5,
      projectId: "proj_004",
      status: "active",
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const employees =
    selectedProjectId === "all"
      ? allEmployees
      : allEmployees.filter((emp) => emp.projectId === selectedProjectId);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );

  const selectedProject =
    selectedProjectId !== "all"
      ? projects.find((p) => p.id === selectedProjectId)
      : null;

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

  const getAttendanceRecord = (employeeId, date) => {
    return attendanceRecords.find(
      (record) => record.employeeId === employeeId && record.date === date
    );
  };

  const updateAttendanceRecord = (employeeId, date, field, value) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) return;

    let existingRecord = getAttendanceRecord(employeeId, date);

    if (!existingRecord) {
      existingRecord = {
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        employeeId,
        projectId: employee.projectId || "",
        date,
        regularHours: 0,
        overtimeHours: 0,
        totalHours: 0,
        laborCost: 0,
        revenueGenerated: 0,
        dailyProfit: 0,
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setAttendanceRecords((prev) => [...prev, existingRecord]);
    }

    const updatedRecord = { ...existingRecord, [field]: value };
    const financials = calculateFinancials(
      updatedRecord.regularHours,
      updatedRecord.overtimeHours,
      employee
    );

    updatedRecord.totalHours = financials.totalHours;
    updatedRecord.laborCost = financials.laborCost;
    updatedRecord.revenueGenerated = financials.revenueGenerated;
    updatedRecord.dailyProfit = financials.dailyProfit;
    updatedRecord.updatedAt = new Date();

    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const calculateDailyTotals = () => {
    const todayRecords = attendanceRecords.filter(
      (record) => record.date === selectedDate
    );
    return {
      totalEmployees: todayRecords.length,
      totalHours: todayRecords.reduce(
        (sum, record) => sum + record.totalHours,
        0
      ),
      totalLaborCost: todayRecords.reduce(
        (sum, record) => sum + record.laborCost,
        0
      ),
      totalRevenue: todayRecords.reduce(
        (sum, record) => sum + record.revenueGenerated,
        0
      ),
      totalProfit: todayRecords.reduce(
        (sum, record) => sum + record.dailyProfit,
        0
      ),
      averageHours:
        todayRecords.length > 0
          ? todayRecords.reduce((sum, record) => sum + record.totalHours, 0) /
            todayRecords.length
          : 0,
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
  };

  const handleSearchChange = (value) => {
    setProjectSearchTerm(value);
    setShowProjectDropdown(true);
  };

  const clearFilter = () => {
    setSelectedProjectId("all");
    setProjectSearchTerm("");
    setShowProjectDropdown(false);
  };

  const handleSaveAll = () => {
    const todayRecords = attendanceRecords.filter(
      (record) => record.date === selectedDate
    );
    const updatedRecords = todayRecords.map((record) => ({
      ...record,
      status: "submitted",
      updatedAt: new Date(),
    }));

    setAttendanceRecords((prev) =>
      prev.map((record) => {
        const updated = updatedRecords.find((ur) => ur.id === record.id);
        return updated || record;
      })
    );

    alert(
      isArabic
        ? "تم حفظ جميع السجلات بنجاح!"
        : "All attendance records saved successfully!"
    );
  };

  const handleExportSalarySheet = () => {
    const todayRecords = attendanceRecords.filter(
      (record) => record.date === selectedDate
    );

    let csvContent =
      "Employee Name,Employee ID,Trade,Regular Hours,Overtime Hours,Total Hours,Labor Cost (SAR),Revenue Generated (SAR),Daily Profit (SAR)\n";

    todayRecords.forEach((record) => {
      const employee = employees.find((emp) => emp.id === record.employeeId);
      if (employee) {
        csvContent += `${employee.name},${employee.employeeId},${
          employee.trade
        },${record.regularHours},${record.overtimeHours},${
          record.totalHours
        },${record.laborCost.toFixed(2)},${record.revenueGenerated.toFixed(
          2
        )},${record.dailyProfit.toFixed(2)}\n`;
      }
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_${selectedDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(
      isArabic
        ? "تم تصدير كشف الرواتب بنجاح!"
        : "Salary sheet exported successfully!"
    );
  };
  return (
    <div className="p-6 space-y-6">
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
                {employees.length}
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
                        ? `عرض جميع الموظفين (${allEmployees.length})`
                        : `Show all employees (${allEmployees.length})`}
                    </div>
                  </div>
                  {filteredProjects.map((project) => {
                    const projectEmployeeCount = allEmployees.filter(
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
                          {project.client} • {project.location} •{" "}
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
                  {selectedProject.client} • {employees.length}{" "}
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
                {employees.length}
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

      {/* View Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveView("timesheet")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "timesheet"
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
              onClick={() => setActiveView("timeclock")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "timeclock"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                {isArabic ? "ساعة الحضور" : "Time Clock"}
              </div>
            </button>
            <button
              onClick={() => setActiveView("reports")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "reports"
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
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "analytics"
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
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {isArabic ? "حفظ الكل" : "Save All"}
                  </button>
                  <button
                    onClick={handleExportSalarySheet}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {isArabic ? "تصدير" : "Export"}
                  </button>
                </div>
              </div>

              {/* No Employees Message */}
              {employees.length === 0 && selectedProjectId !== "all" && (
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

              {/* Main Attendance Table - Matching Screenshot Format */}
              {employees.length > 0 && (
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
                        {employees.map((employee, index) => {
                          const attendanceRecord = getAttendanceRecord(
                            employee.id,
                            selectedDate
                          );
                          const regularHours =
                            attendanceRecord?.regularHours || 0;
                          const overtimeHours =
                            attendanceRecord?.overtimeHours || 0;
                          const financials = calculateFinancials(
                            regularHours,
                            overtimeHours,
                            employee
                          );

                          return (
                            <tr
                              key={employee.id}
                              className={`hover:bg-gray-50 transition-colors ${
                                index % 2 === 0 ? "bg-gray-25" : "bg-white"
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
                                  className={`text-lg font-bold ${
                                    financials.dailyProfit >= 0
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
                                .filter((r) => r.date === selectedDate)
                                .reduce((sum, r) => sum + r.regularHours, 0)
                                .toFixed(1)}
                              h
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-lg font-bold text-yellow-600">
                              {attendanceRecords
                                .filter((r) => r.date === selectedDate)
                                .reduce((sum, r) => sum + r.overtimeHours, 0)
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
                              className={`text-lg font-bold ${
                                dailyTotals.totalProfit >= 0
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
                (r) => r.date === selectedDate && r.totalHours === 0
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

          {activeView === "timeclock" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-gray-900 mb-2">
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div className="text-lg text-gray-600">
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {employee.trade}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <Play className="w-4 h-4" />
                          {isArabic ? "حضور" : "Clock In"}
                        </button>
                        <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <Coffee className="w-4 h-4" />
                          {isArabic ? "استراحة" : "Break"}
                        </button>
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <Square className="w-4 h-4" />
                          {isArabic ? "انصراف" : "Clock Out"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                    {selectedProject.client} • {employees.length}{" "}
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
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
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
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
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
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    {isArabic ? "إنشاء التحليل" : "Generate Analysis"}
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
                    {["Carpenter", "Electrician", "Mason", "Plumber"]
                      .map((trade) => {
                        const tradeEmployees = employees.filter(
                          (emp) => emp.trade === trade
                        );
                        const tradeRecords = attendanceRecords.filter(
                          (record) => {
                            const employee = employees.find(
                              (emp) => emp.id === record.employeeId
                            );
                            return (
                              employee?.trade === trade &&
                              record.date === selectedDate
                            );
                          }
                        );
                        const tradeProfit = tradeRecords.reduce(
                          (sum, record) => sum + record.dailyProfit,
                          0
                        );

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
                                className={`font-bold ${
                                  tradeProfit >= 0
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
                        className={`font-semibold ${
                          dailyTotals.totalRevenue > 0
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
                    {selectedProjectId !== "all" && selectedProject && (
                      <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                        <span className="text-gray-600">
                          {isArabic ? "المشروع:" : "Project:"}
                        </span>
                        <span className="font-semibold text-purple-600">
                          {selectedProject.client}
                        </span>
                      </div>
                    )}
                  </div>
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
