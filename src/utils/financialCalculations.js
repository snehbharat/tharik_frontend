// Core financial calculation engine
export const calculateFinancials = (
  regularHours,
  overtimeHours,
  hourlyRate, // What company pays employee
  actualRate // What company bills client
) => {
  // Labor cost calculation (company expense)
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * 1.5; // 1.5x overtime rate
  const laborCost = regularPay + overtimePay;

  // Revenue calculation (client billing)
  const regularRevenue = regularHours * actualRate;
  const overtimeRevenue = overtimeHours * actualRate * 1.5; // 1.5x overtime billing
  const revenue = regularRevenue + overtimeRevenue;

  // Profit calculation
  const profit = revenue - laborCost;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const totalHours = regularHours + overtimeHours;
  const effectiveRate = totalHours > 0 ? revenue / totalHours : 0;

  return {
    laborCost: Number(laborCost.toFixed(2)),
    revenue: Number(revenue.toFixed(2)),
    profit: Number(profit.toFixed(2)),
    profitMargin: Number(profitMargin.toFixed(2)),
    regularPay: Number(regularPay.toFixed(2)),
    overtimePay: Number(overtimePay.toFixed(2)),
    totalHours,
    effectiveRate: Number(effectiveRate.toFixed(2)),
  };
};

// Calculate dashboard metrics
export const calculateDashboardMetrics = (employees, projects, attendance) => {
  const totalWorkforce = employees.filter(
    (emp) => emp.status === "active"
  ).length;
  const activeProjects = projects.filter(
    (proj) => proj.status === "active"
  ).length;

  // Calculate aggregate hours from attendance
  const aggregateHours = attendance.reduce(
    (total, record) => total + record.hoursWorked + record.overtime,
    0
  );

  // Calculate cross-project revenue using actual rates
  const crossProjectRevenue = attendance.reduce((total, record) => {
    const employee = employees.find((emp) => emp.id === record.employeeId);
    if (employee) {
      const financials = calculateFinancials(
        record.hoursWorked,
        record.overtime,
        employee.hourlyRate,
        employee.actualRate
      );
      return total + financials.revenue;
    }
    return total;
  }, 0);

  // Calculate real-time profits
  const realTimeProfits = attendance.reduce((total, record) => {
    const employee = employees.find((emp) => emp.id === record.employeeId);
    if (employee) {
      const financials = calculateFinancials(
        record.hoursWorked,
        record.overtime,
        employee.hourlyRate,
        employee.actualRate
      );
      return total + financials.profit;
    }
    return total;
  }, 0);

  // Calculate productivity index (revenue per hour)
  const productivityIndex =
    aggregateHours > 0 ? crossProjectRevenue / aggregateHours : 0;

  // Calculate utilization rate
  const assignedEmployees = employees.filter(
    (emp) => emp.projectId && emp.status === "active"
  ).length;
  const utilizationRate =
    totalWorkforce > 0 ? (assignedEmployees / totalWorkforce) * 100 : 0;

  // Calculate average profit margin
  const averageProfitMargin =
    crossProjectRevenue > 0 ? (realTimeProfits / crossProjectRevenue) * 100 : 0;

  return {
    totalWorkforce,
    activeProjects,
    aggregateHours,
    crossProjectRevenue: Number(crossProjectRevenue.toFixed(2)),
    realTimeProfits: Number(realTimeProfits.toFixed(2)),
    productivityIndex: Number(productivityIndex.toFixed(2)),
    utilizationRate: Number(utilizationRate.toFixed(2)),
    averageProfitMargin: Number(averageProfitMargin.toFixed(2)),
  };
};

