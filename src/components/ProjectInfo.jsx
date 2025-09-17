import React from "react";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  formatCurrency,
  formatPercentage,
} from "../utils/financialCalculations";

export const ProjectInfo = ({
  project,
  metrics,
  isArabic = false,
  onSelect,
  key,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-xl transition-all duration-300 backdrop-blur-sm ${
        onSelect ? "cursor-pointer hover:border-green-300" : ""
      }`}
      onClick={onSelect}
      key={key}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 tracking-tight">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 font-medium">
            {project.client_name}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{project.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {project.startDate} - {project.endDate}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border shadow-sm ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>
          <div
            className={`text-sm font-semibold ${getRiskColor(
              project.riskLevel
            )}`}
          >
            {isArabic ? "المخاطر:" : "Risk:"} {project.riskLevel}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700 tracking-tight">
            {isArabic ? "التقدم" : "Progress"}
          </span>
          <span className="text-sm font-bold text-gray-900 tracking-tight">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200/80 rounded-full h-3 shadow-inner">
          <div
            className={`h-3 rounded-full transition-all duration-700 shadow-sm ${getProgressColor(
              project.progress
            )}`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Financial Metrics */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-green-50/80 rounded-xl p-3 border border-green-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 font-semibold tracking-tight">
              {isArabic ? "الإيرادات" : "Revenue"}
            </span>
          </div>
          <div className="text-lg font-bold text-green-800 tracking-tight">
            {formatCurrency(metrics.clientBilling)}
          </div>
        </div>

        <div className="bg-blue-50/80 rounded-xl p-3 border border-blue-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-600 font-semibold tracking-tight">
              {isArabic ? "الأرباح" : "Profit"}
            </span>
          </div>
          <div className="text-lg font-bold text-blue-800 tracking-tight">
            {formatCurrency(metrics.realTimeProfit)}
          </div>
        </div>

        <div className="bg-purple-50/80 rounded-xl p-3 border border-purple-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-purple-600 font-semibold tracking-tight">
              {isArabic ? "العمال" : "Workers"}
            </span>
          </div>
          <div className="text-lg font-bold text-purple-800 tracking-tight">
            {metrics.projectWorkforce}
          </div>
        </div>

        <div className="bg-yellow-50/80 rounded-xl p-3 border border-yellow-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-yellow-600 font-semibold tracking-tight">
              {isArabic ? "الكفاءة" : "Efficiency"}
            </span>
          </div>
          <div className="text-lg font-bold text-yellow-800 tracking-tight">
            {formatPercentage(metrics.attendanceRate)}
          </div>
        </div>
      </div> */}

      {/* Key Performance Indicators */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {isArabic ? "هامش الربح:" : "Profit Margin:"}
          </span>
          <span
            className={`font-semibold ${
              project.profitMargin > 25
                ? "text-green-600"
                : project.profitMargin > 15
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {formatPercentage(project.profitMargin)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {isArabic ? "الإنتاجية:" : "Productivity:"}
          </span>
          <span className="font-semibold text-blue-600">
            {formatCurrency(metrics.productivity)}/hr
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {isArabic ? "العمل الإضافي:" : "Overtime:"}
          </span>
          <span
            className={`font-semibold ${
              metrics.overtimePercentage > 20
                ? "text-red-600"
                : metrics.overtimePercentage > 10
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {formatPercentage(metrics.overtimePercentage)}
          </span>
        </div>
      </div> */}

      {/* Status Indicators */}
      {/* <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100/60">
        <div className="flex items-center gap-4">
          {metrics.attendanceRate >= 90 ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-tight">
                {isArabic ? "حضور ممتاز" : "Excellent Attendance"}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-tight">
                {isArabic ? "حضور منخفض" : "Low Attendance"}
              </span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 font-medium">
          {isArabic ? "آخر تحديث:" : "Updated:"}{" "}
          {new Date(project.updatedAt).toLocaleDateString()}
        </div>
      </div> */}
    </div>
  );
};
