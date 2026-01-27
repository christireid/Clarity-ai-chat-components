/**
 * Utility functions for StreamingProgress component
 */

import type {
  StreamStatusProgressColor,
  ColorClasses,
  SizeConfig,
  StreamStatusProgressSize,
} from './StreamingProgress.types'

/**
 * Format time in milliseconds to human-readable string
 */
export function formatTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

/**
 * Format token count with K/M suffix for large numbers
 */
export function formatTokenCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(2)}M`
}

/**
 * Get color classes based on variant and progress
 */
export function getColorClasses(
  color: StreamStatusProgressColor,
  progress: number,
  thresholds: { warning: number; error: number },
  hasError: boolean
): ColorClasses {
  if (hasError) {
    return {
      bg: 'bg-destructive/20',
      text: 'text-destructive',
      fill: 'bg-destructive',
    }
  }

  if (color === 'auto') {
    if (progress >= thresholds.error) {
      return {
        bg: 'bg-destructive/20',
        text: 'text-destructive',
        fill: 'bg-destructive',
      }
    }
    if (progress >= thresholds.warning) {
      return {
        bg: 'bg-warning/20',
        text: 'text-warning',
        fill: 'bg-warning',
      }
    }
    return {
      bg: 'bg-primary/20',
      text: 'text-primary',
      fill: 'bg-primary',
    }
  }

  switch (color) {
    case 'success':
      return {
        bg: 'bg-success/20',
        text: 'text-success',
        fill: 'bg-success',
      }
    case 'warning':
      return {
        bg: 'bg-warning/20',
        text: 'text-warning',
        fill: 'bg-warning',
      }
    case 'error':
      return {
        bg: 'bg-destructive/20',
        text: 'text-destructive',
        fill: 'bg-destructive',
      }
    default:
      return {
        bg: 'bg-primary/20',
        text: 'text-primary',
        fill: 'bg-primary',
      }
  }
}

/**
 * Size configuration map
 */
export const SIZE_CONFIG: Record<StreamStatusProgressSize, SizeConfig> = {
  sm: {
    bar: 'h-1.5',
    circular: 32,
    strokeWidth: 3,
    text: 'text-xs',
    gap: 'gap-1.5',
    padding: 'px-2 py-1',
  },
  md: {
    bar: 'h-2',
    circular: 48,
    strokeWidth: 4,
    text: 'text-sm',
    gap: 'gap-2',
    padding: 'px-3 py-1.5',
  },
  lg: {
    bar: 'h-3',
    circular: 64,
    strokeWidth: 5,
    text: 'text-base',
    gap: 'gap-3',
    padding: 'px-4 py-2',
  },
}

/**
 * Guard against invalid progress values
 */
export function normalizeProgress(progress: number): number {
  return Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 100) : 0
}

/**
 * Status colors for field status
 */
export const FIELD_STATUS_COLORS = {
  pending: 'bg-muted/40',
  streaming: 'bg-primary',
  complete: 'bg-success',
  error: 'bg-destructive',
} as const

/**
 * Status text colors for field status
 */
export const FIELD_STATUS_TEXT_COLORS = {
  pending: 'text-muted-foreground',
  streaming: 'text-primary',
  complete: 'text-success',
  error: 'text-destructive',
} as const
