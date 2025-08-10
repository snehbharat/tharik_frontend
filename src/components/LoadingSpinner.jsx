import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ size = "md", text, className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-blue-600`}
        aria-hidden="true"
      />
      {text && (
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>{text}</span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Full page loading component
export const PageLoader = ({ text = "Loading..." }) => {
  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Loader2
            className="w-8 h-8 text-white animate-spin"
            aria-hidden="true"
          />
        </div>
        <p className="text-gray-600 text-lg">{text}</p>
        <span className="sr-only">Loading content, please wait...</span>
      </div>
    </div>
  );
};

// Inline loading component
export const InlineLoader = ({ text }) => {
  return (
    <div
      className="flex items-center justify-center py-8"
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="md" text={text} />
    </div>
  );
};

// Button loading state
export const ButtonLoader = () => {
  return <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />;
};
