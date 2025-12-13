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
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

That's it! You have a fully-featured chat with streaming, error handling, and accessibility built-in.

### Option B: With Hooks (More Control)

```tsx
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

---

## API Route Setup

Your chat needs a backend API. Here's how to set it up:

### Next.js (App Router)

```tsx
// app/api/chat/route.ts
import { NextResponse } from 'next/server'

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
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
```

### Other Frameworks

<details>
<summary><strong>Express.js</strong></summary>

```javascript
import express from 'express'
import OpenAI from 'openai'

const app = express()
const openai = new OpenAI()

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })

  res.setHeader('Content-Type', 'text/event-stream')

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    res.write(`data: ${JSON.stringify({ content })}\n\n`)
  }

  res.end()
})
```

</details>

<details>
<summary><strong>Hono</strong></summary>

```typescript
import { Hono } from 'hono'
import { stream } from 'hono/streaming'
import OpenAI from 'openai'

const app = new Hono()
const openai = new OpenAI()

app.post('/api/chat', async (c) => {
  const { messages } = await c.req.json()

  return stream(c, async (stream) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      stream: true,
    })

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || ''
      await stream.write(`data: ${JSON.stringify({ content })}\n\n`)
    }
  })
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
