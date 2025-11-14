/**
 * Clarity Memory - Error Handling Utilities
 * 
 * Enhanced error handling and recovery
 */

/**
 * Custom error classes
 */
export class MemoryError extends Error {
  constructor(message: string, public code?: string, public context?: any) {
    super(message)
    this.name = 'MemoryError'
    Object.setPrototypeOf(this, MemoryError.prototype)
  }
}

export class ValidationError extends MemoryError {
  constructor(message: string, public field?: string, context?: any) {
    super(message, 'VALIDATION_ERROR', context)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class StorageError extends MemoryError {
  constructor(message: string, public store?: string, context?: any) {
    super(message, 'STORAGE_ERROR', context)
    this.name = 'StorageError'
    Object.setPrototypeOf(this, StorageError.prototype)
  }
}

export class EmbeddingError extends MemoryError {
  constructor(message: string, public provider?: string, context?: any) {
    super(message, 'EMBEDDING_ERROR', context)
    this.name = 'EmbeddingError'
    Object.setPrototypeOf(this, EmbeddingError.prototype)
  }
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number
  delay: number
  backoff?: 'linear' | 'exponential'
  factor?: number
  onRetry?: (attempt: number, error: Error) => void
}

/**
 * Retry with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  const {
    maxAttempts,
    delay,
    backoff = 'exponential',
    factor = 2,
    onRetry,
  } = config

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxAttempts) {
        throw lastError
      }

      if (onRetry) {
        onRetry(attempt, lastError)
      }

      // Calculate delay
      let currentDelay = delay
      if (backoff === 'exponential') {
        currentDelay = delay * Math.pow(factor, attempt - 1)
      } else {
        currentDelay = delay * attempt
      }

      await new Promise(resolve => setTimeout(resolve, currentDelay))
    }
  }

  throw lastError || new Error('Retry failed')
}

/**
 * Safe async wrapper
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  defaultValue?: T
): Promise<{ success: boolean; data?: T; error?: Error }> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    if (defaultValue !== undefined) {
      return { success: false, data: defaultValue, error: err }
    }
    return { success: false, error: err }
  }
}

/**
 * Error recovery strategies
 */
export type RecoveryStrategy = 'skip' | 'retry' | 'fallback' | 'throw'

export interface ErrorRecoveryConfig {
  strategy: RecoveryStrategy
  maxRetries?: number
  fallback?: () => Promise<any>
}

/**
 * Execute with error recovery
 */
export async function withRecovery<T>(
  fn: () => Promise<T>,
  config: ErrorRecoveryConfig
): Promise<T> {
  const { strategy, maxRetries = 3, fallback } = config

  try {
    return await fn()
  } catch (error) {
    switch (strategy) {
      case 'skip':
        // Return undefined or empty result
        return undefined as any

      case 'retry':
        return retry(fn, {
          maxAttempts: maxRetries,
          delay: 100,
        })

      case 'fallback':
        if (fallback) {
          return await fallback()
        }
        throw error

      case 'throw':
      default:
        throw error
    }
  }
}

/**
 * Error boundary for async operations
 */
export class ErrorBoundary {
  private errors: Error[] = []
  private onError?: (error: Error) => void

  constructor(onError?: (error: Error) => void) {
    this.onError = onError
  }

  async execute<T>(fn: () => Promise<T>): Promise<T | null> {
    try {
      return await fn()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.errors.push(err)
      if (this.onError) {
        this.onError(err)
      }
      return null
    }
  }

  getErrors(): Error[] {
    return [...this.errors]
  }

  clear(): void {
    this.errors = []
  }

  hasErrors(): boolean {
    return this.errors.length > 0
  }
}
