import type { NavItem } from '@/components/Navigation/Sidebar'

export const learnNavigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Quick Start', href: '/learn/quick-start' },
      { title: 'Installation', href: '/learn/installation' },
      { title: 'Tutorial', href: '/learn/tutorial' },
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
      { title: 'Styling', href: '/learn/guides/styling' },
      { title: 'Accessibility', href: '/learn/guides/accessibility' },
      { title: 'Performance', href: '/learn/guides/performance' },
      { title: 'Testing', href: '/learn/guides/testing' },
      { title: 'TypeScript', href: '/learn/guides/typescript' },
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
        ],
      },
    ],
  },
  {
    title: 'Hooks',
    items: [
      { title: 'useChat', href: '/reference/hooks/use-chat' },
      { title: 'useMessages', href: '/reference/hooks/use-messages' },
      { title: 'useTyping', href: '/reference/hooks/use-typing' },
      { title: 'useKeyboardShortcuts', href: '/reference/hooks/use-keyboard-shortcuts' },
      { title: 'useUndoRedo', href: '/reference/hooks/use-undo-redo' },
      { title: 'useHaptic', href: '/reference/hooks/use-haptic' },
      { title: 'useTheme', href: '/reference/hooks/use-theme' },
    ],
  },
  {
    title: 'API',
    items: [
      { title: 'Types', href: '/reference/api/types' },
      { title: 'Utilities', href: '/reference/api/utilities' },
      { title: 'Configuration', href: '/reference/api/configuration' },
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
