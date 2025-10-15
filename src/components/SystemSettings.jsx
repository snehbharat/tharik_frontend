import React, { useState, useEffect, useRef } from "react";
import { Save, Settings, Upload, X, Image as ImageIcon } from "lucide-react";
import {
  getCompany,
  updateCompany,
  deleteCompanyImage,
  getImageUrl,
} from "../services/CompanyService";

export const SystemSettings = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("settings");
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCompany();
        setSellerInfo(data);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert(
          isArabic
            ? "يرجى تحميل صورة صالحة (JPEG, PNG, GIF, WEBP)"
            : "Please upload a valid image (JPEG, PNG, GIF, WEBP)"
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(
          isArabic
            ? "حجم الصورة يجب أن يكون أقل من 5 ميجابايت"
            : "Image size must be less than 5MB"
        );
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    if (sellerInfo?.companyImage) {
      const confirmDelete = window.confirm(
        isArabic
          ? "هل أنت متأكد من حذف شعار الشركة؟"
          : "Are you sure you want to delete the company logo?"
      );

      if (confirmDelete) {
        try {
          await deleteCompanyImage();
          setImagePreview(null);
          setImageFile(null);
          setSellerInfo({ ...sellerInfo, companyImage: null });
          alert(isArabic ? "تم حذف الشعار بنجاح" : "Logo deleted successfully");
        } catch (error) {
          console.error("Failed to delete image", error);
          alert(isArabic ? "فشل حذف الشعار" : "Failed to delete logo");
        }
      }
    } else {
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveCompanyDetails = async () => {
    try {
      setUploading(true);
      
      console.log("=== SAVING COMPANY DETAILS ===");
      console.log("Has image file:", !!imageFile);
      console.log("Image file details:", imageFile);
      console.log("Company data keys:", Object.keys(sellerInfo));
      console.log("================================");
      
      await updateCompany(sellerInfo, imageFile);
      alert(isArabic ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully");
      
      const updatedData = await getCompany();
      setSellerInfo(updatedData);
      if (updatedData.companyImage) {
        setImagePreview(getImageUrl(updatedData.companyImage));
      }
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to save company info", error);
      alert(isArabic ? "فشل حفظ الإعدادات" : "Failed to save settings");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">{isArabic ? "جاري التحميل..." : "Loading..."}</div>
      </div>
    );
  }

  console.log("imagePreview", imagePreview);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "إعدادات النظام" : "System Settings"}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
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
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic ? "إعدادات معلومات الشركة" : "Company Information Settings"}
              </h3>

              {/* Company Logo Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {isArabic ? "شعار الشركة" : "Company Logo"}
                </label>

                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    {imagePreview ? (
                      <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Company Logo"
                          className="w-full h-full object-contain bg-gray-50"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      className="hidden"
                      id="company-logo-input"
                    />
                    <label
                      htmlFor="company-logo-input"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {isArabic ? "تحميل شعار" : "Upload Logo"}
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      {isArabic
                        ? "صيغ مدعومة: JPEG, PNG, GIF, WEBP (الحد الأقصى: 5 ميجابايت)"
                        : "Supported formats: JPEG, PNG, GIF, WEBP (Max: 5MB)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الشركة (إنجليزي)" : "Company Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.companyNameEn || ""}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, companyNameEn: e.target.value })
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
                    value={sellerInfo?.companyNameAr || ""}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, companyNameAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم ضريبة القيمة المضافة (15 رقم)" : "VAT Number (15 digits)"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.vatNumber || ""}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, vatNumber: e.target.value })
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
                    value={sellerInfo?.crNumber || ""}
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
                      setSellerInfo({ ...sellerInfo, establishmentDate: e.target.value })
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
                      sellerInfo?.licenseExpiry ? sellerInfo.licenseExpiry.split("T")[0] : ""
                    }
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, licenseExpiry: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "العنوان (إنجليزي)" : "Address (English)"}
                  </label>
                  <textarea
                    value={sellerInfo?.addressEn || ""}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, addressEn: e.target.value })
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
                    value={sellerInfo?.addressAr || ""}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, addressAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "مدينة" : "City"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.city || ""}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, city: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الرمز البريدي" : "Postal Code"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.postalCode || ""}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, postalCode: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={sellerInfo?.phone || ""}
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
                    value={sellerInfo?.email || ""}
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
                    value={sellerInfo?.website || ""}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, website: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Banking Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الآيبان" : "IBAN"}
                  </label>
                  <input
                    type="text"
                    value={sellerInfo?.iban || ""}
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
                    value={sellerInfo?.bankName || ""}
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
                    value={sellerInfo?.swiftCode || ""}
                    onChange={(e) =>
                      setSellerInfo({ ...sellerInfo, swiftCode: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveCompanyDetails}
                  disabled={uploading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {uploading
                    ? isArabic ? "جاري الحفظ..." : "Saving..."
                    : isArabic ? "حفظ الإعدادات" : "Save Settings"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};