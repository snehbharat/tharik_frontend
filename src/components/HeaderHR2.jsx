import React from "react";
import { Plus, Download } from "lucide-react";

export const HeaderHR2 = ({ isArabic, onRefresh, onExport, onAddProject }) => (
  <div className="flex items-center justify-between">
    {/* Header title */}
    <h1 className="text-3xl font-bold text-gray-900">
      {isArabic ? "إدارة الحضور" : "Attendance Tracking"}
    </h1>
    {/* Action buttons */}
    {/* <div className="flex items-center gap-3">
      <button
        onClick={onRefresh}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        {isArabic ? "تحديث البيانات" : "Refresh Data"}
      </button>
      <button
        onClick={onExport}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Download className="w-4 h-4" />
        {isArabic ? "تصدير التقارير" : "Export Reports"}
      </button>
      <button
        onClick={onAddProject}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {isArabic ? "مشروع جديد" : "New Project"}
      </button>
    </div> */}
  </div>
);
