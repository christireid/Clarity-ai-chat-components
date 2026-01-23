/**
 * Enhanced Error Handling for Token Optimization
 *
 * Provides structured error handling with recovery strategies
 */

import { InputValidator } from './input-validator'
import { smartCountTokens } from '../../components/smart-fallback'

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  VALIDATION = 'validation',
  TIMEOUT = 'timeout',
  RESOURCE = 'resource',
  DEPENDENCY = 'dependency',
  CONFIGURATION = 'configuration',
  UNKNOWN = 'unknown',
}

export interface TokenOptimizationError extends Error {
  code: string
  severity: ErrorSeverity
  category: ErrorCategory
  context?: ErrorContext
  recoverable: boolean
  suggestedActions: string[]
  fallbackUsed?: boolean
  originalError?: Error
}

export interface ErrorContext {
  operation: string
  input?: any
  config?: any
  timestamp: number
  metadata?: Record<string, any>
  environment?: {
    userAgent?: string
    platform?: string
    timestamp: number
  }
}

export interface ErrorRecoveryStrategy {
  name: string
  description: string
  applicable: (error: TokenOptimizationError) => boolean
  execute: (error: TokenOptimizationError) => Promise<any>
  priority: number
}

export class TokenOptimizationErrorHandler {
  private recoveryStrategies: Map<string, ErrorRecoveryStrategy> = new Map()
  private errorHistory: TokenOptimizationError[] = []
  private maxHistorySize = 50

  constructor() {
    this.initializeRecoveryStrategies()
  }

  private initializeRecoveryStrategies() {
    // Input validation recovery
    this.recoveryStrategies.set('validation-fallback', {
      name: 'Validation Fallback',
      description: 'Attempt to sanitize and retry with validated input',
      applicable: (error) => error.category === ErrorCategory.VALIDATION,
      priority: 1,
      execute: async (error) => {
        if (error.context?.input) {
          const validation = InputValidator.validateTextInput(
            error.context.input
          )
          if (validation.valid) {
            return smartCountTokens(validation.sanitized)
          }
        }
        throw error
      },
    })

    // Timeout recovery
    this.recoveryStrategies.set('timeout-retry', {
      name: 'Timeout Retry with Increased Limit',
      description: 'Retry operation with longer timeout',
      applicable: (error) => error.category === ErrorCategory.TIMEOUT,
      priority: 1,
      execute: async (error) => {
        if (error.context?.input) {
          // Retry with 2x timeout and simpler approach
          return smartCountTokens(error.context.input)
        }
        throw error
      },
    })

    // Resource recovery
    this.recoveryStrategies.set('resource-cleanup', {
      name: 'Resource Cleanup and Retry',
      description: 'Clean up resources and retry operation',
      applicable: (error) => error.category === ErrorCategory.RESOURCE,
      priority: 2,
      execute: async (error) => {
        // Clear caches and retry with simpler approach
        if (error.context?.input) {
          return smartCountTokens(error.context.input)
        }
        throw error
      },
    })

    // Dependency recovery
    this.recoveryStrategies.set('dependency-fallback', {
      name: 'Dependency Fallback',
      description: 'Fall back to alternative implementation',
      applicable: (error) => error.category === ErrorCategory.DEPENDENCY,
      priority: 1,
      execute: async (error) => {
        if (error.context?.input) {
          // Use basic character-based estimation
          const text = String(error.context.input)
          return Math.ceil(text.length / 4) // Basic estimation
        }
        throw error
      },
    })
  }

  /**
   * Create a structured error with context
   */
  createError(
    message: string,
    code: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    context?: Partial<ErrorContext>
  ): TokenOptimizationError {
    const error = new Error(message) as TokenOptimizationError
    error.name = 'TokenOptimizationError'
    error.code = code
    error.category = category
    error.severity = severity
    error.context = {
      operation: context?.operation || 'unknown',
      input: context?.input,
      config: context?.config,
      timestamp: Date.now(),
      metadata: context?.metadata,
      environment: {
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        platform:
          typeof navigator !== 'undefined' ? navigator.platform : undefined,
        timestamp: Date.now(),
      },
    }

    // Determine recoverability
    error.recoverable = this.isRecoverable(error)

    // Generate suggested actions
    error.suggestedActions = this.generateSuggestedActions(error)

    // Add to history
    this.addToHistory(error)

    return error
  }

