'use client'

/**
 * StatsDisplay Component
 *
 * A component for displaying statistics, metrics, and KPIs in various layouts.
 * Supports multiple presets including fitness summary, analytics dashboard, etc.
 *
 * Features:
 * - Multiple layout variants (grid, inline, card, compact)
 * - Trend indicators (up, down, neutral)
 * - Animated value transitions
 * - Sparkline mini-charts
 * - Icon support
 * - Preset configurations
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * // Basic usage
 * <StatsDisplay
 *   stats={[
 *     { label: 'Total Users', value: 12500, trend: 'up', change: 12.5 },
 *     { label: 'Revenue', value: '$45,200', trend: 'up', change: 8.3 },
 *     { label: 'Bounce Rate', value: '24%', trend: 'down', change: -3.2 },
 *   ]}
 * />
 *
 * // Fitness summary preset
 * <StatsDisplay
 *   variant="card"
 *   stats={[
 *     { label: 'Steps', value: 8432, goal: 10000, icon: '👟' },
 *     { label: 'Calories', value: 1850, goal: 2000, icon: '🔥' },
 *     { label: 'Active Minutes', value: 45, goal: 30, icon: '⏱️' },
 *   ]}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type StatsDisplayVariant = 'grid' | 'inline' | 'card' | 'compact' | 'minimal'
export type StatTrend = 'up' | 'down' | 'neutral'
export type StatsDisplaySize = 'sm' | 'md' | 'lg'

export interface StatData {
  /** Unique identifier */
  id?: string
  /** Stat label */
  label: string
  /** Current value */
  value: string | number
  /** Previous value (for comparison) */
  previousValue?: string | number
  /** Change percentage */
  change?: number
  /** Trend direction */
  trend?: StatTrend
  /** Goal/target value */
  goal?: number
  /** Unit suffix */
  unit?: string
  /** Icon (emoji or React node) */
  icon?: React.ReactNode
  /** Description */
  description?: string
  /** Sparkline data points */
  sparkline?: number[]
  /** Custom color */
  color?: string
  /** Whether value is loading */
  isLoading?: boolean
}

export interface StatsDisplayProps {
  /** Array of stats to display */
  stats: StatData[]
  /** Visual variant */
  variant?: StatsDisplayVariant
  /** Size preset */
  size?: StatsDisplaySize
  /** Number of columns (for grid variant) */
  columns?: 2 | 3 | 4
  /** Show trend indicators */
  showTrend?: boolean
  /** Show change values */
  showChange?: boolean
  /** Show progress bars (when goal is set) */
  showProgress?: boolean
  /** Show sparklines */
  showSparklines?: boolean
  /** Animate value changes */
  animateValues?: boolean
  /** Title */
  title?: string
  /** Click handler */
  onStatClick?: (stat: StatData) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatValue(value: string | number, unit?: string): string {
  if (typeof value === 'string') return value
  const formatted = value.toLocaleString()
  return unit ? `${formatted}${unit}` : formatted
}

function formatChange(change: number): string {
  const sign = change > 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}

function getTrendIcon(trend: StatTrend) {
  switch (trend) {
    case 'up':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      )
    case 'down':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      )
    default:
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14" />
        </svg>
      )
  }
}

// ============================================================================
// Sparkline Component
// ============================================================================

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  trend?: StatTrend
}

function Sparkline({ data, width = 60, height = 20, trend = 'neutral' }: SparklineProps) {
  const prefersReducedMotion = useReducedMotion()

  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} className="stats-sparkline">
      <motion.polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('stats-sparkline-line', `stats-sparkline-${trend}`)}
        initial={prefersReducedMotion ? {} : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: DURATION_SECONDS.slow,
          ease: EASING_FRAMER.standard,
        }}
      />
    </svg>
  )
}

// ============================================================================
// ProgressRing Component
// ============================================================================

interface ProgressRingProps {
  value: number
  goal: number
  size?: number
}

