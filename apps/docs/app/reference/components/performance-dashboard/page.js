import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Performance Dashboard Component | Clarity Chat',
    description: 'Real-time performance monitoring dashboard displaying render times, memory usage, and page load metrics with visual status indicators.',
    keywords: [
        'performance dashboard',
        'performance monitoring',
        'render performance',
        'memory usage',
        'page load metrics',
        'performance metrics',
        'performance badge',
        'fps monitoring',
        'clarity chat',
        'react component',
    ],
};
export default function PerformanceDashboardPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Performance Dashboard" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "A real-time performance monitoring dashboard that displays render times, memory usage, and page load metrics with visual status indicators and automatic updates." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Overview" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The Performance Dashboard component provides comprehensive real-time monitoring of application performance metrics. It tracks render counts, render times, memory usage, and page load times, displaying them in an easy-to-read grid with color-coded status indicators. The component automatically updates at configurable intervals and warns when performance thresholds are exceeded." }), _jsx("h3", { className: "text-xl font-semibold mb-3 mt-6", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Real-time render performance tracking with count, last render, and average render times" }), _jsx("li", { children: "Memory usage monitoring with used, total, and limit metrics (browser-dependent)" }), _jsx("li", { children: "Page load time tracking in detailed mode" }), _jsx("li", { children: "Color-coded status indicators: green (good), yellow (warning), red (poor)" }), _jsx("li", { children: "Configurable update interval for automatic metric refreshing" }), _jsx("li", { children: "Detailed mode showing additional metrics like total memory and memory limit" }), _jsx("li", { children: "Performance badge variant for compact corner indicators" }), _jsx("li", { children: "Responsive grid layout adapting to different screen sizes" }), _jsx("li", { children: "Automatic threshold detection (16ms for 60fps, 80% memory warning)" }), _jsx("li", { children: "Performance tips displayed in detailed mode" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Installation" }), _jsx("div", { className: "bg-muted p-4 rounded-lg", children: _jsx("code", { className: "text-sm", children: "npm install @clarity-chat/react" }) }), _jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "This component uses the useRenderPerformance hook for tracking render metrics." })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { PerformanceDashboard } from '@clarity-chat/react'

function App() {
  return (
    <div className="p-6">
      {/* Basic performance dashboard */}
      <PerformanceDashboard />
      
      {/* Detailed mode with custom update interval */}
      <PerformanceDashboard 
        detailed 
        updateInterval={1000}
      />
    </div>
  )
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Props API" }), _jsx("h3", { className: "text-xl font-semibold mb-3", children: "PerformanceDashboard" }), _jsx("div", { className: "overflow-x-auto mb-6", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Prop" }), _jsx("th", { className: "text-left p-2", children: "Type" }), _jsx("th", { className: "text-left p-2", children: "Default" }), _jsx("th", { className: "text-left p-2", children: "Description" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "detailed" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "boolean" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "false" }), _jsx("td", { className: "p-2", children: "Show additional metrics like total memory, memory limit, and page load time" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "updateInterval" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "number" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "2000" }), _jsx("td", { className: "p-2", children: "Update interval in milliseconds for automatic metric refreshing" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "undefined" }), _jsx("td", { className: "p-2", children: "Additional CSS classes for the dashboard container" })] })] })] }) }), _jsx("h3", { className: "text-xl font-semibold mb-3", children: "PerformanceBadge" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Prop" }), _jsx("th", { className: "text-left p-2", children: "Type" }), _jsx("th", { className: "text-left p-2", children: "Default" }), _jsx("th", { className: "text-left p-2", children: "Description" })] }) }), _jsx("tbody", { children: _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "undefined" }), _jsx("td", { className: "p-2", children: "Additional CSS classes for the badge container" })] }) })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Type Definitions" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `interface PerformanceDashboardProps {
  detailed?: boolean        // Show additional metrics
  updateInterval?: number   // Update interval in ms
  className?: string        // Custom CSS classes
}

interface PerformanceMetric {
  name: string                          // Metric display name
  value: number | string                // Metric value
  unit?: string                         // Optional unit (ms, s, MB, etc.)
  status?: 'good' | 'warning' | 'poor'  // Visual status indicator
}

// Performance thresholds
const THRESHOLDS = {
  RENDER_TIME_WARNING: 16,    // ms (60fps target)
  RENDER_TIME_POOR: 50,       // ms (severe performance issue)
  MEMORY_WARNING: 0.7,        // 70% of heap limit
  MEMORY_POOR: 0.9,           // 90% of heap limit
  PAGE_LOAD_WARNING: 3000,    // ms
}

// Metrics tracked
type MetricCategory = 
  | 'Render Count'      // Total number of renders
  | 'Last Render'       // Most recent render time (ms)
  | 'Average Render'    // Average render time (ms)
  | 'Memory Used'       // Current JS heap size
  | 'Total Memory'      // Total JS heap size (detailed mode)
  | 'Memory Limit'      // JS heap size limit (detailed mode)
  | 'Page Load'         // Initial page load time (detailed mode)` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Development Mode Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { PerformanceDashboard } from '@clarity-chat/react'
import { useState } from 'react'

function DevTools() {
  const [showPerformance, setShowPerformance] = useState(
    process.env.NODE_ENV === 'development'
  )

  // Toggle with keyboard shortcut
  React.useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      // Ctrl/Cmd + Shift + P to toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        setShowPerformance(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!showPerformance) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 shadow-2xl">
      <PerformanceDashboard 
        detailed
        updateInterval={1000}
        className="backdrop-blur-sm bg-white/95"
      />
      
      <button
        onClick={() => setShowPerformance(false)}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
        aria-label="Close performance dashboard"
      >
        ✕
      </button>
    </div>
  )
}

export default DevTools` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Performance Badge Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { PerformanceBadge } from '@clarity-chat/react'

function AppHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold">My App</h1>
      
      <div className="flex items-center gap-4">
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/settings">Settings</a>
        </nav>
        
        {/* Compact performance indicator in corner */}
        <PerformanceBadge />
      </div>
    </header>
  )
}

// Badge shows:
// - Green badge: "3.2ms" (good performance)
// - Yellow badge: "18.5ms" (warning - above 16ms)
// - Red badge: "52.1ms" (poor - above 50ms)

export default AppHeader` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Conditional Rendering Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { PerformanceDashboard } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    // Check if user is admin
    fetch('/api/user/role')
      .then(res => res.json())
      .then(data => setIsAdmin(data.role === 'admin'))
  }, [])

  // Only show to admins in debug mode
  if (!isAdmin || !showDebug) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">
            Admin Performance Monitor
          </h3>
          <button
            onClick={() => setShowDebug(false)}
            className="text-gray-400 hover:text-white"
          >
            Hide
          </button>
        </div>
        
        <PerformanceDashboard 
          detailed
          updateInterval={500}  // More frequent updates for debugging
          className="bg-gray-800 border-gray-700"
        />
      </div>
    </div>
  )
}

