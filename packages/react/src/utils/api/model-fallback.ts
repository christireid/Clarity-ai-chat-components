import { logger } from '@clarity-chat/utils/logger';
/**
 * Model Fallback Utilities
 * 
 * Flexible utilities for implementing automatic fallback across AI providers.
 * Bring your own retry logic or use these helpers.
 */

export interface FallbackModelConfig {
  provider: string
  model: string
  priority: number
  maxRetries?: number
}

export interface FallbackOptions {
  models: FallbackModelConfig[]
  maxTotalRetries?: number
  retryDelay?: number
  exponentialBackoff?: boolean
  /** 
   * Add jitter to retry delays to prevent thundering herd (default: true)
   * Jitter randomizes delays between 50-150% of calculated value
   */
  jitter?: boolean
  onFallback?: (from: FallbackModelConfig, to: FallbackModelConfig, error: Error) => void
  onRetry?: (attempt: number, model: FallbackModelConfig, error: Error) => void
  /** Optional AbortSignal to cancel entire fallback chain */
  signal?: AbortSignal
}

export interface FallbackResult<T> {
  data?: T
  model: FallbackModelConfig
  attempts: number
  errors: Array<{ model: FallbackModelConfig; error: Error }>
  success: boolean
}

/**
 * Execute a function with automatic fallback across models
 * 
 * @example
 * ```tsx
 * const result = await withModelFallback(
 *   async (model) => {
 *     return await callAI(model.provider, model.model, prompt)
 *   },
 *   {
 *     models: [
 *       { provider: 'openai', model: 'gpt-4', priority: 1 },
 *       { provider: 'anthropic', model: 'claude-3', priority: 2 },
 *       { provider: 'openai', model: 'gpt-3.5', priority: 3 },
 *     ],
 *     onFallback: (from, to, error) => {
 *       logger.debug(`Falling back from ${from.model} to ${to.model}`)
 *     },
 *   }
 * )
 * ```
 */
export async function withModelFallback<T>(
  fn: (model: FallbackModelConfig) => Promise<T>,
  options: FallbackOptions
): Promise<FallbackResult<T>> {
  const models = [...options.models].sort((a, b) => a.priority - b.priority)
  const errors: Array<{ model: FallbackModelConfig; error: Error }> = []
  
  let totalAttempts = 0
  const maxTotalRetries = options.maxTotalRetries ?? Infinity
  
  for (const model of models) {
    const maxRetries = model.maxRetries ?? 3
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      if (totalAttempts >= maxTotalRetries) {
        break
      }
      
      totalAttempts++
      
      try {
        const data = await fn(model)
        
        return {
          data,
          model,
          attempts: totalAttempts,
          errors,
          success: true,
        }
      } catch (error: any) {
        errors.push({ model, error })
        
        if (options.onRetry) {
          options.onRetry(attempt, model, error)
        }
        
        // Don't retry on these errors
        if (isNonRetryableError(error)) {
          break
        }
        
        // Wait before retry
        if (attempt < maxRetries) {
          const delay = calculateDelay(
            options.retryDelay ?? 1000,
            attempt,
            options.exponentialBackoff ?? true,
            options.jitter ?? true
          )
          await sleep(delay, options.signal)
        }
      }
    }
    
    // Try next model
    const nextModel = models[models.indexOf(model) + 1]
    const lastError = errors[errors.length - 1]
    if (nextModel && options.onFallback && lastError) {
      options.onFallback(model, nextModel, lastError.error)
    }
  }

  const lastModel = models[models.length - 1]
  if (!lastModel) {
    throw new Error('No models available in fallback chain')
  }

  return {
    model: lastModel,
    attempts: totalAttempts,
    errors,
    success: false,
  }
}

/**
 * Check if an error should not be retried
 */
function isNonRetryableError(error: any): boolean {
  const message = error.message?.toLowerCase() || ''
  
  // Authentication errors
  if (message.includes('unauthorized') || message.includes('auth')) {
    return true
  }
  
  // Invalid request errors
  if (message.includes('invalid') || message.includes('bad request')) {
    return true
  }
  
  // Content policy violations
  if (message.includes('content policy') || message.includes('safety')) {
    return true
  }
  
  // HTTP status codes
  if (error.status) {
    if (error.status === 401 || error.status === 403) {
      return true
    }
    if (error.status >= 400 && error.status < 500) {
      return true
    }
  }
  
  return false
}

