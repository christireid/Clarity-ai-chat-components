/**
 * ToolCard Types
 *
 * Type definitions for ToolCard components
 * @packageDocumentation
 */

/**
 * Tool execution status
 */
export type ToolCardStatus = 'pending' | 'running' | 'success' | 'error'

/**
 * Tool card size
 */
export type ToolCardSize = 'sm' | 'md' | 'lg'

/**
 * Props for ToolCard component
 */
export interface ToolCardProps {
  /** Tool name */
  name: string
  /** Current status */
  status: ToolCardStatus
  /** Tool arguments/input */
  args?: Record<string, unknown>
  /** Result data */
  result?: unknown
  /** Error message */
  error?: string
  /** Size variant */
  size?: ToolCardSize
  /** Show arguments */
  showArgs?: boolean
  /** Show result */
  showResult?: boolean
  /** Duration in ms */
  duration?: number
  /** Custom icon */
  icon?: React.ReactNode
  /** Additional CSS class */
  className?: string
  /** Disable animations */
  disableAnimations?: boolean
  /** Click handler */
  onClick?: () => void
  /** Expand/collapse handler */
  onToggleExpand?: () => void
  /** Whether expanded */
  expanded?: boolean
}

/**
 * Props for ToolCardList
 */
export interface ToolCardListProps {
  /** Tools to display */
  tools: Array<{
    id: string
    name: string
    status: ToolCardStatus
    args?: Record<string, unknown>
    result?: unknown
    error?: string
    duration?: number
  }>
  /** Size for all cards */
  size?: ToolCardSize
  /** Gap between cards */
  gap?: 'sm' | 'md' | 'lg'
  /** Show args on all cards */
  showArgs?: boolean
  /** Show results on all cards */
  showResult?: boolean
  /** Additional CSS class */
  className?: string
}

/**
 * Hook for managing ToolCard state
 */
export interface UseToolCardOptions {
  /** Tool name */
  name: string
  /** Initial status */
  initialStatus?: ToolCardStatus
  /** Initial args */
  initialArgs?: Record<string, unknown>
}

export interface UseToolCardReturn {
  /** Current status */
  status: ToolCardStatus
  /** Current args */
  args: Record<string, unknown> | undefined
  /** Result data */
  result: unknown | undefined
  /** Error message */
  error: string | undefined
  /** Duration in ms */
  duration: number | undefined
  /** Start execution */
  start: (args?: Record<string, unknown>) => void
  /** Complete with result */
  complete: (result: unknown) => void
  /** Fail with error */
  fail: (error: string) => void
  /** Reset to pending */
  reset: () => void
  /** Props for ToolCard */
  cardProps: {
    name: string
    status: ToolCardStatus
    args?: Record<string, unknown>
    result?: unknown
    error?: string
    duration?: number
  }
}

/**
 * Size configurations
 */
export interface SizeConfig {
  container: string
  icon: string
  text: string
  badge: string
}
