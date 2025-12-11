'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Zap,
  RefreshCw,
  Settings,
} from 'lucide-react'

// =============================================================================
// Types
// =============================================================================

interface MetricCard {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ElementType
}

interface SafetyAlert {
  id: string
  level: 'low' | 'medium' | 'high'
  message: string
  timestamp: Date
  resolved: boolean
}

interface UsageData {
  timestamp: string
  requests: number
  tokens: number
  cost: number
}

// =============================================================================
// Mock Data Generators
// =============================================================================

function generateMockUsageData(): UsageData[] {
  const now = new Date()
  const data: UsageData[] = []

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now)
    timestamp.setHours(timestamp.getHours() - i)

    data.push({
      timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit' }),
      requests: Math.floor(Math.random() * 500) + 100,
      tokens: Math.floor(Math.random() * 50000) + 10000,
      cost: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
    })
  }

  return data
}

function generateMockAlerts(): SafetyAlert[] {
  return [
    {
      id: '1',
      level: 'high',
      message: 'Potential PII detected in user prompt',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      resolved: false,
    },
    {
      id: '2',
      level: 'medium',
      message: 'Unusual token usage spike detected',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      resolved: false,
    },
    {
      id: '3',
      level: 'low',
      message: 'Response latency above threshold (>2s)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      resolved: true,
    },
  ]
}

// =============================================================================
// Components
// =============================================================================

