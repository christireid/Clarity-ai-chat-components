'use client'

import * as React from 'react'
import { AccurateTokenCounter } from '../tokenizers/accurate-counter'
import { estimateTokens } from '../utils/token-estimation'
import { MODEL_PRICING } from '../models/model-pricing'
import { MODEL_REGISTRY, type ModelId } from '../models/model-registry'

/**
 * @deprecated Use ModelId instead
 * Backward compatibility alias for ModelId type
 */
export type ModelName = ModelId

/**
 * Token usage status levels
 */
export type TokenUsageStatus = 'safe' | 'warning' | 'critical' | 'exceeded'

/**
 * Current token budget usage metrics
 */
export interface TokenBudgetUsage {
  /** Current tokens used */
  current: number
  /** Maximum tokens allowed */
  max: number
  /** Available tokens remaining */
  available: number
  /** Utilization as percentage (0-100, capped for display) */
  utilizationPercent: number
  /**
   * Percentage by which budget is exceeded (0 if not exceeded)
   * E.g., if effectiveMax is 100 and current is 150, exceededPercent is 50
   */
  exceededPercent: number
  /** Current status based on thresholds */
  status: TokenUsageStatus
  /** Tokens reserved for output */
  reservedForOutput: number
  /** Effective max for input (max - reserved) */
  effectiveMax: number
}

/**
 * @deprecated Use TokenBudgetUsage instead
 * Backward compatibility alias
 */
export type TokenUsage = TokenBudgetUsage

/**
 * Trimming result when auto-trim is triggered
 */
export interface TrimResult {
  /** Content before trimming */
  originalContent: string[]
  /** Content after trimming */
  trimmedContent: string[]
  /** Tokens removed */
  tokensRemoved: number
  /** What was removed (indices and content previews) */
  removedItems: Array<{
    index: number
    preview: string
    tokens: number
  }>
  /** Reason for trimming */
  reason: 'critical' | 'exceeded' | 'manual'
}

/**
 * Message format for token counting
 */
export interface BudgetMessage {
  /** Message role */
  role: 'user' | 'assistant' | 'system'
  /** Message content */
  content: string
  /** Pre-computed token count (optional, for performance) */
  tokens?: number
  /** Whether this message can be trimmed (default: true for history) */
  trimmable?: boolean
  /** Priority for trimming (lower = trim first, default: 0) */
  priority?: number
}

/**
 * Configuration for the token budget monitor
 */
export interface TokenBudgetConfig {
  /** Maximum input tokens for the model (e.g., 128000 for GPT-4) */
  maxInputTokens: number
  /** Warning threshold as decimal (default: 0.8 = 80%) */
  warningThreshold?: number
  /** Critical threshold as decimal (default: 0.95 = 95%) */
  criticalThreshold?: number
  /** Tokens reserved for output response (default: 4096) */
  reservedForOutput?: number
  /** Model name for accurate token counting */
  model?: ModelName
  /** Callback when warning threshold is crossed */
  onWarning?: (usage: TokenBudgetUsage) => void
  /** Callback when critical threshold is crossed */
  onCritical?: (usage: TokenBudgetUsage) => void
  /** Callback when exceeded (over 100%) */
  onExceeded?: (usage: TokenBudgetUsage) => void
  /** Auto-trigger trimming at critical threshold */
  autoTrim?: boolean
  /** Callback after auto-trim occurs */
  onAutoTrim?: (result: TrimResult) => void
  /** Debounce delay for token counting in ms (default: 300) */
  debounceMs?: number
  /** Use accurate tokenization (slower but precise) */
  useAccurateTokenization?: boolean
}

/**
 * Return type for the useTokenBudgetMonitor hook
 */
