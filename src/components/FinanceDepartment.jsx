import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  FileText,
  CreditCard,
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Calendar,
  Building2,
  Users,
  Target,
  Activity,
  Zap,
  Globe,
} from "lucide-react";

export const FinanceDepartment = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");

  const financialOverview = {
    totalRevenue: 8400000,
    totalExpenses: 6420000,
    netProfit: 1980000,
    profitMargin: 23.6,
    cashFlow: 2150000,
    accountsReceivable: 2800000,
    accountsPayable: 1650000,
    monthlyGrowth: 15.2,
    operatingRatio: 76.4,
    liquidityRatio: 1.8,
    debtToEquity: 0.45,
    returnOnAssets: 12.3,
    workingCapital: 3200000,
    grossMargin: 28.9,
    netMargin: 23.6,
    currentRatio: 2.1,
  };

  const receivables = [
    {
      client: "Saudi Aramco",
      clientAr: "أرامكو السعودية",
      amount: 1200000,
      dueDate: "2024-12-25",
      overdueDays: 0,
      status: "Current",
      invoiceCount: 8,
      contactPerson: "Ahmed Al-Mansouri",
      phone: "+966501234567",
      email: "ahmed@aramco.com",
      creditLimit: 2000000,
      paymentTerms: "Net 30",
      lastPayment: "2024-11-25",
      riskLevel: "Low",
    },
    {
      client: "SABIC Industries",
      clientAr: "صناعات سابك",
      amount: 850000,
      dueDate: "2024-12-20",
      overdueDays: 0,
      status: "Current",
      invoiceCount: 5,
      contactPerson: "Fatima Al-Zahra",
      phone: "+966502345678",
      email: "fatima@sabic.com",
      creditLimit: 1500000,
      paymentTerms: "Net 30",
      lastPayment: "2024-11-20",
      riskLevel: "Low",
    },
    {
      client: "NEOM Development",
      clientAr: "تطوير نيوم",
      amount: 750000,
      dueDate: "2024-11-30",
      overdueDays: 15,
      status: "Overdue",
      invoiceCount: 3,
      contactPerson: "Mohammad Hassan",
      phone: "+966503456789",
      email: "mohammad@neom.sa",
      creditLimit: 1000000,
      paymentTerms: "Net 30",
      lastPayment: "2024-10-30",
      riskLevel: "Medium",
    },
  ];

  const payables = [
    {
      vendor: "Saudi Equipment Rental",
      vendorAr: "تأجير المعدات السعودية",
      amount: 450000,
      dueDate: "2024-12-22",
      category: "Equipment Rental",
      status: "Pending",
      contactPerson: "Ali Al-Rashid",
      phone: "+966504567890",
      email: "ali@saudiequipment.com",
      paymentMethod: "Bank Transfer",
      invoiceNumber: "INV-2024-001",
      description: "Heavy equipment rental for Q4 projects",
    },
    {
      vendor: "Al-Majmaah Fuel Station",
      vendorAr: "محطة وقود المجمعة",
      amount: 125000,
      dueDate: "2024-12-18",
      category: "Fuel & Maintenance",
      status: "Pending",
      contactPerson: "Hassan Al-Mutairi",
      phone: "+966505678901",
      email: "hassan@majmaahfuel.com",
      paymentMethod: "Cash",
      invoiceNumber: "FUEL-2024-045",
      description: "Monthly fuel and vehicle maintenance",
    },
    {
      vendor: "GOSI",
      vendorAr: "التأمينات الاجتماعية",
      amount: 34000,
      dueDate: "2024-12-30",
      category: "Social Insurance",
      status: "Scheduled",
      contactPerson: "Government Entity",
      phone: "+966800123456",
      email: "info@gosi.gov.sa",
      paymentMethod: "Electronic Transfer",
      invoiceNumber: "GOSI-2024-12",
      description: "Monthly social insurance contributions",
    },
  ];

  const budgetAnalysis = [
    {
      category: "Manpower Costs",
      categoryAr: "تكاليف القوى العاملة",
      budgeted: 4200000,
      actual: 3950000,
      variance: -250000,
      percentage: 94.0,
      trend: "improving",
      lastMonth: 4100000,
      forecast: 3900000,
      ytdBudget: 50400000,
      ytdActual: 47400000,
    },
    {
      category: "Vehicle Operations",
      categoryAr: "عمليات المركبات",
      budgeted: 1800000,
      actual: 1920000,
      variance: 120000,
      percentage: 106.7,
      trend: "declining",
      lastMonth: 1750000,
      forecast: 1950000,
      ytdBudget: 21600000,
      ytdActual: 23040000,
    },
    {
      category: "Equipment & Tools",
      categoryAr: "المعدات والأدوات",
      budgeted: 650000,
      actual: 580000,
      variance: -70000,
      percentage: 89.2,
      trend: "stable",
      lastMonth: 620000,
      forecast: 590000,
      ytdBudget: 7800000,
      ytdActual: 6960000,
    },
    {
      category: "Administrative",
      categoryAr: "إدارية",
      budgeted: 420000,
      actual: 445000,
      variance: 25000,
      percentage: 106.0,
      trend: "stable",
      lastMonth: 430000,
      forecast: 450000,
      ytdBudget: 5040000,
      ytdActual: 5340000,
    },
  ];

  // Enhanced financial analytics data
  const financialTrends = [
    { month: "Jan", revenue: 7200000, expenses: 5400000, profit: 1800000 },
    { month: "Feb", revenue: 7800000, expenses: 5850000, profit: 1950000 },
    { month: "Mar", revenue: 8100000, expenses: 6075000, profit: 2025000 },
    { month: "Apr", revenue: 8300000, expenses: 6225000, profit: 2075000 },
    { month: "May", revenue: 8500000, expenses: 6375000, profit: 2125000 },
    { month: "Jun", revenue: 8400000, expenses: 6420000, profit: 1980000 },
  ];

  const kpiMetrics = [
    {
      name: "Revenue Growth",
      nameAr: "نمو الإيرادات",
      value: 15.2,
      target: 12.0,
      status: "above",
    },
    {
      name: "Cost Control",
      nameAr: "التحكم في التكاليف",
      value: 76.4,
      target: 80.0,
      status: "above",
    },
    {
      name: "Profit Margin",
      nameAr: "هامش الربح",
      value: 23.6,
      target: 20.0,
      status: "above",
    },
    {
      name: "Cash Flow",
      nameAr: "التدفق النقدي",
      value: 2150000,
      target: 2000000,
      status: "above",
    },
  ];

  const filteredReceivables = receivables.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clientAr.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" ||
      item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredPayables = payables.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorAr.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" ||
      item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleExportData = (dataType) => {
    try {
      let csvContent = "";
      let filename = "";

      switch (dataType) {
        case "receivables":
          csvContent = [
            [
              "Client",
              "Amount",
              "Due Date",
              "Status",
              "Contact Person",
              "Phone",
              "Email",
            ],
            ...filteredReceivables.map((item) => [
              item.client,
              item.amount.toString(),
              item.dueDate,
              item.status,
              item.contactPerson,
              item.phone,
              item.email,
            ]),
          ]
            .map((row) => row.join(","))
            .join("\n");
          filename = `receivables_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;
        case "payables":
          csvContent = [
            [
              "Vendor",
              "Amount",
              "Due Date",
              "Category",
              "Status",
              "Contact Person",
            ],
            ...filteredPayables.map((item) => [
              item.vendor,
              item.amount.toString(),
              item.dueDate,
              item.category,
              item.status,
              item.contactPerson,
            ]),
          ]
            .map((row) => row.join(","))
            .join("\n");
          filename = `payables_${new Date().toISOString().split("T")[0]}.csv`;
          break;
        case "budget":
          csvContent = [
            [
              "Category",
              "Budgeted",
              "Actual",
              "Variance",
              "Percentage",
              "Trend",
            ],
            ...budgetAnalysis.map((item) => [
              item.category,
              item.budgeted.toString(),
              item.actual.toString(),
              item.variance.toString(),
              item.percentage.toString(),
              item.trend,
            ]),
          ]
            .map((row) => row.join(","))
            .join("\n");
          filename = `budget_analysis_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic ? "تم تصدير البيانات بنجاح!" : "Data exported successfully!"
      );
    } catch (error) {
      console.error("Export error:", error);
      alert(
        isArabic ? "حدث خطأ أثناء التصدير" : "Error occurred during export"
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Current":
      case "Pending":
      case "Scheduled":
        return "green";
      case "Overdue":
      case "Declined":
        return "red";
      default:
        return "gray";
    }
  };

  const getKpiStatusColor = (status) => {
    switch (status) {
      case "above":
        return "text-green-600";
      case "below":
        return "text-red-600";
      case "on-target":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "قسم المالية" : "Finance Department"}
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="current_month">
              {isArabic ? "الشهر الحالي" : "Current Month"}
            </option>
            <option value="last_month">
              {isArabic ? "الشهر الماضي" : "Last Month"}
            </option>
            <option value="quarter">
              {isArabic ? "الربع الحالي" : "Current Quarter"}
            </option>
            <option value="year">
              {isArabic ? "السنة الحالية" : "Current Year"}
            </option>
          </select>
          <button
            onClick={() => handleExportData("overview")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير البيانات" : "Export Data"}
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FileText className="w-4 h-4" />
            {isArabic ? "تقرير مالي" : "Financial Report"}
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Calculator className="w-4 h-4" />
            {isArabic ? "حساب الربحية" : "Profitability Analysis"}
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {(financialOverview.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "إجمالي الإيرادات" : "Total Revenue"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>
              +{financialOverview.monthlyGrowth}%{" "}
              {isArabic ? "هذا الشهر" : "this month"}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {(financialOverview.netProfit / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "صافي الربح" : "Net Profit"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <span>
              {financialOverview.profitMargin}%{" "}
              {isArabic ? "هامش الربح" : "profit margin"}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {(financialOverview.accountsReceivable / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "المستحقات" : "Receivables"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-purple-600">
            <span>{isArabic ? "3 عملاء" : "3 clients"}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {(financialOverview.cashFlow / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "التدفق النقدي" : "Cash Flow"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-yellow-600">
            <CheckCircle className="w-3 h-3" />
            <span>{isArabic ? "إيجابي" : "Positive"}</span>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Dashboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isArabic ? "مؤشرات الأداء الرئيسية" : "Key Performance Indicators"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiMetrics.map((kpi, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {isArabic ? kpi.nameAr : kpi.name}
                </span>
                <span
                  className={`text-xs font-semibold ${getKpiStatusColor(
                    kpi.status
                  )}`}
                >
                  {kpi.status === "above"
                    ? "↗"
                    : kpi.status === "below"
                    ? "↘"
                    : "→"}
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {kpi.name.includes("Growth") ||
                kpi.name.includes("Margin") ||
                kpi.name.includes("Control")
                  ? `${kpi.value}%`
                  : `${(kpi.value / 1000000).toFixed(1)}M SAR`}
              </div>
              <div className="text-xs text-gray-500">
                {isArabic ? "الهدف:" : "Target:"}{" "}
                {kpi.name.includes("Growth") ||
                kpi.name.includes("Margin") ||
                kpi.name.includes("Control")
                  ? `${kpi.target}%`
                  : `${(kpi.target / 1000000).toFixed(1)}M SAR`}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "overview"
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
              onClick={() => setActiveTab("receivables")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "receivables"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {isArabic ? "المستحقات" : "Receivables"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("payables")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "payables"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                {isArabic ? "المدفوعات" : "Payables"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "budget"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                {isArabic ? "تحليل الميزانية" : "Budget Analysis"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "analytics"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {isArabic ? "التحليلات المتقدمة" : "Advanced Analytics"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("forecasting")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "forecasting"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? "التنبؤات المالية" : "Financial Forecasting"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic
                      ? "الأداء المالي الشهري"
                      : "Monthly Financial Performance"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "الإيرادات:" : "Revenue:"}
                      </span>
                      <span className="font-bold text-green-600">
                        {financialOverview.totalRevenue.toLocaleString()} SAR
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "المصروفات:" : "Expenses:"}
                      </span>
                      <span className="font-bold text-red-600">
                        {financialOverview.totalExpenses.toLocaleString()} SAR
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                      <span className="text-gray-600 font-medium">
                        {isArabic ? "صافي الربح:" : "Net Profit:"}
                      </span>
                      <span className="font-bold text-blue-600">
                        {financialOverview.netProfit.toLocaleString()} SAR
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "رأس المال العامل:" : "Working Capital:"}
                      </span>
                      <span className="font-bold text-purple-600">
                        {financialOverview.workingCapital.toLocaleString()} SAR
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic
                      ? "المؤشرات المالية الرئيسية"
                      : "Key Financial Ratios"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "هامش الربح:" : "Profit Margin:"}
                      </span>
                      <span className="font-bold text-purple-600">
                        {financialOverview.profitMargin}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "نسبة النمو:" : "Growth Rate:"}
                      </span>
                      <span className="font-bold text-green-600">
                        +{financialOverview.monthlyGrowth}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "التدفق النقدي:" : "Cash Flow:"}
                      </span>
                      <span className="font-bold text-blue-600">
                        {financialOverview.cashFlow.toLocaleString()} SAR
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "نسبة السيولة:" : "Liquidity Ratio:"}
                      </span>
                      <span className="font-bold text-green-600">
                        {financialOverview.liquidityRatio}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "العائد على الأصول:" : "ROA:"}
                      </span>
                      <span className="font-bold text-blue-600">
                        {financialOverview.returnOnAssets}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "الرسوم البيانية المالية" : "Financial Charts"}
                </h3>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض الرسوم البيانية للإيرادات والمصروفات والأرباح هنا..."
                    : "Revenue, expenses, and profit charts will be displayed here..."}
                </div>
              </div>
            </div>
          )}

          {activeTab === "receivables" && (
            <div className="space-y-6">
              {/* Search and Filter Controls */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      isArabic
                        ? "البحث في المستحقات..."
                        : "Search receivables..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">
                    {isArabic ? "جميع الحالات" : "All Status"}
                  </option>
                  <option value="current">
                    {isArabic ? "حالي" : "Current"}
                  </option>
                  <option value="overdue">
                    {isArabic ? "متأخر" : "Overdue"}
                  </option>
                </select>
                <button
                  onClick={() => handleExportData("receivables")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isArabic ? "تصدير" : "Export"}
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {isArabic ? "تنبيهات المستحقات" : "Receivables Alerts"}
                </h3>
                <p className="text-sm text-yellow-700">
                  {isArabic
                    ? "يوجد مستحقات متأخرة بقيمة 750,000 ريال من عميل واحد"
                    : "Overdue receivables of 750,000 SAR from 1 client require attention"}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "العميل" : "Client"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "المبلغ" : "Amount"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "تاريخ الاستحقاق" : "Due Date"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "جهة الاتصال" : "Contact"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "أيام التأخير" : "Overdue Days"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "عدد الفواتير" : "Invoice Count"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الحالة" : "Status"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الإجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredReceivables.map((receivable, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {isArabic
                                  ? receivable.clientAr
                                  : receivable.client}
                              </div>
                              <div className="text-sm text-gray-500">
                                {isArabic ? "الحد الائتماني:" : "Credit Limit:"}{" "}
                                {receivable.creditLimit.toLocaleString()} SAR
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                            {receivable.amount.toLocaleString()} SAR
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {receivable.dueDate}
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {receivable.contactPerson}
                              </div>
                              <div className="text-sm text-gray-500">
                                {receivable.phone}
                              </div>
                              <div className="text-sm text-gray-500">
                                {receivable.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {receivable.overdueDays > 0 ? (
                              <span className="text-red-600 font-medium">
                                {receivable.overdueDays}{" "}
                                {isArabic ? "يوم" : "days"}
                              </span>
                            ) : (
                              <span className="text-green-600">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {receivable.invoiceCount}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                receivable.status
                              )}`}
                            >
                              {receivable.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800 p-1 rounded">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payables" && (
            <div className="space-y-6">
              {/* Search and Filter Controls */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      isArabic ? "البحث في المدفوعات..." : "Search payables..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <button
                  onClick={() => handleExportData("payables")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isArabic ? "تصدير" : "Export"}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {isArabic ? "ملخص المدفوعات" : "Payables Summary"}
                </h3>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "إجمالي المدفوعات المستحقة: 609,000 ريال"
                    : "Total outstanding payables: 609,000 SAR"}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "المورد" : "Vendor"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "المبلغ" : "Amount"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "تاريخ الاستحقاق" : "Due Date"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الفئة" : "Category"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "جهة الاتصال" : "Contact"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الحالة" : "Status"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الإجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPayables.map((payable, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {isArabic ? payable.vendorAr : payable.vendor}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payable.invoiceNumber}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                            {payable.amount.toLocaleString()} SAR
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {payable.dueDate}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {payable.category}
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {payable.contactPerson}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payable.phone}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payable.paymentMethod}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                payable.status
                              )}`}
                            >
                              {payable.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800 p-1 rounded">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "budget" && (
            <div className="space-y-6">
              {/* Budget Controls */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic
                    ? "تحليل الميزانية التفصيلي"
                    : "Detailed Budget Analysis"}
                </h3>
                <button
                  onClick={() => handleExportData("budget")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isArabic
                    ? "تصدير تحليل الميزانية"
                    : "Export Budget Analysis"}
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  {isArabic ? "أداء الميزانية" : "Budget Performance"}
                </h3>
                <p className="text-sm text-green-700">
                  {isArabic
                    ? "الأداء العام للميزانية: 98.5% من المخطط له"
                    : "Overall budget performance: 98.5% of planned"}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الفئة" : "Category"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "المخطط" : "Budgeted"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الفعلي" : "Actual"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الانحراف" : "Variance"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "النسبة" : "Percentage"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "الاتجاه" : "Trend"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {isArabic ? "التوقع" : "Forecast"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {budgetAnalysis.map((budget, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">
                              {isArabic ? budget.categoryAr : budget.category}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {budget.budgeted.toLocaleString()} SAR
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                            {budget.actual.toLocaleString()} SAR
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`font-medium ${
                                budget.variance < 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {budget.variance > 0 ? "+" : ""}
                              {budget.variance.toLocaleString()} SAR
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`font-semibold ${
                                budget.percentage <= 100
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {budget.percentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`font-medium ${getTrendColor(
                                budget.trend
                              )}`}
                            >
                              {budget.trend === "improving"
                                ? "↗"
                                : budget.trend === "declining"
                                ? "↘"
                                : "→"}{" "}
                              {budget.trend}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {budget.forecast.toLocaleString()} SAR
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic
                  ? "التحليلات المالية المتقدمة"
                  : "Advanced Financial Analytics"}
              </h3>

              {/* Financial Trends Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic
                    ? "اتجاهات الأداء المالي"
                    : "Financial Performance Trends"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {financialTrends.slice(-3).map((trend, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <div className="text-sm text-gray-600 mb-2">
                        {trend.month} 2024
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            {isArabic ? "الإيرادات:" : "Revenue:"}
                          </span>
                          <span className="font-semibold text-green-600">
                            {(trend.revenue / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            {isArabic ? "المصروفات:" : "Expenses:"}
                          </span>
                          <span className="font-semibold text-red-600">
                            {(trend.expenses / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2">
                          <span className="text-gray-700">
                            {isArabic ? "الربح:" : "Profit:"}
                          </span>
                          <span className="font-semibold text-blue-600">
                            {(trend.profit / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Ratios Analysis */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic
                    ? "تحليل النسب المالية"
                    : "Financial Ratios Analysis"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {financialOverview.currentRatio}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "النسبة الجارية" : "Current Ratio"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {financialOverview.liquidityRatio}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "نسبة السيولة" : "Liquidity Ratio"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {financialOverview.debtToEquity}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "الدين إلى حقوق الملكية" : "Debt to Equity"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {financialOverview.returnOnAssets}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "العائد على الأصول" : "Return on Assets"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "forecasting" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic ? "التنبؤات المالية" : "Financial Forecasting"}
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic
                    ? "نموذج التنبؤ المالي"
                    : "Financial Forecasting Model"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "توقعات مالية متقدمة باستخدام البيانات التاريخية والاتجاهات الحالية"
                    : "Advanced financial predictions using historical data and current trends"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    9.2M
                  </div>
                  <div className="text-sm text-green-700">
                    {isArabic
                      ? "الإيرادات المتوقعة (الشهر القادم)"
                      : "Projected Revenue (Next Month)"}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    +9.5% {isArabic ? "نمو متوقع" : "projected growth"}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    2.3M
                  </div>
                  <div className="text-sm text-blue-700">
                    {isArabic ? "الأرباح المتوقعة" : "Projected Profit"}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    25.0% {isArabic ? "هامش متوقع" : "projected margin"}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    2.8M
                  </div>
                  <div className="text-sm text-purple-700">
                    {isArabic ? "التدفق النقدي المتوقع" : "Projected Cash Flow"}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    +30.2% {isArabic ? "تحسن متوقع" : "projected improvement"}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {isArabic
                  ? "سيتم عرض نماذج التنبؤ التفاعلية والتحليلات المتقدمة هنا..."
                  : "Interactive forecasting models and advanced analytics will be displayed here..."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
