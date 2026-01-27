'use client'

/**
 * PerformanceMonitor Component - API Reference Documentation
 *
 * Real-time performance monitoring with Web Vitals tracking, memory profiling,
 * and custom metrics collection.
 */

import * as React from 'react'
import {
  Activity,
  Zap,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Gauge,
  Eye,
  Database,
  Bell,
} from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import type {
  Badge,
  FeatureHighlight,
  RelatedAPI,
  FooterLink,
  TocItem,
} from '../../../../components/Docs/DocumentationPage'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Component Data
// ============================================================================

const badges: Badge[] = [
  { label: 'Beta', variant: 'beta' },
]

const features: FeatureHighlight[] = [
  {
    icon: Gauge,
    label: 'Web Vitals',
    description: 'LCP, FID, CLS, TTFB tracking',
  },
  {
    icon: Database,
    label: 'Memory Profiling',
    description: 'Heap usage and leak detection',
  },
  {
    icon: TrendingUp,
    label: 'Custom Metrics',
    description: 'User-defined performance markers',
  },
  {
    icon: BarChart3,
    label: 'Real-time Dashboard',
    description: 'Live performance visualization',
  },
]

const relatedAPIs: RelatedAPI[] = [
  {
    name: 'usePerformance',
    type: 'hook',
    description: 'Hook for accessing performance data and metrics',
    href: '/reference/hooks/use-performance',
  },
  {
    name: 'MetricsDashboard',
    type: 'component',
    description: 'Comprehensive dashboard for viewing all metrics',
    href: '/reference/components/metrics-dashboard',
  },
  {
    name: 'PerformanceReporter',
    type: 'utility',
    description: 'Utility for reporting metrics to analytics',
    href: '/reference/utilities/performance-reporter',
  },
]

const footerNavigation: FooterLink[] = [
  {
    label: 'MessageList',
    href: '/reference/components/message-list',
    direction: 'previous',
  },
  {
    label: 'MetricsDashboard',
    href: '/reference/components/metrics-dashboard',
    direction: 'next',
  },
]

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'props', title: 'Props API' },
  { id: 'metrics', title: 'Tracked Metrics' },
  { id: 'thresholds', title: 'Performance Thresholds' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Monitoring' },
      { id: 'example-custom-metrics', title: 'Custom Metrics' },
      { id: 'example-alerting', title: 'Performance Alerting' },
    ],
  },
  { id: 'integration', title: 'Integration' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'best-practices', title: 'Best Practices' },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { PerformanceMonitor } from '@clarity-chat/react'
import type { PerformanceMonitorProps, PerformanceMetric } from '@clarity-chat/react'

// Import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { PerformanceMonitor } from '@clarity-chat/react'

function App() {
  const handleMetricUpdate = (metric: PerformanceMetric) => {
    console.log('Metric updated:', metric)
  }

  return (
    <PerformanceMonitor
      enabled={true}
      trackWebVitals={true}
      trackMemory={true}
      reportingInterval={5000}
      onMetricUpdate={handleMetricUpdate}
    />
  )
}`

const customMetricsCode = `import { PerformanceMonitor } from '@clarity-chat/react'
import { usePerformance } from '@clarity-chat/react'

