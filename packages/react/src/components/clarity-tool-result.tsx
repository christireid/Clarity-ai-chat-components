/**
 * ClarityToolResult Component
 * 
 * Renders tool execution results using registered UI components.
 * Maps tool names to React components via a registry pattern.
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
 *   result={toolResult}
 *   messages={messages}
 * />
 * ```
 */

import * as React from 'react'
import type { ToolComponentRegistry } from '../agents/tool-ui-registry'
import type { Message } from '@clarity-chat/types'
import type { ToolCall } from '../adapters/types'
// Note: @clarity-chat/types is a workspace package - imports will resolve at build time

export interface ClarityToolResultProps {
  /** Registry mapping tool names to components */
  registry: ToolComponentRegistry
  /** Tool call information */
  toolCall: ToolCall
  /** Tool execution result */
  result: any
  /** Current conversation messages */
  messages: Message[]
  /** Additional CSS class */
  className?: string
}

/**
 * ClarityToolResult - Render tool results using registered components
 * 
 * Looks up the tool name in the registry and renders the corresponding
 * component with the tool result data.
 */
export function ClarityToolResult({
  registry,
  toolCall,
  result,
  messages,
  className,
}: ClarityToolResultProps) {
  // Extract tool name from tool call
  const toolName = toolCall.function?.name || toolCall.function?.name || ''
  
  // Get component from registry
  const Component = registry[toolName]
  
  if (!Component) {
    // Fallback: render raw JSON if no component registered
    return (
      <div className={className}>
        <details className="rounded-lg border p-4">
          <summary className="cursor-pointer font-medium">
            Tool Result: {toolName}
          </summary>
          <pre className="mt-2 overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      </div>
    )
  }

  // Parse tool arguments if available
  let parsedArgs: Record<string, any> = {}
  try {
    if (toolCall.function?.arguments) {
      parsedArgs = typeof toolCall.function.arguments === 'string'
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments
    }
  } catch {
    // Ignore parse errors
  }

  // Render registered component
  return (
    <div className={className}>
      <Component
        data={result}
        messages={messages}
        toolCall={{
          id: toolCall.id,
          name: toolName,
          arguments: parsedArgs,
        }}
      />
    </div>
  )
}
