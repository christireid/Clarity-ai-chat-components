'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  FormEvent,
} from 'react'
import { Send, Loader2, Bot, User, Sparkles } from 'lucide-react'

// =============================================================================
// Types
// =============================================================================

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
}

// =============================================================================
// Custom Hook: useStreamingChat
// =============================================================================

/**
 * Custom hook for managing streaming chat state and API communication.
 *
 * In a production app, you would use @clarity-chat/react's useChat hook
 * or integrate with your preferred AI SDK. This demo shows the pattern.
 */
function useStreamingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setError(null)
      setIsLoading(true)

      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      }

      // Add assistant message placeholder
      const assistantId = `assistant-${Date.now()}`
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      }

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setInput('')

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        if (!response.body) {
          throw new Error('No response body')
        }

        // Read streaming response
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let streamedContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          streamedContent += chunk

          // Update message with streamed content
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: streamedContent } : m
            )
          )
        }

        // Mark streaming as complete
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        )
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        // Remove the empty assistant message on error
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isLoading]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}

// =============================================================================
// Components
// =============================================================================

/**
 * Chat message component with role-based styling
 */
function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
      role="article"
      aria-label={`${message.role} message`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message content */}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-secondary text-secondary-foreground rounded-tl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        {/* Streaming indicator */}
        {message.isStreaming && (
          <span className="inline-flex items-center gap-1 mt-2 text-xs opacity-70">
            <span className="w-1.5 h-1.5 bg-current rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-current rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-current rounded-full typing-dot" />
            <span className="sr-only">Typing...</span>
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Empty state when no messages exist
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-primary" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
      <p className="text-muted-foreground max-w-md">
        Type a message below to begin chatting with the AI assistant. Your
        messages will appear here in real-time.
      </p>
    </div>
  )
}

/**
 * Error display component
 */
function ErrorDisplay({
  error,
  onRetry,
}: {
  error: Error
  onRetry: () => void
}) {
  return (
    <div
      role="alert"
      className="mx-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
    >
      <p className="text-destructive font-medium mb-2">Error sending message</p>
      <p className="text-sm text-muted-foreground mb-3">{error.message}</p>
      <button
        onClick={onRetry}
        className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
      >
        Try again
      </button>
    </div>
  )
}

/**
 * Chat input with accessibility support
 */
function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}) {
  const inputId = useId()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim() && !isLoading) {
      onSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <label htmlFor={inputId} className="sr-only">
        Message input
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
        className="w-full px-4 py-3 pr-12 bg-secondary text-secondary-foreground rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
        aria-describedby={`${inputId}-hint`}
      />
      <p id={`${inputId}-hint`} className="sr-only">
        Press Enter to send your message
      </p>
      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        aria-label={isLoading ? 'Sending message...' : 'Send message'}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
    </form>
  )
}

// =============================================================================
// Main Page
// =============================================================================

export default function StreamingChatPage() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  } = useStreamingChat()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" aria-hidden="true" />
            <h1 className="text-lg font-semibold">Streaming Chat</h1>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
            >
              Clear chat
            </button>
          )}
        </div>
      </header>

      {/* Chat messages */}
      <main className="flex-1 overflow-y-auto chat-scroll">
        <div className="max-w-3xl mx-auto p-4 space-y-4 min-h-full">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {error && (
                <ErrorDisplay
                  error={error}
                  onRetry={() =>
                    messages.length > 0 &&
                    sendMessage(messages[messages.length - 1].content)
                  }
                />
              )}
              <div ref={messagesEndRef} aria-hidden="true" />
            </>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={() => sendMessage(input)}
            isLoading={isLoading}
          />
          <p className="text-xs text-muted-foreground text-center mt-2">
            Powered by <span className="font-medium">Clarity Chat</span>
          </p>
        </div>
      </footer>

      {/* Live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isLoading ? 'AI is responding...' : ''}
      </div>
    </div>
  )
}
