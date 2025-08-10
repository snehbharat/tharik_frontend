import React, { useState, useMemo } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Award,
  Calendar,
  Target,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

export const EmployeeAnalytics = ({ employees, departments, isArabic }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [activeChart, setActiveChart] = useState("demographics");

  const analytics = useMemo(() => {
    const filteredEmployees =
      selectedDepartment === "all"
        ? employees
        : employees.filter(
            (emp) => emp.professionalInfo.departmentId === selectedDepartment
          );

    const totalEmployees = filteredEmployees.length;
    const activeEmployees = filteredEmployees.filter(
      (emp) => emp.status === "active"
    ).length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newHires = filteredEmployees.filter(
      (emp) => new Date(emp.professionalInfo.hireDate) >= thirtyDaysAgo
    ).length;

    const terminations = filteredEmployees.filter(
      (emp) => emp.status === "terminated" && emp.updatedAt >= thirtyDaysAgo
    ).length;

    const turnoverRate =
      totalEmployees > 0 ? (terminations / totalEmployees) * 100 : 0;

    const totalTenure = filteredEmployees.reduce((sum, emp) => {
      const hireDate = new Date(emp.professionalInfo.hireDate);
      const now = new Date();
      const tenureMonths =
        (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return sum + tenureMonths;
    }, 0);
    const averageTenure = totalEmployees > 0 ? totalTenure / totalEmployees : 0;

    const departmentDistribution = departments.map((dept) => {
      const deptEmployees = filteredEmployees.filter(
        (emp) => emp.professionalInfo.departmentId === dept.id
      );
      const avgAge =
        deptEmployees.length > 0
          ? deptEmployees.reduce((sum, emp) => {
              const birthDate = new Date(emp.personalInfo.dateOfBirth);
              const age = new Date().getFullYear() - birthDate.getFullYear();
              return sum + age;
            }, 0) / deptEmployees.length
          : 0;

      const avgTenure =
        deptEmployees.length > 0
          ? deptEmployees.reduce((sum, emp) => {
              const hireDate = new Date(emp.professionalInfo.hireDate);
              const tenureMonths =
                (new Date().getTime() - hireDate.getTime()) /
                (1000 * 60 * 60 * 24 * 30);
              return sum + tenureMonths;
            }, 0) / deptEmployees.length
          : 0;

      return {
        departmentId: dept.id,
        departmentName: isArabic ? dept.nameAr : dept.name,
        employeeCount: deptEmployees.length,
        averageAge: Math.round(avgAge),
        averageTenure: Math.round(avgTenure),
        turnoverRate: 0,
        performanceScore: 85,
      };
    });

    const ageGroups = [
      { range: "20-29", count: 0, percentage: 0 },
      { range: "30-39", count: 0, percentage: 0 },
      { range: "40-49", count: 0, percentage: 0 },
      { range: "50-59", count: 0, percentage: 0 },
      { range: "60+", count: 0, percentage: 0 },
    ];

    filteredEmployees.forEach((emp) => {
      const birthDate = new Date(emp.personalInfo.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();

      if (age >= 20 && age <= 29) ageGroups[0].count++;
      else if (age >= 30 && age <= 39) ageGroups[1].count++;
      else if (age >= 40 && age <= 49) ageGroups[2].count++;
      else if (age >= 50 && age <= 59) ageGroups[3].count++;
      else if (age >= 60) ageGroups[4].count++;
    });

    ageGroups.forEach((group) => {
      group.percentage =
        totalEmployees > 0 ? (group.count / totalEmployees) * 100 : 0;
    });

    const maleCount = filteredEmployees.filter(
      (emp) => emp.personalInfo.gender === "male"
    ).length;
    const femaleCount = filteredEmployees.filter(
      (emp) => emp.personalInfo.gender === "female"
    ).length;
    const genderDistribution = {
      male: maleCount,
      female: femaleCount,
      other: totalEmployees - maleCount - femaleCount,
      malePercentage:
        totalEmployees > 0 ? (maleCount / totalEmployees) * 100 : 0,
      femalePercentage:
        totalEmployees > 0 ? (femaleCount / totalEmployees) * 100 : 0,
    };

    const nationalityMap = new Map();
    filteredEmployees.forEach((emp) => {
      const count = nationalityMap.get(emp.personalInfo.nationality) || 0;
      nationalityMap.set(emp.personalInfo.nationality, count + 1);
    });

    const nationalityDistribution = Array.from(nationalityMap.entries()).map(
      ([nationality, count]) => ({
        nationality,
        count,
        percentage: totalEmployees > 0 ? (count / totalEmployees) * 100 : 0,
      })
    );

    const performanceDistribution = {
      excellent: Math.floor(totalEmployees * 0.2),
      good: Math.floor(totalEmployees * 0.5),
      satisfactory: Math.floor(totalEmployees * 0.25),
      needsImprovement: Math.floor(totalEmployees * 0.05),
      averageRating: 3.8,
    };

    const trainingMetrics = {
      totalTrainingHours: totalEmployees * 40,
      averageHoursPerEmployee: 40,
      completionRate: 87,
      trainingBudgetUtilization: 78,
      topTrainingCategories: [
        {
          category: "Safety Training",
          hours: totalEmployees * 8,
          participants: totalEmployees,
          averageRating: 4.5,
        },
        {
          category: "Technical Skills",
          hours: totalEmployees * 12,
          participants: Math.floor(totalEmployees * 0.8),
          averageRating: 4.2,
        },
        {
          category: "Leadership Development",
          hours: totalEmployees * 6,
          participants: Math.floor(totalEmployees * 0.3),
          averageRating: 4.7,
        },
        {
          category: "Compliance Training",
          hours: totalEmployees * 4,
          participants: totalEmployees,
          averageRating: 4.0,
        },
      ],
    };

    return {
      totalEmployees,
      activeEmployees,
      newHires,
      terminations,
      turnoverRate,
      averageTenure,
      departmentDistribution,
      ageDistribution: ageGroups,
      genderDistribution,
      nationalityDistribution,
      performanceDistribution,
      trainingMetrics,
    };
  }, [employees, departments, selectedDepartment, isArabic]);

  const handleExportAnalytics = () => {
    try {
      const exportData = {
        generatedAt: new Date().toISOString(),
        timeframe: selectedTimeframe,
        department: selectedDepartment,
        analytics,
      };

      const csvContent = [
        ["Metric", "Value"],
        ["Total Employees", analytics.totalEmployees.toString()],
        ["Active Employees", analytics.activeEmployees.toString()],
        ["New Hires", analytics.newHires.toString()],
        ["Turnover Rate", `${analytics.turnoverRate.toFixed(1)}%`],
        ["Average Tenure (months)", analytics.averageTenure.toFixed(1)],
        ["Male Employees", analytics.genderDistribution.male.toString()],
        ["Female Employees", analytics.genderDistribution.female.toString()],
        [
          "Training Hours",
          analytics.trainingMetrics.totalTrainingHours.toString(),
        ],
        [
          "Training Completion Rate",
          `${analytics.trainingMetrics.completionRate}%`,
        ],
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `hr_analytics_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم تصدير التحليلات بنجاح!"
          : "Analytics exported successfully!"
      );
    } catch (error) {
      console.error("Export error:", error);
      alert(
        isArabic ? "حدث خطأ أثناء التصدير" : "Error occurred during export"
      );
    }
  };
  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isArabic ? "تحليلات الموارد البشرية" : "HR Analytics Dashboard"}
          </h2>
          <p className="text-gray-600 mt-1">
            {isArabic
              ? "رؤى شاملة حول القوى العاملة والأداء"
              : "Comprehensive workforce insights and performance metrics"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="month">
              {isArabic ? "هذا الشهر" : "This Month"}
            </option>
            <option value="quarter">
              {isArabic ? "هذا الربع" : "This Quarter"}
            </option>
            <option value="year">{isArabic ? "هذا العام" : "This Year"}</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">
              {isArabic ? "جميع الأقسام" : "All Departments"}
            </option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {isArabic ? dept.nameAr : dept.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleExportAnalytics}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير" : "Export"}
          </button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {analytics.totalEmployees}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "إجمالي الموظفين" : "Total Employees"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {analytics.activeEmployees}
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "موظفون نشطون" : "Active Employees"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {analytics.newHires}
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "توظيف جديد" : "New Hires"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {analytics.averageTenure.toFixed(1)}
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "متوسط الخدمة (شهر)" : "Avg Tenure (months)"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">
                {analytics.turnoverRate.toFixed(1)}%
              </div>
              <div className="text-sm text-red-700">
                {isArabic ? "معدل الدوران" : "Turnover Rate"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveChart("demographics")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeChart === "demographics"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                {isArabic ? "التركيبة السكانية" : "Demographics"}
              </div>
            </button>
            <button
              onClick={() => setActiveChart("performance")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeChart === "performance"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {isArabic ? "الأداء" : "Performance"}
              </div>
            </button>
            <button
              onClick={() => setActiveChart("trends")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeChart === "trends"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? "الاتجاهات" : "Trends"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeChart === "demographics" && (
            <div className="space-y-6">
              {/* Department Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isArabic ? "توزيع الأقسام" : "Department Distribution"}
                  </h3>
                  <div className="space-y-3">
                    {analytics.departmentDistribution.map((dept, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {dept.departmentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {isArabic ? "متوسط العمر:" : "Avg Age:"}{" "}
                            {dept.averageAge} |
                            {isArabic ? "متوسط الخدمة:" : "Avg Tenure:"}{" "}
                            {dept.averageTenure}m
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {dept.employeeCount}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(
                              (dept.employeeCount / analytics.totalEmployees) *
                              100
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Age Distribution */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isArabic ? "توزيع الأعمار" : "Age Distribution"}
                  </h3>
                  <div className="space-y-3">
                    {analytics.ageDistribution.map((ageGroup, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700">
                          {ageGroup.range} {isArabic ? "سنة" : "years"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${ageGroup.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {ageGroup.count} ({ageGroup.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gender & Nationality */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isArabic ? "توزيع الجنس" : "Gender Distribution"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {isArabic ? "ذكور" : "Male"}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full"
                            style={{
                              width: `${analytics.genderDistribution.malePercentage}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {analytics.genderDistribution.male} (
                          {analytics.genderDistribution.malePercentage.toFixed(
                            1
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {isArabic ? "إناث" : "Female"}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-pink-600 h-3 rounded-full"
                            style={{
                              width: `${analytics.genderDistribution.femalePercentage}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {analytics.genderDistribution.female} (
                          {analytics.genderDistribution.femalePercentage.toFixed(
                            1
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isArabic ? "توزيع الجنسيات" : "Nationality Distribution"}
                  </h3>
                  <div className="space-y-3">
                    {analytics.nationalityDistribution
                      .slice(0, 5)
                      .map((nationality, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-700">
                            {nationality.nationality}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${nationality.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {nationality.count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChart === "performance" && (
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analytics.performanceDistribution.excellent}
                  </div>
                  <div className="text-sm text-green-700">
                    {isArabic ? "ممتاز" : "Excellent"}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analytics.performanceDistribution.good}
                  </div>
                  <div className="text-sm text-blue-700">
                    {isArabic ? "جيد" : "Good"}
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {analytics.performanceDistribution.satisfactory}
                  </div>
                  <div className="text-sm text-yellow-700">
                    {isArabic ? "مرضي" : "Satisfactory"}
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {analytics.performanceDistribution.needsImprovement}
                  </div>
                  <div className="text-sm text-red-700">
                    {isArabic ? "يحتاج تحسين" : "Needs Improvement"}
                  </div>
                </div>
              </div>

              {/* Training Metrics */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isArabic ? "مؤشرات التدريب" : "Training Metrics"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.trainingMetrics.totalTrainingHours.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic
                        ? "إجمالي ساعات التدريب"
                        : "Total Training Hours"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.trainingMetrics.averageHoursPerEmployee}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "متوسط الساعات/موظف" : "Avg Hours/Employee"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analytics.trainingMetrics.completionRate}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "معدل الإنجاز" : "Completion Rate"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {analytics.trainingMetrics.trainingBudgetUtilization}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "استغلال الميزانية" : "Budget Utilization"}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">
                    {isArabic ? "أهم فئات التدريب" : "Top Training Categories"}
                  </h4>
                  {analytics.trainingMetrics.topTrainingCategories.map(
                    (category, index) => (
                      <div key={index} className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {category.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {category.participants}{" "}
                            {isArabic ? "مشارك" : "participants"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>
                                {category.hours} {isArabic ? "ساعة" : "hours"}
                              </span>
                              <span>{category.averageRating}/5.0 ⭐</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${
                                    (category.averageRating / 5) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {activeChart === "trends" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  {isArabic ? "اتجاهات القوى العاملة" : "Workforce Trends"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        +{analytics.newHires}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isArabic ? "نمو التوظيف" : "Hiring Growth"}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {isArabic ? "آخر 30 يوم" : "Last 30 days"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.averageTenure.toFixed(1)}m
                      </div>
                      <div className="text-sm text-gray-600">
                        {isArabic ? "متوسط البقاء" : "Avg Retention"}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {isArabic ? "شهر" : "months"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.performanceDistribution.averageRating}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isArabic ? "متوسط الأداء" : "Avg Performance"}
                      </div>
                      <div className="text-xs text-purple-600 mt-1">
                        {isArabic ? "من 5.0" : "out of 5.0"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">
                  {isArabic
                    ? "الرسوم البيانية التفاعلية"
                    : "Interactive Charts"}
                </p>
                <p className="text-sm">
                  {isArabic
                    ? "سيتم عرض اتجاهات مفصلة وتحليلات زمنية هنا"
                    : "Detailed trends and time-series analytics will be displayed here"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
