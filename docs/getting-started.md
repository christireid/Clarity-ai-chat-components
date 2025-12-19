# Getting Started with Clarity Chat

Build a production-ready AI chat interface in under 5 minutes.

---

## Prerequisites

| Requirement | Version                                                       |
| ----------- | ------------------------------------------------------------- |
| React       | 18+ or 19                                                     |
| Node.js     | 20+                                                           |
| License Key | [Get one at claritychat.dev](https://claritychat.dev/pricing) |

---

## Installation

Clarity Chat is distributed via GitHub Packages. You'll need to configure npm once, then install
normally.

### Step 1: Configure npm for GitHub Packages (One-time)

```bash
# Set the registry for @clarity-chat scope
npm config set @clarity-chat:registry https://npm.pkg.github.com

# Set your access token (provided with your license)
npm config set //npm.pkg.github.com/:_authToken YOUR_ACCESS_TOKEN
```

> **Note:** Your access token is provided when you purchase a license. Keep it secure and never
> commit it to version control.

### Step 2: Install the package

```bash
# npm
npm install @clarity-chat/react

# pnpm (recommended)
pnpm add @clarity-chat/react

# yarn
yarn add @clarity-chat/react
```

### Step 3: Set your license key

Add your license key to your environment:

```bash
# .env.local (Next.js) or .env (other frameworks)
CLARITY_LICENSE=CC-1-eyJ...your-license-key...
```

---

## Quick Start

### Option A: Zero Config (Easiest)

```tsx
'use client' // Required for Next.js App Router

import { initializeClarity, ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

// Initialize once at app startup
initializeClarity({
  license: process.env.CLARITY_LICENSE,
})

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

That's it! You have a fully-featured chat with streaming, error handling, and accessibility
built-in.

### Option B: With Hooks (More Control)

```tsx
'use client' // Required for Next.js App Router

import { initializeClarity, useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

// Initialize once at app startup
initializeClarity({
  license: process.env.CLARITY_LICENSE,
})

export default function App() {
  const { messages, append, isLoading, error } = useClarityChat({
    api: '/api/chat',
    stream: true, // Enable streaming responses
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

> **Note:** The `'use client'` directive is only needed for Next.js App Router. For Vite, Remix, or
> other frameworks, you can omit it.

### Option C: Headless Mode (Logic Only)

For maximum control, use the headless hook directly. This allows you to build your own UI components
from scratch while leveraging Clarity's logic (state management, streaming, etc.) without the
memory/opinionated overhead.

```tsx
import { useHeadlessChat } from '@clarity-chat/react'

export default function CustomChat() {
  const { messages, append, isLoading } = useHeadlessChat({
    api: '/api/chat',
  })

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
      {/* Your custom input */}
    </div>
  )
}
```

> **Why Headless?** Perfect for when you need complete control over the DOM structure, or when
> integrating with an existing design system like Radix UI or Ariakit.

---

## Initialization Options

The `initializeClarity` function accepts these options:

```tsx
initializeClarity({
  // License key (required in production)
  license: process.env.CLARITY_LICENSE,

  // Environment mode (defaults to NODE_ENV)
  env: 'production', // or 'development'

  // Suppress console warnings
  silent: false,
})
```

**Behavior by environment:**

- **Development**: Warning in console, watermark displayed
- **Production**: Watermark displayed if no valid license

---

## API Route Setup

Your chat needs a backend API to communicate with AI providers. The API route runs server-side,
keeping your API keys secure.

> **Security Note:** Never expose your AI provider API keys in client-side code. Always use
> environment variables and server-side routes.

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
        Authorization: `Bearer ${apiKey}`,
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
        Connection: 'keep-alive',
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
app.use(express.json())

const openai = new OpenAI() // Uses OPENAI_API_KEY env var

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

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
const openai = new OpenAI()

app.post('/api/chat', async (c) => {
  try {
    const { messages } = await c.req.json()

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

## License Plans

| Feature          | Community | Pro | Enterprise |
| ---------------- | --------- | --- | ---------- |
| Core Components  | Yes       | Yes | Yes        |
| Streaming        | Yes       | Yes | Yes        |
| Memory System    | -         | Yes | Yes        |
| Analytics        | -         | Yes | Yes        |
| Multi-tenancy    | -         | -   | Yes        |
| Custom Branding  | -         | Yes | Yes        |
| Priority Support | -         | Yes | Yes        |

[Compare plans](https://claritychat.dev/pricing)

---

## Next Steps

Now that you have a basic chat working, here are recommended enhancements:

### Add Memory (Pro+)

Enable context-aware conversations:

```tsx
import { ClarityChatPresets } from '@clarity-chat/react'
;<ClarityChatPresets.WithMemory api="/api/chat" memoryStrategy="sliding-window" maxTokens={4000} />
```

### Add a Theme

Choose from 11 built-in themes:

```tsx
import { ThemeProvider, ClarityChat } from '@clarity-chat/react'
;<ThemeProvider theme="glassmorphism">
  <ClarityChat api="/api/chat" />
</ThemeProvider>

// Available: dark, ocean, sunset, forest, neon, minimal, warm, cool, corporate, glassmorphism
```

### Feature Gating

Gate features based on license plan:

```tsx
import { LicenseGate } from '@clarity-chat/react'
;<LicenseGate plan="pro" fallback={<UpgradePrompt />}>
  <AdvancedFeatures />
</LicenseGate>
```

### Error Handling & Retries

ClarityChat includes built-in error handling with automatic retries:

```tsx
import { ClarityChat } from '@clarity-chat/react'
;<ClarityChat
  api="/api/chat"
  onError={(error) => {
    console.error('Chat error:', error)
    // Optionally show a toast or custom error UI
  }}
/>
```

The component automatically:

- Retries failed requests with exponential backoff
- Shows user-friendly error messages
- Provides a retry button for manual recovery

For enterprise features (analytics, rate limiting, audit logs), use:

```tsx
import { ClarityChatPresets } from '@clarity-chat/react'
;<ClarityChatPresets.Enterprise api="/api/chat" enableAnalytics enableSafety />
```

---

## Common Issues & Solutions

| Problem                               | Solution                                                  |
| ------------------------------------- | --------------------------------------------------------- |
| **"401 Unauthorized" during install** | Check your npm token is set correctly in `.npmrc`         |
| **"Failed to fetch"**                 | Check your API route is running and CORS is configured    |
| **Watermark showing**                 | Verify your license key is set in environment variables   |
| **Streaming not working**             | Ensure your API returns `Content-Type: text/event-stream` |
| **Styles not loading**                | Make sure you imported `@clarity-chat/react/styles.css`   |
| **TypeScript errors**                 | Update to TypeScript 5.0+ and restart your IDE            |

---

## Examples by Use Case

| I want to...              | Example                                                |
| ------------------------- | ------------------------------------------------------ |
| Start simple              | [basic-chat](../examples/basic-chat)                   |
| Add streaming             | [streaming-chat](../examples/streaming-chat)           |
| Build a code assistant    | [code-assistant](../examples/code-assistant)           |
| Create an e-commerce bot  | [ecommerce-assistant](../examples/ecommerce-assistant) |
| Build enterprise features | [enterprise-ai-ops](../examples/enterprise-ai-ops)     |
| Customize the design      | [custom-theming](../examples/custom-theming)           |

**[Browse all examples](../examples)**

---

## Learn More

| Topic          | Link                                       |
| -------------- | ------------------------------------------ |
| API Reference  | [Components & Hooks](./api-reference.md)   |
| Best Practices | [Production Patterns](./best-practices.md) |
| Architecture   | [System Design](./architecture.md)         |
| FAQ            | [Common Questions](./FAQ.md)               |

---

## Get Help

- **Support**: [support@claritychat.dev](mailto:support@claritychat.dev)
- **GitHub Issues**: [Report bugs](https://github.com/christireid/Clarity-ai-chat-components/issues)
- **Discussions**:
  [Ask questions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

**Ready to build something amazing?** Check out our [examples](../examples) or explore components in
[Storybook](../apps/storybook)!
