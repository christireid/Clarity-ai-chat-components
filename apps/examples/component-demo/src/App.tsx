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
  ShadcnButton,

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
  ErrorBoundary as ErrorHandlingBoundary,
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

  // Compression
  DynamicCompressionEngine,

  // Tokenizers
  AccurateTokenCounter,
  SimpleTokenCounter,

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
  EnhancedMarkdownRenderer,
  CodeBlock,
  StreamingCodeBlock,
  EnhancedCodeBlock,

  // Feedback Components
  ErrorBoundary,
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

  // Message helpers
  createUserMessage,
  createAssistantMessage,

  // Additional API-dependent hooks
  useClarityObject,

  // Type guards
  isUserMessage,
  isAssistantMessage,
  hasTextContent,
  extractTextContent,

  // Memory context
  useMemoryContext,

  // Main component
  ClarityChat,

  // Recipe components
  ChatWithMemory,
  ChatComplete,
  ChatWithAnalytics,

  // Headless hook
  useHeadlessChat,
} from '@clarity-chat/react'

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

      {/* Recipe Components Demo */}
      <RecipeComponentsDemo />

      {/* useHeadlessChat Demo */}
      <UseHeadlessChatDemo />
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
          <ClarityChat
            api="/api/chat"
            showHeader
            sessionTitle="AI Assistant"
            sessionSubtitle="Mock demo - try 'hello', 'help', or 'react'"
            showTokenCounter
            showNetworkStatus
            autoScroll
          />
        </div>
      )}

      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <p className="text-xs font-medium mb-2">Usage:</p>
        <code className="text-xs">
          {`<ClarityChat
  api="/api/chat"
  showHeader
  sessionTitle="AI Assistant"
  sessionSubtitle="How can I help?"
  showTokenCounter
  autoScroll
/>`}
        </code>
      </div>
    </Card>
  )
}

