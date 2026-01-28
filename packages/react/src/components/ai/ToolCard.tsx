'use client'

/**
 * ToolCard Component
 *
 * Lightweight, color-coded tool execution indicator inspired by prompt-kit's
 * Tool component. Uses CSS classes from globals.css for consistent styling.
 *
 * This is a simpler alternative to ToolExecutionCard when you need a compact
 * inline display without collapsible sections.
 *
 * @example
 * ```tsx
 * // Pending state
 * <ToolCard name="web_search" status="pending" />
 *
 * // Running with args
 * <ToolCard
 *   name="code_interpreter"
 *   status="running"
 *   args={{ code: "print('hello')" }}
 * />
 *
 * // Success with result
 * <ToolCard
 *   name="calculator"
 *   status="success"
 *   result={{ answer: 42 }}
 * />
 *
 * // Error state
 * <ToolCard
 *   name="api_call"
 *   status="error"
 *   error="Request timeout"
 * />
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

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

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Size configurations
 */
const SIZE_CONFIG: Record<ToolCardSize, {
  container: string
  icon: string
  text: string
  badge: string
}> = {
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
const STATUS_CSS_CLASSES: Record<ToolCardStatus, string> = {
  pending: 'tool-pending',
  running: 'tool-running',
  success: 'tool-success',
  error: 'tool-error',
}

/**
 * Status labels
 */
const STATUS_LABELS: Record<ToolCardStatus, string> = {
  pending: 'Pending',
  running: 'Running',
  success: 'Complete',
  error: 'Failed',
}

// =============================================================================
// ICONS
// =============================================================================

const ToolIcon = React.memo(function ToolIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
})

ToolIcon.displayName = 'ToolIcon'

const SpinnerIcon = React.memo(function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('animate-spin', className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
})

SpinnerIcon.displayName = 'SpinnerIcon'

const CheckIcon = React.memo(function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
})

CheckIcon.displayName = 'CheckIcon'

const XIcon = React.memo(function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
})

XIcon.displayName = 'XIcon'

const ClockIcon = React.memo(function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
})

ClockIcon.displayName = 'ClockIcon'

const ChevronIcon = React.memo(function ChevronIcon({
  expanded,
  className,
}: {
  expanded?: boolean
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'transition-transform',
        expanded && 'rotate-180',
        className
      )}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
})

ChevronIcon.displayName = 'ChevronIcon'

/**
 * Get status icon
 */
