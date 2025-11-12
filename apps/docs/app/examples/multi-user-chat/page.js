import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LiveDemo } from '@/components/Demo/LiveDemo';
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'Multi-user Chat Example - Clarity Chat Components',
    description: 'Complete multi-user chat application with typing indicators, presence, reactions, and real-time updates.',
};
export default function MultiUserChatExamplePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Example" }), _jsx("span", { className: "docs-badge", children: "Advanced" }), _jsx("h1", { children: "Multi-user Chat" }), _jsx("p", { className: "docs-lead", children: "Build a complete multi-user chat application with typing indicators, user presence, reactions, message threading, and real-time synchronization." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "This example demonstrates a production-ready multi-user chat application with all the features you'd expect from modern chat platforms like Slack, Discord, or Microsoft Teams." }), _jsx("h3", { children: "Features Included" }), _jsxs("ul", { children: [_jsx("li", { children: "Multiple user simulation" }), _jsx("li", { children: "Real-time typing indicators" }), _jsx("li", { children: "User presence (online/away/offline)" }), _jsx("li", { children: "Message reactions" }), _jsx("li", { children: "User avatars and profiles" }), _jsx("li", { children: "Message timestamps" }), _jsx("li", { children: "Read receipts" }), _jsx("li", { children: "Smooth animations" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Complete Implementation" }), _jsx(LiveDemo, { title: "Multi-user Chat Application", code: `import { ChatWindow, Message, MessageInput, TypingIndicator } from '@clarity-chat/react'
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

export default MultiUserChat`, height: "750px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step-by-Step Breakdown" }), _jsx("h3", { children: "1. User State Management" }), _jsx("p", { children: "Track all users in the chat with their online status:" }), _jsx("pre", { children: _jsx("code", { children: `const [users, setUsers] = useState([
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
}` }) }), _jsx("h3", { children: "2. Typing Indicators" }), _jsx("p", { children: "Show when users are composing messages:" }), _jsx("pre", { children: _jsx("code", { children: `const [typingUsers, setTypingUsers] = useState([])

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
)}` }) }), _jsx("h3", { children: "3. Message Reactions" }), _jsx("p", { children: "Allow users to react to messages with emojis:" }), _jsx("pre", { children: _jsx("code", { children: `const handleReaction = (messageId, emoji) => {
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
}` }) }), _jsx("h3", { children: "4. Read Receipts" }), _jsx("p", { children: "Track which users have seen each message:" }), _jsx("pre", { children: _jsx("code", { children: `// Mark messages as read
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
)}` }) }), _jsx("h3", { children: "5. Avatar Grouping" }), _jsx("p", { children: "Group consecutive messages from the same user:" }), _jsx("pre", { children: _jsx("code", { children: `const showAvatar = (index) => {
  if (index === 0) return true
  return messages[index - 1].sender.id !== messages[index].sender.id
}

