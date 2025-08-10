import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  Building2,
  Printer,
  Save,
  X,
  Copy,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { ZATCAInvoice } from "./ZATCAInvoice";

export const InvoiceManagement = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showZATCAPreview, setShowZATCAPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Default company information
  const defaultCompany = {
    name: "AMOAGC Al-Majmaah",
    nameAr: "أموجك المجمعة",
    address: "King Abdulaziz Road, Al-Majmaah 11952",
    addressAr: "شارع الملك عبدالعزيز، المجمعة 11952",
    city: "Al-Majmaah",
    cityAr: "المجمعة",
    postalCode: "11952",
    country: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
    phone: "+966 11 234 5678",
    email: "info@amoagc.sa",
    website: "www.amoagc.sa",
    crNumber: "1010123456",
    vatNumber: "300123456789003",
    zakatNumber: "ZAK123456789",
  };

  const defaultBankInfo = {
    bankName: "National Commercial Bank",
    bankNameAr: "البنك الأهلي السعودي",
    accountNumber: "123456789",
    iban: "SA00 1000 1234 5678 9012 3456",
    swiftCode: "NCBKSARI",
  };

  // Sample invoices data
  const [invoices, setInvoices] = useState([
    {
      id: "1",
      invoiceNumber: "INV/2025/00001",
      issueDate: "2025-01-15",
      issueTime: "14:30",
      dueDate: "2025-02-15",
      deliveryDate: "2025-01-15",
      paymentReference: "INV/2025/00001",
      company: defaultCompany,
      client: {
        name: "Ahmed Hassan",
        nameAr: "أحمد حسن",
        address: "Al-Olaya District, Riyadh",
        addressAr: "حي العليا، الرياض",
        city: "Riyadh",
        cityAr: "الرياض",
        postalCode: "11564",
        country: "Saudi Arabia",
        countryAr: "المملكة العربية السعودية",
        phone: "+966 50 123 4567",
        email: "ahmed@example.com",
        vatNumber: "311279658100003",
      },
      items: [
        {
          id: "1",
          description: "Metal Coaster (A)",
          descriptionAr: "كوستر معدني (أ)",
          quantity: 1,
          unitPrice: 8500,
          vatRate: 15,
          vatAmount: 1275,
          total: 9775,
        },
        {
          id: "2",
          description: "Additional Services (52 hours + 4 Fridays)",
          descriptionAr: "خدمات إضافية (52 ساعة + 4 جمعة)",
          quantity: 1,
          unitPrice: 3000,
          vatRate: 15,
          vatAmount: 450,
          total: 3450,
        },
      ],
      subtotal: 11500,
      discount: 0,
      totalVAT: 1725,
      total: 13225,
      paymentMethod: "Bank Transfer",
      paymentMethodAr: "تحويل بنكي",
      bankInfo: defaultBankInfo,
      notes:
        "Payment due within 30 days. Late payments subject to 2% monthly interest.",
      notesAr:
        "الدفع خلال 30 يوم. فواتير غير مدفوعة تخضع لرسوم تأخير 2% شهريًا.",
      status: "Sent",
      department: "Sales",
      createdBy: "Sales Manager",
      createdDate: "2025-01-15",
      zatcaCompliant: true,
      digitalSignature: "7A9F8E2D1C0B3A4F5E6D7C8B9A0F1E2D",
    },
    {
      id: "2",
      invoiceNumber: "INV/2025/00002",
      issueDate: "2025-01-16",
      issueTime: "10:15",
      dueDate: "2025-02-16",
      deliveryDate: "2025-01-16",
      paymentReference: "INV/2025/00002",
      company: defaultCompany,
      client: {
        name: "Fatima Al-Zahra",
        nameAr: "فاطمة الزهراء",
        address: "King Fahd Road, Jeddah",
        addressAr: "شارع الملك فهد، جدة",
        city: "Jeddah",
        cityAr: "جدة",
        postalCode: "21564",
        country: "Saudi Arabia",
        countryAr: "المملكة العربية السعودية",
        phone: "+966 50 234 5678",
        email: "fatima@example.com",
        vatNumber: "311279658100004",
      },
      items: [
        {
          id: "1",
          description: "Construction Support Services",
          descriptionAr: "خدمات دعم الإنشاءات",
          quantity: 1,
          unitPrice: 15000,
          vatRate: 15,
          vatAmount: 2250,
          total: 17250,
        },
      ],
      subtotal: 15000,
      discount: 0,
      totalVAT: 2250,
      total: 17250,
      paymentMethod: "Bank Transfer",
      paymentMethodAr: "تحويل بنكي",
      bankInfo: defaultBankInfo,
      status: "Paid",
      department: "Operations",
      createdBy: "Operations Manager",
      createdDate: "2025-01-16",
      zatcaCompliant: true,
    },
  ]);

  const [newInvoice, setNewInvoice] = useState({
    company: defaultCompany,
    bankInfo: defaultBankInfo,
    client: {
      name: "",
      nameAr: "",
      email: "",
      phone: "",
    },
    items: [
      {
        id: "1",
        description: "",
        descriptionAr: "",
        quantity: 1,
        unitPrice: 0,
        vatRate: 15,
        vatAmount: 0,
        total: 0,
      },
    ],
    subtotal: 0,
    discount: 0,
    totalVAT: 0,
    total: 0,
    paymentMethod: "Bank Transfer",
    paymentMethodAr: "تحويل بنكي",
    status: "Draft",
    zatcaCompliant: true,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Sent":
        return "bg-blue-100 text-blue-800 border-blue-200";
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

  const handlePreviewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowZATCAPreview(true);
  };

  const handleCreateInvoice = () => {
    if (!newInvoice.client?.name || !newInvoice.items?.length) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    const invoice = {
      ...newInvoice,
      id: String(invoices.length + 1),
      invoiceNumber: `INV/2025/${String(invoices.length + 1).padStart(5, "0")}`,
      issueDate: new Date().toISOString().split("T")[0],
      issueTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      deliveryDate: new Date().toISOString().split("T")[0],
      paymentReference: `INV/2025/${String(invoices.length + 1).padStart(
        5,
        "0"
      )}`,
      createdDate: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
      department: "Sales",
    };

    setInvoices([...invoices, invoice]);
    setShowCreateForm(false);
    setNewInvoice({
      company: defaultCompany,
      bankInfo: defaultBankInfo,
      items: [
        {
          id: "1",
          description: "",
          descriptionAr: "",
          quantity: 1,
          unitPrice: 0,
          vatRate: 15,
          vatAmount: 0,
          total: 0,
        },
      ],
      subtotal: 0,
      discount: 0,
      totalVAT: 0,
      total: 0,
      paymentMethod: "Bank Transfer",
      paymentMethodAr: "تحويل بنكي",
      status: "Draft",
      zatcaCompliant: true,
    });
    alert(
      isArabic ? "تم إنشاء الفاتورة بنجاح!" : "Invoice created successfully!"
    );
  };

  const calculateTotals = () => {
    if (!newInvoice.items) return;

    const subtotal = newInvoice.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const totalVAT = newInvoice.items.reduce(
      (sum, item) => sum + item.vatAmount,
      0
    );
    const total = subtotal + totalVAT - (newInvoice.discount || 0);

    setNewInvoice({
      ...newInvoice,
      subtotal,
      totalVAT,
      total,
    });
  };

  const updateItem = (index, field, value) => {
    if (!newInvoice.items) return;

    const updatedItems = [...newInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === "quantity" || field === "unitPrice") {
      const item = updatedItems[index];
      const netAmount = item.quantity * item.unitPrice;
      item.vatAmount = netAmount * (item.vatRate / 100);
      item.total = netAmount + item.vatAmount;
    }

    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  const addItem = () => {
    if (!newInvoice.items) return;

    const newItem = {
      id: String(newInvoice.items.length + 1),
      description: "",
      descriptionAr: "",
      quantity: 1,
      unitPrice: 0,
      vatRate: 15,
      vatAmount: 0,
      total: 0,
    };

    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, newItem],
    });
  };

  const removeItem = (index) => {
    if (!newInvoice.items || newInvoice.items.length <= 1) return;

    const updatedItems = newInvoice.items.filter((_, i) => i !== index);
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  useEffect(() => {
    calculateTotals();
  }, [newInvoice.items, newInvoice.discount]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.nameAr.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "إدارة الفواتير الذكية" : "Smart Invoice Management"}
        </h1>
        <div className="flex items-center gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير الفواتير" : "Export Invoices"}
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            {isArabic ? "استيراد الفواتير" : "Import Invoices"}
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "فاتورة جديدة" : "New Invoice"}
          </button>
        </div>
      </div>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {invoices.length}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "إجمالي الفواتير" : "Total Invoices"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {(
                  invoices.reduce((sum, inv) => sum + inv.total, 0) / 1000
                ).toFixed(0)}
                K
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "إجمالي القيمة" : "Total Value"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {invoices.filter((inv) => inv.status === "Paid").length}
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "فواتير مدفوعة" : "Paid Invoices"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {invoices.filter((inv) => inv.status === "Sent").length}
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "فواتير معلقة" : "Pending Invoices"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZATCA Compliance Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-800">
              {isArabic ? "متوافق مع ZATCA" : "ZATCA Compliant"}
            </h3>
            <p className="text-sm text-green-700">
              {isArabic
                ? "جميع الفواتير متوافقة مع متطلبات هيئة الزكاة والضرائب والجمارك للفوترة الإلكترونية"
                : "All invoices comply with ZATCA e-invoicing requirements and regulations"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-800">100%</div>
            <div className="text-sm text-green-600">
              {isArabic ? "متوافق" : "Compliant"}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                isArabic ? "البحث في الفواتير..." : "Search invoices..."
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
            <option value="Draft">{isArabic ? "مسودة" : "Draft"}</option>
            <option value="Sent">{isArabic ? "مرسلة" : "Sent"}</option>
            <option value="Paid">{isArabic ? "مدفوعة" : "Paid"}</option>
            <option value="Overdue">{isArabic ? "متأخرة" : "Overdue"}</option>
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
                  {isArabic ? "العميل" : "Client"}
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
                  {isArabic ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.department}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">
                      {isArabic ? invoice.client.nameAr : invoice.client.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.client.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {invoice.issueDate}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                    {invoice.total.toLocaleString()} SAR
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreviewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title={isArabic ? "معاينة" : "Preview"}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 p-1 rounded"
                        title={isArabic ? "طباعة" : "Print"}
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-800 p-1 rounded"
                        title={isArabic ? "إرسال" : "Send"}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title={isArabic ? "حذف" : "Delete"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إنشاء فاتورة جديدة" : "Create New Invoice"}
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Client Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "معلومات العميل" : "Client Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic
                        ? "اسم العميل (إنجليزي)"
                        : "Client Name (English)"}
                    </label>
                    <input
                      type="text"
                      value={newInvoice.client?.name || ""}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          client: {
                            ...(newInvoice.client || {}),
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "اسم العميل (عربي)" : "Client Name (Arabic)"}
                    </label>
                    <input
                      type="text"
                      value={newInvoice.client?.nameAr || ""}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          client: {
                            ...(newInvoice.client || {}),
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <input
                      type="email"
                      value={newInvoice.client?.email || ""}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          client: {
                            ...(newInvoice.client || {}),
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "رقم الهاتف" : "Phone"}
                    </label>
                    <input
                      type="tel"
                      value={newInvoice.client?.phone || ""}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          client: {
                            ...(newInvoice.client || {}),
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">
                    {isArabic ? "بنود الفاتورة" : "Invoice Items"}
                  </h4>
                  <button
                    onClick={addItem}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {isArabic ? "إضافة بند" : "Add Item"}
                  </button>
                </div>

                <div className="space-y-4">
                  {newInvoice.items?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isArabic ? "الوصف" : "Description"}
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isArabic ? "الكمية" : "Quantity"}
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "quantity",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isArabic ? "سعر الوحدة" : "Unit Price"}
                          </label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "unitPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isArabic ? "الإجمالي" : "Total"}
                          </label>
                          <input
                            type="text"
                            value={`${item.total.toFixed(2)} SAR`}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                          />
                        </div>
                        <div>
                          {newInvoice.items && newInvoice.items.length > 1 && (
                            <button
                              onClick={() => removeItem(index)}
                              className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>{isArabic ? "المجموع الفرعي:" : "Subtotal:"}</span>
                      <span className="font-semibold">
                        {(newInvoice.subtotal || 0).toFixed(2)} SAR
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isArabic ? "ضريبة القيمة المضافة:" : "VAT:"}</span>
                      <span className="font-semibold">
                        {(newInvoice.totalVAT || 0).toFixed(2)} SAR
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>{isArabic ? "الإجمالي:" : "Total:"}</span>
                      <span>{(newInvoice.total || 0).toFixed(2)} SAR</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleCreateInvoice}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "إنشاء الفاتورة" : "Create Invoice"}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZATCA Invoice Preview Modal */}
      {showZATCAPreview && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-screen overflow-y-auto">
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
                  onClick={() => setShowZATCAPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <ZATCAInvoice
                invoiceNumber={selectedInvoice.invoiceNumber}
                issueDate={selectedInvoice.issueDate}
                issueTime={selectedInvoice.issueTime}
                dueDate={selectedInvoice.dueDate}
                deliveryDate={selectedInvoice.deliveryDate}
                paymentReference={selectedInvoice.paymentReference}
                company={selectedInvoice.company}
                client={selectedInvoice.client}
                items={selectedInvoice.items}
                subtotal={selectedInvoice.subtotal}
                discount={selectedInvoice.discount}
                totalVAT={selectedInvoice.totalVAT}
                total={selectedInvoice.total}
                paymentMethod={selectedInvoice.paymentMethod}
                paymentMethodAr={selectedInvoice.paymentMethodAr}
                bankInfo={selectedInvoice.bankInfo}
                notes={selectedInvoice.notes}
                notesAr={selectedInvoice.notesAr}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
