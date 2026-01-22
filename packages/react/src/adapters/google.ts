/**
 * Google AI Model Adapter
 *
 * Adapter for Google's Gemini models (Gemini 2.0, Gemini 1.5, etc.)
 * Includes timeout, AbortSignal support, and rate limit header parsing.
 *
 * NOTE: Uses header-based authentication (x-goog-api-key) to avoid
 * exposing API keys in URLs/logs.
 *
 * SECURITY: API key must be explicitly provided via config.apiKey.
 * Never falls back to process.env to prevent exposure in frontend bundles.
 */

import type { ModelAdapter, FinishReason, ToolDefinition, ToolCall } from './types'
import { fetchWithTimeout } from '../utils/api/fetch-with-timeout'
import { parseRateLimitHeaders } from '../utils/api/rate-limit-headers'
import { validateApiKey, DEFAULT_TIMEOUTS } from './shared'

/**
 * Map Google finish reasons to unified finish reasons
 */
function normalizeFinishReason(
  reason: string | null | undefined
): FinishReason {
  if (!reason) return 'unknown'
  switch (reason) {
    case 'STOP':
      return 'stop'
    case 'MAX_TOKENS':
      return 'length'
    case 'SAFETY':
    case 'RECITATION':
      return 'content-filter'
    case 'OTHER':
    default:
      return 'unknown'
  }
}

/**
 * Convert our ToolDefinition format to Google's function declarations format
 */
function convertToolsToGoogleFormat(tools?: ToolDefinition[]) {
  if (!tools || tools.length === 0) return undefined

  return [
    {
      functionDeclarations: tools.map((tool) => ({
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters || {
          type: 'object',
          properties: {},
        },
      })),
    },
  ]
}

/**
 * Parse Google function calls to our ToolCall format
 */
function parseFunctionCalls(
  parts: Array<{ functionCall?: { name: string; args: unknown }; [key: string]: unknown }>
): ToolCall[] {
  return parts
    .filter((part): part is { functionCall: { name: string; args: unknown } } =>
      part.functionCall !== undefined
    )
    .map((part, index) => ({
      id: `call_${index}_${part.functionCall.name}`,
      type: 'function' as const,
      function: {
        name: part.functionCall.name,
        arguments: JSON.stringify(part.functionCall.args),
      },
    }))
}

