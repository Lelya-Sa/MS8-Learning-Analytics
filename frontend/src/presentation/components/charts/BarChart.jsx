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
    
    // Y-axis MUST start at 0 for accurate representation (best practice)
    const yMin = 0;
    const yMax = Math.max(...yValues, 1);
    
    // Use index-based positioning for better spacing
    // Account for padding at both ends to prevent overlap with axes
    const xScale = chartWidth / Math.max(chartData.length + 1 || 1, 1);
    const yScale = chartHeight / Math.max(yMax - yMin || 1, 1);
    
    return { xScale, yScale, xMin: 0, xMax: chartData.length + 1, yMin, yMax };
  }, [chartData, chartDimensions, series]);

  const barData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    const { xScale, yScale, yMin } = scales;
    
    // Calculate optimal bar width: maintain 50% spacing between bars (best practice)
    const availableWidth = chartDimensions.chartWidth;
    const numBars = chartData.length;
    // Each bar should take 66% of its allocated space, leaving 34% for spacing
    const barWidth = (availableWidth / Math.max(numBars + 1, 1)) * 0.66;
    
    return chartData.map((point, index) => {
      const y = Math.max(point.y || 0, 0); // Ensure y is never negative
      
      // Add padding from left margin to prevent overlap with y-axis
      // index starts at 1 to leave space before first bar
      const xPos = margin.left + (index + 1) * xScale;
      const barHeight = (y - yMin) * yScale;
      const yPos = margin.top + chartDimensions.chartHeight - barHeight;
      
      return {
        x: xPos - barWidth / 2,
        y: yPos,
        width: barWidth,
        height: Math.max(barHeight, 1), // Ensure minimum height for visibility
        data: point,
        label: point.label || ''
      };
    });
  }, [chartData, scales, margin, chartDimensions]);

  const handleBarHover = (bar, index, event) => {
    if (!showTooltip) return;
    
    // Get mouse position relative to SVG
    const svgElement = event.currentTarget.closest('svg');
    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = event.clientX - svgRect.left;
    const mouseY = event.clientY - svgRect.top;
    
    setTooltip({
      x: mouseX,
      y: mouseY,
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

  // Calculate border-sensitive positions for axis labels
  const xAxisLabelY = height - 8; // Position above bottom border
  const yAxisLabelX = Math.max(8, margin.left / 4); // Position well inside left margin
  const yAxisLabelY = height / 2; // Center vertically

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
              {barData.map((bar, index) => {
                // Position ticks at center of each bar (bar position already accounts for padding)
                const tickX = bar.x + bar.width / 2;
                return (
                  <g key={`x-tick-${index}`}>
                    <line
                      x1={tickX}
                      y1={margin.top + chartDimensions.chartHeight}
                      x2={tickX}
                      y2={margin.top + chartDimensions.chartHeight + 4}
                      stroke="#9ca3af"
                      strokeWidth="1"
                    />
                    <text
                      x={tickX}
                      y={margin.top + chartDimensions.chartHeight + 12}
                      textAnchor="middle"
                      fill="#6b7280"
                      fontSize="10"
                    >
                      {bar.data.x !== undefined ? bar.data.x : index}
                    </text>
                  </g>
                );
              })}
              
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
                      x={margin.left - 12}
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
              width={bar.width}
              height={bar.height}
              fill={color}
              rx={borderRadius}
              ry={borderRadius}
              className="transition-all duration-200 cursor-pointer"
              style={{
                opacity: hoveredIndex === index ? 0.7 : 1,
                transform: hoveredIndex === index ? 'translateY(-2px)' : 'none'
              }}
              onMouseEnter={(e) => handleBarHover(bar, index, e)}
              onMouseLeave={handleBarLeave}
              aria-label={`Bar ${index + 1}: ${bar.data.x || index}, value: ${bar.data.y || 0}`}
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

          {/* Tooltip - positioned adaptively with border sensitivity */}
          {tooltip && (() => {
            // Tooltip dimensions
            const tooltipWidth = 120;
            const tooltipHeight = 60;
            const padding = 10;
            const offset = 15;
            
            // Border sensitivity zones
            const leftZone = tooltipWidth + offset;
            const rightZone = width - (tooltipWidth + offset);
            const topZone = tooltipHeight + offset;
            const bottomZone = height - (tooltipHeight + offset);
            
            // Determine adaptive positioning based on cursor position and nearby borders
            let tooltipX, tooltipY, textAnchor;
            
            // X-axis positioning with border sensitivity
            if (tooltip.x < leftZone) {
              // Too close to left border - position to the right
              tooltipX = Math.min(tooltip.x + offset, width - tooltipWidth - padding);
              textAnchor = 'start';
            } else if (tooltip.x > rightZone) {
              // Too close to right border - position to the left
              tooltipX = Math.max(tooltip.x - tooltipWidth - offset, padding);
              textAnchor = 'end';
            } else {
              // Center zone - position based on cursor
              if (tooltip.x < width / 2) {
                tooltipX = Math.min(tooltip.x + offset, width - tooltipWidth - padding);
                textAnchor = 'start';
              } else {
                tooltipX = Math.max(tooltip.x - tooltipWidth - offset, padding);
                textAnchor = 'end';
              }
            }
            
            // Y-axis positioning with border sensitivity
            if (tooltip.y < topZone) {
              // Too close to top border - position below
              tooltipY = Math.min(tooltip.y + offset, height - tooltipHeight - padding);
            } else if (tooltip.y > bottomZone) {
              // Too close to bottom border - position above
              tooltipY = Math.max(tooltip.y - tooltipHeight - offset, padding);
            } else {
              // Center zone - position based on cursor
              if (tooltip.y < height / 2) {
                tooltipY = Math.min(tooltip.y + offset, height - tooltipHeight - padding);
              } else {
                tooltipY = Math.max(tooltip.y - tooltipHeight - offset, padding);
              }
            }
            
            // Final bounds check to ensure tooltip is always within SVG
            tooltipX = Math.max(padding, Math.min(tooltipX, width - tooltipWidth - padding));
            tooltipY = Math.max(padding, Math.min(tooltipY, height - tooltipHeight - padding));
            
            return (
              <g className="tooltip-group">
                <rect
                  x={tooltipX}
                  y={tooltipY - tooltipHeight}
                  width={tooltipWidth}
                  height={tooltipHeight}
                  rx="6"
                  fill="#1f2937"
                  opacity="0.95"
                  stroke="#374151"
                  strokeWidth="1"
                />
                <text
                  x={tooltipX + (textAnchor === 'start' ? 10 : tooltipWidth - 10)}
                  y={tooltipY - tooltipHeight + 20}
                  textAnchor={textAnchor}
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                >
                  {tooltip.label}
                </text>
                <text
                  x={tooltipX + (textAnchor === 'start' ? 10 : tooltipWidth - 10)}
                  y={tooltipY - tooltipHeight + 38}
                  textAnchor={textAnchor}
                  fill="#9ca3af"
                  fontSize="10"
                >
                  Value: {tooltip.data?.y || 0}
                </text>
              </g>
            );
          })()}

          {/* Axes Labels */}
          {xAxisLabel && (
            <text
              x={width / 2}
              y={xAxisLabelY}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="11"
              fontWeight="500"
            >
              {xAxisLabel}
            </text>
          )}
          
          {yAxisLabel && (
            <text
              x={yAxisLabelX}
              y={yAxisLabelY}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="11"
              fontWeight="500"
              transform={`rotate(-90, ${yAxisLabelX}, ${yAxisLabelY})`}
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
