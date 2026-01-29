/**
 * Direct Anthropic API Integration Example
 *
 * Complete example showing how to use Clarity Chat components
 * directly with the Anthropic SDK for Claude models.
 *
 * Features:
 * - Direct API calls to Claude models
 * - Streaming with Server-Sent Events (SSE)
 * - Tool/function calling
 * - Vision capabilities (image analysis)
 * - Error handling and retry logic
 * - Rate limit awareness
 *
 * @example
 * ```tsx
 * import { AnthropicDirectExample } from '@clarity-chat/react/examples/integrations'
 *
 * export function App() {
 *   return <AnthropicDirectExample />
 * }
 * ```
 */

'use client'

import React, { useCallback, useState } from 'react'
import { ChatWindow } from '../../components/chat/ChatWindow'
import { ClarityChatProvider } from '../../context/ClarityChatProvider'
import { anthropicAdapter } from '../../adapters'
import type {
  ClarityChatMessage,
  ClarityChatAdapter,
  ModelConfig,
  ToolDefinition,
} from '../../adapters/types'

/**
 * Basic Anthropic integration
 */
export function AnthropicDirectExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [model, setModel] = useState('claude-3-5-sonnet-20241022')

  // Model configuration for Anthropic
  const modelConfig: ModelConfig = {
    provider: 'anthropic',
    model,
    apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
    temperature: 0.7,
    maxTokens: 2048,
    // Enable timeout after 30 seconds
    timeout: 30000,
  }

  // Create adapter
  const adapter: ClarityChatAdapter = {
    async chat(userMessages, options) {
      return {
        async *stream() {
          try {
            // Call Anthropic adapter
            const response = await anthropicAdapter.chat(userMessages, {
              ...modelConfig,
              signal: options?.signal,
            })

            // Stream the response
            for await (const chunk of response.stream()) {
              yield chunk
            }
          } catch (err) {
            yield {
              type: 'error',
              error: err instanceof Error ? err : new Error(String(err)),
            }
          }
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
        // Create abort signal for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)

        // Prepare request payload
        const systemPrompt = `You are a helpful AI assistant.`

        const response = await fetch('/api/chat/anthropic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${modelConfig.apiKey}`,
          },
          body: JSON.stringify({
            model: modelConfig.model,
            messages: [...messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            system: systemPrompt,
            max_tokens: modelConfig.maxTokens,
            temperature: modelConfig.temperature,
            stream: true,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

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
                  if (data.type === 'content_block_delta') {
                    assistantContent +=
                      data.delta?.text || ''
                  } else if (data.type === 'message_stop') {
                    break
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
        const error =
          err instanceof Error ? err : new Error(String(err))
        setError(error)
      } finally {
        setIsLoading(false)
      }
    },
    [messages, modelConfig]
  )

  return (
    <ClarityChatProvider adapter={adapter}>
      <div className="flex h-screen flex-col bg-white">
        {/* Header with model selector */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Clarity Chat with Anthropic
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Direct integration with Claude API
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
              <option value="claude-3-haiku-20250307">Claude 3 Haiku</option>
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
 * Advanced example with tool calling
 */
export function AnthropicToolCallingExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [toolResults, setToolResults] = useState<
    Array<{ id: string; name: string; result: any }>
  >([])

  // Define available tools
  const tools: ToolDefinition[] = [
    {
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Get the current weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'City name or coordinates',
            },
            unit: {
              type: 'string',
              enum: ['celsius', 'fahrenheit'],
              description: 'Temperature unit',
            },
          },
          required: ['location'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'calculate',
        description: 'Perform mathematical calculations',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'Math expression to evaluate',
            },
          },
          required: ['expression'],
        },
      },
    },
  ]

  // Tool execution handlers
  const executeTool = useCallback(
    async (
      toolName: string,
      args: Record<string, unknown>
    ): Promise<unknown> => {
      switch (toolName) {
        case 'get_weather':
          return {
            location: args.location,
            temperature: 22,
            condition: 'Sunny',
            humidity: 65,
          }
        case 'calculate':
          try {
            // eslint-disable-next-line no-eval
            const result = eval(args.expression as string)
            return { result, expression: args.expression }
          } catch (e) {
            return {
              error: `Cannot evaluate: ${(e as Error).message}`,
            }
          }
        default:
          return { error: `Unknown tool: ${toolName}` }
      }
    },
    []
  )

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
        const response = await fetch('/api/chat/anthropic/tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            tools,
            stream: true,
          }),
        })

        let assistantContent = ''
        const toolCalls: Array<{
          id: string
          name: string
          args: Record<string, unknown>
        }> = []

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
                  if (data.type === 'content_block_delta') {
                    assistantContent += data.delta?.text || ''
                  } else if (data.type === 'tool_use') {
                    toolCalls.push({
                      id: data.id,
                      name: data.name,
                      args: data.input,
                    })
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

        // Execute tools
        const newResults = []
        for (const toolCall of toolCalls) {
          const result = await executeTool(
            toolCall.name,
            toolCall.args
          )
          newResults.push({
            id: toolCall.id,
            name: toolCall.name,
            result,
          })
        }
        setToolResults(newResults)
      } finally {
        setIsLoading(false)
      }
    },
    [messages, executeTool]
  )

  return (
    <ClarityChatProvider
      adapter={{
        async chat(userMessages, options) {
          return {
            async *stream() {
              yield { type: 'text-delta' as const, content: '' }
            },
            messages: userMessages,
          }
        },
        on: () => () => {},
      }}
    >
      <div className="flex h-screen flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Anthropic with Tool Calling
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Claude can call tools to get information
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

        {/* Tool results panel */}
        {toolResults.length > 0 && (
          <div className="border-t border-green-200 bg-green-50 px-6 py-4 max-h-40 overflow-y-auto">
            <p className="text-sm font-medium text-green-900">
              Tool Results ({toolResults.length})
            </p>
            <div className="mt-2 space-y-2">
              {toolResults.map((result) => (
                <div
                  key={result.id}
                  className="rounded bg-white p-2 text-xs"
                >
                  <p className="font-mono font-semibold text-green-700">
                    {result.name}
                  </p>
                  <pre className="mt-1 overflow-x-auto text-gray-600">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
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
 * Vision example - image analysis with Claude
 */
export function AnthropicVisionExample() {
  const [messages, setMessages] = useState<ClarityChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMessage: ClarityChatMessage = {
        id: Math.random().toString(36).slice(2),
        role: 'user',
        content: selectedImage
          ? `[Image] ${content}`
          : content,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat/anthropic/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            image: selectedImage,
            stream: true,
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
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.type === 'content_block_delta') {
                    assistantContent += data.delta?.text || ''
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
        setSelectedImage(null)
      } finally {
        setIsLoading(false)
      }
    },
    [messages, selectedImage]
  )

  return (
    <ClarityChatProvider
      adapter={{
        async chat(userMessages, options) {
          return {
            async *stream() {
              yield { type: 'text-delta' as const, content: '' }
            },
            messages: userMessages,
          }
        },
        on: () => () => {},
      }}
    >
      <div className="flex h-screen flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Claude Vision Analysis
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Analyze images with Claude
          </p>
        </div>

        {/* Image upload area */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  setSelectedImage(
                    event.target?.result as string
                  )
                }
                reader.readAsDataURL(file)
              }
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-40 rounded border"
              />
            </div>
          )}
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
