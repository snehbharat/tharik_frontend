import React, { useState } from "react";
import {
  Shield,
  FileText,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Download,
  BarChart3,
  PieChart,
  Building2,
} from "lucide-react";

export const ComplianceReporting = ({ isArabic }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-Q4");
  const [activeReport, setActiveReport] = useState("overview");

  const complianceStatus = [
    {
      name: "ZATCA",
      nameAr: "هيئة الزكاة والضرائب",
      status: "Compliant",
      lastUpdate: "2024-12-10",
      nextDue: "2025-01-15",
      description: "E-invoicing & VAT reporting",
      descriptionAr: "الفوترة الإلكترونية وتقارير ضريبة القيمة المضافة",
    },
    {
      name: "GOSI",
      nameAr: "التأمينات الاجتماعية",
      status: "Compliant",
      lastUpdate: "2024-12-05",
      nextDue: "2024-12-30",
      description: "Social insurance contributions",
      descriptionAr: "مساهمات التأمينات الاجتماعية",
    },
    {
      name: "QIWA",
      nameAr: "قوى",
      status: "Action Required",
      lastUpdate: "2024-11-20",
      nextDue: "2024-12-20",
      description: "Labor force reporting",
      descriptionAr: "تقارير القوى العاملة",
    },
    {
      name: "MOL",
      nameAr: "وزارة العمل",
      status: "Compliant",
      lastUpdate: "2024-12-01",
      nextDue: "2025-03-01",
      description: "Ministry of Labor compliance",
      descriptionAr: "امتثال وزارة العمل",
    },
  ];

  const financialMetrics = [
    {
      titleEn: "Total Revenue",
      titleAr: "إجمالي الإيرادات",
      value: "8.4M SAR",
      change: "+15.2%",
      trend: "up",
    },
    {
      titleEn: "VAT Collected",
      titleAr: "ضريبة القيمة المضافة المحصلة",
      value: "1.26M SAR",
      change: "+15.2%",
      trend: "up",
    },
    {
      titleEn: "Profit Margin",
      titleAr: "هامش الربح",
      value: "23.5%",
      change: "+2.1%",
      trend: "up",
    },
    {
      titleEn: "Operating Costs",
      titleAr: "التكاليف التشغيلية",
      value: "6.4M SAR",
      change: "+8.3%",
      trend: "up",
    },
  ];

  const operationalMetrics = [
    {
      titleEn: "Workforce Utilization",
      titleAr: "استغلال القوى العاملة",
      value: "94.2%",
      change: "+3.1%",
      trend: "up",
    },
    {
      titleEn: "Fleet Utilization",
      titleAr: "استغلال الأسطول",
      value: "88.7%",
      change: "+1.8%",
      trend: "up",
    },
    {
      titleEn: "Contract Renewal Rate",
      titleAr: "معدل تجديد العقود",
      value: "91.3%",
      change: "+5.2%",
      trend: "up",
    },
    {
      titleEn: "Client Satisfaction",
      titleAr: "رضا العملاء",
      value: "4.7/5.0",
      change: "+0.2",
      trend: "up",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Compliant":
        return "bg-green-100 text-green-800 border-green-200";
      case "Action Required":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "الامتثال والتقارير" : "Compliance & Reporting"}
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="2024-Q4">
              {isArabic ? "الربع الرابع 2024" : "Q4 2024"}
            </option>
            <option value="2024-Q3">
              {isArabic ? "الربع الثالث 2024" : "Q3 2024"}
            </option>
            <option value="2024-Q2">
              {isArabic ? "الربع الثاني 2024" : "Q2 2024"}
            </option>
          </select>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير التقرير" : "Export Report"}
          </button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          {isArabic ? "حالة الامتثال" : "Compliance Status"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceStatus.map((item, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getStatusColor(item.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{item.name}</div>
                {item.status === "Compliant" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div className="text-sm mb-2">
                {isArabic ? item.nameAr : item.name}
              </div>
              <div className="text-xs space-y-1">
                <div>
                  <span className="font-medium">
                    {isArabic ? "آخر تحديث:" : "Last Update:"}
                  </span>
                  <br />
                  {item.lastUpdate}
                </div>
                <div>
                  <span className="font-medium">
                    {isArabic ? "التاريخ المستحق:" : "Next Due:"}
                  </span>
                  <br />
                  {item.nextDue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveReport("overview")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeReport === "overview"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? "النظرة العامة" : "Overview"}
              </div>
            </button>
            <button
              onClick={() => setActiveReport("financial")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeReport === "financial"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {isArabic ? "التقارير المالية" : "Financial Reports"}
              </div>
            </button>
            <button
              onClick={() => setActiveReport("operational")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeReport === "operational"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {isArabic ? "التقارير التشغيلية" : "Operational Reports"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeReport === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Metrics Summary */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic
                      ? "المؤشرات الرئيسية"
                      : "Key Performance Indicators"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "إجمالي الإيرادات:" : "Total Revenue:"}
                      </span>
                      <span className="font-bold text-green-600">8.4M SAR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "العقود النشطة:" : "Active Contracts:"}
                      </span>
                      <span className="font-bold">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "العمال النشطون:" : "Active Workers:"}
                      </span>
                      <span className="font-bold">186</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "أسطول المركبات:" : "Vehicle Fleet:"}
                      </span>
                      <span className="font-bold">47</span>
                    </div>
                  </div>
                </div>

                {/* Compliance Score */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "نقاط الامتثال" : "Compliance Score"}
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      92%
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {isArabic
                        ? "إجمالي نقاط الامتثال"
                        : "Overall Compliance Score"}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {isArabic ? "الإجراءات المطلوبة" : "Required Actions"}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>
                      {isArabic
                        ? "تحديث بيانات قوى - مطلوب خلال 5 أيام"
                        : "QIWA data update required - 5 days remaining"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      {isArabic
                        ? "تجديد 12 إقامة عمل - جاري المعالجة"
                        : "12 work permits renewal - in progress"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      {isArabic
                        ? "فحص دوري للمركبات - مجدول للأسبوع القادم"
                        : "Vehicle inspection - scheduled next week"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeReport === "financial" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {financialMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg font-bold text-gray-900">
                        {metric.value}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? metric.titleAr : metric.titleEn}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic
                    ? "التحليل المالي التفصيلي"
                    : "Detailed Financial Analysis"}
                </h3>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض الرسوم البيانية والتحليلات المالية التفصيلية هنا..."
                    : "Detailed financial charts and analysis will be displayed here..."}
                </div>
              </div>
            </div>
          )}

          {activeReport === "operational" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {operationalMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg font-bold text-gray-900">
                        {metric.value}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? metric.titleAr : metric.titleEn}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic
                    ? "التحليل التشغيلي المتقدم"
                    : "Advanced Operational Analytics"}
                </h3>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض تحليلات الأداء التشغيلي والاستفادة من الموارد هنا..."
                    : "Operational performance analytics and resource utilization insights will be displayed here..."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
