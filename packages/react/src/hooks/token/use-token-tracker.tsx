'use client'

import * as React from 'react'
import { estimateTokens } from '../utils/tokenization/estimator'
import { MODEL_REGISTRY } from '../utils/tokenization/model-registry'

// =============================================================================
// Lazy-initialized pricing and limits for performance
// Values are computed on first access, not at import time
// =============================================================================

/** Cached MODEL_PRICING value */
let _modelPricing: Record<string, { input: number; output: number }> | null =
  null

/** Cached MODEL_LIMITS value */
let _modelLimits: Record<string, number> | null = null

/**
 * Computes MODEL_PRICING from MODEL_REGISTRY (called once on first access)
 */
function computeModelPricing(): Record<
  string,
  { input: number; output: number }
> {
  return Object.fromEntries(
    Object.entries(MODEL_REGISTRY).map(([id, config]) => [
      id,
      {
        input: config.inputCostPer1M / 1_000_000,
        output: config.outputCostPer1M / 1_000_000,
      },
    ])
  )
}

/**
 * Computes MODEL_LIMITS from MODEL_REGISTRY (called once on first access)
 */
function computeModelLimits(): Record<string, number> {
  return Object.fromEntries(
    Object.entries(MODEL_REGISTRY).map(([id, config]) => [
      id,
      config.contextWindow,
    ])
  )
}

/**
 * Token pricing for popular models (derived from MODEL_REGISTRY)
 * Format: cost per token in dollars
 *
 * **Performance**: Lazy-initialized on first access, not at import time.
 *
 * @deprecated Import from '../utils/tokenization/model-pricing' for full pricing utilities.
 * Use `calculateCost()` for accurate cost calculations.
 * @see {@link ../utils/tokenization/model-pricing.ts} for the recommended API
 * @see {@link MODEL_REGISTRY} for the source of truth
 */
export const MODEL_PRICING: Record<string, { input: number; output: number }> =
  new Proxy({} as Record<string, { input: number; output: number }>, {
    get(_target, prop: string) {
      _modelPricing ??= computeModelPricing()
      return _modelPricing[prop]
    },
    has(_target, prop: string) {
      _modelPricing ??= computeModelPricing()
      return prop in _modelPricing
    },
    ownKeys() {
      _modelPricing ??= computeModelPricing()
      return Object.keys(_modelPricing)
    },
    getOwnPropertyDescriptor(_target, prop: string) {
      _modelPricing ??= computeModelPricing()
      if (prop in _modelPricing) {
        return {
          value: _modelPricing[prop],
          writable: false,
          enumerable: true,
          configurable: true,
        }
      }
      return undefined
    },
  })

/**
 * Token limits for popular models (derived from MODEL_REGISTRY)
 *
 * **Performance**: Lazy-initialized on first access, not at import time.
 *
 * @deprecated Use `MODEL_REGISTRY` directly for full model configuration including
 * context window, max output tokens, and capabilities.
 * @see {@link MODEL_REGISTRY} for the complete model configuration
 * @example
 * ```ts
 * import { MODEL_REGISTRY } from '../utils/tokenization/model-registry'
 * const gpt4Limit = MODEL_REGISTRY['gpt-4'].contextWindow // 8192
 * ```
 */
export const MODEL_LIMITS: Record<string, number> = new Proxy(
  {} as Record<string, number>,
  {
    get(_target, prop: string) {
      _modelLimits ??= computeModelLimits()
      return _modelLimits[prop]
    },
    has(_target, prop: string) {
      _modelLimits ??= computeModelLimits()
      return prop in _modelLimits
    },
    ownKeys() {
      _modelLimits ??= computeModelLimits()
      return Object.keys(_modelLimits)
    },
    getOwnPropertyDescriptor(_target, prop: string) {
      _modelLimits ??= computeModelLimits()
      if (prop in _modelLimits) {
        return {
          value: _modelLimits[prop],
          writable: false,
          enumerable: true,
          configurable: true,
        }
      }
      return undefined
    },
  }
)

