import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChatWindow,
  ChatInput,
  Message,
  ThinkingIndicator,
} from '@clarity-chat/react'
import { StatusBadge } from '../../../.storybook/blocks'
import React, { useState } from 'react'

const meta: Meta = {
  title: 'Patterns/Chat/Multi-turn Conversations',
  parameters: {
    docs: {
      description: {
        component: `
# Multi-turn Conversation Pattern

Learn how to build chat interfaces that maintain context across multiple conversation turns.

## Problem

Users need to have coherent multi-turn conversations where the AI remembers previous messages and maintains context throughout the interaction.

## Solution

Implement a conversation state manager that:
1. Maintains message history
2. Tracks conversation context
3. Handles streaming responses
4. Manages loading states
5. Supports message operations (edit, retry, delete)

## Key Features

- **Context Persistence** - Maintains conversation history
- **Optimistic Updates** - Immediate UI feedback
- **Error Handling** - Graceful failure recovery
- **Streaming Support** - Progressive response rendering
- **Message Operations** - Edit and retry capabilities
        `,
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: () => {
    const [messages, setMessages] = useState([
      {
        id: '1',
        role: 'assistant' as const,
        content:
          'Hello! I can help you with questions about our product. What would you like to know?',
        timestamp: new Date(Date.now() - 120000),
      },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
      if (!input.trim() || isLoading) return

      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: input,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsLoading(true)

      // Simulate AI response with context
      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: generateContextualResponse(messages, input),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 1500)
    }

    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">Basic Multi-turn Chat</h2>
            <StatusBadge status="stable" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            A simple multi-turn conversation that maintains context. Try asking
            follow-up questions to see context awareness.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          <ChatWindow className="h-[600px]">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium">
                      AI
                    </div>
                    <ThinkingIndicator />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onSubmit={handleSubmit}
                  placeholder="Ask a follow-up question..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </ChatWindow>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-3">Context Management</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Message history is preserved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Follow-up questions work naturally</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Context is passed to each new turn</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold mb-3">Try These</h3>
            <ul className="space-y-2 text-sm">
              <li>"What are your pricing plans?"</li>
              <li>"How does the Enterprise plan differ?"</li>
              <li>"Can I switch plans later?"</li>
              <li>"What about annual discounts?"</li>
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
          'Basic multi-turn conversation with context management and loading states.',
      },
    },
  },
}

export const WithMessageOperations: Story = {
  render: () => {
    const [messages, setMessages] = useState([
      {
        id: '1',
        role: 'assistant' as const,
        content:
          'I can help you with code, explanations, or debugging. What would you like to work on?',
        timestamp: new Date(Date.now() - 180000),
      },
      {
        id: '2',
        role: 'user' as const,
        content: 'Explain async/await in JavaScript',
        timestamp: new Date(Date.now() - 120000),
      },
      {
        id: '3',
        role: 'assistant' as const,
        content:
          'Async/await is syntactic sugar for working with Promises. It makes asynchronous code look and behave more like synchronous code, making it easier to read and maintain.',
        timestamp: new Date(Date.now() - 60000),
      },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [editingMessageId, setEditingMessageId] = useState<string | null>(
      null
    )

    const handleSubmit = async () => {
      if (!input.trim() || isLoading) return

      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: input,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsLoading(true)

      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: generateContextualResponse(messages, input),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 1500)
    }

    const handleRetry = (messageId: string) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId)
      if (messageIndex === -1) return

      // Remove the message and regenerate
      const newMessages = messages.slice(0, messageIndex)
      setMessages(newMessages)
      setIsLoading(true)

      setTimeout(() => {
        const aiMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: "Here's an alternative explanation...",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 1500)
    }

    const handleDelete = (messageId: string) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
    }

    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">With Message Operations</h2>
            <StatusBadge status="stable" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Multi-turn chat with message operations: retry, edit, and delete.
            Hover over messages to see actions.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          <ChatWindow className="h-[600px]">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="group relative">
                    <Message message={message} />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => handleRetry(message.id)}
                          className="px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium">
                      AI
                    </div>
                    <ThinkingIndicator />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onSubmit={handleSubmit}
                  placeholder="Type a message..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </ChatWindow>
        </div>

        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
          <h3 className="text-lg font-semibold mb-3">Available Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="block mb-1">Retry</strong>
              <span className="text-gray-600 dark:text-gray-400">
                Regenerate AI response (hover over assistant messages)
              </span>
            </div>
            <div>
              <strong className="block mb-1">Delete</strong>
              <span className="text-gray-600 dark:text-gray-400">
                Remove any message from conversation
              </span>
            </div>
            <div>
              <strong className="block mb-1">Edit</strong>
              <span className="text-gray-600 dark:text-gray-400">
                Modify user messages and regenerate (coming soon)
              </span>
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
          'Advanced pattern with retry, edit, and delete operations on messages.',
      },
    },
  },
}

// Helper function to generate contextual responses
function generateContextualResponse(
  messages: any[],
  userInput: string
): string {
  const lowerInput = userInput.toLowerCase()

  // Pricing questions
  if (
    lowerInput.includes('pricing') ||
    lowerInput.includes('plan') ||
    lowerInput.includes('cost')
  ) {
    if (lowerInput.includes('enterprise')) {
      return 'Our Enterprise plan includes unlimited users, priority support, SSO, custom integrations, and a dedicated account manager. Pricing starts at $500/month with volume discounts available.'
    }
    if (lowerInput.includes('switch')) {
      return 'Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and downgrades at the end of your billing cycle with prorated refunds.'
    }
    if (lowerInput.includes('annual') || lowerInput.includes('discount')) {
      return 'Annual plans come with a 20% discount compared to monthly billing. Enterprise customers can get custom pricing with even better rates for longer commitments.'
    }
    return 'We offer three plans: Starter ($29/month), Professional ($99/month), and Enterprise (custom pricing). All plans include a 14-day free trial!'
  }

  // Default contextual response
  return `I understand you're asking about "${userInput}". Based on our conversation, I can provide more specific information. What particular aspect would you like to know more about?`
}
