import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { apiClient } from '../../../infrastructure/api';

export const PerformanceOptimizer = ({ userId, onOptimize }) => {
  const [performanceData, setPerformanceData] = useState({
    pageLoadTime: 2.3,
    bundleSize: 1.2,
    memoryUsage: 45,
    cacheHitRate: 78,
    cpuUsage: 25,
    networkSpeed: 50,
    responseTime: 150,
  });

  const [optimizations, setOptimizations] = useState([
    {
      id: 'code-splitting',
      name: 'Enable Code Splitting',
      description: 'Reduce bundle size by 15%',
      impact: 'High Impact',
      applied: false,
    },
    {
      id: 'image-optimization',
      name: 'Optimize Images',
      description: 'Improve page load time by 20%',
      impact: 'High Impact',
      applied: false,
    },
    {
      id: 'compression',
      name: 'Enable Compression',
      description: 'Reduce memory usage by 10%',
      impact: 'Medium Impact',
      applied: false,
    },
    {
      id: 'caching',
      name: 'Cache Static Assets',
      description: 'Increase cache hit rate by 5%',
      impact: 'Low Impact',
      applied: false,
    },
  ]);

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Memoized performance status calculation
  const performanceStatus = useMemo(() => {
    const getStatus = (value, thresholds) => {
      if (value <= thresholds.excellent) return 'Excellent';
      if (value <= thresholds.good) return 'Good';
      if (value <= thresholds.fair) return 'Fair';
      return 'Poor';
    };

    return {
      pageLoadTime: getStatus(performanceData.pageLoadTime, { excellent: 1, good: 2, fair: 3 }),
      bundleSize: getStatus(performanceData.bundleSize, { excellent: 0.5, good: 1, fair: 2 }),
      memoryUsage: getStatus(performanceData.memoryUsage, { excellent: 30, good: 50, fair: 70 }),
      cacheHitRate: getStatus(performanceData.cacheHitRate, { excellent: 90, good: 80, fair: 70 }),
    };
  }, [performanceData]);

  // Memoized optimization suggestions
  const suggestions = useMemo(() => {
    return optimizations.map(opt => ({
      ...opt,
      improvement: opt.applied ? getImprovementValue(opt.id) : 0,
    }));
  }, [optimizations]);

  const getImprovementValue = (optimizationId) => {
    const improvements = {
      'code-splitting': 15,
      'image-optimization': 20,
      'compression': 10,
      'caching': 5,
    };
    return improvements[optimizationId] || 0;
  };

  const handleOptimization = useCallback(async (action) => {
    setIsLoading(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (action) {
        case 'clear-cache':
          setMessage('Cache cleared successfully');
          setPerformanceData(prev => ({
            ...prev,
            cacheHitRate: Math.min(100, prev.cacheHitRate + 5),
          }));
          break;
        case 'optimize-images':
          setMessage('Images optimized successfully');
          setPerformanceData(prev => ({
            ...prev,
            pageLoadTime: Math.max(0.5, prev.pageLoadTime - 0.3),
            bundleSize: Math.max(0.1, prev.bundleSize - 0.2),
          }));
          break;
        case 'minify-assets':
          setMessage('Assets minified successfully');
          setPerformanceData(prev => ({
            ...prev,
            bundleSize: Math.max(0.1, prev.bundleSize - 0.1),
            memoryUsage: Math.max(10, prev.memoryUsage - 5),
          }));
          break;
        case 'enable-compression':
          setMessage('Compression enabled successfully');
          setPerformanceData(prev => ({
            ...prev,
            memoryUsage: Math.max(10, prev.memoryUsage - 3),
            responseTime: Math.max(50, prev.responseTime - 20),
          }));
          break;
        default:
          throw new Error('Unknown optimization action');
      }
    } catch (error) {
      setMessage(`Failed to ${action.replace('-', ' ')}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  }, []);

  const handleApplySuggestion = useCallback((optimizationId) => {
    setOptimizations(prev => 
      prev.map(opt => 
        opt.id === optimizationId 
          ? { ...opt, applied: true }
          : opt
      )
    );
    
    if (onOptimize) {
      onOptimize(optimizationId);
    }
  }, [onOptimize]);

  const handleSearchError = () => {
    setMessage('Failed to clear cache');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="performance-optimizer">
      <main role="main">
        <Card className="optimizer-container">
          <div className="optimizer-header">
            <h1>Performance Optimizer</h1>
            <p>Optimize your learning analytics performance</p>
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {/* Current Performance Metrics */}
          <div className="performance-metrics">
            <h2>Current Performance</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Page Load Time</h3>
                <div className="metric-value">{performanceData.pageLoadTime}s</div>
                <div className={`metric-status ${performanceStatus.pageLoadTime.toLowerCase()}`}>
                  {performanceStatus.pageLoadTime}
                </div>
              </div>
              <div className="metric-card">
                <h3>Bundle Size</h3>
                <div className="metric-value">{performanceData.bundleSize}MB</div>
                <div className={`metric-status ${performanceStatus.bundleSize.toLowerCase()}`}>
                  {performanceStatus.bundleSize}
                </div>
              </div>
              <div className="metric-card">
                <h3>Memory Usage</h3>
                <div className="metric-value">{performanceData.memoryUsage}MB</div>
                <div className={`metric-status ${performanceStatus.memoryUsage.toLowerCase()}`}>
                  {performanceStatus.memoryUsage}
                </div>
              </div>
              <div className="metric-card">
                <h3>Cache Hit Rate</h3>
                <div className="metric-value">{performanceData.cacheHitRate}%</div>
                <div className={`metric-status ${performanceStatus.cacheHitRate.toLowerCase()}`}>
                  {performanceStatus.cacheHitRate}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Monitoring */}
          <div className="real-time-monitoring">
            <h2>Real-time Monitoring</h2>
            <div className="monitoring-grid">
              <div className="monitor-card">
                <h3>CPU Usage</h3>
                <div className="monitor-value">{performanceData.cpuUsage}%</div>
              </div>
              <div className="monitor-card">
                <h3>Network Speed</h3>
                <div className="monitor-value">{performanceData.networkSpeed}Mbps</div>
              </div>
              <div className="monitor-card">
                <h3>Response Time</h3>
                <div className="monitor-value">{performanceData.responseTime}ms</div>
              </div>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="performance-trends">
            <h2>Performance Trends</h2>
            <div className="trends-grid">
              <div className="trend-card">
                <h3>Last 24 Hours</h3>
                <div className="trend-value">+2%</div>
              </div>
              <div className="trend-card">
                <h3>Last 7 Days</h3>
                <div className="trend-value">+5%</div>
              </div>
              <div className="trend-card">
                <h3>Last 30 Days</h3>
                <div className="trend-value">+12%</div>
              </div>
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="optimization-suggestions">
            <h2>Optimization Suggestions</h2>
            <div className="suggestions-grid">
              {suggestions.map(suggestion => (
                <div key={suggestion.id} className="suggestion-card">
                  <div className="suggestion-header">
                    <h3>{suggestion.name}</h3>
                    <span className={`impact-badge ${suggestion.impact.toLowerCase().replace(' ', '-')}`}>
                      {suggestion.impact}
                    </span>
                  </div>
                  <p className="suggestion-description">{suggestion.description}</p>
                  <div className="suggestion-actions">
                    <Button
                      onClick={() => handleApplySuggestion(suggestion.id)}
                      className="apply-button"
                      disabled={suggestion.applied}
                    >
                      {suggestion.applied ? 'Applied' : 'Apply'}
                    </Button>
                    {suggestion.applied && (
                      <span className="improvement">+{suggestion.improvement}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Button
                onClick={() => handleOptimization('clear-cache')}
                className="action-button"
                disabled={isLoading}
                aria-label="Clear application cache"
              >
                Clear Cache
              </Button>
              <Button
                onClick={() => handleOptimization('optimize-images')}
                className="action-button"
                disabled={isLoading}
              >
                Optimize Images
              </Button>
              <Button
                onClick={() => handleOptimization('minify-assets')}
                className="action-button"
                disabled={isLoading}
              >
                Minify Assets
              </Button>
              <Button
                onClick={() => handleOptimization('enable-compression')}
                className="action-button"
                disabled={isLoading}
              >
                Enable Compression
              </Button>
            </div>
          </div>

          {/* Performance Impact */}
          <div className="performance-impact">
            <h2>Performance Impact</h2>
            <div className="impact-comparison">
              <div className="comparison-section">
                <h3>Before Optimization</h3>
                <div className="comparison-metrics">
                  <div className="comparison-metric">
                    <span>Load Time: 2.8s</span>
                  </div>
                  <div className="comparison-metric">
                    <span>Bundle Size: 1.4MB</span>
                  </div>
                  <div className="comparison-metric">
                    <span>Memory: 50MB</span>
                  </div>
                </div>
              </div>
              <div className="comparison-section">
                <h3>After Optimization</h3>
                <div className="comparison-metrics">
                  <div className="comparison-metric">
                    <span>Load Time: 2.3s</span>
                  </div>
                  <div className="comparison-metric">
                    <span>Bundle Size: 1.2MB</span>
                  </div>
                  <div className="comparison-metric">
                    <span>Memory: 45MB</span>
                  </div>
                </div>
              </div>
              <div className="comparison-section">
                <h3>Improvement</h3>
                <div className="comparison-metrics">
                  <div className="comparison-metric improvement">
                    <span>+15%</span>
                  </div>
                  <div className="comparison-metric improvement">
                    <span>-0.5s</span>
                  </div>
                  <div className="comparison-metric improvement">
                    <span>-200KB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PerformanceOptimizer;
