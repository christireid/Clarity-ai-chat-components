/**
 * Remix Integration Example
 *
 * Complete example showing how to integrate Clarity Chat components
 * with Remix for a modern full-stack chat application with:
 * - Server-side loader functions for data fetching
 * - Form actions for handling submissions
 * - Server-side streaming with Remix's defer/Await
 * - Error boundaries
 * - Optimistic UI updates
 * - Data synchronization between client and server
 *
 * File structure:
 * ```
 * routes/
 *   chat.tsx                  (Route component)
 *   api.chat.ts               (Action/Loader)
 *   api.chat.history.ts       (Data endpoint)
 * ```
 *
 * @example
 * ```tsx
 * // In your routes/chat.tsx
 * import { RemixIntegrationExample } from '@clarity-chat/react/examples/integrations'
 *
 * export default RemixIntegrationExample
 * ```
 */

'use client'

import React, { useCallback, useState, useRef } from 'react'
import { ChatWindow } from '../../components/chat/ChatWindow'
import { ClarityChatProvider } from '../../context/ClarityChatProvider'
import type { ClarityChatMessage, ClarityChatAdapter } from '../../adapters/types'

/**
 * Types for Remix integration
 */
interface RemixChatLoaderData {
  conversationId: string
  initialMessages: ClarityChatMessage[]
  userPreferences: {
    theme: 'light' | 'dark'
    model: string
  }
}

interface RemixChatActionData {
  success: boolean
  message?: ClarityChatMessage
  error?: string
}

/**
 * Remix Loader - fetch initial data on server
 * This would be in your routes/chat.tsx or routes/api.chat.ts
 *
 * @example
 * ```typescript
 * import { json } from '@remix-run/node'
 * import type { LoaderFunctionArgs } from '@remix-run/node'
 *
 * export async function loader({ request, params }: LoaderFunctionArgs) {
 *   const session = await getSession(request.headers.get('Cookie'))
 *   if (!session) {
 *     throw redirect('/login')
 *   }
 *
 *   const conversationId = params.id || generateId()
 *   const messages = await db.getMessages(conversationId, session.userId)
 *
 *   return json<RemixChatLoaderData>({
 *     conversationId,
 *     initialMessages: messages,
 *     userPreferences: {
 *       theme: session.preferences?.theme || 'light',
 *       model: session.preferences?.model || 'claude-3-5-sonnet',
 *     },
 *   })
 * }
 * ```
 */
export const remixLoaderExample = `
import { json } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  if (!session) {
    throw redirect('/login')
  }

  const conversationId = params.id || generateId()
  const messages = await db.getMessages(conversationId, session.userId)

  return json({
    conversationId,
    initialMessages: messages,
    userPreferences: {
      theme: session.preferences?.theme || 'light',
      model: session.preferences?.model || 'claude-3-5-sonnet',
    },
  })
}
`

/**
 * Remix Action - handle form submissions (POST)
 * This would be in your routes/api.chat.ts
 *
 * @example
 * ```typescript
 * import { json } from '@remix-run/node'
 * import type { ActionFunctionArgs } from '@remix-run/node'
 *
 * export async function action({ request }: ActionFunctionArgs) {
 *   if (request.method !== 'POST') {
 *     return json({ error: 'Method not allowed' }, { status: 405 })
 *   }
 *
 *   const session = await getSession(request.headers.get('Cookie'))
 *   if (!session) {
 *     return json({ error: 'Unauthorized' }, { status: 401 })
 *   }
 *
 *   const { conversationId, message } = await request.json()
 *
 *   // Save user message
 *   await db.saveMessage(conversationId, {
 *     role: 'user',
 *     content: message,
 *     userId: session.userId,
 *   })
 *
 *   // Call AI model
 *   const response = await callAI(message, conversationId)
 *
 *   // Save AI response
 *   await db.saveMessage(conversationId, {
 *     role: 'assistant',
 *     content: response,
 *   })
 *
 *   return json({ success: true, message: response })
 * }
 * ```
 */
export const remixActionExample = `
import { json } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  const session = await getSession(request.headers.get('Cookie'))
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { conversationId, message } = await request.json()

  // Save user message
  await db.saveMessage(conversationId, {
    role: 'user',
    content: message,
    userId: session.userId,
  })

  // Call AI model
  const response = await callAI(message, conversationId)

  // Save AI response
  await db.saveMessage(conversationId, {
    role: 'assistant',
    content: response,
  })

  return json({ success: true, message: response })
}
`

/**
 * Main Remix integration example component
 * This would be in your routes/chat.tsx
 */
