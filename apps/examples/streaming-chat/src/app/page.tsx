'use client'

import { useState, useRef, useCallback } from 'react'
import { ChatWindow, TypingIndicator } from '@clarity-chat/react'
import type { StreamMessage } from '@clarity-chat/types'

// API Key Missing Card Component
function ApiKeyMissingCard({ provider }: { provider: string }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.5rem',
            background: '#fef3c7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
          }}
        >
          ⚠️
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          API Key Required
        </h1>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          This demo requires a <strong>{provider}</strong> API key to function.
        </p>
        <div
          style={{
            background: '#f8fafc',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'left',
          }}
        >
          <p style={{ fontSize: '0.875rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
            1. Create a <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>.env.local</code> file
          </p>
          <p style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
            2. Add: <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>OPENAI_API_KEY=sk-...</code>
          </p>
        </div>
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '0.75rem 1rem',
            background: '#3b82f6',
            color: 'white',
            fontWeight: 500,
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          Get API Key →
        </a>
      </div>
    </div>
  )
}

export default function StreamingChatDemo() {
  const [messages, setMessages] = useState<StreamMessage[]>([
    {
      id: '1',
      chatId: 'streaming-demo',
      role: 'assistant',
      content:
        "Hello! I'm your AI assistant with real-time streaming support. Try asking me something!",
      createdAt: new Date(Date.now() - 5000),
      updatedAt: new Date(Date.now() - 5000),
      status: 'sent',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleSendMessage = useCallback(
    async (content: string) => {
      setError(null)

      const userMessage: StreamMessage = {
        id: Date.now().toString(),
        chatId: 'streaming-demo',
        role: 'user',
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setIsStreaming(true)

      const assistantMessage: StreamMessage = {
        id: (Date.now() + 1).toString(),
        chatId: 'streaming-demo',
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sending',
      }

      setMessages((prev) => [...prev, assistantMessage])
      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          if (response.status === 500 && errorData.message?.includes('API key')) {
            setApiKeyMissing(true)
            return
          }
          throw new Error(errorData.message || 'Failed to get response')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) throw new Error('No reader available')

        let accumulatedContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  accumulatedContent += parsed.content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: accumulatedContent, status: 'sending' as const }
                        : msg
                    )
                  )
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, status: 'sent' as const, updatedAt: new Date() }
              : msg
          )
        )
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id))
        } else {
          setError(err.message || 'Something went wrong')
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? {
                    ...msg,
                    content: 'Sorry, I encountered an error. Please try again.',
                    status: 'error' as const,
                  }
                : msg
            )
          )
        }
      } finally {
        setIsLoading(false)
        setIsStreaming(false)
        abortControllerRef.current = null
      }
    },
    [messages]
  )

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
      setIsLoading(false)
    }
  }, [])

  if (apiKeyMissing) {
    return <ApiKeyMissingCard provider="OpenAI" />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                📡
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Streaming Chat</h1>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Real-time SSE streaming demo
                </p>
              </div>
            </div>
            <a href="/" style={{ fontSize: '0.875rem', color: '#64748b', textDecoration: 'none' }}>
              ← Back to Docs
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* How to Use Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>💡 How to Use</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            This demo shows real-time streaming responses using Server-Sent Events (SSE).
            Type a message and watch the AI response appear character by character.
            Click "Stop" to cancel generation mid-stream.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span>⚠️</span>
            <p style={{ fontSize: '0.875rem', color: '#991b1b', flex: 1, margin: 0 }}>{error}</p>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#991b1b',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Streaming Indicator */}
        {isStreaming && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TypingIndicator variant="dots" showAvatar={false} />
              <span style={{ fontSize: '0.875rem', color: '#1d4ed8' }}>Streaming response...</span>
            </div>
            <button
              onClick={handleCancel}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.875rem',
                background: 'white',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Stop
            </button>
          </div>
        )}

        {/* Chat Window */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          <div style={{ height: '500px' }}>
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              color: '#64748b',
            }}
          >
            <p style={{ margin: 0 }}>Streaming Chat Demo • Clarity Chat Components</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>
                📖 Documentation
              </a>
              <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>
                💻 GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
