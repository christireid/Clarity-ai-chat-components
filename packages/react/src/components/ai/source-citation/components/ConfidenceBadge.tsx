/**
 * Confidence badge component for displaying source confidence scores
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { SIZE_CONFIG } from '../constants'
import { getConfidenceDisplay } from '../utils'
import type { SourceCitationSize } from '../types'

export interface ConfidenceBadgeProps {
  confidence: number
  size?: SourceCitationSize
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  size = 'md',
}) => {
  const { label, color, bgColor } = getConfidenceDisplay(confidence)
  const sizeConfig = SIZE_CONFIG[size]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeConfig.badge,
        color,
        bgColor
      )}
      title={`${Math.round(confidence * 100)}% relevance`}
    >
      {label}
    </span>
  )
}
