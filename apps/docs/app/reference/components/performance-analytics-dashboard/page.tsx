import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'PerformanceAnalyticsDashboard - Clarity Chat Components',
  description:
    'Real-time performance monitoring dashboard with Web Vitals, component metrics, and network tracking.',
}

const props: Prop[] = [
  {
    name: 'data',
    type: 'PerformanceAnalytics',
    description: 'Performance data to display',
  },
  {
    name: 'updateInterval',
    type: 'number',
    description: 'Update interval in milliseconds',
  },
  {
    name: 'showWebVitals',
    type: 'boolean',
    description: 'Show Web Vitals section',
  },
  {
    name: 'showComponentMetrics',
    type: 'boolean',
    description: 'Show component metrics section',
  },
  {
    name: 'showNetworkMetrics',
    type: 'boolean',
    description: 'Show network metrics section',
  },
  {
    name: 'showMemoryUsage',
    type: 'boolean',
    description: 'Show memory usage section',
  },
  {
    name: 'showFPS',
    type: 'boolean',
    description: 'Show FPS counter',
  },
  {
    name: 'onDataUpdate',
    type: '(data: PerformanceAnalytics) => void',
    description: 'Callback when performance data updates',
  },
  {
    name: 'compact',
    type: 'boolean',
    description: 'Compact mode',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function PerformanceAnalyticsDashboardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>PerformanceAnalyticsDashboard</h1>
        <p className="docs-lead">
          Real-time performance monitoring dashboard with Core Web Vitals,
          component metrics, network tracking, and memory usage.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Monitor Core Web Vitals in real-time',
          'Track component render performance',
          'Monitor network request performance',
          'Track memory usage and FPS',
          'Configure update intervals',
        ]}
      />

      <Callout type="info" className="my-6">
        <p>
          <strong>New in 2025:</strong> This dashboard provides 50% faster issue
          detection with real-time performance monitoring across all key
          metrics.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Display performance dashboard with default configuration:</p>
        <CodePlayground
          code={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react/internal'

function ChatWithPerformance() {
  return (
    <div className="p-4">
      <PerformanceAnalyticsDashboard
        updateInterval={1000}
        showWebVitals
        showComponentMetrics
        showMemoryUsage
        showFPS
        onDataUpdate={(data) => {
          logger.debug('Performance:', data)
        }}
      />
    </div>
  )
}

render(<ChatWithPerformance />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Web Vitals Monitoring</h2>
        <p>Monitor Core Web Vitals (LCP, FID, FCP, CLS, TTFB, INP):</p>
        <CodePlayground
          code={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react/internal'

function WebVitalsDashboard() {
  return (
    <PerformanceAnalyticsDashboard
      updateInterval={1000}
      showWebVitals={true}
      onDataUpdate={(data) => {
        data.webVitals.forEach((vital) => {
          logger.debug(\`\${vital.name}: \${vital.value} (\${vital.rating})\`)
        })
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Component Metrics</h2>
        <p>Track component render performance:</p>
        <CodePlayground
          code={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react/internal'

function ComponentMetricsDashboard() {
  return (
    <PerformanceAnalyticsDashboard
      updateInterval={1000}
      showComponentMetrics={true}
      onDataUpdate={(data) => {
        data.componentMetrics.forEach((metric) => {
          logger.debug(\`\${metric.name}: \${metric.averageRenderTime}ms\`)
        })
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Network Monitoring</h2>
        <p>Monitor network request performance:</p>
        <CodePlayground
          code={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react/internal'

function NetworkDashboard() {
  return (
    <PerformanceAnalyticsDashboard
      updateInterval={1000}
      showNetworkMetrics={true}
      onDataUpdate={(data) => {
        data.networkMetrics.forEach((metric) => {
          logger.debug(\`\${metric.method} \${metric.url}: \${metric.duration}ms\`)
        })
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Memory and FPS Tracking</h2>
        <p>Track memory usage and frame rate:</p>
        <CodePlayground
          code={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react/internal'

function MemoryFPSDashboard() {
  return (
    <PerformanceAnalyticsDashboard
      updateInterval={1000}
      showMemoryUsage={true}
      showFPS={true}
      onDataUpdate={(data) => {
        if (data.memoryUsage) {
          logger.debug(\`Memory: \${data.memoryUsage.used}MB / \${data.memoryUsage.total}MB\`)
        }
        if (data.fps) {
          logger.debug(\`FPS: \${data.fps}\`)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Data</h2>
        <p>Provide custom performance data:</p>
        <CodePlayground
          code={`import { PerformanceAnalyticsDashboard, type PerformanceAnalytics } from '@clarity-chat/react/internal'

function CustomDataDashboard() {
  const [data, setData] = React.useState<PerformanceAnalytics>({
    webVitals: [],
    componentMetrics: [],
    networkMetrics: [],
    timestamp: Date.now(),
  })

  // Collect your own metrics
  React.useEffect(() => {
    const interval = setInterval(() => {
      setData({
        webVitals: [
          { name: 'LCP', value: 1200, rating: 'good', delta: 0 },
          { name: 'FID', value: 50, rating: 'good', delta: 0 },
        ],
        componentMetrics: [],
        networkMetrics: [],
        timestamp: Date.now(),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <PerformanceAnalyticsDashboard
      data={data}
      showWebVitals
      onDataUpdate={(updatedData) => {
        // Handle data updates
        logger.debug('Performance data updated:', updatedData)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Compact Mode</h2>
        <p>Use compact mode for minimal UI footprint:</p>
        <CodePlayground
          code={`import { PerformanceAnalyticsDashboard } from '@clarity-chat/react/internal'

function CompactDashboard() {
  return (
    <PerformanceAnalyticsDashboard
      compact={true}
      showWebVitals
      showFPS
      updateInterval={2000}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Performance Metrics</h2>
        <h3>Web Vitals</h3>
        <ul>
          <li>
            <strong>LCP</strong> (Largest Contentful Paint): Measures loading
            performance
          </li>
          <li>
            <strong>FID</strong> (First Input Delay): Measures interactivity
          </li>
          <li>
            <strong>FCP</strong> (First Contentful Paint): Measures initial
            render
          </li>
          <li>
            <strong>CLS</strong> (Cumulative Layout Shift): Measures visual
            stability
          </li>
          <li>
            <strong>TTFB</strong> (Time to First Byte): Measures server response
            time
          </li>
          <li>
            <strong>INP</strong> (Interaction to Next Paint): Measures
            responsiveness
          </li>
        </ul>

        <h3>Component Metrics</h3>
        <ul>
          <li>Render count and timing</li>
          <li>Average, min, max render times</li>
          <li>Memory usage per component</li>
        </ul>

        <h3>Network Metrics</h3>
        <ul>
          <li>Request duration</li>
          <li>Response size</li>
          <li>Status codes</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Use <code>updateInterval</code> of 1000ms for real-time monitoring
          </li>
          <li>Enable only the metrics you need to reduce overhead</li>
          <li>
            Use <code>compact</code> mode in production
          </li>
          <li>Monitor Web Vitals for SEO and user experience</li>
          <li>Track component metrics during development</li>
          <li>Use network metrics to identify slow API calls</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/performance-dashboard">
              PerformanceDashboard
            </a>{' '}
            - Basic performance dashboard
          </li>
          <li>
            <a href="/reference/hooks/use-performance">usePerformance</a> -
            Performance monitoring hook
          </li>
          <li>
            <a href="/guides/performance">Performance Guide</a> - Performance
            optimization strategies
          </li>
        </ul>
      </section>
    </div>
  )
}
