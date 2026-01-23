'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  ToastProvider,
  VirtualizedMessageList,
  Message,
} from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

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
  const messages = useMemo(() => generateDemoMessages(100), [])

  const renderMessage = useCallback((message: MessageType, index: number) => {
    return (
      <div className="px-4 py-3 border-b border-border/50">
        <Message message={message} />
      </div>
    )
  }, [])

  return (
    <div
      className="w-full max-w-2xl border border-border rounded-lg bg-background"
      style={{ height: '400px' }}
    >
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
    description:
      'Array of message objects to render. Works efficiently with thousands of messages.',
  },
  {
    name: 'renderMessage',
    type: '(message: Message, index: number) => React.ReactNode',
    required: true,
    description:
      'Render function for each message. Receives the message object and its index.',
  },
  {
    name: 'estimatedItemSize',
    type: 'number',
    default: '150',
    description:
      'Initial height estimate in pixels. Used before actual measurement. Should be close to average message height.',
  },
  {
    name: 'overscanCount',
    type: 'number',
    default: '3',
    description:
      'Number of items to render outside the visible area. Prevents blank gaps during scrolling.',
  },
  {
    name: 'autoScrollToBottom',
    type: 'boolean',
    default: 'true',
    description:
      'Automatically scroll to bottom when new messages arrive (if user is near bottom).',
  },
  {
    name: 'onScroll',
    type: '(scrollOffset: number) => void',
    description:
      'Callback fired when scroll position changes. Useful for analytics or multi-pane layouts.',
  },
  {
    name: 'threshold',
    type: 'number',
    description:
      'Message count threshold for enabling virtualization. If not set, virtualization is always enabled.',
  },
  {
    name: 'itemKey',
    type: '(index: number, data: Message[]) => string',
    description:
      'Custom key resolver function. Useful for optimistic updates or synthetic IDs. Defaults to message.id.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the container element.',
  },
]

export default function VirtualizedMessageListPage() {
  return (
    <ToastProvider>
      <div className="docs-content">
        <Breadcrumbs />

        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              VirtualizedMessageList
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed">
              High-performance message rendering for conversations with
              thousands of messages. Uses virtual scrolling (windowing) to
              maintain 60fps performance regardless of list size.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Callout type="info" className="mb-8">
            <p>
              For smaller conversations (&lt;100 messages), use{' '}
              <a href="/reference/components/message-list">MessageList</a>{' '}
              instead. VirtualizedMessageList is optimized for large message
              lists (1000+ messages).
            </p>
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ViewInStorybook component="VirtualizedMessageList" />
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
            <p className="mb-6 text-muted-foreground">
              Try scrolling through 100 messages! Notice how smoothly it
              performs thanks to virtualization.
            </p>
            <CodePlayground
              initialCode={`function Example() {
  // Generate 100 messages
  const messages = React.useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: \`msg-\${i}\`,
      chatId: 'demo',
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: \`Message \${i + 1} with some varied content length to demonstrate dynamic sizing.\`,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  , [])

  const renderMessage = (message) => (
    <div className="px-4 py-3 border-b hover:bg-muted/50 transition-colors">
      <strong>{message.role === 'user' ? 'You' : 'AI'}</strong>: {message.content}
    </div>
  )

  return (
    <div className="h-96 border rounded-lg bg-background">
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
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <h2 id="import">Import</h2>
          <EnhancedCodeBlock
            code={`import { VirtualizedMessageList } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'`}
            language="tsx"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <h2 id="basic-usage">Basic Usage</h2>
          <p className="mb-4">
            VirtualizedMessageList requires a <code>renderMessage</code>{' '}
            function to render each message. This gives you full control over
            message rendering:
          </p>

          <ComponentPreview
            title="Simple Virtualized List"
            description="Rendering 100 messages with virtual scrolling"
            code={`import { VirtualizedMessageList, Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'

function SimpleVirtualizedList() {
  const messages = generateMessages(100) // Your messages array

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
        </ScrollReveal>

        <ScrollReveal delay={0.6}>
          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div>
              <h2 id="why-virtualization">Why Virtualization?</h2>
              <p className="mb-4 text-muted-foreground">
                Virtual scrolling only renders messages that are visible in the
                viewport, plus a few extra for smooth scrolling. This provides
                significant performance benefits:
              </p>
              <ul className="space-y-2">
                <li>
                  ⚡ <strong>Memory efficient:</strong> Only visible messages
                  are in the DOM
                </li>
                <li>
                  🚀 <strong>Fast rendering:</strong> Initial render time is
                  constant regardless of message count
                </li>
                <li>
                  🎞️ <strong>Smooth scrolling:</strong> No performance
                  degradation with thousands of messages
                </li>
                <li>
                  📱 <strong>Better UX:</strong> Maintains 60fps scrolling even
                  with 10,000+ messages
                </li>
              </ul>
            </div>
            <div className="bg-muted/30 p-6 rounded-xl border border-border">
              <h3 className="font-semibold mb-4">Performance Comparison</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Standard List (1000 items)</span>
                    <span className="text-red-500">~800ms render</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[80%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Virtualized List (1000 items)</span>
                    <span className="text-green-500">&lt;10ms render</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[5%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.7}>
          <h2 id="props">Props</h2>
          <PropsTable props={virtualizedMessageListProps} />
        </ScrollReveal>

        <ScrollReveal delay={0.8}>
          <h2 id="advanced-usage">Advanced Usage</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Scroll Management</h3>
              <p className="mb-4 text-muted-foreground">
                Control auto-scrolling and track scroll position for features
                like "Scroll to Bottom" buttons.
              </p>
              <EnhancedCodeBlock
                language="tsx"
                code={`<VirtualizedMessageList
  messages={messages}
  renderMessage={renderMessage}
  onScroll={(offset) => {
    setShowScrollButton(offset > 100)
  }}
  autoScrollToBottom={isNearBottom}
/>`}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Custom Item Keys</h3>
              <p className="mb-4 text-muted-foreground">
                Provide a custom key function for better React reconciliation,
                especially with dynamic updates.
              </p>
              <EnhancedCodeBlock
                language="tsx"
                code={`<VirtualizedMessageList
  messages={messages}
  renderMessage={renderMessage}
  itemKey={(index, data) => {
    const msg = data[index]
    return \`\${msg.id}-\${msg.updatedAt.getTime()}\`
  }}
/>`}
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.9}>
          <h2 id="related">Related</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/reference/components/message-list"
              className="block p-4 border rounded-lg hover:border-brand-500 transition-colors"
            >
              <h3 className="font-semibold mb-1">MessageList</h3>
              <p className="text-sm text-muted-foreground">
                Standard list for smaller conversations.
              </p>
            </a>
            <a
              href="/reference/components/chat-window"
              className="block p-4 border rounded-lg hover:border-brand-500 transition-colors"
            >
              <h3 className="font-semibold mb-1">ChatWindow</h3>
              <p className="text-sm text-muted-foreground">
                Full chat interface component.
              </p>
            </a>
          </div>
        </ScrollReveal>

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
      </div>
    </ToastProvider>
  )
}
