# Vite Integration

Complete guide for integrating Clarity Chat with Vite and React.

## Quick Start

1. **Create Vite app:**

```bash
npm create vite@latest my-chat-app -- --template react-ts
cd my-chat-app
```

2. **Install Clarity Chat:**

```bash
npm install @clarity-chat/react
```

3. **Import styles** (`src/main.tsx`):

```tsx
import '@clarity-chat/react/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

4. **Create chat component** (`src/App.tsx`):

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call your backend API
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      }])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '800px', height: '600px' }}>
        <ChatWindow 
          messages={messages} 
          isLoading={isLoading}
          onSendMessage={handleSendMessage} 
        />
      </div>
    </div>
  )
}

export default App
```

## Backend API

Vite is frontend-only, so you'll need a separate backend. Here are some options:

### Express Backend

Create `server/index.js`:

```javascript
import express from 'express'
import { OpenAI } from 'openai'
import cors from 'cors'

const app = express()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { content } = req.body
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content }],
  })
  
  res.json({ message: completion.choices[0].message.content })
})

app.listen(3001, () => console.log('Server running on port 3001'))
```

Run both:
```bash
# Terminal 1
node server/index.js

# Terminal 2
npm run dev
```

### Using Vite Proxy

Configure proxy in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

Now you can call `/api/chat` without CORS issues.

## Streaming Support

### Client Side

```tsx
const handleSendMessage = async (content: string) => {
  const userMsg = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now() }
  setMessages(prev => [...prev, userMsg])

  const assistantMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true }
  setMessages(prev => [...prev, assistantMsg])

  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
```

### Express Streaming

```javascript
app.post('/api/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const { content } = req.body
  
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content }],
    stream: true,
  })

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content
    if (text) {
      res.write(`data: ${JSON.stringify({ content: text })}\n\n`)
    }
  }

  res.write('data: [DONE]\n\n')
  res.end()
})
```

## Environment Variables

Create `.env`:

```env
VITE_API_URL=http://localhost:3001
```

Access in code:

```tsx
const API_URL = import.meta.env.VITE_API_URL
```

## TypeScript Configuration

Vite includes TypeScript support by default. Your `tsconfig.json` should include:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true
  }
}
```

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized assets.

## Deployment

### Vercel

```bash
vercel
```

### Netlify

```bash
netlify deploy --prod
```

### Cloudflare Pages

```bash
npm run build
npx wrangler pages publish dist
```

## Examples

- [Basic Chat](https://github.com/yourusername/clarity-chat/tree/main/examples/basic-chat) - Simple Vite setup
- [AI Assistant](https://github.com/yourusername/clarity-chat/tree/main/examples/ai-assistant) - Vite with TanStack Query

## Performance Tips

1. **Code Splitting:**

```tsx
import { lazy, Suspense } from 'react'

const ChatWindow = lazy(() => import('@clarity-chat/react').then(m => ({ default: m.ChatWindow })))

<Suspense fallback={<div>Loading...</div>}>
  <ChatWindow />
</Suspense>
```

2. **Bundle Analysis:**

```bash
npm run build -- --analyze
```

3. **Optimize Dependencies:**

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'clarity-chat': ['@clarity-chat/react'],
        },
      },
    },
  },
})
```
