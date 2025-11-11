# Quick Start Guide

**Get started with Clarity Chat in 5 minutes!** 🚀

This guide will help you build a production-ready AI chat interface quickly.

---

## Prerequisites

- **Node.js** 18+ installed
- **React** 18+ (or a React framework like Next.js, Remix, or Vite)
- An **AI provider API key** (OpenAI, Anthropic, Google, etc.)

---

## Installation

Install Clarity Chat using your preferred package manager:

```bash
npm install @clarity-chat/react
# or
yarn add @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
bun add @clarity-chat/react
```

---

## 60-Second Quick Start

Here's the simplest way to get started:

```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState([])

  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow
        messages={messages}
        onSendMessage={async (content) => {
          const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: content }),
          })
          const data = await response.json()
          setMessages(prev => [...prev, 
            { id: '1', role: 'user', content, timestamp: Date.now() },
            { id: '2', role: 'assistant', content: data.message, timestamp: Date.now() }
          ])
        }}
      />
    </ThemeProvider>
  )
}
```

**That's it!** ✨ You now have a production-ready AI chat interface with:
- ✨ Beautiful animations and transitions
- ⌨️ Full keyboard navigation
- 📱 Mobile responsive design
- ⚡ Optimized performance
- ♿ WCAG AAA accessibility
- 🔒 Production-ready security

---

## Complete Setup Guide

### Step 1: Create Your Project

Choose your framework:

**Next.js (App Router)**
```bash
npx create-next-app@latest my-chat-app --typescript
cd my-chat-app
```

**Vite + React**
```bash
npm create vite@latest my-chat-app -- --template react-ts
cd my-chat-app
```

**Remix**
```bash
npx create-remix@latest my-chat-app
cd my-chat-app
```

### Step 2: Install Clarity Chat

```bash
npm install @clarity-chat/react
```

### Step 3: Create Your Chat Component

Create `components/Chat.tsx`:

```tsx
'use client' // Next.js App Router only

import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    timestamp: Date.now(),
  }])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call your AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage] 
        }),
      })
      
      const data = await response.json()
      
      // Add AI response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      }])
    } catch (error) {
      console.error('Failed to send message:', error)
      // Add error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        error: true,
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemeProvider theme={themes.ocean}>
      <div style={{ width: '100%', maxWidth: '800px', height: '600px' }}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>
    </ThemeProvider>
  )
}
```

### Step 4: Create API Route

**Next.js App Router** - Create `app/api/chat/route.ts`:

```typescript
import { OpenAI } from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })
    
    return Response.json({ 
      message: completion.choices[0].message.content 
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
```

**Next.js Pages Router** - Create `pages/api/chat.ts`:

```typescript
import { OpenAI } from 'openai'
import type { NextApiRequest, NextApiResponse } from 'next'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })
    
    res.json({ message: completion.choices[0].message.content })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to process request' })
  }
}
```

**Vite** - Create `src/api/chat.ts` (you'll need a backend):

For Vite, you'll need to set up a separate backend server or use a service like Vercel's serverless functions.

### Step 5: Add Environment Variables

Create `.env.local`:

```env
OPENAI_API_KEY=sk-...your-api-key-here
```

**Important:** Add `.env.local` to your `.gitignore`:

```gitignore
.env*.local
```

### Step 6: Import Styles

**Next.js App Router** - Update `app/layout.tsx`:

```tsx
import '@clarity-chat/react/styles.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Next.js Pages Router** - Update `pages/_app.tsx`:

```tsx
import '@clarity-chat/react/styles.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

**Vite** - Update `src/main.tsx`:

```tsx
import '@clarity-chat/react/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### Step 7: Use Your Chat Component

**Next.js App Router** - Update `app/page.tsx`:

```tsx
import { Chat } from '@/components/Chat'

export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <Chat />
    </main>
  )
}
```

**Vite** - Update `src/App.tsx`:

```tsx
import { Chat } from './components/Chat'

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <Chat />
    </div>
  )
}

