import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Remix Integration - Clarity Chat',
    description: 'Complete guide for integrating Clarity Chat with Remix.',
};
export default function RemixIntegrationPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Integration" }), _jsx("h1", { children: "Remix Integration" }), _jsx("p", { className: "docs-lead", children: "Complete guide for integrating Clarity Chat with Remix." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Quick Start" }), _jsx("p", { children: _jsx("strong", { children: "1. Create Remix app:" }) }), _jsx(CodeBlock, { language: "bash", code: `npx create-remix@latest my-chat-app
cd my-chat-app` }), _jsx("p", { children: _jsx("strong", { children: "2. Install Clarity Chat:" }) }), _jsx(CodeBlock, { language: "bash", code: `npm install @clarity-chat/react` }), _jsxs("p", { children: [_jsx("strong", { children: "3. Add styles to root" }), " (", _jsx("code", { children: "app/root.tsx" }), "):"] }), _jsx(CodeBlock, { language: "tsx", code: `import styles from '@clarity-chat/react/styles.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}` }), _jsxs("p", { children: [_jsx("strong", { children: "4. Create chat route" }), " (", _jsx("code", { children: "app/routes/_index.tsx" }), "):"] }), _jsx(CodeBlock, { language: "tsx", code: `import { ChatWindow } from '@clarity-chat/react'
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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "API Routes with Actions" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: "app/routes/api.chat.ts" }), ":"] }), _jsx(CodeBlock, { language: "typescript", code: `import { OpenAI } from 'openai'
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
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content }],
  })
  
  return json({ message: completion.choices[0].message.content })
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Environment Variables" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: ".env" }), ":"] }), _jsx(CodeBlock, { language: "env", code: `OPENAI_API_KEY=sk-...` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Deployment" }), _jsx("h3", { children: "Fly.io" }), _jsx(CodeBlock, { language: "bash", code: `fly launch
fly deploy` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Example" }), _jsxs("p", { children: ["See the complete ", _jsx("a", { href: "https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/multi-user-chat", children: "Multi-User Chat example" }), " built with Remix and Socket.io."] })] })] }));
}
//# sourceMappingURL=page.js.map