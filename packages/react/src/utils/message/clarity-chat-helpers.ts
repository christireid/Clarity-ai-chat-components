/**
 * Clarity Chat Helper Utilities
 *
 * Common utilities and helpers for working with Clarity Chat.
 * These make common patterns easier and reduce boilerplate.
 *
 * Note: For message creation helpers, use the ones from './chat-helpers'
 * which provide more options (like custom IDs).
 */

import type { UseClarityChatOptions } from '../../hooks/chat/use-clarity-chat'

/**
 * Create a basic chat configuration with sensible defaults
 */
export function createBasicChatConfig(api: string): UseClarityChatOptions {
  return {
    api,
    // Sensible defaults
    streamProtocol: 'sse',
  }
}

/**
 * Create a chat configuration with memory enabled
 */
export function createMemoryChatConfig(
  api: string,
  strategy:
    | 'sliding-window'
    | 'semantic-chunks'
    | 'vector-store' = 'sliding-window',
  maxTokens: number = 4000
): UseClarityChatOptions {
  return {
    api,
    memory: {
      enabled: true,
      strategy,
      maxTokens,
    },
  }
}

/**
 * Create a chat configuration optimized for streaming
 */
export function createStreamingChatConfig(
  api: string,
  useWebSocket: boolean = false
): UseClarityChatOptions {
  return {
    api,
    transport: useWebSocket ? 'websocket' : 'sse',
  }
}

/**
 * Create an enterprise chat configuration with all features
 */
export function createEnterpriseChatConfig(api: string): UseClarityChatOptions {
  return {
    api,
    memory: {
      enabled: true,
      strategy: 'vector-store',
      maxTokens: 10000,
    },
    promptOptimization: {
      enabled: true,
      strategy: 'hybrid',
    },
    transport: 'sse',
  }
}

/**
 * Check if API endpoint is valid
 */
export function isValidApiEndpoint(api: string | undefined): api is string {
  if (!api) return false
  if (typeof api !== 'string') return false
  if (api.trim().length === 0) return false
  return true
}

/**
 * Get default API endpoint from environment or throw helpful error
 */
export function getApiEndpoint(
  api?: string,
  envVar: string = 'CLARITY_CHAT_API'
): string {
  if (api && isValidApiEndpoint(api)) {
    return api
  }

  const envApi = typeof process !== 'undefined' && process.env?.[envVar]
  if (envApi && isValidApiEndpoint(envApi)) {
    return envApi
  }

  throw new Error(
    `Clarity Chat: API endpoint is required. ` +
      `Provide it via the "api" prop or set the ${envVar} environment variable. ` +
      `Example: <ClarityChat api="/api/chat" />`
  )
}
