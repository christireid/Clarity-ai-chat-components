/**
 * useStreamingProgress Hook
 *
 * Manages streaming progress state and calculations
 */

import { useMemo } from 'react'
import { useReducedMotion } from '@clarity-chat/primitives'
import type {
  StreamStatusProgressProps,
  ColorClasses,
  SizeConfig,
} from '../StreamingProgress.types'
import {
  getColorClasses,
  SIZE_CONFIG,
  normalizeProgress,
} from '../StreamingProgress.utils'

interface UseStreamingProgressOptions {
  progress: number
  color: StreamStatusProgressProps['color']
  size: StreamStatusProgressProps['size']
  hasError: boolean
  thresholds: { warning: number; error: number }
  disableAnimations: boolean
  tokens?: StreamStatusProgressProps['tokens']
  ariaLabel?: string
}

interface UseStreamingProgressReturn {
  prefersReducedMotion: boolean
  safeProgress: number
  colors: ColorClasses
  sizeConfig: SizeConfig
  accessibleLabel: string
}

/**
 * Custom hook for managing streaming progress state
 */
export function useStreamingProgress({
  progress,
  color = 'default',
  size = 'md',
  hasError,
  thresholds,
  disableAnimations,
  tokens,
  ariaLabel,
}: UseStreamingProgressOptions): UseStreamingProgressReturn {
  const reducedMotion = useReducedMotion()
  const prefersReducedMotion = reducedMotion || disableAnimations

  // Guard against invalid values
  const safeProgress = normalizeProgress(progress)

  // Get color classes based on current state
  const colors = useMemo(
    () => getColorClasses(color, safeProgress, thresholds, hasError),
    [color, safeProgress, thresholds, hasError]
  )

  // Get size configuration
  const sizeConfig = SIZE_CONFIG[size]

  // Create accessible label
  const accessibleLabel = useMemo(
    () =>
      ariaLabel ||
      `Streaming progress: ${Math.round(safeProgress)}%${tokens ? `, ${tokens.received} tokens received` : ''}`,
    [ariaLabel, safeProgress, tokens]
  )

  return {
    prefersReducedMotion,
    safeProgress,
    colors,
    sizeConfig,
    accessibleLabel,
  }
}
