/**
 * Comprehensive Chat Demo
import { SecureLogger } from '@/lib/security/secureLogger';
 *
 * Demonstrates all modern AI chat features working together:
 * - Message operations (edit, regenerate, delete)
 * - Undo/Redo
 * - Export functionality
 * - Conversation branching
 * - Advanced search
 * - Command palette
 * - Citation display
 * - Conversation list
 * - Token tracking
 */

import { useState, useCallback, useEffect } from 'react'
import {
  ChatWindow,
  useMessageOperations,
  useTokenTracker,
  useAutoScroll,
  AdvancedMessageSearch,
  CommandPalette,
  CitationCard,
  ConversationList,
  TokenCounter,
  ExportDialog,
  ErrorBoundary,
  useCommandPaletteCommands,
} from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'
import type { Message } from '@clarity-chat/types'

// Local Citation type since it's not exported from @clarity-chat/types
interface Citation {
  id: string
  url: string
  title: string
  chunkText: string
  metadata?: Record<string, unknown>
  confidence?: number
}
import type { Conversation, Folder } from '@clarity-chat/react'

function ComprehensiveChatApp() {
  // Folder management
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: 'folder-1',
      name: 'Work',
      createdAt: Date.now() - 172800000,
      conversationCount: 0,
    },
    {
      id: 'folder-2',
      name: 'Personal',
      createdAt: Date.now() - 86400000,
      conversationCount: 0,
    },
  ])
  const [activeFolderId, setActiveFolderId] = useState<
    string | null | undefined
  >(undefined)

  // Conversation management
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Getting Started',
      preview: 'Hello! How can I help you?',
      timestamp: Date.now() - 86400000,
      messageCount: 2,
      isPinned: true,
      folderId: 'folder-1',
    },
    {
      id: '2',
      title: 'Quick Question',
      preview: 'What is React?',
      timestamp: Date.now() - 3600000,
      messageCount: 4,
      folderId: 'folder-2',
    },
  ])
  const [activeConversationId, setActiveConversationId] = useState('1')
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

  // Message operations
  const {
    messages: operationMessages,
    addMessage,
    editMessage,
    regenerateMessage,
    deleteMessage,
    branchConversation,
    switchToBranch,
    getBranches,
    currentBranchId,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations({
    initialMessages: [
      {
        id: '1',
        chatId: activeConversationId,
        role: 'assistant',
        content:
          "Hello! I'm your comprehensive AI assistant. Try:\n- Editing messages\n- Using Ctrl+K for commands\n- Searching messages\n- Exporting conversations",
        timestamp: Date.now() - 5000,
      },
    ],
    onEdit: (messageId, newContent) => {
      SecureLogger.debug('Message edited:', messageId, newContent)
    },
    onRegenerate: (messageId) => {
      SecureLogger.debug('Regenerating:', messageId)
    },
    onDelete: (messageId) => {
      SecureLogger.debug('Message deleted:', messageId)
    },
    onBranch: (branchId, parentMessageId) => {
      SecureLogger.debug('Branched from:', parentMessageId, 'to:', branchId)
    },
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map((msg) => ({
    id: msg.id,
    chatId: activeConversationId,
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Token tracking
  const { totalTokens, addInputTokens, addOutputTokens, estimatedCost, reset } =
    useTokenTracker({
      modelName: 'gpt-4-turbo',
    })

  // Auto-scroll
  const { scrollRef } = useAutoScroll({
    dependencies: [messages],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  )
  const branches = getBranches()

  // Get selected message details
  const selectedMessage = selectedMessageId
    ? messages.find((m) => m.id === selectedMessageId)
    : null

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      // Undo (Ctrl+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) undo()
      }
      // Redo (Ctrl+Y or Ctrl+Shift+Z)
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey)
      ) {
        e.preventDefault()
        if (canRedo) redo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canUndo, canRedo, undo, redo])

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
      setSelectedMessageId(null)
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

          const tokens = Math.ceil(responseContent.length / 4)
          addOutputTokens(tokens)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [messages, deleteMessage, addMessage, activeConversationId, addOutputTokens]
  )

  // Handle delete
  const handleDelete = useCallback(
    (messageId: string) => {
      if (confirm('Delete this message?')) {
        deleteMessage(messageId)
        if (selectedMessageId === messageId) {
          setSelectedMessageId(null)
        }
      }
    },
    [deleteMessage, selectedMessageId]
  )

  // Generate message operation commands (after handlers are defined)
  const messageOperationCommands = useCommandPaletteCommands({
    selectedMessageId,
    isUserMessage: selectedMessage?.role === 'user',
    isAssistantMessage: selectedMessage?.role === 'assistant',
    onEdit: handleEdit,
    onRegenerate: handleRegenerate,
    onDelete: handleDelete,
    undo,
    redo,
    canUndo,
    canRedo,
  })

  // Command palette commands (must be after messageOperationCommands)
  const commands = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      shortcut: ['Ctrl', 'N'],
      category: 'Conversation',
      onSelect: () => {
        const newId = Date.now().toString()
        setConversations((prev) => [
          {
            id: newId,
            title: 'New Chat',
            preview: '',
            timestamp: Date.now(),
            messageCount: 0,
          },
          ...prev,
        ])
        setActiveConversationId(newId)
        setShowCommandPalette(false)
      },
    },
    {
      id: 'export',
      label: 'Export Conversation',
      description: 'Export current conversation',
      shortcut: ['Ctrl', 'E'],
      category: 'Conversation',
      onSelect: () => {
        setShowExport(true)
        setShowCommandPalette(false)
      },
    },
    {
      id: 'search',
      label: 'Search Messages',
      description: 'Search through messages',
      shortcut: ['Ctrl', 'K'],
      category: 'Navigation',
      onSelect: () => {
        setShowCommandPalette(false)
      },
    },
    {
      id: 'undo',
      label: 'Undo',
      description: 'Undo last operation',
      shortcut: ['Ctrl', 'Z'],
      category: 'Edit',
      onSelect: () => {
        undo()
        setShowCommandPalette(false)
      },
    },
    {
      id: 'redo',
      label: 'Redo',
      description: 'Redo last undone operation',
      shortcut: ['Ctrl', 'Y'],
      category: 'Edit',
      onSelect: () => {
        redo()
        setShowCommandPalette(false)
      },
    },
    {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      description: 'Show/hide conversation list',
      shortcut: ['Ctrl', 'B'],
      category: 'View',
      onSelect: () => {
        setShowSidebar((prev) => !prev)
        setShowCommandPalette(false)
      },
    },
    ...messageOperationCommands,
  ]

  // Handle send
  const handleSend = useCallback(
    async (content: string) => {
      addMessage({
        chatId: activeConversationId,
        role: 'user',
        content,
      })

      const userTokens = Math.ceil(content.length / 4)
      addInputTokens(userTokens)

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

        const aiTokens = Math.ceil(responseContent.length / 4)
        addOutputTokens(aiTokens)
      } finally {
        setIsLoading(false)
      }
    },
    [addMessage, activeConversationId, addInputTokens, addOutputTokens]
  )

  // Handle export
  const handleExport = useCallback(
    async (options: any) => {
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

  // Sample citations (for demo)
  const sampleCitations: Citation[] = [
    {
      id: '1',
      url: 'https://example.com/doc1',
      title: 'Documentation Example',
      chunkText:
        'This is a sample citation from a document. It provides context for the AI response.',
      metadata: { source: 'docs', page: 1 },
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
          <ConversationList
            conversations={conversations}
            folders={folders}
            activeId={activeConversationId}
            activeFolderId={activeFolderId}
            onSelect={setActiveConversationId}
            onFolderSelect={setActiveFolderId}
            onDelete={(id) => {
              setConversations((prev) => prev.filter((c) => c.id !== id))
              if (id === activeConversationId && conversations.length > 1) {
                setActiveConversationId(
                  conversations.find((c) => c.id !== id)?.id ||
                    conversations[0].id
                )
              }
            }}
            onDeleteFolder={(folderId) => {
              setFolders((prev) => prev.filter((f) => f.id !== folderId))
              setConversations((prev) =>
                prev.map((c) =>
                  c.folderId === folderId ? { ...c, folderId: undefined } : c
                )
              )
              if (activeFolderId === folderId) {
                setActiveFolderId(undefined)
              }
            }}
            onMoveToFolder={(conversationId, folderId) => {
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === conversationId
                    ? { ...c, folderId: folderId || undefined }
                    : c
                )
              )
            }}
            onCreateFolder={(name) => {
              const newFolder: Folder = {
                id: `folder-${Date.now()}`,
                name,
                createdAt: Date.now(),
                conversationCount: 0,
              }
              setFolders((prev) => [...prev, newFolder])
            }}
            onTogglePin={(id) => {
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === id ? { ...c, isPinned: !c.isPinned } : c
                )
              )
            }}
            showSearch
            showFilters
            showSort
            showFolders
          />
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
            {/* Branch selector */}
            {branches.size > 1 && (
              <select
                value={currentBranchId}
                onChange={(e) => switchToBranch(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                {Array.from(branches.keys()).map((branchId: string) => (
                  <option key={branchId} value={branchId}>
                    Branch {branchId.slice(0, 8)}
                  </option>
                ))}
              </select>
            )}

            {/* Undo/Redo */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={undo}
                disabled={!canUndo}
                style={{
                  padding: '0.5rem 1rem',
                  background: canUndo ? '#f3f4f6' : '#e5e7eb',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: canUndo ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem',
                  opacity: canUndo ? 1 : 0.5,
                }}
                title="Undo (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                style={{
                  padding: '0.5rem 1rem',
                  background: canRedo ? '#f3f4f6' : '#e5e7eb',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: canRedo ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem',
                  opacity: canRedo ? 1 : 0.5,
                }}
                title="Redo (Ctrl+Y)"
              >
                ↷ Redo
              </button>
            </div>

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
              📥 Export
            </button>

            {/* Token counter */}
            <TokenCounter tokens={totalTokens} cost={estimatedCost} />

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
          <AdvancedMessageSearch
            messages={messages}
            onResultsChange={setFilteredMessages}
            enableAdvancedFilters
            placeholder="Search messages..."
          />
        </div>

        {/* Chat window */}
        <div ref={scrollRef as any} style={{ flex: 1, overflow: 'auto' }}>
          <ChatWindow
            messages={filteredMessages.length > 0 ? filteredMessages : messages}
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

      {/* Command Palette */}
      <CommandPalette
        items={commands}
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

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
