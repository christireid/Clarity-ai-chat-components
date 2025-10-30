# 🎯 Your First Component

> **Learn the core concepts of Clarity Chat by building your first interactive chat component**

---

## 📚 What You'll Learn

In this tutorial, you'll understand:
- 🧩 How components work together
- 🎨 Theme system fundamentals
- 💬 Message state management
- 🔄 Event handling patterns
- ⚡ Best practices and patterns

**Time to complete**: ~15 minutes

---

## 🎬 Prerequisites

Before starting, make sure you have:
- ✅ Completed the [Installation Guide](./installation.md)
- ✅ Node.js 16+ installed
- ✅ Basic React knowledge
- ✅ A code editor (VS Code recommended)

---

## 🏗️ Architecture Overview

Clarity Chat follows a **component composition** pattern. Here's how the pieces fit together:

```
┌─────────────────────────────────────┐
│         ThemeProvider               │  ← Provides theme context
│  ┌───────────────────────────────┐  │
│  │        ChatWindow             │  │  ← Main container
│  │  ┌─────────────────────────┐  │  │
│  │  │     MessageList         │  │  │  ← Displays messages
│  │  │  ┌─────────────────┐    │  │  │
│  │  │  │    Message      │    │  │  │  ← Individual messages
│  │  │  └─────────────────┘    │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │      ChatInput          │  │  │  ← User input
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🚀 Step 1: Create Your First Chat

Let's start with the most basic chat interface:

### Basic Setup

```tsx
import { useState } from 'react'
import { ChatWindow, ThemeProvider, defaultLightTheme } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState([])

  return (
    <ThemeProvider theme={defaultLightTheme}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ChatWindow
          messages={messages}
          onSendMessage={(content) => {
            console.log('User sent:', content)
          }}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
```

**What's happening here?**
- `ThemeProvider` wraps your app and provides theme context
- `ChatWindow` is the main component that handles the complete chat UI
- `messages` state holds the conversation history
- `onSendMessage` is called when the user sends a message

---

## 💬 Step 2: Add Message Handling

Now let's make the chat actually respond:

```tsx
import { useState } from 'react'
import { ChatWindow, ThemeProvider, defaultLightTheme } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response (replace with your AI API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `You said: "${content}". This is a demo response!`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <ThemeProvider theme={defaultLightTheme}>
      <div style={{ height: '100vh' }}>
        <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </ThemeProvider>
  )
}
```

**Key Concepts:**
- Each message has a unique `id`, `role`, `content`, and `timestamp`
- Messages are immutable - we create new arrays instead of mutating
- User messages have `role: 'user'`, AI messages have `role: 'assistant'`

---

## 🎨 Step 3: Apply Themes

Clarity Chat includes 10 beautiful pre-built themes. Let's try them:

```tsx
import { useState } from 'react'
import {
  ChatWindow,
  ThemeProvider,
  ThemeSelector,
  themes,
} from '@clarity-chat/react'
import type { Message, Theme } from '@clarity-chat/types'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.ocean)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate response
    setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `You said: "${content}"`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Theme selector in header */}
        <div style={{ padding: '1rem', background: 'var(--background)' }}>
          <ThemeSelector
            themes={Object.values(themes)}
            currentTheme={currentTheme}
            onChange={setCurrentTheme}
          />
        </div>

        {/* Chat window */}
        <div style={{ flex: 1 }}>
          <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
        </div>
      </div>
    </ThemeProvider>
  )
}
```

**Available Themes:**
- `themes.default` - Clean and professional
- `themes.dark` - Dark mode
- `themes.ocean` - Blue ocean vibes
- `themes.glassmorphism` - Modern glass effect
- `themes.sunset` - Warm sunset colors
- `themes.forest` - Green nature theme
- `themes.corporate` - Professional business
- `themes.neon` - Cyberpunk neon
- `themes.minimal` - Ultra minimal
- `themes.warm` - Cozy warm tones

---

## ⚡ Step 4: Add Real AI Integration

Let's connect to OpenAI (or any AI provider):

```tsx
import { useState } from 'react'
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call your AI API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await response.json()

      // Add AI response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)

      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        error: true,
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemeProvider theme={themes.ocean}>
      <div style={{ height: '100vh' }}>
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={isLoading ? 'AI is thinking...' : 'Type your message...'}
        />
      </div>
    </ThemeProvider>
  )
}
```

**Backend Example (Next.js API Route):**

```typescript
// pages/api/chat.ts
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req, res) {
  const { messages } = req.body

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  })

  res.json({ message: completion.choices[0].message.content })
}
```

---

## 🔄 Step 5: Add Streaming Responses

For a more responsive feel, stream AI responses word-by-word:

```tsx
import { useState } from 'react'
import { ChatWindow, ThemeProvider, themes, useStreaming } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const { streamMessage, isStreaming } = useStreaming({
    onChunk: (chunk, messageId) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, content: msg.content + chunk } : msg
        )
      )
    },
  })

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Create empty AI message for streaming
    const aiMessageId = crypto.randomUUID()
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiMessage])

    // Stream the response
    await streamMessage('/api/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ messages: [...messages, userMessage] }),
      messageId: aiMessageId,
    })
  }

  return (
    <ThemeProvider theme={themes.ocean}>
      <div style={{ height: '100vh' }}>
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isStreaming}
        />
      </div>
    </ThemeProvider>
  )
}
```

---

## 🎛️ Step 6: Customize the UI

ChatWindow accepts many props for customization:

```tsx
<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  
  // Appearance
  placeholder="Ask me anything..."
  showTimestamps={true}
  showAvatars={true}
  
  // Features
  enableFileUpload={true}
  enableVoiceInput={true}
  enableMarkdown={true}
  
  // Behavior
  autoScroll={true}
  autoFocus={true}
  
  // Custom components
  header={<MyCustomHeader />}
  footer={<MyCustomFooter />}
  
  // Event handlers
  onMessageEdit={(messageId, newContent) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    )
  }}
  
  onMessageDelete={(messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
  }}
  
  onCopy={(content) => {
    console.log('User copied:', content)
  }}