// Calculate project-specific metrics
export const calculateProjectMetrics = (projectId, employees, attendance) => {
  const projectEmployees = employees.filter(
    (emp) => emp.projectId === projectId && emp.status === "active"
  );
  const projectAttendance = attendance.filter((record) => {
    const employee = employees.find((emp) => emp.id === record.employeeId);
    return employee?.projectId === projectId;
  });

  const projectWorkforce = projectEmployees.length;

  // Calculate client billing using actual rates
  const clientBilling = projectAttendance.reduce((total, record) => {
    const employee = employees.find((emp) => emp.id === record.employeeId);
    if (employee) {
      const financials = calculateFinancials(
        record.hoursWorked,
        record.overtime,
        employee.hourlyRate,
        employee.actualRate
      );
      return total + financials.revenue;
    }
    return total;
  }, 0);

  // Calculate labor costs using hourly rates
  const laborCosts = projectAttendance.reduce((total, record) => {
    const employee = employees.find((emp) => emp.id === record.employeeId);
    if (employee) {
      const financials = calculateFinancials(
        record.hoursWorked,
        record.overtime,
        employee.hourlyRate,
        employee.actualRate
      );
      return total + financials.laborCost;
    }
    return total;
  }, 0);

  const realTimeProfit = clientBilling - laborCosts;

  // Calculate productivity (revenue per hour)
  const totalHours = projectAttendance.reduce(
    (total, record) => total + record.hoursWorked + record.overtime,
    0
  );
  const productivity = totalHours > 0 ? clientBilling / totalHours : 0;

  // Calculate worker efficiency (profit per employee)
  const workerEfficiency =
    projectWorkforce > 0 ? realTimeProfit / projectWorkforce : 0;

  // Calculate attendance rate (assuming 22 working days per month)
  const expectedAttendance = projectEmployees.length * 22;
  const actualAttendance = projectAttendance.length;
  const attendanceRate =
    expectedAttendance > 0 ? (actualAttendance / expectedAttendance) * 100 : 0;

  // Calculate overtime percentage
  const totalRegularHours = projectAttendance.reduce(
    (total, record) => total + record.hoursWorked,
    0
  );
  const totalOvertimeHours = projectAttendance.reduce(
    (total, record) => total + record.overtime,
    0
  );
  const overtimePercentage =
    totalHours > 0 ? (totalOvertimeHours / totalHours) * 100 : 0;

  return {
    projectWorkforce,
    clientBilling: Number(clientBilling.toFixed(2)),
    realTimeProfit: Number(realTimeProfit.toFixed(2)),
    laborCosts: Number(laborCosts.toFixed(2)),
    productivity: Number(productivity.toFixed(2)),
    workerEfficiency: Number(workerEfficiency.toFixed(2)),
    attendanceRate: Number(attendanceRate.toFixed(2)),
    overtimePercentage: Number(overtimePercentage.toFixed(2)),
  };
};

// Generate profit trend data for charts
export const generateProfitTrends = (employees, attendance, weeks = 5) => {
  const trends = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekAttendance = attendance.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });

    let revenue = 0;
    let costs = 0;

    weekAttendance.forEach((record) => {
      const employee = employees.find((emp) => emp.id === record.employeeId);
      if (employee) {
        const financials = calculateFinancials(
          record.hoursWorked,
          record.overtime,
          employee.hourlyRate,
          employee.actualRate
        );
        revenue += financials.revenue;
        costs += financials.laborCost;
      }
    });

    const profit = revenue - costs;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const uniqueProjects = new Set(
      weekAttendance
        .map((record) => {
          const employee = employees.find(
            (emp) => emp.id === record.employeeId
          );
          return employee && employee.projectId;
        })
        .filter(Boolean)
    ).size;
    const uniqueEmployees = new Set(
      weekAttendance.map((record) => record.employeeId)
    ).size;

    trends.push({
      week: `Week ${weeks - i}`,
      revenue: Number(revenue.toFixed(2)),
      costs: Number(costs.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      margin: Number(margin.toFixed(2)),
      projects: uniqueProjects,
      employees: uniqueEmployees,
    });
  }

  return trends;
};

