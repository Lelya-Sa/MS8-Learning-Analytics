import React, { useMemo } from 'react';

/**
 * @component PieChart
 * @description Reusable pie chart component for analytics data visualization
 */
export const PieChart = ({ 
  data = [],
  width = 400,
  height = 300,
  title = '',
  className = '',
  colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
  showLegend = true,
  showLabels = false,
  showPercentages = false,
  showTooltip = true,
  radius = 80,
  innerRadius = 0,
  strokeWidth = 1,
  strokeColor = '#ffffff',
  startAngle = 0,
  endAngle = 360,
  paddingAngle = 0,
  centerX = null,
  centerY = null,
  animate = false,
  responsive = false,
  theme = null,
  ...props 
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data;
  }, [data]);

  const chartCenter = useMemo(() => {
    const cx = centerX !== null ? centerX : width / 2;
    const cy = centerY !== null ? centerY : height / 2;
    return { cx, cy };
  }, [width, height, centerX, centerY]);

  const pieData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    const total = chartData.reduce((sum, item) => sum + (item.value || 0), 0);
    if (total === 0) return [];
    
    let currentAngle = startAngle;
    
    return chartData.map((item, index) => {
      const value = item.value || 0;
      const percentage = (value / total) * 100;
      const angle = (value / total) * (endAngle - startAngle);
      
      const startAngleRad = (currentAngle * Math.PI) / 180;
      const endAngleRad = ((currentAngle + angle) * Math.PI) / 180;
      
      const x1 = chartCenter.cx + radius * Math.cos(startAngleRad);
      const y1 = chartCenter.cy + radius * Math.sin(startAngleRad);
      const x2 = chartCenter.cx + radius * Math.cos(endAngleRad);
      const y2 = chartCenter.cy + radius * Math.sin(endAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      let pathData = `M ${chartCenter.cx} ${chartCenter.cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      // Handle inner radius for donut chart
      if (innerRadius > 0) {
        const innerX1 = chartCenter.cx + innerRadius * Math.cos(startAngleRad);
        const innerY1 = chartCenter.cy + innerRadius * Math.sin(startAngleRad);
        const innerX2 = chartCenter.cx + innerRadius * Math.cos(endAngleRad);
        const innerY2 = chartCenter.cy + innerRadius * Math.sin(endAngleRad);
        
        const innerLargeArcFlag = angle > 180 ? 1 : 0;
        
        pathData += ` M ${chartCenter.cx} ${chartCenter.cy} L ${innerX1} ${innerY1} A ${innerRadius} ${innerRadius} 0 ${innerLargeArcFlag} 0 ${innerX2} ${innerY2} Z`;
      }
      
      const labelAngle = currentAngle + angle / 2;
      const labelRadius = radius + 20;
      const labelX = chartCenter.cx + labelRadius * Math.cos((labelAngle * Math.PI) / 180);
      const labelY = chartCenter.cy + labelRadius * Math.sin((labelAngle * Math.PI) / 180);
      
      currentAngle += angle + paddingAngle;
      
      return {
        ...item,
        percentage,
        angle,
        pathData,
        labelX,
        labelY,
        color: colors[index % colors.length],
        index
      };
    });
  }, [chartData, chartCenter, radius, innerRadius, startAngle, endAngle, paddingAngle, colors]);

  const containerStyle = {
    width: responsive ? '100%' : `${width}px`,
    height: responsive ? 'auto' : `${height}px`,
    maxWidth: '100%'
  };

  const svgStyle = {
    width: '100%',
    height: responsive ? 'auto' : `${height}px`,
    viewBox: `0 0 ${width} ${height}`
  };

  return (
    <div className={`pie-chart-container ${className}`} style={containerStyle} {...props}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      
      <div className="relative">
        <svg
          style={svgStyle}
          role="img"
          aria-label={title || 'Pie chart'}
          className="overflow-visible"
        >
          {/* Chart Area */}
          <g className="chart-area">
            {/* Pie Slices */}
            {pieData.map((slice, index) => (
              <g key={index}>
                <path
                  d={slice.pathData}
                  fill={slice.color}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className={`hover:opacity-80 transition-all duration-200 cursor-pointer ${animate ? 'animate-pulse' : ''}`}
                  data-tooltip={showTooltip ? JSON.stringify(slice) : undefined}
                />
                
                {/* Labels */}
                {showLabels && (
                  <text
                    x={slice.labelX}
                    y={slice.labelY}
                    textAnchor="middle"
                    className="text-xs text-gray-600 dark:text-gray-400"
                  >
                    {slice.label}
                  </text>
                )}
                
                {/* Percentage Labels */}
                {showPercentages && (
                  <text
                    x={slice.labelX}
                    y={slice.labelY + 12}
                    textAnchor="middle"
                    className="text-xs font-semibold text-gray-800 dark:text-gray-200"
                  >
                    {slice.percentage.toFixed(1)}%
                  </text>
                )}
              </g>
            ))}
          </g>
        </svg>

        {/* Legend */}
        {showLegend && pieData.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {pieData.map((slice, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {slice.label} ({slice.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * @component PieChartContainer
 * @description Container component for multiple pie charts
 */
export const PieChartContainer = ({ children, className = '', ...props }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * @component DonutChart
 * @description Donut chart variant of pie chart
 */
export const DonutChart = ({ innerRadius = 40, ...props }) => (
  <PieChart innerRadius={innerRadius} {...props} />
);
