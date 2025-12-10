/**
 * Google AI Model Adapter
 *
 * Adapter for Google's Gemini models (Gemini 2.0, Gemini 1.5, etc.)
 * Includes timeout, AbortSignal support, and rate limit header parsing.
 *
 * NOTE: Uses header-based authentication (x-goog-api-key) to avoid
 * exposing API keys in URLs/logs.
 */

import type {
  ModelAdapter,
  // ChatMessage, // Reserved for future use
  // ModelConfig, // Reserved for future use
  // StreamChunk, // Reserved for future use
  // TokenUsage // Reserved for future use
} from './types'
import { fetchWithTimeout } from '../utils/fetch-with-timeout'
import { parseRateLimitHeaders } from '../utils/rate-limit-headers'

export const googleAdapter: ModelAdapter = {
  name: 'google',

  async chat(messages, config) {
    const timeout = config.timeout ?? 30000 // 30s default for chat
    const apiKey = config.apiKey || process.env['GOOGLE_API_KEY']

    const response = await fetchWithTimeout(
      `${config.baseURL || 'https://generativelanguage.googleapis.com/v1beta'}/models/${config.model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey || '', // Use header instead of URL param
        },
        body: JSON.stringify({
          contents: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [
              {
                text:
                  typeof m.content === 'string'
                    ? m.content
                    : m.content.find((p) => p.type === 'text')?.text || '',
              },
            ],
          })),
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

    return {
      role: 'assistant',
      content: data.candidates[0]?.content?.parts[0]?.text || '',
    }
  },

  async *stream(messages, config) {
    const timeout = config.timeout ?? 60000 // 60s default for streaming
    const apiKey = config.apiKey || process.env['GOOGLE_API_KEY']

    const response = await fetchWithTimeout(
      `${config.baseURL || 'https://generativelanguage.googleapis.com/v1beta'}/models/${config.model}:streamGenerateContent?alt=sse`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey || '', // Use header instead of URL param
        },
        body: JSON.stringify({
          contents: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [
              {
                text:
                  typeof m.content === 'string'
                    ? m.content
                    : m.content.find((p) => p.type === 'text')?.text || '',
              },
            ],
          })),
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
                if (part.text) {
                  yield {
                    type: 'token',
                    content: part.text,
                  }

                  config.streamOptions?.onToken?.(part.text)
                }
              }
            }

            if (json.usageMetadata) {
              yield {
                type: 'done',
                usage: {
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
                },
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
