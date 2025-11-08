import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

type MetricKey =
  | 'totalRevenue'
  | 'conversionRate'
  | 'averageDealSize'
  | 'averageSalesCycle'
  | 'pipelineValue'
  | 'winRate'

interface MetricDefinition {
  key: MetricKey
  label: string
  icon: string
  format: (value?: number) => string
}

const metricDefinitions: MetricDefinition[] = [
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: '💰',
    format: (value) => (value != null ? formatCurrency(value) : '—'),
  },
  {
    key: 'conversionRate',
    label: 'Conversion Rate',
    icon: '🎯',
    format: (value) => (value != null ? `${value.toFixed(1)}%` : '—'),
  },
  {
    key: 'averageDealSize',
    label: 'Avg Deal Size',
    icon: '📈',
    format: (value) => (value != null ? formatCurrency(value) : '—'),
  },
  {
    key: 'averageSalesCycle',
    label: 'Sales Cycle',
    icon: '⏱️',
    format: (value) => (value != null ? `${Math.round(value)} days` : '—'),
  },
]

export interface AnalyticsDashboardMetrics {
  totalRevenue?: number
  conversionRate?: number
  averageDealSize?: number
  averageSalesCycle?: number
  pipelineValue?: number
  winRate?: number
}

export interface AnalyticsLeaderboardEntry {
  label: string
  value: number
  change?: number
  trend?: 'up' | 'down'
}

export interface AnalyticsActivity {
  id: string
  timestamp: Date | string
  description: string
  owner?: string
  impact?: 'positive' | 'negative' | 'neutral'
  metadata?: Record<string, string | number>
}

export interface AnalyticsInsight {
  title?: string
  description: string
  type?: 'positive' | 'risk' | 'neutral'
}

export interface AnalyticsDashboardProps {
  metrics: AnalyticsDashboardMetrics
  previousMetrics?: Partial<AnalyticsDashboardMetrics>
  leaderboard?: AnalyticsLeaderboardEntry[]
  insights?: Array<AnalyticsInsight | string>
  recentActivities?: AnalyticsActivity[]
  className?: string
  title?: string
  subtitle?: string
}

