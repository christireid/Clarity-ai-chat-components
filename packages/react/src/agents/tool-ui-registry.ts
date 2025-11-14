/**
 * Tool UI Registry
 * 
 * Registry pattern for mapping tool names to React components that render
 * tool results in a user-friendly way.
 * 
 * @example
 * ```tsx
 * const registry = createToolUIRegistry({
 *   weather: WeatherResult,
 *   search: SearchResults,
 * })
 * 
 * <ClarityToolResult
 *   registry={registry}
 *   toolCall={toolCall}
 *   result={result}
 *   messages={messages}
 * />
 * ```
 */

import * as React from 'react'
import type { CoreMessage } from '../hooks/use-chat-enhanced'

/**
 * Props for tool result components
 */
export interface ToolComponentProps<TData = any> {
  /** Tool execution result data */
  data: TData
  
  /** All messages in the conversation */
  messages: CoreMessage[]
  
  /** Tool call metadata (optional) */
  toolCall?: {
    name: string
    args: Record<string, any>
  }
}

/**
 * Registry mapping tool names to React components
 */
export type ToolComponentRegistry = {
  [toolName: string]: React.ComponentType<ToolComponentProps<any>>
}

/**
 * Create a type-safe tool UI registry
 * 
 * @param registry - Object mapping tool names to components
 * @returns The registry (for type inference)
 */
export function createToolUIRegistry<T extends ToolComponentRegistry>(
  registry: T
): T {
  return registry
}

/**
 * Get component for a tool from registry
 */
export function getToolComponent(
  registry: ToolComponentRegistry,
  toolName: string
): React.ComponentType<ToolComponentProps<any>> | undefined {
  return registry[toolName]
}

/**
 * Check if a tool has a registered component
 */
export function hasToolComponent(
  registry: ToolComponentRegistry,
  toolName: string
): boolean {
  return toolName in registry && registry[toolName] !== undefined
}
