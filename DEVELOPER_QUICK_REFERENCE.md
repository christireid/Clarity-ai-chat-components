# 🚀 Developer Quick Reference

## Essential Commands

```bash
# Installation
npm install @clarity-chat/react

# Import CSS
import '@clarity-chat/react/styles.css'

# Basic usage
import { ChatWindow, ThemeProvider, oceanTheme } from '@clarity-chat/react'
```

---

## 📦 Most Used Components

### ChatWindow (Main Interface)
```tsx
<ChatWindow
  messages={messages}
  onSendMessage={(content) => handleSend(content)}
  isLoading={isLoading}
  enableFileUpload={true}
  enableVoiceInput={true}
/>
```

### With Theme
```tsx
<ThemeProvider theme={oceanTheme}>
  <ChatWindow {...props} />
</ThemeProvider>
```

### With Streaming
```tsx
const { streamMessage, isStreaming } = useStreaming()

await streamMessage({
  url: '/api/chat',
  body: { message: content },
  onChunk: (chunk) => updateMessage(chunk),
  onComplete: () => markComplete(),
})
```

---

## 🎨 Quick Theme Reference

```tsx
import {
  defaultLightTheme,    // Clean professional
  defaultDarkTheme,     // Dark mode
  oceanTheme,           // Blue ocean
  sunsetTheme,          // Warm sunset
  forestTheme,          // Green nature
  corporateTheme,       // Business
  minimalLightTheme,    // Ultra minimal
  minimalDarkTheme,     // Minimal dark
  vibrantLightTheme,    // Colorful light
  vibrantDarkTheme,     // Colorful dark
} from '@clarity-chat/react'
```

---

## 🪝 Most Used Hooks

```tsx
// Chat management
const { messages, addMessage, updateMessage } = useChat()

// Streaming
const { streamMessage, isStreaming, cancel } = useStreaming()

// Error recovery
const { executeWithRetry } = useErrorRecovery({
  maxRetries: 3,
  initialDelay: 1000,
})

// Token tracking
const { tokens, cost, trackUsage } = useTokenTracker()

// Local storage
const [messages, setMessages] = useLocalStorage('chat-messages', [])

// Clipboard
const { copy, copied } = useClipboard()

// Auto-scroll
const { scrollRef, scrollToBottom } = useAutoScroll()
```

---

## 🤖 AI Integration Examples

### OpenAI
```tsx
import { OpenAIAdapter } from '@clarity-chat/react'

const openai = new OpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview',
})

const response = await openai.chat({
  messages: [...messages],
})
```

### Anthropic
```tsx
import { AnthropicAdapter } from '@clarity-chat/react'

const anthropic = new AnthropicAdapter({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-opus',
})
```

### Google
```tsx
import { GoogleAdapter } from '@clarity-chat/react'

const google = new GoogleAdapter({
  apiKey: process.env.GOOGLE_AI_API_KEY,
  model: 'gemini-pro',
})
```

---

## 📊 Analytics Setup

```tsx
import {
  AnalyticsProvider,
  createGoogleAnalyticsProvider,
  createMixpanelProvider,
} from '@clarity-chat/react'

<AnalyticsProvider
  config={{
    providers: [
      createGoogleAnalyticsProvider('GA-XXXXX'),
      createMixpanelProvider('token'),
    ],
    autoTrack: {
      pageViews: true,
      errors: true,
    },
  }}
>
  <App />
</AnalyticsProvider>
```

---

## 🎯 Pre-built Templates

```tsx
import {
  CustomerSupportTemplate,
  AIAssistantTemplate,
  CodeHelperTemplate,
} from '@clarity-chat/react'

// Customer Support
<CustomerSupportTemplate
  companyName="Acme Corp"
  supportCategories={['Orders', 'Technical', 'Billing']}
  onEscalate={(conversation) => escalateToHuman(conversation)}
/>

// AI Assistant
<AIAssistantTemplate
  apiKeys={{
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
  }}
  defaultModel="gpt-4"
  enableFileUpload
  enableVoiceInput
/>

// Code Helper
<CodeHelperTemplate
  apiKeys={{ openai: process.env.OPENAI_API_KEY }}
  languages={['typescript', 'python', 'react']}
/>
```

