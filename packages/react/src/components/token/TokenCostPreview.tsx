import { logger } from '@clarity-chat/utils/logger';
/**
 * TokenCostPreview - Real-time Token Cost Estimation Component
 *
 * Displays live cost estimates as users type, providing transparency
 * into API costs before messages are sent.
 *
 * @example
 * ```tsx
 * <TokenCostPreview
 *   text={inputValue}
 *   model="gpt-4"
 *   showTokenCount
 *   onCostChange={(cost) => logger.debug(`Est. cost: $${cost.toFixed(4)}`)}
 * />
 * ```
 */

'use client'

import * as React from 'react'
import { estimateTokens } from '../../utils/tokenization/estimator'
import { calculateCost } from '../../utils/tokenization/model-pricing'
import type { ModelName } from '../../utils/tokenization/accurate-counter'

// =============================================================================
// useTokenEstimate Hook
// =============================================================================

export interface UseTokenEstimateOptions {
  /** The text to estimate tokens for */
  text: string
  /** Model name for model-specific estimation */
  model?: ModelName | string
  /** Throttle updates in milliseconds (default: 100) */
  throttleMs?: number
}

export interface TokenEstimate {
  /** Estimated token count */
  tokens: number
  /** Estimated cost in dollars for input tokens */
  inputCost: number
  /** Model used for estimation */
  model: string
  /** Whether the estimate is stale (during throttle) */
  isStale: boolean
  /** Whether the estimate is currently loading (first calculation) */
  isLoading: boolean
  /** Error if estimation failed */
  error: Error | null
}

/**
 * Hook for real-time token estimation with throttling
 *
 * @example
 * ```tsx
 * const { tokens, inputCost, isStale } = useTokenEstimate({
 *   text: inputValue,
 *   model: 'gpt-4',
 *   throttleMs: 150,
 * })
 * ```
 */
