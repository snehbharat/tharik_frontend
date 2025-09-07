import React, { useEffect, useState } from "react";
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
  LogOut,
  Camera,
  Target,
  CheckSquare,
  Key,
  User,
  Clock,
  Bell,
  TestTube,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Globe,
  Zap,
  Award,
  Activity,
  TrendingUp,
  Home,
  Mail,
  Phone,
  KeyIcon,
} from "lucide-react";
import { useBilingual, BilingualText } from "./BilingualLayout";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { getCompany } from "../services/CompanyService";

export const EnhancedBilingualSidebar = ({
  activeModule,
  setActiveModule,
  isCollapsed = false,
  onToggleCollapse,
  className = "",
}) => {
  const { language, isRTL, t } = useBilingual();
  const { user, logout, hasPermission } = useAuth();
  const [expandedSections, setExpandedSections] = useState(
    new Set([
      "main",
      "customer",
      "resources",
      "operations",
      "financial",
      "departments",
      "administration",
    ])
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [focusedItem, setFocusedItem] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);

  const fetchData = async () => {
    try {
      const data = await getCompany();
      setCompanyInfo(data);
    } catch (error) {
      console.error("Failed to load company info", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log("companyInfo:", companyInfo);

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
        {
          id: "work-progress",
          icon: Camera,
          nameEn: "Work Progress",
          nameAr: "تقدم العمل",
          requiresAuth: true,
          permission: "progress.read",
        },
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

  // function getCookie(name) {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();
  // }

  // const token = getCookie("amoagc_token");

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from useAuth
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSection = (sectionId) => {
    if (isCollapsed) return;

    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleMenuClick = (item) => {
    if (item.requiresAuth && !user) {
      alert(
        language === "ar"
          ? "يجب تسجيل الدخول للوصول لهذه الصفحة"
          : "Please sign in to access this page"
      );
      return;
    }

    if (item.permission && !hasPermission(item.permission)) {
      alert(
        language === "ar"
          ? "ليس لديك صلاحية للوصول لهذه الصفحة"
          : "You do not have permission to access this page"
      );
      return;
    }

    if (!item.id || typeof item.id !== "string") {
      console.error("Invalid menu item ID:", item.id);
      return;
    }

    setActiveModule(item.id);
    setIsMobileMenuOpen(false);
    setFocusedItem(item.id);
  };

  const isMenuItemVisible = (item) => {
    if (item.requiresAuth && !user) return false;
    if (item.permission && !hasPermission(item.permission)) return false;
    return true;
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = activeModule === item.id;
    const isVisible = isMenuItemVisible(item);

    if (!isVisible) return null;

    //

    return (
      <li key={item.id}>
        <button
          onClick={() => handleMenuClick(item)}
          disabled={!isVisible}
          onFocus={() => setFocusedItem(item.id)}
          onBlur={() => setFocusedItem("")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm group relative ${
            isActive
              ? "bg-white/95 text-green-800 shadow-xl transform scale-105 border border-green-200/50"
              : "text-green-100/90 hover:bg-green-700/60 hover:text-white hover:shadow-md hover:translate-x-1"
          } ${isRTL ? "flex-row-reverse" : ""} ${
            isCollapsed ? "justify-center px-2" : ""
          } ${
            !isVisible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${
            focusedItem === item.id ? "ring-2 ring-white ring-opacity-50" : ""
          }`}
          title={
            isCollapsed
              ? language === "ar"
                ? item.nameAr
                : item.nameEn
              : undefined
          }
          aria-label={language === "ar" ? item.nameAr : item.nameEn}
          aria-current={isActive ? "page" : undefined}
        >
          <div className="relative flex-shrink-0">
            <Icon className="w-4 h-4" aria-hidden="true" />

            {/* Badge indicator */}
            {item.badge && item.badge > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse"
                aria-label={`${item.badge} notifications`}
              >
                {item.badge > 9 ? "9+" : item.badge}
              </span>
            )}

            {/* New indicator */}
            {item.isNew && (
              <span
                className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                aria-label="New feature"
              ></span>
            )}
          </div>

          {!isCollapsed && (
            <span className="font-medium tracking-tight flex-1 text-left">
              {language === "ar" ? item.nameAr : item.nameEn}
            </span>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div
              className={`absolute ${
                isRTL ? "right-full mr-2" : "left-full ml-2"
              } top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50`}
            >
              {language === "ar" ? item.nameAr : item.nameEn}
            </div>
          )}
        </button>
      </li>
    );
  };

  // Render section with collapsible functionality
  const renderSection = (section) => {
    const isExpanded = expandedSections.has(section.id);
    const visibleItems = section.items.filter(isMenuItemVisible);

    if (visibleItems.length === 0) return null;

    return (
      <div key={section.id} className="mb-6">
        {!isCollapsed && (
          <button
            onClick={() => toggleSection(section.id)}
            className={`w-full flex items-center justify-between text-xs font-semibold text-green-300 uppercase tracking-wider mb-3 px-2 hover:text-green-200 transition-colors ${
              isRTL ? "text-right" : "text-left"
            }`}
            aria-expanded={isExpanded}
            aria-controls={`section-${section.id}`}
          >
            <span>{language === "ar" ? section.titleAr : section.titleEn}</span>
            {section.isCollapsible && (
              <span className="transition-transform duration-200">
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </span>
            )}
          </button>
        )}

        <div
          id={`section-${section.id}`}
          className={`transition-all duration-300 overflow-hidden ${
            isCollapsed || isExpanded
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <ul className="space-y-1">{section.items.map(renderMenuItem)}</ul>
        </div>
      </div>
    );
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); //state for logout confirmation
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-lg shadow-lg"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        ${className}
        bg-gradient-to-b from-green-800 via-green-850 to-green-900 text-white flex flex-col shadow-2xl transition-all duration-300
        ${isCollapsed ? "w-16" : "w-64"}
        ${isRTL ? "border-l border-green-700" : "border-r border-green-700"}
        fixed lg:relative h-screen z-50
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <header
          className={`p-4 border-b border-green-700/50 ${
            isCollapsed ? "px-2" : "px-6"
          }`}
        >
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <div className="w-10 h-10 bg-white/95 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              {/* <Building2 className="w-6 h-6 text-green-800" /> */}
              <img src="./logo.jpg" alt="" className="w-12 h-12 rounded-xl" />
            </div>

            {!isCollapsed && (
              <div className={isRTL ? "text-right" : "text-left"}>
                <BilingualText
                  en={companyInfo?.companyNameEn}
                  ar={companyInfo?.companyNameAr}
                  className="font-bold text-lg tracking-tight"
                  tag="h1"
                />
                <BilingualText
                  en="Operations & Contracting"
                  ar="العمليات والمقاولات"
                  className="text-green-200/90 text-sm font-medium"
                  tag="p"
                />
              </div>
            )}
          </div>

          {/* User Info */}
          {!isCollapsed && user && (
            <div className="mt-4 p-3 bg-green-700/80 rounded-xl border border-green-600/30 backdrop-blur-sm">
              <div
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <User className="w-4 h-4 text-green-200/90" />
                <div className={isRTL ? "text-right" : "text-left"}>
                  <div className="text-sm font-semibold tracking-tight">
                    {language === "ar" ? user.fullNameAr : user.fullName}
                  </div>
                  <div className="text-xs text-green-200/80 font-medium">
                    {language === "ar" ? user.role.nameAr : user.role.name}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`absolute top-4 bg-green-600 hover:bg-green-700 text-white p-1 rounded-full shadow-lg transition-colors ${
                isRTL ? "left-2" : "right-2"
              }`}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                isRTL ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              ) : isRTL ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </header>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto" role="menubar">
          <div className="space-y-2">{menuSections.map(renderSection)}</div>
        </nav>

        {/* Footer */}
        <footer
          className={`p-4 border-t border-green-700/50 ${
            isCollapsed ? "px-2" : ""
          }`}
        >
          {user ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-green-100/90 hover:bg-green-700/60 transition-all duration-200 hover:shadow-md group ${
                isRTL ? "flex-row-reverse" : ""
              } ${isCollapsed ? "justify-center px-2" : ""}`}
              title={isCollapsed ? t("nav.signOut", "Sign Out") : undefined}
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && (
                <span className="font-medium tracking-tight">
                  <BilingualText en="Sign Out" ar="تسجيل الخروج" />
                </span>
              )}
            </button>
          ) : (
            <div className="text-center text-green-200/80 text-sm">
              <BilingualText en="Not signed in" ar="غير مسجل الدخول" />
            </div>
          )}

          {showLogoutConfirm && (
            <div className="mt-3 p-4 bg-green-700/90 rounded-lg border border-green-600 text-center">
              <p className="mb-3 text-sm">
                {language === "ar"
                  ? "هل أنت متأكد من تسجيل الخروج؟"
                  : "Are you sure you want to logout?"}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                >
                  {language === "ar" ? "نعم" : "Yes"}
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-1 rounded"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          )}
        </footer>
      </aside>
    </>
  );
};
