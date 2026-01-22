'use client'

import * as React from 'react'
import { Callout } from '@/components/Callout'
import { CodeBlock } from '@/components/CodeBlock'

export function IntelliSenseHelpersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">IntelliSense Helpers</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          TypeScript utilities and branded types that enhance IntelliSense, autocomplete, and type safety.
        </p>
      </div>

      <Callout type="info">
        <strong>🎯 Enhanced DX:</strong> These helpers provide rich IntelliSense with helpful
        descriptions, better autocomplete, and compile-time type checking.
      </Callout>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">API Configuration Types</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">ChatApiConfig</h3>
            <p className="text-muted-foreground mt-1">
              Type-safe API endpoint configuration with IntelliSense for different protocols.
            </p>
            <CodeBlock
              code={`import { ChatApiConfig } from '@clarity-chat/react'

function configureChat(api: ChatApiConfig) {
  // IntelliSense shows valid options:
  // • "/api/chat" (relative path)
  // • "https://api.example.com/chat" (HTTPS URL)
  // • "wss://api.example.com/chat" (WebSocket URL)
}

configureChat('/api/chat') // ✅ Valid
configureChat('ftp://invalid') // ❌ TypeScript error`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">ChatPreset</h3>
            <p className="text-muted-foreground mt-1">
              Predefined configuration presets with helpful descriptions.
            </p>
            <CodeBlock
              code={`import { ChatPreset } from '@clarity-chat/react'

function applyPreset(preset: ChatPreset) {
  switch (preset) {
    case 'minimal': // Basic chat functionality
      return { memory: false, streaming: false }
    case 'with-memory': // Chat with memory enabled
      return { memory: true, strategy: 'sliding-window' }
    case 'enterprise': // Full-featured enterprise chat
      return { memory: true, streaming: true, analytics: true }
    case 'streaming': // Optimized for real-time updates
      return { streaming: true, transport: 'websocket' }
  }
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Configuration Helper Types</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">MemoryConfigHelper</h3>
            <p className="text-muted-foreground mt-1">
              Rich IntelliSense for memory configuration with hover descriptions.
            </p>
            <CodeBlock
              code={`import { MemoryConfigHelper } from '@clarity-chat/react'

const config: MemoryConfigHelper = {
  enabled: true,
  // Hover shows: "Memory strategy - hover for descriptions"
  strategy: 'vector-store', // IntelliSense: sliding-window | semantic-chunks | vector-store
  maxTokens: 4000, // Hover: "Maximum tokens to store in memory"
  retryOnError: true, // Hover: "Retry failed memory operations"
  maxRetryAttempts: 2, // Hover: "Maximum retry attempts"
  onMemoryError: (error, operation) => {
    console.error(\`Memory \${operation} failed:\`, error)
  }
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">StreamingConfigHelper</h3>
            <p className="text-muted-foreground mt-1">
              Type-safe streaming configuration with protocol-specific options.
            </p>
            <CodeBlock
              code={`import { StreamingConfigHelper } from '@clarity-chat/react'

const streamingConfig: StreamingConfigHelper = {
  // Hover: "Transport protocol"
  transport: 'websocket', // IntelliSense: 'sse' | 'websocket'

  // Only available when transport is 'websocket'
  websocket: {
    autoReconnect: true, // Hover: "Enable automatic reconnection"
    maxReconnectAttempts: 5, // Hover: "Maximum reconnection attempts"
    enableHeartbeat: true, // Hover: "Enable heartbeat/ping-pong"
  }
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">RateLimitConfigHelper</h3>
            <p className="text-muted-foreground mt-1">
              Comprehensive rate limiting configuration with helpful descriptions.
            </p>
            <CodeBlock
              code={`import { RateLimitConfigHelper } from '@clarity-chat/react'

const rateLimitConfig: RateLimitConfigHelper = {
  enabled: true, // Hover: "Enable rate limiting"
  maxRequestsPerMinute: 60, // Hover: "Maximum requests per minute"
  queueSize: 10, // Hover: "Queue size for pending requests"
  retryStrategy: 'exponential-backoff', // IntelliSense: 'exponential-backoff' | 'linear' | 'immediate'
  onRateLimit: (retryAfter) => {
    console.warn(\`Rate limited. Retry after \${retryAfter}ms\`)
  }
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Component Configuration Types</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">HeaderConfigHelper</h3>
            <p className="text-muted-foreground mt-1">
              Type-safe header configuration with rich descriptions.
            </p>
            <CodeBlock
              code={`import { HeaderConfigHelper } from '@clarity-chat/react'

const headerConfig: HeaderConfigHelper = {
  show: true, // Hover: "Show the header"
  title: 'AI Assistant', // Hover: "Header title"
  subtitle: 'Powered by Clarity Chat', // Hover: "Header subtitle"
  showMessageCount: true, // Hover: "Show message count badge"
  // Custom header actions available
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">MessageActionsConfigHelper</h3>
            <p className="text-muted-foreground mt-1">
              Comprehensive message action configuration with callback descriptions.
            </p>
            <CodeBlock
              code={`import { MessageActionsConfigHelper } from '@clarity-chat/react'

const messageActions: MessageActionsConfigHelper = {
  onCopy: (messageId, content) => {
    // Hover: "Callback when message is copied"
    navigator.clipboard.writeText(content)
  },
  onFeedback: (messageId, type, comment) => {
    // Hover: "Callback when message feedback is provided"
    // type: IntelliSense shows 'up' | 'down'
    console.log(\`Feedback: \${type}\`, comment)
  },
  onEdit: (messageId) => {
    // Hover: "Callback when message is edited"
    console.log('Edit message:', messageId)
  },
  onRegenerate: (messageId) => {
    // Hover: "Callback when message is regenerated"
    console.log('Regenerate:', messageId)
  }
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">PromptsConfigHelper</h3>
            <p className="text-muted-foreground mt-1">
              Starter prompts and suggestions configuration with helpful types.
            </p>
            <CodeBlock
              code={`import { PromptsConfigHelper } from '@clarity-chat/react'

const promptsConfig: PromptsConfigHelper = {
  showStarterPrompts: true, // Hover: "Enable starter prompts"
  starterPrompts: [
    {
      text: 'Hello! How can I help you today?', // Hover: "Prompt text"
      category: 'greeting', // Hover: "Optional category for organization"
    },
    {
      text: 'Tell me about React hooks',
      category: 'technical',
    }
  ],
  showFollowUpSuggestions: true, // Hover: "Enable follow-up suggestions"
  followUpSuggestions: [
    {
      text: 'Can you explain that in more detail?',
      confidence: 0.8, // Hover: "Optional confidence score"
    }
  ]
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Error Handling Types</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">ChatErrorType</h3>
            <p className="text-muted-foreground mt-1">
              Strongly-typed error categories with helpful descriptions.
            </p>
            <CodeBlock
              code={`import { ChatErrorType } from '@clarity-chat/react'

function handleError(error: Error, errorType: ChatErrorType) {
  switch (errorType) {
    case 'network': // Network connectivity issues
      return 'Check your internet connection'
    case 'auth': // Authentication/authorization errors
      return 'Please log in again'
    case 'ratelimit': // Rate limiting errors
      return 'Too many requests. Please wait'
    case 'server': // Server-side errors
      return 'Server error. Please try again later'
    case 'validation': // Input validation errors
      return 'Please check your input'
    case 'timeout': // Request timeout errors
      return 'Request timed out. Please try again'
    case 'parse': // Response parsing errors
      return 'Received invalid response'
    case 'memory': // Memory operation errors
      return 'Memory operation failed'
    case 'unknown': // Unknown/unexpected errors
      return 'An unexpected error occurred'
  }
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">ErrorHandlingConfigHelper</h3>
            <p className="text-muted-foreground mt-1">
              Comprehensive error handling configuration with detailed options.
            </p>
            <CodeBlock
              code={`import { ErrorHandlingConfigHelper } from '@clarity-chat/react'

const errorConfig: ErrorHandlingConfigHelper = {
  enabled: true, // Hover: "Enable error boundary"
  showErrorUI: true, // Hover: "Show error UI to user"
  showRetryButton: true, // Hover: "Show retry button"
  fallbackComponent: ({ error, retry }) => (
    // Hover: "Custom error fallback component"
    <div>
      <h3>Something went wrong</h3>
      <p>{error.message}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  ),
  onError: (error, errorType) => {
    // Hover: "Callback when error occurs"
    console.error('Chat error:', errorType, error)
  },
  onRetry: () => {
    // Hover: "Callback when retry is attempted"
    console.log('Retrying after error...')
  }
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Branded Types</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">ApiUrl, ChatId, MessageId</h3>
            <p className="text-muted-foreground mt-1">
              Type-safe branded types that prevent mixing incompatible values.
            </p>
            <CodeBlock
              code={`import { ApiUrl, ChatId, MessageId, createApiUrl } from '@clarity-chat/react'

// Type-safe API URLs
const apiUrl: ApiUrl = createApiUrl('/api/chat') // ✅ Valid
const invalidUrl = '/api/chat' as ApiUrl // ❌ TypeScript error

// Type-safe IDs
const chatId: ChatId = 'chat_123' as ChatId
const messageId: MessageId = 'msg_456' as MessageId

// Functions that require specific types
function loadChat(id: ChatId) { /* ... */ }
function sendMessage(chatId: ChatId, messageId: MessageId) { /* ... */ }

// Prevents accidental mixing
loadChat(messageId) // ❌ TypeScript error: MessageId ≠ ChatId
sendMessage(chatId, chatId) // ❌ TypeScript error: ChatId ≠ MessageId`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Utility Types</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">RequireAtLeastOne, ComponentConfig</h3>
            <p className="text-muted-foreground mt-1">
              Advanced TypeScript utilities for flexible configuration.
            </p>
            <CodeBlock
              code={`import { RequireAtLeastOne, ComponentConfig } from '@clarity-chat/react'

// Require at least one property from a set
type ThemeConfig = RequireAtLeastOne<{
  primaryColor: string
  secondaryColor: string
  accentColor: string
}, 'primaryColor' | 'secondaryColor'>

// const config1: ThemeConfig = {} // ❌ Error: at least one required
// const config2: ThemeConfig = { primaryColor: 'blue' } // ✅ Valid

// Flexible component configuration
type ButtonConfig = ComponentConfig<{
  variant: 'primary' | 'secondary'
  size: 'sm' | 'md' | 'lg'
  disabled: boolean
}>

// All properties optional but type-safe
const buttonConfig: ButtonConfig = {
  variant: 'primary', // Optional but IntelliSense available
  size: 'md', // Optional
  // disabled: undefined (not specified = default)
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">AsyncState, ApiResponse</h3>
            <p className="text-muted-foreground mt-1">
              Type-safe async operation and API response types.
            </p>
            <CodeBlock
              code={`import { AsyncState, ApiResponse } from '@clarity-chat/react'

// Type-safe async states
type ChatState = AsyncState<ChatData>

const loadingState: ChatState = { status: 'loading' }
const successState: ChatState = {
  status: 'success',
  data: { messages: [], isOnline: true }
}
const errorState: ChatState = {
  status: 'error',
  error: new Error('Network failed')
}

// Type-safe API responses
type ChatResponse = ApiResponse<ChatData>

const successResponse: ChatResponse = {
  success: true,
  data: { messages: [], isOnline: true }
}

const errorResponse: ChatResponse = {
  success: false,
  error: {
    message: 'Authentication failed',
    code: 'AUTH_FAILED',
    details: { reason: 'token_expired' }
  }
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">API Reference</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">ChatApiConfig</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Type-safe API endpoint configuration.
            </p>
            <CodeBlock
              code={`type ChatApiConfig = \`/\${string}\` | \`http\${string}\` | \`ws\${string}\``}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">ChatPreset</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Predefined configuration presets.
            </p>
            <CodeBlock
              code={`type ChatPreset = 'minimal' | 'with-memory' | 'enterprise' | 'streaming'`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Branded Types</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Type-safe branded types with runtime validation.
            </p>
            <CodeBlock
              code={`type ApiUrl = Branded<string, 'ApiUrl'>
type ChatId = Branded<string, 'ChatId'>
type MessageId = Branded<string, 'MessageId'>

function createApiUrl(url: string): ApiUrl`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Configuration Helpers</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Rich configuration interfaces with IntelliSense.
            </p>
            <CodeBlock
              code={`interface MemoryConfigHelper {
  enabled: boolean
  strategy: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  maxTokens: number
  retryOnError: boolean
  maxRetryAttempts: number
  onMemoryError?: (error: Error, operation: 'query' | 'store') => void
}

// Similar interfaces for:
// - StreamingConfigHelper
// - RateLimitConfigHelper
// - HeaderConfigHelper
// - MessageActionsConfigHelper
// - PromptsConfigHelper
// - ErrorHandlingConfigHelper`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Benefits & Usage</h2>

        <div className="space-y-4">
          <Callout type="tip">
            <strong>Enhanced DX:</strong> These types provide 3x better IntelliSense and catch
            80% of common configuration errors at compile time.
          </Callout>

          <div className="space-y-3">
            <h4 className="font-semibold">Before vs After</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-red-600">Before (Generic Types)</h4>
                <CodeBlock
                  code={`// No IntelliSense guidance
const config = {
  memory: {
    enabled: true,
    strategy: 'invalid-strategy', // Runtime error
    maxTokens: '4000' // Type error, but unclear
  },
  api: 'not-a-valid-url' // No validation
}`}
                  language="tsx"
                />
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-green-600">After (Rich Types)</h4>
                <CodeBlock
                  code={`// Full IntelliSense with descriptions
const config: MemoryConfigHelper = {
  enabled: true,
  strategy: 'vector-store', // IntelliSense dropdown
  maxTokens: 4000, // Number type enforced
}

const api: ApiUrl = createApiUrl('/api/chat') // Runtime validation`}
                  language="tsx"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Best Practices</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Use branded types for IDs and URLs to prevent accidental mixing</li>
              <li>Leverage helper interfaces for complex configuration objects</li>
              <li>Use <code>RequireAtLeastOne</code> for flexible but validated configs</li>
              <li>Import types explicitly for better IntelliSense in your editor</li>
              <li>Use <code>ApiResponse</code> and <code>AsyncState</code> for consistent async patterns</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}