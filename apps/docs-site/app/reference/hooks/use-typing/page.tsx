import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'useTyping - Clarity Chat Components',
  description: 'Manage typing indicator state with automatic timeouts and multi-user support.',
}

export default function UseTypingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useTyping</h1>
        <p className="docs-lead">
          Manage typing indicator state with automatic timeouts, debouncing, and multi-user support.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>useTyping</code> hook handles the complexity of typing indicators in chat applications.
          It automatically starts and stops typing indicators based on user input, handles timeouts,
          and supports tracking multiple users typing simultaneously.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Basic Typing Indicator"
          code={`import { useTyping } from '@clarity-chat/react'

function BasicTypingExample() {
  const { isTyping, startTyping, stopTyping } = useTyping()
  const [text, setText] = React.useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setText(value)

    if (value.length > 0) {
      startTyping()
    } else {
      stopTyping()
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Start typing..."
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      />

      {isTyping && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <span>You are typing...</span>
        </div>
      )}
    </div>
  )
}

export default BasicTypingExample`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Return Value</h2>
        <ApiTable
          title="useTyping() Return Value"
          data={returnValue}
        />
      </section>

      <section className="docs-section">
        <h2>Configuration Options</h2>
        <ApiTable
          title="useTyping(options)"
          data={configOptions}
        />
      </section>

      <section className="docs-section">
        <h2>Auto-Timeout</h2>
        <p>
          Automatically stop showing typing indicator after a period of inactivity.
        </p>
        <LiveDemo
          title="Auto-Timeout Typing"
          code={`import { useTyping } from '@clarity-chat/react'

function AutoTimeoutTyping() {
  const { isTyping, startTyping } = useTyping({
    timeout: 3000 // 3 seconds
  })
  const [text, setText] = React.useState('')

  const handleChange = (e) => {
    setText(e.target.value)
    if (e.target.value.length > 0) {
      startTyping()
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
        <p className="text-sm">
          Typing indicator automatically disappears after 3 seconds of inactivity
        </p>
      </div>

      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type and pause..."
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      />

      {isTyping ? (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <span>Typing...</span>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          Not typing
        </div>
      )}
    </div>
  )
}

export default AutoTimeoutTyping`}
          height="350px"
        />
      </section>

      <section className="docs-section">
        <h2>Multiple Users Typing</h2>
        <p>
          Track multiple users typing simultaneously.
        </p>
        <LiveDemo
          title="Multi-user Typing"
          code={`import { useTyping } from '@clarity-chat/react'

function MultiUserTyping() {
  const {
    typingUsers,
    addTypingUser,
    removeTypingUser,
    clearTypingUsers
  } = useTyping({ multiUser: true })

  const users = [
    { id: '1', name: 'Alice', avatar: '👩' },
    { id: '2', name: 'Bob', avatar: '👨' },
    { id: '3', name: 'Charlie', avatar: '🧑' }
  ]

  const toggleUser = (userId) => {
    if (typingUsers.includes(userId)) {
      removeTypingUser(userId)
    } else {
      addTypingUser(userId)
    }
  }

  const getTypingNames = () => {
    return typingUsers
      .map(id => users.find(u => u.id === id)?.name)
      .filter(Boolean)
  }

  const formatTypingMessage = () => {
    const names = getTypingNames()
    if (names.length === 0) return null
    if (names.length === 1) return \`\${names[0]} is typing...\`
    if (names.length === 2) return \`\${names[0]} and \${names[1]} are typing...\`
    return \`\${names[0]}, \${names[1]}, and \${names.length - 2} other\${names.length > 3 ? 's' : ''} are typing...\`
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Simulate Users Typing</h3>
        <div className="flex gap-2">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => toggleUser(user.id)}
              className={\`px-3 py-2 rounded border transition-colors \${
                typingUsers.includes(user.id)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 hover:bg-gray-50'
              }\`}
            >
              <span className="mr-2">{user.avatar}</span>
              {user.name}
            </button>
          ))}
        </div>
      </div>

      {typingUsers.length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-sm">{formatTypingMessage()}</span>
          </div>
        </div>
      )}

      {typingUsers.length > 0 && (
        <button
          onClick={clearTypingUsers}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Clear All
        </button>
      )}
    </div>
  )
}

export default MultiUserTyping`}
          height="450px"
        />
      </section>

      <section className="docs-section">
        <h2>With Debouncing</h2>
        <p>
          Debounce typing events to reduce network requests in real-time applications.
        </p>
        <LiveDemo
          title="Debounced Typing"
          code={`import { useTyping } from '@clarity-chat/react'

function DebouncedTyping() {
  const { isTyping, startTyping } = useTyping({
    timeout: 2000,
    debounce: 500 // Wait 500ms before showing typing
  })
  const [text, setText] = React.useState('')
  const [eventCount, setEventCount] = React.useState(0)

  const handleChange = (e) => {
    setText(e.target.value)
    setEventCount(prev => prev + 1)
    
    if (e.target.value.length > 0) {
      startTyping()
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
        <p>
          Typing indicator only shows after 500ms of continuous typing,
          reducing unnecessary network events.
        </p>
      </div>

      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type quickly..."
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 border rounded">
          <p className="text-gray-600 dark:text-gray-400">Input Events</p>
          <p className="text-2xl font-bold">{eventCount}</p>
        </div>
        <div className="p-3 border rounded">
          <p className="text-gray-600 dark:text-gray-400">Network Events</p>
          <p className="text-2xl font-bold">{isTyping ? '1' : '0'}</p>
        </div>
      </div>

      {isTyping && (
        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <span>Broadcasting typing indicator...</span>
        </div>
      )}
    </div>
  )
}

export default DebouncedTyping`}
          height="500px"
        />
      </section>

      <section className="docs-section">
        <h2>With WebSocket</h2>
        <p>
          Integrate typing indicators with real-time WebSocket communication.
        </p>
        <pre><code>{`import { useTyping } from '@clarity-chat/react'
import { useWebSocket } from './useWebSocket'

function ChatWithTyping() {
  const { socket, isConnected } = useWebSocket('wss://api.example.com')
  
  const { isTyping, startTyping, stopTyping } = useTyping({
    timeout: 2000,
    debounce: 300,
    onChange: (typing) => {
      // Send typing event to server
      if (isConnected) {
        socket.send(JSON.stringify({
          type: typing ? 'typing_start' : 'typing_stop',
          userId: currentUser.id,
          roomId: currentRoom.id
        }))
      }
    }
  })

  const handleInputChange = (e) => {
    const text = e.target.value
    setMessage(text)
    
    if (text.length > 0) {
      startTyping()
    } else {
      stopTyping()
    }
  }

  return (
    <MessageInput
      onChange={handleInputChange}
      onSend={handleSend}
    />
  )
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>With Firebase</h2>
        <p>
          Use typing indicators with Firebase Realtime Database.
        </p>
        <pre><code>{`import { useTyping } from '@clarity-chat/react'
import { ref, set, onDisconnect } from 'firebase/database'
import { db } from './firebase'

function FirebaseTyping({ roomId, userId }) {
  const typingRef = ref(db, \`rooms/\${roomId}/typing/\${userId}\`)

  const { isTyping, startTyping, stopTyping } = useTyping({
    timeout: 3000,
    onChange: async (typing) => {
      // Update Firebase
      await set(typingRef, typing ? {
        typing: true,
        timestamp: Date.now()
      } : null)
    }
  })

  React.useEffect(() => {
    // Clean up on disconnect
    onDisconnect(typingRef).remove()
    
    return () => {
      set(typingRef, null)
    }
  }, [roomId, userId])

  return (
    <MessageInput
      onChange={(text) => text.length > 0 ? startTyping() : stopTyping()}
    />
  )
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Typing Indicator with User Info</h3>
        <pre><code>{`function TypingWithUsers() {
  const { typingUsers, addTypingUser, removeTypingUser } = useTyping({
    multiUser: true,
    timeout: 3000
  })

  const [userInfo, setUserInfo] = React.useState({})

  const addUserTyping = (user) => {
    addTypingUser(user.id)
    setUserInfo(prev => ({
      ...prev,
      [user.id]: user
    }))
  }

  return (
    <div>
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.map(userId => (
            <div key={userId} className="typing-user">
              <Avatar src={userInfo[userId]?.avatar} size="sm" />
              <span>{userInfo[userId]?.name}</span>
              <TypingDots />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`}</code></pre>

        <h3>Throttled Network Updates</h3>
        <pre><code>{`import { useTyping } from '@clarity-chat/react'
import { throttle } from 'lodash'

function ThrottledTyping() {
  const sendTypingEvent = React.useCallback(
    throttle((typing) => {
      socket.emit('typing', { typing, userId: currentUser.id })
    }, 1000), // Max once per second
    []
  )

  const { startTyping, stopTyping } = useTyping({
    timeout: 2000,
    onChange: sendTypingEvent
  })

  return <MessageInput onChange={handleChange} />
}`}</code></pre>

        <h3>Typing with Character Count</h3>
        <pre><code>{`function TypingWithCount() {
  const { isTyping, startTyping } = useTyping({ timeout: 2000 })
  const [text, setText] = React.useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setText(value)
    
    if (value.length > 0) {
      startTyping()
    }
  }

  return (
    <div>
      <textarea value={text} onChange={handleChange} />
      <div className="footer">
        <span>{text.length} / 500</span>
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  )
}`}</code></pre>

        <h3>Typing Heatmap</h3>
        <pre><code>{`function TypingHeatmap() {
  const [typingActivity, setTypingActivity] = React.useState([])

  const { startTyping } = useTyping({
    onChange: (typing) => {
      if (typing) {
        setTypingActivity(prev => [...prev, Date.now()])
      }
    }
  })

  const getActivityLevel = () => {
    const now = Date.now()
    const recentActivity = typingActivity.filter(
      time => now - time < 60000 // Last minute
    )
    return recentActivity.length
  }

  return (
    <div className="heatmap">
      Activity: {getActivityLevel()} events/min
    </div>
  )
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <Callout type="tip" title="Use Debouncing">
          Always use debouncing to reduce network traffic. A 300-500ms debounce
          is usually ideal for typing indicators.
        </Callout>

        <Callout type="warning" title="Clean Up on Unmount">
          Always stop typing indicators when component unmounts or user leaves
          the chat to avoid showing stale indicators.
        </Callout>

        <h3>Performance Tips</h3>
        <ul>
          <li>Use debouncing to reduce network requests</li>
          <li>Set appropriate timeout values (2-3 seconds)</li>
          <li>Throttle WebSocket events to prevent spam</li>
          <li>Clean up typing state on component unmount</li>
          <li>Batch multiple typing events when possible</li>
        </ul>

        <h3>UX Guidelines</h3>
        <ul>
          <li>Show typing indicator for 2-3 seconds of inactivity</li>
          <li>Display user names for multi-user typing</li>
          <li>Use subtle animations for typing dots</li>
          <li>Position typing indicator near the message input</li>
          <li>Don't show typing for your own messages</li>
          <li>Limit displayed typing users to 3-4 names</li>
        </ul>

        <h3>Real-time Considerations</h3>
        <ul>
          <li>Handle connection drops gracefully</li>
          <li>Clear typing state on disconnect</li>
          <li>Use presence detection to validate typing users</li>
          <li>Implement server-side timeout for stale indicators</li>
          <li>Consider rate limiting on the backend</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>

        <h3>Screen Reader Announcements</h3>
        <pre><code>{`<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {isTyping && (
    <span className="sr-only">
      {userName} is typing a message
    </span>
  )}
  {/* Visual indicator */}
  <TypingDots />
</div>`}</code></pre>

        <h3>Reduced Motion</h3>
        <pre><code>{`// Respect prefers-reduced-motion
.typing-dot {
  animation: bounce 1.4s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .typing-dot {
    animation: none;
    opacity: 0.7;
  }
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre><code>{`import { useTyping, UseTypingOptions, UseTypingReturn } from '@clarity-chat/react'

interface UseTypingOptions {
  timeout?: number
  debounce?: number
  multiUser?: boolean
  onChange?: (isTyping: boolean) => void
  onUsersChange?: (userIds: string[]) => void
}

interface UseTypingReturn {
  isTyping: boolean
  startTyping: () => void
  stopTyping: () => void
  typingUsers: string[]
  addTypingUser: (userId: string) => void
  removeTypingUser: (userId: string) => void
  clearTypingUsers: () => void
}

function useTyping(options?: UseTypingOptions): UseTypingReturn`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/typing-indicator" className="docs-card">
            <h3>TypingIndicator</h3>
            <p>Animated typing indicator component</p>
          </a>
          <a href="/reference/components/message-input" className="docs-card">
            <h3>MessageInput</h3>
            <p>Message input with typing detection</p>
          </a>
          <a href="/reference/hooks/use-messages" className="docs-card">
            <h3>useMessages</h3>
            <p>Message state management</p>
          </a>
          <a href="/examples/multi-user" className="docs-card">
            <h3>Multi-user Example</h3>
            <p>Complete typing indicator implementation</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const returnValue = [
  {
    name: 'isTyping',
    type: 'boolean',
    description: 'Whether typing indicator is currently active'
  },
  {
    name: 'startTyping',
    type: '() => void',
    description: 'Manually start showing typing indicator'
  },
  {
    name: 'stopTyping',
    type: '() => void',
    description: 'Manually stop showing typing indicator'
  },
  {
    name: 'typingUsers',
    type: 'string[]',
    description: 'Array of user IDs currently typing (multiUser mode only)'
  },
  {
    name: 'addTypingUser',
    type: '(userId: string) => void',
    description: 'Add a user to typing list (multiUser mode only)'
  },
  {
    name: 'removeTypingUser',
    type: '(userId: string) => void',
    description: 'Remove a user from typing list (multiUser mode only)'
  },
  {
    name: 'clearTypingUsers',
    type: '() => void',
    description: 'Remove all users from typing list (multiUser mode only)'
  }
]

const configOptions = [
  {
    name: 'timeout',
    type: 'number',
    required: false,
    default: '2000',
    description: 'Milliseconds before automatically stopping typing indicator'
  },
  {
    name: 'debounce',
    type: 'number',
    required: false,
    default: '0',
    description: 'Milliseconds to wait before showing typing indicator (reduces network events)'
  },
  {
    name: 'multiUser',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Enable tracking multiple users typing simultaneously'
  },
  {
    name: 'onChange',
    type: '(isTyping: boolean) => void',
    required: false,
    description: 'Callback when typing state changes (for sending to server)'
  },
  {
    name: 'onUsersChange',
    type: '(userIds: string[]) => void',
    required: false,
    description: 'Callback when typing users list changes (multiUser mode only)'
  }
]
