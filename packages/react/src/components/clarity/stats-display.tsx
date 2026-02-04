'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  ArrowUp,
  ArrowDown,
  Minus,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Clock,
  Users,
  DollarSign,
  Percent,
} from 'lucide-react'

// Stat card
interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period?: string
  }
  icon?: React.ReactNode
  description?: string
  trend?: number[]
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  icon,
  description,
  trend,
  className,
}: StatCardProps) {
  const changeColors = {
    increase: 'text-green-500',
    decrease: 'text-red-500',
    neutral: 'text-muted-foreground',
  }

  const changeIcons = {
    increase: ArrowUp,
    decrease: ArrowDown,
    neutral: Minus,
  }

  const ChangeIcon = change ? changeIcons[change.type] : null

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change || description) && (
          <div className="flex items-center gap-2 mt-1">
            {change && (
              <span
                className={cn(
                  'flex items-center text-xs',
                  changeColors[change.type]
                )}
              >
                {ChangeIcon && <ChangeIcon className="h-3 w-3 mr-0.5" />}
                {Math.abs(change.value)}%
                {change.period && (
                  <span className="text-muted-foreground ml-1">
                    {change.period}
                  </span>
                )}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
        {trend && (
          <div className="flex items-end gap-0.5 h-8 mt-3">
            {trend.map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-accent/20 rounded-sm transition-all hover:bg-accent/40"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Stats grid
interface StatsGridProps {
  stats: StatCardProps[]
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  )
}

// Benchmark comparison
interface BenchmarkProps {
  title: string
  value: number
  benchmark: number
  unit?: string
  description?: string
  className?: string
}

export function BenchmarkDisplay({
  title,
  value,
  benchmark,
  unit = '',
  description,
  className,
}: BenchmarkProps) {
  const percentage = (value / benchmark) * 100
  const isAbove = value >= benchmark

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{title}</span>
          <Badge variant={isAbove ? 'default' : 'secondary'}>
            {isAbove ? 'Above' : 'Below'} benchmark
          </Badge>
        </div>

        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-bold">
            {value.toLocaleString()}
            {unit}
          </span>
          <span className="text-sm text-muted-foreground mb-1">
            / {benchmark.toLocaleString()}
            {unit}
          </span>
        </div>

        <Progress value={Math.min(percentage, 100)} className="h-2" />

        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{percentage.toFixed(1)}% of benchmark</span>
          {description && <span>{description}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

// Performance metrics
interface PerformanceMetric {
  name: string
  value: number
  target: number
  unit?: string
  status: 'good' | 'warning' | 'critical'
}

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[]
  title?: string
  className?: string
}

export function PerformanceMetrics({
  metrics,
  title = 'Performance',
  className,
}: PerformanceMetricsProps) {
  const statusColors = {
    good: 'text-green-500',
    warning: 'text-yellow-500',
    critical: 'text-red-500',
  }

  const statusBg = {
    good: 'bg-green-500/20',
    warning: 'bg-yellow-500/20',
    critical: 'bg-red-500/20',
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, i) => {
          const percentage = (metric.value / metric.target) * 100
          return (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.name}</span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    statusColors[metric.status]
                  )}
                >
                  {metric.value}
                  {metric.unit} / {metric.target}
                  {metric.unit}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    statusBg[metric.status]
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Live counter
interface LiveCounterProps {
  value: number
  label: string
  icon?: React.ReactNode
  prefix?: string
  suffix?: string
  className?: string
}

export function LiveCounter({
  value,
  label,
  icon,
  prefix = '',
  suffix = '',
  className,
}: LiveCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    const duration = 1000
    const steps = 60
    const increment = value / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [value])

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg bg-card border',
        className
      )}
    >
      {icon && (
        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
          {icon}
        </div>
      )}
      <div>
        <div className="text-3xl font-bold tabular-nums">
          {prefix}
          {displayValue.toLocaleString()}
          {suffix}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

// Ring progress
interface RingProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  color?: string
  className?: string
}

export function RingProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 12,
  label,
  sublabel,
  color = 'hsl(var(--accent))',
  className,
}: RingProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = (value / max) * 100
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
          {sublabel && (
            <span className="text-xs text-muted-foreground">{sublabel}</span>
          )}
        </div>
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-center">{label}</span>
      )}
    </div>
  )
}

// Comparison bar
interface ComparisonBarProps {
  items: { label: string; value: number; color?: string }[]
  title?: string
  className?: string
}

export function ComparisonBar({ items, title, className }: ComparisonBarProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  const defaultColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
  ]

  return (
    <div className={cn('space-y-3', className)}>
      {title && <h4 className="text-sm font-medium">{title}</h4>}

      <div className="h-4 flex rounded-full overflow-hidden">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              'h-full transition-all',
              item.color || defaultColors[i % defaultColors.length]
            )}
            style={{ width: `${(item.value / total) * 100}%` }}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                'h-3 w-3 rounded-full',
                item.color || defaultColors[i % defaultColors.length]
              )}
            />
            <span className="text-sm">{item.label}</span>
            <span className="text-sm text-muted-foreground">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Goal tracker
interface GoalTrackerProps {
  goals: {
    id: string
    title: string
    current: number
    target: number
    unit?: string
    deadline?: Date
  }[]
  className?: string
}

export function GoalTracker({ goals, className }: GoalTrackerProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100
          const isComplete = percentage >= 100

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{goal.title}</span>
                  {goal.deadline && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      Due {goal.deadline.toLocaleDateString()}
                    </span>
                  )}
                </div>
                {isComplete && (
                  <Badge variant="default" className="bg-green-500">
                    Complete
                  </Badge>
                )}
              </div>

              <Progress value={Math.min(percentage, 100)} className="h-2" />

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {goal.current.toLocaleString()}
                  {goal.unit} of {goal.target.toLocaleString()}
                  {goal.unit}
                </span>
                <span>{percentage.toFixed(0)}%</span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Leaderboard
interface LeaderboardProps {
  title?: string
  entries: {
    rank: number
    name: string
    avatar?: string
    score: number
    change?: number
  }[]
  className?: string
}

export function Leaderboard({
  title = 'Leaderboard',
  entries,
  className,
}: LeaderboardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg',
                entry.rank <= 3 && 'bg-accent/5'
              )}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold',
                  entry.rank === 1 && 'bg-yellow-500/20 text-yellow-500',
                  entry.rank === 2 && 'bg-gray-300/20 text-gray-400',
                  entry.rank === 3 && 'bg-orange-500/20 text-orange-500',
                  entry.rank > 3 && 'bg-muted text-muted-foreground'
                )}
              >
                {entry.rank}
              </div>

              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                {entry.avatar ? (
                  <img
                    src={entry.avatar || '/placeholder.svg'}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  entry.name[0]
                )}
              </div>

              <div className="flex-1">
                <span className="font-medium">{entry.name}</span>
              </div>

              <div className="flex items-center gap-2">
                {entry.change !== undefined && (
                  <span
                    className={cn(
                      'text-xs flex items-center',
                      entry.change > 0 && 'text-green-500',
                      entry.change < 0 && 'text-red-500'
                    )}
                  >
                    {entry.change > 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(entry.change)}
                  </span>
                )}
                <span className="font-bold tabular-nums">
                  {entry.score.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
