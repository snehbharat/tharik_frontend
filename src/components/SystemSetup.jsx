import React, { useState } from "react";
import {
  Settings,
  Database,
  Shield,
  Bell,
  Globe,
  DollarSign,
  FileText,
  Users,
  Calendar,
  Truck,
  Building2,
  Save,
  RefreshCw,
} from "lucide-react";
import TemplateCustomization from "./TemplateCustomization";

export const SystemSetup = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("general");

  // Template Configuration Data
  const templateCategories = [
    {
      id: "hr",
      name: "Human Resources",
      nameAr: "الموارد البشرية",
      description: "Employee management and HR processes",
      descriptionAr: "إدارة الموظفين وعمليات الموارد البشرية",
      icon: "UserCheck",
      color: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      id: "operations",
      name: "Operations",
      nameAr: "العمليات",
      description: "Project management and operational workflows",
      descriptionAr: "إدارة المشاريع وسير العمل التشغيلي",
      icon: "Briefcase",
      color: "bg-green-50 border-green-200 text-green-800",
    },
    {
      id: "finance",
      name: "Finance",
      nameAr: "المالية",
      description: "Financial documents and accounting processes",
      descriptionAr: "المستندات المالية وعمليات المحاسبة",
      icon: "DollarSign",
      color: "bg-purple-50 border-purple-200 text-purple-800",
    },
    {
      id: "compliance",
      name: "Compliance",
      nameAr: "الامتثال",
      description: "Regulatory and compliance documentation",
      descriptionAr: "الوثائق التنظيمية والامتثال",
      icon: "Shield",
      color: "bg-yellow-50 border-yellow-200 text-yellow-800",
    },
  ];

  const templateLibrary = [
    {
      id: "emp-contract-001",
      name: "Employee Contract Template",
      nameAr: "قالب عقد الموظف",
      description: "Standard employment contract for new hires",
      descriptionAr: "عقد عمل قياسي للموظفين الجدد",
      category: "hr",
      version: "2.1.0",
      status: "active",
      lastModified: "2024-12-10",
      createdBy: "HR Manager",
      approvalStatus: "approved",
      accessLevel: "hr_manager",
      usage: 156,
      fields: [
        {
          name: "employee_name",
          type: "text",
          required: true,
          validation: "min:2,max:100",
        },
        {
          name: "position",
          type: "select",
          required: true,
          options: ["Manager", "Supervisor", "Worker"],
        },
        {
          name: "salary",
          type: "number",
          required: true,
          validation: "min:1000,max:50000",
        },
        { name: "start_date", type: "date", required: true },
        {
          name: "department",
          type: "select",
          required: true,
          dependency: "position",
        },
      ],
      workflow: {
        requiresApproval: true,
        approvers: ["HR Manager", "Department Head"],
        notifications: ["employee", "hr_team", "finance"],
        auditRequired: true,
      },
    },
    {
      id: "proj-proposal-001",
      name: "Project Proposal Template",
      nameAr: "قالب اقتراح المشروع",
      description: "Standard template for new project proposals",
      descriptionAr: "قالب قياسي لاقتراحات المشاريع الجديدة",
      category: "operations",
      version: "1.5.2",
      status: "active",
      lastModified: "2024-12-08",
      createdBy: "Operations Manager",
      approvalStatus: "approved",
      accessLevel: "operations_manager",
      usage: 89,
      fields: [
        {
          name: "project_title",
          type: "text",
          required: true,
          validation: "min:5,max:200",
        },
        {
          name: "client_name",
          type: "select",
          required: true,
          source: "clients_database",
        },
        {
          name: "budget_estimate",
          type: "currency",
          required: true,
          validation: "min:10000",
        },
        { name: "timeline", type: "daterange", required: true },
        { name: "resources_needed", type: "multiselect", required: true },
      ],
      workflow: {
        requiresApproval: true,
        approvers: ["Operations Manager", "Finance Manager", "CEO"],
        notifications: ["project_team", "finance", "client"],
        auditRequired: true,
      },
    },
    {
      id: "inv-template-001",
      name: "Invoice Template",
      nameAr: "قالب الفاتورة",
      description: "ZATCA compliant invoice template",
      descriptionAr: "قالب فاتورة متوافق مع هيئة الزكاة والضرائب",
      category: "finance",
      version: "3.0.1",
      status: "active",
      lastModified: "2024-12-12",
      createdBy: "Finance Manager",
      approvalStatus: "approved",
      accessLevel: "finance_team",
      usage: 342,
      fields: [
        {
          name: "invoice_number",
          type: "auto_increment",
          required: true,
          format: "INV-{YYYY}-{###}",
        },
        { name: "client_info", type: "client_lookup", required: true },
        { name: "line_items", type: "repeatable_group", required: true },
        { name: "vat_rate", type: "percentage", required: true, default: 15 },
        { name: "payment_terms", type: "textarea", required: true },
      ],
      workflow: {
        requiresApproval: false,
        approvers: [],
        notifications: ["client", "finance_team"],
        auditRequired: true,
      },
    },
    {
      id: "safety-report-001",
      name: "Safety Incident Report",
      nameAr: "تقرير حادث السلامة",
      description: "Template for reporting safety incidents",
      descriptionAr: "قالب للإبلاغ عن حوادث السلامة",
      category: "compliance",
      version: "1.8.0",
      status: "active",
      lastModified: "2024-12-05",
      createdBy: "Safety Officer",
      approvalStatus: "approved",
      accessLevel: "safety_team",
      usage: 23,
      fields: [
        { name: "incident_date", type: "datetime", required: true },
        { name: "location", type: "text", required: true },
        {
          name: "severity_level",
          type: "select",
          required: true,
          options: ["Low", "Medium", "High", "Critical"],
        },
        {
          name: "description",
          type: "textarea",
          required: true,
          validation: "min:50",
        },
        {
          name: "witnesses",
          type: "multiselect",
          required: false,
          source: "employees",
        },
      ],
      workflow: {
        requiresApproval: true,
        approvers: ["Safety Manager", "Operations Manager"],
        notifications: ["safety_team", "management", "hr"],
        auditRequired: true,
      },
    },
  ];

  const templateSettings = {
    defaultSettings: {
      autoSave: true,
      versionControl: true,
      auditTrail: true,
      digitalSignature: false,
      encryption: true,
      backupFrequency: "daily",
    },
    validationRules: {
      text: {
        minLength: 1,
        maxLength: 500,
        allowSpecialChars: true,
        trimWhitespace: true,
      },
      number: {
        min: 0,
        max: 999999999,
        decimalPlaces: 2,
        allowNegative: false,
      },
      date: {
        format: "YYYY-MM-DD",
        minDate: "1900-01-01",
        maxDate: "2100-12-31",
        allowPastDates: true,
      },
      email: {
        validateDomain: true,
        allowMultiple: false,
        requireConfirmation: false,
      },
    },
    workflowSettings: {
      approvalLevels: [
        { level: 1, role: "supervisor", required: true },
        { level: 2, role: "manager", required: true },
        { level: 3, role: "director", required: false },
      ],
      notificationChannels: ["email", "sms", "system"],
      escalationRules: {
        timeoutHours: 24,
        escalateToNext: true,
        skipWeekends: true,
      },
      auditRequirements: {
        trackChanges: true,
        requireComments: true,
        retentionPeriod: "7 years",
        complianceLevel: "high",
      },
    },
    organizationStructure: {
      folderStructure: [
        "Templates/HR/Contracts",
        "Templates/HR/Policies",
        "Templates/Operations/Projects",
        "Templates/Operations/Reports",
        "Templates/Finance/Invoices",
        "Templates/Finance/Receipts",
        "Templates/Compliance/Safety",
        "Templates/Compliance/Regulatory",
      ],
      namingConvention: "{CATEGORY}-{TYPE}-{VERSION}",
      searchCriteria: ["name", "category", "tags", "description", "created_by"],
      filterOptions: [
        "category",
        "status",
        "approval_status",
        "access_level",
        "last_modified",
      ],
    },
  };

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [templateFilter, setTemplateFilter] = useState("all");

  const systemSettings = {
    companyName: "AMOAGC Al-Majmaah",
    companyNameAr: "أموجك المجمعة",
    crNumber: "1010123456",
    vatNumber: "300123456789003",
    currency: "SAR",
    timezone: "Asia/Riyadh",
    fiscalYearStart: "01-01",
    workingDays: 6,
    weekendDays: ["Friday"],
    overtimeRate: 1.5,
    vatRate: 15,
  };

  const notificationSettings = [
    {
      type: "Iqama Expiry",
      typeAr: "انتهاء الإقامة",
      enabled: true,
      advanceDays: 90,
      recipients: ["hr@amoagc.sa", "admin@amoagc.sa"],
    },
    {
      type: "Contract Renewal",
      typeAr: "تجديد العقد",
      enabled: true,
      advanceDays: 30,
      recipients: ["operations@amoagc.sa", "admin@amoagc.sa"],
    },
    {
      type: "Vehicle Maintenance",
      typeAr: "صيانة المركبات",
      enabled: true,
      advanceDays: 7,
      recipients: ["fleet@amoagc.sa", "maintenance@amoagc.sa"],
    },
    {
      type: "License Expiry",
      typeAr: "انتهاء الترخيص",
      enabled: true,
      advanceDays: 60,
      recipients: ["legal@amoagc.sa", "admin@amoagc.sa"],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "إعدادات النظام" : "System Setup"}
        </h1>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            {isArabic ? "إعادة تحميل" : "Reload"}
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" />
            {isArabic ? "حفظ الإعدادات" : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "general"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {isArabic ? "عام" : "General"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "templates"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isArabic ? "القوالب" : "Templates"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "notifications"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {isArabic ? "التنبيهات" : "Notifications"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("integrations")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "integrations"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {isArabic ? "التكاملات" : "Integrations"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isArabic ? "معلومات الشركة" : "Company Information"}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic
                        ? "اسم الشركة (إنجليزي)"
                        : "Company Name (English)"}
                    </label>
                    <input
                      type="text"
                      value={systemSettings.companyName}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)"}
                    </label>
                    <input
                      type="text"
                      value={systemSettings.companyNameAr}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "رقم السجل التجاري" : "CR Number"}
                    </label>
                    <input
                      type="text"
                      value={systemSettings.crNumber}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "الرقم الضريبي" : "VAT Number"}
                    </label>
                    <input
                      type="text"
                      value={systemSettings.vatNumber}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isArabic ? "إعدادات العمل" : "Work Settings"}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic
                        ? "أيام العمل في الأسبوع"
                        : "Working Days per Week"}
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="6">6 {isArabic ? "أيام" : "Days"}</option>
                      <option value="5">5 {isArabic ? "أيام" : "Days"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "معدل العمل الإضافي" : "Overtime Rate"}
                    </label>
                    <input
                      type="number"
                      value={systemSettings.overtimeRate}
                      step="0.1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic
                        ? "معدل ضريبة القيمة المضافة (%)"
                        : "VAT Rate (%)"}
                    </label>
                    <input
                      type="number"
                      value={systemSettings.vatRate}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "المنطقة الزمنية" : "Timezone"}
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="space-y-6">
              <TemplateCustomization
                isArabic={isArabic}
                activeTab={activeTab}
                templateCategories={templateCategories}
                templateLibrary={templateLibrary}
              />
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic ? "إعدادات التنبيهات" : "Notification Settings"}
              </h3>
              <div className="space-y-4">
                {notificationSettings.map((notification, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {isArabic ? notification.typeAr : notification.type}
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notification.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic
                            ? "أيام التنبيه المسبق"
                            : "Advance Notice Days"}
                        </label>
                        <input
                          type="number"
                          value={notification.advanceDays}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isArabic ? "المستلمون" : "Recipients"}
                        </label>
                        <input
                          type="text"
                          value={notification.recipients.join(", ")}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="email1@domain.com, email2@domain.com"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic ? "التكاملات الخارجية" : "External Integrations"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-green-600" />
                    <h4 className="font-semibold text-green-800">
                      ZATCA Integration
                    </h4>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    {isArabic
                      ? "تكامل مع هيئة الزكاة والضرائب للفوترة الإلكترونية"
                      : "Integration with ZATCA for e-invoicing compliance"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">
                      {isArabic ? "الحالة:" : "Status:"}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {isArabic ? "متصل" : "Connected"}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">
                      GOSI Integration
                    </h4>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    {isArabic
                      ? "تكامل مع التأمينات الاجتماعية لتقارير الرواتب"
                      : "Integration with GOSI for payroll reporting"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      {isArabic ? "الحالة:" : "Status:"}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {isArabic ? "متصل" : "Connected"}
                    </span>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-6 h-6 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">
                      QIWA Integration
                    </h4>
                  </div>
                  <p className="text-sm text-purple-700 mb-3">
                    {isArabic
                      ? "تكامل مع منصة قوى لإدارة القوى العاملة"
                      : "Integration with QIWA platform for workforce management"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-800">
                      {isArabic ? "الحالة:" : "Status:"}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      {isArabic ? "قيد الإعداد" : "Configuring"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-6 h-6 text-gray-600" />
                    <h4 className="font-semibold text-gray-800">
                      Banking Integration
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {isArabic
                      ? "تكامل مع البنوك السعودية لتحويل الرواتب"
                      : "Integration with Saudi banks for salary transfers"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">
                      {isArabic ? "الحالة:" : "Status:"}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {isArabic ? "غير متصل" : "Not Connected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Template Details Modal */}
          {selectedTemplate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {isArabic ? "تفاصيل القالب" : "Template Details"}
                  </h3>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Template Header */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {isArabic
                            ? selectedTemplate.nameAr
                            : selectedTemplate.name}
                        </h4>
                        <p className="text-gray-600">
                          {isArabic
                            ? selectedTemplate.descriptionAr
                            : selectedTemplate.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            selectedTemplate.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedTemplate.status}
                        </span>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                          v{selectedTemplate.version}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          {isArabic ? "المعرف:" : "ID:"}
                        </span>
                        <div className="font-mono text-gray-900">
                          {selectedTemplate.id}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          {isArabic ? "الفئة:" : "Category:"}
                        </span>
                        <div className="text-gray-900">
                          {
                            templateCategories.find(
                              (c) => c.id === selectedTemplate.category
                            )?.[isArabic ? "nameAr" : "name"]
                          }
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          {isArabic ? "مستوى الوصول:" : "Access Level:"}
                        </span>
                        <div className="text-gray-900">
                          {selectedTemplate.accessLevel}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          {isArabic ? "الاستخدام:" : "Usage:"}
                        </span>
                        <div className="text-gray-900">
                          {selectedTemplate.usage} {isArabic ? "مرة" : "times"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Template Fields */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">
                      {isArabic ? "حقول القالب" : "Template Fields"}
                    </h5>
                    <div className="space-y-3">
                      {selectedTemplate.fields.map((field, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">
                                {field.name}
                              </span>
                              <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                                {field.type}
                              </span>
                              {field.required && (
                                <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                          {field.validation && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                {isArabic ? "التحقق:" : "Validation:"}
                              </span>{" "}
                              {field.validation}
                            </div>
                          )}
                          {field.options && (
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">
                                {isArabic ? "الخيارات:" : "Options:"}
                              </span>{" "}
                              {field.options.join(", ")}
                            </div>
                          )}
                          {field.dependency && (
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">
                                {isArabic ? "يعتمد على:" : "Depends on:"}
                              </span>{" "}
                              {field.dependency}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workflow Configuration */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">
                      {isArabic
                        ? "إعدادات سير العمل"
                        : "Workflow Configuration"}
                    </h5>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">
                            {isArabic ? "يتطلب موافقة:" : "Requires Approval:"}
                          </span>
                          <div className="text-gray-900">
                            {selectedTemplate.workflow.requiresApproval
                              ? isArabic
                                ? "نعم"
                                : "Yes"
                              : isArabic
                              ? "لا"
                              : "No"}
                          </div>
                          {selectedTemplate.workflow.requiresApproval && (
                            <div className="mt-2">
                              <span className="font-medium text-gray-700">
                                {isArabic ? "المعتمدون:" : "Approvers:"}
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedTemplate.workflow.approvers.map(
                                  (approver, index) => (
                                    <span
                                      key={index}
                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                    >
                                      {approver}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            {isArabic ? "التنبيهات:" : "Notifications:"}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedTemplate.workflow.notifications.map(
                              (notification, index) => (
                                <span
                                  key={index}
                                  className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                                >
                                  {notification}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                              {isArabic ? "مراجعة مطلوبة:" : "Audit Required:"}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                selectedTemplate.workflow.auditRequired
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {selectedTemplate.workflow.auditRequired
                                ? isArabic
                                  ? "نعم"
                                  : "Yes"
                                : isArabic
                                ? "لا"
                                : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
