import React from 'react';
import { Users, CheckCircle, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtitle, bgColor, iconColor, textColor }) => (
  <div className={`${bgColor} rounded-xl p-6 border ${bgColor.replace('bg-', 'border-')}`}>
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
        <div className={`text-sm ${textColor.replace('900', '700')}`}>{title}</div>
      </div>
    </div>
    <div className={`text-xs ${textColor.replace('900', '600')}`}>{subtitle}</div>
  </div>
);

const EmployeeStatistics = ({ employees, isArabic, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-xl p-6 h-32"></div>
        ))}
      </div>
    );
  }

  // Calculate statistics
  const calculateStats = () => {
    const total = employees?.length || 0;
    const active = employees?.filter(emp => emp.status === 'active').length || 0;
    const onLeave = employees?.filter(emp => emp.status === 'on-leave').length || 0;
    const inactive = employees?.filter(emp => emp.status === 'inactive').length || 0;
    
    // Calculate new hires (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newHires = employees?.filter(emp => {
      if (!emp.professionalInfo?.hireDate) return false;
      const hireDate = new Date(emp.professionalInfo.hireDate);
      return hireDate >= thirtyDaysAgo;
    }).length || 0;

    // Calculate retention rate
    const retentionRate = total > 0 ? ((active / total) * 100) : 0;

    return { total, active, onLeave, inactive, newHires, retentionRate };
  };

  const stats = calculateStats();

  const statisticsData = [
    {
      icon: Users,
      title: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
      value: stats.total,
      subtitle: isArabic ? 'عبر جميع الأقسام' : 'Across all departments',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'bg-blue-600',
      textColor: 'text-blue-900'
    },
    {
      icon: CheckCircle,
      title: isArabic ? 'موظفون نشطون' : 'Active Employees',
      value: stats.active,
      subtitle: `${stats.retentionRate.toFixed(1)}% ${isArabic ? 'من الإجمالي' : 'of total'}`,
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      iconColor: 'bg-green-600',
      textColor: 'text-green-900'
    },
    {
      icon: TrendingUp,
      title: isArabic ? 'توظيف جديد' : 'New Hires',
      value: stats.newHires,
      subtitle: isArabic ? 'آخر 30 يوم' : 'Last 30 days',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconColor: 'bg-purple-600',
      textColor: 'text-purple-900'
    },
    {
      icon: Clock,
      title: isArabic ? 'في إجازة' : 'On Leave',
      value: stats.onLeave,
      subtitle: isArabic ? 'حالياً' : 'Currently',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      iconColor: 'bg-yellow-600',
      textColor: 'text-yellow-900'
    }
  ];

  // Additional statistics that could be shown
  const additionalStats = [
    {
      icon: AlertTriangle,
      title: isArabic ? 'غير نشطون' : 'Inactive',
      value: stats.inactive,
      subtitle: isArabic ? 'يحتاج متابعة' : 'Needs attention',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      iconColor: 'bg-red-600',
      textColor: 'text-red-900'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statisticsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Additional Statistics */}
      {stats.inactive > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {additionalStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      )}

      {/* Quick Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isArabic ? 'نظرة سريعة' : 'Quick Insights'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.retentionRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              {isArabic ? 'معدل الاحتفاظ' : 'Retention Rate'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total > 0 ? ((stats.newHires / stats.total) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600">
              {isArabic ? 'معدل التوظيف الجديد' : 'New Hire Rate'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.total > 0 ? ((stats.onLeave / stats.total) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600">
              {isArabic ? 'معدل الإجازات' : 'Leave Rate'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeStatistics;