/**
 * Security Module Index
 *
 * Comprehensive security implementations for token optimization
 */

export { TokenSecurityManager } from './token-security'
export type {
  SecurityConfig,
  SecurityEvent,
  SanitizationResult,
  ProtectionResult,
  ProtectedMetrics,
  Threat,
  ComplianceReport,
} from './token-security'

export { EnhancedSecurityManager } from './enhanced-security'
export type {
  EnhancedSecurityConfig,
  SecurityContext,
  EnhancedValidationResult,
} from './enhanced-security'

// Input validation using validator.js
export {
  InputValidator,
  createInputValidator,
  validateInput,
  hasPII,
  redactPII,
} from './input-validator'
export type {
  ValidationResult as InputValidationResult,
  ValidationError as InputValidationError,
  PIIDetectionResult,
  PIIType,
  InputValidationOptions,
} from './input-validator'
