# Clarity Chat Tutorials

## Overview

Step-by-step tutorials for common use cases and advanced patterns.

---

## Tutorial 1: Building a Chat UI

**Goal**: Build a functional chat interface in minutes.

**Time**: 5 minutes  
**Difficulty**: Beginner

### Step 1: Install

```bash
npm install @clarity-chat/react
```

### Step 2: Import Styles

```tsx
import '@clarity-chat/react/styles.css'
```

### Step 3: Add Chat Component

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}
```

**That's it!** You now have a fully-functional chat interface.

### Step 4: Customize (Optional)

```tsx
<ClarityChat
  api="/api/chat"
  showHeader
  sessionTitle="My AI Assistant"
  sessionSubtitle="How can I help you?"
  onMessageFeedback={(id, type) => {
    console.log('Feedback:', { id, type })
  }}
/>
```

### Next Steps

- Add memory: Use `ChatWithMemory` component
- Add analytics: Wrap with `AnalyticsProvider`
- Custom UI: Use `useChat` hook with `ChatWindow`

---

## Tutorial 2: Using Memory Inside Clarity

**Goal**: Enable conversation memory for context retention.

**Time**: 10 minutes  
**Difficulty**: Intermediate

### Option 1: Pre-configured Component (Easiest)

```tsx
import { ChatWithMemory } from '@clarity-chat/react'

function App() {
  return (
    <ChatWithMemory
      api="/api/chat"
      strategy="vector-store"
    />
  )
}
```

### Option 2: Manual Setup (More Control)

```tsx
import { ClarityChat, MemoryProvider } from '@clarity-chat/react'
import type { MemoryServiceConfig } from '@clarity-chat/memory'

function App() {
  const memoryConfig: MemoryServiceConfig = {
    maxTokens: 10000,
    strategy: 'vector-store',
  }

  return (
    <MemoryProvider config={memoryConfig}>
      <ClarityChat
        api="/api/chat"
        memory={{
          enabled: true,
          strategy: 'vector-store',
          maxTokens: 4000,
        }}
      />
    </MemoryProvider>
  )
}
```

### Memory Strategies

1. **Sliding Window** - Fast, recent context
   ```tsx
   strategy="sliding-window"
   ```

2. **Semantic Chunks** - Context-aware selection
   ```tsx
   strategy="semantic-chunks"
   ```

3. **Vector Store** - Long-term memory with embeddings
   ```tsx
   strategy="vector-store"
   ```

### Accessing Memory

```tsx
import { useMemory } from '@clarity-chat/react'

function MyComponent() {
  const { query, getStats } = useMemory()
  
  // Query memories
  const memories = await query({
    query: 'user preferences',
    limit: 5,
  })
  
  // Get stats
  const stats = getStats()
  console.log('Total memories:', stats.total)
}
```

---

## Tutorial 3: Configuring Advanced Behaviors

**Goal**: Customize chat behavior for your use case.

**Time**: 15 minutes  
**Difficulty**: Intermediate

### Custom Error Handling

```tsx
import { ChatWithErrorHandling } from '@clarity-chat/react'

function App() {
  return (
    <ChatWithErrorHandling
      api="/api/chat"
      errorFallback={({ error, resetError }) => (
        <div>
          <p>Something went wrong: {error.message}</p>
          <button onClick={resetError}>Try Again</button>
        </div>
      )}
    />
  )
}
```

### Custom Persistence

```tsx
import { useChat } from '@clarity-chat/react'

function App() {
  const { messages, sendMessage, isLoading } = useChat({
    api: '/api/chat',
    persistMessages: true,
    storageKey: 'my-custom-chat',
  })
  
  // Messages automatically persist to localStorage
  // and restore on page reload
}
```

### Custom Analytics

```tsx
import { ChatWithAnalytics, AnalyticsProvider } from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider config={{ endpoint: '/api/analytics' }}>
      <ChatWithAnalytics
        api="/api/chat"
        onMessageSent={(content) => {
          // Custom tracking
          console.log('Message sent:', content)
        }}
      />
    </AnalyticsProvider>
  )
}
```

### Custom Transport

```tsx
import { useClarityChat } from '@clarity-chat/react'

