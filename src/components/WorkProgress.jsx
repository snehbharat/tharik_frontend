import React, { useState } from "react";
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  Eye,
  Shield,
  Smartphone,
  Calendar,
  User,
  FileImage,
} from "lucide-react";

export const WorkProgress = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("submissions");

  const progressSubmissions = [
    {
      id: 1,
      project: "Aramco Facility Maintenance",
      projectAr: "صيانة منشآت أرامكو",
      submittedBy: "Ahmed Al-Rashid",
      submittedByAr: "أحمد الراشد",
      timestamp: "2024-12-15 14:30:25",
      location: "Dhahran Industrial Complex",
      coordinates: "26.2885° N, 50.1500° E",
      photos: [
        {
          type: "Before",
          url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg",
          description: "Equipment before maintenance",
          aiVerified: true,
          duplicateCheck: "Passed",
        },
        {
          type: "During",
          url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg",
          description: "Maintenance in progress",
          aiVerified: true,
          duplicateCheck: "Passed",
        },
        {
          type: "After",
          url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg",
          description: "Completed maintenance work",
          aiVerified: true,
          duplicateCheck: "Passed",
        },
      ],
      safetyCompliance: "Verified",
      status: "Approved",
      verificationLevel: "AI + Human",
    },
    {
      id: 2,
      project: "SABIC Construction Support",
      projectAr: "دعم إنشاءات سابك",
      submittedBy: "Mohammad Hassan",
      submittedByAr: "محمد حسن",
      timestamp: "2024-12-15 11:45:12",
      location: "Jubail Industrial City",
      coordinates: "27.0174° N, 49.6251° E",
      photos: [
        {
          type: "Progress",
          url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg",
          description: "Foundation work progress",
          aiVerified: false,
          duplicateCheck: "Flagged",
        },
      ],
      safetyCompliance: "Pending Review",
      status: "Under Review",
      verificationLevel: "Pending",
    },
    {
      id: 3,
      project: "NEOM Infrastructure Development",
      projectAr: "تطوير البنية التحتية لنيوم",
      submittedBy: "Ali Al-Mahmoud",
      submittedByAr: "علي المحمود",
      timestamp: "2024-12-15 09:15:33",
      location: "NEOM - Tabuk Province",
      coordinates: "28.2636° N, 34.7917° E",
      photos: [
        {
          type: "Safety Check",
          url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg",
          description: "Safety equipment verification",
          aiVerified: true,
          duplicateCheck: "Passed",
        },
        {
          type: "Work Area",
          url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg",
          description: "Current work area status",
          aiVerified: true,
          duplicateCheck: "Passed",
        },
      ],
      safetyCompliance: "Verified",
      status: "Approved",
      verificationLevel: "AI Verified",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationColor = (verified) => {
    return verified ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "تقدم العمل المرئي" : "Visual Work Progress"}
        </h1>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Smartphone className="w-4 h-4" />
            {isArabic ? "تطبيق الجوال" : "Mobile App"}
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            {isArabic ? "رفع صور" : "Upload Photos"}
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">247</div>
              <div className="text-sm text-blue-700">
                {isArabic ? "صور اليوم" : "Today's Photos"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">94%</div>
              <div className="text-sm text-green-700">
                {isArabic ? "التحقق بالذكاء الاصطناعي" : "AI Verification"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">18</div>
              <div className="text-sm text-purple-700">
                {isArabic ? "مواقع نشطة" : "Active Sites"}
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
              <div className="text-2xl font-bold text-yellow-900">96%</div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "امتثال السلامة" : "Safety Compliance"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Verification Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-purple-800">
              {isArabic
                ? "التحقق متعدد الطبقات بالذكاء الاصطناعي"
                : "Multi-Layer AI Verification"}
            </h3>
            <p className="text-sm text-purple-700">
              {isArabic
                ? "كشف الصور المكررة والمزيفة • التحقق من الموقع الجغرافي • تحليل السلامة التلقائي"
                : "Duplicate & fake image detection • GPS location verification • Automated safety analysis"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-800">99.2%</div>
            <div className="text-sm text-purple-600">
              {isArabic ? "دقة" : "Accuracy"}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("submissions")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "submissions"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                {isArabic ? "التقارير المرئية" : "Photo Submissions"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("verification")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "verification"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {isArabic ? "التحقق والمراجعة" : "Verification & Review"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "analytics"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileImage className="w-4 h-4" />
                {isArabic ? "تحليلات التقدم" : "Progress Analytics"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "submissions" && (
            <div className="space-y-6">
              {progressSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isArabic ? submission.projectAr : submission.project}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>
                            {isArabic
                              ? submission.submittedByAr
                              : submission.submittedBy}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{submission.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{submission.location}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {submission.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {submission.photos.map((photo, photoIndex) => (
                      <div
                        key={photoIndex}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={photo.url}
                            alt={photo.description}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target;
                              target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+";
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {photo.type}
                            </span>
                            <div className="flex items-center gap-2">
                              <Shield
                                className={`w-4 h-4 ${getVerificationColor(
                                  photo.aiVerified
                                )}`}
                              />
                              <span
                                className={`text-xs ${getVerificationColor(
                                  photo.aiVerified
                                )}`}
                              >
                                {photo.aiVerified ? "Verified" : "Pending"}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {photo.description}
                          </p>
                          <div className="text-xs text-gray-500">
                            {isArabic ? "فحص التكرار:" : "Duplicate Check:"}
                            <span
                              className={`ml-1 ${
                                photo.duplicateCheck === "Passed"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {photo.duplicateCheck}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <span className="text-gray-600">
                        {isArabic ? "الإحداثيات:" : "Coordinates:"}
                      </span>
                      <div className="font-mono text-gray-900">
                        {submission.coordinates}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <span className="text-gray-600">
                        {isArabic ? "امتثال السلامة:" : "Safety Compliance:"}
                      </span>
                      <div
                        className={`font-medium ${
                          submission.safetyCompliance === "Verified"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {submission.safetyCompliance}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <span className="text-gray-600">
                        {isArabic ? "مستوى التحقق:" : "Verification Level:"}
                      </span>
                      <div className="font-medium text-blue-600">
                        {submission.verificationLevel}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "verification" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {isArabic
                    ? "نظام التحقق الذكي"
                    : "Intelligent Verification System"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">
                      {isArabic ? "كشف الصور المكررة:" : "Duplicate Detection:"}
                    </span>
                    <div className="text-blue-800">
                      99.5% {isArabic ? "دقة" : "Accuracy"}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">
                      {isArabic
                        ? "التحقق من الموقع:"
                        : "Location Verification:"}
                    </span>
                    <div className="text-blue-800">
                      GPS + {isArabic ? "تحليل الصورة" : "Image Analysis"}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">
                      {isArabic ? "تحليل السلامة:" : "Safety Analysis:"}
                    </span>
                    <div className="text-blue-800">
                      {isArabic ? "تلقائي" : "Automated"} +{" "}
                      {isArabic ? "مراجعة بشرية" : "Human Review"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "إحصائيات التحقق" : "Verification Statistics"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      1,247
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "صور تم التحقق منها" : "Photos Verified"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">23</div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "صور مرفوضة" : "Photos Rejected"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">45</div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "قيد المراجعة" : "Under Review"}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      98.2%
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "معدل الموافقة" : "Approval Rate"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "تقدم المشاريع" : "Project Progress"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "أرامكو:" : "Aramco:"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "سابك:" : "SABIC:"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isArabic ? "نيوم:" : "NEOM:"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: "35%" }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "اتجاهات التقدم" : "Progress Trends"}
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      +18%
                    </div>
                    <div className="text-sm text-purple-700 mb-4">
                      {isArabic ? "تحسن هذا الشهر" : "Improvement This Month"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {isArabic
                        ? "مقارنة بالشهر الماضي"
                        : "Compared to last month"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "تحليلات متقدمة" : "Advanced Analytics"}
                </h3>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض الرسوم البيانية التفاعلية وتحليلات الذكاء الاصطناعي هنا..."
                    : "Interactive charts and AI-powered analytics will be displayed here..."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
