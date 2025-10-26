/**
 * @file ApiErrorHandler.jsx
 * @description Component for handling API errors gracefully
 */

import React, { useState, useEffect } from 'react';

const ApiErrorHandler = ({ 
  error, 
  onRetry, 
  onDismiss, 
  showDetails = false,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
    }
  }, [error]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    if (onRetry) {
      onRetry();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!error || !isVisible) {
    return null;
  }

  const getErrorType = (error) => {
    if (error.message?.includes('Network error')) return 'network';
    if (error.message?.includes('401')) return 'unauthorized';
    if (error.message?.includes('403')) return 'forbidden';
    if (error.message?.includes('404')) return 'notFound';
    if (error.message?.includes('500')) return 'server';
    return 'unknown';
  };

  const getErrorConfig = (errorType) => {
    const configs = {
      network: {
        icon: '🌐',
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        color: 'yellow'
      },
      unauthorized: {
        icon: '🔐',
        title: 'Authentication Required',
        message: 'Your session has expired. Please log in again.',
        color: 'red'
      },
      forbidden: {
        icon: '🚫',
        title: 'Access Denied',
        message: 'You do not have permission to perform this action.',
        color: 'red'
      },
      notFound: {
        icon: '🔍',
        title: 'Not Found',
        message: 'The requested resource could not be found.',
        color: 'blue'
      },
      server: {
        icon: '⚠️',
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later.',
        color: 'red'
      },
      unknown: {
        icon: '❌',
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.',
        color: 'gray'
      }
    };
    return configs[errorType] || configs.unknown;
  };

  const errorType = getErrorType(error);
  const config = getErrorConfig(errorType);

  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-800'
  };

  return (
    <div className={`rounded-md border p-4 ${colorClasses[config.color]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-lg">{config.icon}</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {config.title}
          </h3>
          <div className="mt-1 text-sm">
            <p>{config.message}</p>
          </div>
          
          {showDetails && (
            <details className="mt-2">
              <summary className="text-xs font-medium cursor-pointer">
                Technical Details
              </summary>
              <div className="mt-1 text-xs font-mono bg-white bg-opacity-50 p-2 rounded">
                {error.message}
              </div>
            </details>
          )}

          <div className="mt-3 flex space-x-2">
            {onRetry && (
              <button
                onClick={handleRetry}
                className="text-xs font-medium hover:underline focus:outline-none"
              >
                Try Again {retryCount > 0 && `(${retryCount})`}
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={handleDismiss}
                className="text-xs font-medium hover:underline focus:outline-none"
              >
                Dismiss
              </button>
            )}
          </div>

          {retryCount > 2 && (
            <div className="mt-2 text-xs opacity-75">
              Multiple retries failed. Consider refreshing the page.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiErrorHandler;