export default AdminPanel` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Custom Monitoring Wrapper Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { PerformanceDashboard } from '@clarity-chat/react'
import { useEffect, useState } from 'react'

function PerformanceMonitor() {
  const [alerts, setAlerts] = useState<string[]>([])

  useEffect(() => {
    // Monitor performance and trigger alerts
    const interval = setInterval(() => {
      const entries = performance.getEntriesByType('measure')
      const recentRenders = entries.slice(-10)
      
      const avgRenderTime = recentRenders.reduce(
        (sum, entry) => sum + entry.duration, 0
      ) / recentRenders.length

      // Trigger alert if performance degrades
      if (avgRenderTime > 50) {
        setAlerts(prev => [
          ...prev,
          \`Performance Alert: Average render time \${avgRenderTime.toFixed(2)}ms\`
        ])
        
        // Send to monitoring service
        fetch('/api/monitoring/alert', {
          method: 'POST',
          body: JSON.stringify({
            metric: 'avgRenderTime',
            value: avgRenderTime,
            timestamp: Date.now()
          })
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4">
      <PerformanceDashboard 
        detailed
        updateInterval={1000}
      />
      
      {alerts.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">
            Performance Alerts
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {alerts.slice(-5).map((alert, i) => (
              <li key={i}>{alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PerformanceMonitor` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Integration with Analytics Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { PerformanceDashboard } from '@clarity-chat/react'
