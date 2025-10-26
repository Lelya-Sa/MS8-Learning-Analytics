/**
 * Reusable Gradient Section Component
 * Provides consistent gradient backgrounds for analytics sections
 */

import React from 'react';
import PropTypes from 'prop-types';

const gradientPresets = {
  purple: 'from-purple-50 to-pink-50',
  blue: 'from-blue-50 to-purple-50',
  indigo: 'from-indigo-50 to-blue-50',
  yellow: 'from-yellow-50 to-orange-50',
  green: 'from-green-50 to-green-100',
  orange: 'from-orange-50 to-orange-100',
  amber: 'from-yellow-50 to-amber-50',
};

const GradientSection = ({ 
  children, 
  gradient = 'purple', 
  padding = 'p-5', 
  rounded = 'rounded-lg',
  className = '',
  title = '',
  icon = ''
}) => {
  const gradientClass = gradientPresets[gradient] || gradient;
  
  return (
    <div className={`bg-gradient-to-r ${gradientClass} ${padding} ${rounded} ${className}`}>
      {title && (
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h4>
      )}
      {children}
    </div>
  );
};

GradientSection.propTypes = {
  children: PropTypes.node.isRequired,
  gradient: PropTypes.oneOfType([
    PropTypes.oneOf(['purple', 'blue', 'indigo', 'yellow', 'green', 'orange', 'amber']),
    PropTypes.string
  ]),
  padding: PropTypes.string,
  rounded: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.string,
};

export default GradientSection;

