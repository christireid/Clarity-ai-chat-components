import type { ComponentDoc } from '@/components/doc-panel'

export const chatDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ==========================================================================
  // AGENTIC CHAT TAB
  // ==========================================================================

  'Agentic Chat with Tool Calling': [
    {
      name: 'ChatWindow',
      description:
        'A composable chat window component that renders messages, handles input, and manages user interactions. Supports message actions, inline editing, header configuration, error handling, prompt suggestions, and token tracking.',
      importPath: '@clarity-chat/react',
      usageCode: `<ChatWindow
  messages={messages}
  isLoading={isLoading}
  aiStatus={aiStatus}
  onSendMessage={(content) => sendMessage(content)}
  onStopGeneration={() => stopGeneration()}
  messageActions={{
    onCopy: (id, content) => copyToClipboard(content),
    onFeedback: (id, type) => submitFeedback(id, type),
    onRetry: (id) => retryMessage(id),
    onRegenerate: (id) => regenerateMessage(id),
  }}
  header={{
    show: true,
    title: "Agentic Assistant",
    subtitle: "Claude 3.5 Sonnet",
    showMessageCount: true,
  }}
  errorHandling={{
    error: error,
    onRetry: () => retryLastRequest(),
    onDismissError: () => clearError(),
  }}
  prompts={{
    starterPrompts: starterPrompts,
    followUpSuggestions: followUpSuggestions,
    showStarterPrompts: true,
    showFollowUpSuggestions: true,
  }}
  autoScroll
  showTokenCounter
  showNetworkStatus
/>`,
      props: [
        {
          name: 'messages',
          type: 'Message[] | CoreMessage[]',
          required: true,
          description: 'Messages in either Message[] or CoreMessage[] format.',
          commonlyUsed: true,
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description:
            'Whether the assistant is currently generating a response.',
          commonlyUsed: true,
        },
        {
          name: 'aiStatus',
          type: 'AIStatus',
          description:
            'AI processing status for thinking indicator (e.g., thinking, tool-calling, idle).',
        },
        {
          name: 'onSendMessage',
          type: '(content: string) => void',
          required: true,
          description: 'Callback invoked when the user submits a message.',
          commonlyUsed: true,
        },
        {
          name: 'onStopGeneration',
          type: '() => void',
          description:
            'Callback to stop/cancel the current AI generation. When provided, shows a "Stop" button during loading state.',
          commonlyUsed: true,
        },
        {
          name: 'messageActions',
          type: 'ChatWindowMessageActions',
          description:
            'Object with message interaction callbacks: onCopy, onFeedback, onRetry, onEdit, onRegenerate, onDelete.',
          commonlyUsed: true,
        },
        {
          name: 'editActions',
          type: 'ChatWindowEditActions',
          description:
            'Edit-related callbacks and state: editingMessageId, onSaveEdit, onCancelEdit.',
        },
        {
          name: 'header',
          type: 'ChatWindowHeaderConfig',
          description:
            'Header configuration object: show, title, subtitle, actions, showMessageCount.',
          commonlyUsed: true,
        },
        {
          name: 'actions',
          type: 'ChatWindowActions',
          description: 'Global actions: onExport, onClear.',
        },
        {
          name: 'errorHandling',
          type: 'ChatWindowErrorHandling',
          description:
            'Error handling configuration: error, onRetry, onDismissError.',
          commonlyUsed: true,
        },
        {
          name: 'prompts',
          type: 'ChatWindowPromptConfig',
          description:
            'Prompt suggestions configuration: starterPrompts, followUpSuggestions, showStarterPrompts, showFollowUpSuggestions.',
        },
        {
          name: 'emptyState',
          type: 'React.ReactNode',
          description:
            'Custom empty state component shown when there are no messages.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
        {
          name: 'onMessageCopy',
          type: '(messageId: string, content: string) => void',
          description: '@deprecated Use messageActions.onCopy instead.',
        },
        {
          name: 'onMessageFeedback',
          type: "(messageId: string, type: 'up' | 'down', comment?: string) => void",
          description: '@deprecated Use messageActions.onFeedback instead.',
        },
        {
          name: 'onMessageRetry',
          type: '(messageId: string) => void',
          description: '@deprecated Use messageActions.onRetry instead.',
        },
        {
          name: 'onEditMessage',
          type: '(messageId: string) => void',
          description: '@deprecated Use messageActions.onEdit instead.',
        },
        {
          name: 'onRegenerateMessage',
          type: '(messageId: string) => void',
          description: '@deprecated Use messageActions.onRegenerate instead.',
        },
        {
          name: 'onDeleteMessage',
          type: '(messageId: string) => void',
          description: '@deprecated Use messageActions.onDelete instead.',
        },
        {
          name: 'editingMessageId',
          type: 'string | null',
          description: '@deprecated Use editActions.editingMessageId instead.',
        },
        {
          name: 'onSaveEdit',
          type: '(messageId: string, newContent: string) => void',
          description: '@deprecated Use editActions.onSaveEdit instead.',
        },
        {
          name: 'onCancelEdit',
          type: '(messageId: string) => void',
          description: '@deprecated Use editActions.onCancelEdit instead.',
        },
        {
          name: 'showHeader',
          type: 'boolean',
          description: '@deprecated Use header.show instead.',
        },
        {
          name: 'sessionTitle',
          type: 'string',
          description: '@deprecated Use header.title instead.',
        },
        {
          name: 'sessionSubtitle',
          type: 'string',
          description: '@deprecated Use header.subtitle instead.',
        },
        {
          name: 'headerActions',
          type: 'React.ReactNode',
          description: '@deprecated Use header.actions instead.',
        },
        {
          name: 'showMessageCount',
          type: 'boolean',
          description: '@deprecated Use header.showMessageCount instead.',
        },
        {
          name: 'onExport',
          type: '() => void',
          description: '@deprecated Use actions.onExport instead.',
        },
        {
          name: 'onClear',
          type: '() => void',
          description: '@deprecated Use actions.onClear instead.',
        },
        {
          name: 'error',
          type: 'string | null',
          description: '@deprecated Use errorHandling.error instead.',
        },
        {
          name: 'onRetry',
          type: '() => void',
          description: '@deprecated Use errorHandling.onRetry instead.',
        },
        {
          name: 'onDismissError',
          type: '() => void',
          description: '@deprecated Use errorHandling.onDismissError instead.',
        },
        {
          name: 'starterPrompts',
          type: 'PromptSuggestion[]',
          description: '@deprecated Use prompts.starterPrompts instead.',
        },
        {
          name: 'followUpSuggestions',
          type: 'PromptSuggestion[]',
          description: '@deprecated Use prompts.followUpSuggestions instead.',
        },
        {
          name: 'showStarterPrompts',
          type: 'boolean',
          description: '@deprecated Use prompts.showStarterPrompts instead.',
        },
        {
          name: 'showFollowUpSuggestions',
          type: 'boolean',
          description:
            '@deprecated Use prompts.showFollowUpSuggestions instead.',
        },
        {
          name: 'autoScroll',
          type: 'boolean',
          description: 'Enable auto-scroll to bottom on new messages.',
          commonlyUsed: true,
        },
        {
          name: 'theme',
          type: 'string',
          description: 'Theme for the chat interface.',
        },
        {
          name: 'showTokenCounter',
          type: 'boolean',
          description: 'Show token counter in the input area.',
        },
        {
          name: 'showNetworkStatus',
          type: 'boolean',
          description: 'Show network status indicator.',
        },
        {
          name: 'enableMessageOperations',
          type: 'boolean',
          description: 'Enable message operations (edit, delete, branch).',
        },
      ],
      notes: [
        'Accepts messages in either the standard Message[] or CoreMessage[] format and normalizes them internally.',
        'Legacy flat props (onMessageCopy, showHeader, etc.) are still supported but will be removed in a future version. Migrate to the grouped prop objects (messageActions, header, etc.).',
        'Includes built-in skip links and ARIA live region for screen reader accessibility.',
        'Supports prompts.starterPrompts for empty-state suggestions and prompts.followUpSuggestions for post-response follow-ups.',
      ],
    },
    {
      name: 'ChatInput',
      description:
        'A composable chat input component with character counting, validation, auto-resizing textarea, smooth animations, and keyboard shortcuts. Supports Enter to submit and Shift+Enter for newlines.',
      importPath: '@clarity-chat/react',
      usageCode: `const [value, setValue] = useState('')

<ChatInput
  value={value}
  onChange={setValue}
  onSubmit={async (text) => {
    await sendMessage(text)
    setValue('')
  }}
  placeholder="Ask me anything..."
  maxLength={4000}
  showCharCounter
  warningThreshold={0.9}
  animateHeight
  glowOnFocus
/>`,
      props: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description: 'Current input value (controlled).',
          commonlyUsed: true,
        },
        {
          name: 'onChange',
          type: '(value: string) => void',
          required: true,
          description: 'Callback when the input value changes.',
          commonlyUsed: true,
        },
        {
          name: 'onSubmit',
          type: '(value: string) => void | Promise<void>',
          required: true,
          description:
            'Callback when the form is submitted (Enter key or button click).',
          commonlyUsed: true,
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Type a message..."',
          description: 'Placeholder text shown in the textarea.',
          commonlyUsed: true,
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disable the input and submit button.',
          commonlyUsed: true,
        },
        {
          name: 'maxLength',
          type: 'number',
          description:
            'Maximum character length. Enables character counter when set.',
        },
        {
          name: 'showCharCounter',
          type: 'boolean',
          default: 'true',
          description:
            'Show character counter. Defaults to true when maxLength is set.',
        },
        {
          name: 'warningThreshold',
          type: 'number',
          default: '0.8',
          description:
            'Warning threshold percentage (0-1). Counter changes color when this threshold is exceeded.',
        },
        {
          name: 'animateHeight',
          type: 'boolean',
          default: 'true',
          description: 'Enable smooth expand/contract animation as text grows.',
        },
        {
          name: 'glowOnFocus',
          type: 'boolean',
          default: 'true',
          description: 'Enable focus ring glow animation.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
        {
          name: 'id',
          type: 'string',
          description: 'HTML id attribute for skip link targeting.',
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'ARIA label for screen readers.',
        },
      ],
      notes: [
        'Uses request deduplication to prevent double-submit on rapid clicks (300ms debounce).',
        'Validates props in development mode and logs warnings for invalid values.',
        'Press Enter to submit, Shift+Enter for newline.',
      ],
    },
    {
      name: 'MarkdownRenderer',
      description:
        'Enhanced markdown renderer with support for GFM, syntax-highlighted code blocks, LaTeX math (KaTeX), Mermaid diagrams, and streaming content. Falls back to plain text when react-markdown is not installed.',
      importPath: '@clarity-chat/react',
      usageCode: `<MarkdownRenderer
  content={message.content}
  config={{
    enableKaTeX: true,
    enableMermaid: true,
    enableSyntaxHighlight: true,
    enableCopyButton: true,
    codeTheme: 'dark',
  }}
  isStreaming={isStreaming}
/>`,
      props: [
        {
          name: 'content',
          type: 'string',
          required: true,
          description: 'Markdown content to render.',
          commonlyUsed: true,
        },
        {
          name: 'config',
          type: 'EnhancedMarkdownConfig',
          description:
            'Configuration object with: enableKaTeX (boolean), enableMermaid (boolean), enableSyntaxHighlight (boolean), className (string), codeTheme ("light" | "dark"), enableCopyButton (boolean), enableLazyRendering (boolean).',
          commonlyUsed: true,
        },
        {
          name: 'isStreaming',
          type: 'boolean',
          default: 'false',
          description:
            'Whether content is currently streaming. Enables optimized rendering for partial content.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Exported as MarkdownRenderer (aliased from EnhancedMarkdownRenderer internally).',
        'Requires optional peer dependencies: react-markdown, remark-gfm, rehype-highlight. Falls back to plain text rendering without them.',
        'Mermaid diagram support requires the mermaid peer dependency (~300KB bundle impact).',
        'enableLazyRendering defers expensive rendering during streaming for better performance.',
      ],
    },
    {
      name: 'TypingIndicator',
      description:
        'Classic "typing..." indicator for chat interfaces with animated bouncing dots. Supports multiple animation variants, optional avatar display, and reduced motion preferences.',
      importPath: '@clarity-chat/react',
      usageCode: `{isAITyping && (
  <TypingIndicator
    showAvatar
    avatarFallback="AI"
    label="Assistant is thinking"
    variant="dots"
  />
)}`,
      props: [
        {
          name: 'showAvatar',
          type: 'boolean',
          default: 'true',
          description: 'Show avatar alongside the typing indicator.',
          commonlyUsed: true,
        },
        {
          name: 'avatarSrc',
          type: 'string',
          description: 'Avatar source URL.',
        },
        {
          name: 'avatarFallback',
          type: 'string',
          default: '"AI"',
          description: 'Avatar fallback text when no image is provided.',
        },
        {
          name: 'label',
          type: 'string',
          default: '"AI is typing"',
          description:
            'Custom label text used for the aria-label. Not visually displayed.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: "'dots' | 'pulse' | 'wave'",
          default: '"dots"',
          description: 'Animation variant for the typing indicator.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
      ],
      notes: [
        'Respects prefers-reduced-motion and falls back to a simple fade-in animation.',
        'Uses Framer Motion spring physics for natural bouncing dots.',
        'Includes role="status" and aria-live="polite" for screen reader announcements.',
      ],
    },
    {
      name: 'VoiceInput',
      description:
        'Production-ready voice input component powered by the Web Speech API. Provides one-click voice recording, real-time transcription, visual pulse feedback, auto-submit on speech end, and multi-language support.',
      importPath: '@clarity-chat/react',
      usageCode: `<VoiceInput
  onTranscript={(text) => {
    sendMessage(text)
  }}
  lang="en-US"
  showInterim
  autoSubmit
  size="md"
  variant="ghost"
  onStart={() => console.log('Listening...')}
  onError={(err) => console.error('Voice error:', err)}
/>`,
      props: [
        {
          name: 'onTranscript',
          type: '(transcript: string) => void',
          required: true,
          description: 'Callback when transcript is finalized.',
          commonlyUsed: true,
        },
        {
          name: 'lang',
          type: 'string',
          default: '"en-US"',
          description: 'Language code (e.g., "en-US", "es-ES", "fr-FR").',
          commonlyUsed: true,
        },
        {
          name: 'showInterim',
          type: 'boolean',
          default: 'true',
          description: 'Show real-time interim transcription results.',
        },
        {
          name: 'autoSubmit',
          type: 'boolean',
          default: 'true',
          description: 'Auto-submit transcript on speech end.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: '"md"',
          description: 'Button size.',
        },
        {
          name: 'variant',
          type: "'primary' | 'secondary' | 'ghost'",
          default: '"ghost"',
          description: 'Button variant style.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'Custom icon when not listening.',
        },
        {
          name: 'listeningIcon',
          type: 'ReactNode',
          description: 'Custom icon when actively listening.',
        },
        {
          name: 'showTooltip',
          type: 'boolean',
          description: 'Show tooltip on hover.',
        },
        {
          name: 'tooltipText',
          type: 'string',
          description: 'Custom tooltip text.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Disabled state.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
        {
          name: 'onStart',
          type: '() => void',
          description: 'Callback when listening starts.',
        },
        {
          name: 'onStop',
          type: '() => void',
          description: 'Callback when listening stops.',
        },
        {
          name: 'onError',
          type: '(error: string) => void',
          description:
            'Callback on error (e.g., microphone permission denied).',
        },
      ],
      notes: [
        'Requires browser support for the Web Speech API (SpeechRecognition).',
        'Shows a pulse animation while actively listening for voice input.',
        'Gracefully handles microphone permission errors with user feedback.',
      ],
    },
  ],

  // ==========================================================================
  // CODE & FILES TAB
  // ==========================================================================

  'Code Editor & Terminal': {
    name: 'CodeBlock',
    description:
      'World-class code display component with Shiki-powered syntax highlighting, line numbers, diff visualization, expand/collapse for long blocks, animated copy button, and premium font support. Falls back to basic <pre><code> rendering without shiki.',
    importPath: '@clarity-chat/react',
    usageCode: `<CodeBlock
  language="typescript"
  theme="github-dark"
  title="example.ts"
  showLineNumbers
  highlightLines="2,5-7"
  showCopyButton
  showLanguageBadge
  maxHeight={400}
  wordWrap={false}
  fontFamily="fira-code"
  enableLigatures
>
{\`import { ClarityChatApp } from '@clarity-chat/react'

export default function ChatPage() {
  return <ClarityChatApp api="/api/chat" />
}\`}
</CodeBlock>`,
    props: [
      {
        name: 'children',
        type: 'string',
        required: true,
        description: 'The code content to display.',
        commonlyUsed: true,
      },
      {
        name: 'language',
        type: 'string',
        description:
          'Programming language for syntax highlighting (e.g., "typescript", "python", "rust").',
        commonlyUsed: true,
      },
      {
        name: 'theme',
        type: 'CodeThemeName | BundledTheme',
        default: '"material-darker"',
        description:
          'Color theme from predefined themes (material-darker, github-dark, night-owl, etc.) or custom Shiki theme.',
        commonlyUsed: true,
      },
      {
        name: 'showLineNumbers',
        type: 'boolean',
        default: 'false',
        description: 'Show line numbers.',
        commonlyUsed: true,
      },
      {
        name: 'startingLineNumber',
        type: 'number',
        default: '1',
        description: 'Starting line number.',
      },
      {
        name: 'highlightLines',
        type: 'string',
        description:
          'Lines to highlight, specified as comma-separated ranges (e.g., "2,5-7,10").',
      },
      {
        name: 'addedLines',
        type: 'string',
        description: 'Lines marked as added in diff view (e.g., "3,5-8").',
      },
      {
        name: 'removedLines',
        type: 'string',
        description: 'Lines marked as removed in diff view (e.g., "1,4").',
      },
      {
        name: 'title',
        type: 'string',
        description: 'Title or filename to display in the header.',
        commonlyUsed: true,
      },
      {
        name: 'showCopyButton',
        type: 'boolean',
        default: 'true',
        description: 'Show the copy-to-clipboard button.',
        commonlyUsed: true,
      },
      {
        name: 'showLanguageBadge',
        type: 'boolean',
        default: 'true',
        description: 'Show language badge in the header.',
      },
      {
        name: 'maxHeight',
        type: 'number',
        description:
          'Maximum height in pixels before showing an expand button.',
      },
      {
        name: 'wordWrap',
        type: 'boolean',
        default: 'false',
        description: 'Enable word wrap for long lines.',
      },
      {
        name: 'fontFamily',
        type: "'fira-code' | 'jetbrains-mono' | 'source-code-pro' | 'system'",
        default: '"fira-code"',
        description: 'Font family for code display.',
      },
      {
        name: 'enableLigatures',
        type: 'boolean',
        default: 'true',
        description: 'Enable font ligatures (e.g., =>, !==).',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
      {
        name: 'onCopy',
        type: '() => void',
        description: 'Callback when code is copied.',
      },
      {
        name: 'autoDetectLanguage',
        type: 'boolean',
        default: 'true',
        description:
          'Auto-detect language from code content if language prop is not provided.',
      },
      {
        name: 'showDownloadButton',
        type: 'boolean',
        default: 'false',
        description: 'Show a download button in the header.',
      },
      {
        name: 'onDownload',
        type: '() => void',
        description: 'Callback when code is downloaded.',
      },
      {
        name: 'enableKeyboardShortcuts',
        type: 'boolean',
        default: 'false',
        description:
          'Enable keyboard shortcuts (Cmd+Shift+C to copy, Cmd+Shift+D to download).',
      },
      {
        name: 'filename',
        type: 'string',
        description:
          'Filename for download. Defaults to code.{language} if not specified.',
      },
    ],
    notes: [
      'Requires the shiki optional peer dependency for syntax highlighting. Install with: npm install shiki (~200KB bundle impact).',
      'Falls back to basic <pre><code> rendering without syntax highlighting when shiki is not installed.',
      'Syntax highlighting can be explicitly disabled via the CLARITY_DISABLE_SYNTAX_HIGHLIGHTING environment variable.',
      'Wrapped in a ContentErrorBoundary for graceful error handling.',
      'WCAG 2.1 AA accessible with keyboard navigation support.',
    ],
  },

  'File Explorer': {
    name: 'CommandPalette',
    description:
      'Keyboard-driven command palette for quick actions, file navigation, and search. Supports fuzzy filtering, categories, keyboard shortcuts display, loading states, and an AI context footer. The File Explorer demo showcases navigation patterns that CommandPalette provides in production.',
    importPath: '@clarity-chat/react',
    usageCode: `const [open, setOpen] = useState(false)

<CommandPalette
  items={[
    {
      id: 'open-file',
      label: 'Open File',
      description: 'Navigate to a file in the project',
      icon: <FileText className="h-4 w-4" />,
      category: 'Navigation',
      shortcut: ['Cmd', 'P'],
      onSelect: () => openFilePicker(),
    },
    {
      id: 'search',
      label: 'Search in Files',
      icon: <Search className="h-4 w-4" />,
      category: 'Navigation',
      shortcut: ['Cmd', 'Shift', 'F'],
      onSelect: () => openSearch(),
    },
  ]}
  open={open}
  onClose={() => setOpen(false)}
  placeholder="Search files and commands..."
  aiContext={{
    modelName: 'Claude 3.5 Sonnet',
    tokenUsage: { total: 2137 },
  }}
/>`,
    props: [
      {
        name: 'items',
        type: 'CommandItem[]',
        required: true,
        description:
          'Array of command items. Each item has: id, label, description?, icon?, shortcut?, category?, onSelect.',
        commonlyUsed: true,
      },
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: 'Whether the command palette is open.',
        commonlyUsed: true,
      },
      {
        name: 'onClose',
        type: '() => void',
        required: true,
        description: 'Callback when the palette is closed.',
        commonlyUsed: true,
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Type a command..."',
        description: 'Placeholder text for the search input.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Show loading spinner during async operations.',
      },
      {
        name: 'aria-label',
        type: 'string',
        default: '"Command palette"',
        description: 'Accessible label for the command palette.',
      },
      {
        name: 'aiContext',
        type: 'AIContext',
        description:
          'AI context information to display in the footer: modelName?, conversationId?, tokenUsage?, metadata?.',
      },
      {
        name: 'ref',
        type: 'React.Ref<HTMLDivElement>',
        description: 'Ref forwarded to the root element.',
      },
    ],
    notes: [
      'Uses a portal to render at the document body level.',
      'Includes focus trap and body scroll lock when open.',
      'Search filtering is debounced at 150ms for performance.',
      'Saves and restores focus on open/close for keyboard accessibility.',
      'Items are grouped by category and support keyboard shortcut display.',
    ],
  },

  'Chain of Thought': {
    name: 'StreamingMessage',
    description:
      'Displays AI responses with token-by-token streaming, chain-of-thought thinking steps, tool call visualization, inline citations, error states, and smooth streaming animation. The Chain of Thought demo showcases the thinkingSteps and currentThinkingStep features.',
    importPath: '@clarity-chat/react',
    usageCode: `<StreamingMessage
  content={streamedContent}
  isStreaming={isStreaming}
  thinkingSteps={[
    "Understanding the user's question about React hooks",
    "Identifying relevant concepts: useState, useEffect",
    "Recalling best practices from documentation",
    "Formulating clear explanation with examples",
  ]}
  currentThinkingStep="Formulating clear explanation with examples"
  showThinking
  showCitations
  showTools
  smoothStreaming
  streamingSpeed="normal"
/>`,
    props: [
      {
        name: 'content',
        type: 'string',
        required: true,
        description: 'Accumulated message content.',
        commonlyUsed: true,
      },
      {
        name: 'isStreaming',
        type: 'boolean',
        default: 'false',
        description:
          'Whether streaming is in progress. Shows streaming cursor when true.',
        commonlyUsed: true,
      },
      {
        name: 'toolCalls',
        type: 'ToolCall[]',
        description: 'Tool calls made during streaming.',
      },
      {
        name: 'citations',
        type: 'Citation[]',
        description: 'Citations/sources referenced in the response.',
      },
      {
        name: 'thinkingSteps',
        type: 'string[]',
        description:
          'Thinking steps (chain-of-thought) displayed as a progress list.',
        commonlyUsed: true,
      },
      {
        name: 'currentThinkingStep',
        type: 'string',
        description:
          'Current thinking step being processed. Shown with an active indicator.',
        commonlyUsed: true,
      },
      {
        name: 'error',
        type: 'string',
        description: 'Error message if streaming failed.',
      },
      {
        name: 'showThinking',
        type: 'boolean',
        description: 'Show thinking steps section.',
        commonlyUsed: true,
      },
      {
        name: 'showCitations',
        type: 'boolean',
        description: 'Show citations inline.',
      },
      {
        name: 'showTools',
        type: 'boolean',
        description: 'Show tool calls section.',
      },
      {
        name: 'onToolApprove',
        type: '(toolCall: ToolCall) => void',
        description: 'Callback when a tool call needs approval.',
      },
      {
        name: 'onToolReject',
        type: '(toolCall: ToolCall) => void',
        description: 'Callback when a tool call is rejected.',
      },
      {
        name: 'onRetry',
        type: '() => void',
        description: 'Callback when retry is requested after an error.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
      {
        name: 'smoothStreaming',
        type: 'boolean',
        default: 'false',
        description:
          'Enable smooth text streaming animation. Buffers content and renders at a consistent, readable pace instead of raw chunk display.',
      },
      {
        name: 'streamingSpeed',
        type: "'fast' | 'normal' | 'slow'",
        default: '"normal"',
        description: 'Speed for smooth streaming in characters per second.',
      },
    ],
    notes: [
      'Includes a pulsing cursor indicator during active streaming.',
      'Supports partial JSON rendering during streaming.',
      'Uses Framer Motion spring physics for smooth entrance and error animations.',
      'Respects prefers-reduced-motion settings.',
    ],
  },

  // ==========================================================================
  // TOOLS & APPROVAL TAB
  // ==========================================================================

  'Tool Approval': {
    name: 'AgentPanel',
    description:
      'Unified agent execution view that displays plan steps, thinking, tool executions, and human-in-the-loop approval cards. Supports auto-connection to AgentExecutionProvider and slot-based composition for customization. The Tool Approval demo showcases the approval workflow via showApprovals, onApprove, and onReject.',
    importPath: '@clarity-chat/react',
    usageCode: `<AgentPanel
  variant="sidebar"
  connected
  showPlan
  showThinking
  showTools
  showApprovals
  title="Agent Execution"
  maxHeight={500}
  onApprove={(tool) => approveToolExecution(tool)}
  onReject={(tool, reason) => rejectToolExecution(tool, reason)}
  onStepClick={(step) => scrollToStep(step)}
  onToolClick={(tool) => inspectTool(tool)}
>
  <AgentPanel.Header>Custom Header</AgentPanel.Header>
</AgentPanel>`,
    props: [
      {
        name: 'children',
        type: 'React.ReactNode',
        description:
          'Slot-based children for custom sections (e.g., AgentPanel.Header).',
      },
      {
        name: 'variant',
        type: "'sidebar' | 'inline' | 'modal' | 'compact' | 'full'",
        default: '"sidebar"',
        description: 'Panel layout variant.',
        commonlyUsed: true,
      },
      {
        name: 'connected',
        type: 'boolean',
        description:
          'Auto-connect to AgentExecutionProvider context. When true, automatically reads state from the nearest provider.',
        commonlyUsed: true,
      },
      {
        name: 'sections',
        type: 'AgentPanelSection[]',
        description:
          'Sections to show. Valid values: "header", "status", "plan", "thinking", "tools", "approvals", "timeline", "footer".',
      },
      {
        name: 'showPlan',
        type: 'boolean',
        description: 'Show plan steps section.',
        commonlyUsed: true,
      },
      {
        name: 'showThinking',
        type: 'boolean',
        description: 'Show thinking steps section.',
        commonlyUsed: true,
      },
      {
        name: 'showTools',
        type: 'boolean',
        description: 'Show tool executions section.',
        commonlyUsed: true,
      },
      {
        name: 'showApprovals',
        type: 'boolean',
        description:
          'Show approval cards for tools requiring human-in-the-loop.',
        commonlyUsed: true,
      },
      {
        name: 'showTimeline',
        type: 'boolean',
        description: 'Show execution timeline.',
      },
      {
        name: 'defaultCollapsed',
        type: 'boolean',
        description: 'Initially collapsed state (uncontrolled).',
      },
      {
        name: 'collapsed',
        type: 'boolean',
        description: 'Controlled collapsed state.',
      },
      {
        name: 'onCollapsedChange',
        type: '(collapsed: boolean) => void',
        description: 'Callback when collapse state changes.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
      {
        name: 'style',
        type: 'React.CSSProperties',
        description: 'Custom inline styles.',
      },
      {
        name: 'title',
        type: 'string',
        description: 'Title for the panel header.',
      },
      {
        name: 'maxHeight',
        type: 'string | number',
        description: 'Max height for scrollable content.',
      },
      {
        name: 'onStepClick',
        type: '(step: PlanStep) => void',
        description: 'Callback when a plan step is clicked.',
      },
      {
        name: 'onToolClick',
        type: '(tool: ToolCall) => void',
        description: 'Callback when a tool execution is clicked.',
      },
      {
        name: 'onApprove',
        type: '(tool: ToolCall) => void',
        description: 'Callback when a tool execution is approved.',
        commonlyUsed: true,
      },
      {
        name: 'onReject',
        type: '(tool: ToolCall, reason?: string) => void',
        description:
          'Callback when a tool execution is rejected with optional reason.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'API patterns are consistent with ClarityChatProvider and ChatComposer: connected prop, slot composition, consistent event naming.',
      'Use the connected prop to auto-read state from AgentExecutionProvider without manual prop drilling.',
      'Supports slot-based composition via compound components (AgentPanel.Header, etc.).',
      'Animations use shared constants from the animation system and respect reduced motion.',
    ],
  },

  'Safety & Guardrails': {
    name: 'NetworkStatus',
    description:
      'Production-ready network status indicator with auto-detection of connection state, periodic connectivity checks, connection quality measurement, and customizable visual indicators. The Safety & Guardrails demo showcases status monitoring patterns that NetworkStatus provides for real-time connection safety.',
    importPath: '@clarity-chat/react',
    usageCode: `<NetworkStatus
  position="top-right"
  showDetails
  onStatusChange={(status) => {
    if (status === 'offline') pauseStreaming()
    if (status === 'slow') showWarning('Slow connection detected')
  }}
  pingEndpoint="/api/health"
  pingInterval={15000}
  slowThreshold={800}
/>`,
    props: [
      {
        name: 'status',
        type: "'online' | 'offline' | 'slow' | 'unstable'",
        description:
          'Current connection status. Auto-detected from browser APIs if not provided.',
        commonlyUsed: true,
      },
      {
        name: 'show',
        type: 'boolean',
        default: 'true',
        description: 'Show the status indicator.',
        commonlyUsed: true,
      },
      {
        name: 'position',
        type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        default: '"top-right"',
        description: 'Position of the indicator on screen.',
        commonlyUsed: true,
      },
      {
        name: 'showDetails',
        type: 'boolean',
        default: 'false',
        description: 'Show detailed connection info (RTT, downlink speed).',
      },
      {
        name: 'onStatusChange',
        type: '(status: NetworkConnectionStatus) => void',
        description: 'Callback when network status changes.',
        commonlyUsed: true,
      },
      {
        name: 'pingEndpoint',
        type: 'string',
        default: '"/api/ping"',
        description: 'Custom ping endpoint for connectivity check.',
      },
      {
        name: 'pingInterval',
        type: 'number',
        default: '30000',
        description: 'Ping interval in milliseconds.',
      },
      {
        name: 'slowThreshold',
        type: 'number',
        default: '1000',
        description:
          'Threshold in ms above which the connection is considered slow.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
    ],
    notes: [
      'Uses the Navigator.onLine API and Network Information API for auto-detection.',
      'Performs periodic ping checks to verify actual connectivity beyond browser API.',
      'Includes ARIA live regions for screen reader status announcements.',
      'Status colors use design tokens (--success, --warning, destructive).',
    ],
  },

  'Retry Logic': {
    name: 'NetworkStatus',
    description:
      'NetworkStatus provides automatic retry and reconnection patterns through its periodic ping checks. The Retry Logic demo illustrates the retry-with-backoff pattern that NetworkStatus enables via its configurable pingInterval and slowThreshold props.',
    importPath: '@clarity-chat/react',
    usageCode: `<NetworkStatus
  show
  position="bottom-right"
  showDetails
  pingEndpoint="/api/health"
  pingInterval={5000}
  slowThreshold={500}
  onStatusChange={(status) => {
    switch (status) {
      case 'offline':
        enqueueRetry()
        break
      case 'online':
        flushRetryQueue()
        break
      case 'slow':
        reduceRequestRate()
        break
    }
  }}
/>`,
    props: [
      {
        name: 'status',
        type: "'online' | 'offline' | 'slow' | 'unstable'",
        description:
          'Current connection status. Auto-detected from browser APIs if not provided.',
        commonlyUsed: true,
      },
      {
        name: 'show',
        type: 'boolean',
        default: 'true',
        description: 'Show the status indicator.',
        commonlyUsed: true,
      },
      {
        name: 'position',
        type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        default: '"top-right"',
        description: 'Position of the indicator on screen.',
      },
      {
        name: 'showDetails',
        type: 'boolean',
        default: 'false',
        description: 'Show detailed connection info (RTT, downlink speed).',
      },
      {
        name: 'onStatusChange',
        type: '(status: NetworkConnectionStatus) => void',
        description:
          'Callback when network status changes. Use this to trigger retry logic.',
        commonlyUsed: true,
      },
      {
        name: 'pingEndpoint',
        type: 'string',
        default: '"/api/ping"',
        description: 'Custom ping endpoint for connectivity check.',
        commonlyUsed: true,
      },
      {
        name: 'pingInterval',
        type: 'number',
        default: '30000',
        description:
          'Ping interval in milliseconds. Lower values enable faster retry detection.',
        commonlyUsed: true,
      },
      {
        name: 'slowThreshold',
        type: 'number',
        default: '1000',
        description:
          'Threshold in ms above which the connection is considered slow.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
    ],
    notes: [
      'Combine onStatusChange with your own retry queue to implement exponential backoff.',
      'Lower pingInterval values (e.g., 5000ms) enable faster detection of network recovery.',
      'The slowThreshold prop lets you proactively degrade before full offline detection.',
    ],
  },

  'Model Fallback': {
    name: 'NetworkStatus',
    description:
      'The Model Fallback demo illustrates automatic failover between AI models. NetworkStatus supports this pattern by detecting connection quality, enabling your application to switch models based on latency (slowThreshold) or availability (offline detection).',
    importPath: '@clarity-chat/react',
    usageCode: `<NetworkStatus
  show
  showDetails
  position="top-right"
  slowThreshold={500}
  onStatusChange={(status) => {
    if (status === 'slow' || status === 'unstable') {
      switchToFallbackModel()
    } else if (status === 'online') {
      switchToPrimaryModel()
    }
  }}
/>`,
    props: [
      {
        name: 'status',
        type: "'online' | 'offline' | 'slow' | 'unstable'",
        description:
          'Current connection status. Auto-detected from browser APIs if not provided.',
        commonlyUsed: true,
      },
      {
        name: 'show',
        type: 'boolean',
        default: 'true',
        description: 'Show the status indicator.',
      },
      {
        name: 'position',
        type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        default: '"top-right"',
        description: 'Position of the indicator on screen.',
      },
      {
        name: 'showDetails',
        type: 'boolean',
        default: 'false',
        description: 'Show detailed connection info (RTT, downlink speed).',
      },
      {
        name: 'onStatusChange',
        type: '(status: NetworkConnectionStatus) => void',
        description:
          'Callback when network status changes. Use to trigger model fallback logic.',
        commonlyUsed: true,
      },
      {
        name: 'pingEndpoint',
        type: 'string',
        default: '"/api/ping"',
        description: 'Custom ping endpoint for connectivity check.',
      },
      {
        name: 'pingInterval',
        type: 'number',
        default: '30000',
        description: 'Ping interval in milliseconds.',
      },
      {
        name: 'slowThreshold',
        type: 'number',
        default: '1000',
        description:
          'Threshold in ms above which the connection is considered slow. Use to trigger model fallback before full failure.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
    ],
    notes: [
      'Use slowThreshold to proactively switch to a faster/cheaper model before latency becomes critical.',
      'Combine with your model registry to implement priority-based fallback chains.',
      'The "unstable" status (frequent online/offline toggling) is a good trigger for switching to a more resilient model endpoint.',
    ],
  },

  // ==========================================================================
  // MESSAGES TAB
  // ==========================================================================

  'Drafts & Archive': {
    name: 'ExportDialog',
    description:
      'Dialog component for exporting chat conversations, projects, or knowledge bases. Supports multiple export formats (PDF, Word, Markdown, JSON, HTML) with configurable options for metadata, images, and attachments. The Drafts & Archive demo showcases export and archival patterns.',
    importPath: '@clarity-chat/react',
    usageCode: `const [exportOpen, setExportOpen] = useState(false)

<ExportDialog
  open={exportOpen}
  onOpenChange={setExportOpen}
  onExport={async (options) => {
    await exportConversation(options)
  }}
  resourceType="chat"
  resourceName="AI Conversation - Jan 2026"
/>`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: 'Whether the dialog is open.',
        commonlyUsed: true,
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        required: true,
        description: 'Callback when the dialog open state changes.',
        commonlyUsed: true,
      },
      {
        name: 'onExport',
        type: '(options: ExportOptions) => Promise<void>',
        required: true,
        description:
          'Async callback to perform the export. Receives format and options.',
        commonlyUsed: true,
      },
      {
        name: 'resourceType',
        type: "'chat' | 'project' | 'knowledge-base'",
        required: true,
        description: 'Type of resource being exported.',
        commonlyUsed: true,
      },
      {
        name: 'resourceName',
        type: 'string',
        required: true,
        description:
          'Name of the resource being exported. Shown in the dialog title.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
    ],
    notes: [
      'Supports PDF, Word (DOCX), Markdown, JSON, and HTML export formats.',
      'Options include includeMetadata, includeImages, and includeAttachments toggles.',
      'Shows a progress bar during export with simulated progress updates.',
      'Respects prefers-reduced-motion for dialog animations.',
    ],
  },

  'Quick Replies': [
    {
      name: 'FollowUpSuggestions',
      description:
        'Displays suggested follow-up prompts after an assistant message. Wraps PromptSuggestions with a "Suggested follow-ups" header and animation. Typically placed below the last assistant message.',
      importPath: '@clarity-chat/react',
      usageCode: `<FollowUpSuggestions
  showFollowUp={hasAssistantReply}
  followUpSuggestions={[
    { id: '1', text: 'Yes, please continue', type: 'follow-up' },
    { id: '2', text: 'Can you explain more?', type: 'follow-up' },
    { id: '3', text: 'Show me an example', type: 'follow-up' },
  ]}
  onPromptSelect={(suggestion) => sendMessage(suggestion.text)}
/>`,
      props: [
        {
          name: 'showFollowUp',
          type: 'boolean',
          required: true,
          description:
            'Whether to show the follow-up suggestions. Typically tied to whether the last message is from the assistant.',
          commonlyUsed: true,
        },
        {
          name: 'followUpSuggestions',
          type: 'PromptSuggestion[]',
          description:
            'Array of follow-up suggestions. Each requires id, text, and type fields.',
          commonlyUsed: true,
        },
        {
          name: 'onPromptSelect',
          type: '(suggestion: PromptSuggestion) => void',
          required: true,
          description: 'Callback when a suggestion is selected.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Renders nothing when showFollowUp is false or followUpSuggestions is empty.',
        'Internally uses PromptSuggestions with layout="chips" and maxSuggestions=3.',
        'Animated entrance with slide-up or fade-in depending on reduced motion preference.',
      ],
    },
    {
      name: 'PromptSuggestions',
      description:
        'Context-aware prompt suggestions component supporting starters, follow-ups, quick replies, and templates. Offers multiple layout options (chips, cards, list), category grouping, and confidence-based sorting.',
      importPath: '@clarity-chat/react',
      usageCode: `<PromptSuggestions
  suggestions={[
    { id: '1', text: 'Yes, please continue', label: 'Continue', type: 'quick-reply' },
    { id: '2', text: 'Can you explain more?', label: 'Explain', type: 'quick-reply' },
    { id: '3', text: 'Show me an example', label: 'Example', type: 'quick-reply' },
    { id: '4', text: "That's helpful, thanks!", label: 'Thanks', type: 'quick-reply' },
  ]}
  onSelect={(suggestion) => sendMessage(suggestion.text)}
  suggestionType="quick-reply"
  layout="chips"
  maxSuggestions={6}
/>`,
      props: [
        {
          name: 'suggestions',
          type: 'PromptSuggestion[]',
          required: true,
          description:
            'Array of suggestions. Each has: id, text, label?, description?, icon?, category?, type, confidence?, keywords?, usageCount?.',
          commonlyUsed: true,
        },
        {
          name: 'onSelect',
          type: '(suggestion: PromptSuggestion) => void',
          required: true,
          description: 'Callback when a suggestion is selected.',
          commonlyUsed: true,
        },
        {
          name: 'messages',
          type: 'Message[]',
          description:
            'Current conversation messages for context-aware suggestion filtering.',
        },
        {
          name: 'suggestionType',
          type: "'starter' | 'follow-up' | 'quick-reply' | 'template'",
          default: '"starter"',
          description: 'Filter suggestions by type.',
          commonlyUsed: true,
        },
        {
          name: 'layout',
          type: "'chips' | 'cards' | 'list'",
          default: '"chips"',
          description: 'Layout style for rendering suggestions.',
          commonlyUsed: true,
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Show loading skeleton state.',
        },
        {
          name: 'maxSuggestions',
          type: 'number',
          default: '6',
          description: 'Maximum number of suggestions to show.',
        },
        {
          name: 'emptyState',
          type: 'React.ReactNode',
          description: 'Custom empty state when no suggestions match.',
        },
        {
          name: 'showCategories',
          type: 'boolean',
          default: 'false',
          description: 'Show category filter tabs above suggestions.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
      ],
      notes: [
        'Suggestions are filtered by suggestionType and optionally by category.',
        'Sorted by confidence (descending) for context-aware suggestions, then by usageCount.',
        'Animated entrance with staggered item animations.',
        'Supports a loading skeleton state for async suggestion generation.',
      ],
    },
  ],

  'Message Search': {
    name: 'CommandPalette',
    description:
      'The Message Search demo showcases search and navigation patterns. CommandPalette provides keyboard-driven search across commands, messages, and content with fuzzy filtering, category grouping, and AI context display.',
    importPath: '@clarity-chat/react',
    usageCode: `const [searchOpen, setSearchOpen] = useState(false)

<CommandPalette
  items={messages.map((msg) => ({
    id: msg.id,
    label: msg.content.slice(0, 60),
    description: new Date(msg.timestamp).toLocaleDateString(),
    category: 'Messages',
    onSelect: () => scrollToMessage(msg.id),
  }))}
  open={searchOpen}
  onClose={() => setSearchOpen(false)}
  placeholder="Search messages..."
/>`,
    props: [
      {
        name: 'items',
        type: 'CommandItem[]',
        required: true,
        description:
          'Array of searchable items. Each has: id, label, description?, icon?, shortcut?, category?, onSelect.',
        commonlyUsed: true,
      },
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: 'Whether the palette is open.',
        commonlyUsed: true,
      },
      {
        name: 'onClose',
        type: '() => void',
        required: true,
        description: 'Callback when the palette is closed.',
        commonlyUsed: true,
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Type a command..."',
        description: 'Placeholder text for the search input.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Show loading spinner during async search operations.',
      },
      {
        name: 'aria-label',
        type: 'string',
        default: '"Command palette"',
        description: 'Accessible label for the search palette.',
      },
      {
        name: 'aiContext',
        type: 'AIContext',
        description:
          'AI context info for the footer: modelName?, conversationId?, tokenUsage?, metadata?.',
      },
      {
        name: 'ref',
        type: 'React.Ref<HTMLDivElement>',
        description: 'Ref forwarded to the root element.',
      },
    ],
    notes: [
      'Use Cmd/Ctrl+K to open the palette with a keyboard shortcut.',
      'Fuzzy filtering matches against item labels and descriptions.',
      'Items are grouped by category with section headers.',
    ],
  },

  Sources: {
    name: 'CitationCard',
    description:
      'Displays RAG citations with expandable previews, confidence scores, source links, and metadata. Supports click-to-expand with truncated text preview and color-coded confidence badges.',
    importPath: '@clarity-chat/react',
    usageCode: `<CitationCard
  citation={{
    id: 'cite-1',
    sourceId: 'doc-123',
    chunkText: 'React components are reusable pieces of UI that can manage their own state...',
    url: 'https://react.dev/learn/components',
    title: 'React Documentation',
    confidence: 0.92,
    metadata: { section: 'Components', page: 1 },
  }}
  defaultExpanded={false}
  previewLength={150}
  showConfidence
  onClick={(citation) => highlightInContext(citation)}
  onSourceClick={(url) => window.open(url, '_blank')}
/>`,
    props: [
      {
        name: 'citation',
        type: 'Citation',
        required: true,
        description:
          'Citation data object with: id, sourceId, chunkText, url?, title?, confidence, metadata?.',
        commonlyUsed: true,
      },
      {
        name: 'defaultExpanded',
        type: 'boolean',
        default: 'false',
        description: 'Show expanded view by default.',
      },
      {
        name: 'previewLength',
        type: 'number',
        default: '150',
        description: 'Maximum characters for preview before truncation.',
      },
      {
        name: 'showConfidence',
        type: 'boolean',
        default: 'true',
        description: 'Show confidence score badge (High/Medium/Low/Very Low).',
        commonlyUsed: true,
      },
      {
        name: 'onClick',
        type: '(citation: Citation) => void',
        description: 'Callback when the citation card is clicked.',
        commonlyUsed: true,
      },
      {
        name: 'onSourceClick',
        type: '(url: string) => void',
        description:
          'Callback when the source link is clicked. Falls back to opening the URL in a new tab.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
    ],
    notes: [
      'Confidence badges are color-coded: >= 0.9 green (High), >= 0.7 blue (Medium), >= 0.5 yellow (Low), < 0.5 red (Very Low).',
      'Clicking the card toggles expansion if no onClick handler is provided.',
      'Source links open in a new tab with noopener,noreferrer for security.',
      'Animated entrance using Framer Motion slide-up preset.',
    ],
  },

  'Inline Citations': {
    name: 'CitationCard',
    description:
      'CitationCard provides the expandable citation display used alongside inline citation markers. The Inline Citations demo shows numbered superscript references in text, with each reference linking to a CitationCard for detailed source information.',
    importPath: '@clarity-chat/react',
    usageCode: `{citations.map((cite, index) => (
  <CitationCard
    key={cite.id}
    citation={cite}
    defaultExpanded={false}
    previewLength={100}
    showConfidence
    onSourceClick={(url) => window.open(url, '_blank')}
  />
))}`,
    props: [
      {
        name: 'citation',
        type: 'Citation',
        required: true,
        description:
          'Citation data object with: id, sourceId, chunkText, url?, title?, confidence, metadata?.',
        commonlyUsed: true,
      },
      {
        name: 'defaultExpanded',
        type: 'boolean',
        default: 'false',
        description: 'Show expanded view by default.',
      },
      {
        name: 'previewLength',
        type: 'number',
        default: '150',
        description: 'Maximum characters for preview before truncation.',
      },
      {
        name: 'showConfidence',
        type: 'boolean',
        default: 'true',
        description: 'Show confidence score badge.',
        commonlyUsed: true,
      },
      {
        name: 'onClick',
        type: '(citation: Citation) => void',
        description: 'Callback when the citation card is clicked.',
      },
      {
        name: 'onSourceClick',
        type: '(url: string) => void',
        description:
          'Callback when the source link is clicked. Falls back to opening the URL in a new tab.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
    ],
    notes: [
      'Pair with inline superscript markers (e.g., [1], [2]) in rendered markdown for a full inline citation experience.',
      'Use previewLength to control how much of the citation text is shown before the "expand" toggle.',
      'Keyboard accessible: Enter/Space to toggle expansion.',
    ],
  },

  // ==========================================================================
  // UI COMPONENTS TAB
  // ==========================================================================

  Notifications: {
    name: 'NetworkStatus',
    description:
      'The Notifications demo showcases real-time status alerts. NetworkStatus provides auto-detected connection notifications with customizable positioning and ARIA live regions for accessible status announcements.',
    importPath: '@clarity-chat/react',
    usageCode: `<NetworkStatus
  show
  position="top-right"
  showDetails={false}
  onStatusChange={(status) => {
    if (status === 'offline') {
      showNotification('Connection lost', 'error')
    } else if (status === 'online') {
      showNotification('Connection restored', 'success')
    }
  }}
/>`,
    props: [
      {
        name: 'status',
        type: "'online' | 'offline' | 'slow' | 'unstable'",
        description:
          'Current connection status. Auto-detected if not provided.',
        commonlyUsed: true,
      },
      {
        name: 'show',
        type: 'boolean',
        default: 'true',
        description: 'Show the status indicator.',
        commonlyUsed: true,
      },
      {
        name: 'position',
        type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        default: '"top-right"',
        description: 'Position of the indicator on screen.',
        commonlyUsed: true,
      },
      {
        name: 'showDetails',
        type: 'boolean',
        default: 'false',
        description: 'Show detailed connection info.',
      },
      {
        name: 'onStatusChange',
        type: '(status: NetworkConnectionStatus) => void',
        description:
          'Callback when status changes. Use to trigger notification toasts.',
        commonlyUsed: true,
      },
      {
        name: 'pingEndpoint',
        type: 'string',
        default: '"/api/ping"',
        description: 'Custom ping endpoint for connectivity check.',
      },
      {
        name: 'pingInterval',
        type: 'number',
        default: '30000',
        description: 'Ping interval in milliseconds.',
      },
      {
        name: 'slowThreshold',
        type: 'number',
        default: '1000',
        description:
          'Threshold in ms above which connection is considered slow.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
    ],
    notes: [
      'Combine onStatusChange with a toast/notification system for user-facing alerts.',
      'ARIA live regions ensure screen readers announce status changes.',
      'Use the show prop to conditionally display the indicator based on application state.',
    ],
  },

  Personas: {
    name: 'AgentPanel',
    description:
      'The Personas demo showcases AI persona selection. AgentPanel supports multiple layout variants and a configurable title, enabling different persona views. Use the variant prop to switch between sidebar, inline, compact, and full layouts for different persona presentation styles.',
    importPath: '@clarity-chat/react',
    usageCode: `<AgentPanel
  variant="compact"
  title="Code Assistant"
  showPlan={false}
  showThinking
  showTools
  connected
  className="persona-panel"
/>`,
    props: [
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Slot-based children for custom sections.',
      },
      {
        name: 'variant',
        type: "'sidebar' | 'inline' | 'modal' | 'compact' | 'full'",
        default: '"sidebar"',
        description:
          'Panel layout variant. Use different variants for different persona displays.',
        commonlyUsed: true,
      },
      {
        name: 'connected',
        type: 'boolean',
        description: 'Auto-connect to AgentExecutionProvider context.',
        commonlyUsed: true,
      },
      {
        name: 'sections',
        type: 'AgentPanelSection[]',
        description:
          'Sections to show: "header", "status", "plan", "thinking", "tools", "approvals", "timeline", "footer".',
      },
      {
        name: 'showPlan',
        type: 'boolean',
        description: 'Show plan steps section.',
      },
      {
        name: 'showThinking',
        type: 'boolean',
        description: 'Show thinking steps section.',
      },
      {
        name: 'showTools',
        type: 'boolean',
        description: 'Show tool executions section.',
      },
      {
        name: 'showApprovals',
        type: 'boolean',
        description: 'Show approval cards.',
      },
      {
        name: 'showTimeline',
        type: 'boolean',
        description: 'Show execution timeline.',
      },
      {
        name: 'defaultCollapsed',
        type: 'boolean',
        description: 'Initially collapsed state.',
      },
      {
        name: 'collapsed',
        type: 'boolean',
        description: 'Controlled collapsed state.',
      },
      {
        name: 'onCollapsedChange',
        type: '(collapsed: boolean) => void',
        description: 'Callback when collapse state changes.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
      {
        name: 'style',
        type: 'React.CSSProperties',
        description: 'Custom inline styles.',
      },
      {
        name: 'title',
        type: 'string',
        description: 'Title for the panel header. Use to display persona name.',
        commonlyUsed: true,
      },
      {
        name: 'maxHeight',
        type: 'string | number',
        description: 'Max height for scrollable content.',
      },
      {
        name: 'onStepClick',
        type: '(step: PlanStep) => void',
        description: 'Callback when a plan step is clicked.',
      },
      {
        name: 'onToolClick',
        type: '(tool: ToolCall) => void',
        description: 'Callback when a tool execution is clicked.',
      },
      {
        name: 'onApprove',
        type: '(tool: ToolCall) => void',
        description: 'Callback when a tool execution is approved.',
      },
      {
        name: 'onReject',
        type: '(tool: ToolCall, reason?: string) => void',
        description: 'Callback when a tool execution is rejected.',
      },
    ],
    notes: [
      'Use the variant prop to switch persona presentation: "compact" for minimal, "sidebar" for detailed, "inline" for embedded views.',
      'The title prop displays the persona name in the panel header.',
      'Toggle sections (showPlan, showThinking, showTools) to customize what each persona exposes.',
    ],
  },

  'Empty States': {
    name: 'ChatWindow',
    description:
      'The Empty States demo showcases placeholder content when there are no messages. ChatWindow provides an emptyState prop for custom empty state rendering and supports starterPrompts to help users discover capabilities.',
    importPath: '@clarity-chat/react',
    usageCode: `<ChatWindow
  messages={[]}
  onSendMessage={sendMessage}
  emptyState={
    <div className="text-center p-8">
      <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
      <p className="font-medium">No conversations yet</p>
      <p className="text-sm text-muted-foreground mt-1">
        Start a new chat to get going
      </p>
    </div>
  }
  prompts={{
    starterPrompts: [
      { id: '1', text: 'Help me write code', type: 'starter' },
      { id: '2', text: 'Explain a concept', type: 'starter' },
    ],
    showStarterPrompts: true,
  }}
/>`,
    props: [
      {
        name: 'messages',
        type: 'Message[] | CoreMessage[]',
        required: true,
        description:
          'Messages array. Empty array triggers the empty state display.',
        commonlyUsed: true,
      },
      {
        name: 'isLoading',
        type: 'boolean',
        default: 'false',
        description:
          'Whether the assistant is currently generating a response.',
      },
      {
        name: 'aiStatus',
        type: 'AIStatus',
        description: 'AI processing status for thinking indicator.',
      },
      {
        name: 'onSendMessage',
        type: '(content: string) => void',
        required: true,
        description: 'Callback invoked when the user submits a message.',
        commonlyUsed: true,
      },
      {
        name: 'onStopGeneration',
        type: '() => void',
        description: 'Callback to stop/cancel the current AI generation.',
      },
      {
        name: 'messageActions',
        type: 'ChatWindowMessageActions',
        description: 'Message interaction callbacks.',
      },
      {
        name: 'editActions',
        type: 'ChatWindowEditActions',
        description: 'Edit-related callbacks and state.',
      },
      {
        name: 'header',
        type: 'ChatWindowHeaderConfig',
        description: 'Header configuration.',
      },
      {
        name: 'actions',
        type: 'ChatWindowActions',
        description: 'Global actions: onExport, onClear.',
      },
      {
        name: 'errorHandling',
        type: 'ChatWindowErrorHandling',
        description: 'Error handling configuration.',
      },
      {
        name: 'prompts',
        type: 'ChatWindowPromptConfig',
        description:
          'Prompt suggestions: starterPrompts, followUpSuggestions, showStarterPrompts, showFollowUpSuggestions.',
        commonlyUsed: true,
      },
      {
        name: 'emptyState',
        type: 'React.ReactNode',
        description:
          'Custom empty state component shown when messages array is empty. Overrides the default empty state.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
      {
        name: 'onMessageCopy',
        type: '(messageId: string, content: string) => void',
        description: '@deprecated Use messageActions.onCopy instead.',
      },
      {
        name: 'onMessageFeedback',
        type: "(messageId: string, type: 'up' | 'down', comment?: string) => void",
        description: '@deprecated Use messageActions.onFeedback instead.',
      },
      {
        name: 'onMessageRetry',
        type: '(messageId: string) => void',
        description: '@deprecated Use messageActions.onRetry instead.',
      },
      {
        name: 'onEditMessage',
        type: '(messageId: string) => void',
        description: '@deprecated Use messageActions.onEdit instead.',
      },
      {
        name: 'onRegenerateMessage',
        type: '(messageId: string) => void',
        description: '@deprecated Use messageActions.onRegenerate instead.',
      },
      {
        name: 'onDeleteMessage',
        type: '(messageId: string) => void',
        description: '@deprecated Use messageActions.onDelete instead.',
      },
      {
        name: 'editingMessageId',
        type: 'string | null',
        description: '@deprecated Use editActions.editingMessageId instead.',
      },
      {
        name: 'onSaveEdit',
        type: '(messageId: string, newContent: string) => void',
        description: '@deprecated Use editActions.onSaveEdit instead.',
      },
      {
        name: 'onCancelEdit',
        type: '(messageId: string) => void',
        description: '@deprecated Use editActions.onCancelEdit instead.',
      },
      {
        name: 'showHeader',
        type: 'boolean',
        description: '@deprecated Use header.show instead.',
      },
      {
        name: 'sessionTitle',
        type: 'string',
        description: '@deprecated Use header.title instead.',
      },
      {
        name: 'sessionSubtitle',
        type: 'string',
        description: '@deprecated Use header.subtitle instead.',
      },
      {
        name: 'headerActions',
        type: 'React.ReactNode',
        description: '@deprecated Use header.actions instead.',
      },
      {
        name: 'showMessageCount',
        type: 'boolean',
        description: '@deprecated Use header.showMessageCount instead.',
      },
      {
        name: 'onExport',
        type: '() => void',
        description: '@deprecated Use actions.onExport instead.',
      },
      {
        name: 'onClear',
        type: '() => void',
        description: '@deprecated Use actions.onClear instead.',
      },
      {
        name: 'error',
        type: 'string | null',
        description: '@deprecated Use errorHandling.error instead.',
      },
      {
        name: 'onRetry',
        type: '() => void',
        description: '@deprecated Use errorHandling.onRetry instead.',
      },
      {
        name: 'onDismissError',
        type: '() => void',
        description: '@deprecated Use errorHandling.onDismissError instead.',
      },
      {
        name: 'starterPrompts',
        type: 'PromptSuggestion[]',
        description: '@deprecated Use prompts.starterPrompts instead.',
      },
      {
        name: 'followUpSuggestions',
        type: 'PromptSuggestion[]',
        description: '@deprecated Use prompts.followUpSuggestions instead.',
      },
      {
        name: 'showStarterPrompts',
        type: 'boolean',
        description: '@deprecated Use prompts.showStarterPrompts instead.',
      },
      {
        name: 'showFollowUpSuggestions',
        type: 'boolean',
        description: '@deprecated Use prompts.showFollowUpSuggestions instead.',
      },
      {
        name: 'autoScroll',
        type: 'boolean',
        description: 'Enable auto-scroll to bottom on new messages.',
      },
      {
        name: 'theme',
        type: 'string',
        description: 'Theme for the chat interface.',
      },
      {
        name: 'showTokenCounter',
        type: 'boolean',
        description: 'Show token counter in the input area.',
      },
      {
        name: 'showNetworkStatus',
        type: 'boolean',
        description: 'Show network status indicator.',
      },
      {
        name: 'enableMessageOperations',
        type: 'boolean',
        description: 'Enable message operations (edit, delete, branch).',
      },
    ],
    notes: [
      'When messages is empty, ChatWindow renders the emptyState prop or a built-in DefaultEmptyState component.',
      'Combine emptyState with prompts.starterPrompts and prompts.showStarterPrompts to guide users in starting conversations.',
      'The built-in DefaultEmptyState includes animated entry and responsive layout.',
    ],
  },

  'Error States': {
    name: 'ChatWindow',
    description:
      'The Error States demo showcases error handling patterns. ChatWindow provides errorHandling configuration for displaying error banners, retry buttons, and dismiss actions within the chat interface.',
    importPath: '@clarity-chat/react',
    usageCode: `<ChatWindow
  messages={messages}
  onSendMessage={sendMessage}
  errorHandling={{
    error: "Connection failed. Unable to reach the server.",
    onRetry: () => retryLastRequest(),
    onDismissError: () => clearError(),
  }}
/>`,
    props: [
      {
        name: 'messages',
        type: 'Message[] | CoreMessage[]',
        required: true,
        description: 'Messages array.',
        commonlyUsed: true,
      },
      {
        name: 'isLoading',
        type: 'boolean',
        default: 'false',
        description:
          'Whether the assistant is currently generating a response.',
      },
      {
        name: 'aiStatus',
        type: 'AIStatus',
        description: 'AI processing status for thinking indicator.',
      },
      {
        name: 'onSendMessage',
        type: '(content: string) => void',
        required: true,
        description: 'Callback invoked when the user submits a message.',
        commonlyUsed: true,
      },
      {
        name: 'onStopGeneration',
        type: '() => void',
        description: 'Callback to stop/cancel the current AI generation.',
      },
      {
        name: 'messageActions',
        type: 'ChatWindowMessageActions',
        description: 'Message interaction callbacks.',
      },
      {
        name: 'editActions',
        type: 'ChatWindowEditActions',
        description: 'Edit-related callbacks and state.',
      },
      {
        name: 'header',
        type: 'ChatWindowHeaderConfig',
        description: 'Header configuration.',
      },
      {
        name: 'actions',
        type: 'ChatWindowActions',
        description: 'Global actions: onExport, onClear.',
      },
      {
        name: 'errorHandling',
        type: 'ChatWindowErrorHandling',
        description:
          'Error handling configuration with error message, retry callback, and dismiss callback. Shows a banner above the chat when error is set.',
        commonlyUsed: true,
      },
      {
        name: 'prompts',
        type: 'ChatWindowPromptConfig',
        description: 'Prompt suggestions configuration.',
      },
      {
        name: 'emptyState',
        type: 'React.ReactNode',
        description: 'Custom empty state.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
      {
        name: 'onMessageCopy',
        type: '(messageId: string, content: string) => void',
        description: '@deprecated Use messageActions.onCopy instead.',
      },
      {
        name: 'onMessageFeedback',
        type: "(messageId: string, type: 'up' | 'down', comment?: string) => void",
        description: '@deprecated Use messageActions.onFeedback instead.',
      },
      {
        name: 'onMessageRetry',
        type: '(messageId: string) => void',
        description: '@deprecated Use messageActions.onRetry instead.',
      },
      {
        name: 'onEditMessage',
        type: '(messageId: string) => void',
        description: '@deprecated Use messageActions.onEdit instead.',
      },
      {
        name: 'onRegenerateMessage',
        type: '(messageId: string) => void',
        description: '@deprecated Use messageActions.onRegenerate instead.',
      },
      {
        name: 'onDeleteMessage',
        type: '(messageId: string) => void',
        description: '@deprecated Use messageActions.onDelete instead.',
      },
      {
        name: 'editingMessageId',
        type: 'string | null',
        description: '@deprecated Use editActions.editingMessageId instead.',
      },
      {
        name: 'onSaveEdit',
        type: '(messageId: string, newContent: string) => void',
        description: '@deprecated Use editActions.onSaveEdit instead.',
      },
      {
        name: 'onCancelEdit',
        type: '(messageId: string) => void',
        description: '@deprecated Use editActions.onCancelEdit instead.',
      },
      {
        name: 'showHeader',
        type: 'boolean',
        description: '@deprecated Use header.show instead.',
      },
      {
        name: 'sessionTitle',
        type: 'string',
        description: '@deprecated Use header.title instead.',
      },
      {
        name: 'sessionSubtitle',
        type: 'string',
        description: '@deprecated Use header.subtitle instead.',
      },
      {
        name: 'headerActions',
        type: 'React.ReactNode',
        description: '@deprecated Use header.actions instead.',
      },
      {
        name: 'showMessageCount',
        type: 'boolean',
        description: '@deprecated Use header.showMessageCount instead.',
      },
      {
        name: 'onExport',
        type: '() => void',
        description: '@deprecated Use actions.onExport instead.',
      },
      {
        name: 'onClear',
        type: '() => void',
        description: '@deprecated Use actions.onClear instead.',
      },
      {
        name: 'error',
        type: 'string | null',
        description: '@deprecated Use errorHandling.error instead.',
      },
      {
        name: 'onRetry',
        type: '() => void',
        description: '@deprecated Use errorHandling.onRetry instead.',
      },
      {
        name: 'onDismissError',
        type: '() => void',
        description: '@deprecated Use errorHandling.onDismissError instead.',
      },
      {
        name: 'starterPrompts',
        type: 'PromptSuggestion[]',
        description: '@deprecated Use prompts.starterPrompts instead.',
      },
      {
        name: 'followUpSuggestions',
        type: 'PromptSuggestion[]',
        description: '@deprecated Use prompts.followUpSuggestions instead.',
      },
      {
        name: 'showStarterPrompts',
        type: 'boolean',
        description: '@deprecated Use prompts.showStarterPrompts instead.',
      },
      {
        name: 'showFollowUpSuggestions',
        type: 'boolean',
        description: '@deprecated Use prompts.showFollowUpSuggestions instead.',
      },
      {
        name: 'autoScroll',
        type: 'boolean',
        description: 'Enable auto-scroll to bottom on new messages.',
      },
      {
        name: 'theme',
        type: 'string',
        description: 'Theme for the chat interface.',
      },
      {
        name: 'showTokenCounter',
        type: 'boolean',
        description: 'Show token counter in the input area.',
      },
      {
        name: 'showNetworkStatus',
        type: 'boolean',
        description: 'Show network status indicator.',
      },
      {
        name: 'enableMessageOperations',
        type: 'boolean',
        description: 'Enable message operations (edit, delete, branch).',
      },
    ],
    notes: [
      'Set errorHandling.error to a string to display an error banner above the chat messages.',
      'Provide errorHandling.onRetry to show a "Retry" button alongside the error banner.',
      'Provide errorHandling.onDismissError to show a dismiss/close button on the error banner.',
      'Errors are rendered via the ErrorBanner sub-component within ChatWindow.',
    ],
  },

  'Date Picker': {
    name: 'ExportDialog',
    description:
      'The Date Picker demo showcases interactive selection UI patterns. ExportDialog provides a dialog-based selection interface with format options and configurable toggles, demonstrating the dialog-driven interaction model used across the component library.',
    importPath: '@clarity-chat/react',
    usageCode: `const [open, setOpen] = useState(false)

<ExportDialog
  open={open}
  onOpenChange={setOpen}
  onExport={async (options) => {
    await exportWithDateRange(options)
  }}
  resourceType="chat"
  resourceName="Weekly Report"
/>`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: 'Whether the dialog is open.',
        commonlyUsed: true,
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        required: true,
        description: 'Callback when the dialog open state changes.',
        commonlyUsed: true,
      },
      {
        name: 'onExport',
        type: '(options: ExportOptions) => Promise<void>',
        required: true,
        description:
          'Async callback to perform the export with selected options.',
        commonlyUsed: true,
      },
      {
        name: 'resourceType',
        type: "'chat' | 'project' | 'knowledge-base'",
        required: true,
        description: 'Type of resource being exported.',
      },
      {
        name: 'resourceName',
        type: 'string',
        required: true,
        description: 'Name of the resource shown in the dialog title.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
    ],
    notes: [
      'The dialog pattern demonstrated here (open/onOpenChange controlled state) is reusable for any selection UI including date pickers.',
      'Built on top of the Dialog primitives from @clarity-chat/primitives.',
      'Includes progress feedback during the async export operation.',
    ],
  },
}
