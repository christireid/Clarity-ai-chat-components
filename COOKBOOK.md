# Clarity Chat Cookbook

> 33+ recipes and patterns for building production-ready AI chat applications

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Patterns](#basic-patterns)
3. [Advanced Patterns](#advanced-patterns)
4. [Integration Recipes](#integration-recipes)
5. [Production Patterns](#production-patterns)
6. [Troubleshooting](#troubleshooting)

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
- ✅ Proper message structure with all required fields

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
- ✅ Proper TypeScript types

---

## Basic Patterns

### Recipe 3: Streaming Responses

Stream AI responses in real-time for better UX with proper status handling and error recovery.

```tsx
import { 
  ChatWindow, 
  StreamingMessage,
  useStreaming,
  ErrorBoundary 
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
    <ErrorBoundary>
      <ChatWindow 
        messages={messages} 
        isLoading={isStreaming} 
        onSendMessage={handleSend}
      />
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Real-time streaming updates
- ✅ Proper streaming status handling
- ✅ Error handling for stream failures
- ✅ Message history context
- ✅ Optimistic updates
- ✅ TypeScript types throughout

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
- ✅ Fallback to localStorage

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
- ✅ Detailed analytics display

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
- ✅ Smart message retention

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
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }
        
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
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
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
- ✅ Error handling
- ✅ TypeScript types

---

### Recipe 8: Custom Thinking Indicators

Show detailed AI processing stages with visual feedback.

```tsx
import { 
  ChatWindow, 
  ThinkingIndicator 
} from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import type { Message, AIStatus } from '@clarity-chat/types'

export function ChatWithStages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [aiStatus, setAiStatus] = useState<AIStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
    
    // Set initial thinking stage
    setAiStatus({
      stage: 'thinking',
      progress: 0,
      message: 'Processing your request...',
    })
    
    // Simulate stages with progress
    setTimeout(() => {
      setAiStatus({
        stage: 'researching',
        progress: 25,
        message: 'Gathering information...',
      })
    }, 1000)
    
    setTimeout(() => {
      setAiStatus({
        stage: 'generating',
        progress: 50,
        message: 'Generating response...',
      })
    }, 2000)
    
    setTimeout(() => {
      setAiStatus({
        stage: 'finalizing',
        progress: 75,
        message: 'Finalizing answer...',
      })
    }, 3000)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
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
      console.error('Failed to send message:', error)
    } finally {
      setAiStatus(null)
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen">
      {aiStatus && (
        <div className="p-4 border-b">
          <ThinkingIndicator status={aiStatus} />
        </div>
      )}
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        aiStatus={aiStatus || undefined}
        onSendMessage={handleSend}
      />
    </div>
  )
}
```

**Key Features:**
- ✅ Visual processing stages
- ✅ Progress indicators
- ✅ Status messages
- ✅ Smooth transitions
- ✅ TypeScript types
- ✅ Error handling

---

### Recipe 9: Message Operations (Edit, Regenerate, Delete)

Allow users to edit messages, regenerate responses, and delete messages with full undo/redo support.

```tsx
import { ChatWindow, useMessageOperations } from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

export function ChatWithOperations() {
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
    initialMessages: [],
    onEdit: (messageId, newContent) => {
      console.log('Message edited:', messageId, newContent)
      // Optionally re-send from this point
    },
    onRegenerate: (messageId) => {
      console.log('Regenerating:', messageId)
      handleRegenerate(messageId)
    },
    onDelete: (messageId) => {
      console.log('Message deleted:', messageId)
    },
  })

  // Convert to Message format for ChatWindow
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'chat-1',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return

    // In a real app, show an inline editor
    const newContent = prompt('Edit message:', message.content) || message.content
    if (newContent !== message.content) {
      editMessage(messageId, newContent)
      // Optionally re-send from this point
    }
  }, [messages, editMessage])

  const handleRegenerate = useCallback(async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || message.role !== 'assistant') return

    setIsLoading(true)
    try {
      // Find the user message that prompted this
      const index = messages.findIndex(m => m.id === messageId)
      const userMessage = messages[index - 1]

      if (userMessage && userMessage.role === 'user') {
        // Delete old response
        deleteMessage(messageId)

        // Call API to regenerate
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: userMessage.content }),
        })
        const data = await response.json()

        // Add new response
        addMessage({
          chatId: 'chat-1',
          role: 'assistant',
          content: data.response,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [messages, deleteMessage, addMessage])

  const handleDelete = useCallback((messageId: string) => {
    if (confirm('Delete this message?')) {
      deleteMessage(messageId)
    }
  }, [deleteMessage])

  const handleSend = useCallback(async (content: string) => {
    addMessage({
      chatId: 'chat-1',
      role: 'user',
      content,
    })

    // Call API and add response...
  }, [addMessage])

  return (
    <div>
      {/* Undo/Redo Controls */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <button onClick={undo} disabled={!canUndo}>
          ↶ Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          ↷ Redo
        </button>
      </div>

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSend}
        onEditMessage={handleEdit}
        onRegenerateMessage={handleRegenerate}
        onDeleteMessage={handleDelete}
      />
    </div>
  )
}
```

**Features:**
- ✅ Edit user messages
- ✅ Regenerate AI responses
- ✅ Delete any message
- ✅ Undo/Redo support
- ✅ Full operation history

---

## Integration Recipes

### Recipe 10: Next.js App Router Integration

Use with Next.js 14+ App Router.

```tsx
// app/chat/page.tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])

  const handleSend = async (content: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    })
    
    const data = await response.json()
    // Update messages...
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

