'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Zap,
  Clock,
  Activity,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowDown,
} from 'lucide-react'

// ============================================================================
// STREAMING TEXT COMPONENTS
// ============================================================================

// Typing Animation - Character by character reveal
interface TypingAnimationProps {
  text: string
  speed?: number // ms per character
  onComplete?: () => void
  cursor?: boolean
  className?: string
}

export function TypingAnimation({
  text,
  speed = 30,
  onComplete,
  cursor = true,
  className,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = React.useState('')
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    if (!text) return
    setDisplayedText('')
    setIsComplete(false)

    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {cursor && !isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}

// Word-by-word streaming display
interface WordStreamProps {
  words: string[]
  delayBetweenWords?: number
  onComplete?: () => void
  className?: string
}

export function WordStream({
  words,
  delayBetweenWords = 100,
  onComplete,
  className,
}: WordStreamProps) {
  const [visibleCount, setVisibleCount] = React.useState(0)

  React.useEffect(() => {
    if (visibleCount < words.length) {
      const timer = setTimeout(() => {
        setVisibleCount((c) => c + 1)
      }, delayBetweenWords)
      return () => clearTimeout(timer)
    } else if (visibleCount === words.length && words.length > 0) {
      onComplete?.()
    }
  }, [visibleCount, words.length, delayBetweenWords, onComplete])

  return (
    <span className={className}>
      {words.slice(0, visibleCount).map((word, i) => (
        <span
          key={i}
          className="animate-in fade-in duration-200"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {word}{' '}
        </span>
      ))}
    </span>
  )
}

// Token-by-token stream display (simulates LLM output)
interface TokenStreamProps {
  tokens: string[]
  speed?: number
  onToken?: (token: string, index: number) => void
  onComplete?: () => void
  paused?: boolean
  className?: string
}

export function TokenStream({
  tokens,
  speed = 50,
  onToken,
  onComplete,
  paused = false,
  className,
}: TokenStreamProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [displayedTokens, setDisplayedTokens] = React.useState<string[]>([])

  React.useEffect(() => {
    if (paused || currentIndex >= tokens.length) {
      if (currentIndex >= tokens.length && tokens.length > 0) {
        onComplete?.()
      }
      return
    }

    const timer = setTimeout(() => {
      const token = tokens[currentIndex]
      setDisplayedTokens((prev) => [...prev, token])
      onToken?.(token, currentIndex)
      setCurrentIndex((i) => i + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [currentIndex, tokens, speed, paused, onToken, onComplete])

  return (
    <span className={className}>
      {displayedTokens.join('')}
      {currentIndex < tokens.length && (
        <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
      )}
    </span>
  )
}

// Text Shimmer Effect (loading placeholder)
interface TextShimmerProps {
  width?: string
  lines?: number
  className?: string
}

export function TextShimmer({
  width = '100%',
  lines = 3,
  className,
}: TextShimmerProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] animate-shimmer"
          style={{
            width: i === lines - 1 ? '60%' : width,
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// STREAMING STATUS & CONTROLS
// ============================================================================

// Stream Status Indicator
interface StreamStatusProps {
  status: 'idle' | 'connecting' | 'streaming' | 'paused' | 'complete' | 'error'
  tokensPerSecond?: number
  totalTokens?: number
  elapsedTime?: number
  error?: string
  className?: string
}

export function StreamStatus({
  status,
  tokensPerSecond = 0,
  totalTokens = 0,
  elapsedTime = 0,
  error,
  className,
}: StreamStatusProps) {
  const statusConfig = {
    idle: {
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      icon: Clock,
      label: 'Ready',
    },
    connecting: {
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      icon: Loader2,
      label: 'Connecting...',
    },
    streaming: {
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      icon: Activity,
      label: 'Streaming',
    },
    paused: {
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      icon: Pause,
      label: 'Paused',
    },
    complete: {
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      icon: CheckCircle2,
      label: 'Complete',
    },
    error: {
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      icon: AlertCircle,
      label: 'Error',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Badge
        variant="outline"
        className={cn('gap-1.5', config.color, config.bg)}
      >
        <Icon
          className={cn('h-3 w-3', status === 'connecting' && 'animate-spin')}
        />
        {config.label}
      </Badge>

      {status === 'streaming' && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {tokensPerSecond.toFixed(1)} tok/s
          </span>
          <span>{totalTokens} tokens</span>
          <span>{(elapsedTime / 1000).toFixed(1)}s</span>
        </div>
      )}

      {status === 'error' && error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}

// Stream Control Bar
interface StreamControlsProps {
  status: 'idle' | 'streaming' | 'paused' | 'complete'
  onStart?: () => void
  onPause?: () => void
  onResume?: () => void
  onStop?: () => void
  onRegenerate?: () => void
  className?: string
}

export function StreamControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  onRegenerate,
  className,
}: StreamControlsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {status === 'idle' && (
        <Button size="sm" onClick={onStart}>
          <Play className="h-4 w-4 mr-1" />
          Start
        </Button>
      )}

      {status === 'streaming' && (
        <>
          <Button size="sm" variant="outline" onClick={onPause}>
            <Pause className="h-4 w-4 mr-1" />
            Pause
          </Button>
          <Button size="sm" variant="destructive" onClick={onStop}>
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
        </>
      )}

      {status === 'paused' && (
        <>
          <Button size="sm" onClick={onResume}>
            <Play className="h-4 w-4 mr-1" />
            Resume
          </Button>
          <Button size="sm" variant="destructive" onClick={onStop}>
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
        </>
      )}

      {status === 'complete' && (
        <Button size="sm" variant="outline" onClick={onRegenerate}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Regenerate
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// VIRTUALIZED LIST COMPONENTS
// ============================================================================

// Virtual List for large message lists
interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
  renderItem,
  className,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )
  const visibleItems = items.slice(startIndex, endIndex)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, i) => (
          <div
            key={startIndex + i}
            style={{
              position: 'absolute',
              top: (startIndex + i) * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem(item, startIndex + i)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Infinite Scroll Container
interface InfiniteScrollProps {
  children: React.ReactNode
  onLoadMore: () => void
  hasMore: boolean
  isLoading?: boolean
  threshold?: number
  className?: string
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  isLoading = false,
  threshold = 100,
  className,
}: InfiniteScrollProps) {
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin: `${threshold}px` }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore, threshold])

  return (
    <div className={className}>
      {children}
      <div ref={sentinelRef} className="h-1" />
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

// Auto-scroll container for chat
interface AutoScrollContainerProps {
  children: React.ReactNode
  enabled?: boolean
  onScrollChange?: (isAtBottom: boolean) => void
  className?: string
}

export function AutoScrollContainer({
  children,
  enabled = true,
  onScrollChange,
  className,
}: AutoScrollContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = React.useState(true)
  const [showScrollButton, setShowScrollButton] = React.useState(false)

  const scrollToBottom = React.useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [])

  React.useEffect(() => {
    if (enabled && isAtBottom) {
      scrollToBottom()
    }
  }, [children, enabled, isAtBottom, scrollToBottom])

  const handleScroll = () => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const atBottom = scrollHeight - scrollTop - clientHeight < 50
    setIsAtBottom(atBottom)
    setShowScrollButton(!atBottom)
    onScrollChange?.(atBottom)
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={containerRef}
        className="h-full overflow-y-auto"
        onScroll={handleScroll}
      >
        {children}
      </div>

      {showScrollButton && (
        <Button
          size="sm"
          variant="secondary"
          className="absolute bottom-4 right-4 rounded-full shadow-lg"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// STREAM DEBUGGING & MONITORING
// ============================================================================

// Stream Debug Panel
interface StreamChunk {
  id: string
  content: string
  timestamp: number
  type: 'text' | 'tool_call' | 'tool_result' | 'error'
  metadata?: Record<string, unknown>
}

interface StreamDebugPanelProps {
  chunks: StreamChunk[]
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
}

export function StreamDebugPanel({
  chunks,
  isExpanded = false,
  onToggle,
  className,
}: StreamDebugPanelProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    const content = chunks.map((c) => `[${c.type}] ${c.content}`).join('\n')
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const typeColors: Record<string, string> = {
    text: 'text-foreground',
    tool_call: 'text-blue-500',
    tool_result: 'text-green-500',
    error: 'text-red-500',
  }

  return (
    <div className={cn('border border-border rounded-lg', className)}>
      <div
        className="flex items-center justify-between px-3 py-2 bg-muted/50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span className="text-sm font-medium">Stream Debug</span>
          <Badge variant="secondary" className="text-xs">
            {chunks.length} chunks
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7"
            onClick={(e) => {
              e.stopPropagation()
              handleCopy()
            }}
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="max-h-[300px] overflow-y-auto p-3 space-y-1 font-mono text-xs">
          {chunks.map((chunk) => (
            <div key={chunk.id} className="flex gap-2">
              <span className="text-muted-foreground w-16 shrink-0">
                {new Date(chunk.timestamp).toLocaleTimeString()}
              </span>
              <Badge
                variant="outline"
                className={cn('text-xs shrink-0', typeColors[chunk.type])}
              >
                {chunk.type}
              </Badge>
              <span className={typeColors[chunk.type]}>{chunk.content}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Stream Metrics Display
interface StreamMetrics {
  tokensGenerated: number
  tokensPerSecond: number
  timeToFirstToken: number
  totalTime: number
  promptTokens: number
  completionTokens: number
  estimatedCost?: number
}

interface StreamMetricsDisplayProps {
  metrics: StreamMetrics
  className?: string
}

export function StreamMetricsDisplay({
  metrics,
  className,
}: StreamMetricsDisplayProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      <div className="rounded-lg border border-border p-3">
        <p className="text-xs text-muted-foreground">Tokens Generated</p>
        <p className="text-lg font-semibold">{metrics.tokensGenerated}</p>
      </div>
      <div className="rounded-lg border border-border p-3">
        <p className="text-xs text-muted-foreground">Speed</p>
        <p className="text-lg font-semibold">
          {metrics.tokensPerSecond.toFixed(1)} tok/s
        </p>
      </div>
      <div className="rounded-lg border border-border p-3">
        <p className="text-xs text-muted-foreground">Time to First Token</p>
        <p className="text-lg font-semibold">{metrics.timeToFirstToken}ms</p>
      </div>
      <div className="rounded-lg border border-border p-3">
        <p className="text-xs text-muted-foreground">Total Time</p>
        <p className="text-lg font-semibold">
          {(metrics.totalTime / 1000).toFixed(2)}s
        </p>
      </div>
      {metrics.estimatedCost !== undefined && (
        <div className="rounded-lg border border-border p-3 col-span-2 md:col-span-4">
          <p className="text-xs text-muted-foreground">Estimated Cost</p>
          <p className="text-lg font-semibold text-green-500">
            ${metrics.estimatedCost.toFixed(4)}
          </p>
          <p className="text-xs text-muted-foreground">
            {metrics.promptTokens} prompt + {metrics.completionTokens}{' '}
            completion tokens
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// THINKING/REASONING DISPLAY
// ============================================================================

// Thinking Bar (collapsed thinking indicator)
interface ThinkingBarProps {
  isThinking?: boolean
  duration?: number
  preview?: string
  onExpand?: () => void
  className?: string
}

export function ThinkingBar({
  isThinking = false,
  duration = 0,
  preview,
  onExpand,
  className,
}: ThinkingBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border cursor-pointer hover:bg-muted transition-colors',
        className
      )}
      onClick={onExpand}
    >
      <div className="relative">
        <div
          className={cn(
            'h-2 w-2 rounded-full',
            isThinking ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">
          {isThinking ? 'Thinking...' : preview || 'Thought process complete'}
        </p>
      </div>
      {!isThinking && duration > 0 && (
        <Badge variant="secondary" className="text-xs">
          {(duration / 1000).toFixed(1)}s
        </Badge>
      )}
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}

// Reasoning Steps Display
interface ReasoningStep {
  id: string
  title: string
  content: string
  status: 'pending' | 'active' | 'complete'
  duration?: number
}

interface ReasoningDisplayProps {
  steps: ReasoningStep[]
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
}

export function ReasoningDisplay({
  steps,
  isExpanded = false,
  onToggle,
  className,
}: ReasoningDisplayProps) {
  const safeSteps = steps || []
  const activeStep = safeSteps.find((s) => s.status === 'active')
  const completedCount = safeSteps.filter((s) => s.status === 'complete').length

  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        className
      )}
    >
      <div
        className="flex items-center justify-between px-4 py-3 bg-muted/50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {activeStep ? (
              <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {activeStep ? activeStep.title : 'Reasoning Complete'}
            </p>
            <p className="text-xs text-muted-foreground">
              {completedCount}/{safeSteps.length} steps
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Progress
            value={(completedCount / safeSteps.length) * 100}
            className="w-20 h-1.5"
          />
          {isExpanded ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3">
          {safeSteps.map((step, index) => (
            <div key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                    step.status === 'complete'
                      ? 'bg-green-500/20 text-green-500'
                      : step.status === 'active'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-muted text-muted-foreground'
                  )}
                >
                  {step.status === 'complete' ? (
                    <Check className="h-3 w-3" />
                  ) : step.status === 'active' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < safeSteps.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{step.title}</p>
                  {step.duration && (
                    <span className="text-xs text-muted-foreground">
                      {(step.duration / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {step.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// STREAMING RESPONSE WRAPPER
// ============================================================================

interface StreamingResponseProps {
  content: string
  isStreaming: boolean
  status: 'idle' | 'streaming' | 'complete' | 'error'
  metrics?: StreamMetrics
  showMetrics?: boolean
  className?: string
}

export function StreamingResponse({
  content,
  isStreaming,
  status,
  metrics,
  showMetrics = false,
  className,
}: StreamingResponseProps) {
  const [showFullMetrics, setShowFullMetrics] = React.useState(false)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {content}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
        )}
      </div>

      {showMetrics && metrics && status === 'complete' && (
        <div className="pt-2 border-t border-border">
          <button
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowFullMetrics(!showFullMetrics)}
          >
            <Activity className="h-3 w-3" />
            <span>
              {metrics.tokensGenerated} tokens in{' '}
              {(metrics.totalTime / 1000).toFixed(1)}s
            </span>
            {showFullMetrics ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>

          {showFullMetrics && (
            <StreamMetricsDisplay metrics={metrics} className="mt-3" />
          )}
        </div>
      )}
    </div>
  )
}
