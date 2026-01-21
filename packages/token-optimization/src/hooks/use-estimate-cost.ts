/**
 * useEstimateCost Hook
 *
 * React hook for real-time LLM cost estimation.
 * Calculates costs based on tokens, model pricing, and optimization strategies.
 *
 * @module use-estimate-cost
 */

import { useState, useCallback, useMemo } from 'react'
import { SimpleTokenCounter } from '../tokenizers/simple-counter'
import type { ConversationMessage } from '../compression/strategies/conversation-memory'

/**
 * Model pricing configuration
 */
export interface ModelPricing {
  /** Model identifier */
  model: string
  /** Input cost per 1M tokens (USD) */
  inputCostPer1M: number
  /** Output cost per 1M tokens (USD) */
  outputCostPer1M: number
}

/**
 * Cost estimate result
 */
export interface CostEstimate {
  /** Estimated input cost */
  inputCost: number
  /** Estimated output cost */
  outputCost: number
  /** Total estimated cost */
  totalCost: number
  /** Input token count */
  inputTokens: number
  /** Estimated output tokens */
  outputTokens: number
  /** Total tokens */
  totalTokens: number
  /** Cost per token (average) */
  costPerToken: number
}

/**
 * Cost breakdown by component
 */
export interface CostBreakdown {
  /** Base API call cost */
  baseCost: number
  /** Cost savings from context optimization */
  contextSavings: number
  /** Cost savings from caching */
  cacheSavings: number
  /** Cost savings from model routing */
  routingSavings: number
  /** Final cost after optimizations */
  finalCost: number
  /** Total savings percentage */
  savingsPercentage: number
}

/**
 * Configuration for useEstimateCost hook
 */
export interface UseEstimateCostConfig {
  /** Model pricing information */
  pricing: ModelPricing
  /** Estimated output tokens (default: 500) */
  estimatedOutputTokens?: number
  /** Cache hit rate (0-1) for savings calculation */
  cacheHitRate?: number
  /** Context optimization ratio (0-1, lower = more savings) */
  contextOptimizationRatio?: number
  /** Model routing savings (0-1) */
  routingSavingsRatio?: number
}

/**
 * Return type for useEstimateCost hook
 */
export interface UseEstimateCostReturn {
  /** Estimate cost for text */
  estimate: (text: string) => CostEstimate
  /** Estimate cost for messages */
  estimateMessages: (messages: ConversationMessage[]) => CostEstimate
  /** Get cost breakdown with optimizations */
  getBreakdown: (baseCost: number) => CostBreakdown
  /** Calculate cost for specific token counts */
  calculateCost: (inputTokens: number, outputTokens: number) => CostEstimate
  /** Current pricing */
  pricing: ModelPricing
  /** Update pricing */
  setPricing: (pricing: ModelPricing) => void
}

/**
 * Preset pricing for common models (as of Jan 2025)
 */
export const MODEL_PRICING_PRESETS: Record<string, ModelPricing> = {
  'gpt-4o': {
    model: 'gpt-4o',
    inputCostPer1M: 2.5,
    outputCostPer1M: 10,
  },
  'gpt-4o-mini': {
    model: 'gpt-4o-mini',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
  },
  'o1': {
    model: 'o1',
    inputCostPer1M: 15,
    outputCostPer1M: 60,
  },
  'claude-3-5-sonnet': {
    model: 'claude-3-5-sonnet-20241022',
    inputCostPer1M: 3,
    outputCostPer1M: 15,
  },
  'claude-3-5-haiku': {
    model: 'claude-3-5-haiku-20241022',
    inputCostPer1M: 0.8,
    outputCostPer1M: 4,
  },
  'claude-opus-4': {
    model: 'claude-opus-4-20250514',
    inputCostPer1M: 15,
    outputCostPer1M: 75,
  },
  'gemini-pro': {
    model: 'gemini-pro',
    inputCostPer1M: 1.25,
    outputCostPer1M: 5,
  },
  'gemini-flash': {
    model: 'gemini-1.5-flash',
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.3,
  },
}

