/**
 * Anthropic Model Adapter
 *
 * Comprehensive adapter for Anthropic's Claude models with support for:
 * - Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus, and legacy models
 * - Streaming with real-time token, tool call, and thinking emission
 * - Tool use (function calling) with proper message formatting
 * - Extended thinking/internal reasoning (Claude 3.5+)
 * - Timeout, AbortSignal, and rate limit header parsing
 * - Vision capabilities and image inputs
 * - Budget-aware streaming with token cost estimation
 *
 * SECURITY: API key must be explicitly provided via config.apiKey.
 * Never falls back to process.env to prevent exposure in frontend bundles.
 *
 * @module adapters/anthropic
 * @author Clarity AI Team
 */

import type {
  ModelAdapter,
  FinishReason,
  ToolDefinition,
  ToolCall,
  ChatMessage,
  StreamChunk,
  TokenUsage,
  ClarityChatAdapter,
  ClarityChatMessage,
  ClarityChatStreamChunk,
  ClarityChatStreamStatus,
  ClarityChatToolExecution,
  ClarityChatStreamableResponse,
  ChatMessageAttachment,
  ClarityChatAdapterCapabilities,
  ModelConfig,
} from './types'
import { createBaseClarityChatAdapter } from './types'
import { fetchWithTimeout } from '../utils/api/fetch-with-timeout'
import { parseRateLimitHeaders } from '../utils/api/rate-limit-headers'
import {
  validateApiKey,
  extractSystemMessage,
  filterConversationMessages,
  DEFAULT_TIMEOUTS,
} from './shared'

// =============================================================================
// Types and Interfaces
// =============================================================================

/**
 * Anthropic API message role type
 */
export type AnthropicRole = 'user' | 'assistant'

/**
 * Anthropic content block types
 */
export type AnthropicContentBlockType =
  | 'text'
  | 'tool_use'
  | 'image'
  | 'tool_result'
  | 'thinking'

/**
 * Anthropic text content block
 */
export interface AnthropicTextBlock {
  type: 'text'
  text: string
}

/**
 * Anthropic tool use content block
 */
export interface AnthropicToolUseBlock {
  type: 'tool_use'
  id: string
  name: string
  input: Record<string, unknown>
}

/**
 * Anthropic image content block
 */
export interface AnthropicImageBlock {
  type: 'image'
  source: {
    type: 'base64' | 'url'
    media_type?: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    data?: string
    url?: string
  }
}

/**
 * Anthropic thinking content block (extended thinking)
 */
export interface AnthropicThinkingBlock {
  type: 'thinking'
  thinking: string
}

/**
 * Anthropic tool result content block
 */
export interface AnthropicToolResultBlock {
  type: 'tool_result'
  tool_use_id: string
  content: string | Record<string, unknown>
  is_error?: boolean
}

/**
 * Union of all Anthropic content blocks
 */
export type AnthropicContentBlock =
  | AnthropicTextBlock
  | AnthropicToolUseBlock
  | AnthropicImageBlock
  | AnthropicThinkingBlock
  | AnthropicToolResultBlock

/**
 * Anthropic message in API request/response
 */
export interface AnthropicMessage {
  role: AnthropicRole
  content: string | AnthropicContentBlock[]
}

/**
 * Anthropic API tool definition
 */
export interface AnthropicToolDefinition {
  name: string
  description?: string
  input_schema: Record<string, unknown>
}

/**
 * Anthropic token usage information
 */
export interface AnthropicTokenUsage {
  input_tokens: number
  output_tokens: number
  cache_creation_input_tokens?: number
  cache_read_input_tokens?: number
}

/**
 * Anthropic API response (non-streaming)
 */
export interface AnthropicResponse {
  id: string
  type: 'message'
  role: 'assistant'
  content: AnthropicContentBlock[]
  model: string
  stop_reason: string | null
  usage: AnthropicTokenUsage
}

/**
 * Anthropic streaming event types
 */
export type AnthropicStreamEventType =
  | 'message_start'
  | 'content_block_start'
  | 'content_block_delta'
  | 'content_block_stop'
  | 'message_delta'
  | 'message_stop'

/**
 * Anthropic streaming message start event
 */
export interface AnthropicMessageStartEvent {
  type: 'message_start'
  message: {
    id: string
    type: 'message'
    role: 'assistant'
    content: AnthropicContentBlock[]
    model: string
    stop_reason: null
    usage: AnthropicTokenUsage
  }
}

