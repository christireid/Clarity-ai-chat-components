import { logger } from '@clarity-chat/utils/logger';
'use client'

import { useState, useCallback } from 'react'
import { ToastProvider, Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic demo component
function BasicMessageDemo() {
  const message: MessageType = {
    id: '1',
    chatId: 'demo-chat',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <Message message={message} />
    </div>
  )
}

// With actions demo
function MessageWithActionsDemo() {
  const [message, setMessage] = useState<MessageType>({
    id: '1',
    chatId: 'demo-chat',
    role: 'assistant',
    content: 'This is a message with all actions enabled.',
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
    logger.debug('Copied:', content)
  }, [])

  const handleFeedback = useCallback((type: 'up' | 'down') => {
    logger.debug('Feedback:', type)
    setMessage((prev) => ({
      ...prev,
      feedback: { type, timestamp: new Date() },
    }))
  }, [])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <Message
        message={message}
        onCopy={handleCopy}
        onFeedback={handleFeedback}
        onRetry={() => logger.debug('Retry')}
        onEdit={() => logger.debug('Edit')}
        onRegenerate={() => logger.debug('Regenerate')}
        onDelete={() => logger.debug('Delete')}
      />
    </div>
  )
}

const messageProps: Prop[] = [
  {
    name: 'message',
    type: 'Message',
    required: true,
    description:
      'Message object from @clarity-chat/types containing id, role, content, status, etc.',
  },
  {
    name: 'onCopy',
    type: '(content: string) => void',
    description:
      'Callback when message is copied to clipboard. Receives the message content.',
  },
  {
    name: 'onFeedback',
    type: '(type: "up" | "down") => void',
    description: 'Callback when user provides feedback (thumbs up/down).',
  },
  {
    name: 'onRetry',
    type: '() => void',
    description: 'Callback when user requests to retry a failed message.',
  },
  {
    name: 'onEdit',
    type: '(messageId: string) => void',
    description: 'Callback when user edits a message. Receives the message ID.',
  },
  {
    name: 'onRegenerate',
    type: '(messageId: string) => void',
    description:
      'Callback when user requests to regenerate a message. Receives the message ID.',
  },
  {
    name: 'onDelete',
    type: '(messageId: string) => void',
    description:
      'Callback when user deletes a message. Receives the message ID.',
  },
  {
    name: 'showAvatar',
    type: 'boolean',
    default: 'true',
    description: 'Show avatar next to the message.',
  },
  {
    name: 'showTimestamp',
    type: 'boolean',
    default: 'true',
    description: 'Show timestamp below the message.',
  },
  {
    name: 'isGroupStart',
    type: 'boolean',
    default: 'true',
    description:
      'Whether this message is the first in a group of consecutive messages from the same sender.',
  },
  {
    name: 'isGroupEnd',
    type: 'boolean',
    default: 'true',
    description:
      'Whether this message is the last in a group of consecutive messages from the same sender.',
  },
  {
    name: 'isGrouped',
    type: 'boolean',
    default: 'false',
    description:
      'Whether this message is part of a group (affects spacing and avatar display).',
  },
  {
    name: 'errorDetails',
    type: 'ErrorDetails | string',
    description:
      'Error details to display for failed messages. Can be an ErrorDetails object or error message string.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the message container.',
  },
]

