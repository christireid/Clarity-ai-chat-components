/**
 * AI Component Testing Utilities
 *
 * Comprehensive test helpers for AI components and hooks.
 */

import { vi } from 'vitest'
import type { Message } from '@clarity-chat/types'
import type { CoreMessage } from '../hooks/chat/use-chat-enhanced'

/**
 * Create a mock streaming response
 */
export function createMockStreamingResponse(
  chunks: string[],
  delayMs = 10
): Response {
  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        const encoder = new TextEncoder()
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
      controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
    },
  })
}

/**
 * Create mock messages for testing
 */
export function createMockMessages(count = 3): Message[] {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => ({
    id: `msg-${i}`,
    chatId: 'test-chat',
    role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
    content: `Message ${i}`,
    status: 'sent' as const,
    createdAt: new Date(now.getTime() - (count - i) * 60000),
    updatedAt: new Date(now.getTime() - (count - i) * 60000),
  }))
}

/**
 * Create mock CoreMessage array
 */
export function createMockCoreMessages(count = 3): CoreMessage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `msg-${i}`,
    role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
    content: `Message ${i}`,
  }))
}

/**
 * Mock useClarityChat hook
 */
export function createMockUseClarityChat(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    messages: [],
    isLoading: false,
    error: null,
    input: '',
    setInput: vi.fn(),
    append: vi.fn(),
    reload: vi.fn(),
    stop: vi.fn(),
    setMessages: vi.fn(),
    ...overrides,
  }
}

/**
 * Mock useStreamingSSE hook
 */
export function createMockUseStreamingSSE(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    status: 'idle' as const,
    events: [],
    lastEvent: null,
    data: '',
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    reconnect: vi.fn(),
    reset: vi.fn(),
    reconnectAttempt: 0,
    isReconnecting: false,
    ...overrides,
  }
}

/**
 * Mock useTokenCounter hook
 */
export function createMockUseTokenCounter(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    tokenCount: 0,
    streamTokenCount: 0,
    count: vi.fn((text: string) => Math.ceil(text.length / 4)),
    countChat: vi.fn((messages: any[]) => messages.length * 10),
    isWithinLimit: vi.fn(() => true),
    resetStreamCount: vi.fn(),
    onStreamChunk: vi.fn(),
    ...overrides,
  }
}

/**
 * Wait for streaming to complete
 */
export async function waitForStreamingComplete(
  checkFn: () => boolean,
  timeout = 5000
): Promise<void> {
  const startTime = Date.now()
  while (!checkFn() && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  if (!checkFn()) {
    throw new Error('Streaming did not complete within timeout')
  }
}

/**
 * Simulate network delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Create mock fetch with rate limit error
 */
export function createRateLimitResponse(retryAfter = 60): Response {
  return new Response(
    JSON.stringify({
      error: {
        message: 'Rate limit exceeded',
        type: 'rate_limit_exceeded',
      },
    }),
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'Content-Type': 'application/json',
      },
    }
  )
}

/**
 * Create mock fetch with network error
 */
export function createNetworkErrorResponse(): Response {
  return new Response(null, {
    status: 0,
    statusText: 'Network Error',
  })
}

/**
 * Create mock fetch with server error
 */
export function createServerErrorResponse(): Response {
  return new Response(
    JSON.stringify({
      error: {
        message: 'Internal server error',
      },
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

/**
 * Assert chat state
 */
export function assertChatState(
  chat: any,
  expected: {
    messageCount?: number
    isLoading?: boolean
    hasError?: boolean
    errorMessage?: string
  }
): void {
  if (expected.messageCount !== undefined) {
    expect(chat.messages?.length || 0).toBe(expected.messageCount)
  }
  if (expected.isLoading !== undefined) {
    expect(chat.isLoading).toBe(expected.isLoading)
  }
  if (expected.hasError !== undefined) {
    expect(!!chat.error).toBe(expected.hasError)
  }
  if (expected.errorMessage !== undefined) {
    expect(chat.error?.message || '').toContain(expected.errorMessage)
  }
}

/**
 * Create mock AbortController
 */
export function createMockAbortController(): AbortController {
  const controller = new AbortController()
  return controller
}
