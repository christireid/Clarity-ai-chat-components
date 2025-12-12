/**
 * AI Model Registry
 *
 * Comprehensive model information including pricing, capabilities,
 * and context windows. Updated for 2024/2025 models.
 *
 * Pricing is in USD per 1M tokens.
 * Last updated: December 2024
 */

export interface ModelInfo {
  id: string
  name: string
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'Meta' | 'Mistral' | 'Cohere'
  contextWindow: number
  maxOutputTokens: number
  pricing: {
    input: number // USD per 1M tokens
    output: number // USD per 1M tokens
    cached?: number // USD per 1M cached tokens (if available)
  }
  capabilities: string[]
  bestFor: string[]
  releaseDate: string
  deprecated?: boolean
  notes?: string
}

export const MODELS: Record<string, ModelInfo> = {
  // =============================================================================
  // OpenAI Models (2024/2025)
  // =============================================================================
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextWindow: 128000,
    maxOutputTokens: 16384,
    pricing: { input: 2.5, output: 10.0, cached: 1.25 },
    capabilities: [
      'text',
      'code',
      'vision',
      'function-calling',
      'json-mode',
      'streaming',
    ],
    bestFor: ['general-purpose', 'multimodal', 'coding', 'analysis'],
    releaseDate: '2024-05',
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    contextWindow: 128000,
    maxOutputTokens: 16384,
    pricing: { input: 0.15, output: 0.6, cached: 0.075 },
    capabilities: [
      'text',
      'code',
      'vision',
      'function-calling',
      'json-mode',
      'streaming',
    ],
    bestFor: ['cost-efficient', 'high-volume', 'simple-tasks'],
    releaseDate: '2024-07',
  },
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    pricing: { input: 10.0, output: 30.0 },
    capabilities: [
      'text',
      'code',
      'vision',
      'function-calling',
      'json-mode',
      'streaming',
    ],
    bestFor: ['complex-reasoning', 'long-context', 'coding'],
    releaseDate: '2024-04',
  },
  o1: {
    id: 'o1',
    name: 'O1',
    provider: 'OpenAI',
    contextWindow: 200000,
    maxOutputTokens: 100000,
    pricing: { input: 15.0, output: 60.0, cached: 7.5 },
    capabilities: ['text', 'code', 'vision', 'function-calling', 'reasoning'],
    bestFor: ['complex-reasoning', 'math', 'science', 'coding'],
    releaseDate: '2024-12',
    notes: 'Extended thinking model with reasoning tokens',
  },
  'o1-mini': {
    id: 'o1-mini',
    name: 'O1 Mini',
    provider: 'OpenAI',
    contextWindow: 128000,
    maxOutputTokens: 65536,
    pricing: { input: 3.0, output: 12.0, cached: 1.5 },
    capabilities: ['text', 'code', 'reasoning'],
    bestFor: ['coding', 'math', 'STEM'],
    releaseDate: '2024-09',
    notes: 'Efficient reasoning model for STEM tasks',
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    contextWindow: 16385,
    maxOutputTokens: 4096,
    pricing: { input: 0.5, output: 1.5 },
    capabilities: ['text', 'code', 'function-calling', 'streaming'],
    bestFor: ['simple-tasks', 'high-volume', 'cost-sensitive'],
    releaseDate: '2023-11',
    notes: 'Legacy model, consider GPT-4o-mini',
  },

  // =============================================================================
  // Anthropic Models (2024/2025)
  // =============================================================================
  'claude-3-5-sonnet-20241022': {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet (Oct 2024)',
    provider: 'Anthropic',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    pricing: { input: 3.0, output: 15.0, cached: 0.3 },
    capabilities: ['text', 'code', 'vision', 'tool-use', 'streaming'],
    bestFor: ['coding', 'analysis', 'writing', 'general-purpose'],
    releaseDate: '2024-10',
    notes: 'Best balance of capability and cost',
  },
  'claude-3-5-sonnet-20240620': {
    id: 'claude-3-5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet (Jun 2024)',
    provider: 'Anthropic',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    pricing: { input: 3.0, output: 15.0, cached: 0.3 },
    capabilities: ['text', 'code', 'vision', 'tool-use', 'streaming'],
    bestFor: ['coding', 'analysis', 'writing'],
    releaseDate: '2024-06',
  },
  'claude-3-5-haiku-20241022': {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    pricing: { input: 0.8, output: 4.0, cached: 0.08 },
    capabilities: ['text', 'code', 'vision', 'tool-use', 'streaming'],
    bestFor: ['fast-responses', 'high-volume', 'simple-tasks'],
    releaseDate: '2024-10',
    notes: 'Fastest Claude model',
  },
  'claude-3-opus-20240229': {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    contextWindow: 200000,
    maxOutputTokens: 4096,
    pricing: { input: 15.0, output: 75.0, cached: 1.5 },
    capabilities: ['text', 'code', 'vision', 'tool-use', 'streaming'],
    bestFor: ['complex-tasks', 'research', 'creative-writing'],
    releaseDate: '2024-02',
    notes: 'Most capable for complex reasoning',
  },
  'claude-3-haiku-20240307': {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    contextWindow: 200000,
    maxOutputTokens: 4096,
    pricing: { input: 0.25, output: 1.25, cached: 0.03 },
    capabilities: ['text', 'code', 'vision', 'tool-use', 'streaming'],
    bestFor: ['fast-responses', 'cost-sensitive'],
    releaseDate: '2024-03',
  },

  // =============================================================================
  // Google Models (2024/2025)
  // =============================================================================
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    pricing: { input: 0.1, output: 0.4 },
    capabilities: ['text', 'code', 'vision', 'audio', 'tool-use', 'streaming'],
    bestFor: ['multimodal', 'long-context', 'fast-responses'],
    releaseDate: '2024-12',
    notes: 'Next-gen multimodal with 1M context',
  },
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    contextWindow: 2000000,
    maxOutputTokens: 8192,
    pricing: { input: 1.25, output: 5.0 },
    capabilities: [
      'text',
      'code',
      'vision',
      'audio',
      'video',
      'tool-use',
      'streaming',
    ],
    bestFor: ['very-long-context', 'multimodal', 'document-analysis'],
    releaseDate: '2024-02',
    notes: '2M token context window',
  },
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    pricing: { input: 0.075, output: 0.3 },
    capabilities: ['text', 'code', 'vision', 'audio', 'tool-use', 'streaming'],
    bestFor: ['cost-efficient', 'long-context', 'high-volume'],
    releaseDate: '2024-05',
    notes: 'Fast and affordable with 1M context',
  },
  'gemini-1.5-flash-8b': {
    id: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash 8B',
    provider: 'Google',
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    pricing: { input: 0.0375, output: 0.15 },
    capabilities: ['text', 'code', 'vision', 'streaming'],
    bestFor: ['high-volume', 'cost-sensitive', 'simple-tasks'],
    releaseDate: '2024-10',
    notes: 'Most affordable Gemini model',
  },

  // =============================================================================
  // Mistral Models (2024)
  // =============================================================================
  'mistral-large-latest': {
    id: 'mistral-large-latest',
    name: 'Mistral Large',
    provider: 'Mistral',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    pricing: { input: 2.0, output: 6.0 },
    capabilities: ['text', 'code', 'function-calling', 'streaming'],
    bestFor: ['complex-tasks', 'coding', 'reasoning'],
    releaseDate: '2024-07',
  },
  'mistral-small-latest': {
    id: 'mistral-small-latest',
    name: 'Mistral Small',
    provider: 'Mistral',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    pricing: { input: 0.2, output: 0.6 },
    capabilities: ['text', 'code', 'function-calling', 'streaming'],
    bestFor: ['cost-efficient', 'simple-tasks'],
    releaseDate: '2024-09',
  },
  'codestral-latest': {
    id: 'codestral-latest',
    name: 'Codestral',
    provider: 'Mistral',
    contextWindow: 32000,
    maxOutputTokens: 8192,
    pricing: { input: 0.2, output: 0.6 },
    capabilities: ['code', 'fill-in-the-middle', 'streaming'],
    bestFor: ['code-completion', 'code-generation'],
    releaseDate: '2024-05',
    notes: 'Specialized for code tasks',
  },
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get model by ID (case-insensitive, supports aliases)
 */