function StatCard({ label, value, change, changeType, icon: Icon }: MetricCard) {
  return (
    <div className="p-6 bg-card border rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                changeType === 'positive'
                  ? 'text-green-600'
                  : changeType === 'negative'
                  ? 'text-red-600'
                  : 'text-muted-foreground'
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

function SafetyAlertItem({
  alert,
  onResolve,
}: {
  alert: SafetyAlert
  onResolve: (id: string) => void
}) {
  const levelColors = {
    low: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <div
      className={`p-4 border rounded-lg ${
        alert.resolved ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {alert.level === 'high' ? (
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          ) : (
            <Shield className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  levelColors[alert.level]
                }`}
              >
                {alert.level.toUpperCase()}
              </span>
              {alert.resolved && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Resolved
                </span>
              )}
            </div>
            <p className="text-sm font-medium">{alert.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {alert.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
        {!alert.resolved && (
          <button
            onClick={() => onResolve(alert.id)}
            className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  )
}

function UsageChart({ data }: { data: UsageData[] }) {
  const maxRequests = Math.max(...data.map(d => d.requests))

  return (
    <div className="p-6 bg-card border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Request Volume (24h)</h3>
      <div className="h-48 flex items-end gap-1">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1"
            title={`${d.timestamp}: ${d.requests} requests`}
          >
            <div
              className="w-full bg-primary/80 hover:bg-primary rounded-t transition-colors"
              style={{
                height: `${(d.requests / maxRequests) * 100}%`,
                minHeight: '4px',
              }}
            />
            {i % 4 === 0 && (
              <span className="text-[10px] text-muted-foreground">
                {d.timestamp}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TokenBreakdown() {
  const breakdown = [
    { label: 'Input Tokens', value: 1250000, percentage: 45, color: 'bg-blue-500' },
    { label: 'Output Tokens', value: 850000, percentage: 30, color: 'bg-green-500' },
    { label: 'Cached Tokens', value: 450000, percentage: 16, color: 'bg-purple-500' },
    { label: 'System Tokens', value: 250000, percentage: 9, color: 'bg-orange-500' },
  ]

  return (
    <div className="p-6 bg-card border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Token Breakdown</h3>
      <div className="space-y-4">
        {breakdown.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.label}</span>
              <span className="text-muted-foreground">
                {(item.value / 1000000).toFixed(2)}M ({item.percentage}%)
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ModelPerformance() {
  const models = [
    { name: 'gpt-4o', latency: 1.2, accuracy: 94, cost: 2.5 },
    { name: 'gpt-4o-mini', latency: 0.4, accuracy: 89, cost: 0.3 },
    { name: 'claude-3.5-sonnet', latency: 0.9, accuracy: 92, cost: 1.5 },
  ]

  return (
    <div className="p-6 bg-card border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Model</th>
              <th className="text-right py-2 font-medium">Latency</th>
              <th className="text-right py-2 font-medium">Accuracy</th>
              <th className="text-right py-2 font-medium">Cost/1K</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-3 font-medium">{model.name}</td>
                <td className="py-3 text-right text-muted-foreground">
                  {model.latency}s
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`${
                      model.accuracy >= 90
                        ? 'text-green-600'
                        : model.accuracy >= 80
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {model.accuracy}%
                  </span>
                </td>
                <td className="py-3 text-right text-muted-foreground">
                  ${model.cost.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// =============================================================================
// Main Dashboard
// =============================================================================

export default function EnterpriseAIOpsPage() {
  const [usageData, setUsageData] = useState<UsageData[]>([])
  const [alerts, setAlerts] = useState<SafetyAlert[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Initialize data
  useEffect(() => {
    setUsageData(generateMockUsageData())
    setAlerts(generateMockAlerts())
  }, [])

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setUsageData(generateMockUsageData())
    setLastRefresh(new Date())
    setIsRefreshing(false)
  }

  // Resolve alert
  const handleResolveAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, resolved: true } : a))
    )
  }

  // Calculate metrics
  const totalRequests = usageData.reduce((sum, d) => sum + d.requests, 0)
  const totalTokens = usageData.reduce((sum, d) => sum + d.tokens, 0)
  const totalCost = usageData.reduce((sum, d) => sum + d.cost, 0)
  const avgLatency = 0.8 // Mock average latency

  const metrics: MetricCard[] = [
    {
      label: 'Total Requests (24h)',
      value: totalRequests.toLocaleString(),
      change: '+12% vs yesterday',
      changeType: 'positive',
      icon: Activity,
    },
    {
      label: 'Tokens Used',
      value: `${(totalTokens / 1000000).toFixed(2)}M`,
      change: '-5% vs yesterday',
      changeType: 'positive',
      icon: Zap,
    },
    {
      label: 'Total Cost',
      value: `$${totalCost.toFixed(2)}`,
      change: '+8% vs yesterday',
      changeType: 'negative',
      icon: DollarSign,
    },
    {
      label: 'Avg Latency',
      value: `${avgLatency}s`,
      change: 'Within SLA',
      changeType: 'positive',
      icon: Clock,
    },
  ]

  const unresolvedAlerts = alerts.filter(a => !a.resolved).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Enterprise AI Ops</h1>
              <p className="text-xs text-muted-foreground">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unresolvedAlerts > 0 && (
              <span className="flex items-center gap-1 text-sm text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                {unresolvedAlerts} alert{unresolvedAlerts > 1 ? 's' : ''}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-muted rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              aria-label="Refresh data"
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* Metrics Grid */}
        <section aria-labelledby="metrics-heading" className="mb-8">
          <h2 id="metrics-heading" className="sr-only">
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, i) => (
              <StatCard key={i} {...metric} />
            ))}
          </div>
        </section>

        {/* Charts Row */}
        <section aria-labelledby="analytics-heading" className="mb-8">
          <h2 id="analytics-heading" className="sr-only">
            Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UsageChart data={usageData} />
            <TokenBreakdown />
          </div>
        </section>

        {/* Bottom Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Safety Alerts */}
          <div className="p-6 bg-card border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Safety Alerts
              </h3>
              <span className="text-sm text-muted-foreground">
                {unresolvedAlerts} unresolved
              </span>
            </div>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No alerts to display
                </p>
              ) : (
                alerts.map(alert => (
                  <SafetyAlertItem
                    key={alert.id}
                    alert={alert}
                    onResolve={handleResolveAlert}
                  />
                ))
              )}
            </div>
          </div>

          {/* Model Performance */}
          <ModelPerformance />
        </section>
      </main>
    </div>
  )
}
