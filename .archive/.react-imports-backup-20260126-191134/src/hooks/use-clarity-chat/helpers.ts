/**
 * Internal helper functions for useClarityChat
 *
 * @module hooks/use-clarity-chat/helpers
 * @internal
 */

import * as React from 'react'
import { MemoryContext } from '../../memory/memory-provider'
import type { MemoryContextValue } from '../../memory/memory-provider'
import { classifyError as classifyErrorUtil } from '../../utils/resilience/error-handling'
import { devWarning, performanceWarning } from '../../internal/dev-warnings'
import { debug } from '../../internal/debug'
import { ComponentError } from '../../internal/component-errors'

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
 * @deprecated Import retry from @clarity-chat/utils/async instead
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
  const { retry } = await import('@clarity-chat/utils/async')
  return retry(operation, {
    retries: maxAttempts - 1, // retry() counts retries, not total attempts
    delay: delayMs,
    backoffFactor: 2,
  })
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

  // Return empty string for unknown content types (safer than JSON.stringify
  // which could expose raw objects in unexpected ways)
  return ''
}

/**
 * Validate API endpoint
 *
 * @internal
 * @param api - The API endpoint to validate
 * @throws {ComponentError} If the API endpoint is invalid
 */
export function validateApiEndpoint(
  api: string | undefined
): asserts api is string {
  if (!api || typeof api !== 'string' || api.trim().length === 0) {
  throw new ComponentError({
    code: 'MISSING_PROP',
    component: 'useClarityChat',
    message:
      '"api" option is required. Please provide your API endpoint URL.',
    expected: 'string (e.g., "/api/chat" or "https://api.example.com/chat")',
    example:
      'const chat = useClarityChat({ api: "/api/chat" })\n\n' +
      '// Or with full URL\n' +
      'const chat = useClarityChat({ api: "https://api.example.com/chat" })',
    docsPath: '/hooks/use-clarity-chat#api',
    suggestion: 'Quick fix: useClarityChat({ api: "/api/chat" }) - replace with your actual API endpoint',
  })
  }

  // Security Check: Detect if user accidentally passed an API key
  const isLikelyApiKey =
    api.startsWith('sk-') || // OpenAI, Anthropic (sk-ant)
    api.startsWith('AIza') || // Google
    api.startsWith('xox') || // Slack
    (api.length > 100 && !api.includes('/')) // Long string without slashes

  if (isLikelyApiKey) {
    throw new ComponentError({
      code: 'SECURITY_RISK',
      component: 'useClarityChat',
      message:
        'Security Alert: It looks like you passed an API Key as the "api" endpoint.',
      expected: 'A URL path (e.g., "/api/chat")',
      example: 'Do NOT pass keys to the client. Use a server-side API route.',
      docsPath: '/security/client-side-keys',
    })
  }

  // Log successful initialization in debug mode
  debug.hook('useClarityChat', 'Initialized with API endpoint', { api })
}

/**
 * Warn if memory is enabled but MemoryProvider is not present
 *
 * @internal
 * @param memoryEnabled - Whether memory is configured in options
 * @param memoryContext - The memory context from useContext
 */
export function warnIfMemoryMisconfigured(
  memoryEnabled: boolean | undefined,
  memoryContext: MemoryContextValue | null
): void {
  devWarning(
    memoryEnabled === true && !memoryContext?.service,
    'useClarityChat',
    'Memory is enabled in options but MemoryProvider is not found in the component tree. ' +
      'Memory features will be disabled.\n\n' +
      'To fix this, wrap your app with MemoryProvider:\n' +
      '<MemoryProvider>\n  <App />\n</MemoryProvider>\n\n' +
      'Docs: https://clarity-chat.dev/memory/getting-started'
  )
}

/**
 * Warn about potential performance issues with message count
 *
 * @internal
 * @param messageCount - Number of messages
 * @param hasOptimization - Whether prompt optimization is enabled
 */
export function warnIfTooManyMessages(
  messageCount: number,
  hasOptimization: boolean
): void {
  if (messageCount > 50 && !hasOptimization) {
    performanceWarning(
      'useClarityChat',
      `${messageCount} messages in conversation without prompt optimization`,
      'Enable promptOptimization to prevent context window overflow:\n' +
        'useClarityChat({ promptOptimization: { enabled: true } })'
    )
  }
}
