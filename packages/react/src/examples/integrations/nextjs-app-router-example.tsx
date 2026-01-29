/**
 * Next.js App Router Integration Example
 *
 * Complete example showing how to integrate Clarity Chat components
 * with Next.js App Router for a modern full-stack chat application.
 *
 * Features:
 * - Server components and client components
 * - Route handlers (API routes)
 * - Server-side streaming
 * - Database persistence (if configured)
 * - Authentication integration
 * - Error boundaries
 * - Loading states
 *
 * File structure:
 * ```
 * app/
 *   chat/
 *     page.tsx          (Server component)
 *     ClientChat.tsx    (Client component)
 *     layout.tsx
 *   api/
 *     chat/
 *       route.ts        (Route handler)
 * ```
 *
 * @example
 * ```tsx
 * // In your app/chat/page.tsx
 * import { NextJSAppRouterExample } from '@clarity-chat/react/examples/integrations'
 *
 * export default function ChatPage() {
 *   return <NextJSAppRouterExample />
 * }
 * ```
 */

'use client'

import React, { useCallback, useState, useRef } from 'react'
import { ChatWindow } from '../../components/chat/ChatWindow'
import { ClarityChatProvider } from '../../context/ClarityChatProvider'
import type { ClarityChatMessage, ClarityChatAdapter } from '../../adapters/types'

/**
 * Client component for chat UI
 * This component handles the interactive chat interface
 */
