import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Migrate from Vercel AI SDK - Clarity Chat',
    description: 'Step-by-step guide to migrating from Vercel AI SDK to Clarity Chat.',
};
export default function MigrateFromVercelAISDKPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Migration" }), _jsx("h1", { children: "Migrate from Vercel AI SDK" }), _jsx("p", { className: "docs-lead", children: "Comprehensive guide to migrating your Vercel AI SDK application to Clarity Chat with improved UI and features." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Why Migrate?" }), _jsxs(Callout, { type: "info", title: "Clarity Chat Advantages", children: ["\u2022 **Production-ready UI components** out of the box", _jsx("br", {}), "\u2022 **Enterprise features**: SSO, RBAC, audit logging", _jsx("br", {}), "\u2022 **Token optimization**: Built-in compression and caching", _jsx("br", {}), "\u2022 **Better DX**: Comprehensive TypeScript support", _jsx("br", {}), "\u2022 **Advanced memory**: Semantic search and RAG", _jsx("br", {}), "\u2022 **Performance**: Optimized rendering and virtualization"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Key Differences" }), _jsxs("table", { className: "docs-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Feature" }), _jsx("th", { children: "Vercel AI SDK" }), _jsx("th", { children: "Clarity Chat" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { children: "UI Components" }), _jsx("td", { children: "Build your own" }), _jsx("td", { children: "50+ production-ready components" })] }), _jsxs("tr", { children: [_jsx("td", { children: "Streaming" }), _jsx("td", { children: "useChat hook" }), _jsx("td", { children: "useChat + ChatWindow + streaming components" })] }), _jsxs("tr", { children: [_jsx("td", { children: "Memory" }), _jsx("td", { children: "Manual implementation" }), _jsx("td", { children: "Built-in semantic memory & RAG" })] }), _jsxs("tr", { children: [_jsx("td", { children: "Token Management" }), _jsx("td", { children: "Manual counting" }), _jsx("td", { children: "Auto optimization & tracking" })] }), _jsxs("tr", { children: [_jsx("td", { children: "Theming" }), _jsx("td", { children: "Custom CSS" }), _jsx("td", { children: "Theme system + presets" })] }), _jsxs("tr", { children: [_jsx("td", { children: "Enterprise" }), _jsx("td", { children: "Not included" }), _jsx("td", { children: "SSO, RBAC, audit logs" })] })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Migration Steps" }), _jsx("h3", { children: "1. Install Clarity Chat" }), _jsx("pre", { children: _jsx("code", { children: `npm install @clarity-chat/react
# Keep ai package for now if needed
# npm install ai` }) }), _jsx("h3", { children: "2. Update Imports" }), _jsx("p", { children: _jsx("strong", { children: "Before (Vercel AI SDK):" }) }), _jsx("pre", { children: _jsx("code", { children: `import { useChat } from 'ai/react'
import { Message } from 'ai'` }) }), _jsx("p", { children: _jsx("strong", { children: "After (Clarity Chat):" }) }), _jsx("pre", { children: _jsx("code", { children: `import { useChat, ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/react/types'` }) }), _jsx("h3", { children: "3. Replace Custom UI with Components" }), _jsx("p", { children: _jsx("strong", { children: "Before:" }) }), _jsx("pre", { children: _jsx("code", { children: `export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          <strong>{m.role}:</strong>
          <p>{m.content}</p>
        </div>
      ))}
      
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}` }) }), _jsx("p", { children: _jsx("strong", { children: "After:" }) }), _jsx("pre", { children: _jsx("code", { children: `export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <ChatWindow
      messages={messages}
      input={input}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      placeholder="Say something..."
    />
  )
}` }) }), _jsx(Callout, { type: "success", title: "Result", children: "You get a production-ready chat UI with streaming, markdown rendering, code highlighting, file upload, and more - all with 10 lines of code!" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "API Route Migration" }), _jsx("h3", { children: "OpenAI Streaming" }), _jsx("p", { children: _jsx("strong", { children: "Before (Vercel AI SDK):" }) }), _jsx("pre", { children: _jsx("code", { children: `// app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}` }) }), _jsx("p", { children: _jsx("strong", { children: "After (Clarity Chat):" }) }), _jsx("pre", { children: _jsx("code", { children: `// app/api/chat/route.ts
import { OpenAIChatHandler } from '@clarity-chat/react/server'

const handler = new OpenAIChatHandler({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
  // Built-in features:
  enableMemory: true,  // Automatic context management
  enableTokenTracking: true,  // Usage analytics
  enableSafety: true,  // Content filtering
})

export async function POST(req: Request) {
  return handler.handleRequest(req)
}` }) }), _jsx(Callout, { type: "info", title: "Benefits", children: "Clarity Chat's handler includes memory management, token tracking, error handling, and safety checks out of the box." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Feature Upgrades" }), _jsx("h3", { children: "Add Memory & RAG" }), _jsx("pre", { children: _jsx("code", { children: `import { ChatWindow, MemoryProvider } from '@clarity-chat/react'
import { useChat } from '@clarity-chat/react/hooks'

export default function ChatWithMemory() {
  const { messages, sendMessage } = useChat({
    endpoint: '/api/chat',
    enableMemory: true,
    memoryConfig: {
      maxTokens: 4000,
      strategy: 'semantic',
      vectorStore: 'pinecone'
    }
  })

  return (
    <MemoryProvider>
      <ChatWindow
        messages={messages}
        onSendMessage={sendMessage}
        features={{
          memory: true,
          citations: true,
          followUpSuggestions: true
        }}
      />
    </MemoryProvider>
  )
}` }) }), _jsx("h3", { children: "Add File Upload" }), _jsx("pre", { children: _jsx("code", { children: `<ChatWindow
  messages={messages}
  onSendMessage={sendMessage}
  enableFileUpload={true}
  acceptedFileTypes={['.pdf', '.txt', '.md']}
  maxFileSize={10 * 1024 * 1024}  // 10MB
  onFileUpload={async (file) => {
    // Process file
    await processDocument(file)
  }}
/>` }) }), _jsx("h3", { children: "Add Custom Theming" }), _jsx("pre", { children: _jsx("code", { children: `import { ThemeProvider } from '@clarity-chat/react'

<ThemeProvider
  theme={{
    colors: {
      primary: '#6366f1',
      background: '#ffffff',
      surface: '#f9fafb'
    },
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif'
  }}
>
  <ChatWindow {...props} />
</ThemeProvider>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Hook Comparison" }), _jsx("h3", { children: "useChat" }), _jsxs("table", { className: "docs-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Vercel AI SDK" }), _jsx("th", { children: "Clarity Chat" }), _jsx("th", { children: "Notes" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { children: _jsx("code", { children: "messages" }) }), _jsx("td", { children: _jsx("code", { children: "messages" }) }), _jsx("td", { children: "Same API" })] }), _jsxs("tr", { children: [_jsx("td", { children: _jsx("code", { children: "input" }) }), _jsx("td", { children: _jsx("code", { children: "input" }) }), _jsx("td", { children: "Same API" })] }), _jsxs("tr", { children: [_jsx("td", { children: _jsx("code", { children: "handleInputChange" }) }), _jsx("td", { children: _jsx("code", { children: "handleInputChange" }) }), _jsx("td", { children: "Same API" })] }), _jsxs("tr", { children: [_jsx("td", { children: _jsx("code", { children: "handleSubmit" }) }), _jsx("td", { children: _jsx("code", { children: "handleSubmit" }) }), _jsx("td", { children: "Same API" })] }), _jsxs("tr", { children: [_jsx("td", { children: _jsx("code", { children: "isLoading" }) }), _jsx("td", { children: _jsx("code", { children: "isLoading" }) }), _jsx("td", { children: "Same API" })] }), _jsxs("tr", { children: [_jsx("td", { children: "N/A" }), _jsx("td", { children: _jsx("code", { children: "tokenCount" }) }), _jsx("td", { children: "New: Track usage" })] }), _jsxs("tr", { children: [_jsx("td", { children: "N/A" }), _jsx("td", { children: _jsx("code", { children: "error" }) }), _jsx("td", { children: "New: Error state" })] }), _jsxs("tr", { children: [_jsx("td", { children: "N/A" }), _jsx("td", { children: _jsx("code", { children: "retry" }) }), _jsx("td", { children: "New: Retry failed requests" })] })] })] }), _jsx(Callout, { type: "tip", title: "Drop-in Replacement", children: "Clarity Chat's useChat is designed to be a drop-in replacement for Vercel AI SDK's useChat, with additional features." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Migrations" }), _jsx("h3", { children: "Tool/Function Calling" }), _jsx("p", { children: _jsx("strong", { children: "Before:" }) }), _jsx("pre", { children: _jsx("code", { children: `const { messages } = useChat({
  experimental_onFunctionCall: async ({ messages, functionCall }) => {
    if (functionCall.name === 'get_weather') {
      const weather = await getWeather(functionCall.arguments.location)
      return { result: weather }
    }
  }
})` }) }), _jsx("p", { children: _jsx("strong", { children: "After:" }) }), _jsx("pre", { children: _jsx("code", { children: `import { useAgent } from '@clarity-chat/react/hooks'

const tools = [
  {
    name: 'get_weather',
    description: 'Get weather for a location',
    parameters: {
      location: { type: 'string', required: true }
    },
    execute: async ({ location }) => {
      return await getWeather(location)
    }
  }
]

const { messages } = useAgent({
  endpoint: '/api/agent',
  tools
})` }) }), _jsx("h3", { children: "Custom Message Renderer" }), _jsx("p", { children: _jsx("strong", { children: "Before:" }) }), _jsx("pre", { children: _jsx("code", { children: `{messages.map(m => (
  <div key={m.id}>
    {m.content}
  </div>
))}` }) }), _jsx("p", { children: _jsx("strong", { children: "After:" }) }), _jsx("pre", { children: _jsx("code", { children: `<ChatWindow
  messages={messages}
  renderMessage={(message) => (
    <CustomMessage
      content={message.content}
      role={message.role}
      metadata={message.metadata}
    />
  )}
/>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Gradual Migration Strategy" }), _jsx(Callout, { type: "warning", title: "Recommended Approach", children: "Migrate incrementally to minimize risk and downtime." }), _jsx("h3", { children: "Phase 1: Install & Test" }), _jsxs("ul", { children: [_jsx("li", { children: "Install Clarity Chat alongside Vercel AI SDK" }), _jsx("li", { children: "Create a new route to test Clarity Chat" }), _jsx("li", { children: "Verify streaming and core functionality" })] }), _jsx("h3", { children: "Phase 2: Migrate UI" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Replace custom chat components with ", _jsx("code", { children: "ChatWindow" })] }), _jsx("li", { children: "Keep existing API routes" }), _jsx("li", { children: "Test thoroughly in staging" })] }), _jsx("h3", { children: "Phase 3: Migrate API" }), _jsxs("ul", { children: [_jsx("li", { children: "Gradually replace API routes with Clarity handlers" }), _jsx("li", { children: "Add memory and optimization features" }), _jsx("li", { children: "Monitor performance and usage" })] }), _jsx("h3", { children: "Phase 4: Add Features" }), _jsxs("ul", { children: [_jsx("li", { children: "Enable file upload" }), _jsx("li", { children: "Add RAG capabilities" }), _jsx("li", { children: "Implement token optimization" }), _jsx("li", { children: "Set up monitoring" })] }), _jsx("h3", { children: "Phase 5: Remove Vercel AI SDK" }), _jsxs("ul", { children: [_jsx("li", { children: "Once fully migrated, remove Vercel AI SDK dependency" }), _jsx("li", { children: "Clean up unused imports and code" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Compatibility Layer" }), _jsx("p", { children: "Use both libraries during migration:" }), _jsx("pre", { children: _jsx("code", { children: `// utils/chat-adapter.ts
import { useChat as useVercelChat } from 'ai/react'
import { useChat as useClarityChat } from '@clarity-chat/react'

export function useChat(config: ChatConfig) {
  // Use feature flag to switch
  if (process.env.NEXT_PUBLIC_USE_CLARITY === 'true') {
    return useClarityChat(config)
  }
  return useVercelChat(config)
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Breaking Changes" }), _jsx(Callout, { type: "warning", title: "Important", children: "Be aware of these differences during migration." }), _jsx("h3", { children: "1. Message Format" }), _jsx("pre", { children: _jsx("code", { children: `// Vercel AI SDK
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system' | 'function'
  content: string
}

// Clarity Chat (extended)
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'
  content: string
  metadata?: {
    tokens?: number
    cost?: number
    citations?: Citation[]
  }
}` }) }), _jsx("h3", { children: "2. Error Handling" }), _jsx("pre", { children: _jsx("code", { children: `// Vercel AI SDK
const { error } = useChat()

// Clarity Chat (enhanced)
const { error, retry, resetError } = useChat({
  onError: (error) => {
    console.error('Chat error:', error)
    // Custom error handling
  }
})` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Cost Comparison" }), _jsxs("table", { className: "docs-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Aspect" }), _jsx("th", { children: "Vercel AI SDK" }), _jsx("th", { children: "Clarity Chat" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { children: "Package" }), _jsx("td", { children: "Free (MIT)" }), _jsx("td", { children: "Free (MIT) + Pro/Enterprise" })] }), _jsxs("tr", { children: [_jsx("td", { children: "UI Development" }), _jsx("td", { children: "2-4 weeks" }), _jsx("td", { children: "0 days (included)" })] }), _jsxs("tr", { children: [_jsx("td", { children: "Memory/RAG" }), _jsx("td", { children: "Build yourself" }), _jsx("td", { children: "Included" })] }), _jsxs("tr", { children: [_jsx("td", { children: "Enterprise Features" }), _jsx("td", { children: "Build yourself" }), _jsx("td", { children: "$199/mo (Enterprise)" })] }), _jsxs("tr", { children: [_jsx("td", { children: "Support" }), _jsx("td", { children: "Community" }), _jsx("td", { children: "Community + Paid support" })] })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Success Stories" }), _jsx(Callout, { type: "success", title: "Real Migration", children: "\"We migrated from Vercel AI SDK to Clarity Chat in 2 days. The production-ready components saved us 3 weeks of UI development, and the built-in memory system improved our RAG quality by 40%.\" - CTO, AI Startup" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Migration Checklist" }), _jsxs("ul", { className: "checklist", children: [_jsx("li", { children: "\u2610 Install @clarity-chat/react" }), _jsx("li", { children: "\u2610 Test ChatWindow component in isolation" }), _jsx("li", { children: "\u2610 Migrate one route/page at a time" }), _jsx("li", { children: "\u2610 Update API handlers (optional)" }), _jsx("li", { children: "\u2610 Test streaming functionality" }), _jsx("li", { children: "\u2610 Verify error handling" }), _jsx("li", { children: "\u2610 Test file upload (if using)" }), _jsx("li", { children: "\u2610 Configure theming" }), _jsx("li", { children: "\u2610 Set up memory/RAG (if needed)" }), _jsx("li", { children: "\u2610 Deploy to staging" }), _jsx("li", { children: "\u2610 Run integration tests" }), _jsx("li", { children: "\u2610 Monitor performance" }), _jsx("li", { children: "\u2610 Deploy to production" }), _jsx("li", { children: "\u2610 Remove Vercel AI SDK (when ready)" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Need Help?" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\uD83D\uDCD6 ", _jsx("a", { href: "/learn/quick-start", children: "Quick Start Guide" })] }), _jsxs("li", { children: ["\uD83D\uDCAC ", _jsx("a", { href: "https://discord.gg/clarity-chat", children: "Discord Community" })] }), _jsx("li", { children: "\uD83D\uDCE7 Email: migrations@clarity-chat.dev" }), _jsxs("li", { children: ["\uD83C\uDFAF ", _jsx("a", { href: "/contact", children: "Enterprise Migration Support" })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/learn/quick-start", className: "docs-card", children: [_jsx("h3", { children: "Quick Start" }), _jsx("p", { children: "Get started with Clarity Chat" })] }), _jsxs("a", { href: "/learn/tutorials/building-first-chatbot", className: "docs-card", children: [_jsx("h3", { children: "Build First Chatbot" }), _jsx("p", { children: "30-minute tutorial" })] }), _jsxs("a", { href: "/cookbook", className: "docs-card", children: [_jsx("h3", { children: "Cookbook" }), _jsx("p", { children: "Common patterns and recipes" })] }), _jsxs("a", { href: "/examples", className: "docs-card", children: [_jsx("h3", { children: "Examples" }), _jsx("p", { children: "Complete example applications" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map