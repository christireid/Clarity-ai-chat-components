import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Quick Start - Clarity Chat',
    description: 'Build a fully functional AI chat application in under 10 minutes.',
};
export default function QuickStartGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Quick Start" }), _jsx("p", { className: "docs-lead", children: "Build a fully functional AI chat application in under 10 minutes." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Prerequisites" }), _jsxs("ul", { children: [_jsx("li", { children: "Node.js 18+ installed" }), _jsx("li", { children: "Basic knowledge of React" }), _jsx("li", { children: "An OpenAI API key (or another AI provider)" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 1: Create a New Project" }), _jsx(CodeBlock, { language: "bash", code: `# Next.js
npx create-next-app@latest my-chat-app --typescript
cd my-chat-app

# Vite
npm create vite@latest my-chat-app -- --template react-ts
cd my-chat-app

# Remix
npx create-remix@latest my-chat-app
cd my-chat-app` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 2: Install Clarity Chat" }), _jsx(CodeBlock, { language: "bash", code: "npm install @clarity-chat/react" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 3: Create Chat Component" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: "components/Chat.tsx" }), ":"] }), _jsx(CodeBlock, { language: "tsx", code: `'use client' // Next.js App Router only

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 4: Create API Route" }), _jsx("h3", { children: "Next.js App Router" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: "app/api/chat/route.ts" }), ":"] }), _jsx(CodeBlock, { language: "typescript", code: `import { OpenAI } from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
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
}` }), _jsx("h3", { children: "Next.js Pages Router" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: "pages/api/chat.ts" }), ":"] }), _jsx(CodeBlock, { language: "typescript", code: `import { OpenAI } from 'openai'
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
      model: 'gpt-4-turbo',
      messages,
    })
    
    res.json({ message: completion.choices[0].message.content })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to process request' })
  }
}` }), _jsx("h3", { children: "Remix" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: "app/routes/api.chat.ts" }), ":"] }), _jsx(CodeBlock, { language: "typescript", code: `import { OpenAI } from 'openai'
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
      model: 'gpt-4-turbo',
      messages,
    })
    
    return json({ message: completion.choices[0].message.content })
  } catch (error) {
    console.error('Error:', error)
    return json({ error: 'Failed to process request' }, { status: 500 })
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 5: Add Environment Variables" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: ".env.local" }), ":"] }), _jsx(CodeBlock, { language: "env", code: "OPENAI_API_KEY=sk-...your-api-key-here" }), _jsxs(Callout, { type: "warning", title: "Important", children: ["Add ", _jsx("code", { children: ".env.local" }), " to your ", _jsx("code", { children: ".gitignore" }), ":", _jsx(CodeBlock, { language: "gitignore", code: ".env*.local" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 6: Use the Chat Component" }), _jsx("h3", { children: "Next.js App Router" }), _jsxs("p", { children: ["Update ", _jsx("code", { children: "app/page.tsx" }), ":"] }), _jsx(CodeBlock, { language: "tsx", code: `import { Chat } from '@/components/Chat'
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
}` }), _jsx("h3", { children: "Vite" }), _jsxs("p", { children: ["Update ", _jsx("code", { children: "src/App.tsx" }), ":"] }), _jsx(CodeBlock, { language: "tsx", code: `import { Chat } from './components/Chat'
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

export default App` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 7: Run Your App" }), _jsx(CodeBlock, { language: "bash", code: "npm run dev" }), _jsxs("p", { children: ["Visit ", _jsx("code", { children: "http://localhost:3000" }), " and start chatting!"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "What You Built" }), _jsx("p", { children: "Congratulations! You now have a working AI chat application with:" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Beautiful UI from Clarity Chat" }), _jsx("li", { children: "\u2705 OpenAI integration" }), _jsx("li", { children: "\u2705 Real-time message handling" }), _jsx("li", { children: "\u2705 Error handling" }), _jsx("li", { children: "\u2705 Loading states" }), _jsx("li", { children: "\u2705 TypeScript support" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsx("h3", { children: "Add Streaming" }), _jsx("p", { children: "Enable real-time streaming for better UX:" }), _jsx(CodeBlock, { language: "tsx", code: `// See the Streaming guide
import { useStreamingChat } from '@clarity-chat/react'` }), _jsx("p", { children: _jsx("a", { href: "/guides/streaming", children: "Learn about streaming \u2192" }) }), _jsx("h3", { children: "Add File Upload" }), _jsx(CodeBlock, { language: "tsx", code: `<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  onFileUpload={handleFileUpload}
  enableFileUpload
/>` }), _jsx("p", { children: _jsx("a", { href: "/guides/file-upload", children: "Learn about file uploads \u2192" }) }), _jsx("h3", { children: "Add Message Operations" }), _jsx(CodeBlock, { language: "tsx", code: `<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  onEditMessage={handleEdit}
  onRegenerateMessage={handleRegenerate}
  enableMessageOperations
/>` }), _jsx("p", { children: _jsx("a", { href: "/guides/message-operations", children: "Learn about message operations \u2192" }) }), _jsx("h3", { children: "Customize Styling" }), _jsx(CodeBlock, { language: "tsx", code: `<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  theme={{
    primaryColor: '#6366f1',
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif',
  }}
/>` }), _jsx("p", { children: _jsx("a", { href: "/guides/theming", children: "Learn about theming \u2192" }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Troubleshooting" }), _jsx("h3", { children: "API Key Errors" }), _jsxs("p", { children: ["Make sure your ", _jsx("code", { children: ".env.local" }), " file is in the project root and contains:"] }), _jsx(CodeBlock, { language: "env", code: "OPENAI_API_KEY=sk-..." }), _jsx("p", { children: "Restart your dev server after adding environment variables." }), _jsx("h3", { children: "CORS Errors" }), _jsx("p", { children: "If you're calling an external API, you may need to configure CORS:" }), _jsx(CodeBlock, { language: "typescript", code: `// next.config.js
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
}` }), _jsx("h3", { children: "Type Errors" }), _jsx("p", { children: "Make sure you're importing types correctly:" }), _jsx(CodeBlock, { language: "tsx", code: `import type { Message } from '@clarity-chat/types'` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Full Example Code" }), _jsx("p", { children: "Check out the complete working examples in our repository:" }), _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/basic-chat", target: "_blank", rel: "noopener noreferrer", children: "Basic Chat (Vite)" }) }), _jsx("li", { children: _jsx("a", { href: "https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/streaming-chat", target: "_blank", rel: "noopener noreferrer", children: "Streaming Chat (Next.js)" }) }), _jsx("li", { children: _jsx("a", { href: "https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/customer-support", target: "_blank", rel: "noopener noreferrer", children: "Customer Support (Next.js + Supabase)" }) })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Learn More" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/guides/components", children: "Components Guide" }), " - Explore all components"] }), _jsxs("li", { children: [_jsx("a", { href: "/guides/hooks", children: "Hooks Guide" }), " - Learn about available hooks"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components", children: "API Reference" }), " - Detailed API documentation"] }), _jsxs("li", { children: [_jsx("a", { href: "/cookbook", children: "Cookbook" }), " - Recipes for common patterns"] })] })] })] }));
}
//# sourceMappingURL=page.js.map