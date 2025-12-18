import { logger } from '@clarity-chat/utils/logger'
/**
 * OpenAI Model Adapter
 *
 * Adapter for OpenAI's GPT models (GPT-4, GPT-4o, GPT-3.5, etc.)
 * Includes timeout, AbortSignal support, and rate limit header parsing.
 *
 * SECURITY: API key must be explicitly provided via config.apiKey.
 * Never falls back to process.env to prevent exposure in frontend bundles.
 */

import type { ModelAdapter, ToolCall } from './types'
import { fetchWithTimeout } from '../utils/fetch-with-timeout'
import { parseRateLimitHeaders } from '../utils/rate-limit-headers'
import {
  validateApiKey,
  createRateLimitError,
  DEFAULT_TIMEOUTS,
  type OpenAIToolCall,
} from './shared'

export const openAIAdapter: ModelAdapter = {
  name: 'openai',

  async chat(messages, config) {
    // SECURITY: Require explicit API key - no process.env fallback
    const apiKey = validateApiKey(config.apiKey, 'OpenAI')
    const timeout = config.timeout ?? DEFAULT_TIMEOUTS.chat

    const response = await fetchWithTimeout(
      `${config.baseURL || 'https://api.openai.com/v1'}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages.map((m) => ({
            role: m.role,
            content:
              typeof m.content === 'string'
                ? m.content
                : m.content.map((p) => {
                    if (p.type === 'text') return { type: 'text', text: p.text }
                    if (p.type === 'image')
                      return {
                        type: 'image_url',
                        image_url: { url: p.imageUrl },
                      }
                    return p
                  }),
          })),
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          top_p: config.topP,
          frequency_penalty: config.frequencyPenalty,
          presence_penalty: config.presencePenalty,
          stop: config.stop,
        }),
        timeout,
        signal: config.signal,
      }
    )

    if (!response.ok) {
      const rateLimitInfo = parseRateLimitHeaders(response)
      const error = await response.json().catch(() => ({}))
      const errorMessage = `OpenAI API error: ${error.error?.message || response.statusText}`

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
      content: data.choices[0].message.content || '',
      // Type-safe tool call mapping
      toolCalls: data.choices[0].message.tool_calls?.map(
        (tc: OpenAIToolCall): ToolCall => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
          },
        })
      ),
    }
  },

  async *stream(messages, config) {
    // SECURITY: Require explicit API key - no process.env fallback
    const apiKey = validateApiKey(config.apiKey, 'OpenAI')
    const timeout = config.timeout ?? DEFAULT_TIMEOUTS.stream

    const response = await fetchWithTimeout(
      `${config.baseURL || 'https://api.openai.com/v1'}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages.map((m) => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : m.content,
          })),
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          stream: true,
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
        rateLimitInfo, // Include rate limit info for upstream handling
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

          if (!trimmed || trimmed === 'data: [DONE]') continue
          if (!trimmed.startsWith('data: ')) continue

          try {
            const json = JSON.parse(trimmed.slice(6))
            const delta = json.choices[0]?.delta

            if (delta?.content) {
              yield {
                type: 'token',
                content: delta.content,
              }

              config.streamOptions?.onToken?.(delta.content)
            }

            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                if (tc.function) {
                  yield {
                    type: 'tool_call',
                    toolCall: {
                      id: tc.id || 'unknown',
                      type: 'function',
                      function: {
                        name: tc.function.name || '',
                        arguments: tc.function.arguments || '{}',
                      },
                    },
                  }
                }
              }
            }

            if (json.usage) {
              yield {
                type: 'done',
                usage: {
                  promptTokens: json.usage.prompt_tokens,
                  completionTokens: json.usage.completion_tokens,
                  totalTokens: json.usage.total_tokens,
                  estimatedCost: this.estimateCost(
                    {
                      promptTokens: json.usage.prompt_tokens,
                      completionTokens: json.usage.completion_tokens,
                      totalTokens: json.usage.total_tokens,
                    },
                    config.model
                  ),
                },
              }
            }
          } catch (e) {
            logger.error('Failed to parse streaming chunk:', e)
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  },

  estimateCost(usage, model) {
    // Pricing per 1K tokens (as of 2025)
    const rates: Record<string, { input: number; output: number }> = {
      // GPT-4o family (2024-2025)
      'gpt-4o': { input: 0.0025, output: 0.01 },
      'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
      'gpt-4o-2024-11-20': { input: 0.0025, output: 0.01 },
      'gpt-4o-2024-08-06': { input: 0.0025, output: 0.01 },
      // GPT-4 Turbo
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
      'gpt-4-turbo-2024-04-09': { input: 0.01, output: 0.03 },
      // GPT-4
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-4-32k': { input: 0.06, output: 0.12 },
      // GPT-3.5
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
      'gpt-3.5-turbo-0125': { input: 0.0005, output: 0.0015 },
      'gpt-3.5-turbo-16k': { input: 0.003, output: 0.004 },
      // o1 reasoning models (2024-2025)
      o1: { input: 0.015, output: 0.06 },
      'o1-preview': { input: 0.015, output: 0.06 },
      'o1-mini': { input: 0.003, output: 0.012 },
    }

    const rate = rates[model] || rates['gpt-4o-mini']
    if (!rate) return 0

    return (
      (usage.promptTokens / 1000) * rate.input +
      (usage.completionTokens / 1000) * rate.output
    )
  },
}

export const openAIModels = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai' as const,
    speed: 'fast' as const,
    cost: 'medium' as const,
    quality: 'best' as const,
    contextWindow: 128000,
    description: 'Most capable multimodal model, best for complex tasks',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'excellent' as const,
    contextWindow: 128000,
    description: 'Fast, affordable, and capable for most tasks',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'o1',
    name: 'o1',
    provider: 'openai' as const,
    speed: 'slow' as const,
    cost: 'high' as const,
    quality: 'best' as const,
    contextWindow: 200000,
    description: 'Advanced reasoning model for complex problems',
    streaming: true,
    toolCalling: false,
    vision: true,
  },
  {
    id: 'o1-mini',
    name: 'o1 Mini',
    provider: 'openai' as const,
    speed: 'medium' as const,
    cost: 'medium' as const,
    quality: 'excellent' as const,
    contextWindow: 128000,
    description: 'Fast reasoning model, great for coding and math',
    streaming: true,
    toolCalling: false,
    vision: false,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai' as const,
    speed: 'fast' as const,
    cost: 'medium' as const,
    quality: 'best' as const,
    contextWindow: 128000,
    description: 'Legacy GPT-4 Turbo, use gpt-4o instead',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'good' as const,
    contextWindow: 16385,
    description: 'Legacy model, use gpt-4o-mini instead',
    streaming: true,
    toolCalling: true,
    vision: false,
  },
]
