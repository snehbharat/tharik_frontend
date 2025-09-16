import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

import {
  calculateFinancials,
  calculateDashboardMetrics,
  calculateProjectMetrics,
  generateProfitTrends,
  generateActionableInsights,
} from "../utils/financialCalculations";
import { generateSampleData } from "../data/sampleData";

export const useWorkforceData = () => {
  // Core data storage
  const [employees, setEmployees] = useLocalStorage("workforce_employees", []);
  const [projects, setProjects] = useLocalStorage("workforce_projects", []);
  const [attendance, setAttendance] = useLocalStorage(
    "workforce_attendance",
    []
  );
  const [clientInvoices, setClientInvoices] = useLocalStorage(
    "workforce_client_invoices",
    []
  );
  const [salaryInvoices, setSalaryInvoices] = useLocalStorage(
    "workforce_salary_invoices",
    []
  );
  const [profitReports, setProfitReports] = useLocalStorage(
    "workforce_profit_reports",
    []
  );
  const [proposals, setProposals] = useLocalStorage("workforce_proposals", []);
  const [insights, setInsights] = useLocalStorage("workforce_insights", []);

  // Initialize sample data if empty
  useEffect(() => {
    if (employees.length === 0 || projects.length === 0) {
      const sampleData = generateSampleData();
      setEmployees(sampleData.employees);
      setProjects(sampleData.projects);
      setAttendance(sampleData.attendance);
      setInsights(sampleData.insights);
    }
  }, [
    employees.length,
    projects.length,
    setEmployees,
    setProjects,
    setAttendance,
    setInsights,
  ]);

  // Calculate payroll data for employees
  const calculateEmployeePayroll = useCallback(
    (employeeId, startDate, endDate) => {
      const employee = employees.find((emp) => emp.id === employeeId);
      if (!employee) return null;

      const employeeAttendance = attendance.filter(
        (record) =>
          record.employeeId === employeeId &&
          record.date >= startDate &&
          record.date <= endDate
      );

      const totalRegularHours = employeeAttendance.reduce(
        (sum, record) => sum + record.hoursWorked,
        0
      );
      const totalOvertimeHours = employeeAttendance.reduce(
        (sum, record) => sum + record.overtime,
        0
      );

      const financials = calculateFinancials(
        totalRegularHours,
        totalOvertimeHours,
        employee.hourlyRate,
        employee.actualRate
      );

      const grossPay = financials.laborCost;
      const gosiContribution = grossPay * 0.11; // 11% GOSI
      const otherDeductions = grossPay * 0.02; // 2% other deductions
      const netPay = grossPay - gosiContribution - otherDeductions;

      return {
        employee,
        totalRegularHours,
        totalOvertimeHours,
        totalHours: totalRegularHours + totalOvertimeHours,
        grossPay,
        gosiContribution,
        otherDeductions,
        netPay,
        clientBilling: financials.revenue,
        profitGenerated: financials.profit,
        attendanceDays: employeeAttendance.length,
      };
    },
    [employees, attendance]
  );

  // Get payroll summary for all employees in a period
  const getPayrollSummary = useCallback(
    (startDate, endDate) => {
      const payrollData = employees
        .map((emp) => calculateEmployeePayroll(emp.id, startDate, endDate))
        .filter((data) => data !== null);

      const totalGrossPay = payrollData.reduce(
        (sum, data) => sum + data.grossPay,
        0
      );
      const totalNetPay = payrollData.reduce(
        (sum, data) => sum + data.netPay,
        0
      );
      const totalGosiContributions = payrollData.reduce(
        (sum, data) => sum + data.gosiContribution,
        0
      );
      const totalClientBilling = payrollData.reduce(
        (sum, data) => sum + data.clientBilling,
        0
      );
      const totalProfitGenerated = payrollData.reduce(
        (sum, data) => sum + data.profitGenerated,
        0
      );
      const totalHours = payrollData.reduce(
        (sum, data) => sum + data.totalHours,
        0
      );

      return {
        employeeCount: payrollData.length,
        totalGrossPay,
        totalNetPay,
        totalGosiContributions,
        totalClientBilling,
        totalProfitGenerated,
        totalHours,
        profitMargin:
          totalClientBilling > 0
            ? (totalProfitGenerated / totalClientBilling) * 100
            : 0,
        averagePayPerEmployee:
          payrollData.length > 0 ? totalNetPay / payrollData.length : 0,
        payrollData,
      };
    },
    [employees, calculateEmployeePayroll]
  );
  // Real-time dashboard metrics calculation
  const getDashboardMetrics = useCallback(() => {
    return calculateDashboardMetrics(employees, projects, attendance);
  }, [employees, projects, attendance]);

  // Project-specific metrics calculation
  const getProjectMetrics = useCallback(
    (projectId) => {
      return calculateProjectMetrics(projectId, employees, attendance);
    },
    [employees, attendance]
  );

  // Workforce analytics calculation
  const getWorkforceAnalytics = useCallback(() => {
    // Nationality distribution
    const nationalityMap = new Map();
    employees.forEach((emp) => {
      nationalityMap.set(
        emp.nationality,
        (nationalityMap.get(emp.nationality) || 0) + 1
      );
    });

    const nationalityDistribution = Array.from(nationalityMap.entries()).map(
      ([nationality, count]) => {
        const nationalityEmployees = employees.filter(
          (emp) => emp.nationality === nationality
        );
        const averageRate =
          nationalityEmployees.reduce((sum, emp) => sum + emp.actualRate, 0) /
          count;
        const totalHours = attendance
          .filter((record) => {
            const employee = employees.find(
              (emp) => emp.id === record.employeeId
            );
            return employee?.nationality === nationality;
          })
          .reduce(
            (sum, record) => sum + record.hoursWorked + record.overtime,
            0
          );

        return {
          nationality,
          count,
          percentage: (count / employees.length) * 100,
          averageRate,
          totalHours,
        };
      }
    );

    // Trade distribution
    const tradeMap = new Map();
    employees.forEach((emp) => {
      if (!tradeMap.has(emp.trade)) {
        tradeMap.set(emp.trade, []);
      }
      tradeMap.get(emp.trade).push(emp);
    });

    const tradeDistribution = Array.from(tradeMap.entries()).map(
      ([trade, tradeEmployees]) => {
        const averageHourlyRate =
          tradeEmployees.reduce((sum, emp) => sum + emp.hourlyRate, 0) /
          tradeEmployees.length;
        const averageActualRate =
          tradeEmployees.reduce((sum, emp) => sum + emp.actualRate, 0) /
          tradeEmployees.length;
        const profitMargin =
          averageActualRate > 0
            ? ((averageActualRate - averageHourlyRate) / averageActualRate) *
            100
            : 0;

        return {
          trade,
          count: tradeEmployees.length,
          averageHourlyRate,
          averageActualRate,
          profitMargin,
          demand:
            profitMargin > 30 ? "high" : profitMargin > 15 ? "medium" : "low",
        };
      }
    );

    // Performance metrics
    const performanceMetrics = employees.map((emp) => ({
      employeeId: emp.id,
      name: emp.name,
      efficiency: emp.performanceRating || 85,
      attendance: 92, // Calculate from attendance records
      quality: 88,
      safety: 95,
      overall: emp.performanceRating || 85,
    }));

    // Attendance patterns (last 30 days)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const attendancePatterns = last30Days.map((date) => {
      const dayAttendance = attendance.filter((record) => record.date === date);
      const totalHours = dayAttendance.reduce(
        (sum, record) => sum + record.hoursWorked,
        0
      );
      const overtime = dayAttendance.reduce(
        (sum, record) => sum + record.overtime,
        0
      );
      const attendanceCount = dayAttendance.length;
      const efficiency =
        totalHours > 0 ? (totalHours / (attendanceCount * 8)) * 100 : 0;

      return {
        date,
        totalHours,
        overtime,
        attendance: attendanceCount,
        efficiency,
      };
    });

    // Profit trends
    const profitTrends = generateProfitTrends(employees, attendance);

    return {
      nationalityDistribution,
      tradeDistribution,
      performanceMetrics,
      attendancePatterns,
      profitTrends,
    };
  }, [employees, attendance]);

  // CRUD operations for employees
  const addEmployee = useCallback(
    (employee) => {
      const newEmployee = {
        ...employee,
        id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setEmployees((prev) => [...prev, newEmployee]);
      return newEmployee;
    },
    [setEmployees]
  );

  const updateEmployee = useCallback(
    (id, updates) => {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, ...updates, updatedAt: new Date() } : emp
        )
      );
    },
    [setEmployees]
  );

  const deleteEmployee = useCallback(
    (id) => {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      // Also remove related attendance records
      setAttendance((prev) =>
        prev.filter((record) => record.employeeId !== id)
      );
    },
    [setEmployees, setAttendance]
  );

  // CRUD operations for projects
  const addProject = useCallback(
    (project) => {
      const newProject = {
        ...project,
        id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        statusHistory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    },
    [setProjects]
  );

  const updateProject = useCallback(
    (id, updates) => {
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === id ? { ...proj, ...updates, updatedAt: new Date() } : proj
        )
      );
    },
    [setProjects]
  );

  // Attendance operations
  const addAttendanceRecord = useCallback(
    (record) => {
      const newRecord = {
        ...record,
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setAttendance((prev) => [...prev, newRecord]);
      return newRecord;
    },
    [setAttendance]
  );

  const addBulkAttendance = useCallback(
    (records) => {
      const newRecords = records.map((record) => ({
        ...record,
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      setAttendance((prev) => [...prev, ...newRecords]);
      return newRecords;
    },
    [setAttendance]
  );

  // Financial calculations
  const calculateProjectFinancials = useCallback(
    (projectId, dateFrom, dateTo) => {
      const projectAttendance = attendance.filter((record) => {
        const employee = employees.find((emp) => emp.id === record.employeeId);
        const matchesProject = employee?.projectId === projectId;

        if (!dateFrom || !dateTo) return matchesProject;

        const recordDate = new Date(record.date);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);

        return matchesProject && recordDate >= fromDate && recordDate <= toDate;
      });

      let totalLaborCost = 0;
      let totalRevenue = 0;
      let totalHours = 0;

      projectAttendance.forEach((record) => {
        const employee = employees.find((emp) => emp.id === record.employeeId);
        if (employee) {
          const financials = calculateFinancials(
            record.hoursWorked,
            record.overtime,
            employee.hourlyRate,
            employee.actualRate
          );
          totalLaborCost += financials.laborCost;
          totalRevenue += financials.revenue;
          totalHours += record.hoursWorked + record.overtime;
        }
      });

      const profit = totalRevenue - totalLaborCost;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
      const effectiveRate = totalHours > 0 ? totalRevenue / totalHours : 0;

      return {
        laborCost: totalLaborCost,
        revenue: totalRevenue,
        profit,
        profitMargin,
        regularPay: totalLaborCost * 0.8, // Estimate
        overtimePay: totalLaborCost * 0.2, // Estimate
        totalHours,
        effectiveRate,
      };
    },
    [employees, attendance]
  );

  // Generate actionable insights
  const generateInsights = useCallback(() => {
    return generateActionableInsights(employees, projects, attendance);
  }, [employees, projects, attendance]);

  // Export functions
  const exportData = useCallback(
    (type, format = "csv") => {
      let data = [];
      let filename = "";

      switch (type) {
        case "employees":
          data = employees.map((emp) => ({
            "Employee ID": emp.employeeId,
            Name: emp.name,
            Trade: emp.trade,
            Nationality: emp.nationality,
            Phone: emp.phoneNumber,
            "Hourly Rate": emp.hourlyRate,
            "Actual Rate": emp.actualRate,
            Project:
              projects.find((p) => p.id === emp.projectId)?.name ||
              "Unassigned",
            Status: emp.status,
          }));
          filename = `employees_export_${new Date().toISOString().split("T")[0]
            }`;
          break;

        case "attendance":
          data = attendance.map((record) => {
            const employee = employees.find(
              (emp) => emp.id === record.employeeId
            );
            const project = projects.find((p) => p.id === employee?.projectId);
            const financials = employee
              ? calculateFinancials(
                record.hoursWorked,
                record.overtime,
                employee.hourlyRate,
                employee.actualRate
              )
              : null;

            return {
              Date: record.date,
              Employee: employee?.name || "Unknown",
              Project: project?.name || "Unassigned",
              "Regular Hours": record.hoursWorked,
              "Overtime Hours": record.overtime,
              "Labor Cost": financials?.laborCost || 0,
              Revenue: financials?.revenue || 0,
              Profit: financials?.profit || 0,
            };
          });
          filename = `attendance_export_${new Date().toISOString().split("T")[0]
            }`;
          break;

        case "projects":
          data = projects.map((project) => {
            const projectMetrics = getProjectMetrics(project.id);
            return {
              "Project Name": project.name,
              Client: project.client,
              Status: project.status,
              Progress: `${project.progress}%`,
              Workforce: projectMetrics.projectWorkforce,
              Revenue: projectMetrics.clientBilling,
              Profit: projectMetrics.realTimeProfit,
              "Start Date": project.startDate,
              "End Date": project.endDate,
            };
          });
          filename = `projects_export_${new Date().toISOString().split("T")[0]
            }`;
          break;

        case "financial":
          const metrics = getDashboardMetrics();
          data = [
            {
              "Total Workforce": metrics.totalWorkforce,
              "Active Projects": metrics.activeProjects,
              "Total Hours": metrics.aggregateHours,
              "Total Revenue": metrics.crossProjectRevenue,
              "Total Profit": metrics.realTimeProfits,
              "Profit Margin": `${metrics.averageProfitMargin.toFixed(2)}%`,
              "Productivity Index": metrics.productivityIndex,
              "Utilization Rate": `${metrics.utilizationRate.toFixed(2)}%`,
            },
          ];
          filename = `financial_summary_${new Date().toISOString().split("T")[0]
            }`;
          break;
      }

      // Convert to CSV or JSON
      let content;
      let mimeType;

      if (format === "csv") {
        const headers = Object.keys(data[0] || {});
        const csvContent = [
          headers.join(","),
          ...data.map((row) =>
            headers.map((header) => `"${row[header]}"`).join(",")
          ),
        ].join("\n");
        content = csvContent;
        mimeType = "text/csv";
        filename += ".csv";
      } else {
        content = JSON.stringify(data, null, 2);
        mimeType = "application/json";
        filename += ".json";
      }

      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [employees, projects, attendance, getDashboardMetrics, getProjectMetrics]
  );

  return {
    // Data
    employees,
    projects,
    attendance,
    clientInvoices,
    salaryInvoices,
    profitReports,
    proposals,
    insights,

    // Setters
    setEmployees,
    setProjects,
    setAttendance,
    setClientInvoices,
    setSalaryInvoices,
    setProfitReports,
    setProposals,
    setInsights,

    // CRUD operations
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addProject,
    updateProject,
    addAttendanceRecord,
    addBulkAttendance,

    // Calculations
    getDashboardMetrics,
    getProjectMetrics,
    getWorkforceAnalytics,
    calculateProjectFinancials,
    calculateEmployeePayroll,
    getPayrollSummary,
    generateInsights,

    // Utilities
    exportData,
  };
};
