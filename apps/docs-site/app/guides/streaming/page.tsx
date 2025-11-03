import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'Streaming Guide - Clarity Chat',
  description: 'Complete guide to implementing streaming AI responses for better UX.',
}

export default function StreamingGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Understanding Streaming</h1>
        <p className="docs-lead">
          Why responses appear word-by-word (like ChatGPT) and how to implement it in your app.
        </p>
      </div>

      <section className="docs-section">
        <h2>Why Streaming Matters</h2>
        <p>
          Imagine asking AI a question and waiting 30 seconds for a response. Feels slow, right? Now imagine seeing the answer appear word-by-word as it's generated. Feels instant. That's streaming.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-4 border-2 border-destructive/20 rounded-xl">
            <div className="font-semibold text-destructive mb-2">❌ Without Streaming</div>
            <ul className="text-sm space-y-1">
              <li>• User waits 20-30 seconds</li>
              <li>• Feels slow and broken</li>
              <li>• Users might leave</li>
              <li>• All-or-nothing response</li>
            </ul>
          </div>

          <div className="p-4 border-2 border-success/20 rounded-xl bg-success/5">
            <div className="font-semibold text-success mb-2">✅ With Streaming</div>
            <ul className="text-sm space-y-1">
              <li>• Response appears immediately</li>
              <li>• Feels fast and responsive</li>
              <li>• Users stay engaged</li>
              <li>• Can start reading early</li>
            </ul>
          </div>
        </div>

        <Callout type="info" title="The Numbers">
          Streaming can reduce perceived latency by 70-80%. Users think your app is
          3-4x faster even though actual generation time is the same.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>How Streaming Works</h2>
        <p>Instead of waiting for the complete response, the AI sends small chunks as it generates:</p>
        
        <CodeBlock
          language="text"
          code={`Without Streaming:
User asks → [wait 30s] → Full response appears

With Streaming:
User asks → "The" → "The answer" → "The answer is" → "The answer is 42"`}
        />

        <p className="mt-4">Technically, it's Server-Sent Events (SSE) - the server pushes data to the client as it becomes available.</p>
      </section>

      <section className="docs-section">
        <h2>Visual Comparison</h2>
        <LiveDemo
          title="Streaming vs Non-Streaming"
          code={`import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

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

export default StreamingComparison`}
          height="500px"
        />
      </section>

      <section className="docs-section">
        <h2>Implementation: OpenAI</h2>
        <CodeBlock
          language="typescript"
          code={`// Server-side (API route)
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
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Different Streaming Methods</h2>

        <h3>Method 1: Server-Sent Events (SSE)</h3>
        <p>What OpenAI uses. Server pushes data to client.</p>
        <CodeBlock
          language="typescript"
          code={`// Pros: Simple, works with HTTP
// Cons: One-way only (server → client)

// Server
return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  }
})`}
        />

        <h3>Method 2: WebSockets</h3>
        <p>Two-way communication. Better for complex apps.</p>
        <CodeBlock
          language="typescript"
          code={`// Pros: Real-time, bi-directional
// Cons: More complex setup

import { useStreamingWebSocket } from '@clarity-chat/react'

const { sendMessage, messages } = useStreamingWebSocket({
  url: 'wss://api.example.com/chat'
})`}
        />

        <h3>Method 3: Polling</h3>
        <p>Fallback when streaming isn't available.</p>
        <CodeBlock
          language="typescript"
          code={`// Pros: Works everywhere
// Cons: Slower, more requests

// Check for new content every 500ms
const interval = setInterval(async () => {
  const response = await fetch(\`/api/chat/\${messageId}\`)
  const data = await response.json()
  if (data.complete) clearInterval(interval)
}, 500)`}
        />
      </section>

      <section className="docs-section">
        <h2>Handling Stream Interruption</h2>
        <CodeBlock
          language="typescript"
          code={`import { StreamCancellation } from '@clarity-chat/react'

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
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Error Handling in Streams</h2>
        <CodeBlock
          language="typescript"
          code={`try {
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
}`}
        />
      </section>

      <section className="docs-section">
        <h2>When NOT to Use Streaming</h2>
        <ul>
          <li>❌ Short responses (< 50 tokens) - overhead not worth it</li>
          <li>❌ Structured data (JSON) - wait for complete response</li>
          <li>❌ When you need to validate before showing</li>
          <li>❌ Batch processing many messages</li>
        </ul>

        <h2>When TO Use Streaming</h2>
        <ul>
          <li>✅ Long responses (> 100 tokens)</li>
          <li>✅ Real-time chat interfaces</li>
          <li>✅ User-facing applications</li>
          <li>✅ When perceived speed matters</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li>Show a cursor/indicator while streaming</li>
          <li>Allow users to cancel long responses</li>
          <li>Handle network interruptions gracefully</li>
          <li>Auto-scroll to keep latest content visible</li>
          <li>Debounce UI updates (don't update on every byte)</li>
          <li>Mark message as complete when done</li>
          <li>Log stream errors for debugging</li>
        </ol>

        <Callout type="tip" title="Pro Tip">
          Update UI every 50-100ms, not on every chunk. Reduces re-renders and
          keeps app smooth even with fast streams.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/openai-streaming-chat" className="docs-card">
            <h3>OpenAI Streaming Recipe</h3>
            <p>Step-by-step implementation</p>
          </a>
          <a href="/reference/hooks/use-streaming" className="docs-card">
            <h3>useStreaming Hook</h3>
            <p>Streaming utilities</p>
          </a>
          <a href="/reference/components/streaming-message" className="docs-card">
            <h3>StreamingMessage</h3>
            <p>Component for streaming display</p>
          </a>
        </div>
      </section>
    </div>
  )
}

