/**
 * Component Demo Harness - COMPREHENSIVE ALL-PACKAGES TEST
 *
 * This file tests EVERY export from ALL @clarity-chat packages:
 * - @clarity-chat/react (37 components, 25 hooks, utilities)
 * - @clarity-chat/primitives (80+ UI components)
 * - @clarity-chat/memory (services, summarizers, stores)
 * - @clarity-chat/error-handling (boundaries, hooks, utilities)
 * - @clarity-chat/token-optimization (counters, chunkers, security)
 * - @clarity-chat/utils (formatters, validators, errors)
 *
 * @see /DEMO_HARNESS_TEST_PLAN.md for the full test matrix
 * @see /DEMO_HARNESS_TEST_LOG.md for test results
 */

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  Suspense,
  useMemo,
} from 'react'

// ============================================================================
// @clarity-chat/primitives - ALL EXPORTS
// ============================================================================
import {
  // Buttons
  Button,
  buttonVariants,

  // Dialogs
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,

  // Dropdown
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,

  // Popover
  Popover,
  PopoverTrigger,
  PopoverContent,

  // Tooltip
  Tooltip,
  SimpleTooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,

  // Drawer
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,

  // Form elements
  Checkbox,
  Input,
  Label,
  Textarea,

  // Layout
  Avatar,
  Badge,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ScrollArea,

  // Icons
  LoadingIcon,
  SuccessIcon,
  ErrorIcon,
  CloseIcon,
  CharacterCount,

  // Kbd
  Kbd,
  useFormattedShortcut,

  // Error message
  ErrorMessage,

  // Compound Input
  InputCompound,
  InputRoot,
  InputLabel,
  InputField,
  InputError,
  InputHelper,

  // Hooks
  useRippleEffect,
  useBodyScrollLock,
  useReducedMotion as usePrimitivesReducedMotion,
  useControllableState,
  useComposedRefs,
  useMagnetic,

  // Utils (cn imported from @clarity-chat/react to avoid duplicate)
  generateAriaId,
  announce,
  Keys,
  isKey,

  // Animation presets
  durations,
  springPresets,
  fadeVariants,
  scaleVariants,
  slideUpVariants,
  popVariants,

  // A11y
  A11yProvider,
  useA11y,
} from '@clarity-chat/primitives'

// ============================================================================
// @clarity-chat/error-handling - ALL EXPORTS
// ============================================================================
import {
  // Error classes (imported as types to avoid runtime issues)
  EnhancedErrorBoundary,
  ChatErrorBoundary,

  // Hooks
  useErrorHandler,
  useAsyncError,
  useErrorRecovery,
  useErrorToast,
  useEnhancedErrorHandler,
  useStreamingError,
  useFocusManagement,
  useScreenReaderAnnounce,
  useHighContrastMode,
  useColorContrast,
  useKeyboardNavigation,

  // Analytics
  ErrorAnalyticsProvider,
  useErrorAnalytics,

  // Components
  ErrorDisplay,
  RetryCountdown,
  ToastProvider as ErrorToastProvider,
  useToast as useErrorToastHook,

  // Circuit breaker
  usePersistentCircuitBreaker,

  // Reset strategies
  useResetStrategies,
  useNetworkStatus,

  // Provider detection
  detectProviderError,
} from '@clarity-chat/error-handling'

// ============================================================================
// @clarity-chat/token-optimization - ALL EXPORTS
// ============================================================================
import {
  // Security
  TokenSecurityManager,

  // Quality
  QualityGate,

  // Cost
  CostAwareOptimizer,

  // Caching
  AdvancedSemanticCache,

  // Tokenizers
  AccurateTokenCounter,

  // Chunking
  TextChunker,
  ChunkingStrategy,
} from '@clarity-chat/token-optimization'

// ============================================================================
// @clarity-chat/memory - ALL EXPORTS
// ============================================================================
import {
  // Factory
  clarityMemory,

  // Service
  MemoryService,

  // Summarizers
  LLMSummarizer,
  OpenAISummarizer,
  AnthropicSummarizer,

  // Scoring
  ImportanceScorer,

  // Decay
  DecayManager,
  createDecayManager,
} from '@clarity-chat/memory'