/**
 * React hook for real-time cost estimation
 *
 * Provides accurate cost estimates for LLM API calls, including
 * savings from optimization strategies.
 *
 * @example Basic Usage
 * ```typescript
 * function CostDisplay({ text }: { text: string }) {
 *   const { estimate } = useEstimateCost({
 *     pricing: MODEL_PRICING_PRESETS['gpt-4o']
 *   })
 *
 *   const cost = estimate(text)
 *
 *   return (
 *     <div>
 *       <span>Estimated cost: ${cost.totalCost.toFixed(6)}</span>
 *       <span>{cost.totalTokens} tokens</span>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example With Optimizations
 * ```typescript
 * const { estimate, getBreakdown } = useEstimateCost({
 *   pricing: MODEL_PRICING_PRESETS['gpt-4o'],
 *   cacheHitRate: 0.6,
 *   contextOptimizationRatio: 0.5,
 *   routingSavingsRatio: 0.7,
 * })
 *
 * const baseCost = estimate(text).totalCost
 * const breakdown = getBreakdown(baseCost)
 *
 * console.log(`Without optimization: $${breakdown.baseCost.toFixed(6)}`)
 * console.log(`With optimization: $${breakdown.finalCost.toFixed(6)}`)
 * console.log(`Savings: ${breakdown.savingsPercentage.toFixed(1)}%`)
 * ```
 *
 * @example Message Cost Estimation
 * ```typescript
 * const { estimateMessages } = useEstimateCost({
 *   pricing: MODEL_PRICING_PRESETS['gpt-4o-mini']
 * })
 *
 * const messages = [
 *   { role: 'system', content: 'You are helpful' },
 *   { role: 'user', content: 'Hello' },
 *   { role: 'assistant', content: 'Hi! How can I help?' }
 * ]
 *
 * const cost = estimateMessages(messages)
 * console.log(`Conversation cost: $${cost.totalCost.toFixed(6)}`)
 * ```
 *
 * @param config - Hook configuration
 * @returns Hook state and methods
 */
export function useEstimateCost(config: UseEstimateCostConfig): UseEstimateCostReturn {
  const {
    pricing: initialPricing,
    estimatedOutputTokens = 500,
    cacheHitRate = 0,
    contextOptimizationRatio = 1,
    routingSavingsRatio = 1,
  } = config

  // State
  const [pricing, setPricing] = useState<ModelPricing>(initialPricing)

  // Token counter
  const tokenCounter = useMemo(() => new SimpleTokenCounter(), [])

  // Calculate cost for specific token counts
  const calculateCost = useCallback(
    (inputTokens: number, outputTokens: number): CostEstimate => {
      const inputCost = (inputTokens / 1_000_000) * pricing.inputCostPer1M
      const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPer1M
      const totalCost = inputCost + outputCost
      const totalTokens = inputTokens + outputTokens
      const costPerToken = totalTokens > 0 ? totalCost / totalTokens : 0

      return {
        inputCost,
        outputCost,
        totalCost,
        inputTokens,
        outputTokens,
        totalTokens,
        costPerToken,
      }
    },
    [pricing]
  )

  // Estimate cost for text
  const estimate = useCallback(
    (text: string): CostEstimate => {
      const inputTokens = tokenCounter.count(text)
      return calculateCost(inputTokens, estimatedOutputTokens)
    },
    [tokenCounter, calculateCost, estimatedOutputTokens]
  )

  // Estimate cost for messages
  const estimateMessages = useCallback(
    (messages: ConversationMessage[]): CostEstimate => {
      const inputTokens = messages.reduce((total, msg) => {
        return total + tokenCounter.count(msg.content)
      }, 0)

      return calculateCost(inputTokens, estimatedOutputTokens)
    },
    [tokenCounter, calculateCost, estimatedOutputTokens]
  )

  // Get cost breakdown with optimizations
  const getBreakdown = useCallback(
    (baseCost: number): CostBreakdown => {
      // Calculate savings from each optimization
      const contextSavings = baseCost * (1 - contextOptimizationRatio)
      const afterContext = baseCost - contextSavings

      const cacheSavings = afterContext * cacheHitRate * 0.9 // 90% savings on cache hits
      const afterCache = afterContext - cacheSavings

      const routingSavings = afterCache * (1 - routingSavingsRatio)
      const finalCost = afterCache - routingSavings

      const totalSavings = baseCost - finalCost
      const savingsPercentage = baseCost > 0 ? (totalSavings / baseCost) * 100 : 0

      return {
        baseCost,
        contextSavings,
        cacheSavings,
        routingSavings,
        finalCost,
        savingsPercentage,
      }
    },
    [cacheHitRate, contextOptimizationRatio, routingSavingsRatio]
  )

  return {
    estimate,
    estimateMessages,
    getBreakdown,
    calculateCost,
    pricing,
    setPricing,
  }
}

/**
 * Hook for tracking cumulative costs over time
 *
 * Useful for monitoring spend in production applications.
 *
 * @example
 * ```typescript
 * function CostTracker() {
 *   const {
 *     addCost,
 *     totalCost,
 *     reset,
 *     costHistory,
 *   } = useCumulativeCost()
 *
 *   const handleAPICall = async () => {
 *     const result = await callAPI()
 *     addCost(result.cost)
 *   }
 *
 *   return (
 *     <div>
 *       <h3>Total Spend: ${totalCost.toFixed(2)}</h3>
 *       <CostChart data={costHistory} />
 *       <Button onClick={reset}>Reset</Button>
 *     </div>
 *   )
 * }
 * ```
 */
export interface CostHistoryEntry {
  timestamp: number
  cost: number
  cumulativeCost: number
}

export interface UseCumulativeCostReturn {
  /** Add a cost entry */
  addCost: (cost: number, metadata?: Record<string, any>) => void
  /** Total cumulative cost */
  totalCost: number
  /** Number of API calls tracked */
  callCount: number
  /** Average cost per call */
  averageCost: number
  /** Cost history */
  costHistory: CostHistoryEntry[]
  /** Reset all costs */
  reset: () => void
  /** Get costs for time range */
  getCostsInRange: (startTime: number, endTime: number) => CostHistoryEntry[]
}

