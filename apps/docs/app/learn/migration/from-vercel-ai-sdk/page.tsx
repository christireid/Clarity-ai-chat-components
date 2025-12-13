import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Migrate from Vercel AI SDK - Clarity Chat',
  description: 'Step-by-step guide to migrating from Vercel AI SDK to Clarity Chat.',
}

export default function MigrateFromVercelAISDKPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Migration</span>
        <h1>Migrate from Vercel AI SDK</h1>
        <p className="docs-lead">
          Comprehensive guide to migrating your Vercel AI SDK application to Clarity Chat with improved UI and features.
        </p>
      </div>

      <section className="docs-section">
        <h2>Why Migrate?</h2>
        <Callout type="info" title="Clarity Chat Advantages">
          • **Production-ready UI components** out of the box<br/>
          • **Enterprise features**: SSO, RBAC, audit logging<br/>
          • **Token optimization**: Built-in compression and caching<br/>
          • **Better DX**: Comprehensive TypeScript support<br/>
          • **Advanced memory**: Semantic search and RAG<br/>
          • **Performance**: Optimized rendering and virtualization
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Key Differences</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Vercel AI SDK</th>
              <th>Clarity Chat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UI Components</td>
              <td>Build your own</td>
              <td>50+ production-ready components</td>
            </tr>
            <tr>
              <td>Streaming</td>
              <td>useChat hook</td>
              <td>useChat + ChatWindow + streaming components</td>
            </tr>
            <tr>
              <td>Memory</td>
              <td>Manual implementation</td>
              <td>Built-in semantic memory & RAG</td>
            </tr>
            <tr>
              <td>Token Management</td>
              <td>Manual counting</td>
              <td>Auto optimization & tracking</td>
            </tr>
            <tr>
              <td>Theming</td>
              <td>Custom CSS</td>
              <td>Theme system + presets</td>
            </tr>
            <tr>
              <td>Enterprise</td>
              <td>Not included</td>
              <td>SSO, RBAC, audit logs</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="docs-section">
        <h2>Migration Steps</h2>

        <h3>1. Install Clarity Chat</h3>
        <pre><code>{`npm install @clarity-chat/react
# Keep ai package for now if needed
# npm install ai`}</code></pre>

        <h3>2. Update Imports</h3>
        <p><strong>Before (Vercel AI SDK):</strong></p>
        <pre><code>{`import { useChat } from 'ai/react'
import { Message } from 'ai'`}</code></pre>

        <p><strong>After (Clarity Chat):</strong></p>
        <pre><code>{`import { useChat, ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/react/types'`}</code></pre>

        <h3>3. Replace Custom UI with Components</h3>
        <p><strong>Before:</strong></p>
        <pre><code>{`export default function Chat() {
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
}`}</code></pre>

        <p><strong>After:</strong></p>
        <pre><code>{`export default function Chat() {
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
}`}</code></pre>

        <Callout type="success" title="Result">
          You get a production-ready chat UI with streaming, markdown rendering,
          code highlighting, file upload, and more - all with 10 lines of code!
        </Callout>
      </section>

      <section className="docs-section">
        <h2>API Route Migration</h2>

        <h3>OpenAI Streaming</h3>
        <p><strong>Before (Vercel AI SDK):</strong></p>
        <pre><code>{`// app/api/chat/route.ts
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
}`}</code></pre>

        <p><strong>After (Clarity Chat):</strong></p>
        <pre><code>{`// app/api/chat/route.ts
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
}`}</code></pre>

        <Callout type="info" title="Benefits">
          Clarity Chat's handler includes memory management, token tracking,
          error handling, and safety checks out of the box.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Feature Upgrades</h2>

        <h3>Add Memory & RAG</h3>
        <pre><code>{`import { ChatWindow, MemoryProvider } from '@clarity-chat/react'
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
}`}</code></pre>

        <h3>Add File Upload</h3>
        <pre><code>{`<ChatWindow
  messages={messages}
  onSendMessage={sendMessage}
  enableFileUpload={true}
  acceptedFileTypes={['.pdf', '.txt', '.md']}
  maxFileSize={10 * 1024 * 1024}  // 10MB
  onFileUpload={async (file) => {
    // Process file
    await processDocument(file)
  }}
/>`}</code></pre>

        <h3>Add Custom Theming</h3>
        <pre><code>{`import { ThemeProvider } from '@clarity-chat/react'

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
</ThemeProvider>`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Hook Comparison</h2>

        <h3>useChat</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Vercel AI SDK</th>
              <th>Clarity Chat</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>messages</code></td>
              <td><code>messages</code></td>
              <td>Same API</td>
            </tr>
            <tr>
              <td><code>input</code></td>
              <td><code>input</code></td>
              <td>Same API</td>
            </tr>
            <tr>
              <td><code>handleInputChange</code></td>
              <td><code>handleInputChange</code></td>
              <td>Same API</td>
            </tr>
            <tr>
              <td><code>handleSubmit</code></td>
              <td><code>handleSubmit</code></td>
              <td>Same API</td>
            </tr>
            <tr>
              <td><code>isLoading</code></td>
              <td><code>isLoading</code></td>
              <td>Same API</td>
            </tr>
            <tr>
              <td>N/A</td>
              <td><code>tokenCount</code></td>
              <td>New: Track usage</td>
            </tr>
            <tr>
              <td>N/A</td>
              <td><code>error</code></td>
              <td>New: Error state</td>
            </tr>
            <tr>
              <td>N/A</td>
              <td><code>retry</code></td>
              <td>New: Retry failed requests</td>
            </tr>
          </tbody>
        </table>

        <Callout type="tip" title="Drop-in Replacement">
          Clarity Chat's useChat is designed to be a drop-in replacement for
          Vercel AI SDK's useChat, with additional features.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Advanced Migrations</h2>

        <h3>Tool/Function Calling</h3>
        <p><strong>Before:</strong></p>
        <pre><code>{`const { messages } = useChat({
  experimental_onFunctionCall: async ({ messages, functionCall }) => {
    if (functionCall.name === 'get_weather') {
      const weather = await getWeather(functionCall.arguments.location)
      return { result: weather }
    }
  }
})`}</code></pre>

        <p><strong>After:</strong></p>
        <pre><code>{`import { useAgent } from '@clarity-chat/react/hooks'

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
})`}</code></pre>

        <h3>Custom Message Renderer</h3>
        <p><strong>Before:</strong></p>
        <pre><code>{`{messages.map(m => (
  <div key={m.id}>
    {m.content}
  </div>
))}`}</code></pre>

        <p><strong>After:</strong></p>
        <pre><code>{`<ChatWindow
  messages={messages}
  renderMessage={(message) => (
    <CustomMessage
      content={message.content}
      role={message.role}
      metadata={message.metadata}
    />
  )}
/>`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Gradual Migration Strategy</h2>
        <Callout type="warning" title="Recommended Approach">
          Migrate incrementally to minimize risk and downtime.
        </Callout>

        <h3>Phase 1: Install & Test</h3>
        <ul>
          <li>Install Clarity Chat alongside Vercel AI SDK</li>
          <li>Create a new route to test Clarity Chat</li>
          <li>Verify streaming and core functionality</li>
        </ul>

        <h3>Phase 2: Migrate UI</h3>
        <ul>
          <li>Replace custom chat components with <code>ChatWindow</code></li>
          <li>Keep existing API routes</li>
          <li>Test thoroughly in staging</li>
        </ul>

        <h3>Phase 3: Migrate API</h3>
        <ul>
          <li>Gradually replace API routes with Clarity handlers</li>
          <li>Add memory and optimization features</li>
          <li>Monitor performance and usage</li>
        </ul>

        <h3>Phase 4: Add Features</h3>
        <ul>
          <li>Enable file upload</li>
          <li>Add RAG capabilities</li>
          <li>Implement token optimization</li>
          <li>Set up monitoring</li>
        </ul>

        <h3>Phase 5: Remove Vercel AI SDK</h3>
        <ul>
          <li>Once fully migrated, remove Vercel AI SDK dependency</li>
          <li>Clean up unused imports and code</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Compatibility Layer</h2>
        <p>Use both libraries during migration:</p>
        <pre><code>{`// utils/chat-adapter.ts
import { useChat as useVercelChat } from 'ai/react'
import { useChat as useClarityChat } from '@clarity-chat/react'

export function useChat(config: ChatConfig) {
  // Use feature flag to switch
  if (process.env.NEXT_PUBLIC_USE_CLARITY === 'true') {
    return useClarityChat(config)
  }
  return useVercelChat(config)
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Breaking Changes</h2>
        <Callout type="warning" title="Important">
          Be aware of these differences during migration.
        </Callout>

        <h3>1. Message Format</h3>
        <pre><code>{`// Vercel AI SDK
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
}`}</code></pre>

        <h3>2. Error Handling</h3>
        <pre><code>{`// Vercel AI SDK
const { error } = useChat()

// Clarity Chat (enhanced)
const { error, retry, resetError } = useChat({
  onError: (error) => {
    console.error('Chat error:', error)
    // Custom error handling
  }
})`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Cost Comparison</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Vercel AI SDK</th>
              <th>Clarity Chat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Package</td>
              <td>Free (MIT)</td>
              <td>Free (MIT) + Pro/Enterprise</td>
            </tr>
            <tr>
              <td>UI Development</td>
              <td>2-4 weeks</td>
              <td>0 days (included)</td>
            </tr>
            <tr>
              <td>Memory/RAG</td>
              <td>Build yourself</td>
              <td>Included</td>
            </tr>
            <tr>
              <td>Enterprise Features</td>
              <td>Build yourself</td>
              <td>$199/mo (Enterprise)</td>
            </tr>
            <tr>
              <td>Support</td>
              <td>Community</td>
              <td>Community + Paid support</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="docs-section">
        <h2>Success Stories</h2>
        <Callout type="success" title="Real Migration">
          "We migrated from Vercel AI SDK to Clarity Chat in 2 days. The production-ready
          components saved us 3 weeks of UI development, and the built-in memory system
          improved our RAG quality by 40%." - CTO, AI Startup
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Migration Checklist</h2>
        <ul className="checklist">
          <li>☐ Install @clarity-chat/react</li>
          <li>☐ Test ChatWindow component in isolation</li>
          <li>☐ Migrate one route/page at a time</li>
          <li>☐ Update API handlers (optional)</li>
          <li>☐ Test streaming functionality</li>
          <li>☐ Verify error handling</li>
          <li>☐ Test file upload (if using)</li>
          <li>☐ Configure theming</li>
          <li>☐ Set up memory/RAG (if needed)</li>
          <li>☐ Deploy to staging</li>
          <li>☐ Run integration tests</li>
          <li>☐ Monitor performance</li>
          <li>☐ Deploy to production</li>
          <li>☐ Remove Vercel AI SDK (when ready)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Need Help?</h2>
        <ul>
          <li>📖 <a href="/learn/quick-start">Quick Start Guide</a></li>
          <li>💬 <a href="https://discord.gg/clarity-chat">Discord Community</a></li>
          <li>📧 Email: migrations@clarity-chat.dev</li>
          <li>🎯 <a href="/contact">Enterprise Migration Support</a></li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/learn/quick-start" className="docs-card">
            <h3>Quick Start</h3>
            <p>Get started with Clarity Chat</p>
          </a>
          <a href="/learn/tutorials/building-first-chatbot" className="docs-card">
            <h3>Build First Chatbot</h3>
            <p>30-minute tutorial</p>
          </a>
          <a href="/cookbook" className="docs-card">
            <h3>Cookbook</h3>
            <p>Common patterns and recipes</p>
          </a>
          <a href="/examples" className="docs-card">
            <h3>Examples</h3>
            <p>Complete example applications</p>
          </a>
        </div>
      </section>
    </div>
  )
}
