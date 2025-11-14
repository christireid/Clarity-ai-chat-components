/**
 * useClarityChatWithTools Hook
 * 
 * Combines useClarityChat with tool UI registry for seamless tool result rendering.
 * Automatically extracts tool calls from messages and renders them using registered components.
 * 
 * @example
 * ```tsx
 * const registry = createToolUIRegistry({
 *   weather: WeatherComponent,
 *   search: SearchComponent,
 * })
 * 
 * const { chat, toolResults } = useClarityChatWithTools({
 *   api: '/api/chat',
 *   toolRegistry: registry,
 * })
 * ```
 */

import * as React from 'react'
import { useClarityChat, type UseClarityChatOptions, type UseClarityChatReturn } from './use-clarity-chat'
import type { ToolComponentRegistry } from '../agents/tool-ui-registry'
import type { ToolCall } from '../adapters/types'
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
 * Return type for useClarityChatWithTools
 */
export interface UseClarityChatWithToolsReturn extends UseClarityChatReturn {
  /** Extracted tool results from messages */
  toolResults: ExtractedToolResult[]
  /** Get tool results for a specific message */
  getToolResultsForMessage: (messageId: string) => ExtractedToolResult[]
}

/**
 * Extract tool calls and results from CoreMessage array
 */
function extractToolResults(messages: CoreMessage[]): ExtractedToolResult[] {
  const results: ExtractedToolResult[] = []
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    
    // Check if message has tool calls
    if (message.role === 'assistant' && message.toolInvocations) {
      for (let j = 0; j < message.toolInvocations.length; j++) {
        const invocation = message.toolInvocations[j]
        
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
