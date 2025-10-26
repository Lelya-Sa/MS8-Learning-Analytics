import React, { useEffect, useRef } from 'react';

/**
 * @component Modal
 * @description Reusable modal component with accessibility features
 */
export const Modal = ({ 
  isOpen = false,
  onClose,
  title = '',
  children,
  size = 'medium',
  variant = 'default',
  closable = true,
  backdrop = true,
  className = '',
  ...props 
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape' && closable) {
          onClose?.();
        }
      };

      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
        
        // Restore focus to previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose, closable]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Trap focus within modal
      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
      };

      // Add event listener to document to catch all tab events
      document.addEventListener('keydown', handleTabKey);
      
      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800',
    centered: 'bg-white dark:bg-gray-800'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && backdrop && closable) {
      onClose?.();
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {backdrop && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleBackdropClick}
          data-testid="modal-backdrop"
        />
      )}
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          className={`
            relative w-full ${sizeClasses[size]} ${variantClasses[variant]} 
            rounded-lg shadow-xl transform transition-all
            ${className}
          `}
          onClick={handleContentClick}
          tabIndex={-1}
          {...props}
        >
          {/* Header */}
          {(title || closable) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {closable && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * @component Modal.Header
 * @description Modal header component
 */
Modal.Header = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * @component Modal.Body
 * @description Modal body component
 */
Modal.Body = ({ children, className = '', ...props }) => (
  <div className={`text-gray-600 dark:text-gray-400 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * @component Modal.Footer
 * @description Modal footer component
 */
Modal.Footer = ({ children, className = '', ...props }) => (
  <div className={`mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 ${className}`} {...props}>
    {children}
  </div>
);