export function getModel(modelId: string): ModelInfo | undefined {
  const normalized = modelId.toLowerCase()

  // Direct match
  if (MODELS[modelId]) return MODELS[modelId]

  // Case-insensitive search
  for (const [key, model] of Object.entries(MODELS)) {
    if (
      key.toLowerCase() === normalized ||
      model.name.toLowerCase() === normalized
    ) {
      return model
    }
  }

  // Common aliases
  const aliases: Record<string, string> = {
    gpt4: 'gpt-4-turbo',
    'gpt-4': 'gpt-4-turbo',
    gpt4o: 'gpt-4o',
    'gpt-4o-latest': 'gpt-4o',
    'gpt4-mini': 'gpt-4o-mini',
    'claude-sonnet': 'claude-3-5-sonnet-20241022',
    'claude-3.5-sonnet': 'claude-3-5-sonnet-20241022',
    'claude-3-sonnet': 'claude-3-5-sonnet-20241022',
    sonnet: 'claude-3-5-sonnet-20241022',
    'claude-haiku': 'claude-3-5-haiku-20241022',
    haiku: 'claude-3-5-haiku-20241022',
    'claude-opus': 'claude-3-opus-20240229',
    opus: 'claude-3-opus-20240229',
    'gemini-pro': 'gemini-1.5-pro',
    'gemini-flash': 'gemini-1.5-flash',
    'gemini-2': 'gemini-2.0-flash',
    'mistral-large': 'mistral-large-latest',
    'mistral-small': 'mistral-small-latest',
    codestral: 'codestral-latest',
  }

  const aliasKey = aliases[normalized]
  if (aliasKey) return MODELS[aliasKey]

  return undefined
}

