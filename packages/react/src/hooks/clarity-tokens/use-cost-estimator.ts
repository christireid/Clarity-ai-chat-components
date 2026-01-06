'use client'

import * as React from 'react'
import {
  calculateCost,
  estimateCostFromText,
  estimateCostFromMessages,
  formatCost as formatCostUtil,
  CostTracker,
  getModelConfig,
  storeCostTracking,
  getCostTracking,
  isIndexedDBAvailable,
} from '@clarity-chat/clarity-tokens'
import type { ModelIdentifier, ChatMessage, CostEstimate, CostTracking } from '@clarity-chat/clarity-tokens'
import type { UseCostEstimatorConfig, UseCostEstimatorReturn } from './types'

/**
 * useCostEstimator - Real-time cost estimation and tracking
 *
 * Estimates costs before API calls and tracks actual spending.
 * Maintains up-to-date pricing for OpenAI, Anthropic, Google,
 * and custom models. Supports persistent tracking.
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
 *
 * @example
 * ```tsx
 * // Compare costs across models
 * function ModelComparison() {
 *   const { estimate, getModelPricing } = useCostEstimator()
 *
 *   const models = ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet']
 *
 *   return (
 *     <table>
 *       {models.map(model => {
 *         const pricing = getModelPricing(model)
 *         const cost = estimate({ inputText: myText, model })
 *         return (
 *           <tr key={model}>
 *             <td>{model}</td>
 *             <td>${pricing.inputPer1M}/1M input</td>
 *             <td>${cost.totalCost.toFixed(4)}</td>
 *           </tr>
 *         )
 *       })}
 *     </table>
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

  // Cost tracker instance
  const trackerRef = React.useRef<CostTracker | null>(null)

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
  const [customPricing, setCustomPricing] = React.useState<
    Record<string, { inputPer1M: number; outputPer1M: number }>
  >(pricingOverrides)

  // Initialize tracker and load persisted data
  React.useEffect(() => {
    const initTracker = async () => {
      let initialData: CostTracking | null = null

      if (trackingPersistence && isIndexedDBAvailable()) {
        try {
          initialData = await getCostTracking()
        } catch {
          // Ignore IndexedDB errors
        }
      }

      trackerRef.current = new CostTracker(initialData ?? undefined)
      if (initialData) {
        setTracking(initialData)
      }
    }

    void initTracker()
  }, [trackingPersistence])

  /**
   * Estimate cost for input
   */
  const estimate = React.useCallback(
    (params: {
      inputText?: string
      inputTokens?: number
      messages?: ChatMessage[]
      model?: ModelIdentifier
      expectedOutputTokens?: number
    }): CostEstimate => {
      const model = params.model ?? defaultModel
      const expectedOutput = params.expectedOutputTokens ?? 500

      // Check for custom pricing
      const customPrice = customPricing[model]
      if (customPrice) {
        // Use custom pricing calculation
        const inputTokens = params.inputTokens ?? 0
        const inputCost = (inputTokens * customPrice.inputPer1M) / 1_000_000
        const outputCost = (expectedOutput * customPrice.outputPer1M) / 1_000_000

        return {
          inputCost,
          outputCost,
          totalCost: inputCost + outputCost,
          currency: 'USD',
          breakdown: {
            inputTokens,
            outputTokens: expectedOutput,
            cachedTokens: 0,
            pricePerInputToken: customPrice.inputPer1M / 1_000_000,
            pricePerOutputToken: customPrice.outputPer1M / 1_000_000,
          },
        }
      }

      if (params.messages) {
        return estimateCostFromMessages(params.messages, model, expectedOutput)
      }

      if (params.inputText) {
        return estimateCostFromText(params.inputText, model, expectedOutput)
      }

      if (params.inputTokens) {
        return calculateCost(params.inputTokens, expectedOutput, model)
      }

      return calculateCost(0, expectedOutput, model)
    },
    [defaultModel, customPricing]
  )

  /**
   * Record actual cost
   */
  const recordCost = React.useCallback(
    (params: {
      inputTokens: number
      outputTokens: number
      cachedTokens?: number
      model: ModelIdentifier
      category?: string
    }): void => {
      if (!trackerRef.current) return

      trackerRef.current.recordCost(params)
      const newTracking = trackerRef.current.getTracking()
      setTracking(newTracking)

      // Persist if enabled
      if (trackingPersistence && isIndexedDBAvailable()) {
        void storeCostTracking(newTracking).catch(() => {})
      }
    },
    [trackingPersistence]
  )

  /**
   * Get pricing for a model
   */
  const getModelPricing = React.useCallback(
    (
      model: ModelIdentifier
    ): {
      inputPer1M: number
      outputPer1M: number
      cachedInputPer1M?: number
      contextWindow: number
    } => {
      // Check custom pricing first
      const custom = customPricing[model]
      if (custom) {
        return {
          inputPer1M: custom.inputPer1M,
          outputPer1M: custom.outputPer1M,
          contextWindow: 4096, // Default for custom models
        }
      }

      const config = getModelConfig(model)
      return {
        inputPer1M: config.inputPer1M,
        outputPer1M: config.outputPer1M,
        cachedInputPer1M: config.cachedInputPer1M,
        contextWindow: config.contextWindow,
      }
    },
    [customPricing]
  )

  /**
   * Update custom pricing
   */
  const updatePricing = React.useCallback(
    (model: string, pricing: { inputPer1M: number; outputPer1M: number }): void => {
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
      return formatCostUtil(amount, currency)
    },
    [currency]
  )

  /**
   * Export tracking data
   */
  const exportTracking = React.useCallback(
    (format: 'json' | 'csv'): string => {
      if (!trackerRef.current) {
        return format === 'json' ? '{}' : ''
      }

      if (format === 'json') {
        return trackerRef.current.exportAsJson()
      }
      return trackerRef.current.exportAsCsv()
    },
    []
  )

  /**
   * Reset tracking
   */
  const resetTracking = React.useCallback((): void => {
    if (trackerRef.current) {
      trackerRef.current.reset()
      setTracking(trackerRef.current.getTracking())

      if (trackingPersistence && isIndexedDBAvailable()) {
        void storeCostTracking(trackerRef.current.getTracking()).catch(() => {})
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
