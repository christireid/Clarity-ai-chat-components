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
 *
 * This page uses hooks from the ./hooks directory that you can
 * copy directly into your own project.
 */

import React from 'react'
import type { FormEvent, ChangeEvent } from 'react'

// Import copy-paste hooks from the hooks directory
import { useAutoScroll } from '../hooks/useAutoScroll'
import { useTokenTracker, estimateTokens } from '../hooks/useTokenTracker'
import { useStreamingChat, type Message } from '../hooks/useStreamingChat'

export default function HeadlessModePage(): JSX.Element {
  // Use our copy-paste hooks
  const { estimatedCost, trackTokens, total } = useTokenTracker('gpt-4-turbo')

  const { messages, sendMessage, isLoading, error } = useStreamingChat({
    api: '/api/chat',
    onFinish: (content) => {
      // Track output tokens when response completes
      const outputTokens = estimateTokens(content)
      trackTokens(outputTokens, 'output')
    },
  })

  const { scrollRef, scrollToBottom, isNearBottom, handleScroll } =
    useAutoScroll(messages.length)

  const handleSend = async (input: string) => {
    // Track input tokens
    const inputTokens = estimateTokens(input)
    trackTokens(inputTokens, 'input')

    // Send the message
    await sendMessage(input)
  }

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
              Tokens: {total.toLocaleString()}
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

          {messages.map((message: Message) => (
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
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  )
}

/**
 * Custom chat input component - demonstrates your own UI design
 */
function ChatInput({
  onSend,
  isLoading,
}: {
  onSend: (message: string) => void
  isLoading: boolean
}) {
  const [input, setInput] = React.useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-3">
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
          This input, the message bubbles, the header - all custom. Zero library
          components.
        </p>
      </div>
    </footer>
  )
}
