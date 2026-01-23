'use client'

import type {
  ClarityAppPreset,
  ClarityFeatureFlags,
  ClarityAppConfig,
  ClarityResolvedConfig,
  MemoryConfig,
  TokenOptimizationConfig,
  ToolsConfig,
  RAGConfig,
  SafetyConfig,
  ObservabilityConfig,
  UIConfig,
} from './types'

// =============================================================================
// Default Feature Flags
// =============================================================================

export const DEFAULT_FEATURE_FLAGS: Required<ClarityFeatureFlags> = {
  memory: false,
  tokenOptimization: false,
  tools: false,
  rag: false,
  safety: false,
  observability: false,
  streaming: true,
  errorRecovery: true,
}

// =============================================================================
// Default Configuration Blocks
// =============================================================================

export const DEFAULT_MEMORY_CONFIG: Required<MemoryConfig> = {
  strategy: 'sliding-window',
  maxTokens: 4096,
  limit: 100,
  scopes: [],
  storage: 'indexeddb',
  customStorage: undefined,
  vectorSwitchThreshold: 500,
  retryPolicy: {
    maxRetries: 3,
    backoffMs: 1000,
  },
}

export const DEFAULT_TOKEN_OPTIMIZATION_CONFIG: Required<TokenOptimizationConfig> =
  {
    model: 'gpt-4',
    budget: 8192,
    qualityThreshold: 0.8,
    caching: true,
    cacheTtlMs: 300000, // 5 minutes
    compression: 'basic',
    showStats: true,
  }

export const DEFAULT_TOOLS_CONFIG: Required<
  Omit<ToolsConfig, 'customRenderer' | 'approvalHandler'>
> & {
  customRenderer?: ToolsConfig['customRenderer']
  approvalHandler?: ToolsConfig['approvalHandler']
} = {
  registry: [],
  defaultRenderer: 'card',
  customRenderer: undefined,
  autoApprove: false,
  approvalMode: 'manual',
  allowedTools: [],
  blockedTools: [],
  autoApproveRiskLevels: ['safe', 'low'],
  approvalHandler: undefined,
  timeoutMs: 30000,
}

export const DEFAULT_RAG_CONFIG: Required<Omit<RAGConfig, 'sources'>> & {
  sources: NonNullable<RAGConfig['sources']>
} = {
  sources: [],
  chunking: {
    strategy: 'balanced',
    maxTokens: 512,
    overlap: 50,
  },
  embeddingModel: 'text-embedding-ada-002',
  topK: 5,
  similarityThreshold: 0.7,
  showCitations: true,
}

export const DEFAULT_SAFETY_CONFIG: Required<
  Omit<SafetyConfig, 'customPolicy'>
> & {
  customPolicy?: SafetyConfig['customPolicy']
} = {
  level: 'standard',
  piiRedaction: true,
  promptInjectionDetection: true,
  contentModeration: false,
  customPolicy: undefined,
  auditLog: false,
}

export const DEFAULT_OBSERVABILITY_CONFIG: Required<
  Omit<ObservabilityConfig, 'onEvent'>
> & {
  onEvent?: ObservabilityConfig['onEvent']
} = {
  metrics: true,
  tracing: false,
  logging: true,
  logLevel: 'info',
  onEvent: undefined,
}

export const DEFAULT_UI_CONFIG: Required<
  Omit<UIConfig, 'components' | 'customTheme'>
> & {
  components?: UIConfig['components']
  customTheme?: UIConfig['customTheme']
} = {
  theme: 'system',
  customTheme: undefined,
  components: undefined,
  layout: 'default',
  showTypingIndicator: true,
  animations: true,
}

export const DEFAULT_ERROR_RECOVERY_CONFIG: Required<
  NonNullable<ClarityAppConfig['errorRecovery']>
> = {
  maxRetries: 3,
  retryDelayMs: 1000,
  exponentialBackoff: true,
}

export const DEFAULT_STREAMING_CONFIG: Required<
  NonNullable<ClarityAppConfig['streaming']>
> = {
  enabled: true,
  chunkDelayMs: 0,
}

// =============================================================================
// Preset Definitions
// =============================================================================

/**
 * Preset configurations mapping preset name to feature flags and config overrides
 */
export const PRESET_DEFINITIONS: Record<
  ClarityAppPreset,
  {
    flags: Partial<ClarityFeatureFlags>
    config: Partial<ClarityAppConfig>
    description: string
  }
