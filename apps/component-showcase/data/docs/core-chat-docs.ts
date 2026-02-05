import type { ComponentDoc } from '@/components/doc-panel'

export const coreChatDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // ChatWindow
  // ===========================================================================
  ChatWindow: {
    name: 'ChatWindow',
    description:
      'A mid-level composable chat window that renders messages, handles input, and provides message actions such as copy, feedback, retry, edit, regenerate, and delete. Supports grouped prop objects for message actions, edit state, header config, error handling, and prompt suggestions, as well as legacy flat props for backward compatibility.',
    importPath: '@clarity-chat/react',
    usageCode: `<ChatWindow
  messages={messages}
  onSendMessage={(content) => sendMessage(content)}
  isLoading={isLoading}
  onStopGeneration={() => abortController.abort()}
  header={{
    show: true,
    title: 'Clarity Assistant',
    subtitle: 'GPT-4o',
    showMessageCount: true,
  }}
  messageActions={{
    onCopy: (id, content) => navigator.clipboard.writeText(content),
    onFeedback: (id, type) => trackFeedback(id, type),
    onRetry: (id) => retryMessage(id),
  }}
  errorHandling={{
    error: errorMsg,
    onRetry: () => retry(),
    onDismissError: () => clearError(),
  }}
  prompts={{
    starterPrompts: [
      { text: 'Explain React hooks', icon: '?' },
    ],
    followUpSuggestions: [
      { text: 'Tell me more about useEffect' },
    ],
  }}
  emptyState={<MyCustomEmptyState />}
  autoScroll
  className="h-[600px]"
/>`,
    props: [
      {
        name: 'messages',
        type: 'Message[] | CoreMessage[]',
        required: true,
        description:
          'Array of chat messages to display. Accepts either the full Message type or the lighter CoreMessage format, which is auto-normalized internally.',
        commonlyUsed: true,
      },
      {
        name: 'isLoading',
        type: 'boolean',
        default: 'false',
        description:
          'Whether the AI is currently generating a response. When true, disables the input and can show a thinking indicator.',
        commonlyUsed: true,
      },
      {
        name: 'aiStatus',
        type: 'AIStatus',
        description:
          'AI processing status used to drive the thinking indicator above the input (e.g. "thinking", "searching", "generating").',
      },
      {
        name: 'onSendMessage',
        type: '(content: string) => void',
        required: true,
        description:
          'Callback invoked when the user submits a message from the built-in ChatInput.',
        commonlyUsed: true,
      },
      {
        name: 'onStopGeneration',
        type: '() => void',
        description:
          'Callback to cancel the current AI generation. When provided, a "Stop" button appears during loading state.',
        commonlyUsed: true,
      },
      {
        name: 'messageActions',
        type: 'ChatWindowMessageActions',
        description:
          'Grouped object for message interaction callbacks: onCopy, onFeedback, onRetry, onEdit, onRegenerate, onDelete.',
        commonlyUsed: true,
      },
      {
        name: 'editActions',
        type: 'ChatWindowEditActions',
        description:
          'Grouped object for inline edit state: editingMessageId, onSaveEdit, onCancelEdit.',
      },
      {
        name: 'header',
        type: 'ChatWindowHeaderConfig',
        description:
          'Header configuration object: show, title, subtitle, actions (ReactNode), showMessageCount.',
        commonlyUsed: true,
      },
      {
        name: 'actions',
        type: 'ChatWindowActions',
        description:
          'Global action callbacks: onExport and onClear for the chat session.',
      },
      {
        name: 'errorHandling',
        type: 'ChatWindowErrorHandling',
        description:
          'Error handling configuration: error (string to display), onRetry, onDismissError. Shows a banner above messages when error is set.',
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
          'Custom empty state rendered when there are no messages. Defaults to a built-in empty state that can show starter prompts.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Additional CSS class name applied to the outer Card wrapper.',
        commonlyUsed: true,
      },
      {
        name: 'autoScroll',
        type: 'boolean',
        description: 'Enable auto-scroll to bottom when new messages arrive.',
        commonlyUsed: true,
      },
      {
        name: 'theme',
        type: 'string',
        description: 'Theme identifier for the chat interface.',
      },
      {
        name: 'showTokenCounter',
        type: 'boolean',
        description: 'Show a token counter in the chat input area.',
      },
      {
        name: 'showNetworkStatus',
        type: 'boolean',
        description: 'Show a network status indicator in the chat window.',
      },
      {
        name: 'enableMessageOperations',
        type: 'boolean',
        description:
          'Enable message operations such as edit, delete, and branch on individual messages.',
      },
      {
        name: 'onMessageCopy',
        type: '(messageId: string, content: string) => void',
        description: 'Deprecated. Use messageActions.onCopy instead.',
      },
      {
        name: 'onMessageFeedback',
        type: "(messageId: string, type: 'up' | 'down', comment?: string) => void",
        description: 'Deprecated. Use messageActions.onFeedback instead.',
      },
      {
        name: 'onMessageRetry',
        type: '(messageId: string) => void',
        description: 'Deprecated. Use messageActions.onRetry instead.',
      },
      {
        name: 'onEditMessage',
        type: '(messageId: string) => void',
        description: 'Deprecated. Use messageActions.onEdit instead.',
      },
      {
        name: 'onRegenerateMessage',
        type: '(messageId: string) => void',
        description: 'Deprecated. Use messageActions.onRegenerate instead.',
      },
      {
        name: 'onDeleteMessage',
        type: '(messageId: string) => void',
        description: 'Deprecated. Use messageActions.onDelete instead.',
      },
      {
        name: 'editingMessageId',
        type: 'string | null',
        description: 'Deprecated. Use editActions.editingMessageId instead.',
      },
      {
        name: 'onSaveEdit',
        type: '(messageId: string, newContent: string) => void',
        description: 'Deprecated. Use editActions.onSaveEdit instead.',
      },
      {
        name: 'onCancelEdit',
        type: '(messageId: string) => void',
        description: 'Deprecated. Use editActions.onCancelEdit instead.',
      },
      {
        name: 'showHeader',
        type: 'boolean',
        description: 'Deprecated. Use header.show instead.',
      },
      {
        name: 'sessionTitle',
        type: 'string',
        description: 'Deprecated. Use header.title instead.',
      },
      {
        name: 'sessionSubtitle',
        type: 'string',
        description: 'Deprecated. Use header.subtitle instead.',
      },
      {
        name: 'headerActions',
        type: 'React.ReactNode',
        description: 'Deprecated. Use header.actions instead.',
      },
      {
        name: 'showMessageCount',
        type: 'boolean',
        description: 'Deprecated. Use header.showMessageCount instead.',
      },
      {
        name: 'onExport',
        type: '() => void',
        description: 'Deprecated. Use actions.onExport instead.',
      },
      {
        name: 'onClear',
        type: '() => void',
        description: 'Deprecated. Use actions.onClear instead.',
      },
      {
        name: 'error',
        type: 'string | null',
        description: 'Deprecated. Use errorHandling.error instead.',
      },
      {
        name: 'onRetry',
        type: '() => void',
        description: 'Deprecated. Use errorHandling.onRetry instead.',
      },
      {
        name: 'onDismissError',
        type: '() => void',
        description: 'Deprecated. Use errorHandling.onDismissError instead.',
      },
      {
        name: 'starterPrompts',
        type: 'PromptSuggestion[]',
        description: 'Deprecated. Use prompts.starterPrompts instead.',
      },
      {
        name: 'followUpSuggestions',
        type: 'PromptSuggestion[]',
        description: 'Deprecated. Use prompts.followUpSuggestions instead.',
      },
      {
        name: 'showStarterPrompts',
        type: 'boolean',
        description: 'Deprecated. Use prompts.showStarterPrompts instead.',
      },
      {
        name: 'showFollowUpSuggestions',
        type: 'boolean',
        description: 'Deprecated. Use prompts.showFollowUpSuggestions instead.',
      },
    ],
    notes: [
      'ChatWindow accepts both Message[] and CoreMessage[] formats; CoreMessage is auto-normalized internally via useMessageNormalization.',
      'Grouped prop objects (messageActions, editActions, header, actions, errorHandling, prompts) are the preferred API. Legacy flat props are supported for backward compatibility but are deprecated.',
      'When onStopGeneration is provided, a "Stop generating" banner appears above messages during loading.',
      'The component includes built-in accessibility: skip links, a live region for screen reader announcements, and proper ARIA roles.',
      'Runtime validation throws in development if messages is not an array or onSendMessage is not a function.',
    ],
  },

  // ===========================================================================
  // ChatSidebar
  // ===========================================================================
  ChatSidebar: {
    name: 'ChatSidebar',
    description:
      'A full-featured conversation sidebar with search, project grouping, pinned/recent sections, inline rename, and a collapsed icon-only mode. Includes a context menu per conversation for rename, pin, archive, and delete.',
    importPath: '@clarity-chat/react',
    usageCode: `<ChatSidebar
  conversations={[
    {
      id: '1',
      title: 'React Hooks Guide',
      preview: 'Let me explain useState...',
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: true,
    },
    {
      id: '2',
      title: 'API Design',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]}
  projects={[
    { id: 'p1', name: 'Frontend', color: '#3b82f6', conversationCount: 5 },
  ]}
  activeConversationId="1"
  onConversationSelect={(id) => setActive(id)}
  onNewConversation={() => createNew()}
  onDeleteConversation={(id) => deleteConv(id)}
  onRenameConversation={(id, name) => rename(id, name)}
  onPinConversation={(id) => togglePin(id)}
  onArchiveConversation={(id) => archive(id)}
  onSettingsOpen={() => openSettings()}
  collapsed={false}
  onToggleCollapse={() => toggle()}
/>`,
    props: [
      {
        name: 'conversations',
        type: 'Conversation[]',
        required: true,
        description:
          'Array of conversation objects. Each has id, title, preview?, createdAt, updatedAt, pinned?, archived?, projectId?, and tags?.',
        commonlyUsed: true,
      },
      {
        name: 'projects',
        type: 'Project[]',
        default: '[]',
        description:
          'Array of project objects for grouping conversations. Each has id, name, color?, and conversationCount.',
      },
      {
        name: 'activeConversationId',
        type: 'string',
        description:
          'The ID of the currently active conversation. Highlights the corresponding item in the list.',
        commonlyUsed: true,
      },
      {
        name: 'onConversationSelect',
        type: '(id: string) => void',
        required: true,
        description: 'Callback when a conversation is clicked/selected.',
        commonlyUsed: true,
      },
      {
        name: 'onNewConversation',
        type: '() => void',
        required: true,
        description:
          'Callback when the "New Chat" button is clicked. Should create a new conversation.',
        commonlyUsed: true,
      },
      {
        name: 'onDeleteConversation',
        type: '(id: string) => void',
        description:
          'Callback when a conversation is deleted via the context menu.',
        commonlyUsed: true,
      },
      {
        name: 'onRenameConversation',
        type: '(id: string, name: string) => void',
        description:
          'Callback when a conversation is renamed via inline editing. Receives the conversation ID and the new name.',
      },
      {
        name: 'onPinConversation',
        type: '(id: string) => void',
        description:
          'Callback to pin or unpin a conversation. Pinned conversations appear in a separate "Pinned" section.',
      },
      {
        name: 'onArchiveConversation',
        type: '(id: string) => void',
        description:
          'Callback to archive a conversation. Archived conversations are filtered out of the main list.',
      },
      {
        name: 'onProjectSelect',
        type: '(id: string) => void',
        description: 'Callback when a project folder is selected.',
      },
      {
        name: 'onSettingsOpen',
        type: '() => void',
        description:
          'Callback when the Settings button in the sidebar footer is clicked.',
      },
      {
        name: 'collapsed',
        type: 'boolean',
        default: 'false',
        description:
          'When true, renders a narrow icon-only sidebar (w-16) instead of the full-width sidebar (w-72).',
        commonlyUsed: true,
      },
      {
        name: 'onToggleCollapse',
        type: '() => void',
        description: 'Callback to toggle the collapsed state of the sidebar.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class name for the sidebar container.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'The sidebar automatically splits conversations into "Pinned" and "Recent" sections based on the pinned property.',
      'A search input at the top filters conversations by title and preview text.',
      'Projects appear as collapsible sections with a colored dot and conversation count badge.',
      'In collapsed mode, only icon buttons are shown for the first 10 conversations.',
      'Inline renaming is triggered from the context menu and confirmed on Enter or blur.',
    ],
  },

  // ===========================================================================
  // ChatInput Variants
  // ===========================================================================
  'ChatInput Variants': [
    {
      name: 'ChatInput',
      description:
        'A mid-level composable chat input with auto-resizing textarea, character counter with progress bar, warning thresholds, focus glow animation, and request deduplication to prevent double-submit.',
      importPath: '@clarity-chat/react',
      usageCode: `const [input, setInput] = useState('')

<ChatInput
  value={input}
  onChange={setInput}
  onSubmit={async (value) => {
    await sendMessage(value)
    setInput('')
  }}
  placeholder="Type a message..."
  maxLength={2000}
  showCharCounter
  warningThreshold={0.8}
  animateHeight
  glowOnFocus
  disabled={isLoading}
/>`,
      props: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description: 'The current input value (controlled component).',
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
            'Callback when the form is submitted (Enter key or send button click). Supports async for loading state management.',
          commonlyUsed: true,
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Type a message..."',
          description: 'Placeholder text shown when the input is empty.',
          commonlyUsed: true,
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description:
            'Disables the input and send button. Typically set to true while the AI is generating.',
          commonlyUsed: true,
        },
        {
          name: 'maxLength',
          type: 'number',
          description:
            'Maximum character length. When set, enables the character counter and over-limit validation.',
          commonlyUsed: true,
        },
        {
          name: 'showCharCounter',
          type: 'boolean',
          default: 'true',
          description:
            'Show the character counter with progress bar. Defaults to true when maxLength is set.',
        },
        {
          name: 'warningThreshold',
          type: 'number',
          default: '0.8',
          description:
            'Percentage threshold (0-1) at which the character counter turns to a warning color. Default is 80%.',
        },
        {
          name: 'animateHeight',
          type: 'boolean',
          default: 'true',
          description:
            'Enable smooth expand/contract animation on the textarea as content grows or shrinks.',
        },
        {
          name: 'glowOnFocus',
          type: 'boolean',
          default: 'true',
          description:
            'Enable a focus ring glow animation using Framer Motion when the textarea is focused.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class name for the outer container.',
          commonlyUsed: true,
        },
        {
          name: 'id',
          type: 'string',
          description:
            'HTML id attribute, used for skip link targeting and accessibility.',
        },
        {
          name: "'aria-label'",
          type: 'string',
          description:
            'ARIA label for screen readers. Defaults to "Message" when not provided.',
        },
      ],
      notes: [
        'Press Enter to submit, Shift+Enter for a new line.',
        'Includes built-in request deduplication (300ms debounce) to prevent double-submit on rapid clicks.',
        'When the character count exceeds maxLength, the input shakes and the send button is disabled.',
        'Respects prefers-reduced-motion by disabling animations when the user has that preference set.',
        'The send button shows animated state transitions: idle, loading, success, and error.',
      ],
    },
    {
      name: 'Sender',
      description:
        'A flexible chat input component with variant styling (default, bordered, filled, ghost), size options, auto-resizing textarea, and customizable prefix/suffix/actions slots. Suitable for embedding in any chat layout.',
      importPath: '@clarity-chat/react',
      usageCode: `<Sender
  value={message}
  onChange={setMessage}
  onSubmit={(value) => handleSend(value)}
  placeholder="Ask me anything..."
  variant="bordered"
  size="md"
  maxLength={4000}
  prefix={<PaperclipIcon />}
  suffix={<MicIcon />}
/>`,
      props: [
        {
          name: 'value',
          type: 'string',
          default: '""',
          description:
            'The current input value. If onChange is not provided, the component manages its own internal state.',
          commonlyUsed: true,
        },
        {
          name: 'onChange',
          type: '(value: string) => void',
          description:
            'Callback when the input value changes. When omitted, the component is uncontrolled.',
          commonlyUsed: true,
        },
        {
          name: 'onSubmit',
          type: '(value: string) => void',
          description:
            'Callback when the user submits (Enter or send button). Receives the current input value.',
          commonlyUsed: true,
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Type a message..."',
          description: 'Placeholder text for the textarea.',
          commonlyUsed: true,
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the input and send button.',
          commonlyUsed: true,
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description:
            'Shows a loading spinner on the send button and disables input.',
        },
        {
          name: 'maxLength',
          type: 'number',
          description:
            'Maximum character length. Input changes are rejected beyond this limit.',
        },
        {
          name: 'autoFocus',
          type: 'boolean',
          default: 'false',
          description: 'Auto-focus the textarea on mount.',
        },
        {
          name: 'allowEmpty',
          type: 'boolean',
          default: 'false',
          description:
            'When true, allows submitting with an empty/whitespace-only value.',
        },
        {
          name: 'prefix',
          type: 'React.ReactNode',
          description:
            'Content rendered before the textarea (e.g. an attachment button icon).',
        },
        {
          name: 'suffix',
          type: 'React.ReactNode',
          description:
            'Content rendered after the textarea, before the action buttons.',
        },
        {
          name: 'actions',
          type: 'React.ReactNode',
          description:
            'Custom action buttons to replace the default send button.',
        },
        {
          name: 'onPaste',
          type: '(event: React.ClipboardEvent) => void',
          description: 'Callback when content is pasted into the textarea.',
        },
        {
          name: 'onKeyDown',
          type: '(event: React.KeyboardEvent) => void',
          description:
            'Additional keydown handler. Called after the built-in Enter-to-submit logic.',
        },
        {
          name: 'variant',
          type: "'default' | 'bordered' | 'filled' | 'ghost'",
          default: '"default"',
          description:
            'Visual style variant. "default" has a subtle border, "bordered" has a 2px border, "filled" has a muted background, "ghost" is borderless.',
          commonlyUsed: true,
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: '"md"',
          description:
            'Size preset controlling font size and minimum height: sm (36px), md (44px), lg (52px).',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class name for the outer container.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'The textarea auto-resizes as content grows, up to a maximum height of 200px.',
        'Press Enter to submit, Shift+Enter for a new line.',
        'When actions prop is omitted, a default send button with a paper-plane icon is rendered.',
        'Can be used as either a controlled (with onChange) or uncontrolled component.',
      ],
    },
  ],

  // ===========================================================================
  // ChatContainer
  // ===========================================================================
  ChatContainer: [
    {
      name: 'ChatContainer',
      description:
        'A scrollable container with intelligent auto-scroll behavior and a "scroll to bottom" button. Exposes imperative methods via ref for programmatic scrolling (scrollToBottom, scrollToTop, scrollToMessage).',
      importPath: '@clarity-chat/react',
      usageCode: `const containerRef = useRef<ChatContainerRef>(null)

<ChatContainer
  ref={containerRef}
  autoScroll
  autoScrollThreshold={100}
  showScrollButton
  scrollButtonPosition="center"
  onScrollChange={(isAtBottom) => setIsAtBottom(isAtBottom)}
  className="h-[500px]"
  contentClassName="p-4"
>
  {messages.map((msg) => (
    <MessageBubble key={msg.id} message={msg} />
  ))}
</ChatContainer>`,
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'The scrollable content (typically message elements).',
          commonlyUsed: true,
        },
        {
          name: 'autoScroll',
          type: 'boolean',
          default: 'true',
          description:
            'Automatically scroll to the bottom when new content is added and the user is already near the bottom.',
          commonlyUsed: true,
        },
        {
          name: 'autoScrollThreshold',
          type: 'number',
          default: '100',
          description:
            'Distance in pixels from the bottom within which auto-scroll is triggered.',
        },
        {
          name: 'showScrollButton',
          type: 'boolean',
          default: 'true',
          description:
            'Show a floating "scroll to bottom" button when the user has scrolled up.',
          commonlyUsed: true,
        },
        {
          name: 'scrollButtonPosition',
          type: "'left' | 'center' | 'right'",
          default: '"center"',
          description: 'Horizontal position of the scroll-to-bottom button.',
        },
        {
          name: 'onScrollChange',
          type: '(isAtBottom: boolean) => void',
          description:
            'Callback fired when the scroll position changes, reporting whether the user is at the bottom.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'CSS class for the outer wrapper div.',
          commonlyUsed: true,
        },
        {
          name: 'contentClassName',
          type: 'string',
          description:
            'CSS class for the inner scrollable content area (useful for padding).',
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: 'Inline styles for the outer wrapper div.',
        },
      ],
      notes: [
        'Use React.forwardRef with ChatContainerRef to access imperative methods: scrollToBottom(behavior?), scrollToTop(behavior?), scrollToMessage(messageId, behavior?), isAtBottom(), and nativeElement.',
        'The scroll-to-bottom button appears automatically when the user scrolls away from the bottom.',
        'Auto-scroll only engages when the user is within autoScrollThreshold pixels of the bottom, respecting manual scroll position.',
        'Initial render scrolls to the bottom instantly.',
      ],
    },
    {
      name: 'ChatMessages',
      description:
        'A layout component for the messages area that provides consistent gap and padding presets.',
      importPath: '@clarity-chat/react',
      usageCode: `<ChatMessages gap="md" padding="lg">
  {messages.map((msg) => (
    <MessageBubble key={msg.id} message={msg} />
  ))}
</ChatMessages>`,
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'Message elements to render inside the messages area.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class name.',
          commonlyUsed: true,
        },
        {
          name: 'gap',
          type: "'sm' | 'md' | 'lg'",
          default: '"md"',
          description:
            'Vertical gap between messages: sm (gap-2), md (gap-4), lg (gap-6).',
          commonlyUsed: true,
        },
        {
          name: 'padding',
          type: "'sm' | 'md' | 'lg' | 'none'",
          default: '"md"',
          description:
            'Padding around the messages area: none, sm (p-2), md (p-4), lg (p-6).',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Use inside ChatContainer for the best experience with auto-scroll.',
        'Renders a flex column layout, so children stack vertically with the specified gap.',
      ],
    },
    {
      name: 'ChatComposerArea',
      description:
        'A layout wrapper for the input/composer area at the bottom of a chat. Supports multiple positioning variants including fixed, floating, and inline.',
      importPath: '@clarity-chat/react',
      usageCode: `<ChatComposerArea variant="fixed">
  <Sender
    value={input}
    onChange={setInput}
    onSubmit={handleSend}
  />
</ChatComposerArea>`,
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description:
            'The input component(s) to render inside the composer area.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class name.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: "'default' | 'floating' | 'fixed' | 'inline'",
          default: '"default"',
          description:
            'Layout variant: "default" has a top border and padding, "floating" is absolutely positioned above content, "fixed" is sticky at the bottom with a blurred background, "inline" has only padding.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'The "floating" variant uses absolute positioning; ensure the parent has position: relative.',
        'The "fixed" variant uses sticky positioning with backdrop-blur for a frosted-glass effect.',
        'Typically used together with ChatContainer and ChatMessages for a complete chat layout.',
      ],
    },
  ],

  // ===========================================================================
  // ExpandableChat
  // ===========================================================================
  ExpandableChat: [
    {
      name: 'ExpandableChat',
      description:
        'A complete floating chat widget with a trigger button, expandable panel, message display, typing indicator, avatars, and input. Ideal for embedding support chat on websites.',
      importPath: '@clarity-chat/react',
      usageCode: `<ExpandableChat
  messages={chatMessages}
  onSendMessage={(msg) => sendMessage(msg)}
  onClearChat={() => clearChat()}
  title="Chat Support"
  subtitle="We typically reply within minutes"
  placeholder="Type your message..."
  assistantName="Clarity Bot"
  assistantAvatar="/bot-avatar.png"
  userName="User"
  position="bottom-right"
  defaultOpen={false}
  showAttachment
  showVoice={false}
  isLoading={isGenerating}
  headerExtra={<StatusBadge />}
  footerExtra={<PoweredBy />}
/>`,
      props: [
        {
          name: 'messages',
          type: 'ChatMessage[]',
          default: '[]',
          description:
            'Array of chat messages. Each ChatMessage has id, role ("user" | "assistant"), content, and optional timestamp.',
          commonlyUsed: true,
        },
        {
          name: 'onSendMessage',
          type: '(message: string) => void',
          description: 'Callback when the user sends a message from the input.',
          commonlyUsed: true,
        },
        {
          name: 'onClearChat',
          type: '() => void',
          description:
            'Callback to clear the chat. When provided, a "Clear chat" option appears in the header dropdown menu.',
        },
        {
          name: 'title',
          type: 'string',
          default: '"Chat Support"',
          description: 'Title displayed in the chat panel header.',
          commonlyUsed: true,
        },
        {
          name: 'subtitle',
          type: 'string',
          default: '"We typically reply within minutes"',
          description:
            'Subtitle/description displayed below the title in the header.',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Type your message..."',
          description: 'Placeholder text for the message input.',
          commonlyUsed: true,
        },
        {
          name: 'assistantName',
          type: 'string',
          default: '"Assistant"',
          description:
            'Display name for the assistant. Used for the avatar fallback initial.',
        },
        {
          name: 'assistantAvatar',
          type: 'string',
          description: 'URL of the assistant avatar image.',
        },
        {
          name: 'userName',
          type: 'string',
          default: '"You"',
          description:
            'Display name for the user. Used for the avatar fallback initial.',
        },
        {
          name: 'userAvatar',
          type: 'string',
          description: 'URL of the user avatar image.',
        },
        {
          name: 'position',
          type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
          default: '"bottom-right"',
          description:
            'Screen corner where the floating button and panel are positioned.',
          commonlyUsed: true,
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: 'Whether the chat panel is open on initial render.',
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          default: 'false',
          description:
            'Whether the chat panel starts in the expanded size (480x600) vs default (380x500).',
        },
        {
          name: 'triggerIcon',
          type: 'React.ReactNode',
          description:
            'Custom icon for the floating trigger button. Defaults to a MessageCircle icon.',
        },
        {
          name: 'headerExtra',
          type: 'React.ReactNode',
          description:
            'Additional content rendered in the header bar next to the default controls.',
        },
        {
          name: 'footerExtra',
          type: 'React.ReactNode',
          description:
            'Additional content rendered between the messages and the input area (e.g. "Powered by..." text).',
        },
        {
          name: 'showAttachment',
          type: 'boolean',
          default: 'true',
          description: 'Show the paperclip attachment button beside the input.',
        },
        {
          name: 'showVoice',
          type: 'boolean',
          default: 'false',
          description:
            'Show a microphone voice input button. Only visible when the input is empty.',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description:
            'Shows a typing indicator (bouncing dots) in the messages area and disables the send button.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'CSS class for the outermost fixed-position wrapper.',
          commonlyUsed: true,
        },
        {
          name: 'triggerClassName',
          type: 'string',
          description: 'CSS class for the floating trigger button.',
        },
        {
          name: 'panelClassName',
          type: 'string',
          description: 'CSS class for the chat panel container.',
        },
      ],
      notes: [
        'The panel opens with a scale+opacity animation and can be expanded/minimized via the header dropdown.',
        'Auto-scrolls to the latest message when new messages are added.',
        'Focuses the input textarea automatically when the panel is opened.',
        'User messages appear on the right with the primary color; assistant messages on the left with muted background.',
        'Message timestamps are displayed if provided in the ChatMessage objects.',
      ],
    },
    {
      name: 'FloatingChatButton',
      description:
        'A standalone floating action button for triggering a chat panel. Supports unread count badges and smooth scale transitions.',
      importPath: '@clarity-chat/react',
      usageCode: `<FloatingChatButton
  onClick={() => setIsOpen(true)}
  isOpen={isOpen}
  icon={<MessageCircle className="h-6 w-6" />}
  unreadCount={3}
  position="bottom-right"
/>`,
      props: [
        {
          name: 'onClick',
          type: '() => void',
          required: true,
          description: 'Callback when the button is clicked.',
          commonlyUsed: true,
        },
        {
          name: 'isOpen',
          type: 'boolean',
          required: true,
          description:
            'Whether the chat panel is currently open. When true, the button scales to zero and becomes invisible.',
          commonlyUsed: true,
        },
        {
          name: 'icon',
          type: 'React.ReactNode',
          description: 'Custom icon element. Defaults to a MessageCircle icon.',
        },
        {
          name: 'unreadCount',
          type: 'number',
          default: '0',
          description:
            'Number of unread messages. When > 0 and the panel is closed, shows a red badge. Displays "9+" for counts above 9.',
        },
        {
          name: 'position',
          type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
          default: '"bottom-right"',
          description: 'Screen corner where the button is fixed.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class name for the button.',
        },
      ],
      notes: [
        'The button is fixed-positioned (z-50) and has a shadow plus hover scale effect.',
        'When isOpen is true, the button animates out with scale-0 and opacity-0.',
        'Use this component independently when you want full control over the chat panel.',
      ],
    },
    {
      name: 'ChatWidget',
      description:
        'A flexible floating chat widget wrapper that provides the panel shell (header, body, footer) without built-in message handling. Use this when you want full control over the chat content while retaining the floating panel UI.',
      importPath: '@clarity-chat/react',
      usageCode: `<ChatWidget
  title="Help Center"
  position="bottom-right"
  defaultOpen={false}
  triggerIcon={<HelpCircle />}
  header={<CustomHeader />}
  footer={<CustomFooter />}
>
  <MyCustomChatContent />
</ChatWidget>`,
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description:
            'The main content rendered inside the panel body (fills the flex-1 area).',
          commonlyUsed: true,
        },
        {
          name: 'header',
          type: 'React.ReactNode',
          description:
            'Custom header content. When omitted, a default header with the title and expand/close controls is rendered.',
        },
        {
          name: 'footer',
          type: 'React.ReactNode',
          description:
            'Custom footer content rendered below the main content area.',
        },
        {
          name: 'title',
          type: 'string',
          default: '"Chat"',
          description:
            'Title displayed in the default header. Ignored when a custom header is provided.',
          commonlyUsed: true,
        },
        {
          name: 'position',
          type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
          default: '"bottom-right"',
          description: 'Screen corner for the floating widget.',
          commonlyUsed: true,
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: 'Whether the widget is open on initial render.',
          commonlyUsed: true,
        },
        {
          name: 'triggerIcon',
          type: 'React.ReactNode',
          description:
            'Custom icon for the floating trigger button. Defaults to a MessageCircle icon.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'CSS class for the outermost fixed-position wrapper.',
        },
        {
          name: 'triggerClassName',
          type: 'string',
          description: 'CSS class for the floating trigger button.',
        },
        {
          name: 'panelClassName',
          type: 'string',
          description: 'CSS class for the panel container.',
        },
      ],
      notes: [
        'ChatWidget extends ExpandableChatProps but omits messages and onSendMessage, making it a pure UI shell.',
        'The default header includes an expand/minimize toggle and a close button.',
        'Expanded size is 480x600; default size is 380x500.',
        'Combine with ChatContainer, ChatMessages, and Sender for a fully custom chat experience inside the widget shell.',
      ],
    },
    {
      name: 'ChatPopover',
      description:
        'An alternative popover-style chat UI that opens relative to a trigger element rather than as a fixed floating panel. Supports controlled and uncontrolled open state.',
      importPath: '@clarity-chat/react',
      usageCode: `<ChatPopover
  trigger={<Button>Open Chat</Button>}
  title="Quick Chat"
  side="top"
  align="end"
>
  <div className="p-4">
    <ChatMessages>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </ChatMessages>
    <Sender onSubmit={handleSend} />
  </div>
</ChatPopover>`,
      props: [
        {
          name: 'trigger',
          type: 'React.ReactNode',
          required: true,
          description:
            'The element that toggles the popover open/closed when clicked.',
          commonlyUsed: true,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'Content rendered inside the popover panel.',
          commonlyUsed: true,
        },
        {
          name: 'title',
          type: 'string',
          description:
            'Optional title displayed in a header bar at the top of the popover with a close button.',
          commonlyUsed: true,
        },
        {
          name: 'open',
          type: 'boolean',
          description:
            'Controlled open state. When provided, the component is fully controlled.',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description:
            'Callback when the open state changes. Required for controlled usage.',
        },
        {
          name: 'side',
          type: "'top' | 'bottom'",
          default: '"top"',
          description:
            'Which side of the trigger the popover opens on. "top" opens above, "bottom" opens below.',
          commonlyUsed: true,
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          default: '"end"',
          description:
            'Horizontal alignment of the popover relative to the trigger.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class name for the popover panel.',
        },
      ],
      notes: [
        'The popover has a fixed width of 360px and includes entry animations (fade + zoom + slide).',
        'Clicking outside the popover closes it via an invisible backdrop overlay.',
        'Can be used as a controlled component (open + onOpenChange) or uncontrolled (manages its own state).',
        'When a title is provided, a header bar with the title and a close button is rendered.',
      ],
    },
  ],
}
