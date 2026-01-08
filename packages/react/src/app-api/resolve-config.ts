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
 * Validation errors for invalid configurations
 */
export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly suggestion?: string
  ) {
    super(message)
    this.name = 'ConfigValidationError'
  }
}

/**
 * Validate resolved configuration
 * Throws ConfigValidationError for invalid combinations
 */
function validateConfig(config: ClarityResolvedConfig): void {
  const errors: string[] = []

  // Validate memory config
  if (config.features.memory) {
    if (config.memory.maxTokens <= 0) {
      errors.push('memory.maxTokens must be positive')
    }
    if (config.memory.limit <= 0) {
      errors.push('memory.limit must be positive')
    }
  }

  // Validate token optimization config
  if (config.features.tokenOptimization) {
    if (config.tokenOptimization.budget <= 0) {
      errors.push('tokenOptimization.budget must be positive')
    }
    if (
      config.tokenOptimization.qualityThreshold < 0 ||
      config.tokenOptimization.qualityThreshold > 1
    ) {
      errors.push('tokenOptimization.qualityThreshold must be between 0 and 1')
    }
  }

  // Validate RAG config
  if (config.features.rag) {
    if (config.rag.topK <= 0) {
      errors.push('rag.topK must be positive')
    }
    if (
      config.rag.similarityThreshold < 0 ||
      config.rag.similarityThreshold > 1
    ) {
      errors.push('rag.similarityThreshold must be between 0 and 1')
    }
  }

  // Validate tools config
  if (config.features.tools) {
    if (config.tools.timeoutMs <= 0) {
      errors.push('tools.timeoutMs must be positive')
    }
    // Validate tool definitions
    for (const tool of config.tools.registry) {
      if (!tool.name || typeof tool.name !== 'string') {
        errors.push('Each tool must have a valid name')
      }
      if (!tool.execute || typeof tool.execute !== 'function') {
        errors.push(`Tool "${tool.name}" must have an execute function`)
      }
    }
  }

  // Validate error recovery config
  if (config.features.errorRecovery) {
    if (config.errorRecovery.maxRetries < 0) {
      errors.push('errorRecovery.maxRetries cannot be negative')
    }
    if (config.errorRecovery.retryDelayMs < 0) {
      errors.push('errorRecovery.retryDelayMs cannot be negative')
    }
  }

  // Throw if there are errors
  if (errors.length > 0) {
    throw new ConfigValidationError(
      `Invalid configuration: ${errors.join('; ')}`,
      'config',
      'Check your configuration values against the documented constraints'
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
