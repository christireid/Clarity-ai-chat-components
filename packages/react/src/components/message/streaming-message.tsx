/**
 * Streaming Message Component
 *
 * Displays AI responses with support for:
 * - Token-by-token streaming
 * - Partial JSON rendering
 * - Tool call visualization
 * - Thinking steps
 * - Citations
 * - Error states
 *
 * @enhanced Framer Motion 12: Optimized streaming animations
 * - Smoother cursor pulse with spring physics
 * - Better error entrance with spring damping
 * - Improved tool call animations
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import type { ToolCall, Citation } from '../../adapters/types'
import { DURATION_SECONDS } from '../../animations/constants'

export interface StreamingMessageProps {
  /** Accumulated message content */
  content: string
  /** Whether streaming is in progress */
  isStreaming?: boolean
  /** Tool calls made during streaming */
  toolCalls?: ToolCall[]
  /** Citations/sources */
  citations?: Citation[]
  /** Thinking steps (chain-of-thought) */
  thinkingSteps?: string[]
  /** Current thinking step being processed */
  currentThinkingStep?: string
  /** Error message if streaming failed */
  error?: string
  /** Show thinking steps */
  showThinking?: boolean
  /** Show citations inline */
  showCitations?: boolean
  /** Show tool calls */
  showTools?: boolean
  /** Callback when tool needs approval */
  onToolApprove?: (toolCall: ToolCall) => void
  /** Callback when tool is rejected */
  onToolReject?: (toolCall: ToolCall) => void
  /** Callback when retry is requested after an error */
  onRetry?: () => void
  /** Additional CSS class */
  className?: string
  /**
   * Enable smooth text streaming animation (2024 trend)
   * Instead of showing text in chunks as received, this buffers content
   * and renders at a consistent, readable pace for a polished UX.
   * @default false
   */
  smoothStreaming?: boolean
  /**
   * Speed for smooth streaming (characters per second)
   * @default 'normal'
   */
  streamingSpeed?: 'fast' | 'normal' | 'slow'
}

/**
 * Parse partial JSON safely, attempting to extract complete JSON objects
 * from potentially incomplete strings during streaming.
 *
 * @param text - The text to parse
 * @returns Object with parsed JSON (if found) and remainder text
 */
function parsePartialJSON(text: string): {
  parsed: unknown
  remainder: string
} {
  try {
    const parsed = JSON.parse(text)
    return { parsed, remainder: '' }
  } catch {
    // Try to find the last complete JSON object
    let lastBrace = text.lastIndexOf('}')
    while (lastBrace > 0) {
      try {
        const candidate = text.slice(0, lastBrace + 1)
        const parsed = JSON.parse(candidate)
        return { parsed, remainder: text.slice(lastBrace + 1) }
      } catch {
        lastBrace = text.lastIndexOf('}', lastBrace - 1)
      }
    }
    return { parsed: null, remainder: text }
  }
}

/**
 * Streaming cursor component for indicating active streaming
 */
const StreamingCursor = React.memo(function StreamingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{
        // Framer Motion 12: Smoother pulse using spring
        type: 'spring',
        damping: 15,
        stiffness: 100,
        repeat: Infinity,
      }}
      className="inline-block ml-1"
      aria-hidden="true"
    >
      ▋
    </motion.span>
  )
})

StreamingCursor.displayName = 'StreamingCursor'

/**
 * Error display component with optional retry button
 */
