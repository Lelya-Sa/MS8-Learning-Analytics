import React, { useMemo, useState } from 'react';

/**
 * @component LineChart
 * @description Reusable line chart component for analytics data visualization with interactive tooltips
 */
export const LineChart = ({ 
  data = [],
  width = 400,
  height = 200,
  title = '',
  className = '',
  color = '#10b981',
  strokeWidth = 2,
  showGrid = true,
  showPoints = true,
  showTooltip = true,
  xAxisLabel = '',
  yAxisLabel = '',
  legend = null,
  margin = { top: 20, right: 20, bottom: 40, left: 40 },
  animate = false,
  responsive = true,
  theme = null,
  series = ['y'],
  ...props 
}) => {
  const [tooltip, setTooltip] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
    if (chartData.length === 0) return { xScale: 1, yScale: 1, xMin: 0, xMax: 100, yMin: 0, yMax: 100 };
    
    const { chartWidth, chartHeight } = chartDimensions;
    
    const xValues = chartData.map((d, idx) => d.x !== undefined ? d.x : idx);
    const yValues = chartData.flatMap(d => 
      series.map(s => d[s] || d.y || 0)
    );
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues, 1);
    
    const xScale = chartWidth / Math.max(xMax - xMin || 1, 1);
    const yScale = chartHeight / Math.max(yMax - yMin || 1, 1);
    
    return { xScale, yScale, xMin, xMax, yMin, yMax };
  }, [chartData, chartDimensions, series]);

  const pathData = useMemo(() => {
    if (!chartData || chartData.length === 0) return '';
    
    const { xScale, yScale, xMin, yMin } = scales;
    
    const pathPoints = chartData.map((point, index) => {
      const x = point.x !== undefined ? point.x : index;
      const y = point.y || 0;
      
      const xPos = margin.left + (x - xMin) * xScale;
      const yPos = margin.top + chartDimensions.chartHeight - (y - yMin) * yScale;
      
      return `${xPos} ${yPos}`;
    });
    
    if (pathPoints.length === 0) return '';
    
    return `M ${pathPoints[0]} ${pathPoints.slice(1).map(p => `L ${p}`).join(' ')}`;
  }, [chartData, scales, margin, chartDimensions]);

  const pointData = useMemo(() => {
    if (!showPoints || chartData.length === 0) return [];
    
    const { xScale, yScale, xMin, yMin } = scales;
    
    return chartData.map((point, index) => {
      const x = point.x !== undefined ? point.x : index;
      const y = point.y || 0;
      
      const xPos = margin.left + (x - xMin) * xScale;
      const yPos = margin.top + chartDimensions.chartHeight - (y - yMin) * yScale;
      
      return { 
        x: xPos, 
        y: yPos, 
        data: point,
        label: point.label || ''
      };
    });
  }, [chartData, scales, margin, showPoints, chartDimensions]);

  const handlePointHover = (point, index, event) => {
    if (!showTooltip) return;
    
    const svgRect = event.currentTarget.closest('svg').getBoundingClientRect();
    setTooltip({
      x: event.clientX - svgRect.left,
      y: event.clientY - svgRect.top,
      data: point.data,
      label: point.label
    });
    setHoveredIndex(index);
  };

  const handlePointLeave = () => {
    setTooltip(null);
    setHoveredIndex(null);
  };

  const containerStyle = {
    width: responsive ? '100%' : `${width}px`,
    maxWidth: '100%',
    position: 'relative'
  };

  const svgStyle = {
    width: '100%',
    height: responsive ? '200px' : `${height}px`,
    viewBox: `0 0 ${width} ${height}`
  };

  return (
    <div className={`line-chart-container ${className}`} style={containerStyle} {...props}>
      <div className="relative" style={{ width: '100%', height: responsive ? '200px' : `${height}px` }}>
        <svg
          style={svgStyle}
          role="img"
          aria-label={title || 'Line chart'}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {showGrid && (
            <g className="grid-lines">
              {Array.from({ length: 6 }).map((_, i) => {
                const x = margin.left + (chartDimensions.chartWidth / 5) * i;
                const y = margin.top + (chartDimensions.chartHeight / 5) * i;
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={margin.top}
                      x2={x}
                      y2={margin.top + chartDimensions.chartHeight}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                    <line
                      x1={margin.left}
                      y1={y}
                      x2={margin.left + chartDimensions.chartWidth}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Area under line */}
          <g clipPath="url(#chartClip)">
            <path
              d={`${pathData} L ${margin.left + chartDimensions.chartWidth} ${margin.top + chartDimensions.chartHeight} L ${margin.left} ${margin.top + chartDimensions.chartHeight} Z`}
              fill="url(#lineGradient)"
              opacity="0.5"
            />
          </g>

          {/* Line Path */}
          <g clipPath="url(#chartClip)">
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animate ? 'animate-pulse' : ''}
            />
          </g>

          {/* Data Points */}
          {showPoints && pointData.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? "6" : "4"}
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={(e) => handlePointHover(point, index, e)}
              onMouseLeave={handlePointLeave}
            />
          ))}

          {/* Tooltip */}
          {tooltip && (
            <g className="tooltip-group">
              <rect
                x={tooltip.x - 50}
                y={tooltip.y - 60}
                width="100"
                height="40"
                rx="4"
                fill="#1f2937"
                opacity="0.95"
              />
              <text
                x={tooltip.x}
                y={tooltip.y - 40}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="600"
              >
                {tooltip.label}
              </text>
              <text
                x={tooltip.x}
                y={tooltip.y - 25}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="10"
              >
                Value: {tooltip.data?.y || 0}
              </text>
              <polygon
                points={`${tooltip.x},${tooltip.y - 20} ${tooltip.x - 8},${tooltip.y - 10} ${tooltip.x + 8},${tooltip.y - 10}`}
                fill="#1f2937"
              />
            </g>
          )}

          {/* Axes Labels */}
          {xAxisLabel && (
            <text
              x={width / 2}
              y={height - 10}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
            >
              {xAxisLabel}
            </text>
          )}
          
          {yAxisLabel && (
            <text
              x="20"
              y={height / 2}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
              transform={`rotate(-90, 20, ${height / 2})`}
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
 * @component LineChartContainer
 * @description Container component for multiple line charts
 */
export const LineChartContainer = ({ children, className = '', ...props }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`} {...props}>
    {children}
  </div>
);
