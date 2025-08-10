import React, { useState } from "react";
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Shield,
  Target,
  X,
  Eye,
  ArrowRight,
} from "lucide-react";

export const ActionableInsights = ({
  insights,
  isArabic = false,
  onInsightAction,
}) => {
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [filter, setFilter] = useState("all");

  const getInsightIcon = (type) => {
    switch (type) {
      case "optimization":
        return TrendingUp;
      case "alert":
        return AlertTriangle;
      case "recommendation":
        return Lightbulb;
      case "achievement":
        return Award;
      default:
        return Target;
    }
  };

  const getInsightColor = (type, impact) => {
    if (type === "achievement") {
      return "from-green-50 to-emerald-50 border-green-200 text-green-800";
    }

    switch (impact) {
      case "high":
        return type === "alert"
          ? "from-red-50 to-orange-50 border-red-200 text-red-800"
          : "from-blue-50 to-indigo-50 border-blue-200 text-blue-800";
      case "medium":
        return "from-yellow-50 to-amber-50 border-yellow-200 text-yellow-800";
      case "low":
        return "from-gray-50 to-slate-50 border-gray-200 text-gray-800";
      default:
        return "from-gray-50 to-slate-50 border-gray-200 text-gray-800";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "financial":
        return DollarSign;
      case "operational":
        return Users;
      case "safety":
        return Shield;
      case "efficiency":
        return Target;
      default:
        return Clock;
    }
  };

  const filteredInsights = insights.filter((insight) => {
    if (filter === "all") return true;
    return insight.impact === filter;
  });

  const prioritizedInsights = filteredInsights.sort(
    (a, b) => a.priority - b.priority
  );
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          {isArabic ? "رؤى قابلة للتنفيذ" : "Actionable Insights"}
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1"
          >
            <option value="all">
              {isArabic ? "جميع الرؤى" : "All Insights"}
            </option>
            <option value="high">
              {isArabic ? "تأثير عالي" : "High Impact"}
            </option>
            <option value="medium">
              {isArabic ? "تأثير متوسط" : "Medium Impact"}
            </option>
            <option value="low">
              {isArabic ? "تأثير منخفض" : "Low Impact"}
            </option>
          </select>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {prioritizedInsights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>
              {isArabic
                ? "لا توجد رؤى متاحة حالياً"
                : "No insights available at the moment"}
            </p>
          </div>
        ) : (
          prioritizedInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const CategoryIcon = getCategoryIcon(insight.category);
            const colorClasses = getInsightColor(insight.type, insight.impact);

            return (
              <div
                key={insight.id}
                className={`bg-gradient-to-r ${colorClasses} rounded-lg p-4 border transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      insight.type === "achievement"
                        ? "bg-green-600"
                        : insight.impact === "high"
                        ? "bg-red-600"
                        : insight.impact === "medium"
                        ? "bg-yellow-600"
                        : "bg-gray-600"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {insight.title}
                      </h4>
                      <div className="flex items-center gap-2 ml-3">
                        <div className="flex items-center gap-1">
                          <CategoryIcon className="w-3 h-3" />
                          <span className="text-xs font-medium capitalize">
                            {insight.category}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            insight.impact === "high"
                              ? "bg-red-100 text-red-700"
                              : insight.impact === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {insight.impact}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {insight.description}
                    </p>

                    {/* Financial Impact */}
                    {(insight.estimatedBenefit ||
                      insight.implementationCost) && (
                      <div className="flex items-center gap-4 mb-3 text-xs">
                        {insight.estimatedBenefit && (
                          <div className="flex items-center gap-1 text-green-700">
                            <TrendingUp className="w-3 h-3" />
                            <span>
                              {isArabic ? "الفائدة المتوقعة:" : "Est. Benefit:"}{" "}
                              {formatCurrency(insight.estimatedBenefit)}
                            </span>
                          </div>
                        )}
                        {insight.implementationCost && (
                          <div className="flex items-center gap-1 text-blue-700">
                            <DollarSign className="w-3 h-3" />
                            <span>
                              {isArabic ? "تكلفة التنفيذ:" : "Implementation:"}{" "}
                              {formatCurrency(insight.implementationCost)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Deadline */}
                    {insight.deadline && (
                      <div className="flex items-center gap-1 text-xs text-red-600 mb-3">
                        <Clock className="w-3 h-3" />
                        <span>
                          {isArabic ? "الموعد النهائي:" : "Deadline:"}{" "}
                          {new Date(insight.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInsight(insight)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <Eye className="w-3 h-3" />
                          {isArabic ? "عرض التفاصيل" : "View Details"}
                        </button>
                        {insight.actionRequired && (
                          <button
                            onClick={() =>
                              onInsightAction?.(insight.id, "acknowledge")
                            }
                            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {isArabic ? "اتخاذ إجراء" : "Take Action"}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">
                          {isArabic ? "الأولوية:" : "Priority:"}{" "}
                          {insight.priority}
                        </span>
                        <button
                          onClick={() =>
                            onInsightAction?.(insight.id, "dismiss")
                          }
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Insight Details Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "تفاصيل الرؤية" : "Insight Details"}
              </h3>
              <button
                onClick={() => setSelectedInsight(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Insight Header */}
              <div
                className={`bg-gradient-to-r ${getInsightColor(
                  selectedInsight.type,
                  selectedInsight.impact
                )} rounded-lg p-4 border`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedInsight.type === "achievement"
                        ? "bg-green-600"
                        : selectedInsight.impact === "high"
                        ? "bg-red-600"
                        : selectedInsight.impact === "medium"
                        ? "bg-yellow-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {React.createElement(getInsightIcon(selectedInsight.type), {
                      className: "w-6 h-6 text-white",
                    })}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {selectedInsight.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedInsight.impact === "high"
                            ? "bg-red-100 text-red-700"
                            : selectedInsight.impact === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {selectedInsight.impact} {isArabic ? "تأثير" : "impact"}
                      </span>
                      <span className="text-xs text-gray-600 capitalize">
                        {selectedInsight.category}
                      </span>
                      <span className="text-xs text-gray-600">
                        {isArabic ? "الأولوية:" : "Priority:"}{" "}
                        {selectedInsight.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">
                  {isArabic ? "الوصف" : "Description"}
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  {selectedInsight.description}
                </p>
              </div>

              {/* Financial Impact */}
              {(selectedInsight.estimatedBenefit ||
                selectedInsight.implementationCost) && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">
                    {isArabic ? "التأثير المالي" : "Financial Impact"}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedInsight.estimatedBenefit && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">
                            {isArabic
                              ? "الفائدة المتوقعة"
                              : "Estimated Benefit"}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-green-900">
                          {formatCurrency(selectedInsight.estimatedBenefit)}
                        </div>
                      </div>
                    )}
                    {selectedInsight.implementationCost && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-800">
                            {isArabic ? "تكلفة التنفيذ" : "Implementation Cost"}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">
                          {formatCurrency(selectedInsight.implementationCost)}
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedInsight.estimatedBenefit &&
                    selectedInsight.implementationCost && (
                      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-purple-800">
                            {isArabic ? "العائد على الاستثمار:" : "ROI:"}
                          </span>
                          <span className="text-lg font-bold text-purple-900">
                            {(
                              (selectedInsight.estimatedBenefit /
                                selectedInsight.implementationCost -
                                1) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Deadline */}
              {selectedInsight.deadline && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">
                    {isArabic ? "الموعد النهائي" : "Deadline"}
                  </h5>
                  <div className="flex items-center gap-2 text-red-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date(selectedInsight.deadline).toLocaleDateString(
                        "en-SA",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {selectedInsight.actionRequired && (
                  <button
                    onClick={() => {
                      onInsightAction?.(selectedInsight.id, "acknowledge");
                      setSelectedInsight(null);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isArabic ? "اتخاذ إجراء" : "Take Action"}
                  </button>
                )}
                <button
                  onClick={() => {
                    onInsightAction?.(selectedInsight.id, "dismiss");
                    setSelectedInsight(null);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "تجاهل" : "Dismiss"}
                </button>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for currency formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
