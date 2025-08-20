import { useState } from "react";
import { Filter } from "lucide-react";

export default function VehicleFilters({
  searchTerm,
  setSearchTerm,
  selectedProject,
  setSelectedProject,
  projects,
  isArabic,
  filters,
  setFilters,
}) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative">
      <div className="flex items-center gap-4">
        {/* Filter Button */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Filter className="w-4 h-4" />
          {isArabic ? "تصفية" : "Filter"}
        </button>
      </div>

      {/* Dropdown */}
      {filterOpen && (
        <div className="absolute right-4 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          {/* Mileage */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isArabic ? "الكيلومترات" : "Mileage"}
            </label>
            <select
              value={filters.mileage}
              onChange={(e) =>
                setFilters({ ...filters, mileage: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">{isArabic ? "الكل" : "All"}</option>
              <option value="low">{isArabic ? "الأدنى" : "Lowest"}</option>
              <option value="high">{isArabic ? "الأعلى" : "Highest"}</option>
            </select>
          </div>

          {/* Daily Rate */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isArabic ? "المعدل اليومي" : "Daily Rate"}
            </label>
            <select
              value={filters.dailyRate}
              onChange={(e) =>
                setFilters({ ...filters, dailyRate: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">{isArabic ? "الكل" : "All"}</option>
              <option value="low">{isArabic ? "الأدنى" : "Lowest"}</option>
              <option value="high">{isArabic ? "الأعلى" : "Highest"}</option>
            </select>
          </div>

          {/* Status */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isArabic ? "الحالة" : "Status"}
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">{isArabic ? "الكل" : "All"}</option>
              <option value="Active">{isArabic ? "نشط" : "Active"}</option>
              <option value="Inactive">
                {isArabic ? "غير نشط" : "Inactive"}
              </option>
              <option value="Maintenance">
                {isArabic ? "صيانة" : "Maintenance"}
              </option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