function getStatusIcon(status: ToolCardStatus, className?: string): React.ReactNode {
  switch (status) {
    case 'pending':
      return <ClockIcon className={className} />
    case 'running':
      return <SpinnerIcon className={className} />
    case 'success':
      return <CheckIcon className={className} />
    case 'error':
      return <XIcon className={className} />
    default:
      return <ToolIcon className={className} />
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format duration
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

/**
 * Format JSON for preview
 */
function formatPreview(data: unknown, maxLength = 50): string {
  if (data === null || data === undefined) return ''
  if (typeof data === 'string') {
    return data.length > maxLength ? data.slice(0, maxLength) + '...' : data
  }
  try {
    const str = JSON.stringify(data)
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
  } catch {
    return String(data)
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ToolCard - Lightweight color-coded tool indicator
 *
 * A compact component for displaying tool execution status with
 * color-coded states. Uses CSS classes from globals.css.
 */
export function ToolCard({
  name,
  status,
  args,
  result,
  error,
  size = 'md',
  showArgs = false,
  showResult = false,
  duration,
  icon,
  className,
  disableAnimations = false,
  onClick,
  onToggleExpand,
  expanded = false,
}: ToolCardProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations
  const sizeConfig = SIZE_CONFIG[size]

  const isInteractive = !!onClick || !!onToggleExpand
  const hasExpandableContent = (showArgs && args) || (showResult && result) || error

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.out,
      }}
      className={cn(
        'tool-card',
        STATUS_CSS_CLASSES[status],
        sizeConfig.container,
        isInteractive && 'cursor-pointer',
        className
      )}
      onClick={onClick || (hasExpandableContent ? onToggleExpand : undefined)}
      role={isInteractive ? 'button' : 'article'}
      aria-label={`Tool: ${name}, Status: ${STATUS_LABELS[status]}`}
      aria-expanded={hasExpandableContent ? expanded : undefined}
    >
      {/* Main row */}
      <div className="flex items-center gap-2 min-w-0">
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
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && hasExpandableContent && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
              ease: EASING_FRAMER.out,
            }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2 border-t border-current/10 mt-2">
              {/* Args */}
              {showArgs && args && (
                <div className="space-y-1">
                  <span className="text-xs font-medium opacity-70">Input:</span>
                  <pre className="text-xs bg-black/5 dark:bg-white/5 rounded p-2 overflow-x-auto">
                    <code>{JSON.stringify(args, null, 2)}</code>
                  </pre>
                </div>
              )}

              {/* Result */}
              {showResult && result && (
                <div className="space-y-1">
                  <span className="text-xs font-medium opacity-70">Output:</span>
                  <pre className="text-xs bg-black/5 dark:bg-white/5 rounded p-2 overflow-x-auto">
                    <code>{JSON.stringify(result, null, 2)}</code>
                  </pre>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="space-y-1">
                  <span className="text-xs font-medium text-destructive">Error:</span>
                  <p className="text-xs text-destructive/90">{error}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

ToolCard.displayName = 'ToolCard'

// =============================================================================
// TOOL LIST COMPONENT
// =============================================================================

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

const GAP_CLASSES = {
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-3',
}

/**
 * ToolCardList - Display multiple tool cards
 */
export function ToolCardList({
  tools,
  size = 'sm',
  gap = 'sm',
  showArgs = false,
  showResult = false,
  className,
}: ToolCardListProps) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())

  const toggleExpand = React.useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  return (
    <div className={cn('flex flex-col', GAP_CLASSES[gap], className)}>
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          name={tool.name}
          status={tool.status}
          args={tool.args}
          result={tool.result}
          error={tool.error}
          duration={tool.duration}
          size={size}
          showArgs={showArgs}
          showResult={showResult}
          expanded={expandedIds.has(tool.id)}
          onToggleExpand={
            (showArgs && tool.args) || (showResult && tool.result) || tool.error
              ? () => toggleExpand(tool.id)
              : undefined
          }
        />
      ))}
    </div>
  )
}

ToolCardList.displayName = 'ToolCardList'

// =============================================================================
// HOOK
// =============================================================================

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

export function useToolCard({
  name,
  initialStatus = 'pending',
  initialArgs,
}: UseToolCardOptions): UseToolCardReturn {
  const [status, setStatus] = React.useState<ToolCardStatus>(initialStatus)
  const [args, setArgs] = React.useState<Record<string, unknown> | undefined>(initialArgs)
  const [result, setResult] = React.useState<unknown | undefined>(undefined)
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [duration, setDuration] = React.useState<number | undefined>(undefined)
  const startTimeRef = React.useRef<number | null>(null)

  const start = React.useCallback((newArgs?: Record<string, unknown>) => {
    startTimeRef.current = Date.now()
    setStatus('running')
    if (newArgs) setArgs(newArgs)
    setResult(undefined)
    setError(undefined)
    setDuration(undefined)
  }, [])

  const complete = React.useCallback((newResult: unknown) => {
    setStatus('success')
    setResult(newResult)
    if (startTimeRef.current) {
      setDuration(Date.now() - startTimeRef.current)
    }
  }, [])

  const fail = React.useCallback((errorMsg: string) => {
    setStatus('error')
    setError(errorMsg)
    if (startTimeRef.current) {
      setDuration(Date.now() - startTimeRef.current)
    }
  }, [])

  const reset = React.useCallback(() => {
    startTimeRef.current = null
    setStatus('pending')
    setResult(undefined)
    setError(undefined)
    setDuration(undefined)
  }, [])

  return {
    status,
    args,
    result,
    error,
    duration,
    start,
    complete,
    fail,
    reset,
    cardProps: {
      name,
      status,
      args,
      result,
      error,
      duration,
    },
  }
}
