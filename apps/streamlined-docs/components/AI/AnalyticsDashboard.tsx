'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  DollarSign,
  Zap,
  MessageSquare,
  ThumbsUp,
  Database,
  Clock,
  BarChart3,
  RefreshCw,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { AnalyticsSummary } from '@/lib/ai/analytics'

export interface AnalyticsDashboardProps {
  className?: string
  refreshInterval?: number // milliseconds
  period?: '7d' | '30d' | '90d'
}

export function AnalyticsDashboard({
  className,
  refreshInterval,
  period = '7d',
}: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/analytics?period=${period}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setSummary(data.data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()

    if (refreshInterval) {
      const interval = setInterval(fetchAnalytics, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [period, refreshInterval])

  if (loading && !summary) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('p-8', className)}>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">Failed to load analytics: {error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-2 text-xs text-destructive underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Assistant Analytics</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(summary.period.start).toLocaleDateString()} -{' '}
            {new Date(summary.period.end).toLocaleDateString()} (
            {summary.period.durationDays} days)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className={cn(
              'p-2 rounded-md',
              'bg-secondary hover:bg-secondary/80',
              'transition-colors',
              loading && 'opacity-50 cursor-not-allowed'
            )}
            aria-label="Refresh"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Queries"
          value={summary.queries.total.toLocaleString()}
          subtitle={`${summary.queries.averagePerDay.toFixed(1)} per day`}
          icon={MessageSquare}
          trend={
            summary.queries.followUpRate > 0
              ? `${summary.queries.followUpRate.toFixed(1)}% follow-ups`
              : undefined
          }
          color="blue"
        />

        <MetricCard
          title="Total Cost"
          value={`$${summary.costs.total.toFixed(2)}`}
          subtitle={`$${summary.costs.averagePerQuery.toFixed(4)} per query`}
          icon={DollarSign}
          trend={`Est. $${summary.costs.estimatedMonthlyCost.toFixed(2)}/month`}
          color="green"
        />

        <MetricCard
          title="Cache Hit Rate"
          value={`${summary.cache.hitRate.toFixed(1)}%`}
          subtitle={`${summary.cache.hits} hits, ${summary.cache.misses} misses`}
          icon={Zap}
          trend={`Saved $${summary.cache.estimatedSavings.toFixed(2)}`}
          color="purple"
        />

        <MetricCard
          title="Satisfaction"
          value={`${summary.feedback.positiveRate.toFixed(1)}%`}
          subtitle={`${summary.feedback.total} ratings`}
          icon={ThumbsUp}
          trend={`${summary.feedback.positive} 👍 / ${summary.feedback.negative} 👎`}
          color="yellow"
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Topics */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Popular Topics
          </h3>

          {summary.popularTopics.length > 0 ? (
            <div className="space-y-3">
              {summary.popularTopics.map((topic, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{topic.topic}</span>
                    <span className="text-muted-foreground">
                      {topic.count} ({topic.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${topic.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No topics data yet</p>
          )}
        </div>

        {/* Popular Queries */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Popular Queries
          </h3>

          {summary.popularQueries.length > 0 ? (
            <div className="space-y-2">
              {summary.popularQueries.slice(0, 5).map((query, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between text-sm p-2 rounded-md hover:bg-accent"
                >
                  <span className="flex-1 truncate pr-2">{query.query}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded flex-shrink-0">
                    {query.count}x
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No queries data yet</p>
          )}
        </div>

        {/* RAG Performance */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            RAG Performance
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Usage Rate</span>
                <span className="font-medium">{summary.rag.usageRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${summary.rag.usageRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-md">
                <p className="text-2xl font-bold">
                  {summary.rag.averageSourcesReturned.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Avg Sources</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-md">
                <p className="text-2xl font-bold">
                  {(summary.rag.averageRelevanceScore * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Relevance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Performance
          </h3>

          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/50 rounded-md">
              <p className="text-3xl font-bold">
                {summary.queries.averageResponseTime.toFixed(0)}
                <span className="text-lg text-muted-foreground ml-1">ms</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Average Response Time
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {summary.cache.hits}
                </p>
                <p className="text-xs text-muted-foreground">Cache Hits</p>
              </div>
              <div className="text-center p-3 bg-orange-500/10 border border-orange-500/20 rounded-md">
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {summary.cache.misses}
                </p>
                <p className="text-xs text-muted-foreground">Cache Misses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Usage */}
      {Object.keys(summary.modelUsage).length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Model Usage</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(summary.modelUsage).map(([model, count]) => (
              <div
                key={model}
                className="px-3 py-2 bg-secondary rounded-md text-sm"
              >
                <span className="font-medium">{model}</span>
                <span className="text-muted-foreground ml-2">({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  trend?: string
  color: 'blue' | 'green' | 'purple' | 'yellow'
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: MetricCardProps) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn('p-2 rounded-md', colors[color])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>

      {trend && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>{trend}</span>
          </div>
        </div>
      )}
    </div>
  )
}
