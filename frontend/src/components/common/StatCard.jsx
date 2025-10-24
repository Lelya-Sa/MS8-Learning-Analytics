/**
 * Reusable Stat Card Component
 * Displays key metrics with consistent styling
 */

import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ 
  label, 
  value, 
  icon = '', 
  bgColor = 'bg-blue-50', 
  textColor = 'text-blue-700',
  valueSize = 'text-3xl',
  className = '',
  trend = null, // { direction: 'up'|'down', value: '5%' }
}) => {
  const trendIcon = trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '';
  const trendColor = trend?.direction === 'up' ? 'text-green-600' : trend?.direction === 'down' ? 'text-red-600' : '';
  
  return (
    <div className={`stat-card ${bgColor} p-4 rounded-lg text-center ${className}`}>
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`${valueSize} font-bold ${textColor}`}>{value}</p>
      {trend && (
        <p className={`text-xs ${trendColor} mt-1`}>
          {trendIcon} {trend.value}
        </p>
      )}
    </div>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  valueSize: PropTypes.string,
  className: PropTypes.string,
  trend: PropTypes.shape({
    direction: PropTypes.oneOf(['up', 'down']),
    value: PropTypes.string,
  }),
};

export default StatCard;

