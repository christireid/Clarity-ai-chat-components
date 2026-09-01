import type { ComponentDoc } from '@/components/doc-panel'

export const inputDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  'AI Textarea': {
    name: 'AdvancedChatInput',
    description:
      'Feature-rich chat input with AI-powered autocomplete, @mention and /command suggestion popups, file upload via drag-and-drop, and inline character counting. Uses React 19 ref-as-prop pattern and concurrent features for non-blocking suggestion updates.',
    importPath: '@clarity-chat/react',
    usageCode: `<AdvancedChatInput
  value={message}
  onChange={(val) => setMessage(val)}
  onSubmit={(text, attachments) => {
    sendMessage(text, attachments)
  }}
  onSuggestionRequest={async (query, trigger) => {
    const res = await fetch(\`/api/suggest?q=\${query}&t=\${trigger}\`)
    return res.json()
  }}
  onFileUpload={async (files) => {
    const formData = new FormData()
    files.forEach((f) => formData.append('files', f))
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    return res.json()
  }}
  savedPrompts={prompts}
  placeholder="Type a message... Use @ for prompts, / for commands"
  maxLength={4000}
  maxFiles={5}
/>`,
    props: [
      {
        name: 'value',
        type: 'string',
        required: true,
        description: 'The current text value of the input.',
        commonlyUsed: true,
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        required: true,
        description: 'Callback fired when the text value changes.',
        commonlyUsed: true,
      },
      {
        name: 'onSubmit',
        type: '(value: string, attachments?: MessageAttachment[]) => void',
        required: true,
        description:
          'Callback fired when the user submits (Enter key or send button). Receives the text and any attached files.',
        commonlyUsed: true,
      },
      {
        name: 'suggestions',
        type: 'InputSuggestion[]',
        description:
          'Static array of autocomplete suggestions to display. Overridden when onSuggestionRequest is provided.',
      },
      {
        name: 'onSuggestionRequest',
        type: "(query: string, trigger: '@' | '/') => Promise<InputSuggestion[]>",
        description:
          'Async callback for fetching suggestions dynamically. Called with the current query and the trigger character (@ or /).',
        commonlyUsed: true,
      },
      {
        name: 'onFileUpload',
        type: '(files: File[]) => Promise<MessageAttachment[]>',
        description:
          'Async callback for handling file uploads. When omitted, files are converted to object URLs locally.',
        commonlyUsed: true,
      },
      {
        name: 'maxFiles',
        type: 'number',
        default: '5',
        description: 'Maximum number of file attachments allowed.',
      },
      {
        name: 'acceptedFileTypes',
        type: 'string[]',
        default: "['image/*', 'application/pdf', '.txt', '.doc', '.docx']",
        description: 'MIME types and extensions accepted by the file input.',
      },
      {
        name: 'onLinkPaste',
        type: '(url: string) => Promise<{ title: string; description?: string; image?: string }>',
        description:
          'Async callback for generating a link preview when a URL is pasted into the input.',
      },
      {
        name: 'savedPrompts',
        type: 'SavedPrompt[]',
        description:
          'Array of saved prompts surfaced as @mention suggestions when no custom onSuggestionRequest is provided.',
      },
      {
        name: 'onPromptSelect',
        type: '(prompt: SavedPrompt) => void',
        description:
          'Callback fired when a saved prompt is selected from suggestions.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the input and all action buttons.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Type a message... Use @ for prompts, / for commands"',
        description: 'Placeholder text shown when the input is empty.',
        commonlyUsed: true,
      },
      {
        name: 'maxLength',
        type: 'number',
        description:
          'Maximum character count. When set, a character counter is displayed and the border turns destructive on overflow.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
      {
        name: 'ref',
        type: 'React.Ref<HTMLTextAreaElement>',
        description:
          'React 19 ref-as-prop for the underlying textarea element. Replaces the legacy forwardRef pattern.',
      },
    ],
    notes: [
      'Uses React useTransition to keep suggestion updates non-blocking during typing.',
      'Suggestion queries are debounced at 150ms to avoid excessive API calls.',
      'Built-in /help, /clear, /export, and /model default commands are shown when no onSuggestionRequest callback is provided.',
      'Keyboard shortcuts: Enter to submit, Shift+Enter for newline, Tab/Enter to accept a suggestion, Arrow keys to navigate suggestions, Escape to close the popup.',
      'File attachments support drag-and-drop onto the input area.',
    ],
  },

  'Voice Input': {
    name: 'VoiceInput',
    description:
      'Production-ready voice input component powered by the Web Speech API. Features one-click recording with animated pulse feedback, real-time transcription display, confidence scoring, auto-submit on speech end, and multi-language support.',
    importPath: '@clarity-chat/react',
    usageCode: `<VoiceInput
  onTranscript={(text) => {
    sendMessage(text)
  }}
  lang="en-US"
  size="md"
  variant="primary"
  showInterim
  autoSubmit
  onStart={() => console.log('Recording started')}
  onStop={() => console.log('Recording stopped')}
  onError={(err) => console.error('Voice error:', err)}
/>`,
    props: [
      {
        name: 'onTranscript',
        type: '(transcript: string) => void',
        required: true,
        description:
          'Callback fired when a transcript is finalized. When autoSubmit is true this fires automatically on speech end; otherwise it fires on manual send.',
        commonlyUsed: true,
      },
      {
        name: 'lang',
        type: 'string',
        default: '"en-US"',
        description:
          'BCP 47 language code for speech recognition (e.g. "en-US", "es-ES", "fr-FR").',
        commonlyUsed: true,
      },
      {
        name: 'showInterim',
        type: 'boolean',
        default: 'true',
        description:
          'Show real-time interim transcription results as the user speaks.',
        commonlyUsed: true,
      },
      {
        name: 'autoSubmit',
        type: 'boolean',
        default: 'true',
        description:
          'Automatically submit the transcript when speech ends. When false, a manual Send button is shown.',
        commonlyUsed: true,
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: '"md"',
        description: 'Size of the microphone toggle button.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost'",
        default: '"ghost"',
        description: 'Visual variant of the microphone toggle button.',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        description:
          'Custom icon displayed when the component is not listening.',
      },
      {
        name: 'listeningIcon',
        type: 'ReactNode',
        description: 'Custom icon displayed while actively listening.',
      },
      {
        name: 'showTooltip',
        type: 'boolean',
        default: 'true',
        description:
          'Show a hover tooltip on the microphone button when not recording.',
      },
      {
        name: 'tooltipText',
        type: 'string',
        default: '"Click to speak"',
        description: 'Text content of the hover tooltip.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the voice input button.',
      },
      {
        name: 'className',
        type: 'string',
        default: '""',
        description: 'Additional CSS class names for the root container.',
      },
      {
        name: 'onStart',
        type: '() => void',
        description: 'Callback fired when speech recognition starts listening.',
      },
      {
        name: 'onStop',
        type: '() => void',
        description: 'Callback fired when speech recognition stops listening.',
      },
      {
        name: 'onError',
        type: '(error: string) => void',
        description:
          'Callback fired when a speech recognition error occurs. Receives a human-readable error message.',
      },
    ],
    notes: [
      'Requires browser support for the Web Speech API. A fallback message is rendered when the API is unavailable.',
      'The transcript popup appears above the button and includes a waveform visualization, interim/final text, and a confidence bar.',
      'Pulse ring animations are automatically disabled when the user prefers reduced motion.',
      'Also exports InlineVoiceInput, a companion component that integrates the voice button inside or beside a text input field.',
    ],
  },

  'File Upload': {
    name: 'FileUpload',
    description:
      'Drag-and-drop file upload component with per-file validation, progress indicators, animated file list, and automatic file-type icon assignment. Supports click-to-browse and drag-over visual feedback.',
    importPath: '@clarity-chat/react',
    usageCode: `<FileUpload
  onUpload={async (files) => {
    const formData = new FormData()
    files.forEach((f) => formData.append('files', f))
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    return res.json()
  }}
  maxFiles={10}
  maxFileSize={10 * 1024 * 1024}
  acceptedFileTypes={['image/*', 'application/pdf', '.txt', '.doc', '.docx', 'video/*']}
/>`,
    props: [
      {
        name: 'onUpload',
        type: '(files: File[]) => Promise<MessageAttachment[]>',
        required: true,
        description:
          'Async callback that receives the selected files and should return an array of MessageAttachment objects after uploading.',
        commonlyUsed: true,
      },
      {
        name: 'maxFiles',
        type: 'number',
        default: '10',
        description: 'Maximum number of files that can be queued for upload.',
        commonlyUsed: true,
      },
      {
        name: 'maxFileSize',
        type: 'number',
        default: '10485760',
        description:
          'Maximum file size in bytes (default 10 MB). Files exceeding this limit are rejected with an error message.',
        commonlyUsed: true,
      },
      {
        name: 'acceptedFileTypes',
        type: 'string[]',
        default:
          "['image/*', 'application/pdf', '.txt', '.doc', '.docx', 'video/*']",
        description:
          'Array of MIME types and file extensions accepted by the file input and drop zone.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
    ],
    notes: [
      'The drop zone visually elevates and highlights with the primary color on drag-over.',
      'Each queued file shows an auto-detected icon (image, video, audio, PDF, Word, spreadsheet, or generic).',
      'Files can be individually removed from the queue before uploading.',
      'An error banner appears for validation failures (file too large, too many files).',
      'Animations respect the prefers-reduced-motion media query.',
    ],
  },

  Mentions: [
    {
      name: 'MentionInput',
      description:
        'Text input with @mention autocomplete for users. Supports fuzzy search, keyboard navigation, visual mention highlighting, and automatic mention extraction from the input value.',
      importPath: '@clarity-chat/react',
      usageCode: `<MentionInput
  users={[
    { id: '1', name: 'Alice Johnson', username: 'alice', role: 'Developer', isOnline: true },
    { id: '2', name: 'Bob Smith', username: 'bob', role: 'Designer' },
    { id: '3', name: 'Carol Williams', username: 'carol', role: 'PM', isOnline: true },
  ]}
  value={message}
  onChange={(value, mentions) => {
    setMessage(value)
    setMentions(mentions)
  }}
  onSubmit={() => sendMessage()}
  placeholder="Type @ to mention someone..."
  enableFuzzySearch
/>`,
      props: [
        {
          name: 'users',
          type: 'MentionableUser[]',
          required: true,
          description:
            'Array of users available for mentioning. Each user has id, name, username, and optional role, avatar, and isOnline fields.',
          commonlyUsed: true,
        },
        {
          name: 'value',
          type: 'string',
          required: true,
          description: 'The current text value of the input.',
          commonlyUsed: true,
        },
        {
          name: 'onChange',
          type: '(value: string, mentions: Mention[]) => void',
          required: true,
          description:
            'Callback fired on every input change. Receives the new text value and an array of extracted Mention objects.',
          commonlyUsed: true,
        },
        {
          name: 'onSubmit',
          type: '() => void',
          description:
            'Callback fired when Enter is pressed (without Shift) and the suggestion popup is closed.',
          commonlyUsed: true,
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Type @ to mention..."',
          description: 'Placeholder text shown in the textarea.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the textarea.',
        },
        {
          name: 'mentionTrigger',
          type: 'string',
          default: '"@"',
          description:
            'The character that triggers the mention autocomplete popup.',
        },
        {
          name: 'enableFuzzySearch',
          type: 'boolean',
          default: 'true',
          description:
            'Enable fuzzy matching when filtering users. When false, simple substring matching is used.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
      ],
      notes: [
        'Keyboard shortcuts: Arrow Up/Down to navigate suggestions, Enter or Tab to insert a mention, Escape to close the popup.',
        'The suggestion dropdown appears above the input and scrolls the selected item into view automatically.',
        'Mentions are extracted using a regex based on the mentionTrigger character and matched against user usernames.',
        'The MentionableUser interface includes id (string), name (string), username (string), and optional role, avatar, and isOnline.',
        'The Mention interface includes id, userId, messageId, position, length, isRead, and timestamp.',
      ],
    },
    {
      name: 'MentionList',
      description:
        'Displays a filterable list of mentions for a specific user, with unread indicators, mark-as-read actions, and click-to-navigate. Useful for notification panels and mention inboxes.',
      importPath: '@clarity-chat/react',
      usageCode: `<MentionList
  mentions={mentions}
  messages={messagesMap}
  users={usersMap}
  currentUserId="user-123"
  onMentionClick={(mention) => {
    scrollToMessage(mention.messageId)
  }}
  onMarkAsRead={(mentionId) => {
    markMentionAsRead(mentionId)
  }}
  showOnlyUnread={false}
/>`,
      props: [
        {
          name: 'mentions',
          type: 'Mention[]',
          required: true,
          description: 'Array of all mentions across the conversation.',
          commonlyUsed: true,
        },
        {
          name: 'messages',
          type: 'Map<string, { content: string; timestamp: number }>',
          required: true,
          description:
            'Map of message IDs to their content and timestamp, used to display context for each mention.',
          commonlyUsed: true,
        },
        {
          name: 'users',
          type: 'Map<string, MentionableUser>',
          required: true,
          description:
            'Map of user IDs to MentionableUser objects, used to render avatars and names.',
          commonlyUsed: true,
        },
        {
          name: 'currentUserId',
          type: 'string',
          required: true,
          description:
            'The ID of the current user. Only mentions targeting this user are displayed.',
          commonlyUsed: true,
        },
        {
          name: 'onMentionClick',
          type: '(mention: Mention) => void',
          description:
            'Callback fired when a mention card is clicked. Typically used to navigate to the source message.',
          commonlyUsed: true,
        },
        {
          name: 'onMarkAsRead',
          type: '(mentionId: string) => void',
          description:
            'Callback fired when the "Mark as read" button is clicked on an unread mention.',
          commonlyUsed: true,
        },
        {
          name: 'showOnlyUnread',
          type: 'boolean',
          default: 'false',
          description:
            'When true, only unread mentions are shown and the All/Unread toggle is hidden.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
      ],
      notes: [
        'Mentions are sorted by timestamp with the newest first.',
        'Unread mentions are visually distinguished with a primary-colored left border and accent background.',
        'The header shows a count of unread mentions and an All/Unread filter toggle (unless showOnlyUnread is set).',
        'Also exports a useMentions() hook that provides addMention, markAsRead, getUnreadCount, and getMentionsForUser helpers.',
      ],
    },
  ],

  'Rich Text': {
    name: 'PromptComposer',
    description:
      'Full-featured prompt composer with progressive disclosure, token budget visualization, @mention context items, slash command palette, smart suggestion chips, auto-expanding textarea, drag-drop file attachments, and inline voice input.',
    importPath: '@clarity-chat/react',
    usageCode: `<PromptComposer
  api="/api/chat"
  placeholder="Ask anything..."
  showTokenBudget
  showTokenSavings
  showContextBreakdown
  tokenBudget={8000}
  suggestions={[
    { id: '1', type: 'starter', text: 'Explain this code' },
    { id: '2', type: 'starter', text: 'Write a unit test' },
  ]}
  onSuggestionClick={(s) => console.log('Suggestion:', s)}
  commands={[
    { id: '1', trigger: '/search', label: 'Search', description: 'Search codebase', icon: '🔍', execute: () => {} },
  ]}
  onSubmit={(message) => console.log('Submit:', message)}
  features={{
    attachments: { maxFiles: 5, maxSize: 10 * 1024 * 1024 },
    voice: { lang: 'en-US' },
    context: { triggers: ['@'], providers: [], fuzzySearch: true },
  }}
  behavior={{ expandOnFocus: true, enableMarkdown: true }}
/>`,
    props: [
      {
        name: 'api',
        type: 'string',
        required: true,
        description: 'API endpoint for the chat backend.',
        commonlyUsed: true,
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Ask anything..."',
        description: 'Placeholder text shown in the textarea.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
      {
        name: 'showTokenBudget',
        type: 'boolean',
        default: 'true',
        description:
          'Show the token budget indicator. In collapsed mode a compact counter appears; in expanded mode a full progress bar is rendered.',
        commonlyUsed: true,
      },
      {
        name: 'showTokenSavings',
        type: 'boolean',
        default: 'false',
        description:
          'Show token savings information in the expanded token budget indicator.',
      },
      {
        name: 'showContextBreakdown',
        type: 'boolean',
        default: 'false',
        description:
          'Show a per-context-item token breakdown in the expanded token budget indicator.',
      },
      {
        name: 'suggestions',
        type: 'Suggestion[]',
        default: '[]',
        description:
          'Array of suggestion chips displayed when the input is focused and empty. Each suggestion has id, type, text, and optional description, icon, category, confidence, and metadata.',
        commonlyUsed: true,
      },
      {
        name: 'onSuggestionClick',
        type: '(suggestion: Suggestion) => void',
        description: 'Callback fired when a suggestion chip is clicked.',
      },
      {
        name: 'commands',
        type: 'Command[]',
        default: '[]',
        description:
          'Array of slash commands available via the command palette. Each command has id, trigger, label, description, icon, and execute function.',
        commonlyUsed: true,
      },
      {
        name: 'onCommandExecute',
        type: '(command: Command, args?: string) => void',
        description:
          'Callback fired when a slash command is executed, after the internal command handler runs.',
      },
      {
        name: 'features',
        type: '{ suggestions?: boolean | SuggestionsConfig; commands?: boolean | CommandsConfig; context?: boolean | ContextConfig; attachments?: boolean | AttachmentsConfig; settings?: boolean | Partial<PromptSettings>; voice?: boolean | { lang: string } }',
        description:
          'Feature flags for progressive disclosure. Each feature can be a boolean toggle or a detailed config object. Controls suggestions, commands, context mentions, attachments, settings panel, and voice input.',
        commonlyUsed: true,
      },
      {
        name: 'tokenBudget',
        type: 'number',
        default: '8000',
        description:
          'Total token budget for the prompt including all context items.',
      },
      {
        name: 'tokenBudgets',
        type: 'Record<ContextType, ContextTokenBudget>',
        description:
          'Per-context-type token budgets for summary, preview, and full detail levels. ContextType is "file" | "doc" | "user" | "web" | "memory".',
      },
      {
        name: 'behavior',
        type: '{ autoSubmit?: boolean; expandOnFocus?: boolean; showShortcuts?: boolean; enableMarkdown?: boolean; expandThreshold?: number }',
        description:
          'Behavioral settings. expandThreshold defaults to 100 characters before the input auto-expands to multiline.',
      },
      {
        name: 'onSubmit',
        type: '(message: PromptMessage) => void | Promise<void>',
        description:
          'Callback fired when the user submits. The PromptMessage includes content, contextItems, attachments, and metadata with totalTokens and timestamp.',
        commonlyUsed: true,
      },
      {
        name: 'onStateChange',
        type: '(state: PromptComposerState) => void',
        description:
          'Callback fired on every internal state change. Useful for syncing external UI.',
      },
      {
        name: 'onTokenUsageChange',
        type: '(usage: number) => void',
        description: 'Callback fired when token usage ratio (0-1) changes.',
      },
    ],
    notes: [
      'Progressive disclosure: the composer starts collapsed (single line) and expands as the user adds context, types beyond the threshold, or focuses the input.',
      'Context items support three detail levels -- summary (50 tokens), preview (200 tokens), and full -- achieving up to 90% token savings.',
      'The command palette activates when the user types "/" and supports keyboard navigation (Arrow keys, Enter, Escape).',
      'Submit is triggered by Enter (Shift+Enter for newline). The input clears automatically after submission.',
      'Internally uses the usePromptComposer hook which manages state, token counting, and progressive context expansion.',
    ],
  },

  'Keyboard Shortcuts': {
    name: 'KeyboardShortcutsModal',
    description:
      'A searchable, keyboard-navigable modal for discovering and browsing keyboard shortcuts. Features fuzzy search, category grouping, platform-aware key display (macOS vs Windows/Linux), sequence shortcut indicators, and focus trap with focus restoration on close.',
    importPath: '@clarity-chat/react',
    usageCode: `<KeyboardShortcutsModal
  open={isShortcutsOpen}
  onClose={() => setIsShortcutsOpen(false)}
  shortcuts={[
    { id: '1', keys: 'mod+enter', description: 'Send message', category: 'Chat' },
    { id: '2', keys: 'mod+k', description: 'Open command palette', category: 'Navigation' },
    { id: '3', keys: 'mod+/', description: 'Show keyboard shortcuts', category: 'Help' },
    { id: '4', keys: 'mod+b', description: 'Bold text', category: 'Edit' },
    { id: '5', keys: 'mod+i', description: 'Italic text', category: 'Edit' },
    { id: '6', keys: 'Escape', description: 'Cancel / Close', category: 'General' },
    { id: '7', keys: 'Tab', description: 'Accept suggestion', category: 'Chat' },
    { id: '8', keys: ['ArrowUp ArrowUp'], description: 'Edit last message', category: 'Chat', isSequence: true },
  ]}
  title="Keyboard Shortcuts"
/>`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description: 'Whether the modal is currently open.',
        commonlyUsed: true,
      },
      {
        name: 'onClose',
        type: '() => void',
        required: true,
        description:
          'Callback fired when the modal should close (backdrop click, Escape key, or close button).',
        commonlyUsed: true,
      },
      {
        name: 'shortcuts',
        type: 'ShortcutItem[]',
        required: true,
        description:
          'Array of shortcuts to display. Each item has id (string), keys (string | string[]), description (string), and optional category (string) and isSequence (boolean).',
        commonlyUsed: true,
      },
      {
        name: 'title',
        type: 'string',
        default: '"Keyboard Shortcuts"',
        description: 'Title displayed in the modal header.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the modal container.',
      },
    ],
    notes: [
      'Shortcuts are grouped by their category field and sorted in a predefined order: General, Navigation, Chat, Edit, Help.',
      'The search input supports fuzzy matching across description, category, and key names.',
      'Key display is platform-aware: "mod" renders as Cmd on macOS and Ctrl on Windows/Linux.',
      'The keys prop supports multiple alternatives (string[]) shown with "or" separators, and sequence shortcuts shown with "then" separators.',
      'Focus is trapped inside the modal and restored to the previously focused element on close.',
      'Keyboard navigation: Arrow Up/Down to highlight shortcuts, Escape to clear search or close.',
    ],
  },
}
