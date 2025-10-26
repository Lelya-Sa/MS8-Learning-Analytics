import React from 'react';

/**
 * @component Spinner
 * @description Reusable loading spinner component
 */
export const Spinner = ({ 
  size = 'medium',
  variant = 'primary',
  className = '',
  label = 'Loading',
  speed = 'normal',
  inline = false,
  centered = false,
  color,
  overlay = false,
  type = 'spinner',
  children,
  ...props 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    primary: 'text-emerald-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    dark: 'text-gray-900'
  };

  const speedClasses = {
    slow: 'animate-spin',
    normal: 'animate-spin',
    fast: 'animate-spin'
  };

  const spinnerContent = (
    <div
      role="status"
      aria-label={label}
      className={`
        ${sizeClasses[size]} 
        ${color || variantClasses[variant]} 
        ${speedClasses[speed]}
        ${inline ? 'inline-block' : 'block'}
        ${className}
      `}
      {...props}
    >
      {type === 'spinner' && (
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {type === 'dots' && (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
      
      {type === 'pulse' && (
        <div className="w-full h-full bg-current rounded-full animate-pulse" />
      )}
      
      <span className="sr-only">{label}</span>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          {spinnerContent}
          {children}
        </div>
      </div>
    );
  }

  if (centered) {
    return (
      <div className="flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

/**
 * @component LoadingSpinner
 * @description Simple loading spinner with text
 */
export const LoadingSpinner = ({ 
  text = 'Loading...',
  size = 'medium',
  variant = 'primary',
  className = '',
  ...props 
}) => (
  <div className={`flex flex-col items-center space-y-2 ${className}`} {...props}>
    <Spinner size={size} variant={variant} />
    {text && <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>}
  </div>
);

/**
 * @component InlineSpinner
 * @description Inline spinner for buttons and small spaces
 */
export const InlineSpinner = ({ 
  size = 'small',
  variant = 'white',
  className = '',
  ...props 
}) => (
  <Spinner 
    size={size} 
    variant={variant} 
    inline 
    className={className}
    {...props} 
  />
);

export default Spinner;
