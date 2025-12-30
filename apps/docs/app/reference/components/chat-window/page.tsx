'use client'

import { useState, useCallback } from 'react'
import { ChatWindow } from '@clarity-chat/react/internal'
import type { Message } from '@clarity-chat/types'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ChatWindowAnatomy } from '@/components/Diagrams/ChatWindowAnatomy'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
// Basic chat demo component
function BasicChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      chatId: 'demo-chat',
      role: 'assistant',
      content: 'Hello! Welcome to the chat. How can I help you today?',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  const handleSend = useCallback((content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: 'demo-chat',
      role: 'user',
      content,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        chatId: 'demo-chat',
        role: 'assistant',
        content: `You said: "${content}". This is a demo response!`,
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }, [])

  return (
    <div className="w-full max-w-2xl" style={{ height: '400px' }}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
        className="border border-border rounded-lg"
      />
    </div>
  )
}

const chatWindowProps: Prop[] = [
  {
    name: 'messages',
    type: 'Message[] | CoreMessage[]',
    required: true,
    description:
      'Array of message objects to display. Accepts either Message[] (from @clarity-chat/types) or CoreMessage[] (Vercel AI SDK compatible format).',
  },
  {
    name: 'onSendMessage',
    type: '(content: string) => void',
    required: true,
    description:
      'Callback function triggered when user sends a message. Receives the message content as a string.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description:
      'Whether the chat is currently loading a response. Shows a loading indicator in the message list.',
  },
  {
    name: 'aiStatus',
    type: 'AIStatus',
    description:
      'AI processing status for the thinking indicator. Shows when the AI is processing (thinking, reasoning, etc.).',
  },
  {
    name: 'onMessageCopy',
    type: '(messageId: string, content: string) => void',
    description:
      'Callback when a message is copied to clipboard. Receives message ID and content.',
  },
  {
    name: 'onMessageFeedback',
    type: '(messageId: string, type: "up" | "down") => void',
    description:
      'Callback when user provides feedback on a message (thumbs up/down).',
  },
  {
    name: 'onMessageRetry',
    type: '(messageId: string) => void',
    description:
      'Callback when user requests to retry a message. Enables retry button on failed messages.',
  },
  {
    name: 'onEditMessage',
    type: '(messageId: string) => void',
    description:
      'Callback when user edits a message. Enables edit functionality.',
  },
  {
    name: 'onRegenerateMessage',
    type: '(messageId: string) => void',
    description:
      'Callback when user requests message regeneration. Enables regenerate button.',
  },
  {
    name: 'onDeleteMessage',
    type: '(messageId: string) => void',
    description:
      'Callback when user deletes a message. Enables delete functionality.',
  },
  {
    name: 'emptyState',
    type: 'ReactNode',
    description:
      'Custom content to display when there are no messages. Defaults to a welcome message with bot icon.',
  },
  {
    name: 'showHeader',
    type: 'boolean',
    default: 'false',
    description:
      'Show header with session information at the top of the chat window.',
  },
  {
    name: 'sessionTitle',
    type: 'string',
    default: '"Chat Session"',
    description: 'Title displayed in the header when showHeader is true.',
  },
  {
    name: 'sessionSubtitle',
    type: 'string',
    description:
      'Subtitle or description displayed in the header when showHeader is true.',
  },
  {
    name: 'headerActions',
    type: 'ReactNode',
    description:
      'Custom actions to display in the header (e.g., settings button, menu).',
  },
  {
    name: 'showMessageCount',
    type: 'boolean',
    default: 'false',
    description:
      'Show message count badge in the header when showHeader is true.',
  },
  {
    name: 'onExport',
    type: '() => void',
    description:
      'Callback function triggered when user exports the conversation. Shows export button in header.',
  },
  {
    name: 'onClear',
    type: '() => void',
    description:
      'Callback function triggered when user clears the chat. Shows clear button in header.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Additional CSS classes to apply to the chat container element.',
  },
]

