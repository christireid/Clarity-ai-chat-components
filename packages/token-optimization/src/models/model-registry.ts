/**
 * Model Registry - Single Source of Truth
 *
 * Centralized model configuration for tokenization, pricing, and budget monitoring.
 * This file serves as the authoritative source for all model-specific parameters.
 *
 * When adding a new model:
 * 1. Add entry to MODEL_REGISTRY with all required fields
 * 2. Add to ModelId union type
 * 3. Types will automatically be available across tokenization, pricing, and budget modules
 *
 * @module model-registry
 */

/**
 * Supported AI model identifiers
 */
export type ModelId =
  // OpenAI GPT-4 Family
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4.1'
  | 'gpt-4.1-mini'
  | 'gpt-4.1-nano'
  | 'gpt-3.5-turbo'
  // OpenAI O1/O3 Reasoning Models
  | 'o1'
  | 'o1-mini'
  | 'o1-preview'
  | 'o3-mini'
  // Anthropic Claude 3 Family
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  // Anthropic Claude 4 Family
  | 'claude-sonnet-4'
  | 'claude-opus-4'
  // Google Gemini Family
  | 'gemini-pro'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  | 'gemini-2.0-flash'
  | 'gemini-2.0-pro'
  // DeepSeek Models
  | 'deepseek-chat'
  | 'deepseek-coder'
  | 'deepseek-r1'
  // Llama Models
  | 'llama-3'
  | 'llama-3.1'
  | 'llama-3.2'
  | 'llama-3.3'
  // Mistral Models
  | 'mistral-large'
  | 'mistral-medium'
  | 'mistral-small'

/**
 * Model provider
 */
export type ModelProvider =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'deepseek'
  | 'meta'
  | 'mistral'

/**
 * Tokenizer encoding identifier
 */
export type TokenizerEncoding =
  | 'cl100k_base' // GPT-4, GPT-3.5
  | 'o200k_base' // GPT-4o, O1, O3
  | 'claude' // Claude models
  | 'gemini' // Gemini models
  | 'deepseek' // DeepSeek models
  | 'llama3' // Llama 3.x models
  | 'mistral' // Mistral models

/**
 * Complete model configuration for tokenization
 * Note: Named TokenModelConfig to avoid collision with ModelConfig in routing/model-router.ts
 */
export interface TokenModelConfig {
  /** Model display name */
  displayName: string
  /** Provider */
  provider: ModelProvider
  /** Tokenizer encoding for accurate counting */
  encoding: TokenizerEncoding
  /** Estimated characters per token (for fallback estimation) */
  charsPerToken: number
  /** Context window size (total tokens) */
  contextWindow: number
  /** Maximum output tokens */
  maxOutputTokens: number
  /** Recommended reserved output tokens for budget monitoring */
  recommendedOutputReserve: number
  /** Cost per 1M input tokens (USD) */
  inputCostPer1M: number
  /** Cost per 1M output tokens (USD) */
  outputCostPer1M: number
  /** Cost per 1M cached input tokens (USD), if supported */
  cachedInputCostPer1M?: number
  /** Whether the model supports prompt caching */
  supportsCaching: boolean
  /** Model capabilities flags */
  capabilities: {
    /** Supports vision/image input */
    vision: boolean
    /** Supports function/tool calling */
    functionCalling: boolean
    /** Reasoning model (extended thinking) */
    reasoning: boolean
    /** JSON mode support */
    jsonMode: boolean
  }
  /** Release date for reference */
  releaseDate?: string
  /** Notes about the model */
  notes?: string
}

/**
 * Centralized model registry
 *
 * This is the single source of truth for all model configurations.
 * Other modules should derive their configurations from this registry.
 */
