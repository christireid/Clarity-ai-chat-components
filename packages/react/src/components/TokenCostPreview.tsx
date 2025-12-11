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
 *   onCostChange={(cost) => console.log(`Est. cost: $${cost.toFixed(4)}`)}
 * />
 * ```
 */

'use client'

import * as React from 'react'
import { estimateTokens } from '../utils/tokenization/estimator'
import { calculateCost } from '../utils/tokenization/model-pricing'
import type { ModelName } from '../utils/tokenization/accurate-counter'

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
  })

  // Refs for throttling
  const lastUpdateRef = React.useRef(0)
  const pendingRef = React.useRef<NodeJS.Timeout | null>(null)
  const latestTextRef = React.useRef(text)

  // Keep latest text in ref
  latestTextRef.current = text

  // Calculate estimate
  const calculateEstimate = React.useCallback(() => {
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

    setEstimate({
      tokens,
      inputCost,
      model,
      isStale: false,
    })
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
  /** Format function for cost display */
  formatCost?: (cost: number) => string
  /** Format function for token display */
  formatTokens?: (tokens: number) => string
  /** Throttle updates in ms (default: 100) */
  throttleMs?: number
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
export function TokenCostPreview({
  text,
  model = 'gpt-4',
  showTokenCount = true,
  showCost = true,
  minDisplayCost = 0.0001,
  className,
  onCostChange,
  formatCost = defaultFormatCost,
  formatTokens = defaultFormatTokens,
  throttleMs = 100,
}: TokenCostPreviewProps): React.ReactElement | null {
  const { tokens, inputCost, isStale } = useTokenEstimate({
    text,
    model,
    throttleMs,
  })

  // Notify on cost changes
  React.useEffect(() => {
    onCostChange?.(inputCost, tokens)
  }, [inputCost, tokens, onCostChange])

  // Don't render if nothing to show
  if (!showTokenCount && !showCost) return null
  if (tokens === 0 && inputCost < minDisplayCost) return null

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--clarity-text-muted, #6b7280)',
    opacity: isStale ? 0.7 : 1,
    transition: 'opacity 0.15s ease',
  }

  return (
    <span className={className} style={className ? undefined : baseStyles}>
      {showTokenCount && (
        <span data-testid="token-count">{formatTokens(tokens)} tokens</span>
      )}
      {showTokenCount && showCost && inputCost >= minDisplayCost && (
        <span aria-hidden>•</span>
      )}
      {showCost && inputCost >= minDisplayCost && (
        <span data-testid="cost-estimate">{formatCost(inputCost)} est.</span>
      )}
    </span>
  )
}

// Export types
export type { ModelName }