export interface TokenBudgetMonitorReturn {
  /** Current token usage metrics */
  usage: TokenBudgetUsage
  /** Whether currently in warning state */
  isWarning: boolean
  /** Whether currently in critical state */
  isCritical: boolean
  /** Whether currently exceeded */
  isExceeded: boolean
  /** Check if adding content would exceed budget */
  wouldExceed: (additionalTokens: number) => boolean
  /** Calculate tokens for text */
  calculateTokens: (text: string) => Promise<number>
  /** Update messages and recalculate usage */
  updateMessages: (messages: BudgetMessage[]) => void
  /** Manually trigger trim to get below critical */
  trimToCritical: () => TrimResult | null
  /** Reset the monitor state */
  reset: () => void
  /** Last trim result if any */
  lastTrimResult: TrimResult | null
  /** Whether currently calculating tokens */
  isCalculating: boolean
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<
  Omit<
    TokenBudgetConfig,
    'onWarning' | 'onCritical' | 'onExceeded' | 'onAutoTrim' | 'model'
  >
> = {
  maxInputTokens: 128000,
  warningThreshold: 0.8,
  criticalThreshold: 0.95,
  reservedForOutput: 4096,
  autoTrim: false,
  debounceMs: 300,
  useAccurateTokenization: false,
}

/**
 * Calculate status based on utilization and thresholds
 */
function calculateStatus(
  utilizationPercent: number,
  warningThreshold: number,
  criticalThreshold: number
): TokenUsageStatus {
  const utilization = utilizationPercent / 100
  if (utilization >= 1) return 'exceeded'
  if (utilization >= criticalThreshold) return 'critical'
  if (utilization >= warningThreshold) return 'warning'
  return 'safe'
}

/**
 * Create initial usage state
 */
function createInitialUsage(config: TokenBudgetConfig): TokenBudgetUsage {
  const effectiveMax =
    config.maxInputTokens -
    (config.reservedForOutput ?? DEFAULT_CONFIG.reservedForOutput)
  return {
    current: 0,
    max: config.maxInputTokens,
    available: effectiveMax,
    utilizationPercent: 0,
    exceededPercent: 0,
    status: 'safe',
    reservedForOutput:
      config.reservedForOutput ?? DEFAULT_CONFIG.reservedForOutput,
    effectiveMax,
  }
}

/**
 * Hook for monitoring token budget in real-time
 *
 * @deprecated Use `useTokenBudgetTracking` instead for clarity
 * The name `useTokenBudgetMonitor` is confusing as it conflicts with component-specific usage.
 * This hook will be removed in v3.0.0
 *
 * Migration:
 * ```diff
 * - import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'
 * + import { useTokenBudgetTracking } from '@clarity-chat/token-optimization'
 *
 * - const { usage } = useTokenBudgetMonitor(config)
 * + const { usage } = useTokenBudgetTracking(config)
 * ```
 *
 * Provides threshold-based warnings and automatic trimming to prevent
 * context overflow and provide immediate cost awareness.
 *
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { usage, isWarning, isCritical, updateMessages } = useTokenBudgetMonitor({
 *     maxInputTokens: 128000,
 *     reservedForOutput: 4096,
 *     onWarning: (usage) => console.log('Warning:', usage.utilizationPercent),
 *     onCritical: (usage) => console.log('Critical:', usage.utilizationPercent),
 *     autoTrim: true,
 *   })
 *
 *   useEffect(() => {
 *     updateMessages(messages)
 *   }, [messages])
 *
 *   return (
 *     <div>
 *       <TokenBar usage={usage} />
 *       {isWarning && <Warning>Context at {usage.utilizationPercent}%</Warning>}
 *       {isCritical && <Alert>Critical: Consider trimming history</Alert>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useTokenBudgetMonitor(
  config: TokenBudgetConfig
): TokenBudgetMonitorReturn {
  // Runtime deprecation warning in development
  if (process.env['NODE_ENV'] === 'development') {
    // Only warn once per session
    const warningKey = 'useTokenBudgetMonitor-deprecation-warned'
    if (typeof globalThis !== 'undefined' && !(globalThis as any)[warningKey]) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[Deprecation] useTokenBudgetMonitor: This hook will be renamed to useTokenBudgetTracking in v3.0.0. ' +
            'Please update your imports:\n' +
            '  - useTokenBudgetMonitor → useTokenBudgetTracking (for monitoring/analytics)\n' +
            '  See: https://github.com/clarity-ai/token-optimization#migration'
        )
      }
      ;(globalThis as any)[warningKey] = true
    }
  }
  // Validate config in development
  if (process.env['NODE_ENV'] !== 'production') {
    if (config.maxInputTokens <= 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[useTokenBudgetMonitor] maxInputTokens must be positive')
      }
    }
    const reserved =
      config.reservedForOutput ?? DEFAULT_CONFIG.reservedForOutput
    if (reserved >= config.maxInputTokens) {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[useTokenBudgetMonitor] reservedForOutput should be less than maxInputTokens'
          )
        }
      }
    }
    const warning = config.warningThreshold ?? DEFAULT_CONFIG.warningThreshold
    const critical =
      config.criticalThreshold ?? DEFAULT_CONFIG.criticalThreshold
    if (warning >= critical) {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[useTokenBudgetMonitor] warningThreshold should be less than criticalThreshold'
          )
        }
      }
    }
    if (warning < 0 || warning > 1 || critical < 0 || critical > 1) {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[useTokenBudgetMonitor] thresholds should be between 0 and 1'
          )
        }
      }
    }
  }

  // Merge config with defaults
  const resolvedConfig = React.useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...config,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // Intentionally listing specific properties for fine-grained memoization
      config.maxInputTokens,
      config.warningThreshold,
      config.criticalThreshold,
      config.reservedForOutput,
      config.autoTrim,
      config.debounceMs,
      config.useAccurateTokenization,
      config.model,
    ]
  )

  // State
  const [usage, setUsage] = React.useState<TokenUsage>(() =>
    createInitialUsage(config)
  )
  const [lastTrimResult, setLastTrimResult] = React.useState<TrimResult | null>(
    null
  )
  const [isCalculating, setIsCalculating] = React.useState(false)

  // Refs for callbacks and messages (to avoid stale closures)
  const callbacksRef = React.useRef({
    onWarning: config.onWarning,
    onCritical: config.onCritical,
    onExceeded: config.onExceeded,
    onAutoTrim: config.onAutoTrim,
  })
  const messagesRef = React.useRef<BudgetMessage[]>([])
  const previousStatusRef = React.useRef<TokenUsageStatus>('safe')
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  // AbortController for cancelling in-flight async operations
  const abortControllerRef = React.useRef<AbortController | null>(null)

  // Update callback refs
  React.useEffect(() => {
    callbacksRef.current = {
      onWarning: config.onWarning,
      onCritical: config.onCritical,
      onExceeded: config.onExceeded,
      onAutoTrim: config.onAutoTrim,
    }
  }, [
    config.onWarning,
    config.onCritical,
    config.onExceeded,
    config.onAutoTrim,
  ])

  /**
   * Calculate tokens for a single text
   */
  const calculateTokens = React.useCallback(
    async (text: string): Promise<number> => {
      if (!text) return 0

      if (resolvedConfig.useAccurateTokenization) {
        try {
          // Use accurate token counting from AccurateTokenCounter
          const counter = new AccurateTokenCounter({
            model: config.model || 'gpt-4',
          })
          return counter.count(text)
        } catch {
          // Fall back to estimation
          return estimateTokens(text, config.model)
        }
      }

      return estimateTokens(text, config.model)
    },
    [resolvedConfig.useAccurateTokenization, config.model]
  )

