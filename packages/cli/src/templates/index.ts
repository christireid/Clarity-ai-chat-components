/**
 * Template System
 *
 * Centralized template definitions for all generators.
 * Templates use Handlebars syntax for variable interpolation.
 *
 * Template Context Variables:
 * - {{name}} - Original input name
 * - {{pascalName}} - PascalCase (ChatMessage)
 * - {{camelName}} - camelCase (chatMessage)
 * - {{kebabName}} - kebab-case (chat-message)
 * - {{description}} - Component description
 * - {{year}} - Current year
 * - {{author}} - Git author name
 * - {{provider}} - AI provider (openai, anthropic, google)
 * - {{withStreaming}} - Include streaming support
 * - {{withMemory}} - Include memory support
 */

import Handlebars from 'handlebars'
import { toPascalCase, toCamelCase, toKebabCase } from '../utils/case.js'

// Register Handlebars helpers using shared utilities
// All helpers include null-safety to prevent crashes from missing variables
Handlebars.registerHelper('pascalCase', (str: string) =>
  toPascalCase(str || '')
)
Handlebars.registerHelper('camelCase', (str: string) => toCamelCase(str || ''))
Handlebars.registerHelper('kebabCase', (str: string) => toKebabCase(str || ''))
Handlebars.registerHelper('uppercase', (str: string) =>
  (str || '').toUpperCase()
)
Handlebars.registerHelper('lowercase', (str: string) =>
  (str || '').toLowerCase()
)

// Conditional helper for provider checks
Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b)
Handlebars.registerHelper('or', (...args: unknown[]) => {
  // Remove the Handlebars options object (last argument)
  const values = args.slice(0, -1)
  return values.some(Boolean)
})

// ============================================================================
// Component Templates
// ============================================================================

