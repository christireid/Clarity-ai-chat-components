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

// Security exports
export { EnhancedSecurityManager } from './security/enhanced-security'
export type { 
  EnhancedSecurityConfig, 
  SecurityContext, 
  ThreatIntelligence,
  EnhancedValidationResult 
} from './security/enhanced-security'

export { TokenSecurityManager } from './security/token-security'
export type { 
  SecurityConfig as TokenSecurityConfig, 
  SecurityEvent, 
  SanitizationResult,
  ProtectionResult,
  ComplianceReport 
} from './security/token-security'

// Security configuration builder
export { createSecurityConfig, SecurityProfiles } from './security/security-config-builder'
export type { SecurityConfigBuilder } from './security/security-config-builder'

// Security testing playground
export { createSecurityTestingPlayground, runSecurityTests } from './security/security-testing-playground'
export type { SecurityTestCase, SecurityTestResult } from './security/security-testing-playground'

// Security event streaming
export { createSecurityEventStreamer, SecurityStreamSubscribers } from './security/security-event-streaming'
export type { SecurityStreamEvent, StreamSubscriber, StreamMetrics } from './security/security-event-streaming'

// Redis security store
export { createSecurityStore } from './security/redis-security-store'
export type { RedisSecurityStore } from './security/redis-security-store'

// Security dashboard
export { createSecurityDashboard } from './security/security-dashboard'
export type { SecurityDashboard } from './security/security-dashboard'

// Quality exports
export { QualityGate } from './quality/quality-gate'
export type { 
  QualityGateConfig,
  QualityMetrics as QualityGateMetrics,
  QualityCheckResult,
  QualityContext
} from './quality/quality-gate'

// Cost exports
export { CostAwareOptimizer } from './cost/cost-aware-optimizer'
export type {
  CostAwareConfig,
  CostEstimate,
  OptimizationStrategy as CostOptimizationStrategy,
  BudgetStatus,
  ResourceRequirements
} from './cost/cost-aware-optimizer'

// Caching exports
export { AdvancedSemanticCache } from './caching/advanced-semantic-cache'
export type {
  SemanticCacheConfig,
  CachedEntry,
  CacheMetadata,
  SemanticCacheResult,
  CacheContext,
  CacheStats
} from './caching/advanced-semantic-cache'

// Compression exports
export { DynamicCompressionEngine } from './compression/dynamic-compression'
export type {
  DynamicCompressionConfig,
  CompressionStrategy,
  CompressionResult,
  CompressionContext,
  QualityMetrics as CompressionQualityMetrics
} from './compression/dynamic-compression'