'use client'

import { useMemo, memo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
// Using emojis instead of lucide icons for compatibility

interface ChartData {
  title: string
  data: Array<{
    region: string
    sales: number
  }>
}

interface Insight {
  text: string
  confidence?: number
}

interface AnalyticsDashboardProps {
  charts: ChartData[]
  insights: Insight[]
  currentQuery: string
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  color: 'green' | 'blue' | 'purple' | 'orange'
}

// Extract and memoize MetricCard component
const MetricCard = memo<MetricCardProps>(
  ({ icon, label, value, change, trend, color }) => {
    const colorClasses = {
      green:
        'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      purple:
        'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      orange:
        'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div
          className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}
        >
          {icon}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-bold mb-1">{value}</p>
        <p
          className={`text-sm ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
        >
          {change}
        </p>
      </div>
    )
  }
)
MetricCard.displayName = 'MetricCard'

export function AnalyticsDashboard({
  charts,
  insights,
  currentQuery,
}: AnalyticsDashboardProps) {
  // Memoize static data to prevent recreation
  const mockTimeSeriesData = useMemo(
    () => [
      { date: 'Jan', revenue: 45000, users: 1200 },
      { date: 'Feb', revenue: 52000, users: 1350 },
      { date: 'Mar', revenue: 48000, users: 1280 },
      { date: 'Apr', revenue: 61000, users: 1520 },
      { date: 'May', revenue: 58000, users: 1480 },
      { date: 'Jun', revenue: 67000, users: 1650 },
    ],
    []
  )

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        {currentQuery && (
          <p className="text-gray-600 dark:text-gray-400">
            Results for: "{currentQuery}"
          </p>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<span className="text-xl">💰</span>}
          label="Total Revenue"
          value="$331,000"
          change="+15.2%"
          trend="up"
          color="green"
        />
        <MetricCard
          icon={<span className="text-xl">👥</span>}
          label="Active Users"
          value="8,480"
          change="+12.5%"
          trend="up"
          color="blue"
        />
        <MetricCard
          icon={<span className="text-xl">🛒</span>}
          label="Orders"
          value="1,247"
          change="+8.3%"
          trend="up"
          color="purple"
        />
        <MetricCard
          icon={<span className="text-xl">📈</span>}
          label="Growth Rate"
          value="18.7%"
          change="+2.1%"
          trend="up"
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockTimeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockTimeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Generated Charts */}
      {charts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Generated Charts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts.map((chart, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold mb-4">{chart.title}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="region" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">AI-Generated Insights</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <ul className="space-y-2">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">
                    •
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {insight.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
