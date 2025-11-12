'use client'

import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'

interface MetricsOverviewProps {
  metrics: {
    totalRequests: number
    successRate: number
    avgLatency: number
    p95Latency: number
    errorRate: number
    activeUsers: number
    tokensUsed: number
    tokensSaved: number
    costSaved: number
    safetyViolations: number
    qualityScore: number
  }
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const statCards = [
    {
      label: 'Total Requests',
      value: metrics.totalRequests.toLocaleString(),
      change: '+12.5%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'blue',
    },
    {
      label: 'Success Rate',
      value: `${metrics.successRate}%`,
      change: '+0.3%',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: 'Avg Latency',
      value: `${metrics.avgLatency}ms`,
      change: '-5%',
      trend: 'down' as const,
      icon: TrendingDown,
      color: 'green',
    },
    {
      label: 'Error Rate',
      value: `${metrics.errorRate}%`,
      change: '-0.2%',
      trend: 'down' as const,
      icon: AlertCircle,
      color: metrics.errorRate > 2 ? 'red' : 'yellow',
    },
    {
      label: 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      change: '+8.1%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'purple',
    },
    {
      label: 'Quality Score',
      value: `${metrics.qualityScore}`,
      change: '+2.1',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'blue',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown
        
        return (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                'bg-yellow-100 dark:bg-yellow-900/30'
              }`}>
                <Icon className={`w-5 h-5 ${
                  stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  stat.color === 'red' ? 'text-red-600 dark:text-red-400' :
                  'text-yellow-600 dark:text-yellow-400'
                }`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                <TrendIcon className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
