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
  onFallback?: (from: FallbackModelConfig, to: FallbackModelConfig, error: Error) => void
  onRetry?: (attempt: number, model: FallbackModelConfig, error: Error) => void
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
 *       console.log(`Falling back from ${from.model} to ${to.model}`)
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
  const errors: Array<{ model: ModelConfig; error: Error }> = []
  
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
            options.exponentialBackoff ?? true
          )
          await sleep(delay)
        }
      }
    }
    
    // Try next model
    const nextModel = models[models.indexOf(model) + 1]
    if (nextModel && options.onFallback) {
      options.onFallback(model, nextModel, errors[errors.length - 1].error)
    }
  }
  
  return {
    model: models[models.length - 1],
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
 * Calculate retry delay with optional exponential backoff
 */
function calculateDelay(
  baseDelay: number,
  attempt: number,
  exponential: boolean
): number {
  if (exponential) {
    return baseDelay * Math.pow(2, attempt - 1)
  }
  return baseDelay
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
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
    return this.models[this.currentIndex]
  }
  
  /**
   * Get next model (fallback)
   */
  getNextModel(): FallbackModelConfig | null {
    if (this.currentIndex < this.models.length - 1) {
      this.currentIndex++
      return this.models[this.currentIndex]
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

