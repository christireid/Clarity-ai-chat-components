import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatWindow, ChatInput, ThinkingIndicator } from '@clarity-chat/react'
import { Message } from '@clarity-chat/react'
import { StatusBadge } from '../../../.storybook/blocks'
import React, { useState, useRef } from 'react'

const meta: Meta = {
  title: 'Patterns/AI/Streaming Responses',
  parameters: {
    docs: {
      description: {
        component: `
# Streaming Responses Pattern

Learn how to implement streaming AI responses for better user experience. This pattern demonstrates progressive text rendering as tokens arrive.

## Problem

Users must wait for the entire AI response to complete before seeing any output. For long responses (30+ seconds), this creates a poor experience.

## Solution

Stream tokens as they're generated and render them progressively:
1. Start rendering immediately upon first token
2. Show typing indicator before streaming starts
3. Allow cancellation mid-stream
4. Handle network errors gracefully
5. Maintain message integrity on completion

## Key Benefits

- **Better UX** - Users see progress immediately
- **Perceived Performance** - Feels 3-5x faster
- **Cancellation** - Stop unwanted responses
- **Error Recovery** - Graceful failure handling
- **Lower Latency** - First token in ~200ms vs full response in 30s

## Implementation Approaches

1. **Server-Sent Events (SSE)** - Simple, one-way streaming
2. **WebSockets** - Bidirectional, real-time
3. **ReadableStream** - Fetch API streaming
4. **Custom Protocol** - Advanced use cases
        `,
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Simulated streaming function
const simulateStreamingResponse = (
  message: string,
  onToken: (token: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): void => {
  const response = generateResponse(message)
  const words = response.split(' ')
  let currentIndex = 0

  const streamInterval = setInterval(
    () => {
      if (signal?.aborted) {
        clearInterval(streamInterval)
        onComplete()
        return
      }

      if (currentIndex >= words.length) {
        clearInterval(streamInterval)
        onComplete()
        return
      }

      // Simulate occasional errors (5% chance)
      if (Math.random() < 0.05 && currentIndex > words.length / 2) {
        clearInterval(streamInterval)
        onError(new Error('Network connection lost'))
        return
      }

      const token = (currentIndex === 0 ? '' : ' ') + words[currentIndex]
      onToken(token)
      currentIndex++
    },
    50 + Math.random() * 100
  ) // Variable token timing
}

const generateResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('explain') && lowerMessage.includes('streaming')) {
    return 'Streaming responses work by sending text tokens as they are generated, rather than waiting for the complete response. This is achieved through Server-Sent Events (SSE) or WebSocket connections. The key benefit is improved perceived performance - users see progress immediately instead of staring at a loading indicator. Implementation involves maintaining a persistent connection, handling partial text updates, and gracefully managing connection errors or cancellations.'
  }

  if (lowerMessage.includes('code') || lowerMessage.includes('example')) {
    return 'Here is a basic implementation of streaming in React: First, establish a connection to your streaming endpoint using fetch with a ReadableStream. Then, create a reader from the response body and process chunks as they arrive. Update your UI state with each token, building up the complete message progressively. Make sure to handle cleanup properly to avoid memory leaks, and provide a way for users to cancel the stream if needed.'
  }

  return (
    'I understand you are asking about "' +
    message +
    '". Streaming responses provide a better user experience by showing progress in real-time. Instead of waiting 30 seconds for a complete answer, users see text appearing word by word, similar to how humans type. This makes the interaction feel more natural and responsive. The technical implementation uses protocols like Server-Sent Events or WebSockets to maintain a connection and transmit data progressively.'
  )
}

export const BasicStreaming: Story = {
  render: () => {
    const [messages, setMessages] = useState([
      {
        id: '1',
        role: 'assistant' as const,
        content:
          'Hello! Ask me anything and watch my response stream in real-time.',
        timestamp: new Date(Date.now() - 60000),
      },
    ])
    const [input, setInput] = useState('')
    const [isStreaming, setIsStreaming] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)

    const handleSubmit = () => {
      if (!input.trim() || isStreaming) return

      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: input,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInput('')

      // Create assistant message placeholder
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant' as const,
        content: '',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Start streaming
      setIsStreaming(true)
      abortControllerRef.current = new AbortController()

      simulateStreamingResponse(
        input,
        // On token received
        (token) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + token }
                : msg
            )
          )
        },
        // On complete
        () => {
          setIsStreaming(false)
          abortControllerRef.current = null
        },
        // On error
        (error) => {
          setIsStreaming(false)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: msg.content + '\n\n[Error: ' + error.message + ']',
                  }
                : msg
            )
          )
          abortControllerRef.current = null
        },
        abortControllerRef.current.signal
      )
    }

    const handleCancel = () => {
      abortControllerRef.current?.abort()
      setIsStreaming(false)
    }

    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">Basic Streaming</h2>
            <StatusBadge status="stable" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Watch responses stream in real-time as tokens are generated. Notice
            how text appears progressively.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          <ChatWindow className="h-[600px]">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}
                {isStreaming &&
                  messages[messages.length - 1]?.content === '' && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium">
                        AI
                      </div>
                      <ThinkingIndicator />
                    </div>
                  )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <ChatInput
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onSubmit={handleSubmit}
                      placeholder="Ask a question to see streaming..."
                      disabled={isStreaming}
                    />
                  </div>
                  {isStreaming && (
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </ChatWindow>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-3">Try These Questions</h3>
            <ul className="space-y-2 text-sm">
              <li>"Explain how streaming works"</li>
              <li>"Show me a code example"</li>
              <li>"What are the benefits of streaming?"</li>
              <li>"How do I handle errors?"</li>
            </ul>
          </div>

          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold mb-3">
              Features Demonstrated
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Progressive text rendering</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Cancellation support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Error handling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Typing indicators</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic streaming implementation with token-by-token rendering and cancellation support.',
      },
    },
  },
}