export default function MessagePage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>Message</h1>

        <p className="lead">
          A low-level component for rendering individual chat messages with
          markdown support, actions (copy, feedback, retry, edit, delete), and
          smooth animations.
        </p>

        <Callout type="info">
          <p>
            For displaying multiple messages, use the{' '}
            <a href="/reference/components/message-list">MessageList</a>{' '}
            component. For complete chat interfaces, use{' '}
            <a href="/reference/components/clarity-chat">ClarityChat</a>.
          </p>
        </Callout>

        <ViewInStorybook component="Message" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Experiment with the Message component! Try different configurations
            and see how it renders.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const message = {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: 'Hello! This is a demo message.',
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <Message
      message={message}
      onCopy={(content) => logger.debug('Copied:', content)}
    />
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'
import '@clarity-chat/react/styles.css'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          Message is a controlled component that accepts a <code>Message</code>{' '}
          object from <code>@clarity-chat/types</code>:
        </p>

        <ComponentPreview
          title="Simple Message"
          description="A basic message with default styling"
          code={`import { Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'

function SimpleMessage() {
  const message: MessageType = {
    id: '1',
    chatId: 'demo-chat',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return <Message message={message} />
}`}
        >
          <BasicMessageDemo />
        </ComponentPreview>

        <h2 id="message-actions">Message Actions</h2>

        <p>
          Enable message actions by providing callback functions. The component
          automatically shows action buttons on hover:
        </p>

        <ComponentPreview
          title="With All Actions"
          description="Message with copy, feedback, retry, edit, regenerate, and delete actions"
          code={`import { Message } from '@clarity-chat/react'
import { useState } from 'react'

function MessageWithActions() {
  const [message, setMessage] = useState<MessageType>({
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: 'This message has all actions enabled.',
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return (
    <Message
      message={message}
      onCopy={(content) => navigator.clipboard.writeText(content)}
      onFeedback={(type) => logger.debug('Feedback:', type)}
      onRetry={() => logger.debug('Retry')}
      onEdit={(id) => logger.debug('Edit:', id)}
      onRegenerate={(id) => logger.debug('Regenerate:', id)}
      onDelete={(id) => logger.debug('Delete:', id)}
    />
  )
}`}
        >
          <MessageWithActionsDemo />
        </ComponentPreview>

        <h2 id="markdown-rendering">Markdown Rendering</h2>

        <p>
          Message automatically renders markdown content with syntax
          highlighting for code blocks:
        </p>

        <EnhancedCodeBlock
          code={`import { Message } from '@clarity-chat/react'

function MarkdownMessage() {
  const message: MessageType = {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: \`Here's some **bold text** and *italic text*.

\`\`\`typescript
function greet(name: string) {
  return \`Hello, \${name}!\`
}
\`\`\`

- List item 1
- List item 2
- List item 3\`,
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return <Message message={message} />
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="tip">
          <p>
            Message uses <code>react-markdown</code> with{' '}
            <code>remark-gfm</code> for GitHub Flavored Markdown and{' '}
            <code>rehype-highlight</code> for syntax highlighting. All markdown
            features are supported.
          </p>
        </Callout>

        <h2 id="streaming-messages">Streaming Messages</h2>

        <p>
          Messages with <code>status: 'streaming'</code> automatically show a
          streaming indicator:
        </p>

        <EnhancedCodeBlock
          code={`import { Message } from '@clarity-chat/react'

function StreamingMessage() {
  const message: MessageType = {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: 'This message is currently streaming...',
    status: 'streaming', // Shows streaming indicator
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return <Message message={message} />
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="error-messages">Error Messages</h2>

        <p>Display error information for failed messages:</p>

        <EnhancedCodeBlock
          code={`import { Message } from '@clarity-chat/react'

function ErrorMessage() {
  const message: MessageType = {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: 'Failed to generate response',
    status: 'error',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <Message
      message={message}
      errorDetails="Network error: Failed to connect to server"
      onRetry={() => {
        // Retry the message
        logger.debug('Retrying...')
      }}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="message-grouping">Message Grouping</h2>

        <p>
          Group consecutive messages from the same sender for better visual
          organization:
        </p>

        <EnhancedCodeBlock
          code={`import { Message } from '@clarity-chat/react'

function GroupedMessages() {
  const messages: MessageType[] = [
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
      content: 'Second message in group',
      status: 'sent',
      createdAt: new Date(Date.now() + 1000),
      updatedAt: new Date(Date.now() + 1000),
    },
  ]

  return (
    <div className="space-y-1">
      <Message
        message={messages[0]}
        isGroupStart={true}
        isGroupEnd={false}
        isGrouped={true}
      />
      <Message
        message={messages[1]}
        isGroupStart={false}
        isGroupEnd={true}
        isGrouped={true}
      />
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="info">
          <p>
            <a href="/reference/components/message-list">MessageList</a>{' '}
            automatically handles message grouping for you. You only need to set
            these props when building custom message lists.
          </p>
        </Callout>

        <h2 id="customization">Customization</h2>

        <p>Hide avatars or timestamps, or apply custom styling:</p>

        <EnhancedCodeBlock
          code={`<Message
  message={message}
  showAvatar={false}      // Hide avatar
  showTimestamp={false}   // Hide timestamp
  className="custom-message" // Custom CSS class
/>`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="feedback-animations">Feedback Animations</h2>

        <p>
          When feedback is provided, Message shows a confetti animation for
          positive feedback:
        </p>

        <EnhancedCodeBlock
          code={`import { Message } from '@clarity-chat/react'

function MessageWithFeedback() {
  const [message, setMessage] = useState<MessageType>({
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: 'Great question!',
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const handleFeedback = (type: 'up' | 'down') => {
    setMessage(prev => ({
      ...prev,
      feedback: { type, timestamp: new Date() },
    }))
    // Show confetti animation for positive feedback
  }

  return (
    <Message
      message={message}
      onFeedback={handleFeedback}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="props">Props</h2>

        <PropsTable props={messageProps} />

        <h2 id="message-type">Message Type</h2>

        <p>
          The <code>Message</code> type from <code>@clarity-chat/types</code>:
        </p>

        <EnhancedCodeBlock
          code={`interface Message {
  id: string
  chatId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  status: 'pending' | 'sending' | 'sent' | 'streaming' | 'error'
  attachments?: MessageAttachment[]
  metadata?: MessageMetadata
  feedback?: MessageFeedback
  createdAt: Date
  updatedAt: Date
  editHistory?: MessageEdit[]
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'

function CompleteMessageExample() {
  const message: MessageType = {
    id: '1',
    chatId: 'demo-chat',
    role: 'assistant',
    content: \`Here's a helpful response with **markdown** support.

\`\`\`typescript
const example = 'code blocks work too!'
\`\`\`\`,
    status: 'sent',
    attachments: [
      {
        id: '1',
        type: 'document',
        url: '/files/document.pdf',
        name: 'document.pdf',
        size: 1024000,
        mimeType: 'application/pdf',
      },
    ],
    metadata: {
      tokens: 150,
      model: 'gpt-4',
      processingTime: 1.2,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <Message
      message={message}
      onCopy={(content) => {
        navigator.clipboard.writeText(content)
        // Show toast notification
      }}
      onFeedback={(type) => {
        // Send feedback to analytics
        logger.debug('Feedback:', type)
      }}
      onRetry={() => {
        // Retry message generation
      }}
      showAvatar
      showTimestamp
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="accessibility">Accessibility</h2>

        <p>Message is built with accessibility in mind:</p>

        <ul>
          <li>✅ Semantic HTML structure</li>
          <li>✅ ARIA labels for all interactive elements</li>
          <li>✅ Keyboard navigation for actions</li>
          <li>✅ Focus indicators</li>
          <li>✅ Screen reader announcements for feedback</li>
          <li>✅ Proper heading hierarchy in markdown content</li>
        </ul>

        <h2 id="performance">Performance</h2>

        <p>Message is optimized for performance:</p>

        <ul>
          <li>
            <strong>React 19 optimizations:</strong> Automatic memoization of
            event handlers
          </li>
          <li>
            <strong>Lazy markdown parsing:</strong> Markdown is only parsed when
            needed
          </li>
          <li>
            <strong>Efficient re-renders:</strong> Only re-renders when message
            data changes
          </li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/components/message-list">MessageList</a> -
            Display multiple messages
          </li>
          <li>
            <a href="/reference/components/virtualized-message-list">
              VirtualizedMessageList
            </a>{' '}
            - For large message lists
          </li>
          <li>
            <a href="/reference/components/streaming-message">
              StreamingMessage
            </a>{' '}
            - Specialized component for streaming
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> -
            Complete chat interface
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'AdvancedChatInput',
            href: '/reference/components/advanced-chat-input',
          }}
          next={{
            title: 'MessageList',
            href: '/reference/components/message-list',
          }}
        />
      </>
    </ToastProvider>
  )
}