---

## 🐛 Error Handling

```tsx
import {
  ErrorBoundary,
  useErrorRecovery,
  createSentryProvider,
} from '@clarity-chat/react'

// Error Boundary
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )}
>
  <ChatWindow {...props} />
</ErrorBoundary>

// Error Recovery Hook
const { executeWithRetry } = useErrorRecovery({
  maxRetries: 3,
  initialDelay: 1000,
  onError: (error) => console.error(error),
})

await executeWithRetry(async () => {
  return await fetch('/api/chat')
})
```

---

## 📱 Mobile Optimization

```tsx
import { useMobileKeyboard, useMediaQuery } from '@clarity-chat/react'

function MobileChat() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { keyboardHeight, isKeyboardVisible } = useMobileKeyboard()

  return (
    <div style={{ paddingBottom: keyboardHeight }}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
        compact={isMobile}
      />
    </div>
  )
}
```

---

## 🎨 Custom Theming

```tsx
import { createTheme, ThemeProvider } from '@clarity-chat/react'

const myTheme = createTheme({
  colors: {
    primary: '220 90% 56%',      // HSL format
    background: '0 0% 98%',
    foreground: '222 84% 5%',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'Fira Code, monospace',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    4: '1rem',
  },
})

<ThemeProvider theme={myTheme}>
  <App />
</ThemeProvider>
```

---

## 🔧 TypeScript Tips

```tsx
import type {
  Message,
  User,
  ChatConfig,
  Theme,
  AIModel,
} from '@clarity-chat/react'

// Typed message
const message: Message = {
  id: '1',
  role: 'user',
  content: 'Hello',
  timestamp: new Date(),
}

// Typed handler
const handleSend = (content: string): Promise<void> => {
  // Implementation
}
```

---

## 📚 Common Patterns

### Message State Management
```tsx
const [messages, setMessages] = useState<Message[]>([])

// Add message
const addMessage = (content: string, role: 'user' | 'assistant') => {
  const newMessage: Message = {
    id: Date.now().toString(),
    role,
    content,
    timestamp: new Date(),
  }
  setMessages(prev => [...prev, newMessage])
}

// Update streaming message
const updateMessage = (id: string, chunk: string) => {
  setMessages(prev =>
    prev.map(msg =>
      msg.id === id
        ? { ...msg, content: msg.content + chunk }
        : msg
    )
  )
}
```

### Context Management
```tsx
const [context, setContext] = useState<Context[]>([])

<ContextManager
  items={context}
  onAddItem={(item) => setContext(prev => [...prev, item])}
  onRemoveItem={(id) => setContext(prev => prev.filter(c => c.id !== id))}
/>
```

### Streaming with Error Handling
```tsx
const { streamMessage, isStreaming } = useStreaming()
const { executeWithRetry } = useErrorRecovery()

await executeWithRetry(async () => {
  await streamMessage({
    url: '/api/chat',
    body: { message: content },
    onChunk: (chunk) => updateMessage(chunk),
    onError: (error) => handleError(error),
  })
})
```

---

## 🚦 Environment Variables

```bash
# .env.local
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=...

# Error Tracking
SENTRY_DSN=...
```

---

## 🔗 Quick Links

- [Full Documentation](./docs/README.md)
- [Installation Guide](./docs/getting-started/installation.md)
- [Quick Start](./docs/getting-started/quick-start.md)
- [Examples](./examples/README.md)
- [Complete Inventory](./COMPLETE_INVENTORY.md)

---

## 💡 Pro Tips

1. **Always import CSS first**: `import '@clarity-chat/react/styles.css'`
2. **Use ThemeProvider at root**: Wrap your app for consistent theming
3. **Leverage templates**: Start with pre-built templates for common use cases
4. **Enable error recovery**: Always wrap API calls with retry logic
5. **Track tokens**: Use useTokenTracker to monitor costs
6. **Test streaming**: Test streaming responses in development
7. **Mobile first**: Use responsive hooks for mobile optimization
8. **Type everything**: Full TypeScript support available

---

*Quick Reference - v0.1.0*