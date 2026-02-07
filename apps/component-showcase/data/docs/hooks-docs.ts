import type { ComponentDoc } from '@/components/doc-panel'

export const hooksDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // useClipboard
  // ===========================================================================
  useClipboard: {
    name: 'useClipboard',
    description:
      'Copy text to the clipboard with automatic success tracking and configurable timeout. Includes fallback for non-HTTPS contexts and older browsers.',
    importPath: '@clarity-chat/react',
    usageCode: `const { copy, copied, value, reset } = useClipboard({
  timeout: 2000,
})

return (
  <div>
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
    <button onClick={() => copy(text)}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  </div>
)`,
    props: [
      {
        name: 'timeout',
        type: 'number',
        default: '2000',
        description: 'Time in ms before copied state resets to false.',
        commonlyUsed: true,
      },
      {
        name: 'onSuccess',
        type: '() => void',
        description: 'Callback invoked when copy succeeds.',
      },
      {
        name: 'onError',
        type: '(error: Error) => void',
        description: 'Callback invoked when copy fails.',
      },
    ],
    notes: [
      'Returns { copy, copied, value, reset } where copy is an async function.',
      'Uses navigator.clipboard.writeText with textarea fallback for non-HTTPS.',
      'Cleanup handled automatically on unmount.',
    ],
    sourceFile: 'hooks/ui/use-clipboard.tsx',
  },

  // ===========================================================================
  // useLocalStorage
  // ===========================================================================
  useLocalStorage: {
    name: 'useLocalStorage',
    description:
      'Persist React state in localStorage with automatic JSON serialization, cross-tab synchronization, and a useState-compatible API.',
    importPath: '@clarity-chat/react',
    usageCode: `const [count, setCount, removeCount] = useLocalStorage(
  'demo-count',
  0
)

return (
  <div>
    <p>Count: {count}</p>
    <button onClick={() => setCount((c) => c + 1)}>
      Increment
    </button>
    <button onClick={removeCount}>Reset</button>
  </div>
)`,
    props: [
      {
        name: 'key',
        type: 'string',
        required: true,
        description: 'The localStorage key.',
        commonlyUsed: true,
      },
      {
        name: 'initialValue',
        type: 'T | (() => T)',
        required: true,
        description: 'Initial value when no stored value exists.',
        commonlyUsed: true,
      },
      {
        name: 'serializer',
        type: '(value: T) => string',
        default: 'JSON.stringify',
        description: 'Custom serializer.',
      },
      {
        name: 'deserializer',
        type: '(value: string) => T',
        default: 'JSON.parse',
        description: 'Custom deserializer.',
      },
    ],
    notes: [
      'Returns [value, setValue, removeValue] matching the useState API.',
      'Syncs across browser tabs via the storage event.',
      'Errors during read/write are caught and logged as warnings.',
    ],
    sourceFile: 'hooks/storage/use-local-storage.tsx',
  },

  // ===========================================================================
  // useDebounce
  // ===========================================================================
  useDebounce: {
    name: 'useDebounce',
    description:
      'Debounce a value so it only updates after a specified delay. Ideal for reducing API calls during rapid user input.',
    importPath: '@clarity-chat/react',
    usageCode: `const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 500)

useEffect(() => {
  if (debouncedSearch) fetchResults(debouncedSearch)
}, [debouncedSearch])`,
    props: [
      {
        name: 'value',
        type: 'T',
        required: true,
        description: 'The value to debounce.',
        commonlyUsed: true,
      },
      {
        name: 'delay',
        type: 'number',
        default: '500',
        description: 'Debounce delay in milliseconds.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Returns the debounced value.',
      'Companion useDebouncedCallback hook is also available for debouncing callbacks.',
    ],
    sourceFile: 'hooks/ui/use-debounce.ts',
  },

  // ===========================================================================
  // useThrottle
  // ===========================================================================
  useThrottle: {
    name: 'useThrottle',
    description:
      'Throttle a value to update at most once per interval. Unlike debounce, throttle guarantees regular updates during sustained activity.',
    importPath: '@clarity-chat/react',
    usageCode: `const [position, setPosition] = useState(0)
const throttledPosition = useThrottle(position, 200)

// throttledPosition updates at most every 200ms`,
    props: [
      {
        name: 'value',
        type: 'T',
        required: true,
        description: 'The value to throttle.',
        commonlyUsed: true,
      },
      {
        name: 'interval',
        type: 'number',
        default: '500',
        description: 'Minimum interval between updates in ms.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Returns the throttled value.',
      'Guarantees the last value is always emitted after activity stops.',
      'Companion useThrottledCallback hook is also available.',
    ],
    sourceFile: 'hooks/ui/use-throttle.ts',
  },

  // ===========================================================================
  // useToggle
  // ===========================================================================
  useToggle: {
    name: 'useToggle',
    description:
      'Simple boolean toggle hook with on(), off(), and toggle() functions. Replaces verbose useState + setter patterns.',
    importPath: '@clarity-chat/react',
    usageCode: `const [isOpen, { toggle, on, off }] = useToggle(false)

return (
  <div>
    <button onClick={toggle}>Toggle</button>
    <button onClick={on}>Open</button>
    <button onClick={off}>Close</button>
    <p>State: {isOpen ? 'Open' : 'Closed'}</p>
  </div>
)`,
    props: [
      {
        name: 'initialValue',
        type: 'boolean',
        default: 'false',
        description: 'Initial toggle state.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Returns [value, { toggle, on, off }].',
      'All functions are stable references (no unnecessary re-renders).',
    ],
    sourceFile: 'hooks/ui/use-toggle.tsx',
  },

  // ===========================================================================
  // useMediaQuery
  // ===========================================================================
  useMediaQuery: {
    name: 'useMediaQuery',
    description:
      'React to CSS media query changes in real-time. Returns a boolean that updates when the query match state changes.',
    importPath: '@clarity-chat/react',
    usageCode: `const isMobile = useMediaQuery('(max-width: 639px)')
const prefersDark = useMediaQuery(
  '(prefers-color-scheme: dark)'
)

return (
  <div>
    {isMobile ? <MobileLayout /> : <DesktopLayout />}
  </div>
)`,
    props: [
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'CSS media query string.',
        commonlyUsed: true,
      },
      {
        name: 'defaultValue',
        type: 'boolean',
        default: 'false',
        description: 'Default value for SSR.',
      },
    ],
    notes: [
      'Returns a boolean that reactively updates on viewport/preference changes.',
      'Uses matchMedia API with addEventListener for efficient updates.',
      'Defaults to false during SSR for hydration safety.',
    ],
    sourceFile: 'hooks/ui/use-media-query.ts',
  },

  // ===========================================================================
  // useSafeInterval
  // ===========================================================================
  useSafeInterval: {
    name: 'useSafeInterval',
    description:
      'setInterval with automatic cleanup on unmount. Prevents memory leaks from intervals that outlive their component.',
    importPath: '@clarity-chat/react',
    usageCode: `const { start, stop, isRunning } = useSafeInterval(() => {
  setCount((c) => c + 1)
}, 1000)

return (
  <div>
    <button onClick={start}>Start</button>
    <button onClick={stop}>Stop</button>
  </div>
)`,
    props: [
      {
        name: 'callback',
        type: '() => void',
        required: true,
        description: 'Function called on each interval.',
        commonlyUsed: true,
      },
      {
        name: 'delay',
        type: 'number',
        required: true,
        description: 'Interval delay in ms.',
        commonlyUsed: true,
      },
      {
        name: 'immediate',
        type: 'boolean',
        default: 'false',
        description: 'Start immediately on mount.',
      },
    ],
    notes: [
      'Returns { start, stop, isRunning }.',
      'Automatically clears interval on unmount.',
      'Companion useSafeTimeout hook is available for one-shot delays.',
    ],
    sourceFile: 'hooks/ui/use-safe-timeout.ts',
  },

  // ===========================================================================
  // useKeyboardShortcuts
  // ===========================================================================
  useKeyboardShortcuts: {
    name: 'useKeyboardShortcuts',
    description:
      'Register global keyboard shortcuts with support for modifier keys (Ctrl/Cmd), platform-aware display, and input element filtering.',
    importPath: '@clarity-chat/react',
    usageCode: `useKeyboardShortcuts([
  {
    key: 'mod+k',
    callback: () => setSearchOpen(true),
    description: 'Open search',
  },
  {
    key: 'escape',
    callback: () => setSearchOpen(false),
    description: 'Close search',
  },
  {
    key: 'mod+enter',
    callback: handleSubmit,
    enableInInput: true,
  },
])`,
    props: [
      {
        name: 'shortcuts',
        type: 'KeyboardShortcut[]',
        required: true,
        description: 'Array of shortcut definitions.',
        commonlyUsed: true,
      },
      {
        name: 'key',
        type: 'string',
        required: true,
        description: "Key combo. Use 'mod' for Cmd/Ctrl.",
        commonlyUsed: true,
      },
      {
        name: 'callback',
        type: '(event: KeyboardEvent) => void',
        required: true,
        description: 'Handler function.',
        commonlyUsed: true,
      },
      {
        name: 'enabled',
        type: 'boolean',
        default: 'true',
        description: 'Whether shortcut is active.',
      },
      {
        name: 'enableInInput',
        type: 'boolean',
        default: 'false',
        description: 'Allow in input/textarea elements.',
      },
    ],
    notes: [
      "'mod' maps to Cmd on macOS, Ctrl on Windows/Linux.",
      'Suppressed in form elements by default.',
      'Related: useScopedKeyboardShortcuts, useFocusedKeyboardShortcuts.',
    ],
    sourceFile: 'components/clarity/chat/CommandPalette.tsx',
  },

  // ===========================================================================
  // useCharacterCounter
  // ===========================================================================
  useCharacterCounter: {
    name: 'useCharacterCounter',
    description:
      'Track character count with configurable limits, warnings, and percentage tracking. Useful for Twitter-style inputs.',
    importPath: '@clarity-chat/react',
    usageCode: `const { count, remaining, percentage, isOverLimit } =
  useCharacterCounter({
    text,
    maxLength: 280,
    warningThreshold: 0.9,
  })`,
    props: [
      {
        name: 'value',
        type: 'string',
        required: true,
        description: 'The value prop.',
      },
      {
        name: 'maxLength',
        type: 'number',
        description: 'Maximum character limit.',
        commonlyUsed: true,
      },
      {
        name: 'warningThreshold',
        type: 'number',
        default: '0.9',
        description: 'Percentage threshold for warning state.',
      },
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'The text to count.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Returns { count, remaining, percentage, isOverLimit, isWarning }.',
      'Lightweight alternative to useTokenCounter for simple character limits.',
    ],
    sourceFile: 'hooks/input/use-character-counter.ts',
  },

  // ===========================================================================
  // useReducedMotion
  // ===========================================================================
  useReducedMotion: {
    name: 'useReducedMotion',
    description:
      'Detect if the user prefers reduced motion via the prefers-reduced-motion media query. Reactively updates on system changes.',
    importPath: '@clarity-chat/react',
    usageCode: `const prefersReducedMotion = useReducedMotion()

const transition = prefersReducedMotion
  ? { duration: 0 }
  : { type: 'spring', stiffness: 400 }`,
    props: [],
    notes: [
      'Returns a boolean: true if reduced motion is enabled.',
      'Defaults to false during SSR.',
      'WCAG 2.1 guideline C39 compliance.',
    ],
    sourceFile: 'utils/animations.ts',
  },

  // ===========================================================================
  // useRetryWithBackoff
  // ===========================================================================
  useRetryWithBackoff: {
    name: 'useRetryWithBackoff',
    description:
      'Execute async operations with automatic retry and exponential backoff. Provides state tracking, cancellation, and unmount cleanup.',
    importPath: '@clarity-chat/react',
    usageCode: `const { execute, isRetrying, attempt, cancel, lastError } =
  useRetryWithBackoff({ maxRetries: 3, baseDelay: 1000 })

const result = await execute(() => submitForm(data))`,
    props: [
      {
        name: 'onRetry',
        type: '(attempt: number, delay: number, error: Error) => void',
        description: 'Callback before each retry.',
        commonlyUsed: true,
      },
      {
        name: 'maxRetries',
        type: 'number',
        default: '3',
        description: 'Max retry attempts.',
        commonlyUsed: true,
      },
      {
        name: 'baseDelay',
        type: 'number',
        default: '1000',
        description: 'Base delay for backoff in ms.',
        commonlyUsed: true,
      },
      {
        name: 'maxDelay',
        type: 'number',
        default: '30000',
        description: 'Maximum delay cap.',
      },
      {
        name: 'jitter',
        type: 'boolean',
        default: 'true',
        description: 'Add random jitter to prevent thundering herd.',
      },
    ],
    notes: [
      'Returns { execute, isRetrying, attempt, cancel, lastError, reset }.',
      'Cancels pending retries on unmount.',
      'Uses exponential backoff: delay = baseDelay * (multiplier ^ attempt).',
    ],
    sourceFile: 'hooks/resilience/use-retry-with-backoff.ts',
  },

  // ===========================================================================
  // useCircuitBreaker
  // ===========================================================================
  useCircuitBreaker: {
    name: 'useCircuitBreaker',
    description:
      'Circuit breaker pattern for fault tolerance. Automatically blocks requests after a failure threshold and recovers via half-open testing.',
    importPath: '@clarity-chat/react',
    usageCode: `const { execute, state, failures, reset } =
  useCircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 5000,
  })

try {
  const result = await execute(() => fetchData())
} catch (error) {
  // Circuit is open - requests are blocked
}`,
    props: [
      {
        name: 'onStateChange',
        type: '(state: CircuitState, name: string) => void',
        description: 'Callback on state transitions.',
      },
      {
        name: 'failureThreshold',
        type: 'number',
        default: '5',
        description: 'Failures before circuit opens.',
        commonlyUsed: true,
      },
      {
        name: 'resetTimeout',
        type: 'number',
        default: '5000',
        description: 'Time in ms before half-open test.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'States: closed (normal), open (blocking), half-open (testing).',
      'Returns { execute, state, failures, reset, isOpen, isClosed }.',
      'Companion usePersistentCircuitBreaker persists state across sessions.',
    ],
    sourceFile: 'hooks/resilience/use-circuit-breaker.ts',
  },

  // ===========================================================================
  // useAutoScroll
  // ===========================================================================
  useAutoScroll: {
    name: 'useAutoScroll',
    description:
      'Auto-scroll a container to the bottom when new content is added, but only when the user is near the bottom. Respects manual scrolling.',
    importPath: '@clarity-chat/react',
    usageCode: `const { scrollRef, isNearBottom, scrollToBottom } =
  useAutoScroll({
    dependencies: [messages],
    threshold: 50,
  })

return (
  <div
    ref={scrollRef}
    style={{ height: 400, overflow: 'auto' }}
  >
    {messages.map((msg) => (
      <Message key={msg.id} {...msg} />
    ))}
    {!isNearBottom && (
      <button onClick={scrollToBottom}>
        Scroll to bottom
      </button>
    )}
  </div>
)`,
    props: [
      {
        name: 'enabled',
        type: 'boolean',
        default: 'true',
        description: 'Whether auto-scroll is enabled.',
        commonlyUsed: true,
      },
      {
        name: 'behavior',
        type: 'ScrollBehavior',
        default: '"smooth"',
        description: 'Scroll behavior.',
      },
      {
        name: 'threshold',
        type: 'number',
        default: '100',
        description: 'Distance from bottom in px to trigger auto-scroll.',
        commonlyUsed: true,
      },
      {
        name: 'dependencies',
        type: 'DependencyList',
        default: '[]',
        description: 'Triggers scroll check when changed.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Returns { scrollRef, isNearBottom, scrollToBottom, setEnabled }.',
      'Scroll events throttled at 60fps for performance.',
    ],
    sourceFile: 'components/clarity/chat-container.tsx',
  },

  // ===========================================================================
  // useTokenCounter
  // ===========================================================================
  useTokenCounter: {
    name: 'useTokenCounter',
    description:
      'Real-time token counting with model-aware encoding. Wraps AccurateTokenCounter for debounced counting and limit checking.',
    importPath: '@clarity-chat/react',
    usageCode: `const {
  tokenCount,
  setInput,
  isWithinLimit,
  modelMaxTokens,
} = useTokenCounter({ model: 'gpt-4o' })

const handleChange = (e) => setInput(e.target.value)`,
    props: [
      {
        name: 'encoding',
        type: 'TokenEncoding',
        description: 'Which encoding to use',
      },
      {
        name: 'preload',
        type: 'boolean',
        description: 'Whether to preload the encoder on mount',
      },
      {
        name: 'model',
        type: 'string',
        required: true,
        description: 'Model identifier for encoding.',
        commonlyUsed: true,
      },
      {
        name: 'debounceMs',
        type: 'number',
        default: '150',
        description: 'Debounce delay for token counting.',
      },
    ],
    notes: [
      'Returns { countTokens, tokenCount, setInput, isWithinLimit, modelMaxTokens }.',
      'Falls back to Math.ceil(text.length / 4) estimation if not initialized.',
    ],
    sourceFile: 'hooks/clarity-tokens/use-token-counter.ts',
  },

  // ===========================================================================
  // UI & State Hooks
  // ===========================================================================
  'UI & State Hooks': {
    name: 'UI & State Hooks',
    description:
      'Utility hooks for common UI patterns including timing (debounce, throttle, safe timers), DOM (events, intersection, media queries), refs (merged, forwarded), focus management, animations, and primitives integration.',
    importPath: '@clarity-chat/react, @clarity-chat/primitives',
    usageCode: `// Timing
const debouncedValue = useDebounce(search, 500)
const throttledValue = useThrottle(position, 200)
const { start, stop } = useSafeInterval(callback, 1000)

// DOM
const matches = useMediaQuery('(min-width: 768px)')
const ref = useMergedRef(localRef, forwardedRef)
useEventListener('resize', handleResize)

// Focus
const trapRef = useFocusTrap({ enabled: isOpen })
useFocusRestoration({ trigger: dialogRef })`,
    props: [],
    notes: [
      'Includes hooks from both @clarity-chat/react and @clarity-chat/primitives.',
      'All timing hooks (useSafeTimeout, useSafeInterval, useSafeAnimationFrame) auto-cleanup on unmount.',
      'useMergedRef supports combining 2+ refs including callback refs and RefObjects.',
      'useBodyScrollLock prevents background scrolling during modals.',
    ],
  },

  // ===========================================================================
  // Chat & AI Hooks
  // ===========================================================================
  'Chat & AI Hooks': {
    name: 'Chat & AI Hooks',
    description:
      'Core hooks for building AI chat interfaces. Includes full-featured chat state, tool calling, agents, RAG pipelines, and multi-provider support.',
    importPath: '@clarity-chat/react',
    usageCode: `// Full-featured chat
const { messages, send, isLoading, tools } = useClarityChat(
  {
    model: 'gpt-4o',
    tools: [searchTool, calculatorTool],
    memory: { enabled: true },
  }
)

// Agent orchestration
const { execute, steps, isRunning } = useAgent({
  tools: agentTools,
  maxSteps: 10,
})

// RAG pipeline
const { query, results, isSearching } = useRAGPipeline({
  vectorStore: myVectorStore,
  topK: 5,
})`,
    props: [],
    notes: [
      'useClarityChat is the primary hook - combines chat, streaming, tools, and memory.',
      'useAgent supports multi-step reasoning with automatic tool selection.',
      'useRAGPipeline integrates vector search with context injection.',
      'useChatSync enables real-time cross-tab synchronization.',
      'useRateLimitedChat adds automatic request queuing and rate limiting.',
    ],
  },

  // ===========================================================================
  // Streaming Hooks
  // ===========================================================================
  'Streaming Hooks': {
    name: 'Streaming Hooks',
    description:
      'Hooks for consuming streaming AI responses via SSE, WebSocket, ReadableStream, and React Server Components with smooth text rendering.',
    importPath: '@clarity-chat/react',
    usageCode: `// SSE streaming
const { data, error, isStreaming } = useStreamingSSE(
  '/api/chat',
  {
    onChunk: (chunk) => appendMessage(chunk),
  }
)

// WebSocket streaming
const { send, lastMessage, status } =
  useStreamingWebSocket('wss://api/ws')

// Smooth text rendering
const smoothedText = useSmoothedText(streamedText, {
  fps: 60,
})`,
    props: [],
    notes: [
      'useStreaming is the base hook for any async iterable or ReadableStream.',
      'useStreamingSSE handles reconnection and event parsing automatically.',
      'useSmoothedText renders streaming text at 60fps for smooth visual output.',
      'useStreamableUI enables streaming React components from server to client.',
    ],
  },

  // ===========================================================================
  // Messages & State Hooks
  // ===========================================================================
  'Messages & State Hooks': {
    name: 'Messages & State Hooks',
    description:
      'Hooks for message management, optimistic updates, thread management, tool state, and generative UI state for building complex chat interfaces.',
    importPath: '@clarity-chat/react',
    usageCode: `// Message operations
const { editMessage, deleteMessage, pinMessage } =
  useMessageOperations()

// Optimistic UI
const { send, pending, rollback } = useOptimisticMessage({
  onSend: (msg) => api.sendMessage(msg),
})

// Thread management
const {
  threads,
  activeThread,
  switchThread,
  createThread,
} = useThread()

// Tool state
const { tools, pendingTools, toolHistory } = useTools()`,
    props: [],
    notes: [
      'useOptimisticMessage provides instant UI updates with automatic rollback on failure.',
      'useThread manages multiple conversation threads with persistence.',
      'useAiState powers generative UI where the server streams React components.',
      'useTool and useTools integrate with ClarityChatProvider for tool calling state.',
      'useProgressiveContent enables skeleton-to-content transitions for streaming.',
    ],
  },

  // ===========================================================================
  // Token & Cost Hooks
  // ===========================================================================
  'Token & Cost Hooks': {
    name: 'Token & Cost Hooks',
    description:
      'Comprehensive token management: counting, budget tracking, cost estimation, caching (exact, semantic, tiered), and optimization. Spans @clarity-chat/react and @clarity-chat/token-optimization.',
    importPath: '@clarity-chat/react, @clarity-chat/token-optimization',
    usageCode: `// Token counting
const { tokenCount, isWithinLimit } = useTokenCounter({
  model: 'gpt-4o',
})

// Cost estimation
const { estimatedCost, breakdown } = useCostEstimator({
  model: 'gpt-4o',
  inputTokens: 1500,
  outputTokens: 500,
})

// Budget tracking
const { usage, isOverBudget, remaining } = useTokenBudget({
  budget: 100000,
  period: 'daily',
})

// Semantic caching
const { get, set, hitRate } = useSemanticCache({
  threshold: 0.85,
})`,
    props: [],
    notes: [
      'useTokenCounter uses AccurateTokenCounter with model-specific encodings.',
      'useCostEstimator supports all major model pricing (OpenAI, Anthropic, etc.).',
      'useSemanticCache uses embedding similarity to cache near-duplicate queries.',
      'useTieredCache provides memory → localStorage → IndexedDB caching hierarchy.',
      'usePromptCompressor automatically reduces prompt size while preserving meaning.',
    ],
  },

  // ===========================================================================
  // Keyboard & Input Hooks
  // ===========================================================================
  'Keyboard & Input Hooks': {
    name: 'Keyboard & Input Hooks',
    description:
      'Comprehensive keyboard navigation, shortcut management, voice input, mobile keyboard handling, and input state management.',
    importPath: '@clarity-chat/react',
    usageCode: `// Vim navigation
const { activeIndex } = useVimNavigation({
  items: messages,
})

// Command palette
const { isOpen, search, results } = useCommandPalette({
  commands: myCommands,
})

// Voice input
const { isListening, transcript, start, stop } =
  useVoiceInput()

// Mobile keyboard
const viewportHeight = useMobileViewportHeight()`,
    props: [],
    notes: [
      'useVimNavigation adds j/k navigation to any list component.',
      'useCommandPalette provides fuzzy search with categories and keyboard navigation.',
      'useVoiceInput wraps the Web Speech API with streaming transcription.',
      'useMobileKeyboard handles virtual keyboard show/hide events on mobile devices.',
      'useQuickActions registers quick action shortcuts for power users.',
    ],
  },

  // ===========================================================================
  // Resilience & Security Hooks
  // ===========================================================================
  'Resilience & Security Hooks': {
    name: 'Resilience & Security Hooks',
    description:
      'Fault tolerance patterns (retry, circuit breaker), security monitoring, input sanitization, error handling, and network status from @clarity-chat/react and @clarity-chat/error-handling.',
    importPath: '@clarity-chat/react, @clarity-chat/error-handling',
    usageCode: `// Error recovery
const { execute, fallback } = useErrorRecovery({
  strategies: ['retry', 'cache', 'fallback'],
})

// Security monitoring
const { events, riskScore } = useSecurityMonitor()

// Network status
const { isOnline, downSince } = useNetworkStatus()

// Error analytics
const { errors, trends } = useErrorAnalytics()`,
    props: [],
    notes: [
      'useRetryWithBackoff and useCircuitBreaker implement industry-standard resilience patterns.',
      'useSecureInput prevents XSS and injection attacks on user input.',
      'useErrorBoundary provides a hook-based alternative to class ErrorBoundary components.',
      'usePersistentCircuitBreaker persists circuit state in localStorage across sessions.',
      'useNetworkStatus monitors online/offline transitions for offline-first UX.',
    ],
  },

  // ===========================================================================
  // Performance Hooks
  // ===========================================================================
  'Performance Hooks': {
    name: 'Performance Hooks',
    description:
      'Render optimization, virtual scrolling, lazy loading, 60fps animations, caching, debugging, and advanced React patterns for high-performance applications.',
    importPath: '@clarity-chat/react',
    usageCode: `// Virtual scrolling
const { visibleItems, totalHeight, offsetY } =
  useVirtualList({
    items: largeDataset,
    itemHeight: 48,
    containerHeight: 600,
  })

// Debug renders
useWhyDidYouUpdate('MyComponent', props)

// Deferred search
const { results, isPending } = useDeferredSearch(
  query,
  searchFn
)

// Battery-aware
const { shouldThrottle, batteryLevel } = useBatteryAware()`,
    props: [],
    notes: [
      'useVirtualList and useDynamicVirtualList handle 100K+ rows efficiently.',
      'useWhyDidYouUpdate logs which props caused a re-render (development only).',
      'useBatchedState batches multiple state updates into a single render cycle.',
      'useBatteryAware reduces animations and polling when battery is low.',
      'useContextSelector prevents re-renders when unrelated context values change.',
    ],
  },

  // ===========================================================================
  // Connected Component Hooks
  // ===========================================================================
  'Connected Component Hooks': {
    name: 'Connected Component Hooks',
    description:
      'Auto-wiring hooks that connect Clarity Chat components to ClarityChatProvider for zero-configuration setup. Each hook provides the correct props for its component.',
    importPath: '@clarity-chat/react',
    usageCode: `// Auto-wire a component to the provider
const senderProps = useConnectedSender()
return <ChatInput {...senderProps} />

// Or use the universal hook
const props = useConnectedProps('ThinkingBar')
return <ThinkingBar {...props} />

// Higher-order component pattern
const ConnectedToolCard = withConnected(ToolCard)`,
    props: [],
    notes: [
      'Each useConnected* hook reads from ClarityChatProvider context.',
      'useConnectedProps accepts a component name string for dynamic wiring.',
      'withConnected HOC wraps any component for automatic provider integration.',
      'Connected hooks eliminate prop drilling for deeply nested components.',
    ],
  },

  // ===========================================================================
  // SDK Bridge Hooks
  // ===========================================================================
  'SDK Bridge Hooks': {
    name: 'SDK Bridge Hooks',
    description:
      'Bridge hooks that adapt external AI SDKs (Vercel AI, LangChain, Anthropic) to work seamlessly with Clarity Chat components.',
    importPath: '@clarity-chat/react',
    usageCode: `// Vercel AI SDK bridge
const clarityProps = useVercelAIBridge(
  useChat({ api: '/api/chat' })
)
return <ClarityChat {...clarityProps} />

// Anthropic SDK bridge
const props = useAnthropicBridge({
  apiKey,
  model: 'claude-3-5-sonnet',
})

// Generic bridge for custom SDKs
const bridge = useGenericBridge({
  send: myCustomSend,
  subscribe: myCustomSubscribe,
})`,
    props: [],
    notes: [
      'useVercelAIBridge wraps Vercel AI useChat/useCompletion return values.',
      'useLangChainBridge supports LangChain chains, agents, and tools.',
      'useGenericBridge provides a factory for any custom AI SDK integration.',
      'All bridges normalize messages to Clarity Chat format automatically.',
    ],
  },

  // ===========================================================================
  // Dashboard, Prompt & Memory Hooks
  // ===========================================================================
  'Dashboard, Prompt & Memory Hooks': {
    name: 'Dashboard, Prompt & Memory Hooks',
    description:
      'Hooks for dashboard data management, progressive prompt composition with token awareness, and AI memory operations.',
    importPath: '@clarity-chat/react, @clarity-chat/memory',
    usageCode: `// Dashboard
const { data, isLoading, refresh } = useDashboardData({
  endpoint: '/api/stats',
})

// Prompt composition
const { prompt, addContext, tokenCount } =
  usePromptComposer({
    maxTokens: 4096,
    systemPrompt: 'You are a helpful assistant.',
  })

// Memory
const { remember, forget, memories } = useMemory({
  namespace: 'user-prefs',
})`,
    props: [],
    notes: [
      'useDashboardData supports polling, real-time updates, and manual refresh.',
      'usePromptComposer automatically manages context window within token budgets.',
      'useMemory from @clarity-chat/memory provides persistent AI memory operations.',
      'useContextMonitor provides recommendations for optimizing context usage.',
    ],
  },

  // ===========================================================================
  // Theme, Storage & Design Hooks
  // ===========================================================================
  'Theme, Storage & Design Hooks': {
    name: 'Theme, Storage & Design Hooks',
    description:
      'Theme management, design tokens, color systems, and persistent storage hooks for building themeable applications.',
    importPath: '@clarity-chat/react',
    usageCode: `// Theme colors
const { primary, background, foreground } = useThemeColors()

// Design tokens
const { spacing, radius, shadow } = useDesignTokens()

// IndexedDB storage
const { get, set, remove } = useIndexedDB('my-store')

// Conversation storage
const { save, load, list } = useConversationStorage()`,
    props: [],
    notes: [
      'useThemeColors reads CSS custom properties for runtime theme access.',
      'useDesignTokens provides consistent spacing, radius, and shadow values.',
      'useIndexedDB handles large data storage with async operations.',
      'useConversationStorage auto-namespaces storage by conversation ID.',
    ],
  },

  // ===========================================================================
  // License Hooks
  // ===========================================================================
  'License Hooks': {
    name: 'License Hooks',
    description:
      'License management hooks for checking license status, plan levels, and gating features behind license requirements.',
    importPath: '@clarity-chat/license',
    usageCode: `// Check license
const { isActive, plan, expiresAt } = useLicenseStatus()

// Feature gating
useRequireLicense('pro', {
  fallback: <UpgradePrompt />,
})

// Plan checking
const hasPro = useHasPlan('pro')`,
    props: [],
    notes: [
      'useLicenseStatus provides full license details including plan and expiry.',
      'useRequireLicense gates component rendering behind license checks.',
      'useIsHydrated ensures license checks only run after client hydration.',
    ],
  },

  // ===========================================================================
  // Accessibility Hooks
  // ===========================================================================
  'Accessibility Hooks': {
    name: 'Accessibility Hooks',
    description:
      'Screen reader support, preference detection, and semantic search capabilities.',
    importPath: '@clarity-chat/react, @clarity-chat/token-optimization',
    usageCode: `// Screen reader
const { isScreenReader, announce } = useScreenReader()
announce('New message received', 'polite')

// Embeddings
const { embed, similarity } = useEmbeddings({
  model: 'text-embedding-3-small',
})

// Preferences
const prefersHighContrast = usePrefersHighContrast()`,
    props: [],
    notes: [
      'useScreenReader detects screen reader presence and provides live region announcements.',
      'useEmbeddings generates text embeddings for semantic search features.',
      'useVectorStore provides a client-side vector store for embedding retrieval.',
    ],
  },

  // ===========================================================================
  // Dev Tools Hooks
  // ===========================================================================
  'Dev Tools Hooks': {
    name: 'Dev Tools Hooks',
    description:
      'Development-only hooks for profiling, state debugging, time travel, API inspection, and error tracking.',
    importPath: '@clarity-chat/dev-tools',
    usageCode: `// Performance profiling
const { startProfile, getReport } = useProfiler()

// State diffing
const { diffs, clearDiffs } = useStateDiff(myState)

// Time travel
const { snapshots, goTo, canUndo, canRedo } = useTimeTravel(
  state,
  setState
)

// API inspection
const { requests, clearRequests } = useAPIInspector()`,
    props: [],
    notes: [
      'useProfiler collects flame graph data for render performance analysis.',
      'useTimeTravel enables undo/redo with state snapshots and replay.',
      'useModelComparison runs queries against multiple models side-by-side.',
      'All dev tools hooks are designed to be tree-shaken in production builds.',
    ],
  },

  // ===========================================================================
  // Playground Hooks
  // ===========================================================================
  'Playground Hooks': {
    name: 'Playground Hooks',
    description:
      'Hooks for building interactive AI playgrounds with code editing, execution, and configuration management.',
    importPath: '@clarity-chat/playground',
    usageCode: `// Full playground context
const { state, actions } = usePlayground()

// Code editing
const { code, setCode, language } = usePlaygroundCode()

// Settings
const { model, temperature, setModel } =
  usePlaygroundSettings()`,
    props: [],
    notes: [
      'usePlayground provides the complete playground context with state and actions.',
      'usePlaygroundCode manages code editor state including language detection.',
      'usePlaygroundConsole captures and displays execution output.',
    ],
  },
}
