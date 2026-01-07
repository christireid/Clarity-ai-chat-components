/**
 * Anthropic Provider Adapter
 *
 * Converts generic LLMRequest into Anthropic API format and handles responses.
 * IMPORTANT: Do not include API keys in browser code. Use a secure proxy endpoint.
 */

import type { LLMRequest, LLMResponse, TokenUsage } from '../pipeline/types'

// =============================================================================
// Types
// =============================================================================

export interface AnthropicAdapterConfig {
  /** API endpoint (proxy URL recommended for browser) */
  endpoint: string
  /** Custom headers (e.g., for proxy authentication) */
  headers?: Record<string, string>
  /** Enable streaming */
  stream?: boolean
  /** Request timeout in ms */
  timeoutMs?: number
  /** Anthropic API version */
  apiVersion?: string
  /** Retry configuration */
  retry?: {
    maxRetries: number
    initialDelayMs: number
    maxDelayMs: number
  }
}

interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AnthropicMessageRequest {
  model: string
  messages: AnthropicMessage[]
  system?: string
  max_tokens: number
  temperature?: number
  stream?: boolean
  metadata?: {
    user_id?: string
  }
}

interface AnthropicMessageResponse {
  id: string
  type: string
  role: string
  content: Array<{
    type: string
    text: string
  }>
  model: string
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

// =============================================================================
// Adapter Implementation
// =============================================================================

/**
 * Create an Anthropic provider adapter
 *
 * @example
 * ```tsx
 * // Use with a secure proxy endpoint (recommended)
 * const adapter = createAnthropicAdapter({
 *   endpoint: '/api/llm/anthropic',
 *   stream: true
 * })
 *
 * const response = await adapter(request)
 * ```
 */
export function createAnthropicAdapter(
  config: AnthropicAdapterConfig
): (req: LLMRequest) => Promise<LLMResponse> {
  const {
    endpoint,
    headers = {},
    stream = false,
    timeoutMs = 60000,
    apiVersion = '2023-06-01',
    retry = { maxRetries: 2, initialDelayMs: 1000, maxDelayMs: 10000 },
  } = config

  return async (req: LLMRequest): Promise<LLMResponse> => {
    const startTime = Date.now()

    // Extract system message and convert to Anthropic format
    const systemMessage = req.messages.find((m) => m.role === 'system')
    const conversationMessages = req.messages
      .filter((m) => m.role !== 'system')
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })) as AnthropicMessage[]

    // Anthropic requires alternating user/assistant messages
    const normalizedMessages = normalizeMessages(conversationMessages)

    const anthropicRequest: AnthropicMessageRequest = {
      model: req.model,
      messages: normalizedMessages,
      system: systemMessage?.content,
      max_tokens: req.maxOutputTokens ?? 4096,
      temperature: req.temperature,
      stream,
      metadata: req.metadata?.userId
        ? { user_id: req.metadata.userId as string }
        : undefined,
    }

    // Build headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'anthropic-version': apiVersion,
      ...headers,
    }

    // Retry logic
    let lastError: Error | null = null
    let delay = retry.initialDelayMs

    for (let attempt = 0; attempt <= retry.maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

        try {
          if (stream) {
            return await handleStreamingResponse(
              endpoint,
              anthropicRequest,
              requestHeaders,
              controller,
              req,
              startTime
            )
          } else {
            return await handleNonStreamingResponse(
              endpoint,
              anthropicRequest,
              requestHeaders,
              controller,
              req,
              startTime
            )
          }
        } finally {
          clearTimeout(timeoutId)
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on client errors (4xx)
        if (lastError.message.includes('status 4')) {
          throw lastError
        }

        // Don't retry on abort
        if (lastError.name === 'AbortError') {
          throw new Error(`Anthropic request timed out after ${timeoutMs}ms`)
        }

        // Retry with exponential backoff
        if (attempt < retry.maxRetries) {
          await sleep(delay)
          delay = Math.min(delay * 2, retry.maxDelayMs)
        }
      }
    }

    throw lastError ?? new Error('Anthropic request failed')
  }
}

