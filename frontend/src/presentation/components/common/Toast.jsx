import React, { useEffect, useState } from 'react';

/**
 * @component Toast
 * @description Reusable toast notification component
 */
export const Toast = ({ 
  message,
  type = 'info',
  position = 'top-right',
  duration = 3000,
  onClose,
  className = '',
  icon,
  title,
  action,
  isVisible = true,
  size = 'medium',
  onClick,
  ...props 
}) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (duration > 0 && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, visible, onClose]);

  const typeClasses = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setVisible(false);
    onClose?.();
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`
        fixed z-50 max-w-sm w-full shadow-lg rounded-lg
        ${typeClasses[type]} ${positionClasses[position]} ${sizeClasses[size]}
        transform transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        ${className}
      `}
      role="alert"
      aria-live="polite"
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0 mr-3">
            {icon}
          </div>
        )}
        
        <div className="flex-1">
          {title && (
            <div className="font-semibold text-sm mb-1">
              {title}
            </div>
          )}
          <div className="text-sm">
            {message}
          </div>
          {action && (
            <div className="mt-2">
              {action}
            </div>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-3 text-white hover:text-gray-200 transition-colors"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * @component ToastContainer
 * @description Container for managing multiple toasts
 */
export const ToastContainer = ({ children, position = 'top-right', className = '' }) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]} space-y-2 ${className}`}>
      {children}
    </div>
  );
};
