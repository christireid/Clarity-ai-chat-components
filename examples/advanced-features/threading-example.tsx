/**
 * Message Threading Examples
 *
 * Demonstrates various patterns for implementing Slack-style message threading
 * in chat applications using the MessageThreadView and ThreadList components.
 */

'use client'

import * as React from 'react'
import {
  MessageThreadView,
import { SecureLogger } from '@/lib/security/secureLogger';
  ThreadList,
  ChatWindow,
  Message,
} from '@clarity-chat/react'
import type { Thread, ThreadViewConfig } from '@clarity-chat/react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@clarity-chat/primitives'

import { SecureLogger } from '@/lib/security/secureLogger';
// =============================================================================
// Example 1: Basic Inline Threading
// =============================================================================

/**
 * Basic inline threading - threads appear directly below parent messages
 */
export function BasicThreadingExample() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'What are the best practices for React hooks?',
      timestamp: Date.now() - 60000,
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Here are the key React hooks best practices...',
      timestamp: Date.now() - 50000,
    },
  ])

  const [threads, setThreads] = React.useState<Thread[]>([])

  const handleCreateThread = (parentMessageId: string) => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      parentMessageId,
      messages: [],
      participants: [],
      unreadCount: 0,
      lastActivity: Date.now(),
      isArchived: false,
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    }

    setThreads(prev => [...prev, newThread])
  }

  const handleThreadReply = (threadId: string, content: string) => {
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'user',
          content,
          timestamp: Date.now(),
        }

        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          lastActivity: Date.now(),
          metadata: {
            ...thread.metadata,
            updatedAt: Date.now(),
          },
        }
      }
      return thread
    }))
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Basic Inline Threading</h2>

      <div className="space-y-4">
        {messages.map(message => {
          const thread = threads.find(t => t.parentMessageId === message.id)

          return (
            <div key={message.id}>
              <Message message={message} />

              <MessageThreadView
                parentMessage={message}
                thread={thread}
                config={{
                  maxDepth: 3,
                  showPreview: true,
                  previewLength: 100,
                  collapseThreshold: 10,
                  notificationsEnabled: true,
                }}
                onSendMessage={(content) => {
                  if (thread) {
                    handleThreadReply(thread.id, content)
                  }
                }}
                onCreateThread={() => handleCreateThread(message.id)}
                layout="inline"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Example 2: Sidebar Threading (Like Slack)
// =============================================================================

/**
 * Sidebar threading - threads open in a separate panel
 * More suitable for desktop applications
 */
export function SidebarThreadingExample() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'How do I optimize React performance?',
      timestamp: Date.now() - 60000,
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Here are key performance optimization techniques...',
      timestamp: Date.now() - 50000,
    },
  ])

  const [threads, setThreads] = React.useState<Thread[]>([])
  const [selectedThread, setSelectedThread] = React.useState<Thread | null>(null)

  const handleCreateThread = (parentMessageId: string) => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      parentMessageId,
      messages: [],
      participants: [],
      unreadCount: 0,
      lastActivity: Date.now(),
      isArchived: false,
    }

    setThreads(prev => [...prev, newThread])
    setSelectedThread(newThread)
  }

  const handleThreadReply = (content: string) => {
    if (!selectedThread) return

    setThreads(prev => prev.map(thread => {
      if (thread.id === selectedThread.id) {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'user',
          content,
          timestamp: Date.now(),
        }

        const updatedThread = {
          ...thread,
          messages: [...thread.messages, newMessage],
          lastActivity: Date.now(),
        }

        setSelectedThread(updatedThread)
        return updatedThread
      }
      return thread
    }))
  }

  return (
    <div className="grid grid-cols-3 gap-4 h-screen p-4">
      {/* Main conversation */}
      <div className="col-span-2 space-y-4 overflow-auto">
        <h2 className="text-2xl font-bold">Sidebar Threading</h2>

        {messages.map(message => {
          const thread = threads.find(t => t.parentMessageId === message.id)

          return (
            <div key={message.id}>
              <Message message={message} />

              {thread && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedThread(thread)}
                  className="mt-2"
                >
                  {thread.messages.length} {thread.messages.length === 1 ? 'reply' : 'replies'}
                  {thread.unreadCount > 0 && (
                    <span className="ml-2 text-destructive">
                      ({thread.unreadCount} new)
                    </span>
                  )}
                </Button>
              )}

              {!thread && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCreateThread(message.id)}
                  className="mt-2"
                >
                  Start thread
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Thread sidebar */}
      <div className="border-l pl-4 overflow-auto">
        {selectedThread ? (
          <MessageThreadView
            parentMessage={messages.find(m => m.id === selectedThread.parentMessageId)!}
            thread={selectedThread}
            config={{
              maxDepth: 5,
              showPreview: false,
              previewLength: 0,
              collapseThreshold: 20,
              notificationsEnabled: true,
            }}
            onSendMessage={handleThreadReply}
            onCreateThread={() => {}}
            layout="sidebar"
            onClose={() => setSelectedThread(null)}
          />
        ) : (
          <div className="text-center text-muted-foreground mt-8">
            Select a thread to view
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Example 3: Thread Browser with ThreadList
// =============================================================================

/**
 * Thread list component for browsing and searching threads
 */
export function ThreadBrowserExample() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'How do I implement authentication?',
      timestamp: Date.now() - 120000,
    },
    {
      id: '2',
      role: 'user',
      content: 'What is the best state management solution?',
      timestamp: Date.now() - 100000,
    },
    {
      id: '3',
      role: 'user',
      content: 'How do I deploy to production?',
      timestamp: Date.now() - 80000,
    },
  ])

  const [threads, setThreads] = React.useState<Thread[]>([
    {
      id: 'thread-1',
      parentMessageId: '1',
      messages: [
        {
          id: 'msg-1',
          role: 'assistant',
          content: 'For authentication, I recommend...',
          timestamp: Date.now() - 115000,
        },
        {
          id: 'msg-2',
          role: 'user',
          content: 'Thanks! What about OAuth?',
          timestamp: Date.now() - 110000,
        },
      ],
      participants: [
        { id: 'user-1', name: 'Alice', joinedAt: Date.now() - 115000 },
        { id: 'user-2', name: 'Bob', joinedAt: Date.now() - 110000 },
      ],
      unreadCount: 1,
      lastActivity: Date.now() - 110000,
      isArchived: false,
    },
    {
      id: 'thread-2',
      parentMessageId: '2',
      messages: [
        {
          id: 'msg-3',
          role: 'assistant',
          content: 'Popular state management options include...',
          timestamp: Date.now() - 95000,
        },
      ],
      participants: [
        { id: 'user-1', name: 'Alice', joinedAt: Date.now() - 95000 },
      ],
      unreadCount: 0,
      lastActivity: Date.now() - 95000,
      isArchived: false,
    },
  ])

  const handleSelectThread = (thread: Thread) => {
    SecureLogger.debug('Selected thread:', thread)
    // Mark thread as read
    setThreads(prev => prev.map(t =>
      t.id === thread.id ? { ...t, unreadCount: 0 } : t
    ))
  }

  const handleArchiveThread = (threadId: string) => {
    setThreads(prev => prev.map(t =>
      t.id === threadId ? { ...t, isArchived: true } : t
    ))
  }

  return (
    <div className="grid grid-cols-3 gap-4 h-screen p-4">
      {/* Main conversation */}
      <div className="col-span-2 space-y-4 overflow-auto">
        <h2 className="text-2xl font-bold">Thread Browser</h2>

        {messages.map(message => (
          <div key={message.id}>
            <Message message={message} />
          </div>
        ))}
      </div>

      {/* Thread list sidebar */}
      <div className="overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Threads</CardTitle>
          </CardHeader>
          <CardContent>
            <ThreadList
              threads={threads}
              parentMessages={messages}
              onSelectThread={handleSelectThread}
              onArchiveThread={handleArchiveThread}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// =============================================================================
// Example 4: Complete Threading Setup with Backend Integration
// =============================================================================

/**
 * Production-ready threading with backend integration
 */
export function ProductionThreadingExample() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [threads, setThreads] = React.useState<Thread[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  // Load threads from backend
  React.useEffect(() => {
    const loadThreads = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/threads')
        const data = await response.json()
        setThreads(data.threads)
        setMessages(data.messages)
      } catch (error) {
        SecureLogger.error('Failed to load threads:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadThreads()
  }, [])

  const handleCreateThread = async (parentMessageId: string) => {
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentMessageId }),
      })

      const newThread = await response.json()
      setThreads(prev => [...prev, newThread])
    } catch (error) {
      SecureLogger.error('Failed to create thread:', error)
    }
  }

  const handleThreadReply = async (threadId: string, content: string) => {
    try {
      const response = await fetch(`/api/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const newMessage = await response.json()

      setThreads(prev => prev.map(thread => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: [...thread.messages, newMessage],
            lastActivity: Date.now(),
          }
        }
        return thread
      }))
    } catch (error) {
      SecureLogger.error('Failed to send thread reply:', error)
    }
  }

  const handleMarkThreadRead = async (threadId: string) => {
    try {
      await fetch(`/api/threads/${threadId}/read`, {
        method: 'POST',
      })

      setThreads(prev => prev.map(thread =>
        thread.id === threadId ? { ...thread, unreadCount: 0 } : thread
      ))
    } catch (error) {
      SecureLogger.error('Failed to mark thread as read:', error)
    }
  }

  if (isLoading) {
    return <div>Loading threads...</div>
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Production Threading</h2>

      <div className="space-y-4">
        {messages.map(message => {
          const thread = threads.find(t => t.parentMessageId === message.id)

          return (
            <div key={message.id}>
              <Message message={message} />

              <MessageThreadView
                parentMessage={message}
                thread={thread}
                config={{
                  maxDepth: 3,
                  showPreview: true,
                  previewLength: 150,
                  collapseThreshold: 15,
                  notificationsEnabled: true,
                }}
                onSendMessage={(content) => {
                  if (thread) {
                    handleThreadReply(thread.id, content)
                  }
                }}
                onCreateThread={() => handleCreateThread(message.id)}
                onThreadExpand={() => {
                  if (thread && thread.unreadCount > 0) {
                    handleMarkThreadRead(thread.id)
                  }
                }}
                layout="inline"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Example 5: Advanced Configuration
// =============================================================================

/**
 * Advanced threading configuration with custom behavior
 */
export function AdvancedThreadingExample() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [threads, setThreads] = React.useState<Thread[]>([])

  const advancedConfig: ThreadViewConfig = {
    maxDepth: 5,              // Allow deeper nesting
    showPreview: true,
    previewLength: 200,       // Longer previews
    collapseThreshold: 5,     // Collapse sooner
    notificationsEnabled: true,
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Advanced Threading Configuration</h2>

      <div className="space-y-4">
        {messages.map(message => {
          const thread = threads.find(t => t.parentMessageId === message.id)

          return (
            <div key={message.id}>
              <Message message={message} />

              <MessageThreadView
                parentMessage={message}
                thread={thread}
                config={advancedConfig}
                onSendMessage={(content) => {
                  // Custom send logic
                  SecureLogger.debug('Sending to thread:', thread?.id, content)
                }}
                onCreateThread={() => {
                  // Custom thread creation
                  SecureLogger.debug('Creating thread for:', message.id)
                }}
                onThreadExpand={() => {
                  SecureLogger.debug('Thread expanded:', thread?.id)
                }}
                onThreadCollapse={() => {
                  SecureLogger.debug('Thread collapsed:', thread?.id)
                }}
                layout="inline"
                className="custom-thread-styling"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Usage Instructions
// =============================================================================

/**
 * To use these examples:
 *
 * 1. Basic Inline Threading:
 *    - Good for: Simple conversations, mobile apps
 *    - Threads appear directly below parent messages
 *
 * 2. Sidebar Threading:
 *    - Good for: Desktop apps, complex discussions
 *    - Threads open in separate panel like Slack
 *
 * 3. Thread Browser:
 *    - Good for: Reviewing past threads, search/discovery
 *    - ThreadList component for navigation
 *
 * 4. Production Setup:
 *    - Good for: Real applications with backend
 *    - Includes API integration, error handling
 *
 * 5. Advanced Config:
 *    - Good for: Custom requirements
 *    - Shows all configuration options
 *
 * Choose the pattern that best fits your use case!
 */
