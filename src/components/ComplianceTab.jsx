const ComplianceTab = ({ complianceItems, isArabic, loading }) => {
  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          {isArabic ? "تنبيهات الامتثال" : "Compliance Alerts"}
        </h3>
        <p className="text-sm text-yellow-700">
          {isArabic ? "مراقبة حالة الامتثال للمتطلبات القانونية" : "Monitor compliance status for legal requirements"}
        </p>
      </div>

      <div className="grid gap-6">
        {complianceItems.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic ? item.itemAr : item.item}
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{item.percentage}%</div>
                <div className="text-sm text-gray-600">{isArabic ? "متوافق" : "Compliant"}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">{isArabic ? "الإجمالي" : "Total"}</div>
                <div className="text-lg font-semibold text-gray-900">{item.total}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-green-600">{isArabic ? "متوافق" : "Compliant"}</div>
                <div className="text-lg font-semibold text-green-900">{item.compliant}</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-sm text-yellow-600">{isArabic ? "معلق" : "Pending"}</div>
                <div className="text-lg font-semibold text-yellow-900">{item.pending}</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="text-sm text-red-600">{isArabic ? "متأخر" : "Overdue"}</div>
                <div className="text-lg font-semibold text-red-900">{item.overdue}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <span className="font-medium text-gray-700">{isArabic ? "الموعد النهائي:" : "Deadline:"}</span>
                <div className="text-gray-900">{item.deadline}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">{isArabic ? "المسؤول:" : "Responsible:"}</span>
                <div className="text-gray-900">{item.responsible}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">{isArabic ? "الأولوية:" : "Priority:"}</span>
                <div className={`font-semibold ${
                  item.priority === "Critical" ? "text-red-600" :
                  item.priority === "High" ? "text-orange-600" :
                  item.priority === "Medium" ? "text-yellow-600" : "text-green-600"
                }`}>
                  {item.priority}
                </div>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{isArabic ? "معدل الامتثال" : "Compliance Rate"}</span>
                <span>{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.percentage >= 95 ? "bg-green-600" :
                    item.percentage >= 85 ? "bg-yellow-600" : "bg-red-600"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceTab;