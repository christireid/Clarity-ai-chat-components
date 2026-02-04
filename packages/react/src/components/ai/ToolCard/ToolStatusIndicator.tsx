'use client'

/**
 * ToolStatusIndicator Component
 *
 * Visual indicator for tool execution status with icon and badge
 * @packageDocumentation
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { getStatusIcon } from './icons'
import { STATUS_LABELS } from './constants'
import type { ToolCardStatus, ToolCardSize, SizeConfig } from './types'

export interface ToolStatusIndicatorProps {
  /** Current status */
  status: ToolCardStatus
  /** Size configuration */
  sizeConfig: SizeConfig
  /** Custom icon */
  icon?: React.ReactNode
  /** Tool name */
  name: string
}

/**
 * ToolStatusIndicator - Status icon and badge display
 */
export function ToolStatusIndicator({
  status,
  sizeConfig,
  icon,
  name,
}: ToolStatusIndicatorProps) {
  return (
    <>
      {/* Status icon */}
      <span className="tool-icon flex-shrink-0">
        {icon || getStatusIcon(status, sizeConfig.icon)}
      </span>

      {/* Tool name */}
      <span className={cn('tool-name font-medium truncate', sizeConfig.text)}>
        {name}
      </span>

      {/* Status badge */}
      <span className={cn(
        'tool-badge rounded-full font-medium flex-shrink-0',
        sizeConfig.badge
      )}>
        {STATUS_LABELS[status]}
      </span>
    </>
  )
}

ToolStatusIndicator.displayName = 'ToolStatusIndicator'
