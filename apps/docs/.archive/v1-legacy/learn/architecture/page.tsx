import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Architecture & Design Patterns - Clarity Chat',
  description:
    'System architecture, design patterns, and best practices for Clarity Chat applications.',
}

export default function ArchitecturePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Architecture & Design Patterns</h1>
        <p className="docs-lead">
          Learn the architectural principles and design patterns behind
          robust AI chat applications.
        </p>
      </div>

      <section className="docs-section">
        <h2>System Architecture</h2>
        <pre>
          <code>{`┌──────────────────────────────────────────────────────┐
│                                                      │
│                     Frontend                         │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │   React Application (Next.js/Vite/CRA)       │  │
│  │                                               │  │
│  │   ┌─────────────────────────────────────┐   │  │
│  │   │   Clarity Chat Components           │   │  │
│  │   │                                     │   │  │
│  │   │   • ChatWindow                      │   │  │
│  │   │   • Message                         │   │  │
│  │   │   • MessageList                     │   │  │
│  │   │   • ChatInput                       │   │  │
│  │   └─────────────────────────────────────┘   │  │
│  │                                               │  │
│  │   ┌─────────────────────────────────────┐   │  │
│  │   │   State Management                   │   │  │
│  │   │                                     │   │  │
│  │   │   • useChat hook                    │   │  │
│  │   │   • Context providers               │   │  │
│  │   │   • Optimistic updates              │   │  │
│  │   └─────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────┘  │
│                         │                            │
│                         │ HTTP / WebSocket           │
│                         ▼                            │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                                                      │
│                      Backend                         │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │   API Layer (Express/Next.js API)           │  │
│  │                                               │  │
│  │   ┌─────────────────────────────────────┐   │  │
│  │   │   Route Handlers                     │   │  │
│  │   │                                     │   │  │
│  │   │   • /api/chat (streaming)           │   │  │
│  │   │   • /api/upload (files)             │   │  │
│  │   │   • /api/memory (RAG)               │   │  │
│  │   └─────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────┘  │
│                         │                            │
│  ┌──────────────────────┴──────────────────────┐  │
│  │                                               │  │
│  │   ┌─────────────┐    ┌──────────────────┐  │  │
│  │   │   Memory    │    │   LLM Provider   │  │  │
│  │   │   Service   │    │                  │  │  │
│  │   │             │    │   • OpenAI       │  │  │
│  │   │   • Vector  │    │   • Anthropic    │  │  │
│  │   │     Store   │    │   • Custom       │  │  │
│  │   │   • Cache   │    └──────────────────┘  │  │
│  │   └─────────────┘                           │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                         │                            │
│  ┌──────────────────────┴──────────────────────┐  │
│  │                                               │  │
│  │   ┌──────────┐    ┌───────────┐    ┌─────┐ │  │
│  │   │ Database │    │   Redis   │    │ S3  │ │  │
│  │   │(Postgres)│    │  (Cache)  │    │Files│ │  │
│  │   └──────────┘    └───────────┘    └─────┘ │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Component Architecture</h2>

        <h3>Architecture Layers</h3>
        <p className="mb-4">
          Clarity Chat follows a <strong>layered architecture</strong> with
          three main API levels:
        </p>
        <pre>
          <code>{`┌─────────────────────────────────────────────────────┐
│         TOP-LEVEL APIs (Drop-in Ready)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ClarityChat Component                            │  │
│  │ useClarityChat Hook                              │  │
│  │ • Zero configuration                             │  │
│  │ • Automatic message conversion                  │  │
│  │ • Built-in error handling                       │  │
│  │ • Memory integration                            │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │      MID-LEVEL APIs (Composable)                │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │ ChatWindow Component                     │  │  │
│  │  │ useChatEnhanced Hook                      │  │  │
│  │  │ useChatHandlers Hook                      │  │  │
│  │  │ • More control over UI                    │  │  │
│  │  │ • Custom message handling                 │  │  │
│  │  │ • Vercel AI SDK compatible                │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │      LOW-LEVEL APIs (Utilities)                 │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │ useChat Hook                             │  │  │
│  │  │ normalizeMessages                        │  │  │
│  │  │ createStreamReader                       │  │  │
│  │  │ • Raw state management                   │  │  │
│  │  │ • Message utilities                      │  │  │
│  │  │ • Streaming primitives                   │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘`}</code>
        </pre>

        <Callout type="info" title="Which API Should I Use?">
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>ClarityChat</strong> - Start here for most use cases. Zero
              configuration.
            </li>
            <li>
              <strong>ChatWindow + useClarityChat</strong> - When you need
              custom UI but want easy state management.
            </li>
            <li>
              <strong>ChatWindow + useChatEnhanced</strong> - When migrating
              from Vercel AI SDK.
            </li>
            <li>
              <strong>Low-level APIs</strong> - When building completely custom
              implementations.
            </li>
          </ul>
        </Callout>

        <h3>Atomic Design Principles</h3>
        <pre>
          <code>{`Atoms (Basic building blocks)
├── Button
├── Input
├── Avatar
├── Badge
└── Skeleton

Molecules (Simple combinations)
├── ChatInput (Input + Button + FileUpload)
├── Message (Avatar + Content + Timestamp)
├── TypingIndicator (Avatar + Animation)
└── SearchBar (Input + Icon)

Organisms (Complex compositions)
├── MessageList (Messages + Virtualization)
├── ChatWindow (Header + MessageList + ChatInput)
├── CommandPalette (Search + Commands + Keyboard)
└── Sidebar (Navigation + Conversations)

Templates (Page layouts)
└── ChatLayout (Sidebar + ChatWindow + RightPanel)

Pages (Specific instances)
└── HomePage, ChatPage, SettingsPage`}</code>
        </pre>

        <h3>Component Responsibilities</h3>
        <Callout type="info" title="Single Responsibility">
          Each component should have one clear responsibility and be
          independently testable.
        </Callout>

        <pre>
          <code>{`// Good: Focused component
function Message({ content, role, timestamp }) {
  return (
    <div className="message">
      <Avatar role={role} />
      <MessageContent content={content} />
      <Timestamp value={timestamp} />
    </div>
  )
}

// Bad: Too many responsibilities
function MessageWithEverything({ message, onEdit, onDelete, onReact, onShare }) {
  const [editing, setEditing] = useState(false)
  const [reactions, setReactions] = useState([])
  // ... 100 lines of logic
  return <div>...</div>
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>State Management Patterns</h2>

        <h3>Local State (useState)</h3>
        <p>Use for component-specific, non-shared state:</p>
        <pre>
          <code>{`function ChatInput() {
  const [value, setValue] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      rows={isExpanded ? 5 : 1}
    />
  )
}`}</code>
        </pre>

        <h3>Context (useContext)</h3>
        <p>Use for cross-cutting concerns (theme, auth, config):</p>
        <pre>
          <code>{`// ThemeContext
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Usage
function ChatWindow() {
  const { theme } = useTheme()
  return <div className={\`theme-\${theme}\`}>...</div>
}`}</code>
        </pre>

        <h3>External State (Zustand/Jotai)</h3>
        <p>Use for complex, global state:</p>
        <pre>
          <code>{`import { create } from 'zustand'

const useChatStore = create((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  clearMessages: () => set({ messages: [] })
}))

// Usage
function Chat() {
  const { messages, addMessage } = useChatStore()
  // ...
}`}</code>
        </pre>

        <h3>Server State (React Query)</h3>
        <p>Use for remote data:</p>
        <pre>
          <code>{`import { useQuery, useMutation } from '@tanstack/react-query'

function ChatHistory() {
  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations
  })

  const { mutate: deleteConversation } = useMutation({
    mutationFn: deleteConversationAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations'])
    }
  })
  
  return <ConversationList items={conversations} onDelete={deleteConversation} />
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Data Flow Patterns</h2>

        <h3>Unidirectional Data Flow</h3>
        <pre>
          <code>{`┌──────────────────────────────────────┐
│                                      │
│   User Action (send message)         │
│            │                          │
│            ▼                          │
│   Event Handler (handleSubmit)       │
│            │                          │
│            ▼                          │
│   State Update (add message)         │
│            │                          │
│            ▼                          │
│   API Call (POST /api/chat)          │
│            │                          │
│            ▼                          │
│   Stream Response (SSE/WebSocket)    │
│            │                          │
│            ▼                          │
│   Update State (append chunks)       │
│            │                          │
│            ▼                          │
│   Re-render UI                        │
│                                      │
└──────────────────────────────────────┘`}</code>
        </pre>

        <h3>Optimistic Updates</h3>
        <pre>
          <code>{`function useOptimisticChat() {
  const [messages, setMessages] = useState([])

  const sendMessage = async (content) => {
    const tempId = generateTempId()
    const optimisticMessage = {
      id: tempId,
      content,
      role: 'user',
      status: 'sending'
    }

    // 1. Immediately show message
    setMessages(prev => [...prev, optimisticMessage])

    try {
      // 2. Send to server
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content })
      })

      const serverMessage = await response.json()

      // 3. Replace optimistic with real message
      setMessages(prev => 
        prev.map(m => m.id === tempId ? serverMessage : m)
      )
    } catch (error) {
      // 4. Mark as failed
      setMessages(prev =>
        prev.map(m => 
          m.id === tempId ? { ...m, status: 'error' } : m
        )
      )
    }
  }

  return { messages, sendMessage }
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Performance Patterns</h2>

        <h3>Virtualization for Long Lists</h3>
        <pre>
          <code>{`import { VirtualizedMessageList } from '@clarity-chat/react'

function Chat() {
  return (
    <VirtualizedMessageList
      messages={messages}
      height={600}
      itemHeight={100}
      overscan={5}
    />
  )
}

// Renders only visible items + overscan
// Instead of rendering 10,000 messages, renders ~15`}</code>
        </pre>

        <h3>Memoization</h3>
        <pre>
          <code>{`import { memo, useMemo, useCallback } from 'react'

// Memoize expensive computations
const MessageContent = memo(({ content }) => {
  const parsed = useMemo(() => 
    parseMarkdown(content), 
    [content]
  )
  
  return <div>{parsed}</div>
})

// Memoize callbacks
function Chat() {
  const handleSend = useCallback((message) => {
    sendMessage(message)
  }, [sendMessage])

  return <ChatInput onSend={handleSend} />
}`}</code>
        </pre>

        <h3>Code Splitting</h3>
        <pre>
          <code>{`import dynamic from 'next/dynamic'

// Lazy load heavy components
const AdvancedEditor = dynamic(
  () => import('@/components/AdvancedEditor'),
  { ssr: false, loading: () => <Skeleton /> }
)

// Split by route
const ChatPage = dynamic(() => import('@/pages/chat'))
const SettingsPage = dynamic(() => import('@/pages/settings'))`}</code>
        </pre>

        <h3>Streaming Architecture</h3>
        <pre>
          <code>{`// Server-side streaming
async function* streamResponse(messages) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) {
      yield content
    }
  }
}

// Client-side consumption
async function handleStream(response) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const text = decoder.decode(value)
    setContent(prev => prev + text)
  }
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Error Handling Patterns</h2>

        <h3>Error Boundaries</h3>
        <pre>
          <code>{`class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <ChatWindow />
</ErrorBoundary>`}</code>
        </pre>

        <h3>Graceful Degradation</h3>
        <pre>
          <code>{`function ChatWithFallbacks() {
  const { data, error } = useChat({
    onError: async (error) => {
      // Try fallback models
      if (error.code === 'model_overloaded') {
        return retryWithModel('gpt-3.5-turbo')
      }
      
      // Use cached response
      if (error.code === 'network_error') {
        return getCachedResponse()
      }
      
      // Show error to user
      showError(error.message)
    }
  })

  if (error) {
    return <ErrorState error={error} retry={retry} />
  }

  return <ChatWindow data={data} />
}`}</code>
        </pre>

        <h3>Retry with Exponential Backoff</h3>
        <pre>
          <code>{`async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      const delay = Math.min(1000 * 2 ** i, 10000)
      await sleep(delay)
    }
  }
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Security Patterns</h2>

        <h3>Input Validation</h3>
        <pre>
          <code>{`// Server-side validation
import { z } from 'zod'

const messageSchema = z.object({
  content: z.string().min(1).max(10000),
  role: z.enum(['user', 'assistant', 'system']),
  metadata: z.object({}).optional()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = messageSchema.parse(body)
    // Process validated message
  } catch (error) {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }
}`}</code>
        </pre>

        <h3>Rate Limiting</h3>
        <pre>
          <code>{`import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})

export async function POST(req: Request) {
  const identifier = getUserIdentifier(req)
  const { success } = await ratelimit.limit(identifier)

  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  // Process request
}`}</code>
        </pre>

        <h3>Content Sanitization</h3>
        <pre>
          <code>{`import DOMPurify from 'isomorphic-dompurify'

function SafeMessageContent({ content }) {
  const sanitized = useMemo(() => 
    DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    }), 
    [content]
  )

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Testing Architecture</h2>

        <h3>Testing Pyramid</h3>
        <pre>
          <code>{`        /\\
       /  \\      E2E Tests (5%)
      /    \\     - User flows
     /──────\\    - Critical paths
    /        \\
   / Integr  \\  Integration Tests (20%)
  /   -ation  \\ - API routes
 /    Tests    \\- Component integration
/──────────────\\
   Unit Tests    Unit Tests (75%)
    (75%)        - Components
                 - Hooks
                 - Utilities`}</code>
        </pre>

        <h3>Test Patterns</h3>
        <pre>
          <code>{`// Unit test: Component
describe('Message', () => {
  it('renders user message', () => {
    render(<Message role="user" content="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})

// Integration test: Hook + API
describe('useChat', () => {
  it('sends message and receives response', async () => {
    const { result } = renderHook(() => useChat())
    
    act(() => {
      result.current.sendMessage('Hello')
    })
    
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2)
    })
  })
})

// E2E test: User flow
test('user can have conversation', async ({ page }) => {
  await page.goto('/')
  await page.fill('[data-testid="chat-input"]', 'Hello')
  await page.click('[data-testid="send-button"]')
  await page.waitForSelector('[data-testid="assistant-message"]')
})`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices Summary</h2>

        <Callout type="success" title="Architecture Checklist">
          ✅ Single responsibility per component
          <br />
          ✅ Unidirectional data flow
          <br />
          ✅ Optimistic UI updates
          <br />
          ✅ Error boundaries and fallbacks
          <br />
          ✅ Performance optimization (memoization, virtualization)
          <br />
          ✅ Secure by default (validation, sanitization, rate limiting)
          <br />
          ✅ Comprehensive testing strategy
          <br />
          ✅ Scalable state management
          <br />
          ✅ Monitoring and observability
          <br />✅ Documentation and type safety
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/guides/performance" className="docs-card">
            <h3>Performance Guide</h3>
            <p>Optimization techniques</p>
          </a>
          <a href="/learn/guides/testing" className="docs-card">
            <h3>Testing Guide</h3>
            <p>Testing strategies</p>
          </a>
          <a href="/cookbook/production-monitoring" className="docs-card">
            <h3>Production Monitoring</h3>
            <p>Observability setup</p>
          </a>
        </div>
      </section>
    </div>
  )
}
