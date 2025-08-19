import React from "react";
import { Save, X } from "lucide-react";

export const AddProjectModal = ({ isArabic, newProject, setNewProject, onSave, onClose, loading }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
      {/* Modal header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {isArabic ? "إضافة مشروع جديد" : "Add New Project"}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Project form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "اسم المشروع" : "Project Name"} *
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "العميل" : "Client"} *
            </label>
            <input
              type="text"
              value={newProject.client}
              onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "الموقع" : "Location"} *
            </label>
            <input
              type="text"
              value={newProject.location}
              onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "الميزانية (ريال)" : "Budget (SAR)"} *
            </label>
            <input
              type="number"
              value={newProject.budget}
              onChange={(e) => setNewProject({ ...newProject, budget: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "تاريخ البداية" : "Start Date"} *
            </label>
            <input
              type="date"
              value={newProject.startDate}
              onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "تاريخ الانتهاء" : "End Date"} *
            </label>
            <input
              type="date"
              value={newProject.endDate}
              onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "هامش الربح (%)" : "Profit Margin (%)"}
            </label>
            <input
              type="number"
              value={newProject.profitMargin}
              onChange={(e) => setNewProject({ ...newProject, profitMargin: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "مستوى المخاطر" : "Risk Level"}
            </label>
            <select
              value={newProject.riskLevel}
              onChange={(e) => setNewProject({ ...newProject, riskLevel: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="low">{isArabic ? "منخفض" : "Low"}</option>
              <option value="medium">{isArabic ? "متوسط" : "Medium"}</option>
              <option value="high">{isArabic ? "عالي" : "High"}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? "وصف المشروع" : "Project Description"}
          </label>
          <textarea
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={3}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={onSave}
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Save className="w-4 h-4" />
            {loading ? (isArabic ? "جاري الحفظ..." : "Saving...") : (isArabic ? "حفظ المشروع" : "Save Project")}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  </div>
);