export const WithRetryAndRegenerate: Story = {
  render: () => {
    const [messages, setMessages] = useState([
      {
        id: '1',
        role: 'assistant' as const,
        content:
          'I can help you with streaming responses. Try asking a question, and you can regenerate responses if needed.',
        timestamp: new Date(Date.now() - 120000),
      },
    ])
    const [input, setInput] = useState('')
    const [isStreaming, setIsStreaming] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)
    const [streamStats, setStreamStats] = useState({
      tokensReceived: 0,
      duration: 0,
    })

    const startStreaming = (userInput: string) => {
      const assistantMessageId = Date.now().toString()
      const startTime = Date.now()
      let tokenCount = 0

      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant' as const,
        content: '',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      setIsStreaming(true)
      setStreamStats({ tokensReceived: 0, duration: 0 })
      abortControllerRef.current = new AbortController()

      simulateStreamingResponse(
        userInput,
        (token) => {
          tokenCount++
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + token }
                : msg
            )
          )
          setStreamStats({
            tokensReceived: tokenCount,
            duration: Math.round((Date.now() - startTime) / 1000),
          })
        },
        () => {
          setIsStreaming(false)
          abortControllerRef.current = null
        },
        (error) => {
          setIsStreaming(false)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content:
                      msg.content +
                      '\n\n[Error: ' +
                      error.message +
                      ' - Click Retry to try again]',
                  }
                : msg
            )
          )
          abortControllerRef.current = null
        },
        abortControllerRef.current.signal
      )
    }

    const handleSubmit = () => {
      if (!input.trim() || isStreaming) return

      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: input,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])

      const currentInput = input
      setInput('')
      startStreaming(currentInput)
    }

    const handleRegenerate = (messageId: string) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId)
      if (messageIndex === -1 || messageIndex === 0) return

      const previousUserMessage = messages[messageIndex - 1]
      if (previousUserMessage.role !== 'user') return

      // Remove the assistant message and regenerate
      setMessages((prev) => prev.slice(0, messageIndex))
      startStreaming(previousUserMessage.content)
    }

    const handleCancel = () => {
      abortControllerRef.current?.abort()
      setIsStreaming(false)
    }

    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">With Retry & Regenerate</h2>
            <StatusBadge status="stable" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced streaming with regeneration support and streaming
            statistics. Hover over responses to regenerate.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          <ChatWindow className="h-[600px]">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div key={message.id} className="group relative">
                    <Message message={message} />
                    {message.role === 'assistant' && index > 0 && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRegenerate(message.id)}
                          disabled={isStreaming}
                          className="px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          Regenerate
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isStreaming &&
                  messages[messages.length - 1]?.content === '' && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium">
                        AI
                      </div>
                      <ThinkingIndicator />
                    </div>
                  )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
                {isStreaming && (
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 px-2">
                    <span>
                      Streaming... {streamStats.tokensReceived} tokens in{' '}
                      {streamStats.duration}s
                    </span>
                    <span className="text-xs">
                      ~
                      {streamStats.duration > 0
                        ? Math.round(
                            streamStats.tokensReceived / streamStats.duration
                          )
                        : 0}{' '}
                      tokens/sec
                    </span>
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <ChatInput
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onSubmit={handleSubmit}
                      placeholder="Type a message..."
                      disabled={isStreaming}
                    />
                  </div>
                  {isStreaming && (
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </ChatWindow>
        </div>

        <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold mb-3">Implementation Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="block mb-2">Streaming Stats</strong>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Track tokens received</li>
                <li>• Measure streaming duration</li>
                <li>• Calculate throughput</li>
                <li>• Display to users</li>
              </ul>
            </div>
            <div>
              <strong className="block mb-2">Regeneration</strong>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Remove previous response</li>
                <li>• Replay user message</li>
                <li>• Start new stream</li>
                <li>• Maintain conversation flow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Advanced streaming with response regeneration and real-time statistics.',
      },
    },
  },
}
