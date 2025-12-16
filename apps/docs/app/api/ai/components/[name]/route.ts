import { NextResponse } from 'next/server'
import {
  type ComponentInfo,
  API_RESPONSE_HEADERS,
  AI_API_VERSION,
  BASE_URL,
  PACKAGE_VERSION,
  createErrorResponse,
  getStableTimestamp,
} from '@/lib/ai/types'
import { logApiError } from '@/lib/security/secureLogger'

/**
 * Single Component Lookup API
 *
 * Returns detailed information about a specific component by name.
 *
 * @route GET /api/ai/components/[name]
 * @route OPTIONS /api/ai/components/[name] (CORS preflight)
 */

// Import components data from parent route
// In a real implementation, this would be a shared data source
const components: ComponentInfo[] = [
  {
    name: 'ClarityChat',
    description:
      'All-in-one chat component that combines ChatWindow, MessageList, and ChatInput with built-in state management, streaming support, and token optimization.',
    category: 'core',
    props: [
      {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of chat messages to display',
      },
      {
        name: 'onSend',
        type: '(message: string) => void',
        required: true,
        description: 'Callback when user sends a message',
      },
      {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Shows loading/thinking indicator',
      },
      {
        name: 'theme',
        type: 'Theme',
        required: false,
        default: 'default',
        description: 'Visual theme for the chat',
      },
      {
        name: 'enableStreaming',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Enable real-time streaming responses',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/clarity-chat',
    examples: [
      'import { ClarityChat } from "@clarity-chat/react";\n\nfunction App() {\n  const [messages, setMessages] = useState([]);\n  return <ClarityChat messages={messages} onSend={handleSend} />;\n}',
    ],
    relatedComponents: ['ChatWindow', 'MessageList', 'ChatInput'],
    accessibility: [
      'WCAG 2.1 AAA compliant',
      'Full keyboard navigation',
      'Screen reader optimized',
    ],
    version: '0.1.0',
  },
  {
    name: 'ChatWindow',
    description:
      'Container component for chat interfaces. Provides layout structure, scroll management, and responsive design.',
    category: 'core',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Child components (typically MessageList and ChatInput)',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/chat-window',
    examples: [
      'import { ChatWindow, MessageList, ChatInput } from "@clarity-chat/react";\n\n<ChatWindow>\n  <MessageList messages={messages} />\n  <ChatInput onSend={handleSend} />\n</ChatWindow>',
    ],
    relatedComponents: ['MessageList', 'ChatInput', 'ClarityChat'],
    accessibility: ['Semantic HTML structure', 'Focus management'],
    version: '0.1.0',
  },
  {
    name: 'MessageList',
    description:
      'Displays a list of chat messages with virtualization support for performance.',
    category: 'core',
    props: [
      {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of messages to display',
      },
      {
        name: 'virtualize',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Enable virtualization for large lists',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/message-list',
    examples: [
      'import { MessageList } from "@clarity-chat/react";\n\n<MessageList messages={messages} virtualize={messages.length > 100} />',
    ],
    relatedComponents: ['Message', 'StreamingMessage'],
    accessibility: ['ARIA live regions for new messages'],
    version: '0.1.0',
  },
  {
    name: 'ChatInput',
    description:
      'User input component with support for text, voice input, file attachments.',
    category: 'core',
    props: [
      {
        name: 'onSend',
        type: '(message: string) => void',
        required: true,
        description: 'Callback when user submits message',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'Type a message...',
        description: 'Input placeholder text',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/chat-input',
    examples: [
      'import { ChatInput } from "@clarity-chat/react";\n\n<ChatInput onSend={handleSend} placeholder="Ask me anything..." />',
    ],
    relatedComponents: ['VoiceInput', 'FileUpload'],
    accessibility: ['Auto-growing textarea', 'Submit with Enter'],
    version: '0.1.0',
  },
  {
    name: 'StreamingMessage',
    description: 'Displays AI responses with real-time streaming animation.',
    category: 'core',
    props: [
      {
        name: 'content',
        type: 'string',
        required: true,
        description: 'Message content (can be partial during streaming)',
      },
      {
        name: 'isStreaming',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Whether content is still streaming',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/streaming-message',
    examples: [
      'import { StreamingMessage } from "@clarity-chat/react";\n\n<StreamingMessage content={content} isStreaming={isLoading} />',
    ],
    relatedComponents: ['Message', 'ThinkingIndicator'],
    accessibility: ['ARIA live region for streaming content'],
    version: '0.1.0',
  },
]

// Create a lookup map
const componentMap = new Map(components.map((c) => [c.name.toLowerCase(), c]))

// Find similar components for suggestions
function findSimilarComponents(name: string): string[] {
  const searchTerm = name.toLowerCase()
  return components
    .filter((c) => {
      const componentName = c.name.toLowerCase()
      return (
        componentName.includes(searchTerm) ||
        searchTerm.includes(componentName) ||
        levenshteinDistance(componentName, searchTerm) <= 3
      )
    })
    .map((c) => c.name)
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
 * GET /api/ai/components/[name]
 *
 * Returns a single component by name
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const component = componentMap.get(name.toLowerCase())

    if (!component) {
      const suggestions = findSimilarComponents(name)
      const errorResponse = createErrorResponse(
        'NOT_FOUND',
        `Component "${name}" not found`,
        `/api/ai/components/${name}`,
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
      ...component,
      apiVersion: AI_API_VERSION,
      packageVersion: PACKAGE_VERSION,
      lastUpdated: getStableTimestamp(),
      links: {
        self: `${BASE_URL}/api/ai/components/${component.name}`,
        documentation: component.docsUrl,
        allComponents: `${BASE_URL}/api/ai/components`,
      },
    }

    return NextResponse.json(response, {
      headers: API_RESPONSE_HEADERS,
    })
  } catch (error) {
    logApiError(error as Error, 'AI Component Lookup API', null)

    const errorResponse = createErrorResponse(
      'INTERNAL_ERROR',
      'An unexpected error occurred',
      '/api/ai/components/[name]',
      error instanceof Error ? error.message : undefined
    )

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: API_RESPONSE_HEADERS,
    })
  }
}
