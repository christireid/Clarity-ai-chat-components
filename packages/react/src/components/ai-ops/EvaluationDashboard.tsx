import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  cn,
} from '@clarity-chat/primitives'
import {
  ResponseQualityMeter,
  type ResponseQualityMeterProps,
} from '../dashboards/ResponseQualityMeter'
import { Skeleton } from '../ui/skeleton'

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
  /** Evaluation metrics to display */
  metrics: EvaluationMetricItem[]
  /** Optional sparkline trend data */
  sparklines?: EvaluationSparkline[]
  /** Optional quality meter configuration */
  quality?: ResponseQualityMeterProps
  /** Whether data is loading */
  isLoading?: boolean
  /** Custom empty state message */
  emptyMessage?: string
  /** Callback when refresh is requested */
  onRefresh?: () => void
  className?: string
}

const trendCopy: Record<NonNullable<EvaluationMetricItem['trend']>, string> = {
  up: 'Improving',
  down: 'Regression',
  flat: 'Stable',
}

const MetricSkeleton = () => (
  <div className="rounded-2xl border border-border/40 bg-[hsl(var(--surface-muted))] p-4">
    <Skeleton width="60%" height={12} className="mb-2" />
    <Skeleton width="80%" height={28} />
  </div>
)

const SparklineSkeleton = () => (
  <div>
    <div className="flex items-center justify-between">
      <Skeleton width="40%" height={12} />
      <Skeleton width={32} height={12} />
    </div>
    <Skeleton width="100%" height={8} className="mt-2" rounded="full" />
  </div>
)

const EmptyState: React.FC<{ message: string; onRefresh?: () => void }> = ({
  message,
  onRefresh,
}) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="mb-3 rounded-full bg-muted p-3">
      <svg
        className="h-6 w-6 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </div>
    <p className="text-sm text-muted-foreground">{message}</p>
    {onRefresh && (
      <Button variant="ghost" size="sm" className="mt-3" onClick={onRefresh}>
        Refresh data
      </Button>
    )}
  </div>
)

export const EvaluationDashboard: React.FC<EvaluationDashboardProps> = ({
  metrics,
  sparklines = [],
  quality,
  isLoading = false,
  emptyMessage = 'No evaluation metrics available. Run an evaluation to see results.',
  onRefresh,
  className,
}) => {
  const hasMetrics = metrics.length > 0
  const hasSparklines = sparklines.length > 0
  const hasQuality = quality !== undefined

  return (
    <div
      className={cn(
        'grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]',
        className
      )}
      aria-busy={isLoading}
    >
      <Card className="border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-foreground">
                Evaluation snapshot
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/80">
                Live metrics from the latest prompt release.
              </CardDescription>
            </div>
            {onRefresh && !isLoading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                aria-label="Refresh evaluation metrics"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="">
          <div
            className="grid gap-4 sm:grid-cols-2"
            role="region"
            aria-label="Evaluation metrics"
            aria-live="polite"
          >
            {isLoading ? (
              <>
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
              </>
            ) : hasMetrics ? (
              metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-2xl border border-border/40 bg-[hsl(var(--surface-muted))] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                    {metric.label}
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-foreground">
                      {metric.value}
                    </span>
                    {metric.trend && metric.change && (
                      <Badge
                        variant={
                          metric.trend === 'down'
                            ? 'destructive'
                            : metric.trend === 'up'
                              ? 'success'
                              : 'info'
                        }
                      >
                        {trendCopy[metric.trend]} {metric.change}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState message={emptyMessage} onRefresh={onRefresh} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {(isLoading || hasQuality) && (
          <div aria-live="polite">
            {isLoading ? (
              <Card className="border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm">
                <CardHeader className="space-y-2">
                  <Skeleton width="50%" height={20} />
                  <Skeleton width="80%" height={14} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton width="100%" height={48} />
                  <Skeleton width="100%" height={64} />
                  <Skeleton width="100%" height={64} />
                </CardContent>
              </Card>
            ) : (
              quality && (
                <ResponseQualityMeter
                  {...quality}
                  className="border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm"
                />
              )
            )}
          </div>
        )}

        {(isLoading || hasSparklines) && (
          <Card className="border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg font-semibold text-foreground">
                Cost & latency trends
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/80">
                Track performance indicators against team objectives.
              </CardDescription>
            </CardHeader>
            <CardContent
              className="space-y-4"
              role="region"
              aria-label="Performance trends"
            >
              {isLoading ? (
                <>
                  <SparklineSkeleton />
                  <SparklineSkeleton />
                  <SparklineSkeleton />
                </>
              ) : (
                sparklines.map((sparkline) => {
                  const isOverObjective =
                    sparkline.objective !== undefined &&
                    sparkline.percentage > sparkline.objective
                  const isNearObjective =
                    sparkline.objective !== undefined &&
                    sparkline.percentage >= sparkline.objective * 0.9 &&
                    sparkline.percentage <= sparkline.objective

                  return (
                    <div key={sparkline.id}>
                      <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                        <span id={`sparkline-label-${sparkline.id}`}>
                          {sparkline.label}
                        </span>
                        <span aria-hidden="true">
                          {Math.round(sparkline.percentage)}%
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-labelledby={`sparkline-label-${sparkline.id}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(sparkline.percentage)}
                        aria-valuetext={`${Math.round(sparkline.percentage)}% ${sparkline.objective !== undefined ? `of ${sparkline.objective}% target` : ''}`}
                        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background"
                      >
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            isOverObjective
                              ? 'bg-success'
                              : isNearObjective
                                ? 'bg-warning'
                                : 'bg-primary'
                          )}
                          style={{
                            width: `${Math.min(100, Math.max(0, sparkline.percentage))}%`,
                          }}
                        />
                      </div>
                      {sparkline.objective !== undefined && (
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground/60">
                          <span>Target {sparkline.objective}%</span>
                          {isOverObjective && (
                            <Badge variant="success" className="text-[10px]">
                              Achieved
                            </Badge>
                          )}
                          {isNearObjective && (
                            <Badge variant="warning" className="text-[10px]">
                              Almost there
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

EvaluationDashboard.displayName = 'EvaluationDashboard'
