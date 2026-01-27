/**
 * ToolExecutionCard Component
 *
 * Displays tool call execution status with input/output visualization,
 * duration timer, and action buttons. Inspired by assistant-ui and AG-UI
 * tool calling patterns.
 *
 * Features:
 * - Tool name and description display
 * - Status states: pending, executing, complete, error
 * - Collapsible input/output sections
 * - Live duration timer during execution
 * - Retry and cancel actions
 * - Full accessibility support
 * - Reduced motion support
 *
 * @example
 * ```tsx
 * <ToolExecutionCard
 *   tool={{
 *     id: 'tool_123',
 *     name: 'web_search',
 *     description: 'Search the web',
 *     status: 'executing',
 *     input: { query: 'React hooks' },
 *     output: null,
 *     startTime: new Date(),
 *   }}
 *   onRetry={() => handleRetry()}
 *   onCancel={() => handleCancel()}
 * />
 * ```
 *
 * @packageDocumentation
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  cn,
  useReducedMotion,
} from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  EASING_FRAMER,
} from '../../animations/constants'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Execution status of a tool
 */
export type ToolExecutionStatus = 'pending' | 'executing' | 'complete' | 'error'

/**
 * Tool execution data
 */
export interface ToolExecution {
  /** Unique identifier for the tool execution */
  id: string
  /** Tool name (e.g., 'web_search', 'code_interpreter') */
  name: string
  /** Human-readable description of what the tool does */
  description?: string
  /** Current execution status */
  status: ToolExecutionStatus
  /** Input parameters passed to the tool */
  input: Record<string, unknown> | null
  /** Output result from the tool */
  output: unknown | null
  /** Error message if status is 'error' */
  error?: string
  /** Timestamp when execution started */
  startTime?: Date
  /** Timestamp when execution completed */
  endTime?: Date
}

/**
 * Props for the ToolExecutionCard component
 */
export interface ToolExecutionCardProps {
  /** Tool execution data */
  tool: ToolExecution
  /** Callback when retry is requested (for error status) */
  onRetry?: () => void
  /** Callback when cancel is requested (for executing status) */
  onCancel?: () => void
  /** Whether input section is expanded by default */
  defaultInputExpanded?: boolean
  /** Whether output section is expanded by default */
  defaultOutputExpanded?: boolean
  /** Custom icon to display */
  icon?: React.ReactNode
  /** Additional CSS class */
  className?: string
  /** Compact mode for inline display */
  compact?: boolean
  /** Show timestamps */
  showTimestamps?: boolean
  /** Disable animations */
  disableAnimations?: boolean
}

// =============================================================================
// STATUS CONFIGURATION
// =============================================================================

interface StatusConfig {
  label: string
  badgeVariant: 'default' | 'info' | 'success' | 'warning' | 'destructive'
  iconColor: string
  bgColor: string
  borderColor: string
  ringColor: string
}

const STATUS_CONFIG: Record<ToolExecutionStatus, StatusConfig> = {
  pending: {
    label: 'Pending',
    badgeVariant: 'default',
    iconColor: 'text-muted-foreground',
    bgColor: 'bg-muted/30',
    borderColor: 'border-border/50',
    ringColor: '',
  },
  executing: {
    label: 'Executing',
    badgeVariant: 'info',
    iconColor: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/30',
    ringColor: 'ring-2 ring-primary/20',
  },
  complete: {
    label: 'Complete',
    badgeVariant: 'success',
    iconColor: 'text-success',
    bgColor: 'bg-success/5',
    borderColor: 'border-success/30',
    ringColor: '',
  },
  error: {
    label: 'Error',
    badgeVariant: 'destructive',
    iconColor: 'text-destructive',
    bgColor: 'bg-destructive/5',
    borderColor: 'border-destructive/30',
    ringColor: '',
  },
}

// =============================================================================
// ICONS
// =============================================================================

interface IconProps {
  size?: number
  className?: string
}

const ToolIcon: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const SpinnerIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('animate-spin', className)}
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

const CheckCircleIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const AlertCircleIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const ClockIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const ChevronDownIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const RefreshIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
)

const StopCircleIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
  </svg>
)

/**
 * Get the appropriate status icon
 */
