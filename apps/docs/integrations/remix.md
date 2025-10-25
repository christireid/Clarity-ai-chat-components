# Remix Integration

Complete guide for integrating Clarity Chat with Remix.

## Quick Start

1. **Create Remix app:**

```bash
npx create-remix@latest my-chat-app
cd my-chat-app
```

2. **Install Clarity Chat:**

```bash
npm install @clarity-chat/react
```

3. **Add styles to root** (`app/root.tsx`):

```tsx
import styles from '@clarity-chat/react/styles.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
```

4. **Create chat route** (`app/routes/_index.tsx`):

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }])

    // Call action
    const response = await fetch('/api/chat', {
      method: 'POST',
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
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-4xl h-[600px]">
        <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
```

## API Routes with Actions

Create `app/routes/api.chat.ts`:

```typescript
import { OpenAI } from 'openai'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { content } = await request.json()
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content }],
  })
  
  return json({ message: completion.choices[0].message.content })
}
```

## Using Remix Features

### With useFetcher

```tsx
import { useFetcher } from '@remix-run/react'
import { ChatWindow } from '@clarity-chat/react'

export default function Chat() {
  const fetcher = useFetcher()
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }])

    fetcher.submit(
      { content },
      { method: 'post', action: '/api/chat', encType: 'application/json' }
    )
  }

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data?.message) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: fetcher.data.message,
        timestamp: Date.now(),
      }])
    }
  }, [fetcher.data])

  return (
    <ChatWindow 
      messages={messages} 
      isLoading={fetcher.state !== 'idle'}
      onSendMessage={handleSendMessage} 
    />
  )
}
```

## Streaming with EventSource

### Client Side

```tsx
export default function StreamingChat() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = async (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }])

    const assistantMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    }
    setMessages(prev => [...prev, assistantMsg])

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

          accumulated += JSON.parse(data).content
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMsg.id ? { ...msg, content: accumulated } : msg
            )
          )
        }
      }
    }

    setMessages(prev =>
      prev.map(msg =>
        msg.id === assistantMsg.id ? { ...msg, isStreaming: false } : msg
      )
    )
  }

  return <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
}
```

### Server Side

```typescript
import { OpenAI } from 'openai'
import type { ActionFunctionArgs } from '@remix-run/node'

const openai = new OpenAI()

export async function action({ request }: ActionFunctionArgs) {
  const { content } = await request.json()
  
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

## Environment Variables

Create `.env`:

```env
OPENAI_API_KEY=sk-...
```

## TypeScript

Remix has excellent TypeScript support out of the box. No additional configuration needed.

## Deployment

### Fly.io

```bash
fly launch
fly deploy
```

### Vercel

```bash
vercel
```

### Cloudflare Pages

```bash
npm run build
npx wrangler pages publish public
```

## Example

See the complete [Multi-User Chat example](https://github.com/yourusername/clarity-chat/tree/main/examples/multi-user-chat) built with Remix and Socket.io.
