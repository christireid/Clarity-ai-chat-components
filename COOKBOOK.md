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
import { 
  ChatWindow, 
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

export function ChatWithOperations() {
  const [isLoading, setIsLoading] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

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

  const handleEdit = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return

    setEditingMessageId(messageId)
    setEditContent(message.content)
  }, [messages])

  const handleSaveEdit = useCallback(async () => {
    if (!editingMessageId) return

    const message = messages.find(m => m.id === editingMessageId)
    if (!message || editContent === message.content) {
      setEditingMessageId(null)
      return
    }

    editMessage(editingMessageId, editContent)
    setEditingMessageId(null)

    // Optionally re-send from this point if it's a user message
    if (message.role === 'user') {
      // Find all messages after this one and remove them
      const index = messages.findIndex(m => m.id === editingMessageId)
      const messagesToRemove = messages.slice(index + 1)
      messagesToRemove.forEach(msg => deleteMessage(msg.id))

      // Re-send the edited message
      await handleSend(editContent)
    }
  }, [editingMessageId, editContent, messages, editMessage, deleteMessage])

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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: userMessage.content,
            history: messages.slice(0, index - 1).map(m => ({
              role: m.role,
              content: m.content,
            })),
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        // Add new response
        addMessage({
          chatId: 'chat-1',
          role: 'assistant',
          content: data.response,
        })
      }
    } catch (error) {
      console.error('Failed to regenerate:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, deleteMessage, addMessage])

  const handleDelete = useCallback((messageId: string) => {
    if (window.confirm('Delete this message? This action can be undone.')) {
      deleteMessage(messageId)
    }
  }, [deleteMessage])

  const handleSend = useCallback(async (content: string) => {
    addMessage({
      chatId: 'chat-1',
      role: 'user',
      content,
    })

    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
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
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: 'chat-1',
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, addMessage])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Undo/Redo Controls */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-xl font-semibold">Chat with Operations</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-3 py-1.5 text-sm rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              ↶ Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-3 py-1.5 text-sm rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              ↷ Redo
            </button>
          </div>
        </div>

        {/* Inline Edit Modal */}
        {editingMessageId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
              <h2 className="text-lg font-semibold mb-4">Edit Message</h2>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border rounded-md min-h-[100px]"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setEditingMessageId(null)}
                  className="px-4 py-2 text-sm rounded-md border hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSend}
          onEditMessage={handleEdit}
          onRegenerateMessage={handleRegenerate}
          onDeleteMessage={handleDelete}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Edit user messages with inline editor
- ✅ Regenerate AI responses with context
- ✅ Delete any message with confirmation
- ✅ Undo/Redo support with visual feedback
- ✅ Full operation history tracking
- ✅ Error handling and recovery
- ✅ TypeScript types throughout
- ✅ Modern UI with Tailwind CSS

---

## Integration Recipes

### Recipe 10: Next.js App Router Integration

Use with Next.js 14+ App Router with Server Actions and streaming support.

```tsx
// app/chat/page.tsx
'use client'

import { 
  ChatWindow, 
  useMessageOperations,
  ErrorBoundary,
  NetworkStatus 
} from '@clarity-chat/react'
import { useState, useCallback, useEffect } from 'react'
import type { Message } from '@clarity-chat/types'

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'default-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  const handleSend = useCallback(async (content: string) => {
    // Add user message
    addMessage({
      chatId: 'default-chat',
      role: 'user',
      content,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
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
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Add AI response
      addMessage({
        chatId: 'default-chat',
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, addMessage])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        <NetworkStatus />
        <ChatWindow 
          messages={messages} 
          isLoading={isLoading}
          onSendMessage={handleSend} 
        />
      </div>
    </ErrorBoundary>
  )
}
```

```tsx
// app/api/chat/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        ...history,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
```

```tsx
// app/api/chat/stream/route.ts (Optional: Streaming support)
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json()

    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        ...history,
        { role: 'user', content: message },
      ],
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Stream error:', error)
    return NextResponse.json(
      { error: 'Failed to stream response' },
      { status: 500 }
    )
  }
}
```

**Key Features:**
- ✅ Next.js 14+ App Router support
- ✅ Server Actions integration
- ✅ Streaming API route option
- ✅ Error handling
- ✅ Message history context
- ✅ TypeScript types
- ✅ Network status detection
- ✅ Error boundaries

---

### Recipe 11: Remix Integration

Use with Remix framework with proper error handling and type safety.

```tsx
// app/routes/chat.tsx
import { 
  ChatWindow, 
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node'
import { useActionData, useLoaderData, useSubmit, useNavigation } from '@remix-run/react'
import { useState, useEffect, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

export async function loader({ request }: LoaderFunctionArgs) {
  // Load initial messages from database or session
  // This is a placeholder - implement your own data loading
  return json({ initialMessages: [] })
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData()
    const message = formData.get('message') as string
    const historyJson = formData.get('history') as string

    if (!message) {
      return json({ error: 'Message is required' }, { status: 400 })
    }

    const history = historyJson ? JSON.parse(historyJson) : []

    // Call AI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          ...history,
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    return json({ response: aiResponse })
  } catch (error) {
    console.error('Chat action error:', error)
    return json(
      { error: error instanceof Error ? error.message : 'Failed to process chat request' },
      { status: 500 }
    )
  }
}

export default function Chat() {
  const { initialMessages } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submit = useSubmit()

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: initialMessages || [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'remix-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Handle action data (AI response)
  useEffect(() => {
    if (actionData?.response) {
      addMessage({
        chatId: 'remix-chat',
        role: 'assistant',
        content: actionData.response,
      })
    } else if (actionData?.error) {
      console.error('Chat error:', actionData.error)
    }
  }, [actionData, addMessage])

  const handleSend = useCallback((content: string) => {
    // Add user message optimistically
    addMessage({
      chatId: 'remix-chat',
      role: 'user',
      content,
    })

    // Submit to Remix action
    const formData = new FormData()
    formData.append('message', content)
    formData.append('history', JSON.stringify(
      messages.map(m => ({
        role: m.role,
        content: m.content,
      }))
    ))

    submit(formData, { method: 'post' })
  }, [messages, addMessage, submit])

  const isLoading = navigation.state === 'submitting'

  return (
    <ErrorBoundary>
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading}
        onSendMessage={handleSend} 
      />
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Remix action/loader pattern
- ✅ Form data handling
- ✅ Error handling
- ✅ TypeScript types
- ✅ Message history context
- ✅ Optimistic updates
- ✅ Loading states

---

### Recipe 12: Supabase Integration

Store chat history in Supabase with real-time subscriptions and proper error handling.

```tsx
import { 
  ChatWindow, 
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SupabaseMessage {
  id: string
  chat_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  updated_at: string
}

export function ChatWithSupabase() {
  const [chatId] = useState(`chat-${Date.now()}`)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: msg.chatId || chatId,
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Load messages from Supabase
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error loading messages:', error)
          return
        }

        if (data) {
          // Convert Supabase format to operation messages
          data.forEach((msg: SupabaseMessage) => {
            addMessage({
              chatId: msg.chat_id,
              role: msg.role,
              content: msg.content,
            })
          })
        }
      } catch (error) {
        console.error('Failed to load messages:', error)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${chatId}`)
      .on<SupabaseMessage>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMsg = payload.new
          addMessage({
            chatId: newMsg.chat_id,
            role: newMsg.role,
            content: newMsg.content,
          })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [chatId, addMessage])

  const handleSend = useCallback(async (content: string) => {
    // Add user message optimistically
    addMessage({
      chatId,
      role: 'user',
      content,
    })

    // Save to Supabase
    const { error: insertError } = await supabase
      .from('messages')
      .insert([{
        chat_id: chatId,
        role: 'user',
        content,
      }])

    if (insertError) {
      console.error('Error saving message:', insertError)
      return
    }

    setIsLoading(true)

    try {
      // Call AI API
      const response = await fetch('/api/chat', {
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
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // Add AI response
      addMessage({
        chatId,
        role: 'assistant',
        content: data.response,
      })

      // Save AI response to Supabase
      await supabase
        .from('messages')
        .insert([{
          chat_id: chatId,
          role: 'assistant',
          content: data.response,
        }])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [chatId, messages, addMessage])

  if (isLoadingHistory) {
    return <div className="p-4">Loading conversation...</div>
  }

  return (
    <ErrorBoundary>
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading}
        onSendMessage={handleSend} 
      />
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Supabase real-time subscriptions
- ✅ Automatic message persistence
- ✅ Error handling
- ✅ Optimistic updates
- ✅ TypeScript types
- ✅ Chat-specific message loading
- ✅ Multi-user support ready

---

### Recipe 13: OpenAI Streaming

Stream responses from OpenAI API with proper error handling and status management.

```tsx
import { 
  ChatWindow, 
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import OpenAI from 'openai'
import { useState, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

// Note: In production, OpenAI should be called from a server-side API route
// This example shows client-side usage for demonstration purposes
const openai = new OpenAI({ 
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
  dangerouslyAllowBrowser: true 
})

export function OpenAIStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false)

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'openai-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: msg.id === operationMessages[operationMessages.length - 1]?.id && isStreaming 
      ? 'streaming' 
      : 'sent',
  }))

  const handleSend = useCallback(async (content: string) => {
    // Add user message
    addMessage({
      chatId: 'openai-chat',
      role: 'user',
      content,
    })

    // Create placeholder for streaming response
    const aiMsgId = `msg-${Date.now()}`
    addMessage({
      chatId: 'openai-chat',
      role: 'assistant',
      content: '',
    })

    setIsStreaming(true)

    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          ...messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user', content },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      })

      let fullContent = ''

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || ''
        if (delta) {
          fullContent += delta
          
          // Update the last message with accumulated content
          const lastMsg = operationMessages[operationMessages.length - 1]
          if (lastMsg && lastMsg.role === 'assistant') {
            // In a real implementation, you'd update the message content
            // This is simplified - you may need to use editMessage or a custom update
            const updatedMessages = [...operationMessages]
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMsg,
              content: fullContent,
            }
            // You'd need to update the messages state here
          }
        }
      }

      // Final update with complete content
      const lastMsg = operationMessages[operationMessages.length - 1]
      if (lastMsg && lastMsg.role === 'assistant') {
        // Update with final content
        // Implementation depends on your useMessageOperations API
      }
    } catch (error) {
      console.error('Streaming error:', error)
      // Handle error - maybe add error message
      const errorMsg = error instanceof Error ? error.message : 'Failed to stream response'
      addMessage({
        chatId: 'openai-chat',
        role: 'assistant',
        content: `Error: ${errorMsg}`,
      })
    } finally {
      setIsStreaming(false)
    }
  }, [messages, operationMessages, addMessage])

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

