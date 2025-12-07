'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'PerformanceAnalyticsDashboard | Clarity Chat',
  description: 'Comprehensive performance analytics dashboard with Web Vitals, component metrics, and network monitoring.',
}

const performanceAnalyticsDashboardProps: Prop[] = [
  {
    name: 'data',
    type: 'PerformanceAnalytics',
    description: 'Performance data to display (optional, auto-collected if not provided).',
  },
  {
    name: 'updateInterval',
    type: 'number',
    default: '1000',
    description: 'Update interval in milliseconds.',
  },
  {
    name: 'showWebVitals',
    type: 'boolean',
    default: 'true',
    description: 'Show Web Vitals section (LCP, FID, CLS, etc.).',
  },
  {
    name: 'showComponentMetrics',
    type: 'boolean',
    default: 'true',
    description: 'Show component render metrics.',
  },
  {
    name: 'showNetworkMetrics',
    type: 'boolean',
    default: 'false',
    description: 'Show network performance metrics.',
  },
  {
    name: 'showMemoryUsage',
    type: 'boolean',
    default: 'true',
    description: 'Show memory usage section.',
  },
  {
    name: 'showFPS',
    type: 'boolean',
    default: 'true',
    description: 'Show FPS counter.',
  },
  {
    name: 'onDataUpdate',
    type: '(data: PerformanceAnalytics) => void',
    description: 'Callback when performance data updates.',
  },
  {
    name: 'compact',
    type: 'boolean',
    default: 'false',
    description: 'Compact mode for smaller displays.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Custom className.',
  },
]

export default function PerformanceAnalyticsDashboardPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>PerformanceAnalyticsDashboard</h1>

      <p className="lead">
        Comprehensive performance analytics dashboard that automatically collects and displays
        Web Vitals, component render metrics, network performance, memory usage, and FPS.
        Perfect for monitoring and optimizing chat application performance.
      </p>

      <Callout type="info" title="Performance Monitoring">
        <p>
          This dashboard automatically collects performance metrics using the Performance Observer API
          and provides real-time insights into your application's performance.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the component:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react'

function PerformanceMonitor() {
  return (
    <PerformanceAnalyticsDashboard
      updateInterval={1000}
      showWebVitals
      showComponentMetrics
      showMemoryUsage
      showFPS
      onDataUpdate={(data) => {
        // Send to analytics service
        console.log('Performance metrics:', data)
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with PerformanceAnalyticsDashboard:
        </p>
        <CodePlayground
          initialCode={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react'

function Example() {
  return (
    <PerformanceAnalyticsDashboard
      updateInterval={2000}
      showWebVitals
      showMemoryUsage
      compact={false}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Custom Data</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react'

function CustomPerformanceMonitor() {
  const customData = {
    webVitals: [
      {
        name: 'LCP',
        value: 1200,
        rating: 'good',
        delta: 0,
      },
      {
        name: 'FID',
        value: 50,
        rating: 'good',
        delta: 0,
      },
    ],
    componentMetrics: [],
    networkMetrics: [],
    memoryUsage: {
      used: 50 * 1024 * 1024, // 50MB
      total: 100 * 1024 * 1024, // 100MB
      limit: 200 * 1024 * 1024, // 200MB
    },
    fps: 60,
    timestamp: Date.now(),
  }

  return (
    <PerformanceAnalyticsDashboard
      data={customData}
      showWebVitals
      showMemoryUsage
      showFPS
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Network Metrics</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react'

function NetworkMonitor() {
  return (
    <PerformanceAnalyticsDashboard
      showNetworkMetrics
      showWebVitals
      onDataUpdate={(data) => {
        // Log slow network requests
        data.networkMetrics
          .filter(m => m.duration > 1000)
          .forEach(m => {
            console.warn('Slow request:', m.url, m.duration + 'ms')
          })
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Compact Mode</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react'

function CompactMonitor() {
  return (
    <div className="fixed bottom-4 right-4">
      <PerformanceAnalyticsDashboard
        compact
        showWebVitals
        showFPS
        updateInterval={2000}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <PropsTable props={performanceAnalyticsDashboardProps} title="Component Props" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Web Vitals</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The dashboard tracks the following Web Vitals:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>LCP (Largest Contentful Paint)</strong> - Measures loading performance (good: &lt;2.5s)</li>
          <li><strong>FID (First Input Delay)</strong> - Measures interactivity (good: &lt;100ms)</li>
          <li><strong>INP (Interaction to Next Paint)</strong> - Measures responsiveness (good: &lt;200ms)</li>
          <li><strong>CLS (Cumulative Layout Shift)</strong> - Measures visual stability (good: &lt;0.1)</li>
          <li><strong>FCP (First Contentful Paint)</strong> - Measures initial render (good: &lt;1.8s)</li>
          <li><strong>TTFB (Time to First Byte)</strong> - Measures server response (good: &lt;800ms)</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Component Metrics</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Tracks render performance for React components:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Render count</li>
          <li>Average render time</li>
          <li>Max/min render times</li>
          <li>Last render time</li>
          <li>Memory usage (if available)</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Use in development</strong> - Monitor performance during development</li>
          <li><strong>Set appropriate intervals</strong> - Balance between accuracy and performance</li>
          <li><strong>Send to analytics</strong> - Use onDataUpdate to send metrics to your analytics service</li>
          <li><strong>Monitor in production</strong> - Use compact mode for production monitoring</li>
          <li><strong>Track trends</strong> - Store historical data to identify performance regressions</li>
          <li><strong>Alert on thresholds</strong> - Set up alerts when metrics exceed thresholds</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/conversation-analytics-dashboard" className="docs-card">
            <h3>ConversationAnalyticsDashboard</h3>
            <p>Conversation analytics</p>
          </a>
          <a href="/reference/components/ab-testing-dashboard" className="docs-card">
            <h3>ABTestingDashboard</h3>
            <p>A/B test analytics</p>
          </a>
          <a href="/reference/hooks/use-performance" className="docs-card">
            <h3>usePerformance Hook</h3>
            <p>Performance monitoring hook</p>
          </a>
          <a href="/guides/performance" className="docs-card">
            <h3>Performance Guide</h3>
            <p>Performance optimization guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'UsageDashboard', href: '/reference/components/usage-dashboard' }}
        next={{ title: 'ConversationAnalyticsDashboard', href: '/reference/components/conversation-analytics-dashboard' }}
      />
    </>
  )
}
