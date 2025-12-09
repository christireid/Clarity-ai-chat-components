'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

/**
 * Props for DashboardProgress component
 */
export interface DashboardProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value?: number
  /** Accessible label for the progress bar */
  'aria-label'?: string
  /** Maximum value (default: 100) */
  max?: number
  /** Whether to show the percentage text */
  showValue?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Color variant based on progress */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'auto'
  /** Thresholds for auto variant (warning at X%, danger at Y%) */
  thresholds?: { warning: number; danger: number }
}

/**
 * Progress bar component for dashboard metrics.
 *
 * Features:
 * - Accessible with ARIA attributes
 * - Guards against NaN/Infinity values
 * - Auto color variant based on thresholds
 * - Multiple size options
 *
 * @example
 * ```tsx
 * <DashboardProgress
 *   value={75}
 *   aria-label="Storage usage"
 *   variant="auto"
 *   thresholds={{ warning: 70, danger: 90 }}
 * />
 * ```
 */
export const DashboardProgress = React.forwardRef<
  HTMLDivElement,
  DashboardProgressProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      'aria-label': ariaLabel,
      showValue = false,
      size = 'md',
      variant = 'default',
      thresholds = { warning: 70, danger: 90 },
      ...props
    },
    ref
  ) => {
    // Guard against NaN/Infinity - clamp to valid percentage range
    const safeValue = Number.isFinite(value)
      ? Math.min(max, Math.max(0, value))
      : 0
    const percentage = (safeValue / max) * 100

    // Determine color based on variant
    const getBarColor = () => {
      if (variant === 'auto') {
        if (percentage >= thresholds.danger) return 'bg-red-600'
        if (percentage >= thresholds.warning) return 'bg-yellow-500'
        return 'bg-green-600'
      }

      switch (variant) {
        case 'success':
          return 'bg-green-600'
        case 'warning':
          return 'bg-yellow-500'
        case 'danger':
          return 'bg-red-600'
        default:
          return 'bg-blue-600'
      }
    }

    // Size classes
    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3',
    }

    return (
      <div className={cn('w-full', className)} ref={ref} {...props}>
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
            sizeClasses[size]
          )}
          role="progressbar"
          aria-valuenow={Math.round(safeValue)}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={ariaLabel || 'Progress'}
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-out',
              getBarColor()
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <span className="mt-1 text-xs text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    )
  }
)

DashboardProgress.displayName = 'DashboardProgress'

/**
 * Circular progress indicator for compact displays
 */
export interface CircularProgressProps {
  /** Progress value (0-100) */
  value: number
  /** Size in pixels */
  size?: number
  /** Stroke width */
  strokeWidth?: number
  /** Whether to show percentage in center */
  showValue?: boolean
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'auto'
  /** Thresholds for auto variant */
  thresholds?: { warning: number; danger: number }
  /** Custom className */
  className?: string
}

/**
 * Circular progress indicator component.
 *
 * @example
 * ```tsx
 * <CircularProgress value={75} size={48} showValue />
 * ```
 */
export function CircularProgress({
  value,
  size = 40,
  strokeWidth = 4,
  showValue = false,
  variant = 'default',
  thresholds = { warning: 70, danger: 90 },
  className,
}: CircularProgressProps): React.ReactElement {
  // Guard against invalid values
  const safeValue = Number.isFinite(value)
    ? Math.min(100, Math.max(0, value))
    : 0

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (safeValue / 100) * circumference

  // Determine color based on variant
  const getStrokeColor = () => {
    if (variant === 'auto') {
      if (safeValue >= thresholds.danger) return 'stroke-red-600'
      if (safeValue >= thresholds.warning) return 'stroke-yellow-500'
      return 'stroke-green-600'
    }

    switch (variant) {
      case 'success':
        return 'stroke-green-600'
      case 'warning':
        return 'stroke-yellow-500'
      case 'danger':
        return 'stroke-red-600'
      default:
        return 'stroke-blue-600'
    }
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className
      )}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(safeValue)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={cn(
            'transition-all duration-300 ease-out',
            getStrokeColor()
          )}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {showValue && (
        <span className="absolute text-xs font-medium">
          {Math.round(safeValue)}
        </span>
      )}
    </div>
  )
}

CircularProgress.displayName = 'CircularProgress'
