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
import { getLogger } from '@/lib/logging'

const logger = getLogger('ai-components-api')

// Ensure route is dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
  // Provider Components
  {
    name: 'MemoryProvider',
    description:
      'Context provider that enables conversation memory persistence. Wrap your app to enable automatic memory retrieval and storage for all chat components.',
    category: 'provider',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Child components that need memory access',
      },
      {
        name: 'adapter',
        type: "'indexeddb' | 'localStorage' | 'memory' | MemoryAdapter",
        required: false,
        default: 'indexeddb',
        description: 'Storage adapter for memory persistence',
      },
      {
        name: 'maxMemories',
        type: 'number',
        required: false,
        default: '1000',
        description: 'Maximum number of memories to retain',
      },
      {
        name: 'contextWindowSize',
        type: 'number',
        required: false,
        default: '10',
        description: 'Number of relevant memories to inject',
      },
      {
        name: 'embeddingProvider',
        type: "'openai' | 'local'",
        required: false,
        default: 'local',
        description: 'Provider for generating embeddings',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/memory-provider',
    examples: [
      'import { MemoryProvider, ClarityChat } from "@clarity-chat/react";\n\nfunction App() {\n  return (\n    <MemoryProvider adapter="indexeddb" maxMemories={500}>\n      <ClarityChat messages={messages} onSend={handleSend} />\n    </MemoryProvider>\n  );\n}',
    ],
    relatedComponents: ['ClarityChat', 'useMemoryContext'],
    accessibility: ['No visual component', 'Manages context only'],
    version: '0.1.0',
  },
  {
    name: 'ThemeProvider',
    description:
      'Context provider for theming all Clarity Chat components. Supports light/dark mode, custom themes, and CSS variable customization.',
    category: 'provider',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Child components to theme',
      },
      {
        name: 'defaultTheme',
        type: 'Theme',
        required: false,
        default: 'default',
        description: 'Initial theme to apply',
      },
      {
        name: 'storageKey',
        type: 'string',
        required: false,
        default: 'clarity-theme',
        description: 'localStorage key for persisting theme',
      },
      {
        name: 'disableTransitionOnChange',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Disable CSS transitions during theme changes',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/learn/concepts/theming',
    examples: [
      'import { ThemeProvider, ClarityChat } from "@clarity-chat/react";\n\nfunction App() {\n  return (\n    <ThemeProvider defaultTheme={myCustomTheme}>\n      <ClarityChat messages={messages} onSend={handleSend} />\n    </ThemeProvider>\n  );\n}',
    ],
    relatedComponents: ['useTheme', 'useDesignTokens'],
    accessibility: ['Respects prefers-color-scheme', 'High contrast support'],
    version: '0.1.0',
  },
  // Interactive Components
  {
    name: 'FileUpload',
    description:
      'Drag-and-drop file upload component with preview, progress indicators, and validation. Supports images, documents, and custom file types.',
    category: 'input',
    props: [
      {
        name: 'onUpload',
        type: '(files: File[]) => void | Promise<void>',
        required: true,
        description: 'Callback when files are selected or dropped',
      },
      {
        name: 'accept',
        type: 'string | string[]',
        required: false,
        description: 'Accepted file types (e.g., "image/*", ".pdf")',
      },
      {
        name: 'maxSize',
        type: 'number',
        required: false,
        default: '10485760',
        description: 'Maximum file size in bytes (default 10MB)',
      },
      {
        name: 'maxFiles',
        type: 'number',
        required: false,
        default: '5',
        description: 'Maximum number of files',
      },
      {
        name: 'showPreview',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show thumbnail previews for images',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Disable file upload',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/file-upload',
    examples: [
      'import { FileUpload } from "@clarity-chat/react";\n\n<FileUpload\n  onUpload={handleFiles}\n  accept={["image/*", ".pdf"]}\n  maxSize={5 * 1024 * 1024}\n  maxFiles={3}\n/>',
    ],
    relatedComponents: ['ChatInput', 'AdvancedChatInput', 'ImagePreview'],
    accessibility: [
      'Keyboard accessible drop zone',
      'Screen reader announcements for uploads',
      'Progress announced',
    ],
    version: '0.1.0',
  },
  {
    name: 'CommandPalette',
    description:
      'Keyboard-navigable command palette (Cmd+K) for quick actions. Supports fuzzy search, categories, and keyboard shortcuts.',
    category: 'interactive',
    props: [
      {
        name: 'commands',
        type: 'Command[]',
        required: true,
        description: 'Array of available commands',
      },
      {
        name: 'onSelect',
        type: '(command: Command) => void',
        required: true,
        description: 'Callback when command is selected',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'Search commands...',
        description: 'Search input placeholder',
      },
      {
        name: 'trigger',
        type: 'string',
        required: false,
        default: 'cmd+k',
        description: 'Keyboard shortcut to open',
      },
      {
        name: 'groupByCategory',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Group commands by category',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/command-palette',
    examples: [
      'import { CommandPalette } from "@clarity-chat/react";\n\nconst commands = [\n  { id: "new-chat", label: "New Chat", category: "Chat", shortcut: "n" },\n  { id: "clear", label: "Clear Messages", category: "Chat" },\n];\n\n<CommandPalette commands={commands} onSelect={handleCommand} />',
    ],
    relatedComponents: ['useCommandPalette', 'KeyboardHint'],
    accessibility: [
      'Full keyboard navigation',
      'ARIA combobox pattern',
      'Focus management',
    ],
    version: '0.1.0',
  },
  {
    name: 'ToolInvocationCard',
    description:
      'Displays AI tool/function calls with status, parameters, and results. Used for showing agent actions in chat.',
    category: 'display',
    props: [
      {
        name: 'toolCall',
        type: 'ToolCall',
        required: true,
        description: 'Tool call data with name, arguments, and result',
      },
      {
        name: 'status',
        type: "'pending' | 'running' | 'success' | 'error'",
        required: false,
        default: 'pending',
        description: 'Current execution status',
      },
      {
        name: 'showArgs',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show tool arguments',
      },
      {
        name: 'showResult',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show tool result when complete',
      },
      {
        name: 'collapsible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Allow collapsing/expanding details',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl:
      'https://clarity-chat.dev/reference/components/tool-invocation-card',
    examples: [
      'import { ToolInvocationCard } from "@clarity-chat/react";\n\n<ToolInvocationCard\n  toolCall={{\n    id: "call_123",\n    name: "search_web",\n    arguments: { query: "weather NYC" },\n    result: { temperature: 72, condition: "sunny" }\n  }}\n  status="success"\n/>',
    ],
    relatedComponents: ['Message', 'StreamingMessage', 'useAgent'],
    accessibility: ['Expandable regions', 'Status announced'],
    version: '0.1.0',
  },
  {
    name: 'ContextMenu',
    description:
      'Right-click context menu for message actions like copy, edit, regenerate, and delete.',
    category: 'interactive',
    props: [
      {
        name: 'items',
        type: 'ContextMenuItem[]',
        required: true,
        description: 'Array of menu items',
      },
      {
        name: 'onSelect',
        type: '(item: ContextMenuItem) => void',
        required: true,
        description: 'Callback when item is selected',
      },
      {
        name: 'trigger',
        type: 'ReactNode',
        required: true,
        description: 'Element that triggers the context menu',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/context-menu',
    examples: [
      'import { ContextMenu } from "@clarity-chat/react";\n\n<ContextMenu\n  items={[\n    { id: "copy", label: "Copy", icon: CopyIcon },\n    { id: "edit", label: "Edit", icon: EditIcon },\n    { id: "delete", label: "Delete", icon: TrashIcon, variant: "destructive" },\n  ]}\n  onSelect={handleAction}\n  trigger={<Message message={msg} />}\n/>',
    ],
    relatedComponents: ['Message', 'MessageList', 'useMessageOperations'],
    accessibility: ['Keyboard navigation', 'Focus trap', 'Escape to close'],
    version: '0.1.0',
  },
  // Enterprise Components
  {
    name: 'UsageDashboard',
    description:
      'Analytics dashboard showing token usage, costs, and conversation metrics. Includes charts and export functionality.',
    category: 'analytics',
    props: [
      {
        name: 'data',
        type: 'UsageData',
        required: true,
        description: 'Usage data to display',
      },
      {
        name: 'dateRange',
        type: '{ start: Date; end: Date }',
        required: false,
        description: 'Date range filter',
      },
      {
        name: 'showCosts',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display cost information',
      },
      {
        name: 'exportFormats',
        type: "('csv' | 'json' | 'pdf')[]",
        required: false,
        default: "['csv', 'json']",
        description: 'Available export formats',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/usage-dashboard',
    examples: [
      'import { UsageDashboard } from "@clarity-chat/react";\n\n<UsageDashboard\n  data={usageData}\n  dateRange={{ start: startDate, end: endDate }}\n  showCosts\n/>',
    ],
    relatedComponents: [
      'TokenCounter',
      'TokenOptimizationDashboard',
      'useDashboardData',
    ],
    accessibility: [
      'Chart alternatives for screen readers',
      'Keyboard navigation',
    ],
    version: '0.1.0',
  },
  {
    name: 'VirtualizedMessageList',
    description:
      'High-performance message list using virtualization for conversations with thousands of messages. Only renders visible items.',
    category: 'core',
    props: [
      {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of all messages',
      },
      {
        name: 'height',
        type: 'number | string',
        required: true,
        description: 'Container height',
      },
      {
        name: 'estimatedItemSize',
        type: 'number',
        required: false,
        default: '100',
        description: 'Estimated height per message',
      },
      {
        name: 'overscan',
        type: 'number',
        required: false,
        default: '5',
        description: 'Number of items to render outside visible area',
      },
      {
        name: 'onEndReached',
        type: '() => void',
        required: false,
        description: 'Callback when scrolled to end (for loading more)',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl:
      'https://clarity-chat.dev/reference/components/virtualized-message-list',
    examples: [
      'import { VirtualizedMessageList } from "@clarity-chat/react";\n\n<VirtualizedMessageList\n  messages={largeMessageArray}\n  height={600}\n  overscan={3}\n  onEndReached={loadMoreMessages}\n/>',
    ],
    relatedComponents: ['MessageList', 'Message', 'InfiniteScroll'],
    accessibility: [
      'Maintains focus during scroll',
      'ARIA live region for new messages',
    ],
    version: '0.1.0',
  },
  {
    name: 'ErrorBoundary',
    description:
      'React error boundary with fallback UI for graceful error handling in chat components.',
    category: 'utility',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Components to wrap',
      },
      {
        name: 'fallback',
        type: 'ReactNode | ((error: Error) => ReactNode)',
        required: false,
        description: 'Fallback UI to render on error',
      },
      {
        name: 'onError',
        type: '(error: Error, errorInfo: ErrorInfo) => void',
        required: false,
        description: 'Callback for error logging',
      },
      {
        name: 'resetKeys',
        type: 'any[]',
        required: false,
        description: 'Keys that trigger error boundary reset when changed',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/guides/error-handling',
    examples: [
      'import { ErrorBoundary, ClarityChat } from "@clarity-chat/react";\n\n<ErrorBoundary\n  fallback={<div>Something went wrong. Please refresh.</div>}\n  onError={(error) => logToService(error)}\n>\n  <ClarityChat messages={messages} onSend={handleSend} />\n</ErrorBoundary>',
    ],
    relatedComponents: ['useErrorReporter', 'ErrorReporterProvider'],
    accessibility: ['Error message announced to screen readers'],
    version: '0.1.0',
  },
  {
    name: 'PromptSuggestions',
    description:
      'Displays clickable prompt suggestions to help users start conversations or explore capabilities.',
    category: 'interactive',
    props: [
      {
        name: 'suggestions',
        type: 'string[] | PromptSuggestion[]',
        required: true,
        description: 'Array of suggestion strings or objects',
      },
      {
        name: 'onSelect',
        type: '(suggestion: string) => void',
        required: true,
        description: 'Callback when suggestion is clicked',
      },
      {
        name: 'layout',
        type: "'grid' | 'list' | 'chips'",
        required: false,
        default: 'chips',
        description: 'Layout style for suggestions',
      },
      {
        name: 'maxVisible',
        type: 'number',
        required: false,
        default: '4',
        description: 'Maximum suggestions to show before "show more"',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/prompt-suggestions',
    examples: [
      'import { PromptSuggestions } from "@clarity-chat/react";\n\n<PromptSuggestions\n  suggestions={[\n    "What can you help me with?",\n    "Tell me about your capabilities",\n    "Help me write an email",\n  ]}\n  onSelect={setInput}\n  layout="chips"\n/>',
    ],
    relatedComponents: ['ChatInput', 'PromptLibrary', 'EmptyState'],
    accessibility: ['Button role', 'Keyboard navigation'],
    version: '0.1.0',
  },
  {
    name: 'NetworkStatus',
    description:
      'Displays current network connection status with offline/online indicators and reconnection UI.',
    category: 'feedback',
    props: [
      {
        name: 'showOnlineStatus',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show indicator when online (usually only show offline)',
      },
      {
        name: 'position',
        type: "'top' | 'bottom' | 'inline'",
        required: false,
        default: 'top',
        description: 'Banner position',
      },
      {
        name: 'onStatusChange',
        type: '(isOnline: boolean) => void',
        required: false,
        description: 'Callback when network status changes',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/network-status',
    examples: [
      'import { NetworkStatus, ClarityChat } from "@clarity-chat/react";\n\n<>\n  <NetworkStatus position="top" />\n  <ClarityChat messages={messages} onSend={handleSend} />\n</>',
    ],
    relatedComponents: ['useOnlineStatus', 'ErrorBoundary'],
    accessibility: ['Status announced to screen readers', 'ARIA live region'],
    version: '0.1.0',
  },
  // Enterprise Components
  {
    name: 'AuthTenantDashboard',
    description:
      'Multi-tenant authentication dashboard for managing users, roles, and tenant settings in enterprise applications.',
    category: 'enterprise',
    props: [
      {
        name: 'tenantId',
        type: 'string',
        required: true,
        description: 'Current tenant identifier',
      },
      {
        name: 'onUserInvite',
        type: '(email: string, role: string) => Promise<void>',
        required: false,
        description: 'Callback when inviting a new user',
      },
      {
        name: 'onRoleChange',
        type: '(userId: string, newRole: string) => Promise<void>',
        required: false,
        description: 'Callback when changing user role',
      },
      {
        name: 'showUsageStats',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display tenant usage statistics',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl:
      'https://clarity-chat.dev/reference/components/auth-tenant-dashboard',
    examples: [
      'import { AuthTenantDashboard } from "@clarity-chat/react";\n\n<AuthTenantDashboard\n  tenantId="acme-corp"\n  onUserInvite={handleInvite}\n  onRoleChange={handleRoleChange}\n/>',
    ],
    relatedComponents: ['RBACProvider', 'SSOConfigWizard'],
    accessibility: ['Keyboard accessible tables', 'ARIA labels for actions'],
    version: '0.1.0',
  },
  {
    name: 'SSOConfigWizard',
    description:
      'Step-by-step wizard for configuring Single Sign-On (SSO) with SAML or OIDC providers.',
    category: 'enterprise',
    props: [
      {
        name: 'provider',
        type: "'saml' | 'oidc' | 'auto'",
        required: false,
        default: 'auto',
        description: 'SSO protocol to configure',
      },
      {
        name: 'onComplete',
        type: '(config: SSOConfig) => Promise<void>',
        required: true,
        description: 'Callback when SSO configuration is complete',
      },
      {
        name: 'onCancel',
        type: '() => void',
        required: false,
        description: 'Callback when wizard is cancelled',
      },
      {
        name: 'existingConfig',
        type: 'Partial<SSOConfig>',
        required: false,
        description: 'Pre-fill wizard with existing configuration',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/reference/components/sso-config-wizard',
    examples: [
      'import { SSOConfigWizard } from "@clarity-chat/react";\n\n<SSOConfigWizard\n  provider="saml"\n  onComplete={async (config) => {\n    await saveSSOConfig(config);\n  }}\n/>',
    ],
    relatedComponents: ['AuthTenantDashboard', 'RBACProvider'],
    accessibility: ['Step indicators', 'Focus management between steps'],
    version: '0.1.0',
  },
  {
    name: 'AuditLogViewer',
    description:
      'Interactive viewer for audit logs with filtering, search, and export capabilities for compliance.',
    category: 'enterprise',
    props: [
      {
        name: 'logs',
        type: 'AuditLogEntry[]',
        required: true,
        description: 'Array of audit log entries to display',
      },
      {
        name: 'onFilter',
        type: '(filters: AuditFilters) => void',
        required: false,
        description: 'Callback when filters change',
      },
      {
        name: 'onExport',
        type: '(format: "csv" | "json") => void',
        required: false,
        description: 'Callback to export logs',
      },
      {
        name: 'showUserInfo',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display user information in log entries',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/guides/audit-logging',
    examples: [
      'import { AuditLogViewer } from "@clarity-chat/react";\n\n<AuditLogViewer\n  logs={auditLogs}\n  onFilter={handleFilter}\n  onExport={(format) => exportLogs(format)}\n/>',
    ],
    relatedComponents: ['AuditLogger', 'AuthTenantDashboard'],
    accessibility: ['Sortable tables', 'Screen reader announcements'],
    version: '0.1.0',
  },
  {
    name: 'RBACProvider',
    description:
      'Context provider for Role-Based Access Control. Wraps your app to enable permission checks throughout.',
    category: 'enterprise',
    props: [
      {
        name: 'storage',
        type: 'RBACStorage',
        required: true,
        description: 'Storage backend for roles and permissions',
      },
      {
        name: 'userId',
        type: 'string',
        required: true,
        description: 'Current user identifier for permission checks',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Child components that need RBAC context',
      },
    ],
    importPath: '@clarity-chat/react',
    docsUrl: 'https://clarity-chat.dev/guides/rbac',
    examples: [
      'import { RBACProvider, MemoryRBACStorage, CommonRoles } from "@clarity-chat/react";\n\nconst storage = new MemoryRBACStorage();\nstorage.addRole(CommonRoles.ADMIN);\nstorage.addRole(CommonRoles.USER);\n\n<RBACProvider storage={storage} userId={currentUser.id}>\n  <App />\n</RBACProvider>',
    ],
    relatedComponents: ['useRBAC', 'AuthTenantDashboard'],
    accessibility: ['Provides context for permission-based UI'],
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
        generatedCount: allComponents.length - curatedComponents.length,
        ...dataSourceInfo,
      },
    }

    return NextResponse.json(response, {
      headers: API_RESPONSE_HEADERS,
    })
  } catch (error) {
    // Log error for debugging
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('[AI Components API] Error:', errorMessage)
    if (errorStack) {
      console.error('[AI Components API] Stack:', errorStack)
    }

    // Return proper JSON error response
    const errorResponse = createErrorResponse(
      'INTERNAL_ERROR',
      'An unexpected error occurred while fetching components',
      '/api/ai/components',
      process.env.NODE_ENV === 'development' ? errorMessage : undefined
    )

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: API_RESPONSE_HEADERS,
    })
  }
}
