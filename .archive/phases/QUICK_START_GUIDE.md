# Quick Start Guide - Chat UI Library

**Complete Chat UI with Analytics, Accessibility, Error Tracking & AI Features**

## 🚀 Installation

```bash
npm install @chat-ui/react
# or
yarn add @chat-ui/react
# or
pnpm add @chat-ui/react
```

## ⚡ 5-Minute Setup

### 1. Basic Chat (Minimal Setup)

```tsx
import { ChatWindow, ThemeProvider } from '@chat-ui/react'

function App() {
  return (
    <ThemeProvider>
      <ChatWindow
        messages={[
          { id: '1', content: 'Hello!', role: 'user' },
          { id: '2', content: 'Hi there!', role: 'assistant' },
        ]}
        onSendMessage={async (message) => {
          console.log('Sending:', message)
          // Handle message sending
        }}
      />
    </ThemeProvider>
  )
}
```

### 2. Production Setup (With All Features)

```tsx
import {
  ChatWindow,
  ThemeProvider,
  ErrorReporterProvider,
  AnalyticsProvider,
  AIProvider,
  ErrorBoundaryEnhanced,
  createSentryProvider,
  createGoogleAnalyticsProvider,
  createQuickReplyProvider,
  createConsoleProvider,
  themes,
} from '@chat-ui/react'

function App() {
  return (
    <ThemeProvider theme={themes.ocean}>
      <ErrorReporterProvider
        config={{
          providers: [
            createSentryProvider({ dsn: process.env.SENTRY_DSN }),
            createConsoleProvider(),
          ],
          enabled: process.env.NODE_ENV === 'production',
        }}
      >
        <AnalyticsProvider
          config={{
            providers: [
              createGoogleAnalyticsProvider(process.env.GA_ID),
            ],
            autoTrack: { pageViews: true, errors: true },
          }}
        >
          <AIProvider
            config={{
              suggestionProviders: [
                createQuickReplyProvider([
                  { text: 'Hello!', triggers: ['hi', 'hello'] },
                  { text: 'Thank you', triggers: ['thanks'] },
                ]),
              ],
            }}
          >
            <ErrorBoundaryEnhanced enableFeedback>
              <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
              />
            </ErrorBoundaryEnhanced>
          </AIProvider>
        </AnalyticsProvider>
      </ErrorReporterProvider>
    </ThemeProvider>
  )
}
```

## 📚 Common Use Cases

### Streaming Messages

```tsx
import { ChatWindow, useStreaming } from '@chat-ui/react'

function StreamingChat() {
  const { messages, sendMessage, isStreaming } = useStreaming({
    endpoint: '/api/chat',
    method: 'POST',
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isStreaming}
    />
  )
}
```

### SSE Streaming

```tsx
import { useStreamingSSE } from '@chat-ui/react'

function SSEChat() {
  const { messages, sendMessage } = useStreamingSSE({
    url: '/api/chat/stream',
  })

  return <ChatWindow messages={messages} onSendMessage={sendMessage} />
}
```

### WebSocket Chat

```tsx
import { useStreamingWebSocket } from '@chat-ui/react'

function WebSocketChat() {
  const { messages, sendMessage, isConnected } = useStreamingWebSocket({
    url: 'ws://localhost:3000',
  })

  return (
    <div>
      <NetworkStatus isConnected={isConnected} />
      <ChatWindow messages={messages} onSendMessage={sendMessage} />
    </div>
  )
}
```

### File Uploads

```tsx
import { ChatWindow, FileUpload } from '@chat-ui/react'

function ChatWithFiles() {
  const handleSendMessage = async (message: string, files?: File[]) => {
    if (files) {
      // Upload files first
      const uploadedUrls = await uploadFiles(files)
      // Send message with file URLs
      await sendMessage(message, { files: uploadedUrls })
    } else {
      await sendMessage(message)
    }
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSendMessage}
      enableFileUpload
      maxFileSize={10 * 1024 * 1024} // 10MB
      acceptedFileTypes={['image/*', '.pdf', '.txt']}
    />
  )
}
```

### Theme Switching

```tsx
import { ThemeProvider, ThemeSelector, themes } from '@chat-ui/react'
import { useState } from 'react'

function ThemedChat() {
  const [theme, setTheme] = useState(themes.default)

  return (
    <ThemeProvider theme={theme}>
      <ThemeSelector onThemeChange={setTheme} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </ThemeProvider>
  )
}
```

### Custom Theme

```tsx
import { ThemeProvider, Theme } from '@chat-ui/react'

const customTheme: Theme = {
  name: 'My Custom Theme',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f9fafb',
    // ... more colors
  },
  // ... more properties
}

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <ChatWindow />
    </ThemeProvider>
  )
}
```

