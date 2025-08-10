import React from "react";
import { DivideIcon as LucideIcon } from "lucide-react";

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  borderColor,
  iconColor = "text-white",
  trend,
  onClick,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-6 border ${borderColor} ${
        onClick
          ? "cursor-pointer hover:shadow-lg transform hover:scale-105"
          : ""
      } transition-all duration-300 hover:shadow-2xl backdrop-blur-sm border-opacity-50`}
      onClick={onClick}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={`${title}: ${value}${subtitle ? `, ${subtitle}` : ""}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 bg-opacity-80 rounded-lg flex items-center justify-center ${
            gradient.includes("blue")
              ? "bg-blue-600"
              : gradient.includes("green")
              ? "bg-green-600"
              : gradient.includes("purple")
              ? "bg-purple-600"
              : gradient.includes("yellow")
              ? "bg-yellow-600"
              : gradient.includes("red")
              ? "bg-red-600"
              : "bg-gray-600"
          } shadow-lg`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div
            className={`text-2xl font-bold ${
              gradient.includes("blue")
                ? "text-blue-900"
                : gradient.includes("green")
                ? "text-green-900"
                : gradient.includes("purple")
                ? "text-purple-900"
                : gradient.includes("yellow")
                ? "text-yellow-900"
                : gradient.includes("red")
                ? "text-red-900"
                : "text-gray-900"
            } tracking-tight`}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          <div
            className={`text-sm ${
              gradient.includes("blue")
                ? "text-blue-700"
                : gradient.includes("green")
                ? "text-green-700"
                : gradient.includes("purple")
                ? "text-purple-700"
                : gradient.includes("yellow")
                ? "text-yellow-700"
                : gradient.includes("red")
                ? "text-red-700"
                : "text-gray-700"
            } font-medium tracking-tight`}
          >
            {title}
          </div>
        </div>
      </div>

      {subtitle && (
        <div
          className={`text-xs ${
            gradient.includes("blue")
              ? "text-blue-600"
              : gradient.includes("green")
              ? "text-green-600"
              : gradient.includes("purple")
              ? "text-purple-600"
              : gradient.includes("yellow")
              ? "text-yellow-600"
              : gradient.includes("red")
              ? "text-red-600"
              : "text-gray-600"
          } font-medium opacity-90`}
        >
          {subtitle}
        </div>
      )}

      {trend && (
        <div
          className={`flex items-center gap-1 text-xs mt-2 font-medium ${
            trend.isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          <span aria-hidden="true">{trend.isPositive ? "↗" : "↘"}</span>
          <span>{trend.value}</span>
          <span className="sr-only">
            {trend.isPositive ? "Increasing" : "Decreasing"} by {trend.value}
          </span>
        </div>
      )}
    </div>
  );
};