import { useEffect } from 'react'

function AnalyticsWrapper() {
  useEffect(() => {
    // Track performance metrics to analytics
    const trackPerformance = () => {
      const entries = performance.getEntriesByType('measure')
      const navigation = performance.getEntriesByType('navigation')[0]
      
      // Send to analytics service
      if (window.gtag) {
        window.gtag('event', 'performance_metric', {
          event_category: 'Performance',
          event_label: 'Page Metrics',
          value: Math.round(navigation?.duration || 0),
          custom_dimension_1: entries.length,
          custom_dimension_2: \`\${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB\`
        })
      }
    }

    // Track on page load
    if (document.readyState === 'complete') {
      trackPerformance()
    } else {
      window.addEventListener('load', trackPerformance)
    }

    // Track periodically
    const interval = setInterval(trackPerformance, 60000) // Every minute

    return () => {
      window.removeEventListener('load', trackPerformance)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Performance Monitoring Dashboard
        </h1>
        
        <PerformanceDashboard 
          detailed
          updateInterval={2000}
        />
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            📊 Performance metrics are being tracked and sent to analytics
          </p>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsWrapper` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "TypeScript Support" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The component is fully typed with comprehensive TypeScript definitions:" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import type { PerformanceDashboardProps } from '@clarity-chat/react'
import { PerformanceDashboard, PerformanceBadge } from '@clarity-chat/react'

// Type-safe props
const dashboardProps: PerformanceDashboardProps = {
  detailed: true,
  updateInterval: 1000,
  className: 'custom-dashboard'
}

function TypedPerformanceMonitor() {
  return (
    <div>
      <PerformanceDashboard {...dashboardProps} />
      <PerformanceBadge className="mt-4" />
    </div>
  )
}

// Custom hook with types
function usePerformanceTracking() {
  const [metrics, setMetrics] = React.useState<{
    renderTime: number
    memoryUsed: number
    status: 'good' | 'warning' | 'poor'
  } | null>(null)

  React.useEffect(() => {
    const interval = setInterval(() => {
      const entries = performance.getEntriesByType('measure')
      const lastEntry = entries[entries.length - 1]
      
      if (lastEntry) {
        const renderTime = lastEntry.duration
        const memoryUsed = (performance as any).memory?.usedJSHeapSize || 0
        
        setMetrics({
          renderTime,
          memoryUsed,
          status: renderTime > 16 ? 'warning' : 'good'
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return metrics
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Accessibility" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The Performance Dashboard implements accessibility features:" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "Semantic HTML:" }), " Proper heading hierarchy and landmark regions"] }), _jsxs("li", { children: [_jsx("strong", { children: "Color Independence:" }), " Status information conveyed through text and icons, not just color"] }), _jsxs("li", { children: [_jsx("strong", { children: "Readable Text:" }), " High contrast ratios for all text elements"] }), _jsxs("li", { children: [_jsx("strong", { children: "Keyboard Navigation:" }), " All interactive elements keyboard accessible"] }), _jsxs("li", { children: [_jsx("strong", { children: "Screen Reader Support:" }), " Descriptive labels for status indicators"] }), _jsxs("li", { children: [_jsx("strong", { children: "Focus Management:" }), " Visible focus indicators on interactive elements"] }), _jsxs("li", { children: [_jsx("strong", { children: "ARIA Attributes:" }), " Appropriate roles and labels for dynamic content"] })] }), _jsx("div", { className: "bg-muted p-6 rounded-lg mt-4", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `// Accessibility enhancements
<div 
  role="region" 
  aria-label="Performance metrics dashboard"
  className="performance-dashboard"
>
  <h3 id="perf-heading">Performance Metrics</h3>
  
  <div 
    role="status" 
    aria-live="polite"
    aria-atomic="true"
  >
    {metrics.map(metric => (
      <div 
        key={metric.name}
        role="group"
        aria-labelledby={\`metric-\${metric.name}\`}
      >
        <span id={\`metric-\${metric.name}\`}>
          {metric.name}: {metric.value}{metric.unit}
        </span>
        <span 
          aria-label={\`Status: \${metric.status}\`}
          className="status-indicator"
        />
      </div>
    ))}
  </div>
</div>` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Styling" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Customize the appearance using the className prop or by targeting internal elements:" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { PerformanceDashboard } from '@clarity-chat/react'

function StyledPerformance() {
  return (
    <PerformanceDashboard
      detailed
      className="custom-performance"
    />
  )
}

/* Custom CSS */
.custom-performance {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.custom-performance h3 {
  color: white;
  font-size: 1.5rem;
}

.custom-performance [class*="grid"] > div {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.custom-performance .text-muted-foreground {
  color: rgba(255, 255, 255, 0.7);
}

/* Badge styling */
.performance-badge {
  font-weight: 600;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .performance-dashboard {
    background: #1a1a1a;
    border-color: #333;
  }
  
  .performance-dashboard [class*="grid"] > div {
    background: #2a2a2a;
    border-color: #444;
  }
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Related Components" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "Usage Dashboard:" }), " Track credit balance and resource consumption"] }), _jsxs("li", { children: [_jsx("strong", { children: "Network Status:" }), " Monitor connection status and latency"] }), _jsxs("li", { children: [_jsx("strong", { children: "Token Counter:" }), " Real-time token usage tracking"] }), _jsxs("li", { children: [_jsx("strong", { children: "Progress Bar:" }), " Visual progress indicators"] }), _jsxs("li", { children: [_jsx("strong", { children: "Stats Card:" }), " Individual metric display cards"] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Best Practices" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Use 2000ms (2 second) update interval by default to balance freshness and overhead" }), _jsx("li", { children: "Enable detailed mode only in development or for admin users" }), _jsx("li", { children: "Use PerformanceBadge for non-intrusive monitoring in production" }), _jsx("li", { children: "Monitor render times and investigate if consistently above 16ms (60fps)" }), _jsx("li", { children: "Track memory usage to detect potential memory leaks early" }), _jsx("li", { children: "Implement keyboard shortcuts to toggle dashboard in development" }), _jsx("li", { children: "Send performance alerts to monitoring services when thresholds exceeded" }), _jsx("li", { children: "Use conditional rendering to show dashboard only when needed" }), _jsx("li", { children: "Position dashboard in fixed corners to avoid interfering with main UI" }), _jsx("li", { children: "Integrate with analytics to track performance trends over time" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Use Cases" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Development Debugging" }), _jsx("p", { className: "text-muted-foreground", children: "Display real-time performance metrics during development to identify and fix performance bottlenecks. Toggle with keyboard shortcuts for quick access." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Production Monitoring" }), _jsx("p", { className: "text-muted-foreground", children: "Use PerformanceBadge to provide lightweight performance monitoring in production for admin users without impacting regular user experience." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Performance Testing" }), _jsx("p", { className: "text-muted-foreground", children: "Monitor application performance during load testing to identify performance degradation under stress and establish performance baselines." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "User Support" }), _jsx("p", { className: "text-muted-foreground", children: "Enable dashboard for users experiencing performance issues to gather diagnostic information and provide better support with concrete performance data." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Analytics Integration" }), _jsx("p", { className: "text-muted-foreground", children: "Track performance metrics to analytics services to understand real-world performance across different devices, browsers, and user conditions." })] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Performance Tips" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Use longer update intervals (3000-5000ms) to reduce monitoring overhead" }), _jsx("li", { children: "Memoize metric calculations to avoid unnecessary re-computations" }), _jsx("li", { children: "Lazy load the dashboard component to reduce initial bundle size" }), _jsx("li", { children: "Conditionally render based on environment (dev vs. production)" }), _jsx("li", { children: "Use React.memo for metric card components if rendering many metrics" }), _jsx("li", { children: "Clear intervals properly in cleanup to prevent memory leaks" }), _jsx("li", { children: "Throttle performance API calls to reduce browser overhead" }), _jsx("li", { children: "Use requestAnimationFrame for smooth UI updates when needed" })] })] }), _jsx("footer", { className: "mt-16 pt-8 border-t", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("a", { href: "/reference/components", className: "text-primary hover:underline", children: "\u2190 Back to Components" }), _jsx("a", { href: "/reference/components/network-status", className: "text-primary hover:underline", children: "Next: Network Status \u2192" })] }) })] }));
}
//# sourceMappingURL=page.js.map