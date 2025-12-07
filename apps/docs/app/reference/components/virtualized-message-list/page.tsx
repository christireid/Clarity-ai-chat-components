'use client'

import { useState, useCallback } from 'react'
import { ToastProvider, VirtualizedMessageList, Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Generate demo messages
function generateDemoMessages(count: number): MessageType[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `msg-${i}`,
    chatId: 'demo-chat',
    role: i % 2 === 0 ? 'user' : 'assistant',
    content: `This is message ${i + 1} in a large conversation. It demonstrates virtual scrolling for efficient rendering of many messages.`,
    status: 'sent' as const,
    createdAt: new Date(Date.now() - (count - i) * 60000),
    updatedAt: new Date(Date.now() - (count - i) * 60000),
  }))
}

// Basic demo component
function BasicVirtualizedDemo() {
  const messages = generateDemoMessages(100)

  const renderMessage = useCallback((message: MessageType, index: number) => {
    return (
      <div className="px-4 py-3 border-b border-border/50">
        <Message message={message} />
      </div>
    )
  }, [])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg" style={{ height: '400px' }}>
      <VirtualizedMessageList
        messages={messages}
        renderMessage={renderMessage}
        estimatedItemSize={100}
      />
    </div>
  )
}

const virtualizedMessageListProps: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of message objects to render. Works efficiently with thousands of messages.',
  },
  {
    name: 'renderMessage',
    type: '(message: Message, index: number) => React.ReactNode',
    required: true,
    description: 'Render function for each message. Receives the message object and its index.',
  },
  {
    name: 'estimatedItemSize',
    type: 'number',
    default: '150',
    description: 'Initial height estimate in pixels. Used before actual measurement. Should be close to average message height.',
  },
  {
    name: 'overscanCount',
    type: 'number',
    default: '3',
    description: 'Number of items to render outside the visible area. Prevents blank gaps during scrolling.',
  },
  {
    name: 'autoScrollToBottom',
    type: 'boolean',
    default: 'true',
    description: 'Automatically scroll to bottom when new messages arrive (if user is near bottom).',
  },
  {
    name: 'onScroll',
    type: '(scrollOffset: number) => void',
    description: 'Callback fired when scroll position changes. Useful for analytics or multi-pane layouts.',
  },
  {
    name: 'threshold',
    type: 'number',
    description: 'Message count threshold for enabling virtualization. If not set, virtualization is always enabled.',
  },
  {
    name: 'itemKey',
    type: '(index: number, data: Message[]) => string',
    description: 'Custom key resolver function. Useful for optimistic updates or synthetic IDs. Defaults to message.id.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the container element.',
  },
]

export const dynamic = 'force-dynamic'

