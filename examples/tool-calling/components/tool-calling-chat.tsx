'use client'

/**
 * Tool Calling Chat Component
 *
 * Demonstrates AI function/tool calling with:
 * - Visual tool cards
 * - Execution status indicators
 * - Tool result rendering
 * - Weather, search, calculator, stock tools
 */

import { useState, useRef, useEffect, useCallback, FormEvent } from 'react'
import { TOOL_INFO } from '@/lib/tools'

// ============================================================================
// Types
// ============================================================================

interface ToolCall {
  id: string
  name: string
  args: Record<string, unknown>
  status: 'pending' | 'executing' | 'complete' | 'error'
  result?: unknown
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolCalls?: ToolCall[]
}

// ============================================================================
// Tool Card Component
// ============================================================================

function ToolCard({ toolCall }: { toolCall: ToolCall }) {
  const info = TOOL_INFO[toolCall.name] || {
    icon: '🔧',
    color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    description: 'Tool',
  }

  return (
    <div
      className={`
        tool-result border rounded-xl p-4 my-2
        ${info.color}
        ${toolCall.status === 'executing' ? 'tool-executing' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{info.icon}</span>
          <span className="font-medium">{info.description}</span>
        </div>
        <span
          className={`
            text-xs px-2 py-0.5 rounded-full
            ${
              toolCall.status === 'executing'
                ? 'bg-yellow-100 text-yellow-700'
                : toolCall.status === 'complete'
                  ? 'bg-green-100 text-green-700'
                  : toolCall.status === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
            }
          `}
        >
          {toolCall.status}
        </span>
      </div>

      {/* Arguments */}
      <div className="text-xs text-muted-foreground mb-2 font-mono bg-black/5 rounded p-2">
        {Object.entries(toolCall.args).map(([key, value]) => (
          <div key={key}>
            <span className="opacity-60">{key}:</span> {String(value)}
          </div>
        ))}
      </div>

      {/* Result */}
      {toolCall.result && (
        <div className="mt-3 pt-3 border-t border-current/10">
          <ToolResult name={toolCall.name} result={toolCall.result} />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Tool Result Renderers
// ============================================================================

function ToolResult({ name, result }: { name: string; result: unknown }) {
  const data = result as Record<string, unknown>

  switch (name) {
    case 'get_weather':
      return <WeatherResult data={data} />
    case 'search_web':
      return <SearchResult data={data} />
    case 'calculate':
      return <CalculatorResult data={data} />
    case 'get_stock_price':
      return <StockResult data={data} />
    default:
      return (
        <pre className="text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )
  }
}

function WeatherResult({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-4xl">
        {data.condition === 'Sunny'
          ? '☀️'
          : data.condition === 'Rainy'
            ? '🌧️'
            : data.condition === 'Snowy'
              ? '❄️'
              : '⛅'}
      </div>
      <div>
        <div className="text-2xl font-bold">
          {String(data.temperature)}°{String(data.unit)}
        </div>
        <div className="text-sm opacity-80">{String(data.condition)}</div>
        <div className="text-xs opacity-60">
          {String(data.location)} • Humidity: {String(data.humidity)}
        </div>
      </div>
    </div>
  )
}

function SearchResult({ data }: { data: Record<string, unknown> }) {
  const results = (data.results || []) as Array<{
    title: string
    url: string
    snippet: string
  }>

  return (
    <div className="space-y-2">
      <div className="text-xs opacity-60">
        {(data.totalResults as number)?.toLocaleString()} results for "{String(data.query)}"
      </div>
      {results.slice(0, 3).map((r, i) => (
        <div key={i} className="p-2 bg-black/5 rounded">
          <div className="font-medium text-sm">{r.title}</div>
          <div className="text-xs opacity-60 truncate">{r.url}</div>
          <div className="text-xs mt-1">{r.snippet}</div>
        </div>
      ))}
    </div>
  )
}

function CalculatorResult({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="text-center">
      <div className="text-sm opacity-60 font-mono">{String(data.expression)}</div>
      <div className="text-3xl font-bold mt-1">= {String(data.result)}</div>
    </div>
  )
}

function StockResult({ data }: { data: Record<string, unknown> }) {
  const isPositive = parseFloat(String(data.change)) >= 0

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold">{String(data.symbol)}</span>
        <span className="text-2xl font-bold">${String(data.price)}</span>
      </div>
      <div
        className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
      >
        {isPositive ? '+' : ''}
        {String(data.change)} ({String(data.changePercent)}%)
      </div>
      <div className="text-xs opacity-60 mt-1">
        Vol: {String(data.volume)} • MCap: {String(data.marketCap)}
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function ToolCallingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setError(null)

      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
      }
      setMessages((prev) => [...prev, userMessage])
      setInput('')

      // Create assistant placeholder
      const assistantId = `assistant-${Date.now()}`
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        toolCalls: [],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        })

        if (!response.ok) throw new Error('Failed to send message')

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) throw new Error('No response body')

        let fullContent = ''

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

              if (parsed.type === 'text-delta') {
                fullContent += parsed.content
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: fullContent } : m
                  )
                )
              } else if (parsed.type === 'tool_calls') {
                // Initialize tool calls
                const toolCalls: ToolCall[] = parsed.tool_calls.map(
                  (tc: { id: string; function: { name: string; arguments: string } }) => ({
                    id: tc.id,
                    name: tc.function.name,
                    args: JSON.parse(tc.function.arguments || '{}'),
                    status: 'pending' as const,
                  })
                )
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, toolCalls } : m
                  )
                )
              } else if (parsed.type === 'tool_execution_start') {
                // Mark tool as executing
                setMessages((prev) =>
                  prev.map((m) => {
                    if (m.id === assistantId && m.toolCalls) {
                      return {
                        ...m,
                        toolCalls: m.toolCalls.map((tc) =>
                          tc.id === parsed.tool_call_id
                            ? { ...tc, status: 'executing' as const }
                            : tc
                        ),
                      }
                    }
                    return m
                  })
                )
              } else if (parsed.type === 'tool_execution_result') {
                // Update tool with result
                setMessages((prev) =>
                  prev.map((m) => {
                    if (m.id === assistantId && m.toolCalls) {
                      return {
                        ...m,
                        toolCalls: m.toolCalls.map((tc) =>
                          tc.id === parsed.tool_call_id
                            ? {
                                ...tc,
                                status: parsed.result.success
                                  ? ('complete' as const)
                                  : ('error' as const),
                                result: parsed.result.data,
                              }
                            : tc
                        ),
                      }
                    }
                    return m
                  })
                )
              } else if (parsed.type === 'error') {
                throw new Error(parsed.message)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message')
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      } finally {
        setIsLoading(false)
        inputRef.current?.focus()
      }
    },
    [messages, isLoading]
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

  // Example prompts
  const examples = [
    "What's the weather in San Francisco?",
    'Search for the latest AI news',
    'Calculate 15% of 287.50',
    "What's Apple's stock price?",
  ]

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header */}
      <header className="p-4 border-b">
        <h1 className="text-xl font-semibold">Tool Calling Chat</h1>
        <p className="text-sm text-muted-foreground">
          AI with weather, search, calculator & stock tools
        </p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-4">🛠️</div>
            <h2 className="text-lg font-medium mb-2">Try Tool Calling</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Ask questions that use tools. The AI will automatically call the right tool.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(example)}
                  className="px-3 py-1.5 bg-muted text-sm rounded-lg hover:bg-muted/80 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
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
                className={`max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3'
                    : 'space-y-2'
                }`}
              >
                {message.role === 'assistant' ? (
                  <>
                    {/* Tool cards */}
                    {message.toolCalls && message.toolCalls.length > 0 && (
                      <div className="space-y-2">
                        {message.toolCalls.map((tc) => (
                          <ToolCard key={tc.id} toolCall={tc} />
                        ))}
                      </div>
                    )}
                    {/* Text content */}
                    {message.content && (
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {isLoading &&
                          !message.toolCalls?.length && (
                            <span className="inline-block w-2 h-4 ml-1 bg-current animate-blink" />
                          )}
                      </div>
                    )}
                    {/* Loading state */}
                    {isLoading && !message.content && !message.toolCalls?.length && (
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <span className="inline-flex gap-1">
                          <span className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
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

      {/* Error */}
      {error && (
        <div className="mx-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something that uses tools..."
            disabled={isLoading}
            rows={1}
            className="flex-1 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default ToolCallingChat
