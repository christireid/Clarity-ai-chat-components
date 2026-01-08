/**
 * Clarity Chat Component Registry
 *
 * Comprehensive metadata for all 70+ React components and 35+ hooks.
 * This data powers component discovery, documentation lookup, and code generation.
 */
// =============================================================================
// Component Registry
// =============================================================================
export const COMPONENTS = [
    // Top-Level Components
    {
        name: 'ClarityChat',
        displayName: 'Clarity Chat',
        description: 'The main chat interface component. A complete, production-ready AI chat UI with streaming support, message history, and customizable appearance.',
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
            screenReaderNotes: 'Messages are announced as they arrive. Input has clear labeling.',
            focusManagement: 'Focus returns to input after sending. New messages do not steal focus.',
        },
        tags: ['chat', 'ai', 'streaming', 'messages', 'conversation', 'main'],
    },
    {
        name: 'ChatInput',
        displayName: 'Chat Input',
        description: 'A feature-rich input component for chat messages with auto-resize, keyboard shortcuts, and optional voice input.',
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
        description: 'Virtualized list component for displaying chat messages efficiently, even with thousands of messages.',
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
            screenReaderNotes: 'Messages are announced in order. Navigation is intuitive.',
            focusManagement: 'Focus can be moved to individual messages',
        },
        tags: ['list', 'messages', 'virtualized', 'scroll', 'history'],
    },
    {
        name: 'Message',
        displayName: 'Message',
        description: 'Individual message component with support for markdown, code blocks, and rich content.',
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
        description: 'Animated indicator showing that the AI is generating a response.',
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
            screenReaderNotes: 'Screen readers announce when AI starts and stops typing',
            focusManagement: 'Does not receive focus',
        },
        tags: ['loading', 'typing', 'animation', 'indicator', 'feedback'],
    },
    {
        name: 'ThinkingIndicator',
        displayName: 'Thinking Indicator',
        description: 'Extended indicator for showing AI reasoning/thinking process with optional status messages.',
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
        description: 'Renders text character-by-character for streaming AI responses with typewriter effect.',
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
            screenReaderNotes: 'Content is announced as it appears, without overwhelming the user',
            focusManagement: 'Does not affect focus',
        },
        tags: ['streaming', 'typewriter', 'animation', 'text', 'response'],
    },
    {
        name: 'ModelSelector',
        displayName: 'Model Selector',
        description: 'Dropdown component for selecting AI models with pricing and capability information.',
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
        description: 'Visual progress bar showing token usage against a budget with cost estimation.',
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
        description: 'Voice-to-text input component using Web Speech API with waveform visualization.',
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
            screenReaderNotes: 'Recording state is announced, transcript is read back',
            focusManagement: 'Button maintains focus during recording',
        },
        tags: ['voice', 'speech', 'microphone', 'audio', 'input'],
    },
    {
        name: 'CopyButton',
        displayName: 'Copy Button',
        description: 'Button component for copying text to clipboard with success feedback animation.',
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
        description: 'React error boundary with fallback UI and error reporting capabilities.',
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
        description: 'Non-blocking notification component for success, error, and info messages.',
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
        description: 'Component displaying suggested prompts or quick actions for users.',
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
        description: 'Comprehensive settings panel for configuring chat behavior, appearance, and AI parameters.',
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
        description: 'Sidebar component showing conversation history with search and management features.',
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
        description: 'Dashboard component displaying token usage, costs, and API call statistics.',
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
        description: 'Card component for displaying AI tool/function calls with inputs, outputs, and status.',
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
        description: 'Debug component for inspecting conversation memory and context state.',
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
    // =========================================================================
    // Message Components
    // =========================================================================
    {
        name: 'Message',
        displayName: 'Message',
        description: 'Base message component for displaying a single chat message with role-based styling.',
        category: 'message',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'role',
                type: "'user' | 'assistant' | 'system'",
                required: true,
                description: 'Message sender role',
            },
            {
                name: 'content',
                type: 'string | ReactNode',
                required: true,
                description: 'Message content',
            },
            {
                name: 'timestamp',
                type: 'Date',
                required: false,
                description: 'Message timestamp',
            },
            {
                name: 'avatar',
                type: 'ReactNode',
                required: false,
                description: 'Custom avatar',
            },
        ],
        examples: [
            {
                title: 'Basic Message',
                description: 'Display a message',
                code: '<Message role="user" content="Hello!" />',
            },
        ],
        relatedComponents: ['MessageList', 'MessageMetadata'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab navigation'],
            ariaAttributes: ['role="article"'],
            screenReaderNotes: 'Message role is announced',
            focusManagement: 'Standard',
        },
        tags: ['message', 'chat', 'display'],
    },
    {
        name: 'MessageList',
        displayName: 'Message List',
        description: 'Virtualized list of messages with auto-scroll, optimized for large conversation histories.',
        category: 'message',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'messages',
                type: 'Message[]',
                required: true,
                description: 'Array of messages',
            },
            {
                name: 'onLoadMore',
                type: '() => void',
                required: false,
                description: 'Load more callback',
            },
            {
                name: 'virtualized',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Enable virtualization',
            },
        ],
        examples: [
            {
                title: 'Message List',
                description: 'Display messages',
                code: '<MessageList messages={messages} />',
            },
        ],
        relatedComponents: ['Message', 'VirtualizedMessageList'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Arrow keys to navigate', 'Home/End'],
            ariaAttributes: ['role="log"', 'aria-live="polite"'],
            screenReaderNotes: 'New messages announced',
            focusManagement: 'Roving tabindex',
        },
        tags: ['message', 'list', 'virtualized', 'scroll'],
    },
    {
        name: 'StreamingMessage',
        displayName: 'Streaming Message',
        description: 'Real-time streaming message display with typewriter effect and cursor animation.',
        category: 'message',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'content',
                type: 'string',
                required: true,
                description: 'Streaming content',
            },
            {
                name: 'isStreaming',
                type: 'boolean',
                required: true,
                description: 'Streaming state',
            },
            {
                name: 'showCursor',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Show cursor',
            },
        ],
        examples: [
            {
                title: 'Streaming',
                description: 'Stream text',
                code: '<StreamingMessage content={text} isStreaming={true} />',
            },
        ],
        relatedComponents: ['Message', 'ThinkingIndicator'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: [],
            ariaAttributes: ['aria-live="polite"', 'aria-busy'],
            screenReaderNotes: 'Content updates announced',
            focusManagement: 'Auto-focus when complete',
        },
        tags: ['streaming', 'message', 'typewriter', 'animation'],
    },
    // =========================================================================
    // Tool & Agent Components
    // =========================================================================
    {
        name: 'ToolInvocationCard',
        displayName: 'Tool Invocation Card',
        description: 'Display tool/function calls made by the AI with arguments, status, and results.',
        category: 'display',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'toolName',
                type: 'string',
                required: true,
                description: 'Name of the tool',
            },
            {
                name: 'arguments',
                type: 'Record<string, unknown>',
                required: true,
                description: 'Tool arguments',
            },
            {
                name: 'result',
                type: 'unknown',
                required: false,
                description: 'Tool result',
            },
            {
                name: 'status',
                type: "'pending' | 'success' | 'error'",
                required: false,
                default: "'pending'",
                description: 'Invocation status',
            },
        ],
        examples: [
            {
                title: 'Tool Card',
                description: 'Show tool call',
                code: '<ToolInvocationCard toolName="search" arguments={{ query: "test" }} />',
            },
        ],
        relatedComponents: ['AgentRunFeed', 'ClarityToolResult'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab to expand'],
            ariaAttributes: ['role="region"', 'aria-expanded'],
            screenReaderNotes: 'Tool status announced',
            focusManagement: 'Collapsible region',
        },
        tags: ['tool', 'function', 'agent', 'ai'],
    },
    {
        name: 'AgentRunFeed',
        displayName: 'Agent Run Feed',
        description: 'Timeline feed showing agent execution steps, tool calls, and reasoning process.',
        category: 'ai-ops',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'steps',
                type: 'AgentStep[]',
                required: true,
                description: 'Agent execution steps',
            },
            {
                name: 'isRunning',
                type: 'boolean',
                required: false,
                description: 'Agent running state',
            },
            {
                name: 'showTimeline',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Show timeline view',
            },
        ],
        examples: [
            {
                title: 'Agent Feed',
                description: 'Show agent steps',
                code: '<AgentRunFeed steps={agentSteps} isRunning={isRunning} />',
            },
        ],
        relatedComponents: ['ToolInvocationCard', 'ThinkingIndicator'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Arrow keys to navigate steps'],
            ariaAttributes: ['role="feed"', 'aria-busy'],
            screenReaderNotes: 'Step progress announced',
            focusManagement: 'Sequential navigation',
        },
        tags: ['agent', 'timeline', 'steps', 'reasoning'],
    },
    // =========================================================================
    // Dashboard Components
    // =========================================================================
    {
        name: 'AnalyticsDashboard',
        displayName: 'Analytics Dashboard',
        description: 'Comprehensive analytics dashboard showing usage, performance, and conversation metrics.',
        category: 'analytics',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'data',
                type: 'AnalyticsData',
                required: true,
                description: 'Analytics data',
            },
            {
                name: 'dateRange',
                type: 'DateRange',
                required: false,
                description: 'Date range filter',
            },
            {
                name: 'showExport',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Show export button',
            },
        ],
        examples: [
            {
                title: 'Dashboard',
                description: 'Show analytics',
                code: '<AnalyticsDashboard data={analyticsData} />',
            },
        ],
        relatedComponents: ['UsageDashboard', 'PerformanceDashboard'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab through sections', 'Arrow keys in charts'],
            ariaAttributes: ['role="region"', 'aria-label'],
            screenReaderNotes: 'Charts have text alternatives',
            focusManagement: 'Section-based navigation',
        },
        tags: ['analytics', 'dashboard', 'metrics', 'charts'],
    },
    {
        name: 'UsageDashboard',
        displayName: 'Usage Dashboard',
        description: 'Track API usage, token consumption, and cost metrics across models and time.',
        category: 'analytics',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'usage',
                type: 'UsageData',
                required: true,
                description: 'Usage data',
            },
            {
                name: 'budget',
                type: 'Budget',
                required: false,
                description: 'Budget limits',
            },
        ],
        examples: [
            {
                title: 'Usage',
                description: 'Track usage',
                code: '<UsageDashboard usage={usageData} />',
            },
        ],
        relatedComponents: ['TokenUsageMeter', 'TokenBudgetBar'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab navigation'],
            ariaAttributes: ['role="region"'],
            screenReaderNotes: 'Usage values announced',
            focusManagement: 'Standard',
        },
        tags: ['usage', 'tokens', 'cost', 'budget'],
    },
    // =========================================================================
    // Input Components
    // =========================================================================
    {
        name: 'VoiceInput',
        displayName: 'Voice Input',
        description: 'Voice-to-text input component with real-time transcription and waveform visualization.',
        category: 'input',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'onTranscript',
                type: '(text: string) => void',
                required: true,
                description: 'Transcript callback',
            },
            {
                name: 'language',
                type: 'string',
                required: false,
                default: "'en-US'",
                description: 'Recognition language',
            },
            {
                name: 'showWaveform',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Show audio waveform',
            },
        ],
        examples: [
            {
                title: 'Voice',
                description: 'Voice input',
                code: '<VoiceInput onTranscript={handleTranscript} />',
            },
        ],
        relatedComponents: ['ChatInput', 'AdvancedChatInput'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Space to toggle recording'],
            ariaAttributes: ['aria-pressed', 'aria-label'],
            screenReaderNotes: 'Recording state announced',
            focusManagement: 'Button focus',
        },
        tags: ['voice', 'speech', 'transcription', 'audio'],
    },
    {
        name: 'FileUpload',
        displayName: 'File Upload',
        description: 'Drag-and-drop file upload component with preview, validation, and progress tracking.',
        category: 'input',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'onUpload',
                type: '(files: File[]) => void',
                required: true,
                description: 'Upload callback',
            },
            {
                name: 'accept',
                type: 'string',
                required: false,
                description: 'Accepted file types',
            },
            {
                name: 'maxSize',
                type: 'number',
                required: false,
                description: 'Max file size in bytes',
            },
            {
                name: 'multiple',
                type: 'boolean',
                required: false,
                default: 'false',
                description: 'Allow multiple files',
            },
        ],
        examples: [
            {
                title: 'Upload',
                description: 'File upload',
                code: '<FileUpload onUpload={handleFiles} accept="image/*" />',
            },
        ],
        relatedComponents: ['ChatInput', 'DocumentViewer'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Enter to open dialog', 'Space to drop'],
            ariaAttributes: ['role="button"', 'aria-dropeffect'],
            screenReaderNotes: 'Drop zone instructions provided',
            focusManagement: 'Focus returns after dialog',
        },
        tags: ['upload', 'file', 'drag-drop', 'attachment'],
    },
    {
        name: 'CommandPalette',
        displayName: 'Command Palette',
        description: 'Keyboard-first command palette for quick actions, search, and navigation.',
        category: 'input',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'commands',
                type: 'Command[]',
                required: true,
                description: 'Available commands',
            },
            {
                name: 'isOpen',
                type: 'boolean',
                required: true,
                description: 'Open state',
            },
            {
                name: 'onClose',
                type: '() => void',
                required: true,
                description: 'Close callback',
            },
            {
                name: 'onSelect',
                type: '(command: Command) => void',
                required: true,
                description: 'Selection callback',
            },
        ],
        examples: [
            {
                title: 'Palette',
                description: 'Command palette',
                code: '<CommandPalette commands={commands} isOpen={open} onClose={close} onSelect={select} />',
            },
        ],
        relatedComponents: ['ContextMenu', 'KeyboardHint'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: [
                'Cmd+K to open',
                'Arrow keys',
                'Enter to select',
                'Escape to close',
            ],
            ariaAttributes: ['role="dialog"', 'aria-modal', 'role="listbox"'],
            screenReaderNotes: 'Search results announced',
            focusManagement: 'Focus trap when open',
        },
        tags: ['command', 'palette', 'keyboard', 'search', 'actions'],
    },
    // =========================================================================
    // Feedback Components
    // =========================================================================
    {
        name: 'Toast',
        displayName: 'Toast',
        description: 'Non-blocking notification toast with auto-dismiss and action support.',
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
                type: "'info' | 'success' | 'warning' | 'error'",
                required: false,
                default: "'info'",
                description: 'Toast type',
            },
            {
                name: 'duration',
                type: 'number',
                required: false,
                default: '5000',
                description: 'Auto-dismiss duration',
            },
            {
                name: 'action',
                type: 'ToastAction',
                required: false,
                description: 'Optional action button',
            },
        ],
        examples: [
            {
                title: 'Toast',
                description: 'Show notification',
                code: '<Toast message="Message sent" type="success" />',
            },
        ],
        relatedComponents: ['ErrorMessage', 'SuccessState'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab to action', 'Escape to dismiss'],
            ariaAttributes: ['role="alert"', 'aria-live="polite"'],
            screenReaderNotes: 'Toast content announced immediately',
            focusManagement: 'Does not steal focus',
        },
        tags: ['toast', 'notification', 'alert', 'feedback'],
    },
    {
        name: 'RetryButton',
        displayName: 'Retry Button',
        description: 'Smart retry button with exponential backoff countdown and attempt tracking.',
        category: 'feedback',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'onRetry',
                type: '() => void',
                required: true,
                description: 'Retry callback',
            },
            {
                name: 'maxAttempts',
                type: 'number',
                required: false,
                default: '3',
                description: 'Maximum retry attempts',
            },
            {
                name: 'showCountdown',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Show backoff countdown',
            },
        ],
        examples: [
            {
                title: 'Retry',
                description: 'Retry failed action',
                code: '<RetryButton onRetry={handleRetry} />',
            },
        ],
        relatedComponents: ['ErrorBoundary', 'ErrorMessage'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Enter to retry'],
            ariaAttributes: ['aria-disabled when counting', 'aria-label'],
            screenReaderNotes: 'Countdown announced',
            focusManagement: 'Button receives focus',
        },
        tags: ['retry', 'error', 'recovery', 'backoff'],
    },
    {
        name: 'NetworkStatus',
        displayName: 'Network Status',
        description: 'Real-time network connection status indicator with offline mode support.',
        category: 'feedback',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'showBanner',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Show offline banner',
            },
            {
                name: 'onStatusChange',
                type: '(online: boolean) => void',
                required: false,
                description: 'Status change callback',
            },
        ],
        examples: [
            {
                title: 'Network',
                description: 'Show status',
                code: '<NetworkStatus showBanner onStatusChange={handleStatus} />',
            },
        ],
        relatedComponents: ['Toast', 'ErrorBoundary'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: [],
            ariaAttributes: ['role="status"', 'aria-live="assertive"'],
            screenReaderNotes: 'Connection changes announced',
            focusManagement: 'None',
        },
        tags: ['network', 'offline', 'connection', 'status'],
    },
    // =========================================================================
    // Navigation Components
    // =========================================================================
    {
        name: 'ConversationList',
        displayName: 'Conversation List',
        description: 'Sidebar list of conversations with search, filtering, and selection.',
        category: 'navigation',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'conversations',
                type: 'Conversation[]',
                required: true,
                description: 'Conversation list',
            },
            {
                name: 'selectedId',
                type: 'string',
                required: false,
                description: 'Selected conversation ID',
            },
            {
                name: 'onSelect',
                type: '(id: string) => void',
                required: true,
                description: 'Selection callback',
            },
            {
                name: 'onDelete',
                type: '(id: string) => void',
                required: false,
                description: 'Delete callback',
            },
        ],
        examples: [
            {
                title: 'List',
                description: 'Conversation list',
                code: '<ConversationList conversations={convos} onSelect={select} />',
            },
        ],
        relatedComponents: ['ProjectSidebar', 'HistoryManager'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: [
                'Arrow keys to navigate',
                'Enter to select',
                'Delete to remove',
            ],
            ariaAttributes: ['role="listbox"', 'aria-selected'],
            screenReaderNotes: 'Selection state announced',
            focusManagement: 'Roving tabindex',
        },
        tags: ['conversation', 'list', 'sidebar', 'history'],
    },
    {
        name: 'HistoryManager',
        displayName: 'History Manager',
        description: 'Full conversation history management with search, export, and bulk actions.',
        category: 'navigation',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'conversations',
                type: 'Conversation[]',
                required: true,
                description: 'All conversations',
            },
            {
                name: 'onExport',
                type: '(ids: string[]) => void',
                required: false,
                description: 'Export callback',
            },
            {
                name: 'onBulkDelete',
                type: '(ids: string[]) => void',
                required: false,
                description: 'Bulk delete callback',
            },
        ],
        examples: [
            {
                title: 'History',
                description: 'Manage history',
                code: '<HistoryManager conversations={all} onExport={exportFn} />',
            },
        ],
        relatedComponents: ['ConversationList', 'ExportDialog'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Ctrl+A select all', 'Delete for bulk delete'],
            ariaAttributes: ['role="application"'],
            screenReaderNotes: 'Selection count announced',
            focusManagement: 'Multi-select pattern',
        },
        tags: ['history', 'manage', 'export', 'bulk'],
    },
    // =========================================================================
    // Context & Information Components
    // =========================================================================
    {
        name: 'ContextCard',
        displayName: 'Context Card',
        description: 'Display context information provided to the AI with expandable details.',
        category: 'display',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'title',
                type: 'string',
                required: true,
                description: 'Context title',
            },
            {
                name: 'content',
                type: 'string | ReactNode',
                required: true,
                description: 'Context content',
            },
            {
                name: 'tokenCount',
                type: 'number',
                required: false,
                description: 'Token count',
            },
            {
                name: 'collapsible',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Allow collapse',
            },
        ],
        examples: [
            {
                title: 'Context',
                description: 'Show context',
                code: '<ContextCard title="System Prompt" content={prompt} />',
            },
        ],
        relatedComponents: ['ContextVisualizer', 'ContextManager'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Enter to toggle'],
            ariaAttributes: ['aria-expanded', 'aria-controls'],
            screenReaderNotes: 'Expansion state announced',
            focusManagement: 'Focus maintained on toggle',
        },
        tags: ['context', 'card', 'information', 'expandable'],
    },
    {
        name: 'PromptSuggestions',
        displayName: 'Prompt Suggestions',
        description: 'AI-powered prompt suggestions based on conversation context.',
        category: 'input',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'suggestions',
                type: 'string[]',
                required: true,
                description: 'Suggestion list',
            },
            {
                name: 'onSelect',
                type: '(suggestion: string) => void',
                required: true,
                description: 'Selection callback',
            },
            {
                name: 'loading',
                type: 'boolean',
                required: false,
                description: 'Loading state',
            },
        ],
        examples: [
            {
                title: 'Suggestions',
                description: 'Show suggestions',
                code: '<PromptSuggestions suggestions={prompts} onSelect={select} />',
            },
        ],
        relatedComponents: ['ChatInput', 'FollowUpSuggestions'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Arrow keys', 'Enter to select'],
            ariaAttributes: ['role="listbox"', 'aria-label'],
            screenReaderNotes: 'Suggestions announced',
            focusManagement: 'Focus on first item',
        },
        tags: ['suggestions', 'prompts', 'ai', 'autocomplete'],
    },
    {
        name: 'FollowUpSuggestions',
        displayName: 'Follow-up Suggestions',
        description: 'Smart follow-up question suggestions after AI responses.',
        category: 'display',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'suggestions',
                type: 'string[]',
                required: true,
                description: 'Follow-up questions',
            },
            {
                name: 'onSelect',
                type: '(question: string) => void',
                required: true,
                description: 'Selection callback',
            },
        ],
        examples: [
            {
                title: 'Follow-ups',
                description: 'Show follow-ups',
                code: '<FollowUpSuggestions suggestions={questions} onSelect={ask} />',
            },
        ],
        relatedComponents: ['PromptSuggestions', 'Message'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab to navigate', 'Enter to select'],
            ariaAttributes: ['role="group"', 'aria-label'],
            screenReaderNotes: 'Available follow-ups announced',
            focusManagement: 'Group navigation',
        },
        tags: ['follow-up', 'suggestions', 'questions', 'ai'],
    },
    // =========================================================================
    // Empty & Error States
    // =========================================================================
    {
        name: 'EmptyState',
        displayName: 'Empty State',
        description: 'Customizable empty state component with illustration and action.',
        category: 'feedback',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'title',
                type: 'string',
                required: true,
                description: 'Empty state title',
            },
            {
                name: 'description',
                type: 'string',
                required: false,
                description: 'Description text',
            },
            {
                name: 'icon',
                type: 'ReactNode',
                required: false,
                description: 'Custom icon',
            },
            {
                name: 'action',
                type: 'ReactNode',
                required: false,
                description: 'Call to action',
            },
        ],
        examples: [
            {
                title: 'Empty',
                description: 'Show empty state',
                code: '<EmptyState title="No messages" action={<button>Start chat</button>} />',
            },
        ],
        relatedComponents: ['EmptyChatState', 'ErrorState'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab to action'],
            ariaAttributes: ['role="status"'],
            screenReaderNotes: 'Empty state description read',
            focusManagement: 'Focus on action if present',
        },
        tags: ['empty', 'state', 'placeholder', 'onboarding'],
    },
    {
        name: 'ErrorState',
        displayName: 'Error State',
        description: 'Error state display with retry action and error details.',
        category: 'feedback',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'error',
                type: 'Error | string',
                required: true,
                description: 'Error to display',
            },
            {
                name: 'onRetry',
                type: '() => void',
                required: false,
                description: 'Retry callback',
            },
            {
                name: 'showDetails',
                type: 'boolean',
                required: false,
                default: 'false',
                description: 'Show error details',
            },
        ],
        examples: [
            {
                title: 'Error',
                description: 'Show error',
                code: '<ErrorState error={error} onRetry={retry} />',
            },
        ],
        relatedComponents: ['EmptyState', 'ErrorBoundary'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab to retry'],
            ariaAttributes: ['role="alert"'],
            screenReaderNotes: 'Error announced immediately',
            focusManagement: 'Focus on retry button',
        },
        tags: ['error', 'state', 'retry', 'failure'],
    },
    // =========================================================================
    // Enterprise Components
    // =========================================================================
    {
        name: 'AuditLogViewer',
        displayName: 'Audit Log Viewer',
        description: 'Enterprise audit log viewer with filtering, search, and export capabilities.',
        category: 'enterprise',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'logs',
                type: 'AuditLog[]',
                required: true,
                description: 'Audit log entries',
            },
            {
                name: 'onExport',
                type: '(logs: AuditLog[]) => void',
                required: false,
                description: 'Export callback',
            },
            {
                name: 'filters',
                type: 'AuditFilters',
                required: false,
                description: 'Active filters',
            },
        ],
        examples: [
            {
                title: 'Audit',
                description: 'View logs',
                code: '<AuditLogViewer logs={auditLogs} onExport={exportLogs} />',
            },
        ],
        relatedComponents: ['AnalyticsDashboard', 'SafetyStatusCard'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab through rows', 'Enter for details'],
            ariaAttributes: ['role="grid"'],
            screenReaderNotes: 'Log entries navigable',
            focusManagement: 'Grid navigation',
        },
        tags: ['audit', 'logs', 'enterprise', 'compliance'],
    },
    {
        name: 'ApiTokenManager',
        displayName: 'API Token Manager',
        description: 'Manage API tokens with creation, revocation, and usage tracking.',
        category: 'enterprise',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'tokens',
                type: 'ApiToken[]',
                required: true,
                description: 'API tokens',
            },
            {
                name: 'onCreate',
                type: '(name: string) => void',
                required: true,
                description: 'Create callback',
            },
            {
                name: 'onRevoke',
                type: '(id: string) => void',
                required: true,
                description: 'Revoke callback',
            },
        ],
        examples: [
            {
                title: 'Tokens',
                description: 'Manage tokens',
                code: '<ApiTokenManager tokens={tokens} onCreate={create} onRevoke={revoke} />',
            },
        ],
        relatedComponents: ['SettingsPanel', 'AuditLogViewer'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab navigation', 'Delete to revoke'],
            ariaAttributes: ['role="table"'],
            screenReaderNotes: 'Token actions described',
            focusManagement: 'Focus management on actions',
        },
        tags: ['api', 'tokens', 'security', 'enterprise'],
    },
    // =========================================================================
    // Visualization Components
    // =========================================================================
    {
        name: 'EnhancedMarkdownRenderer',
        displayName: 'Enhanced Markdown Renderer',
        description: 'Full-featured markdown renderer with syntax highlighting, math, and diagrams.',
        category: 'display',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'content',
                type: 'string',
                required: true,
                description: 'Markdown content',
            },
            {
                name: 'syntaxHighlight',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Enable syntax highlighting',
            },
            {
                name: 'allowHtml',
                type: 'boolean',
                required: false,
                default: 'false',
                description: 'Allow HTML in markdown',
            },
        ],
        examples: [
            {
                title: 'Markdown',
                description: 'Render markdown',
                code: '<EnhancedMarkdownRenderer content={markdown} />',
            },
        ],
        relatedComponents: ['EnhancedCodeBlock', 'Message'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab through links', 'Tab through code blocks'],
            ariaAttributes: ['role="document"'],
            screenReaderNotes: 'Semantic HTML used',
            focusManagement: 'Standard link navigation',
        },
        tags: ['markdown', 'render', 'syntax', 'code'],
    },
    {
        name: 'EnhancedCodeBlock',
        displayName: 'Enhanced Code Block',
        description: 'Code block with syntax highlighting, line numbers, copy button, and language detection.',
        category: 'display',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
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
                description: 'Programming language',
            },
            {
                name: 'showLineNumbers',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Show line numbers',
            },
            {
                name: 'showCopyButton',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Show copy button',
            },
        ],
        examples: [
            {
                title: 'Code',
                description: 'Show code',
                code: '<EnhancedCodeBlock code={code} language="typescript" />',
            },
        ],
        relatedComponents: ['EnhancedMarkdownRenderer', 'CopyButton'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab to copy button'],
            ariaAttributes: ['role="region"', 'aria-label'],
            screenReaderNotes: 'Language announced',
            focusManagement: 'Focus on copy button',
        },
        tags: ['code', 'syntax', 'highlight', 'copy'],
    },
    // =========================================================================
    // Utility UI Components
    // =========================================================================
    {
        name: 'CopyButton',
        displayName: 'Copy Button',
        description: 'One-click copy to clipboard button with success feedback animation.',
        category: 'display',
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
                description: 'Copy callback',
            },
            {
                name: 'successDuration',
                type: 'number',
                required: false,
                default: '2000',
                description: 'Success display duration',
            },
        ],
        examples: [
            {
                title: 'Copy',
                description: 'Copy text',
                code: '<CopyButton text="Hello" />',
            },
        ],
        relatedComponents: ['EnhancedCodeBlock', 'Message'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Enter to copy'],
            ariaAttributes: ['aria-label', 'aria-pressed'],
            screenReaderNotes: 'Copy success announced',
            focusManagement: 'Focus maintained',
        },
        tags: ['copy', 'clipboard', 'button', 'utility'],
    },
    {
        name: 'Skeleton',
        displayName: 'Skeleton',
        description: 'Loading skeleton placeholder with shimmer animation.',
        category: 'feedback',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'width',
                type: 'string | number',
                required: false,
                description: 'Skeleton width',
            },
            {
                name: 'height',
                type: 'string | number',
                required: false,
                description: 'Skeleton height',
            },
            {
                name: 'variant',
                type: "'text' | 'circular' | 'rectangular'",
                required: false,
                default: "'text'",
                description: 'Shape variant',
            },
        ],
        examples: [
            {
                title: 'Skeleton',
                description: 'Loading placeholder',
                code: '<Skeleton width={200} height={20} />',
            },
        ],
        relatedComponents: ['ThinkingIndicator', 'LoadingSpinner'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: [],
            ariaAttributes: ['aria-busy="true"', 'aria-label="Loading"'],
            screenReaderNotes: 'Loading state announced',
            focusManagement: 'Not focusable',
        },
        tags: ['skeleton', 'loading', 'placeholder', 'shimmer'],
    },
    {
        name: 'CollapsibleSection',
        displayName: 'Collapsible Section',
        description: 'Expandable/collapsible section with smooth animation.',
        category: 'display',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'title',
                type: 'string | ReactNode',
                required: true,
                description: 'Section header',
            },
            {
                name: 'children',
                type: 'ReactNode',
                required: true,
                description: 'Section content',
            },
            {
                name: 'defaultOpen',
                type: 'boolean',
                required: false,
                default: 'false',
                description: 'Initially open',
            },
        ],
        examples: [
            {
                title: 'Collapsible',
                description: 'Expandable section',
                code: '<CollapsibleSection title="Details">{content}</CollapsibleSection>',
            },
        ],
        relatedComponents: ['ContextCard', 'ToolInvocationCard'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Enter to toggle', 'Space to toggle'],
            ariaAttributes: ['aria-expanded', 'aria-controls'],
            screenReaderNotes: 'Expansion state announced',
            focusManagement: 'Focus on header',
        },
        tags: ['collapsible', 'accordion', 'expandable', 'section'],
    },
    {
        name: 'KeyboardHint',
        displayName: 'Keyboard Hint',
        description: 'Display keyboard shortcut hints with styled key caps.',
        category: 'display',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'keys',
                type: 'string[]',
                required: true,
                description: 'Key combination',
            },
            {
                name: 'label',
                type: 'string',
                required: false,
                description: 'Action description',
            },
        ],
        examples: [
            {
                title: 'Hint',
                description: 'Show shortcut',
                code: '<KeyboardHint keys={["Cmd", "K"]} label="Open command palette" />',
            },
        ],
        relatedComponents: ['CommandPalette', 'ContextMenu'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: [],
            ariaAttributes: ['aria-label'],
            screenReaderNotes: 'Shortcut keys announced',
            focusManagement: 'Not focusable',
        },
        tags: ['keyboard', 'shortcut', 'hint', 'keybinding'],
    },
    // =========================================================================
    // Model & Settings Components
    // =========================================================================
    {
        name: 'ModelSelector',
        displayName: 'Model Selector',
        description: 'Dropdown selector for AI models with capability and pricing information.',
        category: 'input',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'models',
                type: 'Model[]',
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
                description: 'Change callback',
            },
            {
                name: 'showPricing',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Show pricing info',
            },
        ],
        examples: [
            {
                title: 'Selector',
                description: 'Select model',
                code: '<ModelSelector models={models} value={selected} onChange={setModel} />',
            },
        ],
        relatedComponents: ['SettingsPanel', 'ClarityChat'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Arrow keys', 'Enter to select', 'Escape to close'],
            ariaAttributes: ['role="listbox"', 'aria-selected'],
            screenReaderNotes: 'Model capabilities announced',
            focusManagement: 'Combobox pattern',
        },
        tags: ['model', 'selector', 'dropdown', 'ai'],
    },
    {
        name: 'ThemeSwitcher',
        displayName: 'Theme Switcher',
        description: 'Toggle or select between light, dark, and system themes.',
        category: 'display',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'value',
                type: "'light' | 'dark' | 'system'",
                required: true,
                description: 'Current theme',
            },
            {
                name: 'onChange',
                type: '(theme: Theme) => void',
                required: true,
                description: 'Change callback',
            },
            {
                name: 'variant',
                type: "'toggle' | 'dropdown'",
                required: false,
                default: "'toggle'",
                description: 'UI variant',
            },
        ],
        examples: [
            {
                title: 'Theme',
                description: 'Switch theme',
                code: '<ThemeSwitcher value={theme} onChange={setTheme} />',
            },
        ],
        relatedComponents: ['SettingsPanel', 'ThemeSelector'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Enter to toggle', 'Arrow keys for dropdown'],
            ariaAttributes: ['aria-pressed', 'aria-label'],
            screenReaderNotes: 'Theme state announced',
            focusManagement: 'Button focus',
        },
        tags: ['theme', 'dark-mode', 'light-mode', 'toggle'],
    },
    {
        name: 'SettingsPanel',
        displayName: 'Settings Panel',
        description: 'Comprehensive settings panel with sections for model, appearance, and preferences.',
        category: 'display',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        props: [
            {
                name: 'settings',
                type: 'Settings',
                required: true,
                description: 'Current settings',
            },
            {
                name: 'onSave',
                type: '(settings: Settings) => void',
                required: true,
                description: 'Save callback',
            },
            {
                name: 'sections',
                type: 'SettingsSection[]',
                required: false,
                description: 'Custom sections',
            },
        ],
        examples: [
            {
                title: 'Settings',
                description: 'Settings panel',
                code: '<SettingsPanel settings={settings} onSave={saveSettings} />',
            },
        ],
        relatedComponents: ['ModelSelector', 'ThemeSwitcher'],
        accessibility: {
            wcagLevel: 'AA',
            keyboardSupport: ['Tab between sections', 'Enter to save'],
            ariaAttributes: ['role="form"'],
            screenReaderNotes: 'Form fields labeled',
            focusManagement: 'Form navigation',
        },
        tags: ['settings', 'panel', 'configuration', 'preferences'],
    },
];
// =============================================================================
// Hook Registry
// =============================================================================
export const HOOKS = [
    {
        name: 'useClarityChat',
        displayName: 'useClarity Chat',
        description: 'Primary hook for managing chat state, sending messages, and handling streaming responses.',
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
        description: 'Hook for tracking token usage and estimating costs in real-time.',
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
        description: 'Low-level hook for Server-Sent Events streaming with reconnection support.',
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
        description: 'Hook for registering and managing keyboard shortcuts in chat interfaces.',
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
        description: 'Hook for persisting chat settings and preferences in local storage.',
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
    // ===========================================================================
    // Additional Hooks (9-35+)
    // ===========================================================================
    {
        name: 'useMessageHistory',
        displayName: 'useMessage History',
        description: 'Hook for managing and persisting chat message history with IndexedDB support.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'conversationId',
                type: 'string',
                required: true,
                description: 'Unique conversation identifier',
            },
            {
                name: 'maxMessages',
                type: 'number',
                required: false,
                default: '1000',
                description: 'Maximum messages to keep',
            },
        ],
        returns: {
            type: 'UseMessageHistoryReturn',
            description: 'Message history state and methods',
            properties: [
                { name: 'messages', type: 'Message[]', description: 'Stored messages' },
                {
                    name: 'addMessage',
                    type: '(message: Message) => void',
                    description: 'Add message to history',
                },
                {
                    name: 'clearHistory',
                    type: '() => void',
                    description: 'Clear all history',
                },
                { name: 'isLoading', type: 'boolean', description: 'Loading state' },
            ],
        },
        examples: [
            {
                title: 'Persistent History',
                description: 'Load and save message history',
                code: `import { useMessageHistory } from '@clarity-chat/react'

function Chat({ conversationId }) {
  const { messages, addMessage, clearHistory } = useMessageHistory(conversationId)

  return <MessageList messages={messages} />
}`,
            },
        ],
        relatedHooks: ['useClarityChat', 'useIndexedDB'],
        tags: ['history', 'persistence', 'messages', 'storage'],
    },
    {
        name: 'useConversation',
        displayName: 'useConversation',
        description: 'Hook for managing conversation state, metadata, and switching between conversations.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'initialConversationId',
                type: 'string',
                required: false,
                description: 'Initial conversation ID',
            },
        ],
        returns: {
            type: 'UseConversationReturn',
            description: 'Conversation state and methods',
            properties: [
                {
                    name: 'conversationId',
                    type: 'string',
                    description: 'Current conversation ID',
                },
                {
                    name: 'conversations',
                    type: 'Conversation[]',
                    description: 'All conversations',
                },
                {
                    name: 'switchConversation',
                    type: '(id: string) => void',
                    description: 'Switch active conversation',
                },
                {
                    name: 'createConversation',
                    type: '() => string',
                    description: 'Create new conversation',
                },
                {
                    name: 'deleteConversation',
                    type: '(id: string) => void',
                    description: 'Delete conversation',
                },
            ],
        },
        examples: [
            {
                title: 'Conversation Management',
                description: 'Manage multiple conversations',
                code: `import { useConversation } from '@clarity-chat/react'

function ConversationSidebar() {
  const { conversations, switchConversation, createConversation } = useConversation()

  return (
    <div>
      <button onClick={createConversation}>New Chat</button>
      {conversations.map(c => (
        <button key={c.id} onClick={() => switchConversation(c.id)}>
          {c.title}
        </button>
      ))}
    </div>
  )
}`,
            },
        ],
        relatedHooks: ['useClarityChat', 'useMessageHistory'],
        tags: ['conversation', 'state', 'management', 'switching'],
    },
    {
        name: 'useRetry',
        displayName: 'useRetry',
        description: 'Hook for implementing retry logic with exponential backoff for failed operations.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'maxRetries',
                type: 'number',
                required: false,
                default: '3',
                description: 'Maximum retry attempts',
            },
            {
                name: 'baseDelay',
                type: 'number',
                required: false,
                default: '1000',
                description: 'Base delay in ms',
            },
        ],
        returns: {
            type: 'UseRetryReturn',
            description: 'Retry state and methods',
            properties: [
                {
                    name: 'execute',
                    type: '<T>(fn: () => Promise<T>) => Promise<T>',
                    description: 'Execute with retry',
                },
                {
                    name: 'retryCount',
                    type: 'number',
                    description: 'Current retry count',
                },
                {
                    name: 'isRetrying',
                    type: 'boolean',
                    description: 'Currently retrying',
                },
                { name: 'reset', type: '() => void', description: 'Reset retry state' },
            ],
        },
        examples: [
            {
                title: 'Retry API Calls',
                description: 'Retry failed requests',
                code: `import { useRetry } from '@clarity-chat/react'

function Chat() {
  const { execute, isRetrying, retryCount } = useRetry({ maxRetries: 3 })

  const sendWithRetry = async (message) => {
    return execute(() => api.sendMessage(message))
  }
}`,
            },
        ],
        relatedHooks: ['useClarityChat', 'useNetworkStatus'],
        tags: ['retry', 'error-handling', 'resilience', 'api'],
    },
    {
        name: 'useNetworkStatus',
        displayName: 'useNetwork Status',
        description: 'Hook for monitoring network connectivity and handling offline scenarios.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [],
        returns: {
            type: 'UseNetworkStatusReturn',
            description: 'Network status state',
            properties: [
                { name: 'isOnline', type: 'boolean', description: 'Online status' },
                {
                    name: 'wasOffline',
                    type: 'boolean',
                    description: 'Was recently offline',
                },
                {
                    name: 'effectiveType',
                    type: 'string',
                    description: 'Connection type (4g, 3g, etc)',
                },
                {
                    name: 'downlink',
                    type: 'number',
                    description: 'Estimated bandwidth',
                },
            ],
        },
        examples: [
            {
                title: 'Offline Detection',
                description: 'Show offline indicator',
                code: `import { useNetworkStatus } from '@clarity-chat/react'

function NetworkIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus()

  if (!isOnline) return <Banner>You are offline</Banner>
  if (wasOffline) return <Banner>Back online!</Banner>
  return null
}`,
            },
        ],
        relatedHooks: ['useRetry', 'useClarityChat'],
        tags: ['network', 'offline', 'connectivity', 'status'],
    },
    {
        name: 'useModelSelector',
        displayName: 'useModel Selector',
        description: 'Hook for managing AI model selection with pricing and capability info.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'provider',
                type: "'openai' | 'anthropic' | 'google'",
                required: false,
                description: 'Filter by provider',
            },
            {
                name: 'defaultModel',
                type: 'string',
                required: false,
                description: 'Default selected model',
            },
        ],
        returns: {
            type: 'UseModelSelectorReturn',
            description: 'Model selection state',
            properties: [
                {
                    name: 'models',
                    type: 'ModelInfo[]',
                    description: 'Available models',
                },
                {
                    name: 'selectedModel',
                    type: 'ModelInfo',
                    description: 'Currently selected',
                },
                {
                    name: 'selectModel',
                    type: '(modelId: string) => void',
                    description: 'Select a model',
                },
                {
                    name: 'getModelByCapability',
                    type: '(cap: string) => ModelInfo[]',
                    description: 'Filter by capability',
                },
            ],
        },
        examples: [
            {
                title: 'Model Picker',
                description: 'Model selection UI',
                code: `import { useModelSelector } from '@clarity-chat/react'

function ModelPicker() {
  const { models, selectedModel, selectModel } = useModelSelector({
    provider: 'openai'
  })

  return (
    <select value={selectedModel.id} onChange={e => selectModel(e.target.value)}>
      {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
    </select>
  )
}`,
            },
        ],
        relatedHooks: ['useClarityChat', 'useTokenTracker'],
        tags: ['model', 'selection', 'ai', 'provider'],
    },
    {
        name: 'usePromptBuilder',
        displayName: 'usePrompt Builder',
        description: 'Hook for building and managing system prompts with template support.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'defaultPrompt',
                type: 'string',
                required: false,
                description: 'Default system prompt',
            },
        ],
        returns: {
            type: 'UsePromptBuilderReturn',
            description: 'Prompt building state',
            properties: [
                { name: 'prompt', type: 'string', description: 'Current prompt' },
                {
                    name: 'setPrompt',
                    type: '(prompt: string) => void',
                    description: 'Set prompt',
                },
                {
                    name: 'addInstruction',
                    type: '(instruction: string) => void',
                    description: 'Add instruction',
                },
                {
                    name: 'applyTemplate',
                    type: '(name: string) => void',
                    description: 'Apply template',
                },
                {
                    name: 'templates',
                    type: 'PromptTemplate[]',
                    description: 'Available templates',
                },
            ],
        },
        examples: [
            {
                title: 'System Prompt Editor',
                description: 'Build system prompts',
                code: `import { usePromptBuilder } from '@clarity-chat/react'

function PromptEditor() {
  const { prompt, setPrompt, templates, applyTemplate } = usePromptBuilder()

  return (
    <div>
      <select onChange={e => applyTemplate(e.target.value)}>
        {templates.map(t => <option key={t.name}>{t.name}</option>)}
      </select>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} />
    </div>
  )
}`,
            },
        ],
        relatedHooks: ['useClarityChat'],
        tags: ['prompt', 'system', 'template', 'builder'],
    },
    {
        name: 'useThrottle',
        displayName: 'useThrottle',
        description: 'Hook for throttling rapid updates like typing indicators.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'value',
                type: 'T',
                required: true,
                description: 'Value to throttle',
            },
            {
                name: 'interval',
                type: 'number',
                required: false,
                default: '200',
                description: 'Throttle interval in ms',
            },
        ],
        returns: {
            type: 'T',
            description: 'Throttled value',
        },
        examples: [
            {
                title: 'Throttle Typing',
                description: 'Throttle typing indicator',
                code: `import { useThrottle } from '@clarity-chat/react'

function TypingIndicator({ input }) {
  const throttledInput = useThrottle(input, 500)

  useEffect(() => {
    if (throttledInput) socket.emit('typing', true)
  }, [throttledInput])
}`,
            },
        ],
        relatedHooks: ['useDebounce'],
        tags: ['throttle', 'performance', 'typing', 'rate-limit'],
    },
    {
        name: 'useDebounce',
        displayName: 'useDebounce',
        description: 'Hook for debouncing values, useful for search and input validation.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
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
                required: false,
                default: '300',
                description: 'Debounce delay in ms',
            },
        ],
        returns: {
            type: 'T',
            description: 'Debounced value',
        },
        examples: [
            {
                title: 'Search Debounce',
                description: 'Debounce search input',
                code: `import { useDebounce } from '@clarity-chat/react'

function SearchMessages({ onSearch }) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) onSearch(debouncedQuery)
  }, [debouncedQuery])
}`,
            },
        ],
        relatedHooks: ['useThrottle'],
        tags: ['debounce', 'performance', 'search', 'input'],
    },
    {
        name: 'useToolInvocation',
        displayName: 'useTool Invocation',
        description: 'Hook for handling AI tool/function calling with state management.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'tools',
                type: 'ToolDefinition[]',
                required: true,
                description: 'Available tools',
            },
            {
                name: 'onToolCall',
                type: '(tool: string, args: object) => Promise<any>',
                required: true,
                description: 'Tool execution handler',
            },
        ],
        returns: {
            type: 'UseToolInvocationReturn',
            description: 'Tool invocation state',
            properties: [
                {
                    name: 'pendingTools',
                    type: 'ToolCall[]',
                    description: 'Pending tool calls',
                },
                {
                    name: 'executeTools',
                    type: '(calls: ToolCall[]) => Promise<ToolResult[]>',
                    description: 'Execute tool calls',
                },
                {
                    name: 'isExecuting',
                    type: 'boolean',
                    description: 'Currently executing',
                },
                {
                    name: 'toolResults',
                    type: 'ToolResult[]',
                    description: 'Tool results',
                },
            ],
        },
        examples: [
            {
                title: 'Tool Execution',
                description: 'Handle AI tool calls',
                code: `import { useToolInvocation } from '@clarity-chat/react'

function ChatWithTools() {
  const { pendingTools, executeTools, isExecuting } = useToolInvocation({
    tools: [{ name: 'search', ... }],
    onToolCall: async (tool, args) => {
      if (tool === 'search') return await searchAPI(args.query)
    }
  })
}`,
            },
        ],
        relatedHooks: ['useClarityChat', 'useAgentRun'],
        tags: ['tools', 'function-calling', 'ai', 'execution'],
    },
    {
        name: 'useAgentRun',
        displayName: 'useAgent Run',
        description: 'Hook for managing multi-step AI agent runs with intermediate states.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'agentConfig',
                type: 'AgentConfig',
                required: true,
                description: 'Agent configuration',
            },
        ],
        returns: {
            type: 'UseAgentRunReturn',
            description: 'Agent run state',
            properties: [
                { name: 'steps', type: 'AgentStep[]', description: 'Execution steps' },
                {
                    name: 'currentStep',
                    type: 'AgentStep',
                    description: 'Current step',
                },
                { name: 'isRunning', type: 'boolean', description: 'Run in progress' },
                {
                    name: 'start',
                    type: '(input: string) => void',
                    description: 'Start agent run',
                },
                { name: 'stop', type: '() => void', description: 'Stop agent run' },
                { name: 'status', type: 'AgentStatus', description: 'Run status' },
            ],
        },
        examples: [
            {
                title: 'Agent Run',
                description: 'Multi-step agent execution',
                code: `import { useAgentRun } from '@clarity-chat/react'

function AgentChat() {
  const { steps, currentStep, isRunning, start, stop, status } = useAgentRun({
    maxSteps: 10,
    tools: [...]
  })

  return (
    <div>
      <AgentRunFeed steps={steps} />
      {isRunning && <button onClick={stop}>Stop</button>}
    </div>
  )
}`,
            },
        ],
        relatedHooks: ['useToolInvocation', 'useClarityChat'],
        tags: ['agent', 'multi-step', 'autonomous', 'ai'],
    },
    {
        name: 'useStreamingWebSocket',
        displayName: 'useStreaming WebSocket',
        description: 'Hook for WebSocket-based streaming with automatic reconnection.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'url',
                type: 'string',
                required: true,
                description: 'WebSocket URL',
            },
            {
                name: 'onMessage',
                type: '(data: any) => void',
                required: true,
                description: 'Message handler',
            },
            {
                name: 'reconnectAttempts',
                type: 'number',
                required: false,
                default: '5',
                description: 'Max reconnect attempts',
            },
        ],
        returns: {
            type: 'UseStreamingWebSocketReturn',
            description: 'WebSocket state',
            properties: [
                {
                    name: 'isConnected',
                    type: 'boolean',
                    description: 'Connection status',
                },
                {
                    name: 'send',
                    type: '(data: any) => void',
                    description: 'Send message',
                },
                { name: 'connect', type: '() => void', description: 'Connect' },
                { name: 'disconnect', type: '() => void', description: 'Disconnect' },
                { name: 'readyState', type: 'number', description: 'WebSocket state' },
            ],
        },
        examples: [
            {
                title: 'WebSocket Chat',
                description: 'Real-time WebSocket connection',
                code: `import { useStreamingWebSocket } from '@clarity-chat/react'

function RealtimeChat() {
  const { isConnected, send } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    onMessage: (data) => addMessage(data)
  })
}`,
            },
        ],
        relatedHooks: ['useStreamingSSE', 'useClarityChat'],
        tags: ['websocket', 'realtime', 'streaming', 'connection'],
    },
    {
        name: 'useFileUpload',
        displayName: 'useFile Upload',
        description: 'Hook for handling file uploads with progress tracking and validation.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'endpoint',
                type: 'string',
                required: true,
                description: 'Upload endpoint',
            },
            {
                name: 'maxSize',
                type: 'number',
                required: false,
                description: 'Max file size in bytes',
            },
            {
                name: 'acceptedTypes',
                type: 'string[]',
                required: false,
                description: 'Accepted MIME types',
            },
        ],
        returns: {
            type: 'UseFileUploadReturn',
            description: 'File upload state',
            properties: [
                {
                    name: 'upload',
                    type: '(file: File) => Promise<string>',
                    description: 'Upload file',
                },
                {
                    name: 'progress',
                    type: 'number',
                    description: 'Upload progress 0-100',
                },
                {
                    name: 'isUploading',
                    type: 'boolean',
                    description: 'Upload in progress',
                },
                { name: 'error', type: 'Error | null', description: 'Upload error' },
                { name: 'cancel', type: '() => void', description: 'Cancel upload' },
            ],
        },
        examples: [
            {
                title: 'File Attachments',
                description: 'Upload files with progress',
                code: `import { useFileUpload } from '@clarity-chat/react'

function FileAttachment() {
  const { upload, progress, isUploading } = useFileUpload({
    endpoint: '/api/upload',
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: ['image/*', 'application/pdf']
  })
}`,
            },
        ],
        relatedHooks: ['useClarityChat'],
        tags: ['file', 'upload', 'attachment', 'progress'],
    },
    {
        name: 'useImageGeneration',
        displayName: 'useImage Generation',
        description: 'Hook for AI image generation with DALL-E, Midjourney, or Stable Diffusion.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'provider',
                type: "'dalle' | 'midjourney' | 'stable-diffusion'",
                required: false,
                default: "'dalle'",
                description: 'Image generation provider',
            },
            {
                name: 'apiKey',
                type: 'string',
                required: true,
                description: 'API key for provider',
            },
        ],
        returns: {
            type: 'UseImageGenerationReturn',
            description: 'Image generation state',
            properties: [
                {
                    name: 'generate',
                    type: '(prompt: string, options?: ImageOptions) => Promise<string>',
                    description: 'Generate image',
                },
                {
                    name: 'isGenerating',
                    type: 'boolean',
                    description: 'Generation in progress',
                },
                {
                    name: 'imageUrl',
                    type: 'string | null',
                    description: 'Generated image URL',
                },
                {
                    name: 'error',
                    type: 'Error | null',
                    description: 'Generation error',
                },
            ],
        },
        examples: [
            {
                title: 'Image Generation',
                description: 'Generate images from prompts',
                code: `import { useImageGeneration } from '@clarity-chat/react'

function ImageGenerator() {
  const { generate, isGenerating, imageUrl } = useImageGeneration({
    provider: 'dalle'
  })

  return (
    <button onClick={() => generate('A cute cat')}>
      {isGenerating ? 'Generating...' : 'Generate'}
    </button>
  )
}`,
            },
        ],
        relatedHooks: ['useClarityChat'],
        tags: ['image', 'generation', 'dalle', 'ai'],
    },
    {
        name: 'useCodeExecution',
        displayName: 'useCode Execution',
        description: 'Hook for safely executing code snippets in sandboxed environments.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'language',
                type: "'javascript' | 'python' | 'typescript'",
                required: false,
                default: "'javascript'",
                description: 'Programming language',
            },
            {
                name: 'timeout',
                type: 'number',
                required: false,
                default: '5000',
                description: 'Execution timeout in ms',
            },
        ],
        returns: {
            type: 'UseCodeExecutionReturn',
            description: 'Code execution state',
            properties: [
                {
                    name: 'execute',
                    type: '(code: string) => Promise<ExecutionResult>',
                    description: 'Execute code',
                },
                {
                    name: 'isExecuting',
                    type: 'boolean',
                    description: 'Execution in progress',
                },
                { name: 'output', type: 'string', description: 'Execution output' },
                { name: 'error', type: 'Error | null', description: 'Execution error' },
                { name: 'cancel', type: '() => void', description: 'Cancel execution' },
            ],
        },
        examples: [
            {
                title: 'Code Runner',
                description: 'Execute code snippets',
                code: `import { useCodeExecution } from '@clarity-chat/react'

function CodeRunner() {
  const { execute, isExecuting, output } = useCodeExecution({
    language: 'javascript'
  })

  const runCode = async (code) => {
    const result = await execute(code)
    console.log(result.output)
  }
}`,
            },
        ],
        relatedHooks: ['useClarityChat'],
        tags: ['code', 'execution', 'sandbox', 'interpreter'],
    },
    {
        name: 'useRateLimiter',
        displayName: 'useRate Limiter',
        description: 'Hook for implementing client-side rate limiting for API requests.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'maxRequests',
                type: 'number',
                required: true,
                description: 'Max requests per window',
            },
            {
                name: 'windowMs',
                type: 'number',
                required: true,
                description: 'Time window in milliseconds',
            },
        ],
        returns: {
            type: 'UseRateLimiterReturn',
            description: 'Rate limiter state',
            properties: [
                {
                    name: 'checkLimit',
                    type: '() => boolean',
                    description: 'Check if under limit',
                },
                {
                    name: 'recordRequest',
                    type: '() => void',
                    description: 'Record a request',
                },
                {
                    name: 'remainingRequests',
                    type: 'number',
                    description: 'Requests remaining',
                },
                {
                    name: 'resetTime',
                    type: 'number',
                    description: 'Time until reset',
                },
            ],
        },
        examples: [
            {
                title: 'Rate Limiting',
                description: 'Prevent API abuse',
                code: `import { useRateLimiter } from '@clarity-chat/react'

function Chat() {
  const { checkLimit, recordRequest, remainingRequests } = useRateLimiter({
    maxRequests: 10,
    windowMs: 60000 // 1 minute
  })

  const sendMessage = async (msg) => {
    if (!checkLimit()) return alert('Rate limited!')
    recordRequest()
    await api.send(msg)
  }
}`,
            },
        ],
        relatedHooks: ['useClarityChat', 'useRetry'],
        tags: ['rate-limit', 'throttle', 'api', 'quota'],
    },
    {
        name: 'useAnalytics',
        displayName: 'useAnalytics',
        description: 'Hook for tracking chat analytics events and user interactions.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'provider',
                type: "'google' | 'mixpanel' | 'amplitude' | 'custom'",
                required: false,
                description: 'Analytics provider',
            },
            {
                name: 'trackingId',
                type: 'string',
                required: false,
                description: 'Provider tracking ID',
            },
        ],
        returns: {
            type: 'UseAnalyticsReturn',
            description: 'Analytics methods',
            properties: [
                {
                    name: 'trackEvent',
                    type: '(event: string, data?: object) => void',
                    description: 'Track custom event',
                },
                {
                    name: 'trackMessage',
                    type: '(message: Message) => void',
                    description: 'Track message sent',
                },
                {
                    name: 'trackConversion',
                    type: '(goal: string) => void',
                    description: 'Track conversion',
                },
                {
                    name: 'setUserProperty',
                    type: '(key: string, value: any) => void',
                    description: 'Set user property',
                },
            ],
        },
        examples: [
            {
                title: 'Track Usage',
                description: 'Analytics tracking',
                code: `import { useAnalytics } from '@clarity-chat/react'

function Chat() {
  const { trackEvent, trackMessage } = useAnalytics()

  const sendMessage = (msg) => {
    trackMessage(msg)
    trackEvent('message_sent', { length: msg.content.length })
  }
}`,
            },
        ],
        relatedHooks: ['useClarityChat', 'useTokenTracker'],
        tags: ['analytics', 'tracking', 'events', 'metrics'],
    },
    {
        name: 'useAccessibility',
        displayName: 'useAccessibility',
        description: 'Hook for managing accessibility features like screen reader announcements.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'enabled',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Enable accessibility features',
            },
        ],
        returns: {
            type: 'UseAccessibilityReturn',
            description: 'Accessibility methods',
            properties: [
                {
                    name: 'announce',
                    type: '(message: string, priority?: "polite" | "assertive") => void',
                    description: 'Announce to screen readers',
                },
                {
                    name: 'setLiveRegion',
                    type: '(content: string) => void',
                    description: 'Update live region',
                },
                {
                    name: 'focusTrap',
                    type: '(element: HTMLElement) => () => void',
                    description: 'Create focus trap',
                },
            ],
        },
        examples: [
            {
                title: 'Screen Reader Support',
                description: 'Accessibility announcements',
                code: `import { useAccessibility } from '@clarity-chat/react'

function Chat() {
  const { announce } = useAccessibility()

  const onNewMessage = (msg) => {
    announce(\`New message from \${msg.role}\`, 'polite')
  }
}`,
            },
        ],
        relatedHooks: ['useClarityChat', 'useKeyboardShortcuts'],
        tags: ['accessibility', 'a11y', 'screen-reader', 'aria'],
    },
    {
        name: 'useTheme',
        displayName: 'useTheme',
        description: 'Hook for managing chat UI theme with light/dark mode and custom themes.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'defaultTheme',
                type: "'light' | 'dark' | 'system'",
                required: false,
                default: "'system'",
                description: 'Default theme',
            },
        ],
        returns: {
            type: 'UseThemeReturn',
            description: 'Theme state and methods',
            properties: [
                { name: 'theme', type: 'string', description: 'Current theme' },
                {
                    name: 'setTheme',
                    type: "(theme: 'light' | 'dark' | 'system') => void",
                    description: 'Set theme',
                },
                {
                    name: 'toggleTheme',
                    type: '() => void',
                    description: 'Toggle light/dark',
                },
                {
                    name: 'resolvedTheme',
                    type: "'light' | 'dark'",
                    description: 'Resolved theme',
                },
            ],
        },
        examples: [
            {
                title: 'Theme Switcher',
                description: 'Toggle dark mode',
                code: `import { useTheme } from '@clarity-chat/react'

function ThemeToggle() {
  const { theme, toggleTheme, resolvedTheme } = useTheme()

  return (
    <button onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}`,
            },
        ],
        relatedHooks: ['useLocalStorage'],
        tags: ['theme', 'dark-mode', 'styling', 'preferences'],
    },
    {
        name: 'useFocusManagement',
        displayName: 'useFocus Management',
        description: 'Hook for managing focus state and focus restoration in chat interfaces.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'autoFocus',
                type: 'boolean',
                required: false,
                default: 'true',
                description: 'Auto-focus on mount',
            },
        ],
        returns: {
            type: 'UseFocusManagementReturn',
            description: 'Focus management',
            properties: [
                {
                    name: 'focusRef',
                    type: 'RefObject<HTMLElement>',
                    description: 'Ref to focused element',
                },
                {
                    name: 'focus',
                    type: '() => void',
                    description: 'Focus the element',
                },
                {
                    name: 'blur',
                    type: '() => void',
                    description: 'Blur the element',
                },
                {
                    name: 'isFocused',
                    type: 'boolean',
                    description: 'Focus state',
                },
                {
                    name: 'restoreFocus',
                    type: '() => void',
                    description: 'Restore previous focus',
                },
            ],
        },
        examples: [
            {
                title: 'Focus Input',
                description: 'Manage input focus',
                code: `import { useFocusManagement } from '@clarity-chat/react'

function ChatInput() {
  const { focusRef, focus, isFocused } = useFocusManagement()

  useEffect(() => {
    // Focus input on new conversation
    focus()
  }, [conversationId])

  return <input ref={focusRef} />
}`,
            },
        ],
        relatedHooks: ['useKeyboardShortcuts', 'useAccessibility'],
        tags: ['focus', 'input', 'accessibility', 'ui'],
    },
    {
        name: 'useIntersectionObserver',
        displayName: 'useIntersection Observer',
        description: 'Hook for detecting element visibility, useful for lazy loading messages.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'options',
                type: 'IntersectionObserverInit',
                required: false,
                description: 'Observer options',
            },
        ],
        returns: {
            type: 'UseIntersectionObserverReturn',
            description: 'Intersection state',
            properties: [
                {
                    name: 'ref',
                    type: 'RefObject<HTMLElement>',
                    description: 'Element ref',
                },
                {
                    name: 'isIntersecting',
                    type: 'boolean',
                    description: 'Element is visible',
                },
                {
                    name: 'entry',
                    type: 'IntersectionObserverEntry | null',
                    description: 'Observer entry',
                },
            ],
        },
        examples: [
            {
                title: 'Lazy Load Messages',
                description: 'Load more when visible',
                code: `import { useIntersectionObserver } from '@clarity-chat/react'

function LoadMoreTrigger({ onLoadMore }) {
  const { ref, isIntersecting } = useIntersectionObserver()

  useEffect(() => {
    if (isIntersecting) onLoadMore()
  }, [isIntersecting])

  return <div ref={ref} />
}`,
            },
        ],
        relatedHooks: ['useAutoScroll'],
        tags: ['intersection', 'visibility', 'lazy-load', 'scroll'],
    },
    {
        name: 'useMarkdown',
        displayName: 'useMarkdown',
        description: 'Hook for parsing and rendering markdown with syntax highlighting.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'content',
                type: 'string',
                required: true,
                description: 'Markdown content',
            },
            {
                name: 'options',
                type: 'MarkdownOptions',
                required: false,
                description: 'Parser options',
            },
        ],
        returns: {
            type: 'UseMarkdownReturn',
            description: 'Parsed markdown',
            properties: [
                {
                    name: 'html',
                    type: 'string',
                    description: 'Rendered HTML',
                },
                {
                    name: 'codeBlocks',
                    type: 'CodeBlock[]',
                    description: 'Extracted code blocks',
                },
                {
                    name: 'links',
                    type: 'Link[]',
                    description: 'Extracted links',
                },
            ],
        },
        examples: [
            {
                title: 'Render Markdown',
                description: 'Parse markdown content',
                code: `import { useMarkdown } from '@clarity-chat/react'

function MessageContent({ content }) {
  const { html, codeBlocks } = useMarkdown(content, {
    syntaxHighlight: true
  })

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}`,
            },
        ],
        relatedHooks: ['useClarityChat'],
        tags: ['markdown', 'parsing', 'rendering', 'content'],
    },
    {
        name: 'useContextWindow',
        displayName: 'useContext Window',
        description: 'Hook for managing context window limits and message truncation.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'model',
                type: 'string',
                required: true,
                description: 'Model name for context limit',
            },
            {
                name: 'reservedTokens',
                type: 'number',
                required: false,
                default: '1000',
                description: 'Reserved for response',
            },
        ],
        returns: {
            type: 'UseContextWindowReturn',
            description: 'Context window state',
            properties: [
                {
                    name: 'maxTokens',
                    type: 'number',
                    description: 'Max context tokens',
                },
                {
                    name: 'usedTokens',
                    type: 'number',
                    description: 'Currently used tokens',
                },
                {
                    name: 'remainingTokens',
                    type: 'number',
                    description: 'Tokens remaining',
                },
                {
                    name: 'fitMessages',
                    type: '(messages: Message[]) => Message[]',
                    description: 'Fit messages to context',
                },
                {
                    name: 'isNearLimit',
                    type: 'boolean',
                    description: 'Near context limit',
                },
            ],
        },
        examples: [
            {
                title: 'Context Management',
                description: 'Manage context window',
                code: `import { useContextWindow } from '@clarity-chat/react'

function Chat() {
  const { fitMessages, remainingTokens, isNearLimit } = useContextWindow({
    model: 'gpt-4o'
  })

  const prepareMessages = (messages) => {
    return fitMessages(messages)
  }
}`,
            },
        ],
        relatedHooks: ['useTokenTracker', 'useClarityChat'],
        tags: ['context', 'tokens', 'truncation', 'limits'],
    },
    {
        name: 'useStreamParser',
        displayName: 'useStream Parser',
        description: 'Hook for parsing streaming responses with support for multiple formats.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'format',
                type: "'text' | 'json' | 'ndjson' | 'sse'",
                required: false,
                default: "'text'",
                description: 'Stream format',
            },
        ],
        returns: {
            type: 'UseStreamParserReturn',
            description: 'Stream parsing state',
            properties: [
                {
                    name: 'parse',
                    type: '(chunk: string) => ParsedChunk[]',
                    description: 'Parse stream chunk',
                },
                {
                    name: 'buffer',
                    type: 'string',
                    description: 'Unparsed buffer',
                },
                {
                    name: 'flush',
                    type: '() => ParsedChunk[]',
                    description: 'Flush remaining buffer',
                },
                {
                    name: 'reset',
                    type: '() => void',
                    description: 'Reset parser state',
                },
            ],
        },
        examples: [
            {
                title: 'Parse Stream',
                description: 'Parse streaming response',
                code: `import { useStreamParser } from '@clarity-chat/react'

function StreamHandler() {
  const { parse, flush } = useStreamParser({ format: 'ndjson' })

  const handleChunk = (chunk) => {
    const parsed = parse(chunk)
    parsed.forEach(item => processItem(item))
  }
}`,
            },
        ],
        relatedHooks: ['useStreamingSSE', 'useStreamingWebSocket'],
        tags: ['streaming', 'parsing', 'chunks', 'format'],
    },
    {
        name: 'useVirtualization',
        displayName: 'useVirtualization',
        description: 'Hook for virtualizing long message lists for performance.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'items',
                type: 'T[]',
                required: true,
                description: 'Items to virtualize',
            },
            {
                name: 'itemHeight',
                type: 'number | ((index: number) => number)',
                required: true,
                description: 'Item height or getter',
            },
            {
                name: 'overscan',
                type: 'number',
                required: false,
                default: '5',
                description: 'Overscan count',
            },
        ],
        returns: {
            type: 'UseVirtualizationReturn<T>',
            description: 'Virtualization state',
            properties: [
                {
                    name: 'virtualItems',
                    type: 'VirtualItem<T>[]',
                    description: 'Visible items',
                },
                {
                    name: 'totalHeight',
                    type: 'number',
                    description: 'Total list height',
                },
                {
                    name: 'scrollToIndex',
                    type: '(index: number) => void',
                    description: 'Scroll to item',
                },
                {
                    name: 'containerProps',
                    type: 'object',
                    description: 'Container props',
                },
            ],
        },
        examples: [
            {
                title: 'Virtual Message List',
                description: 'Virtualize long lists',
                code: `import { useVirtualization } from '@clarity-chat/react'

function MessageList({ messages }) {
  const { virtualItems, totalHeight, containerProps } = useVirtualization({
    items: messages,
    itemHeight: 60,
    overscan: 3
  })

  return (
    <div {...containerProps}>
      <div style={{ height: totalHeight }}>
        {virtualItems.map(item => (
          <Message key={item.data.id} {...item.data} style={item.style} />
        ))}
      </div>
    </div>
  )
}`,
            },
        ],
        relatedHooks: ['useAutoScroll', 'useIntersectionObserver'],
        tags: ['virtualization', 'performance', 'list', 'scroll'],
    },
    {
        name: 'useSystemPrompt',
        displayName: 'useSystem Prompt',
        description: 'Hook for managing system prompt with presets and dynamic injection.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'defaultPrompt',
                type: 'string',
                required: false,
                description: 'Default system prompt',
            },
        ],
        returns: {
            type: 'UseSystemPromptReturn',
            description: 'System prompt state',
            properties: [
                {
                    name: 'systemPrompt',
                    type: 'string',
                    description: 'Current prompt',
                },
                {
                    name: 'setSystemPrompt',
                    type: '(prompt: string) => void',
                    description: 'Set prompt',
                },
                {
                    name: 'appendToPrompt',
                    type: '(text: string) => void',
                    description: 'Append to prompt',
                },
                {
                    name: 'presets',
                    type: 'SystemPromptPreset[]',
                    description: 'Available presets',
                },
                {
                    name: 'applyPreset',
                    type: '(name: string) => void',
                    description: 'Apply preset',
                },
            ],
        },
        examples: [
            {
                title: 'System Prompt',
                description: 'Manage system prompt',
                code: `import { useSystemPrompt } from '@clarity-chat/react'

function PromptManager() {
  const { systemPrompt, presets, applyPreset } = useSystemPrompt()

  return (
    <select onChange={e => applyPreset(e.target.value)}>
      {presets.map(p => <option key={p.name}>{p.name}</option>)}
    </select>
  )
}`,
            },
        ],
        relatedHooks: ['useClarityChat', 'usePromptBuilder'],
        tags: ['system-prompt', 'presets', 'configuration', 'ai'],
    },
    {
        name: 'useErrorBoundary',
        displayName: 'useError Boundary',
        description: 'Hook for error boundary functionality with recovery options.',
        package: '@clarity-chat/react',
        importPath: '@clarity-chat/react',
        parameters: [
            {
                name: 'onError',
                type: '(error: Error, info: ErrorInfo) => void',
                required: false,
                description: 'Error handler',
            },
        ],
        returns: {
            type: 'UseErrorBoundaryReturn',
            description: 'Error boundary state',
            properties: [
                {
                    name: 'error',
                    type: 'Error | null',
                    description: 'Current error',
                },
                {
                    name: 'hasError',
                    type: 'boolean',
                    description: 'Has error',
                },
                {
                    name: 'reset',
                    type: '() => void',
                    description: 'Reset error state',
                },
                {
                    name: 'ErrorBoundary',
                    type: 'React.FC',
                    description: 'Boundary component',
                },
            ],
        },
        examples: [
            {
                title: 'Error Recovery',
                description: 'Handle and recover from errors',
                code: `import { useErrorBoundary } from '@clarity-chat/react'

function Chat() {
  const { hasError, error, reset, ErrorBoundary } = useErrorBoundary({
    onError: (error) => logError(error)
  })

  if (hasError) {
    return <ErrorFallback error={error} onRetry={reset} />
  }

  return <ErrorBoundary><ChatContent /></ErrorBoundary>
}`,
            },
        ],
        relatedHooks: ['useRetry'],
        tags: ['error', 'boundary', 'recovery', 'fallback'],
    },
];
// =============================================================================
// Search Functions
// =============================================================================
/**
 * Search components by query
 */
