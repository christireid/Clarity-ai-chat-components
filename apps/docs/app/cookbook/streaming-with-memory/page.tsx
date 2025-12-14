import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Streaming Chat with Memory - Cookbook',
  description:
    'Build a streaming chat with semantic memory and context management.',
}

export default function StreamingWithMemoryCookbook() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Streaming Chat with Memory</h1>
        <p className="docs-lead">
          Implement real-time streaming responses with semantic memory and
          intelligent context management.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This recipe shows how to combine streaming responses with semantic
          memory to build a chat experience that maintains context across
          sessions and recalls relevant information.
        </p>
        <Callout type="info" title="What You'll Learn">
          • Setting up streaming with SSE or WebSockets
          <br />
          • Integrating semantic memory and vector search
          <br />
          • Managing conversation context windows
          <br />• Handling reconnections and error recovery
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Complete Example</h2>
        <CodePlayground
          initialCode={`function StreamingMemoryChat() {
  const { messages, sendMessage, isStreaming } = useChat({
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
        isStreaming={isStreaming}
        features={{
          memory: true,
          citations: true,
          followUpSuggestions: true
        }}
      />
    </MemoryProvider>
  )
}

render(<StreamingMemoryChat />)`}
        />
      </section>

      <section className="docs-section">
        <h2>API Route Setup</h2>
        <pre>
          <code>{`// app/api/chat/route.ts
import { StreamingTextResponse } from 'ai'
import { MemoryService } from '@clarity-chat/react/server'

export async function POST(req: Request) {
  const { messages, userId } = await req.json()
  
  // Retrieve relevant memories
  const memory = new MemoryService({
    vectorStore: 'pinecone',
    apiKey: process.env.PINECONE_API_KEY
  })
  
  const context = await memory.retrieveContext({
    query: messages[messages.length - 1].content,
    userId,
    k: 5
  })
  
  // Combine messages with memory context
  const prompt = [
    { role: 'system', content: 'You are a helpful assistant with memory.' },
    ...context.map(c => ({ role: 'assistant', content: c })),
    ...messages
  ]
  
  // Stream response
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: prompt,
      stream: true
    })
  })
  
  // Store new message in memory
  const lastMessage = messages[messages.length - 1]
  await memory.store({
    content: lastMessage.content,
    userId,
    metadata: { timestamp: Date.now() }
  })
  
  return new StreamingTextResponse(response.body)
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Advanced: Token-Optimized Memory</h2>
        <pre>
          <code>{`import { ChatWindow, TokenOptimizer } from '@clarity-chat/react'

export default function OptimizedMemoryChat() {
  const optimizer = new TokenOptimizer({
    compression: { algorithm: 'llmlingua', targetRatio: 0.6 },
    reranking: { k: 12, topK: 4 },
    slidingWindow: { maxTokens: 8000 }
  })

  const { messages, sendMessage } = useChat({
    endpoint: '/api/chat',
    enableMemory: true,
    tokenOptimizer: optimizer,
    onTokensOptimized: (savings) => {
      console.log(\`Saved \${savings.percent}% tokens\`)
    }
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      rightPanel={<TokenOptimizationPanel />}
    />
  )
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Set appropriate <code>maxTokens</code> based on your model's context
            window
          </li>
          <li>Use semantic search to retrieve only relevant memories</li>
          <li>Implement exponential backoff for reconnection logic</li>
          <li>
            Store embeddings asynchronously to avoid blocking the response
          </li>
          <li>Clean up old or low-relevance memories periodically</li>
          <li>Monitor token usage and adjust compression strategies</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/rag-document-chat" className="docs-card">
            <h3>RAG Document Chat</h3>
            <p>Chat over documents with retrieval</p>
          </a>
          <a href="/cookbook/multi-modal-chat" className="docs-card">
            <h3>Multi-Modal Chat</h3>
            <p>Handle images and files</p>
          </a>
          <a href="/guides/token-optimization" className="docs-card">
            <h3>Token Optimization</h3>
            <p>Reduce costs and improve performance</p>
          </a>
        </div>
      </section>
    </div>
  )
}