/**
 * Message with token count
 */
export interface MessageWithTokens {
  role: 'user' | 'assistant' | 'system'
  content: string
  tokens?: number
}

/**
 * Token tracker options
 */
export interface UseTokenTrackerOptions {
  /** Model name (e.g., 'gpt-4', 'claude-3-opus') */
  modelName: string

  /** Maximum tokens for model (auto-detected if modelName matches) */
  maxTokens?: number

  /** Cost per input token in dollars (auto-detected if modelName matches) */
  inputCostPerToken?: number

  /** Cost per output token in dollars (auto-detected if modelName matches) */
  outputCostPerToken?: number

  /** Warning threshold as percentage (default: 0.8 = 80%) */
  warningThreshold?: number

  /** Critical threshold as percentage (default: 0.95 = 95%) */
  criticalThreshold?: number

  /** Callback when warning threshold exceeded */
  onWarning?: () => void

  /** Callback when critical threshold exceeded */
  onCritical?: () => void
}

/**
 * Token tracker return
 */
export interface UseTokenTrackerReturn {
  /** Current total tokens in conversation */
  tokens: number

  /** Input tokens (user messages) */
  inputTokens: number

  /** Output tokens (assistant messages) */
  outputTokens: number

  /** Estimated total cost in dollars */
  estimatedCost: number

  /** Whether near token limit (warning threshold) */
  isNearLimit: boolean

  /** Whether at critical token limit */
  isCritical: boolean

  /** Percentage of limit used (0-100) */
  percentage: number

  /** Whether can send message without exceeding limit */
  canSend: (estimatedTokens: number) => boolean

  /** Suggest pruning old messages */
  suggestPruning: boolean

  /** Add message to tracker */
  addMessage: (message: MessageWithTokens) => void

  /** Remove message from tracker */
  removeMessage: (index: number) => void

  /** Clear all messages */
  clear: () => void

  /** Estimate tokens for text (rough approximation) */
  estimateTokens: (text: string) => number
}

/**
 * Token estimation using centralized estimator
 * Adds overhead for role and formatting
 */
function estimateTokensFromText(text: string): number {
  // Use centralized estimator + overhead for role and formatting
  return estimateTokens(text) + 4
}

