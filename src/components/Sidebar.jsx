import React, { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Truck,
  FileText,
  Calculator,
  Shield,
  Briefcase,
  DollarSign,
  UserCheck,
  Settings,
  UserCog,
  Globe,
  LogOut,
  Camera,
  Target,
  CheckSquare,
  Key,
  User,
  Clock,
  Bell,
  TestTube,
  KeyIcon,
} from "lucide-react";
import { useBilingual } from "./BilingualLayout";

export const Sidebar = ({
  activeModule,
  setActiveModule,
  isArabic,
  setIsArabic,
}) => {
  const { language, isRTL, t } = useBilingual();
  const [user, setUser] = useState({
    name: "Ahmed Al-Rashid",
    nameAr: "أحمد الراشد",
    role: "System Administrator",
    roleAr: "مدير النظام",
    isSignedIn: true,
  });

  const handleSignOut = () => {
    if (
      window.confirm(
        isRTL
          ? "هل أنت متأكد من تسجيل الخروج؟"
          : "Are you sure you want to sign out?"
      )
    ) {
      setUser((prev) => ({ ...prev, isSignedIn: false }));
      // Reset to dashboard
      setActiveModule("dashboard");
    }
  };

  const handleSignIn = () => {
    // Simulate sign in - in real app this would open a login modal or redirect
    const username = prompt(isRTL ? "اسم المستخدم:" : "Username:");
    const password = prompt(isRTL ? "كلمة المرور:" : "Password:");

    if (username && password) {
      // Simple validation - in real app this would be proper authentication
      if (username === "admin" && password === "admin") {
        setUser((prev) => ({ ...prev, isSignedIn: true }));
      } else {
        alert(isRTL ? "بيانات دخول خاطئة" : "Invalid credentials");
      }
    }
  };

  const menuSections = [
    {
      id: "main",
      titleEn: "MAIN",
      titleAr: "الرئيسية",
      isCollapsible: true,
      items: [
        {
          id: "dashboard",
          icon: LayoutDashboard,
          nameEn: "Dashboard",
          nameAr: "لوحة التحكم",
          requiresAuth: false,
          permission: "dashboard.read",
        },
        {
          id: "company",
          icon: Building2,
          nameEn: "Company & Clients",
          nameAr: "الشركة والعملاء",
          requiresAuth: true,
          permission: "company.read",
        },
      ],
    },
    {
      id: "customer",
      titleEn: "CUSTOMER MANAGEMENT",
      titleAr: "إدارة العملاء",
      isCollapsible: true,
      items: [
        {
          id: "lead-management",
          icon: Target,
          nameEn: "Lead Management",
          nameAr: "إدارة العملاء المحتملين",
          requiresAuth: true,
          permission: "leads.read",
        },
      ],
    },
    {
      id: "resources",
      titleEn: "RESOURCES",
      titleAr: "الموارد",
      isCollapsible: true,
      items: [
        {
          id: "manpower",
          icon: Users,
          nameEn: "Workforce Management",
          nameAr: "إدارة القوى العاملة",
          requiresAuth: true,
          permission: "manpower.read",
        },
        {
          id: "fleet",
          icon: Truck,
          nameEn: "Fleet Management",
          nameAr: "إدارة الأسطول",
          requiresAuth: true,
          permission: "fleet.read",
        },
        {
          id: "permissions",
          icon: KeyIcon,
          nameEn: "Permissions",
          nameAr: " إذن",
          requiresAuth: true,
          permission: "permissions.read",
        },
      ],
    },
    {
      id: "operations",
      titleEn: "OPERATIONS",
      titleAr: "العمليات",
      isCollapsible: true,
      items: [
        {
          id: "task-management",
          icon: CheckSquare,
          nameEn: "Task Management",
          nameAr: "إدارة المهام",
          requiresAuth: true,
          permission: "tasks.read",
        },
        // {
        //   id: "work-progress",
        //   icon: Camera,
        //   nameEn: "Work Progress",
        //   nameAr: "تقدم العمل",
        //   requiresAuth: true,
        //   permission: "progress.read",
        // },
      ],
    },
    {
      id: "financial",
      titleEn: "FINANCIAL",
      titleAr: "المالية",
      isCollapsible: true,
      items: [
        {
          id: "invoices",
          icon: FileText,
          nameEn: "Smart Invoicing",
          nameAr: "الفوترة الذكية",
          requiresAuth: true,
          permission: "invoices.read",
        },
        {
          id: "payable-invoices",
          icon: FileText,
          nameEn: "Payble Invoicing",
          nameAr: "الفواتير المستحقة",
          requiresAuth: true,
          permission: "invoices.read",
        },
        {
          id: "payroll",
          icon: Calculator,
          nameEn: "Payroll Management",
          nameAr: "إدارة الرواتب",
          requiresAuth: true,
          permission: "payroll.read",
        },
        // {
        //   id: "compliance",
        //   icon: Shield,
        //   nameEn: "Compliance & Reports",
        //   nameAr: "الامتثال والتقارير",
        //   requiresAuth: true,
        //   permission: "compliance.read",
        // },
        // {
        //   id: "hourly-rates",
        //   icon: Clock,
        //   nameEn: "Hourly Rate Management",
        //   nameAr: "إدارة الأجور بالساعة",
        //   requiresAuth: true,
        //   permission: "payroll.read",
        // },
      ],
    },
    {
      id: "departments",
      titleEn: "DEPARTMENTS",
      titleAr: "الأقسام",
      isCollapsible: true,
      items: [
        {
          id: "operations",
          icon: Briefcase,
          nameEn: "Operations Department",
          nameAr: "قسم العمليات",
          requiresAuth: true,
          permission: "departments.operations",
        },
        {
          id: "finance",
          icon: DollarSign,
          nameEn: "Finance Department",
          nameAr: "قسم المالية",
          requiresAuth: true,
          permission: "departments.finance",
        },
        {
          id: "hr",
          icon: UserCheck,
          nameEn: "Human Resources",
          nameAr: "الموارد البشرية",
          requiresAuth: true,
          permission: "departments.hr",
        },
      ],
    },
    {
      id: "administration",
      titleEn: "ADMINISTRATION",
      titleAr: "الإدارة",
      isCollapsible: true,
      items: [
        // {
        //   id: "integrations",
        //   icon: Globe,
        //   nameEn: "Saudi Integrations",
        //   nameAr: "التكاملات السعودية",
        //   requiresAuth: true,
        //   permission: "integrations.read",
        //   badge: 4,
        //   isNew: true,
        // },
        // {
        //   id: "user-access-roles",
        //   icon: Key,
        //   nameEn: "User Access & Roles",
        //   nameAr: "الوصول والأدوار",
        //   requiresAuth: true,
        //   permission: "admin.roles",
        // },
        // {
        //   id: "system",
        //   icon: Settings,
        //   nameEn: "System Setup",
        //   nameAr: "إعدادات النظام",
        //   requiresAuth: true,
        //   permission: "admin.system",
        // },
        // {
        //   id: "notifications",
        //   icon: Bell,
        //   nameEn: "Notification System",
        //   nameAr: "نظام التنبيهات",
        //   requiresAuth: true,
        //   permission: "notifications.read",
        //   badge: 3,
        // },
        // {
        //   id: "notification-tester",
        //   icon: TestTube,
        //   nameEn: "Notification Tester",
        //   nameAr: "اختبار التنبيهات",
        //   requiresAuth: true,
        //   permission: "notifications.manage",
        //   isNew: true,
        // },
        {
          id: "attendance-tracking",
          icon: Clock,
          nameEn: "Leave Tracking",
          nameAr: "تتبع الحضور",
          requiresAuth: true,
          permission: "attendance.read",
        },
        {
          id: "users",
          icon: UserCog,
          nameEn: "User Management",
          nameAr: "إدارة المستخدمين",
          requiresAuth: true,
          permission: "admin.users",
        },
      ],
    },
  ];

  const handleMenuClick = (itemId, requiresAuth) => {
    if (requiresAuth && !user.isSignedIn) {
      alert(
        isRTL
          ? "يجب تسجيل الدخول للوصول لهذه الصفحة"
          : "Please sign in to access this page"
      );
      return;
    }
    setActiveModule(itemId);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-green-800 via-green-850 to-green-900 text-white flex flex-col shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-green-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/95 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
            <Building2 className="w-6 h-6 text-green-800" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">
              {isRTL ? "أموجك المجمعة" : "AMOAGC"}
            </h1>
            <p className="text-green-200/90 text-sm font-medium">
              {isRTL
                ? "العمليات والمقاولات العامة"
                : "Operations & General Contracting"}
            </p>
          </div>
        </div>

        {/* User Info */}
        {user.isSignedIn && (
          <div className="mt-4 p-3 bg-green-700/80 rounded-xl backdrop-blur-sm border border-green-600/30">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-200/90" />
              <div>
                <div className="text-sm font-semibold tracking-tight">
                  {isRTL ? user.nameAr : user.name}
                </div>
                <div className="text-xs text-green-200/80 font-medium">
                  {isRTL ? user.roleAr : user.role}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-xs font-semibold text-green-300 uppercase tracking-wider mb-3 px-2">
                {section.titleEn}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  const isDisabled = item.requiresAuth && !user.isSignedIn;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() =>
                          handleMenuClick(item.id, item.requiresAuth)
                        }
                        disabled={isDisabled}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                          isActive
                            ? "bg-white/95 text-green-800 shadow-xl transform scale-105 border border-green-200/50"
                            : isDisabled
                            ? "text-green-400/70 opacity-50 cursor-not-allowed"
                            : "text-green-100/90 hover:bg-green-700/60 hover:text-white hover:shadow-md hover:translate-x-1"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium tracking-tight">
                          {isRTL ? item.nameAr : item.nameEn}
                        </span>
                        {isDisabled && (
                          <span className="ml-auto text-xs opacity-60">🔒</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-700/50 backdrop-blur-sm">
        <button
          onClick={() => setIsArabic(!isRTL)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-green-100/90 hover:bg-green-700/60 transition-all duration-200 mb-2 hover:shadow-md hover:translate-x-1"
        >
          <Globe className="w-5 h-5" />
          <span className="font-medium tracking-tight">
            {isRTL ? "English" : "العربية"}
          </span>
        </button>

        {user.isSignedIn ? (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-green-100/90 hover:bg-green-700/60 transition-all duration-200 hover:shadow-md hover:translate-x-1"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium tracking-tight">
              {isRTL ? "تسجيل الخروج" : "Sign Out"}
            </span>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-green-100/90 hover:bg-green-700/60 transition-all duration-200 hover:shadow-md hover:translate-x-1"
          >
            <User className="w-5 h-5" />
            <span className="font-medium tracking-tight">
              {isRTL ? "تسجيل الدخول" : "Sign In"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
