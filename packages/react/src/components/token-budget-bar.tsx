'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge, cn } from '@clarity-chat/primitives'
import {
  type TokenUsage,
  type TokenUsageStatus,
  type BudgetMonitorModel,
  type TokenCostEstimate,
  getStatusColor,
  formatTokenUsage,
  estimateTokenCost,
} from '../hooks/use-token-budget-monitor'

export interface TokenBudgetBarProps {
  /** Current token usage from useTokenBudgetMonitor */
  usage: TokenUsage
  /** Whether token calculation is in progress */
  isCalculating?: boolean
  /** Show detailed tooltip on hover */
  showTooltip?: boolean
  /** Show text labels */
  showLabel?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Compact mode (bar only, no labels) */
  compact?: boolean
  /** Additional class names */
  className?: string
  /** Called when user clicks the bar (e.g., to trigger trim) */
  onClick?: () => void
  /** Animate bar transitions */
  animated?: boolean
  /** Model for cost estimation (enables cost display) */
  model?: BudgetMonitorModel
  /** Show estimated cost (requires model prop) */
  showCost?: boolean
  /** Accessible label for the progress bar (defaults to "Token Budget") */
  ariaLabel?: string
  /** ID for the component (used for aria relationships) */
  id?: string
}

/**
 * Maps status to Tailwind color classes
 */
const statusColorMap: Record<TokenUsageStatus, { bg: string; text: string }> = {
  safe: {
    bg: 'bg-green-500',
    text: 'text-green-600 dark:text-green-400',
  },
  warning: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
  critical: {
    bg: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
  },
  exceeded: {
    bg: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
  },
}

/**
 * Size configurations
 */
const sizeConfig = {
  sm: {
    height: 'h-1.5',
    text: 'text-xs',
    padding: 'p-2',
    gap: 'gap-1.5',
  },
  md: {
    height: 'h-2',
    text: 'text-sm',
    padding: 'p-3',
    gap: 'gap-2',
  },
  lg: {
    height: 'h-3',
    text: 'text-base',
    padding: 'p-4',
    gap: 'gap-3',
  },
}

/**
 * TokenBudgetBar Component
 *
 * Visual progress bar showing current token budget utilization with
 * color-coded status states (green → yellow → orange → red).
 *
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { usage, isCalculating } = useTokenBudgetMonitor({
 *     maxInputTokens: 128000,
 *   })
 *
 *   return (
 *     <div>
 *       <TokenBudgetBar
 *         usage={usage}
 *         isCalculating={isCalculating}
 *         showTooltip
 *       />
 *       <input ... />
 *     </div>
 *   )
 * }
 * ```
 */
