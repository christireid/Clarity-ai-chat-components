import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { glass, GLASS_PRESETS } from '../../utils/glassmorphism'

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

/**
 * Analytics Dashboard Component
 *
 * Displays comprehensive analytics including metrics, leaderboards,
 * activity feeds, and AI-generated insights.
 *
 * @example
 * ```tsx
 * <AnalyticsDashboard
 *   metrics={{
 *     totalRevenue: 125000,
 *     conversionRate: 12.5,
 *     averageDealSize: 2500,
 *     averageSalesCycle: 30,
 *   }}
 *   previousMetrics={{
 *     totalRevenue: 100000,
 *     conversionRate: 10.0,
 *   }}
 *   leaderboard={topPerformers}
 *   insights={aiInsights}
 * />
 * ```
 */
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
        'space-y-6 p-6',
        glass(GLASS_PRESETS.dashboardCard),
        className
      )}
      role="region"
      aria-label={title}
    >
      <header className="space-y-1">
        <h2
          className="text-2xl font-semibold text-foreground"
          id="analytics-dashboard-title"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>

      <section
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        aria-label="Key metrics"
        role="group"
      >
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

/**
 * Individual metric card displaying a single KPI with optional change indicator.
 */
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

  const changeDescription =
    change.direction === 'up'
      ? `increased by ${change.percent}%`
      : change.direction === 'down'
        ? `decreased by ${change.percent}%`
        : 'no change'

  return (
    <article
      className={cn(
        'p-5',
        glass(GLASS_PRESETS.statsCard)
      )}
      aria-label={`${label}: ${value}, ${changeDescription}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg" aria-hidden="true">
          {icon}
        </span>
        {change.direction !== 'none' ? (
          <span
            className={cn('text-xs font-medium', changeClass)}
            aria-label={changeDescription}
          >
            {change.direction === 'up' ? '▲' : '▼'} {change.percent}%
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </article>
  )
}

MetricCard.displayName = 'MetricCard'

/**
 * Pipeline summary widget showing total pipeline value with progress toward target.
 */
function PipelineSummary({
  value,
  previous,
}: {
  value: number
  previous?: number
}) {
  const change = calculateChange(value, previous)
  const progressPercent = Math.min((value / 1_000_000) * 100, 100)

  return (
    <article
      className={cn(
        'p-5',
        glass({ ...GLASS_PRESETS.metricsPanel, animated: 'gradient' })
      )}
      aria-label={`Pipeline value: ${formatCurrency(value)}`}
    >
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
            aria-label={`${change.direction === 'up' ? 'increased' : 'decreased'} by ${change.percent}%`}
          >
            {change.direction === 'up' ? '+' : '-'}
            {change.percent}%
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">
        {formatCurrency(value)}
      </p>
      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Pipeline progress toward $1M target"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Showing active deals in pipeline. Target: $1M
      </p>
    </article>
  )
}

PipelineSummary.displayName = 'PipelineSummary'

/**
 * Win rate summary widget showing conversion metrics.
 */
function WinRateSummary({
  value,
  previous,
}: {
  value: number
  previous?: number
}) {
  const change = calculateChange(value, previous)
  const wonDeals = Math.round(value * 1.2)
  const lostDeals = Math.round((100 - value) * 0.8)

  return (
    <article
      className={cn(
        'p-5',
        glass({ ...GLASS_PRESETS.metricsPanel, animated: 'gradient' })
      )}
      aria-label={`Win rate: ${value.toFixed(1)}%`}
    >
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
            aria-label={`${change.direction === 'up' ? 'increased' : 'decreased'} by ${change.percent}%`}
          >
            {change.direction === 'up' ? '+' : '-'}
            {change.percent}%
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Close rate for qualified opportunities.
      </p>
      <dl className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <dt>Won deals</dt>
          <dd>{wonDeals}</dd>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <dt>Lost deals</dt>
          <dd>{lostDeals}</dd>
        </div>
      </dl>
    </article>
  )
}

WinRateSummary.displayName = 'WinRateSummary'

/**
 * Leaderboard widget displaying top performers.
 */
function Leaderboard({ entries }: { entries?: AnalyticsLeaderboardEntry[] }) {
  if (!entries?.length) {
    return null
  }

  return (
    <section
      className={cn(
        'p-5',
        glass(GLASS_PRESETS.chart)
      )}
      aria-label="Top performers leaderboard"
    >
      <h3 className="text-sm font-semibold text-foreground">Top Performers</h3>
      <ol className="mt-4 space-y-3" aria-label="Ranked list of top performers">
        {entries.map((entry, index) => (
          <li
            key={entry.label}
            className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span
                className="font-medium text-muted-foreground"
                aria-hidden="true"
              >
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
                  aria-label={`${entry.trend === 'down' ? 'down' : 'up'} ${entry.change}%`}
                >
                  {entry.trend === 'down' ? '▼' : '▲'} {entry.change}%
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

Leaderboard.displayName = 'Leaderboard'

/**
 * Activity feed widget showing recent events and actions.
 */
function ActivityList({ activities }: { activities?: AnalyticsActivity[] }) {
  if (!activities?.length) {
    return null
  }

  return (
    <section
      className={cn(
        'p-5',
        glass(GLASS_PRESETS.chart)
      )}
      aria-label="Recent activity feed"
    >
      <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
      <ul className="mt-4 space-y-3" role="feed" aria-label="Activity timeline">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="rounded-lg border border-border/60 bg-background/60 px-3 py-2"
            role="article"
            aria-label={`${activity.description} on ${formatTimestamp(activity.timestamp)}`}
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <time dateTime={new Date(activity.timestamp).toISOString()}>
                {formatTimestamp(activity.timestamp)}
              </time>
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
    </section>
  )
}

ActivityList.displayName = 'ActivityList'

/**
 * AI-generated insights panel showing analysis and recommendations.
 */
function InsightsPanel({
  insights,
}: {
  insights?: Array<AnalyticsInsight | string>
}) {
  if (!insights?.length) {
    return null
  }

  return (
    <section
      className="rounded-lg border border-primary/20 bg-primary/5 p-5 shadow-xs"
      aria-label="AI-generated insights"
    >
      <h3 className="text-sm font-semibold text-primary">
        AI-Generated Insights
      </h3>
      <ul className="mt-3 space-y-3" aria-label="List of insights">
        {insights.map((insight, index) => {
          if (typeof insight === 'string') {
            return (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-primary-foreground/90"
              >
                <span className="mt-1 text-primary" aria-hidden="true">
                  •
                </span>
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
    </section>
  )
}

InsightsPanel.displayName = 'InsightsPanel'

AnalyticsDashboard.displayName = 'AnalyticsDashboard'

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
