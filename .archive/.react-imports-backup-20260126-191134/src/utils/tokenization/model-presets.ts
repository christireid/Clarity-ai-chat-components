import { AccurateTokenCounter as TokenCounter } from '@clarity-chat/token-optimization'

export interface ModelPreset {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'meta'
  contextWindow: number
  inputCostPer1K: number
  outputCostPer1K: number
  estimatedCharsPerToken: number
  maxTokens: number
  description: string
  useCases: string[]
  advantages: string[]
  limitations: string[]
}

export interface ModelComparison {
  model: ModelPreset
  tokenCount: number
  estimatedCost: number
  efficiency: number
  contextUsage: number
  recommendation: string
}

/**
 * Model-specific token counting presets and configurations
 */
export class ModelPresets {
  private static presets: Map<string, ModelPreset> = new Map([
    [
      'gpt-4',
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        contextWindow: 8192,
        inputCostPer1K: 0.03,
        outputCostPer1K: 0.06,
        estimatedCharsPerToken: 4.0,
        maxTokens: 8192,
        description:
          'Most capable GPT-4 model with broad general knowledge and domain expertise',
        useCases: [
          'Complex reasoning',
          'Creative writing',
          'Code generation',
          'Analysis',
        ],
        advantages: ['High accuracy', 'Broad knowledge', 'Strong reasoning'],
        limitations: ['Higher cost', 'Slower', 'Context limit'],
      },
    ],
    [
      'gpt-4-turbo',
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        contextWindow: 128000,
        inputCostPer1K: 0.01,
        outputCostPer1K: 0.03,
        estimatedCharsPerToken: 4.0,
        maxTokens: 128000,
        description:
          'Improved GPT-4 with larger context window and faster responses',
        useCases: [
          'Long documents',
          'Code review',
          'Complex analysis',
          'Multi-turn conversations',
        ],
        advantages: ['Large context', 'Faster', 'Better value'],
        limitations: ['Still expensive', 'May be overkill for simple tasks'],
      },
    ],
    [
      'gpt-4o',
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        contextWindow: 128000,
        inputCostPer1K: 0.005,
        outputCostPer1K: 0.015,
        estimatedCharsPerToken: 4.0,
        maxTokens: 128000,
        description:
          'Omni model with vision capabilities and improved performance',
        useCases: [
          'Vision tasks',
          'Multimodal',
          'General purpose',
          'Cost-effective',
        ],
        advantages: [
          'Vision support',
          'Fast',
          'Cost-effective',
          'Large context',
        ],
        limitations: ['Vision costs extra', 'Newer model'],
      },
    ],
    [
      'gpt-3.5-turbo',
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        contextWindow: 16384,
        inputCostPer1K: 0.0005,
        outputCostPer1K: 0.0015,
        estimatedCharsPerToken: 4.0,
        maxTokens: 16384,
        description: 'Fast and cost-effective model for simple tasks',
        useCases: [
          'Simple queries',
          'Data extraction',
          'Basic analysis',
          'Chat',
        ],
        advantages: ['Very fast', 'Very cheap', 'Good for simple tasks'],
        limitations: ['Lower accuracy', 'Limited reasoning', 'Smaller context'],
      },
    ],
    [
      'claude-3-opus',
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        contextWindow: 200000,
        inputCostPer1K: 0.015,
        outputCostPer1K: 0.075,
        estimatedCharsPerToken: 3.8,
        maxTokens: 200000,
        description: 'Most powerful Claude model with excellent reasoning',
        useCases: [
          'Complex analysis',
          'Creative writing',
          'Code review',
          'Research',
        ],
        advantages: ['Excellent reasoning', 'Large context', 'High accuracy'],
        limitations: ['Very expensive', 'Slower', 'May refuse some requests'],
      },
    ],
    [
      'claude-3-sonnet',
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        contextWindow: 200000,
        inputCostPer1K: 0.003,
        outputCostPer1K: 0.015,
        estimatedCharsPerToken: 3.8,
        maxTokens: 200000,
        description: 'Balanced Claude model with good performance and cost',
        useCases: ['General purpose', 'Analysis', 'Writing', 'Code generation'],
        advantages: ['Good balance', 'Large context', 'Reasonable cost'],
        limitations: ['Not as powerful as Opus', 'Still relatively expensive'],
      },
    ],
    [
      'claude-3-haiku',
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        contextWindow: 200000,
        inputCostPer1K: 0.00025,
        outputCostPer1K: 0.00125,
        estimatedCharsPerToken: 3.8,
        maxTokens: 200000,
        description: 'Fastest Claude model for simple tasks',
        useCases: [
          'Quick responses',
          'Simple analysis',
          'Data extraction',
          'Chat',
        ],
        advantages: ['Very fast', 'Very cheap', 'Large context'],
        limitations: ['Lower accuracy', 'Limited reasoning'],
      },
    ],
    [
      'gemini-pro',
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'google',
        contextWindow: 128000,
        inputCostPer1K: 0.0005,
        outputCostPer1K: 0.001,
        estimatedCharsPerToken: 4.0,
        maxTokens: 128000,
        description: "Google's multimodal model with strong performance",
        useCases: [
          'Multimodal',
          'Code generation',
          'Reasoning',
          'Creative tasks',
        ],
        advantages: ['Multimodal', 'Large context', 'Good performance'],
        limitations: [
          'Google ecosystem',
          'Variable quality',
          'Limited availability',
        ],
      },
    ],
    [
      'deepseek-chat',
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'deepseek',
        contextWindow: 128000,
        inputCostPer1K: 0.0002,
        outputCostPer1K: 0.0004,
        estimatedCharsPerToken: 4.0,
        maxTokens: 128000,
        description: 'Cost-effective model with strong coding capabilities',
        useCases: [
          'Code generation',
          'Technical tasks',
          'Cost-effective solutions',
        ],
        advantages: ['Very cheap', 'Good coding', 'Large context'],
        limitations: [
          'Less known',
          'Variable availability',
          'Limited features',
        ],
      },
    ],
    [
      'llama-3-70b',
      {
        id: 'llama-3-70b',
        name: 'Llama 3 70B',
        provider: 'meta',
        contextWindow: 8192,
        inputCostPer1K: 0.0007,
        outputCostPer1K: 0.0009,
        estimatedCharsPerToken: 3.5,
        maxTokens: 8192,
        description: 'Open-source model with strong performance',
        useCases: [
          'Open source',
          'Research',
          'Custom deployment',
          'Privacy-focused',
        ],
        advantages: [
          'Open source',
          'Customizable',
          'Privacy',
          'No vendor lock-in',
        ],
        limitations: ['Smaller context', 'Requires hosting', 'More setup'],
      },
    ],
  ])

  /**
   * Get all available model presets
   */
  public static getAllPresets(): ModelPreset[] {
    return Array.from(this.presets.values())
  }

  /**
   * Get preset by ID
   */
  public static getPreset(modelId: string): ModelPreset | undefined {
    return this.presets.get(modelId)
  }

  /**
   * Get presets by provider
   */
  public static getPresetsByProvider(
    provider: ModelPreset['provider']
  ): ModelPreset[] {
    return this.getAllPresets().filter((preset) => preset.provider === provider)
  }

  /**
   * Compare models for a given text
   */
  public static compareModels(
    text: string,
    modelIds?: string[]
  ): ModelComparison[] {
    const models = modelIds
      ? (modelIds
          .map((id) => this.getPreset(id))
          .filter(Boolean) as ModelPreset[])
      : this.getAllPresets()

    const comparisons: ModelComparison[] = []

    models.forEach((model) => {
      const tokenCount = TokenCounter.count(text)
      const estimatedCost = (tokenCount / 1000) * model.inputCostPer1K
      const efficiency = (text.length / tokenCount) * 100
      const contextUsage = (tokenCount / model.maxTokens) * 100

      let recommendation = ''
      if (tokenCount < 100) {
        recommendation = 'Consider cheaper models for short text'
      } else if (tokenCount > 50000) {
        recommendation = 'Use models with larger context windows'
      } else if (estimatedCost > 0.1) {
        recommendation = 'Consider cost optimization'
      } else {
        recommendation = 'Good balance of cost and performance'
      }

      comparisons.push({
        model,
        tokenCount,
        estimatedCost,
        efficiency,
        contextUsage,
        recommendation,
      })
    })

    return comparisons.sort((a, b) => a.estimatedCost - b.estimatedCost)
  }

  /**
   * Recommend best model for text
   */
  public static recommendModel(
    text: string,
    priorities: {
      cost?: number
      speed?: number
      accuracy?: number
      context?: number
    } = {}
  ): ModelPreset {
    const comparisons = this.compareModels(text)

    // Default priorities
    const weights = {
      cost: priorities.cost ?? 0.4,
      speed: priorities.speed ?? 0.2,
      accuracy: priorities.accuracy ?? 0.3,
      context: priorities.context ?? 0.1,
    }

    let bestModel = comparisons[0]
    let bestScore = 0

    comparisons.forEach((comparison) => {
      const costScore =
        comparison.estimatedCost < 0.01
          ? 1
          : 1 / (comparison.estimatedCost * 100)
      const speedScore =
        comparison.model.name.includes('turbo') ||
        comparison.model.name.includes('haiku')
          ? 1
          : 0.7
      const accuracyScore =
        comparison.model.name.includes('gpt-4') ||
        comparison.model.name.includes('opus')
          ? 1
          : 0.8
      const contextScore = comparison.contextUsage < 50 ? 1 : 0.5

      const score =
        costScore * weights.cost +
        speedScore * weights.speed +
        accuracyScore * weights.accuracy +
        contextScore * weights.context

      if (score > bestScore) {
        bestScore = score
        bestModel = comparison
      }
    })

    return bestModel.model
  }

  /**
   * Get cost estimate for text
   */
  public static estimateCost(
    text: string,
    modelId: string,
    options: {
      includeOutput?: boolean
      outputRatio?: number
    } = {}
  ): {
    inputCost: number
    outputCost: number
    totalCost: number
    tokens: number
  } {
    const model = this.getPreset(modelId)
    if (!model) {
      throw new Error(`Model ${modelId} not found`)
    }

    const tokens = TokenCounter.count(text)
    const inputCost = (tokens / 1000) * model.inputCostPer1K

    let outputCost = 0
    if (options.includeOutput) {
      const outputTokens = Math.floor(tokens * (options.outputRatio || 1.5))
      outputCost = (outputTokens / 1000) * model.outputCostPer1K
    }

    return {
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost,
      tokens,
    }
  }

  /**
   * Get model info for display
   */
  public static getModelInfo(modelId: string): {
    preset: ModelPreset
    displayName: string
    costPerToken: number
    efficiency: string
    recommendation: string
  } {
    const preset = this.getPreset(modelId)
    if (!preset) {
      throw new Error(`Model ${modelId} not found`)
    }

    const costPerToken = preset.inputCostPer1K / 1000
    const efficiency = `${preset.estimatedCharsPerToken.toFixed(1)} chars/token`

    let recommendation = ''
    if (preset.inputCostPer1K < 0.001) {
      recommendation = 'Best for high-volume, cost-sensitive applications'
    } else if (preset.inputCostPer1K < 0.01) {
      recommendation = 'Good balance of cost and performance'
    } else {
      recommendation = 'Premium model for high-accuracy requirements'
    }

    return {
      preset,
      displayName: preset.name,
      costPerToken,
      efficiency,
      recommendation,
    }
  }

  /**
   * Validate model choice
   */
  public static validateModelChoice(
    text: string,
    modelId: string,
    constraints: {
      maxCost?: number
      maxTokens?: number
      minAccuracy?: number
    } = {}
  ): {
    isValid: boolean
    issues: string[]
    suggestions: string[]
    alternatives: ModelPreset[]
  } {
    const model = this.getPreset(modelId)
    if (!model) {
      return {
        isValid: false,
        issues: [`Model ${modelId} not found`],
        suggestions: [],
        alternatives: [],
      }
    }

    const costEstimate = this.estimateCost(text, modelId)
    const tokens = costEstimate.tokens
    const issues: string[] = []
    const suggestions: string[] = []
    const alternatives: ModelPreset[] = []

    // Check cost constraint
    if (constraints.maxCost && costEstimate.totalCost > constraints.maxCost) {
      issues.push(
        `Cost exceeds limit: $${costEstimate.totalCost.toFixed(4)} > $${constraints.maxCost}`
      )
      suggestions.push(
        'Consider using a cheaper model like GPT-3.5 Turbo or Claude Haiku'
      )
      alternatives.push(
        this.getPreset('gpt-3.5-turbo')!,
        this.getPreset('claude-3-haiku')!
      )
    }

    // Check token constraint
    if (constraints.maxTokens && tokens > constraints.maxTokens) {
      issues.push(
        `Token count exceeds limit: ${tokens} > ${constraints.maxTokens}`
      )
      suggestions.push(
        'Consider truncating the text or using a model with larger context'
      )
    }

    // Check context window
    if (tokens > model.maxTokens) {
      issues.push(
        `Text exceeds model context window: ${tokens} > ${model.maxTokens}`
      )
      suggestions.push(
        'Consider using a model with larger context window like GPT-4 Turbo or Claude'
      )
      alternatives.push(
        this.getPreset('gpt-4-turbo')!,
        this.getPreset('claude-3-sonnet')!
      )
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
      alternatives: [...new Set(alternatives)], // Remove duplicates
    }
  }
}

// Export singleton-like instance
export const modelPresets = ModelPresets

// Convenience functions
export function getModelPreset(modelId: string): ModelPreset | undefined {
  return ModelPresets.getPreset(modelId)
}

export function compareModelsForText(
  text: string,
  modelIds?: string[]
): ModelComparison[] {
  return ModelPresets.compareModels(text, modelIds)
}

export function recommendModelForText(
  text: string,
  priorities?: {
    cost?: number
    speed?: number
    accuracy?: number
    context?: number
  }
): ModelPreset {
  return ModelPresets.recommendModel(text, priorities)
}

export function estimateTextCost(
  text: string,
  modelId: string,
  options?: { includeOutput?: boolean; outputRatio?: number }
): {
  inputCost: number
  outputCost: number
  totalCost: number
  tokens: number
} {
  return ModelPresets.estimateCost(text, modelId, options)
}
