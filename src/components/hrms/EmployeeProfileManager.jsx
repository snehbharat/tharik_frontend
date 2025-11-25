import React, { useState } from "react";
import {
  X,
  User,
  Briefcase,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Heart,
  Shield,
  Edit,
  Save,
  Camera,
  Download,
  Upload,
  Star,
  Target,
  Clock,
  DollarSign,
  Globe,
  Home,
  Building2,
  Plus,
} from "lucide-react";

export const EmployeeProfileManager = ({ employee, onClose, isArabic }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  console.log("employee", employee);

  const formatCurrency = (amount, currency = "SAR") => {
    // Handle MongoDB Decimal128 object or normal number
    const numericAmount =
      typeof amount === "object" && amount?.$numberDecimal
        ? parseFloat(amount.$numberDecimal)
        : Number(amount) || 0;

    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

  const calculateTenure = (hireDate) => {
    const hire = new Date(hireDate);
    const now = new Date();
    const years = now.getFullYear() - hire.getFullYear();
    const months = now.getMonth() - hire.getMonth();

    if (years > 0) {
      return `${years} ${isArabic ? "سنة" : "years"} ${
        months > 0 ? `${months} ${isArabic ? "شهر" : "months"}` : ""
      }`;
    }
    return `${months} ${isArabic ? "شهر" : "months"}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "terminated":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="relative">
              {employee.photo ? (
                <img
                  src={employee.photo}
                  alt={employee.personalInfo.fullName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {employee.personalInfo.firstName.charAt(0)}
                  {employee.personalInfo.lastName.charAt(0)}
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isArabic
                  ? employee.personalInfo.fullNameAr
                  : employee.personalInfo.fullName}
              </h2>
              <p className="text-gray-600">
                {employee.employeeId} • {employee.professionalInfo.jobTitle}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                    employee.status
                  )}`}
                >
                  {employee.status}
                </span>
                <span className="text-sm text-gray-500">
                  {isArabic ? "مدة الخدمة:" : "Tenure:"}{" "}
                  {calculateTenure(employee.professionalInfo.hireDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {isEditing ? (
                <Save className="w-4 h-4" />
              ) : (
                <Edit className="w-4 h-4" />
              )}
              {isEditing
                ? isArabic
                  ? "حفظ"
                  : "Save"
                : isArabic
                ? "تعديل"
                : "Edit"}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "personal"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {isArabic ? "المعلومات الشخصية" : "Personal Information"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("professional")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "professional"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {isArabic ? "المعلومات المهنية" : "Professional Information"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "documents"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isArabic ? "الوثائق" : "Documents"}
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {employee.documents.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "performance"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? "الأداء" : "Performance"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("emergency")}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "emergency"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {isArabic ? "جهات الاتصال الطارئة" : "Emergency Contacts"}
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "personal" && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  {isArabic ? "المعلومات الأساسية" : "Basic Information"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "الاسم الكامل" : "Full Name"}
                      </label>
                      <div className="text-gray-900 font-medium">
                        {isArabic
                          ? employee.personalInfo.fullNameAr
                          : employee.personalInfo.fullName}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "تاريخ الميلاد" : "Date of Birth"}
                      </label>
                      <div className="text-gray-900">
                        {new Date(
                          employee.personalInfo.dateOfBirth
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "الجنسية" : "Nationality"}
                      </label>
                      <div className="text-gray-900">
                        {employee.personalInfo.nationality}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "الحالة الاجتماعية" : "Marital Status"}
                      </label>
                      <div className="text-gray-900 capitalize">
                        {employee.personalInfo.maritalStatus}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "رقم الهوية" : "National ID"}
                      </label>
                      <div className="text-gray-900 font-mono">
                        {employee.personalInfo.nationalId}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "الجنس" : "Gender"}
                      </label>
                      <div className="text-gray-900 capitalize">
                        {employee.personalInfo.gender}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "رقم الجواز" : "Passport Number"}
                      </label>
                      <div className="text-gray-900 font-mono">
                        {employee.personalInfo.passportNumber ||
                          (isArabic ? "غير متوفر" : "Not provided")}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "فصيلة الدم" : "Blood Type"}
                      </label>
                      <div className="text-gray-900">
                        {employee.personalInfo.bloodType ||
                          (isArabic ? "غير متوفر" : "Not provided")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  {isArabic ? "معلومات الاتصال" : "Contact Information"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "الهاتف الشخصي" : "Personal Phone"}
                        </div>
                        <div className="text-gray-900 font-medium">
                          {employee.personalInfo.personalPhone}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "البريد الشخصي" : "Personal Email"}
                        </div>
                        <div className="text-gray-900">
                          {employee.personalInfo.personalEmail ||
                            (isArabic ? "غير متوفر" : "Not provided")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Home className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "العنوان المنزلي" : "Home Address"}
                        </div>
                        <div className="text-gray-900">
                          {employee.personalInfo.homeAddress.street}
                          <br />
                          {employee.personalInfo.homeAddress.city},{" "}
                          {employee.personalInfo.homeAddress.state}
                          <br />
                          {employee.personalInfo.homeAddress.postalCode},{" "}
                          {employee.personalInfo.homeAddress.country}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  {isArabic ? "اللغات" : "Languages"}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {employee.personalInfo.languages.map((lang, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div className="font-medium text-gray-900">
                        {lang.language}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {lang.proficiency}
                      </div>
                      {lang.certified && (
                        <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {isArabic ? "معتمد" : "Certified"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "professional" && (
            <div className="space-y-6">
              {/* Job Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  {isArabic ? "معلومات الوظيفة" : "Job Information"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "المسمى الوظيفي" : "Job Title"}
                      </label>
                      <div className="text-gray-900 font-medium">
                        {isArabic
                          ? employee.professionalInfo.jobTitleAr
                          : employee.professionalInfo.jobTitle}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "نوع التوظيف" : "Employment Type"}
                      </label>
                      <div className="text-gray-900 capitalize">
                        {employee.professionalInfo.employmentType}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "تاريخ التوظيف" : "Hire Date"}
                      </label>
                      <div className="text-gray-900">
                        {new Date(
                          employee.professionalInfo.hireDate
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "موقع العمل" : "Work Location"}
                      </label>
                      <div className="text-gray-900">
                        {employee.professionalInfo.workLocation}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "البريد الإلكتروني للعمل" : "Work Email"}
                      </label>
                      <div className="text-gray-900">
                        {employee.professionalInfo.workEmail}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? "هاتف العمل" : "Work Phone"}
                      </label>
                      <div className="text-gray-900">
                        {employee.professionalInfo.workPhone ||
                          (isArabic ? "غير متوفر" : "Not provided")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  {isArabic ? "معلومات الراتب" : "Salary Information"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600">
                      {isArabic ? "الراتب الأساسي" : "Base Salary"}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        employee.professionalInfo.salaryInfo.baseSalary,
                        employee.professionalInfo.salaryInfo.currency
                      )}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {employee.professionalInfo.salaryInfo.payFrequency}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600">
                      {isArabic ? "البدلات" : "Allowances"}
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(
                        employee.professionalInfo.salaryInfo.allowances.reduce(
                          (sum, allowance) => sum + allowance.amount,
                          0
                        ),
                        employee.professionalInfo.salaryInfo.currency
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {employee.professionalInfo.salaryInfo.allowances.length}{" "}
                      {isArabic ? "بدل" : "allowances"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600">
                      {isArabic ? "إجمالي الراتب" : "Total Compensation"}
                    </div>
                    <div className="text-xl font-bold text-purple-600">
                      {formatCurrency(
                        employee.professionalInfo.salaryInfo.baseSalary +
                          employee.professionalInfo.salaryInfo.allowances.reduce(
                            (sum, allowance) => sum + allowance.amount,
                            0
                          ),
                        employee.professionalInfo.salaryInfo.currency
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {isArabic ? "شامل البدلات" : "Including allowances"}
                    </div>
                  </div>
                </div>

                {/* Allowances Details */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {isArabic ? "تفاصيل البدلات" : "Allowance Details"}
                  </h4>
                  <div className="space-y-2">
                    {employee.professionalInfo.salaryInfo.allowances.map(
                      (allowance, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-white rounded border border-gray-200"
                        >
                          <span className="text-gray-900">
                            {allowance.type}
                          </span>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {formatCurrency(
                                allowance.amount,
                                employee.professionalInfo.salaryInfo.currency
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {allowance.isRecurring
                                ? isArabic
                                  ? "شهري"
                                  : "Monthly"
                                : isArabic
                                ? "مرة واحدة"
                                : "One-time"}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {isArabic ? "المزايا" : "Benefits"}
                  </h4>
                  <div className="space-y-2">
                    {employee.professionalInfo.salaryInfo.benefits.map(
                      (benefit, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-white rounded border border-gray-200"
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {benefit.type}
                            </div>
                            <div className="text-sm text-gray-600">
                              {benefit.description}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {isArabic ? "فعال من" : "Effective from"}{" "}
                            {new Date(
                              benefit.effectiveDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Work Schedule */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  {isArabic ? "جدول العمل" : "Work Schedule"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "نوع الجدول:" : "Schedule Type:"}
                      </span>
                      <span className="font-medium text-gray-900 capitalize">
                        {employee?.professionalInfo?.workSchedule
                          ?.scheduleType || ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "وقت البداية:" : "Start Time:"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {employee?.professionalInfo?.workSchedule?.startTime ||
                          ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "وقت الانتهاء:" : "End Time:"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {employee?.professionalInfo?.workSchedule?.endTime ||
                          ""}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "مدة الاستراحة:" : "Break Duration:"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {employee?.professionalInfo?.workSchedule
                          ?.breakDuration || ""}
                        {employee?.professionalInfo?.workSchedule?.breakDuration
                          ? ` ${isArabic ? "دقيقة" : "minutes"}`
                          : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "أيام العمل:" : "Working Days:"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {employee?.professionalInfo?.workSchedule?.workingDays
                          ?.length || 0}{" "}
                        {isArabic ? "أيام" : "days"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {isArabic ? "العمل الإضافي:" : "Overtime Eligible:"}
                      </span>
                      <span
                        className={`font-medium ${
                          employee?.professionalInfo?.workSchedule
                            ?.overtimeEligible
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {employee?.professionalInfo?.workSchedule
                          ?.overtimeEligible
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
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "وثائق الموظف" : "Employee Documents"}
                </h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  {isArabic ? "رفع وثيقة" : "Upload Document"}
                </button>
              </div>

              <div className="grid gap-4">
                {employee.documents.map((document) => (
                  <div
                    key={document.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {document.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {document.type} • {document.category} •{" "}
                            {(document.fileSize / 1024).toFixed(1)} KB
                          </div>
                          <div className="text-sm text-gray-500">
                            {isArabic ? "رفع في" : "Uploaded on"}{" "}
                            {document.uploadDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {document.expiryDate && (
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {isArabic ? "ينتهي في" : "Expires"}
                            </div>
                            <div className="text-sm font-medium text-red-600">
                              {document.expiryDate}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 p-1 rounded">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {document.tags.length > 0 && (
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
                ))}
              </div>
            </div>
          )}

          {activeTab === "emergency" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "جهات الاتصال الطارئة" : "Emergency Contacts"}
                </h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  {isArabic ? "إضافة جهة اتصال" : "Add Contact"}
                </button>
              </div>

              <div className="grid gap-4">
                {employee.emergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            contact.isPrimary ? "bg-red-600" : "bg-gray-600"
                          }`}
                        >
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {contact.relationship}
                          </div>
                          {contact.isPrimary && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              {isArabic
                                ? "جهة الاتصال الأساسية"
                                : "Primary Contact"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800 p-1 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{contact.phone}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900">{contact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  {isArabic ? "نظرة عامة على الأداء" : "Performance Overview"}
                </h3>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض تفاصيل الأداء والتطوير المهني هنا..."
                    : "Performance reviews, goals, and professional development details will be displayed here..."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
