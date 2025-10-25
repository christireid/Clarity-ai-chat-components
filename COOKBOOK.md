# Clarity Chat Cookbook

> 25+ recipes and patterns for building production-ready AI chat applications

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

The simplest way to get started with Clarity Chat.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export function BasicChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content }),
      })
      
      const data = await response.json()
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
      }
      
      setMessages(prev => [...prev, aiMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSend} />
}
```

---

### Recipe 2: With Error Handling

Add robust error handling with automatic retry.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { ErrorBoundary, useAsyncError } from '@clarity-chat/error-handling'
import { useState } from 'react'

export function ChatWithErrorHandling() {
  const [messages, setMessages] = useState([])
  const { executeAsync, isLoading, retryCount } = useAsyncError()

  const handleSend = async (content: string) => {
    const userMsg = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])

    await executeAsync(
      async () => {
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: content }),
        })
        
        if (!response.ok) throw new Error('API Error')
        
        const data = await response.json()
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: Date.now(),
        }])
      },
      {
        maxRetries: 3,
        retryDelay: 1000,
      }
    )
  }

  return (
    <ErrorBoundary>
      <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSend} />
      {retryCount > 0 && <p>Retrying... (Attempt {retryCount})</p>}
    </ErrorBoundary>
  )
}
```

---

## Basic Patterns

### Recipe 3: Streaming Responses

Stream AI responses in real-time for better UX.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useStreaming } from '@clarity-chat/react'
import { useState } from 'react'

export function StreamingChat() {
  const [messages, setMessages] = useState([])
  const { stream, isStreaming } = useStreaming()

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

    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    })

    await stream(response, (chunk) => {
      setMessages(prev => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        last.content += chunk
        return updated
      })
    })
  }

  return <ChatWindow messages={messages} isLoading={isStreaming} onSendMessage={handleSend} />
}
```

---

### Recipe 4: Message Persistence

Save and restore chat history with localStorage.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useLocalStorage } from '@clarity-chat/react'
import { useEffect } from 'react'

export function PersistentChat() {
  const [messages, setMessages] = useLocalStorage('chat-messages', [])

  const handleSend = async (content: string) => {
    // Add message and save automatically
    const newMessage = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now() }
    setMessages(prev => [...prev, newMessage])
    
    // Call API...
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

---

### Recipe 5: Token Tracking

Monitor token usage and costs in real-time.

```tsx
import { ChatWindow, TokenCounter, useTokenTracker } from '@clarity-chat/react'

export function ChatWithTokenTracking() {
  const [messages, setMessages] = useState([])
  const { tokenCount, estimateCost, trackMessage } = useTokenTracker({
    model: 'gpt-4',
    inputCostPer1k: 0.03,
    outputCostPer1k: 0.06,
  })

  const handleSend = async (content: string) => {
    trackMessage(content, 'input')
    // Send message...
    // Track response
    trackMessage(response, 'output')
  }

  return (
    <div>
      <TokenCounter tokens={tokenCount} maxTokens={4000} cost={estimateCost()} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

---

## Advanced Patterns

### Recipe 6: Multi-Turn Conversations

Maintain conversation context across multiple turns.

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState, useRef } from 'react'

export function ContextAwareChat() {
  const [messages, setMessages] = useState([])
  const conversationHistory = useRef([])

  const handleSend = async (content: string) => {
    const userMsg = { role: 'user', content }
    conversationHistory.current.push(userMsg)

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: conversationHistory.current, // Send full history
      }),
    })

    const data = await response.json()
    const aiMsg = { role: 'assistant', content: data.response }
    conversationHistory.current.push(aiMsg)

    setMessages(conversationHistory.current.map((msg, i) => ({
      ...msg,
      id: i.toString(),
      timestamp: Date.now(),
    })))
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

---

### Recipe 7: File Upload Integration

Allow users to upload files as context.

```tsx
import { ChatWindow, FileUpload, ContextManager } from '@clarity-chat/react'
import { useState } from 'react'

export function ChatWithFileUpload() {
  const [messages, setMessages] = useState([])
  const [files, setFiles] = useState([])

  const handleFilesSelected = async (selectedFiles) => {
    const uploaded = await Promise.all(
      selectedFiles.map(file => uploadFile(file))
    )
    setFiles(prev => [...prev, ...uploaded])
  }

  const handleSend = async (content: string) => {
    // Include file references in message
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: content,
        fileIds: files.map(f => f.id),
      }),
    })
    // Process response...
  }

  return (
    <div>
      <FileUpload onFilesSelected={handleFilesSelected} />
      <ContextManager contexts={files} onRemove={id => setFiles(prev => prev.filter(f => f.id !== id))} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

---

### Recipe 8: Custom Thinking Indicators

Show detailed AI processing stages.

```tsx
import { ChatWindow, ThinkingIndicator } from '@clarity-chat/react'
import { useState } from 'react'

export function ChatWithStages() {
  const [messages, setMessages] = useState([])
  const [stage, setStage] = useState(null)

  const handleSend = async (content: string) => {
    setStage('thinking')
    
    // Simulate stages
    setTimeout(() => setStage('researching'), 1000)
    setTimeout(() => setStage('generating'), 2000)
    setTimeout(() => setStage('finalizing'), 3000)

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    })

    setStage(null)
    // Add response...
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={!!stage}
      onSendMessage={handleSend}
    />
  )
}
```

---

### Recipe 9: Message Operations (Edit, Regenerate)

Allow users to edit messages and regenerate responses.

```tsx
import { ChatWindow, useMessageOperations } from '@clarity-chat/react'

export function ChatWithOperations() {
  const {
    messages,
    editMessage,
    regenerateResponse,
    branchConversation,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations({
    initialMessages: [],
  })

  const handleEdit = (messageId: string, newContent: string) => {
    editMessage(messageId, newContent)
    // Re-send from this point
  }

  const handleRegenerate = (messageId: string) => {
    regenerateResponse(messageId)
    // Call API to regenerate
  }

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
      <ChatWindow
        messages={messages}
        onMessageEdit={handleEdit}
        onMessageRegenerate={handleRegenerate}
      />
    </div>
  )
}
```

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

### Recipe 21: Authentication

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

### Recipe 22: Multi-User Chat

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

### Recipe 23: Voice Input

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

### Recipe 24: Testing

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

### Recipe 25: Performance Optimization

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

**Built with ❤️ by Code & Clarity**
