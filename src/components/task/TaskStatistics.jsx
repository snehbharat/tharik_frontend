import React from "react";

// Statistics Card Component
const StatCard = ({ value, label, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-lg p-4`}>
    <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
    <div className={`text-sm ${textColor.replace('600', '700')}`}>{label}</div>
  </div>
);

// Task Statistics Component
const TaskStatistics = ({ tasks, isArabic }) => {
  const activeTasksCount = tasks.filter((t) =>
    ["Active", "In Progress", "Pending"].includes(t.status)
  ).length;
  const completedTasksCount = tasks.filter((t) => t.status === "Completed").length;
  const overdueTasksCount = tasks.filter((t) => t.status === "Overdue").length;
  const highPriorityCount = tasks.filter((t) => t.priority === "High").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <StatCard
        value={activeTasksCount}
        label={isArabic ? "مهام نشطة" : "Active Tasks"}
        bgColor="bg-blue-50"
        textColor="text-blue-600"
      />
      <StatCard
        value={completedTasksCount}
        label={isArabic ? "مكتملة هذا الشهر" : "Completed This Month"}
        bgColor="bg-green-50"
        textColor="text-green-600"
      />
      <StatCard
        value={overdueTasksCount}
        label={isArabic ? "متأخرة" : "Overdue"}
        bgColor="bg-red-50"
        textColor="text-red-600"
      />
      <StatCard
        value={highPriorityCount}
        label={isArabic ? "أولوية عالية" : "High Priority"}
        bgColor="bg-yellow-50"
        textColor="text-yellow-600"
      />
      <StatCard
        value="89%"
        label={isArabic ? "معدل الإنجاز" : "Completion Rate"}
        bgColor="bg-purple-50"
        textColor="text-purple-600"
      />
    </div>
  );
};

export default TaskStatistics;