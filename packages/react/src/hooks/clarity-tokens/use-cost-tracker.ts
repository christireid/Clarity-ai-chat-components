'use client'

import * as React from 'react'
import {
  MODEL_REGISTRY,
  getModelConfig,
  isValidModelId,
} from '../../utils/tokenization/model-registry'

// =============================================================================
// Types
// =============================================================================

export interface LLMResponse {
  id: string
  provider: string
  model: string
  text: string
  usage?: { inputTokens: number; outputTokens: number; totalTokens: number }
}

export interface ModelPricing {
  inputPer1K: number
  outputPer1K: number
  cachedInputPer1K?: number
}

export interface CostEntry {
  timestamp: Date
  model: string
  provider: string
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  costUsd: number
  requestId?: string
}

export interface CostTotals {
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  costUsd: number
  requestCount: number
}

export interface UseCostTrackerConfig {
  /** Custom pricing overrides */
  pricing?: Record<string, ModelPricing>
  /** Enable persistence to localStorage */
  persist?: boolean
  /** Storage key for persistence */
  storageKey?: string
  /** Maximum entries to keep in history */
  maxHistoryEntries?: number
}

export interface UseCostTrackerReturn {
  /** Add a response to track */
  add: (
    res: LLMResponse,
    options?: { cached?: boolean; cachedTokens?: number }
  ) => void
  /** Get current totals */
  totals: () => CostTotals
  /** Get cost history */
  history: () => CostEntry[]
  /** Get totals by model */
  byModel: () => Record<string, CostTotals>
  /** Get totals by provider */
  byProvider: () => Record<string, CostTotals>
  /** Get totals for time period */
  forPeriod: (since: Date) => CostTotals
  /** Reset all tracking */
  reset: () => void
  /** Export data as JSON */
  exportJson: () => string
  /** Export data as CSV */
  exportCsv: () => string
  /** Estimate cost for planned request */
  estimate: (model: string, inputTokens: number, outputTokens: number) => number
}

// =============================================================================
// Error Classes
// =============================================================================

export class PricingMissingError extends Error {
  model: string

  constructor(model: string) {
    super(`Pricing not found for model: ${model}`)
    this.name = 'PricingMissingError'
    this.model = model
  }
}

// =============================================================================
// Default Pricing
// =============================================================================

function getDefaultPricing(): Record<string, ModelPricing> {
  const pricing: Record<string, ModelPricing> = {}

  // Extract pricing from MODEL_REGISTRY
  for (const [modelId, config] of Object.entries(MODEL_REGISTRY)) {
    pricing[modelId] = {
      inputPer1K: config.inputCostPer1M / 1000,
      outputPer1K: config.outputCostPer1M / 1000,
      cachedInputPer1K: config.cachedInputCostPer1M
        ? config.cachedInputCostPer1M / 1000
        : undefined,
    }
  }

  return pricing
}

// =============================================================================
// Storage Helpers
// =============================================================================

function loadFromStorage(key: string): CostEntry[] | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return null
    const data = JSON.parse(stored)
    return data.map((entry: CostEntry) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }))
  } catch {
    return null
  }
}

function saveToStorage(key: string, entries: CostEntry[]): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(entries))
  } catch {
    // Ignore storage errors
  }
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useCostTracker - Accumulates token usage and estimated cost
 *
 * Tracks all LLM responses and provides aggregated cost data
 * by model, provider, and time period.
 *
 * @example
 * ```tsx
 * const cost = useCostTracker({
 *   pricing: {
 *     'gpt-4o': { inputPer1K: 0.0025, outputPer1K: 0.01 }
 *   }
 * })
 *
 * // After each LLM call
 * cost.add(response)
 *
 * // Display totals
 * const { costUsd, inputTokens, outputTokens } = cost.totals()
 *
 * // Get costs for today
 * const today = new Date()
 * today.setHours(0, 0, 0, 0)
 * const todayCosts = cost.forPeriod(today)
 * ```
 */
