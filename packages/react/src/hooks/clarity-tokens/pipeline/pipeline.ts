/**
 * Middleware Pipeline for ClarityTokens
 *
 * Provides a composable pipeline for LLM requests that applies middlewares
 * in order. Middlewares can inspect/modify requests, short-circuit with
 * cached responses, and post-process responses.
 */

import type {
  LLMRequest,
  LLMResponse,
  Middleware,
  NamedMiddleware,
  TelemetryEvent,
  TelemetryHandler,
} from './types'

// =============================================================================
// Pipeline Creation
// =============================================================================

/**
 * Creates a pipeline function from an array of middlewares.
 * Middlewares are executed in order; each can modify the request,
 * short-circuit with a response, or post-process the response.
 */
export function createPipeline(
  middlewares: Middleware[],
  options?: {
    telemetry?: TelemetryHandler
    onError?: (error: Error, req: LLMRequest) => void
  }
): (req: LLMRequest) => Promise<LLMResponse> {
  const { telemetry, onError } = options ?? {}

  return async (req: LLMRequest): Promise<LLMResponse> => {
    const startTime = Date.now()

    // Emit request started event
    telemetry?.({
      type: 'REQUEST_STARTED',
      timestamp: new Date(),
      requestId: req.id,
      data: {
        model: req.model,
        provider: req.provider,
        messageCount: req.messages.length,
      },
    })

    // Build the middleware chain
    const chain = middlewares.reduceRight<
      (req: LLMRequest) => Promise<LLMResponse>
    >(
      (next, middleware) => {
        return (req: LLMRequest) => middleware(req, next)
      },
      // Terminal handler - should never be reached if provider middleware is included
      async (req: LLMRequest): Promise<LLMResponse> => {
        throw new Error(
          `No provider middleware to handle request for ${req.provider}/${req.model}`
        )
      }
    )

    try {
      const response = await chain(req)
      const latencyMs = Date.now() - startTime

      // Emit request completed event
      telemetry?.({
        type: 'REQUEST_COMPLETED',
        timestamp: new Date(),
        requestId: req.id,
        data: {
          latencyMs,
          cached: response.cached?.kind,
          inputTokens: response.usage?.inputTokens,
          outputTokens: response.usage?.outputTokens,
        },
      })

      return {
        ...response,
        latencyMs: response.latencyMs ?? latencyMs,
      }
    } catch (error) {
      // Emit request failed event
      telemetry?.({
        type: 'REQUEST_FAILED',
        timestamp: new Date(),
        requestId: req.id,
        data: {
          error: error instanceof Error ? error.message : String(error),
          latencyMs: Date.now() - startTime,
        },
      })

      onError?.(error instanceof Error ? error : new Error(String(error)), req)
      throw error
    }
  }
}

/**
 * Creates a pipeline from named middlewares with priority ordering.
 * Middlewares are sorted by priority (lower = earlier) and filtered by enabled flag.
 */
export function createNamedPipeline(
  namedMiddlewares: NamedMiddleware[],
  options?: {
    telemetry?: TelemetryHandler
    onError?: (error: Error, req: LLMRequest) => void
  }
): (req: LLMRequest) => Promise<LLMResponse> {
  const sortedMiddlewares = namedMiddlewares
    .filter((m) => m.enabled !== false)
    .sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))
    .map((m) => m.middleware)

  return createPipeline(sortedMiddlewares, options)
}

// =============================================================================
// Built-in Middlewares
// =============================================================================

/**
 * Adds request ID and timestamps to requests
 */
export function requestIdMiddleware(): Middleware {
  return async (req, next) => {
    const enrichedReq: LLMRequest = {
      ...req,
      id: req.id || crypto.randomUUID(),
      createdAt: req.createdAt || new Date(),
    }
    const response = await next(enrichedReq)
    return {
      ...response,
      receivedAt: response.receivedAt || new Date(),
    }
  }
}

/**
 * Counts input tokens and adds to metadata
 */
export function tokenCountMiddleware(
  countFn: (messages: Array<{ role: string; content: string }>) => number,
  telemetry?: TelemetryHandler
): Middleware {
  return async (req, next) => {
    const inputTokens = countFn(req.messages)

    telemetry?.({
      type: 'TOKEN_COUNTED',
      timestamp: new Date(),
      requestId: req.id,
      data: { tokens: inputTokens, messageCount: req.messages.length },
    })

    const enrichedReq: LLMRequest = {
      ...req,
      metadata: {
        ...req.metadata,
        inputTokens,
      },
    }

    return next(enrichedReq)
  }
}

/**
 * Enforces token budget limits
 */
