# Clarity Chat - Quick Reference Guide

**A fast reference for developers using Clarity Chat**

---

## 🚀 Installation

```bash
npm install @clarity-chat/react
```

---

## 📦 Basic Imports

```typescript
// Core components
import {
  ChatWindow,
  Message,
  MessageList,
  ChatInput,
  VoiceInput,
} from '@clarity-chat/react'

// Providers
import {
  ThemeProvider,
  AnalyticsProvider,
  ErrorReporterProvider,
  AIProvider,
} from '@clarity-chat/react'

// Hooks
import {
  useChat,
  useStreaming,
  useVoiceInput,
  useMobileKeyboard,
  useAnalytics,
} from '@clarity-chat/react'

// Templates
import {
  SupportBot,
  CodeAssistant,
} from '@clarity-chat/react'

// Themes
import { themes } from '@clarity-chat/react'
```

---

## 🎨 Theming

### Apply Theme
```tsx
import { ThemeProvider, themes } from '@clarity-chat/react'

<ThemeProvider theme={themes.glassmorphism}>
  <App />
</ThemeProvider>
```

### Available Themes
- `themes.glassmorphism` - Modern glass effects (NEW!)
- `themes['default-light']` - Clean light theme
- `themes['default-dark']` - Sleek dark theme
- `themes['minimal-light']` - Minimalist light
- `themes['minimal-dark']` - Minimalist dark
- `themes['vibrant-light']` - Energetic purple/pink
- `themes['vibrant-dark']` - Bold vibrant dark
- `themes.ocean` - Refreshing blue
- `themes.sunset` - Warm orange/pink
- `themes.forest` - Natural green
- `themes.corporate` - Professional business

---

## 💬 Basic Chat

```tsx
import { ChatWindow } from '@clarity-chat/react'

function BasicChat() {
  const [messages, setMessages] = useState([])

  const handleSend = async (content: string) => {
    // Add user message
    setMessages([...messages, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    }])

    // Get AI response
    const response = await getAIResponse(content)
    
    // Add AI message
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: Date.now()
    }])
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}
```

---

## 🎤 Voice Input

```tsx
import { VoiceInput } from '@clarity-chat/react'

function ChatWithVoice() {
  const [input, setInput] = useState('')

  return (
    <div className="flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      
      <VoiceInput
        onTranscript={(text) => {
          setInput(prev => prev ? `${prev} ${text}` : text)
        }}
        lang="en-US"
        variant="primary"
        size="lg"
      />
    </div>
  )
}
```

### Supported Languages
```typescript
'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 
'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW',
'ru-RU', 'ar-SA', 'hi-IN', 'tr-TR', 'pl-PL',
'nl-NL', 'sv-SE', 'da-DK', 'fi-FI', 'no-NO'
```

---

## 📱 Mobile Keyboard Handling

```tsx
import { useMobileKeyboard } from '@clarity-chat/react'

function MobileChat() {
  const { 
    isKeyboardVisible, 
    keyboardHeight,
    isMobile 
  } = useMobileKeyboard({
    autoScroll: true,
    scrollOffset: 20,
    onKeyboardShow: (height) => {
      console.log('Keyboard height:', height)
    }
  })

  return (
    <div style={{ paddingBottom: keyboardHeight }}>
      <ChatWindow />
    </div>
  )
}
```

---

## 🤖 Pre-built Templates

### Support Bot
```tsx
import { SupportBot } from '@clarity-chat/react'

<SupportBot
  botName="HelpDesk"
  welcomeMessage="Hi! How can I help?"
  quickReplies={[
    { text: 'Track Order', action: 'track' },
    { text: 'Return Item', action: 'return' },
  ]}
  knowledgeBase={[
    {
      question: 'How do I reset password?',
      answer: 'Click Forgot Password...',
      keywords: ['password', 'reset', 'login']
    }
  ]}
  onEscalate={() => connectToAgent()}
/>
```

