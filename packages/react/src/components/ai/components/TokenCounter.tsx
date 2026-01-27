/**
 * TokenCounter Component
 *
 * Displays token statistics with optional throughput
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { AnimatedDots } from '../../ui/AnimatedDots'
import type {
  StreamStatusTokens,
  StreamStatusProgressSize,
  ColorClasses,
} from '../StreamingProgress.types'
import { SIZE_CONFIG, formatTokenCount } from '../StreamingProgress.utils'

interface TokenCounterProps {
  tokens: StreamStatusTokens
  showTokenCount: boolean
  showThroughput: boolean
  size: StreamStatusProgressSize
  colors: ColorClasses
  isStreaming: boolean
}

export const TokenCounter: React.FC<TokenCounterProps> = ({
  tokens,
  showTokenCount,
  showThroughput,
  size,
  colors,
  isStreaming,
}) => {
  const sizeConfig = SIZE_CONFIG[size]

  return (
    <div
      className={cn(
        'flex items-center flex-wrap',
        sizeConfig.gap,
        sizeConfig.text
      )}
    >
      {showTokenCount && (
        <span className="text-muted-foreground tabular-nums">
          <span className={cn('font-medium', colors.text)}>
            {formatTokenCount(tokens.received)}
          </span>
          {tokens.estimated && (
            <>
              <span className="mx-0.5">/</span>
              <span>{formatTokenCount(tokens.estimated)}</span>
            </>
          )}
          <span className="ml-1">tokens</span>
        </span>
      )}
      {showThroughput && tokens.tokensPerSecond !== undefined && (
        <span className="text-muted-foreground/80 tabular-nums">
          {tokens.tokensPerSecond.toFixed(1)} tok/s
          {isStreaming && (
            <AnimatedDots
              variant="fade"
              size="sm"
              className="ml-1 inline-flex"
            />
          )}
        </span>
      )}
    </div>
  )
}

TokenCounter.displayName = 'TokenCounter'
