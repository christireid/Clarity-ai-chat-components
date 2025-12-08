import { NextResponse } from 'next/server'
import {
  type ComponentInfo,
  type ComponentsAPIResponse,
  type ComponentCategory,
  API_RESPONSE_HEADERS,
  AI_API_VERSION,
  BASE_URL,
  PACKAGE_VERSION,
  createErrorResponse,
  getStableTimestamp,
} from '@/lib/ai/types'
import {
  mergeComponentData,
  getDataSourceInfo,
} from '@/lib/ai/merge-component-data'

/**
 * AI-Optimized Components API
 *
 * Provides a structured JSON endpoint for AI systems to discover
 * and understand Clarity Chat components.
 *
 * @route GET /api/ai/components
 * @route OPTIONS /api/ai/components (CORS preflight)
 */

// Curated component data with detailed documentation
const curatedComponents: ComponentInfo[] = [
  // Core Chat Components
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
      {
        name: 'enableVoice',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Enable voice input',
      },
      {
        name: 'enableFileUpload',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Enable file attachments',
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
      'High contrast support',
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
      {
        name: 'height',
        type: 'string | number',
        required: false,
        default: '100%',
        description: 'Container height',
      },
      {
        name: 'showHeader',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show header section',
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
      'Displays a list of chat messages with virtualization support for performance. Handles message grouping, timestamps, and animations.',
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
      {
        name: 'groupByDate',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Group messages by date',
      },
      {
        name: 'showTimestamps',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show message timestamps',
      },
      {
        name: 'onMessageAction',
        type: '(action: string, message: Message) => void',
        required: false,
        description: 'Handle message actions (copy, edit, delete)',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/message-list',
    examples: [
      'import { MessageList } from "@clarity-chat/react";\n\n<MessageList\n  messages={messages}\n  virtualize={messages.length > 100}\n  showTimestamps\n/>',
    ],
    relatedComponents: [
      'Message',
      'StreamingMessage',
      'VirtualizedMessageList',
    ],
    accessibility: [
      'ARIA live regions for new messages',
      'Keyboard navigation between messages',
    ],
    version: '0.1.0',
  },
  {
    name: 'ChatInput',
    description:
      'User input component with support for text, voice input, file attachments, and keyboard shortcuts.',
    category: 'core',
    props: [
      {
        name: 'onSend',
        type: '(message: string, attachments?: File[]) => void',
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
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Disable input',
      },
      {
        name: 'maxLength',
        type: 'number',
        required: false,
        description: 'Maximum message length',
      },
      {
        name: 'enableVoice',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Enable voice input button',
      },
      {
        name: 'enableAttachments',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Enable file attachments',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/chat-input',
    examples: [
      'import { ChatInput } from "@clarity-chat/react";\n\n<ChatInput\n  onSend={handleSend}\n  placeholder="Ask me anything..."\n  enableVoice\n  enableAttachments\n/>',
    ],
    relatedComponents: ['VoiceInput', 'FileUpload', 'AdvancedChatInput'],
    accessibility: ['Auto-growing textarea', 'Submit with Enter or Ctrl+Enter'],
    version: '0.1.0',
  },
  {
    name: 'StreamingMessage',
    description:
      'Displays AI responses with real-time streaming animation. Shows text appearing character by character or word by word.',
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
      {
        name: 'typingSpeed',
        type: 'number',
        required: false,
        default: '30',
        description: 'Characters per second for typing animation',
      },
      {
        name: 'showCursor',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show blinking cursor while streaming',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/streaming-message',
    examples: [
      'import { StreamingMessage } from "@clarity-chat/react";\n\n<StreamingMessage\n  content={streamingContent}\n  isStreaming={isLoading}\n  typingSpeed={50}\n/>',
    ],
    relatedComponents: ['Message', 'ThinkingIndicator', 'StreamBlock'],
    accessibility: ['ARIA live region for streaming content'],
    version: '0.1.0',
  },
  {
    name: 'ThinkingIndicator',
    description:
      'Animated indicator shown while AI is processing a request. Provides visual feedback during loading states.',
    category: 'feedback',
    props: [
      {
        name: 'variant',
        type: "'dots' | 'pulse' | 'wave' | 'spinner'",
        required: false,
        default: 'dots',
        description: 'Animation style',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        required: false,
        default: 'md',
        description: 'Indicator size',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: 'Thinking...',
        description: 'Accessibility label',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/thinking-indicator',
    examples: [
      'import { ThinkingIndicator } from "@clarity-chat/react";\n\n{isLoading && <ThinkingIndicator variant="dots" />}',
    ],
    relatedComponents: ['Skeleton', 'Progress', 'StreamingMessage'],
    accessibility: ['ARIA role="status"', 'Screen reader announcement'],
    version: '0.1.0',
  },
  {
    name: 'TokenCounter',
    description:
      'Real-time display of token usage for the current conversation. Shows used tokens, limit, and cost estimation.',
    category: 'analytics',
    props: [
      {
        name: 'tokens',
        type: 'number',
        required: true,
        description: 'Current token count',
      },
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Maximum token limit',
      },
      {
        name: 'showCost',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show estimated cost',
      },
      {
        name: 'model',
        type: 'string',
        required: false,
        description: 'Model name for cost calculation',
      },
      {
        name: 'variant',
        type: "'minimal' | 'detailed' | 'badge'",
        required: false,
        default: 'minimal',
        description: 'Display variant',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/token-counter',
    examples: [
      'import { TokenCounter } from "@clarity-chat/react";\n\n<TokenCounter\n  tokens={currentTokens}\n  limit={128000}\n  showCost\n  model="gpt-4"\n/>',
    ],
    relatedComponents: [
      'TokenOptimizationDashboard',
      'TokenOptimizationBadge',
      'ContextVisualizer',
    ],
    accessibility: ['Clear numeric display', 'Color-coded warnings'],
    version: '0.1.0',
  },
  // UI Components
  {
    name: 'Button',
    description:
      'Accessible button component with multiple variants, sizes, and states. Supports icons and loading states.',
    category: 'ui',
    props: [
      {
        name: 'variant',
        type: "'default' | 'primary' | 'secondary' | 'ghost' | 'destructive'",
        required: false,
        default: 'default',
        description: 'Visual variant',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        required: false,
        default: 'md',
        description: 'Button size',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Disabled state',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Loading state with spinner',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        required: false,
        description: 'Icon element',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/button',
    examples: [
      'import { Button } from "@clarity-chat/react";\n\n<Button variant="primary" onClick={handleClick}>Send</Button>',
    ],
    relatedComponents: ['IconButton', 'RetryButton', 'CopyButton'],
    accessibility: [
      'Focus ring',
      'Disabled state handling',
      'Loading announcement',
    ],
    version: '0.1.0',
  },
  {
    name: 'Avatar',
    description:
      'User and AI avatar component with fallback initials, status indicators, and customizable sizes.',
    category: 'ui',
    props: [
      {
        name: 'src',
        type: 'string',
        required: false,
        description: 'Image source URL',
      },
      {
        name: 'alt',
        type: 'string',
        required: true,
        description: 'Alt text for accessibility',
      },
      {
        name: 'fallback',
        type: 'string',
        required: false,
        description: 'Fallback text (initials)',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'xl'",
        required: false,
        default: 'md',
        description: 'Avatar size',
      },
      {
        name: 'status',
        type: "'online' | 'offline' | 'busy'",
        required: false,
        description: 'Status indicator',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/avatar',
    examples: [
      'import { Avatar } from "@clarity-chat/react";\n\n<Avatar src="/user.jpg" alt="John Doe" fallback="JD" />',
    ],
    relatedComponents: ['Badge', 'Message'],
    accessibility: ['Alt text required', 'Status announced to screen readers'],
    version: '0.1.0',
  },
  {
    name: 'Toast',
    description:
      'Notification toast component for success, error, warning, and info messages.',
    category: 'feedback',
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Toast title',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Toast description',
      },
      {
        name: 'variant',
        type: "'default' | 'success' | 'error' | 'warning' | 'info'",
        required: false,
        default: 'default',
        description: 'Toast variant',
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: '5000',
        description: 'Auto-dismiss duration (ms)',
      },
      {
        name: 'action',
        type: '{ label: string; onClick: () => void }',
        required: false,
        description: 'Action button',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/toast',
    examples: [
      'import { toast } from "@clarity-chat/react";\n\ntoast.success("Message sent!", { description: "Your message was delivered." });',
    ],
    relatedComponents: ['Toaster', 'FeedbackAnimation'],
    accessibility: ['ARIA role="alert"', 'Dismissable with keyboard'],
    version: '0.1.0',
  },
  // Advanced Components
  {
    name: 'VoiceInput',
    description:
      'Speech-to-text input component with real-time transcription and language detection.',
    category: 'input',
    props: [
      {
        name: 'onTranscript',
        type: '(text: string) => void',
        required: true,
        description: 'Callback with transcribed text',
      },
      {
        name: 'language',
        type: 'string',
        required: false,
        default: 'en-US',
        description: 'Recognition language',
      },
      {
        name: 'continuous',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Continuous listening mode',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/voice-input',
    examples: [
      'import { VoiceInput } from "@clarity-chat/react";\n\n<VoiceInput onTranscript={setInputText} language="en-US" />',
    ],
    relatedComponents: ['ChatInput', 'useVoiceInput'],
    accessibility: [
      'Visual feedback for recording state',
      'Keyboard activation',
    ],
    version: '0.1.0',
  },
  {
    name: 'CodeBlock',
    description:
      'Syntax-highlighted code display with copy button, line numbers, and language detection.',
    category: 'display',
    props: [
      {
        name: 'code',
        type: 'string',
        required: true,
        description: 'Code content',
      },
      {
        name: 'language',
        type: 'string',
        required: false,
        description: 'Programming language for highlighting',
      },
      {
        name: 'showLineNumbers',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show line numbers',
      },
      {
        name: 'highlightLines',
        type: 'number[]',
        required: false,
        description: 'Lines to highlight',
      },
      {
        name: 'filename',
        type: 'string',
        required: false,
        description: 'Filename to display',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl:
      'https://clarity-chat.dev/reference/components/enhanced-code-block',
    examples: [
      'import { CodeBlock } from "@clarity-chat/react";\n\n<CodeBlock\n  code={`const greeting = "Hello, World!";`}\n  language="typescript"\n  filename="example.ts"\n/>',
    ],
    relatedComponents: ['MarkdownRenderer', 'CopyButton'],
    accessibility: [
      'Copy button with keyboard support',
      'Code announced to screen readers',
    ],
    version: '0.1.0',
  },
  {
    name: 'MarkdownRenderer',
    description:
      'Rich markdown rendering with syntax highlighting, math (KaTeX), diagrams (Mermaid), and custom components.',
    category: 'display',
    props: [
      {
        name: 'content',
        type: 'string',
        required: true,
        description: 'Markdown content',
      },
      {
        name: 'enableMath',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Enable KaTeX math rendering',
      },
      {
        name: 'enableDiagrams',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Enable Mermaid diagrams',
      },
      {
        name: 'components',
        type: 'object',
        required: false,
        description: 'Custom component overrides',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl:
      'https://clarity-chat.dev/reference/components/markdown-renderer-enhanced',
    examples: [
      'import { MarkdownRenderer } from "@clarity-chat/react";\n\n<MarkdownRenderer\n  content={aiResponse}\n  enableMath\n  enableDiagrams\n/>',
    ],
    relatedComponents: ['CodeBlock', 'StreamingMessage', 'LinkPreview'],
    accessibility: ['Semantic HTML output', 'Heading hierarchy preserved'],
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
 * GET /api/ai/components
 *
 * Returns a complete catalog of Clarity Chat components
 * with their props, examples, and accessibility information.
 */
export async function GET() {
  try {
    // Merge curated components with auto-generated data from source
    const allComponents = mergeComponentData(curatedComponents)

    // Extract unique categories with proper typing
    const categories = [
      ...new Set(allComponents.map((c) => c.category)),
    ] as ComponentCategory[]

    const dataSourceInfo = getDataSourceInfo()

    const response: ComponentsAPIResponse & { dataSource?: unknown } = {
      name: 'Clarity Chat Components',
      version: PACKAGE_VERSION,
      apiVersion: AI_API_VERSION,
      description:
        'Enterprise-grade React component library for AI chat interfaces',
      totalComponents: allComponents.length,
      categories,
      lastUpdated: getStableTimestamp(),
      components: allComponents,
      usage: {
        installation: 'npm install @clarity-chat/react',
        basicImport:
          'import { ClarityChat, useChat } from "@clarity-chat/react"',
        documentation: BASE_URL,
      },
      dataSource: {
        curated: curatedComponents.length,
        generated: allComponents.length - curatedComponents.length,
        ...dataSourceInfo,
      },
    }

    return NextResponse.json(response, {
      headers: API_RESPONSE_HEADERS,
    })
  } catch (error) {
    console.error('[AI Components API] Error:', error)

    const errorResponse = createErrorResponse(
      'INTERNAL_ERROR',
      'An unexpected error occurred while fetching components',
      '/api/ai/components',
      error instanceof Error ? error.message : undefined
    )

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: API_RESPONSE_HEADERS,
    })
  }
}
