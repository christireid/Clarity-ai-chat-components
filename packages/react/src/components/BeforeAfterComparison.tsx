'use client'

/**
 * BeforeAfterComparison - Visual Cost Savings Comparison Component
 *
 * A reusable component for displaying before/after optimization metrics with
 * animated transitions, percentage savings, and strategy breakdowns.
 *
 * @module BeforeAfterComparison
 * @since 1.0.0
 * @stable
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  Target,
} from 'lucide-react'

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Comparison type (what metric is being compared)
 */
export type ComparisonType = 'cost' | 'tokens' | 'latency' | 'custom'

/**
 * Individual strategy contribution to savings
 */
export interface StrategyContribution {
  /** Strategy name (e.g., "Prompt Caching", "Model Routing") */
  name: string
  /** Percentage contribution to total savings (0-100) */
  savingsPercent: number
  /** Optional description of the strategy */
  description?: string
  /** Optional color for visualization */
  color?: string
}

/**
 * Before state metrics
 */
export interface BeforeMetrics {
  /** Primary value (cost, tokens, or latency) */
  value: number
  /** Optional label override */
  label?: string
  /** Optional description */
  description?: string
}

/**
 * After state metrics
 */
export interface AfterMetrics {
  /** Primary value (cost, tokens, or latency) */
  value: number
  /** Optional label override */
  label?: string
  /** Optional description */
  description?: string
}

/**
 * Props for BeforeAfterComparison component
 */
