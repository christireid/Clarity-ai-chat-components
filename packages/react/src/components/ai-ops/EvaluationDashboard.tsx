import * as React from 'react'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  cn,
} from '@clarity-chat/primitives'
import { ResponseQualityMeter } from '../response-quality-meter'

export interface EvaluationMetricItem {
  id: string
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
  change?: string
}

export interface EvaluationSparkline {
  id: string
  label: string
  percentage: number
  objective?: number
}

export interface EvaluationDashboardProps {
  metrics: EvaluationMetricItem[]
  sparklines?: EvaluationSparkline[]
  quality?: React.ComponentProps<typeof ResponseQualityMeter>
  className?: string
}

const trendCopy: Record<NonNullable<EvaluationMetricItem['trend']>, string> = {
  up: 'Improving',
  down: 'Regression',
  flat: 'Stable',
}

export const EvaluationDashboard: React.FC<EvaluationDashboardProps> = ({
  metrics,
  sparklines = [],
  quality,
  className,
}) => {
  return (
    <div className={cn('grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]', className)}>
      <Card className="border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg font-semibold text-foreground">Evaluation snapshot</CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">
            Live metrics from the latest prompt release.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div key={metric.id} className="rounded-2xl border border-border/40 bg-[hsl(var(--surface-muted))] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                {metric.label}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-foreground">{metric.value}</span>
                {metric.trend && metric.change && (
                  <Badge variant={metric.trend === 'down' ? 'destructive' : metric.trend === 'up' ? 'success' : 'info'}>
                    {trendCopy[metric.trend]} {metric.change}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {quality && (
          <ResponseQualityMeter {...quality} className="border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm" />
        )}

        {sparklines.length > 0 && (
          <Card className="border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg font-semibold text-foreground">Cost & latency trends</CardTitle>
              <CardDescription className="text-sm text-muted-foreground/80">
                Track performance indicators against team objectives.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sparklines.map((sparkline) => (
                <div key={sparkline.id}>
                  <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                    <span>{sparkline.label}</span>
                    <span>{Math.round(sparkline.percentage)}%</span>
                  </div>
                  <div
                    aria-label={sparkline.label}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(sparkline.percentage)}
                    className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background"
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, Math.max(0, sparkline.percentage))}%` }}
                    />
                  </div>
                  {sparkline.objective !== undefined && (
                    <div className="mt-1 text-xs text-muted-foreground/60">
                      Target {sparkline.objective}%
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

EvaluationDashboard.displayName = 'EvaluationDashboard'

