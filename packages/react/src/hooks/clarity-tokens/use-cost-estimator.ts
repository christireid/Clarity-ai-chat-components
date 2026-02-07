'use client'

import * as React from 'react'
import {
  CostAwareOptimizer,
  AccurateTokenCounter,
  type CostAwareConfig,
  type BudgetStatus,
} from '@clarity-chat/token-optimization'
import type { ChatMessage } from '@clarity-chat/token-optimization'
import {
  MODEL_REGISTRY,
  getModelConfig,
  isValidModelId,
  type ModelId,
} from '../../utils/tokenization/model-registry'
import type {
  UseCostEstimatorConfig,
  UseCostEstimatorReturn,
  CostEstimate,
  CostTracking,
} from './types'

/**
 * useCostEstimator - Real-time cost estimation and tracking
 *
 * Wraps CostAwareOptimizer from @clarity-chat/token-optimization and uses
 * the existing MODEL_REGISTRY for accurate pricing. Estimates costs before
 * API calls and tracks actual spending.
 *
 * @param config - Configuration options
 * @returns Cost estimation utilities and tracking data
 *
 * @example
 * ```tsx
 * function CostAwareChat() {
 *   const { estimate, recordCost, tracking, formatCost } = useCostEstimator({
 *     defaultModel: 'gpt-4o',
 *     currency: 'USD',
 *     trackingPersistence: true,
 *   })
 *
 *   const handleSend = async (message: string) => {
 *     // Estimate cost before sending
 *     const estimated = estimate({ inputText: message })
 *     console.log(`Estimated cost: ${formatCost(estimated.totalCost)}`)
 *
 *     // Make API call...
 *     const response = await sendMessage(message)
 *
 *     // Record actual cost
 *     recordCost({
 *       inputTokens: response.usage.prompt_tokens,
 *       outputTokens: response.usage.completion_tokens,
 *       model: 'gpt-4o',
 *     })
 *   }
 *
 *   return (
 *     <div>
 *       <span>Today's cost: {formatCost(tracking.today)}</span>
 *       <span>This month: {formatCost(tracking.thisMonth)}</span>
 *     </div>
 *   )
 * }
 * ```
 */