  /**
   * Calculate total tokens for messages
   * Uses parallel token counting for improved performance
   */
  const calculateTotalTokens = React.useCallback(
    async (messages: BudgetMessage[]): Promise<number> => {
      if (messages.length === 0) return 0

      const TOKENS_PER_MESSAGE = 4 // Overhead per message

      // Calculate tokens in parallel for messages without pre-computed counts
      const tokenPromises = messages.map(async (msg) => {
        if (msg.tokens !== undefined) {
          return msg.tokens
        }
        return calculateTokens(msg.content)
      })

      const tokenCounts = await Promise.all(tokenPromises)

      // Sum all tokens plus overhead
      const contentTokens = tokenCounts.reduce((sum, tokens) => sum + tokens, 0)
      const overheadTokens = messages.length * TOKENS_PER_MESSAGE
      const primingTokens = 2

      return contentTokens + overheadTokens + primingTokens
    },
    [calculateTokens]
  )

  /**
   * Perform trimming to get below critical threshold
   */
  const performTrim = React.useCallback(
    (
      messages: BudgetMessage[],
      targetTokens: number,
      reason: TrimResult['reason']
    ): TrimResult | null => {
      const trimmableMessages = messages
        .map((msg, index) => ({ msg, index }))
        .filter(({ msg }) => msg.trimmable !== false && msg.role !== 'system')
        .sort((a, b) => (a.msg.priority ?? 0) - (b.msg.priority ?? 0))

      if (trimmableMessages.length === 0) return null

      const removedItems: TrimResult['removedItems'] = []
      let currentTokens = 0

      // Calculate current total
      for (const msg of messages) {
        currentTokens += msg.tokens ?? estimateTokens(msg.content, config.model)
      }

      // Keep removing until we're below target
      const indicesToRemove = new Set<number>()

      for (const { msg, index } of trimmableMessages) {
        if (currentTokens <= targetTokens) break

        const msgTokens =
          msg.tokens ?? estimateTokens(msg.content, config.model)
        indicesToRemove.add(index)
        currentTokens -= msgTokens

        removedItems.push({
          index,
          preview:
            msg.content.substring(0, 50) +
            (msg.content.length > 50 ? '...' : ''),
          tokens: msgTokens,
        })
      }

      if (removedItems.length === 0) return null

      const originalContent = messages.map((m) => m.content)
      const trimmedContent = messages
        .filter((_, index) => !indicesToRemove.has(index))
        .map((m) => m.content)

      return {
        originalContent,
        trimmedContent,
        tokensRemoved: removedItems.reduce((sum, item) => sum + item.tokens, 0),
        removedItems,
        reason,
      }
    },
    [config.model]
  )

