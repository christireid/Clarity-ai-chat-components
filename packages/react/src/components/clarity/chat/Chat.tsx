'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { ChatHeader } from './ChatHeader'
import { ScrollArea } from '@clarity-chat/primitives'
import type { Message, ChatContextValue } from './types'

/**
 * Chat Context - Manages chat state
 */
const ChatContext = React.createContext<ChatContextValue | undefined>(undefined)

export function useChat() {
  const context = React.useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a Chat.Provider')
  }
  return context
}

/**
 * Chat Root Component
 * Usage: <Chat><Chat.Messages /><Chat.Input /></Chat>
 */
interface ChatProps {
  children: React.ReactNode
  className?: string
  'aria-label'?: string
}

const ChatRoot = React.forwardRef<HTMLDivElement, ChatProps>(
  (
    {
      children,
      className,
      'aria-label': ariaLabel = 'Chat interface',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        className={cn(
          'flex flex-col h-full bg-background border border-border rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChatRoot.displayName = 'Chat'

/**
 * Chat.Provider - Provides chat state to all subcomponents
 */
interface ChatProviderProps {
  children: React.ReactNode
  initialMessages?: Message[]
  onSendMessage?: (content: string) => void | Promise<void>
  value?: ChatContextValue
}

function ChatProvider({
  children,
  initialMessages = [],
  onSendMessage,
  value: externalValue,
}: ChatProviderProps) {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error>()

  const addMessage = React.useCallback(
    (message: Omit<Message, 'id' | 'timestamp'>) => {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
    },
    []
  )

  const updateMessage = React.useCallback(
    (id: string, updates: Partial<Message>) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
      )
    },
    []
  )

  const deleteMessage = React.useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }, [])

  const value: ChatContextValue = {
    messages,
    addMessage,
    updateMessage,
    deleteMessage,
    isLoading,
    error,
  }

  return (
    <ChatContext.Provider value={externalValue || value}>
      {children}
    </ChatContext.Provider>
  )
}

/**
 * Chat.Messages - Displays message list
 */
interface ChatMessagesProps {
  className?: string
  renderBubble?: (message: Message) => React.ReactNode
}

function ChatMessages({ className, renderBubble }: ChatMessagesProps) {
  const { messages } = useChat()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null)

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Keyboard navigation for messages
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prev) => {
          const newIndex =
            prev === null ? messages.length - 1 : Math.max(0, prev - 1)
          return newIndex
        })
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((prev) => {
          if (prev === null) return 0
          return Math.min(messages.length - 1, prev + 1)
        })
      }
    },
    [messages.length]
  )

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex-1 overflow-y-auto p-4 space-y-4',
        'scrollbar-none', // Hide scrollbar
        className
      )}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          No messages yet. Start a conversation!
        </div>
      )}
      {messages.map((message, index) => (
        <div
          key={message.id}
          tabIndex={focusedIndex === index ? 0 : -1}
          aria-current={focusedIndex === index ? 'true' : undefined}
          className={cn(
            'outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg',
            focusedIndex === index && 'ring-2 ring-ring'
          )}
        >
          {renderBubble ? (
            renderBubble(message)
          ) : (
            <ChatBubble message={message} />
          )}
        </div>
      ))}
    </div>
  )
}

// import { VirtualizedChatList } from "./virtualized/VirtualizedChatList";

/**
 * Compound Component Pattern
 */
export const Chat = Object.assign(ChatRoot, {
  Provider: ChatProvider,
  Header: ChatHeader,
  Messages: ChatMessages,
  VirtualizedMessages: ChatMessages, // Fallback to regular messages for now
  Input: ChatInput,
  Bubble: ChatBubble,
})
