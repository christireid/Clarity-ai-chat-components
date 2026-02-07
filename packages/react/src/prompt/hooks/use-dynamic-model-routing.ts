/**
 * useDynamicModelRouting Hook
 *
 * Intelligently routes to different models based on:
 * - Token budget
 * - Cost budget
 * - Complexity of user request
 * - Memory depth required
 */

import { useMemo, useCallback } from 'react'
import type { CoreMessage } from '../../internal/hooks/use-chat-enhanced'
import type { ModelProfile } from '../core/model-profiles'
import {
  getModelProfileOrDefault,
  MODEL_PROFILES,
} from '../core/model-profiles'
import { estimateMessageTokens } from '../core/tokenizer'
import { shouldSwitchModelSync } from '../core/strategy-router'

/**
 * Context statistics for routing decisions
 */
export interface ContextStats {
  /** Current token count */
  currentTokens: number
  /** Message count */
  messageCount: number
  /** Estimated complexity (0-1) */
  complexity?: number
  /** Memory depth required */
  memoryDepth?: number
}

/**
 * Options for useDynamicModelRouting
 */
export interface UseDynamicModelRoutingOptions {
  /** Current model */
  currentModel: ModelProfile | string
  /** Target token budget */
  targetTokens?: number
  /** Cost budget in USD */
  costBudget?: number
  /** Messages for token estimation */
  messages?: CoreMessage[]
  /** Context statistics */
  contextStats?: ContextStats
}

/**
 * Model routing decision
 */
export interface ModelRoutingDecision {
  /** Recommended model */
  recommendedModel: string
  /** Current model */
  currentModel: string
  /** Should switch? */
  shouldSwitch: boolean
  /** Reasoning */
  reasoning: string
  /** Estimated cost savings (if switching) */
  costSavings?: number
  /** Token capacity improvement */
  tokenCapacityImprovement?: number
}

/**
 * Return value of useDynamicModelRouting
 */
export interface UseDynamicModelRoutingReturn {
  /** Current model profile */
  currentModelProfile: ModelProfile
  /** Routing decision */
  routingDecision: ModelRoutingDecision
  /** Choose model based on input and context */
  chooseModel: (
    input: string,
    contextStats?: ContextStats
  ) => ModelRoutingDecision
  /** Get all available models */
  getAvailableModels: () => ModelProfile[]
  /** Get models within cost budget */
  getModelsWithinBudget: (
    costBudget: number,
    estimatedTokens: number
  ) => ModelProfile[]
}

/**
 * Estimate request complexity (simple heuristic)
 */
function estimateComplexity(input: string, messageCount: number): number {
  // Simple heuristics
  const lengthScore = Math.min(1, input.length / 1000) // Longer = more complex
  const messageScore = Math.min(1, messageCount / 20) // More messages = more complex

  // Check for complex patterns
  const hasCode = /```[\s\S]*```/.test(input)
  const hasMultipleQuestions = (input.match(/\?/g) || []).length > 1
  const hasLists =
    input.split('\n').filter((l) => /^[-*•]\s/.test(l)).length > 3

  const patternScore =
    (hasCode ? 0.3 : 0) +
    (hasMultipleQuestions ? 0.2 : 0) +
    (hasLists ? 0.2 : 0)

  return Math.min(
    1,
    lengthScore * 0.3 + messageScore * 0.3 + patternScore * 0.4
  )
}

/**
 * Hook for dynamic model routing
 */
