/**
 * Middleware Pipeline System
 *
 * Composable middleware for request/response processing.
 * Enables powerful transformations and integrations.
 *
 * @packageDocumentation
 */

import type {
  ExtensionLogger,
  Middleware,
  MiddlewareContext,
  MiddlewareFunction,
  MiddlewarePipeline,
} from './types'

// ============================================
// Middleware Context Factory
// ============================================

/**
 * Create a middleware context
 */
export function createMiddlewareContext(
  partial?: Partial<MiddlewareContext>
): MiddlewareContext {
  return {
    requestId: partial?.requestId ?? generateRequestId(),
    timestamp: partial?.timestamp ?? new Date(),
    metadata: partial?.metadata ?? {},
    logger: partial?.logger ?? createDefaultLogger(),
    signal: partial?.signal ?? new AbortController().signal,
  }
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

function createDefaultLogger(): ExtensionLogger {
  return {
    debug: (msg, ...args) => console.debug('[Middleware]', msg, ...args),
    info: (msg, ...args) => console.info('[Middleware]', msg, ...args),
    warn: (msg, ...args) => console.warn('[Middleware]', msg, ...args),
    error: (msg, ...args) => console.error('[Middleware]', msg, ...args),
    child: (prefix) => ({
      debug: (msg, ...args) =>
        console.debug(`[Middleware:${prefix}]`, msg, ...args),
      info: (msg, ...args) =>
        console.info(`[Middleware:${prefix}]`, msg, ...args),
      warn: (msg, ...args) =>
        console.warn(`[Middleware:${prefix}]`, msg, ...args),
      error: (msg, ...args) =>
        console.error(`[Middleware:${prefix}]`, msg, ...args),
      child: function (p: string) {
        return createDefaultLogger().child(`${prefix}:${p}`)
      },
    }),
  }
}

// ============================================
// Middleware Pipeline Implementation
// ============================================

class MiddlewarePipelineImpl<
  TInput,
  TOutput = TInput,
> implements MiddlewarePipeline<TInput, TOutput> {
  private middleware: Middleware<TInput, TOutput>[] = []

  use(middleware: Middleware<TInput, TOutput>): void {
    this.middleware.push(middleware)
    // Sort by priority (lower = earlier)
    this.middleware.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))
  }

  remove(name: string): void {
    this.middleware = this.middleware.filter((m) => m.name !== name)
  }

  async execute(
    input: TInput,
    partialContext?: Partial<MiddlewareContext>
  ): Promise<TOutput> {
    const context = createMiddlewareContext(partialContext)

    // Build the chain
    let index = 0
    const chain = async (): Promise<TOutput> => {
      if (index >= this.middleware.length) {
        // End of chain - return input as output (identity)
        return input as unknown as TOutput
      }

      const current = this.middleware[index++]

      // Check for abort
      if (context.signal.aborted) {
        throw new Error('Middleware pipeline aborted')
      }

      try {
        context.logger.debug(`Executing middleware: ${current.name}`)
        const start = performance.now()

        const result = await current.handler(input, context, chain)

        const duration = performance.now() - start
        context.logger.debug(
          `Middleware ${current.name} completed in ${duration.toFixed(2)}ms`
        )

        return result
      } catch (error) {
        context.logger.error(`Middleware ${current.name} failed:`, error)
        throw error
      }
    }

    return chain()
  }

  getAll(): Middleware<TInput, TOutput>[] {
    return [...this.middleware]
  }
}

/**
 * Create a new middleware pipeline
 */
export function createMiddlewarePipeline<
  TInput,
  TOutput = TInput,
>(): MiddlewarePipeline<TInput, TOutput> {
  return new MiddlewarePipelineImpl<TInput, TOutput>()
}

// ============================================
// Pre-built Middleware Factories
// ============================================

/**
 * Create a logging middleware
 */
export function createLoggingMiddleware<T>(name = 'logging'): Middleware<T, T> {
  return {
    name,
    priority: 1,
    handler: async (input, context, next) => {
      context.logger.info(`Request ${context.requestId} started`)
      const start = performance.now()

      try {
        const result = await next()
        const duration = performance.now() - start
        context.logger.info(
          `Request ${context.requestId} completed in ${duration.toFixed(2)}ms`
        )
        return result
      } catch (error) {
        const duration = performance.now() - start
        context.logger.error(
          `Request ${context.requestId} failed after ${duration.toFixed(2)}ms:`,
          error
        )
        throw error
      }
    },
  }
}

