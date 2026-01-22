# Clarity Chat - Implementation Guide

**Step-by-Step Guide for Fast & Successful Integration**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (15 Minutes)](#quick-start-15-minutes)
3. [Basic Integration (1 Hour)](#basic-integration-1-hour)
4. [Production Setup (1 Day)](#production-setup-1-day)
5. [Advanced Features (1 Week)](#advanced-features-1-week)
6. [Enterprise Configuration](#enterprise-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Prerequisites

### Required Knowledge

- ✅ React 18+ experience
- ✅ TypeScript basics (optional but recommended)
- ✅ npm/yarn package management
- ✅ Basic understanding of AI APIs

### Required Tools

- Node.js 20+
- npm 9+ or yarn 1.22+
- Code editor (VS Code recommended)
- Git

### Optional but Helpful

- Next.js 13+ familiarity
- Tailwind CSS knowledge
- Framer Motion experience

---

## Quick Start (15 Minutes)

### Step 1: Install Package (2 minutes)

```bash
# For Pro/Enterprise users
npm install @clarity-chat/react

# For Free tier
npm install @clarity-chat/primitives @clarity-chat/types
```

### Step 2: Import Styles (1 minute)

```tsx
// app/layout.tsx or _app.tsx
import '@clarity-chat/react/styles.css'
```

### Step 3: Basic Chat (5 minutes)

```tsx
// app/page.tsx or pages/index.tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // TODO: Call your AI API here
    // For now, just echo back
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: `You said: ${content}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMessage])
  }

  return (
    <ThemeProvider theme={themes.ocean}>
      <div style={{ height: '100vh' }}>
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          placeholder="Type your message..."
        />
      </div>
    </ThemeProvider>
  )
}
```

### Step 4: Test (5 minutes)

```bash
npm run dev
# Open http://localhost:3000
```

**🎉 You have a working chat interface!**

---

## Basic Integration (1 Hour)

### Add OpenAI Integration (20 minutes)

```bash
npm install openai
```

```tsx
// lib/openai.ts
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function getChatCompletion(messages: any[]) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  })

  return response.choices[0].message.content
}
```

```tsx
// app/api/chat/route.ts (Next.js App Router)
import { NextResponse } from 'next/server'
import { getChatCompletion } from '@/lib/openai'

export async function POST(request: Request) {
  const { messages } = await request.json()

  try {
    const content = await getChatCompletion(messages)
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json({ error: 'AI request failed' }, { status: 500 })
  }
}
```

Update your chat component:

```tsx
const handleSendMessage = async (content: string) => {
  const userMessage = {
    id: Date.now().toString(),
    role: 'user' as const,
    content,
    timestamp: new Date(),
  }
  setMessages((prev) => [...prev, userMessage])

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...messages, userMessage],
      }),
    })

    const data = await response.json()

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: data.content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMessage])
  } catch (error) {
    console.error('Chat error:', error)
  }
}
```

### Add Streaming (20 minutes)

```tsx
// app/api/chat/route.ts
export async function POST(request: Request) {
  const { messages } = await request.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })

  const encoder = new TextEncoder()

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ''
          controller.enqueue(encoder.encode(`data: ${text}\n\n`))
        }
        controller.close()
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    }
  )
}
```

Update component to use streaming:

```tsx
import { useStreaming } from '@clarity-chat/react'

const { streamMessage, isStreaming } = useStreaming()

const handleSendMessage = async (content: string) => {
  const userMessage = {
    id: Date.now().toString(),
    role: 'user' as const,
    content,
    timestamp: new Date(),
  }
  setMessages((prev) => [...prev, userMessage])

  const aiMessage = {
    id: (Date.now() + 1).toString(),
    role: 'assistant' as const,
    content: '',
    timestamp: new Date(),
  }
  setMessages((prev) => [...prev, aiMessage])

  await streamMessage('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: [...messages, userMessage] }),
    onChunk: (text) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === aiMessage.id ? { ...m, content: m.content + text } : m))
      )
    },
  })
}
```

### Add Theme Customization (20 minutes)

```tsx
import { createTheme } from '@clarity-chat/react'

const customTheme = createTheme({
  name: 'my-brand',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
})

// Use custom theme
<ThemeProvider theme={customTheme}>
  <ChatWindow ... />
</ThemeProvider>
```

---

## Production Setup (1 Day)

### Add Error Handling (1 hour)

```tsx
import { ErrorBoundary, useErrorRecovery } from '@clarity-chat/react'

