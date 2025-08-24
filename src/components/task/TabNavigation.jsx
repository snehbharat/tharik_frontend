import React from "react";
import { CheckSquare, CheckCircle, AlertTriangle } from "lucide-react";

const TabNavigation = ({ activeTab, setActiveTab, isArabic }) => (
  <div className="border-b border-gray-200">
    <nav className="flex">
      <button
        onClick={() => setActiveTab("active")}
        className={`px-6 py-4 font-medium transition-colors ${
          activeTab === "active"
            ? "text-green-600 border-b-2 border-green-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          {isArabic ? "المهام النشطة" : "Active Tasks"}
        </div>
      </button>
      <button
        onClick={() => setActiveTab("completed")}
        className={`px-6 py-4 font-medium transition-colors ${
          activeTab === "completed"
            ? "text-green-600 border-b-2 border-green-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {isArabic ? "المكتملة" : "Completed"}
        </div>
      </button>
      <button
        onClick={() => setActiveTab("overdue")}
        className={`px-6 py-4 font-medium transition-colors ${
          activeTab === "overdue"
            ? "text-green-600 border-b-2 border-green-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {isArabic ? "المتأخرة" : "Overdue"}
        </div>
      </button>
    </nav>
  </div>
);

export default TabNavigation;