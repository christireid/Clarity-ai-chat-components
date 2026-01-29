'use client'

/**
 * SavingsDashboard Live Demo Page
 *
 * Interactive demonstration of the SavingsDashboard component with:
 * - Real-time data simulation
 * - Multiple time period views
 * - Trend charts and visualizations
 * - Export functionality
 * - Cache monitoring
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, RefreshCw, Play, Pause, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { SavingsDashboard } from '@/../../packages/react/src/components/dashboards/SavingsDashboard'
import type {
  SavingsMetrics,
  TimePeriodMetrics,
  TrendDataPoint,
  ExportFormat,
  TimePeriod,
} from '@/../../packages/react/src/components/dashboards/SavingsDashboard'

// ============================================================================
// Mock Data Generators
// ============================================================================

function generateMetrics(
  baseTokens: number,
  savingsPercent: number,
  requests: number
): SavingsMetrics {
  const tokensSaved = Math.floor(baseTokens * (savingsPercent / 100))
  const costPerToken = 0.000003
  const costSaved = tokensSaved * costPerToken
  const costPerRequest = (baseTokens * costPerToken) / requests

  return {
    totalTokens: baseTokens,
    tokensSaved,
    costSaved,
    requestCount: requests,
    costPerRequest,
    cacheHitRate: 85 + Math.random() * 10,
    savingsPercent,
    strategyBreakdown: {
      providerCaching: {
        savings: costSaved * 0.6,
        percent: 60,
      },
      compression: {
        savings: costSaved * 0.2,
        percent: 20,
      },
      smartRouting: {
        savings: costSaved * 0.11,
        percent: 11,
      },
      responseLimiting: {
        savings: costSaved * 0.04,
        percent: 4,
      },
      batching: {
        savings: costSaved * 0.03,
        percent: 3,
      },
      throttling: {
        savings: costSaved * 0.02,
        percent: 2,
      },
    },
  }
}

function generateInitialMetrics(): TimePeriodMetrics {
  return {
    daily: generateMetrics(50000, 30, 200),
    weekly: generateMetrics(350000, 32, 1400),
    monthly: generateMetrics(1500000, 35, 6000),
    allTime: generateMetrics(15000000, 33, 60000),
  }
}

function generateHistoricalData(days: number = 30): TrendDataPoint[] {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  return Array.from({ length: days }, (_, i) => {
    const timestamp = now - (days - i) * dayMs
    const savingsPercent = 25 + Math.random() * 10 + (i / days) * 5
    const baseTokens = 40000 + Math.random() * 20000
    const tokensSaved = Math.floor(baseTokens * (savingsPercent / 100))
    const costSaved = tokensSaved * 0.000003

    return {
      timestamp,
      tokensSaved,
      costSaved,
      savingsPercent,
      cacheHitRate: 80 + Math.random() * 15,
      requestCount: 150 + Math.floor(Math.random() * 100),
    }
  })
}

// ============================================================================
// Main Demo Component
// ============================================================================

export default function SavingsDashboardDemo() {
  const [metrics, setMetrics] = React.useState<TimePeriodMetrics>(generateInitialMetrics())
  const [historicalData, setHistoricalData] = React.useState<TrendDataPoint[]>(
    generateHistoricalData()
  )
  const [isRealTime, setIsRealTime] = React.useState(false)
  const [selectedPeriod, setSelectedPeriod] = React.useState<TimePeriod>('daily')

  // Simulate real-time updates
  React.useEffect(() => {
    if (!isRealTime) return

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        daily: generateMetrics(
          prev.daily.totalTokens + Math.floor(Math.random() * 1000),
          30 + Math.random() * 5,
          prev.daily.requestCount + Math.floor(Math.random() * 10)
        ),
        weekly: prev.weekly,
        monthly: prev.monthly,
        allTime: prev.allTime,
      }))

      // Add new data point to trends
      setHistoricalData((prev) => {
        const latest = prev[prev.length - 1]
        const newPoint: TrendDataPoint = {
          timestamp: Date.now(),
          tokensSaved: latest.tokensSaved + Math.floor(Math.random() * 500),
          costSaved: latest.costSaved + Math.random() * 0.01,
          savingsPercent: 28 + Math.random() * 6,
          cacheHitRate: 85 + Math.random() * 10,
          requestCount: latest.requestCount + Math.floor(Math.random() * 5),
        }
        return [...prev.slice(-29), newPoint]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isRealTime])

  // Export handler
  const handleExport = (format: ExportFormat) => {
    console.log(`Exporting as ${format}...`)

    const data = {
      period: selectedPeriod,
      metrics: metrics[selectedPeriod],
      historicalData,
      exportedAt: new Date().toISOString(),
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      downloadFile(blob, `savings-dashboard-${selectedPeriod}-${Date.now()}.json`)
    } else {
      const csv = convertToCSV(data)
      const blob = new Blob([csv], { type: 'text/csv' })
      downloadFile(blob, `savings-dashboard-${selectedPeriod}-${Date.now()}.csv`)
    }
  }

  // Reset handler
  const handleReset = () => {
    setMetrics(generateInitialMetrics())
    setHistoricalData(generateHistoricalData())
    setIsRealTime(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.moderate }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-success/10 border border-success/20">
              <TrendingDown className="w-6 h-6 text-success" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Savings Dashboard Demo
              </h1>
              <p className="text-muted-foreground mt-1">
                Interactive demonstration with simulated real-time data
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                isRealTime
                  ? 'bg-success text-success-foreground shadow-sm'
                  : 'bg-card text-foreground border border-border/50 hover:bg-muted'
              )}
            >
              {isRealTime ? (
                <>
                  <Pause className="w-4 h-4" aria-hidden="true" />
                  Pause Real-time
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" aria-hidden="true" />
                  Start Real-time
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-card text-foreground border border-border/50 hover:bg-muted transition-colors"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Reset Data
            </button>

            <div className="flex-1" />

            <div className="text-sm text-muted-foreground">
              {isRealTime && (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Updating every 3 seconds
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.slow, delay: 0.1 }}
        >
          <SavingsDashboard
            metrics={metrics}
            historicalData={historicalData}
            showCharts
            showBreakdown
            realTime={isRealTime}
            refreshInterval={3000}
            onExport={handleExport}
            onTimePeriodChange={setSelectedPeriod}
            defaultPeriod="daily"
          />
        </motion.div>

        {/* Implementation Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.slow, delay: 0.2 }}
          className="mt-8 p-6 bg-muted/30 rounded-lg border border-border/50"
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Implementation Notes
          </h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Real-time Updates:</strong> Data refreshes
              every 3 seconds when real-time mode is active. In production, connect to your
              metrics API.
            </p>
            <p>
              <strong className="text-foreground">Export Functionality:</strong> Click the
              Export button in the dashboard header to download metrics as CSV or JSON.
            </p>
            <p>
              <strong className="text-foreground">Time Periods:</strong> Switch between
              daily, weekly, monthly, and all-time views to see different aggregations.
            </p>
            <p>
              <strong className="text-foreground">Trend Charts:</strong> Historical data is
              visualized with SVG sparklines showing savings progression over time.
            </p>
            <p>
              <strong className="text-foreground">Cache Monitoring:</strong> Cache hit rate
              is tracked with visual progress bars and target indicators (90% target).
            </p>
          </div>
        </motion.div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.slow, delay: 0.3 }}
          className="mt-8 p-6 bg-card rounded-lg border border-border/50"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Usage Example</h2>
          <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
            <code>{`import { SavingsDashboard } from '@clarity-chat/react/dashboards'

function MyApp() {
  const metrics = {
    daily: { /* daily metrics */ },
    weekly: { /* weekly metrics */ },
    monthly: { /* monthly metrics */ },
    allTime: { /* all-time metrics */ },
  }

  const historicalData = [/* trend data points */]

  return (
    <SavingsDashboard
      metrics={metrics}
      historicalData={historicalData}
      showCharts
      showBreakdown
      realTime
      onExport={(format) => handleExport(format)}
    />
  )
}`}</code>
          </pre>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================================================
// Utilities
// ============================================================================

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function convertToCSV(data: {
  period: string
  metrics: SavingsMetrics
  historicalData: TrendDataPoint[]
  exportedAt: string
}): string {
  const { metrics, historicalData, period, exportedAt } = data

  const header = [
    `Savings Dashboard Export - ${period}`,
    `Exported: ${exportedAt}`,
    '',
    'Summary Metrics',
    'Metric,Value',
    `Total Tokens,${metrics.totalTokens}`,
    `Tokens Saved,${metrics.tokensSaved}`,
    `Cost Saved,$${metrics.costSaved.toFixed(4)}`,
    `Savings Percent,${metrics.savingsPercent.toFixed(2)}%`,
    `Request Count,${metrics.requestCount}`,
    `Cost Per Request,$${metrics.costPerRequest.toFixed(4)}`,
    `Cache Hit Rate,${metrics.cacheHitRate.toFixed(2)}%`,
    '',
    'Strategy Breakdown',
    'Strategy,Savings,Percent',
  ]

  const strategies = Object.entries(metrics.strategyBreakdown).map(
    ([key, value]) => `${key},$${value.savings.toFixed(4)},${value.percent.toFixed(2)}%`
  )

  const historyHeader = [
    '',
    'Historical Trend Data',
    'Timestamp,Tokens Saved,Cost Saved,Savings %,Cache Hit Rate,Requests',
  ]
  const historyRows = historicalData.map(
    (point) =>
      `${new Date(point.timestamp).toISOString()},${point.tokensSaved},$${point.costSaved.toFixed(4)},${point.savingsPercent.toFixed(2)}%,${point.cacheHitRate.toFixed(2)}%,${point.requestCount}`
  )

  return [...header, ...strategies, ...historyHeader, ...historyRows].join('\n')
}
