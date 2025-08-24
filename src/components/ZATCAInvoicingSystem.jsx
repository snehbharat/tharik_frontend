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
  Shield,
  Globe,
  QrCode,
  FileCheck,
  Zap,
  Settings,
} from "lucide-react";
import { getCompany, updateCompany } from "../services/CompanyService";

export const ZATCAInvoicingSystem = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default seller information
  // const [sellerInfo, setSellerInfo] = useState({
  //   companyNameEn: "AMOAGC Al-Majmaah",
  //   companyNameAr: "أموجك المجمعة",
  //   vatNumber: "300123456789003", // 15-digit TIN
  //   crNumber: "1010123456",
  //   addressEn: "King Abdulaziz Road, Al-Majmaah 11952, Saudi Arabia",
  //   addressAr: "شارع الملك عبدالعزيز، المجمعة 11952، المملكة العربية السعودية",
  //   city: "Al-Majmaah",
  //   postalCode: "11952",
  //   country: "Saudi Arabia",
  //   phone: "+966 11 234 5678",
  //   email: "info@amoagc.sa",
  //   website: "www.amoagc.sa",
  //   iban: "SA1234567890123456789012",
  //   bankName: "National Commercial Bank",
  //   swiftCode: "NCBKSARI",
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCompany();
        setSellerInfo(data);
      } catch (error) {
        console.error("Failed to load company info", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveComapnyDetails = async () => {
    try {
      await updateCompany(sellerInfo);
      alert(
        isArabic ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully"
      );
    } catch (error) {
      console.error("Failed to save company info", error);
      alert(isArabic ? "فشل حفظ الإعدادات" : "Failed to save settings");
    }
  };

  // New invoice form state
  const [newInvoice, setNewInvoice] = useState({
    invoiceType: "Standard",
    currency: "SAR",
    paymentTerms: "Net 30 days",
    items: [
      {
        id: "1",
        descriptionEn: "",
        descriptionAr: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        vatRate: 15,
        vatAmount: 0,
        totalExcludingVat: 0,
        totalIncludingVat: 0,
        category: "Service",
      },
    ],
    buyer: {
      type: "B2B",
      nameEn: "",
      nameAr: "",
      addressEn: "",
      addressAr: "",
      city: "",
      postalCode: "",
      country: "Saudi Arabia",
      phone: "",
      email: "",
      contactPerson: "",
    },
  });

  // Sample invoices for demonstration
  useEffect(() => {
    const sampleInvoices = [
      {
        id: "1",
        invoiceNumber: "INV-2024-00001",
        invoiceType: "Standard",
        issueDateGregorian: "2024-12-15",
        issueTimeGregorian: "14:30:00",
        issueDateHijri: "13 جمادى الآخرة 1446",
        seller: sellerInfo,
        buyer: {
          type: "B2B",
          nameEn: "Saudi Aramco",
          nameAr: "أرامكو السعودية",
          vatNumber: "311279658100003",
          addressEn: "Dhahran Industrial Complex, Dhahran 31311",
          addressAr: "مجمع الظهران الصناعي، الظهران 31311",
          city: "Dhahran",
          postalCode: "31311",
          country: "Saudi Arabia",
          phone: "+966 13 876 5432",
          email: "procurement@aramco.com",
          contactPerson: "Ahmed Al-Mansouri",
        },
        items: [
          {
            id: "1",
            descriptionEn: "Heavy Equipment Maintenance Services",
            descriptionAr: "خدمات صيانة المعدات الثقيلة",
            quantity: 1,
            unitPrice: 15000,
            discount: 0,
            vatRate: 15,
            vatAmount: 2250,
            totalExcludingVat: 15000,
            totalIncludingVat: 17250,
            category: "Service",
          },
        ],
        subtotalExcludingVat: 15000,
        totalVatAmount: 2250,
        totalIncludingVat: 17250,
        currency: "SAR",
        paymentTerms: "Net 30 days",
        notes: "Payment due within 30 days of invoice date.",
        notesAr: "الدفع مستحق خلال 30 يوماً من تاريخ الفاتورة.",
        status: "Issued",
        qrCodeData: generateQRCodeData(
          "INV-2024-00001",
          sellerInfo?.vatNumber,
          17250,
          2250
        ),
        zatcaHash: generateZATCAHash("INV-2024-00001", 17250),
        digitalSignature: generateDigitalSignature("INV-2024-00001"),
        createdBy: "Finance Manager",
        createdAt: "2024-12-15T14:30:00Z",
        submittedToZATCA: true,
        zatcaSubmissionId: "ZATCA-2024-001",
      },
    ];
    setInvoices(sampleInvoices);
  }, []);

  // Helper functions for ZATCA compliance
  function generateQRCodeData(invoiceNumber, vatNumber, total, vatAmount) {
    // ZATCA QR Code format (Base64-encoded TLV)
    const qrData = {
      sellerName: sellerInfo?.companyNameAr,
      vatNumber: vatNumber,
      timestamp: new Date().toISOString(),
      totalAmount: total.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
    };

    // Convert UTF-8 string to Latin-1 compatible format for btoa
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(qrData));
    let binaryString = "";
    for (let i = 0; i < data.length; i++) {
      binaryString += String.fromCharCode(data[i]);
    }
    return btoa(binaryString);
  }

  function generateZATCAHash(invoiceNumber, total) {
    // Simplified hash generation (in production, use proper ECDSA signing)
    const hashData = `${invoiceNumber}-${total}-${new Date().toISOString()}-${
      sellerInfo?.vatNumber
    }`;
    return btoa(hashData).substring(0, 64).toUpperCase();
  }

  function generateDigitalSignature(invoiceNumber) {
    // Simplified digital signature (in production, use PKI-based signing)
    const signatureData = `${invoiceNumber}-${
      sellerInfo?.crNumber
    }-${new Date().getTime()}`;
    return btoa(signatureData).substring(0, 128).toUpperCase();
  }

  function convertToHijri(gregorianDate) {
    // Simplified Hijri conversion (in production, use proper Hijri calendar library)
    const months = [
      "محرم",
      "صفر",
      "ربيع الأول",
      "ربيع الآخر",
      "جمادى الأولى",
      "جمادى الآخرة",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذو القعدة",
      "ذو الحجة",
    ];
    const date = new Date(gregorianDate);
    const hijriYear = date.getFullYear() - 579; // Approximate conversion
    const hijriMonth = months[date.getMonth()];
    const hijriDay = date.getDate();
    return `${hijriDay} ${hijriMonth} ${hijriYear}`;
  }

  function validateInvoice(invoice) {
    const errors = [];

    // Validate seller information
    if (!sellerInfo?.vatNumber || sellerInfo?.vatNumber?.length !== 15) {
      errors.push(
        isArabic
          ? "رقم ضريبة القيمة المضافة يجب أن يكون 15 رقم"
          : "VAT number must be 15 digits"
      );
    }

    // Validate buyer information for B2B
    if (invoice.buyer?.type === "B2B" && !invoice.buyer.vatNumber) {
      errors.push(
        isArabic
          ? "رقم ضريبة القيمة المضافة للعميل مطلوب للمعاملات التجارية"
          : "Buyer VAT number is mandatory for B2B transactions"
      );
    }

    // Validate items
    if (!invoice.items || invoice.items.length === 0) {
      errors.push(
        isArabic
          ? "يجب إضافة عنصر واحد على الأقل"
          : "At least one item is required"
      );
    }

    return errors;
  }

  const handleCreateInvoice = () => {
    const errors = validateInvoice(newInvoice);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(
      invoices.length + 1
    ).padStart(5, "0")}`;
    const now = new Date();
    const gregorianDate = now.toISOString().split("T")[0];
    const gregorianTime = now.toTimeString().split(" ")[0];
    const hijriDate = convertToHijri(gregorianDate);

    const invoice = {
      ...newInvoice,
      id: String(invoices.length + 1),
      invoiceNumber,
      issueDateGregorian: gregorianDate,
      issueTimeGregorian: gregorianTime,
      issueDateHijri: hijriDate,
      seller: sellerInfo,
      qrCodeData: generateQRCodeData(
        invoiceNumber,
        sellerInfo?.vatNumber,
        newInvoice.totalIncludingVat || 0,
        newInvoice.totalVatAmount || 0
      ),
      zatcaHash: generateZATCAHash(
        invoiceNumber,
        newInvoice.totalIncludingVat || 0
      ),
      digitalSignature: generateDigitalSignature(invoiceNumber),
      createdBy: "Current User",
      createdAt: now.toISOString(),
      submittedToZATCA: false,
      status: "Draft",
    };

    setInvoices([...invoices, invoice]);
    setShowCreateModal(false);
    resetNewInvoice();
    alert(
      isArabic ? "تم إنشاء الفاتورة بنجاح!" : "Invoice created successfully!"
    );
  };

  const resetNewInvoice = () => {
    setNewInvoice({
      invoiceType: "Standard",
      currency: "SAR",
      paymentTerms: "Net 30 days",
      items: [
        {
          id: "1",
          descriptionEn: "",
          descriptionAr: "",
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          vatRate: 15,
          vatAmount: 0,
          totalExcludingVat: 0,
          totalIncludingVat: 0,
          category: "Service",
        },
      ],
      buyer: {
        type: "B2B",
        nameEn: "",
        nameAr: "",
        addressEn: "",
        addressAr: "",
        city: "",
        postalCode: "",
        country: "Saudi Arabia",
        phone: "",
        email: "",
        contactPerson: "",
      },
    });
  };

  const calculateItemTotals = (item) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    const totalExcludingVat = subtotal - discountAmount;
    const vatAmount = totalExcludingVat * (item.vatRate / 100);
    const totalIncludingVat = totalExcludingVat + vatAmount;

    return {
      ...item,
      vatAmount,
      totalExcludingVat,
      totalIncludingVat,
    };
  };

  const updateItem = (index, field, value) => {
    if (!newInvoice.items) return;

    const updatedItems = [...newInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    updatedItems[index] = calculateItemTotals(updatedItems[index]);

    const subtotalExcludingVat = updatedItems.reduce(
      (sum, item) => sum + item.totalExcludingVat,
      0
    );
    const totalVatAmount = updatedItems.reduce(
      (sum, item) => sum + item.vatAmount,
      0
    );
    const totalIncludingVat = subtotalExcludingVat + totalVatAmount;

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      subtotalExcludingVat,
      totalVatAmount,
      totalIncludingVat,
    });
  };

  const addItem = () => {
    if (!newInvoice.items) return;

    const newItem = {
      id: String(newInvoice.items.length + 1),
      descriptionEn: "",
      descriptionAr: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      vatRate: 15,
      vatAmount: 0,
      totalExcludingVat: 0,
      totalIncludingVat: 0,
      category: "Service",
    };

    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, newItem],
    });
  };

  const removeItem = (index) => {
    if (!newInvoice.items || newInvoice.items.length <= 1) return;

    const updatedItems = newInvoice.items.filter((_, i) => i !== index);
    const subtotalExcludingVat = updatedItems.reduce(
      (sum, item) => sum + item.totalExcludingVat,
      0
    );
    const totalVatAmount = updatedItems.reduce(
      (sum, item) => sum + item.vatAmount,
      0
    );
    const totalIncludingVat = subtotalExcludingVat + totalVatAmount;

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      subtotalExcludingVat,
      totalVatAmount,
      totalIncludingVat,
    });
  };

  const handleExportInvoices = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        sellerInfo,
        invoices,
        totalInvoices: invoices.length,
        totalValue: invoices.reduce(
          (sum, inv) => sum + inv.totalIncludingVat,
          0
        ),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `zatca_invoices_export_${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);

      alert(
        isArabic
          ? "تم تصدير الفواتير بنجاح!"
          : "Invoices exported successfully!"
      );
    } catch (error) {
      console.error("Export error:", error);
      alert(
        isArabic ? "حدث خطأ أثناء التصدير" : "Error occurred during export"
      );
    }
  };

  const handleImportInvoices = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importData = JSON.parse(event.target.result);
            if (importData.invoices && Array.isArray(importData.invoices)) {
              setInvoices([...invoices, ...importData.invoices]);
              alert(
                isArabic
                  ? `تم استيراد ${importData.invoices.length} فاتورة بنجاح!`
                  : `Successfully imported ${importData.invoices.length} invoices!`
              );
            } else {
              throw new Error("Invalid file format");
            }
          } catch (error) {
            console.error("Import error:", error);
            alert(isArabic ? "تنسيق الملف غير صحيح" : "Invalid file format");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSubmitToZATCA = async (invoice) => {
    try {
      // Simulate ZATCA submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const updatedInvoices = invoices.map((inv) =>
        inv.id === invoice.id
          ? {
              ...inv,
              submittedToZATCA: true,
              zatcaSubmissionId: `ZATCA-${Date.now()}`,
            }
          : inv
      );

      setInvoices(updatedInvoices);
      alert(
        isArabic
          ? "تم إرسال الفاتورة إلى ZATCA بنجاح!"
          : "Invoice submitted to ZATCA successfully!"
      );
    } catch (error) {
      console.error("ZATCA submission error:", error);
      alert(
        isArabic
          ? "فشل في إرسال الفاتورة إلى ZATCA"
          : "Failed to submit invoice to ZATCA"
      );
    }
  };

  const getStatusColor = (status) => {
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

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.buyer.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.buyer.nameAr.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic
            ? "نظام الفوترة الإلكترونية ZATCA"
            : "ZATCA E-Invoicing System"}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportInvoices}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير" : "Export"}
          </button>
          <button
            onClick={handleImportInvoices}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            {isArabic ? "استيراد" : "Import"}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "فاتورة جديدة" : "New Invoice"}
          </button>
        </div>
      </div>

      {/* ZATCA Compliance Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-800">
              {isArabic
                ? "متوافق مع ZATCA المرحلة الثانية"
                : "ZATCA Phase 2 Compliant"}
            </h3>
            <p className="text-sm text-green-700">
              {isArabic
                ? "نظام فوترة إلكترونية متكامل مع التوقيع الرقمي ورمز الاستجابة السريعة وإرسال مباشر إلى ZATCA"
                : "Complete e-invoicing system with digital signatures, QR codes, and direct ZATCA submission"}
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

      {/* Statistics */}
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
                  invoices.reduce(
                    (sum, inv) => sum + inv.totalIncludingVat,
                    0
                  ) / 1000
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
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {invoices.filter((inv) => inv.submittedToZATCA).length}
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "مرسل إلى ZATCA" : "Submitted to ZATCA"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {invoices.filter((inv) => inv.status === "Paid").length}
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "فواتير مدفوعة" : "Paid Invoices"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "invoices"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isArabic ? "الفواتير" : "Invoices"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "settings"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {isArabic ? "إعدادات الشركة" : "Company Settings"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("compliance")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "compliance"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {isArabic ? "الامتثال" : "Compliance"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "invoices" && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex items-center gap-4">
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
                  <option value="Issued">
                    {isArabic ? "صادرة" : "Issued"}
                  </option>
                  <option value="Sent">{isArabic ? "مرسلة" : "Sent"}</option>
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
                        {isArabic ? "ZATCA" : "ZATCA"}
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
                          <div>{invoice.issueDateGregorian}</div>
                          <div className="text-xs text-gray-500">
                            {invoice.issueDateHijri}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {invoice.totalIncludingVat.toLocaleString()}{" "}
                          {invoice.currency}
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
                          {invoice.submittedToZATCA ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs">Submitted</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSubmitToZATCA(invoice)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Submit
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowPreview(true);
                              }}
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic
                  ? "إعدادات معلومات الشركة"
                  : "Company Information Settings"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic
                      ? "اسم الشركة (إنجليزي)"
                      : "Company Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.companyNameEn}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        companyNameEn: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.companyNameAr}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        companyNameAr: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic
                      ? "رقم ضريبة القيمة المضافة (15 رقم)"
                      : "VAT Number (15 digits)"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.vatNumber}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        vatNumber: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    maxLength={15}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم السجل التجاري" : "CR Number"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.crNumber}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, crNumber: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ التأسيس" : "Establishment Date"}
                  </label>
                  <input
                    type="date"
                    value={
                      sellerInfo?.establishmentDate
                        ? sellerInfo.establishmentDate.split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        establishmentDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "انتهاء صلاحية الترخيص" : "License Expiry"}
                  </label>
                  <input
                    type="date"
                    value={
                      sellerInfo?.licenseExpiry
                        ? sellerInfo.licenseExpiry.split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        licenseExpiry: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "العنوان (إنجليزي)" : "Address (English)"}
                  </label>
                  <textarea
                    value={sellerInfo?.addressEn}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        addressEn: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "العنوان (عربي)" : "Address (Arabic)"}
                  </label>
                  <textarea
                    value={sellerInfo?.addressAr}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        addressAr: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={sellerInfo?.phone}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, phone: e.target.value })
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
                    value={sellerInfo?.email}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الموقع الإلكتروني" : "Website"}
                  </label>
                  <input
                    type="url"
                    value={sellerInfo?.website}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, website: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الآيبان" : "IBAN"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.iban}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, iban: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم البنك" : "Bank Name"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.bankName}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, bankName: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رمز السويفت" : "SWIFT Code"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.swiftCode}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        swiftCode: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveComapnyDetails}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ الإعدادات" : "Save Settings"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "compliance" && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {isArabic ? "حالة الامتثال ZATCA" : "ZATCA Compliance Status"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">
                        {isArabic ? "التوقيع الرقمي" : "Digital Signature"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {isArabic ? "مفعل ومتوافق" : "Enabled and Compliant"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">
                        {isArabic ? "رمز الاستجابة السريعة" : "QR Code"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {isArabic ? "تنسيق TLV متوافق" : "TLV Format Compliant"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">
                        {isArabic ? "إرسال ZATCA" : "ZATCA Submission"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {isArabic ? "API متصل" : "API Connected"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-4">
                  {isArabic
                    ? "متطلبات المرحلة الثانية"
                    : "Phase 2 Requirements"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      {isArabic
                        ? "رقم ضريبة القيمة المضافة 15 رقم"
                        : "15-digit VAT Number"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      {isArabic
                        ? "التاريخ الهجري والميلادي"
                        : "Hijri and Gregorian Dates"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      {isArabic
                        ? "التوقيع الرقمي ECDSA"
                        : "ECDSA Digital Signature"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      {isArabic
                        ? "رمز الاستجابة السريعة TLV"
                        : "TLV QR Code Format"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      {isArabic ? "التحقق من B2B/B2C" : "B2B/B2C Validation"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-800 mb-4">
                  {isArabic ? "الأرشفة والاحتفاظ" : "Archiving & Retention"}
                </h3>
                <p className="text-sm text-yellow-700">
                  {isArabic
                    ? "يتم الاحتفاظ بجميع الفواتير لمدة 5 سنوات كما هو مطلوب من ZATCA"
                    : "All invoices are retained for 5+ years as required by ZATCA regulations"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إنشاء فاتورة جديدة" : "Create New Invoice"}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Invoice Type and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "نوع الفاتورة" : "Invoice Type"}
                  </label>
                  <select
                    value={newInvoice.invoiceType}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        invoiceType: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Simplified">Simplified</option>
                    <option value="Credit">Credit Note</option>
                    <option value="Debit">Debit Note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "العملة" : "Currency"}
                  </label>
                  <select
                    value={newInvoice.currency}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, currency: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="SAR">SAR - Saudi Riyal</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "شروط الدفع" : "Payment Terms"}
                  </label>
                  <select
                    value={newInvoice.paymentTerms}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        paymentTerms: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Net 30 days">Net 30 days</option>
                    <option value="Net 15 days">Net 15 days</option>
                    <option value="Due on receipt">Due on receipt</option>
                    <option value="Net 60 days">Net 60 days</option>
                  </select>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "معلومات العميل" : "Customer Information"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "نوع العميل" : "Customer Type"}
                    </label>
                    <select
                      value={newInvoice.buyer?.type || "B2B"}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          buyer: {
                            ...(newInvoice.buyer || {}),
                            type: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="B2B">B2B - Business to Business</option>
                      <option value="B2C">B2C - Business to Consumer</option>
                    </select>
                  </div>
                  {newInvoice.buyer?.type === "B2B" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic
                          ? "رقم ضريبة القيمة المضافة للعميل"
                          : "Customer VAT Number"}{" "}
                        *
                      </label>
                      <input
                        type="text"
                        value={newInvoice.buyer?.vatNumber || ""}
                        onChange={(e) =>
                          setNewInvoice({
                            ...newInvoice,
                            buyer: {
                              ...(newInvoice.buyer || {}),
                              vatNumber: e.target.value,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        maxLength={15}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic
                        ? "اسم العميل (إنجليزي)"
                        : "Customer Name (English)"}
                    </label>
                    <input
                      type="text"
                      value={newInvoice.buyer?.nameEn || ""}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          buyer: {
                            ...(newInvoice.buyer || {}),
                            nameEn: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic
                        ? "اسم العميل (عربي)"
                        : "Customer Name (Arabic)"}
                    </label>
                    <input
                      type="text"
                      value={newInvoice.buyer?.nameAr || ""}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          buyer: {
                            ...(newInvoice.buyer || {}),
                            nameAr: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <input
                      type="email"
                      value={newInvoice.buyer?.email || ""}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          buyer: {
                            ...(newInvoice.buyer || {}),
                            email: e.target.value,
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
                      value={newInvoice.buyer?.phone || ""}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          buyer: {
                            ...(newInvoice.buyer || {}),
                            phone: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "جهة الاتصال" : "Contact Person"}
                    </label>
                    <input
                      type="text"
                      value={newInvoice.buyer?.contactPerson || ""}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          buyer: {
                            ...(newInvoice.buyer || {}),
                            contactPerson: e.target.value,
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
                      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isArabic
                              ? "الوصف (إنجليزي)"
                              : "Description (English)"}
                          </label>
                          <input
                            type="text"
                            value={item.descriptionEn}
                            onChange={(e) =>
                              updateItem(index, "descriptionEn", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isArabic ? "الوصف (عربي)" : "Description (Arabic)"}
                          </label>
                          <input
                            type="text"
                            value={item.descriptionAr}
                            onChange={(e) =>
                              updateItem(index, "descriptionAr", e.target.value)
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
                            min="0"
                            step="0.01"
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
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isArabic ? "خصم%" : "Discount%"}
                          </label>
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "discount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isArabic ? "الإجمالي" : "Total"}
                          </label>
                          <input
                            type="text"
                            value={`${item.totalIncludingVat.toFixed(2)} ${
                              newInvoice.currency
                            }`}
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
                      <span>
                        {isArabic
                          ? "المجموع (بدون ضريبة):"
                          : "Subtotal (Excl. VAT):"}
                      </span>
                      <span className="font-semibold">
                        {(newInvoice.subtotalExcludingVat || 0).toFixed(2)}{" "}
                        {newInvoice.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {isArabic ? "ضريبة القيمة المضافة:" : "VAT Amount:"}
                      </span>
                      <span className="font-semibold">
                        {(newInvoice.totalVatAmount || 0).toFixed(2)}{" "}
                        {newInvoice.currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>
                        {isArabic
                          ? "الإجمالي (شامل الضريبة):"
                          : "Total (Incl. VAT):"}
                      </span>
                      <span>
                        {(newInvoice.totalIncludingVat || 0).toFixed(2)}{" "}
                        {newInvoice.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "ملاحظات (إنجليزي)" : "Notes (English)"}
                  </label>
                  <textarea
                    value={newInvoice.notes || ""}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, notes: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "ملاحظات (عربي)" : "Notes (Arabic)"}
                  </label>
                  <textarea
                    value={newInvoice.notesAr || ""}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, notesAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
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
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showPreview && selectedInvoice && (
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
                  onClick={() => setShowPreview(false)}
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
                      {selectedInvoice.invoiceNumber}
                    </p>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mt-4">
                      <QrCode className="w-12 h-12 text-gray-500" />
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
                        ? selectedInvoice.buyer.nameAr
                        : selectedInvoice.buyer.nameEn}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isArabic
                        ? selectedInvoice.buyer.addressAr
                        : selectedInvoice.buyer.addressEn}
                    </p>
                    {selectedInvoice.buyer.vatNumber && (
                      <p className="text-sm text-gray-600">
                        {isArabic ? "رقم ضريبة القيمة المضافة:" : "VAT Number:"}{" "}
                        {selectedInvoice.buyer.vatNumber}
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
                      {selectedInvoice.issueDateGregorian}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {isArabic
                        ? "تاريخ الإصدار (هجري):"
                        : "Issue Date (Hijri):"}
                    </p>
                    <p className="font-medium">
                      {selectedInvoice.issueDateHijri}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {isArabic ? "نوع الفاتورة:" : "Invoice Type:"}
                    </p>
                    <p className="font-medium">{selectedInvoice.invoiceType}</p>
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
                    {selectedInvoice.items.map((item, index) => (
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
                          {item.unitPrice.toFixed(2)} {selectedInvoice.currency}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {item.vatAmount.toFixed(2)} {selectedInvoice.currency}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {item.totalIncludingVat.toFixed(2)}{" "}
                          {selectedInvoice.currency}
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
                          {selectedInvoice.subtotalExcludingVat.toFixed(2)}{" "}
                          {selectedInvoice.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          {isArabic
                            ? "ضريبة القيمة المضافة (15%):"
                            : "VAT (15%):"}
                        </span>
                        <span>
                          {selectedInvoice.totalVatAmount.toFixed(2)}{" "}
                          {selectedInvoice.currency}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
                        <span>
                          {isArabic
                            ? "الإجمالي (شامل الضريبة):"
                            : "Total (Incl. VAT):"}
                        </span>
                        <span>
                          {selectedInvoice.totalIncludingVat.toFixed(2)}{" "}
                          {selectedInvoice.currency}
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
                        {selectedInvoice.paymentTerms}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Digital Signature */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">
                    {isArabic
                      ? "التوقيع الرقمي والامتثال"
                      : "Digital Signature & Compliance"}
                  </h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>
                      {isArabic ? "رمز التوقيع الرقمي:" : "Digital Signature:"}{" "}
                      {selectedInvoice.digitalSignature.substring(0, 32)}...
                    </p>
                    <p>
                      {isArabic ? "رمز ZATCA:" : "ZATCA Hash:"}{" "}
                      {selectedInvoice.zatcaHash.substring(0, 32)}...
                    </p>
                    <p className="font-medium">
                      {isArabic
                        ? "✓ متوافق مع ZATCA المرحلة الثانية"
                        : "✓ ZATCA Phase 2 Compliant"}
                    </p>
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
