/**
 * @clarity-chat/memory
 * 
 * Framework-agnostic AI memory and context management utilities
 * Works with any JavaScript/TypeScript application
 */

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
} from './token-optimizer'

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
export { OpenAISummarizer, type OpenAISummarizerConfig } from './summarization/openai-summarizer'

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
