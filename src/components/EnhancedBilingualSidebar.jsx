import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  Building2,
  Target,
  Users,
  Truck,
  KeyIcon,
  CheckSquare,
  FileText,
  Calculator,
  Briefcase,
  DollarSign,
  UserCheck,
  Clock,
  UserCog,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  ChevronLeft,
  Settings,
} from "lucide-react";
import { useBilingual, BilingualText } from "./BilingualLayout";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { getCompany } from "../services/CompanyService";
import UserService from "../services/UserService";

export const EnhancedBilingualSidebar = ({
  activeModule,
  setActiveModule,
  isCollapsed = false,
  onToggleCollapse,
  className = "",
}) => {
  const { language, isRTL } = useBilingual();
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // --- Fetch users and company info once ---
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, companyRes] = await Promise.all([
          UserService.getAllUsers(),
          getCompany(),
        ]);
        setUsers(usersRes?.data || []);
        setCompanyInfo(companyRes || {});
      } catch (err) {
        console.error("Sidebar init failed:", err);
      }
    };
    fetchAll();
  }, []);

  // --- Identify current user ---
  const matchedUser = useMemo(
    () => users.find((u) => u.email === user?.email),
    [users, user]
  );
  const userRole = matchedUser?.role || "guest";

  // --- Role-based Access Map ---
  const roleBasedAccess = useMemo(
    () => ({
      admin: ["*"],
      "Operations Supervisor": [
        "dashboard",
        "task-management",
        "manpower-1",
        "fleet",
        "operations",
      ],
      "Finance Clerk": [
        "dashboard",
        "invoices",
        "payable-invoices",
        "payroll",
        "finance",
      ],
      "HR Manager": ["dashboard", "manpower", "attendance-tracking", "hr"],
    }),
    []
  );

  // --- Menu Structure ---
  const menuSections = useMemo(
    () => [
      {
        id: "main",
        titleEn: "MAIN",
        titleAr: "الرئيسية",
        items: [
          {
            id: "dashboard",
            icon: LayoutDashboard,
            nameEn: "Dashboard",
            nameAr: "لوحة التحكم",
          },
        ],
      },
      {
        id: "customer",
        titleEn: "CUSTOMER MANAGEMENT",
        titleAr: "إدارة العملاء",
        items: [
          {
            id: "client",
            icon: Building2,
            nameEn: "Client Directory",
            nameAr: "دليل العملاء",
          },
          {
            id: "lead-management",
            icon: Target,
            nameEn: "Lead Management",
            nameAr: "إدارة العملاء المحتملين",
          },
        ],
      },
      {
        id: "resources",
        titleEn: "PROJECT OPERATIONS",
        titleAr: "تشغيل المشروع",
        items: [
          // {
          //   id: "manpower",
          //   icon: Users,
          //   nameEn: "Workforce Management",
          //   nameAr: "إدارة القوى العاملة",
          // },
          {
            id: "manpower-1",
            icon: Users,
            nameEn: "Workforce Management",
            nameAr: "إدارة القوى العاملة",
          },
          {
            id: "task-management",
            icon: CheckSquare,
            nameEn: "Task Management",
            nameAr: "إدارة المهام",
          },
          {
            id: "fleet",
            icon: Truck,
            nameEn: "Fleet Management",
            nameAr: "إدارة الأسطول",
          },
          {
            id: "operations",
            icon: Briefcase,
            nameEn: "Team Scheduling",
            nameAr: "جدولة الفريق",
          },
        ],
      },
      {
        id: "operations",
        titleEn: "OPERATIONS",
        titleAr: "العمليات",
        items: [],
      },
      {
        id: "financial",
        titleEn: "FINANCIAL MANAGMENTS",
        titleAr: "الإدارة المالية",
        items: [
          {
            id: "invoices",
            icon: FileText,
            nameEn: "Smart Invoicing",
            nameAr: "الفوترة الذكية",
          },
          {
            id: "payable-invoices",
            icon: FileText,
            nameEn: "Payable Invoicing",
            nameAr: "الفواتير المستحقة",
          },
          {
            id: "payroll",
            icon: Calculator,
            nameEn: "Payroll Management",
            nameAr: "إدارة الرواتب",
          },
          {
            id: "finance",
            icon: DollarSign,
            nameEn: "Financial Report",
            nameAr: "التقرير المالي",
          },
        ],
      },
      {
        id: "departments",
        titleEn: "HUMAN RESOURCE",
        titleAr: "الموارد البشرية",
        items: [
          {
            id: "manpower",
            icon: Users,
            nameEn: "Workforce Management",
            nameAr: "إدارة القوى العاملة",
          },
          {
            id: "attendance-tracking",
            icon: Clock,
            nameEn: "Leave Tracking",
            nameAr: "تتبع الحضور",
          },
          {
            id: "hr",
            icon: UserCheck,
            nameEn: "Human Resources",
            nameAr: "الموارد البشرية",
          },
        ],
      },
      {
        id: "administration",
        titleEn: "SYSTEM ADMIN",
        titleAr: "مسؤول النظام",
        items: [
          {
            id: "users",
            icon: UserCog,
            nameEn: "User Management",
            nameAr: "إدارة المستخدمين",
          },
          {
            id: "permissions",
            icon: KeyIcon,
            nameEn: "Permissions",
            nameAr: "إذن",
          },
          {
            id: "company",
            icon: Building2,
            nameEn: "Company Profile",
            nameAr: "ملف الشركة",
          },
          {
            id: "system-settings",
            icon: Settings,
            nameEn: "System Settings",
            nameAr: "إعدادات النظام",
          },
        ],
      },
    ],
    []
  );

  // --- Accessible Menu based on Role ---
  const accessibleIds = useMemo(() => {
    const allowed = roleBasedAccess[userRole];
    if (!allowed) return ["dashboard"];
    if (allowed.includes("*"))
      return menuSections.flatMap((s) => s.items.map((i) => i.id));
    return ["dashboard", ...allowed];
  }, [roleBasedAccess, userRole, menuSections]);

  const filteredSections = useMemo(
    () =>
      menuSections
        .map((sec) => ({
          ...sec,
          items: sec.items.filter((i) => accessibleIds.includes(i.id)),
        }))
        .filter((sec) => sec.items.length),
    [accessibleIds, menuSections]
  );

  // --- Handlers ---
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleSection = (id) => {
    if (isCollapsed) return;
    setExpandedSections((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const handleMenuClick = (item) => {
    setActiveModule(item.id);
    setIsMobileMenuOpen(false);
    setFocusedItem(item.id);
  };

  // --- Renderers (unchanged JSX) ---
  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = activeModule === item.id;
    return (
      <li key={item.id}>
        <button
          onClick={() => handleMenuClick(item)}
          onFocus={() => setFocusedItem(item.id)}
          onBlur={() => setFocusedItem("")}
          className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-sm group relative
    ${
      isActive
        ? "bg-white/95 text-green-800 shadow-xl scale-105 border border-green-200/50"
        : "text-green-100/90 hover:bg-green-700/60 hover:text-white hover:shadow-md hover:translate-x-1"
    }
    ${isRTL ? "flex-row-reverse" : "flex-row"}  
    ${isCollapsed ? "justify-center px-2" : "gap-3"}
    ${focusedItem === item.id ? "ring-2 ring-white ring-opacity-50" : ""}`}
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
          <div
            className={`relative flex-shrink-0 ${
              isRTL ? "order-2" : "order-1"
            }`}
          >
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
            <span
              className={`font-medium tracking-tight flex-1 ${
                isRTL ? "order-1 text-right" : "order-2 text-left"
              }`}
            >
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

  const renderSection = (section) => {
    const isExpanded = expandedSections.has(section.id);
    return (
      <div key={section.id} className="mb-6">
        {!isCollapsed && (
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-green-300 hover:text-green-200"
          >
            <span
              className={`transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </span>
            <span
              className={`${isRTL ? "text-right" : "text-left"} flex-1 ml-2`}
            >
              {language === "ar" ? section.titleAr : section.titleEn}
            </span>
          </button>
        )}
        <div
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

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`lg:hidden fixed top-4 ${
          isRTL ? "right-4" : "left-4"
        } z-50 p-2 bg-green-600 text-white rounded-lg shadow-lg`}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

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
        : isRTL
        ? "translate-x-full lg:translate-x-0"
        : "-translate-x-full lg:translate-x-0"
    }
    ${isRTL ? "right-0 lg:right-auto" : "left-0 lg:left-auto"}
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
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div
              className={`${
                isRTL ? "order-2" : "order-1"
              } w-10 h-10 bg-white/95 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200`}
            >
              <img
                src="./logo.jpg"
                alt="logo"
                className="w-12 h-12 rounded-xl"
              />
            </div>
            {!isCollapsed && (
              <div
                className={`flex-1 ${
                  isRTL ? "order-1 text-right" : "order-2 text-left"
                }`}
              >
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
              <div className="flex items-center gap-2">
                <div
                  className={`${isRTL ? "order-2" : "order-1"} flex-shrink-0`}
                >
                  <User className="w-4 h-4 text-green-200/90" />
                </div>
                <div
                  className={`flex-1 ${
                    isRTL ? "order-1 text-right" : "order-2 text-left"
                  }`}
                >
                  <div className="text-sm font-semibold tracking-tight">
                    {isRTL ? matchedUser?.nameAr : matchedUser?.nameEn}
                  </div>
                  <div className="text-xs text-green-200/80 font-medium">
                    {matchedUser?.role}
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

        {/* Nav */}
        <nav
          className="flex-1 p-4 overflow-y-auto sidebar-scroll"
          role="menubar"
        >
          <div className="space-y-2">
            {" "}
            {filteredSections.map(renderSection)}
          </div>
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
              className={`w-full flex items-center px-4 py-3 rounded-xl text-green-100/90 
            hover:bg-green-700/60 transition-all duration-200 hover:shadow-md group
            ${isCollapsed ? "justify-center px-2" : "justify-start"}
          `}
              title={isCollapsed ? t("nav.signOut", "Sign Out") : undefined}
              aria-label="Sign out"
            >
              {/* Icon */}
              <div className={`${isRTL ? "order-2" : "order-1"} flex-shrink-0`}>
                <LogOut className="w-5 h-5" />
              </div>

              {/* Text */}
              {!isCollapsed && (
                <span
                  className={`font-medium tracking-tight flex-1 ${
                    isRTL ? "order-1 text-right ml-3" : "order-2 text-left ml-3"
                  }`}
                >
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
