import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * PointsDisplay Component
 * 
 * Displays user points, current level, and progress to next level
 * with optional progress bar and customizable styling.
 * 
 * @param {Object} props - Component props
 * @param {number} props.totalPoints - Total points earned
 * @param {number} props.currentLevel - Current level (1-50)
 * @param {number} props.pointsToNextLevel - Points needed for next level
 * @param {string} props.size - Size variant ('small', 'medium', 'large')
 * @param {string} props.variant - Color variant ('primary', 'secondary')
 * @param {boolean} props.showProgress - Show progress bar
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {string} props.pointsLabel - Custom points label
 * @param {string} props.levelLabel - Custom level label
 * @param {string} props.nextLevelLabel - Custom next level label
 */
export const PointsDisplay = memo(({
  totalPoints = 0,
  currentLevel = 1,
  pointsToNextLevel = 100,
  size = 'medium',
  variant = 'primary',
  showProgress = true,
  loading = false,
  error = null,
  className = '',
  onClick = null,
  pointsLabel = 'Points',
  levelLabel = 'Level',
  nextLevelLabel = 'points to next level',
  ...props
}) => {
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Calculate progress percentage for progress bar
  const progressPercentage = pointsToNextLevel > 0 
    ? Math.min(100, Math.max(0, (pointsToNextLevel / 1000) * 100))
    : 100;

  // For aria-valuenow, use the actual points to next level
  const ariaValueNow = pointsToNextLevel;

  // Size classes
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-2xl',
  };

  // Variant classes
  const variantClasses = {
    primary: 'text-emerald-600 dark:text-emerald-400',
    secondary: 'text-gray-600 dark:text-gray-400',
  };

  // Container classes
  const containerClasses = classNames(
    'points-display-container',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'p-4',
    'bg-white',
    'dark:bg-gray-800',
    'rounded-lg',
    'border',
    'border-gray-200',
    'dark:border-gray-700',
    'shadow-sm',
    'hover:shadow-md',
    'transition-shadow',
    'duration-200',
    sizeClasses[size],
    variantClasses[variant],
    {
      'cursor-pointer': onClick,
      'animate-pulse': loading,
    },
    className
  );

  // Points display classes
  const pointsClasses = classNames(
    'font-bold',
    'font-mono',
    sizeClasses[size],
    variantClasses[variant]
  );

  // Level display classes
  const levelClasses = classNames(
    'text-sm',
    'font-medium',
    'text-gray-700',
    'dark:text-gray-300',
    'mt-1'
  );

  // Progress text classes
  const progressTextClasses = classNames(
    'text-xs',
    'text-gray-500',
    'dark:text-gray-400',
    'mt-1'
  );

  // Error classes
  const errorClasses = classNames(
    'text-sm',
    'text-red-600',
    'dark:text-red-400',
    'text-center',
    'mt-2'
  );

  if (loading) {
    return (
      <div
        data-testid="points-display"
        className={containerClasses}
        role="region"
        aria-label="Points and level information"
        {...props}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-testid="points-display"
        className={containerClasses}
        role="region"
        aria-label="Points and level information"
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
      data-testid="points-display"
      className={containerClasses}
      role="region"
      aria-label="Points and level information"
      onClick={onClick}
      {...props}
    >
      {/* Points Display */}
      <div className={pointsClasses}>
        {formatNumber(totalPoints)}
      </div>
      
      {/* Points Label */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {pointsLabel}
      </div>
      
      {/* Level Display */}
      <div className={levelClasses}>
        {levelLabel} {currentLevel}
      </div>
      
      {/* Progress Information */}
      {showProgress && (
        <div className="w-full mt-3">
          <div className={progressTextClasses}>
            {formatNumber(pointsToNextLevel)} {nextLevelLabel}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div
              role="progressbar"
              aria-valuenow={ariaValueNow}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`Progress to next level: ${Math.round(progressPercentage)}%`}
              className="h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
});

PointsDisplay.displayName = 'PointsDisplay';

PointsDisplay.propTypes = {
  totalPoints: PropTypes.number,
  currentLevel: PropTypes.number,
  pointsToNextLevel: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
  showProgress: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  pointsLabel: PropTypes.string,
  levelLabel: PropTypes.string,
  nextLevelLabel: PropTypes.string,
};
