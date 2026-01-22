/**
 * Anthropic Model Adapter
 *
 * Adapter for Anthropic's Claude models (Claude 3.5, Claude 3, etc.)
 * Includes timeout, AbortSignal support, and rate limit header parsing.
 *
 * SECURITY: API key must be explicitly provided via config.apiKey.
 * Never falls back to process.env to prevent exposure in frontend bundles.
 */

import type { ModelAdapter, FinishReason, ToolDefinition, ToolCall } from './types'
import { fetchWithTimeout } from '../utils/api/fetch-with-timeout'
import { parseRateLimitHeaders } from '../utils/api/rate-limit-headers'
import {
  validateApiKey,
  extractSystemMessage,
  filterConversationMessages,
  DEFAULT_TIMEOUTS,
} from './shared'

/**
 * Map Anthropic stop reasons to unified finish reasons
 */
function normalizeFinishReason(
  reason: string | null | undefined
): FinishReason {
  if (!reason) return 'unknown'
  switch (reason) {
    case 'end_turn':
    case 'stop_sequence':
      return 'stop'
    case 'max_tokens':
      return 'length'
    case 'tool_use':
      return 'tool-calls'
    default:
      return 'unknown'
  }
}

/**
 * Convert our ToolDefinition format to Anthropic's tool format
 */
function convertToolsToAnthropicFormat(tools?: ToolDefinition[]) {
  if (!tools || tools.length === 0) return undefined

  return tools.map((tool) => ({
    name: tool.function.name,
    description: tool.function.description,
    input_schema: tool.function.parameters || {
      type: 'object',
      properties: {},
    },
  }))
}

/**
 * Parse Anthropic tool use blocks to our ToolCall format
 */
function parseToolCalls(content: Array<{ type: string; [key: string]: unknown }>): ToolCall[] {
  return content
    .filter((block): block is { type: 'tool_use'; id: string; name: string; input: unknown } =>
      block.type === 'tool_use'
    )
    .map((block) => ({
      id: block.id,
      type: 'function' as const,
      function: {
        name: block.name,
        arguments: JSON.stringify(block.input),
      },
    }))
}

