# 🍳 Clarity Chat Cookbook

> **Copy-paste ready recipes for common patterns and use cases.**

This cookbook provides practical, production-ready examples you can use immediately. Each recipe is tested, documented, and ready to drop into your project.

---

## 📚 Table of Contents

### Basics
- [Simple Chat Interface](#simple-chat-interface)
- [Chat with Error Handling](#chat-with-error-handling)
- [Chat with Loading States](#chat-with-loading-states)

### Advanced Features
- [Memory-Enabled Chat](#memory-enabled-chat)
- [Custom Message Rendering](#custom-message-rendering)
- [Token Optimization](#token-optimization)
- [Streaming with WebSocket](#streaming-with-websocket)

### Enterprise Patterns
- [Multi-Tenant Chat](#multi-tenant-chat)
- [RAG-Enabled Chat](#rag-enabled-chat)
- [Agent Orchestration](#agent-orchestration)

### UI Patterns
- [Custom Theme](#custom-theme)
- [Command Palette](#command-palette)
- [Voice Input](#voice-input)

---

## Simple Chat Interface

The most basic chat setup - perfect for getting started.

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

function SimpleChat() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen flex flex-col">
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
      />
    </div>
  )
}
```

**Key Points:**
- Always convert messages with `convertCoreMessagesToMessages`
- Use `useMemo` for performance
- Handle `onSendMessage` with `append`

---

## Chat with Error Handling

Robust error handling with user-friendly messages.

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

function ChatWithErrors() {
  const { 
    messages: coreMessages, 
    append, 
    isLoading, 
    error 
  } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen flex flex-col">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {error.message}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          try {
            await append({ role: 'user', content })
          } catch (err) {
            console.error('Failed to send message:', err)
          }
        }}
      />
    </div>
  )
}
```

**Key Points:**
- Always check `error` state
- Display errors prominently
- Wrap `append` in try-catch for additional safety

---

## Chat with Loading States

Visual feedback during message processing.

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

function ChatWithLoading() {
  const { 
    messages: coreMessages, 
    append, 
    isLoading,
    isStreaming 
  } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen flex flex-col">
      {isLoading && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
          <p className="text-sm text-blue-700">
            {isStreaming ? 'Streaming response...' : 'Processing...'}
          </p>
        </div>
      )}
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
      />
    </div>
  )
}
```

**Key Points:**
- Use `isLoading` for general loading state
- Use `isStreaming` for streaming-specific feedback
- Provide clear visual feedback to users

---

## Memory-Enabled Chat

Enable context-aware conversations with Clarity's memory system.

```tsx
import { 
  useClarityChat, 
  ChatWindow, 
  MemoryProvider,
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'
import { useMemo } from 'react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <MemoryChat />
    </MemoryProvider>
  )
}

function MemoryChat() {
  const {
    messages: coreMessages,
    append,
    isLoading,
    memoryEnabled,
    contextSummary,
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window', // or 'semantic-chunks' or 'vector-store'
      maxTokens: 4000,
    },
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen flex flex-col">
      {memoryEnabled && (
        <div className="px-4 py-2 bg-green-50 border-b border-green-200">
          <p className="text-xs text-green-700">
            Memory enabled • {contextSummary?.split(' ').length || 0} words in context
          </p>
        </div>
      )}
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
      />
    </div>
  )
}
```

**Key Points:**
- Wrap app with `MemoryProvider`
- Choose memory strategy based on your needs:
  - `sliding-window`: Fast, recent context only
  - `semantic-chunks`: Context-aware retrieval
  - `vector-store`: Long-term memory (requires setup)

---

## Custom Message Rendering

Customize how messages are displayed.

```tsx
import { 
  useClarityChat, 
  MessageList,
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'
import { useMemo } from 'react'
import type { Message } from '@clarity-chat/types'

function CustomChat() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  const renderMessage = (message: Message) => {
    if (message.role === 'user') {
      return (
        <div className="bg-blue-100 p-4 rounded-lg mb-2">
          <p className="font-semibold">You:</p>
          <p>{message.content}</p>
        </div>
      )
    }

    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-2">
        <p className="font-semibold">Assistant:</p>
        <p>{message.content}</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <MessageList
        messages={messages}
        renderMessage={renderMessage}
      />
      
      {/* Your custom input component */}
    </div>
  )
}
```

**Key Points:**
- Use `MessageList` for custom rendering
- Access full message object for customization
- Maintain accessibility in custom components

---

## Token Optimization

Save 50-80% on AI API costs with token optimization.

```tsx
import { 
  useClarityChat,
  useTokenOptimization,
  TokenOptimizationDashboard,
  ChatWindow,
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'
import { useMemo } from 'react'

function OptimizedChat() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const optimization = useTokenOptimization({
    enableCompression: true,
    enableCaching: true,
    enableRouting: true,
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen flex flex-col">
      <TokenOptimizationDashboard
        metrics={optimization.metrics}
      />
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          // Optimization happens automatically
          await append({ role: 'user', content })
        }}
      />
    </div>
  )
}
```

**Key Points:**
- Token optimization works automatically
- Monitor savings with `TokenOptimizationDashboard`
- Multiple strategies can be combined

---

## Streaming with WebSocket

Use WebSocket for bidirectional real-time communication.

```tsx
import { 
  useClarityChat,
  ChatWindow,
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'
import { useMemo } from 'react'

function WebSocketChat() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    transport: 'websocket', // Use WebSocket instead of SSE
    websocket: {
      url: 'ws://localhost:3001/chat',
      reconnect: true,
      reconnectDelay: 1000,
    },
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

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

**Key Points:**
- Set `transport: 'websocket'` to use WebSocket
- Configure WebSocket options for reconnection
- WebSocket enables bidirectional communication

---

## Custom Theme

Customize the look and feel of your chat interface.

```tsx
import { 
  useClarityChat,
  ChatWindow,
  ThemeProvider,
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'
import { useMemo } from 'react'

const customTheme = {
  colors: {
    primary: '#4A90E2',
    secondary: '#7B68EE',
    background: '#FFFFFF',
    foreground: '#18181B',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
  },
}

function ThemedChat() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <ThemeProvider theme={customTheme}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
      />
    </ThemeProvider>
  )
}
```

**Key Points:**
- Wrap components with `ThemeProvider`
- Customize colors, borders, shadows
- Use theme tokens for consistency

---

## Command Palette

Add a command palette for power users.

```tsx
import { 
  useClarityChat,
  ChatWindow,
  CommandPalette,
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'
import { useMemo, useState } from 'react'

function ChatWithCommands() {
  const [showPalette, setShowPalette] = useState(false)
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  const commands = [
    {
      id: 'new-chat',
      label: 'New Chat',
      action: () => {
        // Start new chat
        setShowPalette(false)
      },
    },
    {
      id: 'export',
      label: 'Export Conversation',
      action: () => {
        // Export logic
        setShowPalette(false)
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      action: () => {
        // Open settings
        setShowPalette(false)
      },
    },
  ]

  return (
    <>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
        onKeyDown={(e) => {
          if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setShowPalette(true)
          }
        }}
      />
      
      {showPalette && (
        <CommandPalette
          commands={commands}
          onClose={() => setShowPalette(false)}
        />
      )}
    </>
  )
}
```

**Key Points:**
- Use Cmd+K (Mac) or Ctrl+K (Windows) to open
- Define commands with actions
- Handle keyboard shortcuts

---

## Voice Input

Add voice input to your chat interface.

```tsx
import { 
  useClarityChat,
  ChatWindow,
  VoiceInput,
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'
import { useMemo, useState } from 'react'

function VoiceChat() {
  const [useVoice, setUseVoice] = useState(false)
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b">
        <button
          onClick={() => setUseVoice(!useVoice)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {useVoice ? 'Disable Voice' : 'Enable Voice'}
        </button>
      </div>
      
      {useVoice && (
        <VoiceInput
          onTranscript={(text) => {
            append({ role: 'user', content: text })
          }}
          lang="en-US"
          autoSubmit
        />
      )}
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
      />
    </div>
  )
}
```

**Key Points:**
- Enable voice input with `VoiceInput` component
- Handle transcriptions
- Set language and auto-submit options

---

## Advanced Recipes

- [RAG-Enabled Chat](./rag-chat.md) - Document Q&A with RAG
- [Multi-Tenant Chat](./multi-tenant.md) - Enterprise multi-tenancy
- [Agent Orchestration](./agents.md) - ReAct agents with tools
- [Custom Tool UI](./custom-tools.md) - Custom tool result rendering

---

## Contributing

Have a recipe to share? Open a PR with:
- Clear, copy-paste ready code
- Explanation of key points
- Real-world use case
- Any prerequisites or setup needed

---

**Happy Cooking!** 🍳
