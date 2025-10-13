import React, { useState, useEffect } from "react";
import { Save, Settings } from "lucide-react";
import { getCompany, updateCompany } from "../services/CompanyService";

export const SystemSettings = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("settings");
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "مدينة" : "City"}
                  </label>
                  <input
                    value={sellerInfo?.city}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        city: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الرمز البريدي" : "Postal Code"}
                  </label>
                  <input
                    value={sellerInfo?.postalCode}
                    onChange={(e) =>
                      setSellerInfo({
                        ...sellerInfo,
                        postalCode: e.target.value,
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
        </div>
      </div>
    </div>
  );
};
