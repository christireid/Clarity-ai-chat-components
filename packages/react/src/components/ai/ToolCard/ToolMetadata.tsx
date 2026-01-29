'use client'

/**
 * ToolMetadata Component
 *
 * Displays duration and expandable content metadata
 * @packageDocumentation
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { ChevronIcon } from './icons'
import { formatDuration } from './utils'
import type { ToolCardSize, SizeConfig } from './types'

export interface ToolMetadataProps {
  /** Duration in ms */
  duration?: number
  /** Size variant */
  size: ToolCardSize
  /** Size configuration */
  sizeConfig: SizeConfig
  /** Whether has expandable content */
  hasExpandableContent: boolean
  /** Whether expanded */
  expanded: boolean
  /** Toggle expand handler */
  onToggleExpand?: () => void
}

/**
 * ToolMetadata - Duration and expand controls
 */
export function ToolMetadata({
  duration,
  size,
  sizeConfig,
  hasExpandableContent,
  expanded,
  onToggleExpand,
}: ToolMetadataProps) {
  return (
    <>
      {/* Duration */}
      {duration !== undefined && (
        <span className={cn(
          'text-muted-foreground tabular-nums flex-shrink-0',
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        )}>
          {formatDuration(duration)}
        </span>
      )}

      {/* Expand chevron */}
      {hasExpandableContent && onToggleExpand && (
        <ChevronIcon
          expanded={expanded}
          className={cn('ml-auto flex-shrink-0', sizeConfig.icon)}
        />
      )}
    </>
  )
}

ToolMetadata.displayName = 'ToolMetadata'
