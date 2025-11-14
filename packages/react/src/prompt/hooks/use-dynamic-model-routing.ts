/**
 * useDynamicModelRouting Hook
 * 
 * Intelligently routes to different models based on:
 * - Token budget
 * - Cost budget
 * - Complexity of request
 * - Memory depth required
 */

import { useMemo, useCallback } from 'react'
import type { ModelMetadata } from '../core/types'
import { estimateMessageArrayTokens } from '../core/token-estimation'
import { getModelSwitchRecommendation } from '../core/strategy-routing'
import { getModelProfile, getOrCreateModelProfile } from '../core/model-profiles'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'

/**
 * Available models for routing
 */
export interface AvailableModel {
  /** Model metadata */
  model: ModelMetadata
  /** Whether model is currently available */
  available?: boolean
  /** Priority for selection (higher = preferred) */
  priority?: number
}

/**
 * Hook options
 */
export interface UseDynamicModelRoutingOptions {
  /** Current messages */
  messages: CoreMessage[]
  /** Current model */
  currentModel: ModelMetadata
  /** Available models to route to */
  availableModels: AvailableModel[]
  /** Target token budget */
  targetTokens?: number
  /** Cost budget (optional) */
  costBudget?: number
  /** Enable auto-routing */
  autoRoute?: boolean
}

/**
 * Model routing decision
 */
export interface ModelRoutingDecision {
  /** Recommended model */
  recommendedModel: ModelMetadata
  /** Should switch models */
  shouldSwitch: boolean
  /** Reason for recommendation */
  reason: string
  /** Estimated cost savings */
  estimatedSavings?: number
  /** Current token count */
  currentTokens: number
  /** Can current model handle it */
  canCurrentModelHandle: boolean
}

/**
 * Hook return value
 */
export interface UseDynamicModelRoutingReturn {
  /** Routing decision */
  decision: ModelRoutingDecision
  /** Choose a model manually */
  chooseModel: (modelId: string) => ModelMetadata | null
  /** Get best model for current context */
  getBestModel: () => ModelMetadata
}

/**
 * Hook for dynamic model routing
 * 
 * @example
 * ```tsx
 * const { decision, getBestModel } = useDynamicModelRouting({
 *   messages: chatMessages,
 *   currentModel: { id: 'gpt-4', maxTokens: 8192 },
 *   availableModels: [
 *     { model: { id: 'gpt-4', maxTokens: 8192 } },
 *     { model: { id: 'gpt-4o-mini', maxTokens: 128000 } },
 *   ],
 *   targetTokens: 4000,
 *   costBudget: 0.10,
 * })
 * ```
 */
export function useDynamicModelRouting(
  options: UseDynamicModelRoutingOptions
): UseDynamicModelRoutingReturn {
  const {
    messages,
    currentModel,
    availableModels,
    targetTokens,
    costBudget,
  } = options

  // Estimate current tokens
  const currentTokens = useMemo(() => {
    return estimateMessageArrayTokens(messages, {
      model: currentModel.id,
    })
  }, [messages, currentModel.id])

  // Check if current model can handle it
  const canCurrentModelHandle = useMemo(() => {
    const profile = getOrCreateModelProfile(currentModel)
    return currentTokens <= profile.recommendedMaxInputTokens
  }, [currentModel, currentTokens])

  // Find best model
  const getBestModel = useCallback((): ModelMetadata => {
    // Filter available models
    const available = availableModels.filter(
      m => m.available !== false
    )

    if (available.length === 0) {
      return currentModel
    }

    // Score each model
    const scored = available.map(({ model, priority = 0 }) => {
      const profile = getOrCreateModelProfile(model)
      let score = priority

      // Check capacity
      const canHandle = currentTokens <= profile.recommendedMaxInputTokens
      if (!canHandle) {
        score -= 1000 // Heavy penalty
      } else {
        // Prefer models with more headroom
        const headroom = profile.recommendedMaxInputTokens - currentTokens
        score += headroom / 1000
      }

      // Prefer cheaper models
      if (model.inputPricePer1K) {
        const currentCost = currentModel.inputPricePer1K
          ? (currentTokens / 1000) * currentModel.inputPricePer1K
          : 0
        const modelCost = (currentTokens / 1000) * model.inputPricePer1K

        if (modelCost < currentCost) {
          score += 100 // Bonus for cheaper
        }
      }

      // Prefer models that meet cost budget
      if (costBudget && model.inputPricePer1K) {
        const estimatedCost = (currentTokens / 1000) * model.inputPricePer1K
        if (estimatedCost <= costBudget) {
          score += 50
        }
      }

      // Prefer models that meet token budget
      if (targetTokens && currentTokens <= targetTokens) {
        score += 25
      }

      return { model, score }
    })

    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score)

    // Return best model, or current if all are worse
    const best = scored[0]
    if (best && best.score > 0) {
      return best.model
    }

    return currentModel
  }, [
    availableModels,
    currentModel,
    currentTokens,
    targetTokens,
    costBudget,
  ])

  // Make routing decision
  const decision = useMemo((): ModelRoutingDecision => {
    const bestModel = getBestModel()
    const isCurrentModel = bestModel.id === currentModel.id

    if (isCurrentModel) {
      return {
        recommendedModel: currentModel,
        shouldSwitch: false,
        reason: canCurrentModelHandle
          ? 'Current model can handle the request'
          : 'Current model is best available option',
        currentTokens,
        canCurrentModelHandle,
      }
    }

    // Check if we should switch
    const recommendation = getModelSwitchRecommendation(
      currentModel,
      bestModel,
      currentTokens
    )

    // Calculate cost savings
    let estimatedSavings: number | undefined
    if (
      currentModel.inputPricePer1K &&
      bestModel.inputPricePer1K
    ) {
      const currentCost = (currentTokens / 1000) * currentModel.inputPricePer1K
      const bestCost = (currentTokens / 1000) * bestModel.inputPricePer1K
      estimatedSavings = currentCost - bestCost
    }

    return {
      recommendedModel: bestModel,
      shouldSwitch: recommendation.shouldSwitch,
      reason: recommendation.reason,
      estimatedSavings,
      currentTokens,
      canCurrentModelHandle,
    }
  }, [
    currentModel,
    getBestModel,
    currentTokens,
    canCurrentModelHandle,
  ])

  // Choose model manually
  const chooseModel = useCallback(
    (modelId: string): ModelMetadata | null => {
      const found = availableModels.find(
        m => m.model.id === modelId && m.available !== false
      )
      return found ? found.model : null
    },
    [availableModels]
  )

  return {
    decision,
    chooseModel,
    getBestModel,
  }
}