/**
 * Create a timeout middleware
 */
export function createTimeoutMiddleware<T>(
  timeoutMs: number,
  name = 'timeout'
): Middleware<T, T> {
  return {
    name,
    priority: 2,
    handler: async (input, context, next) => {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              `Request ${context.requestId} timed out after ${timeoutMs}ms`
            )
          )
        }, timeoutMs)
      })

      return Promise.race([next(), timeoutPromise])
    },
  }
}

/**
 * Create a retry middleware
 */
export function createRetryMiddleware<T>(
  options: {
    maxRetries?: number
    delay?: number
    backoffMultiplier?: number
    retryOn?: (error: unknown) => boolean
  } = {},
  name = 'retry'
): Middleware<T, T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoffMultiplier = 2,
    retryOn = () => true,
  } = options

  return {
    name,
    priority: 3,
    handler: async (input, context, next) => {
      let lastError: unknown
      let currentDelay = delay

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            context.logger.info(
              `Request ${context.requestId} retry attempt ${attempt}/${maxRetries}`
            )
          }
          return await next()
        } catch (error) {
          lastError = error
          if (attempt < maxRetries && retryOn(error)) {
            await sleep(currentDelay)
            currentDelay *= backoffMultiplier
          }
        }
      }

      throw lastError
    },
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Create a rate limiting middleware
 */
export function createRateLimitMiddleware<T>(
  options: {
    maxRequests: number
    windowMs: number
    onRateLimited?: () => void
  },
  name = 'rate-limit'
): Middleware<T, T> {
  const { maxRequests, windowMs, onRateLimited } = options
  const requests: number[] = []

  return {
    name,
    priority: 5,
    handler: async (input, context, next) => {
      const now = Date.now()

      // Remove old requests outside the window
      while (requests.length > 0 && requests[0] < now - windowMs) {
        requests.shift()
      }

      if (requests.length >= maxRequests) {
        onRateLimited?.()
        throw new Error(
          `Rate limit exceeded: ${maxRequests} requests per ${windowMs}ms`
        )
      }

      requests.push(now)
      return next()
    },
  }
}

/**
 * Create a caching middleware
 */
export function createCachingMiddleware<T>(
  options: {
    getCacheKey: (input: T) => string
    ttlMs?: number
    maxSize?: number
  },
  name = 'cache'
): Middleware<T, T> {
  const { getCacheKey, ttlMs = 60000, maxSize = 100 } = options
  const cache = new Map<string, { value: T; expires: number }>()

  return {
    name,
    priority: 10,
    handler: async (input, context, next) => {
      const key = getCacheKey(input)
      const cached = cache.get(key)

      if (cached && cached.expires > Date.now()) {
        context.logger.debug(`Cache hit for ${key}`)
        return cached.value
      }

      context.logger.debug(`Cache miss for ${key}`)
      const result = await next()

      // Evict oldest entries if cache is full
      if (cache.size >= maxSize) {
        const oldestKey = cache.keys().next().value
        if (oldestKey) {
          cache.delete(oldestKey)
        }
      }

      cache.set(key, { value: result, expires: Date.now() + ttlMs })
      return result
    },
  }
}

/**
 * Create a validation middleware
 */
export function createValidationMiddleware<T>(
  validator: (input: T) => boolean | string,
  name = 'validation'
): Middleware<T, T> {
  return {
    name,
    priority: 20,
    handler: async (input, context, next) => {
      const result = validator(input)
      if (result !== true) {
        const message =
          typeof result === 'string' ? result : 'Validation failed'
        throw new Error(message)
      }
      return next()
    },
  }
}

/**
 * Create a transform middleware
 */
export function createTransformMiddleware<TInput, TOutput>(
  transformer: (input: TInput) => TOutput | Promise<TOutput>,
  name = 'transform'
): Middleware<TInput, TOutput> {
  return {
    name,
    priority: 50,
    handler: async (input, context, next) => {
      const transformed = await transformer(input)
      // Note: This replaces the result, doesn't continue chain
      return transformed
    },
  }
}

/**
 * Create a side-effect middleware (doesn't modify data)
 */
