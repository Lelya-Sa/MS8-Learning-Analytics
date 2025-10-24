/**
 * Reusable Progress Bar Component
 * Used across analytics components for visual progress indication
 */

import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ 
  value, 
  max = 100, 
  height = 'h-6', 
  bgColor = 'bg-gray-200', 
  fillColor = 'bg-gradient-to-r from-blue-400 to-purple-600',
  showLabel = false,
  label = '',
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`progress-bar-container ${className}`}>
      {showLabel && label && (
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-semibold text-gray-700">{label}</span>
          <span className="font-bold text-gray-800">{value}{max === 100 ? '%' : `/${max}`}</span>
        </div>
      )}
      <div className={`relative w-full ${height} ${bgColor} rounded-full overflow-hidden`}>
        <div 
          className={`absolute top-0 left-0 h-full ${fillColor} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  height: PropTypes.string,
  bgColor: PropTypes.string,
  fillColor: PropTypes.string,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default ProgressBar;

