import React from "react";
import { formatPercentage } from "../utils/financialCalculations";

export const Analytics = ({ projects, isArabic, loading }) => (
  <div className="space-y-6">
    {/* Analytics header */}
    <h2 className="text-xl font-semibold text-gray-900">
      {isArabic ? "التحليلات المتقدمة" : "Advanced Analytics"}
    </h2>
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isArabic ? "تحليلات المشاريع" : "Project Analytics"}
      </h3>
      {/* Project analytics or loading/no projects state */}
      {loading ? (
        <div className="text-center py-12">
          <p>{isArabic ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900">{project.name}</div>
                <div className="text-sm text-gray-500">
                  {isArabic ? "مشروع" : "project"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">
                  {formatPercentage(project.progress || 0)}
                </div>
                <div className="text-sm text-gray-500">
                  {isArabic ? "معدل التقدم" : "Progress Rate"}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          {isArabic
            ? "لا توجد مشاريع للتحليل"
            : "No projects available for analysis"}
        </div>
      )}
    </div>
  </div>
);