// In render
{showAvatar(index) ? (
  <Avatar user={message.sender} />
) : (
  <div className="avatar-spacer" />
)}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Real-time Integration" }), _jsx("h3", { children: "WebSocket Connection" }), _jsx("pre", { children: _jsx("code", { children: `import { useEffect, useRef } from 'react'

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
}` }) }), _jsx("h3", { children: "Firebase Real-time Database" }), _jsx("pre", { children: _jsx("code", { children: `import { ref, onValue, push, set, update } from 'firebase/database'
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
}` }) }), _jsx("h3", { children: "Socket.IO Implementation" }), _jsx("pre", { children: _jsx("code", { children: `import { io } from 'socket.io-client'

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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Features" }), _jsx("h3", { children: "Message Threading" }), _jsx("p", { children: "Allow users to reply to specific messages:" }), _jsx("pre", { children: _jsx("code", { children: `const [threads, setThreads] = useState({})

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
)}` }) }), _jsx("h3", { children: "User Mentions" }), _jsx("p", { children: "Notify users when they're mentioned:" }), _jsx("pre", { children: _jsx("code", { children: `const parseMentions = (text) => {
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
}` }) }), _jsx("h3", { children: "Search Messages" }), _jsx("p", { children: "Search through message history:" }), _jsx("pre", { children: _jsx("code", { children: `const [searchQuery, setSearchQuery] = useState('')

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
<SearchResults messages={results} />` }) }), _jsx("h3", { children: "Message Editing" }), _jsx("p", { children: "Allow users to edit their own messages:" }), _jsx("pre", { children: _jsx("code", { children: `const [editingMessageId, setEditingMessageId] = useState(null)

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
)}` }) }), _jsx("h3", { children: "Presence Status" }), _jsx("p", { children: "Show detailed user status (online, away, busy, offline):" }), _jsx("pre", { children: _jsx("code", { children: `const [userStatuses, setUserStatuses] = useState({})

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
<div className={\`status-indicator \${getStatusColor(userStatuses[user.id]?.status)}\`} />` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Performance Optimization" }), _jsx(Callout, { type: "tip", title: "Virtualize Long Lists", children: "For chats with thousands of messages, use virtualization libraries like react-window or react-virtuoso to only render visible messages." }), _jsx("h3", { children: "Message Virtualization" }), _jsx("pre", { children: _jsx("code", { children: `import { FixedSizeList } from 'react-window'

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
}` }) }), _jsx("h3", { children: "Lazy Loading" }), _jsx("pre", { children: _jsx("code", { children: `const [page, setPage] = useState(1)
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
}, [hasMore])` }) }), _jsx("h3", { children: "Debounce Typing Indicators" }), _jsx("pre", { children: _jsx("code", { children: `import { debounce } from 'lodash'

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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx(Callout, { type: "warning", title: "Handle Connection Loss", children: "Always handle disconnections gracefully. Queue messages locally and retry when connection is restored." }), _jsx("h3", { children: "Connection Resilience" }), _jsx("pre", { children: _jsx("code", { children: `const [isConnected, setIsConnected] = useState(true)
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
}, [isConnected, messageQueue])` }) }), _jsx("h3", { children: "Security Considerations" }), _jsxs("ul", { children: [_jsx("li", { children: "Validate and sanitize all user input" }), _jsx("li", { children: "Authenticate users on the backend" }), _jsx("li", { children: "Rate limit message sending" }), _jsx("li", { children: "Encrypt sensitive data" }), _jsx("li", { children: "Implement proper authorization checks" }), _jsx("li", { children: "Prevent XSS attacks with proper escaping" })] }), _jsx("h3", { children: "UX Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Show connection status clearly" }), _jsx("li", { children: "Provide visual feedback for all actions" }), _jsx("li", { children: "Group messages by date" }), _jsx("li", { children: "Auto-scroll to new messages (with option to stay scrolled up)" }), _jsx("li", { children: "Show unread message count" }), _jsx("li", { children: "Implement message search" }), _jsx("li", { children: "Allow message deletion and editing" }), _jsx("li", { children: "Support keyboard shortcuts" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/hooks/use-messages", className: "docs-card", children: [_jsx("h3", { children: "useMessages Hook" }), _jsx("p", { children: "Message state management" })] }), _jsxs("a", { href: "/reference/components/message-input", className: "docs-card", children: [_jsx("h3", { children: "MessageInput" }), _jsx("p", { children: "Rich input component" })] }), _jsxs("a", { href: "/reference/components/typing-indicator", className: "docs-card", children: [_jsx("h3", { children: "TypingIndicator" }), _jsx("p", { children: "Typing animation component" })] }), _jsxs("a", { href: "/examples/realtime", className: "docs-card", children: [_jsx("h3", { children: "Real-time Example" }), _jsx("p", { children: "WebSocket integration" })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Summary" }), _jsx("p", { children: "You've learned how to build a complete multi-user chat application with:" }), _jsxs("ul", { children: [_jsx("li", { children: "Real-time message synchronization" }), _jsx("li", { children: "User presence and typing indicators" }), _jsx("li", { children: "Message reactions and read receipts" }), _jsx("li", { children: "WebSocket, Firebase, and Socket.IO integration" }), _jsx("li", { children: "Advanced features like threading and mentions" }), _jsx("li", { children: "Performance optimization techniques" }), _jsx("li", { children: "Connection resilience and error handling" })] }), _jsx("p", { children: "This example provides a solid foundation for building production-ready chat applications with Clarity Chat Components." })] })] }));
}
//# sourceMappingURL=page.js.map