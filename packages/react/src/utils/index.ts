/**
 * Utility Functions Export
 * 
 * Re-export commonly used utilities for convenience.
 * Note: Most utilities are domain-specific and exported from their respective domains.
 * 
 * @internal
 * These utilities are primarily for internal use. Public APIs should use
 * domain-specific exports from their respective domains.
 */

// Class name utility
export * from './cn'

// Model fallback and retry
export * from './model-fallback'

// Context window management
export * from './context-window'

// Memory & Context Management - exported separately via ./memory module
// export * from './memory'

// Rate limiting
export * from './rate-limiting'

// Hybrid search
export * from './hybrid-search'

// Mobile utilities (existing)
export * from './mobile'

// Token Optimization Utilities
// Note: CompressionOptions/Result from prompt-compression conflict with memory types
// Only export the compressPrompt function from here
export { compressPrompt } from './prompt-compression'

// Advanced Semantic Compression (LLMLingua-style)
export {
  compressPromptSemantic,
  compressPromptCombined,
  calculateTokenImportance,
  estimateCompressibility,
  type SemanticCompressionOptions,
  type SemanticCompressionResult,
  type TokenImportance,
} from './prompt-compression-advanced'

// Context Ordering (Lost-in-the-Middle mitigation)
export {
  reorderForAttention,
  addStructuralMarkers,
  optimizeContextLayout,
  calculateMessageImportance,
  estimateAttentionLoss,
  createContextOrderingHook,
  type ContextMessage,
  type OrderingOptions,
  type OrderedContext,
  type StructuredMessage,
} from './context-ordering'

// Chain-of-Thought (CoT) Optimization
export {
  analyzeCoTPrompt,
  optimizeCoTPrompt,
  addZeroShotCoT,
  recommendCoTApproach,
  estimateCoTSavings,
  createCoTPrompt,
  COT_TRIGGERS,
  type CoTOptimizationOptions,
  type CoTAnalysis,
  type CoTOptimizationResult,
} from './cot-optimizer'

export * from './smart-cache'
export * from './model-router'
export * from './response-limiter'
export * from './request-batcher'
export * from './reference-handler'
export * from './response-prefilling'
export * from './prompt-structure'

// Tokenization utilities
export * from './tokenization'

// Configuration Builder
export * from './chat-config-builder'

// Streaming utilities (shared across hooks)
export * from './streaming-helpers'

// Message conversion utilities (canonical implementation)
export * from './message-conversion'
// Legacy exports for backward compatibility
// Note: Commented out to avoid duplicate exports - message-converter re-exports from message-conversion
// export * from './message-converter'

// Tool result extraction utilities
export * from './tool-result-extractor'

// Message conversion utilities are exported from chat-ui domain
// See: src/exports/chat-ui.ts
// These are re-exported here for backward compatibility only

// Message grouping utilities
export * from './message-grouping'
