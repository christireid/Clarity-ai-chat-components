'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export interface DashboardSkeletonProps {
  /** Custom className */
  className?: string
  /** Whether to animate the skeleton */
  animate?: boolean
}

/**
 * Base skeleton element with pulse animation.
 * Respects user's prefers-reduced-motion setting.
 */
function Skeleton({
  className,
  animate = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { animate?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-md bg-muted/60',
        animate && 'animate-pulse motion-reduce:animate-none',
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}

/**
 * Skeleton for a single metric card.
 * Matches the structure of MetricCard in analytics-dashboard.
 */
export function MetricCardSkeleton({
  className,
  animate = true,
}: DashboardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border/50 bg-gradient-to-br from-background/70 via-background/40 to-accent/10 p-5 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]',
        className
      )}
      role="presentation"
      aria-label="Loading metric"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-6 rounded" animate={animate} />
        <Skeleton className="h-4 w-12" animate={animate} />
      </div>
      <Skeleton className="mt-4 h-4 w-24" animate={animate} />
      <Skeleton className="mt-2 h-8 w-32" animate={animate} />
    </div>
  )
}

MetricCardSkeleton.displayName = 'MetricCardSkeleton'

/**
 * Skeleton for progress bar widgets.
 * Used in usage dashboards and optimization displays.
 */
export function ProgressWidgetSkeleton({
  className,
  animate = true,
}: DashboardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border/50 bg-card/80 p-5',
        className
      )}
      role="presentation"
      aria-label="Loading progress widget"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" animate={animate} />
        <Skeleton className="h-4 w-12" animate={animate} />
      </div>
      <Skeleton className="mt-3 h-2 w-full rounded-full" animate={animate} />
      <Skeleton className="mt-2 h-3 w-48" animate={animate} />
    </div>
  )
}

ProgressWidgetSkeleton.displayName = 'ProgressWidgetSkeleton'

/**
 * Skeleton for list/leaderboard items.
 */
export function ListItemSkeleton({
  className,
  animate = true,
}: DashboardSkeletonProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2',
        className
      )}
      role="presentation"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5" animate={animate} />
        <Skeleton className="h-4 w-32" animate={animate} />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" animate={animate} />
        <Skeleton className="h-4 w-10" animate={animate} />
      </div>
    </div>
  )
}

ListItemSkeleton.displayName = 'ListItemSkeleton'

/**
 * Skeleton for chart/visualization areas.
 */
export function ChartSkeleton({
  className,
  animate = true,
  height = 200,
}: DashboardSkeletonProps & { height?: number }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border/50 bg-card/80 p-5',
        className
      )}
      role="presentation"
      aria-label="Loading chart"
    >
      <Skeleton className="h-4 w-32 mb-4" animate={animate} />
      <Skeleton
        className="w-full rounded-lg"
        style={{ height }}
        animate={animate}
      />
    </div>
  )
}

ChartSkeleton.displayName = 'ChartSkeleton'

/**
 * Full Analytics Dashboard skeleton.
 * Matches the layout of AnalyticsDashboard component.
 *
 * @example
 * ```tsx
 * {isLoading ? <AnalyticsDashboardSkeleton /> : <AnalyticsDashboard {...props} />}
 * ```
 */
export function AnalyticsDashboardSkeleton({
  className,
  animate = true,
}: DashboardSkeletonProps) {
  return (
    <div
      className={cn(
        'space-y-6 rounded-lg border border-border/50 bg-card/70 p-6',
        className
      )}
      role="status"
      aria-label="Loading analytics dashboard"
      aria-busy="true"
    >
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-7 w-48" animate={animate} />
        <Skeleton className="h-4 w-64" animate={animate} />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} animate={animate} />
        ))}
      </div>

      {/* Secondary Widgets */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ProgressWidgetSkeleton animate={animate} />
        <ProgressWidgetSkeleton animate={animate} />
      </div>

      {/* Leaderboard and Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border/50 bg-card/80 p-5">
          <Skeleton className="h-5 w-32 mb-4" animate={animate} />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListItemSkeleton key={i} animate={animate} />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border/50 bg-card/80 p-5">
          <Skeleton className="h-5 w-32 mb-4" animate={animate} />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListItemSkeleton key={i} animate={animate} />
            ))}
          </div>
        </div>
      </div>

      {/* Screen reader announcement */}
      <span className="sr-only">Loading dashboard data, please wait...</span>
    </div>
  )
}

AnalyticsDashboardSkeleton.displayName = 'AnalyticsDashboardSkeleton'

/**
 * Usage Dashboard skeleton.
 * Matches the layout of UsageDashboard component.
 */