function ChatApp() {
  const { markCustomMetric, measureCustomMetric } = usePerformance()

  const handleMessageSend = async () => {
    // Mark start of operation
    markCustomMetric('message-send-start')

    await sendMessage()

    // Mark end and measure duration
    markCustomMetric('message-send-end')
    const duration = measureCustomMetric(
      'message-send-duration',
      'message-send-start',
      'message-send-end'
    )

    console.log(\`Message sent in \${duration}ms\`)
  }

  return (
    <>
      <PerformanceMonitor
        enabled={true}
        customMetrics={[
          { name: 'message-send-duration', threshold: 1000 },
          { name: 'chat-render-time', threshold: 100 },
          { name: 'token-count-time', threshold: 50 },
        ]}
      />
      <button onClick={handleMessageSend}>Send Message</button>
    </>
  )
}`

const alertingCode = `import { PerformanceMonitor } from '@clarity-chat/react'
import { toast } from 'sonner'

function MonitoredApp() {
  const handleThresholdExceeded = (metric: PerformanceMetric) => {
    if (metric.severity === 'critical') {
      toast.error(\`Performance issue: \${metric.name} exceeded threshold\`)
    } else if (metric.severity === 'warning') {
      toast.warning(\`Performance warning: \${metric.name}\`)
    }
  }

  const handleMemoryLeak = (heapInfo: HeapMemoryInfo) => {
    toast.error(\`Potential memory leak detected: \${heapInfo.used}MB used\`)
  }

  return (
    <PerformanceMonitor
      enabled={true}
      trackWebVitals={true}
      trackMemory={true}
      alertThresholds={{
        lcp: { warning: 2500, critical: 4000 },
        fid: { warning: 100, critical: 300 },
        cls: { warning: 0.1, critical: 0.25 },
        ttfb: { warning: 800, critical: 1800 },
        memory: { warning: 50, critical: 80 },
      }}
      onThresholdExceeded={handleThresholdExceeded}
      onMemoryLeakDetected={handleMemoryLeak}
    />
  )
}`

const integrationCode = `import { PerformanceMonitor } from '@clarity-chat/react'
import { PerformanceReporter } from '@clarity-chat/react'

// Google Analytics integration
function AppWithAnalytics() {
  const handleMetricReport = (metric: PerformanceMetric) => {
    // Send to Google Analytics
    gtag('event', 'web_vitals', {
      event_category: 'Performance',
      event_label: metric.name,
      value: Math.round(metric.value),
      metric_rating: metric.rating,
    })
  }

  return (
    <PerformanceMonitor
      enabled={true}
      reportingInterval={10000}
      onMetricReport={handleMetricReport}
    />
  )
}

// Custom backend integration
function AppWithCustomBackend() {
  const reporter = new PerformanceReporter({
    endpoint: '/api/metrics',
    batchSize: 10,
    flushInterval: 30000,
  })

  return (
    <PerformanceMonitor
      enabled={true}
      reporter={reporter}
    />
  )
}`

const typescriptCode = `// Main component props
interface PerformanceMonitorProps {
  /** Enable/disable monitoring */
  enabled?: boolean
  /** Track Core Web Vitals (LCP, FID, CLS, TTFB) */
  trackWebVitals?: boolean
  /** Track memory usage */
  trackMemory?: boolean
  /** Track custom performance markers */
  customMetrics?: CustomMetricConfig[]
  /** Reporting interval in milliseconds */
  reportingInterval?: number
  /** Alert thresholds for metrics */
  alertThresholds?: AlertThresholds
  /** Performance reporter instance */
  reporter?: PerformanceReporter
  /** Show visual overlay in development */
  showDevOverlay?: boolean
  /** Callback when metric is updated */
  onMetricUpdate?: (metric: PerformanceMetric) => void
  /** Callback when metric is reported */
  onMetricReport?: (metric: PerformanceMetric) => void
  /** Callback when threshold is exceeded */
  onThresholdExceeded?: (metric: PerformanceMetric) => void
  /** Callback when memory leak is detected */
  onMemoryLeakDetected?: (heapInfo: HeapMemoryInfo) => void
}

// Performance metric
interface PerformanceMetric {
  /** Metric name */
  name: string
  /** Metric value */
  value: number
  /** Unit of measurement */
  unit: 'ms' | 'MB' | 'score' | 'count'
  /** Timestamp when measured */
  timestamp: number
  /** Rating (good, needs-improvement, poor) */
  rating: 'good' | 'needs-improvement' | 'poor'
  /** Severity level */
  severity?: 'info' | 'warning' | 'critical'
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

// Custom metric configuration
interface CustomMetricConfig {
  /** Metric name */
  name: string
  /** Threshold in milliseconds */
  threshold: number
  /** Description */
  description?: string
  /** Category */
  category?: string
}

// Alert thresholds
interface AlertThresholds {
  /** Largest Contentful Paint thresholds */
  lcp?: { warning: number; critical: number }
  /** First Input Delay thresholds */
  fid?: { warning: number; critical: number }
  /** Cumulative Layout Shift thresholds */
  cls?: { warning: number; critical: number }
  /** Time to First Byte thresholds */
  ttfb?: { warning: number; critical: number }
  /** Memory usage thresholds (percentage) */
  memory?: { warning: number; critical: number }
}

// Heap memory info
interface HeapMemoryInfo {
  /** Used heap size in MB */
  used: number
  /** Total heap size in MB */
  total: number
  /** Heap limit in MB */
  limit: number
  /** Usage percentage */
  percentage: number
}`

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [metrics, setMetrics] = React.useState<Array<{
    name: string
    value: number
    rating: 'good' | 'needs-improvement' | 'poor'
  }>>([
    { name: 'LCP', value: 1.8, rating: 'good' },
    { name: 'FID', value: 85, rating: 'good' },
    { name: 'CLS', value: 0.05, rating: 'good' },
    { name: 'TTFB', value: 320, rating: 'good' },
  ])
  const [memoryUsage, setMemoryUsage] = React.useState(42)
  const [enabled, setEnabled] = React.useState(true)

  // Simulate metric updates
  React.useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(0, metric.value + (Math.random() - 0.5) * 0.2),
        }))
      )
      setMemoryUsage((prev) => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)))
    }, 2000)

    return () => clearInterval(interval)
  }, [enabled])

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600 dark:text-green-400 bg-green-500/10'
      case 'needs-improvement':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
      case 'poor':
        return 'text-red-600 dark:text-red-400 bg-red-500/10'
      default:
        return 'text-muted-foreground bg-muted/50'
    }
  }

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <CheckCircle className="w-4 h-4" />
      case 'needs-improvement':
        return <AlertCircle className="w-4 h-4" />
      case 'poor':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="rounded"
          />
          Monitoring Enabled
        </label>
        <span className={`text-xs px-2 py-1 rounded-full ${enabled ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
          {enabled ? 'Active' : 'Paused'}
        </span>
      </div>

      {/* Dashboard */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-500" />
            <h3 className="font-semibold text-foreground">Performance Monitor</h3>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
        </div>

        {/* Web Vitals Grid */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="p-3 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {metric.name}
                </span>
                <span className={`p-1 rounded-full ${getRatingColor(metric.rating)}`}>
                  {getRatingIcon(metric.rating)}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {metric.value.toFixed(metric.name === 'CLS' ? 3 : 0)}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  {metric.name === 'CLS' ? 'score' : 'ms'}
                </span>
              </div>
              <div className="mt-2">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      metric.rating === 'good'
                        ? 'bg-green-500'
                        : metric.rating === 'needs-improvement'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (metric.value / 3) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Memory Usage */}
        <div className="px-4 pb-4">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Memory Usage
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {memoryUsage.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  memoryUsage < 50
                    ? 'bg-green-500'
                    : memoryUsage < 80
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${memoryUsage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Props Tables
// ============================================================================

const propsTableData = [
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable or disable performance monitoring',
  },
  {
    name: 'trackWebVitals',
    type: 'boolean',
    default: 'true',
    description: 'Track Core Web Vitals (LCP, FID, CLS, TTFB)',
  },
  {
    name: 'trackMemory',
    type: 'boolean',
    default: 'true',
    description: 'Track memory usage and detect potential leaks',
  },
  {
    name: 'customMetrics',
    type: 'CustomMetricConfig[]',
    default: '[]',
    description: 'Array of custom metric configurations',
  },
  {
    name: 'reportingInterval',
    type: 'number',
    default: '5000',
    description: 'Interval for metric reporting in milliseconds',
  },
  {
    name: 'alertThresholds',
    type: 'AlertThresholds',
    description: 'Thresholds for triggering performance alerts',
  },
  {
    name: 'reporter',
    type: 'PerformanceReporter',
    description: 'Custom reporter for sending metrics to backend',
  },
  {
    name: 'showDevOverlay',
    type: 'boolean',
    default: 'false',
    description: 'Show performance overlay in development mode',
  },
  {
    name: 'onMetricUpdate',
    type: '(metric: PerformanceMetric) => void',
    description: 'Callback when any metric is updated',
  },
  {
    name: 'onMetricReport',
    type: '(metric: PerformanceMetric) => void',
    description: 'Callback when metric is reported (batch interval)',
  },
  {
    name: 'onThresholdExceeded',
    type: '(metric: PerformanceMetric) => void',
    description: 'Callback when metric exceeds configured threshold',
  },
  {
    name: 'onMemoryLeakDetected',
    type: '(heapInfo: HeapMemoryInfo) => void',
    description: 'Callback when potential memory leak is detected',
  },
]

const metricsTableData = [
  {
    name: 'LCP',
    description: 'Largest Contentful Paint',
    unit: 'ms',
    good: '< 2.5s',
    needsImprovement: '2.5s - 4s',
    poor: '> 4s',
  },
  {
    name: 'FID',
    description: 'First Input Delay',
    unit: 'ms',
    good: '< 100ms',
    needsImprovement: '100ms - 300ms',
    poor: '> 300ms',
  },
  {
    name: 'CLS',
    description: 'Cumulative Layout Shift',
    unit: 'score',
    good: '< 0.1',
    needsImprovement: '0.1 - 0.25',
    poor: '> 0.25',
  },
  {
    name: 'TTFB',
    description: 'Time to First Byte',
    unit: 'ms',
    good: '< 800ms',
    needsImprovement: '800ms - 1800ms',
    poor: '> 1800ms',
  },
  {
    name: 'FCP',
    description: 'First Contentful Paint',
    unit: 'ms',
    good: '< 1.8s',
    needsImprovement: '1.8s - 3s',
    poor: '> 3s',
  },
  {
    name: 'INP',
    description: 'Interaction to Next Paint',
    unit: 'ms',
    good: '< 200ms',
    needsImprovement: '200ms - 500ms',
    poor: '> 500ms',
  },
  {
    name: 'Memory',
    description: 'Heap Memory Usage',
    unit: '%',
    good: '< 50%',
    needsImprovement: '50% - 80%',
    poor: '> 80%',
  },
]

function PropsTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Type</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Default</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {propsTableData.map((prop, index) => (
            <tr
              key={prop.name}
              className={`border-b border-border/30 last:border-b-0 ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              }`}
            >
              <td className="px-4 py-3 font-mono text-sm text-brand-600 dark:text-brand-400">
                {prop.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MetricsTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Metric</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Unit</th>
            <th className="px-4 py-3 text-left font-semibold text-green-600 dark:text-green-400">Good</th>
            <th className="px-4 py-3 text-left font-semibold text-amber-600 dark:text-amber-400">Needs Improvement</th>
            <th className="px-4 py-3 text-left font-semibold text-red-600 dark:text-red-400">Poor</th>
          </tr>
        </thead>
        <tbody>
          {metricsTableData.map((metric, index) => (
            <tr
              key={metric.name}
              className={`border-b border-border/30 last:border-b-0 ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              }`}
            >
              <td className="px-4 py-3 font-mono text-sm font-semibold text-foreground">
                {metric.name}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{metric.description}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {metric.unit}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-green-600 dark:text-green-400">
                {metric.good}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-amber-600 dark:text-amber-400">
                {metric.needsImprovement}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-red-600 dark:text-red-400">
                {metric.poor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Component
// ============================================================================

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a href={`#${id}`} className="hover:text-brand-500 transition-colors group">
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function PerformanceMonitorPage() {
  return (
    <DocumentationPage
      title="PerformanceMonitor"
      description="Real-time performance monitoring with Web Vitals tracking, memory profiling, and custom metrics collection"
      icon={Activity}
      badges={badges}
      packageName="@clarity-chat/react"
      features={features}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={footerNavigation}
      revalidate={3600}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            The <code>PerformanceMonitor</code> component provides comprehensive
            real-time performance monitoring for your chat applications. It automatically
            tracks Core Web Vitals, memory usage, and custom performance metrics to help
            you identify and resolve performance bottlenecks.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Why Performance Monitoring?</h3>
          <p>
            Performance directly impacts user experience and business metrics. Studies show:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>User Retention:</strong> 53% of mobile users abandon sites that take
              longer than 3 seconds to load
            </li>
            <li>
              <strong>Conversion Rates:</strong> Every 100ms improvement in load time can
              boost conversions by up to 1%
            </li>
            <li>
              <strong>SEO Rankings:</strong> Core Web Vitals are ranking factors in Google
              Search
            </li>
            <li>
              <strong>User Satisfaction:</strong> Fast, responsive interfaces lead to
              higher engagement
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">Core Web Vitals</h3>
          <p>
            PerformanceMonitor tracks all Core Web Vitals metrics defined by Google's Web
            Vitals initiative:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-brand-500" />
                <h4 className="font-semibold text-sm">LCP - Largest Contentful Paint</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Measures loading performance. Should occur within 2.5 seconds of page load.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-brand-500" />
                <h4 className="font-semibold text-sm">FID - First Input Delay</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Measures interactivity. Pages should have an FID of less than 100ms.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-brand-500" />
                <h4 className="font-semibold text-sm">CLS - Cumulative Layout Shift</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Measures visual stability. Pages should maintain a CLS of less than 0.1.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-brand-500" />
                <h4 className="font-semibold text-sm">TTFB - Time to First Byte</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Measures server response time. Should be less than 800ms for good UX.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Installation Section */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <CodeBlock
            code="npm install @clarity-chat/react"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">Import the component and types:</p>

          <CodeBlock
            code={importCode}
            language="tsx"
            filename="App.tsx"
            showDownloadButton={false}
          />
        </div>
      </Section>

      {/* Live Demo Section */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-6">
          Interactive demo showing real-time performance metrics. Toggle monitoring to see
          the component in action.
        </p>
        <LiveDemo />
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props API">
        <p className="text-muted-foreground mb-6">
          Configure the PerformanceMonitor with these props. All props are optional with
          sensible defaults.
        </p>
        <PropsTable />
      </Section>

      {/* Metrics Section */}
      <Section id="metrics" title="Tracked Metrics">
        <p className="text-muted-foreground mb-6">
          The PerformanceMonitor tracks 12+ performance metrics. Here are the standard Web
          Vitals metrics and their thresholds:
        </p>
        <MetricsTable />
      </Section>

      {/* Thresholds Section */}
      <Section id="thresholds" title="Performance Thresholds">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Performance metrics are categorized into three ranges based on Google's Web
            Vitals guidelines:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-600 dark:text-green-400">Good</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Optimal performance that provides excellent user experience. Target this
                range for production.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-semibold text-amber-600 dark:text-amber-400">
                  Needs Improvement
                </h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Acceptable performance but with room for optimization. Consider improving
                these metrics.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h4 className="font-semibold text-red-600 dark:text-red-400">Poor</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Suboptimal performance that negatively impacts user experience. Requires
                immediate attention.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <div className="space-y-8">
          {/* Basic Monitoring */}
          <div id="example-basic" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-foreground mb-3">Basic Monitoring</h3>
            <p className="text-muted-foreground mb-4">
              Minimal setup to start tracking Web Vitals and memory usage:
            </p>
            <CodeBlock code={basicUsageCode} language="tsx" filename="BasicMonitoring.tsx" />
          </div>

          {/* Custom Metrics */}
          <div id="example-custom-metrics" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Custom Performance Metrics
            </h3>
            <p className="text-muted-foreground mb-4">
              Track custom operations like message sending, rendering, or API calls:
            </p>
            <CodeBlock code={customMetricsCode} language="tsx" filename="CustomMetrics.tsx" />
          </div>

          {/* Alerting */}
          <div id="example-alerting" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Performance Alerting
            </h3>
            <p className="text-muted-foreground mb-4">
              Configure thresholds and receive alerts when metrics exceed limits:
            </p>
            <CodeBlock code={alertingCode} language="tsx" filename="PerformanceAlerting.tsx" />
          </div>
        </div>
      </Section>

      {/* Integration Section */}
      <Section id="integration" title="Integration">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Integrate PerformanceMonitor with analytics platforms or custom backends:
          </p>

          <CodeBlock code={integrationCode} language="tsx" filename="Integration.tsx" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2">Google Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Send Web Vitals to GA4 for tracking and analysis in your existing
                analytics dashboard.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2">Custom Backend</h4>
              <p className="text-sm text-muted-foreground">
                Use PerformanceReporter to batch and send metrics to your own monitoring
                infrastructure.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2">Datadog / New Relic</h4>
              <p className="text-sm text-muted-foreground">
                Forward metrics to APM platforms for comprehensive monitoring alongside
                backend metrics.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2">Sentry Performance</h4>
              <p className="text-sm text-muted-foreground">
                Integrate with Sentry's performance monitoring for correlation with error
                tracking.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">
          Complete type definitions for all props, metrics, and configurations:
        </p>
        <CodeBlock code={typescriptCode} language="tsx" filename="types.ts" showLineNumbers />
      </Section>

      {/* Best Practices Section */}
      <Section id="best-practices" title="Best Practices">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    1. Enable in Production
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Performance monitoring is most valuable in production where you can see
                    real user metrics. Use sampling if needed to reduce overhead.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    2. Set Realistic Thresholds
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Configure thresholds based on your application's baseline performance.
                    Start conservative and adjust as you optimize.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    3. Track Custom Metrics
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor application-specific operations like message sending, AI
                    response time, or token counting to identify bottlenecks.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    4. Monitor Memory Leaks
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Enable memory tracking to catch memory leaks early. Long-running chat
                    sessions can accumulate memory if not managed properly.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    5. Use Dev Overlay During Development
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Enable <code>showDevOverlay</code> to see real-time performance metrics
                    while developing and testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
