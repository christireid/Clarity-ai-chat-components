/**
 * Clarity Chat Component Registry
 *
 * Comprehensive metadata for all 70+ React components and 35+ hooks.
 * This data powers component discovery, documentation lookup, and code generation.
 */

import type { ComponentCategory } from '../utils/schemas.js'

// =============================================================================
// Types
// =============================================================================

export interface ComponentMeta {
  name: string
  displayName: string
  description: string
  category: ComponentCategory
  package: string
  importPath: string
  props: PropMeta[]
  examples: ExampleMeta[]
  relatedComponents: string[]
  accessibility: AccessibilityMeta
  tags: string[]
}

export interface PropMeta {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

export interface ExampleMeta {
  title: string
  description: string
  code: string
}

export interface AccessibilityMeta {
  wcagLevel: 'A' | 'AA' | 'AAA'
  keyboardSupport: string[]
  ariaAttributes: string[]
  screenReaderNotes: string
  focusManagement: string
}

export interface HookMeta {
  name: string
  displayName: string
  description: string
  package: string
  importPath: string
  parameters: ParameterMeta[]
  returns: ReturnMeta
  examples: ExampleMeta[]
  relatedHooks: string[]
  tags: string[]
}

export interface ParameterMeta {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

export interface ReturnMeta {
  type: string
  description: string
  properties?: { name: string; type: string; description: string }[]
}

// =============================================================================
// Component Registry
// =============================================================================

export const COMPONENTS: ComponentMeta[] = [
  // Top-Level Components
  {
    name: 'ClarityChat',
    displayName: 'Clarity Chat',
    description:
      'The main chat interface component. A complete, production-ready AI chat UI with streaming support, message history, and customizable appearance.',
    category: 'top-level',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of chat messages to display',
      },
      {
        name: 'onSendMessage',
        type: '(message: string) => void',
        required: true,
        description: 'Callback when user sends a message',
      },
      {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show loading state',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '"Type a message..."',
        description: 'Input placeholder text',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'showTimestamps',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display message timestamps',
      },
      {
        name: 'enableMarkdown',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Render markdown in messages',
      },
      {
        name: 'enableCodeHighlight',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Syntax highlighting in code blocks',
      },
    ],
    examples: [
      {
        title: 'Basic Usage',
        description: 'Simple chat interface with message handling',
        code: `import { ClarityChat } from '@clarity-chat/react'

function App() {
  const [messages, setMessages] = useState([])

  const handleSend = async (message) => {
    setMessages(prev => [...prev, { role: 'user', content: message }])
    // Call your AI API here
  }

  return <ClarityChat messages={messages} onSendMessage={handleSend} />
}`,
      },
      {
        title: 'With Streaming',
        description: 'Chat with real-time streaming responses',
        code: `import { ClarityChat, useClarityChat } from '@clarity-chat/react'

function App() {
  const { messages, sendMessage, isStreaming } = useClarityChat({
    api: '/api/chat',
    onError: console.error
  })

  return (
    <ClarityChat
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isStreaming}
    />
  )
}`,
      },
    ],
    relatedComponents: [
      'ChatInput',
      'MessageList',
      'TypingIndicator',
      'StreamingTextRenderer',
    ],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: [
        'Tab navigation',
        'Enter to send',
        'Escape to cancel',
        'Arrow keys for history',
      ],
      ariaAttributes: ['aria-live="polite"', 'aria-label', 'role="log"'],
      screenReaderNotes:
        'Messages are announced as they arrive. Input has clear labeling.',
      focusManagement:
        'Focus returns to input after sending. New messages do not steal focus.',
    },
    tags: ['chat', 'ai', 'streaming', 'messages', 'conversation', 'main'],
  },

  {
    name: 'ChatInput',
    displayName: 'Chat Input',
    description:
      'A feature-rich input component for chat messages with auto-resize, keyboard shortcuts, and optional voice input.',
    category: 'input',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'onSend',
        type: '(message: string) => void',
        required: true,
        description: 'Callback when message is sent',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '"Type a message..."',
        description: 'Input placeholder',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Disable the input',
      },
      {
        name: 'maxLength',
        type: 'number',
        required: false,
        description: 'Maximum character limit',
      },
      {
        name: 'showCharCount',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show character counter',
      },
      {
        name: 'enableVoice',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Enable voice input',
      },
      {
        name: 'autoFocus',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Auto-focus on mount',
      },
    ],
    examples: [
      {
        title: 'Basic Input',
        description: 'Simple chat input',
        code: `import { ChatInput } from '@clarity-chat/react'

<ChatInput
  onSend={(message) => console.log(message)}
  placeholder="Ask me anything..."
/>`,
      },
    ],
    relatedComponents: ['ClarityChat', 'VoiceInput', 'PromptSuggestions'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: [
        'Enter to send',
        'Shift+Enter for newline',
        'Up arrow for history',
      ],
      ariaAttributes: ['aria-label', 'aria-describedby'],
      screenReaderNotes: 'Multiline input with clear submit instructions',
      focusManagement: 'Maintains focus after send unless explicitly blurred',
    },
    tags: ['input', 'textarea', 'send', 'message', 'voice'],
  },

  {
    name: 'MessageList',
    displayName: 'Message List',
    description:
      'Virtualized list component for displaying chat messages efficiently, even with thousands of messages.',
    category: 'message',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of messages to display',
      },
      {
        name: 'virtualized',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Enable virtualization for large lists',
      },
      {
        name: 'autoScroll',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Auto-scroll to new messages',
      },
      {
        name: 'renderMessage',
        type: '(message: Message) => ReactNode',
        required: false,
        description: 'Custom message renderer',
      },
    ],
    examples: [
      {
        title: 'Basic Message List',
        description: 'Display messages with virtualization',
        code: `import { MessageList } from '@clarity-chat/react'

<MessageList
  messages={messages}
  autoScroll={true}
/>`,
      },
    ],
    relatedComponents: ['Message', 'VirtualizedMessageList', 'ClarityChat'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: [
        'Arrow keys to navigate',
        'Home/End for first/last message',
      ],
      ariaAttributes: ['role="log"', 'aria-live="polite"'],
      screenReaderNotes:
        'Messages are announced in order. Navigation is intuitive.',
      focusManagement: 'Focus can be moved to individual messages',
    },
    tags: ['list', 'messages', 'virtualized', 'scroll', 'history'],
  },

  {
    name: 'Message',
    displayName: 'Message',
    description:
      'Individual message component with support for markdown, code blocks, and rich content.',
    category: 'message',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'content',
        type: 'string',
        required: true,
        description: 'Message content (supports markdown)',
      },
      {
        name: 'role',
        type: '"user" | "assistant" | "system"',
        required: true,
        description: 'Message role',
      },
      {
        name: 'timestamp',
        type: 'Date | string',
        required: false,
        description: 'Message timestamp',
      },
      {
        name: 'avatar',
        type: 'ReactNode',
        required: false,
        description: 'Custom avatar',
      },
      {
        name: 'actions',
        type: 'MessageAction[]',
        required: false,
        description: 'Action buttons (copy, edit, etc.)',
      },
    ],
    examples: [
      {
        title: 'User Message',
        description: 'Display a user message',
        code: `import { Message } from '@clarity-chat/react'

<Message
  content="Hello, how can you help me?"
  role="user"
  timestamp={new Date()}
/>`,
      },
    ],
    relatedComponents: [
      'MessageList',
      'MessageActions',
      'MarkdownRenderer',
      'Avatar',
    ],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: ['Tab to actions', 'Enter to activate actions'],
      ariaAttributes: ['role="article"', 'aria-label'],
      screenReaderNotes: 'Message role and timestamp are announced',
      focusManagement: 'Focus can move to message actions',
    },
    tags: ['message', 'bubble', 'chat', 'markdown', 'content'],
  },

  {
    name: 'TypingIndicator',
    displayName: 'Typing Indicator',
    description:
      'Animated indicator showing that the AI is generating a response.',
    category: 'feedback',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'visible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show/hide the indicator',
      },
      {
        name: 'text',
        type: 'string',
        required: false,
        default: '"AI is typing..."',
        description: 'Accessible text',
      },
      {
        name: 'variant',
        type: '"dots" | "pulse" | "bounce"',
        required: false,
        default: '"dots"',
        description: 'Animation style',
      },
    ],
    examples: [
      {
        title: 'Basic Typing Indicator',
        description: 'Show typing animation',
        code: `import { TypingIndicator } from '@clarity-chat/react'

{isLoading && <TypingIndicator />}`,
      },
    ],
    relatedComponents: [
      'ThinkingIndicator',
      'StreamingTextRenderer',
      'Skeleton',
    ],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: [],
      ariaAttributes: ['aria-live="polite"', 'aria-label'],
      screenReaderNotes:
        'Screen readers announce when AI starts and stops typing',
      focusManagement: 'Does not receive focus',
    },
    tags: ['loading', 'typing', 'animation', 'indicator', 'feedback'],
  },

  {
    name: 'ThinkingIndicator',
    displayName: 'Thinking Indicator',
    description:
      'Extended indicator for showing AI reasoning/thinking process with optional status messages.',
    category: 'feedback',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'visible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show/hide the indicator',
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'Current thinking status text',
      },
      {
        name: 'steps',
        type: 'ThinkingStep[]',
        required: false,
        description: 'Array of thinking steps to display',
      },
    ],
    examples: [
      {
        title: 'Basic Thinking Indicator',
        description: 'Show AI reasoning',
        code: `import { ThinkingIndicator } from '@clarity-chat/react'

<ThinkingIndicator
  visible={isThinking}
  status="Analyzing your request..."
/>`,
      },
    ],
    relatedComponents: [
      'TypingIndicator',
      'StreamingTextRenderer',
      'ToolInvocationCard',
    ],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: [],
      ariaAttributes: ['aria-live="polite"', 'aria-busy'],
      screenReaderNotes: 'Status updates are announced to screen readers',
      focusManagement: 'Does not receive focus',
    },
    tags: ['thinking', 'reasoning', 'loading', 'status', 'ai'],
  },

  {
    name: 'StreamingTextRenderer',
    displayName: 'Streaming Text Renderer',
    description:
      'Renders text character-by-character for streaming AI responses with typewriter effect.',
    category: 'display',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'Text to render',
      },
      {
        name: 'speed',
        type: 'number',
        required: false,
        default: '30',
        description: 'Characters per second',
      },
      {
        name: 'onComplete',
        type: '() => void',
        required: false,
        description: 'Callback when rendering completes',
      },
      {
        name: 'enableMarkdown',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Parse markdown',
      },
    ],
    examples: [
      {
        title: 'Streaming Response',
        description: 'Animate incoming AI response',
        code: `import { StreamingTextRenderer } from '@clarity-chat/react'

<StreamingTextRenderer
  text={streamingContent}
  speed={50}
  onComplete={() => setIsComplete(true)}
/>`,
      },
    ],
    relatedComponents: ['Message', 'TypingIndicator', 'MarkdownRenderer'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: [],
      ariaAttributes: ['aria-live="polite"'],
      screenReaderNotes:
        'Content is announced as it appears, without overwhelming the user',
      focusManagement: 'Does not affect focus',
    },
    tags: ['streaming', 'typewriter', 'animation', 'text', 'response'],
  },

  {
    name: 'ModelSelector',
    displayName: 'Model Selector',
    description:
      'Dropdown component for selecting AI models with pricing and capability information.',
    category: 'input',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'models',
        type: 'ModelInfo[]',
        required: true,
        description: 'Available models',
      },
      {
        name: 'value',
        type: 'string',
        required: true,
        description: 'Selected model ID',
      },
      {
        name: 'onChange',
        type: '(modelId: string) => void',
        required: true,
        description: 'Selection change handler',
      },
      {
        name: 'showPricing',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display pricing info',
      },
      {
        name: 'showCapabilities',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display capabilities',
      },
    ],
    examples: [
      {
        title: 'Model Selection',
        description: 'Choose between AI models',
        code: `import { ModelSelector } from '@clarity-chat/react'

<ModelSelector
  models={[
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic' }
  ]}
  value={selectedModel}
  onChange={setSelectedModel}
/>`,
      },
    ],
    relatedComponents: ['SettingsPanel', 'TokenBudgetBar'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: [
        'Arrow keys to navigate',
        'Enter to select',
        'Escape to close',
      ],
      ariaAttributes: ['role="listbox"', 'aria-selected'],
      screenReaderNotes: 'Model names, pricing, and capabilities are announced',
      focusManagement: 'Focus trapped within dropdown when open',
    },
    tags: ['model', 'selector', 'dropdown', 'ai', 'settings'],
  },

  {
    name: 'TokenBudgetBar',
    displayName: 'Token Budget Bar',
    description:
      'Visual progress bar showing token usage against a budget with cost estimation.',
    category: 'analytics',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'used',
        type: 'number',
        required: true,
        description: 'Tokens used',
      },
      {
        name: 'budget',
        type: 'number',
        required: true,
        description: 'Total token budget',
      },
      {
        name: 'costPerToken',
        type: 'number',
        required: false,
        description: 'Cost per token for estimation',
      },
      {
        name: 'showCost',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display cost estimate',
      },
      {
        name: 'warningThreshold',
        type: 'number',
        required: false,
        default: '0.8',
        description: 'Threshold for warning state (0-1)',
      },
    ],
    examples: [
      {
        title: 'Token Usage',
        description: 'Display token budget consumption',
        code: `import { TokenBudgetBar } from '@clarity-chat/react'

<TokenBudgetBar
  used={3500}
  budget={4096}
  costPerToken={0.00003}
/>`,
      },
    ],
    relatedComponents: [
      'UsageDashboard',
      'AnalyticsDashboard',
      'ModelSelector',
    ],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: [],
      ariaAttributes: ['role="progressbar"', 'aria-valuenow', 'aria-valuemax'],
      screenReaderNotes: 'Progress and percentage are announced',
      focusManagement: 'Not focusable by default',
    },
    tags: ['tokens', 'budget', 'usage', 'progress', 'cost', 'analytics'],
  },

  {
    name: 'VoiceInput',
    displayName: 'Voice Input',
    description:
      'Voice-to-text input component using Web Speech API with waveform visualization.',
    category: 'input',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
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
        default: '"en-US"',
        description: 'Recognition language',
      },
      {
        name: 'continuous',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Continuous listening mode',
      },
      {
        name: 'showWaveform',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display audio waveform',
      },
    ],
    examples: [
      {
        title: 'Voice Input Button',
        description: 'Add voice input capability',
        code: `import { VoiceInput } from '@clarity-chat/react'

<VoiceInput
  onTranscript={(text) => setMessage(text)}
  language="en-US"
/>`,
      },
    ],
    relatedComponents: ['ChatInput', 'ClarityChat'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: ['Space/Enter to start/stop'],
      ariaAttributes: ['aria-pressed', 'aria-label'],
      screenReaderNotes:
        'Recording state is announced, transcript is read back',
      focusManagement: 'Button maintains focus during recording',
    },
    tags: ['voice', 'speech', 'microphone', 'audio', 'input'],
  },

  {
    name: 'CopyButton',
    displayName: 'Copy Button',
    description:
      'Button component for copying text to clipboard with success feedback animation.',
    category: 'feedback',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'Text to copy',
      },
      {
        name: 'onCopy',
        type: '() => void',
        required: false,
        description: 'Callback after successful copy',
      },
      {
        name: 'successDuration',
        type: 'number',
        required: false,
        default: '2000',
        description: 'Success state duration (ms)',
      },
    ],
    examples: [
      {
        title: 'Copy Code',
        description: 'Copy code block to clipboard',
        code: `import { CopyButton } from '@clarity-chat/react'

<CopyButton text={codeSnippet} />`,
      },
    ],
    relatedComponents: ['MessageActions', 'CodeBlock'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: ['Enter/Space to copy'],
      ariaAttributes: ['aria-label', 'aria-live'],
      screenReaderNotes: 'Success/failure state is announced',
      focusManagement: 'Maintains focus after copy',
    },
    tags: ['copy', 'clipboard', 'button', 'action'],
  },

  {
    name: 'ErrorBoundary',
    displayName: 'Error Boundary',
    description:
      'React error boundary with fallback UI and error reporting capabilities.',
    category: 'feedback',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'fallback',
        type: 'ReactNode | ((error: Error) => ReactNode)',
        required: false,
        description: 'Fallback UI',
      },
      {
        name: 'onError',
        type: '(error: Error, info: ErrorInfo) => void',
        required: false,
        description: 'Error callback',
      },
      {
        name: 'onReset',
        type: '() => void',
        required: false,
        description: 'Reset callback',
      },
    ],
    examples: [
      {
        title: 'Wrap Chat Component',
        description: 'Catch and handle errors gracefully',
        code: `import { ErrorBoundary } from '@clarity-chat/react'

<ErrorBoundary
  fallback={<div>Something went wrong</div>}
  onError={(error) => logError(error)}
>
  <ClarityChat ... />
</ErrorBoundary>`,
      },
    ],
    relatedComponents: ['RetryButton', 'Toast'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: ['Tab to retry button'],
      ariaAttributes: ['role="alert"', 'aria-live="assertive"'],
      screenReaderNotes: 'Error message is announced immediately',
      focusManagement: 'Focus moves to error message or retry button',
    },
    tags: ['error', 'boundary', 'fallback', 'recovery'],
  },

  {
    name: 'Toast',
    displayName: 'Toast',
    description:
      'Non-blocking notification component for success, error, and info messages.',
    category: 'feedback',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'message',
        type: 'string',
        required: true,
        description: 'Toast message',
      },
      {
        name: 'type',
        type: '"success" | "error" | "info" | "warning"',
        required: false,
        default: '"info"',
        description: 'Toast type',
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: '5000',
        description: 'Auto-dismiss duration (ms)',
      },
      {
        name: 'onClose',
        type: '() => void',
        required: false,
        description: 'Close callback',
      },
    ],
    examples: [
      {
        title: 'Success Toast',
        description: 'Show success notification',
        code: `import { Toast } from '@clarity-chat/react'

<Toast
  message="Message sent successfully!"
  type="success"
/>`,
      },
    ],
    relatedComponents: ['ErrorBoundary', 'FeedbackAnimation'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: ['Escape to dismiss', 'Enter to dismiss'],
      ariaAttributes: ['role="alert"', 'aria-live="polite"'],
      screenReaderNotes: 'Toast content is announced when it appears',
      focusManagement: 'Does not steal focus by default',
    },
    tags: ['toast', 'notification', 'alert', 'feedback', 'message'],
  },

  {
    name: 'PromptSuggestions',
    displayName: 'Prompt Suggestions',
    description:
      'Component displaying suggested prompts or quick actions for users.',
    category: 'input',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'suggestions',
        type: 'string[]',
        required: true,
        description: 'Array of suggestion strings',
      },
      {
        name: 'onSelect',
        type: '(suggestion: string) => void',
        required: true,
        description: 'Selection handler',
      },
      {
        name: 'layout',
        type: '"horizontal" | "vertical" | "grid"',
        required: false,
        default: '"horizontal"',
        description: 'Layout style',
      },
    ],
    examples: [
      {
        title: 'Quick Prompts',
        description: 'Show suggested prompts',
        code: `import { PromptSuggestions } from '@clarity-chat/react'

<PromptSuggestions
  suggestions={[
    "Explain this code",
    "Write unit tests",
    "Suggest improvements"
  ]}
  onSelect={handlePromptSelect}
/>`,
      },
    ],
    relatedComponents: ['ChatInput', 'FollowUpSuggestions', 'PromptLibrary'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: ['Tab to navigate', 'Enter to select'],
      ariaAttributes: ['role="listbox"', 'aria-label'],
      screenReaderNotes: 'Suggestions are announced as list items',
      focusManagement: 'Focus cycles through suggestions',
    },
    tags: ['prompts', 'suggestions', 'quick-actions', 'starter'],
  },

  {
    name: 'SettingsPanel',
    displayName: 'Settings Panel',
    description:
      'Comprehensive settings panel for configuring chat behavior, appearance, and AI parameters.',
    category: 'navigation',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'settings',
        type: 'ChatSettings',
        required: true,
        description: 'Current settings object',
      },
      {
        name: 'onChange',
        type: '(settings: ChatSettings) => void',
        required: true,
        description: 'Settings change handler',
      },
      {
        name: 'sections',
        type: 'SettingSection[]',
        required: false,
        description: 'Which sections to display',
      },
    ],
    examples: [
      {
        title: 'Settings Panel',
        description: 'Full settings configuration',
        code: `import { SettingsPanel } from '@clarity-chat/react'

<SettingsPanel
  settings={chatSettings}
  onChange={setChatSettings}
/>`,
      },
    ],
    relatedComponents: ['ModelSelector', 'ThemeSelector', 'PersonaPanel'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: ['Tab navigation', 'Arrow keys for toggles'],
      ariaAttributes: ['role="form"', 'aria-labelledby'],
      screenReaderNotes: 'Each setting has a clear label and description',
      focusManagement: 'Focus follows logical order through settings',
    },
    tags: ['settings', 'configuration', 'preferences', 'panel'],
  },

  {
    name: 'ConversationList',
    displayName: 'Conversation List',
    description:
      'Sidebar component showing conversation history with search and management features.',
    category: 'navigation',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'conversations',
        type: 'Conversation[]',
        required: true,
        description: 'Array of conversations',
      },
      {
        name: 'activeId',
        type: 'string',
        required: false,
        description: 'Currently active conversation ID',
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        required: true,
        description: 'Selection handler',
      },
      {
        name: 'onDelete',
        type: '(id: string) => void',
        required: false,
        description: 'Delete handler',
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Enable search',
      },
    ],
    examples: [
      {
        title: 'Conversation Sidebar',
        description: 'Show conversation history',
        code: `import { ConversationList } from '@clarity-chat/react'

<ConversationList
  conversations={conversations}
  activeId={currentConversation}
  onSelect={setCurrentConversation}
  onDelete={deleteConversation}
/>`,
      },
    ],
    relatedComponents: [
      'HistoryManager',
      'MessageSearch',
      'ConversationTimeline',
    ],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: [
        'Arrow keys to navigate',
        'Enter to select',
        'Delete to remove',
      ],
      ariaAttributes: ['role="listbox"', 'aria-selected'],
      screenReaderNotes: 'Conversation titles and timestamps are announced',
      focusManagement: 'Focus moves with selection',
    },
    tags: ['conversations', 'history', 'sidebar', 'list', 'navigation'],
  },

  {
    name: 'UsageDashboard',
    displayName: 'Usage Dashboard',
    description:
      'Dashboard component displaying token usage, costs, and API call statistics.',
    category: 'analytics',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'usage',
        type: 'UsageStats',
        required: true,
        description: 'Usage statistics data',
      },
      {
        name: 'period',
        type: '"day" | "week" | "month"',
        required: false,
        default: '"week"',
        description: 'Time period',
      },
      {
        name: 'showCharts',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display charts',
      },
    ],
    examples: [
      {
        title: 'Usage Stats',
        description: 'Display usage analytics',
        code: `import { UsageDashboard } from '@clarity-chat/react'

<UsageDashboard
  usage={usageStats}
  period="week"
/>`,
      },
    ],
    relatedComponents: [
      'AnalyticsDashboard',
      'TokenBudgetBar',
      'ConversationAnalytics',
    ],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: [
        'Tab to navigate charts',
        'Arrow keys for time navigation',
      ],
      ariaAttributes: ['role="region"', 'aria-label'],
      screenReaderNotes: 'Statistics are announced with proper context',
      focusManagement: 'Charts are focusable with data summaries',
    },
    tags: ['usage', 'analytics', 'dashboard', 'statistics', 'cost'],
  },

  {
    name: 'ToolInvocationCard',
    displayName: 'Tool Invocation Card',
    description:
      'Card component for displaying AI tool/function calls with inputs, outputs, and status.',
    category: 'ai-ops',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'tool',
        type: 'ToolCall',
        required: true,
        description: 'Tool call data',
      },
      {
        name: 'status',
        type: '"pending" | "running" | "success" | "error"',
        required: false,
        description: 'Execution status',
      },
      {
        name: 'result',
        type: 'any',
        required: false,
        description: 'Tool result data',
      },
      {
        name: 'collapsible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Allow collapse/expand',
      },
    ],
    examples: [
      {
        title: 'Tool Call Display',
        description: 'Show function call details',
        code: `import { ToolInvocationCard } from '@clarity-chat/react'

<ToolInvocationCard
  tool={{
    name: 'search_documents',
    arguments: { query: 'typescript patterns' }
  }}
  status="success"
  result={searchResults}
/>`,
      },
    ],
    relatedComponents: [
      'ClarityToolResult',
      'AgentRunFeed',
      'ThinkingIndicator',
    ],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: ['Enter to expand/collapse', 'Tab to navigate'],
      ariaAttributes: ['aria-expanded', 'aria-label'],
      screenReaderNotes: 'Tool name, status, and result summary are announced',
      focusManagement: 'Focus on header toggles expansion',
    },
    tags: ['tool', 'function', 'invocation', 'ai', 'agent'],
  },

  {
    name: 'MemoryInspector',
    displayName: 'Memory Inspector',
    description:
      'Debug component for inspecting conversation memory and context state.',
    category: 'memory',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: [
      {
        name: 'memory',
        type: 'MemoryState',
        required: true,
        description: 'Memory state object',
      },
      {
        name: 'onClear',
        type: '() => void',
        required: false,
        description: 'Clear memory callback',
      },
      {
        name: 'showDetails',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show detailed view',
      },
    ],
    examples: [
      {
        title: 'Memory Debug',
        description: 'Inspect memory state',
        code: `import { MemoryInspector } from '@clarity-chat/react'

<MemoryInspector
  memory={memoryState}
  onClear={clearMemory}
/>`,
      },
    ],
    relatedComponents: ['ContextVisualizer', 'TokenOptimizationPanel'],
    accessibility: {
      wcagLevel: 'AA',
      keyboardSupport: ['Tab to navigate', 'Enter to expand sections'],
      ariaAttributes: ['role="tree"', 'aria-expanded'],
      screenReaderNotes: 'Memory contents are navigable and describable',
      focusManagement: 'Tree navigation pattern',
    },
    tags: ['memory', 'debug', 'inspector', 'context', 'state'],
  },
]

