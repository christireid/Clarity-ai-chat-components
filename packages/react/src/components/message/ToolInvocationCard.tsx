/**
 * Tool Invocation Card Component
 *
 * Displays function/tool calls with approval flow and result visualization
 *
 * @example
 * ```tsx
 * <ToolInvocationCard
 *   toolCall={toolCall}
 *   status="pending"
 *   requiresApproval
 *   onApprove={handleApprove}
 *   onReject={handleReject}
 * />
 * ```
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'
import type { ToolCall } from '../../adapters/types'

export type ToolStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'executing'
  | 'success'
  | 'error'

export interface ToolInvocationCardProps {
  /** Tool call data */
  toolCall: ToolCall
  /** Current status */
  status?: ToolStatus
  /** Tool execution result */
  result?: any
  /** Error message if execution failed */
  error?: string
  /** Whether to show approval buttons */
  requiresApproval?: boolean
  /** Callback when tool is approved */
  onApprove?: (toolCall: ToolCall) => void
  /** Callback when tool is rejected */
  onReject?: (toolCall: ToolCall) => void
  /** Callback to retry failed tool */
  onRetry?: (toolCall: ToolCall) => void
  /** Show formatted JSON for arguments */
  formatArguments?: boolean
  /** Show result in expandable section */
  expandableResult?: boolean
  /** Additional CSS class */
  className?: string
}

const getStatusBadgeVariant = (
  status: ToolStatus
): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'approved':
    case 'executing':
      return 'info'
    case 'success':
      return 'success'
    case 'error':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const getStatusLabel = (status: ToolStatus): string => {
  switch (status) {
    case 'pending':
      return 'Awaiting approval'
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Rejected'
    case 'executing':
      return 'Executing...'
    case 'success':
      return 'Completed'
    case 'error':
      return 'Failed'
    default:
      return 'Unknown'
  }
}

export function ToolInvocationCard({
  toolCall,
  status = 'pending',
  result,
  error,
  requiresApproval = false,
  onApprove,
  onReject,
  onRetry,
  formatArguments = true,
  expandableResult = true,
  className = '',
}: ToolInvocationCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isResultExpanded, setIsResultExpanded] = React.useState(false)
  const [isArgsExpanded, setIsArgsExpanded] = React.useState(false)

  const parseArguments = () => {
    try {
      const parsed = JSON.parse(toolCall.function.arguments)
      return formatArguments
        ? JSON.stringify(parsed, null, 2)
        : toolCall.function.arguments
    } catch {
      return toolCall.function.arguments
    }
  }

  const formatResult = () => {
    if (error) return error
    if (typeof result === 'string') return result
    try {
      return JSON.stringify(result, null, 2)
    } catch {
      return String(result)
    }
  }

  return (
    <motion.div
      {...(prefersReducedMotion
        ? ANIMATION_PRESETS.fadeIn
        : ANIMATION_PRESETS.slideUp)}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              // Framer Motion 12: Spring entrance for tool card
              type: 'spring',
              damping: 22,
              stiffness: 300,
            }
      }
      viewport={{ once: true }}
      className={className}
    >
      <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-150 ease-out">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            {/* Tool Info */}
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>

              {/* Tool Name & Status */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="font-bold text-base text-foreground truncate">
                    {toolCall.function.name}
                  </h4>
                  <Badge
                    variant={getStatusBadgeVariant(status)}
                    pulse={status === 'executing'}
                  >
                    {getStatusLabel(status)}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground/90">
                  Tool Invocation
                </p>
              </div>
            </div>

            {/* Approval Actions */}
            {requiresApproval && status === 'pending' && (
              <div className="flex gap-2.5 shrink-0">
                {onApprove && (
                  <Button
                    size="sm"
                    onClick={() => onApprove(toolCall)}
                    className="gap-1.5"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Approve
                  </Button>
                )}
                {onReject && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReject(toolCall)}
                    className="gap-1.5"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Reject
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Arguments Section */}
          <div className="space-y-2.5">
            <button
              onClick={() => setIsArgsExpanded(!isArgsExpanded)}
              className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Arguments</span>
              <svg
                className={cn(
                  'h-4 w-4 transition-transform duration-150 ease-out',
                  isArgsExpanded && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isArgsExpanded && (
              <motion.div
                initial={
                  prefersReducedMotion ? undefined : { height: 0, opacity: 0 }
                }
                animate={{ height: 'auto', opacity: 1 }}
                exit={
                  prefersReducedMotion ? undefined : { height: 0, opacity: 0 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0 : durations.normal,
                }}
                viewport={{ once: true }}
                className="overflow-hidden"
              >
                <pre className="rounded-lg border bg-muted/50 p-3 text-xs overflow-x-auto">
                  <code className="text-foreground font-mono">
                    {parseArguments()}
                  </code>
                </pre>
              </motion.div>
            )}
          </div>

          {/* Result Section */}
          {(result || error) && (
            <div className="space-y-2.5 border-t pt-4">
              {expandableResult ? (
                <>
                  <button
                    onClick={() => setIsResultExpanded(!isResultExpanded)}
                    className="flex w-full items-center justify-between text-sm font-medium hover:text-primary transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      {error ? (
                        <>
                          <svg
                            className="h-4 w-4 text-destructive"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Error Details
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-4 w-4 text-success"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Result
                        </>
                      )}
                    </span>
                    <svg
                      className={cn(
                        'h-4 w-4 transition-transform duration-150 ease-out',
                        isResultExpanded && 'rotate-180'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isResultExpanded && (
                    <motion.div
                      initial={
                        prefersReducedMotion
                          ? undefined
                          : { height: 0, opacity: 0 }
                      }
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={
                        prefersReducedMotion
                          ? undefined
                          : { height: 0, opacity: 0 }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0 : durations.normal,
                      }}
                      viewport={{ once: true }}
                      className="overflow-hidden space-y-3.5"
                    >
                      <pre
                        className={cn(
                          'rounded-lg border p-3 text-sm overflow-x-auto scrollbar-hide',
                          error
                            ? 'bg-destructive/10 border-destructive/30'
                            : 'bg-muted/50'
                        )}
                      >
                        <code
                          className={cn(
                            'font-mono',
                            error ? 'text-destructive' : 'text-foreground'
                          )}
                        >
                          {formatResult()}
                        </code>
                      </pre>

                      {error && onRetry && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRetry(toolCall)}
                          className="gap-1.5"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Retry
                        </Button>
                      )}
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="space-y-3.5">
                  <pre
                    className={cn(
                      'rounded-lg border p-3 text-sm overflow-x-auto scrollbar-hide',
                      error
                        ? 'bg-destructive/10 border-destructive/30'
                        : 'bg-muted/50'
                    )}
                  >
                    <code
                      className={cn(
                        'font-mono',
                        error ? 'text-destructive' : 'text-foreground'
                      )}
                    >
                      {formatResult()}
                    </code>
                  </pre>

                  {error && onRetry && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRetry(toolCall)}
                      className="gap-1.5"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Retry
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