export function useCostTracker(
  config: UseCostTrackerConfig = {}
): UseCostTrackerReturn {
  const {
    pricing: customPricing = {},
    persist = false,
    storageKey = 'clarity-tokens-cost-tracker',
    maxHistoryEntries = 1000,
  } = config

  // Merge default and custom pricing
  const pricing = React.useMemo(() => {
    return { ...getDefaultPricing(), ...customPricing }
  }, [customPricing])

  // State
  const [entries, setEntries] = React.useState<CostEntry[]>([])

  // Load persisted data on mount
  React.useEffect(() => {
    if (persist) {
      const stored = loadFromStorage(storageKey)
      if (stored) {
        setEntries(stored)
      }
    }
  }, [persist, storageKey])

  // Persist on changes
  React.useEffect(() => {
    if (persist && entries.length > 0) {
      saveToStorage(storageKey, entries)
    }
  }, [persist, storageKey, entries])

  /**
   * Get pricing for a model
   */
  const getPricing = React.useCallback(
    (model: string): ModelPricing => {
      // Check custom pricing first
      if (pricing[model]) {
        return pricing[model]
      }

      // Try to find in MODEL_REGISTRY
      if (isValidModelId(model)) {
        const modelConfig = getModelConfig(model)
        return {
          inputPer1K: modelConfig.inputCostPer1M / 1000,
          outputPer1K: modelConfig.outputCostPer1M / 1000,
          cachedInputPer1K: modelConfig.cachedInputCostPer1M
            ? modelConfig.cachedInputCostPer1M / 1000
            : undefined,
        }
      }

      // Return default fallback pricing
      return {
        inputPer1K: 0.003,
        outputPer1K: 0.015,
      }
    },
    [pricing]
  )

  /**
   * Calculate cost for tokens
   */
  const calculateCost = React.useCallback(
    (
      model: string,
      inputTokens: number,
      outputTokens: number,
      cachedTokens = 0
    ): number => {
      const modelPricing = getPricing(model)

      const inputCost =
        ((inputTokens - cachedTokens) / 1000) * modelPricing.inputPer1K
      const outputCost = (outputTokens / 1000) * modelPricing.outputPer1K
      const cachedCost = modelPricing.cachedInputPer1K
        ? (cachedTokens / 1000) * modelPricing.cachedInputPer1K
        : 0

      return inputCost + outputCost + cachedCost
    },
    [getPricing]
  )

  /**
   * Add a response to track
   */
  const add = React.useCallback(
    (
      res: LLMResponse,
      options?: { cached?: boolean; cachedTokens?: number }
    ) => {
      if (!res.usage) return

      const { inputTokens, outputTokens } = res.usage
      const cachedTokens =
        options?.cachedTokens ?? (options?.cached ? inputTokens : 0)

      const costUsd = calculateCost(
        res.model,
        inputTokens,
        outputTokens,
        cachedTokens
      )

      const entry: CostEntry = {
        timestamp: new Date(),
        model: res.model,
        provider: res.provider,
        inputTokens,
        outputTokens,
        cachedTokens,
        costUsd,
        requestId: res.id,
      }

      setEntries((prev) => {
        const updated = [...prev, entry]
        // Keep only the most recent entries
        if (updated.length > maxHistoryEntries) {
          return updated.slice(-maxHistoryEntries)
        }
        return updated
      })
    },
    [calculateCost, maxHistoryEntries]
  )

  /**
   * Get current totals
   */
  const totals = React.useCallback((): CostTotals => {
    return entries.reduce(
      (acc, entry) => ({
        inputTokens: acc.inputTokens + entry.inputTokens,
        outputTokens: acc.outputTokens + entry.outputTokens,
        cachedTokens: acc.cachedTokens + entry.cachedTokens,
        costUsd: acc.costUsd + entry.costUsd,
        requestCount: acc.requestCount + 1,
      }),
      {
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
        costUsd: 0,
        requestCount: 0,
      }
    )
  }, [entries])

  /**
   * Get cost history
   */
  const history = React.useCallback((): CostEntry[] => {
    return [...entries]
  }, [entries])

  /**
   * Get totals by model
   */
  const byModel = React.useCallback((): Record<string, CostTotals> => {
    return entries.reduce(
      (acc, entry) => {
        if (!acc[entry.model]) {
          acc[entry.model] = {
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            costUsd: 0,
            requestCount: 0,
          }
        }
        acc[entry.model].inputTokens += entry.inputTokens
        acc[entry.model].outputTokens += entry.outputTokens
        acc[entry.model].cachedTokens += entry.cachedTokens
        acc[entry.model].costUsd += entry.costUsd
        acc[entry.model].requestCount += 1
        return acc
      },
      {} as Record<string, CostTotals>
    )
  }, [entries])

  /**
   * Get totals by provider
   */
  const byProvider = React.useCallback((): Record<string, CostTotals> => {
    return entries.reduce(
      (acc, entry) => {
        if (!acc[entry.provider]) {
          acc[entry.provider] = {
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            costUsd: 0,
            requestCount: 0,
          }
        }
        acc[entry.provider].inputTokens += entry.inputTokens
        acc[entry.provider].outputTokens += entry.outputTokens
        acc[entry.provider].cachedTokens += entry.cachedTokens
        acc[entry.provider].costUsd += entry.costUsd
        acc[entry.provider].requestCount += 1
        return acc
      },
      {} as Record<string, CostTotals>
    )
  }, [entries])

  /**
   * Get totals for time period
   */
  const forPeriod = React.useCallback(
    (since: Date): CostTotals => {
      return entries
        .filter((entry) => entry.timestamp >= since)
        .reduce(
          (acc, entry) => ({
            inputTokens: acc.inputTokens + entry.inputTokens,
            outputTokens: acc.outputTokens + entry.outputTokens,
            cachedTokens: acc.cachedTokens + entry.cachedTokens,
            costUsd: acc.costUsd + entry.costUsd,
            requestCount: acc.requestCount + 1,
          }),
          {
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            costUsd: 0,
            requestCount: 0,
          }
        )
    },
    [entries]
  )

  /**
   * Reset all tracking
   */
  const reset = React.useCallback(() => {
    setEntries([])
    if (persist) {
      saveToStorage(storageKey, [])
    }
  }, [persist, storageKey])

  /**
   * Export data as JSON
   */
  const exportJson = React.useCallback((): string => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totals: totals(),
        byModel: byModel(),
        byProvider: byProvider(),
        history: entries,
      },
      null,
      2
    )
  }, [entries, totals, byModel, byProvider])

  /**
   * Export data as CSV
   */
  const exportCsv = React.useCallback((): string => {
    const headers = [
      'timestamp',
      'model',
      'provider',
      'inputTokens',
      'outputTokens',
      'cachedTokens',
      'costUsd',
      'requestId',
    ]
    const rows = entries.map((entry) => [
      entry.timestamp.toISOString(),
      entry.model,
      entry.provider,
      entry.inputTokens.toString(),
      entry.outputTokens.toString(),
      entry.cachedTokens.toString(),
      entry.costUsd.toFixed(6),
      entry.requestId ?? '',
    ])

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
  }, [entries])

  /**
   * Estimate cost for planned request
   */
  const estimate = React.useCallback(
    (model: string, inputTokens: number, outputTokens: number): number => {
      return calculateCost(model, inputTokens, outputTokens, 0)
    },
    [calculateCost]
  )

  return {
    add,
    totals,
    history,
    byModel,
    byProvider,
    forPeriod,
    reset,
    exportJson,
    exportCsv,
    estimate,
  }
}
