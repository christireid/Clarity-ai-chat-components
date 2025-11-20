'use client'

import { Metadata } from 'next'
import { ToastProvider } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { EnhancedPlayground } from '@/components/Demo/EnhancedPlayground'
import { ChatWindowAnatomy } from '@/components/Diagrams/ChatWindowAnatomy'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { chatWindowPresets, chatWindowControls } from './presets'


const chatWindowProps: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of message objects to display in the chat. Each message must have id, chatId, role, content, createdAt, updatedAt, and status fields.',
  },
  {
    name: 'onSendMessage',
    type: '(content: string) => void | Promise<void>',
    required: true,
    description: 'Callback function triggered when user sends a message. Can be async for API calls.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description: 'Whether the chat is currently loading a response. Shows a loading indicator.',
  },
  {
    name: 'emptyState',
    type: 'ReactNode',
    description: 'Custom content to display when there are no messages.',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '"Type a message..."',
    description: 'Placeholder text for the message input field.',
  },
  {
    name: 'height',
    type: 'string | number',
    default: '"100%"',
    description: 'Height of the chat window. Can be a CSS value (e.g., "600px") or number (pixels).',
  },
  {
    name: 'theme',
    type: '"light" | "dark" | "auto"',
    default: '"auto"',
    description: 'Color theme for the chat interface. "auto" follows system preference.',
  },
  {
    name: 'showTimestamps',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display message timestamps.',
  },
  {
    name: 'showAvatars',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display user avatars next to messages.',
  },
  {
    name: 'enableMarkdown',
    type: 'boolean',
    default: 'false',
    description: 'Enable markdown rendering in messages. Supports code blocks, links, and formatting.',
  },
  {
    name: 'onEditMessage',
    type: '(messageId: string, newContent: string) => void',
    description: 'Callback when user edits a message. Enables edit functionality.',
  },
  {
    name: 'onRegenerateMessage',
    type: '(messageId: string) => void',
    description: 'Callback when user requests message regeneration. Enables regenerate button.',
  },
  {
    name: 'onDeleteMessage',
    type: '(messageId: string) => void',
    description: 'Callback when user deletes a message. Enables delete functionality.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the container element.',
  },
]