/>
```

---

## 🧩 Step 7: Use Individual Components

You can also compose components yourself for more control:

```tsx
import {
  ThemeProvider,
  MessageList,
  ChatInput,
  themes,
} from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function CustomChat() {
  const [messages, setMessages] = useState<Message[]>([])

  return (
    <ThemeProvider theme={themes.dark}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Custom header */}
        <header style={{ padding: '1rem', background: 'var(--primary)' }}>
          <h1>My Custom Chat</h1>
        </header>

        {/* Message list */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <MessageList
            messages={messages}
            onCopy={(content) => navigator.clipboard.writeText(content)}
            onEdit={(id, content) => {
              setMessages((prev) =>
                prev.map((msg) => (msg.id === id ? { ...msg, content } : msg))
              )
            }}
          />
        </div>

        {/* Chat input */}
        <div style={{ padding: '1rem' }}>
          <ChatInput
            onSend={(content) => {
              const msg: Message = {
                id: crypto.randomUUID(),
                role: 'user',
                content,
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, msg])
            }}
            placeholder="Type here..."
          />
        </div>
      </div>
    </ThemeProvider>
  )
}
```

---

## 🎓 Core Concepts Summary

### 1. **Message Structure**
Every message must have:
```typescript
interface Message {
  id: string           // Unique identifier
  role: 'user' | 'assistant' | 'system'
  content: string      // The message text
  timestamp: Date      // When it was sent
  error?: boolean      // Optional error flag
  metadata?: any       // Optional custom data
}
```

### 2. **Theme System**
Themes control all visual aspects:
```typescript
interface Theme {
  name: string
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    // ... more colors
  }
  fonts: {
    body: string
    heading: string
  }
  animations: {
    duration: number
    easing: string
  }
}
```

### 3. **State Management**
- Keep messages in React state
- Update immutably (create new arrays)
- Use unique IDs for each message
- Manage loading states separately

### 4. **Event Handling**
- `onSendMessage`: When user sends a message
- `onMessageEdit`: When user edits a message
- `onMessageDelete`: When user deletes a message
- `onCopy`: When user copies content

---

## 🚀 Next Steps

Now that you understand the basics, explore:

1. **[Streaming Guide](../guides/streaming.md)** - Real-time AI responses
2. **[Voice Input](../guides/voice-input.md)** - Speech-to-text integration
3. **[Error Handling](../guides/error-handling.md)** - Robust error recovery
4. **[Analytics](../guides/analytics.md)** - Track user interactions
5. **[Templates](../../examples/README.md)** - Pre-built chat configurations

---

## 💡 Best Practices

### ✅ Do's
- Always wrap components in `ThemeProvider`
- Use TypeScript for type safety
- Handle errors gracefully
- Test with different themes
- Implement loading states
- Add proper error messages

### ❌ Don'ts
- Don't mutate the messages array directly
- Don't forget to import the CSS file
- Don't skip error handling
- Don't ignore accessibility
- Don't hardcode API keys (use environment variables)

---

## 🐛 Troubleshooting

### Messages not appearing?
- Check that you're updating state correctly
- Ensure messages have unique IDs
- Verify ThemeProvider is wrapping your components

### Styles not working?
- Import `@clarity-chat/react/styles.css`
- Check that CSS file is being loaded
- Inspect browser console for errors

### TypeScript errors?
- Import types from `@clarity-chat/types`
- Ensure `@clarity-chat/types` is installed
- Check your tsconfig.json

---

## 📚 Additional Resources

- **[API Reference](../api/components.md)** - Complete component documentation
- **[Examples](../../examples/README.md)** - Working code examples
- **[Quick Start](./quick-start.md)** - 5-minute tutorial
- **[GitHub](https://github.com/christireid/Clarity-ai-chat-components)** - Source code

---

**Ready to build something amazing?** Start with one of our [pre-built templates](../../examples/README.md)! 🚀
