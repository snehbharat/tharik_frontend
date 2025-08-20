const TrainingTab = ({ trainingPrograms, isArabic, loading }) => {
  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">
          {isArabic ? "برامج التدريب النشطة" : "Active Training Programs"}
        </h3>
        <p className="text-sm text-green-700">
          {trainingPrograms.length} {isArabic ? "برامج تدريبية نشطة" : "active training programs"}
        </p>
      </div>

      <div className="grid gap-6">
        {trainingPrograms.map((program, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? program.nameAr : program.name}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>{program.participants} {isArabic ? "مشارك" : "participants"}</span>
                  <span>{program.duration}</span>
                  <span>{isArabic ? "المدرب:" : "Instructor:"} {program.instructor}</span>
                  <span>{isArabic ? "التكلفة:" : "Cost:"} {program.cost?.toLocaleString()} SAR</span>
                  {program.mandatory && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      {isArabic ? "إجباري" : "Mandatory"}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{program.completion}%</div>
                <div className="text-sm text-gray-600">{isArabic ? "مكتمل" : "Complete"}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{isArabic ? "التقدم" : "Progress"}</span>
                <span>{program.completion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${program.completion}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">{isArabic ? "الموقع:" : "Location:"}</span>
                <div className="text-gray-900">{program.location}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">{isArabic ? "الشهادة:" : "Certification:"}</span>
                <div className="text-gray-900">{program.certification}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">{isArabic ? "الجلسة القادمة:" : "Next Session:"}</span>
                <div className="text-gray-900">{program.nextSession}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingTab;