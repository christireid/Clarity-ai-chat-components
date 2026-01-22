import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Performance Monitoring Utilities',
  description: 'Track and analyze component performance, rendering metrics, and user interactions.',
}

const performanceProps: Prop[] = [
  {
    name: 'usePerformanceTracking',
    type: '(options?: UsePerformanceTrackingOptions) => PerformanceMetrics',
    description: 'React hook for tracking component performance metrics.',
  },
  {
    name: 'logPerformanceMetrics',
    type: '(metrics: PerformanceMetrics, context?: string) => void',
    description: 'Log performance metrics to console or external service.',
  },
  {
    name: 'getPerformanceSummary',
    type: '(metrics: PerformanceMetrics[]) => PerformanceSummary',
    description: 'Generate summary statistics from performance metrics.',
  },
]

const performanceOptionsProps: Prop[] = [
  {
    name: 'trackRenderTime',
    type: 'boolean',
    default: 'true',
    description: 'Track component render time.',
  },
  {
    name: 'trackInteractions',
    type: 'boolean',
    default: 'false',
    description: 'Track user interactions and their performance impact.',
  },
  {
    name: 'trackMemory',
    type: 'boolean',
    default: 'false',
    description: 'Track memory usage (limited browser support).',
  },
  {
    name: 'sampleRate',
    type: 'number',
    default: '1.0',
    description: 'Sampling rate for performance tracking (0.0 to 1.0).',
  },
  {
    name: 'onMetrics',
    type: '(metrics: PerformanceMetrics) => void',
    description: 'Callback when new metrics are collected.',
  },
]

export default function PerformanceMonitoringPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-4">
          <span>⚡ Performance Utilities</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Performance Monitoring</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Track component performance, analyze rendering bottlenecks, and monitor user interaction latency
          with comprehensive performance monitoring utilities.
        </p>
        <p className="text-muted-foreground">
          <strong>Category:</strong> Development Tools •{' '}
          <strong>Impact:</strong> Performance Optimization
        </p>
      </div>

      <Callout type="info" title="Performance-First Development">
        <p className="mb-2">
          Modern web applications must be fast. These utilities help you identify performance bottlenecks
          before they impact your users, ensuring your AI chat interfaces remain responsive even with
          complex features like real-time sync and template processing.
        </p>
      </Callout>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Performance Tracking</h2>
        <CodePlayground
          code={`import { usePerformanceTracking } from '@clarity-chat/react'

function TrackedChatComponent() {
  const metrics = usePerformanceTracking({
    trackRenderTime: true,
    trackInteractions: true,
    onMetrics: (metrics) => {
      console.log('Performance metrics:', metrics)
    }
  })

  return (
    <div>
      <ClarityChat api="/api/chat" />
      {/* Display metrics in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
          Render: {metrics.renderTime}ms
          Interactions: {metrics.interactionCount}
        </div>
      )}
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Basic performance tracking provides render times and interaction counts.
          Perfect for development monitoring and identifying performance regressions.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Advanced Performance Analysis</h2>
        <CodePlayground
          code={`import {
  usePerformanceTracking,
  logPerformanceMetrics,
  getPerformanceSummary
} from '@clarity-chat/react'

function PerformanceAnalyzedApp() {
  const [metricsHistory, setMetricsHistory] = useState([])

  const metrics = usePerformanceTracking({
    trackRenderTime: true,
    trackInteractions: true,
    trackMemory: true,
    sampleRate: 0.1, // Sample 10% of renders
    onMetrics: (newMetrics) => {
      setMetricsHistory(prev => [...prev.slice(-99), newMetrics])
    }
  })

  const summary = useMemo(() =>
    getPerformanceSummary(metricsHistory),
    [metricsHistory]
  )

  // Log to external service
  useEffect(() => {
    if (metrics.renderTime > 100) { // Slow render threshold
      logPerformanceMetrics(metrics, 'slow-render-detected')
    }
  }, [metrics])

  return (
    <div>
      <ClarityChat api="/api/chat" />

      {/* Performance Dashboard */}
      <div className="fixed top-4 right-4 bg-white border rounded-lg p-4 shadow-lg">
        <h3 className="font-semibold mb-2">Performance Summary</h3>
        <div className="text-sm space-y-1">
          <div>Avg Render: {summary.averageRenderTime}ms</div>
          <div>95th Percentile: {summary.p95RenderTime}ms</div>
          <div>Total Interactions: {summary.totalInteractions}</div>
          <div>Memory Delta: {summary.memoryDelta}MB</div>
        </div>
      </div>
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Advanced analysis with historical tracking, statistical summaries,
          and automated alerting for performance issues.
        </p>

        <Callout type="tip" title="Performance Thresholds">
          <p>Consider these performance targets for optimal user experience:</p>
          <ul className="list-disc list-inside mt-2">
            <li><strong>First Contentful Paint:</strong> &lt; 1.5 seconds</li>
            <li><strong>Largest Contentful Paint:</strong> &lt; 2.5 seconds</li>
            <li><strong>Component Render Time:</strong> &lt; 50ms</li>
            <li><strong>Interaction Latency:</strong> &lt; 100ms</li>
          </ul>
        </Callout>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Production Monitoring Integration</h2>
        <CodePlayground
          code={`import { usePerformanceTracking, logPerformanceMetrics } from '@clarity-chat/react'

// Custom performance logger for production
class ProductionPerformanceLogger {
  private buffer = []
  private flushInterval

  constructor() {
    this.flushInterval = setInterval(() => {
      this.flush()
    }, 30000) // Flush every 30 seconds
  }

  log(metrics, context = 'general') {
    this.buffer.push({
      ...metrics,
      context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId()
    })

    // Immediate flush for critical performance issues
    if (metrics.renderTime > 500) {
      this.flushCritical(metrics)
    }
  }

  private async flush() {
    if (this.buffer.length === 0) return

    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: this.buffer.splice(0),
          clientId: this.getClientId()
        })
      })
    } catch (error) {
      console.warn('Failed to flush performance metrics:', error)
    }
  }

  private async flushCritical(metrics) {
    try {
      await fetch('/api/analytics/performance/critical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...metrics,
          severity: 'critical',
          timestamp: Date.now()
        })
      })
    } catch (error) {
      // Silent fail for critical metrics to avoid blocking
    }
  }

  private getSessionId() {
    return sessionStorage.getItem('sessionId') ||
           (sessionStorage.setItem('sessionId', crypto.randomUUID()), sessionStorage.getItem('sessionId'))
  }

  private getClientId() {
    return localStorage.getItem('clientId') ||
           (localStorage.setItem('clientId', crypto.randomUUID()), localStorage.getItem('clientId'))
  }
}

const performanceLogger = new ProductionPerformanceLogger()

function ProductionChatApp() {
  usePerformanceTracking({
    trackRenderTime: true,
    trackInteractions: true,
    sampleRate: 0.05, // 5% sampling in production
    onMetrics: (metrics) => {
      performanceLogger.log(metrics, 'chat-component')
    }
  })

  return <ClarityChat api="/api/chat" />
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Production-ready monitoring with batching, critical alerts, and comprehensive
          client-side tracking for performance analysis and optimization.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Performance Optimization Strategies</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">🎯 Component-Level Optimizations</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Memoization:</strong> Use React.memo for expensive components</li>
              <li><strong>Lazy Loading:</strong> Load heavy components on demand</li>
              <li><strong>Virtual Scrolling:</strong> For long message lists</li>
              <li><strong>Debouncing:</strong> For frequent updates like typing indicators</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">📊 Bundle-Level Optimizations</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Code Splitting:</strong> Split by route and feature</li>
              <li><strong>Tree Shaking:</strong> Remove unused code automatically</li>
              <li><strong>Compression:</strong> Gzip/Brotli for smaller bundles</li>
              <li><strong>Caching:</strong> Long-term caching strategies</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">🌐 Network Optimizations</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Streaming:</strong> Real-time updates without polling</li>
              <li><strong>Compression:</strong> Efficient data transfer</li>
              <li><strong>Caching:</strong> Browser and CDN caching</li>
              <li><strong>Prefetching:</strong> Predict and preload resources</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">💾 Memory Optimizations</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Garbage Collection:</strong> Clean up unused objects</li>
              <li><strong>Object Pooling:</strong> Reuse expensive objects</li>
              <li><strong>Virtual Lists:</strong> Render only visible items</li>
              <li><strong>Debounced Updates:</strong> Reduce update frequency</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <h3 className="text-xl font-semibold mb-4">Functions</h3>
        <PropsTable props={performanceProps} />

        <h3 className="text-xl font-semibold mb-4 mt-8">Options</h3>
        <PropsTable props={performanceOptionsProps} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <Callout type="tip" title="Development vs Production">
            <p>Use detailed tracking in development but sampled metrics in production to balance observability with performance.</p>
          </Callout>

          <Callout type="info" title="Performance Budgets">
            <p>Set performance budgets and monitor against them:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Bundle size: &lt; 500KB gzipped</li>
              <li>First paint: &lt; 1.5 seconds</li>
              <li>Interaction latency: &lt; 100ms</li>
              <li>Memory usage: &lt; 100MB</li>
            </ul>
          </Callout>

          <Callout type="warning" title="Measurement Overhead">
            <p>Performance monitoring adds overhead. Use appropriate sampling rates and disable expensive tracking in production when not needed.</p>
          </Callout>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/guides/performance"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Performance Guide</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive performance optimization strategies for chat applications.
            </p>
          </Link>
          <Link
            href="/guides/component-optimization"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Component Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Techniques for optimizing React component performance.
            </p>
          </Link>
          <Link
            href="/reference/utilities/analytics"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Analytics Utilities</h3>
            <p className="text-sm text-muted-foreground">
              Track user behavior and application usage patterns.
            </p>
          </Link>
          <Link
            href="/reference/utilities/accessibility-testing"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Accessibility Testing</h3>
            <p className="text-sm text-muted-foreground">
              Ensure your chat interfaces are accessible to all users.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}