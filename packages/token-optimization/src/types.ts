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
  complianceLevel?: 'basic' | 'enterprise' | 'government'
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
  metadata: any
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
  context: any
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
  details?: any
}

export interface SecurityValidation {
  check: string
  passed: boolean
  severity: 'none' | 'low' | 'medium' | 'high'
  details?: any
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
  context: any
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
  metadata?: any
}

export interface TokenOptimizationStats {
  totalOptimizations: number
  totalTokensSaved: number
  averageSavings: number
  securityEvents: number
  cacheHitRate: number
  methods: Record<string, number>
}