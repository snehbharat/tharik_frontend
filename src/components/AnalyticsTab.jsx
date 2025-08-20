const AnalyticsTab = ({ employees, hrMetrics, isArabic, loading }) => {
  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>;
  }

  const departmentStats = [
    { name: "Operations", nameAr: "العمليات", count: 125, percentage: 67.2, avgSalary: 4200, satisfaction: 4.1 },
    { name: "Human Resources", nameAr: "الموارد البشرية", count: 8, percentage: 4.3, avgSalary: 5800, satisfaction: 4.5 },
    { name: "Finance", nameAr: "المالية", count: 12, percentage: 6.5, avgSalary: 5200, satisfaction: 4.2 },
    { name: "Maintenance", nameAr: "الصيانة", count: 28, percentage: 15.1, avgSalary: 3800, satisfaction: 4.0 },
    { name: "Safety", nameAr: "السلامة", count: 13, percentage: 7.0, avgSalary: 4800, satisfaction: 4.3 },
  ];

  const performanceDistribution = [
    { rating: "Excellent", ratingAr: "ممتاز", count: 45, percentage: 24.2 },
    { rating: "Good", ratingAr: "جيد", count: 89, percentage: 47.8 },
    { rating: "Average", ratingAr: "متوسط", count: 42, percentage: 22.6 },
    { rating: "Needs Improvement", ratingAr: "يحتاج تحسين", count: 10, percentage: 5.4 },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {isArabic ? "تحليلات الموارد البشرية المتقدمة" : "Advanced HR Analytics"}
      </h3>

      {/* Department Distribution */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">
          {isArabic ? "توزيع الموظفين حسب القسم" : "Employee Distribution by Department"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentStats.map((dept, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {isArabic ? dept.nameAr : dept.name}
                </span>
                <span className="text-sm text-gray-500">{dept.percentage.toFixed(1)}%</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{dept.count}</div>
              <div className="text-sm text-gray-600">
                {isArabic ? "متوسط الراتب:" : "Avg Salary:"} {dept.avgSalary.toLocaleString()} SAR
              </div>
              <div className="text-sm text-gray-600">
                {isArabic ? "الرضا:" : "Satisfaction:"} {dept.satisfaction}/5.0
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">
          {isArabic ? "توزيع الأداء" : "Performance Distribution"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {performanceDistribution.map((perf, index) => (
            <div key={index} className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{perf.count}</div>
              <div className="text-sm text-gray-700">
                {isArabic ? perf.ratingAr : perf.rating}
              </div>
              <div className="text-xs text-gray-500">{perf.percentage.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* HR Metrics Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">
          {isArabic ? "ملخص مؤشرات الموارد البشرية" : "HR Metrics Summary"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{hrMetrics.diversityIndex}</div>
            <div className="text-sm text-gray-700">{isArabic ? "مؤشر التنوع" : "Diversity Index"}</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{hrMetrics.skillsGapIndex}</div>
            <div className="text-sm text-gray-700">{isArabic ? "فجوة المهارات" : "Skills Gap Index"}</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{hrMetrics.performanceScore}</div>
            <div className="text-sm text-gray-700">{isArabic ? "نقاط الأداء" : "Performance Score"}</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{hrMetrics.engagementLevel}</div>
            <div className="text-sm text-gray-700">{isArabic ? "مستوى المشاركة" : "Engagement Level"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;