  /**
   * Update usage state and trigger callbacks
   */
  const updateUsageState = React.useCallback(
    (currentTokens: number) => {
      const effectiveMax =
        resolvedConfig.maxInputTokens - resolvedConfig.reservedForOutput
      const utilizationPercent =
        effectiveMax > 0 ? (currentTokens / effectiveMax) * 100 : 0
      const status = calculateStatus(
        utilizationPercent,
        resolvedConfig.warningThreshold,
        resolvedConfig.criticalThreshold
      )
      const available = Math.max(0, effectiveMax - currentTokens)

      // Calculate exceeded percentage for UX (how much over budget)
      const exceededPercent =
        utilizationPercent > 100 ? utilizationPercent - 100 : 0

      const newUsage: TokenBudgetUsage = {
        current: currentTokens,
        max: resolvedConfig.maxInputTokens,
        available,
        utilizationPercent: Math.min(utilizationPercent, 100),
        exceededPercent,
        status,
        reservedForOutput: resolvedConfig.reservedForOutput,
        effectiveMax,
      }

      setUsage(newUsage)

      // Trigger callbacks only on status change
      const previousStatus = previousStatusRef.current
      if (status !== previousStatus) {
        if (status === 'warning' && previousStatus === 'safe') {
          callbacksRef.current.onWarning?.(newUsage)
        } else if (
          status === 'critical' &&
          (previousStatus === 'safe' || previousStatus === 'warning')
        ) {
          callbacksRef.current.onCritical?.(newUsage)
        } else if (status === 'exceeded') {
          callbacksRef.current.onExceeded?.(newUsage)
        }
        previousStatusRef.current = status
      }

      return { newUsage, status }
    },
    [resolvedConfig]
  )

