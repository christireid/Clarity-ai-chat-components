/**
 * Internal helper functions for useClarityChat
 *
 * @module hooks/use-clarity-chat/helpers
 * @internal
 */

import * as React from 'react'
import { MemoryContext } from '../../memory/memory-provider'
import type { MemoryContextValue } from '../../memory/memory-provider'
import { classifyError as classifyErrorUtil } from '../../utils/error-handling'

/**
 * Safe hook to get memory context without throwing
 * Returns null if MemoryProvider is not available
 * This satisfies React hooks rules by always calling useContext unconditionally
 *
 * @internal
 */
export function useMemorySafe(): MemoryContextValue | null {
  return React.useContext(MemoryContext)
}

/**
 * Error type classification
 */
export type ErrorType =
  | 'network'
  | 'ratelimit'
  | 'server'
  | 'auth'
  | 'memory'
  | 'unknown'

/**
 * Classify error type for better error handling
 *
 * @internal
 * @deprecated Use classifyError from utils/error-handling instead
 */
export function classifyError(error: Error): ErrorType {
  return classifyErrorUtil(error) as ErrorType
}

/**
 * Retry an async operation with exponential backoff
 *
 * @internal
 * @param operation - The async operation to retry
 * @param maxAttempts - Maximum number of retry attempts (default: 2)
 * @param delayMs - Base delay in milliseconds (default: 1000)
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 2,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      // Don't retry on last attempt
      if (attempt < maxAttempts) {
        // Exponential backoff: delayMs * 2^(attempt-1)
        const delay = delayMs * Math.pow(2, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Operation failed after retries')
}

/**
 * Extract text content from a message
 *
 * @internal
 * @param content - The message content (string, array, or object)
 */
export function extractTextContent(
  content: string | Array<{ type: string; text?: string }> | unknown
): string {
  if (typeof content === 'string') {
    return content
  }

  if (Array.isArray(content)) {
    return content
      .filter((part) => part.type === 'text')
      .map((part) => (part as { type: 'text'; text: string }).text)
      .join(' ')
  }

  return JSON.stringify(content)
}

/**
 * Validate API endpoint
 *
 * @internal
 * @param api - The API endpoint to validate
 * @throws {Error} If the API endpoint is invalid
 */
export function validateApiEndpoint(
  api: string | undefined
): asserts api is string {
  if (!api || typeof api !== 'string' || api.trim().length === 0) {
    throw new Error(
      'useClarityChat: "api" option is required.\n' +
        'Please provide your API endpoint URL.\n\n' +
        'Example:\n' +
        '  const chat = useClarityChat({ api: "/api/chat" })\n\n' +
        'For more help, see: https://clarity-chat.dev/docs/getting-started'
    )
  }
}
