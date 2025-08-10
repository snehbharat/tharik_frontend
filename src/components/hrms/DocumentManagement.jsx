import React, { useState, useMemo } from "react";
import { useFileUpload } from "../../hooks/useFileUpload";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  User,
  Building2,
  Award,
  Heart,
  Plus,
  X,
  Save,
} from "lucide-react";
import FileService from "../../services/FileService";

export const DocumentManagement = ({ employees, isArabic }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { uploadFile, uploads, isUploading, cancelUpload } = useFileUpload({
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
    ],
    validateContent: true,
    autoCleanup: true,
  });
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedDocType, setSelectedDocType] = useState("all");
  const [expiryFilter, setExpiryFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const documentTypes = [
    {
      type: "passport",
      name: "Passport",
      nameAr: "جواز السفر",
      icon: FileText,
      color: "bg-blue-100 text-blue-800",
      required: true,
      maxSize: 5 * 1024 * 1024,
      allowedFormats: ["application/pdf", "image/jpeg", "image/png"],
    },
    {
      type: "visa",
      name: "Visa",
      nameAr: "التأشيرة",
      icon: FileText,
      color: "bg-green-100 text-green-800",
      required: true,
      maxSize: 5 * 1024 * 1024,
      allowedFormats: ["application/pdf", "image/jpeg", "image/png"],
    },
    {
      type: "iqama",
      name: "Iqama",
      nameAr: "الإقامة",
      icon: FileText,
      color: "bg-purple-100 text-purple-800",
      required: true,
      maxSize: 5 * 1024 * 1024,
      allowedFormats: ["application/pdf", "image/jpeg", "image/png"],
    },
    {
      type: "national-id",
      name: "National ID",
      nameAr: "الهوية الوطنية",
      icon: FileText,
      color: "bg-yellow-100 text-yellow-800",
      required: true,
      maxSize: 5 * 1024 * 1024,
      allowedFormats: ["application/pdf", "image/jpeg", "image/png"],
    },
    {
      type: "contract",
      name: "Employment Contract",
      nameAr: "عقد العمل",
      icon: FileText,
      color: "bg-red-100 text-red-800",
      required: true,
      maxSize: 10 * 1024 * 1024,
      allowedFormats: ["application/pdf", "application/msword"],
    },
    {
      type: "certificate",
      name: "Certificates",
      nameAr: "الشهادات",
      icon: Award,
      color: "bg-indigo-100 text-indigo-800",
      required: false,
    },
    {
      type: "medical-report",
      name: "Medical Reports",
      nameAr: "التقارير الطبية",
      icon: Heart,
      color: "bg-pink-100 text-pink-800",
      required: false,
    },
    {
      type: "training-certificate",
      name: "Training Certificates",
      nameAr: "شهادات التدريب",
      icon: Award,
      color: "bg-orange-100 text-orange-800",
      required: false,
    },
  ];

  const allDocuments = useMemo(() => {
    const docs = [];
    employees.forEach((employee) => {
      employee.documents.forEach((doc) => {
        docs.push({
          ...doc,
          employeeName: employee.personalInfo.fullName,
          departmentName: "Operations",
        });
      });
    });
    return docs;
  }, [employees]);

  const filteredDocuments = useMemo(() => {
    return allDocuments.filter((doc) => {
      const matchesSearch =
        !searchTerm ||
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEmployee =
        selectedEmployee === "all" || doc.employeeId === selectedEmployee;
      const matchesDocType =
        selectedDocType === "all" || doc.type === selectedDocType;

      let matchesExpiry = true;
      if (expiryFilter !== "all" && doc.expiryDate) {
        const today = new Date();
        const expiryDate = new Date(doc.expiryDate);
        const daysUntilExpiry = Math.ceil(
          (expiryDate - today) / (1000 * 60 * 60 * 24)
        );

        if (expiryFilter === "expiring") {
          matchesExpiry = daysUntilExpiry <= 90 && daysUntilExpiry > 0;
        } else if (expiryFilter === "expired") {
          matchesExpiry = daysUntilExpiry <= 0;
        }
      }

      return (
        matchesSearch && matchesEmployee && matchesDocType && matchesExpiry
      );
    });
  }, [
    allDocuments,
    searchTerm,
    selectedEmployee,
    selectedDocType,
    expiryFilter,
  ]);

  const documentStats = useMemo(() => {
    const total = allDocuments.length;
    const expiring = allDocuments.filter((doc) => {
      if (!doc.expiryDate) return false;
      const daysUntilExpiry = Math.ceil(
        (new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
    }).length;
    const expired = allDocuments.filter((doc) => {
      if (!doc.expiryDate) return false;
      const daysUntilExpiry = Math.ceil(
        (new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 0;
    }).length;
    const approved = allDocuments.filter(
      (doc) => doc.approvalStatus === "approved"
    ).length;

    return { total, expiring, expired, approved };
  }, [allDocuments]);

  const handleFileUpload = async (files, documentType, employeeId) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const typeConfig = getDocumentTypeConfig(documentType);

    try {
      if (typeConfig.maxSize && file.size > typeConfig.maxSize) {
        alert(
          isArabic
            ? `حجم الملف يتجاوز الحد المسموح (${(
                typeConfig.maxSize /
                1024 /
                1024
              ).toFixed(1)} ميجابايت)`
            : `File size exceeds limit (${(
                typeConfig.maxSize /
                1024 /
                1024
              ).toFixed(1)} MB)`
        );
        return;
      }

      if (
        typeConfig.allowedFormats &&
        !typeConfig.allowedFormats.includes(file.type)
      ) {
        alert(
          isArabic
            ? `نوع الملف غير مدعوم. الأنواع المدعومة: ${typeConfig.allowedFormats.join(
                ", "
              )}`
            : `File type not supported. Supported types: ${typeConfig.allowedFormats.join(
                ", "
              )}`
        );
        return;
      }

      const result = await uploadFile(file, {
        maxSize: typeConfig.maxSize,
        allowedTypes: typeConfig.allowedFormats,
        validateContent: true,
      });

      if (result.success) {
        alert(isArabic ? "تم رفع الملف بنجاح!" : "File uploaded successfully!");
      } else {
        alert(
          isArabic
            ? `فشل في رفع الملف: ${result.error}`
            : `Upload failed: ${result.error}`
        );
      }
    } catch (error) {
      console.error("File upload error:", error);
      alert(
        isArabic
          ? "حدث خطأ أثناء رفع الملف"
          : "An error occurred during file upload"
      );
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (
      !window.confirm(
        isArabic
          ? "هل أنت متأكد من حذف هذه الوثيقة؟"
          : "Are you sure you want to delete this document?"
      )
    ) {
      return;
    }
    try {
      const success = await FileService.deleteFile(documentId);
      if (success) {
        alert(
          isArabic ? "تم حذف الوثيقة بنجاح!" : "Document deleted successfully!"
        );
      } else {
        alert(isArabic ? "فشل في حذف الوثيقة" : "Failed to delete document");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        isArabic
          ? "حدث خطأ أثناء حذف الوثيقة"
          : "An error occurred while deleting the document"
      );
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate)
      return {
        status: "none",
        color: "text-gray-500",
        text: isArabic ? "لا ينتهي" : "No expiry",
      };
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 0) {
      return {
        status: "expired",
        color: "text-red-600",
        text: isArabic ? "منتهي الصلاحية" : "Expired",
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        status: "critical",
        color: "text-red-600",
        text: `${daysUntilExpiry} ${isArabic ? "يوم" : "days"}`,
      };
    } else if (daysUntilExpiry <= 90) {
      return {
        status: "warning",
        color: "text-yellow-600",
        text: `${daysUntilExpiry} ${isArabic ? "يوم" : "days"}`,
      };
    } else {
      return {
        status: "valid",
        color: "text-green-600",
        text: `${daysUntilExpiry} ${isArabic ? "يوم" : "days"}`,
      };
    }
  };

  const getDocumentTypeConfig = (type) => {
    return documentTypes.find((dt) => dt.type === type) || documentTypes[0];
  };

  const handleExportDocuments = () => {
    try {
      const csvContent = [
        [
          "Employee Name",
          "Document Name",
          "Type",
          "Upload Date",
          "Expiry Date",
          "Status",
          "Department",
        ],
        ...filteredDocuments.map((doc) => [
          doc.employeeName,
          doc.name,
          doc.type,
          doc.uploadDate.toLocaleDateString(),
          doc.expiryDate || "No expiry",
          doc.approvalStatus,
          doc.departmentName,
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
        `documents_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم تصدير الوثائق بنجاح!"
          : "Documents exported successfully!"
      );
    } catch (error) {
      console.error("Export error:", error);
      alert(
        isArabic ? "حدث خطأ أثناء التصدير" : "Error occurred during export"
      );
    }
  };
  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {documentStats.total}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "إجمالي الوثائق" : "Total Documents"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {documentStats.approved}
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "وثائق معتمدة" : "Approved Documents"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {documentStats.expiring}
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "تنتهي قريباً" : "Expiring Soon"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">
                {documentStats.expired}
              </div>
              <div className="text-sm text-red-700">
                {isArabic ? "منتهية الصلاحية" : "Expired"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIX: Added upload progress indicator */}
      {uploads.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-3">
            {isArabic ? "حالة الرفع" : "Upload Progress"}
          </h4>
          <div className="space-y-2">
            {uploads.map((upload) => (
              <div
                key={upload.uploadId}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-blue-700">{upload.fileName}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${upload.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-blue-600">
                    {upload.progress.toFixed(0)}%
                  </span>
                  {upload.status === "uploading" && (
                    <button
                      onClick={() => cancelUpload(upload.uploadId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Management Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isArabic ? "إدارة الوثائق" : "Document Management"}
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportDocuments}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                {isArabic ? "تصدير" : "Export"}
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {isArabic ? "رفع وثيقة" : "Upload Document"}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={
                  isArabic ? "البحث في الوثائق..." : "Search documents..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">
                {isArabic ? "جميع الموظفين" : "All Employees"}
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {isArabic
                    ? emp.personalInfo.fullNameAr
                    : emp.personalInfo.fullName}
                </option>
              ))}
            </select>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">
                {isArabic ? "جميع الأنواع" : "All Types"}
              </option>
              {documentTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {isArabic ? type.nameAr : type.name}
                </option>
              ))}
            </select>
            <select
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">
                {isArabic ? "جميع الحالات" : "All Status"}
              </option>
              <option value="expiring">
                {isArabic ? "تنتهي قريباً" : "Expiring Soon"}
              </option>
              <option value="expired">
                {isArabic ? "منتهية الصلاحية" : "Expired"}
              </option>
            </select>
          </div>
        </div>

        {/* Documents List */}
        <div className="p-6">
          <div className="text-sm text-gray-600 mb-4">
            {isArabic ? "عرض" : "Showing"} {filteredDocuments.length}{" "}
            {isArabic ? "من" : "of"} {allDocuments.length}{" "}
            {isArabic ? "وثيقة" : "documents"}
          </div>

          <div className="grid gap-4">
            {filteredDocuments.map((document) => {
              const typeConfig = getDocumentTypeConfig(document.type);
              const expiryStatus = getExpiryStatus(document.expiryDate);
              const Icon = typeConfig.icon;

              return (
                <div
                  key={document.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeConfig.color}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {document.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{document.employeeName}</span>
                          <span>•</span>
                          <span>
                            {isArabic ? typeConfig.nameAr : typeConfig.name}
                          </span>
                          <span>•</span>
                          <span>
                            {(document.fileSize / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>
                            {isArabic ? "رفع في:" : "Uploaded:"}{" "}
                            {document.uploadDate.toLocaleDateString()}
                          </span>
                          {document.expiryDate && (
                            <>
                              <span>•</span>
                              <span className={expiryStatus.color}>
                                {isArabic ? "ينتهي في:" : "Expires:"}{" "}
                                {expiryStatus.text}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          document.approvalStatus === "approved"
                            ? "bg-green-100 text-green-800"
                            : document.approvalStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {document.approvalStatus}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedDocument(document)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title={isArabic ? "عرض" : "View"}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800 p-1 rounded"
                          title={isArabic ? "تحميل" : "Download"}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title={isArabic ? "حذف" : "Delete"}
                          onClick={() => handleDeleteDocument(document.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {document.tags && document.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {document.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {isArabic ? "لا توجد وثائق" : "No documents found"}
              </p>
              <p className="text-gray-400 text-sm">
                {isArabic
                  ? "جرب تعديل معايير البحث"
                  : "Try adjusting your search criteria"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "رفع وثيقة جديدة" : "Upload New Document"}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الموظف" : "Employee"}
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">
                    {isArabic ? "اختر الموظف" : "Select Employee"}
                  </option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {isArabic
                        ? emp.personalInfo.fullNameAr
                        : emp.personalInfo.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نوع الوثيقة" : "Document Type"}
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">
                    {isArabic ? "اختر النوع" : "Select Type"}
                  </option>
                  {documentTypes.map((type) => (
                    <option key={type.type} value={type.type}>
                      {isArabic ? type.nameAr : type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "اسم الوثيقة" : "Document Name"}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder={
                    isArabic ? "أدخل اسم الوثيقة" : "Enter document name"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "تاريخ الانتهاء" : "Expiry Date"}
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "رفع الملف" : "Upload File"}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {isArabic
                      ? "اسحب الملف هنا أو انقر للاختيار"
                      : "Drag file here or click to select"}
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) =>
                      handleFileUpload(e.target.files, "other", "default")
                    }
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <p className="text-sm text-gray-500 mt-1">
                      PDF, DOC, JPG, PNG (Max 10MB)
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Save className="w-4 h-4" />
                  {isArabic ? "رفع الوثيقة" : "Upload Document"}
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "عرض الوثيقة" : "Document Viewer"}
              </h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {selectedDocument.name}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        {isArabic ? "الموظف:" : "Employee:"}{" "}
                        {selectedDocument.employeeName}
                      </div>
                      <div>
                        {isArabic ? "النوع:" : "Type:"} {selectedDocument.type}
                      </div>
                      <div>
                        {isArabic ? "الحجم:" : "Size:"}{" "}
                        {(selectedDocument.fileSize / 1024).toFixed(1)} KB
                      </div>
                      <div>
                        {isArabic ? "رفع في:" : "Uploaded:"}{" "}
                        {selectedDocument.uploadDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {isArabic ? "الحالة:" : "Status:"}
                        </span>
                        <span
                          className={`font-medium ${
                            selectedDocument.approvalStatus === "approved"
                              ? "text-green-600"
                              : selectedDocument.approvalStatus === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedDocument.approvalStatus}
                        </span>
                      </div>
                      {selectedDocument.expiryDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {isArabic ? "ينتهي في:" : "Expires:"}
                          </span>
                          <span
                            className={
                              getExpiryStatus(selectedDocument.expiryDate).color
                            }
                          >
                            {selectedDocument.expiryDate}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {isArabic ? "مستوى الوصول:" : "Access Level:"}
                        </span>
                        <span className="font-medium">
                          {selectedDocument.accessLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-center">
                  {isArabic
                    ? "معاينة الوثيقة ستظهر هنا في التطبيق الفعلي"
                    : "Document preview would be displayed here in the actual application"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