function ChatApp() {
  const { executeWithRetry } = useErrorRecovery({
    maxRetries: 3,
    initialDelay: 1000,
    onError: (error) => {
      console.error('Chat error:', error)
      // Report to error tracking service
    },
  })

  const handleSendMessage = async (content: string) => {
    await executeWithRetry(async () => {
      // Your API call here
    })
  }

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div>
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <button onClick={reset}>Try again</button>
        </div>
      )}
    >
      <ChatWindow ... />
    </ErrorBoundary>
  )
}
```

### Add Analytics (1 hour)

```tsx
import { AnalyticsProvider, createGoogleAnalyticsProvider } from '@clarity-chat/react'

const analyticsConfig = {
  providers: [
    createGoogleAnalyticsProvider('GA-MEASUREMENT-ID'),
  ],
  autoTrack: {
    pageViews: true,
    errors: true,
    performance: true,
  },
}

function App() {
  return (
    <AnalyticsProvider config={analyticsConfig}>
      <ChatWindow ... />
    </AnalyticsProvider>
  )
}
```

### Add Error Tracking (1 hour)

```bash
npm install @sentry/nextjs
```

```tsx
import * as Sentry from '@sentry/nextjs'
import { ErrorProvider, createSentryProvider } from '@clarity-chat/react'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})

const errorConfig = {
  providers: [createSentryProvider()],
  onError: (error, errorInfo) => {
    // Additional error handling
  },
}

function App() {
  return (
    <ErrorProvider config={errorConfig}>
      <ChatWindow ... />
    </ErrorProvider>
  )
}
```

### Add Authentication (2 hours)

```tsx
// With NextAuth.js
import { useSession } from 'next-auth/react'

function ChatPage() {
  const { data: session } = useSession()

  if (!session) {
    return <div>Please sign in</div>
  }

  return (
    <ChatWindow
      userId={session.user.id}
      userName={session.user.name}
      userAvatar={session.user.image}
      ...
    />
  )
}
```

### Add Rate Limiting (1 hour)

```tsx
// app/api/chat/route.ts
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(request: Request) {
  try {
    await limiter.check(request, 10) // 10 requests per minute
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  // ... rest of your code
}
```

### Environment Variables

```bash
# .env.local
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
DATABASE_URL=postgres://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## Advanced Features (1 Week)

### Voice Input (1 day)

```tsx
import { VoiceInput } from '@clarity-chat/react'
;<VoiceInput
  onTranscript={(text) => handleSendMessage(text)}
  lang="en-US"
  autoSubmit
  continuous={false}
/>
```

### File Upload (1 day)

```tsx
import { FileUpload } from '@clarity-chat/react'

const [files, setFiles] = useState([])

<FileUpload
  accept={{
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.md'],
  }}
  maxSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
  onFilesChange={setFiles}
/>
```

### Context Management (1 day)

```tsx
import { ContextManager, ContextCard } from '@clarity-chat/react'

const [contexts, setContexts] = useState([])

<ContextManager
  contexts={contexts}
  onContextsChange={setContexts}
  maxContexts={10}
>
  {contexts.map((ctx) => (
    <ContextCard
      key={ctx.id}
      title={ctx.title}
      content={ctx.content}
      onRemove={() => removeContext(ctx.id)}
    />
  ))}
</ContextManager>
```

### RAG Implementation (2 days)

```bash
npm install @pinecone-database/pinecone
npm install @clarity-chat/react
```

```tsx
// lib/vector-store.ts
import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from '@clarity-chat/react'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

const index = pinecone.index('your-index')

export async function searchContext(query: string) {
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY!,
  })

  const queryEmbedding = await embeddings.embedQuery(query)

  const results = await index.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  })

  return results.matches
}
```

### Token Tracking (1 day)

```tsx
import { TokenCounter, useTokenTracker } from '@clarity-chat/react'

const { tokens, cost, trackTokens } = useTokenTracker({
  model: 'gpt-4',
  inputCostPer1k: 0.03,
  outputCostPer1k: 0.06,
})

<TokenCounter
  tokens={tokens}
  cost={cost}
  model="gpt-4"
  showDetails
/>
```

---

## Enterprise Configuration

### SSO Setup (4 hours)

```tsx
import { SSOConfigWizard } from '@clarity-chat/react'

// For administrators
;<SSOConfigWizard
  provider="okta" // or "auth0", "azure", etc.
  onComplete={(config) => {
    // Save SSO configuration
  }}
/>
```

### Multi-Tenant Auth (1 day)

```tsx
import { AuthTenantDashboard } from '@clarity-chat/react'
;<AuthTenantDashboard
  tenants={tenants}
  onTenantCreate={handleCreateTenant}
  onTenantUpdate={handleUpdateTenant}
  onTenantDelete={handleDeleteTenant}
/>
```

### RBAC Implementation (1 day)

```tsx
import { usePermissions } from '@clarity-chat/react'

function ChatPage() {
  const { hasPermission, checkPermission } = usePermissions()

  if (!hasPermission('chat.send')) {
    return <div>No permission</div>
  }

  return <ChatWindow ... />
}
```

### Audit Logging (4 hours)

```tsx
import { useAuditLog } from '@clarity-chat/react'

const { logEvent } = useAuditLog()

const handleSendMessage = async (content: string) => {
  logEvent({
    action: 'message.sent',
    userId: session.user.id,
    metadata: { messageLength: content.length },
  })

  // ... rest of your code
}
```

### White-Label (2 hours)

```tsx
// Remove Clarity Chat branding
import { createTheme } from '@clarity-chat/react'

const whiteLabel = createTheme({
  ...yourTheme,
  branding: {
    showPoweredBy: false, // Remove "Powered by Clarity Chat"
    customFooter: 'Your Company © 2024',
  },
})
```

---

## Troubleshooting

### Common Issues

#### "Module not found" error

**Problem:** Can't import from `@clarity-chat/react`

**Solution:**

```bash
# Verify installation
npm list @clarity-chat/react

# Reinstall if needed
rm -rf node_modules package-lock.json
npm install
```

#### Styles not loading

**Problem:** Components have no styling

**Solution:**

```tsx
// Make sure you import styles
import '@clarity-chat/react/styles.css'

// In Next.js app dir, add to app/layout.tsx
// In Next.js pages dir, add to pages/_app.tsx
// In Vite, add to main.tsx
```

#### TypeScript errors

**Problem:** Type errors with components

**Solution:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "types": ["@clarity-chat/react"]
  }
}
```

#### Streaming not working

**Problem:** Messages not streaming

**Solution:**

1. Check API route returns proper SSE format
2. Verify headers are set correctly
3. Test with curl first:

```bash
curl -N http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hello"}]}'
```

#### Rate limit errors

**Problem:** Too many requests

**Solution:**

```tsx
import { useErrorRecovery } from '@clarity-chat/react'

