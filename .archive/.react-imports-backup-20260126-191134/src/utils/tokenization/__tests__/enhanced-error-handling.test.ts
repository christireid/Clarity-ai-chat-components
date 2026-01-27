import { describe, it, expect, beforeEach } from 'vitest'
import {
  TokenOptimizationErrorHandler,
  ErrorCategory,
  ErrorSeverity,
} from '../enhanced-error-handling'

describe('Enhanced Error Handling Unit Tests', () => {
  let errorHandler: TokenOptimizationErrorHandler

  beforeEach(() => {
    errorHandler = new TokenOptimizationErrorHandler()
  })

  describe('Error Creation', () => {
    it('should create structured errors with all required properties', () => {
      const error = errorHandler.createError(
        'Test error message',
        'TEST_ERROR',
        ErrorCategory.VALIDATION,
        ErrorSeverity.LOW,
        {
          operation: 'testOperation',
          input: 'test input',
          timestamp: Date.now(),
        }
      )

      expect(error.message).toBe('Test error message')
      expect(error.code).toBe('TEST_ERROR')
      expect(error.category).toBe(ErrorCategory.VALIDATION)
      expect(error.severity).toBe(ErrorSeverity.LOW)
      expect(error.recoverable).toBe(true)
      expect(error.suggestedActions).toBeDefined()
      expect(error.suggestedActions.length).toBeGreaterThan(0)
    })

    it('should categorize errors correctly', () => {
      const timeoutError = errorHandler.createError(
        'Operation timed out',
        'TIMEOUT_001',
        ErrorCategory.TIMEOUT,
        ErrorSeverity.MEDIUM
      )
      expect(timeoutError.category).toBe(ErrorCategory.TIMEOUT)

      const resourceError = errorHandler.createError(
        'Out of memory',
        'RESOURCE_001',
        ErrorCategory.RESOURCE,
        ErrorSeverity.HIGH
      )
      expect(resourceError.category).toBe(ErrorCategory.RESOURCE)
    })

    it('should determine severity correctly', () => {
      const criticalError = errorHandler.createError(
        'Out of memory error',
        'CRITICAL_001',
        ErrorCategory.RESOURCE,
        ErrorSeverity.CRITICAL
      )
      expect(criticalError.severity).toBe(ErrorSeverity.CRITICAL)
      expect(criticalError.recoverable).toBe(false)
    })
  })

  describe('Error Recovery', () => {
    it('should attempt recovery for recoverable errors', async () => {
      const validationError = errorHandler.createError(
        'Invalid input format',
        'VALIDATION_001',
        ErrorCategory.VALIDATION,
        ErrorSeverity.LOW,
        {
          operation: 'validateInput',
          input: 'invalid input',
          timestamp: Date.now(),
        }
      )

      const result = await errorHandler.handleError(
        validationError,
        { operation: 'test', timestamp: Date.now() },
        { attemptRecovery: true, fallbackValue: 'fallback result' }
      )

      expect(result).toBe('fallback result')
    })

    it('should use fallback value when recovery fails', async () => {
      const error = new Error('Unrecoverable error')
      const result = await errorHandler.handleError(
        error,
        { operation: 'test', timestamp: Date.now() },
        {
          attemptRecovery: true,
          fallbackValue: 'default fallback',
          maxRecoveryAttempts: 1,
        }
      )

      expect(result).toBe('default fallback')
    })
  })

  describe('Error Statistics', () => {
    it('should track error history', () => {
      // Create multiple errors
      for (let i = 0; i < 5; i++) {
        errorHandler.createError(
          `Test error ${i}`,
          `TEST_${i}`,
          ErrorCategory.VALIDATION,
          ErrorSeverity.LOW
        )
      }

      const stats = errorHandler.getErrorStats()
      expect(stats.totalErrors).toBe(5)
      expect(stats.byCategory[ErrorCategory.VALIDATION]).toBe(5)
      expect(stats.recentErrors.length).toBe(5)
    })

    it('should limit error history size', () => {
      // Create more errors than max history size
      for (let i = 0; i < 60; i++) {
        errorHandler.createError(
          `Test error ${i}`,
          `TEST_${i}`,
          ErrorCategory.VALIDATION,
          ErrorSeverity.LOW
        )
      }

      const stats = errorHandler.getErrorStats()
      expect(stats.totalErrors).toBe(50) // Limited to maxHistorySize
      expect(stats.recentErrors.length).toBe(50)
    })

    it('should calculate recoverable rate correctly', () => {
      // Create mix of recoverable and non-recoverable errors
      errorHandler.createError(
        'Recoverable error',
        'RECOVERABLE_001',
        ErrorCategory.VALIDATION,
        ErrorSeverity.LOW
      )

      errorHandler.createError(
        'Non-recoverable critical error',
        'CRITICAL_001',
        ErrorCategory.RESOURCE,
        ErrorSeverity.CRITICAL
      )

      const stats = errorHandler.getErrorStats()
      expect(stats.recoverableRate).toBe(0.5) // 1 out of 2
    })
  })

  describe('Error Categorization', () => {
    it('should categorize timeout errors correctly', () => {
      const timeoutError = new Error('Operation timed out after 5000ms')
      const normalizedError = (errorHandler as any).normalizeError(
        timeoutError,
        {
          operation: 'countTokens',
          timestamp: Date.now(),
        }
      )

      expect(normalizedError.category).toBe(ErrorCategory.TIMEOUT)
    })

    it('should categorize resource errors correctly', () => {
      const resourceError = new Error('Out of memory')
      const normalizedError = (errorHandler as any).normalizeError(
        resourceError,
        {
          operation: 'compressText',
          timestamp: Date.now(),
        }
      )

      expect(normalizedError.category).toBe(ErrorCategory.RESOURCE)
    })

    it('should categorize validation errors correctly', () => {
      const validationError = new Error('Invalid input format')
      const normalizedError = (errorHandler as any).normalizeError(
        validationError,
        {
          operation: 'validateInput',
          timestamp: Date.now(),
        }
      )

      expect(normalizedError.category).toBe(ErrorCategory.VALIDATION)
    })
  })

  describe('Recovery Strategies', () => {
    it('should have validation fallback strategy', () => {
      const strategies = (errorHandler as any).recoveryStrategies
      expect(strategies.has('validation-fallback')).toBe(true)

      const strategy = strategies.get('validation-fallback')
      expect(strategy.name).toBe('Validation Fallback')
      expect(strategy.priority).toBe(1)
    })

    it('should have timeout retry strategy', () => {
      const strategies = (errorHandler as any).recoveryStrategies
      expect(strategies.has('timeout-retry')).toBe(true)

      const strategy = strategies.get('timeout-retry')
      expect(strategy.name).toBe('Timeout Retry with Increased Limit')
      expect(strategy.priority).toBe(1)
    })

    it('should have dependency fallback strategy', () => {
      const strategies = (errorHandler as any).recoveryStrategies
      expect(strategies.has('dependency-fallback')).toBe(true)

      const strategy = strategies.get('dependency-fallback')
      expect(strategy.name).toBe('Dependency Fallback')
      expect(strategy.priority).toBe(1)
    })
  })
})
