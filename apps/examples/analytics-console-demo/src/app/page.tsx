'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  Coins,
  Zap,
  Activity,
  TrendingUp,
  Clock,
  RefreshCw,
} from 'lucide-react'
import type {
  SummaryStats,
  DailySummary,
  AnalyticsEntry,
} from '@/types/analytics'

// Disable static optimization
export const dynamic = 'force-dynamic'

// Simple Card component
function Card({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

// Simple Progress component
function Progress({ value }: { value: number }) {
  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

// Token counter component
function TokenCounter({
  current,
  max,
  cost,
}: {
  current: number
  max: number
  cost: number
}) {
  const percentage = (current / max) * 100
  return (
    <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-3 py-2">
      <div className="text-sm">
        <span className="font-semibold text-slate-900">
          {current.toLocaleString()}
        </span>
        <span className="text-slate-500"> / {max.toLocaleString()}</span>
      </div>
      <div className="w-20">
        <Progress value={percentage} />
      </div>
      <div className="text-sm text-green-600 font-mono">${cost.toFixed(2)}</div>
    </div>
  )
}

export default function AnalyticsConsolePage() {
  const [stats, setStats] = useState<SummaryStats | null>(null)
  const [dailyData, setDailyData] = useState<DailySummary[]>([])
  const [recentEntries, setRecentEntries] = useState<AnalyticsEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [timeRange, setTimeRange] = useState(30)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Load summary stats
      const summaryRes = await fetch('/api/analytics/summary')
      const summaryData = await summaryRes.json()
      setStats(summaryData)

      // Load daily data
      const dailyRes = await fetch(`/api/analytics/daily?days=${timeRange}`)
      const dailyJson = await dailyRes.json()
      setDailyData(dailyJson.summaries || [])

      // Load recent entries
      const recentRes = await fetch('/api/analytics/recent?limit=10')
      const recentJson = await recentRes.json()
      setRecentEntries(recentJson.entries || [])
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    setIsMounted(true)
    loadData()
  }, [loadData])

  async function handleRefresh() {
    setIsRefreshing(true)
    await loadData()
    setIsRefreshing(false)
  }

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Analytics Console
                </h1>
                <p className="text-sm text-slate-600">
                  Token Usage & Cost Analytics • Clarity Chat
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <TokenCounter
                current={stats?.totalTokens || 0}
                max={1000000}
                cost={(stats?.totalTokens || 0) * 0.00001}
              />
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-5 h-5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`}
                />
              </button>
              <a
                href="/"
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Back to Docs
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Requests"
            value={stats?.totalRequests.toLocaleString() || '0'}
            icon={<Activity className="w-6 h-6" />}
            color="blue"
            trend="+12%"
          />
          <SummaryCard
            title="Total Tokens"
            value={stats?.totalTokens.toLocaleString() || '0'}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            trend="+8%"
          />
          <SummaryCard
            title="Total Cost"
            value={`$${(stats?.totalCost || 0).toFixed(4)}`}
            icon={<Coins className="w-6 h-6" />}
            color="green"
            trend="-3%"
          />
          <SummaryCard
            title="Avg Response"
            value={`${Math.round(stats?.avgResponseTime || 0)}ms`}
            icon={<Zap className="w-6 h-6" />}
            color="yellow"
            trend="-15%"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Usage Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Usage Trend
              </h2>
              <div className="flex gap-1">
                {[7, 30, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => setTimeRange(days)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      timeRange === days
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
            {dailyData.length > 0 ? (
              <div className="space-y-3">
                {dailyData.slice(-10).map((day) => (
                  <div key={day.date} className="flex items-center gap-4">
                    <span className="text-sm text-slate-500 w-24">
                      {day.date}
                    </span>
                    <div className="flex-1">
                      <Progress
                        value={
                          (day.totalRequests /
                            Math.max(
                              ...dailyData.map((d) => d.totalRequests)
                            )) *
                          100
                        }
                      />
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-slate-700 font-medium">
                        {day.totalRequests}
                      </span>
                      <span className="text-green-600 font-mono">
                        ${day.totalCost.toFixed(4)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No usage data yet</p>
                <p className="text-sm mt-1">
                  Start making API calls to see analytics
                </p>
              </div>
            )}
          </Card>

          {/* Provider Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Provider Distribution
            </h2>
            {stats && Object.keys(stats.byProvider).length > 0 ? (
              <div className="space-y-5">
                {Object.entries(stats.byProvider).map(([provider, data]) => {
                  const percentage = (data.requests / stats.totalRequests) * 100
                  return (
                    <div key={provider}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900 capitalize">
                          {provider}
                        </span>
                        <span className="text-sm text-slate-500">
                          {data.requests} requests
                        </span>
                      </div>
                      <Progress value={percentage} />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>{data.tokens.toLocaleString()} tokens</span>
                        <span className="font-mono">
                          ${data.cost.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-slate-400 text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No provider data yet</p>
              </div>
            )}
          </Card>
        </div>

        {/* Model Stats */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Model Statistics
          </h2>
          {stats && Object.keys(stats.byModel).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      Model
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
                      Requests
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
                      Tokens
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
                      Cost
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
                      Avg Response
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.byModel).map(([model, data]) => (
                    <tr
                      key={model}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-900">
                          {model}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700">
                        {data.requests}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700">
                        {data.tokens.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-green-600">
                        ${data.cost.toFixed(4)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700">
                        {Math.round(data.avgResponseTime)}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-slate-400 text-center py-12">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No model data yet</p>
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Activity
          </h2>
          {recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {entry.model}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded capitalize">
                        {entry.provider}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {entry.totalTokens} tokens • {entry.responseTime}ms
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-green-600">
                      ${entry.cost.toFixed(6)}
                    </div>
                    <div
                      className="text-xs text-slate-400"
                      suppressHydrationWarning
                    >
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-center py-12">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p>Analytics Console • Clarity Chat Components</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-900 transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon,
  color,
  trend,
}: {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  trend?: string
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-amber-500 to-orange-500',
  }

  const isPositive = trend?.startsWith('+')
  const isNegative = trend?.startsWith('-')

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-1 ${
                isPositive
                  ? 'text-green-600'
                  : isNegative
                    ? 'text-red-500'
                    : 'text-slate-500'
              }`}
            >
              {trend} from last period
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center text-white`}
        >
          {icon}
        </div>
      </div>
    </Card>
  )
}
