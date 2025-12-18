import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Vite Integration - Clarity Chat',
  description: 'Complete guide for integrating Clarity Chat with Vite and React.',
}

export default function ViteIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Integration</span>
        <h1>Vite Integration</h1>
        <p className="docs-lead">
          Complete guide for integrating Clarity Chat with Vite and React.
        </p>
      </div>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <p>
          <strong>1. Create Vite app:</strong>
        </p>
        <CodeBlock
          language="bash"
          code={`npm create vite@latest my-chat-app -- --template react-ts
cd my-chat-app`}
        />

        <p>
          <strong>2. Install Clarity Chat:</strong>
        </p>
        <CodeBlock
          language="bash"
          code={`npm install @clarity-chat/react`}
        />

        <p>
          <strong>3. Import styles</strong> (<code>src/main.tsx</code>):
        </p>
        <CodeBlock
          language="tsx"
          code={`import '@clarity-chat/react/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`}
        />

        <p>
          <strong>4. Create chat component</strong> (<code>src/App.tsx</code>):
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow } from '@clarity-chat/react'
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

export default App`}
        />
      </section>

      <section className="docs-section">
        <h2>Backend API</h2>
        <p>
          Vite is frontend-only, so you'll need a separate backend. Here's an Express example:
        </p>
        <CodeBlock
          language="javascript"
          code={`import express from 'express'
import { OpenAI } from 'openai'
import cors from 'cors'

const app = express()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { content } = req.body
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content }],
  })
  
  res.json({ message: completion.choices[0].message.content })
})

app.listen(3001, () => logger.debug('Server running on port 3001'))`}
        />
      </section>

      <section className="docs-section">
        <h2>Using Vite Proxy</h2>
        <p>
          Configure proxy in <code>vite.config.ts</code>:
        </p>
        <CodeBlock
          language="typescript"
          code={`import { defineConfig } from 'vite'
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
})`}
        />
        <p>
          Now you can call <code>/api/chat</code> without CORS issues.
        </p>
      </section>

      <section className="docs-section">
        <h2>Environment Variables</h2>
        <p>
          Create <code>.env</code>:
        </p>
        <CodeBlock
          language="env"
          code={`VITE_API_URL=http://localhost:3001`}
        />
        <p>
          Access in code:
        </p>
        <CodeBlock
          language="tsx"
          code={`const API_URL = import.meta.env.VITE_API_URL`}
        />
      </section>

      <section className="docs-section">
        <h2>Building for Production</h2>
        <CodeBlock
          language="bash"
          code={`npm run build`}
        />
        <p>
          This creates a <code>dist/</code> folder with optimized assets.
        </p>
      </section>

      <section className="docs-section">
        <h2>Examples</h2>
        <ul>
          <li><a href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/basic-chat">Basic Chat</a> - Simple Vite setup</li>
          <li><a href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/ai-assistant">AI Assistant</a> - Vite with TanStack Query</li>
        </ul>
      </section>
    </div>
  )
}
