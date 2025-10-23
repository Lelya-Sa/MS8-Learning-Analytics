/**
 * Enhanced DataTable Component
 * Implements sorting, pagination, and accessibility features
 */

import React, { useState, useMemo } from 'react';

const DataTable = ({ 
  data = [], 
  columns = [], 
  sortable = false, 
  pagination = false, 
  pageSize = 10 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig, sortable]);

  const paginatedData = useMemo(() => {
    if (!pagination) {
      return sortedData;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getSortIcon = (key) => {
    if (!sortable) return null;
    
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const getSortAriaLabel = (key) => {
    if (!sortable) return null;
    
    if (sortConfig.key === key) {
      return `Sorted ${sortConfig.direction === 'asc' ? 'ascending' : 'descending'}`;
    }
    return 'Sort';
  };

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="data-table">
      <table role="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={sortable ? 'sortable' : ''}
                role="columnheader"
                onClick={() => handleSort(column.key)}
                aria-sort={sortConfig.key === column.key ? sortConfig.direction : 'none'}
                aria-label={column.label}
                tabIndex={sortable ? 0 : -1}
                onKeyDown={(e) => {
                  if (sortable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleSort(column.key);
                  }
                }}
              >
                {column.label}
                {sortable && (
                  <span className="sort-icon" aria-hidden="true">
                    {getSortIcon(column.key)}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
            aria-label="Previous page"
          >
            Previous Page
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
            aria-label="Next page"
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;