import React from "react";

const RecruitmentTab = ({ recruitmentPipeline, isArabic, loading }) => {
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">
          {isArabic ? "حالة التوظيف" : "Recruitment Status"}
        </h3>
        <p className="text-sm text-blue-700">
          {recruitmentPipeline.length} {isArabic ? "مناصب مفتوحة" : "open positions"}
        </p>
      </div>

      <div className="grid gap-6">
        {recruitmentPipeline.map((position, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? position.positionAr : position.position}
                </h3>
                <p className="text-sm text-gray-600">{position.department}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <span>{isArabic ? "مدير التوظيف:" : "Hiring Manager:"} {position.hiringManager}</span>
                  <span>•</span>
                  <span>{isArabic ? "الميزانية:" : "Budget:"} {position.budgetAllocated?.toLocaleString()} SAR</span>
                </div>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getUrgencyColor(position.urgency)}`}>
                {position.urgency} Priority
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">{isArabic ? "المتقدمون" : "Applicants"}</div>
                <div className="text-lg font-semibold text-gray-900">{position.applicants}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">{isArabic ? "المقابلات" : "Interviewed"}</div>
                <div className="text-lg font-semibold text-gray-900">{position.interviewed}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">{isArabic ? "القائمة المختصرة" : "Shortlisted"}</div>
                <div className="text-lg font-semibold text-gray-900">{position.shortlisted}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">{isArabic ? "الحالة" : "Status"}</div>
                <div className="text-sm font-semibold text-blue-600">{position.status}</div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-medium text-gray-800 mb-2">
                {isArabic ? "المهارات المطلوبة:" : "Required Skills:"}
              </h5>
              <div className="flex flex-wrap gap-2">
                {position.skillsRequired?.map((skill, skillIndex) => (
                  <span key={skillIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {isArabic ? "تاريخ البدء المتوقع:" : "Expected Start Date:"} {position.expectedStartDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruitmentTab;