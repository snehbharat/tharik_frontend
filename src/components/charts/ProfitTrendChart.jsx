import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export const ProfitTrendChart = ({ data, isArabic = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const maxProfit = Math.max(...data.map((d) => d.profit));

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {isArabic ? "اتجاه الأرباح" : "Profit Trend"}
        </h3>
        <p className="text-sm text-gray-600">
          {isArabic
            ? "تحليل الأرباح والإيرادات"
            : "Revenue and profit analysis"}
        </p>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{item.week}</span>
              <div className="flex items-center gap-2">
                {item.profit > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    item.profit > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {/* {item.margin.toFixed(1)}% */}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {isArabic ? "الإيرادات:" : "Revenue:"}
                </span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(item.revenue)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {isArabic ? "التكاليف:" : "Costs:"}
                </span>
                <span className="font-medium text-red-600">
                  {formatCurrency(item.costs)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {isArabic ? "الأرباح:" : "Profit:"}
                </span>
                <span className="font-medium text-green-600">
                  {formatCurrency(item.profit)}
                </span>
              </div>
            </div>

            {/* Visual Progress Bars */}
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{isArabic ? "الإيرادات" : "Revenue"}</span>
                  <span>{((item.revenue / maxRevenue) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{isArabic ? "الأرباح" : "Profit"}</span>
                  <span>{((item.profit / maxProfit) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.profit / maxProfit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>
                {item.projects} {isArabic ? "مشروع" : "projects"}
              </span>
              <span>
                {item.employees} {isArabic ? "موظف" : "employees"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfitTrendChart;
