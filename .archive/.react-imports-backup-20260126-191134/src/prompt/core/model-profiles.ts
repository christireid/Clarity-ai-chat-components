/**
 * Model Capability Profiles
 *
 * Detailed profiles for different AI models including:
 * - Token limits and pricing
 * - Optimal prompt styles
 * - Compression thresholds
 * - Feature capabilities
 */

import { ApproximateTokenizer, ClaudeTokenizer } from './tokenizer'
import type { Tokenizer } from './tokenizer'

/**
 * Prompt style preference
 */
export type PromptStyle = 'concise' | 'dense' | 'structured' | 'verbose'

/**
 * Model family identifier
 */
export type ModelFamily = 'openai' | 'anthropic' | 'google' | 'mistral' | 'meta' | 'other'

/**
 * Model capability profile
 */
export interface ModelProfile {
  /** Model identifier */
  name: string
  /** Display name */
  displayName: string
  /** Model family */
  family: ModelFamily
  /** Maximum context tokens */
  maxTokens: number
  /** Maximum output tokens */
  maxOutputTokens: number
  /** Tokenizer to use */
  tokenizer: Tokenizer
  /** Input cost per 1K tokens */
  costPer1K: number
  /** Output cost per 1K tokens */
  outputCostPer1K: number
  /** Optimal prompt style for this model */
  optimalPromptStyle: PromptStyle
  /** Compression threshold (0-1, start compressing at this utilization) */
  compressionThreshold: number
  /** Feature flags */
  features: {
    /** Supports function/tool calling */
    functions: boolean
    /** Supports streaming */
    streaming: boolean
    /** Supports vision/images */
    vision: boolean
    /** Supports JSON mode */
    jsonMode: boolean
  }
  /** Model-specific notes */
  notes?: string
}

const defaultTokenizer = new ApproximateTokenizer(4)
const claudeTokenizer = new ClaudeTokenizer()

/**
 * Model profiles for common models
 */
