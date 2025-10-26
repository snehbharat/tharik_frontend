import React, { useEffect, useState } from "react";
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
  Printer,
} from "lucide-react";
import FinanceDepartmentService from "../services/FinanceDepartmentService";
import ClientService from "../services/ClientService";
import InvoiceService from "../services/InvoiceService";
import { getCompany } from "../services/CompanyService";
import { QRCodeCanvas } from "qrcode.react";
import PaybleInvoiceService from "../services/PaybleInvoiceService";

export const FinanceDepartment = ({ isArabic }) => {
  // states from clients starts here //
  const [clients, setClients] = useState([]);
  const [viewClient, setViewClient] = useState(null);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [clientStatusFilter, setClientStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchClients = async (page = 1) => {
    try {
      setLoading(true);
      const res = await ClientService.getAllClients(page, pagination.limit);

      setClients(res?.data?.data || []);
      setPagination({
        total: res?.data?.total || 0,
        page: res?.data?.page || 1,
        limit: res?.data?.limit || 10,
        totalPages: res?.data?.totalPages || 1,
      });
    } catch (err) {
      console.error("Error fetching clients:", err.message);
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const handleViewClient = (id) => {
    const client = clients.find((c) => c._id === id);
    setViewClient(client);
  };
  // states from clients ends here //

  // states from invoices starts here //
  const [invoices, setInvoices] = useState([]);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sellerInfo, setSellerInfo] = useState(null);
  const [invoicePagination, setInvoicePagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await InvoiceService.getAllInvoices(1, 10);

      setInvoices(data.data.data);
      setInvoicePagination({
        total: data?.data?.total || 0,
        page: data?.data?.page || 1,
        limit: data?.data?.limit || 10,
        totalPages: data?.data?.totalPages || 1,
      });
    } catch (error) {
      console.error("Failed to load invoices", error);
      alert(isArabic ? "فشل تحميل الفواتير" : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const data = await getCompany();
      setSellerInfo(data);
    } catch (error) {
      console.error("Failed to load company info", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (id) => {
    const invoice = invoices.find((c) => c._id === id);
    setViewInvoice(invoice);
  };

  // states from invoices ends here //

  // states from payable invoice starts here //
  const [payableInvoices, setPayableInvoices] = useState([]);
  const [payableSearchTerm, setPayableSearchTerm] = useState("");
  const [payableStatusFilter, setPayableStatusFilter] = useState("all");
  const [viewPayableInvoice, setViewPayableInvoice] = useState(null);
  const [payablePagination, setPayablePagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchPayableInvoices = async () => {
    try {
      setLoading(true);
      const data = await PaybleInvoiceService.getAllInvoices(1, 10);

      setPayableInvoices(data.data.data);
      setPayablePagination({
        total: data?.data?.total || 0,
        page: data?.data?.page || 1,
        limit: data?.data?.limit || 10,
        totalPages: data?.data?.totalPages || 1,
      });
    } catch (error) {
      console.error("Failed to load invoices", error);
      alert(isArabic ? "فشل تحميل الفواتير" : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const handlePayableViewInvoice = (id) => {
    const invoice = payableInvoices.find((c) => c._id === id);
    setViewPayableInvoice(invoice);
  };

  // states from payable invoice ends here //

  const [activeTab, setActiveTab] = useState("overview");
  const [subActiveTab, setSubActiveTab] = useState("clientReceivables");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [summary, setSummary] = useState(null);
  // const [viewMode, setViewMode] = useState("grid");
  // const [showAddTransaction, setShowAddTransaction] = useState(false);
  // const [selectedPeriod, setSelectedPeriod] = useState("current_month");

  const fetchData = async () => {
    try {
      const data = await FinanceDepartmentService.getFinanceSummary();
      setSummary(data.data);
      // setClients(data.data.clients);
      // setInvoices(data.data.invoices);
      // setPayableInvoices(data.data.payables);
    } catch (error) {
      console.error("Failed to load company info", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    fetchClients();
    fetchInvoices();
    fetchCompanyData();
    fetchPayableInvoices();
  }, []);

  console.log(summary);

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

  const getRecievableStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Issued":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Sent":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaybleStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Issued":
      case "Partially Paid":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Sent":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "Draft":
      case "Due":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  // for clients
  const filteredClients = clients?.filter((client) => {
    const matchesSearch =
      client.client_name_eng
        .toLowerCase()
        .includes(clientSearchTerm.toLowerCase()) ||
      client.client_mobile_number
        .toLowerCase()
        .includes(clientSearchTerm.toLowerCase()) ||
      client.client_email.includes(clientSearchTerm);
    const matchesStatus =
      clientStatusFilter === "all" ||
      client.status === clientStatusFilter ||
      client.client_type === clientStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // for invoices
  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.buyer.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.buyer.nameAr.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // for payable invoices
  const filteredPayableInvoices = payableInvoices?.filter((invoice) => {
    const matchesSearch =
      invoice?.invoiceNumber
        ?.toLowerCase()
        .includes(payableSearchTerm?.toLowerCase()) ||
      invoice?.seller.nameEn
        ?.toLowerCase()
        .includes(payableSearchTerm?.toLowerCase()) ||
      invoice?.seller.nameAr?.includes(payableSearchTerm);
    const matchesStatus =
      payableStatusFilter === "all" || invoice.status === payableStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "قسم المالية" : "Finance Department"}
        </h1>
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
                {(summary?.totalReceivables / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "إجمالي الإيرادات" : "Total Revenue"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {(
                  (summary?.totalReceivables - summary?.totalPayables) /
                  1000000
                ).toFixed(1)}
                M
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "صافي الربح" : "Net Profit"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <span>
              {(
                ((summary?.totalReceivables - summary?.totalPayables) /
                  summary?.totalReceivables) *
                100
              ).toFixed(1)}
              % {isArabic ? "هامش الربح" : "profit margin"}
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
                {(summary?.totalReceivables / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "المستحقات" : "Receivables"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-purple-600">
            <span>{summary?.clients.length} clients</span> +{" "}
            <span>{summary?.invoices.length} invoices</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {(summary?.totalPayables / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "المستحقات" : "Payables"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-yellow-600">
            <span>{summary?.payables.length} invoices</span>
          </div>
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
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic
                      ? "الأداء المالي الشهري"
                      : "Financial Performance"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "الإيرادات:" : "Revenue:"}
                      </span>
                      <span className="font-bold text-green-600">
                        {summary?.totalReceivables.toLocaleString()} SAR
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "المصروفات:" : "Expenses:"}
                      </span>
                      <span className="font-bold text-red-600">
                        {summary?.totalPayables.toLocaleString()} SAR
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                      <span className="text-gray-600 font-medium">
                        {isArabic ? "صافي الربح:" : "Net Profit:"}
                      </span>
                      <span className="font-bold text-blue-600">
                        {(
                          summary?.totalReceivables - summary?.totalPayables
                        ).toLocaleString()}{" "}
                        SAR
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "هامش الربح:" : "Profit Margin:"}
                      </span>
                      <span className="font-bold text-purple-600">
                        {(
                          ((summary?.totalReceivables -
                            summary?.totalPayables) /
                            summary?.totalReceivables) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    {/* <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "رأس المال العامل:" : "Working Capital:"}
                      </span>
                      <span className="font-bold text-purple-600">
                        {financialOverview.workingCapital.toLocaleString()} SAR
                      </span>
                    </div> */}
                  </div>
                </div>

                {/* <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
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
                        {(
                          ((summary?.totalReceivables -
                            summary?.totalPayables) /
                            summary?.totalReceivables) *
                          100
                        ).toFixed(1)}
                        %
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
                </div> */}
              </div>

              {/* <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "الرسوم البيانية المالية" : "Financial Charts"}
                </h3>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض الرسوم البيانية للإيرادات والمصروفات والأرباح هنا..."
                    : "Revenue, expenses, and profit charts will be displayed here..."}
                </div>
              </div> */}
            </div>
          )}

          {activeTab === "receivables" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setSubActiveTab("clientReceivables")}
                    className={`px-6 py-4 font-medium transition-colors ${
                      subActiveTab === "clientReceivables"
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {isArabic
                        ? "ذمم مدينة عقود العملاء"
                        : "Client Contract Receivables"}
                    </div>
                  </button>
                  <button
                    onClick={() => setSubActiveTab("invoiceReceivables")}
                    className={`px-6 py-4 font-medium transition-colors ${
                      subActiveTab === "invoiceReceivables"
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {isArabic
                        ? "ذمم الحسابات المستحقة"
                        : "Invoice Receivables"}
                    </div>
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {subActiveTab === "clientReceivables" && (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        {/* <AlertTriangle className="w-5 h-5" /> */}
                        {isArabic ? "عملاء" : "Clients"}
                      </h3>
                      <p className="text-sm text-yellow-700">
                        {isArabic
                          ? "المستحقات من العملاء"
                          : "Recievables From the Clients"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder={
                            isArabic
                              ? "البحث في المستحقات..."
                              : "Search Clients by Name, Email, or Phone_Number..."
                          }
                          value={clientSearchTerm}
                          onChange={(e) => setClientSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                        />
                      </div>
                      <select
                        value={clientStatusFilter}
                        onChange={(e) => setClientStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="all">
                          {isArabic ? "جميع الحالات" : "All Status"}
                        </option>
                        <option value="active">
                          {isArabic ? "نشط" : "Active"}
                        </option>
                        <option value="inactive">
                          {isArabic ? "غير نشط" : "Inactive"}
                        </option>
                        <option value="corporate">
                          {isArabic ? "شركاتي" : "Corporate"}
                        </option>
                        <option value="government">
                          {isArabic ? "حكومة" : "Government"}
                        </option>
                      </select>
                    </div>

                    <div className="space-y-6">
                      {/* Client List */}
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table
                            className="w-full"
                            role="table"
                            aria-label="Client management table"
                          >
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  scope="col"
                                >
                                  {isArabic ? "العميل" : "Client"}
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  scope="col"
                                >
                                  {isArabic ? "النوع" : "Type"}
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  scope="col"
                                >
                                  {isArabic ? "قيمة العقد" : "Contract Value"}
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  scope="col"
                                >
                                  {isArabic ? "الحالة" : "Status"}
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  scope="col"
                                >
                                  {isArabic ? "تاريخ الانتهاء" : "Expiry Date"}
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  scope="col"
                                >
                                  {isArabic ? "الإجراءات" : "Actions"}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filteredClients.map((client) => (
                                <tr
                                  key={client._id}
                                  className="hover:bg-gray-50"
                                >
                                  <td
                                    className="px-6 py-4 whitespace-nowrap"
                                    role="cell"
                                  >
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {isArabic
                                          ? client.client_name_arb
                                          : client.client_name_eng}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {client.manpower_count}{" "}
                                        {isArabic ? "عامل" : "workers"} •{" "}
                                        {client.vehicle_count}{" "}
                                        {isArabic ? "مركبة" : "vehicles"}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {client.contact_person} •{" "}
                                        {client.client_mobile_number}
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    role="cell"
                                  >
                                    {client.client_type}
                                  </td>
                                  <td
                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                    role="cell"
                                  >
                                    {client.contract_value} SAR
                                  </td>
                                  <td
                                    className="px-6 py-4 whitespace-nowrap"
                                    role="cell"
                                  >
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        client.status === "active"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {client.status}
                                    </span>
                                  </td>
                                  <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    role="cell"
                                  >
                                    {client.contract_expiery_date
                                      ? new Date(
                                          client.contract_expiery_date
                                        ).toLocaleDateString(
                                          isArabic ? "ar-EG" : "en-GB",
                                          {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                          }
                                        )
                                      : ""}
                                  </td>
                                  <td
                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                    role="cell"
                                  >
                                    <div className="flex ml-5 items-center">
                                      <button
                                        onClick={() =>
                                          handleViewClient(client._id)
                                        }
                                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors "
                                        aria-label={`${
                                          isArabic ? "عرض" : "View"
                                        } ${client.client_name_eng}`}
                                      >
                                        <Eye
                                          className="w-4 h-4"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 mt-6">
                        {/* Previous Button */}
                        <button
                          onClick={() =>
                            fetchClients(Math.max(1, pagination.page - 1))
                          }
                          disabled={pagination.page <= 1}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        pagination.page <= 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                        >
                          {isArabic ? "السابق" : "Previous"}
                        </button>

                        {/* Page Info */}
                        <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                          {isArabic ? "صفحة" : "Page"}{" "}
                          {Number.isFinite(pagination.page)
                            ? pagination.page
                            : 0}{" "}
                          {isArabic ? "من" : "of"}{" "}
                          {Number.isFinite(pagination.totalPages)
                            ? pagination.totalPages
                            : 0}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() =>
                            fetchClients(
                              Math.min(
                                pagination.totalPages,
                                pagination.page + 1
                              )
                            )
                          }
                          disabled={pagination.page >= pagination.totalPages}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                     ${
                       pagination.page >= pagination.totalPages
                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                         : "bg-green-600 text-white hover:bg-green-700"
                     }`}
                        >
                          {isArabic ? "التالي" : "Next"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {subActiveTab === "invoiceReceivables" && (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        {/* <AlertTriangle className="w-5 h-5" /> */}
                        {isArabic ? "فواتير" : "Invoices"}
                      </h3>
                      <p className="text-sm text-yellow-700">
                        {isArabic
                          ? "المستحقات من الفواتير"
                          : "Recievables From the Invoices"}
                      </p>
                    </div>
                    <div className="space-y-6">
                      {/* Search and Filter */}
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder={
                              isArabic
                                ? "البحث في الفواتير..."
                                : "Search invoices by invoice number or buyer name..."
                            }
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                          />
                        </div>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="all">
                            {isArabic ? "جميع الحالات" : "All Status"}
                          </option>
                          <option value="Draft">
                            {isArabic ? "مسودة" : "Draft"}
                          </option>
                          <option value="Issued">
                            {isArabic ? "صادرة" : "Issued"}
                          </option>
                          <option value="Sent">
                            {isArabic ? "مرسلة" : "Sent"}
                          </option>
                          <option value="Paid">
                            {isArabic ? "مدفوعة" : "Paid"}
                          </option>
                          <option value="Overdue">
                            {isArabic ? "متأخرة" : "Overdue"}
                          </option>
                        </select>
                      </div>

                      {/* Invoices Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? "رقم الفاتورة" : "Invoice Number"}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? "العميل" : "Customer"}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? "التاريخ" : "Date"}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? "المبلغ" : "Amount"}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? "الحالة" : "Status"}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? "تاريخ الإصدار" : "Issued Date"}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? "الإجراءات" : "Actions"}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {filteredInvoices?.map((invoice) => (
                              <tr key={invoice.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">
                                  <div className="font-medium text-gray-900">
                                    {invoice.invoiceNumber}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {invoice.invoiceType}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="font-medium text-gray-900">
                                    {isArabic
                                      ? invoice.buyer.nameAr
                                      : invoice.buyer.nameEn}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {invoice.buyer.type} •{" "}
                                    {invoice.buyer.vatNumber || "No VAT"}
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">
                                  <div>
                                    {new Date(
                                      invoice.createdAt
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(invoice.createdAt).toLocaleString(
                                      "en-US",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true, // ✅ ensures AM/PM
                                      }
                                    )}
                                  </div>
                                </td>

                                <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                                  {invoice.subtotalIncludingVat.toLocaleString()}{" "}
                                  {invoice.currency}
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRecievableStatusColor(
                                      invoice.status
                                    )}`}
                                  >
                                    {invoice.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">
                                  <div>
                                    {invoice.issueDateGregorian
                                      ? `${new Date(
                                          invoice.issueDateGregorian
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        })} • ${invoice.issueTimeGregorian}`
                                      : "NA"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {invoice.issueDateGregorian
                                      ? `${invoice.issueDateHijri} • ${invoice.issueTimeGregorian}`
                                      : ""}
                                  </div>
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex items-center ml-4 gap-2">
                                    <button
                                      onClick={() => {
                                        handleViewInvoice(invoice._id);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                      title={isArabic ? "معاينة" : "Preview"}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex items-center justify-center gap-4 mt-6">
                        {/* Previous Button */}
                        <button
                          onClick={() =>
                            fetchInvoices(
                              Math.max(1, invoicePagination.page - 1)
                            )
                          }
                          disabled={invoicePagination.page <= 1}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                ${
                                  invoicePagination.page <= 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                        >
                          {isArabic ? "السابق" : "Previous"}
                        </button>

                        {/* Page Info */}
                        <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                          {isArabic ? "صفحة" : "Page"}{" "}
                          {Number.isFinite(invoicePagination.page)
                            ? invoicePagination.page
                            : 0}{" "}
                          {isArabic ? "من" : "of"}{" "}
                          {Number.isFinite(invoicePagination.totalPages)
                            ? invoicePagination.totalPages
                            : 0}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() =>
                            fetchInvoices(
                              Math.min(
                                invoicePagination.totalPages,
                                invoicePagination.page + 1
                              )
                            )
                          }
                          disabled={
                            invoicePagination.page >=
                            invoicePagination.totalPages
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                              ${
                                invoicePagination.page >=
                                invoicePagination.totalPages
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                        >
                          {isArabic ? "التالي" : "Next"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "payables" && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      isArabic
                        ? "البحث في الفواتير..."
                        : "Search invoices by invoice number or buyer name..."
                    }
                    value={payableSearchTerm}
                    onChange={(e) => setPayableSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <select
                  value={payableStatusFilter}
                  onChange={(e) => setPayableStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">
                    {isArabic ? "جميع الحالات" : "All Status"}
                  </option>
                  <option value="Due">{isArabic ? "مستحق" : "Due"}</option>

                  <option value="Partially Paid">
                    {isArabic ? "مدفوع جزئيًا" : "Partially Paid"}
                  </option>
                  <option value="Paid">{isArabic ? "مدفوعة" : "Paid"}</option>
                  <option value="Overdue">
                    {isArabic ? "متأخرة" : "Overdue"}
                  </option>
                </select>
              </div>

              {/* Invoices Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "رقم الفاتورة" : "Invoice Number"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "بائع" : "Seller"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "المبلغ" : "Amount"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "إجمالي المدفوعات" : "Total Paid"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "المجموع المستحق" : "Total Due"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الحالة" : "Status"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "التاريخ/الوقت" : "Date/Time"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPayableInvoices?.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.invoiceType}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">
                            {isArabic
                              ? invoice.seller.nameAr
                              : invoice.seller.nameEn}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.seller.vatNumber || "No VAT"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div>
                            {invoice.subtotalIncludingVat.toLocaleString()}{" "}
                            {invoice.currency}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {invoice.totalPaid.toLocaleString()}{" "}
                          {invoice.currency}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {invoice.balanceDue.toLocaleString()}{" "}
                          {invoice.currency}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPaybleStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div>
                            {invoice.issueDateGregorian
                              ? `${new Date(
                                  invoice.issueDateGregorian
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })} • ${invoice.issueTimeGregorian}`
                              : "NA"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {invoice.issueDateGregorian
                              ? `${invoice.issueDateHijri} • ${invoice.issueTimeGregorian}`
                              : ""}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                handlePayableViewInvoice(invoice._id);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              title={isArabic ? "معاينة" : "Preview"}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-center gap-4 mt-6">
                {/* Previous Button */}
                <button
                  onClick={() =>
                    fetchInvoices(Math.max(1, payablePagination.page - 1))
                  }
                  disabled={payablePagination.page <= 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                              ${
                                payablePagination.page <= 1
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                >
                  {isArabic ? "السابق" : "Previous"}
                </button>

                {/* Page Info */}
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                  {isArabic ? "صفحة" : "Page"}{" "}
                  {Number.isFinite(payablePagination.page)
                    ? payablePagination.page
                    : 0}{" "}
                  {isArabic ? "من" : "of"}{" "}
                  {Number.isFinite(payablePagination.totalPages)
                    ? payablePagination.totalPages
                    : 0}
                </div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    fetchInvoices(
                      Math.min(
                        payablePagination.totalPages,
                        payablePagination.page + 1
                      )
                    )
                  }
                  disabled={
                    payablePagination.page >= payablePagination.totalPages
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${
                              payablePagination.page >=
                              payablePagination.totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                >
                  {isArabic ? "التالي" : "Next"}
                </button>
              </div>
            </div>
          )}

          {/* {activeTab === "budget" && (
            <div className="space-y-6">
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
                      {budgetAnalysis?.map((budget, index) => (
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
                            <span className={`font-medium`}>
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
          )} */}
        </div>
      </div>

      {/* view client details */}
      {viewClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isArabic ? "تفاصيل العميل" : "Client Details"}
              </h3>
              <button
                onClick={() => setViewClient(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Client Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card component */}
              {[
                {
                  label: isArabic
                    ? "اسم الشركة (إنجليزي)"
                    : "Company Name (English)",
                  value: viewClient.client_name_eng,
                },
                {
                  label: isArabic
                    ? "اسم الشركة (عربي)"
                    : "Company Name (Arabic)",
                  value: viewClient.client_name_arb,
                },
                {
                  label: isArabic ? "نوع العميل" : "Client Type",
                  value: viewClient.client_type,
                },
                {
                  label: isArabic ? "قيمة العقد" : "Contract Value",
                  value:
                    viewClient.contract_value?.$numberDecimal ||
                    viewClient.contract_value,
                },
                {
                  label: isArabic
                    ? "تاريخ انتهاء العقد"
                    : "Contract Expiry Date",
                  value: viewClient.contract_expiery_date?.slice(0, 10),
                },
                {
                  label: isArabic ? "الحالة" : "Status",
                  value: viewClient.status,
                },
                {
                  label: isArabic ? "عدد العمال" : "Manpower Count",
                  value: viewClient.manpower_count,
                },
                {
                  label: isArabic ? "عدد المركبات" : "Vehicle Count",
                  value: viewClient.vehicle_count,
                },
                {
                  label: isArabic ? "جهة الاتصال" : "Contact Person",
                  value: viewClient.contact_person,
                },
                {
                  label: isArabic ? "البريد الإلكتروني" : "Email",
                  value: viewClient.client_email,
                },
                {
                  label: isArabic ? "رقم الهاتف" : "Phone Number",
                  value: viewClient.client_mobile_number,
                },
              ].map((field, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <span className="text-sm text-gray-500 mb-1">
                    {field.label}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {field.value || "-"}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewClient(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "معاينة الفاتورة" : "Invoice Preview"}
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  {isArabic ? "طباعة" : "Print"}
                </button>
                <button
                  onClick={() => setViewInvoice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Invoice Preview Content */}
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {isArabic
                        ? sellerInfo.companyNameAr
                        : sellerInfo.companyNameEn}
                    </h1>
                    <p className="text-gray-600">
                      {isArabic ? sellerInfo.addressAr : sellerInfo.addressEn}
                    </p>
                    <p className="text-gray-600">
                      {sellerInfo.phone} • {sellerInfo.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {isArabic ? "فاتورة ضريبية" : "TAX INVOICE"}
                    </h2>
                    <p className="text-gray-600">{viewInvoice.invoiceNumber}</p>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mt-4">
                      <QRCodeCanvas
                        value={`Seller: ${
                          isArabic
                            ? sellerInfo.companyNameAr
                            : sellerInfo.companyNameEn
                        }\nVAT No: ${sellerInfo.vatNumber}\nInvoice: ${
                          viewInvoice.invoiceNumber
                        }\nDate: ${new Date(
                          viewInvoice.issueDateGregorian
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}\nTime: ${
                          viewInvoice.issueTimeGregorian
                        }\nNo. of Items: ${viewInvoice.items.length}\nTotal: ${
                          viewInvoice.subtotalIncludingVat
                        }\nVAT: ${viewInvoice.totalVatAmount}`}
                        size={96}
                        includeMargin={true}
                        level="M"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {isArabic ? "معلومات المورد" : "Seller Information"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isArabic ? "رقم ضريبة القيمة المضافة:" : "VAT Number:"}{" "}
                      {sellerInfo.vatNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isArabic ? "رقم السجل التجاري:" : "CR Number:"}{" "}
                      {sellerInfo.crNumber}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {isArabic ? "معلومات العميل" : "Customer Information"}
                    </h3>
                    <p className="font-medium">
                      {isArabic
                        ? viewInvoice.buyer.nameAr
                        : viewInvoice.buyer.nameEn}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isArabic
                        ? viewInvoice.buyer.addressAr
                        : viewInvoice.buyer.addressEn}
                    </p>
                    {viewInvoice.buyer.vatNumber && (
                      <p className="text-sm text-gray-600">
                        {isArabic ? "رقم ضريبة القيمة المضافة:" : "VAT Number:"}{" "}
                        {viewInvoice.buyer.vatNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Invoice Metadata */}
                <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">
                      {isArabic
                        ? "تاريخ الإصدار (ميلادي):"
                        : "Issue Date (Gregorian):"}
                    </p>
                    <p className="font-medium">
                      {viewInvoice.issueDateGregorian
                        ? new Date(
                            viewInvoice.issueDateGregorian
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "NA"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {isArabic
                        ? "تاريخ الإصدار (هجري):"
                        : "Issue Date (Hijri):"}
                    </p>
                    <p className="font-medium">{viewInvoice.issueDateHijri}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {isArabic ? "نوع الفاتورة:" : "Invoice Type:"}
                    </p>
                    <p className="font-medium">{viewInvoice.invoiceType}</p>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        {isArabic ? "الوصف" : "Description"}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {isArabic ? "الكمية" : "Qty"}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {isArabic ? "سعر الوحدة" : "Unit Price"}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {isArabic ? "ضريبة القيمة المضافة" : "VAT"}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {isArabic ? "الإجمالي" : "Total"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {viewInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {isArabic ? item.descriptionAr : item.descriptionEn}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {item.unitPrice.toFixed(2)} {viewInvoice.currency}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {item.vatAmount.toFixed(2)} {viewInvoice.currency}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {item.totalIncludingVat.toFixed(2)}{" "}
                          {viewInvoice.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-80">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>
                          {isArabic
                            ? "المجموع (بدون ضريبة):"
                            : "Subtotal (Excl. VAT):"}
                        </span>
                        <span>
                          {viewInvoice.subtotalExcludingVat.toFixed(2)}{" "}
                          {viewInvoice.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          {isArabic
                            ? "ضريبة القيمة المضافة (15%):"
                            : "VAT (15%):"}
                        </span>
                        <span>
                          {viewInvoice.totalVatAmount.toFixed(2)}{" "}
                          {viewInvoice.currency}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
                        <span>
                          {isArabic
                            ? "الإجمالي (شامل الضريبة):"
                            : "Total (Incl. VAT):"}
                        </span>
                        <span>
                          {viewInvoice.subtotalIncludingVat}{" "}
                          {viewInvoice.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-blue-50 p-4 rounded-lg mb-8">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {isArabic ? "معلومات الدفع" : "Payment Information"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">
                        {isArabic ? "اسم البنك:" : "Bank Name:"}{" "}
                        {sellerInfo.bankName}
                      </p>
                      <p className="text-blue-700">
                        {isArabic ? "رقم الآيبان:" : "IBAN:"} {sellerInfo.iban}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-700">
                        {isArabic ? "رمز السويفت:" : "SWIFT Code:"}{" "}
                        {sellerInfo.swiftCode}
                      </p>
                      <p className="text-blue-700">
                        {isArabic ? "شروط الدفع:" : "Payment Terms:"}{" "}
                        {viewInvoice.paymentTerms}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {viewPayableInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "معاينة الفاتورة" : "Invoice Preview"}
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  {isArabic ? "طباعة" : "Print"}
                </button>
                <button
                  onClick={() => setViewPayableInvoice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Invoice Preview Content */}
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {isArabic
                        ? sellerInfo.companyNameAr
                        : sellerInfo.companyNameEn}
                    </h1>
                    <p className="text-gray-600">
                      {isArabic ? sellerInfo.addressAr : sellerInfo.addressEn}
                    </p>
                    <p className="text-gray-600">
                      {sellerInfo.phone} • {sellerInfo.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {isArabic ? "فاتورة ضريبية" : "TAX INVOICE"}
                    </h2>
                    <p className="text-gray-600">
                      {viewPayableInvoice.invoiceNumber}
                    </p>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mt-4">
                      <QRCodeCanvas
                        value={`Seller: ${
                          isArabic
                            ? sellerInfo.companyNameAr
                            : sellerInfo.companyNameEn
                        }\nVAT No: ${sellerInfo.vatNumber}\nInvoice: ${
                          viewPayableInvoice.invoiceNumber
                        }\nDate: ${new Date(
                          viewPayableInvoice.issueDateGregorian
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}\nTime: ${
                          viewPayableInvoice.issueTimeGregorian
                        }\nNo. of Items: ${
                          viewPayableInvoice?.items?.length
                        }\nTotal: ${
                          viewPayableInvoice.subtotalIncludingVat
                        }\nVAT: ${viewPayableInvoice.totalVatAmount}`}
                        size={96}
                        includeMargin={true}
                        level="M"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {isArabic ? "معلومات المشتري" : "Buyer Information"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isArabic ? "رقم ضريبة القيمة المضافة:" : "VAT Number:"}{" "}
                      {viewPayableInvoice?.buyer?.vatNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isArabic ? "رقم السجل التجاري:" : "CR Number:"}{" "}
                      {viewPayableInvoice?.buyer?.crNumber}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {isArabic ? "معلومات بائع" : "Seller Information"}
                    </h3>
                    <p className="font-medium">
                      {isArabic
                        ? viewPayableInvoice?.seller?.nameAr
                        : viewPayableInvoice?.seller?.nameEn}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isArabic
                        ? viewPayableInvoice?.seller?.addressAr
                        : viewPayableInvoice?.seller?.addressEn}
                    </p>
                    {viewPayableInvoice?.seller?.vatNumber && (
                      <p className="text-sm text-gray-600">
                        {isArabic ? "رقم ضريبة القيمة المضافة:" : "VAT Number:"}{" "}
                        {viewPayableInvoice?.seller?.vatNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Invoice Metadata */}
                <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">
                      {isArabic
                        ? "تاريخ الإصدار (ميلادي):"
                        : "Issue Date (Gregorian):"}
                    </p>
                    <p className="font-medium">
                      {viewPayableInvoice.issueDateGregorian
                        ? new Date(
                            viewPayableInvoice.issueDateGregorian
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "NA"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {isArabic
                        ? "تاريخ الإصدار (هجري):"
                        : "Issue Date (Hijri):"}
                    </p>
                    <p className="font-medium">
                      {viewPayableInvoice.issueDateHijri}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {isArabic ? "نوع الفاتورة:" : "Invoice Type:"}
                    </p>
                    <p className="font-medium">
                      {viewPayableInvoice.invoiceType}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        {isArabic ? "الوصف" : "Description"}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {isArabic ? "الكمية" : "Qty"}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {isArabic ? "سعر الوحدة" : "Unit Price"}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {isArabic ? "ضريبة القيمة المضافة" : "VAT"}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {isArabic ? "الإجمالي" : "Total"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {viewPayableInvoice?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {isArabic ? item.descriptionAr : item.descriptionEn}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {item.unitPrice.toFixed(2)}{" "}
                          {viewPayableInvoice.currency}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {item.vatAmount.toFixed(2)}{" "}
                          {viewPayableInvoice.currency}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {item.totalIncludingVat.toFixed(2)}{" "}
                          {viewPayableInvoice.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-80">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>
                          {isArabic
                            ? "المجموع (بدون ضريبة):"
                            : "Subtotal (Excl. VAT):"}
                        </span>
                        <span>
                          {viewPayableInvoice?.subtotalExcludingVat?.toFixed(2)}{" "}
                          {viewPayableInvoice?.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          {isArabic
                            ? "ضريبة القيمة المضافة (15%):"
                            : "VAT (15%):"}
                        </span>
                        <span>
                          {viewPayableInvoice?.totalVatAmount?.toFixed(2)}{" "}
                          {viewPayableInvoice.currency}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
                        <span>
                          {isArabic
                            ? "الإجمالي (شامل الضريبة):"
                            : "Total (Incl. VAT):"}
                        </span>
                        <span>
                          {viewPayableInvoice.subtotalIncludingVat}{" "}
                          {viewPayableInvoice.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-blue-50 p-4 rounded-lg mb-8">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {isArabic ? "معلومات الدفع" : "Payment Information"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">
                        {isArabic ? "اسم البنك:" : "Bank Name:"}{" "}
                        {viewPayableInvoice?.seller?.bankName}
                      </p>
                      <p className="text-blue-700">
                        {isArabic ? "رقم الآيبان:" : "IBAN:"}{" "}
                        {viewPayableInvoice?.seller?.iban}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-700">
                        {isArabic ? "حالة:" : "Status:"}{" "}
                        {viewPayableInvoice.status}
                      </p>
                      <p className="text-blue-700">
                        {isArabic ? "شروط الدفع:" : "Payment Terms:"}{" "}
                        {viewPayableInvoice.paymentTerms}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