// ============================================================================
// @clarity-chat/utils - ALL EXPORTS
// ============================================================================
import {
  // Format
  formatBytes,
  formatDuration,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  truncate,

  // Cache
  LRUCache,
  TTLCache,
  memoize,
  memoizeAsync,

  // Logger
  LogLevel,
  configureLogger,
  getLogger,

  // Errors
  ClarityError,
  ValidationError,
  APIKeyMissingError,
  APIRateLimitError,

  // Async
  debounce,
  throttle,
  retry,
  timeout,
  sleep,

  // Validation
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isDefined,
  isNonEmptyString,
  assertDefined,
  isValidEmail,
  isValidUrl,
  isValidJSON,
  parseJSON,
  hasKey,
  pick,
  omit,

  // Strict validation
  isStrictString,
  strictAssertDefined,

  // Performance
  PerformanceMonitor,
  measurePerformance,

  // Config
  createConfigManager,
  validateConfig,

  // Error handler
  UnifiedErrorHandler,
  isRetryableError,
  formatErrorForDisplay,
} from '@clarity-chat/utils'

// === Core Components ===
import {
  // Chat Components
  ChatInput,
  ChatWindow,
  FloatingChatWidget,
  MessageList,

  // Message Components
  StreamingMessage,
  ThinkingIndicator,
  TypingIndicator,

  // AI Components
  Citation,
  EnhancedMarkdownRenderer,
  CodeBlock,
  StreamingCodeBlock,
  EnhancedCodeBlock,

  // Feedback Components
  NetworkStatus,

  // Token Components
  TokenCounter,

  // Export Components
  ExportDialog,

  // Search Components
  MessageSearch,
  MessageSearchWithSuspense,

  // Prompt Components
  FollowUpSuggestions,
  PromptSuggestions,

  // Message Components
  CitationCard,

  // Input Components
  VoiceInput,

  // UI Components
  EmptyChatState,

  // Toast System
  ToastProvider,
  ToastContainer,
  useToast,

  // Providers
  ThemeProvider,
  TokenBudgetProvider,
  LicenseProvider,
  LicenseGate,
  Watermark,
  MemoryProvider,

  // === Hooks ===
  useAutoScroll,
  useTokenTracker,
  useTheme,
  useTokenBudget,
  useKeyboardShortcuts,
  useCommandPalette,
  useClipboard,
  useLocalStorage,
  useRetryWithBackoff,
  useThrottledCallback,
  useReducedMotion,
  useVoiceInput,
  useStreaming,
  useFocusTrap,
  useFocusRestoration,

  // License Hooks
  useLicenseStatus,
  useIsLicensed,
  useHasPlan,
  useLicenseInfo,

  // API-dependent hooks (now testable with mock)
  useClarityChat,

  // Utilities
  cn,

  // Animation utilities
  createFadeVariant,
  createSlideVariant,
  createScaleVariant,
  createPulseAnimation,

  // Memory context
  useMemoryContext,

  // Main component
  ClarityChatApp,
} from '@clarity-chat/react'

