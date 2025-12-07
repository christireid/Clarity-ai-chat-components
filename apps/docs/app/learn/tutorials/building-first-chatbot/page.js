import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Tutorial: Building Your First Chatbot',
    description: 'Step-by-step guide to building a production-ready chatbot in 30 minutes.',
};
export default function BuildingFirstChatbotTutorial() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Tutorial" }), _jsx("h1", { children: "Building Your First Chatbot" }), _jsx("p", { className: "docs-lead", children: "Create a fully-functional AI chatbot with streaming, memory, and beautiful UI in 30 minutes." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "What You'll Build" }), _jsx("p", { children: "By the end of this tutorial, you'll have a production-ready chatbot with:" }), _jsxs("ul", { children: [_jsx("li", { children: "Real-time streaming responses" }), _jsx("li", { children: "Conversation memory and context" }), _jsx("li", { children: "Beautiful, accessible UI" }), _jsx("li", { children: "Error handling and loading states" }), _jsx("li", { children: "Mobile-responsive design" })] }), _jsxs(Callout, { type: "info", title: "Prerequisites", children: ["\u2022 Node.js 18+ installed", _jsx("br", {}), "\u2022 Basic React/Next.js knowledge", _jsx("br", {}), "\u2022 OpenAI API key (", _jsx("a", { href: "https://platform.openai.com", children: "get one here" }), ")"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 1: Setup Project" }), _jsx("p", { children: "Create a new Next.js project and install dependencies:" }), _jsx("pre", { children: _jsx("code", { children: `npx create-next-app@latest my-chatbot
cd my-chatbot
npm install @clarity-chat/react ai openai` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 2: Configure Environment" }), _jsxs("p", { children: ["Create a ", _jsx("code", { children: ".env.local" }), " file with your API key:"] }), _jsx("pre", { children: _jsx("code", { children: `OPENAI_API_KEY=sk-...` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 3: Create Chat API Route" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: "app/api/chat/route.ts" }), ":"] }), _jsx("pre", { children: _jsx("code", { children: `import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful AI assistant.'
      },
      ...messages
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 4: Create Chat Component" }), _jsxs("p", { children: ["Update ", _jsx("code", { children: "app/page.tsx" }), ":"] }), _jsx(CodePlayground, { initialCode: `'use client'
import { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      chatId: 'demo',
      role: 'assistant',
      content: 'Hello! I am your AI assistant. How can I help you today?',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent'
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call your API here
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      const data = await response.json()

      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        chatId: 'demo',
        role: 'assistant',
        content: data.response,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent'
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[600px]">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          showHeader
          sessionTitle="AI Assistant"
        />
      </div>
    </main>
  )
}

render(<Home />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 5: Add Styling" }), _jsxs("p", { children: ["Import Clarity Chat styles in ", _jsx("code", { children: "app/layout.tsx" }), ":"] }), _jsx("pre", { children: _jsx("code", { children: `import '@clarity-chat/react/styles.css'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 6: Run Your Chatbot" }), _jsx("pre", { children: _jsx("code", { children: `npm run dev` }) }), _jsxs("p", { children: ["Open ", _jsx("a", { href: "http://localhost:3000", children: "http://localhost:3000" }), " and start chatting!"] }), _jsx(Callout, { type: "success", title: "Congratulations!", children: "You've built your first AI chatbot! \uD83C\uDF89" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps: Add Features" }), _jsx("h3", { children: "Add Conversation Memory" }), _jsx("pre", { children: _jsx("code", { children: `// app/api/chat/route.ts
import { MemoryService } from '@clarity-chat/react/server'

const memory = new MemoryService({
  vectorStore: 'pinecone',
  apiKey: process.env.PINECONE_API_KEY
})

export async function POST(req: Request) {
  const { messages, userId } = await req.json()
  
  // Retrieve relevant context
  const context = await memory.retrieveContext({
    query: messages[messages.length - 1].content,
    userId,
    k: 5
  })
  
  // Include context in prompt
  const systemMessage = {
    role: 'system',
    content: \`You are a helpful assistant. Here's relevant context from previous conversations: \${context.join('\\n')}\`
  }
  
  // ... rest of the code
}` }) }), _jsx("h3", { children: "Add File Upload" }), _jsx("pre", { children: _jsx("code", { children: `import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  // ... existing props
  enableFileUpload={true}
  acceptedFileTypes={['.pdf', '.txt', '.md']}
  maxFileSize={10 * 1024 * 1024} // 10MB
  onFileUpload={async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
  }}
/>` }) }), _jsx("h3", { children: "Add Custom Theming" }), _jsx("pre", { children: _jsx("code", { children: `import { ThemeProvider } from '@clarity-chat/react'

<ThemeProvider
  theme={{
    colors: {
      primary: '#6366f1',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827'
    },
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif'
  }}
>
  <ChatWindow {...props} />
</ThemeProvider>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Troubleshooting" }), _jsx("h3", { children: "API Key Issues" }), _jsx("p", { children: "If you see authentication errors, make sure:" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Your ", _jsx("code", { children: ".env.local" }), " file is in the project root"] }), _jsx("li", { children: "You've restarted the dev server after adding environment variables" }), _jsx("li", { children: "Your API key is valid and has credits" })] }), _jsx("h3", { children: "Streaming Not Working" }), _jsx("p", { children: "Ensure your deployment platform supports streaming responses:" }), _jsxs("ul", { children: [_jsx("li", { children: "Vercel: Works out of the box" }), _jsx("li", { children: "AWS: Requires response streaming configuration" }), _jsx("li", { children: "Other platforms: Check their streaming documentation" })] }), _jsx("h3", { children: "Styles Not Applying" }), _jsx("p", { children: "Make sure you've imported the CSS:" }), _jsx("pre", { children: _jsx("code", { children: `import '@clarity-chat/react/styles.css'` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "What's Next?" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/learn/tutorials/adding-rag", className: "docs-card", children: [_jsx("h3", { children: "Adding RAG" }), _jsx("p", { children: "Build a knowledge-based chatbot" })] }), _jsxs("a", { href: "/learn/tutorials/agent-with-tools", className: "docs-card", children: [_jsx("h3", { children: "Agent with Tools" }), _jsx("p", { children: "Let your bot take actions" })] }), _jsxs("a", { href: "/cookbook", className: "docs-card", children: [_jsx("h3", { children: "Explore Cookbook" }), _jsx("p", { children: "More advanced recipes" })] }), _jsxs("a", { href: "/examples", className: "docs-card", children: [_jsx("h3", { children: "View Examples" }), _jsx("p", { children: "Complete example applications" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map