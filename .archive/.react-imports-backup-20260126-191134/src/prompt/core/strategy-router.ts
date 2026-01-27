/**
 * Adaptive Strategy Routing
 *
 * Intelligently chooses optimization strategy based on:
 * - Current token usage vs budget
 * - Cost constraints
 * - Model capabilities
 */

import { MODEL_PROFILES, getModelProfileOrDefault } from './model-profiles'
import type { ModelProfile } from './model-profiles'
import type { OptimizationStrategy } from './optimizer'
// Import stub type from prompt-optimizer until compression-chain is added back
import type { CompressionStrategy } from './engine/prompt-optimizer'

/**
 * Strategy selection result
 */
export interface StrategySelection {
  /** Primary optimization strategy */
  strategy: OptimizationStrategy
  /** Additional compression strategies */
  compressionStrategies: CompressionStrategy[]
  /** Reasoning for selection */
  reasoning: string
  /** Severity level (0-1) */
  severity: number
}

/**
 * Model switch recommendation
 */
export interface ModelSwitchRecommendation {
  /** Should switch models */
  shouldSwitch: boolean
  /** Recommended model name */
  recommendedModel?: string
  /** Reasoning */
  reasoning: string
  /** Estimated cost savings */
  costSavings?: number
}

/**
 * Choose optimization strategy based on current state
 */
export function chooseOptimizationStrategy(
  currentTokens: number,
  targetTokens: number,
  modelProfile?: ModelProfile
): StrategySelection {
  const ratio = currentTokens / targetTokens
  const compressionThreshold = modelProfile?.compressionThreshold ?? 0.85

  // Under compression threshold - no optimization needed
  if (ratio < compressionThreshold) {
    return {
      strategy: 'sliding-window', // Will be a no-op
      compressionStrategies: [],
      reasoning: `Token usage (${Math.round(ratio * 100)}%) is below threshold`,
      severity: 0,
    }
  }

  // Between threshold and 100% - light compression
  if (ratio <= 1.0) {
    return {
      strategy: 'sliding-window',
      compressionStrategies: ['semantic-grouping'],
      reasoning: `Token usage at ${Math.round(ratio * 100)}%, applying light compression`,
      severity: 0.3,
    }
  }

  // Between 100% and 130% - hybrid approach
  if (ratio <= 1.3) {
    return {
      strategy: 'hybrid',
      compressionStrategies: ['semantic-grouping', 'tool-condensing'],
      reasoning: `Token usage at ${Math.round(ratio * 100)}%, applying hybrid optimization`,
      severity: 0.6,
    }
  }

  // Over 130% - aggressive compression
  return {
    strategy: 'summarize-old',
    compressionStrategies: [
      'semantic-grouping',
      'tool-condensing',
      'intent-summarization',
    ],
    reasoning: `Token usage at ${Math.round(ratio * 100)}%, applying aggressive compression`,
    severity: 1.0,
  }
}

/**
 * Determine if model should be switched (async version with optional API call)
 */
export async function shouldSwitchModel(
  currentModel: ModelProfile | string,
  targetTokens: number,
  costBudget?: number,
  availableModels?: Record<string, ModelProfile>
): Promise<ModelSwitchRecommendation> {
  return shouldSwitchModelSync(
    currentModel,
    targetTokens,
    costBudget,
    availableModels
  )
}

/**
 * Determine if model should be switched (sync version)
 */
export function shouldSwitchModelSync(
  currentModel: ModelProfile | string,
  targetTokens: number,
  costBudget?: number,
  availableModels: Record<string, ModelProfile> = MODEL_PROFILES
): ModelSwitchRecommendation {
  const currentProfile =
    typeof currentModel === 'string'
      ? getModelProfileOrDefault(currentModel)
      : currentModel

  // Check if current model can handle the token budget
  const currentFits = currentProfile.maxTokens >= targetTokens

  if (!currentFits) {
    // Need a model with larger context
    const largerModels = Object.values(availableModels)
      .filter((p) => p.maxTokens >= targetTokens)
      .sort((a, b) => a.costPer1K - b.costPer1K) // Sort by cost

    if (largerModels.length > 0) {
      const recommended = largerModels[0]
      return {
        shouldSwitch: true,
        recommendedModel: recommended.name,
        reasoning: `Current model max tokens (${currentProfile.maxTokens}) is less than required (${targetTokens}). Recommending ${recommended.displayName} with ${recommended.maxTokens} token context.`,
      }
    }

    return {
      shouldSwitch: false,
      reasoning: `No available model can handle ${targetTokens} tokens. Consider reducing context.`,
    }
  }

  // Check cost constraints
  if (costBudget !== undefined) {
    const estimatedCost = (targetTokens / 1000) * currentProfile.costPer1K

    if (estimatedCost > costBudget) {
      // Find cheaper alternative
      const cheaperModels = Object.values(availableModels)
        .filter((p) => {
          const cost = (targetTokens / 1000) * p.costPer1K
          return cost <= costBudget && p.maxTokens >= targetTokens
        })
        .sort((a, b) => a.costPer1K - b.costPer1K)

      if (cheaperModels.length > 0) {
        const recommended = cheaperModels[0]
        const savings =
          (targetTokens / 1000) *
          (currentProfile.costPer1K - recommended.costPer1K)

        return {
          shouldSwitch: true,
          recommendedModel: recommended.name,
          reasoning: `Current model would cost $${estimatedCost.toFixed(4)} which exceeds budget of $${costBudget}. Recommending ${recommended.displayName} for $${((targetTokens / 1000) * recommended.costPer1K).toFixed(4)}.`,
          costSavings: savings,
        }
      }

      return {
        shouldSwitch: false,
        reasoning: `No model within cost budget of $${costBudget} for ${targetTokens} tokens.`,
      }
    }
  }

  // Check if there's a more cost-effective option with similar capabilities
  const alternatives = Object.values(availableModels)
    .filter(
      (p) =>
        p.name !== currentProfile.name &&
        p.maxTokens >= targetTokens &&
        p.costPer1K < currentProfile.costPer1K * 0.8 // At least 20% cheaper
    )
    .sort((a, b) => a.costPer1K - b.costPer1K)

  if (alternatives.length > 0) {
    const recommended = alternatives[0]
    const savings =
      (targetTokens / 1000) *
      (currentProfile.costPer1K - recommended.costPer1K)

    // Only recommend if savings are significant
    if (savings > 0.001) {
      return {
        shouldSwitch: true,
        recommendedModel: recommended.name,
        reasoning: `${recommended.displayName} offers similar capabilities at ${Math.round((1 - recommended.costPer1K / currentProfile.costPer1K) * 100)}% lower cost.`,
        costSavings: savings,
      }
    }
  }

  return {
    shouldSwitch: false,
    reasoning: `Current model ${currentProfile.displayName} is optimal for this request.`,
  }
}