export interface BeforeAfterComparisonProps {
  /** Before optimization metrics */
  before: BeforeMetrics
  /** After optimization metrics */
  after: AfterMetrics
  /** Type of comparison being made */
  comparisonType?: ComparisonType
  /** Custom unit for display (e.g., "ms", "$", "tokens") */
  unit?: string
  /** Strategy breakdown showing contribution to savings */
  strategies?: StrategyContribution[]
  /** Show animated transition when component appears */
  showAnimation?: boolean
  /** Show percentage savings badge prominently */
  showSavingsBadge?: boolean
  /** Show strategy breakdown section */
  showStrategies?: boolean
  /** Visualization style */
  visualStyle?: 'bars' | 'cards' | 'minimal'
  /** Custom title for the comparison */
  title?: string
  /** Custom className */
  className?: string
  /** Disable all animations */
  disableAnimations?: boolean
  /** Callback when animation completes */
  onAnimationComplete?: () => void
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format number with appropriate units and decimals
 */
function formatValue(
  value: number,
  type: ComparisonType,
  customUnit?: string
): string {
  const unit = customUnit || getDefaultUnit(type)

  if (type === 'cost') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (type === 'tokens') {
    return `${new Intl.NumberFormat('en-US').format(Math.round(value))} ${unit}`
  }

  if (type === 'latency') {
    return `${value.toFixed(0)}${unit}`
  }

  // Custom type
  return `${value.toLocaleString()}${unit ? ` ${unit}` : ''}`
}

/**
 * Get default unit for comparison type
 */
function getDefaultUnit(type: ComparisonType): string {
  switch (type) {
    case 'cost':
      return '$'
    case 'tokens':
      return 'tokens'
    case 'latency':
      return 'ms'
    default:
      return ''
  }
}

/**
 * Calculate percentage savings
 */
function calculateSavingsPercent(before: number, after: number): number {
  if (before === 0) return 0
  return ((before - after) / before) * 100
}

/**
 * Get icon for comparison type
 */
function getComparisonIcon(type: ComparisonType) {
  switch (type) {
    case 'cost':
      return DollarSign
    case 'tokens':
      return Zap
    case 'latency':
      return Clock
    default:
      return Sparkles
  }
}

/**
 * Get default strategy colors
 */
function getStrategyColor(index: number): string {
  const colors = [
    'rgb(34, 197, 94)', // green-500
    'rgb(59, 130, 246)', // blue-500
    'rgb(168, 85, 247)', // purple-500
    'rgb(249, 115, 22)', // orange-500
    'rgb(236, 72, 153)', // pink-500
    'rgb(14, 165, 233)', // sky-500
  ]
  return colors[index % colors.length]
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Metric Card Component
 */
function MetricCard({
  label,
  value,
  type,
  unit,
  variant = 'before',
  className,
}: {
  label: string
  value: number
  type: ComparisonType
  unit?: string
  variant?: 'before' | 'after'
  className?: string
}) {
  const Icon = getComparisonIcon(type)
  const isBefore = variant === 'before'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.slow }}
      className={`rounded-xl border p-6 ${
        isBefore
          ? 'border-red-500/20 bg-gradient-to-br from-red-500/10 to-rose-500/5'
          : 'border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/5'
      } ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-2 rounded-lg ${isBefore ? 'bg-red-500/10' : 'bg-green-500/10'}`}
        >
          <Icon
            className={`w-5 h-5 ${isBefore ? 'text-red-500' : 'text-green-500'}`}
          />
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            isBefore
              ? 'bg-red-500/10 text-red-600 dark:text-red-400'
              : 'bg-green-500/10 text-green-600 dark:text-green-400'
          }`}
        >
          {isBefore ? 'Before' : 'After'}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-foreground">
          {formatValue(value, type, unit)}
        </p>
      </div>
    </motion.div>
  )
}

/**
 * Savings Badge Component
 */
function SavingsBadge({
  savingsPercent,
  showAnimation = true,
}: {
  savingsPercent: number
  showAnimation?: boolean
}) {
  const [displayPercent, setDisplayPercent] = React.useState(0)

  React.useEffect(() => {
    if (!showAnimation) {
      setDisplayPercent(savingsPercent)
      return
    }

    const duration = 1500
    const steps = 60
    const stepDuration = duration / steps
    const increment = savingsPercent / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayPercent(savingsPercent)
        clearInterval(interval)
      } else {
        setDisplayPercent(increment * currentStep)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [savingsPercent, showAnimation])

  const isExcellent = savingsPercent >= 70
  const isGood = savingsPercent >= 50
  const isModerate = savingsPercent >= 30

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: durations.slow, delay: 0.3 }}
      className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl border-2 ${
        isExcellent
          ? 'border-green-500 bg-gradient-to-r from-green-500/20 to-emerald-500/20'
          : isGood
            ? 'border-blue-500 bg-gradient-to-r from-blue-500/20 to-sky-500/20'
            : isModerate
              ? 'border-amber-500 bg-gradient-to-r from-amber-500/20 to-orange-500/20'
              : 'border-border bg-muted/30'
      }`}
    >
      <div
        className={`p-2 rounded-full ${
          isExcellent
            ? 'bg-green-500/20'
            : isGood
              ? 'bg-blue-500/20'
              : isModerate
                ? 'bg-amber-500/20'
                : 'bg-muted'
        }`}
      >
        {isExcellent ? (
          <Award className="w-6 h-6 text-green-500" />
        ) : isGood ? (
          <Target className="w-6 h-6 text-blue-500" />
        ) : (
          <TrendingDown className="w-6 h-6 text-amber-500" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-medium">
          Total Savings
        </span>
        <span className="text-3xl font-bold text-foreground tabular-nums">
          {displayPercent.toFixed(1)}%
        </span>
      </div>
    </motion.div>
  )
}

/**
 * Strategy Breakdown Component
 */