export function useTokenEstimate(
  options: UseTokenEstimateOptions
): TokenEstimate {
  const { text, model = 'gpt-4', throttleMs = 100 } = options

  const [estimate, setEstimate] = React.useState<TokenEstimate>({
    tokens: 0,
    inputCost: 0,
    model,
    isStale: false,
    isLoading: true,
    error: null,
  })

  // Refs for throttling
  const lastUpdateRef = React.useRef(0)
  const pendingRef = React.useRef<NodeJS.Timeout | null>(null)
  const latestTextRef = React.useRef(text)
  const hasCalculatedRef = React.useRef(false)

  // Keep latest text in ref
  latestTextRef.current = text

  // Calculate estimate
  const calculateEstimate = React.useCallback(() => {
    try {
      const tokens = estimateTokens(latestTextRef.current, model)

      let inputCost = 0
      try {
        const cost = calculateCost({
          model,
          inputTokens: tokens,
          outputTokens: 0,
        })
        inputCost = cost.inputCost
      } catch {
        // Model not in pricing database, estimate with GPT-4 pricing
        // $0.03 per 1K input tokens for GPT-4
        inputCost = (tokens / 1000) * 0.03
      }

      hasCalculatedRef.current = true
      setEstimate({
        tokens,
        inputCost,
        model,
        isStale: false,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      // Handle unexpected errors in estimation
      hasCalculatedRef.current = true
      setEstimate((prev) => ({
        ...prev,
        isStale: false,
        isLoading: false,
        error:
          err instanceof Error ? err : new Error('Token estimation failed'),
      }))
    }
  }, [model])

  // Throttled update effect
  React.useEffect(() => {
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdateRef.current

    // Clear any pending update
    if (pendingRef.current) {
      clearTimeout(pendingRef.current)
    }

    if (timeSinceLastUpdate >= throttleMs) {
      // Immediate update
      lastUpdateRef.current = now
      calculateEstimate()
    } else {
      // Mark as stale and schedule update
      setEstimate((prev) => ({ ...prev, isStale: true }))
      pendingRef.current = setTimeout(() => {
        lastUpdateRef.current = Date.now()
        calculateEstimate()
      }, throttleMs - timeSinceLastUpdate)
    }

    return () => {
      if (pendingRef.current) {
        clearTimeout(pendingRef.current)
      }
    }
  }, [text, throttleMs, calculateEstimate])

  return estimate
}

// =============================================================================
// TokenCostPreview Component
// =============================================================================

export interface TokenCostPreviewProps {
  /** The text to estimate tokens for */
  text: string
  /** Model name for estimation */
  model?: ModelName | string
  /** Show token count (default: true) */
  showTokenCount?: boolean
  /** Show cost estimate (default: true) */
  showCost?: boolean
  /** Minimum cost to display (default: 0.0001) */
  minDisplayCost?: number
  /** Custom className for styling */
  className?: string
  /** Callback when cost changes */
  onCostChange?: (cost: number, tokens: number) => void
  /** Callback when an error occurs */
  onError?: (error: Error) => void
  /** Format function for cost display */
  formatCost?: (cost: number) => string
  /** Format function for token display */
  formatTokens?: (tokens: number) => string
  /** Throttle updates in ms (default: 100) */
  throttleMs?: number
  /** Accessible label for the component (default: "Token and cost estimate") */
  ariaLabel?: string
  /** ID for the component (useful for aria-describedby) */
  id?: string
  /** Show loading indicator during first calculation (default: false) */
  showLoading?: boolean
  /** Custom loading text (default: "Calculating...") */
  loadingText?: string
  /** Show error message when estimation fails (default: true) */
  showError?: boolean
  /** Custom error renderer */
  renderError?: (error: Error) => React.ReactNode
}

/**
 * Default cost formatter - shows significant digits
 */
function defaultFormatCost(cost: number): string {
  if (cost < 0.0001) return '$0.00'
  if (cost < 0.01) return `$${cost.toFixed(4)}`
  if (cost < 1) return `$${cost.toFixed(3)}`
  return `$${cost.toFixed(2)}`
}

/**
 * Default token formatter with compact notation
 */
function defaultFormatTokens(tokens: number): string {
  if (tokens < 1000) return `${tokens}`
  if (tokens < 10000) return `${(tokens / 1000).toFixed(1)}K`
  return `${Math.round(tokens / 1000)}K`
}

/**
 * Real-time token cost preview component
 *
 * Displays live estimates of token count and API cost as users type.
 * Useful for giving users transparency into costs before sending messages.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TokenCostPreview text={inputValue} model="gpt-4" />
 *
 * // With callback
 * <TokenCostPreview
 *   text={inputValue}
 *   model="claude-3-5-sonnet"
 *   onCostChange={(cost, tokens) => {
 *     if (cost > 0.10) {
 *       showWarning('This message will cost more than $0.10')
 *     }
 *   }}
 * />
 *
 * // Custom formatting
 * <TokenCostPreview
 *   text={inputValue}
 *   formatCost={(cost) => `~$${cost.toFixed(2)} USD`}
 *   formatTokens={(tokens) => `${tokens} tokens`}
 * />
 * ```
 */
/**
 * Hook to detect prefers-reduced-motion
 */
function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

export function TokenCostPreview({
  text,
  model = 'gpt-4',
  showTokenCount = true,
  showCost = true,
  minDisplayCost = 0.0001,
  className,
  onCostChange,
  onError,
  formatCost = defaultFormatCost,
  formatTokens = defaultFormatTokens,
  throttleMs = 100,
  ariaLabel,
  id,
  showLoading = false,
  loadingText = 'Calculating...',
  showError = true,
  renderError,
}: TokenCostPreviewProps): React.ReactElement | null {
  const { tokens, inputCost, isStale, isLoading, error } = useTokenEstimate({
    text,
    model,
    throttleMs,
  })

  const prefersReducedMotion = useReducedMotion()

  // Notify on cost changes
  React.useEffect(() => {
    onCostChange?.(inputCost, tokens)
  }, [inputCost, tokens, onCostChange])

  // Notify on errors
  React.useEffect(() => {
    if (error) {
      onError?.(error)
    }
  }, [error, onError])

  // Don't render if nothing to show
  if (!showTokenCount && !showCost) return null
  if (!isLoading && !error && tokens === 0 && inputCost < minDisplayCost)
    return null

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--clarity-text-muted, #6b7280)',
    opacity: isStale ? 0.7 : 1,
    // Respect prefers-reduced-motion
    transition: prefersReducedMotion ? 'none' : 'opacity 0.15s ease',
  }

  const errorStyles: React.CSSProperties = {
    ...baseStyles,
    color: 'var(--clarity-text-error, #dc2626)',
  }

  // Handle error state
  if (error && showError) {
    const errorContent = renderError ? (
      renderError(error)
    ) : (
      <span data-testid="error-message">Unable to estimate</span>
    )

    return (
      <span
        id={id}
        className={className}
        style={className ? undefined : errorStyles}
        role="alert"
        aria-live="assertive"
      >
        {errorContent}
      </span>
    )
  }

  // Handle loading state
  if (isLoading && showLoading && text.length > 0) {
    return (
      <span
        id={id}
        className={className}
        style={className ? undefined : baseStyles}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span data-testid="loading-indicator" aria-hidden="true">
          {loadingText}
        </span>
        <span
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          Calculating token estimate
        </span>
      </span>
    )
  }

  // Build accessible announcement text for screen readers
  const announcementParts: string[] = []
  if (showTokenCount) {
    announcementParts.push(`${tokens} tokens`)
  }
  if (showCost && inputCost >= minDisplayCost) {
    announcementParts.push(`estimated cost ${formatCost(inputCost)}`)
  }
  const announcementText = announcementParts.join(', ')

  // Default aria-label if not provided
  const computedAriaLabel =
    ariaLabel ?? `Token and cost estimate: ${announcementText}`

  return (
    <span
      id={id}
      className={className}
      style={className ? undefined : baseStyles}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={computedAriaLabel}
    >
      {/* Visual display */}
      {showTokenCount && (
        <span data-testid="token-count" aria-hidden="true">
          {formatTokens(tokens)} tokens
        </span>
      )}
      {showTokenCount && showCost && inputCost >= minDisplayCost && (
        <span aria-hidden="true">•</span>
      )}
      {showCost && inputCost >= minDisplayCost && (
        <span data-testid="cost-estimate" aria-hidden="true">
          {formatCost(inputCost)} est.
        </span>
      )}
      {/* Screen reader only announcement (hidden visually) */}
      <span
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {announcementText}
        {isStale && ', updating...'}
      </span>
    </span>
  )
}

// Export types
export type { ModelName }
