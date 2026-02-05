/**
 * Analytics Dashboards Showcase
 *
 * Demonstrates comprehensive analytics and monitoring capabilities
 * with real-time updates, charts, and export functionality.
 */

import React, { useState, useEffect } from 'react'
import {
  AnalyticsDashboard,
  UsageDashboard,
  TokenCounter,
  // useCostTracker, // Not exported from internal yet
} from '@clarity-chat/react/internal'
import type {
  AnalyticsDashboardMetrics,
  AnalyticsLeaderboardEntry,
  AnalyticsActivity,
  AnalyticsInsight,
  UsageStats,
  CreditBalance,
  UsageLimit,
} from '@clarity-chat/types'

// Sample data generators
function generateMetrics(): AnalyticsDashboardMetrics {
  return {
    totalRevenue: 125000 + Math.random() * 10000,
    conversionRate: 12.5 + Math.random() * 2,
    averageDealSize: 2500 + Math.random() * 500,
    averageSalesCycle: 30 + Math.random() * 10,
    pipelineValue: 450000 + Math.random() * 50000,
    winRate: 35 + Math.random() * 5,
  }
}

function generateLeaderboard(): AnalyticsLeaderboardEntry[] {
  const names = [
    'Sarah Johnson',
    'Michael Chen',
    'Emily Rodriguez',
    'David Kim',
    'Jessica Smith',
  ]
  return names.map((name, index) => ({
    label: name,
    value: 45000 - index * 5000 + Math.random() * 2000,
    change: Math.random() * 20 - 5,
    trend: Math.random() > 0.5 ? 'up' : 'down',
  }))
}

function generateActivities(): AnalyticsActivity[] {
  const activities = [
    'Closed deal with Tech Corp',
    'New lead from Enterprise Inc',
    'Demo scheduled with StartUp LLC',
    'Proposal sent to Global Systems',
    'Follow-up with Innovation Labs',
  ]

  return activities.map((desc, index) => ({
    id: `activity-${index}`,
    timestamp: new Date(Date.now() - index * 3600000),
    description: desc,
    owner: ['Sarah J', 'Michael C', 'Emily R'][Math.floor(Math.random() * 3)],
    impact: ['positive', 'neutral', 'positive'][
      Math.floor(Math.random() * 3)
    ] as 'positive' | 'neutral',
    metadata: {
      value: Math.floor(Math.random() * 50000),
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
    },
  }))
}

function generateInsights(): Array<AnalyticsInsight | string> {
  return [
    {
      title: 'Strong Performance Trend',
      description:
        'Conversion rate increased 15% this quarter. Focus on maintaining engagement strategies.',
      type: 'positive',
    },
    {
      title: 'Pipeline Growth',
      description:
        'Pipeline value exceeded $500K target. Consider scaling sales team.',
      type: 'positive',
    },
    'Average deal size is trending upward, indicating stronger lead quality',
    {
      title: 'Sales Cycle Alert',
      description:
        'Sales cycle length increased by 8 days. Review qualification process.',
      type: 'risk',
    },
  ]
}

function generateUsageStats(): UsageStats {
  return {
    period: 'month',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
    metrics: {
      messagesCount: 1247,
      tokensUsed: 2547893,
      filesUploaded: 34,
      exportsGenerated: 12,
      storageUsed: 450,
      apiCalls: 3421,
    },
    costs: {
      total: 127.5,
      breakdown: [
        {
          category: 'GPT-4 Turbo',
          quantity: 1200000,
          unitPrice: 0.00001,
          amount: 72.0,
        },
        {
          category: 'GPT-3.5 Turbo',
          quantity: 800000,
          unitPrice: 0.000002,
          amount: 28.5,
        },
        { category: 'Claude 3', quantity: 500000, unitPrice: 0.000015, amount: 18.0 },
        { category: 'Storage', quantity: 450, unitPrice: 0.02, amount: 9.0 },
      ],
    },
  }
}

function generateCreditBalance(): CreditBalance {
  return {
    total: 10000,
    used: 3247,
    available: 6753,
    nextRefillDate: new Date(Date.now() + 15 * 24 * 3600000),
    autoRefill: true,
  }
}

function generateUsageLimits(): UsageLimit[] {
  return [
    {
      metric: 'messagesCount',
      current: 1247,
      limit: 2000,
      resetDate: new Date(Date.now() + 15 * 24 * 3600000),
    },
    {
      metric: 'tokensUsed',
      current: 2547893,
      limit: 5000000,
      resetDate: new Date(Date.now() + 15 * 24 * 3600000),
    },
    {
      metric: 'storageUsed',
      current: 450,
      limit: 1000,
      resetDate: new Date(Date.now() + 15 * 24 * 3600000),
    },
    {
      metric: 'apiCalls',
      current: 3421,
      limit: 10000,
      resetDate: new Date(Date.now() + 15 * 24 * 3600000),
    },
  ]
}

