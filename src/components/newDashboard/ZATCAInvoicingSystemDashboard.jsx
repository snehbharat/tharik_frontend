import React, { useState, useEffect, useRef } from "react";
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
  ImageIcon,
} from "lucide-react";
import {
  getCompany,
  getImageUrl,
  updateCompany,
} from "../../services/CompanyService";
import { useReactToPrint } from "react-to-print";
import InvoiceService from "../../services/InvoiceService";
import { QRCodeCanvas } from "qrcode.react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ClientService from "../../services/ClientService";

export const ZATCAInvoicingSystemDashboard = ({ isArabic }) => {
  const invoiceRef = useRef();
  const [activeTab, setActiveTab] = useState("invoices");
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCompany();
        if (data.companyImage) {
          setImagePreview(getImageUrl(data.companyImage));
        }
      } catch (error) {
        console.error("Failed to load company info", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchClients = async (page = 1) => {
      try {
        setLoading(true);
        const res = await ClientService.getAllClients();

        setClients(res?.data?.data || []);
      } catch (err) {
        console.error("Error fetching clients:", err.message);
        setError("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  console.log("cl", clients);

  const handleCustomerSelect = (clientId, isEditing = false) => {
    if (!clientId) {
      // If no client selected, reset to empty/default values
      const emptyBuyer = {
        type: isEditing
          ? editingInvoice?.buyer?.type || "B2B"
          : newInvoice.buyer?.type || "B2B",
        nameEn: "",
        nameAr: "",
        vatNumber: "",
        email: "",
        phone: "",
        contactPerson: "",
        country: "Saudi Arabia",
        addressEn: "",
        addressAr: "",
        city: "",
        postalCode: "",
      };

      if (isEditing) {
        setEditingInvoice({ ...editingInvoice, buyer: emptyBuyer });
      } else {
        setNewInvoice({ ...newInvoice, buyer: emptyBuyer });
      }
      return;
    }

    const selectedClient = clients.find((c) => c._id === clientId);

    if (!selectedClient) return;

    const buyerData = {
      type: isEditing
        ? editingInvoice?.buyer?.type || "B2B"
        : newInvoice.buyer?.type || "B2B",
      nameEn: clientId,
      nameAr:
        selectedClient.client_name_arb || selectedClient.clientNameAr || "NA",
      vatNumber: selectedClient.vat_number || selectedClient.vatNumber || "NA",
      email: selectedClient.email || selectedClient.client_email || "NA",
      phone:
        selectedClient.phone || selectedClient.client_mobile_number || "NA",
      contactPerson:
        selectedClient.contact_person || selectedClient.contactPerson || "NA",
      country: selectedClient.country || selectedClient.client_country || "NA",
      addressEn:
        selectedClient.address_eng ||
        selectedClient.addressEn ||
        selectedClient.address ||
        "NA",
      addressAr: selectedClient.address_arb || selectedClient.addressAr || "NA",
      city: selectedClient.city || selectedClient.client_city || "NA",
      postalCode:
        selectedClient.postal_code || selectedClient.postalCode || "NA",
    };

    if (isEditing) {
      setEditingInvoice({
        ...editingInvoice,
        buyer: buyerData,
      });
    } else {
      setNewInvoice({
        ...newInvoice,
        buyer: buyerData,
      });
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: selectedInvoice
      ? `Invoice-${selectedInvoice.invoiceNumber}`
      : "Invoice",
    onAfterPrint: () => console.log("Printed successfully!"),
  });

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
  console.log(invoices);

  // New invoice form state
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: "",
    invoiceType: "Standard",
    currency: "SAR",
    issueDate: new Date().toISOString().split("T")[0],
    issueDateGregorian: "",
    issueTimeGregorian: "",
    issueDateHijri: "",
    dueDate: "",
    status: "Draft",
    paymentTerms: "Net 30 days",
    subtotalExcludingVat: 0,
    totalVatAmount: 0,
    subtotalIncludingVat: 0,
    items: [
      {
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
      vatNumber: null,
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

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await InvoiceService.getAllInvoices(1, 10);

      setInvoices(data.data.data);
      setPagination({
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
  useEffect(() => {
    fetchInvoices();
  }, []);

  console.log("inv", invoices);

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
    if (
      invoice.buyer?.type === "B2B - Business to Business" &&
      !invoice.buyer.vatNumber
    ) {
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

  const handleCreateInvoice = async () => {
    const errors = validateInvoice(newInvoice);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      const createdInvoice = await InvoiceService.createInvoice({
        ...newInvoice,
        seller: sellerInfo?._id,
      });

      // setInvoices((prev) => [...prev, createdInvoice.invoiceDetails]);
      fetchInvoices();
      setShowCreateModal(false);
      resetNewInvoice();
      alert(
        isArabic ? "تم إنشاء الفاتورة بنجاح!" : "Invoice created successfully!"
      );
    } catch (error) {
      console.error("Create invoice error:", error);
      alert(isArabic ? "فشل إنشاء الفاتورة" : "Failed to create invoice");
    }
  };

  const resetNewInvoice = () => {
    setNewInvoice({
      invoiceNumber: "",
      invoiceType: "Standard",
      currency: "SAR",
      issueDate: new Date().toISOString().split("T")[0],
      issueDateGregorian: "",
      issueTimeGregorian: "",
      issueDateHijri: "",
      status: "Draft",
      dueDate: "",
      paymentTerms: "Net 30 days",
      subtotalExcludingVat: 0,
      totalVatAmount: 0,
      subtotalIncludingVat: 0,
      items: [
        {
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

  const convertToHijri = (gregorianDate) => {
    if (!gregorianDate) return "";
    const date = new Date(gregorianDate);
    return new Intl.DateTimeFormat("ar-SA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      calendar: "islamic",
    }).format(date);
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

  const recalcInvoiceTotals = (items) => {
    const subtotalExcludingVat = items.reduce(
      (sum, item) => sum + item.totalExcludingVat,
      0
    );
    const totalVatAmount = items.reduce((sum, item) => sum + item.vatAmount, 0);
    const subtotalIncludingVat = subtotalExcludingVat + totalVatAmount;

    return { subtotalExcludingVat, totalVatAmount, subtotalIncludingVat };
  };

  const updateItem = (index, field, value) => {
    if (!newInvoice.items) return;

    const updatedItems = [...newInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    updatedItems[index] = calculateItemTotals(updatedItems[index]);

    const { subtotalExcludingVat, totalVatAmount, subtotalIncludingVat } =
      recalcInvoiceTotals(updatedItems);

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      subtotalExcludingVat,
      totalVatAmount,
      subtotalIncludingVat,
    });
  };

  const addItem = () => {
    if (!newInvoice.items) return;

    const newItem = calculateItemTotals({
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
    });

    const updatedItems = [...newInvoice.items, newItem];
    const { subtotalExcludingVat, totalVatAmount, subtotalIncludingVat } =
      recalcInvoiceTotals(updatedItems);

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      subtotalExcludingVat,
      totalVatAmount,
      subtotalIncludingVat,
    });
  };

  const removeItem = (index) => {
    if (!newInvoice.items) return;

    const updatedItems = newInvoice.items.filter((_, i) => i !== index);
    const { subtotalExcludingVat, totalVatAmount, subtotalIncludingVat } =
      recalcInvoiceTotals(updatedItems);

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      subtotalExcludingVat,
      totalVatAmount,
      subtotalIncludingVat,
    });
  };

  // 🔹 Update an existing item inside editingInvoice
  const updateEditingItem = (index, field, value) => {
    if (!editingInvoice.items) return;

    const updatedItems = [...editingInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    updatedItems[index] = calculateItemTotals(updatedItems[index]);

    const { subtotalExcludingVat, totalVatAmount, subtotalIncludingVat } =
      recalcInvoiceTotals(updatedItems);

    setEditingInvoice({
      ...editingInvoice,
      items: updatedItems,
      subtotalExcludingVat,
      totalVatAmount,
      subtotalIncludingVat,
    });
  };

  // 🔹 Add a new blank item to editingInvoice
  const addEditingItem = () => {
    if (!editingInvoice.items) return;

    const newItem = calculateItemTotals({
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
    });

    const updatedItems = [...editingInvoice.items, newItem];
    const { subtotalExcludingVat, totalVatAmount, subtotalIncludingVat } =
      recalcInvoiceTotals(updatedItems);

    setEditingInvoice({
      ...editingInvoice,
      items: updatedItems,
      subtotalExcludingVat,
      totalVatAmount,
      subtotalIncludingVat,
    });
  };

  // 🔹 Remove an item from editingInvoice
  const removeEditingItem = (index) => {
    if (!editingInvoice.items) return;

    const updatedItems = editingInvoice.items.filter((_, i) => i !== index);
    const { subtotalExcludingVat, totalVatAmount, subtotalIncludingVat } =
      recalcInvoiceTotals(updatedItems);

    setEditingInvoice({
      ...editingInvoice,
      items: updatedItems,
      subtotalExcludingVat,
      totalVatAmount,
      subtotalIncludingVat,
    });
  };

  const handleEditInvoice = (id) => {
    const invoice = invoices.find((i) => i._id === id);
    setEditingInvoice(invoice);
  };

  const handleSaveInvoice = async () => {
    if (!editingInvoice) return;

    try {
      const payload = {
        invoiceNumber: editingInvoice.invoiceNumber,
        invoiceType: editingInvoice.invoiceType,
        currency: editingInvoice.currency,
        issueDate: editingInvoice.issueDate,
        issueDateGregorian: editingInvoice.issueDateGregorian,
        issueTimeGregorian: editingInvoice.issueTimeGregorian,
        issueDateHijri: editingInvoice.issueDateHijri,
        status: editingInvoice.status,
        dueDate: editingInvoice.dueDate,
        paymentTerms: editingInvoice.paymentTerms,
        subtotalExcludingVat: editingInvoice.subtotalExcludingVat,
        totalVatAmount: editingInvoice.totalVatAmount,
        subtotalIncludingVat: editingInvoice.subtotalIncludingVat,

        items: editingInvoice.items.map((item) => ({
          descriptionEn: item.descriptionEn,
          descriptionAr: item.descriptionAr,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          vatRate: item.vatRate,
          vatAmount: item.vatAmount,
          totalExcludingVat: item.totalExcludingVat,
          totalIncludingVat: item.totalIncludingVat,
          category: item.category,
        })),

        buyer: {
          type: editingInvoice.buyer?.type,
          vatNumber: editingInvoice.buyer?.vatNumber,
          nameEn: editingInvoice.buyer?.nameEn,
          nameAr: editingInvoice.buyer?.nameAr,
          addressEn: editingInvoice.buyer?.addressEn,
          addressAr: editingInvoice.buyer?.addressAr,
          city: editingInvoice.buyer?.city,
          postalCode: editingInvoice.buyer?.postalCode,
          country: editingInvoice.buyer?.country,
          phone: editingInvoice.buyer?.phone,
          email: editingInvoice.buyer?.email,
          contactPerson: editingInvoice.buyer?.contactPerson,
        },
      };

      // ✅ API call with ID + payload
      const res = await InvoiceService.updateInvoice(
        editingInvoice._id,
        payload
      );

      if (res?.status === 200) {
        fetchInvoices();
        setEditingInvoice(null);
      }
    } catch (err) {
      // setError("Failed to edit invoice");
      console.error("Error updating invoice:", err.message);
    }
  };

  const handleDeleteInvoice = async (id) => {
    try {
      const res = await InvoiceService.deleteInvoice(id);
      if (res?.status === 200) {
        fetchInvoices(pagination.page);
      }
    } catch (err) {
      console.error("Error deleting client:", err.message);
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

  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.buyer.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.buyer.nameAr.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadInvoices = () => {
    if (!filteredInvoices?.length)
      return alert("No invoices available to export");

    // Prepare data for Excel
    const data = filteredInvoices.map((invoice, index) => ({
      "S.No": index + 1,
      "Invoice Number": invoice.invoiceNumber,
      "Invoice Type": invoice.invoiceType,
      "Customer Name": isArabic ? invoice.buyer.nameAr : invoice.buyer.nameEn,
      "Customer Type": invoice.buyer.type,
      "VAT Number": invoice.buyer.vatNumber || "N/A",
      "Date Created": new Date(invoice.createdAt).toLocaleDateString("en-GB"),
      "Amount (Incl. VAT)": invoice.subtotalIncludingVat,
      Currency: invoice.currency,
      Status: invoice.status,
      "Issued Date": invoice.issueDateGregorian
        ? new Date(invoice.issueDateGregorian).toLocaleDateString("en-GB")
        : "N/A",
      "Payment Terms": invoice.paymentTerms || "N/A",
    }));

    // Create worksheet & workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices Summary");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `Invoices_Summary_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          {isArabic ? "نظام الفوترة الإلكترونية" : "E-Invoicing System"}
        </h1>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {invoices?.length}
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
                {(() => {
                  const total =
                    invoices?.reduce(
                      (sum, inv) => sum + (inv.subtotalIncludingVat || 0),
                      0
                    ) || 0;

                  return total >= 1000
                    ? (total / 1000).toFixed(0) + "K"
                    : total;
                })()}
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "إجمالي القيمة" : "Total Value"}
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
                {invoices?.filter((inv) => inv.status === "Paid").length}
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "فواتير مدفوعة" : "Paid Invoices"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
