/**
 * Token Optimization Types
 *
 * Comprehensive type definitions for the token optimization system
 */

// Core tokenizer types
export interface TokenizerConfig {
  model: string
  cacheSize?: number
  enableCaching?: boolean
  enableMonitoring?: boolean
}

export interface TokenInfo {
  tokens: number
  characters: number
  words: number
  ratio: number
  estimated: boolean
}

export interface CacheStats {
  size: number
  hits: number
  misses: number
  hitRate: number
  enabled: boolean
}

export interface MonitoringStats {
  enabled: boolean
  totalCalls?: number
  totalTokens?: number
  averageTokens?: number
  runtime?: number
  tokensPerSecond?: number
}

// Security types
export interface SecurityConfig {
  enableSanitization: boolean
  enableCompressionObfuscation: boolean
  enableAuditLogging: boolean
  enablePIIRedaction: boolean
  noiseLevel?: number
  complianceLevel?:
    | 'minimal'
    | 'standard'
    | 'strict'
    | 'basic'
    | 'enterprise'
    | 'government'
  auditRetention?: number
}

export interface SecurityEvent {
  type: 'token_count' | 'compression' | 'optimization' | 'access'
  timestamp: Date
  originalText: string
  processedText?: string
  originalLength: number
  processedLength?: number
  checks: string[]
  riskLevel: 'low' | 'medium' | 'high'
  userId?: string
  sessionId?: string
}

export interface SanitizationResult {
  original: string
  sanitized: string
  threats: Threat[]
  riskLevel: 'low' | 'medium' | 'high'
}

export interface ProtectionResult {
  original: string
  protected: string
  redactedTypes: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

export interface ProtectedMetrics {
  compressionRatio: number
  originalTokens: number
  compressedTokens: number
  noiseLevel: number
  protectionLevel: string
}

export interface Threat {
  type: string
  severity: 'low' | 'medium' | 'high'
  pattern: string
  detected: boolean
}

export interface ComplianceReport {
  timestamp: string
  complianceLevel: string
  totalEvents: number
  recentEvents: number
  riskLevels: {
    low: number
    medium: number
    high: number
  }
  complianceChecks: Record<string, boolean>
  recommendations: string[]
}

// TOON format types
export interface ToonConfig {
  enableArrayTables: boolean
  maxArraySizeForTable: number
  preserveKeys: boolean
  compactNumbers: boolean
  quoteStrings: boolean
}

export interface SavingsInfo {
  jsonTokens: number
  toonTokens: number
  savings: number
  percentage: number
}

// LLMLingua types
export interface LLMLinguaConfig {
  modelName: string
  compressionRate: number
  useLLMLingua2: boolean
  enableStructureAware: boolean
  enableFallback: boolean
}

export interface CompressionResult {
  original: string
  compressed: string
  originalTokens: number
  compressedTokens: number
  compressionRatio: number
  qualityScore: number
  method: string
}

// Semantic caching types
export interface SemanticCacheConfig {
  maxSize: number
  similarityThreshold: number
  embeddingModel: string
  cleanupInterval: number
  enablePersistence?: boolean
}

export interface CachedResponse {
  embedding: number[]
  response: string
  timestamp: number
  accessCount: number
  metadata: Record<string, unknown>
}

export interface CacheStats {
  size: number
  totalAccesses: number
  hitRate: number
  averageAccessCount: number
}

// Context-aware compression types
export interface ContextAnalysis {
  importance: number // 0-1
  entities: string[]
  keyPhrases: string[]
  sentiment: number // -1 to 1
  complexity: number // 0-1
}

// ML prediction types
export interface MLPrediction {
  optimalStrategy: string
  expectedTokens: number
  confidence: number
  reasoning: string
}

export interface TrainingData {
  prediction: MLPrediction
  actualTokens: number
  quality: number
  context: Record<string, unknown>
}

export interface ModelStats {
  trainingSamples: number
  predictionAccuracy: number
  modelVersion: string
  lastTraining: Date
}

// Advanced security types
export interface AdvancedSecurityConfig {
  enableThreatDetection: boolean
  enableBehaviorAnalysis: boolean
  enableZeroTrust: boolean
  complianceLevel: 'basic' | 'enterprise' | 'government'
  auditRetention?: number
}

export interface SecurityCheck {
  check: string
  passed: boolean
  severity: 'none' | 'low' | 'medium' | 'high'
  details?: Record<string, unknown>
}

export interface SecurityValidation {
  check: string
  passed: boolean
  severity: 'none' | 'low' | 'medium' | 'high'
  details?: Record<string, unknown>
}

export interface SecurityContext {
  userId?: string
  sessionId?: string
  requestId?: string
  timestamp: Date
  sensitiveData?: boolean
  ipAddress?: string
  userAgent?: string
}

export interface SecurityAudit {
  timestamp: string
  riskScore: number
  validations: SecurityValidation[]
  context: Record<string, unknown>
  recommendations: string[]
  compliance: ComplianceStatus
}

export interface ComplianceStatus {
  compliant: boolean
  checksPassed: number
  totalChecks: number
  level: 'basic' | 'enterprise' | 'government'
}

// Unified optimizer types
export interface UnifiedOptimizerConfig {
  tokenizer: TokenizerConfig
  security: SecurityConfig
  toon?: ToonConfig
  llmlingua?: LLMLinguaConfig
  cache?: SemanticCacheConfig
  advanced?: AdvancedSecurityConfig
}

export interface OptimizationResult {
  original: string
  optimized: string
  originalTokens: number
  optimizedTokens: number
  savings: number
  percentage: number
  method: string
  security: {
    sanitized: boolean
    threats: Threat[]
    riskLevel: 'low' | 'medium' | 'high'
  }
  metadata?: Record<string, unknown>
}

export interface TokenOptimizationStats {
  totalOptimizations: number
  totalTokensSaved: number
  averageSavings: number
  securityEvents: number
  cacheHitRate: number
  methods: Record<string, number>
}

// =============================================================================
// Canonical TokenBudgetConfig
// =============================================================================

/**
 * Canonical token budget configuration.
 *
 * This is the single source of truth for token budget configuration across
 * all packages. Other packages should import and use this type instead of
 * defining their own. Use the narrower subtypes for package-specific needs.
 *
 * Consolidates fields from:
 * - `packages/memory/src/types/config.ts` (maxContextWindow, allocation, dynamicAllocation)
 * - `packages/react/src/utils/tokenization/token-budget-validator.ts` (thresholds, truncation)
 * - `packages/token-optimization/src/budget/advanced-budget.ts` (quality, compression, caching)
 * - `packages/token-optimization/src/hooks/use-token-budget-monitor.ts` (callbacks, model)
 */
export interface CanonicalTokenBudgetConfig {
  /** Maximum token limit (context window or input limit) */
  maxTokens: number

