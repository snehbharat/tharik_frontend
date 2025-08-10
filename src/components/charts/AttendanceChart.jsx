import React from "react";
import { Users, Clock, TrendingUp } from "lucide-react";

export const AttendanceChart = ({ data, isArabic = false }) => {
  const maxTotal = Math.max(...data.map((d) => d.total));

  const calculateAttendanceRate = (present, total) => {
    return total > 0 ? (present / total) * 100 : 0;
  };

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {isArabic ? "مخطط الحضور" : "Attendance Chart"}
        </h3>
        <p className="text-sm text-gray-600">
          {isArabic ? "تحليل الحضور اليومي" : "Daily attendance analysis"}
        </p>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => {
          const attendanceRate = calculateAttendanceRate(
            item.present,
            item.total
          );

          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    {attendanceRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {item.present}
                  </div>
                  <div className="text-xs text-gray-600">
                    {isArabic ? "حاضر" : "Present"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    {item.absent}
                  </div>
                  <div className="text-xs text-gray-600">
                    {isArabic ? "غائب" : "Absent"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {item.late}
                  </div>
                  <div className="text-xs text-gray-600">
                    {isArabic ? "متأخر" : "Late"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {item.overtime}
                  </div>
                  <div className="text-xs text-gray-600">
                    {isArabic ? "إضافي" : "Overtime"}
                  </div>
                </div>
              </div>

              {/* Attendance Rate Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{isArabic ? "معدل الحضور" : "Attendance Rate"}</span>
                  <span>{attendanceRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      attendanceRate >= 90
                        ? "bg-green-600"
                        : attendanceRate >= 75
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Total Employees Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>
                    {isArabic ? "إجمالي الموظفين" : "Total Employees"}
                  </span>
                  <span>{item.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.total / maxTotal) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-4 bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          {isArabic ? "الإحصائيات" : "Summary"}
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">
              {isArabic ? "متوسط الحضور:" : "Avg Attendance:"}
            </span>
            <span className="font-medium text-blue-900 ml-2">
              {data.length > 0
                ? (
                    data.reduce(
                      (sum, d) =>
                        sum + calculateAttendanceRate(d.present, d.total),
                      0
                    ) / data.length
                  ).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div>
            <span className="text-blue-700">
              {isArabic ? "إجمالي الأيام:" : "Total Days:"}
            </span>
            <span className="font-medium text-blue-900 ml-2">
              {data.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
