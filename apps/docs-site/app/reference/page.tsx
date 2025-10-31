import { Metadata } from 'next'
import Link from 'next/link'
import { Box, Anchor, Code, Palette } from 'lucide-react'

export const metadata: Metadata = {
  title: 'API Reference',
  description: 'Complete API documentation for Clarity Chat UI',
}

const sections = [
  {
    title: 'Components',
    icon: Box,
    description: 'Complete reference for all UI components',
    items: [
      { title: 'ChatWindow', href: '/reference/components/chat-window', description: 'Main chat container' },
      { title: 'Message', href: '/reference/components/message', description: 'Individual message display' },
      { title: 'MessageList', href: '/reference/components/message-list', description: 'Scrollable message list' },
      { title: 'MessageInput', href: '/reference/components/message-input', description: 'Message input field' },
      { title: 'TypingIndicator', href: '/reference/components/typing-indicator', description: 'Typing animation' },
      { title: 'CommandPalette', href: '/reference/components/command-palette', description: 'Keyboard-driven commands' },
      { title: 'ContextMenu', href: '/reference/components/context-menu', description: 'Right-click menus' },
      { title: 'Draggable', href: '/reference/components/draggable', description: 'Drag and drop system' },
    ],
  },
  {
    title: 'Hooks',
    icon: Anchor,
    description: 'React hooks for state management and utilities',
    items: [
      { title: 'useChat', href: '/reference/hooks/use-chat', description: 'Manage chat state' },
      { title: 'useMessages', href: '/reference/hooks/use-messages', description: 'Handle message operations' },
      { title: 'useTyping', href: '/reference/hooks/use-typing', description: 'Typing indicator state' },
      { title: 'useKeyboardShortcuts', href: '/reference/hooks/use-keyboard-shortcuts', description: 'Keyboard bindings' },
      { title: 'useUndoRedo', href: '/reference/hooks/use-undo-redo', description: 'History management' },
      { title: 'useHaptic', href: '/reference/hooks/use-haptic', description: 'Haptic feedback' },
      { title: 'useTheme', href: '/reference/hooks/use-theme', description: 'Theme management' },
    ],
  },
  {
    title: 'API Reference',
    icon: Code,
    description: 'Types, interfaces, and utilities',
    items: [
      { title: 'Types', href: '/reference/api/types', description: 'TypeScript type definitions' },
      { title: 'Utilities', href: '/reference/api/utilities', description: 'Helper functions' },
      { title: 'Configuration', href: '/reference/api/configuration', description: 'Config options' },
    ],
  },
  {
    title: 'Theming',
    icon: Palette,
    description: 'Customize colors and styles',
    items: [
      { title: 'Theme Configuration', href: '/learn/concepts/theming', description: 'Create custom themes' },
      { title: 'CSS Variables', href: '/learn/guides/styling', description: 'Available CSS variables' },
    ],
  },
]

export default function ReferencePage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">API Reference</h1>
        <p className="text-xl text-text-secondary mb-12">
          Comprehensive documentation for every component, hook, and utility in Clarity Chat UI.
        </p>

        <div className="grid gap-8">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div
                key={section.title}
                className="border border-border rounded-xl p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                    <p className="text-text-secondary">{section.description}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group p-4 rounded-lg border border-border hover:border-brand-500 hover:bg-bg-secondary transition-all"
                    >
                      <div className="font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-1">
                        {item.title}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Interactive Examples</h2>
          <p className="text-text-secondary mb-6">
            Want to see these components in action? Check out our interactive examples and live playground.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/examples"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              View Examples
            </Link>
            <Link
              href="https://storybook.clarity-chat.dev"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Open Storybook
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
