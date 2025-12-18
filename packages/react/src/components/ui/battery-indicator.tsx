'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge, cn } from '@clarity-chat/primitives'
import {
  useBatteryAware,
  type BatteryAwareConfig,
} from '../../hooks/performance/use-battery-aware'
import { DURATION_SECONDS as durations } from '../../animations/constants'

export interface BatteryIndicatorProps {
  /** Battery-aware configuration */
  config?: Partial<BatteryAwareConfig>
  /** Show detailed tooltip on hover */
  showTooltip?: boolean
  /** Position of the indicator */
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'inline'
  /** Show text label */
  showLabel?: boolean
  /** Compact mode (icon only) */
  compact?: boolean
  className?: string
}

/**
 * BatteryIndicator Component
 *
 * Displays current battery status with visual indicator.
 * Shows optimization level and recommendations when battery is low.
 *
 * @example
 * ```tsx
 * <BatteryIndicator
 *   position="top-right"
 *   showTooltip
 *   config={{ batterySaverThreshold: 0.2 }}
 * />
 * ```
 */
export function BatteryIndicator({
  config,
  showTooltip = true,
  position = 'inline',
  showLabel = true,
  compact = false,
  className,
}: BatteryIndicatorProps) {
  const {
    batteryStatus,
    isSupported,
    recommendations,
    batteryDescription,
    shouldEnableBatterySaver,
  } = useBatteryAware(config)

  const [showDetails, setShowDetails] = React.useState(false)

  if (!isSupported || !batteryStatus) {
    return null
  }

  const { level, charging } = batteryStatus
  const percentage = Math.round(level * 100)

  // Determine color based on level
  const getColor = () => {
    if (charging) return 'text-blue-500'
    if (level <= 0.05) return 'text-red-500'
    if (level <= 0.2) return 'text-orange-500'
    if (level <= 0.5) return 'text-yellow-500'
    return 'text-green-500'
  }

  // Battery icon SVG
  const BatteryIcon = () => {
    const fillWidth = Math.max(2, level * 18) // Minimum 2px width

    return (
      <svg
        className={cn('h-5 w-5', getColor())}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        {/* Battery outline */}
        <rect
          x="2"
          y="7"
          width="18"
          height="10"
          rx="2"
          strokeWidth="2"
          fill="none"
        />
        {/* Battery terminal */}
        <path d="M22 10v4" strokeWidth="2" strokeLinecap="round" />
        {/* Battery fill level */}
        <rect
          x="4"
          y="9"
          width={fillWidth}
          height="6"
          rx="1"
          fill="currentColor"
          className={cn(getColor())}
        />
        {/* Charging indicator */}
        {charging && (
          <motion.path
            d="M13 11l-2 3h2l-2 3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            stroke="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: durations.slower, repeat: Infinity }}
          />
        )}
      </svg>
    )
  }

  // Position classes
  const positionClasses = {
    'top-left': 'fixed top-4 left-4 z-50',
    'top-right': 'fixed top-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    inline: 'inline-flex',
  }

  const content = (
    <motion.div
      className={cn(
        'flex items-center gap-2 rounded-lg bg-background/95 backdrop-blur-sm',
        position !== 'inline' && 'shadow-lg border p-2',
        positionClasses[position],
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: durations.normal }}
      onMouseEnter={() => showTooltip && setShowDetails(true)}
      onMouseLeave={() => showTooltip && setShowDetails(false)}
    >
      <BatteryIcon />

      {!compact && showLabel && (
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-medium', getColor())}>
            {percentage}%
          </span>

          {shouldEnableBatterySaver && (
            <Badge variant="warning" className="text-xs">
              Low
            </Badge>
          )}

          {charging && (
            <Badge variant="default" className="text-xs">
              Charging
            </Badge>
          )}
        </div>
      )}

      {recommendations.level !== 'none' && !compact && (
        <Badge
          variant={
            recommendations.level === 'aggressive'
              ? 'destructive'
              : recommendations.level === 'moderate'
                ? 'warning'
                : 'secondary'
          }
          className="text-xs"
        >
          {recommendations.level}
        </Badge>
      )}
    </motion.div>
  )

  if (!showTooltip) {
    return content
  }

  return (
    <div className="relative">
      {content}

      {/* Tooltip with details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: durations.normal }}
            className={cn(
              'absolute z-50 min-w-[200px] rounded-lg border bg-popover p-3 shadow-lg',
              position.includes('right') ? 'right-0' : 'left-0',
              position.includes('top') ? 'top-full mt-2' : 'bottom-full mb-2'
            )}
          >
            <div className="space-y-2">
              <div className="text-sm font-semibold">{batteryDescription}</div>

              {batteryStatus.dischargingTime &&
                batteryStatus.dischargingTime !== Infinity &&
                !charging && (
                  <div className="text-xs text-muted-foreground">
                    ~{Math.round(batteryStatus.dischargingTime / 3600)} hours
                    remaining
                  </div>
                )}

              {batteryStatus.chargingTime &&
                batteryStatus.chargingTime !== Infinity &&
                charging && (
                  <div className="text-xs text-muted-foreground">
                    ~{Math.round(batteryStatus.chargingTime / 3600)} hours to
                    full
                  </div>
                )}

              {recommendations.level !== 'none' && (
                <div className="border-t pt-2 space-y-1">
                  <div className="text-xs font-medium">
                    Optimizations Active:
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {recommendations.disableAnimations && (
                      <li>• Animations reduced</li>
                    )}
                    {recommendations.throttleUpdates && (
                      <li>• Updates throttled</li>
                    )}
                    {recommendations.deferNonCritical && (
                      <li>• Non-critical tasks deferred</li>
                    )}
                    {recommendations.reduceStreaming && (
                      <li>• Streaming quality reduced</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

BatteryIndicator.displayName = 'BatteryIndicator'
