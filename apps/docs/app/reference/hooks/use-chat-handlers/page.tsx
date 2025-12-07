'use client'

import type { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useChatHandlers Hook | Clarity Chat',
  description: 'Pre-configured handlers for common chat operations, eliminating boilerplate when using useClarityChat with ChatWindow.',
}

const useChatHandlersOptions: Prop[] = [
  {
    name: 'chat',
    type: 'UseClarityChatReturn',
    required: true,
    description: 'The chat instance returned from useClarityChat hook.',
  },
  {
    name: 'onMessageSent',
    type: '(content: string) => void | Promise<void>',
    description: 'Optional callback when a message is successfully sent.',
  },
  {
    name: 'onMessageError',
    type: '(error: Error) => void',
    description: 'Optional callback when message sending fails.',
  },
]

const useChatHandlersReturn: Prop[] = [
  {
    name: 'onSendMessage',
    type: '(content: string) => Promise<void>',
    description: 'Handler for sending messages. Wraps chat.append with error handling.',
  },
  {
    name: 'onClear',
    type: '() => void',
    description: 'Handler for clearing all messages from the chat.',
  },
  {
    name: 'onRetry',
    type: '(messageId: string) => Promise<void>',
    description: 'Handler for retrying a failed message.',
  },
  {
    name: 'onEdit',
    type: '(messageId: string, newContent: string) => Promise<void>',
    description: 'Handler for editing an existing message.',
  },
]

export default function UseChatHandlersPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useChatHandlers</h1>

      <p className="lead">
        Pre-configured handlers for common chat operations, eliminating boilerplate
        when using <code>useClarityChat</code> with <code>ChatWindow</code>.
      </p>

      <Callout type="info" title="Architecture Layer">
        <p>
          <strong>useChatHandlers</strong> is a mid-level hook that provides pre-configured
          handlers for <code>ChatWindow</code>. It wraps common patterns like sending messages,
          clearing chat, and retrying messages with proper error handling.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, useChatHandlers, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Chat() {
  const chat = useClarityChat({ api: '/api/chat' })
  
  // Pre-configured handlers - no boilerplate!
  const handlers = useChatHandlers({ chat })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
      onClear={handlers.onClear}
    />
  )
}`}
        />

        <Callout type="success" title="No Boilerplate">
          <p>
            Without <code>useChatHandlers</code>, you'd need to write error handling,
            async/await logic, and state management yourself. This hook handles it all!
          </p>
        </Callout>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with the useChatHandlers hook:
        </p>
        <CodePlayground
          initialCode={`import { useClarityChat, useChatHandlers, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Example() {
  const chat = useClarityChat({ api: '/api/chat' })
  const handlers = useChatHandlers({ chat })

  return (
    <div style={{ height: '500px' }}>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handlers.onSendMessage}
        onClear={handlers.onClear}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Callbacks</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, useChatHandlers, ChatWindow } from '@clarity-chat/react'

function Chat() {
  const chat = useClarityChat({ api: '/api/chat' })
  
  const handlers = useChatHandlers({
    chat,
    onMessageSent: (content) => {
      console.log('Message sent:', content)
      // Track analytics
      analytics.track('message_sent', { length: content.length })
    },
    onMessageError: (error) => {
      console.error('Failed to send message:', error)
      // Show user-friendly error
      toast.error('Failed to send message. Please try again.')
    },
  })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
      onClear={handlers.onClear}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Message Operations</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, useChatHandlers, ChatWindow } from '@clarity-chat/react'

function Chat() {
  const chat = useClarityChat({ api: '/api/chat' })
  const handlers = useChatHandlers({ chat })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
      onClear={handlers.onClear}
      onMessageRetry={handlers.onRetry}
      onEditMessage={handlers.onEdit}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Custom Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, useChatHandlers, ChatWindow } from '@clarity-chat/react'

function Chat() {
  const chat = useClarityChat({ api: '/api/chat' })
  
  const handlers = useChatHandlers({
    chat,
    onMessageError: (error) => {
      // Custom error handling
      if (error.message.includes('rate limit')) {
        toast.error('Too many requests. Please wait a moment.')
      } else if (error.message.includes('network')) {
        toast.error('Network error. Check your connection.')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
      
      // Log to error tracking
      errorTracking.captureException(error)
    },
  })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useChatHandlersOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useChatHandlersReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">What It Does</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          <strong>useChatHandlers</strong> provides pre-configured handlers that:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>onSendMessage</strong> - Wraps <code>chat.append</code> with error handling and callbacks</li>
          <li><strong>onClear</strong> - Clears all messages using <code>chat.setMessages([])</code></li>
          <li><strong>onRetry</strong> - Retries a failed message using <code>chat.reload</code></li>
          <li><strong>onEdit</strong> - Edits a message and optionally triggers a new response</li>
        </ul>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          All handlers include proper error handling, loading states, and optional callbacks
          for analytics and user feedback.
        </p>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Without useChatHandlers</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Without this hook, you'd need to write:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`// Manual implementation (what useChatHandlers does for you)
const handleSendMessage = async (content: string) => {
  try {
    await chat.append({ role: 'user', content })
    onMessageSent?.(content)
  } catch (error) {
    onMessageError?.(error as Error)
    // Handle error...
  }
}

const handleClear = () => {
  chat.setMessages([])
}

const handleRetry = async (messageId: string) => {
  try {
    await chat.reload()
  } catch (error) {
    onMessageError?.(error as Error)
  }
}

// ... and more boilerplate`}
        />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          <code>useChatHandlers</code> eliminates all this boilerplate!
        </p>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-clarity-chat" className="docs-card">
            <h3>useClarityChat Hook</h3>
            <p>Chat state hook used by useChatHandlers</p>
          </a>
          <a href="/reference/components/chat-window" className="docs-card">
            <h3>ChatWindow Component</h3>
            <p>Component that uses these handlers</p>
          </a>
          <a href="/reference/components/clarity-chat" className="docs-card">
            <h3>ClarityChat Component</h3>
            <p>Drop-in component (uses handlers internally)</p>
          </a>
          <a href="/reference/hooks/use-chat-enhanced" className="docs-card">
            <h3>useChatEnhanced Hook</h3>
            <p>Lower-level hook (if you need more control)</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'useClarityChat', href: '/reference/hooks/use-clarity-chat' }}
        next={{ title: 'useChat', href: '/reference/hooks/use-chat' }}
      />
    </>
  )
}