  /**
   * Update messages and recalculate usage (debounced)
   */
  const updateMessages = React.useCallback(
    (messages: BudgetMessage[]) => {
      messagesRef.current = messages

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Abort any in-flight calculation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new AbortController for this calculation
      const controller = new AbortController()
      abortControllerRef.current = controller

      // Debounce the calculation
      debounceTimerRef.current = setTimeout(async () => {
        // Check if aborted before starting
        if (controller.signal.aborted) return

        setIsCalculating(true)

        try {
          const totalTokens = await calculateTotalTokens(messages)

          // Check if aborted after async operation
          if (controller.signal.aborted) return

          const { status } = updateUsageState(totalTokens)

          // Auto-trim if enabled and critical
          if (
            resolvedConfig.autoTrim &&
            (status === 'critical' || status === 'exceeded')
          ) {
            const effectiveMax =
              resolvedConfig.maxInputTokens - resolvedConfig.reservedForOutput
            const targetTokens =
              effectiveMax * resolvedConfig.criticalThreshold * 0.9 // Trim to 90% of critical
            const trimResult = performTrim(
              messages,
              targetTokens,
              status === 'exceeded' ? 'exceeded' : 'critical'
            )

            if (trimResult) {
              setLastTrimResult(trimResult)
              callbacksRef.current.onAutoTrim?.(trimResult)
            }
          }
        } finally {
          // Only update isCalculating if not aborted
          if (!controller.signal.aborted) {
            setIsCalculating(false)
          }
        }
      }, resolvedConfig.debounceMs)
    },
    [calculateTotalTokens, updateUsageState, resolvedConfig, performTrim]
  )

  /**
   * Check if adding tokens would exceed budget
   */
  const wouldExceed = React.useCallback(
    (additionalTokens: number): boolean => {
      const projectedTotal = usage.current + additionalTokens
      return projectedTotal > usage.effectiveMax
    },
    [usage]
  )

  /**
   * Manually trigger trim to get below critical
   */
  const trimToCritical = React.useCallback((): TrimResult | null => {
    const effectiveMax =
      resolvedConfig.maxInputTokens - resolvedConfig.reservedForOutput
    const targetTokens = effectiveMax * resolvedConfig.criticalThreshold * 0.9
    const result = performTrim(messagesRef.current, targetTokens, 'manual')

    if (result) {
      setLastTrimResult(result)
    }

    return result
  }, [resolvedConfig, performTrim])

  /**
   * Reset monitor state
   */
  const reset = React.useCallback(() => {
    setUsage(createInitialUsage(config))
    setLastTrimResult(null)
    previousStatusRef.current = 'safe'
    messagesRef.current = []
  }, [config])

  // Cleanup debounce timer and abort in-flight operations on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Derived state
  const isWarning = usage.status === 'warning'
  const isCritical = usage.status === 'critical'
  const isExceeded = usage.status === 'exceeded'

  return {
    usage,
    isWarning,
    isCritical,
    isExceeded,
    wouldExceed,
    calculateTokens,
    updateMessages,
    trimToCritical,
    reset,
    lastTrimResult,
    isCalculating,
  }
}

/**
 * Get color for status (for UI integration)
 */
export function getStatusColor(
  status: TokenUsageStatus
): 'green' | 'yellow' | 'orange' | 'red' {
  switch (status) {
    case 'safe':
      return 'green'
    case 'warning':
      return 'yellow'
    case 'critical':
      return 'orange'
    case 'exceeded':
      return 'red'
  }
}

/**
 * Format usage for display
 *
 * Shows exceeded percentage when over budget:
 * - Normal: "5,000 / 10,000 tokens (50.0%)"
 * - Exceeded: "15,000 / 10,000 tokens (100% + 50% over)"
 */