function StrategyBreakdown({
  strategies,
}: {
  strategies: StrategyContribution[]
}) {
  const totalSavings = strategies.reduce((sum, s) => sum + s.savingsPercent, 0)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand-500" />
        Strategy Breakdown
      </h3>

      <div className="space-y-3">
        {strategies.map((strategy, index) => {
          const color = strategy.color || getStrategyColor(index)
          const widthPercent =
            totalSavings > 0
              ? (strategy.savingsPercent / totalSavings) * 100
              : 0

          return (
            <motion.div
              key={strategy.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: durations.slow, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {strategy.name}
                  </p>
                  {strategy.description && (
                    <p className="text-xs text-muted-foreground">
                      {strategy.description}
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground tabular-nums ml-4">
                  {strategy.savingsPercent.toFixed(1)}%
                </span>
              </div>

              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{
                    duration: durations.slower,
                    delay: index * 0.1 + 0.3,
                    ease: 'easeOut',
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {totalSavings > 100 && (
        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg p-3">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            Note: Strategy contributions total {totalSavings.toFixed(1)}% due to
            overlapping optimizations
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Bar Chart Visualization
 */
function BarChartVisualization({
  before,
  after,
  type,
  unit,
}: {
  before: number
  after: number
  type: ComparisonType
  unit?: string
}) {
  const maxValue = Math.max(before, after)
  const beforePercent = (before / maxValue) * 100
  const afterPercent = (after / maxValue) * 100

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {/* Before Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Before Optimization
            </span>
            <span className="text-sm font-mono text-muted-foreground">
              {formatValue(before, type, unit)}
            </span>
          </div>
          <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-end pr-4"
              initial={{ width: 0 }}
              animate={{ width: `${beforePercent}%` }}
              transition={{ duration: durations.slower, ease: 'easeOut' }}
            >
              <span className="text-xs font-semibold text-white">100%</span>
            </motion.div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* After Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              After Optimization
            </span>
            <span className="text-sm font-mono text-muted-foreground">
              {formatValue(after, type, unit)}
            </span>
          </div>
          <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-end pr-4"
              initial={{ width: 0 }}
              animate={{ width: `${afterPercent}%` }}
              transition={{
                duration: durations.slower,
                delay: 0.3,
                ease: 'easeOut',
              }}
            >
              <span className="text-xs font-semibold text-white">
                {afterPercent.toFixed(0)}%
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export const BeforeAfterComparison = React.memo(function BeforeAfterComparison({
  before,
  after,
  comparisonType = 'cost',
  unit,
  strategies = [],
  showAnimation = true,
  showSavingsBadge = true,
  showStrategies = true,
  visualStyle = 'bars',
  title,
  className,
  disableAnimations = false,
  onAnimationComplete,
}: BeforeAfterComparisonProps) {
  const savingsPercent = calculateSavingsPercent(before.value, after.value)
  const savingsAmount = before.value - after.value

  // Disable animation if requested or if reduced motion preferred
  const shouldAnimate = !disableAnimations && showAnimation

  React.useEffect(() => {
    if (shouldAnimate && onAnimationComplete) {
      const timer = setTimeout(onAnimationComplete, 2000)
      return () => clearTimeout(timer)
    }
  }, [shouldAnimate, onAnimationComplete])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title */}
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          {title}
        </motion.h2>
      )}

      {/* Savings Badge */}
      {showSavingsBadge && (
        <div className="flex justify-center">
          <SavingsBadge
            savingsPercent={savingsPercent}
            showAnimation={shouldAnimate}
          />
        </div>
      )}

      {/* Visual Comparison */}
      <div className="rounded-xl border border-border bg-card p-6">
        {visualStyle === 'bars' && (
          <BarChartVisualization
            before={before.value}
            after={after.value}
            type={comparisonType}
            unit={unit}
          />
        )}

        {visualStyle === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              label={before.label || 'Before Optimization'}
              value={before.value}
              type={comparisonType}
              unit={unit}
              variant="before"
            />
            <MetricCard
              label={after.label || 'After Optimization'}
              value={after.value}
              type={comparisonType}
              unit={unit}
              variant="after"
            />
          </div>
        )}

        {visualStyle === 'minimal' && (
          <div className="flex items-center justify-between gap-8">
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                {before.label || 'Before'}
              </p>
              <p className="text-3xl font-bold text-red-500">
                {formatValue(before.value, comparisonType, unit)}
              </p>
            </div>
            <ArrowRight className="w-8 h-8 text-muted-foreground flex-shrink-0" />
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                {after.label || 'After'}
              </p>
              <p className="text-3xl font-bold text-green-500">
                {formatValue(after.value, comparisonType, unit)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Savings Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.slow, delay: 0.5 }}
        className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              You're saving {formatValue(savingsAmount, comparisonType, unit)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {savingsPercent.toFixed(1)}% reduction from optimization
            </p>
          </div>
        </div>
        <TrendingDown className="w-6 h-6 text-green-500" />
      </motion.div>

      {/* Strategy Breakdown */}
      {showStrategies && strategies.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <StrategyBreakdown strategies={strategies} />
        </div>
      )}

      {/* Additional Context */}
      {(before.description || after.description) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {before.description && (
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Before
              </p>
              <p className="text-sm text-foreground">{before.description}</p>
            </div>
          )}
          {after.description && (
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                After
              </p>
              <p className="text-sm text-foreground">{after.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

BeforeAfterComparison.displayName = 'BeforeAfterComparison'

// ============================================================================
// Exports
// ============================================================================

export default BeforeAfterComparison
