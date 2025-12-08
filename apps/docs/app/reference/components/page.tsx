import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Components - Clarity Chat UI',
  description: 'Browse all 70+ React components for building chat interfaces',
}

const componentCategories = [
  {
    title: 'Chat Components',
    description: 'Core components for building chat interfaces',
    components: [
      { name: 'ClarityChat', href: '/reference/components/clarity-chat', description: 'Drop-in ready chat component (recommended)' },
      { name: 'ClarityChatPresets', href: '/reference/components/clarity-chat-presets', description: 'Pre-configured presets for common use cases' },
      { name: 'ChatWindow', href: '/reference/components/chat-window', description: 'Complete chat interface container' },
      { name: 'ChatInput', href: '/reference/components/chat-input', description: 'Message input field' },
      { name: 'AdvancedChatInput', href: '/reference/components/advanced-chat-input', description: 'Input with rich features' },
      { name: 'Message', href: '/reference/components/message', description: 'Individual message display' },
      { name: 'MessageList', href: '/reference/components/message-list', description: 'Scrollable message list' },
      { name: 'VirtualizedMessageList', href: '/reference/components/virtualized-message-list', description: 'Optimized for large lists' },
      { name: 'StreamingMessage', href: '/reference/components/streaming-message', description: 'Real-time streaming messages' },
      { name: 'ThinkingIndicator', href: '/reference/components/thinking-indicator', description: 'AI thinking animation' },
    ],
  },
  {
    title: 'UI Components',
    description: 'Essential interface elements',
    components: [
      { name: 'Button', href: '/reference/components/button', description: 'Versatile button component' },
      { name: 'Badge', href: '/reference/components/badge', description: 'Status and labels' },
      { name: 'Avatar', href: '/reference/components/avatar', description: 'User avatars' },
      { name: 'Tooltip', href: '/reference/components/tooltip', description: 'Contextual hints' },
      { name: 'Toast', href: '/reference/components/toast', description: 'Notifications' },
      { name: 'Drawer', href: '/reference/components/drawer', description: 'Slide-out panels' },
      { name: 'Popover', href: '/reference/components/popover', description: 'Floating content' },
      { name: 'Progress', href: '/reference/components/progress', description: 'Progress indicators' },
      { name: 'Skeleton', href: '/reference/components/skeleton', description: 'Loading placeholders' },
    ],
  },
  {
    title: 'Interactive Components',
    description: 'Advanced interaction patterns',
    components: [
      { name: 'CommandPalette', href: '/reference/components/command-palette', description: 'Keyboard-driven commands' },
      { name: 'ContextMenu', href: '/reference/components/context-menu', description: 'Right-click menus' },
      { name: 'Draggable', href: '/reference/components/draggable', description: 'Drag and drop' },
      { name: 'FileUpload', href: '/reference/components/file-upload', description: 'File upload widget' },
      { name: 'VoiceInput', href: '/reference/components/voice-input', description: 'Speech-to-text' },
      { name: 'CopyButton', href: '/reference/components/copy-button', description: 'Copy to clipboard' },
      { name: 'RetryButton', href: '/reference/components/retry-button', description: 'Retry actions' },
    ],
  },
    {
      title: 'Content Components',
      description: 'Rich content display',
      components: [
        { name: 'CitationCard', href: '/reference/components/citation-card', description: 'Source citations' },
        { name: 'LinkPreview', href: '/reference/components/link-preview', description: 'Rich link previews' },
        { name: 'ContextCard', href: '/reference/components/context-card', description: 'Context information' },
        { name: 'CollapsibleSection', href: '/reference/components/collapsible-section', description: 'Expandable content' },
        { name: 'InteractiveCard', href: '/reference/components/interactive-card', description: 'Interactive cards' },
        { name: 'MarkdownRendererEnhanced', href: '/reference/components/markdown-renderer-enhanced', description: 'Markdown with LaTeX + syntax highlighting' },
        { name: 'EmptyState', href: '/reference/components/empty-state', description: 'Empty state messages' },
      ],
    },
    {
      title: 'AI & Advanced',
      description: 'AI-specific components',
      components: [
        { name: 'AgentRunFeed', href: '/reference/components/agent-run-feed', description: 'Agent execution display' },
        { name: 'ToolInvocationCard', href: '/reference/components/tool-invocation-card', description: 'Tool call display' },
        { name: 'FollowUpSuggestions', href: '/reference/components/follow-up-suggestions', description: 'Suggested prompts' },
        { name: 'PersonaPanel', href: '/reference/components/persona-panel', description: 'AI persona selector' },
        { name: 'PromptLibrary', href: '/reference/components/prompt-library', description: 'Template prompts' },
        { name: 'ModelSelector', href: '/reference/components/model-selector', description: 'AI model picker' },
        { name: 'ConversationBranchVisualizer', href: '/reference/components/conversation-branch-visualizer', description: 'Claude-style branching explorer' },
        { name: 'TokenCounter', href: '/reference/components/token-counter', description: 'Token usage display' },
      ],
    },
  {
    title: 'Layout & Navigation',
    description: 'Structure and navigation',
    components: [
      { name: 'ConversationList', href: '/reference/components/conversation-list', description: 'Conversation sidebar' },
      { name: 'ProjectSidebar', href: '/reference/components/project-sidebar', description: 'Project navigation' },
      { name: 'SettingsPanel', href: '/reference/components/settings-panel', description: 'Settings interface' },
      { name: 'ExportDialog', href: '/reference/components/export-dialog', description: 'Export conversations' },
      { name: 'NetworkStatus', href: '/reference/components/network-status', description: 'Connection status' },
    ],
  },
  {
    title: 'Theming',
    description: 'Theme customization',
    components: [
      { name: 'ThemeSwitcher', href: '/reference/components/theme-switcher', description: 'Theme toggle' },
      { name: 'ThemeSelector', href: '/reference/components/theme-selector', description: 'Theme picker' },
      { name: 'ThemePreview', href: '/reference/components/theme-preview', description: 'Theme preview' },
    ],
  },
]

export default function ComponentsPage() {
  const totalComponents = componentCategories.reduce(
    (sum, category) => sum + category.components.length,
    0
  )

  return (
    <div className="container-docs py-12">
      <div className="max-w-6xl">
        <div className="mb-12">
          <span className="docs-badge mb-4">Components</span>
          <h1 className="text-5xl font-bold mb-6">Component Library</h1>
          <p className="text-xl text-text-secondary mb-4">
            Browse {totalComponents}+ production-ready React components for building beautiful chat interfaces.
            Each component is fully typed, accessible, and customizable.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/examples"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              View Examples
            </Link>
            <Link
              href="/learn/quick-start"
              className="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary text-text-primary border-2 border-border rounded-lg font-semibold transition-colors"
            >
              Quick Start Guide
            </Link>
          </div>
        </div>

        <div className="space-y-12">
          {componentCategories.map((category) => (
            <div key={category.title}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
                <p className="text-text-secondary">{category.description}</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.components.map((component) => (
                  <Link
                    key={component.href}
                    href={component.href}
                    className="group p-5 rounded-xl border-2 border-border hover:border-brand-500 bg-bg-primary hover:shadow-lg transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold mb-2 text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                      {component.name}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {component.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border-2 border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-text-secondary mb-6">
            We're constantly adding new components. Check out our roadmap or request a feature on GitHub.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="https://github.com/clarity-chat/ui/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Request a Component
            </Link>
            <Link
              href="/reference/hooks"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-text-primary border-2 border-border rounded-lg font-semibold transition-colors"
            >
              View Hooks →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