export function budgetGuardMiddleware(
  maxInputTokens: number,
  policy: 'truncate' | 'refuse',
  countFn: (messages: Array<{ role: string; content: string }>) => number,
  telemetry?: TelemetryHandler
): Middleware {
  return async (req, next) => {
    const inputTokens = countFn(req.messages)

    if (inputTokens <= maxInputTokens) {
      return next(req)
    }

    if (policy === 'refuse') {
      throw new Error(
        `Budget exceeded: ${inputTokens} tokens exceeds limit of ${maxInputTokens}`
      )
    }

    // Truncate: remove oldest non-system messages until under budget
    const truncatedMessages = [...req.messages]
    let currentTokens = inputTokens

    while (currentTokens > maxInputTokens && truncatedMessages.length > 1) {
      // Find first non-system message to remove
      const indexToRemove = truncatedMessages.findIndex(
        (m, i) => i > 0 && m.role !== 'system'
      )
      if (indexToRemove === -1) break

      truncatedMessages.splice(indexToRemove, 1)
      currentTokens = countFn(truncatedMessages)
    }

    const removedTokens = inputTokens - currentTokens

    telemetry?.({
      type: 'BUDGET_GUARD_APPLIED',
      timestamp: new Date(),
      requestId: req.id,
      data: {
        beforeTokens: inputTokens,
        afterTokens: currentTokens,
        policy: 'truncate',
        removedTokens,
      },
    })

    return next({
      ...req,
      messages: truncatedMessages,
      metadata: {
        ...req.metadata,
        truncatedTokens: removedTokens,
      },
    })
  }
}

/**
 * Exact cache lookup middleware
 */
export function exactCacheMiddleware(
  cache: {
    get: (key: string) => Promise<LLMResponse | null>
    set: (key: string, value: LLMResponse) => Promise<void>
    makeKey: (req: LLMRequest) => string
  },
  telemetry?: TelemetryHandler
): Middleware {
  return async (req, next) => {
    const key = cache.makeKey(req)
    const cached = await cache.get(key)

    if (cached) {
      telemetry?.({
        type: 'CACHE_HIT',
        timestamp: new Date(),
        requestId: req.id,
        data: { kind: 'exact', key },
      })

      return {
        ...cached,
        id: req.id,
        cached: { kind: 'exact', key, hitAt: new Date() },
      }
    }

    telemetry?.({
      type: 'CACHE_MISS',
      timestamp: new Date(),
      requestId: req.id,
      data: { kind: 'exact', key },
    })

    const response = await next(req)

    // Write back to cache (don't await to avoid blocking)
    cache.set(key, response).catch(() => {
      // Ignore cache write errors
    })

    return response
  }
}

/**
 * Semantic cache lookup middleware
 */
export function semanticCacheMiddleware(
  cache: {
    lookup: (req: LLMRequest) => Promise<LLMResponse | null>
    upsert: (req: LLMRequest, res: LLMResponse) => Promise<void>
  },
  telemetry?: TelemetryHandler
): Middleware {
  return async (req, next) => {
    const cached = await cache.lookup(req)

    if (cached) {
      telemetry?.({
        type: 'CACHE_HIT',
        timestamp: new Date(),
        requestId: req.id,
        data: { kind: 'semantic', similarity: cached.cached?.similarity },
      })

      return {
        ...cached,
        id: req.id,
      }
    }

    telemetry?.({
      type: 'CACHE_MISS',
      timestamp: new Date(),
      requestId: req.id,
      data: { kind: 'semantic' },
    })

    const response = await next(req)

    // Write back to semantic cache (don't await)
    cache.upsert(req, response).catch(() => {
      // Ignore cache write errors
    })

    return response
  }
}

/**
 * Cost tracking middleware
 */
export function costTrackingMiddleware(
  tracker: {
    add: (response: LLMResponse) => void
  },
  telemetry?: TelemetryHandler
): Middleware {
  return async (req, next) => {
    const response = await next(req)

    tracker.add(response)

    if (response.usage) {
      telemetry?.({
        type: 'COST_UPDATED',
        timestamp: new Date(),
        requestId: req.id,
        data: {
          inputTokens: response.usage.inputTokens,
          outputTokens: response.usage.outputTokens,
          model: response.model,
        },
      })
    }

    return response
  }
}

/**
 * Compression middleware
 */