/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching with typo tolerance
 */
function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j] + 1 // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}
/**
 * Calculate fuzzy match score (0-100)
 * Higher score = better match
 */
function fuzzyScore(query, text) {
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    // Exact match = 100
    if (t === q)
        return 100;
    // Contains exact = 90
    if (t.includes(q))
        return 90;
    // Word boundary match = 85
    const words = t.split(/[\s\-_]+/);
    if (words.some((word) => word.startsWith(q)))
        return 85;
    // Abbreviation match (e.g., "cc" matches "ClarityChat")
    const initials = words.map((w) => w[0] || '').join('');
    if (initials.includes(q))
        return 80;
    // Fuzzy match with Levenshtein distance
    // Check each word for typo tolerance
    for (const word of words) {
        const distance = levenshteinDistance(q, word);
        const maxLen = Math.max(q.length, word.length);
        const similarity = 1 - distance / maxLen;
        // Accept matches with >60% similarity (allows 1-2 char typos)
        if (similarity > 0.6) {
            return Math.round(70 * similarity);
        }
    }
    // Partial character sequence match (e.g., "msg" in "message")
    let matchIndex = 0;
    for (let i = 0; i < t.length && matchIndex < q.length; i++) {
        if (t[i] === q[matchIndex])
            matchIndex++;
    }
    if (matchIndex === q.length) {
        return 50; // All characters found in sequence
    }
    return 0;
}
/**
 * Search components with fuzzy matching and relevance scoring
 */
