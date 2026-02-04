'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'

// Types
export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

// Color palette
const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#3b82f6', // Fallback blue
  '#10b981', // Fallback green
  '#f59e0b', // Fallback yellow
  '#ef4444', // Fallback red
  '#8b5cf6', // Fallback purple
]

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

// Stat card with trend
interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span
                className={cn(
                  'flex items-center text-xs font-medium',
                  trend.direction === 'up' && 'text-emerald-500',
                  trend.direction === 'down' && 'text-red-500',
                  trend.direction === 'neutral' && 'text-muted-foreground'
                )}
              >
                {trend.direction === 'up' && (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                )}
                {trend.direction === 'down' && (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                )}
                {trend.direction === 'neutral' && (
                  <Minus className="h-3 w-3 mr-0.5" />
                )}
                {trend.value > 0 && '+'}
                {trend.value}%
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Bar chart component
interface BarChartCardProps {
  title: string
  description?: string
  data: ChartDataPoint[]
  dataKey?: string
  color?: string
  className?: string
  height?: number
}

export function BarChartCard({
  title,
  description,
  data,
  dataKey = 'value',
  color = CHART_COLORS[0],
  className,
  height = 300,
}: BarChartCardProps) {
  // Ensure we have data to render
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Line chart component
interface LineChartCardProps {
  title: string
  description?: string
  data: ChartDataPoint[]
  dataKeys?: string[]
  colors?: string[]
  className?: string
  height?: number
}

export function LineChartCard({
  title,
  description,
  data,
  dataKeys = ['value'],
  colors = CHART_COLORS,
  className,
  height = 300,
}: LineChartCardProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Area chart component
interface AreaChartCardProps {
  title: string
  description?: string
  data: ChartDataPoint[]
  dataKeys?: string[]
  colors?: string[]
  stacked?: boolean
  className?: string
  height?: number
}

export function AreaChartCard({
  title,
  description,
  data,
  dataKeys = ['value'],
  colors = CHART_COLORS,
  stacked = false,
  className,
  height = 300,
}: AreaChartCardProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {dataKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.3}
                  stackId={stacked ? 'stack' : undefined}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Pie/Donut chart component
interface PieChartCardProps {
  title: string
  description?: string
  data: ChartDataPoint[]
  colors?: string[]
  donut?: boolean
  className?: string
  height?: number
}

export function PieChartCard({
  title,
  description,
  data,
  colors = CHART_COLORS,
  donut = false,
  className,
  height = 300,
}: PieChartCardProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={donut ? '60%' : 0}
                outerRadius="80%"
                paddingAngle={2}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Radial progress chart
interface RadialProgressProps {
  value: number
  max?: number
  label?: string
  size?: number
  color?: string
  className?: string
}

export function RadialProgress({
  value,
  max = 100,
  label,
  size = 120,
  color = CHART_COLORS[0],
  className,
}: RadialProgressProps) {
  const percentage = Math.round((value / max) * 100)
  const data = [{ name: label || 'Progress', value: percentage, fill: color }]

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={10}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            background={{ fill: 'hsl(var(--muted))' }}
            dataKey="value"
            cornerRadius={5}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
        {label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  )
}

// Token usage chart
interface TokenUsageProps {
  used: number
  limit: number
  breakdown?: {
    prompt: number
    completion: number
  }
  className?: string
}

export function TokenUsage({
  used,
  limit,
  breakdown,
  className,
}: TokenUsageProps) {
  const percentage = Math.round((used / limit) * 100)
  const remaining = limit - used

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
        <CardDescription>
          {used.toLocaleString()} / {limit.toLocaleString()} tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Used</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                percentage < 70 && 'bg-emerald-500',
                percentage >= 70 && percentage < 90 && 'bg-amber-500',
                percentage >= 90 && 'bg-red-500'
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {breakdown && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-1" />
                <span className="text-xs text-muted-foreground">Prompt</span>
              </div>
              <p className="text-sm font-medium">
                {breakdown.prompt.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-2" />
                <span className="text-xs text-muted-foreground">
                  Completion
                </span>
              </div>
              <p className="text-sm font-medium">
                {breakdown.completion.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-medium">
            {remaining.toLocaleString()} tokens
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// Benchmark comparison chart
interface BenchmarkData {
  name: string
  score: number
  baseline?: number
}

interface BenchmarkChartProps {
  title: string
  description?: string
  data: BenchmarkData[]
  className?: string
}

export function BenchmarkChart({
  title,
  description,
  data,
  className,
}: BenchmarkChartProps) {
  const maxScore = Math.max(
    ...data.map((d) => Math.max(d.score, d.baseline || 0))
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">
                  {item.score.toFixed(1)}
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-chart-1 rounded-full transition-all duration-500"
                  style={{ width: `${(item.score / maxScore) * 100}%` }}
                />
                {item.baseline && (
                  <div
                    className="absolute inset-y-0 w-0.5 bg-muted-foreground"
                    style={{ left: `${(item.baseline / maxScore) * 100}%` }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 rounded bg-chart-1" />
            <span>Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-3 bg-muted-foreground" />
            <span>Baseline</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