// Advanced features (structured output)
import { useClarityObject } from '@clarity-chat/react/advanced'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Simple message factory helpers (inline since they're not in public API)
function createUserMessage(content: string) {
  return {
    id: `user-${Date.now()}-${Math.random()}`,
    role: 'user' as const,
    content,
  }
}

function createAssistantMessage(content: string) {
  return {
    id: `assistant-${Date.now()}-${Math.random()}`,
    role: 'assistant' as const,
    content,
  }
}

// Type guard helpers (inline since they're not in public API)
function isUserMessage(message: any): boolean {
  return message?.role === 'user'
}

function isAssistantMessage(message: any): boolean {
  return message?.role === 'assistant'
}

function hasTextContent(message: any): boolean {
  return (
    typeof message?.content === 'string' ||
    (Array.isArray(message?.content) &&
      message.content.some((part: any) => part.type === 'text'))
  )
}

function extractTextContent(message: any): string {
  if (typeof message?.content === 'string') {
    return message.content
  }
  if (Array.isArray(message?.content)) {
    return message.content
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join('')
  }
  return ''
}

// ============================================================================
// MOCK API SETUP
// ============================================================================

// Mock API response generator for testing without real API keys
const mockResponses: Record<string, string> = {
  hello:
    'Hello! I am a mock AI assistant. This response is simulated for testing the useClarityChat hook without requiring a real API key.',
  help: 'I can help you test the Clarity Chat components! Try asking me about React, TypeScript, or any other topic. All responses are mocked for demonstration purposes.',
  react:
    '# React Overview\n\nReact is a JavaScript library for building user interfaces.\n\n## Key Concepts\n\n1. **Components** - Reusable UI pieces\n2. **Props** - Data passed to components\n3. **State** - Component-managed data\n4. **Hooks** - Functional component features\n\n```tsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}\n```',
  default:
    'Thank you for your message! This is a mock response demonstrating that the useClarityChat hook works correctly with simulated API calls. The streaming effect you see is also simulated.',
}

// Mock object generation responses
const mockObjectResponses: Record<string, object> = {
  products: {
    products: [
      {
        name: 'Gaming Laptop Pro',
        price: 1299.99,
        description: 'High-performance gaming laptop with RTX 4070',
        inStock: true,
      },
      {
        name: 'Ultrabook Elite',
        price: 999.99,
        description: 'Lightweight ultrabook for professionals',
        inStock: true,
      },
      {
        name: 'Budget Laptop',
        price: 499.99,
        description: 'Affordable laptop for everyday use',
        inStock: false,
      },
    ],
  },
  user: {
    user: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      preferences: { theme: 'dark', notifications: true },
    },
  },
  analysis: {
    sentiment: 'positive',
    confidence: 0.92,
    keywords: ['react', 'typescript', 'testing'],
    summary: 'The text discusses modern web development practices.',
  },
}

function getMockResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('hello') || lower.includes('hi'))
    return mockResponses.hello
  if (lower.includes('help')) return mockResponses.help
  if (lower.includes('react')) return mockResponses.react
  return mockResponses.default
}

function getMockObjectResponse(input: any): object {
  const query = (input?.query || input?.prompt || '').toLowerCase()
  if (query.includes('product')) return mockObjectResponses.products
  if (query.includes('user')) return mockObjectResponses.user
  return mockObjectResponses.analysis
}

// Install mock fetch globally
const originalFetch = globalThis.fetch
globalThis.fetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url

  // Mock /api/chat endpoints (streaming)
  if (url.includes('/api/chat')) {
    const body = JSON.parse((init?.body as string) || '{}')
    const messages = body.messages || []
    const lastMessage = messages[messages.length - 1]
    const responseText = getMockResponse(lastMessage?.content || '')

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Stream character by character for realistic effect
        for (const char of responseText) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: char })}\n\n`)
          )
          await new Promise((r) => setTimeout(r, 15))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    })
  }

  // Mock /api/generate-object endpoints (JSON response)
  if (url.includes('/api/generate-object') || url.includes('/api/generate')) {
    const body = JSON.parse((init?.body as string) || '{}')
    const responseObject = getMockObjectResponse(body)

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800))

    return new Response(JSON.stringify(responseObject), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Fall through to original fetch for other URLs
  return originalFetch(input, init)
}

// Import styles
import '@clarity-chat/react/styles.css'

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string
  chatId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  updatedAt: Date
  status: 'sent' | 'pending' | 'error'
}

// ============================================================================
// NAVIGATION
// ============================================================================

type Section =
  | 'overview'
  | 'api-chat'
  | 'core-chat'
  | 'ai-components'
  | 'feedback'
  | 'token-export'
  | 'search-prompts'
  | 'providers'
  | 'hooks'
  | 'primitives'
  | 'utils'
  | 'token-opt'
  | 'error-handling'
  | 'memory'

const sections: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'api-chat', label: 'API Chat (Mock)' },
  { id: 'core-chat', label: 'Core Chat' },
  { id: 'ai-components', label: 'AI Components' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'token-export', label: 'Token & Export' },
  { id: 'search-prompts', label: 'Search & Prompts' },
  { id: 'providers', label: 'Providers' },
  { id: 'hooks', label: 'Hooks' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'utils', label: 'Utils' },
  { id: 'token-opt', label: 'Token Opt' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'memory', label: 'Memory' },
]

// ============================================================================
// MOCK DATA
// ============================================================================

const sampleMessages: Message[] = [
  {
    id: '1',
    chatId: 'demo',
    role: 'user',
    content: 'Hello! Can you help me understand React hooks?',
    createdAt: new Date(Date.now() - 60000),
    updatedAt: new Date(Date.now() - 60000),
    status: 'sent',
  },
  {
    id: '2',
    chatId: 'demo',
    role: 'assistant',
    content: `# React Hooks Overview

