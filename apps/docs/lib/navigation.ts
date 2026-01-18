import type { NavItem } from '@/components/Navigation/Sidebar'

// Combined Examples & Demos navigation
export const examplesNavigation: NavItem[] = [
  {
    title: 'Interactive Demos',
    items: [
      { title: '🚀 All Demos & Examples', href: '/examples' },
      { title: '⚡ Zero to Chat', href: '/demos/zero-to-chat' },
      { title: '▶️ Streaming States', href: '/demos/streaming-states' },
      { title: '📊 Token Visualizer', href: '/demos/token-visualizer' },
      { title: '🎨 Customization Playground', href: '/demos/customization-playground' },
      { title: '🔧 Tool Calling / Agents', href: '/demos/tool-calling' },
    ],
  },
  {
    title: 'Basic Examples',
    items: [
      { title: 'Simple Chat', href: '/examples/simple-chat' },
      { title: 'Themed Chat', href: '/examples/themed-chat' },
      { title: 'Custom Styling', href: '/examples/custom-styling' },
      { title: 'Streaming', href: '/examples/streaming' },
    ],
  },
  {
    title: 'Advanced Examples',
    items: [
      { title: 'Multi-user Chat', href: '/examples/multi-user-chat' },
      { title: 'Conversation Branching', href: '/examples/conversation-branching' },
      { title: 'Tool Calling Showcase', href: '/examples/tool-calling-showcase' },
      { title: 'Virtualized Chat', href: '/examples/virtualized-chat' },
      { title: 'AI Agents Workflow', href: '/examples/ai-agents-workflow' },
      { title: 'Model Switching', href: '/examples/model-switching' },
    ],
  },
  {
    title: 'Industry Examples',
    items: [
      { title: 'Healthcare Assistant', href: '/examples/healthcare-assistant' },
      { title: 'Financial Advisor', href: '/examples/financial-advisor' },
      { title: 'Token Optimization', href: '/examples/token-optimization' },
    ],
  },
]

// Keep demosNavigation for backwards compatibility
export const demosNavigation: NavItem[] = examplesNavigation

// Consolidated Learn navigation (includes guides)
export const learnNavigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Quick Start', href: '/learn/quick-start' },
      { title: 'Installation', href: '/learn/installation' },
      { title: 'Tutorial', href: '/learn/tutorial' },
      { title: '🎮 Interactive Playground', href: '/playground' },
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
      { title: 'Streaming', href: '/guides/streaming' },
      { title: 'Memory', href: '/guides/memory' },
      { title: 'Error Handling', href: '/guides/error-handling' },
      { title: 'State Management', href: '/guides/state-management' },
      { title: 'Accessibility', href: '/guides/accessibility' },
      { title: 'Performance', href: '/guides/performance' },
      { title: 'Testing', href: '/learn/guides/testing' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'RAG', href: '/guides/rag' },
      { title: 'Agents', href: '/guides/agents' },
      { title: 'Token Optimization', href: '/guides/token-optimization' },
      { title: 'Model Adapters', href: '/guides/model-adapters' },
      { title: 'Plugins', href: '/guides/plugins' },
      { title: 'Architecture', href: '/learn/architecture' },
    ],
  },
  {
    title: 'Enterprise',
    items: [
      { title: 'RBAC', href: '/guides/rbac' },
      { title: 'Multi-Tenancy', href: '/guides/multi-tenancy' },
      { title: 'SSO Configuration', href: '/guides/sso-configuration' },
      { title: 'Security', href: '/guides/security' },
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
    title: 'Help',
    items: [
      { title: 'FAQ', href: '/learn/faq' },
      { title: 'Troubleshooting', href: '/learn/troubleshooting' },
      { title: 'Migration from Vercel AI', href: '/learn/migration/from-vercel-ai-sdk' },
    ],
  },
]

