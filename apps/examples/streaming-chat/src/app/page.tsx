'use client'

import { useState, useRef, useCallback } from 'react'
import { Send } from 'lucide-react'

interface StreamMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  status: 'sending' | 'sent' | 'error'
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span
        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  )
}

// API Key Missing Card Component
function ApiKeyMissingCard({ provider }: { provider: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          API Key Required
        </h1>
        <p className="text-slate-600 mb-6">
          This demo requires a <strong>{provider}</strong> API key to function.
        </p>
        <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-mono mb-2">
            1. Create a{' '}
            <code className="bg-slate-200 px-1.5 py-0.5 rounded">
              .env.local
            </code>{' '}
            file
          </p>
          <p className="text-sm font-mono">
            2. Add:{' '}
            <code className="bg-slate-200 px-1.5 py-0.5 rounded">
              OPENAI_API_KEY=sk-...
            </code>
          </p>
        </div>
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors"
        >
          Get API Key →
        </a>
      </div>
    </div>
  )
}

export default function StreamingChatDemo() {
  const [messages, setMessages] = useState<StreamMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your AI assistant with real-time streaming support. Try asking me something!",
      status: 'sent',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return
      setError(null)
      setInput('')

      const userMessage: StreamMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        status: 'sent',
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setIsStreaming(true)
      setTimeout(scrollToBottom, 100)

      const assistantMessage: StreamMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        status: 'sending',
      }

      setMessages((prev) => [...prev, assistantMessage])
      abortControllerRef.current = new AbortController()

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
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          if (
            response.status === 500 &&
            errorData.message?.includes('API key')
          ) {
            setApiKeyMissing(true)
            return
          }
          throw new Error(errorData.message || 'Failed to get response')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) throw new Error('No reader available')

        let accumulatedContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  accumulatedContent += parsed.content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? {
                            ...msg,
                            content: accumulatedContent,
                            status: 'sending' as const,
                          }
                        : msg
                    )
                  )
                  scrollToBottom()
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, status: 'sent' as const }
              : msg
          )
        )
      } catch (err: unknown) {
        const error = err as Error
        if (error.name === 'AbortError') {
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== assistantMessage.id)
          )
        } else {
          setError(error.message || 'Something went wrong')
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? {
                    ...msg,
                    content: 'Sorry, I encountered an error. Please try again.',
                    status: 'error' as const,
                  }
                : msg
            )
          )
        }
      } finally {
        setIsLoading(false)
        setIsStreaming(false)
        abortControllerRef.current = null
      }
    },
    [messages, scrollToBottom]
  )

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
      setIsLoading(false)
    }
  }, [])

  if (apiKeyMissing) {
    return <ApiKeyMissingCard provider="OpenAI" />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-xl">
                📡
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Streaming Chat
                </h1>
                <p className="text-sm text-slate-600">
                  Real-time SSE streaming demo
                </p>
              </div>
            </div>
            <a
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back to Docs
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        {/* How to Use Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <h2 className="text-base font-semibold text-slate-900 mb-2">
            💡 How to Use
          </h2>
          <p className="text-sm text-slate-600">
            This demo shows real-time streaming responses using Server-Sent
            Events (SSE). Type a message and watch the AI response appear
            character by character. Click "Stop" to cancel generation
            mid-stream.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <span>⚠️</span>
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-700 hover:text-red-900 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Streaming Indicator */}
        {isStreaming && (
          <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TypingIndicator />
              <span className="text-sm text-blue-700">
                Streaming response...
              </span>
            </div>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm bg-white border border-blue-200 text-blue-700 rounded hover:bg-blue-50 transition-colors"
            >
              Stop
            </button>
          </div>
        )}

        {/* Chat Window */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(input)
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>Streaming Chat Demo • Clarity Chat Components</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-900 transition-colors">
                📖 Documentation
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                💻 GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