function ProgressRing({ value, goal, size = 40 }: ProgressRingProps) {
  const prefersReducedMotion = useReducedMotion()
  const progress = Math.min((value / goal) * 100, 100)
  const strokeWidth = size / 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="stats-progress-ring">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="stats-progress-ring-bg"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={cn(
          'stats-progress-ring-fill',
          progress >= 100 && 'stats-progress-ring-complete'
        )}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{
          duration: prefersReducedMotion ? 0 : DURATION_SECONDS.slow,
          ease: EASING_FRAMER.standard,
        }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}

// ============================================================================
// StatItem Component
// ============================================================================

interface StatItemProps {
  stat: StatData
  variant: StatsDisplayVariant
  size: StatsDisplaySize
  showTrend: boolean
  showChange: boolean
  showProgress: boolean
  showSparklines: boolean
  animateValues: boolean
  onClick?: () => void
}

function StatItem({
  stat,
  variant,
  size,
  showTrend,
  showChange,
  showProgress,
  showSparklines,
  animateValues,
  onClick,
}: StatItemProps) {
  const prefersReducedMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = React.useState(stat.value)

  // Animate numeric value changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!animateValues || prefersReducedMotion || typeof stat.value !== 'number') {
      setDisplayValue(stat.value)
      return
    }

    const start = typeof displayValue === 'number' ? displayValue : 0
    const end = stat.value
    const duration = 500
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current = start + (end - start) * eased
      setDisplayValue(Math.round(current))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [stat.value, animateValues, prefersReducedMotion])

  const hasGoal = stat.goal !== undefined && typeof stat.value === 'number'
  const progress = hasGoal ? (stat.value as number / stat.goal!) * 100 : 0

  // Loading skeleton
  if (stat.isLoading) {
    return (
      <div className={cn('stats-item', 'stats-item-loading', `stats-item-${size}`)}>
        <div className="stats-item-skeleton-value" />
        <div className="stats-item-skeleton-label" />
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        'stats-item',
        `stats-item-${variant}`,
        `stats-item-${size}`,
        onClick && 'stats-item-clickable'
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION_SECONDS.fast,
        ease: EASING_FRAMER.standard,
      }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      style={stat.color ? { '--stat-color': stat.color } as React.CSSProperties : undefined}
    >
      {/* Icon and progress ring */}
      {(stat.icon || (showProgress && hasGoal)) && (
        <div className="stats-item-visual">
          {showProgress && hasGoal ? (
            <div className="stats-item-progress-wrapper">
              <ProgressRing
                value={stat.value as number}
                goal={stat.goal!}
                size={variant === 'compact' ? 32 : 48}
              />
              {stat.icon && (
                <span className="stats-item-icon-overlay">{stat.icon}</span>
              )}
            </div>
          ) : (
            stat.icon && <span className="stats-item-icon">{stat.icon}</span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="stats-item-content">
        <div className="stats-item-header">
          <span className="stats-item-value">
            {formatValue(displayValue, stat.unit)}
          </span>

          {/* Trend indicator */}
          {showTrend && stat.trend && (
            <span className={cn('stats-item-trend', `stats-item-trend-${stat.trend}`)}>
              {getTrendIcon(stat.trend)}
              {showChange && stat.change !== undefined && (
                <span className="stats-item-change">
                  {formatChange(stat.change)}
                </span>
              )}
            </span>
          )}
        </div>

        <span className="stats-item-label">{stat.label}</span>

        {stat.description && variant !== 'compact' && variant !== 'minimal' && (
          <span className="stats-item-description">{stat.description}</span>
        )}

        {/* Goal progress bar (for non-ring display) */}
        {showProgress && hasGoal && variant !== 'card' && (
          <div className="stats-item-progress-bar">
            <motion.div
              className={cn(
                'stats-item-progress-fill',
                progress >= 100 && 'stats-item-progress-complete'
              )}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{
                duration: prefersReducedMotion ? 0 : DURATION_SECONDS.normal,
                ease: EASING_FRAMER.standard,
              }}
            />
          </div>
        )}

        {/* Goal text */}
        {hasGoal && variant !== 'minimal' && (
          <span className="stats-item-goal">
            {progress >= 100 ? 'Goal reached!' : `Goal: ${stat.goal?.toLocaleString()}`}
          </span>
        )}

        {/* Sparkline */}
        {showSparklines && stat.sparkline && stat.sparkline.length > 1 && (
          <Sparkline data={stat.sparkline} trend={stat.trend} />
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// StatsDisplay Component
// ============================================================================

export function StatsDisplay({
  stats,
  variant = 'grid',
  size = 'md',
  columns = 3,
  showTrend = true,
  showChange = true,
  showProgress = true,
  showSparklines = false,
  animateValues = true,
  title,
  onStatClick,
  className,
}: StatsDisplayProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn(
        'stats-display',
        `stats-display-${variant}`,
        `stats-display-${size}`,
        variant === 'grid' && `stats-display-cols-${columns}`,
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_SECONDS.normal }}
      role="region"
      aria-label={title || 'Statistics'}
    >
      {title && <h3 className="stats-display-title">{title}</h3>}

      <div className="stats-display-items">
        <AnimatePresence mode="popLayout">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.id || `stat-${index}`}
              stat={stat}
              variant={variant}
              size={size}
              showTrend={showTrend}
              showChange={showChange}
              showProgress={showProgress}
              showSparklines={showSparklines}
              animateValues={animateValues}
              onClick={onStatClick ? () => onStatClick(stat) : undefined}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ============================================================================
// useStatsDisplay Hook
// ============================================================================

export interface UseStatsDisplayOptions {
  /** Initial stats */
  initialStats?: StatData[]
  /** Auto-calculate trends from history */
  autoCalculateTrends?: boolean
}

export interface UseStatsDisplayReturn {
  /** Current stats */
  stats: StatData[]
  /** Update a stat value */
  updateStat: (id: string, updates: Partial<StatData>) => void
  /** Add a new stat */
  addStat: (stat: StatData) => void
  /** Remove a stat */
  removeStat: (id: string) => void
  /** Set all stats */
  setStats: (stats: StatData[]) => void
  /** Get stat by id */
  getStat: (id: string) => StatData | undefined
  /** Calculate total */
  getTotal: () => number
  /** Calculate average */
  getAverage: () => number
}

export function useStatsDisplay(
  options: UseStatsDisplayOptions = {}
): UseStatsDisplayReturn {
  const { initialStats = [] } = options
  const [stats, setStats] = React.useState<StatData[]>(initialStats)

  const updateStat = React.useCallback((id: string, updates: Partial<StatData>) => {
    setStats((prev) =>
      prev.map((stat) => (stat.id === id ? { ...stat, ...updates } : stat))
    )
  }, [])

  const addStat = React.useCallback((stat: StatData) => {
    setStats((prev) => [...prev, stat])
  }, [])

  const removeStat = React.useCallback((id: string) => {
    setStats((prev) => prev.filter((stat) => stat.id !== id))
  }, [])

  const getStat = React.useCallback(
    (id: string) => stats.find((stat) => stat.id === id),
    [stats]
  )

  const getTotal = React.useCallback(() => {
    return stats.reduce((sum, stat) => {
      const value = typeof stat.value === 'number' ? stat.value : 0
      return sum + value
    }, 0)
  }, [stats])

  const getAverage = React.useCallback(() => {
    const numericStats = stats.filter((stat) => typeof stat.value === 'number')
    if (numericStats.length === 0) return 0
    const total = numericStats.reduce((sum, stat) => sum + (stat.value as number), 0)
    return total / numericStats.length
  }, [stats])

  return {
    stats,
    updateStat,
    addStat,
    removeStat,
    setStats,
    getStat,
    getTotal,
    getAverage,
  }
}

export default StatsDisplay