export function useDynamicModelRouting(
  options: UseDynamicModelRoutingOptions
): UseDynamicModelRoutingReturn {
  const {
    currentModel: currentModelOrName,
    targetTokens,
    costBudget,
    messages = [],
    contextStats,
  } = options

  const currentModelProfile =
    typeof currentModelOrName === 'string'
      ? getModelProfileOrDefault(currentModelOrName)
      : currentModelOrName

  // Calculate context stats if not provided
  const computedContextStats = useMemo<ContextStats>(() => {
    if (contextStats) {
      return contextStats
    }

    const currentTokens = estimateMessageTokens(
      messages,
      currentModelProfile.tokenizer
    )
    const messageCount = messages.length

    // Estimate complexity from last user message
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === 'user')
    const input = lastUserMessage
      ? typeof lastUserMessage.content === 'string'
        ? lastUserMessage.content
        : JSON.stringify(lastUserMessage.content)
      : ''

    const complexity = estimateComplexity(input, messageCount)

    return {
      currentTokens,
      messageCount,
      complexity,
      memoryDepth: messageCount > 10 ? 0.7 : messageCount > 5 ? 0.4 : 0.2,
    }
  }, [messages, currentModelProfile, contextStats])

  // Get routing decision
  const routingDecision = useMemo<ModelRoutingDecision>(() => {
    const switchDecision = shouldSwitchModelSync(
      currentModelProfile,
      targetTokens ?? currentModelProfile.maxTokens,
      costBudget,
      MODEL_PROFILES
    )

    if (switchDecision.shouldSwitch && switchDecision.recommendedModel) {
      const recommendedProfile = getModelProfileOrDefault(
        switchDecision.recommendedModel
      )

      // Calculate improvements
      const costSavings =
        costBudget &&
        currentModelProfile.costPer1K > recommendedProfile.costPer1K
          ? ((targetTokens ?? 0) / 1000) *
            (currentModelProfile.costPer1K - recommendedProfile.costPer1K)
          : undefined

      const tokenCapacityImprovement =
        recommendedProfile.maxTokens > currentModelProfile.maxTokens
          ? recommendedProfile.maxTokens - currentModelProfile.maxTokens
          : undefined

      return {
        recommendedModel: switchDecision.recommendedModel,
        currentModel: currentModelProfile.name,
        shouldSwitch: true,
        reasoning: switchDecision.reasoning,
        costSavings,
        tokenCapacityImprovement,
      }
    }

    return {
      recommendedModel: currentModelProfile.name,
      currentModel: currentModelProfile.name,
      shouldSwitch: false,
      reasoning: switchDecision.reasoning,
    }
  }, [currentModelProfile, targetTokens, costBudget])

  const chooseModel = useCallback(
    (
      input: string,
      customContextStats?: ContextStats
    ): ModelRoutingDecision => {
      const stats = customContextStats ?? computedContextStats
      const complexity = estimateComplexity(input, stats.messageCount)

      // For high complexity, prefer larger models
      if (complexity > 0.7 && currentModelProfile.maxTokens < 100000) {
        // Find larger model
        const largerModels = Object.values(MODEL_PROFILES).filter(
          (p) =>
            p.maxTokens >= 100000 && p.family === currentModelProfile.family
        )

        if (largerModels.length > 0) {
          const bestModel = largerModels.sort(
            (a, b) => b.maxTokens - a.maxTokens
          )[0]
          return {
            recommendedModel: bestModel.name,
            currentModel: currentModelProfile.name,
            shouldSwitch: true,
            reasoning: `High complexity request detected. Consider ${bestModel.name} for better handling.`,
            tokenCapacityImprovement:
              bestModel.maxTokens - currentModelProfile.maxTokens,
          }
        }
      }

      // For low complexity and cost constraints, prefer cheaper models
      if (complexity < 0.3 && costBudget) {
        const cheaperModels = Object.values(MODEL_PROFILES).filter(
          (p) =>
            p.costPer1K < currentModelProfile.costPer1K &&
            p.maxTokens >= stats.currentTokens * 1.2
        )

        if (cheaperModels.length > 0) {
          const cheapest = cheaperModels.sort(
            (a, b) => a.costPer1K - b.costPer1K
          )[0]
          const costSavings =
            (stats.currentTokens / 1000) *
            (currentModelProfile.costPer1K - cheapest.costPer1K)

          return {
            recommendedModel: cheapest.name,
            currentModel: currentModelProfile.name,
            shouldSwitch: true,
            reasoning: `Low complexity request. Consider ${cheapest.name} for cost savings.`,
            costSavings,
          }
        }
      }

      return routingDecision
    },
    [computedContextStats, currentModelProfile, costBudget, routingDecision]
  )

  const getAvailableModels = useCallback((): ModelProfile[] => {
    return Object.values(MODEL_PROFILES)
  }, [])

  const getModelsWithinBudget = useCallback(
    (budget: number, estimatedTokens: number): ModelProfile[] => {
      return Object.values(MODEL_PROFILES).filter((profile) => {
        const estimatedCost =
          (estimatedTokens / 1000) * profile.costPer1K +
          ((estimatedTokens * 0.3) / 1000) * profile.outputCostPer1K // Assume 30% output
        return estimatedCost <= budget && profile.maxTokens >= estimatedTokens
      })
    },
    []
  )

  return {
    currentModelProfile,
    routingDecision,
    chooseModel,
    getAvailableModels,
    getModelsWithinBudget,
  }
}
