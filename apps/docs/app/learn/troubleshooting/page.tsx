import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Troubleshooting - Clarity Chat',
  description: 'Common issues and solutions for Clarity Chat applications.',
}

export default function TroubleshootingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Troubleshooting</h1>
        <p className="docs-lead">
          Solutions to common issues, error messages, and debugging strategies.
        </p>
      </div>

      <section className="docs-section">
        <h2>Quick Diagnostics</h2>
        <Callout type="info" title="Debug Mode">
          Enable debug mode to see detailed logs:
          <br />
          <code>NEXT_PUBLIC_DEBUG=true npm run dev</code>
        </Callout>
        <pre>
          <code>{`// Add to your app
import { enableDebugMode } from '@clarity-chat/react'

if (process.env.NODE_ENV === 'development') {
  enableDebugMode({
    verbose: true,
    logRequests: true,
    logTokens: true
  })
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Installation & Setup Issues</h2>

        <h3>Module Not Found</h3>
        <p>
          <strong>Error:</strong>{' '}
          <code>Cannot find module '@clarity-chat/react'</code>
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>
            Verify installation: <code>npm list @clarity-chat/react</code>
          </li>
          <li>
            Clear node_modules:{' '}
            <code>rm -rf node_modules package-lock.json && npm install</code>
          </li>
          <li>Check package.json has correct version</li>
          <li>Restart your dev server</li>
        </ul>

        <h3>Type Errors</h3>
        <p>
          <strong>Error:</strong>{' '}
          <code>Property 'X' does not exist on type...</code>
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>
            Install type definitions:{' '}
            <code>npm install --save-dev @types/node</code>
          </li>
          <li>Ensure TypeScript version ≥ 4.9</li>
          <li>Add to tsconfig.json:</li>
        </ul>
        <pre>
          <code>{`{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "strict": true
  }
}`}</code>
        </pre>

        <h3>CSS Not Loading</h3>
        <p>
          <strong>Issue:</strong> Components appear unstyled
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Import in app/layout.tsx or _app.tsx
import '@clarity-chat/react/styles.css'

// Or use CSS modules
import styles from '@clarity-chat/react/styles.module.css'`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>API & Streaming Issues</h2>

        <h3>Streaming Not Working</h3>
        <p>
          <strong>Issue:</strong> Messages appear all at once instead of
          streaming
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>
            <strong>Vercel:</strong> Enable streaming in vercel.json:
          </li>
        </ul>
        <pre>
          <code>{`{
  "functions": {
    "app/api/chat/route.ts": {
      "maxDuration": 30
    }
  }
}`}</code>
        </pre>
        <ul>
          <li>
            <strong>AWS Lambda:</strong> Use response streaming:
          </li>
        </ul>
        <pre>
          <code>{`// Configure Lambda for streaming
export const handler = awslambda.streamifyResponse(async (event) => {
  // Your streaming code
})`}</code>
        </pre>
        <ul>
          <li>
            <strong>Node.js:</strong> Set proper headers:
          </li>
        </ul>
        <pre>
          <code>{`res.setHeader('Content-Type', 'text/event-stream')
res.setHeader('Cache-Control', 'no-cache')
res.setHeader('Connection', 'keep-alive')`}</code>
        </pre>

        <h3>CORS Errors</h3>
        <p>
          <strong>Error:</strong> <code>Access-Control-Allow-Origin</code>{' '}
          blocked
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// next.config.js
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
}`}</code>
        </pre>

        <h3>Rate Limit Errors</h3>
        <p>
          <strong>Error:</strong> <code>429 Too Many Requests</code>
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`import { RateLimiter } from '@clarity-chat/react/utils'

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
}`}</code>
        </pre>

        <h3>OpenAI API Errors</h3>
        <p>
          <strong>Error:</strong> <code>Invalid API key</code>
        </p>
        <p>
          <strong>Checklist:</strong>
        </p>
        <ul>
          <li>
            Verify key in <code>.env.local</code>:{' '}
            <code>OPENAI_API_KEY=sk-...</code>
          </li>
          <li>Restart dev server after adding env vars</li>
          <li>
            Check API key has credits:{' '}
            <a href="https://platform.openai.com/usage">
              platform.openai.com/usage
            </a>
          </li>
          <li>Verify key permissions (some keys are read-only)</li>
        </ul>

        <p>
          <strong>Error:</strong> <code>Model not found</code>
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>
            Verify model name: <code>gpt-4</code>, <code>gpt-3.5-turbo</code>,
            etc.
          </li>
          <li>
            Check account has access to model (GPT-4 requires special access)
          </li>
          <li>
            Use model aliases: <code>gpt-4-turbo</code> →{' '}
            <code>gpt-4-0125-preview</code>
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Performance Issues</h2>

        <h3>Slow Rendering</h3>
        <p>
          <strong>Issue:</strong> UI feels sluggish during streaming
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Use virtualization for long message lists
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
/>`}</code>
        </pre>

        <h3>Memory Leaks</h3>
        <p>
          <strong>Issue:</strong> Memory usage grows over time
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Clean up event listeners
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
})`}</code>
        </pre>

        <h3>Bundle Size Too Large</h3>
        <p>
          <strong>Issue:</strong> Large JavaScript bundles
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Use dynamic imports
const ChatWindow = dynamic(() => import('@clarity-chat/react').then(mod => mod.ChatWindow))

// Tree-shake unused components
import { ChatWindow } from '@clarity-chat/react/components/chat-window'

// Analyze bundle
npm run build && npx @next/bundle-analyzer`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Memory & Context Issues</h2>

        <h3>Vector Store Errors</h3>
        <p>
          <strong>Error:</strong> <code>Failed to connect to Pinecone</code>
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Verify environment variables
PINECONE_API_KEY=your-key
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=clarity-chat

