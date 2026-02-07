import type { ComponentDoc } from '@/components/doc-panel'

export const messagesDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // Message Bubble Variants
  // ===========================================================================
  'Message Bubble Variants': [
    {
      name: 'MessageBubble',
      description:
        'Modern, accessible message bubble component with role-based styling, streaming support, avatars, timestamps, and entrance animations.',
      importPath: '@clarity-chat/react',
      usageCode: `<MessageBubble
  role="assistant"
  avatar={{ src: '/ai-avatar.png', alt: 'AI' }}
  timestamp={new Date()}
  isStreaming={false}
>
  Here is what I found for you.
</MessageBubble>`,
      props: [
        {
          name: 'role',
          type: 'MessageRole',
          required: true,
          description: 'Message role determines styling.',
          commonlyUsed: true,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'Message content.',
          commonlyUsed: true,
        },
        {
          name: 'avatar',
          type: 'MessageAvatar',
          description:
            'Avatar configuration object with src, alt, fallback, and component fields.',
          commonlyUsed: true,
        },
        {
          name: 'showAvatar',
          type: 'boolean',
          default: 'true for assistant, false for user',
          description: 'Show avatar next to the message.',
        },
        {
          name: 'timestamp',
          type: 'Date | string',
          description: 'Message timestamp displayed below the bubble.',
          commonlyUsed: true,
        },
        {
          name: 'isStreaming',
          type: 'boolean',
          default: 'false',
          description: 'Whether the message is being streamed.',
          commonlyUsed: true,
        },
        {
          name: 'showCursor',
          type: 'boolean',
          default: 'true',
          description: 'Show the streaming cursor while streaming.',
        },
        {
          name: 'cursorChar',
          type: 'string',
          default: '"\\u25CB"',
          description: 'Custom cursor character displayed during streaming.',
        },
        {
          name: 'id',
          type: 'string',
          description: 'Message ID for accessibility and DOM targeting.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class for the outer container.',
        },
        {
          name: 'bubbleClassName',
          type: 'string',
          description: 'Additional CSS class for the bubble element.',
        },
        {
          name: 'disableAnimation',
          type: 'boolean',
          default: 'false',
          description: 'Disable the entrance animation.',
        },
        {
          name: 'renderContent',
          type: '(content: React.ReactNode) => React.ReactNode',
          description:
            'Render content without the default wrapper for custom rendering.',
        },
        {
          name: 'actions',
          type: 'React.ReactNode',
          description: 'Actions to show on hover below the bubble.',
          commonlyUsed: true,
        },
        {
          name: 'error',
          type: 'boolean',
          default: 'false',
          description: 'Display the message in an error state.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Display a skeleton loading state instead of content.',
        },
      ],
      notes: [
        'Uses CSS classes from globals.css (message, message-bubble-user, etc.) for consistent styling.',
        'Respects prefers-reduced-motion via the useReducedMotion hook.',
        'Entrance animation uses Framer Motion slideUp preset.',
        'The MessageAvatar interface accepts src, alt, fallback (text), or a custom component ReactNode.',
      ],
      sourceFile: 'components/clarity/message.tsx',
    },
    {
      name: 'UserMessage',
      description:
        'Pre-configured MessageBubble for user messages. Accepts all MessageBubble props except role.',
      importPath: '@clarity-chat/react',
      usageCode: `<UserMessage timestamp={new Date()}>
  Hello! Can you help me with a coding question?
</UserMessage>`,
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'Message content.',
          commonlyUsed: true,
        },
        {
          name: 'avatar',
          type: 'MessageAvatar',
          description: 'Avatar configuration.',
        },
        {
          name: 'showAvatar',
          type: 'boolean',
          default: 'false',
          description: 'Show avatar next to the message.',
        },
        {
          name: 'timestamp',
          type: 'Date | string',
          description: 'Message timestamp.',
          commonlyUsed: true,
        },
        {
          name: 'isStreaming',
          type: 'boolean',
          default: 'false',
          description: 'Whether the message is being streamed.',
        },
        {
          name: 'showCursor',
          type: 'boolean',
          default: 'true',
          description: 'Show streaming cursor.',
        },
        {
          name: 'cursorChar',
          type: 'string',
          description: 'Custom cursor character.',
        },
        {
          name: 'id',
          type: 'string',
          description: 'Message ID for accessibility.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class for the container.',
        },
        {
          name: 'bubbleClassName',
          type: 'string',
          description: 'Additional CSS class for the bubble.',
        },
        {
          name: 'disableAnimation',
          type: 'boolean',
          default: 'false',
          description: 'Disable entrance animation.',
        },
        {
          name: 'renderContent',
          type: '(content: React.ReactNode) => React.ReactNode',
          description: 'Custom content render function.',
        },
        {
          name: 'actions',
          type: 'React.ReactNode',
          description: 'Actions shown on hover.',
        },
        {
          name: 'error',
          type: 'boolean',
          default: 'false',
          description: 'Error state.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Loading skeleton state.',
        },
      ],
      notes: [
        'Shorthand for <MessageBubble role="user" .../>.',
        'Inherits all MessageBubble behaviour and styling.',
      ],
      sourceFile: 'components/message/MessageBubble.tsx',
    },
    {
      name: 'AssistantMessage',
      description:
        'Pre-configured MessageBubble for assistant messages. Accepts all MessageBubble props except role.',
      importPath: '@clarity-chat/react',
      usageCode: `<AssistantMessage
  avatar={{ src: '/ai.png', alt: 'AI' }}
  isStreaming={isStreaming}
>
  {streamingContent}
</AssistantMessage>`,
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'Message content.',
          commonlyUsed: true,
        },
        {
          name: 'avatar',
          type: 'MessageAvatar',
          description: 'Avatar configuration.',
          commonlyUsed: true,
        },
        {
          name: 'showAvatar',
          type: 'boolean',
          default: 'true',
          description: 'Show avatar next to the message.',
        },
        {
          name: 'timestamp',
          type: 'Date | string',
          description: 'Message timestamp.',
          commonlyUsed: true,
        },
        {
          name: 'isStreaming',
          type: 'boolean',
          default: 'false',
          description: 'Whether the message is being streamed.',
          commonlyUsed: true,
        },
        {
          name: 'showCursor',
          type: 'boolean',
          default: 'true',
          description: 'Show streaming cursor.',
        },
        {
          name: 'cursorChar',
          type: 'string',
          description: 'Custom cursor character.',
        },
        {
          name: 'id',
          type: 'string',
          description: 'Message ID for accessibility.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class for the container.',
        },
        {
          name: 'bubbleClassName',
          type: 'string',
          description: 'Additional CSS class for the bubble.',
        },
        {
          name: 'disableAnimation',
          type: 'boolean',
          default: 'false',
          description: 'Disable entrance animation.',
        },
        {
          name: 'renderContent',
          type: '(content: React.ReactNode) => React.ReactNode',
          description: 'Custom content render function.',
        },
        {
          name: 'actions',
          type: 'React.ReactNode',
          description: 'Actions shown on hover.',
          commonlyUsed: true,
        },
        {
          name: 'error',
          type: 'boolean',
          default: 'false',
          description: 'Error state.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Loading skeleton state.',
        },
      ],
      notes: [
        'Shorthand for <MessageBubble role="assistant" .../>.',
        'Avatar is shown by default for assistant messages.',
      ],
      sourceFile: 'components/message/MessageBubble.tsx',
    },
    {
      name: 'SystemMessage',
      description:
        'Pre-configured MessageBubble for system messages. Centered layout without avatar. Accepts all MessageBubble props except role.',
      importPath: '@clarity-chat/react',
      usageCode: `<SystemMessage>Session started</SystemMessage>`,
      props: [
        {
          name: 'type',
          type: 'SystemMessageType',
          description: 'The type prop.',
        },
        {
          name: 'title',
          type: 'React.ReactNode',
          description: 'The title prop.',
        },
        {
          name: 'content',
          type: 'React.ReactNode',
          required: true,
          description: 'The content prop.',
        },
        {
          name: 'icon',
          type: 'React.ReactNode',
          description: 'The icon prop.',
        },
        { name: 'timestamp', type: 'Date', description: 'Message timestamp.' },
        {
          name: 'showTimestamp',
          type: 'boolean',
          description: 'The showTimestamp prop.',
        },
        {
          name: 'dismissible',
          type: 'boolean',
          description: 'The dismissible prop.',
        },
        {
          name: 'onDismiss',
          type: '() => void',
          description: 'The onDismiss prop.',
        },
        {
          name: 'action',
          type: '{ label: string onClick: () => void }',
          description: 'The action prop.',
        },
        {
          name: 'variant',
          type: "'default' | 'filled' | 'outlined' | 'subtle'",
          description: 'The variant prop.',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          description: 'The size prop.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class for the container.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'Message content.',
          commonlyUsed: true,
        },
        {
          name: 'avatar',
          type: 'MessageAvatar',
          description: 'Avatar configuration (not shown for system messages).',
        },
        {
          name: 'showAvatar',
          type: 'boolean',
          default: 'false',
          description: 'Show avatar (system messages never display avatars).',
        },
        {
          name: 'isStreaming',
          type: 'boolean',
          default: 'false',
          description: 'Whether the message is being streamed.',
        },
        {
          name: 'showCursor',
          type: 'boolean',
          default: 'true',
          description: 'Show streaming cursor.',
        },
        {
          name: 'cursorChar',
          type: 'string',
          description: 'Custom cursor character.',
        },
        {
          name: 'id',
          type: 'string',
          description: 'Message ID for accessibility.',
        },
        {
          name: 'bubbleClassName',
          type: 'string',
          description: 'Additional CSS class for the bubble.',
        },
        {
          name: 'disableAnimation',
          type: 'boolean',
          default: 'false',
          description: 'Disable entrance animation.',
        },
        {
          name: 'renderContent',
          type: '(content: React.ReactNode) => React.ReactNode',
          description: 'Custom content render function.',
        },
        {
          name: 'actions',
          type: 'React.ReactNode',
          description: 'Actions shown on hover.',
        },
        {
          name: 'error',
          type: 'boolean',
          default: 'false',
          description: 'Error state.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Loading skeleton state.',
        },
      ],
      notes: [
        'Shorthand for <MessageBubble role="system" .../>.',
        'Uses centered layout; avatars are never rendered for system messages.',
      ],
      sourceFile: 'components/clarity/system-message.tsx',
    },
    {
      name: 'MessageGroup',
      description:
        'Container for grouping consecutive messages together with configurable gap spacing.',
      importPath: '@clarity-chat/react',
      usageCode: `<MessageGroup gap="md">
  <AssistantMessage>
    Hello! How can I help?
  </AssistantMessage>
  <AssistantMessage>
    Feel free to ask anything.
  </AssistantMessage>
</MessageGroup>`,
      props: [
        {
          name: 'title',
          type: 'string',
          required: true,
          description: 'The title prop.',
        },
        { name: 'count', type: 'number', description: 'The count prop.' },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          description: 'The defaultExpanded prop.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'Messages to render inside the group.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class.',
        },
        {
          name: 'gap',
          type: "'sm' | 'md' | 'lg'",
          default: '"md"',
          description: 'Gap between messages (sm=0.5rem, md=0.75rem, lg=1rem).',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Uses role="log" and aria-label="Chat messages" for accessibility.',
        'Renders a flex column container with the selected gap.',
      ],
      sourceFile: 'components/clarity/conversation.tsx',
    },
  ],

  // ===========================================================================
  // Streaming Messages
  // ===========================================================================
  'Streaming Messages': {
    name: 'StreamingMessage',
    description:
      'Displays AI responses with support for token-by-token streaming, partial JSON rendering, tool call visualization, thinking steps, citations, error states, and smooth streaming animation.',
    importPath: '@clarity-chat/react',
    usageCode: `<StreamingMessage
  content={streamedText}
  isStreaming={true}
  showThinking={true}
  thinkingSteps={[
    'Analyzing question',
    'Searching knowledge base',
  ]}
  currentThinkingStep="Generating response"
  smoothStreaming={true}
  streamingSpeed="normal"
  onRetry={() => retryLastMessage()}
/>`,
    props: [
      {
        name: 'content',
        type: 'string',
        required: true,
        description: 'Accumulated message content being streamed.',
        commonlyUsed: true,
      },
      {
        name: 'isStreaming',
        type: 'boolean',
        default: 'false',
        description: 'Whether streaming is currently in progress.',
        commonlyUsed: true,
      },
      {
        name: 'toolCalls',
        type: 'ToolCall[]',
        default: '[]',
        description: 'Tool calls made during streaming.',
      },
      {
        name: 'citations',
        type: 'Citation[]',
        default: '[]',
        description: 'Citations and sources to display below content.',
      },
      {
        name: 'thinkingSteps',
        type: 'string[]',
        default: '[]',
        description: 'Completed thinking steps (chain-of-thought).',
      },
      {
        name: 'currentThinkingStep',
        type: 'string',
        description: 'The thinking step currently being processed.',
      },
      {
        name: 'error',
        type: 'string',
        description: 'Error message if streaming failed.',
        commonlyUsed: true,
      },
      {
        name: 'showThinking',
        type: 'boolean',
        default: 'true',
        description: 'Show thinking steps section.',
        commonlyUsed: true,
      },
      {
        name: 'showCitations',
        type: 'boolean',
        default: 'true',
        description: 'Show citations inline below the message.',
      },
      {
        name: 'showTools',
        type: 'boolean',
        default: 'true',
        description: 'Show tool call cards.',
      },
      {
        name: 'onToolApprove',
        type: '(toolCall: ToolCall) => void',
        description: 'Callback when a tool call is approved by the user.',
      },
      {
        name: 'onToolReject',
        type: '(toolCall: ToolCall) => void',
        description: 'Callback when a tool call is rejected by the user.',
      },
      {
        name: 'onRetry',
        type: '() => void',
        description: 'Callback when retry is requested after an error.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        default: '""',
        description: 'Additional CSS class.',
      },
      {
        name: 'smoothStreaming',
        type: 'boolean',
        default: 'false',
        description:
          'Enable smooth text streaming animation. Buffers content and renders at a consistent, readable pace for a polished UX.',
        commonlyUsed: true,
      },
      {
        name: 'streamingSpeed',
        type: "'fast' | 'normal' | 'slow'",
        default: '"normal"',
        description:
          'Speed for smooth streaming in characters per second (fast=120, normal=80, slow=50).',
      },
    ],
    notes: [
      'Automatically detects and renders partial JSON as formatted code blocks.',
      'The streaming cursor uses Framer Motion spring physics for a smooth pulse.',
      'Error display includes a retry button when onRetry is provided.',
      'Tool calls show Approve/Reject buttons when the corresponding callbacks are provided.',
      'Citations display a confidence badge color-coded by score (green >= 90%, blue >= 70%, yellow < 70%).',
      'Smooth streaming uses requestAnimationFrame at 60fps for polished text rendering.',
    ],
    sourceFile: 'components/message/StreamingMessage.tsx',
  },

  // ===========================================================================
  // Typing Indicators
  // ===========================================================================
  'Typing Indicators': [
    {
      name: 'TypingIndicator',
      description:
        'Classic typing indicator with animated dots for chat interfaces. Supports multiple animation variants and optional avatar display.',
      importPath: '@clarity-chat/react',
      usageCode: `{
  isAITyping && (
    <TypingIndicator
      variant="dots"
      label="Assistant is thinking"
      showAvatar={true}
      avatarFallback="AI"
    />
  )
}`,
      props: [
        { name: 'users', type: 'string[]', description: 'The users prop.' },
        {
          name: 'showNames',
          type: 'boolean',
          description: 'The showNames prop.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Custom CSS class name.',
        },
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
          description: 'Avatar image source URL.',
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
            'Custom label text used for the aria-label attribute for screen readers.',
          commonlyUsed: true,
        },
        {
          name: 'variant',
          type: "'dots' | 'pulse' | 'wave'",
          default: '"dots"',
          description: 'Animation variant style for the indicator.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Uses role="status" and aria-live="polite" for accessibility.',
        'Entrance animation uses Framer Motion spring physics (damping: 20, stiffness: 300).',
        'Respects prefers-reduced-motion; falls back to a simple fade-in.',
        'The dots variant maps to the AnimatedDots "bounce" animation internally.',
      ],
      sourceFile: 'components/clarity/collaboration.tsx',
    },
    {
      name: 'ThinkingIndicator',
      description:
        'Rich AI thinking/processing indicator that displays the current stage, topic, progress bar, and estimated time remaining.',
      importPath: '@clarity-chat/react',
      usageCode: `<ThinkingIndicator
  status={{
    stage: 'researching',
    topic: 'TypeScript best practices',
    progress: 0.45,
    startedAt: new Date(),
    estimatedCompletion: new Date(Date.now() + 5000),
  }}
/>`,
      props: [
        {
          name: 'status',
          type: 'AIStatus',
          description:
            'Current AI processing status object with stage, topic, progress, startedAt, and estimatedCompletion fields.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class.',
        },
      ],
      notes: [
        'AIStatus.stage can be "thinking", "researching", "compiling", "generating", or "finalizing".',
        'Each stage has a distinct icon (Bot, Search, File, Sparkles, CheckCircle).',
        'Progress bar is only shown when status.progress is defined (0 to 1 range).',
        'Estimated time remaining is computed from status.estimatedCompletion.',
        'Uses role="status" and aria-live="polite" with a descriptive aria-label.',
        'Icon pulsing rings and animations are disabled when the user prefers reduced motion.',
      ],
      sourceFile: 'components/clarity/thinking-indicator.tsx',
    },
  ],

  // ===========================================================================
  // Message Actions
  // ===========================================================================
  'Message Actions': {
    name: 'MessageActions',
    description:
      'Interactive message action toolbar with copy, feedback (thumbs up/down), edit, delete, regenerate, retry, and stop generation buttons. Role-specific actions and staggered entrance animations.',
    importPath: '@clarity-chat/react',
    usageCode: `<MessageActions
  messageContent={message.content}
  messageId={message.id}
  role="assistant"
  feedbackGiven={null}
  showConfetti={false}
  hasError={false}
  show={isHovered}
  onFeedback={(type, comment) =>
    handleFeedback(type, comment)
  }
  onRegenerate={(id) => regenerate(id)}
  onDelete={(id) => deleteMessage(id)}
/>`,
    props: [
      { name: 'onCopy', type: '() => void', description: 'The onCopy prop.' },
      {
        name: 'onEdit',
        type: '() => void',
        description: 'Callback to edit the message (user messages only).',
      },
      {
        name: 'onRegenerate',
        type: '() => void',
        description:
          'Callback to regenerate the response (assistant messages only).',
        commonlyUsed: true,
      },
      {
        name: 'onDelete',
        type: '() => void',
        description: 'Callback to delete the message.',
      },
      { name: 'className', type: 'string', description: 'The className prop.' },
      {
        name: 'messageContent',
        type: 'string',
        required: true,
        description: 'The text content of the message (used for copy action).',
        commonlyUsed: true,
      },
      {
        name: 'messageId',
        type: 'string',
        required: true,
        description: 'Unique identifier for the message.',
        commonlyUsed: true,
      },
      {
        name: 'role',
        type: "'user' | 'assistant' | 'system'",
        required: true,
        description:
          'Message role. Determines which actions are shown (user: edit/delete, assistant: feedback/regenerate/delete).',
        commonlyUsed: true,
      },
      {
        name: 'feedbackGiven',
        type: "'up' | 'down' | null",
        required: true,
        description:
          'Current feedback state. Highlights the corresponding thumbs button.',
        commonlyUsed: true,
      },
      {
        name: 'showConfetti',
        type: 'boolean',
        required: true,
        description:
          'Whether to show confetti animation on the thumbs-up button.',
      },
      {
        name: 'hasError',
        type: 'boolean',
        required: true,
        description:
          'Whether the message has an error. Shows retry instead of regenerate.',
      },
      {
        name: 'isStreaming',
        type: 'boolean',
        default: 'false',
        description:
          'Whether the message is currently streaming. Shows a stop button for assistant messages.',
      },
      {
        name: 'onFeedback',
        type: "(type: 'up' | 'down', comment?: string) => void",
        required: true,
        description:
          'Callback when feedback is given. Thumbs-down opens a feedback dialog.',
        commonlyUsed: true,
      },
      {
        name: 'onRetry',
        type: '() => void',
        description: 'Callback to retry the message on error.',
      },
      {
        name: 'onStopGeneration',
        type: '() => void',
        description:
          'Callback to stop AI generation. Shows a stop button during streaming.',
      },
      {
        name: 'show',
        type: 'boolean',
        required: true,
        description:
          'Whether the actions toolbar is visible (typically bound to hover state).',
        commonlyUsed: true,
      },
      {
        name: 'alwaysVisible',
        type: 'boolean',
        default: 'false',
        description:
          'Always show actions regardless of hover state. Useful for accessibility.',
      },
      {
        name: 'editButtonRef',
        type: 'React.RefObject<HTMLButtonElement | null>',
        description:
          'Ref for the edit button, used to return focus after editing.',
      },
    ],
    notes: [
      'User messages show: Copy, Edit, Delete.',
      'Assistant messages show: Copy, Thumbs Up (with confetti), Thumbs Down (with feedback dialog), Regenerate, Delete.',
      'During streaming, only the Stop button is shown for assistant messages.',
      'Thumbs-down opens a FeedbackDialog for optional comment before submitting.',
      'Delete uses a DeleteButton with confirmation dialog to prevent accidental deletion.',
      'Supports full keyboard navigation with arrow keys, Home, End, Tab.',
      'Actions use staggered entrance animations with Framer Motion.',
      'Uses role="toolbar" with aria-label="Message actions" for screen reader support.',
    ],
    sourceFile: 'components/clarity/conversation.tsx',
  },

  // ===========================================================================
  // Message Grouping
  // ===========================================================================
  'Message Grouping': [
    {
      name: 'MessageList',
      description:
        'Composable message list with auto-scrolling, entrance animations, message grouping, time separators, loading skeletons, and screen reader announcements.',
      importPath: '@clarity-chat/react',
      usageCode: `<MessageList
  messages={messages}
  onMessageCopy={(id, content) =>
    navigator.clipboard.writeText(content)
  }
  onMessageFeedback={(id, type, comment) =>
    saveFeedback(id, type, comment)
  }
  onMessageRetry={(id) => retryMessage(id)}
  onEditMessage={(id) => startEditing(id)}
  onRegenerateMessage={(id) => regenerate(id)}
  onDeleteMessage={(id) => deleteMessage(id)}
  enableGrouping={true}
  showTimeSeparators={true}
  isLoading={isLoading}
  emptyState={<EmptyState />}
/>`,
      props: [
        {
          name: 'virtualizationThreshold',
          type: 'number',
          description:
            "Enable virtualization automatically at this threshold (default: 100) Note: Higher than TanStackMessageList (50) due to react-window's higher overhead",
        },
        {
          name: 'messages',
          type: 'Message[]',
          required: true,
          description: 'Array of messages to display.',
          commonlyUsed: true,
        },
        {
          name: 'onMessageCopy',
          type: '(messageId: string, content: string) => void',
          description: 'Callback when a message is copied.',
        },
        {
          name: 'onMessageFeedback',
          type: "(messageId: string, type: 'up' | 'down', comment?: string) => void",
          description: 'Callback for message feedback (thumbs up/down).',
          commonlyUsed: true,
        },
        {
          name: 'onMessageRetry',
          type: '(messageId: string) => void',
          description: 'Callback to retry a message.',
        },
        {
          name: 'onEditMessage',
          type: '(messageId: string) => void',
          description: 'Callback when edit is requested on a message.',
        },
        {
          name: 'onRegenerateMessage',
          type: '(messageId: string) => void',
          description: 'Callback to regenerate an assistant response.',
        },
        {
          name: 'onDeleteMessage',
          type: '(messageId: string) => void',
          description: 'Callback to delete a message.',
        },
        {
          name: 'onStopGeneration',
          type: '() => void',
          description:
            'Callback to stop AI generation (shown during streaming).',
        },
        {
          name: 'editingMessageId',
          type: 'string | null',
          description:
            'ID of the message currently being edited for inline editing.',
        },
        {
          name: 'onSaveEdit',
          type: '(messageId: string, newContent: string) => void',
          description:
            'Callback when an inline edit is saved with message ID and new content.',
        },
        {
          name: 'onCancelEdit',
          type: '(messageId: string) => void',
          description: 'Callback when an inline edit is cancelled.',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description:
            'Show loading skeleton while messages are being fetched.',
          commonlyUsed: true,
        },
        {
          name: 'loadingCount',
          type: 'number',
          default: '3',
          description: 'Number of skeleton messages to show while loading.',
        },
        {
          name: 'emptyState',
          type: 'ReactNode',
          description: 'Custom empty state content when there are no messages.',
          commonlyUsed: true,
        },
        {
          name: 'enableGrouping',
          type: 'boolean',
          default: 'true',
          description:
            'Enable message grouping for consecutive messages from the same sender.',
          commonlyUsed: true,
        },
        {
          name: 'showTimeSeparators',
          type: 'boolean',
          default: 'true',
          description: 'Show time separators between different days.',
          commonlyUsed: true,
        },
        {
          name: 'announceNewMessages',
          type: 'boolean',
          default: 'true',
          description:
            'Announce new messages to screen readers via aria-live region.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class.',
        },
        {
          name: 'id',
          type: 'string',
          description: 'HTML id attribute for skip link targeting.',
        },
        {
          name: 'role',
          type: "'log' | 'feed' | 'list' | 'region'",
          default: '"log"',
          description: 'ARIA role for the message list container.',
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'ARIA label for screen readers.',
        },
        {
          name: 'aria-live',
          type: "'polite' | 'assertive' | 'off'",
          default: '"polite"',
          description: 'ARIA live region behavior.',
        },
        {
          name: 'autoScroll',
          type: 'boolean',
          default: 'true',
          description: 'Enable auto-scroll to bottom on new messages.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'Expects Message objects from @clarity-chat/types with id, role, content, status, and createdAt fields.',
        'Auto-scroll uses smooth scrolling with a 100px threshold.',
        'A jump-to-bottom button with new message count badge appears when scrolled away.',
        'Pressing End key jumps to the bottom of the list.',
        'New messages are announced to screen readers via the A11yProvider announce() function.',
        'Loading skeletons alternate between user and assistant roles.',
        'Throws a ClarityError if messages prop is not an array.',
      ],
      sourceFile: 'components/message/MessageList.tsx',
    },
    {
      name: 'TimeSeparator',
      description:
        'Time/date divider for message lists. Displays a horizontal line with centered text to separate messages by time periods.',
      importPath: '@clarity-chat/react',
      usageCode: `<TimeSeparator>Today</TimeSeparator>
<Message ... />
<Message ... />
<TimeSeparator>Yesterday</TimeSeparator>
<Message ... />`,
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description:
            'The text to display (e.g., "Today", "Yesterday", "Monday").',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Optional CSS class name.',
        },
      ],
      notes: [
        'Uses role="separator" with aria-label="Messages from {children}" for accessibility.',
        'Entrance animation uses a Framer Motion spring slideDown preset.',
        'The text badge uses a frosted glass effect with backdrop-blur-md.',
        'Gradient lines fade from transparent on the outer edges to the border color in the center.',
      ],
      sourceFile: 'components/message/TimeSeparator.tsx',
    },
  ],

  // ===========================================================================
  // Follow-up Suggestions
  // ===========================================================================
  'Follow-up Suggestions': {
    name: 'FollowUpSuggestions',
    description:
      'Displays contextual follow-up suggestion chips after AI responses. Wraps the PromptSuggestions component in a styled container with a sparkles header.',
    importPath: '@clarity-chat/react',
    usageCode: `<FollowUpSuggestions
  showFollowUp={true}
  followUpSuggestions={[
    {
      id: '1',
      text: 'Tell me more about React hooks',
      type: 'follow-up',
    },
    {
      id: '2',
      text: 'Show me a useEffect example',
      type: 'follow-up',
    },
    {
      id: '3',
      text: 'What are custom hooks?',
      type: 'follow-up',
    },
  ]}
  onPromptSelect={(suggestion) =>
    sendMessage(suggestion.text)
  }
/>`,
    props: [
      {
        name: 'showFollowUp',
        type: 'boolean',
        required: true,
        description:
          'Whether to show the follow-up suggestions panel. Returns null when false.',
        commonlyUsed: true,
      },
      {
        name: 'followUpSuggestions',
        type: 'PromptSuggestion[]',
        description:
          'Array of suggestions to display. Each suggestion has id, text, type, and optional label, description, icon, category, confidence, keywords, and usageCount fields.',
        commonlyUsed: true,
      },
      {
        name: 'onPromptSelect',
        type: '(suggestion: PromptSuggestion) => void',
        required: true,
        description: 'Callback when a suggestion is selected by the user.',
        commonlyUsed: true,
      },
    ],
    notes: [
      'Returns null when showFollowUp is false or followUpSuggestions is empty/undefined.',
      'Internally renders a maximum of 3 suggestions using the PromptSuggestions component in "chips" layout.',
      'Uses a slideUp entrance animation with Framer Motion.',
      'The PromptSuggestion type requires at minimum id, text, and type fields.',
    ],
    sourceFile: 'components/chat/FollowUpSuggestions.tsx',
  },
}