/**
 * Anthropic streaming content block start event
 */
export interface AnthropicContentBlockStartEvent {
  type: 'content_block_start'
  index: number
  content_block: { type: AnthropicContentBlockType; [key: string]: unknown }
}

/**
 * Anthropic streaming content block delta event
 */
export interface AnthropicContentBlockDeltaEvent {
  type: 'content_block_delta'
  index: number
  delta: {
    type: 'text_delta' | 'input_json_delta' | 'thinking_delta'
    text?: string
    partial_json?: string
    thinking?: string
  }
}

/**
 * Anthropic streaming content block stop event
 */
export interface AnthropicContentBlockStopEvent {
  type: 'content_block_stop'
  index: number
}

/**
 * Anthropic streaming message delta event
 */
export interface AnthropicMessageDeltaEvent {
  type: 'message_delta'
  delta: {
    stop_reason: string | null
    stop_sequence: string | null
  }
  usage: AnthropicTokenUsage
}

/**
 * Anthropic streaming message stop event
 */
export interface AnthropicMessageStopEvent {
  type: 'message_stop'
}

/**
 * Union of all Anthropic streaming events
 */
export type AnthropicStreamEvent =
  | AnthropicMessageStartEvent
  | AnthropicContentBlockStartEvent
  | AnthropicContentBlockDeltaEvent
  | AnthropicContentBlockStopEvent
  | AnthropicMessageDeltaEvent
  | AnthropicMessageStopEvent

/**
 * Streaming tool use block being constructed
 */
export interface StreamingToolUseBlock {
  id: string
  name: string
  partialInput: string
}

/**
 * Streaming thinking block being constructed
 */
export interface StreamingThinkingBlock {
  index: number
  partialThinking: string
}

// =============================================================================
// Utility Functions
// =============================================================================

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
function convertToolsToAnthropicFormat(
  tools?: ToolDefinition[]
): AnthropicToolDefinition[] | undefined {
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
function parseToolCalls(content: AnthropicContentBlock[]): ToolCall[] {
  return content
    .filter((block): block is AnthropicToolUseBlock => block.type === 'tool_use')
    .map((block) => ({
      id: block.id,
      type: 'function' as const,
      function: {
        name: block.name,
        arguments: JSON.stringify(block.input),
      },
    }))
}

/**
 * Extract thinking blocks from content
 */
function extractThinkingSteps(content: AnthropicContentBlock[]): string[] {
  return content
    .filter((block): block is AnthropicThinkingBlock => block.type === 'thinking')
    .map((block) => block.thinking)
}

/**
 * Convert our ChatMessage format to Anthropic's message format
 */
function convertMessageToAnthropicFormat(message: ChatMessage): AnthropicMessage {
  const anthropicMessage: AnthropicMessage = {
    role: message.role === 'assistant' ? 'assistant' : 'user',
    content: [],
  }

  // Handle string content
  if (typeof message.content === 'string') {
    anthropicMessage.content = message.content
    return anthropicMessage
  }

  // Handle content parts
  if (Array.isArray(message.content)) {
    anthropicMessage.content = message.content.map((part) => {
      if (part.type === 'text' && part.text) {
        return {
          type: 'text',
          text: part.text,
        } as AnthropicTextBlock
      }

      if (part.type === 'image' && part.imageUrl) {
        // Parse image URL - could be data URL or regular URL
        if (part.imageUrl.startsWith('data:')) {
          // Extract base64 data from data URL
          const [metadata, data] = part.imageUrl.split(',')
          const mediaType = metadata
            .split(';')[0]
            .replace('data:', '') as
            | 'image/jpeg'
            | 'image/png'
            | 'image/gif'
            | 'image/webp'
          return {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: data || '',
            },
          } as AnthropicImageBlock
        } else {
          // Regular URL
          return {
            type: 'image',
            source: {
              type: 'url',
              url: part.imageUrl,
            },
          } as AnthropicImageBlock
        }
      }

      if (part.type === 'tool_result' && part.toolCallId) {
        return {
          type: 'tool_result',
          tool_use_id: part.toolCallId,
          content:
            typeof part.toolResult === 'string'
              ? part.toolResult
              : JSON.stringify(part.toolResult || {}),
          is_error: false,
        } as AnthropicToolResultBlock
      }

      return {
        type: 'text',
        text: '[Unsupported content type]',
      } as AnthropicTextBlock
    })

    return anthropicMessage
  }

  return anthropicMessage
}