export function useCostEstimator(
  config: UseCostEstimatorConfig = {}
): UseCostEstimatorReturn {
  const {
    defaultModel = 'gpt-4o',
    pricingOverrides = {},
    currency = 'USD',
    trackingPersistence = true,
  } = config

  // Cost optimizer and token counter refs
  const optimizerRef = React.useRef<CostAwareOptimizer | null>(null)
  const counterRef = React.useRef<AccurateTokenCounter | null>(null)

  // State
  const [tracking, setTracking] = React.useState<CostTracking>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    allTime: 0,
    byModel: {},
    byCategory: {},
  })

  // Custom pricing overrides
  const [customPricing, setCustomPricing] =
    React.useState<Record<string, { inputPer1M: number; outputPer1M: number }>>(
      pricingOverrides
    )

  // Tracking history for persistence
  const trackingHistoryRef = React.useRef<
    Array<{
      timestamp: Date
      inputTokens: number
      outputTokens: number
      model: string
      cost: number
      category?: string
    }>
  >([])

  // Initialize optimizer and load persisted data
  React.useEffect(() => {
    const optimizerConfig: CostAwareConfig = {
      totalBudget: Infinity,
      enableCostPrediction: true,
      enableBudgetTracking: true,
      enableCostOptimization: true,
      costWeights: {
        tokenCost: 1,
        processingCost: 0.1,
        storageCost: 0.05,
        networkCost: 0.05,
      },
      budgetAlertThresholds: {
        warning: 0.8,
        critical: 0.95,
        emergency: 0.99,
      },
      enableRealTimeCostTracking: true,
      enableCostForecasting: false,
      enableAutomaticOptimization: true,
      optimizationStrategy: 'balanced',
    }

    optimizerRef.current = new CostAwareOptimizer(optimizerConfig)
    counterRef.current = new AccurateTokenCounter({
      model: defaultModel,
      enableCaching: true,
    })

    // Load persisted tracking data
    if (trackingPersistence && typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('clarity-tokens-cost-tracking')
        if (stored) {
          const data = JSON.parse(stored)
          setTracking(data)
        }
      } catch {
        // Ignore errors
      }
    }

    return () => {
      if (counterRef.current) {
        counterRef.current.destroy()
      }
    }
  }, [defaultModel, trackingPersistence])

  /**
   * Get model pricing from MODEL_REGISTRY or custom overrides
   */
  const getModelPricingInternal = React.useCallback(
    (model: ModelId) => {
      // Check custom pricing first
      const custom = customPricing[model]
      if (custom) {
        return {
          inputPer1M: custom.inputPer1M,
          outputPer1M: custom.outputPer1M,
          cachedInputPer1M: undefined,
          contextWindow: 128000,
        }
      }

      // Use existing MODEL_REGISTRY
      if (isValidModelId(model)) {
        const modelConfig = getModelConfig(model as ModelId)
        return {
          inputPer1M: modelConfig.inputCostPer1M,
          outputPer1M: modelConfig.outputCostPer1M,
          cachedInputPer1M: modelConfig.cachedInputCostPer1M,
          contextWindow: modelConfig.contextWindow,
        }
      }

      // Fallback for unknown models
      return {
        inputPer1M: 1.0,
        outputPer1M: 2.0,
        cachedInputPer1M: undefined,
        contextWindow: 128000,
      }
    },
    [customPricing]
  )

  /**
   * Count tokens using AccurateTokenCounter
   */
  const countTokens = React.useCallback((text: string): number => {
    if (counterRef.current) {
      return counterRef.current.count(text)
    }
    return Math.ceil(text.length / 4)
  }, [])

  /**
   * Estimate cost for input
   */
  const estimate = React.useCallback(
    (params: {
      inputText?: string
      inputTokens?: number
      messages?: ChatMessage[]
      model?: ModelId
      expectedOutputTokens?: number
    }): CostEstimate => {
      const model = params.model ?? defaultModel
      const expectedOutput = params.expectedOutputTokens ?? 500
      const pricing = getModelPricingInternal(model)

      // Calculate input tokens
      let inputTokens = params.inputTokens ?? 0
      if (params.inputText) {
        inputTokens = countTokens(params.inputText)
      } else if (params.messages) {
        inputTokens = params.messages.reduce(
          (sum, msg) => sum + countTokens(msg.content) + 4, // +4 for message overhead
          3 // +3 for conversation overhead
        )
      }

      // Calculate costs
      const inputCost = (inputTokens * pricing.inputPer1M) / 1_000_000
      const outputCost = (expectedOutput * pricing.outputPer1M) / 1_000_000

      return {
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
        currency: 'USD',
        breakdown: {
          inputTokens,
          outputTokens: expectedOutput,
          cachedTokens: 0,
          pricePerInputToken: pricing.inputPer1M / 1_000_000,
          pricePerOutputToken: pricing.outputPer1M / 1_000_000,
        },
      }
    },
    [defaultModel, getModelPricingInternal, countTokens]
  )

  /**
   * Record actual cost
   */
  const recordCost = React.useCallback(
    (params: {
      inputTokens: number
      outputTokens: number
      cachedTokens?: number
      model: ModelId
      category?: string
    }): void => {
      const pricing = getModelPricingInternal(params.model)

      // Calculate cost
      const inputCost = (params.inputTokens * pricing.inputPer1M) / 1_000_000
      const outputCost = (params.outputTokens * pricing.outputPer1M) / 1_000_000
      const cachedCost =
        params.cachedTokens && pricing.cachedInputPer1M
          ? (params.cachedTokens * pricing.cachedInputPer1M) / 1_000_000
          : 0
      const totalCost = inputCost + outputCost + cachedCost

      // Add to tracking history
      trackingHistoryRef.current.push({
        timestamp: new Date(),
        inputTokens: params.inputTokens,
        outputTokens: params.outputTokens,
        model: params.model,
        cost: totalCost,
        category: params.category,
      })

      // Update tracking state
      setTracking((prev) => {
        const updated: CostTracking = {
          today: prev.today + totalCost,
          thisWeek: prev.thisWeek + totalCost,
          thisMonth: prev.thisMonth + totalCost,
          allTime: prev.allTime + totalCost,
          byModel: {
            ...prev.byModel,
            [params.model]: (prev.byModel[params.model] ?? 0) + totalCost,
          },
          byCategory: params.category
            ? {
                ...prev.byCategory,
                [params.category]:
                  (prev.byCategory[params.category] ?? 0) + totalCost,
              }
            : prev.byCategory,
        }

        // Persist if enabled
        if (trackingPersistence && typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem(
              'clarity-tokens-cost-tracking',
              JSON.stringify(updated)
            )
          } catch {
            // Ignore errors
          }
        }

        return updated
      })
    },
    [getModelPricingInternal, trackingPersistence]
  )

  /**
   * Get pricing for a model
   */
  const getModelPricing = React.useCallback(
    (
      model: ModelId
    ): {
      inputPer1M: number
      outputPer1M: number
      cachedInputPer1M?: number
      contextWindow: number
    } => {
      return getModelPricingInternal(model)
    },
    [getModelPricingInternal]
  )

  /**
   * Update custom pricing
   */
  const updatePricing = React.useCallback(
    (
      model: string,
      pricing: { inputPer1M: number; outputPer1M: number }
    ): void => {
      setCustomPricing((prev) => ({
        ...prev,
        [model]: pricing,
      }))
    },
    []
  )

  /**
   * Format cost for display
   */
  const formatCost = React.useCallback(
    (amount: number): string => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      })
      return formatter.format(amount)
    },
    [currency]
  )

  /**
   * Export tracking data
   */
  const exportTracking = React.useCallback(
    (format: 'json' | 'csv'): string => {
      const history = trackingHistoryRef.current

      if (format === 'json') {
        return JSON.stringify({ tracking, history }, null, 2)
      }

      // CSV format
      const headers = 'timestamp,model,inputTokens,outputTokens,cost,category\n'
      const rows = history
        .map(
          (entry) =>
            `${entry.timestamp.toISOString()},${entry.model},${entry.inputTokens},${entry.outputTokens},${entry.cost.toFixed(6)},${entry.category ?? ''}`
        )
        .join('\n')

      return headers + rows
    },
    [tracking]
  )

  /**
   * Reset tracking
   */
  const resetTracking = React.useCallback((): void => {
    trackingHistoryRef.current = []
    setTracking({
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      allTime: 0,
      byModel: {},
      byCategory: {},
    })

    if (trackingPersistence && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('clarity-tokens-cost-tracking')
      } catch {
        // Ignore errors
      }
    }
  }, [trackingPersistence])

  return {
    estimate,
    recordCost,
    tracking,
    getModelPricing,
    updatePricing,
    formatCost,
    exportTracking,
    resetTracking,
  }
}
