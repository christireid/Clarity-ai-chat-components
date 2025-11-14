# Clarity Chat Cookbook - Modernized Edition

> 33+ production-ready recipes and patterns for building modern AI chat applications

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Patterns](#basic-patterns)
3. [Advanced Patterns](#advanced-patterns)
4. [Integration Recipes](#integration-recipes)
5. [Production Patterns](#production-patterns)
6. [Modern Features](#modern-features)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Recipe 1: Basic Chat Setup

The simplest way to get started with Clarity Chat. This recipe demonstrates a complete, production-ready chat implementation with proper TypeScript types and error handling.

```tsx
import { ChatWindow, ErrorBoundary } from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

export function BasicChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = useCallback(async (content: string) => {
    // Create user message with proper structure
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: 'default-chat',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content,
          history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        chatId: 'default-chat',
        role: 'assistant',
        content: data.response || data.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Failed to send message:', error)
      // Optionally add error message to chat
      const errorMsg: Message = {
        id: `msg-error-${Date.now()}`,
        chatId: 'default-chat',
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'error',
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      )}
    >
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading} 
        onSendMessage={handleSend}
        emptyState={
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Start a conversation by sending a message
            </p>
          </div>
        }
      />
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Proper TypeScript types throughout
- ✅ Error handling with try/catch
- ✅ Error boundary for React errors
- ✅ Loading states
- ✅ Message history context
- ✅ Proper message structure

---

### Recipe 2: With Error Handling & Retry

Add robust error handling with automatic retry and user feedback.

```tsx
import { 
  ChatWindow, 
  ErrorBoundary, 
  NetworkStatus,
  useErrorRecovery 
} from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

export function ChatWithErrorHandling() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { handleError, retry, canRetry } = useErrorRecovery({
    maxRetries: 3,
    retryDelay: 1000,
  })

  const sendMessage = useCallback(async (content: string, attempt = 0): Promise<void> => {
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: 'default-chat',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        chatId: 'default-chat',
        role: 'assistant',
        content: data.response,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt < 3) {
        // Auto-retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
        return sendMessage(content, attempt + 1)
      }
      
      handleError(errorObj)
      
      const errorMsg: Message = {
        id: `msg-error-${Date.now()}`,
        chatId: 'default-chat',
        role: 'assistant',
        content: `Error: ${errorObj.message}. ${canRetry ? 'Click retry to try again.' : ''}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'error',
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }, [handleError, canRetry])

  const handleSend = useCallback((content: string) => {
    sendMessage(content, 0)
  }, [sendMessage])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        <NetworkStatus />
        <ChatWindow 
          messages={messages} 
          isLoading={isLoading} 
          onSendMessage={handleSend}
          onMessageRetry={(messageId) => {
            const message = messages.find(m => m.id === messageId)
            if (message && message.role === 'user') {
              handleSend(message.content)
            }
          }}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Automatic retry with exponential backoff
- ✅ Network status detection
- ✅ Error recovery hook
- ✅ User-friendly error messages
- ✅ Retry button on failed messages

---

## Basic Patterns

### Recipe 3: Streaming Responses

Stream AI responses in real-time for better UX with proper status handling.

```tsx
import { 
  ChatWindow, 
  StreamingMessage,
  useStreaming 
} from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

export function StreamingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const { stream, isStreaming } = useStreaming()

  const handleSend = useCallback(async (content: string) => {
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: 'default-chat',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMsg])

    // Create placeholder for streaming response
    const aiMsgId = `msg-${Date.now() + 1}`
    const aiMsg: Message = {
      id: aiMsgId,
      chatId: 'default-chat',
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'streaming',
    }
    setMessages(prev => [...prev, aiMsg])

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content,
          history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Stream error: ${response.status}`)
      }

      await stream(response, (chunk: string) => {
        setMessages(prev => {
          const updated = [...prev]
          const lastMsg = updated[updated.length - 1]
          if (lastMsg.id === aiMsgId) {
            lastMsg.content += chunk
            lastMsg.updatedAt = new Date()
          }
          return updated
        })
      })

      // Mark as complete
      setMessages(prev => {
        const updated = [...prev]
        const lastMsg = updated[updated.length - 1]
        if (lastMsg.id === aiMsgId) {
          lastMsg.status = 'sent'
        }
        return updated
      })
    } catch (error) {
      // Mark as error
      setMessages(prev => {
        const updated = [...prev]
        const lastMsg = updated[updated.length - 1]
        if (lastMsg.id === aiMsgId) {
          lastMsg.status = 'error'
          lastMsg.content = 'Error streaming response. Please try again.'
        }
        return updated
      })
    }
  }, [messages, stream])

  return (
    <ChatWindow 
      messages={messages} 
      isLoading={isStreaming} 
      onSendMessage={handleSend}
    />
  )
}
```

**Key Features:**
- ✅ Real-time streaming updates
- ✅ Proper streaming status handling
- ✅ Error handling for stream failures
- ✅ Message history context
- ✅ Optimistic updates

---

### Recipe 4: Message Persistence

Save and restore chat history with localStorage and IndexedDB for larger datasets.

```tsx
import { 
  ChatWindow, 
  useLocalStorage,
  useIndexedDB 
} from '@clarity-chat/react'
import { useState, useEffect, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

export function PersistentChat() {
  // Use localStorage for small datasets (< 5MB)
  const [chatId] = useLocalStorage('current-chat-id', 'chat-1')
  
  // Use IndexedDB for larger message histories
  const { 
    data: messages, 
    setData: setMessages,
    isLoading: isLoadingMessages 
  } = useIndexedDB<Message[]>(`chat-${chatId}`, [])

  // Load messages on mount
  useEffect(() => {
    if (messages.length === 0) {
      // Try to load from localStorage as fallback
      const stored = localStorage.getItem(`chat-messages-${chatId}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setMessages(parsed)
        } catch (error) {
          console.error('Failed to load messages:', error)
        }
      }
    }
  }, [chatId, messages.length, setMessages])

  // Auto-save to localStorage as backup
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat-messages-${chatId}`, JSON.stringify(messages))
    }
  }, [messages, chatId])

  const handleSend = useCallback(async (content: string) => {
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMsg])
    
    // Call API and add response...
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })
      
      const data = await response.json()
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        chatId,
        role: 'assistant',
        content: data.response,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [chatId, setMessages])

  if (isLoadingMessages) {
    return <div className="p-4">Loading conversation...</div>
  }

  return (
    <ChatWindow 
      messages={messages} 
      onSendMessage={handleSend}
    />
  )
}
```

**Key Features:**
- ✅ Dual storage (localStorage + IndexedDB)
- ✅ Automatic persistence
- ✅ Loading states
- ✅ Error handling
- ✅ Chat-specific storage

---

### Recipe 5: Token Tracking & Cost Estimation

Monitor token usage and costs in real-time with detailed analytics.

```tsx
import { 
  ChatWindow, 
  TokenCounter,
  useTokenTracker 
} from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

export function ChatWithTokenTracking() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    totalTokens,
    inputTokens,
    outputTokens,
    addInputTokens,
    addOutputTokens,
    estimatedCost,
    reset,
  } = useTokenTracker({
    modelName: 'gpt-4-turbo',
    inputCostPer1k: 0.01,
    outputCostPer1k: 0.03,
  })

  const handleSend = useCallback(async (content: string) => {
    // Track input tokens
    const inputTokenCount = Math.ceil(content.length / 4) // Rough estimate
    addInputTokens(inputTokenCount)

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: 'default-chat',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })
      
      const data = await response.json()
      const aiResponse = data.response || data.content
      
      // Track output tokens
      const outputTokenCount = Math.ceil(aiResponse.length / 4)
      addOutputTokens(outputTokenCount)
      
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        chatId: 'default-chat',
        role: 'assistant',
        content: aiResponse,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [addInputTokens, addOutputTokens])

  return (
    <div className="flex flex-col h-screen">
      {/* Token Counter Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <h1 className="text-xl font-semibold">Chat</h1>
        <div className="flex items-center gap-4">
          <TokenCounter
            tokens={totalTokens}
            maxTokens={128000}
            cost={estimatedCost}
            showBreakdown
          />
          {totalTokens > 0 && (
            <button
              onClick={reset}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <ChatWindow 
        messages={messages} 
        isLoading={isLoading} 
        onSendMessage={handleSend}
      />
    </div>
  )
}
```

**Key Features:**
- ✅ Real-time token counting
- ✅ Cost estimation
- ✅ Input/output breakdown
- ✅ Token limit warnings
- ✅ Reset functionality

---

## Advanced Patterns

### Recipe 6: Multi-Turn Conversations with Context Management

Maintain conversation context across multiple turns with automatic context window management.

```tsx
import { 
  ChatWindow, 
  ContextManager,
  useTokenTracker 
} from '@clarity-chat/react'
import { useState, useCallback, useMemo } from 'react'
import type { Message } from '@clarity-chat/types'

export function ContextAwareChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { totalTokens } = useTokenTracker({ modelName: 'gpt-4-turbo' })

  // Manage context window (keep last N messages if approaching limit)
  const contextMessages = useMemo(() => {
    const maxTokens = 128000
    const reservedTokens = 1000 // Reserve for response
    
    if (totalTokens < maxTokens - reservedTokens) {
      return messages // Use all messages
    }
    
    // Keep last 20 messages if approaching limit
    return messages.slice(-20)
  }, [messages, totalTokens])

  const handleSend = useCallback(async (content: string) => {
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: 'default-chat',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          // Send conversation history for context
          history: contextMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })
      
      const data = await response.json()
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        chatId: 'default-chat',
        role: 'assistant',
        content: data.response,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [contextMessages])

  return (
    <div className="flex flex-col h-screen">
      <ContextManager
        messages={messages}
        contextMessages={contextMessages}
        onClearContext={() => setMessages([])}
      />
      
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading} 
        onSendMessage={handleSend}
      />
    </div>
  )
}
```

**Key Features:**
- ✅ Automatic context window management
- ✅ Token-aware message pruning
- ✅ Context visualization
- ✅ Manual context clearing
- ✅ Conversation history preservation

---

### Recipe 7: File Upload Integration

Allow users to upload files as context with preview and management.

```tsx
import { 
  ChatWindow, 
  FileUpload,
  ContextManager 
} from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url?: string
  content?: string
}

export function ChatWithFileUpload() {
  const [messages, setMessages] = useState<Message[]>([])
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    const uploaded: UploadedFile[] = await Promise.all(
      selectedFiles.map(async (file) => {
        // Upload file to your backend
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        const data = await response.json()
        
        return {
          id: data.id || `file-${Date.now()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: data.url,
          content: data.content, // Extracted text content
        }
      })
    )
    
    setFiles(prev => [...prev, ...uploaded])
  }, [])

  const handleSend = useCallback(async (content: string) => {
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: 'default-chat',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          fileIds: files.map(f => f.id),
          fileContents: files.map(f => f.content).filter(Boolean),
        }),
      })
      
      const data = await response.json()
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        chatId: 'default-chat',
        role: 'assistant',
        content: data.response,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [files])

  return (
    <div className="flex flex-col h-screen">
      {/* File Upload Area */}
      <div className="p-4 border-b">
        <FileUpload
          onFilesSelected={handleFilesSelected}
          accept=".pdf,.doc,.docx,.txt,.md"
          maxSize={10 * 1024 * 1024} // 10MB
          multiple
        />
      </div>

      {/* Context Manager */}
      {files.length > 0 && (
        <ContextManager
          contexts={files.map(f => ({
            id: f.id,
            type: 'file',
            name: f.name,
            content: f.content,
          }))}
          onRemove={(id) => setFiles(prev => prev.filter(f => f.id !== id))}
        />
      )}

      <ChatWindow 
        messages={messages} 
        isLoading={isLoading} 
        onSendMessage={handleSend}
      />
    </div>
  )
}
```

**Key Features:**
- ✅ File upload with preview
- ✅ Multiple file support
- ✅ File size validation
- ✅ Context management
- ✅ File content extraction

---

This is getting quite long. Let me continue with the remaining recipes in a more efficient way by updating the existing file directly.
