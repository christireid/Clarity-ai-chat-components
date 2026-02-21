'use client'

import React from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

/**
 * GenerativeUI Component
 *
 * Renders dynamic UI for AI tool results with status handling.
 * Inspired by CopilotKit and assistant-ui Generative UI patterns.
 *
 * @example
 * ```tsx
 * <GenerativeUI
 *   toolName="get_weather"
 *   status="completed"
 *   args={{ location: 'San Francisco' }}
 *   result={{ temp: 72, condition: 'sunny' }}
 *   render={({ status, args, result }) => (
 *     status === 'completed' ? <WeatherCard {...result} /> : <LoadingSkeleton />
 *   )}
 * />
 * ```
 */

export type GenerativeUIStatus =
  | 'pending'
  | 'executing'
  | 'completed'
  | 'error'
  | 'approval_required'

export interface GenerativeUIProps<
  TArgs = Record<string, unknown>,
  TResult = unknown,
> {
  /** Tool/function name */
  toolName: string
  /** Current execution status */
  status: GenerativeUIStatus
  /** Tool arguments/parameters */
  args?: TArgs
  /** Tool execution result */
  result?: TResult
  /** Error message if status is 'error' */
  error?: string
  /** Custom render function */
  render?: (context: {
    status: GenerativeUIStatus
    args?: TArgs
    result?: TResult
    error?: string
  }) => React.ReactNode
  /** Fallback component for loading state */
  loadingFallback?: React.ReactNode
  /** Fallback component for error state */
  errorFallback?: React.ReactNode
  /** Whether to show the tool name header */
  showHeader?: boolean
  /** Additional CSS classes */
  className?: string
  /** Pass Through API for styling */
  pt?: {
    root?: React.HTMLAttributes<HTMLDivElement>
    header?: React.HTMLAttributes<HTMLDivElement>
    content?: React.HTMLAttributes<HTMLDivElement>
    status?: React.HTMLAttributes<HTMLSpanElement>
  }
}

const statusConfig: Record<
  GenerativeUIStatus,
  { icon: React.ReactNode; label: string; className: string }
> = {
  pending: {
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    label: 'Pending',
    className: 'text-muted-foreground',
  },
  executing: {
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    label: 'Executing',
    className: 'text-blue-600 dark:text-blue-400',
  },
  completed: {
    icon: <CheckCircle2 className="h-3 w-3" />,
    label: 'Completed',
    className: 'text-green-600 dark:text-green-400',
  },
  error: {
    icon: <AlertCircle className="h-3 w-3" />,
    label: 'Error',
    className: 'text-red-600 dark:text-red-400',
  },
  approval_required: {
    icon: <AlertCircle className="h-3 w-3" />,
    label: 'Approval Required',
    className: 'text-amber-600 dark:text-amber-400',
  },
}

// Default loading skeleton
function DefaultLoadingSkeleton() {
  return (
    <div className="space-y-2 p-4">
      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
      <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
    </div>
  )
}

// Default error component
function DefaultErrorComponent({ error }: { error?: string }) {
  return (
    <div className="flex items-start gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400">
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">Tool execution failed</p>
        {error && <p className="text-sm mt-1 opacity-80">{error}</p>}
      </div>
    </div>
  )
}

export function GenerativeUI<
  TArgs = Record<string, unknown>,
  TResult = unknown,
>({
  toolName,
  status,
  args,
  result,
  error,
  render,
  loadingFallback,
  errorFallback,
  showHeader = true,
  className = '',
  pt = {},
}: GenerativeUIProps<TArgs, TResult>) {
  const statusInfo = statusConfig[status]

  // Format tool name for display
  const formatToolName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Render content based on status and render function
  const renderContent = () => {
    // If custom render function provided, use it
    if (render) {
      return render({ status, args, result, error })
    }

    // Default rendering based on status
    switch (status) {
      case 'pending':
      case 'executing':
        return loadingFallback || <DefaultLoadingSkeleton />

      case 'error':
        return errorFallback || <DefaultErrorComponent error={error} />

      case 'approval_required':
        return (
          <div className="p-4 text-center text-muted-foreground">
            <p>This tool requires approval before execution.</p>
          </div>
        )

      case 'completed':
        // If no render function and completed, show result as JSON
        if (result !== undefined) {
          return (
            <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto">
              <code>{JSON.stringify(result, null, 2)}</code>
            </pre>
          )
        }
        return (
          <div className="p-4 text-center text-muted-foreground">
            Tool completed successfully.
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={`rounded-lg border border-border overflow-hidden ${className}`}
      role="region"
      aria-label={`Tool result: ${toolName}`}
      {...pt.root}
    >
      {/* Header */}
      {showHeader && (
        <div
          className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border"
          {...pt.header}
        >
          <span className="text-sm font-medium">
            {formatToolName(toolName)}
          </span>
          <span
            className={`flex items-center gap-1 text-xs ${statusInfo.className}`}
            {...pt.status}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>
      )}

      {/* Content */}
      <div {...pt.content}>{renderContent()}</div>
    </div>
  )
}

// Pre-built renderers for common tool types

/**
 * WeatherRenderer - Pre-built renderer for weather tool results
 */
export function WeatherRenderer({
  location,
  temperature,
  condition,
  humidity,
  windSpeed,
}: {
  location: string
  temperature: number
  condition: string
  humidity?: number
  windSpeed?: number
}) {
  const conditionIcons: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    stormy: '⛈️',
    windy: '💨',
    clear: '🌙',
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">{location}</p>
          <p className="text-sm text-muted-foreground capitalize">
            {condition}
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl">
            {conditionIcons[condition.toLowerCase()] || '🌡️'}
          </span>
          <p className="text-2xl font-bold">{temperature}°</p>
        </div>
      </div>
      {(humidity !== undefined || windSpeed !== undefined) && (
        <div className="flex gap-4 mt-3 pt-3 border-t border-border">
          {humidity !== undefined && (
            <div className="text-sm">
              <span className="text-muted-foreground">Humidity:</span>{' '}
              <span className="font-medium">{humidity}%</span>
            </div>
          )}
          {windSpeed !== undefined && (
            <div className="text-sm">
              <span className="text-muted-foreground">Wind:</span>{' '}
              <span className="font-medium">{windSpeed} mph</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * SearchResultsRenderer - Pre-built renderer for search results
 */
export function SearchResultsRenderer({
  results,
  query,
}: {
  results: Array<{ title: string; url: string; snippet: string }>
  query: string
}) {
  return (
    <div className="p-4 space-y-3">
      <p className="text-sm text-muted-foreground">
        Found {results.length} results for &quot;{query}&quot;
      </p>
      {results.map((result, index) => (
        <div key={index} className="border-b border-border pb-3 last:border-0">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {result.title}
          </a>
          <p className="text-sm text-muted-foreground mt-1">{result.snippet}</p>
        </div>
      ))}
    </div>
  )
}

export default GenerativeUI
