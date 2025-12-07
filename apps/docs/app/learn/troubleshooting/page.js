import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Troubleshooting - Clarity Chat',
    description: 'Common issues and solutions for Clarity Chat applications.',
};
export default function TroubleshootingPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Troubleshooting" }), _jsx("p", { className: "docs-lead", children: "Solutions to common issues, error messages, and debugging strategies." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Quick Diagnostics" }), _jsxs(Callout, { type: "info", title: "Debug Mode", children: ["Enable debug mode to see detailed logs:", _jsx("br", {}), _jsx("code", { children: "NEXT_PUBLIC_DEBUG=true npm run dev" })] }), _jsx("pre", { children: _jsx("code", { children: `// Add to your app
import { enableDebugMode } from '@clarity-chat/react'

if (process.env.NODE_ENV === 'development') {
  enableDebugMode({
    verbose: true,
    logRequests: true,
    logTokens: true
  })
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Installation & Setup Issues" }), _jsx("h3", { children: "Module Not Found" }), _jsxs("p", { children: [_jsx("strong", { children: "Error:" }), " ", _jsx("code", { children: "Cannot find module '@clarity-chat/react'" })] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsxs("ul", { children: [_jsxs("li", { children: ["Verify installation: ", _jsx("code", { children: "npm list @clarity-chat/react" })] }), _jsxs("li", { children: ["Clear node_modules: ", _jsx("code", { children: "rm -rf node_modules package-lock.json && npm install" })] }), _jsx("li", { children: "Check package.json has correct version" }), _jsx("li", { children: "Restart your dev server" })] }), _jsx("h3", { children: "Type Errors" }), _jsxs("p", { children: [_jsx("strong", { children: "Error:" }), " ", _jsx("code", { children: "Property 'X' does not exist on type..." })] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsxs("ul", { children: [_jsxs("li", { children: ["Install type definitions: ", _jsx("code", { children: "npm install --save-dev @types/node" })] }), _jsx("li", { children: "Ensure TypeScript version \u2265 4.9" }), _jsx("li", { children: "Add to tsconfig.json:" })] }), _jsx("pre", { children: _jsx("code", { children: `{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "strict": true
  }
}` }) }), _jsx("h3", { children: "CSS Not Loading" }), _jsxs("p", { children: [_jsx("strong", { children: "Issue:" }), " Components appear unstyled"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Import in app/layout.tsx or _app.tsx
import '@clarity-chat/react/styles.css'

// Or use CSS modules
import styles from '@clarity-chat/react/styles.module.css'` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "API & Streaming Issues" }), _jsx("h3", { children: "Streaming Not Working" }), _jsxs("p", { children: [_jsx("strong", { children: "Issue:" }), " Messages appear all at once instead of streaming"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("ul", { children: _jsxs("li", { children: [_jsx("strong", { children: "Vercel:" }), " Enable streaming in vercel.json:"] }) }), _jsx("pre", { children: _jsx("code", { children: `{
  "functions": {
    "app/api/chat/route.ts": {
      "maxDuration": 30
    }
  }
}` }) }), _jsx("ul", { children: _jsxs("li", { children: [_jsx("strong", { children: "AWS Lambda:" }), " Use response streaming:"] }) }), _jsx("pre", { children: _jsx("code", { children: `// Configure Lambda for streaming
export const handler = awslambda.streamifyResponse(async (event) => {
  // Your streaming code
})` }) }), _jsx("ul", { children: _jsxs("li", { children: [_jsx("strong", { children: "Node.js:" }), " Set proper headers:"] }) }), _jsx("pre", { children: _jsx("code", { children: `res.setHeader('Content-Type', 'text/event-stream')
res.setHeader('Cache-Control', 'no-cache')
res.setHeader('Connection', 'keep-alive')` }) }), _jsx("h3", { children: "CORS Errors" }), _jsxs("p", { children: [_jsx("strong", { children: "Error:" }), " ", _jsx("code", { children: "Access-Control-Allow-Origin" }), " blocked"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      }
    ]
  }
}` }) }), _jsx("h3", { children: "Rate Limit Errors" }), _jsxs("p", { children: [_jsx("strong", { children: "Error:" }), " ", _jsx("code", { children: "429 Too Many Requests" })] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `import { RateLimiter } from '@clarity-chat/react/utils'

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute',
  fireImmediately: true
})

// In API route
export async function POST(req: Request) {
  const identifier = req.headers.get('x-forwarded-for') || 'anonymous'
  
  if (!await limiter.tryRemoveTokens(1, identifier)) {
    return Response.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429 }
    )
  }
  
  // Process request
}` }) }), _jsx("h3", { children: "OpenAI API Errors" }), _jsxs("p", { children: [_jsx("strong", { children: "Error:" }), " ", _jsx("code", { children: "Invalid API key" })] }), _jsx("p", { children: _jsx("strong", { children: "Checklist:" }) }), _jsxs("ul", { children: [_jsxs("li", { children: ["Verify key in ", _jsx("code", { children: ".env.local" }), ": ", _jsx("code", { children: "OPENAI_API_KEY=sk-..." })] }), _jsx("li", { children: "Restart dev server after adding env vars" }), _jsxs("li", { children: ["Check API key has credits: ", _jsx("a", { href: "https://platform.openai.com/usage", children: "platform.openai.com/usage" })] }), _jsx("li", { children: "Verify key permissions (some keys are read-only)" })] }), _jsxs("p", { children: [_jsx("strong", { children: "Error:" }), " ", _jsx("code", { children: "Model not found" })] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsxs("ul", { children: [_jsxs("li", { children: ["Verify model name: ", _jsx("code", { children: "gpt-4" }), ", ", _jsx("code", { children: "gpt-3.5-turbo" }), ", etc."] }), _jsx("li", { children: "Check account has access to model (GPT-4 requires special access)" }), _jsxs("li", { children: ["Use model aliases: ", _jsx("code", { children: "gpt-4-turbo" }), " \u2192 ", _jsx("code", { children: "gpt-4-0125-preview" })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Performance Issues" }), _jsx("h3", { children: "Slow Rendering" }), _jsxs("p", { children: [_jsx("strong", { children: "Issue:" }), " UI feels sluggish during streaming"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Use virtualization for long message lists
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  height={600}
  itemHeight={80}
/>

// Enable message optimization
import { MessageOptimized } from '@clarity-chat/react'

<MessageOptimized
  content={message.content}
  renderStrategy="incremental"
  chunkSize={100}
/>` }) }), _jsx("h3", { children: "Memory Leaks" }), _jsxs("p", { children: [_jsx("strong", { children: "Issue:" }), " Memory usage grows over time"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Clean up event listeners
useEffect(() => {
  const handler = (event) => {
    // ...
  }
  
  window.addEventListener('resize', handler)
  
  return () => {
    window.removeEventListener('resize', handler)
  }
}, [])

// Limit message history
const { messages } = useChat({
  maxHistory: 100,  // Keep last 100 messages
  onHistoryLimit: (overflow) => {
    // Archive old messages
    archiveMessages(overflow)
  }
})` }) }), _jsx("h3", { children: "Bundle Size Too Large" }), _jsxs("p", { children: [_jsx("strong", { children: "Issue:" }), " Large JavaScript bundles"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Use dynamic imports
const ChatWindow = dynamic(() => import('@clarity-chat/react').then(mod => mod.ChatWindow))

// Tree-shake unused components
import { ChatWindow } from '@clarity-chat/react/components/chat-window'

// Analyze bundle
npm run build && npx @next/bundle-analyzer` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Memory & Context Issues" }), _jsx("h3", { children: "Vector Store Errors" }), _jsxs("p", { children: [_jsx("strong", { children: "Error:" }), " ", _jsx("code", { children: "Failed to connect to Pinecone" })] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Verify environment variables
PINECONE_API_KEY=your-key
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=clarity-chat

// Test connection
import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const indexes = await pinecone.listIndexes()
console.log('Available indexes:', indexes)` }) }), _jsx("h3", { children: "Context Window Exceeded" }), _jsxs("p", { children: [_jsx("strong", { children: "Error:" }), " ", _jsx("code", { children: "This model's maximum context length is..." })] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `import { useTokenOptimization } from '@clarity-chat/react/hooks'

const { optimizedMessages } = useTokenOptimization(messages, {
  slidingWindow: {
    maxTokens: 4000,  // Leave room for response
    strategy: 'semantic'
  },
  compression: {
    algorithm: 'llmlingua',
    targetRatio: 0.6
  }
})` }) }), _jsx("h3", { children: "Embeddings Too Slow" }), _jsxs("p", { children: [_jsx("strong", { children: "Issue:" }), " Slow document processing"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Batch embeddings
import { RequestBatcher } from '@clarity-chat/react/utils'

const batcher = new RequestBatcher({
  maxBatchSize: 100,
  maxWaitMs: 50,
  executor: async (texts) => {
    return await openai.embeddings.create({
      input: texts,
      model: 'text-embedding-3-small'
    })
  }
})

// Cache embeddings
import { SmartCache } from '@clarity-chat/react/utils'

const cache = new SmartCache({ maxSize: 10000, ttl: 86400000 })
const embedding = await cache.getOrSet(\`emb:\${text}\`, () => getEmbedding(text))` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "UI & Styling Issues" }), _jsx("h3", { children: "Dark Mode Not Working" }), _jsxs("p", { children: [_jsx("strong", { children: "Issue:" }), " Theme doesn't switch properly"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Wrap app with ThemeProvider
import { ThemeProvider } from '@clarity-chat/react'

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <YourApp />
    </ThemeProvider>
  )
}

// Or use next-themes
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system">
  <ChatWindow />
</ThemeProvider>` }) }), _jsx("h3", { children: "Markdown Not Rendering" }), _jsxs("p", { children: [_jsx("strong", { children: "Issue:" }), " Code blocks or formatting broken"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Install remark/rehype plugins
npm install remark-gfm rehype-highlight

// Configure in ChatWindow
<ChatWindow
  messages={messages}
  markdownOptions={{
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight]
  }}
/>` }) }), _jsx("h3", { children: "Mobile Layout Issues" }), _jsxs("p", { children: [_jsx("strong", { children: "Issue:" }), " Components not responsive"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Use responsive container
<div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
  <ChatWindow
    messages={messages}
    layout="mobile"  // or "desktop", "auto"
  />
</div>

// Adjust on keyboard open
import { useMobileKeyboard } from '@clarity-chat/react/hooks'

const { isKeyboardOpen, keyboardHeight } = useMobileKeyboard()

<div style={{ paddingBottom: isKeyboardOpen ? keyboardHeight : 0 }}>
  <ChatWindow />
</div>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Build & Deployment Issues" }), _jsx("h3", { children: "Build Failures" }), _jsxs("p", { children: [_jsx("strong", { children: "Error:" }), " Build fails in production"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Fix server/client imports
// Mark client components
'use client'

// Check for window/document in SSR
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  // Browser-only code
}

// Use dynamic imports with ssr: false
import dynamic from 'next/dynamic'

const ChatWindow = dynamic(
  () => import('@clarity-chat/react').then(mod => mod.ChatWindow),
  { ssr: false }
)` }) }), _jsx("h3", { children: "Environment Variables Not Working" }), _jsxs("p", { children: [_jsx("strong", { children: "Issue:" }), " Env vars undefined in production"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Vercel:" }), " Add in dashboard \u2192 Settings \u2192 Environment Variables"] }), _jsxs("li", { children: [_jsx("strong", { children: "Netlify:" }), " Site Settings \u2192 Environment \u2192 Environment Variables"] }), _jsxs("li", { children: ["Prefix client vars: ", _jsx("code", { children: "NEXT_PUBLIC_" })] }), _jsx("li", { children: "Rebuild after adding variables" })] }), _jsx("h3", { children: "Serverless Function Timeouts" }), _jsxs("p", { children: [_jsx("strong", { children: "Error:" }), " Function execution timed out"] }), _jsx("p", { children: _jsx("strong", { children: "Solutions:" }) }), _jsx("pre", { children: _jsx("code", { children: `// Increase timeout (Vercel)
// vercel.json
{
  "functions": {
    "app/api/chat/route.ts": {
      "maxDuration": 60
    }
  }
}

// Stream early to keep connection alive
export async function POST(req: Request) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send keepalive
      controller.enqueue(encoder.encode(': keepalive\\n\\n'))
      
      // Your logic
    }
  })
  
  return new Response(stream)
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Debugging Strategies" }), _jsx("h3", { children: "Enable Verbose Logging" }), _jsx("pre", { children: _jsx("code", { children: `// Log all events
import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  onDebug={(event, data) => {
    console.log(\`[DEBUG] \${event}\`, data)
  }}
  debug={true}
/>` }) }), _jsx("h3", { children: "Network Inspection" }), _jsx("p", { children: "Use browser DevTools Network tab:" }), _jsxs("ul", { children: [_jsx("li", { children: "Check request/response headers" }), _jsx("li", { children: "Verify payload size" }), _jsx("li", { children: "Monitor streaming chunks" }), _jsx("li", { children: "Inspect error responses" })] }), _jsx("h3", { children: "React DevTools" }), _jsx("p", { children: "Install React DevTools extension:" }), _jsxs("ul", { children: [_jsx("li", { children: "Inspect component props" }), _jsx("li", { children: "Check state updates" }), _jsx("li", { children: "Profile render performance" }), _jsx("li", { children: "Find unnecessary re-renders" })] }), _jsx("h3", { children: "Error Boundaries" }), _jsx("pre", { children: _jsx("code", { children: `import { ErrorBoundary } from '@clarity-chat/react'

<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  )}
  onError={(error, errorInfo) => {
    console.error('Caught error:', error, errorInfo)
    // Send to error tracking service
  }}
>
  <ChatWindow />
</ErrorBoundary>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Common Gotchas" }), _jsx(Callout, { type: "warning", title: "Important", children: "These are easy mistakes that can cause hard-to-debug issues." }), _jsx("h3", { children: "1. Mutating State Directly" }), _jsx("pre", { children: _jsx("code", { children: `// ❌ Don't
messages.push(newMessage)
setMessages(messages)

// ✅ Do
setMessages([...messages, newMessage])` }) }), _jsx("h3", { children: "2. Missing Dependencies" }), _jsx("pre", { children: _jsx("code", { children: `// ❌ Don't
useEffect(() => {
  fetchData(userId)
}, [])  // Missing userId

// ✅ Do
useEffect(() => {
  fetchData(userId)
}, [userId])` }) }), _jsx("h3", { children: "3. Async State Updates" }), _jsx("pre", { children: _jsx("code", { children: `// ❌ Don't
const handleSend = async (message) => {
  setIsLoading(true)
  await sendMessage(message)
  setIsLoading(false)  // May not update if unmounted
}

// ✅ Do
const handleSend = async (message) => {
  setIsLoading(true)
  try {
    await sendMessage(message)
  } finally {
    setIsLoading(false)
  }
}` }) }), _jsx("h3", { children: "4. Memory Leaks in Streams" }), _jsx("pre", { children: _jsx("code", { children: `// ❌ Don't
const stream = getStream()
stream.on('data', handleData)
// Forgot to clean up

// ✅ Do
useEffect(() => {
  const stream = getStream()
  stream.on('data', handleData)
  
  return () => {
    stream.off('data', handleData)
    stream.close()
  }
}, [])` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Getting Help" }), _jsxs(Callout, { type: "info", title: "Support Channels", children: ["\u2022 GitHub Issues: ", _jsx("a", { href: "https://github.com/clarity-chat/issues", children: "Report bugs" }), _jsx("br", {}), "\u2022 Discord: ", _jsx("a", { href: "https://discord.gg/clarity-chat", children: "Community chat" }), _jsx("br", {}), "\u2022 Stack Overflow: Tag ", _jsx("code", { children: "[clarity-chat]" }), _jsx("br", {}), "\u2022 Email: support@clarity-chat.dev"] }), _jsx("h3", { children: "Before Asking for Help" }), _jsxs("ul", { children: [_jsx("li", { children: "Search existing issues on GitHub" }), _jsx("li", { children: "Check this troubleshooting guide" }), _jsx("li", { children: "Try the minimal reproduction example" }), _jsx("li", { children: "Include version numbers and error logs" }), _jsx("li", { children: "Share a CodeSandbox or repo if possible" })] }), _jsx("h3", { children: "Creating a Bug Report" }), _jsx("pre", { children: _jsx("code", { children: `## Description
Brief description of the issue

## Reproduction
1. Step 1
2. Step 2
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- @clarity-chat/react: 2.1.0
- Next.js: 14.0.0
- Node.js: 20.0.0
- Browser: Chrome 120

## Code Sample
\`\`\`tsx
// Minimal reproduction
\`\`\`` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/learn/quick-start", className: "docs-card", children: [_jsx("h3", { children: "Quick Start" }), _jsx("p", { children: "Getting started guide" })] }), _jsxs("a", { href: "/reference/api/configuration", className: "docs-card", children: [_jsx("h3", { children: "Configuration" }), _jsx("p", { children: "All configuration options" })] }), _jsxs("a", { href: "/guides/performance", className: "docs-card", children: [_jsx("h3", { children: "Performance" }), _jsx("p", { children: "Optimization techniques" })] }), _jsxs("a", { href: "/cookbook", className: "docs-card", children: [_jsx("h3", { children: "Cookbook" }), _jsx("p", { children: "Common patterns and recipes" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map