  /**
   * Handle errors with recovery strategies
   */
  async handleError<T>(
    error: Error | TokenOptimizationError,
    context: ErrorContext,
    recoveryOptions?: {
      attemptRecovery?: boolean
      maxRecoveryAttempts?: number
      fallbackValue?: T
    }
  ): Promise<T> {
    const options = {
      attemptRecovery: true,
      maxRecoveryAttempts: 3,
      ...recoveryOptions,
    }

    // Convert to TokenOptimizationError if needed
    const tokenError = this.normalizeError(error, context)

    // Log error for monitoring
    this.logError(tokenError)

    // Attempt recovery if applicable
    if (options.attemptRecovery && tokenError.recoverable) {
      const recoveryResult = await this.attemptRecovery(tokenError, options)
      if (recoveryResult.success) {
        return recoveryResult.value
      }
    }

    // Use fallback value if provided
    if (options.fallbackValue !== undefined) {
      return options.fallbackValue
    }

    // Re-throw if no recovery possible
    throw tokenError
  }

  /**
   * Normalize different error types to TokenOptimizationError
   */
  private normalizeError(
    error: Error | TokenOptimizationError,
    context: ErrorContext
  ): TokenOptimizationError {
    if (this.isTokenOptimizationError(error)) {
      return { ...error, context: { ...error.context, ...context } }
    }

    // Categorize based on error message
    const category = this.categorizeError(error)
    const severity = this.determineSeverity(error, category)

    return this.createError(
      error.message,
      this.generateErrorCode(error),
      category,
      severity,
      context
    )
  }

  /**
   * Categorize errors based on patterns
   */
  private categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase()

    if (message.includes('timeout') || message.includes('time')) {
      return ErrorCategory.TIMEOUT
    }
    if (message.includes('memory') || message.includes('resource')) {
      return ErrorCategory.RESOURCE
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorCategory.VALIDATION
    }
    if (message.includes('dependency') || message.includes('module')) {
      return ErrorCategory.DEPENDENCY
    }
    if (message.includes('config') || message.includes('configuration')) {
      return ErrorCategory.CONFIGURATION
    }

