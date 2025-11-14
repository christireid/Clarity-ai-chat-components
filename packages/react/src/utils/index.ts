/**
 * Utility Functions
 * 
 * Optional utilities for building AI applications.
 * Use what you need, extend as needed.
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
export * from './smart-cache'
export * from './model-router'
export * from './response-limiter'
export * from './request-batcher'
export * from './reference-handler'

// Configuration Builder
export * from './chat-config-builder'

// Streaming utilities (shared across hooks)
export * from './streaming-helpers'

// Message conversion utilities
export * from './message-converter'
export * from './message-conversion'

// Tool result extraction utilities
export * from './tool-result-extractor'