type TimeRange = '1h' | '24h' | '7d' | '30d' | 'all'

interface ConversationStat {
  label: string
  value: number
  trend: 'up' | 'down' | 'neutral'
  change: number
}

export function AnalyticsDashboardsShowcase() {
  // State for real-time updates
  const [metrics, setMetrics] = useState<AnalyticsDashboardMetrics>(generateMetrics())
  const [previousMetrics, setPreviousMetrics] =
    useState<AnalyticsDashboardMetrics>(generateMetrics())
  const [leaderboard, setLeaderboard] = useState<AnalyticsLeaderboardEntry[]>(
    generateLeaderboard()
  )
  const [activities, setActivities] = useState<AnalyticsActivity[]>(generateActivities())
  const [insights, setInsights] = useState<Array<AnalyticsInsight | string>>(
    generateInsights()
  )

  // Usage dashboard state
  const [usageStats, setUsageStats] = useState<UsageStats>(generateUsageStats())
  const [creditBalance, setCreditBalance] = useState<CreditBalance>(
    generateCreditBalance()
  )
  const [usageLimits, setUsageLimits] = useState<UsageLimit[]>(generateUsageLimits())

  // Token analytics state
  const [currentTokens, setCurrentTokens] = useState(3247)
  const maxTokens = 4096
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [autoUpdate, setAutoUpdate] = useState(true)

  // Cost tracker - commented out until hook is exported from internal
  // const costTracker = useCostTracker({
  //   persist: true,
  //   storageKey: 'analytics-showcase-cost-tracker',
  // })

  // Conversation stats
  const [conversationStats, setConversationStats] = useState<ConversationStat[]>([
    { label: 'Total Conversations', value: 1247, trend: 'up', change: 12.5 },
    { label: 'Avg Messages/Conv', value: 8.3, trend: 'up', change: 5.2 },
    { label: 'Completion Rate', value: 87.5, trend: 'down', change: -2.1 },
    { label: 'Avg Response Time', value: 1.8, trend: 'down', change: -15.3 },
  ])

  // Error rate data
  const [errorRate, setErrorRate] = useState({
    current: 2.3,
    threshold: 5.0,
    errors24h: 47,
    trend: 'down' as const,
  })

  // Latency data
  const [latencyData, setLatencyData] = useState({
    avg: 1.8,
    p50: 1.2,
    p95: 3.5,
    p99: 5.2,
    trend: 'down' as const,
  })

  // User activity heatmap data (hourly for last 7 days)
  const [heatmapData] = useState(() => {
    const data: number[][] = []
    for (let day = 0; day < 7; day++) {
      const dayData: number[] = []
      for (let hour = 0; hour < 24; hour++) {
        // Simulate realistic activity patterns
        let activity = Math.random() * 100
        // Higher activity during work hours (9-5)
        if (hour >= 9 && hour <= 17) {
          activity *= 2
        }
        // Lower activity at night (0-6)
        if (hour >= 0 && hour <= 6) {
          activity *= 0.3
        }
        dayData.push(Math.floor(activity))
      }
      data.push(dayData)
    }
    return data
  })

  // Auto-update effect
  useEffect(() => {
    if (!autoUpdate) return

    const interval = setInterval(() => {
      // Update metrics with slight variations
      setMetrics((prev) => ({
        ...prev,
        totalRevenue: prev.totalRevenue! + Math.random() * 1000 - 500,
        conversionRate: Math.max(0, prev.conversionRate! + Math.random() * 0.5 - 0.25),
      }))

      // Simulate token usage
      setCurrentTokens((prev) => Math.min(maxTokens, prev + Math.floor(Math.random() * 50)))

      // Update conversation stats
      setConversationStats((prev) =>
        prev.map((stat) => ({
          ...stat,
          value: stat.value + (Math.random() * 2 - 1),
        }))
      )

      // Update error rate
      setErrorRate((prev) => ({
        ...prev,
        current: Math.max(0, prev.current + (Math.random() * 0.2 - 0.1)),
        errors24h: prev.errors24h + (Math.random() > 0.5 ? 1 : 0),
      }))

      // Update latency
      setLatencyData((prev) => ({
        ...prev,
        avg: Math.max(0.5, prev.avg + (Math.random() * 0.2 - 0.1)),
        p50: Math.max(0.3, prev.p50 + (Math.random() * 0.1 - 0.05)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [autoUpdate, maxTokens])

  // Export handlers
  const handleExportJSON = () => {
    const data = {
      metrics,
      usageStats,
      conversationStats,
      errorRate,
      latencyData,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Commented out until useCostTracker is exported
  // const handleExportCSV = () => {
  //   const csv = costTracker.exportCsv()
  //   const blob = new Blob([csv], { type: 'text/csv' })
  //   const url = URL.createObjectURL(blob)
  //   const a = document.createElement('a')
  //   a.href = url
  //   a.download = `cost-tracker-${Date.now()}.csv`
  //   a.click()
  //   URL.revokeObjectURL(url)
  // }

  const handlePurchaseCredits = () => {
    alert('Navigate to billing page to purchase credits')
  }

  return (
    <div className="analytics-dashboards-showcase">
      <header className="showcase-header">
        <div>
          <h1>Analytics Dashboards Showcase</h1>
          <p>Comprehensive analytics and monitoring with real-time updates</p>
        </div>
        <div className="header-controls">
          <label className="auto-update-toggle">
            <input
              type="checkbox"
              checked={autoUpdate}
              onChange={(e) => setAutoUpdate(e.target.checked)}
            />
            <span>Auto-update</span>
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="time-range-select"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          <button onClick={handleExportJSON} className="export-btn">
            Export JSON
          </button>
          <button onClick={handleExportCSV} className="export-btn">
            Export CSV
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* 1. Usage Metrics Dashboard */}
        <section className="dashboard-section full-width">
          <h2>Usage Metrics & Cost Tracking</h2>
          <UsageDashboard
            balance={creditBalance}
            stats={usageStats}
            limits={usageLimits}
            onPurchaseCredits={handlePurchaseCredits}
          />
        </section>

        {/* 2. Performance Monitor - Component not exported yet */}
        {/* <section className="dashboard-section full-width">
          <h2>Performance Monitoring</h2>
          <PerformanceDashboard autoRefresh={autoUpdate} refreshInterval={5000} />
        </section> */}

        {/* 3. Token Analytics */}
        <section className="dashboard-section">
          <h2>Token Analytics</h2>
          <div className="token-analytics-card">
            <TokenCounter
              currentTokens={currentTokens}
              maxTokens={maxTokens}
              costPerToken={0.000002}
              showCost={true}
              showBar={true}
              showWarning={true}
              suggestPruning={currentTokens > maxTokens * 0.8}
              onWarning={() => console.log('Warning threshold reached')}
              onCritical={() => console.log('Critical threshold reached')}
            />
            <div className="token-stats">
              <div className="stat">
                <span className="label">Usage %</span>
                <span className="value">
                  {((currentTokens / maxTokens) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="stat">
                <span className="label">Remaining</span>
                <span className="value">{(maxTokens - currentTokens).toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="label">Est. Cost</span>
                <span className="value">${(currentTokens * 0.000002).toFixed(4)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Cost Tracker */}
        {/* 4. Cost Tracker - Commented out until useCostTracker is exported */}
        {/* <section className="dashboard-section">
          <h2>Cost Tracker Breakdown</h2>
          <div className="cost-tracker-card">
            <div className="cost-totals">
              <div className="total-item">
                <span className="icon">💰</span>
                <div>
                  <div className="label">Total Cost</div>
                  <div className="value">${costTracker.totals().costUsd.toFixed(2)}</div>
                </div>
              </div>
              <div className="total-item">
                <span className="icon">📊</span>
                <div>
                  <div className="label">Requests</div>
                  <div className="value">{costTracker.totals().requestCount}</div>
                </div>
              </div>
              <div className="total-item">
                <span className="icon">🔤</span>
                <div>
                  <div className="label">Input Tokens</div>
                  <div className="value">
                    {costTracker.totals().inputTokens.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="total-item">
                <span className="icon">✍️</span>
                <div>
                  <div className="label">Output Tokens</div>
                  <div className="value">
                    {costTracker.totals().outputTokens.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => costTracker.reset()} className="reset-btn">
              Reset Tracker
            </button>
          </div>
        </section> */}

        {/* 5. Error Rate Chart */}
        <section className="dashboard-section">
          <h2>Error Rate Monitor</h2>
          <div className="error-rate-card">
            <div className="error-header">
              <div className="error-rate">
                <span className="value">{errorRate.current.toFixed(2)}%</span>
                <span className={`trend ${errorRate.trend}`}>
                  {errorRate.trend === 'down' ? '▼' : '▲'}
                </span>
              </div>
              <div className="error-threshold">
                Threshold: {errorRate.threshold}%
              </div>
            </div>
            <div className="error-progress">
              <div
                className="error-bar"
                style={{
                  width: `${(errorRate.current / errorRate.threshold) * 100}%`,
                }}
              />
            </div>
            <div className="error-stats">
              <div className="stat">
                <span className="label">Errors (24h)</span>
                <span className="value">{errorRate.errors24h}</span>
              </div>
              <div className="stat">
                <span className="label">Status</span>
                <span className={`value ${errorRate.current < 3 ? 'good' : 'warning'}`}>
                  {errorRate.current < 3 ? 'Healthy' : 'Monitor'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Latency Graph */}
        <section className="dashboard-section">
          <h2>Latency Metrics</h2>
          <div className="latency-card">
            <div className="latency-metrics">
              <div className="metric">
                <span className="label">Average</span>
                <span className="value">{latencyData.avg.toFixed(2)}s</span>
              </div>
              <div className="metric">
                <span className="label">P50</span>
                <span className="value">{latencyData.p50.toFixed(2)}s</span>
              </div>
              <div className="metric">
                <span className="label">P95</span>
                <span className="value">{latencyData.p95.toFixed(2)}s</span>
              </div>
              <div className="metric">
                <span className="label">P99</span>
                <span className="value">{latencyData.p99.toFixed(2)}s</span>
              </div>
            </div>
            <div className="latency-chart">
              <div className="chart-bars">
                <div className="bar" style={{ height: `${(latencyData.avg / 6) * 100}%` }}>
                  <span>Avg</span>
                </div>
                <div className="bar" style={{ height: `${(latencyData.p50 / 6) * 100}%` }}>
                  <span>P50</span>
                </div>
                <div className="bar" style={{ height: `${(latencyData.p95 / 6) * 100}%` }}>
                  <span>P95</span>
                </div>
                <div className="bar" style={{ height: `${(latencyData.p99 / 6) * 100}%` }}>
                  <span>P99</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Conversation Stats */}
        <section className="dashboard-section full-width">
          <h2>Conversation Statistics</h2>
          <div className="conversation-stats-grid">
            {conversationStats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">{stat.label}</span>
                  <span className={`stat-trend ${stat.trend}`}>
                    {stat.trend === 'up' ? '▲' : stat.trend === 'down' ? '▼' : '─'}{' '}
                    {Math.abs(stat.change).toFixed(1)}%
                  </span>
                </div>
                <div className="stat-value">{stat.value.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. User Activity Heatmap */}
        <section className="dashboard-section full-width">
          <h2>User Activity Heatmap (Last 7 Days)</h2>
          <div className="heatmap-card">
            <div className="heatmap-grid">
              <div className="heatmap-y-axis">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="y-label">
                    {day}
                  </div>
                ))}
              </div>
              <div className="heatmap-cells">
                {heatmapData.map((dayData, dayIndex) => (
                  <div key={dayIndex} className="heatmap-row">
                    {dayData.map((activity, hourIndex) => {
                      const intensity = Math.min(activity / 100, 1)
                      return (
                        <div
                          key={hourIndex}
                          className="heatmap-cell"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                          }}
                          title={`${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex]} ${hourIndex}:00 - ${activity} activities`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="heatmap-x-axis">
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <div key={hour} className="x-label">
                  {hour % 3 === 0 ? `${hour}h` : ''}
                </div>
              ))}
            </div>
            <div className="heatmap-legend">
              <span>Less</span>
              <div className="legend-gradient" />
              <span>More</span>
            </div>
          </div>
        </section>

        {/* Analytics Overview Dashboard */}
        <section className="dashboard-section full-width">
          <h2>Analytics Overview</h2>
          <AnalyticsDashboard
            metrics={metrics}
            previousMetrics={previousMetrics}
            leaderboard={leaderboard}
            insights={insights}
            recentActivities={activities}
            title="Business Analytics"
            subtitle="Real-time performance metrics and insights"
          />
        </section>
      </div>

      <style>{`
        .analytics-dashboards-showcase {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .showcase-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border);
        }

        .showcase-header h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          color: var(--foreground);
        }

        .showcase-header p {
          margin: 0;
          color: var(--muted-foreground);
        }

        .header-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .auto-update-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .time-range-select {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border);
          border-radius: 0.375rem;
          background: var(--background);
          color: var(--foreground);
          cursor: pointer;
        }

        .export-btn {
          padding: 0.5rem 1rem;
          background: var(--primary);
          color: var(--primary-foreground);
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .export-btn:hover {
          opacity: 0.9;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .dashboard-section {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .dashboard-section.full-width {
          grid-column: 1 / -1;
        }

        .dashboard-section h2 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          color: var(--foreground);
        }

        /* Token Analytics Card */
        .token-analytics-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .token-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .token-stats .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem;
          background: var(--muted);
          border-radius: 0.375rem;
        }

        .token-stats .label {
          font-size: 0.75rem;
          color: var(--muted-foreground);
          text-transform: uppercase;
        }

        .token-stats .value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--foreground);
        }

        /* Cost Tracker Card */
        .cost-tracker-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cost-totals {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .total-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--muted);
          border-radius: 0.375rem;
        }

        .total-item .icon {
          font-size: 2rem;
        }

        .total-item .label {
          font-size: 0.75rem;
          color: var(--muted-foreground);
        }

        .total-item .value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--foreground);
        }

        .reset-btn {
          padding: 0.5rem 1rem;
          background: var(--destructive);
          color: var(--destructive-foreground);
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
        }

        /* Error Rate Card */
        .error-rate-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .error-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-rate {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .error-rate .value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .error-rate .trend {
          font-size: 1.25rem;
        }

        .error-rate .trend.down {
          color: var(--success, green);
        }

        .error-rate .trend.up {
          color: var(--destructive, red);
        }

        .error-progress {
          height: 1rem;
          background: var(--muted);
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .error-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--success, green), var(--warning, orange));
          transition: width 0.3s ease;
        }

        .error-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .error-stats .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .error-stats .label {
          font-size: 0.75rem;
          color: var(--muted-foreground);
        }

        .error-stats .value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--foreground);
        }

        .error-stats .value.good {
          color: var(--success, green);
        }

        .error-stats .value.warning {
          color: var(--warning, orange);
        }

        /* Latency Card */
        .latency-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .latency-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .latency-metrics .metric {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: center;
        }

        .latency-metrics .label {
          font-size: 0.75rem;
          color: var(--muted-foreground);
        }

        .latency-metrics .value {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--foreground);
        }

        .latency-chart {
          padding: 1rem;
          background: var(--muted);
          border-radius: 0.375rem;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 200px;
          gap: 1rem;
        }

        .chart-bars .bar {
          flex: 1;
          background: var(--primary);
          border-radius: 0.25rem 0.25rem 0 0;
          min-height: 20px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 0.5rem;
          transition: height 0.3s ease;
        }

        .chart-bars .bar span {
          font-size: 0.75rem;
          color: var(--primary-foreground);
          font-weight: 600;
        }

        /* Conversation Stats Grid */
        .conversation-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          padding: 1.5rem;
          background: var(--muted);
          border-radius: 0.5rem;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--muted-foreground);
        }

        .stat-trend {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .stat-trend.up {
          color: var(--success, green);
        }

        .stat-trend.down {
          color: var(--destructive, red);
        }

        .stat-trend.neutral {
          color: var(--muted-foreground);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--foreground);
        }

        /* Heatmap Card */
        .heatmap-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .heatmap-grid {
          display: flex;
          gap: 0.5rem;
        }

        .heatmap-y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .y-label {
          font-size: 0.75rem;
          color: var(--muted-foreground);
          text-align: right;
          padding-right: 0.5rem;
        }

        .heatmap-cells {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .heatmap-row {
          display: flex;
          gap: 2px;
        }

        .heatmap-cell {
          width: 16px;
          height: 16px;
          border-radius: 2px;
          background: var(--muted);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .heatmap-cell:hover {
          transform: scale(1.2);
        }

        .heatmap-x-axis {
          display: flex;
          margin-left: 3rem;
          gap: 2px;
        }

        .x-label {
          width: 16px;
          font-size: 0.625rem;
          color: var(--muted-foreground);
          text-align: center;
        }

        .heatmap-legend {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          font-size: 0.75rem;
          color: var(--muted-foreground);
        }

        .legend-gradient {
          width: 100px;
          height: 1rem;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 1));
          border-radius: 0.25rem;
        }

        @media (max-width: 768px) {
          .analytics-dashboards-showcase {
            padding: 1rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .showcase-header {
            flex-direction: column;
            gap: 1rem;
          }

          .header-controls {
            width: 100%;
            flex-wrap: wrap;
          }

          .cost-totals,
          .conversation-stats-grid {
            grid-template-columns: 1fr;
          }

          .heatmap-cell {
            width: 12px;
            height: 12px;
          }

          .x-label {
            width: 12px;
          }
        }
      `}</style>
    </div>
  )
}
