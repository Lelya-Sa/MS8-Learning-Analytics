import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * LeaderboardTable Component
 * 
 * Displays a leaderboard table with user rankings, points, levels, and avatars.
 * Supports different periods, highlighting current user, and various interactive features.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of leaderboard entries
 * @param {string} props.period - Leaderboard period ('weekly', 'monthly', 'all-time')
 * @param {string} props.currentUserId - ID of current user for highlighting
 * @param {string} props.size - Table size ('small', 'medium', 'large')
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.showUserCount - Show user count
 * @param {string} props.title - Custom title
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onRefresh - Refresh callback
 * @param {Function} props.onRowClick - Row click callback
 */
export const LeaderboardTable = memo(({
  data = [],
  period = 'weekly',
  currentUserId = null,
  size = 'medium',
  loading = false,
  error = null,
  showUserCount = true,
  title = null,
  className = '',
  onRefresh = null,
  onRowClick = null,
  ...props
}) => {
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Get period title
  const getPeriodTitle = (period) => {
    const titles = {
      weekly: 'Weekly Leaderboard',
      monthly: 'Monthly Leaderboard',
      'all-time': 'All-Time Leaderboard',
    };
    return titles[period] || 'Leaderboard';
  };

  // Get rank icon and color
  const getRankDisplay = (rank) => {
    const rankConfig = {
      1: { icon: '🥇', color: 'text-yellow-500' },
      2: { icon: '🥈', color: 'text-gray-400' },
      3: { icon: '🥉', color: 'text-orange-600' },
    };
    
    return rankConfig[rank] || { icon: rank.toString(), color: 'text-gray-600' };
  };

  // Size classes
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  // Container classes
  const containerClasses = classNames(
    'leaderboard-table-container',
    'bg-white',
    'dark:bg-gray-800',
    'rounded-lg',
    'border',
    'border-gray-200',
    'dark:border-gray-700',
    'shadow-sm',
    'overflow-hidden',
    sizeClasses[size],
    {
      'animate-pulse': loading,
    },
    className
  );

  // Table classes
  const tableClasses = classNames(
    'w-full',
    'border-collapse'
  );

  // Header classes
  const headerClasses = classNames(
    'bg-gray-50',
    'dark:bg-gray-700',
    'text-gray-900',
    'dark:text-white',
    'font-semibold',
    'text-left',
    'px-4',
    'py-3',
    'border-b',
    'border-gray-200',
    'dark:border-gray-600'
  );

  // Row classes
  const getRowClasses = (user) => classNames(
    'border-b',
    'border-gray-200',
    'dark:border-gray-700',
    'hover:bg-gray-50',
    'dark:hover:bg-gray-700',
    'transition-colors',
    'duration-200',
    {
      'bg-emerald-50 dark:bg-emerald-900/20': user.id === currentUserId,
      'cursor-pointer': onRowClick,
    }
  );

  // Cell classes
  const cellClasses = classNames(
    'px-4',
    'py-3',
    'text-gray-900',
    'dark:text-white'
  );

  // Error classes
  const errorClasses = classNames(
    'text-center',
    'py-8',
    'text-red-600',
    'dark:text-red-400'
  );

  // Empty state classes
  const emptyClasses = classNames(
    'text-center',
    'py-8',
    'text-gray-500',
    'dark:text-gray-400'
  );

  // Loading classes
  const loadingClasses = classNames(
    'text-center',
    'py-8',
    'text-gray-500',
    'dark:text-gray-400'
  );

  const handleRowClick = (user) => {
    if (onRowClick) {
      onRowClick(user);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <div
        data-testid="leaderboard-table"
        className={containerClasses}
        {...props}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
        </div>
        <div className={loadingClasses}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-testid="leaderboard-table"
        className={containerClasses}
        {...props}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title || getPeriodTitle(period)}
          </h3>
          {showUserCount && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {data.length} users
            </p>
          )}
        </div>
        <div className={errorClasses}>
          {error}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        data-testid="leaderboard-table"
        className={containerClasses}
        {...props}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title || getPeriodTitle(period)}
          </h3>
          {showUserCount && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              0 users
            </p>
          )}
        </div>
        <div className={emptyClasses}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="leaderboard-table"
      className={containerClasses}
      {...props}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title || getPeriodTitle(period)}
            </h3>
            {showUserCount && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.length} users
              </p>
            )}
          </div>
          {onRefresh && (
            <button
              onClick={handleRefresh}
              className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              aria-label="Refresh leaderboard"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className={tableClasses}
          role="table"
          aria-label={title || getPeriodTitle(period)}
        >
          <thead>
            <tr>
              <th className={headerClasses} scope="col">Rank</th>
              <th className={headerClasses} scope="col">User</th>
              <th className={headerClasses} scope="col">Level</th>
              <th className={headerClasses} scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => {
              const rankDisplay = getRankDisplay(user.rank);
              return (
                <tr
                  key={user.id}
                  className={getRowClasses(user)}
                  onClick={() => handleRowClick(user)}
                  role="row"
                >
                  <td className={cellClasses}>
                    <div className={`flex items-center ${rankDisplay.color}`}>
                      <span className="mr-2">{rankDisplay.icon}</span>
                      <span className="font-semibold">{user.rank}</span>
                    </div>
                  </td>
                  <td className={cellClasses}>
                    <div className="flex items-center">
                      <span className="mr-3 text-xl">{user.avatar}</span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className={cellClasses}>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                      Level {user.level}
                    </span>
                  </td>
                  <td className={cellClasses}>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatNumber(user.points)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

LeaderboardTable.displayName = 'LeaderboardTable';

LeaderboardTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    avatar: PropTypes.string,
    rank: PropTypes.number.isRequired,
  })),
  period: PropTypes.oneOf(['weekly', 'monthly', 'all-time']),
  currentUserId: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  loading: PropTypes.bool,
  error: PropTypes.string,
  showUserCount: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
  onRefresh: PropTypes.func,
  onRowClick: PropTypes.func,
};