React Hooks are functions that let you "hook into" React state and lifecycle features from function components.

## Common Hooks

1. **useState** - State management
2. **useEffect** - Side effects
3. **useContext** - Context consumption
4. **useRef** - Mutable references

\`\`\`typescript
const [count, setCount] = useState(0);

useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

> Hooks can only be called at the top level of a function component.`,
    createdAt: new Date(Date.now() - 30000),
    updatedAt: new Date(Date.now() - 30000),
    status: 'sent',
  },
]

const sampleMarkdown = `
# Markdown Demo

This is a **bold** and *italic* text with \`inline code\`.

## Code Block

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

## Table

| Feature | Status |
|---------|--------|
| Tables | Supported |
| Lists | Supported |
| Links | [Supported](https://example.com) |

## Task List

- [x] Completed task
- [ ] Pending task
`

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function OverviewSection() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Component Demo Harness</h2>
        <p className="text-muted-foreground">
          This harness validates all Clarity Chat components and hooks from the
          public API. Navigate through sections to test each component.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">37</div>
            <div className="text-sm text-muted-foreground">Components</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">25</div>
            <div className="text-sm text-muted-foreground">Hooks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">7</div>
            <div className="text-sm text-muted-foreground">Providers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">9</div>
            <div className="text-sm text-muted-foreground">Sections</div>
          </div>
        </div>
      </Card>

      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => toast.success('Success toast works!', 'Toast Test')}
        >
          Test Success Toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error('Error toast works!', 'Error Test')}
        >
          Test Error Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.info('Info toast works!', 'Info Test')}
        >
          Test Info Toast
        </Button>
        <Button
          variant="ghost"
          onClick={() => toast.warning('Warning toast works!', 'Warning Test')}
        >
          Test Warning Toast
        </Button>
      </div>
    </div>
  )
}

