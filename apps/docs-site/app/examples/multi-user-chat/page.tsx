import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Multi-user Chat Example - Clarity Chat Components',
  description: 'Complete multi-user chat application with typing indicators, presence, reactions, and real-time updates.',
}

export default function MultiUserChatExamplePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Example</span>
        <span className="docs-badge">Advanced</span>
        <h1>Multi-user Chat</h1>
        <p className="docs-lead">
          Build a complete multi-user chat application with typing indicators, user presence, 
          reactions, message threading, and real-time synchronization.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This example demonstrates a production-ready multi-user chat application with all the
          features you'd expect from modern chat platforms like Slack, Discord, or Microsoft Teams.
        </p>
        <h3>Features Included</h3>
        <ul>
          <li>Multiple user simulation</li>
          <li>Real-time typing indicators</li>
          <li>User presence (online/away/offline)</li>
          <li>Message reactions</li>
          <li>User avatars and profiles</li>
          <li>Message timestamps</li>
          <li>Read receipts</li>
          <li>Smooth animations</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Complete Implementation</h2>
        <LiveDemo
          title="Multi-user Chat Application"
          code={`import { ChatWindow, Message, MessageInput, TypingIndicator } from '@clarity-chat/react'
import { useState, useEffect, useRef } from 'react'

function MultiUserChat() {
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState({
    id: 'user1',
    name: 'You',
    avatar: '😊',
    status: 'online'
  })
  
  const [users, setUsers] = useState([
    { id: 'user1', name: 'You', avatar: '😊', status: 'online' },
    { id: 'user2', name: 'Alice', avatar: '👩', status: 'online' },
    { id: 'user3', name: 'Bob', avatar: '👨', status: 'away' },
    { id: 'user4', name: 'Charlie', avatar: '🧑', status: 'offline' }
  ])
  
  const [typingUsers, setTypingUsers] = useState([])
  const [onlineUsers, setOnlineUsers] = useState(['user2'])
  
  // Simulate other users sending messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        'Hey everyone! 👋',
        'How are you all doing?',
        'Check out this cool feature!',
        'Anyone up for a quick call?',
        'Great work on the project! 🎉',
        'Let me know if you need any help',
        'That sounds like a good idea',
        'I agree with that approach',
        'When is the next meeting?'
      ]
      
      const randomUser = users[Math.floor(Math.random() * (users.length - 1)) + 1]
      
      // Simulate typing
      setTypingUsers(prev => [...prev, randomUser.id])
      
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(id => id !== randomUser.id))
        
        const newMessage = {
          id: \`msg-\${Date.now()}\`,
          text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          sender: randomUser,
          timestamp: new Date(),
          isOwn: false,
          reactions: {},
          readBy: []
        }
        
        setMessages(prev => [...prev, newMessage])
      }, 2000)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [users])
  
  // Simulate user presence changes
  useEffect(() => {
    const interval = setInterval(() => {
      const userId = users[Math.floor(Math.random() * (users.length - 1)) + 1].id
      setOnlineUsers(prev => {
        if (prev.includes(userId)) {
          return prev.filter(id => id !== userId)
        } else {
          return [...prev, userId]
        }
      })
    }, 15000)
    
    return () => clearInterval(interval)
  }, [users])

  const handleSend = (text) => {
    const newMessage = {
      id: \`msg-\${Date.now()}\`,
      text,
      sender: currentUser,
      timestamp: new Date(),
      isOwn: true,
      reactions: {},
      readBy: onlineUsers // Simulate read receipts
    }
    
    setMessages(prev => [...prev, newMessage])
  }
  
  const handleReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions }
        if (!reactions[emoji]) {
          reactions[emoji] = []
        }
        
        if (reactions[emoji].includes(currentUser.id)) {
          reactions[emoji] = reactions[emoji].filter(id => id !== currentUser.id)
          if (reactions[emoji].length === 0) {
            delete reactions[emoji]
          }
        } else {
          reactions[emoji].push(currentUser.id)
        }
        
        return { ...msg, reactions }
      }
      return msg
    }))
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Sidebar with user list */}
      <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
        <h3 className="font-bold mb-4 text-sm uppercase text-gray-600 dark:text-gray-400">
          Users ({onlineUsers.length + 1} online)
        </h3>
        <div className="space-y-2">
          {users.map(user => {
            const isOnline = user.id === currentUser.id || onlineUsers.includes(user.id)
            return (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="relative">
                  <span className="text-2xl">{user.avatar}</span>
                  <div
                    className={\`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 \${
                      isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }\`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 bg-white dark:bg-gray-800">
          <h2 className="font-bold text-lg">General Chat</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {onlineUsers.length + 1} members online
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg font-semibold mb-2">Welcome to the chat! 👋</p>
              <p className="text-sm">Send a message to get started</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const showAvatar = index === 0 || 
                messages[index - 1].sender.id !== message.sender.id
              
              return (
                <div
                  key={message.id}
                  className={\`flex gap-3 \${message.isOwn ? 'flex-row-reverse' : ''}\`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {showAvatar ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl">
                        {message.sender.avatar}
                      </div>
                    ) : (
                      <div className="w-10" />
                    )}
                  </div>

                  {/* Message content */}
                  <div className={\`flex-1 max-w-[70%] \${message.isOwn ? 'items-end' : 'items-start'}\`}>
                    {showAvatar && (
                      <div className={\`flex items-center gap-2 mb-1 \${message.isOwn ? 'flex-row-reverse' : ''}\`}>
                        <span className="font-semibold text-sm">
                          {message.sender.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    
                    <div
                      className={\`p-3 rounded-lg \${
                        message.isOwn
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'
                      }\`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                    </div>

                    {/* Reactions */}
                    {Object.keys(message.reactions).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(message.reactions).map(([emoji, userIds]) => (
                          userIds.length > 0 && (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className={\`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 \${
                                userIds.includes(currentUser.id)
                                  ? 'bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-500'
                                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                              }\`}
                            >
                              <span>{emoji}</span>
                              <span>{userIds.length}</span>
                            </button>
                          )
                        ))}
                        <button
                          onClick={() => handleReaction(message.id, '👍')}
                          className="px-2 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    )}

                    {/* Read receipts */}
                    {message.isOwn && message.readBy.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Seen by {message.readBy.length} {message.readBy.length === 1 ? 'person' : 'people'}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">
                {users.find(u => u.id === typingUsers[0])?.avatar}
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {users.find(u => u.id === typingUsers[0])?.name} is typing...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t p-4 bg-white dark:bg-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleSend(e.target.value)
                  e.target.value = ''
                }
              }}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiUserChat`}
          height="750px"
        />
      </section>

      <section className="docs-section">
        <h2>Step-by-Step Breakdown</h2>

        <h3>1. User State Management</h3>
        <p>
          Track all users in the chat with their online status:
        </p>
        <pre><code>{`const [users, setUsers] = useState([
  { id: 'user1', name: 'You', avatar: '😊', status: 'online' },
  { id: 'user2', name: 'Alice', avatar: '👩', status: 'online' },
  { id: 'user3', name: 'Bob', avatar: '👨', status: 'away' },
  { id: 'user4', name: 'Charlie', avatar: '🧑', status: 'offline' }
])

const [onlineUsers, setOnlineUsers] = useState(['user2'])

// Update presence
const updateUserPresence = (userId, status) => {
  if (status === 'online') {
    setOnlineUsers(prev => [...prev, userId])
  } else {
    setOnlineUsers(prev => prev.filter(id => id !== userId))
  }
}`}</code></pre>

        <h3>2. Typing Indicators</h3>
        <p>
          Show when users are composing messages:
        </p>
        <pre><code>{`const [typingUsers, setTypingUsers] = useState([])

// Start typing
const startTyping = (userId) => {
  setTypingUsers(prev => [...prev, userId])
}

// Stop typing (after timeout or message sent)
const stopTyping = (userId) => {
  setTypingUsers(prev => prev.filter(id => id !== userId))
}

// Render typing indicator
{typingUsers.length > 0 && (
  <TypingIndicator 
    users={typingUsers.map(id => users.find(u => u.id === id))}
  />
)}`}</code></pre>

        <h3>3. Message Reactions</h3>
        <p>
          Allow users to react to messages with emojis:
        </p>
        <pre><code>{`const handleReaction = (messageId, emoji) => {
  setMessages(prev => prev.map(msg => {
    if (msg.id === messageId) {
      const reactions = { ...msg.reactions }
      
      // Initialize emoji array if needed
      if (!reactions[emoji]) {
        reactions[emoji] = []
      }
      
      // Toggle user's reaction
      if (reactions[emoji].includes(currentUser.id)) {
        reactions[emoji] = reactions[emoji].filter(id => id !== currentUser.id)
        if (reactions[emoji].length === 0) {
          delete reactions[emoji]
        }
      } else {
        reactions[emoji].push(currentUser.id)
      }
      
      return { ...msg, reactions }
    }
    return msg
  }))
}`}</code></pre>

        <h3>4. Read Receipts</h3>
        <p>
          Track which users have seen each message:
        </p>
        <pre><code>{`// Mark messages as read
const markAsRead = (messageId, userId) => {
  setMessages(prev => prev.map(msg => {
    if (msg.id === messageId && !msg.readBy.includes(userId)) {
      return {
        ...msg,
        readBy: [...msg.readBy, userId]
      }
    }
    return msg
  }))
}

// Display read status
{message.isOwn && message.readBy.length > 0 && (
  <div className="read-receipts">
    Seen by {message.readBy.length}
  </div>
)}`}</code></pre>

        <h3>5. Avatar Grouping</h3>
        <p>
          Group consecutive messages from the same user:
        </p>
        <pre><code>{`const showAvatar = (index) => {
  if (index === 0) return true
  return messages[index - 1].sender.id !== messages[index].sender.id
}

// In render
{showAvatar(index) ? (
  <Avatar user={message.sender} />
) : (
  <div className="avatar-spacer" />
)}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Real-time Integration</h2>

        <h3>WebSocket Connection</h3>
        <pre><code>{`import { useEffect, useRef } from 'react'

function useWebSocketChat(roomId) {
  const ws = useRef(null)
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket(\`wss://api.example.com/chat/\${roomId}\`)

    ws.current.onopen = () => {
      console.log('Connected to chat')
      // Send join event
      ws.current.send(JSON.stringify({
        type: 'join',
        userId: currentUser.id
      }))
    }

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'message':
          setMessages(prev => [...prev, data.message])
          break
        case 'typing':
          setTypingUsers(prev => [...prev, data.userId])
          break
        case 'stop_typing':
          setTypingUsers(prev => prev.filter(id => id !== data.userId))
          break
        case 'user_joined':
          setOnlineUsers(prev => [...prev, data.userId])
          break
        case 'user_left':
          setOnlineUsers(prev => prev.filter(id => id !== data.userId))
          break
        case 'reaction':
          handleReaction(data.messageId, data.emoji, data.userId)
          break
      }
    }

    ws.current.onclose = () => {
      console.log('Disconnected from chat')
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [roomId])

  const sendMessage = (text) => {
    const message = {
      type: 'message',
      text,
      sender: currentUser,
      timestamp: new Date()
    }
    ws.current.send(JSON.stringify(message))
  }

  const sendTyping = () => {
    ws.current.send(JSON.stringify({ type: 'typing' }))
  }

  const sendReaction = (messageId, emoji) => {
    ws.current.send(JSON.stringify({
      type: 'reaction',
      messageId,
      emoji
    }))
  }

  return {
    messages,
    typingUsers,
    onlineUsers,
    sendMessage,
    sendTyping,
    sendReaction
  }
}`}</code></pre>

        <h3>Firebase Real-time Database</h3>
        <pre><code>{`import { ref, onValue, push, set, update } from 'firebase/database'
import { db } from './firebase'

function useFirebaseChat(roomId) {
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    // Listen to messages
    const messagesRef = ref(db, \`rooms/\${roomId}/messages\`)
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const messagesList = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg
        }))
        setMessages(messagesList)
      }
    })

    // Listen to online users
    const presenceRef = ref(db, \`rooms/\${roomId}/presence\`)
    const unsubscribePresence = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setOnlineUsers(Object.keys(data).filter(id => data[id].online))
      }
    })

    // Set user online
    const userPresenceRef = ref(db, \`rooms/\${roomId}/presence/\${currentUser.id}\`)
    set(userPresenceRef, {
      online: true,
      lastSeen: Date.now()
    })

    // Set user offline on disconnect
    onDisconnect(userPresenceRef).set({
      online: false,
      lastSeen: Date.now()
    })

    return () => {
      unsubscribeMessages()
      unsubscribePresence()
      set(userPresenceRef, { online: false, lastSeen: Date.now() })
    }
  }, [roomId])

  const sendMessage = (text) => {
    const messagesRef = ref(db, \`rooms/\${roomId}/messages\`)
    push(messagesRef, {
      text,
      sender: currentUser,
      timestamp: Date.now()
    })
  }

  const addReaction = (messageId, emoji) => {
    const reactionRef = ref(db, \`rooms/\${roomId}/messages/\${messageId}/reactions/\${emoji}\`)
    update(reactionRef, {
      [currentUser.id]: true
    })
  }

  return { messages, onlineUsers, sendMessage, addReaction }
}`}</code></pre>

        <h3>Socket.IO Implementation</h3>
        <pre><code>{`import { io } from 'socket.io-client'

function useSocketIOChat(roomId) {
  const socket = useRef(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.current = io('https://api.example.com')

    // Join room
    socket.current.emit('join-room', { roomId, user: currentUser })

    // Listen for messages
    socket.current.on('message', (message) => {
      setMessages(prev => [...prev, message])
    })

    // Listen for typing
    socket.current.on('typing', ({ userId }) => {
      setTypingUsers(prev => [...prev, userId])
    })

    socket.current.on('stop-typing', ({ userId }) => {
      setTypingUsers(prev => prev.filter(id => id !== userId))
    })

    // Listen for presence
    socket.current.on('user-joined', ({ userId }) => {
      setOnlineUsers(prev => [...prev, userId])
    })

    socket.current.on('user-left', ({ userId }) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId))
    })

    return () => {
      socket.current.disconnect()
    }
  }, [roomId])

  const sendMessage = (text) => {
    socket.current.emit('send-message', {
      roomId,
      text,
      sender: currentUser,
      timestamp: new Date()
    })
  }

  const emitTyping = () => {
    socket.current.emit('typing', { roomId })
  }

  return { messages, sendMessage, emitTyping }
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Advanced Features</h2>

        <h3>Message Threading</h3>
        <p>
          Allow users to reply to specific messages:
        </p>
        <pre><code>{`const [threads, setThreads] = useState({})

const replyToMessage = (parentId, text) => {
  const reply = {
    id: generateId(),
    text,
    sender: currentUser,
    timestamp: new Date(),
    parentId
  }

  setThreads(prev => ({
    ...prev,
    [parentId]: [...(prev[parentId] || []), reply]
  }))
}

// Render thread
{message.id in threads && (
  <div className="thread">
    {threads[message.id].map(reply => (
      <Message key={reply.id} {...reply} isThreaded />
    ))}
  </div>
)}`}</code></pre>

        <h3>User Mentions</h3>
        <p>
          Notify users when they're mentioned:
        </p>
        <pre><code>{`const parseMentions = (text) => {
  const mentionRegex = /@(\w+)/g
  const mentions = []
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    const username = match[1]
    const user = users.find(u => u.name.toLowerCase() === username.toLowerCase())
    if (user) {
      mentions.push(user.id)
    }
  }

  return mentions
}

const sendMessage = (text) => {
  const mentions = parseMentions(text)
  
  const message = {
    text,
    sender: currentUser,
    mentions,
    timestamp: new Date()
  }

  // Send notifications to mentioned users
  mentions.forEach(userId => {
    sendNotification(userId, \`\${currentUser.name} mentioned you\`)
  })

  setMessages(prev => [...prev, message])
}`}</code></pre>

        <h3>Search Messages</h3>
        <p>
          Search through message history:
        </p>
        <pre><code>{`const [searchQuery, setSearchQuery] = useState('')

const searchMessages = (query) => {
  return messages.filter(msg => 
    msg.text.toLowerCase().includes(query.toLowerCase()) ||
    msg.sender.name.toLowerCase().includes(query.toLowerCase())
  )
}

const results = searchMessages(searchQuery)

// Render search UI
<input
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search messages..."
/>
<SearchResults messages={results} />`}</code></pre>

        <h3>Message Editing</h3>
        <p>
          Allow users to edit their own messages:
        </p>
        <pre><code>{`const [editingMessageId, setEditingMessageId] = useState(null)

const startEditing = (messageId) => {
  setEditingMessageId(messageId)
}

const saveEdit = (messageId, newText) => {
  setMessages(prev => prev.map(msg => {
    if (msg.id === messageId) {
      return {
        ...msg,
        text: newText,
        edited: true,
        editedAt: new Date()
      }
    }
    return msg
  }))
  setEditingMessageId(null)
}

// Render edit UI
{message.isOwn && (
  <button onClick={() => startEditing(message.id)}>
    Edit
  </button>
)}

{editingMessageId === message.id && (
  <EditMessageInput
    initialValue={message.text}
    onSave={(text) => saveEdit(message.id, text)}
    onCancel={() => setEditingMessageId(null)}
  />
)}`}</code></pre>

        <h3>Presence Status</h3>
        <p>
          Show detailed user status (online, away, busy, offline):
        </p>
        <pre><code>{`const [userStatuses, setUserStatuses] = useState({})

const updateStatus = (userId, status) => {
  setUserStatuses(prev => ({
    ...prev,
    [userId]: {
      status,
      lastSeen: Date.now()
    }
  }))
}

const getStatusColor = (status) => {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'away': return 'bg-yellow-500'
    case 'busy': return 'bg-red-500'
    default: return 'bg-gray-400'
  }
}

// Render status indicator
<div className={\`status-indicator \${getStatusColor(userStatuses[user.id]?.status)}\`} />`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Performance Optimization</h2>

        <Callout type="tip" title="Virtualize Long Lists">
          For chats with thousands of messages, use virtualization libraries like
          react-window or react-virtuoso to only render visible messages.
        </Callout>

        <h3>Message Virtualization</h3>
        <pre><code>{`import { FixedSizeList } from 'react-window'

function VirtualizedMessages({ messages }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <Message {...messages[index]} />
    </div>
  )

  return (
    <FixedSizeList
      height={500}
      itemCount={messages.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}`}</code></pre>

        <h3>Lazy Loading</h3>
        <pre><code>{`const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(true)

const loadMoreMessages = async () => {
  const newMessages = await fetchMessages({ page, limit: 20 })
  
  if (newMessages.length === 0) {
    setHasMore(false)
    return
  }

  setMessages(prev => [...newMessages, ...prev])
  setPage(prev => prev + 1)
}

// Infinite scroll
const observerRef = useRef()

useEffect(() => {
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreMessages()
      }
    },
    { threshold: 1.0 }
  )

  if (observerRef.current) {
    observer.observe(observerRef.current)
  }

  return () => observer.disconnect()
}, [hasMore])`}</code></pre>

        <h3>Debounce Typing Indicators</h3>
        <pre><code>{`import { debounce } from 'lodash'

const sendTypingIndicator = debounce(() => {
  socket.emit('typing', { roomId, userId: currentUser.id })
}, 300)

const stopTypingIndicator = debounce(() => {
  socket.emit('stop-typing', { roomId, userId: currentUser.id })
}, 2000)

const handleInputChange = (text) => {
  if (text.length > 0) {
    sendTypingIndicator()
    stopTypingIndicator()
  }
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <Callout type="warning" title="Handle Connection Loss">
          Always handle disconnections gracefully. Queue messages locally and retry
          when connection is restored.
        </Callout>

        <h3>Connection Resilience</h3>
        <pre><code>{`const [isConnected, setIsConnected] = useState(true)
const [messageQueue, setMessageQueue] = useState([])

const sendMessage = (text) => {
  const message = {
    id: generateId(),
    text,
    sender: currentUser,
    timestamp: new Date(),
    pending: !isConnected
  }

  if (isConnected) {
    socket.emit('message', message)
    setMessages(prev => [...prev, message])
  } else {
    setMessageQueue(prev => [...prev, message])
    setMessages(prev => [...prev, { ...message, pending: true }])
  }
}

useEffect(() => {
  if (isConnected && messageQueue.length > 0) {
    messageQueue.forEach(msg => {
      socket.emit('message', msg)
      setMessages(prev => prev.map(m => 
        m.id === msg.id ? { ...m, pending: false } : m
      ))
    })
    setMessageQueue([])
  }
}, [isConnected, messageQueue])`}</code></pre>

        <h3>Security Considerations</h3>
        <ul>
          <li>Validate and sanitize all user input</li>
          <li>Authenticate users on the backend</li>
          <li>Rate limit message sending</li>
          <li>Encrypt sensitive data</li>
          <li>Implement proper authorization checks</li>
          <li>Prevent XSS attacks with proper escaping</li>
        </ul>

        <h3>UX Guidelines</h3>
        <ul>
          <li>Show connection status clearly</li>
          <li>Provide visual feedback for all actions</li>
          <li>Group messages by date</li>
          <li>Auto-scroll to new messages (with option to stay scrolled up)</li>
          <li>Show unread message count</li>
          <li>Implement message search</li>
          <li>Allow message deletion and editing</li>
          <li>Support keyboard shortcuts</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-messages" className="docs-card">
            <h3>useMessages Hook</h3>
            <p>Message state management</p>
          </a>
          <a href="/reference/components/message-input" className="docs-card">
            <h3>MessageInput</h3>
            <p>Rich input component</p>
          </a>
          <a href="/reference/components/typing-indicator" className="docs-card">
            <h3>TypingIndicator</h3>
            <p>Typing animation component</p>
          </a>
          <a href="/examples/realtime" className="docs-card">
            <h3>Real-time Example</h3>
            <p>WebSocket integration</p>
          </a>
        </div>
      </section>

      <section className="docs-section">
        <h2>Summary</h2>
        <p>
          You've learned how to build a complete multi-user chat application with:
        </p>
        <ul>
          <li>Real-time message synchronization</li>
          <li>User presence and typing indicators</li>
          <li>Message reactions and read receipts</li>
          <li>WebSocket, Firebase, and Socket.IO integration</li>
          <li>Advanced features like threading and mentions</li>
          <li>Performance optimization techniques</li>
          <li>Connection resilience and error handling</li>
        </ul>
        <p>
          This example provides a solid foundation for building production-ready chat
          applications with Clarity Chat Components.
        </p>
      </section>
    </div>
  )
}
