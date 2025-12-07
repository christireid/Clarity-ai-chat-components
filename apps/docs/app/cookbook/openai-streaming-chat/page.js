import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'OpenAI Streaming Chat - Cookbook - Clarity Chat',
    description: 'Complete guide to building a streaming chat app with OpenAI and Clarity Chat Components.',
};
export default function OpenAIStreamingChatPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "OpenAI Streaming Chat" }), _jsx("p", { className: "docs-lead", children: "Build a complete chat app with OpenAI's streaming API. Users see responses appear word-by-word in real-time, just like ChatGPT." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "What You'll Build" }), _jsx("p", { children: "A production-ready chat interface with:" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Real-time streaming responses" }), _jsx("li", { children: "\u2705 Message history" }), _jsx("li", { children: "\u2705 Loading states" }), _jsx("li", { children: "\u2705 Error handling with retry" }), _jsx("li", { children: "\u2705 Proper TypeScript types" })] }), _jsx(Callout, { type: "info", title: "Time: ~15 minutes", children: "This recipe is copy-paste ready. You'll have a working chat in minutes." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Prerequisites" }), _jsx(CodeBlock, { language: "bash", code: `# Install dependencies
npm install @clarity-chat/react openai

# Get your API key from https://platform.openai.com/api-keys
# Add to .env.local:
OPENAI_API_KEY=sk-...` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 1: Create API Route (Next.js)" }), _jsx("p", { children: "First, create a server endpoint that streams from OpenAI:" }), _jsx(CodeBlock, { language: "typescript", code: `// app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const runtime = 'edge' // Use Edge Runtime for streaming

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Call OpenAI with streaming
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })

    // Convert to text stream
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      { status: 500 }
    )
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 2: Build Chat Component" }), _jsx(CodeBlock, { language: "typescript", code: `// app/chat/page.tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! How can I help you today?',
      createdAt: new Date()
    }
  ])
  
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      createdAt: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Create placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant' as const,
      content: '',
      createdAt: new Date(),
      status: 'streaming' as const
    }])

    setIsLoading(true)

    try {
      // Call your API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      // Read the stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        accumulatedContent += chunk

        // Update AI message with new content
        setMessages(prev => prev.map(m =>
          m.id === aiMessageId
            ? { ...m, content: accumulatedContent }
            : m
        ))
      }

      // Mark as complete
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId
          ? { ...m, status: undefined }
          : m
      ))

    } catch (error) {
      console.error('Chat error:', error)
      
      // Show error state
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId
          ? {
              ...m,
              content: 'Sorry, something went wrong. Please try again.',
              status: 'error' as const
            }
          : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 3: Add Styles" }), _jsx(CodeBlock, { language: "typescript", code: `// app/layout.tsx
import '@clarity-chat/react/styles.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Complete Working Example" }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react'

function StreamingChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! Ask me anything. (This is a demo - not actually calling OpenAI)',
      createdAt: new Date()
    }
  ])

  const [isLoading, setIsLoading] = useState(false)

  const simulateStream = async (userInput: string) => {
    const responses = [
      "That's a great question! ",
      "Let me think about that. ",
      "Based on what I know, ",
      "I'd recommend trying this approach: ",
      "First, make sure you have the prerequisites. ",
      "Then, follow these steps..."
    ]

    const aiMessageId = Date.now().toString()
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      status: 'streaming'
    }])

    let accumulated = ''
    for (const chunk of responses) {
      await new Promise(resolve => setTimeout(resolve, 300))
      accumulated += chunk
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId ? { ...m, content: accumulated } : m
      ))
    }

    setMessages(prev => prev.map(m =>
      m.id === aiMessageId ? { ...m, status: undefined } : m
    ))
  }

  const handleSendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      createdAt: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    setIsLoading(true)
    await simulateStream(content)
    setIsLoading(false)
  }

  return (
    <div className="h-[500px] border rounded-xl overflow-hidden">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}

render(<StreamingChatDemo />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Improvements You Can Add" }), _jsx("h3", { children: "1. Add System Prompt" }), _jsx(CodeBlock, { language: "typescript", code: `const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  stream: true,
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant. Be concise and friendly.'
    },
    ...messages
  ]
})` }), _jsx("h3", { children: "2. Save Conversation History" }), _jsx(CodeBlock, { language: "typescript", code: `// Save to database after each message
import { db } from '@/lib/database'

await db.messages.create({
  data: {
    conversationId: conversationId,
    role: message.role,
    content: message.content,
    createdAt: new Date()
  }
})` }), _jsx("h3", { children: "3. Add Token Counting" }), _jsx(CodeBlock, { language: "typescript", code: `import { encoding_for_model } from 'tiktoken'

const encoding = encoding_for_model('gpt-4')
const tokens = encoding.encode(content).length

// Show to user
<TokenCounter current={tokens} limit={4096} />` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Common Issues & Solutions" }), _jsx("h3", { children: "Issue: Stream Not Working" }), _jsx("p", { children: "Make sure you're using Edge Runtime:" }), _jsx(CodeBlock, { language: "typescript", code: "export const runtime = 'edge' // At top of route.ts" }), _jsx("h3", { children: "Issue: CORS Errors" }), _jsx("p", { children: "Add CORS headers to your API route:" }), _jsx(CodeBlock, { language: "typescript", code: `return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  }
})` }), _jsx("h3", { children: "Issue: Rate Limits" }), _jsx("p", { children: "Implement retry logic with exponential backoff:" }), _jsx(CodeBlock, { language: "typescript", code: `async function chatWithRetry(messages, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await openai.chat.completions.create({ ... })
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        // Wait before retry: 1s, 2s, 4s
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
        continue
      }
      throw error
    }
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Full Production Example" }), _jsx("p", { children: "Complete implementation with all best practices:" }), _jsx(CodeBlock, { language: "typescript", code: `// See the complete working example in:
// examples/streaming-chat/

// Includes:
// - Conversation persistence (Supabase)
// - User authentication (NextAuth)
// - Error boundaries
// - Token counting
// - Rate limiting
// - Analytics tracking
// - Mobile responsive` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/rag-document-chat", className: "docs-card", children: [_jsx("h3", { children: "Add RAG" }), _jsx("p", { children: "Let users chat with their documents" })] }), _jsxs("a", { href: "/cookbook/agent-with-tools", className: "docs-card", children: [_jsx("h3", { children: "Add Tools" }), _jsx("p", { children: "Let AI call functions and APIs" })] }), _jsxs("a", { href: "/cookbook/authentication", className: "docs-card", children: [_jsx("h3", { children: "Add Auth" }), _jsx("p", { children: "Secure with user accounts" })] }), _jsxs("a", { href: "/cookbook/analytics-tracking", className: "docs-card", children: [_jsx("h3", { children: "Add Analytics" }), _jsx("p", { children: "Track usage and costs" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map