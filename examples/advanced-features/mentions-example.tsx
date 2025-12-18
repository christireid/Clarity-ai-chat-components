/**
 * Mention System Examples
 *
 * Demonstrates various patterns for implementing @mention functionality
 * with autocomplete, fuzzy search, and notification tracking.
 */

'use client'

import * as React from 'react'
import {
  MentionInput,
  MentionList,
  useMentions,
  ChatWindow,
} from '@clarity-chat/react'
import type { MentionableUser, Mention } from '@clarity-chat/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@clarity-chat/primitives'

// 💡 Type for chat messages with mentions (used in Example 4)
interface ChatMessageWithMentions {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  mentions?: Mention[]
}

// =============================================================================
// Example 1: Basic Mention Input with Autocomplete
// =============================================================================

/**
 * Basic mention input - type @ to trigger autocomplete
 */
export function BasicMentionExample() {
  const [value, setValue] = React.useState('')
  const [mentions, setMentions] = React.useState<Mention[]>([])

  const users: MentionableUser[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      username: 'alice',
      role: 'Developer',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      username: 'bob',
      role: 'Designer',
      isOnline: true,
    },
    {
      id: '3',
      name: 'Charlie Brown',
      username: 'charlie',
      role: 'Manager',
      isOnline: false,
    },
    {
      id: '4',
      name: 'Diana Prince',
      username: 'diana',
      role: 'Product',
      isOnline: true,
    },
  ]

  const handleSubmit = () => {
    console.log('Message:', value)
    console.log('Mentions:', mentions)

    // Send to backend
    // await fetch('/api/chat', { ... })

    // Clear input
    setValue('')
    setMentions([])
  }

  return (
    <div className="space-y-4 p-4 max-w-2xl">
      <h2 className="text-2xl font-bold">Basic Mention Input</h2>

      <Card>
        <CardContent className="pt-6">
          <MentionInput
            users={users}
            value={value}
            onChange={(newValue, extractedMentions) => {
              setValue(newValue)
              setMentions(extractedMentions)
            }}
            onSubmit={handleSubmit}
            placeholder="Type @ to mention someone..."
            mentionTrigger="@"
            enableFuzzySearch
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {mentions.length > 0 && (
                <span>
                  Mentioning: {mentions.length}{' '}
                  {mentions.length === 1 ? 'person' : 'people'}
                </span>
              )}
            </div>

            <Button onClick={handleSubmit}>Send</Button>
          </div>
        </CardContent>
      </Card>

      {mentions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Mentions</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm">{JSON.stringify(mentions, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// =============================================================================
// Example 2: Mention Inbox with useMentions Hook
// =============================================================================

/**
 * Complete mention system with inbox and state management
 */
export function MentionInboxExample() {
  const { mentions, unreadCount, addMention, markAsRead, markAllAsRead } =
    useMentions({
      onMentionAdded: (mention) => {
        console.log('New mention added:', mention)
        // Show notification
        // notify(`You were mentioned!`)
      },
      onMentionRead: (mention) => {
        console.log('Mention marked as read:', mention)
      },
    })

  const [messages] = React.useState([
    {
      id: 'msg-1',
      role: 'user' as const,
      content: 'Hey @alice, can you review this PR?',
      timestamp: Date.now() - 60000,
    },
    {
      id: 'msg-2',
      role: 'user' as const,
      content: "@alice @bob Let's discuss the new design",
      timestamp: Date.now() - 50000,
    },
    {
      id: 'msg-3',
      role: 'user' as const,
      content: 'Great work @alice!',
      timestamp: Date.now() - 40000,
    },
  ])

  const users: MentionableUser[] = [
    { id: 'alice', name: 'Alice Johnson', username: 'alice', isOnline: true },
    { id: 'bob', name: 'Bob Smith', username: 'bob', isOnline: true },
    {
      id: 'charlie',
      name: 'Charlie Brown',
      username: 'charlie',
      isOnline: false,
    },
  ]

  // Simulate mentions (in real app, these come from backend)
  React.useEffect(() => {
    const simulatedMentions: Mention[] = [
      {
        id: 'mention-1',
        userId: 'alice',
        messageId: 'msg-1',
        position: 4,
        length: 6,
        isRead: false,
        timestamp: Date.now() - 60000,
      },
      {
        id: 'mention-2',
        userId: 'alice',
        messageId: 'msg-2',
        position: 0,
        length: 6,
        isRead: false,
        timestamp: Date.now() - 50000,
      },
      {
        id: 'mention-3',
        userId: 'alice',
        messageId: 'msg-3',
        position: 11,
        length: 6,
        isRead: false,
        timestamp: Date.now() - 40000,
      },
    ]

    simulatedMentions.forEach(addMention)
  }, [addMention])

  const handleMentionClick = (mention: Mention) => {
    // Jump to message
    const element = document.getElementById(`message-${mention.messageId}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Mark as read
    markAsRead(mention.id)
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4 h-screen">
      {/* Main chat area */}
      <div className="col-span-2 space-y-4 overflow-auto">
        <h2 className="text-2xl font-bold">Messages</h2>

        {messages.map((message) => (
          <div key={message.id} id={`message-${message.id}`}>
            <Card>
              <CardContent className="pt-6">
                <p>{message.content}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Mention inbox sidebar */}
      <div className="overflow-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Mentions
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>

              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <MentionList
              mentions={mentions}
              messages={messages}
              users={users}
              currentUserId="alice"
              showOnlyUnread
              onMentionClick={handleMentionClick}
              onMarkAsRead={markAsRead}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// =============================================================================
// Example 3: Fuzzy Search Demonstration
// =============================================================================

/**
 * Shows fuzzy search in action - try typing partial names
 */
export function FuzzySearchExample() {
  const [value, setValue] = React.useState('')

  const users: MentionableUser[] = [
    { id: '1', name: 'Alice Johnson', username: 'alice', isOnline: true },
    { id: '2', name: 'Bob Smith', username: 'bob', isOnline: true },
    { id: '3', name: 'Charlie Brown', username: 'charlie', isOnline: false },
    { id: '4', name: 'Diana Prince', username: 'diana', isOnline: true },
    { id: '5', name: 'Eve Anderson', username: 'eve', isOnline: true },
    { id: '6', name: 'Frank Miller', username: 'frank', isOnline: false },
  ]

  return (
    <div className="space-y-4 p-4 max-w-2xl">
      <h2 className="text-2xl font-bold">Fuzzy Search Demo</h2>

      <Card>
        <CardHeader>
          <CardTitle>Try These Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>
              <code>@aj</code> → Alice Johnson
            </li>
            <li>
              <code>@bs</code> → Bob Smith
            </li>
            <li>
              <code>@dp</code> → Diana Prince
            </li>
            <li>
              <code>@alice</code> → Alice Johnson
            </li>
            <li>
              <code>@john</code> → Alice Johnson (matches "Johnson")
            </li>
            <li>
              <code>@char</code> → Charlie Brown
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <MentionInput
            users={users}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            placeholder="Type @ and start typing a name..."
            mentionTrigger="@"
            enableFuzzySearch
            maxSuggestions={5}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// Example 4: Complete Chat with Mentions
// =============================================================================

/**
 * Production-ready chat with mention system
 */
export function CompleteMentionChatExample() {
  const [messages, setMessages] = React.useState<ChatMessageWithMentions[]>([])
  const [inputValue, setInputValue] = React.useState('')

  const { mentions, unreadCount, addMention, markAsRead, extractMentions } =
    useMentions()

  const users: MentionableUser[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      username: 'alice',
      role: 'Developer',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      username: 'bob',
      role: 'Designer',
      isOnline: true,
    },
    {
      id: '3',
      name: 'Charlie Brown',
      username: 'charlie',
      role: 'Manager',
      isOnline: false,
    },
  ]

  const currentUserId = '1' // Alice

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Extract mentions from input
    const extractedMentions = extractMentions(inputValue, users)

    const messageId = `msg-${Date.now()}`
    const newMessage = {
      id: messageId,
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
      mentions: extractedMentions,
    }

    // Add message to UI
    setMessages((prev) => [...prev, newMessage])

    // Track mentions (in real app, backend would do this)
    extractedMentions.forEach((mention) => {
      // Only add to inbox if mentioning someone else
      if (mention.userId !== currentUserId) {
        addMention({
          id: `mention-${Date.now()}-${mention.userId}`,
          userId: mention.userId,
          messageId,
          position: mention.position,
          length: mention.length,
          isRead: false,
          timestamp: Date.now(),
        })
      }
    })

    // Send to backend
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          mentions: extractedMentions,
        }),
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    }

    // Clear input
    setInputValue('')
  }

  const handleMentionClick = (mention: Mention) => {
    // Jump to message
    const element = document.getElementById(`message-${mention.messageId}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Mark as read
    markAsRead(mention.id)
  }

  return (
    <div className="grid grid-cols-4 gap-4 h-screen p-4">
      {/* Mention inbox */}
      <div className="overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              Mentions
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MentionList
              mentions={mentions}
              messages={messages}
              users={users}
              currentUserId={currentUserId}
              showOnlyUnread
              onMentionClick={handleMentionClick}
              onMarkAsRead={markAsRead}
            />

            {mentions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No mentions yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main chat */}
      <div className="col-span-3 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div key={message.id} id={`message-${message.id}`}>
              <Card>
                <CardContent className="pt-6">
                  <p>{message.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                    {message.mentions && message.mentions.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {message.mentions.length}{' '}
                        {message.mentions.length === 1 ? 'mention' : 'mentions'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t pt-4">
          <MentionInput
            users={users}
            value={inputValue}
            onChange={(newValue) => setInputValue(newValue)}
            onSubmit={handleSendMessage}
            placeholder="Type @ to mention someone..."
            mentionTrigger="@"
            enableFuzzySearch
          />

          <Button onClick={handleSendMessage} className="mt-2 w-full">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Example 5: Advanced Configuration and Custom Rendering
// =============================================================================

/**
 * Advanced mention configuration with custom rendering
 */
export function AdvancedMentionExample() {
  const [value, setValue] = React.useState('')

  const users: MentionableUser[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      username: 'alice',
      role: 'Senior Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      username: 'bob',
      role: 'Lead Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      isOnline: true,
    },
    {
      id: '3',
      name: 'Charlie Brown',
      username: 'charlie',
      role: 'Product Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
      isOnline: false,
    },
  ]

  return (
    <div className="space-y-4 p-4 max-w-2xl">
      <h2 className="text-2xl font-bold">Advanced Mention Configuration</h2>

      <Card>
        <CardContent className="pt-6">
          <MentionInput
            users={users}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            placeholder="Type @ to mention..."
            mentionTrigger="@"
            enableFuzzySearch
            maxSuggestions={8}
            mentionClassName="bg-primary/20 text-primary font-medium rounded px-1"
            dropdownClassName="shadow-xl border-2 border-primary/20"
            renderUser={(user, isHighlighted) => (
              <div
                className={`flex items-center gap-3 p-2 rounded ${isHighlighted ? 'bg-accent' : ''}`}
              >
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    @{user.username}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.role && (
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  )}
                  {user.isOnline && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// Example 6: Backend Integration
// =============================================================================

/**
 * Production mention system with backend integration
 */
export function ProductionMentionExample() {
  const [inputValue, setInputValue] = React.useState('')
  const [users, setUsers] = React.useState<MentionableUser[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false)

  const { mentions, unreadCount, addMention, markAsRead, extractMentions } =
    useMentions()

  // Load users from backend
  React.useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingUsers(true)
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        setUsers(data.users)
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    loadUsers()
  }, [])

  // Load mentions from backend
  React.useEffect(() => {
    const loadMentions = async () => {
      try {
        const response = await fetch('/api/mentions')
        const data = await response.json()
        data.mentions.forEach(addMention)
      } catch (error) {
        console.error('Failed to load mentions:', error)
      }
    }

    loadMentions()
  }, [addMention])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const extractedMentions = extractMentions(inputValue, users)

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: inputValue,
          mentions: extractedMentions.map((m) => m.userId),
        }),
      })

      setInputValue('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleMarkAsRead = async (mentionId: string) => {
    try {
      await fetch(`/api/mentions/${mentionId}/read`, {
        method: 'POST',
      })

      markAsRead(mentionId)
    } catch (error) {
      console.error('Failed to mark mention as read:', error)
    }
  }

  if (isLoadingUsers) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4 p-4 max-w-2xl">
      <h2 className="text-2xl font-bold">Production Mention System</h2>

      <Card>
        <CardHeader>
          <CardTitle>
            Mentions
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>{/* Mention list would go here */}</CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <MentionInput
            users={users}
            value={inputValue}
            onChange={(newValue) => setInputValue(newValue)}
            onSubmit={handleSendMessage}
            placeholder="Type @ to mention someone..."
            mentionTrigger="@"
            enableFuzzySearch
          />

          <Button onClick={handleSendMessage} className="mt-2 w-full">
            Send
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// Usage Instructions
// =============================================================================

/**
 * To use these examples:
 *
 * 1. Basic Mention Input:
 *    - Simple @mention autocomplete
 *    - Good starting point
 *
 * 2. Mention Inbox:
 *    - Complete mention tracking
 *    - Unread management
 *    - Jump to message
 *
 * 3. Fuzzy Search:
 *    - Demonstrates smart user matching
 *    - Try different search patterns
 *
 * 4. Complete Chat:
 *    - Production-ready chat app
 *    - Mention extraction and tracking
 *    - Full integration example
 *
 * 5. Advanced Config:
 *    - Custom rendering
 *    - Styled dropdowns
 *    - User avatars and badges
 *
 * 6. Backend Integration:
 *    - API integration
 *    - Loading states
 *    - Error handling
 *
 * Choose the pattern that best fits your needs!
 */
