import type { Metadata } from 'next'

export const metadata: Metadata = {
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
}

export default function PerformanceDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Performance Dashboard</h1>
      <p className="text-xl text-muted-foreground mb-8">
        A real-time performance monitoring dashboard that displays render times, memory usage, 
        and page load metrics with visual status indicators and automatic updates.
      </p>

      {/* Overview Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          The Performance Dashboard component provides comprehensive real-time monitoring of application 
          performance metrics. It tracks render counts, render times, memory usage, and page load times, 
          displaying them in an easy-to-read grid with color-coded status indicators. The component 
          automatically updates at configurable intervals and warns when performance thresholds are exceeded.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Key Features</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Real-time render performance tracking with count, last render, and average render times</li>
          <li>Memory usage monitoring with used, total, and limit metrics (browser-dependent)</li>
          <li>Page load time tracking in detailed mode</li>
          <li>Color-coded status indicators: green (good), yellow (warning), red (poor)</li>
          <li>Configurable update interval for automatic metric refreshing</li>
          <li>Detailed mode showing additional metrics like total memory and memory limit</li>
          <li>Performance badge variant for compact corner indicators</li>
          <li>Responsive grid layout adapting to different screen sizes</li>
          <li>Automatic threshold detection (16ms for 60fps, 80% memory warning)</li>
          <li>Performance tips displayed in detailed mode</li>
        </ul>
      </section>

      {/* Installation Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Installation</h2>
        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm">
            npm install @clarity-chat/react
          </code>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          This component uses the useRenderPerformance hook for tracking render metrics.
        </p>
      </section>

      {/* Basic Usage Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { PerformanceDashboard } from '@clarity-chat/react'

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
}`}</code>
          </pre>
        </div>
      </section>

      {/* Props API Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props API</h2>
        
        <h3 className="text-xl font-semibold mb-3">PerformanceDashboard</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Prop</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Default</th>
                <th className="text-left p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">detailed</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2 font-mono text-sm">false</td>
                <td className="p-2">Show additional metrics like total memory, memory limit, and page load time</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">updateInterval</td>
                <td className="p-2 font-mono text-sm">number</td>
                <td className="p-2 font-mono text-sm">2000</td>
                <td className="p-2">Update interval in milliseconds for automatic metric refreshing</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2 font-mono text-sm">undefined</td>
                <td className="p-2">Additional CSS classes for the dashboard container</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mb-3">PerformanceBadge</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Prop</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Default</th>
                <th className="text-left p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2 font-mono text-sm">undefined</td>
                <td className="p-2">Additional CSS classes for the badge container</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Type Definitions Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Type Definitions</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`interface PerformanceDashboardProps {
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
  | 'Page Load'         // Initial page load time (detailed mode)`}</code>
          </pre>
        </div>
      </section>

      {/* Development Mode Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Development Mode Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { PerformanceDashboard } from '@clarity-chat/react'
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

export default DevTools`}</code>
          </pre>
        </div>
      </section>

      {/* Performance Badge Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Performance Badge Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { PerformanceBadge } from '@clarity-chat/react'

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

export default AppHeader`}</code>
          </pre>
        </div>
      </section>

      {/* Conditional Rendering Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Conditional Rendering Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { PerformanceDashboard } from '@clarity-chat/react'
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

export default AdminPanel`}</code>
          </pre>
        </div>
      </section>

      {/* Custom Thresholds Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Custom Monitoring Wrapper Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { PerformanceDashboard } from '@clarity-chat/react'
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

export default PerformanceMonitor`}</code>
          </pre>
        </div>
      </section>

      {/* Integration with Analytics Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Integration with Analytics Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { PerformanceDashboard } from '@clarity-chat/react'
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

export default AnalyticsWrapper`}</code>
          </pre>
        </div>
      </section>

      {/* TypeScript Support Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">TypeScript Support</h2>
        <p className="text-muted-foreground mb-4">
          The component is fully typed with comprehensive TypeScript definitions:
        </p>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import type { PerformanceDashboardProps } from '@clarity-chat/react'
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
}`}</code>
          </pre>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Accessibility</h2>
        <p className="text-muted-foreground mb-4">
          The Performance Dashboard implements accessibility features:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>Semantic HTML:</strong> Proper heading hierarchy and landmark regions</li>
          <li><strong>Color Independence:</strong> Status information conveyed through text and icons, not just color</li>
          <li><strong>Readable Text:</strong> High contrast ratios for all text elements</li>
          <li><strong>Keyboard Navigation:</strong> All interactive elements keyboard accessible</li>
          <li><strong>Screen Reader Support:</strong> Descriptive labels for status indicators</li>
          <li><strong>Focus Management:</strong> Visible focus indicators on interactive elements</li>
          <li><strong>ARIA Attributes:</strong> Appropriate roles and labels for dynamic content</li>
        </ul>

        <div className="bg-muted p-6 rounded-lg mt-4">
          <pre className="text-sm overflow-x-auto">
            <code>{`// Accessibility enhancements
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
</div>`}</code>
          </pre>
        </div>
      </section>

      {/* Styling Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Styling</h2>
        <p className="text-muted-foreground mb-4">
          Customize the appearance using the className prop or by targeting internal elements:
        </p>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { PerformanceDashboard } from '@clarity-chat/react'

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
}`}</code>
          </pre>
        </div>
      </section>

      {/* Related Components Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>Usage Dashboard:</strong> Track credit balance and resource consumption</li>
          <li><strong>Network Status:</strong> Monitor connection status and latency</li>
          <li><strong>Token Counter:</strong> Real-time token usage tracking</li>
          <li><strong>Progress Bar:</strong> Visual progress indicators</li>
          <li><strong>Stats Card:</strong> Individual metric display cards</li>
        </ul>
      </section>

      {/* Best Practices Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Use 2000ms (2 second) update interval by default to balance freshness and overhead</li>
          <li>Enable detailed mode only in development or for admin users</li>
          <li>Use PerformanceBadge for non-intrusive monitoring in production</li>
          <li>Monitor render times and investigate if consistently above 16ms (60fps)</li>
          <li>Track memory usage to detect potential memory leaks early</li>
          <li>Implement keyboard shortcuts to toggle dashboard in development</li>
          <li>Send performance alerts to monitoring services when thresholds exceeded</li>
          <li>Use conditional rendering to show dashboard only when needed</li>
          <li>Position dashboard in fixed corners to avoid interfering with main UI</li>
          <li>Integrate with analytics to track performance trends over time</li>
        </ul>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Use Cases</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Development Debugging</h3>
            <p className="text-muted-foreground">
              Display real-time performance metrics during development to identify and fix 
              performance bottlenecks. Toggle with keyboard shortcuts for quick access.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Production Monitoring</h3>
            <p className="text-muted-foreground">
              Use PerformanceBadge to provide lightweight performance monitoring in production 
              for admin users without impacting regular user experience.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Performance Testing</h3>
            <p className="text-muted-foreground">
              Monitor application performance during load testing to identify performance 
              degradation under stress and establish performance baselines.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">User Support</h3>
            <p className="text-muted-foreground">
              Enable dashboard for users experiencing performance issues to gather diagnostic 
              information and provide better support with concrete performance data.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Analytics Integration</h3>
            <p className="text-muted-foreground">
              Track performance metrics to analytics services to understand real-world 
              performance across different devices, browsers, and user conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Performance Tips Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Performance Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Use longer update intervals (3000-5000ms) to reduce monitoring overhead</li>
          <li>Memoize metric calculations to avoid unnecessary re-computations</li>
          <li>Lazy load the dashboard component to reduce initial bundle size</li>
          <li>Conditionally render based on environment (dev vs. production)</li>
          <li>Use React.memo for metric card components if rendering many metrics</li>
          <li>Clear intervals properly in cleanup to prevent memory leaks</li>
          <li>Throttle performance API calls to reduce browser overhead</li>
          <li>Use requestAnimationFrame for smooth UI updates when needed</li>
        </ul>
      </section>

      {/* Footer Navigation */}
      <footer className="mt-16 pt-8 border-t">
        <div className="flex justify-between items-center">
          <a href="/reference/components" className="text-primary hover:underline">
            ← Back to Components
          </a>
          <a href="/reference/components/network-status" className="text-primary hover:underline">
            Next: Network Status →
          </a>
        </div>
      </footer>
    </div>
  )
}
