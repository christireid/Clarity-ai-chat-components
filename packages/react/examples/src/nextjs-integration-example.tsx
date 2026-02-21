/**
 * Next.js Integration Example
 * 
 * Example demonstrating useClarityChat integration with Next.js App Router,
 * including API route setup, server actions, and client components.
 * 
 * @example
 * ```tsx
 * // app/chat/page.tsx
 * import { ChatPage } from '@clarity-chat/react/examples/nextjs-integration-example'
 * 
 * export default function Page() {
 *   return <ChatPage />
 * }
 * ```
 */

'use client'

import * as React from 'react'
import {
  useClarityChat,
  ChatWindow,
  convertCoreMessagesToMessages,
  MemoryProvider,
} from '@clarity-chat/react'

/**
 * Next.js Chat Page Component
 * 
 * Demonstrates useClarityChat in a Next.js App Router client component.
 */
export function ChatPage() {
  const { messages, append, isLoading, memoryInfo } = useClarityChat({
    // Use Next.js API route
    api: '/api/chat',
    // Optional: Add headers for authentication
    headers: {
      // Next.js automatically includes cookies
    },
    // Optional: Enable memory
    memory: {
      enabled: true,
      strategy: 'vector-store',
    },
  })

  const chatMessages = React.useMemo(
    () => convertCoreMessagesToMessages(messages),
    [messages]
  )

  return (
    <div className="container mx-auto h-screen flex flex-col">
      <ChatWindow
        messages={chatMessages}
        onSendMessage={(content) => append({ role: 'user', content })}
        isLoading={isLoading}
        showHeader={true}
        sessionTitle="Next.js Chat"
        sessionSubtitle={`Memory: ${memoryInfo.memoryCount} items`}
      />
    </div>
  )
}

/**
 * Next.js Chat Page with Memory Provider
 * 
 * Wraps the chat page with MemoryProvider for memory features.
 */
export function ChatPageWithMemory() {
  return (
    <MemoryProvider
      config={{
        maxMemories: 1000,
        enableVectorSearch: true,
      }}
    >
      <ChatPage />
    </MemoryProvider>
  )
}

/**
 * Example Next.js API Route Handler
 * 
 * Place this in: app/api/chat/route.ts
 * 
 * @example
 * ```tsx
 * // app/api/chat/route.ts
 * import { NextRequest } from 'next/server'
 * import { streamText } from 'ai'
 * import { openai } from '@ai-sdk/openai'
 * 
 * export async function POST(req: NextRequest) {
 *   const { messages } = await req.json()
 * 
 *   const result = streamText({
 *     model: openai('gpt-4'),
 *     messages,
 *   })
 * 
 *   return result.toDataStreamResponse()
 * }
 * ```
 */

/**
 * Example Next.js Server Action
 * 
 * Alternative approach using Server Actions
 * 
 * @example
 * ```tsx
 * // app/actions/chat.ts
 * 'use server'
 * 
 * import { streamText } from 'ai'
 * import { openai } from '@ai-sdk/openai'
 * 
 * export async function chatAction(messages: Message[]) {
 *   const result = streamText({
 *     model: openai('gpt-4'),
 *     messages,
 *   })
 * 
 *   return result.toDataStreamResponse()
 * }
 * ```
 */

/**
 * Next.js Middleware Example
 * 
 * For authentication and request handling
 * 
 * @example
 * ```tsx
 * // middleware.ts
 * import { NextResponse } from 'next/server'
 * import type { NextRequest } from 'next/server'
 * 
 * export function middleware(request: NextRequest) {
 *   // Add authentication headers
 *   const requestHeaders = new Headers(request.headers)
 *   requestHeaders.set('x-user-id', request.cookies.get('userId')?.value || '')
 * 
 *   return NextResponse.next({
 *     request: {
 *       headers: requestHeaders,
 *     },
 *   })
 * }
 * 
 * export const config = {
 *   matcher: '/api/chat/:path*',
 * }
 * ```
 */
