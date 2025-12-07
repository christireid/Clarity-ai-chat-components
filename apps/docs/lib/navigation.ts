import type { NavItem } from '@/components/Navigation/Sidebar'

export const learnNavigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Quick Start', href: '/learn/quick-start' },
      { title: 'Installation', href: '/learn/installation' },
      { title: 'Tutorial', href: '/learn/tutorial' },
      { title: '🎮 Interactive Playground', href: '/playground' },
      { title: 'Playground Guide', href: '/playground/guide' },
    ],
  },
  {
    title: 'Tutorials',
    items: [
      { title: 'Building Your First Chatbot', href: '/learn/tutorials/building-first-chatbot' },
      { title: 'Adding RAG', href: '/learn/tutorials/adding-rag' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Components', href: '/learn/concepts/components' },
      { title: 'Hooks', href: '/learn/concepts/hooks' },
      { title: 'Theming', href: '/learn/concepts/theming' },
      { title: 'Animations', href: '/learn/concepts/animations' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Installation', href: '/guides/installation' },
      { title: 'Getting Started', href: '/guides/getting-started' },
      { title: 'Components', href: '/guides/components' },
      { title: 'Hooks', href: '/guides/hooks' },
      { title: 'Theming', href: '/guides/theming' },
      { title: 'Customization', href: '/guides/customization' },
      { title: 'Error Handling', href: '/guides/error-handling' },
      { title: 'Memory', href: '/guides/memory' },
      { title: 'Messages', href: '/guides/messages' },
      { title: 'Message Operations', href: '/guides/message-operations' },
      { title: 'File Upload', href: '/guides/file-upload' },
      { title: 'Streaming', href: '/guides/streaming' },
      { title: 'Token Optimization', href: '/guides/token-optimization' },
      { title: 'Accessibility', href: '/guides/accessibility' },
      { title: 'Performance', href: '/guides/performance' },
      { title: 'RAG', href: '/guides/rag' },
      { title: 'Agents', href: '/guides/agents' },
      { title: 'Plugins', href: '/guides/plugins' },
      { title: 'Prompts', href: '/guides/prompts' },
      { title: 'Model Adapters', href: '/guides/model-adapters' },
      { title: 'Migration', href: '/guides/migration' },
      { title: 'Observability', href: '/guides/observability' },
      { title: 'Safety', href: '/guides/safety' },
      { title: 'Webhooks', href: '/guides/webhooks' },
      { title: 'RBAC', href: '/guides/rbac' },
      { title: 'Multi-Tenancy', href: '/guides/multi-tenancy' },
      { title: 'Usage Quotas', href: '/guides/usage-quotas' },
      { title: 'Audit Logging', href: '/guides/audit-logging' },
      { title: 'Reranking', href: '/guides/reranking' },
      { title: 'Interactive', href: '/guides/interactive' },
      { title: 'Tutorials', href: '/guides/tutorials' },
    ],
  },
  {
    title: 'Deployment',
    items: [
      { title: 'Deploy to Vercel', href: '/learn/deployment/vercel' },
      { title: 'Deploy to AWS', href: '/learn/deployment/aws' },
      { title: 'Docker Deployment', href: '/learn/deployment/docker' },
    ],
  },
  {
    title: 'Migration',
    items: [
      { title: 'From Vercel AI SDK', href: '/learn/migration/from-vercel-ai-sdk' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'Architecture', href: '/learn/architecture' },
    ],
  },
  {
    title: 'Help',
    items: [
      { title: 'Troubleshooting', href: '/learn/troubleshooting' },
    ],
  },
]

export const referenceNavigation: NavItem[] = [
  {
    title: 'Components',
    items: [
      {
        title: 'Core',
        items: [
          { title: 'ClarityChat', href: '/reference/components/clarity-chat' },
          { title: 'ChatWindow', href: '/reference/components/chat-window' },
          { title: 'Message', href: '/reference/components/message' },
          { title: 'MessageList', href: '/reference/components/message-list' },
          { title: 'MessageInput', href: '/reference/components/message-input' },
          { title: 'TypingIndicator', href: '/reference/components/typing-indicator' },
        ],
      },
      {
        title: 'Interactive',
        items: [
          { title: 'CommandPalette', href: '/reference/components/command-palette' },
          { title: 'ContextMenu', href: '/reference/components/context-menu' },
          { title: 'Draggable', href: '/reference/components/draggable' },
          { title: 'KeyboardHint', href: '/reference/components/keyboard-hint' },
          { title: 'AdvancedMessageSearch', href: '/reference/components/advanced-message-search' },
          { title: 'RetryButton', href: '/reference/components/retry-button' },
          { title: 'VoiceInput', href: '/reference/components/voice-input' },
          { title: 'FileUpload', href: '/reference/components/file-upload' },
          { title: 'StructuredInputBuilder', href: '/reference/components/structured-input-builder' },
        ],
      },
      {
        title: 'Streaming',
        items: [
          { title: 'StreamingMessage', href: '/reference/components/streaming-message' },
          { title: 'VirtualizedMessageList', href: '/reference/components/virtualized-message-list' },
        ],
      },
      {
        title: 'UI Elements',
        items: [
          { title: 'Avatar', href: '/reference/components/avatar' },
          { title: 'Button', href: '/reference/components/button' },
          { title: 'Badge', href: '/reference/components/badge' },
          { title: 'Tooltip', href: '/reference/components/tooltip' },
          { title: 'Modal', href: '/reference/components/modal' },
          { title: 'NetworkStatus', href: '/reference/components/network-status' },
          { title: 'PromptLibrary', href: '/reference/components/prompt-library' },
          { title: 'PromptSuggestions', href: '/reference/components/prompt-suggestions' },
          { title: 'StreamingTextRenderer', href: '/reference/components/streaming-text-renderer' },
          { title: 'StreamBlock', href: '/reference/components/stream-block' },
          { title: 'StreamCancellation', href: '/reference/components/stream-cancellation' },
          { title: 'ToolInvocationCard', href: '/reference/components/tool-invocation-card' },
        ],
      },
      {
        title: 'Optimization',
        items: [
          { title: 'TokenOptimizationBadge', href: '/reference/components/token-optimization-badge' },
          { title: 'TokenOptimizationPanel', href: '/reference/components/token-optimization-panel' },
          { title: 'TokenOptimizationDashboard', href: '/reference/components/token-optimization-dashboard' },
        ],
      },
      {
        title: 'Operations',
        items: [
          { title: 'UsageDashboard', href: '/reference/components/usage-dashboard' },
          { title: 'PerformanceDashboard', href: '/reference/components/performance-dashboard' },
          { title: 'ProjectSidebar', href: '/reference/components/project-sidebar' },
        ],
      },
      {
        title: 'Enterprise',
        items: [
          { title: 'AuthTenantDashboard', href: '/reference/components/auth-tenant-dashboard' },
          { title: 'ApiTokenManager', href: '/reference/components/api-token-manager' },
          { title: 'SeatInviteDialog', href: '/reference/components/seat-invite-dialog' },
          { title: 'SSOConfigWizard', href: '/reference/components/sso-config-wizard' },
        ],
      },
    ],
  },
  {
    title: 'Hooks',
    items: [
      { title: 'useClarityChat', href: '/reference/hooks/use-clarity-chat' },
      { title: 'useChatHandlers', href: '/reference/hooks/use-chat-handlers' },
      { title: 'useChatEnhanced', href: '/reference/hooks/use-chat-enhanced' },
      { title: 'useAssistant', href: '/reference/hooks/use-assistant' },
      { title: 'useCompletion', href: '/reference/hooks/use-completion' },
      { title: 'useChat', href: '/reference/hooks/use-chat' },
      { title: 'useMessages', href: '/reference/hooks/use-messages' },
      { title: 'useTyping', href: '/reference/hooks/use-typing' },
      { title: 'useKeyboardShortcuts', href: '/reference/hooks/use-keyboard-shortcuts' },
      { title: 'useUndoRedo', href: '/reference/hooks/use-undo-redo' },
      { title: 'useHaptic', href: '/reference/hooks/use-haptic' },
      { title: 'useTheme', href: '/reference/hooks/use-theme' },
      { title: 'useTokenOptimization', href: '/reference/hooks/use-token-optimization' },
      { title: 'useModelRouter', href: '/reference/hooks/use-model-router' },
      { title: 'usePerformance', href: '/reference/hooks/use-performance' },
      { title: 'useTokenTracker', href: '/reference/hooks/use-token-tracker' },
      { title: 'useStreamingSSE', href: '/reference/hooks/use-streaming-sse' },
      { title: 'useStreamingWebSocket', href: '/reference/hooks/use-streaming-websocket' },
      { title: 'useStreamableUI', href: '/reference/hooks/use-streamable-ui' },
    ],
  },
  {
    title: 'API',
    items: [
      { title: 'Types', href: '/reference/api/types' },
      { title: 'Utilities', href: '/reference/utilities' },
      { title: 'Configuration', href: '/reference/api/configuration' },
    ],
  },
]

export const cookbookNavigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: '3-Line Quick Start', href: '/cookbook/quick-start-3-lines' },
      { title: 'Memory Integration', href: '/cookbook/memory-integration' },
      { title: 'Streaming Setup', href: '/cookbook/streaming-setup' },
      { title: 'Error Handling', href: '/cookbook/error-handling' },
      { title: 'Multi-Modal Chat', href: '/cookbook/multi-modal-chat' },
      { title: 'OpenAI Streaming Chat', href: '/cookbook/openai-streaming-chat' },
      { title: 'Next.js Integration', href: '/cookbook/nextjs-integration' },
      { title: 'Custom Theming', href: '/cookbook/custom-theming' },
    ],
  },
  {
    title: 'Advanced Patterns',
    items: [
      { title: 'Streaming with Memory', href: '/cookbook/streaming-with-memory' },
      { title: 'RAG Document Chat', href: '/cookbook/rag-document-chat' },
      { title: 'Multi-Modal Chat', href: '/cookbook/multi-modal-chat' },
      { title: 'Agent with Tools', href: '/cookbook/agent-with-tools' },
      { title: 'Advanced Agent Workflow', href: '/cookbook/advanced-agent-workflow' },
    ],
  },
  {
    title: 'Production',
    items: [
      { title: 'Error Handling', href: '/cookbook/error-handling' },
      { title: 'Authentication', href: '/cookbook/authentication' },
      { title: 'Analytics Tracking', href: '/cookbook/analytics-tracking' },
      { title: 'Production Monitoring', href: '/cookbook/production-monitoring' },
    ],
  },
  {
    title: 'Enterprise',
    items: [
      { title: 'Enterprise SSO Setup', href: '/cookbook/enterprise-sso-setup' },
    ],
  },
]

export const examplesNavigation: NavItem[] = [
  {
    title: 'Basic',
    items: [
      { title: 'Simple Chat', href: '/examples/simple-chat' },
      { title: 'Themed Chat', href: '/examples/themed-chat' },
      { title: 'Custom Styling', href: '/examples/custom-styling' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'Multi-user Chat', href: '/examples/multi-user' },
      { title: 'File Sharing', href: '/examples/file-sharing' },
      { title: 'Real-time Updates', href: '/examples/realtime' },
      { title: 'Custom Commands', href: '/examples/custom-commands' },
      { title: 'Token Optimization', href: '/examples/token-optimization' },
    ],
  },
  {
    title: 'Patterns',
    items: [
      { title: 'Command Palette', href: '/examples/command-palette' },
      { title: 'Drag & Drop', href: '/examples/drag-drop' },
      { title: 'Context Menus', href: '/examples/context-menus' },
      { title: 'Keyboard Shortcuts', href: '/examples/keyboard-shortcuts' },
    ],
  },
]