  /** Tokens reserved for output/response generation */
  reservedForOutput?: number

  /** Warning threshold as decimal (default: 0.8 = 80%) */
  warningThreshold?: number

  /** Critical threshold as decimal (default: 0.95 = 95%) */
  criticalThreshold?: number

  /** Minimum quality threshold for compression (0-1) */
  minQualityThreshold?: number

  /** Enable dynamic allocation between categories */
  enableDynamicAllocation?: boolean

  /** Enable token compression */
  enableCompression?: boolean

  /** Enable response caching */
  enableCaching?: boolean

  /** Auto-truncate when budget exceeded */
  autoTruncate?: boolean

  /** Truncation strategy */
  truncationStrategy?: 'truncate' | 'remove' | 'summarize'

  /** Priority weights for token allocation */
  priorityWeights?: {
    system: number
    user: number
    context: number
    response: number
  }

  /** Model name for accurate token counting */
  model?: string

  /** Callback when warning threshold is crossed */
  onWarning?: (usage: unknown) => void

  /** Callback when critical threshold is crossed */
  onCritical?: (usage: unknown) => void

  /** Callback when budget exceeded */
  onExceeded?: (usage: unknown) => void

  /** Auto-trigger trimming at critical threshold */
  autoTrim?: boolean

  /** Debounce delay for token counting in ms */
  debounceMs?: number

  /** Use accurate tokenization (slower but precise) */
  useAccurateTokenization?: boolean
}

/**
 * Narrowed config for memory package use cases.
 */
export type MemoryTokenBudgetConfig = Pick<
  CanonicalTokenBudgetConfig,
  'maxTokens' | 'enableDynamicAllocation' | 'priorityWeights'
>

/**
 * Narrowed config for React UI validation use cases.
 */
export type ReactTokenBudgetConfig = Pick<
  CanonicalTokenBudgetConfig,
  'maxTokens' | 'warningThreshold' | 'criticalThreshold' | 'autoTruncate' | 'truncationStrategy'
>

/**
 * Narrowed config for advanced budget management.
 */
export type AdvancedTokenBudgetConfig = Pick<
  CanonicalTokenBudgetConfig,
  | 'maxTokens'
  | 'reservedForOutput'
  | 'minQualityThreshold'
  | 'enableDynamicAllocation'
  | 'enableCompression'
  | 'enableCaching'
  | 'priorityWeights'
>

// Export commonly used types for convenience
export type TokenCount = TokenInfo
export type OptimizationStrategy =
  | 'toon'
  | 'llmlingua'
  | 'semantic'
  | 'truncation'
  | 'hybrid'
export type AdvancedSecurityConfigType = AdvancedSecurityConfig