// =============================================================================
// Hook Registry
// =============================================================================

export const HOOKS: HookMeta[] = [
  {
    name: 'useClarityChat',
    displayName: 'useClarity Chat',
    description:
      'Primary hook for managing chat state, sending messages, and handling streaming responses.',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    parameters: [
      {
        name: 'api',
        type: 'string',
        required: true,
        description: 'API endpoint URL',
      },
      {
        name: 'initialMessages',
        type: 'Message[]',
        required: false,
        default: '[]',
        description: 'Initial messages',
      },
      {
        name: 'onError',
        type: '(error: Error) => void',
        required: false,
        description: 'Error handler',
      },
      {
        name: 'onFinish',
        type: '(message: Message) => void',
        required: false,
        description: 'Completion handler',
      },
    ],
    returns: {
      type: 'UseClarityChatReturn',
      description: 'Chat state and methods',
      properties: [
        {
          name: 'messages',
          type: 'Message[]',
          description: 'Current messages',
        },
        {
          name: 'sendMessage',
          type: '(content: string) => Promise<void>',
          description: 'Send a message',
        },
        { name: 'isLoading', type: 'boolean', description: 'Loading state' },
        { name: 'error', type: 'Error | null', description: 'Current error' },
        { name: 'stop', type: '() => void', description: 'Stop streaming' },
        {
          name: 'reload',
          type: '() => void',
          description: 'Reload last message',
        },
      ],
    },
    examples: [
      {
        title: 'Basic Chat Hook',
        description: 'Simple chat implementation',
        code: `import { useClarityChat } from '@clarity-chat/react'

function Chat() {
  const { messages, sendMessage, isLoading } = useClarityChat({
    api: '/api/chat',
    onError: console.error
  })

  return (
    <ClarityChat
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    />
  )
}`,
      },
    ],
    relatedHooks: ['useStreamingSSE', 'useMessageHistory', 'useTokenTracker'],
    tags: ['chat', 'messages', 'streaming', 'state', 'main'],
  },

  {
    name: 'useVoiceInput',
    displayName: 'useVoice Input',
    description: 'Hook for voice-to-text functionality using Web Speech API.',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    parameters: [
      {
        name: 'language',
        type: 'string',
        required: false,
        default: '"en-US"',
        description: 'Recognition language',
      },
      {
        name: 'continuous',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Continuous mode',
      },
      {
        name: 'onResult',
        type: '(transcript: string) => void',
        required: false,
        description: 'Result callback',
      },
    ],
    returns: {
      type: 'UseVoiceInputReturn',
      description: 'Voice input state and controls',
      properties: [
        {
          name: 'isListening',
          type: 'boolean',
          description: 'Currently listening',
        },
        {
          name: 'transcript',
          type: 'string',
          description: 'Current transcript',
        },
        {
          name: 'startListening',
          type: '() => void',
          description: 'Start recording',
        },
        {
          name: 'stopListening',
          type: '() => void',
          description: 'Stop recording',
        },
        {
          name: 'isSupported',
          type: 'boolean',
          description: 'Browser support check',
        },
      ],
    },
    examples: [
      {
        title: 'Voice Input',
        description: 'Add voice input to chat',
        code: `import { useVoiceInput } from '@clarity-chat/react'

function VoiceButton({ onTranscript }) {
  const { isListening, startListening, stopListening, transcript } = useVoiceInput({
    onResult: onTranscript
  })

  return (
    <button onClick={isListening ? stopListening : startListening}>
      {isListening ? 'Stop' : 'Start'} Voice
    </button>
  )
}`,
      },
    ],
    relatedHooks: ['useClarityChat'],
    tags: ['voice', 'speech', 'input', 'microphone', 'accessibility'],
  },

  {
    name: 'useTokenTracker',
    displayName: 'useToken Tracker',
    description:
      'Hook for tracking token usage and estimating costs in real-time.',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    parameters: [
      {
        name: 'model',
        type: 'string',
        required: true,
        description: 'Model name for pricing',
      },
      {
        name: 'budget',
        type: 'number',
        required: false,
        description: 'Token budget limit',
      },
      {
        name: 'onBudgetExceeded',
        type: '() => void',
        required: false,
        description: 'Budget exceeded callback',
      },
    ],
    returns: {
      type: 'UseTokenTrackerReturn',
      description: 'Token tracking state and methods',
      properties: [
        {
          name: 'inputTokens',
          type: 'number',
          description: 'Input tokens used',
        },
        {
          name: 'outputTokens',
          type: 'number',
          description: 'Output tokens used',
        },
        {
          name: 'totalTokens',
          type: 'number',
          description: 'Total tokens used',
        },
        {
          name: 'estimatedCost',
          type: 'number',
          description: 'Estimated cost in USD',
        },
        {
          name: 'trackTokens',
          type: '(input: number, output: number) => void',
          description: 'Track token usage',
        },
        { name: 'reset', type: '() => void', description: 'Reset counters' },
      ],
    },
    examples: [
      {
        title: 'Token Tracking',
        description: 'Monitor token usage',
        code: `import { useTokenTracker } from '@clarity-chat/react'

function TokenDisplay() {
  const { totalTokens, estimatedCost } = useTokenTracker({
    model: 'gpt-4o',
    budget: 10000
  })

  return (
    <div>
      Tokens: {totalTokens} | Cost: \${estimatedCost.toFixed(4)}
    </div>
  )
}`,
      },
    ],
    relatedHooks: ['useClarityChat', 'useTokenOptimization'],
    tags: ['tokens', 'cost', 'usage', 'tracking', 'budget'],
  },

  {
    name: 'useStreamingSSE',
    displayName: 'useStreaming SSE',
    description:
      'Low-level hook for Server-Sent Events streaming with reconnection support.',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    parameters: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'SSE endpoint URL',
      },
      {
        name: 'onMessage',
        type: '(data: string) => void',
        required: true,
        description: 'Message handler',
      },
      {
        name: 'onError',
        type: '(error: Error) => void',
        required: false,
        description: 'Error handler',
      },
      {
        name: 'autoReconnect',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Auto reconnect on disconnect',
      },
    ],
    returns: {
      type: 'UseStreamingSSEReturn',
      description: 'SSE connection state and controls',
      properties: [
        {
          name: 'isConnected',
          type: 'boolean',
          description: 'Connection status',
        },
        { name: 'connect', type: '() => void', description: 'Open connection' },
        {
          name: 'disconnect',
          type: '() => void',
          description: 'Close connection',
        },
      ],
    },
    examples: [
      {
        title: 'SSE Streaming',
        description: 'Low-level streaming',
        code: `import { useStreamingSSE } from '@clarity-chat/react'

function StreamHandler() {
  const { isConnected, connect, disconnect } = useStreamingSSE({
    url: '/api/stream',
    onMessage: (data) => console.log(data)
  })

  return <button onClick={connect}>Connect</button>
}`,
      },
    ],
    relatedHooks: ['useClarityChat', 'useStreamingWebSocket'],
    tags: ['streaming', 'sse', 'realtime', 'connection'],
  },

  {
    name: 'useKeyboardShortcuts',
    displayName: 'useKeyboard Shortcuts',
    description:
      'Hook for registering and managing keyboard shortcuts in chat interfaces.',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    parameters: [
      {
        name: 'shortcuts',
        type: 'ShortcutMap',
        required: true,
        description: 'Map of shortcuts to handlers',
      },
      {
        name: 'enabled',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Enable shortcuts',
      },
    ],
    returns: {
      type: 'UseKeyboardShortcutsReturn',
      description: 'Shortcut management',
      properties: [
        {
          name: 'activeShortcuts',
          type: 'string[]',
          description: 'Currently registered shortcuts',
        },
        { name: 'enable', type: '() => void', description: 'Enable shortcuts' },
        {
          name: 'disable',
          type: '() => void',
          description: 'Disable shortcuts',
        },
      ],
    },
    examples: [
      {
        title: 'Chat Shortcuts',
        description: 'Register keyboard shortcuts',
        code: `import { useKeyboardShortcuts } from '@clarity-chat/react'

useKeyboardShortcuts({
  'mod+enter': () => sendMessage(),
  'mod+k': () => openSearch(),
  'escape': () => clearInput()
})`,
      },
    ],
    relatedHooks: ['useClarityChat'],
    tags: ['keyboard', 'shortcuts', 'accessibility', 'hotkeys'],
  },

  {
    name: 'useLocalStorage',
    displayName: 'useLocal Storage',
    description:
      'Hook for persisting chat settings and preferences in local storage.',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
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
        description: 'Initial/default value',
      },
    ],
    returns: {
      type: '[T, (value: T) => void]',
      description: 'Value and setter like useState',
    },
    examples: [
      {
        title: 'Persist Settings',
        description: 'Save chat settings',
        code: `import { useLocalStorage } from '@clarity-chat/react'

const [settings, setSettings] = useLocalStorage('chat-settings', {
  model: 'gpt-4o',
  theme: 'dark'
})`,
      },
    ],
    relatedHooks: ['useIndexedDB'],
    tags: ['storage', 'persistence', 'settings', 'preferences'],
  },

  {
    name: 'useAutoScroll',
    displayName: 'useAuto Scroll',
    description: 'Hook for managing auto-scroll behavior in message lists.',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    parameters: [
      {
        name: 'ref',
        type: 'RefObject<HTMLElement>',
        required: true,
        description: 'Scroll container ref',
      },
      {
        name: 'deps',
        type: 'any[]',
        required: false,
        description: 'Dependencies to trigger scroll',
      },
      {
        name: 'behavior',
        type: '"smooth" | "instant"',
        required: false,
        default: '"smooth"',
        description: 'Scroll behavior',
      },
    ],
    returns: {
      type: 'UseAutoScrollReturn',
      description: 'Scroll control methods',
      properties: [
        {
          name: 'scrollToBottom',
          type: '() => void',
          description: 'Scroll to bottom',
        },
        { name: 'isAtBottom', type: 'boolean', description: 'At bottom check' },
      ],
    },
    examples: [
      {
        title: 'Auto Scroll Messages',
        description: 'Scroll on new messages',
        code: `import { useAutoScroll } from '@clarity-chat/react'

function MessageList({ messages }) {
  const containerRef = useRef(null)
  const { scrollToBottom, isAtBottom } = useAutoScroll(containerRef, [messages])

  return (
    <div ref={containerRef}>
      {messages.map(m => <Message key={m.id} {...m} />)}
    </div>
  )
}`,
      },
    ],
    relatedHooks: ['useIntersectionObserver'],
    tags: ['scroll', 'auto-scroll', 'messages', 'ui'],
  },

  {
    name: 'useClipboard',
    displayName: 'useClipboard',
    description: 'Hook for clipboard operations with success/error feedback.',
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    parameters: [
      {
        name: 'timeout',
        type: 'number',
        required: false,
        default: '2000',
        description: 'Success state duration',
      },
    ],
    returns: {
      type: 'UseClipboardReturn',
      description: 'Clipboard operations',
      properties: [
        {
          name: 'copy',
          type: '(text: string) => Promise<void>',
          description: 'Copy to clipboard',
        },
        {
          name: 'hasCopied',
          type: 'boolean',
          description: 'Recent copy success',
        },
        { name: 'error', type: 'Error | null', description: 'Copy error' },
      ],
    },
    examples: [
      {
        title: 'Copy Message',
        description: 'Copy text to clipboard',
        code: `import { useClipboard } from '@clarity-chat/react'

function CopyButton({ text }) {
  const { copy, hasCopied } = useClipboard()

  return (
    <button onClick={() => copy(text)}>
      {hasCopied ? 'Copied!' : 'Copy'}
    </button>
  )
}`,
      },
    ],
    relatedHooks: [],
    tags: ['clipboard', 'copy', 'utility'],
  },
]

