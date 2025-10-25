# Quick Start

Build a fully functional AI chat application in under 10 minutes.

## Prerequisites

- Node.js 18+ installed
- Basic knowledge of React
- An OpenAI API key (or another AI provider)

## Step 1: Create a New Project

::: code-group

```bash [Next.js]
npx create-next-app@latest my-chat-app --typescript
cd my-chat-app
```

```bash [Vite]
npm create vite@latest my-chat-app -- --template react-ts
cd my-chat-app
```

```bash [Remix]
npx create-remix@latest my-chat-app
cd my-chat-app
```

:::

## Step 2: Install Clarity Chat

```bash
npm install @clarity-chat/react
```

## Step 3: Create Chat Component

Create `components/Chat.tsx`:

```tsx
'use client' // Next.js App Router only

import { ChatWindow } from '@clarity-chat/react'
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
    <div style={{ width: '100%', maxWidth: '800px', height: '600px' }}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
```

## Step 4: Create API Route

### Next.js App Router

Create `app/api/chat/route.ts`:

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
      messages,
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

### Next.js Pages Router

Create `pages/api/chat.ts`:

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
      messages,
    })
    
    res.json({ message: completion.choices[0].message.content })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to process request' })
  }
}
```

### Remix

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

  try {
    const { messages } = await request.json()
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
    })
    
    return json({ message: completion.choices[0].message.content })
  } catch (error) {
    console.error('Error:', error)
    return json({ error: 'Failed to process request' }, { status: 500 })
  }
}
```

## Step 5: Add Environment Variables

Create `.env.local`:

```env
OPENAI_API_KEY=sk-...your-api-key-here
```

**Important:** Add `.env.local` to your `.gitignore`:

```gitignore
.env*.local
```

## Step 6: Use the Chat Component

### Next.js App Router

Update `app/page.tsx`:

```tsx
import { Chat } from '@/components/Chat'
import '@clarity-chat/react/styles.css'

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

### Vite

Update `src/App.tsx`:

```tsx
import { Chat } from './components/Chat'
import '@clarity-chat/react/styles.css'

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

## Step 7: Run Your App

```bash
npm run dev
```

Visit `http://localhost:3000` and start chatting!

## What You Built

Congratulations! You now have a working AI chat application with:

- ✅ Beautiful UI from Clarity Chat
- ✅ OpenAI integration
- ✅ Real-time message handling
- ✅ Error handling
- ✅ Loading states
- ✅ TypeScript support

## Next Steps

### Add Streaming

Enable real-time streaming for better UX:

```tsx
// See the Streaming guide
import { useStreamingChat } from '@clarity-chat/react'
```

[Learn about streaming →](/guide/streaming)

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

[Learn about file uploads →](/guide/file-upload)

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

[Learn about message operations →](/guide/message-operations)

### Customize Styling

Make it match your brand:

```tsx
<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  theme={{
    primaryColor: '#6366f1',
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif',
  }}
/>
```

[Learn about theming →](/guide/theming)

## Troubleshooting

### API Key Errors

Make sure your `.env.local` file is in the project root and contains:

```env
OPENAI_API_KEY=sk-...
```

Restart your dev server after adding environment variables.

### CORS Errors

If you're calling an external API, you may need to configure CORS:

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

## Full Example Code

Check out the complete working examples in our repository:

- [Basic Chat (Vite)](https://github.com/yourusername/clarity-chat/tree/main/examples/basic-chat)
- [Streaming Chat (Next.js)](https://github.com/yourusername/clarity-chat/tree/main/examples/streaming-chat)
- [Customer Support (Next.js + Supabase)](https://github.com/yourusername/clarity-chat/tree/main/examples/customer-support)

## Learn More

- [Components Guide](/guide/components) - Explore all components
- [Hooks Guide](/guide/hooks) - Learn about available hooks
- [API Reference](/api/components) - Detailed API documentation
- [Cookbook](/cookbook) - Recipes for common patterns
