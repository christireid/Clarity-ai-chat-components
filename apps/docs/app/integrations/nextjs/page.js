import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Next.js Integration - Clarity Chat',
    description: 'Complete guide for integrating Clarity Chat with Next.js 15 App Router and Pages Router.',
};
export default function NextJSIntegrationPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Integration" }), _jsx("h1", { children: "Next.js Integration" }), _jsx("p", { className: "docs-lead", children: "Complete guide for integrating Clarity Chat with Next.js 15 App Router and Pages Router." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Quick Start" }), _jsx("h3", { children: "App Router (Recommended)" }), _jsx("p", { children: _jsx("strong", { children: "1. Install package:" }) }), _jsx(CodeBlock, { language: "bash", code: `npm install @clarity-chat/react` }), _jsxs("p", { children: [_jsx("strong", { children: "2. Create client component" }), " (", _jsx("code", { children: "app/components/Chat.tsx" }), "):"] }), _jsx(CodeBlock, { language: "tsx", code: `'use client'

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
}` }), _jsxs("p", { children: [_jsx("strong", { children: "3. Create API route" }), " (", _jsx("code", { children: "app/api/chat/route.ts" }), "):"] }), _jsx(CodeBlock, { language: "tsx", code: `import { OpenAI } from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const { content } = await req.json()
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content }],
  })
  
  return Response.json({ message: completion.choices[0].message.content })
}` }), _jsxs("p", { children: [_jsx("strong", { children: "4. Use in page" }), " (", _jsx("code", { children: "app/page.tsx" }), "):"] }), _jsx(CodeBlock, { language: "tsx", code: `import { Chat } from './components/Chat'
import '@clarity-chat/react/styles.css'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-4xl h-[600px]">
        <Chat />
      </div>
    </main>
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Streaming with SSE" }), _jsxs("p", { children: ["For real-time streaming responses, see the ", _jsx("a", { href: "/examples/streaming", children: "Streaming Chat Demo" }), " for complete implementation details."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Environment Variables" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: ".env.local" }), ":"] }), _jsx(CodeBlock, { language: "env", code: `OPENAI_API_KEY=sk-...` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Deployment" }), _jsx("h3", { children: "Vercel" }), _jsx(CodeBlock, { language: "bash", code: `vercel` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Examples" }), _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/basic-chat", children: "Basic Chat" }) }), _jsx("li", { children: _jsx("a", { href: "https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/streaming-chat", children: "Streaming Chat" }) }), _jsx("li", { children: _jsx("a", { href: "https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/customer-support", children: "Customer Support" }) })] })] })] }));
}
//# sourceMappingURL=page.js.map