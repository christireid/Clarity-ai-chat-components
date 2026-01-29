/**
 * Vercel AI SDK Integration Example
 *
 * Complete example showing how to integrate Clarity Chat components
 * with Vercel AI SDK's useChat hook.
 *
 * Features:
 * - Client-side message management with useChat
 * - Streaming support via SSE
 * - Tool/function calling support
 * - Error handling and loading states
 * - Message attachments (images, files)
 *
 * @example
 * ```tsx
 * import { VercelAIIntegrationExample } from '@clarity-chat/react/examples/integrations'
 *
 * export function App() {
 *   return <VercelAIIntegrationExample />
 * }
 * ```
 */

'use client'

import React, { useCallback, useState } from 'react'
import { useChat } from 'ai/react'
import { ChatWindow } from '../../components/chat/ChatWindow'
import { createVercelAIAdapter } from '../../adapters/vercel-ai'
import { ClarityChatProvider } from '../../context/ClarityChatProvider'

/**
 * Main integration example component
 */
export function VercelAIIntegrationExample() {
  // Initialize Vercel AI's useChat hook
  // This handles message state, streaming, and API communication
  const chat = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
    },
    // Enable experimental features if available
    experimental_useUrlSearchParams: true,
  })

  // Create adapter to bridge Vercel AI with Clarity Chat
  const adapter = createVercelAIAdapter({ chat })

  // Handle sending messages
  const handleSendMessage = useCallback(
    async (content: string) => {
      try {
        // Vercel AI's append method returns the response
        await chat.append({
          role: 'user',
          content,
        })
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    },
    [chat]
  )

  // Handle clearing conversation
  const handleClear = useCallback(() => {
    chat.setMessages([])
  }, [chat])

  return (
    <ClarityChatProvider adapter={adapter}>
      <div className="flex h-screen flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Clarity Chat with Vercel AI
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Using Vercel AI SDK with Clarity Chat components
          </p>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={chat.messages.map((msg) => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant' | 'system',
              content: msg.content,
              createdAt: msg.createdAt,
            }))}
            isLoading={chat.isLoading}
            onSendMessage={handleSendMessage}
            onClear={handleClear}
            showHeader={false}
          />
        </div>

        {/* Error display */}
        {chat.error && (
          <div className="border-t border-red-200 bg-red-50 px-6 py-4">
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="mt-1 text-sm text-red-800">{chat.error.message}</p>
            <button
              onClick={() => chat.reload()}
              className="mt-3 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </ClarityChatProvider>
  )
}

/**
 * Minimal Vercel AI integration
 * Demonstrates the simplest possible setup
 */
export function MinimalVercelAIExample() {
  const chat = useChat({ api: '/api/chat' })
  const adapter = createVercelAIAdapter({ chat })

  return (
    <ClarityChatProvider adapter={adapter}>
      <ChatWindow
        messages={chat.messages.map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        }))}
        isLoading={chat.isLoading}
        onSendMessage={async (content) => {
          await chat.append({ role: 'user', content })
        }}
      />
    </ClarityChatProvider>
  )
}

/**
 * Advanced example with tool handling and attachments
 */
export function AdvancedVercelAIExample() {
  const chat = useChat({
    api: '/api/chat',
    // Define available tools for the AI model
    tools: [
      {
        id: 'get_weather',
        description: 'Get weather information for a location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'City name',
            },
          },
        },
      },
    ],
  })

  const adapter = createVercelAIAdapter({ chat })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Handle file attachment
  const handleAttachFile = useCallback((file: File) => {
    setSelectedFile(file)
  }, [])

  // Send message with attachment
  const handleSendWithAttachment = useCallback(
    async (content: string) => {
      if (selectedFile) {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('message', content)

        await fetch('/api/chat', {
          method: 'POST',
          body: formData,
        })
          .then((res) => res.json())
          .then(() => {
            setSelectedFile(null)
          })
      } else {
        await chat.append({ role: 'user', content })
      }
    },
    [chat, selectedFile]
  )

  return (
    <ClarityChatProvider adapter={adapter}>
      <div className="flex h-screen flex-col">
        {/* File attachment UI */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={(e) => e.target.files?.[0] && handleAttachFile(e.target.files[0])}
              className="rounded border border-gray-300 px-3 py-2 text-sm"
            />
            {selectedFile && (
              <span className="text-sm text-gray-600">
                Selected: {selectedFile.name}
              </span>
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1">
          <ChatWindow
            messages={chat.messages.map((msg) => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant' | 'system',
              content: msg.content,
            }))}
            isLoading={chat.isLoading}
            onSendMessage={handleSendWithAttachment}
          />
        </div>

        {/* Tool calls display */}
        {chat.messages.some((msg) => msg.toolInvocations?.length) && (
          <div className="border-t border-gray-200 bg-blue-50 px-6 py-4">
            <p className="text-sm font-medium text-blue-900">Tool Calls</p>
            <div className="mt-2 space-y-2">
              {chat.messages
                .flatMap((msg) => msg.toolInvocations || [])
                .map((tool, idx) => (
                  <div
                    key={idx}
                    className="rounded bg-white p-3 text-xs font-mono text-gray-700"
                  >
                    {tool.toolName}:{' '}
                    {JSON.stringify(tool.args, null, 2).slice(0, 100)}...
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </ClarityChatProvider>
  )
}

/**
 * Example with custom endpoint and headers
 */
export function CustomEndpointVercelAIExample() {
  const chat = useChat({
    // Custom API endpoint
    api: process.env.REACT_APP_API_URL || '/api/chat',
    // Custom headers (e.g., for authentication)
    headers: {
      'X-Custom-Header': 'custom-value',
      'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
  })

  const adapter = createVercelAIAdapter({
    chat,
    // Additional adapter options
    apiEndpoint: process.env.REACT_APP_API_URL,
    headers: {
      'X-Request-ID': Math.random().toString(36).slice(2),
    },
  })

  return (
    <ClarityChatProvider adapter={adapter}>
      <ChatWindow
        messages={chat.messages.map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        }))}
        isLoading={chat.isLoading}
        onSendMessage={async (content) => {
          await chat.append({ role: 'user', content })
        }}
      />
    </ClarityChatProvider>
  )
}
