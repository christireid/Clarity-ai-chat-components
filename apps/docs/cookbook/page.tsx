import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookbook',
  description: 'Common recipes and patterns for Clarity Chat implementations.',
}

export default function Page() {
  return (
    <div className="docs-content">
      <div className="docs-section">
        <h1>Cookbook</h1>
        <p className="lead">
          Common recipes and patterns for implementing Clarity Chat in
          real-world applications. Copy-paste solutions for frequent use cases.
        </p>
      </div>

      <div className="docs-section">
        <h2>🚀 Getting Started</h2>

        <h3>Basic Chat in Next.js</h3>
        <div className="code-block">
          <pre>
            <code>{`// app/chat/page.tsx
import { chat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function ChatPage() {
  return chat('/api/chat')
}

// app/api/chat/route.ts
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  // Your AI logic here
  const response = await callYourAI(messages)

  return Response.json({ message: response })
}`}</code>
          </pre>
        </div>

        <h3>Basic Chat in Vite + React</h3>
        <div className="code-block">
          <pre>
            <code>{`// src/App.tsx
import { chat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return chat('/api/chat')
}

// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎨 UI Customization</h2>

        <h3>Custom Styling with Tailwind</h3>
        <div className="code-block">
          <pre>
            <code>{`import { ClarityChat } from '@clarity-chat/react'

export function CustomChat() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <ClarityChat
        api="/api/chat"
        className="border rounded-lg shadow-lg bg-white dark:bg-gray-900"
        header={{
          show: true,
          title: "My Custom Assistant",
          titleClassName: "text-xl font-bold text-blue-600"
        }}
        messageList={{
          className: "p-4 space-y-4"
        }}
        input={{
          className: "border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500"
        }}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>

        <h3>Dark Mode Support</h3>
        <div className="code-block">
          <pre>
            <code>{`import { ClarityChat } from '@clarity-chat/react'
import { useTheme } from './theme-provider'

export function ThemedChat() {
  const { theme } = useTheme()

  return (
    <ClarityChat
      api="/api/chat"
      className={theme === 'dark' ? 'dark' : ''}
      theme={{
        mode: theme,
        colors: {
          primary: theme === 'dark' ? '#60a5fa' : '#2563eb',
          background: theme === 'dark' ? '#1f2937' : '#ffffff'
        }
      }}
    />
  )
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🧠 Memory & Context</h2>

        <h3>Persistent Chat History</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useClarityChat } from '@clarity-chat/react'
import { useEffect, useState } from 'react'

export function PersistentChat() {
  const [chatId, setChatId] = useState<string | undefined>()

  // Load chat ID from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('currentChatId')
    if (saved) setChatId(saved)
  }, [])

  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    chatId,
    memory: {
      enabled: true,
      strategy: 'vector-store',
      maxTokens: 10000
    },
    onChatCreated: (id) => {
      setChatId(id)
      localStorage.setItem('currentChatId', id)
    }
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}`}</code>
          </pre>
        </div>

        <h3>Context-Aware Responses</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useClarityChat } from '@clarity-chat/react'

export function ContextAwareChat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'semantic-chunks',
      maxTokens: 8000
    },
    promptOptimization: {
      enabled: true,
      strategy: 'hybrid',
      targetTokens: 6000
    }
  })

  // Add context documents
  const addContext = (documents: string[]) => {
    append({
      role: 'system',
      content: \`Context documents: \${documents.join('\\n\\n')}\`
    })
  }

  return (
    <div>
      <button onClick={() => addContext(['doc1.pdf', 'doc2.pdf'])}>
        Add Context
      </button>
      <ChatWindow
        messages={messages}
        onSendMessage={(content) => append({ role: 'user', content })}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>⚡ Performance Optimization</h2>

        <h3>Lazy Loading Heavy Features</h3>
        <div className="code-block">
          <pre>
            <code>{`import { LazyComponents, loadWhen } from '@clarity-chat/react'
import { useState } from 'react'

export function OptimizedChat() {
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Load analytics only when requested
  const AnalyticsComponent = loadWhen(
    showAnalytics,
    () => import('./AnalyticsDashboard'),
    { placeholder: <div>Analytics loading...</div> }
  )

  return (
    <div>
      <ClarityChat api="/api/chat" />

      <button onClick={() => setShowAnalytics(true)}>
        Show Analytics
      </button>

      {showAnalytics && <AnalyticsComponent />}
    </div>
  )
}`}</code>
          </pre>
        </div>

        <h3>Streaming with Error Recovery</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useClarityChat } from '@clarity-chat/react'

export function ResilientStreamingChat() {
  const { messages, append, error, retry } = useClarityChat({
    api: '/api/chat',
    transport: 'sse',
    errorHandling: {
      enabled: true,
      showRetryButton: true,
      onError: (error, type) => {
        if (type === 'network') {
          // Auto-retry network errors
          setTimeout(() => retry(), 1000)
        }
      }
    },
    websocket: {
      autoReconnect: true,
      maxReconnectAttempts: 5
    }
  })

  return (
    <ChatWindow
      messages={messages}
      error={error}
      onRetry={retry}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔒 Security & Rate Limiting</h2>

        <h3>Rate Limited Chat</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useRateLimitedChat } from '@clarity-chat/react'

export function RateLimitedChat() {
  const { messages, append, isRateLimited, queueSize } = useRateLimitedChat({
    api: '/api/chat',
    rateLimiting: {
      enabled: true,
      maxRequestsPerMinute: 30,
      queueSize: 5,
      onRateLimit: (retryAfter) => {
        alert(\`Rate limited. Try again in \${retryAfter} seconds.\`)
      }
    }
  })

  return (
    <div>
      {isRateLimited && (
        <div className="alert alert-warning">
          Rate limited. Messages queued: {queueSize}
        </div>
      )}

      <ChatWindow
        messages={messages}
        onSendMessage={(content) => append({ role: 'user', content })}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>

        <h3>Content Sanitization</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useClarityChat } from '@clarity-chat/react'
import { sanitizeHTML, validatePrompt } from '@clarity-chat/security'

export function SecureChat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    security: {
      enabled: true,
      sanitizeInput: true,
      validateOutput: true
    }
  })

  const handleSendMessage = (content: string) => {
    // Pre-validate and sanitize
    if (!validatePrompt(content)) {
      alert('Invalid content detected')
      return
    }

    const sanitized = sanitizeHTML(content)
    append({ role: 'user', content: sanitized })
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSendMessage}
    />
  )
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📊 Analytics & Monitoring</h2>

        <h3>Usage Tracking</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useClarityChat } from '@clarity-chat/react'
import { useAnalytics } from '@clarity-chat/analytics'

export function AnalyticsChat() {
  const analytics = useAnalytics()

  const { messages, append } = useClarityChat({
    api: '/api/chat',
    analytics: {
      enabled: true,
      trackMessages: true,
      trackPerformance: true
    },
    onMessageSent: (message) => {
      analytics.track('message_sent', {
        length: message.content.length,
        type: message.role
      })
    }
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}`}</code>
          </pre>
        </div>

        <h3>Performance Monitoring</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useClarityChat } from '@clarity-chat/react'
import { usePerformanceMonitor } from '@clarity-chat/performance'

export function MonitoredChat() {
  const performance = usePerformanceMonitor()

  const { messages, append } = useClarityChat({
    api: '/api/chat',
    performance: {
      enabled: true,
      trackRenderTime: true,
      trackApiLatency: true
    }
  })

  const handleSend = (content: string) => {
    const start = performance.now()
    append({ role: 'user', content }).then(() => {
      const latency = performance.now() - start
      performance.track('message_send_latency', latency)
    })
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔄 Real-time Features</h2>

        <h3>Multi-user Collaboration</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useCollaborativeChat } from '@clarity-chat/react'

export function CollaborativeChat({ roomId }: { roomId: string }) {
  const { messages, append, participants, isConnected } = useCollaborativeChat({
    api: '/api/chat',
    roomId,
    sync: {
      enabled: true,
      realTimeUpdates: true
    }
  })

  return (
    <div>
      <div className="participants">
        {participants.map(p => (
          <span key={p.id} className="participant">
            {p.name} {p.isTyping && '(typing...)'}
          </span>
        ))}
      </div>

      <ConnectionStatus connected={isConnected} />

      <ChatWindow
        messages={messages}
        onSendMessage={(content) => append({ role: 'user', content })}
        onTyping={() => {/* notify others */}}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>

        <h3>Live Data Streaming</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useStreamingChat } from '@clarity-chat/react'

export function LiveDataChat() {
  const { messages, append, streamingData } = useStreamingChat({
    api: '/api/chat',
    dataStreams: {
      enabled: true,
      sources: ['stock-prices', 'weather', 'news']
    }
  })

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <ChatWindow
          messages={messages}
          onSendMessage={(content) => append({ role: 'user', content })}
        />
      </div>

      <div className="data-streams">
        <h3>Live Data</h3>
        {streamingData.map((data, i) => (
          <DataCard key={i} data={data} />
        ))}
      </div>
    </div>
  )
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🛠️ Advanced Patterns</h2>

        <h3>Custom Message Renderer</h3>
        <div className="code-block">
          <pre>
            <code>{`import { ClarityChat, MessageRenderer } from '@clarity-chat/react'

function CustomMessage({ message }: { message: CoreMessage }) {
  if (message.role === 'assistant' && message.content.includes('\`\`\`')) {
    return <CodeBlockMessage message={message} />
  }

  if (message.metadata?.type === 'chart') {
    return <ChartMessage message={message} />
  }

  return <DefaultMessage message={message} />
}

export function AdvancedChat() {
  return (
    <ClarityChat
      api="/api/chat"
      messageRenderer={CustomMessage}
    />
  )
}`}</code>
          </pre>
        </div>

        <h3>Plugin System</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useClarityChat } from '@clarity-chat/react'
import { calculatorPlugin } from './plugins/calculator'
import { weatherPlugin } from './plugins/weather'

export function PluginChat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    plugins: {
      enabled: true,
      list: [calculatorPlugin, weatherPlugin]
    }
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={(content) => append({ role: 'user', content })}
      plugins={[calculatorPlugin, weatherPlugin]}
    />
  )
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📱 Mobile Optimization</h2>

        <h3>Responsive Chat</h3>
        <div className="code-block">
          <pre>
            <code>{`import { ClarityChat } from '@clarity-chat/react'
import { useMediaQuery } from './hooks/use-media-query'

export function ResponsiveChat() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <ClarityChat
      api="/api/chat"
      mobile={{
        enabled: true,
        hapticFeedback: isMobile,
        swipeGestures: isMobile,
        compactLayout: isMobile
      }}
      className={isMobile ? 'mobile-chat' : 'desktop-chat'}
    />
  )
}`}</code>
          </pre>
        </div>

        <h3>PWA Support</h3>
        <div className="code-block">
          <pre>
            <code>{`import { useClarityChat } from '@clarity-chat/react'
import { usePWA } from './hooks/use-pwa'

export function PWAChat() {
  const { isInstalled, installPrompt } = usePWA()

  const { messages, append } = useClarityChat({
    api: '/api/chat',
    pwa: {
      enabled: true,
      offlineSupport: true,
      backgroundSync: true
    }
  })

  return (
    <div>
      {!isInstalled && (
        <button onClick={() => installPrompt()}>
          Install App
        </button>
      )}

      <ChatWindow
        messages={messages}
        onSendMessage={(content) => append({ role: 'user', content })}
        offlineIndicator={!navigator.onLine}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Best Practices</h2>

        <h3>Error Handling</h3>
        <div className="code-block">
          <pre>
            <code>{`export function RobustChat() {
  const { messages, append, error, retry } = useClarityChat({
    api: '/api/chat',
    errorHandling: {
      enabled: true,
      onError: (error, type) => {
        // Log to error reporting service
        reportError(error, { type, component: 'chat' })

        // Show user-friendly message
        toast.error(getErrorMessage(type))
      }
    }
  })

  return (
    <ErrorBoundary fallback={<ChatErrorFallback />}>
      <ChatWindow
        messages={messages}
        error={error}
        onRetry={retry}
        onSendMessage={handleSend}
      />
    </ErrorBoundary>
  )
}`}</code>
          </pre>
        </div>

        <h3>Loading States</h3>
        <div className="code-block">
          <pre>
            <code>{`export function SmoothChat() {
  const { messages, append, isLoading, streaming } = useClarityChat({
    api: '/api/chat'
  })

  return (
    <div className="chat-container">
      <MessageList
        messages={messages}
        loading={isLoading}
        streaming={streaming}
      />

      <InputArea
        onSend={append}
        disabled={isLoading}
        placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
      />

      {streaming && <TypingIndicator />}
    </div>
  )
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
