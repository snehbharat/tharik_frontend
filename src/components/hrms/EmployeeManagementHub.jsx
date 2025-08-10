import React, { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  DollarSign,
  Clock,
  Save,
  X,
  Building2,
  UserCheck,
  Settings,
  BarChart3,
  Shield,
  Bell,
  Star,
  Target,
  BookOpen,
  Camera,
  Briefcase,
  Home,
  Heart,
  Globe,
  Zap,
} from "lucide-react";
import { EmployeeProfileManager } from "./EmployeeProfileManager";
import { OrganizationalChart } from "./OrganizationalChart";
import { PerformanceManagement } from "./PerformanceManagement";
import { DocumentManagement } from "./DocumentManagement";
import { EmployeeAnalytics } from "./EmployeeAnalytics";

export const EmployeeManagementHub = ({ isArabic }) => {
  const [activeModule, setActiveModule] = useState("profiles");
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    department: "",
    team: "",
    status: "",
    jobTitle: "",
    location: "",
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [employees] = useState([
    {
      id: "emp_001",
      employeeId: "EMP001",
      personalInfo: {
        firstName: "Ahmed",
        lastName: "Al-Rashid",
        fullName: "Ahmed Al-Rashid",
        fullNameAr: "أحمد الراشد",
        dateOfBirth: "1985-03-15",
        nationality: "Saudi",
        nationalId: "1234567890",
        maritalStatus: "married",
        gender: "male",
        personalPhone: "+966501234567",
        personalEmail: "ahmed.rashid@email.com",
        homeAddress: {
          street: "King Fahd Road",
          city: "Riyadh",
          state: "Riyadh Province",
          postalCode: "11564",
          country: "Saudi Arabia",
        },
        languages: [
          { language: "Arabic", proficiency: "native" },
          { language: "English", proficiency: "advanced" },
        ],
      },
      professionalInfo: {
        jobTitle: "Site Supervisor",
        jobTitleAr: "مشرف موقع",
        departmentId: "dept_operations",
        employmentType: "full-time",
        workLocation: "Dhahran Industrial Complex",
        hireDate: "2022-03-15",
        workEmail: "ahmed.rashid@amoagc.sa",
        workPhone: "+966112345678",
        salaryInfo: {
          baseSalary: 8500,
          currency: "SAR",
          payFrequency: "monthly",
          allowances: [
            {
              type: "Transportation",
              amount: 500,
              isRecurring: true,
              effectiveDate: "2022-03-15",
            },
            {
              type: "Housing",
              amount: 1200,
              isRecurring: true,
              effectiveDate: "2022-03-15",
            },
          ],
          benefits: [
            {
              type: "Health Insurance",
              description: "Comprehensive medical coverage",
              effectiveDate: "2022-03-15",
            },
            {
              type: "Life Insurance",
              description: "2x annual salary coverage",
              effectiveDate: "2022-03-15",
            },
          ],
          taxInfo: {
            taxId: "TAX001",
            taxBracket: "15%",
            exemptions: 2,
          },
        },
        workSchedule: {
          scheduleType: "standard",
          workingDays: [1, 2, 3, 4, 5, 6],
          startTime: "07:00",
          endTime: "15:00",
          breakDuration: 60,
          overtimeEligible: true,
        },
        reportingStructure: {
          directReports: ["emp_002", "emp_003"],
          reportsTo: "emp_mgr_001",
          dotLineReports: [],
          approvalAuthority: [
            { type: "overtime", limit: 40 },
            { type: "leave", limit: 5 },
          ],
        },
      },
      emergencyContacts: [
        {
          id: "ec_001",
          name: "Fatima Al-Rashid",
          relationship: "Spouse",
          phone: "+966501234568",
          email: "fatima.rashid@email.com",
          isPrimary: true,
        },
      ],
      documents: [
        {
          id: "doc_001",
          employeeId: "emp_001",
          name: "Employment Contract",
          type: "contract",
          category: "legal",
          fileName: "contract_emp001.pdf",
          fileSize: 2048,
          mimeType: "application/pdf",
          uploadDate: new Date("2022-03-15"),
          uploadedBy: "hr_manager",
          isConfidential: true,
          accessLevel: "hr-only",
          version: 1,
          tags: ["contract", "legal", "signed"],
          metadata: {
            keywords: ["employment", "contract", "terms"],
            confidentialityLevel: "confidential",
            legalRequirement: true,
            auditTrail: [],
          },
          approvalStatus: "approved",
          approvedBy: "hr_director",
          approvedAt: new Date("2022-03-15"),
        },
      ],
      photo:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      customFields: {
        badgeNumber: "B001",
        parkingSpot: "A-15",
        securityClearance: "Level 2",
      },
      status: "active",
      createdAt: new Date("2022-03-15"),
      updatedAt: new Date("2024-12-15"),
      createdBy: "hr_system",
      lastModifiedBy: "hr_manager",
    },
  ]);

  const [departments] = useState([
    {
      id: "dept_operations",
      name: "Operations",
      nameAr: "العمليات",
      description: "Field operations and project management",
      headOfDepartment: "emp_mgr_001",
      costCenter: "CC001",
      location: "Main Office",
      budget: 2500000,
      employeeCount: 45,
      isActive: true,
      createdAt: new Date("2022-01-01"),
      updatedAt: new Date("2024-12-15"),
    },
    {
      id: "dept_hr",
      name: "Human Resources",
      nameAr: "الموارد البشرية",
      description: "Employee management and development",
      headOfDepartment: "emp_hr_001",
      costCenter: "CC002",
      location: "Main Office",
      budget: 800000,
      employeeCount: 8,
      isActive: true,
      createdAt: new Date("2022-01-01"),
      updatedAt: new Date("2024-12-15"),
    },
    {
      id: "dept_finance",
      name: "Finance",
      nameAr: "المالية",
      description: "Financial management and accounting",
      headOfDepartment: "emp_fin_001",
      costCenter: "CC003",
      location: "Main Office",
      budget: 600000,
      employeeCount: 6,
      isActive: true,
      createdAt: new Date("2022-01-01"),
      updatedAt: new Date("2024-12-15"),
    },
  ]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        !searchFilters.searchTerm ||
        employee.personalInfo.fullName
          .toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase()) ||
        employee.employeeId
          .toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase()) ||
        employee.professionalInfo.jobTitle
          .toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase());

      const matchesDepartment =
        !searchFilters.department ||
        employee.professionalInfo.departmentId === searchFilters.department;
      const matchesStatus =
        !searchFilters.status || employee.status === searchFilters.status;
      const matchesJobTitle =
        !searchFilters.jobTitle ||
        employee.professionalInfo.jobTitle
          .toLowerCase()
          .includes(searchFilters.jobTitle.toLowerCase());
      const matchesLocation =
        !searchFilters.location ||
        employee.professionalInfo.workLocation
          .toLowerCase()
          .includes(searchFilters.location.toLowerCase());

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesJobTitle &&
        matchesLocation
      );
    });
  }, [employees, searchFilters]);

  const employeeStats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((emp) => emp.status === "active").length;
    const onLeave = employees.filter((emp) => emp.status === "on-leave").length;
    const newHires = employees.filter((emp) => {
      const hireDate = new Date(emp.professionalInfo.hireDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return hireDate >= thirtyDaysAgo;
    }).length;

    return { total, active, onLeave, newHires };
  }, [employees]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "terminated":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department
      ? isArabic
        ? department.nameAr
        : department.name
      : "Unknown";
  };

  const handleExportEmployees = () => {
    try {
      const csvContent = [
        [
          "Employee ID",
          "Full Name",
          "Job Title",
          "Department",
          "Hire Date",
          "Status",
          "Work Email",
          "Work Phone",
          "Location",
        ],
        ...filteredEmployees.map((emp) => [
          emp.employeeId,
          emp.personalInfo.fullName,
          emp.professionalInfo.jobTitle,
          getDepartmentName(emp.professionalInfo.departmentId),
          emp.professionalInfo.hireDate,
          emp.status,
          emp.professionalInfo.workEmail,
          emp.professionalInfo.workPhone || "",
          emp.professionalInfo.workLocation,
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
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic ? "مركز إدارة الموظفين" : "Employee Management Hub"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isArabic
              ? "إدارة شاملة لدورة حياة الموظفين والتطوير المهني"
              : "Comprehensive employee lifecycle and professional development management"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportEmployees}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير البيانات" : "Export Data"}
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            {isArabic ? "استيراد البيانات" : "Import Data"}
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            {isArabic ? "موظف جديد" : "New Employee"}
          </button>
        </div>
      </div>

      {/* Employee Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {employeeStats.total}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "إجمالي الموظفين" : "Total Employees"}
              </div>
            </div>
          </div>
          <div className="text-xs text-blue-600">
            {isArabic ? "عبر جميع الأقسام" : "Across all departments"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {employeeStats.active}
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "موظفون نشطون" : "Active Employees"}
              </div>
            </div>
          </div>
          <div className="text-xs text-green-600">
            {((employeeStats.active / employeeStats.total) * 100).toFixed(1)}%{" "}
            {isArabic ? "من الإجمالي" : "of total"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {employeeStats.newHires}
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "توظيف جديد" : "New Hires"}
              </div>
            </div>
          </div>
          <div className="text-xs text-purple-600">
            {isArabic ? "آخر 30 يوم" : "Last 30 days"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {employeeStats.onLeave}
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "في إجازة" : "On Leave"}
              </div>
            </div>
          </div>
          <div className="text-xs text-yellow-600">
            {isArabic ? "حالياً" : "Currently"}
          </div>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveModule("profiles")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeModule === "profiles"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                {isArabic ? "ملفات الموظفين" : "Employee Profiles"}
              </div>
            </button>
            <button
              onClick={() => setActiveModule("organization")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeModule === "organization"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {isArabic ? "الهيكل التنظيمي" : "Organization"}
              </div>
            </button>
            <button
              onClick={() => setActiveModule("performance")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeModule === "performance"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? "الأداء والتطوير" : "Performance & Development"}
              </div>
            </button>
            <button
              onClick={() => setActiveModule("documents")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeModule === "documents"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isArabic ? "إدارة الوثائق" : "Document Management"}
              </div>
            </button>
            <button
              onClick={() => setActiveModule("lifecycle")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeModule === "lifecycle"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {isArabic ? "دورة حياة الموظف" : "Employee Lifecycle"}
              </div>
            </button>
            <button
              onClick={() => setActiveModule("analytics")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeModule === "analytics"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? "التحليلات" : "Analytics"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeModule === "profiles" && (
            <div className="space-y-6">
              {/* Search and Filters */}
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
                      value={searchFilters.searchTerm}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          searchTerm: e.target.value,
                        })
                      }
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                    />
                  </div>
                  <select
                    value={searchFilters.department}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        department: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "جميع الأقسام" : "All Departments"}
                    </option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {isArabic ? dept.nameAr : dept.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={searchFilters.status}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        status: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "جميع الحالات" : "All Status"}
                    </option>
                    <option value="active">
                      {isArabic ? "نشط" : "Active"}
                    </option>
                    <option value="inactive">
                      {isArabic ? "غير نشط" : "Inactive"}
                    </option>
                    <option value="on-leave">
                      {isArabic ? "في إجازة" : "On Leave"}
                    </option>
                    <option value="terminated">
                      {isArabic ? "منتهي الخدمة" : "Terminated"}
                    </option>
                  </select>
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    {isArabic ? "تصفية متقدمة" : "Advanced Filters"}
                  </button>
                </div>

                {showAdvancedFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "المسمى الوظيفي" : "Job Title"}
                      </label>
                      <input
                        type="text"
                        value={searchFilters.jobTitle}
                        onChange={(e) =>
                          setSearchFilters({
                            ...searchFilters,
                            jobTitle: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder={
                          isArabic
                            ? "البحث بالمسمى الوظيفي"
                            : "Search by job title"
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "موقع العمل" : "Work Location"}
                      </label>
                      <input
                        type="text"
                        value={searchFilters.location}
                        onChange={(e) =>
                          setSearchFilters({
                            ...searchFilters,
                            location: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder={
                          isArabic ? "البحث بموقع العمل" : "Search by location"
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() =>
                          setSearchFilters({
                            searchTerm: "",
                            department: "",
                            team: "",
                            status: "",
                            jobTitle: "",
                            location: "",
                          })
                        }
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                      >
                        {isArabic ? "مسح الفلاتر" : "Clear Filters"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-600">
                  {isArabic ? "عرض" : "Showing"} {filteredEmployees.length}{" "}
                  {isArabic ? "من" : "of"} {employees.length}{" "}
                  {isArabic ? "موظف" : "employees"}
                </div>
              </div>

              {/* Employee Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      {/* Employee Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          {employee.photo ? (
                            <img
                              src={employee.photo}
                              alt={employee.personalInfo.fullName}
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                              {employee.personalInfo.firstName.charAt(0)}
                              {employee.personalInfo.lastName.charAt(0)}
                            </div>
                          )}
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                              employee.status === "active"
                                ? "bg-green-500"
                                : employee.status === "on-leave"
                                ? "bg-yellow-500"
                                : employee.status === "inactive"
                                ? "bg-red-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {isArabic
                              ? employee.personalInfo.fullNameAr
                              : employee.personalInfo.fullName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {employee.employeeId}
                          </p>
                          <p className="text-sm text-blue-600">
                            {employee.professionalInfo.jobTitle}
                          </p>
                        </div>
                      </div>

                      {/* Employee Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span>
                            {getDepartmentName(
                              employee.professionalInfo.departmentId
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{employee.professionalInfo.workLocation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {isArabic ? "تاريخ التوظيف:" : "Hired:"}{" "}
                            {new Date(
                              employee.professionalInfo.hireDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">
                            {employee.professionalInfo.workEmail}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            employee.status
                          )}`}
                        >
                          {employee.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedEmployee(employee)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            title={isArabic ? "عرض الملف" : "View Profile"}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                            title={isArabic ? "تعديل" : "Edit"}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-purple-600 hover:text-purple-800 p-1 rounded"
                            title={isArabic ? "الوثائق" : "Documents"}
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {isArabic ? "لا توجد نتائج" : "No employees found"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isArabic
                      ? "جرب تعديل معايير البحث"
                      : "Try adjusting your search criteria"}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeModule === "organization" && (
            <OrganizationalChart
              departments={departments}
              employees={employees}
              isArabic={isArabic}
            />
          )}

          {activeModule === "performance" && (
            <PerformanceManagement employees={employees} isArabic={isArabic} />
          )}

          {activeModule === "documents" && (
            <DocumentManagement employees={employees} isArabic={isArabic} />
          )}

          {activeModule === "lifecycle" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {isArabic
                    ? "إدارة دورة حياة الموظف"
                    : "Employee Lifecycle Management"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {isArabic ? "التأهيل" : "Onboarding"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {isArabic
                            ? "عملية تأهيل الموظفين الجدد"
                            : "New employee orientation process"}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic
                        ? "3 موظفين في التأهيل"
                        : "3 employees in onboarding"}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {isArabic
                            ? "النقل والترقية"
                            : "Transfers & Promotions"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {isArabic
                            ? "إدارة التنقلات والترقيات"
                            : "Position changes and career advancement"}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic
                        ? "2 طلب ترقية معلق"
                        : "2 pending promotion requests"}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {isArabic ? "إنهاء الخدمة" : "Offboarding"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {isArabic
                            ? "عملية إنهاء خدمة الموظفين"
                            : "Employee exit process management"}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic
                        ? "1 موظف في الإنهاء"
                        : "1 employee in exit process"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض تفاصيل إدارة دورة حياة الموظف هنا..."
                  : "Detailed employee lifecycle management features will be displayed here..."}
              </div>
            </div>
          )}

          {activeModule === "analytics" && (
            <EmployeeAnalytics
              employees={employees}
              departments={departments}
              isArabic={isArabic}
            />
          )}
        </div>
      </div>

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <EmployeeProfileManager
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          isArabic={isArabic}
        />
      )}
    </div>
  );
};