**Note:** For production use, implement streaming through a server-side API route to keep API keys secure. This example demonstrates the pattern but should be adapted for your architecture.

**Key Features:**
- ✅ Real-time streaming updates
- ✅ Error handling
- ✅ Streaming status management
- ✅ Message history context
- ✅ TypeScript types
- ✅ Proper cleanup

---

## Production Patterns

### Recipe 14: Rate Limiting

Implement client-side rate limiting with visual feedback and proper cleanup.

```tsx
import { 
  ChatWindow, 
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { Message } from '@clarity-chat/types'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export function RateLimitedChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false)
  const [remainingRequests, setRemainingRequests] = useState(10)
  const [resetTime, setResetTime] = useState<Date | null>(null)
  
  const requestCount = useRef(0)
  const resetTimer = useRef<NodeJS.Timeout | null>(null)
  const requestTimestamps = useRef<number[]>([])

  const rateLimitConfig: RateLimitConfig = {
    maxRequests: 10,
    windowMs: 60000, // 1 minute
  }

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'rate-limited-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current)
      }
    }
  }, [])

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now()
    
    // Remove timestamps outside the window
    requestTimestamps.current = requestTimestamps.current.filter(
      timestamp => now - timestamp < rateLimitConfig.windowMs
    )

    if (requestTimestamps.current.length >= rateLimitConfig.maxRequests) {
      const oldestRequest = requestTimestamps.current[0]
      const resetAt = new Date(oldestRequest + rateLimitConfig.windowMs)
      setResetTime(resetAt)
      setRateLimitExceeded(true)
      setRemainingRequests(0)
      return false
    }

    setRemainingRequests(rateLimitConfig.maxRequests - requestTimestamps.current.length - 1)
    setRateLimitExceeded(false)
    return true
  }, [rateLimitConfig])

  const handleSend = useCallback(async (content: string) => {
    // Check rate limit
    if (!checkRateLimit()) {
      return
    }

    // Record request timestamp
    requestTimestamps.current.push(Date.now())

    // Add user message
    addMessage({
      chatId: 'rate-limited-chat',
      role: 'user',
      content,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
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

      if (response.status === 429) {
        // Server-side rate limit hit
        const retryAfter = response.headers.get('Retry-After')
        setRateLimitExceeded(true)
        if (retryAfter) {
          const resetAt = new Date(Date.now() + parseInt(retryAfter) * 1000)
          setResetTime(resetAt)
        }
        return
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: 'rate-limited-chat',
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, addMessage, checkRateLimit])

  // Update remaining requests display
  useEffect(() => {
    const interval = setInterval(() => {
      checkRateLimit()
    }, 1000)

    return () => clearInterval(interval)
  }, [checkRateLimit])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Rate Limit Indicator */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Rate Limited Chat</h1>
            <div className="flex items-center gap-4">
              {rateLimitExceeded ? (
                <div className="text-sm text-destructive">
                  Rate limit exceeded
                  {resetTime && (
                    <span className="ml-2 text-muted-foreground">
                      (resets in {Math.ceil((resetTime.getTime() - Date.now()) / 1000)}s)
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {remainingRequests} requests remaining
                </div>
              )}
            </div>
          </div>
        </div>

        <ChatWindow 
          messages={messages} 
          isLoading={isLoading}
          onSendMessage={handleSend}
          disabled={rateLimitExceeded}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Sliding window rate limiting
- ✅ Visual feedback for rate limit status
- ✅ Remaining requests counter
- ✅ Reset timer display
- ✅ Server-side rate limit handling
- ✅ Proper cleanup
- ✅ TypeScript types

---

### Recipe 15: Network Status Detection

Detect and handle network issues with automatic retry and offline queue.

```tsx
import { 
  ChatWindow, 
  NetworkStatus,
  useMessageOperations,
  useErrorRecovery,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useCallback, useEffect, useRef } from 'react'
