import React, { useState, useMemo, useEffect } from "react";
import {
  Calculator,
  Users,
  Download,
  Upload,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  Save,
  Plus,
  Edit,
  Eye,
  Building2,
  TrendingUp,
  Clock,
  Target,
  Award,
  Shield,
  Bell,
  X,
  Search,
  Filter,
} from "lucide-react";
import {
  calculateFinancials,
  formatCurrency,
} from "../utils/financialCalculations";
import { generateSampleDataApi } from "../data/sampleData";

export const PayrollManagement = ({ isArabic }) => {
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();

    // Generate current month and previous 2 months
    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const monthValue = `${year}-${month}`;

      // Month names in English and Arabic
      const monthNames = {
        en: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        ar: [
          "يناير",
          "فبراير",
          "مارس",
          "أبريل",
          "مايو",
          "يونيو",
          "يوليو",
          "أغسطس",
          "سبتمبر",
          "أكتوبر",
          "نوفمبر",
          "ديسمبر",
        ],
      };

      const monthName = monthNames[isArabic ? "ar" : "en"][date.getMonth()];
      const displayName = `${monthName} ${year}`;

      options.push({
        value: monthValue,
        label: displayName,
      });
    }

    return options;
  };

  // Then change the state initialization to:
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const [activeView, setActiveView] = useState("summary");
  const [selectedProject, setSelectedProject] = useState("all");
  const [showPayrollDetails, setShowPayrollDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Replace the direct hook with state management for API data
  const [data, setData] = useState({
    employees: [],
    projects: [],
    attendance: [],
    insights: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data on component mount and when month changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiData = await generateSampleDataApi();
        setData(apiData);
      } catch (err) {
        console.error("Failed to load payroll data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedMonth]);

  const { employees, projects, attendance, insights } = data;

  // Calculate payroll data for the selected month
  const payrollData = useMemo(() => {
    if (loading || !employees.length || !attendance.length) {
      return {
        projectPayrolls: [],
        allEmployees: [],
      };
    }

    const monthStart = `${selectedMonth}-01`;
    const monthEnd = `${selectedMonth}-31`;

    const monthAttendance = attendance.filter(
      (record) => record.date >= monthStart && record.date <= monthEnd
    );

    const projectPayrolls = [];
    const allEmployeePayrolls = [];
    const projectGroups = new Map();

    employees.forEach((employee) => {
      const employeeAttendance = monthAttendance.filter(
        (record) => record.employeeId === employee.employeeId
      );

      if (employeeAttendance.length === 0) return;

      const totalRegularHours = employeeAttendance.reduce(
        (sum, record) => sum + record.hoursWorked,
        0
      );
      const totalOvertimeHours = employeeAttendance.reduce(
        (sum, record) => sum + record.overtime,
        0
      );
      const totalHours = totalRegularHours + totalOvertimeHours;

      const financials = calculateFinancials(
        totalRegularHours,
        totalOvertimeHours,
        employee.hourlyRate,
        employee.actualRate
      );

      const grossPay = financials.laborCost;
      const gosiContribution = grossPay * 0.11;
      const deductions = grossPay * 0.02;
      const netPay = grossPay - gosiContribution - deductions;

      const payrollCalc = {
        employeeId: employee.id,
        employeeName: employee.name,
        trade: employee.trade,
        project:
          projects.find((p) => p.id === employee.projectId)?.name ||
          "Unassigned",
        regularHours: totalRegularHours,
        overtimeHours: totalOvertimeHours,
        totalHours,
        hourlyRate: employee.hourlyRate,
        regularPay: financials.regularPay,
        overtimePay: financials.overtimePay,
        grossPay,
        deductions,
        gosiContribution,
        netPay,
        profitGenerated: financials.profit,
        clientBilling: financials.revenue,
      };

      allEmployeePayrolls.push(payrollCalc);

      const projectId = employee.projectId || "unassigned";
      if (!projectGroups.has(projectId)) {
        const project = projects.find((p) => p.id === projectId);
        projectGroups.set(projectId, {
          projectId,
          projectName: project?.name || "Unassigned",
          client: project?.client || "No Client",
          employees: [],
          totalHours: 0,
          totalCost: 0,
          totalBilling: 0,
          totalProfit: 0,
        });
      }

      const projectGroup = projectGroups.get(projectId);
      projectGroup.employees.push(payrollCalc);
      projectGroup.totalHours += totalHours;
      projectGroup.totalCost += grossPay;
      projectGroup.totalBilling += financials.revenue;
      projectGroup.totalProfit += financials.profit;
    });

    projectGroups.forEach((group, projectId) => {
      const profitMargin =
        group.totalBilling > 0
          ? (group.totalProfit / group.totalBilling) * 100
          : 0;

      projectPayrolls.push({
        projectId,
        projectName: group.projectName,
        client: group.client,
        employeeCount: group.employees.length,
        totalHours: group.totalHours,
        totalCost: group.totalCost,
        totalBilling: group.totalBilling,
        totalProfit: group.totalProfit,
        profitMargin,
        employees: group.employees,
      });
    });

    return {
      projectPayrolls: projectPayrolls.sort(
        (a, b) => b.totalProfit - a.totalProfit
      ),
      allEmployees: allEmployeePayrolls.sort((a, b) =>
        a.employeeName.localeCompare(b.employeeName)
      ),
    };
  }, [employees, projects, attendance, selectedMonth, loading]);

  // Calculate summary statistics
  const payrollSummary = useMemo(() => {
    if (loading || !payrollData.allEmployees.length) {
      return {
        totalEmployees: 0,
        totalGrossPay: 0,
        totalNetPay: 0,
        totalGosiContributions: 0,
        totalDeductions: 0,
        totalHours: 0,
        totalOvertimeHours: 0,
        totalClientBilling: 0,
        totalProfitGenerated: 0,
        averageHoursPerEmployee: 0,
        overtimePercentage: 0,
        profitMargin: 0,
      };
    }

    const totalEmployees = payrollData.allEmployees.length;
    const totalGrossPay = payrollData.allEmployees.reduce(
      (sum, emp) => sum + emp.grossPay,
      0
    );
    const totalNetPay = payrollData.allEmployees.reduce(
      (sum, emp) => sum + emp.netPay,
      0
    );
    const totalGosiContributions = payrollData.allEmployees.reduce(
      (sum, emp) => sum + emp.gosiContribution,
      0
    );
    const totalDeductions = payrollData.allEmployees.reduce(
      (sum, emp) => sum + emp.deductions,
      0
    );
    const totalHours = payrollData.allEmployees.reduce(
      (sum, emp) => sum + emp.totalHours,
      0
    );
    const totalOvertimeHours = payrollData.allEmployees.reduce(
      (sum, emp) => sum + emp.overtimeHours,
      0
    );
    const totalClientBilling = payrollData.allEmployees.reduce(
      (sum, emp) => sum + emp.clientBilling,
      0
    );
    const totalProfitGenerated = payrollData.allEmployees.reduce(
      (sum, emp) => sum + emp.profitGenerated,
      0
    );

    return {
      totalEmployees,
      totalGrossPay,
      totalNetPay,
      totalGosiContributions,
      totalDeductions,
      totalHours,
      totalOvertimeHours,
      totalClientBilling,
      totalProfitGenerated,
      averageHoursPerEmployee:
        totalEmployees > 0 ? totalHours / totalEmployees : 0,
      overtimePercentage:
        totalHours > 0 ? (totalOvertimeHours / totalHours) * 100 : 0,
      profitMargin:
        totalClientBilling > 0
          ? (totalProfitGenerated / totalClientBilling) * 100
          : 0,
    };
  }, [payrollData, loading]);

  // Filter employees based on search and project
  const filteredEmployees = useMemo(() => {
    if (loading || !payrollData.allEmployees.length) {
      return [];
    }

    let filtered = payrollData.allEmployees;

    if (selectedProject !== "all") {
      filtered = filtered.filter((emp) => {
        const employee = employees.find((e) => e.id === emp.employeeId);
        return employee?.projectId === selectedProject;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.project.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [
    payrollData.allEmployees,
    selectedProject,
    searchTerm,
    employees,
    loading,
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isArabic
              ? "جاري تحميل بيانات الرواتب..."
              : "Loading payroll data..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">
                {isArabic ? "خطأ في تحميل البيانات" : "Data Loading Error"}
              </h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {isArabic ? "إعادة المحاولة" : "Retry"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleExportPayroll = () => {
    try {
      let csvContent = "";
      let filename = "";

      if (activeView === "employees") {
        csvContent = [
          [
            "Employee Name",
            "Trade",
            "Project",
            "Regular Hours",
            "Overtime Hours",
            "Total Hours",
            "Hourly Rate",
            "Gross Pay",
            "GOSI",
            "Deductions",
            "Net Pay",
            "Client Billing",
            "Profit Generated",
          ],
          ...filteredEmployees.map((emp) => [
            emp.employeeName,
            emp.trade,
            emp.project,
            emp.regularHours.toString(),
            emp.overtimeHours.toString(),
            emp.totalHours.toString(),
            emp.hourlyRate.toString(),
            emp.grossPay.toString(),
            emp.gosiContribution.toString(),
            emp.deductions.toString(),
            emp.netPay.toString(),
            emp.clientBilling.toString(),
            emp.profitGenerated.toString(),
          ]),
        ]
          .map((row) => row.join(","))
          .join("\n");
        filename = `employee_payroll_${selectedMonth}.csv`;
      } else if (activeView === "projects") {
        csvContent = [
          [
            "Project",
            "Client",
            "Employees",
            "Total Hours",
            "Total Cost",
            "Client Billing",
            "Profit",
            "Profit Margin %",
          ],
          ...payrollData.projectPayrolls.map((proj) => [
            proj.projectName,
            proj.client,
            proj.employeeCount.toString(),
            proj.totalHours.toString(),
            proj.totalCost.toString(),
            proj.totalBilling.toString(),
            proj.totalProfit.toString(),
            proj.profitMargin.toFixed(2),
          ]),
        ]
          .map((row) => row.join(","))
          .join("\n");
        filename = `project_payroll_${selectedMonth}.csv`;
      } else {
        csvContent = [
          ["Metric", "Value"],
          ["Total Employees", payrollSummary.totalEmployees.toString()],
          ["Total Gross Pay", payrollSummary.totalGrossPay.toString()],
          ["Total Net Pay", payrollSummary.totalNetPay.toString()],
          [
            "Total GOSI Contributions",
            payrollSummary.totalGosiContributions.toString(),
          ],
          ["Total Hours", payrollSummary.totalHours.toString()],
          [
            "Total Client Billing",
            payrollSummary.totalClientBilling.toString(),
          ],
          [
            "Total Profit Generated",
            payrollSummary.totalProfitGenerated.toString(),
          ],
          ["Profit Margin %", payrollSummary.profitMargin.toFixed(2)],
        ]
          .map((row) => row.join(","))
          .join("\n");
        filename = `payroll_summary_${selectedMonth}.csv`;
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم تصدير بيانات الرواتب بنجاح!"
          : "Payroll data exported successfully!"
      );
    } catch (error) {
      console.error("Export error:", error);
      alert(
        isArabic ? "حدث خطأ أثناء التصدير" : "Error occurred during export"
      );
    }
  };

  const handleBankUpload = () => {
    try {
      let bankContent = "";
      bankContent += `BANK TRANSFER FILE - ${selectedMonth}\n`;
      bankContent += `Generated on: ${new Date().toLocaleString()}\n`;
      bankContent += `Company: AMOAGC Al-Majmaah\n\n`;

      filteredEmployees.forEach((emp, index) => {
        bankContent += `Record ${index + 1}:\n`;
        bankContent += `Employee: ${emp.employeeName}\n`;
        bankContent += `Employee ID: ${emp.employeeId}\n`;
        bankContent += `Amount: ${emp.netPay.toFixed(2)} SAR\n`;
        bankContent += `Account: [Bank Account Number]\n`;
        bankContent += `Reference: Salary ${selectedMonth}\n`;
        bankContent += `Project: ${emp.project}\n\n`;
      });

      bankContent += `SUMMARY:\n`;
      bankContent += `Total Amount: ${payrollSummary.totalNetPay.toFixed(
        2
      )} SAR\n`;
      bankContent += `Total Records: ${filteredEmployees.length}\n`;
      bankContent += `Total GOSI: ${payrollSummary.totalGosiContributions.toFixed(
        2
      )} SAR\n`;

      const blob = new Blob([bankContent], {
        type: "text/plain;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `bank_transfer_${selectedMonth}.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم إنشاء ملف البنك بنجاح!"
          : "Bank transfer file generated successfully!"
      );
    } catch (error) {
      console.error("Bank upload error:", error);
      alert(
        isArabic
          ? "حدث خطأ أثناء إنشاء ملف البنك"
          : "Error occurred during bank file generation"
      );
    }
  };

  const handleGeneratePayslips = () => {
    try {
      let payslipContent = "";
      payslipContent += `AMOAGC AL-MAJMAAH - PAYSLIPS\n`;
      payslipContent += `Month: ${selectedMonth}\n`;
      payslipContent += `Generated on: ${new Date().toLocaleString()}\n`;
      payslipContent += `${"=".repeat(80)}\n\n`;

      filteredEmployees.forEach((emp, index) => {
        payslipContent += `PAYSLIP ${index + 1}\n`;
        payslipContent += `${"=".repeat(50)}\n`;
        payslipContent += `Employee: ${emp.employeeName}\n`;
        payslipContent += `Employee ID: ${emp.employeeId}\n`;
        payslipContent += `Trade: ${emp.trade}\n`;
        payslipContent += `Project: ${emp.project}\n`;
        payslipContent += `Month: ${selectedMonth}\n\n`;

        payslipContent += `EARNINGS:\n`;
        payslipContent += `Regular Hours (${
          emp.regularHours
        }h): ${emp.regularPay.toFixed(2)} SAR\n`;
        payslipContent += `Overtime Hours (${
          emp.overtimeHours
        }h): ${emp.overtimePay.toFixed(2)} SAR\n`;
        payslipContent += `Gross Pay: ${emp.grossPay.toFixed(2)} SAR\n\n`;

        payslipContent += `DEDUCTIONS:\n`;
        payslipContent += `GOSI Contribution (11%): ${emp.gosiContribution.toFixed(
          2
        )} SAR\n`;
        payslipContent += `Other Deductions: ${emp.deductions.toFixed(
          2
        )} SAR\n`;
        payslipContent += `Total Deductions: ${(
          emp.gosiContribution + emp.deductions
        ).toFixed(2)} SAR\n\n`;

        payslipContent += `NET PAY: ${emp.netPay.toFixed(2)} SAR\n\n`;
        payslipContent += `Employee Signature: ________________________\n`;
        payslipContent += `Date: ________________________\n\n`;
        payslipContent += `${"=".repeat(80)}\n\n`;
      });

      const blob = new Blob([payslipContent], {
        type: "text/plain;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `payslips_${selectedMonth}.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم إنشاء كشوف الرواتب بنجاح!"
          : "Payslips generated successfully!"
      );
    } catch (error) {
      console.error("Payslip generation error:", error);
      alert(
        isArabic
          ? "حدث خطأ أثناء إنشاء كشوف الرواتب"
          : "Error occurred during payslip generation"
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic
              ? "إدارة الرواتب المتكاملة"
              : "Integrated Payroll Management"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isArabic
              ? "مرتبط مباشرة بمشاريع القوى العاملة والحضور"
              : "Directly linked to Manpower projects and attendance"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            aria-label={isArabic ? "اختر الشهر" : "Select Month"}
          >
            {getMonthOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleGeneratePayslips}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            aria-label={isArabic ? "إنشاء كشوف الرواتب" : "Generate Payslips"}
          >
            <FileText className="w-4 h-4" />
            {isArabic ? "كشوف الرواتب" : "Generate Payslips"}
          </button>
          <button
            onClick={handleBankUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            aria-label={isArabic ? "إنشاء ملف البنك" : "Generate Bank File"}
          >
            <Upload className="w-4 h-4" />
            {isArabic ? "ملف البنك" : "Bank File"}
          </button>
          <button
            onClick={handleExportPayroll}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            aria-label={
              isArabic ? "تصدير بيانات الرواتب" : "Export Payroll Data"
            }
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير" : "Export"}
          </button>
        </div>
      </div>

      {/* Payroll Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {payrollSummary.totalEmployees}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "إجمالي الموظفين" : "Total Employees"}
              </div>
            </div>
          </div>
          <div className="text-xs text-blue-600">
            {payrollSummary.averageHoursPerEmployee.toFixed(1)}{" "}
            {isArabic ? "ساعة/موظف" : "hours/employee avg"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center shadow-md">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(payrollSummary.totalNetPay)
                  .replace("SAR", "")
                  .trim()}
                K
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "صافي الرواتب" : "Net Payroll"}
              </div>
            </div>
          </div>
          <div className="text-xs text-green-600">
            {formatCurrency(payrollSummary.totalGrossPay)
              .replace("SAR", "")
              .trim()}
            K {isArabic ? "إجمالي" : "gross"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {formatCurrency(payrollSummary.totalProfitGenerated)
                  .replace("SAR", "")
                  .trim()}
                K
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "الأرباح المحققة" : "Profit Generated"}
              </div>
            </div>
          </div>
          <div className="text-xs text-purple-600">
            {payrollSummary.profitMargin.toFixed(1)}%{" "}
            {isArabic ? "هامش الربح" : "profit margin"}
          </div>
        </div>

        {/* <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {formatCurrency(payrollSummary.totalGosiContributions)
                  .replace("SAR", "")
                  .trim()}
                K
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "مساهمات التأمينات" : "GOSI Contributions"}
              </div>
            </div>
          </div>
          <div className="text-xs text-yellow-600">
            11% {isArabic ? "من الراتب الإجمالي" : "of gross salary"}
          </div>
        </div> */}
      </div>

      {/* Integration Status Banner */}
      {/* <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-800">
              {isArabic
                ? "متكامل مع نظام القوى العاملة"
                : "Integrated with Manpower System"}
            </h3>
            <p className="text-sm text-green-700">
              {isArabic
                ? "الرواتب محسوبة تلقائياً من بيانات الحضور والمشاريع • متوافق مع GOSI • حسابات الأرباح في الوقت الفعلي"
                : "Salaries calculated automatically from attendance and project data • GOSI compliant • Real-time profit calculations"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-800">Live</div>
            <div className="text-sm text-green-600">
              {isArabic ? "متصل" : "Connected"}
            </div>
          </div>
        </div>
      </div> */}

      {/* View Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveView("summary")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "summary"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label={
                isArabic ? "عرض ملخص الرواتب" : "View Payroll Summary"
              }
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                {isArabic ? "ملخص الرواتب" : "Payroll Summary"}
              </div>
            </button>
            <button
              onClick={() => setActiveView("projects")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "projects"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label={
                isArabic ? "عرض رواتب المشاريع" : "View Project Payrolls"
              }
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {isArabic ? "رواتب المشاريع" : "Project Payrolls"}
              </div>
            </button>
            <button
              onClick={() => setActiveView("employees")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "employees"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label={
                isArabic ? "عرض رواتب الموظفين" : "View Employee Payroll"
              }
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {isArabic ? "رواتب الموظفين" : "Employee Payroll"}
              </div>
            </button>
            <button
              onClick={() => setActiveView("billing")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "billing"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label={
                isArabic ? "عرض فوترة العملاء" : "View Client Billing"
              }
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isArabic ? "فوترة العملاء" : "Client Billing"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeView === "summary" && (
            <div className="space-y-6">
              {/* Financial Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-4">
                    {isArabic ? "إجمالي التكاليف" : "Total Costs"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">
                        {isArabic ? "الرواتب الإجمالية:" : "Gross Salaries:"}
                      </span>
                      <span className="font-bold text-green-900">
                        {formatCurrency(payrollSummary.totalGrossPay)}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-green-700">
                        {isArabic
                          ? "مساهمات التأمينات:"
                          : "GOSI Contributions:"}
                      </span>
                      <span className="font-bold text-green-900">
                        {formatCurrency(payrollSummary.totalGosiContributions)}
                      </span>
                    </div> */}
                    <div className="flex justify-between border-t border-green-200 pt-2">
                      <span className="text-green-700 font-medium">
                        {isArabic ? "إجمالي التكاليف:" : "Total Cost:"}
                      </span>
                      {/* +payrollSummary.totalGosiContributions */}
                      <span className="font-bold text-green-900">
                        {formatCurrency(payrollSummary.totalGrossPay)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-4">
                    {isArabic ? "إيرادات العملاء" : "Client Revenue"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        {isArabic ? "إجمالي الفوترة:" : "Total Billing:"}
                      </span>
                      <span className="font-bold text-blue-900">
                        {formatCurrency(payrollSummary.totalClientBilling)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        {isArabic ? "متوسط الساعة:" : "Average per Hour:"}
                      </span>
                      <span className="font-bold text-blue-900">
                        {formatCurrency(
                          payrollSummary.totalHours > 0
                            ? payrollSummary.totalClientBilling /
                                payrollSummary.totalHours
                            : 0
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-blue-200 pt-2">
                      <span className="text-blue-700 font-medium">
                        {isArabic ? "إجمالي الساعات:" : "Total Hours:"}
                      </span>
                      <span className="font-bold text-blue-900">
                        {payrollSummary.totalHours.toLocaleString()}h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-4">
                    {isArabic ? "صافي الأرباح" : "Net Profit"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-700">
                        {isArabic ? "إجمالي الأرباح:" : "Total Profit:"}
                      </span>
                      <span className="font-bold text-purple-900">
                        {formatCurrency(payrollSummary.totalProfitGenerated)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">
                        {isArabic ? "هامش الربح:" : "Profit Margin:"}
                      </span>
                      <span className="font-bold text-purple-900">
                        {payrollSummary.profitMargin.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-purple-200 pt-2">
                      <span className="text-purple-700 font-medium">
                        {isArabic ? "ربح/موظف:" : "Profit per Employee:"}
                      </span>
                      <span className="font-bold text-purple-900">
                        {formatCurrency(
                          payrollSummary.totalEmployees > 0
                            ? payrollSummary.totalProfitGenerated /
                                payrollSummary.totalEmployees
                            : 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours Analysis */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "تحليل الساعات" : "Hours Analysis"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {payrollSummary.totalHours.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "إجمالي الساعات" : "Total Hours"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {(
                        payrollSummary.totalHours -
                        payrollSummary.totalOvertimeHours
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "ساعات عادية" : "Regular Hours"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {payrollSummary.totalOvertimeHours.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "عمل إضافي" : "Overtime Hours"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {payrollSummary.overtimePercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "نسبة العمل الإضافي" : "Overtime Percentage"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "رواتب المشاريع" : "Project Payrolls"}
                </h3>
                <div className="text-sm text-gray-600">
                  {payrollData.projectPayrolls.length}{" "}
                  {isArabic ? "مشروع" : "projects"}
                </div>
              </div>

              <div className="grid gap-6">
                {payrollData.projectPayrolls.map((project) => (
                  <div
                    key={project.projectId}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {project.projectName}
                        </h4>
                        <p className="text-gray-600">{project.client}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>
                            {project.employeeCount}{" "}
                            {isArabic ? "موظف" : "employees"}
                          </span>
                          <span>•</span>
                          <span>
                            {project.totalHours.toLocaleString()}{" "}
                            {isArabic ? "ساعة" : "hours"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {project.profitMargin.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "هامش الربح" : "Profit Margin"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "تكلفة العمالة" : "Labor Cost"}
                        </div>
                        <div className="text-lg font-semibold text-red-600">
                          {formatCurrency(project.totalCost)}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "فوترة العميل" : "Client Billing"}
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {formatCurrency(project.totalBilling)}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "صافي الربح" : "Net Profit"}
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(project.totalProfit)}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          {isArabic ? "ربح/ساعة" : "Profit per Hour"}
                        </div>
                        <div className="text-lg font-semibold text-purple-600">
                          {formatCurrency(
                            project.totalHours > 0
                              ? project.totalProfit / project.totalHours
                              : 0
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {project.employees.length}{" "}
                        {isArabic
                          ? "موظف في كشف الراتب"
                          : "employees on payroll"}
                      </div>
                      <button
                        onClick={() => {
                          // setSelectedProject(project.projectId);
                          setActiveView("employees");
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        aria-label={
                          isArabic
                            ? `عرض تفاصيل ${project.projectName}`
                            : `View details for ${project.projectName}`
                        }
                      >
                        {isArabic ? "عرض التفاصيل" : "View Details"} →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === "employees" && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      isArabic ? "البحث في الموظفين..." : "Search employees..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                    aria-label={
                      isArabic ? "البحث في الموظفين" : "Search employees"
                    }
                  />
                </div>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  aria-label={isArabic ? "اختر المشروع" : "Select Project"}
                >
                  <option value="all">
                    {isArabic ? "جميع المشاريع" : "All Projects"}
                  </option>
                  {projects
                    .filter((p) => p.status === "active")
                    .map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الموظف" : "Employee"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "المشروع" : "Project"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الساعات" : "Hours"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الراتب الإجمالي" : "Gross Pay"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الخصومات" : "Deductions"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "صافي الراتب" : "Net Pay"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الربح المحقق" : "Profit Generated"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
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
                              {employee.trade}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {employee.project}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {employee.totalHours}h
                            </div>
                            <div className="text-gray-500">
                              {employee.regularHours}h +{" "}
                              {employee.overtimeHours}h OT
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(employee.grossPay)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <div className="text-red-600">
                              -{formatCurrency(employee.gosiContribution)}
                            </div>
                            {/* <div className="text-gray-500 text-xs">
                              GOSI + Other
                            </div> */}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-green-600">
                          {formatCurrency(employee.netPay)}
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-purple-600">
                          {formatCurrency(employee.profitGenerated)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setShowPayrollDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              aria-label={
                                isArabic
                                  ? `عرض تفاصيل ${employee.employeeName}`
                                  : `View details for ${employee.employeeName}`
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {/* <button
                              className="text-green-600 hover:text-green-800 p-1 rounded"
                              aria-label={
                                isArabic
                                  ? `كشف راتب ${employee.employeeName}`
                                  : `Payslip for ${employee.employeeName}`
                              }
                            >
                              <FileText className="w-4 h-4" />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === "billing" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {isArabic
                    ? "فوترة العملاء المتكاملة"
                    : "Integrated Client Billing"}
                </h3>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "فوترة العملاء محسوبة تلقائياً من ساعات العمل والأسعار الفعلية"
                    : "Client billing calculated automatically from work hours and actual rates"}
                </p>
              </div>

              <div className="grid gap-6">
                {payrollData.projectPayrolls.map((project) => (
                  <div
                    key={project.projectId}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {project.projectName}
                        </h4>
                        <p className="text-gray-600">{project.client}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(project.totalBilling)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "إجمالي الفوترة" : "Total Billing"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="text-sm text-red-600">
                          {isArabic ? "تكلفة العمالة" : "Labor Cost"}
                        </div>
                        <div className="text-xl font-bold text-red-800">
                          {formatCurrency(project.totalCost)}
                        </div>
                        <div className="text-xs text-red-600">
                          {project.employeeCount}{" "}
                          {isArabic ? "موظف" : "employees"}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-sm text-green-600">
                          {isArabic ? "صافي الربح" : "Net Profit"}
                        </div>
                        <div className="text-xl font-bold text-green-800">
                          {formatCurrency(project.totalProfit)}
                        </div>
                        <div className="text-xs text-green-600">
                          {project.profitMargin.toFixed(1)}%{" "}
                          {isArabic ? "هامش" : "margin"}
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm text-blue-600">
                          {isArabic ? "معدل الساعة" : "Hourly Rate"}
                        </div>
                        <div className="text-xl font-bold text-blue-800">
                          {formatCurrency(
                            project.totalHours > 0
                              ? project.totalBilling / project.totalHours
                              : 0
                          )}
                        </div>
                        <div className="text-xs text-blue-600">
                          {project.totalHours} {isArabic ? "ساعة" : "hours"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Payroll Details Modal */}
      {showPayrollDetails && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "تفاصيل راتب الموظف" : "Employee Payroll Details"}
              </h3>
              <button
                onClick={() => setShowPayrollDetails(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={isArabic ? "إغلاق النافذة" : "Close modal"}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Employee Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                    {selectedEmployee.employeeName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900">
                      {selectedEmployee.employeeName}
                    </h4>
                    <p className="text-gray-600">
                      {selectedEmployee.trade} • {selectedEmployee.project}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedEmployee.employeeId}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {isArabic ? "صافي الراتب" : "Net Pay"}
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(selectedEmployee.netPay)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "تفاصيل الراتب" : "Salary Breakdown"}
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "أجر عادي:" : "Regular Pay:"}
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedEmployee.regularPay)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "أجر إضافي:" : "Overtime Pay:"}
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedEmployee.overtimePay)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-gray-600 font-medium">
                        {isArabic ? "الراتب الإجمالي:" : "Gross Pay:"}
                      </span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(selectedEmployee.grossPay)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "التأمينات (11%):" : "GOSI (11%):"}
                      </span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(selectedEmployee.gosiContribution)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "خصومات أخرى:" : "Other Deductions:"}
                      </span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(selectedEmployee.deductions)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-gray-600 font-medium">
                        {isArabic ? "صافي الراتب:" : "Net Pay:"}
                      </span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(selectedEmployee.netPay)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "تفاصيل الساعات" : "Hours Breakdown"}
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "ساعات عادية:" : "Regular Hours:"}
                      </span>
                      <span className="font-medium">
                        {selectedEmployee.regularHours}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "عمل إضافي:" : "Overtime Hours:"}
                      </span>
                      <span className="font-medium">
                        {selectedEmployee.overtimeHours}h
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-gray-600 font-medium">
                        {isArabic ? "إجمالي الساعات:" : "Total Hours:"}
                      </span>
                      <span className="font-bold">
                        {selectedEmployee.totalHours}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "الأجر بالساعة:" : "Hourly Rate:"}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(selectedEmployee.hourlyRate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profitability Analysis */}
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h5 className="font-semibold text-purple-900 mb-4">
                  {isArabic ? "تحليل الربحية" : "Profitability Analysis"}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">
                      {isArabic ? "فوترة العميل" : "Client Billing"}
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(selectedEmployee.clientBilling)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isArabic ? "إيرادات مولدة" : "Revenue generated"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">
                      {isArabic ? "تكلفة العمالة" : "Labor Cost"}
                    </div>
                    <div className="text-xl font-bold text-red-600">
                      {formatCurrency(selectedEmployee.grossPay)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isArabic ? "تكلفة الشركة" : "Company cost"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">
                      {isArabic ? "صافي الربح" : "Net Profit"}
                    </div>
                    <div className="text-xl font-bold text-purple-600">
                      {formatCurrency(selectedEmployee.profitGenerated)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedEmployee.clientBilling > 0
                        ? (
                            (selectedEmployee.profitGenerated /
                              selectedEmployee.clientBilling) *
                            100
                          ).toFixed(1)
                        : 0}
                      % {isArabic ? "هامش" : "margin"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
