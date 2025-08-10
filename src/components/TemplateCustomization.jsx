import React, { useState, useRef } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Move,
  Copy,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Settings,
  Shield,
  Users,
  Building2,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  MoreVertical,
  Search,
  Filter,
  Download,
  Upload,
  History,
  Eye,
  Lock,
  Unlock,
  Archive,
  ArchiveRestore as Restore,
} from "lucide-react";

// Complete sidebar navigation structure mapped to template elements
const SIDEBAR_NAVIGATION_ELEMENTS = [
  // Main Department
  {
    id: "dept_main",
    name: "Main",
    nameAr: "الرئيسية",
    type: "department",
    children: [
      {
        id: "mod_dashboard",
        name: "Dashboard",
        nameAr: "لوحة التحكم",
        type: "module",
        parentId: "dept_main",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: true,
        permissions: ["dashboard.read"],
        metadata: {
          description: "Main dashboard with overview metrics",
          descriptionAr: "لوحة التحكم الرئيسية مع مؤشرات النظرة العامة",
          icon: "LayoutDashboard",
          order: 1,
          createdAt: "2024-01-01",
          updatedAt: "2024-12-15",
          createdBy: "system",
          version: 1,
          sidebarPath: "/dashboard",
          requiresAuth: false,
          route: "dashboard",
        },
      },
      {
        id: "mod_company",
        name: "Company & Clients",
        nameAr: "الشركة والعملاء",
        type: "module",
        parentId: "dept_main",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: true,
        permissions: ["company.read"],
        metadata: {
          description: "Company information and client management",
          descriptionAr: "معلومات الشركة وإدارة العملاء",
          icon: "Building2",
          order: 2,
          createdAt: "2024-01-01",
          updatedAt: "2024-12-15",
          createdBy: "system",
          version: 1,
          sidebarPath: "/company",
          requiresAuth: true,
          route: "company",
        },
      },
    ],
    isActive: true,
    isLocked: true,
    isRequired: true,
    permissions: ["*"],
    metadata: {
      description: "Main system modules",
      descriptionAr: "وحدات النظام الرئيسية",
      icon: "LayoutDashboard",
      order: 1,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-12-15"),
      createdBy: "system",
      lastModified: new Date("2024-12-15"),
      modifiedBy: "system",
      version: 1,
    },
  },
  // Customer Management Department
  {
    id: "dept_customer",
    name: "Customer Management",
    nameAr: "إدارة العملاء",
    type: "department",
    children: [
      {
        id: "mod_lead_management",
        name: "Lead Management",
        nameAr: "إدارة العملاء المحتملين",
        type: "module",
        parentId: "dept_customer",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["leads.read"],
        metadata: {
          description: "Lead tracking and conversion management",
          descriptionAr: "تتبع العملاء المحتملين وإدارة التحويل",
          icon: "Target",
          order: 1,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/lead-management",
          requiresAuth: true,
          route: "lead-management",
        },
      },
    ],
    isActive: true,
    isLocked: false,
    isRequired: false,
    permissions: ["customer.*"],
    metadata: {
      description: "Customer relationship management modules",
      descriptionAr: "وحدات إدارة علاقات العملاء",
      icon: "Target",
      order: 2,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-12-15"),
      createdBy: "system",
      lastModified: new Date("2024-12-15"),
      modifiedBy: "system",
      version: 1,
    },
  },
  // Resources Department
  {
    id: "dept_resources",
    name: "Resources",
    nameAr: "الموارد",
    type: "department",
    children: [
      {
        id: "mod_manpower",
        name: "Workforce Management",
        nameAr: "إدارة القوى العاملة",
        type: "module",
        parentId: "dept_resources",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: true,
        permissions: ["manpower.read"],
        metadata: {
          description: "Employee and workforce management",
          descriptionAr: "إدارة الموظفين والقوى العاملة",
          icon: "Users",
          order: 1,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/manpower",
          requiresAuth: true,
          route: "manpower",
        },
      },
      {
        id: "mod_hourly_rates",
        name: "Hourly Rate Management",
        nameAr: "إدارة الأجور بالساعة",
        type: "module",
        parentId: "dept_resources",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["payroll.read"],
        metadata: {
          description: "Hourly wage and rate management",
          descriptionAr: "إدارة الأجور والمعدلات بالساعة",
          icon: "Clock",
          order: 2,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/hourly-rates",
          requiresAuth: true,
          route: "hourly-rates",
        },
      },
      {
        id: "mod_notifications",
        name: "Notification System",
        nameAr: "نظام التنبيهات",
        type: "module",
        parentId: "dept_resources",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["notifications.read"],
        metadata: {
          description: "System notifications and alerts",
          descriptionAr: "تنبيهات وإشعارات النظام",
          icon: "Bell",
          order: 3,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/notifications",
          requiresAuth: true,
          badge: 3,
          route: "notifications",
        },
      },
      {
        id: "mod_notification_tester",
        name: "Notification Tester",
        nameAr: "اختبار التنبيهات",
        type: "module",
        parentId: "dept_resources",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["notifications.manage"],
        metadata: {
          description: "Test and validate notification systems",
          descriptionAr: "اختبار والتحقق من أنظمة التنبيهات",
          icon: "TestTube",
          order: 4,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/notification-tester",
          requiresAuth: true,
          route: "notification-tester",
        },
      },
      {
        id: "mod_ai_optimization",
        name: "AI Optimization",
        nameAr: "التحسين بالذكاء الاصطناعي",
        type: "module",
        parentId: "dept_resources",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["ai.read"],
        metadata: {
          description: "AI-powered optimization and insights",
          descriptionAr: "التحسين والرؤى المدعومة بالذكاء الاصطناعي",
          icon: "Brain",
          order: 5,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/ai-optimization",
          requiresAuth: true,
          badge: 2,
          route: "ai-optimization",
        },
      },
      {
        id: "mod_fleet",
        name: "Fleet Management",
        nameAr: "إدارة الأسطول",
        type: "module",
        parentId: "dept_resources",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["fleet.read"],
        metadata: {
          description: "Vehicle and fleet management",
          descriptionAr: "إدارة المركبات والأسطول",
          icon: "Truck",
          order: 6,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/fleet",
          requiresAuth: true,
          route: "fleet",
        },
      },
    ],
    isActive: true,
    isLocked: false,
    isRequired: true,
    permissions: ["resources.*"],
    metadata: {
      description: "Resource management modules",
      descriptionAr: "وحدات إدارة الموارد",
      icon: "Users",
      order: 3,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-12-15"),
      createdBy: "system",
      lastModified: new Date("2024-12-15"),
      modifiedBy: "system",
      version: 1,
    },
  },
  // Operations Department
  {
    id: "dept_operations",
    name: "Operations",
    nameAr: "العمليات",
    type: "department",
    children: [
      {
        id: "mod_task_management",
        name: "Task Management",
        nameAr: "إدارة المهام",
        type: "module",
        parentId: "dept_operations",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["tasks.read"],
        metadata: {
          description: "Task assignment and tracking",
          descriptionAr: "تخصيص وتتبع المهام",
          icon: "CheckSquare",
          order: 1,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/task-management",
          requiresAuth: true,
          route: "task-management",
        },
      },
      {
        id: "mod_work_progress",
        name: "Work Progress",
        nameAr: "تقدم العمل",
        type: "module",
        parentId: "dept_operations",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["progress.read"],
        metadata: {
          description: "Visual work progress tracking",
          descriptionAr: "تتبع تقدم العمل المرئي",
          icon: "Camera",
          order: 2,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/work-progress",
          requiresAuth: true,
          route: "work-progress",
        },
      },
    ],
    isActive: true,
    isLocked: false,
    isRequired: false,
    permissions: ["operations.*"],
    metadata: {
      description: "Operational workflow modules",
      descriptionAr: "وحدات سير العمل التشغيلي",
      icon: "CheckSquare",
      order: 4,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-12-15"),
      createdBy: "system",
      lastModified: new Date("2024-12-15"),
      modifiedBy: "system",
      version: 1,
    },
  },
  // Financial Department
  {
    id: "dept_financial",
    name: "Financial",
    nameAr: "المالية",
    type: "department",
    children: [
      {
        id: "mod_invoices",
        name: "Smart Invoicing",
        nameAr: "الفوترة الذكية",
        type: "module",
        parentId: "dept_financial",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: true,
        permissions: ["invoices.read"],
        metadata: {
          description: "ZATCA compliant invoicing system",
          descriptionAr: "نظام الفوترة المتوافق مع زاتكا",
          icon: "FileText",
          order: 1,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/invoices",
          requiresAuth: true,
          route: "invoices",
        },
      },
      {
        id: "mod_payroll",
        name: "Payroll Management",
        nameAr: "إدارة الرواتب",
        type: "module",
        parentId: "dept_financial",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: true,
        permissions: ["payroll.read"],
        metadata: {
          description: "Employee payroll and compensation",
          descriptionAr: "رواتب الموظفين والتعويضات",
          icon: "Calculator",
          order: 2,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/payroll",
          requiresAuth: true,
          route: "payroll",
        },
      },
      {
        id: "mod_compliance",
        name: "Compliance & Reports",
        nameAr: "الامتثال والتقارير",
        type: "module",
        parentId: "dept_financial",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: true,
        permissions: ["compliance.read"],
        metadata: {
          description: "Regulatory compliance and reporting",
          descriptionAr: "الامتثال التنظيمي والتقارير",
          icon: "Shield",
          order: 3,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/compliance",
          requiresAuth: true,
          route: "compliance",
        },
      },
    ],
    isActive: true,
    isLocked: false,
    isRequired: true,
    permissions: ["financial.*"],
    metadata: {
      description: "Financial management modules",
      descriptionAr: "وحدات الإدارة المالية",
      icon: "DollarSign",
      order: 5,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-12-15"),
      createdBy: "system",
      lastModified: new Date("2024-12-15"),
      modifiedBy: "system",
      version: 1,
    },
  },
  // Departments Section
  {
    id: "dept_departments",
    name: "Departments",
    nameAr: "الأقسام",
    type: "department",
    children: [
      {
        id: "mod_operations_dept",
        name: "Operations Department",
        nameAr: "قسم العمليات",
        type: "module",
        parentId: "dept_departments",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["operations.read"],
        metadata: {
          description: "Operations department management",
          descriptionAr: "إدارة قسم العمليات",
          icon: "Briefcase",
          order: 1,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/operations",
          requiresAuth: true,
          route: "operations",
        },
      },
      {
        id: "mod_finance_dept",
        name: "Finance Department",
        nameAr: "قسم المالية",
        type: "module",
        parentId: "dept_departments",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["finance.read"],
        metadata: {
          description: "Finance department management",
          descriptionAr: "إدارة قسم المالية",
          icon: "DollarSign",
          order: 2,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/finance",
          requiresAuth: true,
          route: "finance",
        },
      },
      {
        id: "mod_hr_dept",
        name: "Human Resources",
        nameAr: "الموارد البشرية",
        type: "module",
        parentId: "dept_departments",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: false,
        permissions: ["hr.read"],
        metadata: {
          description: "Human resources department",
          descriptionAr: "قسم الموارد البشرية",
          icon: "UserCheck",
          order: 3,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/hr",
          requiresAuth: true,
          route: "hr",
        },
      },
    ],
    isActive: true,
    isLocked: false,
    isRequired: false,
    permissions: ["departments.*"],
    metadata: {
      description: "Department management modules",
      descriptionAr: "وحدات إدارة الأقسام",
      icon: "Building2",
      order: 6,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-12-15"),
      createdBy: "system",
      lastModified: new Date("2024-12-15"),
      modifiedBy: "system",
      version: 1,
    },
  },
  // Administration Department
  {
    id: "dept_administration",
    name: "Administration",
    nameAr: "الإدارة",
    type: "department",
    children: [
      {
        id: "mod_user_access_roles",
        name: "User Access & Roles",
        nameAr: "الوصول والأدوار",
        type: "module",
        parentId: "dept_administration",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: true,
        permissions: ["roles.read"],
        metadata: {
          description: "User permissions and role management",
          descriptionAr: "صلاحيات المستخدمين وإدارة الأدوار",
          icon: "Key",
          order: 1,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/user-access-roles",
          requiresAuth: true,
          route: "user-access-roles",
        },
      },
      {
        id: "mod_system_setup",
        name: "System Setup",
        nameAr: "إعدادات النظام",
        type: "module",
        parentId: "dept_administration",
        children: [],
        isActive: true,
        isLocked: true,
        isRequired: true,
        permissions: ["system.admin"],
        metadata: {
          description: "System configuration and settings",
          descriptionAr: "تكوين النظام والإعدادات",
          icon: "Settings",
          order: 2,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/system",
          requiresAuth: true,
          route: "system",
        },
      },
      {
        id: "mod_user_management",
        name: "User Management",
        nameAr: "إدارة المستخدمين",
        type: "module",
        parentId: "dept_administration",
        children: [],
        isActive: true,
        isLocked: false,
        isRequired: true,
        permissions: ["users.read"],
        metadata: {
          description: "User account management",
          descriptionAr: "إدارة حسابات المستخدمين",
          icon: "UserCog",
          order: 3,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-12-15"),
          createdBy: "system",
          lastModified: new Date("2024-12-15"),
          modifiedBy: "system",
          version: 1,
          sidebarPath: "/users",
          requiresAuth: true,
          route: "users",
        },
      },
    ],
    isActive: true,
    isLocked: true,
    isRequired: true,
    permissions: ["admin.*"],
    metadata: {
      description: "System administration modules",
      descriptionAr: "وحدات إدارة النظام",
      icon: "Settings",
      order: 7,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-12-15"),
      createdBy: "system",
      lastModified: new Date("2024-12-15"),
      modifiedBy: "system",
      version: 1,
    },
  },
];