function getStatusIcon(status: ToolExecutionStatus): React.ReactNode {
  const config = STATUS_CONFIG[status]

  switch (status) {
    case 'pending':
      return <ClockIcon size={16} className={config.iconColor} />
    case 'executing':
      return <SpinnerIcon size={16} className={config.iconColor} />
    case 'complete':
      return <CheckCircleIcon size={16} className={config.iconColor} />
    case 'error':
      return <AlertCircleIcon size={16} className={config.iconColor} />
    default:
      return <ClockIcon size={16} className={config.iconColor} />
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format duration in milliseconds to human-readable string
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

/**
 * Format timestamp to time string
 */
function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * Format JSON for display
 */
function formatJSON(data: unknown): string {
  if (data === null || data === undefined) return 'null'
  if (typeof data === 'string') return data
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Live duration timer hook
 */
function useDurationTimer(
  startTime: Date | undefined,
  endTime: Date | undefined,
  isActive: boolean
): string {
  const [duration, setDuration] = React.useState<number>(0)

  React.useEffect(() => {
    if (!startTime) {
      setDuration(0)
      return
    }

    // If we have an end time, calculate the final duration
    if (endTime) {
      setDuration(endTime.getTime() - startTime.getTime())
      return
    }

    // If not active, calculate duration from start to now and stop
    if (!isActive) {
      setDuration(Date.now() - startTime.getTime())
      return
    }

    // Active timer - update every 100ms
    const updateDuration = () => {
      setDuration(Date.now() - startTime.getTime())
    }

    updateDuration()
    const interval = setInterval(updateDuration, 100)

    return () => clearInterval(interval)
  }, [startTime, endTime, isActive])

  return formatDuration(duration)
}

/**
 * Collapsible data section
 */
interface CollapsibleDataSectionProps {
  title: string
  data: unknown
  defaultExpanded?: boolean
  variant?: 'input' | 'output' | 'error'
  prefersReducedMotion: boolean
}

const CollapsibleDataSection: React.FC<CollapsibleDataSectionProps> = ({
  title,
  data,
  defaultExpanded = false,
  variant = 'input',
  prefersReducedMotion,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const contentId = React.useId()
  const formattedData = formatJSON(data)
  const hasData = data !== null && data !== undefined

  if (!hasData) return null

  const variantStyles = {
    input: 'bg-muted/50 border-border/40',
    output: 'bg-success/5 border-success/20',
    error: 'bg-destructive/10 border-destructive/30',
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full items-center justify-between py-1.5',
          'text-xs font-medium text-muted-foreground',
          'hover:text-foreground transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 rounded-sm'
        )}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <span className="flex items-center gap-2">
          {variant === 'error' && (
            <AlertCircleIcon size={14} className="text-destructive" />
          )}
          {title}
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : durations.fast,
            ease: EASING_FRAMER.out,
          }}
        >
          <ChevronDownIcon size={14} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={contentId}
            initial={
              prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { height: 'auto', opacity: 1 }
            }
            exit={
              prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.1 : durations.normal,
              ease: EASING_FRAMER.out,
            }}
            className="overflow-hidden"
          >
            <pre
              className={cn(
                'rounded-lg border p-3 text-xs overflow-x-auto',
                'max-h-64 overflow-y-auto',
                variantStyles[variant]
              )}
            >
              <code
                className={cn(
                  'font-mono whitespace-pre-wrap break-words',
                  variant === 'error' ? 'text-destructive' : 'text-foreground'
                )}
              >
                {formattedData}
              </code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ToolExecutionCard - Display tool call execution status
 *
 * A comprehensive component for visualizing tool/function call execution
 * in AI chat interfaces. Supports real-time status updates, collapsible
 * input/output sections, and action buttons for retry and cancel.
 */
export function ToolExecutionCard({
  tool,
  onRetry,
  onCancel,
  defaultInputExpanded = false,
  defaultOutputExpanded = true,
  icon,
  className,
  compact = false,
  showTimestamps = false,
  disableAnimations = false,
}: ToolExecutionCardProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations
  const config = STATUS_CONFIG[tool.status]

  // Live duration timer
  const isExecuting = tool.status === 'executing'
  const duration = useDurationTimer(tool.startTime, tool.endTime, isExecuting)

  // Determine what sections to show
  const hasInput = tool.input !== null && tool.input !== undefined
  const hasOutput = tool.output !== null && tool.output !== undefined
  const hasError = tool.status === 'error' && tool.error

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.normal,
        ease: EASING_FRAMER.out,
      }}
      className={className}
      role="article"
      aria-label={`Tool execution: ${tool.name}, Status: ${config.label}`}
    >
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          'shadow-sm hover:shadow-md',
          config.borderColor,
          config.ringColor
        )}
      >
        <CardHeader className={cn(compact ? 'py-3 px-4' : 'pb-3')}>
          <div className="flex items-start justify-between gap-4">
            {/* Tool Info */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Icon */}
              <div
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-lg shadow-sm',
                  compact ? 'h-8 w-8' : 'h-10 w-10',
                  config.bgColor,
                  'border',
                  config.borderColor
                )}
              >
                {icon || (
                  <ToolIcon
                    size={compact ? 16 : 20}
                    className={config.iconColor}
                  />
                )}
              </div>

              {/* Tool Name & Status */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className={cn(
                      'font-semibold text-foreground truncate',
                      compact ? 'text-sm' : 'text-base'
                    )}
                  >
                    {tool.name}
                  </h4>
                  <Badge
                    variant={config.badgeVariant}
                    pulse={isExecuting}
                    className="gap-1"
                  >
                    {getStatusIcon(tool.status)}
                    <span>{config.label}</span>
                  </Badge>
                </div>

                {/* Description */}
                {tool.description && !compact && (
                  <p className="text-xs text-muted-foreground/80 line-clamp-2">
                    {tool.description}
                  </p>
                )}

                {/* Metadata row */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                  {/* Duration */}
                  {tool.startTime && (
                    <span
                      className="flex items-center gap-1 tabular-nums"
                      aria-label={`Duration: ${duration}`}
                    >
                      <ClockIcon size={12} />
                      {duration}
                    </span>
                  )}

                  {/* Timestamps */}
                  {showTimestamps && tool.startTime && (
                    <span className="tabular-nums">
                      Started: {formatTimestamp(tool.startTime)}
                    </span>
                  )}
                  {showTimestamps && tool.endTime && (
                    <span className="tabular-nums">
                      Ended: {formatTimestamp(tool.endTime)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 shrink-0">
              {/* Cancel button for executing state */}
              {isExecuting && onCancel && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCancel}
                  className="gap-1.5"
                  aria-label="Cancel tool execution"
                >
                  <StopCircleIcon size={14} />
                  {!compact && <span>Cancel</span>}
                </Button>
              )}

              {/* Retry button for error state */}
              {tool.status === 'error' && onRetry && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onRetry}
                  className="gap-1.5"
                  aria-label="Retry tool execution"
                >
                  <RefreshIcon size={14} />
                  {!compact && <span>Retry</span>}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Content - Input/Output Sections */}
        {(hasInput || hasOutput || hasError) && (
          <CardContent
            className={cn('space-y-3', compact ? 'pt-0 pb-3' : 'pt-0')}
          >
            {/* Input Section */}
            {hasInput && (
              <CollapsibleDataSection
                title="Input Parameters"
                data={tool.input}
                defaultExpanded={defaultInputExpanded}
                variant="input"
                prefersReducedMotion={prefersReducedMotion}
              />
            )}

            {/* Output Section */}
            {hasOutput && (
              <CollapsibleDataSection
                title="Output Result"
                data={tool.output}
                defaultExpanded={defaultOutputExpanded}
                variant="output"
                prefersReducedMotion={prefersReducedMotion}
              />
            )}

            {/* Error Section */}
            {hasError && (
              <CollapsibleDataSection
                title="Error Details"
                data={tool.error}
                defaultExpanded={true}
                variant="error"
                prefersReducedMotion={prefersReducedMotion}
              />
            )}
          </CardContent>
        )}

        {/* Executing indicator bar */}
        {isExecuting && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: durations.slower,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </Card>
    </motion.div>
  )
}

ToolExecutionCard.displayName = 'ToolExecutionCard'

// =============================================================================
// CONVENIENCE HOOK
// =============================================================================

/**
 * Hook for managing tool execution state
 */
export interface UseToolExecutionOptions {
  /** Initial tool data */
  initialTool?: Partial<ToolExecution>
  /** Auto-start execution on mount */
  autoStart?: boolean
}

export interface UseToolExecutionReturn {
  /** Current tool state */
  tool: ToolExecution
  /** Start execution */
  start: () => void
  /** Complete execution with result */
  complete: (output: unknown) => void
  /** Mark execution as failed */
  fail: (error: string) => void
  /** Reset to pending state */
  reset: () => void
  /** Update tool data */
  update: (updates: Partial<ToolExecution>) => void
  /** Whether tool is currently executing */
  isExecuting: boolean
  /** Whether tool has completed (success or error) */
  isComplete: boolean
}

export function useToolExecution({
  initialTool,
  autoStart = false,
}: UseToolExecutionOptions = {}): UseToolExecutionReturn {
  const [tool, setTool] = React.useState<ToolExecution>(() => ({
    id: initialTool?.id || crypto.randomUUID(),
    name: initialTool?.name || 'unknown',
    description: initialTool?.description,
    status: autoStart ? 'executing' : initialTool?.status || 'pending',
    input: initialTool?.input || null,
    output: initialTool?.output || null,
    error: initialTool?.error,
    startTime: autoStart ? new Date() : initialTool?.startTime,
    endTime: initialTool?.endTime,
  }))

  const start = React.useCallback(() => {
    setTool((prev) => ({
      ...prev,
      status: 'executing',
      startTime: new Date(),
      endTime: undefined,
      output: null,
      error: undefined,
    }))
  }, [])

  const complete = React.useCallback((output: unknown) => {
    setTool((prev) => ({
      ...prev,
      status: 'complete',
      output,
      endTime: new Date(),
      error: undefined,
    }))
  }, [])

  const fail = React.useCallback((error: string) => {
    setTool((prev) => ({
      ...prev,
      status: 'error',
      error,
      endTime: new Date(),
    }))
  }, [])

  const reset = React.useCallback(() => {
    setTool((prev) => ({
      ...prev,
      status: 'pending',
      output: null,
      error: undefined,
      startTime: undefined,
      endTime: undefined,
    }))
  }, [])

  const update = React.useCallback((updates: Partial<ToolExecution>) => {
    setTool((prev) => ({ ...prev, ...updates }))
  }, [])

  return {
    tool,
    start,
    complete,
    fail,
    reset,
    update,
    isExecuting: tool.status === 'executing',
    isComplete: tool.status === 'complete' || tool.status === 'error',
  }
}
