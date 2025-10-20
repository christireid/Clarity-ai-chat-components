import * as React from 'react'

/**
 * Token counter props
 */
export interface TokenCounterProps {
  /** Current token count in conversation */
  currentTokens: number
  
  /** Maximum tokens allowed by model */
  maxTokens: number
  
  /** Cost per token in dollars (e.g., 0.000002 for $0.002 per 1K tokens) */
  costPerToken?: number
  
  /** Show warning when approaching limit (default: true) */
  showWarning?: boolean
  
  /** Warning threshold as percentage (default: 0.8 = 80%) */
  warningThreshold?: number
  
  /** Critical threshold as percentage (default: 0.95 = 95%) */
  criticalThreshold?: number
  
  /** Show cost estimate (default: true) */
  showCost?: boolean
  
  /** Show percentage bar (default: true) */
  showBar?: boolean
  
  /** Callback when warning threshold exceeded */
  onWarning?: () => void
  
  /** Callback when critical threshold exceeded */
  onCritical?: () => void
  
  /** Suggest pruning old messages */
  suggestPruning?: boolean
  
  /** Callback when prune suggestion clicked */
  onPruneSuggested?: () => void
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  
  /** Custom CSS class */
  className?: string
}

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Format cost in dollars
 */
function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${(cost * 100).toFixed(3)}¢`
  }
  return `$${cost.toFixed(2)}`
}

/**
 * Production-ready Token Counter component with cost transparency.
 * 
 * **Features:**
 * - Real-time token count display
 * - Cost estimation based on token pricing
 * - Visual progress bar with color-coded thresholds
 * - Warning alerts at 80% and 95% usage
 * - Smart pruning suggestions
 * - Responsive sizing (sm, md, lg)
 * - Accessible (ARIA labels, color contrast)
 * 
 * **Use Cases:**
 * - Display current conversation token usage
 * - Warn users before hitting context limits
 * - Show estimated API costs in real-time
 * - Suggest context pruning when approaching limits
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <TokenCounter
 *   currentTokens={1250}
 *   maxTokens={4096}
 * />
 * 
 * // With cost estimation
 * <TokenCounter
 *   currentTokens={3500}
 *   maxTokens={4096}
 *   costPerToken={0.000002} // $0.002 per 1K tokens
 *   showCost={true}
 * />
 * 
 * // With warnings and pruning
 * <TokenCounter
 *   currentTokens={3400}
 *   maxTokens={4096}
 *   showWarning={true}
 *   warningThreshold={0.8}
 *   criticalThreshold={0.95}
 *   suggestPruning={true}
 *   onWarning={() => {
 *     console.log('Approaching token limit')
 *   }}
 *   onCritical={() => {
 *     console.log('Critical token limit!')
 *     showPruneDialog()
 *   }}
 *   onPruneSuggested={() => {
 *     pruneOldMessages()
 *   }}
 * />
 * 
 * // Small variant for compact UI
 * <TokenCounter
 *   currentTokens={500}
 *   maxTokens={4096}
 *   size="sm"
 *   showBar={false}
 * />
 * ```
 */
export function TokenCounter({
  currentTokens,
  maxTokens,
  costPerToken,
  showWarning = true,
  warningThreshold = 0.8,
  criticalThreshold = 0.95,
  showCost = true,
  showBar = true,
  onWarning,
  onCritical,
  suggestPruning = false,
  onPruneSuggested,
  size = 'md',
  className = '',
}: TokenCounterProps) {
  const [hasWarnedOnce, setHasWarnedOnce] = React.useState(false)
  const [hasCriticalOnce, setHasCriticalOnce] = React.useState(false)

  const percentage = Math.min((currentTokens / maxTokens) * 100, 100)
  const isWarning = percentage >= warningThreshold * 100
  const isCritical = percentage >= criticalThreshold * 100
  const estimatedCost = costPerToken ? currentTokens * costPerToken : null

  /**
   * Trigger warning callbacks
   */
  React.useEffect(() => {
    if (showWarning) {
      if (isCritical && !hasCriticalOnce) {
        setHasCriticalOnce(true)
        onCritical?.()
      } else if (isWarning && !hasWarnedOnce && !isCritical) {
        setHasWarnedOnce(true)
        onWarning?.()
      }
    }
  }, [isWarning, isCritical, showWarning, hasWarnedOnce, hasCriticalOnce, onWarning, onCritical])

  // Reset warnings when usage drops
  React.useEffect(() => {
    if (percentage < warningThreshold * 100) {
      setHasWarnedOnce(false)
      setHasCriticalOnce(false)
    }
  }, [percentage, warningThreshold])

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'text-xs',
      bar: 'h-1',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'text-sm',
      bar: 'h-2',
      icon: 'w-4 h-4',
    },
    lg: {
      container: 'text-base',
      bar: 'h-3',
      icon: 'w-5 h-5',
    },
  }

  // Status color classes
  const getColorClasses = () => {
    if (isCritical) {
      return {
        text: 'text-red-700 dark:text-red-300',
        bg: 'bg-red-500',
        border: 'border-red-300 dark:border-red-700',
      }
    }
    if (isWarning) {
      return {
        text: 'text-yellow-700 dark:text-yellow-300',
        bg: 'bg-yellow-500',
        border: 'border-yellow-300 dark:border-yellow-700',
      }
    }
    return {
      text: 'text-green-700 dark:text-green-300',
      bg: 'bg-green-500',
      border: 'border-green-300 dark:border-green-700',
    }
  }

  const colors = getColorClasses()
  const sizes = sizeClasses[size]

  return (
    <div
      className={`flex flex-col gap-2 ${sizes.container} ${className}`}
      role="status"
      aria-label={`Token usage: ${currentTokens} of ${maxTokens} (${percentage.toFixed(1)}%)`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        {/* Token count */}
        <div className={`flex items-center gap-2 font-medium ${colors.text}`}>
          <svg
            className={sizes.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>
            {formatNumber(currentTokens)} / {formatNumber(maxTokens)} tokens
          </span>
        </div>

        {/* Cost estimate */}
        {showCost && estimatedCost !== null && (
          <div className="text-gray-600 dark:text-gray-400 font-mono">
            {formatCost(estimatedCost)}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {showBar && (
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`${sizes.bar} ${colors.bg} transition-all duration-300 ease-out`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={currentTokens}
            aria-valuemin={0}
            aria-valuemax={maxTokens}
          />
        </div>
      )}

      {/* Percentage */}
      <div className={`text-xs ${colors.text}`}>
        {percentage.toFixed(1)}% of context window used
      </div>

      {/* Warning message */}
      {showWarning && isWarning && (
        <div
          className={`flex items-start gap-2 p-3 rounded-lg border ${colors.border} bg-opacity-10 ${colors.bg.replace('bg-', 'bg-opacity-10 ')}`}
          role="alert"
        >
          <svg
            className={`flex-shrink-0 w-5 h-5 ${colors.text}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="flex-1">
            <p className={`font-medium ${colors.text}`}>
              {isCritical
                ? 'Context Limit Nearly Reached'
                : 'Approaching Context Limit'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {isCritical
                ? 'The conversation may be truncated soon. Consider pruning older messages.'
                : 'You\'re using a large portion of the context window. Older messages may be excluded.'}
            </p>

            {/* Prune suggestion */}
            {suggestPruning && isCritical && onPruneSuggested && (
              <button
                onClick={onPruneSuggested}
                className={`mt-2 text-xs font-medium ${colors.text} hover:underline focus:outline-none`}
              >
                → Prune old messages to free up space
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