export const MODEL_PROFILES: Record<string, ModelProfile> = {
  // OpenAI GPT-4 family
  'gpt-4': {
    name: 'gpt-4',
    displayName: 'GPT-4',
    family: 'openai',
    maxTokens: 8192,
    maxOutputTokens: 4096,
    tokenizer: defaultTokenizer,
    costPer1K: 0.03,
    outputCostPer1K: 0.06,
    optimalPromptStyle: 'structured',
    compressionThreshold: 0.75,
    features: {
      functions: true,
      streaming: true,
      vision: false,
      jsonMode: true,
    },
  },
  'gpt-4-turbo': {
    name: 'gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    family: 'openai',
    maxTokens: 128000,
    maxOutputTokens: 4096,
    tokenizer: defaultTokenizer,
    costPer1K: 0.01,
    outputCostPer1K: 0.03,
    optimalPromptStyle: 'structured',
    compressionThreshold: 0.85,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: true,
    },
  },
  'gpt-4o': {
    name: 'gpt-4o',
    displayName: 'GPT-4o',
    family: 'openai',
    maxTokens: 128000,
    maxOutputTokens: 16384,
    tokenizer: defaultTokenizer,
    costPer1K: 0.005,
    outputCostPer1K: 0.015,
    optimalPromptStyle: 'structured',
    compressionThreshold: 0.85,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: true,
    },
  },
  'gpt-4o-mini': {
    name: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    family: 'openai',
    maxTokens: 128000,
    maxOutputTokens: 16384,
    tokenizer: defaultTokenizer,
    costPer1K: 0.00015,
    outputCostPer1K: 0.0006,
    optimalPromptStyle: 'concise',
    compressionThreshold: 0.9,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: true,
    },
  },
  'gpt-4.1': {
    name: 'gpt-4.1',
    displayName: 'GPT-4.1',
    family: 'openai',
    maxTokens: 1000000,
    maxOutputTokens: 32768,
    tokenizer: defaultTokenizer,
    costPer1K: 0.002,
    outputCostPer1K: 0.008,
    optimalPromptStyle: 'structured',
    compressionThreshold: 0.9,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: true,
    },
  },
  'gpt-4.1-mini': {
    name: 'gpt-4.1-mini',
    displayName: 'GPT-4.1 Mini',
    family: 'openai',
    maxTokens: 1000000,
    maxOutputTokens: 32768,
    tokenizer: defaultTokenizer,
    costPer1K: 0.0004,
    outputCostPer1K: 0.0016,
    optimalPromptStyle: 'concise',
    compressionThreshold: 0.9,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: true,
    },
  },
  // OpenAI GPT-3.5
  'gpt-3.5-turbo': {
    name: 'gpt-3.5-turbo',
    displayName: 'GPT-3.5 Turbo',
    family: 'openai',
    maxTokens: 16385,
    maxOutputTokens: 4096,
    tokenizer: defaultTokenizer,
    costPer1K: 0.0005,
    outputCostPer1K: 0.0015,
    optimalPromptStyle: 'concise',
    compressionThreshold: 0.8,
    features: {
      functions: true,
      streaming: true,
      vision: false,
      jsonMode: true,
    },
  },

  // Anthropic Claude family
  'claude-3-opus': {
    name: 'claude-3-opus-20240229',
    displayName: 'Claude 3 Opus',
    family: 'anthropic',
    maxTokens: 200000,
    maxOutputTokens: 4096,
    tokenizer: claudeTokenizer,
    costPer1K: 0.015,
    outputCostPer1K: 0.075,
    optimalPromptStyle: 'verbose',
    compressionThreshold: 0.8,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: false,
    },
    notes: 'Best for complex reasoning and nuanced tasks',
  },
  'claude-3-sonnet': {
    name: 'claude-3-sonnet-20240229',
    displayName: 'Claude 3 Sonnet',
    family: 'anthropic',
    maxTokens: 200000,
    maxOutputTokens: 4096,
    tokenizer: claudeTokenizer,
    costPer1K: 0.003,
    outputCostPer1K: 0.015,
    optimalPromptStyle: 'structured',
    compressionThreshold: 0.85,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: false,
    },
    notes: 'Good balance of performance and cost',
  },
  'claude-3-haiku': {
    name: 'claude-3-haiku-20240307',
    displayName: 'Claude 3 Haiku',
    family: 'anthropic',
    maxTokens: 200000,
    maxOutputTokens: 4096,
    tokenizer: claudeTokenizer,
    costPer1K: 0.00025,
    outputCostPer1K: 0.00125,
    optimalPromptStyle: 'concise',
    compressionThreshold: 0.9,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: false,
    },
    notes: 'Fast and cost-effective for simple tasks',
  },
  'claude-3.5-sonnet': {
    name: 'claude-3-5-sonnet-20241022',
    displayName: 'Claude 3.5 Sonnet',
    family: 'anthropic',
    maxTokens: 200000,
    maxOutputTokens: 8192,
    tokenizer: claudeTokenizer,
    costPer1K: 0.003,
    outputCostPer1K: 0.015,
    optimalPromptStyle: 'structured',
    compressionThreshold: 0.85,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: false,
    },
    notes: 'Improved reasoning and coding capabilities',
  },
  'claude-sonnet-4': {
    name: 'claude-sonnet-4-20250514',
    displayName: 'Claude Sonnet 4',
    family: 'anthropic',
    maxTokens: 200000,
    maxOutputTokens: 16384,
    tokenizer: claudeTokenizer,
    costPer1K: 0.003,
    outputCostPer1K: 0.015,
    optimalPromptStyle: 'structured',
    compressionThreshold: 0.85,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: false,
    },
  },

  // Google Gemini family
  'gemini-1.5-pro': {
    name: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro',
    family: 'google',
    maxTokens: 1000000,
    maxOutputTokens: 8192,
    tokenizer: defaultTokenizer,
    costPer1K: 0.00125,
    outputCostPer1K: 0.005,
    optimalPromptStyle: 'dense',
    compressionThreshold: 0.9,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: true,
    },
    notes: 'Largest context window, good for long documents',
  },
  'gemini-1.5-flash': {
    name: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    family: 'google',
    maxTokens: 1000000,
    maxOutputTokens: 8192,
    tokenizer: defaultTokenizer,
    costPer1K: 0.000075,
    outputCostPer1K: 0.0003,
    optimalPromptStyle: 'concise',
    compressionThreshold: 0.9,
    features: {
      functions: true,
      streaming: true,
      vision: true,
      jsonMode: true,
    },
    notes: 'Fast and cost-effective',
  },

  // Mistral family
  'mistral-large': {
    name: 'mistral-large-latest',
    displayName: 'Mistral Large',
    family: 'mistral',
    maxTokens: 128000,
    maxOutputTokens: 8192,
    tokenizer: defaultTokenizer,
    costPer1K: 0.003,
    outputCostPer1K: 0.009,
    optimalPromptStyle: 'structured',
    compressionThreshold: 0.85,
    features: {
      functions: true,
      streaming: true,
      vision: false,
      jsonMode: true,
    },
  },
  'mistral-small': {
    name: 'mistral-small-latest',
    displayName: 'Mistral Small',
    family: 'mistral',
    maxTokens: 128000,
    maxOutputTokens: 8192,
    tokenizer: defaultTokenizer,
    costPer1K: 0.001,
    outputCostPer1K: 0.003,
    optimalPromptStyle: 'concise',
    compressionThreshold: 0.9,
    features: {
      functions: true,
      streaming: true,
      vision: false,
      jsonMode: true,
    },
  },
}

