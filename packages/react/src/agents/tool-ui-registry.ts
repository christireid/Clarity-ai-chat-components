/**
 * Tool UI Registry
 * 
 * Registry pattern for mapping tool names to React components that render
 * tool results in the chat interface.
 * 
 * @example
 * ```tsx
 * const registry = createToolUIRegistry({
 *   weather: WeatherResult,
 *   search: SearchResults,
 * })
 * ```
 */

import * as React from 'react'
import type { Message } from '@clarity-chat/types'

/**
 * Props for tool result components
 */
export interface ToolComponentProps<TData = any> {
  /** Tool execution result data */
  data: TData
  /** Current conversation messages */
  messages: Message[]
  /** Tool call metadata */
  toolCall?: {
    id: string
    name: string
    arguments: Record<string, any>
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
 * @param registry Object mapping tool names to components
 * @returns The registry (for type inference)
 * 
 * @example
 * ```tsx
 * const WeatherResult = ({ data }: ToolComponentProps<WeatherData>) => (
 *   <div>Temperature: {data.temp}°F</div>
 * )
 * 
 * const registry = createToolUIRegistry({
 *   weather: WeatherResult,
 * })
 * ```
 */
export function createToolUIRegistry<T extends ToolComponentRegistry>(
  registry: T
): T {
  return registry
}