### Analytics Tracking

```tsx
import {
  useTrackClick,
  useTrackMount,
  AnalyticsEvents,
} from '@chat-ui/react'

function MessageComponent({ message }) {
  // Track component mount
  useTrackMount(AnalyticsEvents.MESSAGE_VIEWED, {
    messageId: message.id,
  })

  // Track button clicks
  const trackCopy = useTrackClick(AnalyticsEvents.MESSAGE_COPIED)

  return (
    <div>
      <p>{message.content}</p>
      <button onClick={trackCopy}>Copy</button>
    </div>
  )
}
```

### Manual Error Reporting

```tsx
import { useErrorReporter } from '@chat-ui/react'

function MyComponent() {
  const { reportError, addBreadcrumb, setUser } = useErrorReporter()

  useEffect(() => {
    // Set user context
    setUser(user.id, user.email)
  }, [user])

  const handleAction = async () => {
    addBreadcrumb('User clicked action button')

    try {
      await performAction()
    } catch (error) {
      reportError(error, {
        action: 'button_click',
        component: 'MyComponent',
      })
    }
  }

  return <button onClick={handleAction}>Action</button>
}
```

### AI Suggestions

```tsx
import { ChatInput, useSuggestions } from '@chat-ui/react'

function SmartChatInput() {
  const { suggestions, getSuggestions, clearSuggestions } = useSuggestions()

  const handleInputChange = (value: string) => {
    getSuggestions(value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    clearSuggestions()
    sendMessage(suggestion)
  }

  return (
    <div>
      <ChatInput
        value={inputValue}
        onChange={handleInputChange}
        onSend={sendMessage}
      />
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((s) => (
            <button key={s.id} onClick={() => handleSuggestionClick(s.text)}>
              {s.text}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Content Moderation

```tsx
import { useModeration } from '@chat-ui/react'

function ModeratedInput() {
  const { moderateContent } = useModeration()
  const [error, setError] = useState('')

  const handleSend = async (message: string) => {
    const result = await moderateContent(message)

    if (!result.safe) {
      setError(`Message blocked: ${result.reason}`)
      return
    }

    await sendMessage(message)
  }

  return (
    <div>
      <ChatInput onSend={handleSend} />
      {error && <div className="error">{error}</div>}
    </div>
  )
}
```

### Performance Monitoring

```tsx
import { PerformanceDashboard, PerformanceBadge } from '@chat-ui/react'

function App() {
  return (
    <div>
      {/* Compact badge in corner */}
      <PerformanceBadge />

      {/* Detailed dashboard */}
      <PerformanceDashboard detailed updateInterval={2000} />

      <ChatWindow />
    </div>
  )
}
```

### Keyboard Shortcuts

```tsx
import {
  KeyboardShortcutsProvider,
  useKeyboardShortcut,
} from '@chat-ui/react'

function App() {
  return (
    <KeyboardShortcutsProvider>
      <ChatWithShortcuts />
    </KeyboardShortcutsProvider>
  )
}

function ChatWithShortcuts() {
  const [showSettings, setShowSettings] = useState(false)

  // Press 's' to open settings
  useKeyboardShortcut('s', () => setShowSettings(true), {
    description: 'Open settings',
    category: 'Navigation',
  })

  // Press Escape to close settings
  useKeyboardShortcut('Escape', () => setShowSettings(false), {
    description: 'Close settings',
    category: 'Navigation',
  })

  // Press Shift+? to show help modal (built-in)

  return (
    <div>
      <ChatWindow />
      {showSettings && <SettingsPanel />}
    </div>
  )
}
```

### Accessibility Features

```tsx
import {
  announceToScreenReader,
  useFocusTrap,
  checkContrastRatio,
} from '@chat-ui/react'

