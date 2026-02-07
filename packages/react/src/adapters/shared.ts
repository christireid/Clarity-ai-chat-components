/**
 * Shared Adapter Utilities
 *
 * Common utilities used across all AI model adapters.
 * Centralizes duplicate code and enforces security best practices.
 *
 * NOTE: For SSE parsing, use the canonical implementation in
 * `utils/streaming/streaming-helpers.ts` which provides multi-format
 * support, retry logic, and full SSE event framing.
 *
 * @module adapters/shared
 */

import type { ChatMessage, ToolCall } from './types'
import { APIKeyMissingError } from '@clarity-chat/utils/errors'

// Re-export for backwards compatibility and convenience
export { APIKeyMissingError }

/**
 * Validates that an API key is provided.
 * SECURITY: Removed process.env fallbacks to prevent key exposure in frontend bundles.
 *
 * @param apiKey - The API key to validate
 * @param provider - The provider name for error messages
 * @returns The validated API key
 * @throws {APIKeyMissingError} If API key is not provided (provides helpful solutions)
 */
export function validateApiKey(
  apiKey: string | undefined,
  provider: 'openai' | 'anthropic' | 'google' | string
): string {
  if (!apiKey || apiKey.trim() === '') {
    throw new APIKeyMissingError(provider)
  }
  return apiKey
}

/**
 * Extract system message from chat messages
 */
export function extractSystemMessage(
  messages: ChatMessage[]
): ChatMessage | undefined {
  return messages.find((m) => m.role === 'system')
}

/**
 * Filter out system messages from chat messages
 */
export function filterConversationMessages(
  messages: ChatMessage[]
): ChatMessage[] {
  return messages.filter((m) => m.role !== 'system')
}

/**
 * OpenAI tool call structure from API response
 */
export interface OpenAIToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

/**
 * Convert OpenAI tool calls to our unified format
 */
export function convertOpenAIToolCalls(
  toolCalls: OpenAIToolCall[] | undefined
): ToolCall[] | undefined {
  if (!toolCalls) return undefined
  return toolCalls.map((tc) => ({
    id: tc.id,
    type: 'function' as const,
    function: {
      name: tc.function.name,
      arguments: tc.function.arguments,
    },
  }))
}

/**
 * Create an error with rate limit info attached
 */
export function createRateLimitError<T extends Record<string, unknown>>(
  message: string,
  rateLimitInfo: T | null
): Error & { rateLimitInfo?: T } {
  const err = new Error(message) as Error & { rateLimitInfo?: T }
  if (rateLimitInfo) {
    err.rateLimitInfo = rateLimitInfo
  }
  return err
}

/**
 * Default timeouts for different operation types
 */
export const DEFAULT_TIMEOUTS = {
  chat: 30000, // 30 seconds for non-streaming
  stream: 60000, // 60 seconds for streaming
} as const