// Generate actionable insights based on data analysis
// Generate actionable insights based on data analysis
export const generateActionableInsights = (employees, projects, attendance) => {
  const insights = [];
  const metrics = calculateDashboardMetrics(employees, projects, attendance);

  if (metrics.utilizationRate < 85) {
    insights.push({
      id: `insight_util_${Date.now()}`,
      type: "optimization",
      title: "Workforce Utilization Below Target",
      description: `Current utilization rate is ${metrics.utilizationRate.toFixed(
        1
      )}%. Consider reassigning unassigned workers to active projects to improve efficiency and revenue generation.`,
      impact: "high",
      category: "operational",
      actionRequired: true,
      estimatedBenefit: 50000,
      implementationCost: 5000,
      priority: 1,
      status: "new",
    });
  }

  if (metrics.averageProfitMargin < 20) {
    insights.push({
      id: `insight_margin_${Date.now()}`,
      type: "alert",
      title: "Low Profit Margin Alert",
      description: `Average profit margin is ${metrics.averageProfitMargin.toFixed(
        1
      )}%. Review actual rates and optimize cost structure to improve profitability.`,
      impact: "high",
      category: "financial",
      actionRequired: true,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      priority: 2,
      status: "new",
    });
  }

  if (metrics.productivityIndex > 100) {
    insights.push({
      id: `insight_prod_${Date.now()}`,
      type: "achievement",
      title: "Excellent Productivity Performance",
      description: `Productivity index of ${metrics.productivityIndex.toFixed(
        1
      )} SAR/hour exceeds target. Team performance is outstanding!`,
      impact: "medium",
      category: "efficiency",
      actionRequired: false,
      priority: 3,
      status: "new",
    });
  }

  employees.forEach((employee) => {
    employee.documents.forEach((doc) => {
      if (
        doc.daysUntilExpiry !== undefined &&
        doc.daysUntilExpiry <= 30 &&
        doc.daysUntilExpiry > 0
      ) {
        insights.push({
          id: `insight_doc_${employee.id}_${doc.id}`,
          type: "alert",
          title: "Document Expiry Warning",
          description: `${employee.name}'s ${doc.name} expires in ${doc.daysUntilExpiry} days. Renewal required to maintain compliance.`,
          impact: "high",
          category: "operational",
          actionRequired: true,
          deadline: doc.expiryDate,
          priority: doc.daysUntilExpiry <= 7 ? 1 : 4,
          status: "new",
        });
      }
    });
  });

  projects.forEach((project) => {
    if (project.status === "active" || project.status === "hold") {
      const projectMetrics = calculateProjectMetrics(
        project.id,
        employees,
        attendance
      );

      if (projectMetrics.realTimeProfit > 0 && project.profitMargin > 25) {
        insights.push({
          id: `insight_proj_${project.id}`,
          type: "recommendation",
          title: `${project.name} - High Profit Opportunity`,
          description: `This project shows ${project.profitMargin.toFixed(
            1
          )}% profit margin. Consider allocating more resources to maximize returns.`,
          impact: "high",
          category: "financial",
          actionRequired: false,
          estimatedBenefit: projectMetrics.realTimeProfit * 0.2,
          priority: 3,
          status: "new",
        });
      }

      if (projectMetrics.attendanceRate < 80) {
        insights.push({
          id: `insight_attend_${project.id}`,
          type: "alert",
          title: `${project.name} - Low Attendance Rate`,
          description: `Attendance rate is ${projectMetrics.attendanceRate.toFixed(
            1
          )}%. Investigate causes and implement improvement measures.`,
          impact: "medium",
          category: "operational",
          actionRequired: true,
          priority: 2,
          status: "new",
        });
      }
    }
  });

  return insights.sort((a, b) => a.priority - b.priority);
};

// Utility functions for data formatting
export const formatCurrency = (amount, currency = "SAR") => {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: currency || 0,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value = 0, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

export const formatHours = (hours) => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
};

// Calculate days until expiry for documents
export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return 999;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if document is expiring soon
export const isDocumentExpiringSoon = (expiryDate, warningDays = 30) => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  return daysUntilExpiry <= warningDays && daysUntilExpiry > 0;
};

// Check if document is expired
export const isDocumentExpired = (expiryDate) => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  return daysUntilExpiry <= 0;
};

// Filter employees based on search criteria
export const filterEmployees = (employees, searchTerm, filters) => {
  return employees.filter((employee) => {
    const matchesSearch =
      !searchTerm ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phoneNumber.includes(searchTerm);

    const matchesNationality =
      !filters.nationality || employee.nationality === filters.nationality;
    const matchesTrade = !filters.trade || employee.trade === filters.trade;
    const matchesProject =
      !filters.project || employee.projectId === filters.project;
    const matchesStatus = !filters.status || employee.status === filters.status;

    return (
      matchesSearch &&
      matchesNationality &&
      matchesTrade &&
      matchesProject &&
      matchesStatus
    );
  });
};