export const googleAdapter: ModelAdapter = {
  name: 'google',

  async chat(messages, config) {
    // SECURITY: Require explicit API key - no process.env fallback
    const apiKey = validateApiKey(config.apiKey, 'Google')
    const timeout = config.timeout ?? DEFAULT_TIMEOUTS.chat

    const response = await fetchWithTimeout(
      `${config.baseURL || 'https://generativelanguage.googleapis.com/v1beta'}/models/${config.model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts:
              typeof m.content === 'string'
                ? [{ text: m.content }]
                : m.content.map((p) => {
                    if (p.type === 'text') return { text: p.text }
                    if (p.type === 'image')
                      return {
                        inlineData: {
                          mimeType: 'image/jpeg',
                          data: p.imageUrl || '',
                        },
                      }
                    return { text: p.text || '' }
                  }),
          })),
          tools: convertToolsToGoogleFormat(config.tools),
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
            topP: config.topP,
            stopSequences: config.stop,
          },
        }),
        timeout,
        signal: config.signal,
      }
    )

    if (!response.ok) {
      const rateLimitInfo = parseRateLimitHeaders(response)
      const error = await response.json().catch(() => ({}))
      const errorMessage = `Google AI API error: ${error.error?.message || response.statusText}`

      // Attach rate limit info to error for upstream handling
      const err = new Error(errorMessage) as Error & {
        rateLimitInfo?: typeof rateLimitInfo
      }
      err.rateLimitInfo = rateLimitInfo
      throw err
    }

    const data = await response.json()

    const parts = data.candidates[0]?.content?.parts || []

    // Extract text content from all text parts
    const textContent = parts
      .filter((part: { text?: string }) => part.text)
      .map((part: { text: string }) => part.text)
      .join('')

    // Parse function calls
    const functionCalls = parseFunctionCalls(parts)

    return {
      role: 'assistant',
      content: textContent,
      toolCalls: functionCalls.length > 0 ? functionCalls : undefined,
      finishReason: normalizeFinishReason(data.candidates[0]?.finishReason),
    }
  },

  async *stream(messages, config) {
    // SECURITY: Require explicit API key - no process.env fallback
    const apiKey = validateApiKey(config.apiKey, 'Google')
    const timeout = config.timeout ?? DEFAULT_TIMEOUTS.stream

    const response = await fetchWithTimeout(
      `${config.baseURL || 'https://generativelanguage.googleapis.com/v1beta'}/models/${config.model}:streamGenerateContent?alt=sse`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts:
              typeof m.content === 'string'
                ? [{ text: m.content }]
                : m.content.map((p) => {
                    if (p.type === 'text') return { text: p.text }
                    if (p.type === 'image')
                      return {
                        inlineData: {
                          mimeType: 'image/jpeg',
                          data: p.imageUrl || '',
                        },
                      }
                    return { text: p.text || '' }
                  }),
          })),
          tools: convertToolsToGoogleFormat(config.tools),
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
            topP: config.topP,
          },
        }),
        timeout,
        signal: config.signal,
      }
    )

    if (!response.ok) {
      const rateLimitInfo = parseRateLimitHeaders(response)
      const error = await response.json().catch(() => ({}))
      yield {
        type: 'error',
        error: error.error?.message || response.statusText,
        rateLimitInfo,
      }
      return
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      yield { type: 'error', error: 'No response body' }
      return
    }

    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          yield { type: 'done' }
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()

          if (!trimmed || trimmed === '[DONE]') continue

          // Handle SSE format (data: prefix)
          let jsonStr = trimmed
          if (trimmed.startsWith('data: ')) {
            jsonStr = trimmed.slice(6)
          }

          try {
            const json = JSON.parse(jsonStr)
            const candidate = json.candidates?.[0]

            if (candidate?.content?.parts) {
              for (const part of candidate.content.parts) {
                // Handle text content
                if (part.text) {
                  yield {
                    type: 'token',
                    content: part.text,
                  }

                  config.streamOptions?.onToken?.(part.text)
                }

                // Handle function calls
                if (part.functionCall) {
                  const functionCalls = parseFunctionCalls([part])
                  for (const toolCall of functionCalls) {
                    yield {
                      type: 'tool_call',
                      toolCall,
                    }
                  }
                }
              }
            }

            // Check for finish reason or usage metadata
            const finishReason = candidate?.finishReason

            if (json.usageMetadata || finishReason) {
              yield {
                type: 'done',
                usage: json.usageMetadata ? {
                  promptTokens: json.usageMetadata.promptTokenCount || 0,
                  completionTokens:
                    json.usageMetadata.candidatesTokenCount || 0,
                  totalTokens: json.usageMetadata.totalTokenCount || 0,
                  estimatedCost: this.estimateCost(
                    {
                      promptTokens: json.usageMetadata.promptTokenCount || 0,
                      completionTokens:
                        json.usageMetadata.candidatesTokenCount || 0,
                      totalTokens: json.usageMetadata.totalTokenCount || 0,
                    },
                    config.model
                  ),
                } : undefined,
                finishReason: finishReason ? normalizeFinishReason(finishReason) : undefined,
              }
            }
          } catch (e) {
            // Skip non-JSON lines (SSE comments, empty lines)
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  },

  estimateCost(usage, model) {
    // Pricing per 1M tokens (as of 2025)
    const rates: Record<string, { input: number; output: number }> = {
      // Gemini 2.0 family (2024-2025)
      'gemini-2.0-flash-exp': { input: 0, output: 0 }, // Free during preview
      'gemini-2.0-flash': { input: 0.1, output: 0.4 },
      // Gemini 1.5 family
      'gemini-1.5-pro': { input: 1.25, output: 5 },
      'gemini-1.5-pro-latest': { input: 1.25, output: 5 },
      'gemini-1.5-flash': { input: 0.075, output: 0.3 },
      'gemini-1.5-flash-latest': { input: 0.075, output: 0.3 },
      'gemini-1.5-flash-8b': { input: 0.0375, output: 0.15 },
      // Legacy
      'gemini-1.0-pro': { input: 0.5, output: 1.5 },
    }

    const rate = rates[model] || rates['gemini-1.5-flash']
    if (!rate) return 0

    return (
      (usage.promptTokens / 1000000) * rate.input +
      (usage.completionTokens / 1000000) * rate.output
    )
  },
}

export const googleModels = [
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash (Experimental)',
    provider: 'google' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'best' as const,
    contextWindow: 1000000,
    description: 'Latest Gemini with multimodal live API support',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'gemini-1.5-pro-latest',
    name: 'Gemini 1.5 Pro',
    provider: 'google' as const,
    speed: 'medium' as const,
    cost: 'medium' as const,
    quality: 'best' as const,
    contextWindow: 2000000,
    description: 'Largest context window (2M tokens), excellent reasoning',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'gemini-1.5-flash-latest',
    name: 'Gemini 1.5 Flash',
    provider: 'google' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'excellent' as const,
    contextWindow: 1000000,
    description: 'Fast and affordable with huge context',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash 8B',
    provider: 'google' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'good' as const,
    contextWindow: 1000000,
    description: 'Smallest and fastest, great for high-volume tasks',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
]