export const anthropicAdapter: ModelAdapter = {
  name: 'anthropic',

  async chat(messages, config) {
    // SECURITY: Require explicit API key - no process.env fallback
    const apiKey = validateApiKey(config.apiKey, 'Anthropic')
    const timeout = config.timeout ?? DEFAULT_TIMEOUTS.chat

    // Extract system message using shared utility
    const systemMessage = extractSystemMessage(messages)
    const conversationMessages = filterConversationMessages(messages)

    const response = await fetchWithTimeout(
      `${config.baseURL || 'https://api.anthropic.com/v1'}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model,
          system: systemMessage?.content || undefined,
          messages: conversationMessages.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: typeof m.content === 'string' ? m.content : m.content,
          })),
          max_tokens: config.maxTokens || 4096,
          temperature: config.temperature,
          top_p: config.topP,
          stop_sequences: config.stop,
          tools: convertToolsToAnthropicFormat(config.tools),
        }),
        timeout,
        signal: config.signal,
      }
    )

    if (!response.ok) {
      const rateLimitInfo = parseRateLimitHeaders(response)
      const error = await response.json().catch(() => ({}))
      const errorMessage = `Anthropic API error: ${error.error?.message || response.statusText}`

      // Attach rate limit info to error for upstream handling
      const err = new Error(errorMessage) as Error & {
        rateLimitInfo?: typeof rateLimitInfo
      }
      err.rateLimitInfo = rateLimitInfo
      throw err
    }

    const data = await response.json()

    // Extract text content from all text blocks
    const textContent = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('')

    // Parse tool calls from tool_use blocks
    const toolCalls = parseToolCalls(data.content)

    return {
      role: 'assistant',
      content: textContent,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      finishReason: normalizeFinishReason(data.stop_reason),
    }
  },

  async *stream(messages, config) {
    // SECURITY: Require explicit API key - no process.env fallback
    const apiKey = validateApiKey(config.apiKey, 'Anthropic')
    const timeout = config.timeout ?? DEFAULT_TIMEOUTS.stream

    const systemMessage = extractSystemMessage(messages)
    const conversationMessages = filterConversationMessages(messages)

    const response = await fetchWithTimeout(
      `${config.baseURL || 'https://api.anthropic.com/v1'}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model,
          system: systemMessage?.content || undefined,
          messages: conversationMessages.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: typeof m.content === 'string' ? m.content : m.content,
          })),
          max_tokens: config.maxTokens || 4096,
          temperature: config.temperature,
          stream: true,
          tools: convertToolsToAnthropicFormat(config.tools),
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
    // Track tool use blocks being built during streaming
    const toolUseBlocks = new Map<
      number,
      { id: string; name: string; partialInput: string }
    >()

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

          if (!trimmed || !trimmed.startsWith('data: ')) continue

          try {
            const json = JSON.parse(trimmed.slice(6))

            // Handle text content
            if (json.type === 'content_block_delta' && json.delta?.text) {
              yield {
                type: 'token',
                content: json.delta.text,
              }

              config.streamOptions?.onToken?.(json.delta.text)
            }

            // Handle tool use block start
            if (
              json.type === 'content_block_start' &&
              json.content_block?.type === 'tool_use'
            ) {
              toolUseBlocks.set(json.index, {
                id: json.content_block.id,
                name: json.content_block.name,
                partialInput: '',
              })
            }

            // Handle tool use input delta
            if (
              json.type === 'content_block_delta' &&
              json.delta?.type === 'input_json_delta'
            ) {
              const block = toolUseBlocks.get(json.index)
              if (block) {
                block.partialInput += json.delta.partial_json
              }
            }

            // Handle tool use block completion
            if (json.type === 'content_block_stop') {
              const block = toolUseBlocks.get(json.index)
              if (block) {
                yield {
                  type: 'tool_call',
                  toolCall: {
                    id: block.id,
                    type: 'function',
                    function: {
                      name: block.name,
                      arguments: block.partialInput,
                    },
                  },
                }
                toolUseBlocks.delete(json.index)
              }
            }

            // Handle message completion with usage
            if (json.type === 'message_delta') {
              yield {
                type: 'done',
                usage: json.usage ? {
                  promptTokens: json.usage.input_tokens || 0,
                  completionTokens: json.usage.output_tokens || 0,
                  totalTokens:
                    (json.usage.input_tokens || 0) +
                    (json.usage.output_tokens || 0),
                  estimatedCost: this.estimateCost(
                    {
                      promptTokens: json.usage.input_tokens || 0,
                      completionTokens: json.usage.output_tokens || 0,
                      totalTokens:
                        (json.usage.input_tokens || 0) +
                        (json.usage.output_tokens || 0),
                    },
                    config.model
                  ),
                } : undefined,
                finishReason: json.delta?.stop_reason
                  ? normalizeFinishReason(json.delta.stop_reason)
                  : undefined,
              }
            }
          } catch (e) {
            console.error('Failed to parse streaming chunk:', e)
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
      // Claude 3.5 family (2024-2025)
      'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
      'claude-3-5-sonnet-latest': { input: 3, output: 15 },
      'claude-3-5-haiku-20241022': { input: 0.8, output: 4 },
      'claude-3-5-haiku-latest': { input: 0.8, output: 4 },
      // Claude 3 family
      'claude-3-opus-20240229': { input: 15, output: 75 },
      'claude-3-opus-latest': { input: 15, output: 75 },
      'claude-3-sonnet-20240229': { input: 3, output: 15 },
      'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
      // Legacy models
      'claude-2.1': { input: 8, output: 24 },
      'claude-2.0': { input: 8, output: 24 },
    }

    const rate = rates[model] || rates['claude-3-5-sonnet-latest']
    if (!rate) return 0

    return (
      (usage.promptTokens / 1000000) * rate.input +
      (usage.completionTokens / 1000000) * rate.output
    )
  },
}

export const anthropicModels = [
  {
    id: 'claude-3-5-sonnet-latest',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic' as const,
    speed: 'fast' as const,
    cost: 'medium' as const,
    quality: 'best' as const,
    contextWindow: 200000,
    description: 'Most intelligent Claude model, best for complex tasks',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'claude-3-5-haiku-latest',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'excellent' as const,
    contextWindow: 200000,
    description: 'Fast and affordable, great for most tasks',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'claude-3-opus-latest',
    name: 'Claude 3 Opus',
    provider: 'anthropic' as const,
    speed: 'medium' as const,
    cost: 'high' as const,
    quality: 'best' as const,
    contextWindow: 200000,
    description: 'Exceptional reasoning, use for complex analysis',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic' as const,
    speed: 'fast' as const,
    cost: 'medium' as const,
    quality: 'excellent' as const,
    contextWindow: 200000,
    description: 'Legacy model, use claude-3-5-sonnet instead',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic' as const,
    speed: 'fast' as const,
    cost: 'low' as const,
    quality: 'good' as const,
    contextWindow: 200000,
    description: 'Legacy model, use claude-3-5-haiku instead',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
]