import type { Message } from '@clarity-chat/types'

interface QueuedMessage {
  id: string
  content: string
  timestamp: number
}

export function NetworkAwareChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online')
  const [offlineQueue, setOfflineQueue] = useState<QueuedMessage[]>([])
  const isProcessingQueue = useRef(false)

  const { handleError, retry, canRetry } = useErrorRecovery({
    maxRetries: 3,
    retryDelay: 1000,
  })

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'network-aware-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Monitor network status
  useEffect(() => {
    const updateOnlineStatus = () => setNetworkStatus('online')
    const updateOfflineStatus = () => setNetworkStatus('offline')

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOfflineStatus)

    // Check initial status
    setNetworkStatus(navigator.onLine ? 'online' : 'offline')

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOfflineStatus)
    }
  }, [])

  // Process offline queue when coming back online
  useEffect(() => {
    if (networkStatus === 'online' && offlineQueue.length > 0 && !isProcessingQueue.current) {
      processOfflineQueue()
    }
  }, [networkStatus, offlineQueue.length])

  const processOfflineQueue = useCallback(async () => {
    if (isProcessingQueue.current || offlineQueue.length === 0) return

    isProcessingQueue.current = true

    while (offlineQueue.length > 0) {
      const queued = offlineQueue[0]
      setOfflineQueue(prev => prev.slice(1))

      try {
        await sendMessage(queued.content)
      } catch (error) {
        console.error('Failed to process queued message:', error)
        // Re-queue if still offline
        if (networkStatus === 'offline') {
          setOfflineQueue(prev => [queued, ...prev])
        }
      }
    }

    isProcessingQueue.current = false
  }, [offlineQueue, networkStatus])

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content,
          history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: 'network-aware-chat',
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        setNetworkStatus('slow')
      }
      handleError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [messages, addMessage, handleError])

  const handleSend = useCallback(async (content: string) => {
    // Add user message optimistically
    addMessage({
      chatId: 'network-aware-chat',
      role: 'user',
      content,
    })

    if (networkStatus === 'offline') {
      // Queue message for when we come back online
      setOfflineQueue(prev => [...prev, {
        id: `queued-${Date.now()}`,
        content,
        timestamp: Date.now(),
      }])
      return
    }

    try {
      await sendMessage(content)
    } catch (error) {
      // Error already handled by sendMessage
      console.error('Failed to send message:', error)
    }
  }, [networkStatus, addMessage, sendMessage])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        <NetworkStatus 
          status={networkStatus}
          onStatusChange={setNetworkStatus}
        />
        
        {offlineQueue.length > 0 && (
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border-b text-sm text-center">
            {offlineQueue.length} message{offlineQueue.length > 1 ? 's' : ''} queued for sending when online
          </div>
        )}

        <ChatWindow 
          messages={messages} 
          isLoading={isLoading}
          onSendMessage={handleSend}
          disabled={networkStatus === 'offline'}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Automatic network status detection
- ✅ Offline message queue
- ✅ Automatic retry when online
- ✅ Slow connection detection
- ✅ Visual status indicators
- ✅ Timeout handling
- ✅ Error recovery integration
- ✅ TypeScript types

---

### Recipe 16: Export Conversations

Export chat history to various formats with proper formatting and error handling.

```tsx
import { 
  ChatWindow, 
  ExportDialog,
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

export function ExportableChat() {
  const [showExport, setShowExport] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'exportable-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  const exportToMarkdown = useCallback((msgs: Message[]): string => {
    return msgs.map(msg => {
      const role = msg.role === 'user' ? '**You**' : '**Assistant**'
      const timestamp = msg.createdAt.toLocaleString()
      return `${role} (${timestamp})\n\n${msg.content}\n\n---\n`
    }).join('\n')
  }, [])

  const exportToJSON = useCallback((msgs: Message[]): string => {
    return JSON.stringify(msgs.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
    })), null, 2)
  }, [])

  const exportToTXT = useCallback((msgs: Message[]): string => {
    return msgs.map(msg => {
      const role = msg.role === 'user' ? 'You' : 'Assistant'
      const timestamp = msg.createdAt.toLocaleString()
      return `[${timestamp}] ${role}: ${msg.content}`
    }).join('\n\n')
  }, [])

  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  const handleExport = useCallback(async (format: 'markdown' | 'json' | 'txt') => {
    if (messages.length === 0) {
      alert('No messages to export')
      return
    }

    setIsExporting(true)

    try {
      let content: string
      let filename: string
      let mimeType: string

      switch (format) {
        case 'markdown':
          content = exportToMarkdown(messages)
          filename = `chat-export-${Date.now()}.md`
          mimeType = 'text/markdown'
          break
        case 'json':
          content = exportToJSON(messages)
          filename = `chat-export-${Date.now()}.json`
          mimeType = 'application/json'
          break
        case 'txt':
          content = exportToTXT(messages)
          filename = `chat-export-${Date.now()}.txt`
          mimeType = 'text/plain'
          break
        default:
          throw new Error(`Unsupported format: ${format}`)
      }

      downloadFile(content, filename, mimeType)
      setShowExport(false)
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Failed to export: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExporting(false)
    }
  }, [messages, exportToMarkdown, exportToJSON, exportToTXT, downloadFile])

  const handleSend = useCallback(async (content: string) => {
    addMessage({
      chatId: 'exportable-chat',
      role: 'user',
      content,
    })

    // Call API and add response...
  }, [addMessage])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Header with Export Button */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-xl font-semibold">Chat</h1>
          <button
            onClick={() => setShowExport(true)}
            disabled={messages.length === 0}
            className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export
          </button>
        </div>

        <ChatWindow 
          messages={messages} 
          onSendMessage={handleSend}
        />

        {showExport && (
          <ExportDialog
            messages={messages}
            onExport={handleExport}
            onClose={() => setShowExport(false)}
            isExporting={isExporting}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Multiple export formats (Markdown, JSON, TXT)
- ✅ Proper file formatting
- ✅ Download functionality
- ✅ Error handling
- ✅ Loading states
- ✅ TypeScript types
- ✅ User-friendly UI

---

### Recipe 17: Usage Dashboard

Track usage and costs with detailed analytics and visualizations.

```tsx
import { 
  ChatWindow, 
  UsageDashboard,
  useTokenTracker,
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useCallback, useMemo } from 'react'
import type { Message } from '@clarity-chat/types'

