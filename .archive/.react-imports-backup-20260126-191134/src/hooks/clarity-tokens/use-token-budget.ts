'use client'

import * as React from 'react'

// =============================================================================
// Types
// =============================================================================

export interface UseTokenBudgetConfig {
  /** Total session token budget */
  sessionBudgetTokens: number
  /** Enable persistence to localStorage */
  persist?: boolean
  /** Storage key for persistence */
  storageKey?: string
  /** Budget period (for analytics) */
  period?: 'session' | 'daily' | 'weekly' | 'monthly'
  /** Alert thresholds */
  alertThresholds?: {
    warning?: number // percentage (0-1)
    critical?: number // percentage (0-1)
  }
  /** Callback when threshold is exceeded */
  onThresholdExceeded?: (
    level: 'warning' | 'critical',
    remaining: number
  ) => void
}

export interface TokenUsageRecord {
  inputTokens: number
  outputTokens: number
  timestamp: Date
  model?: string
  requestId?: string
}

/**
 * Token budget status tracking
 *
 * Renamed from BudgetStatus to TokenBudgetStatus to avoid collision with
 * BudgetStatus interface in @clarity-chat/token-optimization cost module.
 */
export interface TokenBudgetStatus {
  remainingTokens: number
  usedTokens: number
  percentUsed: number
  isOverBudget: boolean
  alertLevel: 'none' | 'warning' | 'critical'
}

export interface UseTokenBudgetReturn {
  /** Remaining tokens in budget */
  remainingTokens: number
  /** Total tokens used this session */
  usedTokens: number
  /** Budget status */
  status: TokenBudgetStatus
  /** Register token usage */
  registerUsage: (usage: {
    inputTokens: number
    outputTokens: number
    model?: string
    requestId?: string
  }) => void
  /** Assert that planned tokens can be spent (throws if not) */
  assertCanSpend: (plannedInputTokens: number) => void
  /** Check if planned tokens can be spent (returns boolean) */
  canSpend: (plannedInputTokens: number) => boolean
  /** Reserve tokens (returns amount actually reserved) */
  reserve: (tokens: number) => { reserved: number; remaining: number }
  /** Release reserved tokens */
  release: (tokens: number) => void
  /** Get usage history */
  getHistory: () => TokenUsageRecord[]
  /** Reset budget */
  reset: () => void
  /** Current configuration */
  config: UseTokenBudgetConfig
}

// =============================================================================
// Error Classes
// =============================================================================

export class BudgetExceededError extends Error {
  plannedTokens: number
  remainingTokens: number

  constructor(plannedTokens: number, remainingTokens: number) {
    super(
      `Cannot spend ${plannedTokens} tokens: only ${remainingTokens} remaining in budget`
    )
    this.name = 'BudgetExceededError'
    this.plannedTokens = plannedTokens
    this.remainingTokens = remainingTokens
  }
}

// =============================================================================
// Storage Helpers
// =============================================================================

function loadFromStorage(
  key: string
): { used: number; history: TokenUsageRecord[] } | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return null
    const data = JSON.parse(stored)
    return {
      used: data.used ?? 0,
      history: (data.history ?? []).map((r: TokenUsageRecord) => ({
        ...r,
        timestamp: new Date(r.timestamp),
      })),
    }
  } catch {
    return null
  }
}

