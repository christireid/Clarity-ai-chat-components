/**
 * Token Optimization Package - Enhanced Implementation
 *
 * This package provides advanced token optimization capabilities including:
 * - Enhanced security with comprehensive threat protection
 * - Quality gates with 85% minimum quality preservation
 * - Cost-aware optimization with budget management
 * - Advanced semantic caching with 90%+ cost reduction
 * - Dynamic compression with quality preservation
 */
// Security exports (Node.js only - uses events module via security-dashboard)
// export { EnhancedSecurityManager } from './security/enhanced-security'
// export type {
//   EnhancedSecurityConfig,
//   SecurityContext,
//   ThreatIntelligence,
//   EnhancedValidationResult,
// } from './security/enhanced-security'
export { TokenSecurityManager } from './security/token-security';
// Security configuration builder (depends on enhanced-security)
// export {
//   createSecurityConfig,
//   SecurityProfiles,
// } from './security/security-config-builder'
// export type { SecurityConfigBuilder } from './security/security-config-builder'
// Security testing playground (depends on enhanced-security)
// export {
//   createSecurityTestingPlayground,
//   runSecurityTests,
// } from './security/security-testing-playground'
// export type {
//   SecurityTestCase,
//   SecurityTestResult,
// } from './security/security-testing-playground'
// Security event streaming (Node.js only - uses events module)
// export { createSecurityEventStreamer, SecurityStreamSubscribers } from './security/security-event-streaming'
// export type { SecurityStreamEvent, StreamSubscriber, StreamMetrics } from './security/security-event-streaming'
// Redis security store (Node.js only - uses events module)
// export { createSecurityStore } from './security/redis-security-store'
// export type { RedisSecurityStore } from './security/redis-security-store'
// Security dashboard (Node.js only - uses events module)
// export { createSecurityDashboard } from './security/security-dashboard'
// export type { SecurityDashboard } from './security/security-dashboard'
// Quality exports
export { QualityGate } from './quality/quality-gate';
// Cost exports
export { CostAwareOptimizer } from './cost/cost-aware-optimizer';
// Caching exports
export { AdvancedSemanticCache } from './caching/advanced-semantic-cache';
// Compression exports
export { DynamicCompressionEngine } from './compression/dynamic-compression';
// Token counting exports (legacy compatibility)
export { TokenCounter } from './legacy-compatibility';
// Tokenizers - using gpt-tokenizer (20x smaller than tiktoken WASM)
export { AccurateTokenCounter } from './tokenizers/accurate-counter';
export { SimpleTokenCounter } from './tokenizers/simple-counter';
// Text chunking - using llm-splitter (100x smaller than LangChain)
export { TextChunker, ChunkingStrategy } from './chunking/text-chunker';
//# sourceMappingURL=index.js.map