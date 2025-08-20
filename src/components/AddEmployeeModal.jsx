import React, { useState } from "react";
import { X, Save } from "lucide-react";

const AddEmployeeModal = ({ isArabic, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    position: "",
    department: "Operations",
    hireDate: "",
    iqamaNumber: "",
    iqamaExpiry: "",
    gosiStatus: "Active",
    salary: "",
    performance: "Good",
    trainingStatus: "Needs Update",
    email: "",
    phone: "",
    location: "",
    manager: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = isArabic ? "الاسم بالإنجليزية مطلوب" : "English name is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = isArabic ? "المنصب مطلوب" : "Position is required";
    }

    if (!formData.iqamaNumber.trim()) {
      newErrors.iqamaNumber = isArabic ? "رقم الإقامة مطلوب" : "Iqama number is required";
    } else if (!/^\d{10}$/.test(formData.iqamaNumber)) {
      newErrors.iqamaNumber = isArabic ? "رقم الإقامة يجب أن يكون 10 أرقام" : "Iqama number must be 10 digits";
    }

    if (!formData.email.trim()) {
      newErrors.email = isArabic ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isArabic ? "البريد الإلكتروني غير صحيح" : "Invalid email format";
    }

    if (formData.phone && !/^(\+966|966|0)?[0-9]{9}$/.test(formData.phone.replace(/\s|-/g, ""))) {
      newErrors.phone = isArabic ? "رقم الهاتف غير صحيح" : "Invalid phone number";
    }

    if (formData.salary && (isNaN(formData.salary) || parseFloat(formData.salary) < 0)) {
      newErrors.salary = isArabic ? "الراتب يجب أن يكون رقم موجب" : "Salary must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const employeeData = {
      ...formData,
      salary: formData.salary ? parseFloat(formData.salary) : 0,
      id: Date.now(), // Temporary ID generation
    };

    onSave(employeeData);
  };

  const departments = [
    { value: "Operations", labelEn: "Operations", labelAr: "العمليات" },
    { value: "Human Resources", labelEn: "Human Resources", labelAr: "الموارد البشرية" },
    { value: "Finance", labelEn: "Finance", labelAr: "المالية" },
    { value: "Maintenance", labelEn: "Maintenance", labelAr: "الصيانة" },
    { value: "Safety", labelEn: "Safety", labelAr: "السلامة" },
  ];

  const performanceOptions = [
    { value: "Excellent", labelEn: "Excellent", labelAr: "ممتاز" },
    { value: "Good", labelEn: "Good", labelAr: "جيد" },
    { value: "Average", labelEn: "Average", labelAr: "متوسط" },
    { value: "Needs Improvement", labelEn: "Needs Improvement", labelAr: "يحتاج تحسين" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {isArabic ? "إضافة موظف جديد" : "Add New Employee"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {isArabic ? "المعلومات الشخصية" : "Personal Information"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الاسم (إنجليزي)" : "Name (English)"} *
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => handleChange("nameEn", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.nameEn ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
                {errors.nameEn && <p className="text-red-500 text-sm mt-1">{errors.nameEn}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الاسم (عربي)" : "Name (Arabic)"}
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => handleChange("nameAr", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="جون دو"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "رقم الإقامة" : "Iqama Number"} *
                </label>
                <input
                  type="text"
                  value={formData.iqamaNumber}
                  onChange={(e) => handleChange("iqamaNumber", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.iqamaNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="2123456789"
                  maxLength="10"
                />
                {errors.iqamaNumber && <p className="text-red-500 text-sm mt-1">{errors.iqamaNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "انتهاء الإقامة" : "Iqama Expiry"}
                </label>
                <input
                  type="date"
                  value={formData.iqamaExpiry}
                  onChange={(e) => handleChange("iqamaExpiry", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {isArabic ? "معلومات الاتصال" : "Contact Information"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "البريد الإلكتروني" : "Email"} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="john.doe@amoagc.sa"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "رقم الهاتف" : "Phone Number"}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+966501234567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {isArabic ? "معلومات الوظيفة" : "Job Information"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المنصب" : "Position"} *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.position ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Site Supervisor"
                />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "القسم" : "Department"}
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {isArabic ? dept.labelAr : dept.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "تاريخ التوظيف" : "Hire Date"}
                </label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => handleChange("hireDate", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الراتب (ريال)" : "Salary (SAR)"}
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleChange("salary", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.salary ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="4500"
                  min="0"
                />
                {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "موقع العمل" : "Work Location"}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Dhahran Site"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المدير المباشر" : "Direct Manager"}
                </label>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => handleChange("manager", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Operations Manager"
                />
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {isArabic ? "معلومات الحالة" : "Status Information"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "حالة التأمينات" : "GOSI Status"}
                </label>
                <select
                  value={formData.gosiStatus}
                  onChange={(e) => handleChange("gosiStatus", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Active">{isArabic ? "نشط" : "Active"}</option>
                  <option value="Pending">{isArabic ? "معلق" : "Pending"}</option>
                  <option value="Inactive">{isArabic ? "غير نشط" : "Inactive"}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "تقييم الأداء" : "Performance Rating"}
                </label>
                <select
                  value={formData.performance}
                  onChange={(e) => handleChange("performance", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {performanceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {isArabic ? option.labelAr : option.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "حالة التدريب" : "Training Status"}
                </label>
                <select
                  value={formData.trainingStatus}
                  onChange={(e) => handleChange("trainingStatus", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Up to Date">{isArabic ? "محدث" : "Up to Date"}</option>
                  <option value="Needs Update">{isArabic ? "يحتاج تحديث" : "Needs Update"}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            disabled={loading}
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isArabic ? "حفظ الموظف" : "Save Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;