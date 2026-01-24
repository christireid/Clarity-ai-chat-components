/**
 * Chat Component Templates
 *
 * Templates for generating chat-specific components with streaming and memory support.
 */

export const chatComponent = `'use client'

import { forwardRef, useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
{{#if withStreaming}}

import { useStreaming } from '@/hooks/useStreaming'
{{/if}}

{{#if withMemory}}
import { useMemory } from '@/hooks/useMemory'
{{/if}}


export interface {{pascalName}}Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  {{#if withMemory}}
  metadata?: Record<string, unknown>
  {{/if}}
}

export interface {{pascalName}}Props {
  /** Additional CSS classes */
  className?: string
  /** Model to use for chat */
  model?: string
  /** System prompt */
  systemPrompt?: string
  /** Initial messages */
  initialMessages?: {{pascalName}}Message[]
  /** Called when a new message is added */
  onMessage?: (message: {{pascalName}}Message) => void
  /** Called when an error occurs */
  onError?: (error: Error) => void
  /** Maximum messages to keep in history */
  maxMessages?: number
  {{#if withStreaming}}
  /** API endpoint for streaming */
  endpoint?: string
  {{/if}}
  {{#if withMemory}}
  /** Enable conversation memory */
  memory?: boolean
  /** Memory ID for persistence */
  memoryId?: string
  {{/if}}
}

/**
 * {{pascalName}} - {{description}}
 *
 * A chat component with {{#if withStreaming}}streaming support{{/if}}{{#if withMemory}}{{#if withStreaming}} and {{/if}}conversation memory{{/if}}.
 *
 * @example
 * \`\`\`tsx
 * <{{pascalName}}
 *   model="gpt-4"
 *   {{#if withStreaming}}
 *   endpoint="/api/chat"
 *   {{/if}}
 *   {{#if withMemory}}
 *   memory={true}
 *   memoryId="conversation-1"
 *   {{/if}}
 *   onMessage={(msg) => console.log(msg)}
 * />
 * \`\`\`
 */
export const {{pascalName}} = forwardRef<HTMLDivElement, {{pascalName}}Props>(
  (
    {
      className,
      model = 'gpt-4',
      systemPrompt,
      initialMessages = [],
      onMessage,
      onError,
      maxMessages = 100,
      {{#if withStreaming}}
      endpoint = '/api/chat',
      {{/if}}
      {{#if withMemory}}
      memory = false,
      memoryId,
      {{/if}}
      ...props
    },
    ref
  ) => {
    const [messages, setMessages] = useState<{{pascalName}}Message[]>(initialMessages)
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    {{#if withStreaming}}
    const { stream, isStreaming, error: streamError } = useStreaming({
      url: endpoint,
      onChunk: (chunk) => {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + chunk },
            ]
          }
          return prev
        })
      },
      onComplete: () => {
        setIsLoading(false)
      },
      onError: (err) => {
        setIsLoading(false)
        onError?.(err)
      },
    })
    {{/if}}

    {{#if withMemory}}
    const { loadMemory, saveMemory, clearMemory } = useMemory({
      id: memoryId,
      enabled: memory,
    })

    useEffect(() => {
      if (memory && memoryId) {
        loadMemory().then((savedMessages) => {
          if (savedMessages) {
            setMessages(savedMessages)
          }
        })
      }
    }, [memory, memoryId, loadMemory])

    useEffect(() => {
      if (memory && memoryId && messages.length > 0) {
        saveMemory(messages)
      }
    }, [memory, memoryId, messages, saveMemory])
    {{/if}}

    const sendMessage = useCallback(async () => {
      if (!input.trim() || isLoading) return

      const userMessage: {{pascalName}}Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: input.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev.slice(-(maxMessages - 1)), userMessage])
      setInput('')
      setIsLoading(true)
      onMessage?.(userMessage)

      {{#if withStreaming}}
      const assistantMessage: {{pascalName}}Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      await stream({
        model,
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
        systemPrompt,
      })
      {{else}}
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            systemPrompt,
          }),
        })

        if (!response.ok) {
          throw new Error(\`API error: \${response.status}\`)
        }

        const data = await response.json()
        const assistantMessage: {{pascalName}}Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev.slice(-(maxMessages - 1)), assistantMessage])
        onMessage?.(assistantMessage)
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
      {{/if}}
    }, [input, isLoading, messages, model, systemPrompt, maxMessages, onMessage, onError{{#if withStreaming}}, stream{{/if}}])

    return (
      <div
        ref={ref}
        className={cn(
          'clarity-{{kebabName}} flex flex-col h-full',
          className
        )}
        {...props}
      >
        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'p-3 rounded-lg max-w-[80%]',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto'
                  : 'bg-muted'
              )}
            >
              <p className="text-sm">{message.content}</p>
              <time className="text-xs opacity-50">
                {message.timestamp.toLocaleTimeString()}
              </time>
            </div>
          ))}
          {{#if withStreaming}}
          {isStreaming && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="animate-pulse">●</span>
              <span>AI is thinking...</span>
            </div>
          )}
          {{/if}}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    )
  }
)

{{pascalName}}.displayName = '{{pascalName}}'
`