/**
 * Production-ready Token Tracker hook for cost transparency.
 *
 * **Features:**
 * - Real-time token counting across conversation
 * - Automatic model pricing lookup
 * - Cost estimation for input/output tokens
 * - Warning alerts at configurable thresholds
 * - Context limit validation
 * - Pruning suggestions
 * - Support for popular models (GPT-4, Claude, etc.)
 *
 * **Use Cases:**
 * - Display current conversation token usage
 * - Warn users before hitting context limits
 * - Show estimated API costs
 * - Prevent messages that would exceed limits
 * - Suggest context pruning
 *
 * @example
 * ```tsx
 * // Basic usage with GPT-4
 * const {
 *   tokens,
 *   estimatedCost,
 *   isNearLimit,
 *   canSend,
 *   addMessage,
 * } = useTokenTracker({
 *   modelName: 'gpt-4',
 * })
 *
 * // Add messages
 * addMessage({ role: 'user', content: 'Hello!', tokens: 5 })
 * addMessage({ role: 'assistant', content: 'Hi there!', tokens: 7 })
 *
 * // Check before sending
 * const canSendMessage = canSend(estimatedTokens)
 * if (!canSendMessage) {
 *   alert('Message too long - would exceed context limit')
 * }
 *
 * // With custom model and pricing
 * const tracker = useTokenTracker({
 *   modelName: 'custom-model',
 *   maxTokens: 4096,
 *   inputCostPerToken: 0.00002,
 *   outputCostPerToken: 0.00004,
 *   warningThreshold: 0.7,
 *   onWarning: () => {
 *     console.log('Approaching token limit')
 *   },
 *   onCritical: () => {
 *     showPruneDialog()
 *   },
 * })
 *
 * // With pruning suggestions
 * function ChatUI() {
 *   const { suggestPruning, clear } = useTokenTracker({
 *     modelName: 'gpt-4',
 *   })
 *
 *   return (
 *     <div>
 *       {suggestPruning && (
 *         <button onClick={clear}>
 *           Prune old messages to free up space
 *         </button>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useTokenTracker(
  options: UseTokenTrackerOptions
): UseTokenTrackerReturn {
  const {
    modelName,
    maxTokens: customMaxTokens,
    inputCostPerToken: customInputCost,
    outputCostPerToken: customOutputCost,
    warningThreshold = 0.8,
    criticalThreshold = 0.95,
    onWarning,
    onCritical,
  } = options

  // Get model info
  const maxTokens = customMaxTokens ?? MODEL_LIMITS[modelName] ?? 4096
  const inputCostPerToken =
    customInputCost ?? MODEL_PRICING[modelName]?.input ?? 0
  const outputCostPerToken =
    customOutputCost ?? MODEL_PRICING[modelName]?.output ?? 0

  // State
  const [messages, setMessages] = React.useState<MessageWithTokens[]>([])
  const [hasWarned, setHasWarned] = React.useState(false)
  const [hasCritical, setHasCritical] = React.useState(false)

  // Calculate totals
  const { inputTokens, outputTokens } = React.useMemo(() => {
    let input = 0
    let output = 0

    for (const message of messages) {
      const tokens = message.tokens ?? estimateTokensFromText(message.content)

      if (message.role === 'user' || message.role === 'system') {
        input += tokens
      } else if (message.role === 'assistant') {
        output += tokens
      }
    }

    return { inputTokens: input, outputTokens: output }
  }, [messages])

  const tokens = inputTokens + outputTokens
  const percentage = Math.min((tokens / maxTokens) * 100, 100)
  const isNearLimit = percentage >= warningThreshold * 100
  const isCritical = percentage >= criticalThreshold * 100
  const estimatedCost =
    inputTokens * inputCostPerToken + outputTokens * outputCostPerToken
  const suggestPruning = isCritical

  /**
   * Check if can send message
   */
  const canSend = React.useCallback(
    (estimatedTokens: number): boolean => {
      return tokens + estimatedTokens <= maxTokens
    },
    [tokens, maxTokens]
  )

  /**
   * Add message to tracker
   */
  const addMessage = React.useCallback((message: MessageWithTokens) => {
    setMessages((prev) => [...prev, message])
  }, [])

  /**
   * Remove message from tracker
   */
  const removeMessage = React.useCallback((index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  /**
   * Clear all messages
   */
  const clear = React.useCallback(() => {
    setMessages([])
    setHasWarned(false)
    setHasCritical(false)
  }, [])

  /**
   * Estimate tokens for text
   */
  const estimateTokens = React.useCallback((text: string): number => {
    return estimateTokensFromText(text)
  }, [])

  /**
   * Trigger callbacks
   */
  React.useEffect(() => {
    if (isCritical && !hasCritical) {
      setHasCritical(true)
      onCritical?.()
    } else if (isNearLimit && !hasWarned && !isCritical) {
      setHasWarned(true)
      onWarning?.()
    }

    // Reset warnings when usage drops
    if (percentage < warningThreshold * 100) {
      setHasWarned(false)
      setHasCritical(false)
    }
  }, [
    isNearLimit,
    isCritical,
    hasWarned,
    hasCritical,
    percentage,
    warningThreshold,
    onWarning,
    onCritical,
  ])

  return {
    tokens,
    inputTokens,
    outputTokens,
    estimatedCost,
    isNearLimit,
    isCritical,
    percentage,
    canSend,
    suggestPruning,
    addMessage,
    removeMessage,
    clear,
    estimateTokens,
  }
}