export default function ChatWindowPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>ChatWindow</h1>

      <p className="lead">
        The ChatWindow component is the primary container for building chat
        interfaces. It handles message display, input, and all core chat
        functionality.
      </p>

      <Callout type="info">
        <p>
          This component is highly customizable and works out-of-the-box with
          sensible defaults. You can progressively enhance it with features like
          reactions, typing indicators, and more.
        </p>
      </Callout>

      <ViewInStorybook component="ChatWindow" />

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with the ChatWindow component! Try different configurations
          including avatars, timestamps, and loading states to see how they
          enhance the chat experience.
        </p>
        <CodePlayground
          initialCode={`function Example() {
  const [messages, setMessages] = React.useState([
    {
      id: '1',
      chatId: 'demo',
      role: 'user',
      content: 'Hello! How are you?',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      chatId: 'demo',
      role: 'assistant',
      content: 'I\\'m doing great! How can I help you today?',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  const handleSend = (content) => {
    const newMsg = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setMessages(prev => [...prev, newMsg])
  }

  return (
    <ToastProvider>
    <div className="h-96 border rounded-lg">
      <ChatWindow messages={messages} onSendMessage={handleSend} showAvatars />
    </div>
    </ToastProvider>
  )
}

render(<Example />)`}
        />
      </section>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { ChatWindow } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <p>
        ChatWindow is a composable component that accepts messages and handles
        rendering, input, and user interactions. It works with both{' '}
        <code>Message[]</code> from <code>@clarity-chat/types</code> and{' '}
        <code>CoreMessage[]</code> from Vercel AI SDK.
      </p>

      <ComponentPreview
        title="Simple Chat Interface"
        description="A minimal chat window with messages and input"
        code={`import { useState, useCallback } from 'react'
import { ChatWindow } from '@clarity-chat/react/internal'
import type { Message } from '@clarity-chat/types'

function BasicChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      chatId: 'demo-chat',
      role: 'assistant',
      content: 'Hello! Welcome to the chat. How can I help you today?',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  const handleSend = useCallback((content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: 'demo-chat',
      role: 'user',
      content,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
  }, [])

  return (
    <ToastProvider>
      <div className="w-full max-w-2xl" style={{ height: '400px' }}>
        <ChatWindow
          messages={messages}
          onSendMessage={handleSend}
          className="border border-border rounded-lg"
        />
      </div>
    </ToastProvider>
  )
}`}
      >
        <BasicChatDemo />
      </ComponentPreview>

      <h2 id="with-header">With Header</h2>

      <p>
        Add a header with session information, message count, and action
        buttons:
      </p>

      <EnhancedCodeBlock
        code={`import { ChatWindow } from '@clarity-chat/react/internal'
import { Button } from '@clarity-chat/react/internal'

function ChatWithHeader() {
  const handleExport = () => {
    // Export conversation logic
    logger.debug('Exporting conversation...')
  }

  const handleClear = () => {
    // Clear conversation logic
    logger.debug('Clearing conversation...')
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      showHeader
      sessionTitle="Customer Support"
      sessionSubtitle="We're here to help"
      showMessageCount
      onExport={handleExport}
      onClear={handleClear}
      headerActions={
        <Button variant="ghost" size="sm">
          Settings
        </Button>
      }
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-ai-status">With AI Status Indicator</h2>

      <p>Show thinking indicator when AI is processing with detailed status:</p>

      <EnhancedCodeBlock
        code={`import { ChatWindow } from '@clarity-chat/react/internal'
import type { AIStatus } from '@clarity-chat/types'

function ChatWithAIStatus() {
  const [isLoading, setIsLoading] = useState(false)
  const [aiStatus, setAIStatus] = useState<AIStatus | undefined>()

  const handleSend = async (content: string) => {
    setIsLoading(true)
    setAIStatus({
      stage: 'thinking',
      topic: 'Processing your request...',
      startedAt: new Date(),
    })

    // Simulate AI processing stages
    setTimeout(() => {
      setAIStatus({ stage: 'generating', startedAt: new Date() })
    }, 1000)

    // Your API call here
    await fetch('/api/chat', { /* ... */ })

    setIsLoading(false)
    setAIStatus(undefined)
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      isLoading={isLoading}
      aiStatus={aiStatus}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="message-operations">Message Operations</h2>

      <p>Enable message editing, deletion, regeneration, and feedback:</p>

      <EnhancedCodeBlock
        code={`import { ChatWindow } from '@clarity-chat/react/internal'
import type { Message } from '@clarity-chat/types'

function ChatWithOperations() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleEdit = (messageId: string) => {
    // Open edit dialog or inline editing
    logger.debug('Editing message:', messageId)
  }

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }

  const handleRegenerate = async (messageId: string) => {
    // Regenerate the assistant's response
    logger.debug('Regenerating message:', messageId)
  }

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    // Send feedback to your analytics or API
    logger.debug('Feedback:', messageId, type)
  }

  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content)
    // Show toast notification
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      onEditMessage={handleEdit}
      onDeleteMessage={handleDelete}
      onRegenerateMessage={handleRegenerate}
      onMessageFeedback={handleFeedback}
      onMessageCopy={handleCopy}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="custom-empty-state">Custom Empty State</h2>

      <p>Provide a custom empty state when there are no messages:</p>

      <EnhancedCodeBlock
        code={`import { ChatWindow } from '@clarity-chat/react/internal'

function ChatWithCustomEmptyState() {
  const customEmptyState = (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
      <p className="text-muted-foreground text-sm">
        Ask me anything and I'll help you out!
      </p>
    </div>
  )

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      emptyState={customEmptyState}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-useclaritychat">With useClarityChat Hook</h2>

      <p>
        ChatWindow works seamlessly with the <code>useClarityChat</code> hook:
      </p>

      <EnhancedCodeBlock
        code={`import { ChatWindow, useClarityChat } from '@clarity-chat/react/internal'

function ChatWithHook() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true },
  })

  return (
    <ChatWindow
      messages={chat.messages}
      onSendMessage={async (content) => {
        await chat.append({ role: 'user', content })
      }}
      isLoading={chat.isLoading}
      onMessageCopy={chat.onMessageCopy}
      onMessageFeedback={chat.onMessageFeedback}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="tip">
        <p>
          For drop-in usage without manual hook integration, use the{' '}
          <a href="/reference/components/clarity-chat">ClarityChat</a> component
          instead.
        </p>
      </Callout>

      <h2 id="props">Props</h2>

      <PropsTable props={chatWindowProps} />

      <h2 id="message-type">Message Type</h2>

      <p>ChatWindow accepts messages in two formats:</p>

      <h3>Message Format (from @clarity-chat/types)</h3>

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

      <h3>CoreMessage Format (Vercel AI SDK compatible)</h3>

      <EnhancedCodeBlock
        code={`interface CoreMessage {
  id?: string
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'
  content: string | Array<{
    type: 'text' | 'image' | 'tool-call' | 'tool-result'
    // ... type-specific fields
  }>
  name?: string
  toolCallId?: string
  toolInvocations?: Array<{
    toolCallId: string
    toolName: string
    args: Record<string, any>
    state: 'partial-call' | 'call' | 'result'
    result?: any
  }>
}`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="info">
        <p>
          ChatWindow automatically converts <code>CoreMessage[]</code> to{' '}
          <code>Message[]</code> format internally, so you can use either format
          seamlessly.
        </p>
      </Callout>

      <h2 id="advanced-examples">Advanced Examples</h2>

      <h3>Complete Chat with All Features</h3>

      <EnhancedCodeBlock
        code={`import { useState, useCallback } from 'react'
import { ChatWindow, useClarityChat, MemoryProvider } from '@clarity-chat/react/internal'
import type { Message } from '@clarity-chat/types'

function CompleteChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true, strategy: 'sliding-window' },
  })

  const handleExport = useCallback(() => {
    const conversation = chat.messages
      .map(msg => \`\${msg.role}: \${msg.content}\`)
      .join('\\n')
    
    const blob = new Blob([conversation], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'conversation.txt'
    a.click()
  }, [chat.messages])

  const handleClear = useCallback(() => {
    chat.setMessages([])
  }, [chat])

  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <div className="w-full max-w-4xl mx-auto" style={{ height: '600px' }}>
        <ChatWindow
          messages={chat.messages}
          onSendMessage={async (content) => {
            await chat.append({ role: 'user', content })
          }}
          isLoading={chat.isLoading}
          showHeader
          sessionTitle="AI Assistant"
          sessionSubtitle="Powered by Clarity Chat"
          showMessageCount
          onExport={handleExport}
          onClear={handleClear}
          onMessageCopy={(id, content) => {
            navigator.clipboard.writeText(content)
          }}
          onMessageFeedback={(id, type) => {
            logger.debug('Feedback:', id, type)
          }}
          className="border border-border rounded-lg shadow-lg"
        />
      </div>
    </MemoryProvider>
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

      <h3>With Message Attachments</h3>

      <EnhancedCodeBlock
        code={`import { ChatWindow } from '@clarity-chat/react/internal'
import type { Message, MessageAttachment } from '@clarity-chat/types'

function ChatWithAttachments() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      chatId: 'demo',
      role: 'user',
      content: 'Check out this document!',
      status: 'sent',
      attachments: [
        {
          id: '1',
          type: 'document',
          url: '/files/document.pdf',
          name: 'document.pdf',
          size: 2048000,
          mimeType: 'application/pdf',
        } as MessageAttachment,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <a href="/reference/components/clarity-chat">ClarityChat</a> - Drop-in
          component with built-in state management
        </li>
        <li>
          <a href="/reference/components/clarity-chat-presets">
            ClarityChatPresets
          </a>{' '}
          - Pre-configured variants
        </li>
        <li>
          <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> - Chat
          state hook
        </li>
        <li>
          <a href="/reference/components/message-list">MessageList</a> - Message
          display component
        </li>
        <li>
          <a href="/reference/components/chat-input">ChatInput</a> - Input
          component
        </li>
        <li>
          <a href="/reference/components/message">Message</a> - Individual
          message component
        </li>
      </ul>

      <h2 id="accessibility">Accessibility</h2>

      <p>
        ChatWindow is built with accessibility in mind and follows WCAG 2.1 AA
        guidelines:
      </p>

      <ul>
        <li>✅ Full keyboard navigation support (Tab, Enter, Escape)</li>
        <li>✅ ARIA labels and roles for screen readers</li>
        <li>✅ Focus management for input and interactive elements</li>
        <li>✅ High contrast mode compatible</li>
        <li>
          ✅ Reduced motion support (respects{' '}
          <code>prefers-reduced-motion</code>)
        </li>
        <li>✅ Semantic HTML structure</li>
        <li>✅ Proper heading hierarchy</li>
        <li>✅ Screen reader announcements for new messages</li>
      </ul>

      <Callout type="tip">
        <p>
          The component automatically handles focus management when new messages
          arrive and provides proper ARIA live regions for screen reader
          announcements.
        </p>
      </Callout>

      <h2 id="performance">Performance</h2>

      <p>ChatWindow is optimized for performance with large message lists:</p>

      <ul>
        <li>
          <strong>Automatic message conversion:</strong> Efficiently converts{' '}
          <code>CoreMessage[]</code> to <code>Message[]</code> using memoization
        </li>
        <li>
          <strong>Optimized rendering:</strong> Uses React 19 compiler
          optimizations for automatic memoization
        </li>
        <li>
          <strong>Message grouping:</strong> Groups consecutive messages from
          the same sender for better visual performance
        </li>
        <li>
          <strong>Lazy loading:</strong> Message attachments and images are
          loaded on demand
        </li>
      </ul>

      <Callout type="tip">
        <p>For optimal performance with 1000+ messages:</p>
        <ul>
          <li>
            Use{' '}
            <a href="/reference/components/virtualized-message-list">
              VirtualizedMessageList
            </a>{' '}
            for very large message lists
          </li>
          <li>Implement pagination or infinite scroll for message history</li>
          <li>Debounce typing indicators and status updates</li>
          <li>Lazy load message attachments and media</li>
          <li>
            Use <code>React.memo</code> for custom message renderers
          </li>
        </ul>
      </Callout>

      <h2 id="troubleshooting">Troubleshooting</h2>

      <h3>Messages not displaying</h3>
      <p>
        Ensure your messages array contains valid <code>Message</code> or{' '}
        <code>CoreMessage</code> objects with required fields: <code>id</code>,{' '}
        <code>role</code>, <code>content</code>, <code>createdAt</code>,{' '}
        <code>updatedAt</code>.
      </p>

      <h3>Input not working</h3>
      <p>
        Make sure <code>onSendMessage</code> is a valid function. The component
        will throw a helpful error message if the prop is missing or invalid.
      </p>

      <h3>Header not showing</h3>
      <p>
        Set <code>showHeader={true}</code> to display the header. The header
        requires at least
        <code>sessionTitle</code> to display properly.
      </p>

      <Pagination
        next={{
          title: 'Message',
          href: '/reference/components/message',
        }}
      />
    </>
  )
}