export function useCumulativeCost(): UseCumulativeCostReturn {
  const [costHistory, setCostHistory] = useState<CostHistoryEntry[]>([])

  const addCost = useCallback((cost: number, metadata?: Record<string, any>) => {
    setCostHistory((prev) => {
      const cumulativeCost = prev.length > 0 ? prev[prev.length - 1].cumulativeCost + cost : cost

      return [
        ...prev,
        {
          timestamp: Date.now(),
          cost,
          cumulativeCost,
          ...metadata,
        },
      ]
    })
  }, [])

  const reset = useCallback(() => {
    setCostHistory([])
  }, [])

  const getCostsInRange = useCallback(
    (startTime: number, endTime: number): CostHistoryEntry[] => {
      return costHistory.filter((entry) => entry.timestamp >= startTime && entry.timestamp <= endTime)
    },
    [costHistory]
  )

  const totalCost = useMemo(() => {
    return costHistory.length > 0 ? costHistory[costHistory.length - 1].cumulativeCost : 0
  }, [costHistory])

  const callCount = costHistory.length

  const averageCost = useMemo(() => {
    return callCount > 0 ? totalCost / callCount : 0
  }, [totalCost, callCount])

  return {
    addCost,
    totalCost,
    callCount,
    averageCost,
    costHistory,
    reset,
    getCostsInRange,
  }
}

/**
 * Hook for budget alerts
 *
 * Monitors costs and triggers alerts when thresholds are exceeded.
 *
 * @example
 * ```typescript
 * function BudgetMonitor() {
 *   const { addCost, alerts, dismiss } = useBudgetAlerts({
 *     dailyBudget: 10, // $10/day
 *     warningThreshold: 0.75,
 *     criticalThreshold: 0.9,
 *   })
 *
 *   return (
 *     <div>
 *       {alerts.map(alert => (
 *         <Alert key={alert.id} severity={alert.severity} onDismiss={() => dismiss(alert.id)}>
 *           {alert.message}
 *         </Alert>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export interface BudgetAlert {
  id: string
  severity: 'warning' | 'critical'
  message: string
  timestamp: number
  currentCost: number
  budget: number
  threshold: number
}

export interface UseBudgetAlertsConfig {
  /** Daily budget in USD */
  dailyBudget: number
  /** Warning threshold (0-1) */
  warningThreshold?: number
  /** Critical threshold (0-1) */
  criticalThreshold?: number
}

export interface UseBudgetAlertsReturn extends UseCumulativeCostReturn {
  /** Active alerts */
  alerts: BudgetAlert[]
  /** Dismiss an alert */
  dismiss: (alertId: string) => void
  /** Budget remaining */
  budgetRemaining: number
  /** Budget utilization (0-1) */
  budgetUtilization: number
}

export function useBudgetAlerts(config: UseBudgetAlertsConfig): UseBudgetAlertsReturn {
  const { dailyBudget, warningThreshold = 0.75, criticalThreshold = 0.9 } = config

  const cumulative = useCumulativeCost()
  const [alerts, setAlerts] = useState<BudgetAlert[]>([])

  const budgetUtilization = cumulative.totalCost / dailyBudget
  const budgetRemaining = Math.max(0, dailyBudget - cumulative.totalCost)

  // Check for threshold violations
  const addCost = useCallback(
    (cost: number, metadata?: Record<string, any>) => {
      cumulative.addCost(cost, metadata)

      const newTotal = cumulative.totalCost + cost
      const newUtilization = newTotal / dailyBudget

      // Check thresholds
      if (newUtilization >= criticalThreshold) {
        const alert: BudgetAlert = {
          id: `alert-${Date.now()}`,
          severity: 'critical',
          message: `Budget critical: $${newTotal.toFixed(2)} of $${dailyBudget} used (${(newUtilization * 100).toFixed(1)}%)`,
          timestamp: Date.now(),
          currentCost: newTotal,
          budget: dailyBudget,
          threshold: criticalThreshold,
        }
        setAlerts((prev) => [...prev, alert])
      } else if (newUtilization >= warningThreshold && cumulative.totalCost < dailyBudget * warningThreshold) {
        const alert: BudgetAlert = {
          id: `alert-${Date.now()}`,
          severity: 'warning',
          message: `Budget warning: $${newTotal.toFixed(2)} of $${dailyBudget} used (${(newUtilization * 100).toFixed(1)}%)`,
          timestamp: Date.now(),
          currentCost: newTotal,
          budget: dailyBudget,
          threshold: warningThreshold,
        }
        setAlerts((prev) => [...prev, alert])
      }
    },
    [cumulative, dailyBudget, warningThreshold, criticalThreshold]
  )

  const dismiss = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }, [])

  return {
    ...cumulative,
    addCost,
    alerts,
    dismiss,
    budgetRemaining,
    budgetUtilization,
  }
}
