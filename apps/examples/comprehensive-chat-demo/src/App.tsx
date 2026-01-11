/**
 * Comprehensive Chat Demo
 *
 * Demonstrates modern AI chat features working together:
 * - Message display and sending
 * - Export functionality
 * - Search
 * - Citation display
 * - Token tracking
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  ChatWindow,
  useTokenTracker,
  useAutoScroll,
  CitationCard,
  TokenCounter,
  ExportDialog,
  ErrorBoundary,
  MessageSearch,
} from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'
import type { Message } from '@clarity-chat/types'

// Local Citation type that matches CitationCard props
interface Citation {
  id: string
  url: string
  title: string
  chunkText: string
  source: string
  metadata?: Record<string, unknown>
  confidence?: number
}

// Local type definitions for demo (not exported from library)
interface Conversation {
  id: string
  title: string
  preview: string
  timestamp: number
  messageCount: number
  isPinned?: boolean
  folderId?: string
}

// Local message type for internal tracking
interface LocalMessage {
  id: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

function ComprehensiveChatApp() {
  // Conversation management
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Getting Started',
      preview: 'Hello! How can I help you?',
      timestamp: Date.now() - 86400000,
      messageCount: 2,
      isPinned: true,
    },
    {
      id: '2',
      title: 'Quick Question',
      preview: 'What is React?',
      timestamp: Date.now() - 3600000,
      messageCount: 4,
    },
  ])
  const [activeConversationId, setActiveConversationId] = useState('1')
  const [showExport, setShowExport] = useState(false)
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Local message state management
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([
    {
      id: '1',
      chatId: '1',
      role: 'assistant',
      content:
        "Hello! I'm your comprehensive AI assistant. Try:\n- Sending messages\n- Using Ctrl+K for commands\n- Searching messages\n- Exporting conversations",
      timestamp: Date.now() - 5000,
    },
  ])

  // Add message function
  const addMessage = useCallback(
    (msg: Omit<LocalMessage, 'id' | 'timestamp'>) => {
      const newMsg: LocalMessage = {
        ...msg,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }
      setLocalMessages((prev) => [...prev, newMsg])
    },
    []
  )

  // Delete message function
  const deleteMessage = useCallback((messageId: string) => {
    setLocalMessages((prev) => prev.filter((m) => m.id !== messageId))
  }, [])

  // Edit message function
  const editMessage = useCallback((messageId: string, newContent: string) => {
    setLocalMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, content: newContent } : m))
    )
  }, [])

  // Convert to Message format
  const messages: Message[] = localMessages.map((msg) => ({
    id: msg.id,
    chatId: activeConversationId,
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Token tracking
  const { tokens, estimatedCost, addMessage: addTrackedMessage, clear: clearTokens } =
    useTokenTracker({
      modelName: 'gpt-4-turbo',
    })

  // Auto-scroll
  const { scrollRef } = useAutoScroll({
    dependencies: [messages],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Export (Ctrl+E)
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault()
        setShowExport(true)
      }
      // Toggle sidebar (Ctrl+B)
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        setShowSidebar((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle edit
  const handleEdit = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m.id === messageId)
      if (!message) return

      const newContent =
        prompt('Edit message:', message.content) || message.content
      if (newContent !== message.content) {
        editMessage(messageId, newContent)
      }
    },
    [messages, editMessage]
  )

  // Handle regenerate
  const handleRegenerate = useCallback(
    async (messageId: string) => {
      const message = messages.find((m) => m.id === messageId)
      if (!message || message.role !== 'assistant') return

      setIsLoading(true)
      try {
        const index = messages.findIndex((m) => m.id === messageId)
        const userMessage = messages[index - 1]

        if (userMessage && userMessage.role === 'user') {
          deleteMessage(messageId)
          await new Promise((resolve) => setTimeout(resolve, 300))

          const responseContent = `[Regenerated] You said: "${userMessage.content}". This is a regenerated response.`

          addMessage({
            chatId: activeConversationId,
            role: 'assistant',
            content: responseContent,
          })

          // Track output tokens
          const tokenEstimate = Math.ceil(responseContent.length / 4)
          addTrackedMessage({ role: 'assistant', content: responseContent, tokens: tokenEstimate })
        }
      } finally {
        setIsLoading(false)
      }
    },
    [messages, deleteMessage, addMessage, activeConversationId, addTrackedMessage]
  )

  // Handle delete
  const handleDelete = useCallback(
    (messageId: string) => {
      if (confirm('Delete this message?')) {
        deleteMessage(messageId)
      }
    },
    [deleteMessage]
  )

  // Handle send
  const handleSend = useCallback(
    async (content: string) => {
      addMessage({
        chatId: activeConversationId,
        role: 'user',
        content,
      })

      // Track input tokens
      const userTokenEstimate = Math.ceil(content.length / 4)
      addTrackedMessage({ role: 'user', content, tokens: userTokenEstimate })

      // Update conversation preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                preview: content.slice(0, 50),
                messageCount: c.messageCount + 1,
              }
            : c
        )
      )

      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const responseContent = `You said: "${content}". This is a comprehensive demo response.`

        addMessage({
          chatId: activeConversationId,
          role: 'assistant',
          content: responseContent,
        })

        // Track output tokens
        const aiTokenEstimate = Math.ceil(responseContent.length / 4)
        addTrackedMessage({ role: 'assistant', content: responseContent, tokens: aiTokenEstimate })
      } finally {
        setIsLoading(false)
      }
    },
    [addMessage, activeConversationId, addTrackedMessage]
  )

  // Handle export
  const handleExport = useCallback(
    async (options: { format?: string }) => {
      const format = options.format || 'markdown'
      let content = ''

      if (format === 'markdown') {
        content = messages
          .map(
            (m) =>
              `## ${m.role === 'user' ? 'User' : 'Assistant'}\n\n${m.content}`
          )
          .join('\n\n---\n\n')
      } else if (format === 'json') {
        content = JSON.stringify(messages, null, 2)
      } else {
        content = messages
          .map(
            (m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
          )
          .join('\n\n')
      }

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `conversation-${Date.now()}.${format}`
      a.click()
      URL.revokeObjectURL(url)

      setShowExport(false)
    },
    [messages]
  )

  // Filter messages by search
  const displayMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages

  // Sample citations (for demo)
  const sampleCitations: Citation[] = [
    {
      id: '1',
      url: 'https://example.com/doc1',
      title: 'Documentation Example',
      chunkText:
        'This is a sample citation from a document. It provides context for the AI response.',
      source: 'docs',
      metadata: { page: 1 },
      confidence: 0.95,
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'white',
      }}
    >
      {/* Sidebar */}
      {showSidebar && (
        <div
          style={{
            width: '300px',
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
              Conversations
            </h2>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem' }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  background:
                    conv.id === activeConversationId ? '#f3f4f6' : 'transparent',
                  marginBottom: '0.25rem',
                }}
              >
                <div style={{ fontWeight: 500 }}>
                  {conv.isPinned && '📌 '}
                  {conv.title}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {conv.preview}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div
          style={{
            padding: '1rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
              Comprehensive Chat Demo
            </h1>
            <p
              style={{
                margin: '0.25rem 0 0',
                fontSize: '0.875rem',
                color: '#6b7280',
              }}
            >
              All features working together
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Export */}
            <button
              onClick={() => setShowExport(true)}
              style={{
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Export
            </button>

            {/* Token counter */}
            <TokenCounter />

            {/* Sidebar toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{
                padding: '0.5rem',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
              title="Toggle Sidebar (Ctrl+B)"
            >
              {showSidebar ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
        </div>

        {/* Chat window */}
        <div ref={scrollRef as React.RefObject<HTMLDivElement>} style={{ flex: 1, overflow: 'auto' }}>
          <ChatWindow
            messages={displayMessages}
            isLoading={isLoading}
            onSendMessage={handleSend}
            onEditMessage={handleEdit}
            onRegenerateMessage={handleRegenerate}
            onDeleteMessage={handleDelete}
          />

          {/* Citations (demo) */}
          {messages.length > 0 &&
            messages[messages.length - 1].role === 'assistant' && (
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <h3
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                  }}
                >
                  Sources:
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  {sampleCitations.map((citation) => (
                    <CitationCard
                      key={citation.id}
                      citation={citation}
                      showConfidence
                      onSourceClick={(url) => window.open(url, '_blank')}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Export Dialog */}
      {showExport && (
        <ExportDialog
          open={showExport}
          onOpenChange={setShowExport}
          onExport={handleExport}
          resourceType="chat"
          resourceName="Comprehensive Chat Conversation"
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              color: '#dc2626',
              fontSize: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Reload Page
          </button>
        </div>
      )}
    >
      <ComprehensiveChatApp />
    </ErrorBoundary>
  )
}
