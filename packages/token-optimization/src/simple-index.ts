/**
 * Token Optimization System - Simplified Version
 *
 * Basic implementation for testing without external dependencies
 */

// Core exports
export { AccurateTokenCounter } from './tokenizers/accurate-counter'
export { SimpleSecurityManager as TokenSecurityManager } from './security/simple-security'
export { SimpleToonOptimizer as ToonOptimizer } from './formats/simple-toon'
export { SimpleUnifiedOptimizer as UnifiedTokenOptimizer } from './simple-unified'

// Types
export interface TokenizerConfig {
  model: string
  cacheSize?: number
  enableCaching?: boolean
  enableMonitoring?: boolean
}

export interface SecurityConfig {
  enableSanitization: boolean
  enableCompressionObfuscation: boolean
  enableAuditLogging: boolean
  enablePIIRedaction: boolean
  noiseLevel?: number
  complianceLevel?: 'basic' | 'enterprise' | 'government'
  auditRetention?: number
}

export interface ToonConfig {
  enableArrayTables: boolean
  maxArraySizeForTable: number
  preserveKeys: boolean
  compactNumbers: boolean
  quoteStrings: boolean
}

// Constants
export const DEFAULT_TOKENIZER_CONFIG = {
  model: 'gpt-4',
  cacheSize: 10000,
  enableCaching: true,
  enableMonitoring: true,
} as const

export const DEFAULT_SECURITY_CONFIG = {
  enableSanitization: true,
  enableCompressionObfuscation: true,
  enableAuditLogging: true,
  enablePIIRedaction: true,
  noiseLevel: 0.1,
  complianceLevel: 'enterprise' as const,
  auditRetention: 30,
} as const

export const DEFAULT_TOON_CONFIG = {
  enableArrayTables: true,
  maxArraySizeForTable: 1000,
  preserveKeys: false,
  compactNumbers: true,
  quoteStrings: false,
} as const