const TemplateCustomization = ({ isArabic, activeTab }) => {
  const criticalRoutes = ["dashboard", "system", "user-access-roles"];

  const [templateStructure, setTemplateStructure] = useState([
    {
      id: "dept_main",
      name: "Main",
      nameAr: "الرئيسية",
      type: "department",
      isActive: true,
      isLocked: false,
      isRequired: true,
      permissions: ["dashboard.read"],
      metadata: {
        createdAt: new Date("2024-01-01"),
        createdBy: "system",
        lastModified: new Date("2024-12-15"),
        modifiedBy: "admin",
        version: 1,
        description: "Main dashboard and company management",
      },
      children: [
        {
          id: "mod_dashboard",
          name: "Dashboard",
          nameAr: "لوحة التحكم",
          type: "module",
          parentId: "dept_main",
          isActive: true,
          isLocked: false,
          isRequired: true,
          permissions: ["dashboard.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_company",
          name: "Company & Clients",
          nameAr: "الشركة والعملاء",
          type: "module",
          parentId: "dept_main",
          isActive: true,
          isLocked: false,
          isRequired: true,
          permissions: ["company.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
      ],
    },
    {
      id: "dept_customer_mgmt",
      name: "Customer Management",
      nameAr: "إدارة العملاء",
      type: "department",
      isActive: true,
      isLocked: false,
      isRequired: true,
      permissions: ["leads.read"],
      metadata: {
        createdAt: new Date("2024-01-01"),
        createdBy: "system",
        lastModified: new Date("2024-12-15"),
        modifiedBy: "admin",
        version: 1,
        description: "Lead management and client relations",
      },
      children: [
        {
          id: "mod_lead_mgmt",
          name: "Lead Management",
          nameAr: "إدارة العملاء المحتملين",
          type: "module",
          parentId: "dept_customer_mgmt",
          isActive: true,
          isLocked: false,
          isRequired: true,
          permissions: ["leads.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
      ],
    },
    {
      id: "dept_resources",
      name: "Resources",
      nameAr: "الموارد",
      type: "department",
      isActive: true,
      isLocked: false,
      isRequired: true,
      permissions: ["resources.read"],
      metadata: {
        createdAt: new Date("2024-01-01"),
        createdBy: "system",
        lastModified: new Date("2024-12-15"),
        modifiedBy: "admin",
        version: 1,
        description: "Workforce and resource management",
      },
      children: [
        {
          id: "mod_manpower",
          name: "Workforce Management",
          nameAr: "إدارة القوى العاملة",
          type: "module",
          parentId: "dept_resources",
          isActive: true,
          isLocked: false,
          isRequired: true,
          permissions: ["manpower.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_hourly_rates",
          name: "Hourly Rate Management",
          nameAr: "إدارة الأجور بالساعة",
          type: "module",
          parentId: "dept_resources",
          isActive: true,
          isLocked: false,
          isRequired: false,
          permissions: ["payroll.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_notifications",
          name: "Notification System",
          nameAr: "نظام التنبيهات",
          type: "module",
          parentId: "dept_resources",
          isActive: true,
          isLocked: false,
          isRequired: false,
          permissions: ["notifications.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_notification_tester",
          name: "Notification Tester",
          nameAr: "اختبار التنبيهات",
          type: "module",
          parentId: "dept_resources",
          isActive: true,
          isLocked: false,
          isRequired: false,
          permissions: ["notifications.manage"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_ai_optimization",
          name: "AI Optimization",
          nameAr: "التحسين بالذكاء الاصطناعي",
          type: "module",
          parentId: "dept_resources",
          isActive: true,
          isLocked: false,
          isRequired: false,
          permissions: ["ai.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_fleet",
          name: "Fleet Management",
          nameAr: "إدارة الأسطول",
          type: "module",
          parentId: "dept_resources",
          isActive: true,
          isLocked: false,
          isRequired: false,
          permissions: ["fleet.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
      ],
    },
    {
      id: "dept_operations",
      name: "Operations",
      nameAr: "العمليات",
      type: "department",
      isActive: true,
      isLocked: false,
      isRequired: true,
      permissions: ["operations.read"],
      metadata: {
        createdAt: new Date("2024-01-01"),
        createdBy: "system",
        lastModified: new Date("2024-12-15"),
        modifiedBy: "admin",
        version: 1,
        description: "Operational workflows and task management",
      },
      children: [
        {
          id: "mod_task_mgmt",
          name: "Task Management",
          nameAr: "إدارة المهام",
          type: "module",
          parentId: "dept_operations",
          isActive: true,
          isLocked: false,
          isRequired: false,
          permissions: ["tasks.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_work_progress",
          name: "Work Progress",
          nameAr: "تقدم العمل",
          type: "module",
          parentId: "dept_operations",
          isActive: true,
          isLocked: false,
          isRequired: false,
          permissions: ["progress.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
      ],
    },
    {
      id: "dept_financial",
      name: "Financial",
      nameAr: "المالية",
      type: "department",
      isActive: true,
      isLocked: false,
      isRequired: true,
      permissions: ["finance.read"],
      metadata: {
        createdAt: new Date("2024-01-01"),
        createdBy: "system",
        lastModified: new Date("2024-12-15"),
        modifiedBy: "admin",
        version: 1,
        description: "Financial management and reporting",
      },
      children: [
        {
          id: "mod_invoices",
          name: "Smart Invoicing",
          nameAr: "الفوترة الذكية",
          type: "module",
          parentId: "dept_financial",
          isActive: true,
          isLocked: false,
          isRequired: true,
          permissions: ["invoices.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_payroll",
          name: "Payroll Management",
          nameAr: "إدارة الرواتب",
          type: "module",
          parentId: "dept_financial",
          isActive: true,
          isLocked: false,
          isRequired: true,
          permissions: ["payroll.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_compliance",
          name: "Compliance & Reports",
          nameAr: "الامتثال والتقارير",
          type: "module",
          parentId: "dept_financial",
          isActive: true,
          isLocked: false,
          isRequired: true,
          permissions: ["compliance.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
      ],
    },
    {
      id: "dept_departments",
      name: "Departments",
      nameAr: "الأقسام",
      type: "department",
      isActive: true,
      isLocked: false,
      isRequired: true,
      permissions: ["departments.read"],
      metadata: {
        createdAt: new Date("2024-01-01"),
        createdBy: "system",
        lastModified: new Date("2024-12-15"),
        modifiedBy: "admin",
        version: 1,
        description: "Department-specific modules and workflows",
      },
      children: [
        {
          id: "mod_operations_dept",
          name: "Operations Department",
          nameAr: "قسم العمليات",
          type: "module",
          parentId: "dept_departments",
          isActive: true,
          isLocked: false,
          isRequired: false,
          permissions: ["operations.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_finance_dept",
          name: "Finance Department",
          nameAr: "قسم المالية",
          type: "module",
          parentId: "dept_departments",
          isActive: true,
          isLocked: false,
          isRequired: false,
          permissions: ["finance.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_hr_dept",
          name: "Human Resources",
          nameAr: "الموارد البشرية",
          type: "module",
          parentId: "dept_departments",
          isActive: true,
          isLocked: false,
          isRequired: false,
          permissions: ["hr.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
      ],
    },
    {
      id: "dept_administration",
      name: "Administration",
      nameAr: "الإدارة",
      type: "department",
      isActive: true,
      isLocked: false,
      isRequired: true,
      permissions: ["admin.read"],
      metadata: {
        createdAt: new Date("2024-01-01"),
        createdBy: "system",
        lastModified: new Date("2024-12-15"),
        modifiedBy: "admin",
        version: 1,
        description: "System administration and user management",
      },
      children: [
        {
          id: "mod_user_access_roles",
          name: "User Access & Roles",
          nameAr: "الوصول والأدوار",
          type: "module",
          parentId: "dept_administration",
          isActive: true,
          isLocked: false,
          isRequired: true,
          permissions: ["roles.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_system_setup",
          name: "System Setup",
          nameAr: "إعدادات النظام",
          type: "module",
          parentId: "dept_administration",
          isActive: true,
          isLocked: false,
          isRequired: true,
          permissions: ["system.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
        {
          id: "mod_user_mgmt",
          name: "User Management",
          nameAr: "إدارة المستخدمين",
          type: "module",
          parentId: "dept_administration",
          isActive: true,
          isLocked: false,
          isRequired: true,
          permissions: ["users.read"],
          metadata: {
            createdAt: new Date("2024-01-01"),
            createdBy: "system",
            lastModified: new Date("2024-12-15"),
            modifiedBy: "admin",
            version: 1,
          },
        },
      ],
    },
  ]);

  const [expandedElements, setExpandedElements] = useState(
    new Set(["dept_hr", "dept_operations", "mod_employee_mgmt"])
  );
  const [selectedElement, setSelectedElement] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedElement: null,
    dropTarget: null,
    dragOverElement: null,
  });

  // Initialize template elements with integrated sidebar navigation
  const [templateElements, setTemplateElements] = useState(
    SIDEBAR_NAVIGATION_ELEMENTS
  );

  const [newElement, setNewElement] = useState({
    name: "",
    nameAr: "",
    type: "module",
    parentId: "",
    isActive: true,
    isLocked: false,
    isRequired: false,
    permissions: [],
    metadata: {
      description: "",
    },
  });

  const [auditTrail, setAuditTrail] = useState([]);

  // Utility functions
  const findElementById = (id, elements = templateStructure) => {
    for (const element of elements) {
      if (element.id === id) return element;
      if (element.children) {
        const found = findElementById(id, element.children);
        if (found) return found;
      }
    }
    return null;
  };

  const getAllElements = (elements = templateStructure) => {
    const result = [];
    for (const element of elements) {
      result.push(element);
      if (element.children) {
        result.push(...getAllElements(element.children));
      }
    }
    return result;
  };

  const getElementPath = (elementId) => {
    const path = [];
    let current = findElementById(elementId);

    while (current) {
      path.unshift(isArabic ? current.nameAr : current.name);
      if (current.parentId) {
        current = findElementById(current.parentId);
      } else {
        break;
      }
    }

    return path;
  };

  const addAuditEntry = (action, elementId, details) => {
    const entry = {
      id: Date.now(),
      action,
      elementId,
      elementName: findElementById(elementId)?.name || "Unknown",
      timestamp: new Date(),
      user: "current_user",
      details,
    };
    setAuditTrail((prev) => [entry, ...prev.slice(0, 99)]); // Keep last 100 entries
  };

  // CRUD Operations
  const createElement = () => {
    if (!newElement.name || !newElement.type) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    const element = {
      id: `${newElement.type}_${Date.now()}`,
      name: newElement.name,
      nameAr: newElement.nameAr || newElement.name,
      type: newElement.type,
      parentId: newElement.parentId,
      isActive: newElement.isActive,
      isLocked: newElement.isLocked,
      isRequired: newElement.isRequired,
      permissions: newElement.permissions || [],
      metadata: {
        createdAt: new Date(),
        createdBy: "current_user",
        lastModified: new Date(),
        modifiedBy: "current_user",
        version: 1,
        description: newElement.metadata?.description,
      },
      children: [],
    };
  };

  setTemplateStructure((prev) => {
    const updated = [...prev];
    if (element.parentId) {
      const parent = findElementById(element.parentId, updated);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(element);
      }
    } else {
      updated.push(element);
    }
    return updated;
  });

  addAuditEntry("CREATE", element.id, {
    type: element.type,
    name: element.name,
  });

  setNewElement({
    name: "",
    nameAr: "",
    type: "module",
    parentId: "",
    isActive: true,
    isLocked: false,
    isRequired: false,
    permissions: [],
    metadata: { description: "" },
  });
  setShowCreateModal(false);

  alert(isArabic ? "تم إنشاء العنصر بنجاح!" : "Element created successfully!");
};

const updateElement = () => {
  if (!selectedElement) return;

  setTemplateStructure((prev) => {
    const updated = [...prev];
    const element = findElementById(selectedElement.id, updated);
    if (element) {
      Object.assign(element, {
        ...selectedElement,
        metadata: {
          ...selectedElement.metadata,
          lastModified: new Date(),
          modifiedBy: "current_user",
          version: selectedElement.metadata.version + 1,
        },
      });
    }
    return updated;
  });

  addAuditEntry("UPDATE", selectedElement.id, { changes: "Element updated" });
  setShowEditModal(false);
  alert(isArabic ? "تم تحديث العنصر بنجاح!" : "Element updated successfully!");
};

const deleteElement = () => {
  if (!selectedElement) return;

  // Check for dependencies
  const hasChildren =
    selectedElement.children && selectedElement.children.length > 0;
  if (hasChildren) {
    alert(
      isArabic
        ? "لا يمكن حذف عنصر يحتوي على عناصر فرعية"
        : "Cannot delete element with children"
    );
    return;
  }

  if (selectedElement.isRequired) {
    alert(
      isArabic
        ? "لا يمكن حذف العناصر المطلوبة"
        : "Cannot delete required elements"
    );
    return;
  }

  // Additional protection for critical sidebar elements
  if (
    selectedElement.metadata.route &&
    criticalRoutes.includes(selectedElement.metadata.route)
  ) {
    alert(
      isArabic
        ? "لا يمكن حذف العناصر الحرجة للنظام"
        : "Cannot delete system-critical elements"
    );
    return;
  }

  setTemplateStructure((prev) => {
    const removeFromArray = (elements) => {
      return elements.filter((el) => {
        if (el.id === selectedElement.id) return false;
        if (el.children) {
          el.children = removeFromArray(el.children);
        }
        return true;
      });
    };
    return removeFromArray(prev);
  });

  addAuditEntry("DELETE", selectedElement.id, {
    type: selectedElement.type,
    name: selectedElement.name,
  });
  setSelectedElement(null);
  setShowDeleteConfirm(false);
  alert(isArabic ? "تم حذف العنصر بنجاح!" : "Element deleted successfully!");

  const moveElement = (elementId, newParentId) => {
    const element = findElementById(elementId);
    if (!element) return;

    // Validate move operation
    if (newParentId && elementId === newParentId) {
      alert(
        isArabic
          ? "لا يمكن نقل العنصر إلى نفسه"
          : "Cannot move element to itself"
      );
      return;
    }

    // Check if new parent is a child of the element being moved
    const isDescendant = (parentId, childId) => {
      const parent = findElementById(parentId);
      if (!parent || !parent.children) return false;
      return parent.children.some(
        (child) => child.id === childId || isDescendant(child.id, childId)
      );
    };

    if (newParentId && isDescendant(elementId, newParentId)) {
      alert(
        isArabic
          ? "لا يمكن نقل العنصر إلى عنصر فرعي"
          : "Cannot move element to its descendant"
      );
      return;
    }

    setTemplateStructure((prev) => {
      const updated = [...prev];

      // Remove from current location
      const removeFromParent = (elements) => {
        return elements.filter((el) => {
          if (el.children) {
            el.children = removeFromParent(el.children);
          }
          return el.id !== elementId;
        });
      };

      const updatedStructure = removeFromParent(updated);

      // Add to new location
      const elementToMove = { ...element, parentId: newParentId };

      if (newParentId) {
        const newParent = findElementById(newParentId, updatedStructure);
        if (newParent) {
          if (!newParent.children) newParent.children = [];
          newParent.children.push(elementToMove);
        }
      } else {
        updatedStructure.push(elementToMove);
      }

      return updatedStructure;
    });

    addAuditEntry("MOVE", elementId, {
      from: element.parentId || "root",
      to: newParentId || "root",
    });

    alert(isArabic ? "تم نقل العنصر بنجاح!" : "Element moved successfully!");
  };

  // Drag and Drop handlers
  const handleDragStart = (e, element) => {
    if (element.isLocked) {
      e.preventDefault();
      return;
    }

    setDragState({
      isDragging: true,
      draggedElement: element,
      dropTarget: null,
      dragOverElement: null,
    });

    e.dataTransfer.setData("text/plain", element.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, element) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    setDragState((prev) => ({
      ...prev,
      dragOverElement: element,
    }));
  };

  const handleDrop = (e, targetElement) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId && draggedId !== targetElement.id) {
      moveElement(draggedId, targetElement.id);
    }

    setDragState({
      isDragging: false,
      draggedElement: null,
      dropTarget: null,
      dragOverElement: null,
    });
  };

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      draggedElement: null,
      dropTarget: null,
      dragOverElement: null,
    });
  };

  // UI Helper functions
  const toggleExpanded = (elementId) => {
    setExpandedElements((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(elementId)) {
        newSet.delete(elementId);
      } else {
        newSet.add(elementId);
      }
      return newSet;
    });
  };

  const getElementIcon = (type) => {
    switch (type) {
      case "department":
        return Building2;
      case "module":
        return Folder;
      case "section":
        return FileText;
      case "tab":
        return Target;
      case "component":
        return Settings;
      default:
        return FileText;
    }
  };

  const getElementColor = (type) => {
    switch (type) {
      case "department":
        return "text-blue-600 bg-blue-100";
      case "module":
        return "text-green-600 bg-green-100";
      case "section":
        return "text-purple-600 bg-purple-100";
      case "tab":
        return "text-orange-600 bg-orange-100";
      case "component":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const renderElement = (element, level = 0) => {
    const Icon = getElementIcon(element.type);
    const isExpanded = expandedElements.has(element.id);
    const hasChildren = element.children && element.children.length > 0;
    const isDraggedOver = dragState.dragOverElement?.id === element.id;

    return (
      <div key={element.id} className="select-none">
        <div
          className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
            selectedElement?.id === element.id
              ? "bg-blue-50 border-blue-300 shadow-sm"
              : "bg-white border-gray-200 hover:bg-gray-50"
          } ${isDraggedOver ? "bg-yellow-50 border-yellow-300" : ""} ${
            element.isLocked ? "opacity-75" : ""
          }`}
          style={{ marginLeft: `${level * 20}px` }}
          draggable={!element.isLocked}
          onDragStart={(e) => handleDragStart(e, element)}
          onDragOver={(e) => handleDragOver(e, element)}
          onDrop={(e) => handleDrop(e, element)}
          onDragEnd={handleDragEnd}
          onClick={() => setSelectedElement(element)}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(element.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}

          {/* Element Icon */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${getElementColor(
              element.type
            )}`}
          >
            <Icon className="w-4 h-4" />
          </div>

          {/* Element Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {isArabic ? element.nameAr : element.name}
              </span>
              {element.isRequired && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  {isArabic ? "مطلوب" : "Required"}
                </span>
              )}
              {element.isLocked && <Lock className="w-4 h-4 text-gray-500" />}
              {!element.isActive && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                  {isArabic ? "غير نشط" : "Inactive"}
                </span>
              )}
              {element.metadata.sidebarPath && (
                <span
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  title="Sidebar Integrated"
                >
                  SB
                </span>
              )}
              {element.metadata.badge && element.metadata.badge > 0 && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  {element.metadata.badge}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 capitalize">
              {element.type} • v{element.metadata.version}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedElement(element);
                setShowEditModal(true);
              }}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              title={isArabic ? "تعديل" : "Edit"}
            >
              <Edit className="w-4 h-4" />
            </button>

            {!element.isLocked && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElement(element);
                  setShowMoveModal(true);
                }}
                className="p-1 text-green-600 hover:bg-green-100 rounded"
                title={isArabic ? "نقل" : "Move"}
              >
                <Move className="w-4 h-4" />
              </button>
            )}

            {!element.isRequired && !element.isLocked && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElement(element);
                  setShowDeleteConfirm(true);
                }}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
                title={isArabic ? "حذف" : "Delete"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {element.children.map((child) => renderElement(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const hasDependencies = (templateElements || []).some(
    (otherElement) =>
      otherElement.parentId === (selectedElement && selectedElement.id)
  );

  const filteredElements = getAllElements().filter((element) => {
    const matchesSearch =
      !searchTerm ||
      element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.nameAr.includes(searchTerm) ||
      (element.metadata.description &&
        element.metadata.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (element.metadata.sidebarPath &&
        element.metadata.sidebarPath
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesType = filterType === "all" || element.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {isArabic
              ? "إدارة القوالب مع تكامل الشريط الجانبي"
              : "Template Management with Sidebar Integration"}
          </h3>
          <p className="text-gray-600 mt-1">
            {isArabic
              ? "إدارة شاملة لهيكل النظام مع تكامل كامل للشريط الجانبي"
              : "Comprehensive system structure management with complete sidebar integration"}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>
              {templateElements.length} {isArabic ? "قسم" : "departments"}
            </span>
            <span>
              {templateElements.reduce(
                (count, dept) => count + (dept.children?.length || 0),
                0
              )}{" "}
              {isArabic ? "وحدة" : "modules"}
            </span>
            <span>
              {
                templateElements.flatMap(
                  (dept) =>
                    dept.children?.filter((mod) => mod.metadata.sidebarPath) ||
                    []
                ).length
              }{" "}
              {isArabic ? "مسار شريط جانبي" : "sidebar routes"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <History className="w-4 h-4" />
            {isArabic
              ? "سجل التدقيق مع تتبع الشريط الجانبي"
              : "Audit Log with Sidebar Tracking"}
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير مع الشريط الجانبي" : "Export with Sidebar"}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isArabic
              ? "إنشاء عنصر جديد مع تكامل الشريط الجانبي"
              : "Create New Element with Sidebar Integration"}
          </button>
        </div>
      </div>

      {/* Sidebar integration status panel */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-800">
              {isArabic
                ? "تكامل الشريط الجانبي مكتمل"
                : "Sidebar Integration Complete"}
            </h4>
            <p className="text-sm text-green-700">
              {isArabic
                ? "جميع عناصر الشريط الجانبي متكاملة بالكامل مع الحفاظ على الوظائف الأصلية"
                : "All sidebar elements fully integrated while preserving original functionality"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-800">
              {
                templateElements.flatMap(
                  (dept) =>
                    dept.children?.filter((mod) => mod.metadata.sidebarPath) ||
                    []
                ).length
              }
            </div>
            <div className="text-sm text-green-600">
              {isArabic ? "مسارات متكاملة" : "Integrated Routes"}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                isArabic
                  ? "البحث في العناصر والمسارات..."
                  : "Search elements and paths..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">
              {isArabic ? "جميع الأنواع" : "All Types"}
            </option>
            <option value="department">
              {isArabic ? "الأقسام" : "Departments"}
            </option>
            <option value="module">{isArabic ? "الوحدات" : "Modules"}</option>
            <option value="section">
              {isArabic ? "الأقسام الفرعية" : "Sections"}
            </option>
            <option value="tab">{isArabic ? "التبويبات" : "Tabs"}</option>
            <option value="component">
              {isArabic ? "المكونات" : "Components"}
            </option>
          </select>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {isArabic ? "عرض" : "Showing"} {filteredElements.length}{" "}
          {isArabic ? "من" : "of"} {templateElements.length}{" "}
          {isArabic ? "عنصر" : "elements"}
          {filteredElements.some((e) =>
            e.children?.some((c) => c.metadata.sidebarPath)
          ) && (
            <span className="ml-2 text-blue-600">
              (
              {
                filteredElements.flatMap(
                  (e) => e.children?.filter((c) => c.metadata.sidebarPath) || []
                ).length
              }{" "}
              {isArabic ? "مع مسارات شريط جانبي" : "with sidebar paths"})
            </span>
          )}
        </div>
      </div>

      {/* Template Structure */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            {isArabic ? "هيكل النظام المتكامل" : "Integrated System Structure"}
          </h4>
          <div className="text-sm text-gray-500">
            {templateStructure.length} {isArabic ? "قسم رئيسي" : "departments"}
          </div>
        </div>

        <div className="space-y-3">
          {templateStructure.map((element) => renderElement(element))}
        </div>
      </div>

      {/* Selected Element Details */}
      {selectedElement && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {isArabic ? "تفاصيل العنصر" : "Element Details"}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">
                {isArabic ? "المعلومات الأساسية" : "Basic Information"}
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isArabic ? "الاسم:" : "Name:"}
                  </span>
                  <span className="font-medium">
                    {isArabic ? selectedElement.nameAr : selectedElement.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isArabic ? "النوع:" : "Type:"}
                  </span>
                  <span className="font-medium capitalize">
                    {selectedElement.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isArabic ? "المسار:" : "Path:"}
                  </span>
                  <span className="font-medium text-xs">
                    {getElementPath(selectedElement.id).join(" > ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isArabic ? "الحالة:" : "Status:"}
                  </span>
                  <span
                    className={`font-medium ${
                      selectedElement.isActive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedElement.isActive
                      ? isArabic
                        ? "نشط"
                        : "Active"
                      : isArabic
                      ? "غير نشط"
                      : "Inactive"}
                  </span>
                </div>
              </div>
              {selectedElement.metadata.sidebarPath && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? "مسار الشريط الجانبي" : "Sidebar Path"}
                  </label>
                  <p className="text-blue-600 font-mono text-sm">
                    {selectedElement.metadata.sidebarPath}
                  </p>
                </div>
              )}

              {selectedElement.metadata.route && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? "المسار" : "Route"}
                  </label>
                  <p className="text-green-600 font-mono text-sm">
                    {selectedElement.metadata.route}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-3">
                {isArabic ? "البيانات الوصفية" : "Metadata"}
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isArabic ? "تم الإنشاء:" : "Created:"}
                  </span>
                  <span className="font-medium">
                    {selectedElement.metadata.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isArabic ? "بواسطة:" : "By:"}
                  </span>
                  <span className="font-medium">
                    {selectedElement.metadata.createdBy}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isArabic ? "آخر تعديل:" : "Modified:"}
                  </span>
                  <span className="font-medium">
                    {selectedElement.metadata.lastModified.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isArabic ? "الإصدار:" : "Version:"}
                  </span>
                  <span className="font-medium">
                    v{selectedElement.metadata.version}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {selectedElement.metadata.description && (
            <div className="mt-4">
              <h5 className="font-medium text-gray-900 mb-2">
                {isArabic ? "الوصف" : "Description"}
              </h5>
              <p className="text-sm text-gray-600">
                {selectedElement.metadata.description}
              </p>
            </div>
          )}

          {selectedElement.permissions.length > 0 && (
            <div className="mt-4">
              <h5 className="font-medium text-gray-900 mb-2">
                {isArabic ? "الصلاحيات" : "Permissions"}
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedElement.permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Element Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إنشاء عنصر جديد" : "Create New Element"}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
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
                    value={newElement.name}
                    onChange={(e) =>
                      setNewElement({ ...newElement, name: e.target.value })
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
                    value={newElement.nameAr}
                    onChange={(e) =>
                      setNewElement({ ...newElement, nameAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "النوع" : "Type"} *
                  </label>
                  <select
                    value={newElement.type}
                    onChange={(e) =>
                      setNewElement({ ...newElement, type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="department">
                      {isArabic ? "قسم" : "Department"}
                    </option>
                    <option value="module">
                      {isArabic ? "وحدة" : "Module"}
                    </option>
                    <option value="section">
                      {isArabic ? "قسم فرعي" : "Section"}
                    </option>
                    <option value="tab">{isArabic ? "تبويب" : "Tab"}</option>
                    <option value="component">
                      {isArabic ? "مكون" : "Component"}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "العنصر الأب" : "Parent Element"}
                  </label>
                  <select
                    value={newElement.parentId}
                    onChange={(e) =>
                      setNewElement({ ...newElement, parentId: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      {isArabic ? "لا يوجد (مستوى جذر)" : "None (Root Level)"}
                    </option>
                    {getAllElements().map((element) => (
                      <option key={element.id} value={element.id}>
                        {getElementPath(element.id).join(" > ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوصف" : "Description"}
                </label>
                <textarea
                  value={newElement.metadata?.description}
                  onChange={(e) =>
                    setNewElement({
                      ...newElement,
                      metadata: {
                        ...newElement.metadata,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              {/* Sidebar integration fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "مسار الشريط الجانبي" : "Sidebar Path"}
                  </label>
                  <input
                    type="text"
                    value={
                      (newElement.metadata &&
                        newElement.metadata.sidebarPath) ||
                      ""
                    }
                    onChange={(e) =>
                      setNewElement({
                        ...newElement,
                        metadata: {
                          ...(newElement.metadata || {}),
                          sidebarPath: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="/module-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المسار" : "Route"}
                  </label>
                  <input
                    type="text"
                    value={
                      (newElement.metadata && newElement.metadata.route) || ""
                    }
                    onChange={(e) =>
                      setNewElement({
                        ...newElement,
                        metadata: {
                          ...(newElement.metadata || {}),
                          route: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="module-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newElement.isActive}
                    onChange={(e) =>
                      setNewElement({
                        ...newElement,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm">{isArabic ? "نشط" : "Active"}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newElement.isRequired}
                    onChange={(e) =>
                      setNewElement({
                        ...newElement,
                        isRequired: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm">
                    {isArabic ? "مطلوب" : "Required"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newElement.isLocked}
                    onChange={(e) =>
                      setNewElement({
                        ...newElement,
                        isLocked: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm">
                    {isArabic ? "مقفل" : "Locked"}
                  </span>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newElement.metadata?.requiresAuth || false}
                  onChange={(e) =>
                    setNewElement({
                      ...newElement,
                      metadata: {
                        ...(newElement.metadata || {}),
                        requiresAuth: e.target.checked,
                      },
                    })
                  }
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  {isArabic ? "يتطلب مصادقة" : "Requires Auth"}
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={createElement}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "إنشاء العنصر" : "Create Element"}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Element Modal */}
      {showEditModal && selectedElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "تعديل العنصر" : "Edit Element"}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (إنجليزي)" : "Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={selectedElement.name}
                    onChange={(e) =>
                      setSelectedElement({
                        ...selectedElement,
                        name: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    disabled={selectedElement.isLocked}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (عربي)" : "Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={selectedElement.nameAr}
                    onChange={(e) =>
                      setSelectedElement({
                        ...selectedElement,
                        nameAr: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    disabled={selectedElement.isLocked}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوصف" : "Description"}
                </label>
                <textarea
                  value={selectedElement.metadata.description || ""}
                  onChange={(e) =>
                    setSelectedElement({
                      ...selectedElement,
                      metadata: {
                        ...selectedElement.metadata,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  disabled={selectedElement.isLocked}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedElement.isActive}
                    onChange={(e) =>
                      setSelectedElement({
                        ...selectedElement,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 mr-2"
                    disabled={selectedElement.isLocked}
                  />
                  <span className="text-sm">{isArabic ? "نشط" : "Active"}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedElement.isLocked}
                    onChange={(e) =>
                      setSelectedElement({
                        ...selectedElement,
                        isLocked: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm">
                    {isArabic ? "مقفل" : "Locked"}
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={updateElement}
                  disabled={selectedElement.isLocked}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ التغييرات" : "Save Changes"}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">
                {isArabic ? "تأكيد الحذف" : "Confirm Deletion"}
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              {isArabic
                ? `هل أنت متأكد من حذف "${selectedElement.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                : `Are you sure you want to delete "${selectedElement.name}"? This action cannot be undone.`}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={deleteElement}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isArabic ? "حذف" : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Element Modal */}
      {showMoveModal && selectedElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "نقل العنصر" : "Move Element"}
              </h3>
              <button
                onClick={() => setShowMoveModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نقل إلى" : "Move to"}
                </label>
                <select
                  onChange={(e) => {
                    moveElement(selectedElement.id, e.target.value || null);
                    setShowMoveModal(false);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">
                    {isArabic ? "اختر الوجهة" : "Select destination"}
                  </option>
                  <option value="">
                    {isArabic ? "المستوى الجذر" : "Root Level"}
                  </option>
                  {getAllElements()
                    .filter((el) => el.id !== selectedElement.id)
                    .map((element) => (
                      <option key={element.id} value={element.id}>
                        {getElementPath(element.id).join(" > ")}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                {selectedElement.metadata.sidebarPath && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {isArabic
                      ? "متكامل مع الشريط الجانبي"
                      : "Sidebar Integrated"}
                  </span>
                )}
                {selectedElement.metadata.requiresAuth && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    {isArabic ? "يتطلب مصادقة" : "Requires Auth"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCustomization;
