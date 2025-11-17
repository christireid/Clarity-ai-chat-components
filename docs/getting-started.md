# Getting Started with Clarity Chat

Welcome to Clarity Chat! This guide will help you get up and running in minutes.

---

## Quick Start (5 minutes)

### Step 1: Install

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

### Step 2: Import Styles

```tsx
import '@clarity-chat/react/styles.css'
```

### Step 3: Create Your First Chat

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

### Step 4: Set Up Your API Route

**Next.js (App Router):**

```tsx
// app/api/chat/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  // Call your AI API (OpenAI, Anthropic, etc.)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
    }),
  })

  const data = await response.json()
  return NextResponse.json({ message: data.choices[0].message })
}
```

**That's it!** You now have a working chat interface.

---

## Next Steps

### 1. Enable Memory (Recommended)

For multi-turn conversations, enable memory:

```tsx
import { MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatApp />
    </MemoryProvider>
  )
}

function ChatApp() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
  })

  return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={...} />
}
```

### 2. Enable Streaming (Better UX)

For real-time responses:

```tsx
const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
  stream: true,  // Enable streaming
})
```

**API Route (Streaming):**

```tsx
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      stream: true,  // Enable streaming
    }),
  })

  // Return streaming response
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  })
}
```

### 3. Customize Theme

```tsx
import { ThemeProvider } from '@clarity-chat/react'

const customTheme = {
  colors: {
    primary: '#3b82f6',
    background: '#ffffff',
    foreground: '#000000',
  },
}

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

---

## Common Patterns

### Pattern 1: Basic Chat

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

### Pattern 2: Custom Layout

```tsx
import { MessageList, ChatInput } from '@clarity-chat/react'

function CustomChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <div className="custom-layout">
      <CustomHeader />
      <MessageList messages={messages} />
      <ChatInput
        onSend={async (content) => {
          await append({ role: 'user', content })
        }}
        disabled={isLoading}
      />
    </div>
  )
}
```

### Pattern 3: With Error Handling

```tsx
function App() {
  const { messages, append, isLoading, error } = useClarityChat({
    api: '/api/chat',
  })

  if (error) {
    return <ErrorDisplay error={error} onRetry={handleRetry} />
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

---

## Examples

Check out our examples:

- [Basic Chat](../../apps/examples/basic-chat) - Simple chat interface
- [With Memory](../../apps/examples/memory-chat) - Multi-turn conversations
- [Streaming](../../apps/examples/streaming-chat) - Real-time responses
- [Custom Theme](../../apps/examples/custom-theme) - Branded interface

---

## Documentation

- [Choose Your Path](./choose-your-path.md) - Find the right guide for you
- [API Reference](../apps/docs/app/api/) - Complete API documentation
- [Best Practices](./best-practices.md) - Production-ready patterns
- [Architecture](./architecture.md) - System architecture overview
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [Migration Guide](./migration/v1-to-v2.md) - Upgrading from v1

---

## Storybook

Explore components interactively:

- [Components](../../apps/storybook) - All UI components
- [Hooks](../../apps/storybook) - React hooks
- [Examples](../../apps/storybook) - Real-world examples

**Run Storybook:**

```bash
pnpm storybook
```

---

## Need Help?

- [Discord](https://discord.gg/clarity-chat) - Community support
- [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues) - Bug reports
- [Documentation](./README.md) - Full documentation

---

## What's Next?

1. ✅ **Install** - You've done this!
2. ✅ **Create First Chat** - You've done this!
3. 🔄 **Enable Memory** - For context-aware conversations
4. 🔄 **Enable Streaming** - For real-time responses
5. 🔄 **Customize Theme** - Match your brand
6. 🔄 **Read Best Practices** - Production-ready patterns

---

**Ready to build?** Check out our [examples](../../apps/examples) or explore [Storybook](../../apps/storybook)!
