'use client'

import type {
  ClarityAppPreset,
  ClarityFeatureFlags,
  ClarityAppConfig,
  ClarityResolvedConfig,
  RAGSource,
} from './types'

import {
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_MEMORY_CONFIG,
  DEFAULT_TOKEN_OPTIMIZATION_CONFIG,
  DEFAULT_TOOLS_CONFIG,
  DEFAULT_RAG_CONFIG,
  DEFAULT_SAFETY_CONFIG,
  DEFAULT_OBSERVABILITY_CONFIG,
  DEFAULT_UI_CONFIG,
  DEFAULT_ERROR_RECOVERY_CONFIG,
  DEFAULT_STREAMING_CONFIG,
  PRESET_DEFINITIONS,
  getModelTokenBudget,
} from './defaults'

// =============================================================================
// Configuration Resolution
// =============================================================================

export interface ResolveConfigOptions {
  /** Configuration preset */
  preset?: ClarityAppPreset
  /** Feature flags to enable/disable */
  features?: ClarityFeatureFlags
  /** Detailed configuration overrides */
  config?: ClarityAppConfig
  /** Model to use (affects token budget defaults) */
  model?: string
  /** RAG sources (shorthand for config.rag.sources) */
  sources?: RAGSource[]
}

/**
 * Resolves configuration by merging:
 * 1. Default configuration
 * 2. Preset configuration (if provided)
 * 3. Feature flags (override preset flags)
 * 4. User config overrides (highest priority)
 *
 * Precedence rules:
 * - Rule 1: explicit flags override preset flags
 * - Rule 2: explicit config overrides override both preset and default config
 * - Rule 3: per-feature blocks are deep-merged, but arrays are replaced
 * - Rule 4: derived defaults depend on environment and available providers
 */
export function resolveConfig(
  options: ResolveConfigOptions
): ClarityResolvedConfig {
  const { preset, features = {}, config = {}, model, sources } = options

  // Step 1: Start with defaults
  let resolvedFlags: Required<ClarityFeatureFlags> = {
    ...DEFAULT_FEATURE_FLAGS,
  }
  let resolvedConfig: ClarityResolvedConfig = {
    features: resolvedFlags,
    memory: { ...DEFAULT_MEMORY_CONFIG },
    tokenOptimization: { ...DEFAULT_TOKEN_OPTIMIZATION_CONFIG },
    tools: { ...DEFAULT_TOOLS_CONFIG },
    rag: { ...DEFAULT_RAG_CONFIG, sources: [] },
    safety: { ...DEFAULT_SAFETY_CONFIG },
    observability: { ...DEFAULT_OBSERVABILITY_CONFIG },
    ui: { ...DEFAULT_UI_CONFIG },
    errorRecovery: { ...DEFAULT_ERROR_RECOVERY_CONFIG },
    streaming: { ...DEFAULT_STREAMING_CONFIG },
  }

  // Step 2: Apply preset if provided
  if (preset && PRESET_DEFINITIONS[preset]) {
    const presetDef = PRESET_DEFINITIONS[preset]

    // Merge preset flags
    resolvedFlags = {
      ...resolvedFlags,
      ...presetDef.flags,
    }

    // Merge preset config (deep merge)
    resolvedConfig = deepMergeConfig(resolvedConfig, presetDef.config)
  }

  // Step 3: Apply explicit feature flags (override preset)
  resolvedFlags = {
    ...resolvedFlags,
    ...filterUndefined(features),
  }

  // Step 4: Apply user config overrides (highest priority)
  if (config) {
    resolvedConfig = deepMergeConfig(resolvedConfig, config)
  }

  // Step 5: Handle special cases and derived defaults

  // If sources provided, enable RAG automatically
  if (sources && sources.length > 0) {
    resolvedFlags.rag = true
    resolvedConfig.rag.sources = sources
  }

  // If model provided, derive token budget if not explicitly set
  if (model && !config?.tokenOptimization?.budget) {
    resolvedConfig.tokenOptimization.budget = getModelTokenBudget(model)
  }

  // If model provided, set it in token optimization config
  if (model) {
    resolvedConfig.tokenOptimization.model = model
  }

  // If tools registry provided in config, enable tools flag
  if (config?.tools?.registry && config.tools.registry.length > 0) {
    resolvedFlags.tools = true
  }

  // Apply storage defaults based on environment
  if (resolvedFlags.memory && resolvedConfig.memory.storage === 'indexeddb') {
    // In Node.js environment, fall back to memory storage
    if (typeof window === 'undefined') {
      resolvedConfig.memory.storage = 'memory'
    }
  }

  // Update resolved features
  resolvedConfig.features = resolvedFlags

  // Validate configuration
  validateConfig(resolvedConfig)

  return resolvedConfig
}

// =============================================================================
// Deep Merge Utilities
// =============================================================================

