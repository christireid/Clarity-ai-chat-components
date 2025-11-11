import { useState, useCallback } from 'react'
import { 
  ChatWindow, 
  useAutoScroll,
  useTokenTracker,
  useRealisticTyping,
  useMessageOperations,
  ErrorBoundary,
  NetworkStatus,
  TokenCounter,
  useMediaQuery,
} from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'
import type { Message } from '@clarity-chat/types'

function ChatApp() {
  // Use message operations hook for edit/regenerate/delete functionality
  const {
    messages: operationMessages,
    addMessage,
    editMessage,
    regenerateMessage,
    deleteMessage,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations({
    initialMessages: [
      {
        id: '1',
        chatId: 'demo-chat',
        role: 'assistant' as const,
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: Date.now() - 5000,
      },
    ],
    onEdit: (messageId, newContent) => {
      console.log('Message edited:', messageId, newContent)
    },
    onRegenerate: (messageId) => {
      console.log('Regenerating message:', messageId)
      // Will be handled by handleRegenerate below
    },
    onDelete: (messageId) => {
      console.log('Message deleted:', messageId)
    },
  })

  // Convert operation messages to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'demo-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  
  // Auto-scroll for better UX
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({ 
    enabled: true,
    behavior: 'smooth',
    dependencies: [messages]
  })
  
  // Token tracking
  const { 
    totalTokens, 
    addInputTokens, 
    addOutputTokens,
    estimatedCost 
  } = useTokenTracker({
    modelName: 'gpt-3.5-turbo',
  })
  
  // Realistic typing animation
  const { 
    isTyping, 
    currentStage,
    startTyping, 
    delayResponse 
  } = useRealisticTyping({
    minDelay: 800,
    maxDelay: 2000,
    showIndicatorAfter: 1000,
  })
  
  // Responsive design
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Handle message edit
  const handleEdit = useCallback((messageId: string) => {
    setEditingMessageId(messageId)
    const message = messages.find(m => m.id === messageId)
    if (message) {
      const newContent = prompt('Edit message:', message.content) || message.content
      if (newContent !== message.content) {
        editMessage(messageId, newContent)
      }
    }
    setEditingMessageId(null)
  }, [messages, editMessage])

  // Handle message regenerate
  const handleRegenerate = useCallback(async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || message.role !== 'assistant') return

    setIsLoading(true)
    try {
      // Find the user message that prompted this response
      const messageIndex = messages.findIndex(m => m.id === messageId)
      const previousUserMessage = messages[messageIndex - 1]
      
      if (previousUserMessage && previousUserMessage.role === 'user') {
        // Delete old message first
        deleteMessage(messageId)
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Simulate regenerating the response
        const responseContent = `[Regenerated] You said: "${previousUserMessage.content}". This is a regenerated response with different wording.`
        
        // Add new regenerated message
        addMessage({
          chatId: 'demo-chat',
          role: 'assistant',
          content: responseContent,
        })
        
        // Simulate AI response delay
        await new Promise(resolve => setTimeout(resolve, 800))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate')
    } finally {
      setIsLoading(false)
    }
  }, [messages, deleteMessage, addMessage])

  // Handle message delete
  const handleDelete = useCallback((messageId: string) => {
    if (confirm('Delete this message?')) {
      deleteMessage(messageId)
    }
  }, [deleteMessage])

  const handleSendMessage = useCallback(async (content: string) => {
    try {
      setError(null)
      
      // Add user message using operations hook
      addMessage({
        chatId: 'demo-chat',
        role: 'user',
        content,
      })
      
      // Estimate user message tokens (rough: 1 token ≈ 4 chars)
      const userTokens = Math.ceil(content.length / 4)
      addInputTokens(userTokens)
      
      // Start typing indicator
      startTyping(content, 200)
      setIsLoading(true)

      // Simulate AI response
      const responseContent = `You said: "${content}". This is a demo response. In a real application, this would be replaced with an actual AI API call.

Here are some things you could try:
- Ask me a question
- Request code examples  
- Get explanations for complex topics
- **Try editing your message** - Click the Edit button on your message
- **Try regenerating** - Click Regenerate on an AI response
- **Try deleting** - Click Delete on any message

I'm here to help!`
      
      // Apply realistic delay
      await delayResponse(responseContent, content)
      
      // Estimate AI response tokens
      const aiTokens = Math.ceil(responseContent.length / 4)
      addOutputTokens(aiTokens)
      
      // Add AI message using operations hook
      addMessage({
        chatId: 'demo-chat',
        role: 'assistant',
        content: responseContent,
      })
      
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError(err instanceof Error ? err.message : 'Failed to send message')
      console.error('Error sending message:', err)
    }
  }, [addMessage, addInputTokens, addOutputTokens, startTyping, delayResponse])

  return (
    <div 
      style={{ 
        width: '100%', 
        maxWidth: isMobile ? '100%' : '800px', 
        height: isMobile ? '100vh' : '600px',
        display: 'flex',
        flexDirection: 'column',
        border: isMobile ? 'none' : '1px solid #e5e7eb',
        borderRadius: isMobile ? 0 : '0.5rem',
        overflow: 'hidden',
        background: 'white',
      }}
    >
      {/* Header with token counter and status */}
      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            Basic Chat Demo
          </h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
            Try editing, regenerating, or deleting messages!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Undo/Redo buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={undo}
              disabled={!canUndo}
              style={{
                padding: '0.5rem',
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
                padding: '0.5rem',
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
          <TokenCounter 
            tokens={totalTokens}
            cost={estimatedCost}
            compact={isMobile}
          />
          <NetworkStatus />
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div style={{
          padding: '1rem',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          margin: '1rem',
          flexShrink: 0,
        }}>
          <p style={{ margin: 0, color: '#991b1b', fontSize: '0.875rem' }}>{error}</p>
          <button 
            onClick={() => setError(null)}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Typing indicator */}
      {isTyping && currentStage && (
        <div style={{
          padding: '0.5rem 1rem',
          background: '#f3f4f6',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '0.875rem',
          color: '#6b7280',
          flexShrink: 0,
        }}>
          {currentStage.label}
        </div>
      )}
      
      {/* Scroll to bottom button */}
      {!isNearBottom && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          right: '20px',
          zIndex: 10,
        }}>
          <button
            onClick={scrollToBottom}
            style={{
              padding: '0.75rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Scroll to bottom"
          >
            ↓
          </button>
        </div>
      )}
      
      {/* Chat window with auto-scroll */}
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto' }}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onEditMessage={handleEdit}
          onRegenerateMessage={handleRegenerate}
          onDeleteMessage={handleDelete}
        />
      </div>
    </div>
  )
}

// Wrap in ErrorBoundary for crash protection
function App() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <h1 style={{ color: '#dc2626', fontSize: '1.5rem', marginBottom: '1rem' }}>
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
      <ChatApp />
    </ErrorBoundary>
  )
}

export default App
