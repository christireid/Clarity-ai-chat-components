import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
import { StreamingAnimation } from '@/components/Diagrams/StreamingAnimation';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Streaming Guide - Clarity Chat',
    description: 'Complete guide to implementing streaming AI responses for better UX.',
};
export default function StreamingGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Understanding Streaming" }), _jsx("p", { className: "docs-lead", children: "Why responses appear word-by-word (like ChatGPT) and how to implement it in your app." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Why Streaming Matters" }), _jsx("p", { children: "Imagine asking AI a question and waiting 30 seconds for a response. Feels slow, right? Now imagine seeing the answer appear word-by-word as it's generated. Feels instant. That's streaming." }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 my-6", children: [_jsxs("div", { className: "p-4 border-2 border-destructive/20 rounded-xl", children: [_jsx("div", { className: "font-semibold text-destructive mb-2", children: "\u274C Without Streaming" }), _jsxs("ul", { className: "text-sm space-y-1", children: [_jsx("li", { children: "\u2022 User waits 20-30 seconds" }), _jsx("li", { children: "\u2022 Feels slow and broken" }), _jsx("li", { children: "\u2022 Users might leave" }), _jsx("li", { children: "\u2022 All-or-nothing response" })] })] }), _jsxs("div", { className: "p-4 border-2 border-success/20 rounded-xl bg-success/5", children: [_jsx("div", { className: "font-semibold text-success mb-2", children: "\u2705 With Streaming" }), _jsxs("ul", { className: "text-sm space-y-1", children: [_jsx("li", { children: "\u2022 Response appears immediately" }), _jsx("li", { children: "\u2022 Feels fast and responsive" }), _jsx("li", { children: "\u2022 Users stay engaged" }), _jsx("li", { children: "\u2022 Can start reading early" })] })] })] }), _jsx(StreamingAnimation, {}), _jsx(Callout, { type: "info", title: "The Numbers", children: "Streaming can reduce perceived latency by 70-80%. Users think your app is 3-4x faster even though actual generation time is the same." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "How Streaming Works" }), _jsx("p", { children: "Instead of waiting for the complete response, the AI sends small chunks as it generates:" }), _jsx(CodeBlock, { language: "text", code: `Without Streaming:
User asks → [wait 30s] → Full response appears

With Streaming:
User asks → "The" → "The answer" → "The answer is" → "The answer is 42"` }), _jsx("p", { className: "mt-4", children: "Technically, it's Server-Sent Events (SSE) - the server pushes data to the client as it becomes available." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Visual Comparison" }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react'

function StreamingComparison() {
  const [streamingMessages, setStreamingMessages] = useState([])
  const [normalMessages, setNormalMessages] = useState([])

  const demoText = "Here's a detailed explanation of how quantum computing works. Quantum computers use qubits instead of bits, allowing them to process information in fundamentally different ways..."

  const simulateStreaming = async () => {
    setStreamingMessages([{ id: '1', role: 'user', content: 'Explain quantum computing', createdAt: new Date() }])
    
    const aiMsg = { id: '2', role: 'assistant', content: '', createdAt: new Date(), status: 'streaming' }
    setStreamingMessages(prev => [...prev, aiMsg])

    // Stream word by word
    for (let i = 0; i < demoText.length; i++) {
      await new Promise(r => setTimeout(r, 20))
      setStreamingMessages(prev => prev.map(m =>
        m.id === '2' ? { ...m, content: demoText.slice(0, i + 1) } : m
      ))
    }

    setStreamingMessages(prev => prev.map(m =>
      m.id === '2' ? { ...m, status: undefined } : m
    ))
  }

  const simulateNormal = async () => {
    setNormalMessages([{ id: '1', role: 'user', content: 'Explain quantum computing', createdAt: new Date() }])
    
    // Wait full time
    await new Promise(r => setTimeout(r, 3000))
    
    // Show complete response at once
    setNormalMessages(prev => [...prev, {
      id: '2',
      role: 'assistant',
      content: demoText,
      createdAt: new Date()
    }])
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={simulateStreaming}
          className="px-4 py-2 bg-success text-white rounded-lg"
        >
          ✅ Try Streaming
        </button>
        <button
          onClick={simulateNormal}
          className="px-4 py-2 bg-muted rounded-lg"
        >
          ❌ Try Without
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-semibold mb-2 text-success">Streaming</div>
          <div className="border rounded-lg h-[300px]">
            <ChatWindow messages={streamingMessages} onSendMessage={() => {}} />
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-2">Non-Streaming</div>
          <div className="border rounded-lg h-[300px]">
            <ChatWindow messages={normalMessages} onSendMessage={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}

render(<StreamingComparison />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Implementation: OpenAI" }), _jsx(CodeBlock, { language: "typescript", code: `// Server-side (API route)
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  stream: true,  // Enable streaming!
  messages: messages
})