/**
 * Analyze token capacity for routing decisions
 */
export function analyzeTokenCapacity(
  currentTokens: number,
  modelProfile: ModelProfile
): {
  utilization: number
  headroom: number
  canAcceptMore: boolean
  recommendedMaxAddition: number
} {
  const utilization = currentTokens / modelProfile.maxTokens
  const headroom = modelProfile.maxTokens - currentTokens
  const reserveForOutput = modelProfile.maxOutputTokens || 4096

  return {
    utilization,
    headroom,
    canAcceptMore: headroom > reserveForOutput * 1.5,
    recommendedMaxAddition: Math.max(0, headroom - reserveForOutput * 1.5),
  }
}

/**
 * Get routing recommendation for a request
 */
export function getRoutingRecommendation(
  estimatedInputTokens: number,
  estimatedOutputTokens: number,
  currentModel: ModelProfile | string,
  preferences: {
    preferSpeed?: boolean
    preferCost?: boolean
    preferQuality?: boolean
  } = {}
): {
  recommendedModel: string
  reasoning: string
  alternativeModels: string[]
} {
  const currentProfile =
    typeof currentModel === 'string'
      ? getModelProfileOrDefault(currentModel)
      : currentModel

  const totalTokens = estimatedInputTokens + estimatedOutputTokens

  // Filter models that can handle the request
  const viableModels = Object.values(MODEL_PROFILES).filter(
    (p) =>
      p.maxTokens >= totalTokens && p.maxOutputTokens >= estimatedOutputTokens
  )

  if (viableModels.length === 0) {
    return {
      recommendedModel: currentProfile.name,
      reasoning: 'No model can handle the estimated token requirements',
      alternativeModels: [],
    }
  }

  // Sort by preference
  let sortedModels: ModelProfile[]

  if (preferences.preferCost) {
    sortedModels = [...viableModels].sort((a, b) => a.costPer1K - b.costPer1K)
  } else if (preferences.preferSpeed) {
    // Prefer smaller, faster models
    sortedModels = [...viableModels].sort(
      (a, b) => a.costPer1K - b.costPer1K // Cheaper usually means faster
    )
  } else if (preferences.preferQuality) {
    // Prefer larger, more capable models
    sortedModels = [...viableModels].sort(
      (a, b) => b.costPer1K - a.costPer1K // More expensive usually means better
    )
  } else {
    // Balanced - prefer current model family if viable
    sortedModels = [...viableModels].sort((a, b) => {
      // Prefer same family
      if (a.family === currentProfile.family && b.family !== currentProfile.family) return -1
      if (b.family === currentProfile.family && a.family !== currentProfile.family) return 1
      // Then by cost
      return a.costPer1K - b.costPer1K
    })
  }

  const recommended = sortedModels[0]
  const alternatives = sortedModels.slice(1, 4).map((p) => p.name)

  let reasoning = `${recommended.displayName} `
  if (preferences.preferCost) {
    reasoning += `is the most cost-effective option at $${recommended.costPer1K}/1K tokens`
  } else if (preferences.preferSpeed) {
    reasoning += `offers good balance of speed and capability`
  } else if (preferences.preferQuality) {
    reasoning += `provides the highest quality responses`
  } else {
    reasoning += `is recommended based on balanced criteria`
  }

  return {
    recommendedModel: recommended.name,
    reasoning,
    alternativeModels: alternatives,
  }
}
