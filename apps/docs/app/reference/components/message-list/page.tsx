'use client'

import { useState, useCallback } from 'react'
import { ToastProvider, SimpleMessageList as MessageList } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic demo component
function BasicMessageListDemo() {
  const [messages] = useState<Message[]>([
    {
      id: '1',
      chatId: 'demo-chat',
      role: 'user',
      content: 'Hello!',
      status: 'sent',
      createdAt: new Date(Date.now() - 5000),
      updatedAt: new Date(Date.now() - 5000),
    },
    {
      id: '2',
      chatId: 'demo-chat',
      role: 'assistant',
      content: 'Hi there! How can I help you today?',
      status: 'sent',
      createdAt: new Date(Date.now() - 3000),
      updatedAt: new Date(Date.now() - 3000),
    },
  ])

  return (
    <div
      className="w-full max-w-2xl border border-border rounded-lg"
      style={{ height: '400px' }}
    >
      <MessageList
        messages={messages}
        onMessageCopy={() => {}}
        onMessageFeedback={() => {}}
        onMessageRetry={() => {}}
        onEditMessage={() => {}}
        onRegenerateMessage={() => {}}
        onDeleteMessage={() => {}}
        onStopGeneration={() => {}}
        editingMessageId={null}
        onSaveEdit={() => {}}
        onCancelEdit={() => {}}
        emptyState={null}
        className=""
      />
    </div>
  )
}

// With loading demo
function MessageListWithLoadingDemo() {
  const [messages] = useState<Message[]>([])
  const [isLoading] = useState(true)

  return (
    <div
      className="w-full max-w-2xl border border-border rounded-lg"
      style={{ height: '400px' }}
    >
      <MessageList
        messages={messages}
        isLoading={isLoading}
        loadingCount={3}
        onMessageCopy={() => {}}
        onMessageFeedback={() => {}}
        onMessageRetry={() => {}}
        onEditMessage={() => {}}
        onRegenerateMessage={() => {}}
        onDeleteMessage={() => {}}
        onStopGeneration={() => {}}
        editingMessageId={null}
        onSaveEdit={() => {}}
        onCancelEdit={() => {}}
        emptyState={null}
        className=""
      />
    </div>
  )
}

const messageListProps: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description:
      'Array of message objects to display. Each message must be a valid Message from @clarity-chat/types.',
  },
  {
    name: 'onMessageCopy',
    type: '(messageId: string, content: string) => void',
    description:
      'Callback when a message is copied. Receives message ID and content.',
  },
  {
    name: 'onMessageFeedback',
    type: '(messageId: string, type: "up" | "down") => void',
    description: 'Callback when user provides feedback on a message.',
  },
  {
    name: 'onMessageRetry',
    type: '(messageId: string) => void',
    description: 'Callback when user requests to retry a failed message.',
  },
  {
    name: 'onEditMessage',
    type: '(messageId: string) => void',
    description: 'Callback when user edits a message.',
  },
  {
    name: 'onRegenerateMessage',
    type: '(messageId: string) => void',
    description: 'Callback when user requests to regenerate a message.',
  },
  {
    name: 'onDeleteMessage',
    type: '(messageId: string) => void',
    description: 'Callback when user deletes a message.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description: 'Show loading skeleton while messages are being fetched.',
  },
  {
    name: 'loadingCount',
    type: 'number',
    default: '3',
    description: 'Number of skeleton messages to show while loading.',
  },
  {
    name: 'emptyState',
    type: 'ReactNode',
    description:
      'Custom content to display when there are no messages. Defaults to a welcome message.',
  },
  {
    name: 'enableGrouping',
    type: 'boolean',
    default: 'true',
    description:
      'Enable message grouping for consecutive messages from the same sender.',
  },
  {
    name: 'showTimeSeparators',
    type: 'boolean',
    default: 'true',
    description: 'Show time separators between messages from different days.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the container element.',
  },
]