export const MODEL_REGISTRY: Record<ModelId, TokenModelConfig> = {
  // ===========================================================================
  // OpenAI GPT-4 Family
  // ===========================================================================
  'gpt-4': {
    displayName: 'GPT-4',
    provider: 'openai',
    encoding: 'cl100k_base',
    charsPerToken: 4,
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 2048,
    inputCostPer1M: 30.0,
    outputCostPer1M: 60.0,
    supportsCaching: false,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'gpt-4-turbo': {
    displayName: 'GPT-4 Turbo',
    provider: 'openai',
    encoding: 'cl100k_base',
    charsPerToken: 4,
    contextWindow: 128000,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 10.0,
    outputCostPer1M: 30.0,
    cachedInputCostPer1M: 5.0,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'gpt-4o': {
    displayName: 'GPT-4o',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 128000,
    maxOutputTokens: 16384,
    recommendedOutputReserve: 16384,
    inputCostPer1M: 2.5,
    outputCostPer1M: 10.0,
    cachedInputCostPer1M: 1.25,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'gpt-4o-mini': {
    displayName: 'GPT-4o Mini',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 128000,
    maxOutputTokens: 16384,
    recommendedOutputReserve: 16384,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
    cachedInputCostPer1M: 0.075,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'gpt-4.1': {
    displayName: 'GPT-4.1',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 1000000, // 1M tokens
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 2.0,
    outputCostPer1M: 8.0,
    cachedInputCostPer1M: 0.5,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
    releaseDate: '2025-04',
  },
  'gpt-4.1-mini': {
    displayName: 'GPT-4.1 Mini',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 1000000, // 1M tokens
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 0.4,
    outputCostPer1M: 1.6,
    cachedInputCostPer1M: 0.1,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
    releaseDate: '2025-04',
  },
  'gpt-4.1-nano': {
    displayName: 'GPT-4.1 Nano',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 1000000, // 1M tokens
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 0.1,
    outputCostPer1M: 0.4,
    cachedInputCostPer1M: 0.025,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
    releaseDate: '2025-04',
  },
  'gpt-3.5-turbo': {
    displayName: 'GPT-3.5 Turbo',
    provider: 'openai',
    encoding: 'cl100k_base',
    charsPerToken: 4,
    contextWindow: 16385,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 0.5,
    outputCostPer1M: 1.5,
    supportsCaching: false,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },

  // ===========================================================================
  // OpenAI O1/O3 Reasoning Models
  // ===========================================================================
  o1: {
    displayName: 'O1',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 200000,
    maxOutputTokens: 100000,
    recommendedOutputReserve: 100000,
    inputCostPer1M: 15.0,
    outputCostPer1M: 60.0,
    cachedInputCostPer1M: 7.5,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: true,
      jsonMode: true,
    },
    notes: 'Extended thinking model with reasoning tokens',
  },
  'o1-mini': {
    displayName: 'O1 Mini',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 128000,
    maxOutputTokens: 65536,
    recommendedOutputReserve: 65536,
    inputCostPer1M: 3.0,
    outputCostPer1M: 12.0,
    cachedInputCostPer1M: 1.5,
    supportsCaching: true,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: true,
      jsonMode: true,
    },
  },
  'o1-preview': {
    displayName: 'O1 Preview',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 128000,
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 15.0,
    outputCostPer1M: 60.0,
    cachedInputCostPer1M: 7.5,
    supportsCaching: true,
    capabilities: {
      vision: false,
      functionCalling: false,
      reasoning: true,
      jsonMode: false,
    },
    notes: 'Preview version, limited capabilities',
  },
  'o3-mini': {
    displayName: 'O3 Mini',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 200000,
    maxOutputTokens: 100000,
    recommendedOutputReserve: 100000,
    inputCostPer1M: 1.1,
    outputCostPer1M: 4.4,
    cachedInputCostPer1M: 0.55,
    supportsCaching: true,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: true,
      jsonMode: true,
    },
    releaseDate: '2025-01',
  },

  // ===========================================================================
  // Anthropic Claude 3 Family
  // ===========================================================================
  'claude-3-opus': {
    displayName: 'Claude 3 Opus',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 200000,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 15.0,
    outputCostPer1M: 75.0,
    cachedInputCostPer1M: 1.5,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'claude-3-sonnet': {
    displayName: 'Claude 3 Sonnet',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 200000,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    cachedInputCostPer1M: 0.3,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'claude-3-haiku': {
    displayName: 'Claude 3 Haiku',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 200000,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    cachedInputCostPer1M: 0.03,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'claude-3-5-sonnet': {
    displayName: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 200000,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    cachedInputCostPer1M: 0.3,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'claude-3-5-haiku': {
    displayName: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 200000,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.8,
    outputCostPer1M: 4.0,
    cachedInputCostPer1M: 0.08,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },

  // ===========================================================================
  // Anthropic Claude 4 Family
  // ===========================================================================
  'claude-sonnet-4': {
    displayName: 'Claude Sonnet 4',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 1000000, // 1M tokens
    maxOutputTokens: 16384,
    recommendedOutputReserve: 16384,
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    cachedInputCostPer1M: 0.3,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
    releaseDate: '2024-12',
    notes: 'Context window upgraded to 1M in late 2024',
  },
  'claude-opus-4': {
    displayName: 'Claude Opus 4',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 1000000, // 1M tokens
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 15.0,
    outputCostPer1M: 75.0,
    cachedInputCostPer1M: 1.5,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
    releaseDate: '2025-01',
    notes: 'Context window upgraded to 1M',
  },

  // ===========================================================================
  // Google Gemini Family
  // ===========================================================================
  'gemini-pro': {
    displayName: 'Gemini Pro',
    provider: 'google',
    encoding: 'gemini',
    charsPerToken: 4,
    contextWindow: 32760,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.5,
    outputCostPer1M: 1.5,
    supportsCaching: false,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'gemini-1.5-pro': {
    displayName: 'Gemini 1.5 Pro',
    provider: 'google',
    encoding: 'gemini',
    charsPerToken: 4,
    contextWindow: 2000000, // 2M tokens
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.0,
    cachedInputCostPer1M: 0.31,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'gemini-1.5-flash': {
    displayName: 'Gemini 1.5 Flash',
    provider: 'google',
    encoding: 'gemini',
    charsPerToken: 4,
    contextWindow: 1000000, // 1M tokens
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.3,
    cachedInputCostPer1M: 0.01875,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'gemini-2.0-flash': {
    displayName: 'Gemini 2.0 Flash',
    provider: 'google',
    encoding: 'gemini',
    charsPerToken: 4,
    contextWindow: 1000000, // 1M tokens
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.1,
    outputCostPer1M: 0.4,
    cachedInputCostPer1M: 0.025,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
    releaseDate: '2024-12',
  },
  'gemini-2.0-pro': {
    displayName: 'Gemini 2.0 Pro',
    provider: 'google',
    encoding: 'gemini',
    charsPerToken: 4,
    contextWindow: 2000000, // 2M tokens
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.0,
    cachedInputCostPer1M: 0.31,
    supportsCaching: true,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
    releaseDate: '2025-01',
  },

  // ===========================================================================
  // DeepSeek Models
  // ===========================================================================
  'deepseek-chat': {
    displayName: 'DeepSeek Chat',
    provider: 'deepseek',
    encoding: 'deepseek',
    charsPerToken: 4,
    contextWindow: 65536,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    cachedInputCostPer1M: 0.014,
    supportsCaching: true,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'deepseek-coder': {
    displayName: 'DeepSeek Coder',
    provider: 'deepseek',
    encoding: 'deepseek',
    charsPerToken: 4,
    contextWindow: 65536,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    cachedInputCostPer1M: 0.014,
    supportsCaching: true,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'deepseek-r1': {
    displayName: 'DeepSeek R1',
    provider: 'deepseek',
    encoding: 'deepseek',
    charsPerToken: 4,
    contextWindow: 128000,
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 0.55,
    outputCostPer1M: 2.19,
    cachedInputCostPer1M: 0.14,
    supportsCaching: true,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: true,
      jsonMode: true,
    },
    releaseDate: '2025-01',
    notes: 'Reasoning model with extended thinking',
  },

  // ===========================================================================
  // Meta Llama Models
  // ===========================================================================
  'llama-3': {
    displayName: 'Llama 3',
    provider: 'meta',
    encoding: 'llama3',
    charsPerToken: 4,
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 0.25,
    outputCostPer1M: 0.25,
    supportsCaching: false,
    capabilities: {
      vision: false,
      functionCalling: false,
      reasoning: false,
      jsonMode: false,
    },
  },
  'llama-3.1': {
    displayName: 'Llama 3.1',
    provider: 'meta',
    encoding: 'llama3',
    charsPerToken: 4,
    contextWindow: 128000, // 128K
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 0.25,
    outputCostPer1M: 0.25,
    supportsCaching: false,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'llama-3.2': {
    displayName: 'Llama 3.2',
    provider: 'meta',
    encoding: 'llama3',
    charsPerToken: 4,
    contextWindow: 128000, // 128K
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 0.2,
    outputCostPer1M: 0.2,
    supportsCaching: false,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'llama-3.3': {
    displayName: 'Llama 3.3',
    provider: 'meta',
    encoding: 'llama3',
    charsPerToken: 4,
    contextWindow: 128000, // 128K
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.4,
    outputCostPer1M: 0.4,
    supportsCaching: false,
    capabilities: {
      vision: true,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
    releaseDate: '2024-12',
  },

  // ===========================================================================
  // Mistral Models
  // ===========================================================================
  'mistral-large': {
    displayName: 'Mistral Large',
    provider: 'mistral',
    encoding: 'mistral',
    charsPerToken: 4,
    contextWindow: 128000,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 2.0,
    outputCostPer1M: 6.0,
    supportsCaching: false,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'mistral-medium': {
    displayName: 'Mistral Medium',
    provider: 'mistral',
    encoding: 'mistral',
    charsPerToken: 4,
    contextWindow: 32768,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 2.7,
    outputCostPer1M: 8.1,
    supportsCaching: false,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
  'mistral-small': {
    displayName: 'Mistral Small',
    provider: 'mistral',
    encoding: 'mistral',
    charsPerToken: 4,
    contextWindow: 32768,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.2,
    outputCostPer1M: 0.6,
    supportsCaching: false,
    capabilities: {
      vision: false,
      functionCalling: true,
      reasoning: false,
      jsonMode: true,
    },
  },
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get all model IDs as an array
 */
export function getAllModelIds(): ModelId[] {
  return Object.keys(MODEL_REGISTRY) as ModelId[]
}

/**
 * Get models filtered by provider
 */
export function getModelsByProvider(provider: ModelProvider): ModelId[] {
  return getAllModelIds().filter(
    (id) => MODEL_REGISTRY[id].provider === provider
  )
}

/**
 * Get models with a specific capability
 */
export function getModelsWithCapability(
  capability: keyof TokenModelConfig['capabilities']
): ModelId[] {
  return getAllModelIds().filter(
    (id) => MODEL_REGISTRY[id].capabilities[capability]
  )
}

/**
 * Get models with context window >= specified size
 */
export function getModelsWithMinContextWindow(minTokens: number): ModelId[] {
  return getAllModelIds().filter(
    (id) => MODEL_REGISTRY[id].contextWindow >= minTokens
  )
}

/**
 * Check if a string is a valid ModelId
 */
export function isValidModelId(id: string): id is ModelId {
  return id in MODEL_REGISTRY
}

/**
 * Get model config with type safety
 */
export function getModelConfig(id: ModelId): TokenModelConfig {
  return MODEL_REGISTRY[id]
}

/**
 * Get model config or undefined if not found
 */
export function tryGetModelConfig(id: string): TokenModelConfig | undefined {
  return isValidModelId(id) ? MODEL_REGISTRY[id] : undefined
}
