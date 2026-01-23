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
import DOMPurify from 'isomorphic-dompurify'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'
import type {
  ToolComponentRegistry,
  ToolComponentProps,
} from '../../agents/tool-ui-registry'
import { Card, CardContent, CardHeader } from '@clarity-chat/primitives'
import { EnhancedErrorBoundary as ErrorBoundary } from '@clarity-chat/error-handling'
import { escapeHtml } from '../../utils/security/sanitize-html'

/**
 * Tool call interface for ClarityToolResult
 * (Renamed to avoid conflict with adapter ToolCall)
 */
export interface ClarityToolCall {
  /** Tool name */
  name: string

  /** Tool arguments */
  args?: Record<string, unknown>

  /** Tool call ID */
  id?: string
}

export interface ClarityToolResultProps {
  /** Registry of tool components */
  registry: ToolComponentRegistry

  /** Tool call information */
  toolCall: ClarityToolCall

  /** Tool execution result */
  result: unknown

  /** All messages in conversation */
  messages: CoreMessage[]

  /** Fallback component if no registry match */
  fallback?: React.ComponentType<{ toolCall: ClarityToolCall; result: unknown }>

  /** Additional props to pass to tool component */
  componentProps?: Record<string, unknown>

  /** Show tool name header */
  showHeader?: boolean

  /** Custom className */
  className?: string

  /** Enable error boundary for tool components (default: true) */
  enableErrorBoundary?: boolean

  /** Custom error fallback component */
  errorFallback?: React.ComponentType<{
    error: Error
    toolCall: ClarityToolCall
  }>
}

/**
 * Default fallback component for unregistered tools
 */
function DefaultToolResult({
  toolCall,
  result,
}: {
  toolCall: ClarityToolCall
  result: unknown
}) {
  // FIX: TOOL-011 - Escape tool name to prevent XSS
  const escapedName = escapeHtml(toolCall.name)

  // FIX: TOOL-011 - Sanitize result if it's a string
  const sanitizedResult =
    typeof result === 'string'
      ? DOMPurify.sanitize(result)
      : JSON.stringify(result, null, 2)

  return (
    <Card className="mt-2">
      <CardHeader>
        <h4
          className="text-sm font-semibold"
          dangerouslySetInnerHTML={{ __html: `Tool: ${escapedName}` }}
        />
      </CardHeader>
      <CardContent>
        <pre className="text-xs overflow-auto max-h-64 bg-muted p-2 rounded">
          {sanitizedResult}
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
  enableErrorBoundary,
  errorFallback,
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

  const ToolComponentWrapper = () => (
    <>
      {showHeader && (
        <div className="text-xs text-muted-foreground mb-2">
          Tool: {toolCall.name}
        </div>
      )}
      <Component {...props} />
    </>
  )

  // Wrap in error boundary if enabled (default: true)
  if (enableErrorBoundary !== false) {
    const ErrorFallback =
      errorFallback ||
      (({ error, toolCall }: { error: Error; toolCall: ClarityToolCall }) => (
        <Card className="mt-2 border-destructive/20 bg-destructive/5">
          <CardHeader>
            <div className="text-sm font-semibold text-destructive">
              Error rendering tool: {toolCall.name}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {escapeHtml(error.message)}
            </p>
            <pre className="text-xs overflow-auto max-h-32 bg-muted p-2 rounded mt-2">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ))

    return (
      <div className={className}>
        <ErrorBoundary
          fallback={(error, resetError) => (
            <ErrorFallback error={error} toolCall={toolCall} />
          )}
          resetKeys={[toolCall.id ?? toolCall.name, toolCall.name]}
        >
          <ToolComponentWrapper />
        </ErrorBoundary>
      </div>
    )
  }

  return (
    <div className={className}>
      <ToolComponentWrapper />
    </div>
  )
}