export default App
```

### Step 8: Run Your App

```bash
npm run dev
```

Visit `http://localhost:3000` and start chatting! 🎉

---

## What You Built

Congratulations! You now have a working AI chat application with:

- ✅ Beautiful UI from Clarity Chat
- ✅ 11 stunning themes to choose from
- ✅ OpenAI integration
- ✅ Real-time message handling
- ✅ Error handling
- ✅ Loading states
- ✅ TypeScript support
- ✅ WCAG AAA accessibility
- ✅ Mobile responsive design

---

## Next Steps

### Add Streaming

Enable real-time streaming for better UX:

```tsx
import { useStreamingSSE } from '@clarity-chat/react'

const { streamMessage, isStreaming } = useStreamingSSE({
  endpoint: '/api/chat/stream',
})
```

**[→ Learn about streaming](./apps/docs/guide/streaming.md)**

### Add File Upload

Allow users to upload images and documents:

```tsx
<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  onFileUpload={handleFileUpload}
  enableFileUpload
/>
```

**[→ Learn about file uploads](./apps/docs/guide/file-upload.md)**

### Add Message Operations

Enable edit, regenerate, and branching:

```tsx
<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  onEditMessage={handleEdit}
  onRegenerateMessage={handleRegenerate}
  enableMessageOperations
/>
```

**[→ Learn about message operations](./apps/docs/guide/message-operations.md)**

### Customize Themes

Choose from 11 built-in themes or create your own:

```tsx
<ThemeProvider theme={themes.dark}>  {/* Dark mode */}
<ThemeProvider theme={themes.ocean}>  {/* Ocean vibes */}
<ThemeProvider theme={themes.neon}>   {/* Cyberpunk neon */}
```

**[→ Learn about theming](./apps/docs/guide/theming.md)**

### Add Token Optimization

Save 50-80% on AI API costs:

```tsx
import { useTokenOptimization } from '@clarity-chat/react'

const { optimize } = useTokenOptimization({
  compressionRatio: 0.7,
  enableCaching: true,
})
```

**[→ Learn about token optimization](./apps/docs/guide/token-optimization.md)**

---

## Troubleshooting

### API Key Errors

Make sure your `.env.local` file is in the project root and contains:

```env
OPENAI_API_KEY=sk-...
```

Restart your dev server after adding environment variables.

### CORS Errors

If you're calling an external API, you may need to configure CORS in your Next.js config:

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },
}
```

### Type Errors

Make sure you're importing types correctly:

```tsx
import type { Message } from '@clarity-chat/types'
```

### Styles Not Loading

Ensure you've imported the CSS file:

```tsx
import '@clarity-chat/react/styles.css'
```

---

## Examples

Check out our complete working examples:

- **[Basic Chat](./examples/basic-chat)** - Simple chat interface
- **[Streaming Chat](./examples/streaming-chat)** - Real-time streaming
- **[Customer Support](./examples/customer-support)** - Full-featured support chat
- **[Token Optimization Demo](./examples/token-optimization-demo)** - Cost optimization showcase

**[→ View All Examples](./examples/README.md)**

---

## Documentation

- **[Installation Guide](./apps/docs/guide/installation.md)** - Detailed setup instructions
- **[Getting Started](./apps/docs/guide/getting-started.md)** - Comprehensive tutorial
- **[Components API](./apps/docs/api/components.md)** - Complete component reference
- **[Hooks API](./apps/docs/api/hooks.md)** - All available hooks
- **[Design System Guide](./DESIGN_SYSTEM_GUIDE.md)** - Theming and styling
- **[Performance Guide](./PERFORMANCE_GUIDE.md)** - Optimization tips

---

## Need Help?

- 💬 [Discord Community](https://discord.gg/clarity-chat) - Join our friendly community
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues) - Found a bug?
- 💡 [Feature Requests](https://github.com/christireid/Clarity-ai-chat-components/discussions) - Have an idea?
- 📧 [Email Support](mailto:support@codeclarity.ai) - Need help?

---

**Happy coding! 🚀**
