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

// Token optimization utilities
export {
  TokenCounter,
  TokenBudgetManager,
  MemoryCompressor,
  SemanticChunker,
  ContextOptimizer,
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
} from './types'
