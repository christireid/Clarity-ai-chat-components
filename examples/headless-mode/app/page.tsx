'use client'

/**
 * Headless Mode Example
 *
 * This example demonstrates building a custom chat UI WITHOUT
 * any pre-built components - just React state and fetch calls.
 *
 * Key benefits:
 * - Full control over your UI/UX
 * - Use with any design system (Tailwind, MUI, Chakra, etc.)
 * - Zero library styling lock-in
 * - Smaller bundle - only import what you need
 */

import type { FormEvent, ChangeEvent } from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  tokens?: number
}

// Simple token estimation (4 chars ≈ 1 token)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Cost estimation for GPT-4 Turbo
function estimateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1000) * 0.01 // $0.01/1K input
  const outputCost = (outputTokens / 1000) * 0.03 // $0.03/1K output
  return inputCost + outputCost
}

// Custom hook for auto-scroll behavior
function useAutoScroll(messagesLength: number) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setIsNearBottom(scrollHeight - scrollTop - clientHeight < 100)
  }, [])

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom()
    }
  }, [messagesLength, isNearBottom, scrollToBottom])

  return { scrollRef, scrollToBottom, isNearBottom, handleScroll }
}

export default function HeadlessModePage(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [totalTokens, setTotalTokens] = useState({ input: 0, output: 0 })

  const { scrollRef, scrollToBottom, isNearBottom, handleScroll } =
    useAutoScroll(messages.length)

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userTokens = estimateTokens(input.trim())
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      tokens: userTokens,
    }

    setMessages((prev) => [...prev, userMessage])
    setTotalTokens((prev) => ({ ...prev, input: prev.input + userTokens }))
    setInput('')
    setIsLoading(true)
    setError(null)

    // Add placeholder for assistant response
    const assistantId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '' },
    ])

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

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'text-delta' && parsed.content) {
                assistantContent += parsed.content
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: assistantContent }
                      : m
                  )
                )
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Track output tokens
      const outputTokens = estimateTokens(assistantContent)
      setTotalTokens((prev) => ({
        ...prev,
        output: prev.output + outputTokens,
      }))
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, tokens: outputTokens } : m
        )
      )
    } catch (err) {
      console.error('Send error:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
      // Remove the placeholder message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  const estimatedCost = estimateCost(totalTokens.input, totalTokens.output)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Custom Header - YOUR design */}
      <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Headless Mode</h1>
            <p className="text-violet-200 text-sm">
              Pure React + fetch = unlimited flexibility
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-white/20 rounded-lg px-3 py-1">
              Tokens:{' '}
              {(totalTokens.input + totalTokens.output).toLocaleString()}
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1">
              Cost: ${estimatedCost.toFixed(4)}
            </div>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-800 px-6 py-3">
        <div className="max-w-4xl mx-auto text-sm text-violet-800 dark:text-violet-200">
          <strong>This UI is 100% custom.</strong> No Clarity Chat components -
          just React state, fetch, and SSE parsing. Your design system, your
          rules.
        </div>
      </div>

      {/* Messages - YOUR design */}
      <main
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900 mb-4">
                <svg
                  className="w-8 h-8 text-violet-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Headless Mode Demo
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                This chat is built with pure React - no Clarity Chat UI
                components. Try sending a message!
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                  message.role === 'user'
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                {message.role === 'assistant' &&
                  !message.content &&
                  isLoading && (
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.tokens && (
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-violet-200'
                        : 'text-gray-400'
                    }`}
                  >
                    ~{message.tokens} tokens
                  </div>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
              Error: {error.message}
            </div>
          )}
        </div>
      </main>

      {/* Scroll to bottom button - YOUR design */}
      {!isNearBottom && messages.length > 0 && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-8 bg-violet-600 text-white p-3 rounded-full shadow-lg hover:bg-violet-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}

      {/* Input - YOUR design */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              placeholder="Type a message... (this is your custom input)"
              className="flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending
                </>
              ) : (
                'Send'
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            This input, the message bubbles, the header - all custom. Zero
            library components.
          </p>
        </div>
      </footer>
    </div>
  )
}
