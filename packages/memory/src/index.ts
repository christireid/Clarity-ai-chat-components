/**
 * @clarity-chat/memory
 *
 * Framework-agnostic AI memory and context management utilities
 * Works with any JavaScript/TypeScript application
 *
 * @example Zero-config usage
 * ```typescript
 * import { clarityMemory } from '@clarity-chat/memory'
 *
 * const mem = clarityMemory()
 * await mem.add("User prefers TypeScript", { type: 'semantic', importance: 0.9 })
 * const results = await mem.recall("user preferences")
 * ```
 *
 * @example With configuration
 * ```typescript
 * import { clarityMemory } from '@clarity-chat/memory'
 *
 * const mem = clarityMemory({
 *   storage: { type: 'indexeddb' },
 *   embeddingProvider: { provider: 'openai', apiKey: '...' },
 * })
 * ```
 *
 * @packageDocumentation
 */

// Factory function (recommended entry point)
export { clarityMemory, clarityMemoryHelpers } from './factory'

// Core types
export * from './types'

// Memory service (framework-agnostic)
export { MemoryService } from './memory-service'

// Consent management (GDPR/CCPA compliance)
export {
  ConsentManager,
  type ConsentPurpose,
  type ConsentEvent,
  type ConsentRecord,
  type ConsentVerification,
} from './consent'

// Audit logging (GDPR Article 30 compliance)
export {
  AuditLogger,
  type AuditEventType,
  type AuditEventSeverity,
  type AuditEventMetadata,
  type AuditLogEntry,
  type AuditLogQuery,
  type AuditLogStats,
  type AuditLoggerConfig,
} from './audit'

// Error handling (typed errors with error codes)
export {
  MemoryError,
  MemoryConfigError,
  MemoryConsentError,
  MemoryOperationError,
  MemoryStorageError,
  MemoryEmbeddingError,
  MemoryQueryError,
  MemoryToolError,
  MemoryValidationError,
  MemoryErrorCode,
  isMemoryError,
  isMemoryErrorType,
  formatErrorForUser,
  getErrorCode,
} from './errors'

// Configuration presets and profiles
export {
  ENVIRONMENT_PRESETS,
  APPLICATION_PROFILES,
  createConfig,
  getPreset,
  getProfile,
  listPresets,
  listProfiles,
} from './config-presets'

// Token optimization utilities re-exported for convenience
// Note: Import directly from @clarity-chat/token-optimization for full API access
export type {
  QualityGateConfig,
  CostAwareConfig,
  SemanticCacheConfig,
} from '@clarity-chat/token-optimization'

// LLM-based summarization (80-90% token reduction)
export {
  LLMSummarizer,
  createSummarizerWithFallback,
  extractiveSummarize,
  type LLMSummarizationConfig,
  type SummaryResult,
  type ConversationSummary,
  type HierarchicalSummary,
  type SummaryMessage,
  type SummaryStyle,
} from './summarization/llm-summarizer'

// Base summarizer interface
export type { Summarizer } from './summarization/summarizer'

// OpenAI summarizer
export {
  OpenAISummarizer,
  type OpenAISummarizerConfig,
} from './summarization/openai-summarizer'

// Anthropic summarizer
export {
  AnthropicSummarizer,
  type AnthropicSummarizerConfig,
} from './summarization/anthropic-summarizer'

// Importance scoring
export {
  ImportanceScorer,
  type ImportanceScorerConfig,
} from './scoring/importance-scorer'

// Memory decay/forgetting (inspired by Mem0's dynamic forgetting)
export {
  DecayManager,
  createDecayManager,
  DEFAULT_DECAY_CONFIG,
  type DecayManagerConfig,
  type DecayPolicy,
  type DecayResult,
  type DecayCurve,
} from './utils/decay-manager'

// Token optimization utilities (internal)
export { TokenCounter } from './utils/token-counter'
export type {
  ModelFamily,
  ContentType,
  TokenCountResult,
} from './utils/token-counter'

export { TokenBudgetManager } from './context/token-budget'
export { ContextOptimizer } from './utils/context-optimizer'
export type {
  TokenBudgetAllocation,
  CompressedMemory as CompressedMemoryResult,
} from './utils/context-optimizer'

// Re-export key interfaces for convenience
export type {
  MemoryItem,
  MemoryQuery,
  MemorySearchResult,
  MemoryServiceConfig,
  MemoryStats,
  MemoryType,
  MemoryScope,
  MemoryPriority,
  MemoryEvent,
  MemoryContext,
  TokenAllocation,
  TokenOptimizationConfig,
  CompressedMemory,
  MemoryChunk,
  DeletionResult,
  DeletionVerification,
  DataExportResult,
  DataExportOptions,
} from './types'
