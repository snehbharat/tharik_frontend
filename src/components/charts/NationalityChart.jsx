import React from "react";
import { Globe, Users } from "lucide-react";

export const NationalityChart = ({ data, isArabic = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          {isArabic ? "توزيع الجنسيات" : "Nationality Distribution"}
        </h3>
        <p className="text-sm text-gray-600">
          {isArabic
            ? "تحليل القوى العاملة حسب الجنسية"
            : "Workforce analysis by nationality"}
        </p>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">
                  {item.nationality}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {item.count}
                </div>
                <div className="text-xs text-gray-500">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{isArabic ? "النسبة" : "Percentage"}</span>
                <span>{item.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {isArabic ? "متوسط الأجر:" : "Avg Rate:"}
                </span>
                <span className="font-medium text-green-600">
                  {formatCurrency(item.averageRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {isArabic ? "إجمالي الساعات:" : "Total Hours:"}
                </span>
                <span className="font-medium text-purple-600">
                  {item.totalHours.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          {isArabic ? "الملخص" : "Summary"}
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">
              {isArabic ? "إجمالي الجنسيات:" : "Total Nationalities:"}
            </span>
            <span className="font-medium text-blue-900 ml-2">
              {data.length}
            </span>
          </div>
          <div>
            <span className="text-blue-700">
              {isArabic ? "إجمالي الموظفين:" : "Total Employees:"}
            </span>
            <span className="font-medium text-blue-900 ml-2">
              {data.reduce((sum, d) => sum + d.count, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationalityChart;