/**
 * Deep merge configuration objects
 * - Objects are recursively merged
 * - Arrays are replaced (not merged)
 * - Undefined values are skipped
 */
function deepMergeConfig(
  target: ClarityResolvedConfig,
  source: Partial<ClarityAppConfig>
): ClarityResolvedConfig {
  const result = { ...target }

  if (source.memory) {
    result.memory = {
      ...result.memory,
      ...filterUndefined(source.memory),
      retryPolicy: {
        ...result.memory.retryPolicy,
        ...(source.memory.retryPolicy
          ? filterUndefined(source.memory.retryPolicy)
          : {}),
      },
    }
  }

  if (source.tokenOptimization) {
    result.tokenOptimization = {
      ...result.tokenOptimization,
      ...filterUndefined(source.tokenOptimization),
    }
  }

  if (source.tools) {
    result.tools = {
      ...result.tools,
      ...filterUndefined(source.tools),
      // Arrays are replaced
      registry: source.tools.registry ?? result.tools.registry,
    }
  }

  if (source.rag) {
    result.rag = {
      ...result.rag,
      ...filterUndefined(source.rag),
      chunking: {
        ...result.rag.chunking,
        ...(source.rag.chunking ? filterUndefined(source.rag.chunking) : {}),
      },
      // Arrays are replaced
      sources: source.rag.sources ?? result.rag.sources,
    }
  }

  if (source.safety) {
    result.safety = {
      ...result.safety,
      ...filterUndefined(source.safety),
    }
  }

  if (source.observability) {
    result.observability = {
      ...result.observability,
      ...filterUndefined(source.observability),
    }
  }

  if (source.ui) {
    result.ui = {
      ...result.ui,
      ...filterUndefined(source.ui),
      // Objects are merged
      components: {
        ...result.ui.components,
        ...(source.ui.components ? filterUndefined(source.ui.components) : {}),
      },
    }
  }

  if (source.errorRecovery) {
    result.errorRecovery = {
      ...result.errorRecovery,
      ...filterUndefined(source.errorRecovery),
    }
  }

  if (source.streaming) {
    result.streaming = {
      ...result.streaming,
      ...filterUndefined(source.streaming),
    }
  }

  return result
}

/**
 * Filter out undefined values from an object
 */
function filterUndefined<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      obj[key] !== undefined
    ) {
      result[key as keyof T] = obj[key] as T[keyof T]
    }
  }
  return result
}

// =============================================================================
// Validation
// =============================================================================

/**
 * Validation errors for invalid configurations with actionable suggestions
 */
export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly suggestion?: string,
    public readonly docsUrl?: string
  ) {
    super(message)
    this.name = 'ConfigValidationError'
  }

  /**
   * Format error for developer-friendly display
   */
  override toString(): string {
    let output = `ClarityChat ConfigValidationError: ${this.message}`
    if (this.field) output += `\n  Field: ${this.field}`
    if (this.suggestion) output += `\n  Suggestion: ${this.suggestion}`
    if (this.docsUrl) output += `\n  Docs: ${this.docsUrl}`
    return output
  }
}

interface ValidationIssue {
  field: string
  message: string
  suggestion: string
  docsUrl?: string
}

/**
 * Validate resolved configuration
 * Throws ConfigValidationError for invalid combinations with actionable guidance
 */
