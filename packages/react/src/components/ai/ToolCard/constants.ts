/**
 * ToolCard Constants
 *
 * Configuration constants for ToolCard components
 * @packageDocumentation
 */

import type { ToolCardStatus, ToolCardSize, SizeConfig } from './types'

/**
 * Size configurations
 */
export const SIZE_CONFIG: Record<ToolCardSize, SizeConfig> = {
  sm: {
    container: 'px-2.5 py-1.5 gap-2',
    icon: 'w-4 h-4',
    text: 'text-xs',
    badge: 'text-[10px] px-1.5 py-0.5',
  },
  md: {
    container: 'px-3 py-2 gap-2.5',
    icon: 'w-5 h-5',
    text: 'text-sm',
    badge: 'text-xs px-2 py-0.5',
  },
  lg: {
    container: 'px-4 py-3 gap-3',
    icon: 'w-6 h-6',
    text: 'text-base',
    badge: 'text-sm px-2.5 py-1',
  },
}

/**
 * Status CSS class mapping (from globals.css)
 */
export const STATUS_CSS_CLASSES: Record<ToolCardStatus, string> = {
  pending: 'tool-pending',
  running: 'tool-running',
  success: 'tool-success',
  error: 'tool-error',
}

/**
 * Status labels
 */
export const STATUS_LABELS: Record<ToolCardStatus, string> = {
  pending: 'Pending',
  running: 'Running',
  success: 'Complete',
  error: 'Failed',
}

/**
 * Gap classes for ToolCardList
 */
export const GAP_CLASSES = {
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-3',
}