// Validate employee data
export const validateEmployee = (employee) => {
  const errors = [];

  if (!employee.name || !employee.name.trim())
    errors.push("Employee name is required");
  if (!employee.employeeId || !employee.employeeId.trim())
    errors.push("Employee ID is required");
  if (!employee.trade || !employee.trade.trim())
    errors.push("Trade is required");
  if (!employee.nationality || !employee.nationality.trim())
    errors.push("Nationality is required");
  if (!employee.phoneNumber || !employee.phoneNumber.trim())
    errors.push("Phone number is required");

  if (typeof employee.hourlyRate !== "number" || employee.hourlyRate <= 0) {
    errors.push("Valid hourly rate is required");
  }

  if (typeof employee.actualRate !== "number" || employee.actualRate <= 0) {
    errors.push("Valid actual rate is required");
  }

  if (
    employee.hourlyRate &&
    employee.actualRate &&
    employee.actualRate <= employee.hourlyRate
  ) {
    errors.push(
      "Actual rate must be higher than hourly rate for profitability"
    );
  }

  if (employee.phoneNumber && !employee.phoneNumber.match(/^\+966[0-9]{9}$/)) {
    errors.push("Phone number must be in format +966XXXXXXXXX");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Validate project data
export const validateProject = (project) => {

  console.log("project", project);

  const errors = [];

  if (!project.name || !project.name.trim())
    errors.push("Project name is required");
  if (!project.client_name || !project.client_name.trim())
    errors.push("Client is required");
  if (!project.location || !project.location.trim())
    errors.push("Location is required");
  if (!project.start_date) errors.push("Start date is required");
  if (!project.end_date) errors.push("End date is required");

  if (typeof project.budget !== "number" || project.budget <= 0) {
    errors.push("Valid budget is required");
  }

  if (
    project.start_date &&
    project.end_date &&
    new Date(project.start_date) >= new Date(project.end_date)
  ) {
    errors.push("End date must be after start date");
  }

  if (
    project.progress !== undefined &&
    (project.progress < 0 || project.progress > 100)
  ) {
    errors.push("Progress must be between 0 and 100");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Generate unique IDs
export const generateId = () => {
  return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Generate invoice numbers
export const generateInvoiceNumber = (type, date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  const prefix = type === "client" ? "INV" : "SAL";
  return `${prefix}-${year}${month}${day}-${random}`;
};

// Calculate employee performance metrics
export const calculateEmployeePerformance = (employee, attendanceRecords) => {
  const employeeAttendance = attendanceRecords.filter(
    (record) => record.employeeId === employee.id
  );

  // Calculate attendance rate (assuming 22 working days per month)
  const expectedDays = 22;
  const actualDays = employeeAttendance.length;
  const attendanceRate = (actualDays / expectedDays) * 100;

  // Calculate average hours
  const totalHours = employeeAttendance.reduce(
    (sum, record) => sum + record.hoursWorked,
    0
  );
  const averageHours = actualDays > 0 ? totalHours / actualDays : 0;

  // Calculate overtime rate
  const totalOvertime = employeeAttendance.reduce(
    (sum, record) => sum + record.overtime,
    0
  );
  const overtimeRate = totalHours > 0 ? (totalOvertime / totalHours) * 100 : 0;

  // Calculate efficiency (hours worked vs expected)
  const expectedHours = actualDays * 8;
  const efficiency = expectedHours > 0 ? (totalHours / expectedHours) * 100 : 0;

  // Calculate profit generated
  const profitGenerated = employeeAttendance.reduce((sum, record) => {
    const financials = calculateFinancials(
      record.hoursWorked,
      record.overtime,
      employee.hourlyRate,
      employee.actualRate
    );
    return sum + financials.profit;
  }, 0);

  return {
    attendanceRate: Number(attendanceRate.toFixed(1)),
    averageHours: Number(averageHours.toFixed(1)),
    overtimeRate: Number(overtimeRate.toFixed(1)),
    efficiency: Number(efficiency.toFixed(1)),
    profitGenerated: Number(profitGenerated.toFixed(2)),
  };
};

// Export data transformation utilities
export const transformEmployeeForExport = (employee, projects) => {
  const project = projects.find((p) => p.id === employee.projectId);
  const profitMargin =
    employee.actualRate > 0
      ? ((employee.actualRate - employee.hourlyRate) / employee.actualRate) *
        100
      : 0;

  return {
    "Employee ID": employee.employeeId,
    Name: employee.name,
    Trade: employee.trade,
    Nationality: employee.nationality,
    Phone: employee.phoneNumber,
    "Hourly Rate (SAR)": employee.hourlyRate,
    "Actual Rate (SAR)": employee.actualRate,
    "Profit Margin (%)": profitMargin.toFixed(1),
    Project: project?.name || "Unassigned",
    Status: employee.status,
    "Performance Rating": employee.performanceRating || "N/A",
    Skills: employee.skills.join(", "),
    Certifications: employee.certifications.join(", "),
    "Emergency Contact": employee.emergencyContact || "N/A",
  };
};

// Transform payroll data for export
export const transformPayrollForExport = (employee, payrollData, project) => {
  return {
    "Employee ID": employee.employeeId,
    "Employee Name": employee.name,
    Trade: employee.trade,
    Project: project?.name || "Unassigned",
    "Regular Hours": payrollData.totalRegularHours,
    "Overtime Hours": payrollData.totalOvertimeHours,
    "Total Hours": payrollData.totalHours,
    "Hourly Rate (SAR)": employee.hourlyRate,
    "Regular Pay (SAR)":
      payrollData.regularPay ||
      payrollData.totalRegularHours * employee.hourlyRate,
    "Overtime Pay (SAR)":
      payrollData.overtimePay ||
      payrollData.totalOvertimeHours * employee.hourlyRate * 1.5,
    "Gross Pay (SAR)": payrollData.grossPay,
    "GOSI Contribution (SAR)": payrollData.gosiContribution,
    "Other Deductions (SAR)": payrollData.otherDeductions,
    "Net Pay (SAR)": payrollData.netPay,
    "Client Billing (SAR)": payrollData.clientBilling,
    "Profit Generated (SAR)": payrollData.profitGenerated,
    "Profit Margin (%)":
      payrollData.clientBilling > 0
        ? (
            (payrollData.profitGenerated / payrollData.clientBilling) *
            100
          ).toFixed(1)
        : "0",
    "Attendance Days": payrollData.attendanceDays,
  };
};

// Calculate GOSI contributions according to Saudi law
export const calculateGosiContribution = (grossSalary) => {
  // GOSI contribution rate: 11% (9% employer + 2% employee, but we calculate total)
  return grossSalary * 0.11;
};

// Calculate other standard deductions
export const calculateStandardDeductions = (grossSalary) => {
  // Standard deductions: 2% for various items (simplified)
  return grossSalary * 0.02;
};

// Calculate net pay after all deductions
export const calculateNetPay = (grossPay) => {
  const gosiContribution = calculateGosiContribution(grossPay);
  const otherDeductions = calculateStandardDeductions(grossPay);
  const totalDeductions = gosiContribution + otherDeductions;
  const netPay = grossPay - totalDeductions;

  return {
    grossPay,
    gosiContribution,
    otherDeductions,
    totalDeductions,
    netPay,
  };
};

export const transformAttendanceForExport = (record, employee, project) => {
  const financials = calculateFinancials(
    record.hoursWorked,
    record.overtime,
    employee.hourlyRate,
    employee.actualRate
  );

  return {
    Date: record.date,
    "Employee ID": employee.employeeId,
    "Employee Name": employee.name,
    Trade: employee.trade,
    Project: project?.name || "Unassigned",
    "Regular Hours": record.hoursWorked,
    "Overtime Hours": record.overtime,
    "Total Hours": record.hoursWorked + record.overtime,
    "Labor Cost (SAR)": financials.laborCost,
    "Revenue (SAR)": financials.revenue,
    "Profit (SAR)": financials.profit,
    "Profit Margin (%)": financials.profitMargin.toFixed(1),
    Location: record.location || "N/A",
    Weather: record.weatherConditions || "N/A",
    "Approved By": record.approvedBy || "N/A",
    Notes: record.notes || "N/A",
  };
};