> = {
  simple: {
    flags: {
      streaming: true,
      errorRecovery: true,
      memory: false,
      tokenOptimization: false,
      tools: false,
      rag: false,
      safety: false,
      observability: false,
    },
    config: {
      ui: {
        layout: 'default',
        animations: true,
      },
    },
    description: 'Streaming + retries + accessible UI, minimal extras',
  },

  pro: {
    flags: {
      streaming: true,
      errorRecovery: true,
      tokenOptimization: true,
      safety: true,
      observability: true,
      memory: false,
      tools: false,
      rag: false,
    },
    config: {
      tokenOptimization: {
        showStats: true,
        compression: 'basic',
      },
      safety: {
        level: 'standard',
        piiRedaction: true,
        promptInjectionDetection: true,
      },
      observability: {
        metrics: true,
        logging: true,
      },
    },
    description: 'Adds token stats, basic token optimization, basic safety',
  },

  memory: {
    flags: {
      streaming: true,
      errorRecovery: true,
      memory: true,
      tokenOptimization: false,
      tools: false,
      rag: false,
      safety: false,
      observability: false,
    },
    config: {
      memory: {
        strategy: 'sliding-window',
        maxTokens: 4096,
        limit: 100,
      },
    },
    description: 'Adds memory with sliding-window defaults',
  },

  rag: {
    flags: {
      streaming: true,
      errorRecovery: true,
      rag: true,
      memory: false,
      tokenOptimization: false,
      tools: false,
      safety: false,
      observability: false,
    },
    config: {
      rag: {
        chunking: {
          strategy: 'balanced',
          maxTokens: 512,
          overlap: 50,
        },
        topK: 5,
        showCitations: true,
      },
    },
    description: 'Adds sources + chunking + retrieval defaults',
  },

  tools: {
    flags: {
      streaming: true,
      errorRecovery: true,
      tools: true,
      memory: false,
      tokenOptimization: false,
      rag: false,
      safety: false,
      observability: false,
    },
    config: {
      tools: {
        defaultRenderer: 'card',
        autoApprove: false,
        timeoutMs: 30000,
      },
    },
    description: 'Tool calling with registry pattern and default UI renderers',
  },

  enterprise: {
    flags: {
      streaming: true,
      errorRecovery: true,
      memory: true,
      tokenOptimization: true,
      tools: true,
      rag: true,
      safety: true,
      observability: true,
    },
    config: {
      memory: {
        strategy: 'hybrid',
        maxTokens: 8192,
        limit: 200,
      },
      tokenOptimization: {
        budget: 16384,
        qualityThreshold: 0.9,
        compression: 'aggressive',
      },
      safety: {
        level: 'strict',
        piiRedaction: true,
        promptInjectionDetection: true,
        contentModeration: true,
        auditLog: true,
      },
      observability: {
        metrics: true,
        tracing: true,
        logging: true,
        logLevel: 'debug',
      },
    },
    description:
      'Full features: Memory + Token Optimization + Safety + Observability + RAG + Tools',
  },
}

// =============================================================================
// Default Resolved Configuration
// =============================================================================

export const DEFAULT_RESOLVED_CONFIG: ClarityResolvedConfig = {
  features: DEFAULT_FEATURE_FLAGS,
  memory: DEFAULT_MEMORY_CONFIG,
  tokenOptimization: DEFAULT_TOKEN_OPTIMIZATION_CONFIG,
  tools: DEFAULT_TOOLS_CONFIG,
  rag: DEFAULT_RAG_CONFIG,
  safety: DEFAULT_SAFETY_CONFIG,
  observability: DEFAULT_OBSERVABILITY_CONFIG,
  ui: DEFAULT_UI_CONFIG,
  errorRecovery: DEFAULT_ERROR_RECOVERY_CONFIG,
  streaming: DEFAULT_STREAMING_CONFIG,
}

// =============================================================================
// Model Token Budget Defaults
// =============================================================================

/**
 * Default token budgets for common models
 * Used when tokenOptimization is enabled but no explicit budget is set
 */
export const MODEL_TOKEN_BUDGETS: Record<string, number> = {
  'gpt-4': 8192,
  'gpt-4-turbo': 128000,
  'gpt-4o': 128000,
  'gpt-4o-mini': 128000,
  'gpt-3.5-turbo': 16385,
  'claude-3-opus': 200000,
  'claude-3-sonnet': 200000,
  'claude-3-haiku': 200000,
  'claude-3.5-sonnet': 200000,
  'claude-3.5-haiku': 200000,
  // Default fallback
  default: 8192,
}

/**
 * Get default token budget for a model
 */
export function getModelTokenBudget(model: string): number {
  const normalizedModel = model.toLowerCase()

  // Check for exact match
  if (MODEL_TOKEN_BUDGETS[normalizedModel]) {
    return MODEL_TOKEN_BUDGETS[normalizedModel]
  }

  // Check for partial match
  for (const [key, value] of Object.entries(MODEL_TOKEN_BUDGETS)) {
    if (normalizedModel.includes(key) || key.includes(normalizedModel)) {
      return value
    }
  }

  // Return default with warning
  const defaultBudget = MODEL_TOKEN_BUDGETS['default'] ?? 8192
  if (typeof console !== 'undefined') {
    console.warn(
      `[ClarityChatApp] Unknown model "${model}", using default token budget of ${defaultBudget}. ` +
        `Consider setting config.tokenOptimization.budget explicitly.`
    )
  }

  return defaultBudget
}
