# Getting Started

Welcome to Clarity Chat! This guide will help you get up and running with the library in minutes.

## What is Clarity Chat?

Clarity Chat is an enterprise-grade React component library for building AI chat interfaces. It provides everything you need to create beautiful, production-ready chat applications with minimal effort.

## Key Features

- **24 Professional Components**: Complete set of chat UI components
- **21 React Hooks**: Powerful hooks for chat functionality
- **Real-time Streaming**: Built-in SSE and WebSocket support
- **Error Handling**: Comprehensive error recovery system
- **TypeScript**: Full type safety and IntelliSense
- **Accessible**: WCAG 2.1 compliant
- **Customizable**: Extensive theming and styling options
- **Production Ready**: Battle-tested and optimized

## Prerequisites

Before you begin, make sure you have:

- **Node.js**: Version 18 or higher
- **React**: Version 18 or higher
- **Package Manager**: npm, yarn, or pnpm

## Installation

Choose your package manager:

::: code-group

```bash [npm]
npm install @clarity-chat/react
```

```bash [yarn]
yarn add @clarity-chat/react
```

```bash [pnpm]
pnpm add @clarity-chat/react
```

:::

## Your First Chat

Create a simple chat interface in 3 steps:

### 1. Import Components

```tsx
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'
```

### 2. Set Up State

```tsx
function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: Date.now(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
}
```

### 3. Handle Messages

```tsx
const handleSendMessage = async (content: string) => {
  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: Date.now(),
  }
  setMessages(prev => [...prev, userMessage])
  setIsLoading(true)

  try {
    // Call your AI API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    })
    
    const data = await response.json()
    
    // Add AI response
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: data.message,
      timestamp: Date.now(),
    }])
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    setIsLoading(false)
  }
}
```

### 4. Render Chat

```tsx
return (
  <div style={{ width: '800px', height: '600px' }}>
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
    />
  </div>
)
```

## Complete Example

Here's the full code:

```tsx
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: Date.now(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })
      
      const data = await response.json()
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      }])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ width: '800px', height: '600px' }}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
```

## What's Next?

Now that you have a basic chat working, explore more features:

- **[Quick Start](/guide/quick-start)** - Build more advanced features
- **[Components](/guide/components)** - Learn about all available components
- **[Streaming](/guide/streaming)** - Add real-time streaming
- **[Error Handling](/guide/error-handling)** - Handle errors gracefully
- **[Customization](/guide/customization)** - Customize the appearance

## Need Help?

- Check the [Examples](/examples/) for working demos
- Read the [Cookbook](/cookbook) for common patterns
- Browse the [API Reference](/api/components) for detailed documentation
- Join our [GitHub Discussions](https://github.com/yourusername/clarity-chat/discussions)

## Common Issues

### TypeScript Errors

Make sure you're using TypeScript 5.0+ and have the correct types imported:

```json
{
  "compilerOptions": {
    "types": ["@clarity-chat/react"]
  }
}
```

### Styling Issues

Import the default styles if components appear unstyled:

```tsx
import '@clarity-chat/react/styles.css'
```

### Performance Issues

For large message lists, enable virtualization:

```tsx
<ChatWindow
  messages={messages}
  virtualizeMessages
  onSendMessage={handleSendMessage}
/>
```