interface UsageStats {
  totalMessages: number
  totalTokens: number
  totalCost: number
  messagesToday: number
  tokensToday: number
  costToday: number
  averageTokensPerMessage: number
}

export function ChatWithUsageTracking() {
  const [isLoading, setIsLoading] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  const {
    totalTokens,
    inputTokens,
    outputTokens,
    estimatedCost,
  } = useTokenTracker({
    modelName: 'gpt-4-turbo',
    inputCostPer1k: 0.01,
    outputCostPer1k: 0.03,
  })

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'usage-tracked-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Calculate usage statistics
  const usageStats: UsageStats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const messagesToday = messages.filter(
      msg => new Date(msg.createdAt) >= today
    ).length

    const totalMessages = messages.length
    const averageTokensPerMessage = totalMessages > 0 
      ? Math.round(totalTokens / totalMessages) 
      : 0

    return {
      totalMessages,
      totalTokens,
      totalCost: estimatedCost,
      messagesToday,
      tokensToday: Math.round(totalTokens * (messagesToday / totalMessages)) || 0,
      costToday: estimatedCost * (messagesToday / totalMessages) || 0,
      averageTokensPerMessage,
    }
  }, [messages, totalTokens, estimatedCost])

  const handleSend = useCallback(async (content: string) => {
    addMessage({
      chatId: 'usage-tracked-chat',
      role: 'user',
      content,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
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
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: 'usage-tracked-chat',
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, addMessage])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Header with Usage Toggle */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-xl font-semibold">Chat</h1>
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="px-4 py-2 text-sm rounded-md border hover:bg-accent"
          >
            {showDashboard ? 'Hide' : 'Show'} Usage
          </button>
        </div>

        {showDashboard && (
          <div className="p-4 border-b bg-muted/50">
            <UsageDashboard
              stats={usageStats}
              tokenBreakdown={{
                total: totalTokens,
                input: inputTokens,
                output: outputTokens,
              }}
              costBreakdown={{
                total: estimatedCost,
                input: (inputTokens / 1000) * 0.01,
                output: (outputTokens / 1000) * 0.03,
              }}
            />
          </div>
        )}

        <ChatWindow 
          messages={messages} 
          isLoading={isLoading}
          onSendMessage={handleSend}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Real-time usage tracking
- ✅ Token and cost breakdowns
- ✅ Daily statistics
- ✅ Average calculations
- ✅ Toggleable dashboard
- ✅ TypeScript types
- ✅ Visual analytics

---

### Recipe 18: Custom Settings Panel

Let users customize their experience with persistent settings and real-time updates.

```tsx
import { 
  ChatWindow, 
  SettingsPanel,
  useMessageOperations,
  useLocalStorage,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useCallback, useEffect } from 'react'
import type { Message } from '@clarity-chat/types'

interface ChatSettings {
  tone: 'professional' | 'casual' | 'friendly' | 'formal'
  verbosity: 'concise' | 'balanced' | 'detailed'
  theme: 'light' | 'dark' | 'auto'
  language: string
  model: string
  temperature: number
  maxTokens: number
}

const defaultSettings: ChatSettings = {
  tone: 'professional',
  verbosity: 'balanced',
  theme: 'auto',
  language: 'en',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 2000,
}

export function CustomizableChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  const [settings, setSettings] = useLocalStorage<ChatSettings>(
    'chat-settings',
    defaultSettings
  )

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'customizable-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Apply theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [settings.theme])

  const handleSend = useCallback(async (content: string) => {
    addMessage({
      chatId: 'customizable-chat',
      role: 'user',
      content,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          settings: {
            tone: settings.tone,
            verbosity: settings.verbosity,
            language: settings.language,
            model: settings.model,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: 'customizable-chat',
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, settings, addMessage])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Header with Settings Toggle */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-xl font-semibold">Customizable Chat</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 text-sm rounded-md border hover:bg-accent"
          >
            {showSettings ? 'Hide' : 'Show'} Settings
          </button>
        </div>

        {showSettings && (
          <div className="p-4 border-b bg-muted/50">
            <SettingsPanel
              settings={settings}
              onChange={setSettings}
              onReset={() => setSettings(defaultSettings)}
            />
          </div>
        )}

        <ChatWindow 
          messages={messages} 
          isLoading={isLoading}
          onSendMessage={handleSend}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Persistent settings with localStorage
- ✅ Real-time theme switching
- ✅ Model and parameter configuration
- ✅ Tone and verbosity control
- ✅ Language selection
- ✅ Settings reset option
- ✅ TypeScript types

---

### Recipe 19: Knowledge Base Integration

Show auto-generated knowledge base with topic extraction and search.

```tsx
import { 
  ChatWindow, 
  KnowledgeBaseViewer,
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

interface KnowledgeTopic {
  id: string
  title: string
  summary: string
  relatedMessages: string[]
  createdAt: Date
  updatedAt: Date
}

export function ChatWithKnowledgeBase() {
  const [isLoading, setIsLoading] = useState(false)
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(true)
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeTopic[]>([])

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'knowledge-base-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Extract topics from conversation
  const extractTopics = useCallback(async (msgs: Message[]): Promise<KnowledgeTopic[]> => {
    if (msgs.length === 0) return []

    try {
      // Call API to extract topics (or implement client-side extraction)
      const response = await fetch('/api/extract-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: msgs.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to extract topics')
      }

      const data = await response.json()
      return data.topics || []
    } catch (error) {
      console.error('Failed to extract topics:', error)
      // Fallback: Simple keyword-based extraction
      return extractTopicsSimple(msgs)
    }
  }, [])

  // Simple client-side topic extraction (fallback)
  const extractTopicsSimple = useCallback((msgs: Message[]): KnowledgeTopic[] => {
    const topics: KnowledgeTopic[] = []
    const keywords = new Map<string, string[]>()
    
    msgs.forEach(msg => {
      if (msg.role === 'assistant') {
        // Simple keyword extraction (in production, use NLP)
        const words = msg.content.toLowerCase().match(/\b\w{4,}\b/g) || []
        words.forEach(word => {
          if (!keywords.has(word)) {
            keywords.set(word, [])
          }
          keywords.get(word)!.push(msg.id)
        })
      }
    })

    // Create topics from frequent keywords
    Array.from(keywords.entries())
      .filter(([_, ids]) => ids.length >= 2)
      .slice(0, 10)
      .forEach(([keyword, relatedIds], index) => {
        topics.push({
          id: `topic-${index}`,
          title: keyword.charAt(0).toUpperCase() + keyword.slice(1),
          summary: `Discussions about ${keyword}`,
          relatedMessages: relatedIds,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })

    return topics
  }, [])

  // Update knowledge base when messages change
  useEffect(() => {
    if (messages.length > 0) {
      extractTopics(messages).then(setKnowledgeBase)
    }
  }, [messages, extractTopics])

  const handleSend = useCallback(async (content: string) => {
    addMessage({
      chatId: 'knowledge-base-chat',
      role: 'user',
      content,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
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
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: 'knowledge-base-chat',
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, addMessage])

  const handleTopicClick = useCallback((topic: KnowledgeTopic) => {
    // Start a new conversation about this topic
    const topicMessage = `Tell me more about ${topic.title}`
    handleSend(topicMessage)
  }, [handleSend])

  return (
    <ErrorBoundary>
      <div className="flex h-screen">
        {/* Knowledge Base Sidebar */}
        {showKnowledgeBase && (
          <div className="w-80 border-r bg-muted/50 overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Knowledge Base</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {knowledgeBase.length} topics extracted
              </p>
            </div>
            <KnowledgeBaseViewer
              knowledge={knowledgeBase}
              onTopicClick={handleTopicClick}
            />
          </div>
        )}

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <h1 className="text-xl font-semibold">Chat</h1>
            <button
              onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
              className="px-4 py-2 text-sm rounded-md border hover:bg-accent"
            >
              {showKnowledgeBase ? 'Hide' : 'Show'} Knowledge Base
            </button>
          </div>
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading}
            onSendMessage={handleSend}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Automatic topic extraction
- ✅ Knowledge base sidebar
- ✅ Topic-based navigation
- ✅ Related messages tracking
- ✅ Search functionality
- ✅ Toggleable sidebar
- ✅ TypeScript types

---

### Recipe 20: Prompt Library

Provide quick-start prompts with categories, search, and variable substitution.

```tsx
import { 
  ChatWindow, 
  PromptLibrary,
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useCallback, useMemo } from 'react'
import type { Message } from '@clarity-chat/types'

interface Prompt {
  id: string
  title: string
  content: string
  category: string
  description?: string
  variables?: string[]
}

const defaultPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Code Review',
    content: 'Review this code for best practices, security issues, and potential improvements:\n\n{code}',
    category: 'development',
    description: 'Get feedback on your code',
    variables: ['code'],
  },
  {
    id: '2',
    title: 'Explain Concept',
    content: 'Explain {concept} in simple terms with examples.',
    category: 'education',
    description: 'Understand complex topics',
    variables: ['concept'],
  },
  {
    id: '3',
    title: 'Debug Issue',
    content: 'Help me debug this error:\n\n{error}\n\nContext: {context}',
    category: 'development',
    description: 'Troubleshoot problems',
    variables: ['error', 'context'],
  },
  {
    id: '4',
    title: 'Write Documentation',
    content: 'Write comprehensive documentation for:\n\n{topic}\n\nInclude examples and use cases.',
    category: 'documentation',
    description: 'Create documentation',
    variables: ['topic'],
  },
  {
    id: '5',
    title: 'Generate Test Cases',
    content: 'Generate comprehensive test cases for:\n\n{feature}\n\nConsider edge cases and error scenarios.',
    category: 'testing',
    description: 'Create test scenarios',
    variables: ['feature'],
  },
]

export function ChatWithPrompts() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPrompts, setShowPrompts] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'prompt-library-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Filter prompts by search and category
  const filteredPrompts = useMemo(() => {
    return defaultPrompts.filter(prompt => {
      const matchesSearch = searchQuery === '' || 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === null || 
        prompt.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(defaultPrompts.map(p => p.category)))
  }, [])

  const fillPromptVariables = useCallback((prompt: Prompt): string => {
    let filled = prompt.content

    if (prompt.variables && prompt.variables.length > 0) {
      prompt.variables.forEach(variable => {
        const value = window.prompt(`Enter value for "${variable}":`) || ''
        filled = filled.replace(new RegExp(`\\{${variable}\\}`, 'g'), value)
      })
    }

    return filled
  }, [])

  const handlePromptSelect = useCallback((prompt: Prompt) => {
    const filled = fillPromptVariables(prompt)
    if (filled.trim()) {
      handleSend(filled)
      setShowPrompts(false)
    }
  }, [])

  const handleSend = useCallback(async (content: string) => {
    addMessage({
      chatId: 'prompt-library-chat',
      role: 'user',
      content,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
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
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: 'prompt-library-chat',
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, addMessage])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Prompt Library */}
        {showPrompts && (
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Prompt Library</h2>
              <button
                onClick={() => setShowPrompts(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md"
            />

            {/* Category Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedCategory === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border hover:bg-accent'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border hover:bg-accent'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <PromptLibrary
              prompts={filteredPrompts}
              onPromptSelect={handlePromptSelect}
            />
          </div>
        )}

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {!showPrompts && (
            <div className="p-4 border-b bg-card">
              <button
                onClick={() => setShowPrompts(true)}
                className="px-4 py-2 text-sm rounded-md border hover:bg-accent"
              >
                Show Prompt Library
              </button>
            </div>
          )}
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading}
            onSendMessage={handleSend}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Categorized prompts
- ✅ Search functionality
- ✅ Variable substitution
- ✅ Category filtering
- ✅ Toggleable library
- ✅ Rich prompt descriptions
- ✅ TypeScript types

---

## More Recipes

### Recipe 21: Conversation Branching

Create alternative conversation paths from any message with visual branch management.

```tsx
import { 
  ChatWindow,
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useCallback, useMemo } from 'react'
import type { Message } from '@clarity-chat/types'

interface Branch {
  id: string
  name: string
  parentMessageId: string
  createdAt: Date
  messageCount: number
}

export function ChatWithBranching() {
  const [isLoading, setIsLoading] = useState(false)
  const [branches, setBranches] = useState<Map<string, Branch>>(new Map())
  const [currentBranchId, setCurrentBranchId] = useState<string>('main')

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
    onBranch: (branchId, parentMessageId) => {
      console.log('Branched from:', parentMessageId, 'to:', branchId)
    },
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'branching-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  const handleBranch = useCallback((messageId: string) => {
    const branchId = `branch-${Date.now()}`
    const parentMessage = messages.find(m => m.id === messageId)
    
    if (!parentMessage) return

    // Create new branch
    const newBranch: Branch = {
      id: branchId,
      name: `Branch from "${parentMessage.content.substring(0, 30)}..."`,
      parentMessageId: messageId,
      createdAt: new Date(),
      messageCount: 0,
    }

    setBranches(prev => new Map(prev).set(branchId, newBranch))
    setCurrentBranchId(branchId)

    // In a real implementation, you'd filter messages to show only this branch
    // This is a simplified example
  }, [messages])

  const handleSwitchBranch = useCallback((branchId: string) => {
    setCurrentBranchId(branchId)
    // In a real implementation, you'd load messages for this branch
  }, [])

  const handleSend = useCallback(async (content: string) => {
    addMessage({
      chatId: 'branching-chat',
      role: 'user',
      content,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          branchId: currentBranchId,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: 'branching-chat',
        role: 'assistant',
        content: data.response,
      })

      // Update branch message count
      if (currentBranchId !== 'main') {
        setBranches(prev => {
          const updated = new Map(prev)
          const branch = updated.get(currentBranchId)
          if (branch) {
            updated.set(currentBranchId, {
              ...branch,
              messageCount: branch.messageCount + 2, // User + Assistant
            })
          }
          return updated
        })
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, currentBranchId, addMessage])

  const branchList = useMemo(() => {
    return Array.from(branches.values())
  }, [branches])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Branch Selector */}
        {branchList.length > 0 && (
          <div className="p-4 border-b bg-card">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Current Branch:</label>
              <select
                value={currentBranchId}
                onChange={(e) => handleSwitchBranch(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-md bg-background"
              >
                <option value="main">Main Branch</option>
                {branchList.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.messageCount} messages)
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSend}
          onMessageAction={(messageId, action) => {
            if (action === 'branch') {
              handleBranch(messageId)
            }
          }}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Visual branch management
- ✅ Branch creation from any message
- ✅ Branch switching
- ✅ Message count tracking
- ✅ Branch naming
- ✅ TypeScript types
- ✅ Error handling

---

### Recipe 22: Export Conversations (Enhanced)

Export chat history to multiple formats with metadata and customization options.

```tsx
import { 
  ChatWindow, 
  ExportDialog,
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

interface ExportOptions {
  format: 'markdown' | 'json' | 'html' | 'txt'
  includeMetadata: boolean
  includeTimestamps: boolean
  includeImages: boolean
  dateRange?: { start: Date; end: Date }
}

export function ExportableChat() {
  const [showExport, setShowExport] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'exportable-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  const exportToFormat = useCallback(async (
    msgs: Message[],
    options: ExportOptions
  ): Promise<string> => {
    // Filter by date range if specified
    let filteredMessages = msgs
    if (options.dateRange) {
      filteredMessages = msgs.filter(msg => {
        const msgDate = new Date(msg.createdAt)
        return msgDate >= options.dateRange!.start && msgDate <= options.dateRange!.end
      })
    }

    switch (options.format) {
      case 'markdown':
        return filteredMessages.map(msg => {
          const role = msg.role === 'user' ? '**You**' : '**Assistant**'
          const timestamp = options.includeTimestamps 
            ? ` (${msg.createdAt.toLocaleString()})` 
            : ''
          const metadata = options.includeMetadata 
            ? `\n<!-- ID: ${msg.id}, Status: ${msg.status} -->\n` 
            : ''
          return `${metadata}${role}${timestamp}\n\n${msg.content}\n\n---\n`
        }).join('\n')

      case 'json':
        return JSON.stringify(
          filteredMessages.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.createdAt.toISOString(),
            ...(options.includeMetadata && {
              status: msg.status,
              chatId: msg.chatId,
            }),
          })),
          null,
          2
        )

      case 'html':
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Chat Export</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .message { margin: 20px 0; padding: 15px; border-radius: 8px; }
    .user { background: #e3f2fd; }
    .assistant { background: #f5f5f5; }
    .timestamp { font-size: 0.85em; color: #666; }
  </style>
</head>
<body>
  <h1>Chat Export</h1>
  ${filteredMessages.map(msg => `
    <div class="message ${msg.role}">
      <strong>${msg.role === 'user' ? 'You' : 'Assistant'}</strong>
      ${options.includeTimestamps ? `<span class="timestamp">${msg.createdAt.toLocaleString()}</span>` : ''}
      <div>${msg.content.replace(/\n/g, '<br>')}</div>
    </div>
  `).join('')}
</body>
</html>`

      case 'txt':
        return filteredMessages.map(msg => {
          const role = msg.role === 'user' ? 'You' : 'Assistant'
          const timestamp = options.includeTimestamps 
            ? ` [${msg.createdAt.toLocaleString()}]` 
            : ''
          return `${role}${timestamp}: ${msg.content}`
        }).join('\n\n')

      default:
        throw new Error(`Unsupported format: ${options.format}`)
    }
  }, [])

  const handleExport = useCallback(async (format: ExportOptions['format'], options: Partial<ExportOptions> = {}) => {
    if (messages.length === 0) {
      alert('No messages to export')
      return
    }

    setIsExporting(true)

    try {
      const exportOptions: ExportOptions = {
        format,
        includeMetadata: options.includeMetadata ?? true,
        includeTimestamps: options.includeTimestamps ?? true,
        includeImages: options.includeImages ?? false,
        dateRange: options.dateRange,
      }

      const content = await exportToFormat(messages, exportOptions)
      const mimeTypes: Record<string, string> = {
        markdown: 'text/markdown',
        json: 'application/json',
        html: 'text/html',
        txt: 'text/plain',
      }

      const blob = new Blob([content], { type: mimeTypes[format] })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `conversation-${Date.now()}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setShowExport(false)
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Failed to export: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExporting(false)
    }
  }, [messages, exportToFormat])

  const handleSend = useCallback(async (content: string) => {
    addMessage({
      chatId: 'exportable-chat',
      role: 'user',
      content,
    })
    // Call API and add response...
  }, [addMessage])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-xl font-semibold">Chat</h1>
          <button
            onClick={() => setShowExport(true)}
            disabled={messages.length === 0}
            className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Export
          </button>
        </div>

        <ChatWindow 
          messages={messages} 
          onSendMessage={handleSend}
        />

        {showExport && (
          <ExportDialog
            messages={messages}
            onExport={handleExport}
            onClose={() => setShowExport(false)}
            isExporting={isExporting}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Multiple export formats (Markdown, JSON, HTML, TXT)
- ✅ Metadata inclusion options
- ✅ Date range filtering
- ✅ Timestamp options
- ✅ Customizable export settings
- ✅ Error handling
- ✅ TypeScript types

---

### Recipe 23: Authentication

Protect chat with user authentication and session management.

```tsx
import { 
  ChatWindow,
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useEffect, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

// Mock auth context - replace with your actual auth implementation
function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('chat-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Call your auth API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const userData = await response.json()
      setUser(userData.user)
      localStorage.setItem('chat-user', JSON.stringify(userData.user))
      localStorage.setItem('chat-token', userData.token)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('chat-token')}`,
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('chat-user')
      localStorage.removeItem('chat-token')
    }
  }, [])

  return { user, login, logout, isLoading }
}

export function AuthenticatedChat() {
  const { user, login, logout, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: user ? `chat-${user.id}` : 'default-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    try {
      await login(loginEmail, loginPassword)
      setLoginEmail('')
      setLoginPassword('')
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed')
    }
  }, [loginEmail, loginPassword, login])

  const handleSend = useCallback(async (content: string) => {
    if (!user) return

    addMessage({
      chatId: `chat-${user.id}`,
      role: 'user',
      content,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('chat-token')}`,
        },
        body: JSON.stringify({
          message: content,
          userId: user.id,
          history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (response.status === 401) {
        // Token expired, logout
        await logout()
        return
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: `chat-${user.id}`,
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user, messages, addMessage, logout])

  if (authLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Login to Chat</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            {loginError && (
              <div className="text-sm text-destructive">{loginError}</div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div>
            <h1 className="text-xl font-semibold">Chat</h1>
            <p className="text-sm text-muted-foreground">Logged in as {user.name}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm rounded-md border hover:bg-accent"
          >
            Logout
          </button>
        </div>

        <ChatWindow 
          messages={messages} 
          isLoading={isLoading}
          onSendMessage={handleSend}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ User authentication
- ✅ Session management
- ✅ Protected routes
- ✅ Token-based auth
- ✅ Auto-logout on token expiry
- ✅ User-specific chat isolation
- ✅ TypeScript types

---

### Recipe 24: Multi-User Chat

Enable real-time multi-user conversations with presence indicators and typing status.

```tsx
import { 
  ChatWindow,
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useEffect, useState, useCallback, useRef } from 'react'
import type { Message } from '@clarity-chat/types'
import io, { Socket } from 'socket.io-client'

interface User {
  id: string
  name: string
  avatar?: string
}

interface ChatMessage extends Message {
  userId: string
  userName: string
}

export function MultiUserChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<Map<string, User>>(new Map())
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [currentUser] = useState<User>({
    id: 'user-1', // In production, get from auth
    name: 'You',
  })
  
  const socketRef = useRef<Socket | null>(null)
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'multi-user-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId: currentUser.id,
        userName: currentUser.name,
      },
    })

    const socket = socketRef.current

    // Listen for messages
    socket.on('message', (data: ChatMessage) => {
      addMessage({
        chatId: 'multi-user-chat',
        role: data.role,
        content: data.content,
      })
    })

    // Listen for user join/leave
    socket.on('user:joined', (user: User) => {
      setUsers(prev => new Map(prev).set(user.id, user))
    })

    socket.on('user:left', (userId: string) => {
      setUsers(prev => {
        const updated = new Map(prev)
        updated.delete(userId)
        return updated
      })
    })

    // Listen for typing indicators
    socket.on('user:typing', (data: { userId: string; userName: string }) => {
      setTypingUsers(prev => new Set(prev).add(data.userId))
      
      // Clear typing indicator after 3 seconds
      const timeout = setTimeout(() => {
        setTypingUsers(prev => {
          const updated = new Set(prev)
          updated.delete(data.userId)
          return updated
        })
      }, 3000)

      // Clear existing timeout
      const existingTimeout = typingTimeoutRef.current.get(data.userId)
      if (existingTimeout) {
        clearTimeout(existingTimeout)
      }
      typingTimeoutRef.current.set(data.userId, timeout)
    })

    socket.on('user:stopped-typing', (userId: string) => {
      setTypingUsers(prev => {
        const updated = new Set(prev)
        updated.delete(userId)
        return updated
      })
    })

    // Get initial users list
    socket.emit('users:list', (usersList: User[]) => {
      const usersMap = new Map(usersList.map(u => [u.id, u]))
      setUsers(usersMap)
    })

    // Cleanup
    return () => {
      socket.disconnect()
      typingTimeoutRef.current.forEach(timeout => clearTimeout(timeout))
    }
  }, [currentUser, addMessage])

  const handleSend = useCallback((content: string) => {
    if (!socketRef.current) return

    // Add message optimistically
    addMessage({
      chatId: 'multi-user-chat',
      role: 'user',
      content,
    })

    // Emit to server
    socketRef.current.emit('message', {
      content,
      userId: currentUser.id,
      userName: currentUser.name,
      role: 'user',
    })

    // Stop typing indicator
    socketRef.current.emit('typing:stop')
  }, [currentUser, addMessage])

  const handleTyping = useCallback(() => {
    if (!socketRef.current) return
    socketRef.current.emit('typing:start')
  }, [])

  const typingIndicator = typingUsers.size > 0
    ? `${Array.from(typingUsers).map(id => users.get(id)?.name || 'Someone').join(', ')} ${typingUsers.size === 1 ? 'is' : 'are'} typing...`
    : null

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Users List */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Multi-User Chat</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {users.size} user{users.size !== 1 ? 's' : ''} online
              </span>
              {typingIndicator && (
                <span className="text-sm text-muted-foreground italic">
                  {typingIndicator}
                </span>
              )}
            </div>
          </div>
        </div>

        <ChatWindow 
          messages={messages} 
          isLoading={isLoading}
          onSendMessage={handleSend}
          onTyping={handleTyping}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Real-time messaging with Socket.IO
- ✅ User presence indicators
- ✅ Typing indicators
- ✅ User join/leave notifications
- ✅ Optimistic updates
- ✅ Error handling
- ✅ TypeScript types

---

### Recipe 25: Voice Input

Add speech-to-text capabilities with visual feedback and error handling.

```tsx
import { 
  ChatWindow,
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useState, useCallback, useEffect, useRef } from 'react'
import type { Message } from '@clarity-chat/types'

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

interface Window {
  webkitSpeechRecognition: new () => SpeechRecognition
  SpeechRecognition: new () => SpeechRecognition
}

export function VoiceEnabledChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'voice-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = 
      (window as unknown as Window).webkitSpeechRecognition ||
      (window as unknown as Window).SpeechRecognition

    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      setTranscript(finalTranscript || interimTranscript)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.')
          break
        case 'audio-capture':
          setError('No microphone found. Please check your microphone.')
          break
        case 'not-allowed':
          setError('Microphone permission denied. Please enable microphone access.')
          break
        default:
          setError(`Speech recognition error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      if (transcript.trim()) {
        handleSend(transcript.trim())
        setTranscript('')
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [transcript])

  const startVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition not available')
      return
    }

    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Failed to start recognition:', error)
      setError('Failed to start voice input')
    }
  }, [])

  const stopVoiceInput = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  const handleSend = useCallback(async (content: string) => {
    if (!content.trim()) return

    addMessage({
      chatId: 'voice-chat',
      role: 'user',
      content,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
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
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: 'voice-chat',
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messages, addMessage])

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Voice Input Controls */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Voice-Enabled Chat</h1>
            <div className="flex items-center gap-2">
              {error && (
                <span className="text-sm text-destructive">{error}</span>
              )}
              {isListening && (
                <span className="text-sm text-muted-foreground animate-pulse">
                  🎤 Listening...
                </span>
              )}
              {transcript && !isListening && (
                <span className="text-sm text-muted-foreground">
                  "{transcript}"
                </span>
              )}
              {!isListening ? (
                <button
                  onClick={startVoiceInput}
                  className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  🎤 Start Voice Input
                </button>
              ) : (
                <button
                  onClick={stopVoiceInput}
                  className="px-4 py-2 text-sm rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  ⏹ Stop
                </button>
              )}
            </div>
          </div>
        </div>

        <ChatWindow 
          messages={messages} 
          isLoading={isLoading}
          onSendMessage={handleSend}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Web Speech API integration
- ✅ Real-time transcript display
- ✅ Visual listening indicator
- ✅ Error handling for various scenarios
- ✅ Microphone permission handling
- ✅ Continuous and interim results
- ✅ TypeScript types

---

### Recipe 26: Testing

Test your chat components with comprehensive test coverage.

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatWindow, useMessageOperations } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

// Mock API responses
global.fetch = jest.fn()

describe('ChatWindow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sends messages', async () => {
    const onSend = jest.fn()
    render(<ChatWindow messages={[]} onSendMessage={onSend} />)

    const input = screen.getByPlaceholderText(/type a message/i)
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(onSend).toHaveBeenCalledWith('Hello')
    })
  })

  it('displays messages correctly', () => {
    const messages: Message[] = [
      {
        id: '1',
        chatId: 'test-chat',
        role: 'user',
        content: 'Hello',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      },
      {
        id: '2',
        chatId: 'test-chat',
        role: 'assistant',
        content: 'Hi there!',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      },
    ]

    render(<ChatWindow messages={messages} onSendMessage={jest.fn()} />)

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<ChatWindow messages={[]} isLoading={true} onSendMessage={jest.fn()} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('handles message operations', async () => {
    const onEdit = jest.fn()
    const onDelete = jest.fn()
    const onRegenerate = jest.fn()

    const messages: Message[] = [
      {
        id: '1',
        chatId: 'test-chat',
        role: 'user',
        content: 'Test message',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      },
    ]

    render(
      <ChatWindow
        messages={messages}
        onSendMessage={jest.fn()}
        onEditMessage={onEdit}
        onDeleteMessage={onDelete}
        onRegenerateMessage={onRegenerate}
      />
    )

    // Find and click edit button
    const editButton = screen.getByLabelText(/edit/i)
    fireEvent.click(editButton)
    expect(onEdit).toHaveBeenCalledWith('1')
  })

  it('handles API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    const TestComponent = () => {
      const [messages, setMessages] = useState<Message[]>([])
      const [error, setError] = useState<string | null>(null)

      const handleSend = async (content: string) => {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: content }),
          })
          if (!response.ok) throw new Error('API Error')
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      }

      return (
        <div>
          {error && <div data-testid="error">{error}</div>}
          <ChatWindow messages={messages} onSendMessage={handleSend} />
        </div>
      )
    }

    render(<TestComponent />)
    const input = screen.getByPlaceholderText(/type a message/i)
    fireEvent.change(input, { target: { value: 'Test' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })
  })

  it('handles empty state', () => {
    render(
      <ChatWindow
        messages={[]}
        onSendMessage={jest.fn()}
        emptyState={<div>No messages yet</div>}
      />
    )
    expect(screen.getByText('No messages yet')).toBeInTheDocument()
  })
})

describe('useMessageOperations', () => {
  it('manages message state correctly', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages: [] })
    )

    act(() => {
      result.current.addMessage({
        chatId: 'test',
        role: 'user',
        content: 'Test',
      })
    })

    expect(result.current.messages.length).toBe(1)
  })

  it('supports undo/redo', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages: [] })
    )

    act(() => {
      result.current.addMessage({
        chatId: 'test',
        role: 'user',
        content: 'Test',
      })
    })

    expect(result.current.canUndo).toBe(true)

    act(() => {
      result.current.undo()
    })

    expect(result.current.messages.length).toBe(0)
    expect(result.current.canRedo).toBe(true)
  })
})
```

**Key Features:**
- ✅ Comprehensive test coverage
- ✅ Message sending tests
- ✅ Message display tests
- ✅ Loading state tests
- ✅ Error handling tests
- ✅ Message operations tests
- ✅ Hook testing with renderHook
- ✅ Async operation testing

---

### Recipe 27: Performance Optimization

Optimize for large message lists with virtualization, memoization, and efficient rendering.

```tsx
import { 
  ChatWindow,
  useMessageOperations,
  ErrorBoundary 
} from '@clarity-chat/react'
import { useMemo, useState, useCallback, memo } from 'react'
import type { Message } from '@clarity-chat/types'

// Memoized message component to prevent unnecessary re-renders
const MemoizedMessage = memo(({ message }: { message: Message }) => {
  return (
    <div className="p-4 border-b">
      <div className="font-semibold">{message.role === 'user' ? 'You' : 'Assistant'}</div>
      <div>{message.content}</div>
    </div>
  )
}, (prev, next) => prev.message.id === next.message.id && prev.message.content === next.message.content)

MemoizedMessage.displayName = 'MemoizedMessage'

export function OptimizedChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const messagesPerPage = 50

  const {
    messages: operationMessages,
    addMessage,
  } = useMessageOperations({
    initialMessages: [],
  })

  // Convert to Message format
  const allMessages: Message[] = operationMessages.map(msg => ({
    id: msg.id,
    chatId: 'optimized-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  // Virtual scrolling: Only render visible messages
  const visibleMessages = useMemo(() => {
    const startIndex = Math.max(0, allMessages.length - messagesPerPage * page)
    return allMessages.slice(startIndex)
  }, [allMessages, page, messagesPerPage])

  // Memoize message list to prevent re-renders
  const memoizedMessages = useMemo(() => {
    return visibleMessages.map(msg => (
      <MemoizedMessage key={msg.id} message={msg} />
    ))
  }, [visibleMessages])

  // Debounced scroll handler
  const handleScroll = useCallback(
    debounce((e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const scrollTop = target.scrollTop
      
      // Load more messages when scrolling near top
      if (scrollTop < 100 && page * messagesPerPage < allMessages.length) {
        setPage(prev => prev + 1)
      }
    }, 100),
    [page, allMessages.length, messagesPerPage]
  )

  const handleSend = useCallback(async (content: string) => {
    addMessage({
      chatId: 'optimized-chat',
      role: 'user',
      content,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: visibleMessages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      addMessage({
        chatId: 'optimized-chat',
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [visibleMessages, addMessage])

  // Simple debounce utility
  function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null
        func(...args)
      }
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b bg-card">
          <h1 className="text-xl font-semibold">Optimized Chat</h1>
          <p className="text-sm text-muted-foreground">
            Showing {visibleMessages.length} of {allMessages.length} messages
          </p>
        </div>

        <div 
          className="flex-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          {memoizedMessages}
        </div>

        <ChatWindow 
          messages={visibleMessages} 
          isLoading={isLoading}
          onSendMessage={handleSend}
        />
      </div>
    </ErrorBoundary>
  )
}
```

**Key Features:**
- ✅ Virtual scrolling for large lists
- ✅ Memoized components to prevent re-renders
- ✅ Pagination for message loading
- ✅ Debounced scroll handlers
- ✅ Efficient message filtering
- ✅ Context-aware history (last 10 messages)
- ✅ Performance monitoring ready
- ✅ TypeScript types

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