### Code Assistant
```tsx
import { CodeAssistant } from '@clarity-chat/react'

<CodeAssistant
  assistantName="CodeBot"
  supportedLanguages={['javascript', 'typescript', 'python']}
  codeContext={yourCode}
  enableExecution={true}
  onExecuteCode={runInSandbox}
/>
```

---

## 📊 Analytics

```tsx
import { 
  AnalyticsProvider,
  createGoogleAnalyticsProvider,
  useAnalyticsEvent 
} from '@clarity-chat/react'

// Setup
<AnalyticsProvider
  config={{
    providers: [
      createGoogleAnalyticsProvider('GA-XXXXX')
    ],
    autoTrack: {
      pageViews: true,
      errors: true
    }
  }}
>
  <App />
</AnalyticsProvider>

// Track custom events
function Component() {
  const trackEvent = useAnalyticsEvent()
  
  const handleAction = () => {
    trackEvent('button_clicked', {
      buttonName: 'submit',
      page: 'chat'
    })
  }
}
```

### Available Providers
- Google Analytics (GA4)
- Mixpanel
- PostHog
- Amplitude
- Heap
- Segment
- Custom API

---

## 🐛 Error Tracking

```tsx
import { 
  ErrorReporterProvider,
  createSentryProvider,
  ErrorBoundaryEnhanced 
} from '@clarity-chat/react'

// Setup
<ErrorReporterProvider
  config={{
    providers: [
      createSentryProvider({ 
        dsn: 'your-sentry-dsn' 
      })
    ],
    enabled: true
  }}
>
  <ErrorBoundaryEnhanced enableFeedback>
    <App />
  </ErrorBoundaryEnhanced>
</ErrorReporterProvider>
```

### Available Providers
- Sentry
- Rollbar
- Bugsnag
- Raygun
- Airbrake
- Custom API

---

## 🤖 AI Features

```tsx
import { 
  AIProvider,
  createQuickReplyProvider,
  createProfanityFilter,
  useSuggestions 
} from '@clarity-chat/react'

// Setup
<AIProvider
  config={{
    suggestionProviders: [
      createQuickReplyProvider([
        { text: 'Hello!', triggers: ['hi', 'hello'] },
        { text: 'Help me', triggers: ['help', 'support'] }
      ])
    ],
    moderationProviders: [
      createProfanityFilter()
    ]
  }}
>
  <App />
</AIProvider>

// Use suggestions
function Component() {
  const { suggestions, loading } = useSuggestions('How do I...')
  
  return (
    <div>
      {suggestions.map(s => (
        <button key={s.id}>{s.text}</button>
      ))}
    </div>
  )
}
```

---

## 🎯 Common Hooks

### useChat
```typescript
const {
  messages,
  sendMessage,
  isLoading,
  error
} = useChat()
```

### useStreaming
```typescript
const {
  stream,
  isStreaming,
  cancel
} = useStreaming()
```

### useVoiceInput
```typescript
const {
  isListening,
  transcript,
  startListening,
  stopListening,
  isSupported
} = useVoiceInput({ lang: 'en-US' })
```

### useMobileKeyboard
```typescript
const {
  isKeyboardVisible,
  keyboardHeight,
  isMobile
} = useMobileKeyboard()
```

### useAnalytics
```typescript
const {
  track,
  pageView,
  identify
} = useAnalytics()
```

---

## 🎨 Component Props

### ChatWindow
```typescript
interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (content: string) => void | Promise<void>
  isLoading?: boolean
  placeholder?: string
  showAvatar?: boolean
  enableMarkdown?: boolean
  enableVoice?: boolean
  className?: string
}
```

### VoiceInput
```typescript
interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  lang?: string
  showInterim?: boolean
  autoSubmit?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  className?: string
}
```

### SupportBot
```typescript
interface SupportBotConfig {
  botName?: string
  botAvatar?: string
  welcomeMessage?: string
  quickReplies?: Array<{ text: string; action: string }>
  knowledgeBase?: Array<{
    question: string
    answer: string
    keywords: string[]
  }>
  escalationThreshold?: number
  onEscalate?: () => void
  className?: string
}
```

---

## 🎯 TypeScript Types