export function UsageDashboardSkeleton({
  className,
  animate = true,
}: DashboardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card h-full flex flex-col',
        className
      )}
      role="status"
      aria-label="Loading usage dashboard"
      aria-busy="true"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-40" animate={animate} />
              <Skeleton className="h-5 w-20 rounded-full" animate={animate} />
            </div>
            <Skeleton className="h-4 w-56" animate={animate} />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" animate={animate} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="space-y-6">
          {/* Credit Balance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4 w-28" animate={animate} />
              <div className="text-right space-y-1">
                <Skeleton className="h-7 w-20" animate={animate} />
                <Skeleton className="h-3 w-24" animate={animate} />
              </div>
            </div>
            <Skeleton className="h-3 w-full rounded-full" animate={animate} />
          </div>

          {/* Usage Metrics Grid */}
          <div>
            <Skeleton className="h-4 w-32 mb-3" animate={animate} />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-8 w-8" animate={animate} />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-16" animate={animate} />
                      <Skeleton className="h-5 w-12" animate={animate} />
                    </div>
                  </div>
                  <Skeleton
                    className="h-1.5 w-full rounded-full"
                    animate={animate}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div>
            <Skeleton className="h-4 w-28 mb-3" animate={animate} />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40"
                >
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" animate={animate} />
                    <Skeleton className="h-3 w-32" animate={animate} />
                  </div>
                  <Skeleton className="h-4 w-16" animate={animate} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">Loading usage data, please wait...</span>
    </div>
  )
}

UsageDashboardSkeleton.displayName = 'UsageDashboardSkeleton'

/**
 * Token Optimization Dashboard skeleton.
 */
export function TokenOptimizationDashboardSkeleton({
  className,
  animate = true,
}: DashboardSkeletonProps) {
  return (
    <div
      className={cn(
        'p-6 bg-card rounded-lg border border-border/50',
        className
      )}
      role="status"
      aria-label="Loading token optimization dashboard"
      aria-busy="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" animate={animate} />
          <Skeleton className="h-4 w-56" animate={animate} />
        </div>
        <Skeleton className="h-4 w-12" animate={animate} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-border/30">
            <Skeleton className="h-7 w-24 mb-2" animate={animate} />
            <Skeleton className="h-4 w-20" animate={animate} />
            <Skeleton className="h-3 w-28 mt-2" animate={animate} />
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-40 mb-3" animate={animate} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
          >
            <Skeleton className="h-8 w-8" animate={animate} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="h-4 w-32" animate={animate} />
                <Skeleton className="h-4 w-16" animate={animate} />
              </div>
              <Skeleton className="h-3 w-48" animate={animate} />
              <Skeleton
                className="h-1.5 w-full rounded-full mt-2"
                animate={animate}
              />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">Loading optimization data, please wait...</span>
    </div>
  )
}

TokenOptimizationDashboardSkeleton.displayName =
  'TokenOptimizationDashboardSkeleton'

/**
 * Performance Dashboard skeleton.
 */
export function PerformanceDashboardSkeleton({
  className,
  animate = true,
}: DashboardSkeletonProps) {
  return (
    <div
      className={cn('p-4 rounded-lg border border-border bg-card', className)}
      role="status"
      aria-label="Loading performance dashboard"
      aria-busy="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-40" animate={animate} />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-14" animate={animate} />
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border border-border/50 bg-muted/30"
          >
            <div className="flex items-center justify-between mb-1">
              <Skeleton className="h-3 w-20" animate={animate} />
              <Skeleton className="h-2 w-2 rounded-full" animate={animate} />
            </div>
            <Skeleton className="h-7 w-16" animate={animate} />
          </div>
        ))}
      </div>

      <span className="sr-only">
        Loading performance metrics, please wait...
      </span>
    </div>
  )
}

PerformanceDashboardSkeleton.displayName = 'PerformanceDashboardSkeleton'

/**
 * Empty state component for dashboards with no data.
 *
 * @example
 * ```tsx
 * {data.length === 0 ? (
 *   <DashboardEmptyState
 *     title="No analytics data"
 *     description="Start tracking to see your metrics here."
 *     actionLabel="Learn how to track"
 *     onAction={() => navigate('/docs/tracking')}
 *   />
 * ) : (
 *   <AnalyticsDashboard data={data} />
 * )}
 * ```
 */
export interface DashboardEmptyStateProps {
  /** Title for the empty state */
  title: string
  /** Description text */
  description: string
  /** Optional icon to display */
  icon?: React.ReactNode
  /** Optional action button label */
  actionLabel?: string
  /** Optional action callback */
  onAction?: () => void
  /** Custom className */
  className?: string
}

export function DashboardEmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: DashboardEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-8 text-center',
        className
      )}
      role="status"
      aria-label={title}
    >
      {icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
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
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      )}

      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground max-w-[280px]">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        >
          {actionLabel}
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

DashboardEmptyState.displayName = 'DashboardEmptyState'