export function TokenBudgetBar({
  usage,
  isCalculating = false,
  showTooltip = true,
  showLabel = true,
  size = 'md',
  compact = false,
  className,
  onClick,
  animated = true,
  model,
  showCost = false,
  ariaLabel = 'Token Budget',
  id,
}: TokenBudgetBarProps) {
  const [showDetails, setShowDetails] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const tooltipId = id ? `${id}-tooltip` : React.useId()
  const statusId = id ? `${id}-status` : React.useId()

  const colors = statusColorMap[usage.status]
  const sizeStyles = sizeConfig[size]

  // Calculate cost estimate if model is provided
  const costEstimate = React.useMemo<TokenCostEstimate | null>(() => {
    if (!model || !showCost) return null
    return estimateTokenCost(usage, model)
  }, [model, showCost, usage])

  // Calculate visual width - cap at 100% for the bar but show exceeded state
  const barWidthPercent = Math.min(usage.utilizationPercent, 100)

  // Determine if we should show the exceeded overflow indicator
  const showExceeded = usage.exceededPercent > 0

  // Generate accessible status description
  const statusDescription = React.useMemo(() => {
    const percentage = usage.utilizationPercent.toFixed(0)
    const currentFormatted = usage.current.toLocaleString()
    const maxFormatted = usage.effectiveMax.toLocaleString()
    const availableFormatted = usage.available.toLocaleString()

    let statusText = ''
    switch (usage.status) {
      case 'exceeded':
        statusText = `Budget exceeded by ${usage.exceededPercent.toFixed(1)}%. `
        break
      case 'critical':
        statusText = 'Critical: approaching token limit. '
        break
      case 'warning':
        statusText = 'Warning: token usage is high. '
        break
      default:
        statusText = ''
    }

    return `${statusText}${percentage}% used. ${currentFormatted} of ${maxFormatted} tokens. ${availableFormatted} available.`
  }, [usage])

  // Keyboard handler for interactive elements
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault()
        onClick()
      }
      if (showTooltip && event.key === 'Escape' && showDetails) {
        setShowDetails(false)
      }
    },
    [onClick, showTooltip, showDetails]
  )

  // Focus/blur handlers for tooltip
  const handleFocus = React.useCallback(() => {
    if (showTooltip) setShowDetails(true)
  }, [showTooltip])

  const handleBlur = React.useCallback(
    (event: React.FocusEvent) => {
      // Only close if focus leaves the container entirely
      if (
        showTooltip &&
        containerRef.current &&
        !containerRef.current.contains(event.relatedTarget)
      ) {
        setShowDetails(false)
      }
    },
    [showTooltip]
  )

  const BarContent = (
    <div
      role="progressbar"
      aria-valuenow={usage.current}
      aria-valuemin={0}
      aria-valuemax={usage.effectiveMax}
      aria-label={ariaLabel}
      aria-describedby={statusId}
      className={cn(
        'relative w-full rounded-full bg-muted overflow-hidden',
        sizeStyles.height
      )}
    >
      {/* Main progress bar */}
      {animated ? (
        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            colors.bg,
            showExceeded && 'animate-pulse'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${barWidthPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          aria-hidden="true"
        />
      ) : (
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-300',
            colors.bg,
            showExceeded && 'animate-pulse'
          )}
          style={{ width: `${barWidthPercent}%` }}
          aria-hidden="true"
        />
      )}

      {/* Calculating shimmer effect */}
      {isCalculating && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
      )}
    </div>
  )

  // Compact mode - just the bar
  if (compact) {
    return (
      <div
        className={cn('w-full', className)}
        onClick={onClick}
        onKeyDown={onClick ? handleKeyDown : undefined}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={
          onClick ? `${ariaLabel}. Click to manage budget.` : undefined
        }
      >
        {BarContent}
        {/* Screen reader only status description */}
        <span id={statusId} className="sr-only">
          {statusDescription}
        </span>
      </div>
    )
  }

  const content = (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col w-full',
        sizeStyles.gap,
        onClick &&
          'cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => showTooltip && setShowDetails(true)}
      onMouseLeave={() => showTooltip && setShowDetails(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={onClick || showTooltip ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-expanded={showTooltip ? showDetails : undefined}
      aria-describedby={showDetails ? tooltipId : statusId}
    >
      {/* Header row with labels */}
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className={cn('flex items-center', sizeStyles.gap)}>
            <span
              className={cn('font-medium', sizeStyles.text, colors.text)}
              aria-live="polite"
            >
              {formatTokenUsage(usage)}
            </span>

            {isCalculating && (
              <motion.span
                className={cn('text-muted-foreground', sizeStyles.text)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Calculating...
              </motion.span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {costEstimate && (
              <span
                className={cn(
                  'font-mono text-muted-foreground',
                  sizeStyles.text
                )}
              >
                ~{costEstimate.formattedCost}
              </span>
            )}

            {usage.status !== 'safe' && (
              <Badge
                variant={
                  usage.status === 'exceeded'
                    ? 'destructive'
                    : usage.status === 'critical'
                      ? 'warning'
                      : 'secondary'
                }
                className={sizeStyles.text}
              >
                {usage.status === 'exceeded'
                  ? 'Over Budget'
                  : usage.status === 'critical'
                    ? 'Critical'
                    : 'Warning'}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {BarContent}

      {/* Exceeded indicator text */}
      {showExceeded && showLabel && (
        <motion.div
          className={cn('flex items-center', sizeStyles.gap)}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          role="alert"
          aria-live="assertive"
        >
          <span
            className={cn(
              'text-red-600 dark:text-red-400 font-medium',
              sizeStyles.text
            )}
          >
            {usage.exceededPercent.toFixed(1)}% over budget
          </span>
          <span className={cn('text-muted-foreground', sizeStyles.text)}>
            — Consider trimming context
          </span>
        </motion.div>
      )}

      {/* Screen reader only status description */}
      <span id={statusId} className="sr-only">
        {statusDescription}
      </span>
    </div>
  )

  if (!showTooltip) {
    return content
  }

  return (
    <div className="relative">
      {content}

      {/* Tooltip with detailed breakdown */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-2 rounded-lg border bg-popover p-3 shadow-lg"
          >
            <div className="space-y-2 text-sm">
              <div className="font-semibold" id={`${tooltipId}-title`}>
                Token Budget Details
              </div>

              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>Current:</span>
                <span className="text-right font-mono">
                  {usage.current.toLocaleString()}
                </span>

                <span>Max (Input):</span>
                <span className="text-right font-mono">
                  {usage.max.toLocaleString()}
                </span>

                <span>Reserved (Output):</span>
                <span className="text-right font-mono">
                  {usage.reservedForOutput.toLocaleString()}
                </span>

                <span>Effective Max:</span>
                <span className="text-right font-mono">
                  {usage.effectiveMax.toLocaleString()}
                </span>

                <span>Available:</span>
                <span
                  className={cn(
                    'text-right font-mono',
                    usage.available <= 0 && 'text-red-500'
                  )}
                >
                  {usage.available.toLocaleString()}
                </span>
              </div>

              {costEstimate && (
                <div className="border-t pt-2 mt-2">
                  <div className="font-semibold mb-1">Estimated Cost</div>
                  <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                    <span>Input ({usage.current.toLocaleString()}):</span>
                    <span className="text-right font-mono">
                      ${costEstimate.inputCost.toFixed(4)}
                    </span>

                    <span>Output (reserved):</span>
                    <span className="text-right font-mono">
                      ${costEstimate.estimatedOutputCost.toFixed(4)}
                    </span>

                    <span className="font-medium">Total:</span>
                    <span className="text-right font-mono font-medium">
                      {costEstimate.formattedCost}
                    </span>
                  </div>
                </div>
              )}

              {usage.status !== 'safe' && (
                <div className="border-t pt-2">
                  <div className="text-xs text-muted-foreground">
                    {usage.status === 'exceeded' &&
                      'Budget exceeded. Trim older messages to continue.'}
                    {usage.status === 'critical' &&
                      'Approaching limit. Consider trimming context.'}
                    {usage.status === 'warning' &&
                      'Monitor usage. Budget filling up.'}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

TokenBudgetBar.displayName = 'TokenBudgetBar'

export interface TokenBudgetIndicatorProps {
  /** Current token usage from useTokenBudgetMonitor */
  usage: TokenUsage
  /** Additional class names */
  className?: string
  /** Accessible label (defaults to "Token usage") */
  ariaLabel?: string
}

/**
 * Compact inline token indicator for space-constrained UIs
 */
export function TokenBudgetIndicator({
  usage,
  className,
  ariaLabel = 'Token usage',
}: TokenBudgetIndicatorProps) {
  const colors = statusColorMap[usage.status]
  const percentage = usage.utilizationPercent.toFixed(0)

  // Generate status-aware accessible description
  const statusText =
    usage.status === 'exceeded'
      ? 'exceeded'
      : usage.status === 'critical'
        ? 'critical'
        : usage.status === 'warning'
          ? 'high'
          : 'normal'

  return (
    <div
      className={cn('inline-flex items-center gap-1.5', className)}
      role="status"
      aria-label={`${ariaLabel}: ${percentage}% used, ${statusText}`}
    >
      <div
        className={cn('h-2 w-2 rounded-full', colors.bg)}
        aria-hidden="true"
      />
      <span className={cn('text-xs font-mono', colors.text)}>
        {usage.utilizationPercent.toFixed(0)}%
      </span>
    </div>
  )
}

TokenBudgetIndicator.displayName = 'TokenBudgetIndicator'
