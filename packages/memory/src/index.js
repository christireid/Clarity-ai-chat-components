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
export { clarityMemory, clarityMemoryHelpers } from './factory';
// Core types
export * from './types';
// Memory service (framework-agnostic)
export { MemoryService } from './memory-service';
// LLM-based summarization (80-90% token reduction)
export { LLMSummarizer, createSummarizerWithFallback, extractiveSummarize, } from './summarization/llm-summarizer';
// OpenAI summarizer
export { OpenAISummarizer, } from './summarization/openai-summarizer';
// Anthropic summarizer
export { AnthropicSummarizer, } from './summarization/anthropic-summarizer';
// Importance scoring
export { ImportanceScorer, } from './scoring/importance-scorer';
// Memory decay/forgetting (inspired by Mem0's dynamic forgetting)
export { DecayManager, createDecayManager, DEFAULT_DECAY_CONFIG, } from './utils/decay-manager';
//# sourceMappingURL=index.js.map