/**
 * CircularProgress Component
 *
 * Circular progress indicator with optional percentage display
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  EASING_FRAMER,
} from '../../../animations/constants'
import type { StreamStatusProgressSize, ColorClasses } from '../StreamingProgress.types'
import { SIZE_CONFIG } from '../StreamingProgress.utils'

interface CircularProgressProps {
  progress: number
  size: StreamStatusProgressSize
  colors: ColorClasses
  prefersReducedMotion: boolean
  isStreaming: boolean
  showPercentage: boolean
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size,
  colors,
  prefersReducedMotion,
  isStreaming,
  showPercentage,
}) => {
  const sizeConfig = SIZE_CONFIG[size]
  const circleSize = sizeConfig.circular
  const strokeWidth = sizeConfig.strokeWidth
  const radius = (circleSize - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: circleSize, height: circleSize }}
    >
      <svg
        className="transform -rotate-90"
        width={circleSize}
        height={circleSize}
      >
        {/* Background circle */}
        <circle
          className={cn(
            'transition-colors',
            colors.bg.replace('bg-', 'stroke-').replace('/20', '/40')
          )}
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: prefersReducedMotion ? 0.1 : durations.normal,
            ease: EASING_FRAMER.out,
          }}
          className={cn(
            'transition-colors',
            colors.fill.replace('bg-', 'stroke-')
          )}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {showPercentage && (
        <span
          className={cn(
            'absolute font-semibold tabular-nums',
            colors.text,
            size === 'sm'
              ? 'text-[10px]'
              : size === 'md'
                ? 'text-xs'
                : 'text-sm'
          )}
        >
          {Math.round(progress)}
        </span>
      )}
      {/* Spinning indicator for streaming */}
      {isStreaming && !prefersReducedMotion && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: durations.slower,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(transparent 0deg, transparent 270deg, currentColor 360deg)`,
            opacity: 0.3,
          }}
        />
      )}
    </div>
  )
}

CircularProgress.displayName = 'CircularProgress'