const ErrorDisplay = React.memo(function ErrorDisplay({
  error,
  onRetry,
}: {
  error: string
  onRetry?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        // Framer Motion 12: Spring entrance for errors
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
      className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 shadow-xs"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">Error</h4>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
              aria-label="Retry failed request"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try again
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
})

ErrorDisplay.displayName = 'ErrorDisplay'

/**
 * Thinking steps display component
 */
const ThinkingSteps = React.memo(function ThinkingSteps({
  thinkingSteps,
  currentThinkingStep,
}: {
  thinkingSteps: string[]
  currentThinkingStep?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-info/5 border border-info/20 rounded-lg p-4 shadow-xs"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-[hsl(var(--info))] animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold text-foreground">Thinking...</h4>
          {thinkingSteps.map((step, index) => (
            <motion.div
              key={`step-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-sm text-muted-foreground flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 text-[hsl(var(--success))]"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {step}
            </motion.div>
          ))}
          {currentThinkingStep && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground flex items-center gap-2"
            >
              <div
                className="w-4 h-4 border-2 border-[hsl(var(--info))] border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
              {currentThinkingStep}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
})

ThinkingSteps.displayName = 'ThinkingSteps'

/**
 * Tool call display component
 */
const ToolCallItem = React.memo(function ToolCallItem({
  tool,
  onToolApprove,
  onToolReject,
}: {
  tool: ToolCall
  onToolApprove?: (toolCall: ToolCall) => void
  onToolReject?: (toolCall: ToolCall) => void
}) {
  const handleApprove = React.useCallback(() => {
    onToolApprove?.(tool)
  }, [tool, onToolApprove])

  const handleReject = React.useCallback(() => {
    onToolReject?.(tool)
  }, [tool, onToolReject])

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="bg-accent/50 border rounded-lg p-4 shadow-xs"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-xs ring-1 ring-primary/20">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-foreground">
              {tool.function.name}
            </h4>
            <Badge variant="info">Tool Call</Badge>
          </div>
          <pre className="bg-muted/50 border p-3 rounded-lg text-sm overflow-x-auto">
            <code className="text-foreground font-mono">
              {tool.function.arguments}
            </code>
          </pre>
        </div>
        {(onToolApprove || onToolReject) && (
          <div className="flex gap-2 flex-shrink-0">
            {onToolApprove && (
              <Button size="sm" onClick={handleApprove}>
                Approve
              </Button>
            )}
            {onToolReject && (
              <Button size="sm" variant="outline" onClick={handleReject}>
                Reject
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
})

ToolCallItem.displayName = 'ToolCallItem'

/**
 * Citation item component
 */
const CitationItem = React.memo(function CitationItem({
  citation,
  index,
}: {
  citation: Citation
  index: number
}) {
  const confidenceVariant = React.useMemo(() => {
    if (citation.confidence === undefined) return 'secondary'
    if (citation.confidence >= 0.9) return 'success'
    if (citation.confidence >= 0.7) return 'info'
    return 'warning'
  }, [citation.confidence])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05 }}
      className="bg-muted/50 border rounded-lg p-3 shadow-xs hover:shadow-md hover:-translate-y-px transition-all duration-150 ease-out cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)] ring-1 ring-primary/20">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h5 className="font-semibold text-foreground truncate">
              {citation.source}
            </h5>
            {citation.confidence !== undefined && (
              <Badge variant={confidenceVariant}>
                {Math.round(citation.confidence * 100)}%
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {citation.chunkText}
          </p>
        </div>
      </div>
    </motion.div>
  )
})

CitationItem.displayName = 'CitationItem'

/**
 * Smooth streaming speed configuration (characters per second)
 */
const STREAMING_SPEEDS = {
  fast: 120, // ~7200 chars/min - very fast, snappy
  normal: 80, // ~4800 chars/min - comfortable reading pace
  slow: 50, // ~3000 chars/min - deliberate, thoughtful
} as const

/**
 * Hook for smooth text streaming animation
 * Buffers incoming content and releases it at a consistent pace
 */
function useSmoothStreaming(
  content: string,
  isStreaming: boolean,
  enabled: boolean,
  speed: keyof typeof STREAMING_SPEEDS = 'normal'
) {
  const [displayedContent, setDisplayedContent] = React.useState('')
  const targetContentRef = React.useRef(content)
  const animationFrameRef = React.useRef<number | null>(null)
  const lastUpdateRef = React.useRef<number>(0)

  // Characters per millisecond
  const charsPerMs = STREAMING_SPEEDS[speed] / 1000

  React.useEffect(() => {
    targetContentRef.current = content

    if (!enabled) {
      // When smooth streaming is disabled, show content immediately
      setDisplayedContent(content)
      return
    }

    // When streaming completes, immediately show all remaining content
    if (!isStreaming && displayedContent !== content) {
      setDisplayedContent(content)
      return
    }

    // Smooth streaming animation loop
    const animate = (timestamp: number) => {
      if (!lastUpdateRef.current) {
        lastUpdateRef.current = timestamp
      }

      const elapsed = timestamp - lastUpdateRef.current
      const charsToAdd = Math.floor(elapsed * charsPerMs)

      if (charsToAdd > 0) {
        lastUpdateRef.current = timestamp

        setDisplayedContent((prev) => {
          const target = targetContentRef.current
          if (prev.length >= target.length) {
            return prev
          }
          const nextLength = Math.min(prev.length + charsToAdd, target.length)
          return target.slice(0, nextLength)
        })
      }

      // Continue animation if there's more content to show
      if (
        displayedContent.length < targetContentRef.current.length ||
        isStreaming
      ) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [content, isStreaming, enabled, charsPerMs, displayedContent])

  // Reset when content changes completely (new message)
  React.useEffect(() => {
    if (content.length === 0) {
      setDisplayedContent('')
      lastUpdateRef.current = 0
    }
  }, [content])

  return enabled ? displayedContent : content
}

export function StreamingMessage({
  content,
  isStreaming = false,
  toolCalls = [],
  citations = [],
  thinkingSteps = [],
  currentThinkingStep,
  error,
  showThinking = true,
  showCitations = true,
  showTools = true,
  onToolApprove,
  onToolReject,
  onRetry,
  className = '',
  smoothStreaming = false,
  streamingSpeed = 'normal',
}: StreamingMessageProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  // Use smooth streaming hook for polished text rendering
  const displayedContent = useSmoothStreaming(
    content,
    isStreaming,
    smoothStreaming,
    streamingSpeed
  )

  // Animate content appearance
  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  // Memoize parsed JSON to avoid re-parsing on every render
  const parsedContent = React.useMemo(() => {
    return parsePartialJSON(displayedContent)
  }, [displayedContent])

  // Memoize rendered content
  const renderedContent = React.useMemo(() => {
    const { parsed, remainder } = parsedContent

    if (parsed) {
      return (
        <div className="space-y-2">
          <pre className="bg-muted border rounded-lg p-3 overflow-x-auto text-sm">
            <code className="text-foreground">
              {JSON.stringify(parsed, null, 2)}
            </code>
          </pre>
          {remainder && (
            <div className="text-muted-foreground font-mono text-sm">
              {remainder}
              {isStreaming && <StreamingCursor />}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="prose prose-sm dark:prose-invert max-w-3xl mx-auto">
        <p className="whitespace-pre-wrap text-foreground">
          {displayedContent}
          {isStreaming && <StreamingCursor />}
        </p>
      </div>
    )
  }, [parsedContent, displayedContent, isStreaming])

  // Memoize callbacks to prevent unnecessary re-renders
  const handleToolApprove = React.useCallback(
    (tool: ToolCall) => {
      onToolApprove?.(tool)
    },
    [onToolApprove]
  )

  const handleToolReject = React.useCallback(
    (tool: ToolCall) => {
      onToolReject?.(tool)
    },
    [onToolReject]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
      transition={{ duration: DURATION_SECONDS.normal }}
      className={cn('space-y-4', className)}
    >
      {/* Error State */}
      {error && <ErrorDisplay error={error} onRetry={onRetry} />}

      {/* Thinking Steps */}
      {showThinking && (thinkingSteps.length > 0 || currentThinkingStep) && (
        <ThinkingSteps
          thinkingSteps={thinkingSteps}
          currentThinkingStep={currentThinkingStep}
        />
      )}

      {/* Tool Calls */}
      {showTools && toolCalls.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {toolCalls.map((tool, index) => (
              <ToolCallItem
                key={tool.id || `tool-${index}`}
                tool={tool}
                onToolApprove={handleToolApprove}
                onToolReject={handleToolReject}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Message Content */}
      {displayedContent && renderedContent}

      {/* Citations */}
      {showCitations && citations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <h4 className="text-sm font-semibold text-foreground">Sources</h4>
            <Badge variant="secondary">{citations.length}</Badge>
          </div>
          <div className="grid gap-2">
            <AnimatePresence>
              {citations.map((citation, index) => (
                <CitationItem
                  key={citation.id || `citation-${index}`}
                  citation={citation}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  )
}

StreamingMessage.displayName = 'StreamingMessage'