/**
 * Extract text content from Anthropic content blocks
 */
function extractTextContent(content: AnthropicContentBlock[]): string {
  return content
    .filter((block): block is AnthropicTextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')
}

// =============================================================================
// Anthropic Adapter Implementation
// =============================================================================

/**
 * Main Anthropic adapter implementing the ModelAdapter interface
 */
export const anthropicAdapter: ModelAdapter = {
  name: 'anthropic',

  /**
   * Send a non-streaming chat completion request
   */
  async chat(messages, config) {
    // SECURITY: Require explicit API key - no process.env fallback
    const apiKey = validateApiKey(config.apiKey, 'Anthropic')
    const timeout = config.timeout ?? DEFAULT_TIMEOUTS.chat

    // Extract system message using shared utility
    const systemMessage = extractSystemMessage(messages)
    const conversationMessages = filterConversationMessages(messages)

    // Build request body
    const requestBody: Record<string, unknown> = {
      model: config.model,
      messages: conversationMessages.map(convertMessageToAnthropicFormat),
      max_tokens: config.maxTokens || 4096,
    }

    // Add system message if present
    if (systemMessage?.content) {
      requestBody.system = systemMessage.content
    }

    // Add optional parameters
    if (config.temperature !== undefined) {
      requestBody.temperature = config.temperature
    }
    if (config.topP !== undefined) {
      requestBody.top_p = config.topP
    }
    if (config.stop) {
      requestBody.stop_sequences = config.stop
    }

    // Add tools if provided
    const tools = convertToolsToAnthropicFormat(config.tools)
    if (tools) {
      requestBody.tools = tools
    }

    // Enable thinking if supported by model
    if (
      config.model &&
      (config.model.includes('3-5') || config.model.includes('opus'))
    ) {
      requestBody.thinking = {
        type: 'enabled',
        budget_tokens: 5000,
      }
    }

    const response = await fetchWithTimeout(
      `${config.baseURL || 'https://api.anthropic.com/v1'}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(requestBody),
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

    const data = (await response.json()) as AnthropicResponse

    // Extract text content from all text blocks
    const textContent = extractTextContent(data.content)

    // Parse tool calls from tool_use blocks
    const toolCalls = parseToolCalls(data.content)

    // Extract thinking steps
    const thinkingSteps = extractThinkingSteps(data.content)

    return {
      role: 'assistant',
      content: textContent,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      finishReason: normalizeFinishReason(data.stop_reason),
    } as ChatMessage
  },

  /**
   * Stream a chat completion response with real-time token/tool/thinking emission
   */
  async *stream(messages, config) {
    // SECURITY: Require explicit API key - no process.env fallback
    const apiKey = validateApiKey(config.apiKey, 'Anthropic')
    const timeout = config.timeout ?? DEFAULT_TIMEOUTS.stream

    const systemMessage = extractSystemMessage(messages)
    const conversationMessages = filterConversationMessages(messages)

    // Build request body
    const requestBody: Record<string, unknown> = {
      model: config.model,
      messages: conversationMessages.map(convertMessageToAnthropicFormat),
      max_tokens: config.maxTokens || 4096,
      stream: true,
    }

    // Add system message if present
    if (systemMessage?.content) {
      requestBody.system = systemMessage.content
    }

    // Add optional parameters
    if (config.temperature !== undefined) {
      requestBody.temperature = config.temperature
    }
    if (config.topP !== undefined) {
      requestBody.top_p = config.topP
    }
    if (config.stop) {
      requestBody.stop_sequences = config.stop
    }

    // Add tools if provided
    const tools = convertToolsToAnthropicFormat(config.tools)
    if (tools) {
      requestBody.tools = tools
    }

    // Enable thinking if supported by model
    if (
      config.model &&
      (config.model.includes('3-5') || config.model.includes('opus'))
    ) {
      requestBody.thinking = {
        type: 'enabled',
        budget_tokens: 5000,
      }
    }

    const response = await fetchWithTimeout(
      `${config.baseURL || 'https://api.anthropic.com/v1'}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(requestBody),
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
      } as StreamChunk
      return
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      yield { type: 'error', error: 'No response body' } as StreamChunk
      return
    }

    let buffer = ''

    // Track blocks being built during streaming
    const toolUseBlocks = new Map<number, StreamingToolUseBlock>()
    const thinkingBlocks = new Map<number, StreamingThinkingBlock>()
    let lastUsage: AnthropicTokenUsage | null = null
    let stopReason: string | null = null

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          yield { type: 'done', finishReason: normalizeFinishReason(stopReason) } as StreamChunk
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()

          if (!trimmed || !trimmed.startsWith('data: ')) continue

          try {
            const json = JSON.parse(trimmed.slice(6)) as AnthropicStreamEvent

            // Handle text content delta
            if (
              json.type === 'content_block_delta' &&
              'delta' in json &&
              json.delta?.type === 'text_delta' &&
              json.delta?.text
            ) {
              yield {
                type: 'token',
                content: json.delta.text,
              } as StreamChunk

              config.streamOptions?.onToken?.(json.delta.text)
            }

            // Handle thinking delta
            if (
              json.type === 'content_block_delta' &&
              'delta' in json &&
              json.delta?.type === 'thinking_delta' &&
              json.delta?.thinking
            ) {
              const thinkingBlock = thinkingBlocks.get(json.index)
              if (thinkingBlock) {
                thinkingBlock.partialThinking += json.delta.thinking
              }

              yield {
                type: 'thinking',
                thinkingStep: json.delta.thinking,
              } as StreamChunk

              config.streamOptions?.onThinking?.(json.delta.thinking)
            }

            // Handle tool use block start
            if (
              json.type === 'content_block_start' &&
              'content_block' in json &&
              json.content_block?.type === 'tool_use'
            ) {
              const toolBlock = json.content_block as {
                id: string
                name: string
              }
              toolUseBlocks.set(json.index, {
                id: toolBlock.id,
                name: toolBlock.name,
                partialInput: '',
              })
            }

            // Handle thinking block start
            if (
              json.type === 'content_block_start' &&
              'content_block' in json &&
              json.content_block?.type === 'thinking'
            ) {
              thinkingBlocks.set(json.index, {
                index: json.index,
                partialThinking: '',
              })
            }

            // Handle tool use input delta
            if (
              json.type === 'content_block_delta' &&
              'delta' in json &&
              json.delta?.type === 'input_json_delta'
            ) {
              const block = toolUseBlocks.get(json.index)
              if (block && json.delta?.partial_json) {
                block.partialInput += json.delta.partial_json
              }
            }

            // Handle tool use block completion
            if (json.type === 'content_block_stop') {
              const block = toolUseBlocks.get(json.index)
              if (block) {
                const toolCall: ToolCall = {
                  id: block.id,
                  type: 'function',
                  function: {
                    name: block.name,
                    arguments: block.partialInput,
                  },
                }

                yield {
                  type: 'tool_call',
                  toolCall,
                } as StreamChunk

                config.streamOptions?.onToolCall?.(toolCall)
                toolUseBlocks.delete(json.index)
              }
            }

            // Handle message delta with usage
            if (json.type === 'message_delta' && 'delta' in json && 'usage' in json) {
              lastUsage = json.usage
              stopReason = json.delta?.stop_reason || null
            }

            // Handle message stop event
            if (json.type === 'message_stop' && lastUsage) {
              const usage: TokenUsage = {
                promptTokens:
                  lastUsage.input_tokens +
                  (lastUsage.cache_read_input_tokens || 0),
                completionTokens: lastUsage.output_tokens,
                totalTokens:
                  lastUsage.input_tokens +
                  (lastUsage.cache_read_input_tokens || 0) +
                  lastUsage.output_tokens +
                  (lastUsage.cache_creation_input_tokens || 0),
                estimatedCost: this.estimateCost(
                  {
                    promptTokens:
                      lastUsage.input_tokens +
                      (lastUsage.cache_read_input_tokens || 0),
                    completionTokens: lastUsage.output_tokens,
                    totalTokens:
                      lastUsage.input_tokens +
                      (lastUsage.cache_read_input_tokens || 0) +
                      lastUsage.output_tokens +
                      (lastUsage.cache_creation_input_tokens || 0),
                  },
                  config.model
                ),
              }

              yield {
                type: 'done',
                usage,
                finishReason: normalizeFinishReason(stopReason),
              } as StreamChunk
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

  /**
   * Estimate cost for token usage based on model pricing
   */
  estimateCost(usage, model) {
    // Pricing per 1M tokens (as of January 2025)
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

// =============================================================================
// Model Registry
// =============================================================================

/**
 * Available Anthropic models with metadata
 */
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

// =============================================================================
// React Hook for Bridge Pattern
// =============================================================================

/**
 * Configuration for useAnthropicBridge hook
 */
export interface UseAnthropicBridgeConfig {
  /** API key for Anthropic */
  apiKey: string
  /** Model to use */
  model?: string
  /** Base URL for API (optional) */
  baseURL?: string
  /** Temperature for randomness */
  temperature?: number
  /** Maximum tokens to generate */
  maxTokens?: number
  /** Top-p sampling */
  topP?: number
  /** Enable extended thinking */
  thinkingEnabled?: boolean
}

/**
 * Return type for useAnthropicBridge hook
 */
export interface UseAnthropicBridgeReturn {
  /** Send a single message */
  sendMessage: (
    message: string,
    tools?: ToolDefinition[]
  ) => Promise<ChatMessage>
  /** Stream a message with real-time chunks */
  streamMessage: (
    message: string,
    tools?: ToolDefinition[]
  ) => AsyncGenerator<StreamChunk, void, unknown>
  /** Check if adapter is available */
  isAvailable: boolean
  /** Get current configuration */
  getConfig: () => UseAnthropicBridgeConfig
  /** Update configuration */
  updateConfig: (
    config: Partial<UseAnthropicBridgeConfig>
  ) => void
}

/**
 * React hook for bridging to Anthropic adapter
 *
 * @param config - Configuration for the Anthropic adapter
 * @returns Hook return with message sending and streaming capabilities
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { sendMessage, streamMessage } = useAnthropicBridge({
 *     apiKey: process.env.ANTHROPIC_API_KEY,
 *     model: 'claude-3-5-sonnet-latest',
 *     maxTokens: 2048,
 *   })
 *
 *   const handleSend = async (text: string) => {
 *     const response = await sendMessage(text)
 *     console.log(response.content)
 *   }
 *
 *   const handleStream = async (text: string) => {
 *     for await (const chunk of streamMessage(text)) {
 *       if (chunk.type === 'token') {
 *         console.log(chunk.content)
 *       }
 *     }
 *   }
 *
 *   return (
 *     <>
 *       <button onClick={() => handleSend('Hello')}>Send</button>
 *       <button onClick={() => handleStream('Hello')}>Stream</button>
 *     </>
 *   )
 * }
 * ```
 */
export function createAnthropicBridge(
  config: UseAnthropicBridgeConfig
): UseAnthropicBridgeReturn {
  let currentConfig = { ...config }

  return {
    async sendMessage(message, tools) {
      const messages: ChatMessage[] = [
        {
          role: 'user',
          content: message,
        },
      ]

      return anthropicAdapter.chat(messages, {
        ...currentConfig,
        tools,
        model: currentConfig.model || 'claude-3-5-sonnet-latest',
        apiKey: currentConfig.apiKey,
      })
    },

    async *streamMessage(message, tools) {
      const messages: ChatMessage[] = [
        {
          role: 'user',
          content: message,
        },
      ]

      yield* anthropicAdapter.stream(messages, {
        ...currentConfig,
        tools,
        model: currentConfig.model || 'claude-3-5-sonnet-latest',
        apiKey: currentConfig.apiKey,
      })
    },

    get isAvailable() {
      return !!currentConfig.apiKey
    },

    getConfig() {
      return { ...currentConfig }
    },

    updateConfig(updates) {
      currentConfig = { ...currentConfig, ...updates }
    },
  }
}

// =============================================================================
// ClarityChatAdapter Implementation
// =============================================================================

/**
 * Configuration for Anthropic ClarityChatAdapter
 */
export interface AnthropicClarityChatAdapterConfig {
  /** API key for Anthropic */
  apiKey: string
  /** Model to use (default: 'claude-3-5-sonnet-latest') */
  model?: string
  /** Base URL for API (optional) */
  baseURL?: string
  /** Temperature for randomness (0-2) */
  temperature?: number
  /** Maximum tokens to generate */
  maxTokens?: number
  /** Top-p sampling (0-1) */
  topP?: number
  /** Enable extended thinking */
  thinkingEnabled?: boolean
  /** Budget for thinking tokens */
  thinkingBudgetTokens?: number
  /** Conversation history retention */
  retainHistory?: boolean
  /** Maximum messages to keep in history */
  maxHistoryMessages?: number
  /** Enable tool call approval workflow */
  requireToolApproval?: boolean
}

/**
 * Create UUID-like IDs (simple version)
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Anthropic ClarityChatAdapter implementation
 *
 * Implements the ClarityChatAdapter interface for integration with ClarityChatProvider.
 * Features:
 * - Full streaming support with real-time token, tool call, and thinking emission
 * - Tool/function calling with optional approval workflow
 * - Extended thinking/internal reasoning (Claude 3.5+)
 * - Conversation history management
 * - Message attachments (images, files)
 * - Rate limit handling and error recovery
 *
 * @example
 * ```tsx
 * import { createAnthropicAdapter } from '@/adapters/anthropic'
 *
 * const adapter = createAnthropicAdapter({
 *   apiKey: process.env.ANTHROPIC_API_KEY,
 *   model: 'claude-3-5-sonnet-latest',
 *   thinkingEnabled: true,
 * })
 *
 * // In ClarityChatProvider
 * <ClarityChatProvider adapter={adapter}>
 *   <ChatComponent />
 * </ClarityChatProvider>
 * ```
 */
export function createAnthropicAdapter(
  config: AnthropicClarityChatAdapterConfig
): ClarityChatAdapter {
  // Validate and store configuration
  const apiKey = validateApiKey(config.apiKey, 'Anthropic')
  const model = config.model || 'claude-3-5-sonnet-latest'
  const maxTokens = config.maxTokens || 4096
  const temperature = config.temperature ?? 1
  const topP = config.topP ?? 1
  const thinkingBudgetTokens = config.thinkingBudgetTokens ?? 5000
  const retainHistory = config.retainHistory ?? true
  const maxHistoryMessages = config.maxHistoryMessages ?? 50
  const requireToolApproval = config.requireToolApproval ?? false

  // State management
  let abortController: AbortController | null = null
  let conversationHistory: ClarityChatMessage[] = []
  const pendingToolCalls = new Map<string, ClarityChatToolExecution>()

  /**
   * Build conversation messages with history
   */
  function buildConversationMessages(userMessage: string): ChatMessage[] {
    const messages: ChatMessage[] = []

    // Add conversation history
    if (retainHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory.slice(-maxHistoryMessages))
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    })

    return messages
  }

  /**
   * Create a ClarityChatMessage from response content
   */
  function createClarityChatMessage(
    role: 'user' | 'assistant',
    content: string,
    toolCalls?: ToolCall[],
    thinkingSteps?: Array<{ id: string; content: string; status: 'pending' | 'active' | 'complete' }>
  ): ClarityChatMessage {
    return {
      id: generateMessageId(),
      role,
      content,
      createdAt: new Date(),
      toolCalls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined,
      thinkingSteps,
      isStreaming: false,
    }
  }

  /**
   * Map external tool calls to ClarityChatToolExecution format
   */
  function mapToolCalls(toolCalls?: ToolCall[]): ClarityChatToolExecution[] {
    if (!toolCalls || toolCalls.length === 0) return []

    return toolCalls.map((call) => ({
      id: call.id,
      name: call.function.name,
      input: tryParseJSON(call.function.arguments),
      status: requireToolApproval ? 'waiting_approval' : 'approved',
      requiresApproval: requireToolApproval,
    }))
  }

  /**
   * Safe JSON parsing
   */
  function tryParseJSON(json: string): Record<string, unknown> {
    try {
      return JSON.parse(json)
    } catch {
      return { raw: json }
    }
  }

  /**
   * Send a non-streaming message
   */
  async function sendMessage(
    message: string,
    attachments?: ChatMessageAttachment[],
    config?: ModelConfig
  ): Promise<ClarityChatMessage> {
    try {
      const messages = buildConversationMessages(message)

      const response = await anthropicAdapter.chat(messages, {
        apiKey,
        model,
        maxTokens,
        temperature,
        topP,
        ...config,
        signal: abortController?.signal,
      })

      // Create assistant message
      const assistantMessage = createClarityChatMessage(
        'assistant',
        response.content,
        response.toolCalls
      )

      // Update conversation history
      if (retainHistory) {
        conversationHistory.push({
          id: generateMessageId(),
          role: 'user',
          content: message,
          createdAt: new Date(),
          attachments,
        })
        conversationHistory.push(assistantMessage)
      }

      return assistantMessage
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Anthropic adapter error: ${message}`)
    }
  }

  /**
   * Stream a message with real-time updates
   */
  function streamMessage(
    message: string,
    attachments?: ChatMessageAttachment[],
    config?: ModelConfig
  ): ClarityChatStreamableResponse {
    const messageId = generateMessageId()
    let abortStream = false

    const streamGenerator = async function* (): AsyncGenerator<ClarityChatStreamChunk> {
      try {
        abortController = new AbortController()

        const messages = buildConversationMessages(message)
        const startTime = Date.now()

        let fullContent = ''
        let toolCalls: ToolCall[] = []
        let thinkingSteps: Array<{ id: string; content: string; status: 'pending' | 'active' | 'complete' }> = []
        let lastUsage: TokenUsage | undefined
        let finishReason: FinishReason = 'unknown'

        for await (const chunk of anthropicAdapter.stream(messages, {
          apiKey,
          model,
          maxTokens,
          temperature,
          topP,
          ...config,
          signal: abortController.signal,
        })) {
          if (abortStream) break

          // Map token chunks
          if (chunk.type === 'token' && chunk.content) {
            fullContent += chunk.content
            yield {
              type: 'token',
              content: chunk.content,
              messageId,
            } as ClarityChatStreamChunk
          }

          // Map thinking chunks
          if (chunk.type === 'thinking' && chunk.thinkingStep) {
            const thinkingId = `thinking_${thinkingSteps.length}`
            const existing = thinkingSteps.find((t) => t.id === thinkingId)
            if (existing) {
              existing.content += chunk.thinkingStep
              existing.status = 'active'
            } else {
              thinkingSteps.push({
                id: thinkingId,
                content: chunk.thinkingStep,
                status: 'active',
              })
            }

            yield {
              type: 'thinking',
              messageId,
              thinking: {
                id: thinkingId,
                content: chunk.thinkingStep,
                status: 'active',
              },
            } as ClarityChatStreamChunk
          }

          // Map tool call chunks
          if (chunk.type === 'tool_call' && chunk.toolCall) {
            toolCalls.push(chunk.toolCall)

            yield {
              type: 'tool_call',
              messageId,
              toolCall: chunk.toolCall,
            } as ClarityChatStreamChunk
          }

          // Map done/completion chunks
          if (chunk.type === 'done') {
            lastUsage = chunk.usage
            finishReason = chunk.finishReason || 'unknown'

            yield {
              type: 'done',
              messageId,
              usage: chunk.usage,
              finishReason,
            } as ClarityChatStreamChunk
          }

          // Map error chunks
          if (chunk.type === 'error') {
            yield {
              type: 'error',
              messageId,
              error: chunk.error,
            } as ClarityChatStreamChunk
          }
        }

        // Complete thinking steps
        thinkingSteps.forEach((step) => {
          step.status = 'complete'
        })

        // Create final message
        const finalMessage = createClarityChatMessage(
          'assistant',
          fullContent,
          toolCalls,
          thinkingSteps
        )

        // Update conversation history
        if (retainHistory) {
          conversationHistory.push({
            id: generateMessageId(),
            role: 'user',
            content: message,
            createdAt: new Date(),
            attachments,
          })
          conversationHistory.push(finalMessage)
        }

        return finalMessage
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        throw new Error(`Anthropic stream error: ${errorMessage}`)
      }
    }

    return {
      stream: () => streamGenerator(),
      promise: (async () => {
        let finalMessage: ClarityChatMessage | undefined

        for await (const chunk of streamGenerator()) {
          // Message will be returned from the generator
        }

        // Return message after stream completes
        return (
          finalMessage || {
            id: messageId,
            role: 'assistant',
            content: '',
            createdAt: new Date(),
          }
        )
      })(),
      abort: () => {
        abortStream = true
        abortController?.abort()
      },
      messageId,
    }
  }

  /**
   * Stop current generation
   */
  function stopGeneration(): void {
    abortController?.abort()
    abortController = null
  }

  /**
   * Map external messages to ClarityChatMessage
   */
  function mapMessages(externalMessages: unknown[]): ClarityChatMessage[] {
    if (!Array.isArray(externalMessages)) return []

    return externalMessages.map((msg: unknown) => {
      const m = msg as Record<string, unknown>
      return {
        id: (m.id as string) || generateMessageId(),
        role: (m.role as 'user' | 'assistant' | 'system') || 'user',
        content: (m.content as string) || '',
        createdAt: m.createdAt instanceof Date ? m.createdAt : new Date(),
        toolCalls: (m.toolCalls as ToolCall[]) || undefined,
        attachments: (m.attachments as ChatMessageAttachment[]) || undefined,
        isStreaming: (m.isStreaming as boolean) || false,
      } as ClarityChatMessage
    })
  }

  /**
   * Map external stream status
   */
  function mapStreamStatus(externalStatus: unknown): ClarityChatStreamStatus {
    const status = externalStatus as Record<string, unknown> | null

    return {
      isStreaming: (status?.isStreaming as boolean) || false,
      phase: (status?.phase as any) || 'idle',
      progress: (status?.progress as number) || 0,
      tokensUsed: (status?.tokensUsed as number) || 0,
      tokensTotal: (status?.tokensTotal as number) || undefined,
      startedAt: status?.startedAt instanceof Date ? status.startedAt : null,
      estimatedCompletion: status?.estimatedCompletion instanceof Date ? status.estimatedCompletion : null,
    }
  }

  /**
   * Handle tool call execution
   */
  async function handleToolCall(tool: ClarityChatToolExecution): Promise<unknown> {
    // Store pending tool call
    pendingToolCalls.set(tool.id, tool)

    // Return placeholder - actual execution handled by parent
    return { id: tool.id, status: 'executing' }
  }

  /**
   * Approve tool execution
   */
  async function approveTool(toolId: string): Promise<void> {
    const tool = pendingToolCalls.get(toolId)
    if (tool) {
      tool.status = 'approved'
    }
  }

  /**
   * Reject tool execution
   */
  async function rejectTool(toolId: string, reason?: string): Promise<void> {
    const tool = pendingToolCalls.get(toolId)
    if (tool) {
      tool.status = 'rejected'
      tool.approvalReason = reason
    }
  }

  /**
   * Adapter capabilities
   */
  const capabilities: ClarityChatAdapterCapabilities = {
    streaming: true,
    tools: true,
    thinking: true,
    attachments: true,
    regeneration: true,
    history: retainHistory,
    multiModel: true,
    toolApproval: requireToolApproval,
  }

  // Create and return the adapter
  const baseAdapter = createBaseClarityChatAdapter('anthropic')

  return {
    ...baseAdapter,
    name: 'anthropic',
    sendMessage,
    streamMessage,
    stopGeneration,
    mapMessages,
    mapStreamStatus,
    handleToolCall,
    approveTool,
    rejectTool,
    mapToolCalls: mapToolCalls as (toolCalls: unknown[]) => ClarityChatToolExecution[],
    capabilities,
    dispose: () => {
      abortController?.abort()
      conversationHistory = []
      pendingToolCalls.clear()
    },
  }
}

/**
 * React hook for using Anthropic adapter with ClarityChatProvider
 *
 * @param config - Anthropic adapter configuration
 * @returns Configured adapter instance
 *
 * @example
 * ```tsx
 * import { useAnthropicAdapter } from '@/adapters/anthropic'
 * import { ClarityChatProvider } from '@/providers'
 *
 * export function App() {
 *   const adapter = useAnthropicAdapter({
 *     apiKey: process.env.ANTHROPIC_API_KEY,
 *     model: 'claude-3-5-sonnet-latest',
 *     thinkingEnabled: true,
 *     maxTokens: 2048,
 *   })
 *
 *   return (
 *     <ClarityChatProvider adapter={adapter}>
 *       <ChatComponent />
 *     </ClarityChatProvider>
 *   )
 * }
 * ```
 */
export function useAnthropicAdapter(
  config: AnthropicClarityChatAdapterConfig
): ClarityChatAdapter {
  // In a real React hook implementation, this would use React.useMemo
  // For now, we return a fresh adapter instance
  return createAnthropicAdapter(config)
}

