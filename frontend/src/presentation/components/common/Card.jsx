import React from 'react';
import { render, screen } from '@testing-library/react';

/**
 * @component Card
 * @description Reusable card component with variants and states
 */
export const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'medium', 
  className = '',
  hover = false,
  ...props 
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-md transition-shadow duration-200';
  
  const variantClasses = {
    default: 'border border-gray-200 dark:border-gray-700',
    elevated: 'shadow-lg',
    outlined: 'border-2 border-emerald-200 dark:border-emerald-700',
    flat: 'shadow-none border border-gray-100 dark:border-gray-800'
  };
  
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8'
  };
  
  const hoverClasses = hover ? 'hover:shadow-lg cursor-pointer' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

/**
 * @component CardHeader
 * @description Card header component
 */
export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * @component CardTitle
 * @description Card title component
 */
export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`} {...props}>
      {children}
    </h3>
  );
};

/**
 * @component CardContent
 * @description Card content component
 */
export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`text-gray-600 dark:text-gray-400 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * @component CardFooter
 * @description Card footer component
 */
export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
