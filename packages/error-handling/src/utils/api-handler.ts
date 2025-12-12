/**
 * Centralized API error handling utilities for Next.js 15 App Router
 *
 * These utilities wrap API route handlers with consistent error handling,
 * logging, and response formatting.
 */

import { isClarityError } from '../errors/base-error'
import type { ClarityError } from '../errors/base-error'
import { ApiError, ApiErrorCode } from '../errors/api-error'

/**
 * Standard API response shape
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

/**
 * API handler context with typed params
 */
export interface ApiHandlerContext {
  params: Promise<Record<string, string>>
}

/**
 * Type for Next.js request (simplified for compatibility)
 */
interface NextRequest {
  url: string
  method: string
  json: () => Promise<unknown>
  headers: Headers
}

/**
 * Type for API handler functions
 */
export type ApiHandler = (
  request: NextRequest,
  context: ApiHandlerContext
) => Promise<Response>

/**
 * Create a successful API response
 *
 * @example
 * ```typescript
 * return successResponse({ user: { id: '123', name: 'John' } })
 * // Returns: { success: true, data: { user: { id: '123', name: 'John' } } }
 * ```
 */
export function successResponse<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data } as ApiResponse<T>, { status })
}

/**
 * Create an error API response
 *
 * @example
 * ```typescript
 * return errorResponse(new ApiError('Not found', { code: ApiErrorCode.NOT_FOUND, statusCode: 404 }))
 * // Returns: { success: false, error: { code: 'API_NOT_FOUND', message: '...' } }
 * ```
 */
export function errorResponse(
  error: ClarityError | Error,
  status?: number
): Response {
  const isKnownError = isClarityError(error)

  const response: ApiResponse<never> = {
    success: false,
    error: {
      code: isKnownError ? error.code : 'UNKNOWN_ERROR',
      message: isKnownError
        ? error.userMessage
        : 'An unexpected error occurred',
      ...(process.env['NODE_ENV'] === 'development' && {
        details: isKnownError ? error.toJSON() : { stack: error.stack },
      }),
    },
  }

  return Response.json(response, {
    status: status ?? (isKnownError ? error.statusCode : 500),
  })
}

/**
 * Wrap API route handlers with centralized error handling
 *
 * @example
 * ```typescript
 * // app/api/chat/route.ts
 * import { apiHandler, successResponse } from '@clarity-chat/error-handling'
 *
 * export const POST = apiHandler(async (request) => {
 *   const body = await request.json()
 *   const result = await processChat(body)
 *   return successResponse(result)
 * })
 * ```
 */
export function apiHandler(
  handler: (
    request: NextRequest,
    context: ApiHandlerContext
  ) => Promise<Response>
): (request: NextRequest, context: ApiHandlerContext) => Promise<Response> {
  return async (request, context) => {
    try {
      return await handler(request, context)
    } catch (error) {
      // Log error
      console.error('[API Error]', {
        url: request.url,
        method: request.method,
        error: isClarityError(error) ? error.toJSON() : error,
      })

      // Return appropriate error response
      if (isClarityError(error)) {
        return errorResponse(error)
      }

      if (error instanceof Error) {
        // Check for known error patterns
        const message = error.message.toLowerCase()

        if (message.includes('rate limit')) {
          return errorResponse(
            new ApiError('Rate limit exceeded', {
              code: ApiErrorCode.RATE_LIMITED,
              statusCode: 429,
              cause: error,
            })
          )
        }

        if (
          message.includes('unauthorized') ||
          message.includes('unauthenticated')
        ) {
          return errorResponse(
            new ApiError('Unauthorized', {
              code: ApiErrorCode.UNAUTHORIZED,
              statusCode: 401,
              cause: error,
            })
          )
        }

        if (message.includes('not found')) {
          return errorResponse(
            new ApiError('Not found', {
              code: ApiErrorCode.NOT_FOUND,
              statusCode: 404,
              cause: error,
            })
          )
        }

        return errorResponse(error)
      }

      return errorResponse(new Error('Unknown error'))
    }
  }
}

/**
 * Wrap streaming API handlers with error handling
 * For SSE endpoints that need to handle errors during streaming
 *
 * @example
 * ```typescript
 * // app/api/chat/stream/route.ts
 * import { streamingApiHandler } from '@clarity-chat/error-handling'
 *
 * export const POST = streamingApiHandler(async (request) => {
 *   const body = await request.json()
 *   const stream = await createChatStream(body)
 *   return new Response(stream, {
 *     headers: {
 *       'Content-Type': 'text/event-stream',
 *       'Cache-Control': 'no-cache',
 *       'Connection': 'keep-alive',
 *     },
 *   })
 * })
 * ```
 */
