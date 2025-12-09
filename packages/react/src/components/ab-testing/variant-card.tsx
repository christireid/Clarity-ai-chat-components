'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import { type SignificanceResult } from './use-statistical-significance'
import { DashboardProgress } from '../dashboard-progress'

/**
 * Variant metrics data
 */
export interface VariantMetrics {
  /** Number of impressions */
  impressions: number
  /** Number of conversions */
  conversions: number
  /** Conversion rate (0-1) */
  conversionRate: number
  /** Average engagement time in ms */
  avgEngagementTime: number
  /** Bounce rate (0-1) */
  bounceRate: number
  /** Revenue (optional) */
  revenue?: number
  /** Number of unique users */
  users: number
}

/**
 * Props for VariantCard component
 */
export interface VariantCardProps {
  /** Variant ID */
  id: string
  /** Variant name */
  name: string
  /** Variant description */
  description?: string
  /** Whether this is the control variant */
  isControl?: boolean
  /** Whether this variant is the winner */
  isWinner?: boolean
  /** Variant metrics */
  metrics: VariantMetrics
  /** Position/rank in the list */
  rank?: number
  /** Minimum sample size for significance */
  minSampleSize?: number
  /** Statistical significance result vs control */
  significance?: SignificanceResult | null
  /** Whether to show statistics section */
  showStatistics?: boolean
  /** Animation delay for staggered entrance */
  animationDelay?: number
  /** Custom className */
  className?: string
}

/**
 * Format percentage value
 */
function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

/**
 * Format duration in ms to human readable
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`
}

/**
 * Card component for displaying a variant in an A/B test comparison.
 *
 * @example
 * ```tsx
 * <VariantCard
 *   id="variant-a"
 *   name="With Suggestions"
 *   description="Chat input with AI suggestions"
 *   isControl={false}
 *   isWinner={true}
 *   metrics={variantMetrics}
 *   significance={significanceResult}
 *   showStatistics
 * />
 * ```
 */
export function VariantCard({
  id,
  name,
  description,
  isControl = false,
  isWinner = false,
  metrics,
  rank,
  minSampleSize = 100,
  significance,
  showStatistics = true,
  animationDelay = 0,
  className,
}: VariantCardProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay }}
    >
      <Card className={cn(isWinner && 'border-green-500', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {name}
                {isControl && (
                  <Badge variant="outline" className="text-xs">
                    Control
                  </Badge>
                )}
                {isWinner && (
                  <Badge variant="success" className="text-xs">
                    Winner
                  </Badge>
                )}
              </CardTitle>
              {description && (
                <CardDescription className="text-xs mt-1">
                  {description}
                </CardDescription>
              )}
            </div>

            {rank !== undefined && <Badge variant="outline">{rank}</Badge>}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* Main metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Conversion Rate
                </div>
                <div className="text-2xl font-bold">
                  {formatPercent(metrics.conversionRate)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {metrics.conversions} / {metrics.impressions}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Avg Engagement
                </div>
                <div className="text-2xl font-bold">
                  {formatDuration(metrics.avgEngagementTime)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {metrics.users} users
                </div>
              </div>
            </div>

            {/* Progress bar for sample size */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Sample Size</span>
                <span>
                  {metrics.impressions} / {minSampleSize}
                </span>
              </div>
              <DashboardProgress
                value={(metrics.impressions / minSampleSize) * 100}
                size="sm"
                aria-label={`Sample size progress: ${metrics.impressions} of ${minSampleSize} required`}
              />
            </div>

            {/* Additional metrics */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bounce Rate</span>
                <span>{formatPercent(metrics.bounceRate)}</span>
              </div>
              {metrics.revenue !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue</span>
                  <span>${metrics.revenue.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Statistical significance */}
            {showStatistics && significance && (
              <div className="pt-2 border-t">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">vs Control</span>
                    <Badge
                      variant={
                        significance.isSignificant ? 'success' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {significance.isSignificant
                        ? 'Significant'
                        : 'Not Significant'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Effect Size</span>
                    <span
                      className={cn(
                        'font-medium',
                        significance.effectSize > 0
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-red-700 dark:text-red-400'
                      )}
                      aria-label={`Effect size: ${significance.effectSize > 0 ? 'positive' : 'negative'} ${Math.abs(significance.effectSize).toFixed(1)} percent`}
                    >
                      {significance.effectSize > 0 ? '+' : ''}
                      {significance.effectSize.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">p-value</span>
                    <span>{significance.pValue.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

VariantCard.displayName = 'VariantCard'
