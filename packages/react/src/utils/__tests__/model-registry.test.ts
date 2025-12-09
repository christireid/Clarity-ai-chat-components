import {
  MODEL_REGISTRY,
  getAllModelIds,
  getModelsByProvider,
  getModelsWithCapability,
  getModelsWithMinContextWindow,
  isValidModelId,
  getModelConfig,
  tryGetModelConfig,
  type ModelId,
} from '../tokenization/model-registry'

describe('MODEL_REGISTRY', () => {
  it('contains all expected model families', () => {
    const modelIds = getAllModelIds()

    // OpenAI models
    expect(modelIds).toContain('gpt-4')
    expect(modelIds).toContain('gpt-4o')
    expect(modelIds).toContain('gpt-4.1')
    expect(modelIds).toContain('o1')

    // Anthropic models
    expect(modelIds).toContain('claude-3-opus')
    expect(modelIds).toContain('claude-sonnet-4')

    // Google models
    expect(modelIds).toContain('gemini-1.5-pro')

    // DeepSeek models
    expect(modelIds).toContain('deepseek-r1')

    // Llama models
    expect(modelIds).toContain('llama-3.3')

    // Mistral models
    expect(modelIds).toContain('mistral-large')
  })

  it('all models have required fields', () => {
    const modelIds = getAllModelIds()

    modelIds.forEach((id) => {
      const config = MODEL_REGISTRY[id]

      expect(config).toBeDefined()
      expect(config.displayName).toBeTruthy()
      expect(config.provider).toBeTruthy()
      expect(config.encoding).toBeTruthy()
      expect(config.charsPerToken).toBeGreaterThan(0)
      expect(config.contextWindow).toBeGreaterThan(0)
      expect(config.maxOutputTokens).toBeGreaterThan(0)
      expect(config.recommendedOutputReserve).toBeGreaterThan(0)
      expect(config.inputCostPer1M).toBeGreaterThanOrEqual(0)
      expect(config.outputCostPer1M).toBeGreaterThanOrEqual(0)
      expect(typeof config.supportsCaching).toBe('boolean')
      expect(config.capabilities).toBeDefined()
    })
  })

  it('Claude 4 models have 1M context window', () => {
    expect(MODEL_REGISTRY['claude-sonnet-4'].contextWindow).toBe(1000000)
    expect(MODEL_REGISTRY['claude-opus-4'].contextWindow).toBe(1000000)
  })

  it('DeepSeek R1 has 128K context window', () => {
    expect(MODEL_REGISTRY['deepseek-r1'].contextWindow).toBe(128000)
  })
})

describe('getModelsByProvider', () => {
  it('returns all OpenAI models', () => {
    const openaiModels = getModelsByProvider('openai')

    expect(openaiModels).toContain('gpt-4')
    expect(openaiModels).toContain('gpt-4o')
    expect(openaiModels).toContain('o1')
    expect(openaiModels).not.toContain('claude-3-opus')
  })

  it('returns all Anthropic models', () => {
    const anthropicModels = getModelsByProvider('anthropic')

    expect(anthropicModels).toContain('claude-3-opus')
    expect(anthropicModels).toContain('claude-sonnet-4')
    expect(anthropicModels).not.toContain('gpt-4')
  })
})

describe('getModelsWithCapability', () => {
  it('returns models with vision capability', () => {
    const visionModels = getModelsWithCapability('vision')

    expect(visionModels).toContain('gpt-4o')
    expect(visionModels).toContain('claude-3-opus')
    expect(visionModels).not.toContain('gpt-4') // Original GPT-4 doesn't have vision
  })

  it('returns reasoning models', () => {
    const reasoningModels = getModelsWithCapability('reasoning')

    expect(reasoningModels).toContain('o1')
    expect(reasoningModels).toContain('o3-mini')
    expect(reasoningModels).toContain('deepseek-r1')
    expect(reasoningModels).not.toContain('gpt-4o')
  })
})

describe('getModelsWithMinContextWindow', () => {
  it('returns models with 1M+ context', () => {
    const largeContextModels = getModelsWithMinContextWindow(1000000)

    expect(largeContextModels).toContain('claude-sonnet-4')
    expect(largeContextModels).toContain('gemini-1.5-pro')
    expect(largeContextModels).toContain('gpt-4.1')
    expect(largeContextModels).not.toContain('gpt-4')
  })

  it('returns all models for small context requirement', () => {
    const models = getModelsWithMinContextWindow(1000)
    expect(models.length).toBe(getAllModelIds().length)
  })
})

describe('isValidModelId', () => {
  it('returns true for valid model IDs', () => {
    expect(isValidModelId('gpt-4')).toBe(true)
    expect(isValidModelId('claude-sonnet-4')).toBe(true)
    expect(isValidModelId('deepseek-r1')).toBe(true)
  })

  it('returns false for invalid model IDs', () => {
    expect(isValidModelId('invalid-model')).toBe(false)
    expect(isValidModelId('')).toBe(false)
    expect(isValidModelId('GPT-4')).toBe(false) // Case sensitive
  })
})

describe('getModelConfig', () => {
  it('returns config for valid model', () => {
    const config = getModelConfig('gpt-4o')

    expect(config.displayName).toBe('GPT-4o')
    expect(config.provider).toBe('openai')
    expect(config.contextWindow).toBe(128000)
  })
})

describe('tryGetModelConfig', () => {
  it('returns config for valid model', () => {
    const config = tryGetModelConfig('gpt-4o')
    expect(config).toBeDefined()
    expect(config?.displayName).toBe('GPT-4o')
  })

  it('returns undefined for invalid model', () => {
    const config = tryGetModelConfig('invalid-model')
    expect(config).toBeUndefined()
  })
})
