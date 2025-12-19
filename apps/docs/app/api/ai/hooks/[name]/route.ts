import { NextResponse } from 'next/server'
import {
  type HookInfo,
  API_RESPONSE_HEADERS,
  AI_API_VERSION,
  BASE_URL,
  PACKAGE_VERSION,
  createErrorResponse,
  getStableTimestamp,
} from '@/lib/ai/types'
import { logger } from '@/lib/logger'

/**
 * Single Hook Lookup API
 *
 * Returns detailed information about a specific hook by name.
 *
 * @route GET /api/ai/hooks/[name]
 * @route OPTIONS /api/ai/hooks/[name] (CORS preflight)
 */

// Sample hooks data - subset for the lookup endpoint
const hooks: HookInfo[] = [
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
          name: 'handleSubmit',
          type: '(e: FormEvent) => void',
          description: 'Form submit handler',
        },
        { name: 'isLoading', type: 'boolean', description: 'Loading state' },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-chat',
    examples: [
      'import { useChat } from "@clarity-chat/react";\n\nconst { messages, handleSubmit, isLoading } = useChat({ api: "/api/chat" });',
    ],
    relatedHooks: ['useChatEnhanced', 'useStreaming', 'useCompletion'],
    version: '0.1.0',
  },
  {
    name: 'useStreaming',
    description:
      'Hook for handling streaming responses. Supports SSE and WebSocket protocols.',
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
        { name: 'start', type: '() => void', description: 'Start streaming' },
        { name: 'stop', type: '() => void', description: 'Stop streaming' },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-streaming',
    examples: [
      'import { useStreaming } from "@clarity-chat/react";\n\nconst { data, isStreaming, start } = useStreaming({ url: "/api/stream" });',
    ],
    relatedHooks: ['useChat', 'useStreamingSSE'],
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
          name: 'estimatedCost',
          type: 'number',
          description: 'Estimated cost in USD',
        },
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-token-tracker',
    examples: [
      'import { useTokenTracker } from "@clarity-chat/react";\n\nconst { totalTokens, estimatedCost } = useTokenTracker({ model: "gpt-4", messages });',
    ],
    relatedHooks: ['useTokenOptimization', 'useChat'],
    version: '0.1.0',
  },
  {
    name: 'useAutoScroll',
    description:
      'Automatically scroll to bottom of chat when new messages arrive.',
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
      ],
    },
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/hooks/use-auto-scroll',
    examples: [
      'import { useAutoScroll } from "@clarity-chat/react";\n\nconst { isAtBottom, scrollToBottom } = useAutoScroll({ ref: containerRef, dependency: [messages] });',
    ],
    relatedHooks: ['useMessageList'],
    version: '0.1.0',
  },
  {
    name: 'useDebounce',
    description: 'Debounce a value with configurable delay.',
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
      'import { useDebounce } from "@clarity-chat/react";\n\nconst debouncedSearch = useDebounce(searchTerm, 300);',
    ],
    relatedHooks: ['useThrottle'],
    version: '0.1.0',
  },
]

// Create a lookup map
const hookMap = new Map(hooks.map((h) => [h.name.toLowerCase(), h]))

// Find similar hooks for suggestions
function findSimilarHooks(name: string): string[] {
  const searchTerm = name.toLowerCase()
  return hooks
    .filter((h) => {
      const hookName = h.name.toLowerCase()
      return (
        hookName.includes(searchTerm) ||
        searchTerm.includes(hookName) ||
        levenshteinDistance(hookName, searchTerm) <= 3
      )
    })
    .map((h) => h.name)
    .slice(0, 5)
}

// Simple Levenshtein distance for similarity
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

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
 * GET /api/ai/hooks/[name]
 *
 * Returns a single hook by name
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const hook = hookMap.get(name.toLowerCase())

    if (!hook) {
      const suggestions = findSimilarHooks(name)
      const errorResponse = createErrorResponse(
        'NOT_FOUND',
        `Hook "${name}" not found`,
        `/api/ai/hooks/${name}`,
        suggestions.length > 0
          ? `Did you mean: ${suggestions.join(', ')}?`
          : undefined
      )

      return NextResponse.json(errorResponse, {
        status: 404,
        headers: API_RESPONSE_HEADERS,
      })
    }

    const response = {
      ...hook,
      apiVersion: AI_API_VERSION,
      packageVersion: PACKAGE_VERSION,
      lastUpdated: getStableTimestamp(),
      links: {
        self: `${BASE_URL}/api/ai/hooks/${hook.name}`,
        documentation: hook.docsUrl,
        allHooks: `${BASE_URL}/api/ai/hooks`,
      },
    }

    return NextResponse.json(response, {
      headers: API_RESPONSE_HEADERS,
    })
  } catch (error) {
    logger.error('[AI Hook Lookup API] Error:', error)

    const errorResponse = createErrorResponse(
      'INTERNAL_ERROR',
      'An unexpected error occurred',
      '/api/ai/hooks/[name]',
      error instanceof Error ? error.message : undefined
    )

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: API_RESPONSE_HEADERS,
    })
  }
}