export function RemixIntegrationExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const conversationIdRef = useRef<string>(
    Math.random().toString(36).slice(2)
  )
  const [model, setModel] = useState('claude-3-5-sonnet-20241022')

  // Create adapter
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

      try {
        // Submit to Remix action
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: conversationIdRef.current,
            message: content,
            model,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`)
        }

        const data = (await response.json()) as RemixChatActionData

        if (!data.success || !data.message) {
          throw new Error(data.error || 'Failed to get response')
        }

        setMessages((prev) => [...prev, data.message!])
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error(String(err))
        )
      } finally {
        setIsLoading(false)
      }
    },
    [model]
  )

  return (
    <ClarityChatProvider adapter={adapter}>
      <div className="flex h-screen flex-col bg-white">
        {/* Header with model selector */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Remix Chat Integration
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Full-stack chat with Remix
              </p>
            </div>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="claude-3-5-sonnet-20241022">
                Claude 3.5 Sonnet
              </option>
              <option value="claude-3-opus-20250219">Claude 3 Opus</option>
              <option value="gpt-4">GPT-4</option>
            </select>
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
 * Remix with streaming example
 * This demonstrates using Remix's streaming capabilities
 */
export function RemixStreamingExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        })

        let assistantContent = ''

        if (response.body) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            assistantContent += chunk

            // Update UI with partial response
            setMessages((prev) => {
              const newMessages = [...prev]
              const lastMsg = newMessages[newMessages.length - 1]

              if (lastMsg?.role === 'assistant') {
                newMessages[newMessages.length - 1] = {
                  ...lastMsg,
                  content: assistantContent,
                }
              } else {
                newMessages.push({
                  id: Math.random().toString(36).slice(2),
                  role: 'assistant',
                  content: assistantContent,
                })
              }

              return newMessages
            })
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
    [messages]
  )

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

/**
 * Remix with optimistic UI example
 * This demonstrates optimistic updates for better UX
 */
export function RemixOptimisticExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [optimisticMessages, setOptimisticMessages] = useState<
    ClarityChatMessage[]
  >([])
  const [isLoading, setIsLoading] = useState(false)

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

      // Optimistic update: show message immediately
      setOptimisticMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, optimisticMessages, userMessage],
          }),
        })

        const data = await response.json()

        // Update after server confirmation
        setMessages((prev) => [
          ...prev,
          ...optimisticMessages,
          userMessage,
          {
            id: Math.random().toString(36).slice(2),
            role: 'assistant',
            content: data.message,
          },
        ])

        setOptimisticMessages([])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, optimisticMessages]
  )

  const displayMessages = [...messages, ...optimisticMessages]

  return (
    <ClarityChatProvider adapter={adapter}>
      <ChatWindow
        messages={displayMessages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </ClarityChatProvider>
  )
}

/**
 * Remix with Error Boundary
 * This demonstrates error handling in Remix
 *
 * @example
 * ```typescript
 * // In routes/chat.tsx
 *
 * export function ErrorBoundary() {
 *   const error = useRouteError()
 *
 *   return (
 *     <div className="flex h-screen items-center justify-center bg-red-50">
 *       <div className="text-center">
 *         <h1 className="text-2xl font-bold text-red-900">
 *           Something went wrong
 *         </h1>
 *         <p className="mt-2 text-red-700">
 *           {isRouteErrorResponse(error) ? (
 *             <>
 *               {error.status} {error.statusText}
 *               <p>{error.data}</p>
 *             </>
 *           ) : error instanceof Error ? (
 *             error.message
 *           ) : (
 *             'Unknown error'
 *           )}
 *         </p>
 *       </div>
 *     </div>
 *   )
 * }
 * ```
 */
export const remixErrorBoundaryExample = `
import { useRouteError, isRouteErrorResponse } from '@remix-run/react'

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <div className="flex h-screen items-center justify-center bg-red-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-red-700">
          {isRouteErrorResponse(error) ? (
            <>
              {error.status} {error.statusText}
              <p>{error.data}</p>
            </>
          ) : error instanceof Error ? (
            error.message
          ) : (
            'Unknown error'
          )}
        </p>
      </div>
    </div>
  )
}
`

/**
 * Remix with session persistence
 * This demonstrates saving and loading chat history
 */
export function RemixPersistenceExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationTitle, setConversationTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)

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

      const allMessages = [...messages, userMessage]
      setMessages(allMessages)
      setIsLoading(true)

      try {
        // Generate response
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: allMessages }),
        })

        const data = await response.json()

        const assistantMessage: ClarityChatMessage = {
          id: Math.random().toString(36).slice(2),
          role: 'assistant',
          content: data.message,
        }

        const finalMessages = [...allMessages, assistantMessage]
        setMessages(finalMessages)

        // Auto-generate title if needed
        if (!conversationTitle && finalMessages.length === 2) {
          setIsSaving(true)
          const titleResponse = await fetch('/api/chat/title', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [finalMessages[0]],
            }),
          })
          const titleData = await titleResponse.json()
          setConversationTitle(titleData.title)
          setIsSaving(false)
        }

        // Save conversation
        setIsSaving(true)
        await fetch('/api/conversations/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: conversationTitle,
            messages: finalMessages,
          }),
        })
        setIsSaving(false)
      } finally {
        setIsLoading(false)
      }
    },
    [messages, conversationTitle]
  )

  return (
    <ClarityChatProvider adapter={adapter}>
      <div className="flex h-screen flex-col">
        {/* Header with title and save status */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={conversationTitle}
              onChange={(e) => setConversationTitle(e.target.value)}
              placeholder="Conversation title..."
              className="text-lg font-semibold text-gray-900 outline-none"
            />
            {isSaving && (
              <span className="text-xs text-gray-600">Saving...</span>
            )}
          </div>
        </div>

        {/* Chat */}
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