```typescript
import type {
  Message,
  ChatUser,
  Theme,
  AnalyticsEvent,
  ErrorReport,
  Suggestion,
  VoiceInputState,
  MobileKeyboardState,
} from '@clarity-chat/react'

// Message type
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  metadata?: Record<string, any>
}

// Theme type
interface Theme {
  name: string
  mode: 'light' | 'dark'
  colors: ColorConfig
  typography: TypographyConfig
  // ... more config
}
```

---

## 🚀 Performance Tips

### 1. Use Virtualized Lists for Long Conversations
```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  height={600}
  itemSize={100}
/>
```

### 2. Implement Streaming for Better UX
```tsx
const { stream } = useStreaming()

const handleSend = async (content: string) => {
  await stream(apiEndpoint, {
    onToken: (token) => {
      // Update UI with each token
    }
  })
}
```

### 3. Use Optimistic Updates
```tsx
import { useOptimisticMessage } from '@clarity-chat/react'

const { addOptimistic, confirmMessage } = useOptimisticMessage()

const handleSend = async (content: string) => {
  const tempId = addOptimistic(content)
  const response = await sendToAPI(content)
  confirmMessage(tempId, response.id)
}
```

---

## ♿ Accessibility

### Keyboard Shortcuts
```tsx
import { useKeyboardShortcuts } from '@clarity-chat/react'

useKeyboardShortcuts({
  'ctrl+enter': sendMessage,
  'esc': clearInput,
  'ctrl+k': focusSearch,
})

// Show help modal with Shift+?
```

### Screen Reader Support
```tsx
import { useAriaAnnounce } from '@clarity-chat/react'

const announce = useAriaAnnounce()

const handleNewMessage = (message: string) => {
  announce(`New message: ${message}`)
}
```

---

## 🎓 Best Practices

### 1. Always Use Theme Provider
```tsx
// ✅ Good
<ThemeProvider theme={themes.glassmorphism}>
  <App />
</ThemeProvider>

// ❌ Bad
<App /> // No theme
```

### 2. Handle Errors Gracefully
```tsx
// ✅ Good
<ErrorBoundaryEnhanced enableFeedback>
  <ChatWindow />
</ErrorBoundaryEnhanced>

// ❌ Bad
<ChatWindow /> // No error boundary
```

### 3. Track Important Events
```tsx
// ✅ Good
trackEvent('message_sent', { length: message.length })

// ❌ Bad
// No analytics tracking
```

### 4. Support Mobile
```tsx
// ✅ Good
const { keyboardHeight } = useMobileKeyboard()
<div style={{ paddingBottom: keyboardHeight }}>

// ❌ Bad
// No mobile keyboard handling
```

---

## 📚 More Resources

- **Full Documentation**: See complete docs in `/docs`
- **Examples**: Check `/examples` folder for 10+ demos
- **Storybook**: Run `npm run storybook` for interactive docs
- **API Reference**: TypeScript definitions included
- **Phase Reports**: See PHASE4_COMPLETE.md for details

---

## 🆘 Common Issues

### Issue: Voice input not working
**Solution**: Check browser support (Chrome/Safari only)
```typescript
const { isSupported } = useVoiceInput()
if (!isSupported) {
  // Show alternative input
}
```

### Issue: Mobile keyboard not detected
**Solution**: Ensure you're testing on actual mobile device
```typescript
const { isMobile } = useMobileKeyboard()
console.log('Is mobile:', isMobile)
```

### Issue: Themes not applying
**Solution**: Wrap app with ThemeProvider
```tsx
<ThemeProvider theme={themes.glassmorphism}>
  <App />
</ThemeProvider>
```

---

## 🎯 Quick Command Reference

```bash
# Install
npm install @clarity-chat/react

# Development
npm run dev          # Start dev server
npm run build        # Build all packages
npm run test         # Run tests
npm run storybook    # Start Storybook
npm run docs         # Start docs site

# Linting
npm run lint         # Lint code
npm run typecheck    # Type check
```

---

**Need more help?** Check the full documentation or examples folder!

**Built with ❤️ by Code & Clarity**