/**
 * Get model profile by name
 */
export function getModelProfile(modelName: string): ModelProfile | undefined {
  // Direct lookup
  if (MODEL_PROFILES[modelName]) {
    return MODEL_PROFILES[modelName]
  }

  // Try to match by partial name
  const normalizedName = modelName.toLowerCase()
  for (const [key, profile] of Object.entries(MODEL_PROFILES)) {
    if (
      normalizedName.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(normalizedName)
    ) {
      return profile
    }
  }

  return undefined
}

/**
 * Get model profile with fallback to default
 */
export function getModelProfileOrDefault(
  modelName: string,
  defaultProfile: ModelProfile = MODEL_PROFILES['gpt-4']
): ModelProfile {
  return getModelProfile(modelName) ?? defaultProfile
}

/**
 * Get models by family
 */
export function getModelsByFamily(family: ModelFamily): ModelProfile[] {
  return Object.values(MODEL_PROFILES).filter((p) => p.family === family)
}

/**
 * Get models within token budget
 */
export function getModelsWithinBudget(
  requiredTokens: number
): ModelProfile[] {
  return Object.values(MODEL_PROFILES).filter(
    (p) => p.maxTokens >= requiredTokens
  )
}

/**
 * Get models within cost budget
 */
export function getModelsWithinCostBudget(
  estimatedTokens: number,
  maxCostPerRequest: number
): ModelProfile[] {
  return Object.values(MODEL_PROFILES).filter((p) => {
    const estimatedCost =
      (estimatedTokens / 1000) * p.costPer1K +
      ((estimatedTokens * 0.3) / 1000) * p.outputCostPer1K
    return estimatedCost <= maxCostPerRequest
  })
}

/**
 * Compare models for a given use case
 */
export function compareModels(
  modelNames: string[],
  estimatedInputTokens: number,
  estimatedOutputTokens: number
): Array<{
  profile: ModelProfile
  estimatedCost: number
  fitsContext: boolean
}> {
  return modelNames
    .map((name) => getModelProfile(name))
    .filter((p): p is ModelProfile => p !== undefined)
    .map((profile) => {
      const inputCost = (estimatedInputTokens / 1000) * profile.costPer1K
      const outputCost =
        (estimatedOutputTokens / 1000) * profile.outputCostPer1K
      return {
        profile,
        estimatedCost: inputCost + outputCost,
        fitsContext:
          estimatedInputTokens + estimatedOutputTokens <= profile.maxTokens,
      }
    })
    .sort((a, b) => a.estimatedCost - b.estimatedCost)
}
