// Mock user data for demonstration
export const MOCK_USERS = [
  {
    username: "admin",
    password: "admin123", // In production, this would be hashed
    email: "admin@amoagc.sa",
    fullName: "System Administrator",
    fullNameAr: "مدير النظام",
    role: {
      id: "admin",
      name: "Administrator",
      nameAr: "مدير",
      level: 10,
      permissions: ["*"], // All permissions
    },
    department: "IT",
    permissions: [
      { id: "all", name: "All Permissions", resource: "*", action: "manage" },
    ],
    isActive: true,
    lastLogin: new Date(),
  },
  {
    username: "hr.manager",
    password: "hr123",
    email: "hr@amoagc.sa",
    fullName: "Fatima Al-Zahra",
    fullNameAr: "فاطمة الزهراء",
    role: {
      id: "hr_manager",
      name: "HR Manager",
      nameAr: "مدير الموارد البشرية",
      level: 8,
      permissions: ["hr.*", "payroll.*", "employees.*"],
    },
    department: "Human Resources",
    permissions: [
      {
        id: "hr_manage",
        name: "HR Management",
        resource: "hr",
        action: "manage",
      },
      {
        id: "payroll_manage",
        name: "Payroll Management",
        resource: "payroll",
        action: "manage",
      },
      {
        id: "employees_manage",
        name: "Employee Management",
        resource: "employees",
        action: "manage",
      },
    ],
    isActive: true,
    lastLogin: new Date(),
  },
  {
    username: "ops.supervisor",
    password: "ops123",
    email: "operations@amoagc.sa",
    fullName: "Ahmed Al-Rashid",
    fullNameAr: "أحمد الراشد",
    role: {
      id: "ops_supervisor",
      name: "Operations Supervisor",
      nameAr: "مشرف العمليات",
      level: 6,
      permissions: ["projects.*", "manpower.*", "fleet.*"],
    },
    department: "Operations",
    permissions: [
      {
        id: "projects_manage",
        name: "Project Management",
        resource: "projects",
        action: "manage",
      },
      {
        id: "manpower_read",
        name: "Manpower View",
        resource: "manpower",
        action: "read",
      },
      {
        id: "fleet_manage",
        name: "Fleet Management",
        resource: "fleet",
        action: "manage",
      },
    ],
    isActive: true,
    lastLogin: new Date(),
  },
  {
    username: "finance.clerk",
    password: "finance123",
    email: "finance@amoagc.sa",
    fullName: "Mohammad Hassan",
    fullNameAr: "محمد حسن",
    role: {
      id: "finance_clerk",
      name: "Finance Clerk",
      nameAr: "موظف مالية",
      level: 4,
      permissions: ["invoices.*", "reports.read"],
    },
    department: "Finance",
    permissions: [
      {
        id: "invoices_manage",
        name: "Invoice Management",
        resource: "invoices",
        action: "manage",
      },
      {
        id: "reports_read",
        name: "Reports View",
        resource: "reports",
        action: "read",
      },
    ],
    isActive: true,
    lastLogin: new Date(),
  },
];