export default function VirtualizedMessageListPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>VirtualizedMessageList</h1>

        <p className="lead">
          High-performance message rendering for conversations with thousands of messages.
          Uses react-window for virtual scrolling to maintain smooth performance.
        </p>

        <Callout type="info">
          <p>
            For smaller conversations (&lt;100 messages), use{' '}
            <a href="/reference/components/message-list">MessageList</a> instead.
            VirtualizedMessageList is optimized for large message lists (1000+ messages).
          </p>
        </Callout>

        <ViewInStorybook component="VirtualizedMessageList" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Try scrolling through 100 messages! Notice how smoothly it performs thanks to virtualization.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const messages = Array.from({ length: 100 }, (_, i) => ({
    id: \`msg-\${i}\`,
    chatId: 'demo',
    role: i % 2 === 0 ? 'user' : 'assistant',
    content: \`Message \${i + 1}\`,
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  const renderMessage = (message) => (
    <div className="px-4 py-3 border-b">
      <strong>{message.role}</strong>: {message.content}
    </div>
  )

  return (
    <div className="h-96 border rounded-lg">
      <VirtualizedMessageList
        messages={messages}
        renderMessage={renderMessage}
      />
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { VirtualizedMessageList, Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'
import '@clarity-chat/react/styles.css'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          VirtualizedMessageList requires a <code>renderMessage</code> function to render each message.
          This gives you full control over message rendering:
        </p>

        <ComponentPreview
          title="Simple Virtualized List"
          description="Rendering 100 messages with virtual scrolling"
          code={`import { VirtualizedMessageList, Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'

function SimpleVirtualizedList() {
  const messages: MessageType[] = [
    // ... your messages array
  ]

  const renderMessage = useCallback((message: MessageType, index: number) => {
    return (
      <div className="px-4 py-3 border-b border-border/50">
        <Message message={message} />
      </div>
    )
  }, [])

  return (
    <div className="h-[600px] border rounded-lg">
      <VirtualizedMessageList
        messages={messages}
        renderMessage={renderMessage}
        estimatedItemSize={100}
      />
    </div>
  )
}`}
        >
          <BasicVirtualizedDemo />
        </ComponentPreview>

        <h2 id="why-virtualization">Why Virtualization?</h2>

        <p>
          Virtual scrolling only renders messages that are visible in the viewport, plus a few
          extra for smooth scrolling. This provides significant performance benefits:
        </p>

        <ul>
          <li>
            <strong>Memory efficient:</strong> Only visible messages are in the DOM
          </li>
          <li>
            <strong>Fast rendering:</strong> Initial render time is constant regardless of message count
          </li>
          <li>
            <strong>Smooth scrolling:</strong> No performance degradation with thousands of messages
          </li>
          <li>
            <strong>Better UX:</strong> Maintains 60fps scrolling even with 10,000+ messages
          </li>
        </ul>

        <Callout type="tip">
          <p>
            <strong>When to use:</strong> Use VirtualizedMessageList when you have 100+ messages
            or expect conversations to grow large. For smaller chats, regular MessageList is simpler.
          </p>
        </Callout>

        <h2 id="estimated-item-size">Estimated Item Size</h2>

        <p>
          Provide an accurate <code>estimatedItemSize</code> for better initial rendering:
        </p>

        <EnhancedCodeBlock
          code={`import { VirtualizedMessageList } from '@clarity-chat/react'

function OptimizedVirtualizedList() {
  const renderMessage = useCallback((message, index) => {
    return <Message message={message} />
  }, [])

  return (
    <VirtualizedMessageList
      messages={messages}
      renderMessage={renderMessage}
      estimatedItemSize={120} // Average message height in pixels
      overscanCount={5} // Render 5 extra items above/below viewport
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="info">
          <p>
            The component automatically measures actual message heights and updates the cache.
            The estimate is only used for initial rendering.
          </p>
        </Callout>

        <h2 id="custom-rendering">Custom Message Rendering</h2>

        <p>
          You have full control over how each message is rendered:
        </p>

        <EnhancedCodeBlock
          code={`import { VirtualizedMessageList } from '@clarity-chat/react'

function CustomRenderedList() {
  const renderMessage = useCallback((message: MessageType, index: number) => {
    return (
      <div className="px-4 py-3 border-b">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {message.role === 'user' ? 'U' : 'A'}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm mb-1">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div className="text-sm">{message.content}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    )
  }, [])

  return (
    <VirtualizedMessageList
      messages={messages}
      renderMessage={renderMessage}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="scroll-management">Scroll Management</h2>

        <p>
          Control auto-scrolling and track scroll position:
        </p>

        <EnhancedCodeBlock
          code={`import { VirtualizedMessageList } from '@clarity-chat/react'
import { useState, useCallback } from 'react'

function MessageListWithScrollControl() {
  const [scrollOffset, setScrollOffset] = useState(0)
  const [isNearBottom, setIsNearBottom] = useState(true)

  const handleScroll = useCallback((offset: number) => {
    setScrollOffset(offset)
    // Determine if user is near bottom (within 100px)
    const container = document.querySelector('.message-list-container')
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container
      setIsNearBottom(scrollHeight - scrollTop - clientHeight < 100)
    }
  }, [])

  return (
    <div className="message-list-container h-[600px] border rounded-lg">
      <VirtualizedMessageList
        messages={messages}
        renderMessage={renderMessage}
        onScroll={handleScroll}
        autoScrollToBottom={isNearBottom} // Only auto-scroll if near bottom
      />
      {!isNearBottom && (
        <button
          onClick={() => {
            // Scroll to bottom
          }}
          className="fixed bottom-4 right-4"
        >
          Scroll to bottom
        </button>
      )}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="custom-item-keys">Custom Item Keys</h2>

        <p>
          Provide a custom key function for better React reconciliation:
        </p>

        <EnhancedCodeBlock
          code={`import { VirtualizedMessageList } from '@clarity-chat/react'

function ListWithCustomKeys() {
  const itemKey = useCallback((index: number, data: MessageType[]) => {
    const message = data[index]
    // Use a composite key for better stability
    return \`\${message.id}-\${message.updatedAt.getTime()}\`
  }, [])

  return (
    <VirtualizedMessageList
      messages={messages}
      renderMessage={renderMessage}
      itemKey={itemKey}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="props">Props</h2>

        <PropsTable props={virtualizedMessageListProps} />

        <h2 id="performance-tips">Performance Tips</h2>

        <ul>
          <li>
            <strong>Stable message IDs:</strong> Ensure message IDs are stable to keep height cache accurate
          </li>
          <li>
            <strong>Memoize renderMessage:</strong> Wrap <code>renderMessage</code> in <code>useCallback</code> or define it outside render
          </li>
          <li>
            <strong>Accurate estimates:</strong> Set <code>estimatedItemSize</code> close to your average message height
          </li>
          <li>
            <strong>Debounce onScroll:</strong> If using <code>onScroll</code> for analytics, debounce it for high-volume streams
          </li>
          <li>
            <strong>Optimize message rendering:</strong> Use <code>React.memo</code> for your message components if needed
          </li>
        </ul>

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { useCallback, useMemo } from 'react'
import { VirtualizedMessageList, Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'

function CompleteVirtualizedList() {
  const messages: MessageType[] = useMemo(() => {
    // Your messages array
    return fetchMessages()
  }, [])

  const renderMessage = useCallback((message: MessageType, index: number) => {
    return (
      <div className="px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors">
        <Message
          message={message}
          onCopy={(content) => navigator.clipboard.writeText(content)}
          onFeedback={(type) => console.log('Feedback:', type)}
        />
      </div>
    )
  }, [])

  const itemKey = useCallback((index: number, data: MessageType[]) => {
    return data[index].id
  }, [])

  return (
    <div className="h-[600px] border rounded-lg">
      <VirtualizedMessageList
        messages={messages}
        renderMessage={renderMessage}
        estimatedItemSize={120}
        overscanCount={5}
        autoScrollToBottom={true}
        itemKey={itemKey}
        onScroll={(offset) => {
          // Optional: Track scroll for analytics
          console.log('Scroll offset:', offset)
        }}
      />
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="accessibility">Accessibility</h2>

        <p>VirtualizedMessageList maintains accessibility:</p>

        <ul>
          <li>✅ Keyboard navigation support</li>
          <li>✅ Screen reader compatibility</li>
          <li>✅ Focus management</li>
          <li>✅ ARIA attributes for virtual scrolling</li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/components/message-list">MessageList</a> - Standard message list for smaller conversations
          </li>
          <li>
            <a href="/reference/components/message">Message</a> - Individual message component
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> - Complete chat interface
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'MessageList',
            href: '/reference/components/message-list',
          }}
          next={{
            title: 'StreamingMessage',
            href: '/reference/components/streaming-message',
          }}
        />
      </>
    </ToastProvider>
  )
}
