# Quick Start Guide

Build your first AI chat interface in 5 minutes with Clarity Chat Components.

## Installation

```bash
npm install @clarity-chat/react
```

## Basic Chat Interface

Here's the minimal code to get a working chat interface:

```tsx
import React, { useState } from 'react'
import { 
  ChatWindow, 
  ThemeProvider, 
  defaultLightTheme 
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState([])

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content,
      role: 'user' as const,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])

    // Simulate AI response (replace with your API call)
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `You said: "${content}". How can I help you further?`,
        role: 'assistant' as const,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <ThemeProvider theme={defaultLightTheme}>
      <div style={{ height: '100vh' }}>
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
```

## Adding AI Integration

### OpenAI Integration

```tsx
import { OpenAIAdapter } from '@clarity-chat/react'

const openai = new OpenAIAdapter({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY!,
  model: 'gpt-4-turbo-preview',
})

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content,
      role: 'user' as const,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Get AI response
      const response = await openai.chat({
        messages: [...messages, userMessage],
      })

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant' as const,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemeProvider theme={defaultLightTheme}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </ThemeProvider>
  )
}
```

### Streaming Responses

```tsx
import { useStreaming } from '@clarity-chat/react'

function App() {
  const [messages, setMessages] = useState([])
  const { streamMessage, isStreaming } = useStreaming()

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content,
      role: 'user' as const,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])

    // Stream AI response
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant' as const,
      timestamp: new Date(),
      isStreaming: true,
    }
    
    setMessages(prev => [...prev, aiMessage])

    await streamMessage({
      url: '/api/chat',
      body: { message: content },
      onChunk: (chunk) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        )
      },
      onComplete: () => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          )
        )
      },
    })
  }

  return (
    <ThemeProvider theme={defaultLightTheme}>
      <ChatWindow
        messages={messages}
        isLoading={isStreaming}
        onSendMessage={handleSendMessage}
      />
    </ThemeProvider>
  )
}
```

## Customizing the Theme

### Using Pre-built Themes

```tsx
import { 
  ThemeProvider, 
  oceanTheme,
  sunsetTheme,
  forestTheme,
  corporateTheme 
} from '@clarity-chat/react'

// Choose any theme
<ThemeProvider theme={oceanTheme}>
  <ChatWindow {...props} />
</ThemeProvider>
```

### Dark Mode

```tsx
import { defaultDarkTheme } from '@clarity-chat/react'

<ThemeProvider theme={defaultDarkTheme}>
  <ChatWindow {...props} />
</ThemeProvider>
```

### Custom Theme

```tsx
import { createTheme } from '@clarity-chat/react'

const myCustomTheme = createTheme({
  colors: {
    primary: '220 90% 56%', // HSL values
    background: '0 0% 98%',
    foreground: '222 84% 5%',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
    },
  },
})

<ThemeProvider theme={myCustomTheme}>
  <ChatWindow {...props} />
</ThemeProvider>
```

## Adding Features

### File Upload

```tsx
<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  onFileUpload={(files) => {
    console.log('Files uploaded:', files)
    // Handle file upload
  }}
  enableFileUpload
/>
```

### Voice Input

```tsx
import { VoiceInput } from '@clarity-chat/react'

function ChatWithVoice() {
  const [input, setInput] = useState('')

  return (
    <>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
      />
      <VoiceInput
        onTranscript={(text) => setInput(text)}
        onSubmit={(text) => handleSendMessage(text)}
      />
    </>
  )
}
```

### Context Management

```tsx
import { ContextManager } from '@clarity-chat/react'

function ChatWithContext() {
  const [context, setContext] = useState([])

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ContextManager
        items={context}
        onAddItem={(item) => setContext([...context, item])}
        onRemoveItem={(id) => 
          setContext(context.filter(c => c.id !== id))
        }
      />
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        context={context}
      />
    </div>
  )
}
```

### Analytics

```tsx
import { 
  AnalyticsProvider, 
  createGoogleAnalyticsProvider 
} from '@clarity-chat/react'

const analyticsProvider = createGoogleAnalyticsProvider('G-XXXXXXXXXX')

function App() {
  return (
    <AnalyticsProvider config={{ providers: [analyticsProvider] }}>
      <ThemeProvider theme={defaultLightTheme}>
        <ChatWindow {...props} />
      </ThemeProvider>
    </AnalyticsProvider>
  )
}
```

## API Endpoint Example

Here's a simple Next.js API route for chat:

```ts
// app/api/chat/route.ts
import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { message } = await req.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: message }],
  })

  return NextResponse.json({
    content: completion.choices[0].message.content,
  })
}
```

## Complete Example

Here's a full-featured chat implementation:

```tsx
import React, { useState } from 'react'
import {
  ChatWindow,
  ThemeProvider,
  AnalyticsProvider,
  ContextManager,
  UsageDashboard,
  oceanTheme,
  createGoogleAnalyticsProvider,
  useLocalStorage,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function CompleteChatApp() {
  const [messages, setMessages] = useLocalStorage('chat-messages', [])
  const [context, setContext] = useState([])
  const [usage, setUsage] = useState({ tokens: 0, cost: 0 })

  const handleSendMessage = async (content: string) => {
    // Your implementation
  }

  return (
    <AnalyticsProvider 
      config={{ 
        providers: [createGoogleAnalyticsProvider('G-XXX')] 
      }}
    >
      <ThemeProvider theme={oceanTheme}>
        <div style={{ display: 'flex', height: '100vh' }}>
          <ContextManager
            items={context}
            onAddItem={(item) => setContext([...context, item])}
            style={{ width: '300px' }}
          />
          
          <div style={{ flex: 1 }}>
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              enableFileUpload
              enableVoiceInput
              context={context}
            />
          </div>
          
          <UsageDashboard
            usage={usage}
            style={{ width: '250px' }}
          />
        </div>
      </ThemeProvider>
    </AnalyticsProvider>
  )
}

export default CompleteChatApp
```

## Next Steps

- [Component API Reference](../api/components.md)
- [Hooks Documentation](../api/hooks.md)
- [Theming Guide](../guides/theming.md)
- [Streaming Guide](../guides/streaming.md)
- [Examples](../../examples)