// =============================================================================
// Search Functions
// =============================================================================

/**
 * Search components by query
 */
export function searchComponents(
  query: string,
  options?: {
    category?: ComponentCategory
    limit?: number
  }
): ComponentMeta[] {
  const { category, limit = 10 } = options || {}
  const lowerQuery = query.toLowerCase()

  let results = COMPONENTS.filter((component) => {
    // Category filter
    if (category && component.category !== category) return false

    // Search in name, description, and tags
    const searchableText = [
      component.name,
      component.displayName,
      component.description,
      ...component.tags,
    ]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(lowerQuery)
  })

  // Sort by relevance (exact name match first, then by tag match count)
  results.sort((a, b) => {
    const aNameMatch = a.name.toLowerCase().includes(lowerQuery) ? 1 : 0
    const bNameMatch = b.name.toLowerCase().includes(lowerQuery) ? 1 : 0
    if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch

    const aTagMatches = a.tags.filter((t) => t.includes(lowerQuery)).length
    const bTagMatches = b.tags.filter((t) => t.includes(lowerQuery)).length
    return bTagMatches - aTagMatches
  })

  return results.slice(0, limit)
}

/**
 * Search hooks by query
 */
export function searchHooks(
  query: string,
  options?: {
    limit?: number
  }
): HookMeta[] {
  const { limit = 10 } = options || {}
  const lowerQuery = query.toLowerCase()

  let results = HOOKS.filter((hook) => {
    const searchableText = [
      hook.name,
      hook.displayName,
      hook.description,
      ...hook.tags,
    ]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(lowerQuery)
  })

  results.sort((a, b) => {
    const aNameMatch = a.name.toLowerCase().includes(lowerQuery) ? 1 : 0
    const bNameMatch = b.name.toLowerCase().includes(lowerQuery) ? 1 : 0
    return bNameMatch - aNameMatch
  })

  return results.slice(0, limit)
}