function validateConfig(config: ClarityResolvedConfig): void {
  const issues: ValidationIssue[] = []

  // Validate memory config
  if (config.features.memory) {
    if (config.memory.maxTokens <= 0) {
      issues.push({
        field: 'memory.maxTokens',
        message: 'maxTokens must be a positive number',
        suggestion:
          'Set memory.maxTokens to a positive value like 4096. This controls the maximum tokens for memory context.',
      })
    }
    if (config.memory.limit <= 0) {
      issues.push({
        field: 'memory.limit',
        message: 'limit must be a positive number',
        suggestion:
          'Set memory.limit to how many messages to remember (e.g., 20). Higher values use more tokens.',
      })
    }
  }

  // Validate token optimization config
  if (config.features.tokenOptimization) {
    if (config.tokenOptimization.budget <= 0) {
      issues.push({
        field: 'tokenOptimization.budget',
        message: 'budget must be a positive number',
        suggestion:
          'Set a token budget based on your model: GPT-3.5 (4096), GPT-4 (8192), GPT-4 Turbo (128000).',
        docsUrl: 'https://github.com/christireid/Clarity-ai-chat-components/blob/main/docs/token-optimization',
      })
    }
    if (
      config.tokenOptimization.qualityThreshold < 0 ||
      config.tokenOptimization.qualityThreshold > 1
    ) {
      issues.push({
        field: 'tokenOptimization.qualityThreshold',
        message: 'qualityThreshold must be between 0 and 1',
        suggestion:
          'Use 0.8 for high quality (less aggressive optimization) or 0.5 for more aggressive token saving.',
      })
    }
  }

  // Validate RAG config
  if (config.features.rag) {
    if (config.rag.topK <= 0) {
      issues.push({
        field: 'rag.topK',
        message: 'topK must be a positive number',
        suggestion:
          'Set topK to the number of chunks to retrieve (e.g., 3-5). Higher values provide more context but use more tokens.',
        docsUrl: 'https://github.com/christireid/Clarity-ai-chat-components/blob/main/docs/rag',
      })
    }
    if (
      config.rag.similarityThreshold < 0 ||
      config.rag.similarityThreshold > 1
    ) {
      issues.push({
        field: 'rag.similarityThreshold',
        message: 'similarityThreshold must be between 0 and 1',
        suggestion:
          'Use 0.7-0.8 for strict matching or 0.5-0.6 for broader results. Lower values return more chunks.',
      })
    }
  }

  // Validate tools config
  if (config.features.tools) {
    if (config.tools.timeoutMs <= 0) {
      issues.push({
        field: 'tools.timeoutMs',
        message: 'timeoutMs must be a positive number',
        suggestion:
          'Set a reasonable timeout like 30000 (30 seconds). This prevents tools from hanging indefinitely.',
      })
    }
    // Validate tool definitions
    config.tools.registry.forEach((tool, index) => {
      if (!tool.name || typeof tool.name !== 'string') {
        issues.push({
          field: `tools.registry[${index}].name`,
          message: 'Each tool must have a valid name',
          suggestion:
            'Add a unique string name: { name: "my_tool", description: "...", execute: async () => {...} }',
          docsUrl: 'https://github.com/christireid/Clarity-ai-chat-components/blob/main/docs/tools',
        })
      }
      if (!tool.execute || typeof tool.execute !== 'function') {
        issues.push({
          field: `tools.registry[${index}].execute`,
          message: `Tool "${tool.name || 'unnamed'}" must have an execute function`,
          suggestion:
            'Add an async execute function: { execute: async (params) => { return result; } }',
          docsUrl: 'https://github.com/christireid/Clarity-ai-chat-components/blob/main/docs/tools',
        })
      }
    })
  }

  // Validate error recovery config
  if (config.features.errorRecovery) {
    if (config.errorRecovery.maxRetries < 0) {
      issues.push({
        field: 'errorRecovery.maxRetries',
        message: 'maxRetries cannot be negative',
        suggestion:
          'Set maxRetries to 0 to disable retries, or 3 for resilient error handling.',
      })
    }
    if (config.errorRecovery.retryDelayMs < 0) {
      issues.push({
        field: 'errorRecovery.retryDelayMs',
        message: 'retryDelayMs cannot be negative',
        suggestion:
          'Set retryDelayMs to at least 1000 (1 second) to avoid overwhelming the server.',
      })
    }
  }

  // Throw if there are issues
  if (issues.length > 0) {
    const firstIssue = issues[0]
    const allIssues = issues
      .map((i) => `  - ${i.field}: ${i.message}`)
      .join('\n')

    throw new ConfigValidationError(
      `Invalid configuration:\n${allIssues}`,
      firstIssue.field,
      firstIssue.suggestion,
      firstIssue.docsUrl
    )
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Check if a feature is enabled in the resolved config
 */
export function isFeatureEnabled(
  config: ClarityResolvedConfig,
  feature: keyof ClarityFeatureFlags
): boolean {
  return config.features[feature] === true
}

/**
 * Get a human-readable description of the active features
 */
export function describeActiveFeatures(
  config: ClarityResolvedConfig
): string[] {
  const active: string[] = []

  if (config.features.streaming) active.push('Streaming')
  if (config.features.errorRecovery) active.push('Error Recovery')
  if (config.features.memory) active.push(`Memory (${config.memory.strategy})`)
  if (config.features.tokenOptimization)
    active.push(
      `Token Optimization (budget: ${config.tokenOptimization.budget})`
    )
  if (config.features.tools)
    active.push(`Tools (${config.tools.registry.length} registered)`)
  if (config.features.rag)
    active.push(`RAG (${config.rag.sources?.length ?? 0} sources)`)
  if (config.features.safety) active.push(`Safety (${config.safety.level})`)
  if (config.features.observability) active.push('Observability')

  return active
}

/**
 * Create a minimal config for a specific preset
 */
export function createPresetConfig(
  preset: ClarityAppPreset
): ClarityResolvedConfig {
  return resolveConfig({ preset })
}

/**
 * Merge two resolved configs, with the second taking precedence
 */
export function mergeConfigs(
  base: ClarityResolvedConfig,
  override: Partial<ClarityAppConfig>
): ClarityResolvedConfig {
  return deepMergeConfig(base, override)
}
