/**
 * FlowToken Adapter
 *
 * Optional adapter for using FlowToken animations with Clarity Chat.
 * FlowToken provides specialized LLM streaming animations like fade,
 * blur-in, drop-in, typewriter, and more.
 *
 * @example
 * ```tsx
 * import { FlowTokenStreamingText } from '@clarity-chat/react'
 * // Note: Requires 'flowtoken' to be installed separately:
 * // npm install flowtoken
 *
 * <FlowTokenStreamingText
 *   content={streamingContent}
 *   isStreaming={isStreaming}
 *   animation="blur-in"
 * />
 * ```
 *
 * @see https://github.com/Ephibbs/flowtoken
 * @license MIT (flowtoken)
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// ============================================================================
// Types
// ============================================================================

// FlowToken component types (for when the optional package is installed)
interface FlowTokenStreamTextProps {
  content: string
  animation?: string | null
  smooth?: boolean
  smoothingWindow?: number
}

interface FlowTokenAnimatedMarkdownProps {
  content: string
  animation?: string | null
}

interface FlowTokenModule {
  StreamText: React.ComponentType<FlowTokenStreamTextProps>
  AnimatedMarkdown: React.ComponentType<FlowTokenAnimatedMarkdownProps>
}

// ============================================================================
// Types (Exports)
// ============================================================================

/**
 * FlowToken animation types
 */
export type FlowTokenAnimation =
  | 'fade'
  | 'blur-in'
  | 'drop-in'
  | 'slide-left'
  | 'typewriter'
  | 'word-pull-up'
  | 'flip'
  | 'gradual-spacing'
  | null // null to disable animations

export interface FlowTokenStreamingTextProps {
  /** The streaming text content */
  content: string
  /** Whether content is currently streaming */
  isStreaming?: boolean
  /** Animation type to use */
  animation?: FlowTokenAnimation
  /** Enable smoothing to reduce token generation fluctuations */
  smooth?: boolean
  /** Smoothing window size (for moving average) */
  smoothingWindow?: number
  /** Whether to render markdown */
  markdown?: boolean
  /** Additional CSS class */
  className?: string
  /** Callback when streaming completes */
  onComplete?: () => void
}

export interface FlowTokenMarkdownProps {
  /** The streaming markdown content */
  content: string
  /** Whether content is currently streaming */
  isStreaming?: boolean
  /** Animation type to use */
  animation?: FlowTokenAnimation
  /** Additional CSS class */
  className?: string
}

// ============================================================================
// Fallback Components (when flowtoken is not installed)
// ============================================================================

/**
 * Fallback streaming text component
 * Used when flowtoken package is not installed
 */
function FallbackStreamingText({
  content,
  isStreaming,
  className,
}: Pick<FlowTokenStreamingTextProps, 'content' | 'isStreaming' | 'className'>) {
  return (
    <div className={cn('whitespace-pre-wrap', className)}>
      {content}
      {isStreaming && (
        <span className="inline-block ml-1 animate-pulse">▋</span>
      )}
    </div>
  )
}

/**
 * Fallback markdown component
 * Used when flowtoken package is not installed
 */
