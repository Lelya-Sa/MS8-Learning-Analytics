import React, { useMemo, useState } from 'react';

/**
 * @component BarChart
 * @description Reusable bar chart component for analytics data visualization with interactive tooltips
 */
export const BarChart = ({ 
  data = [],
  width = 400,
  height = 200,
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
  responsive = true,
  theme = null,
  series = ['y'],
  barSpacing = 0.2,
  borderRadius = 2,
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
    
    const yValues = chartData.flatMap(d => 
      series.map(s => d[s] || d.y || 0)
    );
    
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues, 1);
    
    // Use index-based positioning for better spacing
    const xScale = chartWidth / Math.max(chartData.length - 1 || 1, 1);
    const yScale = chartHeight / Math.max(yMax - yMin || 1, 1);
    
    return { xScale, yScale, xMin: 0, xMax: chartData.length - 1, yMin, yMax };
  }, [chartData, chartDimensions, series]);

  const barData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    const { xScale, yScale, yMin } = scales;
    
    const barWidth = (chartDimensions.chartWidth / Math.max(chartData.length, 1)) * (1 - barSpacing);
    
    return chartData.map((point, index) => {
      const y = point.y || 0;
      
      // Use index-based positioning for x-axis to ensure even spacing
      const xPos = margin.left + index * xScale;
      const barHeight = (y - yMin) * yScale;
      const yPos = margin.top + chartDimensions.chartHeight - barHeight;
      
      return {
        x: xPos - barWidth / 2,
        y: yPos,
        width: barWidth,
        height: barHeight,
        data: point,
        label: point.label || ''
      };
    });
  }, [chartData, scales, margin, barSpacing, chartDimensions]);

  const handleBarHover = (bar, index, event) => {
    if (!showTooltip) return;
    
    const svgRect = event.currentTarget.closest('svg').getBoundingClientRect();
    setTooltip({
      x: bar.x + bar.width / 2,
      y: bar.y,
      data: bar.data,
      label: bar.label
    });
    setHoveredIndex(index);
  };

  const handleBarLeave = () => {
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
    height: 'auto',
    preserveAspectRatio: 'xMidYMid meet'
  };

  return (
    <div className={`bar-chart-container ${className}`} style={containerStyle} {...props}>
      <div className="relative" style={{ width: '100%', minHeight: '200px' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={svgStyle}
            role="img"
            aria-label={title || 'Bar chart'}
          >
            <defs>
              <clipPath id="barChartClip">
                <rect x={margin.left} y={margin.top} width={chartDimensions.chartWidth} height={chartDimensions.chartHeight} />
              </clipPath>
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

          {/* Axis Ticks */}
          {showGrid && (
            <g className="axis-ticks">
              {/* X-axis ticks */}
              {barData.map((bar, index) => (
                <g key={`x-tick-${index}`}>
                  <line
                    x1={bar.x + bar.width / 2}
                    y1={margin.top + chartDimensions.chartHeight}
                    x2={bar.x + bar.width / 2}
                    y2={margin.top + chartDimensions.chartHeight + 4}
                    stroke="#9ca3af"
                    strokeWidth="1"
                  />
                  <text
                    x={bar.x + bar.width / 2}
                    y={margin.top + chartDimensions.chartHeight + 16}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="10"
                  >
                    {bar.data.x !== undefined ? bar.data.x : index}
                  </text>
                </g>
              ))}
              
              {/* Y-axis ticks */}
              {Array.from({ length: 6 }).map((_, i) => {
                const y = margin.top + chartDimensions.chartHeight - (chartDimensions.chartHeight / 5) * i;
                const value = scales.yMin + (scales.yMax - scales.yMin) * (i / 5);
                return (
                  <g key={`y-tick-${i}`}>
                    <line
                      x1={margin.left - 4}
                      y1={y}
                      x2={margin.left}
                      y2={y}
                      stroke="#9ca3af"
                      strokeWidth="1"
                    />
                    <text
                      x={margin.left - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#6b7280"
                      fontSize="10"
                    >
                      {Math.round(value * 10) / 10}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Bars */}
          {barData.map((bar, index) => (
            <rect
              key={index}
              x={bar.x}
              y={bar.y}
              width={Math.max(bar.width, 2)}
              height={Math.max(bar.height, 1)}
              fill={color}
              rx={borderRadius}
              ry={borderRadius}
              className="transition-all duration-200 cursor-pointer"
              style={{
                opacity: hoveredIndex === index ? 0.8 : 1,
                transform: hoveredIndex === index ? 'translateY(-2px)' : 'none'
              }}
              onMouseEnter={(e) => handleBarHover(bar, index, e)}
              onMouseLeave={handleBarLeave}
            />
          ))}

          {/* Data Labels */}
          {showLabels && barData.map((bar, index) => (
            <text
              key={`label-${index}`}
              x={bar.x + bar.width / 2}
              y={bar.y - 5}
              textAnchor="middle"
              fill="#374151"
              fontSize="10"
              fontWeight="500"
            >
              {bar.data.y}
            </text>
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
 * @component BarChartContainer
 * @description Container component for multiple bar charts
 */
export const BarChartContainer = ({ children, className = '', ...props }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`} {...props}>
    {children}
  </div>
);
