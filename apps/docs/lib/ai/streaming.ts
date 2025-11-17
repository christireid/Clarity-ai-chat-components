/**
 * Streaming Utilities
 *
 * Handles streaming responses from LLMs using Server-Sent Events (SSE).
 * Supports both OpenAI and Anthropic streaming APIs.
 */

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export interface StreamChunk {
  type: 'text' | 'error' | 'done' | 'sources' | 'thinking'
  content?: string
  data?: unknown
}

/**
 * Create a ReadableStream for Server-Sent Events
 */
export function createSSEStream(
  generator: AsyncGenerator<StreamChunk>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          const data = `data: ${JSON.stringify(chunk)}\n\n`
          controller.enqueue(encoder.encode(data))
        }

        // Send done signal
        const doneChunk = `data: ${JSON.stringify({ type: 'done' })}\n\n`
        controller.enqueue(encoder.encode(doneChunk))

        controller.close()
      } catch (error) {
        console.error('Streaming error:', error)

        const errorChunk = `data: ${JSON.stringify({
          type: 'error',
          content: error instanceof Error ? error.message : 'Unknown error',
        })}\n\n`

        controller.enqueue(encoder.encode(errorChunk))
        controller.close()
      }
    },
  })
}

/**
 * Stream from OpenAI API
 */
export async function* streamFromOpenAI(
  messages: { role: string; content: string }[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): AsyncGenerator<StreamChunk> {
  const {
    model = 'gpt-4-turbo-preview',
    temperature = 0.7,
    maxTokens = 2000,
  } = options

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  const openai = new OpenAI({ apiKey })

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content

      if (content) {
        yield {
          type: 'text',
          content,
        }
      }

      // Check for finish reason
      const finishReason = chunk.choices[0]?.finish_reason
      if (finishReason === 'length') {
        yield {
          type: 'text',
          content: '\n\n[Response truncated due to length]',
        }
      }
    }
  } catch (error) {
    console.error('OpenAI streaming error:', error)
    throw error
  }
}

/**
 * Stream from Anthropic Claude API
 */
export async function* streamFromClaude(
  messages: { role: string; content: string }[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): AsyncGenerator<StreamChunk> {
  const {
    model = 'claude-3-5-sonnet-20241022',
    temperature = 0.7,
    maxTokens = 2000,
  } = options

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const anthropic = new Anthropic({ apiKey })

  try {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === 'system')?.content
    const conversationMessages = messages.filter((m) => m.role !== 'system')

    const stream = await anthropic.messages.stream({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemMessage,
      messages: conversationMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })) as Anthropic.MessageParam[],
    })

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield {
          type: 'text',
          content: chunk.delta.text,
        }
      }
    }
  } catch (error) {
    console.error('Claude streaming error:', error)
    throw error
  }
}

/**
 * Get the appropriate streaming function based on configured model
 */
export function getStreamingFunction(): typeof streamFromOpenAI | typeof streamFromClaude {
  const model = process.env.AI_MODEL || 'gpt-4-turbo-preview'

  if (model.startsWith('claude')) {
    return streamFromClaude
  }

  return streamFromOpenAI
}

/**
 * Rate limiting for API requests
 */
interface RateLimitStore {
  requests: number[]
  lastReset: number
}

const rateLimitStore = new Map<string, RateLimitStore>()

export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  let store = rateLimitStore.get(identifier)

  // Initialize or reset if window expired
  if (!store || now - store.lastReset > windowMs) {
    store = {
      requests: [],
      lastReset: now,
    }
    rateLimitStore.set(identifier, store)
  }

  // Remove old requests outside the window
  store.requests = store.requests.filter((time) => now - time < windowMs)

  // Check if limit exceeded
  const allowed = store.requests.length < maxRequests

  if (allowed) {
    store.requests.push(now)
  }

  return {
    allowed,
    remaining: Math.max(0, maxRequests - store.requests.length),
    resetAt: store.lastReset + windowMs,
  }
}

/**
 * Token counter for rate limiting
 */
export function estimateMessageTokens(
  messages: { role: string; content: string }[]
): number {
  const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0)
  return Math.ceil(totalChars / 4) // Rough estimate: 4 chars per token
}

/**
 * Validate request size
 */
export function validateRequest(
  messages: { role: string; content: string }[],
  maxTokens = 10000
): { valid: boolean; error?: string } {
  if (messages.length === 0) {
    return { valid: false, error: 'No messages provided' }
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage.role !== 'user') {
    return { valid: false, error: 'Last message must be from user' }
  }

  const estimatedTokens = estimateMessageTokens(messages)
  if (estimatedTokens > maxTokens) {
    return {
      valid: false,
      error: `Request too large: ${estimatedTokens} tokens (max: ${maxTokens})`,
    }
  }

  return { valid: true }
}

/**
 * Error handler for streaming errors
 */
export function handleStreamError(error: unknown): StreamChunk {
  console.error('Stream error:', error)

  let errorMessage = 'An unexpected error occurred'

  if (error instanceof Error) {
    // OpenAI errors
    if ('status' in error && error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.'
    } else if ('status' in error && error.status === 401) {
      errorMessage = 'Authentication failed. Please check API credentials.'
    } else {
      errorMessage = error.message
    }
  }

  return {
    type: 'error',
    content: errorMessage,
  }
}

/**
 * Retry logic for failed requests
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      console.warn(`Attempt ${attempt + 1} failed:`, error)

      if (attempt < maxRetries - 1) {
        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * Format response with metadata
 */
export interface FormattedResponse {
  content: string
  metadata: {
    model: string
    tokensUsed?: number
    sources?: Array<{ title: string; url: string }>
    timestamp: string
  }
}

export function formatResponse(
  content: string,
  sources?: Array<{ title: string; url: string }>
): FormattedResponse {
  return {
    content,
    metadata: {
      model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
      sources,
      timestamp: new Date().toISOString(),
    },
  }
}