```tsx
// app/api/chat/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI()

export async function POST(request: Request) {
  const { message } = await request.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
  })

  return NextResponse.json({
    response: completion.choices[0].message.content,
  })
}
```

---

### Recipe 11: Remix Integration

Use with Remix.

```tsx
// app/routes/chat.tsx
import { ChatWindow } from '@clarity-chat/react'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useActionData, useSubmit } from '@remix-run/react'
import { useState } from 'react'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const message = formData.get('message')

  // Call AI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    }),
  })

  const data = await response.json()
  return json({ response: data.choices[0].message.content })
}

export default function Chat() {
  const [messages, setMessages] = useState([])
  const actionData = useActionData<typeof action>()
  const submit = useSubmit()

  const handleSend = (content: string) => {
    submit({ message: content }, { method: 'post' })
    // Add to messages...
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

---

### Recipe 12: Supabase Integration

Store chat history in Supabase.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export function ChatWithSupabase() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // Load messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true })
      
      setMessages(data || [])
    }

    loadMessages()

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSend = async (content: string) => {
    const message = {
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    await supabase.from('messages').insert([message])
    // Call AI API and save response...
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

---

### Recipe 13: OpenAI Streaming

Stream responses from OpenAI API.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import OpenAI from 'openai'
import { useState } from 'react'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, dangerouslyAllowBrowser: true })

export function OpenAIStreamingChat() {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)

  const handleSend = async (content: string) => {
    const userMsg = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])

    const aiMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, aiMsg])
    setIsStreaming(true)

    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content }],
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1].content += content
        return updated
      })
    }

    setIsStreaming(false)
  }

  return <ChatWindow messages={messages} isLoading={isStreaming} onSendMessage={handleSend} />
}
```

---

## Production Patterns

### Recipe 14: Rate Limiting

Implement client-side rate limiting.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState, useRef } from 'react'