const { executeWithRetry } = useErrorRecovery({
  maxRetries: 3,
  onRetry: (attempt) => {
    // Exponential backoff
    return Math.min(1000 * Math.pow(2, attempt), 10000)
  },
})
```

---

## Best Practices

### Performance

1. **Virtualize long message lists**

```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'
;<VirtualizedMessageList messages={messages} height={600} itemSize={100} />
```

2. **Optimize images**

```tsx
<MultiModalPreview images={images} lazy quality={80} sizes="(max-width: 768px) 100vw, 50vw" />
```

3. **Code split components**

```tsx
import dynamic from 'next/dynamic'

const CommandPalette = dynamic(
  () => import('@clarity-chat/react').then((mod) => mod.CommandPalette),
  { ssr: false }
)
```

### Security

1. **Sanitize user input**

```tsx
import { sanitizeMessage } from '@clarity-chat/react'

const sanitized = sanitizeMessage(userInput, {
  allowedTags: ['b', 'i', 'em', 'strong'],
  allowedAttributes: {},
})
```

2. **Rate limit API routes**
3. **Validate file uploads**
4. **Use environment variables for secrets**

### Accessibility

1. **Use semantic HTML**
2. **Provide ARIA labels**
3. **Support keyboard navigation**
4. **Test with screen readers**

### Testing

```tsx
import { render, screen } from '@testing-library/react'
import { ChatWindow } from '@clarity-chat/react'

test('renders chat window', () => {
  render(<ChatWindow messages={[]} onSendMessage={jest.fn()} />)
  expect(screen.getByRole('textbox')).toBeInTheDocument()
})
```

---

## Next Steps

### Week 1

- ✅ Basic integration
- ✅ AI provider setup
- ✅ Styling customization

### Week 2

- Production error handling
- Analytics integration
- Authentication

### Week 3

- Advanced features (voice, files)
- Performance optimization
- Testing

### Week 4

- Enterprise features (if needed)
- Production deployment
- Monitoring setup

---

## Resources

- **Documentation:** [clarity-chat.dev/docs](https://clarity-chat.dev/docs)
- **API Reference:** [clarity-chat.dev/api](https://clarity-chat.dev/api)
- **Examples:**
  [github.com/christireid/Clarity-ai-chat-components/examples](https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples)
- **Support:** support@codeclarity.ai
- **Discord:** [discord.gg/clarity-chat](https://discord.gg/clarity-chat)

---

## Get Help

**Need help with implementation?**

- 📧 Email: support@codeclarity.ai
- 💬 Discord: [discord.gg/clarity-chat](https://discord.gg/clarity-chat)
- 📞 Enterprise: 1-800-XXX-XXXX
- 🗓️ Book Call: [clarity-chat.dev/support](https://clarity-chat.dev/support)

---

**Last Updated:** November 3, 2024  
**Version:** 1.0
