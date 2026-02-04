/**
 * Configuration for Think component
 * @packageDocumentation
 */

import * as React from 'react'
import type { ThinkVariant, ThinkStepStatus } from './types'

/**
 * Variant configurations
 */
export const VARIANT_CONFIG: Record<ThinkVariant, {
  container: string
  header: string
  content: string
}> = {
  default: {
    container: 'reasoning-container',
    header: 'reasoning-header',
    content: 'reasoning-content',
  },
  minimal: {
    container: 'rounded-lg overflow-hidden',
    header: 'flex items-center gap-2 px-2 py-1.5 cursor-pointer',
    content: 'px-2 py-2 text-sm',
  },
  bordered: {
    container: 'border rounded-xl overflow-hidden shadow-sm',
    header: 'flex items-center justify-between px-4 py-3 bg-muted/30 cursor-pointer',
    content: 'px-4 py-3 bg-card',
  },
}

/**
 * Step status icons and colors
 */
export const STEP_STATUS_CONFIG: Record<ThinkStepStatus, {
  icon: React.ReactNode
  color: string
  dotColor: string
}> = {
  pending: {
    icon: null,
    color: 'text-muted-foreground',
    dotColor: 'bg-muted-foreground/50',
  },
  active: {
    icon: (
      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    ),
    color: 'text-primary',
    dotColor: 'bg-primary',
  },
  complete: {
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    ),
    color: 'text-success',
    dotColor: 'bg-success',
  },
  error: {
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </svg>
    ),
    color: 'text-destructive',
    dotColor: 'bg-destructive',
  },
}
