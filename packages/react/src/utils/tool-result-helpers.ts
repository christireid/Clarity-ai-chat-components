/**
 * Tool Result Helper Utilities
 * 
 * Utility functions for processing and working with tool results.
 */

import type { ExtractedToolResult } from '../hooks/use-clarity-chat-with-tools'
import type { ToolCall } from '../adapters/types'

/**
 * Group tool results by tool name
 */
export function groupToolResultsByToolName(
  toolResults: ExtractedToolResult[]
): Map<string, ExtractedToolResult[]> {
  const grouped = new Map<string, ExtractedToolResult[]>()
  
  toolResults.forEach((result) => {
    const toolName = result.toolCall.function.name
    const existing = grouped.get(toolName) || []
    grouped.set(toolName, [...existing, result])
  })
  
  return grouped
}

/**
 * Group tool results by message ID
 */
export function groupToolResultsByMessage(
  toolResults: ExtractedToolResult[]
): Map<string, ExtractedToolResult[]> {
  const grouped = new Map<string, ExtractedToolResult[]>()
  
  toolResults.forEach((result) => {
    const existing = grouped.get(result.messageId) || []
    grouped.set(result.messageId, [...existing, result])
  })
  
  return grouped
}

/**
 * Get the latest tool result for a specific tool
 */
export function getLatestToolResult(
  toolResults: ExtractedToolResult[],
  toolName: string
): ExtractedToolResult | undefined {
  const toolResultsForTool = toolResults
    .filter((tr) => tr.toolCall.function.name === toolName)
    .sort((a, b) => b.index - a.index)
  
  return toolResultsForTool[0]
}

/**
 * Get all tool results for a specific tool
 */
export function getToolResultsForTool(
  toolResults: ExtractedToolResult[],
  toolName: string
): ExtractedToolResult[] {
  return toolResults.filter((tr) => tr.toolCall.function.name === toolName)
}

/**
 * Check if a tool has been called
 */
export function hasToolBeenCalled(
  toolResults: ExtractedToolResult[],
  toolName: string
): boolean {
  return toolResults.some((tr) => tr.toolCall.function.name === toolName)
}

/**
 * Get unique tool names from results
 */
export function getUniqueToolNames(toolResults: ExtractedToolResult[]): string[] {
  const toolNames = new Set<string>()
  toolResults.forEach((tr) => {
    toolNames.add(tr.toolCall.function.name)
  })
  return Array.from(toolNames)
}

/**
 * Count tool calls by tool name
 */
export function countToolCallsByTool(
  toolResults: ExtractedToolResult[]
): Map<string, number> {
  const counts = new Map<string, number>()
  
  toolResults.forEach((result) => {
    const toolName = result.toolCall.function.name
    counts.set(toolName, (counts.get(toolName) || 0) + 1)
  })
  
  return counts
}

/**
 * Filter tool results by message ID
 */
export function filterToolResultsByMessage(
  toolResults: ExtractedToolResult[],
  messageId: string
): ExtractedToolResult[] {
  return toolResults.filter((tr) => tr.messageId === messageId)
}

/**
 * Check if tool result has an error
 */
export function hasToolError(result: ExtractedToolResult): boolean {
  return (
    result.result &&
    typeof result.result === 'object' &&
    'error' in result.result &&
    result.result.error !== null &&
    result.result.error !== undefined
  )
}

/**
 * Extract error message from tool result
 */
export function getToolError(result: ExtractedToolResult): string | null {
  if (!hasToolError(result)) {
    return null
  }
  
  const error = result.result.error
  return typeof error === 'string' ? error : String(error)
}

/**
 * Parse tool call arguments safely
 */
export function parseToolArguments(toolCall: ToolCall): Record<string, any> {
  try {
    return JSON.parse(toolCall.function.arguments)
  } catch {
    return {}
  }
}

/**
 * Format tool call for display
 */
export function formatToolCall(toolCall: ToolCall): string {
  const args = parseToolArguments(toolCall)
  const argsStr = Object.entries(args)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(', ')
  
  return `${toolCall.function.name}(${argsStr})`
}

/**
 * Get tool result summary
 */
export function getToolResultSummary(result: ExtractedToolResult): string {
  const toolName = result.toolCall.function.name
  const hasError = hasToolError(result)
  
  if (hasError) {
    const error = getToolError(result)
    return `${toolName} failed: ${error}`
  }
  
  if (result.result && typeof result.result === 'object') {
    // Try to extract a summary from common fields
    if ('summary' in result.result) {
      return String(result.result.summary)
    }
    if ('result' in result.result) {
      return String(result.result.result)
    }
    if ('output' in result.result) {
      return String(result.result.output)
    }
  }
  
  return `${toolName} completed successfully`
}
