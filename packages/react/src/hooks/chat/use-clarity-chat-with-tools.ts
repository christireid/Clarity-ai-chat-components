/**
 * useClarityChatWithTools - Mid-Level Tool Integration Hook
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Tools & Agents
 *
 * Combines useClarityChat with tool UI registry for seamless tool result rendering.
 * Automatically extracts tool calls from messages and renders them using registered components.
 *
 * For structured output without chat, use top-level `useClarityObject` instead.
 * For raw tool handling, use low-level tool utilities.
 *
 * @param options - Configuration options
 * @param options.api - API endpoint URL (required, passed to useClarityChat)
 * @param options.toolRegistry - Tool UI registry for rendering tool results (required)
 * @param options.autoExtractTools - Whether to automatically extract tool results (default: true)
 * @returns Chat state with tool results and helper methods
 *
 * @example
 * ```tsx
 * import { createToolUIRegistry } from '@clarity-chat/react'
 *
 * const registry = createToolUIRegistry({
 *   weather: WeatherComponent,
 *   search: SearchComponent,
 * })
 *
 * const { messages, toolResults, isLoading } = useClarityChatWithTools({
 *   api: '/api/chat',
 *   toolRegistry: registry,
 * })
 *
 * // Render tool results
 * {toolResults.map((result) => {
 *   const Component = registry.get(result.toolCall.function.name)
 *   return Component ? <Component result={result.result} /> : null
 * })}
 * ```
 *
 * @throws {Error} If API endpoint or toolRegistry is invalid or missing
 */

'use client'

import * as React from 'react'
import {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from '../use-clarity-chat'
import type { ToolComponentRegistry } from '../../agents/tool-ui-registry'
import type { ToolCall } from '../../adapters/types'
import type { CoreMessage } from './use-chat-enhanced'

/**
 * Tool result extracted from messages
 */
export interface ExtractedToolResult {
  /** Tool call information */
  toolCall: ToolCall
  /** Tool execution result */
  result: any
  /** Message ID this tool result belongs to */
  messageId: string
  /** Index in the message's tool calls array */
  index: number
}

/**
 * Options for useClarityChatWithTools
 */
export interface UseClarityChatWithToolsOptions extends UseClarityChatOptions {
  /** Tool UI registry for rendering tool results */
  toolRegistry: ToolComponentRegistry
  /** Whether to automatically extract tool results from messages */
  autoExtractTools?: boolean
}

/**
 * Return type for useClarityChatWithTools (mid-level API)
 *
 * Extends UseClarityChatReturn with tool-specific additions:
 * - Data: `toolResults` (extracted tool results)
 * - Actions: `getToolResultsForMessage` (utility method)
 */
export interface UseClarityChatWithToolsReturn extends UseClarityChatReturn {
  /** Extracted tool results from messages (data) */
  toolResults: ExtractedToolResult[]

  /** Get tool results for a specific message (action) */
  getToolResultsForMessage: (messageId: string) => ExtractedToolResult[]
}

/**
 * Extract tool calls and results from CoreMessage array
 */
function extractToolResults(messages: CoreMessage[]): ExtractedToolResult[] {
  const results: ExtractedToolResult[] = []

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    if (!message) continue

    // Check if message has tool calls
    if (message.role === 'assistant' && message.toolInvocations) {
      for (let j = 0; j < message.toolInvocations.length; j++) {
        const invocation = message.toolInvocations[j]
        if (!invocation) continue

        // Look for tool result in subsequent messages
        if (invocation.state === 'result' && invocation.result !== undefined) {
          // Convert tool invocation to ToolCall format
          const toolCall: ToolCall = {
            id: invocation.toolCallId,
            type: 'function',
            function: {
              name: invocation.toolName,
              arguments: JSON.stringify(invocation.args),
            },
          }

          results.push({
            toolCall,
            result: invocation.result,
            messageId: message.id || `msg-${i}`,
            index: j,
          })
        }
      }
    }

    // Also check for toolCalls property (alternative format)
    if (message.role === 'assistant' && (message as any).toolCalls) {
      const toolCalls = (message as any).toolCalls as ToolCall[]
      const nextMessage = messages[i + 1]

      if (nextMessage && nextMessage.role === 'function') {
        toolCalls.forEach((toolCall, idx) => {
          results.push({
            toolCall,
            result: (nextMessage as any).functionResult || nextMessage.content,
            messageId: message.id || `msg-${i}`,
            index: idx,
          })
        })
      }
    }
  }

  return results
}

/**
 * useClarityChatWithTools hook
 *
 * Combines useClarityChat with automatic tool result extraction and rendering.
 */
export function useClarityChatWithTools(
  options: UseClarityChatWithToolsOptions
): UseClarityChatWithToolsReturn {
  // Validate required options
  if (!options.toolRegistry) {
    throw new Error(
      'useClarityChatWithTools: "toolRegistry" option is required.\n' +
        'Please provide a tool UI registry.\n\n' +
        'Example:\n' +
        '  import { createToolUIRegistry } from "@clarity-chat/react"\n' +
        '  const registry = createToolUIRegistry({ weather: WeatherComponent })\n' +
        '  const { toolResults } = useClarityChatWithTools({ api: "/api/chat", toolRegistry: registry })\n\n' +
        'For more help, see: https://clarity-chat.dev/docs/tools'
    )
  }

  const { toolRegistry, autoExtractTools = true, ...chatOptions } = options

  const chat = useClarityChat(chatOptions)

  // Extract tool results from messages
  const toolResults = React.useMemo(() => {
    if (!autoExtractTools) {
      return []
    }
    return extractToolResults(chat.messages)
  }, [chat.messages, autoExtractTools])

  // Get tool results for a specific message
  const getToolResultsForMessage = React.useCallback(
    (messageId: string): ExtractedToolResult[] => {
      return toolResults.filter((tr) => tr.messageId === messageId)
    },
    [toolResults]
  )

  return {
    ...chat,
    toolResults,
    getToolResultsForMessage,
  }
}
