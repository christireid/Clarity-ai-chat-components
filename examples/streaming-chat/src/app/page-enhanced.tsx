'use client'

import { useState, useRef } from 'react'
import { 
  ChatWindow,
  ModelSelector,
  StreamingMessage,
  allModels,
  type ModelConfig 
} from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

export default function EnhancedStreamingChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      chatId: 'demo-chat',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant with **model-agnostic streaming support**. I can use OpenAI, Anthropic, or Google AI. Select a model above and try asking me something!',
      timestamp: new Date(Date.now() - 5000),
      createdAt: new Date(Date.now() - 5000),
      updatedAt: new Date(Date.now() - 5000),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    provider: 'openai',
    model: 'gpt-4-turbo',
  })
  const [totalCost, setTotalCost] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleModelChange = (modelId: string, config: ModelConfig) => {
    setSelectedModel(modelId)
    setModelConfig(config)
  }

  const handleSendMessage = async (content: string) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: 'demo-chat',
      role: 'user',
      content,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Create streaming assistant message
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      chatId: 'demo-chat',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    setMessages((prev) => [...prev, assistantMessage])

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController()

    try {
      // Call streaming API with model config
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          config: modelConfig,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      let accumulatedContent = ''
      let tokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 }

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            
            if (data === '[DONE]') {
              break
            }

            try {
              const parsed = JSON.parse(data)
              
              if (parsed.type === 'token' && parsed.content) {
                accumulatedContent += parsed.content
                
                // Update message with new content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                )
              } else if (parsed.type === 'done' && parsed.usage) {
                // Update token usage and cost
                tokenUsage = parsed.usage
                setTotalTokens(prev => prev + tokenUsage.totalTokens)
                
                // Calculate cost based on model
                if (parsed.cost) {
                  setTotalCost(prev => prev + parsed.cost)
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled')
        // Remove incomplete message
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id))
      } else {
        console.error('Error:', error)
        // Update message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { 
                  ...msg, 
                  content: 'Sorry, I encountered an error. Please try again.',
                }
              : msg
          )
        )
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: 'var(--background)',
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '1.5rem',
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          marginBottom: '0.5rem',
        }}>
          Model-Agnostic Streaming Chat
        </h1>
        <p style={{ 
          color: 'var(--foreground)',
          opacity: 0.7,
          marginBottom: '1rem',
        }}>
          Switch between OpenAI, Anthropic, and Google AI in real-time with cost tracking
        </p>
      </div>

      {/* Model Selector & Stats */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <ModelSelector
            models={allModels}
            value={selectedModel}
            onChange={handleModelChange}
            showMetrics
          />
        </div>
        
        {/* Usage Stats */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
          border: '1px solid rgba(128, 128, 128, 0.2)',
          borderRadius: '8px',
          backgroundColor: 'var(--card)',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Total Tokens</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {totalTokens.toLocaleString()}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(128, 128, 128, 0.2)' }} />
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Total Cost</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              ${totalCost.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Window */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        height: '600px',
        border: '1px solid rgba(128, 128, 128, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'var(--card)',
      }}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onCancel={handleCancel}
        />
      </div>

      {/* Feature Highlights */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
      }}>
        <div style={{
          padding: '1rem',
          border: '1px solid rgba(128, 128, 128, 0.2)',
          borderRadius: '8px',
          backgroundColor: 'var(--card)',
        }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🔄</div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Multi-Provider</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            Switch between OpenAI, Anthropic, and Google AI seamlessly
          </p>
        </div>

        <div style={{
          padding: '1rem',
          border: '1px solid rgba(128, 128, 128, 0.2)',
          borderRadius: '8px',
          backgroundColor: 'var(--card)',
        }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>⚡</div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Real-Time Streaming</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            Token-by-token responses with AsyncGenerator
          </p>
        </div>

        <div style={{
          padding: '1rem',
          border: '1px solid rgba(128, 128, 128, 0.2)',
          borderRadius: '8px',
          backgroundColor: 'var(--card)',
        }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>💰</div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Cost Tracking</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            Real-time token usage and cost estimation
          </p>
        </div>

        <div style={{
          padding: '1rem',
          border: '1px solid rgba(128, 128, 128, 0.2)',
          borderRadius: '8px',
          backgroundColor: 'var(--card)',
        }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🎯</div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Model Metrics</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            Compare speed, cost, and quality across models
          </p>
        </div>
      </div>
    </main>
  )
}
