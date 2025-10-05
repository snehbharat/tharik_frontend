import React, { createContext, useContext, useState, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

// Bilingual Context for Language Management
const BilingualContext = createContext(undefined);

export const useBilingual = () => {
  const context = useContext(BilingualContext);
  if (!context) {
    throw new Error("useBilingual must be used within BilingualProvider");
  }
  return context;
};

// Enhanced Translation Dictionary
const translations = {
  // Navigation & Header
  "nav.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.company": { en: "Company & Clients", ar: "الشركة والعملاء" },
  "nav.manpower": { en: "Workforce Management", ar: "إدارة القوى العاملة" },
  "nav.fleet": { en: "Fleet Management", ar: "إدارة الأسطول" },
  "nav.invoices": { en: "Smart Invoicing", ar: "الفوترة الذكية" },
  "nav.payroll": { en: "Payroll Management", ar: "إدارة الرواتب" },
  "nav.compliance": { en: "Compliance & Reports", ar: "الامتثال والتقارير" },
  "nav.operations": { en: "Operations Department", ar: "قسم العمليات" },
  "nav.finance": { en: "Finance Department", ar: "قسم المالية" },
  "nav.hr": { en: "Human Resources", ar: "الموارد البشرية" },
  "nav.ai": { en: "AI Optimization", ar: "التحسين بالذكاء الاصطناعي" },

  // Common Actions
  "action.save": { en: "Save", ar: "حفظ" },
  "action.cancel": { en: "Cancel", ar: "إلغاء" },
  "action.edit": { en: "Edit", ar: "تعديل" },
  "action.delete": { en: "Delete", ar: "حذف" },
  "action.view": { en: "View", ar: "عرض" },
  "action.export": { en: "Export", ar: "تصدير" },
  "action.import": { en: "Import", ar: "استيراد" },
  "action.search": { en: "Search", ar: "بحث" },
  "action.filter": { en: "Filter", ar: "تصفية" },
  "action.refresh": { en: "Refresh", ar: "تحديث" },

  // Status Labels
  "status.active": { en: "Active", ar: "نشط" },
  "status.inactive": { en: "Inactive", ar: "غير نشط" },
  "status.pending": { en: "Pending", ar: "معلق" },
  "status.completed": { en: "Completed", ar: "مكتمل" },
  "status.cancelled": { en: "Cancelled", ar: "ملغي" },
  "status.approved": { en: "Approved", ar: "معتمد" },
  "status.rejected": { en: "Rejected", ar: "مرفوض" },

  // Time & Date
  "time.today": { en: "Today", ar: "اليوم" },
  "time.yesterday": { en: "Yesterday", ar: "أمس" },
  "time.thisWeek": { en: "This Week", ar: "هذا الأسبوع" },
  "time.thisMonth": { en: "This Month", ar: "هذا الشهر" },
  "time.thisYear": { en: "This Year", ar: "هذا العام" },

  // Company Information
  "company.name": { en: "AMOAGC Al-Majmaah", ar: "أموجك المجمعة" },
  "company.tagline": {
    en: "Operations & General Contracting",
    ar: "العمليات والمقاولات العامة",
  },
  "company.description": {
    en: "Leading provider of workforce and operational solutions in Saudi Arabia",
    ar: "مزود رائد لحلول القوى العاملة والعمليات في المملكة العربية السعودية",
  },

  // Dashboard Metrics
  "metrics.totalWorkforce": {
    en: "Total Workforce",
    ar: "إجمالي القوى العاملة",
  },
  "metrics.activeProjects": { en: "Active Projects", ar: "المشاريع النشطة" },
  "metrics.realTimeProfits": { en: "Real-Time Profits", ar: "الأرباح الفورية" },
  "metrics.utilizationRate": { en: "Utilization Rate", ar: "معدل الاستغلال" },

  // Form Labels
  "form.name": { en: "Name", ar: "الاسم" },
  "form.email": { en: "Email", ar: "البريد الإلكتروني" },
  "form.phone": { en: "Phone", ar: "الهاتف" },
  "form.address": { en: "Address", ar: "العنوان" },
  "form.date": { en: "Date", ar: "التاريخ" },
  "form.amount": { en: "Amount", ar: "المبلغ" },
  "form.description": { en: "Description", ar: "الوصف" },
  "form.notes": { en: "Notes", ar: "ملاحظات" },

  // Validation Messages
  "validation.required": {
    en: "This field is required",
    ar: "هذا الحقل مطلوب",
  },
  "validation.email": {
    en: "Please enter a valid email address",
    ar: "يرجى إدخال عنوان بريد إلكتروني صحيح",
  },
  "validation.phone": {
    en: "Please enter a valid phone number",
    ar: "يرجى إدخال رقم هاتف صحيح",
  },
  "validation.minLength": {
    en: "Minimum length is {min} characters",
    ar: "الحد الأدنى للطول هو {min} أحرف",
  },

  // Success Messages
  "success.saved": { en: "Successfully saved!", ar: "تم الحفظ بنجاح!" },
  "success.deleted": { en: "Successfully deleted!", ar: "تم الحذف بنجاح!" },
  "success.updated": { en: "Successfully updated!", ar: "تم التحديث بنجاح!" },
  "success.created": { en: "Successfully created!", ar: "تم الإنشاء بنجاح!" },

  // Error Messages
  "error.general": {
    en: "An error occurred. Please try again.",
    ar: "حدث خطأ. يرجى المحاولة مرة أخرى.",
  },
  "error.network": {
    en: "Network error. Please check your connection.",
    ar: "خطأ في الشبكة. يرجى التحقق من الاتصال.",
  },
  "error.unauthorized": {
    en: "You are not authorized to perform this action.",
    ar: "غير مخول لك تنفيذ هذا الإجراء.",
  },
  "error.notFound": {
    en: "The requested item was not found.",
    ar: "العنصر المطلوب غير موجود.",
  },
};

// Bilingual Provider Component
const BilingualProvider = ({ children, defaultLanguage = "en" }) => {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem("preferred_language");
    return stored || defaultLanguage;
  });

  const isRTL = language === "ar";

  useEffect(() => {
    localStorage.setItem("preferred_language", language);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key, fallback) => {
    const translation = translations[key];
    if (translation) {
      return translation[language];
    }
    return fallback || key;
  };

  const formatNumber = (num) => {
    if (language === "ar") {
      return new Intl.NumberFormat("ar-SA").format(num);
    }
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString(language === "ar" ? "ar-SA" : "en-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const contextValue = {
    language,
    setLanguage,
    isRTL,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
  };

  return (
    <BilingualContext.Provider value={contextValue}>
      <div
        className={`min-h-screen ${isRTL ? "rtl" : "ltr"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {children}
      </div>
    </BilingualContext.Provider>
  );
};

// Language Switcher Component
const LanguageSwitcher = ({ className = "" }) => {
  const { language, setLanguage, isRTL } = useBilingual();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", nameNative: "English", flag: "🇺🇸" },
    { code: "ar", name: "Arabic", nameNative: "العربية", flag: "🇸🇦" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span
          className={`text-sm font-medium text-gray-700 ${
            isRTL && "text-white"
          }`}
        >
          {currentLanguage?.flag} {currentLanguage?.nameNative}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                isRTL && "bg-white"
              } transition-colors ${
                language === lang.code
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700"
              } ${lang.code === "ar" ? "text-right" : "text-left"}`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{lang.nameNative}</div>
                <div className="text-xs text-gray-500">{lang.name}</div>
              </div>
              {language === lang.code && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Bilingual Text Component
const BilingualText = ({ en, ar, className = "", tag = "span" }) => {
  const { language } = useBilingual();
  const Component = tag;

  return (
    <Component className={className}>{language === "ar" ? ar : en}</Component>
  );
};

// Enhanced Form Field Component with Bilingual Support
const BilingualFormField = ({
  label,
  labelAr,
  placeholder,
  placeholderAr,
  error,
  errorAr,
  required = false,
  children,
  className = "",
}) => {
  const { language, isRTL } = useBilingual();

  const displayLabel = language === "ar" && labelAr ? labelAr : label;
  const displayPlaceholder =
    language === "ar" && placeholderAr ? placeholderAr : placeholder;
  const displayError = language === "ar" && errorAr ? errorAr : error;
  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={fieldId}
        className={`block text-sm font-medium text-gray-700 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {displayLabel}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {React.cloneElement(children, {
          id: fieldId,
          placeholder: displayPlaceholder,
          className: `w-full border border-gray-300 rounded-lg px-3 py-2 ${
            isRTL ? "text-right" : "text-left"
          } ${
            error
              ? "border-red-500 focus:border-red-500"
              : "focus:border-blue-500"
          } focus:outline-none focus:ring-1 focus:ring-blue-500`,
          "aria-invalid": error ? "true" : "false",
          "aria-describedby": error ? `${fieldId}-error` : undefined,
        })}
      </div>

      {error && (
        <p
          id={`${fieldId}-error`}
          className={`text-sm text-red-600 ${
            isRTL ? "text-right" : "text-left"
          }`}
          role="alert"
        >
          {displayError}
        </p>
      )}
    </div>
  );
};

// Bilingual Status Badge Component
const BilingualStatusBadge = ({
  status,
  statusAr,
  variant = "default",
  className = "",
}) => {
  const { language } = useBilingual();

  const variantClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    default: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const displayStatus = language === "ar" && statusAr ? statusAr : status;

  return (
    <span
      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${variantClasses[variant]} ${className}`}
    >
      {displayStatus}
    </span>
  );
};

// Bilingual Data Table Component
const BilingualTable = ({
  columns,
  data,
  className = "",
  emptyMessage = "No data available",
  emptyMessageAr = "لا توجد بيانات متاحة",
}) => {
  const { language, isRTL } = useBilingual();

  const displayEmptyMessage = language === "ar" ? emptyMessageAr : emptyMessage;

  return (
    <div
      className={`overflow-x-auto ${className}`}
      role="region"
      aria-label="Data table"
    >
      <table className="w-full" role="table">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  isRTL ? "text-right" : "text-left"
                }`}
                style={{ width: column.width }}
                scope="col"
              >
                {language === "ar" && column.labelAr
                  ? column.labelAr
                  : column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-gray-500"
                role="cell"
              >
                {displayEmptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-4 text-sm text-gray-900 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    role="cell"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Bilingual Modal Component
const BilingualModal = ({
  isOpen,
  onClose,
  title,
  titleAr,
  children,
  size = "md",
  className = "",
}) => {
  const { language, isRTL } = useBilingual();

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  const displayTitle = language === "ar" && titleAr ? titleAr : title;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-xl w-full ${sizeClasses[size]} max-h-screen overflow-y-auto ${className}`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b border-gray-200 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h3 className="text-xl font-bold text-gray-900">{displayTitle}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Bilingual Card Component
const BilingualCard = ({
  title,
  titleAr,
  subtitle,
  subtitleAr,
  children,
  className = "",
  headerActions,
}) => {
  const { language, isRTL } = useBilingual();

  const displayTitle = language === "ar" && titleAr ? titleAr : title;
  const displaySubtitle =
    language === "ar" && subtitleAr ? subtitleAr : subtitle;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
    >
      {(title || subtitle || headerActions) && (
        <div
          className={`p-6 border-b border-gray-200 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`flex items-center justify-between ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {displayTitle}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{displaySubtitle}</p>
              )}
            </div>
            {headerActions && (
              <div
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

// Export all components
export {
  BilingualProvider,
  LanguageSwitcher,
  BilingualText,
  BilingualFormField,
  BilingualStatusBadge,
  BilingualTable,
  BilingualModal,
  BilingualCard,
};