export default function ChatWindowPage() {
  return (
    <ToastProvider>
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
          Experiment with the ChatWindow component! Try different configurations including
          avatars, timestamps, and loading states to see how they enhance the chat experience.
        </p>
        <EnhancedPlayground
          title="ChatWindow Component Playground"
          description="Build and customize your perfect chat interface"
          component="ChatWindow"
          initialCode={`import { ChatWindow } from '@clarity-chat/react'

export default function Example() {
  const messages = [
    {
      id: '1',
      role: 'user',
      content: 'Hello! How are you?',
      avatar: '👤',
    },
    {
      id: '2',
      role: 'assistant',
      content: 'I\\'m doing great! How can I help you today?',
      avatar: '🤖',
    },
  ]

  return (
    <ToastProvider>
    <div className="h-96 border rounded-lg">
      <ChatWindow messages={messages} showAvatars />
    </div>
    </ToastProvider>
  )
}`}
          presets={chatWindowPresets}
          controls={chatWindowControls}
          showResponsiveControls
          showQuickActions
          height="600px"
        />
      </section>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <ComponentPreview
        title="Simple Chat Interface"
        description="A minimal chat window with messages and input"
        code={`import { useState } from 'react'
import { ChatWindow, Message } from '@clarity-chat/react'

function BasicChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to the chat.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])

  const handleSend = (text: string) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }])
  }

  return (
    <ToastProvider>
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      height="400px"
    />
  )
}`}
      >
        <div className="w-full max-w-2xl">
          <div className="border border-border rounded-lg p-4 bg-bg-secondary">
            <p className="text-sm text-text-secondary text-center">
              💬 Interactive preview would render here
            </p>
          </div>
        </div>
      </ComponentPreview>

      <h2 id="with-avatars">With Avatars</h2>

      <p>Add user avatars to messages for a more personalized experience:</p>

      <EnhancedCodeBlock
        code={`const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    text: 'Hello!',
    sender: 'bot',
    timestamp: new Date(),
    avatar: {
      src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
      alt: 'Bot Avatar',
    },
  },
])

return (
    <ToastProvider>
  <ChatWindow
    messages={messages}
    onSendMessage={handleSend}
    showAvatars
  />
)`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="typing-indicator">Typing Indicator</h2>

      <p>Show when other users are typing:</p>

      <EnhancedCodeBlock
        code={`const [typingUsers, setTypingUsers] = useState([
  { id: 'bot', name: 'Assistant' }
])

return (
    <ToastProvider>
  <ChatWindow
    messages={messages}
    onSendMessage={handleSend}
    typingUsers={typingUsers}
  />
)`}
        language="tsx"
      />

      <h2 id="message-reactions">Message Reactions</h2>

      <p>Enable emoji reactions for messages:</p>

      <EnhancedCodeBlock
        code={`const handleReaction = (messageId: string, emoji: string) => {
  setMessages(messages.map(msg => 
    msg.id === messageId
      ? {
          ...msg,
          reactions: {
            ...msg.reactions,
            [emoji]: (msg.reactions?.[emoji] || 0) + 1
          }
        }
      : msg
  ))
}

return (
    <ToastProvider>
  <ChatWindow
    messages={messages}
    onSendMessage={handleSend}
    onReaction={handleReaction}
    enableReactions
  />
)`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="themes">Theming</h2>

      <p>ChatWindow supports light, dark, and auto themes:</p>

      <EnhancedCodeBlock
        code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  theme="dark"
/>`}
        language="tsx"
      />

      <Callout type="tip">
        <p>
          Use <code>theme="auto"</code> to automatically match the system theme
          preference.
        </p>
      </Callout>

      <h2 id="animation-presets">Animation Presets</h2>

      <p>Choose from different animation styles:</p>

      <EnhancedCodeBlock
        code={`// Smooth animations (default)
<ChatWindow animationPreset="smooth" {...props} />

// Bouncy animations
<ChatWindow animationPreset="bouncy" {...props} />

// Spring physics
<ChatWindow animationPreset="spring" {...props} />

// No animations
<ChatWindow animationPreset="none" {...props} />`}
        language="tsx"
      />

      <h2 id="props">Props</h2>

      <PropsTable props={chatWindowProps} />

      <h2 id="message-type">Message Type</h2>

      <p>The Message interface defines the structure of chat messages:</p>

      <EnhancedCodeBlock
        code={`interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  avatar?: {
    src: string
    alt: string
  }
  reactions?: Record<string, number>
  attachments?: Attachment[]
  metadata?: Record<string, any>
}`}
        language="tsx"
      />

      <h2 id="examples">Examples</h2>

      <h3>Multi-User Chat</h3>

      <EnhancedCodeBlock
        code={`const users = {
  user1: {
    id: 'user1',
    name: 'Alice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
  },
  user2: {
    id: 'user2',
    name: 'Bob',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
  }
}

const [messages, setMessages] = useState([
  {
    id: '1',
    text: 'Hey everyone!',
    sender: 'user1',
    timestamp: new Date(),
    avatar: { src: users.user1.avatar, alt: users.user1.name }
  },
  {
    id: '2',
    text: 'Hi Alice!',
    sender: 'user2',
    timestamp: new Date(),
    avatar: { src: users.user2.avatar, alt: users.user2.name }
  }
])

return (
    <ToastProvider>
  <ChatWindow
    messages={messages}
    onSendMessage={handleSend}
    showAvatars
    showTimestamps
  />
)`}
        language="tsx"
        showLineNumbers
      />

      <h3>With File Attachments</h3>

      <EnhancedCodeBlock
        code={`const [messages, setMessages] = useState([
  {
    id: '1',
    text: 'Check out this document!',
    sender: 'user',
    timestamp: new Date(),
    attachments: [
      {
        id: '1',
        name: 'document.pdf',
        size: 2048000,
        type: 'application/pdf',
        url: '/files/document.pdf'
      }
    ]
  }
])

return (
    <ToastProvider>
  <ChatWindow
    messages={messages}
    onSendMessage={handleSend}
  />
)`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="success">
        <p>
          <strong>Great job!</strong> You now know how to use the ChatWindow
          component. Check out the{' '}
          <a href="/examples/simple-chat">Simple Chat example</a> for a complete
          implementation.
        </p>
      </Callout>

      <h2 id="accessibility">Accessibility</h2>

      <p>ChatWindow is built with accessibility in mind:</p>

      <ul>
        <li>✅ Full keyboard navigation support</li>
        <li>✅ ARIA labels and roles for screen readers</li>
        <li>✅ Focus management for input and buttons</li>
        <li>✅ High contrast mode compatible</li>
        <li>✅ Reduced motion support</li>
      </ul>

      <h2 id="performance">Performance Tips</h2>

      <Callout type="tip">
        <p>For optimal performance with large message lists:</p>
        <ul>
          <li>
            Use <code>React.memo</code> for message components
          </li>
          <li>Implement virtual scrolling for 1000+ messages</li>
          <li>Debounce typing indicators</li>
          <li>Lazy load message attachments</li>
        </ul>
      </Callout>

      <Pagination
        next={{
          title: 'Message',
          href: '/reference/components/message',
        }}
      />
    </>
  )
}
