import React, { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const AnalyticsChart = ({ data, type = 'line', 'aria-label': ariaLabel }) => {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    
    const config = {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`
          }
        },
        scales: type !== 'pie' && type !== 'doughnut' ? {
          y: {
            beginAtZero: true,
            max: 100
          }
        } : {}
      }
    }

    chartRef.current = new Chart(ctx, config)

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, type])

  if (!data) {
    return <div>Loading chart...</div>
  }

  return (
    <div className="chart-container">
      <canvas 
        ref={canvasRef}
        role="img"
        aria-label={ariaLabel || `${type} chart`}
      />
    </div>
  )
}

export default AnalyticsChart
