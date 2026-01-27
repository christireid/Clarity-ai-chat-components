/**
 * ProgressBar Component
 *
 * Visual progress bar with shimmer effect for streaming
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

interface ProgressBarProps {
  progress: number
  size: StreamStatusProgressSize
  colors: ColorClasses
  prefersReducedMotion: boolean
  isStreaming: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size,
  colors,
  prefersReducedMotion,
  isStreaming,
}) => {
  const sizeConfig = SIZE_CONFIG[size]

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-full',
        colors.bg,
        sizeConfig.bar
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: prefersReducedMotion ? 0.1 : durations.normal,
          ease: EASING_FRAMER.out,
        }}
        className={cn(
          'h-full rounded-full transition-colors',
          colors.fill,
          isStreaming && !prefersReducedMotion && 'animate-pulse'
        )}
      />
      {/* Shimmer effect for streaming */}
      {isStreaming && !prefersReducedMotion && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: durations.slower,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      )}
    </div>
  )
}

ProgressBar.displayName = 'ProgressBar'