export const referenceNavigation: NavItem[] = [
  {
    title: 'Core Components',
    items: [
      { title: 'ClarityChat', href: '/reference/components/clarity-chat' },
      { title: 'ClarityChatPresets', href: '/reference/components/clarity-chat-presets' },
      { title: 'ChatWindow', href: '/reference/components/chat-window' },
      { title: 'Message', href: '/reference/components/message' },
      { title: 'MessageList', href: '/reference/components/message-list' },
      { title: 'ChatInput', href: '/reference/components/chat-input' },
      { title: 'TypingIndicator', href: '/reference/components/typing-indicator' },
    ],
  },
  {
    title: 'Streaming Components',
    items: [
      { title: 'StreamingMessage', href: '/reference/components/streaming-message' },
      { title: 'VirtualizedMessageList', href: '/reference/components/virtualized-message-list' },
      { title: 'StreamingTextRenderer', href: '/reference/components/streaming-text-renderer' },
    ],
  },
  {
    title: 'AI Components',
    items: [
      { title: 'ChainOfThought', href: '/reference/components/chain-of-thought' },
      { title: 'ThinkingBar', href: '/reference/components/thinking-bar' },
      { title: 'ToolExecutionCard', href: '/reference/components/tool-execution-card' },
      { title: 'SourceCitation', href: '/reference/components/source-citation' },
      { title: 'SuggestionCards', href: '/reference/components/suggestion-cards' },
    ],
  },
  {
    title: 'UI Elements',
    items: [
      { title: 'Avatar', href: '/reference/components/avatar' },
      { title: 'Button', href: '/reference/components/button' },
      { title: 'Badge', href: '/reference/components/badge' },
      { title: 'CodeBlock', href: '/reference/components/code-block' },
      { title: 'Tooltip', href: '/reference/components/tooltip' },
    ],
  },
  {
    title: 'Interactive Components',
    items: [
      { title: 'CommandPalette', href: '/reference/components/command-palette' },
      { title: 'ContextMenu', href: '/reference/components/context-menu' },
      { title: 'FileUpload', href: '/reference/components/file-upload' },
      { title: 'VoiceInput', href: '/reference/components/voice-input' },
    ],
  },
  {
    title: 'Hooks',
    items: [
      { title: 'useClarityChat', href: '/reference/hooks/use-clarity-chat' },
      { title: 'useClarityChatWithTools', href: '/reference/hooks/use-clarity-chat-with-tools' },
      { title: 'useChat', href: '/reference/hooks/use-chat' },
      { title: 'useStreaming', href: '/reference/hooks/use-streaming' },
      { title: 'useTokenOptimization', href: '/reference/hooks/use-token-optimization' },
      { title: 'usePerformance', href: '/reference/hooks/use-performance' },
      { title: 'All Hooks →', href: '/reference/hooks' },
    ],
  },
]

export const cookbookNavigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Quick Start (3 Lines)', href: '/cookbook/quick-start-3-lines' },
      { title: 'Streaming Setup', href: '/cookbook/streaming-setup' },
      { title: 'Custom Theming', href: '/cookbook/custom-theming' },
    ],
  },
  {
    title: 'Common Patterns',
    items: [
      { title: 'Error Handling', href: '/cookbook/error-handling' },
      { title: 'Authentication', href: '/cookbook/authentication' },
      { title: 'Multi-Modal Chat', href: '/cookbook/multi-modal-chat' },
      { title: 'Voice Input', href: '/cookbook/voice-input' },
    ],
  },
  {
    title: 'Advanced Patterns',
    items: [
      { title: 'RAG Document Chat', href: '/cookbook/rag-document-chat' },
      { title: 'Agent with Tools', href: '/cookbook/agent-with-tools' },
      { title: 'Multi-Agent Orchestration', href: '/cookbook/multi-agent-orchestration' },
      { title: 'Conversation Branching', href: '/cookbook/conversation-branching' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { title: 'Next.js Integration', href: '/cookbook/nextjs-integration' },
      { title: 'Remix Integration', href: '/cookbook/remix-integration' },
      { title: 'Vite Integration', href: '/cookbook/vite-integration' },
    ],
  },
]
