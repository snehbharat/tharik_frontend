import React, { useState } from "react";
import {
  Target,
  Award,
  TrendingUp,
  Calendar,
  User,
  Star,
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Edit,
  Eye,
  Save,
  X,
} from "lucide-react";

export const PerformanceManagement = ({ employees, isArabic }) => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [showNewReview, setShowNewReview] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);

  // Mock performance data
  const performanceReviews = [
    {
      id: "rev_001",
      employeeId: "emp_001",
      employeeName: "Ahmed Al-Rashid",
      reviewPeriod: { startDate: "2024-01-01", endDate: "2024-06-30" },
      reviewType: "mid-year",
      status: "completed",
      overallRating: 4.2,
      completedDate: "2024-07-15",
      reviewerId: "mgr_001",
      reviewerName: "Operations Manager",
      ratings: [
        { competency: "Technical Skills", rating: 4, maxRating: 5 },
        { competency: "Leadership", rating: 5, maxRating: 5 },
        { competency: "Communication", rating: 4, maxRating: 5 },
        { competency: "Problem Solving", rating: 4, maxRating: 5 },
      ],
      strengths: [
        "Excellent leadership skills",
        "Strong technical knowledge",
        "Great team collaboration",
      ],
      areasForImprovement: ["Time management", "Documentation"],
      goals: ["Complete advanced safety training", "Mentor 2 junior employees"],
      nextReviewDate: "2025-01-15",
    },
    {
      id: "rev_002",
      employeeId: "emp_001",
      employeeName: "Ahmed Al-Rashid",
      reviewPeriod: { startDate: "2024-07-01", endDate: "2024-12-31" },
      reviewType: "annual",
      status: "scheduled",
      scheduledDate: "2025-01-15",
      reviewerId: "mgr_001",
      reviewerName: "Operations Manager",
    },
  ];

  const performanceGoals = [
    {
      id: "goal_001",
      employeeId: "emp_001",
      employeeName: "Ahmed Al-Rashid",
      title: "Complete Advanced Safety Training",
      description:
        "Obtain advanced safety certification to enhance site safety protocols",
      category: "individual",
      type: "qualitative",
      weight: 30,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
      progress: 75,
      milestones: [
        {
          id: "m1",
          title: "Enroll in training program",
          status: "completed",
          completedAt: "2024-02-15",
        },
        {
          id: "m2",
          title: "Complete theoretical modules",
          status: "completed",
          completedAt: "2024-08-30",
        },
        {
          id: "m3",
          title: "Pass practical assessment",
          status: "pending",
          targetDate: "2024-12-15",
        },
      ],
    },
    {
      id: "goal_002",
      employeeId: "emp_001",
      employeeName: "Ahmed Al-Rashid",
      title: "Mentor Junior Employees",
      description: "Provide guidance and mentorship to 2 junior team members",
      category: "team",
      type: "quantitative",
      targetValue: 2,
      currentValue: 1,
      weight: 25,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
      progress: 50,
    },
  ];

  const developmentPlans = [
    {
      employeeId: "emp_001",
      employeeName: "Ahmed Al-Rashid",
      objectives: [
        "Enhance leadership capabilities",
        "Develop technical expertise",
      ],
      trainingNeeds: [
        {
          skill: "Advanced Project Management",
          currentLevel: 3,
          targetLevel: 5,
          priority: "high",
        },
        {
          skill: "Digital Construction Tools",
          currentLevel: 2,
          targetLevel: 4,
          priority: "medium",
        },
      ],
      careerPath: "Senior Site Manager → Project Director",
      mentorAssignment: "Senior Project Director",
      timeline: "12 months",
      budget: 15000,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "active":
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating, maxRating = 5) => {
    return Array.from({ length: maxRating }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">24</div>
              <div className="text-sm text-blue-700">
                {isArabic ? "أهداف نشطة" : "Active Goals"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">18</div>
              <div className="text-sm text-green-700">
                {isArabic ? "مراجعات مكتملة" : "Reviews Completed"}
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
              <div className="text-2xl font-bold text-purple-900">4.2</div>
              <div className="text-sm text-purple-700">
                {isArabic ? "متوسط الأداء" : "Avg Performance"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">12</div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "خطط التطوير" : "Development Plans"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Management Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "reviews"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {isArabic ? "مراجعات الأداء" : "Performance Reviews"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "goals"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? "الأهداف" : "Goals & Objectives"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("development")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "development"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {isArabic ? "التطوير المهني" : "Development Plans"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "مراجعات الأداء" : "Performance Reviews"}
                </h3>
                <button
                  onClick={() => setShowNewReview(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isArabic ? "مراجعة جديدة" : "New Review"}
                </button>
              </div>

              <div className="space-y-4">
                {performanceReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {review.employeeName}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{review.reviewType} Review</span>
                          <span>•</span>
                          <span>
                            {review.reviewPeriod.startDate} -{" "}
                            {review.reviewPeriod.endDate}
                          </span>
                          <span>•</span>
                          <span>
                            {isArabic ? "المراجع:" : "Reviewer:"}{" "}
                            {review.reviewerName}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            review.status
                          )}`}
                        >
                          {review.status}
                        </span>
                        {review.overallRating && (
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-yellow-600">
                              {review.overallRating}
                            </span>
                            <div className="flex">
                              {getRatingStars(Math.round(review.overallRating))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {review.status === "completed" && review.ratings && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-3">
                            {isArabic ? "تقييم الكفاءات" : "Competency Ratings"}
                          </h5>
                          <div className="space-y-3">
                            {review.ratings.map((rating, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span className="text-gray-700">
                                  {rating.competency}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {getRatingStars(
                                      rating.rating,
                                      rating.maxRating
                                    )}
                                  </div>
                                  <span className="text-sm font-medium">
                                    {rating.rating}/{rating.maxRating}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-800 mb-3">
                            {isArabic ? "نقاط القوة" : "Strengths"}
                          </h5>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {review.strengths?.map((strength, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>

                          <h5 className="font-semibold text-gray-800 mb-3 mt-4">
                            {isArabic
                              ? "مجالات التحسين"
                              : "Areas for Improvement"}
                          </h5>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {review.areasForImprovement?.map((area, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <Target className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-4">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? "الأهداف والمقاييس" : "Goals & Objectives"}
                </h3>
                <button
                  onClick={() => setShowNewGoal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isArabic ? "هدف جديد" : "New Goal"}
                </button>
              </div>

              <div className="space-y-4">
                {performanceGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {goal.title}
                        </h4>
                        <p className="text-gray-600 mt-1">{goal.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                          <span>{goal.employeeName}</span>
                          <span>•</span>
                          <span>{goal.category} goal</span>
                          <span>•</span>
                          <span>
                            {isArabic ? "الوزن:" : "Weight:"} {goal.weight}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            goal.status
                          )}`}
                        >
                          {goal.status}
                        </span>
                        <div className="text-2xl font-bold text-blue-600 mt-2">
                          {goal.progress}%
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{isArabic ? "التقدم" : "Progress"}</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {goal.milestones && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3">
                          {isArabic ? "المعالم" : "Milestones"}
                        </h5>
                        <div className="space-y-2">
                          {goal.milestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              className="flex items-center gap-3 p-2 bg-white rounded"
                            >
                              {milestone.status === "completed" ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-600" />
                              )}
                              <span
                                className={`text-sm ${
                                  milestone.status === "completed"
                                    ? "text-gray-900"
                                    : "text-gray-600"
                                }`}
                              >
                                {milestone.title}
                              </span>
                              {milestone.completedAt && (
                                <span className="text-xs text-green-600 ml-auto">
                                  {isArabic ? "مكتمل:" : "Completed:"}{" "}
                                  {milestone.completedAt}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-4">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "development" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic
                  ? "خطط التطوير المهني"
                  : "Professional Development Plans"}
              </h3>

              <div className="space-y-6">
                {developmentPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {plan.employeeName}
                        </h4>
                        <p className="text-gray-600">
                          {isArabic ? "المسار المهني:" : "Career Path:"}{" "}
                          {plan.careerPath}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {plan.budget.toLocaleString()} SAR
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "ميزانية التطوير" : "Development Budget"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3">
                          {isArabic ? "الأهداف" : "Objectives"}
                        </h5>
                        <ul className="space-y-2">
                          {plan.objectives.map((objective, objIndex) => (
                            <li
                              key={objIndex}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              {objective}
                            </li>
                          ))}
                        </ul>

                        <h5 className="font-semibold text-gray-800 mb-3 mt-4">
                          {isArabic ? "معلومات إضافية" : "Additional Info"}
                        </h5>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>
                            {isArabic ? "المرشد:" : "Mentor:"}{" "}
                            {plan.mentorAssignment}
                          </div>
                          <div>
                            {isArabic ? "الجدول الزمني:" : "Timeline:"}{" "}
                            {plan.timeline}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3">
                          {isArabic ? "احتياجات التدريب" : "Training Needs"}
                        </h5>
                        <div className="space-y-3">
                          {plan.trainingNeeds.map((need, needIndex) => (
                            <div
                              key={needIndex}
                              className="bg-white rounded-lg p-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">
                                  {need.skill}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    need.priority === "high"
                                      ? "bg-red-100 text-red-800"
                                      : need.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {need.priority}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>
                                  {isArabic ? "الحالي:" : "Current:"}{" "}
                                  {need.currentLevel}/5
                                </span>
                                <span>→</span>
                                <span>
                                  {isArabic ? "الهدف:" : "Target:"}{" "}
                                  {need.targetLevel}/5
                                </span>
                              </div>
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                      width: `${
                                        (need.currentLevel / need.targetLevel) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Review Modal */}
      {showNewReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "مراجعة أداء جديدة" : "New Performance Review"}
              </h3>
              <button
                onClick={() => setShowNewReview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الموظف" : "Employee"}
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">
                    {isArabic ? "اختر الموظف" : "Select Employee"}
                  </option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {isArabic
                        ? emp.personalInfo.fullNameAr
                        : emp.personalInfo.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "نوع المراجعة" : "Review Type"}
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="annual">
                      {isArabic ? "سنوية" : "Annual"}
                    </option>
                    <option value="mid-year">
                      {isArabic ? "نصف سنوية" : "Mid-Year"}
                    </option>
                    <option value="probation">
                      {isArabic ? "فترة التجربة" : "Probation"}
                    </option>
                    <option value="project-based">
                      {isArabic ? "على أساس المشروع" : "Project-Based"}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ المراجعة" : "Review Date"}
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {isArabic ? "إنشاء المراجعة" : "Create Review"}
                </button>
                <button
                  onClick={() => setShowNewReview(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
