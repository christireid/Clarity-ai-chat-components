import { useState, useCallback } from 'react'
import { 
  ChatWindow, 
  useAutoScroll,
  useTokenTracker,
  useRealisticTyping,
  ErrorBoundary,
  NetworkStatus,
  TokenCounter,
  useMediaQuery,
} from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'
import type { Message } from '@clarity-chat/types'

function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      chatId: 'demo-chat',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      createdAt: new Date(Date.now() - 5000),
      updatedAt: new Date(Date.now() - 5000),
      status: 'sent',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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

  const handleSendMessage = useCallback(async (content: string) => {
    try {
      setError(null)
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        chatId: 'demo-chat',
        role: 'user',
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      
      setMessages((prev) => [...prev, userMessage])
      
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

I'm here to help!`
      
      // Apply realistic delay
      await delayResponse(responseContent, content)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId: 'demo-chat',
        role: 'assistant',
        content: responseContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      
      // Estimate AI response tokens
      const aiTokens = Math.ceil(responseContent.length / 4)
      addOutputTokens(aiTokens)
      
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError(err instanceof Error ? err.message : 'Failed to send message')
      console.error('Error sending message:', err)
    }
  }, [addInputTokens, addOutputTokens, startTyping, delayResponse])

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
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
          Basic Chat Demo
        </h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
