/**
 * Type-safe configuration builder for security settings
 * Provides compile-time safety and runtime validation
 */

import type { EnhancedSecurityConfig } from './enhanced-security'
import { TokenOptimizationError, TokenErrorCode } from '../errors'

export interface SecurityConfigBuilder {
  withRateLimiting(
    maxPerMinute?: number,
    maxPerHour?: number
  ): SecurityConfigBuilder
  withEncryption(enable?: boolean, key?: string): SecurityConfigBuilder
  withThreatDetection(threshold?: number): SecurityConfigBuilder
  withZeroTrust(authRequired?: boolean): SecurityConfigBuilder
  withCompliance(standards?: string[]): SecurityConfigBuilder
  withAutoQuarantine(threshold?: number): SecurityConfigBuilder
  withRedisStore(url?: string, prefix?: string): SecurityConfigBuilder
  build(): EnhancedSecurityConfig
}

export class TypeSafeSecurityConfigBuilder implements SecurityConfigBuilder {
  private config: Partial<EnhancedSecurityConfig> = {}

  constructor() {
    // Set secure defaults
    this.config = {
      enableSanitization: true,
      enablePIIRedaction: true,
      enableAuditLogging: true,
      enableCompressionObfuscation: true,
      enableRateLimiting: true,
      maxRequestsPerMinute: 60,
      maxRequestsPerHour: 1000,
      enableEncryption: true,
      enableMLThreatDetection: true,
      threatDetectionThreshold: 0.7,
      enableZeroTrust: true,
      authenticationRequired: true,
      enableRealTimeMonitoring: true,
      complianceStandards: ['SOC2', 'GDPR'],
      enableAutoQuarantine: true,
      quarantineThreshold: 0.8,
    }
  }

  withRateLimiting(
    maxPerMinute = 60,
    maxPerHour = 1000
  ): SecurityConfigBuilder {
    if (maxPerMinute <= 0 || maxPerHour <= 0) {
      throw new TokenOptimizationError(
        'Rate limiting values must be positive',
        TokenErrorCode.INVALID_INPUT,
        false,
        { maxPerMinute, maxPerHour }
      )
    }
    if (maxPerMinute > maxPerHour) {
      throw new TokenOptimizationError(
        'Per-minute rate cannot exceed per-hour rate',
        TokenErrorCode.INVALID_INPUT,
        false,
        { maxPerMinute, maxPerHour }
      )
    }

    this.config.enableRateLimiting = true
    this.config.maxRequestsPerMinute = maxPerMinute
    this.config.maxRequestsPerHour = maxPerHour
    return this
  }

  withEncryption(enable = true, key?: string): SecurityConfigBuilder {
    if (enable && !key) {
      throw new TokenOptimizationError(
        'Encryption key required when encryption is enabled',
        TokenErrorCode.INVALID_INPUT,
        false,
        { encryptionEnabled: enable }
      )
    }
    this.config.enableEncryption = enable
    this.config.encryptionKey = key
    return this
  }

  withThreatDetection(threshold = 0.7): SecurityConfigBuilder {
    if (threshold < 0 || threshold > 1) {
      throw new TokenOptimizationError(
        'Threat detection threshold must be between 0 and 1',
        TokenErrorCode.INVALID_INPUT,
        false,
        { threshold, validRange: '[0, 1]' }
      )
    }
    this.config.enableMLThreatDetection = true
    this.config.threatDetectionThreshold = threshold
    return this
  }

  withZeroTrust(authRequired = true): SecurityConfigBuilder {
    this.config.enableZeroTrust = true
    this.config.authenticationRequired = authRequired
    return this
  }

  withCompliance(standards = ['SOC2', 'GDPR']): SecurityConfigBuilder {
    const validStandards = ['SOC2', 'HIPAA', 'GDPR', 'PCI-DSS', 'ISO27001']
    const invalidStandards = standards.filter(
      (s) => !validStandards.includes(s)
    )

    if (invalidStandards.length > 0) {
      throw new TokenOptimizationError(
        `Invalid compliance standards: ${invalidStandards.join(', ')}`,
        TokenErrorCode.INVALID_INPUT,
        false,
        { invalidStandards, validStandards }
      )
    }

    this.config.complianceStandards = standards
    return this
  }