// =============================================================================
// Message Normalization
// =============================================================================

/**
 * Anthropic requires alternating user/assistant messages starting with user.
 * This function normalizes the message array to meet that requirement.
 */
function normalizeMessages(messages: AnthropicMessage[]): AnthropicMessage[] {
  if (messages.length === 0) {
    return [{ role: 'user', content: 'Hello' }]
  }

  const normalized: AnthropicMessage[] = []

  for (const msg of messages) {
    const lastRole = normalized[normalized.length - 1]?.role

    // If same role as last, merge content
    if (lastRole === msg.role) {
      normalized[normalized.length - 1].content += '\n\n' + msg.content
    } else {
      normalized.push({ ...msg })
    }
  }

  // Ensure first message is from user
  if (normalized[0]?.role !== 'user') {
    normalized.unshift({ role: 'user', content: '[Starting conversation]' })
  }

  return normalized
}

// =============================================================================
// Response Handlers
// =============================================================================

async function handleNonStreamingResponse(
  endpoint: string,
  request: AnthropicMessageRequest,
  headers: Record<string, string>,
  controller: AbortController,
  originalReq: LLMRequest,
  startTime: number
): Promise<LLMResponse> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
    signal: controller.signal,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(
      `Anthropic API error (status ${response.status}): ${errorText}`
    )
  }

  const data: AnthropicMessageResponse = await response.json()

  const usage: TokenUsage = {
    inputTokens: data.usage.input_tokens,
    outputTokens: data.usage.output_tokens,
    totalTokens: data.usage.input_tokens + data.usage.output_tokens,
  }

  // Extract text from content blocks
  const text = data.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')

  return {
    id: originalReq.id,
    provider: 'anthropic',
    model: data.model,
    text,
    usage,
    latencyMs: Date.now() - startTime,
    receivedAt: new Date(),
    metadata: {
      stopReason: data.stop_reason,
      anthropicId: data.id,
    },
  }
}

async function handleStreamingResponse(
  endpoint: string,
  request: AnthropicMessageRequest,
  headers: Record<string, string>,
  controller: AbortController,
  originalReq: LLMRequest,
  startTime: number
): Promise<LLMResponse> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
    signal: controller.signal,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(
      `Anthropic API error (status ${response.status}): ${errorText}`
    )
  }

  if (!response.body) {
    throw new Error('No response body for streaming request')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  let model = request.model
  let stopReason = ''
  let inputTokens = 0
  let outputTokens = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter((line) => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)

          try {
            const parsed = JSON.parse(data)

            switch (parsed.type) {
              case 'message_start':
                if (parsed.message?.model) {
                  model = parsed.message.model
                }
                if (parsed.message?.usage?.input_tokens) {
                  inputTokens = parsed.message.usage.input_tokens
                }
                break

              case 'content_block_delta':
                if (parsed.delta?.text) {
                  fullText += parsed.delta.text
                }
                break

              case 'message_delta':
                if (parsed.delta?.stop_reason) {
                  stopReason = parsed.delta.stop_reason
                }
                if (parsed.usage?.output_tokens) {
                  outputTokens = parsed.usage.output_tokens
                }
                break
            }
          } catch {
            // Ignore parse errors for SSE chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  // Estimate tokens if not provided
  if (outputTokens === 0) {
    outputTokens = Math.ceil(fullText.length / 4)
  }
  if (inputTokens === 0) {
    inputTokens = Math.ceil(
      request.messages.reduce((sum, m) => sum + m.content.length, 0) / 4
    )
  }

  return {
    id: originalReq.id,
    provider: 'anthropic',
    model,
    text: fullText,
    usage: {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
    },
    latencyMs: Date.now() - startTime,
    receivedAt: new Date(),
    metadata: {
      stopReason,
      streamed: true,
    },
  }
}

// =============================================================================
// Utilities
// =============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