    return ErrorCategory.UNKNOWN
  }

  /**
   * Determine error severity
   */
  private determineSeverity(
    error: Error,
    category: ErrorCategory
  ): ErrorSeverity {
    // Critical errors
    if (
      error.message.includes('out of memory') ||
      error.message.includes('stack overflow')
    ) {
      return ErrorSeverity.CRITICAL
    }

    // High severity
    if (
      category === ErrorCategory.RESOURCE ||
      category === ErrorCategory.DEPENDENCY
    ) {
      return ErrorSeverity.HIGH
    }

    // Medium severity
    if (
      category === ErrorCategory.TIMEOUT ||
      category === ErrorCategory.CONFIGURATION
    ) {
      return ErrorSeverity.MEDIUM
    }

    // Low severity for validation errors
    return ErrorSeverity.LOW
  }

  /**
   * Generate error code
   */
  private generateErrorCode(error: Error): string {
    const category = this.categorizeError(error)
    const message = error.message.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')
    return `${category}-${message}-${Date.now() % 1000}`
  }

  /**
   * Determine if error is recoverable
   */
  private isRecoverable(error: TokenOptimizationError): boolean {
    return (
      error.severity !== ErrorSeverity.CRITICAL &&
      [
        ErrorCategory.VALIDATION,
        ErrorCategory.TIMEOUT,
        ErrorCategory.DEPENDENCY,
      ].includes(error.category)
    )
  }

  /**
   * Generate suggested actions
   */
  private generateSuggestedActions(error: TokenOptimizationError): string[] {
    const actions: string[] = []

    switch (error.category) {
      case ErrorCategory.VALIDATION:
        actions.push('Check input format and constraints')
        actions.push('Use InputValidator to sanitize input')
        actions.push('Consider using fallback token counting')
        break
      case ErrorCategory.TIMEOUT:
        actions.push('Increase timeout for large texts')
        actions.push('Use character-based estimation for quick results')
        actions.push('Split large texts into smaller chunks')
        break
      case ErrorCategory.RESOURCE:
        actions.push('Clear caches and retry')
        actions.push('Reduce input size if possible')
        actions.push('Use simpler token counting method')
        break
      case ErrorCategory.DEPENDENCY:
        actions.push('Check if @clarity-chat/token-optimization is installed')
        actions.push('Use built-in fallback tokenizers')
        actions.push('Verify model encoding support')
        break
      default:
        actions.push('Check error logs for details')
        actions.push('Try simplified input or configuration')
        actions.push('Contact support if issue persists')
    }

    return actions
  }

  /**
   * Attempt recovery using strategies
   */
  private async attemptRecovery(
    error: TokenOptimizationError,
    options: { maxRecoveryAttempts?: number }
  ): Promise<{ success: boolean; value?: any; attempts: number }> {
    const maxAttempts = options.maxRecoveryAttempts || 3
    let attempts = 0

    // Get applicable strategies
    const strategies = Array.from(this.recoveryStrategies.values())
      .filter((strategy) => strategy.applicable(error))
      .sort((a, b) => a.priority - b.priority)

    for (const strategy of strategies) {
      attempts++
      try {
        const result = await strategy.execute(error)
        return { success: true, value: result, attempts }
      } catch (recoveryError) {
        // Try next strategy - check if max attempts reached
        if (attempts >= maxAttempts) {
          break
        }
        continue
      }
    }

    return { success: false, attempts }
  }

  /**
   * Add error to history
   */
  private addToHistory(error: TokenOptimizationError): void {
    this.errorHistory.push(error)
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift()
    }
  }

  /**
   * Log error for monitoring
   */
  private logError(error: TokenOptimizationError): void {
    const logEntry = {
      timestamp: Date.now(),
      code: error.code,
      severity: error.severity,
      category: error.category,
      message: error.message,
      recoverable: error.recoverable,
    }

    // In production, this would send to monitoring service
    console.error('[TokenOptimization]', logEntry)
  }

  /**
   * Check if error is TokenOptimizationError
   */
  private isTokenOptimizationError(
    error: any
  ): error is TokenOptimizationError {
    return (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      'category' in error
    )
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number
    byCategory: Record<ErrorCategory, number>
    bySeverity: Record<ErrorSeverity, number>
    recoverableRate: number
    recentErrors: TokenOptimizationError[]
  } {
    const stats = {
      totalErrors: this.errorHistory.length,
      byCategory: {} as Record<ErrorCategory, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
      recoverableRate: 0,
      recentErrors: this.errorHistory.slice(-10),
    }

    // Count by category
    Object.values(ErrorCategory).forEach((category) => {
      stats.byCategory[category] = this.errorHistory.filter(
        (e) => e.category === category
      ).length
    })

    // Count by severity
    Object.values(ErrorSeverity).forEach((severity) => {
      stats.bySeverity[severity] = this.errorHistory.filter(
        (e) => e.severity === severity
      ).length
    })

    // Calculate recoverable rate
    const recoverableCount = this.errorHistory.filter(
      (e) => e.recoverable
    ).length
    stats.recoverableRate =
      stats.totalErrors > 0 ? recoverableCount / stats.totalErrors : 0

    return stats
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.errorHistory = []
  }
}

// Export singleton instance
export const errorHandler = new TokenOptimizationErrorHandler()