function ApiChatSection() {
  const toast = useToast()
  const [inputValue, setInputValue] = useState('')

  // Use the useClarityChat hook with mock API
  const { messages, append, isLoading, error, stop, reload, setMessages } =
    useClarityChat({
      api: '/api/chat',
    })

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return

    const content = inputValue
    setInputValue('')

    try {
      await append({
        role: 'user',
        content,
      })
    } catch (err) {
      toast.error('Failed to send message', 'Error')
    }
  }, [inputValue, isLoading, append, toast])

  const handleClear = useCallback(() => {
    setMessages([])
    toast.info('Conversation cleared', 'Info')
  }, [setMessages, toast])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">API Chat Components (Mock)</h2>
        <p className="text-muted-foreground">
          This section tests the API-dependent hooks and components using a mock
          fetch that simulates streaming responses. No real API key required!
        </p>
      </div>

      {/* useClarityChat Demo */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">useClarityChat Hook</h3>
          <div className="flex gap-2">
            <Badge variant={isLoading ? 'warning' : 'success'}>
              {isLoading ? 'Streaming...' : 'Ready'}
            </Badge>
            <Badge variant="secondary">{messages.length} messages</Badge>
          </div>
        </div>

        {/* Messages Display */}
        <div className="border rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto mb-4 bg-muted/20">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">
                Try saying "hello", "help", or ask about "react"!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'p-3 rounded-lg',
                    msg.role === 'user'
                      ? 'bg-primary/10 ml-12'
                      : 'bg-background mr-12 border'
                  )}
                >
                  <div className="text-xs font-semibold mb-1 text-muted-foreground">
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">
                    {typeof msg.content === 'string'
                      ? msg.content
                      : JSON.stringify(msg.content)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="p-3 rounded-lg bg-background mr-12 border">
                  <div className="text-xs font-semibold mb-1 text-muted-foreground">
                    Assistant
                  </div>
                  <TypingIndicator />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message... (try 'hello', 'help', or 'react')"
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
          >
            Send
          </Button>
          {isLoading && (
            <Button variant="outline" onClick={stop}>
              Stop
            </Button>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear Chat
          </Button>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => reload()}>
              Reload Last
            </Button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            Error: {error.message}
          </div>
        )}

        {/* Hook Info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Hook Return Values:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <code>messages</code>: {messages.length} items
            </div>
            <div>
              <code>isLoading</code>: {String(isLoading)}
            </div>
            <div>
              <code>error</code>: {error ? error.message : 'null'}
            </div>
            <div>
              <code>append</code>: function
            </div>
            <div>
              <code>stop</code>: function
            </div>
            <div>
              <code>reload</code>: function
            </div>
            <div>
              <code>setMessages</code>: function
            </div>
          </div>
        </div>
      </Card>

      {/* Memory Integration Demo */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">
          Memory Integration (MemoryProvider)
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          The useClarityChat hook supports memory integration for context-aware
          conversations. This demo shows the MemoryProvider wrapping the chat
          components.
        </p>
        <div className="p-4 bg-muted/30 rounded-lg">
          <code className="text-xs">
            {`<MemoryProvider config={{ maxTokens: 10000 }}>
  <YourChatComponent />
</MemoryProvider>`}
          </code>
        </div>
        <div className="mt-4 flex gap-2">
          <Badge variant="info">Memory Strategy: sliding-window</Badge>
          <Badge variant="secondary">Max Tokens: 10000</Badge>
        </div>
      </Card>

      {/* API Info */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Mock API Details</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This demo uses a mock fetch that intercepts <code>/api/chat</code>{' '}
          requests and returns streaming responses. Try these keywords for
          different responses:
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-muted/30 rounded">
            <p className="font-medium">"hello" or "hi"</p>
            <p className="text-xs text-muted-foreground">Greeting response</p>
          </div>
          <div className="p-3 bg-muted/30 rounded">
            <p className="font-medium">"help"</p>
            <p className="text-xs text-muted-foreground">Help information</p>
          </div>
          <div className="p-3 bg-muted/30 rounded">
            <p className="font-medium">"react"</p>
            <p className="text-xs text-muted-foreground">Markdown with code</p>
          </div>
        </div>
      </Card>

      {/* useClarityObject Demo */}
      <UseClarityObjectDemo />

      {/* Type Guards Demo */}
      <TypeGuardsDemo />

      {/* ClarityChat Component Demo */}
      <ClarityChatDemo />

      {/* Recipe Components Demo - Commented out (components not in public API) */}
      {/* <RecipeComponentsDemo /> */}

      {/* useHeadlessChat Demo - Commented out (hook not in public API) */}
      {/* <UseHeadlessChatDemo /> */}
    </div>
  )
}

// useClarityObject structured output demo
interface Product {
  name: string
  price: number
  description: string
  inStock: boolean
}

