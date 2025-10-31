import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ApiTable } from '@/components/Demo/ApiTable'

export const metadata: Metadata = {
  title: 'TypingIndicator',
  description: 'Animated typing indicator for chat interfaces',
}

const typingIndicatorProps = [
  {
    name: 'users',
    type: 'User[]',
    description: 'Array of users currently typing',
  },
  {
    name: 'variant',
    type: '"dots" | "wave" | "pulse" | "bounce"',
    default: '"dots"',
    description: 'Animation style for the indicator',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Size of the indicator',
  },
  {
    name: 'showAvatars',
    type: 'boolean',
    default: 'false',
    description: 'Show user avatars alongside indicator',
  },
  {
    name: 'maxUsers',
    type: 'number',
    default: '3',
    description: 'Maximum number of users to display',
  },
  {
    name: 'color',
    type: 'string',
    default: '"currentColor"',
    description: 'Color of the typing indicator',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function TypingIndicatorPage() {
  return (
    <>
      <Breadcrumbs />
      
      <h1>TypingIndicator</h1>
      
      <p className="lead">
        The TypingIndicator component displays an animated indicator when users are typing,
        providing real-time feedback in chat interfaces.
      </p>

      <h2 id="import">Import</h2>

      <CodeBlock
        code={`import { TypingIndicator } from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <CodeBlock
        code={`import { TypingIndicator } from '@clarity-chat/react'

function ChatExample() {
  const typingUsers = [
    { id: '1', name: 'Alice' }
  ]

  return (
    <div>
      {typingUsers.length > 0 && (
        <TypingIndicator users={typingUsers} />
      )}
    </div>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="variants">Animation Variants</h2>

      <p>Choose from different animation styles:</p>

      <CodeBlock
        code={`// Dots animation (default - three bouncing dots)
<TypingIndicator users={typingUsers} variant="dots" />

// Wave animation (smooth wave motion)
<TypingIndicator users={typingUsers} variant="wave" />

// Pulse animation (pulsing circle)
<TypingIndicator users={typingUsers} variant="pulse" />

// Bounce animation (bouncing dots)
<TypingIndicator users={typingUsers} variant="bounce" />`}
        language="tsx"
      />

      <h2 id="sizes">Sizes</h2>

      <CodeBlock
        code={`// Small
<TypingIndicator users={typingUsers} size="sm" />

// Medium (default)
<TypingIndicator users={typingUsers} size="md" />

// Large
<TypingIndicator users={typingUsers} size="lg" />`}
        language="tsx"
      />

      <h2 id="with-avatars">With Avatars</h2>

      <p>Display user avatars alongside the typing indicator:</p>

      <CodeBlock
        code={`const typingUsers = [
  {
    id: '1',
    name: 'Alice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
  },
  {
    id: '2',
    name: 'Bob',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
  },
]

<TypingIndicator 
  users={typingUsers}
  showAvatars
/>`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="multiple-users">Multiple Users</h2>

      <p>Handle multiple users typing simultaneously:</p>

      <CodeBlock
        code={`const typingUsers = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
  { id: '4', name: 'Diana' },
]

// Shows "Alice, Bob, Charlie and 1 other are typing..."
<TypingIndicator 
  users={typingUsers}
  maxUsers={3}
/>`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="custom-color">Custom Color</h2>

      <CodeBlock
        code={`// Brand color
<TypingIndicator 
  users={typingUsers}
  color="#3b82f6"
/>

// CSS variable
<TypingIndicator 
  users={typingUsers}
  color="var(--brand-500)"
/>

// Tailwind class
<TypingIndicator 
  users={typingUsers}
  className="text-purple-500"
/>`}
        language="tsx"
      />

      <h2 id="with-usetyping">With useTyping Hook</h2>

      <p>Combine with the useTyping hook for state management:</p>

      <CodeBlock
        code={`import { TypingIndicator, useTyping } from '@clarity-chat/react'

function ChatComponent() {
  const { 
    isTyping, 
    typingUsers, 
    startTyping, 
    stopTyping 
  } = useTyping()

  const handleInputChange = (text: string) => {
    if (text.length > 0) {
      startTyping('currentUser')
    } else {
      stopTyping('currentUser')
    }
  }

  return (
    <div>
      <input onChange={(e) => handleInputChange(e.target.value)} />
      
      {typingUsers.length > 0 && (
        <TypingIndicator users={typingUsers} />
      )}
    </div>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="props">Props</h2>

      <ApiTable data={typingIndicatorProps} />

      <h2 id="types">Type Definitions</h2>

      <CodeBlock
        code={`interface User {
  id: string
  name: string
  avatar?: string
}

type TypingVariant = 'dots' | 'wave' | 'pulse' | 'bounce'
type TypingSize = 'sm' | 'md' | 'lg'`}
        language="tsx"
      />

      <h2 id="text-formatting">Text Formatting</h2>

      <p>The component automatically formats the typing text based on user count:</p>

      <ul>
        <li><strong>1 user:</strong> "Alice is typing..."</li>
        <li><strong>2 users:</strong> "Alice and Bob are typing..."</li>
        <li><strong>3+ users:</strong> "Alice, Bob and 2 others are typing..."</li>
      </ul>

      <Callout type="tip">
        <p>
          The text can be customized using the <code>maxUsers</code> prop to control
          how many names are shown before switching to "X others".
        </p>
      </Callout>

      <h2 id="examples">Complete Examples</h2>

      <h3>Real-time Typing Detection</h3>

      <CodeBlock
        code={`import { useState, useEffect } from 'react'
import { TypingIndicator } from '@clarity-chat/react'

function RealTimeChatroom() {
  const [typingUsers, setTypingUsers] = useState<User[]>([])

  useEffect(() => {
    // Listen to WebSocket for typing events
    socket.on('user_typing', (user) => {
      setTypingUsers((prev) => {
        if (!prev.find((u) => u.id === user.id)) {
          return [...prev, user]
        }
        return prev
      })
    })

    socket.on('user_stopped_typing', (userId) => {
      setTypingUsers((prev) => 
        prev.filter((u) => u.id !== userId)
      )
    })

    return () => {
      socket.off('user_typing')
      socket.off('user_stopped_typing')
    }
  }, [])

  return (
    <div className="chat-container">
      {/* Messages */}
      
      {typingUsers.length > 0 && (
        <div className="px-4 py-2">
          <TypingIndicator 
            users={typingUsers}
            variant="wave"
            showAvatars
          />
        </div>
      )}
      
      {/* Input */}
    </div>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h3>With Timeout</h3>

      <CodeBlock
        code={`function TypingWithTimeout() {
  const [typingUsers, setTypingUsers] = useState<User[]>([])
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleTyping = (user: User) => {
    // Add user to typing list
    setTypingUsers((prev) => {
      if (!prev.find((u) => u.id === user.id)) {
        return [...prev, user]
      }
      return prev
    })

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout to remove user after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setTypingUsers((prev) => 
        prev.filter((u) => u.id !== user.id)
      )
    }, 3000)
  }

  return (
    <>
      {typingUsers.length > 0 && (
        <TypingIndicator users={typingUsers} />
      )}
    </>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="accessibility">Accessibility</h2>

      <ul>
        <li>✅ ARIA live region for screen readers</li>
        <li>✅ Descriptive text for typing state</li>
        <li>✅ Reduced motion support</li>
        <li>✅ Semantic HTML structure</li>
      </ul>

      <Callout type="info">
        <p>
          The component respects the user's <code>prefers-reduced-motion</code> setting
          by reducing or disabling animations.
        </p>
      </Callout>

      <h2 id="performance">Performance Tips</h2>

      <ul>
        <li>Debounce typing events to reduce updates</li>
        <li>Use timeout to automatically clear typing state</li>
        <li>Limit the number of concurrent typing users</li>
        <li>Consider using React.memo for optimization</li>
      </ul>

      <CodeBlock
        code={`import { debounce } from 'lodash'

// Debounce typing notifications
const notifyTyping = debounce(() => {
  socket.emit('user_typing', currentUser)
}, 300)

// Auto-clear after 3 seconds of inactivity
const clearTyping = debounce(() => {
  socket.emit('user_stopped_typing', currentUser.id)
}, 3000)`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="success">
        <p>
          <strong>Next Steps:</strong> Learn about the{' '}
          <a href="/reference/hooks/use-typing">useTyping</a> hook for
          managing typing state.
        </p>
      </Callout>

      <Pagination
        prev={{
          title: 'Message',
          href: '/reference/components/message',
        }}
        next={{
          title: 'MessageInput',
          href: '/reference/components/message-input',
        }}
      />
    </>
  )
}
