import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import {
  useDepartments,
  useEnums,
  useEmployeeActions,
} from "../../hooks/useEmployees";

const FormSection = ({ title, icon: Icon, children, isArabic }) => (
  <div className="border border-gray-200 rounded-lg p-6 space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-blue-600" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const FormField = ({ label, error, children, required = false, isArabic }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
        <AlertTriangle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const EmployeeForm = ({
  employee = null,
  onSave,
  onClose,
  isArabic = false,
}) => {
  const isEditing = Boolean(employee);

  // Use custom hooks for data fetching and actions
  const {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
  } = useDepartments();
  const {
    employeeRoles,
    nationalities,
    teams,
    loading: enumsLoading,
    error: enumsError,
  } = useEnums();
  const {
    createEmployee,
    loading: actionLoading,
    error: actionError,
  } = useEmployeeActions();

  // Combined loading state
  const apiLoading = departmentsLoading || enumsLoading;

  function decimalToNumber(value) {
    if (!value) return null;

    // If it’s a BSON Decimal128 object
    if (typeof value.toString === "function" && value._bsontype === "Decimal128") {
      return parseFloat(value.toString());
    }

    // If it’s the raw JSON form { $numberDecimal: "10000" }
    if (value.$numberDecimal) {
      return parseFloat(value.$numberDecimal);
    }

    // Already a number or string
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseFloat(value);

    return null;
  }


  const [formData, setFormData] = useState({
    // Personal Information
    firstName: employee?.personalInfo?.firstName || "",
    lastName: employee?.personalInfo?.lastName || "",
    fullNameAr: employee?.personalInfo?.fullNameAr || "",
    dateOfBirth: employee?.personalInfo?.dateOfBirth || "",
    nationality: employee?.personalInfo?.nationality || "",
    nationalId: employee?.personalInfo?.nationalId || "",
    maritalStatus: employee?.personalInfo?.maritalStatus || "",
    gender: employee?.personalInfo?.gender || "",
    personalPhone: employee?.personalInfo?.personalPhone || "",
    personalEmail: employee?.personalInfo?.personalEmail || "",

    // Address
    street: employee?.personalInfo?.homeAddress?.street || "",
    city: employee?.personalInfo?.homeAddress?.city || "",
    state: employee?.personalInfo?.homeAddress?.state || "",
    postalCode: employee?.personalInfo?.homeAddress?.postalCode || "",
    country: employee?.personalInfo?.homeAddress?.country || "Saudi Arabia",

    // Professional Information
    jobTitle: employee?.professionalInfo?.jobTitle || "",
    jobTitleAr: employee?.professionalInfo?.jobTitleAr || "",
    departmentId: employee?.professionalInfo?.departmentId?._id || "",
    employmentType: employee?.professionalInfo?.employmentType || "full-time",
    workLocation: employee?.professionalInfo?.workLocation || "",
    hireDate: employee?.professionalInfo?.hireDate || "",
    workEmail: employee?.professionalInfo?.workEmail || "",
    workPhone: employee?.professionalInfo?.workPhone || "",

    // Salary Information
    baseSalary: employee?.professionalInfo?.salaryInfo?.baseSalary || 0,
    hourly_rate: employee?.professionalInfo?.salaryInfo?.hourly_rate || 0,
    actual_rate: employee?.professionalInfo?.salaryInfo?.actual_rate || 0,
    overtimeMultiplier: employee?.professionalInfo?.salaryInfo?.overtimeMultiplier || 0,
    currency: employee?.professionalInfo?.salaryInfo?.currency || "SAR",

    // Emergency Contact
    emergencyName: employee?.emergencyContacts?.[0]?.name || "",
    emergencyRelationship: employee?.emergencyContacts?.[0]?.relationship || "",
    emergencyPhone: employee?.emergencyContacts?.[0]?.phone || "",
    emergencyEmail: employee?.emergencyContacts?.[0]?.email || "",

    // Status
    status: employee?.status || "active",

    // pass team Id
    teamId: employee?.team_id,

  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    const requiredFields = [
      "firstName",
      "lastName",
      "nationalId",
      "personalPhone",
      "personalEmail",
      "jobTitle",
      "departmentId",
      "hireDate",
      "workEmail",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = isArabic
          ? "هذا الحقل مطلوب"
          : "This field is required";
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.personalEmail && !emailRegex.test(formData.personalEmail)) {
      newErrors.personalEmail = isArabic
        ? "البريد الإلكتروني غير صحيح"
        : "Invalid email format";
    }
    if (formData.workEmail && !emailRegex.test(formData.workEmail)) {
      newErrors.workEmail = isArabic
        ? "البريد الإلكتروني غير صحيح"
        : "Invalid email format";
    }

    // Phone validation - Updated logic to match your backend expectation
    // const phoneRegex = /^\+966[0-9]{9}$/;
    // if (formData.personalPhone && !phoneRegex.test(formData.personalPhone)) {
    //   newErrors.personalPhone = isArabic ? 'رقم الهاتف يجب أن يبدأ بـ +966' : 'Phone number must start with +966';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }
    try {
      const employeeData = {
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: `${formData.firstName} ${formData.lastName}`,
          fullNameAr: formData.fullNameAr,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          nationalId: formData.nationalId,
          maritalStatus: formData.maritalStatus,
          gender: formData.gender,
          personalPhone: formData.personalPhone,
          personalEmail: formData.personalEmail,
          homeAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        },
        professionalInfo: {
          jobTitle: formData.jobTitle,
          jobTitleAr: formData.jobTitleAr,
          departmentId: formData.departmentId,
          employmentType: formData.employmentType,
          workLocation: formData.workLocation,
          hireDate: formData.hireDate,
          workEmail: formData.workEmail,
          workPhone: formData.workPhone,
          salaryInfo: {
            baseSalary: parseFloat(formData.baseSalary) || 0,
            hourly_rate: parseFloat(formData?.hourly_rate) || 0,
            actual_rate: parseFloat(formData?.actual_rate) || 0,
            overtimeMultiplier: parseFloat(formData?.overtimeMultiplier) || 0,
            currency: formData.currency,
          },
        },
        emergencyContacts: formData.emergencyName
          ? [
            {
              name: formData.emergencyName,
              relationship: formData.emergencyRelationship,
              phone: formData.emergencyPhone,
              email: formData.emergencyEmail,
              isPrimary: true,
            },
          ]
          : [],
        status: formData.status,
        teamId: formData.teamId, // Include teamId
      };
      await onSave(employeeData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  if (apiLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isArabic ? "جاري التحميل..." : "Loading..."}
          </p>
          {(departmentsError || enumsError) && (
            <p className="text-red-500 text-sm mt-2">
              {isArabic ? "خطأ في تحميل البيانات" : "Error loading data"}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEditing
              ? isArabic
                ? "تعديل موظف"
                : "Edit Employee"
              : isArabic
                ? "إضافة موظف جديد"
                : "Add New Employee"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
            disabled={actionLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          {/* Display any action errors */}
          {actionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  {isArabic ? "حدث خطأ: " : "Error: "}
                  {actionError}
                </span>
              </div>
            </div>
          )}
          {/* Personal Information */}
          <FormSection
            title={isArabic ? "المعلومات الشخصية" : "Personal Information"}
            icon={User}
            isArabic={isArabic}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={isArabic ? "الاسم الأول" : "First Name"}
                required
                error={errors.firstName}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل الاسم الأول" : "Enter first name"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "اسم العائلة" : "Last Name"}
                required
                error={errors.lastName}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل اسم العائلة" : "Enter last name"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "الاسم بالعربية" : "Arabic Name"}
                error={errors.fullNameAr}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.fullNameAr}
                  onChange={(e) =>
                    handleInputChange("fullNameAr", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل الاسم بالعربية" : "Enter Arabic name"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "تاريخ الميلاد" : "Date of Birth"}
                error={errors.dateOfBirth}
                isArabic={isArabic}
              >
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </FormField>

              <FormField
                label={isArabic ? "الجنسية" : "Nationality"}
                error={errors.nationality}
                isArabic={isArabic}
              >
                <select
                  value={formData.nationality}
                  onChange={(e) =>
                    handleInputChange("nationality", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {isArabic ? "اختر الجنسية" : "Select Nationality"}
                  </option>
                  {nationalities.map((nationality) => (
                    <option key={nationality.key} value={nationality.value}>
                      {nationality.value}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label={isArabic ? "رقم الهوية" : "National ID"}
                required
                error={errors.nationalId}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) =>
                    handleInputChange("nationalId", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل رقم الهوية" : "Enter national ID"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "الحالة الاجتماعية" : "Marital Status"}
                error={errors.maritalStatus}
                isArabic={isArabic}
              >
                <select
                  value={formData.maritalStatus}
                  onChange={(e) =>
                    handleInputChange("maritalStatus", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {isArabic
                      ? "اختر الحالة الاجتماعية"
                      : "Select Marital Status"}
                  </option>
                  <option value="single">{isArabic ? "أعزب" : "Single"}</option>
                  <option value="married">
                    {isArabic ? "متزوج" : "Married"}
                  </option>
                  <option value="divorced">
                    {isArabic ? "مطلق" : "Divorced"}
                  </option>
                  <option value="widowed">
                    {isArabic ? "أرمل" : "Widowed"}
                  </option>
                </select>
              </FormField>

              <FormField
                label={isArabic ? "الجنس" : "Gender"}
                error={errors.gender}
                isArabic={isArabic}
              >
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {isArabic ? "اختر الجنس" : "Select Gender"}
                  </option>
                  <option value="male">{isArabic ? "ذكر" : "Male"}</option>
                  <option value="female">{isArabic ? "أنثى" : "Female"}</option>
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={isArabic ? "الهاتف الشخصي" : "Personal Phone"}
                required
                error={errors.personalPhone}
                isArabic={isArabic}
              >
                <input
                  type="tel"
                  value={formData.personalPhone}
                  onChange={(e) =>
                    handleInputChange("personalPhone", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+966501234567"
                />
              </FormField>

              <FormField
                label={isArabic ? "البريد الإلكتروني الشخصي" : "Personal Email"}
                required
                error={errors.personalEmail}
                isArabic={isArabic}
              >
                <input
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) =>
                    handleInputChange("personalEmail", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "example@email.com" : "example@email.com"
                  }
                />
              </FormField>
            </div>
          </FormSection>

          {/* Professional Information */}
          <FormSection
            title={isArabic ? "المعلومات المهنية" : "Professional Information"}
            icon={Briefcase}
            isArabic={isArabic}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={isArabic ? "المسمى الوظيفي" : "Job Title"}
                required
                error={errors.jobTitle}
                isArabic={isArabic}
              >
                <select
                  value={formData.jobTitle}
                  onChange={(e) =>
                    handleInputChange("jobTitle", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {isArabic ? "اختر المسمى الوظيفي" : "Select Job Title"}
                  </option>
                  {employeeRoles.map((role) => (
                    <option key={role.key} value={role.value}>
                      {role.value}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label={
                  isArabic ? "المسمى الوظيفي بالعربية" : "Job Title (Arabic)"
                }
                error={errors.jobTitleAr}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.jobTitleAr}
                  onChange={(e) =>
                    handleInputChange("jobTitleAr", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic
                      ? "أدخل المسمى الوظيفي بالعربية"
                      : "Enter Arabic job title"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "القسم" : "Department"}
                required
                error={errors.departmentId}
                isArabic={isArabic}
              >
                <select
                  value={formData.departmentId}
                  onChange={(e) =>
                    handleInputChange("departmentId", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {isArabic ? "اختر القسم" : "Select Department"}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {isArabic ? dept.nameAr : dept.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label={isArabic ? "نوع التوظيف" : "Employment Type"}
                error={errors.employmentType}
                isArabic={isArabic}
              >
                <select
                  value={formData.employmentType}
                  onChange={(e) =>
                    handleInputChange("employmentType", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="full-time">
                    {isArabic ? "دوام كامل" : "Full Time"}
                  </option>
                  <option value="part-time">
                    {isArabic ? "دوام جزئي" : "Part Time"}
                  </option>
                  <option value="contract">
                    {isArabic ? "تعاقد" : "Contract"}
                  </option>
                  <option value="temporary">
                    {isArabic ? "مؤقت" : "Temporary"}
                  </option>
                </select>
              </FormField>

              <FormField
                label={isArabic ? "موقع العمل" : "Work Location"}
                error={errors.workLocation}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.workLocation}
                  onChange={(e) =>
                    handleInputChange("workLocation", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل موقع العمل" : "Enter work location"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "تاريخ التوظيف" : "Hire Date"}
                required
                error={errors.hireDate}
                isArabic={isArabic}
              >
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    handleInputChange("hireDate", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </FormField>

              <FormField
                label={isArabic ? "البريد الإلكتروني للعمل" : "Work Email"}
                required
                error={errors.workEmail}
                isArabic={isArabic}
              >
                <input
                  type="email"
                  value={formData.workEmail}
                  onChange={(e) =>
                    handleInputChange("workEmail", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "employee@company.com" : "employee@company.com"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "هاتف العمل" : "Work Phone"}
                error={errors.workPhone}
                isArabic={isArabic}
              >
                <input
                  type="tel"
                  value={formData.workPhone}
                  onChange={(e) =>
                    handleInputChange("workPhone", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+966112345678"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label={isArabic ? "الراتب الأساسي" : "Base Salary"}
                error={errors.baseSalary}
                isArabic={isArabic}
              >
                <input
                  type="number"
                  value={decimalToNumber(formData.baseSalary)}
                  onChange={(e) =>
                    handleInputChange("baseSalary", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </FormField>

              <FormField
                label={isArabic ? "الراتب الأساسي" : "Hourly Salary"}
                error={errors.hourly_rate}
                isArabic={isArabic}
              >
                <input
                  type="number"
                  value={decimalToNumber(formData.hourly_rate)}
                  onChange={(e) =>
                    handleInputChange("hourly_rate", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </FormField>

              <FormField
                label={isArabic ? "الراتب الأساسي" : "Actual Salary"}
                error={errors.actual_rate}
                isArabic={isArabic}
              >
                <input
                  type="number"
                  value={decimalToNumber(formData.actual_rate)}
                  onChange={(e) =>
                    handleInputChange("actual_rate", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </FormField>

              <FormField
                label={isArabic ? "الراتب الأساسي" : "OvertimeMultiplier Salary"}
                error={errors.overtimeMultiplier}
                isArabic={isArabic}
              >
                <input
                  type="number"
                  value={decimalToNumber(formData.overtimeMultiplier)}
                  onChange={(e) =>
                    handleInputChange("overtimeMultiplier", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </FormField>

              <FormField
                label={isArabic ? "العملة" : "Currency"}
                error={errors.currency}
                isArabic={isArabic}
              >
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </FormField>

              <FormField
                label={isArabic ? "الحالة" : "Status"}
                error={errors.status}
                isArabic={isArabic}
              >
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">{isArabic ? "نشط" : "Active"}</option>
                  <option value="inactive">
                    {isArabic ? "غير نشط" : "Inactive"}
                  </option>
                  <option value="on-leave">
                    {isArabic ? "في إجازة" : "On Leave"}
                  </option>
                </select>
              </FormField>
            </div>
          </FormSection>

          {/* Address Information */}
          <FormSection
            title={isArabic ? "العنوان" : "Address Information"}
            icon={MapPin}
            isArabic={isArabic}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={isArabic ? "الشارع" : "Street"}
                error={errors.street}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل اسم الشارع" : "Enter street name"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "المدينة" : "City"}
                error={errors.city}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل اسم المدينة" : "Enter city name"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "المنطقة" : "State/Province"}
                error={errors.state}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل اسم المنطقة" : "Enter state/province"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "الرمز البريدي" : "Postal Code"}
                error={errors.postalCode}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل الرمز البريدي" : "Enter postal code"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "الدولة" : "Country"}
                error={errors.country}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل اسم الدولة" : "Enter country name"
                  }
                />
              </FormField>
            </div>
          </FormSection>

          {/* Emergency Contact */}
          <FormSection
            title={isArabic ? "جهة الاتصال للطوارئ" : "Emergency Contact"}
            icon={Phone}
            isArabic={isArabic}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={isArabic ? "اسم جهة الاتصال" : "Contact Name"}
                error={errors.emergencyName}
                isArabic={isArabic}
              >
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) =>
                    handleInputChange("emergencyName", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    isArabic ? "أدخل اسم جهة الاتصال" : "Enter contact name"
                  }
                />
              </FormField>

              <FormField
                label={isArabic ? "صلة القرابة" : "Relationship"}
                error={errors.emergencyRelationship}
                isArabic={isArabic}
              >
                <select
                  value={formData.emergencyRelationship}
                  onChange={(e) =>
                    handleInputChange("emergencyRelationship", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {isArabic ? "اختر صلة القرابة" : "Select relationship"}
                  </option>
                  <option value="Spouse">
                    {isArabic ? "الزوج/الزوجة" : "Spouse"}
                  </option>
                  <option value="Parent">
                    {isArabic ? "والد/والدة" : "Parent"}
                  </option>
                  <option value="Sibling">
                    {isArabic ? "أخ/أخت" : "Sibling"}
                  </option>
                  <option value="Child">
                    {isArabic ? "ابن/ابنة" : "Child"}
                  </option>
                  <option value="Friend">{isArabic ? "صديق" : "Friend"}</option>
                  <option value="Other">{isArabic ? "أخرى" : "Other"}</option>
                </select>
              </FormField>

              <FormField
                label={isArabic ? "هاتف الطوارئ" : "Emergency Phone"}
                error={errors.emergencyPhone}
                isArabic={isArabic}
              >
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) =>
                    handleInputChange("emergencyPhone", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+966501234567"
                />
              </FormField>

              <FormField
                label={isArabic ? "بريد جهة الاتصال" : "Emergency Email"}
                error={errors.emergencyEmail}
                isArabic={isArabic}
              >
                <input
                  type="email"
                  value={formData.emergencyEmail}
                  onChange={(e) =>
                    handleInputChange("emergencyEmail", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="emergency@email.com"
                />
              </FormField>
            </div>
          </FormSection>

          {/* Teams Section */}
          <FormSection
            title={isArabic ? "العنوان" : "Teams Information"}
            icon={MapPin}
            isArabic={isArabic}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={isArabic ? "الجنسية" : "Teams"}
                error={errors.teams}
                isArabic={isArabic}
              >
                <select
                  value={formData.teamId}
                  onChange={(e) =>
                    handleInputChange("teamId", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {isArabic ? "اختر الفريق" : "Select Team"}
                  </option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.nameEn}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </FormSection>


        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={actionLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {actionLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isArabic ? "جاري الحفظ..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isArabic ? "حفظ" : "Save"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