export const chatComponentIndex = `export { {{pascalName}} } from './{{pascalName}}'
export type { {{pascalName}}Props, {{pascalName}}Message } from './{{pascalName}}'
`

export const chatComponentTest = `import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { {{pascalName}} } from './{{pascalName}}'


// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('{{pascalName}}', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: 'AI response' }),
    })
  })

  it('should render with default props', () => {
    render(<{{pascalName}} />)

    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('should render initial messages', () => {
    const initialMessages = [
      { id: '1', role: 'user' as const, content: 'Hello', timestamp: new Date() },
      { id: '2', role: 'assistant' as const, content: 'Hi there!', timestamp: new Date() },
    ]

    render(<{{pascalName}} initialMessages={initialMessages} />)

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })

  it('should send a message on button click', async () => {
    const onMessage = vi.fn()
    render(<{{pascalName}} onMessage={onMessage} />)

    const input = screen.getByPlaceholderText('Type a message...')
    const sendButton = screen.getByRole('button', { name: /send/i })

    await userEvent.type(input, 'Test message')
    await userEvent.click(sendButton)

    await waitFor(() => {
      expect(onMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'user',
          content: 'Test message',
        })
      )
    })
  })

  it('should send a message on Enter key', async () => {
    const onMessage = vi.fn()
    render(<{{pascalName}} onMessage={onMessage} />)

    const input = screen.getByPlaceholderText('Type a message...')

    await userEvent.type(input, 'Test message{enter}')

    await waitFor(() => {
      expect(onMessage).toHaveBeenCalled()
    })
  })

  it('should not send empty messages', async () => {
    const onMessage = vi.fn()
    render(<{{pascalName}} onMessage={onMessage} />)

    const sendButton = screen.getByRole('button', { name: /send/i })
    await userEvent.click(sendButton)

    expect(onMessage).not.toHaveBeenCalled()
  })

  it('should disable input while loading', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<{{pascalName}} />)

    const input = screen.getByPlaceholderText('Type a message...')
    const sendButton = screen.getByRole('button', { name: /send/i })

    await userEvent.type(input, 'Test message')
    await userEvent.click(sendButton)

    await waitFor(() => {
      expect(input).toBeDisabled()
    })
  })

  it('should call onError when request fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    const onError = vi.fn()

    render(<{{pascalName}} onError={onError} />)

    const input = screen.getByPlaceholderText('Type a message...')
    await userEvent.type(input, 'Test message{enter}')

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  it('should apply custom className', () => {
    const { container } = render(<{{pascalName}} className="custom-class" />)

    expect(container.firstChild).toHaveClass('custom-class')
    expect(container.firstChild).toHaveClass('clarity-{{kebabName}}')
  })
})
`

export const chatComponentStory = `import type { Meta, StoryObj } from '@storybook/react'
import { {{pascalName}} } from './{{pascalName}}'


const meta: Meta<typeof {{pascalName}}> = {
  title: 'Chat/{{pascalName}}',
  component: {{pascalName}},
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '{{description}}',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] w-full max-w-2xl mx-auto border rounded-lg overflow-hidden">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default chat interface with no initial messages.
 */
export const Default: Story = {
  args: {
    model: 'gpt-4',
  },
}

/**
 * Chat with pre-existing conversation.
 */
export const WithMessages: Story = {
  args: {
    model: 'gpt-4',
    initialMessages: [
      {
        id: '1',
        role: 'user',
        content: 'Hello, how can you help me today?',
        timestamp: new Date(),
      },
      {
        id: '2',
        role: 'assistant',
        content: 'I can help you with coding questions, explain concepts, review code, and much more. What would you like to work on?',
        timestamp: new Date(),
      },
    ],
  },
}

/**
 * Chat with custom system prompt.
 */
export const WithSystemPrompt: Story = {
  args: {
    model: 'gpt-4',
    systemPrompt: 'You are a helpful coding assistant specializing in React and TypeScript.',
  },
}
`