export function streamingApiHandler(
  handler: (request: NextRequest) => Promise<Response>
): (request: NextRequest) => Promise<Response> {
  return async (request) => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('[Streaming API Error]', error)

      // For streaming, we return an error in SSE format
      const encoder = new TextEncoder()
      const errorData = isClarityError(error)
        ? error.toJSON()
        : {
            message:
              error instanceof Error ? error.message : 'An error occurred',
          }

      const stream = new ReadableStream({
        start(controller) {
          // Send error event
          controller.enqueue(
            encoder.encode(
              `event: error\ndata: ${JSON.stringify({ type: 'error', error: errorData })}\n\n`
            )
          )
          // Send done event
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      return new Response(stream, {
        status: isClarityError(error) ? error.statusCode : 500,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }
  }
}

/**
 * Create an SSE error stream
 * Useful for sending errors during an active stream
 *
 * @example
 * ```typescript
 * const stream = new TransformStream()
 * const writer = stream.writable.getWriter()
 *
 * try {
 *   // ... streaming logic
 * } catch (error) {
 *   await writeErrorToStream(writer, error)
 * }
 * ```
 */
export async function writeErrorToStream(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  error: unknown
): Promise<void> {
  const encoder = new TextEncoder()
  const errorData = isClarityError(error)
    ? error.toJSON()
    : { message: error instanceof Error ? error.message : 'An error occurred' }

  await writer.write(
    encoder.encode(
      `event: error\ndata: ${JSON.stringify({ type: 'error', error: errorData })}\n\n`
    )
  )
  await writer.write(encoder.encode('data: [DONE]\n\n'))
  await writer.close()
}

/**
 * Maximum depth for JSON sanitization to prevent deeply nested attacks
 */
const MAX_JSON_DEPTH = 10

/**
 * Maximum string length for individual fields
 */
const MAX_STRING_LENGTH = 10000

/**
 * Sanitize a value to prevent XSS and limit depth/size
 */
function sanitizeValue(value: unknown, depth: number = 0): unknown {
  // Depth protection
  if (depth > MAX_JSON_DEPTH) {
    return '[max depth exceeded]'
  }

  // Handle different types
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value === 'string') {
    // Truncate very long strings
    const truncated =
      value.length > MAX_STRING_LENGTH
        ? value.slice(0, MAX_STRING_LENGTH) + '...[truncated]'
        : value
    // Basic XSS prevention - escape HTML entities
    return truncated
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (Array.isArray(value)) {
    // Limit array length
    const maxArrayLength = 100
    const sanitizedArray = value
      .slice(0, maxArrayLength)
      .map((item) => sanitizeValue(item, depth + 1))
    if (value.length > maxArrayLength) {
      sanitizedArray.push(`...[${value.length - maxArrayLength} more items]`)
    }
    return sanitizedArray
  }

  if (typeof value === 'object') {
    const sanitizedObj: Record<string, unknown> = {}
    const keys = Object.keys(value as Record<string, unknown>)
    // Limit number of keys
    const maxKeys = 50
    const keysToProcess = keys.slice(0, maxKeys)

    for (const key of keysToProcess) {
      // Sanitize key names too
      const sanitizedKey = key.slice(0, 100)
      sanitizedObj[sanitizedKey] = sanitizeValue(
        (value as Record<string, unknown>)[key],
        depth + 1
      )
    }

    if (keys.length > maxKeys) {
      sanitizedObj['__truncated__'] = `${keys.length - maxKeys} more keys`
    }

    return sanitizedObj
  }

  // For functions or symbols, return a placeholder
  return '[unsupported type]'
}

/**
 * Parse SSE error from stream with sanitization
 * Useful for client-side error handling of SSE streams
 *
 * @example
 * ```typescript
 * eventSource.addEventListener('error', (event) => {
 *   const error = parseSSEError(event.data)
 *   if (error) {
 *     handleError(error)
 *   }
 * })
 * ```
 */
export function parseSSEError(data: string): {
  type: string
  error: { code?: string; message: string; details?: unknown }
} | null {
  // Input validation
  if (typeof data !== 'string' || data.length === 0) {
    return null
  }

  // Limit input size to prevent DoS
  const maxInputSize = 1024 * 1024 // 1MB
  if (data.length > maxInputSize) {
    console.warn('[parseSSEError] Input exceeds maximum size, truncating')
    data = data.slice(0, maxInputSize)
  }

  try {
    const parsed = JSON.parse(data)

    // Validate basic structure
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      parsed.type !== 'error' ||
      !parsed.error
    ) {
      return null
    }

    // Sanitize the parsed content
    const sanitized = sanitizeValue(parsed) as {
      type: string
      error: { code?: string; message?: string; details?: unknown }
    }

    // Ensure required fields exist
    if (!sanitized.error || typeof sanitized.error !== 'object') {
      return null
    }

    // Provide default message if missing
    if (typeof sanitized.error.message !== 'string') {
      sanitized.error.message = 'Unknown error'
    }

    return sanitized as {
      type: string
      error: { code?: string; message: string; details?: unknown }
    }
  } catch {
    return null
  }
}
