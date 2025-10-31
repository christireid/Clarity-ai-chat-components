import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Message List - Clarity Chat',
  description: 'A container component for displaying chat messages with auto-scroll, loading states, empty states, and smooth animations.',
}

# Message List

A container component for displaying chat messages with automatic scrolling, loading indicators, empty states, and smooth animations.

## Overview

The Message List component provides a complete chat message display system with:

- **Auto-scroll behavior** - Automatically scrolls to newest messages
- **Loading states** - Skeleton screens while messages load
- **Empty state support** - Custom placeholder when no messages exist
- **Smooth animations** - Stagger animations for message appearance
- **Scroll controls** - Scroll-to-bottom button when user scrolls up
- **Message callbacks** - Support for copy, feedback, and retry actions

## Installation

The Message List component is included in the Clarity Chat React package:

\`\`\`bash
npm install @clarity-chat/react
\`\`\`

## Basic Usage

\`\`\`tsx
import { MessageList } from '@clarity-chat/react'
import { Message } from '@clarity-chat/types'

function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'Hello!',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Hi! How can I help you today?',
      timestamp: new Date(),
    },
  ])
  
  const [isLoading, setIsLoading] = useState(false)

  return (
    <MessageList
      messages={messages}
      isLoading={isLoading}
      onMessageCopy={(id, content) => {
        navigator.clipboard.writeText(content)
      }}
      onMessageFeedback={(id, type) => {
        console.log(\`Feedback for \${id}: \${type}\`)
      }}
      onMessageRetry={(id) => {
        console.log(\`Retry message \${id}\`)
      }}
    />
  )
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`messages\` | \`MessageType[]\` | **Required** | Array of message objects to display |
| \`onMessageCopy\` | \`(messageId: string, content: string) => void\` | \`undefined\` | Callback when user copies a message |
| \`onMessageFeedback\` | \`(messageId: string, type: 'up' \| 'down') => void\` | \`undefined\` | Callback when user provides feedback |
| \`onMessageRetry\` | \`(messageId: string) => void\` | \`undefined\` | Callback when user retries a message |
| \`isLoading\` | \`boolean\` | \`false\` | Show loading skeleton messages |
| \`loadingCount\` | \`number\` | \`1\` | Number of skeleton messages to show when loading |
| \`emptyState\` | \`React.ReactNode\` | \`undefined\` | Custom empty state component when no messages |
| \`className\` | \`string\` | \`undefined\` | Additional CSS classes for the container |

## Features

### Auto-Scroll Behavior

The Message List automatically scrolls to the bottom when new messages arrive, using the \`useAutoScroll\` hook with smooth scrolling:

\`\`\`tsx
<MessageList
  messages={messages}
  // Auto-scrolls to bottom when messages update
  // Respects user scroll position - won't force scroll if user scrolled up
/>
\`\`\`

**Auto-scroll logic:**
- Automatically scrolls to bottom when new messages arrive
- Respects user intent - won't scroll if user has scrolled up to read
- Shows "Scroll to bottom" button when user is not at the bottom

### Loading States

Display skeleton loading messages while fetching:

\`\`\`tsx
<MessageList
  messages={messages}
  isLoading={isLoadingMessages}
  loadingCount={3} // Show 3 skeleton messages
/>
\`\`\`

The loading skeletons provide visual feedback during:
- Initial message load
- Fetching conversation history
- Loading more messages

### Empty State

Customize the display when no messages exist:

\`\`\`tsx
<MessageList
  messages={[]}
  emptyState={
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
      <p className="text-sm text-muted-foreground">
        Start a conversation by sending a message below
      </p>
    </div>
  }
/>
\`\`\`

### Message Callbacks

Handle user interactions with messages:

\`\`\`tsx
<MessageList
  messages={messages}
  onMessageCopy={(messageId, content) => {
    // Copy message content to clipboard
    navigator.clipboard.writeText(content)
    toast.success('Message copied!')
  }}
  onMessageFeedback={(messageId, type) => {
    // Track user feedback
    analytics.track('message_feedback', {
      messageId,
      feedbackType: type, // 'up' or 'down'
    })
  }}
  onMessageRetry={(messageId) => {
    // Retry failed message
    retryMessage(messageId)
  }}
/>
\`\`\`

### Scroll-to-Bottom Button

A floating button appears automatically when the user scrolls up:

\`\`\`tsx
// Built-in scroll button - no configuration needed
<MessageList messages={messages} />

// Button automatically:
// - Appears when user scrolls away from bottom
// - Disappears when at the bottom
// - Smoothly scrolls to bottom when clicked
// - Shows unread message count (future feature)
\`\`\`

### Stagger Animations

Messages appear with smooth stagger animations using Framer Motion:

\`\`\`tsx
// Automatic stagger animation for messages
<MessageList messages={messages} />

// Animation configuration:
// - Container: staggerChildren: 0.05
// - Each message: fadeIn with slide from opacity 0 to 1
// - Smooth transitions with layout animations
\`\`\`

## Animation Details

The Message List uses Framer Motion for smooth animations:

\`\`\`tsx
// Container animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms delay between each message
    },
  },
}

// Individual message animation
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}
\`\`\`

**Animation features:**
- Stagger effect for sequential message appearance
- Fade and slide animations
- Smooth layout animations for message updates
- AnimatePresence for exit animations

## Accessibility

The Message List component follows accessibility best practices:

- **Semantic HTML**: Uses proper list structure (\`<ul>\`/\`<li>\`)
- **ARIA labels**: Scroll button has descriptive \`aria-label\`
- **Keyboard navigation**: All interactive elements are keyboard accessible
- **Screen reader support**: Messages are announced as they appear
- **Focus management**: Maintains focus appropriately during updates
- **Motion preferences**: Respects \`prefers-reduced-motion\` for animations

## TypeScript

### MessageType Interface

\`\`\`typescript
interface MessageType {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
  attachments?: MessageAttachment[]
  metadata?: Record<string, unknown>
}
\`\`\`

### MessageListProps Interface

\`\`\`typescript
interface MessageListProps {
  messages: MessageType[]
  onMessageCopy?: (messageId: string, content: string) => void
  onMessageFeedback?: (messageId: string, type: 'up' | 'down') => void
  onMessageRetry?: (messageId: string) => void
  isLoading?: boolean
  loadingCount?: number
  emptyState?: React.ReactNode
  className?: string
}
\`\`\`

## Integration with Other Components

The Message List works seamlessly with other Clarity Chat components:

\`\`\`tsx
import { 
  MessageList, 
  AdvancedChatInput,
  StreamingMessage 
} from '@clarity-chat/react'

function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      {/* Message display area */}
      <MessageList
        messages={messages}
        isLoading={isStreaming}
        onMessageCopy={handleCopy}
        onMessageFeedback={handleFeedback}
      />
      
      {/* Input area */}
      <AdvancedChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isStreaming}
      />
    </div>
  )
}
\`\`\`

## Advanced Example: Real-time Chat

Complete example with streaming messages and real-time updates:

\`\`\`tsx
import { useState, useCallback } from 'react'
import { MessageList, AdvancedChatInput } from '@clarity-chat/react'
import { Message } from '@clarity-chat/types'

function RealTimeChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Simulate API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content }),
      })

      const data = await response.json()
      
      // Add assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleCopy = useCallback((id: string, content: string) => {
    navigator.clipboard.writeText(content)
  }, [])

  const handleFeedback = useCallback((id: string, type: 'up' | 'down') => {
    // Track feedback
    console.log(\`Feedback for \${id}: \${type}\`)
  }, [])

  const handleRetry = useCallback((id: string) => {
    const message = messages.find(m => m.id === id)
    if (message) {
      handleSubmit(message.content)
    }
  }, [messages, handleSubmit])

  return (
    <div className="flex flex-col h-screen">
      <MessageList
        messages={messages}
        isLoading={isLoading}
        loadingCount={1}
        onMessageCopy={handleCopy}
        onMessageFeedback={handleFeedback}
        onMessageRetry={handleRetry}
        emptyState={
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground">Start a conversation</p>
          </div>
        }
      />
      
      <div className="border-t p-4">
        <AdvancedChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isLoading}
          placeholder="Type a message..."
        />
      </div>
    </div>
  )
}
\`\`\`

## Related Components

- [Message](/reference/components/message) - Individual message component
- [Streaming Message](/reference/components/streaming-message) - Real-time message streaming
- [Advanced Chat Input](/reference/components/advanced-chat-input) - Enhanced input component
- [Virtualized Message List](/reference/components/virtualized-message-list) - Performance-optimized list
- [Thinking Indicator](/reference/components/thinking-indicator) - Loading animation
- [Empty State](/reference/components/empty-state) - No-content placeholder

## Best Practices

1. **Performance**: Use Virtualized Message List for conversations with 100+ messages
2. **Loading feedback**: Always show loading state during API calls
3. **Empty states**: Provide helpful empty state guidance
4. **Error handling**: Use retry callback for failed messages
5. **Accessibility**: Test with keyboard navigation and screen readers
6. **Auto-scroll**: Let the component handle scroll behavior automatically
7. **Message limits**: Consider pagination for very long conversations
8. **Animations**: Respect user motion preferences

## Hooks Used

The Message List component uses the \`useAutoScroll\` hook internally:

- [useAutoScroll](/reference/hooks/use-auto-scroll) - Automatic scroll-to-bottom behavior

This hook provides:
- Smooth scrolling to the bottom
- Detection of user scroll position
- Conditional auto-scroll based on user intent
- Scroll-to-bottom button visibility control
