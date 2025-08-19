import React from "react";
import { Briefcase, Eye, Edit, Trash2 } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/financialCalculations";

export const ProjectList = ({ projects, attendance, isArabic, loading, onAddProject, onProjectAction, getStatusColor }) => (
  <div className="space-y-6">
    {/* Project list header */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {isArabic ? "جميع المشاريع" : "All Projects"}
      </h2>
      <div className="text-sm text-gray-500">
        {isArabic ? "إجمالي" : "Total"}: {projects.length} {isArabic ? "مشروع" : "projects"}
      </div>
    </div>

    {/* Project list or loading/no projects state */}
    {loading ? (
      <div className="text-center py-12">
        <p>{isArabic ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    ) : projects.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Project Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-600">{isArabic ? "العميل:" : "Client:"} {project.client}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <span>{isArabic ? "الموقع:" : "Location:"}</span>
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{isArabic ? "الميزانية:" : "Budget:"}</span>
                  <span className="font-medium text-green-600">{formatCurrency(project.budget || 0)}</span>
                </div>
              </div>
            </div>

            {/* Project Metrics */}
            <div className="p-6 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{isArabic ? "الإيرادات:" : "Revenue:"}</span>
                  <div className="font-semibold text-purple-600">{formatCurrency(project.budget || 0)}</div>
                </div>
                <div>
                  <span className="text-gray-600">{isArabic ? "الأرباح:" : "Profit:"}</span>
                  <div className="font-semibold text-green-600">
                    {formatCurrency((project.budget || 0) * (project.profitMargin || 0) / 100)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">{isArabic ? "هامش الربح:" : "Profit Margin:"}</span>
                  <div className="font-semibold text-yellow-600">{formatPercentage(project.profitMargin || 0)}</div>
                </div>
                <div>
                  <span className="text-gray-600">{isArabic ? "الساعات:" : "Hours:"}</span>
                  <div className="font-semibold text-blue-600">
                    {Array.isArray(attendance)
                      ? attendance
                          .filter((a) => a?.projectId === project.id)
                          .reduce((sum, a) => sum + (a?.hoursWorked || 0), 0)
                      : 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-gray-50 flex items-center gap-2">
              <button
                onClick={() => onProjectAction(project.id, "view")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {isArabic ? "عرض" : "View"}
              </button>
              <button
                onClick={() => onProjectAction(project.id, "edit")}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Edit className="w-4 h-4" />
                {isArabic ? "تعديل" : "Edit"}
              </button>
              <button
                onClick={() => onProjectAction(project.id, "delete")}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {isArabic ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isArabic ? "لا توجد مشاريع" : "No Projects"}
        </h3>
        <p className="text-gray-500 mb-6">
          {isArabic ? "ابدأ بإنشاء مشروعك الأول" : "Get started by creating your first project"}
        </p>
        <button
          onClick={onAddProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
        >
          <Plus className="w-5 h-5" />
          {isArabic ? "إضافة مشروع" : "Add Project"}
        </button>
      </div>
    )}
  </div>
);