export function formatTokenUsage(usage: TokenBudgetUsage): string {
  const current = usage.current.toLocaleString()
  const max = usage.effectiveMax.toLocaleString()

  if (usage.exceededPercent > 0) {
    const exceeded = usage.exceededPercent.toFixed(1)
    return `${current} / ${max} tokens (100% + ${exceeded}% over)`
  }

  const percent = usage.utilizationPercent.toFixed(1)
  return `${current} / ${max} tokens (${percent}%)`
}

/**
 * Supported models for the budget monitor preset
 */
export type BudgetMonitorModel =
  // OpenAI GPT-4 Family
  | 'gpt-4o'
  | 'gpt-4-turbo'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  // OpenAI GPT-4.1 Family
  | 'gpt-4.1'
  | 'gpt-4.1-mini'
  | 'gpt-4.1-nano'
  // OpenAI O1/O3 Models
  | 'o1'
  | 'o1-mini'
  | 'o3-mini'
  // Anthropic Claude 3 Family
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  // Anthropic Claude 4 Family
  | 'claude-sonnet-4'
  | 'claude-opus-4'
  // Google Gemini Family
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  | 'gemini-2.0-flash'
  | 'gemini-2.0-pro'
  // DeepSeek Models
  | 'deepseek-chat'
  | 'deepseek-r1'
  // Mistral Models
  | 'mistral-large'
  | 'mistral-small'

/**
 * Set of valid budget monitor models for runtime validation
 */
const VALID_BUDGET_MONITOR_MODELS = new Set<string>([
  'gpt-4o',
  'gpt-4-turbo',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'o1',
  'o1-mini',
  'o3-mini',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku',
  'claude-3-5-sonnet',
  'claude-3-5-haiku',
  'claude-sonnet-4',
  'claude-opus-4',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-pro',
  'deepseek-chat',
  'deepseek-r1',
  'mistral-large',
  'mistral-small',
])

/**
 * Check if a model string is a valid BudgetMonitorModel
 *
 * @param model - The model string to validate
 * @returns True if the model is a supported BudgetMonitorModel
 *
 * @example
 * ```typescript
 * if (isValidBudgetMonitorModel(userInput)) {
 *   const config = createModelBudgetMonitor(userInput)
 * }
 * ```
 */
export function isValidBudgetMonitorModel(
  model: string
): model is BudgetMonitorModel {
  return VALID_BUDGET_MONITOR_MODELS.has(model)
}

/**
 * Get list of all supported budget monitor models
 */
export function getSupportedBudgetModels(): BudgetMonitorModel[] {
  return Array.from(VALID_BUDGET_MONITOR_MODELS) as BudgetMonitorModel[]
}

/**
 * Map BudgetMonitorModel to ModelName for tokenization
 * Returns undefined for models not supported by the accurate tokenizer
 */
function toModelName(model: BudgetMonitorModel): ModelName | undefined {
  // All BudgetMonitorModel values are currently valid ModelName values
  // This explicit mapping ensures type safety at runtime
  const modelNameMapping: Record<BudgetMonitorModel, ModelName> = {
    'gpt-4o': 'gpt-4o',
    'gpt-4-turbo': 'gpt-4-turbo',
    'gpt-4o-mini': 'gpt-4o-mini',
    'gpt-4.1': 'gpt-4.1',
    'gpt-4.1-mini': 'gpt-4.1-mini',
    'gpt-4.1-nano': 'gpt-4.1-nano',
    o1: 'o1',
    'o1-mini': 'o1-mini',
    'o3-mini': 'o3-mini',
    'claude-3-opus': 'claude-3-opus',
    'claude-3-sonnet': 'claude-3-sonnet',
    'claude-3-haiku': 'claude-3-haiku',
    'claude-3-5-sonnet': 'claude-3-5-sonnet',
    'claude-3-5-haiku': 'claude-3-5-haiku',
    'claude-sonnet-4': 'claude-sonnet-4',
    'claude-opus-4': 'claude-opus-4',
    'gemini-1.5-pro': 'gemini-1.5-pro',
    'gemini-1.5-flash': 'gemini-1.5-flash',
    'gemini-2.0-flash': 'gemini-2.0-flash',
    'gemini-2.0-pro': 'gemini-2.0-pro',
    'deepseek-chat': 'deepseek-chat',
    'deepseek-r1': 'deepseek-r1',
    'mistral-large': 'mistral-large',
    'mistral-small': 'mistral-small',
  }
  return modelNameMapping[model]
}

