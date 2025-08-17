import React, { useState, useEffect } from "react";
import ClientService from "../services/ClientService";
import {
  Building2,
  Users,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  Eye,
  Trash2,
  Save,
  X,
  Download,
  Upload,
} from "lucide-react";

export const CompanyManagement = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [viewClient, setViewClient] = useState(null);
  const [clientCount, setClientCount] = useState({
    totalClient: 0,
    activeClient: 0,
    activeCorporateClient: 0,
    activeGovtClient: 0,
    totalWorkers: 0,
  });
  // console.log(clients);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientCount = async () => {
    try {
      const res = await ClientService.getClientCount();
      console.log(res);

      setClientCount({
        totalClient: res?.data?.totalClient || 0,
        activeClient: res?.data?.activeClient || 0,
        activeCorporateClient: res?.data?.activeCorporateClient || 0,
        activeGovtClient: res?.data?.activeGovtClient || 0,
        totalWorkers: res?.data?.totalWorkers || 0,
      });
    } catch (err) {
      console.error("Error fetching client count:", err.message);
      setError("Failed to load client count");
    }
  };

  const fetchClients = async (page = 1) => {
    try {
      setLoading(true);
      const res = await ClientService.getAllClients(page, pagination.limit);
      // console.log("res", res);

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

  const [newClient, setNewClient] = useState({
    nameEn: "",
    nameAr: "",
    type: "Corporate",
    contractValue: "",
    status: "Active",
    expiryDate: "",
    manpower: 0,
    vehicles: 0,
    contactPerson: "",
    email: "",
    phone: "",
  });

  const companyInfo = {
    crNumber: "1010123456",
    vatNumber: "300123456789003",
    establishmentDate: "2018-03-15",
    licenseExpiry: "2025-03-15",
    employeeCount: 186,
    vehicleCount: 47,
    activeContracts: 24,
  };

  const handleAddClient = async () => {
    const payload = {
      client_email: newClient.email,
      client_mobile_number: newClient.phone,
      client_name_eng: newClient.nameEn,
      client_name_arb: newClient.nameAr,
      client_type: newClient.type.toLowerCase(),
      contract_value: Number(
        newClient.contractValue?.$numberDecimal || newClient.contractValue
      ),
      contract_expiery_date: newClient.expiryDate,
      status: newClient.status.toLowerCase(),
      manpower_count: Number(newClient.manpower),
      vehicle_count: Number(newClient.vehicles),
      contact_person: newClient.contactPerson,
    };

    try {
      const res = await ClientService.createClient(payload);
      console.log(res);

      if (res?.status === 200) {
        fetchClients(1);
        fetchClientCount();
        setShowAddClient(false);
        setNewClient({
          nameEn: "",
          nameAr: "",
          type: "Corporate",
          contractValue: "",
          status: "Active",
          expiryDate: "",
          manpower: 0,
          vehicles: 0,
          contactPerson: "",
          email: "",
          phone: "",
        });
      }
    } catch (err) {
      setError("Failed to Add client");
      console.error("Error adding client:", err.message);
    }
  };

  const handleEditClient = (id) => {
    // Find client to edit
    const client = clients.find((c) => c._id === id);
    if (!client) return;

    // Store in state for editing (could be modal or inline form)
    setEditingClient(client);
  };

  const handleSaveClient = async () => {
    if (!editingClient) return;

    try {
      const payload = {
        client_email: editingClient.client_email,
        client_mobile_number: editingClient.client_mobile_number,
        client_name_eng: editingClient.client_name_eng,
        client_name_arb: editingClient.client_name_arb,
        client_type: editingClient.client_type.toLowerCase(),
        contract_value: Number(
          editingClient.contract_value?.$numberDecimal ||
            editingClient.contract_value
        ),
        contract_expiery_date: editingClient.contract_expiery_date,
        status: editingClient.status.toLowerCase(),
        manpower_count: Number(editingClient.manpower_count),
        vehicle_count: Number(editingClient.vehicle_count),
        contact_person: editingClient.contact_person,
      };

      // Pass only the ID here
      const res = await ClientService.updateClient(editingClient._id, payload);

      if (res?.status === 200) {
        fetchClients(pagination.page);
        fetchClientCount();
        setEditingClient(null);
      }
    } catch (err) {
      setError("Failed to Edit client");
      console.error("Error updating client:", err.message);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      const res = await ClientService.deleteClient(id);
      if (res?.status === 200) {
        fetchClients(pagination.page);
        fetchClientCount();
      }
    } catch (err) {
      console.error("Error deleting client:", err.message);
    }
  };

  const handleViewClient = (id) => {
    const client = clients.find((c) => c._id === id);
    setViewClient(client);
    console.log("Viewing client:", client);
  };

  const handleExportClients = () => {
    try {
      const csvContent = [
        [
          "Client Name (EN)",
          "Client Name (AR)",
          "Type",
          "Contract Value",
          "Status",
          "Expiry Date",
          "Manpower",
          "Vehicles",
          "Contact Person",
          "Email",
          "Phone",
        ],
        ...clients.map((client) => [
          client.nameEn,
          client.nameAr,
          client.type,
          client.contractValue,
          client.status,
          client.expiryDate,
          client.manpower.toString(),
          client.vehicles.toString(),
          client.contactPerson,
          client.email,
          client.phone,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `clients_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(
        isArabic
          ? "تم تصدير بيانات العملاء بنجاح!"
          : "Client data exported successfully!"
      );
    } catch (error) {
      console.error("Export error:", error);
      alert(
        isArabic ? "حدث خطأ أثناء التصدير" : "Error occurred during export"
      );
    }
  };

  const handleImportClients = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.setAttribute("aria-label", "Select CSV file to import");
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert(
            isArabic
              ? "حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)"
              : "File size too large (max 5MB)"
          );
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const csv = event.target.result;
            const lines = csv.split("\n");
            const headers = lines[0].split(",");

            const importedClients = lines
              .slice(1)
              .filter((line) => line.trim())
              .map((line, index) => {
                const values = line.split(",");
                return {
                  id: Math.max(...clients.map((c) => c.id)) + index + 1,
                  nameEn: values[0] || "",
                  nameAr: values[1] || "",
                  type: values[2] || "Corporate",
                  contractValue: values[3] || "",
                  status: values[4] || "Active",
                  expiryDate: values[5] || "",
                  manpower: parseInt(values[6]) || 0,
                  vehicles: parseInt(values[7]) || 0,
                  contactPerson: values[8] || "",
                  email: values[9] || "",
                  phone: values[10] || "",
                };
              });

            setClients([...clients, ...importedClients]);
            alert(
              isArabic
                ? `تم استيراد ${importedClients.length} عميل بنجاح!`
                : `Successfully imported ${importedClients.length} clients!`
            );
          } catch (error) {
            console.error("Import error:", error);
            alert(
              isArabic
                ? "حدث خطأ أثناء الاستيراد"
                : "Error occurred during import"
            );
          }
        };
        reader.onerror = () => {
          alert(isArabic ? "فشل في قراءة الملف" : "Failed to read file");
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  useEffect(() => {
    fetchClients(1);
    fetchClientCount();
  }, []);

  if (loading) return <p>Loading clients...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "إدارة الشركة والعملاء" : "Company & Client Management"}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportClients}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير العملاء" : "Export Clients"}
          </button>
          <button
            onClick={handleImportClients}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            {isArabic ? "استيراد العملاء" : "Import Clients"}
          </button>
          <button
            onClick={() => setShowAddClient(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "إضافة عميل جديد" : "Add New Client"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "profile"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {isArabic ? "ملف الشركة" : "Company Profile"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "clients"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {isArabic ? "العملاء" : "Clients"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Company Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {isArabic ? "أموجك المجمعة" : "AMOAGC Al-Majmaah"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isArabic
                          ? "العمليات والمقاولات العامة"
                          : "Operations & General Contracting"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>
                        {isArabic ? "رقم السجل التجاري:" : "CR Number:"}{" "}
                        {companyInfo.crNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>
                        {isArabic ? "الرقم الضريبي:" : "VAT Number:"}{" "}
                        {companyInfo.vatNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>
                        {isArabic ? "تاريخ التأسيس:" : "Established:"}{" "}
                        {companyInfo.establishmentDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "إحصائيات الشركة" : "Company Statistics"}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "الموظفون:" : "Employees:"}
                      </span>
                      <span className="font-semibold">
                        {companyInfo.employeeCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "المركبات:" : "Vehicles:"}
                      </span>
                      <span className="font-semibold">
                        {companyInfo.vehicleCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "العقود النشطة:" : "Active Contracts:"}
                      </span>
                      <span className="font-semibold">
                        {companyInfo.activeContracts}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {isArabic ? "تنبيهات الترخيص" : "License Alerts"}
                  </h4>
                  <div className="space-y-2">
                    <div className="text-sm text-yellow-700">
                      <span className="font-medium">
                        {isArabic ? "انتهاء الترخيص:" : "License Expiry:"}
                      </span>
                      <br />
                      {companyInfo.licenseExpiry}
                    </div>
                    <div className="text-xs text-yellow-600">
                      {isArabic ? "90 يوم متبقي" : "90 days remaining"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "معلومات الاتصال" : "Contact Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">+966 11 234 5678</p>
                      <p className="text-sm text-gray-600">
                        {isArabic ? "الهاتف الرئيسي" : "Main Office"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">info@amoagc.sa</p>
                      <p className="text-sm text-gray-600">
                        {isArabic ? "البريد الإلكتروني" : "Email Address"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {isArabic
                          ? "شارع الملك عبدالعزيز، المجمعة 11952، المملكة العربية السعودية"
                          : "King Abdulaziz Road, Al-Majmaah 11952, Saudi Arabia"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isArabic ? "العنوان الرئيسي" : "Head Office Address"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "clients" && (
            <div className="space-y-6">
              {/* Client Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {clientCount.totalClient}
                  </div>
                  <div className="text-sm text-blue-700">
                    {isArabic ? "إجمالي العملاء" : "Total Clients"}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {clientCount.activeClient}
                  </div>
                  <div className="text-sm text-green-700">
                    {isArabic ? "عملاء نشطون" : "Active Clients"}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {clientCount.activeCorporateClient}
                  </div>
                  <div className="text-sm text-purple-700">
                    {isArabic ? "عملاء الشركات" : "Corporate Clients"}
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {clientCount.activeGovtClient}
                  </div>
                  <div className="text-sm text-yellow-700">
                    {isArabic ? "العملاء الحكوميين" : "Government Clients"}
                  </div>
                </div>
              </div>

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
                      {clients.map((client) => (
                        <tr key={client._id} className="hover:bg-gray-50">
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
                            {client.contract_value?.$numberDecimal}
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
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewClient(client._id)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                aria-label={`${isArabic ? "عرض" : "View"} ${
                                  client.client_name_eng
                                }`}
                              >
                                <Eye className="w-4 h-4" aria-hidden="true" />
                              </button>

                              <button
                                onClick={() => handleEditClient(client._id)}
                                className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                                aria-label={`${isArabic ? "تعديل" : "Edit"} ${
                                  client.client_name_eng
                                }`}
                              >
                                <Edit className="w-4 h-4" aria-hidden="true" />
                              </button>

                              <button
                                onClick={() => handleDeleteClient(client._id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                aria-label={`${isArabic ? "حذف" : "Delete"} ${
                                  client.client_name_eng
                                }`}
                              >
                                <Trash2
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
                  onClick={() => fetchClients(Math.max(1, pagination.page - 1))}
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
                  {Number.isFinite(pagination.page) ? pagination.page : 0}{" "}
                  {isArabic ? "من" : "of"}{" "}
                  {Number.isFinite(pagination.totalPages)
                    ? pagination.totalPages
                    : 0}
                </div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    fetchClients(
                      Math.min(pagination.totalPages, pagination.page + 1)
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
          )}
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

      {/* update client */}
      {editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "تعديل العميل" : "Edit Client"}
              </h3>
              <button
                onClick={() => setEditingClient(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Company Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic
                      ? "اسم الشركة (إنجليزي)"
                      : "Company Name (English)"}{" "}
                    *
                  </label>
                  <input
                    type="text"
                    value={editingClient.client_name_eng}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        client_name_eng: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingClient.client_name_arb}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        client_name_arb: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Type & Contract Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "نوع العميل" : "Client Type"}
                  </label>
                  <select
                    value={editingClient.client_type}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        client_type: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="corporate">Corporate</option>
                    <option value="government">Government</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "قيمة العقد" : "Contract Value"} *
                  </label>
                  <input
                    type="text"
                    value={
                      editingClient.contract_value?.$numberDecimal ||
                      editingClient.contract_value
                    }
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        contract_value: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="1.2M SAR"
                    required
                  />
                </div>
              </div>

              {/* Expiry Date & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ انتهاء العقد" : "Contract Expiry Date"}
                  </label>
                  <input
                    type="date"
                    value={
                      editingClient.contract_expiery_date?.slice(0, 10) || ""
                    }
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        contract_expiery_date: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الحالة" : "Status"}
                  </label>
                  <select
                    value={editingClient.status}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        status: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Manpower, Vehicles, Contact Person */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد العمال" : "Manpower Count"}
                  </label>
                  <input
                    type="number"
                    value={editingClient.manpower_count || 0}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        manpower_count: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد المركبات" : "Vehicle Count"}
                  </label>
                  <input
                    type="number"
                    value={editingClient.vehicle_count || 0}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        vehicle_count: parseInt(e.target.value) || 0,
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
                    value={editingClient.contact_person || ""}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        contact_person: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={editingClient.client_email || ""}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        client_email: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={editingClient.client_mobile_number || ""}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        client_mobile_number: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Save & Cancel Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleSaveClient}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ التغييرات" : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditingClient(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إضافة عميل جديد" : "Add New Client"}
              </h3>
              <button
                onClick={() => setShowAddClient(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic
                      ? "اسم الشركة (إنجليزي)"
                      : "Company Name (English)"}{" "}
                    *
                  </label>
                  <input
                    type="text"
                    value={newClient.nameEn}
                    onChange={(e) =>
                      setNewClient({ ...newClient, nameEn: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={newClient.nameAr}
                    onChange={(e) =>
                      setNewClient({ ...newClient, nameAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "نوع العميل" : "Client Type"}
                  </label>
                  <select
                    value={newClient.type}
                    onChange={(e) =>
                      setNewClient({ ...newClient, type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "قيمة العقد" : "Contract Value"} *
                  </label>
                  <input
                    type="text"
                    value={newClient.contractValue}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        contractValue: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="1.2M SAR"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ انتهاء العقد" : "Contract Expiry Date"}
                  </label>
                  <input
                    type="date"
                    value={newClient.expiryDate}
                    onChange={(e) =>
                      setNewClient({ ...newClient, expiryDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الحالة" : "Status"}
                  </label>
                  <select
                    value={newClient.status}
                    onChange={(e) =>
                      setNewClient({ ...newClient, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد العمال" : "Manpower Count"}
                  </label>
                  <input
                    type="number"
                    value={newClient.manpower}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        manpower: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد المركبات" : "Vehicle Count"}
                  </label>
                  <input
                    type="number"
                    value={newClient.vehicles}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        vehicles: parseInt(e.target.value) || 0,
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
                    value={newClient.contactPerson}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        contactPerson: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) =>
                      setNewClient({ ...newClient, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) =>
                      setNewClient({ ...newClient, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleAddClient}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ العميل" : "Save Client"}
                </button>
                <button
                  onClick={() => setShowAddClient(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
