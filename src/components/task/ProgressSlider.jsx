import React, { useState, useRef } from "react";

const ProgressSlider = ({ 
  value, 
  onChange, 
  disabled, 
  isArabic 
}) => {
  const [hoverValue, setHoverValue] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const sliderRef = useRef(null);

  const handleMouseMove = (e) => {
    if (disabled || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    setHoverValue(clampedPercentage);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setHoverValue(null);
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-3 ml-auto">
      <label className="text-sm text-gray-600">
        {isArabic ? "التقدم:" : "Progress:"}
      </label>
      
      <div className="relative">
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
          className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 slider-custom"
        />
        
        {/* Hover Tooltip */}
        {showTooltip && hoverValue !== null && !disabled && (
          <div 
            className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none z-10 transform -translate-x-1/2"
            style={{ 
              left: `${(hoverValue / 100) * 100}%`,
              transition: 'left 0.1s ease-out'
            }}
          >
            {hoverValue}%
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
      
      <span className="text-sm text-gray-600 min-w-12">
        {value}%
      </span>

      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-custom::-webkit-slider-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
        }
        
        .slider-custom::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-custom::-moz-range-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
        }

        .slider-custom:disabled::-webkit-slider-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
        
        .slider-custom:disabled::-moz-range-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ProgressSlider;