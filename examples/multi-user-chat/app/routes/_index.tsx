import { useState, useEffect, useRef } from 'react'
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { JoinForm } from '~/components/JoinForm'
import { UserList } from '~/components/UserList'
import { connectSocket, disconnectSocket, getSocket } from '~/lib/socket.client'

interface User {
  id: string
  username: string
  room: string
  joinedAt: number
}

export default function Index() {
  const [joined, setJoined] = useState(false)
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (joined) {
      socketRef.current = connectSocket()
      const socket = socketRef.current

      socket.on('user_joined', ({ user, users: roomUsers }: { user: User; users: User[] }) => {
        setUsers(roomUsers)
        if (user.id !== socket.id) {
          const systemMessage: Message = {
            id: `system-${Date.now()}`,
            role: 'system',
            content: `${user.username} joined the room`,
            timestamp: Date.now(),
          }
          setMessages((prev) => [...prev, systemMessage])
        }
      })

      socket.on('user_left', ({ user, users: roomUsers }: { user: User; users: User[] }) => {
        setUsers(roomUsers)
        const systemMessage: Message = {
          id: `system-${Date.now()}`,
          role: 'system',
          content: `${user.username} left the room`,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, systemMessage])
      })

      socket.on('new_message', (message: Message & { username: string }) => {
        const formattedMessage: Message = {
          ...message,
          // Add username to content if it's from another user
          content: message.username !== username 
            ? `**${message.username}**: ${message.content}`
            : message.content,
        }
        setMessages((prev) => [...prev, formattedMessage])
      })

      socket.on('user_typing', ({ username: typingUsername }: { username: string }) => {
        setTypingUser(typingUsername)
      })

      socket.on('user_stopped_typing', () => {
        setTypingUser(null)
      })

      return () => {
        disconnectSocket()
      }
    }
  }, [joined, username])

  const handleJoin = ({ username: newUsername, room: newRoom }: { username: string; room: string }) => {
    setUsername(newUsername)
    setRoom(newRoom)
    setJoined(true)

    // Join room after state is set
    setTimeout(() => {
      const socket = getSocket()
      socket.emit('join', { username: newUsername, room: newRoom })
      
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'system',
        content: `Welcome to the ${newRoom} room! You can chat with other users here.`,
        timestamp: Date.now(),
      }
      setMessages([welcomeMessage])
    }, 100)
  }

  const handleSendMessage = (content: string) => {
    const socket = socketRef.current
    if (socket) {
      socket.emit('send_message', { room, message: content })
      
      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      socket.emit('typing_stop', { room })
    }
  }

  const handleInputChange = () => {
    const socket = socketRef.current
    if (socket) {
      socket.emit('typing_start', { room })
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { room })
      }, 1000)
    }
  }

  if (!joined) {
    return (
      <main style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
      }}>
        <JoinForm onJoin={handleJoin} />
      </main>
    )
  }

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '1rem',
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
        }}>
          Multi-User Chat - {room}
        </h1>
        <p style={{
          color: 'var(--foreground)',
          opacity: 0.7,
          fontSize: '0.875rem',
        }}>
          Chatting as {username}
          {typingUser && ` • ${typingUser} is typing...`}
        </p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '1200px',
        height: '600px',
        border: '1px solid rgba(128, 128, 128, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
      }}>
        <div style={{ flex: 1 }}>
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onInputChange={handleInputChange}
          />
        </div>
        <UserList users={users} currentUserId={socketRef.current?.id || ''} />
      </div>
    </main>
  )
}
