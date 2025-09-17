import React from "react";
import { TrendingUp, Activity, Building2 } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/financialCalculations";

export const Reports = ({ dashboardMetrics, isArabic }) => (
  <div className="space-y-6">
    {/* Reports header */}
    <h2 className="text-xl font-semibold text-gray-900">
      {isArabic ? "مركز ذكاء الأرباح" : "Profit Intelligence Center"}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Real-Time Profit Analysis */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-8 h-8 text-green-600" />
          <h3 className="font-semibold text-green-800">
            {isArabic ? "تحليل الأرباح الفوري" : "Real-Time Profit Analysis"}
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-green-700">{isArabic ? "إجمالي الإيرادات:" : "Total Revenue:"}</span>
            <span className="font-bold text-green-900">{formatCurrency(dashboardMetrics.crossProjectRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">{isArabic ? "إجمالي الأرباح:" : "Total Profits:"}</span>
            <span className="font-bold text-green-900">{formatCurrency(dashboardMetrics.realTimeProfits)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">{isArabic ? "هامش الربح:" : "Profit Margin:"}</span>
            <span className="font-bold text-green-900">{formatPercentage(dashboardMetrics.averageProfitMargin)}</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {/* <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-8 h-8 text-blue-600" />
          <h3 className="font-semibold text-blue-800">
            {isArabic ? "مقاييس الأداء" : "Performance Metrics"}
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-blue-700">{isArabic ? "الإنتاجية:" : "Productivity:"}</span>
            <span className="font-bold text-blue-900">{formatCurrency(dashboardMetrics.productivityIndex)}/hr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">{isArabic ? "الاستغلال:" : "Utilization:"}</span>
            <span className="font-bold text-blue-900">{formatPercentage(dashboardMetrics.utilizationRate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">{isArabic ? "إجمالي الساعات:" : "Total Hours:"}</span>
            <span className="font-bold text-blue-900">{dashboardMetrics.aggregateHours.toLocaleString()}</span>
          </div>
        </div>
      </div> */}

      {/* Performance Achievements */}
      {/* <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-8 h-8 text-purple-600" />
          <h3 className="font-semibold text-purple-800">
            {isArabic ? "إنجازات الأداء" : "Performance Achievements"}
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-600">
            <Activity className="w-4 h-4" />
            <span className="text-sm">{isArabic ? "صفر حوادث سلامة" : "Zero safety incidents"}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Activity className="w-4 h-4" />
            <span className="text-sm">{isArabic ? "تجاوز أهداف الإنتاجية" : "Exceeded productivity targets"}</span>
          </div>
          <div className="flex items-center gap-2 text-purple-600">
            <Activity className="w-4 h-4" />
            <span className="text-sm">{isArabic ? "امتثال كامل للوثائق" : "Full document compliance"}</span>
          </div>
        </div>
      </div> */}
    </div>
  </div>
);