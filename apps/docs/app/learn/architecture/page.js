import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Architecture & Design Patterns - Clarity Chat',
    description: 'System architecture, design patterns, and best practices for Clarity Chat applications.',
};
export default function ArchitecturePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Architecture & Design Patterns" }), _jsx("p", { className: "docs-lead", children: "Learn the architectural principles and design patterns behind production-ready AI chat applications." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "System Architecture" }), _jsx("pre", { children: _jsx("code", { children: `┌──────────────────────────────────────────────────────┐
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
└──────────────────────────────────────────────────────┘` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Component Architecture" }), _jsx("h3", { children: "Atomic Design Principles" }), _jsx("pre", { children: _jsx("code", { children: `Atoms (Basic building blocks)
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
└── HomePage, ChatPage, SettingsPage` }) }), _jsx("h3", { children: "Component Responsibilities" }), _jsx(Callout, { type: "info", title: "Single Responsibility", children: "Each component should have one clear responsibility and be independently testable." }), _jsx("pre", { children: _jsx("code", { children: `// Good: Focused component
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "State Management Patterns" }), _jsx("h3", { children: "Local State (useState)" }), _jsx("p", { children: "Use for component-specific, non-shared state:" }), _jsx("pre", { children: _jsx("code", { children: `function ChatInput() {
  const [value, setValue] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      rows={isExpanded ? 5 : 1}
    />
  )
}` }) }), _jsx("h3", { children: "Context (useContext)" }), _jsx("p", { children: "Use for cross-cutting concerns (theme, auth, config):" }), _jsx("pre", { children: _jsx("code", { children: `// ThemeContext
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
}` }) }), _jsx("h3", { children: "External State (Zustand/Jotai)" }), _jsx("p", { children: "Use for complex, global state:" }), _jsx("pre", { children: _jsx("code", { children: `import { create } from 'zustand'

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
}` }) }), _jsx("h3", { children: "Server State (React Query)" }), _jsx("p", { children: "Use for remote data:" }), _jsx("pre", { children: _jsx("code", { children: `import { useQuery, useMutation } from '@tanstack/react-query'

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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Data Flow Patterns" }), _jsx("h3", { children: "Unidirectional Data Flow" }), _jsx("pre", { children: _jsx("code", { children: `┌──────────────────────────────────────┐
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
└──────────────────────────────────────┘` }) }), _jsx("h3", { children: "Optimistic Updates" }), _jsx("pre", { children: _jsx("code", { children: `function useOptimisticChat() {
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Performance Patterns" }), _jsx("h3", { children: "Virtualization for Long Lists" }), _jsx("pre", { children: _jsx("code", { children: `import { VirtualizedMessageList } from '@clarity-chat/react'

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
// Instead of rendering 10,000 messages, renders ~15` }) }), _jsx("h3", { children: "Memoization" }), _jsx("pre", { children: _jsx("code", { children: `import { memo, useMemo, useCallback } from 'react'

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
}` }) }), _jsx("h3", { children: "Code Splitting" }), _jsx("pre", { children: _jsx("code", { children: `import dynamic from 'next/dynamic'

// Lazy load heavy components
const AdvancedEditor = dynamic(
  () => import('@/components/AdvancedEditor'),
  { ssr: false, loading: () => <Skeleton /> }
)

// Split by route
const ChatPage = dynamic(() => import('@/pages/chat'))
const SettingsPage = dynamic(() => import('@/pages/settings'))` }) }), _jsx("h3", { children: "Streaming Architecture" }), _jsx("pre", { children: _jsx("code", { children: `// Server-side streaming
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Error Handling Patterns" }), _jsx("h3", { children: "Error Boundaries" }), _jsx("pre", { children: _jsx("code", { children: `class ErrorBoundary extends React.Component {
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
</ErrorBoundary>` }) }), _jsx("h3", { children: "Graceful Degradation" }), _jsx("pre", { children: _jsx("code", { children: `function ChatWithFallbacks() {
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
}` }) }), _jsx("h3", { children: "Retry with Exponential Backoff" }), _jsx("pre", { children: _jsx("code", { children: `async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      const delay = Math.min(1000 * 2 ** i, 10000)
      await sleep(delay)
    }
  }
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Security Patterns" }), _jsx("h3", { children: "Input Validation" }), _jsx("pre", { children: _jsx("code", { children: `// Server-side validation
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
}` }) }), _jsx("h3", { children: "Rate Limiting" }), _jsx("pre", { children: _jsx("code", { children: `import { Ratelimit } from '@upstash/ratelimit'

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
}` }) }), _jsx("h3", { children: "Content Sanitization" }), _jsx("pre", { children: _jsx("code", { children: `import DOMPurify from 'isomorphic-dompurify'

function SafeMessageContent({ content }) {
  const sanitized = useMemo(() => 
    DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    }), 
    [content]
  )

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Testing Architecture" }), _jsx("h3", { children: "Testing Pyramid" }), _jsx("pre", { children: _jsx("code", { children: `        /\\
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
                 - Utilities` }) }), _jsx("h3", { children: "Test Patterns" }), _jsx("pre", { children: _jsx("code", { children: `// Unit test: Component
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
})` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices Summary" }), _jsxs(Callout, { type: "success", title: "Architecture Checklist", children: ["\u2705 Single responsibility per component", _jsx("br", {}), "\u2705 Unidirectional data flow", _jsx("br", {}), "\u2705 Optimistic UI updates", _jsx("br", {}), "\u2705 Error boundaries and fallbacks", _jsx("br", {}), "\u2705 Performance optimization (memoization, virtualization)", _jsx("br", {}), "\u2705 Secure by default (validation, sanitization, rate limiting)", _jsx("br", {}), "\u2705 Comprehensive testing strategy", _jsx("br", {}), "\u2705 Scalable state management", _jsx("br", {}), "\u2705 Monitoring and observability", _jsx("br", {}), "\u2705 Documentation and type safety"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/guides/performance", className: "docs-card", children: [_jsx("h3", { children: "Performance Guide" }), _jsx("p", { children: "Optimization techniques" })] }), _jsxs("a", { href: "/learn/guides/testing", className: "docs-card", children: [_jsx("h3", { children: "Testing Guide" }), _jsx("p", { children: "Testing strategies" })] }), _jsxs("a", { href: "/cookbook/production-monitoring", className: "docs-card", children: [_jsx("h3", { children: "Production Monitoring" }), _jsx("p", { children: "Observability setup" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map