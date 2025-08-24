import React from "react";

const ProgressBar = ({ progress, isArabic }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-medium text-gray-900">
        {isArabic ? "التقدم:" : "Progress:"}
      </h4>
      <span className="text-sm font-medium text-gray-600">{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
      <div
        className="bg-green-600 h-2 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default ProgressBar;