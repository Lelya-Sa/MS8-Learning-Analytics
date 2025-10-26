import React from 'react';

/**
 * @component DataTable
 * @description Data table view for chart data
 */
export const DataTable = ({ 
  data = [],
  title = '',
  className = '',
  columns = [],
  showIndex = true,
  ...props 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`data-table-container ${className}`} style={{ padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>No data available</p>
      </div>
    );
  }

  // Auto-detect columns from data if not provided
  const tableColumns = columns.length > 0 
    ? columns 
    : Object.keys(data[0] || {}).map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        render: (value) => typeof value === 'number' ? value.toFixed(2) : value
      }));

  return (
    <div className={`data-table-container ${className}`} {...props}>
      <div style={{ 
        maxHeight: '200px', 
        overflowY: 'auto',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0 }}>
            <tr>
              {showIndex && (
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  borderBottom: '2px solid #e5e7eb',
                  color: '#374151'
                }}>
                  #
                </th>
              )}
              {tableColumns.map(col => (
                <th 
                  key={col.key} 
                  style={{ 
                    padding: '0.75rem', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    borderBottom: '2px solid #e5e7eb',
                    color: '#374151'
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} style={{ 
                borderBottom: '1px solid #f3f4f6',
                transition: 'background-color 0.2s'
              }}>
                {showIndex && (
                  <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                    {index + 1}
                  </td>
                )}
                {tableColumns.map(col => (
                  <td 
                    key={col.key} 
                    style={{ padding: '0.75rem', color: '#374151' }}
                  >
                    {col.render ? col.render(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