export function RateLimitedChat() {
  const [messages, setMessages] = useState([])
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false)
  const requestCount = useRef(0)
  const resetTimer = useRef(null)

  const handleSend = async (content: string) => {
    if (requestCount.current >= 10) {
      setRateLimitExceeded(true)
      return
    }

    requestCount.current++
    
    if (!resetTimer.current) {
      resetTimer.current = setTimeout(() => {
        requestCount.current = 0
        setRateLimitExceeded(false)
        resetTimer.current = null
      }, 60000) // Reset after 1 minute
    }

    // Send message...
  }

  return (
    <div>
      {rateLimitExceeded && <p>Rate limit exceeded. Please wait.</p>}
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

---

### Recipe 15: Network Status Detection

Detect and handle network issues.

```tsx
import { ChatWindow, NetworkStatus, useErrorRecovery } from '@clarity-chat/react'
import { useState } from 'react'

export function NetworkAwareChat() {
  const [messages, setMessages] = useState([])
  const [networkStatus, setNetworkStatus] = useState('online')
  const { handleError } = useErrorRecovery()

  const handleSend = async (content: string) => {
    if (networkStatus === 'offline') {
      alert('You are offline. Please check your connection.')
      return
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) throw new Error('Network error')
      
      // Process response...
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      <NetworkStatus status={networkStatus} onStatusChange={setNetworkStatus} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

---

### Recipe 16: Export Conversations

Export chat history to various formats.

```tsx
import { ChatWindow, ExportDialog } from '@clarity-chat/react'
import { useState } from 'react'

export function ExportableChat() {
  const [messages, setMessages] = useState([])
  const [showExport, setShowExport] = useState(false)

  const handleExport = async (format: 'pdf' | 'docx' | 'markdown' | 'json') => {
    const exported = await exportMessages(messages, format)
    downloadFile(exported, `chat-export.${format}`)
  }

  return (
    <div>
      <button onClick={() => setShowExport(true)}>Export</button>
      <ChatWindow messages={messages} />
      {showExport && (
        <ExportDialog
          messages={messages}
          onExport={handleExport}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}
```

---

### Recipe 17: Usage Dashboard

Track usage and costs.

```tsx
import { ChatWindow, UsageDashboard } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

export function ChatWithUsageTracking() {
  const [messages, setMessages] = useState([])
  const [usage, setUsage] = useState({
    totalCredits: 1000,
    usedCredits: 250,
    messagesCount: 42,
    tokensUsed: 15000,
  })

  useEffect(() => {
    // Update usage from API
    const updateUsage = async () => {
      const response = await fetch('/api/usage')
      const data = await response.json()
      setUsage(data)
    }

    updateUsage()
    const interval = setInterval(updateUsage, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <UsageDashboard usage={usage} />
      <ChatWindow messages={messages} />
    </div>
  )
}
```

---

### Recipe 18: Custom Settings Panel

Let users customize their experience.

```tsx
import { ChatWindow, SettingsPanel } from '@clarity-chat/react'
import { useState } from 'react'

export function CustomizableChat() {
  const [messages, setMessages] = useState([])
  const [settings, setSettings] = useState({
    tone: 'professional',
    verbosity: 'balanced',
    theme: 'light',
    language: 'en',
  })

  const handleSend = async (content: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: content,
        settings, // Include user preferences
      }),
    })
    // Process response...
  }

  return (
    <div>
      <SettingsPanel settings={settings} onChange={setSettings} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

---

### Recipe 19: Knowledge Base Integration

Show auto-generated knowledge base.

```tsx
import { ChatWindow, KnowledgeBaseViewer } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

export function ChatWithKnowledgeBase() {
  const [messages, setMessages] = useState([])
  const [knowledgeBase, setKnowledgeBase] = useState([])

  useEffect(() => {
    // Extract topics from conversation
    const topics = extractTopics(messages)
    setKnowledgeBase(topics)
  }, [messages])

  return (
    <div>
      <ChatWindow messages={messages} />
      <KnowledgeBaseViewer
        knowledge={knowledgeBase}
        onTopicClick={topic => {
          // Navigate to topic or start new conversation
        }}
      />
    </div>
  )
}
```

---

### Recipe 20: Prompt Library

Provide quick-start prompts.

```tsx
import { ChatWindow, PromptLibrary } from '@clarity-chat/react'
import { useState } from 'react'

const prompts = [
  { id: '1', title: 'Code Review', content: 'Review this code for best practices: {code}', category: 'development' },
  { id: '2', title: 'Explain Concept', content: 'Explain {concept} in simple terms', category: 'education' },
  { id: '3', title: 'Debug Issue', content: 'Help me debug: {error}', category: 'development' },
]

export function ChatWithPrompts() {
  const [messages, setMessages] = useState([])
  const [showPrompts, setShowPrompts] = useState(true)

  const handlePromptSelect = (prompt) => {
    // Fill in variables and send
    const filled = prompt.content.replace(/{(\w+)}/g, (_, key) => {
      return window.prompt(`Enter ${key}:`) || ''
    })
    handleSend(filled)
    setShowPrompts(false)
  }

  return (
    <div>
      {showPrompts && <PromptLibrary prompts={prompts} onPromptSelect={handlePromptSelect} />}
      <ChatWindow messages={messages} />
    </div>
  )
}
```

---

## More Recipes

### Recipe 21: Conversation Branching

Create alternative conversation paths from any message.

```tsx
import { useMessageOperations } from '@clarity-chat/react'

export function ChatWithBranching() {
  const {
    messages,
    branchConversation,
    switchToBranch,
    getBranches,
    currentBranchId,
  } = useMessageOperations({
    initialMessages: [],
    onBranch: (branchId, parentMessageId) => {
      console.log('Branched from:', parentMessageId, 'to:', branchId)
    },
  })

  const handleBranch = (messageId: string) => {
    const branchId = branchConversation(messageId)
    switchToBranch(branchId)
    // Continue conversation from this branch
  }

  const branches = getBranches()

  return (
    <div>
      {/* Show branch selector */}
      {branches.size > 1 && (
        <select value={currentBranchId} onChange={(e) => switchToBranch(e.target.value)}>
          {Array.from(branches.keys()).map(branchId => (
            <option key={branchId} value={branchId}>
              Branch {branchId}
            </option>
          ))}
        </select>
      )}

      {/* Chat interface */}
      <ChatWindow messages={messages} />
    </div>
  )
}
```

---

### Recipe 22: Export Conversations

Export chat history to multiple formats.

```tsx
import { ChatWindow, ExportDialog } from '@clarity-chat/react'
import { exportMessages } from '@clarity-chat/react/utils/export-utils'
import { useState } from 'react'

export function ExportableChat() {
  const [messages, setMessages] = useState([])
  const [showExport, setShowExport] = useState(false)

  const handleExport = async (format: 'pdf' | 'markdown' | 'json' | 'html') => {
    const exported = await exportMessages(messages, {
      format,
      includeMetadata: true,
      includeImages: true,
    })
    
    // Download file
    const blob = new Blob([exported], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${Date.now()}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <button onClick={() => setShowExport(true)}>Export</button>
      
      <ChatWindow messages={messages} />
      
      {showExport && (
        <ExportDialog
          open={showExport}
          onOpenChange={setShowExport}
          onExport={handleExport}
          resourceType="chat"
          resourceName="Conversation"
        />
      )}
    </div>
  )
}
```

---

### Recipe 23: Authentication

Protect chat with user authentication.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useAuth } from './auth-context'

export function AuthenticatedChat() {
  const { user, login } = useAuth()

  if (!user) {
    return <button onClick={login}>Login to Chat</button>
  }

  return <ChatWindow userId={user.id} />
}
```

---

### Recipe 24: Multi-User Chat

Enable real-time multi-user conversations.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

export function MultiUserChat() {
  const [messages, setMessages] = useState([])
  const socket = io('http://localhost:3001')

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages(prev => [...prev, message])
    })

    return () => socket.disconnect()
  }, [])

  const handleSend = (content: string) => {
    socket.emit('message', { content, userId: 'user-id' })
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

---

### Recipe 25: Voice Input

Add speech-to-text capabilities.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export function VoiceEnabledChat() {
  const [messages, setMessages] = useState([])
  const [isListening, setIsListening] = useState(false)

  const startVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition()
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      handleSend(transcript)
    }
    recognition.start()
    setIsListening(true)
  }

  return (
    <div>
      <button onClick={startVoiceInput}>🎤 Voice Input</button>
      <ChatWindow messages={messages} />
    </div>
  )
}
```

---

### Recipe 26: Testing

Test your chat components.

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatWindow } from '@clarity-chat/react'

describe('ChatWindow', () => {
  it('sends messages', async () => {
    const onSend = jest.fn()
    render(<ChatWindow messages={[]} onSendMessage={onSend} />)

    const input = screen.getByPlaceholderText('Type a message...')
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSend).toHaveBeenCalledWith('Hello')
  })
})
```

---

### Recipe 27: Performance Optimization

Optimize for large message lists.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useMemo, useState } from 'react'

export function OptimizedChat() {
  const [messages, setMessages] = useState([])

  // Only show last 50 messages
  const visibleMessages = useMemo(() => {
    return messages.slice(-50)
  }, [messages])

  return <ChatWindow messages={visibleMessages} />
}
```

---

## Troubleshooting

### Common Issues and Solutions

**Issue: Messages not displaying**
- Ensure messages array has required fields (id, role, content, timestamp)
- Check console for TypeScript errors
- Verify ChatWindow is receiving messages prop

**Issue: Slow performance**
- Limit visible messages (see Recipe 25)
- Use React.memo for message components
- Implement virtual scrolling for 100+ messages

**Issue: Streaming not working**
- Verify API returns proper SSE format
- Check CORS headers
- Ensure useStreaming hook is configured correctly

**Issue: Styles not applying**
- Import CSS: `import '@clarity-chat/react/styles.css'`
- Check Tailwind CSS configuration
- Verify no CSS conflicts

---

## Next Steps

- Check out the [Storybook](../apps/storybook) for interactive examples
- Read the [API Documentation](../packages/react/README.md)
- Explore [Demo Applications](../examples/)
- Join our community forum

---

### Recipe 28: Advanced Message Search

Search through messages with full-text search, filters, and highlighting.

```tsx
import { AdvancedMessageSearch } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

function ChatWithSearch() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

  return (
    <div>
      <AdvancedMessageSearch
        messages={messages}
        onResultsChange={setFilteredMessages}
        enableAdvancedFilters
        placeholder="Search messages..."
      />
      
      {/* Display filtered messages */}
      <MessageList messages={filteredMessages} />
    </div>
  )
}
```

**Features:**
- Full-text search with deferred updates
- Filter by role, date, model, tokens
- Real-time results
- Accessible keyboard navigation

---

### Recipe 29: Command Palette

Add a command palette for quick actions and keyboard shortcuts.

```tsx
import { CommandPalette } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function ChatWithCommands() {
  const [showPalette, setShowPalette] = useState(false)

  const commands = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      shortcut: ['Ctrl', 'N'],
      category: 'Conversation',
      onSelect: () => {
        // Create new chat
        setShowPalette(false)
      },
    },
    {
      id: 'export',
      label: 'Export Conversation',
      description: 'Export current conversation',
      shortcut: ['Ctrl', 'E'],
      category: 'Conversation',
      onSelect: () => {
        // Export conversation
        setShowPalette(false)
      },
    },
    {
      id: 'search',
      label: 'Search Messages',
      description: 'Search through messages',
      shortcut: ['Ctrl', 'K'],
      category: 'Navigation',
      onSelect: () => {
        // Focus search input
        setShowPalette(false)
      },
    },
  ]

  // Open palette with Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowPalette(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
      <CommandPalette
        items={commands}
        open={showPalette}
        onClose={() => setShowPalette(false)}
      />
    </>
  )
}
```

**Features:**
- Fuzzy search through commands
- Keyboard navigation (Arrow keys, Enter, Escape)
- Shortcut hints
- Categorized commands

---

### Recipe 30: Citation Display (RAG)

Display citations from RAG sources with expandable previews.

```tsx
import { CitationCard } from '@clarity-chat/react'
import type { Citation } from '@clarity-chat/react'

function MessageWithCitations({ citations }: { citations: Citation[] }) {
  return (
    <div className="space-y-2">
      {/* AI Response */}
      <div>{response}</div>
      
      {/* Citations */}
      {citations.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold">Sources:</h4>
          {citations.map((citation, index) => (
            <CitationCard
              key={index}
              citation={citation}
              showConfidence
              onSourceClick={(url) => window.open(url, '_blank')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

**Features:**
- Confidence score badges
- Expandable preview
- Source link handling
- Document metadata display

---

### Recipe 31: Conversation List with Search

Organize multiple conversations with search and filters.

```tsx
import { ConversationList } from '@clarity-chat/react'
import { useState } from 'react'

function MultiConversationApp() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string>()

  return (
    <div className="flex">
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onDelete={(id) => {
          setConversations(prev => prev.filter(c => c.id !== id))
        }}
        onTogglePin={(id) => {
          setConversations(prev =>
            prev.map(c =>
              c.id === id ? { ...c, isPinned: !c.isPinned } : c
            )
          )
        }}
        showSearch
        showFilters
        showSort
      />
      
      {/* Active conversation */}
      <ChatWindow
        messages={getMessagesForConversation(activeId)}
        onSendMessage={handleSend}
      />
    </div>
  )
}
```

**Features:**
- Search conversations
- Filter by tags, pinned, favorites
- Sort by date, title, message count
- Pin/favorite conversations
- Multi-select for bulk operations

---

## Recipe 32: Command Palette with Message Operations

Integrate message operations (edit, regenerate, delete) with the Command Palette for keyboard-driven workflows.

### Features

- **Message Operation Commands**: Edit, regenerate, and delete commands appear when a message is selected
- **Keyboard Shortcuts**: Ctrl+E (edit), Ctrl+R (regenerate), Ctrl+D (delete)
- **Undo/Redo Integration**: Undo/Redo commands with availability checks
- **Dynamic Commands**: Commands appear/disappear based on message selection and type

### Example

```tsx
import {
  CommandPalette,
  useCommandPaletteCommands,
  useMessageOperations,
} from '@clarity-chat/react'