export function searchComponents(query, options) {
    const { category, limit = 10 } = options || {};
    // Score each component
    const scored = COMPONENTS.map((component) => {
        // Category filter
        if (category && component.category !== category) {
            return { component, score: 0 };
        }
        // Calculate scores for different fields
        const nameScore = fuzzyScore(query, component.name);
        const displayNameScore = fuzzyScore(query, component.displayName);
        const descriptionScore = fuzzyScore(query, component.description) * 0.5; // Lower weight
        const tagScores = component.tags.map((tag) => fuzzyScore(query, tag) * 0.7);
        const maxTagScore = Math.max(0, ...tagScores);
        // Take the best score
        const score = Math.max(nameScore, displayNameScore, descriptionScore, maxTagScore);
        return { component, score };
    });
    // Filter out non-matches and sort by score
    return scored
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ component }) => component);
}
/**
 * Search hooks with fuzzy matching and relevance scoring
 */
export function searchHooks(query, options) {
    const { limit = 10 } = options || {};
    // Score each hook
    const scored = HOOKS.map((hook) => {
        // Calculate scores for different fields
        const nameScore = fuzzyScore(query, hook.name);
        const displayNameScore = fuzzyScore(query, hook.displayName);
        const descriptionScore = fuzzyScore(query, hook.description) * 0.5;
        const tagScores = hook.tags.map((tag) => fuzzyScore(query, tag) * 0.7);
        const maxTagScore = Math.max(0, ...tagScores);
        // Take the best score
        const score = Math.max(nameScore, displayNameScore, descriptionScore, maxTagScore);
        return { hook, score };
    });
    // Filter out non-matches and sort by score
    return scored
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ hook }) => hook);
}
/**
 * Get component by name
 */
export function getComponent(name) {
    return COMPONENTS.find((c) => c.name.toLowerCase() === name.toLowerCase() ||
        c.displayName.toLowerCase() === name.toLowerCase());
}
/**
 * Get hook by name
 */
export function getHook(name) {
    return HOOKS.find((h) => h.name.toLowerCase() === name.toLowerCase() ||
        h.displayName.toLowerCase() === name.toLowerCase());
}
/**
 * Get related components
 */
export function getRelatedComponents(componentName) {
    const component = getComponent(componentName);
    if (!component)
        return [];
    return component.relatedComponents
        .map((name) => getComponent(name))
        .filter((c) => c !== undefined);
}
/**
 * Get components by category
 */
export function getComponentsByCategory(category) {
    return COMPONENTS.filter((c) => c.category === category);
}
/**
 * Get all categories with counts
 */
export function getCategoryStats() {
    const counts = new Map();
    for (const component of COMPONENTS) {
        counts.set(component.category, (counts.get(component.category) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([category, count]) => ({
        category,
        count,
    }));
}
//# sourceMappingURL=component-registry.js.map