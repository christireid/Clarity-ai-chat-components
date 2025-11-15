# Cookbook: Common Patterns & Recipes

A collection of practical, copy-pasteable patterns for common use cases.

---

## Table of Contents

- [Basic Chat](#basic-chat)
- [Chat with Memory](#chat-with-memory)
- [Streaming Chat](#streaming-chat)
- [Multi-User Chat](#multi-user-chat)
- [Custom Layout](#custom-layout)
- [Error Handling](#error-handling)
- [Analytics Integration](#analytics-integration)
- [Theme Customization](#theme-customization)
- [File Upload](#file-upload)
- [Token Tracking](#token-tracking)

---

## Basic Chat

The simplest chat setup.

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

**API Route (Next.js):**

```tsx
// app/api/chat/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
    }),
  })

  const data = await response.json()
  return NextResponse.json({ message: data.choices[0].message })
}
```

---

## Chat with Memory

Enable conversation memory for context-aware responses.

```tsx
import { useClarityChat, ChatWindow, MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatApp />
    </MemoryProvider>
  )
}

function ChatApp() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

---

## Streaming Chat

Real-time streaming responses for better UX.

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    stream: true, // Enable streaming
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

**API Route (Streaming):**

```tsx
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      stream: true, // Enable streaming
    }),
  })

  // Return streaming response
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  })
}
```

---

## Multi-User Chat

Support multiple users in the same conversation.

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

function App() {
  const [currentUser, setCurrentUser] = useState('user1')
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    userId: currentUser, // Track user ID
  })

  return (
    <div>
      <select value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}>
        <option value="user1">User 1</option>
        <option value="user2">User 2</option>
        <option value="user3">User 3</option>
      </select>
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ 
            role: 'user', 
            content,
            metadata: { userId: currentUser },
          })
        }}
      />
    </div>
  )
}
```

---

## Custom Layout

Build a custom chat layout using individual components.

```tsx
import { MessageList, ChatInput, useClarityChat } from '@clarity-chat/react'

function CustomChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <div className="custom-layout">
      <CustomHeader />
      <MessageList 
        messages={messages}
        onMessageCopy={(id, content) => {
          navigator.clipboard.writeText(content)
        }}
      />
      <ChatInput
        onSend={async (content) => {
          await append({ role: 'user', content })
        }}
        disabled={isLoading}
      />
    </div>
  )
}
```

---

## Error Handling

Robust error handling with retry logic.

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

function App() {
  const [error, setError] = useState<Error | null>(null)
  
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    onError: (err) => {
      setError(err)
      console.error('Chat error:', err)
    },
    retry: {
      maxAttempts: 3,
      delay: 1000,
    },
  })

  const handleSend = async (content: string) => {
    try {
      setError(null)
      await append({ role: 'user', content })
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <div>
      {error && (
        <div className="error-banner">
          Error: {error.message}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
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

---

## Analytics Integration

Track user interactions for analytics.

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    onMessageSent: (message) => {
      // Track message sent
      analytics.track('message_sent', {
        id: message.id,
        length: message.content.length,
      })
    },
    onMessageReceived: (message) => {
      // Track message received
      analytics.track('message_received', {
        id: message.id,
        length: message.content.length,
      })
    },
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
      onFeedback={(messageId, type) => {
        analytics.track('message_feedback', { messageId, type })
      }}
      onCopy={(messageId) => {
        analytics.track('message_copied', { messageId })
      }}
    />
  )
}
```

---

## Theme Customization

Customize the chat appearance to match your brand.

```tsx
import { ChatWindow, ThemeProvider, useClarityChat } from '@clarity-chat/react'

const customTheme = {
  colors: {
    primary: '#3b82f6',
    background: '#ffffff',
    foreground: '#000000',
    muted: '#f3f4f6',
    accent: '#8b5cf6',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
}

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <ChatApp />
    </ThemeProvider>
  )
}

function ChatApp() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

---

## File Upload

Enable file uploads in chat.

```tsx
import { ChatInput, useClarityChat } from '@clarity-chat/react'
import { useState } from 'react'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const handleFileUpload = async (file: File) => {
    // Upload file to your storage
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    const { url } = await response.json()
    
    // Send message with file attachment
    await append({
      role: 'user',
      content: `I uploaded a file: ${file.name}`,
      attachments: [{ type: 'file', url, name: file.name }],
    })
  }

  return (
    <ChatInput
      onSend={async (content) => {
        await append({ role: 'user', content })
      }}
      allowFileUpload={true}
      onFileUpload={handleFileUpload}
      disabled={isLoading}
    />
  )
}
```

---

## Token Tracking

Track token usage and costs.

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import { TokenCounter } from '@clarity-chat/react/components/token-counter'

function App() {
  const { messages, append, isLoading, tokenUsage } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <div>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
        showTokenCounter={true}
      />
      
      {/* Or use standalone counter */}
      <TokenCounter
        tokens={tokenUsage.tokens}
        maxTokens={tokenUsage.maxTokens}
        cost={tokenUsage.cost}
      />
    </div>
  )
}
```

---

## More Recipes

- [Best Practices](./best-practices.md) - Production patterns
- [API Reference](../apps/docs/app/api/) - Complete API docs
- [Examples](../apps/examples/) - More examples
- [Storybook](../apps/storybook/) - Interactive examples

---

**Need a specific pattern?** [Open an issue](https://github.com/christireid/Clarity-ai-chat-components/issues) or ask in [Discord](https://discord.gg/clarity-chat).
