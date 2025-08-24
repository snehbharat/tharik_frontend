import React from "react";

const TaskRequirements = ({ requirements, isArabic }) => (
  <div className="mb-4">
    <h4 className="font-medium text-gray-900 mb-2">
      {isArabic ? "المتطلبات:" : "Requirements:"}
    </h4>
    <div className="bg-white rounded-lg p-3 text-sm">
      {Object.entries(requirements).map(([key, value]) => {
        // Only show non-empty values
        if (!value || (Array.isArray(value) && value.length === 0) || value === 0) {
          return null;
        }
        return (
          <div key={key} className="flex justify-between py-1">
            <span className="text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, " $1")}:
            </span>
            <span className="text-gray-900">
              {Array.isArray(value) ? value.join(", ") : value}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export default TaskRequirements;