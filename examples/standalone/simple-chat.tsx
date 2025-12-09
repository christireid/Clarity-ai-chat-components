/**
 * Simple Chat Example - Fully Runnable Standalone
 *
 * This is a complete, self-contained chat example that demonstrates
 * core Clarity Chat patterns without external dependencies.
 *
 * To run:
 * 1. Copy this file to a Next.js/Vite React project
 * 2. Add Tailwind CSS (or remove className attributes)
 * 3. Import and render the SimpleChat component
 *
 * Features demonstrated:
 * - Message state management
 * - Simulated streaming responses
 * - Accessibility patterns
 * - Error handling
 * - Loading states
 */

import * as React from 'react'

// =============================================================================
// 💡 Types
// =============================================================================

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  status: 'pending' | 'streaming' | 'complete' | 'error'
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: Error | null
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'CLEAR_MESSAGES' }

// =============================================================================
// 💡 Utilities
// =============================================================================

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
        ),
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] }
    default:
      return state
  }
}

// Simulates an AI response with streaming
async function* simulateStreamingResponse(prompt: string): AsyncGenerator<string> {
  const responses: Record<string, string> = {
    hello: "Hello! I'm a demo chat assistant. How can I help you today?",
    help: "I can help you understand how this chat interface works. Try asking me questions or just say hello!",
    default: `I received your message: "${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}". This is a simulated response that demonstrates streaming text output. In a real application, this would connect to an AI API like OpenAI or Anthropic.`,
  }

  const responseKey = prompt.toLowerCase().includes('hello')
    ? 'hello'
    : prompt.toLowerCase().includes('help')
      ? 'help'
      : 'default'

  const fullResponse = responses[responseKey]
  const words = fullResponse.split(' ')

  // Stream word by word
  for (const word of words) {
    yield word + ' '
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 50))
  }
}

// =============================================================================
// 💡 Custom Hooks
// =============================================================================

function useChat() {
  const [state, dispatch] = React.useReducer(chatReducer, {
    messages: [],
    isLoading: false,
    error: null,
  })

  const sendMessage = React.useCallback(async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      status: 'complete',
    }
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })

    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      status: 'streaming',
    }
    dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage })
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Stream the response
      let fullContent = ''
      for await (const chunk of simulateStreamingResponse(content)) {
        fullContent += chunk
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: { id: assistantMessage.id, updates: { content: fullContent } },
        })
      }

      // Mark as complete
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: { id: assistantMessage.id, updates: { status: 'complete' } },
      })
    } catch (error) {
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          id: assistantMessage.id,
          updates: { status: 'error', content: 'Failed to generate response' },
        },
      })
      dispatch({ type: 'SET_ERROR', payload: error as Error })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const clearMessages = React.useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' })
  }, [])

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearMessages,
  }
}

// =============================================================================
// 💡 Components
// =============================================================================

interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isStreaming = message.status === 'streaming'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      role="article"
      aria-label={`${message.role} message`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-100 dark:bg-gray-800 rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" aria-hidden="true" />
        )}
        <time
          className={`block text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}
          dateTime={new Date(message.timestamp).toISOString()}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </time>
      </div>
    </div>
  )
}

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = React.useState('')
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="chat-input" className="sr-only">
        Type your message
      </label>
      <textarea
        id="chat-input"
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
        disabled={disabled}
        rows={2}
        className="flex-1 px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-describedby="input-hint"
      />
      <span id="input-hint" className="sr-only">
        Press Enter to send, Shift+Enter for a new line
      </span>
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Send message"
      >
        {disabled ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending
          </span>
        ) : (
          'Send'
        )}
      </button>
    </form>
  )
}

// =============================================================================
// 💡 Error Boundary
// =============================================================================

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Chat error:', error, errorInfo)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// =============================================================================
// 💡 Main Component
// =============================================================================

/**
 * SimpleChat - A fully functional, standalone chat component
 *
 * @example
 * ```tsx
 * function App() {
 *   return <SimpleChat />
 * }
 * ```
 */
export function SimpleChat() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold">Simple Chat Demo</h1>
            <p className="text-sm text-gray-500">
              A standalone example of Clarity Chat patterns
            </p>
          </div>
          <button
            onClick={clearMessages}
            disabled={messages.length === 0}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Clear all messages"
          >
            Clear Chat
          </button>
        </header>

        {/* Messages */}
        <main
          className="flex-1 overflow-y-auto py-4"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <svg
                className="w-16 h-16 mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation by typing below</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Error Display */}
        {error && (
          <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            Error: {error.message}
          </div>
        )}

        {/* Input */}
        <footer className="pt-4 border-t">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
          <p className="text-xs text-gray-400 mt-2 text-center">
            This is a demo with simulated responses. No data is sent to any server.
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export default SimpleChat
