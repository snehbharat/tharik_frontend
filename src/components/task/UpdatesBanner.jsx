import React from "react";
import { MessageSquare } from "lucide-react";

const UpdatesBanner = ({ isArabic }) => (
  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
    <div className="flex items-center gap-3">
      <MessageSquare className="w-6 h-6 text-green-600" />
      <div className="flex-1">
        <h3 className="font-semibold text-green-800">
          {isArabic ? "نظام التحديثات المتقدم" : "Advanced Updates System"}
        </h3>
        <p className="text-sm text-green-700">
          {isArabic
            ? "رفع الصور • إضافة التحديثات النصية • إرسال تذكيرات SMS • تتبع التقدم في الوقت الفعلي"
            : "Photo uploads • Text updates • SMS reminders • Real-time progress tracking"}
        </p>
      </div>
    </div>
  </div>
);

export default UpdatesBanner;