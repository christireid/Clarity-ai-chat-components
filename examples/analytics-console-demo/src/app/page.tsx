'use client'

import React, { useState, useEffect } from 'react'
import type { SummaryStats, DailySummary, AnalyticsEntry } from '@/types/analytics'

// Disable static optimization
export const dynamic = 'force-dynamic'

export default function AnalyticsConsolePage() {
  const [stats, setStats] = useState<SummaryStats | null>(null)
  const [dailyData, setDailyData] = useState<DailySummary[]>([])
  const [recentEntries, setRecentEntries] = useState<AnalyticsEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    setIsMounted(true)
    loadData()
  }, [timeRange])

  async function loadData() {
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
  }

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Analytics Console
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Token usage tracking & cost analytics for AI applications
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Requests"
            value={stats?.totalRequests.toLocaleString() || '0'}
            icon="📊"
            color="blue"
          />
          <SummaryCard
            title="Total Tokens"
            value={stats?.totalTokens.toLocaleString() || '0'}
            icon="🔢"
            color="purple"
          />
          <SummaryCard
            title="Total Cost"
            value={`$${(stats?.totalCost || 0).toFixed(4)}`}
            icon="💰"
            color="green"
          />
          <SummaryCard
            title="Avg Response"
            value={`${Math.round(stats?.avgResponseTime || 0)}ms`}
            icon="⚡"
            color="yellow"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Usage Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Usage Trend</h2>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTimeRange(7)}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === 7 ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => setTimeRange(30)}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === 30 ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                30 days
              </button>
              <button
                onClick={() => setTimeRange(90)}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === 90 ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                90 days
              </button>
            </div>
            {dailyData.length > 0 ? (
              <div className="space-y-2">
                {dailyData.slice(-10).map((day) => (
                  <div key={day.date} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{day.date}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-900">{day.totalRequests} req</span>
                      <span className="text-green-600 font-mono">${day.totalCost.toFixed(4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No data yet</p>
            )}
          </div>

          {/* Provider Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Provider Distribution</h2>
            {stats && Object.keys(stats.byProvider).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.byProvider).map(([provider, data]) => (
                  <div key={provider}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium capitalize">{provider}</span>
                      <span className="text-gray-600">{data.requests} requests</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>{data.tokens.toLocaleString()} tokens</span>
                      <span className="font-mono">${data.cost.toFixed(4)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(data.requests / stats.totalRequests) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No data yet</p>
            )}
          </div>
        </div>

        {/* Model Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Model Statistics</h2>
          {stats && Object.keys(stats.byModel).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Model</th>
                    <th className="text-right py-2 px-4 text-sm font-medium text-gray-600">Requests</th>
                    <th className="text-right py-2 px-4 text-sm font-medium text-gray-600">Tokens</th>
                    <th className="text-right py-2 px-4 text-sm font-medium text-gray-600">Cost</th>
                    <th className="text-right py-2 px-4 text-sm font-medium text-gray-600">Avg Response</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.byModel).map(([model, data]) => (
                    <tr key={model} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-sm font-medium">{model}</td>
                      <td className="py-2 px-4 text-sm text-right">{data.requests}</td>
                      <td className="py-2 px-4 text-sm text-right">{data.tokens.toLocaleString()}</td>
                      <td className="py-2 px-4 text-sm text-right font-mono">${data.cost.toFixed(4)}</td>
                      <td className="py-2 px-4 text-sm text-right">{Math.round(data.avgResponseTime)}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No data yet</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{entry.model}</span>
                      <span className="text-xs text-gray-500 capitalize">({entry.provider})</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {entry.totalTokens} tokens • {entry.responseTime}ms
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">${entry.cost.toFixed(6)}</div>
                    <div className="text-xs text-gray-500" suppressHydrationWarning>
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string
  value: string
  icon: string
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  }

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}
