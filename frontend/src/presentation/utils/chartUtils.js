/**
 * @file chartUtils.js
 * @description Utility functions for chart components
 */

/**
 * Calculates chart dimensions based on container size and margins
 * @param {number} width - Container width
 * @param {number} height - Container height
 * @param {Object} margin - Margin configuration
 * @returns {Object} Chart dimensions
 */
export const calculateChartDimensions = (width, height, margin) => {
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  return { chartWidth, chartHeight };
};

/**
 * Calculates scales for chart data
 * @param {Array} data - Chart data
 * @param {Object} dimensions - Chart dimensions
 * @param {Array} series - Data series to include
 * @returns {Object} Scale configuration
 */
export const calculateScales = (data, dimensions, series = ['y']) => {
  if (!data || data.length === 0) {
    return { xScale: 0, yScale: 0, xMin: 0, xMax: 1, yMin: 0, yMax: 1 };
  }
  
  const { chartWidth, chartHeight } = dimensions;
  
  // Calculate scales based on data
  const xValues = data.map(d => d.x);
  const yValues = data.flatMap(d => 
    series.map(s => d[s] || d.y || 0)
  );
  
  const xMin = Math.min(...xValues.map(x => typeof x === 'number' ? x : 0));
  const xMax = Math.max(...xValues.map(x => typeof x === 'number' ? x : 1));
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  const xScale = chartWidth / Math.max(xMax - xMin, 1);
  const yScale = chartHeight / Math.max(yMax - yMin, 1);
  
  return { xScale, yScale, xMin, xMax, yMin, yMax };
};

/**
 * Generates grid lines for charts
 * @param {Object} dimensions - Chart dimensions
 * @param {Object} scales - Scale configuration
 * @param {Object} margin - Margin configuration
 * @returns {Object} Grid lines configuration
 */
export const generateGridLines = (dimensions, scales, margin) => {
  const { chartWidth, chartHeight } = dimensions;
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
};

/**
 * Formats data for chart display
 * @param {Array} data - Raw data
 * @param {string} format - Data format ('number', 'date', 'string')
 * @returns {Array} Formatted data
 */
export const formatChartData = (data, format = 'number') => {
  if (!data || data.length === 0) return [];
  
  switch (format) {
    case 'date':
      return data.map(item => ({
        ...item,
        x: new Date(item.x),
        y: Number(item.y)
      }));
    case 'number':
      return data.map(item => ({
        ...item,
        x: Number(item.x),
        y: Number(item.y)
      }));
    default:
      return data;
  }
};

/**
 * Calculates pie chart data
 * @param {Array} data - Raw data
 * @param {Object} config - Chart configuration
 * @returns {Array} Pie chart data
 */
export const calculatePieData = (data, config) => {
  if (!data || data.length === 0) return [];
  
  const { radius, innerRadius, startAngle, endAngle, paddingAngle } = config;
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  
  if (total === 0) return [];
  
  let currentAngle = startAngle;
  
  return data.map((item, index) => {
    const value = item.value || 0;
    const percentage = (value / total) * 100;
    const angle = (value / total) * (endAngle - startAngle);
    
    const startAngleRad = (currentAngle * Math.PI) / 180;
    const endAngleRad = ((currentAngle + angle) * Math.PI) / 180;
    
    const x1 = radius * Math.cos(startAngleRad);
    const y1 = radius * Math.sin(startAngleRad);
    const x2 = radius * Math.cos(endAngleRad);
    const y2 = radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    let pathData = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    // Handle inner radius for donut chart
    if (innerRadius > 0) {
      const innerX1 = innerRadius * Math.cos(startAngleRad);
      const innerY1 = innerRadius * Math.sin(startAngleRad);
      const innerX2 = innerRadius * Math.cos(endAngleRad);
      const innerY2 = innerRadius * Math.sin(endAngleRad);
      
      const innerLargeArcFlag = angle > 180 ? 1 : 0;
      
      pathData += ` M 0 0 L ${innerX1} ${innerY1} A ${innerRadius} ${innerRadius} 0 ${innerLargeArcFlag} 0 ${innerX2} ${innerY2} Z`;
    }
    
    const labelAngle = currentAngle + angle / 2;
    const labelRadius = radius + 20;
    const labelX = labelRadius * Math.cos((labelAngle * Math.PI) / 180);
    const labelY = labelRadius * Math.sin((labelAngle * Math.PI) / 180);
    
    currentAngle += angle + paddingAngle;
    
    return {
      ...item,
      percentage,
      angle,
      pathData,
      labelX,
      labelY,
      index
    };
  });
};