// Test connection
import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const indexes = await pinecone.listIndexes()
logger.debug('Available indexes:', indexes)`}</code>
        </pre>

        <h3>Context Window Exceeded</h3>
        <p>
          <strong>Error:</strong>{' '}
          <code>This model's maximum context length is...</code>
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`import { useTokenOptimization } from '@clarity-chat/react/hooks'

const { optimizedMessages } = useTokenOptimization(messages, {
  slidingWindow: {
    maxTokens: 4000,  // Leave room for response
    strategy: 'semantic'
  },
  compression: {
    algorithm: 'llmlingua',
    targetRatio: 0.6
  }
})`}</code>
        </pre>

        <h3>Embeddings Too Slow</h3>
        <p>
          <strong>Issue:</strong> Slow document processing
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Batch embeddings
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
const embedding = await cache.getOrSet(\`emb:\${text}\`, () => getEmbedding(text))`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>UI & Styling Issues</h2>

        <h3>Dark Mode Not Working</h3>
        <p>
          <strong>Issue:</strong> Theme doesn't switch properly
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Wrap app with ThemeProvider
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
</ThemeProvider>`}</code>
        </pre>

        <h3>Markdown Not Rendering</h3>
        <p>
          <strong>Issue:</strong> Code blocks or formatting broken
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Install remark/rehype plugins
npm install remark-gfm rehype-highlight

// Configure in ChatWindow
<ChatWindow
  messages={messages}
  markdownOptions={{
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight]
  }}
/>`}</code>
        </pre>

        <h3>Mobile Layout Issues</h3>
        <p>
          <strong>Issue:</strong> Components not responsive
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Use responsive container
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
</div>`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Build & Deployment Issues</h2>

        <h3>Build Failures</h3>
        <p>
          <strong>Error:</strong> Build fails in production
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Fix server/client imports
// Mark client components
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
)`}</code>
        </pre>

        <h3>Environment Variables Not Working</h3>
        <p>
          <strong>Issue:</strong> Env vars undefined in production
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>
            <strong>Vercel:</strong> Add in dashboard → Settings → Environment
            Variables
          </li>
          <li>
            <strong>Netlify:</strong> Site Settings → Environment → Environment
            Variables
          </li>
          <li>
            Prefix client vars: <code>NEXT_PUBLIC_</code>
          </li>
          <li>Rebuild after adding variables</li>
        </ul>

        <h3>Serverless Function Timeouts</h3>
        <p>
          <strong>Error:</strong> Function execution timed out
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <pre>
          <code>{`// Increase timeout (Vercel)
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
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Debugging Strategies</h2>

        <h3>Enable Verbose Logging</h3>
        <pre>
          <code>{`// Log all events
import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  onDebug={(event, data) => {
    logger.debug(\`[DEBUG] \${event}\`, data)
  }}
  debug={true}
/>`}</code>
        </pre>

        <h3>Network Inspection</h3>
        <p>Use browser DevTools Network tab:</p>
        <ul>
          <li>Check request/response headers</li>
          <li>Verify payload size</li>
          <li>Monitor streaming chunks</li>
          <li>Inspect error responses</li>
        </ul>

        <h3>React DevTools</h3>
        <p>Install React DevTools extension:</p>
        <ul>
          <li>Inspect component props</li>
          <li>Check state updates</li>
          <li>Profile render performance</li>
          <li>Find unnecessary re-renders</li>
        </ul>

        <h3>Error Boundaries</h3>
        <pre>
          <code>{`import { ErrorBoundary } from '@clarity-chat/react'

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
</ErrorBoundary>`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Common Gotchas</h2>

        <Callout type="warning" title="Important">
          These are easy mistakes that can cause hard-to-debug issues.
        </Callout>

        <h3>1. Mutating State Directly</h3>
        <pre>
          <code>{`// ❌ Don't
messages.push(newMessage)
setMessages(messages)

// ✅ Do
setMessages([...messages, newMessage])`}</code>
        </pre>

        <h3>2. Missing Dependencies</h3>
        <pre>
          <code>{`// ❌ Don't
useEffect(() => {
  fetchData(userId)
}, [])  // Missing userId

// ✅ Do
useEffect(() => {
  fetchData(userId)
}, [userId])`}</code>
        </pre>

        <h3>3. Async State Updates</h3>
        <pre>
          <code>{`// ❌ Don't
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
}`}</code>
        </pre>

        <h3>4. Memory Leaks in Streams</h3>
        <pre>
          <code>{`// ❌ Don't
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
}, [])`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Getting Help</h2>

        <Callout type="info" title="Support Channels">
          • GitHub Issues:{' '}
          <a href="https://github.com/christireid/Clarity-ai-chat-components/issues">
            Report bugs
          </a>
          <br />• Discord:{' '}
          <a href="https://discord.gg/clarity-chat">Community chat</a>
          <br />• Stack Overflow: Tag <code>[clarity-chat]</code>
          <br />• Email: support@clarity-chat.dev
        </Callout>

        <h3>Before Asking for Help</h3>
        <ul>
          <li>Search existing issues on GitHub</li>
          <li>Check this troubleshooting guide</li>
          <li>Try the minimal reproduction example</li>
          <li>Include version numbers and error logs</li>
          <li>Share a CodeSandbox or repo if possible</li>
        </ul>

        <h3>Creating a Bug Report</h3>
        <pre>
          <code>{`## Description
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
\`\`\``}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/learn/quick-start" className="docs-card">
            <h3>Quick Start</h3>
            <p>Getting started guide</p>
          </a>
          <a href="/reference/api/configuration" className="docs-card">
            <h3>Configuration</h3>
            <p>All configuration options</p>
          </a>
          <a href="/guides/performance" className="docs-card">
            <h3>Performance</h3>
            <p>Optimization techniques</p>
          </a>
          <a href="/cookbook" className="docs-card">
            <h3>Cookbook</h3>
            <p>Common patterns and recipes</p>
          </a>
        </div>
      </section>
    </div>
  )
}
