/**
 * ClarityToolResult Component
 * 
 * Renders tool execution results using registered UI components.
 * Falls back to default rendering if no component is registered for the tool.
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
 *   result={weatherData}
 *   messages={messages}
 * />
 * ```
 */

import * as React from 'react'
import type { CoreMessage } from '../hooks/use-chat-enhanced'
import type { ToolComponentRegistry, ToolComponentProps } from '../agents/tool-ui-registry'
import { Card, CardContent, CardHeader } from '@clarity-chat/primitives'

export interface ToolCall {
  /** Tool name */
  name: string
  
  /** Tool arguments */
  args?: Record<string, any>
  
  /** Tool call ID */
  id?: string
}

export interface ClarityToolResultProps {
  /** Registry of tool components */
  registry: ToolComponentRegistry
  
  /** Tool call information */
  toolCall: ToolCall
  
  /** Tool execution result */
  result: any
  
  /** All messages in conversation */
  messages: CoreMessage[]
  
  /** Fallback component if no registry match */
  fallback?: React.ComponentType<{ toolCall: ToolCall; result: any }>
  
  /** Additional props to pass to tool component */
  componentProps?: Record<string, any>
  
  /** Show tool name header */
  showHeader?: boolean
  
  /** Custom className */
  className?: string
}

/**
 * Default fallback component for unregistered tools
 */
function DefaultToolResult({ toolCall, result }: { toolCall: ToolCall; result: any }) {
  return (
    <Card className="mt-2">
      <CardHeader>
        <div className="text-sm font-semibold">Tool: {toolCall.name}</div>
      </CardHeader>
      <CardContent>
        <pre className="text-xs overflow-auto max-h-64 bg-muted p-2 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}

/**
 * Renders tool results using registered UI components
 */
export function ClarityToolResult({
  registry,
  toolCall,
  result,
  messages,
  fallback = DefaultToolResult,
  componentProps = {},
  showHeader = false,
  className,
}: ClarityToolResultProps) {
  const Component = registry[toolCall.name]

  if (!Component) {
    // No registered component, use fallback
    const FallbackComponent = fallback || DefaultToolResult
    return <FallbackComponent toolCall={toolCall} result={result} />
  }

  const props: ToolComponentProps = {
    data: result,
    messages,
    toolCall: {
      name: toolCall.name,
      args: toolCall.args || {},
    },
    ...componentProps,
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="text-xs text-muted-foreground mb-2">
          Tool: {toolCall.name}
        </div>
      )}
      <Component {...props} />
    </div>
  )
}
