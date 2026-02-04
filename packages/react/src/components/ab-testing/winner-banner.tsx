'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@clarity-chat/primitives'
import { type SignificanceResult } from './use-statistical-significance'

/**
 * Props for WinnerBanner component
 */
export interface WinnerBannerProps {
  /** Winner variant name */
  variantName: string
  /** Winner's conversion rate */
  conversionRate: number
  /** Statistical significance result */
  significance: SignificanceResult
  /** Whether winner has already been declared */
  isDeclared?: boolean
  /** Callback to declare the winner */
  onDeclareWinner?: () => void
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
 * Banner component displaying winner detection and recommendation.
 *
 * @example
 * ```tsx
 * {winner && (
 *   <WinnerBanner
 *     variantName={winner.variant.name}
 *     conversionRate={winner.metrics.conversionRate}
 *     significance={winner.significance}
 *     isDeclared={!!experiment.winner}
 *     onDeclareWinner={() => handleDeclareWinner(winner.variant.id)}
 *   />
 * )}
 * ```
 */
export function WinnerBanner({
  variantName,
  conversionRate,
  significance,
  isDeclared = false,
  onDeclareWinner,
  className,
}: WinnerBannerProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-green-500 bg-green-50 dark:bg-green-950">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span role="img" aria-label="Trophy">
              🏆
            </span>{' '}
            Winner Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">
            <strong>{variantName}</strong> is performing significantly better
            with {formatPercent(conversionRate)} conversion rate (
            {significance.effectSize.toFixed(1)}% improvement)
          </p>
          <p className="text-xs text-muted-foreground">
            p-value: {significance.pValue.toFixed(4)} (
            {formatPercent(significance.confidenceLevel)} confidence)
          </p>

          {!isDeclared && onDeclareWinner && (
            <Button size="sm" className="mt-3" onClick={onDeclareWinner}>
              Declare Winner
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

WinnerBanner.displayName = 'WinnerBanner'
