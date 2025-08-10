import React, { useState } from "react";
import {
  UserCheck,
  Users,
  Calendar,
  FileText,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Shield,
  Download,
  Plus,
  Save,
  X,
  Search,
  Filter,
  Upload,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Globe,
  Zap,
} from "lucide-react";

export const HRDepartment = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("employees");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  const hrMetrics = {
    totalEmployees: 186,
    activeEmployees: 175,
    newHires: 12,
    turnoverRate: 8.5,
    trainingHours: 2340,
    complianceScore: 96,
    iqamaRenewals: 15,
    gosiCompliance: 100,
    averageAge: 32.5,
    averageTenure: 3.2,
    satisfactionScore: 4.2,
    retentionRate: 91.5,
    diversityIndex: 78,
    skillsGapIndex: 23,
    performanceScore: 87.3,
    engagementLevel: 82,
  };

  const [employees, setEmployees] = useState([
    {
      id: 1,
      nameEn: "Ahmed Al-Rashid",
      nameAr: "أحمد الراشد",
      position: "Site Supervisor",
      department: "Operations",
      hireDate: "2022-03-15",
      iqamaNumber: "2123456789",
      iqamaExpiry: "2025-03-15",
      gosiStatus: "Active",
      salary: 4500,
      performance: "Excellent",
      trainingStatus: "Up to Date",
      email: "ahmed.rashid@amoagc.sa",
      phone: "+966501234567",
      location: "Dhahran Site",
      manager: "Operations Manager",
      skills: ["Leadership", "Safety Management", "Project Coordination"],
      certifications: ["OSHA Certified", "Project Management"],
      lastReview: "2024-06-15",
      nextReview: "2024-12-15",
    },
    {
      id: 2,
      nameEn: "Mohammad Hassan",
      nameAr: "محمد حسن",
      position: "Heavy Equipment Operator",
      department: "Operations",
      hireDate: "2021-08-20",
      iqamaNumber: "2234567890",
      iqamaExpiry: "2025-01-20",
      gosiStatus: "Active",
      salary: 3800,
      performance: "Good",
      trainingStatus: "Needs Update",
      email: "mohammad.hassan@amoagc.sa",
      phone: "+966502345678",
      location: "Jubail Site",
      manager: "Site Supervisor",
      skills: ["Heavy Machinery", "Equipment Maintenance", "Safety Protocols"],
      certifications: ["Heavy Equipment License", "Safety Training"],
      lastReview: "2024-03-20",
      nextReview: "2024-09-20",
    },
    {
      id: 3,
      nameEn: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراء",
      position: "HR Coordinator",
      department: "Human Resources",
      hireDate: "2023-01-10",
      iqamaNumber: "2345678901",
      iqamaExpiry: "2024-12-30",
      gosiStatus: "Active",
      salary: 5200,
      performance: "Excellent",
      trainingStatus: "Up to Date",
      email: "fatima.zahra@amoagc.sa",
      phone: "+966503456789",
      location: "Main Office",
      manager: "HR Manager",
      skills: ["Employee Relations", "Recruitment", "Training Coordination"],
      certifications: ["HR Professional", "Training Specialist"],
      lastReview: "2024-07-10",
      nextReview: "2025-01-10",
    },
  ]);

  const [newEmployee, setNewEmployee] = useState({
    nameEn: "",
    nameAr: "",
    position: "",
    department: "Operations",
    hireDate: "",
    iqamaNumber: "",
    iqamaExpiry: "",
    gosiStatus: "Active",
    salary: 0,
    performance: "Good",
    trainingStatus: "Needs Update",
    email: "",
    phone: "",
    location: "",
    manager: "",
  });

  const recruitmentPipeline = [
    {
      position: "Senior Site Engineer",
      positionAr: "مهندس موقع أول",
      department: "Operations",
      applicants: 24,
      interviewed: 8,
      shortlisted: 3,
      status: "Final Interview",
      urgency: "High",
      hiringManager: "Operations Director",
      expectedStartDate: "2025-01-15",
      budgetAllocated: 8500,
      skillsRequired: ["Project Management", "Engineering", "Leadership"],
    },
    {
      position: "Heavy Equipment Mechanic",
      positionAr: "ميكانيكي معدات ثقيلة",
      department: "Maintenance",
      applicants: 18,
      interviewed: 5,
      shortlisted: 2,
      status: "Technical Assessment",
      urgency: "Medium",
      hiringManager: "Maintenance Supervisor",
      expectedStartDate: "2025-02-01",
      budgetAllocated: 4200,
      skillsRequired: [
        "Mechanical Skills",
        "Equipment Maintenance",
        "Troubleshooting",
      ],
    },
    {
      position: "Safety Officer",
      positionAr: "مسؤول السلامة",
      department: "Safety",
      applicants: 15,
      interviewed: 6,
      shortlisted: 4,
      status: "Background Check",
      urgency: "High",
      hiringManager: "Safety Manager",
      expectedStartDate: "2024-12-20",
      budgetAllocated: 6000,
      skillsRequired: ["Safety Management", "Risk Assessment", "Compliance"],
    },
  ];

  const trainingPrograms = [
    {
      name: "Safety & Health Training",
      nameAr: "تدريب السلامة والصحة المهنية",
      participants: 45,
      duration: "16 hours",
      completion: 89,
      nextSession: "2024-12-20",
      mandatory: true,
      instructor: "Safety Specialist",
      cost: 15000,
      certification: "OSHA Certificate",
      location: "Training Center",
    },
    {
      name: "Equipment Operation Certification",
      nameAr: "شهادة تشغيل المعدات",
      participants: 32,
      duration: "24 hours",
      completion: 75,
      nextSession: "2024-12-25",
      mandatory: true,
      instructor: "Equipment Specialist",
      cost: 22000,
      certification: "Equipment Operator License",
      location: "Field Training Site",
    },
    {
      name: "Leadership Development",
      nameAr: "تطوير القيادة",
      participants: 12,
      duration: "32 hours",
      completion: 67,
      nextSession: "2025-01-05",
      mandatory: false,
      instructor: "Leadership Coach",
      cost: 35000,
      certification: "Leadership Certificate",
      location: "Conference Room",
    },
  ];

  const complianceItems = [
    {
      item: "Iqama Renewals",
      itemAr: "تجديد الإقامات",
      total: 186,
      compliant: 171,
      pending: 15,
      overdue: 0,
      percentage: 92,
      deadline: "2024-12-31",
      responsible: "HR Coordinator",
      priority: "High",
    },
    {
      item: "GOSI Registration",
      itemAr: "تسجيل التأمينات الاجتماعية",
      total: 186,
      compliant: 186,
      pending: 0,
      overdue: 0,
      percentage: 100,
      deadline: "Ongoing",
      responsible: "Payroll Specialist",
      priority: "Critical",
    },
    {
      item: "Medical Insurance",
      itemAr: "التأمين الطبي",
      total: 186,
      compliant: 182,
      pending: 4,
      overdue: 0,
      percentage: 98,
      deadline: "2025-01-31",
      responsible: "Benefits Administrator",
      priority: "Medium",
    },
    {
      item: "Safety Training",
      itemAr: "تدريب السلامة",
      total: 186,
      compliant: 165,
      pending: 18,
      overdue: 3,
      percentage: 89,
      deadline: "2024-12-31",
      responsible: "Training Coordinator",
      priority: "High",
    },
  ];

  // Enhanced analytics data
  const departmentStats = [
    {
      name: "Operations",
      nameAr: "العمليات",
      count: 125,
      percentage: 67.2,
      avgSalary: 4200,
      satisfaction: 4.1,
    },
    {
      name: "Human Resources",
      nameAr: "الموارد البشرية",
      count: 8,
      percentage: 4.3,
      avgSalary: 5800,
      satisfaction: 4.5,
    },
    {
      name: "Finance",
      nameAr: "المالية",
      count: 12,
      percentage: 6.5,
      avgSalary: 5200,
      satisfaction: 4.2,
    },
    {
      name: "Maintenance",
      nameAr: "الصيانة",
      count: 28,
      percentage: 15.1,
      avgSalary: 3800,
      satisfaction: 4.0,
    },
    {
      name: "Safety",
      nameAr: "السلامة",
      count: 13,
      percentage: 7.0,
      avgSalary: 4800,
      satisfaction: 4.3,
    },
  ];

  const performanceDistribution = [
    { rating: "Excellent", ratingAr: "ممتاز", count: 45, percentage: 24.2 },
    { rating: "Good", ratingAr: "جيد", count: 89, percentage: 47.8 },
    { rating: "Average", ratingAr: "متوسط", count: 42, percentage: 22.6 },
    {
      rating: "Needs Improvement",
      ratingAr: "يحتاج تحسين",
      count: 10,
      percentage: 5.4,
    },
  ];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      !searchTerm ||
      employee.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.nameAr.includes(searchTerm) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || employee.department === filterDepartment;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && employee.gosiStatus === "Active") ||
      (filterStatus === "needs_training" &&
        employee.trainingStatus === "Needs Update");
    return matchesSearch && matchesDepartment && matchesStatus;
  });
  const handleAddEmployee = () => {
    if (
      !newEmployee.nameEn ||
      !newEmployee.position ||
      !newEmployee.iqamaNumber ||
      !newEmployee.email
    ) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    const employee = {
      ...newEmployee,
      id: Math.max(...employees.map((e) => e.id)) + 1,
    };

    setEmployees([...employees, employee]);
    setNewEmployee({
      nameEn: "",
      nameAr: "",
      position: "",
      department: "Operations",
      hireDate: "",
      iqamaNumber: "",
      iqamaExpiry: "",
      gosiStatus: "Active",
      salary: 0,
      performance: "Good",
      trainingStatus: "Needs Update",
      email: "",
      phone: "",
      location: "",
      manager: "",
    });
    setShowAddEmployee(false);
    alert(isArabic ? "تم إضافة الموظف بنجاح!" : "Employee added successfully!");
  };

  const handleExportEmployees = () => {
    try {
      const csvContent = [
        // CSV Headers
        [
          "Employee Name (EN)",
          "Employee Name (AR)",
          "Position",
          "Department",
          "Hire Date",
          "Iqama Number",
          "Iqama Expiry",
          "GOSI Status",
          "Salary",
          "Performance",
          "Training Status",
          "Email",
          "Phone",
          "Location",
          "Manager",
        ],
        // CSV Data
        ...filteredEmployees.map((emp) => [
          emp.nameEn,
          emp.nameAr,
          emp.position,
          emp.department,
          emp.hireDate,
          emp.iqamaNumber,
          emp.iqamaExpiry,
          emp.gosiStatus,
          emp.salary.toString(),
          emp.performance,
          emp.trainingStatus,
          emp.email || "",
          emp.phone || "",
          emp.location || "",
          emp.manager || "",
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `employees_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم تصدير بيانات الموظفين بنجاح!"
          : "Employee data exported successfully!"
      );
    } catch (error) {
      console.error("Export error:", error);
      alert(
        isArabic ? "حدث خطأ أثناء التصدير" : "Error occurred during export"
      );
    }
  };

  const handleGenerateReports = () => {
    try {
      // Generate comprehensive employee report
      let reportContent = "";
      reportContent += `AMOAGC AL-MAJMAAH - EMPLOYEE REPORT\n`;
      reportContent += `Generated on: ${new Date().toLocaleString()}\n`;
      reportContent += `${"=".repeat(80)}\n\n`;

      reportContent += `SUMMARY:\n`;
      reportContent += `Total Employees: ${hrMetrics.totalEmployees}\n`;
      reportContent += `Active Employees: ${hrMetrics.activeEmployees}\n`;
      reportContent += `New Hires This Month: ${hrMetrics.newHires}\n`;
      reportContent += `Turnover Rate: ${hrMetrics.turnoverRate}%\n`;
      reportContent += `Training Hours: ${hrMetrics.trainingHours}\n`;
      reportContent += `Compliance Score: ${hrMetrics.complianceScore}%\n\n`;

      reportContent += `${"=".repeat(80)}\n`;
      reportContent += `EMPLOYEE DETAILS:\n`;
      reportContent += `${"=".repeat(80)}\n\n`;

      employees.forEach((emp, index) => {
        reportContent += `Employee ${index + 1}: ${emp.nameEn} (${
          emp.nameAr
        })\n`;
        reportContent += `${"=".repeat(50)}\n`;
        reportContent += `Position:         ${emp.position}\n`;
        reportContent += `Department:       ${emp.department}\n`;
        reportContent += `Hire Date:        ${emp.hireDate}\n`;
        reportContent += `Iqama Number:     ${emp.iqamaNumber}\n`;
        reportContent += `Iqama Expiry:     ${emp.iqamaExpiry}\n`;
        reportContent += `GOSI Status:      ${emp.gosiStatus}\n`;
        reportContent += `Salary:           ${emp.salary.toLocaleString()} SAR\n`;
        reportContent += `Performance:      ${emp.performance}\n`;
        reportContent += `Training Status:  ${emp.trainingStatus}\n\n`;

        // Check for alerts
        const iqamaExpiry = new Date(emp.iqamaExpiry);
        const today = new Date();
        const daysToExpiry = Math.ceil(
          (iqamaExpiry.getTime() - today.getTime()) / (1000 * 3600 * 24)
        );

        if (daysToExpiry <= 90) {
          reportContent += `⚠️  ALERT: Iqama expires in ${daysToExpiry} days\n`;
        }
        if (emp.trainingStatus === "Needs Update") {
          reportContent += `⚠️  ALERT: Training update required\n`;
        }
        reportContent += `\n`;
      });

      reportContent += `${"=".repeat(80)}\n`;
      reportContent += `COMPLIANCE STATUS:\n`;
      reportContent += `${"=".repeat(80)}\n\n`;

      complianceItems.forEach((item) => {
        reportContent += `${item.item}:\n`;
        reportContent += `  Total: ${item.total}\n`;
        reportContent += `  Compliant: ${item.compliant}\n`;
        reportContent += `  Pending: ${item.pending}\n`;
        reportContent += `  Overdue: ${item.overdue}\n`;
        reportContent += `  Percentage: ${item.percentage}%\n\n`;
      });

      reportContent += `${"=".repeat(80)}\n`;
      reportContent += `TRAINING PROGRAMS:\n`;
      reportContent += `${"=".repeat(80)}\n\n`;

      trainingPrograms.forEach((program) => {
        reportContent += `${program.name}:\n`;
        reportContent += `  Participants: ${program.participants}\n`;
        reportContent += `  Duration: ${program.duration}\n`;
        reportContent += `  Completion: ${program.completion}%\n`;
        reportContent += `  Next Session: ${program.nextSession}\n`;
        reportContent += `  Mandatory: ${program.mandatory ? "Yes" : "No"}\n\n`;
      });

      reportContent += `Report generated by: HR Department\n`;
      reportContent += `Date: ${new Date().toLocaleDateString()}\n`;

      const blob = new Blob([reportContent], {
        type: "text/plain;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `hr_comprehensive_report_${new Date().toISOString().split("T")[0]}.txt`
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
      console.error("Report generation error:", error);
      alert(
        isArabic
          ? "حدث خطأ أثناء إنشاء التقرير"
          : "Error occurred during report generation"
      );
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "Excellent":
        return "bg-green-100 text-green-800";
      case "Good":
        return "bg-blue-100 text-blue-800";
      case "Average":
        return "bg-yellow-100 text-yellow-800";
      case "Needs Improvement":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "قسم الموارد البشرية" : "Human Resources Department"}
        </h1>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            {isArabic ? "استيراد البيانات" : "Import Data"}
          </button>
          <button
            onClick={handleExportEmployees}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير الموظفين" : "Export Employees"}
          </button>
          <button
            onClick={handleGenerateReports}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            {isArabic ? "تقرير شامل" : "Generate Report"}
          </button>
          <button
            onClick={() => setShowAddEmployee(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "إضافة موظف" : "Add Employee"}
          </button>
        </div>
      </div>

      {/* HR Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {hrMetrics.totalEmployees}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "إجمالي الموظفين" : "Total Employees"}
              </div>
            </div>
          </div>
          <div className="text-xs text-blue-600">
            {hrMetrics.activeEmployees} {isArabic ? "نشط" : "active"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {hrMetrics.newHires}
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "التوظيف الجديد" : "New Hires"}
              </div>
            </div>
          </div>
          <div className="text-xs text-green-600">
            {isArabic ? "هذا الشهر" : "This Month"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {hrMetrics.trainingHours}
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "ساعات التدريب" : "Training Hours"}
              </div>
            </div>
          </div>
          <div className="text-xs text-purple-600">
            {isArabic ? "هذا العام" : "This Year"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {hrMetrics.complianceScore}%
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "نقاط الامتثال" : "Compliance Score"}
              </div>
            </div>
          </div>
          <div className="text-xs text-yellow-600">
            {isArabic ? "متوافق" : "Compliant"}
          </div>
        </div>
      </div>

      {/* Enhanced HR Analytics Dashboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isArabic ? "لوحة تحكم الموارد البشرية" : "HR Analytics Dashboard"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {hrMetrics.averageAge}
            </div>
            <div className="text-sm text-blue-700">
              {isArabic ? "متوسط العمر" : "Average Age"}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {hrMetrics.averageTenure}
            </div>
            <div className="text-sm text-green-700">
              {isArabic ? "متوسط الخدمة (سنوات)" : "Avg Tenure (years)"}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {hrMetrics.satisfactionScore}/5
            </div>
            <div className="text-sm text-purple-700">
              {isArabic ? "رضا الموظفين" : "Employee Satisfaction"}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {hrMetrics.retentionRate}%
            </div>
            <div className="text-sm text-yellow-700">
              {isArabic ? "معدل الاحتفاظ" : "Retention Rate"}
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "employees"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {isArabic ? "الموظفون" : "Employees"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("recruitment")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "recruitment"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                {isArabic ? "التوظيف" : "Recruitment"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("training")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "training"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {isArabic ? "التدريب" : "Training"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("compliance")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "compliance"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {isArabic ? "الامتثال" : "Compliance"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "analytics"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? "التحليلات" : "Analytics"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("development")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "development"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? "التطوير المهني" : "Development"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "employees" && (
            <div className="space-y-6">
              {/* Enhanced Search and Filter Controls */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={
                        isArabic
                          ? "البحث في الموظفين..."
                          : "Search employees..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                    />
                  </div>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">
                      {isArabic ? "جميع الأقسام" : "All Departments"}
                    </option>
                    <option value="Operations">
                      {isArabic ? "العمليات" : "Operations"}
                    </option>
                    <option value="Human Resources">
                      {isArabic ? "الموارد البشرية" : "Human Resources"}
                    </option>
                    <option value="Finance">
                      {isArabic ? "المالية" : "Finance"}
                    </option>
                    <option value="Maintenance">
                      {isArabic ? "الصيانة" : "Maintenance"}
                    </option>
                    <option value="Safety">
                      {isArabic ? "السلامة" : "Safety"}
                    </option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">
                      {isArabic ? "جميع الحالات" : "All Status"}
                    </option>
                    <option value="active">
                      {isArabic ? "نشط" : "Active"}
                    </option>
                    <option value="needs_training">
                      {isArabic ? "يحتاج تدريب" : "Needs Training"}
                    </option>
                  </select>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded ${
                        viewMode === "list"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded ${
                        viewMode === "grid"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {isArabic ? "عرض" : "Showing"} {filteredEmployees.length}{" "}
                  {isArabic ? "من" : "of"} {employees.length}{" "}
                  {isArabic ? "موظف" : "employees"}
                </div>
              </div>

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
                              <div className="flex items-center gap-1 text-gray-600">
                                <Mail className="w-3 h-3" />
                                <span>{employee.email || "N/A"}</span>
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
                              {new Date(employee.iqamaExpiry) <
                                new Date(
                                  Date.now() + 90 * 24 * 60 * 60 * 1000
                                ) && (
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(
                                employee.performance
                              )}`}
                            >
                              {employee.performance}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800 p-1 rounded">
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
            </div>
          )}

          {activeTab === "recruitment" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {isArabic ? "حالة التوظيف" : "Recruitment Status"}
                </h3>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "3 مناصب مفتوحة مع 57 متقدم إجمالي"
                    : "3 open positions with 57 total applicants"}
                </p>
              </div>

              <div className="grid gap-6">
                {recruitmentPipeline.map((position, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {isArabic ? position.positionAr : position.position}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {position.department}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                          <span>
                            {isArabic ? "مدير التوظيف:" : "Hiring Manager:"}{" "}
                            {position.hiringManager}
                          </span>
                          <span>•</span>
                          <span>
                            {isArabic ? "الميزانية:" : "Budget:"}{" "}
                            {position.budgetAllocated.toLocaleString()} SAR
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getUrgencyColor(
                          position.urgency
                        )}`}
                      >
                        {position.urgency} Priority
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "المتقدمون" : "Applicants"}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {position.applicants}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "المقابلات" : "Interviewed"}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {position.interviewed}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "القائمة المختصرة" : "Shortlisted"}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {position.shortlisted}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "الحالة" : "Status"}
                        </div>
                        <div className="text-sm font-semibold text-blue-600">
                          {position.status}
                        </div>
                      </div>
                    </div>

                    {/* Skills Required */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-800 mb-2">
                        {isArabic ? "المهارات المطلوبة:" : "Required Skills:"}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {position.skillsRequired.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {isArabic
                        ? "تاريخ البدء المتوقع:"
                        : "Expected Start Date:"}{" "}
                      {position.expectedStartDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "training" && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  {isArabic
                    ? "برامج التدريب النشطة"
                    : "Active Training Programs"}
                </h3>
                <p className="text-sm text-green-700">
                  {isArabic
                    ? "3 برامج تدريبية نشطة مع 89 مشارك"
                    : "3 active training programs with 89 participants"}
                </p>
              </div>

              <div className="grid gap-6">
                {trainingPrograms.map((program, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {isArabic ? program.nameAr : program.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>
                            {program.participants}{" "}
                            {isArabic ? "مشارك" : "participants"}
                          </span>
                          <span>{program.duration}</span>
                          <span>
                            {isArabic ? "المدرب:" : "Instructor:"}{" "}
                            {program.instructor}
                          </span>
                          <span>
                            {isArabic ? "التكلفة:" : "Cost:"}{" "}
                            {program.cost.toLocaleString()} SAR
                          </span>
                          {program.mandatory && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                              {isArabic ? "إجباري" : "Mandatory"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {program.completion}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "مكتمل" : "Complete"}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{isArabic ? "التقدم" : "Progress"}</span>
                        <span>{program.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${program.completion}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          {isArabic ? "الموقع:" : "Location:"}
                        </span>
                        <div className="text-gray-900">{program.location}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          {isArabic ? "الشهادة:" : "Certification:"}
                        </span>
                        <div className="text-gray-900">
                          {program.certification}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          {isArabic ? "الجلسة القادمة:" : "Next Session:"}
                        </span>
                        <div className="text-gray-900">
                          {program.nextSession}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {isArabic ? "الجلسة القادمة:" : "Next Session:"}
                      </span>{" "}
                      {program.nextSession}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "compliance" && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {isArabic ? "تنبيهات الامتثال" : "Compliance Alerts"}
                </h3>
                <p className="text-sm text-yellow-700">
                  {isArabic
                    ? "15 إقامة تحتاج تجديد خلال الشهرين القادمين"
                    : "15 Iqamas require renewal within the next 2 months"}
                </p>
              </div>

              <div className="grid gap-6">
                {complianceItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isArabic ? item.itemAr : item.item}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {item.percentage}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "متوافق" : "Compliant"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "الإجمالي" : "Total"}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {item.total}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-sm text-green-600">
                          {isArabic ? "متوافق" : "Compliant"}
                        </div>
                        <div className="text-lg font-semibold text-green-900">
                          {item.compliant}
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <div className="text-sm text-yellow-600">
                          {isArabic ? "معلق" : "Pending"}
                        </div>
                        <div className="text-lg font-semibold text-yellow-900">
                          {item.pending}
                        </div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <div className="text-sm text-red-600">
                          {isArabic ? "متأخر" : "Overdue"}
                        </div>
                        <div className="text-lg font-semibold text-red-900">
                          {item.overdue}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          {isArabic ? "الموعد النهائي:" : "Deadline:"}
                        </span>
                        <div className="text-gray-900">{item.deadline}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          {isArabic ? "المسؤول:" : "Responsible:"}
                        </span>
                        <div className="text-gray-900">{item.responsible}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          {isArabic ? "الأولوية:" : "Priority:"}
                        </span>
                        <div
                          className={`font-semibold ${
                            item.priority === "Critical"
                              ? "text-red-600"
                              : item.priority === "High"
                              ? "text-orange-600"
                              : item.priority === "Medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.priority}
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>
                          {isArabic ? "معدل الامتثال" : "Compliance Rate"}
                        </span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.percentage >= 95
                              ? "bg-green-600"
                              : item.percentage >= 85
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic
                  ? "تحليلات الموارد البشرية المتقدمة"
                  : "Advanced HR Analytics"}
              </h3>

              {/* Department Distribution */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic
                    ? "توزيع الموظفين حسب القسم"
                    : "Employee Distribution by Department"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentStats.map((dept, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {isArabic ? dept.nameAr : dept.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {dept.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {dept.count}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isArabic ? "متوسط الراتب:" : "Avg Salary:"}{" "}
                        {dept.avgSalary.toLocaleString()} SAR
                      </div>
                      <div className="text-sm text-gray-600">
                        {isArabic ? "الرضا:" : "Satisfaction:"}{" "}
                        {dept.satisfaction}/5.0
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Distribution */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "توزيع الأداء" : "Performance Distribution"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {performanceDistribution.map((perf, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 text-center"
                    >
                      <div className="text-2xl font-bold text-purple-600">
                        {perf.count}
                      </div>
                      <div className="text-sm text-gray-700">
                        {isArabic ? perf.ratingAr : perf.rating}
                      </div>
                      <div className="text-xs text-gray-500">
                        {perf.percentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HR Metrics Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic
                    ? "ملخص مؤشرات الموارد البشرية"
                    : "HR Metrics Summary"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {hrMetrics.diversityIndex}
                    </div>
                    <div className="text-sm text-gray-700">
                      {isArabic ? "مؤشر التنوع" : "Diversity Index"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {hrMetrics.skillsGapIndex}
                    </div>
                    <div className="text-sm text-gray-700">
                      {isArabic ? "فجوة المهارات" : "Skills Gap Index"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {hrMetrics.performanceScore}
                    </div>
                    <div className="text-sm text-gray-700">
                      {isArabic ? "نقاط الأداء" : "Performance Score"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {hrMetrics.engagementLevel}
                    </div>
                    <div className="text-sm text-gray-700">
                      {isArabic ? "مستوى المشاركة" : "Engagement Level"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "development" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic
                  ? "التطوير المهني والمسار الوظيفي"
                  : "Professional Development & Career Paths"}
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic
                    ? "برامج التطوير المهني"
                    : "Professional Development Programs"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "خطط تطوير شخصية ومسارات وظيفية واضحة لجميع الموظفين"
                    : "Personalized development plans and clear career paths for all employees"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    24
                  </div>
                  <div className="text-sm text-green-700">
                    {isArabic
                      ? "خطط التطوير النشطة"
                      : "Active Development Plans"}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    18
                  </div>
                  <div className="text-sm text-blue-700">
                    {isArabic ? "ترقيات هذا العام" : "Promotions This Year"}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    156K
                  </div>
                  <div className="text-sm text-purple-700">
                    {isArabic
                      ? "ميزانية التطوير (ريال)"
                      : "Development Budget (SAR)"}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض خطط التطوير المهني والمسارات الوظيفية التفصيلية هنا..."
                  : "Detailed professional development plans and career paths will be displayed here..."}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إضافة موظف جديد" : "Add New Employee"}
              </h3>
              <button
                onClick={() => setShowAddEmployee(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (إنجليزي)" : "Name (English)"} *
                  </label>
                  <input
                    type="text"
                    value={newEmployee.nameEn}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, nameEn: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (عربي)" : "Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={newEmployee.nameAr}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, nameAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المنصب" : "Position"} *
                  </label>
                  <input
                    type="text"
                    value={newEmployee.position}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        position: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "القسم" : "Department"}
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        department: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "البريد الإلكتروني" : "Email"} *
                  </label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ التوظيف" : "Hire Date"}
                  </label>
                  <input
                    type="date"
                    value={newEmployee.hireDate}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        hireDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الإقامة" : "Iqama Number"} *
                  </label>
                  <input
                    type="text"
                    value={newEmployee.iqamaNumber}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        iqamaNumber: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "انتهاء الإقامة" : "Iqama Expiry"}
                  </label>
                  <input
                    type="date"
                    value={newEmployee.iqamaExpiry}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        iqamaExpiry: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الراتب" : "Salary"}
                  </label>
                  <input
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        salary: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "موقع العمل" : "Work Location"}
                  </label>
                  <input
                    type="text"
                    value={newEmployee.location}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        location: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المدير المباشر" : "Direct Manager"}
                  </label>
                  <input
                    type="text"
                    value={newEmployee.manager}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        manager: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "حالة التأمينات" : "GOSI Status"}
                  </label>
                  <select
                    value={newEmployee.gosiStatus}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        gosiStatus: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تقييم الأداء" : "Performance"}
                  </label>
                  <select
                    value={newEmployee.performance}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        performance: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleAddEmployee}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ الموظف" : "Save Employee"}
                </button>
                <button
                  onClick={() => setShowAddEmployee(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
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