export const TEMPLATES = {
  // ---------------------------------------------------------------------------
  // Basic React Component
  // ---------------------------------------------------------------------------
  component: `import { forwardRef } from 'react'
import { cn } from '@/lib/utils'


export interface {{pascalName}}Props {
  /** Additional CSS classes */
  className?: string
  /** Component children */
  children?: React.ReactNode
}

/**
 * {{pascalName}} - {{description}}
 *
 * @example
 * \`\`\`tsx
 * <{{pascalName}}>
 *   Content here
 * </{{pascalName}}>
 * \`\`\`
 */
export const {{pascalName}} = forwardRef<HTMLDivElement, {{pascalName}}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'clarity-{{kebabName}}',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

{{pascalName}}.displayName = '{{pascalName}}'
`,

  componentIndex: `export { {{pascalName}} } from './{{pascalName}}'
export type { {{pascalName}}Props } from './{{pascalName}}'
`,

  componentTest: `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { {{pascalName}} } from './{{pascalName}}'


describe('{{pascalName}}', () => {
  it('should render children correctly', () => {
    render(<{{pascalName}}>Test content</{{pascalName}}>)

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <{{pascalName}} className="custom-class">
        Content
      </{{pascalName}}>
    )

    const element = screen.getByText('Content').closest('div')
    expect(element).toHaveClass('custom-class')
    expect(element).toHaveClass('clarity-{{kebabName}}')
  })

  it('should forward ref correctly', () => {
    const ref = createRef<HTMLDivElement>()
    render(<{{pascalName}} ref={ref}>Content</{{pascalName}}>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('should spread additional props', () => {
    render(
      <{{pascalName}} data-testid="test-component" aria-label="Test">
        Content
      </{{pascalName}}>
    )

    const element = screen.getByTestId('test-component')
    expect(element).toHaveAttribute('aria-label', 'Test')
  })
})
`,

  componentStory: `import type { Meta, StoryObj } from '@storybook/react'
import { {{pascalName}} } from './{{pascalName}}'


const meta: Meta<typeof {{pascalName}}> = {
  title: '{{componentDir}}/{{pascalName}}',
  component: {{pascalName}},
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '{{description}}',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: 'text',
      description: 'Component children',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default state of the {{pascalName}} component.
 */
export const Default: Story = {
  args: {
    children: '{{pascalName}} content',
  },
}

/**
 * {{pascalName}} with custom styling.
 */
export const CustomStyle: Story = {
  args: {
    children: 'Custom styled content',
    className: 'bg-blue-100 p-4 rounded-lg',
  },
}
`,

  // ---------------------------------------------------------------------------
  // Chat-Specific Component (NEW)
  // ---------------------------------------------------------------------------
  chatComponent: `'use client'

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
`,

  chatComponentIndex: `export { {{pascalName}} } from './{{pascalName}}'
export type { {{pascalName}}Props, {{pascalName}}Message } from './{{pascalName}}'
`,

  chatComponentTest: `import { describe, it, expect, vi, beforeEach } from 'vitest'
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
`,

  chatComponentStory: `import type { Meta, StoryObj } from '@storybook/react'
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
`,

  // ---------------------------------------------------------------------------
  // Hook Template
  // ---------------------------------------------------------------------------
  hook: `import { useState, useCallback } from 'react'

export interface Use{{pascalName}}Options {
  /**
   * Initial value for the hook
   */
  initialValue?: unknown
}

export interface Use{{pascalName}}Return {
  /**
   * Current state value
   */
  value: unknown
  /**
   * Update the value
   */
  setValue: (value: unknown) => void
  /**
   * Reset to initial value
   */
  reset: () => void
}

/**
 * use{{pascalName}} - {{description}}
 *
 * @param options - Hook configuration options
 * @returns Hook state and methods
 *
 * @example
 * \`\`\`tsx
 * function MyComponent() {
 *   const { value, setValue, reset } = use{{pascalName}}()
 *
 *   return (
 *     <div>
 *       <span>{String(value)}</span>
 *       <button onClick={() => setValue('new value')}>Update</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   )
 * }
 * \`\`\`
 */
export function use{{pascalName}}(
  options: Use{{pascalName}}Options = {}
): Use{{pascalName}}Return {
  const { initialValue = null } = options

  const [value, setValueState] = useState<unknown>(initialValue)

  const setValue = useCallback((newValue: unknown) => {
    setValueState(newValue)
  }, [])

  const reset = useCallback(() => {
    setValueState(initialValue)
  }, [initialValue])

  return {
    value,
    setValue,
    reset,
  }
}
`,

  hookTest: `import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { use{{pascalName}} } from './use{{pascalName}}'


describe('use{{pascalName}}', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => use{{pascalName}}())

    expect(result.current.value).toBe(null)
  })

  it('should initialize with custom initial value', () => {
    const { result } = renderHook(() =>
      use{{pascalName}}({ initialValue: 'test' })
    )

    expect(result.current.value).toBe('test')
  })

  it('should update value', () => {
    const { result } = renderHook(() => use{{pascalName}}())

    act(() => {
      result.current.setValue('new value')
    })

    expect(result.current.value).toBe('new value')
  })

  it('should reset to initial value', () => {
    const { result } = renderHook(() =>
      use{{pascalName}}({ initialValue: 'initial' })
    )

    act(() => {
      result.current.setValue('changed')
    })

    expect(result.current.value).toBe('changed')

    act(() => {
      result.current.reset()
    })

    expect(result.current.value).toBe('initial')
  })

  it('should maintain referential stability of callbacks', () => {
    const { result, rerender } = renderHook(() => use{{pascalName}}())

    const { setValue: setValue1, reset: reset1 } = result.current

    rerender()

    const { setValue: setValue2, reset: reset2 } = result.current

    expect(setValue1).toBe(setValue2)
    expect(reset1).toBe(reset2)
  })
})
`,

  // ---------------------------------------------------------------------------
  // Context Template
  // ---------------------------------------------------------------------------
  context: `import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

// === STATE TYPES ===

export interface {{pascalName}}State {
  /**
   * Current value in the context
   */
  value: unknown
  /**
   * Loading state
   */
  isLoading: boolean
  /**
   * Error state
   */
  error: Error | null
}

// === ACTION TYPES ===

export interface {{pascalName}}Actions {
  /**
   * Update the value
   */
  setValue: (value: unknown) => void
  /**
   * Reset the context to initial state
   */
  reset: () => void
  /**
   * Clear any errors
   */
  clearError: () => void
}

// === CONTEXT VALUE ===

export type {{pascalName}}ContextValue = {{pascalName}}State & {{pascalName}}Actions

// === CONTEXT ===

const {{pascalName}}Context = createContext<{{pascalName}}ContextValue | null>(null)

{{pascalName}}Context.displayName = '{{pascalName}}Context'

// === PROVIDER ===

export interface {{pascalName}}ProviderProps {
  /**
   * Child components
   */
  children: ReactNode
  /**
   * Initial value for the context
   */
  initialValue?: unknown
}

const defaultState: {{pascalName}}State = {
  value: null,
  isLoading: false,
  error: null,
}

/**
 * {{pascalName}}Provider - {{description}}
 *
 * @example
 * \`\`\`tsx
 * function App() {
 *   return (
 *     <{{pascalName}}Provider>
 *       <MyComponent />
 *     </{{pascalName}}Provider>
 *   )
 * }
 * \`\`\`
 */
export function {{pascalName}}Provider({
  children,
  initialValue,
}: {{pascalName}}ProviderProps) {
  const [state, setState] = useState<{{pascalName}}State>({
    ...defaultState,
    value: initialValue ?? defaultState.value,
  })

  const setValue = useCallback((value: unknown) => {
    setState((prev) => ({ ...prev, value }))
  }, [])

  const reset = useCallback(() => {
    setState({
      ...defaultState,
      value: initialValue ?? defaultState.value,
    })
  }, [initialValue])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  const contextValue = useMemo<{{pascalName}}ContextValue>(
    () => ({
      ...state,
      setValue,
      reset,
      clearError,
    }),
    [state, setValue, reset, clearError]
  )

  return (
    <{{pascalName}}Context.Provider value={contextValue}>
      {children}
    </{{pascalName}}Context.Provider>
  )
}

// === HOOK ===

/**
 * use{{pascalName}} - Access the {{pascalName}} context
 *
 * @throws Error if used outside of {{pascalName}}Provider
 *
 * @example
 * \`\`\`tsx
 * function MyComponent() {
 *   const { value, setValue, reset } = use{{pascalName}}()
 *
 *   return (
 *     <div>
 *       <span>{String(value)}</span>
 *       <button onClick={() => setValue('new')}>Update</button>
 *     </div>
 *   )
 * }
 * \`\`\`
 */
export function use{{pascalName}}(): {{pascalName}}ContextValue {
  const context = useContext({{pascalName}}Context)

  if (!context) {
    throw new Error(
      'use{{pascalName}} must be used within a {{pascalName}}Provider. ' +
      'Make sure to wrap your component tree with <{{pascalName}}Provider>.'
    )
  }

  return context
}

// === EXPORTS ===

export { {{pascalName}}Context }
`,

  contextTest: `import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { {{pascalName}}Provider, use{{pascalName}} } from './{{pascalName}}Context'


function TestConsumer() {
  const { value, setValue, reset } = use{{pascalName}}()

  return (
    <div>
      <span data-testid="value">{String(value)}</span>
      <button onClick={() => setValue('updated')}>Update</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

describe('{{pascalName}}Context', () => {
  it('should provide default value', () => {
    render(
      <{{pascalName}}Provider>
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('null')
  })

  it('should provide initial value', () => {
    render(
      <{{pascalName}}Provider initialValue="initial">
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('initial')
  })

  it('should update value', () => {
    render(
      <{{pascalName}}Provider>
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    fireEvent.click(screen.getByText('Update'))
    expect(screen.getByTestId('value')).toHaveTextContent('updated')
  })

  it('should reset to initial value', () => {
    render(
      <{{pascalName}}Provider initialValue="initial">
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    fireEvent.click(screen.getByText('Update'))
    fireEvent.click(screen.getByText('Reset'))
    expect(screen.getByTestId('value')).toHaveTextContent('initial')
  })

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestConsumer />)).toThrow(
      'use{{pascalName}} must be used within a {{pascalName}}Provider'
    )

    consoleSpy.mockRestore()
  })
})
`,

  // ---------------------------------------------------------------------------
  // Adapter Template (Enhanced)
  // ---------------------------------------------------------------------------
  adapter: `import type { ChatMessage, ModelConfig, StreamChunk } from '@clarity-chat/types'

/**
 * {{pascalName}}Adapter Configuration
 */
export interface {{pascalName}}Config {
  /** API key for authentication */
  apiKey: string
  /** Base URL for API calls */
  baseUrl?: string
  /** Default model to use */
  model?: string
  /** Default temperature */
  temperature?: number
  /** Default max tokens */
  maxTokens?: number
  /** Request timeout in milliseconds */
  timeout?: number
  /** Custom headers to include */
  headers?: Record<string, string>
}

/**
 * {{pascalName}}Adapter Interface
 */
export interface {{pascalName}}Adapter {
  /** Stream chat completions */
  stream: (
    messages: ChatMessage[],
    config?: Partial<ModelConfig>
  ) => AsyncGenerator<StreamChunk>
  /** Non-streaming chat completion */
  complete: (
    messages: ChatMessage[],
    config?: Partial<ModelConfig>
  ) => Promise<string>
  /** Count tokens for messages */
  countTokens?: (messages: ChatMessage[]) => Promise<number>
  /** List available models */
  listModels?: () => Promise<string[]>
}

/**
 * {{pascalName}}Adapter - {{description}}
 *
 * @example
 * \`\`\`tsx
 * const adapter = create{{pascalName}}Adapter({ apiKey: 'your-key' })
 *
 * // Streaming
 * for await (const chunk of adapter.stream(messages)) {
 *   console.log(chunk.content)
 * }
 *
 * // Non-streaming
 * const response = await adapter.complete(messages)
 * \`\`\`
 */
export function create{{pascalName}}Adapter(
  config: {{pascalName}}Config
): {{pascalName}}Adapter {
  const {
    apiKey,
    baseUrl = '{{#if (eq provider "openai")}}https://api.openai.com/v1{{else if (eq provider "anthropic")}}https://api.anthropic.com/v1{{else if (eq provider "google")}}https://generativelanguage.googleapis.com/v1beta{{else}}https://api.example.com/v1{{/if}}',
    model = '{{#if (eq provider "openai")}}gpt-4{{else if (eq provider "anthropic")}}claude-3-opus-20240229{{else if (eq provider "google")}}gemini-pro{{else}}default-model{{/if}}',
    temperature = 0.7,
    maxTokens = 1000,
    timeout = 30000,
    headers = {},
  } = config

  /**
   * Make a fetch request with timeout
   */
  async function fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Stream chat completions
   */
  async function* stream(
    messages: ChatMessage[],
    overrides?: Partial<ModelConfig>
  ): AsyncGenerator<StreamChunk> {
    const response = await fetchWithTimeout(\`\${baseUrl}/chat/completions\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        model: overrides?.model || model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: overrides?.temperature ?? temperature,
        max_tokens: overrides?.maxTokens ?? maxTokens,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(\`API error: \${response.status} - \${error}\`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body')
    }

    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') return

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content

              if (content) {
                yield {
                  type: 'content' as const,
                  content,
                }
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * Non-streaming chat completion
   */
  async function complete(
    messages: ChatMessage[],
    overrides?: Partial<ModelConfig>
  ): Promise<string> {
    const response = await fetchWithTimeout(\`\${baseUrl}/chat/completions\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        model: overrides?.model || model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: overrides?.temperature ?? temperature,
        max_tokens: overrides?.maxTokens ?? maxTokens,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(\`API error: \${response.status} - \${error}\`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }

  return {
    stream,
    complete,
  }
}
`,

  adapterTest: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { create{{pascalName}}Adapter } from './{{camelName}}Adapter'


describe('{{pascalName}}Adapter', () => {
  const mockApiKey = 'test-api-key'
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('create{{pascalName}}Adapter', () => {
    it('should create an adapter with required config', () => {
      const adapter = create{{pascalName}}Adapter({ apiKey: mockApiKey })

      expect(adapter).toHaveProperty('stream')
      expect(adapter).toHaveProperty('complete')
    })
  })

  describe('complete', () => {
    it('should make a non-streaming request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Hello!' } }],
        }),
      })

      const adapter = create{{pascalName}}Adapter({ apiKey: mockApiKey })
      const result = await adapter.complete([
        { role: 'user', content: 'Hi' },
      ])

      expect(result).toBe('Hello!')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/completions'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: \`Bearer \${mockApiKey}\`,
          }),
        })
      )
    })

    it('should throw on API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      })

      const adapter = create{{pascalName}}Adapter({ apiKey: mockApiKey })

      await expect(
        adapter.complete([{ role: 'user', content: 'Hi' }])
      ).rejects.toThrow('API error: 401')
    })

    it('should use custom config overrides', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Response' } }],
        }),
      })

      const adapter = create{{pascalName}}Adapter({
        apiKey: mockApiKey,
        model: 'default-model',
      })

      await adapter.complete(
        [{ role: 'user', content: 'Hi' }],
        { model: 'custom-model', temperature: 0.5 }
      )

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('custom-model'),
        })
      )
    })
  })

  describe('stream', () => {
    it('should yield chunks from streaming response', async () => {
      const mockReader = {
        read: vi.fn()
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\\n'),
          })
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":" World"}}]}\\n'),
          })
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('data: [DONE]\\n'),
          })
          .mockResolvedValueOnce({ done: true }),
        releaseLock: vi.fn(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: { getReader: () => mockReader },
      })

      const adapter = create{{pascalName}}Adapter({ apiKey: mockApiKey })
      const chunks: string[] = []

      for await (const chunk of adapter.stream([{ role: 'user', content: 'Hi' }])) {
        if (chunk.type === 'content') {
          chunks.push(chunk.content)
        }
      }

      expect(chunks).toEqual(['Hello', ' World'])
    })
  })
})
`,

  // ---------------------------------------------------------------------------
  // API Route Template (Next.js) - With Security Best Practices
  // ---------------------------------------------------------------------------
  apiRoute: `import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
{{#if (eq provider "openai")}}

import OpenAI from 'openai'
{{else if (eq provider "anthropic")}}

import Anthropic from '@anthropic-ai/sdk'
{{else if (eq provider "google")}}

import { GoogleGenerativeAI } from '@google/generative-ai'
{{/if}}


// ============================================================================
// Security Configuration
// ============================================================================

/**
 * Rate limiting configuration
 * In production, use Redis or a dedicated rate limiting service
 */
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests per minute per IP
}

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs })
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1 }
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count }
}