function FallbackMarkdown({
  content,
  isStreaming,
  className,
}: Pick<FlowTokenMarkdownProps, 'content' | 'isStreaming' | 'className'>) {
  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-3xl mx-auto',
        className
      )}
    >
      <div className="whitespace-pre-wrap">
        {content}
        {isStreaming && (
          <span className="inline-block ml-1 animate-pulse">▋</span>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Dynamic Import Wrapper
// ============================================================================

/**
 * FlowTokenStreamingText - Streaming text with FlowToken animations
 *
 * This component attempts to use FlowToken for rich streaming animations.
 * If flowtoken is not installed, it falls back to a simple text display.
 *
 * To enable FlowToken animations, install the package:
 * ```bash
 * npm install flowtoken
 * ```
 */
export function FlowTokenStreamingText({
  content,
  isStreaming = false,
  animation = 'fade',
  smooth = true,
  smoothingWindow = 3,
  markdown = false,
  className,
  onComplete,
}: FlowTokenStreamingTextProps) {
  const [FlowTokenComponent, setFlowTokenComponent] =
    React.useState<React.ComponentType<any> | null>(null)
  const [loadError, setLoadError] = React.useState(false)

  // Attempt to dynamically import flowtoken (optional dependency)
  React.useEffect(() => {
    let mounted = true

    async function loadFlowToken() {
      try {
        // @ts-expect-error - flowtoken is an optional peer dependency
        const flowtoken = (await import('flowtoken')) as FlowTokenModule
        if (mounted) {
          setFlowTokenComponent(() =>
            markdown ? flowtoken.AnimatedMarkdown : flowtoken.StreamText
          )
        }
      } catch {
        if (mounted) {
          setLoadError(true)
          if (process.env.NODE_ENV === 'development') {
            console.info(
              '[Clarity Chat] FlowToken not installed. Using fallback streaming display. ' +
                'For enhanced animations, install: npm install flowtoken'
            )
          }
        }
      }
    }

    loadFlowToken()
    return () => {
      mounted = false
    }
  }, [markdown])

  // Handle streaming completion
  React.useEffect(() => {
    if (!isStreaming && content && onComplete) {
      onComplete()
    }
  }, [isStreaming, content, onComplete])

  // Use fallback if flowtoken is not available
  if (loadError || !FlowTokenComponent) {
    return markdown ? (
      <FallbackMarkdown
        content={content}
        isStreaming={isStreaming}
        className={className}
      />
    ) : (
      <FallbackStreamingText
        content={content}
        isStreaming={isStreaming}
        className={className}
      />
    )
  }

  // Render with FlowToken
  return (
    <div className={className}>
      <FlowTokenComponent
        content={content}
        animation={isStreaming ? animation : null}
        smooth={smooth}
        smoothingWindow={smoothingWindow}
      />
    </div>
  )
}

FlowTokenStreamingText.displayName = 'FlowTokenStreamingText'

/**
 * FlowTokenMarkdown - Streaming markdown with FlowToken animations
 *
 * Convenience wrapper for markdown content. Requires flowtoken to be installed.
 */
export function FlowTokenMarkdown({
  content,
  isStreaming = false,
  animation = 'fade',
  className,
}: FlowTokenMarkdownProps) {
  return (
    <FlowTokenStreamingText
      content={content}
      isStreaming={isStreaming}
      animation={animation}
      markdown={true}
      className={className}
    />
  )
}

FlowTokenMarkdown.displayName = 'FlowTokenMarkdown'

// ============================================================================
// Hook for programmatic FlowToken usage
// ============================================================================

export interface UseFlowTokenOptions {
  /** Animation type */
  animation?: FlowTokenAnimation
  /** Enable smoothing */
  smooth?: boolean
  /** Smoothing window size */
  smoothingWindow?: number
}

export interface UseFlowTokenReturn {
  /** Whether FlowToken is available */
  isAvailable: boolean
  /** Whether FlowToken is loading */
  isLoading: boolean
  /** The FlowToken components (if available) */
  components: {
    StreamText: React.ComponentType<any> | null
    AnimatedMarkdown: React.ComponentType<any> | null
  }
}

/**
 * Hook to check FlowToken availability and get components
 */
export function useFlowToken(): UseFlowTokenReturn {
  const [isLoading, setIsLoading] = React.useState(true)
  const [components, setComponents] = React.useState<
    UseFlowTokenReturn['components']
  >({
    StreamText: null,
    AnimatedMarkdown: null,
  })

  React.useEffect(() => {
    let mounted = true

    async function loadFlowToken() {
      try {
        // @ts-expect-error - flowtoken is an optional peer dependency
        const flowtoken = (await import('flowtoken')) as FlowTokenModule
        if (mounted) {
          setComponents({
            StreamText: flowtoken.StreamText,
            AnimatedMarkdown: flowtoken.AnimatedMarkdown,
          })
        }
      } catch {
        // FlowToken not available
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadFlowToken()
    return () => {
      mounted = false
    }
  }, [])

  return {
    isAvailable: components.StreamText !== null,
    isLoading,
    components,
  }
}
