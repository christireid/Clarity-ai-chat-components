import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ApiTable } from '@/components/Demo/ApiTable'

export const metadata: Metadata = {
  title: 'Message',
  description: 'Display individual chat messages with rich content',
}

const messageProps = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'Unique identifier for the message',
  },
  {
    name: 'text',
    type: 'string',
    required: true,
    description: 'The message content',
  },
  {
    name: 'sender',
    type: 'string',
    required: true,
    description: 'Identifier for the message sender',
  },
  {
    name: 'timestamp',
    type: 'Date',
    required: true,
    description: 'When the message was sent',
  },
  {
    name: 'avatar',
    type: 'Avatar',
    description: 'User avatar configuration',
  },
  {
    name: 'reactions',
    type: 'Record<string, number>',
    description: 'Emoji reactions with counts',
  },
  {
    name: 'attachments',
    type: 'Attachment[]',
    description: 'File attachments',
  },
  {
    name: 'metadata',
    type: 'Record<string, any>',
    description: 'Custom metadata',
  },
  {
    name: 'isEdited',
    type: 'boolean',
    default: 'false',
    description: 'Whether the message was edited',
  },
  {
    name: 'isDeleted',
    type: 'boolean',
    default: 'false',
    description: 'Whether the message was deleted',
  },
  {
    name: 'variant',
    type: '"default" | "compact" | "bubble"',
    default: '"default"',
    description: 'Visual style variant',
  },
  {
    name: 'align',
    type: '"left" | "right"',
    default: '"left"',
    description: 'Message alignment',
  },
  {
    name: 'showTimestamp',
    type: 'boolean',
    default: 'true',
    description: 'Show timestamp below message',
  },
  {
    name: 'showAvatar',
    type: 'boolean',
    default: 'true',
    description: 'Show user avatar',
  },
  {
    name: 'onReactionClick',
    type: '(emoji: string) => void',
    description: 'Callback when reaction is clicked',
  },
  {
    name: 'onEdit',
    type: '() => void',
    description: 'Callback for edit action',
  },
  {
    name: 'onDelete',
    type: '() => void',
    description: 'Callback for delete action',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function MessagePage() {
  return (
    <>
      <Breadcrumbs />
      
      <h1>Message</h1>
      
      <p className="lead">
        The Message component displays individual chat messages with support for avatars, 
        timestamps, reactions, attachments, and more. It's highly customizable and accessible.
      </p>

      <h2 id="import">Import</h2>

      <CodeBlock
        code={`import { Message } from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <CodeBlock
        code={`import { Message } from '@clarity-chat/react'

function MessageExample() {
  const message = {
    id: '1',
    text: 'Hello, how are you?',
    sender: 'user1',
    timestamp: new Date(),
  }

  return <Message {...message} />
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-avatar">With Avatar</h2>

      <p>Add user avatars to personalize messages:</p>

      <CodeBlock
        code={`const message = {
  id: '1',
  text: 'Hello!',
  sender: 'user1',
  timestamp: new Date(),
  avatar: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    alt: 'User 1',
  },
}

<Message {...message} showAvatar />`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="variants">Message Variants</h2>

      <p>Choose from different visual styles:</p>

      <CodeBlock
        code={`// Default style (standard message box)
<Message {...message} variant="default" />

// Compact style (minimal spacing)
<Message {...message} variant="compact" />

// Bubble style (rounded chat bubbles)
<Message {...message} variant="bubble" />`}
        language="tsx"
      />

      <h2 id="alignment">Message Alignment</h2>

      <p>Align messages left or right based on sender:</p>

      <CodeBlock
        code={`// User messages (right-aligned)
<Message 
  {...userMessage} 
  align="right"
  className="bg-brand-500 text-white"
/>

// Bot/other messages (left-aligned)
<Message 
  {...botMessage} 
  align="left"
  className="bg-gray-100"
/>`}
        language="tsx"
      />

      <h2 id="reactions">Message Reactions</h2>

      <p>Enable emoji reactions on messages:</p>

      <CodeBlock
        code={`const [message, setMessage] = useState({
  id: '1',
  text: 'Great idea!',
  sender: 'user1',
  timestamp: new Date(),
  reactions: {
    '👍': 5,
    '❤️': 3,
    '🎉': 2,
  },
})

const handleReactionClick = (emoji: string) => {
  setMessage({
    ...message,
    reactions: {
      ...message.reactions,
      [emoji]: (message.reactions[emoji] || 0) + 1,
    },
  })
}

<Message 
  {...message}
  onReactionClick={handleReactionClick}
/>`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="attachments">File Attachments</h2>

      <p>Display file attachments with messages:</p>

      <CodeBlock
        code={`const message = {
  id: '1',
  text: 'Here are the documents you requested',
  sender: 'user1',
  timestamp: new Date(),
  attachments: [
    {
      id: '1',
      name: 'presentation.pdf',
      size: 2048000,
      type: 'application/pdf',
      url: '/files/presentation.pdf',
    },
    {
      id: '2',
      name: 'image.png',
      size: 512000,
      type: 'image/png',
      url: '/images/image.png',
      thumbnail: '/images/image-thumb.png',
    },
  ],
}

<Message {...message} />`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="edit-delete">Edit & Delete</h2>

      <p>Add edit and delete actions:</p>

      <CodeBlock
        code={`const handleEdit = (messageId: string) => {
  // Show edit modal or inline editor
  console.log('Editing message:', messageId)
}

const handleDelete = (messageId: string) => {
  // Confirm and delete message
  console.log('Deleting message:', messageId)
}

<Message
  {...message}
  onEdit={() => handleEdit(message.id)}
  onDelete={() => handleDelete(message.id)}
/>`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="edited-deleted">Edited & Deleted States</h2>

      <CodeBlock
        code={`// Edited message
<Message 
  {...message}
  isEdited
/>

// Deleted message
<Message 
  {...message}
  isDeleted
  text="This message was deleted"
/>`}
        language="tsx"
      />

      <h2 id="markdown">Markdown Support</h2>

      <p>Enable markdown rendering in messages:</p>

      <CodeBlock
        code={`import { Message } from '@clarity-chat/react'
import ReactMarkdown from 'react-markdown'

function MarkdownMessage({ message }) {
  return (
    <Message {...message}>
      <ReactMarkdown>{message.text}</ReactMarkdown>
    </Message>
  )
}

// Usage
const message = {
  id: '1',
  text: '**Bold text** and *italic text* with [links](https://example.com)',
  sender: 'user1',
  timestamp: new Date(),
}`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="tip">
        <p>
          Markdown rendering is not included by default. Use libraries like{' '}
          <code>react-markdown</code> or <code>marked</code> to parse markdown content.
        </p>
      </Callout>

      <h2 id="props">Props</h2>

      <ApiTable data={messageProps} />

      <h2 id="types">Type Definitions</h2>

      <h3>Avatar Type</h3>

      <CodeBlock
        code={`interface Avatar {
  src: string
  alt: string
  fallback?: string
}`}
        language="tsx"
      />

      <h3>Attachment Type</h3>

      <CodeBlock
        code={`interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  thumbnail?: string
  preview?: string
}`}
        language="tsx"
      />

      <h2 id="styling">Custom Styling</h2>

      <p>Customize message appearance with CSS classes:</p>

      <CodeBlock
        code={`// Custom user message style
<Message
  {...message}
  align="right"
  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg"
/>

// Custom bot message style
<Message
  {...message}
  align="left"
  className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
/>`}
        language="tsx"
      />

      <h2 id="accessibility">Accessibility</h2>

      <p>Message component includes comprehensive accessibility features:</p>

      <ul>
        <li>✅ Semantic HTML structure</li>
        <li>✅ ARIA labels for screen readers</li>
        <li>✅ Keyboard navigation for actions</li>
        <li>✅ Focus indicators</li>
        <li>✅ Time formatting for screen readers</li>
        <li>✅ Alt text for avatars and images</li>
      </ul>

      <h2 id="examples">Complete Examples</h2>

      <h3>Chat Bubble Style</h3>

      <CodeBlock
        code={`function ChatBubbleMessages() {
  const messages = [
    {
      id: '1',
      text: 'Hey, how are you?',
      sender: 'user',
      timestamp: new Date(),
      align: 'right' as const,
      variant: 'bubble' as const,
      className: 'bg-brand-500 text-white',
    },
    {
      id: '2',
      text: "I'm good, thanks! How about you?",
      sender: 'bot',
      timestamp: new Date(),
      align: 'left' as const,
      variant: 'bubble' as const,
      className: 'bg-gray-100 dark:bg-gray-800',
    },
  ]

  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <Message key={message.id} {...message} />
      ))}
    </div>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h3>Rich Message with All Features</h3>

      <CodeBlock
        code={`const richMessage = {
  id: '1',
  text: 'Check out this document and let me know what you think!',
  sender: 'user1',
  timestamp: new Date(),
  avatar: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    alt: 'User 1',
  },
  reactions: {
    '👍': 3,
    '❤️': 1,
  },
  attachments: [
    {
      id: '1',
      name: 'proposal.pdf',
      size: 1024000,
      type: 'application/pdf',
      url: '/files/proposal.pdf',
    },
  ],
  metadata: {
    read: true,
    delivered: true,
  },
}

<Message
  {...richMessage}
  showAvatar
  showTimestamp
  onReactionClick={(emoji) => console.log('Reacted:', emoji)}
  onEdit={() => console.log('Edit message')}
  onDelete={() => console.log('Delete message')}
/>`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="success">
        <p>
          <strong>Next Steps:</strong> Check out the{' '}
          <a href="/reference/components/message-list">MessageList</a> component
          to display multiple messages efficiently.
        </p>
      </Callout>

      <Pagination
        prev={{
          title: 'ChatWindow',
          href: '/reference/components/chat-window',
        }}
        next={{
          title: 'MessageList',
          href: '/reference/components/message-list',
        }}
      />
    </>
  )
}
