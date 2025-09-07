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
} from "lucide-react";

export const Sidebar = ({
  activeModule,
  setActiveModule,
  isArabic,
  setIsArabic,
}) => {
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
        isArabic
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
    const username = prompt(isArabic ? "اسم المستخدم:" : "Username:");
    const password = prompt(isArabic ? "كلمة المرور:" : "Password:");

    if (username && password) {
      // Simple validation - in real app this would be proper authentication
      if (username === "admin" && password === "admin") {
        setUser((prev) => ({ ...prev, isSignedIn: true }));
      } else {
        alert(isArabic ? "بيانات دخول خاطئة" : "Invalid credentials");
      }
    }
  };

  const menuSections = [
    {
      title: isArabic ? "الرئيسية" : "Main",
      items: [
        {
          id: "dashboard",
          icon: LayoutDashboard,
          nameEn: "Dashboard",
          nameAr: "لوحة التحكم",
          requiresAuth: false,
        },
        {
          id: "company",
          icon: Building2,
          nameEn: "Company & Clients",
          nameAr: "الشركة والعملاء",
          requiresAuth: true,
        },
      ],
    },
    {
      title: isArabic ? "إدارة العملاء" : "Customer Management",
      items: [
        {
          id: "lead-management",
          icon: Target,
          nameEn: "Lead Management",
          nameAr: "إدارة العملاء المحتملين",
          requiresAuth: true,
        },
      ],
    },
    {
      title: isArabic ? "الموارد" : "Resources",
      items: [
        {
          id: "manpower",
          icon: Users,
          nameEn: "Manpower",
          nameAr: "القوى العاملة",
          requiresAuth: true,
        },
        {
          id: "hourly-rates",
          icon: Clock,
          nameEn: "Hourly Rate Management",
          nameAr: "إدارة الأجور بالساعة",
          requiresAuth: true,
        },
        {
          id: "notifications",
          icon: Bell,
          nameEn: "Notification System",
          nameAr: "نظام التنبيهات",
          requiresAuth: true,
        },
        {
          id: "notification-tester",
          icon: TestTube,
          nameEn: "Notification Tester",
          nameAr: "اختبار التنبيهات",
          requiresAuth: true,
        },
        {
          id: "attendance-tracking",
          icon: Clock,
          nameEn: "Attendance Tracking",
          nameAr: "تتبع الحضور",
          requiresAuth: true,
          permission: "attendance.read",
        },
        {
          id: "fleet",
          icon: Truck,
          nameEn: "Fleet Management",
          nameAr: "إدارة الأسطول",
          requiresAuth: true,
        },
      ],
    },
    {
      title: isArabic ? "العمليات" : "Operations",
      items: [
        {
          id: "task-management",
          icon: CheckSquare,
          nameEn: "Task Management",
          nameAr: "إدارة المهام",
          requiresAuth: true,
        },
        {
          id: "work-progress",
          icon: Camera,
          nameEn: "Work Progress",
          nameAr: "تقدم العمل",
          requiresAuth: true,
        },
      ],
    },
    {
      title: isArabic ? "المالية" : "Financial",
      items: [
        {
          id: "invoices",
          icon: FileText,
          nameEn: "Smart Invoicing",
          nameAr: "الفوترة الذكية",
          requiresAuth: true,
        },
        {
          id: "payroll",
          icon: Calculator,
          nameEn: "Payroll Management",
          nameAr: "إدارة الرواتب",
          requiresAuth: true,
        },
        {
          id: "compliance",
          icon: Shield,
          nameEn: "Compliance & Reports",
          nameAr: "الامتثال والتقارير",
          requiresAuth: true,
        },
      ],
    },
    {
      title: isArabic ? "الأقسام" : "Departments",
      items: [
        {
          id: "operations",
          icon: Briefcase,
          nameEn: "Operations",
          nameAr: "قسم العمليات",
          requiresAuth: true,
        },
        {
          id: "finance",
          icon: DollarSign,
          nameEn: "Finance",
          nameAr: "قسم المالية",
          requiresAuth: true,
        },
        {
          id: "hr",
          icon: UserCheck,
          nameEn: "Human Resources",
          nameAr: "الموارد البشرية",
          requiresAuth: true,
        },
      ],
    },
    {
      title: isArabic ? "الإدارة" : "Administration",
      items: [
        {
          id: "integrations",
          icon: Globe,
          nameEn: "Saudi Integrations",
          nameAr: "التكاملات السعودية",
          requiresAuth: true,
        },
        {
          id: "user-access-roles",
          icon: Key,
          nameEn: "User Access & Roles",
          nameAr: "الوصول والأدوار",
          requiresAuth: true,
        },
        {
          id: "system",
          icon: Settings,
          nameEn: "System Setup",
          nameAr: "إعدادات النظام",
          requiresAuth: true,
        },
        {
          id: "users",
          icon: UserCog,
          nameEn: "User Management",
          nameAr: "إدارة المستخدمين",
          requiresAuth: true,
        },
      ],
    },
  ];

  const handleMenuClick = (itemId, requiresAuth) => {
    if (requiresAuth && !user.isSignedIn) {
      alert(
        isArabic
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
              {isArabic ? "أموجك المجمعة" : "AMOAGC"}
            </h1>
            <p className="text-green-200/90 text-sm font-medium">
              {isArabic
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
                  {isArabic ? user.nameAr : user.name}
                </div>
                <div className="text-xs text-green-200/80 font-medium">
                  {isArabic ? user.roleAr : user.role}
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
                {section.title}
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
                          {isArabic ? item.nameAr : item.nameEn}
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
          onClick={() => setIsArabic(!isArabic)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-green-100/90 hover:bg-green-700/60 transition-all duration-200 mb-2 hover:shadow-md hover:translate-x-1"
        >
          <Globe className="w-5 h-5" />
          <span className="font-medium tracking-tight">
            {isArabic ? "English" : "العربية"}
          </span>
        </button>

        {user.isSignedIn ? (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-green-100/90 hover:bg-green-700/60 transition-all duration-200 hover:shadow-md hover:translate-x-1"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium tracking-tight">
              {isArabic ? "تسجيل الخروج" : "Sign Out"}
            </span>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-green-100/90 hover:bg-green-700/60 transition-all duration-200 hover:shadow-md hover:translate-x-1"
          >
            <User className="w-5 h-5" />
            <span className="font-medium tracking-tight">
              {isArabic ? "تسجيل الدخول" : "Sign In"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