function ChatApp() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  const {
    messages,
    editMessage,
    regenerateMessage,
    deleteMessage,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations({
    initialMessages: [],
  })

  const selectedMessage = selectedMessageId
    ? messages.find(m => m.id === selectedMessageId)
    : null

  // Generate message operation commands
  const messageOperationCommands = useCommandPaletteCommands({
    selectedMessageId,
    isUserMessage: selectedMessage?.role === 'user',
    isAssistantMessage: selectedMessage?.role === 'assistant',
    onEdit: (id) => {
      const message = messages.find(m => m.id === id)
      if (message) {
        const newContent = prompt('Edit:', message.content) || message.content
        editMessage(id, newContent)
      }
      setSelectedMessageId(null)
    },
    onRegenerate: regenerateMessage,
    onDelete: (id) => {
      if (confirm('Delete?')) {
        deleteMessage(id)
        if (selectedMessageId === id) setSelectedMessageId(null)
      }
    },
    undo,
    redo,
    canUndo,
    canRedo,
  })

  // Additional custom commands
  const customCommands = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      shortcut: ['Ctrl', 'N'],
      category: 'Conversation',
      onSelect: () => {
        // Start new chat
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
        // Export logic
        setShowCommandPalette(false)
      },
    },
  ]

  const allCommands = [...customCommands, ...messageOperationCommands]

  // Keyboard shortcut to open palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <ChatWindow
        messages={messages}
        onMessageClick={(messageId) => setSelectedMessageId(messageId)}
        // ... other props
      />

      <CommandPalette
        items={allCommands}
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </>
  )
}
```

### Command Categories

- **Message**: Edit, Regenerate, Delete (appear when message selected)
- **Edit**: Undo, Redo (always available)
- **Conversation**: New Chat, Export, etc. (custom commands)

### Keyboard Shortcuts

- **Ctrl+K** (or Cmd+K): Open command palette
- **Ctrl+E**: Edit selected message (if user message)
- **Ctrl+R**: Regenerate selected message (if assistant message)
- **Ctrl+D**: Delete selected message
- **Ctrl+Z**: Undo last operation
- **Ctrl+Y**: Redo last undone operation

### Tips

1. **Message Selection**: Implement click handlers on messages to set `selectedMessageId`
2. **Command Availability**: Commands automatically appear/disappear based on selection
3. **Custom Commands**: Add your own commands alongside message operations
4. **Keyboard Navigation**: Use arrow keys to navigate, Enter to select, Esc to close

---

## Recipe 33: Folder Organization for Conversations

Organize conversations into folders for better management and navigation.

### Features

- **Create Folders**: Create custom folders to organize conversations
- **Move Conversations**: Move conversations between folders or remove from folders
- **Folder Filtering**: Filter conversations by selected folder
- **Folder Management**: Delete folders and manage folder structure
- **Visual Organization**: Clear visual hierarchy with folder indicators

### Example

```tsx
import {
  ConversationList,
  type Conversation,
  type Folder,
} from '@clarity-chat/react'
import { useState } from 'react'

