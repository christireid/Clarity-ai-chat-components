/**
 * Tool Result Extractor Utilities
 *
 * Utilities for extracting tool calls and results from chat messages
 * for use with ClarityToolResult component.
 */

import type { Message } from '@clarity-chat/types'
import type { ToolCall } from '../../adapters/types'

/**
 * Extract tool calls and results from messages
 *
 * Looks for tool invocations in message metadata and constructs
 * ToolCall objects for rendering with ClarityToolResult.
 *
 * @param messages Array of chat messages
 * @returns Array of tool calls with their results
 *
 * @example
 * ```tsx
 * const { messages } = useClarityChat({ api: '/api/chat' })
 * const toolResults = extractToolResults(messages)
 *
 * {toolResults.map(({ toolCall, result }) => (
 *   <ClarityToolResult
 *     registry={registry}
 *     toolCall={toolCall}
 *     result={result}
 *     messages={messages}
 *   />
 * ))}
 * ```
 */
export function extractToolResults(messages: Message[]): Array<{
  toolCall: ToolCall
  result: any
}> {
  const toolResults: Array<{ toolCall: ToolCall; result: any }> = []

  for (const message of messages) {
    // Check for tool invocations in metadata (from CoreMessage.toolInvocations)
    if (message.metadata?.['toolInvocations']) {
      const invocations = message.metadata['toolInvocations']

      if (Array.isArray(invocations)) {
        for (const invocation of invocations) {
          // Only include completed tool calls with results
          if (
            invocation.toolCallId &&
            invocation.state === 'result' &&
            invocation.result !== undefined
          ) {
            const toolCall: ToolCall = {
              id: invocation.toolCallId,
              type: 'function',
              function: {
                name: invocation.toolName || 'unknown',
                arguments: JSON.stringify(invocation.args || {}),
              },
            }

            toolResults.push({
              toolCall,
              result: invocation.result,
            })
          }
        }
      }
    }

    // Also check for tool calls in message metadata (direct tool call)
    if (message.metadata?.['toolCallId'] && message.metadata?.['name']) {
      const toolCallId = message.metadata['toolCallId']
      const toolName = message.metadata['name']

      // Ensure we have string values
      if (typeof toolCallId !== 'string' || typeof toolName !== 'string') {
        continue
      }

      const toolCall: ToolCall = {
        id: toolCallId,
        type: 'function',
        function: {
          name: toolName,
          arguments: JSON.stringify(message.metadata['args'] || {}),
        },
      }

      // Try to extract result from metadata or content
      let result = message.metadata['result']
      if (!result && message.content) {
        try {
          result = JSON.parse(message.content)
        } catch {
          // Content is not JSON, use as-is
          result = message.content
        }
      }

      if (result) {
        toolResults.push({ toolCall, result })
      }
    }
  }

  return toolResults
}

/**
 * Extract tool results for a specific tool name
 *
 * @param messages Array of chat messages
 * @param toolName Name of the tool to filter by
 * @returns Array of tool calls with their results for the specified tool
 */
export function extractToolResultsByName(
  messages: Message[],
  toolName: string
): Array<{ toolCall: ToolCall; result: any }> {
  return extractToolResults(messages).filter(
    ({ toolCall }) => toolCall.function?.name === toolName
  )
}

/**
 * Get the latest tool result for a specific tool
 *
 * @param messages Array of chat messages
 * @param toolName Name of the tool
 * @returns Latest tool result or null
 */
export function getLatestToolResult(
  messages: Message[],
  toolName: string
): { toolCall: ToolCall; result: any } | null {
  const results = extractToolResultsByName(messages, toolName)
  const lastResult = results[results.length - 1]
  return lastResult ?? null
}
