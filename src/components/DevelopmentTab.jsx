const DevelopmentTab = ({ isArabic, loading }) => {
  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {isArabic ? "التطوير المهني والمسار الوظيفي" : "Professional Development & Career Paths"}
      </h3>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          {isArabic ? "برامج التطوير المهني" : "Professional Development Programs"}
        </h4>
        <p className="text-sm text-blue-700">
          {isArabic 
            ? "خطط تطوير شخصية ومسارات وظيفية واضحة لجميع الموظفين"
            : "Personalized development plans and clear career paths for all employees"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">24</div>
          <div className="text-sm text-green-700">
            {isArabic ? "خطط التطوير النشطة" : "Active Development Plans"}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">18</div>
          <div className="text-sm text-blue-700">
            {isArabic ? "ترقيات هذا العام" : "Promotions This Year"}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">156K</div>
          <div className="text-sm text-purple-700">
            {isArabic ? "ميزانية التطوير (ريال)" : "Development Budget (SAR)"}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        {isArabic
          ? "سيتم عرض خطط التطوير المهني والمسارات الوظيفية التفصيلية هنا..."
          : "Detailed professional development plans and career paths will be displayed here..."
        }
      </div>
    </div>
  );
};

// Export all components
export default DevelopmentTab;