/**
 * Create a pre-configured monitor for common models
 *
 * Provides model-specific token limits and recommended output reservations
 * based on each model's capabilities and typical usage patterns.
 *
 * @param model - The model to create configuration for
 * @param overrides - Optional configuration overrides
 * @returns Token budget configuration for the specified model
 *
 * @example
 * ```typescript
 * // Basic usage
 * const config = createModelBudgetMonitor('gpt-4o')
 *
 * // With custom thresholds
 * const config = createModelBudgetMonitor('claude-sonnet-4', {
 *   warningThreshold: 0.7,
 *   autoTrim: true,
 * })
 * ```
 */
export function createModelBudgetMonitor(
  model: BudgetMonitorModel,
  overrides?: Partial<TokenBudgetConfig>
): TokenBudgetConfig {
  // Runtime validation for invalid models (helps catch typos and unsupported models)
  if (!isValidBudgetMonitorModel(model)) {
    const supported = getSupportedBudgetModels().join(', ')
    throw new Error(
      `[createModelBudgetMonitor] Unknown model: "${model}". ` +
        `Supported models: ${supported}`
    )
  }

  // Derive configuration from MODEL_REGISTRY (single source of truth)
  const registryConfig = MODEL_REGISTRY[model as ModelId]
  if (!registryConfig) {
    throw new Error(
      `[createModelBudgetMonitor] Model "${model}" not found in registry`
    )
  }

  return {
    maxInputTokens: registryConfig.contextWindow,
    reservedForOutput: registryConfig.recommendedOutputReserve,
    model: toModelName(model),
    ...overrides,
  } as TokenBudgetConfig
}

/**
 * Cost estimation for current token usage
 */
export interface TokenCostEstimate {
  /** Input cost in dollars */
  inputCost: number
  /** Estimated output cost in dollars (based on reserved tokens) */
  estimatedOutputCost: number
  /** Total estimated cost in dollars */
  totalCost: number
  /** Cost formatted as string (e.g., "$0.0025") */
  formattedCost: string
  /** Model used for pricing */
  model: string
}

/**
 * Estimate the cost of current token usage
 *
 * Integrates with model-pricing module for accurate cost estimation.
 *
 * @param usage - Current token usage from useTokenBudgetMonitor
 * @param model - Model for pricing lookup
 * @returns Cost estimate or null if pricing not available
 *
 * @example
 * ```typescript
 * const { usage } = useTokenBudgetMonitor(config)
 * const cost = estimateTokenCost(usage, 'gpt-4o')
 * console.log(cost?.formattedCost) // "$0.0125"
 * ```
 */
export function estimateTokenCost(
  usage: TokenBudgetUsage,
  model: BudgetMonitorModel
): TokenCostEstimate | null {
  const pricing = MODEL_PRICING[model]
  if (!pricing) {
    return null
  }

  const inputCost = (usage.current / 1_000_000) * pricing.inputCostPer1M
  const estimatedOutputCost =
    (usage.reservedForOutput / 1_000_000) * pricing.outputCostPer1M
  const totalCost = inputCost + estimatedOutputCost

  return {
    inputCost,
    estimatedOutputCost,
    totalCost,
    formattedCost: formatCost(totalCost),
    model,
  }
}

/**
 * Format cost as currency string
 */
function formatCost(cost: number): string {
  if (cost < 0.01) {
    // Show more precision for small costs
    return `$${cost.toFixed(4)}`
  }
  if (cost < 1) {
    return `$${cost.toFixed(3)}`
  }
  return `$${cost.toFixed(2)}`
}