  withAutoQuarantine(threshold = 0.8): SecurityConfigBuilder {
    if (threshold < 0 || threshold > 1) {
      throw new TokenOptimizationError(
        'Quarantine threshold must be between 0 and 1',
        TokenErrorCode.INVALID_INPUT,
        false,
        { threshold, validRange: '[0, 1]' }
      )
    }
    this.config.enableAutoQuarantine = true
    this.config.quarantineThreshold = threshold
    return this
  }

  withRedisStore(
    url = 'redis://localhost:6379',
    prefix = 'security:'
  ): SecurityConfigBuilder {
    this.config.redisStore = {
      enabled: true,
      redisUrl: url,
      keyPrefix: prefix,
    }
    return this
  }

  build(): EnhancedSecurityConfig {
    const finalConfig = this.config as EnhancedSecurityConfig

    // Runtime validation
    this.validateConfig(finalConfig)

    return finalConfig
  }

  private validateConfig(config: EnhancedSecurityConfig): void {
    if (config.enableRateLimiting) {
      if (config.maxRequestsPerMinute <= 0 || config.maxRequestsPerHour <= 0) {
        throw new TokenOptimizationError(
          'Rate limiting values must be positive',
          TokenErrorCode.INVALID_INPUT,
          false,
          {
            maxRequestsPerMinute: config.maxRequestsPerMinute,
            maxRequestsPerHour: config.maxRequestsPerHour,
          }
        )
      }
      if (config.maxRequestsPerMinute > config.maxRequestsPerHour) {
        throw new TokenOptimizationError(
          'Per-minute rate cannot exceed per-hour rate',
          TokenErrorCode.INVALID_INPUT,
          false,
          {
            maxRequestsPerMinute: config.maxRequestsPerMinute,
            maxRequestsPerHour: config.maxRequestsPerHour,
          }
        )
      }
    }

    if (config.enableEncryption && !config.encryptionKey) {
      throw new TokenOptimizationError(
        'Encryption key required when encryption is enabled',
        TokenErrorCode.INVALID_INPUT,
        false,
        { encryptionEnabled: config.enableEncryption }
      )
    }

    if (
      config.threatDetectionThreshold < 0 ||
      config.threatDetectionThreshold > 1
    ) {
      throw new TokenOptimizationError(
        'Threat detection threshold must be between 0 and 1',
        TokenErrorCode.INVALID_INPUT,
        false,
        { threshold: config.threatDetectionThreshold, validRange: '[0, 1]' }
      )
    }

    if (config.quarantineThreshold < 0 || config.quarantineThreshold > 1) {
      throw new TokenOptimizationError(
        'Quarantine threshold must be between 0 and 1',
        TokenErrorCode.INVALID_INPUT,
        false,
        { threshold: config.quarantineThreshold, validRange: '[0, 1]' }
      )
    }
  }
}

export function createSecurityConfig(): SecurityConfigBuilder {
  return new TypeSafeSecurityConfigBuilder()
}

// Predefined configuration profiles
export const SecurityProfiles = {
  HIGH_SECURITY: createSecurityConfig()
    .withRateLimiting(30, 500)
    .withEncryption(!!process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_KEY)
    .withThreatDetection(0.5)
    .withZeroTrust(true)
    .withCompliance(['SOC2', 'HIPAA', 'GDPR'])
    .withAutoQuarantine(0.6)
    .withRedisStore()
    .build(),

  STANDARD_SECURITY: createSecurityConfig()
    .withRateLimiting(60, 1000)
    .withEncryption(!!process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_KEY)
    .withThreatDetection(0.7)
    .withZeroTrust(true)
    .withCompliance(['SOC2', 'GDPR'])
    .withAutoQuarantine(0.8)
    .build(),

  MINIMAL_SECURITY: createSecurityConfig()
    .withRateLimiting(120, 2000)
    .withEncryption(false)
    .withThreatDetection(0.9)
    .withZeroTrust(false)
    .withCompliance(['GDPR'])
    .withAutoQuarantine(0.95)
    .build(),

  DEVELOPMENT: createSecurityConfig()
    .withRateLimiting(1000, 10000)
    .withEncryption(false)
    .withThreatDetection(0.95)
    .withZeroTrust(false)
    .withCompliance([])
    .withAutoQuarantine(1.0)
    .build(),
}
