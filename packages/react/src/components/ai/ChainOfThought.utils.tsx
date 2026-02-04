/**
 * Utility functions for ChainOfThought component
 *
 * This file contains helper functions and configuration objects.
 */

import * as React from 'react'
import type {
  ChainOfThoughtStepStatus,
  StatusConfig,
} from './ChainOfThought.types'
import {
  CheckCircleIcon,
  CircleIcon,
  SpinnerIcon,
  AlertCircleIcon,
  SkipIcon,
} from './components/ChainOfThoughtIcons'

/**
 * Status configuration mapping
 */
export const STATUS_CONFIG: Record<ChainOfThoughtStepStatus, StatusConfig> = {
  pending: {
    label: 'Pending',
    badgeVariant: 'default',
    iconColor: 'text-muted-foreground',
    bgColor: 'bg-muted/30',
    borderColor: 'border-muted/50',
  },
  'in-progress': {
    label: 'In Progress',
    badgeVariant: 'info',
    iconColor: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/30',
  },
  complete: {
    label: 'Complete',
    badgeVariant: 'success',
    iconColor: 'text-success',
    bgColor: 'bg-success/5',
    borderColor: 'border-success/30',
  },
  error: {
    label: 'Error',
    badgeVariant: 'destructive',
    iconColor: 'text-destructive',
    bgColor: 'bg-destructive/5',
    borderColor: 'border-destructive/30',
  },
  skipped: {
    label: 'Skipped',
    badgeVariant: 'default',
    iconColor: 'text-muted-foreground/60',
    bgColor: 'bg-muted/20',
    borderColor: 'border-muted/30',
  },
}

/**
 * Get the appropriate icon for a step status
 */
export function getStatusIcon(
  status: ChainOfThoughtStepStatus,
  customIcon?: React.ReactNode
): React.ReactNode {
  if (customIcon) return customIcon

  const iconProps = { size: 18 }
  const config = STATUS_CONFIG[status]

  switch (status) {
    case 'complete':
      return <CheckCircleIcon {...iconProps} className={config.iconColor} />
    case 'in-progress':
      return <SpinnerIcon {...iconProps} className={config.iconColor} />
    case 'error':
      return <AlertCircleIcon {...iconProps} className={config.iconColor} />
    case 'skipped':
      return <SkipIcon {...iconProps} className={config.iconColor} />
    case 'pending':
    default:
      return <CircleIcon {...iconProps} className={config.iconColor} />
  }
}

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

/**
 * Format timestamp to time string
 */
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
