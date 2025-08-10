import React from "react";
import { Bell, Search, Settings, User, LogOut, Menu } from "lucide-react";
import {
  useBilingual,
  LanguageSwitcher,
  BilingualText,
} from "./BilingualLayout";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { useAuth } from "../hooks/useAuth";
import { SessionStatusIndicator } from "./auth/SessionManager";
import { UserProfile } from "./auth/UserProfile";

export const EnhancedBilingualHeader = ({ onMenuToggle }) => {
  const { language, isRTL, t, formatDate } = useBilingual();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [showUserProfile, setShowUserProfile] = React.useState(false);

  const currentDate = formatDate(new Date());
  const isArabic = language === "ar";

  const handleLogout = async () => {
    try {
      if (
        window.confirm(
          isArabic
            ? "هل أنت متأكد من تسجيل الخروج؟"
            : "Are you sure you want to logout?"
        )
      ) {
        await logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return null;
  return (
    <header
      className={`bg-white border-b border-gray-200 shadow-sm ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="px-6 py-4">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* Left Section - Menu & Logo */}
          <div
            className={`flex items-center gap-4 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div
              className={`flex items-center gap-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className={isRTL ? "text-right" : "text-left"}>
                <BilingualText
                  en="AMOAGC Al-Majmaah"
                  ar="أموجك المجمعة"
                  className="font-bold text-gray-900 text-lg"
                  tag="h1"
                />
                <BilingualText
                  en="Operations & General Contracting"
                  ar="العمليات والمقاولات العامة"
                  className="text-sm text-gray-600"
                  tag="p"
                />
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search
                className={`w-5 h-5 absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${
                  isRTL ? "right-3" : "left-3"
                }`}
              />
              <input
                type="text"
                placeholder={t("action.search", "Search...")}
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                }`}
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {/* Session Status */}
            <SessionStatusIndicator isArabic={language === "ar"} />

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
              aria-label={isArabic ? "فتح البحث" : "Open search"}
              aria-expanded={showSearch}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            <NotificationCenter
              isArabic={language === "ar"}
              currentUserId="current_user"
            />

            {/* Settings */}
            <button
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isArabic ? "الإعدادات" : "Settings"}
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
                aria-label={`${isArabic ? "قائمة المستخدم" : "User menu"} - ${
                  language === "ar" ? user.fullNameAr : user.fullName
                }`}
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`hidden md:block ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {language === "ar" ? user.fullNameAr : user.fullName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === "ar" ? user.role.nameAr : user.role.name}
                  </div>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div
                  className={`absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${
                    isRTL ? "left-0" : "right-0"
                  }`}
                  role="menu"
                  aria-label="User menu"
                >
                  <div className="p-4 border-b border-gray-200">
                    <div
                      className={`flex items-center gap-3 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User
                            className="w-6 h-6 text-white"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <div className="font-medium text-gray-900">
                          {language === "ar" ? user.fullNameAr : user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === "ar"
                            ? user.role.nameAr
                            : user.role.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {currentDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                        isRTL ? "flex-row-reverse text-right" : "text-left"
                      }`}
                      onClick={() => {
                        setShowUserProfile(true);
                        setShowUserMenu(false);
                      }}
                      role="menuitem"
                    >
                      <User className="w-4 h-4" aria-hidden="true" />
                      <BilingualText
                        en="Profile Settings"
                        ar="إعدادات الملف الشخصي"
                      />
                    </button>

                    <button
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                        isRTL ? "flex-row-reverse text-right" : "text-left"
                      }`}
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4" aria-hidden="true" />
                      <BilingualText
                        en="Account Settings"
                        ar="إعدادات الحساب"
                      />
                    </button>

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors ${
                        isRTL ? "flex-row-reverse text-right" : "text-left"
                      }`}
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      <BilingualText en="Logout" ar="تسجيل الخروج" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search
                className={`w-5 h-5 absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${
                  isRTL ? "right-3" : "left-3"
                }`}
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder={t("action.search", "Search...")}
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                }`}
                aria-label={isArabic ? "البحث في النظام" : "Search the system"}
              />
            </div>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile
          isArabic={language === "ar"}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </header>
  );
};