export function compressionMiddleware(
  compress: (
    messages: Array<{ role: string; content: string }>
  ) => Promise<Array<{ role: string; content: string }>>,
  telemetry?: TelemetryHandler
): Middleware {
  return async (req, next) => {
    const originalMessages = req.messages
    const compressedMessages = await compress(originalMessages)

    const beforeTokens = originalMessages.reduce(
      (sum, m) => sum + m.content.length / 4,
      0
    )
    const afterTokens = compressedMessages.reduce(
      (sum, m) => sum + m.content.length / 4,
      0
    )

    telemetry?.({
      type: 'COMPRESSED',
      timestamp: new Date(),
      requestId: req.id,
      data: {
        beforeTokens: Math.round(beforeTokens),
        afterTokens: Math.round(afterTokens),
        strategy: 'middleware',
      },
    })

    return next({
      ...req,
      messages: compressedMessages as typeof req.messages,
    })
  }
}

/**
 * Retrieval middleware for RAG
 */
export function retrievalMiddleware(
  retriever: {
    search: (query: string) => Promise<Array<{ text: string; score: number }>>
  },
  injector: {
    inject: (
      messages: Array<{ role: string; content: string }>,
      chunks: Array<{ text: string; score: number }>
    ) => Array<{ role: string; content: string }>
  },
  options?: { k?: number; minScore?: number },
  telemetry?: TelemetryHandler
): Middleware {
  return async (req, next) => {
    // Get the last user message as query
    const lastUserMessage = [...req.messages]
      .reverse()
      .find((m) => m.role === 'user')
    if (!lastUserMessage) {
      return next(req)
    }

    const chunks = await retriever.search(lastUserMessage.content)
    const filteredChunks = chunks
      .filter((c) => !options?.minScore || c.score >= options.minScore)
      .slice(0, options?.k ?? 3)

    if (filteredChunks.length === 0) {
      return next(req)
    }

    telemetry?.({
      type: 'RETRIEVAL_PERFORMED',
      timestamp: new Date(),
      requestId: req.id,
      data: { k: filteredChunks.length, returned: filteredChunks.length },
    })

    const augmentedMessages = injector.inject(req.messages, filteredChunks)

    telemetry?.({
      type: 'CONTEXT_INJECTED',
      timestamp: new Date(),
      requestId: req.id,
      data: { chunksUsed: filteredChunks.length },
    })

    return next({
      ...req,
      messages: augmentedMessages as typeof req.messages,
    })
  }
}

/**
 * Model routing middleware
 */
export function routingMiddleware(
  rules: Array<
    (req: LLMRequest) => Partial<Pick<LLMRequest, 'provider' | 'model'>> | null
  >,
  defaultRoute: Pick<LLMRequest, 'provider' | 'model'>,
  telemetry?: TelemetryHandler
): Middleware {
  return async (req, next) => {
    const originalModel = req.model
    const originalProvider = req.provider

    // Try each rule in order
    for (const rule of rules) {
      const result = rule(req)
      if (result) {
        const routedReq: LLMRequest = {
          ...req,
          provider: result.provider ?? req.provider,
          model: result.model ?? req.model,
        }

        telemetry?.({
          type: 'ROUTED',
          timestamp: new Date(),
          requestId: req.id,
          data: {
            fromModel: originalModel,
            toModel: routedReq.model,
            fromProvider: originalProvider,
            toProvider: routedReq.provider,
          },
        })

        return next(routedReq)
      }
    }

    // Apply default route if no rules matched
    const routedReq: LLMRequest = {
      ...req,
      provider: defaultRoute.provider,
      model: defaultRoute.model,
    }

    if (
      routedReq.model !== originalModel ||
      routedReq.provider !== originalProvider
    ) {
      telemetry?.({
        type: 'ROUTED',
        timestamp: new Date(),
        requestId: req.id,
        data: {
          fromModel: originalModel,
          toModel: routedReq.model,
          fromProvider: originalProvider,
          toProvider: routedReq.provider,
          reason: 'default',
        },
      })
    }

    return next(routedReq)
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Composes multiple telemetry handlers into one
 */
export function composeTelemetry(
  ...handlers: TelemetryHandler[]
): TelemetryHandler {
  return (event: TelemetryEvent) => {
    handlers.forEach((handler) => {
      try {
        handler(event)
      } catch {
        // Ignore telemetry handler errors
      }
    })
  }
}

/**
 * Console logger telemetry handler
 */
export function consoleLogger(options?: {
  verbose?: boolean
}): TelemetryHandler {
  return (event: TelemetryEvent) => {
    const { type, timestamp, requestId, data } = event
    const prefix = `[ClarityTokens] ${timestamp.toISOString()}`

    if (options?.verbose) {
      console.log(`${prefix} [${type}] ${requestId ?? 'N/A'}`, data)
    } else {
      console.log(
        `${prefix} [${type}]`,
        requestId ? `req=${requestId.slice(0, 8)}` : ''
      )
    }
  }
}

/**
 * Creates a no-op telemetry handler (for testing)
 */
export function noopTelemetry(): TelemetryHandler {
  return () => {
    // No-op
  }
}
