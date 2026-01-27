/**
 * OpenAI Provider Adapter
 *
 * Converts generic LLMRequest into OpenAI API format and handles responses.
 * IMPORTANT: Do not include API keys in browser code. Use a secure proxy endpoint.
 */

import type { LLMRequest, LLMResponse, TokenUsage } from '../pipeline/types'

// =============================================================================
// Types
// =============================================================================

export interface OpenAIAdapterConfig {
  /** API endpoint (proxy URL recommended for browser) */
  endpoint: string
  /** Custom headers (e.g., for proxy authentication) */
  headers?: Record<string, string>
  /** Enable streaming */
  stream?: boolean
  /** Request timeout in ms */
  timeoutMs?: number
  /** Organization ID */
  organization?: string
  /** Retry configuration */
  retry?: {
    maxRetries: number
    initialDelayMs: number
    maxDelayMs: number
  }
}

interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool'
  content: string
  name?: string
  tool_call_id?: string
}

interface OpenAIChatCompletionRequest {
  model: string
  messages: OpenAIChatMessage[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
  user?: string
}

interface OpenAIChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// =============================================================================
// Adapter Implementation
// =============================================================================

/**
 * Create an OpenAI provider adapter
 *
 * @example
 * ```tsx
 * // Use with a secure proxy endpoint (recommended)
 * const adapter = createOpenAIAdapter({
 *   endpoint: '/api/llm/openai',
 *   stream: true
 * })
 *
 * const response = await adapter(request)
 * ```
 */
export function createOpenAIAdapter(
  config: OpenAIAdapterConfig
): (req: LLMRequest) => Promise<LLMResponse> {
  const {
    endpoint,
    headers = {},
    stream = false,
    timeoutMs = 60000,
    organization,
    retry = { maxRetries: 2, initialDelayMs: 1000, maxDelayMs: 10000 },
  } = config

  return async (req: LLMRequest): Promise<LLMResponse> => {
    const startTime = Date.now()

    // Convert to OpenAI format
    const openaiRequest: OpenAIChatCompletionRequest = {
      model: req.model,
      messages: req.messages.map((msg) => ({
        role: msg.role as OpenAIChatMessage['role'],
        content: msg.content,
        name: msg.name,
        tool_call_id: msg.toolCallId,
      })),
      temperature: req.temperature,
      max_tokens: req.maxOutputTokens,
      stream,
      user: req.metadata?.userId as string | undefined,
    }

    // Build headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    }

    if (organization) {
      requestHeaders['OpenAI-Organization'] = organization
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
              openaiRequest,
              requestHeaders,
              controller,
              req,
              startTime
            )
          } else {
            return await handleNonStreamingResponse(
              endpoint,
              openaiRequest,
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
          throw new Error(`OpenAI request timed out after ${timeoutMs}ms`)
        }

        // Retry with exponential backoff
        if (attempt < retry.maxRetries) {
          await sleep(delay)
          delay = Math.min(delay * 2, retry.maxDelayMs)
        }
      }
    }

    throw lastError ?? new Error('OpenAI request failed')
  }
}

// =============================================================================
// Response Handlers
// =============================================================================

async function handleNonStreamingResponse(
  endpoint: string,
  request: OpenAIChatCompletionRequest,
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
      `OpenAI API error (status ${response.status}): ${errorText}`
    )
  }

  const data: OpenAIChatCompletionResponse = await response.json()

  const usage: TokenUsage | undefined = data.usage
    ? {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      }
    : undefined

  return {
    id: originalReq.id,
    provider: 'openai',
    model: data.model,
    text: data.choices[0]?.message?.content ?? '',
    usage,
    latencyMs: Date.now() - startTime,
    receivedAt: new Date(),
    metadata: {
      finishReason: data.choices[0]?.finish_reason,
      openaiId: data.id,
    },
  }
}

async function handleStreamingResponse(
  endpoint: string,
  request: OpenAIChatCompletionRequest,
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
      `OpenAI API error (status ${response.status}): ${errorText}`
    )
  }

  if (!response.body) {
    throw new Error('No response body for streaming request')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  let model = request.model
  let finishReason = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter((line) => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              fullText += delta
            }
            if (parsed.model) {
              model = parsed.model
            }
            if (parsed.choices?.[0]?.finish_reason) {
              finishReason = parsed.choices[0].finish_reason
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

  // Estimate tokens for streaming (actual usage not available in stream)
  const estimatedInputTokens = Math.ceil(
    request.messages.reduce((sum, m) => sum + m.content.length, 0) / 4
  )
  const estimatedOutputTokens = Math.ceil(fullText.length / 4)

  return {
    id: originalReq.id,
    provider: 'openai',
    model,
    text: fullText,
    usage: {
      inputTokens: estimatedInputTokens,
      outputTokens: estimatedOutputTokens,
      totalTokens: estimatedInputTokens + estimatedOutputTokens,
    },
    latencyMs: Date.now() - startTime,
    receivedAt: new Date(),
    metadata: {
      finishReason,
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
