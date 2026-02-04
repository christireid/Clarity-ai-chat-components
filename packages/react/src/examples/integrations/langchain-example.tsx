/**
 * LangChain.js Integration Example
 *
 * Complete example showing how to integrate Clarity Chat components
 * with LangChain.js for advanced AI workflows including:
 * - Streaming responses with callbacks
 * - RAG (Retrieval Augmented Generation) patterns
 * - Tool chains and agents
 * - Memory management
 * - Custom prompt templates
 *
 * @example
 * ```tsx
 * import { LangChainIntegrationExample } from '@clarity-chat/react/examples/integrations'
 *
 * export function App() {
 *   return <LangChainIntegrationExample />
 * }
 * ```
 */

'use client'

import React, { useCallback, useState } from 'react'
import { ChatWindow } from '../../components/chat/ChatWindow'
import { ClarityChatProvider } from '../../context/ClarityChatProvider'
import type {
  ClarityChatMessage,
  ClarityChatAdapter,
  ClarityChatStreamChunk,
} from '../../adapters/types'

/**
 * Type definitions for LangChain integration
 */
interface LangChainMessage {
  _getType(): string
  content: string
}

interface LangChainRunnableConfig {
  callbacks?: {
    onToken?: (token: string) => void
    onFinal?: (text: string) => void
  }
}

/**
 * Convert LangChain messages to Clarity Chat format
 */
function toLanChainMessage(msg: ClarityChatMessage): LangChainMessage {
  return {
    _getType: () => msg.role,
    content: typeof msg.content === 'string' ? msg.content : '',
  }
}

/**
 * Convert Clarity Chat message to LangChain format
 */
function fromLangChainMessage(msg: any, id?: string): ClarityChatMessage {
  return {
    id: id || Math.random().toString(36).slice(2),
    role: (msg._getType?.() || 'assistant') as 'user' | 'assistant' | 'system',
    content: msg.content || '',
  }
}

/**
 * Create a Clarity Chat adapter for LangChain
 */
function createLangChainAdapter(runnable: any): ClarityChatAdapter {
  const messages: ClarityChatMessage[] = []
  const callbacks = new Map<string, Function>()

  return {
    async chat(userMessages, options): Promise<ClarityChatStreamableResponse> {
      const systemMsg = userMessages.find((m) => m.role === 'system')
      const chatHistory = userMessages.filter((m) => m.role !== 'system')

      let fullResponse = ''
      const chunks: ClarityChatStreamChunk[] = []

      return {
        async *stream() {
          try {
            // Configure streaming callbacks
            // Note: We collect chunks in the callback and yield them after invoke
            const config: LangChainRunnableConfig = {
              callbacks: {
                onToken: (token: string) => {
                  fullResponse += token
                  chunks.push({
                    type: 'text-delta',
                    content: token,
                  })
                },
                onFinal: (text: string) => {
                  fullResponse = text
                },
              },
            }

            // Convert messages to LangChain format
            const langchainMessages = chatHistory.map(toLanChainMessage)

            // Invoke the runnable with streaming
            const response = await runnable.invoke(
              {
                messages: langchainMessages,
                input: chatHistory[chatHistory.length - 1]?.content || '',
              },
              config
            )

            // Yield all collected chunks
            for (const chunk of chunks) {
              yield chunk
            }

            // Emit finish event
            yield {
              type: 'finish',
              finishReason: 'stop',
              usage: {
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
              },
            }
          } catch (error) {
            yield {
              type: 'error',
              error: error instanceof Error ? error : new Error(String(error)),
            }
          }
        },

        messages: [
          ...messages,
          {
            id: Math.random().toString(36).slice(2),
            role: 'assistant',
            content: fullResponse,
          },
        ],
      }
    },

    on(eventType, callback) {
      callbacks.set(eventType, callback)
      return () => callbacks.delete(eventType)
    },
  }
}

/**
 * Main LangChain integration example
 */
export function LangChainIntegrationExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [selectedModel, setSelectedModel] = useState('gpt-4')

  // Create adapter (in real app, this would use actual LangChain instance)
  const adapter = createLangChainAdapter(null)

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
        // In real implementation, would call actual LangChain chain
        const response = await fetch('/api/chat/langchain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            model: selectedModel,
            stream: true,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`)
        }

        let assistantContent = ''

        if (response.body) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.content) {
                    assistantContent += data.content
                  }
                } catch {
                  // Ignore parse errors
                }
              }
            }
          }
        }

        const assistantMessage: ClarityChatMessage = {
          id: Math.random().toString(36).slice(2),
          role: 'assistant',
          content: assistantContent,
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    },
    [messages, selectedModel]
  )

  return (
    <ClarityChatProvider adapter={adapter}>
      <div className="flex h-screen flex-col bg-white">
        {/* Header with model selector */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Clarity Chat with LangChain
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Streaming AI responses with LangChain.js
              </p>
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
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
 * RAG (Retrieval Augmented Generation) example
 */
export function LangChainRAGExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sources, setSources] = useState<string[]>([])

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
        // Call RAG endpoint
        const response = await fetch('/api/chat/rag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: content,
            conversationHistory: messages,
          }),
        })

        const data = await response.json()

        const assistantMessage: ClarityChatMessage = {
          id: Math.random().toString(36).slice(2),
          role: 'assistant',
          content: data.answer,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setSources(data.sources || [])
      } finally {
        setIsLoading(false)
      }
    },
    [messages]
  )

  return (
    <ClarityChatProvider adapter={createLangChainAdapter(null)}>
      <div className="flex h-screen flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">
            RAG Chat with LangChain
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Chat with document retrieval and context
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

        {/* Sources panel */}
        {sources.length > 0 && (
          <div className="border-t border-gray-200 bg-blue-50 px-6 py-4">
            <p className="text-sm font-medium text-blue-900">
              Sources ({sources.length})
            </p>
            <ul className="mt-2 space-y-1">
              {sources.map((source, idx) => (
                <li key={idx} className="text-xs text-blue-800">
                  • {source}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ClarityChatProvider>
  )
}

/**
 * Agent example with tool calling
 */
export function LangChainAgentExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [toolCalls, setToolCalls] = useState<
    Array<{ tool: string; args: Record<string, any> }>
  >([])

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
        // Call agent endpoint
        const response = await fetch('/api/chat/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: content,
            conversationHistory: messages,
          }),
        })

        const data = await response.json()

        const assistantMessage: ClarityChatMessage = {
          id: Math.random().toString(36).slice(2),
          role: 'assistant',
          content: data.output,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setToolCalls(data.toolCalls || [])
      } finally {
        setIsLoading(false)
      }
    },
    [messages]
  )

  return (
    <ClarityChatProvider adapter={createLangChainAdapter(null)}>
      <div className="flex h-screen flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Agent Chat with LangChain
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            AI agent with tool calling capabilities
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

        {/* Tool calls panel */}
        {toolCalls.length > 0 && (
          <div className="border-t border-purple-200 bg-purple-50 px-6 py-4 max-h-32 overflow-y-auto">
            <p className="text-sm font-medium text-purple-900">
              Tool Calls ({toolCalls.length})
            </p>
            <div className="mt-2 space-y-2">
              {toolCalls.map((call, idx) => (
                <div key={idx} className="rounded bg-white p-2 text-xs">
                  <p className="font-mono text-purple-700">{call.tool}</p>
                  <p className="text-gray-600">
                    {JSON.stringify(call.args, null, 2).slice(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ClarityChatProvider>
  )
}

export type { ClarityChatStreamableResponse } from '../../adapters/types'