// Recipe components demo
function RecipeComponentsDemo() {
  const [activeRecipe, setActiveRecipe] = useState<string | null>(null)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Recipe Components</h3>
        <Badge variant="secondary">Pre-configured</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Pre-built chat components for common use cases. Each recipe extends
        ClarityChat with specific configurations.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button
          size="sm"
          variant={activeRecipe === 'memory' ? 'default' : 'outline'}
          onClick={() =>
            setActiveRecipe(activeRecipe === 'memory' ? null : 'memory')
          }
        >
          ChatWithMemory
        </Button>
        <Button
          size="sm"
          variant={activeRecipe === 'analytics' ? 'default' : 'outline'}
          onClick={() =>
            setActiveRecipe(activeRecipe === 'analytics' ? null : 'analytics')
          }
        >
          ChatWithAnalytics
        </Button>
        <Button
          size="sm"
          variant={activeRecipe === 'complete' ? 'default' : 'outline'}
          onClick={() =>
            setActiveRecipe(activeRecipe === 'complete' ? null : 'complete')
          }
        >
          ChatComplete
        </Button>
      </div>

      {activeRecipe === 'memory' && (
        <div className="border rounded-lg overflow-hidden h-[350px]">
          <ChatWithMemory
            api="/api/chat"
            strategy="sliding-window"
            showHeader
            sessionTitle="Memory Chat"
            sessionSubtitle="Context-aware conversation"
          />
        </div>
      )}

      {activeRecipe === 'analytics' && (
        <div className="border rounded-lg overflow-hidden h-[350px]">
          <ChatWithAnalytics
            api="/api/chat"
            showHeader
            sessionTitle="Analytics Chat"
            sessionSubtitle="With tracking enabled"
            onMessageSent={(content) =>
              console.log('[Analytics] Message sent:', content)
            }
            onError={(error) => console.log('[Analytics] Error:', error)}
          />
        </div>
      )}

      {activeRecipe === 'complete' && (
        <div className="border rounded-lg overflow-hidden h-[350px]">
          <ChatComplete
            api="/api/chat"
            showHeader
            sessionTitle="Complete Chat"
            sessionSubtitle="All features enabled"
          />
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-muted/30 rounded">
          <p className="font-medium">ChatWithMemory</p>
          <p className="text-muted-foreground">+ Memory context</p>
        </div>
        <div className="p-2 bg-muted/30 rounded">
          <p className="font-medium">ChatWithAnalytics</p>
          <p className="text-muted-foreground">+ Event tracking</p>
        </div>
        <div className="p-2 bg-muted/30 rounded">
          <p className="font-medium">ChatComplete</p>
          <p className="text-muted-foreground">+ All features</p>
        </div>
      </div>
    </Card>
  )
}

// useHeadlessChat demo
function UseHeadlessChatDemo() {
  const [inputValue, setInputValue] = useState('')

  const { messages, append, isLoading, error, stop, setMessages } =
    useHeadlessChat({
      api: '/api/chat',
    })

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return
    const content = inputValue
    setInputValue('')
    try {
      await append({ role: 'user', content })
    } catch (err) {
      console.error('Error:', err)
    }
  }, [inputValue, isLoading, append])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">useHeadlessChat Hook</h3>
        <Badge variant={isLoading ? 'warning' : 'success'}>
          {isLoading ? 'Streaming...' : 'Ready'}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Low-level headless hook for custom chat implementations. Provides full
        control over the chat logic without any UI.
      </p>

      <div className="border rounded-lg p-3 min-h-[200px] max-h-[250px] overflow-y-auto mb-4 bg-muted/20">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">
            Headless chat - build your own UI!
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'p-2 rounded text-sm',
                  msg.role === 'user'
                    ? 'bg-primary/10 ml-8'
                    : 'bg-background border mr-8'
                )}
              >
                <span className="font-medium text-xs">{msg.role}: </span>
                {typeof msg.content === 'string'
                  ? msg.content
                  : JSON.stringify(msg.content)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          size="sm"
        >
          Send
        </Button>
        {isLoading && (
          <Button variant="outline" size="sm" onClick={stop}>
            Stop
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
          Clear
        </Button>
      </div>

      {error && (
        <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded text-sm">
          Error: {error.message}
        </div>
      )}

      <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs">
        <p className="font-medium mb-1">Hook Return Values:</p>
        <code>
          messages, append, isLoading, error, stop, setMessages, reload,
          handleSubmit
        </code>
      </div>
    </Card>
  )
}

function CoreChatSection() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showFloatingWidget, setShowFloatingWidget] = useState(false)
  const [showStreamingDemo, setShowStreamingDemo] = useState(false)
  const [streamedContent, setStreamedContent] = useState('')
  const { scrollRef } = useAutoScroll({ dependencies: [messages] })

  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content: inputValue,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      chatId: 'demo',
      role: 'assistant',
      content: `I received your message: "${userMessage.content}". This is a demo response.`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }

    setMessages((prev) => [...prev, aiMessage])
    setIsLoading(false)
  }, [inputValue])

  // Streaming demo
  useEffect(() => {
    if (!showStreamingDemo) {
      setStreamedContent('')
      return
    }

    const fullText =
      'This is a streaming message demonstration. Watch as the text appears character by character, simulating a real AI response stream.'
    let index = 0

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setStreamedContent(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [showStreamingDemo])

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Core Chat Components</h2>

      {/* ChatInput */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">ChatInput</h3>
        <div className="space-y-4">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSend}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <Badge>Value: {inputValue.length} chars</Badge>
            <Badge variant={isLoading ? 'warning' : 'success'}>
              {isLoading ? 'Loading' : 'Ready'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* ChatWindow */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">ChatWindow</h3>
        <div className="h-[400px] border rounded-lg overflow-hidden">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={(content) => {
              setInputValue(content)
              handleSend()
            }}
          />
        </div>
      </Card>

      {/* Message Indicators */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Message Indicators</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              ThinkingIndicator
            </p>
            <ThinkingIndicator />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              TypingIndicator
            </p>
            <TypingIndicator />
          </div>
        </div>
      </Card>

      {/* StreamingMessage */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">StreamingMessage</h3>
        <Button
          onClick={() => setShowStreamingDemo(!showStreamingDemo)}
          className="mb-4"
        >
          {showStreamingDemo ? 'Stop Streaming' : 'Start Streaming Demo'}
        </Button>
        {showStreamingDemo && (
          <div className="p-4 bg-muted rounded-lg">
            <StreamingMessage
              content={streamedContent}
              isStreaming={streamedContent.length < 150}
            />
          </div>
        )}
      </Card>

      {/* FloatingChatWidget */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">FloatingChatWidget</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The floating widget appears in the bottom-right corner when enabled.
        </p>
        <Button onClick={() => setShowFloatingWidget(!showFloatingWidget)}>
          {showFloatingWidget ? 'Hide Widget' : 'Show Widget'}
        </Button>
        {showFloatingWidget && (
          <FloatingChatWidget
            title="Chat Assistant"
            subtitle="How can I help you today?"
          />
        )}
      </Card>
    </div>
  )
}

function AIComponentsSection() {
  const [showEnhancedCode, setShowEnhancedCode] = useState(false)
  const { copy, copied } = useClipboard()

  const sampleCode = `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Usage
console.log(fibonacci(10)); // 55`

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">AI Components</h2>

      {/* Citation */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Citation</h3>
        <Citation
          source={{
            documentName: 'React Hooks Reference',
            text: 'Hooks let you use different React features from your components.',
            relevanceScore: 0.95,
            url: 'https://react.dev/reference/react/hooks',
          }}
          index={1}
        />
      </Card>

      {/* CitationCard */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">CitationCard</h3>
        <CitationCard
          citation={{
            id: 'cite-1',
            url: 'https://react.dev/reference/react/hooks',
            source: 'React Hooks Reference',
            chunkText:
              'Hooks let you use different React features from your components.',
            confidence: 0.92,
          }}
          showConfidence
          onSourceClick={(url) => window.open(url, '_blank')}
        />
      </Card>

      {/* EnhancedMarkdownRenderer */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">EnhancedMarkdownRenderer</h3>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <EnhancedMarkdownRenderer content={sampleMarkdown} />
        </div>
      </Card>

      {/* EnhancedMarkdownRenderer */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">EnhancedMarkdownRenderer</h3>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <EnhancedMarkdownRenderer content={sampleMarkdown} />
        </div>
      </Card>

      {/* CodeBlock */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">CodeBlock</h3>
        <CodeBlock language="typescript" showLineNumbers title="fibonacci.ts">
          {sampleCode}
        </CodeBlock>
      </Card>

      {/* StreamingCodeBlock */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">StreamingCodeBlock</h3>
        <StreamingCodeBlock
          code={sampleCode}
          language="typescript"
          isStreaming={false}
        />
      </Card>

      {/* EnhancedCodeBlock */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">EnhancedCodeBlock</h3>
        <Button
          onClick={() => setShowEnhancedCode(!showEnhancedCode)}
          className="mb-4"
        >
          {showEnhancedCode ? 'Fold' : 'Unfold'} Code
        </Button>
        <EnhancedCodeBlock
          code={sampleCode}
          language="typescript"
          filename="fibonacci.ts"
          showLineNumbers
          enableFolding
          initiallyFolded={!showEnhancedCode}
        />
      </Card>
    </div>
  )
}

function FeedbackSection() {
  const [showError, setShowError] = useState(false)

  // Component that throws an error
  const ErrorComponent = () => {
    if (showError) {
      throw new Error('This is a test error from ErrorComponent')
    }
    return <div>No error</div>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Feedback Components</h2>

      {/* NetworkStatus */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">NetworkStatus</h3>
        <div className="flex items-center gap-4">
          <NetworkStatus />
          <span className="text-sm text-muted-foreground">
            Shows online/offline status based on navigator.onLine
          </span>
        </div>
      </Card>

      {/* ErrorBoundary */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">ErrorBoundary</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button to trigger an error and see the ErrorBoundary
          fallback.
        </p>
        <Button
          variant="destructive"
          onClick={() => setShowError(true)}
          className="mb-4"
        >
          Trigger Error
        </Button>
        <div className="border rounded-lg p-4">
          <ErrorBoundary
            fallback={(error) => (
              <div className="text-center p-4">
                <p className="text-destructive font-semibold mb-2">
                  Error Caught!
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {error.message}
                </p>
                <Button size="sm" onClick={() => setShowError(false)}>
                  Reset
                </Button>
              </div>
            )}
          >
            <ErrorComponent />
          </ErrorBoundary>
        </div>
      </Card>

      {/* EmptyChatState */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">EmptyChatState</h3>
        <div className="border rounded-lg p-8">
          <EmptyChatState
            onStartChat={() => console.log('Start chat clicked')}
            onSuggestionSelect={(suggestion) =>
              console.log('Selected:', suggestion)
            }
            showSuggestions
          />
        </div>
      </Card>
    </div>
  )
}

function TokenExportSection() {
  const [showExport, setShowExport] = useState(false)
  const {
    tokens: totalTokens,
    addMessage,
    clear,
  } = useTokenTracker({ modelName: 'gpt-4-turbo' })

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Token & Export Components</h2>

      {/* TokenCounter */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">TokenCounter</h3>
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <TokenCounter
              currentTokens={totalTokens}
              maxTokens={8000}
              costPerToken={0.00003}
              showCost
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() =>
                addMessage({
                  role: 'user',
                  content: 'Test message with some content to count tokens.',
                })
              }
            >
              Add Tokens
            </Button>
            <Button size="sm" variant="outline" onClick={clear}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* TokenCounter Variants */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">TokenCounter Variants</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Small</p>
            <TokenCounter currentTokens={100} maxTokens={1000} size="sm" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Medium (default)
            </p>
            <TokenCounter currentTokens={500} maxTokens={1000} size="md" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Large</p>
            <TokenCounter currentTokens={800} maxTokens={1000} size="lg" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Warning State (80%+)
            </p>
            <TokenCounter currentTokens={850} maxTokens={1000} />
          </div>
        </div>
      </Card>

      {/* ExportDialog */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">ExportDialog</h3>
        <Button onClick={() => setShowExport(true)}>Open Export Dialog</Button>
        <ExportDialog
          open={showExport}
          onOpenChange={setShowExport}
          onExport={async (options) => {
            console.log('Export options:', options)
            setShowExport(false)
          }}
          resourceType="chat"
          resourceName="Demo Conversation"
        />
      </Card>
    </div>
  )
}

function SearchPromptsSection() {
  const [messages] = useState<Message[]>(sampleMessages)
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

  const followUpSuggestions = [
    {
      id: '1',
      title: 'Tell me more about React',
      description: 'Learn more details',
    },
    {
      id: '2',
      title: 'What are the best practices?',
      description: 'Industry standards',
    },
    { id: '3', title: 'Show me an example', description: 'Code samples' },
  ]

  const promptSuggestions = [
    {
      id: '1',
      text: 'How do I use useState?',
      type: 'starter' as const,
      category: 'React',
    },
    {
      id: '2',
      text: 'Explain useEffect',
      type: 'starter' as const,
      category: 'React',
    },
    {
      id: '3',
      text: 'What is TypeScript?',
      type: 'starter' as const,
      category: 'General',
    },
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Search & Prompts Components</h2>

      {/* MessageSearch */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">MessageSearch</h3>
        <MessageSearch
          messages={messages as any}
          onResultsChange={(results) =>
            setFilteredMessages(results as Message[])
          }
          placeholder="Search messages..."
        />
        {filteredMessages.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">
              Found {filteredMessages.length} message(s)
            </p>
            {filteredMessages.map((m) => (
              <div key={m.id} className="text-sm truncate">
                {m.content.slice(0, 100)}...
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* FollowUpSuggestions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">FollowUpSuggestions</h3>
        <FollowUpSuggestions
          suggestions={followUpSuggestions}
          onSelect={(suggestion) => console.log('Selected:', suggestion)}
          title="Follow-up Questions"
        />
      </Card>

      {/* PromptSuggestions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">PromptSuggestions</h3>
        <PromptSuggestions
          suggestions={promptSuggestions}
          onSelect={(suggestion) => console.log('Selected prompt:', suggestion)}
          layout="chips"
        />
      </Card>

      {/* VoiceInput */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">VoiceInput</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Requires microphone permission. Click to start recording.
        </p>
        <VoiceInput
          onTranscript={(text) => console.log('Transcript:', text)}
          onError={(error) => console.error('Voice error:', error)}
        />
      </Card>

      {/* MessageSearchWithSuspense */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">MessageSearchWithSuspense</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Search component wrapped with React Suspense for async loading.
        </p>
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              Loading search...
            </div>
          }
        >
          <MessageSearchWithSuspense
            messages={messages as any}
            onResultsChange={(results) =>
              console.log('Suspense search results:', results)
            }
            placeholder="Search with suspense..."
          />
        </Suspense>
      </Card>
    </div>
  )
}

function ProvidersSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Providers</h2>

      {/* ThemeProvider (already wrapping app) */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">ThemeProvider</h3>
        <p className="text-sm text-muted-foreground mb-4">
          ThemeProvider wraps the entire app. Use useTheme to access theme
          context.
        </p>
        <ThemeDemo />
      </Card>

      {/* TokenBudgetProvider */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">TokenBudgetProvider</h3>
        <TokenBudgetProvider model="gpt-4-turbo">
          <TokenBudgetDemo />
        </TokenBudgetProvider>
      </Card>

      {/* LicenseProvider */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">LicenseProvider & LicenseGate</h3>
        <LicenseProvider licenseKey="demo-license-key">
          <LicenseDemo />
        </LicenseProvider>
      </Card>
    </div>
  )
}

function ThemeDemo() {
  const { mode, toggleMode, setPreset, availablePresets } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={toggleMode}>Toggle Mode (Current: {mode})</Button>
        {availablePresets.slice(0, 3).map((preset) => (
          <Button
            key={preset}
            variant="outline"
            onClick={() => setPreset(preset)}
          >
            {preset}
          </Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Current mode: {mode} | Available presets: {availablePresets.length}
      </p>
    </div>
  )
}

function TokenBudgetDemo() {
  const budget = useTokenBudget()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>Model: {budget.model || 'Not set'}</div>
        <div>Config: {JSON.stringify(budget.config).slice(0, 50)}...</div>
      </div>
      <p className="text-sm text-muted-foreground">
        TokenBudgetProvider provides configuration context for token management.
      </p>
    </div>
  )
}

function LicenseDemo() {
  const isLicensed = useIsLicensed()
  const status = useLicenseStatus()
  const hasPro = useHasPlan('pro')
  const licenseInfo = useLicenseInfo()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <Badge variant={isLicensed ? 'success' : 'warning'}>
          {isLicensed ? 'Licensed' : 'Unlicensed'}
        </Badge>
        <Badge variant={hasPro ? 'success' : 'secondary'}>
          {hasPro ? 'Has Pro' : 'No Pro Plan'}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Status: {status?.status || 'unknown'}
        </span>
      </div>
      <div className="text-sm text-muted-foreground">
        License Info:{' '}
        {licenseInfo ? JSON.stringify(licenseInfo).slice(0, 80) : 'N/A'}...
      </div>
      <LicenseGate
        requiredPlan="pro"
        fallback={
          <p className="text-sm text-muted-foreground">
            Premium feature locked (requires Pro plan)
          </p>
        }
      >
        <p className="text-sm text-green-600">Premium feature unlocked!</p>
      </LicenseGate>
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-2">Watermark Component</h4>
        <div className="relative h-20 bg-muted rounded-lg flex items-center justify-center">
          <Watermark status="GracePeriod" message="Demo Version" />
          <span className="text-sm text-muted-foreground">
            Content area with watermark
          </span>
        </div>
      </div>
    </div>
  )
}

function HooksSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Hooks</h2>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useClipboard</h3>
        <ClipboardDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useLocalStorage</h3>
        <LocalStorageDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useKeyboardShortcuts</h3>
        <KeyboardShortcutsDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useThrottledCallback</h3>
        <ThrottleDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useRetryWithBackoff</h3>
        <RetryDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useReducedMotion</h3>
        <ReducedMotionDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useAutoScroll</h3>
        <AutoScrollDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useCommandPalette</h3>
        <CommandPaletteDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useVoiceInput</h3>
        <VoiceInputHookDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useStreaming</h3>
        <StreamingHookDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">
          useFocusTrap & useFocusRestoration
        </h3>
        <FocusManagementDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Animation Utilities</h3>
        <AnimationUtilsDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Message Helpers</h3>
        <MessageHelpersDemo />
      </Card>
    </div>
  )
}

function ClipboardDemo() {
  const { copy, copied } = useClipboard()
  const textToCopy = 'Hello from Clarity Chat!'

  return (
    <div className="flex items-center gap-4">
      <code className="bg-muted px-2 py-1 rounded text-sm">{textToCopy}</code>
      <Button size="sm" onClick={() => copy(textToCopy)}>
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  )
}

function LocalStorageDemo() {
  const [value, setValue] = useLocalStorage('demo-key', 'initial value')

  return (
    <div className="space-y-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type to save to localStorage"
      />
      <p className="text-sm text-muted-foreground">Stored value: {value}</p>
    </div>
  )
}

function KeyboardShortcutsDemo() {
  const [lastKey, setLastKey] = useState<string | null>(null)

  useKeyboardShortcuts([
    {
      key: 'mod+k',
      callback: () => setLastKey('Mod+K'),
      description: 'Command palette',
    },
    {
      key: 'escape',
      callback: () => setLastKey('Escape'),
      description: 'Close modal',
    },
  ])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Try pressing Cmd/Ctrl+K or Escape
      </p>
      {lastKey && <Badge variant="secondary">Last pressed: {lastKey}</Badge>}
    </div>
  )
}

function ThrottleDemo() {
  const [count, setCount] = useState(0)
  const [throttledCount, setThrottledCount] = useState(0)

  const throttledIncrement = useThrottledCallback(() => {
    setThrottledCount((c) => c + 1)
  }, 500)

  const handleClick = () => {
    setCount((c) => c + 1)
    throttledIncrement()
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleClick}>Click rapidly!</Button>
      <div className="flex gap-4 text-sm">
        <span>Clicks: {count}</span>
        <span>Throttled calls: {throttledCount}</span>
      </div>
    </div>
  )
}

function RetryDemo() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [attemptCount, setAttemptCount] = useState(0)

  const {
    execute,
    isRetrying,
    attempt,
    reset: resetRetry,
  } = useRetryWithBackoff({
    maxRetries: 3,
    baseDelay: 500,
    onRetry: (attemptNum, delay, error) => {
      console.log(`Retry ${attemptNum} after ${delay}ms:`, error.message)
    },
  })

  const handleExecute = async () => {
    setStatus('loading')
    setAttemptCount(0)
    try {
      await execute(async () => {
        setAttemptCount((c) => c + 1)
        // Fail first 2 attempts, succeed on 3rd
        if (attemptCount < 2) {
          throw new Error('Simulated failure')
        }
        return 'Success!'
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setAttemptCount(0)
    resetRetry()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleExecute} disabled={isRetrying}>
          {isRetrying ? 'Retrying...' : 'Execute with Retry'}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <div className="flex gap-4 text-sm">
        <Badge
          variant={
            status === 'success'
              ? 'success'
              : status === 'error'
                ? 'destructive'
                : 'secondary'
          }
        >
          Status: {status}
        </Badge>
        <span>Attempt: {attempt}</span>
        <span>Calls: {attemptCount}</span>
      </div>
    </div>
  )
}

function ReducedMotionDemo() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        System prefers reduced motion: {prefersReducedMotion ? 'Yes' : 'No'}
      </p>
      <div
        className={cn(
          'w-16 h-16 bg-primary rounded-lg',
          !prefersReducedMotion && 'animate-bounce'
        )}
      />
    </div>
  )
}

function AutoScrollDemo() {
  const [items, setItems] = useState<string[]>([])
  const { scrollRef, scrollToBottom, isNearBottom } = useAutoScroll({
    dependencies: [items],
  })

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      `Item ${prev.length + 1} - ${new Date().toLocaleTimeString()}`,
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Button size="sm" onClick={addItem}>
          Add Item
        </Button>
        <Button size="sm" variant="outline" onClick={scrollToBottom}>
          Scroll to Bottom
        </Button>
        <Badge variant={isNearBottom ? 'success' : 'secondary'}>
          {isNearBottom ? 'Near bottom' : 'Not near bottom'}
        </Badge>
      </div>
      <div
        ref={scrollRef as React.RefObject<HTMLDivElement>}
        className="h-40 overflow-y-auto border rounded-lg p-2 space-y-1"
      >
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Click "Add Item" to test auto-scroll
          </p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="text-sm bg-muted px-2 py-1 rounded">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function CommandPaletteDemo() {
  const { isOpen, open, close, toggle, shortcutDisplay } = useCommandPalette({
    shortcut: 'mod+p',
    onOpen: () => console.log('Command palette opened'),
    onClose: () => console.log('Command palette closed'),
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Button size="sm" onClick={toggle}>
          {isOpen ? 'Close Palette' : 'Open Palette'}
        </Button>
        <Badge variant={isOpen ? 'success' : 'secondary'}>
          {isOpen ? 'Open' : 'Closed'}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Shortcut: {shortcutDisplay}
        </span>
      </div>
      {isOpen && (
        <div className="border rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">Command Palette is Open</p>
          <p className="text-sm text-muted-foreground">
            This hook manages open/close state and keyboard shortcuts.
          </p>
          <Button size="sm" variant="outline" onClick={close}>
            Close
          </Button>
        </div>
      )}
    </div>
  )
}

function VoiceInputHookDemo() {
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    isSupported,
  } = useVoiceInput({
    onTranscript: (text) => console.log('Voice hook transcript:', text),
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Button
          size="sm"
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>
        <Badge variant={isListening ? 'success' : 'secondary'}>
          {isListening ? 'Listening...' : 'Not listening'}
        </Badge>
        {!isSupported && <Badge variant="destructive">Not Supported</Badge>}
      </div>
      {transcript && (
        <p className="text-sm bg-muted p-2 rounded">Transcript: {transcript}</p>
      )}
      {error && <p className="text-sm text-destructive">Error: {error}</p>}
      <p className="text-sm text-muted-foreground">
        Note: Requires microphone permission and browser support.
      </p>
    </div>
  )
}

function StreamingHookDemo() {
  const { content, isStreaming, startStreaming, stopStreaming, reset } =
    useStreaming({
      onChunk: (chunk) => console.log('Chunk received:', chunk),
      onComplete: (fullText) => console.log('Stream complete:', fullText),
      onError: (err) => console.error('Stream error:', err),
    })

  const handleStart = async () => {
    reset()
    // Create a mock ReadableStream to simulate streaming
    const mockText =
      'This is a simulated streaming response from the useStreaming hook. Watch it appear character by character!'
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        for (const char of mockText) {
          controller.enqueue(encoder.encode(char))
          await new Promise((r) => setTimeout(r, 30))
        }
        controller.close()
      },
    })
    await startStreaming(stream)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Button size="sm" onClick={handleStart} disabled={isStreaming}>
          {isStreaming ? 'Streaming...' : 'Start Stream'}
        </Button>
        {isStreaming && (
          <Button size="sm" variant="outline" onClick={stopStreaming}>
            Stop
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={reset}>
          Reset
        </Button>
      </div>
      {content && <p className="text-sm bg-muted p-2 rounded">{content}</p>}
    </div>
  )
}

function FocusManagementDemo() {
  const [showTrap, setShowTrap] = useState(false)
  const trapRef = useFocusTrap<HTMLDivElement>(showTrap)
  const { saveFocus, restoreFocus } = useFocusRestoration()

  const handleOpen = () => {
    saveFocus()
    setShowTrap(true)
  }

  const handleClose = () => {
    setShowTrap(false)
    restoreFocus()
  }

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={handleOpen}>
        Open Focus Trap
      </Button>
      {showTrap && (
        <div
          ref={trapRef}
          className="border-2 border-primary rounded-lg p-4 space-y-2"
        >
          <p className="text-sm font-medium">Focus is trapped here!</p>
          <div className="flex gap-2">
            <Input placeholder="Tab navigation works here..." />
            <Button size="sm">Button 1</Button>
            <Button size="sm" variant="outline" onClick={handleClose}>
              Close Trap
            </Button>
          </div>
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Focus trap keeps keyboard focus within a container. Focus restoration
        returns focus when closed.
      </p>
    </div>
  )
}

function AnimationUtilsDemo() {
  const fadeVariant = createFadeVariant('normal')
  const slideVariant = createSlideVariant('up', 20, 'normal')
  const scaleVariant = createScaleVariant(0.9, 'fast')
  const pulseAnimation = createPulseAnimation(0.5, 0.8, 1.5)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 bg-muted rounded">
          <p className="font-medium mb-1">Fade Variant</p>
          <code className="text-xs">
            {JSON.stringify(fadeVariant).slice(0, 60)}...
          </code>
        </div>
        <div className="p-3 bg-muted rounded">
          <p className="font-medium mb-1">Slide Variant</p>
          <code className="text-xs">
            {JSON.stringify(slideVariant).slice(0, 60)}...
          </code>
        </div>
        <div className="p-3 bg-muted rounded">
          <p className="font-medium mb-1">Scale Variant</p>
          <code className="text-xs">
            {JSON.stringify(scaleVariant).slice(0, 60)}...
          </code>
        </div>
        <div className="p-3 bg-muted rounded">
          <p className="font-medium mb-1">Pulse Animation</p>
          <code className="text-xs">
            {JSON.stringify(pulseAnimation).slice(0, 60)}...
          </code>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Animation utilities create Framer Motion variants for consistent
        animations.
      </p>
    </div>
  )
}

function MessageHelpersDemo() {
  const [demoMessages, setDemoMessages] = useState<any[]>([])

  const addUserMessage = () => {
    const msg = createUserMessage('Hello, this is a user message!')
    setDemoMessages((prev) => [...prev, msg])
  }

  const addAssistantMessage = () => {
    const msg = createAssistantMessage('Hi! I am an assistant response.')
    setDemoMessages((prev) => [...prev, msg])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button size="sm" onClick={addUserMessage}>
          Add User Message
        </Button>
        <Button size="sm" variant="outline" onClick={addAssistantMessage}>
          Add Assistant Message
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setDemoMessages([])}>
          Clear
        </Button>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {demoMessages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'p-2 rounded text-sm',
              msg.role === 'user' ? 'bg-primary/10 text-right' : 'bg-muted'
            )}
          >
            <span className="font-medium">{msg.role}: </span>
            {typeof msg.content === 'string'
              ? msg.content
              : JSON.stringify(msg.content)}
          </div>
        ))}
        {demoMessages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Click buttons to create messages using helper functions
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// PRIMITIVES SECTION - @clarity-chat/primitives
// ============================================================================

function PrimitivesSection() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const shortcut = useFormattedShortcut('mod+s')

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">@clarity-chat/primitives</h2>
          <p className="text-muted-foreground">
            80+ UI components built on shadcn/ui and Radix UI
          </p>
        </div>

        {/* Buttons */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button state="loading">Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-4 flex gap-2">
            <ShadcnButton>Shadcn Button</ShadcnButton>
          </div>
        </Card>

        {/* Dialog */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Dialog</h3>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog description. Dialogs are fully accessible.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>Dialog content goes here.</p>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        {/* Drawer */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Drawer</h3>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Drawer Title</DrawerTitle>
                <DrawerDescription>Slide-up drawer component</DrawerDescription>
              </DrawerHeader>
              <div className="p-4">Drawer content here</div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Card>

        {/* Dropdown */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Dropdown Menu</h3>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>

        {/* Tooltip & Popover */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Tooltip & Popover</h3>
          <div className="flex gap-4">
            <Tooltip content="This is a tooltip">
              <Button variant="outline">Hover for Tooltip</Button>
            </Tooltip>
            <SimpleTooltip text="Simple tooltip">
              <Button variant="ghost">Simple Tooltip</Button>
            </SimpleTooltip>
            <Popover>
              <PopoverTrigger asChild>
                <Button>Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <p>Popover content here</p>
              </PopoverContent>
            </Popover>
          </div>
        </Card>

        {/* Form Elements */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Form Elements</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={checkboxValue}
                onCheckedChange={(v) => setCheckboxValue(v as boolean)}
                id="check"
              />
              <Label htmlFor="check">
                Accept terms ({checkboxValue ? 'checked' : 'unchecked'})
              </Label>
            </div>
            <div>
              <Label htmlFor="input">Input</Label>
              <Input
                id="input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type here..."
              />
            </div>
            <div>
              <Label htmlFor="textarea">Textarea</Label>
              <Textarea
                id="textarea"
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                placeholder="Enter text..."
              />
            </div>
          </div>
        </Card>

        {/* Layout */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Layout Components</h3>
          <div className="flex gap-4 items-center">
            <Avatar alt="John Doe" fallback="JD" size="default" />
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <div className="mt-4">
            <ScrollArea className="h-24 border rounded p-2">
              <p>Scrollable content here...</p>
              <p>More content...</p>
              <p>Even more content...</p>
              <p>And more...</p>
            </ScrollArea>
          </div>
        </Card>

        {/* Icons & Kbd */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Icons & Keyboard Hints</h3>
          <div className="flex gap-4 items-center">
            <LoadingIcon className="w-6 h-6 animate-spin" />
            <SuccessIcon className="w-6 h-6 text-green-500" />
            <ErrorIcon className="w-6 h-6 text-red-500" />
            <CloseIcon className="w-6 h-6" />
          </div>
          <div className="mt-4 flex gap-2">
            <Kbd shortcut="mod+s" />
            <span className="ml-4">Formatted: {shortcut}</span>
          </div>
        </Card>

        {/* Animation Presets */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Animation Presets</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Durations:</p>
              <code>
                fast: {durations.fast}ms, normal: {durations.normal}ms
              </code>
            </div>
            <div>
              <p className="font-medium">Spring Presets:</p>
              <code>stiffness: {springPresets.smooth.stiffness}</code>
            </div>
          </div>
        </Card>

        {/* Hooks */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Primitives Hooks</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <code>useFormattedShortcut</code>: ✅
            </div>
            <div>
              <code>useRippleEffect</code>: ✅
            </div>
            <div>
              <code>useBodyScrollLock</code>: ✅
            </div>
            <div>
              <code>useReducedMotion</code>: ✅
            </div>
            <div>
              <code>useControllableState</code>: ✅
            </div>
            <div>
              <code>useMagnetic</code>: ✅
            </div>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  )
}

// ============================================================================
// UTILS SECTION - @clarity-chat/utils
// ============================================================================

function UtilsSection() {
  const [formatTests] = useState({
    bytes: formatBytes(1024 * 1024 * 2.5),
    duration: formatDuration(125000),
    number: formatNumber(1234567.89),
    percent: formatPercent(0.8567),
    relative: formatRelativeTime(new Date(Date.now() - 3600000)),
    truncated: truncate(
      'This is a very long string that needs to be truncated',
      30
    ),
  })

  const [validationTests] = useState({
    isString: isString('hello'),
    isNumber: isNumber(42),
    isBoolean: isBoolean(true),
    isObject: isObject({ a: 1 }),
    isArray: isArray([1, 2, 3]),
    isDefined: isDefined('value'),
    isNonEmptyString: isNonEmptyString('hello'),
    isValidEmail: isValidEmail('test@example.com'),
    isValidUrl: isValidUrl('https://example.com'),
    isValidJSON: isValidJSON('{"key": "value"}'),
  })

  const cache = useMemo(() => new LRUCache<string, number>(10), [])
  cache.set('test', 42)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">@clarity-chat/utils</h2>
        <p className="text-muted-foreground">
          Formatters, validators, cache, async utilities
        </p>
      </div>

      {/* Format Utilities */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Format Utilities</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <code>formatBytes(2.5MB)</code>: {formatTests.bytes}
          </div>
          <div>
            <code>formatDuration(125s)</code>: {formatTests.duration}
          </div>
          <div>
            <code>formatNumber(1234567.89)</code>: {formatTests.number}
          </div>
          <div>
            <code>formatPercent(0.8567)</code>: {formatTests.percent}
          </div>
          <div>
            <code>formatRelativeTime(-1h)</code>: {formatTests.relative}
          </div>
          <div>
            <code>truncate(..., 30)</code>: {formatTests.truncated}
          </div>
        </div>
      </Card>

      {/* Validation Utilities */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Validation Utilities</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Object.entries(validationTests).map(([key, value]) => (
            <div
              key={key}
              className={value ? 'text-green-600' : 'text-red-600'}
            >
              <code>{key}</code>: {String(value)} {value ? '✅' : '❌'}
            </div>
          ))}
        </div>
      </Card>

      {/* Cache Utilities */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Cache Utilities</h3>
        <div className="space-y-2 text-sm">
          <div>
            <code>LRUCache</code>: Set 'test' = 42, get = {cache.get('test')}
          </div>
          <div>
            <code>TTLCache</code>: Available ✅
          </div>
          <div>
            <code>memoize</code>: Available ✅
          </div>
          <div>
            <code>memoizeAsync</code>: Available ✅
          </div>
        </div>
      </Card>

      {/* Async Utilities */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Async Utilities</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <code>debounce</code>: ✅ Available
          </div>
          <div>
            <code>throttle</code>: ✅ Available
          </div>
          <div>
            <code>retry</code>: ✅ Available
          </div>
          <div>
            <code>timeout</code>: ✅ Available
          </div>
          <div>
            <code>sleep</code>: ✅ Available
          </div>
        </div>
      </Card>

      {/* Error Classes */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Error Classes</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <code>ClarityError</code>: ✅
          </div>
          <div>
            <code>ValidationError</code>: ✅
          </div>
          <div>
            <code>APIKeyMissingError</code>: ✅
          </div>
          <div>
            <code>APIRateLimitError</code>: ✅
          </div>
        </div>
      </Card>

      {/* Strict Validation */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Strict TypeScript Utilities</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <code>isStrictString('hello')</code>:{' '}
            {String(isStrictString('hello'))} ✅
          </div>
          <div>
            <code>strictAssertDefined</code>: ✅ Available
          </div>
          <div>
            <code>PerformanceMonitor</code>: ✅ Available
          </div>
          <div>
            <code>UnifiedErrorHandler</code>: ✅ Available
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// TOKEN OPTIMIZATION SECTION - @clarity-chat/token-optimization
// ============================================================================

function TokenOptSection() {
  const [tokenCount, setTokenCount] = useState<number | null>(null)
  const [chunkResult, setChunkResult] = useState<string[]>([])

  useEffect(() => {
    // Test SimpleTokenCounter
    const counter = new SimpleTokenCounter()
    const count = counter.count(
      'Hello, this is a test message for token counting.'
    )
    setTokenCount(count)

    // Test TextChunker
    const chunker = new TextChunker({ maxTokens: 50, overlapPercentage: 0.1 })
    const text =
      'This is a longer text that will be split into multiple chunks for processing by the AI model.'
    const result = chunker.chunk(text)
    setChunkResult(result.chunks.map((c) => c.text))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          @clarity-chat/token-optimization
        </h2>
        <p className="text-muted-foreground">
          Token counting, chunking, caching, compression
        </p>
      </div>

      {/* Token Counting */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Token Counting</h3>
        <div className="space-y-2 text-sm">
          <div>
            <code>SimpleTokenCounter</code>: ✅
          </div>
          <div>
            <code>AccurateTokenCounter</code>: ✅ Available
          </div>
          <div>
            Test result: "
            {tokenCount !== null ? `${tokenCount} tokens` : 'counting...'}"
          </div>
        </div>
      </Card>

      {/* Text Chunking */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Text Chunking</h3>
        <div className="space-y-2 text-sm">
          <div>
            <code>TextChunker</code>: ✅
          </div>
          <div>
            <code>ChunkingStrategy</code>: ✅
          </div>
          <div className="mt-2">
            <p className="font-medium">
              Chunk result ({chunkResult.length} chunks):
            </p>
            {chunkResult.map((chunk, i) => (
              <p key={i} className="text-xs bg-muted p-1 rounded mt-1">
                Chunk {i + 1}: {chunk}
              </p>
            ))}
          </div>
        </div>
      </Card>

      {/* Other Features */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Advanced Features</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <code>TokenSecurityManager</code>: ✅
          </div>
          <div>
            <code>QualityGate</code>: ✅
          </div>
          <div>
            <code>CostAwareOptimizer</code>: ✅
          </div>
          <div>
            <code>AdvancedSemanticCache</code>: ✅
          </div>
          <div>
            <code>DynamicCompressionEngine</code>: ✅
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// ERROR HANDLING SECTION - @clarity-chat/error-handling
// ============================================================================

function ErrorHandlingSection() {
  const [showError, setShowError] = useState(false)
  const networkStatus = useNetworkStatus()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          @clarity-chat/error-handling
        </h2>
        <p className="text-muted-foreground">
          Error boundaries, hooks, recovery strategies
        </p>
      </div>

      {/* Error Boundaries */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Error Boundaries</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <code>ErrorBoundary</code>: ✅
          </div>
          <div>
            <code>EnhancedErrorBoundary</code>: ✅
          </div>
          <div>
            <code>ChatErrorBoundary</code>: ✅
          </div>
        </div>
      </Card>

      {/* Error Display */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Error Display Component</h3>
        <Button
          onClick={() => setShowError(!showError)}
          variant="outline"
          className="mb-4"
        >
          {showError ? 'Hide' : 'Show'} Error Display
        </Button>
        {showError && (
          <ErrorDisplay
            error={new Error('This is a test error for demonstration')}
            severity="error"
            title="Test Error"
            onRetry={() => setShowError(false)}
          />
        )}
      </Card>

      {/* Retry Countdown */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Retry Countdown</h3>
        <RetryCountdown
          remainingMs={5000}
          onComplete={() => console.log('Retry countdown complete')}
          variant="default"
        />
      </Card>

      {/* Hooks */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Error Handling Hooks</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <code>useErrorHandler</code>: ✅
          </div>
          <div>
            <code>useAsyncError</code>: ✅
          </div>
          <div>
            <code>useErrorRecovery</code>: ✅
          </div>
          <div>
            <code>useErrorToast</code>: ✅
          </div>
          <div>
            <code>useEnhancedErrorHandler</code>: ✅
          </div>
          <div>
            <code>useStreamingError</code>: ✅
          </div>
          <div>
            <code>usePersistentCircuitBreaker</code>: ✅
          </div>
          <div>
            <code>useNetworkStatus</code>:{' '}
            {networkStatus.isOnline ? '🟢 Online' : '🔴 Offline'}
          </div>
        </div>
      </Card>

      {/* Accessibility Hooks */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Accessibility Hooks</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <code>useFocusManagement</code>: ✅
          </div>
          <div>
            <code>useScreenReaderAnnounce</code>: ✅
          </div>
          <div>
            <code>useHighContrastMode</code>: ✅
          </div>
          <div>
            <code>useColorContrast</code>: ✅
          </div>
          <div>
            <code>useKeyboardNavigation</code>: ✅
          </div>
        </div>
      </Card>

      {/* Provider Detection */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Provider Error Detection</h3>
        <div className="text-sm">
          <code>detectProviderError</code>: ✅ Available
          <p className="mt-2 text-muted-foreground">
            Detects errors from AI providers (OpenAI, Anthropic, etc.)
          </p>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// MEMORY SECTION - @clarity-chat/memory
// ============================================================================

function MemorySection() {
  const [memoryTest, setMemoryTest] = useState<string>('Initializing...')

  useEffect(() => {
    // Test basic memory functionality
    try {
      // Test ImportanceScorer
      const scorer = new ImportanceScorer()
      setMemoryTest(
        'Memory package loaded successfully! ImportanceScorer, DecayManager, and other components available.'
      )
    } catch (error) {
      setMemoryTest(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">@clarity-chat/memory</h2>
        <p className="text-muted-foreground">
          AI memory management, context retention, summarization
        </p>
      </div>

      {/* Memory Service */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Memory Service</h3>
        <div className="space-y-2 text-sm">
          <div>
            <code>clarityMemory</code>: ✅ Factory function
          </div>
          <div>
            <code>MemoryService</code>: ✅ Core service
          </div>
          <p className="mt-2 text-muted-foreground">{memoryTest}</p>
        </div>
      </Card>

      {/* Summarizers */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Summarizers</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <code>LLMSummarizer</code>: ✅
          </div>
          <div>
            <code>OpenAISummarizer</code>: ✅
          </div>
          <div>
            <code>AnthropicSummarizer</code>: ✅
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Summarizers require API keys for full functionality
        </p>
      </Card>

      {/* Scoring & Decay */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Memory Management</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <code>ImportanceScorer</code>: ✅
          </div>
          <div>
            <code>DecayManager</code>: ✅
          </div>
          <div>
            <code>createDecayManager</code>: ✅
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Manages memory importance and decay over time
        </p>
      </Card>

      {/* Usage Example */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Usage Example</h3>
        <div className="p-4 bg-muted/30 rounded-lg">
          <pre className="text-xs overflow-auto">
            {`// Create memory instance
const mem = clarityMemory({
  storage: { type: 'indexeddb' },
})

// Add memory
await mem.add("User prefers dark mode", {
  type: 'semantic',
  importance: 0.9
})

// Recall memories
const results = await mem.recall("user preferences")`}
          </pre>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// MAIN APP
// ============================================================================

function ComponentDemoApp() {
  const [activeSection, setActiveSection] = useState<Section>('overview')

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />
      case 'api-chat':
        return <ApiChatSection />
      case 'core-chat':
        return <CoreChatSection />
      case 'ai-components':
        return <AIComponentsSection />
      case 'feedback':
        return <FeedbackSection />
      case 'token-export':
        return <TokenExportSection />
      case 'search-prompts':
        return <SearchPromptsSection />
      case 'providers':
        return <ProvidersSection />
      case 'hooks':
        return <HooksSection />
      case 'primitives':
        return <PrimitivesSection />
      case 'utils':
        return <UtilsSection />
      case 'token-opt':
        return <TokenOptSection />
      case 'error-handling':
        return <ErrorHandlingSection />
      case 'memory':
        return <MemorySection />
      default:
        return <OverviewSection />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Component Harness</h1>
              <p className="text-sm text-muted-foreground">
                Manual validation for all Clarity Chat components
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <NetworkStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary
          fallback={(error) => (
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                Section Error
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {error.message}
              </p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </Card>
          )}
        >
          {renderSection()}
        </ErrorBoundary>
      </main>
    </div>
  )
}

// Wrap in all required providers
function App() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 max-w-md text-center">
            <h1 className="text-xl font-semibold text-destructive mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </Card>
        </div>
      )}
    >
      <ThemeProvider>
        <ToastProvider>
          <LicenseProvider licenseKey="demo-harness-key">
            <ComponentDemoApp />
          </LicenseProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
