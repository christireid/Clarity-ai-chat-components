'use client'

/**
 * Advanced Streaming Chat Component
 *
 * Demonstrates advanced SSE streaming features:
 * - Real-time token counting
 * - Stream cancellation
 * - Retry on failure
 * - Typing indicator with character count
 * - Stream speed metrics
 * - Connection status
 */

import { useState, useRef, useEffect, useCallback, FormEvent } from 'react'

// ============================================================================
// Types
// ============================================================================

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  tokens?: number
  streamDurationMs?: number
}

interface StreamMetrics {
  inputTokens: number
  outputTokens: number
  elapsedMs: number
  tokensPerSecond: number
}

type StreamStatus =
  | 'idle'
  | 'connecting'
  | 'streaming'
  | 'complete'
  | 'error'
  | 'cancelled'

// ============================================================================
// Token Counter Component
// ============================================================================

function TokenCounter({
  label,
  count,
  max,
}: {
  label: string
  count: number
  max?: number
}) {
  const percentage = max ? (count / max) * 100 : 0
  const isWarning = max && percentage > 80
  const isCritical = max && percentage > 95

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">{label}:</span>
      <span
        className={`font-mono ${
          isCritical
            ? 'text-red-400'
            : isWarning
              ? 'text-yellow-400'
              : 'text-primary'
        }`}
      >
        {count.toLocaleString()}
      </span>
      {max && (
        <>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground font-mono">
            {max.toLocaleString()}
          </span>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isCritical
                  ? 'bg-red-400'
                  : isWarning
                    ? 'bg-yellow-400'
                    : 'bg-primary'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// Stream Status Indicator
// ============================================================================

function StreamStatusIndicator({ status }: { status: StreamStatus }) {
  const statusConfig = {
    idle: { color: 'bg-muted', label: 'Ready' },
    connecting: {
      color: 'bg-yellow-400 animate-pulse',
      label: 'Connecting...',
    },
    streaming: { color: 'bg-primary animate-pulse-fast', label: 'Streaming' },
    complete: { color: 'bg-green-400', label: 'Complete' },
    error: { color: 'bg-red-400', label: 'Error' },
    cancelled: { color: 'bg-orange-400', label: 'Cancelled' },
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-muted-foreground">{config.label}</span>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function StreamingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<StreamStatus>('idle')
  const [metrics, setMetrics] = useState<StreamMetrics>({
    inputTokens: 0,
    outputTokens: 0,
    elapsedMs: 0,
    tokensPerSecond: 0,
  })
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentMessageIdRef = useRef<string | null>(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cancel stream
  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setStatus('cancelled')
    }
  }, [])

  // Retry last message
  const retryLastMessage = useCallback(() => {
    if (messages.length < 2) return

    // Find last user message
    const lastUserMessageIndex = messages.findLastIndex(
      (m: Message) => m.role === 'user'
    )
    if (lastUserMessageIndex === -1) return

    const lastUserMessage = messages[lastUserMessageIndex]

    // Remove assistant response (if any)
    setMessages((prev: Message[]) => prev.slice(0, lastUserMessageIndex + 1))

    // Re-send
    sendMessage(lastUserMessage.content, true)
  }, [messages])

  // Send message
  const sendMessage = useCallback(
    async (content: string, isRetry = false) => {
      if (!content.trim() || (status === 'streaming' && !isRetry)) return

      setError(null)

      // Add user message if not retry
      let currentMessages = messages
      if (!isRetry) {
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          role: 'user',
          content,
          timestamp: Date.now(),
        }
        currentMessages = [...messages, userMessage]
        setMessages(currentMessages)
        setInput('')
      }

      // Create assistant placeholder
      const assistantId = `assistant-${Date.now()}`
      currentMessageIdRef.current = assistantId
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }
      setMessages((prev: Message[]) => [...prev, assistantMessage])
      setStatus('connecting')

      // Reset metrics
      setMetrics({
        inputTokens: 0,
        outputTokens: 0,
        elapsedMs: 0,
        tokensPerSecond: 0,
      })

      // Create abort controller
      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: currentMessages.map((m: Message) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to connect')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) throw new Error('No response body')

        setStatus('streaming')
        let fullContent = ''
        let startTime = Date.now()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk
            .split('\n')
            .filter((line) => line.startsWith('data:'))

          for (const line of lines) {
            const data = line.slice(5).trim()
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)

              if (parsed.type === 'init') {
                startTime = Date.now()
                setMetrics((prev: StreamMetrics) => ({
                  ...prev,
                  inputTokens: parsed.inputTokens,
                }))
              } else if (parsed.type === 'text-delta') {
                fullContent += parsed.content
                const elapsed = Date.now() - startTime
                const tps =
                  elapsed > 0
                    ? Math.round((parsed.outputTokens / elapsed) * 1000)
                    : 0

                setMessages((prev: Message[]) =>
                  prev.map((m: Message) =>
                    m.id === assistantId ? { ...m, content: fullContent } : m
                  )
                )

                setMetrics((prev: StreamMetrics) => ({
                  ...prev,
                  outputTokens: parsed.outputTokens,
                  elapsedMs: elapsed,
                  tokensPerSecond: tps,
                }))
              } else if (parsed.type === 'finish') {
                setMessages((prev: Message[]) =>
                  prev.map((m: Message) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          tokens: parsed.outputTokens,
                          streamDurationMs: parsed.totalMs,
                        }
                      : m
                  )
                )
                setStatus('complete')
              } else if (parsed.type === 'error') {
                throw new Error(parsed.message)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Already handled
        } else {
          setError(err instanceof Error ? err.message : 'Stream error')
          setStatus('error')
          setMessages((prev: Message[]) =>
            prev.filter((m: Message) => m.id !== assistantId)
          )
        }
      } finally {
        abortControllerRef.current = null
        currentMessageIdRef.current = null
        inputRef.current?.focus()
      }
    },
    [messages, status]
  )

  // Form handlers
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isStreaming = status === 'streaming' || status === 'connecting'

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border/50">
        <div>
          <h1 className="text-xl font-semibold text-primary">Streaming Chat</h1>
          <p className="text-sm text-muted-foreground">
            Advanced SSE streaming with real-time metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StreamStatusIndicator status={status} />
          {messages.length > 0 && (
            <button
              onClick={() => {
                setMessages([])
                setStatus('idle')
                setMetrics({
                  inputTokens: 0,
                  outputTokens: 0,
                  elapsedMs: 0,
                  tokensPerSecond: 0,
                })
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-6">
          <TokenCounter
            label="Input"
            count={metrics.inputTokens}
            max={128000}
          />
          <TokenCounter
            label="Output"
            count={metrics.outputTokens}
            max={4096}
          />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground">
            Speed:{' '}
            <span className="font-mono text-foreground">
              {metrics.tokensPerSecond} tok/s
            </span>
          </span>
          <span className="text-muted-foreground">
            Time:{' '}
            <span className="font-mono text-foreground">
              {(metrics.elapsedMs / 1000).toFixed(1)}s
            </span>
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium mb-1">Real-time Streaming</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Watch tokens stream in real-time with speed metrics, cancellation,
              and retry support.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3'
                    : 'space-y-2'
                }`}
              >
                {message.role === 'assistant' ? (
                  <>
                    <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3">
                      <p className="whitespace-pre-wrap streaming-text">
                        {message.content}
                      </p>
                      {isStreaming &&
                        currentMessageIdRef.current === message.id && (
                          <span
                            className="inline-block w-2 h-4 ml-1 bg-primary animate-blink"
                            aria-hidden="true"
                          />
                        )}
                    </div>
                    {message.tokens && (
                      <div className="text-xs text-muted-foreground px-1">
                        {message.tokens} tokens in{' '}
                        {((message.streamDurationMs || 0) / 1000).toFixed(1)}s
                      </div>
                    )}
                  </>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={retryLastMessage}
            className="text-xs px-2 py-1 bg-destructive/20 rounded hover:bg-destructive/30 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isStreaming}
            rows={1}
            className="flex-1 px-4 py-3 bg-muted/50 border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 placeholder:text-muted-foreground"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={cancelStream}
              className="px-6 py-3 bg-destructive text-destructive-foreground rounded-xl font-medium hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive/50 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          )}
        </form>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Enter to send, Shift+Enter for new line</span>
          {status === 'cancelled' && (
            <button
              onClick={retryLastMessage}
              className="text-primary hover:underline"
            >
              Retry last message
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default StreamingChat
