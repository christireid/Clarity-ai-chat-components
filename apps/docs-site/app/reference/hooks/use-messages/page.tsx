import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'useMessages - Clarity Chat Components',
  description: 'Hook for managing message state with CRUD operations, filtering, sorting, and real-time updates.',
}

export default function UseMessagesPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useMessages</h1>
        <p className="docs-lead">
          Powerful message state management with CRUD operations, filtering, sorting, pagination, and optimistic updates.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>useMessages</code> hook provides comprehensive message state management for chat applications.
          It handles common operations like adding, updating, deleting messages, along with advanced features
          like filtering, sorting, pagination, and optimistic updates for a smooth user experience.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Basic Message Management"
          code={`import { useMessages } from '@clarity-chat/react'

function BasicChat() {
  const {
    messages,
    addMessage,
    updateMessage,
    deleteMessage,
    clearMessages
  } = useMessages()

  const [inputText, setInputText] = React.useState('')

  const handleSend = () => {
    if (inputText.trim()) {
      addMessage({
        text: inputText,
        sender: { id: 'user1', name: 'You' },
        timestamp: new Date()
      })
      setInputText('')
    }
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No messages yet</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">
                  {message.sender.name}
                </span>
                <button
                  onClick={() => deleteMessage(message.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm">{message.text}</p>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
      
      <div className="border-t p-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all messages
          </button>
        )}
      </div>
    </div>
  )
}

export default BasicChat`}
          height="650px"
        />
      </section>

      <section className="docs-section">
        <h2>Return Value</h2>
        <ApiTable
          title="useMessages() Return Value"
          data={returnValue}
        />
      </section>

      <section className="docs-section">
        <h2>Configuration Options</h2>
        <ApiTable
          title="useMessages(options)"
          data={configOptions}
        />
      </section>

      <section className="docs-section">
        <h2>Message Filtering</h2>
        <p>
          Filter messages by text, sender, date range, or custom criteria.
        </p>
        <LiveDemo
          title="Message Filtering"
          code={`import { useMessages } from '@clarity-chat/react'

function FilteredChat() {
  const { messages, addMessage, filterMessages } = useMessages()
  const [filterText, setFilterText] = React.useState('')
  const [selectedUser, setSelectedUser] = React.useState('all')

  React.useEffect(() => {
    // Add sample messages
    const sampleMessages = [
      { text: 'Hello everyone!', sender: { id: 'alice', name: 'Alice' } },
      { text: 'Hi Alice!', sender: { id: 'bob', name: 'Bob' } },
      { text: 'Welcome to the chat!', sender: { id: 'alice', name: 'Alice' } },
      { text: 'Thanks! How is everyone?', sender: { id: 'charlie', name: 'Charlie' } },
      { text: 'Doing great!', sender: { id: 'bob', name: 'Bob' } }
    ]
    sampleMessages.forEach(msg => 
      addMessage({ ...msg, timestamp: new Date() })
    )
  }, [])

  const filteredMessages = React.useMemo(() => {
    return filterMessages((message) => {
      const matchesText = filterText === '' || 
        message.text.toLowerCase().includes(filterText.toLowerCase())
      const matchesUser = selectedUser === 'all' || 
        message.sender.id === selectedUser
      return matchesText && matchesUser
    })
  }, [messages, filterText, selectedUser])

  const users = React.useMemo(() => {
    const userMap = new Map()
    messages.forEach(msg => {
      if (!userMap.has(msg.sender.id)) {
        userMap.set(msg.sender.id, msg.sender.name)
      }
    })
    return Array.from(userMap.entries())
  }, [messages])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter by text..."
          className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Users</option>
          {users.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      <div className="border rounded-lg p-4 h-[400px] overflow-y-auto">
        {filteredMessages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No messages match your filters
          </p>
        ) : (
          <div className="space-y-2">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded"
              >
                <span className="font-semibold text-sm">
                  {message.sender.name}:
                </span>
                <p className="text-sm mt-1">{message.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">
        Showing {filteredMessages.length} of {messages.length} messages
      </div>
    </div>
  )
}

export default FilteredChat`}
          height="650px"
        />
      </section>

      <section className="docs-section">
        <h2>Message Sorting</h2>
        <p>
          Sort messages by timestamp, sender, or custom criteria.
        </p>
        <LiveDemo
          title="Message Sorting"
          code={`import { useMessages } from '@clarity-chat/react'

function SortedChat() {
  const { messages, addMessage, sortMessages } = useMessages()
  const [sortBy, setSortBy] = React.useState('newest')

  React.useEffect(() => {
    // Add sample messages with different timestamps
    const now = Date.now()
    const sampleMessages = [
      { text: 'First message', sender: { id: 'alice', name: 'Alice' }, timestamp: new Date(now - 300000) },
      { text: 'Second message', sender: { id: 'bob', name: 'Bob' }, timestamp: new Date(now - 200000) },
      { text: 'Third message', sender: { id: 'alice', name: 'Alice' }, timestamp: new Date(now - 100000) },
      { text: 'Latest message', sender: { id: 'charlie', name: 'Charlie' }, timestamp: new Date(now) }
    ]
    sampleMessages.forEach(msg => addMessage(msg))
  }, [])

  const sortedMessages = React.useMemo(() => {
    const sorted = [...messages]
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => b.timestamp - a.timestamp)
      case 'oldest':
        return sorted.sort((a, b) => a.timestamp - b.timestamp)
      case 'sender':
        return sorted.sort((a, b) => 
          a.sender.name.localeCompare(b.sender.name)
        )
      default:
        return sorted
    }
  }, [messages, sortBy])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Sort by:</span>
        <div className="flex gap-2">
          {['newest', 'oldest', 'sender'].map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={\`px-3 py-1 rounded text-sm \${
                sortBy === option
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
              }\`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 h-[400px] overflow-y-auto space-y-2">
        {sortedMessages.map((message, index) => (
          <div
            key={message.id}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm">
                {message.sender.name}
              </span>
              <span className="text-xs text-gray-500">
                #{index + 1}
              </span>
            </div>
            <p className="text-sm">{message.text}</p>
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SortedChat`}
          height="600px"
        />
      </section>

      <section className="docs-section">
        <h2>Pagination</h2>
        <p>
          Handle large message lists with pagination for better performance.
        </p>
        <LiveDemo
          title="Paginated Messages"
          code={`import { useMessages } from '@clarity-chat/react'

function PaginatedChat() {
  const { messages, addMessage } = useMessages()
  const [currentPage, setCurrentPage] = React.useState(1)
  const messagesPerPage = 5

  React.useEffect(() => {
    // Add 20 sample messages
    for (let i = 1; i <= 20; i++) {
      addMessage({
        text: \`This is message number \${i}\`,
        sender: { 
          id: \`user\${(i % 3) + 1}\`, 
          name: ['Alice', 'Bob', 'Charlie'][i % 3]
        },
        timestamp: new Date(Date.now() - (20 - i) * 60000)
      })
    }
  }, [])

  const totalPages = Math.ceil(messages.length / messagesPerPage)
  const startIndex = (currentPage - 1) * messagesPerPage
  const endIndex = startIndex + messagesPerPage
  const currentMessages = messages.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Total messages: {messages.length}
        </div>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="border rounded-lg p-4 h-[400px] overflow-y-auto space-y-2">
        {currentMessages.map((message) => (
          <div
            key={message.id}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm">
                {message.sender.name}
              </span>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm">{message.text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          First
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Previous
        </button>
        
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => 
              page === 1 || 
              page === totalPages || 
              Math.abs(page - currentPage) <= 1
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 py-1">...</span>
                )}
                <button
                  onClick={() => goToPage(page)}
                  className={\`px-3 py-1 rounded \${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'border hover:bg-gray-100'
                  }\`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))
          }
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Next
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Last
        </button>
      </div>
    </div>
  )
}

export default PaginatedChat`}
          height="650px"
        />
      </section>

      <section className="docs-section">
        <h2>Optimistic Updates</h2>
        <p>
          Show messages immediately while waiting for server confirmation.
        </p>
        <LiveDemo
          title="Optimistic Updates"
          code={`import { useMessages } from '@clarity-chat/react'

function OptimisticChat() {
  const { 
    messages, 
    addMessage, 
    updateMessage, 
    deleteMessage 
  } = useMessages({ enableOptimistic: true })
  
  const [inputText, setInputText] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  // Simulate API delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handleSend = async () => {
    if (!inputText.trim()) return

    const optimisticMessage = {
      text: inputText,
      sender: { id: 'user1', name: 'You' },
      timestamp: new Date(),
      isOptimistic: true // Mark as pending confirmation
    }

    // Add optimistically
    const tempId = addMessage(optimisticMessage)
    setInputText('')
    setIsLoading(true)

    try {
      // Simulate API call
      await delay(2000)
      
      // Update with server response
      updateMessage(tempId, {
        id: \`msg-\${Date.now()}\`, // Server-generated ID
        isOptimistic: false,
        status: 'sent'
      })
    } catch (error) {
      // On error, mark as failed
      updateMessage(tempId, {
        isOptimistic: false,
        status: 'failed',
        error: 'Failed to send'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const retryMessage = async (messageId) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return

    updateMessage(messageId, { isOptimistic: true, status: 'sending' })
    
    try {
      await delay(2000)
      updateMessage(messageId, { 
        isOptimistic: false, 
        status: 'sent',
        error: undefined
      })
    } catch (error) {
      updateMessage(messageId, { status: 'failed', error: 'Failed to send' })
    }
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={\`p-3 rounded-lg \${
              message.status === 'failed'
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200'
                : message.isOptimistic
                ? 'bg-gray-100 dark:bg-gray-800 opacity-60'
                : 'bg-blue-100 dark:bg-blue-900/20'
            }\`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm">
                {message.sender.name}
              </span>
              <div className="flex items-center gap-2">
                {message.isOptimistic && (
                  <span className="text-xs text-gray-500">Sending...</span>
                )}
                {message.status === 'sent' && (
                  <span className="text-xs text-green-500">✓ Sent</span>
                )}
                {message.status === 'failed' && (
                  <button
                    onClick={() => retryMessage(message.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm">{message.text}</p>
            {message.error && (
              <p className="text-xs text-red-500 mt-1">{message.error}</p>
            )}
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OptimisticChat`}
          height="650px"
        />
      </section>

      <section className="docs-section">
        <h2>Real-time Subscriptions</h2>
        <p>
          Subscribe to real-time message updates from WebSocket or Firebase.
        </p>
        <LiveDemo
          title="Real-time Messages"
          code={`import { useMessages } from '@clarity-chat/react'

function RealtimeChat() {
  const { messages, addMessage, updateMessage, deleteMessage } = useMessages()
  const [isConnected, setIsConnected] = React.useState(false)

  React.useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true)

    // Simulate receiving messages from other users
    const interval = setInterval(() => {
      const randomMessages = [
        'Hey there!',
        'How are you?',
        'This is a real-time message!',
        'Check out this cool feature 🚀',
        'Real-time updates are awesome!'
      ]
      
      const randomSenders = [
        { id: 'alice', name: 'Alice' },
        { id: 'bob', name: 'Bob' },
        { id: 'charlie', name: 'Charlie' }
      ]

      addMessage({
        text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        sender: randomSenders[Math.floor(Math.random() * randomSenders.length)],
        timestamp: new Date()
      })
    }, 5000)

    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded">
        <div className={\`w-2 h-2 rounded-full \${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }\`} />
        <span className="text-sm">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        <span className="text-xs text-gray-500 ml-auto">
          New messages appear automatically
        </span>
      </div>

      <div className="border rounded-lg p-4 h-[400px] overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Waiting for messages...
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded animate-fadeIn"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">
                  {message.sender.name}
                </span>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>
          ))
        )}
      </div>

      <style jsx>{\`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      \`}</style>
    </div>
  )
}

export default RealtimeChat`}
          height="600px"
        />
      </section>

      <section className="docs-section">
        <h2>Message Reactions</h2>
        <p>
          Add, remove, and manage reactions on messages.
        </p>
        <LiveDemo
          title="Message Reactions"
          code={`import { useMessages } from '@clarity-chat/react'

function ReactionsChat() {
  const { messages, addMessage, updateMessage } = useMessages()

  React.useEffect(() => {
    addMessage({
      text: 'This message can have reactions!',
      sender: { id: 'alice', name: 'Alice' },
      timestamp: new Date(),
      reactions: {}
    })
    addMessage({
      text: 'React to messages with emojis 😊',
      sender: { id: 'bob', name: 'Bob' },
      timestamp: new Date(),
      reactions: {}
    })
  }, [])

  const availableReactions = ['👍', '❤️', '😂', '🎉', '🔥', '👀']

  const toggleReaction = (messageId, emoji) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return

    const reactions = { ...message.reactions }
    const currentUserId = 'user1' // Current user

    if (!reactions[emoji]) {
      reactions[emoji] = []
    }

    const userIndex = reactions[emoji].indexOf(currentUserId)
    if (userIndex > -1) {
      reactions[emoji].splice(userIndex, 1)
      if (reactions[emoji].length === 0) {
        delete reactions[emoji]
      }
    } else {
      reactions[emoji].push(currentUserId)
    }

    updateMessage(messageId, { reactions })
  }

  return (
    <div className="border rounded-lg p-4 h-[500px] overflow-y-auto space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="space-y-2">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">
                {message.sender.name}
              </span>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm">{message.text}</p>
          </div>

          <div className="flex flex-wrap gap-2 ml-3">
            {/* Existing reactions */}
            {Object.entries(message.reactions || {}).map(([emoji, users]) => (
              users.length > 0 && (
                <button
                  key={emoji}
                  onClick={() => toggleReaction(message.id, emoji)}
                  className={\`px-2 py-1 rounded-full text-sm flex items-center gap-1 \${
                    users.includes('user1')
                      ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                  }\`}
                >
                  <span>{emoji}</span>
                  <span className="text-xs">{users.length}</span>
                </button>
              )
            ))}

            {/* Add reaction buttons */}
            <div className="relative group">
              <button className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-300">
                ➕
              </button>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex gap-1 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
                {availableReactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => toggleReaction(message.id, emoji)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReactionsChat`}
          height="600px"
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Grouping Messages by Date</h3>
        <pre><code>{`function groupMessagesByDate(messages) {
  const groups = {}
  
  messages.forEach(message => {
    const date = message.timestamp.toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
  })
  
  return groups
}

// Usage
const { messages } = useMessages()
const groupedMessages = React.useMemo(
  () => groupMessagesByDate(messages),
  [messages]
)

return (
  <div>
    {Object.entries(groupedMessages).map(([date, msgs]) => (
      <div key={date}>
        <div className="date-divider">{date}</div>
        {msgs.map(message => (
          <Message key={message.id} {...message} />
        ))}
      </div>
    ))}
  </div>
)`}</code></pre>

        <h3>Thread Support</h3>
        <pre><code>{`const { messages, addMessage, getThread } = useMessages()

function MessageThread({ parentId }) {
  const threadMessages = React.useMemo(
    () => messages.filter(m => m.parentId === parentId),
    [messages, parentId]
  )
  
  const handleReply = (text) => {
    addMessage({
      text,
      parentId,
      sender: currentUser,
      timestamp: new Date()
    })
  }
  
  return (
    <div className="thread">
      {threadMessages.map(message => (
        <Message key={message.id} {...message} isThreaded />
      ))}
      <ReplyInput onSubmit={handleReply} />
    </div>
  )
}`}</code></pre>

        <h3>Message Search</h3>
        <pre><code>{`const { messages, searchMessages } = useMessages()

function MessageSearch() {
  const [query, setQuery] = useState('')
  
  const results = React.useMemo(() => {
    if (!query) return []
    
    return searchMessages(query, {
      fields: ['text', 'sender.name'],
      fuzzy: true,
      maxResults: 10
    })
  }, [messages, query])
  
  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search messages..."
      />
      <SearchResults results={results} />
    </div>
  )
}`}</code></pre>

        <h3>Infinite Scroll</h3>
        <pre><code>{`const { messages, loadMore, hasMore } = useMessages({
  pagination: {
    pageSize: 20,
    mode: 'infinite'
  }
})

function InfiniteScrollChat() {
  const observerRef = React.useRef()
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 1.0 }
    )
    
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    
    return () => observer.disconnect()
  }, [hasMore, loadMore])
  
  return (
    <div>
      {messages.map(message => (
        <Message key={message.id} {...message} />
      ))}
      <div ref={observerRef}>Loading...</div>
    </div>
  )
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Integration Examples</h2>

        <h3>Firebase Integration</h3>
        <pre><code>{`import { useMessages } from '@clarity-chat/react'
import { db } from './firebase'
import { collection, onSnapshot, addDoc } from 'firebase/firestore'

function FirebaseChat() {
  const { messages, addMessage, updateMessage, deleteMessage } = useMessages()
  
  React.useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'messages'),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            addMessage({ id: change.doc.id, ...change.doc.data() })
          }
          if (change.type === 'modified') {
            updateMessage(change.doc.id, change.doc.data())
          }
          if (change.type === 'removed') {
            deleteMessage(change.doc.id)
          }
        })
      }
    )
    
    return unsubscribe
  }, [])
  
  const handleSend = async (text) => {
    await addDoc(collection(db, 'messages'), {
      text,
      sender: currentUser,
      timestamp: new Date()
    })
  }
  
  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}</code></pre>

        <h3>REST API Integration</h3>
        <pre><code>{`function APIChat() {
  const { messages, addMessage, setMessages } = useMessages()
  const [loading, setLoading] = useState(true)
  
  // Load initial messages
  React.useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        setMessages(data)
        setLoading(false)
      })
  }, [])
  
  // Send message to API
  const handleSend = async (text) => {
    const optimisticId = addMessage({
      text,
      sender: currentUser,
      timestamp: new Date(),
      isOptimistic: true
    })
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      
      const savedMessage = await response.json()
      updateMessage(optimisticId, { ...savedMessage, isOptimistic: false })
    } catch (error) {
      updateMessage(optimisticId, { status: 'failed', error: error.message })
    }
  }
  
  if (loading) return <div>Loading...</div>
  
  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <Callout type="tip" title="Use Optimistic Updates">
          Always show the user's message immediately, then confirm with the server.
          This provides instant feedback and a better user experience.
        </Callout>

        <Callout type="warning" title="Handle Errors Gracefully">
          Always provide a way to retry failed messages. Don't silently fail - show
          the user what went wrong and how to fix it.
        </Callout>

        <h3>Performance Optimization</h3>
        <ul>
          <li>Use pagination or infinite scroll for large message lists</li>
          <li>Memoize filtered and sorted message arrays</li>
          <li>Virtualize long lists with react-window or react-virtuoso</li>
          <li>Debounce search and filter operations</li>
          <li>Clean up old messages periodically</li>
        </ul>

        <h3>State Management</h3>
        <ul>
          <li>Keep message state as close to where it's used as possible</li>
          <li>Use context or Redux for global message state</li>
          <li>Persist messages to localStorage for offline support</li>
          <li>Sync with backend regularly to prevent data loss</li>
        </ul>

        <h3>Real-time Considerations</h3>
        <ul>
          <li>Handle connection drops gracefully</li>
          <li>Show connection status to users</li>
          <li>Queue messages when offline, send when online</li>
          <li>Deduplicate messages from multiple sources</li>
          <li>Handle message order carefully with timestamps</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre><code>{`import { useMessages, Message, UseMessagesOptions } from '@clarity-chat/react'

interface Message {
  id: string
  text: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  isOwn?: boolean
  parentId?: string
  reactions?: Record<string, string[]>
  attachments?: Attachment[]
  status?: 'sending' | 'sent' | 'failed'
  isOptimistic?: boolean
  metadata?: Record<string, any>
}

interface UseMessagesOptions {
  initialMessages?: Message[]
  enableOptimistic?: boolean
  maxMessages?: number
  persistence?: {
    key: string
    storage: 'local' | 'session'
  }
  pagination?: {
    pageSize: number
    mode: 'page' | 'infinite'
  }
}

interface UseMessagesReturn {
  messages: Message[]
  addMessage: (message: Omit<Message, 'id'>) => string
  updateMessage: (id: string, updates: Partial<Message>) => void
  deleteMessage: (id: string) => void
  clearMessages: () => void
  filterMessages: (predicate: (message: Message) => boolean) => Message[]
  sortMessages: (compareFn: (a: Message, b: Message) => number) => Message[]
  searchMessages: (query: string, options?: SearchOptions) => Message[]
  getThread: (parentId: string) => Message[]
  loadMore: () => Promise<void>
  hasMore: boolean
  isLoading: boolean
  error: Error | null
}

function useMessages(options?: UseMessagesOptions): UseMessagesReturn`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-chat" className="docs-card">
            <h3>useChat</h3>
            <p>Complete chat state management</p>
          </a>
          <a href="/reference/components/message" className="docs-card">
            <h3>Message Component</h3>
            <p>Message rendering and display</p>
          </a>
          <a href="/reference/hooks/use-typing" className="docs-card">
            <h3>useTyping</h3>
            <p>Typing indicator management</p>
          </a>
          <a href="/examples/realtime" className="docs-card">
            <h3>Real-time Example</h3>
            <p>WebSocket integration example</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const returnValue = [
  {
    name: 'messages',
    type: 'Message[]',
    description: 'Array of all messages in current state'
  },
  {
    name: 'addMessage',
    type: '(message: Omit<Message, "id">) => string',
    description: 'Add a new message. Returns the generated ID.'
  },
  {
    name: 'updateMessage',
    type: '(id: string, updates: Partial<Message>) => void',
    description: 'Update specific fields of a message'
  },
  {
    name: 'deleteMessage',
    type: '(id: string) => void',
    description: 'Remove a message by ID'
  },
  {
    name: 'clearMessages',
    type: '() => void',
    description: 'Remove all messages'
  },
  {
    name: 'filterMessages',
    type: '(predicate: (message: Message) => boolean) => Message[]',
    description: 'Filter messages by custom criteria'
  },
  {
    name: 'sortMessages',
    type: '(compareFn: (a: Message, b: Message) => number) => Message[]',
    description: 'Sort messages with custom comparison function'
  },
  {
    name: 'searchMessages',
    type: '(query: string, options?: SearchOptions) => Message[]',
    description: 'Search messages with fuzzy matching support'
  },
  {
    name: 'getThread',
    type: '(parentId: string) => Message[]',
    description: 'Get all messages in a thread'
  },
  {
    name: 'loadMore',
    type: '() => Promise<void>',
    description: 'Load next page of messages (pagination mode)'
  },
  {
    name: 'hasMore',
    type: 'boolean',
    description: 'Whether more messages are available to load'
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether messages are currently being loaded'
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Last error that occurred, if any'
  }
]

const configOptions = [
  {
    name: 'initialMessages',
    type: 'Message[]',
    required: false,
    default: '[]',
    description: 'Initial messages to populate state'
  },
  {
    name: 'enableOptimistic',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Enable optimistic UI updates'
  },
  {
    name: 'maxMessages',
    type: 'number',
    required: false,
    description: 'Maximum number of messages to keep in memory. Older messages are automatically removed.'
  },
  {
    name: 'persistence',
    type: '{ key: string; storage: "local" | "session" }',
    required: false,
    description: 'Enable message persistence to browser storage'
  },
  {
    name: 'pagination',
    type: '{ pageSize: number; mode: "page" | "infinite" }',
    required: false,
    description: 'Pagination configuration. "page" for traditional pagination, "infinite" for infinite scroll.'
  },
  {
    name: 'onMessageAdded',
    type: '(message: Message) => void',
    required: false,
    description: 'Callback when a message is added'
  },
  {
    name: 'onMessageUpdated',
    type: '(id: string, updates: Partial<Message>) => void',
    required: false,
    description: 'Callback when a message is updated'
  },
  {
    name: 'onMessageDeleted',
    type: '(id: string) => void',
    required: false,
    description: 'Callback when a message is deleted'
  }
]
