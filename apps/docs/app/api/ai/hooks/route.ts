import { logger } from '@clarity-chat/utils/logger';
import { NextResponse } from 'next/server'
import {
  type HookInfo,
  type HooksAPIResponse,
  type HookCategory,
  API_RESPONSE_HEADERS,
  AI_API_VERSION,
  BASE_URL,
  PACKAGE_VERSION,
  createErrorResponse,
  getStableTimestamp,
} from '@/lib/ai/types'
import { mergeHookData, getDataSourceInfo } from '@/lib/ai/merge-component-data'

/**
 * AI-Optimized Hooks API
 *
 * Provides a structured JSON endpoint for AI systems to discover
 * and understand Clarity Chat hooks.
 *
 * @route GET /api/ai/hooks
 * @route OPTIONS /api/ai/hooks (CORS preflight)
 */

// Curated hook data with detailed documentation
const curatedHooks: HookInfo[] = [
  // Core Chat Hooks
  {
    name: 'useChat',
    description:
      'Primary hook for managing chat state and operations. Handles messages, sending, loading states, and message history.',
    category: 'core',
    signature: 'useChat(options?: UseChatOptions): UseChatReturn',
    parameters: [
      {
        name: 'initialMessages',
        type: 'Message[]',
        required: false,
        description: 'Initial messages to populate chat',
      },
      {
        name: 'onSend',
        type: '(message: string) => Promise<void>',
        required: false,
        description: 'Custom send handler',
      },
      {
        name: 'onError',
        type: '(error: Error) => void',
        required: false,
        description: 'Error handler callback',
      },
      {
        name: 'api',
        type: 'string',
        required: false,
        description: 'API endpoint for chat',
      },
    ],
    returns: {
      type: 'UseChatReturn',
      properties: [
        {
          name: 'messages',
          type: 'Message[]',
          description: 'Array of chat messages',
        },
        { name: 'input', type: 'string', description: 'Current input value' },
        {
          name: 'setInput',
          type: '(value: string) => void',
          description: 'Set input value',
        },
        {
          name: 'handleSubmit',
          type: '(e: FormEvent) => void',
          description: 'Form submit handler',
        },
        { name: 'isLoading', type: 'boolean', description: 'Loading state' },
        { name: 'error', type: 'Error | null', description: 'Current error' },
        {
          name: 'append',
          type: '(message: Message) => void',
          description: 'Append a message',
        },
        {
          name: 'reload',
          type: '() => void',
          description: 'Regenerate last response',
        },
        { name: 'stop', type: '() => void', description: 'Stop streaming' },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-chat',
    examples: [
      `import { useChat } from "@clarity-chat/react";

function ChatComponent() {
  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <form onSubmit={handleSubmit}>
      <MessageList messages={messages} />
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button disabled={isLoading}>Send</button>
    </form>
  );
}`,
    ],
    relatedHooks: ['useChatEnhanced', 'useStreaming', 'useCompletion'],
    version: '0.1.0',
  },
  {
    name: 'useStreaming',
    description:
      'Hook for handling streaming responses. Supports SSE and WebSocket protocols with automatic reconnection.',
    category: 'core',
    signature:
      'useStreaming(options?: UseStreamingOptions): UseStreamingReturn',
    parameters: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'Streaming endpoint URL',
      },
      {
        name: 'protocol',
        type: "'sse' | 'websocket'",
        required: false,
        description: 'Streaming protocol',
      },
      {
        name: 'onChunk',
        type: '(chunk: string) => void',
        required: false,
        description: 'Callback for each chunk',
      },
      {
        name: 'onComplete',
        type: '(fullText: string) => void',
        required: false,
        description: 'Callback when streaming completes',
      },
      {
        name: 'onError',
        type: '(error: Error) => void',
        required: false,
        description: 'Error callback',
      },
    ],
    returns: {
      type: 'UseStreamingReturn',
      properties: [
        {
          name: 'data',
          type: 'string',
          description: 'Accumulated streamed data',
        },
        {
          name: 'isStreaming',
          type: 'boolean',
          description: 'Whether actively streaming',
        },
        {
          name: 'error',
          type: 'Error | null',
          description: 'Any streaming error',
        },
        {
          name: 'start',
          type: '(body?: object) => void',
          description: 'Start streaming',
        },
        { name: 'stop', type: '() => void', description: 'Stop streaming' },
        { name: 'reset', type: '() => void', description: 'Reset state' },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-streaming',
    examples: [
      `import { useStreaming } from "@clarity-chat/react";

function StreamingChat() {
  const { data, isStreaming, start, stop } = useStreaming({
    url: '/api/chat/stream',
    protocol: 'sse',
  });

  return (
    <div>
      <p>{data}</p>
      <button onClick={() => start({ message: "Hello" })}>Start</button>
      {isStreaming && <button onClick={stop}>Stop</button>}
    </div>
  );
}`,
    ],
    relatedHooks: ['useStreamingSSE', 'useStreamingWebSocket', 'useChat'],
    version: '0.1.0',
  },
  {
    name: 'useTokenTracker',
    description:
      'Track token usage across conversations. Calculates input/output tokens and provides cost estimation.',
    category: 'analytics',
    signature:
      'useTokenTracker(options?: UseTokenTrackerOptions): UseTokenTrackerReturn',
    parameters: [
      {
        name: 'model',
        type: 'string',
        required: false,
        description: 'Model name for accurate counting',
      },
      {
        name: 'messages',
        type: 'Message[]',
        required: false,
        description: 'Messages to track',
      },
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Token limit threshold',
      },
    ],
    returns: {
      type: 'UseTokenTrackerReturn',
      properties: [
        {
          name: 'totalTokens',
          type: 'number',
          description: 'Total token count',
        },
        {
          name: 'inputTokens',
          type: 'number',
          description: 'Input token count',
        },
        {
          name: 'outputTokens',
          type: 'number',
          description: 'Output token count',
        },
        {
          name: 'estimatedCost',
          type: 'number',
          description: 'Estimated cost in USD',
        },
        {
          name: 'percentUsed',
          type: 'number',
          description: 'Percentage of limit used',
        },
        {
          name: 'isOverLimit',
          type: 'boolean',
          description: 'Whether limit exceeded',
        },
        {
          name: 'countTokens',
          type: '(text: string) => number',
          description: 'Count tokens in text',
        },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-token-tracker',
    examples: [
      `import { useTokenTracker } from "@clarity-chat/react";

function TokenDisplay({ messages }) {
  const { totalTokens, estimatedCost, percentUsed } = useTokenTracker({
    model: 'gpt-4',
    messages,
    limit: 128000,
  });

  return (
    <div>
      <span>{totalTokens} tokens ({percentUsed}%)</span>
      <span>Est. cost: \${estimatedCost.toFixed(4)}</span>
    </div>
  );
}`,
    ],
    relatedHooks: ['useTokenOptimization', 'useChat'],
    version: '0.1.0',
  },
  {
    name: 'useTokenOptimization',
    description:
      'Automatically optimize token usage through context compression, message pruning, and smart caching.',
    category: 'analytics',
    signature:
      'useTokenOptimization(options?: UseTokenOptimizationOptions): UseTokenOptimizationReturn',
    parameters: [
      {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Messages to optimize',
      },
      {
        name: 'targetTokens',
        type: 'number',
        required: false,
        description: 'Target token count',
      },
      {
        name: 'strategy',
        type: "'prune' | 'compress' | 'summarize'",
        required: false,
        description: 'Optimization strategy',
      },
    ],
    returns: {
      type: 'UseTokenOptimizationReturn',
      properties: [
        {
          name: 'optimizedMessages',
          type: 'Message[]',
          description: 'Optimized message array',
        },
        {
          name: 'originalTokens',
          type: 'number',
          description: 'Original token count',
        },
        {
          name: 'optimizedTokens',
          type: 'number',
          description: 'Optimized token count',
        },
        {
          name: 'savings',
          type: 'number',
          description: 'Token savings percentage',
        },
        {
          name: 'optimize',
          type: '() => void',
          description: 'Trigger optimization',
        },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-token-optimization',
    examples: [
      `import { useTokenOptimization } from "@clarity-chat/react";

function OptimizedChat({ messages }) {
  const { optimizedMessages, savings } = useTokenOptimization({
    messages,
    targetTokens: 4000,
    strategy: 'compress',
  });

  return (
    <div>
      <span>Saved {savings}% tokens</span>
      <MessageList messages={optimizedMessages} />
    </div>
  );
}`,
    ],
    relatedHooks: ['useTokenTracker', 'useChat'],
    version: '0.1.0',
  },
  // UI Hooks
  {
    name: 'useAutoScroll',
    description:
      'Automatically scroll to bottom of chat when new messages arrive. Detects user scroll and pauses auto-scroll.',
    category: 'ui',
    signature:
      'useAutoScroll(options?: UseAutoScrollOptions): UseAutoScrollReturn',
    parameters: [
      {
        name: 'ref',
        type: 'RefObject<HTMLElement>',
        required: true,
        description: 'Container element ref',
      },
      {
        name: 'dependency',
        type: 'unknown[]',
        required: false,
        description: 'Deps to trigger scroll',
      },
      {
        name: 'behavior',
        type: "'smooth' | 'instant'",
        required: false,
        description: 'Scroll behavior',
      },
    ],
    returns: {
      type: 'UseAutoScrollReturn',
      properties: [
        {
          name: 'isAtBottom',
          type: 'boolean',
          description: 'Whether scrolled to bottom',
        },
        {
          name: 'scrollToBottom',
          type: '() => void',
          description: 'Scroll to bottom manually',
        },
        {
          name: 'isPaused',
          type: 'boolean',
          description: 'Whether auto-scroll is paused',
        },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-auto-scroll',
    examples: [
      `import { useAutoScroll } from "@clarity-chat/react";

function ChatMessages({ messages }) {
  const containerRef = useRef(null);
  const { isAtBottom, scrollToBottom } = useAutoScroll({
    ref: containerRef,
    dependency: [messages],
  });

  return (
    <div ref={containerRef}>
      {messages.map(m => <Message key={m.id} {...m} />)}
      {!isAtBottom && <button onClick={scrollToBottom}>New messages</button>}
    </div>
  );
}`,
    ],
    relatedHooks: ['useMessageList', 'useWindowSize'],
    version: '0.1.0',
  },
  {
    name: 'useClipboard',
    description:
      'Copy text to clipboard with success feedback. Works across browsers with fallback support.',
    category: 'ui',
    signature:
      'useClipboard(options?: UseClipboardOptions): UseClipboardReturn',
    parameters: [
      {
        name: 'timeout',
        type: 'number',
        required: false,
        description: 'Success state duration (ms)',
      },
    ],
    returns: {
      type: 'UseClipboardReturn',
      properties: [
        {
          name: 'copy',
          type: '(text: string) => Promise<void>',
          description: 'Copy text to clipboard',
        },
        {
          name: 'copied',
          type: 'boolean',
          description: 'Whether recently copied',
        },
        { name: 'error', type: 'Error | null', description: 'Any copy error' },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-clipboard',
    examples: [
      `import { useClipboard } from "@clarity-chat/react";

function CopyButton({ text }) {
  const { copy, copied } = useClipboard({ timeout: 2000 });

  return (
    <button onClick={() => copy(text)}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}`,
    ],
    relatedHooks: ['useKeyboardShortcuts'],
    version: '0.1.0',
  },
  {
    name: 'useKeyboardShortcuts',
    description:
      'Register and manage keyboard shortcuts. Supports key combinations, scopes, and conditional activation.',
    category: 'accessibility',
    signature: 'useKeyboardShortcuts(shortcuts: ShortcutConfig[]): void',
    parameters: [
      {
        name: 'shortcuts',
        type: 'ShortcutConfig[]',
        required: true,
        description: 'Array of shortcut configurations',
      },
    ],
    returns: {
      type: 'void',
      properties: [],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-keyboard-shortcuts',
    examples: [
      `import { useKeyboardShortcuts } from "@clarity-chat/react";

function Chat() {
  useKeyboardShortcuts([
    { key: 'Enter', modifiers: ['cmd'], action: () => handleSubmit() },
    { key: 'Escape', action: () => clearInput() },
    { key: 'k', modifiers: ['cmd'], action: () => openSearch() },
  ]);

  return <ChatComponent />;
}`,
    ],
    relatedHooks: ['useCommandPalette', 'useEventListener'],
    version: '0.1.0',
  },
  {
    name: 'useVoiceInput',
    description:
      'Speech recognition hook for voice-to-text input. Supports multiple languages and continuous listening.',
    category: 'input',
    signature:
      'useVoiceInput(options?: UseVoiceInputOptions): UseVoiceInputReturn',
    parameters: [
      {
        name: 'language',
        type: 'string',
        required: false,
        description: 'Recognition language code',
      },
      {
        name: 'continuous',
        type: 'boolean',
        required: false,
        description: 'Continuous listening mode',
      },
      {
        name: 'onResult',
        type: '(text: string) => void',
        required: false,
        description: 'Result callback',
      },
    ],
    returns: {
      type: 'UseVoiceInputReturn',
      properties: [
        {
          name: 'isListening',
          type: 'boolean',
          description: 'Whether actively listening',
        },
        {
          name: 'transcript',
          type: 'string',
          description: 'Current transcription',
        },
        {
          name: 'startListening',
          type: '() => void',
          description: 'Start speech recognition',
        },
        {
          name: 'stopListening',
          type: '() => void',
          description: 'Stop speech recognition',
        },
        {
          name: 'isSupported',
          type: 'boolean',
          description: 'Whether browser supports API',
        },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-voice-input',
    examples: [
      `import { useVoiceInput } from "@clarity-chat/react";

function VoiceChat() {
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceInput({
    language: 'en-US',
  });

  if (!isSupported) return <p>Voice not supported</p>;

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop' : 'Start'} Recording
      </button>
      <p>{transcript}</p>
    </div>
  );
}`,
    ],
    relatedHooks: ['useChat', 'useMediaQuery'],
    version: '0.1.0',
  },
  // Utility Hooks
  {
    name: 'useDebounce',
    description:
      'Debounce a value with configurable delay. Useful for search inputs and API calls.',
    category: 'utility',
    signature: 'useDebounce<T>(value: T, delay: number): T',
    parameters: [
      {
        name: 'value',
        type: 'T',
        required: true,
        description: 'Value to debounce',
      },
      {
        name: 'delay',
        type: 'number',
        required: true,
        description: 'Debounce delay in ms',
      },
    ],
    returns: {
      type: 'T',
      properties: [
        {
          name: 'debouncedValue',
          type: 'T',
          description: 'The debounced value',
        },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-debounce',
    examples: [
      `import { useDebounce } from "@clarity-chat/react";

function SearchChat() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch) {
      searchMessages(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />;
}`,
    ],
    relatedHooks: ['useThrottle', 'useDeferredSearch'],
    version: '0.1.0',
  },
  {
    name: 'useLocalStorage',
    description:
      'Persist state to localStorage with automatic serialization and SSR safety.',
    category: 'storage',
    signature:
      'useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]',
    parameters: [
      {
        name: 'key',
        type: 'string',
        required: true,
        description: 'Storage key',
      },
      {
        name: 'initialValue',
        type: 'T',
        required: true,
        description: 'Default value if not in storage',
      },
    ],
    returns: {
      type: '[T, (value: T) => void]',
      properties: [
        { name: 'value', type: 'T', description: 'Current stored value' },
        {
          name: 'setValue',
          type: '(value: T) => void',
          description: 'Update stored value',
        },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-local-storage',
    examples: [
      `import { useLocalStorage } from "@clarity-chat/react";

function ChatSettings() {
  const [theme, setTheme] = useLocalStorage('chat-theme', 'light');
  const [history, setHistory] = useLocalStorage('chat-history', []);

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}`,
    ],
    relatedHooks: ['useIndexedDB', 'useMemoryStore'],
    version: '0.1.0',
  },
  {
    name: 'useMediaQuery',
    description:
      'Responsive design hook that tracks media query matches. Useful for adaptive UI.',
    category: 'utility',
    signature: 'useMediaQuery(query: string): boolean',
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'CSS media query string',
      },
    ],
    returns: {
      type: 'boolean',
      properties: [
        {
          name: 'matches',
          type: 'boolean',
          description: 'Whether query matches',
        },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-media-query',
    examples: [
      `import { useMediaQuery } from "@clarity-chat/react";

function ResponsiveChat() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <ClarityChat
      layout={isMobile ? 'compact' : 'default'}
      theme={prefersDark ? 'dark' : 'light'}
    />
  );
}`,
    ],
    relatedHooks: ['useWindowSize', 'useMobileKeyboard'],
    version: '0.1.0',
  },
  {
    name: 'useErrorRecovery',
    description:
      'Automatic error recovery with retry logic, exponential backoff, and fallback strategies.',
    category: 'error-handling',
    signature:
      'useErrorRecovery(options?: UseErrorRecoveryOptions): UseErrorRecoveryReturn',
    parameters: [
      {
        name: 'maxRetries',
        type: 'number',
        required: false,
        description: 'Maximum retry attempts',
      },
      {
        name: 'backoffMs',
        type: 'number',
        required: false,
        description: 'Initial backoff delay',
      },
      {
        name: 'onError',
        type: '(error: Error, attempt: number) => void',
        required: false,
        description: 'Error callback',
      },
    ],
    returns: {
      type: 'UseErrorRecoveryReturn',
      properties: [
        { name: 'error', type: 'Error | null', description: 'Current error' },
        {
          name: 'retryCount',
          type: 'number',
          description: 'Current retry count',
        },
        {
          name: 'isRetrying',
          type: 'boolean',
          description: 'Whether retrying',
        },
        { name: 'retry', type: '() => void', description: 'Trigger retry' },
        { name: 'reset', type: '() => void', description: 'Reset error state' },
        {
          name: 'execute',
          type: '(fn: () => Promise<T>) => Promise<T>',
          description: 'Execute with recovery',
        },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-error-recovery',
    examples: [
      `import { useErrorRecovery } from "@clarity-chat/react";

function ReliableChat() {
  const { execute, error, isRetrying, retry } = useErrorRecovery({
    maxRetries: 3,
    backoffMs: 1000,
  });

  const sendMessage = async (text) => {
    await execute(() => api.sendMessage(text));
  };

  return (
    <div>
      {error && (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}
      {isRetrying && <p>Retrying...</p>}
    </div>
  );
}`,
    ],
    relatedHooks: ['useChat', 'useStreaming'],
    version: '0.1.0',
  },
]

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: API_RESPONSE_HEADERS,
  })
}

/**
 * GET /api/ai/hooks
 *
 * Returns a complete catalog of Clarity Chat hooks
 * with their parameters, returns, and usage examples.
 */
export async function GET() {
  try {
    // Merge curated hooks with auto-generated data from source
    const allHooks = mergeHookData(curatedHooks)

    // Extract unique categories with proper typing
    const categories = [
      ...new Set(allHooks.map((h) => h.category)),
    ] as HookCategory[]

    const dataSourceInfo = getDataSourceInfo()

    const response: HooksAPIResponse & { dataSource?: unknown } = {
      name: 'Clarity Chat Hooks',
      version: PACKAGE_VERSION,
      apiVersion: AI_API_VERSION,
      description: 'React hooks for building AI chat interfaces',
      totalHooks: allHooks.length,
      categories,
      lastUpdated: getStableTimestamp(),
      hooks: allHooks,
      usage: {
        installation: 'npm install @clarity-chat/react',
        basicImport:
          'import { useChat, useStreaming, useTokenTracker } from "@clarity-chat/react"',
        documentation: `${BASE_URL}/reference/hooks`,
      },
      dataSource: {
        curated: curatedHooks.length,
        generated: allHooks.length - curatedHooks.length,
        ...dataSourceInfo,
      },
    }

    return NextResponse.json(response, {
      headers: API_RESPONSE_HEADERS,
    })
  } catch (error) {
    logger.error('[AI Hooks API] Error:', error)

    const errorResponse = createErrorResponse(
      'INTERNAL_ERROR',
      'An unexpected error occurred while fetching hooks',
      '/api/ai/hooks',
      error instanceof Error ? error.message : undefined
    )

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: API_RESPONSE_HEADERS,
    })
  }
}
