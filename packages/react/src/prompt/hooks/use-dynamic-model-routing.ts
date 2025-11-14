/**
 * useDynamicModelRouting Hook
 * 
 * Intelligently route to different models based on context and requirements
 */

import { useState, useCallback, useMemo } from 'react'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import {
  chooseModel,
  getModelProfile,
  type ModelProfile,
  type ModelRoutingCriteria,
  type ModelRoutingResult,
} from '../core/model-profiles'
import { estimatePromptTokens } from '../core/tokenizer'
import { calculateTotalCost } from '../core/utils'

export interface UseDynamicModelRoutingOptions {
  /** Current messages */
  messages: CoreMessage[]
  /** Current model */
  currentModel?: ModelProfile | string
  /** Routing criteria */
  criteria?: ModelRoutingCriteria
  /** Available models (defaults to all built-in models) */
  availableModels?: ModelProfile[]
  /** Whether to auto-route on changes */
  autoRoute?: boolean
}

export interface UseDynamicModelRoutingReturn {
  /** Recommended model */
  recommendedModel: ModelProfile | null
  /** Routing result */
  routingResult: ModelRoutingResult | null
  /** Whether routing is available */
  isAvailable: boolean
  /** Manually trigger routing */
  route: (criteria?: ModelRoutingCriteria) => ModelRoutingResult | null
}

/**
 * Hook for dynamic model routing
 */
export function useDynamicModelRouting(
  options: UseDynamicModelRoutingOptions
): UseDynamicModelRoutingReturn {
  const {
    messages,
    currentModel,
    criteria: initialCriteria,
    availableModels,
    autoRoute = true,
  } = options

  const [routingResult, setRoutingResult] = useState<ModelRoutingResult | null>(null)

  // Calculate context stats
  const contextStats = useMemo(() => {
    if (messages.length === 0) return null

    // Estimate tokens for current messages
    const currentProfile = typeof currentModel === 'string'
      ? getModelProfile(currentModel)
      : currentModel

    if (!currentProfile) return null

    const tokenEstimate = estimatePromptTokens(messages, currentProfile)
    const costEstimate = calculateTotalCost(tokenEstimate.tokens, currentProfile)

    // Estimate complexity (simple heuristic)
    const avgMessageLength = messages.reduce(
      (sum, msg) => sum + (typeof msg.content === 'string' ? msg.content.length : 100),
      0
    ) / messages.length

    const complexity = Math.min(1.0, avgMessageLength / 1000)

    return {
      tokens: tokenEstimate.tokens,
      cost: costEstimate,
      complexity,
      messageCount: messages.length,
    }
  }, [messages, currentModel])

  // Route function
  const route = useCallback(
    (criteria?: ModelRoutingCriteria): ModelRoutingResult | null => {
      const routingCriteria: ModelRoutingCriteria = {
        ...initialCriteria,
        ...criteria,
        // Auto-fill from context stats if available
        ...(contextStats && {
          tokenBudget: criteria?.tokenBudget || contextStats.tokens,
          costBudget: criteria?.costBudget || contextStats.cost,
          complexity: criteria?.complexity || contextStats.complexity,
        }),
      }

      const result = chooseModel(routingCriteria, availableModels)
      setRoutingResult(result)
      return result
    },
    [initialCriteria, contextStats, availableModels]
  )

  // Auto-route when criteria or messages change
  useMemo(() => {
    if (autoRoute && contextStats) {
      route()
    }
  }, [autoRoute, contextStats, route])

  const recommendedModel = routingResult?.recommendedModel || null

  return {
    recommendedModel,
    routingResult,
    isAvailable: contextStats !== null,
    route,
  }
}
