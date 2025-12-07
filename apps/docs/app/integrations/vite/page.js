import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Vite Integration - Clarity Chat',
    description: 'Complete guide for integrating Clarity Chat with Vite and React.',
};
export default function ViteIntegrationPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Integration" }), _jsx("h1", { children: "Vite Integration" }), _jsx("p", { className: "docs-lead", children: "Complete guide for integrating Clarity Chat with Vite and React." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Quick Start" }), _jsx("p", { children: _jsx("strong", { children: "1. Create Vite app:" }) }), _jsx(CodeBlock, { language: "bash", code: `npm create vite@latest my-chat-app -- --template react-ts
cd my-chat-app` }), _jsx("p", { children: _jsx("strong", { children: "2. Install Clarity Chat:" }) }), _jsx(CodeBlock, { language: "bash", code: `npm install @clarity-chat/react` }), _jsxs("p", { children: [_jsx("strong", { children: "3. Import styles" }), " (", _jsx("code", { children: "src/main.tsx" }), "):"] }), _jsx(CodeBlock, { language: "tsx", code: `import '@clarity-chat/react/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)` }), _jsxs("p", { children: [_jsx("strong", { children: "4. Create chat component" }), " (", _jsx("code", { children: "src/App.tsx" }), "):"] }), _jsx(CodeBlock, { language: "tsx", code: `import { ChatWindow } from '@clarity-chat/react'
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

export default App` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Backend API" }), _jsx("p", { children: "Vite is frontend-only, so you'll need a separate backend. Here's an Express example:" }), _jsx(CodeBlock, { language: "javascript", code: `import express from 'express'
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

app.listen(3001, () => console.log('Server running on port 3001'))` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Using Vite Proxy" }), _jsxs("p", { children: ["Configure proxy in ", _jsx("code", { children: "vite.config.ts" }), ":"] }), _jsx(CodeBlock, { language: "typescript", code: `import { defineConfig } from 'vite'
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
})` }), _jsxs("p", { children: ["Now you can call ", _jsx("code", { children: "/api/chat" }), " without CORS issues."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Environment Variables" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: ".env" }), ":"] }), _jsx(CodeBlock, { language: "env", code: `VITE_API_URL=http://localhost:3001` }), _jsx("p", { children: "Access in code:" }), _jsx(CodeBlock, { language: "tsx", code: `const API_URL = import.meta.env.VITE_API_URL` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Building for Production" }), _jsx(CodeBlock, { language: "bash", code: `npm run build` }), _jsxs("p", { children: ["This creates a ", _jsx("code", { children: "dist/" }), " folder with optimized assets."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Examples" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/basic-chat", children: "Basic Chat" }), " - Simple Vite setup"] }), _jsxs("li", { children: [_jsx("a", { href: "https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/ai-assistant", children: "AI Assistant" }), " - Vite with TanStack Query"] })] })] })] }));
}
//# sourceMappingURL=page.js.map