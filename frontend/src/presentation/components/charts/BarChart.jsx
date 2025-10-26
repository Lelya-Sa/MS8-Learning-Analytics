import React, { useMemo } from 'react';

/**
 * @component BarChart
 * @description Reusable bar chart component for analytics data visualization
 */
export const BarChart = ({ 
  data = [],
  width = 400,
  height = 300,
  title = '',
  className = '',
  color = '#10b981',
  orientation = 'vertical',
  showGrid = true,
  showLabels = false,
  showTooltip = true,
  xAxisLabel = '',
  yAxisLabel = '',
  legend = null,
  margin = { top: 20, right: 20, bottom: 40, left: 40 },
  animate = false,
  responsive = false,
  theme = null,
  series = ['y'],
  barSpacing = 0.2,
  borderRadius = 0,
  ...props 
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data;
  }, [data]);

  const chartDimensions = useMemo(() => {
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    return { chartWidth, chartHeight };
  }, [width, height, margin]);

  const scales = useMemo(() => {
    if (chartData.length === 0) return { xScale: 0, yScale: 0 };
    
    const { chartWidth, chartHeight } = chartDimensions;
    
    // Calculate scales based on data
    const xValues = chartData.map(d => d.x);
    const yValues = chartData.flatMap(d => 
      series.map(s => d[s] || d.y || 0)
    );
    
    const xMin = Math.min(...xValues.map(x => typeof x === 'number' ? x : 0));
    const xMax = Math.max(...xValues.map(x => typeof x === 'number' ? x : 1));
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    const xScale = chartWidth / Math.max(xMax - xMin, 1);
    const yScale = chartHeight / Math.max(yMax - yMin, 1);
    
    return { xScale, yScale, xMin, xMax, yMin, yMax };
  }, [chartData, chartDimensions, series]);

  const barData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    const { chartWidth, chartHeight } = chartDimensions;
    const { xScale, yScale, xMin, yMin } = scales;
    
    const barWidth = (chartWidth / chartData.length) * (1 - barSpacing);
    
    return chartData.map((point, index) => {
      const x = typeof point.x === 'number' ? point.x : index;
      const y = point.y || 0;
      
      const xPos = margin.left + (x - xMin) * xScale;
      const yPos = margin.top + chartHeight - (y - yMin) * yScale;
      
      const barHeight = (y - yMin) * yScale;
      
      return {
        x: xPos - barWidth / 2,
        y: yPos,
        width: barWidth,
        height: barHeight,
        data: point,
        index
      };
    });
  }, [chartData, chartDimensions, scales, margin, barSpacing]);

  const gridLines = useMemo(() => {
    if (!showGrid) return { vertical: [], horizontal: [] };
    
    const { chartWidth, chartHeight } = chartDimensions;
    const { xMin, xMax, yMin, yMax } = scales;
    
    const verticalLines = [];
    const horizontalLines = [];
    
    // Generate grid lines
    for (let i = 0; i <= 5; i++) {
      const x = margin.left + (chartWidth / 5) * i;
      verticalLines.push({ x1: x, y1: margin.top, x2: x, y2: margin.top + chartHeight });
    }
    
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (chartHeight / 5) * i;
      horizontalLines.push({ x1: margin.left, y1: y, x2: margin.left + chartWidth, y2: y });
    }
    
    return { vertical: verticalLines, horizontal: horizontalLines };
  }, [chartDimensions, scales, margin, showGrid]);

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
    <div className={`bar-chart-container ${className}`} style={containerStyle} {...props}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      
      <div className="relative">
        <svg
          style={svgStyle}
          role="img"
          aria-label={title || 'Bar chart'}
          className="overflow-visible"
        >
          {/* Grid Lines */}
          {showGrid && (
            <g className="grid-lines">
              {gridLines.vertical.map((line, index) => (
                <line
                  key={`v-${index}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  opacity="0.3"
                />
              ))}
              {gridLines.horizontal.map((line, index) => (
                <line
                  key={`h-${index}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  opacity="0.3"
                />
              ))}
            </g>
          )}

          {/* Chart Area */}
          <g className="chart-area">
            {/* Bars */}
            {barData.map((bar, index) => (
              <rect
                key={index}
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                fill={color}
                rx={borderRadius}
                ry={borderRadius}
                className={`hover:opacity-80 transition-all duration-200 cursor-pointer ${animate ? 'animate-pulse' : ''}`}
                data-tooltip={showTooltip ? JSON.stringify(bar.data) : undefined}
              />
            ))}

            {/* Data Labels */}
            {showLabels && barData.map((bar, index) => (
              <text
                key={`label-${index}`}
                x={bar.x + bar.width / 2}
                y={bar.y - 5}
                textAnchor="middle"
                className="text-xs text-gray-600 dark:text-gray-400"
              >
                {bar.data.y}
              </text>
            ))}
          </g>

          {/* Axes Labels */}
          {xAxisLabel && (
            <text
              x={width / 2}
              y={height - 10}
              textAnchor="middle"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              {xAxisLabel}
            </text>
          )}
          
          {yAxisLabel && (
            <text
              x={10}
              y={height / 2}
              textAnchor="middle"
              transform={`rotate(-90, 10, ${height / 2})`}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              {yAxisLabel}
            </text>
          )}
        </svg>

        {/* Legend */}
        {legend && (
          <div className="mt-4 flex flex-wrap gap-4">
            {Object.entries(legend).map(([label, color]) => (
              <div key={label} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {label}
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
 * @component BarChartContainer
 * @description Container component for multiple bar charts
 */
export const BarChartContainer = ({ children, className = '', ...props }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`} {...props}>
    {children}
  </div>
);