function UseClarityObjectDemo() {
  const [query, setQuery] = useState('products')
  const { object, run, isLoading, error, reset } = useClarityObject<{
    products: Product[]
  }>({
    api: '/api/generate-object',
    initialInput: { query },
  })

  const handleGenerate = async () => {
    try {
      await run({ query })
    } catch (err) {
      console.error('Error generating:', err)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">useClarityObject Hook</h3>
        <Badge variant={isLoading ? 'warning' : 'success'}>
          {isLoading ? 'Generating...' : 'Ready'}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Generate structured JSON objects from AI. Try "products", "user", or any
        query.
      </p>

      <div className="flex gap-2 mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter query (e.g., products, user)"
          className="flex-1"
        />
        <Button onClick={handleGenerate} disabled={isLoading}>
          Generate
        </Button>
        {object && (
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm mb-4">
          Error: {error.message}
        </div>
      )}

      {object && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs font-medium mb-2">Generated Object:</p>
          <pre className="text-xs overflow-auto max-h-60">
            {JSON.stringify(object, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Hook Return Values:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <code>object</code>: {object ? 'Object' : 'null'}
          </div>
          <div>
            <code>isLoading</code>: {String(isLoading)}
          </div>
          <div>
            <code>error</code>: {error ? error.message : 'null'}
          </div>
          <div>
            <code>run</code>: function
          </div>
          <div>
            <code>reset</code>: function
          </div>
        </div>
      </div>
    </Card>
  )
}

// Type guards demonstration
function TypeGuardsDemo() {
  const [testMessages] = useState([
    createUserMessage('Hello, how are you?'),
    createAssistantMessage('I am doing well, thank you!'),
    { id: '3', role: 'system' as const, content: 'System message' },
  ])

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Type Guards & Utilities</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Testing type guard functions for message validation.
      </p>

      <div className="space-y-4">
        {testMessages.map((msg, i) => (
          <div key={i} className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{msg.role}</Badge>
              <span className="text-xs text-muted-foreground">
                {typeof msg.content === 'string'
                  ? msg.content.slice(0, 30)
                  : '...'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                className={cn(
                  'p-1 rounded',
                  isUserMessage(msg)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-muted'
                )}
              >
                isUserMessage: {String(isUserMessage(msg))}
              </div>
              <div
                className={cn(
                  'p-1 rounded',
                  isAssistantMessage(msg)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-muted'
                )}
              >
                isAssistantMessage: {String(isAssistantMessage(msg))}
              </div>
              <div
                className={cn(
                  'p-1 rounded',
                  hasTextContent(msg)
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-muted'
                )}
              >
                hasTextContent: {String(hasTextContent(msg))}
              </div>
              <div className="p-1 rounded bg-muted">
                extractTextContent: "{extractTextContent(msg).slice(0, 20)}..."
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs">
        <p className="font-medium mb-1">Available Type Guards:</p>
        <code>
          isUserMessage, isAssistantMessage, hasTextContent, extractTextContent
        </code>
      </div>
    </Card>
  )
}

// ClarityChat drop-in component demo
function ClarityChatDemo() {
  const [showChat, setShowChat] = useState(false)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">ClarityChat Component</h3>
        <Badge variant="info">Drop-in Component</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        The main drop-in component that provides a complete chat interface. This
        is the recommended way to add AI chat to your app.
      </p>

      <Button onClick={() => setShowChat(!showChat)} className="mb-4">
        {showChat ? 'Hide ClarityChat' : 'Show ClarityChat'}
      </Button>

      {showChat && (
        <div className="border rounded-lg overflow-hidden h-[400px]">
          <ClarityChatApp
            api="/api/chat"
          />
        </div>
      )}

      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <p className="text-xs font-medium mb-2">Usage:</p>
        <code className="text-xs">
          {`<ClarityChatApp api="/api/chat" />`}
        </code>
      </div>
    </Card>
  )
}


// Main App Component
export default function App() {
  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Clarity Chat Components Demo</h1>
      
      {/* Overview Section */}
      <OverviewSection />
      
      {/* API Demos */}
      <div className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">API Demos</h2>
        <ApiChatSection />
      </div>
      
      {/* Component Demos */}
      <div className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">Component Demos</h2>
        
        {/* useClarityObject Demo */}
        <UseClarityObjectDemo />
        
        {/* Type Guards Demo */}
        <TypeGuardsDemo />
        
        {/* ClarityChat Component Demo */}
        <ClarityChatDemo />
      </div>
    </div>
  )
}