/**
 * Calculate cost for token usage
 */
export function calculateCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number,
  cachedInputTokens = 0
): {
  modelId: string
  inputTokens: number
  outputTokens: number
  cachedInputTokens: number
  inputCost: number
  outputCost: number
  cachedCost: number
  totalCost: number
  currency: string
} | null {
  const model = getModel(modelId)
  if (!model) return null

  // Pricing is per 1M tokens
  const inputCost = (inputTokens / 1_000_000) * model.pricing.input
  const outputCost = (outputTokens / 1_000_000) * model.pricing.output
  const cachedCost = model.pricing.cached
    ? (cachedInputTokens / 1_000_000) * model.pricing.cached
    : 0

  return {
    modelId: model.id,
    inputTokens,
    outputTokens,
    cachedInputTokens,
    inputCost,
    outputCost,
    cachedCost,
    totalCost: inputCost + outputCost + cachedCost,
    currency: 'USD',
  }
}

/**
 * Get all models by provider
 */
export function getModelsByProvider(
  provider: ModelInfo['provider']
): ModelInfo[] {
  return Object.values(MODELS).filter(
    (m) => m.provider === provider && !m.deprecated
  )
}

/**
 * Get all available models
 */
export function getAllModels(): ModelInfo[] {
  return Object.values(MODELS).filter((m) => !m.deprecated)
}

/**
 * Get recommended models for a use case
 */
export function getRecommendedModels(useCase: string): ModelInfo[] {
  const lowerUseCase = useCase.toLowerCase()
  return Object.values(MODELS)
    .filter(
      (m) =>
        !m.deprecated &&
        m.bestFor.some((b) => b.toLowerCase().includes(lowerUseCase))
    )
    .sort((a, b) => a.pricing.input - b.pricing.input)
}

/**
 * Format pricing for display
 */
export function formatPricing(model: ModelInfo): string {
  const { input, output, cached } = model.pricing
  let result = `Input: $${input.toFixed(2)}/1M tokens, Output: $${output.toFixed(2)}/1M tokens`
  if (cached) {
    result += `, Cached: $${cached.toFixed(2)}/1M tokens`
  }
  return result
}
