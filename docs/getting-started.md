# Getting Started with Clarity Chat

Build a production-ready AI chat interface in under 5 minutes.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| React | 18+ or 19 |
| Node.js | 18+ |

---

## Installation

Choose your package manager:

```bash
# npm
npm install @clarity-chat/react

# pnpm (recommended)
pnpm add @clarity-chat/react

# yarn
yarn add @clarity-chat/react

# bun
bun add @clarity-chat/react
```

---

## Quick Start

### Option A: Zero Config (Easiest)

```tsx
'use client' // Required for Next.js App Router

import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

That's it! You have a fully-featured chat with streaming, error handling, and accessibility built-in.

### Option B: With Hooks (More Control)

```tsx
'use client' // Required for Next.js App Router

import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  const { messages, append, isLoading, error } = useClarityChat({
    api: '/api/chat',
    stream: true,  // Enable streaming responses
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      error={error}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

> **Note:** The `'use client'` directive is only needed for Next.js App Router. For Vite, Remix, or other frameworks, you can omit it.

---

## API Route Setup

Your chat needs a backend API to communicate with AI providers. The API route runs server-side, keeping your API keys secure.

> **Security Note:** Never expose your AI provider API keys in client-side code. Always use environment variables and server-side routes.

### Next.js (App Router)

```tsx
// app/api/chat/route.ts
export async function POST(req: Request) {
  try {
    // Validate API key exists
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { messages } = await req.json()

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      return new Response(JSON.stringify({ error: 'AI provider error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Return streaming response
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
```

### Other Frameworks

<details>
<summary><strong>Express.js</strong></summary>

```javascript
import express from 'express'
import OpenAI from 'openai'

const app = express()
app.use(express.json()) // Required to parse JSON body

const openai = new OpenAI() // Uses OPENAI_API_KEY env var

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      stream: true,
    })

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      res.write(`data: ${JSON.stringify({ content })}\n\n`)
    }

    res.end()
  } catch (error) {
    console.error('Chat API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

</details>

<details>
<summary><strong>Hono</strong></summary>

```typescript
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import OpenAI from 'openai'

const app = new Hono()
const openai = new OpenAI() // Uses OPENAI_API_KEY env var

app.post('/api/chat', async (c) => {
  try {
    const { messages } = await c.req.json()

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: 'Invalid messages format' }, 400)
    }

    return streamSSE(c, async (stream) => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        stream: true,
      })

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || ''
        await stream.writeSSE({ data: JSON.stringify({ content }) })
      }
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})
```

</details>

---

## Next Steps

Now that you have a basic chat working, here are recommended enhancements:

### Add Memory (Recommended)

Enable context-aware conversations:

```tsx
import { ClarityChatPresets } from '@clarity-chat/react'

<ClarityChatPresets.WithMemory
  api="/api/chat"
  memoryStrategy="sliding-window"
  maxTokens={4000}
/>
```

### Add a Theme

Choose from 11 built-in themes:

```tsx
import { ThemeProvider, ClarityChat } from '@clarity-chat/react'

<ThemeProvider theme="glassmorphism">
  <ClarityChat api="/api/chat" />
</ThemeProvider>

// Available: dark, ocean, sunset, forest, neon, minimal, warm, cool, corporate, glassmorphism
```

### Add Error Handling

Built-in error recovery with retry:

```tsx
const { messages, error, retry, isLoading } = useClarityChat({
  api: '/api/chat',
  onError: (error) => {
    console.error('Chat error:', error)
    // Optionally notify user
  },
})

// ChatWindow automatically shows error UI with retry button
<ChatWindow
  messages={messages}
  error={error}
  onRetry={retry}
  isLoading={isLoading}
/>
```

---

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| **"Failed to fetch"** | Check your API route is running and CORS is configured |
| **Streaming not working** | Ensure your API returns `Content-Type: text/event-stream` |
| **Styles not loading** | Make sure you imported `@clarity-chat/react/styles.css` |
| **TypeScript errors** | Update to TypeScript 5.0+ and restart your IDE |

---

## Examples by Use Case

| I want to... | Example |
|-------------|---------|
| Start simple | [basic-chat](../apps/examples/basic-chat) |
| Add streaming | [streaming-chat](../apps/examples/streaming-chat) |
| Build a code assistant | [code-assistant](../apps/examples/code-assistant) |
| Create an e-commerce bot | [ecommerce-assistant](../apps/examples/ecommerce-assistant) |
| Build enterprise features | [enterprise-ai-ops](../apps/examples/enterprise-ai-ops) |
| Customize the design | [theme-builder](../apps/examples/theme-builder) |

**[Browse all 30+ examples](../apps/examples)**

---

## Learn More

| Topic | Link |
|-------|------|
| API Reference | [Components & Hooks](./api-reference.md) |
| Best Practices | [Production Patterns](./best-practices.md) |
| Architecture | [System Design](./architecture.md) |
| FAQ | [Common Questions](./FAQ.md) |

---

## Get Help

- **Discord**: [Join our community](https://discord.gg/clarity-chat) for real-time help
- **GitHub Issues**: [Report bugs](https://github.com/christireid/Clarity-ai-chat-components/issues)
- **Discussions**: [Ask questions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

**Ready to build something amazing?** Check out our [examples](../apps/examples) or explore components in [Storybook](../apps/storybook)!