export default function MessageListPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>MessageList</h1>

        <p className="lead">
          A composable message list component with auto-scrolling, animations,
          message grouping, time separators, and loading states. Perfect for
          displaying chat conversations.
        </p>

        <Callout type="info">
          <p>
            For drop-in usage, use the{' '}
            <a href="/reference/components/clarity-chat">ClarityChat</a>{' '}
            component. For very large message lists (1000+), use{' '}
            <a href="/reference/components/virtualized-message-list">
              VirtualizedMessageList
            </a>
            .
          </p>
        </Callout>

        <ViewInStorybook component="MessageList" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Experiment with the MessageList component! Try different
            configurations and see how messages are displayed.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const messages = [
    {
      id: '1',
      chatId: 'demo',
      role: 'user',
      content: 'Hello!',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      chatId: 'demo',
      role: 'assistant',
      content: 'Hi there! How can I help?',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  return (
    <div className="h-96 border rounded-lg">
      <MessageList messages={messages} />
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { MessageList } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import '@clarity-chat/react/styles.css'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          MessageList accepts an array of messages and handles rendering,
          grouping, and scrolling:
        </p>

        <ComponentPreview
          title="Simple Message List"
          description="A basic message list with auto-scrolling"
          code={`import { MessageList } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function SimpleMessageList() {
  const messages: Message[] = [
    {
      id: '1',
      chatId: 'demo',
      role: 'user',
      content: 'Hello!',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      chatId: 'demo',
      role: 'assistant',
      content: 'Hi there! How can I help?',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  return (
    <div className="h-96 border rounded-lg">
      <MessageList messages={messages} />
    </div>
  )
}`}
        >
          <BasicMessageListDemo />
        </ComponentPreview>

        <h2 id="with-loading">Loading State</h2>

        <p>Show loading skeletons while messages are being fetched:</p>

        <ComponentPreview
          title="With Loading State"
          description="Loading skeletons while fetching messages"
          code={`import { MessageList } from '@clarity-chat/react'

function MessageListWithLoading() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch messages
    fetchMessages().then(msgs => {
      setMessages(msgs)
      setIsLoading(false)
    })
  }, [])

  return (
    <MessageList
      messages={messages}
      isLoading={isLoading}
      loadingCount={5} // Show 5 skeleton messages
    />
  )
}`}
        >
          <MessageListWithLoadingDemo />
        </ComponentPreview>

        <h2 id="message-operations">Message Operations</h2>

        <p>Enable message operations by providing callback functions:</p>

        <EnhancedCodeBlock
          code={`import { MessageList } from '@clarity-chat/react'

function MessageListWithOperations() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleCopy = useCallback((messageId: string, content: string) => {
    navigator.clipboard.writeText(content)
    // Show toast notification
  }, [])

  const handleFeedback = useCallback((messageId: string, type: 'up' | 'down') => {
    // Send feedback to analytics
    console.log('Feedback:', messageId, type)
  }, [])

  const handleRetry = useCallback((messageId: string) => {
    // Retry failed message
    console.log('Retry:', messageId)
  }, [])

  const handleEdit = useCallback((messageId: string) => {
    // Open edit dialog
    console.log('Edit:', messageId)
  }, [])

  const handleDelete = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }, [])

  return (
    <MessageList
      messages={messages}
      onMessageCopy={handleCopy}
      onMessageFeedback={handleFeedback}
      onMessageRetry={handleRetry}
      onEditMessage={handleEdit}
      onDeleteMessage={handleDelete}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="message-grouping">Message Grouping</h2>

        <p>
          MessageList automatically groups consecutive messages from the same
          sender for better visual organization:
        </p>

        <EnhancedCodeBlock
          code={`import { MessageList } from '@clarity-chat/react'

function GroupedMessages() {
  const messages: Message[] = [
    {
      id: '1',
      chatId: 'demo',
      role: 'user',
      content: 'First message',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      chatId: 'demo',
      role: 'user',
      content: 'Second message',
      status: 'sent',
      createdAt: new Date(Date.now() + 2000),
      updatedAt: new Date(Date.now() + 2000),
    },
    {
      id: '3',
      chatId: 'demo',
      role: 'assistant',
      content: 'Response',
      status: 'sent',
      createdAt: new Date(Date.now() + 4000),
      updatedAt: new Date(Date.now() + 4000),
    },
  ]

  return (
    <MessageList
      messages={messages}
      enableGrouping={true} // Group consecutive messages (default)
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="tip">
          <p>
            Message grouping improves visual clarity by reducing redundant
            avatars and timestamps for consecutive messages from the same
            sender.
          </p>
        </Callout>

        <h2 id="time-separators">Time Separators</h2>

        <p>Show time separators between messages from different days:</p>

        <EnhancedCodeBlock
          code={`import { MessageList } from '@clarity-chat/react'

function MessageListWithSeparators() {
  const messages: Message[] = [
    {
      id: '1',
      chatId: 'demo',
      role: 'user',
      content: 'Message from yesterday',
      status: 'sent',
      createdAt: new Date(Date.now() - 86400000), // Yesterday
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      chatId: 'demo',
      role: 'assistant',
      content: 'Message from today',
      status: 'sent',
      createdAt: new Date(), // Today
      updatedAt: new Date(),
    },
  ]

  return (
    <MessageList
      messages={messages}
      showTimeSeparators={true} // Show "Today", "Yesterday", etc. (default)
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="custom-empty-state">Custom Empty State</h2>

        <p>Provide a custom empty state when there are no messages:</p>

        <EnhancedCodeBlock
          code={`import { MessageList } from '@clarity-chat/react'

function MessageListWithCustomEmpty() {
  const customEmptyState = (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
      <p className="text-muted-foreground text-sm">
        Start a conversation by sending a message!
      </p>
    </div>
  )

  return (
    <MessageList
      messages={[]}
      emptyState={customEmptyState}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="auto-scroll">Auto-Scroll</h2>

        <p>
          MessageList automatically scrolls to the bottom when new messages
          arrive, but only if the user is already near the bottom:
        </p>

        <EnhancedCodeBlock
          code={`import { MessageList } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function MessageListWithAutoScroll() {
  const chat = useClarityChat({ api: '/api/chat' })

  // MessageList automatically handles auto-scrolling
  // It only scrolls if user is near the bottom
  return (
    <MessageList
      messages={chat.messages}
      onMessageCopy={chat.onMessageCopy}
      onMessageFeedback={chat.onMessageFeedback}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="props">Props</h2>

        <PropsTable props={messageListProps} />

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { useState, useCallback } from 'react'
import { MessageList, useClarityChat } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function CompleteMessageList() {
  const chat = useClarityChat({ api: '/api/chat' })

  const handleCopy = useCallback((messageId: string, content: string) => {
    navigator.clipboard.writeText(content)
    // Show toast
  }, [])

  const handleFeedback = useCallback((messageId: string, type: 'up' | 'down') => {
    // Send to analytics
    fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ messageId, type }),
    })
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={chat.messages}
          isLoading={chat.isLoading}
          onMessageCopy={handleCopy}
          onMessageFeedback={handleFeedback}
          onMessageRetry={(id) => {
            // Retry logic
          }}
          enableGrouping
          showTimeSeparators
          className="h-full"
        />
      </div>
      {/* Your input component here */}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="warning">
          <p>
            <strong>Note:</strong> The API endpoint <code>/api/chat</code> is a
            placeholder. You'll need to implement your own backend API endpoint.
          </p>
        </Callout>

        <h2 id="performance">Performance</h2>

        <p>MessageList is optimized for performance:</p>

        <ul>
          <li>
            <strong>React 19 optimizations:</strong> Automatic memoization and
            compiler optimizations
          </li>
          <li>
            <strong>Efficient grouping:</strong> Message grouping is calculated
            efficiently
          </li>
          <li>
            <strong>Staggered animations:</strong> Messages animate in with
            staggered timing for smooth appearance
          </li>
          <li>
            <strong>Reduced motion support:</strong> Respects{' '}
            <code>prefers-reduced-motion</code>
          </li>
        </ul>

        <Callout type="tip">
          <p>
            For conversations with 1000+ messages, use{' '}
            <a href="/reference/components/virtualized-message-list">
              VirtualizedMessageList
            </a>{' '}
            for better performance.
          </p>
        </Callout>

        <h2 id="accessibility">Accessibility</h2>

        <p>MessageList is built with accessibility in mind:</p>

        <ul>
          <li>✅ Semantic HTML structure</li>
          <li>✅ ARIA labels for all interactive elements</li>
          <li>✅ Keyboard navigation support</li>
          <li>✅ Screen reader announcements for new messages</li>
          <li>✅ Focus management</li>
          <li>✅ Reduced motion support</li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/components/message">Message</a> - Individual
            message component
          </li>
          <li>
            <a href="/reference/components/virtualized-message-list">
              VirtualizedMessageList
            </a>{' '}
            - For large message lists
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> -
            Complete chat interface
          </li>
          <li>
            <a href="/reference/components/clarity-chat">ClarityChat</a> -
            Drop-in component
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'Message',
            href: '/reference/components/message',
          }}
          next={{
            title: 'VirtualizedMessageList',
            href: '/reference/components/virtualized-message-list',
          }}
        />
      </>
    </ToastProvider>
  )
}
