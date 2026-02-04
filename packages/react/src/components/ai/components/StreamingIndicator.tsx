/**
 * StreamingIndicator Component
 *
 * Displays time statistics for streaming progress
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { StreamStatusProgressSize } from '../StreamingProgress.types'
import { SIZE_CONFIG, formatTime } from '../StreamingProgress.utils'

interface StreamingIndicatorProps {
  showTimeRemaining: boolean
  timeRemaining?: number
  showTimeElapsed?: boolean
  timeElapsed?: number
  showTimeToFirstToken: boolean
  timeToFirstToken?: number
  size: StreamStatusProgressSize
  isComplete: boolean
}

export const StreamingIndicator: React.FC<StreamingIndicatorProps> = ({
  showTimeRemaining,
  timeRemaining,
  showTimeElapsed,
  timeElapsed,
  showTimeToFirstToken,
  timeToFirstToken,
  size,
  isComplete,
}) => {
  const sizeConfig = SIZE_CONFIG[size]

  const items: { label: string; value: string }[] = []

  if (showTimeRemaining && timeRemaining !== undefined && !isComplete) {
    items.push({ label: 'Remaining', value: formatTime(timeRemaining) })
  }

  if (showTimeElapsed && timeElapsed !== undefined) {
    items.push({ label: 'Elapsed', value: formatTime(timeElapsed) })
  }

  if (showTimeToFirstToken && timeToFirstToken !== undefined) {
    items.push({ label: 'TTFT', value: formatTime(timeToFirstToken) })
  }

  if (items.length === 0) return null

  return (
    <div
      className={cn(
        'flex items-center flex-wrap',
        sizeConfig.gap,
        sizeConfig.text
      )}
    >
      {items.map((item, index) => (
        <span
          key={item.label}
          className="text-muted-foreground/70 tabular-nums"
        >
          {index > 0 && <span className="mx-1.5">|</span>}
          <span className="text-muted-foreground/70">{item.label}:</span>{' '}
          <span className="font-medium">{item.value}</span>
        </span>
      ))}
    </div>
  )
}

StreamingIndicator.displayName = 'StreamingIndicator'