export function NextJSClientChatComponent() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Create Clarity Chat adapter
  const adapter: ClarityChatAdapter = {
    async chat(userMessages, options) {
      return {
        async *stream() {
          yield { type: 'text-delta' as const, content: '' }
        },
        messages: userMessages,
      }
    },
    on: () => () => {},
  }

  // Handle sending messages
  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMessage: ClarityChatMessage = {
        id: Math.random().toString(36).slice(2),
        role: 'user',
        content,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      // Create abort controller for request cancellation
      abortControllerRef.current = new AbortController()

      try {
        // Call the Next.js API route
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`)
        }

        // Stream the response
        let assistantContent = ''

        if (response.body) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            assistantContent += chunk
          }
        }

        const assistantMessage: ClarityChatMessage = {
          id: Math.random().toString(36).slice(2),
          role: 'assistant',
          content: assistantContent,
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        if (
          !(err instanceof Error && err.name === 'AbortError')
        ) {
          setError(
            err instanceof Error ? err : new Error(String(err))
          )
        }
      } finally {
        setIsLoading(false)
      }
    },
    [messages]
  )

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsLoading(false)
  }, [])

  return (
    <ClarityChatProvider adapter={adapter}>
      <div className="flex h-screen flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Next.js Chat App
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Built with App Router and Route Handlers
          </p>
        </div>

        {/* Chat window */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            showHeader={false}
          />
        </div>

        {/* Loading indicator with stop button */}
        {isLoading && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
                <span className="text-sm text-gray-700">
                  Generating response...
                </span>
              </div>
              <button
                onClick={handleStop}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="border-t border-red-200 bg-red-50 px-6 py-4">
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="mt-1 text-sm text-red-800">{error.message}</p>
            <button
              onClick={() => setError(null)}
              className="mt-3 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </ClarityChatProvider>
  )
}

/**
 * Server component - demonstrates Next.js server-side rendering
 * This would be your app/chat/page.tsx
 */
export function NextJSAppRouterExample() {
  // This could fetch initial data from the server if needed
  return (
    <div className="h-screen">
      <NextJSClientChatComponent />
    </div>
  )
}

/**
 * Layout component example
 * This would be your app/chat/layout.tsx
 */
export function NextJSChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">
              ChatApp
            </h1>
            <nav className="flex gap-4">
              <a href="/chat" className="text-sm text-gray-700 hover:text-gray-900">
                Chat
              </a>
              <a href="/history" className="text-sm text-gray-700 hover:text-gray-900">
                History
              </a>
              <a href="/settings" className="text-sm text-gray-700 hover:text-gray-900">
                Settings
              </a>
            </nav>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <button className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

/**
 * API Route Handler
 * This would be your app/api/chat/route.ts
 *
 * @example
 * ```typescript
 * // app/api/chat/route.ts
 * import { StreamingTextResponse } from 'ai'
 * import { anthropicAdapter } from '@clarity-chat/react/adapters'
 *
 * export async function POST(request: Request) {
 *   const { messages } = await request.json()
 *
 *   const stream = await anthropicAdapter.chat(messages, {
 *     provider: 'anthropic',
 *     model: 'claude-3-5-sonnet-20241022',
 *     apiKey: process.env.ANTHROPIC_API_KEY,
 *   })
 *
 *   return new StreamingTextResponse(stream)
 * }
 * ```
 */
export const apiRouteHandlerExample = `
// app/api/chat/route.ts
import { StreamingTextResponse } from 'ai'
import { anthropicAdapter } from '@clarity-chat/react/adapters'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  // Authentication check
  const session = await getServerSession()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages } = await request.json()

  // Call the adapter
  const response = await anthropicAdapter.chat(messages, {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    apiKey: process.env.ANTHROPIC_API_KEY,
    timeout: 30000,
  })

  // Stream the response
  return new StreamingTextResponse(response.stream())
}
`

/**
 * Advanced example with database persistence
 * This demonstrates how to save conversation history
 */
export function NextJSWithPersistenceExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [conversationId] = useState(() =>
    Math.random().toString(36).slice(2)
  )

  const adapter: ClarityChatAdapter = {
    async chat(userMessages, options) {
      return {
        async *stream() {
          yield { type: 'text-delta' as const, content: '' }
        },
        messages: userMessages,
      }
    },
    on: () => () => {},
  }

  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMessage: ClarityChatMessage = {
        id: Math.random().toString(36).slice(2),
        role: 'user',
        content,
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setIsLoading(true)

      try {
        // Send message
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
        })

        const reader = response.body?.getReader()
        if (!reader) return

        let assistantContent = ''
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          assistantContent += decoder.decode(value)
        }

        const assistantMessage: ClarityChatMessage = {
          id: Math.random().toString(36).slice(2),
          role: 'assistant',
          content: assistantContent,
        }

        const finalMessages = [...updatedMessages, assistantMessage]
        setMessages(finalMessages)

        // Save to database
        setIsSaving(true)
        await fetch('/api/conversations/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            messages: finalMessages,
          }),
        })
        setIsSaving(false)
      } finally {
        setIsLoading(false)
      }
    },
    [messages, conversationId]
  )

  return (
    <ClarityChatProvider adapter={adapter}>
      <div className="flex h-screen flex-col bg-white">
        {/* Header with save indicator */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Chat with Auto-Save
              </h1>
            </div>
            {isSaving && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-600"></div>
                Saving...
              </div>
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            showHeader={false}
          />
        </div>
      </div>
    </ClarityChatProvider>
  )
}

/**
 * Example with authentication
 * This demonstrates how to integrate with NextAuth or similar
 */
export function NextJSWithAuthExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated] = useState(true) // In real app, check session

  const adapter: ClarityChatAdapter = {
    async chat(userMessages, options) {
      return {
        async *stream() {
          yield { type: 'text-delta' as const, content: '' }
        },
        messages: userMessages,
      }
    },
    on: () => () => {},
  }

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!isAuthenticated) {
        // Redirect to login or show auth dialog
        console.log('Not authenticated')
        return
      }

      const userMessage: ClarityChatMessage = {
        id: Math.random().toString(36).slice(2),
        role: 'user',
        content,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Session token is automatically sent as cookie
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        })

        if (response.status === 401) {
          // Handle token expiration
          console.log('Session expired')
          return
        }

        let assistantContent = ''
        if (response.body) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            assistantContent += decoder.decode(value)
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).slice(2),
            role: 'assistant',
            content: assistantContent,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isAuthenticated]
  )

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Authentication Required
          </h1>
          <p className="mt-2 text-gray-600">
            Please sign in to access the chat
          </p>
        </div>
      </div>
    )
  }

  return (
    <ClarityChatProvider adapter={adapter}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </ClarityChatProvider>
  )
}
