import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * StreakDisplay Component
 * 
 * Displays learning streak information with current streak, longest streak,
 * progress indicators, and motivational messages.
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentStreak - Current streak in days
 * @param {number} props.longestStreak - Longest streak achieved
 * @param {string} props.streakType - Type of streak ('learning', 'study', 'exercise')
 * @param {string} props.size - Size variant ('small', 'medium', 'large')
 * @param {string} props.variant - Color variant ('primary', 'secondary')
 * @param {boolean} props.showProgress - Show progress bar
 * @param {boolean} props.showMilestones - Show milestone information
 * @param {boolean} props.showBreakdown - Show streak breakdown
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {string} props.currentLabel - Custom current streak label
 * @param {string} props.longestLabel - Custom longest streak label
 * @param {string} props.streakTypeLabel - Custom streak type label
 */
export const StreakDisplay = memo(({
  currentStreak = 0,
  longestStreak = 0,
  streakType = 'learning',
  size = 'medium',
  variant = 'primary',
  showProgress = true,
  showMilestones = true,
  showBreakdown = false,
  loading = false,
  error = null,
  className = '',
  onClick = null,
  currentLabel = 'Current Streak',
  longestLabel = 'Longest Streak',
  streakTypeLabel = null,
  ...props
}) => {
  // Get streak type label
  const getStreakTypeLabel = (type) => {
    const labels = {
      learning: 'Learning Streak',
      study: 'Study Streak',
      exercise: 'Exercise Streak',
    };
    return streakTypeLabel || labels[type] || 'Streak';
  };

  // Get streak status message
  const getStreakStatus = (streak) => {
    if (streak === 0) return 'Start your streak!';
    if (streak === 1) return 'Great start!';
    if (streak < 7) return 'Keep it up!';
    if (streak < 14) return 'One week strong!';
    if (streak < 30) return 'Two weeks! Awesome!';
    if (streak < 60) return 'One month! Amazing!';
    if (streak < 90) return 'Two months! Incredible!';
    if (streak < 365) return 'Three months! Legendary!';
    return 'One year! You are unstoppable!';
  };

  // Get streak color based on length
  const getStreakColor = (streak) => {
    if (streak === 0) return 'text-gray-600 dark:text-gray-400';
    if (streak < 7) return 'text-emerald-600 dark:text-emerald-400';
    if (streak < 14) return 'text-emerald-600 dark:text-emerald-400';
    if (streak < 30) return 'text-blue-600 dark:text-blue-400';
    if (streak < 90) return 'text-purple-600 dark:text-purple-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  // Get next milestone
  const getNextMilestone = (streak) => {
    const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
    const next = milestones.find(milestone => milestone > streak);
    return next ? `${next} days` : 'Max milestone reached!';
  };

  // Size classes
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-emerald-50 dark:bg-emerald-900/20',
    secondary: 'bg-gray-50 dark:bg-gray-700',
  };

  // Container classes
  const containerClasses = classNames(
    'streak-display-container',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'p-4',
    'rounded-lg',
    'border',
    'border-gray-200',
    'dark:border-gray-700',
    'shadow-sm',
    'hover:shadow-md',
    'transition-all',
    'duration-200',
    sizeClasses[size],
    variantClasses[variant],
    getStreakColor(currentStreak),
    {
      'cursor-pointer': onClick,
      'animate-pulse': loading,
    },
    className
  );

  // Streak number classes
  const streakNumberClasses = classNames(
    'text-3xl',
    'font-bold',
    'font-mono',
    'mb-2'
  );

  // Label classes
  const labelClasses = classNames(
    'text-sm',
    'font-medium',
    'text-gray-700',
    'dark:text-gray-300',
    'mb-1'
  );

  // Status classes
  const statusClasses = classNames(
    'text-xs',
    'text-gray-600',
    'dark:text-gray-400',
    'text-center',
    'mt-2'
  );

  // Error classes
  const errorClasses = classNames(
    'text-sm',
    'text-red-600',
    'dark:text-red-400',
    'text-center',
    'mt-2'
  );

  // Milestone classes
  const milestoneClasses = classNames(
    'text-xs',
    'text-gray-500',
    'dark:text-gray-400',
    'text-center',
    'mt-1'
  );

  // Breakdown classes
  const breakdownClasses = classNames(
    'text-xs',
    'text-gray-600',
    'dark:text-gray-400',
    'mt-2',
    'space-y-1'
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (loading) {
    return (
      <div
        data-testid="streak-display"
        className={containerClasses}
        role="region"
        aria-label={`${getStreakTypeLabel(streakType)} information`}
        {...props}
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-testid="streak-display"
        className={containerClasses}
        role="region"
        aria-label={`${getStreakTypeLabel(streakType)} information`}
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
      data-testid="streak-display"
      className={containerClasses}
      role="region"
      aria-label={`${getStreakTypeLabel(streakType)} information`}
      onClick={handleClick}
      {...props}
    >
      {/* Streak Type Label */}
      <div className={labelClasses}>
        {getStreakTypeLabel(streakType)}
      </div>

      {/* Current Streak */}
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">🔥</span>
        <div className="text-center">
          <div className={streakNumberClasses}>
            {currentStreak}
          </div>
          <div className={labelClasses}>
            {currentLabel}
          </div>
        </div>
      </div>

      {/* Longest Streak */}
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">🏆</span>
        <div className="text-center">
          <div className={streakNumberClasses}>
            {longestStreak}
          </div>
          <div className={labelClasses}>
            {longestLabel}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full mb-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              role="progressbar"
              aria-valuenow={currentStreak}
              aria-valuemin="0"
              aria-valuemax="365"
              aria-label={`Current streak: ${currentStreak} days`}
              className="h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${Math.min(100, (currentStreak / 365) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Message */}
      <div className={statusClasses}>
        {getStreakStatus(currentStreak)}
      </div>

      {/* Milestones */}
      {showMilestones && currentStreak > 0 && (
        <div className={milestoneClasses}>
          Next: {getNextMilestone(currentStreak)}
        </div>
      )}

      {/* Breakdown */}
      {showBreakdown && (
        <div className={breakdownClasses}>
          <div>This Week: {Math.min(7, currentStreak)} days</div>
          <div>This Month: {Math.min(30, currentStreak)} days</div>
        </div>
      )}
    </div>
  );
});

StreakDisplay.displayName = 'StreakDisplay';

StreakDisplay.propTypes = {
  currentStreak: PropTypes.number,
  longestStreak: PropTypes.number,
  streakType: PropTypes.oneOf(['learning', 'study', 'exercise']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
  showProgress: PropTypes.bool,
  showMilestones: PropTypes.bool,
  showBreakdown: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  currentLabel: PropTypes.string,
  longestLabel: PropTypes.string,
  streakTypeLabel: PropTypes.string,
};