export function createSideEffectMiddleware<T>(
  effect: (input: T, context: MiddlewareContext) => void | Promise<void>,
  name = 'side-effect'
): Middleware<T, T> {
  return {
    name,
    priority: 90,
    handler: async (input, context, next) => {
      await effect(input, context)
      return next()
    },
  }
}

/**
 * Create an error handling middleware
 */
export function createErrorHandlerMiddleware<T>(
  handler: (error: unknown, context: MiddlewareContext) => T | Promise<T>,
  name = 'error-handler'
): Middleware<T, T> {
  return {
    name,
    priority: 0, // Run first (wraps everything)
    handler: async (input, context, next) => {
      try {
        return await next()
      } catch (error) {
        return handler(error, context)
      }
    },
  }
}

/**
 * Create a metrics middleware
 */
export function createMetricsMiddleware<T>(
  options: {
    onRequest?: (context: MiddlewareContext) => void
    onSuccess?: (context: MiddlewareContext, durationMs: number) => void
    onError?: (
      context: MiddlewareContext,
      error: unknown,
      durationMs: number
    ) => void
  },
  name = 'metrics'
): Middleware<T, T> {
  return {
    name,
    priority: 1,
    handler: async (input, context, next) => {
      options.onRequest?.(context)
      const start = performance.now()

      try {
        const result = await next()
        options.onSuccess?.(context, performance.now() - start)
        return result
      } catch (error) {
        options.onError?.(context, error, performance.now() - start)
        throw error
      }
    },
  }
}

// ============================================
// Message-Specific Middleware Types
// ============================================

/** Chat message structure */
export interface ChatMessageInput {
  content: string
  role: 'user' | 'assistant' | 'system'
  metadata?: Record<string, unknown>
}

/** Chat response structure */
export interface ChatMessageOutput {
  content: string
  role: 'assistant'
  metadata?: Record<string, unknown>
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Create a content filter middleware for chat
 */
export function createContentFilterMiddleware(
  filter: (content: string) => string,
  name = 'content-filter'
): Middleware<ChatMessageInput, ChatMessageInput> {
  return {
    name,
    priority: 30,
    handler: async (input, context, next) => {
      // Apply filter to input content before passing to next middleware
      const filteredInput: ChatMessageInput = {
        ...input,
        content: filter(input.content),
      }
      // Update the input reference so next middleware sees filtered content
      Object.assign(input, filteredInput)
      return next()
    },
  }
}

/**
 * Create a PII redaction middleware
 */
export function createPIIRedactionMiddleware(
  patterns?: RegExp[],
  name = 'pii-redaction'
): Middleware<ChatMessageInput, ChatMessageInput> {
  const defaultPatterns = [
    /\b[\w.-]+@[\w.-]+\.\w+\b/g, // Email
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
    /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g, // SSN
    /\b\d{16}\b/g, // Credit card (basic)
  ]

  const allPatterns = patterns ?? defaultPatterns

  return {
    name,
    priority: 25,
    handler: async (input, context, next) => {
      let content = input.content
      for (const pattern of allPatterns) {
        // Reset regex lastIndex for global patterns
        pattern.lastIndex = 0
        content = content.replace(pattern, '[REDACTED]')
      }
      // Update input with redacted content for downstream middleware
      input.content = content
      return next()
    },
  }
}

// ============================================
// Middleware Composition Utilities
// ============================================

/**
 * Compose multiple middleware into a single middleware
 */
export function composeMiddleware<T>(
  ...middlewares: Middleware<T, T>[]
): Middleware<T, T> {
  return {
    name: 'composed',
    priority: middlewares[0]?.priority ?? 50,
    handler: async (input, context, next) => {
      const pipeline = createMiddlewarePipeline<T, T>()
      for (const m of middlewares) {
        pipeline.use(m)
      }
      // Add final middleware to call next
      pipeline.use({
        name: '_final',
        priority: 999,
        handler: async () => next(),
      })
      return pipeline.execute(input, context)
    },
  }
}

/**
 * Create conditional middleware that only runs when condition is true
 */
export function conditionalMiddleware<T>(
  condition: (input: T, context: MiddlewareContext) => boolean,
  middleware: Middleware<T, T>
): Middleware<T, T> {
  return {
    name: `conditional(${middleware.name})`,
    priority: middleware.priority,
    handler: async (input, context, next) => {
      if (condition(input, context)) {
        return middleware.handler(input, context, next)
      }
      return next()
    },
  }
}