function AccessibleModal({ isOpen, onClose }) {
  const modalRef = useFocusTrap(isOpen)

  useEffect(() => {
    if (isOpen) {
      announceToScreenReader('Settings modal opened', 'polite')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      <h2 id="modal-title">Settings</h2>
      <button onClick={onClose}>Close</button>
    </div>
  )
}
```

## 🎨 Styling

### With Tailwind CSS

The library uses Tailwind CSS classes by default. Make sure Tailwind is configured in your project.

```tsx
import { ChatWindow } from '@chat-ui/react'

<ChatWindow className="h-screen max-w-4xl mx-auto" />
```

### Custom CSS

```tsx
import '@chat-ui/react/dist/styles.css' // Default styles
import './my-custom-styles.css' // Your overrides

<ChatWindow className="my-custom-chat" />
```

### CSS Variables (Theme Customization)

```css
:root {
  --chat-primary: #6366f1;
  --chat-background: #ffffff;
  --chat-text: #1f2937;
  /* ... more variables */
}
```

## 🧪 Testing

### Component Testing

```tsx
import { render, screen } from '@testing-library/react'
import { ChatWindow, ThemeProvider } from '@chat-ui/react'

test('renders chat window', () => {
  render(
    <ThemeProvider>
      <ChatWindow messages={[]} onSendMessage={jest.fn()} />
    </ThemeProvider>
  )

  expect(screen.getByRole('textbox')).toBeInTheDocument()
})
```

### Hook Testing

```tsx
import { renderHook, act } from '@testing-library/react'
import { useChat } from '@chat-ui/react'

test('useChat hook', () => {
  const { result } = renderHook(() => useChat())

  act(() => {
    result.current.addMessage({
      id: '1',
      content: 'Test',
      role: 'user',
    })
  })

  expect(result.current.messages).toHaveLength(1)
})
```

## 📦 Advanced Configuration

### Tree Shaking (Reduce Bundle Size)

Import only what you need:

```tsx
// ❌ Don't do this (imports everything)
import { ChatWindow } from '@chat-ui/react'

// ✅ Do this (tree-shakeable)
import { ChatWindow } from '@chat-ui/react/components'
import { useChat } from '@chat-ui/react/hooks'
import { ThemeProvider } from '@chat-ui/react/theme'
```

### Code Splitting

```tsx
import { lazy, Suspense } from 'react'

const ChatWindow = lazy(() => import('@chat-ui/react/components/ChatWindow'))
const PerformanceDashboard = lazy(() =>
  import('@chat-ui/react/components/PerformanceDashboard')
)

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatWindow />
      <PerformanceDashboard />
    </Suspense>
  )
}
```

## 🔧 TypeScript Support

All exports are fully typed:

```tsx
import type {
  Message,
  ChatConfig,
  Theme,
  AnalyticsEvent,
  ErrorReport,
  Suggestion,
} from '@chat-ui/react'

const message: Message = {
  id: '1',
  content: 'Hello',
  role: 'user',
  timestamp: Date.now(),
}
```

## 🌐 Framework Integration

### Next.js (App Router)

```tsx
'use client'

import { ChatWindow, ThemeProvider } from '@chat-ui/react'

export default function ChatPage() {
  return (
    <ThemeProvider>
      <ChatWindow />
    </ThemeProvider>
  )
}
```

### Next.js (Pages Router)

```tsx
import { ChatWindow, ThemeProvider } from '@chat-ui/react'

export default function ChatPage() {
  return (
    <ThemeProvider>
      <ChatWindow />
    </ThemeProvider>
  )
}
```

### Vite + React

```tsx
import { ChatWindow, ThemeProvider } from '@chat-ui/react'

function App() {
  return (
    <ThemeProvider>
      <ChatWindow />
    </ThemeProvider>
  )
}

export default App
```

## 📖 More Resources

- **Full Documentation**: See `/packages/react/src/error/README.md`
- **API Reference**: Check TypeScript definitions
- **Examples**: See `/packages/react/src/examples/`
- **Phase Summaries**:
  - `PHASE1_COMPLETE.md` - Core features
  - `PHASE2_COMPLETE.md` - Enhancements
  - `PHASE3_COMPLETE.md` - Advanced features

## 🆘 Common Issues

### Issue: Styles not loading
**Solution**: Import CSS file
```tsx
import '@chat-ui/react/dist/styles.css'
```

### Issue: Theme not applying
**Solution**: Wrap app with ThemeProvider
```tsx
<ThemeProvider theme={themes.default}>
  <YourApp />
</ThemeProvider>
```

### Issue: Analytics not tracking
**Solution**: Enable auto-tracking or call track manually
```tsx
<AnalyticsProvider
  config={{
    autoTrack: { pageViews: true, errors: true }
  }}
>
```

### Issue: Error tracking not working
**Solution**: Check provider is enabled and DSN is correct
```tsx
<ErrorReporterProvider
  config={{
    enabled: true,
    providers: [createSentryProvider({ dsn: 'YOUR_DSN' })]
  }}
>
```

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Analytics provider set up
- [ ] Error tracking configured
- [ ] Accessibility tested
- [ ] Performance optimized
- [ ] Error boundaries in place
- [ ] Theme customized
- [ ] Bundle size checked
- [ ] Browser compatibility tested
- [ ] Documentation reviewed

## 🎉 You're Ready!

You now have a production-ready chat UI with:
- ✅ Beautiful, themeable interface
- ✅ Real-time streaming support
- ✅ Analytics tracking
- ✅ Error monitoring
- ✅ AI features
- ✅ Accessibility compliance
- ✅ Performance optimization

**Happy coding! 🚀**