export function AnalyticsDashboard({
  metrics,
  previousMetrics,
  leaderboard,
  insights,
  recentActivities,
  className,
  title = 'Analytics Overview',
  subtitle,
}: AnalyticsDashboardProps) {
  return (
    <div
      className={cn(
        'space-y-6 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.1)] backdrop-blur',
        className
      )}
    >
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricDefinitions.map(({ key, label, icon, format }) => {
          const value = metrics[key]
          const previous = previousMetrics?.[key]
          const change = calculateChange(value, previous)

          return (
            <MetricCard
              key={key}
              icon={icon}
              label={label}
              value={format(value)}
              change={change}
            />
          )
        })}
      </section>

      {metrics.pipelineValue != null || metrics.winRate != null ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {metrics.pipelineValue != null ? (
            <PipelineSummary
              value={metrics.pipelineValue}
              previous={previousMetrics?.pipelineValue}
            />
          ) : null}
          {metrics.winRate != null ? (
            <WinRateSummary
              value={metrics.winRate}
              previous={previousMetrics?.winRate}
            />
          ) : null}
        </section>
      ) : null}

      {leaderboard?.length ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Leaderboard entries={leaderboard} />
          <ActivityList activities={recentActivities} />
        </section>
      ) : (
        <ActivityList activities={recentActivities} />
      )}

      <InsightsPanel insights={insights} />
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  change,
}: {
  icon: string
  label: string
  value: string
  change: ReturnType<typeof calculateChange>
}) {
  const changeClass =
    change.direction === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : change.direction === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted-foreground'

  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background/70 via-background/40 to-accent/10 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.1)] backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-lg">{icon}</span>
        {change.direction !== 'none' ? (
          <span className={cn('text-xs font-medium', changeClass)}>
            {change.direction === 'up' ? '▲' : '▼'} {change.percent}%
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}

function PipelineSummary({
  value,
  previous,
}: {
  value: number
  previous?: number
}) {
  const change = calculateChange(value, previous)

  return (
    <div className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Pipeline Value
        </h3>
        {change.direction !== 'none' ? (
          <span
            className={cn(
              'text-xs font-medium',
              change.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {change.direction === 'up' ? '+' : '-'}
            {change.percent}%
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">
        {formatCurrency(value)}
      </p>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min((value / 1_000_000) * 100, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Showing active deals in pipeline. Target: $1M
      </p>
    </div>
  )
}

function WinRateSummary({
  value,
  previous,
}: {
  value: number
  previous?: number
}) {
  const change = calculateChange(value, previous)
  return (
    <div className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
      <h3 className="text-sm font-medium text-muted-foreground">Win Rate</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground">
          {value.toFixed(1)}%
        </span>
        {change.direction !== 'none' ? (
          <span
            className={cn(
              'text-xs font-medium',
              change.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {change.direction === 'up' ? '+' : '-'}
            {change.percent}%
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Close rate for qualified opportunities.
      </p>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Won deals</span>
          <span>{Math.round(value * 1.2)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Lost deals</span>
          <span>{Math.round((100 - value) * 0.8)}</span>
        </div>
      </div>
    </div>
  )
}

function Leaderboard({ entries }: { entries?: AnalyticsLeaderboardEntry[] }) {
  if (!entries?.length) {
    return null
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
      <h3 className="text-sm font-semibold text-foreground">Top Performers</h3>
      <ul className="mt-4 space-y-3">
        {entries.map((entry, index) => (
          <li
            key={entry.label}
            className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-muted-foreground">
                {index + 1}.
              </span>
              <span className="font-medium text-foreground">{entry.label}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">
                {entry.value.toLocaleString()}
              </span>
              {entry.change != null ? (
                <span
                  className={cn(
                    'text-xs font-medium',
                    entry.trend === 'down' ? 'text-red-600' : 'text-emerald-600'
                  )}
                >
                  {entry.trend === 'down' ? '▼' : '▲'} {entry.change}%
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ActivityList({ activities }: { activities?: AnalyticsActivity[] }) {
  if (!activities?.length) {
    return null
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
      <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
      <ul className="mt-4 space-y-3">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="rounded-lg border border-border/60 bg-background/60 px-3 py-2"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatTimestamp(activity.timestamp)}</span>
              {activity.owner ? (
                <span className="font-medium text-foreground/80">
                  {activity.owner}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-foreground">
              {activity.description}
            </p>
            {activity.metadata ? (
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground/90">
                {Object.entries(activity.metadata).map(([key, value]) => (
                  <span key={key} className="rounded-full bg-muted px-2 py-0.5">
                    {key}: {value}
                  </span>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

function InsightsPanel({
  insights,
}: {
  insights?: Array<AnalyticsInsight | string>
}) {
  if (!insights?.length) {
    return null
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
      <h3 className="text-sm font-semibold text-primary">
        AI-Generated Insights
      </h3>
      <ul className="mt-3 space-y-3">
        {insights.map((insight, index) => {
          if (typeof insight === 'string') {
            return (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-primary-foreground/90"
              >
                <span className="mt-1 text-primary">•</span>
                <span>{insight}</span>
              </li>
            )
          }

          const color =
            insight.type === 'positive'
              ? 'text-emerald-600'
              : insight.type === 'risk'
                ? 'text-red-600'
                : 'text-primary-foreground/90'

          return (
            <li key={index} className="space-y-1">
              {insight.title ? (
                <p className={cn('text-sm font-semibold', color)}>
                  {insight.title}
                </p>
              ) : null}
              <p className="text-sm text-primary-foreground/80">
                {insight.description}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function calculateChange(current?: number, previous?: number) {
  if (
    current == null ||
    previous == null ||
    Number.isNaN(current) ||
    Number.isNaN(previous) ||
    previous === 0
  ) {
    return { direction: 'none' as const, percent: 0 }
  }

  const delta = ((current - previous) / Math.abs(previous)) * 100
  if (Math.abs(delta) < 0.1) {
    return { direction: 'none' as const, percent: 0 }
  }

  return {
    direction: delta > 0 ? ('up' as const) : ('down' as const),
    percent: Math.abs(delta).toFixed(1),
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)
}

function formatTimestamp(value: Date | string) {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) {
    return value.toString()
  }
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
