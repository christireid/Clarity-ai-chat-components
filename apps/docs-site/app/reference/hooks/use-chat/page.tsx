import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ApiTable } from '@/components/Demo/ApiTable'

export const metadata: Metadata = {
  title: 'useChat',
  description: 'Manage chat state and messages',
}

const returnValues = [
  {
    name: 'messages',
    type: 'Message[]',
    description: 'Array of chat messages',
  },
  {
    name: 'sendMessage',
    type: '(text: string) => void',
    description: 'Send a new message',
  },
  {
    name: 'updateMessage',
    type: '(id: string, updates: Partial<Message>) => void',
    description: 'Update an existing message',
  },
  {
    name: 'deleteMessage',
    type: '(id: string) => void',
    description: 'Delete a message',
  },
  {
    name: 'addReaction',
    type: '(messageId: string, emoji: string) => void',
    description: 'Add reaction to a message',
  },
  {
    name: 'removeReaction',
    type: '(messageId: string, emoji: string) => void',
    description: 'Remove reaction from a message',
  },
  {
    name: 'clearMessages',
    type: '() => void',
    description: 'Clear all messages',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Loading state',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Error state',
  },
]

export default function UseChatPage() {
  return (
    <>
      <Breadcrumbs />
      
      <h1>useChat</h1>
      
      <p className="lead">
        The useChat hook provides a complete solution for managing chat state, including
        messages, sending, updating, reactions, and more.
      </p>

      <h2 id="import">Import</h2>

      <CodeBlock
        code={`import { useChat } from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <CodeBlock
        code={`import { useChat } from '@clarity-chat/react'
import { ChatWindow } from '@clarity-chat/react'

function ChatApp() {
  const { messages, sendMessage } = useChat()

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-options">With Options</h2>

      <CodeBlock
        code={`const { 
  messages, 
  sendMessage, 
  isLoading, 
  error 
} = useChat({
  initialMessages: [
    {
      id: '1',
      text: 'Hello!',
      sender: 'bot',
      timestamp: new Date(),
    },
  ],
  onSend: async (text) => {
    // Custom send logic
    await api.sendMessage(text)
  },
  onError: (error) => {
    console.error('Chat error:', error)
  },
})`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="crud-operations">CRUD Operations</h2>

      <h3>Create (Send Message)</h3>

      <CodeBlock
        code={`const { sendMessage } = useChat()

// Simple text message
sendMessage('Hello, world!')

// With metadata
sendMessage('Hello!', {
  metadata: {
    priority: 'high',
    tags: ['important'],
  },
})`}
        language="tsx"
        showLineNumbers
      />

      <h3>Read (Access Messages)</h3>

      <CodeBlock
        code={`const { messages } = useChat()

// All messages
console.log(messages)

// Filter messages
const userMessages = messages.filter(msg => msg.sender === 'user')
const todayMessages = messages.filter(msg => 
  isToday(msg.timestamp)
)`}
        language="tsx"
        showLineNumbers
      />

      <h3>Update Message</h3>

      <CodeBlock
        code={`const { updateMessage } = useChat()

// Update message text
updateMessage('msg-123', {
  text: 'Updated message content',
  isEdited: true,
})

// Add metadata
updateMessage('msg-123', {
  metadata: {
    ...message.metadata,
    edited: true,
    editedAt: new Date(),
  },
})`}
        language="tsx"
        showLineNumbers
      />

      <h3>Delete Message</h3>

      <CodeBlock
        code={`const { deleteMessage } = useChat()

// Soft delete (mark as deleted)
updateMessage(messageId, {
  isDeleted: true,
  text: 'This message was deleted',
})

// Hard delete (remove from list)
deleteMessage(messageId)`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="reactions">Message Reactions</h2>

      <CodeBlock
        code={`const { addReaction, removeReaction } = useChat()

// Add reaction
addReaction('msg-123', '👍')

// Remove reaction
removeReaction('msg-123', '👍')

// Toggle reaction
const toggleReaction = (messageId: string, emoji: string) => {
  const message = messages.find(m => m.id === messageId)
  const hasReaction = message?.reactions?.[emoji]
  
  if (hasReaction) {
    removeReaction(messageId, emoji)
  } else {
    addReaction(messageId, emoji)
  }
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-api">With API Integration</h2>

      <CodeBlock
        code={`import { useChat } from '@clarity-chat/react'

function ChatApp() {
  const { messages, sendMessage, isLoading, error } = useChat({
    onSend: async (text) => {
      // Send to API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      const data = await response.json()
      return data.message
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <div>
      {error && <div className="error">{error.message}</div>}
      
      <ChatWindow
        messages={messages}
        onSendMessage={sendMessage}
        disabled={isLoading}
      />
    </div>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-websocket">With WebSocket</h2>

      <CodeBlock
        code={`import { useChat } from '@clarity-chat/react'
import { useEffect } from 'react'

function RealTimeChat() {
  const { messages, sendMessage, updateMessage } = useChat()

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      
      // Add incoming message
      updateMessage(message.id, message)
    }

    return () => ws.close()
  }, [updateMessage])

  const handleSend = (text: string) => {
    const message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }

    // Optimistic update
    sendMessage(text)

    // Send via WebSocket
    ws.send(JSON.stringify(message))
  }

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

      <h2 id="persistence">With Persistence</h2>

      <CodeBlock
        code={`import { useChat } from '@clarity-chat/react'
import { useEffect } from 'react'

function PersistentChat() {
  const { messages, sendMessage, clearMessages } = useChat({
    initialMessages: loadFromStorage(),
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages))
  }, [messages])

  function loadFromStorage() {
    const saved = localStorage.getItem('chat-messages')
    return saved ? JSON.parse(saved) : []
  }

  return (
    <div>
      <ChatWindow
        messages={messages}
        onSendMessage={sendMessage}
      />
      <button onClick={clearMessages}>Clear History</button>
    </div>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="return-values">Return Values</h2>

      <ApiTable title="Return Values" data={returnValues} />

      <h2 id="options">Options</h2>

      <CodeBlock
        code={`interface UseChatOptions {
  initialMessages?: Message[]
  onSend?: (text: string, metadata?: any) => Promise<Message | void>
  onUpdate?: (id: string, updates: Partial<Message>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onError?: (error: Error) => void
  autoScroll?: boolean
  maxMessages?: number
}`}
        language="tsx"
      />

      <h2 id="examples">Complete Examples</h2>

      <h3>Chat with Bot Responses</h3>

      <CodeBlock
        code={`function ChatWithBot() {
  const { messages, sendMessage } = useChat({
    initialMessages: [
      {
        id: '1',
        text: 'Hi! How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ],
  })

  const handleSend = async (text: string) => {
    // Add user message
    sendMessage(text)

    // Get bot response
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      
      const data = await response.json()
      
      // Add bot response
      sendMessage(data.reply, {
        sender: 'bot',
        avatar: {
          src: '/bot-avatar.png',
          alt: 'Bot',
        },
      })
    } catch (error) {
      console.error('Failed to get bot response:', error)
    }
  }

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

      <Callout type="tip">
        <p>
          <strong>Pro tip:</strong> Combine useChat with other hooks like{' '}
          <a href="/reference/hooks/use-typing">useTyping</a> and{' '}
          <a href="/reference/hooks/use-keyboard-shortcuts">useKeyboardShortcuts</a>{' '}
          for a complete chat experience.
        </p>
      </Callout>

      <h2 id="best-practices">Best Practices</h2>

      <ul>
        <li>Use unique IDs for messages (UUID recommended)</li>
        <li>Implement optimistic updates for better UX</li>
        <li>Handle errors gracefully with onError callback</li>
        <li>Persist messages to localStorage or a database</li>
        <li>Limit message history to prevent performance issues</li>
        <li>Use React.memo for message components</li>
      </ul>

      <Callout type="success">
        <p>
          <strong>Next Steps:</strong> Learn about{' '}
          <a href="/reference/hooks/use-messages">useMessages</a> for more
          advanced message management features.
        </p>
      </Callout>

      <Pagination
        next={{
          title: 'useMessages',
          href: '/reference/hooks/use-messages',
        }}
      />
    </>
  )
}