function App() {
  const chat = useClarityChat({
    api: '/api/chat',
    transport: 'websocket', // or 'sse' (default)
  })
  
  // Use WebSocket for real-time bidirectional communication
}
```

---

## Tutorial 4: Extending Components

**Goal**: Build custom chat interfaces using composable components.

**Time**: 20 minutes  
**Difficulty**: Advanced

### Custom Message Rendering

```tsx
import { Message, type MessageProps } from '@clarity-chat/react'

function CustomMessage({ message, ...props }: MessageProps) {
  return (
    <div className="custom-message">
      <Message
        message={message}
        {...props}
        // Override default rendering
        showAvatar={false}
        showTimestamp={true}
      />
    </div>
  )
}
```

### Custom Input Component

```tsx
import { ChatInput } from '@clarity-chat/react'

function CustomInput() {
  const [value, setValue] = useState('')
  
  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={(text) => {
        // Custom submit logic
        sendMessage(text)
      }}
      maxLength={500}
      showCharCounter
      placeholder="Type your message..."
    />
  )
}
```

### Custom Chat Layout

```tsx
import { useChat, ChatWindow, MessageList } from '@clarity-chat/react'

function CustomLayout() {
  const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
  
  return (
    <div className="custom-layout">
      <Sidebar />
      <div className="chat-area">
        <MessageList messages={messages} />
        <CustomInput onSend={sendMessage} />
      </div>
      <InfoPanel />
    </div>
  )
}
```

---

## Tutorial 5: Using Flows & Complex Logic

**Goal**: Build complex chat workflows with multiple steps.

**Time**: 30 minutes  
**Difficulty**: Advanced

### Multi-Step Workflow

```tsx
import { useChat, ChatWindow } from '@clarity-chat/react'

function MultiStepWorkflow() {
  const [step, setStep] = useState<'intro' | 'chat' | 'summary'>('intro')
  const chat = useChat({ api: '/api/chat' })
  
  return (
    <div>
      {step === 'intro' && (
        <IntroScreen onStart={() => setStep('chat')} />
      )}
      {step === 'chat' && (
        <ChatWindow
          messages={chat.messages}
          onSendMessage={chat.sendMessage}
          onMessageReceived={(msg) => {
            if (msg.content.includes('done')) {
              setStep('summary')
            }
          }}
        />
      )}
      {step === 'summary' && (
        <SummaryScreen messages={chat.messages} />
      )}
    </div>
  )
}
```

### Conditional Features

```tsx
import { useChatComposable } from '@clarity-chat/react'

function ConditionalChat() {
  const chat = useChatComposable({
    api: '/api/chat',
    features: {
      memory: { enabled: true },
      persistence: { enabled: true },
      analytics: { enabled: false }, // Disable analytics
    },
  })
  
  return <ChatWindow {...chat} />
}
```

### Custom Tool Integration

```tsx
import { useClarityChatWithTools } from '@clarity-chat/react'

function ToolEnabledChat() {
  const chat = useClarityChatWithTools({
    api: '/api/chat',
    tools: {
      weather: async (args) => {
        // Custom tool implementation
        return { temperature: 72, condition: 'sunny' }
      },
      search: async (args) => {
        // Custom search tool
        return { results: [...] }
      },
    },
  })
  
  return <ChatWindow {...chat} />
}
```

---

## Next Steps

- Explore [API Reference](./API_REFERENCE.md)
- Check [Examples](./src/examples/)
- Read [Architecture Guide](./DESIGN.md)
- See [Performance Guide](./PERFORMANCE_GUIDE.md)

---

**Questions?** Check the [Documentation Index](./DOCUMENTATION_INDEX.md) or open an issue.