/**
 * Calculate retry delay with optional exponential backoff and jitter.
 * 
 * **Jitter prevents "thundering herd" problem** where multiple clients
 * retry simultaneously, overwhelming the service. Adding randomness
 * distributes retry attempts over time.
 * 
 * @param baseDelay - Base delay in milliseconds
 * @param attempt - Current attempt number (1-indexed)
 * @param exponential - Whether to use exponential backoff
 * @param jitter - Add randomized jitter (0.5-1.5x multiplier) to prevent thundering herd
 * @returns Calculated delay in milliseconds
 */
function calculateDelay(
  baseDelay: number,
  attempt: number,
  exponential: boolean,
  jitter: boolean = true
): number {
  let delay: number
  
  if (exponential) {
    // Exponential backoff: 1x, 2x, 4x, 8x, etc.
    delay = baseDelay * Math.pow(2, attempt - 1)
  } else {
    delay = baseDelay
  }

  if (jitter) {
    // Add jitter: randomize between 50% and 150% of calculated delay
    // This distributes retry attempts and prevents synchronized retries
    const jitterMultiplier = 0.5 + Math.random()
    delay = Math.floor(delay * jitterMultiplier)
  }

  return delay
}

/**
 * Sleep helper with optional AbortSignal support for cancellation.
 * 
 * @param ms - Milliseconds to sleep
 * @param signal - Optional AbortSignal to cancel the sleep
 * @returns Promise that resolves after delay or rejects if aborted
 * @throws {DOMException} AbortError if signal is aborted
 * 
 * @example
 * ```ts
 * const controller = new AbortController()
 * 
 * // Cancel sleep after 1 second
 * setTimeout(() => controller.abort(), 1000)
 * 
 * try {
 *   await sleep(5000, controller.signal)
 * } catch (error) {
 *   if (error.name === 'AbortError') {
 *     logger.debug('Sleep was cancelled')
 *   }
 * }
 * ```
 */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already aborted
    if (signal?.aborted) {
      reject(new DOMException('Sleep aborted', 'AbortError'))
      return
    }

    const timeoutId = setTimeout(() => {
      cleanup()
      resolve()
    }, ms)

    const cleanup = () => {
      clearTimeout(timeoutId)
      signal?.removeEventListener('abort', handleAbort)
    }

    const handleAbort = () => {
      cleanup()
      reject(new DOMException('Sleep aborted', 'AbortError'))
    }

    signal?.addEventListener('abort', handleAbort)
  })
}

/**
 * Model Fallback Manager
 * 
 * Stateful manager for handling fallback logic.
 */
export class ModelFallbackManager {
  private models: FallbackModelConfig[]
  private currentIndex = 0
  private attempts = new Map<string, number>()
  
  constructor(models: FallbackModelConfig[]) {
    this.models = [...models].sort((a, b) => a.priority - b.priority)
  }
  
  /**
   * Get current model
   */
  getCurrentModel(): FallbackModelConfig {
    const currentModel = this.models[this.currentIndex]
    if (!currentModel) {
      throw new Error(`No model found at index ${this.currentIndex}`)
    }
    return currentModel
  }
  
  /**
   * Get next model (fallback)
   */
  getNextModel(): FallbackModelConfig | null {
    if (this.currentIndex < this.models.length - 1) {
      this.currentIndex++
      return this.models[this.currentIndex] ?? null
    }
    return null
  }
  
  /**
   * Check if more fallback options are available
   */
  hasNextModel(): boolean {
    return this.currentIndex < this.models.length - 1
  }
  
  /**
   * Reset to first model
   */
  reset(): void {
    this.currentIndex = 0
    this.attempts.clear()
  }
  
  /**
   * Record an attempt for current model
   */
  recordAttempt(error: Error): void {
    const model = this.getCurrentModel()
    const key = `${model.provider}:${model.model}`
    const count = (this.attempts.get(key) || 0) + 1
    this.attempts.set(key, count)
  }
  
  /**
   * Get attempt count for model
   */
  getAttemptCount(model: FallbackModelConfig): number {
    const key = `${model.provider}:${model.model}`
    return this.attempts.get(key) || 0
  }
  
  /**
   * Check if should retry current model
   */
  shouldRetry(): boolean {
    const model = this.getCurrentModel()
    const maxRetries = model.maxRetries ?? 3
    return this.getAttemptCount(model) < maxRetries
  }
}