// Convert to web stream
const stream = OpenAIStream(response)
return new StreamingTextResponse(stream)

// Client-side
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages })
})

const reader = response.body?.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const chunk = decoder.decode(value)
  // Update UI with new chunk
  setContent(prev => prev + chunk)
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Different Streaming Methods" }), _jsx("h3", { children: "Method 1: Server-Sent Events (SSE)" }), _jsx("p", { children: "What OpenAI uses. Server pushes data to client." }), _jsx(CodeBlock, { language: "typescript", code: `// Pros: Simple, works with HTTP
// Cons: One-way only (server → client)

// Server
return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  }
})` }), _jsx("h3", { children: "Method 2: WebSockets" }), _jsx("p", { children: "Two-way communication. Better for complex apps." }), _jsx(CodeBlock, { language: "typescript", code: `// Pros: Real-time, bi-directional
// Cons: More complex setup

import { useStreamingWebSocket } from '@clarity-chat/react'

const { sendMessage, messages } = useStreamingWebSocket({
  url: 'wss://api.example.com/chat'
})` }), _jsx("h3", { children: "Method 3: Polling" }), _jsx("p", { children: "Fallback when streaming isn't available." }), _jsx(CodeBlock, { language: "typescript", code: `// Pros: Works everywhere
// Cons: Slower, more requests

// Check for new content every 500ms
const interval = setInterval(async () => {
  const response = await fetch(\`/api/chat/\${messageId}\`)
  const data = await response.json()
  if (data.complete) clearInterval(interval)
}, 500)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Handling Stream Interruption" }), _jsx(CodeBlock, { language: "typescript", code: `import { StreamCancellation } from '@clarity-chat/react'

const abortController = new AbortController()

// Allow user to cancel
<StreamCancellation
  onCancel={() => {
    abortController.abort()
    setIsStreaming(false)
  }}
  isVisible={isStreaming}
/>

// In fetch
fetch('/api/chat', {
  signal: abortController.signal,
  // ...
})` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Error Handling in Streams" }), _jsx(CodeBlock, { language: "typescript", code: `try {
  const reader = response.body.getReader()
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const chunk = decoder.decode(value)
    
    // Check for error markers
    if (chunk.startsWith('ERROR:')) {
      throw new Error(chunk.slice(6))
    }
    
    updateMessage(chunk)
  }
} catch (error) {
  if (error.name === 'AbortError') {
    // User cancelled - that's ok
    markMessageAsCancelled()
  } else {
    // Real error - show to user
    showErrorMessage(error.message)
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "When NOT to Use Streaming" }), _jsxs("ul", { children: [_jsx("li", { children: "\u274C Short responses (< 50 tokens) - overhead not worth it" }), _jsx("li", { children: "\u274C Structured data (JSON) - wait for complete response" }), _jsx("li", { children: "\u274C When you need to validate before showing" }), _jsx("li", { children: "\u274C Batch processing many messages" })] }), _jsx("h2", { children: "When TO Use Streaming" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Long responses (> 100 tokens)" }), _jsx("li", { children: "\u2705 Real-time chat interfaces" }), _jsx("li", { children: "\u2705 User-facing applications" }), _jsx("li", { children: "\u2705 When perceived speed matters" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ol", { children: [_jsx("li", { children: "Show a cursor/indicator while streaming" }), _jsx("li", { children: "Allow users to cancel long responses" }), _jsx("li", { children: "Handle network interruptions gracefully" }), _jsx("li", { children: "Auto-scroll to keep latest content visible" }), _jsx("li", { children: "Debounce UI updates (don't update on every byte)" }), _jsx("li", { children: "Mark message as complete when done" }), _jsx("li", { children: "Log stream errors for debugging" })] }), _jsx(Callout, { type: "tip", title: "Pro Tip", children: "Update UI every 50-100ms, not on every chunk. Reduces re-renders and keeps app smooth even with fast streams." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/openai-streaming-chat", className: "docs-card", children: [_jsx("h3", { children: "OpenAI Streaming Recipe" }), _jsx("p", { children: "Step-by-step implementation" })] }), _jsxs("a", { href: "/reference/hooks/use-streaming", className: "docs-card", children: [_jsx("h3", { children: "useStreaming Hook" }), _jsx("p", { children: "Streaming utilities" })] }), _jsxs("a", { href: "/reference/components/streaming-message", className: "docs-card", children: [_jsx("h3", { children: "StreamingMessage" }), _jsx("p", { children: "Component for streaming display" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map