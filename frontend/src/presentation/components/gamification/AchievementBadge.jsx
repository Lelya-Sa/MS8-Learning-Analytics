import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * AchievementBadge Component
 * 
 * Displays an achievement badge with icon, title, description, and optional tooltip.
 * Supports different sizes, rarities, and categories with accessibility features.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.achievement - Achievement object
 * @param {string} props.achievement.id - Achievement ID
 * @param {string} props.achievement.title - Achievement title
 * @param {string} props.achievement.description - Achievement description
 * @param {string} props.achievement.icon - Achievement icon (emoji or icon name)
 * @param {string} props.achievement.earnedAt - When achievement was earned (ISO string)
 * @param {string} props.achievement.category - Achievement category
 * @param {string} props.achievement.rarity - Achievement rarity ('common', 'rare', 'epic', 'legendary')
 * @param {string} props.size - Size variant ('small', 'medium', 'large')
 * @param {boolean} props.showTooltip - Show tooltip on hover
 * @param {boolean} props.showDate - Show earned date
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 */
export const AchievementBadge = memo(({
  achievement,
  size = 'medium',
  showTooltip = true,
  showDate = false,
  loading = false,
  error = null,
  disabled = false,
  className = '',
  onClick = null,
  ...props
}) => {
  const [showTooltipState, setShowTooltipState] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Size classes
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  // Rarity classes
  const rarityClasses = {
    common: 'border-gray-300 bg-gray-50 dark:bg-gray-700',
    rare: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    epic: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    legendary: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  };

  // Category classes
  const categoryClasses = {
    learning: 'bg-emerald-50 dark:bg-emerald-900/20',
    social: 'bg-blue-50 dark:bg-blue-900/20',
    performance: 'bg-green-50 dark:bg-green-900/20',
    milestone: 'bg-purple-50 dark:bg-purple-900/20',
  };

  // Container classes
  const containerClasses = classNames(
    'achievement-badge-container',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'p-3',
    'rounded-lg',
    'border-2',
    'shadow-sm',
    'transition-all',
    'duration-200',
    sizeClasses[size],
    rarityClasses[achievement?.rarity || 'common'],
    categoryClasses[achievement?.category || 'learning'],
    {
      'cursor-pointer hover:shadow-md hover:scale-105': onClick && !disabled,
      'opacity-50 cursor-not-allowed': disabled,
      'animate-pulse': loading,
    },
    className
  );

  // Icon classes
  const iconClasses = classNames(
    'text-2xl',
    'mb-2',
    {
      'opacity-50': disabled,
    }
  );

  // Title classes
  const titleClasses = classNames(
    'font-semibold',
    'text-center',
    'text-gray-900',
    'dark:text-white',
    'mb-1',
    {
      'opacity-50': disabled,
    }
  );

  // Description classes
  const descriptionClasses = classNames(
    'text-xs',
    'text-gray-600',
    'dark:text-gray-400',
    'text-center',
    'line-clamp-2',
    {
      'opacity-50': disabled,
    }
  );

  // Date classes
  const dateClasses = classNames(
    'text-xs',
    'text-gray-500',
    'dark:text-gray-500',
    'text-center',
    'mt-1',
    {
      'opacity-50': disabled,
    }
  );

  // Error classes
  const errorClasses = classNames(
    'text-sm',
    'text-red-600',
    'dark:text-red-400',
    'text-center',
    'mt-2'
  );

  // Tooltip classes
  const tooltipClasses = classNames(
    'absolute',
    'bottom-full',
    'left-1/2',
    'transform',
    '-translate-x-1/2',
    'mb-2',
    'px-3',
    'py-2',
    'bg-gray-900',
    'dark:bg-gray-100',
    'text-white',
    'dark:text-gray-900',
    'text-sm',
    'rounded-lg',
    'shadow-lg',
    'z-10',
    'max-w-xs',
    'text-center',
    {
      'opacity-0 pointer-events-none': !showTooltipState,
      'opacity-100': showTooltipState,
    }
  );

  const handleMouseEnter = () => {
    if (showTooltip && !disabled) {
      setShowTooltipState(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltipState(false);
  };

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick(achievement);
    }
  };

  const handleKeyDown = (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick && !disabled) {
      event.preventDefault();
      onClick(achievement);
    }
  };

  if (loading) {
    return (
      <div
        data-testid="achievement-badge"
        className={containerClasses}
        role="button"
        aria-label="Loading achievement"
        {...props}
      >
        <div className="animate-pulse">
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-testid="achievement-badge"
        className={containerClasses}
        role="button"
        aria-label="Achievement error"
        {...props}
      >
        <div className={errorClasses}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="achievement-badge"
      className={containerClasses}
      role="button"
      aria-label={`Achievement: ${achievement?.title || 'Unknown'}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Icon */}
      <div className={iconClasses}>
        {achievement?.icon || '🏆'}
      </div>
      
      {/* Title */}
      <div className={titleClasses}>
        {achievement?.title || 'Unknown Achievement'}
      </div>
      
      {/* Description */}
      <div className={descriptionClasses}>
        {achievement?.description || 'No description available'}
      </div>
      
      {/* Date */}
      {showDate && achievement?.earnedAt && (
        <div className={dateClasses}>
          {formatDate(achievement.earnedAt)}
        </div>
      )}
      
      {/* Tooltip */}
      {showTooltip && (
        <div
          role="tooltip"
          className={tooltipClasses}
          aria-hidden={!showTooltipState}
        >
          <div className="font-semibold mb-1">
            {achievement?.title || 'Unknown Achievement'}
          </div>
          <div>
            {achievement?.description || 'No description available'}
          </div>
          {showDate && achievement?.earnedAt && (
            <div className="mt-1 text-xs opacity-75">
              Earned: {formatDate(achievement.earnedAt)}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

AchievementBadge.displayName = 'AchievementBadge';

AchievementBadge.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
    earnedAt: PropTypes.string,
    category: PropTypes.string,
    rarity: PropTypes.oneOf(['common', 'rare', 'epic', 'legendary']),
  }),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showTooltip: PropTypes.bool,
  showDate: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
