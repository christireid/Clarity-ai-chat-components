'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  useStreamableUI,
  type StreamableValueLike,
  type UseStreamableUIOptions,
} from '../../hooks/streaming/use-streamable-ui'

export interface StreamBlockProps<T = React.ReactNode> {
  /** Source stream (StreamableValue, async iterable, promise, or readable stream) */
  source?:
    | StreamableValueLike<T>
    | AsyncIterable<T>
    | PromiseLike<T>
    | ReadableStream<T | Uint8Array | string>
    | null
  /** How incoming fragments should be accumulated */
  mode?: 'append' | 'replace'
  /** Render function for each streamed fragment */
  renderItem?: (item: T, index: number, items: T[]) => React.ReactNode
  /** Fallback when no streamed content is available */
  fallback?: React.ReactNode
  /** Error fallback rendered when streaming fails */
  errorFallback?: React.ReactNode | ((error: Error) => React.ReactNode)
  /** HTML element to render */
  as?: React.ElementType
  /** Additional class names */
  className?: string
  /** Spacing between streamed entries */
  spacing?: 'none' | 'compact' | 'relaxed'
  /** Whether to render a subtle live-indicator when streaming */
  showIndicator?: boolean
  /** Additional hook options (transform, completion detection, callbacks) */
  hookOptions?: Omit<UseStreamableUIOptions<T>, 'mode'>
}

const spacingMap: Record<NonNullable<StreamBlockProps['spacing']>, string> = {
  none: 'space-y-0',
  compact: 'space-y-2',
  relaxed: 'space-y-4',
}

const indicatorClass =
  'inline-flex h-2 w-2 rounded-full bg-primary/60 animate-pulse align-middle ml-2'

export function StreamBlock<T = React.ReactNode>({
  source = null,
  mode = 'append',
  renderItem,
  fallback = null,
  errorFallback,
  as,
  className,
  spacing = 'compact',
  showIndicator = true,
  hookOptions,
}: StreamBlockProps<T>) {
  // Type assertion to ComponentType that accepts children
  const Component = (as ?? 'div') as React.ComponentType<{
    className?: string
    'data-status'?: string
    'aria-live'?: 'polite' | 'assertive' | 'off'
    role?: string
    children?: React.ReactNode
  }>

  const { values, status, error } = useStreamableUI<T>(source ?? null, {
    mode,
    ...hookOptions,
  })

  const items = values

  const renderFragment = React.useCallback(
    (item: T, index: number) =>
      renderItem ? renderItem(item, index, items) : (item as React.ReactNode),
    [items, renderItem]
  )

  if (error && errorFallback) {
    const content =
      typeof errorFallback === 'function' ? errorFallback(error) : errorFallback
    return (
      <Component
        className={cn('clarity-stream-block flex flex-col', className)}
        data-status="error"
        aria-live="assertive"
      >
        {content}
      </Component>
    )
  }

  const hasContent = items.length > 0
  const spacingClass = spacingMap[spacing]

  return (
    <Component
      className={cn(
        'clarity-stream-block relative flex flex-col',
        spacingClass,
        className
      )}
      data-status={status}
      aria-live="polite"
      role={status === 'streaming' ? 'status' : undefined}
    >
      {hasContent
        ? items.map((item, index) => (
            <React.Fragment key={index}>
              {renderFragment(item, index)}
            </React.Fragment>
          ))
        : fallback}
      {showIndicator && status === 'streaming' && (
        <span className={indicatorClass} aria-hidden="true" />
      )}
    </Component>
  )
}
