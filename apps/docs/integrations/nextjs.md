# Next.js Integration

Complete guide for integrating Clarity Chat with Next.js 15 App Router and Pages Router.

## Quick Start

### App Router (Recommended)

1. **Install package:**

```bash
npm install @clarity-chat/react
```

2. **Create client component** (`app/components/Chat.tsx`):

```tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }])
    setIsLoading(true)

    // Call API route
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    const data = await response.json()
    
    // Add AI response
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.message,
      timestamp: Date.now(),
    }])
    setIsLoading(false)
  }

  return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
}
```

3. **Create API route** (`app/api/chat/route.ts`):

```tsx
import { OpenAI } from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const { content } = await req.json()
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content }],
  })
  
  return Response.json({ message: completion.choices[0].message.content })
}
```

4. **Use in page** (`app/page.tsx`):

```tsx
import { Chat } from './components/Chat'
import '@clarity-chat/react/styles.css'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-4xl h-[600px]">
        <Chat />
      </div>
    </main>
  )
}
```

## Streaming with SSE

### Client Component

```tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export function StreamingChat() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMsg = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])

    // Add streaming assistant message
    const assistantMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true }
    setMessages(prev => [...prev, assistantMsg])

    // Stream response
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ content }),
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let accumulated = ''

    while (true) {
      const { done, value } = await reader!.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') break

          const parsed = JSON.parse(data)
          accumulated += parsed.content
          
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMsg.id ? { ...msg, content: accumulated } : msg
            )
          )
        }
      }
    }

    // Mark as complete
    setMessages(prev =>
      prev.map(msg =>
        msg.id === assistantMsg.id ? { ...msg, isStreaming: false } : msg
      )
    )
  }

  return <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
}
```

### Streaming API Route

```tsx
import { OpenAI } from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI()

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { content } = await req.json()
  
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content }],
    stream: true,
  })
  
  const encoder = new TextEncoder()
  
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content
        if (text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })
  
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
```

## Pages Router

### Chat Component

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = async (content: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    const data = await response.json()
    // Handle response...
  }

  return <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
}
```

### API Route

```tsx
import { OpenAI } from 'openai'
import type { NextApiRequest, NextApiResponse } from 'next'

const openai = new OpenAI()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { content } = req.body
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content }],
  })
  
  res.json({ message: completion.choices[0].message.content })
}
```

## Environment Variables

Create `.env.local`:

```env
OPENAI_API_KEY=sk-...
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true
  }
}
```

## Tailwind Configuration

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/@clarity-chat/**/*.{js,ts,jsx,tsx}',
  ],
}
```

## Deployment

### Vercel

```bash
vercel
```

### Cloudflare Pages

```bash
npm run build
npx wrangler pages publish .next
```

## Examples

- [Basic Chat](https://github.com/yourusername/clarity-chat/tree/main/examples/basic-chat)
- [Streaming Chat](https://github.com/yourusername/clarity-chat/tree/main/examples/streaming-chat)
- [Customer Support](https://github.com/yourusername/clarity-chat/tree/main/examples/customer-support)
