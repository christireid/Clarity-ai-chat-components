import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Streaming Chat with Memory - Cookbook',
    description: 'Build a streaming chat with semantic memory and context management.',
};
export default function StreamingWithMemoryCookbook() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "Streaming Chat with Memory" }), _jsx("p", { className: "docs-lead", children: "Implement real-time streaming responses with semantic memory and intelligent context management." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "This recipe shows how to combine streaming responses with semantic memory to build a chat experience that maintains context across sessions and recalls relevant information." }), _jsxs(Callout, { type: "info", title: "What You'll Learn", children: ["\u2022 Setting up streaming with SSE or WebSockets", _jsx("br", {}), "\u2022 Integrating semantic memory and vector search", _jsx("br", {}), "\u2022 Managing conversation context windows", _jsx("br", {}), "\u2022 Handling reconnections and error recovery"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Complete Example" }), _jsx(CodePlayground, { initialCode: `function StreamingMemoryChat() {
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

render(<StreamingMemoryChat />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "API Route Setup" }), _jsx("pre", { children: _jsx("code", { children: `// app/api/chat/route.ts
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced: Token-Optimized Memory" }), _jsx("pre", { children: _jsx("code", { children: `import { ChatWindow, TokenOptimizer } from '@clarity-chat/react'

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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Set appropriate ", _jsx("code", { children: "maxTokens" }), " based on your model's context window"] }), _jsx("li", { children: "Use semantic search to retrieve only relevant memories" }), _jsx("li", { children: "Implement exponential backoff for reconnection logic" }), _jsx("li", { children: "Store embeddings asynchronously to avoid blocking the response" }), _jsx("li", { children: "Clean up old or low-relevance memories periodically" }), _jsx("li", { children: "Monitor token usage and adjust compression strategies" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Recipes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/rag-document-chat", className: "docs-card", children: [_jsx("h3", { children: "RAG Document Chat" }), _jsx("p", { children: "Chat over documents with retrieval" })] }), _jsxs("a", { href: "/cookbook/multi-modal-chat", className: "docs-card", children: [_jsx("h3", { children: "Multi-Modal Chat" }), _jsx("p", { children: "Handle images and files" })] }), _jsxs("a", { href: "/guides/token-optimization", className: "docs-card", children: [_jsx("h3", { children: "Token Optimization" }), _jsx("p", { children: "Reduce costs and improve performance" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map