/**
 * Get component by name
 */
export function getComponent(name: string): ComponentMeta | undefined {
  return COMPONENTS.find(
    (c) =>
      c.name.toLowerCase() === name.toLowerCase() ||
      c.displayName.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Get hook by name
 */
export function getHook(name: string): HookMeta | undefined {
  return HOOKS.find(
    (h) =>
      h.name.toLowerCase() === name.toLowerCase() ||
      h.displayName.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Get related components
 */
export function getRelatedComponents(componentName: string): ComponentMeta[] {
  const component = getComponent(componentName)
  if (!component) return []

  return component.relatedComponents
    .map((name) => getComponent(name))
    .filter((c): c is ComponentMeta => c !== undefined)
}

/**
 * Get components by category
 */
export function getComponentsByCategory(
  category: ComponentCategory
): ComponentMeta[] {
  return COMPONENTS.filter((c) => c.category === category)
}

/**
 * Get all categories with counts
 */
export function getCategoryStats(): {
  category: ComponentCategory
  count: number
}[] {
  const counts = new Map<ComponentCategory, number>()

  for (const component of COMPONENTS) {
    counts.set(component.category, (counts.get(component.category) || 0) + 1)
  }

  return Array.from(counts.entries()).map(([category, count]) => ({
    category,
    count,
  }))
}
