import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'


export const metadata: Metadata = {
  title: 'useDashboardData Hook | Clarity Chat',
  description:
    'Data fetching hook for dashboards with loading states, error handling, and automatic refresh.',
}

export default function UseDashboardDataPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium mb-4">
          <span>Analytics</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useDashboardData</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Data fetching hook for analytics dashboards. Provides loading states, error handling,
          automatic refresh, and data caching.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Mid-Level (Composable) •{' '}
          <strong>Domain:</strong> Analytics
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
          <li>Building analytics dashboards that display chat metrics</li>
          <li>Creating admin panels with auto-refreshing data</li>
          <li>When you need polling with configurable intervals</li>
          <li>Implementing dashboards with loading states and error handling</li>
        </ul>

        <h2 className="text-3xl font-semibold mb-4">When NOT to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>For real-time data - use WebSocket with <code className="bg-muted px-2 py-1 rounded">useStreamingWebSocket</code></li>
          <li>For simple one-time fetches - use React Query or SWR directly</li>
          <li>For chat message fetching - use <code className="bg-muted px-2 py-1 rounded">useClarityChat</code> instead</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <CodePlayground
          code={`import { useDashboardData } from '@clarity-chat/react'

function AnalyticsDashboard() {
  const {
    data,
    isLoading,
    isRefreshing,
    error,
    refresh,
    lastUpdated,
  } = useDashboardData({
    fetchFn: async () => {
      const response = await fetch('/api/analytics')
      return response.json()
    },
    refreshInterval: 30000, // Refresh every 30 seconds
    cacheKey: 'analytics-dashboard',
  })

  if (isLoading) return <DashboardSkeleton />
  if (error) return <ErrorState error={error} onRetry={refresh} />

  return (
    <div>
      <header>
        <span>Last updated: {lastUpdated?.toLocaleString()}</span>
        <button onClick={refresh} disabled={isRefreshing}>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard title="Messages" value={data.totalMessages} />
        <MetricCard title="Users" value={data.activeUsers} />
        <MetricCard title="Tokens" value={data.tokensUsed} />
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Options</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">fetchFn</td>
                    <td className="p-3 font-mono text-sm">() =&gt; Promise&lt;T&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      <strong>Required.</strong> Function to fetch dashboard data.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">refreshInterval</td>
                    <td className="p-3 font-mono text-sm">number</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Auto-refresh interval in milliseconds.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">cacheKey</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Key for caching data across renders.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">cacheDuration</td>
                    <td className="p-3 font-mono text-sm">number</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      How long to cache data (ms). Default: 60000.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">enabled</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Whether to fetch data. Default: true.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">onError</td>
                    <td className="p-3 font-mono text-sm">(error: Error) =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Error callback for logging/reporting.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3">Return Value</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">data</td>
                    <td className="p-3 font-mono text-sm">T | null</td>
                    <td className="p-3 text-sm text-muted-foreground">Fetched data.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">isLoading</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">Initial loading state.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">isRefreshing</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">Background refresh state.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">error</td>
                    <td className="p-3 font-mono text-sm">Error | null</td>
                    <td className="p-3 text-sm text-muted-foreground">Error from last fetch.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">refresh</td>
                    <td className="p-3 font-mono text-sm">() =&gt; Promise&lt;void&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">Manually trigger refresh.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">lastUpdated</td>
                    <td className="p-3 font-mono text-sm">Date | null</td>
                    <td className="p-3 text-sm text-muted-foreground">Timestamp of last fetch.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/components/analytics-dashboard"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">AnalyticsDashboard</h3>
            <p className="text-sm text-muted-foreground">
              Pre-built analytics dashboard component.
            </p>
          </Link>
          <Link
            href="/guides/observability"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Observability Guide</h3>
            <p className="text-sm text-muted-foreground">
              Monitor and analyze your chat application.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
