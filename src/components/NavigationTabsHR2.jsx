import React from "react";
import {
  BarChart3,
  Briefcase,
  Calendar,
  PieChart,
  TrendingUp,
  Building,
  Users,
} from "lucide-react";
import { formatCurrency } from "../utils/financialCalculations";

export const NavigationTabsHR2 = ({
  activeView,
  setActiveView,
  isArabic,
  payrollSummary,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="border-b border-gray-200">
        {/* Navigation tabs */}
        <nav className="flex">
          {[
            // { view: "dashboard", icon: BarChart3, label: isArabic ? "مركز القيادة" : "Command Center" },
            // {
            //   view: "employees",
            //   icon: Users,
            //   label: isArabic ? "إدارة الموظفين" : "Employee Management",
            // },
            // {
            //   view: "projects",
            //   icon: Briefcase,
            //   label: isArabic ? "إدارة المشاريع" : "Project Management",
            // },
            {
              view: "attendance",
              icon: Calendar,
              label: isArabic ? "تتبع الحضور" : "Attendance Tracking",
            },
            // {
            //   view: "department",
            //   icon: Building,
            //   label: isArabic ? "قسم" : "Department",
            // },
            // {
            //   view: "analytics",
            //   icon: PieChart,
            //   label: isArabic ? "التحليلات المتقدمة" : "Advanced Analytics",
            // },
            // {
            //   view: "reports",
            //   icon: TrendingUp,
            //   label: isArabic ? "مركز ذكاء الأرباح" : "Profit Intelligence",
            // },
          ].map(({ view, icon: Icon, label }) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === view
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </button>
          ))}
        </nav>
        {/* Payroll summary display */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center shadow-md">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {formatCurrency(payrollSummary.totalBudget)
                  .replace("SAR", "")
                  .trim()}
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "إجمالي ميزانية المشاريع" : "Total Project Budget"}
              </div>
            </div>
          </div>
          <div className="text-xs text-yellow-600">
            {payrollSummary.projectCount} {isArabic ? "مشروع" : "projects"}
          </div>
        </div>
      </div>
    </div>
  );
};