function OrganizedChatApp() {
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: 'work',
      name: 'Work',
      createdAt: Date.now(),
      conversationCount: 0,
    },
    {
      id: 'personal',
      name: 'Personal',
      createdAt: Date.now(),
      conversationCount: 0,
    },
  ])

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Project Discussion',
      preview: 'Let\'s discuss the new feature...',
      timestamp: Date.now(),
      messageCount: 5,
      folderId: 'work',
    },
    {
      id: '2',
      title: 'Weekend Plans',
      preview: 'What are you doing this weekend?',
      timestamp: Date.now(),
      messageCount: 3,
      folderId: 'personal',
    },
  ])

  const [activeFolderId, setActiveFolderId] = useState<string | null | undefined>(undefined)

  return (
    <ConversationList
      conversations={conversations}
      folders={folders}
      activeFolderId={activeFolderId}
      onSelect={(id) => console.log('Selected:', id)}
      onFolderSelect={setActiveFolderId}
      onDelete={(id) => {
        setConversations(prev => prev.filter(c => c.id !== id))
      }}
      onDeleteFolder={(folderId) => {
        setFolders(prev => prev.filter(f => f.id !== folderId))
        // Remove folderId from conversations
        setConversations(prev =>
          prev.map(c =>
            c.folderId === folderId ? { ...c, folderId: undefined } : c
          )
        )
      }}
      onMoveToFolder={(conversationId, folderId) => {
        setConversations(prev =>
          prev.map(c =>
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
        setFolders(prev => [...prev, newFolder])
      }}
      showFolders={true}
      showSearch={true}
      showFilters={true}
      showSort={true}
    />
  )
}
```

### Folder Interface

```tsx
interface Folder {
  id: string
  name: string
  color?: string
  icon?: string
  createdAt: number
  conversationCount?: number
}
```

### Conversation Interface Update

```tsx
interface Conversation {
  // ... existing fields
  folderId?: string  // Optional folder assignment
}
```

### Props

- **`folders`**: Array of folder objects
- **`activeFolderId`**: Currently selected folder (null for uncategorized, undefined for all)
- **`onFolderSelect`**: Callback when folder is selected
- **`onCreateFolder`**: Callback to create new folder
- **`onDeleteFolder`**: Callback to delete folder
- **`onMoveToFolder`**: Callback to move conversation to folder
- **`onRenameFolder`**: Callback to rename folder (optional)
- **`showFolders`**: Enable folder organization UI

### Folder Operations

1. **Create Folder**: Click folder icon in header, enter name, press Enter
2. **Select Folder**: Click folder to filter conversations
3. **Move Conversation**: Use folder icon button on conversation item
4. **Delete Folder**: Click delete icon on folder (removes folderId from conversations)

### Tips

1. **Folder Structure**: Plan your folder structure before creating many folders
2. **Uncategorized**: Conversations without `folderId` appear in "All Conversations"
3. **Folder Counts**: Folder shows conversation count automatically
4. **Filtering**: Selecting a folder filters conversations to that folder only
5. **Bulk Operations**: Use multi-select with folder operations for bulk moves

---

**Built with ❤️ by Code & Clarity**