/**
 * Input validation and sanitization
 */
const MAX_MESSAGE_LENGTH = 32000 // ~8k tokens
const MAX_MESSAGES = 50

function validateInput(messages: unknown, maxTokens: unknown): string | null {
  if (!messages || !Array.isArray(messages)) {
    return 'messages is required and must be an array'
  }

  if (messages.length > MAX_MESSAGES) {
    return \`Maximum \${MAX_MESSAGES} messages allowed\`
  }

  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return 'Each message must have role and content'
    }
    if (!['user', 'assistant', 'system'].includes(msg.role)) {
      return 'Invalid message role'
    }
    if (typeof msg.content !== 'string' || msg.content.length > MAX_MESSAGE_LENGTH) {
      return \`Message content must be a string under \${MAX_MESSAGE_LENGTH} characters\`
    }
  }

  if (maxTokens && (typeof maxTokens !== 'number' || maxTokens < 1 || maxTokens > 4096)) {
    return 'maxTokens must be between 1 and 4096'
  }

  return null
}

// ============================================================================
// AI Provider Configuration
// ============================================================================

{{#if (eq provider "openai")}}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
{{else if (eq provider "anthropic")}}
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})
{{else if (eq provider "google")}}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
{{/if}}

// ============================================================================
// API Route Handler
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0] ?? 'unknown'

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(ip)
    if (!allowed) {
      return Response.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT.maxRequests),
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60',
          },
        }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const { messages, model, systemPrompt, temperature = 0.7, maxTokens = 1000 } = body

    // Validate input
    const validationError = validateInput(messages, maxTokens)
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    // Optional: Add authentication check here
    // const authHeader = headersList.get('authorization')
    // if (!authHeader || !verifyToken(authHeader)) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 401 })
    // }

{{#if withStreaming}}
    // Streaming response
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
{{#if (eq provider "openai")}}
          const response = await openai.chat.completions.create({
            model: model || 'gpt-4',
            messages: systemPrompt
              ? [{ role: 'system', content: systemPrompt }, ...messages]
              : messages,
            temperature,
            max_tokens: maxTokens,
            stream: true,
          })

          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content })}\\n\\n\`))
            }
          }
{{else if (eq provider "anthropic")}}
          const stream = await anthropic.messages.stream({
            model: model || 'claude-3-opus-20240229',
            system: systemPrompt,
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
            max_tokens: maxTokens,
          })

          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content: event.delta.text })}\\n\\n\`))
            }
          }
{{else if (eq provider "google")}}
          const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-pro' })
          const chat = geminiModel.startChat({
            history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }],
            })),
          })

          const result = await chat.sendMessageStream(messages[messages.length - 1].content)

          for await (const chunk of result.stream) {
            const content = chunk.text()
            if (content) {
              controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ content })}\\n\\n\`))
            }
          }
{{/if}}

          controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
{{else}}
    // Non-streaming response
{{#if (eq provider "openai")}}
    const response = await openai.chat.completions.create({
      model: model || 'gpt-4',
      messages: systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages,
      temperature,
      max_tokens: maxTokens,
    })

    return Response.json({
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
    })
{{else if (eq provider "anthropic")}}
    const response = await anthropic.messages.create({
      model: model || 'claude-3-opus-20240229',
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      max_tokens: maxTokens,
    })

    return Response.json({
      content: response.content[0]?.type === 'text' ? response.content[0].text : '',
      usage: response.usage,
    })
{{else if (eq provider "google")}}
    const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-pro' })
    const chat = geminiModel.startChat({
      history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    })

    const result = await chat.sendMessage(messages[messages.length - 1].content)
    const response = await result.response

    return Response.json({
      content: response.text(),
    })
{{/if}}
{{/if}}
  } catch (error) {
    logger.error('API error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
`,

  // ---------------------------------------------------------------------------
  // Test Template
  // ---------------------------------------------------------------------------
  test: `import { describe, it, expect, vi } from 'vitest'
import { {{pascalName}} } from './{{pascalName}}'


describe('{{pascalName}}', () => {
  it('should work correctly', () => {
    // Add your test implementation here
    expect(true).toBe(true)
  })

  it('should handle edge cases', () => {
    // Add edge case tests here
  })

  it.todo('should handle async operations')
  it.todo('should handle errors gracefully')
})
`,
}

// ============================================================================
// Template Compiler
// ============================================================================

/**
 * Compile a template with the given context
 */
export function compileTemplate(
  templateKey: keyof typeof TEMPLATES,
  context: Record<string, unknown>
): string {
  const template = TEMPLATES[templateKey]
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`)
  }

  const compiled = Handlebars.compile(template)
  return compiled(context)
}

/**
 * Get a raw template string
 */
export function getTemplate(templateKey: keyof typeof TEMPLATES): string {
  const template = TEMPLATES[templateKey]
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`)
  }
  return template
}

/**
 * List all available template keys
 */
export function getTemplateKeys(): string[] {
  return Object.keys(TEMPLATES)
}

export { Handlebars }