function saveToStorage(
  key: string,
  data: { used: number; history: TokenUsageRecord[] }
): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useTokenBudget - Tracks per-session token usage and enforces budget
 *
 * @deprecated Use `useTokenBudgetBar` instead for component-specific usage
 * The name `useTokenBudget` is ambiguous. For UI components like TokenBudgetBar,
 * use `useTokenBudgetBar`. For monitoring/analytics, use `useTokenBudgetTracking`
 * from @clarity-chat/token-optimization.
 * This hook will be removed in v3.0.0
 *
 * Migration:
 * ```diff
 * - import { useTokenBudget } from '@clarity-chat/react'
 * + import { useTokenBudgetBar } from '@clarity-chat/react'
 *
 * - const budget = useTokenBudget(config)
 * + const budget = useTokenBudgetBar(config)
 * ```
 *
 * Provides session-level token budget management with support for:
 * - Usage tracking and history
 * - Budget enforcement with assertCanSpend
 * - Warning/critical alert thresholds
 * - Optional persistence
 *
 * @example
 * ```tsx
 * function Chat() {
 *   const budget = useTokenBudget({
 *     sessionBudgetTokens: 200000,
 *     alertThresholds: { warning: 0.8, critical: 0.95 },
 *     onThresholdExceeded: (level) => {
 *       if (level === 'critical') toast.warning('Token budget almost exhausted!')
 *     }
 *   })
 *
 *   const handleSend = async () => {
 *     const estimatedTokens = estimateTokens(input)
 *
 *     // Throws if budget would be exceeded
 *     budget.assertCanSpend(estimatedTokens)
 *
 *     const response = await sendToLLM(input)
 *
 *     budget.registerUsage({
 *       inputTokens: response.usage.input,
 *       outputTokens: response.usage.output
 *     })
 *   }
 *
 *   return (
 *     <div>
 *       <span>
 *         Budget: {budget.remainingTokens} / {budget.config.sessionBudgetTokens}
 *       </span>
 *       {budget.status.alertLevel !== 'none' && (
 *         <Alert severity={budget.status.alertLevel}>
 *           {budget.status.percentUsed.toFixed(0)}% of budget used
 *         </Alert>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useTokenBudget(
  config: UseTokenBudgetConfig
): UseTokenBudgetReturn {
  // Runtime deprecation warning in development
  if (process.env['NODE_ENV'] === 'development') {
    // Only warn once per session
    const warningKey = 'useTokenBudget-deprecation-warned'
    if (typeof globalThis !== 'undefined' && !(globalThis as any)[warningKey]) {
      console.warn(
        '[Deprecation] useTokenBudget: This hook will be renamed to useTokenBudgetBar in v3.0.0. ' +
          'Please update your imports:\n' +
          '  - useTokenBudget → useTokenBudgetBar (for component/UI usage)\n' +
          '  See: https://github.com/clarity-ai/react#migration'
      )
      ;(globalThis as any)[warningKey] = true
    }
  }
  const {
    sessionBudgetTokens,
    persist = false,
    storageKey = 'clarity-tokens-budget',
    alertThresholds = { warning: 0.8, critical: 0.95 },
    onThresholdExceeded,
  } = config

  // State
  const [usedTokens, setUsedTokens] = React.useState(0)
  const [history, setHistory] = React.useState<TokenUsageRecord[]>([])
  const [reservedTokens, setReservedTokens] = React.useState(0)

  // Load persisted data
  React.useEffect(() => {
    if (persist) {
      const stored = loadFromStorage(storageKey)
      if (stored) {
        setUsedTokens(stored.used)
        setHistory(stored.history)
      }
    }
  }, [persist, storageKey])

  // Persist data on changes
  React.useEffect(() => {
    if (persist) {
      saveToStorage(storageKey, { used: usedTokens, history })
    }
  }, [persist, storageKey, usedTokens, history])

  /**
   * Calculate remaining tokens
   */
  const remainingTokens = React.useMemo(() => {
    return Math.max(0, sessionBudgetTokens - usedTokens - reservedTokens)
  }, [sessionBudgetTokens, usedTokens, reservedTokens])

  /**
   * Calculate budget status
   */
  const status = React.useMemo((): TokenBudgetStatus => {
    const percentUsed = usedTokens / sessionBudgetTokens
    const isOverBudget = usedTokens >= sessionBudgetTokens

    let alertLevel: 'none' | 'warning' | 'critical' = 'none'
    if (alertThresholds.critical && percentUsed >= alertThresholds.critical) {
      alertLevel = 'critical'
    } else if (
      alertThresholds.warning &&
      percentUsed >= alertThresholds.warning
    ) {
      alertLevel = 'warning'
    }

    return {
      remainingTokens,
      usedTokens,
      percentUsed: percentUsed * 100,
      isOverBudget,
      alertLevel,
    }
  }, [usedTokens, sessionBudgetTokens, remainingTokens, alertThresholds])

  // Track previous alert level for threshold callbacks
  const prevAlertLevelRef = React.useRef<'none' | 'warning' | 'critical'>(
    'none'
  )

  React.useEffect(() => {
    if (
      status.alertLevel !== prevAlertLevelRef.current &&
      status.alertLevel !== 'none'
    ) {
      onThresholdExceeded?.(status.alertLevel, remainingTokens)
    }
    prevAlertLevelRef.current = status.alertLevel
  }, [status.alertLevel, remainingTokens, onThresholdExceeded])

  /**
   * Register token usage
   */
  const registerUsage = React.useCallback(
    (usage: {
      inputTokens: number
      outputTokens: number
      model?: string
      requestId?: string
    }) => {
      const totalTokens = usage.inputTokens + usage.outputTokens

      setUsedTokens((prev) => prev + totalTokens)
      setHistory((prev) => [
        ...prev,
        {
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          timestamp: new Date(),
          model: usage.model,
          requestId: usage.requestId,
        },
      ])
    },
    []
  )

  /**
   * Assert that planned tokens can be spent
   */
  const assertCanSpend = React.useCallback(
    (plannedInputTokens: number) => {
      if (plannedInputTokens > remainingTokens) {
        throw new BudgetExceededError(plannedInputTokens, remainingTokens)
      }
    },
    [remainingTokens]
  )

  /**
   * Check if planned tokens can be spent
   */
  const canSpend = React.useCallback(
    (plannedInputTokens: number): boolean => {
      return plannedInputTokens <= remainingTokens
    },
    [remainingTokens]
  )

  /**
   * Reserve tokens
   */
  const reserve = React.useCallback(
    (tokens: number): { reserved: number; remaining: number } => {
      const available = remainingTokens
      const toReserve = Math.min(tokens, available)
      setReservedTokens((prev) => prev + toReserve)
      return {
        reserved: toReserve,
        remaining: available - toReserve,
      }
    },
    [remainingTokens]
  )

  /**
   * Release reserved tokens
   */
  const release = React.useCallback((tokens: number) => {
    setReservedTokens((prev) => Math.max(0, prev - tokens))
  }, [])

  /**
   * Get usage history
   */
  const getHistory = React.useCallback((): TokenUsageRecord[] => {
    return [...history]
  }, [history])

  /**
   * Reset budget
   */
  const reset = React.useCallback(() => {
    setUsedTokens(0)
    setReservedTokens(0)
    setHistory([])
    if (persist) {
      saveToStorage(storageKey, { used: 0, history: [] })
    }
  }, [persist, storageKey])

  return {
    remainingTokens,
    usedTokens,
    status,
    registerUsage,
    assertCanSpend,
    canSpend,
    reserve,
    release,
    getHistory,
    reset,
    config,
  }
}
