/**
 * Full working code examples for each demo
 * These are complete, copy-paste-ready examples that users can use as starters
 */

export const fullExamples: Record<string, string> = {
  'zero-to-chat': `// Full Working Example: Zero to Chat
// Install: npm install @clarity-chat/react

import { ClarityChat } from '@clarity-chat/react'

export default function App() {
  return (
    <ClarityChat
      api="/api/chat"
      placeholder="Ask me anything..."
      theme="auto"
      showTimestamps
      enableMarkdown
      onMessageSent={(msg) => logger.debug('Sent:', msg)}
      onError={(error) => console.error('Chat error:', error)}
    />
  )
}

// API Route (app/api/chat/route.ts)
// import { createClarityStream } from '@clarity-chat/server'
//
// export async function POST(req: Request) {
//   const { messages } = await req.json()
//   return createClarityStream({
//     provider: 'openai',
//     messages,
//     model: 'gpt-4o',
//   })
// }`,

  'provider-hotswap': `// Full Working Example: Provider Hot-Swap
// Install: npm install @clarity-chat/react

'use client'
import { useState } from 'react'
import { ClarityChat, useProvider } from '@clarity-chat/react'

const providers = ['openai', 'anthropic', 'google'] as const
type Provider = typeof providers[number]

export default function ProviderHotswap() {
  const [provider, setProvider] = useState<Provider>('openai')

  return (
    <div className="flex flex-col gap-4">
      {/* Provider Selector */}
      <div className="flex gap-2">
        {providers.map((p) => (
          <button
            key={p}
            onClick={() => setProvider(p)}
            className={\`px-4 py-2 rounded \${
              provider === p ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }\`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Chat with selected provider */}
      <ClarityChat
        api="/api/chat"
        provider={provider}
        // Conversation persists across provider switches!
      />
    </div>
  )
}

// API Route (app/api/chat/route.ts)
// import { createClarityStream } from '@clarity-chat/server'
//
// export async function POST(req: Request) {
//   const { messages, provider } = await req.json()
//   return createClarityStream({
//     provider, // 'openai' | 'anthropic' | 'google'
//     messages,
//   })
// }`,

  'streaming-states': `// Full Working Example: Streaming States
// Install: npm install @clarity-chat/react

'use client'
import { ClarityChat, useStreamingState } from '@clarity-chat/react'

export default function StreamingDemo() {
  const { state, phase } = useStreamingState()

  return (
    <div className="flex flex-col gap-4">
      {/* State Indicator */}
      <div className="flex items-center gap-2">
        <span className={\`w-3 h-3 rounded-full \${
          phase === 'idle' ? 'bg-gray-400' :
          phase === 'sending' ? 'bg-blue-400' :
          phase === 'thinking' ? 'bg-purple-400 animate-pulse' :
          phase === 'streaming' ? 'bg-green-400 animate-pulse' :
          'bg-emerald-400'
        }\`} />
        <span className="text-sm capitalize">{phase}</span>
      </div>

      <ClarityChat
        api="/api/chat"
        enableStreaming
        streamingOptions={{
          onStart: () => logger.debug('Stream started'),
          onToken: (token) => logger.debug('Token:', token),
          onComplete: () => logger.debug('Stream complete'),
        }}
      />
    </div>
  )
}`,

  'token-visualizer': `// Full Working Example: Token Visualizer
// Install: npm install @clarity-chat/react

'use client'
import { ClarityChat, useTokenUsage } from '@clarity-chat/react'

export default function TokenVisualizerDemo() {
  const { usage, cost, contextWindow } = useTokenUsage()

  const contextPercentage = (usage.total / contextWindow) * 100

  return (
    <div className="flex flex-col gap-4">
      {/* Token Dashboard */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg">
        <div>
          <div className="text-sm text-gray-500">Input Tokens</div>
          <div className="text-2xl font-bold">{usage.input.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Output Tokens</div>
          <div className="text-2xl font-bold">{usage.output.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Est. Cost</div>
          <div className="text-2xl font-bold">\${cost.toFixed(4)}</div>
        </div>
      </div>

      {/* Context Window Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: \`\${Math.min(contextPercentage, 100)}%\` }}
        />
      </div>
      <p className="text-sm text-gray-500">
        {contextPercentage.toFixed(1)}% of context window used
      </p>

      <ClarityChat
        api="/api/chat"
        enableTokenTracking
        maxTokens={128000}
      />
    </div>
  )
}`,

  'memory-context': `// Full Working Example: Memory & Context
// Install: npm install @clarity-chat/react

'use client'
import { ClarityChat, useMemory, MemoryPanel } from '@clarity-chat/react'

export default function MemoryDemo() {
  const {
    memories,
    addMemory,
    removeMemory,
    activeMemories
  } = useMemory()

  return (
    <div className="flex gap-4">
      {/* Memory Panel */}
      <div className="w-64 shrink-0">
        <MemoryPanel
          memories={memories}
          activeMemories={activeMemories}
          onRemove={removeMemory}
        />

        <button
          onClick={() => addMemory({
            type: 'fact',
            content: 'User prefers dark mode',
            source: 'manual'
          })}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Memory
        </button>
      </div>

      {/* Chat with memory */}
      <div className="flex-1">
        <ClarityChat
          api="/api/chat"
          enableMemory
          memoryConfig={{
            maxItems: 100,
            persistence: 'session',
            autoExtract: true,
          }}
        />
      </div>
    </div>
  )
}`,

  'accessibility-audit': `// Full Working Example: Accessible Chat
// Install: npm install @clarity-chat/react

'use client'
import { ClarityChat } from '@clarity-chat/react'

export default function AccessibleChatDemo() {
  return (
    <ClarityChat
      api="/api/chat"

      // Accessibility features (all enabled by default)
      a11y={{
        // Screen reader announcements
        announceNewMessages: true,
        announceTyping: true,

        // Keyboard navigation
        enableKeyboardShortcuts: true,
        trapFocus: true,

        // Visual accessibility
        highContrastMode: 'auto',
        reducedMotion: 'auto',
        fontSize: 'medium',

        // ARIA labels
        ariaLabels: {
          chatRegion: 'Chat conversation',
          messageList: 'Message history',
          inputField: 'Type your message',
          sendButton: 'Send message',
        }
      }}

      // Keyboard shortcuts
      shortcuts={{
        send: 'Enter',
        newLine: 'Shift+Enter',
        focusInput: '/',
        scrollToBottom: 'Escape',
      }}
    />
  )
}`,

  'bundle-comparison': `// Bundle Size Comparison
// @clarity-chat/react is optimized for minimal bundle impact

// Tree-shakeable imports - only import what you use:
import { ClarityChat } from '@clarity-chat/react' // ~12KB gzipped
import { useAutoScroll } from '@clarity-chat/react' // ~1KB
import { TypingIndicator } from '@clarity-chat/react' // ~2KB

// Full bundle with all features:
// import * from '@clarity-chat/react' // ~45KB gzipped

// Compared to alternatives:
// - stream-chat-react: ~180KB
// - react-chat-widget: ~85KB
// - chatscope: ~120KB

export default function App() {
  return (
    <ClarityChat
      api="/api/chat"
      // Only load features you need
      enableMarkdown // +3KB
      enableCodeHighlight // +8KB
      enableFileUpload // +5KB
    />
  )
}`,

  'tool-calling': `// Full Working Example: Tool Calling / Agent Demo
// Install: npm install @clarity-chat/react

'use client'
import { ClarityChat, ToolPanel } from '@clarity-chat/react'

// Define your tools
const tools = [
  {
    name: 'search',
    description: 'Search the web for information',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' }
      },
      required: ['query']
    },
    // Custom renderer for tool results
    render: (result) => (
      <div className="space-y-2">
        {result.results.map((r, i) => (
          <a key={i} href={r.url} className="block p-2 bg-gray-100 rounded">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-gray-500">{r.snippet}</div>
          </a>
        ))}
      </div>
    )
  },
  {
    name: 'calculator',
    description: 'Perform mathematical calculations',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'Math expression' }
      },
      required: ['expression']
    }
  }
]

export default function ToolCallingDemo() {
  return (
    <div className="flex gap-4">
      <div className="w-48">
        <ToolPanel tools={tools} />
      </div>

      <ClarityChat
        api="/api/chat"
        tools={tools}
        onToolCall={async (name, args) => {
          // Execute tool and return result
          const result = await executeToolOnServer(name, args)
          return result
        }}
      />
    </div>
  )
}`,

  'customization-playground': `// Full Working Example: Customization
// Install: npm install @clarity-chat/react

'use client'
import { ClarityChat, ThemeProvider } from '@clarity-chat/react'

// Custom theme
const customTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f3f4f6',
    text: '#1f2937',
    textSecondary: '#6b7280',
  },
  borderRadius: {
    message: '1rem',
    input: '0.5rem',
    button: '0.5rem',
  },
  spacing: {
    messagePadding: '1rem',
    messageGap: '0.75rem',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem',
    },
  },
}

export default function CustomizedChat() {
  return (
    <ThemeProvider theme={customTheme}>
      <ClarityChat
        api="/api/chat"

        // UI Options
        showTimestamps
        showAvatars
        enableMarkdown
        messageStyle="bubbles" // 'bubbles' | 'flat' | 'minimal'

        // Custom components
        components={{
          Avatar: ({ sender }) => (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          ),
          TypingIndicator: () => (
            <div className="flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          ),
        }}
      />
    </ThemeProvider>
  )
}`,

  'enterprise-production': `// Full Working Example: Enterprise Production Setup
// Install: npm install @clarity-chat/react @clarity-chat/server

// Client Component
'use client'
import {
  ClarityChat,
  ErrorBoundary,
  useMetrics,
  useAuditLog
} from '@clarity-chat/react'

export default function EnterpriseChat({ tenantId, userId }) {
  const metrics = useMetrics()
  const { log } = useAuditLog()

  return (
    <ErrorBoundary
      fallback={<ChatErrorFallback />}
      onError={(error) => log('chat_error', { error: error.message })}
    >
      <ClarityChat
        api="/api/chat"

        // Multi-tenancy
        tenant={tenantId}
        user={userId}

        // Security
        csrfProtection
        rateLimiting={{ maxRequests: 100, windowMs: 60000 }}

        // Reliability
        autoReconnect
        reconnectAttempts={5}
        reconnectDelay={1000}

        // Observability
        onMetrics={(data) => metrics.track(data)}
        onAuditEvent={(event) => log(event.type, event.data)}

        // Error handling
        onError={(error) => {
          console.error('Chat error:', error)
          // Send to error tracking service
        }}

        // Connection events
        onConnect={() => log('connected')}
        onDisconnect={() => log('disconnected')}
        onReconnect={() => log('reconnected')}
      />
    </ErrorBoundary>
  )
}

// Server: Multi-tenant API Route
// app/api/chat/route.ts
/*
import { createClarityStream, withTenant, withRateLimit } from '@clarity-chat/server'

export async function POST(req: Request) {
  const { messages, tenant, user } = await req.json()

  // Verify tenant access
  await verifyTenantAccess(tenant, user)

  // Apply rate limiting per tenant
  await withRateLimit(tenant, { maxRequests: 1000, windowMs: 60000 })

  return createClarityStream({
    provider: 'openai',
    messages,
    // Tenant-specific configuration
    ...getTenantConfig(tenant),
  })
}
*/`,
}

/**
 * Get the full example code for a demo
 * @param demoId - The demo identifier
 * @returns The full example code or undefined if not found
 */
export const getFullExample = (demoId: string): string | undefined =>
  fullExamples[demoId]

/**
 * Get all available demo IDs
 */
export const getDemoIds = (): string[] => Object.keys(fullExamples)
